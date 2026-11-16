// @ts-ignore
import openNextHandler from './.open-next/worker.js';
import { handleAIChat } from '../ai/edge/chat-handler';

// Re-export any OpenNext Durable Objects if needed by Next.js Cloudflare adapter
// @ts-ignore
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js';

// ==============================================================================
// IN-MEMORY RATE LIMITING STORES (Best Effort in Worker Instance)
// ==============================================================================
const trackRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const failedLoginMap = new Map<string, { count: number; resetAt: number }>();

function isTrackRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = trackRateLimitMap.get(key);
  if (entry && entry.resetAt > now) {
    if (entry.count >= 60) {
      return true;
    }
    entry.count++;
    return false;
  }
  trackRateLimitMap.set(key, { count: 1, resetAt: now + 60000 }); // 1 min window
  return false;
}

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = failedLoginMap.get(ip);
  if (!entry) return true;
  if (entry.resetAt <= now) {
    failedLoginMap.delete(ip);
    return true;
  }
  return entry.count < 5;
}

function recordLoginFailure(ip: string) {
  const now = Date.now();
  const entry = failedLoginMap.get(ip);
  if (entry && entry.resetAt > now) {
    entry.count++;
  } else {
    failedLoginMap.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 }); // 5 min window
  }
}

function clearLoginFailures(ip: string) {
  failedLoginMap.delete(ip);
}

// ==============================================================================
// CRYPTO HELPERS (PBKDF2-SHA256, HMAC-SHA256, Constant-Time Comparison)
// ==============================================================================
function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.length % 2 !== 0 ? '0' + hex : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function stringToBase64Url(str: string): string {
  return bytesToBase64Url(new TextEncoder().encode(str));
}

function base64UrlToString(str: string): string {
  return new TextDecoder().decode(base64UrlToBytes(str));
}

async function verifyPassword(password: string, storedHashStr: string): Promise<boolean> {
  try {
    const parts = storedHashStr.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') {
      return false;
    }
    const iterations = parseInt(parts[1], 10);
    const saltBytes = hexToBytes(parts[2]);
    const expectedHashBytes = hexToBytes(parts[3]);

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      256 // 32 bytes
    );

    return timingSafeEqual(new Uint8Array(derivedBits), expectedHashBytes);
  } catch {
    return false;
  }
}

type AdminRole = 'main_owner' | 'co_owner' | 'member';

interface AdminUserRecord {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  password_hash?: string;
  is_active: boolean;
  permissions: string[];
  token_version: number;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string | null;
  last_seen_at?: string | null;
  password_changed_at?: string | null;
}

interface AdminSessionPayload {
  sub: string;
  email: string;
  role: AdminRole;
  tv: number;
  exp: number;
}

const VALID_ADMIN_ROLES: readonly AdminRole[] = ['main_owner', 'co_owner', 'member'];
const MEMBER_ALLOWED_PERMISSIONS = [
  'overview',
  'users',
  'projects',
  'team',
  'testimonials',
  'messages',
] as const;
const DEFAULT_MEMBER_PERMISSIONS = ['overview', 'projects', 'team', 'testimonials', 'messages'];
const ADMIN_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitizeMemberPermissions(input: unknown): string[] {
  if (!Array.isArray(input)) return [...DEFAULT_MEMBER_PERMISSIONS];
  const allowed = new Set<string>(MEMBER_ALLOWED_PERMISSIONS);
  const filtered = Array.from(
    new Set(input.filter((p): p is string => typeof p === 'string' && allowed.has(p)))
  );
  return filtered.length > 0 ? filtered : ['overview'];
}

async function hashPassword(password: string, iterations = 100000): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `pbkdf2_sha256$${iterations}$${saltHex}$${hashHex}`;
}

async function signSessionToken(
  user: { id: string; email: string; role: AdminRole; token_version: number },
  secret: string
): Promise<string> {
  const enc = new TextEncoder();
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600; // 12h validity
  const payload: AdminSessionPayload = {
    sub: user.id,
    email: user.email.toLowerCase(),
    role: user.role,
    tv: user.token_version,
    exp,
  };
  const payloadB64 = stringToBase64Url(JSON.stringify(payload));

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const sigB64 = bytesToBase64Url(new Uint8Array(sig));

  return `${payloadB64}.${sigB64}`;
}

async function verifySessionToken(
  token: string | null,
  secret: string
): Promise<AdminSessionPayload | null> {
  if (!token || !secret) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToBytes(sigB64);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(payloadB64)
    );
    if (!valid) return null;

    const payload = JSON.parse(base64UrlToString(payloadB64)) as Partial<AdminSessionPayload>;
    if (!payload || typeof payload !== 'object') return null;

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    if (typeof payload.sub !== 'string' || !UUID_REGEX.test(payload.sub)) return null;
    if (typeof payload.email !== 'string' || !payload.email) return null;
    if (!payload.role || !VALID_ADMIN_ROLES.includes(payload.role)) return null;
    if (typeof payload.tv !== 'number' || payload.tv < 1) return null;

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)sbu_admin_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function buildSessionCookie(token: string, requestUrl: URL): string {
  const isSecure =
    requestUrl.protocol === 'https:' &&
    requestUrl.hostname !== 'localhost' &&
    requestUrl.hostname !== '127.0.0.1';
  return `sbu_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; ${
    isSecure ? 'Secure; ' : ''
  }SameSite=Lax; Max-Age=43200`;
}

