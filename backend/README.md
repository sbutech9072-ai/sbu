# SBU TECH — High-Throughput FastAPI Backend

A high-performance, asynchronous REST API engineered with **Python 3.13**, **FastAPI**, **SQLAlchemy 2.0**, and **Pydantic v2**, replacing the legacy Node.js Express backend while preserving 100% of the domain (`https://www.sbutech.com`), URL routes, Supabase telemetry, and Google integrations.

---

## 🏗 Modular Architecture

```text
backend/
├── app/
│   ├── main.py              # FastAPI app instance, CORS & standardized exception handlers
│   ├── api/
│   │   └── v1/
│   │       ├── api.py       # Central API v1 router
│   │       └── endpoints/   # Domain-specific endpoint routers
│   │           ├── health.py        # /api/v1/health (Supabase telemetry)
│   │           ├── auth.py          # /api/v1/auth/* (register, login, owner, google)
│   │           ├── client.py        # /api/v1/client/* (profile management)
│   │           ├── contact.py       # /api/v1/contact (inbound consultation briefs)
│   │           ├── quotes.py        # /api/v1/quotes (project estimation briefs)
│   │           ├── admin.py         # /api/v1/admin/* (stats, messages, quotes moderation)
│   │           ├── cms.py           # /api/v1/services, /projects, /settings
│   │           └── ai.py            # /api/v1/ai/chat (RAG & assistant query)
│   ├── core/
│   │   ├── config.py        # Pydantic Settings & environment variables
│   │   ├── security.py      # Bcrypt password hashing & RFC 7519 JWT generator
│   │   └── countries.py     # Global country list validator
│   ├── models/              # SQLAlchemy 2.0 declarative database models
│   │   ├── base.py          # Declarative Base & TimestampMixin
│   │   ├── user.py          # User & UserRole (Client, Admin, Owner)
│   │   ├── contact.py       # ContactMessage entity
│   │   ├── quote.py         # QuoteRequest entity
│   │   └── cms.py           # Project, Service, TeamMember, Testimonial, SiteSettings
│   ├── schemas/             # Pydantic validation & response contracts
│   ├── database/
│   │   ├── session.py       # SQLAlchemy engine & get_db dependency
│   │   ├── init_db.py       # Auto-migration & seeding handler
│   │   └── seed_data.py     # Default admin & sample dataset
│   ├── repositories/        # Clean data-access abstraction layer
│   ├── services/            # Domain business logic & email notification
│   ├── integrations/
│   │   ├── google_auth.py   # Google OAuth2 / ID token verification
│   │   └── supabase_client.py # Async Supabase Auth API telemetry
│   └── rag/                 # RAG readiness (chunking, embeddings, vector store)
├── requirements.txt         # Production Python dependencies
├── run.py                   # Unified Uvicorn runner
└── Dockerfile               # Production container definition
```

---

## 🛠 Preserved API Endpoints (`/api/v1`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health telemetry & Supabase connectivity status | Public |
| `POST` | `/api/v1/auth/client/register` | Client account creation | Public |
| `POST` | `/api/v1/auth/client/login` | Client credential login | Public |
| `POST` | `/api/v1/auth/owner/login` | Owner & Administrator console login | Public |
| `POST` | `/api/v1/auth/google` | Google One-Tap / OAuth2 sign-in | Public |
| `GET` | `/api/v1/auth/me` | Current authenticated user profile | Bearer Token |
| `GET` | `/api/v1/client/profile` | Client profile retrieval | Bearer Token |
| `PATCH` | `/api/v1/client/profile` | Client profile update | Bearer Token |
| `POST` | `/api/v1/contact` | Submit inbound consultation note | Public |
| `POST` | `/api/v1/quotes` | Submit project scope estimation brief | Public |
| `GET` | `/api/v1/admin/stats` | Dashboard telemetry & metrics | Admin / Owner |
| `GET` | `/api/v1/admin/messages` | Inbound consultation messages ledger | Admin / Owner |
| `PATCH` | `/api/v1/admin/messages/{id}` | Update message status (`new`, `read`, `replied`) | Admin / Owner |
| `DELETE` | `/api/v1/admin/messages/{id}` | Delete message | Admin / Owner |
| `GET` | `/api/v1/admin/quotes` | Project scope briefs ledger | Admin / Owner |
| `PATCH` | `/api/v1/admin/quotes/{id}` | Update quote status | Admin / Owner |
| `DELETE` | `/api/v1/admin/quotes/{id}` | Delete quote brief | Admin / Owner |
| `GET` | `/api/v1/services` | List engineering capabilities | Public |
| `GET` | `/api/v1/projects` | List production case studies | Public |
| `GET` | `/api/v1/settings` | Public organization settings | Public |
| `PATCH` | `/api/v1/settings` | Update organization settings | Admin / Owner |
| `POST` | `/api/v1/ai/chat` | RAG-ready conversational assistant | Public |

---

## 🚀 Running Locally

```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
Server starts on `http://localhost:5000`.
- Interactive Swagger UI: `http://localhost:5000/api/docs`
- ReDoc Documentation: `http://localhost:5000/api/redoc`
---

## 🧠 Centralized AI & RAG Subsystem

All AI datasets, PDF ingestion, chunking, embeddings, vector stores, and model architectures are centralized inside the root **[`/ai`](../ai)** directory.

The backend provides the API integration layer at `/api/v1/ai/chat`.

To run AI ingestion or tests from the project root:
```bash
# Execute Phase 1 ingestion
python ai/scripts/run_ingestion.py

# Run AI test suite
python ai/tests/test_ingestion.py
```

For full documentation of the AI subsystem, refer to **[`ai/README.md`](../ai/README.md)**.

