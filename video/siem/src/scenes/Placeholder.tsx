import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { sceneTiming } from '../timeline/load';
import type { SceneId, SceneProps } from '../timeline/types';
import { C, FONT, STAGE, TYPE } from '../theme/tokens';

/**
 * Development stand-in for a scene that has not been built yet: shows the
 * scene title and a live list of its cues so timing can be checked in Studio.
 */
export function Placeholder({ id, props }: { id: SceneId; props: SceneProps }) {
  const frame = useCurrentFrame();
  const scene = sceneTiming(id);
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
