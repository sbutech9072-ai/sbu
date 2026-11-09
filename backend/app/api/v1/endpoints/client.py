from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.schemas.auth import UpdateProfileInput, UserResponse
from app.repositories.user_repo import UserRepository

router = APIRouter(prefix="/client", tags=["Client Portal"])


@router.get("/profile", response_model=UserResponse, summary="Get Client Profile")
def get_client_profile(current_user: User = Depends(get_current_user)):
    """Retrieves profile data for the active client account."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        fullName=current_user.full_name,
        role=current_user.role.value,
        country=current_user.country,
        whatsappNumber=current_user.whatsapp_number,
        isActive=current_user.is_active,
        isVerified=current_user.is_verified,
    )


@router.patch("/profile", response_model=UserResponse, summary="Update Client Profile")
def update_client_profile(
    payload: UpdateProfileInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Updates client profile attributes (fullName, country, whatsappNumber)."""
    if payload.fullName is not None:
        current_user.full_name = payload.fullName.strip()
    if payload.country is not None:
        current_user.country = payload.country.strip()
    if payload.whatsappNumber is not None:
        current_user.whatsapp_number = payload.whatsappNumber.strip()

    updated = UserRepository(db).update(current_user)

    return UserResponse(
        id=updated.id,
        email=updated.email,
        fullName=updated.full_name,
        role=updated.role.value,
        country=updated.country,
        whatsappNumber=updated.whatsapp_number,
        isActive=updated.is_active,
        isVerified=updated.is_verified,
    )

