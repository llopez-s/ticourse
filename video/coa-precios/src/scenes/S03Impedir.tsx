import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { PHASE_IDS } from '../data/matrix';
import { S03 } from '../data/s03-impedir';
import { SHOP_AFTER_S02, SHOP_POSE, mixPose } from '../data/shop-poses';
import { Matrix, type MatrixProps } from './parts/Matrix';
import { Shop } from './parts/Shop';
import { AlonePhrase, VerbPill, WrapLine } from './parts/s03-impedir/Labels';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-impedir';
const W = STAGE.width;
/** The matrix beside the shop, and a little smaller once the closing line needs the bottom strip. */
const MATRIX = { wide: 928, wrap: 846, top: 20 } as const;
/** Under the shop: one pill per verb; under everything, the chapter's closing line. */
const PILL = { x: 16, deny: 440, disrupt: 510, h: 60 } as const;
const WRAP_TOP = 592;

/**
 * s03-impedir «Impedir o cortar».
 *   start         s02's shop, exactly as s02 left it; it steps down and left as GLASS VIPER's card takes
 *                 the top-centre band (nothing essential above y 230 until s03-01 ends).
 *   reply-alarm   the alarm rings and the shutter stays up: «una alarma sola / no para nada».
 *   matrix        the shop rises, the lesson's matrix enters on the right with its strips and its three
 *                 [!] marks; rows sweep on «fila», cells on «celda».
 *   shutter       the shutter comes down before whoever is coming gets to the door.
 *   deny          it turns emerald, DENY «no llega a funcionar»; the Deny column lights and, on «en tu
 *                 matriz», Exploitation's Deny cell lifts, readable.
 *   inside        the shutter goes back up; somebody at work inside is walked out to the street.
 *   disrupt       DISRUPT «lo cortas en curso»; the Disrupt column and Installation's cell.
 *   pair-ii       the two labels together, each brightening on its sentence (the exam card follows).
 *   wrap-i        «Discover y Detect miran · Deny y Disrupt paran» under everything. Holds.
 */
