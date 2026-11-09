import uuid
from typing import Optional
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class ContactMessage(Base, TimestampMixin):
    __tablename__ = "contact_messages"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="new", nullable=False)  # 'new' | 'read' | 'replied'

    def __repr__(self) -> str:
        return f"<ContactMessage {self.id} from {self.email}>"

