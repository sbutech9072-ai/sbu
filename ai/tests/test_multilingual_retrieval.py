import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.retrieval.retriever import retrieve_context


def test_regression_test_b_portal_login():
    """
    Regression Test B:
    Query: 'How do clients log in to the SBU TECH client portal?'
    Must retrieve '7. Website portal & login guidance' or portal table in Top-1.
    """
    res = retrieve_context(
        question="How do clients log in to the SBU TECH client portal?",
        top_k=3,
        search_mode="hybrid",
    )

    assert res["has_relevant_context"] is True
    top_chunk = res["retrieved_chunks"][0]
    top_title = top_chunk["section_title"].lower()

    # Must match Section 7 portal guidance or portal table
    assert "7. website portal & login guidance" in top_title or "portal" in top_title
    assert "https://www.sbutech.com/login" in top_chunk["original_text"]
    assert top_chunk["page_number"] == 3

    print("✓ Test 1: Regression Test B (Portal Login Guidance -> Section 7) Resolved & Passed")


def test_regression_test_a_owners_bangla():
    """
    Regression Test A:
    Query: 'এসবিইউ টেকের প্রধান প্রতিষ্ঠাতা এবং অংশীদার কারা?'
    Must retrieve '2. Owners & leadership' or owner leadership table in Top ranks.
    """
    res = retrieve_context(
        question="এসবিইউ টেকের প্রধান প্রতিষ্ঠাতা এবং অংশীদার কারা?",
        top_k=3,
        search_mode="hybrid",
    )

    assert res["has_relevant_context"] is True
    assert res["detected_script"] == "Bengali"

    # Verify that Owners chunk (Page 1) is present in top hits with high relevance
    found_owners = False
    for c in res["retrieved_chunks"]:
        text = c["original_text"]
        title = c["section_title"].lower()
        if "bidhan shaha dhrubo" in text.lower() or "owners & leadership" in title or "name | role" in title:
            found_owners = True
            break

    assert found_owners, "Expected Section 2 Owners & leadership or owner table in top retrieved chunks"
    print("✓ Test 2: Regression Test A (Bangla Query -> Section 2 Owners & Leadership) Resolved & Passed")


def test_multilingual_cross_language_retrieval():
    """Verifies that non-English queries retrieve relevant English studio documents."""
    multilingual_queries = [
        ("Bangla", "এসবিইউ টেক কী ধরণের সেবা প্রদান করে?", "what sbu tech does"),
        ("Arabic", "ما هي الخدمات الهندسية التي تقدمها شركة SBU TECH؟", "what sbu tech does"),
        ("Chinese", "SBU TECH 提供哪些软件工程服务？", "what sbu tech does"),
        ("French", "Quels services d'ingénierie logicielle propose SBU TECH ?", "what sbu tech does"),
        ("Spanish", "¿Qué servicios de ingeniería de software ofrece SBU TECH?", "what sbu tech does"),
    ]

    for lang, q_text, expected_keyword in multilingual_queries:
        res = retrieve_context(question=q_text, top_k=3, search_mode="hybrid")
        assert res["has_relevant_context"] is True
        top_chunk = res["retrieved_chunks"][0]
        full_text = (top_chunk["section_title"] + " " + top_chunk["original_text"]).lower()
        assert expected_keyword in full_text, f"Failed cross-language match for {lang}"

    print("✓ Test 3: Cross-Language Semantic Retrieval (Bangla, Arabic, Chinese, French, Spanish) Passed")


if __name__ == "__main__":
    print("\nRunning Multilingual Retrieval & Regression Test Suite...\n")
    test_regression_test_b_portal_login()
    test_regression_test_a_owners_bangla()
    test_multilingual_cross_language_retrieval()
    print("\n🎉 ALL MULTILINGUAL RETRIEVAL & REGRESSION TESTS PASSED!\n")

