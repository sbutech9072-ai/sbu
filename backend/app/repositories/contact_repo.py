from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.contact import ContactMessage


class ContactRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ContactMessage]:
        return (
            self.db.query(ContactMessage)
            .order_by(desc(ContactMessage.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_id(self, message_id: str) -> Optional[ContactMessage]:
        return self.db.query(ContactMessage).filter(ContactMessage.id == message_id).first()

    def create(self, message: ContactMessage) -> ContactMessage:
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def update_status(self, message: ContactMessage, status: str) -> ContactMessage:
        message.status = status
        self.db.commit()
        self.db.refresh(message)
        return message

    def delete(self, message: ContactMessage) -> None:
        self.db.delete(message)
        self.db.commit()

