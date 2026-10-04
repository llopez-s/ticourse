import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, tone as toneOf, type IconName, type Tone } from '../../../../engine/src/ui';

/**
 * Image 2 of stix-isac: a post-it versus a contact in your address book.
 *
 *   PostIt        a yellow sticky note with one bare string (the domain, alone)
 *   ContactCard   the indicator as a contact: avatar, kicker (STIX type), name,
 *                 and a «fuentes» list whose rows appear and light one by one;
 *                 the same card in `tone="sky"` is the ISAC's duplicate in s04
 *   MergeBadge    the «merge contacts» icon in a disc, with a check that pops
 *   ContactMini   an icon-sized contact (avatar, name bar, two related nodes,
 *                 two source dots) for the s06 recap card
 *
 * Every animated input is a 0–1 value computed by the scene (no frames read
 * here), so the parts never depend on the timeline. Sizes are real px.
 */

// ---------------------------------------------------------------------------
// Post-it

export const POSTIT = { w: 560, h: 430, paper: '#fde68a', paperDeep: '#f5c84c', ink: '#1f2937' } as const;

export function postItHeight(width: number): number {
  return (POSTIT.h * width) / POSTIT.w;
}

/**
 * The sticky note: a square of yellow paper with a strip of tape and one
 * string in mono (centred). Drawn at its base size and scaled to `width`.
 */
