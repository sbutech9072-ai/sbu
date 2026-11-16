import smtplib
import unittest
from unittest.mock import MagicMock, patch

from app.core.config import Settings, settings
from app.services.email_service import EmailService


class EmailServiceTests(unittest.TestCase):
    def test_zoho_variable_names_map_to_existing_settings(self):
        configured = Settings(
            _env_file=None,
            SMTP_HOST="smtp.example.test",
            SMTP_PORT=587,
            SMTP_SECURITY="starttls",
            SMTP_USERNAME="mailer@example.test",
            SMTP_PASSWORD="test-secret",
            MAIL_FROM_ADDRESS="mailer@example.test",
            MAIL_FROM_NAME="Test Mailer",
        )

        self.assertEqual(configured.SMTP_USER, "mailer@example.test")
        self.assertEqual(configured.EMAILS_FROM_EMAIL, "mailer@example.test")
        self.assertEqual(configured.SMTP_SECURITY, "starttls")

    def test_blank_smtp_port_is_left_unconfigured(self):
        configured = Settings(_env_file=None, SMTP_PORT="")

        self.assertIsNone(configured.SMTP_PORT)

    def setUp(self):
        self.settings_patcher = patch.multiple(
            settings,
            SMTP_HOST="smtp.example.test",
            SMTP_PORT=587,
            SMTP_SECURITY="starttls",
            SMTP_USER="mailer@example.test",
            SMTP_PASSWORD="test-secret",
            EMAILS_FROM_EMAIL="mailer@example.test",
            EMAILS_FROM_NAME="Test Mailer",
        )
        self.settings_patcher.start()
        self.addCleanup(self.settings_patcher.stop)

    def test_sends_plain_and_html_using_starttls(self):
        server = MagicMock()
        server.__enter__.return_value = server

        with patch("app.services.email_service.smtplib.SMTP", return_value=server) as smtp:
            sent = EmailService.send_email(
                subject="Test",
                recipient="recipient@example.test",
                text_body="Plain body",
                html_body="<p>HTML body</p>",
            )

        self.assertTrue(sent)
        smtp.assert_called_once_with("smtp.example.test", 587)
        server.starttls.assert_called_once()
        server.login.assert_called_once_with("mailer@example.test", "test-secret")
        message = server.send_message.call_args.args[0]
        self.assertEqual(message.get_content_type(), "multipart/alternative")

    def test_uses_ssl_without_starttls(self):
        settings.SMTP_PORT = 465
        settings.SMTP_SECURITY = "ssl"
        server = MagicMock()
        server.__enter__.return_value = server

        with patch("app.services.email_service.smtplib.SMTP_SSL", return_value=server) as smtp_ssl:
            sent = EmailService.send_email(
                subject="Test",
                recipient="recipient@example.test",
                text_body="Plain body",
            )

        self.assertTrue(sent)
        smtp_ssl.assert_called_once()
        server.starttls.assert_not_called()
        self.assertEqual(server.send_message.call_args.args[0].get_content_type(), "text/plain")

    def test_authentication_error_fails_without_logging_password(self):
        server = MagicMock()
        server.__enter__.return_value = server
        server.login.side_effect = smtplib.SMTPAuthenticationError(535, b"Denied")

        with patch("app.services.email_service.smtplib.SMTP", return_value=server):
            with self.assertLogs("app.services.email_service", level="ERROR") as logs:
                sent = EmailService.send_email(
                    subject="Test",
                    recipient="recipient@example.test",
                    text_body="Plain body",
                )

        self.assertFalse(sent)
        self.assertNotIn("test-secret", "\n".join(logs.output))

    def test_missing_configuration_does_not_report_mock_success(self):
        settings.SMTP_HOST = ""

        with patch("app.services.email_service.smtplib.SMTP") as smtp:
            self.assertFalse(
                EmailService.send_email(
                    subject="Test",
                    recipient="recipient@example.test",
                    text_body="Plain body",
                )
            )

        smtp.assert_not_called()


if __name__ == "__main__":
    unittest.main()
