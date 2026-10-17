import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { COMPENSATE, COMPENSATING, INVERSE, OT, PLANE, PROPOSAL, SAME, STAMP, STILL, WHY_NOT } from '../data/s06-esclusa';
import { CaseStamp, Pill } from './parts/Labels';
import { PLANE_H, PLANE_W, Plane } from './parts/Plane';
import { LOCK_H, LOCK_W, CanalLock } from './parts/s06-esclusa/CanalLock';
import { Stage, wordFrame } from './kit';

const S = 's06-esclusa';
const W = 1728;
const LOCK = { x: 0, y: 58, w: 720 } as const;
const LOCK_DRAWN_H = (LOCK.w * LOCK_H) / LOCK_W;
const OT_Y = 346;
const PLANE_BOX = { x: 0, y: 466, w: 760 } as const;
const PLANE_SCALE = PLANE_BOX.w / PLANE_W;
const CAPTION_Y = 424;
const COL_X = 830;
const CHIP_STEP = 62;
const COMP_Y = 204;
const INVERSE_Y = 506;

/**
 * s06-esclusa «Lo que no se puede parar». From the first frame the stamp «Las esclusas · caso de ejemplo · sin fecha»;
 * on `lock-ship` the lock system, drawn as a canal lock with a ship in its chamber (no equipment, no network line).
 * On `why-not` three chips, each on its words: «se para una vez al año» · «no aguanta un agente» · «el fabricante solo
 * responde de una versión». On `still` (the lock sound) the water stops shimmering and the lock is stamped «sin parche
 * en caliente · sin agente» (amber, never a padlock). On «OT» the name lands under it, with the chip «lo mismo:
 * embedded · RTOS». On `compensate` the answer as a proposal, «propuesta · sin fecha»: «que solo le hable quien lo
 * necesita» · «escuchar su tráfico sin tocarlo» → «Compensating controls» on its word (the exam card follows). On
 * `plane` the plane in flight, small at the bottom-left: cockpit shut, the tower following it by radar, the hangar at
 * the back. On `inverse`, half-lit at the bottom-right: «¿desconectarlas del todo? no, si tienen que seguir
 * conectadas».
 */
