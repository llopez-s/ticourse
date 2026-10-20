import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon, type IconName, clamp01 } from '../../../../../engine/src/ui';
import { DECISION, STRIPS } from '../../../data/s04-funcion';
import { Arrow } from '../Arrow';
import { LOGS_OUT } from './FunctionBeat';

const X = 740;
const W = 988;
const Y = { yours: 92, blind: 196, logs: 300, decision: 430 } as const;
const H = 84;

function Strip({ text, icon, tone, on, base, top, frame, at }: { text: string; icon: IconName; tone: string; on: number; base: number; top: number; frame: number; at: number }) {
  if (frame < at - 6) return null;
  const e = enter(frame, at - 2, { distance: 16 });
  const o = clamp01(on);
  return (
    <div
      style={{
        position: 'absolute',
        left: X,
        top,
        width: W,
        height: H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 26px',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.35 + 0.55 * o)}`,
        background: alpha(tone, 0.04 + 0.12 * o),
        boxShadow: o > 0.05 ? `0 0 ${Math.round(28 * o)}px ${alpha(tone, 0.25 * o)}` : undefined,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: e.opacity * base,
        transform: e.transform,
      }}
    >
      <Icon name={icon} size={38} color={tone} />
      <span style={{ fontSize: 38, fontWeight: 800, color: o > 0.4 ? C.textStrong : C.text }}>{text}</span>
    </div>
  );
}

export interface StripsTimes {
  yours: number;
  blind: number;
  logs: number;
  decision: number;
  lockin: number;
}

/**
 * s04's right column: «tuyo: el código, los permisos y los datos» (half-lit, not developed) on `yours`; on «Pero» the
 * amber «sin agente · sin captura de tráfico»; on `logs` the highlighted «los registros del proveedor», fed by a
 * dashed line of log ticks from the provider's frame; on `decision` they go, by an arrow, to Seguridad's console:
 * «sus registros, a la consola de Seguridad desde el primer día».
 */
export function Strips({ frame, t }: { frame: number; t: StripsTimes }) {
  const logsOn = progress(frame, t.logs, 12);
  const decOn = progress(frame, t.decision, 12);
  const calm = 1 - 0.35 * progress(frame, t.lockin, 14);
  const feed = progress(frame, t.logs - 4, 18, EASE.inOut);
  const logsY = Y.logs + H / 2;
  // Log ticks travelling along the feed line once it is drawn.
  const ticks = feed >= 1 ? [0, 1, 2].map((k) => ((frame - t.logs + k * 10) % 30) / 30) : [];
  return (
    <>
      <Strip text={STRIPS.yours} icon="user" tone={C.cyan} on={0.6 * progress(frame, t.yours, 10) * (1 - progress(frame, t.yours + 30, 16))} base={0.55} top={Y.yours} frame={frame} at={t.yours} />
      <Strip text={STRIPS.blind} icon="eyeOff" tone={C.amber} on={progress(frame, t.blind, 10) * (1 - 0.6 * logsOn)} base={calm} top={Y.blind} frame={frame} at={t.blind} />
      <Strip text={STRIPS.logs} icon="file" tone={C.sky} on={logsOn * (1 - 0.4 * decOn)} base={calm} top={Y.logs} frame={frame} at={t.logs} />
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {feed > 0.01 ? (
          <g opacity={calm}>
            <path d={`M ${LOGS_OUT[0]} ${LOGS_OUT[1]} C ${LOGS_OUT[0] + 40} ${LOGS_OUT[1]}, ${X - 50} ${logsY}, ${X - 6} ${logsY}`} fill="none" stroke={alpha(C.sky, 0.7)} strokeWidth={4} strokeDasharray="10 8" opacity={feed} />
            {ticks.map((p, k) => (
              <rect key={k} x={LOGS_OUT[0] + (X - 6 - LOGS_OUT[0]) * p - 9} y={LOGS_OUT[1] + (logsY - LOGS_OUT[1]) * p - 4} width={18} height={8} rx={3} fill={C.sky} />
            ))}
          </g>
        ) : null}
        <Arrow points={[[X + 140, Y.logs + H + 4], [X + 140, Y.decision - 6]]} draw={progress(frame, t.decision - 4, 12)} color={C.emerald} width={4} />
      </svg>
      {frame >= t.decision - 6 ? (
        <div
          style={{
            position: 'absolute',
            left: X,
            top: Y.decision,
            width: W,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '16px 26px',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.emerald, 0.4 + 0.5 * decOn)}`,
            background: alpha(C.emerald, 0.06 + 0.08 * decOn),
            boxShadow: `0 0 ${Math.round(30 * decOn)}px ${alpha(C.emerald, 0.2 * decOn)}`,
            fontFamily: FONT.sans,
            ...enter(frame, t.decision, { distance: 14 }),
          }}
        >
          <Icon name="shield" size={44} color={C.emerald} />
          <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>{DECISION}</span>
        </div>
      ) : null}
    </>
  );
}
