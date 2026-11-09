import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_invalid_client_registration():
    # Bad email and too short password and invalid country
    bad_payload = {
        "fullName": "A",
        "email": "not-an-email",
        "password": "short",
        "country": "Atlantis",
    }
    res = client.post("/api/v1/auth/client/register", json=bad_payload)
    assert res.status_code == 400
    data = res.json()
    assert data["success"] is False
    assert data["code"] == "VALIDATION_ERROR"
    assert "fullName" in data["errors"]
    assert "email" in data["errors"]
    assert "password" in data["errors"]
    assert "country" in data["errors"]
    print("✓ Registration validation error formatting OK:", data["errors"])

def test_invalid_contact_form():
    res = client.post("/api/v1/contact", json={"name": "A"})
    assert res.status_code == 400
    data = res.json()
    assert data["code"] == "VALIDATION_ERROR"
    print("✓ Contact form validation error formatting OK:", data["errors"])

if __name__ == "__main__":
    test_invalid_client_registration()
    test_invalid_contact_form()
    print("🎉 Validation tests passed!")

