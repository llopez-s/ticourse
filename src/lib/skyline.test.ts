import { describe, expect, it } from 'vitest';
import {
  BACK_ROW,
  BEACON,
  BEACON_TOWER,
  FRONT_ROW,
  GROUND_Y,
  LOW_MAX,
  RISE_FROM,
  STARS,
  VIEW,
  WIN,
  buildSkyline,
  seededRandom,
  type Building,
} from './skyline';

const height = (b: Building) => GROUND_Y - b.top;
const centre = (b: Building) => b.x + b.width / 2;
const all = [...BACK_ROW, ...FRONT_ROW];

describe('seededRandom', () => {
  it('is deterministic and stays in [0, 1)', () => {
    for (const seed of ['a', 'sky-0-3-w', 'beacon', '']) {
      const r = seededRandom(seed);
      expect(r).toBe(seededRandom(seed));
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
    }
    expect(seededRandom('a')).not.toBe(seededRandom('b'));
  });
});

describe('skyline', () => {
  it('draws the same city on every render', () => {
    expect(buildSkyline()).toEqual({ back: BACK_ROW, front: FRONT_ROW, stars: STARS });
  });

  it('covers the whole strip, left to right', () => {
    for (const row of [BACK_ROW, FRONT_ROW]) {
      expect(row[0].x).toBeLessThanOrEqual(0);
      expect(Math.max(...row.map((b) => b.x + b.width))).toBeGreaterThanOrEqual(VIEW.width);
    }
  });

  it('keeps the front row sorted and free of overlaps', () => {
    for (let i = 1; i < FRONT_ROW.length; i++) {
      expect(FRONT_ROW[i].x).toBeGreaterThanOrEqual(FRONT_ROW[i - 1].x + FRONT_ROW[i - 1].width);
    }
  });

  it('stays low left of RISE_FROM, where the greeting sits on wide screens', () => {
    for (const b of all.filter((b) => centre(b) < RISE_FROM)) {
      expect(height(b)).toBeLessThanOrEqual(LOW_MAX);
    }
  });

  it('stands the beacon tower in the front row, taller than everything else', () => {
    const tower = FRONT_ROW.find((b) => b.x === BEACON_TOWER.x && b.width === BEACON_TOWER.width);
    expect(tower?.top).toBe(BEACON_TOWER.top);
    for (const b of all.filter((b) => b !== tower)) expect(b.top).toBeGreaterThan(BEACON_TOWER.top);
    expect(BEACON.x).toBe(BEACON_TOWER.x + BEACON_TOWER.width / 2);
    expect(BEACON.y).toBeLessThan(BEACON_TOWER.top);
    expect(BEACON.y).toBeGreaterThan(0);
  });

  it('puts every window inside its building and above the street', () => {
    for (const b of all) {
      for (const w of b.windows) {
        expect(w.x).toBeGreaterThanOrEqual(b.x);
        expect(w.x + WIN.w).toBeLessThanOrEqual(b.x + b.width);
        expect(w.y).toBeGreaterThanOrEqual(b.top);
        expect(w.y + WIN.h).toBeLessThan(GROUND_Y);
      }
    }
  });

  it('lights windows in the three event tones: routine, data and a few warnings', () => {
    const tones = all.flatMap((b) => b.windows.map((w) => w.tone));
    const count = (t: string) => tones.filter((x) => x === t).length;
    expect(count('dim')).toBeGreaterThan(count('data'));
    expect(count('data')).toBeGreaterThan(count('warn'));
    expect(count('warn')).toBeGreaterThan(0);
  });

  it('keeps the stars in open sky, clear of rooftops and the beacon', () => {
    expect(STARS.length).toBeGreaterThan(0);
    for (const s of STARS) {
      for (const b of all) {
        const over = s.x >= b.x - 2 && s.x <= b.x + b.width + 2;
        if (over) expect(s.y).toBeLessThan(b.top - 4);
      }
      expect(Math.hypot(s.x - BEACON.x, s.y - BEACON.y)).toBeGreaterThan(30);
    }
  });
});
