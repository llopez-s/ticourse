import { C, alpha } from '../../../../engine/src/theme/tokens';

/** Native size of the night-port drawing. */
export const PORT_ART = { w: 820, h: 520 } as const;

/** Small deterministic generator (no Math.random): the same night every frame. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const HORIZON = 316;
const STACK_COLORS = [alpha(C.sky, 0.4), alpha(C.amber, 0.32), alpha(C.cyan, 0.34), alpha(C.ink500, 0.9), alpha(C.roseSoft, 0.25)];

/**
 * The port at night, generic: sea with reflections, a quay of container stacks, one gantry outline and a control tower
 * with lit windows and a rose beacon. No names, no numbers, no quay codes, no marked parts and no text. It is the
 * frame of the video (s01 left side, the poster) and nothing in it is a fact of the case.
 * `frame=false` leaves out the rounded border, for placing it inside another frame.
 */
export function PortArt({ frame = true }: { frame?: boolean }) {
  const { w, h } = PORT_ART;
  const r = rng(52);
  const stars = Array.from({ length: 26 }, () => ({ x: 20 + r() * (w - 40), y: 14 + r() * 150, s: 1 + r() * 1.8, a: 0.25 + r() * 0.5 }));
  // Container stacks along the quay: [x, count high, colour index]
  const stacks: { x: number; n: number; c: number }[] = [];
  for (let i = 0, x = 30; x < 520; i++, x += 66) stacks.push({ x, n: 1 + Math.floor(r() * 3), c: Math.floor(r() * STACK_COLORS.length) });
  // Tower windows (4 columns by 7 rows): routine grey, data cyan, warning amber.
  const windows: { x: number; y: number; c: string }[] = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 4; col++) {
      const v = r();
      windows.push({ x: 700 + col * 18, y: 168 + row * 18, c: v < 0.55 ? alpha(C.ink500, 0.8) : v < 0.88 ? C.cyan : C.amber });
    }
  }
  const lamps = [60, 150, 240, 330, 420, 520, 610, 760];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'hidden' }}>
      <defs>
        <linearGradient id="port-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.ink950} />
          <stop offset="100%" stopColor={C.ink800} />
        </linearGradient>
        <linearGradient id="port-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={alpha(C.cyanDeep, 0.55)} />
          <stop offset="100%" stopColor={alpha(C.ink900, 1)} />
        </linearGradient>
        <radialGradient id="port-beacon">
          <stop offset="0%" stopColor={C.rose} stopOpacity={0.6} />
          <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={w} height={h} fill="url(#port-sky)" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill={C.textStrong} opacity={s.a} />
      ))}
      {/* sea */}
      <rect x={0} y={HORIZON} width={w} height={h - HORIZON} fill="url(#port-sea)" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={20 + ((i * 97) % 300)} y1={HORIZON + 46 + i * 17} x2={140 + ((i * 97) % 300) + i * 20} y2={HORIZON + 46 + i * 17} stroke={alpha(C.cyanSoft, 0.12)} strokeWidth={2} />
      ))}
      {/* reflections of the lamps and the tower */}
      {lamps.map((x, i) => (
        <line key={i} x1={x} y1={HORIZON + 40} x2={x} y2={HORIZON + 40 + 28 + (i % 3) * 12} stroke={alpha(C.cyan, 0.35)} strokeWidth={3} strokeLinecap="round" />
      ))}
      <line x1={728} y1={HORIZON + 40} x2={728} y2={HORIZON + 120} stroke={alpha(C.rose, 0.3)} strokeWidth={4} strokeLinecap="round" />
      {/* quay */}
      <rect x={0} y={HORIZON - 22} width={w} height={44} fill={C.ink800} />
      <line x1={0} y1={HORIZON - 22} x2={w} y2={HORIZON - 22} stroke={alpha(C.text, 0.22)} strokeWidth={2} />
      {/* container stacks */}
      {stacks.map((s, i) =>
        Array.from({ length: s.n }, (_, k) => (
          <g key={`${i}-${k}`}>
            <rect x={s.x} y={HORIZON - 22 - (k + 1) * 30 - k * 2} width={58} height={30} rx={3} fill={STACK_COLORS[(s.c + k) % STACK_COLORS.length]} stroke={alpha(C.text, 0.18)} strokeWidth={1.5} />
            <line x1={s.x + 19} y1={HORIZON - 22 - (k + 1) * 30 - k * 2 + 4} x2={s.x + 19} y2={HORIZON - 22 - k * 32 - 4} stroke={alpha(C.text, 0.12)} strokeWidth={1.5} />
            <line x1={s.x + 38} y1={HORIZON - 22 - (k + 1) * 30 - k * 2 + 4} x2={s.x + 38} y2={HORIZON - 22 - k * 32 - 4} stroke={alpha(C.text, 0.12)} strokeWidth={1.5} />
          </g>
        )),
      )}
      {/* gantry outline, over the water at the right of the stacks */}
      <g stroke={alpha(C.muted, 0.85)} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={`M560 ${HORIZON - 22} L572 120 M650 ${HORIZON - 22} L638 120`} />
        <path d="M566 150 H644 M568 200 H642" strokeWidth={3} />
        <path d="M520 120 H790 M572 120 L590 90 L620 90 L638 120" />
        <path d="M520 120 L560 100" strokeWidth={3} />
      </g>
      <circle cx={790} cy={120} r={5} fill={C.amber} />
      <circle cx={520} cy={120} r={5} fill={C.amber} />
      {/* lamps on the quay */}
      {lamps.map((x, i) => (
        <circle key={i} cx={x} cy={HORIZON - 30 - (i % 2) * 4} r={4} fill={C.cyanSoft} opacity={0.9} />
      ))}
      {/* control tower */}
      <rect x={690} y={158} width={78} height={HORIZON - 22 - 158} rx={4} fill={C.ink850} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
      <rect x={684} y={146} width={90} height={16} rx={3} fill={C.ink700} />
      {windows.map((wd, i) => (
        <rect key={i} x={wd.x + 2} y={wd.y} width={12} height={10} rx={2} fill={wd.c} opacity={wd.c === C.cyan || wd.c === C.amber ? 0.9 : 0.6} />
      ))}
      <circle cx={729} cy={132} r={34} fill="url(#port-beacon)" />
      <circle cx={729} cy={132} r={7} fill={C.rose} />
      {frame ? <rect x={1.5} y={1.5} width={w - 3} height={h - 3} rx={22} fill="none" stroke={alpha(C.cyan, 0.5)} strokeWidth={3} /> : null}
    </svg>
  );
}
