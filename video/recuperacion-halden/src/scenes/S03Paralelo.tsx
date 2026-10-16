import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { NO_TOUCH, PAIR, RISE_LABEL, STEPS_BOX } from '../data/s03-paralelo';
import { Stage, wordFrame } from './kit';
import { Steps, stepsLayout, type StepView } from './parts/Steps';
import { Theatre, theatreSize } from './parts/Theatre';
import { StepArt, type StepArtView } from './parts/s03-paralelo/StepArt';
import { COMPARE_H, COMPARE_W, Compare } from './parts/s03-paralelo/Compare';

const S = 's03-paralelo';
const W = STAGE.width;

// ---- Layout (stage-local, 1728 × 660). Steps fill the lower 436 px; the top band is free in
// this scene (no think prompt, no intercepted message; the exam card is drawn outside the stage).
const BOX = STEPS_BOX;
const COLS = stepsLayout(BOX.width, BOX.height).columns;
const RISE = { x0: 24, y0: 150, x1: 1290, y1: 24 } as const;

// The two theatres take the place of steps 1–2 while step 3 stays lit on the right.
const TH_W = 300;
const TH = theatreSize(TH_W, { label: true, meta: true });
// The text band ends on the floor line (stage y 614), so the floor never crosses the labels.
const TH_TOP = STEPS_BOX.top + STEPS_BOX.height - 2 - Math.ceil(TH.h);
const TH_X = [40, 480] as const;
const CMP = { x: 40, y: 58 } as const;
const SAME_CHIP_Y = 236;

/**
 * s03-paralelo «Cuatro formas de probarlo».
 *   0 / ladder   the four steps rise from the floor: 1–3 dimmed, 4 under its «?» plate; an amber
 *                arrow climbs over them, «más real · más arriesgado».
 *   tabletop     step 1 lights (TABLETOP EXERCISE, its note; a table with four people on its face).
 *   simulation   step 1 steps back, step 2 lights (SIMULATION «sin mover producción»).
 *   parallel     step 3 lights; steps 1–2 make room for two theatres giving the same show
 *                («producción · con público», «respaldo · sin público»), «la misma función, a la vez».
 *   compare      production vs backup column by column (identical glyph pairs, no figures), a
 *                check per column, «igual»; on «funciona» an emerald check on step 3, whose note
 *                reads «el respaldo funciona, sin interrumpir».
 *   hidden       the theatres go, steps 1–3 come back lit on «nadie», the bar «toca producción:
 *                no» under them on «toca»; on «deja» they dim and step 4's «?» takes the focus. Holds.
 */
