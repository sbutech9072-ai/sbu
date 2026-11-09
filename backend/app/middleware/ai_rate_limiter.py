"""
In-memory sliding window rate limiter for public AI chat endpoints.
Protects backend and LLM credits from automated denial-of-service or scraping attacks.
"""

import time
from collections import defaultdict
from typing import Dict, List
from fastapi import Request, HTTPException, status


class AIRateLimiter:
    """
    Sliding window rate limiter tracking request timestamps per client identifier (IP/session).
    """

    def __init__(self, max_requests: int = 30, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = defaultdict(list)

    def is_rate_limited(self, identifier: str) -> bool:
        """Checks and records an incoming request."""
        now = time.time()
        cutoff = now - self.window_seconds

        # Filter out expired timestamps
        active_timestamps = [ts for ts in self.requests[identifier] if ts > cutoff]
        self.requests[identifier] = active_timestamps

        if len(active_timestamps) >= self.max_requests:
            return True

        self.requests[identifier].append(now)
        return False


# Singleton rate limiter instance: 30 requests per minute
_default_ai_limiter = AIRateLimiter(max_requests=30, window_seconds=60)


def check_ai_rate_limit(request: Request) -> None:
    """
    FastAPI dependency enforcing rate limits on AI chat requests.
    Identifies clients by forwarded header, client IP, or session.
    """
    client_ip = (
        request.headers.get("x-forwarded-for")
        or request.headers.get("x-real-ip")
        or (request.client.host if request.client else "127.0.0.1")
    )
    # Take first IP if comma-separated
    client_ip = client_ip.split(",")[0].strip()

    if _default_ai_limiter.is_rate_limited(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded for AI Assistant requests. Please wait a moment before sending another message.",
        )
