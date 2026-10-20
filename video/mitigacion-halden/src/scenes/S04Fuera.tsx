import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { COAT_LABEL, HEATER_LABEL, HIPS_HIDS, PLACES, RULE, TRAVELS } from '../data/s04-fuera';
import { Coat, Heater } from './parts/Coat';
import { LAPTOP, Laptop, RING } from './parts/Laptop';
import { CaseTag, Pill } from './parts/Labels';
import { ImageTag } from './parts/Tags';
import { DOOR, OFF, Office } from './parts/s04-fuera/Office';
import { Outside, SPOT } from './parts/s04-fuera/Outside';
import { Stage, wordFrame } from './kit';

const S = 's04-fuera';
const LAP_IN = 110;
const LAP_OUT = 150;
const PATH: [number, number][] = [
  [430, 236],
  [DOOR.x + DOOR.w / 2, OFF.y + OFF.h - 30],
  [DOOR.x + DOOR.w / 2, 470],
  [SPOT.x, 470],
  [SPOT.x, SPOT.y],
];
const CHIPS_X = 800;
const CHIPS_TOP = 398;
const CHIP_STEP = 68;

/** The point at fraction `p` (0–1) along a polyline, by length. */
function along(points: [number, number][], p: number): [number, number] {
  const segs = points.slice(1).map((pt, i) => Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1]));
  let left = segs.reduce((a, b) => a + b, 0) * Math.min(1, Math.max(0, p));
  for (let i = 0; i < segs.length; i++) {
    if (left <= segs[i]) {
      const k = segs[i] === 0 ? 0 : left / segs[i];
      return [points[i][0] + (points[i + 1][0] - points[i][0]) * k, points[i][1] + (points[i + 1][1] - points[i][1]) * k];
    }
    left -= segs[i];
  }
  return points[points.length - 1];
}

/**
 * s04-fuera «Cuando el portátil sale». The office in schematic (no names) from `office`; on `perimeter` the firewall
 * lights between the office and «Internet». On `leaves` the laptop walks out of the door to the «red de fuera» and the
 * places light on their words; on `neighbours` the devices next to it reach for it with rose arrows and its screen
 * glitches — they never went through the office's firewall. On `travels` three chips line up under it; on `fw` an
 * emerald ring snaps shut round the laptop (the lock sound) and the arrows stop at it, crossed out. «HIPS bloquea · HIDS
 * solo avisa» on `hips-hids`; on `coat` the heater and the coat (imagen · no es del puerto) and the rule in plain words.
 */
