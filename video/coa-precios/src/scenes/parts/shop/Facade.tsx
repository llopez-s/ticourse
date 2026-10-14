import { alpha } from '../../../../../engine/src/theme/tokens';
import { G, INK, SHOP_W } from './geom';

/** Pavement and the building's wall, with a blank sign plate (the shop has no name). */
export function Building({ detail = 1 }: { detail?: number }) {
  const b = G.bld;
  return (
    <g>
      {/* pavement */}
      <rect x={0} y={G.ground} width={SHOP_W} height={10} rx={3} fill={INK.soft} />
      <rect x={0} y={G.ground + 10} width={SHOP_W} height={5} fill={alpha(INK.soft, 0.4)} />
      {/* wall */}
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8} fill={INK.wall} stroke={INK.edge} strokeWidth={3} />
      <rect x={b.x - 8} y={b.y - 6} width={b.w + 16} height={14} rx={5} fill={INK.wallHi} stroke={INK.edge} strokeWidth={3} />
      {/* brick hints */}
      <g stroke={alpha(INK.line, 0.28 * detail)} strokeWidth={2.5} strokeLinecap="round">
        <path d="M52 132 h26 M740 250 h34 M748 330 h26 M738 410 h36 M486 250 h20 M482 360 h24" />
      </g>
      {/* blank sign plate */}
      <rect x={G.sign.x} y={G.sign.y} width={G.sign.w} height={G.sign.h} rx={8} fill={INK.wallHi} stroke={alpha(INK.line, 0.8)} strokeWidth={2.5} />
      <rect x={G.sign.x + 10} y={G.sign.y + 10} width={G.sign.w - 20} height={G.sign.h - 20} rx={4} fill="none" stroke={alpha(INK.line, 0.35)} strokeWidth={2} />
    </g>
  );
}

/** What is behind the glass and in the doorway: the room, its back shelf. Draw before whoever is inside. */
export function Room() {
  const w = G.win;
  const d = G.door;
  return (
    <g>
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={INK.room} />
      <rect x={d.x} y={d.y} width={d.w} height={d.h} fill={INK.glass} />
      {/* back shelf the recorder sits on */}
      <rect x={w.x} y={G.recorder.y + G.recorder.h} width={196} height={8} fill={INK.soft} />
      <path d={`M${w.x + 24} ${G.recorder.y + G.recorder.h + 8} v${w.y + w.h - G.recorder.y - G.recorder.h - 8} M${w.x + 172} ${G.recorder.y + G.recorder.h + 8} v${w.y + w.h - G.recorder.y - G.recorder.h - 8}`} stroke={INK.soft} strokeWidth={5} />
      {/* floor line seen through the door */}
      <rect x={d.x} y={G.floor} width={d.w} height={G.ground - G.floor} fill={alpha(INK.soft, 0.55)} />
    </g>
  );
}

/** The window's frame, sill and reflections, and the door's frame. Draw over whoever is inside. */
export function Frames({ glass = 1 }: { glass?: number }) {
  const w = G.win;
  const d = G.door;
  return (
    <g>
      {/* reflections */}
      <g stroke={alpha('#e2e8f0', 0.07 * glass)} strokeWidth={16} strokeLinecap="round">
        <path d={`M${w.x + 300} ${w.y + 24} l-70 110 M${w.x + 352} ${w.y + 24} l-40 62`} />
      </g>
      {/* sill wall under the glass */}
      <rect x={w.x - 12} y={w.y + w.h} width={w.w + 24} height={G.ground - w.y - w.h} fill={INK.wallHi} stroke={INK.edge} strokeWidth={2.5} />
      <rect x={w.x - 18} y={w.y + w.h - 6} width={w.w + 36} height={12} rx={4} fill={INK.edge} />
      {/* window frame */}
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="none" stroke={INK.line} strokeWidth={6} />
      {/* door frame */}
      <path d={`M${d.x} ${d.y + d.h} V${d.y} H${d.x + d.w} V${d.y + d.h}`} fill="none" stroke={INK.line} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
}

/** A striped awning over the shop front; the shutter rolls out from under it. */
export function Awning() {
  const a = G.awning;
  const stripes = 12;
  const sw = a.w / stripes;
  return (
    <g>
      <clipPath id="shop-awning">
        <path d={`M${a.x + 14} ${a.y} H${a.x + a.w - 14} L${a.x + a.w} ${a.y + a.h - 8} V${a.y + a.h} H${a.x} V${a.y + a.h - 8} Z`} />
      </clipPath>
      <g clipPath="url(#shop-awning)">
        <rect x={a.x} y={a.y} width={a.w} height={a.h} fill="#22344f" />
        {Array.from({ length: stripes / 2 }, (_, i) => (
          <rect key={i} x={a.x + (2 * i + 0.5) * sw} y={a.y} width={sw} height={a.h} fill="#3b4f6e" />
        ))}
      </g>
      <path d={`M${a.x + 14} ${a.y} H${a.x + a.w - 14} L${a.x + a.w} ${a.y + a.h - 8} V${a.y + a.h} H${a.x} V${a.y + a.h - 8} Z`} fill="none" stroke={INK.line} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
}
