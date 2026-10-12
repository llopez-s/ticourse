import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';

/**
 * Small pieces of s05: the think prompt's two buttons, the test event's card and the next-step note.
 * Not positioned; every state is a 0–1 prop.
 */

/**
 * One of the two buttons under the engine's prompt. While the question is open both glow alike
 * (`glow`); `chosen` 1 = the answer (cyan: the control plane's piece), −1 = the other one steps back.
 */
export function OptionButton({ label, show, glow = 0, chosen = 0, size = 40 }: { label: string; show: number; glow?: number; chosen?: number; size?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const yes = clamp01(chosen);
  const no = clamp01(-chosen);
  const g = clamp01(glow) * (1 - yes) * (1 - no);
  const lit = Math.max(g, yes);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: Math.round(size * 1.75),
        padding: `0 ${Math.round(size * 0.9)}px`,
        boxSizing: 'border-box',
        borderRadius: size,
        border: `3px solid ${yes > 0.01 ? alpha(C.cyan, 0.6 + 0.4 * yes) : alpha('#94a3b8', 0.55 + 0.4 * g)}`,
        background: yes > 0.01 ? `linear-gradient(180deg, ${alpha(C.cyan, 0.24 * yes)} 0%, ${C.ink900} 100%)` : `linear-gradient(180deg, ${alpha(C.ink700, 0.9)} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 0 ${Math.round(8 + 26 * lit)}px ${alpha(yes > 0.01 ? C.cyan : '#e2e8f0', 0.08 + 0.3 * lit)}, 0 12px 26px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 820,
        color: yes > 0.5 ? '#cffafe' : C.textStrong,
        whiteSpace: 'nowrap',
        opacity: s * (1 - 0.6 * no),
        filter: no > 0.01 ? `saturate(${1 - 0.5 * no})` : undefined,
        transform: `translateY(${(1 - s) * 12}px) scale(${1 + 0.04 * yes - 0.04 * no})`,
      }}
    >
      {label}
    </div>
  );
}

/** The test event: a rose card, «evento de prueba · a los 10 min» over «EDR: malware en el portátil». */
export function EventCard({ head, line, width, show, lineShow = 1, glow = 0 }: { head: readonly string[]; line: string; width: number; show: number; lineShow?: number; glow?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const g = clamp01(glow);
  const ls = clamp01(lineShow);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.rose, 0.6 + 0.4 * g)}`,
        background: alpha(C.ink900, 0.95),
        boxShadow: `0 0 ${Math.round(10 + 28 * g)}px ${alpha(C.rose, 0.1 + 0.28 * g)}, 0 12px 26px ${alpha('#000000', 0.38)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 12}px)`,
      }}
    >
      <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', background: alpha(C.rose, 0.12), borderBottom: `2px solid ${alpha(C.rose, 0.3)}`, fontSize: 32, fontWeight: 800 }}>
        <span style={{ color: C.textStrong }}>{head[0]}</span>
        <span style={{ color: C.faint }}>·</span>
        <span style={{ color: '#fda4af' }}>{head[1]}</span>
      </div>
      <div style={{ height: 62, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', opacity: ls, transform: `translateX(${(1 - ls) * -10}px)` }}>
        <Icon name="alert" size={38} color={C.rose} strokeWidth={2.3} />
        <span style={{ fontSize: 38, fontWeight: 850, letterSpacing: -0.3, color: '#fda4af' }}>{line}</span>
      </div>
    </div>
  );
}

/**
 * The closing note: «siguiente paso · piloto con el ERP de pruebas · Seguridad · 11-12», in three lines
 * (the series' improvement strip, cyan: it is Seguridad's own plan). It lands with a short settle.
 */
export function PilotNote({ label, what, owner, day, show }: { label: string; what: string; owner: string; day: string; show: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 2,
        padding: '8px 22px 10px 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 ${Math.round(30 * s)}px ${alpha(C.cyan, 0.22 * s)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, s * 1.4),
        transform: `scale(${mix(1.12, 1, s)})`,
        transformOrigin: '0 50%',
      }}
    >
      <Row>
        <Icon name="flag" size={28} color={C.cyan} strokeWidth={2.2} />
        <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: 0.6, color: C.cyanSoft }}>{label}</span>
      </Row>
      <Row>
        <span style={{ fontSize: 36, fontWeight: 850, letterSpacing: -0.3, color: C.textStrong }}>{what}</span>
      </Row>
      <Row>
        <span style={{ fontSize: 30, fontWeight: 750, color: C.text }}>{owner}</span>
        <span style={{ fontSize: 30, fontWeight: 700, color: C.faint }}>·</span>
        <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 800, color: C.cyanSoft }}>{day}</span>
      </Row>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12, lineHeight: 1.2 }}>{children}</div>;
}
