import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/**
 * The dangerous-goods declaration sheet: the one document the whole video talks about (concepts 1 and 2). A dark paper
 * card with a cyan header «declaración de mercancías peligrosas», a hazard diamond (no number, no class) and three
 * lines «qué trae · cuánto · adónde va» with blank value bars: no shipping line, ship or figures. Only s02 writes a
 * value («1.000 kg» that turns into «100 kg», with a rose mark). `mini` drops every word (icons, s04's walking copy).
 */

/** Native size; everything scales with `width`. */
export const SHEET = { w: 400, h: 480 } as const;
export const sheetHeight = (width: number) => (width * SHEET.h) / SHEET.w;

export const SHEET_TITLE = ['declaración de', 'mercancías', 'peligrosas'] as const;
export const SHEET_LINES = ['qué trae', 'cuánto', 'adónde va'] as const;

/** The four questions around the sheet, one icon each, the same in s02, s08 and the poster. */
export const QUESTIONS: readonly { icon: IconName; q: string; term: string }[] = [
  { icon: 'eye', q: '¿Quién la lee?', term: 'CONFIDENTIALITY' },
  { icon: 'alert', q: '¿La ha tocado alguien?', term: 'INTEGRITY' },
  { icon: 'clock', q: '¿Está cuando hace falta?', term: 'AVAILABILITY' },
  { icon: 'user', q: '¿Puede negar que la mandó?', term: 'NON-REPUDIATION' },
];

/** A generic hazard diamond: a square on its corner with a bar, no number or class. */
function Hazard({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block', flexShrink: 0 }}>
      <rect x={8} y={8} width={24} height={24} rx={2.5} transform="rotate(45 20 20)" fill={alpha(C.amber, 0.16)} stroke={C.amber} strokeWidth={2.4} />
      <path d="M20 12.5v10" stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
      <circle cx={20} cy={27} r={1.9} fill={C.amber} />
    </svg>
  );
}

export interface KgState {
  /** 0–1: «1.000 kg» written in «cuánto». */
  show: number;
  /** 0–1: it turns into «100 kg». */
  flip: number;
  /** 0–1: the rose mark that jumps next to it. */
  mark: number;
}

