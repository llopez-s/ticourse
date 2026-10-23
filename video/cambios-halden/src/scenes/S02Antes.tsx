import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Pill, TermPill } from './parts/Labels';
import { FORM, Form } from './parts/s02/Form';
import { Stage, wordFrame } from './kit';

const S = 's02-antes';
const WINDOW_TOP = FORM.h + 24;
const LINE_TOP = FORM.h + 100;

/** A violet exam line with the mortarboard (`exam-line`), or the cyan/amber rollback line. */
function Line({ text, tone, icon, show }: { text: ReactNode; tone: string; icon: 'mortarboard' | 'alert'; show: number }) {
  if (show <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: LINE_TOP,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 18,
        height: 64,
        padding: '0 30px 0 22px',
        borderRadius: 20,
        border: `3px solid ${alpha(tone, 0.7)}`,
        background: alpha(tone, 0.1),
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 12}px)`,
      }}
    >
      <Icon name={icon} size={38} color={tone} />
      {text}
    </div>
  );
}

/**
 * s02-antes «Lo que pide el comité». The request opened to the whole stage fills in: the owner (a silhouette of
 * Sistemas, «change owner») on `owner`; on `who` whoever applies it, the chip «responde de que se justifique, se pruebe
 * y se cierre» and the silent STAKEHOLDERS chip. On «tres» the three empty cells and the committee's box appear; each
 * cell is lit on its cue and ticked when its sentence lands. On «firmar» (`stamp`) the «CAB · firmado» stamp drops and
 * «quien lo pide no firma» follows. Below: the maintenance window chip (`window`), the exam line (`exam-line`) and, on
 * `rollback`, the line that the backout plan is activated if the check fails in the window (the cell turns amber on
 * `fail`).
 */
export function S02Antes(props: SceneProps) {
  const frame = useCurrentFrame();
  const ownerAt = props.cue('owner');
  const whoAt = props.cue('who');
  const cellsAt = wordFrame(S, 's02-03', 'tres') - 6;
  const checkAt = [props.cue('check-impact'), props.cue('check-tests'), props.cue('check-backout')];
  const stampAt = props.cue('stamp');
  const windowAt = props.cue('window');
  const examAt = props.cue('exam-line');
  const rollbackAt = props.cue('rollback');
  // `fail` is a sound-only cue (not in the timeline's cues): sync to the spoken «falla».
  const failAt = wordFrame(S, 's02-07', 'falla');
  const pideAt = wordFrame(S, 's02-05', 'pide') - 6;
  const tickAt = [wordFrame(S, 's02-03', 'impact') + 4, wordFrame(S, 's02-04', 'producción') + 4, wordFrame(S, 's02-04', 'plan') + 4];

  const ticks = tickAt.map((t) => progress(frame, t, 14)) as unknown as [number, number, number];
  const focus = checkAt.map((c, i) => {
    const end = i < 2 ? checkAt[i + 1] - 4 : stampAt - 10;
    return progress(frame, c - 4, 10) * (1 - progress(frame, end, 10));
  }) as unknown as [number, number, number];

  const windowIn = enter(frame, windowAt - 2, { distance: 14 });
  const examIn = progress(frame, examAt - 2, 14) * (1 - progress(frame, rollbackAt - 10, 10));
  const rollIn = progress(frame, rollbackAt, 14);

  return (
    <Stage>
      <Form
        s={{
          form: progress(frame, 2, 16),
          owner: progress(frame, ownerAt - 2, 14),
          who: progress(frame, whoAt - 2, 14),
          answers: progress(frame, whoAt + 10, 14),
          stakeholders: progress(frame, whoAt + 40, 14),
          cells: progress(frame, cellsAt, 14),
          ticks,
          focus,
          fail: progress(frame, failAt - 2, 8),
          stamp: progress(frame, stampAt - 2, 12),
          notSigner: progress(frame, pideAt, 14),
        }}
      />

      {frame >= windowAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: WINDOW_TOP, display: 'flex', alignItems: 'center', gap: 18, ...windowIn }}>
          <Pill text="ventana · fuera del horario de las oficinas · se avisa" tone={C.cyan} icon="clock" size={32} height={58} on={frame < examAt ? 1 : 0.4} />
          <TermPill text="maintenance window" size={30} on={frame < examAt ? 1 : 0.4} />
        </div>
      ) : null}

      <Line
        tone={C.violet}
        icon="mortarboard"
        show={examIn}
        text={
          <span>
            <span style={{ color: '#c4b5fd' }}>“antes de implementar”</span>: impacto, pruebas o vuelta atrás
          </span>
        }
      />
      <Line
        tone={frame >= failAt - 2 ? C.amber : C.cyan}
        icon="alert"
        show={rollIn}
        text="si la comprobación falla dentro de la ventana, se activa el plan de vuelta atrás"
      />
    </Stage>
  );
}
