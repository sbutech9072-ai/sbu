#!/usr/bin/env python3
"""
Convenience entry point for running the SBU TECH AI Pipeline.
Usage:
  python ai/run_pipeline.py
"""
import sys
from pathlib import Path

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.scripts.run_ingestion import main

if __name__ == "__main__":
    main()

