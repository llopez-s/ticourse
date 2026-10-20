import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { ConcertBeat } from './parts/s06-bolsillo/ConcertBeat';
import { PhoneBeat } from './parts/s06-bolsillo/PhoneBeat';
import { Stage, wordFrame } from './kit';

const S = 's06-bolsillo';

/**
 * s06-bolsillo «La puerta de atrás». The concert («imagen · no es del puerto»): someone slips in by the back door while
 * the security stays inside (`back-door`); then the staff goes home and every door opens (`guards`). On `phone` the
 * concert gives way to the phones: an app from outside the official store pops in on `store` (the ping2) with the
 * system intact, «side loading» (`sideload`); a second phone loses its protections on `root`/`falls` (the alarm), and
 * «rooting · Android» and «jailbreaking · iPhone» land side by side (`jailbreak`). The exam card is in the top band.
 */
export function S06Bolsillo(props: SceneProps) {
  const frame = useCurrentFrame();
  const phoneAt = props.cue('phone');
  const concertOut = progress(frame, phoneAt - 14, 14, EASE.inOut);
  return (
    <Stage>
      {concertOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - concertOut }}>
          <ConcertBeat
            frame={frame}
            t={{
              concert: props.cue('concert'),
              backDoor: props.cue('back-door'),
              skips: wordFrame(S, 's06-02', 'salta') - 6,
              same: wordFrame(S, 's06-02', 'igual') - 8,
              guards: props.cue('guards'),
              doors: wordFrame(S, 's06-03', 'puertas'),
            }}
          />
        </div>
      ) : null}
      {frame >= phoneAt - 6 ? (
        <PhoneBeat
          frame={frame}
          t={{
            phone: phoneAt,
            store: props.cue('store'),
            review: wordFrame(S, 's06-04', 'revisión') - 6,
            intact: wordFrame(S, 's06-05', 'sistema') - 6,
            sideload: props.cue('sideload'),
            root: props.cue('root'),
            falls: props.cue('falls'),
            often: wordFrame(S, 's06-06', 'menudo') - 4,
            mdm: wordFrame(S, 's06-06', 'MDM') - 4,
            rooting: wordFrame(S, 's06-06', 'rooting') - 6,
            jailbreak: wordFrame(S, 's06-06', 'jailbreaking') - 6,
          }}
        />
      ) : null}
    </Stage>
  );
}
