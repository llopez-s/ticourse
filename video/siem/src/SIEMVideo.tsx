import { AbsoluteFill, Html5Audio, Sequence, staticFile } from 'remotion';
import { SCENES } from './scenes';
import { TIMELINE, TRANSITION_FRAMES } from './timeline/load';
import { buildSceneProps } from './timeline/scene-props';
import { ensureFonts } from './theme/fonts';
import { FONT, C } from './theme/tokens';
import { Backdrop } from './ui/Backdrop';
import { TransitionFrame } from './overlay/TransitionFrame';
import { Captions } from './overlay/Captions';
import { ChapterRail } from './overlay/ChapterRail';
import { ExamCueLayer } from './overlay/ExamCueLayer';
import { ProgressBar } from './overlay/ProgressBar';
import { SimulationTag } from './overlay/SimulationTag';
import { ThinkPrompt } from './overlay/ThinkPrompt';

ensureFonts();

/**
 * Layer order (bottom → top): static backdrop, scenes (with transitions),
 * narration audio, then the persistent overlays. Scenes overlap their
 * predecessor by TRANSITION_FRAMES; a chapter change wipes instead of fading.
 */
export function SIEMVideo() {
  const scenes = TIMELINE.scenes;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text, background: C.ink950 }}>
      <Backdrop />

      {scenes.map((scene, index) => {
        const Scene = SCENES[scene.id];
        const props = buildSceneProps(scene.id);
        const next = scenes[index + 1];
        const kind = index > 0 && scenes[index - 1].chapter !== scene.chapter ? 'wipe' : 'fade';
        const nextWipes = next ? next.chapter !== scene.chapter : false;
        const exitFrames = next && !nextWipes ? TRANSITION_FRAMES : 0;
        return (
          <Sequence
            key={scene.id}
            name={scene.id}
            from={scene.from - props.enterFrames}
            durationInFrames={props.durationInFrames}
          >
            <TransitionFrame
              durationInFrames={props.durationInFrames}
              enterFrames={props.enterFrames}
              exitFrames={exitFrames}
              kind={kind}
            >
              <Scene {...props} />
            </TransitionFrame>
          </Sequence>
        );
      })}

      {TIMELINE.segments.map((segment) =>
        segment.audio ? (
          <Sequence
            key={segment.id}
            name={`voz ${segment.id}`}
            from={segment.from}
            durationInFrames={segment.audioFrames + 2}
            layout="none"
          >
            <Html5Audio src={staticFile(segment.audio)} />
          </Sequence>
        ) : null,
      )}

      <ChapterRail />
      <SimulationTag />
      <ThinkPrompt />
      <ExamCueLayer />
      <Captions />
      <ProgressBar />
    </AbsoluteFill>
  );
}
