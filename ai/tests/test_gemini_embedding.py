import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.embeddings.gemini_client import (
    GeminiEmbeddingClient,
    GeminiAuthError,
    GeminiQuotaExceededError,
)
from ai.embeddings.query_embedding import (
    QueryEmbeddingService,
    format_query_input,
)
from ai.embeddings.generator import (
    DocumentEmbeddingGenerator,
    format_chunk_document_input,
    calculate_content_hash,
)


def test_env_loading():
    """Item 1: Environment variable loading from ai/.env."""
    assert settings.GEMINI_EMBEDDING_MODEL == "gemini-embedding-2"
    assert settings.GEMINI_EMBEDDING_DIMENSION == 1536
    assert settings.QDRANT_COLLECTION_NAME == "sbu_tech_knowledge_base"
    print("✓ Test 1: Environment Variable Loading Passed")


def test_api_key_validation():
    """Item 2: API key validation and placeholder detection."""
    # Placeholder key must return False
    assert settings.is_gemini_api_key_valid() is False or len(settings.GEMINI_API_KEY) > 20
    # Client must raise GeminiAuthError if key is placeholder
    if not settings.is_gemini_api_key_valid():
        client = GeminiEmbeddingClient()
        try:
            client._ensure_client()
            assert False, "Should have raised GeminiAuthError for placeholder key"
        except GeminiAuthError:
            pass
    print("✓ Test 2: API Key Validation & Placeholder Detection Passed")


def test_formatting_templates():
    """Item 4 & 6: Document and Query formatting format specifications."""
    doc_input = format_chunk_document_input("Company overview", "SBU TECH is a software studio.")
    assert doc_input == "title: Company overview | text: SBU TECH is a software studio."

    doc_none = format_chunk_document_input(None, "Fallback content")
    assert doc_none == "title: none | text: Fallback content"

    query_input = format_query_input("Who are the owners?")
    assert query_input == "task: search result | query: Who are the owners?"
    print("✓ Test 3: Formatting Templates (Document & Query) Passed")


def test_vector_dimension_validation():
    """Item 5: 1536-dimensional vector validation."""
    generator = DocumentEmbeddingGenerator()
    test_chunks = [{
        "chunk_id": "test_c001",
        "document_id": "test_doc",
        "source_file": "SBU_TECH.pdf",
        "page_number": 1,
        "section_title": "Overview",
        "chunk_index": 1,
        "content_type": "company_overview",
        "content": "SBU TECH is a software studio in Rangpur, Bangladesh.",
        "review_required": False,
    }]

    # Run in mock mode to verify vector dimensionality and record assembly
    records = generator.generate_embeddings_for_chunks(test_chunks, mock_embedding_for_testing=True)
    assert len(records) == 1
    assert len(records[0]["vector"]) == 1536
    assert records[0]["embedding_dimension"] == 1536
    assert records[0]["embedding_model"] == "gemini-embedding-2"
    print("✓ Test 4: 1536-Dimensional Vector Validation Passed")


def test_privacy_and_guardrail_filtering():
    """Item 9: Data privacy & guardrail filtering (Section 9 exclusions)."""
    generator = DocumentEmbeddingGenerator()
    sample_chunks = [
        {
            "chunk_id": "valid_01",
            "section_title": "Services",
            "content": "Custom web application and cloud architecture engineering.",
            "review_required": False,
        },
        {
            "chunk_id": "invalid_01",
            "section_title": "Admin",
            "content": "The admin portal operates in Mock Admin Mode without database.",
            "review_required": True,
        },
        {
            "chunk_id": "invalid_02",
            "section_title": "Contract",
            "content": "Standard fee agreement [ADD OFFICIAL CONTRACT NUMBER] pending.",
            "review_required": False,
        },
        {
            "chunk_id": "invalid_03",
            "section_title": "Compliance",
            "content": "Do not claim that SBU TECH is SOC 2 or HIPAA certified.",
            "review_required": False,
        },
    ]

    approved, excluded = generator.filter_chunks_for_privacy(sample_chunks)
    assert len(approved) == 1
    assert approved[0]["chunk_id"] == "valid_01"
    assert len(excluded) == 3
    excluded_ids = [e["chunk_id"] for e in excluded]
    assert "invalid_01" in excluded_ids
    assert "invalid_02" in excluded_ids
    assert "invalid_03" in excluded_ids
    print("✓ Test 5: Data Privacy & Excluded Chunks Guardrail Passed")


def test_multilingual_query_formatting():
    """Item 15: Multilingual query preservation (no auto-translation)."""
    languages_to_test = [
        ("Bangla", "এসবিইউ টেক কী ধরণের সেবা প্রদান করে?"),
        ("Arabic", "ما هي الخدمات التي تقدمها شركة SBU TECH؟"),
        ("Hindi", "एसबीयू टेक कौन सी सेवाएं प्रदान करता है?"),
        ("Chinese", "SBU TECH 提供哪些软件工程服务？"),
        ("Japanese", "SBU TECH はどのようなソフトウェア開発サービスを提供していますか？"),
        ("French", "Quels services de génie logiciel propose SBU TECH ?"),
        ("German", "Welche Software-Engineering-Dienstleistungen bietet SBU TECH an?"),
        ("Spanish", "¿Qué servicios de ingeniería de software ofrece SBU TECH?"),
    ]

    for lang_name, query_text in languages_to_test:
        formatted = format_query_input(query_text)
        assert query_text in formatted
        assert formatted.startswith("task: search result | query: ")

    print("✓ Test 6: Multilingual Query Formatting Passed (Bangla, Arabic, Hindi, Chinese, Japanese, European)")


if __name__ == "__main__":
    print("\nRunning Gemini Embedding & Configuration Test Suite...\n")
    test_env_loading()
    test_api_key_validation()
    test_formatting_templates()
    test_vector_dimension_validation()
    test_privacy_and_guardrail_filtering()
    test_multilingual_query_formatting()
    print("\n🎉 ALL GEMINI EMBEDDING CONFIGURATION TESTS PASSED!\n")

