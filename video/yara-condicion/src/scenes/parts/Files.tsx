import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';

/** A corpus file: a letter (the variants A/B/C) or a file icon (the controls), with its name and role. */
export function FileTile({
  frame,
  at,
  name,
  sub,
  letter,
  tone = 'cyan',
  w,
  h = 96,
  lit = 0,
  dim = 0,
  mono = false,
  nameSize,
  noIcon = false,
}: {
  frame: number;
  at: number;
  name: string;
  sub?: string;
  letter?: string;
  tone?: Tone;
  w: number;
  h?: number;
  lit?: number;
  dim?: number;
  mono?: boolean;
  /** Overrides the name size (default 34 sans / 28 mono). */
  nameSize?: number;
  /** Drops the leading letter/icon tile (narrow tiles with a long mono name). */
  noIcon?: boolean;
}) {
  const p = progress(frame, at, 16);
  if (p <= 0.001) return null;
  const t = toneOf(tone);
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: w,
        height: h,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 18px 0 14px',
        borderRadius: RADIUS.md,
        background: lit > 0 ? alpha(t.fg, 0.12) : C.ink850,
        border: `2px solid ${alpha(t.fg, 0.4 + 0.5 * lit)}`,
        boxShadow: lit > 0 ? `0 0 ${18 + 24 * lit}px ${alpha(t.fg, 0.3 * lit)}` : 'none',
        opacity: p * (1 - 0.55 * dim),
        transform: `translateY(${(1 - p) * 14}px)`,
        fontFamily: FONT.sans,
      }}
    >
      {noIcon ? null : (
        <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(t.fg, 0.14), border: `2px solid ${alpha(t.fg, 0.5)}`, fontSize: 40, fontWeight: 850, color: t.soft }}>
          {letter ?? <Icon name="file" size={34} color={t.fg} />}
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: nameSize ?? (mono ? 28 : 34), fontWeight: 800, fontFamily: mono ? FONT.mono : FONT.sans, color: C.textStrong, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{name}</div>
        {sub ? <div style={{ marginTop: 4, fontSize: 26, fontWeight: 560, color: t.soft, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{sub}</div> : null}
      </div>
    </div>
  );
}
