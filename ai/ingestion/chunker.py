import re
import logging
from typing import Dict, Any, List
import tiktoken

from ai.config.settings import settings

logger = logging.getLogger("sbuweb.ai.ingestion.chunker")

try:
    _TIKTOKEN_ENCODER = tiktoken.get_encoding("cl100k_base")
except Exception:
    _TIKTOKEN_ENCODER = None


class StructureAwareChunker:
    """
    Structure-aware semantic chunker:
    - Target chunk size: ~350–500 tokens.
    - Chunk overlap: ~50–80 tokens.
    - Preserves question-and-answer pairs together without splitting.
    - Preserves tables and key-value sections.
    - Retains page-level source traceability and flags review-required chunks.
    """

    SECTION_HEADER_PATTERN = re.compile(
        r"^(?:(?:\d+\.|\b(?:Section|Stage|Field)\b)[^\n]+|###?[^\n]+)",
        re.MULTILINE,
    )

    QA_SPLIT_PATTERN = re.compile(
        r"(?=^\s*(?:Q\d*:|\*\*Question:\*\*|Question:|\d+\.\s*(?:How|What|Why|Where|When|Who|Can|Do|Is)\b))",
        re.MULTILINE | re.IGNORECASE,
    )

    @staticmethod
    def count_tokens(text: str) -> int:
        """Counts tokens using tiktoken (cl100k_base) or safe word-multiplier fallback."""
        if _TIKTOKEN_ENCODER:
            try:
                return len(_TIKTOKEN_ENCODER.encode(text))
            except Exception:
                pass
        return max(1, int(len(text.split()) * 1.33))

    @classmethod
    def identify_section_title(cls, text: str, fallback_page: int) -> str:
        """Extracts the leading heading or section descriptor from the chunk text."""
        lines = [line.strip() for line in text.strip().split("\n") if line.strip()]
        if not lines:
            return f"Page {fallback_page} Content"

        first_line = lines[0]
        first_line = re.sub(r"^#+\s*", "", first_line)

        # Truncate title cleanly
        if len(first_line) > 80:
            return first_line[:77] + "..."
        return first_line

    @classmethod
    def determine_content_type(cls, text: str) -> str:
        """Identifies chunk semantic category for optimized downstream retrieval filtering."""
        text_lower = text.lower()
        if "question:" in text_lower or "q:" in text_lower or "frequently asked questions" in text_lower:
            return "qa_pairs"
        if "| --- |" in text or "---|" in text:
            return "tabular_data"
        if "client portal" in text_lower or "login" in text_lower or "registration" in text_lower:
            return "portal_guide"
        if "rules for" in text_lower or "never invent" in text_lower or "policy" in text_lower:
            return "policy_rules"
        if "discovery & planning" in text_lower or "project works" in text_lower or "stage" in text_lower:
            return "process_workflow"
        if "owner" in text_lower or "founding partner" in text_lower or "admin@sbutech.com" in text_lower:
            return "company_overview"
        return "general_knowledge"

    @classmethod
    def split_large_text_with_overlap(
        cls,
        text: str,
        target_tokens: int,
        overlap_tokens: int,
    ) -> List[str]:
        """Splits an oversized text block into overlapping sub-chunks respecting sentence boundaries."""
        sentences = re.split(r"(?<=[.!?])\s+", text)
        chunks: List[str] = []
        current_sentences: List[str] = []
        current_token_count = 0

        for sentence in sentences:
            sentence_tokens = cls.count_tokens(sentence)

            if current_token_count + sentence_tokens > target_tokens and current_sentences:
                chunk_text = " ".join(current_sentences).strip()
                chunks.append(chunk_text)

                # Build overlap from trailing sentences
                overlap_acc: List[str] = []
                overlap_count = 0
                for s in reversed(current_sentences):
                    s_tok = cls.count_tokens(s)
                    if overlap_count + s_tok <= overlap_tokens:
                        overlap_acc.insert(0, s)
                        overlap_count += s_tok
                    else:
                        break

                current_sentences = list(overlap_acc)
                current_token_count = sum(cls.count_tokens(s) for s in current_sentences)

            current_sentences.append(sentence)
            current_token_count += sentence_tokens

        if current_sentences:
            final_text = " ".join(current_sentences).strip()
            if final_text:
                chunks.append(final_text)

        return chunks

    @classmethod
    def chunk_document(cls, cleaned_doc: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Partitions the cleaned document pages into structure-aware chunks.
        Respects section titles, Q&A boundaries, and table blocks.
        """
        all_chunks: List[Dict[str, Any]] = []
        doc_id = settings.DOCUMENT_ID
        source_filename = cleaned_doc["document_metadata"]["filename"]
        chunk_counter = 1

        target_tokens = settings.TARGET_CHUNK_TOKENS
        overlap_tokens = settings.CHUNK_OVERLAP_TOKENS

        for page in cleaned_doc["pages"]:
            page_num = page["page_number"]
            cleaned_text = page["cleaned_text"]
            tables = page.get("tables_markdown", [])

            # Split text by major section headers or Q&A items
            raw_blocks = re.split(r"\n(?=(?:[0-9]+\.\s+[A-Za-z]|###?\s+))", cleaned_text)
            blocks: List[str] = [b.strip() for b in raw_blocks if b.strip()]

            # If the page had markdown tables, append them if not already represented
            for t_md in tables:
                if t_md and t_md not in cleaned_text:
                    blocks.append(t_md)

            for block in blocks:
                # Check if block is a Q&A collection
                if "frequently asked questions" in block.lower() or "question:" in block.lower():
                    qa_items = [q.strip() for q in cls.QA_SPLIT_PATTERN.split(block) if q.strip()]
                    accumulated_qa = ""
                    for qa in qa_items:
                        combined = (accumulated_qa + "\n\n" + qa).strip() if accumulated_qa else qa
                        if cls.count_tokens(combined) > target_tokens and accumulated_qa:
                            sub_chunks = [accumulated_qa]
                            for sc in sub_chunks:
                                all_chunks.append(cls._build_chunk(
                                    chunk_counter=chunk_counter,
                                    doc_id=doc_id,
                                    source_file=source_filename,
                                    page_num=page_num,
                                    text=sc,
                                ))
                                chunk_counter += 1
                            accumulated_qa = qa
                        else:
                            accumulated_qa = combined

                    if accumulated_qa:
                        all_chunks.append(cls._build_chunk(
                            chunk_counter=chunk_counter,
                            doc_id=doc_id,
                            source_file=source_filename,
                            page_num=page_num,
                            text=accumulated_qa,
                        ))
                        chunk_counter += 1
                    continue

                # Standard section block
                token_len = cls.count_tokens(block)

                if token_len > settings.MAX_CHUNK_TOKENS:
                    sub_chunks = cls.split_large_text_with_overlap(
                        block,
                        target_tokens=target_tokens,
                        overlap_tokens=overlap_tokens,
                    )
                    for sc in sub_chunks:
                        all_chunks.append(cls._build_chunk(
                            chunk_counter=chunk_counter,
                            doc_id=doc_id,
                            source_file=source_filename,
                            page_num=page_num,
                            text=sc,
                        ))
                        chunk_counter += 1
                else:
                    all_chunks.append(cls._build_chunk(
                        chunk_counter=chunk_counter,
                        doc_id=doc_id,
                        source_file=source_filename,
                        page_num=page_num,
                        text=block,
                    ))
                    chunk_counter += 1

        return all_chunks

    @classmethod
    def _build_chunk(
        cls,
        chunk_counter: int,
        doc_id: str,
        source_file: str,
        page_num: int,
        text: str,
    ) -> Dict[str, Any]:
        """Constructs an individual chunk record with complete RAG metadata."""
        chunk_id = f"{doc_id}_p{page_num}_c{chunk_counter:03d}"
        section_title = cls.identify_section_title(text, page_num)
        content_type = cls.determine_content_type(text)
        token_count = cls.count_tokens(text)

        # Flag chunks containing compliance cautions or placeholder instructions
        review_required = any(
            phrase in text.lower()
            for phrase in [
                "mock admin mode",
                "soc 2",
                "hipaa",
                "never invent",
                "verify contract",
                "[add",
                "[tbd]",
            ]
        )

        return {
            "chunk_id": chunk_id,
            "document_id": doc_id,
            "source_file": source_file,
            "page_number": page_num,
            "section_title": section_title,
            "chunk_index": chunk_counter,
            "content": text,
            "content_type": content_type,
            "review_required": review_required,
            "token_count": token_count,
            "char_count": len(text),
        }
