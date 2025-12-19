from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from typing import Optional
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

class DBConnection(BaseModel):
    host: str
    port: int
    user: str
    password: str
    database: str
    ssl_mode: Optional[str] = "REQUIRED"

def get_db_url(creds: DBConnection) -> str:
    url = f"mysql+pymysql://{creds.user}:{creds.password}@{creds.host}:{creds.port}/{creds.database}"
    if creds.ssl_mode == "REQUIRED":
        # For Aiven and similar, we often need to append SSL params
        url += "?ssl_ca=ca.pem" if os.path.exists("ca.pem") else ""
    return url

def get_direct_mysql_connection():
    """
    Returns a raw mysql-connector connection using environment variables.
    As requested by the user.
    """
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT", 3306)),
            ssl_ca="ca.pem" if os.path.exists("backend/ca.pem") or os.path.exists("ca.pem") else None,
            ssl_verify_cert=True if os.path.exists("ca.pem") else False
        )
        return conn
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def get_engine_for_creds(creds: DBConnection):
    try:
        url = get_db_url(creds)
        # Pool recycle 3600 to avoid stale connections
        engine = create_engine(url, pool_recycle=3600, pool_pre_ping=True)
        return engine
    except Exception as e:
        raise ValueError(f"Failed to create engine: {str(e)}")

def test_connection(creds: DBConnection) -> bool:
    try:
        engine = get_engine_for_creds(creds)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        raise ValueError(f"Connection failed: {str(e)}")

def get_schema_summary(creds: DBConnection) -> str:
    """Returns a simplified schema string for the LLM"""
    engine = get_engine_for_creds(creds)
    inspector = inspect(engine)
    
    schema_str = ""
    
    for table_name in inspector.get_table_names():
        schema_str += f"Table: {table_name}\nColumns:\n"
        columns = inspector.get_columns(table_name)
        for col in columns:
            col_info = f" - {col['name']} ({col['type']})"
            schema_str += f"{col_info}\n"
        schema_str += "\n"
        
    return schema_str
