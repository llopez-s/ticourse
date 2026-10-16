import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { PAIR, SIGMA_LABEL, SUITCASE_ITEMS, YARA_LABEL } from '../data/s02-miradas';
import { GATE_ASPECT, Gate, SCANNER_ASPECT, Scanner } from './parts/Airport';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-miradas';
const W = STAGE.width;
const VIOLET = '#c4b5fd';

/** The terminal floor: both controls stand on it. */
const FLOOR_Y = 540;
/** The scanner, left (its legs end at 346/360 of its height). */
const SCN = { x: 40, w: 740 } as const;
const SCN_H = SCN.w * SCANNER_ASPECT;
const SCN_Y = FLOOR_Y - SCN.w * (346 / 640);
/** The gate, right (its floor line is at 372/400 of its height). */
const GATE = { w: 720 } as const;
const GATE_X = W - 40 - GATE.w;
const GATE_K = GATE.w / 680;
const GATE_Y = FLOOR_Y - 372 * GATE_K;
/** Where the leaders point: into the X-ray window, and to the top of the magnifying glass. */
const SCN_K = SCN.w / 640;
const YARA_POINT = { x: SCN.x + 400 * SCN_K, y: SCN_Y + 104 * SCN_K } as const;
const LENS_POINT = { x: GATE_X + 432 * GATE_K, y: GATE_Y + (212 - 82) * GATE_K } as const;
const LABEL_H = 108;
const YARA_CX = SCN.x + (SCN.w / 2);
const SIGMA_CX = 1400;
const CHIPS_TOP = 584;
const GATE_CX = GATE_X + GATE.w / 2;

/**
 * s02-miradas «Un escáner y un registro». The airport in elevation: the terminal's back wall and floor,
 * with the baggage scanner on the left and the boarding gate with its logbook on the right, both dim from
 * the first frame.
 *   airport       the wall and the floor light; the suitcase waits at the start of the belt.
 *   scanner       the suitcase rides into the scanner and its contents show inside (a bottle, an umbrella,
 *                 a book: what anybody carries).
 *   yara-inside   «YARA» · «mira dentro: ficheros y memoria» above it, its leader into the X-ray window.
 *   gate          the scanner steps back; a passenger walks through the gate and a line is written in the
 *                 logbook (boarding card + passport).
 *   sigma-events  a magnifying glass comes over the logbook — Sigma READS it — with «SIGMA» · «lee lo que
 *                 ocurre: los registros» above, its leader to the glass (not to the act of writing).
 *   pair          both come back; «YARA: lo que hay dentro» under the scanner, «Sigma: lo que ha pasado»
 *                 under the gate, each on its word. On «Empezamos» the scanner comes forward and the gate
 *                 steps back. Holds.
 */
