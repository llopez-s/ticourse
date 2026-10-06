import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { PARTIAL, TAGS } from '../data/s03-orbital';
import {
  FILM_LABEL_H,
  FilmLabel,
  FilmRail,
  MERIDIAN_FRAMES,
  ORBITAL_FRAMES,
  VICTIMS,
  filmRailLayout,
  withFrames,
} from './parts/FilmRail';
import { LOG_ROWS, LOG_W, OrbitalLog, logRowCenter, logRowEnd, type LogRowId } from './parts/s03-orbital/OrbitalLog';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import { TIMELINE } from '../timeline/load';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-orbital';
const W = STAGE.width;
const H = STAGE.height;

// ---- Part 1: the raw lines, tags in the column on their right.
const LOG_X = 0;
const LOG_Y = 150;
const TAG_X = LOG_W + 34;

// ---- Part 2: the panel steps up as a thumbnail; Orbital's rail under it.
const THUMB_K = 0.42;
const RAIL2 = { x: 0, w: W };
const RAIL2_Y = 152;
/** Orbital's label in part 2: right of the thumbnail, over the rail. */
const LABEL2 = { x: Math.round(LOG_W * THUMB_K) + 40, y: RAIL2_Y - FILM_LABEL_H - 10 };

// ---- Part 3: the two films side by side, low (the intercept card owns the top centre).
const SIDE_W = 840;
const SIDE_GAP = W - SIDE_W * 2;
const SIDE = filmRailLayout(SIDE_W);
const BLOCK_H = FILM_LABEL_H + 8 + SIDE.height;
const Y3_MID = Math.round((H - BLOCK_H) / 2);
const Y3_LOW = 330;

/** Local frame at which the GLASS VIPER intercept card appears (the silent lead before s03-06), as in V3's S02Axiom. */
function interceptFrom(fallback: number): number {
  const hit = (TIMELINE.intercept ?? []).find((i) => i.scene === S);
  if (!hit) return fallback;
  return hit.from - (sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S));
}

/**
 * s03-orbital «Otra empresa, otra película». Orbital's raw lines arrive as they are (`orbital-log`), each `->`
 * drawn; then step by step, the rest pushed back: the mail and «un pedido falso a Finanzas» (`lure`), the
 * attachment line and «se ejecuta el adjunto y deja un programa» (`runs`), the beacon and «llama a casa» (`calls`,
 * a pulse runs its connector). The `linker artifact` line stays dimmed for s04. On `partial` the panel steps up to
 * a thumbnail and Orbital's own rail fills: its four frames drop in, the thread lights from «entrega» to «casa», and
 * on «última» the Actions on Objectives frame comes up empty, with its «?». On s03-05 the two films sit side by
 * side (Meridian whole, Orbital half), «hilo parcial» over Orbital's gap on «parcial»; before the intercept they
 * glide down so the top centre is clear until the end.
 */