export function PostIt({
  text,
  width = POSTIT.w,
  textSize = 34,
  tilt = -2.5,
  show = 1,
  dim = 0,
  style,
}: {
  text: string;
  width?: number;
  /** Font size at the base width (560). */
  textSize?: number;
  /** Degrees. */
  tilt?: number;
  /** 0–1 appear. */
  show?: number;
  /** 0–1 step back (it stays visible as a reminder). */
  dim?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const s = width / POSTIT.w;
  const d = clamp01(dim);
  return (
    <div style={{ position: 'relative', width, height: POSTIT.h * s, opacity: sh * (1 - 0.55 * d), filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: POSTIT.w,
          height: POSTIT.h,
          transform: `scale(${s}) rotate(${tilt}deg)`,
          transformOrigin: '0 0',
        }}
      >
        {/* Paper, with a slightly darker bottom where it curls. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '6px 6px 10px 26px',
            background: `linear-gradient(170deg, ${POSTIT.paper} 0%, ${POSTIT.paper} 72%, ${POSTIT.paperDeep} 100%)`,
            boxShadow: `0 28px 50px ${alpha('#000000', 0.5)}, inset 0 -10px 18px ${alpha('#b45309', 0.18)}`,
          }}
        />
        {/* Tape */}
        <div
          style={{
            position: 'absolute',
            left: POSTIT.w / 2 - 80,
            top: -22,
            width: 160,
            height: 44,
            borderRadius: 4,
            background: alpha('#e2e8f0', 0.42),
            transform: 'rotate(3deg)',
            boxShadow: `0 2px 6px ${alpha('#000000', 0.15)}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            padding: '0 24px',
            fontFamily: FONT.mono,
            fontSize: textSize,
            fontWeight: 750,
            color: POSTIT.ink,
            whiteSpace: 'nowrap',
            letterSpacing: -0.5,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact card

/** One source row of a contact. */
export interface ContactSource {
  /** One or two lines (ReactNode so words can be coloured or chipped). */
  lines: readonly ReactNode[];
  tone: Tone;
  icon?: IconName;
  /** 0–1 appear (its space is reserved before it shows). */
  show?: number;
  /** 0–1 highlight: the voice is on it. */
  hot?: number;
}

export const CONTACT = { header: 132, rowLine: 40, rowGap: 14, sourcesLabel: 46, padX: 24 } as const;

/** Height the card needs for `rowLines` source lines in total (over all rows) and `rows` rows. */
export function contactCardHeight(rows: number, rowLines: number, rowSize = 30): number {
  const line = Math.round(rowSize * 1.3);
  return CONTACT.header + 2 + (rows > 0 ? CONTACT.sourcesLabel + rowLines * line + rows * CONTACT.rowGap + 18 : 16);
}

/**
 * The indicator as a contact in your address book. `kind` is the STIX type
 * (kicker), `name` the contact's name (mono). `sources` lists where the
 * contact came from; rows keep their space before they appear so the card
 * never changes size. `merge` (0–1) is the brief flash when another contact
 * fuses into this one.
 */
export function ContactCard({
  kind,
  name,
  sources = [],
  sourcesLabel = 'fuentes',
  width = 680,
  height,
  tone = 'cyan',
  icon = 'target',
  nameSize = 32,
  rowSize = 30,
  show = 1,
  glow = 0,
  dim = 0,
  merge = 0,
  style,
}: {
  kind: string;
  name: string;
  sources?: readonly ContactSource[];
  sourcesLabel?: string;
  width?: number;
  /** Fixed height (default: what the rows need). */
  height?: number;
  tone?: Tone;
  icon?: IconName;
  nameSize?: number;
  rowSize?: number;
  /** 0–1 appear. */
  show?: number;
  /** 0–1 halo: the voice is on it. */
  glow?: number;
  /** 0–1 step back. */
  dim?: number;
  /** 0–1 flash when a duplicate fuses in. */
  merge?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const t = toneOf(tone);
  const g = clamp01(Math.max(glow, merge));
  const d = clamp01(dim);
  const m = clamp01(merge);
  const line = Math.round(rowSize * 1.3);
  const totalLines = sources.reduce((n, s) => n + s.lines.length, 0);
  const h = height ?? contactCardHeight(sources.length, totalLines, rowSize);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `${g > 0.3 ? 3 : 2}px solid ${alpha(t.fg, 0.45 + 0.5 * g)}`,
        background: `linear-gradient(180deg, ${alpha(t.fg, 0.1 + 0.12 * m)} 0%, ${alpha(t.fg, 0)} 40%), linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 26px 60px ${alpha('#000000', 0.4)}${g > 0.02 ? `, 0 0 ${Math.round(18 + 34 * g)}px ${alpha(t.fg, 0.35 * g)}` : ''}`,
        opacity: sh * (1 - 0.6 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Header: avatar + kicker + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: CONTACT.header, padding: `0 ${CONTACT.padX}px`, boxSizing: 'border-box' }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            background: `radial-gradient(circle at 35% 30%, ${alpha(t.fg, 0.4)} 0%, ${alpha(t.deep, 0.85)} 100%)`,
            border: `3px solid ${alpha(t.fg, 0.8)}`,
          }}
        >
          <Icon name={icon} size={48} color={C.textStrong} strokeWidth={2} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 650, color: t.soft, lineHeight: 1.2 }}>{kind}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: nameSize, fontWeight: 800, color: C.textStrong, lineHeight: 1.25, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>
            {name}
          </div>
        </div>
      </div>
      <div style={{ height: 2, margin: `0 ${CONTACT.padX}px`, background: alpha(t.fg, 0.25) }} />
      {sources.length ? (
        <div style={{ padding: `0 ${CONTACT.padX}px` }}>
          <div style={{ height: CONTACT.sourcesLabel, display: 'flex', alignItems: 'flex-end', paddingBottom: 6, boxSizing: 'border-box', fontSize: 24, fontWeight: 750, letterSpacing: 3, textTransform: 'uppercase', color: C.muted }}>
            {sourcesLabel}
          </div>
          {sources.map((src, i) => {
            const st = toneOf(src.tone);
            const p = clamp01(src.show ?? 1);
            const hot = clamp01(src.hot ?? 0);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 14,
                  marginTop: i === 0 ? 4 : CONTACT.rowGap,
                  height: src.lines.length * line,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 24}px)`,
                }}
              >
                <div style={{ width: 6, borderRadius: 3, background: st.fg, boxShadow: hot > 0.02 ? `0 0 ${Math.round(14 * hot)}px ${alpha(st.fg, 0.8 * hot)}` : 'none', flexShrink: 0 }} />
                {src.icon ? (
                  <div style={{ height: line, display: 'grid', placeItems: 'center' }}>
                    <Icon name={src.icon} size={Math.round(rowSize * 1.05)} color={st.fg} />
                  </div>
                ) : null}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  {src.lines.map((l, k) => (
                    <div
                      key={k}
                      style={{
                        height: line,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: rowSize,
                        fontWeight: k === 0 ? 700 : 650,
                        color: hot > 0.5 || k === 0 ? C.textStrong : C.text,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Merge badge

/** The «merge contacts» icon in a disc; `check` (0–1) pops a small check on its rim. */
export function MergeBadge({ size = 92, pop = 1, check = 0, color = C.emerald }: { size?: number; pop?: number; check?: number; color?: string }) {
  const p = Math.max(0, pop);
  if (p <= 0.001) return null;
  const c = clamp01(check);
  return (
    <div style={{ position: 'relative', width: size, height: size, transform: `scale(${p})`, opacity: Math.min(1, p * 1.5) }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: size / 2,
          display: 'grid',
          placeItems: 'center',
          background: `radial-gradient(circle at 35% 30%, ${alpha(color, 0.35)} 0%, ${C.ink900} 100%)`,
          border: `3px solid ${color}`,
          boxShadow: `0 0 ${Math.round(size * 0.4)}px ${alpha(color, 0.45)}`,
        }}
      >
        <Icon name="merge" size={Math.round(size * 0.56)} color={color} strokeWidth={2.2} />
      </div>
      {c > 0 ? (
        <div
          style={{
            position: 'absolute',
            right: -size * 0.12,
            bottom: -size * 0.08,
            width: size * 0.46,
            height: size * 0.46,
            borderRadius: size * 0.23,
            display: 'grid',
            placeItems: 'center',
            background: color,
            transform: `scale(${c})`,
            boxShadow: `0 0 14px ${alpha(color, 0.6)}`,
          }}
        >
          <Icon name="check" size={Math.round(size * 0.32)} color={C.ink950} strokeWidth={3} />
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini

export const CONTACT_MINI = { w: 300, h: 170 } as const;

/**
 * The contact as an icon (s06 rule-2): a small card (avatar, name bar, two
 * source dots: cyan own, sky ISAC) linked to two related nodes on its right.
 */
export function ContactMini({ width = CONTACT_MINI.w, glow = 0 }: { width?: number; glow?: number }) {
  const s = width / CONTACT_MINI.w;
  const g = clamp01(glow);
  const rose = C.rose;
  return (
    <div style={{ position: 'relative', width, height: CONTACT_MINI.h * s }}>
      <svg
        width={CONTACT_MINI.w}
        height={CONTACT_MINI.h}
        viewBox={`0 0 ${CONTACT_MINI.w} ${CONTACT_MINI.h}`}
        style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${s})`, transformOrigin: '0 0', overflow: 'visible' }}
      >
        {/* relations */}
        <path d="M 168 62 C 200 62 206 40 236 36" fill="none" stroke={alpha(C.violet, 0.9)} strokeWidth={4} strokeLinecap="round" />
        <path d="M 168 104 C 200 104 206 130 236 134" fill="none" stroke={alpha(C.violet, 0.9)} strokeWidth={4} strokeLinecap="round" />
        <rect x={234} y={16} width={58} height={40} rx={10} fill={alpha(rose, 0.18)} stroke={rose} strokeWidth={3} />
        <rect x={234} y={114} width={58} height={40} rx={10} fill={alpha(rose, 0.18)} stroke={rose} strokeWidth={3} />
        {/* card */}
        <rect
          x={4}
          y={14}
          width={166}
          height={142}
          rx={18}
          fill={C.ink850}
          stroke={alpha(C.cyan, 0.6 + 0.4 * g)}
          strokeWidth={3}
          style={{ filter: g > 0.02 ? `drop-shadow(0 0 ${Math.round(14 * g)}px ${alpha(C.cyan, 0.6 * g)})` : undefined }}
        />
        <circle cx={44} cy={54} r={24} fill={alpha(C.cyan, 0.35)} stroke={C.cyan} strokeWidth={3} />
        <circle cx={44} cy={54} r={9} fill="none" stroke={C.textStrong} strokeWidth={2.5} />
        <rect x={78} y={42} width={76} height={10} rx={5} fill={alpha(C.text, 0.7)} />
        <rect x={78} y={60} width={52} height={8} rx={4} fill={alpha(C.text, 0.35)} />
        <line x1={20} y1={92} x2={154} y2={92} stroke={alpha(C.cyan, 0.3)} strokeWidth={2} />
        {/* two sources */}
        <rect x={20} y={104} width={10} height={16} rx={3} fill={C.cyan} />
        <rect x={38} y={107} width={92} height={9} rx={4.5} fill={alpha(C.text, 0.45)} />
        <rect x={20} y={128} width={10} height={16} rx={3} fill={C.sky} />
        <rect x={38} y={131} width={76} height={9} rx={4.5} fill={alpha(C.text, 0.45)} />
        <rect x={120} y={128} width={34} height={16} rx={8} fill={alpha(C.amber, 0.3)} stroke={C.amber} strokeWidth={2} />
      </svg>
    </div>
  );
}
