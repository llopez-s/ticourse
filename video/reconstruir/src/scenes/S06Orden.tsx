import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { progress } from '../../../engine/src/theme/motion';
import { focusWeights } from '../../../engine/src/ui';
import { Stage } from './kit';
import { CaseStamp } from './parts/CaseStamp';
import { ChronoTable } from './parts/Chronology';

/**
 * s06-orden «En orden». The chronology: «UTC · hecho · fuente», one row per fact, filled in at the pace of the voice
 * (`intro` draws the empty table, `r1`…`r5` bring the rows). Each row lights up when it is spoken and steps back when
 * the next one arrives; at the end all five sit at full brightness. Nothing is interpreted: no alarm colours, and
 * `syncbox.exe` carries a grey «solo el nombre del archivo» (`name`). Each hour is UTC with its original in grey.
 */
export function S06Orden(props: SceneProps) {
  const frame = useCurrentFrame();
  const introAt = props.cue('intro');
  const at = [props.cue('r1'), props.cue('r2'), props.cue('r3'), props.cue('r4'), props.cue('r5')];
  const nameAt = props.cue('name');

  const headOn = progress(frame, introAt, 18);
  const on = at.map((t) => progress(frame, t - 4, 16));
  const { weights, dims } = focusWeights(frame, at, { ramp: 12, lead: 4, end: at[4] + 190 });
  const noteOn = progress(frame, nameAt, 16);

  return (
    <Stage>
      <ChronoTable on={on} focus={weights} dim={dims} headOn={headOn} noteOn={noteOn} />
      <CaseStamp frame={frame} />
    </Stage>
  );
}
