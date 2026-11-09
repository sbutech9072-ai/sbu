"""
In-Memory Conversational Continuity and Follow-up Reference Resolution.
Enables multi-turn context retention, resolves anaphoric references (e.g. "the first one"),
and reformulates follow-up queries for knowledge-base retrieval.
"""

import re
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("sbuweb.ai.llm.conversation")

# Triggers indicating a query requires conversational context
FOLLOW_UP_PATTERNS = [
    r"\b(it|this|that|these|those)\b",
    r"\bthe (first|second|third|fourth|last) one\b",
    r"\b(explain|elaborate on|tell me more about) (it|that|this|the first)\b",
    r"\bwhat about\b",
    r"\bhow about\b",
    r"\band (pricing|cost|timeline|features)\b",
    r"(প্রথমটি|পরেরটি|এটা|সেটা|ওটা|এই বিষয়ে)",
]


class ConversationManager:
    """
    Manages short-term conversation turns and resolves follow-up queries
    into standalone search queries without allowing conversational history
    to override knowledge-base ground truth.
    """

    def __init__(self, max_history_turns: int = 6):
        self.max_history_turns = max_history_turns

    def is_follow_up_query(self, question: str) -> bool:
        """
        Detects if a user question depends on conversational antecedents.
        """
        q_lower = question.strip().lower()
        # Short questions are almost always follow-ups if history exists
        if len(q_lower.split()) <= 4 and any(
            re.search(pat, q_lower) for pat in FOLLOW_UP_PATTERNS
        ):
            return True
        for pat in FOLLOW_UP_PATTERNS:
            if re.search(pat, q_lower):
                return True
        return False

    def contextualize_query(
        self,
        current_question: str,
        history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Synthesizes a standalone query for retrieval by resolving pronouns and
        incorporating context from previous turns.
        """
        if not history or not self.is_follow_up_query(current_question):
            return current_question

        # Find the most recent user question and AI answer
        recent_user_q = ""
        recent_ai_summary = ""
        for turn in reversed(history[-self.max_history_turns:]):
            role = turn.get("role", "")
            content = turn.get("content", "")
            if role == "user" and not recent_user_q:
                recent_user_q = content
            elif role == "assistant" and not recent_ai_summary:
                # Extract first sentence or headline of assistant's previous answer
                first_sent = content.split("\n")[0].split(". ")[0]
                recent_ai_summary = first_sent[:120]

        if not recent_user_q:
            return current_question

        # Contextual augmentation
        q_clean = current_question.strip()
        augmented = f"{recent_user_q} - {q_clean}"
        if recent_ai_summary and len(recent_ai_summary) > 10:
            augmented = f"{recent_user_q} ({recent_ai_summary}) : {q_clean}"

        logger.info(
            "Contextualized follow-up query: '%s' -> '%s'",
            current_question, augmented
        )
        return augmented

    def sanitize_history(
        self,
        history: Optional[List[Dict[str, str]]],
    ) -> List[Dict[str, str]]:
        """
        Trims and sanitizes conversation history for LLM message payload.
        Ensures valid role ordering and limits token consumption.
        """
        if not history:
            return []

        clean_history: List[Dict[str, str]] = []
        for turn in history[-self.max_history_turns:]:
            role = turn.get("role", "user")
            content = (turn.get("content") or "").strip()
            if role in ("user", "assistant") and content:
                # Truncate overly long turns to prevent context exhaustion
                truncated_content = content[:1000]
                clean_history.append({"role": role, "content": truncated_content})

        return clean_history
