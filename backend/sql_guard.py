import sqlparse
import re

class SQLGuard:
    FORBIDDEN_KEYWORDS = {
        'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE', 
        'GRANT', 'REVOKE', 'CREATE', 'REPLACE', 'UPSCALE'
    }

    @staticmethod
    def validate_query(sql: str) -> str:
        """
        Validates and sanitizes the SQL query. 
        Returns the sanitized SQL if valid, or raises ValueError.
        """
        if not sql or not sql.strip():
            raise ValueError("Empty SQL query")

        # 1. Parse SQL
        parsed = sqlparse.parse(sql)
        if len(parsed) > 1:
            raise ValueError("Multiple SQL statements are not allowed")
        
        statement = parsed[0]
        
        # 2. Check statement type (MUST be SELECT)
        if statement.get_type().upper() != 'SELECT':
            raise ValueError(f"Only SELECT queries are allowed. Found: {statement.get_type()}")

        # 3. Check for forbidden keywords in the raw string to be safe
        # (Though parser check is good, a regex catch-all provides depth defense)
        normalized_sql = sql.upper()
        for keyword in SQLGuard.FORBIDDEN_KEYWORDS:
            # We look for word boundaries to avoid matching substrings (e.e. UPDATE_DATE column)
            if re.search(r'\b' + keyword + r'\b', normalized_sql):
                raise ValueError(f"Forbidden keyword detected: {keyword}")

        # 4. Enforce LIMIT
        # We need to check if LIMIT exists and is <= 100. If not, inject/replace it.
        # Parsing LIMIT is tricky with sqlparse, sometimes easier with regex for simple enforcement
        
        # Simple heuristic: remove trailing semicolon
        clean_sql = sql.strip().rstrip(';')
        
        limit_match = re.search(r'\bLIMIT\s+(\d+)', clean_sql, re.IGNORECASE)
        
        if limit_match:
            limit_val = int(limit_match.group(1))
            if limit_val > 100:
                # Replace with LIMIT 100
                # We replace the last occurrence to be safe or just rebuild
                clean_sql = re.sub(r'\bLIMIT\s+\d+', 'LIMIT 100', clean_sql, flags=re.IGNORECASE)
        else:
            # Append LIMIT 100
            clean_sql += " LIMIT 100"
            
        return clean_sql

    @staticmethod
    def is_destructive(sql: str) -> bool:
        """Double check for destructive patterns"""
        normalized = sql.upper()
        return any(x in normalized for x in ['DROP ', 'DELETE ', 'UPDATE ', 'INSERT ', 'ALTER ', 'TRUNCATE '])
