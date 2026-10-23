import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, fmtInt, progress } from '../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../engine/src/ui';
import { TONE } from '../../data/niveles';

/**
 * Pieces of the crossed delivery (s03). Nothing here is real data: the rows of the 4.000 list are
 * grey bars, each with an «IP» chip and no value; the trend chart has no numbers.
 */
export const SHEET = { w: 340, h: 380 } as const;
/** Width of the question column of a station. */
export const ASK_W = 298;

function SheetFrame({ tone, children, style }: { tone: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'relative',
        width: SHEET.w,
        height: SHEET.h,
        boxSizing: 'border-box',
        borderRadius: 20,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 20px 44px ${alpha('#000000', 0.4)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** The long list the board receives: «4.000 IP» on top, a pile of rows with no value below, scrolling. */
export function IpSheet({ f, countFrom }: { f: number; countFrom: number }) {
  const n = Math.round(4000 * progress(f, countFrom, 34, EASE.inOut));
  const scroll = (f * 0.9) % 62;
  const rows = [0, 1, 2, 3, 4, 5, 6];
  return (
    <SheetFrame tone={TONE.tactical}>
      <div
        style={{
          height: 76,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          borderBottom: `2px solid ${alpha(C.amber, 0.45)}`,
          background: alpha(C.amber, 0.1),
          fontSize: 44,
          fontWeight: 850,
          color: '#fcd34d',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {fmtInt(n)} IP
      </div>
      <div style={{ position: 'absolute', left: 0, top: 76, width: '100%', height: SHEET.h - 76, overflow: 'hidden' }}>
        {rows.map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 18,
              top: 14 + i * 62 - scroll,
              width: SHEET.w - 36 - 6,
              height: 46,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span
              style={{
                width: 62,
                height: 40,
                flexShrink: 0,
                borderRadius: 10,
                border: `2px solid ${alpha(C.cyan, 0.7)}`,
                background: alpha(C.cyan, 0.12),
                display: 'grid',
                placeItems: 'center',
                fontFamily: FONT.mono,
                fontSize: 26,
                fontWeight: 800,
                color: C.cyanSoft,
              }}
            >
              IP
            </span>
            <span style={{ flex: 1, height: 22, borderRadius: 11, background: alpha(C.muted, i % 2 ? 0.22 : 0.3) }} />
          </div>
        ))}
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 80, background: `linear-gradient(180deg, transparent 0%, ${C.ink900} 100%)` }} />
      </div>
    </SheetFrame>
  );
}

/** The sector trends assessment: a title and a chart with no numbers. */
export function TrendSheet({ f }: { f: number }) {
  const draw = progress(f, 8, 40, EASE.inOut);
  const line = 'M20 150 C60 140 80 120 112 112 C146 104 160 70 196 62 C230 54 262 40 300 24';
  const line2 = 'M20 120 C60 128 90 126 120 132 C160 140 200 124 240 128 C264 130 284 126 300 122';
  return (
    <SheetFrame tone={TONE.strategic}>
      <div style={{ padding: '16px 18px 0', fontSize: 26, fontWeight: 800, lineHeight: 1.2, color: C.textStrong }}>
        <div>evaluación de</div>
        <div>tendencias del sector</div>
      </div>
      <svg width={SHEET.w - 6} height={230} viewBox="0 0 320 190" style={{ position: 'absolute', left: 0, top: 128 }} aria-hidden>
        <path d="M14 8 V166 H312" fill="none" stroke={C.ink500} strokeWidth={3} strokeLinecap="round" />
        {[46, 86, 126].map((y) => (
          <path key={y} d={`M14 ${y} H312`} stroke={alpha(C.ink600, 0.6)} strokeWidth={2} strokeDasharray="5 6" />
        ))}
        <path d={line2} fill="none" stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} transform="translate(0 14)" />
        <path d={`${line} V166 H20 Z`} fill={alpha(C.emerald, 0.14 * draw)} transform="translate(0 14)" />
        <path d={line} fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} transform="translate(0 14)" />
      </svg>
    </SheetFrame>
  );
}

/** A question with no answer: the question and an empty, dashed answer slot under it. */
export function AskCard({ text, tone, at, frame, slotLabel }: { text: string; tone: string; at: number; frame: number; slotLabel?: string }) {
  const p = progress(frame, at, 16);
  if (p <= 0) return null;
  return (
    <div
      style={{
        width: ASK_W,
        boxSizing: 'border-box',
        padding: '14px 16px 16px',
        borderRadius: 18,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: alpha(tone, 0.08),
        fontFamily: FONT.sans,
        opacity: p,
        transform: `translateX(${(1 - p) * 30}px)`,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>{text}</div>
      <div
        style={{
          marginTop: 12,
          height: 46,
          borderRadius: 10,
          border: `2px dashed ${alpha(tone, 0.55)}`,
          display: 'grid',
          placeItems: 'center',
          fontSize: 26,
          fontWeight: 700,
          color: C.faint,
          whiteSpace: 'nowrap',
        }}
      >
        {slotLabel ?? ''}
      </div>
    </div>
  );
}

/** The empty cell where the SOC's rules would go. */
export function EmptyRulesCell({ at, frame }: { at: number; frame: number }) {
  const p = progress(frame, at, 16);
  if (p <= 0) return null;
  return (
    <div style={{ width: ASK_W, fontFamily: FONT.sans, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: C.faint, marginBottom: 8 }}>reglas</div>
      <div
        style={{
          height: 116,
          borderRadius: 16,
          border: `3px dashed ${alpha(TONE.tactical, 0.6)}`,
          background: alpha(TONE.tactical, 0.05),
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Icon name="shield" size={54} color={alpha(TONE.tactical, 0.35)} strokeWidth={1.6} />
      </div>
    </div>
  );
}

/** «Sello»: a question mark with no answer, stamped on a station. */
export function QuestionStamp({ at, frame, size = 150 }: { at: number; frame: number; size?: number }) {
  const p = progress(frame, at, 12, EASE.out);
  if (p <= 0) return null;
  const k = 1.5 - 0.5 * p; // lands from big to size
  return (
    <div style={{ width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: FONT.sans, opacity: p, transform: `rotate(-9deg) scale(${k})`, transformOrigin: '50% 50%' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          boxSizing: 'border-box',
          border: `6px double ${alpha(C.rose, 0.9)}`,
          background: alpha(C.rose, 0.1),
          display: 'grid',
          placeItems: 'center',
          fontSize: size * 0.68,
          fontWeight: 900,
          color: C.roseSoft,
          lineHeight: 1,
        }}
      >
        ?
      </div>
      <div style={{ width: size + 36, textAlign: 'center', fontSize: 28, fontWeight: 850, letterSpacing: 0.5, lineHeight: 1.05, color: C.roseSoft }}>sin respuesta</div>
    </div>
  );
}

/** A small document in flight between the envelopes. */
export function FlyingDoc({ tone, icon, size = 120 }: { tone: string; icon: IconName; size?: number }) {
  return (
    <div
      style={{
        width: size * 0.78,
        height: size,
        boxSizing: 'border-box',
        borderRadius: 12,
        border: `3px solid ${alpha(tone, 0.95)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.25)}, ${C.ink900})`,
        boxShadow: `0 10px 26px ${alpha('#000000', 0.5)}, 0 0 ${Math.round(size / 3)}px ${alpha(tone, 0.35)}`,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Icon name={icon} size={size * 0.42} color={tone} strokeWidth={2.2} />
    </div>
  );
}
