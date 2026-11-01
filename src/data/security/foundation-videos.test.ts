import { describe, expect, it } from 'vitest';
import { ALL_MODULES } from '../course';
import { isYouTubeBlock, isYouTubeId } from '../../lib/youtube';
import { FOUNDATIONS } from './foundations';
import { FOUNDATION_VIDEOS } from './foundation-videos';

describe('fundamentals videos', () => {
  // Only the fs calls this test needs, typed locally so the suite does not depend on @types/node.
  type Fs = {
    existsSync(path: URL): boolean;
    readFileSync(path: URL, encoding: 'utf8'): string;
  };
  const loadFs = async (): Promise<Fs> => import(/* @vite-ignore */ ['node', 'fs'].join(':'));
  const publicFile = (path: string) => new URL(`../../../public/${path}`, import.meta.url);
  const entries = Object.entries(FOUNDATION_VIDEOS);

  it('sit in the lessons the fundamentals proposal puts them in', () => {
    // F1 closes the network block (f05–f08) in f08; F4 reads logs and timelines, the subject of f12
    expect(FOUNDATION_VIDEOS.f08?.youtube).toBe('MivW8FBd6Is');
    expect(FOUNDATION_VIDEOS.f12?.youtube).toBe('69BGahUytbg');
  });

  it('belong to a fundamentals lesson that exists', () => {
    const ids = new Set(FOUNDATIONS.map((f) => f.id));
    for (const [lesson] of entries) expect(ids.has(lesson), lesson).toBe(true);
  });

  it('have a valid YouTube id and their poster and transcript in public/', async () => {
    const fs = await loadFs();
    for (const [lesson, block] of entries) {
      expect(isYouTubeId(block.youtube), `${lesson}: ${block.youtube}`).toBe(true);
      for (const [path, ext] of [[block.poster, /\.(png|jpe?g|webp)$/], [block.transcript, /\.txt$/]] as const) {
        expect(path, lesson).toMatch(ext);
        expect(path.startsWith('/') || path.includes('..'), lesson).toBe(false);
        expect(fs.existsSync(publicFile(path)), `${lesson}: ${path}`).toBe(true);
      }
      expect(fs.readFileSync(publicFile(block.transcript), 'utf8').length, block.transcript).toBeGreaterThan(200);
    }
  });

  it('share no id or asset with each other or with the lessons of the two tracks', () => {
    const track = ALL_MODULES.flatMap((m) => m.blocks.flatMap((b) => (b.t === 'video' && isYouTubeBlock(b) ? [b] : [])));
    const all = [...entries.map(([, b]) => b), ...track];
    for (const key of ['youtube', 'poster', 'transcript'] as const) {
      const values = all.map((b) => b[key]);
      expect(new Set(values).size, key).toBe(values.length);
    }
  });
});
