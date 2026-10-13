import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { AloneChip, FalseFlag, FinalQuestion, NotImpossible } from './parts/s04-binario/Chips';
import { CORNER_W, CornerZoom, ProvenanceBlock } from './parts/s04-binario/Corner';
import { Sample } from './parts/s04-binario/Sample';
import { EvidenceTable, TABLE, TABLE_H, TABLE_W, rowTop } from './parts/s04-binario/Table';
import { Stage, segment, wordFrame } from './kit';

const S = 's04-binario';
const W = STAGE.width;

/** Lower zone (y ≥ 252): the sample binary, then the lesson's table in its place. The engine owns the top-centre. */
const LOW_Y = 252;
const SAMPLE_BOX = { w: 1240, h: 400 } as const;
/** Upper zone, free once the think prompt has gone: the painting's corner, the trick's name, the provenance. */
const CORNER_Y = 4;
const CORNER_X = { alone: Math.round((W - CORNER_W) / 2), left: 8 } as const;
const FLAG = { x: 664, y: 42 } as const;
const PROV = { x: 1184, y: 46, w: 532 } as const;
const SIDE_X = TABLE_W + 22;
const QUESTION_TOP = 596;

/**
 * s04-binario «Un binario sobre la mesa».
 *   frame 0      the sample binary, low on the stage, under its label «Ejemplo de la lección · no es el caso
 *                de Meridian»; its two clues are off (grey blocks, empty slots). PAPER CRANE's message types
 *                above it, in the engine's band.
 *   reply-crane  the binary brightens · sample: the label is underlined
 *   lang, hours  each clue lights amber with its Spanish phrase — no language, place or hour, only blocks.
 *                Everything is still from s04-03 on (the think prompt takes the top-centre).
 *   signature    the answer: s02's painting comes back above the binary and its corner is enlarged; «firma»
 *                and «fecha» pulse with the clue each one stands for
 *   cheap        the signature blinks out («glitch») and a hand paints it again in a moment: «un minuto». The
 *                binary gives way to the lesson's table; its three cheap rows are written before s04-05 starts.
 *   s04-05       the corner steps left; «pistas dejadas a propósito para culpar a otro», then FALSE FLAG
 *   s04-06       beside the first two rows: «aisladas pesan muy poco», «dentro de un conjunto…, suman»
 *   costly       the painting's history («procedencia») files card by card; the two costly rows; «caro no es imposible»
 *   sensitivity  «si esta pista fuera un señuelo, ¿cambia tu conclusión?»
 */