export function S04Fuera(props: SceneProps) {
  const frame = useCurrentFrame();
  const officeAt = props.cue('office');
  const perimAt = props.cue('perimeter');
  const leavesAt = props.cue('leaves');
  const neighAt = props.cue('neighbours');
  const travelsAt = props.cue('travels');
  const fwAt = props.cue('fw');
  const hipsAt = props.cue('hips-hids');
  const coatAt = props.cue('coat');
  const placeAt = PLACES.map((p) => (p.word ? wordFrame(S, 's04-02', p.word) - 6 : wordFrame(S, 's04-02', 'feria') + 10));
  const chipLit = TRAVELS.map((t) => wordFrame(S, t.seg, t.word) - 6);
  const abrigoAt = wordFrame(S, 's04-05', 'abrigo') - 6;
  const fueraAt = wordFrame(S, 's04-05', 'fuera') - 6;

  const caseIn = enter(frame, -6, { distance: 12, duration: 14 });
  const officeIn = 0.3 + 0.7 * progress(frame, officeAt - 4, 16);
  const wall = progress(frame, perimAt, 16);
  const walk = progress(frame, leavesAt + 4, 70, EASE.inOut);
  const [lx, ly] = along(PATH, walk);
  const lapW = mix(LAP_IN, LAP_OUT, progress(frame, leavesAt + 30, 40, EASE.inOut));
  const outShow = 0.35 + 0.65 * progress(frame, leavesAt, 18);
  const placeOn = placeAt.map((a) => progress(frame, a, 10));
  const reach = progress(frame, neighAt - 4, 16);
  const glitch = frame >= neighAt - 2 ? Math.max(0, 1 - (frame - neighAt + 2) / 34) : 0;
  const shield = progress(frame, fwAt - 10, 10, EASE.inOut);
  const snap = frame >= fwAt ? Math.max(0, 1 - (frame - fwAt) / 14) : 0;
  const stop = progress(frame, fwAt, 12);
  const ringR = (RING.r * LAP_OUT) / LAPTOP.w;
  const lapScale = lapW / LAPTOP.w;
  const hipsIn = progress(frame, hipsAt, 14);
  const heaterIn = enter(frame, coatAt, { distance: 14, duration: 14 });
  const coatIn = enter(frame, abrigoAt, { distance: 14, duration: 14 });
  const ruleIn = enter(frame, Math.max(coatAt + 10, fueraAt), { distance: 14, duration: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...caseIn }}>
        <CaseTag />
      </div>
      <Office show={officeIn} wall={wall} />
      <Outside show={outShow} placeOn={placeOn} reach={reach} stop={stop} ringR={ringR} />

      {/* The laptop (centre of its screen at the path point) */}
      <div style={{ position: 'absolute', left: lx - (LAPTOP.w * lapScale) / 2, top: ly - RING.cy * lapScale }}>
        <Laptop width={lapW} glitch={glitch} shield={shield} snap={snap} frame={frame} />
      </div>

      {/* What travels with it */}
      {TRAVELS.map((t, i) => {
        const show = progress(frame, travelsAt + i * 6, 12);
        if (show <= 0.01) return null;
        const lit = i === 0 ? progress(frame, Math.min(fwAt, chipLit[0]), 12) : progress(frame, chipLit[i], 12);
        const level = t.dim ? 0.55 : 0.55 + 0.45 * lit;
        return (
          <div key={t.term} style={{ position: 'absolute', left: CHIPS_X, top: CHIPS_TOP + i * CHIP_STEP, opacity: show * level, transform: `translateY(${(1 - show) * 12}px)` }}>
            <Pill
              icon={t.icon}
              tone={i === 0 ? C.emerald : C.cyan}
              on={t.dim ? 0.2 : lit}
              size={32}
              text={
                <span>
                  <span style={{ fontWeight: 850 }}>{t.term}</span>
                  <span style={{ color: C.muted, fontWeight: 650 }}>: {t.what}</span>
                </span>
              }
            />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: CHIPS_X + 6, top: CHIPS_TOP + 3 * CHIP_STEP + 6, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: '#c4b5fd', opacity: hipsIn, whiteSpace: 'nowrap' }}>
        {HIPS_HIDS}
      </div>

      {/* The heater and the coat, and the rule */}
      {frame >= coatAt - 2 ? (
        <>
          <div style={{ position: 'absolute', left: 20, top: 440, textAlign: 'center', fontFamily: FONT.sans, ...heaterIn }}>
            <Heater width={124} frame={frame} />
            <div style={{ fontSize: 32, fontWeight: 750, color: C.amber, whiteSpace: 'nowrap' }}>{HEATER_LABEL}</div>
          </div>
          <div style={{ position: 'absolute', left: 200, top: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT.sans, ...coatIn }}>
            <Coat width={100} glow={progress(frame, abrigoAt + 6, 14)} />
            <div style={{ fontSize: 32, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{COAT_LABEL}</div>
          </div>
          <div style={{ position: 'absolute', left: 400, top: 446, ...heaterIn }}>
            <ImageTag size={24} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 604, fontFamily: FONT.sans, fontSize: 36, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', textShadow: `0 0 18px ${alpha(C.cyan, 0.25)}`, ...ruleIn }}>
            {RULE}
          </div>
        </>
      ) : null}
    </Stage>
  );
}
