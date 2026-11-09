from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.repositories.user_repo import UserRepository
from app.models.user import User, UserRole
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.schemas.auth import ClientRegisterInput, ClientLoginInput, OwnerLoginInput, GoogleLoginInput, TokenResponse, UserResponse
from app.integrations.google_auth import GoogleAuthService

security_bearer = HTTPBearer(auto_error=False)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register_client(self, input_data: ClientRegisterInput) -> TokenResponse:
        existing = self.user_repo.get_by_email(input_data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"email": "An account with this email address already exists."},
            )

        new_user = User(
            email=input_data.email.lower().strip(),
            hashed_password=get_password_hash(input_data.password),
            full_name=input_data.fullName.strip(),
            role=UserRole.CLIENT,
            country=input_data.country,
            whatsapp_number=input_data.whatsappNumber,
            is_active=True,
            is_verified=False,
        )
        created = self.user_repo.create(new_user)
        token = create_access_token(subject=created.id, role=created.role.value)

        return TokenResponse(
            success=True,
            accessToken=token,
            user=UserResponse(
                id=created.id,
                email=created.email,
                fullName=created.full_name,
                role=created.role.value,
                country=created.country,
                whatsappNumber=created.whatsapp_number,
                isActive=created.is_active,
                isVerified=created.is_verified,
            ),
        )

    def authenticate_client(self, input_data: ClientLoginInput) -> TokenResponse:
        user = self.user_repo.get_by_email(input_data.email)
        if not user or not verify_password(input_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is currently suspended",
            )

        token = create_access_token(subject=user.id, role=user.role.value)
        return TokenResponse(
            success=True,
            accessToken=token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                fullName=user.full_name,
                role=user.role.value,
                country=user.country,
                whatsappNumber=user.whatsapp_number,
                isActive=user.is_active,
                isVerified=user.is_verified,
            ),
        )

    def authenticate_owner(self, input_data: OwnerLoginInput) -> TokenResponse:
        user = self.user_repo.get_by_email(input_data.email)
        if not user or not verify_password(input_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid administrative credentials",
            )

        if user.role not in [UserRole.ADMIN, UserRole.OWNER]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized: User does not possess administrative privileges",
            )

        token = create_access_token(subject=user.id, role=user.role.value)
        return TokenResponse(
            success=True,
            accessToken=token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                fullName=user.full_name,
                role=user.role.value,
                country=user.country,
                whatsappNumber=user.whatsapp_number,
                isActive=user.is_active,
                isVerified=user.is_verified,
            ),
        )

    def authenticate_google(self, input_data: GoogleLoginInput) -> TokenResponse:
        google_profile = GoogleAuthService.verify_token(input_data.credential)
        if not google_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired Google authentication credential",
            )

        email = google_profile["email"].lower()
        user = self.user_repo.get_by_email(email)

        if user:
            # Link Google ID if not present
            if not user.google_id:
                user.google_id = google_profile["google_id"]
                self.user_repo.update(user)
        else:
            # Register new client account via Google
            user = User(
                email=email,
                hashed_password=get_password_hash(f"google-oauth-{google_profile['google_id']}"),
                full_name=google_profile.get("name") or email.split("@")[0],
                role=UserRole.CLIENT,
                google_id=google_profile["google_id"],
                is_active=True,
                is_verified=google_profile.get("email_verified", True),
            )
            user = self.user_repo.create(user)

        token = create_access_token(subject=user.id, role=user.role.value)
        return TokenResponse(
            success=True,
            accessToken=token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                fullName=user.full_name,
                role=user.role.value,
                country=user.country,
                whatsappNumber=user.whatsapp_number,
                isActive=user.is_active,
                isVerified=user.is_verified,
            ),
        )


def get_current_user(
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db),
) -> User:
    """Dependency to retrieve and validate authenticated user from JWT Bearer token."""
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
        )

    token = auth_header.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token",
        )

    user_id = payload.get("sub")
    user = UserRepository(db).get_by_id(user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency ensuring user holds administrator or owner role."""
    if current_user.role not in [UserRole.ADMIN, UserRole.OWNER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required",
        )
    return current_user

