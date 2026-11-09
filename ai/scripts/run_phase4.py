"""
Master CLI Runner for SBU TECH RAG Phase 4.
Runs the benchmark evaluation harness, validates citations and guardrails,
and verifies all Phase 4 unit and integration test suites.
"""

import sys
import unittest
import logging
from pathlib import Path

# Ensure root workspace is on path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from ai.config.settings import settings
from ai.evaluation.answer_evaluator import AnswerEvaluator

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("sbuweb.ai.scripts.run_phase4")


def run_benchmark():
    """Runs the 18-query evaluation benchmark."""
    print("=" * 70)
    print("🚀 RUNNING PHASE 4: AGENTROUTER + DEEPSEEK V4.1 FLASH BENCHMARK")
    print("=" * 70)

    evaluator = AnswerEvaluator(use_mock=True)
    metrics = evaluator.run_benchmark()

    print("\n📊 BENCHMARK EVALUATION SUMMARY:")
    print(f"  • Total Benchmark Queries:   {metrics['total_queries']}")
    print(f"  • Answerable Queries:        {metrics['answerable_queries']}")
    print(f"  • Unanswerable / OOD:        {metrics['unanswerable_queries']}")
    print(f"  • Status Accuracy:           {metrics['status_accuracy'] * 100:.1f}%")
    print(f"  • Abstention Accuracy:       {metrics['abstention_accuracy'] * 100:.1f}%")
    print(f"  • Total Tokens Processed:    {metrics['total_tokens_used']}")
    print(f"  • Total Credits Charged:     ${metrics['total_credits_charged']:.6f}")

    print("\n🔍 QUERY-BY-QUERY RESULTS:")
    print(f"{'ID':<25} | {'Language':<10} | {'Status':<16} | {'Context':<7} | {'Sources':<7} | {'Latency'}")
    print("-" * 80)
    for q in metrics["queries"]:
        ctx_str = "YES" if q["has_relevant_context"] else "NO"
        lat_str = f"{q['execution_time_ms']}ms"
        print(f"{q['id']:<25} | {q['language']:<10} | {q['status']:<16} | {ctx_str:<7} | {q['sources_count']:<7} | {lat_str}")

    return metrics


def run_all_tests():
    """Executes all Phase 4 unit tests."""
    print("\n" + "=" * 70)
    print("🧪 RUNNING PHASE 4 UNIT TEST SUITES")
    print("=" * 70)

    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    test_modules = [
        "ai.tests.test_agentrouter_client",
        "ai.tests.test_generation",
        "ai.tests.test_grounding",
        "ai.tests.test_citations",
        "ai.tests.test_multilingual_answers",
        "ai.tests.test_conversation",
        "ai.tests.test_prompt_injection",
    ]

    for mod_name in test_modules:
        mod_suite = loader.loadTestsFromName(mod_name)
        suite.addTests(mod_suite)

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    if result.wasSuccessful():
        print("\n🎉 ALL PHASE 4 UNIT TESTS PASSED SUCCESSFULLY!")
        return 0
    else:
        print(f"\n❌ {len(result.failures)} test(s) failed, {len(result.errors)} error(s).")
        return 1


if __name__ == "__main__":
    benchmark_metrics = run_benchmark()
    exit_code = run_all_tests()
    sys.exit(exit_code)

