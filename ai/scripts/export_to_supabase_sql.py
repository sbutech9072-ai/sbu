"""
Export Qdrant knowledge base points and 1536-dim Gemini embeddings to a complete Supabase SQL migration script.
Creates tables, HNSW vector index, search RPC function, and pre-seeded vector rows.
"""

import json
from pathlib import Path
from ai.vectorstore.qdrant_client import QdrantLocalManager

def escape_sql_str(s: str) -> str:
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def generate_sql():
    output_dir = Path("supabase")
    output_dir.mkdir(exist_ok=True)
    sql_file = output_dir / "setup_and_seed.sql"

    client = QdrantLocalManager.get_client()
    pts, _ = client.scroll("sbu_tech_knowledge_base", limit=200, with_vectors=True)
    print(f"Found {len(pts)} vector points in local Qdrant collection.")

    lines = []
    lines.append("-- ============================================================")
    lines.append("-- SBU TECH — SUPABASE PGVECTOR SETUP & KNOWLEDGE BASE SEED")
    lines.append("-- Run this entire script in Supabase Dashboard -> SQL Editor")
    lines.append("-- ============================================================\n")

    lines.append("-- 1. Enable pgvector extension")
    lines.append("CREATE EXTENSION IF NOT EXISTS vector;\n")

    lines.append("-- 2. Create knowledge chunks table")
    lines.append("CREATE TABLE IF NOT EXISTS sbu_knowledge_chunks (")
    lines.append("    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,")
    lines.append("    chunk_id TEXT UNIQUE NOT NULL,")
    lines.append("    title TEXT,")
    lines.append("    page_number INT NOT NULL DEFAULT 1,")
    lines.append("    content TEXT NOT NULL,")
    lines.append("    metadata JSONB DEFAULT '{}'::jsonb,")
    lines.append("    embedding VECTOR(1536) NOT NULL,")
    lines.append("    created_at TIMESTAMPTZ DEFAULT NOW()")
    lines.append(");\n")

    lines.append("-- 3. Create HNSW index for sub-millisecond cosine vector retrieval")
    lines.append("CREATE INDEX IF NOT EXISTS sbu_knowledge_embedding_idx")
    lines.append("ON sbu_knowledge_chunks")
    lines.append("USING hnsw (embedding vector_cosine_ops);\n")

    lines.append("-- 4. Create vector matching RPC function for Cloudflare Workers")
    lines.append("CREATE OR REPLACE FUNCTION match_sbu_chunks (")
    lines.append("    query_embedding VECTOR(1536),")
    lines.append("    match_threshold FLOAT DEFAULT 0.25,")
    lines.append("    match_count INT DEFAULT 5")
    lines.append(")")
    lines.append("RETURNS TABLE (")
    lines.append("    id BIGINT,")
    lines.append("    chunk_id TEXT,")
    lines.append("    title TEXT,")
    lines.append("    page_number INT,")
    lines.append("    content TEXT,")
    lines.append("    metadata JSONB,")
    lines.append("    similarity FLOAT")
    lines.append(")")
    lines.append("LANGUAGE plpgsql")
    lines.append("AS $$")
    lines.append("BEGIN")
    lines.append("    RETURN QUERY")
    lines.append("    SELECT")
    lines.append("        sbu_knowledge_chunks.id,")
    lines.append("        sbu_knowledge_chunks.chunk_id,")
    lines.append("        sbu_knowledge_chunks.title,")
    lines.append("        sbu_knowledge_chunks.page_number,")
    lines.append("        sbu_knowledge_chunks.content,")
    lines.append("        sbu_knowledge_chunks.metadata,")
    lines.append("        1 - (sbu_knowledge_chunks.embedding <=> query_embedding) AS similarity")
    lines.append("    FROM sbu_knowledge_chunks")
    lines.append("    WHERE 1 - (sbu_knowledge_chunks.embedding <=> query_embedding) > match_threshold")
    lines.append("    ORDER BY similarity DESC")
    lines.append("    LIMIT match_count;")
    lines.append("END;")
    lines.append("$$;\n")

    lines.append("-- 5. Seed Knowledge Base Chunks with pre-computed 1536-dim Gemini embeddings")
    for pt in pts:
        p = pt.payload or {}
        chunk_id = escape_sql_str(p.get("chunk_id", ""))
        title = escape_sql_str(p.get("section_title", ""))
        page_number = int(p.get("page_number", 1))
        content = escape_sql_str(p.get("original_text", ""))
        meta_dict = {
            "document_id": p.get("document_id"),
            "source_file": p.get("source_file"),
            "chunk_index": p.get("chunk_index"),
            "content_type": p.get("content_type"),
        }
        metadata = escape_sql_str(json.dumps(meta_dict))
        vec_str = "'[" + ",".join(str(round(v, 6)) for v in pt.vector) + "]'"

        lines.append(f"""INSERT INTO sbu_knowledge_chunks (chunk_id, title, page_number, content, metadata, embedding)
VALUES ({chunk_id}, {title}, {page_number}, {content}, {metadata}::jsonb, {vec_str}::vector)
ON CONFLICT (chunk_id) DO UPDATE SET
    title = EXCLUDED.title,
    page_number = EXCLUDED.page_number,
    content = EXCLUDED.content,
    metadata = EXCLUDED.metadata,
    embedding = EXCLUDED.embedding;
""")

    sql_file.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated {sql_file.resolve()} ({sql_file.stat().st_size} bytes, {len(pts)} chunks).")

if __name__ == "__main__":
    generate_sql()

