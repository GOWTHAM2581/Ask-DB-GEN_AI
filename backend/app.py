import time
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from typing import List, Dict, Any, Optional

from logger import app_logger
from rate_limit import rate_limiter
from auth import Token, create_access_token, get_current_user, get_password_hash, verify_password
from db import DBConnection, test_connection, get_schema_summary, get_engine_for_creds
from llm import generate_sql
from sql_guard import SQLGuard
from explain_guard import ExplainGuard
from crypto_utils import encrypt_data, decrypt_data

app = FastAPI(title="Ask Your Database API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, lock this down
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

class LoginRequest(BaseModel):
    username: str
    password: str

class ConnectRequest(BaseModel):
    host: str
    port: int
    user: str
    password: str
    database: str

class QueryRequest(BaseModel):
    db_token: str
    prompt: str

class QueryResponse(BaseModel):
    sql: str
    results: List[Dict[str, Any]]
    column_names: List[str]
    execution_time_ms: float

# --- Routes ---

@app.post("/auth/login", response_model=Token)
async def login(form_data: LoginRequest):
    # Mock user database
    # In a real app, verify against DB
    if form_data.username == "admin" and form_data.password == "admin":
        access_token_expires = 30 # minutes
        access_token = create_access_token(
            data={"sub": form_data.username}
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Generic mock for assessment purposes: Any email works if password is 'password'
    if form_data.password == "password":
         access_token = create_access_token(
            data={"sub": form_data.username}
        )
         return {"access_token": access_token, "token_type": "bearer"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password (try user/password)",
        headers={"WWW-Authenticate": "Bearer"},
    )

@app.post("/db/connect")
async def connect_database(creds: ConnectRequest, current_user: str = Depends(get_current_user)):
    """
    Validates connection and returns an encrypted token containing the credentials.
    """
    try:
        # Validate connection
        db_creds = DBConnection(**creds.dict())
        test_connection(db_creds)
        
        # Encrypt credentials to return to client (Stateless)
        db_token = encrypt_data(creds.dict())
        
        return {"status": "connected", "db_token": db_token}
    except Exception as e:
        app_logger.error(f"Connection failed for user {current_user}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/query/ask", response_model=QueryResponse)
async def ask_database(
    request: QueryRequest, 
    current_user: str = Depends(get_current_user)
):
    try:
        start_time = time.time()
        
        # 1. Rate Limit
        rate_limiter.check_rate_limit(current_user)
        
        # 2. Decrypt Credentials
        try:
            creds_dict = decrypt_data(request.db_token)
            creds = DBConnection(**creds_dict)
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid database session. Please reconnect.")

        # 3. Get Schema (Optimized: In prod, cache this. Here we fetch to ensure accuracy)
        try:
            schema_summary = get_schema_summary(creds)
        except Exception as e:
             raise HTTPException(status_code=400, detail=f"Failed to fetch schema: {str(e)}")

        # 4. LLM Generation
        generated_sql = generate_sql(schema_summary, request.prompt)
        
        if "INVALID_QUERY" in generated_sql:
             raise HTTPException(status_code=400, detail="Cannot answer this question with the available schema or request is unsafe.")

        app_logger.info("Generated SQL", extra={"user_id": current_user, "sql": generated_sql})

        # 5. SQL Validation (Static)
        try:
            clean_sql = SQLGuard.validate_query(generated_sql)
        except ValueError as ve:
             app_logger.warning(f"SQL Guard blocked query: {str(ve)}")
             raise HTTPException(status_code=400, detail=f"Safety violation: {str(ve)}")

        # 6. Deep Validation (EXPLAIN)
        is_safe, explain_error = ExplainGuard.check_query_safety(creds, clean_sql)
        if not is_safe:
             app_logger.warning(f"Explain Guard blocked query: {explain_error}")
             raise HTTPException(status_code=400, detail="Query failed safety check (EXPLAIN analysis)")

        # 7. Execution
        engine = get_engine_for_creds(creds)
        try:
            with engine.connect() as conn:
                result = conn.execute(text(clean_sql))
                rows = [dict(row._mapping) for row in result]
                column_names = list(result.keys())
                
        except Exception as e:
             app_logger.error(f"Execution error: {str(e)}")
             raise HTTPException(status_code=500, detail=f"Database execution error: {str(e)}")

        end_time = time.time()
        duration = round((end_time - start_time) * 1000, 2)
        
        # Log success
        app_logger.info(
            "Query Success", 
            extra={
                "user_id": current_user, 
                "query": clean_sql, 
                "row_count": len(rows),
                "duration_ms": duration
            }
        )

        return {
            "sql": clean_sql,
            "results": rows,
            "column_names": column_names,
            "execution_time_ms": duration
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        app_logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
