from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.auth_service import require_admin
from app.models.user import User
from app.models.cms import Service, Project, SiteSettings
from app.schemas.cms import ServiceSchema, ProjectSchema, SiteSettingsSchema

router = APIRouter(tags=["Content & Studio Assets"])


@router.get("/services", response_model=List[ServiceSchema], summary="List Studio Engineering Capabilities")
def list_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    return [
        ServiceSchema(
            id=s.id,
            slug=s.slug,
            title=s.title,
            shortDescription=s.short_description,
            fullDescription=s.full_description,
            iconName=s.icon_name,
            category=s.category,
            features=s.features,
            deliverables=s.deliverables,
            technologies=s.technologies,
            processSteps=s.process_steps,
            isFeatured=s.is_featured,
        )
        for s in services
    ]


@router.get("/projects", response_model=List[ProjectSchema], summary="List Production Case Studies")
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return [
        ProjectSchema(
            id=p.id,
            slug=p.slug,
            title=p.title,
            client=p.client,
            category=p.category,
            shortDescription=p.short_description,
            fullDescription=p.full_description,
            coverImage=p.cover_image,
            year=p.year,
            duration=p.duration,
            technologies=p.technologies,
            metrics=p.metrics,
            challenge=p.challenge,
            solution=p.solution,
            results=p.results,
            isFeatured=p.is_featured,
            liveUrl=p.live_url,
            githubUrl=p.github_url,
        )
        for p in projects
    ]


@router.get("/settings", response_model=SiteSettingsSchema, summary="Get Public Site Settings")
def get_site_settings(db: Session = Depends(get_db)):
    settings_obj = db.query(SiteSettings).first()
    if not settings_obj:
        settings_obj = SiteSettings()
        db.add(settings_obj)
        db.commit()
        db.refresh(settings_obj)

    return SiteSettingsSchema(
        companyName=settings_obj.company_name,
        contactEmail=settings_obj.contact_email,
        salesEmail=settings_obj.sales_email,
        phoneNumber=settings_obj.phone_number,
        officeAddress=settings_obj.office_address,
        metaTitle=settings_obj.meta_title,
        metaDescription=settings_obj.meta_description,
        enableMaintenanceMode=settings_obj.enable_maintenance_mode,
        enableRegistration=settings_obj.enable_registration,
    )


@router.patch("/settings", response_model=SiteSettingsSchema, summary="Update Site Settings")
def update_site_settings(
    payload: SiteSettingsSchema,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    settings_obj = db.query(SiteSettings).first()
    if not settings_obj:
        settings_obj = SiteSettings()
        db.add(settings_obj)

    settings_obj.company_name = payload.companyName
    settings_obj.contact_email = payload.contactEmail
    settings_obj.sales_email = payload.salesEmail
    settings_obj.phone_number = payload.phoneNumber
    settings_obj.office_address = payload.officeAddress
    settings_obj.meta_title = payload.metaTitle
    settings_obj.meta_description = payload.metaDescription
    settings_obj.enable_maintenance_mode = payload.enableMaintenanceMode
    settings_obj.enable_registration = payload.enableRegistration

    db.commit()
    db.refresh(settings_obj)

    return payload

