import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { DC_LABEL } from '../../../data/s01-hook';

/** Design size of the CPD box (the scene scales it). */
export const CPD = { w: 340, h: 380 } as const;
/** Design diameter of the clock. */
export const CLOCK_D = 230;

const UNITS = 6;

/** Deterministic 0–1 hash. */
function hash(n: number): number {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * The one box «CPD» (s01): a server cabinet seen from the front, sky (infrastructure), its units' LEDs blinking
 * slowly. `lit` 1 = running; 0 = the power is gone: LEDs off and the cabinet at half light. `dark` 0–1 turns the
 * edge rose (the disaster). `outline` 0–1 draws only a dashed slot (before the voice names it). No second box.
 */
export function CpdBox({ frame, lit = 1, dark = 0, outline = 0 }: { frame: number; lit?: number; dark?: number; outline?: number }) {
  const L = clamp01(lit);
  const D = clamp01(dark);
  const O = clamp01(outline);
  const edge = D > 0.5 ? alpha(C.rose, 0.55 + 0.35 * D) : alpha(C.sky, 0.45 + 0.4 * L);
  const unitTop = 104;
  const unitH = 38;
  const unitGap = 6;
  return (
    <div style={{ position: 'relative', width: CPD.w, height: CPD.h, fontFamily: FONT.sans }}>
      {/* the waiting slot */}
      {O > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `3px dashed ${C.ink600}`,
            opacity: O,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px solid ${edge}`,
          background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
          boxShadow:
            D > 0.02
              ? `0 0 ${Math.round(40 * D)}px ${alpha(C.rose, 0.3 * D)}`
              : `0 0 ${Math.round(36 * L)}px ${alpha(C.sky, 0.22 * L)}, 0 24px 60px ${alpha('#000000', 0.35)}`,
          opacity: 1 - O,
          overflow: 'hidden',
        }}
      >
        {/* label strip */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 88,
            display: 'grid',
            placeItems: 'center',
            borderBottom: `2px solid ${alpha(C.sky, 0.25 + 0.25 * L)}`,
            background: alpha(C.sky, 0.04 + 0.08 * L),
          }}
        >
          <span style={{ fontFamily: FONT.mono, fontSize: 60, fontWeight: 800, letterSpacing: 6, color: D > 0.5 ? C.roseSoft : '#7dd3fc' }}>{DC_LABEL}</span>
        </div>
        {/* server units */}
        {Array.from({ length: UNITS }, (_, i) => {
          const y = unitTop + i * (unitH + unitGap);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 26,
                top: y,
                width: CPD.w - 52,
                height: unitH,
                boxSizing: 'border-box',
                borderRadius: 6,
                border: `2px solid ${C.ink600}`,
                background: C.ink850,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0 14px',
              }}
            >
              {[0, 1, 2].map((k) => {
                const seed = i * 3 + k;
                // a slow, irregular blink (≤ 1 Hz)
                const phase = Math.floor((frame + hash(seed) * 40) / (24 + Math.round(hash(seed + 7) * 26)));
                const on = (hash(seed * 13 + phase) > 0.3 ? 1 : 0.35) * L;
                const col = k === 0 ? C.emerald : C.sky;
                return (
                  <span
                    key={k}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 6,
                      background: on > 0.02 ? alpha(col, 0.25 + 0.75 * on) : C.ink700,
                      boxShadow: on > 0.5 ? `0 0 8px ${alpha(col, 0.7 * on)}` : undefined,
                    }}
                  />
                );
              })}
              <div style={{ flex: 1 }} />
              {[0, 1, 2, 3, 4].map((k) => (
                <span key={k} style={{ width: 4, height: 18, borderRadius: 2, background: C.ink700 }} />
              ))}
            </div>
          );
        })}
        {/* half light */}
        {L < 0.999 ? <div style={{ position: 'absolute', left: 0, right: 0, top: 90, bottom: 0, background: alpha(C.ink950, 0.5 * (1 - L)) }} /> : null}
        {D > 0.001 ? <div style={{ position: 'absolute', inset: 0, background: alpha(C.rose, 0.07 * D) }} /> : null}
      </div>
    </div>
  );
}

/**
 * A clock with no numbers and no hour: twelve ticks and two hands. `minutes` is the minute hand's angle in turns
 * (the hour hand follows at 1/12). `glow` 0–1 lights the ring amber (time is the risk). Nothing on it reads as a time.
 */
export function Clock({ minutes, glow = 0 }: { minutes: number; glow?: number }) {
  const r = CLOCK_D / 2;
  const G = clamp01(glow);
  const ring = G > 0.02 ? alpha(C.amber, 0.45 + 0.5 * G) : alpha(C.muted, 0.6);
  const minA = minutes * 360;
  const hourA = (minutes / 12) * 360 + 300;
  return (
    <svg
      width={CLOCK_D}
      height={CLOCK_D}
      viewBox={`0 0 ${CLOCK_D} ${CLOCK_D}`}
      style={{ display: 'block', overflow: 'visible', filter: G > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * G)}px ${alpha(C.amber, 0.45 * G)})` : undefined }}
    >
      <circle cx={r} cy={r} r={r - 5} fill={C.ink850} stroke={ring} strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const long = i % 3 === 0;
        const r1 = r - 18;
        const r2 = r - (long ? 40 : 30);
        return (
          <line
            key={i}
            x1={r + Math.sin(a) * r1}
            y1={r - Math.cos(a) * r1}
            x2={r + Math.sin(a) * r2}
            y2={r - Math.cos(a) * r2}
            stroke={long ? C.text : C.faint}
            strokeWidth={long ? 6 : 4}
            strokeLinecap="round"
          />
        );
      })}
      <line x1={r} y1={r} x2={r} y2={r - 50} stroke={C.text} strokeWidth={9} strokeLinecap="round" transform={`rotate(${hourA} ${r} ${r})`} />
      <line x1={r} y1={r + 12} x2={r} y2={r - 78} stroke={G > 0.3 ? C.amber : C.textStrong} strokeWidth={5} strokeLinecap="round" transform={`rotate(${minA} ${r} ${r})`} />
      <circle cx={r} cy={r} r={9} fill={G > 0.3 ? C.amber : C.textStrong} />
    </svg>
  );
}
