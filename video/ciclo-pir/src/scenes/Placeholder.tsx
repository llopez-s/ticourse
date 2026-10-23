import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, TYPE } from '../../../engine/src/theme/tokens';
import { TIMELINE } from '../timeline/load';

/** Stand-in for a scene that has not been built yet: its title and the current frame, to check timing. */
export function Placeholder({ id, props }: { id: SceneId; props: SceneProps }) {
  const frame = useCurrentFrame();
  const scene = sceneTiming(TIMELINE, id);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: STAGE.left,
          top: STAGE.top,
          width: STAGE.width,
          height: STAGE.height,
          border: `3px dashed ${C.ink600}`,
          borderRadius: 24,
          padding: 48,
          fontFamily: FONT.sans,
          color: C.muted,
        }}
      >
        <div style={{ fontSize: TYPE.h2, fontWeight: 800, color: C.text }}>{scene.title}</div>
        <div style={{ fontSize: TYPE.small, marginTop: 12 }}>
          {id} · frame {frame} / {props.durationInFrames}
        </div>
      </div>
    </AbsoluteFill>
  );
}
