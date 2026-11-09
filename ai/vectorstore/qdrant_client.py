import logging
from pathlib import Path
from typing import Optional
from qdrant_client import QdrantClient

from ai.config.settings import settings

logger = logging.getLogger("sbuweb.ai.vectorstore.client")


class QdrantLocalManager:
    """
    Manages connections to the local persistent Qdrant vector database.
    Ensures safe initialization and closure of local disk storage.
    """

    _client_instance: Optional[QdrantClient] = None
    _current_path: Optional[str] = None

    @classmethod
    def get_client(cls, storage_path: Optional[Path] = None) -> QdrantClient:
        """
        Retrieves or creates a singleton local QdrantClient instance for the specified path.
        Default storage location: `ai/storage/qdrant/`
        """
        target_path = str(storage_path or settings.resolved_qdrant_path)

        # If existing client is active on the same path, reuse it
        if cls._client_instance is not None:
            if cls._current_path == target_path:
                return cls._client_instance
            else:
                cls.close()

        logger.info("Initializing local Qdrant database at: %s", target_path)
        settings.ensure_directories()
        cls._client_instance = QdrantClient(path=target_path)
        cls._current_path = target_path
        return cls._client_instance

    @classmethod
    def close(cls) -> None:
        """Safely closes the Qdrant connection and releases disk locks."""
        if cls._client_instance is not None:
            try:
                cls._client_instance.close()
            except Exception as e:
                logger.warning("Error while closing QdrantClient: %s", e)
            finally:
                cls._client_instance = None
                cls._current_path = None