export function S02Miradas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const airportAt = props.cue('airport');
  const scannerAt = props.cue('scanner');
  const yaraAt = props.cue('yara-inside');
  const gateAt = props.cue('gate');
  const sigmaAt = props.cue('sigma-events');
  const pairAt = props.cue('pair');
  const s3 = segment(props, 's02-03');
  const startAt = wordFrame(S, 's02-05', 'Empezamos');

  const wallIn = progress(frame, Math.min(2, airportAt - 14), 16) * (0.55 + 0.45 * progress(frame, airportAt - 4, 16));
  const partsIn = progress(frame, 2, 14);

  // Scanner: dim until its cue; back while the gate speaks; forward again on «Empezamos».
  const scnOn = progress(frame, scannerAt - 6, 14);
  const scnBack = windowWeight(frame, gateAt - 4, pairAt - 6, { ramp: 14 });
  const forward = progress(frame, startAt - 6, 18, EASE.inOut);
  const scnDim = Math.max(0.65 * (1 - scnOn), 0.5 * scnBack);
  const travel = mix(0.25, 0.5, progress(frame, scannerAt - 4, 40, EASE.inOut));
  const xray = progress(frame, scannerAt + 18, 20);

  // Gate: dim until its cue; back again on «Empezamos».
  const gateOn = progress(frame, gateAt - 6, 14);
  const gateDim = Math.max(0.65 * (1 - gateOn), 0.5 * forward);
  const pass = progress(frame, gateAt - 2, Math.max(20, wordFrame(S, 's02-03', 'tarjeta') - gateAt), EASE.inOut);
  const write = progress(frame, wordFrame(S, 's02-03', 'tarjeta') - 6, Math.max(24, s3.to - wordFrame(S, 's02-03', 'tarjeta') - 10), EASE.linear);
  const lens = progress(frame, sigmaAt - 6, 22, EASE.out);

  const yaraIn = progress(frame, yaraAt - 4, 16);
  const sigmaIn = progress(frame, sigmaAt + 4, 16);
  const yaraDim = 0.45 * scnBack;
  const beat = pulse(frame, fps, 0.5);

  return (
    <Stage>
      {/* The terminal: back wall and floor */}
      <svg width={W} height={STAGE.height} viewBox={`0 0 ${W} ${STAGE.height}`} style={{ position: 'absolute', left: 0, top: 0, opacity: wallIn }}>
        {Array.from({ length: 8 }, (_, i) => {
          const pw = 196;
          const x = 18 + i * (pw + 18);
          return <rect key={i} x={x} y={128} width={pw} height={FLOOR_Y - 150} rx={6} fill={alpha(C.sky, 0.035)} stroke={alpha(C.sky, 0.14)} strokeWidth={2} />;
        })}
        <path d={`M 0 120 L ${W} 120`} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
        <rect x={0} y={FLOOR_Y} width={W} height={STAGE.height - FLOOR_Y} fill={alpha(C.sky, 0.04)} />
        <path d={`M 0 ${FLOOR_Y} L ${W} ${FLOOR_Y}`} stroke={alpha(C.sky, 0.5)} strokeWidth={3} />
        {Array.from({ length: 19 }, (_, i) => {
          const x = i * 96;
          return <path key={i} d={`M ${x} ${FLOOR_Y + 4} L ${x - 24} ${FLOOR_Y + 30}`} stroke={alpha(C.sky, 0.14)} strokeWidth={2} />;
        })}
      </svg>

      {/* The baggage scanner (YARA) */}
      <div
        style={{
          position: 'absolute',
          left: SCN.x,
          top: SCN_Y,
          width: SCN.w,
          height: SCN_H,
          opacity: partsIn,
          transform: `scale(${1 + 0.04 * forward})`,
          transformOrigin: '50% 100%',
          filter: forward > 0.02 ? `drop-shadow(0 0 ${Math.round(22 * forward)}px ${alpha(C.cyan, 0.3 * forward)})` : undefined,
        }}
      >
        <Scanner width={SCN.w} items={SUITCASE_ITEMS} travel={travel} xray={xray} dim={scnDim} />
      </div>

      {/* The boarding gate and its logbook; Sigma's magnifying glass reads it */}
      <div style={{ position: 'absolute', left: GATE_X, top: GATE_Y, width: GATE.w, height: GATE.w * GATE_ASPECT, opacity: partsIn }}>
        <Gate width={GATE.w} pass={pass} write={write} lines={3} lens={lens} dim={gateDim} />
      </div>

      {/* Labels and their leaders */}
      <svg width={W} height={STAGE.height} viewBox={`0 0 ${W} ${STAGE.height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Leader x={YARA_POINT.x} y0={LABEL_H + 4} y1={YARA_POINT.y} draw={progress(frame, yaraAt + 2, 14)} color={C.cyan} dim={yaraDim} />
        <Leader x={LENS_POINT.x} y0={LABEL_H + 4} y1={LENS_POINT.y} draw={progress(frame, sigmaAt + 10, 14)} color={C.cyan} dim={0.45 * forward} />
      </svg>
      <Label cx={YARA_CX} name={YARA_LABEL.name} text={YARA_LABEL.text} p={yaraIn} dim={yaraDim} glow={forward} />
      <Label cx={SIGMA_CX} name={SIGMA_LABEL.name} text={SIGMA_LABEL.text} p={sigmaIn} dim={0.45 * forward} glow={0} />

      {/* The pair */}
      {PAIR.map((c, i) => {
        const at = Math.max(pairAt - 4, wordFrame(S, 's02-05', c.word) - 6);
        const e = enter(frame, at, { distance: 16 });
        const on = i === 0 ? forward : 0;
        const dim = i === 1 ? 0.45 * forward : 0;
        return (
          <div key={c.name} style={{ position: 'absolute', left: (i === 0 ? YARA_CX : GATE_CX) - 400, top: CHIPS_TOP, width: 800, display: 'flex', justifyContent: 'center', ...e, opacity: e.opacity * (1 - dim) }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                height: 64,
                boxSizing: 'border-box',
                padding: '9px 32px 0',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.cyan, 0.6 + 0.3 * on)}`,
                background: alpha(C.cyan, 0.1 + 0.08 * on),
                boxShadow: `0 0 ${Math.round(14 + 18 * on * (0.7 + 0.3 * beat))}px ${alpha(C.cyan, 0.2 + 0.15 * on)}`,
                fontFamily: FONT.sans,
                fontSize: 38,
                fontWeight: 750,
                color: C.textStrong,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 900, color: VIOLET }}>{c.name}</span>
              <span>{c.rest}</span>
            </div>
          </div>
        );
      })}
    </Stage>
  );
}

/** A label above an object: the rule's name (exam term, violet) and what it looks at. */
function Label({ cx, name, text, p, dim, glow }: { cx: number; name: string; text: string; p: number; dim: number; glow: number }) {
  if (p <= 0) return null;
  const w = 760;
  return (
    <div
      style={{
        position: 'absolute',
        left: Math.min(W - w, Math.max(0, cx - w / 2)),
        top: 0,
        width: w,
        height: LABEL_H,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: p * (1 - dim),
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      <div style={{ fontSize: 54, lineHeight: 1, fontWeight: 900, letterSpacing: 1, color: VIOLET, textShadow: `0 0 ${Math.round(18 + 16 * glow)}px ${alpha(C.violet, 0.35 + 0.2 * glow)}` }}>{name}</div>
      <div style={{ marginTop: 8, fontSize: 38, lineHeight: 1.1, fontWeight: 750, color: C.textStrong }}>{text}</div>
    </div>
  );
}

/** A thin vertical leader from a label down to what it names, ending in a dot. */
function Leader({ x, y0, y1, draw, color, dim }: { x: number; y0: number; y1: number; draw: number; color: string; dim: number }) {
  if (draw <= 0) return null;
  const y = y0 + (y1 - y0) * draw;
  return (
    <g opacity={1 - dim}>
      <path d={`M ${x} ${y0} L ${x} ${y}`} stroke={alpha(color, 0.8)} strokeWidth={3} strokeDasharray="8 6" />
      {draw > 0.95 ? <circle cx={x} cy={y1} r={7} fill={color} stroke={C.ink950} strokeWidth={2} /> : null}
    </g>
  );
}

