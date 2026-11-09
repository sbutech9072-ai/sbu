from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ServiceSchema(BaseModel):
    id: str
    slug: str
    title: str
    shortDescription: str
    fullDescription: str
    iconName: str
    category: str
    features: List[str]
    deliverables: List[str]
    technologies: List[str]
    processSteps: List[Dict[str, str]]
    isFeatured: bool = False

    class Config:
        from_attributes = True


class ProjectSchema(BaseModel):
    id: str
    slug: str
    title: str
    client: str
    category: str
    shortDescription: str
    fullDescription: str
    coverImage: str
    year: int
    duration: str
    technologies: List[str]
    metrics: List[Dict[str, str]]
    challenge: str
    solution: str
    results: List[str]
    isFeatured: bool = False
    liveUrl: Optional[str] = None
    githubUrl: Optional[str] = None

    class Config:
        from_attributes = True


class TeamMemberSchema(BaseModel):
    id: str
    name: str
    role: str
    department: str
    avatar: str
    bio: str
    skills: List[str]
    socials: Dict[str, Optional[str]]
    isLeadership: bool = False

    class Config:
        from_attributes = True


class TestimonialSchema(BaseModel):
    id: str
    quote: str
    author: str
    title: str
    company: str
    avatar: str
    rating: int = 5
    projectSlug: Optional[str] = None
    verifiedClient: bool = True

    class Config:
        from_attributes = True


class SiteSettingsSchema(BaseModel):
    companyName: str
    contactEmail: str
    salesEmail: str
    phoneNumber: str
    officeAddress: str
    metaTitle: str
    metaDescription: str
    enableMaintenanceMode: bool
    enableRegistration: bool

    class Config:
        from_attributes = True

