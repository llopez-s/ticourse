import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { ALERTS, HUNT, HYPOTHESIS, METER_NOTES, METER_WORDS, QUERY, REFERENCE, SILENCE } from '../data/s04-caza';
import { Meter } from './parts/Meter';
import { AlertsBox, HuntName, HypothesisCard, MeterNotes, QueryPanel, RefCard, Silence } from './parts/s04-caza/Hunt';
import { frameOf } from './parts/s04-caza/text';
import { Stage, segment } from './kit';

const S = 's04-caza';

/** The water meter: big on the left for the analogy, then small at the bottom-left beside the hypothesis. */
const ART = { big: { x: 24, y: 30, w: 820 }, small: { x: 0, y: 312, w: 440 } } as const;

/**
 * s04-caza «Salir a buscar».
 *   (intercept)  SILENT PAGER: «Sin alarma no hay nada que buscar. Duerme tranquila.» The top band
 *                stays clear until s04-01 ends; low on the stage, the answer: a silent bell,
 *                «no suena nada», a drawn not-equal, «no hay nadie».
 *   meter        the house with its taps running; «cierras los grifos» and they close; the dial
 *                keeps turning — «algo gotea». The ceiling has only the ghost of a stain.
 *   hypothesis   the meter steps aside; «sin que nada te avise»: the alerts box (0 for this
 *                hypothesis, the SOC rule of 25-09 with 0 hits); the hypothesis card and «la otra
 *                vez» (4-9 · 01:52 · svc_tosreport desde ADM-WS-07).
 *   hunt         the card becomes a strip; the query panel, row by row; the 30 nights tick by.
 *   hunting      THREAT HUNTING, then «sales tú de caza» (with the meter's dial).
 */
export function S04Caza(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const meterCue = props.cue('meter');
  const hyp = props.cue('hypothesis');
  const hunt = props.cue('hunt');
  const hunting = props.cue('hunting');
  // The intercepted message owns the top band until s04-01 has been heard.
  const interceptEnd = segment(props, 's04-01').to;

  const w = {
    bell: frameOf(S, SILENCE.bell.at),
    neq: frameOf(S, SILENCE.notEqual),
    nobody: frameOf(S, SILENCE.nobody.at),
    fuga: frameOf(S, { seg: 's04-02', word: 'fuga' }),
    notes: METER_NOTES.map((n) => frameOf(S, n.at)),
    close: frameOf(S, METER_WORDS.close),
    spinning: frameOf(S, METER_WORDS.spinning),
    avise: frameOf(S, ALERTS.at),
    head: frameOf(S, HYPOTHESIS.headAt),
    line1: frameOf(S, HYPOTHESIS.line1At),
    line2: frameOf(S, HYPOTHESIS.line2At),
    marks: HYPOTHESIS.marks.map((m) => frameOf(S, m.at)),
    ref: frameOf(S, REFERENCE.at),
    rows: QUERY.rows.map((r) => frameOf(S, r.at)),
    scanFrom: frameOf(S, QUERY.scanFrom),
    scanTo: frameOf(S, QUERY.scanTo),
    alarm: frameOf(S, ALERTS.alarmAt),
    name: frameOf(S, HUNT.nameAt),
    tagline: frameOf(S, HUNT.taglineAt),
  };

  // --- s04-01: the silence, under the intercept card.
  const silence = 1 - progress(frame, meterCue - 12, 12, EASE.inOut);

  // --- s04-02: the meter. It never enters before the intercept card has gone.
  const artAt = Math.max(meterCue, interceptEnd);
  const artIn = progress(frame, artAt, 18);
  const spinFrom = artAt;
  const closed = progress(frame, w.close - 2, 26, EASE.inOut);
  const stain = progress(frame, w.notes[0] - 8, 18);
  const meterNoteAt = w.notes[2];
  const glow = windowWeight(frame, meterNoteAt - 2, hyp + 10, { ramp: 12 }) * (0.7 + 0.3 * windowWeight(frame, w.spinning - 4, hyp, { ramp: 8 }));
  const notesOut = progress(frame, hyp - 8, 12, EASE.inOut);
  const shrink = progress(frame, hyp - 4, 24, EASE.inOut);
  const artOut = progress(frame, hunt - 10, 14, EASE.inOut);
  const scale = mix(1, ART.small.w / ART.big.w, shrink);
  const artLeft = mix(ART.big.x, ART.small.x, shrink);
  const artTop = mix(ART.big.y, ART.small.y, shrink) + (1 - artIn) * 30;

  // --- s04-03 / s04-04: the card enters once the meter has stepped aside, and compacts for the query.
  const cardAt = Math.max(w.head - 10, hyp + 18);
  const compact = progress(frame, hunt - 10, 16, EASE.inOut);
  const refOut = progress(frame, hunt - 12, 12, EASE.inOut);
  const refAt = Math.max(w.ref - 4, cardAt + 10);
  const queryAt = hunt - 4;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <Silence frame={frame} bellAt={w.bell} neqAt={w.neq} nobodyAt={w.nobody} opacity={silence} />

      {frame >= artAt - 1 && artOut < 1 ? (
        <div style={{ position: 'absolute', left: artLeft, top: artTop, transform: `scale(${scale})`, transformOrigin: '0 0', opacity: artIn * (1 - artOut) }}>
          <Meter width={ART.big.w} spinFrom={spinFrom} closed={closed} stain={stain} glow={glow} frame={frame} />
        </div>
      ) : null}

      <MeterNotes frame={frame} at={w.notes} headAt={Math.max(w.fuga, artAt)} head="una fuga de agua" spinFrom={spinFrom} opacity={artIn * (1 - notesOut)} />

      <HypothesisCard frame={frame} boxAt={cardAt} line1At={Math.max(w.line1 - 8, cardAt + 6)} line2At={w.line2 - 8} markAt={w.marks} refAt={refAt} compact={compact} />
      <RefCard frame={frame} at={refAt} opacity={1 - refOut} />
      <AlertsBox frame={frame} fps={fps} at={Math.max(w.avise - 6, hyp + 12)} alarmAt={w.alarm} />

      <QueryPanel frame={frame} at={queryAt} rowAt={w.rows.map((r) => Math.max(r - 2, queryAt + 8))} scanFrom={w.scanFrom} scanTo={w.scanTo} />
      <HuntName frame={frame} fps={fps} at={Math.max(w.name - 4, hunting - 2)} taglineAt={w.tagline - 4} spinFrom={spinFrom} />
    </Stage>
  );
}
