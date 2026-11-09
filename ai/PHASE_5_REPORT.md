# SBU TECH AI Knowledge Base — Phase 5: FastAPI Backend Integration Report

**Status:** Completed & Validated  
**Workspace Directory:** `backend/` & `ai/`  
**FastAPI Service Layer:** `backend/app/services/ai_chat.py`  
**Endpoints:** `POST /api/ai/chat`, `GET /api/ai/health`, `POST /api/ai/session/new`, `GET /api/ai/session/{session_id}/history` (and `/api/v1/ai/...` parity)  
**Database Session Store:** SQLite (`backend/sbuweb.db`, tables: `chat_sessions`, `chat_messages`)  
**Rate Limiting:** Sliding window 30 req/min (`backend/app/middleware/ai_rate_limiter.py`)  

---

## 1. Executive Summary

Phase 5 completes the integration between the SBU TECH FastAPI backend and the root `ai/` RAG subsystem. All core AI business logic, embedding math, hybrid retrieval, and LLM answer generation remain strictly centralized within `ai/`, while FastAPI provides the production API endpoints, database-backed conversation session management, input validation, rate limiting, and health monitoring.

---

## 2. API Endpoints & Request/Response Contracts

### 1. Grounded Chat Generation
- **Method & Path:** `POST /api/ai/chat` (also available via `POST /api/v1/ai/chat`)
- **Headers:** `Content-Type: application/json`
- **Rate Limit:** 30 requests / minute per client IP

#### Request Payload:
```json
{
  "session_id": "sbu_chat_800b5222185b4274",
  "message": "What services does SBU TECH provide?",
  "language": "English"
}
```

#### Response Payload (200 OK):
```json
{
  "session_id": "sbu_chat_800b5222185b4274",
  "answer": "SBU TECH specializes in senior-led software engineering services, including: 1. Full-stack web and mobile application development [sbu_tech_kb_v1_p2_c006], 2. AI engineering, LLM integration, and enterprise RAG systems, 3. Cloud infrastructure, Kubernetes, and DevOps pipelines [sbu_tech_kb_v1_p2_c006].",
  "status": "answered",
  "language": "Latin",
  "sources": [
    {
      "chunk_id": "sbu_tech_kb_v1_p2_c006",
      "source_file": "SBU_TECH.pdf",
      "page_number": 2,
      "section_title": "4. What SBU TECH does"
    }
  ],
  "model": "deepseek-flash",
  "request_id": "req_c34b102919ab"
}
```

---

### 2. Diagnostic Health Check
- **Method & Path:** `GET /api/ai/health` (also `GET /api/v1/ai/health`)
- **Security:** Never returns API keys or database connection strings.

#### Response Payload (200 OK):
```json
{
  "status": "healthy",
  "backend_available": true,
  "ai_module_available": true,
  "qdrant_connected": true,
  "embedding_ready": true,
  "llm_ready": true,
  "collection_name": "sbu_tech_knowledge_base",
  "model": "deepseek-flash"
}
```

---

### 3. Session Initialization & Reset
- **Method & Path:** `POST /api/ai/session/new`

#### Response Payload (200 OK):
```json
{
  "session_id": "sbu_chat_f718a93cb10940d9",
  "message": "New conversation session initialized successfully."
}
```

---

### 4. Session Message History
- **Method & Path:** `GET /api/ai/session/{session_id}/history`

#### Response Payload (200 OK):
```json
{
  "session_id": "sbu_chat_f718a93cb10940d9",
  "total_messages": 2,
  "messages": [
    {
      "role": "user",
      "content": "What services does SBU TECH provide?",
      "status": null,
      "created_at": "2026-11-10T00:59:20.778102+00:00"
    },
    {
      "role": "assistant",
      "content": "SBU TECH specializes in senior-led software engineering...",
      "status": "answered",
      "created_at": "2026-11-10T00:59:20.781204+00:00"
    }
  ]
}
```

---

## 3. Session Management & Database Persistence

### Database Schema (`backend/sbuweb.db`)
Conversation state is persisted in SQLite using SQLAlchemy:

1. **`chat_sessions` Table**:
   - `id` (VARCHAR(64), Primary Key): Unique session ID.
   - `user_id` (INTEGER, FK to `users.id`, Nullable): Linked if visitor is logged into Client Portal.
   - `visitor_ip` (VARCHAR(45)): Client IP for rate-limiting and session auditing.
   - `language` (VARCHAR(20)): Detected or preferred language.
   - `is_active` (BOOLEAN): Status flag.
   - `created_at`, `updated_at`: Timestamps.

