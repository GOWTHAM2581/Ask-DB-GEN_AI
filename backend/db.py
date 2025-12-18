from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel

class DBConnection(BaseModel):
    host: str
    port: int
    user: str
    password: str
    database: str

def get_db_url(creds: DBConnection) -> str:
    return f"mysql+pymysql://{creds.user}:{creds.password}@{creds.host}:{creds.port}/{creds.database}"

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
