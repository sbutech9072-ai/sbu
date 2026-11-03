# SBU Web: Enterprise Web Platform & Decoupled Backend API

A clean, modern, and production-ready full-stack software application containing an independent **Backend API** (Node.js + Express + TypeScript + Zod + Supabase integration) and an extensive **Frontend Application** (Next.js 14 App Router + TypeScript + Tailwind CSS).

---

## 📁 Project Structure

```text
sbuweb/
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.ts         # Supabase client & connectivity verification
│   │   ├── routes/
│   │   │   └── auth.routes.ts      # Authentication & profile endpoints
│   │   ├── schemas/
│   │   │   └── auth.schema.ts      # Zod validation schemas
│   │   └── app.ts                  # Express server & /api/v1 router
│   ├── setup-supabase.ps1          # One-step local Supabase setup for Windows
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (website)/          # Public website routes
│   │   │   │   ├── page.tsx        # Modern homepage with hero & interactive sections
│   │   │   │   ├── about/          # Company history & vision
│   │   │   │   ├── services/       # Services list & detailed slug pages
│   │   │   │   ├── projects/       # Portfolio case studies & slug pages
│   │   │   │   ├── team/           # Engineering leadership & team overview
│   │   │   │   ├── blog/           # Technical engineering blog & articles
│   │   │   │   ├── contact/        # Direct contact & inquiry page
│   │   │   │   ├── get-a-quote/    # Interactive multi-step quote request
│   │   │   │   ├── login/          # Client & partner authentication portal
│   │   │   │   ├── auth/           # Route alias to /login
│   │   │   │   └── privacy-policy/ # Privacy terms & policies
│   │   │   ├── admin/              # Comprehensive Administrative Suite
│   │   │   │   ├── page.tsx        # Overview dashboard with analytics & metrics
│   │   │   │   ├── blogs/          # Blog publishing & content management
│   │   │   │   ├── login/          # Admin credential gateway
│   │   │   │   ├── messages/       # Inbound contact inquiries inbox
│   │   │   │   ├── projects/       # Case study project management
│   │   │   │   ├── quote-requests/ # Client quote request tracker
│   │   │   │   ├── services/       # Service offerings management
│   │   │   │   ├── settings/       # Organization & branding settings
│   │   │   │   ├── team/           # Team member management
│   │   │   │   └── testimonials/   # Client review moderation
│   │   │   ├── layout.tsx          # Root layout & SEO metadata
│   │   │   └── globals.css         # Styling, theme tokens & custom scrollbars
│   │   ├── components/             # Reusable UI primitives, sections & admin layout
│   │   ├── data/                   # Mock and seed content collections
│   │   ├── features/               # Domain-specific feature modules
│   │   ├── hooks/                  # Custom React hooks (debounce, media query)
│   │   └── types/                  # Global TypeScript contracts
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── next.config.mjs
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 🛠 Backend API Routes

Mounted under `/api/v1`:

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health check with Supabase connectivity status | `200 OK` |
| `POST` | `/api/v1/auth/client/register` | Client registration validation (Zod schema) | `503 / Configured` |
| `POST` | `/api/v1/auth/client/login` | Client credentials validation | `503 / Configured` |
| `POST` | `/api/v1/auth/owner/login` | Owner administrative login validation | `503 / Configured` |
| `GET` | `/api/v1/client/profile` | Client profile retrieval | `503 / Configured` |
| `PATCH` | `/api/v1/client/profile` | Client profile update | `503 / Configured` |

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run build     # Verify TypeScript compilation
npm run dev       # Start development server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build     # Compile Next.js production build
npm run dev       # Start Next.js development server on http://localhost:3000
```

---

## 🌿 Repository Branches
- `main` - Stable, consolidated production branch with all backend and frontend features
- `sanket` - Sanket's feature branch
- `utsob` - Utsob's feature branch
- `borson` - Borson's feature branch
