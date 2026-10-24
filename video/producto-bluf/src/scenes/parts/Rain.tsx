import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { rand } from './Icons';

/**
 * A rain of envelopes over the stage: deterministic positions and speeds, so every frame is
 * reproducible. Envelope i starts falling at `from + i * stagger`; `calm` (0–1) thins the rain out
 * by fading the later envelopes first. The rain never reads numbers or names: it is only mail.
 */
export function EnvelopeRain({
  frame,
  from = 0,
  count = 30,
  stagger = 3,
  width = 1728,
  height = 660,
  tone = C.amber,
  opacity = 1,
  calm = 0,
  seed = 1,
}: {
  frame: number;
  from?: number;
  count?: number;
  stagger?: number;
  width?: number;
  height?: number;
  tone?: string;
  opacity?: number;
  calm?: number;
  seed?: number;
}) {
  if (opacity <= 0.002) return null;
  const items = Array.from({ length: count }, (_, i) => {
    const r1 = rand(seed * 100 + i * 3 + 1);
    const r2 = rand(seed * 100 + i * 3 + 2);
    const r3 = rand(seed * 100 + i * 3 + 3);
    const size = 46 + r2 * 40;
    const speed = 2.6 + r3 * 3.6; // px per frame
    const span = height + 2 * size;
    const start = from + i * stagger;
    const t = frame - start;
    if (t < 0) return null;
    const y = ((t * speed + r1 * span) % span) - size;
    const x = r1 * (width - size);
    const sway = Math.sin((t + i * 11) / 22) * 12;
    const rot = (r3 - 0.5) * 36 + Math.sin((t + i * 7) / 30) * 8;
    const keep = Math.max(0, Math.min(1, (1 - calm) * count - i));
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x + sway,
          top: y,
          opacity: (0.35 + 0.55 * r2) * keep,
          transform: `rotate(${rot}deg)`,
        }}
      >
        <Icon name="mail" size={size} color={tone} strokeWidth={1.7} style={{ filter: `drop-shadow(0 0 8px ${alpha(tone, 0.35)})` }} />
      </div>
    );
  });
  return <div style={{ position: 'absolute', left: 0, top: 0, width, height, overflow: 'hidden', opacity, pointerEvents: 'none' }}>{items}</div>;
}
