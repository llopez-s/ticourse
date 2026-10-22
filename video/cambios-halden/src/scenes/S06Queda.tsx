import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { Pill } from './parts/Labels';
import { DOCS_W, DocBoxes } from './parts/DocBoxes';
import { ReqStamp } from './parts/Marks';
import { RequestSheet } from './parts/Request';
import { Stage, wordFrame } from './kit';

const S = 's06-queda';
const SHEET_W = 370;
const DOCS_X = 1728 - DOCS_W;
const STAMP_TOP = 300;
const NOTE_TOP = 400;
const LINE_TOP = 492;

/**
 * s06-queda «Cuando ya funciona». The request on the left: on `verify` its stamp turns «comprobado» and the note says it
 * is not closed yet. On the right three documents, dim from the first frame, light one by one: the service diagram with
 * the new server in its place (`diagram`), the procedure step by step with the step that changed (`procedure`) and the
 * SOP tag (`sop`), and the saved version — «quién cambió qué y cuándo», «volver a la anterior si hace falta», «version
 * control» (`version`). On `close` the three take a tick and the stamp turns «cerrado» (no padlock); the closing line
 * comes with the last sentence.
 */
export function S06Queda(props: SceneProps) {
  const frame = useCurrentFrame();
  const verifyAt = props.cue('verify');
  const diagramAt = props.cue('diagram');
  const procAt = props.cue('procedure');
  const sopAt = props.cue('sop');
  const versionAt = props.cue('version');
  const closeAt = props.cue('close');
  const serverAt = wordFrame(S, 's06-02', 'servidor') - 6;
  const stepAt = wordFrame(S, 's06-03', 'cambió') - 6;
  const termAt = wordFrame(S, 's06-04', 'version', 1) - 6;
  const lineAt = wordFrame(S, 's06-06', 'cierra') - 10;

  const closed = frame >= closeAt - 2;
  const stamp = closed ? 'closed' : frame >= verifyAt - 2 ? 'verified' : 'cab';
  const drop = closed ? progress(frame, closeAt - 2, 12) : frame >= verifyAt - 2 ? progress(frame, verifyAt - 2, 12) : 1;
  const noteIn = progress(frame, wordFrame(S, 's06-01', 'todavía') - 6, 14) * (1 - progress(frame, closeAt - 8, 10));
  const closedNote = progress(frame, closeAt + 6, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -4, { distance: 16 }) }}>
        <RequestSheet width={SHEET_W} owner={1} checks={[1, 1, 1]} stamp={stamp} stampDrop={drop} glow={progress(frame, verifyAt, 12) * (1 - progress(frame, diagramAt, 14))} />
      </div>
      {/* the stamp again, big, under the sheet: it is what changes in this scene */}
      {frame >= verifyAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: STAMP_TOP, width: SHEET_W, display: 'flex', justifyContent: 'center' }}>
          <ReqStamp kind={stamp} drop={drop} size={40} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 0, top: NOTE_TOP, width: SHEET_W, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: noteIn, color: C.amber }}>
          <div>funciona, pero</div>
          <div>todavía no se cierra</div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: closedNote, color: C.emerald }}>
          <div>lo escrito dice</div>
          <div>lo que hay</div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: DOCS_X, top: 0 }}>
        <DocBoxes
          on={[progress(frame, diagramAt - 2, 14), progress(frame, procAt - 2, 14), progress(frame, versionAt - 2, 14)]}
          tick={progress(frame, closeAt + 2, 14)}
          server={progress(frame, serverAt, 16)}
          step={progress(frame, stepAt, 14)}
          sop={progress(frame, sopAt - 2, 14)}
          tag={progress(frame, versionAt, 16)}
          term={progress(frame, termAt, 12)}
        />
      </div>

      {frame >= lineAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: LINE_TOP, width: 1728, display: 'flex', justifyContent: 'center', ...enter(frame, lineAt, { distance: 14 }) }}>
          <Pill text="un cambio no se cierra cuando funciona, sino cuando lo escrito dice lo que hay" tone={C.emerald} icon="check" size={34} height={64} />
        </div>
      ) : null}
    </Stage>
  );
}
