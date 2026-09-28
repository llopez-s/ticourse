/**
 * Geometry of the Dashboard's city strip: the channel banner's skyline
 * (video/channel/src/skyline.ts) redrawn at a strip's scale.
 *
 * Every window is a log event — most are routine (dim), some are data (cyan),
 * a few are warnings (amber) — and the rose beacon on the tallest tower is the
 * alert that matters. Same meanings as in the videos.
 *
 * The SVG uses preserveAspectRatio="xMaxYMax slice": the street and the right
 * edge always show and narrow screens lose the left. So the beacon tower stands
 * near the right edge, and everything left of RISE_FROM stays low enough for
 * the greeting to sit above it on wide screens.
 */
export const VIEW = { width: 1200, height: 150 } as const;

/** Street level, a few units above the bottom edge. */
export const GROUND_Y = 146;

/** Left of this x only low rooftops. */
export const RISE_FROM = 960;
/** Tallest a building may be (above the street) left of RISE_FROM. */
export const LOW_MAX = 34;

/** The tower that carries the alert beacon: the tallest thing in the city. */
export const BEACON_TOWER = { x: 1064, width: 44, top: 30 } as const;
export const BEACON = { x: BEACON_TOWER.x + BEACON_TOWER.width / 2, y: 16 } as const;

/** Window size in view units. */
export const WIN = { w: 4, h: 5 } as const;

export type WindowTone = 'off' | 'dim' | 'data' | 'warn';

export interface Win {
  x: number;
  y: number;
  tone: WindowTone;
}

export interface Building {
  x: number;
  width: number;
  top: number;
  /** 0 = back row (lighter, sparse windows), 1 = front row. */
  layer: 0 | 1;
  windows: Win[];
}

export interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
}

/** A number in [0, 1) that depends only on `seed` (FNV-1a hash, then one mulberry32 step). */
export function seededRandom(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let t = (h + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const WIN_GAP_X = 4;
const WIN_GAP_Y = 5;
const WIN_MARGIN = 6;

function windowsFor(b: Omit<Building, 'windows'>, seed: string): Win[] {
  const out: Win[] = [];
  const cols = Math.floor((b.width - 2 * WIN_MARGIN + WIN_GAP_X) / (WIN.w + WIN_GAP_X));
  if (cols < 1) return out;
  const used = cols * (WIN.w + WIN_GAP_X) - WIN_GAP_X;
  const x0 = b.x + (b.width - used) / 2;
  for (let y = b.top + WIN_MARGIN; y + WIN.h <= GROUND_Y - 4; y += WIN.h + WIN_GAP_Y) {
    for (let c = 0; c < cols; c++) {
      const r = seededRandom(`${seed}-w-${c}-${y}`);
      const lit = b.layer === 1 ? r : r * 1.6;
      const tone: WindowTone = lit < 0.03 ? 'warn' : lit < 0.2 ? 'data' : lit < 0.72 ? 'dim' : 'off';
      out.push({ x: x0 + c * (WIN.w + WIN_GAP_X), y, tone });
    }
  }
  return out;
}

/** Height range (above the street) for a building centred at `x`. */
function heightRange(x: number, layer: 0 | 1): [number, number] {
  if (x < RISE_FROM) return layer === 1 ? [8, 26] : [14, LOW_MAX];
  return layer === 1 ? [48, 96] : [60, 108];
}

function makeBuilding(x: number, width: number, top: number, layer: 0 | 1, seed: string): Building {
  const b = { x, width, top, layer };
  return { ...b, windows: windowsFor(b, seed) };
}

function buildRow(layer: 0 | 1): Building[] {
  const out: Building[] = [];
  let x = -20 + layer * 9;
  for (let i = 0; x < VIEW.width + 20; i++) {
    const seed = `sky-${layer}-${i}`;
    const width = Math.round(26 + seededRandom(`${seed}-w`) * (layer === 1 ? 38 : 46));
    const [lo, hi] = heightRange(x + width / 2, layer);
    const h = Math.round(lo + Math.pow(seededRandom(`${seed}-h`), 1.25) * (hi - lo));
    out.push(makeBuilding(x, width, GROUND_Y - h, layer, seed));
    x += width + (layer === 1 ? 6 : 10) + Math.round(seededRandom(`${seed}-gap`) * 4);
  }
  return out;
}

/** Clears a slot in the front row (trimming the neighbours) and stands the beacon tower in it. */
function withBeaconTower(row: Building[]): Building[] {
  const lo = BEACON_TOWER.x - 6;
  const hi = BEACON_TOWER.x + BEACON_TOWER.width + 6;
  const out: Building[] = [];
  row.forEach((b, i) => {
    if (b.x + b.width <= lo || b.x >= hi) {
      out.push(b);
      return;
    }
    if (b.x < lo && lo - b.x >= 16) out.push(makeBuilding(b.x, lo - b.x, b.top, b.layer, `trim-l-${i}`));
    if (b.x + b.width > hi && b.x + b.width - hi >= 16) {
      out.push(makeBuilding(hi, b.x + b.width - hi, b.top, b.layer, `trim-r-${i}`));
    }
  });
  out.push(makeBuilding(BEACON_TOWER.x, BEACON_TOWER.width, BEACON_TOWER.top, 1, 'beacon'));
  return out.sort((a, b) => a.x - b.x);
}

/** Faint stars in open sky: right of the greeting, above every rooftop, clear of the beacon's glow. */
function starsFor(buildings: Building[]): Star[] {
  const out: Star[] = [];
  for (let i = 0; i < 40; i++) {
    const x = 560 + seededRandom(`star-x-${i}`) * 635;
    const y = 4 + seededRandom(`star-y-${i}`) * 66;
    const underRoof = buildings.some((b) => x >= b.x - 2 && x <= b.x + b.width + 2 && y >= b.top - 4);
    if (underRoof || Math.hypot(x - BEACON.x, y - BEACON.y) <= 30) continue;
    out.push({ x, y, r: 0.6 + seededRandom(`star-r-${i}`) * 0.6, o: 0.15 + seededRandom(`star-o-${i}`) * 0.35 });
  }
  return out;
}

export function buildSkyline(): { back: Building[]; front: Building[]; stars: Star[] } {
  const back = buildRow(0);
  const front = withBeaconTower(buildRow(1));
  return { back, front, stars: starsFor([...back, ...front]) };
}

const CITY = buildSkyline();
export const BACK_ROW = CITY.back;
export const FRONT_ROW = CITY.front;
export const STARS = CITY.stars;
