import type { CSSProperties, ReactNode } from 'react';
import { alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, tone as toneOf } from '../../../../engine/src/ui';
import type { TrailKind } from './TrailRow';

/**
 * The three trail icons of the morning queue — the same drawing wherever a
 * row comes back (s01 queue, the strips that open s02/s04/s05, s06's rule
 * cards, the end card):
 *   - `key`    one ordinary key: the password spraying (one key, many doors).
 *   - `folder` a folder with `../` drawn inside (two dots and a slash, as
 *              shapes — no font glyphs): the directory traversal.
 *   - `pipe`   a pipe between two flanges, packed with packets: the DNS
 *              amplification flood (it becomes the jammed street in s05).
 *
 * API: `<TrailIcon kind size tone? draw? strokeWidth? style? />`
 *   - `size`  px, square.
 *   - `tone`  an engine Tone ('rose', 'cyan'… or a #rrggbb); default 'rose'
 *             (the night's attack traffic — keep it rose unless a scene has a
 *             reason).
 *   - `draw`  0–1, strokes reveal along their length (default 1 = drawn).
 *   - `strokeWidth` in the 64-unit viewBox (default 4.2).
 * Pure SVG, no text: safe in a RuleCards `art` slot, a disc or a chip.
 */
export function TrailIcon({
  kind,
  size,
  tone = 'rose',
  draw = 1,
  strokeWidth = 4.2,
  style,
}: {
  kind: TrailKind;
  size: number;
  tone?: string;
  draw?: number;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  const d = clamp01(draw);
  const props = { color: t.fg, soft: t.soft, d, sw: strokeWidth };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }}
      aria-hidden
    >
      {kind === 'key' ? <KeyGlyph {...props} /> : kind === 'folder' ? <FolderGlyph {...props} /> : <PipeGlyph {...props} />}
    </svg>
  );
}

interface GlyphProps {
  color: string;
  soft: string;
  d: number;
  sw: number;
}

/** Stroke props that reveal a path along its length as `draw` goes 0→1 (`delay` = where in 0–1 it starts). */
function reveal(draw: number, delay = 0): Record<string, number | string> {
  const p = clamp01((draw - delay) / (1 - delay || 1));
  return p >= 1 ? {} : { pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - p };
}

function Show({ when, children }: { when: boolean; children: ReactNode }) {
  return <g opacity={when ? 1 : 0}>{children}</g>;
}

/** One ordinary key, bow on the left, two teeth. */
function KeyGlyph({ color, soft, d, sw }: GlyphProps) {
  return (
    <>
      {/* Bow with its hole */}
      <circle cx={19} cy={32} r={12} stroke={color} strokeWidth={sw} fill={alpha(color, 0.12)} {...reveal(d)} />
      <circle cx={19} cy={32} r={4} stroke={soft} strokeWidth={sw * 0.75} {...reveal(d, 0.25)} />
      {/* Shaft and teeth */}
      <path d="M31 32H57" stroke={color} strokeWidth={sw} {...reveal(d, 0.35)} />
      <path d="M50 32v9M43 32v6" stroke={color} strokeWidth={sw} {...reveal(d, 0.6)} />
    </>
  );
}

/** A folder with `../` inside, drawn as two dots and a slash. */
function FolderGlyph({ color, soft, d, sw }: GlyphProps) {
  return (
    <>
      <path
        d="M6 19a5 5 0 0 1 5-5h13l6 7h23a5 5 0 0 1 5 5v23a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5Z"
        stroke={color}
        strokeWidth={sw}
        fill={alpha(color, 0.12)}
        {...reveal(d)}
      />
      <Show when={d >= 0.55}>
        <circle cx={20} cy={44} r={3.1} fill={soft} />
        <circle cx={29} cy={44} r={3.1} fill={soft} />
      </Show>
      <path d="M36 47 45 30" stroke={soft} strokeWidth={sw * 0.9} {...reveal(d, 0.65)} />
    </>
  );
}

/** A pipe between two flanges, packed with packets crowding to the right. */
function PipeGlyph({ color, soft, d, sw }: GlyphProps) {
  const packets = [17, 24.5, 31, 36.5, 41.5, 46];
  return (
    <>
      {/* Body */}
      <path d="M12 23H52M12 41H52" stroke={color} strokeWidth={sw} {...reveal(d)} />
      {/* Flanges */}
      <rect x={5} y={18} width={7} height={28} rx={2} stroke={color} strokeWidth={sw} fill={alpha(color, 0.12)} {...reveal(d, 0.3)} />
      <rect x={52} y={18} width={7} height={28} rx={2} stroke={color} strokeWidth={sw} fill={alpha(color, 0.12)} {...reveal(d, 0.3)} />
      {/* Packets */}
      {packets.map((x, i) => (
        <Show key={x} when={d >= 0.5 + i * 0.08}>
          <circle cx={x} cy={32} r={2.6 + i * 0.15} fill={soft} />
        </Show>
      ))}
    </>
  );
}
