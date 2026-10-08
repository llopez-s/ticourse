import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { INK, PersonBust, SvgIcon, VerdictMark, mixHex, polylinePath, polylinePoint } from '../glyphs';

/**
 * s08's hotel, seen from above like V17's Sites (stage coordinates, 1728 × 660): the hotel's
 * footprint (slate: a building that is not the port's) with the traveller's room lit (a person,
 * neutral, and the port's laptop, cyan); three exits on its right wall. Only ONE opens (`webOpen`):
 * the web's door, with the proxy right outside it, and web traffic (`web` tokens) leaves through both
 * towards the Internet (a globe). The port's tunnel over TLS (`tls`) leaves through that same door
 * and proxy and crosses to the port's remote access; IPSec (`ipsec`) goes to another door, which is
 * closed (`blockA`: rose, a cross). This is not V12's hotel (no reception, no police): only doors.
 *
 * Text is drawn by the scene (HTML); `HOTEL_GEO` gives every anchor. Every animated prop is a 0–1
 * weight; token lists are 0–1 positions along a route.
 */

export const HOTEL_GEO = (() => {
  const box = { x: 0, y: 176, w: 760, h: 480 };
  const wallX = box.x + box.w;
  const doorH = 84;
  const doors = { a: box.y + 112, b: box.y + 252, c: box.y + 392 };
  const room = { x: 24, y: box.y + 80, w: 400, h: 156 };
  const laptop = { x: room.x + 196, y: room.y + room.h / 2 };
  const person = { x: room.x + 96, y: room.y + room.h / 2 - 22 };
  // Far enough from the wall that the open leaf (84 px, swung ~76°) never touches the booth.
  const proxy = { x: wallX + 116, y: doors.b, size: 76 };
  const globe = { x: 1010, y: 560 };
  const portIn = { x: 1196, y: 404 };
  const lane = room.x + room.w + 46; // the corridor the routes follow inside the hotel
  const route = {
    toB: [laptop, { x: lane, y: laptop.y }, { x: lane + 120, y: doors.b }, { x: wallX, y: doors.b }],
    toA: [laptop, { x: lane, y: laptop.y }, { x: lane + 120, y: doors.a }, { x: wallX - 10, y: doors.a }],
  };
  const out = { x: proxy.x + proxy.size / 2, y: doors.b };
  return {
    box,
    wallX,
    doorH,
    doors,
    room,
    laptop,
    person,
    proxy,
    globe,
    portIn,
    /** Web: laptop → web door → proxy → the Internet's globe. */
    web: [...route.toB, { x: proxy.x, y: doors.b }, out, { x: globe.x - 60, y: doors.b + 40 }, { x: globe.x, y: globe.y - 44 }],
    /** The port's TLS tunnel: laptop → web door → proxy → the port's remote access. */
    tls: [...route.toB, { x: proxy.x, y: doors.b }, out, { x: 1060, y: doors.b - 10 }, portIn],
    /** IPSec: laptop → another door (A), which is closed. */
    ipsec: route.toA,
  };
})();

const G = HOTEL_GEO;

function Door({ y, open = 0, alarm = 0, glow = 0, cross = 0, pulse = 0 }: { y: number; open?: number; alarm?: number; glow?: number; cross?: number; pulse?: number }) {
  const x = G.wallX;
  const h = G.doorH;
  const o = clamp01(open);
  const a = clamp01(alarm);
  const g = clamp01(glow);
  const leafCol = mixHex(mixHex(INK.steel, C.cyanSoft, Math.max(o, g)), C.rose, a);
  // Plan view: the leaf hinges at the top of the gap and swings outward (to the right) as it opens.
  const ang = o * 76;
  const hy = y - h / 2;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* The step outside: every door is an exit */}
      <rect x={x + 10} y={y - h / 2 + 6} width={34} height={h - 12} rx={6} fill={alpha(INK.struct, 0.16)} stroke={alpha(INK.struct, 0.45)} strokeWidth={2} />
      {/* Lit floor beyond an open door */}
      {o > 0.01 ? <rect x={x + 6} y={y - h / 2 + 2} width={70 * o} height={h - 4} rx={10} fill={alpha(C.cyan, 0.16 + 0.14 * g)} /> : null}
      {g > 0.01 ? <rect x={x - 26} y={y - h / 2 - 10} width={60 + 50 * o} height={h + 20} rx={12} fill="none" stroke={alpha(C.cyanSoft, 0.7 * g)} strokeWidth={3} /> : null}
      {a > 0.01 ? <rect x={x - 26} y={y - h / 2 - 10} width={60} height={h + 20} rx={12} fill={alpha(C.rose, (0.18 + 0.3 * clamp01(pulse)) * a)} stroke={alpha(C.rose, 0.8 * a)} strokeWidth={3} /> : null}
      {/* Jambs */}
      <rect x={x - 16} y={y - h / 2 - 6} width={32} height={10} rx={3} fill={INK.struct} />
      <rect x={x - 16} y={y + h / 2 - 4} width={32} height={10} rx={3} fill={INK.struct} />
      {/* Swing arc while open */}
      {o > 0.02 ? <path d={`M ${x} ${hy + h} A ${h} ${h} 0 0 0 ${x + h * Math.sin((ang * Math.PI) / 180)} ${hy + h * Math.cos((ang * Math.PI) / 180)}`} fill="none" stroke={alpha(C.cyanSoft, 0.5)} strokeWidth={2.4} strokeDasharray="6 7" /> : null}
      {/* The leaf: a slab across the gap when shut */}
      <g transform={`rotate(${-ang} ${x} ${hy})`}>
        <rect x={x - 8} y={hy + 3} width={16} height={h - 6} rx={4} fill={alpha(leafCol, 0.35)} stroke={leafCol} strokeWidth={3} />
        <circle cx={x - 1} cy={hy + h * 0.72} r={3.4} fill={leafCol} />
      </g>
      {/* The cross sits inside: where the knock came from */}
      <VerdictMark x={x - 52} y={y} r={22} kind="no" show={cross} />
    </g>
  );
}

