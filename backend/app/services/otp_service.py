from datetime import datetime, timedelta, timezone
from math import ceil

from sqlalchemy.orm import Session

from app.core.otp import OTPPurpose, generate_otp
from app.core.security import get_password_hash, verify_password
from app.models.otp_verification import OTPVerification

OTP_TTL = timedelta(minutes=5)
RESEND_COOLDOWN = timedelta(seconds=60)
MAX_WRONG_ATTEMPTS = 5


class OTPCooldownError(Exception):
    def __init__(self, retry_after_seconds: int) -> None:
        self.retry_after_seconds = retry_after_seconds
        super().__init__(f"Please wait {retry_after_seconds} seconds before requesting another code.")


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


class OTPService:
    @staticmethod
    def create_otp(db: Session, email: str, purpose: OTPPurpose) -> str:
        """Store a bcrypt hash and return the plaintext code once for delivery."""
        normalized_email = email.strip().lower()
        if not normalized_email:
            raise ValueError("Email address is required.")

        now = datetime.now(timezone.utc)
        purpose_value = purpose.value
        latest = (
            db.query(OTPVerification)
            .filter(
                OTPVerification.email == normalized_email,
                OTPVerification.purpose == purpose_value,
            )
            .order_by(OTPVerification.created_at.desc())
            .with_for_update()
            .first()
        )
        if latest is not None:
            elapsed = now - _as_utc(latest.created_at)
            remaining = RESEND_COOLDOWN - elapsed
            if remaining.total_seconds() > 0:
                raise OTPCooldownError(ceil(remaining.total_seconds()))

        db.query(OTPVerification).filter(
            OTPVerification.email == normalized_email,
            OTPVerification.purpose == purpose_value,
            OTPVerification.is_used.is_(False),
        ).update(
            {OTPVerification.is_used: True},
            synchronize_session=False,
        )

        code = generate_otp()
        verification = OTPVerification(
            email=normalized_email,
            hashed_otp=get_password_hash(code),
            purpose=purpose_value,
            created_at=now,
            expires_at=now + OTP_TTL,
            wrong_attempts=0,
            is_used=False,
        )
        db.add(verification)
        db.commit()
        return code

    @staticmethod
    def verify_otp(db: Session, email: str, purpose: OTPPurpose, otp: str) -> bool:
        normalized_email = email.strip().lower()
        if not normalized_email:
            return False

        verification = (
            db.query(OTPVerification)
            .filter(
                OTPVerification.email == normalized_email,
                OTPVerification.purpose == purpose.value,
                OTPVerification.is_used.is_(False),
            )
            .order_by(OTPVerification.created_at.desc())
            .with_for_update()
            .first()
        )
        if verification is None:
            return False

        now = datetime.now(timezone.utc)
        if _as_utc(verification.expires_at) <= now:
            verification.is_used = True
            db.commit()
            return False

        if verification.wrong_attempts >= MAX_WRONG_ATTEMPTS:
            verification.is_used = True
            db.commit()
            return False

        if verify_password(otp, verification.hashed_otp):
            verification.is_used = True
            db.commit()
            return True

        verification.wrong_attempts += 1
        if verification.wrong_attempts >= MAX_WRONG_ATTEMPTS:
            verification.is_used = True
        db.commit()
        return False
