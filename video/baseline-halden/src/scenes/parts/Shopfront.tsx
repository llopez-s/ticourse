import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../engine/src/ui';

/**
 * Concept 1's everyday image, always labelled «imagen · no es del puerto» by the scene: a chain of shops. The
 * central sends «la foto» of how the window must look (three mannequins); every shop builds it the same; in the third
 * window the middle mannequin has been moved (amber). Its two exits are drawn as ghosts: back in its place (emerald,
 * dashed, in the window) or the central changes the photo (violet, dashed, in the photo). No shop names, no people.
 */

/** One window's own units. */
const WIN_W = 164;
const WIN_H = 200;
const FLOOR = 176;
const SPOTS = [36, 82, 128] as const;
const MANNEQUIN_H = 112;

/** The moved mannequin's offset (window units) and tilt. */
const MOVE_X = 34;
const MOVE_ROT = 14;

function Mannequin({ x, color, dashed = false, rot = 0, opacity = 1 }: { x: number; color: string; dashed?: boolean; rot?: number; opacity?: number }) {
  const top = FLOOR - MANNEQUIN_H;
  const dash = dashed ? '6 6' : undefined;
  const fill = dashed ? 'none' : alpha(color, 0.22);
  return (
    <g transform={`rotate(${rot} ${x} ${FLOOR})`} opacity={opacity}>
      <circle cx={x} cy={top + 12} r={11} fill={fill} stroke={color} strokeWidth={3} strokeDasharray={dash} />
      <path
        d={`M ${x - 17} ${top + 30} L ${x + 17} ${top + 30} L ${x + 12} ${top + 76} L ${x - 12} ${top + 76} Z`}
        fill={fill}
        stroke={color}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeDasharray={dash}
      />
      <line x1={x} y1={top + 76} x2={x} y2={FLOOR - 6} stroke={color} strokeWidth={3} strokeDasharray={dash} />
      <line x1={x - 14} y1={FLOOR - 4} x2={x + 14} y2={FLOOR - 4} stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={dash} />
    </g>
  );
}

/** The inside of a window (or of the photo): back wall, floor, three mannequins. */
function WindowInside({ moved = 0, mismatch = 0, ghostBack = 0, ghostMoved = 0 }: { moved?: number; mismatch?: number; ghostBack?: number; ghostMoved?: number }) {
  const base = alpha(C.text, 0.85);
  const midColor = mismatch > 0.5 ? C.amber : base;
  return (
    <g>
      <rect x={4} y={30} width={WIN_W - 8} height={WIN_H - 34} fill="#16233b" />
      <rect x={4} y={FLOOR} width={WIN_W - 8} height={WIN_H - 4 - FLOOR} fill="#0f1a2e" />
      <Mannequin x={SPOTS[0]} color={base} />
      <Mannequin x={SPOTS[1] + MOVE_X * moved} rot={MOVE_ROT * moved} color={midColor} />
      <Mannequin x={SPOTS[2]} color={base} />
      {ghostBack > 0.01 ? <Mannequin x={SPOTS[1]} color={C.emerald} dashed opacity={ghostBack} /> : null}
      {ghostMoved > 0.01 ? <Mannequin x={SPOTS[1] + MOVE_X} rot={MOVE_ROT} color={C.violet} dashed opacity={ghostMoved} /> : null}
    </g>
  );
}

function Awning({ tone }: { tone: string }) {
  return (
    <g>
      <rect x={0} y={0} width={WIN_W} height={26} rx={4} fill={alpha(tone, 0.3)} stroke={alpha(tone, 0.7)} strokeWidth={2.5} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={6 + i * 26} y={2} width={13} height={22} fill={alpha(tone, 0.45)} />
      ))}
    </g>
  );
}

export const SHOP_W = 860;
export const SHOP_H = 380;
const PHOTO = { x: 0, y: 4, w: 240, img: 196 } as const;
const WINDOWS_X = 320;
const WINDOWS_GAP = 20;

/**
 * The full image (s02), in `SHOP_W`×`SHOP_H` units scaled to `width`. `photoIn`, `windowsIn` 0–1 reveal; `moved` 0–1
 * moves the third window's mannequin; `mismatch` 0–1 turns it amber and badges the window; `ghostBack` / `ghostPhoto`
 * 0–1 draw the two exits.
 */
