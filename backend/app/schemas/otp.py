from pydantic import BaseModel, EmailStr, Field
from pydantic import model_validator
from typing import Self

from app.core.otp import OTP_LENGTH, OTPPurpose
from app.schemas.auth import ClientRegisterInput


class SignupOTPRequest(BaseModel):
    email: EmailStr


class SignupVerifyRequest(ClientRegisterInput):
    otp: str = Field(pattern=rf"^[0-9]{{{OTP_LENGTH}}}$")


class PasswordResetOTPRequest(BaseModel):
    email: EmailStr


class PasswordResetVerifyRequest(BaseModel):
    email: EmailStr
    otp: str = Field(pattern=rf"^[0-9]{{{OTP_LENGTH}}}$")
    newPassword: str = Field(min_length=8)
    confirmPassword: str = Field(min_length=8)

    @model_validator(mode="after")
    def passwords_match(self) -> Self:
        if self.newPassword != self.confirmPassword:
            raise ValueError("New password and confirmation do not match.")
        return self


class OTPCreateRequest(BaseModel):
    email: EmailStr
    purpose: OTPPurpose


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    purpose: OTPPurpose
    otp: str = Field(pattern=rf"^[0-9]{{{OTP_LENGTH}}}$")
