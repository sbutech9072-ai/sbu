from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.auth_service import require_admin
from app.models.user import User, UserRole
from app.models.contact import ContactMessage
from app.repositories.contact_repo import ContactRepository
from app.schemas.contact import ContactMessageResponse, ContactMessageUpdate

router = APIRouter(prefix="/admin", tags=["Admin Portal"])


@router.get("/stats", summary="Admin Dashboard Statistics")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Returns aggregated high-level KPIs for the internal Control Desk."""
    total_messages = db.query(ContactMessage).count()
    new_messages = db.query(ContactMessage).filter(ContactMessage.status == "new").count()
    total_clients = db.query(User).filter(User.role == UserRole.CLIENT).count()

    return {
        "totalMessages": total_messages,
        "newMessages": new_messages,
        "totalClients": total_clients,
        "systemHealth": "operational",
    }


# Messages management
@router.get("/messages", response_model=List[ContactMessageResponse], summary="List Inbound Contact Messages")
def list_messages(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    messages = ContactRepository(db).get_all()
    return [
        ContactMessageResponse(
            id=m.id,
            name=m.name,
            email=m.email,
            phone=m.phone,
            subject=m.subject,
            message=m.message,
            status=m.status,
            createdAt=m.created_at,
        )
        for m in messages
    ]


@router.patch("/messages/{message_id}", response_model=ContactMessageResponse, summary="Update Message Status")
def update_message_status(
    message_id: str,
    payload: ContactMessageUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    repo = ContactRepository(db)
    msg = repo.get_by_id(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    updated = repo.update_status(msg, payload.status)
    return ContactMessageResponse(
        id=updated.id,
        name=updated.name,
        email=updated.email,
        phone=updated.phone,
        subject=updated.subject,
        message=updated.message,
        status=updated.status,
        createdAt=updated.created_at,
    )


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Message")
def delete_message(
    message_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    repo = ContactRepository(db)
    msg = repo.get_by_id(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    repo.delete(msg)
    return None

