import { FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { G, INK, clamp01 } from './geom';

function Reel({ cx, cy, r, spin, tone }: { cx: number; cy: number; r: number; spin: number; tone: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={alpha('#000000', 0.55)} stroke={alpha(tone, 0.55)} strokeWidth={2} />
      <g transform={`rotate(${spin} ${cx} ${cy})`} stroke={tone} strokeWidth={3} strokeLinecap="round">
        <circle cx={cx} cy={cy} r={6.5} fill={INK.dark} />
        {[0, 60, 120].map((a) => (
          <line key={a} x1={cx - 6.5 * Math.cos((a * Math.PI) / 180)} y1={cy - 6.5 * Math.sin((a * Math.PI) / 180)} x2={cx + 6.5 * Math.cos((a * Math.PI) / 180)} y2={cy + 6.5 * Math.sin((a * Math.PI) / 180)} />
        ))}
      </g>
    </g>
  );
}

/**
 * Yesterday's tape: a cassette centred on (x, y), `w` wide (0.64 × w tall). The only thing in the
 * video that means DISCOVER.
 * - `on` 0–1 lights it cyan; `spin` turns the reels (degrees; negative = rewinding);
 * - `wound` 0–1: how much tape is back on the left reel; `rewind` 0–1 shows the two rewind chevrons;
 * - `label` 0–1 writes «ayer» on its sticker (a blank sticker at 0).
 */
export function Cassette({ x, y, w, on = 1, spin = 0, wound = 0.3, rewind = 0, label = 1, opacity = 1 }: { x: number; y: number; w: number; on?: number; spin?: number; wound?: number; rewind?: number; label?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const s = w / 160;
  const k = clamp01(on);
  const edge = k > 0.5 ? INK.cyan : INK.line;
  const wd = clamp01(wound);
  const rw = clamp01(rewind);
  return (
    <g transform={`translate(${x - w / 2} ${y - 0.32 * w}) scale(${s})`} opacity={opacity}>
      <rect x={2} y={2} width={156} height={98} rx={10} fill={k > 0.5 ? '#0b2532' : INK.wallHi} stroke={edge} strokeWidth={4} />
      {/* sticker */}
      <rect x={16} y={11} width={128} height={26} rx={4} fill={alpha('#e2e8f0', k > 0.5 ? 0.92 : 0.55)} />
      {label > 0.01 ? (
        <text x={80} y={31} textAnchor="middle" fontFamily={FONT.mono} fontSize={21} fontWeight={800} fill="#0f172a" opacity={clamp01(label)}>
          ayer
        </text>
      ) : null}
      {/* window with the two reels */}
      <rect x={26} y={44} width={108} height={36} rx={8} fill={INK.glass} stroke={alpha(edge, 0.8)} strokeWidth={2.5} />
      <Reel cx={50} cy={62} r={8 + 8 * wd} spin={spin} tone={edge} />
      <Reel cx={110} cy={62} r={8 + 8 * (1 - wd)} spin={spin} tone={edge} />
      <path d="M62 54 H98" stroke={alpha(edge, 0.6)} strokeWidth={2.5} />
      {/* rewind chevrons (drawn, not text) */}
      {rw > 0.01 ? (
        <g fill={INK.cyan} opacity={rw}>
          <path d="M79 54 L67 62 L79 70 Z M93 54 L81 62 L93 70 Z" />
        </g>
      ) : null}
      <path d="M40 100 L48 86 H112 L120 100" fill="none" stroke={alpha(edge, 0.7)} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
}

/**
 * The recorder inside the shop, with yesterday's tape in it and its «ayer» tag. `on` 0–1 lights it
 * cyan; `rewind` 0–1, `spin`, `wound` go to the cassette; `label` 0–1 shows the tag.
 */
export function Recorder({ on = 1, rewind = 0, spin = 0, wound = 0.3, label = 1, opacity = 1 }: { on?: number; rewind?: number; spin?: number; wound?: number; label?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const r = G.recorder;
  const k = clamp01(on);
  const edge = k > 0.5 ? INK.cyan : INK.line;
  const t = clamp01(label);
  return (
    <g opacity={opacity}>
      {k > 0.01 ? <rect x={r.x - 10} y={r.y - 10} width={r.w + 20} height={r.h + 20} rx={16} fill={alpha(INK.cyan, 0.1 * k)} /> : null}
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={8} fill={INK.dark} stroke={edge} strokeWidth={4} />
      <Cassette x={r.x + 62} y={r.y + r.h / 2} w={104} on={on} spin={spin} wound={wound} rewind={rewind} label={0} />
      {/* deck buttons */}
      <g fill={alpha(edge, 0.8)}>
        <rect x={r.x + 126} y={r.y + 16} width={22} height={10} rx={3} />
        <rect x={r.x + 126} y={r.y + 34} width={22} height={10} rx={3} />
        <circle cx={r.x + 137} cy={r.y + 66} r={8} fill={k > 0.5 ? alpha(INK.cyan, 0.9) : INK.line} />
      </g>
      {/* the tag: «ayer» */}
      {t > 0.01 ? (
        <g opacity={t}>
          <path d={`M${r.x + 62} ${r.y} v-8`} stroke={INK.steel} strokeWidth={2.5} />
          <rect x={r.x + 18} y={r.y - 44} width={88} height={36} rx={6} fill="#e2e8f0" stroke={k > 0.5 ? INK.cyan : INK.line} strokeWidth={3} />
          <text x={r.x + 62} y={r.y - 17} textAnchor="middle" fontFamily={FONT.mono} fontSize={26} fontWeight={800} fill="#0f172a">
            ayer
          </text>
        </g>
      ) : null}
    </g>
  );
}
