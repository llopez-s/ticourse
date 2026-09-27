import { describe, expect, it, vi } from 'vitest';

// zustand's persist middleware only attaches `.persist` to the store when it
// can resolve a `window.localStorage` at creation time; under vitest's plain
// `environment: 'node'` (no DOM globals) it silently no-ops instead, which
// would make the storage-key assertion below throw on `undefined.getOptions`
// rather than fail meaningfully. Stub a minimal in-memory `window.localStorage`
// before the store modules are imported so persist wires up as it does in the
// browser. Runs empty (no saved data), so hydration is a no-op either way.
vi.hoisted(() => {
  const mem = new Map<string, string>();
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    },
  };
});

import { APP_NAME, APP_TAGLINE, APP_WORDMARK, SITE_URL, WORDMARK_PARTS } from './brand';
import { TRACKS, TRACK_IDS } from '../data/tracks';
import { useStore } from './store';
import { useSyncStore } from './syncStore';

type Fs = {
  readFileSync(path: URL, encoding: 'utf8'): string;
  readFileSync(path: URL): Uint8Array;
};
const loadFs = async (): Promise<Fs> => import(/* @vite-ignore */ ['node', 'fs'].join(':'));

/** Width × height from a PNG's IHDR chunk (big-endian, bytes 16–23). */
function pngSize(bytes: Uint8Array): [number, number] {
  const be = (o: number) => ((bytes[o] << 24) | (bytes[o + 1] << 16) | (bytes[o + 2] << 8) | bytes[o + 3]) >>> 0;
  return [be(16), be(20)];
}

describe('brand', () => {
  it('is Alertópolis, with an upper-case wordmark', () => {
    expect(APP_NAME).toBe('Alertópolis');
    expect(APP_WORDMARK).toBe(APP_NAME.toUpperCase());
  });

  it('splits the wordmark in two tones, like the channel banner', () => {
    expect(WORDMARK_PARTS).toEqual(['ALERT', 'ÓPOLIS']);
    expect(WORDMARK_PARTS.join('')).toBe(APP_WORDMARK);
  });

  it('carries the channel tagline', () => {
    expect(APP_TAGLINE).toBe('Ciberseguridad en español, con chispa');
  });

  it('no track borrows the app diamond as its own icon', () => {
    for (const id of TRACK_IDS) expect(TRACKS[id].icon).not.toBe('◆');
  });

  it('index.html ships the icons and a link preview under the Pages URL', async () => {
    const fs = await loadFs();
    const html = fs.readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
    expect(SITE_URL).toBe('https://llopez-s.github.io/ticourse/');
    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
    expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />');
    expect(html).toContain('<meta name="theme-color" content="#070b14" />');
    expect(html).toContain(`<meta property="og:title" content="${APP_NAME} — ${APP_TAGLINE}" />`);
    expect(html).toContain(`<meta property="og:url" content="${SITE_URL}" />`);
    // Link previews need an absolute URL; the Vite base path does not reach meta tags.
    expect(html).toContain(`<meta property="og:image" content="${SITE_URL}og-image.png" />`);
    // Keep both disclaimers wherever the site describes itself.
    expect(html).toMatch(/og:description" content="[^"]*no afiliado a CompTIA ni a SANS\/GIAC/);
  });

  it('the icon files exist at the sizes index.html promises', async () => {
    const fs = await loadFs();
    const pub = (f: string) => new URL(`../../public/${f}`, import.meta.url);
    expect(fs.readFileSync(pub('favicon.svg'), 'utf8')).toContain('<svg');
    expect(pngSize(fs.readFileSync(pub('apple-touch-icon.png')))).toEqual([180, 180]);
    expect(pngSize(fs.readFileSync(pub('og-image.png')))).toEqual([1200, 630]);
  });

  it('the page title and the video engine use the same name', async () => {
    const fs = await loadFs();
    expect(fs.readFileSync(new URL('../../index.html', import.meta.url), 'utf8')).toContain(`<title>${APP_NAME} — `);
    expect(fs.readFileSync(new URL('../../video/engine/scripts/lib/profiles.mjs', import.meta.url), 'utf8')).toContain(`APP_NAME = '${APP_NAME}'`);
  });

  it('saved progress keeps its storage keys (renaming them would wipe it)', () => {
    expect(useStore.persist.getOptions().name).toBe('intelforge-v1');
    expect(useSyncStore.persist.getOptions().name).toBe('intelforge-sync');
  });
});
