import logging
from typing import Optional, Dict, Any
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings

logger = logging.getLogger(__name__)


class GoogleAuthService:
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Validates a Google ID Token received from Google One Tap or Google Sign-In.
        Returns the user payload containing email, name, sub (google_id), and picture.
        """
        try:
            # Use request transport from Google Auth library
            request = requests.Request()
            audience = settings.GOOGLE_CLIENT_ID if settings.GOOGLE_CLIENT_ID else None
            
            # Verify the token against Google's public certs
            id_info = id_token.verify_oauth2_token(token, request, audience)
            
            # Verify issuer
            if id_info.get("iss") not in ["accounts.google.com", "https://accounts.google.com"]:
                logger.warning("Invalid Google token issuer: %s", id_info.get("iss"))
                return None

            return {
                "google_id": id_info.get("sub"),
                "email": id_info.get("email"),
                "email_verified": id_info.get("email_verified", False),
                "name": id_info.get("name"),
                "picture": id_info.get("picture"),
            }
        except Exception as e:
            logger.warning("Google token verification failed: %s", e)
            return None

