import { random } from 'remotion';

/**
 * Geometry of the channel banner (2560×1440, YouTube's recommended size).
 *
 * YouTube crops the same image per device: TVs show all of it, desktops a
 * 2560×423 band through the middle, phones only the 1546×423 centre. So the
 * brand and the beacon live inside SAFE; the rest of the city is a bonus for
 * wider screens.
 */
export const BANNER = { width: 2560, height: 1440 } as const;

export const SAFE = {
  left: (BANNER.width - 1546) / 2,
  right: (BANNER.width + 1546) / 2,
  top: Math.ceil((BANNER.height - 423) / 2),
  bottom: Math.floor((BANNER.height + 423) / 2),
} as const;

/** Street level: inside the band, so every device sees where the city stands. */
export const GROUND_Y = 904;

/** The text block (wordmark, tagline, chips) — only low rooftops and no stars behind it. */
export const TEXT_BOX = { left: SAFE.left + 56, right: 1580, top: 560, bottom: 830 } as const;

/** The tower that carries the alert beacon: inside SAFE, so phones see it too. */
export const BEACON_TOWER = { x: 1838, width: 118, top: 648 } as const;
export const BEACON = { x: BEACON_TOWER.x + BEACON_TOWER.width / 2, y: 584 } as const;

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

const WIN_W = 10;
const WIN_H = 13;
const WIN_GAP_X = 9;
const WIN_GAP_Y = 13;
const WIN_MARGIN = 13;

/** Every window is a log event: most are routine (dim), some are data (cyan), a few are warnings (amber). */
function windowsFor(b: Omit<Building, 'windows'>, seed: string): Win[] {
  const out: Win[] = [];
  const cols = Math.floor((b.width - 2 * WIN_MARGIN + WIN_GAP_X) / (WIN_W + WIN_GAP_X));
  if (cols < 1) return out;
  const used = cols * (WIN_W + WIN_GAP_X) - WIN_GAP_X;
  const x0 = b.x + (b.width - used) / 2;
  for (let y = b.top + WIN_MARGIN + 4; y + WIN_H <= GROUND_Y - 10; y += WIN_H + WIN_GAP_Y) {
    for (let c = 0; c < cols; c++) {
      const r = random(`${seed}-w-${c}-${Math.round(y)}`);
      const lit = b.layer === 1 ? r : r * 1.6;
      const tone: WindowTone = lit < 0.018 ? 'warn' : lit < 0.2 ? 'data' : lit < 0.72 ? 'dim' : 'off';
      out.push({ x: x0 + c * (WIN_W + WIN_GAP_X), y, tone });
    }
  }
  return out;
}

/** Height (in px above the ground) a building at `x` may reach in each zone of the banner. */
function heightRange(x: number, layer: 0 | 1): [number, number] {
  // Under the text: a low floor of rooftops that never reaches the chips.
  if (x > TEXT_BOX.left - 70 && x < TEXT_BOX.right) return layer === 1 ? [16, 40] : [26, 52];
  // Right of the text, inside SAFE: the city rises towards the beacon tower.
  if (x >= TEXT_BOX.right && x < SAFE.right) return layer === 1 ? [110, 230] : [150, 260];
  // Desktop / TV only: a skyline that may run off the top of the desktop band.
  if (x < TEXT_BOX.left) return layer === 1 ? [90, 300] : [170, 420];
  return layer === 1 ? [120, 360] : [180, 480];
}

function makeBuilding(x: number, width: number, top: number, layer: 0 | 1, seed: string): Building {
  const b = { x, width, top, layer };
  return { ...b, windows: windowsFor(b, seed) };
}

function buildRow(layer: 0 | 1): Building[] {
  const out: Building[] = [];
  let x = -40 + layer * 17;
  for (let i = 0; x < BANNER.width + 40; i++) {
    const seed = `sky-${layer}-${i}`;
    const width = Math.round(58 + random(`${seed}-w`) * (layer === 1 ? 92 : 110));
    const [lo, hi] = heightRange(x + width / 2, layer);
    const h = Math.round(lo + Math.pow(random(`${seed}-h`), 1.25) * (hi - lo));
    out.push(makeBuilding(x, width, GROUND_Y - h, layer, seed));
    x += width + (layer === 1 ? 14 : 22) + Math.round(random(`${seed}-gap`) * 10);
  }
  return out;
}

/** Clears a slot in the front row (trimming the neighbours) and stands the beacon tower in it. */
function withBeaconTower(row: Building[]): Building[] {
  const lo = BEACON_TOWER.x - 14;
  const hi = BEACON_TOWER.x + BEACON_TOWER.width + 14;
  const out: Building[] = [];
  row.forEach((b, i) => {
    if (b.x + b.width <= lo || b.x >= hi) {
      out.push(b);
      return;
    }
    if (b.x < lo && lo - b.x >= 34) out.push(makeBuilding(b.x, lo - b.x, b.top, b.layer, `trim-l-${i}`));
    if (b.x + b.width > hi && b.x + b.width - hi >= 34) out.push(makeBuilding(hi, b.x + b.width - hi, b.top, b.layer, `trim-r-${i}`));
  });
  out.push(makeBuilding(BEACON_TOWER.x, BEACON_TOWER.width, BEACON_TOWER.top, 1, 'beacon'));
  return out.sort((a, b) => a.x - b.x);
}

export const BACK_ROW = buildRow(0);
export const FRONT_ROW = withBeaconTower(buildRow(1));

export interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
}

/** Faint stars above the skyline, kept away from the text block. */
export const STARS: Star[] = Array.from({ length: 150 }, (_, i) => ({
  x: random(`star-x-${i}`) * BANNER.width,
  y: 40 + random(`star-y-${i}`) * (GROUND_Y - 340),
  r: 1.2 + random(`star-r-${i}`) * 1.8,
  o: 0.15 + random(`star-o-${i}`) * 0.35,
})).filter((s) => !(s.x > TEXT_BOX.left - 40 && s.x < TEXT_BOX.right + 40 && s.y > TEXT_BOX.top - 60 && s.y < GROUND_Y));
