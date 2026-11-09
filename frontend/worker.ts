// @ts-ignore
import openNextHandler from './.open-next/worker.js';

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

    // Route /api and /api/* to FastAPI backend if BACKEND_URL or FASTAPI_BACKEND_URL is configured
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
