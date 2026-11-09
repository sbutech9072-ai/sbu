from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.contact import ContactMessageCreate, ContactMessageResponse
from app.models.contact import ContactMessage
from app.repositories.contact_repo import ContactRepository
from app.services.email_service import EmailService

router = APIRouter(prefix="/contact", tags=["Contact Inquiries"])


@router.post("", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED, summary="Submit Contact Note")
def submit_contact_form(
    payload: ContactMessageCreate,
    db: Session = Depends(get_db),
):
    """Saves a consultation request or contact message from the public site and notifies partners."""
    message = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        phone=payload.phone.strip() if payload.phone else None,
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        status="new",
    )
    saved = ContactRepository(db).create(message)

    # Trigger async/background notification email
    EmailService.send_notification(
        subject=f"[Inbound Brief] {saved.subject}",
        body=f"<p><strong>From:</strong> {saved.name} ({saved.email})</p><p><strong>Phone:</strong> {saved.phone or 'N/A'}</p><p>{saved.message}</p>",
    )

    return ContactMessageResponse(
        id=saved.id,
        name=saved.name,
        email=saved.email,
        phone=saved.phone,
        subject=saved.subject,
        message=saved.message,
        status=saved.status,
        createdAt=saved.created_at,
    )

