import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { HUNT, HUNT_LIST as LIST, PLAN, WAIT } from '../data/s09-noche';
import { FilmLabel, FilmRail, MERIDIAN_FRAMES, ORBITAL_FRAMES, VICTIMS, filmRailLayout, framesAll, withFrames, type FilmFrame } from './parts/FilmRail';
import { Choice } from './parts/s09-noche/Choice';
import { HuntList, huntListBox } from './parts/s09-noche/HuntList';
import { PLAN_CARD, PlanCard } from './parts/s09-noche/PlanCard';
import { Stage, wordFrame } from './kit';

const S = 's09-noche';
const W = 1728;

/** The film's two poses: big and low during the think prompt (the top belongs to the card), small and high after. */
const POSE_A = { w: 1400, x: 164, y: 250 };
const POSE_B = { w: 940, x: 394, y: 6 };
const LABEL_A = { x: 164, y: 196 };
const LABEL_B = { x: 204, y: 90 };

const CHOICE = { x: 0, y: 300, w: 790 };
const PLAN_POS = { x: W - PLAN_CARD.w, y: 284 };
const LIST_POS = { x: 150, y: 272, w: 1440 };

/** wrap-iv: which list row each of Meridian's frames falls into (the two C2 frames share one). */
const ROW_OF: Record<string, number> = { 'm-delivery': 0, 'm-exploitation': 1, 'm-installation': 2, 'm-c2': 3, 'm-e7': 3, 'm-e9': 4 };

/**
 * s09-noche «Orbital, a medio camino»:
 *   s09-01 + think  ONLY Orbital's partial film, big and low (no projected frame, no plan): C2 lights on «el C2»,
 *                   the «?» gap steps forward on the question
 *   wait            the film moves up; the two answers: «esperar a que saque los datos para confirmarlo» is struck,
 *                   «cuesta justo lo que quieres proteger» (amber)
 *   hunt            «buscar ya» is ringed (a marker ring, never a tick)
 *   plan            Meridian passes Orbital the plan: «esta noche: buscar compresión de archivos en carpetas
 *                   temporales · vigilar transferencias salientes grandes» (the lesson's check; no date, no result)
 *   tonight         the padlock closes; a dashed cyan line goes from the plan to the gap Orbital now watches
 *   wrap-iv         Meridian's film replaces Orbital's and its frames drop into a list of things to look for, each
 *                   into an EMPTY box (nothing is ticked: there is no result)
 */
