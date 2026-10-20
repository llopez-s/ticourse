import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The backpack's own units (viewBox). */
export const BACKPACK = { w: 400, h: 480 } as const;

/** The four zipped pockets: top, front (the outer one), left side, right side. */
export type Pocket = 'top' | 'front' | 'left' | 'right';

/** Centre of each pocket (viewBox units), for labels drawn by the scene. */
export const POCKET_CENTRE: Record<Pocket, { x: number; y: number }> = {
  top: { x: 200, y: 140 },
  front: { x: 200, y: 350 },
  left: { x: 46, y: 310 },
  right: { x: 354, y: 310 },
};

/** Each pocket's outline and its zipper (from the pull's end to the other). */
const SHAPE: Record<Pocket, { d: string; zip: [number, number, number, number]; hand: { x: number; y: number; rot: number } }> = {
  top: { d: 'M 112 96 Q 112 88 124 88 L 276 88 Q 288 88 288 96 L 288 178 Q 288 190 276 190 L 124 190 Q 112 190 112 178 Z', zip: [126, 104, 274, 104], hand: { x: 236, y: 104, rot: 18 } },
  front: { d: 'M 96 262 Q 96 244 116 244 L 284 244 Q 304 244 304 262 L 304 428 Q 304 448 284 448 L 116 448 Q 96 448 96 428 Z', zip: [112, 262, 288, 262], hand: { x: 252, y: 262, rot: 22 } },
  left: { d: 'M 22 214 Q 22 198 40 198 L 74 198 L 74 422 L 40 422 Q 22 422 22 406 Z', zip: [34, 216, 34, 404], hand: { x: 34, y: 300, rot: -60 } },
  right: { d: 'M 378 214 Q 378 198 360 198 L 326 198 L 326 422 L 360 422 Q 378 422 378 406 Z', zip: [366, 216, 366, 404], hand: { x: 366, y: 300, rot: 60 } },
};

const POCKETS: Pocket[] = ['top', 'front', 'left', 'right'];

/** A stylised gloved hand pointing down (fingertips at 0,0), rose: the pickpocket. */
function Hand({ x, y, rot, scale = 1 }: { x: number; y: number; rot: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      {/* sleeve */}
      <rect x={-34} y={-190} width={68} height={92} rx={14} fill={C.roseDeep} stroke={alpha(C.rose, 0.8)} strokeWidth={4} />
      {/* palm */}
      <rect x={-30} y={-104} width={60} height={64} rx={20} fill={alpha(C.rose, 0.92)} stroke={C.roseSoft} strokeWidth={3} />
      {/* four fingers */}
      {[-22, -8, 6, 20].map((fx, k) => (
        <rect key={fx} x={fx - 6} y={-50} width={13} height={k === 1 || k === 2 ? 50 : 42} rx={6.5} fill={alpha(C.rose, 0.92)} stroke={C.roseSoft} strokeWidth={2.5} />
      ))}
      {/* thumb */}
      <rect x={24} y={-92} width={13} height={40} rx={6.5} transform="rotate(-28 30 -92)" fill={alpha(C.rose, 0.92)} stroke={C.roseSoft} strokeWidth={2.5} />
    </g>
  );
}

