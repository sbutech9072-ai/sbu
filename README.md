# SBU Web: Enterprise Web Platform & High-Throughput FastAPI Backend

A clean, modern, and production-ready full-stack software application containing an independent **Backend API** (Python 3.13 + FastAPI + SQLAlchemy 2.0 + Pydantic v2 + Supabase & Google integration) and an extensive **Frontend Application** (Next.js 14 App Router + TypeScript + Tailwind CSS).

---

## 📁 Project Structure

```text
sbuweb/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/       # Health, Auth, Client, Contact, Quotes, Admin, CMS, AI
│   │   ├── core/                   # Config, security (bcrypt & JWT), country whitelist
│   │   ├── database/               # SQLAlchemy session, init_db, and seed data
│   │   ├── integrations/           # Google OAuth2 & Supabase Auth telemetry
│   │   ├── models/                 # SQLAlchemy 2.0 declarative database models
│   │   ├── rag/                    # Chunking, embeddings, vector store & assistant
│   │   ├── repositories/           # Isolated data access layer
│   │   ├── schemas/                # Pydantic v2 input/output validation contracts
│   │   └── services/               # Business logic & email notification
│   ├── tests/                      # Automated API & validation test suites
│   ├── Dockerfile                  # Production container definition
│   ├── requirements.txt            # Python dependencies
│   ├── run.py                      # Uvicorn entrypoint (Port 5000)
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (website)/          # Public website routes (Home, About, Services, Projects, Team, Contact, Get-a-Quote, Login)
│   │   │   ├── admin/              # Comprehensive Administrative Suite (Messages, Quotes, Projects, Services, Team, Settings)
│   │   │   ├── layout.tsx          # Root layout & SEO metadata
│   │   │   └── globals.css         # Styling, theme tokens & custom scrollbars
│   │   ├── components/             # Reusable UI primitives, sections & admin layout
│   │   ├── data/                   # Mock and seed content collections
│   │   ├── features/               # Domain-specific feature modules
│   │   └── types/                  # Global TypeScript contracts
│   ├── package.json
│   ├── next.config.mjs             # Reverse proxy routing /api/* to backend on port 5000
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 🛠 Preserved Backend API Routes (`/api/v1`)

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health check with Supabase & DB telemetry | `200 OK` |
| `POST` | `/api/v1/auth/client/register` | Client account registration (Pydantic validation) | `200 OK` |
| `POST` | `/api/v1/auth/client/login` | Client credentials authentication (JWT token) | `200 OK` |
| `POST` | `/api/v1/auth/owner/login` | Owner & Administrator console login | `200 OK` |
| `POST` | `/api/v1/auth/google` | Google One-Tap / OAuth2 identity verification | `200 OK` |
| `GET` | `/api/v1/client/profile` | Client profile retrieval | `200 OK` |
| `PATCH` | `/api/v1/client/profile` | Client profile update | `200 OK` |
| `POST` | `/api/v1/contact` | Inbound consultation inquiry submission | `201 Created` |
| `POST` | `/api/v1/quotes` | Project scope estimation request | `201 Created` |
| `GET` | `/api/v1/admin/stats` | Control Desk metrics & KPIs | `200 OK` |
| `GET` | `/api/v1/admin/messages` | List inbound messages | `200 OK` |
| `PATCH` | `/api/v1/admin/messages/{id}` | Update message status (`new`, `read`, `replied`) | `200 OK` |
| `GET` | `/api/v1/admin/quotes` | List project scope briefs | `200 OK` |
| `PATCH` | `/api/v1/admin/quotes/{id}` | Update quote request status | `200 OK` |
| `POST` | `/api/v1/ai/chat` | RAG-ready conversational engineering assistant | `200 OK` |

---

## 🚀 Getting Started Locally

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python run.py       # Starts FastAPI server on http://localhost:5000
```
- Swagger UI Documentation: `http://localhost:5000/api/docs`
- ReDoc Documentation: `http://localhost:5000/api/redoc`

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev         # Starts Next.js development server on http://localhost:3000
```
The frontend automatically proxies `/api/*` to the FastAPI backend running on port 5000.
