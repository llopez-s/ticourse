import type { ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, alpha } from '../theme/tokens';
import { EASE, progress } from '../theme/motion';
import { Backdrop } from '../ui/Backdrop';

/**
 * Wraps one scene inside its Sequence and handles the hand-off with its
 * neighbours. The incoming scene overlaps the outgoing one by `enterFrames`:
 *   - 'fade': cross-dissolve with a subtle scale (0.985 → 1 in, 1 → 1.02 out)
 *   - 'wipe': chapter change — the incoming scene is revealed left→right
 *     behind a thin cyan edge; the outgoing scene is left untouched.
 * `exitFrames` is the fade-out length at the end (0 for the last scene or when
 * the next scene wipes in on top).
 */
export function TransitionFrame({
  durationInFrames,
  enterFrames,
  exitFrames,
  kind,
  children,
}: {
  durationInFrames: number;
  enterFrames: number;
  exitFrames: number;
  kind: 'fade' | 'wipe';
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const inP = enterFrames > 0 ? progress(frame, 0, enterFrames, EASE.inOut) : 1;
  const outP = exitFrames > 0 ? progress(frame, durationInFrames - exitFrames, exitFrames, EASE.inOut) : 0;

  if (kind === 'wipe' && inP < 1) {
    const edge = inP * 100;
    return (
      <AbsoluteFill>
        {/* The backdrop is repeated inside the clip so the outgoing scene is hidden behind the edge. */}
        <AbsoluteFill style={{ clipPath: `inset(0 ${100 - edge}% 0 0)` }}>
          <Backdrop />
          {children}
        </AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${edge}%`,
            width: 4,
            marginLeft: -2,
            background: C.cyan,
            boxShadow: `0 0 30px ${alpha(C.cyan, 0.8)}`,
          }}
        />
      </AbsoluteFill>
    );
  }

  const scale = (0.985 + 0.015 * inP) * (1 + 0.02 * outP);
  return (
    <AbsoluteFill style={{ opacity: Math.min(inP, 1 - outP), transform: `scale(${scale})` }}>{children}</AbsoluteFill>
  );
}
