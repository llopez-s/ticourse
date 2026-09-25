import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { SceneProps } from '../timeline/types';
import { STAGE } from '../theme/tokens';
import { EASE, progress } from '../theme/motion';
import { AlertQueue } from './parts/s06-fatigue/AlertQueue';
import { NightShiftStats } from './parts/s06-fatigue/NightShiftStats';
import { ParetoChart } from './parts/s06-fatigue/ParetoChart';
import { segmentFrom, wordFrame } from './parts/s06-fatigue/timing';

const QUEUE_W = 1060;
const STATS_X = 1100;

/**
 * S06 · Alert fatigue (chapter III opener).
 *   queue        → the queue streams grey rows; the counter climbs to 6.000 / día
 *   close-unread → "Cerrar todas" is clicked, 9 rows in 10 fold away, stamp + 90 % / 5.400
 *   (s06-02)     → the problem gets its name: alert fatigue
 *   pareto       → the view becomes a Pareto: three rules = 78 % of the volume, 0 real incidents
 *   r-backup / r-scanner / r-lb → the three bars are named in turn
 */
export function S06Fatigue({ cue, segments }: SceneProps) {
  const frame = useCurrentFrame();
  const queue = cue('queue');
  const close = cue('close-unread');
  const pareto = cue('pareto');
  const names = [cue('r-backup'), cue('r-scanner'), cue('r-lb')] as const;

  const fatigueAt = wordFrame(segments, 's06-02', 'alert', segmentFrom(segments, 's06-02', close + 80) + 6);
  const stampAt = wordFrame(segments, 's06-01', 'sin', close + 40);
  const noIncidentAt = wordFrame(segments, 's06-02', 'ninguna', pareto + 100);

  // Queue view hands over to the Pareto view as the narration says "Tres reglas…".
  const out = progress(frame, pareto - 12, 14, EASE.inOut);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        {out < 1 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateX(${-48 * out}px)` }}>
            <AlertQueue frame={frame} queue={queue} close={close} stampAt={stampAt} width={QUEUE_W} height={STAGE.height} />
            <NightShiftStats
              frame={frame}
              queue={queue}
              close={close}
              fatigueAt={fatigueAt}
              left={STATS_X}
              width={STAGE.width - STATS_X}
            />
          </div>
        ) : null}
        {frame >= pareto - 6 ? <ParetoChart frame={frame} pareto={pareto} names={names} noIncidentAt={noIncidentAt} /> : null}
      </div>
    </AbsoluteFill>
  );
}
