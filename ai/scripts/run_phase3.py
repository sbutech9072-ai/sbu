#!/usr/bin/env python3
"""
SBU TECH AI Subsystem — Phase 3 CLI Runner
Executes Advanced Retrieval, Hybrid Search (Dense + BM25 RRF),
and automated evaluation benchmarks.
"""
import sys
import json
import logging
from pathlib import Path

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.retrieval.retriever import retrieve_context
from ai.evaluation.retrieval_evaluator import RetrievalEvaluator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("sbuweb.ai.phase3.runner")


def display_top5_query(query_title: str, question: str, mode: str = "hybrid"):
    print("\n" + "=" * 70)
    print(f"🔍 QUERY: {query_title}")
    print(f"Question: \"{question}\" (Mode: {mode})")
    print("=" * 70)

    res = retrieve_context(question=question, top_k=5, search_mode=mode)
    has_context = res["has_relevant_context"]

    print(f"Status:             {'Relevant Context Found' if has_context else 'ABSTAINED (No Relevant Context)'}")
    print(f"Detected Script:    {res['detected_script']}")
    print(f"Execution Time:     {res['execution_time_ms']} ms")
    if not has_context:
        print(f"Abstention Reason:  {res['abstention_reason']}")
        return

    print("\nTop-5 Retrieved Candidates:")
    print(f"{'#':<3} | {'Section Title':<38} | {'Pg':<3} | {'Dense':<6} | {'Lexical':<7} | {'Fusion':<8} | {'Method'}")
    print("-" * 88)
    for idx, c in enumerate(res["retrieved_chunks"], 1):
        sec = c["section_title"][:36]
        pg = c["page_number"]
        dense = f"{c.get('dense_score', 0.0):.4f}"
        lex = f"{c.get('lexical_score', 0.0):.4f}"
        fus = f"{c.get('final_fusion_score', 0.0):.5f}"
        method = c.get("retrieval_method", "")
        print(f"{idx:<3} | {sec:<38} | {pg:<3} | {dense:<6} | {lex:<7} | {fus:<8} | {method}")


def main():
    print("=" * 78)
    print("🚀 SBU TECH AI SUBSYSTEM — PHASE 3: ADVANCED RETRIEVAL & HYBRID SEARCH")
    print("=" * 78)
    print(f"Embedding Model:         {settings.GEMINI_EMBEDDING_MODEL}")
    print(f"Vector Dimensions:       {settings.GEMINI_EMBEDDING_DIMENSION}")
    print(f"Qdrant Collection:       {settings.QDRANT_COLLECTION_NAME}")
    print(f"Lexical Engine:          BM25Okapi (Multilingual Tokenizer)")
    print(f"Rank Fusion:             Reciprocal Rank Fusion (RRF, k=60)")
    print("-" * 78)

    # Key Evaluation Queries
    test_queries = [
        ("Test A (Bangla Regression - Owners)", "এসবিইউ টেকের প্রধান প্রতিষ্ঠাতা এবং অংশীদার কারা?"),
        ("Test B (Client Portal Login)", "How do clients log in to the SBU TECH client portal?"),
        ("Core Capabilities", "What services does SBU TECH provide?"),
        ("Company Identity", "What is SBU TECH?"),
        ("Contact Details", "How can I contact SBU TECH?"),
        ("Project Inquiries", "How do I request a project quote?"),
        ("Technology Stack", "What technologies does SBU TECH use?"),
        ("No-Answer Abstention (Out-of-Domain)", "How many employees does SBU TECH currently have?"),
    ]

    for title, q in test_queries:
        display_top5_query(title, q, mode="hybrid")

    # Run Benchmark Across All Modes
    print("\n" + "=" * 78)
    print("📊 RUNNING RETRIEVAL BENCHMARK: DENSE vs. BM25 vs. HYBRID SEARCH")
    print("=" * 78)

    evaluator = RetrievalEvaluator()
    bench_results = evaluator.run_benchmark(top_k=5)
    comps = bench_results["mode_comparisons"]

    print("\n" + "-" * 78)
    print(f"{'Metric':<32} | {'Dense-Only':<12} | {'BM25-Only':<12} | {'Hybrid (RRF)':<12}")
    print("-" * 78)

    metrics_keys = [
        ("Top-1 Accuracy", "top_1_accuracy"),
        ("Hit@3 Accuracy", "hit_at_3"),
        ("Hit@5 Accuracy", "hit_at_5"),
        ("Mean Reciprocal Rank (MRR)", "mean_reciprocal_rank"),
        ("Mean nDCG@5", "mean_ndcg_at_5"),
        ("No-Answer Abstention Acc.", "no_answer_abstention_accuracy"),
    ]

    for label, k in metrics_keys:
        d_val = f"{comps['dense']['metrics'][k]:.4f}"
        b_val = f"{comps['bm25']['metrics'][k]:.4f}"
        h_val = f"{comps['hybrid']['metrics'][k]:.4f}"
        print(f"{label:<32} | {d_val:<12} | {b_val:<12} | {h_val:<12}")

    print("-" * 78)
    print("Full benchmark results saved to: ai/evaluation/retrieval_results.json")
    print("=" * 78)


if __name__ == "__main__":
    main()

