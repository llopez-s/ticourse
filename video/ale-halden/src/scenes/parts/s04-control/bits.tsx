import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, dimStyle } from '../../../../../engine/src/ui';

/** px per 1.000 € — the one scale of the three bars. */
export const PX = 13;
export const BAR_H = 52;
export const TITLE_H = 40;
/** Bar's top inside a row (the title sits above). */
export const BAR_OFF = 46;
export const ROW_W = 1120;

/** Dark halo so the yardstick line never fights the letters it passes behind. */
const HALO = `0 0 6px ${C.ink950}, 0 0 10px ${C.ink950}, 0 0 14px ${C.ink950}`;

/**
 * One annual bar: a title («name · amount € / año») over a bar of `k` thousand euros. `nameIn` / `amountIn` fade the two
 * halves of the title on their words, `grow` 0–1 is the bar's length. `over` (thousands) marks where the ALE's yardstick
 * sits: the part of the bar beyond it can be lit (`overGlow`) and labelled.
 */
export function BarRow({
  top,
  tone,
  name,
  amount,
  k,
  nameIn,
  amountIn,
  grow,
  over,
  overGlow = 0,
  overLabel,
  dim = 0,
}: {
  top: number;
  tone: string;
  name: string;
  amount: string;
  k: number;
  nameIn: number;
  amountIn: number;
  grow: number;
  over?: number;
  overGlow?: number;
  overLabel?: string;
  dim?: number;
}) {
  const w = k * PX * grow;
  const overX = over !== undefined ? over * PX : 0;
  const overW = over !== undefined ? Math.max(0, w - overX) : 0;
  return (
    <div style={{ position: 'absolute', left: 0, top, width: ROW_W, height: BAR_OFF + BAR_H, ...dimStyle(dim, nameIn) }}>
      <div
        style={{
          height: TITLE_H,
          lineHeight: `${TITLE_H}px`,
          fontFamily: FONT.sans,
          fontSize: 36,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          color: C.text,
          textShadow: HALO,
          transform: `translateX(${(1 - nameIn) * -14}px)`,
        }}
      >
        {name}
        <span style={{ opacity: amountIn }}>
          <span style={{ color: C.faint }}>{' · '}</span>
          <span style={{ color: tone, fontWeight: 850 }}>{amount}</span>
        </span>
      </div>
      {w > 3 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: BAR_OFF,
            width: w,
            height: BAR_H,
            boxSizing: 'border-box',
            borderRadius: 12,
            background: `linear-gradient(90deg, ${alpha(tone, 0.88)}, ${alpha(tone, 0.6)})`,
            border: `2px solid ${tone}`,
            boxShadow: `0 0 24px ${alpha(tone, 0.22)}`,
          }}
        />
      ) : null}
      {overW > 3 && overGlow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: overX,
            top: BAR_OFF,
            width: overW,
            height: BAR_H,
            boxSizing: 'border-box',
            borderRadius: '0 12px 12px 0',
            background: `repeating-linear-gradient(135deg, ${alpha(tone, 0.98)} 0 12px, ${alpha('#f59e0b', 0.8)} 12px 24px)`,
            border: `2px solid ${C.textStrong}`,
            borderLeft: 'none',
            boxShadow: `0 0 ${Math.round(34 * overGlow)}px ${alpha(tone, 0.6 * overGlow)}`,
            opacity: overGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {overLabel ? (
            <span
              style={{
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 850,
                color: C.ink950,
                background: alpha(tone, 0.96),
                padding: '1px 14px',
                borderRadius: 8,
                whiteSpace: 'nowrap',
              }}
            >
              {overLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** A two-line verdict with its icon (the right column's top slot). */
export function Verdict({
  lines,
  tone,
  icon,
  show,
  style,
}: {
  lines: readonly [string, string];
  tone: string;
  icon: 'check' | 'x';
  show: number;
  style?: CSSProperties;
}) {
  if (show < 0.01) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: show,
        transform: `translateY(${(1 - show) * 14}px)`,
        ...style,
      }}
    >
      <span
        style={{
          width: 54,
          height: 54,
          flexShrink: 0,
          borderRadius: 27,
          display: 'grid',
          placeItems: 'center',
          border: `4px solid ${tone}`,
          background: alpha(tone, 0.14),
        }}
      >
        <Icon name={icon} size={32} color={tone} strokeWidth={3} />
      </span>
      <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, lineHeight: 1.14, color: tone === C.emerald ? '#a7f3d0' : '#fde68a', whiteSpace: 'nowrap' }}>
        <span style={{ display: 'block' }}>{lines[0]}</span>
        <span style={{ display: 'block' }}>{lines[1]}</span>
      </span>
    </div>
  );
}

/** «recomendación al comité · no contratado»: a dashed seal, slightly tilted. */
export function Seal({ lines, show, style }: { lines: readonly [string, string]; show: number; style?: CSSProperties }) {
  if (show < 0.01) return null;
  const p = Math.min(1, show);
  return (
    <div
      style={{
        display: 'inline-block',
        opacity: p,
        transform: `rotate(-2deg) scale(${1.25 - 0.25 * p})`,
        transformOrigin: 'left center',
        border: `4px dashed ${alpha(C.emerald, 0.9)}`,
        borderRadius: RADIUS.md,
        background: alpha(C.emeraldDeep, 0.35),
        padding: '10px 22px',
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 800,
        lineHeight: 1.2,
        color: '#a7f3d0',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ display: 'block' }}>{lines[0]}</span>
      <span style={{ display: 'block', color: C.text, fontWeight: 650 }}>{lines[1]}</span>
    </div>
  );
}

/** A phone with its case and a caption under it. */
export function CaseCard({ children, label, tone, labelIn }: { children: ReactNode; label: string; tone: string; labelIn: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {children}
      <span
        style={{
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 750,
          color: tone,
          whiteSpace: 'nowrap',
          opacity: labelIn,
        }}
      >
        {label}
      </span>
    </div>
  );
}
