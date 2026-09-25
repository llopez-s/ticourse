import { AbsoluteFill, Composition, Folder, Still } from 'remotion';
import { Poster } from './Poster';
import { GALLERY_DURATION, OverlayGallery } from './dev/OverlayGallery';
import { SIEMVideo } from './SIEMVideo';
import { SCENES } from './scenes';
import { TIMELINE } from './timeline/load';
import { buildSceneProps } from './timeline/scene-props';
import type { SceneId } from './timeline/types';
import { ensureFonts } from './theme/fonts';
import { Backdrop } from './ui/Backdrop';

ensureFonts();

/** Renders a single scene on the backdrop — used by the per-scene Studio previews. */
function ScenePreview({ sceneId }: { sceneId: SceneId }) {
  const Scene = SCENES[sceneId];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Scene {...buildSceneProps(sceneId)} />
    </AbsoluteFill>
  );
}

export const SIEMRoot = () => (
  <>
    <Composition
      id="SIEMBlueTeam"
      component={SIEMVideo}
      durationInFrames={TIMELINE.durationInFrames}
      fps={TIMELINE.fps}
      width={TIMELINE.width}
      height={TIMELINE.height}
    />
    <Still id="SIEMPoster" component={Poster} width={TIMELINE.width} height={TIMELINE.height} />
    <Folder name="escenas">
      {TIMELINE.scenes.map((scene) => (
        <Composition
          key={scene.id}
          id={`escena-${scene.id}`}
          component={ScenePreview}
          defaultProps={{ sceneId: scene.id }}
          durationInFrames={buildSceneProps(scene.id).durationInFrames}
          fps={TIMELINE.fps}
          width={TIMELINE.width}
          height={TIMELINE.height}
        />
      ))}
    </Folder>
    <Folder name="dev">
      <Composition
        id="OverlayGallery"
        component={OverlayGallery}
        durationInFrames={GALLERY_DURATION}
        fps={TIMELINE.fps}
        width={TIMELINE.width}
        height={TIMELINE.height}
      />
    </Folder>
  </>
);
