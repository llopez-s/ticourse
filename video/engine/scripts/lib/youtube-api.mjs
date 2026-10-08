// YouTube Data API v3 for youtube-upload.mjs: OAuth for an installed app (loopback redirect + PKCE), the video
// resource, a resumable upload that resumes where the server stopped, the thumbnail, captions as
// multipart/related, the playlist, and the check that keeps an upload on the Alertópolis channel. Every network
// call takes `fetch` as a parameter, so the tests drive it with an in-memory server.
import { createHash, randomBytes } from 'node:crypto';

/** youtube.upload for videos.insert and thumbnails.set; youtube.force-ssl for captions.insert and playlistItems. */
export const SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.force-ssl'];
/** The channel lesson videos go to (YouTube Studio id); never the personal one. */
export const ALERTOPOLIS_CHANNEL_ID = 'UCe0XBMwoI3bI61K8qolacJA';
export const PLAYLIST_TITLES = Object.freeze({ secplus: 'CompTIA Security+ SY0-701 en español', gcti: 'GIAC GCTI en español' });
/** Bytes per PUT of the resumable upload; the protocol wants multiples of 256 KiB. */
export const CHUNK_SIZE = 8 * 1024 * 1024;
export const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const API = 'https://www.googleapis.com/youtube/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/youtube/v3';
const PRIVACY = ['private', 'unlisted', 'public'];
const EDUCATION = '27';
const RETRIABLE = new Set([500, 502, 503, 504]);

const base64url = (buf) => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** The client id and secret of the OAuth client JSON Google Cloud downloads for a «Desktop app». */
export function parseClientSecret(text) {
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('client_secret.json is not valid JSON: download it again from Google Cloud (Credentials → your OAuth client)');
  }
  const installed = json.installed;
  if (!installed?.client_id || !installed?.client_secret) {
    throw new Error('client_secret.json is not a «Desktop app» OAuth client: create one of that type in Google Cloud and download its JSON');
  }
  return { clientId: installed.client_id, clientSecret: installed.client_secret };
}

/** A fresh PKCE code verifier (64 characters). */
export function pkceVerifier() {
  return base64url(randomBytes(48));
}

/** The S256 code challenge of a verifier. */
export function pkceChallenge(verifier) {
  return base64url(createHash('sha256').update(verifier).digest());
}

/** The consent page for an installed app; `prompt=consent` so Google hands back a refresh token every time. */
export function authUrl({ clientId, redirectUri, challenge, state }) {
  const url = new URL(AUTH_URL);
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    code_challenge: challenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
    state,
  }).toString();
  return url.toString();
}

/**
 * Waits on a listening loopback `server` for Google's redirect and resolves with the authorization code. A
 * redirect with another `state`, a refused consent or `timeoutMs` without an answer rejects.
 */
export function waitForCode(server, redirectUri, state, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`no answer from the consent page in ${Math.round(timeoutMs / 60000)} minutes`)), timeoutMs);
    server.on('request', (req, res) => {
      const url = new URL(req.url, redirectUri);
      if (url.pathname !== '/') {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      clearTimeout(timer);
      if (url.searchParams.get('state') !== state) {
        res.end('<p>Respuesta inesperada: vuelve a lanzar <code>--auth</code>.</p>');
        reject(new Error('the consent page answered with another state'));
        return;
      }
      const error = url.searchParams.get('error');
      res.end(error ? `<p>No se ha autorizado (${error}).</p>` : '<p>Listo: ya puedes cerrar esta pestaña.</p>');
      if (error) reject(new Error(`consent refused: ${error}`));
      else resolve(url.searchParams.get('code'));
    });
  });
}

async function apiError(res, what = 'YouTube API') {
  const text = await res.text();
  let message = text;
  try {
    const json = JSON.parse(text);
    message = json.error?.message ?? json.error_description ?? json.error ?? text;
  } catch {
    // not JSON: keep the text
  }
  return new Error(`${what} ${res.status}: ${message}`);
}

async function tokenRequest(fetch, form) {
  return fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(form).toString(),
  });
}

