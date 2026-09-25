import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, fadeIn, progress, pulse } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, Panel } from '../../../../../engine/src/ui';

/**
 * "¿Copia legítima?" — the benign explanation the analyst has to rule out.
 * It stays open (amber) until `answerAt`, when the check for scheduled copies
 * in the window comes back "ninguna" and the hypothesis is discarded.
 */
export function Hypothesis({
  frame,
  fps,
  at,
  answerAt,
  focus,
  width,
  height,
}: {
  frame: number;
  fps: number;
  at: number;
  answerAt: number;
  focus: number;
  width: number;
  height: number;
}) {
  const answered = progress(frame, answerAt, 12);
  const discard = progress(frame, answerAt + 16, 12);
  const pending = frame < answerAt;
  return (
    <Panel title="Hipótesis a descartar" icon="search" accent="amber" glow={focus} style={{ width, height, boxSizing: 'border-box' }}>
      <div style={{ padding: '30px 30px 0', fontFamily: FONT.sans, ...enter(frame, at, { distance: 16 }) }}>
        <div
          style={{
            fontSize: TYPE.h3,
            fontWeight: 850,
            letterSpacing: -0.5,
            color: discard > 0.5 ? C.muted : C.textStrong,
            textDecoration: discard > 0.5 ? 'line-through' : 'none',
            textDecorationColor: C.rose,
            textDecorationThickness: 4,
            whiteSpace: 'nowrap',
          }}
        >
          ¿Copia <span style={{ color: discard > 0.5 ? C.muted : C.amber }}>legítima</span>?
        </div>
        <div style={{ fontSize: 28, color: C.muted, fontWeight: 550, marginTop: 10 }}>¿La explica una tarea programada?</div>

        <div style={{ height: 2, background: C.ink700, margin: '28px 0 24px' }} />
        <div style={{ fontSize: TYPE.micro, color: C.faint, fontWeight: 750, letterSpacing: 2 }}>COMPROBACIÓN</div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16, opacity: fadeIn(frame, at + 10, 12) }}>
          <Icon name="clock" size={36} color={pending ? C.muted : C.roseSoft} style={{ marginTop: 2 }} />
          <div>
            <div style={{ fontSize: TYPE.label, color: C.text, fontWeight: 650, lineHeight: 1.2 }}>Copias programadas en esta franja</div>
            <div style={{ height: 58, marginTop: 10, position: 'relative' }}>
              {pending ? (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 8,
                    fontSize: TYPE.small,
                    color: C.faint,
                    fontWeight: 600,
                    opacity: 0.55 + 0.45 * pulse(frame, fps, 0.6),
                  }}
                >
                  comprobando...
                </span>
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: answered,
                  transform: `translateY(${(1 - answered) * 10}px)`,
                }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: RADIUS.pill,
                    display: 'grid',
                    placeItems: 'center',
                    background: alpha(C.rose, 0.18),
                    border: `2px solid ${C.rose}`,
                  }}
                >
                  <Icon name="x" size={26} color={C.roseSoft} strokeWidth={3} />
                </span>
                <span style={{ fontSize: TYPE.body, color: C.roseSoft, fontWeight: 850 }}>ninguna</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 30, opacity: discard, transform: `scale(${0.9 + 0.1 * discard})`, transformOrigin: 'left center' }}>
          <Chip accent="rose" icon="x" solid size={TYPE.label}>
            DESCARTADA
          </Chip>
        </div>
      </div>
    </Panel>
  );
}