2. **`chat_messages` Table**:
   - `id` (INTEGER, Primary Key): Turn index.
   - `session_id` (VARCHAR(64), FK to `chat_sessions.id`, Cascade Delete).
   - `role` (VARCHAR(20)): `"user"` or `"assistant"`.
   - `content` (TEXT): Message text.
   - `status` (VARCHAR(50)): Response status (`"answered"`, `"no_relevant_information"`, etc.).
   - `sources_json` (TEXT): Serialized list of verified citation sources.
   - `created_at`: Timestamp.

### Conversational Continuity
When a visitor sends a follow-up query (e.g. *"Explain the first one"*):
1. `AIChatService` loads the last 4 conversation turns from `chat_messages`.
2. Passes them to `ai.llm.conversation.ConversationManager`.
3. The query is reformulated for hybrid retrieval: `"What services does SBU TECH provide? : Explain the first one."`
4. Retrieval pulls Chunk 6 (`4. What SBU TECH does`), and DeepSeek elaborates on the first service.

---

## 4. Security & Error Handling

1. **Input Validation**: `ChatRequest` schema enforces `min_length=1` and `max_length=2000`. Empty strings produce HTTP 400 with structured validation errors.
2. **Rate Limiting**: `AIRateLimiter` tracks client IP timestamps in an in-memory sliding window (30 req / 60s). Exceeding the threshold triggers HTTP 429.
3. **Session Isolation**: Each visitor session has an isolated history; requests with non-existent session IDs automatically spin up a fresh session without crossing data boundaries.
4. **Credential Protection**: Health checks and error responses sanitize internal configuration, omitting all API keys and database credentials.
5. **No-Answer Abstention**: Queries on unanswerable company topics return clean 200 OK responses with `status: "no_relevant_information"` and empty sources, preserving wallet credits.

---

## 5. Automated Test Suite Results

All 8 integration tests pass cleanly:

```powershell
python -m unittest backend/tests/test_ai_endpoints.py
```

| Test Case | Description | Result |
| :--- | :--- | :---: |
| `test_01_health_check_endpoints` | Verifies `/api/ai/health` and `/api/v1/ai/health` without credential leaks | **PASSED** |
| `test_02_new_session_endpoint` | Verifies UUID session allocation via `POST /api/ai/session/new` | **PASSED** |
| `test_03_request_validation_empty_message` | Verifies HTTP 400 `VALIDATION_ERROR` on empty message | **PASSED** |
| `test_04_successful_chat_generation` | Verifies 200 OK with `session_id`, `answer`, `status`, `sources` | **PASSED** |
| `test_05_multi_turn_continuity` | Verifies follow-up query contextualization across turns | **PASSED** |
| `test_06_session_isolation` | Verifies separate sessions maintain completely isolated histories | **PASSED** |
| `test_07_no_answer_abstention` | Verifies polite abstention without hallucinated sources | **PASSED** |
| `test_08_api_v1_path_parity` | Verifies identical behavior across `/api/ai/chat` and `/api/v1/ai/chat` | **PASSED** |

---

## 6. Files Created & Modified

```
backend/
├── app/
│   ├── api/v1/endpoints/
│   │   └── ai.py                       # Updated: REST endpoints for chat, health, sessions
│   ├── core/
│   │   └── config.py                   # Updated: Robust SQLite path resolution for sbuweb.db
│   ├── database/
│   │   └── init_db.py                  # Updated: Imports ChatSession and ChatMessage for auto-table creation
│   ├── middleware/
│   │   └── ai_rate_limiter.py          # Created: Sliding window rate limiter dependency
│   ├── models/
│   │   ├── __init__.py                 # Updated: Exported ChatSession & ChatMessage
│   │   └── ai_session.py               # Created: SQLAlchemy models for sessions & message history
│   ├── schemas/
│   │   └── ai.py                       # Created: Pydantic schemas (ChatRequest, ChatResponse, Health, etc.)
│   ├── services/
│   │   └── ai_chat.py                  # Created: Central integration service calling ai.llm
│   └── main.py                         # Updated: Mounted /api/ai directly alongside /api/v1
└── tests/
    └── test_ai_endpoints.py            # Created: 8 integration test cases for Phase 5
```

---

## 7. How to Run the FastAPI Backend

```powershell
# From the project root:
cd backend
python run.py

# Or directly using uvicorn:
uvicorn app.main:app --host 127.0.0.1 --port 5000 --reload
```
Interactive API docs are available at: `http://127.0.0.1:5000/api/docs`.
