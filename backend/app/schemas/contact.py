from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr = Field(...)
    phone: Optional[str] = Field(None, max_length=50)
    subject: str = Field(..., min_length=3, max_length=255)
    message: str = Field(..., min_length=10)


class ContactMessageUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|read|replied)$")


class ContactMessageResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    status: str
    createdAt: datetime

    class Config:
        from_attributes = True

