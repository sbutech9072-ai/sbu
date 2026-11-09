import uuid
from typing import Optional, List
from sqlalchemy import String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class QuoteRequest(Base, TimestampMixin):
    __tablename__ = "quote_requests"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    service_category: Mapped[str] = mapped_column(String(255), nullable=False)
    budget_range: Mapped[str] = mapped_column(String(100), nullable=False)
    timeline: Mapped[str] = mapped_column(String(100), nullable=False)
    project_overview: Mapped[str] = mapped_column(Text, nullable=False)
    features_needed: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False,
    )  # 'pending' | 'reviewing' | 'contacted' | 'archived'

    def __repr__(self) -> str:
        return f"<QuoteRequest {self.id} for {self.company_name}>"

