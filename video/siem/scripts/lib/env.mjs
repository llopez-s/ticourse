// Minimal .env loader (no dependency). Reads KEY=value lines from the repo's
// and the video's .env / .env.local files into process.env without overriding
// variables that are already set. Values are never logged.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, SIEM_DIR } from './paths.mjs';

const FILES = [
  path.join(SIEM_DIR, '.env.local'),
  path.join(SIEM_DIR, '.env'),
  path.join(REPO_ROOT, '.env.local'),
  path.join(REPO_ROOT, '.env'),
];

export function parseEnv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[m[1]] = value;
  }
  return out;
}

let loaded = false;

export function loadEnv() {
  if (loaded) return;
  loaded = true;
  for (const file of FILES) {
    if (!existsSync(file)) continue;
    for (const [key, value] of Object.entries(parseEnv(readFileSync(file, 'utf8')))) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

/** Returns a required secret, failing with a hint that never includes the value. */
export function requireEnv(name) {
  loadEnv();
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set: add it to .env.local at the repo root (git-ignored) or to your environment`);
  }
  return value;
}
