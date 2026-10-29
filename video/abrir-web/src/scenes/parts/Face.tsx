import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * «La cara» of the DNI's owner = the private key: a drawn face (circle, eyes, smile), not the photo. Cyan outline
 * so it reads next to the DNI. show 0-1 fades it in, glow 0-1 adds a halo, size is its width.
 */
export function Face({ size = 200, show = 1, glow = 0, color = C.cyan }: { size?: number; show?: number; glow?: number; color?: string }) {
  const g = clamp01(glow);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: 'block', overflow: 'visible', opacity: clamp01(show), filter: g > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * g)}px ${alpha(color, 0.55 * g)})` : undefined }}
      aria-hidden
    >
      <circle cx={50} cy={50} r={44} fill={alpha(color, 0.1)} stroke={alpha(color, 0.9)} strokeWidth={3.5} />
      <circle cx={36} cy={42} r={5} fill={color} />
      <circle cx={64} cy={42} r={5} fill={color} />
      <path d="M 50 46 L 47 58 L 53 58" fill="none" stroke={alpha(color, 0.7)} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 33 68 Q 50 82 67 68" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}