export function Sheet({
  width = SHEET.w,
  glow = 0,
  dim = 0,
  mini = false,
  kg,
  lineOn,
  style,
}: {
  width?: number;
  /** 0–1 cyan glow around the paper (the voice is on it). */
  glow?: number;
  /** 0–1 fade of the whole sheet. */
  dim?: number;
  mini?: boolean;
  kg?: KgState;
  /** 0–1 per line: how lit each of the three lines is (default all lit). */
  lineOn?: readonly number[];
  style?: CSSProperties;
}) {
  const k = width / SHEET.w;
  const h = sheetHeight(width);
  const g = clamp01(glow);
  const px = (n: number) => Math.round(n * k);

  const row = (i: number, label: string, value: ReactNode) => {
    const on = lineOn ? clamp01(lineOn[i]) : 1;
    return (
      <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: px(8), opacity: 0.45 + 0.55 * on }}>
        {mini ? null : <div style={{ fontSize: px(32), fontWeight: 700, color: C.muted, lineHeight: 1 }}>{label}</div>}
        <div style={{ position: 'relative', height: px(mini ? 26 : 50) }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: px(10),
              background: alpha(C.cyan, 0.07 + 0.05 * on),
              border: `${Math.max(1, px(2))}px solid ${alpha(C.cyan, 0.2 + 0.2 * on)}`,
            }}
          />
          {value}
        </div>
      </div>
    );
  };

  const kgValue =
    kg && !mini && kg.show > 0.01 ? (
      <div style={{ position: 'absolute', left: px(16), top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: px(14), opacity: clamp01(kg.show) }}>
        <div style={{ position: 'relative', fontFamily: FONT.mono, fontSize: px(34), fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1 }}>
          <span style={{ color: C.textStrong, opacity: 1 - clamp01(kg.flip) }}>1.000 kg</span>
          <span style={{ position: 'absolute', left: 0, top: 0, color: C.roseSoft, opacity: clamp01(kg.flip), transform: `translateY(${(1 - clamp01(kg.flip)) * -10}px)` }}>
            100 kg
          </span>
        </div>
        {kg.mark > 0.01 ? (
          <div
            style={{
              width: px(40),
              height: px(40),
              borderRadius: px(20),
              display: 'grid',
              placeItems: 'center',
              background: C.rose,
              boxShadow: `0 0 ${px(18)}px ${alpha(C.rose, 0.6)}`,
              transform: `scale(${0.4 + 0.6 * clamp01(kg.mark)}) translateY(${(1 - clamp01(kg.mark)) * -14}px)`,
              opacity: clamp01(kg.mark),
            }}
          >
            <Icon name="alert" size={px(26)} color={C.ink950} strokeWidth={2.4} />
          </div>
        ) : null}
      </div>
    ) : null;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: px(22),
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
        border: `${Math.max(2, px(3))}px solid ${alpha(C.cyan, 0.45 + 0.45 * g)}`,
        boxShadow: `0 ${px(24)}px ${px(60)}px ${alpha('#000000', 0.45)}${g > 0.02 ? `, 0 0 ${px(44 * g)}px ${alpha(C.cyan, 0.32 * g)}` : ''}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        opacity: 1 - clamp01(dim),
        ...style,
      }}
    >
      {/* header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: px(14),
          height: px(mini ? 70 : 128),
          padding: `0 ${px(22)}px`,
          background: alpha(C.cyan, 0.14),
          borderBottom: `${Math.max(1, px(2))}px solid ${alpha(C.cyan, 0.35)}`,
        }}
      >
        <Hazard size={px(mini ? 48 : 56)} />
        {mini ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: px(10) }}>
            <div style={{ height: px(12), width: '70%', borderRadius: px(6), background: alpha(C.cyanSoft, 0.7) }} />
            <div style={{ height: px(12), width: '92%', borderRadius: px(6), background: alpha(C.cyanSoft, 0.7) }} />
          </div>
        ) : (
          <div style={{ fontSize: px(31), fontWeight: 850, lineHeight: 1.04, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <div>{SHEET_TITLE[0]}</div>
            <div style={{ color: C.cyanSoft }}>{SHEET_TITLE[1]}</div>
            <div style={{ color: C.cyanSoft }}>{SHEET_TITLE[2]}</div>
          </div>
        )}
      </div>
      {/* the three lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: px(mini ? 34 : 22), padding: `${px(mini ? 40 : 26)}px ${px(26)}px 0` }}>
        {SHEET_LINES.map((l, i) => row(i, l, i === 1 ? kgValue : null))}
      </div>
    </div>
  );
}

/** A round icon badge for one of the four questions (cyan = the sheet's side). */
export function QuestionBadge({ icon, size, on = 1 }: { icon: IconName; size: number; on?: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        background: alpha(C.cyan, 0.08 + 0.14 * o),
        border: `${Math.max(2, Math.round(size / 26))}px solid ${alpha(C.cyan, 0.4 + 0.5 * o)}`,
        boxShadow: o > 0.05 ? `0 0 ${Math.round(size * 0.35 * o)}px ${alpha(C.cyan, 0.3 * o)}` : undefined,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.56)} color={o > 0.5 ? C.cyanSoft : C.cyan} strokeWidth={2} />
    </div>
  );
}

/**
 * The sheet with its four question badges around it (one per corner): s08's rule-1 icon and the poster. `width` is the
 * whole group's width; the sheet takes the middle.
 */
export function SheetWithQuestions({ width, glow = 0, mini = true }: { width: number; glow?: number; mini?: boolean }) {
  const sheetW = width * 0.56;
  const sh = sheetHeight(sheetW);
  const badge = Math.round(width * 0.24);
  const height = sh + badge * 0.4;
  const pos = [
    { left: 0, top: 0 },
    { left: width - badge, top: 0 },
    { left: 0, top: height - badge },
    { left: width - badge, top: height - badge },
  ];
  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ position: 'absolute', left: (width - sheetW) / 2, top: (height - sh) / 2 }}>
        <Sheet width={sheetW} mini={mini} glow={glow} />
      </div>
      {QUESTIONS.map((q, i) => (
        <div key={q.icon} style={{ position: 'absolute', ...pos[i] }}>
          <QuestionBadge icon={q.icon} size={badge} on={0.4 + 0.6 * glow} />
        </div>
      ))}
    </div>
  );
}
