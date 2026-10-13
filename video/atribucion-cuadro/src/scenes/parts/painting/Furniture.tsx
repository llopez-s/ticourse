import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { CANVAS, CEILING_Y, LAMP, PD } from './geometry';
import { FURN } from './Art';

/** The easel, the spotlight and its beam: museum furniture in neutral steel. Design units, inside the caller's <svg>. */

/** The easel behind and under the frame. `legs` 0–1 shortens the feet (0 = only the ledge and the mast). */
export function Easel({ show = 1, legs = 1 }: { show?: number; legs?: number }) {
  if (show <= 0.001) return null;
  const top = PD.h + PD.ledgeH;
  const foot = top + (PD.legsBottom - top) * legs;
  const spread = 36 * legs;
  return (
    <g opacity={show} strokeLinecap="round">
      {legs > 0.05 ? <ellipse cx={PD.w / 2} cy={foot} rx={PD.w * 0.5} ry={7} fill={alpha('#000000', 0.35)} /> : null}
      {/* mast and its clamp */}
      <path d={`M ${PD.w / 2} ${-PD.mastUp + 6} V ${top + (foot - top) * 0.72}`} stroke={FURN.dark} strokeWidth={14} />
      <rect x={PD.w / 2 - 26} y={-PD.mastUp} width={52} height={16} rx={4} fill={FURN.mid} stroke={FURN.steel} strokeWidth={2} />
      {legs > 0.05 ? (
        <>
          <path d={`M 70 ${top - 4} L ${70 - spread} ${foot}`} stroke={FURN.mid} strokeWidth={13} />
          <path d={`M ${PD.w - 70} ${top - 4} L ${PD.w - 70 + spread} ${foot}`} stroke={FURN.mid} strokeWidth={13} />
          <path d={`M ${70 - spread * 0.5} ${top + (foot - top) * 0.52} H ${PD.w - 70 + spread * 0.5}`} stroke={FURN.dark} strokeWidth={8} />
        </>
      ) : null}
      {/* the ledge the frame rests on */}
      <rect x={-14} y={PD.h - 2} width={PD.w + 28} height={PD.ledgeH + 2} rx={5} fill={FURN.mid} stroke={FURN.steel} strokeWidth={2} />
    </g>
  );
}

/**
 * The spotlight («tu telemetría»): a lamp on a stand, its mouth `gap` design units left of the frame, level
 * with band 1. `show` 0–1 brings the lamp in; `beam` 0–1 switches it on: the cone grows from the mouth to
 * the canvas, its upper edge landing on CEILING_Y (it lights band 1 and only grazes band 2).
 */
export function Spotlight({ gap = LAMP.gap, show = 1, beam = 0, edge = 0 }: { gap?: number; show?: number; beam?: number; edge?: number }) {
  if (show <= 0.001) return null;
  const mx = -gap;
  const my = LAMP.y;
  const half = LAMP.head / 2;
  const bottom = CANVAS.y + CANVAS.h;
  const reach = Math.max(0, Math.min(1, beam / 0.7));
  const ex = mx + (CANVAS.x - mx) * reach;
  const upper = my - half + (CEILING_Y - (my - half)) * reach;
  const lower = my + half + (bottom - (my + half)) * reach;
  const id = `beam-${Math.round(gap)}`;
  return (
    <g opacity={show}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={mx} y1={0} x2={CANVAS.x} y2={0}>
          <stop offset="0" stopColor={alpha(C.cyanSoft, 0.5)} />
          <stop offset="1" stopColor={alpha(C.cyan, 0.14)} />
        </linearGradient>
      </defs>
      {beam > 0.001 ? (
        <g opacity={Math.min(1, beam * 1.6)}>
          <path d={`M ${mx} ${my - half} L ${ex} ${upper} L ${ex} ${lower} L ${mx} ${my + half} Z`} fill={`url(#${id})`} />
          {/* the beam's upper edge: where what you can see ends */}
          <path d={`M ${mx} ${my - half} L ${ex} ${upper}`} stroke={alpha(C.cyanSoft, 0.55 + 0.45 * edge)} strokeWidth={2.5 + 2 * edge} strokeLinecap="round" />
        </g>
      ) : null}
      {/* stand */}
      <g stroke={FURN.mid} strokeWidth={9} strokeLinecap="round">
        <path d={`M ${mx - 46} ${my + 24} V ${PD.legsBottom - 6}`} />
        <path d={`M ${mx - 46} ${PD.legsBottom - 46} L ${mx - 84} ${PD.legsBottom} M ${mx - 46} ${PD.legsBottom - 46} L ${mx - 8} ${PD.legsBottom}`} />
      </g>
      {/* head */}
      <path
        d={`M ${mx} ${my - half} L ${mx - 62} ${my - 20} Q ${mx - 86} ${my} ${mx - 62} ${my + 20} L ${mx} ${my + half} Z`}
        fill={FURN.dark}
        stroke={beam > 0.3 ? C.cyanSoft : FURN.steel}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <ellipse cx={mx} cy={my} rx={7} ry={half} fill={beam > 0.001 ? alpha(C.cyanSoft, 0.35 + 0.65 * Math.min(1, beam * 2)) : FURN.deep} stroke={beam > 0.3 ? C.cyanSoft : FURN.steel} strokeWidth={2.5} />
      <circle cx={mx - 46} cy={my + 24} r={8} fill={FURN.steel} />
    </g>
  );
}
