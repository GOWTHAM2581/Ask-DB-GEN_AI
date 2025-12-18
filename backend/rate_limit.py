import time
from fastapi import HTTPException, Request, status

class RateLimiter:
    def __init__(self, requests_per_minute: int = 10):
        self.requests_per_minute = requests_per_minute
        self.window_size = 60  # seconds
        self.requests = {}  # In-memory storage: {user_id: [timestamps]}

    def check_rate_limit(self, user_id: str):
        current_time = time.time()
        
        if user_id not in self.requests:
            self.requests[user_id] = []
        
        # Filter out timestamps older than the window
        self.requests[user_id] = [
            t for t in self.requests[user_id] 
            if current_time - t < self.window_size
        ]
        
        if len(self.requests[user_id]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please wait a moment."
            )
            
        self.requests[user_id].append(current_time)

# Global instance
rate_limiter = RateLimiter(requests_per_minute=20)
