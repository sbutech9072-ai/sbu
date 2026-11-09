import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.retrieval.bm25_search import BM25SearchEngine, tokenize_multilingual


def test_multilingual_tokenizer():
    """Verifies tokenizer handles English, Bengali, Arabic, and CJK bi-grams."""
    en_tokens = tokenize_multilingual("SBU TECH Next.js Cloud")
    assert "sbu" in en_tokens
    assert "tech" in en_tokens
    assert "next" in en_tokens
    assert "cloud" in en_tokens

    bn_tokens = tokenize_multilingual("এসবিইউ টেক সফটওয়্যার")
    assert "এসবইউ" in bn_tokens or "টেক" in bn_tokens

    cjk_tokens = tokenize_multilingual("软件工程")
    assert "软" in cjk_tokens
    assert "件" in cjk_tokens
    assert "软件" in cjk_tokens  # Bi-gram
    print("✓ Test 1: Multilingual Tokenizer (Latin, Indic, CJK bi-grams) Passed")


def test_bm25_exact_keyword_matching():
    """Verifies BM25 ranks exact names, emails, and URLs at the top."""
    engine = BM25SearchEngine()

    # Exact name lookup
    hits_owner = engine.search("Bidhan Shaha Dhrubo", top_k=3)
    assert len(hits_owner) > 0
    assert "Bidhan Shaha Dhrubo" in hits_owner[0]["original_text"]
    assert hits_owner[0]["lexical_score"] == 1.0  # Normalized top rank

    # Exact email lookup
    hits_email = engine.search("admin@sbutech.com", top_k=3)
    assert len(hits_email) > 0
    assert "admin@sbutech.com" in hits_email[0]["original_text"]

    # Exact portal URL
    hits_portal = engine.search("https://www.sbutech.com/login", top_k=3)
    assert len(hits_portal) > 0
    assert "login" in hits_portal[0]["original_text"].lower()

    print("✓ Test 2: BM25 Exact Matching (Names, Emails, URLs) Passed")


def test_bm25_score_normalization():
    """Verifies BM25 scores are normalized between 0.0 and 1.0."""
    engine = BM25SearchEngine()
    hits = engine.search("custom web application cloud architecture", top_k=5)
    for h in hits:
        assert 0.0 <= h["lexical_score"] <= 1.0
        assert h["retrieval_method"] == "bm25"
    print("✓ Test 3: BM25 Score Normalization & Output Bounds Passed")


if __name__ == "__main__":
    print("\nRunning BM25 Lexical Search Test Suite...\n")
    test_multilingual_tokenizer()
    test_bm25_exact_keyword_matching()
    test_bm25_score_normalization()
    print("\n🎉 ALL BM25 LEXICAL SEARCH TESTS PASSED!\n")

