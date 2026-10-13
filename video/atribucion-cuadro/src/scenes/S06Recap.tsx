import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { RULES, type RecapRule } from '../data/s06-recap';
import { EndCard } from './parts/s06-recap/EndCard';
import { NextAction } from './parts/s06-recap/NextAction';
import { RecapRows, type RecapRowDef } from './parts/s06-recap/RecapRows';
import { RuleLine } from './parts/s06-recap/RuleText';
import { BandsThumb, LabelThumb, SignatureThumb } from './parts/s06-recap/Thumbs';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const H = STAGE.height;
const ROW_H = 204;
const GAP = 24;
const BOARD_H = 3 * ROW_H + 2 * GAP;
/** On `next` the board steps back to this scale and leaves the foot of the stage to the next step. */
const BACK = 0.85;
const NEXT_H = 82;
const NEXT_TOP = Math.round(BOARD_H * BACK + (H - BOARD_H * BACK - NEXT_H) / 2);

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame (the chapter wipe reveals them)
 * and on `recap` each gets its thumbnail, cut from the video's one image. Each rule card then lights as the
 * voice starts it, as a full-width row — the storyboard's sentence, a short title line and the rest smaller,
 * its lines lighting on the voice's own words:
 *   1  the three bands of the canvas, lit from the bottom up — «Máquina, operador y sponsor:» · «cada nivel
 *      pide evidencia de otro tipo.» · and, cyan, «Tu red llega a la máquina» (only band 1 stays lit).
 *   2  the corner of the canvas: a hand finishes signature and date in a moment and they turn amber — «Un
 *      idioma o una hora se falsifican en un minuto;» · «años de objetivos y de rutina cuestan mucho más
 *      (caro no es imposible).» · «¿Y si esta pista es un señuelo?».
 *   3  the museum label — «Antes de poner un nombre, ¿qué decisión cambia?» · «Y si lo pones, con su
 *      confianza» (the label's edge turns emerald).
 * On `next` the board steps back and «Tu turno: las preguntas de la lección» comes in under it; on
 * `endcard` the ALERTÓPOLIS end card takes the stage and holds to the last frame. No lab.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  // The thumbnails come with «tres reglas», always before the first rule lights.
  const thumbAt = Math.min(recapAt + 2, ruleAt[0] - 24);

  const back = progress(frame, nextAt - 8, 22, EASE.inOut);
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  /** Each line lights on its own word (never before its card); an unspoken line follows the one before. */
  const lineFrames = (rule: RecapRule, cardAt: number) => {
    const out: number[] = [];
    rule.lines.forEach((l, k) => {
      out.push(l.word ? Math.max(cardAt + 2, at(rule.seg, l.word) - 6) : k === 0 ? cardAt : out[k - 1] + (l.after ?? 12));
    });
    return out;
  };
  const frames = RULES.map((rule, i) => lineFrames(rule, ruleAt[i]));

  const thumbs: ReactNode[] = [
    <BandsThumb key="bands" frame={frame} at={ruleAt[0]} settleAt={frames[0][2]} />,
    <SignatureThumb key="signature" frame={frame} at={ruleAt[1]} />,
    <LabelThumb key="label" frame={frame} litAt={frames[2][1]} />,
  ];

  const rows: RecapRowDef[] = RULES.map((rule, i) => ({
    at: ruleAt[i],
    thumb: thumbs[i],
    body: (
      <div>
        {rule.lines.map((l, k) => (
          <RuleLine key={k} line={l} lit={progress(frame, frames[i][k], 12)} gap={k === 1 ? 6 : 0} />
        ))}
      </div>
    ),
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: BOARD_H, transform: `scale(${mix(1, BACK, back)})`, transformOrigin: '50% 0%' }}>
            <RecapRows rows={rows} width={W} rowHeight={ROW_H} gap={GAP} slotAt={Math.min(-14, thumbAt - 40)} thumbAt={thumbAt} dimFrom={nextAt} frame={frame} fps={fps} />
          </div>
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} width={W} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
