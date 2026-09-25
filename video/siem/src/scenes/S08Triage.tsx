import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../timeline/types';
import { C, STAGE, alpha } from '../theme/tokens';
import { EASE, countUp, enter, fadeIn, progress } from '../theme/motion';
import { CaseStrip, Cursor, Panel } from '../ui';
import { ALERT, EXFIL } from '../data/s08-triage';
import { AlertQueue, assignButtonCenter } from './parts/s08-triage/AlertQueue';
import { MetaCards } from './parts/s08-triage/MetaCards';
import { NetFlowChart } from './parts/s08-triage/NetFlowChart';
import { TwoWeeks } from './parts/s08-triage/TwoWeeks';

const MAIN_TOP = 108;
const MAIN_H = STAGE.height - MAIN_TOP;
const LEFT_W = 450;
const QUEUE_X = 478;
const QUEUE_W = STAGE.width - QUEUE_X;
const CHART_H_TALL = MAIN_H;
const CHART_H_SHORT = 292;
const META_TOP = MAIN_TOP + CHART_H_SHORT + 24;

/**
 * S08 "Triaje" — two weeks after the tuning the queue is calm (400/día), so
 * the one alert that matters stands out. The analyst takes it, NetFlow shows
 * 38 GB leaving to 203.0.113.47 between 02:00 and 04:30, and the scene ends
 * on the exam point: NetFlow is metadata, content needs a packet capture.
 */
export function S08Triage({ cue, segments }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const twoWeeks = cue('two-weeks');
  const alertTop = cue('alert-top');
  const assign = cue('assign');
  const netflow = cue('netflow');
  const gb = cue('38gb');
  const meta = cue('metadata');
  // "…en un servidor de la terminal de contenedores" — second sentence of s08-02.
  const seg02 = segments.find((s) => s.id === 's08-02');
  const hostAt = seg02 ? seg02.from + 52 : alertTop + 100;

  // Phase A (queue) hands over to phase B (NetFlow) at the netflow cue.
  const aOut = progress(frame, netflow - 8, 14, EASE.inOut);
  const chartIn = enter(frame, netflow - 2, { distance: 30, duration: 18 });
  const compress = progress(frame, meta - 20, 22, EASE.inOut);
  const chartH = CHART_H_TALL + (CHART_H_SHORT - CHART_H_TALL) * compress;

  const mark02 = progress(frame, gb + 100, 10);
  const mark0430 = progress(frame, gb + 115, 10);
  const status = frame >= assign + 3;
  const statusGlow = status ? 1 - progress(frame, assign + 3, 36, EASE.inOut) : 0;

  const button = assignButtonCenter(QUEUE_W);
  const target = { x: QUEUE_X + button.x - 9, y: MAIN_TOP + button.y - 6 };

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <CaseStrip
          status={status ? 'EN TRIAJE' : 'NUEVA'}
          statusAccent={status ? 'amber' : 'muted'}
          markers={[
            { time: '01:52', label: 'logon', accent: 'rose', reveal: 0 },
            { time: EXFIL.start, label: 'inicio salida', accent: 'amber', reveal: mark02 },
            { time: EXFIL.end, label: 'fin salida', accent: 'amber', reveal: mark0430 },
          ]}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            boxShadow: statusGlow > 0 ? `0 0 ${30 * statusGlow}px ${alpha(C.amber, 0.35 * statusGlow)}` : undefined,
            // Always set (never undefined) so React never clears it under the `border` shorthand.
            borderColor: statusGlow > 0 ? alpha(C.amber, 0.25 + 0.5 * statusGlow) : C.ink700,
          }}
        />

        {/* Phase A: the calm, tuned queue and the alert that stands out. */}
        {aOut < 1 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut, transform: `translateY(${-20 * aOut}px)` }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: MAIN_TOP,
                opacity: 1 - 0.55 * progress(frame, alertTop, 14),
              }}
            >
              <TwoWeeks frame={frame} at={twoWeeks} width={LEFT_W} height={MAIN_H} />
            </div>
            <div style={{ position: 'absolute', left: QUEUE_X, top: MAIN_TOP }}>
              <AlertQueue
                frame={frame}
                fps={fps}
                width={QUEUE_W}
                height={MAIN_H}
                appearAt={4}
                tunedAt={twoWeeks + 36}
                alertAt={alertTop}
                hostAt={hostAt}
                assignAt={assign}
              />
            </div>
            {/* The pointer leaves once the alert is taken, so it never sits on the dimmed rows. */}
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - progress(frame, assign + 14, 12) }}>
              <Cursor
                frame={frame}
                appearAt={assign - 46}
                path={[
                  { x: target.x + 90, y: target.y + 300, at: assign - 40 },
                  { x: target.x, y: target.y, at: assign - 3 },
                  { x: target.x, y: target.y, at: assign, click: true },
                  { x: target.x + 40, y: target.y + 70, at: assign + 22 },
                ]}
              />
            </div>
          </div>
        ) : null}

        {/* Phase B/C: NetFlow evidence, then the metadata lesson below it. */}
        {frame >= netflow - 2 ? (
          <div style={{ position: 'absolute', left: 0, top: MAIN_TOP, ...chartIn }}>
            <Panel
              title={`NetFlow · ${ALERT.host} (${ALERT.hostIp}) · tráfico saliente`}
              icon="network"
              accent="cyan"
              glow={0.6 * (1 - compress)}
              style={{ width: STAGE.width, height: chartH, boxSizing: 'border-box' }}
            >
              <NetFlowChart
                width={STAGE.width - 4}
                height={chartH - 70}
                compress={compress}
                draw={progress(frame, netflow + 8, 44, EASE.inOut)}
                rateLabel={fadeIn(frame, netflow + 34, 12)}
                counter={countUp(frame, gb + 2, 36, 0, EXFIL.totalGb)}
                counterOpacity={fadeIn(frame, gb, 8)}
                dest={progress(frame, gb + 40, 14)}
                mark02={mark02}
                mark0430={mark0430}
              />
            </Panel>
          </div>
        ) : null}

        {/* The cards arrive while the chart is still shrinking, so the stage never goes empty. */}
        {frame >= meta - 10 ? (
          <div style={{ position: 'absolute', left: 0, top: META_TOP }}>
            <MetaCards
              frame={frame}
              at={meta - 8}
              quienAt={meta + 27}
              cuandoAt={meta + 55}
              cuantoAt={meta + 66}
              pcapAt={meta + 107}
              cifradoAt={meta + 186}
              width={STAGE.width}
              height={STAGE.height - META_TOP}
            />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}
