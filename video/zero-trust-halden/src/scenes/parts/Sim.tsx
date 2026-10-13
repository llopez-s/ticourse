import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/**
 * V20's policy simulator (s04, s05): ONE console frame that fills the stage. Nothing here runs and the
 * real ERP is never touched — the header and the stamp say so all the time.
 *
 *   header   «simulador de políticas» · «propuesta de Seguridad» · «sin efectos: el ERP no se toca»
 *   left     the cards column (the policy, the request, results) and, at its foot, the stamp
 *            «diseño y simulación · sin efectos»
 *   right    the «voice line» zone (the live step, a name) over the compact Warehouse
 *
 * Geometry is in stage-local px (1728 × 660), in `SIM`. Pure and prop-driven: every animation is a 0–1
 * prop, nothing reads the timeline. Cyan = the simulator's own chrome (the control plane's colour).
 */
export const SIM = {
  w: 1728,
  h: 660,
  header: 50,
  /** The cards column. */
  col: { x: 16, y: 60, w: 644 },
  /** The right pane: the zone for the live line, then the Warehouse's box. */
  pane: { x: 676, w: 1040 },
  zone: { y: 58, h: 134 },
  nave: { y: 198, h: 454 },
  stamp: { x: 18, y: 606 },
} as const;

/** The nave's layout options inside the simulator (pass them to Warehouse and to warehouseLayout): exam names upstairs, «PEP» under the ground. */
export const SIM_NAVE = { variant: 'compact', roof: 14, bands: { top: 45, bottom: 45 }, placeDown: 'head' } as const;

export const SIM_TEXT = {
  title: 'simulador de políticas',
  owner: 'propuesta de Seguridad',
  safe: 'sin efectos: el ERP no se toca',
  stamp: ['diseño y simulación', 'sin efectos'],
} as const;

const VIOLET_SOFT = '#c4b5fd';
const STEEL = '#cbd5e1';

