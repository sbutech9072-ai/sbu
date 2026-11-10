"""
Apply complete database migration and seed script to Supabase PostgreSQL.
Reads connection string from backend/.env and executes supabase/setup_and_seed.sql.
"""

import os
from pathlib import Path
import psycopg2
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
backend_env = PROJECT_ROOT / "backend" / ".env"
load_dotenv(backend_env)

database_url = os.getenv("DATABASE_URL", "").strip()
if not database_url or not database_url.startswith("postgresql://"):
    raise ValueError(f"Valid postgresql DATABASE_URL not found in {backend_env}")

print(f"Connecting to Supabase PostgreSQL at {database_url.split('@')[-1]}...")
conn = psycopg2.connect(database_url)
conn.autocommit = True
cur = conn.cursor()

sql_path = PROJECT_ROOT / "supabase" / "setup_and_seed.sql"
print(f"Reading SQL migration script: {sql_path} ({sql_path.stat().st_size} bytes)...")
sql_content = sql_path.read_text(encoding="utf-8")

print("Executing SQL statements on Supabase...")
cur.execute(sql_content)

print("Migration executed successfully!")

# Verify created tables
cur.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
""")
tables = [r[0] for r in cur.fetchall()]
print(f"\nCreated {len(tables)} tables in Supabase public schema:")
for t in tables:
    cur.execute(f"SELECT COUNT(*) FROM {t};")
    cnt = cur.fetchone()[0]
    print(f"  - {t}: {cnt} rows")

cur.close()
conn.close()
print("\nAll tables and data have been successfully provisioned in Supabase!")