export function S03Paralelo(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const ladderAt = props.cue('ladder');
  const tabletopAt = props.cue('tabletop');
  const simulationAt = props.cue('simulation');
  const parallelAt = props.cue('parallel');
  const compareAt = props.cue('compare');
  const hiddenAt = props.cue('hidden');

  const at = {
    teatros: w('s03-04', 'teatros'),
    igual: w('s03-05', 'igual'),
    funciona: w('s03-05', 'funciona'),
    nadie: w('s03-06', 'nadie'),
    toca: w('s03-06', 'toca'),
    deja: w('s03-06', 'deja'),
  };

  const up = (start: number, dur = 14) => progress(frame, start, dur, EASE.inOut);

  // ---------------- The steps
  // Start before frame 0 so the first frame already shows the floor and the first step.
  const appear = [0, 1, 2, 3].map((i) => progress(frame, -12 + i * 5, 18));
  // Steps 1–2 leave room for the theatres from `parallel` and return on `hidden`.
  const back = up(hiddenAt + 4, 16);
  const away = up(parallelAt - 2, 14) * (1 - back);
  const allLit = up(at.nadie - 6, 12);
  const allDim = up(at.deja - 4, 14);
  const lateFocus = (f: number) => mix(mix(f, 1, allLit), 0.35, allDim);

  const f1 = lateFocus(mix(up(tabletopAt - 4), 0.3, up(simulationAt - 4)));
  const f2 = lateFocus(mix(up(simulationAt - 4), 0.3, up(parallelAt - 4)));
  const f3 = mix(up(parallelAt - 4), 0.35, allDim);
  const f4 = mix(0.45, 1, allDim);

  const views: StepView[] = [
    { show: appear[0] * (1 - away), focus: f1 },
    { show: appear[1] * (1 - away), focus: f2 },
    { show: appear[2], focus: f3 },
    { show: appear[3], focus: f4, hidden: 1 },
  ];
  const artViews: StepArtView[] = views.map((v) => ({ show: v.show ?? 1, focus: v.focus ?? 1, hidden: v.hidden }));

  // ---------------- The rising arrow
  const riseDraw = progress(frame, ladderAt - 2, 30, EASE.inOut);
  const riseOn = mix(1 - up(parallelAt - 6, 14), 0.6, up(hiddenAt + 6, 18));
  const riseLabel = progress(frame, ladderAt + 10, 16);
  const riseLen = Math.hypot(RISE.x1 - RISE.x0, RISE.y1 - RISE.y0);
  const ang = Math.atan2(RISE.y1 - RISE.y0, RISE.x1 - RISE.x0);
  const head = (dx: number, dy: number) => {
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    return `${RISE.x1 + dx * c - dy * s},${RISE.y1 + dx * s + dy * c}`;
  };

  // ---------------- The two theatres and the comparison
  const pairIn = progress(frame, parallelAt + 4, 18) * (1 - up(hiddenAt - 6, 10));
  const pairGlow = windowWeight(frame, at.teatros, compareAt, { ramp: 12 });
  const sameChip = progress(frame, parallelAt + 22, 16) * (1 - up(compareAt - 4, 10));
  const cmpShow = progress(frame, compareAt - 2, 12) * (1 - up(hiddenAt - 6, 10));
  const colAt = [0, 1, 2, 3].map((i) => mix(compareAt + 2, Math.max(compareAt + 20, at.igual - 10), i / 3));
  const cols = colAt.map((a) => progress(frame, a, 12));
  const checks = colAt.map((a) => progress(frame, a + 10, 10));
  const same = progress(frame, at.igual - 4, 12);

  // Step 3 works: an emerald check on its block from «funciona».
  const works = progress(frame, at.funciona - 4, 12);
  const c3 = COLS[2];
  const badge = { x: BOX.left + c3.x + c3.w - 16 - 28, y: BOX.top + c3.blockTop };

  // ---------------- `hidden`: the bar under steps 1–3
  const bar = progress(frame, at.toca - 4, 14) * back;
  const barX0 = BOX.left + COLS[0].x + 6;
  const barX1 = BOX.left + COLS[2].x + COLS[2].w - 22;
  const barY = BOX.top + BOX.height + 24;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* the rising arrow: realism and risk */}
      {riseOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: riseOn }}>
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line
              x1={RISE.x0}
              y1={RISE.y0}
              x2={RISE.x1}
              y2={RISE.y1}
              stroke={alpha(C.amber, 0.85)}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={`${riseLen} ${riseLen}`}
              strokeDashoffset={riseLen * (1 - riseDraw)}
            />
            {riseDraw > 0.96 ? (
              <path d={`M${head(-26, -14)} L${RISE.x1},${RISE.y1} L${head(-26, 14)}`} fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: RISE.x0,
              top: 38,
              fontSize: 40,
              fontWeight: 800,
              color: '#fcd34d',
              whiteSpace: 'nowrap',
              opacity: riseLabel,
              transform: `translateY(${(1 - riseLabel) * 8}px)`,
            }}
          >
            {RISE_LABEL}
          </div>
        </div>
      ) : null}

      {/* the four steps */}
      <div style={{ position: 'absolute', left: BOX.left, top: BOX.top, width: BOX.width, height: BOX.height }}>
        <Steps width={BOX.width} height={BOX.height} steps={views} frame={frame} />
        <StepArt width={BOX.width} height={BOX.height} views={artViews} />
      </div>

      {/* step 3 works */}
      {works > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: badge.x - 28,
            top: badge.y - 28,
            width: 56,
            height: 56,
            borderRadius: 28,
            display: 'grid',
            placeItems: 'center',
            background: alpha(C.emeraldDeep, 0.95),
            border: `3px solid ${C.emerald}`,
            boxShadow: `0 0 22px ${alpha(C.emerald, 0.5)}`,
            opacity: works * (1 - 0.35 * allDim),
            transform: `scale(${0.6 + 0.4 * works})`,
          }}
        >
          <Icon name="check" size={36} color="#a7f3d0" strokeWidth={3.2} />
        </div>
      ) : null}

      {/* the two theatres giving the same show */}
      {pairIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: pairIn }}>
          {(
            [
              { x: TH_X[0], p: PAIR.prod, audience: 'full', tone: 'cyan' },
              { x: TH_X[1], p: PAIR.backup, audience: 'empty', tone: 'sky' },
            ] as const
          ).map((t, i) => (
            <div key={t.p.label} style={{ position: 'absolute', left: t.x, top: TH_TOP + (1 - pairIn) * 20 }}>
              <Theatre
                kind="hot"
                width={TH_W}
                audience={t.audience}
                tone={t.tone}
                labelTone={t.tone}
                metaTone="muted"
                glow={0.7 * pairGlow}
                label={t.p.label}
                meta={t.p.sub}
                frame={frame + i * 9}
              />
            </div>
          ))}

          {/* «la misma función, a la vez» with a thread to each marquee */}
          {sameChip > 0.001 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: sameChip }}>
              <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                {TH_X.map((x) => {
                  const mx = x + TH.hallCenterX;
                  return (
                    <line key={x} x1={(TH_X[0] + TH_X[1] + TH_W) / 2 - 20} y1={SAME_CHIP_Y + 54} x2={mx} y2={TH_TOP + 8} stroke={alpha(C.cyanSoft, 0.7)} strokeWidth={3} strokeDasharray="8 8" strokeLinecap="round" />
                  );
                })}
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: TH_X[0],
                  width: TH_X[1] + TH_W - TH_X[0] - 40,
                  top: SAME_CHIP_Y,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    padding: '6px 26px',
                    borderRadius: RADIUS.pill,
                    border: `2.5px solid ${alpha(C.cyan, 0.75)}`,
                    background: C.ink900,
                    fontSize: 36,
                    fontWeight: 780,
                    color: C.textStrong,
                    whiteSpace: 'nowrap',
                    transform: `translateY(${(1 - sameChip) * 8}px)`,
                  }}
                >
                  {PAIR.same}
                </span>
              </div>
            </div>
          ) : null}

          {/* column by column */}
          <div style={{ position: 'absolute', left: CMP.x, top: CMP.y, width: COMPARE_W, height: COMPARE_H }}>
            <Compare show={cmpShow} cols={cols} checks={checks} same={same} />
          </div>
        </div>
      ) : null}

      {/* «toca producción: no» under steps 1–3 */}
      {bar > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: bar }}>
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <path
              d={`M${barX0},${barY - 12} L${barX0},${barY} L${barX1},${barY} L${barX1},${barY - 12}`}
              fill="none"
              stroke={alpha(C.cyan, 0.85)}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ position: 'absolute', left: barX0, width: barX1 - barX0, top: barY - 20, display: 'flex', justifyContent: 'center' }}>
            <span style={{ padding: '0 22px', background: C.ink950, fontSize: 34, lineHeight: '40px', fontWeight: 820, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
              {NO_TOUCH}
            </span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
