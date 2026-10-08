import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { IPS, ONLY_INLINE, PUNCH } from '../data/s09-camara';
import { Axes, AXES_W, type Quadrant } from './parts/s09-camara/Axes';
import { CameraGate, GATE_W } from './parts/s09-camara/CameraGate';
import { DemoLanes, LANES_H, LANES_W } from './parts/s09-camara/DemoLanes';
import { PlanStamp } from './parts/s09-camara/PlanStamp';
import { PLAN_H, PLAN_W, SensorPlan } from './parts/s09-camara/SensorPlan';
import { Stage, segment, wordFrame } from './kit';

const S = 's09-camara';
const W = STAGE.width;
const H = STAGE.height;

/** Phase A: the plan's sensors, centred, then shrunk to the left when the camera comes in. */
const PLAN_SCALE = 0.66;
const PLAN_START = { x: (W - PLAN_W) / 2, y: (H - PLAN_H) / 2 };
const PLAN_END = { x: 0, y: (H - PLAN_H * PLAN_SCALE) / 2 };
const GATE_X = W - GATE_W;

/** Phase B: the cross, centred, then to the left when the lanes come in; lanes and a caption strip on the right. */
const AXES_CENTRED = (W - AXES_W) / 2;
const LANES_X = W - LANES_W;
const LANES_Y = 6;
const STRIP_Y = LANES_Y + LANES_H + 18;
const STRIP_H = H - STRIP_Y;

/** Plain trucks pass every TRUCK_GAP frames around the rose one; each pass lasts TRUCK_DUR. */
const TRUCK_GAP = 46;
const TRUCK_DUR = 92;
/** Pass fraction at which a truck's nose crosses the camera's cone (just past the barrier). */
const IN_CONE = 0.46;

/**
 * s09-camara «La cámara no baja la barrera». Three movements:
 *  A) On `sensors`, the plan (blueprint) puts more sensors on the traffic — on
 *     a tap and on a switch's mirror port — and each receives a copy of every
 *     packet. On `camera` the plan steps back to the left and the port's gate
 *     comes in with the fence camera on its pole: trucks drive through the
 *     raised barrier, the camera sees them all, raises an alert at the rose
 *     one, and the truck drives on — it never lowers the barrier.
 *  B) On `axes`, two crossed axes: dónde está (INLINE · TAP) and qué puede
 *     hacer (ACTIVE · PASSIVE); their quadrants hold the staffed checkpoint
 *     (inline × active, it stops) and the camera (tap × passive, it sees). On
 *     `alert-passes` the cross moves left and two lanes show the same bad
 *     packet: through a tap it raises an alert and keeps going; through an
 *     inline + active device it is dropped exactly on `drop` (the «block»
 *     sfx). s09-05 (no cue): both names light («las dos cosas»), and the
 *     «IPS» on a mirror port gets its name struck through, with «un IPS en un
 *     puerto espejo no para nada, aunque se llame IPS». On `blind` the tap's
 *     sensor goes dark — «punto ciego · no corta nada», the traffic still
 *     flows; on `only-inline` the INLINE half and the inline device light,
 *     «el modo de fallo solo se decide para lo que va en línea».
 *  C) On `approved`, the board steps back for «ver no es parar» and the plan's
 *     stamp lands (canon string, two lines) and holds to the end.
 * The top-centre band has no card in this scene; the exam card (on `drop`)
 * draws in the top band, outside the stage.
 */
