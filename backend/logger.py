import logging
import sys
import json
from datetime import datetime
from typing import Any

class CustomJSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
        }
        
        # Add extra fields if they exist
        if hasattr(record, "user_id"):
            log_data["user_id"] = record.user_id
        if hasattr(record, "query_duration"):
            log_data["query_duration_ms"] = record.query_duration
        if hasattr(record, "row_count"):
            log_data["row_count"] = record.row_count
            
        return json.dumps(log_data)

def setup_logger(name: str = "app"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    handler = logging.StreamHandler(sys.stdout)
    formatter = CustomJSONFormatter()
    handler.setFormatter(formatter)
    
    # Avoid duplicate handlers
    if not logger.handlers:
        logger.addHandler(handler)
        
    return logger

app_logger = setup_logger("ask_your_db")
