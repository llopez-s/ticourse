import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { QUESTION } from '../data/s02-maquina';
import { Pill } from './parts/Labels';
import { BuildingBeat } from './parts/s02-maquina/BuildingBeat';
import { EscapeRow, ROW_H, ReuseRow } from './parts/s02-maquina/Rows';
import { Stage, wordFrame } from './kit';

const S = 's02-maquina';
const W = STAGE.width;
const ROW1_TOP = 14;
const ROW2_TOP = 392;
const Q_TOP = ROW1_TOP + ROW_H + 26;

/**
 * s02-maquina «Una pared y un cajón». First the rental building («imagen · no es del puerto»): the walls between flats
 * light up as «hipervisor» (`wall`), a rose hole opens to the flat next door (`hole`), and downstairs a new tenant finds
 * the previous one's papers in a drawer, walls intact (`drawer`). On `server` the building gives way to the schematic:
 * row 1, VM escape (`escape`; on `cross` the glitch — the arrow breaks into the hypervisor, which jolts and cracks),
 * and its fix; row 2, resource reuse (`reuse`: the retired machine's disk passes, residue and all, to a new one) and
 * its fix. On `question` the pill between the rows asks «¿alguien ha salido de su máquina?» (the exam card is in the top
 * band at the same time).
 */
export function S02Maquina(props: SceneProps) {
  const frame = useCurrentFrame();
  const serverAt = props.cue('server');
  const questionAt = props.cue('question');
  const beatOut = progress(frame, serverAt - 14, 14, EASE.inOut);
  const rowsIn = frame >= serverAt - 6;
  const qIn = frame >= questionAt - 4 ? enter(frame, questionAt, { distance: 14 }) : null;

  return (
    <Stage>
      {beatOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - beatOut }}>
          <BuildingBeat
            frame={frame}
            t={{
              building: props.cue('building'),
              wall: props.cue('wall'),
              wallWord: wordFrame(S, 's02-01', 'hipervisor'),
              hole: props.cue('hole'),
              holeWord: wordFrame(S, 's02-02', 'salirte'),
              drawer: props.cue('drawer'),
              drawerWord: wordFrame(S, 's02-03', 'papeles'),
              intactWord: wordFrame(S, 's02-03', 'Ahí'),
            }}
          />
        </div>
      ) : null}

      {rowsIn ? (
        <>
          <EscapeRow
            frame={frame}
            top={ROW1_TOP}
            t={{
              server: serverAt,
              escape: props.cue('escape'),
              cross: props.cue('cross'),
              term: wordFrame(S, 's02-04', 'VM') - 6,
              fix: wordFrame(S, 's02-04', 'parcheando') - 6,
            }}
          />
          {frame >= props.cue('reuse') - 6 ? (
            <ReuseRow
              frame={frame}
              top={ROW2_TOP}
              t={{
                reuse: props.cue('reuse'),
                fresh: wordFrame(S, 's02-05', 'nueva'),
                disk: wordFrame(S, 's02-05', 'disco'),
                residue: wordFrame(S, 's02-05', 'borrarlo'),
                term: wordFrame(S, 's02-05', 'resource') - 6,
                fix: wordFrame(S, 's02-05', 'limpiando') - 6,
              }}
            />
          ) : null}
        </>
      ) : null}

      {qIn ? (
        <div style={{ position: 'absolute', left: 0, top: Q_TOP, width: W, display: 'flex', justifyContent: 'center', ...qIn }}>
          <Pill text={QUESTION} tone={C.violet} icon="search" size={38} height={62} weight={850} on={progress(frame, questionAt, 12)} />
        </div>
      ) : null}
    </Stage>
  );
}
