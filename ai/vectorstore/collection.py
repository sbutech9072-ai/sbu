import logging
from typing import Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PayloadSchemaType

from ai.config.settings import settings
from ai.vectorstore.qdrant_client import QdrantLocalManager

logger = logging.getLogger("sbuweb.ai.vectorstore.collection")


class IncompatibleVectorDimensionError(Exception):
    """Raised when existing Qdrant collection vector dimension does not match settings."""
    pass


class QdrantCollectionManager:
    """
    Manages Qdrant collection lifecycle: schema verification, vector parameters,
    and metadata indexing.
    """

    def __init__(
        self,
        collection_name: Optional[str] = None,
        dimension: Optional[int] = None,
        client: Optional[QdrantClient] = None,
    ):
        self.collection_name = collection_name or settings.QDRANT_COLLECTION_NAME
        self.dimension = dimension or settings.GEMINI_EMBEDDING_DIMENSION
        self.client = client or QdrantLocalManager.get_client()

    def ensure_collection(self) -> Dict[str, Any]:
        """
        Verifies or creates the Qdrant collection with 1536-dimensional Cosine vectors.
        Validates schema compatibility if collection already exists.
        """
        existing_collections = [
            c.name for c in self.client.get_collections().collections
        ]

        if self.collection_name in existing_collections:
            info = self.client.get_collection(self.collection_name)
            vector_size = info.config.params.vectors.size
            distance = info.config.params.vectors.distance

            if vector_size != self.dimension:
                raise IncompatibleVectorDimensionError(
                    f"Existing collection '{self.collection_name}' has dimension {vector_size}, "
                    f"but active configuration requires {self.dimension}. "
                    "A re-index or collection recreate is required."
                )

            logger.info(
                "Existing collection '%s' verified (Dim: %d, Distance: %s, Points: %d)",
                self.collection_name,
                vector_size,
                distance,
                info.points_count,
            )
            return {
                "collection_name": self.collection_name,
                "status": "existing",
                "dimension": vector_size,
                "distance": str(distance),
                "points_count": info.points_count,
            }

        # Create new collection
        logger.info(
            "Creating new Qdrant collection '%s' (Dim: %d, Distance: COSINE)...",
            self.collection_name,
            self.dimension,
        )
        self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(
                size=self.dimension,
                distance=Distance.COSINE,
            ),
        )

        # Create payload indexes
        payload_fields = [
            ("chunk_id", PayloadSchemaType.KEYWORD),
            ("document_id", PayloadSchemaType.KEYWORD),
            ("content_type", PayloadSchemaType.KEYWORD),
            ("source_file", PayloadSchemaType.KEYWORD),
            ("page_number", PayloadSchemaType.INTEGER),
        ]

        for field_name, schema in payload_fields:
            try:
                self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name=field_name,
                    field_schema=schema,
                )
            except Exception as e:
                logger.debug("Payload index creation notice for '%s': %s", field_name, e)

        return {
            "collection_name": self.collection_name,
            "status": "created",
            "dimension": self.dimension,
            "distance": "COSINE",
            "points_count": 0,
        }

    def get_stats(self) -> Dict[str, Any]:
        """Returns collection metrics."""
        info = self.client.get_collection(self.collection_name)
        return {
            "collection_name": self.collection_name,
            "points_count": info.points_count,
            "vectors_count": getattr(info, "vectors_count", info.points_count),
            "status": str(info.status),
            "dimension": info.config.params.vectors.size,
            "distance": str(info.config.params.vectors.distance),
        }

