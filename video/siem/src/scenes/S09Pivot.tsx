import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../timeline/types';
import { STAGE } from '../theme/tokens';
import { EASE, enter, fadeIn, lerp, progress } from '../theme/motion';
import { CaseStrip } from '../ui';
import { QUERY_LINES } from '../data/s09-pivot';
import { CaseTimeline } from './parts/s09-pivot/CaseTimeline';
import { Hypothesis } from './parts/s09-pivot/Hypothesis';
import { QUERY_CPS, QueryBar } from './parts/s09-pivot/QueryBar';
import { UbaHeatmap } from './parts/s09-pivot/UbaHeatmap';

const LEFT_W = 1104;
const RIGHT_X = 1128;
const RIGHT_W = STAGE.width - RIGHT_X;
const QUERY_TOP = 104;
const QUERY_H = 116;
const TIMELINE_TOP = QUERY_TOP + QUERY_H + 16;
const TIMELINE_H = STAGE.height - TIMELINE_TOP;
const RIGHT_TOP = QUERY_TOP;
const RIGHT_H = STAGE.height - RIGHT_TOP;

/**
 * S09 "Pivotar y correlacionar" — "¿y si fuera una copia legítima?" The
 * analyst searches the server from 01:30; the SIEM joins authentication and
 * NetFlow and fills the gap before the transfer with a 4624 logon of
 * svc_tosreport at 01:52 from ADM-WS-07, 8 minutes earlier, with no scheduled
 * copy to explain it. UBA then shows the account outside its baseline.
 */
export function S09Pivot({ cue, segments }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const query = cue('query');
  const logon = cue('logon-0152');
  const adm = cue('adm-ws');
  const link = cue('link-8min');
  const uba = cue('uba');
  const seg01 = segments.find((s) => s.id === 's09-01');
  const seg04 = segments.find((s) => s.id === 's09-04');
  // The hypothesis card lands just before "¿Y si fuera una copia legítima?".
  const hypoAt = seg01 ? Math.max(0, seg01.from - 10) : 16;
  const ubaFrom = seg04 ? seg04.from : uba - 100;

  // Typing ends when the whole query is on screen; the search then runs.
  const queryChars = QUERY_LINES.flat().reduce((n, t) => n + t.t.length, 0);
  const typedAt = query + Math.ceil((queryChars / QUERY_CPS) * fps);
  const runAt = typedAt + 6;
  // "01:30" is spoken ~52 frames after the query cue (the token is typed by then).
  // "…y ninguna copia programada lo explica" lands ~67 frames after link-8min.
  const answerAt = link + 67;

  // Focus: hypothesis → search → timeline → (answer) → UBA.
  const hypoGlow = Math.max(
    0.8 * fadeIn(frame, hypoAt + 2, 16) * (1 - progress(frame, query - 8, 14)),
    0.8 * progress(frame, answerAt, 12),
  );
  const hypoDim = 1 - 0.45 * progress(frame, query - 8, 14) + 0.45 * progress(frame, answerAt - 10, 12);
  // s09-04: the investigation leaves as s09-03's audio ends, then the UBA view takes the whole stage
  // (no overlap, so the old rows never ghost through the incoming panel).
  const handoff = progress(frame, ubaFrom - 12, 14, EASE.inOut);
  const queryFocus = progress(frame, query - 10, 12) * (1 - progress(frame, runAt + 12, 14));
  const timelineDim = lerp(frame, [runAt - 4, runAt + 8], [0.72, 1]);
  const row2Lit = progress(frame, link + 20, 12) * (1 - progress(frame, answerAt, 16));

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <CaseStrip
          status="INVESTIGACIÓN"
          statusAccent="amber"
          markers={[
            { time: '01:52', label: 'logon', accent: 'rose', reveal: progress(frame, logon + 45, 10) },
            { time: '02:00', label: 'inicio salida', accent: 'amber', reveal: 1 },
            { time: '04:30', label: 'fin salida', accent: 'amber', reveal: 1 },
          ]}
          style={{ position: 'absolute', left: 0, top: 0 }}
        />

        {handoff < 1 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - handoff, transform: `translateY(${-16 * handoff}px)` }}>
            <div style={{ position: 'absolute', left: 0, top: QUERY_TOP }}>
              <QueryBar
                frame={frame}
                fps={fps}
                typeAt={query}
                timeLit={fadeIn(frame, query + 50, 10)}
                focus={queryFocus}
                width={LEFT_W}
                height={QUERY_H}
              />
            </div>

            <div style={{ position: 'absolute', left: 0, top: TIMELINE_TOP }}>
              <CaseTimeline
                frame={frame}
                width={LEFT_W}
                height={TIMELINE_H}
                runAt={runAt}
                correlateAt={logon - 42}
                logonAt={logon}
                admAt={adm}
                privAt={adm + 24}
                linkAt={link}
                row2Lit={row2Lit}
                dim={timelineDim}
              />
            </div>

            <div style={{ position: 'absolute', left: RIGHT_X, top: RIGHT_TOP, opacity: hypoDim }}>
              <Hypothesis
                frame={frame}
                fps={fps}
                at={hypoAt}
                answerAt={answerAt}
                focus={hypoGlow}
                width={RIGHT_W}
                height={RIGHT_H}
              />
            </div>
          </div>
        ) : null}

        {/* "se sale" ~+25 and "línea base" ~+41 frames into s09-04; "UBA" ~68 frames after the uba cue. */}
        {frame >= ubaFrom + 2 ? (
          <div style={{ position: 'absolute', left: 0, top: QUERY_TOP, ...enter(frame, ubaFrom + 2, { distance: 24, duration: 18 }) }}>
            <UbaHeatmap
              frame={frame}
              fps={fps}
              at={ubaFrom + 6}
              outlierAt={ubaFrom + 28}
              baselineAt={ubaFrom + 38}
              ubaAt={uba}
              acronymAt={uba + 64}
              width={STAGE.width}
              height={STAGE.height - QUERY_TOP}
            />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}
