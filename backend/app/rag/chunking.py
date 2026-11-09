import re
from typing import List, Dict, Any


class TextChunker:
    """Configurable recursive / semantic text chunker for technical documents & briefs."""

    def __init__(self, chunk_size: int = 600, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str, metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if not text:
            return []

        # Split on paragraph or headers
        paragraphs = re.split(r'\n{2,}', text.strip())
        chunks: List[Dict[str, Any]] = []
        current_chunk = ""

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            if len(current_chunk) + len(para) + 1 <= self.chunk_size:
                current_chunk = f"{current_chunk}\n\n{para}".strip()
            else:
                if current_chunk:
                    chunks.append({
                        "content": current_chunk,
                        "metadata": metadata or {},
                        "char_count": len(current_chunk),
                    })
                current_chunk = para

        if current_chunk:
            chunks.append({
                "content": current_chunk,
                "metadata": metadata or {},
                "char_count": len(current_chunk),
            })

        return chunks

