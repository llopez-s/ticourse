import type { ReactNode } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../theme/tokens';
import { enter, fadeIn, progress } from '../../../theme/motion';
import { Chip, Icon } from '../../../ui';
import { ALERT, EXFIL } from '../../../data/s08-triage';

/** "quién / cuándo / cuánto" fact pill: label in cyan, value in mono. */
function Fact({ label, children, frame, at }: { label: string; children: ReactNode; frame: number; at: number }) {
  const e = enter(frame, at, { distance: 14, duration: 12 });
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: 56,
        padding: '0 20px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.55)}`,
        background: alpha(C.cyan, 0.1),
        whiteSpace: 'nowrap',
        ...e,
      }}
    >
      <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: C.cyan }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FONT.mono, fontSize: 30, fontWeight: 700, color: C.textStrong }}>
        {children}
      </span>
    </div>
  );
}

/**
 * The NetFlow lesson in two columns: what the flow record tells you (cyan,
 * lit) versus the content it does not have (greyed, locked).
 */
export function MetaCards({
  frame,
  at,
  quienAt,
  cuandoAt,
  cuantoAt,
  pcapAt,
  cifradoAt,
  width,
  height,
}: {
  frame: number;
  at: number;
  quienAt: number;
  cuandoAt: number;
  cuantoAt: number;
  pcapAt: number;
  cifradoAt: number;
  width: number;
  height: number;
}) {
  const gap = 24;
  const cardW = (width - gap) / 2;
  const left = enter(frame, at, { distance: 24, duration: 16 });
  const right = enter(frame, at + 6, { distance: 24, duration: 16 });
  // "Solo una captura de paquetes…": the focus moves to the (still greyed) content card.
  const shift = progress(frame, pcapAt, 16);
  const leftLit = 1 - 0.6 * shift;
  const card = {
    position: 'absolute' as const,
    top: 0,
    width: cardW,
    height,
    boxSizing: 'border-box' as const,
    borderRadius: RADIUS.lg,
    padding: '22px 30px',
    fontFamily: FONT.sans,
  };
  return (
    <div style={{ position: 'relative', width, height }}>
      <div
        style={{
          ...card,
          left: 0,
          background: `linear-gradient(180deg, ${alpha(C.cyanDeep, 0.28)} 0%, ${C.ink900} 100%)`,
          border: `2px solid ${alpha(C.cyan, 0.35 + 0.35 * leftLit)}`,
          boxShadow: `0 0 36px ${alpha(C.cyan, 0.18 * leftLit)}`,
          ...left,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="network" size={42} color={C.cyan} />
          <span style={{ fontSize: TYPE.body, fontWeight: 850, color: C.textStrong, letterSpacing: -0.3 }}>
            NetFlow <span style={{ color: C.cyanSoft }}>= metadatos</span>
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
          <Fact label="quién" frame={frame} at={quienAt}>
            {ALERT.hostIp}
            <Icon name="arrowRight" size={28} color={C.cyan} strokeWidth={2.4} />
            {EXFIL.destination.split(':')[0]}
          </Fact>
          <Fact label="cuándo" frame={frame} at={cuandoAt}>
            {EXFIL.start}-{EXFIL.end}
          </Fact>
          <Fact label="cuánto" frame={frame} at={cuantoAt}>
            {EXFIL.totalGb} GB
          </Fact>
        </div>
      </div>

      <div
        style={{
          ...card,
          left: cardW + gap,
          background: alpha(C.ink900, 0.9),
          border: `2px dashed ${shift > 0 ? alpha(C.muted, 0.35 + 0.4 * shift) : C.ink600}`,
          boxShadow: shift > 0 ? `0 0 ${30 * shift}px ${alpha(C.muted, 0.12 * shift)}` : 'none',
          ...right,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="lock" size={42} color={shift > 0.5 ? C.text : C.muted} />
          <span style={{ fontSize: TYPE.body, fontWeight: 850, color: shift > 0.5 ? C.textStrong : C.muted, letterSpacing: -0.3 }}>Contenido</span>
          <span style={{ flex: 1 }} />
          <Chip accent="muted" icon="eyeOff" size={TYPE.small}>
            no está en NetFlow
          </Chip>
        </div>
        <div style={{ marginTop: 22, fontSize: TYPE.label, color: shift > 0.5 ? C.text : C.muted, fontWeight: 600, lineHeight: 1.35 }}>
          <span style={{ opacity: 0.35 + 0.65 * fadeIn(frame, pcapAt, 12) }}>
            solo lo guarda un <span style={{ color: C.textStrong, fontWeight: 800 }}>packet capture</span>
          </span>
          <br />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, opacity: fadeIn(frame, cifradoAt, 12) }}>
            <Icon name="lock" size={30} color={C.muted} />
            legible solo si no va cifrado
          </span>
        </div>
      </div>
    </div>
  );
}
