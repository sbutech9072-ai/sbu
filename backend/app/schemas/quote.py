from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class QuoteRequestCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=255)
    companyName: str = Field(..., min_length=2, max_length=255)
    email: EmailStr = Field(...)
    phone: Optional[str] = Field(None, max_length=50)
    serviceCategory: str = Field(..., min_length=1)
    budgetRange: str = Field(..., min_length=1)
    timeline: str = Field(..., min_length=1)
    projectOverview: str = Field(..., min_length=15)
    featuresNeeded: List[str] = Field(default_factory=list)


class QuoteRequestUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|reviewing|contacted|archived)$")


class QuoteRequestResponse(BaseModel):
    id: str
    fullName: str
    companyName: str
    email: str
    phone: Optional[str] = None
    serviceCategory: str
    budgetRange: str
    timeline: str
    projectOverview: str
    featuresNeeded: List[str]
    status: str
    createdAt: datetime

    class Config:
        from_attributes = True

