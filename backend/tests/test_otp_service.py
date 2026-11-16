import re
import unittest
from datetime import datetime, timedelta, timezone

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.core.otp import OTPPurpose, generate_otp
from app.core.security import verify_password
from app.models.otp_verification import OTPVerification
from app.services.otp_service import (
    MAX_WRONG_ATTEMPTS,
    OTPCooldownError,
    OTPService,
)


class OTPServiceTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        OTPVerification.__table__.create(self.engine)
        self.db = Session(self.engine)

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_generator_returns_six_numeric_characters(self):
        self.assertRegex(generate_otp(), re.compile(r"^[0-9]{6}$"))

    def test_create_stores_only_a_bcrypt_hash(self):
        code = OTPService.create_otp(self.db, "Person@Example.com", OTPPurpose.SIGNUP)
        record = self.db.query(OTPVerification).one()

        self.assertEqual(record.email, "person@example.com")
        self.assertNotEqual(record.hashed_otp, code)
        self.assertTrue(verify_password(code, record.hashed_otp))
        self.assertEqual(record.wrong_attempts, 0)
        self.assertFalse(record.is_used)
        self.assertAlmostEqual(
            (record.expires_at - record.created_at).total_seconds(),
            300,
            delta=1,
        )

    def test_resend_cooldown_is_scoped_to_email_and_purpose(self):
        OTPService.create_otp(self.db, "person@example.com", OTPPurpose.SIGNUP)

        with self.assertRaises(OTPCooldownError) as raised:
            OTPService.create_otp(self.db, "person@example.com", OTPPurpose.SIGNUP)

        self.assertGreater(raised.exception.retry_after_seconds, 0)
        OTPService.create_otp(self.db, "person@example.com", OTPPurpose.PASSWORD_RESET)
        self.assertEqual(self.db.query(OTPVerification).count(), 2)

    def test_wrong_attempt_limit_invalidates_otp(self):
        code = OTPService.create_otp(self.db, "person@example.com", OTPPurpose.SIGNUP)

        for _ in range(MAX_WRONG_ATTEMPTS):
            self.assertFalse(
                OTPService.verify_otp(
                    self.db,
                    "person@example.com",
                    OTPPurpose.SIGNUP,
                    "000000" if code != "000000" else "000001",
                )
            )

        record = self.db.query(OTPVerification).one()
        self.assertEqual(record.wrong_attempts, MAX_WRONG_ATTEMPTS)
        self.assertTrue(record.is_used)
        self.assertFalse(
            OTPService.verify_otp(
                self.db,
                "person@example.com",
                OTPPurpose.SIGNUP,
                code,
            )
        )

    def test_successful_verification_is_one_time(self):
        code = OTPService.create_otp(self.db, "person@example.com", OTPPurpose.SIGNUP)

        self.assertTrue(
            OTPService.verify_otp(
                self.db,
                "PERSON@example.com",
                OTPPurpose.SIGNUP,
                code,
            )
        )
        self.assertFalse(
            OTPService.verify_otp(
                self.db,
                "person@example.com",
                OTPPurpose.SIGNUP,
                code,
            )
        )

    def test_expired_otp_is_invalidated(self):
        OTPService.create_otp(self.db, "person@example.com", OTPPurpose.SIGNUP)
        record = self.db.query(OTPVerification).one()
        record.expires_at = datetime.now(timezone.utc) - timedelta(seconds=1)
        self.db.commit()

        self.assertFalse(
            OTPService.verify_otp(
                self.db,
                "person@example.com",
                OTPPurpose.SIGNUP,
                "123456",
            )
        )
        self.assertTrue(record.is_used)


if __name__ == "__main__":
    unittest.main()
