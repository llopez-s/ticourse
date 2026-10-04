import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Stamp, windowWeight } from '../../../engine/src/ui';
import { S09_TEXT } from '../data/s09-informe';
import { GridIcon } from './parts/PromiseIcons';
import { ConclusionTable, tableSize } from './parts/Table';
import { MEMO, Memo } from './parts/s09-informe/Memo';
import { Place, Strip } from './parts/s05-matriz/views';
import { Stage, wordFrame } from './kit';

const S = 's09-informe';
const STAGE_W = 1728;

/** The note sits centred until the mini table arrives, then makes room for it. */
const MEMO_X_ALONE = (STAGE_W - MEMO.w) / 2;
const MEMO_X = 36;
const MEMO_Y = 4;
const MINI_W = 470;
const MINI = tableSize(MINI_W, true);
const MINI_X = STAGE_W - MINI_W - 24;
const MINI_Y = MEMO_Y + (MEMO.h - MINI.h) / 2;
const STRIPS_TOP = MEMO_Y + MEMO.h + 20;

/**
 * s09-informe «Lo que llega al CISO»: the one-page note, written line by line.
 *   memo         the page lands: «Para el CISO · Meridian Dynamics» and, as its title, the
 *                CISO's question «¿Qué busca el intruso?».
 *   verdict      «Juicio: H1, la menos inconsistente (extracto de 4 pruebas)».
 *   confidence   «Confianza: moderada · 4 pruebas de un extracto; aguanta sin E4»; at the end of
 *                the sentence, outside the note, the strip «cómo se dice la confianza: s5m2».
 *   discarded    «Descartadas: H2 (E2, E3, E4) · H3 (E3, E4)».
 *   watch        «Vigilar: E4»; the note (centred until now) moves left and, in the corner, the mini table «sin E4, sigue en pie» with its
 *                centre leg E4 marked «vigilar».
 *   report       (exam card) the note glows: a good ACH report; the marker runs over the winner, its confidence and the discarded
 *                ones as the voice lists them.
 *   provisional  the amber «provisional» stamp (never «caso cerrado»); on «la matriz» the second
 *                strip, «la matriz completa, en el Lab 4B».
 */
export function S09Informe(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const memo = props.cue('memo');
  const verdict = props.cue('verdict');
  const confidence = props.cue('confidence');
  const discarded = props.cue('discarded');
  const watch = props.cue('watch');
  const report = props.cue('report');
  const provisional = props.cue('provisional');

  const at = {
    espionaje: w('s09-02', 'espionaje'),
    moderada: w('s09-02', 'moderada'),
    extracto: w('s09-02', 'extracto'),
    porque: w('s09-03', 'por'),
    vigilar: w('s09-03', 'vigilar'),
    certificado: w('s09-03', 'certificado'),
    ganadora: w('s09-04', 'ganadora'),
    confianza: w('s09-04', 'confianza'),
    descartadas: w('s09-04', 'descartadas'),
    stamp: w('s09-05', 'provisional'),
    matriz: w('s09-05', 'matriz'),
    apoya: w('s09-06', 'apoya'),
  };

  const rowAt = [
    [verdict, at.espionaje - 4],
    [confidence, at.moderada - 4],
    [discarded, at.porque - 4],
    [watch, at.vigilar - 4],
  ] as const;
  const markerEnd = provisional - 6;
  const highlight = [at.ganadora, at.confianza, at.descartadas].map((t) => progress(frame, t - 4, 16, EASE.inOut) * (1 - progress(frame, markerEnd, 14, EASE.inOut)));

  const stampIn = frame >= at.stamp - 2;
  const memoX = MEMO_X_ALONE + (MEMO_X - MEMO_X_ALONE) * progress(frame, watch - 14, 22, EASE.inOut);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <Place x={memoX} y={MEMO_Y}>
        <Memo frame={frame} at={-16} headerAt={memo + 2} rowAt={rowAt} highlight={highlight} glow={0.5 * windowWeight(frame, report, markerEnd, { ramp: 14 }) + 0.7 * windowWeight(frame, at.apoya - 20, Number.POSITIVE_INFINITY, { ramp: 18 })} />
      </Place>

      {/* The stamp lands on the note's top-right corner, clear of the title and the lines. */}
      {stampIn ? (
        <div style={{ position: 'absolute', left: memoX + MEMO.w - 470, top: MEMO_Y + 30 }}>
          <Stamp frame={frame} at={at.stamp - 2} accent="amber" rotate={-8} size={60} style={{ textTransform: 'none', letterSpacing: 1.5, boxShadow: `0 0 30px ${C.amber}44` }}>
            {S09_TEXT.stamp}
          </Stamp>
        </div>
      ) : null}

      {/* The table of s08 in miniature: without E4 it still stands; E4 is the leg to watch. */}
      <Place x={MINI_X} y={MINI_Y} opacity={progress(frame, watch - 4, 14)}>
        <ConclusionTable mini width={MINI_W} at={watch - 4} watchAt={at.vigilar - 2} captionAt={at.certificado} frame={frame} />
      </Place>

      {/* Two pointers, outside the note. */}
      {/* Each half holds one strip against the centre line, so the first does not move when the second arrives. */}
      <div style={{ position: 'absolute', left: 0, top: STRIPS_TOP, width: STAGE_W / 2 - 20, display: 'flex', justifyContent: 'flex-end' }}>
        <Strip tone="cyan" icon="mortarboard" size={34} p={progress(frame, at.extracto, 16)}>
          {S09_TEXT.strips.confidence}
        </Strip>
      </div>
      <div style={{ position: 'absolute', left: STAGE_W / 2 + 20, top: STRIPS_TOP, width: STAGE_W / 2 - 20, display: 'flex', justifyContent: 'flex-start' }}>
        <Strip tone="cyan" icon={<GridIcon size={36} color={C.cyanSoft} accent={C.roseSoft} strokeWidth={4} />} size={34} p={progress(frame, at.matriz - 4, 16)}>
          {S09_TEXT.strips.lab}
        </Strip>
      </div>
    </Stage>
  );
}
