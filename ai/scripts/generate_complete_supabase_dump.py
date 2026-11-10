"""
Generate a complete Supabase PostgreSQL migration and seed script.
Includes:
1. All 10 backend tables (users, contact_messages, quote_requests, projects, services, team_members, testimonials, site_settings, chat_sessions, chat_messages)
2. All current rows/data exported from backend/sbuweb.db
3. AI knowledge vector table (sbu_knowledge_chunks) with pgvector, HNSW index, RPC function, and 18 pre-computed 1536-dim Gemini embeddings.
"""

import sys
import json
import sqlite3
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "backend"))

from ai.vectorstore.qdrant_client import QdrantLocalManager

def escape_sql_val(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, (dict, list)):
        s = json.dumps(val)
        return "'" + s.replace("'", "''") + "'::jsonb"
    # string
    s = str(val)
    # Check if string looks like JSON
    s_trimmed = s.strip()
    if (s_trimmed.startswith("{") and s_trimmed.endswith("}")) or (s_trimmed.startswith("[") and s_trimmed.endswith("]")):
        try:
            json.loads(s_trimmed)
            return "'" + s.replace("'", "''") + "'::jsonb"
        except Exception:
            pass
    return "'" + s.replace("'", "''") + "'"

def generate_complete_sql():
    output_path = PROJECT_ROOT / "supabase" / "setup_and_seed.sql"
    output_path.parent.mkdir(exist_ok=True)

    db_path = PROJECT_ROOT / "backend" / "sbuweb.db"
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    lines = []
    lines.append("-- ============================================================")
    lines.append("-- SBU TECH — COMPLETE PRODUCTION SUPABASE DATABASE MIGRATION")
    lines.append("-- Includes All 10 Backend Tables + Full Data + AI pgvector RAG")
    lines.append("-- ============================================================\n")

    lines.append("-- 1. Enable Required Extensions")
    lines.append("CREATE EXTENSION IF NOT EXISTS vector;")
    lines.append('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n')

    lines.append("-- 2. Backend Relational Tables\n")

    lines.append("""-- 2.1 Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'client' NOT NULL,
    country VARCHAR(100),
    whatsapp_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

-- 2.2 Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_contact_messages_email ON contact_messages (email);

-- 2.3 Quote Requests Table
CREATE TABLE IF NOT EXISTS quote_requests (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    service_category VARCHAR(255) NOT NULL,
    budget_range VARCHAR(100) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    project_overview TEXT NOT NULL,
    features_needed JSONB DEFAULT '[]'::jsonb NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_quote_requests_email ON quote_requests (email);

-- 2.4 Projects Table (Portfolio)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    cover_image VARCHAR(500) NOT NULL,
    year INT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    technologies JSONB DEFAULT '[]'::jsonb NOT NULL,
    metrics JSONB DEFAULT '[]'::jsonb NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    results JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    live_url VARCHAR(500),
    github_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_projects_slug ON projects (slug);

-- 2.5 Services Table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    icon_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb NOT NULL,
    deliverables JSONB DEFAULT '[]'::jsonb NOT NULL,
    technologies JSONB DEFAULT '[]'::jsonb NOT NULL,
    process_steps JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_services_slug ON services (slug);

-- 2.6 Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    bio TEXT NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    socials JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_leadership BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2.7 Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(100) PRIMARY KEY,
    quote TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    rating INT DEFAULT 5 NOT NULL,
    project_slug VARCHAR(150),
    verified_client BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2.8 Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    sales_email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    office_address VARCHAR(255) NOT NULL,
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    enable_maintenance_mode BOOLEAN DEFAULT FALSE NOT NULL,
    enable_registration BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2.9 Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    visitor_ip VARCHAR(45),
    title VARCHAR(255),
    language VARCHAR(20) DEFAULT 'auto' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2.10 Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50),
    sources_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_chat_messages_session ON chat_messages (session_id);
""")

    lines.append("-- 3. Seed Existing Backend Data From sbuweb.db\n")

    tables_to_dump = [
        "users",
        "contact_messages",
        "quote_requests",
        "projects",
        "services",
        "team_members",
        "testimonials",
        "site_settings",
        "chat_sessions",
    ]

    for tbl in tables_to_dump:
        cur.execute(f"PRAGMA table_info({tbl});")
        cols = [c[1] for c in cur.fetchall()]
        cur.execute(f"SELECT * FROM {tbl};")
        rows = cur.fetchall()
        if rows:
            lines.append(f"-- Data for {tbl} ({len(rows)} rows)")
            col_list_str = ", ".join(cols)
            for row in rows:
                val_strs = [escape_sql_val(v) for v in row]
                val_joined = ", ".join(val_strs)
                pk = cols[0]
                lines.append(f"INSERT INTO {tbl} ({col_list_str}) VALUES ({val_joined}) ON CONFLICT ({pk}) DO NOTHING;")
            lines.append("")

    # Chat messages (id is IDENTITY, so omit id or use OVERRIDING)
    cur.execute("SELECT session_id, role, content, status, sources_json, created_at, updated_at FROM chat_messages;")
    msg_rows = cur.fetchall()
    if msg_rows:
        lines.append(f"-- Data for chat_messages ({len(msg_rows)} rows)")
        for m in msg_rows:
            vals = [escape_sql_val(v) for v in m]
            lines.append(f"INSERT INTO chat_messages (session_id, role, content, status, sources_json, created_at, updated_at) VALUES ({', '.join(vals)});")
        lines.append("")

    conn.close()

    lines.append("-- ============================================================")
    lines.append("-- 4. AI & RAG Engine — Knowledge Vector Database (pgvector)")
    lines.append("-- ============================================================\n")

    lines.append("""CREATE TABLE IF NOT EXISTS sbu_knowledge_chunks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    chunk_id TEXT UNIQUE NOT NULL,
    title TEXT,
    page_number INT NOT NULL DEFAULT 1,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(1536) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sbu_knowledge_embedding_idx
ON sbu_knowledge_chunks
USING hnsw (embedding vector_cosine_ops);

CREATE OR REPLACE FUNCTION match_sbu_chunks (
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.25,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id BIGINT,
    chunk_id TEXT,
    title TEXT,
    page_number INT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        sbu_knowledge_chunks.id,
        sbu_knowledge_chunks.chunk_id,
        sbu_knowledge_chunks.title,
        sbu_knowledge_chunks.page_number,
        sbu_knowledge_chunks.content,
        sbu_knowledge_chunks.metadata,
        1 - (sbu_knowledge_chunks.embedding <=> query_embedding) AS similarity
    FROM sbu_knowledge_chunks
    WHERE 1 - (sbu_knowledge_chunks.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;
""")

    lines.append("-- 5. Seed 18 Knowledge Chunks with 1536-dim Gemini Embeddings\n")

    client = QdrantLocalManager.get_client()
    pts, _ = client.scroll("sbu_tech_knowledge_base", limit=200, with_vectors=True)
    for pt in pts:
        p = pt.payload or {}
        chunk_id = escape_sql_val(p.get("chunk_id", ""))
        title = escape_sql_val(p.get("section_title", ""))
        page_number = int(p.get("page_number", 1))
        content = escape_sql_val(p.get("original_text", ""))
        meta_dict = {
            "document_id": p.get("document_id"),
            "source_file": p.get("source_file"),
            "chunk_index": p.get("chunk_index"),
            "content_type": p.get("content_type"),
        }
        metadata = escape_sql_val(json.dumps(meta_dict))
        vec_str = "'[" + ",".join(str(round(v, 6)) for v in pt.vector) + "]'"

        lines.append(f"""INSERT INTO sbu_knowledge_chunks (chunk_id, title, page_number, content, metadata, embedding)
VALUES ({chunk_id}, {title}, {page_number}, {content}, {metadata}, {vec_str}::vector)
ON CONFLICT (chunk_id) DO UPDATE SET
    title = EXCLUDED.title,
    page_number = EXCLUDED.page_number,
    content = EXCLUDED.content,
    metadata = EXCLUDED.metadata,
    embedding = EXCLUDED.embedding;
""")

    output_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated {output_path.resolve()} ({output_path.stat().st_size} bytes).")

if __name__ == "__main__":
    generate_complete_sql()
