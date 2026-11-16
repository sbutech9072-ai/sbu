import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, CheckConstraint, DateTime, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.otp import OTPPurpose
from app.models.base import Base


class OTPVerification(Base):
    __tablename__ = "otp_verifications"
    __table_args__ = (
        CheckConstraint(
            "purpose IN ('signup', 'password_reset')",
            name="ck_otp_verifications_purpose",
        ),
        CheckConstraint(
            "wrong_attempts >= 0",
            name="ck_otp_verifications_wrong_attempts_nonnegative",
        ),
        Index(
            "ix_otp_verifications_email_purpose_created_at",
            "email",
            "purpose",
            "created_at",
        ),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_otp: Mapped[str] = mapped_column(String(255), nullable=False)
    purpose: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default=OTPPurpose.SIGNUP.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    wrong_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
