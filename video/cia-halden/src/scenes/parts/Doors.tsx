import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The three screen doors of AAA (concept 2): three drawn questions, never doors of the port — an arched outline with
 * its number and question inside and its term under the arch. No handle, lock, reader or lobby (V28's lock, V50).
 */

export const DOORS = [
  { q: '¿Quién eres?', term: 'AUTHENTICATION' },
  { q: '¿Qué puedes hacer?', term: 'AUTHORIZATION' },
  { q: '¿Qué hiciste?', term: 'ACCOUNTING' },
] as const;

/** One door at full size: the arch with number + question; `term` 0–1 writes its exam term under it. */
export function Door({
  index,
  width,
  height,
  on = 1,
  term = 0,
  show = 1,
}: {
  index: number;
  width: number;
  height: number;
  /** 0–1: the voice is on this door (bright border, glow). */
  on?: number;
  /** 0–1: its term is named. */
  term?: number;
  /** 0–1: the door is drawn at all (its outline fades in). */
  show?: number;
}) {
  const o = clamp01(on);
  const t = clamp01(term);
  const d = DOORS[index];
  const tone = C.cyan;
  return (
    <div style={{ position: 'relative', width, height, opacity: clamp01(show), fontFamily: FONT.sans }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: `${width / 2}px ${width / 2}px 18px 18px / ${Math.min(width / 2, height * 0.42)}px ${Math.min(width / 2, height * 0.42)}px 18px 18px`,
          border: `4px solid ${alpha(tone, 0.3 + 0.6 * o)}`,
          background: `linear-gradient(180deg, ${alpha(tone, 0.04 + 0.1 * o)} 0%, ${alpha(C.ink900, 0.6)} 100%)`,
          boxShadow: o > 0.05 ? `0 0 ${Math.round(36 * o)}px ${alpha(tone, 0.25 * o)}` : undefined,
        }}
      />
      {/* number */}
      <div
        style={{
          position: 'absolute',
          left: width / 2 - 26,
          top: 18,
          width: 52,
          height: 52,
          borderRadius: 26,
          display: 'grid',
          placeItems: 'center',
          fontSize: 32,
          fontWeight: 850,
          color: o > 0.5 ? C.ink950 : C.cyanSoft,
          background: o > 0.5 ? C.cyan : alpha(C.cyan, 0.12),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
        }}
      >
        {index + 1}
      </div>
      {/* the question */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center', fontSize: 42, fontWeight: 850, color: o > 0.5 ? C.textStrong : C.text, whiteSpace: 'nowrap' }}>
        {d.q}
      </div>
      {/* the term, under the arch's floor line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 16,
          display: 'flex',
          justifyContent: 'center',
          opacity: t,
          transform: `translateY(${(1 - t) * 10}px)`,
        }}
      >
        <div
          style={{
            padding: '6px 20px',
            borderRadius: 999,
            border: `2px solid ${alpha(C.violet, 0.5 + 0.4 * o)}`,
            background: alpha(C.violet, 0.12 + 0.08 * o),
            fontSize: 34,
            fontWeight: 850,
            letterSpacing: 1,
            color: '#c4b5fd',
            whiteSpace: 'nowrap',
          }}
        >
          {d.term}
        </div>
      </div>
    </div>
  );
}

/** The three doors as a small icon (s08 rule 2): three arches, no words. */
export function DoorsIcon({ height, glow = 0 }: { height: number; glow?: number }) {
  const w = height * 0.62;
  const gap = height * 0.14;
  const g = clamp01(glow);
  return (
    <svg width={3 * w + 2 * gap} height={height} viewBox={`0 0 ${3 * w + 2 * gap} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      {[0, 1, 2].map((i) => {
        const x = i * (w + gap);
        const r = w / 2;
        return (
          <g key={i}>
            <path
              d={`M${x + 2} ${height - 2} V${r + 2} A${r - 2} ${r - 2} 0 0 1 ${x + w - 2} ${r + 2} V${height - 2} Z`}
              fill={alpha(C.cyan, 0.08 + 0.12 * g)}
              stroke={C.cyan}
              strokeOpacity={0.55 + 0.4 * g}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={x + w / 2} cy={r + 6} r={height * 0.09} fill={alpha(C.cyanSoft, 0.4 + 0.5 * g)} />
          </g>
        );
      })}
    </svg>
  );
}
