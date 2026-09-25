import { useMemo } from 'react';
import { interpolateColors, random } from 'remotion';
import { C, FONT, STAGE, TYPE, alpha } from '../../../theme/tokens';
import { EASE, enter, fmtInt, lerp, progress, pulse } from '../../../theme/motion';
import { Chip, Panel, cubicLength, cubicPath, type Point } from '../../../ui';

/** 120 x 50 = exactly 6.000 alert dots (one of them is the needle). */
const COLS = 120;
const ROWS = 50;
export const TOTAL_ALERTS = COLS * ROWS;
const BATCHES = 24;

/* Stage-local geometry (the stage is 1728 x 660). */
const COLUMN_W = 450;
const PANEL = { x: 492, w: STAGE.width - 492, h: STAGE.height };
const HEADER = 64 + 2;
const FIELD = { x: PANEL.x + 2 + 30, y: HEADER + 26, w: PANEL.w - 4 - 60, h: PANEL.h - HEADER - 26 - 30 };
const SX = FIELD.w / COLS;
const SY = FIELD.h / ROWS;
const NEEDLE_CELL = { c: 42, r: 31 };

function cellCenter(c: number, r: number): Point {
  return { x: FIELD.x + (c + 0.5) * SX, y: FIELD.y + (r + 0.5) * SY };
}

const NEEDLE = cellCenter(NEEDLE_CELL.c, NEEDLE_CELL.r);
/** Where the rose leader line leaves the "1 importa" stat in the left column. */
const LEADER_FROM: Point = { x: 296, y: 470 };
const LEADER: [Point, Point, Point, Point] = [
  LEADER_FROM,
  { x: LEADER_FROM.x + 220, y: LEADER_FROM.y },
  { x: NEEDLE.x - 200, y: NEEDLE.y },
  { x: NEEDLE.x - 30, y: NEEDLE.y },
];
const LEADER_LENGTH = cubicLength(LEADER);

const TONES = [alpha(C.muted, 0.5), alpha(C.faint, 0.75), alpha(C.ink500, 0.95)];

const f1 = (n: number) => Math.round(n * 10) / 10;

/**
 * The 5.999 noise dots as BATCHES memoised SVG paths (each dot a two-arc
 * circle), randomly assigned so every batch is scattered over the whole field.
 */
function buildBatches(): string[] {
  const parts: string[][] = Array.from({ length: BATCHES }, () => []);
  for (let i = 0; i < TOTAL_ALERTS; i++) {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    if (c === NEEDLE_CELL.c && r === NEEDLE_CELL.r) continue;
    const base = cellCenter(c, r);
    const x = f1(base.x + (random(`s01-jx-${i}`) - 0.5) * 3.2);
    const y = f1(base.y + (random(`s01-jy-${i}`) - 0.5) * 3.2);
    const rad = f1(2.3 + random(`s01-r-${i}`) * 0.9);
    const batch = Math.min(BATCHES - 1, Math.floor(random(`s01-b-${i}`) * BATCHES));
    parts[batch].push(`M${f1(x - rad)} ${y}a${rad} ${rad} 0 1 0 ${f1(rad * 2)} 0a${rad} ${rad} 0 1 0 ${f1(-rad * 2)} 0`);
  }
  return parts.map((p) => p.join(''));
}

export interface FloodTimes {
  flood: number;
  needle: number;
  team: number;
  title: number;
  defSim: number;
}

/**
 * Chapter-opening SOC console: the alert queue fills with 6.000 grey dots
 * while the counter climbs; at `needle` one dot turns rose and pulses, the
 * rest dim, and a leader ties it to "1 importa". From `title` the whole
 * console recedes behind the SIEM definition and is gone by `defSim`.
 */