/** The part of a polyline from its start to `t` (0–1 of its length). */
function polylineUpTo(pts: readonly { x: number; y: number }[], t: number) {
  const k = clamp01(t);
  if (k >= 0.999) return pts;
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    lens.push(l);
    total += l;
  }
  let d = k * total;
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (d >= lens[i - 1]) {
      out.push(pts[i]);
      d -= lens[i - 1];
    } else {
      const f = lens[i - 1] > 0 ? d / lens[i - 1] : 0;
      out.push({ x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f });
      break;
    }
  }
  return out;
}

export function HotelMap({
  draw = 1,
  room = 1,
  webOpen = 0,
  proxy = 0,
  proxyPulse = 0,
  globe = 0,
  web = [],
  tlsLine = 0,
  tls = [],
  ipsec,
  ipsecHit = 0,
  ipsecFade = 1,
  blockA = 0,
  blockC = 0,
  crossA = 0,
  crossPulse = 0,
  doorGlowB = 0,
  laptopGlow = 0,
}: {
  draw?: number;
  /** The traveller's room lights (person + laptop). */
  room?: number;
  webOpen?: number;
  proxy?: number;
  proxyPulse?: number;
  globe?: number;
  /** Web tokens along the web route (0–1 each). */
  web?: number[];
  /** 0–1 the TLS route draws (laptop → proxy → port). */
  tlsLine?: number;
  /** TLS packets along their route (0–1 each). */
  tls?: number[];
  /** The IPSec packet along its route to door A (0–1), or undefined. */
  ipsec?: number;
  /** 0–1 the IPSec packet has hit the closed door (turns rose, recoils). */
  ipsecHit?: number;
  /** 0–1 the IPSec packet's opacity once it has bounced. */
  ipsecFade?: number;
  blockA?: number;
  blockC?: number;
  crossA?: number;
  /** 0–1 the closed door A flares again («está cerrada»). */
  crossPulse?: number;
  doorGlowB?: number;
  laptopGlow?: number;
}) {
  const d = clamp01(draw);
  const rm = clamp01(room);
  const b = G.box;
  const x1 = G.wallX;
  const hd = G.doorH / 2;
  // The hotel's outline with gaps at the three doors.
  const wall = [
    `M ${x1} ${G.doors.a - hd} L ${x1} ${b.y + 14} Q ${x1} ${b.y} ${x1 - 14} ${b.y} L ${b.x + 14} ${b.y} Q ${b.x} ${b.y} ${b.x} ${b.y + 14}`,
    `L ${b.x} ${b.y + b.h - 14} Q ${b.x} ${b.y + b.h} ${b.x + 14} ${b.y + b.h} L ${x1 - 14} ${b.y + b.h} Q ${x1} ${b.y + b.h} ${x1} ${b.y + b.h - 14} L ${x1} ${G.doors.c + hd}`,
    `M ${x1} ${G.doors.a + hd} L ${x1} ${G.doors.b - hd} M ${x1} ${G.doors.b + hd} L ${x1} ${G.doors.c - hd}`,
  ].join(' ');
  const r = G.room;
  const otherRooms = [
    { x: 24, y: b.y + 296, w: 196, h: 112 },
    { x: 228, y: b.y + 296, w: 196, h: 112 },
  ];
  const tok = (p: { x: number; y: number }, key: string, kind: 'web' | 'tls' | 'ipsec', fade: number, hit = 0) => {
    const col = kind === 'web' ? INK.steel : kind === 'tls' ? C.cyan : hit > 0.3 ? C.rose : C.cyan;
    const s = kind === 'web' ? 36 : 48;
    return (
      <g key={key} opacity={fade} transform={`translate(${p.x} ${p.y})`}>
        <rect x={-s / 2 - 6} y={-s / 2 - 6} width={s + 12} height={s + 12} rx={12} fill={alpha(col, 0.18)} />
        <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={9} fill={C.ink900} stroke={col} strokeWidth={3} />
        <SvgIcon name={kind === 'web' ? 'globe' : 'lock'} x={0} y={0} size={s * 0.62} color={kind === 'web' ? C.text : col} strokeWidth={2.2} />
      </g>
    );
  };
  const fadeOf = (t: number) => Math.min(1, t * 10, (1 - t) * 10);
  const ip = ipsec === undefined ? null : polylinePoint(G.ipsec, clamp01(ipsec));
  const recoil = clamp01(ipsecHit);
  return (
    <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <g opacity={d} strokeLinejoin="round">
        {/* Footprint */}
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={14} fill={C.ink850} />
        <rect x={b.x + 12} y={b.y + 12} width={b.w - 24} height={b.h - 24} rx={8} fill="none" stroke={alpha(INK.struct, 0.35)} strokeWidth={2} />
        {/* Rooms (faint) */}
        {otherRooms.map((o, i) => (
          <rect key={i} x={o.x} y={o.y} width={o.w} height={o.h} rx={6} fill={alpha(INK.struct, 0.08)} stroke={alpha(INK.struct, 0.55)} strokeWidth={2} />
        ))}
        {/* The corridor towards the exits */}
        <rect x={r.x + r.w + 18} y={b.y + 70} width={x1 - (r.x + r.w + 18) - 14} height={b.h - 130} rx={8} fill={alpha(INK.struct, 0.06)} stroke={alpha(INK.struct, 0.3)} strokeWidth={2} strokeDasharray="10 10" />
        {/* The traveller's room */}
        <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={8} fill={alpha(C.cyan, 0.05 + 0.07 * rm)} stroke={alpha(rm > 0.01 ? C.cyan : INK.struct, 0.35 + 0.5 * rm)} strokeWidth={3} />
        <path d={wall} fill="none" stroke={INK.struct} strokeWidth={6} />
      </g>
      {/* The traveller: a person (neutral) and the port's laptop (cyan) */}
      {rm > 0.01 ? (
        <g opacity={rm}>
          <PersonBust x={G.person.x} y={G.person.y} scale={1.5} color={INK.person} strokeWidth={3} />
          {laptopGlow > 0.01 ? <circle cx={G.laptop.x} cy={G.laptop.y} r={60} fill={alpha(C.cyan, 0.16 * clamp01(laptopGlow))} /> : null}
          <SvgIcon name="laptop" x={G.laptop.x} y={G.laptop.y} size={84} color={C.cyan} strokeWidth={2} />
        </g>
      ) : null}
      {/* Routes */}
      {tlsLine > 0.01 ? (
        <path d={polylinePath(polylineUpTo(G.tls, tlsLine))} fill="none" stroke={alpha(C.cyan, 0.8)} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
      {/* Doors */}
      <g opacity={d}>
        <Door y={G.doors.a} alarm={blockA} cross={crossA} pulse={crossPulse} />
        <Door y={G.doors.b} open={webOpen} glow={doorGlowB} />
        <Door y={G.doors.c} alarm={blockC} />
      </g>
      {/* The proxy right outside the web's door */}
      {proxy > 0.01 ? (
        <g opacity={clamp01(proxy)} transform={`translate(${G.proxy.x} ${G.proxy.y})`}>
          <rect x={-G.proxy.size / 2 - 8} y={-G.proxy.size / 2 - 8} width={G.proxy.size + 16} height={G.proxy.size + 16} rx={18} fill={alpha(C.amber, 0.1 + 0.2 * clamp01(proxyPulse))} />
          <rect x={-G.proxy.size / 2} y={-G.proxy.size / 2} width={G.proxy.size} height={G.proxy.size} rx={14} fill={C.ink900} stroke={C.amber} strokeWidth={3.4} />
          <SvgIcon name="funnel" x={0} y={0} size={44} color={'#fcd34d'} strokeWidth={2.2} />
        </g>
      ) : null}
      {/* The Internet */}
      {globe > 0.01 ? (
        <g opacity={clamp01(globe)}>
          <circle cx={G.globe.x} cy={G.globe.y} r={46} fill={alpha(INK.struct, 0.18)} stroke={INK.struct} strokeWidth={3} />
          <SvgIcon name="globe" x={G.globe.x} y={G.globe.y} size={58} color={C.muted} strokeWidth={2} />
        </g>
      ) : null}
      {/* Tokens */}
      {web.filter((t) => t > 0 && t < 1).map((t, i) => tok(polylinePoint(G.web, t), `w${i}`, 'web', fadeOf(t)))}
      {tls.filter((t) => t > 0 && t < 1).map((t, i) => tok(polylinePoint(G.tls, t), `t${i}`, 'tls', fadeOf(t)))}
      {ip ? tok({ x: ip.x - 34 * Math.sin((Math.PI / 2) * recoil), y: ip.y }, 'ip', 'ipsec', Math.min(1, clamp01(ipsec ?? 0) * 8) * clamp01(ipsecFade), recoil) : null}
    </svg>
  );
}
