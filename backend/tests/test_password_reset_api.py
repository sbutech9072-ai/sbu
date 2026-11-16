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
from app.core.security import get_password_hash, verify_password
from app.core.otp import OTPPurpose
from app.database.session import get_db
from app.models.otp_verification import OTPVerification
from app.models.user import User, UserRole
from app.services.otp_service import OTPService

GENERIC_RESPONSE = {
    "success": True,
    "message": "If the email is registered, an OTP has been sent.",
}


class PasswordResetAPITests(unittest.TestCase):
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

    def _create_user(self, email="person@example.com"):
        with self.session_factory() as db:
            user = User(
                email=email,
                hashed_password=get_password_hash("old-password-123"),
                full_name="Existing Client",
                role=UserRole.CLIENT,
                is_active=True,
                is_verified=True,
            )
            db.add(user)
            db.commit()

    def _request_reset(self, email="person@example.com"):
        response = self.client.post(
            "/api/v1/auth/password-reset/send-otp",
            json={"email": email},
        )
        code = None
        if self.send_email.called:
            match = re.search(
                r"\b([0-9]{6})\b",
                self.send_email.call_args.kwargs["text_body"],
            )
            code = match.group(1) if match else None
        return response, code

    def _verify_payload(self, otp, **overrides):
        payload = {
            "email": "person@example.com",
            "otp": otp,
            "newPassword": "new-password-123",
            "confirmPassword": "new-password-123",
        }
        payload.update(overrides)
        return payload

    def test_send_otp_returns_same_generic_response_for_registered_and_unknown_email(self):
        unknown_response, _ = self._request_reset("unknown@example.com")
        self.assertEqual(unknown_response.status_code, 200)
        self.assertEqual(unknown_response.json(), GENERIC_RESPONSE)
        self.send_email.assert_not_called()
        with self.session_factory() as db:
            self.assertEqual(db.query(OTPVerification).count(), 0)

        self._create_user()
        registered_response, code = self._request_reset()

        self.assertEqual(registered_response.status_code, 200)
        self.assertEqual(registered_response.json(), GENERIC_RESPONSE)
        self.assertIsNotNone(code)
        self.send_email.assert_called_once()
        self.assertEqual(self.send_email.call_args.kwargs["recipient"], "person@example.com")
        with self.session_factory() as db:
            record = db.query(OTPVerification).one()
            self.assertEqual(record.purpose, OTPPurpose.PASSWORD_RESET.value)

    def test_send_otp_keeps_generic_response_when_email_delivery_fails(self):
        self._create_user()
        self.send_email.return_value = False

        response, _ = self._request_reset()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), GENERIC_RESPONSE)

    def test_send_otp_keeps_generic_response_during_resend_cooldown(self):
        self._create_user()
        first_response, _ = self._request_reset()
        second_response, _ = self._request_reset()

        self.assertEqual(first_response.status_code, 200)
        self.assertEqual(second_response.status_code, 200)
        self.assertEqual(first_response.json(), GENERIC_RESPONSE)
        self.assertEqual(second_response.json(), GENERIC_RESPONSE)
        self.send_email.assert_called_once()

    def test_valid_reset_code_updates_password_and_returns_no_token(self):
        self._create_user()
        send_response, code = self._request_reset()
        self.assertEqual(send_response.status_code, 200)

        response = self.client.post(
            "/api/v1/auth/password-reset/verify",
            json=self._verify_payload(code),
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "success": True,
            "message": "Password reset successfully.",
        })
        self.assertNotIn("accessToken", response.json())
        with self.session_factory() as db:
            user = db.query(User).filter_by(email="person@example.com").one()
            self.assertTrue(verify_password("new-password-123", user.hashed_password))
            self.assertFalse(verify_password("old-password-123", user.hashed_password))
            self.assertTrue(db.query(OTPVerification).one().is_used)

    def test_invalid_code_does_not_change_password(self):
        self._create_user()
        _, code = self._request_reset()
        wrong_code = "000000" if code != "000000" else "000001"

        response = self.client.post(
            "/api/v1/auth/password-reset/verify",
            json=self._verify_payload(wrong_code),
        )

        self.assertEqual(response.status_code, 400)
        with self.session_factory() as db:
            user = db.query(User).filter_by(email="person@example.com").one()
            self.assertTrue(verify_password("old-password-123", user.hashed_password))

    def test_password_mismatch_is_rejected(self):
        self._create_user()
        response = self.client.post(
            "/api/v1/auth/password-reset/verify",
            json=self._verify_payload(
                "123456",
                confirmPassword="different-password",
            ),
        )

        self.assertEqual(response.status_code, 422)
        with self.session_factory() as db:
            user = db.query(User).filter_by(email="person@example.com").one()
            self.assertTrue(verify_password("old-password-123", user.hashed_password))

    def test_signup_code_cannot_be_used_for_password_reset(self):
        self._create_user()
        with self.session_factory() as db:
            signup_code = OTPService.create_otp(db, "person@example.com", OTPPurpose.SIGNUP)

        response = self.client.post(
            "/api/v1/auth/password-reset/verify",
            json=self._verify_payload(signup_code),
        )

        self.assertEqual(response.status_code, 400)
        with self.session_factory() as db:
            user = db.query(User).filter_by(email="person@example.com").one()
            self.assertTrue(verify_password("old-password-123", user.hashed_password))


if __name__ == "__main__":
    unittest.main()