/** Trades the consent page's code for tokens (with a refresh_token, thanks to access_type=offline). */
export async function exchangeCode({ fetch, client, code, verifier, redirectUri }) {
  const res = await tokenRequest(fetch, {
    code,
    client_id: client.clientId,
    client_secret: client.clientSecret,
    code_verifier: verifier,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });
  if (!res.ok) throw await apiError(res, 'token exchange');
  return res.json();
}

/** A fresh access token from the stored refresh token. */
export async function refreshAccessToken({ fetch, client, refreshToken }) {
  const res = await tokenRequest(fetch, {
    client_id: client.clientId,
    client_secret: client.clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  if (!res.ok) {
    const error = await apiError(res, 'token refresh');
    throw new Error(`${error.message} — sign in again with: node video/engine/scripts/youtube-upload.mjs --auth`);
  }
  return (await res.json()).access_token;
}

/** The videos.insert body: Education, Spanish, not made for kids, private unless told otherwise. */
export function videoResource({ title, description, tags, privacy = 'private' }) {
  if (!PRIVACY.includes(privacy)) throw new Error(`privacy must be one of ${PRIVACY.join(', ')} (got "${privacy}")`);
  return {
    snippet: { title, description, tags, categoryId: EDUCATION, defaultLanguage: 'es', defaultAudioLanguage: 'es' },
    status: { privacyStatus: privacy, selfDeclaredMadeForKids: false, embeddable: true, license: 'youtube' },
  };
}

/** Content-Range of a chunk, or of a status query when start is null. */
export function contentRange(start, end, total) {
  return start === null ? `bytes */${total}` : `bytes ${start}-${end}/${total}`;
}

/** The first byte the server does not have yet, from its Range header («bytes=0-524287»). */
export function nextOffset(range) {
  const m = /bytes=\d+-(\d+)/.exec(range ?? '');
  return m ? Number(m[1]) + 1 : 0;
}

/**
 * videos.insert as a resumable upload: opens a session, PUTs `readChunk(start, end)` chunk by chunk and, after a
 * network error or a 5xx, waits (exponential backoff), asks the server how far it got and resumes there. A 4xx
 * is final. Resolves with the created video resource.
 */
export async function resumableUpload({ fetch, token, resource, size, readChunk, chunkSize = CHUNK_SIZE, sleep, maxRetries = 8, onProgress }) {
  const auth = { Authorization: `Bearer ${token}` };
  const opened = await fetch(`${UPLOAD_API}/videos?uploadType=resumable&part=snippet,status`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Length': String(size), 'X-Upload-Content-Type': 'video/mp4' },
    body: JSON.stringify(resource),
  });
  if (!opened.ok) throw await apiError(opened, 'videos.insert');
  const session = opened.headers.get('Location');
  if (!session) throw new Error('videos.insert: YouTube returned no upload session URL');

  const done = (res) => res.status === 200 || res.status === 201;
  const statusQuery = () => fetch(session, { method: 'PUT', headers: { ...auth, 'Content-Range': contentRange(null, null, size) }, body: new Uint8Array(0) });
  let offset = 0;
  let retries = 0;
  for (;;) {
    // The server may answer the last chunk with a 308 that already covers every byte (V16, 2026-10-08). A further
    // chunk would have an impossible range and the session answers 410, leaving the video half-finished: ask for
    // the status until it hands over the video resource instead.
    if (offset >= size) {
      const status = await statusQuery();
      if (done(status)) return status.json();
      if (status.status !== 308 && !RETRIABLE.has(status.status)) throw await apiError(status, 'videos.insert');
      retries += 1;
      if (retries > maxRetries) throw new Error(`videos.insert: every byte was sent but YouTube never confirmed the video after ${maxRetries} status queries (HTTP ${status.status}); check Studio before uploading again`);
      await sleep(Math.min(2 ** retries, 64) * 1000 * (0.5 + Math.random()));
      if (status.status === 308) offset = Math.min(offset, nextOffset(status.headers.get('Range')));
      continue;
    }
    const end = Math.min(offset + chunkSize, size) - 1;
    let res = null;
    let failure = null;
    try {
      res = await fetch(session, { method: 'PUT', headers: { ...auth, 'Content-Range': contentRange(offset, end, size) }, body: readChunk(offset, end) });
    } catch (error) {
      failure = error;
    }
    if (res && done(res)) return res.json();
    if (res && res.status === 308) {
      offset = nextOffset(res.headers.get('Range'));
      retries = 0;
      onProgress?.(offset, size);
      continue;
    }
    if (res && !RETRIABLE.has(res.status)) throw await apiError(res, 'videos.insert');

    retries += 1;
    if (retries > maxRetries) throw new Error(`videos.insert: gave up after ${maxRetries} retries (${failure?.message ?? `HTTP ${res.status}`})`);
    await sleep(Math.min(2 ** retries, 64) * 1000 * (0.5 + Math.random()));
    const status = await statusQuery();
    if (done(status)) return status.json();
    if (status.status === 308) offset = nextOffset(status.headers.get('Range'));
    else if (!RETRIABLE.has(status.status)) throw await apiError(status, 'videos.insert');
  }
}

/** thumbnails.set with the poster's bytes. */
export async function setThumbnail({ fetch, token, videoId, bytes, file }) {
  const type = /\.png$/i.test(file) ? 'image/png' : 'image/jpeg';
  const res = await fetch(`${UPLOAD_API}/thumbnails/set?videoId=${encodeURIComponent(videoId)}&uploadType=media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': type },
    body: bytes,
  });
  if (!res.ok) throw await apiError(res, 'thumbnails.set');
  return res.json();
}

/** The captions.insert body: the caption snippet as JSON, then the track itself. */
export function captionsMultipart({ videoId, vtt, boundary = `alertopolis-${randomBytes(8).toString('hex')}`, language = 'es', name = 'Español' }) {
  const snippet = JSON.stringify({ snippet: { videoId, language, name, isDraft: false } });
  const body = [
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${snippet}\r\n`,
    `--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n${vtt}\r\n`,
    `--${boundary}--\r\n`,
  ].join('');
  return { body: Buffer.from(body, 'utf8'), contentType: `multipart/related; boundary=${boundary}` };
}

/** captions.insert of the Spanish WebVTT track. */
export async function insertCaptions({ fetch, token, videoId, vtt }) {
  const { body, contentType } = captionsMultipart({ videoId, vtt });
  const res = await fetch(`${UPLOAD_API}/captions?part=snippet&uploadType=multipart`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': contentType },
    body,
  });
  if (!res.ok) throw await apiError(res, 'captions.insert');
  return res.json();
}

