import { AbsoluteFill } from 'remotion';
import { C, alpha } from '../theme/tokens';

/**
 * Static background shared by the whole video: ink gradient, a faint grid and
 * a soft cyan glow. It never animates, which keeps the H.264 stream small.
 */
export function Backdrop() {
  return (
    <AbsoluteFill style={{ background: C.ink950 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 700px at 78% -8%, ${alpha(C.cyanDeep, 0.28)} 0%, transparent 60%), radial-gradient(900px 600px at 0% 110%, ${alpha(C.violetDeep, 0.35)} 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.35,
          backgroundImage: `linear-gradient(${alpha(C.ink700, 0.55)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(C.ink700, 0.55)} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: '-1px -1px',
        }}
      />
    </AbsoluteFill>
  );
}
