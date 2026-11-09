from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.core.countries import COUNTRIES


class ClientRegisterInput(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=255, description="Full legal or professional name")
    email: EmailStr = Field(..., description="Valid communication email address")
    password: str = Field(..., min_length=8, description="Password of at least 8 characters")
    country: str = Field(..., min_length=2, description="Country of residence or incorporation")
    whatsappNumber: Optional[str] = Field(None, max_length=50, description="Optional WhatsApp phone number")

    @field_validator("country")
    @classmethod
    def validate_country(cls, v: str) -> str:
        trimmed = v.strip()
        if trimmed not in COUNTRIES:
            raise ValueError("Please select a valid country from the official country list")
        return trimmed


class ClientLoginInput(BaseModel):
    email: EmailStr = Field(..., description="Account email address")
    password: str = Field(..., min_length=1, description="Account password")


class OwnerLoginInput(BaseModel):
    email: EmailStr = Field(..., description="Company administrative email address")
    password: str = Field(..., min_length=1, description="Administrative password")


class GoogleLoginInput(BaseModel):
    credential: str = Field(..., description="Google OAuth2 ID Token from client-side Google Identity Services")
    clientId: Optional[str] = Field(None, description="Optional Client ID for validation")


class UpdateProfileInput(BaseModel):
    fullName: Optional[str] = Field(None, min_length=2, max_length=255)
    country: Optional[str] = Field(None, min_length=2)
    whatsappNumber: Optional[str] = Field(None, max_length=50)

    @field_validator("country")
    @classmethod
    def validate_country(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if trimmed not in COUNTRIES:
                raise ValueError("Please select a valid country from the official country list")
            return trimmed
        return v


class UserResponse(BaseModel):
    id: str
    email: str
    fullName: str
    role: str
    country: Optional[str] = None
    whatsappNumber: Optional[str] = None
    isActive: bool
    isVerified: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    success: bool = True
    accessToken: str
    tokenType: str = "bearer"
    user: UserResponse