export function S04Binario(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyAt = props.cue('reply-crane');
  const sampleAt = props.cue('sample');
  const langAt = props.cue('lang');
  const hoursAt = props.cue('hours');
  const signatureAt = props.cue('signature');
  const cheapAt = props.cue('cheap');
  const costlyAt = props.cue('costly');
  const sensAt = props.cue('sensitivity');
  const thinkSeg = segment(props, 's04-03');
  const flagSeg = segment(props, 's04-05');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const swell = (start: number, hold = 20) => progress(frame, start, 10) * (1 - progress(frame, start + hold, 26, EASE.inOut));

  // ---- The sample and its two clues. Nothing pulses from s04-03 on: the clues are still under the prompt.
  const calm = 1 - progress(frame, thinkSeg.from - 14, 12, EASE.inOut);
  const clue = [p(langAt - 2), p(hoursAt - 2)] as const;
  const pulse = [
    Math.max(swell(langAt, 22) * calm, swell(at('s04-04', 'firma') - 4, 22)),
    Math.max(swell(hoursAt, 22) * calm, swell(at('s04-04', 'fecha') - 4, 22)),
  ] as const;

  // ---- The corner: it comes back, lights amber, and at `cheap` is painted again in a moment.
  const paintFrom = cheapAt + 4;
  const minuteAt = at('s04-04', 'minuto');
  const paintDur = Math.max(14, Math.min(30, minuteAt - 4 - paintFrom));
  const paintEnd = paintFrom + paintDur;
  const paint = frame < paintFrom ? 1 - progress(frame, cheapAt - 2, 5, EASE.linear) : progress(frame, paintFrom, paintDur, EASE.linear);
  const hand = progress(frame, paintFrom - 4, 6) * (1 - progress(frame, paintEnd + 2, 8, EASE.inOut));
  const minute = p(Math.max(minuteAt - 4, paintEnd + 6), 12);
  const slide = progress(frame, flagSeg.from - 8, 26, EASE.inOut);

  // ---- The table takes the binary's place; its cheap rows are in before s04-05 starts.
  const limit = flagSeg.from - 14;
  const rowAt = [Math.min(paintEnd + 10, limit - 16), Math.min(paintEnd + 22, limit - 8), Math.min(paintEnd + 34, limit), at('s04-07', 'objetivos') - 6, at('s04-07', 'rutinas') - 6];
  const tableAt = rowAt[0] - 6;
  const rows = rowAt.map((t) => p(t, 12));
  const cost = windowWeight(frame, costlyAt, sensAt - 4, { ramp: 14 });
  const sens = p(sensAt - 4, 18);
  const barato = swell(at('s04-05', 'barato') - 4, 34);
  const pesan = swell(at('s04-06', 'pesan') - 4, 30);
  const pesa = swell(at('s04-07', 'Pesa') - 4, 34);
  const forge = [barato, barato, barato, swell(rowAt[3] + 2, 26), swell(rowAt[4] + 2, 26)];
  const weigh = [pesan, pesan, 0, pesa, pesa];
  const dim = [0.7 * cost, 0.7 * cost, 0.7 * cost, 0, 0];

  const falseAt = at('s04-05', 'false') - 4;
  const historyAt = at('s04-07', 'historial') - 4;
  const question = enter(frame, sensAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      {/* The sample binary on the table, under its label */}
      <div style={{ position: 'absolute', left: (W - SAMPLE_BOX.w) / 2, top: LOW_Y }}>
        <Sample width={SAMPLE_BOX.w} height={SAMPLE_BOX.h} clue={clue} pulse={pulse} underline={progress(frame, sampleAt + 2, 22, EASE.inOut)} labelGlow={swell(sampleAt, 36)} glow={swell(replyAt, 30)} show={1 - progress(frame, tableAt - 8, 12, EASE.inOut)} />
      </div>

      {/* The painting's corner: signature and date */}
      <div style={{ position: 'absolute', left: mix(CORNER_X.alone, CORNER_X.left, slide), top: CORNER_Y }}>
        <CornerZoom show={p(signatureAt - 6, 12)} zoom={p(signatureAt + 2, 16)} paint={paint} hand={hand} lit={p(at('s04-04', 'firma') - 4, 12)} minute={minute} dim={Math.max(0.8 * cost, 0.5 * sens)} />
      </div>

      {/* What the trick is, and its name */}
      <div style={{ position: 'absolute', left: FLAG.x, top: FLAG.y }}>
        <FalseFlag is={p(flagSeg.from + 8)} name={p(falseAt, 12)} glow={swell(falseAt + 2, 34)} dim={Math.max(0.6 * cost, 0.4 * sens)} />
      </div>

      {/* The costly evidence: the painting's documented history */}
      <div style={{ position: 'absolute', left: PROV.x, top: PROV.y }}>
        <ProvenanceBlock width={PROV.w} label={p(historyAt)} cards={progress(frame, historyAt + 4, Math.max(40, rowAt[4] - historyAt), EASE.linear)} glow={swell(historyAt, 30)} dim={0.4 * sens} />
      </div>

      {/* The lesson's table, row by row, and what to read beside it */}
      {frame >= tableAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: LOW_Y }}>
          <EvidenceTable head={p(tableAt, 12)} ghost={p(tableAt + 2, 14)} rows={rows} forge={forge} weigh={weigh} dim={dim} />
          <div style={{ position: 'absolute', left: SIDE_X, top: rowTop(0) }}>
            <AloneChip height={rowTop(2) - TABLE.gap - rowTop(0)} alone={p(at('s04-06', 'Solas') - 4)} together={p(at('s04-06', 'aunque') - 4)} glow={pesan} dim={0.7 * cost} />
          </div>
          <div style={{ position: 'absolute', left: SIDE_X, top: rowTop(3) }}>
            <NotImpossible height={TABLE_H - rowTop(3)} show={p(at('s04-07', 'caro', 1) - 4)} glow={swell(at('s04-07', 'imposible') - 4, 26)} />
          </div>
        </div>
      ) : null}

      {/* The last question */}
      {frame >= sensAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: QUESTION_TOP, width: W, display: 'flex', justifyContent: 'center', ...question }}>
          <FinalQuestion lure={p(at('s04-08', 'señuelo') - 4, 12)} ask={p(at('s04-08', 'conclusión') - 4, 12)} />
        </div>
      ) : null}
    </Stage>
  );
}
