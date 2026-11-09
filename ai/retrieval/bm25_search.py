import re
import json
import math
import logging
from collections import Counter
from pathlib import Path
from typing import Dict, Any, List, Optional, Set

from ai.config.settings import settings

logger = logging.getLogger("sbuweb.ai.retrieval.bm25")


def tokenize_multilingual(text: str) -> List[str]:
    """
    Multilingual tokenizer:
    - Extracts word tokens across Unicode scripts (Latin, Bengali, Arabic, Devanagari, etc.).
    - Preserves combining characters and vowel signs in Indic and Semitic scripts.
    - Extracts character unigrams and bigrams for CJK (Chinese/Japanese).
    - Converts to lowercase.
    """
    if not text:
        return []

    tokens: List[str] = []
    text_lower = text.lower()

    # 1. Exact email addresses and domain names
    emails = re.findall(r"[\w.-]+@[\w.-]+", text_lower)
    tokens.extend(emails)

    # 2. Regex word tokens across major script ranges including combining marks
    word_pattern = re.compile(
        r"[a-zA-Z0-9_\u0980-\u09FF\u0600-\u06FF\u0900-\u097F\u00C0-\u024F]+",
        re.UNICODE,
    )
    tokens.extend(word_pattern.findall(text_lower))

    # 2. Extract CJK characters and bi-grams
    cjk_chars = re.findall(r"[\u4E00-\u9FFF\u3040-\u30FF]", text_lower)
    if cjk_chars:
        tokens.extend(cjk_chars)
        for i in range(len(cjk_chars) - 1):
            tokens.append(cjk_chars[i] + cjk_chars[i + 1])

    return tokens


class BM25SearchEngine:
    """
    Local BM25Okapi search engine for lexical retrieval.
    Matches exact keywords, names, emails, URLs, technical terms, and multilingual tokens.
    """

    def __init__(
        self,
        index_dir: Optional[Path] = None,
        k1: float = 1.5,
        b: float = 0.75,
    ):
        self.index_dir = index_dir or (settings.DATA_DIR / "retrieval" / "bm25_index")
        self.index_file = self.index_dir / "bm25_index.json"
        self.k1 = k1
        self.b = b

        self.corpus: List[Dict[str, Any]] = []
        self.doc_len: Dict[str, int] = {}
        self.avg_doc_len: float = 0.0
        self.doc_freq: Dict[str, int] = {}
        self.inverted_index: Dict[str, Dict[str, int]] = {}
        self.num_docs: int = 0

        self._load_or_build_index()

    def _load_or_build_index(self) -> None:
        """Loads index from disk or builds from approved Phase 1 chunks."""
        if self.index_file.exists():
            try:
                with open(self.index_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.corpus = data["corpus"]
                    self.doc_len = data["doc_len"]
                    self.avg_doc_len = data["avg_doc_len"]
                    self.doc_freq = data["doc_freq"]
                    self.inverted_index = data["inverted_index"]
                    self.num_docs = len(self.corpus)
                    logger.info("Loaded BM25 index with %d documents from disk.", self.num_docs)
                    return
            except Exception as e:
                logger.warning("Failed loading BM25 index: %s. Rebuilding...", e)

        self.build_index_from_chunks()

    def build_index_from_chunks(
        self,
        chunks_file: Optional[Path] = None,
    ) -> None:
        """
        Constructs and persists the BM25 index using approved public chunks.
        """
        source_chunks_file = chunks_file or settings.CHUNKS_JSONL_FILE
        if not source_chunks_file.exists():
            logger.warning("Chunks file not found at %s. Empty BM25 index.", source_chunks_file)
            return

        with open(source_chunks_file, "r", encoding="utf-8") as f:
            all_chunks = [json.loads(line) for line in f if line.strip()]

        # Filter out internal rules (Section 9) and template placeholders
        approved_chunks = [
            c for c in all_chunks
            if "rules for the website ai assistant" not in c.get("section_title", "").lower()
            and "[add" not in c.get("content", "").lower()
        ]

        self.corpus = approved_chunks
        self.num_docs = len(approved_chunks)
        self.doc_len = {}
        self.inverted_index = {}
        total_tokens = 0

        # Build term frequencies per doc
        doc_tf: Dict[str, Counter] = {}
        for c in approved_chunks:
            cid = c["chunk_id"]
            full_text = f"{c.get('section_title', '')} {c.get('content', '')}"
            tokens = tokenize_multilingual(full_text)
            self.doc_len[cid] = len(tokens)
            total_tokens += len(tokens)

            tf = Counter(tokens)
            doc_tf[cid] = tf

            for term, count in tf.items():
                if term not in self.inverted_index:
                    self.inverted_index[term] = {}
                self.inverted_index[term][cid] = count

        self.avg_doc_len = total_tokens / max(1, self.num_docs)
        self.doc_freq = {term: len(postings) for term, postings in self.inverted_index.items()}

        # Save to disk
        self.index_dir.mkdir(parents=True, exist_ok=True)
        with open(self.index_file, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "corpus": self.corpus,
                    "doc_len": self.doc_len,
                    "avg_doc_len": self.avg_doc_len,
                    "doc_freq": self.doc_freq,
                    "inverted_index": self.inverted_index,
                },
                f,
                indent=2,
                ensure_ascii=False,
            )
        logger.info("BM25 index built and saved for %d chunks.", self.num_docs)

    def _idf(self, term: str) -> float:
        """Calculates Lucene/Okapi inverse document frequency."""
        df = self.doc_freq.get(term, 0)
        return math.log(((self.num_docs - df + 0.5) / (df + 0.5)) + 1.0)

    def search(
        self,
        query: str,
        top_k: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Executes lexical BM25 search for the given query string.
        Returns top_k ranked chunk records with lexical scores.
        """
        query_tokens = tokenize_multilingual(query)
        if not query_tokens or self.num_docs == 0:
            return []

        doc_scores: Dict[str, float] = {}

        for term in query_tokens:
            if term not in self.inverted_index:
                continue

            idf = self._idf(term)
            postings = self.inverted_index[term]

            for cid, tf in postings.items():
                dl = self.doc_len.get(cid, self.avg_doc_len)
                num = tf * (self.k1 + 1.0)
                den = tf + self.k1 * (1.0 - self.b + self.b * (dl / self.avg_doc_len))
                score = idf * (num / den)
                doc_scores[cid] = doc_scores.get(cid, 0.0) + score

        if not doc_scores:
            return []

        # Sort by score descending
        sorted_hits = sorted(doc_scores.items(), key=lambda x: x[1], reverse=True)[:top_k]
        max_score = sorted_hits[0][1] if sorted_hits else 1.0

        # Map to full chunk records
        chunk_map = {c["chunk_id"]: c for c in self.corpus}
        results: List[Dict[str, Any]] = []

        for rank, (cid, raw_score) in enumerate(sorted_hits, 1):
            chunk = chunk_map.get(cid)
            if not chunk:
                continue

            norm_score = round(raw_score / max(1e-5, max_score), 4)

            results.append({
                "chunk_id": cid,
                "document_id": chunk.get("document_id", settings.DOCUMENT_ID),
                "source_file": chunk.get("source_file", "SBU_TECH.pdf"),
                "page_number": chunk.get("page_number", 1),
                "section_title": chunk.get("section_title", "Unknown Section"),
                "original_text": chunk.get("content", ""),
                "content_type": chunk.get("content_type", "general_knowledge"),
                "lexical_raw_score": round(raw_score, 4),
                "lexical_score": norm_score,
                "lexical_rank": rank,
                "retrieval_method": "bm25",
            })

        return results
