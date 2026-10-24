import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { ChairGlyph, PlateGlyph, StationGlyph, type StationKind } from './Glyphs';

/** A panel's title: the station glyph and its official name, in the line's cyan. */
export function PanelTitle({ kind, children, show = 1, style }: { kind: StationKind; children: ReactNode; show?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: show, transform: `translateY(${(1 - show) * 12}px)`, fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.cyan, whiteSpace: 'nowrap', ...style }}>
      <StationGlyph kind={kind} size={48} color={C.cyan} />
      {children}
    </div>
  );
}

/**
 * The valuation card of Analysis & Production: three words (juicio · valoración · hipótesis), a confidence meter
 * and an EMPTY heading — the slot where «what is it about?» should be. `chips` (0–1) lights the words, `meter`
 * fills the confidence, `ask` (0–1) writes «¿valoración de qué?» into the empty heading.
 */
export function ValuationCard({ width, chips, meter, ask, header, words, confidence, style }: { width: number; chips: number; meter: number; ask: number; header: string; words: readonly string[]; confidence: string; style?: CSSProperties }) {
  const segs = 5;
  const lit = Math.round(3 * meter);
  return (
    <div style={{ width, boxSizing: 'border-box', padding: '22px 28px 26px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.55)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.08)} 0%, ${alpha(C.ink900, 0.96)} 60%)`, boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`, fontFamily: FONT.sans, ...style }}>
      {/* The empty heading */}
      <div style={{ height: 66, boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 22px', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.amber, 0.35 + 0.55 * ask)}`, background: alpha(C.amber, 0.04 + 0.08 * ask) }}>
        <span style={{ fontSize: 40, fontWeight: 850, color: C.amber, opacity: ask, whiteSpace: 'nowrap' }}>{header}</span>
      </div>
      <div style={{ marginTop: 22, display: 'flex', gap: 14 }}>
        {words.map((w, i) => {
          const o = Math.max(0, Math.min(1, chips * 3 - i));
          return (
            <span key={w} style={{ padding: '6px 22px 8px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.12), fontSize: 32, fontWeight: 750, color: C.cyanSoft, opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: C.muted, width: 150 }}>{confidence}</span>
        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          {Array.from({ length: segs }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 26, borderRadius: 8, border: `2px solid ${alpha(C.cyan, 0.5)}`, background: i < lit ? alpha(C.cyan, 0.75) : alpha(C.ink800, 0.9) }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** The plate nobody asked for, on a table without a comanda: a plate, the table line and an empty order holder. */
export function PlateTable({ width, plate, empty, label, style }: { width: number; plate: number; empty: number; label: string; style?: CSSProperties }) {
  const h = 250;
  return (
    <div style={{ position: 'relative', width, height: h, fontFamily: FONT.sans, ...style }}>
      {/* The empty order holder */}
      <div style={{ position: 'absolute', left: 8, top: 0, width: 120, height: 150, boxSizing: 'border-box', borderRadius: 10, border: `3px dashed ${alpha(C.amber, 0.7)}`, display: 'grid', placeItems: 'center', opacity: empty }}>
        <span style={{ fontSize: 80, fontWeight: 900, color: alpha(C.amber, 0.9), lineHeight: 1 }}>?</span>
      </div>
      {/* The plate */}
      <div style={{ position: 'absolute', left: width / 2 - 120, top: 16 + (1 - plate) * -26, opacity: plate }}>
        <PlateGlyph width={240} />
      </div>
      {/* The table */}
      <svg width={width} height={90} style={{ position: 'absolute', left: 0, top: 150 }} aria-hidden>
        <path d={`M 10 12 H ${width - 10}`} stroke={C.ink500} strokeWidth={8} strokeLinecap="round" />
        <path d={`M ${width * 0.18} 16 V 84 M ${width * 0.82} 16 V 84`} stroke={C.ink600} strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', left: 0, width, top: 190, textAlign: 'center', fontSize: 32, fontWeight: 800, color: C.amber, opacity: empty, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

/** A technical report: a title bar and a grid of cells (bars, never readable data). */
export function Report({ width = 300, height = 200, label, style }: { width?: number; height?: number; label: string; style?: CSSProperties }) {
  const rows = 4;
  const cols = 3;
  return (
    <div style={{ width, height, boxSizing: 'border-box', padding: '12px 16px', borderRadius: 12, border: `2px solid ${alpha(C.sky, 0.7)}`, background: alpha(C.ink850, 0.98), boxShadow: `0 14px 30px ${alpha('#000000', 0.4)}`, fontFamily: FONT.sans, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 800, color: C.sky, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={26} color={C.sky} strokeWidth={2.2} />
        {label}
      </div>
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 5 }}>
        {Array.from({ length: rows * cols }, (_, i) => (
          <div key={i} style={{ height: 24, borderRadius: 4, background: alpha(C.sky, i < cols ? 0.4 : 0.16 + 0.05 * ((i * 7) % 3)) }} />
        ))}
      </div>
    </div>
  );
}

/** The tray (bandeja): a flat slab with a handle at each end. */
export function Tray({ width = 360 }: { width?: number }) {
  return (
    <svg width={width} height={30} style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      <rect x={16} y={2} width={width - 32} height={16} rx={8} fill={alpha(C.text, 0.16)} stroke={C.text} strokeWidth={4} />
      <path d={`M 16 10 H 4 M ${width - 16} 10 H ${width - 4}`} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
}

/** The board's table: its chair, its label and the table line (the line sits 150 px under the top; the tray lands on it). */
export function BoardTable({ width = 520, label, style }: { width?: number; label: string; style?: CSSProperties }) {
  return (
    <div style={{ position: 'relative', width, height: 200, fontFamily: FONT.sans, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 70, opacity: 0.95 }}>
        <ChairGlyph size={120} color={C.text} />
      </div>
      <div style={{ position: 'absolute', left: -20, top: 14, width: 160, textAlign: 'center', fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{label}</div>
      <svg width={width - 150} height={90} style={{ position: 'absolute', left: 150, top: 110, overflow: 'visible' }} aria-hidden>
        <path d={`M 0 40 H ${width - 150}`} stroke={C.ink500} strokeWidth={8} strokeLinecap="round" />
        <path d={`M ${(width - 150) * 0.12} 44 V 90 M ${(width - 150) * 0.88} 44 V 90`} stroke={C.ink600} strokeWidth={8} strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** The guest book of Feedback, blank: lines with nothing on them and five empty stars. */
export function GuestBook({ width = 250, height = 230, stars = 5, style }: { width?: number; height?: number; stars?: number; style?: CSSProperties }) {
  return (
    <div style={{ position: 'relative', width, height, boxSizing: 'border-box', padding: '22px 22px 18px 44px', borderRadius: 14, border: `3px solid ${alpha(C.cyan, 0.6)}`, background: alpha(C.ink850, 0.98), boxShadow: `0 16px 36px ${alpha('#000000', 0.4)}`, ...style }}>
      <div style={{ position: 'absolute', left: 14, top: 22, bottom: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${alpha(C.cyan, 0.6)}` }} />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 3, marginTop: i === 0 ? 14 : 38, background: alpha(C.ink500, 0.8) }} />
      ))}
      <div style={{ marginTop: 28, display: 'flex', gap: 6 }}>
        {Array.from({ length: stars }, (_, i) => (
          <svg key={i} width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={alpha(C.cyan, 0.6)} strokeWidth={1.8} strokeLinejoin="round" aria-hidden>
            <path d="M12 3 L14.6 9 L21 9.6 L16.2 13.9 L17.6 20.3 L12 17 L6.4 20.3 L7.8 13.9 L3 9.6 L9.4 9 Z" />
          </svg>
        ))}
      </div>
    </div>
  );
}
