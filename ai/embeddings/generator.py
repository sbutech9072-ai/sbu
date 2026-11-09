import hashlib
import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

from ai.config.settings import settings
from ai.embeddings.gemini_client import (
    GeminiEmbeddingClient,
    GeminiQuotaExceededError,
    GeminiAuthError,
)

logger = logging.getLogger("sbuweb.ai.embeddings.generator")


def format_chunk_document_input(section_title: Optional[str], content: str) -> str:
    """
    Formats the chunk text per Gemini Embedding 2 specifications:
    `title: {section_title} | text: {chunk_content}`
    """
    clean_title = (section_title or "none").strip()
    clean_content = content.strip()
    return f"title: {clean_title} | text: {clean_content}"


def calculate_content_hash(text: str) -> str:
    """Generates SHA-256 hash for document content to track incremental updates."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


class DocumentEmbeddingGenerator:
    """
    Orchestrates chunk filtering, privacy exclusion, batch processing,
    checkpointing, and embedding generation via Gemini API.
    """

    def __init__(
        self,
        gemini_client: Optional[GeminiEmbeddingClient] = None,
        cache_file: Optional[Path] = None,
        excluded_file: Optional[Path] = None,
    ):
        self.gemini_client = gemini_client or GeminiEmbeddingClient()
        self.cache_file = cache_file or settings.EMBEDDING_CACHE_FILE
        self.excluded_file = excluded_file or settings.EXCLUDED_CHUNKS_FILE
        self.dimension = settings.GEMINI_EMBEDDING_DIMENSION
        self.model = settings.GEMINI_EMBEDDING_MODEL

        settings.ensure_directories()
        self._cache = self._load_cache()

    def _load_cache(self) -> Dict[str, Any]:
        """Loads cached embeddings from disk."""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning("Could not load embedding cache: %s. Starting fresh.", e)
        return {"version": "1.0", "model": self.model, "dimension": self.dimension, "embeddings": {}}

    def _save_cache(self) -> None:
        """Flushes the current embedding cache to disk."""
        self.cache_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.cache_file, "w", encoding="utf-8") as f:
            json.dump(self._cache, f, indent=2, ensure_ascii=False)

    def filter_chunks_for_privacy(
        self,
        chunks: List[Dict[str, Any]],
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Applies strict data privacy filters (Section 9):
        Excludes chunks containing unfilled template placeholders, internal assistant rule
        metaprompts, confidential credentials, or unapproved contracts.
        Public portal guidance, client FAQs, and service descriptions are approved.
        """
        approved_chunks: List[Dict[str, Any]] = []
        excluded_chunks: List[Dict[str, Any]] = []

        for chunk in chunks:
            exclusion_reasons: List[str] = []
            content = chunk.get("content", "")
            content_lower = content.lower()
            section_title = chunk.get("section_title", "").lower()

            # 1. Unresolved template placeholders
            if "[add" in content_lower or "[insert" in content_lower or "[tbd]" in content_lower or "[todo]" in content_lower:
                exclusion_reasons.append("Contains unfilled template placeholder text.")

            # 2. Internal assistant prompt rules (metaprompt instructions, not public studio facts)
            if "rules for the website ai assistant" in section_title or "rules for the website ai assistant" in content_lower:
                exclusion_reasons.append("Internal AI assistant behavioral rules (intended as system prompt, not public vector index).")

            # 3. Confidential credentials check
            if "api_key" in content_lower or "client_secret" in content_lower or "password:" in content_lower:
                exclusion_reasons.append("Potential sensitive credential or secret key pattern detected.")

            if exclusion_reasons:
                excluded_chunks.append({
                    "chunk_id": chunk.get("chunk_id"),
                    "document_id": chunk.get("document_id"),
                    "page_number": chunk.get("page_number"),
                    "section_title": chunk.get("section_title"),
                    "reasons": exclusion_reasons,
                    "content_snippet": content[:140] + "..." if len(content) > 140 else content,
                })
            else:
                approved_chunks.append(chunk)

        # Save exclusion report
        self.excluded_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.excluded_file, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "generated_at": datetime.now(timezone.utc).isoformat(),
                    "total_input_chunks": len(chunks),
                    "approved_chunks_count": len(approved_chunks),
                    "excluded_chunks_count": len(excluded_chunks),
                    "excluded_chunks": excluded_chunks,
                },
                f,
                indent=2,
                ensure_ascii=False,
            )

        logger.info(
            "Privacy filtering complete: %d approved, %d excluded.",
            len(approved_chunks),
            len(excluded_chunks),
        )
        return approved_chunks, excluded_chunks

    def generate_embeddings_for_chunks(
        self,
        chunks: List[Dict[str, Any]],
        mock_embedding_for_testing: bool = False,
    ) -> List[Dict[str, Any]]:
        """
        Generates 1536-dimensional embeddings for each approved chunk.
        Uses incremental cache to avoid redundant API calls.
        """
        # Validate cache model compatibility
        if self._cache.get("model") != self.model or self._cache.get("dimension") != self.dimension:
            logger.warning("Cache embedding model/dimension changed. Invalidating stale cache.")
            self._cache = {
                "version": "1.0",
                "model": self.model,
                "dimension": self.dimension,
                "embeddings": {},
            }

        cached_embeddings = self._cache.setdefault("embeddings", {})
        embedded_records: List[Dict[str, Any]] = []

        total = len(chunks)
        new_generations = 0
        cache_hits = 0

        for idx, chunk in enumerate(chunks, 1):
            chunk_id = chunk["chunk_id"]
            section_title = chunk.get("section_title", "none")
            content = chunk["content"]

            formatted_input = format_chunk_document_input(section_title, content)
            content_hash = calculate_content_hash(formatted_input)
            cache_key = f"{self.model}:{self.dimension}:{content_hash}"

            # Check cache
            if cache_key in cached_embeddings:
                vector = cached_embeddings[cache_key]["vector"]
                cache_hits += 1
            else:
                logger.info(
                    "Generating embedding for chunk [%d/%d] (%s)...",
                    idx,
                    total,
                    chunk_id,
                )
                if mock_embedding_for_testing:
                    # Deterministic normalized mock vector for testing without API calls
                    seed = int(content_hash[:8], 16)
                    vector = [((seed + i) % 1000) / 1000.0 for i in range(self.dimension)]
                    # Normalize
                    norm = sum(x * x for x in vector) ** 0.5
                    vector = [x / norm for x in vector]
                else:
                    vector = self.gemini_client.embed_text(
                        formatted_input,
                        custom_dimension=self.dimension,
                    )

                # Update cache
                cached_embeddings[cache_key] = {
                    "chunk_id": chunk_id,
                    "content_hash": content_hash,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "vector": vector,
                }
                new_generations += 1

                # Save checkpoint every 5 items
                if new_generations % 5 == 0:
                    self._save_cache()

            embedded_records.append({
                "chunk_id": chunk_id,
                "document_id": chunk.get("document_id", settings.DOCUMENT_ID),
                "source_file": chunk.get("source_file", "SBU_TECH.pdf"),
                "page_number": chunk.get("page_number", 1),
                "section_title": section_title,
                "chunk_index": chunk.get("chunk_index", idx),
                "content_type": chunk.get("content_type", "general_knowledge"),
                "content_hash": content_hash,
                "original_text": content,
                "formatted_input": formatted_input,
                "embedding_model": self.model,
                "embedding_dimension": self.dimension,
                "vector": vector,
            })

        # Final cache save
        if new_generations > 0:
            self._save_cache()

        logger.info(
            "Embedding process complete for %d chunks (Cache hits: %d, API calls: %d)",
            total,
            cache_hits,
            new_generations,
        )
        return embedded_records
