#!/usr/bin/env python3
"""
Backend convenience wrapper for the centralized AI ingestion pipeline.
All AI modules are centralized inside the root `ai/` folder.
"""
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.scripts.run_ingestion import main

if __name__ == "__main__":
    main()
