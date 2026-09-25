import { C, FONT, RADIUS, TYPE, alpha } from '../../../theme/tokens';
import { EASE, fadeIn, lerp, progress, pulse, springIn } from '../../../theme/motion';
import { Chip, Icon, Panel, SeverityBadge } from '../../../ui';
import { ALERT, CALM_ROWS } from '../../../data/s08-triage';

const BODY_PAD = 16;
const ALERT_H = 132;
const ROW_H = 70;
const ROW_GAP = 10;
const ROW_PAD_R = 24;
const BADGE_COL = 128;
const BUTTON_W = 248;

/** Centre of the "Asignarme" button relative to the queue panel's top-left corner. */
export function assignButtonCenter(panelWidth: number): { x: number; y: number } {
  return { x: panelWidth - 2 - BODY_PAD - ROW_PAD_R - BUTTON_W / 2, y: 2 + 64 + 2 + BODY_PAD + ALERT_H / 2 };
}

/**
 * The tuned SIEM queue. Calm rows sit there until `alertAt`, when the ALTA
 * alert slides in on top (rose) and pushes them down; at `assignAt` its
 * "Asignarme" button is clicked and becomes "Analista: tú".
 */
export function AlertQueue({
  frame,
  fps,
  width,
  height,
  appearAt,
  tunedAt,
  alertAt,
  hostAt,
  assignAt,
}: {
  frame: number;
  fps: number;
  width: number;
  height: number;
  appearAt: number;
  /** "…gracias al ajuste": the "cola afinada" chip glows briefly. */
  tunedAt: number;
  alertAt: number;
  hostAt: number;
  assignAt: number;
}) {
  const grow = progress(frame, alertAt, 16, EASE.out);
  const calmDim = lerp(frame, [alertAt + 4, alertAt + 18], [1, 0.4]);
  const assigned = frame >= assignAt;
  // Gentle rose breathing while the alert waits for an owner, steady afterwards.
  const breathe = assigned ? 0.6 : 0.35 + 0.4 * pulse(frame - alertAt, fps, 0.7);
  const alertGlow = grow * (assigned ? 0.6 : breathe);
  const hostLit = progress(frame, hostAt, 12);
  const press = frame >= assignAt && frame < assignAt + 5 ? 0.94 : 1;
  const chipPop = springIn(frame, fps, assignAt + 2);
  const innerW = width - 4 - BODY_PAD * 2;
  const tunedGlow = progress(frame, tunedAt, 10) * (1 - progress(frame, tunedAt + 30, 20));
  // Panel body height (border + 64 px header + its 2 px rule); rows pushed past it fade out.
  const bodyH = height - 70;

  return (
    <Panel
      title="Consola SIEM · cola de alertas"
      icon="bell"
      accent="cyan"
      right={
        <div style={{ borderRadius: RADIUS.pill, boxShadow: tunedGlow > 0 ? `0 0 ${24 * tunedGlow}px ${alpha(C.emerald, 0.55 * tunedGlow)}` : 'none' }}>
          <Chip accent="emerald" icon="check" size={TYPE.small}>
            cola afinada
          </Chip>
        </div>
      }
      style={{ width, height, boxSizing: 'border-box' }}
    >
      {/* Calm rows: pushed down by the new alert, dimmed once it lands. */}
      {CALM_ROWS.map((row, i) => {
        const y = BODY_PAD + grow * (ALERT_H + ROW_GAP) + i * (ROW_H + ROW_GAP);
        const fits = lerp(y + ROW_H, [bodyH - 6, bodyH + 30], [1, 0]);
        if (fits <= 0) return null;
        return (
          <div
            key={row.title}
            style={{
              position: 'absolute',
              left: BODY_PAD,
              top: y,
              width: innerW,
              height: ROW_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: `0 ${ROW_PAD_R}px 0 20px`,
              borderRadius: 14,
              background: alpha(C.ink800, 0.7),
              border: `2px solid ${C.ink700}`,
              opacity: fadeIn(frame, appearAt + 4 + i * 3, 10) * calmDim * fits,
              fontFamily: FONT.sans,
            }}
          >
            <div style={{ width: BADGE_COL - 20, flexShrink: 0 }}>
              <SeverityBadge level={row.severity} size={TYPE.micro} />
            </div>
            <div style={{ flex: 1, fontSize: 30, color: C.text, fontWeight: 550, whiteSpace: 'nowrap' }}>{row.title}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, color: C.muted, whiteSpace: 'nowrap' }}>{row.source}</div>
          </div>
        );
      })}

      {/* The alert that stands out. */}
      {grow > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: BODY_PAD,
            top: BODY_PAD,
            width: innerW,
            height: ALERT_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: `0 ${ROW_PAD_R}px 0 20px`,
            borderRadius: 16,
            background: `linear-gradient(90deg, ${alpha(C.rose, 0.2)} 0%, ${alpha(C.rose, 0.08)} 100%)`,
            border: `2px solid ${alpha(C.rose, 0.5 + 0.4 * grow)}`,
            boxShadow: `0 0 ${20 + 26 * alertGlow}px ${alpha(C.rose, 0.35 * alertGlow)}`,
            opacity: grow,
            transform: `translateY(${(1 - grow) * -40}px)`,
            fontFamily: FONT.sans,
          }}
        >
          <div style={{ width: BADGE_COL - 20, flexShrink: 0 }}>
            <SeverityBadge level={ALERT.severity} size={TYPE.small} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: TYPE.body, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
              {ALERT.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, whiteSpace: 'nowrap' }}>
              <Icon name="server" size={30} color={C.roseSoft} />
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: TYPE.label,
                  fontWeight: 700,
                  color: C.roseSoft,
                  padding: '2px 8px',
                  borderRadius: 8,
                  background: alpha(C.rose, 0.18 * hostLit),
                }}
              >
                {ALERT.host}
              </span>
              <span style={{ fontSize: TYPE.label, color: hostLit > 0.5 ? C.text : C.muted, fontWeight: 550 }}>· {ALERT.role}</span>
            </div>
          </div>
          <div style={{ position: 'relative', width: BUTTON_W, height: 64, flexShrink: 0 }}>
            {/* "Asignarme" button, pressed at assignAt. */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.cyan, 0.85)}`,
                background: alpha(C.cyan, frame >= assignAt - 6 ? 0.2 : 0.08),
                color: C.cyanSoft,
                fontSize: TYPE.label,
                fontWeight: 750,
                opacity: 1 - progress(frame, assignAt + 2, 6),
                transform: `scale(${press})`,
              }}
            >
              <Icon name="user" size={30} color={C.cyan} />
              Asignarme
            </div>
            {assigned ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  borderRadius: RADIUS.pill,
                  background: C.cyan,
                  color: C.ink950,
                  fontSize: TYPE.label,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  opacity: progress(frame, assignAt + 2, 6),
                  transform: `scale(${0.8 + 0.2 * chipPop})`,
                }}
              >
                <Icon name="user" size={30} color={C.ink950} strokeWidth={2.4} />
                Analista: tú
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
