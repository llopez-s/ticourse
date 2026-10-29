import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { OFFICES } from './data';

/**
 * The portal as a building with three numbered offices (address = building, port = office). In the plan
 * (`numbers` 0) it is just a lit building; in s06 (`numbers` 1) the floors show 443, 22 and 25 and only the
 * 443 has light. 22 and 25 are shown, never asked. No real portal screenshot and no padlock anywhere.
 */
export function Edificio({
  width = 300,
  height = 380,
  numbers = 0,
  glow = 0,
  lit = [1, 0, 0],
  sign,
  signGlow = 0,
  focusOffice,
  style,
}: {
  width?: number;
  height?: number;
  /** 0-1: windows become numbered offices. */
  numbers?: number;
  /** 0-1: outline glow (the voice is on the building). */
  glow?: number;
  /** Light of each office (443, 22, 25). */
  lit?: readonly [number, number, number] | readonly number[];
  /** Address plate above the roof (mono). */
  sign?: string;
  signGlow?: number;
  /** 0-1 emphasis of the office numbers (the voice says «el puerto es el despacho»). */
  focusOffice?: number;
  style?: CSSProperties;
}) {
  const roof = 18;
  const plate = sign ? 54 : 0;
  const base = 26;
  const floorH = (height - plate - roof - base) / 3;
  const numSize = Math.round(Math.min(floorH * 0.5, 56));
  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      {sign ? (
        <div
          style={{
            position: 'absolute',
            left: width / 2,
            top: 0,
            transform: 'translateX(-50%)',
            padding: '4px 18px',
            borderRadius: RADIUS.sm,
            border: `2px solid ${alpha(C.cyan, 0.45 + 0.5 * signGlow)}`,
            background: alpha(C.cyan, 0.08 + 0.14 * signGlow),
            boxShadow: signGlow > 0.01 ? `0 0 ${Math.round(28 * signGlow)}px ${alpha(C.cyan, 0.45 * signGlow)}` : undefined,
            fontFamily: FONT.mono,
            fontSize: 34,
            fontWeight: 700,
            color: C.textStrong,
            whiteSpace: 'nowrap',
          }}
        >
          {sign}
        </div>
      ) : null}
      {/* roof */}
      <div style={{ position: 'absolute', left: -8, right: -8, top: plate, height: roof, borderRadius: '10px 10px 2px 2px', background: C.ink600, border: `2px solid ${alpha(C.cyan, 0.2 + 0.6 * glow)}` }} />
      {/* body */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: plate + roof,
          bottom: base - 6,
          background: C.ink850,
          border: `2px solid ${alpha(C.cyan, 0.25 + 0.65 * glow)}`,
          borderTop: 'none',
          boxShadow: glow > 0.01 ? `0 0 ${Math.round(44 * glow)}px ${alpha(C.cyan, 0.3 * glow)}` : undefined,
        }}
      >
        {[0, 1, 2].map((i) => {
          const on = lit[i] ?? 0;
          return (
            <div key={i} style={{ position: 'absolute', left: 14, right: 14, top: i * floorH + 10, height: floorH - 18 }}>
              {/* plan view: three small windows */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 12, opacity: 1 - numbers }}>
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ flex: 1, borderRadius: 6, background: (i + j) % 3 === 0 ? alpha(C.cyan, 0.5) : alpha(C.ink500, 0.5) }} />
                ))}
              </div>
              {/* office view: a door with its number */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: numbers,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: on > 0.02 ? alpha(C.cyan, 0.14 + 0.18 * on) : alpha(C.ink900, 0.9),
                  border: `2px solid ${on > 0.02 ? alpha(C.cyan, 0.9) : C.ink600}`,
                  boxShadow: on > 0.02 ? `0 0 ${Math.round(34 * on)}px ${alpha(C.cyan, 0.5 * on)}` : undefined,
                  transform: `scale(${1 + 0.06 * (focusOffice ?? 0)})`,
                }}
              >
                <span style={{ fontFamily: FONT.mono, fontSize: numSize, fontWeight: 800, color: on > 0.02 ? C.textStrong : C.faint, letterSpacing: 1 }}>{OFFICES[i]}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* door at the base */}
      <div style={{ position: 'absolute', left: width / 2 - 30, bottom: 0, width: 60, height: base, borderRadius: '8px 8px 0 0', background: C.ink700, border: `2px solid ${C.ink500}`, borderBottom: 'none' }} />
    </div>
  );
}
