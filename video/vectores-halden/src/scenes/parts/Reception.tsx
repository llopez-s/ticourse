import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The reception's own units (viewBox). Everything else scales from `width`. */
export const RECEPTION = { w: 760, h: 380 } as const;

/**
 * Where each entry of the map reaches the reception (viewBox units): the mail and the visitors' program reach the two
 * screens, the USB line the ports on the counter's front, the phone its handset, the printer line its little panel.
 */
export const RECEPTION_ANCHORS = {
  mail: { x: 112, y: 112 },
  phone: { x: 548, y: 168 },
  usb: { x: 196, y: 262 },
  usb2: { x: 386, y: 262 },
  printer: { x: 730, y: 196 },
  updates: { x: 444, y: 76 },
  /** The counter's top, where something can be left (s04's pendrive). */
  counterTop: { x: 520, y: 206 },
} as const;

export type ReceptionPart = 'pc1' | 'pc2' | 'phone' | 'usb' | 'printer';

/**
 * The reception of the office building in schematic (s01, s02, s04, s06): the counter, two screens on it, a phone, a
 * printer with its small admin panel on a cabinet beside it, and on the counter's front the two computers' USB ports.
 * No names, no network, no wifi. `lit` brightens a part (0–1); `glow` lights the whole desk softly.
 */
export function Reception({
  width,
  lit = {},
  glow = 0,
  screens = 0.35,
}: {
  width: number;
  lit?: Partial<Record<ReceptionPart, number>>;
  glow?: number;
  /** How bright the two screens are (0 off, 1 on). */
  screens?: number;
}) {
  const h = (width * RECEPTION.h) / RECEPTION.w;
  const l = (p: ReceptionPart) => clamp01(lit[p] ?? 0);
  const g = clamp01(glow);
  const stroke = alpha(C.cyan, 0.45 + 0.3 * g);
  const screen = (x: number, part: ReceptionPart) => {
    const o = l(part);
    return (
      <g>
        <rect x={x} y={64} width={164} height={112} rx={10} fill={C.ink900} stroke={o > 0.02 ? alpha(C.cyan, 0.5 + 0.5 * o) : stroke} strokeWidth={5} />
        <rect x={x + 12} y={76} width={140} height={88} rx={5} fill={alpha(C.cyan, 0.05 + 0.12 * clamp01(screens) + 0.2 * o)} />
        {[0, 1, 2].map((k) => (
          <rect key={k} x={x + 26} y={92 + k * 22} width={[96, 70, 84][k]} height={9} rx={4} fill={alpha(C.cyan, 0.15 + 0.25 * clamp01(screens))} />
        ))}
        <rect x={x + 72} y={176} width={20} height={22} fill={C.ink700} />
        <rect x={x + 48} y={196} width={68} height={8} rx={3} fill={C.ink700} />
      </g>
    );
  };
  const port = (cx: number) => {
    const o = l('usb');
    return (
      <g>
        {o > 0.02 ? <circle cx={cx} cy={262} r={30} fill={alpha(C.cyan, 0.18 * o)} /> : null}
        <rect x={cx - 18} y={254} width={36} height={16} rx={3} fill={C.ink950} stroke={alpha(C.cyan, 0.45 + 0.55 * o)} strokeWidth={3} />
        <rect x={cx - 10} y={258} width={20} height={5} fill={alpha(C.cyan, 0.4 + 0.5 * o)} />
      </g>
    );
  };
  const ph = l('phone');
  const pr = l('printer');
  return (
    <svg width={width} height={h} viewBox={`0 0 ${RECEPTION.w} ${RECEPTION.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {g > 0.02 ? <ellipse cx={360} cy={240} rx={360} ry={150} fill={alpha(C.cyan, 0.06 * g)} /> : null}
      {/* the counter: top slab and front panel */}
      <rect x={30} y={204} width={600} height={24} rx={6} fill={C.ink700} stroke={stroke} strokeWidth={3} />
      <rect x={50} y={228} width={560} height={140} rx={4} fill={C.ink850} stroke={stroke} strokeWidth={3} />
      <rect x={50} y={300} width={560} height={6} fill={alpha(C.cyan, 0.25 + 0.2 * g)} />
      {port(196)}
      {port(386)}
      {/* two screens */}
      {screen(110, 'pc1')}
      {screen(300, 'pc2')}
      {/* the phone */}
      <g>
        {ph > 0.02 ? <circle cx={548} cy={182} r={44} fill={alpha(C.cyan, 0.16 * ph)} /> : null}
        <path d="M 500 204 L 512 178 L 584 178 L 596 204 Z" fill={C.ink800} stroke={ph > 0.02 ? alpha(C.cyan, 0.5 + 0.5 * ph) : stroke} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 508 172 Q 548 146 588 172" fill="none" stroke={ph > 0.02 ? alpha(C.cyan, 0.5 + 0.5 * ph) : stroke} strokeWidth={10} strokeLinecap="round" />
        {[0, 1, 2].map((k) => (
          <rect key={k} x={526 + k * 16} y={186} width={10} height={6} rx={2} fill={alpha(C.text, 0.3)} />
        ))}
      </g>
      {/* the printer on its cabinet, with its admin panel */}
      <g>
        <rect x={654} y={250} width={88} height={118} rx={4} fill={C.ink850} stroke={stroke} strokeWidth={3} />
        <rect x={672} y={274} width={52} height={6} rx={3} fill={alpha(C.text, 0.2)} />
        <rect x={640} y={176} width={116} height={74} rx={8} fill={C.ink800} stroke={stroke} strokeWidth={4} />
        <rect x={660} y={160} width={76} height={18} rx={3} fill={alpha(C.text, 0.75)} />
        <rect x={656} y={228} width={70} height={8} rx={3} fill={C.ink950} />
        {pr > 0.02 ? <circle cx={730} cy={196} r={26} fill={alpha(C.cyan, 0.2 * pr)} /> : null}
        <rect x={714} y={186} width={30} height={20} rx={3} fill={alpha(C.cyan, 0.2 + 0.6 * pr)} stroke={alpha(C.cyan, 0.5 + 0.5 * pr)} strokeWidth={2} />
      </g>
    </svg>
  );
}