/** The id of the track's playlist among the channel's playlists, or null. */
export function pickPlaylist(items, track) {
  return items.find((p) => p.snippet?.title === PLAYLIST_TITLES[track])?.id ?? null;
}

/** playlists.list of the signed-in channel (one page of 50 is plenty for this channel). */
export async function myPlaylists({ fetch, token }) {
  const res = await fetch(`${API}/playlists?part=snippet&mine=true&maxResults=50`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await apiError(res, 'playlists.list');
  return (await res.json()).items ?? [];
}

/** playlistItems.insert of the new video into a playlist. */
export async function addToPlaylist({ fetch, token, playlistId, videoId }) {
  const res = await fetch(`${API}/playlistItems?part=snippet`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ snippet: { playlistId, resourceId: { kind: 'youtube#video', videoId } } }),
  });
  if (!res.ok) throw await apiError(res, 'playlistItems.insert');
  return res.json();
}

/** channels.list of the signed-in account. */
export async function myChannel({ fetch, token }) {
  const res = await fetch(`${API}/channels?part=snippet&mine=true`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await apiError(res, 'channels.list');
  return res.json();
}

/** The channel of a channels.list response, if it is Alertópolis; throws otherwise (V4 went to the personal one). */
export function assertChannel(response) {
  const channel = response.items?.[0];
  if (!channel) throw new Error('no channel on this account: sign in with --auth and pick the Alertópolis channel');
  if (channel.id !== ALERTOPOLIS_CHANNEL_ID) {
    throw new Error(`signed in as «${channel.snippet?.title}» (${channel.id}), not Alertópolis: run --auth again and pick the Alertópolis channel`);
  }
  return channel;
}
