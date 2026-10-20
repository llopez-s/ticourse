import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The port's machines as plain silhouettes (s01's fleet, s04's slots, the question stills): no names, no screens with
 * text, no cables to anything. Each draws in its own viewBox and scales to `width`; `tone` is the outline colour and
 * `fill` the body.
 */

interface ArtProps {
  width: number;
  tone?: string;
  fill?: string;
  opacity?: number;
}

const BODY = C.ink800;

export const LAPTOP_RATIO = 110 / 160;
export function LaptopArt({ width, tone = C.cyan, fill = BODY, opacity = 1 }: ArtProps) {
  return (
    <svg width={width} height={width * LAPTOP_RATIO} viewBox="0 0 160 110" style={{ display: 'block', opacity, overflow: 'visible' }}>
      <rect x={26} y={8} width={108} height={72} rx={7} fill={fill} stroke={tone} strokeWidth={4} />
      <rect x={34} y={16} width={92} height={56} rx={3} fill={alpha(tone, 0.12)} />
      <path d="M 8 88 H 152 L 144 102 H 16 Z" fill={fill} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      <rect x={66} y={88} width={28} height={5} rx={2} fill={alpha(tone, 0.5)} />
    </svg>
  );
}

export const SERVER_RATIO = 150 / 120;
/** A small rack tower with three units and status lights; `lit` 0–1 per unit light (emerald = matches). */
export function ServerArt({ width, tone = C.cyan, fill = BODY, opacity = 1, light = alpha(C.cyan, 0.5) }: ArtProps & { light?: string }) {
  return (
    <svg width={width} height={width * SERVER_RATIO} viewBox="0 0 120 150" style={{ display: 'block', opacity, overflow: 'visible' }}>
      <rect x={14} y={6} width={92} height={138} rx={8} fill={fill} stroke={tone} strokeWidth={4} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={24} y={18 + i * 42} width={72} height={32} rx={4} fill={alpha(tone, 0.1)} stroke={alpha(tone, 0.45)} strokeWidth={2} />
          <circle cx={36} cy={34 + i * 42} r={4.5} fill={light} />
          <rect x={48} y={31 + i * 42} width={38} height={5} rx={2} fill={alpha(tone, 0.35)} />
        </g>
      ))}
    </svg>
  );
}

export const PHONE_RATIO = 150 / 84;
export function PhoneArt({ width, tone = C.cyan, fill = BODY, opacity = 1 }: ArtProps) {
  return (
    <svg width={width} height={width * PHONE_RATIO} viewBox="0 0 84 150" style={{ display: 'block', opacity, overflow: 'visible' }}>
      <rect x={6} y={4} width={72} height={142} rx={14} fill={fill} stroke={tone} strokeWidth={4} />
      <rect x={14} y={20} width={56} height={104} rx={4} fill={alpha(tone, 0.12)} />
      <rect x={32} y={10} width={20} height={4} rx={2} fill={alpha(tone, 0.5)} />
      <circle cx={42} cy={135} r={5} fill="none" stroke={alpha(tone, 0.6)} strokeWidth={2.5} />
    </svg>
  );
}

export const CLOUD_RATIO = 100 / 160;
export function CloudArt({ width, tone = C.cyan, fill = BODY, opacity = 1 }: ArtProps) {
  return (
    <svg width={width} height={width * CLOUD_RATIO} viewBox="0 0 160 100" style={{ display: 'block', opacity, overflow: 'visible' }}>
      <path
        d="M 40 88 C 18 88 8 74 10 60 C 12 46 26 38 38 40 C 42 22 58 10 78 12 C 98 14 110 28 112 42 C 130 38 150 50 150 66 C 150 80 138 88 124 88 Z"
        fill={fill}
        stroke={tone}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M 44 72 H 118" stroke={alpha(tone, 0.35)} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

export const SWITCH_RATIO = 70 / 170;
export function SwitchArt({ width, tone = C.cyan, fill = BODY, opacity = 1 }: ArtProps) {
  return (
    <svg width={width} height={width * SWITCH_RATIO} viewBox="0 0 170 70" style={{ display: 'block', opacity, overflow: 'visible' }}>
      <rect x={4} y={14} width={162} height={46} rx={8} fill={fill} stroke={tone} strokeWidth={4} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={16 + i * 18} y={30} width={12} height={12} rx={2} fill={alpha(tone, 0.18)} stroke={alpha(tone, 0.5)} strokeWidth={1.5} />
      ))}
      <circle cx={158} cy={24} r={3} fill={alpha(tone, 0.6)} />
    </svg>
  );
}

export const BRIDGE_RATIO = 120 / 220;
/**
 * The drawbridge at the port's entrance, lowered: two piers in the water, the deck across, a counterweight tower on
 * the left and a railing. No cables, no control box, no network line.
 */
export function BridgeArt({ width, tone = C.cyan, fill = BODY, opacity = 1 }: ArtProps) {
  return (
    <svg width={width} height={width * BRIDGE_RATIO} viewBox="0 0 220 120" style={{ display: 'block', opacity, overflow: 'visible' }}>
      {/* water */}
      <path d="M 0 104 Q 14 98 28 104 T 56 104 T 84 104 T 112 104 T 140 104 T 168 104 T 196 104 T 224 104" fill="none" stroke={alpha(C.sky, 0.6)} strokeWidth={3} />
      {/* counterweight tower */}
      <rect x={14} y={22} width={38} height={58} rx={4} fill={fill} stroke={tone} strokeWidth={4} />
      <rect x={22} y={32} width={22} height={16} rx={2} fill={alpha(tone, 0.25)} />
      {/* piers */}
      <rect x={20} y={80} width={26} height={24} fill={fill} stroke={tone} strokeWidth={4} />
      <rect x={180} y={80} width={26} height={24} fill={fill} stroke={tone} strokeWidth={4} />
      {/* deck, lowered */}
      <rect x={8} y={70} width={206} height={12} rx={3} fill={fill} stroke={tone} strokeWidth={4} />
      {/* railing */}
      <path d="M 56 70 V 56 H 206 V 70" fill="none" stroke={alpha(tone, 0.7)} strokeWidth={3} />
      {[76, 96, 116, 136, 156, 176, 196].map((x) => (
        <line key={x} x1={x} y1={56} x2={x} y2={70} stroke={alpha(tone, 0.5)} strokeWidth={2.5} />
      ))}
    </svg>
  );
}
