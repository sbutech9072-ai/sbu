"""
SQLAlchemy models for AI Conversation Sessions and Message Continuity.
"""

from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class ChatSession(Base, TimestampMixin):
    """
    Represents an ongoing visitor chat session.
    Isolates conversation history and continuity per session.
    """
    __tablename__ = "chat_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    visitor_ip: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    language: Mapped[str] = mapped_column(String(20), default="auto")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    messages: Mapped[List["ChatMessage"]] = relationship(
        "ChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(Base, TimestampMixin):
    """
    Individual turn within an AI conversation session.
    """
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[str] = mapped_column(ForeignKey("chat_sessions.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(20), nullable=False)  # "user" | "assistant"
    content: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    sources_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    session: Mapped["ChatSession"] = relationship("ChatSession", back_populates="messages")
