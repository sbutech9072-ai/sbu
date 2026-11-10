// @ts-ignore
import openNextHandler from './.open-next/worker.js';
import { handleAIChat } from '../ai/edge/chat-handler';

// Re-export any OpenNext Durable Objects if needed by Next.js Cloudflare adapter
// @ts-ignore
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js';

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    // Populate process.env from Cloudflare worker env for server-side code
    if (env && typeof env === 'object') {
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === 'string' && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }

    const url = new URL(request.url);

    // Handle CORS preflight for AI endpoints
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/ai/')) {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Native Cloudflare Worker Edge AI Endpoints (Zero External Servers Required)
    if (url.pathname === '/api/ai/chat' && request.method === 'POST') {
      try {
        const body = (await request.json()) as any;
        const result = await handleAIChat(body, env);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err: any) {
        console.error('Edge AI chat execution error:', err);
        return new Response(
          JSON.stringify({
            answer:
              'I am currently experiencing connectivity issues reaching the AI knowledge base. Please try again in a moment.',
            status: 'error',
            error: err?.message || 'Edge worker AI failure',
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }

    if (url.pathname === '/api/ai/session/new' && request.method === 'POST') {
      const newSid = `sbu_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      return new Response(
        JSON.stringify({
          success: true,
          session_id: newSid,
          message: 'New session initialized on Edge.',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    if (url.pathname === '/api/ai/health' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          architecture: 'Cloudflare Worker Native Edge RAG',
          vectorstore: 'Supabase pgvector',
          embeddings: 'Google Gemini (gemini-embedding-2, 1536-dim)',
          llm: 'AgentRouter DeepSeek Flash / Gemini Flash',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Route other /api and /api/* to FastAPI backend if BACKEND_URL or FASTAPI_BACKEND_URL is explicitly configured
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      const backendBase =
        env?.BACKEND_URL ||
        env?.FASTAPI_BACKEND_URL ||
        env?.INTERNAL_API_URL ||
        process.env.BACKEND_URL ||
        process.env.FASTAPI_BACKEND_URL ||
        process.env.INTERNAL_API_URL;

      if (backendBase) {
        const targetUrl = new URL(url.pathname + url.search, backendBase);
        const headers = new Headers(request.headers);
        headers.set('host', new URL(backendBase).host);
        return fetch(targetUrl.toString(), {
          method: request.method,
          headers,
          body: request.body,
          redirect: 'follow',
        });
      }
    }

    // Route all other requests (Next.js pages, SSG, SSR, static assets) to OpenNext Next.js handler
    if (typeof openNextHandler.fetch === 'function') {
      return openNextHandler.fetch(request, env, ctx);
    }
    if (typeof openNextHandler === 'function') {
      return (openNextHandler as any)(request, env, ctx);
    }
    throw new Error('OpenNext handler does not expose a callable fetch method');
  },
};
