import logging
import smtplib
import ssl
from email.message import EmailMessage
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def send_email(
        subject: str,
        recipient: str,
        text_body: str = "",
        html_body: str = "",
    ) -> bool:
        """Send a plain-text, HTML, or multipart email using the configured SMTP server."""
        smtp_host = settings.SMTP_HOST.strip()
        smtp_user = settings.SMTP_USER.strip()
        from_email = (settings.EMAILS_FROM_EMAIL or smtp_user).strip()
        from_name = (settings.EMAILS_FROM_NAME or "Sbu Tech Dispatch").strip()
        security = settings.SMTP_SECURITY.strip().lower()
        if not smtp_host or not settings.SMTP_PORT:
            logger.error("SMTP email is not configured: SMTP_HOST and SMTP_PORT are required")
            return False
        if not security:
            security = "ssl" if settings.SMTP_PORT == 465 else "starttls"
        if security not in {"starttls", "ssl"}:
            logger.error("SMTP email is not configured: SMTP_SECURITY must be starttls or ssl")
            return False
        if not smtp_user or "@" not in smtp_user:
            logger.error("SMTP email is not configured: SMTP_USER must be a full email address")
            return False
        if not settings.SMTP_PASSWORD or not from_email:
            logger.error("SMTP email is not configured: SMTP_PASSWORD and EMAILS_FROM_EMAIL are required")
            return False
        if not recipient or not (text_body or html_body):
            logger.error("Email recipient and at least one message body are required")
            return False

        message = EmailMessage()
        message["From"] = f"{from_name} <{from_email}>"
        message["To"] = recipient
        message["Subject"] = subject
        if text_body:
            message.set_content(text_body)
            if html_body:
                message.add_alternative(html_body, subtype="html")
        else:
            message.set_content(html_body, subtype="html")

        tls_context = ssl.create_default_context()
        try:
            if security == "ssl":
                server_context = smtplib.SMTP_SSL(
                    smtp_host,
                    settings.SMTP_PORT,
                    context=tls_context,
                    timeout=15,
                )
            else:
                server_context = smtplib.SMTP(
                    smtp_host,
                    settings.SMTP_PORT,
                    timeout=15,
                )

            with server_context as server:
                if security == "starttls":
                    server.starttls(context=tls_context)
                    server.ehlo()
                server.login(smtp_user, settings.SMTP_PASSWORD)
                server.send_message(message)

            logger.info("Email accepted by SMTP server for %s", recipient)
            return True
        except (smtplib.SMTPException, OSError, ssl.SSLError) as exc:
            logger.error("Failed to send email via SMTP (%s)", type(exc).__name__)
            return False

    @staticmethod
    def send_notification(
        subject: str,
        body: str,
        recipient: Optional[str] = None,
    ) -> bool:
        """Send an HTML notification to its configured recipient."""
        target = recipient or settings.EMAILS_FROM_EMAIL
        return EmailService.send_email(subject, target, html_body=body)

