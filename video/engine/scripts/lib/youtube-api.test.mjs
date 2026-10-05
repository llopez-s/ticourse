import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import {
  ALERTOPOLIS_CHANNEL_ID,
  CHUNK_SIZE,
  SCOPES,
  addToPlaylist,
  assertChannel,
  authUrl,
  captionsMultipart,
  contentRange,
  exchangeCode,
  nextOffset,
  parseClientSecret,
  pickPlaylist,
  pkceChallenge,
  refreshAccessToken,
  resumableUpload,
  setThumbnail,
  videoResource,
  waitForCode,
} from './youtube-api.mjs';

test('pkceChallenge: S256 of the verifier, base64url without padding (RFC 7636, appendix B)', () => {
  assert.equal(pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
});

test('authUrl: installed-app consent with PKCE, offline access and both scopes', () => {
  const url = new URL(authUrl({ clientId: 'cid.apps.googleusercontent.com', redirectUri: 'http://127.0.0.1:53682', challenge: 'abc', state: 'st' }));
  assert.equal(url.origin + url.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
  const p = url.searchParams;
  assert.equal(p.get('client_id'), 'cid.apps.googleusercontent.com');
  assert.equal(p.get('redirect_uri'), 'http://127.0.0.1:53682');
  assert.equal(p.get('response_type'), 'code');
  assert.equal(p.get('scope'), SCOPES.join(' '));
  assert.equal(p.get('code_challenge'), 'abc');
  assert.equal(p.get('code_challenge_method'), 'S256');
  assert.equal(p.get('access_type'), 'offline');
  assert.equal(p.get('prompt'), 'consent');
  assert.equal(p.get('state'), 'st');
  assert.ok(SCOPES.includes('https://www.googleapis.com/auth/youtube.upload'));
  assert.ok(SCOPES.includes('https://www.googleapis.com/auth/youtube.force-ssl'), 'captions and playlists need force-ssl');
});

test('videoResource: Education, Spanish, not for kids, private unless told otherwise', () => {
  const r = videoResource({ title: 'T', description: 'D', tags: ['a', 'b'] });
  assert.deepEqual(r.snippet, { title: 'T', description: 'D', tags: ['a', 'b'], categoryId: '27', defaultLanguage: 'es', defaultAudioLanguage: 'es' });
  assert.deepEqual(r.status, { privacyStatus: 'private', selfDeclaredMadeForKids: false, embeddable: true, license: 'youtube' });
  assert.equal(videoResource({ title: 'T', description: 'D', tags: [], privacy: 'unlisted' }).status.privacyStatus, 'unlisted');
  assert.throws(() => videoResource({ title: 'T', description: 'D', tags: [], privacy: 'publico' }), /privacy must be one of private, unlisted, public/);
});

test('contentRange and nextOffset: the resumable protocol headers', () => {
  assert.equal(contentRange(0, 262143, 1000000), 'bytes 0-262143/1000000');
  assert.equal(contentRange(null, null, 1000000), 'bytes */1000000');
  assert.equal(nextOffset('bytes=0-524287'), 524288);
  assert.equal(nextOffset(null), 0);
  assert.equal(CHUNK_SIZE % (256 * 1024), 0, 'chunks must be multiples of 256 KiB');
});

/** A resumable-upload server in memory: one session, 308 until complete, an optional 503 on the nth PUT. */
function fakeServer({ total, failOnPut = 0 }) {
  const received = [];
  let puts = 0;
  let stored = 0;
  const calls = [];
  const fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method, headers: init.headers });
    if (init.method === 'POST') {
      assert.match(String(url), /uploadType=resumable/);
      assert.equal(init.headers['X-Upload-Content-Length'], String(total));
      return new Response(null, { status: 200, headers: { Location: 'https://upload.example/session/1' } });
    }
    assert.equal(String(url), 'https://upload.example/session/1');
    puts += 1;
    const range = init.headers['Content-Range'];
    if (range === `bytes */${total}`) {
      return new Response(null, { status: 308, headers: stored ? { Range: `bytes=0-${stored - 1}` } : {} });
    }
    if (puts === failOnPut) return new Response('busy', { status: 503 });
    const [, from, to] = /^bytes (\d+)-(\d+)\/\d+$/.exec(range).map(Number);
    assert.equal(from, stored, 'each chunk must start where the server stopped');
    received.push(Buffer.from(init.body));
    stored = to + 1;
    if (stored < total) return new Response(null, { status: 308, headers: { Range: `bytes=0-${stored - 1}` } });
    return Response.json({ id: 'vid123', status: { uploadStatus: 'uploaded' } });
  };
  return { fetch, received: () => Buffer.concat(received), calls };
}

