import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { S05_LABEL } from '../data/s05-decision';
import { CISO_QUESTION, CisoStrip } from './parts/CisoStrip';
import { Painting } from './parts/Painting';
import { DecisionQuestion, DefenseColumn, WhoColumn } from './parts/s05-decision/Columns';
import { CloseStrip, LabelMeans, NoteCard } from './parts/s05-decision/Note';
import { Stage, wordFrame } from './kit';

const S = 's05-decision';
const W = STAGE.width;

/** Left: the painting, for the whole scene, and (from `label`) its museum label. */
const PAINT = { x: 20, y: 134, w: 260, legs: 0.5, labelW: 300 } as const;
const MEANS = { x: 20, y: 524 } as const;
/** Right: the two columns and the question hung between them; then the note in their place. */
const RIGHT_X = 624;
const RIGHT_W = W - RIGHT_X;
const COL = { y: 128, h: 340, gap: 24 } as const;
const COL_W = (RIGHT_W - COL.gap) / 2;
const TIE = 36;
const CLOSE_TOP = 598;

/**
 * s05-decision «El nombre y la decisión». Nothing moves: the CISO's strip across the top, the painting on
 * the left, one thing at a time on the right.
 *   frame 0     the CISO's strip with his question (`ciso-again`) and the painting, waiting for its label
 *   who-needs   column «a quién le sirve el país»: governments (the voice), then insurers and business
 *   ours        column «qué cambia en tu defensa»: «detectar, cazar y proteger» · «rara vez cambian con el país»
 *   s05-03      between the two, «¿qué decisión cambia con el nombre?» — all of it still before the exam card
 *   label       the museum label beside the painting, «atribuido a…»; «lo que afirmas lleva su confianza»
 *   note        the columns give way to the note («check»): how the group works, what it is after;
 *   unknown     «quién teclea: desconocido» with the diamond's UNKNOWN stamp; then who it works for — the
 *               judgment is given with its confidence and saying what is missing
 *   s05-06      «perseguir el nombre solo compensa si una decisión lo pide»
 */
export function S05Decision(props: SceneProps) {
  const frame = useCurrentFrame();
  const cisoAt = props.cue('ciso-again');
  const whoAt = props.cue('who-needs');
  const oursAt = props.cue('ours');
  const labelAt = props.cue('label');
  const noteAt = props.cue('note');
  const unknownAt = props.cue('unknown');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const swell = (start: number, hold = 20) => progress(frame, start, 10) * (1 - progress(frame, start + hold, 26, EASE.inOut));

  // ---- The CISO: there from the first frame; he steps back once the answer is being built.
  const cisoDim = Math.max(0.3 * p(oursAt - 6, 18), 0.55 * p(noteAt - 8, 18));

  // ---- The two columns and the question between them; they leave when the note comes.
  const leave = 1 - progress(frame, noteAt - 12, 12, EASE.inOut);
  const govAt = at('s05-01', 'gobierno') - 4;
  const answerAt = at('s05-01', 'responder') - 2;
  const items = [p(govAt), p(answerAt + 14), p(answerAt + 24)];
  const rarelyAt = at('s05-02', 'rara') - 4;
  const askAt = at('s05-03', 'pregunta') - 4;
  const colDim = 1 - 0.25 * p(labelAt - 4, 18);

  // ---- The museum label.
  const cartelaAt = at('s05-04', 'cartela') - 6;
  const trust = p(at('s05-04', 'confianza') - 4, 12);
  const waiting = 0.45 * (1 - p(labelAt - 6, 16));

  // ---- The note, line by line.
  const judgeAt = at('s05-05', 'juicio') - 6;
  const lineAt = [Math.min(at('s05-05', 'cómo') - 4, noteAt + 4), at('s05-05', 'qué') - 4, unknownAt - 2, at('s05-05', 'Para') - 4];
  const said = lineAt.map((t, i) => p(t, 10) * (1 - progress(frame, (lineAt[i + 1] ?? at('s05-06', 'perseguir')) - 4, 14, EASE.inOut)));
  const stampAt = Math.min(at('s05-05', 'sabes') - 4, unknownAt + 8);

  const closeAt = at('s05-06', 'perseguir') - 6;
  const close = enter(frame, closeAt, { distance: 14, duration: 16 });

  return (
    <Stage>
      {/* «¿Quién está detrás? ¿Ponemos un país en el informe?» */}
      <CisoStrip width={W} layout="strip" question={CISO_QUESTION} glow={swell(cisoAt, 34)} dim={cisoDim} style={{ position: 'absolute', left: 0, top: 0 }} />

      {/* The painting and its museum label: a judgment with its confidence */}
      <div style={{ position: 'absolute', left: PAINT.x, top: PAINT.y }}>
        <Painting width={PAINT.w} legs={PAINT.legs} dim={waiting} label={p(cartelaAt, 16)} labelText={S05_LABEL.text} labelLit={trust} labelWidth={PAINT.labelW} />
      </div>
      <div style={{ position: 'absolute', left: MEANS.x, top: MEANS.y }}>
        <LabelMeans show={p(at('s05-04', 'con') - 4)} glow={swell(at('s05-04', 'confianza') - 4, 30)} />
      </div>

      {/* Who the country is for · what changes in your defence */}
      <div style={{ position: 'absolute', left: RIGHT_X, top: COL.y, opacity: leave * colDim }}>
        <WhoColumn width={COL_W} height={COL.h} show={p(whoAt - 4, 16)} items={items} said={swell(govAt, 40)} />
      </div>
      <div style={{ position: 'absolute', left: RIGHT_X + COL_W + COL.gap, top: COL.y, opacity: leave * colDim }}>
        <DefenseColumn width={COL_W} height={COL.h} show={p(oursAt - 4, 16)} what={p(at('s05-02', 'detectas') - 4)} rarely={p(rarelyAt)} said={swell(rarelyAt, 40)} />
      </div>
      <div style={{ position: 'absolute', left: RIGHT_X, top: COL.y + COL.h, opacity: leave }}>
        <DecisionQuestion width={RIGHT_W} gap={TIE} show={p(askAt, 16)} glow={swell(at('s05-03', 'decisión') - 4, 40)} />
      </div>

      {/* What you can write in the report */}
      <div style={{ position: 'absolute', left: RIGHT_X, top: COL.y }}>
        <NoteCard width={RIGHT_W} show={p(noteAt - 2, 16)} lines={lineAt.map((t) => p(t))} tail={p(judgeAt)} stamp={p(stampAt, 10)} stampPulse={swell(stampAt, 26)} said={said} />
      </div>

      {/* The chapter's close */}
      {frame >= closeAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CLOSE_TOP, width: W, display: 'flex', justifyContent: 'center', ...close }}>
          <CloseStrip when={p(at('s05-06', 'si') - 4, 12)} />
        </div>
      ) : null}
    </Stage>
  );
}
