import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';
import type { Mark } from './Code';

/** A row of byte cells with a letter tile in front. `marks` lights single cells by index from their frame. */
export function ByteRow({
  frame,
  at,
  label,
  bytes,
  cellW = 52,
  cellH = 56,
  size = 26,
  gap = 2,
  marks = {},
  nullTone,
  lit = 0,
  dim = 0,
  tone = 'cyan',
  labelSize = 36,
  labelW = 64,
}: {
  frame: number;
  at: number;
  label: string;
  bytes: string[];
  cellW?: number;
  cellH?: number;
  size?: number;
  gap?: number;
  marks?: Record<number, Mark>;
  /** Colours the «00» cells (the nulls of a wide string). */
  nullTone?: Tone;
  lit?: number;
  dim?: number;
  tone?: Tone;
  labelSize?: number;
  labelW?: number;
}) {
  const p = progress(frame, at, 16);
  if (p <= 0.001) return null;
  const t = toneOf(tone);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: p * (1 - 0.55 * dim), transform: `translateY(${(1 - p) * 14}px)`, fontFamily: FONT.sans }}>
      <div style={{ width: labelW, height: cellH, borderRadius: RADIUS.sm, display: 'grid', placeItems: 'center', fontSize: labelSize, fontWeight: 850, color: C.textStrong, background: alpha(t.fg, 0.14 + 0.1 * lit), border: `2px solid ${alpha(t.fg, 0.6 + 0.35 * lit)}`, boxShadow: lit > 0 ? `0 0 ${14 + 18 * lit}px ${alpha(t.fg, 0.4 * lit)}` : 'none' }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap }}>
        {bytes.map((b, i) => {
          const m = marks[i];
          const on = m ? progress(frame, m.at, 10) : 0;
          const mt = m ? toneOf(m.tone) : null;
          const isNull = nullTone !== undefined && b === '00';
          const nt = isNull ? toneOf(nullTone) : null;
          const fg = mt && on > 0 ? mt.soft : nt ? nt.soft : C.text;
          const bg = mt && on > 0 ? alpha(mt.fg, 0.22 * on) : nt ? alpha(nt.fg, 0.1) : C.ink850;
          const bd = mt && on > 0 ? alpha(mt.fg, 0.95 * on) : nt ? alpha(nt.fg, 0.4) : C.ink700;
          return (
            <div key={i} style={{ boxSizing: 'border-box', width: cellW, height: cellH, display: 'grid', placeItems: 'center', borderRadius: 8, border: `2px solid ${bd}`, background: bg, boxShadow: mt && on > 0 ? `0 0 ${12 + 16 * on}px ${alpha(mt.fg, 0.4 * on)}` : 'none', fontFamily: FONT.mono, fontSize: size, fontWeight: 700, color: fg }}>
              {b}
            </div>
          );
        })}
      </div>
    </div>
  );
}