test('resumableUpload: sends every chunk in order and returns the new video id', async () => {
  const data = Buffer.alloc(600 * 1024, 7);
  data[0] = 1;
  data[data.length - 1] = 9;
  const server = fakeServer({ total: data.length });
  const video = await resumableUpload({
    fetch: server.fetch,
    token: 'tok',
    resource: videoResource({ title: 'T', description: 'D', tags: [] }),
    size: data.length,
    readChunk: (start, end) => data.subarray(start, end + 1),
    chunkSize: 256 * 1024,
    sleep: async () => {},
  });
  assert.equal(video.id, 'vid123');
  assert.deepEqual(server.received(), data);
  assert.equal(server.calls[0].headers.Authorization, 'Bearer tok');
});

test('resumableUpload: after a 503 it asks the server where it stopped and resumes there', async () => {
  const data = Buffer.alloc(700 * 1024, 3);
  const server = fakeServer({ total: data.length, failOnPut: 2 });
  let waits = 0;
  const video = await resumableUpload({
    fetch: server.fetch,
    token: 'tok',
    resource: videoResource({ title: 'T', description: 'D', tags: [] }),
    size: data.length,
    readChunk: (start, end) => data.subarray(start, end + 1),
    chunkSize: 256 * 1024,
    sleep: async () => {
      waits += 1;
    },
  });
  assert.equal(video.id, 'vid123');
  assert.deepEqual(server.received(), data);
  assert.equal(waits, 1);
  assert.ok(server.calls.some((c) => c.headers['Content-Range'] === `bytes */${data.length}`), 'a status query after the failure');
});

test('resumableUpload: a 4xx is not retried', async () => {
  const fetch = async (url, init) =>
    init.method === 'POST' ? new Response('{"error":{"message":"quota"}}', { status: 403 }) : assert.fail('no PUT after a refused session');
  await assert.rejects(
    resumableUpload({ fetch, token: 't', resource: {}, size: 10, readChunk: () => Buffer.alloc(10), sleep: async () => {} }),
    /403.*quota/s,
  );
});

test('captionsMultipart: snippet JSON then the VTT, in one multipart/related body', () => {
  const { body, contentType } = captionsMultipart({ videoId: 'vid123', vtt: 'WEBVTT\n\n1\n00:00.000 --> 00:01.000\nHola\n', boundary: 'xyz' });
  assert.equal(contentType, 'multipart/related; boundary=xyz');
  const text = body.toString('utf8');
  const parts = text.split('--xyz');
  assert.equal(parts.length, 4, 'preamble, two parts, closing');
  assert.match(parts[1], /Content-Type: application\/json; charset=UTF-8/);
  const snippet = JSON.parse(parts[1].split('\r\n\r\n')[1]);
  assert.deepEqual(snippet, { snippet: { videoId: 'vid123', language: 'es', name: 'Español', isDraft: false } });
  assert.match(parts[2], /Content-Type: application\/octet-stream/, 'captions.insert accepts octet-stream, not text/vtt');
  assert.match(parts[2], /WEBVTT\n\n1\n00:00\.000 --> 00:01\.000\nHola/);
  assert.match(parts[3], /^--\r\n$/);
});

test('pickPlaylist: the track\'s playlist by its title, or null', () => {
  const items = [
    { id: 'PL1', snippet: { title: 'GIAC GCTI en español' } },
    { id: 'PL2', snippet: { title: 'CompTIA Security+ SY0-701 en español' } },
  ];
  assert.equal(pickPlaylist(items, 'secplus'), 'PL2');
  assert.equal(pickPlaylist(items, 'gcti'), 'PL1');
  assert.equal(pickPlaylist([], 'gcti'), null);
});

/** Records each request; answers with `reply(url, init)`. */
function recorder(reply) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    calls.push({ url: String(url), ...init });
    return reply(String(url), init);
  };
  return { fetch, calls };
}

test('exchangeCode: authorization_code grant with the PKCE verifier', async () => {
  const { fetch, calls } = recorder(() => Response.json({ access_token: 'a', refresh_token: 'r', expires_in: 3599 }));
  const tokens = await exchangeCode({ fetch, client: { clientId: 'cid', clientSecret: 'sec' }, code: 'c0de', verifier: 'v', redirectUri: 'http://127.0.0.1:1' });
  assert.equal(tokens.refresh_token, 'r');
  assert.equal(calls[0].url, 'https://oauth2.googleapis.com/token');
  const form = new URLSearchParams(calls[0].body);
  assert.deepEqual(Object.fromEntries(form), {
    code: 'c0de',
    client_id: 'cid',
    client_secret: 'sec',
    code_verifier: 'v',
    grant_type: 'authorization_code',
    redirect_uri: 'http://127.0.0.1:1',
  });
});

