# SBU TECH Backend — AI Adapter Layer

> **Note:** All AI-related development, data preprocessing, chunking, embeddings, vector storage, and inference logic have been centralized into the root **[`/ai`](../../ai)** workspace.

This backend module serves exclusively as the **FastAPI integration adapter** bridging incoming HTTP API requests (`/api/v1/ai/chat`) to the centralized `ai` package.

---

## Directory Overview

```text
backend/app/rag/
├── __init__.py           # Re-exports AIAssistantService and migration adapters
├── assistant.py          # FastAPI service adapter querying the central AI engine
└── README.md             # This notice
```

For AI ingestion, chunking, embeddings, vector databases, and evaluation, please refer to the central AI documentation:

👉 **[Root AI Documentation](../../ai/README.md)**
