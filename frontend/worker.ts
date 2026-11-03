import { Server } from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import expressApp from '../backend/src/app.js';
import openNextHandler from './.open-next/worker.js';

// Re-export any OpenNext Durable Objects if needed by Next.js Cloudflare adapter
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js';

const PORT = 8080;
const server = new Server(expressApp);
server.listen(PORT);

const expressHandler = httpServerHandler({ port: PORT });

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

    // Route /api and /api/* to Express backend
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      if (typeof expressHandler.fetch === 'function') {
        return expressHandler.fetch(request, env, ctx);
      }
      if (typeof expressHandler === 'function') {
        return (expressHandler as any)(request, env, ctx);
      }
      throw new Error('Express handler does not expose a callable fetch method');
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

