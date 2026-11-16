import secrets
from enum import Enum


OTP_LENGTH = 6


class OTPPurpose(str, Enum):
    SIGNUP = "signup"
    PASSWORD_RESET = "password_reset"


def generate_otp() -> str:
    """Generate a zero-padded six-digit OTP using a cryptographically secure source."""
    return f"{secrets.randbelow(10**OTP_LENGTH):0{OTP_LENGTH}d}"
