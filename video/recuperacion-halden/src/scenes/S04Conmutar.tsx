import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { STEPS_BOX } from '../data/s03-paralelo';
import { BACK, CHIPS, CHOICES, PARALLEL_LIMIT, REQUEST, SITES, VALIDATES, WINDOW } from '../data/s04-conmutar';
import { Stage, segment, wordFrame } from './kit';
import { Steps, stepsLayout, type StepView } from './parts/Steps';
import { Theatre, theatrePoint, theatreSize } from './parts/Theatre';
import { StepArt, type StepArtView } from './parts/s03-paralelo/StepArt';
import { ChoiceButton, CurvedArrow, Pill, Walkers } from './parts/s04-conmutar/bits';

const S = 's04-conmutar';
const W = STAGE.width;
const H = STAGE.height;

// ---- Layout (stage-local, 1728 × 660). The steps use s03's box, so they stand where s03 left
// them. Steps 1–2's place (left) holds the two theatres until `ladder-top`; steps 3–4's place
// (right) holds the four chips until `answer`.
// During the think hold (end of the question to the end of s04-02) the engine's card covers
// roughly x 220–1510, y 10–165: only the theatres, the two buttons (y 220–300) and the chips
// (x ≥ 990, y ≥ 236) are on screen then.
const BOX = STEPS_BOX;
const COLS = stepsLayout(BOX.width, BOX.height).columns;
const CARD = { x: 264, y: 6, w: 1200 } as const;
const THREAD_X = 990;
const CHIP_X = 1022;
const CHIP_Y0 = 236;
const CHIP_STEP = 90;
const BTN = { y: 220, w: 330, x: [60, 450] as const };

const TH_W = 300;
// The label ends on the steps' floor line (stage y 614), which is drawn even while the steps are away.
const TH_TOP = STEPS_BOX.top + STEPS_BOX.height - 2 - Math.ceil(theatreSize(TH_W, { label: true }).h);
const TH_X = [40, 480] as const;
const door = theatrePoint(TH_W, 'door');
const seats = theatrePoint(TH_W, 'seats');
const marquee = theatrePoint(TH_W, 'marquee');
// The way in: out of the main theatre's side door, into the reserve's seats.
const WALK = {
  from: { x: TH_X[0] + door.x, y: TH_TOP + door.y },
  ctrl: { x: (TH_X[0] + door.x + TH_X[1] + seats.x * 0.55) / 2, y: TH_TOP + door.y - 70 },
  to: { x: TH_X[1] + seats.x * 0.55, y: TH_TOP + seats.y - 6 },
};
// The way back, over the roofs: the reserve's marquee to the main one.
const RETURN = {
  from: { x: TH_X[1] + marquee.x, y: TH_TOP - 4 },
  ctrl: { x: (TH_X[0] + TH_X[1]) / 2 + marquee.x, y: TH_TOP - 92 },
  to: { x: TH_X[0] + marquee.x, y: TH_TOP - 4 },
};
const WALKERS = 8;
const WALK_GAP = 6;
const WALK_DUR = 44;

/**
 * s04-conmutar «Quién demuestra qué».
 *   ask         the request card, top, in the canon wording; two theatres on the left, «sitio
 *               principal» (full) and «sitio de reserva» (empty), a dashed way between them.
 *   chips       DNS · certificados · integraciones · permisos hang from the card on the right.
 *   think       the card leaves before the question ends (the engine's prompt takes the top band);
 *               two identical buttons «parallel» / «fail over» glow alike through the hold.
 *               Nothing answers: no step on screen, no FAIL OVER label.
 *   answer      «fail over» chosen, «parallel» steps back; the chips go and steps 3–4 come back:
 *               step 3 (PARALLEL PROCESSING) reads «prueba el respaldo, no el cambio de sitio»,
 *               step 4 still «?».
 *   swap        step 4 uncovers and lights (FAIL OVER), its tag flips to «toca producción: sí»;
 *               the audience walks out of the main theatre into the reserve one.
 *   window      «ventana de mantenimiento».   back   «plan de vuelta atrás», a way back over the roofs.
 *   ladder-top  the theatres go and steps 1–2 return: step 1 and step 4 lit, 2–3 dimmed; under
 *               the floor «TABLETOP · valida el plan» / «FAIL OVER · valida el sistema». Holds.
 */