test('refreshAccessToken: refresh_token grant; a refused refresh says to sign in again', async () => {
  const ok = recorder(() => Response.json({ access_token: 'fresh', expires_in: 3599 }));
  assert.equal(await refreshAccessToken({ fetch: ok.fetch, client: { clientId: 'cid', clientSecret: 'sec' }, refreshToken: 'r' }), 'fresh');
  assert.equal(new URLSearchParams(ok.calls[0].body).get('grant_type'), 'refresh_token');
  const bad = recorder(() => Response.json({ error: 'invalid_grant' }, { status: 400 }));
  await assert.rejects(refreshAccessToken({ fetch: bad.fetch, client: { clientId: 'c', clientSecret: 's' }, refreshToken: 'old' }), /--auth/);
});

test('setThumbnail: the image bytes as media, typed by extension', async () => {
  const { fetch, calls } = recorder(() => Response.json({ items: [{ default: {} }] }));
  await setThumbnail({ fetch, token: 'tok', videoId: 'vid123', bytes: Buffer.from([1, 2, 3]), file: 'poster.jpg' });
  assert.equal(calls[0].url, 'https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=vid123&uploadType=media');
  assert.equal(calls[0].headers['Content-Type'], 'image/jpeg');
  await setThumbnail({ fetch, token: 'tok', videoId: 'vid123', bytes: Buffer.from([1]), file: 'poster.png' });
  assert.equal(calls[1].headers['Content-Type'], 'image/png');
});

test('addToPlaylist: a playlistItems.insert of the new video', async () => {
  const { fetch, calls } = recorder(() => Response.json({ id: 'item1' }));
  await addToPlaylist({ fetch, token: 'tok', playlistId: 'PL2', videoId: 'vid123' });
  assert.equal(calls[0].url, 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet');
  assert.deepEqual(JSON.parse(calls[0].body), { snippet: { playlistId: 'PL2', resourceId: { kind: 'youtube#video', videoId: 'vid123' } } });
});

test('parseClientSecret: the «Desktop app» JSON from Google Cloud; a web client is refused', () => {
  const desktop = JSON.stringify({ installed: { client_id: 'cid.apps.googleusercontent.com', client_secret: 'GOCSPX-x', redirect_uris: ['http://localhost'] } });
  assert.deepEqual(parseClientSecret(desktop), { clientId: 'cid.apps.googleusercontent.com', clientSecret: 'GOCSPX-x' });
  assert.throws(() => parseClientSecret(JSON.stringify({ web: { client_id: 'c', client_secret: 's' } })), /Desktop app/);
  assert.throws(() => parseClientSecret('{'), /not valid JSON/);
});

async function loopback() {
  const server = http.createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, redirectUri: `http://127.0.0.1:${server.address().port}` };
}

test('waitForCode: resolves with the code of the redirect that carries our state', async () => {
  const { server, redirectUri } = await loopback();
  try {
    const pending = waitForCode(server, redirectUri, 'st4te', 5000);
    const page = await fetch(`${redirectUri}/?state=st4te&code=4/abc`);
    assert.match(await page.text(), /cerrar esta pestaña/);
    assert.equal(await pending, '4/abc');
  } finally {
    server.close();
  }
});

test('waitForCode: another state or a refused consent rejects', async () => {
  const a = await loopback();
  try {
    const rejected = assert.rejects(waitForCode(a.server, a.redirectUri, 'mine', 5000), /another state/);
    await fetch(`${a.redirectUri}/?state=theirs&code=x`);
    await rejected;
  } finally {
    a.server.close();
  }
  const b = await loopback();
  try {
    const rejected = assert.rejects(waitForCode(b.server, b.redirectUri, 'mine', 5000), /access_denied/);
    await fetch(`${b.redirectUri}/?state=mine&error=access_denied`);
    await rejected;
  } finally {
    b.server.close();
  }
});

test('assertChannel: only the Alertópolis channel, never the personal one', () => {
  const alertopolis = { items: [{ id: ALERTOPOLIS_CHANNEL_ID, snippet: { title: 'Alertópolis' } }] };
  assert.equal(assertChannel(alertopolis).snippet.title, 'Alertópolis');
  const personal = { items: [{ id: 'UCSvs6rv_1y6x0byAiaclNjA', snippet: { title: 'Lidia López Sanz' } }] };
  assert.throws(() => assertChannel(personal), /«Lidia López Sanz».*not Alertópolis/s);
  assert.throws(() => assertChannel({ items: [] }), /no channel/);
});