export function S03Impedir(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const io = (start: number, dur = 20) => progress(frame, start, dur, EASE.inOut);
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const enter = props.enterFrames;
  const replyAt = props.cue('reply-alarm');
  const matrixAt = props.cue('matrix');
  const shutterAt = props.cue('shutter');
  const denyAt = props.cue('deny');
  const insideAt = props.cue('inside');
  const disruptAt = props.cue('disrupt');
  const pairAt = props.cue('pair-ii');
  const wrapAt = props.cue('wrap-i');
  const s0301 = segment(props, 's03-01');

  // ---------------- The shop's place ----------------
  const toCard = io(Math.max(0, enter - 6), 24);
  const toBeside = io(matrixAt - 8, 26);
  const pose = mixPose(mixPose(SHOP_POSE.full, SHOP_POSE.card, toCard), SHOP_POSE.beside, toBeside);

  // ---------------- 1: an alarm alone ----------------
  const calm = io(enter, 20);
  const ringing = windowWeight(frame, replyAt + 2, matrixAt - 4, { ramp: 12 });
  const aloneIn = p(at('s03-01', 'una') - 2, 16) * (1 - io(Math.min(matrixAt - 14, s0301.to - 14), 12));
  const stress = p(at('s03-01', 'no') - 3, 10);

  // ---------------- 2: the matrix ----------------
  const matrixIn = p(matrixAt - 2, 20);
  const shrink = io(wrapAt - 10, 22);
  const mw = mix(MATRIX.wide, MATRIX.wrap, shrink);
  const filaAt = at('s03-02', 'fila') - 4;
  const celdaAt = at('s03-02', 'celda,') - 4;
  const rows: MatrixProps['rows'] = {};
  PHASE_IDS.forEach((id, i) => (rows[id] = { lit: 0.85 * windowWeight(frame, filaAt + i * 6, filaAt + i * 6 + 12, { ramp: 6, lead: 0 }) }));
  const cellPulse = 0.8 * windowWeight(frame, celdaAt, celdaAt + 30, { ramp: 10 });

  // ---------------- 3: DENY, the shutter before anybody gets in ----------------
  const comes = p(shutterAt - 2, 12) * (1 - io(insideAt - 12, 10));
  const walk = io(at('s03-03', 'antes') - 10, 46);
  const down = io(at('s03-03', 'persiana') - 6, 22) * (1 - io(insideAt - 12, 18));
  const denied = p(denyAt - 2, 10);
  const denyPill = p(denyAt - 2, 14);
  const denyCell = windowWeight(frame, at('s03-03', 'matriz,') - 6, insideAt - 6, { ramp: 12 });

  // ---------------- 4: DISRUPT, walked out in the middle of the job ----------------
  const worker = p(insideAt - 2, 12) * (1 - io(pairAt + 20, 16));
  const outAt = at('s03-04', 'sacar') + 14;
  const out = progress(frame, outAt, Math.max(40, at('s03-04', 'faena.') - outAt + 14), EASE.inOut);
  const escort = p(outAt - 10, 10);
  const disruptPill = p(disruptAt - 2, 14);
  const disruptCell = windowWeight(frame, at('s03-04', 'matriz,') - 6, pairAt - 6, { ramp: 12 });

  // ---------------- 5: the pair, then the chapter's line ----------------
  const onDeny = Math.max(windowWeight(frame, denyAt, insideAt - 6), windowWeight(frame, at('s03-05', 'Deny,') - 4, at('s03-05', 'Con', 1) - 4), windowWeight(frame, at('s03-06', 'Deny') - 4));
  const onDisrupt = Math.max(windowWeight(frame, disruptAt, pairAt - 6), windowWeight(frame, at('s03-05', 'Disrupt,') - 4, wrapAt - 6), windowWeight(frame, at('s03-06', 'Disrupt') - 4));
  const pairOn = p(pairAt - 4, 12);
  const wrapIn = p(wrapAt - 4, 14);
  const looks = p(at('s03-06', 'Discover') - 4, 10);
  const stops = p(at('s03-06', 'Deny') - 4, 10);
  const closing = io(at('s03-06', 'Deny') - 8, 22);

  const cells: MatrixProps['cells'] = {
    'exploitation-deny': { lit: Math.max(cellPulse, denyCell, 0.9 * pairOn), tone: 'emerald', lift: denyCell, shift: { y: -34 } },
    'installation-disrupt': { lit: Math.max(cellPulse, disruptCell, 0.9 * pairOn), tone: 'emerald', lift: disruptCell, shift: { y: 34 } },
  };
  const lookLit = Math.max(1 - 0.75 * io(matrixAt - 8, 20), looks);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: pose.x, top: pose.y }}>
        <Shop
          width={pose.w}
          phase={frame / fps}
          tape={Math.max(SHOP_AFTER_S02.tape * (1 - calm), looks)}
          tapeWound={SHOP_AFTER_S02.tapeWound}
          alarm={Math.max(lookLit, ringing)}
          ring={ringing}
          camera={lookLit}
          live={lookLit}
          cone={SHOP_AFTER_S02.cone * (1 - calm)}
          labels={SHOP_AFTER_S02.labels}
          shutter={Math.max(down, closing)}
          shutterLit={Math.max(denied * (1 - io(insideAt - 12, 10)), stops)}
          visitor={{ show: comes, at: walk }}
          ousted={{ show: worker, at: out, escort }}
        />
      </div>

      {/* The reply, beside the ringing alarm (under the intercepted message) */}
      <div style={{ position: 'absolute', left: 836, top: 318 }}>
        <AlonePhrase show={aloneIn} stress={stress} />
      </div>

      {/* The lesson's matrix */}
      <div style={{ position: 'absolute', left: W - mw, top: MATRIX.top + (1 - matrixIn) * 16 }}>
        <Matrix
          width={mw}
          show={matrixIn}
          rows={rows}
          cells={cells}
          cols={{ detect: looks, deny: Math.max(windowWeight(frame, denyAt, insideAt - 6), pairOn), disrupt: Math.max(windowWeight(frame, disruptAt, pairAt), pairOn) }}
        />
      </div>

      {/* The two verbs that stop, under the shop */}
      <div style={{ position: 'absolute', left: PILL.x, top: PILL.deny }}>
        <VerbPill name={S03.deny.name} sub={S03.deny.sub} show={denyPill} lit={onDeny} dim={(1 - onDeny) * (1 - pairOn) * p(insideAt - 8, 12)} height={PILL.h} />
      </div>
      <div style={{ position: 'absolute', left: PILL.x, top: PILL.disrupt }}>
        <VerbPill name={S03.disrupt.name} sub={S03.disrupt.sub} show={disruptPill} lit={onDisrupt} height={PILL.h} />
      </div>

      {/* Chapter close */}
      <div style={{ position: 'absolute', left: 0, top: WRAP_TOP, width: W, display: 'flex', justifyContent: 'center' }}>
        <WrapLine show={wrapIn} said={[looks, stops]} />
      </div>
    </Stage>
  );
}
