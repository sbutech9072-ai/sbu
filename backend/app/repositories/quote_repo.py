from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.quote import QuoteRequest


class QuoteRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100) -> List[QuoteRequest]:
        return (
            self.db.query(QuoteRequest)
            .order_by(desc(QuoteRequest.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_id(self, quote_id: str) -> Optional[QuoteRequest]:
        return self.db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()

    def create(self, quote: QuoteRequest) -> QuoteRequest:
        self.db.add(quote)
        self.db.commit()
        self.db.refresh(quote)
        return quote

    def update_status(self, quote: QuoteRequest, status: str) -> QuoteRequest:
        quote.status = status
        self.db.commit()
        self.db.refresh(quote)
        return quote

    def delete(self, quote: QuoteRequest) -> None:
        self.db.delete(quote)
        self.db.commit()

