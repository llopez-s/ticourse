import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { CAMERA } from '../../../data/s09-camara';
import { Checkpoint, TruckTop, checkpointPoint, checkpointSize } from '../Checkpoint';
import { FenceCamera, fenceCameraPoint } from './FenceCamera';

/**
 * s09-02 «Son como la cámara de la valla»: the port's gate (the shared
 * Checkpoint, staffed and powered, barrier up so trucks go through) and, on
 * its own pole at the end of the fence, the camera. It sees everyone pass and
 * raises an alert at the rose truck — which drives on: the camera never
 * lowers the barrier. Three lines beside it say exactly that.
 * Local px, GATE_W × GATE_H; the scene positions it.
 */

export const GATE_W = 840;
export const GATE_H = 620;

const CK_W = 400;
const CK = { x: 0, y: 110 } as const;
const CK_SIZE = checkpointSize(CK_W, { crop: 'road' });
const CAM_W = 180;
const CAM_AIM = 38;
/** The camera's pole stands just beyond the right end of the fence. */
const FENCE_RIGHT = checkpointPoint(CK_W, 'fenceRight', { crop: 'road' });
const CAM_FOOT = { x: CK.x + FENCE_RIGHT.x + 24, y: CK.y + FENCE_RIGHT.y + 22 };
const CAM_FOOT_PX = fenceCameraPoint(CAM_W, 'foot', CAM_AIM);
const CAM = { x: CAM_FOOT.x - CAM_FOOT_PX.x, y: CAM_FOOT.y - CAM_FOOT_PX.y };

/** A truck's nose y (design units of the road crop) for a 0–1 pass, as Checkpoint draws its `passing` trucks. */
const passY = (p: number) => 600 + 20 - p * 800;

export function CameraGate({
  frame,
  show,
  camera,
  trucks,
  bad,
  alert,
  lines,
  dim = 0,
}: {
  frame: number;
  /** 0–1 the gate. */
  show: number;
  /** 0–1 the camera pops in. */
  camera: number;
  /** Plain trucks driving through, each 0–1. */
  trucks: number[];
  /** The rose truck's pass, 0–1 (undefined = none). */
  bad?: number;
  /** 0–1 the camera's alert. */
  alert: number;
  /** 0–1 per line: «ve pasar a todos», «avisa», «no baja la barrera». */
  lines: readonly [number, number, number];
  dim?: number;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const items: { icon: IconName; text: string; color: string }[] = [
    { icon: 'eye', text: CAMERA.sees, color: C.cyanSoft },
    { icon: 'bell', text: CAMERA.alerts, color: '#fcd34d' },
    { icon: 'x', text: CAMERA.noBarrier, color: C.text },
  ];
  return (
    <div style={{ position: 'relative', width: GATE_W, height: GATE_H, opacity: sh * (1 - 0.55 * clamp01(dim)), fontFamily: FONT.sans }}>
      {/* title */}
      <div style={{ position: 'absolute', left: CK.x, top: 18, fontSize: 44, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, opacity: clamp01(camera), whiteSpace: 'nowrap' }}>
        {CAMERA.title}
      </div>
      {/* the gate: staffed and powered, barrier up, the guard's own cone off (the cone here is the camera's) */}
      <div style={{ position: 'absolute', left: CK.x, top: CK.y }}>
        <Checkpoint width={CK_W} crop="road" state="powered" barrier={1} watch={0} passing={trucks} frame={frame} />
      </div>
      {/* the rose truck, on the same road (same viewBox as the road crop) */}
      {bad !== undefined && bad > 0 && bad < 1 ? (
        <svg
          width={CK_SIZE.w}
          height={CK_SIZE.h}
          viewBox="0 0 600 600"
          style={{ position: 'absolute', left: CK.x, top: CK.y, overflow: 'hidden' }}
        >
          <TruckTop x={390} y={passY(bad)} outline={C.roseSoft} body={alpha(C.rose, 0.35)} cab={alpha(C.rose, 0.5)} strokeWidth={3.4} />
        </svg>
      ) : null}
      {/* the camera on its pole */}
      <div style={{ position: 'absolute', left: CAM.x, top: CAM.y }}>
        <FenceCamera width={CAM_W} aim={CAM_AIM} coneLength={330} coneSpread={22} power={1} watch={clamp01(camera)} alert={alert} glow={0.4 * clamp01(alert)} frame={frame} style={{ opacity: clamp01(camera), transform: `translateY(${(1 - clamp01(camera)) * 16}px)` }} />
      </div>
      {/* what it does — and what it doesn't */}
      <div style={{ position: 'absolute', left: CAM_FOOT.x + 16, top: CAM_FOOT.y + 64, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map((it, i) => {
          const p = clamp01(lines[i]);
          return (
            <div key={it.text} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
              <Icon name={it.icon} size={38} color={i === 1 ? C.amber : i === 2 ? C.roseSoft : C.cyan} strokeWidth={2.3} />
              <span style={{ fontSize: 36, fontWeight: 800, color: it.color, whiteSpace: 'nowrap' }}>{it.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
