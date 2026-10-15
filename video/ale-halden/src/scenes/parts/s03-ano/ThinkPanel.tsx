import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { THINK } from '../../../data/s03-ano';

export const PANEL_W = 1440;
export const PANEL_H = 420;

const BTN_W = 360;
const BTN_H = 104;
const BTN_X = [466, 906] as const;
const ROW_Y = 172;

/** Frames (scene-local) at which each piece of the think panel arrives. */
export type ThinkTimes = {
  panel: number;
  tag: number;
  ale: number;
  aro: number;
  buttons: number;
  back: number;
  rule: number;
  trap: number;
};

/**
 * The think prompt's panel, drawn LOW so the engine's prompt owns the top band. Until `back` the two buttons are
 * identical (no hint of the answer); on `back` 12.000 lights emerald with «36.000 ÷ 3» and «hacia atrás se
 * divide», and 108.000 turns rose as the multiplication trap.
 */
export function ThinkPanel({ frame, t }: { frame: number; t: ThinkTimes }) {
  const e = enter(frame, t.panel, { distance: 40, duration: 22 });
  const tag = progress(frame, t.tag, 14);
  const ale = progress(frame, t.ale, 14);
  const aro = progress(frame, t.aro, 14);
  const btn = progress(frame, t.buttons, 16);
  const good = progress(frame, t.back, 14, EASE.inOut);
  const rule = progress(frame, t.rule, 14);
  const trap = progress(frame, t.trap, 14, EASE.inOut);

  const button = (i: 0 | 1) => {
    const win = i === 0 ? good : 0;
    const bad = i === 1 ? trap : 0;
    const tone = i === 0 ? C.emerald : C.rose;
    const k = i === 0 ? win : bad;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: BTN_X[i],
          top: ROW_Y,
          width: BTN_W,
          height: BTN_H,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px solid ${k > 0.01 ? alpha(tone, 0.45 + 0.55 * k) : alpha(C.cyan, 0.65)}`,
          background: k > 0.01 ? alpha(i === 0 ? C.emeraldDeep : C.roseDeep, 0.35 + 0.5 * k) : alpha(C.ink800, 0.95),
          boxShadow: win > 0.02 ? `0 0 ${Math.round(34 * win)}px ${alpha(C.emerald, 0.4 * win)}` : undefined,
          display: 'grid',
          placeItems: 'center',
          fontFamily: FONT.mono,
          fontSize: 66,
          fontWeight: 800,
          color: k > 0.5 ? (i === 0 ? '#a7f3d0' : '#fda4af') : C.textStrong,
          opacity: btn,
          transform: `translateY(${(1 - btn) * 16}px) scale(${1 + 0.04 * win})`,
        }}
      >
        <span style={{ position: 'relative' }}>
          {i === 0 ? '12.000' : '108.000'}
          {i === 1 && bad > 0.02 ? (
            <span
              style={{
                position: 'absolute',
                left: -8,
                top: '52%',
                height: 6,
                width: `${Math.round(116 * bad)}%`,
                background: C.rose,
                borderRadius: 3,
                transform: 'rotate(-4deg)',
                transformOrigin: 'left center',
              }}
            />
          ) : null}
        </span>
      </div>
    );
  };

  const under = (i: 0 | 1) => {
    const p = i === 0 ? progress(frame, t.back + 6, 12) : trap;
    const text = i === 0 ? THINK.goodSub : THINK.trapSub;
    return (
      <div
        key={`u${i}`}
        style={{
          position: 'absolute',
          left: BTN_X[i] + BTN_W / 2 - 320,
          top: ROW_Y + BTN_H + 10,
          width: 640,
          textAlign: 'center',
          fontFamily: i === 0 ? FONT.mono : FONT.sans,
          fontSize: i === 0 ? 34 : 30,
          fontWeight: i === 0 ? 700 : 750,
          color: i === 0 ? '#6ee7b7' : '#fda4af',
          whiteSpace: 'nowrap',
          opacity: p,
          transform: `translateY(${(1 - p) * 8}px)`,
        }}
      >
        {text}
      </div>
    );
  };

  const answered = progress(frame, t.back + 4, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: PANEL_W,
        height: PANEL_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.amber, 0.7)}`,
        background: C.ink900,
                fontFamily: FONT.sans,
        opacity: e.opacity,
        transform: e.transform,
      }}
    >
      {/* «otro riesgo · ejemplo · no es R-014» */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center', opacity: tag }}>
        <span
          style={{
            padding: '4px 22px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.amber, 0.8)}`,
            background: alpha(C.amberDeep, 0.5),
            fontSize: 32,
            fontWeight: 750,
            color: '#fde68a',
            whiteSpace: 'nowrap',
          }}
        >
          {THINK.tag}
        </span>
      </div>
      {/* «ALE 36.000 · ARO 3» */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 80,
          display: 'flex',
          justifyContent: 'center',
          gap: 26,
          fontSize: 62,
          fontWeight: 850,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          lineHeight: 1.15,
        }}
      >
        <span style={{ opacity: ale, transform: `translateY(${(1 - ale) * 10}px)` }}>
          <span style={{ color: C.violet }}>ALE</span> 36.000
        </span>
        <span style={{ color: C.muted, opacity: Math.min(ale, aro) }}>·</span>
        <span style={{ opacity: aro, transform: `translateY(${(1 - aro) * 10}px)` }}>
          <span style={{ color: C.violet }}>ARO</span> 3
        </span>
      </div>
      {/* the unknown, then the answer */}
      <div
        style={{
          position: 'absolute',
          left: 116,
          top: ROW_Y,
          width: 320,
          height: BTN_H,
          display: 'flex',
          alignItems: 'center',
          fontFamily: FONT.mono,
          fontSize: 40,
          fontWeight: 800,
          whiteSpace: 'nowrap',
          opacity: btn,
        }}
      >
        <span style={{ position: 'relative', color: C.violet }}>
          <span style={{ opacity: 1 - answered }}>{THINK.ask}</span>
          <span style={{ position: 'absolute', left: 0, top: 0, color: '#6ee7b7', opacity: answered }}>{THINK.answered}</span>
        </span>
      </div>
      {button(0)}
      {button(1)}
      {under(0)}
      {under(1)}
      {/* the rule */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: ROW_Y + BTN_H + 66,
          textAlign: 'center',
          fontSize: 48,
          fontWeight: 850,
          color: '#6ee7b7',
          whiteSpace: 'nowrap',
          opacity: rule,
          transform: `translateY(${(1 - rule) * 10}px)`,
        }}
      >
        {THINK.rule}
      </div>
    </div>
  );
}
