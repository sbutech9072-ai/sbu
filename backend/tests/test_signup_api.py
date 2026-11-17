import re
import unittest
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings

settings.DATABASE_URL = "sqlite://"

from app.api.v1.endpoints.auth import router as auth_router
from app.core.countries import COUNTRIES
from app.core.security import decode_access_token, verify_password
from app.database.session import get_db
from app.models.otp_verification import OTPVerification
from app.models.user import User, UserRole


class SignupOTPAPITests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        User.__table__.create(self.engine)
        OTPVerification.__table__.create(self.engine)
        self.session_factory = sessionmaker(
            bind=self.engine,
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
        )

        def override_get_db():
            db = self.session_factory()
            try:
                yield db
            finally:
                db.close()

        self.app = FastAPI()
        self.app.include_router(auth_router, prefix="/api/v1")
        self.app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(self.app)
        self.email_patcher = patch(
            "app.api.v1.endpoints.auth.EmailService.send_email",
            return_value=True,
        )
        self.send_email = self.email_patcher.start()

    def tearDown(self):
        self.email_patcher.stop()
        self.client.close()
        self.engine.dispose()

    def _send_otp(self, email="new@example.com"):
        response = self.client.post(
            "/api/v1/auth/signup/send-otp",
            json={"email": email},
        )
        code = None
        if self.send_email.called:
            match = re.search(r"\b([0-9]{6})\b", self.send_email.call_args.kwargs["text_body"])
            code = match.group(1) if match else None
        return response, code

    def _verify_payload(self, email, otp):
        return {
            "email": email,
            "otp": otp,
            "fullName": "New Client",
            "password": "valid-password-123",
            "country": COUNTRIES[0],
            "whatsappNumber": "123456789",
        }

    def test_send_otp_emails_code_without_creating_user(self):
        response, code = self._send_otp()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "OTP sent successfully.")
        self.assertIsNotNone(code)
        self.send_email.assert_called_once()
        self.assertEqual(self.send_email.call_args.kwargs["recipient"], "new@example.com")
        with self.session_factory() as db:
            self.assertIsNone(db.query(User).filter_by(email="new@example.com").first())
            record = db.query(OTPVerification).one()
            self.assertNotEqual(record.hashed_otp, code)
            self.assertTrue(verify_password(code, record.hashed_otp))

    def test_existing_email_is_rejected_without_sending_otp(self):
        with self.session_factory() as db:
            db.add(
                User(
                    email="existing@example.com",
                    hashed_password="hashed",
                    full_name="Existing User",
                    role=UserRole.CLIENT,
                    is_active=True,
                    is_verified=False,
                )
            )
            db.commit()

        response, _ = self._send_otp("existing@example.com")

        self.assertEqual(response.status_code, 400)
        self.send_email.assert_not_called()
        with self.session_factory() as db:
            self.assertEqual(db.query(OTPVerification).count(), 0)

    def test_verified_otp_creates_verified_user_and_returns_bearer_token(self):
        send_response, code = self._send_otp()
        self.assertEqual(send_response.status_code, 200)

        response = self.client.post(
            "/api/v1/auth/signup/verify",
            json=self._verify_payload("new@example.com", code),
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["tokenType"], "bearer")
        self.assertEqual(data["user"]["email"], "new@example.com")
        self.assertTrue(data["user"]["isActive"])
        self.assertTrue(data["user"]["isVerified"])
        self.assertIsNotNone(decode_access_token(data["accessToken"]))

        with self.session_factory() as db:
            user = db.query(User).filter_by(email="new@example.com").one()
            self.assertNotEqual(user.hashed_password, "valid-password-123")
            self.assertTrue(verify_password("valid-password-123", user.hashed_password))
            self.assertTrue(db.query(OTPVerification).one().is_used)

    def test_invalid_otp_does_not_create_user(self):
        send_response, code = self._send_otp()
        self.assertEqual(send_response.status_code, 200)
        wrong_code = "000000" if code != "000000" else "000001"

        response = self.client.post(
            "/api/v1/auth/signup/verify",
            json=self._verify_payload("new@example.com", wrong_code),
        )

        self.assertEqual(response.status_code, 400)
        with self.session_factory() as db:
            self.assertIsNone(db.query(User).filter_by(email="new@example.com").first())
            self.assertEqual(db.query(OTPVerification).one().wrong_attempts, 1)

    def test_email_delivery_failure_returns_service_unavailable(self):
        self.send_email.return_value = False

        response, _ = self._send_otp()

        self.assertEqual(response.status_code, 503)
        with self.session_factory() as db:
            self.assertIsNone(db.query(User).filter_by(email="new@example.com").first())
            self.assertEqual(db.query(OTPVerification).count(), 0)

        self.send_email.return_value = True
        retry_response, code = self._send_otp()
        self.assertEqual(retry_response.status_code, 200)
        self.assertIsNotNone(code)


if __name__ == "__main__":
    unittest.main()
