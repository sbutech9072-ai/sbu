import logging
from sqlalchemy.orm import Session
from app.models.base import Base
from app.database.session import engine, SessionLocal
from app.models.user import User, UserRole
from app.models.contact import ContactMessage
from app.models.quote import QuoteRequest
from app.models.cms import Service, SiteSettings
from app.models.ai_session import ChatSession, ChatMessage
from app.core.security import get_password_hash
from app.database.seed_data import SEED_ADMIN, SEED_SERVICES, SEED_MESSAGES, SEED_QUOTES

logger = logging.getLogger(__name__)


def init_db(db: Session = None) -> None:
    """Creates database tables and seeds initial administrative & sample records if empty."""
    Base.metadata.create_all(bind=engine)

    close_session = False
    if db is None:
        db = SessionLocal()
        close_session = True

    try:
        # 1. Seed Default Administrator / Owner if none exists
        existing_admin = db.query(User).filter(User.email == SEED_ADMIN["email"]).first()
        if not existing_admin:
            logger.info("Seeding default administrator account (%s)...", SEED_ADMIN["email"])
            admin_user = User(
                email=SEED_ADMIN["email"],
                hashed_password=get_password_hash(SEED_ADMIN["password"]),
                full_name=SEED_ADMIN["full_name"],
                role=UserRole.OWNER,
                country=SEED_ADMIN["country"],
                whatsapp_number=SEED_ADMIN["whatsapp_number"],
                is_active=True,
                is_verified=True,
            )
            db.add(admin_user)
            db.commit()

        # 2. Seed Site Settings if not present
        existing_settings = db.query(SiteSettings).first()
        if not existing_settings:
            logger.info("Initializing site settings ledger...")
            settings_obj = SiteSettings()
            db.add(settings_obj)
            db.commit()

        # 3. Seed Sample Messages if empty
        if db.query(ContactMessage).count() == 0:
            logger.info("Seeding sample contact messages for admin desk...")
            for msg in SEED_MESSAGES:
                db.add(ContactMessage(**msg))
            db.commit()

        # 4. Seed Sample Quote Requests if empty
        if db.query(QuoteRequest).count() == 0:
            logger.info("Seeding sample project quote briefs...")
            for qr in SEED_QUOTES:
                db.add(QuoteRequest(**qr))
            db.commit()

        # 5. Seed Core Services if empty
        if db.query(Service).count() == 0:
            logger.info("Seeding engineering capabilities...")
            for srv in SEED_SERVICES:
                db.add(Service(**srv))
            db.commit()

        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error("Database initialization error: %s", e)
        db.rollback()
    finally:
        if close_session:
            db.close()