export function S03Orbital(props: SceneProps) {
  const frame = useCurrentFrame();
  const logAt = props.cue('orbital-log');
  const lureAt = props.cue('lure');
  const runsAt = props.cue('runs');
  const callsAt = props.cue('calls');
  const partialAt = props.cue('partial');
  const s05 = segment(props, 's03-05');
  const s06 = segment(props, 's03-06');

  // ---- Part 1: rows in, then focus on the voice's row.
  const panelIn = progress(frame, 0, 18, EASE.out);
  const rowAt = (i: number) => logAt + 4 + i * 9;
  const steps: { row: LogRowId; at: number }[] = [
    { row: 'mail', at: lureAt },
    { row: 'runs', at: runsAt },
    { row: 'beacon', at: callsAt },
  ];
  const stepEnd = partialAt;
  const focus: Partial<Record<LogRowId, number>> = {};
  const dim: Partial<Record<LogRowId, number>> = {};
  const show: Partial<Record<LogRowId, number>> = {};
  LOG_ROWS.forEach((id, i) => {
    show[id] = progress(frame, rowAt(i), 14);
  });
  const anyFocus = windowWeight(frame, lureAt, stepEnd, { ramp: 12, lead: 2 });
  steps.forEach((s, i) => {
    const to = i < steps.length - 1 ? steps[i + 1].at : stepEnd;
    focus[s.row] = windowWeight(frame, s.at, to, { ramp: 10, lead: 2 });
  });
  LOG_ROWS.forEach((id) => {
    dim[id] = id === 'pdb' ? progress(frame, rowAt(2) + 10, 20) : anyFocus * (1 - (focus[id] ?? 0));
  });
  const connMail = progress(frame, rowAt(0) + 8, 14);
  const connBeacon = progress(frame, rowAt(3) + 8, 14);
  const beatT = frame - (callsAt + 6);
  const beat = beatT > 0 && beatT < 96 ? (beatT % 32) / 32 : undefined;

  // ---- Part 2: the panel steps up; Orbital's rail.
  const toThumb = progress(frame, partialAt - 6, 26, EASE.inOut);
  const railIn = progress(frame, partialAt + 4, 30, EASE.inOut);
  const dropAt = (i: number) => partialAt + 14 + i * 7;
  const threadFrom = Math.max(dropAt(3) + 6, wordFrame(S, 's03-04', 'entrega') - 4);
  const threadTo = Math.max(threadFrom + 20, wordFrame(S, 's03-04', 'casa') + 4);
  const thread = progress(frame, threadFrom, threadTo - threadFrom, EASE.inOut);
  const gapAt = Math.max(threadTo + 2, wordFrame(S, 's03-04', 'última') - 4);

  // ---- Part 3: side by side.
  const sideAt = s05.from;
  const side = progress(frame, sideAt - 4, 30, EASE.inOut);
  const thumbOut = progress(frame, sideAt - 6, 18);
  // The films glide down before the intercept card types out (the top centre stays clear to the end).
  const lowAt = interceptFrom(s06.from - 105) - 26;
  const low = progress(frame, lowAt, 22, EASE.inOut);
  const y3 = mix(Y3_MID, Y3_LOW, low);
  const meridianIn = progress(frame, sideAt + 4, 26, EASE.out);
  const film = progress(frame, sideAt + 6, 26, EASE.inOut);
  const partialTagAt = Math.max(sideAt + 30, wordFrame(S, PARTIAL.seg, PARTIAL.word) - 8);
  const partialTag = progress(frame, partialTagAt, 16, EASE.out);
  const gapFocus = windowWeight(frame, gapAt, sideAt, { ramp: 10, lead: 0 }) + windowWeight(frame, partialTagAt, s05.to + 30, { ramp: 12, lead: 0 });

  // Orbital's rail position/size: part 2 → part 3.
  const oX = mix(RAIL2.x, SIDE_W + SIDE_GAP, side);
  const oW = mix(RAIL2.w, SIDE_W, side);
  const oY = mix(RAIL2_Y, y3 + FILM_LABEL_H + 8, side);
  const oL = filmRailLayout(oW);

  const orbitalFrames = withFrames(ORBITAL_FRAMES, {
    'o-delivery': { show: progress(frame, dropAt(0), 16) },
    'o-exploitation': { show: progress(frame, dropAt(1), 16) },
    'o-installation': { show: progress(frame, dropAt(2), 16) },
    'o-c2': { show: progress(frame, dropAt(3), 16) },
    'o-actions': { show: progress(frame, gapAt, 16), q: progress(frame, gapAt + 6, 14), focus: clamp01(gapFocus) },
  });

  // Panel geometry: part 1 → thumbnail at the top left.
  const pk = mix(1, THUMB_K, toThumb);
  const px = mix(LOG_X, 0, toThumb);
  const py = mix(LOG_Y, 0, toThumb);
  const panelOpacity = 1 - thumbOut;

  return (
    <Stage>
      {/* ---- Part 1 / 2: the raw lines (then a thumbnail) */}
      {panelOpacity > 0.001 ? (
        <div style={{ position: 'absolute', left: px, top: py, transform: `scale(${pk})`, transformOrigin: '0 0', opacity: panelOpacity }}>
          <OrbitalLog
            panel={panelIn}
            show={show}
            focus={toThumb > 0.5 ? {} : focus}
            dim={toThumb > 0.5 ? { pdb: 1 } : dim}
            conn={{ mail: connMail, beacon: connBeacon }}
            beat={beat}
          />
        </div>
      ) : null}

      {/* ---- Part 1: the tags, one at a time, beside their row */}
      {TAGS.map((t, i) => {
        const at = props.cue(t.cue);
        const to = i < TAGS.length - 1 ? props.cue(TAGS[i + 1].cue) : partialAt;
        const w = windowWeight(frame, at, to, { ramp: 10, lead: 2 });
        if (w <= 0.001) return null;
        const r = LOG_ROWS.indexOf(t.row);
        const cy = LOG_Y + logRowCenter(r);
        const x0 = LOG_X + logRowEnd(r) + 14;
        const lines = t.lines.length;
        const tagH = lines * 42;
        return (
          <div key={t.row}>
            <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: w }}>
              <line x1={x0} y1={cy} x2={x0 + (TAG_X - 16 - x0) * w} y2={cy} stroke={alpha(C.roseSoft, 0.7)} strokeWidth={3} strokeLinecap="round" />
              <circle cx={x0} cy={cy} r={5} fill={C.roseSoft} />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: TAG_X,
                top: cy - tagH / 2,
                paddingLeft: 18,
                borderLeft: `5px solid ${C.rose}`,
                fontFamily: FONT.sans,
                fontSize: 34,
                fontWeight: 750,
                lineHeight: '42px',
                color: C.textStrong,
                whiteSpace: 'nowrap',
                opacity: w,
                transform: `translateX(${(1 - w) * 14}px)`,
              }}
            >
              {t.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>
        );
      })}

      {/* ---- Orbital's label and rail (part 2), then on the right (part 3) */}
      {railIn > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: mix(LABEL2.x, oX, side), top: mix(LABEL2.y, oY - FILM_LABEL_H - 8, side), opacity: railIn }}>
            <FilmLabel name={VICTIMS.orbital.name} tone={VICTIMS.orbital.tone} />
          </div>
          <div style={{ position: 'absolute', left: oX, top: oY }}>
            <FilmRail
              width={oW}
              frames={orbitalFrames}
              rail={railIn}
              thread={thread}
              film={film}
              tone={VICTIMS.orbital.tone}
              kicker={railIn * (1 - side)}
            />
          </div>
          {/* «hilo parcial» over Orbital's gap */}
          {partialTag > 0.001 ? (
            <PartialTag
              right={W - (oX + oL.frameRect('actions').x + oL.frameRect('actions').w)}
              bottom={oY - 8}
              anchorX={oX + oL.frameRect('actions').cx}
              anchorY={oY + oL.frameTop}
              show={partialTag}
            />
          ) : null}
        </>
      ) : null}

      {/* ---- Part 3: Meridian's whole film on the left */}
      {meridianIn > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: y3, ...enter(frame, sideAt + 4, { distance: -40, axis: 'x', duration: 26 }) }}>
            <FilmLabel name={VICTIMS.meridian.name} tone={VICTIMS.meridian.tone} />
          </div>
          <div style={{ position: 'absolute', left: (1 - meridianIn) * -60, top: y3 + FILM_LABEL_H + 8, opacity: meridianIn }}>
            <FilmRail width={SIDE_W} frames={MERIDIAN_FRAMES} thread={1} film={1} tone={VICTIMS.meridian.tone} kicker={0} />
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** «hilo parcial»: a tag right-aligned over Orbital's empty frame, with a short line down to it. */
function PartialTag({ right, bottom, anchorX, anchorY, show }: { right: number; bottom: number; anchorX: number; anchorY: number; show: number }) {
  const s = EASE.out(clamp01(show));
  const tagH = 50;
  return (
    <>
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: s }}>
        <line x1={anchorX} y1={bottom - 2} x2={anchorX} y2={bottom + (anchorY - bottom) * s - 2} stroke={alpha(C.muted, 0.8)} strokeWidth={3} strokeLinecap="round" />
      </svg>
      <div
        style={{
          position: 'absolute',
          right,
          top: bottom - tagH - 6,
          height: tagH,
          boxSizing: 'border-box',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.muted, 0.7)}`,
          background: alpha(C.ink800, 0.92),
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 750,
          color: C.text,
          whiteSpace: 'nowrap',
          opacity: s,
          transform: `translateY(${(1 - s) * 10}px)`,
        }}
      >
        {PARTIAL.text}
      </div>
    </>
  );
}


