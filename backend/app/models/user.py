import uuid
from typing import Optional
from sqlalchemy import String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
import enum
from app.models.base import Base, TimestampMixin


class UserRole(str, enum.Enum):
    CLIENT = "client"
    ADMIN = "admin"
    OWNER = "owner"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole),
        default=UserRole.CLIENT,
        nullable=False,
    )
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    whatsapp_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    google_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"

