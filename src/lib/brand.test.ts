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

import { APP_NAME, APP_WORDMARK } from './brand';
import { useStore } from './store';
import { useSyncStore } from './syncStore';

type Fs = { readFileSync(path: URL, encoding: 'utf8'): string };
const loadFs = async (): Promise<Fs> => import(/* @vite-ignore */ ['node', 'fs'].join(':'));

describe('brand', () => {
  it('is Alertópolis, with an upper-case wordmark', () => {
    expect(APP_NAME).toBe('Alertópolis');
    expect(APP_WORDMARK).toBe(APP_NAME.toUpperCase());
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
