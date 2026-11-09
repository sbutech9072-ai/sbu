from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.auth_service import AuthService, get_current_user
from app.schemas.auth import (
    ClientRegisterInput,
    ClientLoginInput,
    OwnerLoginInput,
    GoogleLoginInput,
    TokenResponse,
    UserResponse,
)
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/client/register", response_model=TokenResponse, summary="Register Client Account")
def register_client(
    payload: ClientRegisterInput,
    db: Session = Depends(get_db),
):
    """Registers a new client organization or partner account and issues a JWT token."""
    service = AuthService(db)
    return service.register_client(payload)


@router.post("/client/login", response_model=TokenResponse, summary="Client Authentication")
def login_client(
    payload: ClientLoginInput,
    db: Session = Depends(get_db),
):
    """Authenticates a registered client and returns a JWT access token."""
    service = AuthService(db)
    return service.authenticate_client(payload)


@router.post("/owner/login", response_model=TokenResponse, summary="Owner & Administrative Login")
def login_owner(
    payload: OwnerLoginInput,
    db: Session = Depends(get_db),
):
    """Authenticates a founding principal or internal administrator to access control desks."""
    service = AuthService(db)
    return service.authenticate_owner(payload)


@router.post("/google", response_model=TokenResponse, summary="Google OAuth2 / One-Tap Login")
def login_google(
    payload: GoogleLoginInput,
    db: Session = Depends(get_db),
):
    """Authenticates or signs up a client using Google Identity Services ID Token."""
    service = AuthService(db)
    return service.authenticate_google(payload)


@router.get("/me", response_model=UserResponse, summary="Current Authenticated User Profile")
def get_me(current_user: User = Depends(get_current_user)):
    """Retrieves session profile for the active Bearer token."""
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

