from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.auth_service import require_admin
from app.models.user import User, UserRole
from app.models.contact import ContactMessage
from app.models.quote import QuoteRequest
from app.repositories.contact_repo import ContactRepository
from app.repositories.quote_repo import QuoteRepository
from app.schemas.contact import ContactMessageResponse, ContactMessageUpdate
from app.schemas.quote import QuoteRequestResponse, QuoteRequestUpdate

router = APIRouter(prefix="/admin", tags=["Admin Portal"])


@router.get("/stats", summary="Admin Dashboard Statistics")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Returns aggregated high-level KPIs for the internal Control Desk."""
    total_messages = db.query(ContactMessage).count()
    new_messages = db.query(ContactMessage).filter(ContactMessage.status == "new").count()
    total_quotes = db.query(QuoteRequest).count()
    pending_quotes = db.query(QuoteRequest).filter(QuoteRequest.status == "pending").count()
    total_clients = db.query(User).filter(User.role == UserRole.CLIENT).count()

    return {
        "totalMessages": total_messages,
        "newMessages": new_messages,
        "totalQuotes": total_quotes,
        "pendingQuotes": pending_quotes,
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


# Quotes management
@router.get("/quotes", response_model=List[QuoteRequestResponse], summary="List Project Quote Requests")
def list_quotes(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    quotes = QuoteRepository(db).get_all()
    return [
        QuoteRequestResponse(
            id=q.id,
            fullName=q.full_name,
            companyName=q.company_name,
            email=q.email,
            phone=q.phone,
            serviceCategory=q.service_category,
            budgetRange=q.budget_range,
            timeline=q.timeline,
            projectOverview=q.project_overview,
            featuresNeeded=q.features_needed,
            status=q.status,
            createdAt=q.created_at,
        )
        for q in quotes
    ]


@router.patch("/quotes/{quote_id}", response_model=QuoteRequestResponse, summary="Update Quote Status")
def update_quote_status(
    quote_id: str,
    payload: QuoteRequestUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    repo = QuoteRepository(db)
    quote = repo.get_by_id(quote_id)
    if not quote:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quote request not found")
    updated = repo.update_status(quote, payload.status)
    return QuoteRequestResponse(
        id=updated.id,
        fullName=updated.full_name,
        companyName=updated.company_name,
        email=updated.email,
        phone=updated.phone,
        serviceCategory=updated.service_category,
        budgetRange=updated.budget_range,
        timeline=updated.timeline,
        projectOverview=updated.project_overview,
        featuresNeeded=updated.features_needed,
        status=updated.status,
        createdAt=updated.created_at,
    )


@router.delete("/quotes/{quote_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Quote Request")
def delete_quote(
    quote_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    repo = QuoteRepository(db)
    quote = repo.get_by_id(quote_id)
    if not quote:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quote request not found")
    repo.delete(quote)
    return None

