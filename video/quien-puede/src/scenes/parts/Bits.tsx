import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { enter } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { STAMP_PARTS } from './data';
import { CaseStamp } from './Labels';

/** The case stamp from s02 on: present from local frame −6 (scenes overlap 15 frames), `hide` 0–1 steps it aside (think prompts). */
export function SceneStamp({ frame, at = -6, hide = 0 }: { frame: number; at?: number; hide?: number }) {
  const e = enter(frame, at, { distance: 16, duration: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, ...e, opacity: e.opacity * (1 - clamp01(hide)) }}>
      <CaseStamp parts={STAMP_PARTS} />
    </div>
  );
}

/** A big label with an optional smaller line under it (the rótulos of the scenes). */
export function Rotulo({ children, sub, tone = C.textStrong, size = 56, weight = 0, style }: { children: ReactNode; sub?: ReactNode; tone?: string; size?: number; weight?: number; style?: CSSProperties }) {
  const w = clamp01(weight);
  return (
    <div style={{ fontFamily: FONT.sans, opacity: w, transform: `translateY(${(1 - w) * 18}px)`, whiteSpace: 'nowrap', ...style }}>
      <div style={{ fontSize: size, fontWeight: 850, letterSpacing: -1, lineHeight: 1.1, color: tone }}>{children}</div>
      {sub ? <div style={{ fontSize: Math.round(size * 0.6), fontWeight: 700, color: C.muted, marginTop: 8, lineHeight: 1.15 }}>{sub}</div> : null}
    </div>
  );
}

/**
 * The two buttons of a think prompt («Escritura para todos» / «Que te metan en Mantenimiento»). `answer` is the index of
 * the right one; `reveal` 0–1 turns it emerald with a check and the other amber (the «dar de más» option), dimmed.
 * Put them LOW in the stage: the engine's think card owns stage-local y 0–230 while it counts down.
 */
export function ChoiceButtons({
  items,
  answer,
  reveal = 0,
  show = 1,
  width = 760,
  size = 44,
  gap = 22,
}: {
  items: readonly string[];
  answer: number;
  reveal?: number;
  show?: number;
  width?: number;
  size?: number;
  gap?: number;
}) {
  const s = clamp01(show);
  const r = clamp01(reveal);
  return (
    <div style={{ display: 'grid', gap, width, opacity: s, transform: `translateY(${(1 - s) * 22}px)` }}>
      {items.map((text, i) => {
        const right = i === answer;
        const tone = right ? C.emerald : C.amber;
        const t = r > 0.01 ? tone : C.cyan;
        return (
          <div
            key={text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              minHeight: size * 2,
              boxSizing: 'border-box',
              padding: '0 30px',
              borderRadius: RADIUS.lg,
              border: `${r > 0.3 && right ? 4 : 3}px solid ${alpha(t, r > 0.01 ? (right ? 0.95 : 0.7) : 0.6)}`,
              background: alpha(t, 0.1 + (right ? 0.1 * r : 0)),
              boxShadow: right && r > 0.02 ? `0 0 ${Math.round(34 * r)}px ${alpha(C.emerald, 0.4 * r)}` : undefined,
              fontFamily: FONT.sans,
              fontSize: size,
              fontWeight: 800,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              opacity: right ? 1 : 1 - 0.3 * r,
            }}
          >
            <span style={{ width: size * 1.1, height: size * 1.1, borderRadius: size * 0.55, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(t, 0.2), border: `3px solid ${alpha(t, 0.8)}`, fontSize: size * 0.7 }}>
              {r > 0.3 ? <Icon name={right ? 'check' : 'alert'} size={size * 0.7} color={t} strokeWidth={2.8} /> : String.fromCharCode(65 + i)}
            </span>
            {text}
          </div>
        );
      })}
    </div>
  );
}

/**
 * One row of the process list (the style of the EDR tree of V1, none of its data): icon, executable name, and the three
 * facts s06 rotulates one by one: the PID, the account it runs as, and its parent. `focus` brightens the row;
 * `pid` / `account` / `parent` (0–1) light each chip.
 */
export function ProcessRow({
  name,
  pid,
  account,
  parent,
  width = 1100,
  focus = 0,
  pidOn = 0,
  accountOn = 0,
  parentOn = 0,
}: {
  name: string;
  pid: string;
  account: string;
  parent: string;
  width?: number;
  focus?: number;
  pidOn?: number;
  accountOn?: number;
  parentOn?: number;
}) {
  const f = clamp01(focus);
  const chip = (label: string, value: string, tone: string, on: number, mono = true) => {
    const o = clamp01(on);
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          height: 56,
          padding: '0 20px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(tone, 0.4 + 0.55 * o)}`,
          background: alpha(tone, 0.06 + 0.16 * o),
          boxShadow: o > 0.02 ? `0 0 ${Math.round(24 * o)}px ${alpha(tone, 0.35 * o)}` : undefined,
          fontSize: 32,
          fontWeight: 750,
          color: C.text,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: C.muted, fontWeight: 650 }}>{label}</span>
        <span style={{ fontFamily: mono ? FONT.mono : FONT.sans, color: C.textStrong, fontWeight: 800 }}>{value}</span>
      </span>
    );
  };
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '18px 24px',
        borderRadius: RADIUS.lg,
        background: f > 0.02 ? `linear-gradient(90deg, ${alpha(C.sky, 0.08 + 0.1 * f)}, ${alpha(C.ink850, 0.96)} 75%)` : alpha(C.ink850, 0.94),
        border: `${f > 0.3 ? 3 : 2}px solid ${f > 0.02 ? alpha(C.sky, 0.4 + 0.55 * f) : C.ink600}`,
        boxShadow: f > 0.02 ? `0 0 ${Math.round(34 * f)}px ${alpha(C.sky, 0.3 * f)}` : undefined,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 60, height: 60, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.sky, 0.14), border: `2px solid ${alpha(C.sky, 0.7)}` }}>
          <Icon name="app" size={36} color={C.sky} />
        </div>
        <span style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong, letterSpacing: -1 }}>{name}</span>
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'nowrap' }}>
        {chip('PID', pid, C.sky, pidOn)}
        {chip('cuenta', account, C.cyan, accountOn)}
        {chip('padre:', parent, C.muted, parentOn, false)}
      </div>
    </div>
  );
}
