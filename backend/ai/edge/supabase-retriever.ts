/**
 * Supabase pgvector Retrieval Module for Cloudflare Workers & Edge.
 * Executes vector similarity matching via the `match_sbu_chunks` RPC function.
 */

import { KnowledgeChunk } from './types';

export async function retrieveChunksFromSupabase(
  embedding: number[],
  supabaseUrl: string,
  supabaseKey: string,
  limit = 5,
  threshold = 0.25
): Promise<KnowledgeChunk[]> {
  const cleanUrl = (supabaseUrl || '').trim().replace(/\/+$/, '');
  const cleanKey = (supabaseKey || '').trim();

  if (!cleanUrl || !cleanKey) {
    throw new Error('Supabase URL or Key is not configured for vector retrieval.');
  }

  const endpoint = `${cleanUrl}/rest/v1/rpc/match_sbu_chunks`;

  const payload = {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: limit,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: cleanKey,
      Authorization: `Bearer ${cleanKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Supabase pgvector RPC error (HTTP ${response.status}): ${errorText.slice(0, 300)}`
    );
  }

  const rows = (await response.json()) as any[];

  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((r) => ({
    id: r.id,
    chunk_id: r.chunk_id,
    title: r.title || undefined,
    page_number: r.page_number || 1,
    content: r.content || '',
    metadata: typeof r.metadata === 'object' ? r.metadata : {},
    similarity: Number(r.similarity) || 0,
  }));
}