/** The jingle bell hung from a pocket's pull: a gold sphere with its slit; it swings when it rings. */
function Bell({ x, y, swing, ring }: { x: number; y: number; swing: number; ring: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${swing})`}>
      <line x1={0} y1={0} x2={0} y2={22} stroke={alpha(C.text, 0.7)} strokeWidth={3} />
      <circle cx={0} cy={44} r={22} fill="#e5b93a" stroke="#fde68a" strokeWidth={3} />
      <path d="M -12 50 L 12 50" stroke="#7c5a10" strokeWidth={4} strokeLinecap="round" />
      <circle cx={0} cy={56} r={4} fill="#7c5a10" />
      <circle cx={-7} cy={36} r={5} fill={alpha('#ffffff', 0.5)} />
      {ring > 0.02
        ? [0, 1].map((k) => (
            <g key={k} opacity={ring * (1 - k * 0.4)}>
              <path d={`M ${30 + k * 12} ${28} Q ${40 + k * 14} ${44} ${30 + k * 12} ${60}`} fill="none" stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
              <path d={`M ${-30 - k * 12} ${28} Q ${-40 - k * 14} ${44} ${-30 - k * 12} ${60}`} fill="none" stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
            </g>
          ))
        : null}
    </g>
  );
}

/**
 * The backpack in the metro, seen from behind (the video's everyday image; the scene adds «imagen · no es del
 * puerto»). Four zipped pockets: each is a place a pickpocket can slip a hand in. Per pocket (0–1): `lit` outlines it in
 * cyan (the voice is on it), `open` parts its zipper. `hand` brings the rose hand into one pocket (`at` 0–1). `sewn`
 * stitches the left pocket shut (the one you do not use); `bell` hangs a jingle bell on the right one, which still
 * opens; `ring` swings it. `surface` outlines every pocket at once.
 */
export function Backpack({
  width,
  lit = {},
  open = {},
  hand,
  sewn = 0,
  bell = 0,
  ring = 0,
  surface = 0,
  frame = 0,
  dim = 0,
}: {
  width: number;
  lit?: Partial<Record<Pocket, number>>;
  open?: Partial<Record<Pocket, number>>;
  hand?: { pocket: Pocket; at: number };
  sewn?: number;
  bell?: number;
  ring?: number;
  surface?: number;
  frame?: number;
  /** Steps every pocket outline back (0–1). */
  dim?: number;
}) {
  const h = (width * BACKPACK.h) / BACKPACK.w;
  const sf = clamp01(surface);
  const sw = clamp01(sewn);
  const r = clamp01(ring);
  const swing = r * 14 * Math.sin((frame / 30) * Math.PI * 2 * 0.9);
  const handAt = hand ? clamp01(hand.at) : 0;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${BACKPACK.w} ${BACKPACK.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* handle and body */}
      <path d="M 160 58 Q 160 18 200 18 Q 240 18 240 58" fill="none" stroke="#2c3a52" strokeWidth={14} strokeLinecap="round" />
      <path d="M 72 92 Q 72 52 200 52 Q 328 52 328 92 L 342 432 Q 342 470 306 470 L 94 470 Q 58 470 58 432 Z" fill="#33445f" stroke="#4d6285" strokeWidth={4} />
      <path d="M 86 100 Q 86 66 200 66 Q 314 66 314 100" fill="none" stroke={alpha('#ffffff', 0.08)} strokeWidth={6} />
      {POCKETS.map((p) => {
        const s = SHAPE[p];
        const l = Math.max(clamp01(lit[p] ?? 0), sf);
        const o = clamp01(open[p] ?? 0);
        const [x1, y1, x2, y2] = s.zip;
        const vertical = x1 === x2;
        const isSewn = p === 'left' && sw > 0.01;
        const zipLen = Math.hypot(x2 - x1, y2 - y1);
        return (
          <g key={p}>
            <path d={s.d} fill="#3e5274" stroke={l > 0.02 ? alpha(C.cyan, 0.4 + 0.6 * l * (1 - 0.5 * dim)) : '#566c91'} strokeWidth={l > 0.02 ? 5 : 3} />
            {l > 0.02 ? <path d={s.d} fill="none" stroke={alpha(C.cyan, 0.25 * l * (1 - 0.5 * dim))} strokeWidth={14} /> : null}
            {/* the opening: a dark gap that widens along the zipper */}
            {o > 0.01 ? (
              vertical ? (
                <ellipse cx={x1} cy={(y1 + y2) / 2} rx={8 * o} ry={zipLen / 2} fill={C.ink950} />
              ) : (
                <ellipse cx={(x1 + x2) / 2} cy={y1} rx={zipLen / 2} ry={12 * o} fill={C.ink950} />
              )
            ) : null}
            {/* zipper: a dark track with light teeth */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1c2738" strokeWidth={9} strokeLinecap="round" />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={alpha('#cbd5e1', 0.75)} strokeWidth={7} strokeDasharray="3 4" />
            {/* the pull */}
            {!isSewn ? <rect x={x1 - (vertical ? 6 : 4)} y={y1 - (vertical ? 4 : 6)} width={vertical ? 12 : 22} height={vertical ? 22 : 12} rx={4} fill="#cbd5e1" /> : null}
            {/* stitches over the zipper (the pocket you do not use) */}
            {isSewn ? (
              <path
                d={Array.from({ length: 13 }, (_, k) => `${k === 0 ? 'M' : 'L'} ${x1 + (k % 2 === 0 ? -11 : 11)} ${y1 + (k * (y2 - y1)) / 12}`).join(' ')}
                fill="none"
                stroke={C.emerald}
                strokeWidth={4}
                strokeLinejoin="round"
                strokeDasharray={`${zipLen * 2.2} ${zipLen * 2.2}`}
                strokeDashoffset={zipLen * 2.2 * (1 - sw)}
              />
            ) : null}
          </g>
        );
      })}
      {/* the bell on the right pocket's pull */}
      {bell > 0.01 ? (
        <g opacity={clamp01(bell)}>
          <Bell x={366} y={212} swing={swing} ring={r} />
        </g>
      ) : null}
      {/* the hand */}
      {hand && handAt > 0.01 ? (
        <g opacity={Math.min(1, handAt * 3)}>
          <Hand
            x={SHAPE[hand.pocket].hand.x + (1 - handAt) * 70 * Math.sin((SHAPE[hand.pocket].hand.rot * Math.PI) / 180)}
            y={SHAPE[hand.pocket].hand.y - (1 - handAt) * 90}
            rot={SHAPE[hand.pocket].hand.rot}
          />
        </g>
      ) : null}
    </svg>
  );
}
