"""
Backend AI Integration Layer.
Centralized AI architecture is located in the root `ai/` folder.
This module provides backward-compatible adapters for the FastAPI web layer.
"""
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.ingestion import (
    PDFExtractor as PDFLoader,
    DocumentCleaner,
    StructureAwareChunker,
    RAGIngestionPipeline,
)
from app.rag.assistant import AIAssistantService

__all__ = [
    "PDFLoader",
    "DocumentCleaner",
    "StructureAwareChunker",
    "RAGIngestionPipeline",
    "AIAssistantService",
]
