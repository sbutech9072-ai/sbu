import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.database.init_db import init_db

# Initialize database
init_db()

client = TestClient(app)


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert "framework" in data
    assert "FastAPI" in data["framework"]
    assert "supabaseConnected" in data
    assert "database" in data
    print("✓ Health endpoint OK")


def test_auth_and_profile_flow():
    # 1. Register a new test client
    test_email = "testclient_migration@sbutech.com"
    reg_payload = {
        "fullName": "Test Client Organization",
        "email": test_email,
        "password": "Password123!",
        "country": "United States of America",
        "whatsappNumber": "+14155550199",
    }
    reg_res = client.post("/api/v1/auth/client/register", json=reg_payload)
    # If already registered from previous run, login instead
    if reg_res.status_code == 400:
        login_res = client.post(
            "/api/v1/auth/client/login",
            json={"email": test_email, "password": "Password123!"},
        )
        assert login_res.status_code == 200
        token = login_res.json()["accessToken"]
    else:
        assert reg_res.status_code == 200
        data = reg_res.json()
        assert data["success"] is True
        assert "accessToken" in data
        assert data["user"]["email"] == test_email
        token = data["accessToken"]

    print("✓ Client registration / login OK")

    # 2. Get profile with token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == test_email
    print("✓ Authenticated /me endpoint OK")

    # 3. Update client profile
    patch_res = client.patch(
        "/api/v1/client/profile",
        headers=headers,
        json={"fullName": "Updated Client Org", "country": "Canada"},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["fullName"] == "Updated Client Org"
    assert patch_res.json()["country"] == "Canada"
    print("✓ Client profile update OK")


def test_owner_admin_login_and_desk():
    # Login as default seeded admin
    admin_payload = {
        "email": "admin@sbutech.internal",
        "password": "password123",
    }
    login_res = client.post("/api/v1/auth/owner/login", json=admin_payload)
    assert login_res.status_code == 200
    data = login_res.json()
    assert data["user"]["role"] in ["admin", "owner"]
    token = data["accessToken"]
    admin_headers = {"Authorization": f"Bearer {token}"}

    # Fetch admin stats
    stats_res = client.get("/api/v1/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "totalMessages" in stats
    assert "totalQuotes" in stats
    print("✓ Owner login and Admin Stats OK")

    # Fetch messages
    msg_res = client.get("/api/v1/admin/messages", headers=admin_headers)
    assert msg_res.status_code == 200
    messages = msg_res.json()
    assert len(messages) > 0
    first_msg_id = messages[0]["id"]

    # Update message status
    patch_msg = client.patch(
        f"/api/v1/admin/messages/{first_msg_id}",
        headers=admin_headers,
        json={"status": "read"},
    )
    assert patch_msg.status_code == 200
    assert patch_msg.json()["status"] == "read"
    print("✓ Admin Messages moderation OK")

    # Fetch quote requests
    quotes_res = client.get("/api/v1/admin/quotes", headers=admin_headers)
    assert quotes_res.status_code == 200
    quotes = quotes_res.json()
    assert len(quotes) > 0
    print("✓ Admin Quotes listing OK")


def test_public_contact_form():
    contact_payload = {
        "name": "Sarah Connor",
        "email": "sarah@cyberdyne.org",
        "phone": "+1 (555) 901-2000",
        "subject": "Distributed Systems Consultation",
        "message": "We need to re-architect our autonomous ingest pipeline using FastAPI and Kafka.",
    }
    res = client.post("/api/v1/contact", json=contact_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Sarah Connor"
    assert data["status"] == "new"
    print("✓ Public Contact Form submission OK")


def test_public_quote_request():
    quote_payload = {
        "fullName": "Marcus Brody",
        "companyName": "Museum Logistics Inc",
        "email": "m.brody@museumlogistics.com",
        "phone": "+1 415 555 8899",
        "serviceCategory": "Cloud Architecture & DevOps",
        "budgetRange": "$50,000 - $100,000",
        "timeline": "3 - 6 Months",
        "projectOverview": "Building an automated artifact cataloging system with OCR and indexing.",
        "featuresNeeded": ["Cloud Infrastructure", "Vector Search"],
    }
    res = client.post("/api/v1/quotes", json=quote_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["companyName"] == "Museum Logistics Inc"
    assert data["status"] == "pending"
    print("✓ Public Quote Request submission OK")


def test_cms_and_ai_endpoints():
    # 1. Services
    srv_res = client.get("/api/v1/services")
    assert srv_res.status_code == 200
    assert len(srv_res.json()) > 0
    print("✓ CMS Services listing OK")

    # 2. Site Settings
    settings_res = client.get("/api/v1/settings")
    assert settings_res.status_code == 200
    assert settings_res.json()["companyName"] == "Sbu Tech"
    print("✓ Public Site Settings OK")

    # 3. AI / RAG Chat Assistant
    ai_res = client.post(
        "/api/v1/ai/chat",
        json={"message": "What cloud architecture practices does Sbu Tech specialize in?"},
    )
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    assert "answer" in ai_data
    assert ai_data["rag_enabled"] is True
    print("✓ AI / RAG Chat Assistant OK")


if __name__ == "__main__":
    test_health_check()
    test_auth_and_profile_flow()
    test_owner_admin_login_and_desk()
    test_public_contact_form()
    test_public_quote_request()
    test_cms_and_ai_endpoints()
    print("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")
