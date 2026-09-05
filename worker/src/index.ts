/**
 * ticourse-sync — a dumb key-value box for IntelForge Academy progress.
 *
 * It stores one JSON blob per SHA-256 digest of a user's sync code. It never
 * sees the code itself, has no accounts, and offers no way to list keys.
 */

export interface Env {
  PROGRESS: KVNamespace;
}

const ALLOWED_ORIGINS = [
  'https://llopez-s.github.io',
  'http://localhost:5173',
];

const MAX_BODY_BYTES = 512 * 1024;
const HASH_RE = /^[0-9a-f]{64}$/;

function corsHeaders(origin: string | null): Record<string, string> {
  // `vary: origin` must be sent on every response, allowed or not, so a
  // shared cache never serves a stored no-CORS response to an allowed origin.
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return { vary: 'origin' };
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET,PUT,OPTIONS',
    'access-control-allow-headers': 'content-type,accept',
    'access-control-max-age': '86400',
    vary: 'origin',
  };
}

const json = (body: unknown, status: number, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...cors },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request.headers.get('origin'));

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const { pathname } = new URL(request.url);
    const match = pathname.match(/^\/p\/([^/]+)$/);
    if (!match) return json({ error: 'not found' }, 404, cors);

    const hash = match[1];
    if (!HASH_RE.test(hash)) {
      return json({ error: 'bad key' }, 400, cors);
    }

    if (request.method === 'GET') {
      const stored = await env.PROGRESS.get(hash, 'text');
      if (stored === null) return json({ error: 'not found' }, 404, cors);
      return new Response(stored, {
        status: 200,
        headers: { 'content-type': 'application/json', ...cors },
      });
    }

    if (request.method === 'PUT') {
      // Fast path: reject on the declared Content-Length before buffering the
      // body at all. This can be absent or wrong, so it's a supplement to —
      // not a replacement for — the post-read length check below.
      const contentLength = request.headers.get('content-length');
      if (contentLength !== null) {
        const declaredLength = Number(contentLength);
        if (!Number.isNaN(declaredLength) && declaredLength > MAX_BODY_BYTES) {
          return json({ error: 'too large' }, 413, cors);
        }
      }
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return json({ error: 'too large' }, 413, cors);
      }
      let parsed: { v?: number; data?: unknown };
      try {
        parsed = JSON.parse(raw) as { v?: number; data?: unknown };
      } catch {
        return json({ error: 'invalid json' }, 400, cors);
      }
      if (
        typeof parsed.v !== 'number' ||
        typeof parsed.data !== 'object' ||
        parsed.data === null ||
        Array.isArray(parsed.data)
      ) {
        return json({ error: 'invalid body' }, 400, cors);
      }
      const updatedAt = new Date().toISOString();
      await env.PROGRESS.put(
        hash,
        JSON.stringify({ v: parsed.v, updatedAt, data: parsed.data }),
      );
      return json({ ok: true, updatedAt }, 200, cors);
    }

    return json({ error: 'method not allowed' }, 405, cors);
  },
};