export function S06Esclusa(props: SceneProps) {
  const frame = useCurrentFrame();
  const lockAt = props.cue('lock-ship') - 4;
  const whyAt = WHY_NOT.map((w) => wordFrame(S, 's06-02', w.word) - 6);
  const stillAt = props.cue('still');
  const otAt = wordFrame(S, 's06-03', 'OT') - 8;
  const sameAt = otAt + 18;
  const compAt = props.cue('compensate');
  const compLineAt = COMPENSATE.map((c) => wordFrame(S, 's06-04', c.word) - 6);
  const compNameAt = wordFrame(S, 's06-04', 'compensating') - 6;
  const planeAt = props.cue('plane');
  const vueloAt = wordFrame(S, 's06-05', 'vuelo') - 6;
  const hangarAt = wordFrame(S, 's06-05', 'hangar') - 6;
  const radarAt = wordFrame(S, 's06-05', 'torre') - 6;
  const inverseAt = props.cue('inverse');

  const stampIn = enter(frame, -6, { distance: 14, duration: 16 });
  const ship = progress(frame, lockAt, 30);
  const lockIn = progress(frame, lockAt - 6, 16);
  const still = progress(frame, stillAt, 12);
  const stillStamp = progress(frame, stillAt - 2, 10);
  const otIn = progress(frame, otAt, 14);
  const sameIn = progress(frame, sameAt, 14);
  const compIn = progress(frame, compAt - 4, 16);
  const nameIn = progress(frame, compNameAt, 14);
  const planeIn = progress(frame, planeAt - 4, 18);
  const inverseIn = progress(frame, inverseAt - 2, 16);
  // Earlier blocks step back a little when the plane and the inverse trap arrive.
  const whyDim = progress(frame, compAt, 16);

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
          <CaseStamp what={STAMP.what} kind={STAMP.kind} />
        </div>

        {/* the lock with its ship */}
        <div style={{ position: 'absolute', left: LOCK.x, top: LOCK.y, width: LOCK.w, height: LOCK_DRAWN_H, opacity: lockIn }}>
          <CanalLock width={LOCK.w} ship={ship} frame={frame} still={still} />
        </div>
        {stillStamp > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: LOCK.y + 30,
              transform: `rotate(-3deg) scale(${1.25 - 0.25 * stillStamp})`,
              opacity: stillStamp,
              padding: '8px 22px',
              borderRadius: RADIUS.md,
              border: `4px solid ${C.amber}`,
              background: alpha(C.ink950, 0.88),
              boxShadow: `0 0 26px ${alpha(C.amber, 0.3)}`,
              fontSize: 34,
              fontWeight: 850,
              color: '#fcd34d',
              whiteSpace: 'nowrap',
            }}
          >
            {STILL}
          </div>
        ) : null}

        {/* its name */}
        {otIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: OT_Y, display: 'flex', alignItems: 'center', gap: 24, opacity: otIn, transform: `translateY(${(1 - otIn) * 12}px)` }}>
            <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: -1, color: C.cyan, textShadow: `0 0 26px ${alpha(C.cyan, 0.35)}` }}>{OT}</div>
            <div style={{ opacity: sameIn }}>
              <Pill text={SAME} tone={C.cyan} size={30} height={48} on={0.5} />
            </div>
          </div>
        ) : null}

        {/* why not */}
        {WHY_NOT.map((w, i) => {
          if (frame < whyAt[i] - 2) return null;
          const p = progress(frame, whyAt[i], 14);
          const on = p * (1 - 0.5 * progress(frame, (whyAt[i + 1] ?? stillAt) - 2, 12)) * (1 - 0.3 * whyDim);
          return (
            <div key={w.text} style={{ position: 'absolute', left: COL_X, top: i * CHIP_STEP, opacity: p * (1 - 0.35 * whyDim), transform: `translateX(${(1 - p) * 16}px)` }}>
              <Pill text={w.text} icon={w.icon} tone={C.amber} size={32} height={52} on={on} />
            </div>
          );
        })}

        {/* the answer, as a proposal */}
        {compIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: COL_X,
              top: COMP_Y,
              width: W - COL_X,
              boxSizing: 'border-box',
              padding: '16px 24px 18px',
              borderRadius: RADIUS.lg,
              border: `2px dashed ${alpha(C.emerald, 0.65)}`,
              background: alpha(C.emerald, 0.05),
              opacity: compIn,
              transform: `translateY(${(1 - compIn) * 14}px)`,
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 28, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
              <Icon name="file" size={26} color={C.muted} />
              {PROPOSAL}
            </div>
            {COMPENSATE.map((c, i) => {
              const p = progress(frame, compLineAt[i], 12);
              return (
                <div key={c.text} style={{ marginTop: i === 0 ? 12 : 8, display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', opacity: 0.2 + 0.8 * p }}>
                  <Icon name={c.icon} size={34} color={C.emerald} />
                  {c.text}
                </div>
              );
            })}
            <div style={{ marginTop: 14, opacity: nameIn, transform: `translateY(${(1 - nameIn) * 8}px)` }}>
              <Pill text={COMPENSATING} tone={C.violet} size={36} height={56} weight={850} on={nameIn} />
            </div>
          </div>
        ) : null}

        {/* the plane in flight */}
        {planeIn > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: PLANE_BOX.x, top: PLANE_BOX.y, width: PLANE_BOX.w, height: PLANE_H * PLANE_SCALE }}>
              <Plane width={PLANE_BOX.w} planeIn={planeIn} hangarIn={progress(frame, hangarAt, 14)} towerIn={progress(frame, radarAt - 4, 14)} radar={progress(frame, radarAt, 16)} frame={frame} />
            </div>
            <Caption x={105 * PLANE_SCALE} text={PLANE.hangar} show={progress(frame, hangarAt, 14)} />
            <Caption x={465 * PLANE_SCALE} text={PLANE.flight} show={progress(frame, vueloAt, 14)} />
            <Caption x={832 * PLANE_SCALE} text={PLANE.radar} show={progress(frame, radarAt, 14)} />
          </>
        ) : null}

        {/* the inverse trap, half-lit */}
        {inverseIn > 0.01 ? (
          <div style={{ position: 'absolute', left: COL_X, top: INVERSE_Y, display: 'flex', alignItems: 'flex-start', gap: 16, opacity: 0.62 * inverseIn, transform: `translateY(${(1 - inverseIn) * 10}px)` }}>
            <Icon name="unplug" size={40} color={C.amber} />
            <div style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.25, color: C.text, whiteSpace: 'nowrap' }}>
              <div>{INVERSE[0]}</div>
              <div style={{ color: '#fcd34d' }}>{INVERSE[1]}</div>
            </div>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

/** A small caption above the plane band, centred on `x`. */
function Caption({ x, text, show }: { x: number; text: string; show: number }) {
  if (show < 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: CAPTION_Y, transform: 'translateX(-50%)', fontSize: 30, fontWeight: 700, color: C.sky, whiteSpace: 'nowrap', opacity: show }}>
      {text}
    </div>
  );
}