export function S04Conmutar(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const askAt = props.cue('ask');
  const chipsAt = props.cue('chips');
  const answerAt = props.cue('answer');
  const swapAt = props.cue('swap');
  const windowAt = props.cue('window');
  const backAt = props.cue('back');
  const topAt = props.cue('ladder-top');
  const s02 = segment(props, 's04-02');

  const at = {
    reserva: w('s04-01', 'reserva'),
    usuarios: w('s04-01', 'usuarios'),
    paralelo: w('s04-02', 'paralelo'),
    over: w('s04-02', 'over'),
    prueba: w('s04-03', 'prueba'),
    mesa: w('s04-06', 'mesa'),
    failTop: w('s04-06', 'fail'),
  };
  // The think hold starts when the question has been said; the card must be gone by then.
  const holdStart = at.over + 12;

  const up = (start: number, dur = 14) => progress(frame, start, dur, EASE.inOut);

  // ---------------- Request card + chips (until the hold / the answer)
  const cardIn = progress(frame, Math.min(askAt - 10, -8), 16);
  const cardOut = up(at.over - 16, 14);
  const card = cardIn * (1 - cardOut);
  const chipP = CHIPS.map((_, i) => progress(frame, chipsAt - 2 + i * 6, 14));
  const chipsOut = up(answerAt, 12);
  const thread = progress(frame, chipsAt - 6, 16) * (1 - cardOut);

  // ---------------- Theatres (from `ask` to `ladder-top`)
  const thOut = up(topAt - 4, 14);
  const thIn = progress(frame, Math.max(2, askAt + 6), 18) * (1 - thOut);
  const waysIn = progress(frame, at.reserva - 6, 18);
  const walkT = Array.from({ length: WALKERS }, (_, i) => progress(frame, swapAt + 6 + i * WALK_GAP, WALK_DUR, EASE.linear));
  const seatedA = 1 - progress(frame, swapAt + 6, WALKERS * WALK_GAP, EASE.linear);
  const seatedB = progress(frame, swapAt + 6 + WALK_DUR - 4, WALKERS * WALK_GAP, EASE.linear);
  const arrived = progress(frame, swapAt + 6 + WALK_DUR + WALKERS * WALK_GAP - 10, 16);
  const mainGlow = windowWeight(frame, at.usuarios - 4, chipsAt + 20, { ramp: 10 });
  const reserveGlow = Math.max(windowWeight(frame, at.reserva - 4, at.usuarios, { ramp: 10 }), 0.75 * arrived);

  // ---------------- The two options
  const btnIn = progress(frame, at.paralelo - 6, 14) * (1 - up(swapAt - 4, 12));
  const holdGlow = windowWeight(frame, holdStart, s02.to, { ramp: 12 });
  const chosen = progress(frame, answerAt, 12);

  // ---------------- Steps 3–4 from `answer`, 1–2 from `ladder-top`
  const right = progress(frame, answerAt + 8, 18);
  const left = progress(frame, topAt + 2, 16);
  const limitFocus = windowWeight(frame, at.prueba - 6, swapAt, { ramp: 12 });
  const uncover = up(swapAt - 2, 14);
  const touches = up(swapAt + 2, 14);
  const lit4 = up(swapAt - 2, 12);
  // Step 4 turns emerald (proven) on `ladder-top`: a short dip hides the tone change.
  const dip = windowWeight(frame, topAt - 6, topAt + 4, { ramp: 6, lead: 0 });
  const proven = frame >= topAt - 1;
  const f1 = up(at.mesa - 6, 12);
  const f3 = mix(mix(0.45, 1, limitFocus), 0.25, up(topAt, 14));
  const f4 = mix(0.55, 1, lit4) * (1 - 0.55 * dip);

  const views: StepView[] = [
    { show: left, focus: f1 },
    { show: left, focus: 0.25 },
    { show: right, focus: f3, note: PARALLEL_LIMIT },
    { show: right, focus: f4, hidden: 1 - uncover, touches, tone: proven ? 'emerald' : 'cyan' },
  ];
  const artViews: StepArtView[] = views.map((v) => ({ show: v.show ?? 1, focus: v.focus ?? 1, hidden: v.hidden, tone: v.tone }));

  // ---------------- `window`, `back`, the bottom comparison
  const windowP = progress(frame, windowAt - 4, 14) * (1 - thOut);
  const backP = progress(frame, backAt - 4, 14) * (1 - thOut);
  const backDraw = progress(frame, backAt - 2, 22, EASE.inOut) * (1 - thOut);
  const cmpL = progress(frame, at.mesa - 4, 14);
  const cmpR = progress(frame, at.failTop - 4, 14);
  const cmpY = BOX.top + BOX.height + 2;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* the steps (3–4 from `answer`, 1–2 from `ladder-top`) */}
      <div style={{ position: 'absolute', left: BOX.left, top: BOX.top, width: BOX.width, height: BOX.height }}>
        <Steps width={BOX.width} height={BOX.height} steps={views} frame={frame} />
        <StepArt width={BOX.width} height={BOX.height} views={artViews} />
      </div>

      {/* the two theatres */}
      {thIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: thIn }}>
          <div style={{ position: 'absolute', left: TH_X[0], top: TH_TOP + (1 - thIn) * 18 }}>
            <Theatre kind="hot" width={TH_W} audience="full" seated={seatedA} tone="cyan" labelTone="cyan" glow={0.7 * mainGlow} label={SITES.main} frame={frame} />
          </div>
          <div style={{ position: 'absolute', left: TH_X[1], top: TH_TOP + (1 - thIn) * 18 }}>
            <Theatre kind="hot" width={TH_W} audience="empty" seated={seatedB} tone="sky" labelTone="sky" glow={0.7 * reserveGlow} label={SITES.reserve} frame={frame + 9} />
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {/* the way in: dashed until the audience takes it */}
            <CurvedArrow {...WALK} draw={waysIn} color={alpha(frame >= swapAt ? C.cyanSoft : C.muted, 0.85)} dashed={frame < swapAt} />
            <Walkers t={walkT} {...WALK} />
            {/* the way back */}
            <CurvedArrow {...RETURN} draw={backDraw} color={alpha(C.cyanSoft, 0.9)} dashed />
          </svg>
        </div>
      ) : null}

      {/* «ventana de mantenimiento» */}
      <div style={{ position: 'absolute', left: TH_X[0], top: 140 }}>
        <Pill icon="clock" tone={C.amber} p={windowP}>
          {WINDOW}
        </Pill>
      </div>
      {/* «plan de vuelta atrás», over the way back */}
      <div style={{ position: 'absolute', left: TH_X[0], width: TH_X[1] + TH_W - TH_X[0], top: 218, display: 'flex', justifyContent: 'center' }}>
        <Pill tone={C.cyan} p={backP} size={38}>
          {BACK}
        </Pill>
      </div>

      {/* the two options */}
      <div style={{ position: 'absolute', left: BTN.x[0], top: BTN.y }}>
        <ChoiceButton label={CHOICES.parallel} show={btnIn} state={-chosen} glow={holdGlow} width={BTN.w} />
      </div>
      <div style={{ position: 'absolute', left: BTN.x[1], top: BTN.y }}>
        <ChoiceButton label={CHOICES.failover} show={btnIn} state={chosen} glow={holdGlow} width={BTN.w} />
      </div>

      {/* chips hanging from the request */}
      {chipsOut < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - chipsOut }}>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: thread }}>
            <line x1={THREAD_X} y1={CARD.y + 180} x2={THREAD_X} y2={CHIP_Y0 + CHIP_STEP * 3 + 34} stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeLinecap="round" />
          </svg>
          {CHIPS.map((c, i) => (
            <div key={c.text} style={{ position: 'absolute', left: CHIP_X, top: CHIP_Y0 + i * CHIP_STEP }}>
              <svg width={40} height={70} style={{ position: 'absolute', left: THREAD_X - CHIP_X, top: 0, overflow: 'visible', opacity: thread * clamp01(chipP[i]) }}>
                <line x1={0} y1={34} x2={32} y2={34} stroke={alpha(C.cyan, 0.7)} strokeWidth={3} />
                <circle cx={0} cy={34} r={6} fill={C.cyan} />
              </svg>
              <Pill icon={c.icon} tone={C.sky} p={chipP[i]} glow={0.5 * holdGlow}>
                {c.text}
              </Pill>
            </div>
          ))}
        </div>
      ) : null}

      {/* the request */}
      {card > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            boxSizing: 'border-box',
            padding: '20px 40px 22px 36px',
            borderRadius: RADIUS.lg,
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            borderLeft: `8px solid ${C.cyan}`,
            background: alpha(C.ink900, 0.97),
            boxShadow: `0 0 34px ${alpha(C.cyan, 0.16)}`,
            fontSize: 40,
            lineHeight: 1.25,
            fontWeight: 650,
            color: C.textStrong,
            textWrap: 'balance',
            opacity: card,
            transform: `translateY(${(1 - cardIn) * 14 - cardOut * 16}px)`,
          }}
        >
          {REQUEST}
        </div>
      ) : null}

      {/* the bottom comparison */}
      {cmpL > 0.001 ? (
        <div style={{ position: 'absolute', left: BOX.left + COLS[0].x, top: cmpY }}>
          <Pill tone={C.cyan} p={cmpL} size={32} style={{ padding: '1px 20px', lineHeight: 1 }}>
            <span style={{ color: '#c4b5fd' }}>{VALIDATES[0].term}</span>
            <span style={{ color: C.muted }}>·</span>
            {VALIDATES[0].text}
          </Pill>
        </div>
      ) : null}
      {cmpR > 0.001 ? (
        <div style={{ position: 'absolute', right: W - (BOX.left + COLS[3].x + COLS[3].w), top: cmpY }}>
          <Pill tone={C.emerald} p={cmpR} size={32} style={{ padding: '1px 20px', lineHeight: 1 }}>
            <span style={{ color: '#c4b5fd' }}>{VALIDATES[1].term}</span>
            <span style={{ color: C.muted }}>·</span>
            {VALIDATES[1].text}
          </Pill>
        </div>
      ) : null}
    </Stage>
  );
}
