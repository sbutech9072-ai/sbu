from typing import Optional, List, Dict, Any
from sqlalchemy import String, Text, Integer, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    client: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)
    full_description: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image: Mapped[str] = mapped_column(String(500), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    duration: Mapped[str] = mapped_column(String(100), nullable=False)
    technologies: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    metrics: Mapped[List[Dict[str, str]]] = mapped_column(JSON, default=list, nullable=False)
    challenge: Mapped[str] = mapped_column(Text, nullable=False)
    solution: Mapped[str] = mapped_column(Text, nullable=False)
    results: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    live_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    github_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)


class Service(Base, TimestampMixin):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)
    full_description: Mapped[str] = mapped_column(Text, nullable=False)
    icon_name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    features: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    deliverables: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    technologies: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    process_steps: Mapped[List[Dict[str, str]]] = mapped_column(JSON, default=list, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class TeamMember(Base, TimestampMixin):
    __tablename__ = "team_members"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    skills: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    socials: Mapped[Dict[str, Optional[str]]] = mapped_column(JSON, default=dict, nullable=False)
    is_leadership: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Testimonial(Base, TimestampMixin):
    __tablename__ = "testimonials"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    quote: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    project_slug: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    verified_client: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class SiteSettings(Base, TimestampMixin):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    company_name: Mapped[str] = mapped_column(String(255), default="Sbu Tech", nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), default="engineering@sbutech.com", nullable=False)
    sales_email: Mapped[str] = mapped_column(String(255), default="dispatch@sbutech.com", nullable=False)
    phone_number: Mapped[str] = mapped_column(String(50), default="+1 (415) 890-3412", nullable=False)
    office_address: Mapped[str] = mapped_column(
        String(255),
        default="548 Market St, Suite 78120, San Francisco, CA 94104",
        nullable=False,
    )
    meta_title: Mapped[str] = mapped_column(
        String(255),
        default="Sbu Tech | Software Engineering & Cloud Architecture Studio",
        nullable=False,
    )
    meta_description: Mapped[str] = mapped_column(
        Text,
        default="Software engineering studio in San Francisco building production web platforms, cloud infrastructure, and private AI systems.",
        nullable=False,
    )
    enable_maintenance_mode: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    enable_registration: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

