from sqlalchemy import text
from typing import Tuple, Optional
from db import get_engine_for_creds, DBConnection

class ExplainGuard:
    @staticmethod
    def check_query_safety(creds: DBConnection, query: str) -> Tuple[bool, Optional[str]]:
        """
        Runs EXPLAIN on the query.
        Returns (is_safe, error_message).
        """
        engine = get_engine_for_creds(creds)
        
        try:
            with engine.connect() as conn:
                # Run EXPLAIN
                explain_sql = f"EXPLAIN {query}"
                conn.execute(text(explain_sql))
                return True, None
        except Exception as e:
            return False, f"Query failed validation: {str(e)}"
