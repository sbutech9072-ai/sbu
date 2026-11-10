import json
import math
import re
import logging
from collections import Counter
from pathlib import Path
from typing import Dict, Any, List, Optional

from ai.config.settings import settings

logger = logging.getLogger("sbuweb.ai.retrieval.bm25_search")


def tokenize_multilingual(text: str) -> List[str]:
    """
    Multilingual tokenizer supporting English, Bengali, emails, URLs, and numbers.
    """
    if not text:
        return []

    lowered = text.lower()
    raw_tokens = re.findall(
        r"[a-z0-9_]+(?:[@./-][a-z0-9_]+)*|[\u0980-\u09FF]+",
        lowered,
    )

    stopwords = {
        "the", "is", "are", "was", "were", "a", "an", "and", "or", "of",
        "to", "in", "on", "for", "with", "at", "by", "from", "as", "be",
        "this", "that", "it", "can", "will", "do", "does",
    }

    tokens = [t for t in raw_tokens if t not in stopwords and len(t) > 1]

    expanded: List[str] = []
    for t in tokens:
        if "@" in t or "/" in t or "." in t:
            subparts = [p for p in re.split(r"[@./-]", t) if len(p) > 1]
            expanded.extend(subparts)

    tokens.extend(expanded)
    return tokens


class BM25SearchEngine:
    """
    In-memory BM25Okapi search engine for lexical retrieval.
    Builds index directly from `ai/data/chunks.jsonl` at startup without disk cache clutter.
    """

    def __init__(
        self,
        chunks_file: Optional[Path] = None,
        k1: float = 1.5,
        b: float = 0.75,
    ):
        self.k1 = k1
        self.b = b

        self.corpus: List[Dict[str, Any]] = []
        self.doc_len: Dict[str, int] = {}
        self.avg_doc_len: float = 0.0
        self.doc_freq: Dict[str, int] = {}
        self.inverted_index: Dict[str, Dict[str, int]] = {}
        self.num_docs: int = 0

        self.build_index_from_chunks(chunks_file)

    def build_index_from_chunks(
        self,
        chunks_file: Optional[Path] = None,
    ) -> None:
        """
        Constructs the in-memory BM25 index using approved public chunks.
        """
        source_chunks_file = chunks_file or settings.CHUNKS_JSONL_FILE
        if not source_chunks_file.exists():
            logger.warning("Chunks file not found at %s. Empty BM25 index.", source_chunks_file)
            return

        with open(source_chunks_file, "r", encoding="utf-8") as f:
            all_chunks = [json.loads(line) for line in f if line.strip()]

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

        for c in approved_chunks:
            cid = c["chunk_id"]
            full_text = f"{c.get('section_title', '')} {c.get('content', '')}"
            tokens = tokenize_multilingual(full_text)
            self.doc_len[cid] = len(tokens)
            total_tokens += len(tokens)

            tf = Counter(tokens)
            for term, count in tf.items():
                if term not in self.inverted_index:
                    self.inverted_index[term] = {}
                self.inverted_index[term][cid] = count

        self.avg_doc_len = total_tokens / max(1, self.num_docs)
        self.doc_freq = {term: len(postings) for term, postings in self.inverted_index.items()}

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
        """
        query_tokens = tokenize_multilingual(query)
        if not query_tokens or self.num_docs == 0:
            return []

        scores: Dict[str, float] = {c["chunk_id"]: 0.0 for c in self.corpus}

        for term in query_tokens:
            if term not in self.inverted_index:
                continue
            idf = self._idf(term)
            postings = self.inverted_index[term]

            for cid, tf in postings.items():
                dl = self.doc_len[cid]
                numerator = tf * (self.k1 + 1.0)
                denominator = tf + self.k1 * (1.0 - self.b + self.b * (dl / self.avg_doc_len))
                scores[cid] += idf * (numerator / denominator)

        scored_docs = [(cid, sc) for cid, sc in scores.items() if sc > 0.0]
        scored_docs.sort(key=lambda x: x[1], reverse=True)

        chunk_lookup = {c["chunk_id"]: c for c in self.corpus}
        max_raw_score = scored_docs[0][1] if scored_docs else 1.0

        results: List[Dict[str, Any]] = []
        for cid, raw_score in scored_docs[:top_k]:
            chunk = chunk_lookup[cid]
            norm_score = round(raw_score / max(max_raw_score, 1.0), 4)
            results.append({
                "chunk_id": cid,
                "document_id": chunk.get("document_id", settings.DOCUMENT_ID),
                "source_file": chunk.get("source_file", "SBU_TECH.pdf"),
                "page_number": chunk.get("page_number", 1),
                "section_title": chunk.get("section_title", "Unknown Section"),
                "original_text": chunk.get("content", ""),
                "content_type": chunk.get("content_type", "general_knowledge"),
                "bm25_raw_score": round(raw_score, 4),
                "lexical_score": norm_score,
                "retrieval_method": "bm25",
            })

        return results
