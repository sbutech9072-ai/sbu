import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Set
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, PointIdsList

from ai.config.settings import settings
from ai.vectorstore.qdrant_client import QdrantLocalManager
from ai.vectorstore.collection import QdrantCollectionManager

logger = logging.getLogger("sbuweb.ai.vectorstore.indexer")

# Namespace for deterministic Point UUID generation
SBU_QDRANT_NAMESPACE = uuid.UUID("3c8e3a2b-1a92-4f05-8e3d-0d67f53a9214")


def generate_stable_point_id(document_id: str, chunk_id: str) -> str:
    """Generates a deterministic UUIDv5 for a chunk to prevent duplicate points."""
    unique_key = f"{document_id}:{chunk_id}"
    return str(uuid.uuid5(SBU_QDRANT_NAMESPACE, unique_key))


class KnowledgeIndexer:
    """
    Manages incremental indexing of embedded chunks into the local Qdrant collection.
    Guarantees idempotency, duplicate prevention, and clean deletion of removed chunks.
    """

    def __init__(
        self,
        collection_manager: Optional[QdrantCollectionManager] = None,
        manifest_file: Optional[Path] = None,
    ):
        self.collection_manager = collection_manager or QdrantCollectionManager()
        self.manifest_file = manifest_file or settings.INDEXING_MANIFEST_FILE
        self.client: QdrantClient = self.collection_manager.client
        self.collection_name = self.collection_manager.collection_name
        self.model = settings.GEMINI_EMBEDDING_MODEL
        self.dimension = settings.GEMINI_EMBEDDING_DIMENSION

        settings.ensure_directories()
        self._manifest = self._load_manifest()

    def _load_manifest(self) -> Dict[str, Any]:
        """Loads the indexing manifest tracking indexed documents and chunk hashes."""
        if self.manifest_file.exists():
            try:
                with open(self.manifest_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning("Could not read indexing manifest: %s. Re-creating.", e)

        return {
            "manifest_version": "2.0",
            "embedding_model": self.model,
            "embedding_dimension": self.dimension,
            "documents": {},
        }

    def _save_manifest(self) -> None:
        """Flushes the indexing manifest to disk."""
        self.manifest_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.manifest_file, "w", encoding="utf-8") as f:
            json.dump(self._manifest, f, indent=2, ensure_ascii=False)

    def index_document_records(
        self,
        document_id: str,
        source_file: str,
        doc_sha256: str,
        records: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Incrementally indexes a set of embedded chunk records into Qdrant.
        Only embeds/upserts new or changed chunks, and deletes obsolete ones.
        """
        # 1. Ensure collection exists with correct schema
        self.collection_manager.ensure_collection()

        # 2. Check model compatibility in manifest
        if (
            self._manifest.get("embedding_model") != self.model
            or self._manifest.get("embedding_dimension") != self.dimension
        ):
            logger.warning("Embedding model or dimension changed in settings! Resetting indexing manifest.")
            self._manifest = {
                "manifest_version": "2.0",
                "embedding_model": self.model,
                "embedding_dimension": self.dimension,
                "documents": {},
            }

        docs_manifest = self._manifest.setdefault("documents", {})
        prev_doc_entry = docs_manifest.get(document_id, {})
        prev_chunk_hashes: Dict[str, str] = prev_doc_entry.get("chunk_hashes", {})
        prev_point_ids: Dict[str, str] = prev_doc_entry.get("point_ids", {})

        # Compute incoming chunk maps
        new_chunk_hashes: Dict[str, str] = {}
        new_point_ids: Dict[str, str] = {}
        points_to_upsert: List[PointStruct] = []

        upserted_count = 0
        skipped_count = 0

        for r in records:
            chunk_id = r["chunk_id"]
            content_hash = r["content_hash"]
            point_id = generate_stable_point_id(document_id, chunk_id)

            new_chunk_hashes[chunk_id] = content_hash
            new_point_ids[chunk_id] = point_id

            # If chunk is unchanged and was already indexed, skip upsert
            if prev_chunk_hashes.get(chunk_id) == content_hash:
                skipped_count += 1
                continue

            # Prepare PointStruct with complete payload
            payload = {
                "point_id": point_id,
                "chunk_id": chunk_id,
                "document_id": document_id,
                "source_file": source_file,
                "original_text": r["original_text"],
                "page_number": r["page_number"],
                "section_title": r["section_title"],
                "chunk_index": r["chunk_index"],
                "content_type": r["content_type"],
                "content_hash": content_hash,
                "embedding_model": self.model,
                "embedding_dimension": self.dimension,
            }

            points_to_upsert.append(
                PointStruct(
                    id=point_id,
                    vector=r["vector"],
                    payload=payload,
                )
            )
            upserted_count += 1

        # 3. Detect removed chunks that need deletion from Qdrant
        removed_chunk_ids = set(prev_chunk_hashes.keys()) - set(new_chunk_hashes.keys())
        deleted_count = 0

        if removed_chunk_ids:
            points_to_delete = [
                prev_point_ids[cid] for cid in removed_chunk_ids if cid in prev_point_ids
            ]
            if points_to_delete:
                logger.info(
                    "Deleting %d removed chunk vectors for document %s...",
                    len(points_to_delete),
                    document_id,
                )
                self.client.delete(
                    collection_name=self.collection_name,
                    points_selector=PointIdsList(points=points_to_delete),
                )
                deleted_count = len(points_to_delete)

        # 4. Upsert changed or new points in batch
        if points_to_upsert:
            logger.info(
                "Upserting %d points into Qdrant collection '%s'...",
                len(points_to_upsert),
                self.collection_name,
            )
            self.client.upsert(
                collection_name=self.collection_name,
                points=points_to_upsert,
            )

        # 5. Update and save manifest
        docs_manifest[document_id] = {
            "document_id": document_id,
            "source_file": source_file,
            "doc_sha256": doc_sha256,
            "last_indexed_at": datetime.now(timezone.utc).isoformat(),
            "total_chunks": len(records),
            "chunk_hashes": new_chunk_hashes,
            "point_ids": new_point_ids,
        }
        self._save_manifest()

        stats = self.collection_manager.get_stats()

        logger.info(
            "Document %s indexing complete: Upserted=%d, Skipped=%d, Deleted=%d. Total in Qdrant=%d",
            document_id,
            upserted_count,
            skipped_count,
            deleted_count,
            stats["points_count"],
        )

        return {
            "document_id": document_id,
            "total_chunks_processed": len(records),
            "upserted_points": upserted_count,
            "skipped_points": skipped_count,
            "deleted_points": deleted_count,
            "collection_total_points": stats["points_count"],
        }
