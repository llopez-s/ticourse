#!/usr/bin/env node
// Uploads a rendered lesson video to the Alertópolis channel with the YouTube Data API v3: the MP4 (resumable),
// the poster as thumbnail, the Spanish captions and the track's playlist, with the same title, description and
// tags youtube-meta.mjs writes to out/youtube.md. Private unless --privacy says otherwise.
//
//   node video/engine/scripts/youtube-upload.mjs --auth                      # once: sign in, pick Alertópolis
//   node video/engine/scripts/youtube-upload.mjs --video <slug> --dry-run    # what it would send, no network
//   node video/engine/scripts/youtube-upload.mjs --video <slug> [--privacy private|unlisted|public]
//
// Credentials live in video/engine/youtube/ (git-ignored; $YOUTUBE_CREDENTIALS_DIR overrides it, e.g. from a
// worktree): client_secret.json, the «Desktop app» OAuth client downloaded from Google Cloud, and token.json, the
// refresh token --auth stores. Progress goes to video/<slug>/out/youtube-upload.json: a rerun finishes the
// missing steps and never uploads the same video twice. Videos uploaded from an unaudited API project stay
// private until YouTube audits the project (videos.insert reference).
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readFileSync, readSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { PATHS, REPO_ROOT, isMainModule } from './lib/paths.mjs';
import { writeFileAtomic } from './lib/remotion.mjs';
import {
  assertChannel,
  authUrl,
  exchangeCode,
  myChannel,
  parseClientSecret,
  pkceChallenge,
  pkceVerifier,
  refreshAccessToken,
  videoResource,
  waitForCode,
} from './lib/youtube-api.mjs';
import { runUpload } from './lib/youtube-upload.mjs';
import { buildYoutubeMeta } from './youtube-meta.mjs';

const CREDENTIALS_DIR = process.env.YOUTUBE_CREDENTIALS_DIR || path.join(REPO_ROOT, 'video', 'engine', 'youtube');
const CLIENT_FILE = path.join(CREDENTIALS_DIR, 'client_secret.json');
const TOKEN_FILE = path.join(CREDENTIALS_DIR, 'token.json');
const AUTH_TIMEOUT_MS = 5 * 60 * 1000;

function readClient() {
  if (!existsSync(CLIENT_FILE)) {
    throw new Error(`no ${CLIENT_FILE}: create a «Desktop app» OAuth client in Google Cloud (YouTube Data API v3 enabled) and save its JSON there`);
  }
  return parseClientSecret(readFileSync(CLIENT_FILE, 'utf8'));
}

/** Best effort: opens the consent page in the default browser (the URL is printed anyway). */
function openBrowser(url) {
  try {
    const child =
      process.platform === 'win32'
        ? spawn('rundll32', ['url.dll,FileProtocolHandler', url], { detached: true, stdio: 'ignore' })
        : spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], { detached: true, stdio: 'ignore' });
    child.on('error', () => {});
    child.unref();
  } catch {
    // the printed URL is enough
  }
}

async function authenticate() {
  const client = readClient();
  const server = http.createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const redirectUri = `http://127.0.0.1:${server.address().port}`;
  const verifier = pkceVerifier();
  const state = randomBytes(16).toString('hex');
  const url = authUrl({ clientId: client.clientId, redirectUri, challenge: pkceChallenge(verifier), state });
  console.log('Abre esta dirección, entra con tu cuenta y, cuando lo pida, elige el canal «Alertópolis»:\n');
  console.log(`  ${url}\n`);
  openBrowser(url);
  let code;
  try {
    code = await waitForCode(server, redirectUri, state, AUTH_TIMEOUT_MS);
  } finally {
    server.closeAllConnections(); // the browser keeps its connection alive
    server.close();
  }
  const tokens = await exchangeCode({ fetch, client, code, verifier, redirectUri });
  if (!tokens.refresh_token) throw new Error('Google returned no refresh token: run --auth again');
  const channel = assertChannel(await myChannel({ fetch, token: tokens.access_token }));
  mkdirSync(CREDENTIALS_DIR, { recursive: true });
  writeFileSync(
    TOKEN_FILE,
    `${JSON.stringify({ refresh_token: tokens.refresh_token, channelId: channel.id, channelTitle: channel.snippet.title, obtainedAt: new Date().toISOString() }, null, 2)}\n`,
    { mode: 0o600 },
  );
  console.log(`Autorizado en «${channel.snippet.title}». Token guardado en ${TOKEN_FILE}`);
}

function readState(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
}

async function upload({ privacy, dryRun }) {
  const meta = buildYoutubeMeta();
  const { video, captions, poster } = meta.files;
  const stateFile = path.join(PATHS.outDir, 'youtube-upload.json');
  const state = readState(stateFile);
  const resource = videoResource({ title: meta.title, description: meta.description, tags: meta.tags, privacy });

  if (dryRun) {
    const pending = ['videos.insert', 'thumbnails.set', 'captions.insert', 'playlistItems.insert'].filter(
      (_, k) => ![state.videoId, state.thumbnail, state.captions, state.playlist][k],
    );
    const files = { video: existsSync(video) ? video : `${video} (todavía no renderizado)`, captions, poster };
    console.log(JSON.stringify({ resource, files, state, pending }, null, 2));
    return;
  }
  if (!existsSync(video)) throw new Error(`no video at ${video}: run render.mjs --master first`);

  const client = readClient();
  if (!existsSync(TOKEN_FILE)) throw new Error(`not signed in: run node video/engine/scripts/youtube-upload.mjs --auth`);
  const token = await refreshAccessToken({ fetch, client, refreshToken: JSON.parse(readFileSync(TOKEN_FILE, 'utf8')).refresh_token });

  const fd = openSync(video, 'r');
  try {
    const size = fstatSync(fd).size;
    const readChunk = (start, end) => {
      const buf = Buffer.alloc(end - start + 1);
      readSync(fd, buf, 0, buf.length, start);
      return buf;
    };
    const final = await runUpload({
      fetch,
      token,
      meta,
      files: { size, readChunk, poster: { bytes: readFileSync(poster), file: poster }, vtt: readFileSync(captions, 'utf8') },
      state,
      saveState: (s) => writeFileAtomic(stateFile, `${JSON.stringify(s, null, 2)}\n`),
      privacy,
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    });
    console.log(`\nhttps://youtu.be/${final.videoId}`);
    console.log(`Studio: https://studio.youtube.com/video/${final.videoId}/edit`);
    if (final.privacy !== 'public') console.log('Está en privado: revísalo en Studio y publícalo desde allí cuando quieras.');
  } finally {
    closeSync(fd);
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      video: { type: 'string' },
      auth: { type: 'boolean', default: false },
      privacy: { type: 'string', default: 'private' },
      'dry-run': { type: 'boolean', default: false },
    },
  });
  if (values.auth) return authenticate();
  if (!values.video) throw new Error('usage: youtube-upload.mjs --auth | --video <slug> [--privacy private|unlisted|public] [--dry-run]');
  return upload({ privacy: values.privacy, dryRun: values['dry-run'] });
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(`youtube-upload: ${error.message}`);
    process.exit(1);
  });
}