export function Flood({ frame, fps, t }: { frame: number; fps: number; t: FloodTimes }) {
  const batches = useMemo(buildBatches, []);

  const recede = lerp(frame, [t.title - 10, t.title + 8], [1, 0.07]);
  // Gone while the SIEM title parks at the top, before the SIM capsule arrives.
  const gone = lerp(frame, [t.defSim - 22, t.defSim - 4], [1, 0]);
  const opacity = recede * gone;
  if (opacity <= 0.001) return null;
  const scale = lerp(frame, [t.title - 4, t.title + 24], [1, 0.965]);

  // Trickle, then flood: the counter and the visible dots share one curve that lands on 6.000 as the word is spoken.
  const fill = Math.pow(progress(frame, 4, t.flood + 1 - 4, EASE.linear), 2.2);
  const shown = fill * BATCHES;
  const count = Math.round(fill * TOTAL_ALERTS);

  const needleOn = progress(frame, t.needle, 12);
  const dim = lerp(frame, [t.needle, t.needle + 16], [1, 0.3]);
  const beat = pulse(Math.max(0, frame - t.needle), fps, 0.8);
  const leaderDraw = progress(frame, t.needle + 6, 18, EASE.inOut);

  // Pre-rolled so the very first frame of the video already shows the console.
  const header = enter(frame, -6, { distance: 18, duration: 18 });
  const one = enter(frame, t.needle + 2, { distance: 22, axis: 'x' });
  const team = enter(frame, t.team, { distance: 22 });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
      }}
    >
      {/* Left column: where we are, how many, how many matter. */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: COLUMN_W, fontFamily: FONT.sans }}>
        <div style={{ ...header }}>
          <div style={{ fontSize: TYPE.small, fontWeight: 750, letterSpacing: 3, color: C.cyan }}>MADRUGADA · SOC</div>
          <div style={{ marginTop: 10, fontSize: 38, fontWeight: 750, lineHeight: 1.15, color: C.textStrong }}>
            Autoridad Portuaria
            <br />
            de Halden
          </div>
        </div>

        <div style={{ position: 'absolute', top: 190, left: 0, opacity: header.opacity }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 850,
              lineHeight: 1,
              letterSpacing: -2,
              fontVariantNumeric: 'tabular-nums',
              color: interpolateColors(needleOn, [0, 1], [C.textStrong, C.muted]),
              opacity: 1 - 0.45 * needleOn,
            }}
          >
            {fmtInt(count)}
          </div>
          <div style={{ marginTop: 8, fontSize: 40, fontWeight: 600, color: C.muted }}>alertas al día</div>
        </div>

        <div style={{ position: 'absolute', top: 400, left: 0, display: 'flex', alignItems: 'baseline', gap: 20, ...one }}>
          <div style={{ fontSize: 120, fontWeight: 850, lineHeight: 1, color: C.rose }}>1</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.roseSoft, lineHeight: 1.1 }}>
            solo una
            <br />
            importa
          </div>
        </div>

        <div style={{ position: 'absolute', top: 588, left: 0, display: 'flex', alignItems: 'center', gap: 16, ...team }}>
          <Chip accent="cyan" icon="shield" size={TYPE.label}>
            Blue Team
          </Chip>
          <span style={{ fontSize: TYPE.small, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>equipo defensivo</span>
        </div>
      </div>

      {/* The alert queue. */}
      <Panel
        title="Cola de alertas"
        icon="bell"
        accent="amber"
        style={{ position: 'absolute', left: PANEL.x, top: 0, width: PANEL.w, height: PANEL.h, opacity: header.opacity }}
      />

      <svg
        width={STAGE.width}
        height={STAGE.height}
        viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
        aria-hidden
      >
        <g opacity={dim}>
          {batches.map((d, b) => {
            const o = Math.max(0, Math.min(1, shown - b));
            return o > 0 ? <path key={b} d={d} fill={TONES[b % TONES.length]} opacity={o} /> : null;
          })}
        </g>

        {/* The needle: a grey dot like the others until it turns rose. */}
        <circle cx={NEEDLE.x} cy={NEEDLE.y} r={2.8} fill={TONES[0]} opacity={Math.min(1, shown) * (1 - needleOn)} />
        {needleOn > 0 ? (
          <g opacity={needleOn}>
            <circle cx={NEEDLE.x} cy={NEEDLE.y} r={34} fill={alpha(C.rose, 0.12)} />
            <circle
              cx={NEEDLE.x}
              cy={NEEDLE.y}
              r={20 + 18 * beat}
              fill="none"
              stroke={C.rose}
              strokeWidth={2.5}
              opacity={0.75 * (1 - beat)}
            />
            <circle cx={NEEDLE.x} cy={NEEDLE.y} r={20} fill="none" stroke={C.rose} strokeWidth={3.5} />
            <circle cx={NEEDLE.x} cy={NEEDLE.y} r={8} fill={C.rose} />
          </g>
        ) : null}

        {leaderDraw > 0 ? (
          <g>
            <path
              d={cubicPath(LEADER)}
              fill="none"
              stroke={alpha(C.rose, 0.85)}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${LEADER_LENGTH} ${LEADER_LENGTH}`}
              strokeDashoffset={LEADER_LENGTH * (1 - leaderDraw)}
            />
            <circle cx={LEADER_FROM.x} cy={LEADER_FROM.y} r={5} fill={C.rose} opacity={leaderDraw} />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
