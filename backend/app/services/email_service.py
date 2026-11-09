import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def send_notification(subject: str, body: str, recipient: str = None) -> bool:
        """Dispatches an email notification via SMTP if configured; logs otherwise."""
        target = recipient or settings.EMAILS_FROM_EMAIL
        if not settings.SMTP_HOST or not settings.SMTP_USER:
            logger.info("[MOCK EMAIL DISPATCH] To: %s | Subject: %s | Body Preview: %s", target, subject, body[:120])
            return True

        try:
            msg = MIMEMultipart()
            msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
            msg["To"] = target
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "html"))

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)

            logger.info("Email notification successfully sent to %s", target)
            return True
        except Exception as e:
            logger.error("Failed to send email notification: %s", e)
            return False