/** The frame, its header and its stamp. `header` / `lit`: one 0–1 per header string. */
export function SimFrame({
  show = 1,
  header = [1, 1, 1],
  lit = [0, 0, 0],
  headerDim = 0,
  stamp = 1,
  stampGlow = 0,
  stampAt,
  children,
}: {
  show?: number;
  header?: readonly number[];
  lit?: readonly number[];
  /** 0–1: the header's text steps back (the engine's think card sits over it). */
  headerDim?: number;
  /** 0–1: the stamp lands (1 = resting). */
  stamp?: number;
  stampGlow?: number;
  /** Where the stamp is (default: its resting place, SIM.stamp, scale 1). */
  stampAt?: { x: number; y: number; scale: number };
  children?: ReactNode;
}) {
  const s = clamp01(show);
  const hd = 1 - 0.85 * clamp01(headerDim);
  const part = (i: number, text: string, css: CSSProperties) => {
    const p = clamp01(header[i] ?? 0);
    const l = clamp01(lit[i] ?? 0);
    return (
      <span style={{ opacity: p, transform: `translateY(${(1 - p) * -6}px)`, textShadow: l > 0.01 ? `0 0 ${Math.round(18 * l)}px ${alpha(C.cyan, 0.7 * l)}` : undefined, whiteSpace: 'nowrap', ...css }}>{text}</span>
    );
  };
  const st = clamp01(stamp);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: SIM.w, height: SIM.h, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.42)}`, background: alpha(C.ink900, 0.5), boxShadow: `0 20px 50px ${alpha('#000000', 0.35)}`, opacity: s }} />
      {/* Header */}
      <div style={{ position: 'absolute', left: 2, top: 2, width: SIM.w - 4, height: SIM.header - 2, boxSizing: 'border-box', borderRadius: `${RADIUS.lg - 2}px ${RADIUS.lg - 2}px 0 0`, borderBottom: `2px solid ${alpha(C.cyan, 0.3)}`, background: alpha(C.cyan, 0.08), opacity: s }} />
      <div style={{ position: 'absolute', left: 18, top: 0, width: SIM.w - 40, height: SIM.header, display: 'flex', alignItems: 'center', gap: 14, opacity: s * hd }}>
        <Icon name="app" size={32} color={C.cyan} strokeWidth={2} />
        {part(0, SIM_TEXT.title, { fontSize: 32, fontWeight: 850, color: C.cyanSoft, letterSpacing: 0.2 })}
        <span style={{ fontSize: 32, fontWeight: 700, color: C.faint, opacity: clamp01(header[1] ?? 0) }}>·</span>
        {part(1, SIM_TEXT.owner, { fontSize: 32, fontWeight: 700, color: C.text })}
        <span style={{ flex: 1 }} />
        {part(2, SIM_TEXT.safe, { fontSize: 32, fontWeight: 750, color: C.cyanSoft })}
      </div>
      {/* Column / pane divider */}
      <div style={{ position: 'absolute', left: SIM.col.x + SIM.col.w + 7, top: SIM.header + 8, width: 2, height: SIM.h - SIM.header - 16, background: alpha(C.cyan, 0.16), opacity: s }} />
      {children}
      {/* The stamp: nothing is running */}
      {st > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: stampAt?.x ?? SIM.stamp.x,
            top: stampAt?.y ?? SIM.stamp.y,
            height: 44,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 18px 0 14px',
            boxSizing: 'border-box',
            borderRadius: 10,
            border: `3px solid ${alpha(C.cyanSoft, 0.85)}`,
            outline: `2px solid ${alpha(C.cyanSoft, 0.35)}`,
            outlineOffset: 4,
            background: alpha(C.ink950, 0.9),
            boxShadow: stampGlow > 0.01 ? `0 0 ${Math.round(30 * stampGlow)}px ${alpha(C.cyan, 0.45 * stampGlow)}` : undefined,
            fontSize: 28,
            fontWeight: 820,
            letterSpacing: 0.4,
            color: C.cyanSoft,
            whiteSpace: 'nowrap',
            opacity: Math.min(1, st * 1.4),
            transform: `rotate(-1.2deg) scale(${(stampAt?.scale ?? 1) * (1.3 - 0.3 * st)})`,
            transformOrigin: '0 0',
          }}
        >
          <Icon name="pause" size={26} color={C.cyanSoft} strokeWidth={2.6} />
          <span>{SIM_TEXT.stamp[0]}</span>
          <span style={{ color: alpha(C.cyanSoft, 0.55) }}>·</span>
          <span style={{ color: C.textStrong }}>{SIM_TEXT.stamp[1]}</span>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cards: a title bar and field rows

export type SimTone = 'plain' | 'cyan' | 'amber' | 'rose' | 'emerald';
const TONE: Record<SimTone, { fg: string; text: string }> = {
  plain: { fg: STEEL, text: C.textStrong },
  cyan: { fg: C.cyan, text: C.cyanSoft },
  amber: { fg: C.amber, text: '#fcd34d' },
  rose: { fg: C.rose, text: '#fda4af' },
  emerald: { fg: C.emerald, text: '#6ee7b7' },
};

export interface SimRow {
  /** One string; an array = the same string wrapped over lines. */
  text: string | readonly string[];
  /** A mono value written before the text on the same line, joined with « · » (a time). */
  pre?: string;
  icon?: IconName;
  /** Times and identifiers. */
  mono?: boolean;
  tone?: SimTone;
  /** 0–1 the row is written. */
  show?: number;
  /** 0–1 the voice (or the engine) is on it. */
  lit?: number;
  /** A thin rule above the row. */
  rule?: boolean;
}

const lines = (r: SimRow) => (typeof r.text === 'string' ? [r.text] : r.text);

/** Row pitch of a card: `leading` × the text size. */
const LEADING = 1.22;

/** Height of a SimCard with these rows. */
export function simCardHeight(rows: readonly SimRow[], size: number, head = Math.round(size * 1.5), leading = LEADING): number {
  const rowH = Math.round(size * leading);
  return 4 + head + 5 + rows.reduce((h, r) => h + lines(r).length * rowH + (r.rule ? 5 : 0), 0) + 8;
}

/** A card of the simulator: `title`, an optional `tag` at the right of its bar, then the rows. */
export function SimCard({
  title,
  tag,
  rows,
  width,
  size = 32,
  head,
  leading = LEADING,
  skeleton = 0,
  tone = 'cyan',
  show = 1,
  glow = 0,
  dim = 0,
  style,
}: {
  title: string;
  tag?: ReactNode;
  rows: readonly SimRow[];
  width: number;
  /** px of the rows' text. */
  size?: number;
  /** px of the title bar (default 1.5 × size). */
  head?: number;
  leading?: number;
  /** 0–1: rows not written yet show as faint bars (an empty form). */
  skeleton?: number;
  tone?: 'cyan' | 'plain' | 'rose';
  show?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const g = clamp01(glow);
  const d = clamp01(dim);
  const edge = TONE[tone].fg;
  const headH = head ?? Math.round(size * 1.5);
  const rowH = Math.round(size * leading);
  const sk = clamp01(skeleton);
  const titleSize = Math.min(32, Math.max(28, size));
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: simCardHeight(rows, size, headH, leading),
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(edge, 0.5 + 0.4 * g)}`,
        background: alpha(C.ink900, 0.94),
        boxShadow: `0 0 ${Math.round(8 + 26 * g)}px ${alpha(edge, 0.08 + 0.25 * g)}, 0 12px 26px ${alpha('#000000', 0.38)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        opacity: s * (1 - 0.55 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        transform: `translateY(${(1 - s) * 12}px)`,
        ...style,
      }}
    >
      <div style={{ height: headH, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', background: alpha(edge, 0.12), borderBottom: `2px solid ${alpha(edge, 0.3)}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: titleSize, fontWeight: 850, color: TONE[tone].text, letterSpacing: 0.2 }}>{title}</span>
        <span style={{ flex: 1 }} />
        {tag}
      </div>
      <div style={{ padding: '5px 14px 0' }}>
        {rows.map((r, i) => {
          const p = clamp01(r.show ?? 1);
          const l = clamp01(r.lit ?? 0);
          const t = TONE[r.tone ?? 'plain'];
          const toned = (r.tone ?? 'plain') !== 'plain';
          const ls = lines(r);
          return (
            <div key={i} style={{ position: 'relative', borderTop: r.rule ? `2px solid ${alpha(edge, 0.22)}` : undefined, marginTop: r.rule ? 2 : 0, paddingTop: r.rule ? 1 : 0 }}>
              {sk > 0.01 && p < 0.999 ? <div style={{ position: 'absolute', left: Math.round(size * 1.22), top: '50%', width: `${34 + ((i * 37) % 30)}%`, height: Math.max(6, Math.round(size * 0.3)), marginTop: -Math.max(3, Math.round(size * 0.15)), borderRadius: 99, background: alpha(STEEL, 0.16 * sk * (1 - p)) }} /> : null}
              <div style={{ position: 'relative', opacity: p, transform: `translateX(${(1 - p) * -10}px)` }}>
              {l > 0.01 ? <div style={{ position: 'absolute', left: -8, right: -8, top: r.rule ? 3 : 1, bottom: 1, borderRadius: 8, background: alpha(toned ? t.fg : C.cyan, 0.16 * l), boxShadow: `inset 4px 0 0 ${alpha(toned ? t.fg : C.cyan, 0.9 * l)}` }} /> : null}
              {ls.map((line, k) => (
                <div key={k} style={{ position: 'relative', height: rowH, display: 'flex', alignItems: 'center', gap: Math.round(size * 0.36), whiteSpace: 'nowrap' }}>
                  <span style={{ width: Math.round(size * 0.86), flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    {k === 0 && r.icon ? <Icon name={r.icon} size={Math.round(size * 0.86)} color={toned ? t.fg : alpha(STEEL, 0.75)} strokeWidth={2} /> : null}
                  </span>
                  {k === 0 && r.pre ? (
                    <>
                      <span style={{ fontFamily: FONT.mono, fontSize: size, fontWeight: 800, color: toned ? t.text : C.textStrong }}>{r.pre}</span>
                      <span style={{ fontSize: size, fontWeight: 700, color: C.faint }}>·</span>
                    </>
                  ) : null}
                  <span style={{ fontFamily: r.mono ? FONT.mono : FONT.sans, fontSize: size, fontWeight: r.mono ? 800 : size >= 30 ? 720 : 650, color: toned ? t.text : alpha(C.textStrong, 0.86 + 0.14 * l), letterSpacing: r.mono ? 0 : -0.2 }}>{line}</span>
                </div>
              ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** A violet exam name as a small tag (card bars, plates). */
export function SimTerm({ children, size = 30, show = 1, glow = 0, icon = true }: { children: ReactNode; size?: number; show?: number; glow?: number; icon?: boolean }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.28), fontFamily: FONT.sans, fontSize: size, fontWeight: 850, letterSpacing: 0.5, color: VIOLET_SOFT, whiteSpace: 'nowrap', opacity: s, textShadow: glow > 0.01 ? `0 0 ${Math.round(20 * glow)}px ${alpha(C.violet, 0.8 * glow)}` : undefined }}>
      {icon ? <Icon name="mortarboard" size={Math.round(size * 0.95)} color={C.violet} /> : null}
      {children}
    </span>
  );
}

/** A pill chip in a tone (a requirement, a result, a limit). */
export function SimChip({ children, tone = 'cyan', size = 32, icon, show = 1, glow = 0, dim = 0, style }: { children: ReactNode; tone?: SimTone; size?: number; icon?: IconName; show?: number; glow?: number; dim?: number; style?: CSSProperties }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const t = TONE[tone];
  const g = clamp01(glow);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        height: Math.round(size * 1.62),
        padding: `0 ${Math.round(size * 0.6)}px 0 ${Math.round(size * (icon ? 0.42 : 0.6))}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(t.fg, 0.6 + 0.4 * g)}`,
        background: `linear-gradient(180deg, ${alpha(t.fg, 0.14 + 0.1 * g)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(26 * g)}px ${alpha(t.fg, 0.32 * g)}` : `0 8px 20px ${alpha('#000000', 0.32)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1,
        color: tone === 'plain' ? C.textStrong : t.text,
        whiteSpace: 'nowrap',
        opacity: s * (1 - 0.55 * clamp01(dim)),
        transform: `translateY(${(1 - s) * 10}px)`,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.02)} color={t.fg} strokeWidth={2.3} /> : null}
      {children}
    </span>
  );
}