export function Shopfront({
  width = SHOP_W,
  photoIn = 1,
  windowsIn = [1, 1, 1],
  moved = 0,
  mismatch = 0,
  ghostBack = 0,
  ghostPhoto = 0,
}: {
  width?: number;
  photoIn?: number;
  windowsIn?: readonly number[];
  moved?: number;
  mismatch?: number;
  ghostBack?: number;
  ghostPhoto?: number;
}) {
  const s = width / SHOP_W;
  const photoScale = PHOTO.img / WIN_W;
  const photoH = WIN_H * photoScale + 16;
  const m = clamp01(mismatch);
  return (
    <div style={{ position: 'relative', width, height: SHOP_H * s, fontFamily: FONT.sans }}>
      <svg width={width} height={SHOP_H * s} viewBox={`0 0 ${SHOP_W} ${SHOP_H}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* the central's photo: a print with a white border, slightly tilted */}
        <g opacity={clamp01(photoIn)} transform={`translate(${PHOTO.x + 12} ${PHOTO.y + 8 + (1 - clamp01(photoIn)) * 14}) rotate(-3 ${PHOTO.w / 2} ${photoH / 2})`}>
          <rect x={0} y={0} width={PHOTO.w} height={photoH + 18} rx={6} fill="#e5ebf3" stroke={alpha(C.violet, 0.3 + 0.6 * clamp01(ghostPhoto))} strokeWidth={3} />
          <g transform={`translate(${(PHOTO.w - PHOTO.img) / 2} 10) scale(${photoScale})`}>
            <rect x={0} y={0} width={WIN_W} height={WIN_H} fill="#0c1322" />
            <WindowInside ghostMoved={ghostPhoto} />
            <rect x={0} y={0} width={WIN_W} height={30} fill="#0c1322" />
          </g>
        </g>

        {/* three identical shops */}
        {[0, 1, 2].map((i) => {
          const o = clamp01(windowsIn[i] ?? 1);
          const x = WINDOWS_X + i * (WIN_W + WINDOWS_GAP);
          const third = i === 2;
          const frame = third ? mix(0.45, 1, m) : 0.45;
          const tone = third && m > 0.02 ? C.amber : C.cyan;
          return (
            <g key={i} opacity={o} transform={`translate(${x} ${30 + (1 - o) * 16})`}>
              <rect x={-8} y={-8} width={WIN_W + 16} height={WIN_H + 52} rx={10} fill={C.ink850} stroke={alpha(tone, frame)} strokeWidth={third ? 3 + 2 * m : 3} />
              <Awning tone={C.cyan} />
              <g>
                <WindowInside moved={third ? moved : 0} mismatch={third ? m : 0} ghostBack={third ? ghostBack : 0} />
              </g>
              <rect x={4} y={30} width={WIN_W - 8} height={WIN_H - 34} fill="none" stroke={alpha(C.text, 0.35)} strokeWidth={3} />
              {/* the shop's door strip under the window */}
              <rect x={10} y={WIN_H + 8} width={WIN_W - 20} height={28} rx={4} fill={C.ink800} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
            </g>
          );
        })}
      </svg>

      {/* caption under the photo */}
      <div
        style={{
          position: 'absolute',
          left: (PHOTO.x + 12) * s,
          top: (PHOTO.y + photoH + 40) * s,
          width: PHOTO.w * s,
          textAlign: 'center',
          fontSize: 32 * s,
          fontWeight: 750,
          lineHeight: 1.15,
          color: '#c4b5fd',
          opacity: clamp01(photoIn),
        }}
      >
        <div>la foto de</div>
        <div>la central</div>
      </div>

      {/* the mismatch badge on the third window */}
      {m > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: (WINDOWS_X + 2 * (WIN_W + WINDOWS_GAP) + WIN_W - 22) * s,
            top: 6 * s,
            width: 52 * s,
            height: 52 * s,
            borderRadius: 26 * s,
            display: 'grid',
            placeItems: 'center',
            background: C.amber,
            boxShadow: `0 0 ${24 * m}px ${alpha(C.amber, 0.5 * m)}`,
            opacity: m,
            transform: `scale(${0.7 + 0.3 * m})`,
          }}
        >
          <Icon name="alert" size={32 * s} color={C.ink950} strokeWidth={2.6} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * The image as a small icon (s08 rule 1): the photo and one shop window side by side, the window's mannequin moved
 * (amber) with its emerald ghost back in place. `width` ~ 300.
 */
export function ShopIcon({ width = 300, show = 1 }: { width?: number; show?: number }) {
  const W = 360;
  const H = 230;
  const sc = 0.95;
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible', opacity: clamp01(show) }}>
      <g transform={`translate(8 18) rotate(-4 80 90)`}>
        <rect x={0} y={0} width={WIN_W * sc + 20} height={WIN_H * sc + 22} rx={6} fill="#e5ebf3" stroke={alpha(C.violet, 0.6)} strokeWidth={3} />
        <g transform={`translate(10 10) scale(${sc})`}>
          <rect x={0} y={0} width={WIN_W} height={WIN_H} fill="#0c1322" />
          <WindowInside />
          <rect x={0} y={0} width={WIN_W} height={30} fill="#0c1322" />
        </g>
      </g>
      <g transform={`translate(${W - WIN_W - 10} 14)`}>
        <rect x={-6} y={-6} width={WIN_W + 12} height={WIN_H + 12} rx={10} fill={C.ink850} stroke={alpha(C.amber, 0.8)} strokeWidth={4} />
        <Awning tone={C.cyan} />
        <WindowInside moved={1} mismatch={1} ghostBack={1} />
        <rect x={4} y={30} width={WIN_W - 8} height={WIN_H - 34} fill="none" stroke={alpha(C.text, 0.35)} strokeWidth={3} />
      </g>
    </svg>
  );
}
