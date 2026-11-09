from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.quote import QuoteRequestCreate, QuoteRequestResponse
from app.models.quote import QuoteRequest
from app.repositories.quote_repo import QuoteRepository
from app.services.email_service import EmailService

router = APIRouter(prefix="/quotes", tags=["Project Estimates"])


@router.post("", response_model=QuoteRequestResponse, status_code=status.HTTP_201_CREATED, summary="Submit Project Quote Brief")
def submit_quote_request(
    payload: QuoteRequestCreate,
    db: Session = Depends(get_db),
):
    """Submits a technical scope and estimation request for architectural review."""
    quote = QuoteRequest(
        full_name=payload.fullName.strip(),
        company_name=payload.companyName.strip(),
        email=payload.email.lower().strip(),
        phone=payload.phone.strip() if payload.phone else None,
        service_category=payload.serviceCategory.strip(),
        budget_range=payload.budgetRange.strip(),
        timeline=payload.timeline.strip(),
        project_overview=payload.projectOverview.strip(),
        features_needed=payload.featuresNeeded,
        status="pending",
    )
    saved = QuoteRepository(db).create(quote)

    EmailService.send_notification(
        subject=f"[Quote Request] {saved.company_name} - {saved.service_category}",
        body=f"<p><strong>Client:</strong> {saved.full_name} ({saved.email})</p><p><strong>Budget:</strong> {saved.budget_range} | <strong>Timeline:</strong> {saved.timeline}</p><p>{saved.project_overview}</p>",
    )

    return QuoteRequestResponse(
        id=saved.id,
        fullName=saved.full_name,
        companyName=saved.company_name,
        email=saved.email,
        phone=saved.phone,
        serviceCategory=saved.service_category,
        budgetRange=saved.budget_range,
        timeline=saved.timeline,
        projectOverview=saved.project_overview,
        featuresNeeded=saved.features_needed,
        status=saved.status,
        createdAt=saved.created_at,
    )

