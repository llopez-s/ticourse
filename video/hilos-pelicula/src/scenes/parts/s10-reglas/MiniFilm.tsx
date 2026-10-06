import { useId } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/** What a frame of a miniature strip holds. */
export type MiniFrame = 'observed' | 'empty' | 'projected';

/** Pure geometry of a miniature strip `width` px wide with `n` frames (px from its top-left). */
export function miniStripLayout(width: number, n: number, height = Math.round(width * 0.26)) {
  const rim = Math.max(10, Math.round(height * 0.2));
  const gap = Math.max(6, Math.round(width * 0.018));
  const fw = (width - gap * (n + 1)) / n;
  const fh = height - 2 * rim;
  const frames = Array.from({ length: n }, (_, i) => {
    const x = gap + i * (fw + gap);
    return { x, y: rim, w: fw, h: fh, cx: x + fw / 2, cy: rim + fh / 2 };
  });
  return { width, height, rim, frames };
}

/**
 * A film strip in miniature (s10's rule art and end card): the same image as the video's films — dark celluloid with
 * sprocket holes along both edges, one frame per photo, the rose thread through the observed frames. An `empty`
 * frame is a grey outline with «?» (the partial thread's gap); a `projected` frame is dashed and translucent rose
 * (light, never an observed photo).
 *
 * - `show`   0–1 per frame (frames light one by one).
 * - `thread` 0–1 how far the rose thread has run through the observed frames.
 * - `glow`   0–1 the projected frame's glow.
 */
export function MiniStrip({
  width,
  height,
  frames,
  show,
  thread = 0,
  glow = 0,
  opacity = 1,
}: {
  width: number;
  height?: number;
  frames: readonly MiniFrame[];
  show: readonly number[] | number;
  thread?: number;
  glow?: number;
  opacity?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const L = miniStripLayout(width, frames.length, height);
  const holeW = Math.max(6, Math.round(L.rim * 0.55));
  const holeH = Math.max(4, Math.round(L.rim * 0.42));
  const pitch = holeW * 2.1;
  const holes = Math.floor((width - holeW) / pitch);
  const at = (i: number) => clamp01(typeof show === 'number' ? show : (show[i] ?? 0));
  const observed = L.frames.filter((_, i) => frames[i] === 'observed');
  const t = clamp01(thread);
  const g = clamp01(glow);
  const first = observed[0];
  const last = observed[observed.length - 1];
  return (
    <svg width={width} height={L.height} style={{ display: 'block', overflow: 'visible', opacity }}>
      {/* The same celluloid as FilmRail's band (#1a1f2b / #12161f), so the miniature reads as the video's film. */}
      <defs>
        <linearGradient id={`mf-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1f2b" />
          <stop offset="50%" stopColor="#12161f" />
          <stop offset="100%" stopColor="#1a1f2b" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={width} height={L.height} rx={6} fill={`url(#mf-${uid})`} stroke={alpha(C.muted, 0.4)} strokeWidth={2} />
      {Array.from({ length: holes }, (_, k) => {
        const x = holeW / 2 + k * pitch + (width - holes * pitch) / 2;
        return (
          <g key={k} fill={C.ink950}>
            <rect x={x} y={(L.rim - holeH) / 2} width={holeW} height={holeH} rx={1.5} />
            <rect x={x} y={L.height - L.rim + (L.rim - holeH) / 2} width={holeW} height={holeH} rx={1.5} />
          </g>
        );
      })}
      {L.frames.map((f, i) => {
        const kind = frames[i];
        const s = at(i);
        if (kind === 'observed') {
          return (
            <g key={i} opacity={0.25 + 0.75 * s}>
              <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={4} fill={C.ink800} stroke={alpha(C.rose, 0.35 + 0.4 * s)} strokeWidth={2} />
              <circle cx={f.cx} cy={f.y + f.h * 0.38} r={Math.max(3, f.h * 0.12)} fill={alpha(C.rose, 0.4 + 0.6 * s)} />
              <rect x={f.x + f.w * 0.2} y={f.y + f.h * 0.66} width={f.w * 0.6} height={Math.max(2, f.h * 0.08)} rx={1} fill={alpha(C.text, 0.35)} />
            </g>
          );
        }
        if (kind === 'empty') {
          return (
            <g key={i} opacity={0.3 + 0.7 * s}>
              <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={4} fill="none" stroke={alpha(C.muted, 0.7)} strokeWidth={2} strokeDasharray="5 4" />
              <text x={f.cx} y={f.cy + f.h * 0.16} textAnchor="middle" fontSize={f.h * 0.48} fontWeight={800} fill={alpha(C.muted, 0.85)} fontFamily={FONT.sans}>
                ?
              </text>
            </g>
          );
        }
        return (
          <g key={i} opacity={s}>
            <rect
              x={f.x}
              y={f.y}
              width={f.w}
              height={f.h}
              rx={4}
              fill={alpha(C.rose, 0.12 + 0.16 * g)}
              stroke={alpha(C.roseSoft, 0.6 + 0.4 * g)}
              strokeWidth={2.4}
              strokeDasharray="6 4"
              style={g > 0.02 ? { filter: `drop-shadow(0 0 ${Math.round(4 + 10 * g)}px ${alpha(C.rose, 0.7 * g)})` } : undefined}
            />
            {[0.3, 0.5, 0.7].map((k) => (
              <line key={k} x1={f.x + 4} y1={f.y + f.h * k} x2={f.x + f.w - 4} y2={f.y + f.h * k} stroke={alpha(C.roseSoft, 0.35)} strokeWidth={1.4} />
            ))}
          </g>
        );
      })}
      {first && last && t > 0 ? (
        <line
          x1={first.cx}
          y1={first.cy}
          x2={first.cx + (last.cx - first.cx) * t}
          y2={first.cy}
          stroke={C.rose}
          strokeWidth={Math.max(3, L.height * 0.05)}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${alpha(C.rose, 0.7)})` }}
        />
      ) : null}
    </svg>
  );
}
