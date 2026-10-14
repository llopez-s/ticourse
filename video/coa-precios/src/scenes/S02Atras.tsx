import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { cubicPath, curveBetween, windowWeight, type Point } from '../../../engine/src/ui';
import { S02 } from '../data/s02-atras';
import { SHOP_AFTER_S02, SHOP_POSE } from '../data/shop-poses';
import { MatrixCell } from './parts/Matrix';
import { Shop, shopLayout } from './parts/Shop';
import { TimeAxis } from './parts/s02-atras/Axis';
import { BLOCK_W, TapeArt, VerbBlock, WatchArt } from './parts/s02-atras/Blocks';
import { Stage, wordFrame } from './kit';

const S = 's02-atras';
const POSE = SHOP_POSE.full;
const L = shopLayout(POSE.w);
const LEFT = { x: 14, y: 22 } as const;
const RIGHT = { x: 1728 - BLOCK_W - 14, y: 22 } as const;
const AXIS_TOP = 530;

/** A dashed leader from an object in the shop to its close-up. */
function Leader({ from, to, draw }: { from: Point; to: Point; draw: number }) {
  if (draw <= 0.004) return null;
  return <path d={cubicPath(curveBetween(from, to, 0.45))} fill="none" stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 9" opacity={draw} />;
}

/**
 * s02-atras «Atrás y adelante».
 *   shop      the neighbourhood shop in the middle of the stage, nothing lit yet (the shutter is s03's);
 *             under it, a dim time line.
 *   tape      the recorder lights, tagged «ayer»; on the left its tape, up close, rewinds.
 *   discover  DISCOVER, «mirar hacia atrás / lo que ya pasó».
 *   alarm     the alarm rings (its sound is the engine's); on the right, up close.
 *   live      its camera, «en directo», watching the door.
 *   detect    DETECT, «avisar cuando / vuelva a ocurrir», and the one example, on screen only: the
 *             matrix cell «alerta: schtasks /create fuera del inventario aprobado».
 *   pair      «hoy» in the middle of the time line and two drawn connectors, one back to DISCOVER and
 *             one forward to DETECT; nothing moves once the exam card lands.
 */
export function S02Atras(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const tapeAt = props.cue('tape');
  const discoverAt = props.cue('discover');
  const alarmAt = props.cue('alarm');
  const liveAt = props.cue('live');
  const detectAt = props.cue('detect');
  const pairAt = props.cue('pair');
  const shopIn = p(Math.min(props.cue('shop') - 10, 4), 16);

  // ---- DISCOVER: yesterday's tape, rewound
  const tapeOn = p(tapeAt - 2, 12);
  const rwAt = at('s02-02', 'rebobinas') - 6;
  const rwEnd = Math.max(rwAt + 40, alarmAt - 12);
  const rw = progress(frame, rwAt, rwEnd - rwAt, EASE.inOut);
  const rewinding = windowWeight(frame, rwAt, rwEnd - 6, { ramp: 10 });
  const spin = -1500 * rw;
  const wound = 0.18 + (SHOP_AFTER_S02.tapeWound - 0.18) * rw;
  const tapeArt = p(tapeAt + 4, 14);
  const discoverIn = p(discoverAt - 2, 12);
  const backSub = p(at('s02-02', 'mirar') - 4, 12);

  // ---- DETECT: the alarm and its live camera
  const alarmOn = p(alarmAt - 2, 10);
  const ring = Math.max(windowWeight(frame, alarmAt, alarmAt + 44, { ramp: 8 }), 0.3 * alarmOn) * (1 - progress(frame, pairAt - 14, 16, EASE.inOut));
  const cameraOn = p(liveAt - 2, 12);
  const cone = SHOP_AFTER_S02.cone * p(liveAt + 4, 20);
  const detectIn = p(detectAt - 2, 12);
  const fwdSub = p(at('s02-03', 'mira') - 4, 12);
  const exampleIn = p(detectAt + 16, 14);

  // ---- The pair: «hoy», one connector back, one forward; all still within ~1.3 s
  const today = p(pairAt - 2, 12);
  const back = progress(frame, pairAt + 6, 24, EASE.inOut);
  const fwd = progress(frame, pairAt + 12, 24, EASE.inOut);
  const onDiscover = windowWeight(frame, at('s02-04', 'Discover') - 4, at('s02-04', 'Detect') - 4);
  const onDetect = windowWeight(frame, at('s02-04', 'Detect') - 4, Number.POSITIVE_INFINITY);
  const leftDim = 0.5 * windowWeight(frame, alarmAt - 4, pairAt - 4, { ramp: 14 });

  const sx = (pt: Point): Point => ({ x: POSE.x + pt.x, y: POSE.y + pt.y });
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: AXIS_TOP }}>
        <TimeAxis base={shopIn} today={today} back={back} fwd={fwd} backLit={onDiscover} fwdLit={onDetect} />
      </div>

      <div style={{ position: 'absolute', left: POSE.x, top: POSE.y, opacity: shopIn }}>
        <Shop width={POSE.w} phase={frame / fps} tape={tapeOn} rewind={rewinding} tapeSpin={spin} tapeWound={wound} alarm={alarmOn} ring={ring} camera={cameraOn} live={cameraOn} cone={cone} labels={{ ayer: p(tapeAt + 2, 12), live: p(liveAt + 6, 12) }} />
      </div>

      {/* From each object to its close-up */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Leader from={sx({ x: L.rect.recorder.x - 6, y: L.at.tape.y })} to={{ x: LEFT.x + BLOCK_W - 44, y: LEFT.y + 120 }} draw={tapeArt * (1 - leftDim)} />
        <Leader from={sx({ x: L.at.alarm.x + 46, y: L.at.alarm.y })} to={{ x: RIGHT.x + 44, y: RIGHT.y + 96 }} draw={p(alarmAt + 4, 14)} />
      </svg>

      <div style={{ position: 'absolute', left: LEFT.x, top: LEFT.y }}>
        <VerbBlock art={<TapeArt spin={spin} wound={wound} rewind={rewinding} lit={tapeArt} />} artIn={tapeArt} name={S02.discover.name} nameIn={discoverIn} sub={S02.discover.sub} subIn={backSub} glow={onDiscover} dim={leftDim} />
      </div>

      <div style={{ position: 'absolute', left: RIGHT.x, top: RIGHT.y }}>
        <VerbBlock
          art={<WatchArt alarm={p(alarmAt + 4, 14)} ring={ring} camera={p(liveAt + 2, 14)} live={cameraOn} phase={frame / fps} />}
          artIn={p(alarmAt + 4, 14)}
          name={S02.detect.name}
          nameIn={detectIn}
          sub={S02.detect.sub}
          subIn={fwdSub}
          glow={onDetect}
          extra={
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', opacity: exampleIn, transform: `translateY(${(1 - exampleIn) * 10}px)`, textAlign: 'left' }}>
              <MatrixCell cell={S02.example} fontSize={26} form="wide" header="full" />
            </div>
          }
        />
      </div>
    </Stage>
  );
}