function buildClearSessionCookie(requestUrl: URL): string {
  const isSecure =
    requestUrl.protocol === 'https:' &&
    requestUrl.hostname !== 'localhost' &&
    requestUrl.hostname !== '127.0.0.1';
  return `sbu_admin_session=; Path=/; HttpOnly; ${
    isSecure ? 'Secure; ' : ''
  }SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

function jsonResponse(body: unknown, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...(extraHeaders || {}),
    },
  });
}

function getSupabaseAdminConfig(env: any): { supabaseUrl: string; serviceRoleKey: string } | null {
  const serviceRoleKey = (
    env?.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  ).trim();
  const supabaseUrl = (env?.SUPABASE_URL || process.env.SUPABASE_URL || '')
    .trim()
    .replace(/\/+$/, '');
  if (!serviceRoleKey || !supabaseUrl) return null;
  return { supabaseUrl, serviceRoleKey };
}

async function supabaseRest(
  config: { supabaseUrl: string; serviceRoleKey: string },
  endpoint: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${config.supabaseUrl}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { ok: res.ok, status: res.status, data };
}

async function writeAdminAuditLog(
  config: { supabaseUrl: string; serviceRoleKey: string },
  request: Request,
  entry: {
    actor_id?: string | null;
    actor_email?: string | null;
    actor_role?: string | null;
    target_id?: string | null;
    target_email?: string | null;
    action: string;
    details?: Record<string, unknown>;
  }
): Promise<void> {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    'unknown';
  const ua = (request.headers.get('user-agent') || '').slice(0, 300);

  try {
    await supabaseRest(config, 'admin_audit_logs', {
      method: 'POST',
      body: JSON.stringify({
        actor_id: entry.actor_id || null,
        actor_email: entry.actor_email || null,
        actor_role: entry.actor_role || null,
        target_id: entry.target_id || null,
        target_email: entry.target_email || null,
        action: entry.action,
        details: entry.details || {},
        ip_address: ip,
        user_agent: ua,
      }),
    });
  } catch {
    // Do not break primary auth flow if audit write fails
  }
}

function hasAdminPagePermission(admin: AdminUserRecord, pathname: string): boolean {
  if (admin.role === 'main_owner') return true;
  if (pathname === '/admin/settings' || pathname.startsWith('/admin/settings/')) {
    return false; // Owner-only settings
  }
  if (admin.role === 'co_owner') return true;

  // Member role checks
  if (pathname === '/admin/accounts' || pathname.startsWith('/admin/accounts/')) {
    return false;
  }
  const perms = Array.isArray(admin.permissions) ? admin.permissions : [];
  if (pathname === '/admin/users' || pathname.startsWith('/admin/users/')) {
    return perms.includes('users');
  }
  if (pathname === '/admin/projects' || pathname.startsWith('/admin/projects/')) {
    return perms.includes('projects');
  }
  if (pathname === '/admin/team' || pathname.startsWith('/admin/team/')) {
    return perms.includes('team');
  }
  if (pathname === '/admin/testimonials' || pathname.startsWith('/admin/testimonials/')) {
    return perms.includes('testimonials');
  }
  if (pathname === '/admin/messages' || pathname.startsWith('/admin/messages/')) {
    return perms.includes('messages');
  }
  return true;
}

function sanitizeAdminPublic(user: AdminUserRecord) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    is_active: user.is_active,
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
    created_by: user.created_by ?? null,
    created_at: user.created_at ?? null,
    updated_at: user.updated_at ?? null,
    last_login_at: user.last_login_at ?? null,
    last_seen_at: user.last_seen_at ?? null,
    password_changed_at: user.password_changed_at ?? null,
  };
}

function isAllowedTrackOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const check = (val: string | null): boolean => {
    if (!val) return false;
    try {
      const u = new URL(val);
      const host = u.hostname.toLowerCase();
      return (
        host === 'sbutech.com' ||
        host === 'www.sbutech.com' ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host.endsWith('.sbutech.com')
      );
    } catch {
      return false;
    }
  };
  return check(origin) || check(referer);
}

// ==============================================================================
// AUTH & ACTIVITY TRACKING HELPERS & RATE LIMITERS
// ==============================================================================
const loginEventRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const activityRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isLoginEventRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = loginEventRateLimitMap.get(key);
  if (entry && entry.resetAt > now) {
    if (entry.count >= 10) return true; // ~10 per minute
    entry.count++;
    return false;
  }
  loginEventRateLimitMap.set(key, { count: 1, resetAt: now + 60000 });
  return false;
}

function isActivityRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = activityRateLimitMap.get(key);
  if (entry && entry.resetAt > now) {
    if (entry.count >= 6) return true; // ~6 per minute
    entry.count++;
    return false;
  }
  activityRateLimitMap.set(key, { count: 1, resetAt: now + 60000 });
  return false;
}

function parseDeviceType(ua: string): string {
  return /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
    ? 'mobile'
    : 'desktop';
}

/**
 * Verifies a Supabase Bearer token against /auth/v1/user using SUPABASE_ANON_KEY.
 * Never logs tokens. Decodes session_id claim only AFTER successful verification.
 */
async function verifySupabaseToken(
  token: string,
  supabaseUrl: string,
  anonKey: string
): Promise<{
  id: string;
  email: string;
  app_metadata?: any;
  identities?: any[];
  session_id?: string;
} | null> {
  if (!token || !supabaseUrl || !anonKey) return null;
  try {
    const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
      },
    });
    if (!res.ok) return null;
    const user = (await res.json()) as any;
    if (!user || !user.id || !user.email) return null;

    let session_id: string | undefined = undefined;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson);
        session_id = payload.session_id;
      }
    } catch {
      // ignore token decode errors
    }

    return {
      id: user.id,
      email: user.email,
      app_metadata: user.app_metadata,
      identities: user.identities,
      session_id,
    };
  } catch {
    return null;
  }
}

// ==============================================================================
// MAIN WORKER FETCH ENTRY POINT
// ==============================================================================
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

    // ============================================================================
    // PART 3A: VISITOR ANALYTICS TRACKING ENDPOINT (POST /api/track)
    // ============================================================================
    if (url.pathname === '/api/track' && request.method === 'POST') {
      // 1. Same-site Origin / Referer check
      if (!isAllowedTrackOrigin(request)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. Body size check (reject bodies over 2 KB)
      const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
      if (contentLength > 2048) {
        return new Response(JSON.stringify({ error: 'Payload too large' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const rawText = await request.text();
      if (rawText.length > 2048) {
        return new Response(JSON.stringify({ error: 'Payload too large' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 3. Parse JSON safely
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 4. Validate path (starts with '/', <= 200 chars, stripped of query & hash)
      let path = typeof data.path === 'string' ? data.path : '';
      path = path.split('?')[0].split('#')[0].trim();
      if (!path.startsWith('/') || path.length > 200) {
        return new Response(JSON.stringify({ error: 'Invalid path' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 5. Validate visitor_id (UUID-like pattern)
      const visitor_id = typeof data.visitor_id === 'string' ? data.visitor_id.trim() : '';
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!UUID_REGEX.test(visitor_id)) {
        return new Response(JSON.stringify({ error: 'Invalid visitor_id format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const rawReferrer = typeof data.referrer === 'string' ? data.referrer.trim().slice(0, 500) : null;
      const referrer = rawReferrer || null;

      // 6. Bot detection from User-Agent
      const ua = (request.headers.get('user-agent') || '').toLowerCase();
      const is_bot = /bot|crawler|spider|curl|headless|lighthouse|slurp|facebookexternalhit|whatsapp|preview|mediapartners|inspection/i.test(ua);

      // 7. Country and device (NEVER store IP addresses or raw User-Agent)
      const country = (request as any).cf?.country || null;
      const device = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
        ? 'mobile'
        : 'desktop';

      // 8. Simple in-memory abuse guard (<= 60 inserts per minute per visitor_id/IP bucket)
      const ip =
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for') ||
        'unknown';
      if (isTrackRateLimited(`${visitor_id}:${ip}`)) {
        return new Response(null, { status: 204 });
      }

      // 9. Asynchronous Supabase REST insert using SUPABASE_SERVICE_ROLE_KEY
      const serviceRoleKey = (
        env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
      ).trim();
      const supabaseUrl = (
        env?.SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        ''
      ).trim().replace(/\/+$/, '');

      if (serviceRoleKey && supabaseUrl) {
        const insertPromise = fetch(`${supabaseUrl}/rest/v1/page_views`, {
          method: 'POST',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify([
            {
              path,
              visitor_id,
              referrer,
              country,
              device,
              is_bot,
            },
          ]),
        }).catch((err) => {
          console.error('Failed to insert page_view in Supabase:', err);
        });

        if (ctx && typeof ctx.waitUntil === 'function') {
          ctx.waitUntil(insertPromise);
        }
      }

      return new Response(null, { status: 204 });
    }

    // ============================================================================
    // PART 3B: USER AUTH LOGIN & LOGOUT EVENTS (POST /api/auth/login-event & logout-event)
    // ============================================================================

    // POST /api/auth/login-event
    if (url.pathname === '/api/auth/login-event' && request.method === 'POST') {
      if (!isAllowedTrackOrigin(request)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
      if (contentLength > 2048) {
        return new Response(JSON.stringify({ error: 'Payload too large' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const rawText = await request.text();
      if (rawText.length > 2048) {
        return new Response(JSON.stringify({ error: 'Payload too large' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const authHeader = request.headers.get('authorization') || '';
      const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
      if (!tokenMatch) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Bearer token required' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const token = tokenMatch[1].trim();

      const supabaseUrl = (
        env?.SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        ''
      ).trim().replace(/\/+$/, '');
      const anonKey = (
        env?.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        ''
      ).trim();
      const serviceRoleKey = (
        env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
      ).trim();

      if (!supabaseUrl || !anonKey || !serviceRoleKey) {
        return new Response(
          JSON.stringify({ error: 'Supabase authentication service not configured' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const verifiedUser = await verifySupabaseToken(token, supabaseUrl, anonKey);
      if (!verifiedUser) {
        return new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (isLoginEventRateLimited(verifiedUser.id)) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      let data: any = {};
      try {
        data = JSON.parse(rawText || '{}');
      } catch {
        // ignore
      }

      const requestedProvider = data.provider === 'google' ? 'google' : 'password';
      const hasGoogle =
        verifiedUser.app_metadata?.provider === 'google' ||
        verifiedUser.identities?.some((i: any) => i.provider === 'google');
      const hasPassword =
        verifiedUser.app_metadata?.provider === 'email' ||
        verifiedUser.identities?.some((i: any) => i.provider === 'email');

      if (requestedProvider === 'google' && !hasGoogle) {
        return new Response(JSON.stringify({ error: 'User does not possess Google identity' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (requestedProvider === 'password' && !hasPassword) {
        return new Response(JSON.stringify({ error: 'User does not possess password identity' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const country = (request as any).cf?.country || null;
      const ua = (request.headers.get('user-agent') || '').toLowerCase();
      const device = parseDeviceType(ua);

      const rpcHeaders = {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      };
      const rpcBody = JSON.stringify({
        p_user: verifiedUser.id,
        p_email: verifiedUser.email,
        p_provider: requestedProvider,
        p_auth_session: verifiedUser.session_id || null,
        p_country: country,
        p_device: device,
      });

      const rpcPromise = fetch(`${supabaseUrl}/rest/v1/rpc/record_login`, {
        method: 'POST',
        headers: rpcHeaders,
        body: rpcBody,
      }).catch((err) => {
        console.error('Failed to execute record_login RPC:', err);
      });

      if (ctx && typeof ctx.waitUntil === 'function') {
        ctx.waitUntil(rpcPromise);
      } else {
        await rpcPromise;
      }

      return new Response(null, { status: 204 });
    }

    // POST /api/auth/logout-event
    if (url.pathname === '/api/auth/logout-event' && request.method === 'POST') {
      if (!isAllowedTrackOrigin(request)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const authHeader = request.headers.get('authorization') || '';
      const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
      if (!tokenMatch) {
        return new Response(null, { status: 204 });
      }
      const token = tokenMatch[1].trim();

      const supabaseUrl = (
        env?.SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        ''
      ).trim().replace(/\/+$/, '');
      const anonKey = (
        env?.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        ''
      ).trim();
      const serviceRoleKey = (
        env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
      ).trim();

      if (!supabaseUrl || !anonKey || !serviceRoleKey) {
        return new Response(null, { status: 204 });
      }

      const verifiedUser = await verifySupabaseToken(token, supabaseUrl, anonKey);
      if (!verifiedUser) {
        return new Response(null, { status: 204 });
      }

      const country = (request as any).cf?.country || null;
      const ua = (request.headers.get('user-agent') || '').toLowerCase();
      const device = parseDeviceType(ua);
      const provider =
        verifiedUser.app_metadata?.provider === 'google' ? 'google' : 'password';

      const insertPromise = fetch(`${supabaseUrl}/rest/v1/login_events`, {
        method: 'POST',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          user_id: verifiedUser.id,
          email: verifiedUser.email,
          provider,
          event: 'logout',
          auth_session_id: verifiedUser.session_id || null,
          country,
          device,
        }),
      }).catch((err) => {
        console.error('Failed to log logout event:', err);
      });

      if (ctx && typeof ctx.waitUntil === 'function') {
        ctx.waitUntil(insertPromise);
      } else {
        await insertPromise;
      }

      return new Response(null, { status: 204 });
    }

    // ============================================================================
    // PART 4: ACTIVITY HEARTBEAT ENDPOINT (POST /api/activity)
    // ============================================================================
    if (url.pathname === '/api/activity' && request.method === 'POST') {
      if (!isAllowedTrackOrigin(request)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
      if (contentLength > 2048) {
        return new Response(JSON.stringify({ error: 'Payload too large' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const rawText = await request.text();
      if (rawText.length > 2048) {
        return new Response(JSON.stringify({ error: 'Payload too large' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const session_id = typeof data.session_id === 'string' ? data.session_id.trim() : '';
      const visitor_id = typeof data.visitor_id === 'string' ? data.visitor_id.trim() : '';
      if (!UUID_REGEX.test(session_id) || !UUID_REGEX.test(visitor_id)) {
        return new Response(JSON.stringify({ error: 'Invalid UUID format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      let path = typeof data.path === 'string' ? data.path : '';
      path = path.split('?')[0].split('#')[0].trim();
      if (!path.startsWith('/') || path.length > 200) {
        return new Response(JSON.stringify({ error: 'Invalid path' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (isActivityRateLimited(session_id)) {
        return new Response(null, { status: 204 });
      }

      const ua = (request.headers.get('user-agent') || '').toLowerCase();
      const is_bot = /bot|crawler|spider|curl|headless|lighthouse|slurp|facebookexternalhit|whatsapp|preview|mediapartners|inspection/i.test(ua);
      const country = (request as any).cf?.country || null;
      const device = parseDeviceType(ua);

      const supabaseUrl = (
        env?.SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        ''
      ).trim().replace(/\/+$/, '');
      const anonKey = (
        env?.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        ''
      ).trim();
      const serviceRoleKey = (
        env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
      ).trim();

      if (!supabaseUrl || !serviceRoleKey) {
        return new Response(null, { status: 204 });
      }

      let user_id: string | null = null;
      const authHeader = request.headers.get('authorization') || '';
      const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
      if (tokenMatch && anonKey) {
        const verified = await verifySupabaseToken(tokenMatch[1].trim(), supabaseUrl, anonKey);
        if (verified) {
          user_id = verified.id;
        }
      }

      const rpcPromise = fetch(`${supabaseUrl}/rest/v1/rpc/record_heartbeat`, {
        method: 'POST',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_session: session_id,
          p_visitor: visitor_id,
          p_user: user_id,
          p_path: path,
          p_country: country,
          p_device: device,
          p_bot: is_bot,
          p_delta: 30,
        }),
      }).catch((err) => {
        console.error('Failed to execute record_heartbeat RPC:', err);
      });

      if (ctx && typeof ctx.waitUntil === 'function') {
        ctx.waitUntil(rpcPromise);
      } else {
        await rpcPromise;
      }

      return new Response(null, { status: 204 });
    }

    // ============================================================================
    // PART 4: MULTI-ADMIN AUTHENTICATION & RBAC ENDPOINTS
    // ============================================================================

    // POST /api/admin/login
    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      const ip =
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for') ||
        'unknown';

      if (!checkLoginRateLimit(ip)) {
        return jsonResponse(
          { error: 'Too many login attempts. Please wait 5 minutes and try again.' },
          429
        );
      }

      try {
        const body = (await request.json()) as any;
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';

        const sessionSecret = (
          env?.ADMIN_SESSION_SECRET ||
          process.env.ADMIN_SESSION_SECRET ||
          ''
        ).trim();
        const sbConfig = getSupabaseAdminConfig(env);

        if (!sessionSecret || !sbConfig) {
          console.error('Admin authentication environment secrets not set.');
          await new Promise((r) => setTimeout(r, 500));
          return jsonResponse({ error: 'Server authentication is not configured.' }, 500);
        }

        if (!ADMIN_EMAIL_REGEX.test(email) || !password) {
          recordLoginFailure(ip);
          await new Promise((r) => setTimeout(r, 500));
          return jsonResponse({ error: 'Invalid email or password.' }, 401);
        }

        const safeEmailFilter = email.replace(/[%_\\]/g, '');
        const lookup = await supabaseRest(
          sbConfig,
          `admin_users?email=ilike.${encodeURIComponent(safeEmailFilter)}&select=id,email,full_name,role,password_hash,is_active,permissions,token_version`
        );

        const candidates: AdminUserRecord[] = Array.isArray(lookup.data) ? lookup.data : [];
        const user = candidates.find((u) =>
          timingSafeEqualStrings((u.email || '').toLowerCase(), email)
        );

        const passwordMatch =
          user && user.password_hash ? await verifyPassword(password, user.password_hash) : false;

        if (!user || !passwordMatch) {
          recordLoginFailure(ip);
          await writeAdminAuditLog(sbConfig, request, {
            actor_id: user?.id || null,
            actor_email: email,
            actor_role: user?.role || null,
            target_id: user?.id || null,
            target_email: email,
            action: 'login_failed',
            details: { reason: user ? 'invalid_password' : 'unknown_email' },
          });
          await new Promise((r) => setTimeout(r, 500));
          return jsonResponse({ error: 'Invalid email or password.' }, 401);
        }

        if (!user.is_active) {
          await writeAdminAuditLog(sbConfig, request, {
            actor_id: user.id,
            actor_email: user.email,
            actor_role: user.role,
            target_id: user.id,
            target_email: user.email,
            action: 'login_failed',
            details: { reason: 'account_disabled' },
          });
          return jsonResponse(
            { error: 'This administrator account has been disabled. Contact the Main Owner.' },
            403
          );
        }

        clearLoginFailures(ip);
        const nowIso = new Date().toISOString();
        await supabaseRest(sbConfig, `admin_users?id=eq.${encodeURIComponent(user.id)}`, {
          method: 'PATCH',
          body: JSON.stringify({
            last_login_at: nowIso,
            last_seen_at: nowIso,
          }),
        });

        await writeAdminAuditLog(sbConfig, request, {
          actor_id: user.id,
          actor_email: user.email,
          actor_role: user.role,
          target_id: user.id,
          target_email: user.email,
          action: 'login_success',
          details: { role: user.role },
        });

        const sessionToken = await signSessionToken(
          {
            id: user.id,
            email: user.email,
            role: user.role,
            token_version: user.token_version || 1,
          },
          sessionSecret
        );

        return jsonResponse(
          {
            success: true,
            user: sanitizeAdminPublic(user),
          },
          200,
          { 'Set-Cookie': buildSessionCookie(sessionToken, url) }
        );
      } catch {
        recordLoginFailure(ip);
        await new Promise((r) => setTimeout(r, 500));
        return jsonResponse({ error: 'Invalid authentication request.' }, 400);
      }
    }

    // POST /api/admin/logout
    if (url.pathname === '/api/admin/logout' && request.method === 'POST') {
      const sessionToken = getSessionTokenFromRequest(request);
      const sessionSecret = (
        env?.ADMIN_SESSION_SECRET ||
        process.env.ADMIN_SESSION_SECRET ||
        ''
      ).trim();
      const sbConfig = getSupabaseAdminConfig(env);

      if (sessionToken && sessionSecret && sbConfig) {
        const payload = await verifySessionToken(sessionToken, sessionSecret);
        if (payload) {
          await writeAdminAuditLog(sbConfig, request, {
            actor_id: payload.sub,
            actor_email: payload.email,
            actor_role: payload.role,
            target_id: payload.sub,
            target_email: payload.email,
            action: 'logout',
          });
        }
      }

      return jsonResponse({ success: true }, 200, {
        'Set-Cookie': buildClearSessionCookie(url),
      });
    }

    // ============================================================================
    // PART 4B: LIVE SESSION REVALIDATION & RBAC ON ADMIN PAGES AND APIS
    // ============================================================================
    const isAdminPage = url.pathname === '/admin' || url.pathname.startsWith('/admin/');
    const isAdminApi = url.pathname.startsWith('/api/admin/');
    let currentAdmin: AdminUserRecord | null = null;

    if (isAdminPage || isAdminApi) {
      const isPublicAdminRoute =
        url.pathname === '/admin/login' ||
        url.pathname === '/api/admin/login' ||
        url.pathname === '/api/admin/logout';

      if (!isPublicAdminRoute) {
        const sessionToken = getSessionTokenFromRequest(request);
        const sessionSecret = (
          env?.ADMIN_SESSION_SECRET ||
          process.env.ADMIN_SESSION_SECRET ||
          ''
        ).trim();
        const sbConfig = getSupabaseAdminConfig(env);

        const payload = await verifySessionToken(sessionToken, sessionSecret);
        if (payload && sbConfig) {
          const userRes = await supabaseRest(
            sbConfig,
            `admin_users?id=eq.${encodeURIComponent(payload.sub)}&select=id,email,full_name,role,is_active,permissions,token_version,created_by,created_at,updated_at,last_login_at,last_seen_at,password_changed_at`
          );
          const row: AdminUserRecord | undefined = Array.isArray(userRes.data)
            ? userRes.data[0]
            : undefined;

          if (
            row &&
            row.is_active === true &&
            row.token_version === payload.tv &&
            row.role === payload.role &&
            timingSafeEqualStrings(row.email.toLowerCase(), payload.email.toLowerCase())
          ) {
            currentAdmin = row;
          }
        }

        if (!currentAdmin) {
          const clearCookie = buildClearSessionCookie(url);
          if (isAdminApi) {
            return jsonResponse({ error: 'Unauthorized' }, 401, {
              'Set-Cookie': clearCookie,
            });
          } else {
            return new Response(null, {
              status: 302,
              headers: {
                Location: '/admin/login',
                'Cache-Control': 'no-store',
                'Set-Cookie': clearCookie,
              },
            });
          }
        }

        if (isAdminPage && !hasAdminPagePermission(currentAdmin, url.pathname)) {
          return new Response(null, {
            status: 302,
            headers: {
              Location: '/admin',
              'Cache-Control': 'no-store',
            },
          });
        }
      }
    }

    // ============================================================================
    // PART 4C: ADMIN PROFILE, ACCOUNT MANAGEMENT & AUDIT LOG APIS
    // ============================================================================

    // GET /api/admin/me
    if (url.pathname === '/api/admin/me' && request.method === 'GET') {
      if (!currentAdmin) return jsonResponse({ error: 'Unauthorized' }, 401);
      return jsonResponse({ user: sanitizeAdminPublic(currentAdmin) });
    }

    // GET /api/admin/accounts
    if (url.pathname === '/api/admin/accounts' && request.method === 'GET') {
      if (!currentAdmin) return jsonResponse({ error: 'Unauthorized' }, 401);
      if (currentAdmin.role === 'member') {
        return jsonResponse({ error: 'Forbidden: Members cannot access account management.' }, 403);
      }

      const sbConfig = getSupabaseAdminConfig(env);
      if (!sbConfig) return jsonResponse({ error: 'Supabase credentials not configured' }, 500);

      const roleFilter = currentAdmin.role === 'co_owner' ? '&role=eq.member' : '';
      const res = await supabaseRest(
        sbConfig,
        `admin_users?select=id,email,full_name,role,is_active,permissions,created_by,created_at,updated_at,last_login_at,last_seen_at,password_changed_at${roleFilter}&order=created_at.asc`
      );

      if (!res.ok) {
        return jsonResponse({ error: 'Failed to load admin accounts' }, 502);
      }
      const accounts = Array.isArray(res.data) ? res.data.map(sanitizeAdminPublic) : [];
      return jsonResponse({ accounts });
    }

    // POST /api/admin/accounts (Create Member account — Main Owner & Co-owner only)
    if (url.pathname === '/api/admin/accounts' && request.method === 'POST') {
      if (!currentAdmin) return jsonResponse({ error: 'Unauthorized' }, 401);
      if (currentAdmin.role === 'member') {
        return jsonResponse({ error: 'Forbidden: Members cannot create accounts.' }, 403);
      }

      const sbConfig = getSupabaseAdminConfig(env);
      if (!sbConfig) return jsonResponse({ error: 'Supabase credentials not configured' }, 500);

      try {
        const body = (await request.json()) as any;
        const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';

        if (body.role !== undefined && body.role !== 'member') {
          return jsonResponse(
            {
              error:
                'Forbidden: Privileged accounts (Main Owner / Co-owner) can only be provisioned via CLI.',
            },
            403
          );
        }

        if (!fullName || fullName.length < 2) {
          return jsonResponse({ error: 'Full name is required (at least 2 characters).' }, 400);
        }
        if (!ADMIN_EMAIL_REGEX.test(email)) {
          return jsonResponse({ error: 'A valid Gmail / email address is required.' }, 400);
        }
        if (!password || password.length < 8) {
          return jsonResponse({ error: 'Password must be at least 8 characters long.' }, 400);
        }

        const safeEmailFilter = email.replace(/[%_\\]/g, '');
        const existingRes = await supabaseRest(
          sbConfig,
          `admin_users?email=ilike.${encodeURIComponent(safeEmailFilter)}&select=id,email`
        );
        const existingList: AdminUserRecord[] = Array.isArray(existingRes.data)
          ? existingRes.data
          : [];
        if (existingList.some((u) => u.email.toLowerCase() === email)) {
          return jsonResponse({ error: 'An admin account with this email already exists.' }, 409);
        }

        const passwordHash = await hashPassword(password);
        const permissions = sanitizeMemberPermissions(body.permissions);

        const insertRes = await supabaseRest(sbConfig, 'admin_users', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({
            email,
            full_name: fullName,
            role: 'member',
            password_hash: passwordHash,
            is_active: true,
            permissions,
            token_version: 1,
            created_by: currentAdmin.id,
          }),
        });

        if (!insertRes.ok || !Array.isArray(insertRes.data) || !insertRes.data[0]) {
          return jsonResponse({ error: 'Failed to create member account.' }, 502);
        }

        const created = insertRes.data[0] as AdminUserRecord;

        await writeAdminAuditLog(sbConfig, request, {
          actor_id: currentAdmin.id,
          actor_email: currentAdmin.email,
          actor_role: currentAdmin.role,
          target_id: created.id,
          target_email: created.email,
          action: 'account_created',
          details: { role: 'member', permissions },
        });

        return jsonResponse({ account: sanitizeAdminPublic(created) }, 201);
      } catch {
        return jsonResponse({ error: 'Invalid request payload.' }, 400);
      }
    }

    // POST /api/admin/accounts/:id/reset-password
    if (
      url.pathname.startsWith('/api/admin/accounts/') &&
      url.pathname.endsWith('/reset-password') &&
      request.method === 'POST'
    ) {
      if (!currentAdmin) return jsonResponse({ error: 'Unauthorized' }, 401);
      if (currentAdmin.role === 'member') {
        return jsonResponse({ error: 'Forbidden: Members cannot reset passwords.' }, 403);
      }

      const targetId = url.pathname
        .slice('/api/admin/accounts/'.length, -'/reset-password'.length)
        .trim();
      if (!UUID_REGEX.test(targetId)) {
        return jsonResponse({ error: 'Invalid account ID.' }, 400);
      }

      const sbConfig = getSupabaseAdminConfig(env);
      if (!sbConfig) return jsonResponse({ error: 'Supabase credentials not configured' }, 500);

      const targetRes = await supabaseRest(
        sbConfig,
        `admin_users?id=eq.${encodeURIComponent(targetId)}&select=id,email,role,token_version`
      );
      const target: AdminUserRecord | undefined = Array.isArray(targetRes.data)
        ? targetRes.data[0]
        : undefined;
      if (!target) return jsonResponse({ error: 'Account not found.' }, 404);

      if (currentAdmin.role === 'co_owner' && target.role !== 'member') {
        return jsonResponse(
          { error: 'Forbidden: Co-owner can only reset Member passwords.' },
          403
        );
      }

      try {
        const body = (await request.json()) as any;
        const newPassword = typeof body.new_password === 'string' ? body.new_password : '';
        if (!newPassword || newPassword.length < 8) {
          return jsonResponse(
            { error: 'New password must be at least 8 characters long.' },
            400
          );
        }

        const passwordHash = await hashPassword(newPassword);
        const nextVersion = (target.token_version || 1) + 1;

        const updateRes = await supabaseRest(
          sbConfig,
          `admin_users?id=eq.${encodeURIComponent(target.id)}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              password_hash: passwordHash,
              token_version: nextVersion,
              password_changed_at: new Date().toISOString(),
            }),
          }
        );

        if (!updateRes.ok) {
          return jsonResponse({ error: 'Failed to reset password.' }, 502);
        }

        await writeAdminAuditLog(sbConfig, request, {
          actor_id: currentAdmin.id,
          actor_email: currentAdmin.email,
          actor_role: currentAdmin.role,
          target_id: target.id,
          target_email: target.email,
          action: 'password_reset',
          details: { target_role: target.role, token_version: nextVersion },
        });

        return jsonResponse({
          success: true,
          message: 'Password updated and previous sessions invalidated.',
        });
      } catch {
        return jsonResponse({ error: 'Invalid request payload.' }, 400);
      }
    }

    // PATCH /api/admin/accounts/:id
    if (
      url.pathname.startsWith('/api/admin/accounts/') &&
      !url.pathname.endsWith('/reset-password') &&
      request.method === 'PATCH'
    ) {
      if (!currentAdmin) return jsonResponse({ error: 'Unauthorized' }, 401);
      if (currentAdmin.role === 'member') {
        return jsonResponse({ error: 'Forbidden: Members cannot modify accounts.' }, 403);
      }

      const targetId = url.pathname.slice('/api/admin/accounts/'.length).trim();
      if (!UUID_REGEX.test(targetId)) {
        return jsonResponse({ error: 'Invalid account ID.' }, 400);
      }

      const sbConfig = getSupabaseAdminConfig(env);
      if (!sbConfig) return jsonResponse({ error: 'Supabase credentials not configured' }, 500);

      const targetRes = await supabaseRest(
        sbConfig,
        `admin_users?id=eq.${encodeURIComponent(targetId)}&select=id,email,full_name,role,is_active,permissions,token_version`
      );
      const target: AdminUserRecord | undefined = Array.isArray(targetRes.data)
        ? targetRes.data[0]
        : undefined;
      if (!target) return jsonResponse({ error: 'Account not found.' }, 404);

      if (currentAdmin.role === 'co_owner' && target.role !== 'member') {
        return jsonResponse(
          { error: 'Forbidden: Co-owner cannot modify Main Owner or Co-owner accounts.' },
          403
        );
      }

      try {
        const body = (await request.json()) as any;
        const updates: Record<string, unknown> = {};
        let nextTokenVersion = target.token_version || 1;
        const auditActions: Array<{ action: string; details: Record<string, unknown> }> = [];

        if (typeof body.email === 'string' && body.email.trim().toLowerCase() !== target.email.toLowerCase()) {
          if (target.role === 'main_owner' || target.role === 'co_owner') {
            return jsonResponse(
              { error: 'Main Owner and Co-owner Gmail addresses are permanently fixed.' },
              403
            );
          }
          const newEmail = body.email.trim().toLowerCase();
          if (!ADMIN_EMAIL_REGEX.test(newEmail)) {
            return jsonResponse({ error: 'Invalid email address.' }, 400);
          }
          const dupCheck = await supabaseRest(
            sbConfig,
            `admin_users?email=ilike.${encodeURIComponent(newEmail.replace(/[%_\\]/g, ''))}&select=id,email`
          );
          if (
            Array.isArray(dupCheck.data) &&
            dupCheck.data.some((u: any) => u.id !== target.id && u.email.toLowerCase() === newEmail)
          ) {
            return jsonResponse({ error: 'An account with that email already exists.' }, 409);
          }
          updates.email = newEmail;
        }

        if (typeof body.full_name === 'string') {
          const trimmedName = body.full_name.trim();
          if (trimmedName.length < 2) {
            return jsonResponse({ error: 'Full name must be at least 2 characters.' }, 400);
          }
          updates.full_name = trimmedName;
        }

        if (body.role !== undefined && body.role !== target.role) {
          if (currentAdmin.role !== 'main_owner') {
            return jsonResponse({ error: 'Forbidden: Only Main Owner can change roles.' }, 403);
          }
          if (target.id === currentAdmin.id || target.role === 'main_owner') {
            return jsonResponse({ error: 'The Main Owner role cannot be changed.' }, 403);
          }
          if (!VALID_ADMIN_ROLES.includes(body.role)) {
            return jsonResponse({ error: 'Invalid role value.' }, 400);
          }
          if (body.role === 'main_owner' || body.role === 'co_owner') {
            return jsonResponse(
              {
                error:
                  'Only one Main Owner and one Co-owner may exist, and they are provisioned via CLI.',
              },
              403
            );
          }
          updates.role = body.role;
          nextTokenVersion++;
          auditActions.push({
            action: 'role_changed',
            details: { from: target.role, to: body.role },
          });
        }

        if (typeof body.is_active === 'boolean' && body.is_active !== target.is_active) {
          if (target.role === 'main_owner' || target.id === currentAdmin.id) {
            return jsonResponse({ error: 'The Main Owner account cannot be disabled.' }, 403);
          }
          updates.is_active = body.is_active;
          if (!body.is_active) {
            nextTokenVersion++;
          }
          auditActions.push({
            action: body.is_active ? 'account_enabled' : 'account_disabled',
            details: { target_role: target.role },
          });
        }

        if (body.permissions !== undefined && target.role === 'member') {
          updates.permissions = sanitizeMemberPermissions(body.permissions);
        }

        if (Object.keys(updates).length === 0) {
          return jsonResponse({ account: sanitizeAdminPublic(target) });
        }

        updates.token_version = nextTokenVersion;

        const patchRes = await supabaseRest(
          sbConfig,
          `admin_users?id=eq.${encodeURIComponent(target.id)}`,
          {
            method: 'PATCH',
            headers: { Prefer: 'return=representation' },
            body: JSON.stringify(updates),
          }
        );

        if (!patchRes.ok || !Array.isArray(patchRes.data) || !patchRes.data[0]) {
          return jsonResponse({ error: 'Failed to update admin account.' }, 502);
        }

        const updated = patchRes.data[0] as AdminUserRecord;

        if (auditActions.length === 0) {
          auditActions.push({
            action: 'account_updated',
            details: { fields: Object.keys(updates).filter((k) => k !== 'token_version') },
          });
        }

        for (const item of auditActions) {
          await writeAdminAuditLog(sbConfig, request, {
            actor_id: currentAdmin.id,
            actor_email: currentAdmin.email,
            actor_role: currentAdmin.role,
            target_id: updated.id,
            target_email: updated.email,
            action: item.action,
            details: item.details,
          });
        }

        return jsonResponse({ account: sanitizeAdminPublic(updated) });
      } catch {
        return jsonResponse({ error: 'Invalid request payload.' }, 400);
      }
    }

    // DELETE /api/admin/accounts/:id (Main Owner only, Member accounts only)
    if (
      url.pathname.startsWith('/api/admin/accounts/') &&
      !url.pathname.endsWith('/reset-password') &&
      request.method === 'DELETE'
    ) {
      if (!currentAdmin) return jsonResponse({ error: 'Unauthorized' }, 401);
      if (currentAdmin.role !== 'main_owner') {
        return jsonResponse(
          { error: 'Forbidden: Only the Main Owner can delete Member accounts.' },
          403
        );
      }

      const targetId = url.pathname.slice('/api/admin/accounts/'.length).trim();
      if (!UUID_REGEX.test(targetId)) {
        return jsonResponse({ error: 'Invalid account ID.' }, 400);
      }

      const sbConfig = getSupabaseAdminConfig(env);
      if (!sbConfig) return jsonResponse({ error: 'Supabase credentials not configured' }, 500);

      const targetRes = await supabaseRest(
        sbConfig,
        `admin_users?id=eq.${encodeURIComponent(targetId)}&select=id,email,role`
      );
      const target: AdminUserRecord | undefined = Array.isArray(targetRes.data)
        ? targetRes.data[0]
        : undefined;
      if (!target) return jsonResponse({ error: 'Account not found.' }, 404);

      if (target.role !== 'member') {
        return jsonResponse(
          { error: 'Forbidden: Main Owner and Co-owner accounts cannot be deleted.' },
          403
        );
      }

      const delRes = await supabaseRest(
        sbConfig,
        `admin_users?id=eq.${encodeURIComponent(target.id)}`,
        { method: 'DELETE' }
      );
      if (!delRes.ok) {
        return jsonResponse({ error: 'Failed to delete member account.' }, 502);
      }

      await writeAdminAuditLog(sbConfig, request, {
        actor_id: currentAdmin.id,
        actor_email: currentAdmin.email,
        actor_role: currentAdmin.role,
        target_id: null,
        target_email: target.email,
        action: 'account_deleted',
        details: { deleted_id: target.id, deleted_role: target.role },
      });

      return jsonResponse({ success: true });
    }

    // GET /api/admin/audit-logs (Main Owner: all logs; Co-owner: Member logs only)
    if (url.pathname === '/api/admin/audit-logs' && request.method === 'GET') {
      if (!currentAdmin) return jsonResponse({ error: 'Unauthorized' }, 401);
      if (currentAdmin.role === 'member') {
        return jsonResponse({ error: 'Forbidden: Members cannot access audit logs.' }, 403);
      }

      const sbConfig = getSupabaseAdminConfig(env);
      if (!sbConfig) return jsonResponse({ error: 'Supabase credentials not configured' }, 500);

      const logsRes = await supabaseRest(
        sbConfig,
        'admin_audit_logs?select=id,actor_id,actor_email,actor_role,target_id,target_email,action,details,ip_address,created_at&order=created_at.desc&limit=100'
      );

      if (!logsRes.ok) {
        return jsonResponse({ error: 'Failed to load audit logs.' }, 502);
      }

      let logs = Array.isArray(logsRes.data) ? logsRes.data : [];
      if (currentAdmin.role === 'co_owner') {
        // Co-owner sees Member login history & Member management activity, never Main Owner's private logins
        logs = logs.filter(
          (l: any) =>
            l.actor_role === 'member' ||
            l.details?.role === 'member' ||
            l.details?.target_role === 'member' ||
            l.details?.deleted_role === 'member'
        );
      }

      return jsonResponse({ logs });
    }

    // ============================================================================
    // PART 3B: ADMIN ANALYTICS RPC ENDPOINT (GET /api/admin/analytics)
    // ============================================================================
    if (url.pathname === '/api/admin/analytics' && request.method === 'GET') {
      if (
        currentAdmin?.role === 'member' &&
        !currentAdmin.permissions?.includes('overview')
      ) {
        return jsonResponse({ error: 'Forbidden: Insufficient permissions.' }, 403);
      }
      const allowedRanges = ['1h', '24h', '7d', '30d'] as const;
      type AllowedRange = (typeof allowedRanges)[number];
      const rangeParam = url.searchParams.get('range') || '24h';

      if (!allowedRanges.includes(rangeParam as AllowedRange)) {
        return new Response(
          JSON.stringify({
            error: 'Invalid range parameter. Allowed values: 1h, 24h, 7d, 30d.',
            code: 'invalid_range',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }
      const range = rangeParam as AllowedRange;

      const serviceRoleKey = (
        env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
      ).trim();
      const supabaseUrl = (
        env?.SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        ''
      ).trim().replace(/\/+$/, '');

      if (!serviceRoleKey || !supabaseUrl) {
        return new Response(
          JSON.stringify({
            error: 'Analytics service credentials not configured.',
            code: 'analytics_not_configured',
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }

      const rpcHeaders = {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      };

      try {
        const [timeseriesRes, summaryRes, topPagesRes] = await Promise.all([
          fetch(`${supabaseUrl}/rest/v1/rpc/analytics_timeseries`, {
            method: 'POST',
            headers: rpcHeaders,
            body: JSON.stringify({ p_range: range }),
          }),
          fetch(`${supabaseUrl}/rest/v1/rpc/analytics_summary`, {
            method: 'POST',
            headers: rpcHeaders,
            body: JSON.stringify({ p_range: range }),
          }),
          fetch(`${supabaseUrl}/rest/v1/rpc/top_pages_range`, {
            method: 'POST',
            headers: rpcHeaders,
            body: JSON.stringify({ p_range: range, lim: 8 }),
          }),
        ]);

        if (!timeseriesRes.ok || !summaryRes.ok || !topPagesRes.ok) {
          const failedRes = !timeseriesRes.ok
            ? timeseriesRes
            : !summaryRes.ok
            ? summaryRes
            : topPagesRes;
          return new Response(
            JSON.stringify({
              error: 'Analytics database query failed. The required SQL functions may not be installed or configured.',
              code: 'analytics_query_failed',
              upstreamStatus: failedRes.status,
            }),
            {
              status: 502,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
              },
            }
          );
        }

        const [timeseriesData, summaryData, topPagesData] = await Promise.all([
          timeseriesRes.json(),
          summaryRes.json(),
          topPagesRes.json(),
        ]);

        const summaryRow =
          Array.isArray(summaryData) && summaryData.length > 0 ? summaryData[0] : null;

        const series = (Array.isArray(timeseriesData) ? timeseriesData : []).map((row: any) => ({
          t: row?.bucket ?? '',
          views: Number(row?.views) || 0,
          visitors: Number(row?.visitors) || 0,
        }));

        const summary = {
          views: Number(summaryRow?.views) || 0,
          visitors: Number(summaryRow?.visitors) || 0,
          prevViews: Number(summaryRow?.prev_views) || 0,
          prevVisitors: Number(summaryRow?.prev_visitors) || 0,
        };

        const topPages = (Array.isArray(topPagesData) ? topPagesData : []).map((row: any) => ({
          path: String(row?.path || ''),
          views: Number(row?.views) || 0,
          visitors: Number(row?.visitors) || 0,
        }));

        return new Response(
          JSON.stringify({
            range,
            series,
            summary,
            topPages,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            error: 'Failed to query analytics RPC endpoints.',
            code: 'analytics_query_failed',
          }),
          {
            status: 502,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }
    }

    // ============================================================================
    // PART 5: ADMIN SITE USERS & REAL-TIME ACTIVITY RPC ENDPOINTS
    // ============================================================================

    // GET /api/admin/users
    if (url.pathname === '/api/admin/users' && request.method === 'GET') {
      if (
        currentAdmin?.role === 'member' &&
        !currentAdmin.permissions?.includes('users')
      ) {
        return jsonResponse({ error: 'Forbidden: Insufficient permissions.' }, 403);
      }
      const serviceRoleKey = (
        env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
      ).trim();
      const supabaseUrl = (
        env?.SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        ''
      ).trim().replace(/\/+$/, '');

      if (!serviceRoleKey || !supabaseUrl) {
        return new Response(
          JSON.stringify({ error: 'Supabase credentials not configured' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }

      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/rpc/admin_users_overview`, {
          method: 'POST',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: '{}',
        });

        const users = res.ok ? await res.json() : [];
        return new Response(JSON.stringify(users), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch users overview', details: err?.message }),
          {
            status: 502,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }
    }

    // GET /api/admin/users/:id
    if (url.pathname.startsWith('/api/admin/users/') && request.method === 'GET') {
      if (
        currentAdmin?.role === 'member' &&
        !currentAdmin.permissions?.includes('users')
      ) {
        return jsonResponse({ error: 'Forbidden: Insufficient permissions.' }, 403);
      }
      const userId = url.pathname.slice('/api/admin/users/'.length).trim();
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!UUID_REGEX.test(userId)) {
        return new Response(JSON.stringify({ error: 'Invalid user ID format' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
      }

      const serviceRoleKey = (
        env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
      ).trim();
      const supabaseUrl = (
        env?.SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        ''
      ).trim().replace(/\/+$/, '');

      if (!serviceRoleKey || !supabaseUrl) {
        return new Response(
          JSON.stringify({ error: 'Supabase credentials not configured' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }

      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/rpc/admin_user_detail`, {
          method: 'POST',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ p_user: userId }),
        });

        const detail = res.ok ? await res.json() : { logins: [], sessions: [] };
        return new Response(JSON.stringify(detail), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch user details', details: err?.message }),
          {
            status: 502,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }
    }

    // GET /api/admin/active-now
    if (url.pathname === '/api/admin/active-now' && request.method === 'GET') {
      if (
        currentAdmin?.role === 'member' &&
        !currentAdmin.permissions?.includes('overview') &&
        !currentAdmin.permissions?.includes('users')
      ) {
        return jsonResponse({ error: 'Forbidden: Insufficient permissions.' }, 403);
      }
      const serviceRoleKey = (
        env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
      ).trim();
      const supabaseUrl = (
        env?.SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        ''
      ).trim().replace(/\/+$/, '');

      if (!serviceRoleKey || !supabaseUrl) {
        return new Response(
          JSON.stringify({ error: 'Supabase credentials not configured' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }

      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/rpc/admin_active_now`, {
          method: 'POST',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: '{}',
        });

        const activeData = res.ok ? await res.json() : { total: 0, logged_in: 0 };
        return new Response(JSON.stringify(activeData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: 'Failed to query active users', details: err?.message }),
          {
            status: 502,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }
    }

    // ============================================================================
    // GENERIC /api/* PROXY FALLBACK (to FastAPI if configured)
    // ============================================================================
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

    // ============================================================================
    // OPENNEXT HANDLER DELEGATION (Next.js Pages & Assets)
    // ============================================================================
    let nextResponse: Response;
    if (typeof openNextHandler.fetch === 'function') {
      nextResponse = await openNextHandler.fetch(request, env, ctx);
    } else if (typeof openNextHandler === 'function') {
      nextResponse = await (openNextHandler as any)(request, env, ctx);
    } else {
      throw new Error('OpenNext handler does not expose a callable fetch method');
    }

    // Ensure Cache-Control: no-store on all admin responses
    if (isAdminPage || isAdminApi) {
      const securedHeaders = new Headers(nextResponse.headers);
      securedHeaders.set('Cache-Control', 'no-store');
      return new Response(nextResponse.body, {
        status: nextResponse.status,
        statusText: nextResponse.statusText,
        headers: securedHeaders,
      });
    }

    return nextResponse;
  },
};