export function S09Noche(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const waitAt = props.cue('wait');
  const huntAt = props.cue('hunt');
  const planAt = props.cue('plan');
  const tonightAt = props.cue('tonight');
  const wrapAt = props.cue('wrap-iv');
  const c2At = wordFrame(S, 's09-01', 'C2');
  const askAt = wordFrame(S, 's09-01', 'Esperas');
  const costAt = Math.max(waitAt + 10, wordFrame(S, 's09-02', 'cuesta') - 6);
  const lineAt = [Math.max(planAt + 10, wordFrame(S, 's09-04', 'archivos') - 6), Math.max(planAt + 20, wordFrame(S, 's09-04', 'salidas') - 6)];
  const watchAt = Math.max(tonightAt + 12, wordFrame(S, 's09-05', 'vigila') - 4);

  // The film's pose: big and low until the answer, then small at the top.
  const m = progress(frame, waitAt - 12, 24, EASE.inOut);
  const pose = { w: mix(POSE_A.w, POSE_B.w, m), x: mix(POSE_A.x, POSE_B.x, m), y: mix(POSE_A.y, POSE_B.y, m) };
  const L = filmRailLayout(pose.w);
  const filmIn = progress(frame, 0, 14);

  // wrap-iv: everything else steps out, Meridian's film steps in, and its frames fall into the list.
  const out = progress(frame, wrapAt - 6, 16, EASE.inOut);
  const merIn = progress(frame, wrapAt + 6, 16);
  const flyAt = (i: number) => wrapAt + 24 + i * 6;
  const FLY = 22;

  const c2Hot = progress(frame, c2At - 4, 12);
  const gapHot = progress(frame, askAt - 6, 14) * (1 - progress(frame, waitAt, 14));
  const watch = progress(frame, watchAt, 18, EASE.inOut);
  const watchGlow = watch * (0.75 + 0.25 * pulse(frame, fps, 0.5));

  const oFrames: FilmFrame[] = withFrames(ORBITAL_FRAMES, {
    'o-c2': { focus: c2Hot * (1 - m) },
    'o-actions': { focus: Math.max(gapHot, 0.6 * watchGlow) },
  });
  const mFrames: FilmFrame[] = framesAll(MERIDIAN_FRAMES, {}, Object.fromEntries(MERIDIAN_FRAMES.map((f, i) => [f.key, { dim: 0.8 * progress(frame, flyAt(i), FLY) }])));

  const gap = L.frameRect('actions');
  const gapRect = { x: pose.x + gap.x, y: pose.y + gap.y, w: gap.w, h: gap.h };

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        {/* Orbital's partial film (alone during the think prompt) */}
        {out < 1 ? (
          <div style={{ opacity: filmIn * (1 - out) }}>
            <div style={{ position: 'absolute', left: pose.x, top: pose.y }}>
              <FilmRail width={pose.w} frames={oFrames} thread={1} film={1} names={1 - m} lit={{ c2: c2Hot }} tone={VICTIMS.orbital.tone} />
            </div>
            <div style={{ position: 'absolute', left: mix(LABEL_A.x, LABEL_B.x, m), top: mix(LABEL_A.y, LABEL_B.y, m) }}>
              <FilmLabel name={PLAN.to} tone={VICTIMS.orbital.tone} size={32} />
            </div>
            {/* Tonight Orbital watches its gap: a dashed cyan outline round it and a line from the plan */}
            {watch > 0 ? (
              <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <rect
                  x={gapRect.x - 8}
                  y={gapRect.y - 8}
                  width={gapRect.w + 16}
                  height={gapRect.h + 16}
                  rx={14}
                  fill="none"
                  stroke={alpha(C.cyan, 0.9 * watch)}
                  strokeWidth={4}
                  strokeDasharray="10 8"
                  style={{ filter: `drop-shadow(0 0 ${Math.round(10 * watchGlow)}px ${alpha(C.cyan, 0.6)})` }}
                />
                <line
                  x1={gapRect.x + gapRect.w / 2}
                  y1={PLAN_POS.y - 4}
                  x2={gapRect.x + gapRect.w / 2}
                  y2={PLAN_POS.y - 4 + (gapRect.y + gapRect.h + 10 - (PLAN_POS.y - 4)) * watch}
                  stroke={alpha(C.cyan, 0.85)}
                  strokeWidth={4}
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                />
              </svg>
            ) : null}
            {/* The answers sit in the middle until the plan arrives, then make room for it */}
            <div style={{ position: 'absolute', left: mix((W - CHOICE.w) / 2, CHOICE.x, progress(frame, planAt - 16, 24, EASE.inOut)), top: CHOICE.y }}>
              <Choice
                wait={WAIT.option}
                cost={WAIT.cost}
                hunt={HUNT}
                width={CHOICE.w}
                show={progress(frame, waitAt - 2, 14)}
                strike={progress(frame, costAt - 4, 16, EASE.inOut)}
                costIn={progress(frame, costAt + 6, 12)}
                mark={progress(frame, huntAt + 2, 20, EASE.inOut)}
              />
            </div>
            <div style={{ position: 'absolute', left: PLAN_POS.x, top: PLAN_POS.y }}>
              <PlanCard
                from={PLAN.from}
                to={PLAN.to}
                head={PLAN.head}
                actions={PLAN.lines}
                show={progress(frame, planAt - 2, 18)}
                lines={lineAt.map((f) => progress(frame, f, 14))}
                lock={progress(frame, tonightAt - 2, 26, EASE.inOut)}
              />
            </div>
          </div>
        ) : null}

        {/* wrap-iv: Meridian's film becomes a list of things to look for */}
        {merIn > 0 ? (
          <>
            <div style={{ position: 'absolute', left: POSE_B.x, top: POSE_B.y, opacity: merIn }}>
              <FilmRail width={POSE_B.w} frames={mFrames} thread={1} film={1} names={0} tone={VICTIMS.meridian.tone} />
            </div>
            <div style={{ position: 'absolute', left: LABEL_B.x - 20, top: LABEL_B.y, opacity: merIn }}>
              <FilmLabel name={PLAN.from} tone={VICTIMS.meridian.tone} size={32} />
            </div>
            <div style={{ position: 'absolute', left: LIST_POS.x, top: LIST_POS.y }}>
              <HuntList
                head={progress(frame, wrapAt + 14, 14)}
                title={LIST.head}
                rows={LIST.rows}
                rowIn={LIST.rows.map((_, r) => progress(frame, flyAt(firstFlight(r)) + FLY - 4, 12))}
                boxIn={LIST.rows.map((_, r) => progress(frame, flyAt(firstFlight(r)) + FLY - 2, 6))}
                width={LIST_POS.w}
              />
            </div>
            <Flights frame={frame} frames={MERIDIAN_FRAMES} flyAt={flyAt} dur={FLY} />
          </>
        ) : null}
      </div>
    </Stage>
  );
}

/** Index (in MERIDIAN_FRAMES) of the first frame that falls into list row `r`. */
function firstFlight(r: number): number {
  return MERIDIAN_FRAMES.findIndex((f) => ROW_OF[f.key] === r);
}

/** Each frame of Meridian's film flies down into its row's empty box, shrinking to it (no tick ever lands). */
function Flights({ frame, frames, flyAt, dur }: { frame: number; frames: readonly FilmFrame[]; flyAt: (i: number) => number; dur: number }) {
  const Lb = filmRailLayout(POSE_B.w);
  return (
    <>
      {frames.map((f, i) => {
        const t = progress(frame, flyAt(i), dur, EASE.inOut);
        if (t <= 0 || t >= 1) return null;
        const src = Lb.frameRect(f.phase, f.col ?? 0);
        const box = huntListBox(ROW_OF[f.key]);
        const x0 = POSE_B.x + src.x;
        const y0 = POSE_B.y + src.y;
        const x1 = LIST_POS.x + box.x;
        const y1 = LIST_POS.y + box.y;
        const w = mix(src.w, box.w, t);
        const h = mix(src.h, box.h, t);
        return (
          <div
            key={f.key}
            style={{
              position: 'absolute',
              left: mix(x0, x1, t),
              top: mix(y0, y1, t) - Math.sin(Math.PI * t) * 30,
              width: w,
              height: h,
              boxSizing: 'border-box',
              borderRadius: mix(10, 8, t),
              border: `3px solid ${alpha(mix01Color(t), 0.9)}`,
              background: alpha(C.ink800, 0.85 * (1 - t) + 0.4),
              boxShadow: `0 10px 26px ${alpha('#000000', 0.4)}`,
              opacity: t < 0.85 ? 1 : (1 - t) / 0.15,
            }}
          />
        );
      })}
    </>
  );
}

/** Rose (a frame of the film) turning into the cyan of the empty box it becomes. */
function mix01Color(t: number): string {
  return t < 0.5 ? C.roseSoft : C.cyanSoft;
}
