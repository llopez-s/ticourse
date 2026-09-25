import type { ComponentType, FC } from 'react';
import { AbsoluteFill, Composition, Folder, Still } from 'remotion';
import { GALLERY_DURATION, OverlayGallery } from './dev/OverlayGallery';
import { LessonVideo, sceneComponent, type SceneMap } from './LessonVideo';
import { TimelineProvider } from './timeline/context';
import { buildSceneProps } from './timeline/scene-props';
import type { Timeline } from './timeline/types';
import { ensureFonts } from './theme/fonts';
import { Backdrop } from './ui/Backdrop';

ensureFonts();

/**
 * Builds the Remotion root of one video: the full composition, its poster
 * still, one preview composition per scene and the overlay gallery.
 * `composition` and `poster` are the ids in the video's video.json. Call it
 * once at module level so the components keep a stable identity.
 */
export function createLessonRoot({
  timeline,
  scenes,
  composition,
  poster,
  Poster,
}: {
  timeline: Timeline;
  scenes: SceneMap;
  composition: string;
  poster: string;
  Poster: ComponentType;
}): FC {
  const Video = () => <LessonVideo timeline={timeline} scenes={scenes} />;
  /** Renders a single scene on the backdrop — used by the per-scene Studio previews. */
  const ScenePreview = ({ sceneId }: { sceneId: string }) => {
    const Scene = sceneComponent(scenes, sceneId);
    return (
      <TimelineProvider value={timeline}>
        <AbsoluteFill>
          <Backdrop />
          <Scene {...buildSceneProps(timeline, sceneId)} />
        </AbsoluteFill>
      </TimelineProvider>
    );
  };
  const LessonRoot = () => (
    <>
      <Composition
        id={composition}
        component={Video}
        durationInFrames={timeline.durationInFrames}
        fps={timeline.fps}
        width={timeline.width}
        height={timeline.height}
      />
      <Still id={poster} component={Poster} width={timeline.width} height={timeline.height} />
      <Folder name="escenas">
        {timeline.scenes.map((scene) => (
          <Composition
            key={scene.id}
            id={`escena-${scene.id}`}
            component={ScenePreview}
            defaultProps={{ sceneId: scene.id }}
            durationInFrames={buildSceneProps(timeline, scene.id).durationInFrames}
            fps={timeline.fps}
            width={timeline.width}
            height={timeline.height}
          />
        ))}
      </Folder>
      <Folder name="dev">
        <Composition
          id="OverlayGallery"
          component={OverlayGallery}
          durationInFrames={GALLERY_DURATION}
          fps={timeline.fps}
          width={timeline.width}
          height={timeline.height}
        />
      </Folder>
    </>
  );
  return LessonRoot;
}