export function S09Camara(props: SceneProps) {
  const frame = useCurrentFrame();

  // ---- Timing (all from cues and words) ------------------------------------
  const sensorsAt = props.cue('sensors');
  const copyW = wordFrame(S, 's09-01', 'copia');
  const cameraAt = props.cue('camera');
  const seesW = wordFrame(S, 's09-02', 'Ve');
  const alertsW = wordFrame(S, 's09-02', 'avisa');
  const barrierW = wordFrame(S, 's09-02', 'baja');
  const axesAt = props.cue('axes');
  const whereW = wordFrame(S, 's09-03', 'Está');
  const inlineW = wordFrame(S, 's09-03', 'inline');
  const tapW = wordFrame(S, 's09-03', 'tap');
  const whatW = wordFrame(S, 's09-03', 'Actúa');
  const activeW = wordFrame(S, 's09-03', 'Active');
  const passiveW = wordFrame(S, 's09-03', 'passive');
  const alertAt = props.cue('alert-passes');
  const alarmW = wordFrame(S, 's09-04', 'alerta');
  const goesOnW = wordFrame(S, 's09-04', 'sigue');
  const dropAt = props.cue('drop');
  const both = segment(props, 's09-05');
  const twoW = wordFrame(S, 's09-05', 'dos');
  const nameW = wordFrame(S, 's09-05', 'llame', 0);
  const blindAt = props.cue('blind');
  const onlyAt = props.cue('only-inline');
  const approvedAt = props.cue('approved');
  const stampAt = Math.min(wordFrame(S, 's09-07', 'aprobado') - 4, approvedAt + 36);

  // ---- A) sensors on the plan, then the fence camera -------------------------
  const aOut = progress(frame, axesAt - 10, 14, EASE.inOut);
  const planDraw = progress(frame, -6, 16);
  const sensors = progress(frame, sensorsAt - 2, 14);
  const copyCaption = progress(frame, copyW - 6, 12);
  const move = progress(frame, cameraAt - 8, 22, EASE.inOut);
  const planX = mix(PLAN_START.x, PLAN_END.x, move);
  const planY = mix(PLAN_START.y, PLAN_END.y, move);
  const planScale = mix(1, PLAN_SCALE, move);

  const gateShow = progress(frame, cameraAt - 4, 16);
  const cameraIn = progress(frame, cameraAt + 2, 14);
  // The rose truck crosses the camera's cone as the voice says «avisa»; plain trucks pass before and after it.
  const badStart = alertsW - 6 - IN_CONE * TRUCK_DUR;
  const passOf = (start: number) => progress(frame, start, TRUCK_DUR, EASE.linear);
  const trucks: number[] = [];
  for (let j = -4; j <= 4; j++) {
    if (j === 0) continue;
    const start = badStart + j * TRUCK_GAP;
    if (start < cameraAt - TRUCK_DUR * 0.4 || start > axesAt) continue;
    trucks.push(passOf(start));
  }
  const camAlert = progress(frame, alertsW - 6, 8);
  const gateLines = [progress(frame, seesW - 4, 12), progress(frame, alertsW - 4, 12), progress(frame, barrierW - 4, 12)] as const;

  // ---- B) the axes and the two lanes ----------------------------------------
  const bIn = progress(frame, axesAt - 4, 12);
  const slide = progress(frame, alertAt - 26, 22, EASE.inOut);
  const axesX = mix(AXES_CENTRED, 0, slide);
  const lines = { h: progress(frame, axesAt - 6, 14), v: progress(frame, axesAt, 14) };
  const labels = { h: progress(frame, whereW - 6, 16), v: progress(frame, whatW - 6, 16) };
  // «Hazte dos preguntas»: the two questions are there as soon as the axes grow.
  const questions = { h: progress(frame, axesAt - 2, 12), v: progress(frame, axesAt + 6, 12) };
  const twoNames = windowWeight(frame, twoW - 2, nameW + 4);
  const names = {
    inline: Math.max(windowWeight(frame, inlineW, inlineW + 34), twoNames, windowWeight(frame, onlyAt + 6, approvedAt)),
    tap: windowWeight(frame, tapW, tapW + 34),
    active: Math.max(windowWeight(frame, activeW, activeW + 34), twoNames),
    passive: windowWeight(frame, passiveW, passiveW + 34),
  };
  const tilesIn = progress(frame, passiveW + 8, 14);
  const tiles: Record<Quadrant, number> = { tl: tilesIn, tr: tilesIn, bl: tilesIn, br: tilesIn };
  const content: Record<Quadrant, number> = {
    tl: progress(frame, dropAt - 34, 14),
    br: progress(frame, alertAt, 14),
    tr: progress(frame, nameW - 4, 12),
    bl: 0,
  };
  const litTl = Math.max(windowWeight(frame, dropAt - 34, nameW), windowWeight(frame, onlyAt, approvedAt));
  const litBr = Math.max(windowWeight(frame, alertAt, dropAt - 34), windowWeight(frame, blindAt, onlyAt));
  const litTr = windowWeight(frame, nameW, blindAt);
  const litBl = windowWeight(frame, onlyAt, approvedAt);
  const lit: Record<Quadrant, number> = { tl: litTl, tr: litTr, bl: litBl, br: litBr };
  const focusStarts = Math.max(litTl, litBr, litTr, litBl);
  const dimOf = (own: number) => clamp01(focusStarts - own) * 0.8;
  const dim: Record<Quadrant, number> = { tl: dimOf(litTl), tr: dimOf(litTr), bl: dimOf(litBl), br: dimOf(litBr) };
  const cameraPower = 1 - progress(frame, blindAt, 8);
  const halfInline = windowWeight(frame, onlyAt, approvedAt);
  const ipsStrike = progress(frame, nameW + 8, 12, EASE.inOut);

  const lanesShow = [progress(frame, alertAt - 6, 16), progress(frame, alertAt + 4, 16)] as const;
  const atTap = alarmW - 30;
  const tapTimes = {
    start: Math.max(alertAt + 6, atTap - 36),
    atTap,
    exit: Math.max(atTap + 30, goesOnW + 12),
    copyFrames: 22,
    passesLabel: goesOnW - 4,
    blind: blindAt,
  };
  const inlineTimes = { start: dropAt - 32, drop: dropAt };
  const focusTap = Math.max(windowWeight(frame, alertAt, dropAt - 34), windowWeight(frame, blindAt, onlyAt));
  const focusInline = Math.max(windowWeight(frame, dropAt - 34, both.from + 10), windowWeight(frame, onlyAt, approvedAt));
  const dimTap = Math.max(windowWeight(frame, dropAt - 34, blindAt), windowWeight(frame, onlyAt, approvedAt)) * 0.9;
  const dimInline = Math.max(windowWeight(frame, alertAt, dropAt - 34), windowWeight(frame, blindAt, onlyAt)) * 0.7;
  const deviceGlow = windowWeight(frame, onlyAt, approvedAt);

  const ipsCaption = progress(frame, nameW - 2, 12) * (1 - progress(frame, onlyAt - 10, 10));
  const inlineCaption = progress(frame, onlyAt, 14);

  // ---- C) «ver no es parar» and the stamp ------------------------------------
  const cIn = progress(frame, approvedAt - 4, 14, EASE.inOut);
  const punch = progress(frame, approvedAt + 2, 14);

  return (
    <Stage>
      {/* ================= A ================= */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut }}>
          <div style={{ position: 'absolute', left: planX, top: planY, transform: `scale(${planScale})`, transformOrigin: '0 0' }}>
            <SensorPlan frame={frame} draw={planDraw} sensors={sensors} copyCaption={copyCaption} dim={0.45 * move} />
          </div>
          <div style={{ position: 'absolute', left: GATE_X, top: 46 }}>
            <CameraGate
              frame={frame}
              show={gateShow}
              camera={cameraIn}
              trucks={trucks}
              bad={progress(frame, badStart, TRUCK_DUR, EASE.linear)}
              alert={camAlert}
              lines={gateLines}
            />
          </div>
        </div>
      ) : null}

      {/* ================= B ================= */}
      {bIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: bIn * (1 - 0.82 * cIn),
            filter: cIn > 0.01 ? `blur(${(2.5 * cIn).toFixed(2)}px) saturate(${1 - 0.5 * cIn})` : undefined,
          }}
        >
          <div style={{ position: 'absolute', left: axesX, top: 0 }}>
            <Axes
              frame={frame}
              lines={lines}
              labels={labels}
              questions={questions}
              names={names}
              tiles={tiles}
              content={content}
              lit={lit}
              dim={dim}
              ipsStrike={ipsStrike}
              cameraPower={cameraPower}
              halfInline={halfInline}
            />
          </div>
          <div style={{ position: 'absolute', left: LANES_X, top: LANES_Y }}>
            <DemoLanes
              frame={frame}
              show={lanesShow}
              tap={tapTimes}
              inline={inlineTimes}
              focusTap={focusTap}
              focusInline={focusInline}
              dimTap={dimTap}
              dimInline={dimInline}
              deviceGlow={deviceGlow}
            />
          </div>
          {/* caption strip under the lanes */}
          <CaptionBox show={ipsCaption} color={C.rose} lines={IPS.caption} />
          <CaptionBox show={inlineCaption} color={C.cyan} lines={ONLY_INLINE} />
        </div>
      ) : null}

      {/* ================= C ================= */}
      {cIn > 0 ? (
        <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: W,
              top: 92,
              textAlign: 'center',
              fontSize: 68,
              fontWeight: 850,
              letterSpacing: -1.2,
              color: C.textStrong,
              opacity: punch,
              transform: `translateY(${(1 - punch) * 18}px)`,
              textShadow: `0 4px 30px ${alpha('#000000', 0.6)}`,
            }}
          >
            {PUNCH.split(' ').map((w, k, all) => (
              <span key={k} style={k === 0 ? { color: C.cyan } : k === all.length - 1 ? { color: '#6ee7b7' } : undefined}>
                {k ? ' ' : ''}
                {w}
              </span>
            ))}
          </div>
          <div style={{ position: 'absolute', left: 0, width: W, top: 250, display: 'flex', justifyContent: 'center' }}>
            <PlanStamp frame={frame} at={stampAt} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** A two-line caption in the strip under the lanes. */
function CaptionBox({ show, color, lines }: { show: number; color: string; lines: readonly string[] }) {
  const s = clamp01(show);
  if (s <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: LANES_X,
        top: STRIP_Y,
        width: LANES_W,
        height: STRIP_H,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 26px',
        borderRadius: 18,
        border: `3px solid ${alpha(color, 0.7)}`,
        background: `linear-gradient(180deg, ${alpha(color, 0.12)} 0%, ${alpha(C.ink900, 0.94)} 100%)`,
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        lineHeight: 1.22,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 12}px)`,
      }}
    >
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  );
}
