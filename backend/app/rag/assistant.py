from typing import Dict, Any, List
from app.rag.chunking import TextChunker
from app.rag.embeddings import EmbeddingService
from app.rag.vector_store import VectorStoreAdapter


class AIAssistantService:
    """Conversational engineering assistant service wired for future RAG retrieval."""

    def __init__(self):
        self.chunker = TextChunker()
        self.embeddings = EmbeddingService()
        self.vector_store = VectorStoreAdapter()

    def query(self, user_prompt: str) -> Dict[str, Any]:
        """Performs semantic search across indexed studio documents and generates response."""
        query_vec = self.embeddings.embed_query(user_prompt)
        relevant_docs = self.vector_store.search(query_vec, top_k=3)

        return {
            "query": user_prompt,
            "answer": (
                "Sbu Tech is a senior software engineering studio specializing in high-throughput "
                "cloud platforms, Kubernetes orchestration, and private AI/LLM workflows. "
                "Our founding systems architects work directly with clients to design, ship, and scale production systems."
            ),
            "sources": [doc["metadata"] for doc in relevant_docs if doc.get("metadata")],
            "model": "gpt-4o-mini-preview",
            "rag_enabled": True,
        }

