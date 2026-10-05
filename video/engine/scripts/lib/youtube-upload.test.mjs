import assert from 'node:assert/strict';
import test from 'node:test';
import { ALERTOPOLIS_CHANNEL_ID } from './youtube-api.mjs';
import { runUpload } from './youtube-upload.mjs';

const meta = { title: 'Ataques en los logs | Security+ SY0-701 en español', description: 'Desc', tags: ['Security+'], track: 'secplus' };
const files = {
  size: 600 * 1024,
  readChunk: (start, end) => Buffer.alloc(end - start + 1, 1),
  poster: { bytes: Buffer.from([1, 2]), file: 'logs-halden-poster.jpg' },
  vtt: 'WEBVTT\n',
};

/** A YouTube in memory: the channel, the playlists, and a resumable upload that accepts everything at once. */
function fakeYoutube({ channelId = ALERTOPOLIS_CHANNEL_ID, channelTitle = 'Alertópolis', playlists = [{ id: 'PL2', snippet: { title: 'CompTIA Security+ SY0-701 en español' } }] } = {}) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    const u = new URL(String(url));
    calls.push(`${init.method ?? 'GET'} ${u.pathname}`);
    if (u.pathname === '/youtube/v3/channels') return Response.json({ items: [{ id: channelId, snippet: { title: channelTitle } }] });
    if (u.pathname === '/youtube/v3/playlists') return Response.json({ items: playlists });
    if (u.pathname === '/upload/youtube/v3/videos') return new Response(null, { status: 200, headers: { Location: 'https://upload.example/s/1' } });
    if (u.host === 'upload.example') return Response.json({ id: 'vid123' });
    if (u.pathname === '/upload/youtube/v3/thumbnails/set') return Response.json({});
    if (u.pathname === '/upload/youtube/v3/captions') return Response.json({ id: 'cap1' });
    if (u.pathname === '/youtube/v3/playlistItems') return Response.json({ id: 'item1' });
    throw new Error(`unexpected ${u}`);
  };
  return { fetch, calls };
}

const quiet = { log: () => {}, warn: () => {} };

test('runUpload: checks the channel, uploads, then thumbnail, captions and playlist, saving state as it goes', async () => {
  const yt = fakeYoutube();
  const saved = [];
  const state = await runUpload({ fetch: yt.fetch, token: 't', meta, files, state: {}, saveState: (s) => saved.push({ ...s }), privacy: 'private', sleep: async () => {}, ...quiet });
  assert.equal(state.videoId, 'vid123');
  assert.deepEqual({ thumbnail: state.thumbnail, captions: state.captions, playlist: state.playlist }, { thumbnail: true, captions: true, playlist: 'PL2' });
  assert.equal(yt.calls[0], 'GET /youtube/v3/channels', 'the channel is checked before anything else');
  assert.equal(saved[0].videoId, 'vid123', 'the id is saved right after the upload');
  assert.equal(saved.at(-1).playlist, 'PL2');
});

test('runUpload: a video already uploaded is never uploaded again; only the missing steps run', async () => {
  const yt = fakeYoutube();
  const state = await runUpload({
    fetch: yt.fetch,
    token: 't',
    meta,
    files,
    state: { videoId: 'vid999', thumbnail: true },
    saveState: () => {},
    privacy: 'private',
    sleep: async () => {},
    ...quiet,
  });
  assert.equal(state.videoId, 'vid999');
  assert.ok(!yt.calls.includes('POST /upload/youtube/v3/videos'), 'no second videos.insert');
  assert.ok(!yt.calls.includes('POST /upload/youtube/v3/thumbnails/set'), 'thumbnail already set');
  assert.ok(yt.calls.includes('POST /upload/youtube/v3/captions'));
});

test('runUpload: on the wrong channel nothing is uploaded', async () => {
  const yt = fakeYoutube({ channelId: 'UCSvs6rv_1y6x0byAiaclNjA', channelTitle: 'Lidia López Sanz' });
  await assert.rejects(
    runUpload({ fetch: yt.fetch, token: 't', meta, files, state: {}, saveState: () => {}, privacy: 'private', sleep: async () => {}, ...quiet }),
    /not Alertópolis/,
  );
  assert.deepEqual(yt.calls, ['GET /youtube/v3/channels']);
});

test('runUpload: without the track playlist it warns and leaves that step pending', async () => {
  const yt = fakeYoutube({ playlists: [] });
  const warnings = [];
  const state = await runUpload({
    fetch: yt.fetch,
    token: 't',
    meta,
    files,
    state: {},
    saveState: () => {},
    privacy: 'private',
    sleep: async () => {},
    log: () => {},
    warn: (m) => warnings.push(m),
  });
  assert.equal(state.playlist, undefined);
  assert.match(warnings.join('\n'), /CompTIA Security\+ SY0-701 en español/);
});
