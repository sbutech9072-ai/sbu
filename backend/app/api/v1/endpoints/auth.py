from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.auth_service import AuthService, get_current_user
from app.services.email_service import EmailService
from app.services.otp_service import OTPCooldownError, OTPService
from app.schemas.auth import (
    ClientRegisterInput,
    ClientLoginInput,
    OwnerLoginInput,
    GoogleLoginInput,
    TokenResponse,
    UserResponse,
)
from app.schemas.otp import (
    PasswordResetOTPRequest,
    PasswordResetVerifyRequest,
    SignupOTPRequest,
    SignupVerifyRequest,
)
from app.core.otp import OTPPurpose
from app.core.security import create_access_token, get_password_hash
from app.models.user import User, UserRole
from app.repositories.user_repo import UserRepository

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup/send-otp", summary="Send Signup Verification Code")
def send_signup_otp(
    payload: SignupOTPRequest,
    db: Session = Depends(get_db),
):
    email = str(payload.email).strip().lower()
    if UserRepository(db).get_by_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    try:
        otp = OTPService.create_otp(db, email, OTPPurpose.SIGNUP)
    except OTPCooldownError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(exc),
            headers={"Retry-After": str(exc.retry_after_seconds)},
        ) from exc

    if not EmailService.send_email(
        subject="Verify your TechZaa signup",
        recipient=email,
        text_body=f"Your signup verification code is {otp}. It expires in 5 minutes.",
        html_body=(
            f"<p>Your signup verification code is <strong>{otp}</strong>.</p>"
            "<p>This code expires in 5 minutes.</p>"
        ),
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to send the verification email. Please try again later.",
        )

    return {"success": True, "message": "OTP sent successfully."}


@router.post(
    "/signup/verify",
    response_model=TokenResponse,
    summary="Verify Signup Code and Create Account",
)
def verify_signup_otp(
    payload: SignupVerifyRequest,
    db: Session = Depends(get_db),
):
    email = str(payload.email).strip().lower()
    if UserRepository(db).get_by_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    if not OTPService.verify_otp(db, email, OTPPurpose.SIGNUP, payload.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired signup verification code.",
        )

    user = User(
        email=email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.fullName.strip(),
        role=UserRole.CLIENT,
        country=payload.country,
        whatsapp_number=payload.whatsappNumber.strip() if payload.whatsappNumber else None,
        is_active=True,
        is_verified=True,
    )
    try:
        created = UserRepository(db).create(user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        ) from exc

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


@router.post("/password-reset/send-otp", summary="Request Password Reset Code")
def send_password_reset_otp(
    payload: PasswordResetOTPRequest,
    db: Session = Depends(get_db),
):
    generic_response = {
        "success": True,
        "message": "If the email is registered, an OTP has been sent.",
    }
    email = str(payload.email).strip().lower()
    if not UserRepository(db).get_by_email(email):
        return generic_response

    try:
        otp = OTPService.create_otp(db, email, OTPPurpose.PASSWORD_RESET)
    except OTPCooldownError:
        return generic_response

    EmailService.send_email(
        subject="Reset your TechZaa password",
        recipient=email,
        text_body=f"Your password reset code is {otp}. It expires in 5 minutes.",
        html_body=(
            f"<p>Your password reset code is <strong>{otp}</strong>.</p>"
            "<p>This code expires in 5 minutes.</p>"
        ),
    )
    return generic_response


@router.post("/password-reset/verify", summary="Verify Code and Reset Password")
def verify_password_reset(
    payload: PasswordResetVerifyRequest,
    db: Session = Depends(get_db),
):
    email = str(payload.email).strip().lower()
    if not OTPService.verify_otp(db, email, OTPPurpose.PASSWORD_RESET, payload.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset code.",
        )

    user = UserRepository(db).get_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset code.",
        )

    user.hashed_password = get_password_hash(payload.newPassword)
    UserRepository(db).update(user)
    return {"success": True, "message": "Password reset successfully."}


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

