import type { ComponentType } from 'react';
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from 'remotion';
import { TRANSITION_FRAMES } from './timeline/load';
import { TimelineProvider } from './timeline/context';
import { buildSceneProps } from './timeline/scene-props';
import type { SceneProps, Timeline } from './timeline/types';
import { ensureFonts } from './theme/fonts';
import { FONT, C } from './theme/tokens';
import { Backdrop } from './ui/Backdrop';
import { TransitionFrame } from './overlay/TransitionFrame';
import { Captions } from './overlay/Captions';
import { ChapterRail } from './overlay/ChapterRail';
import { ExamCueLayer } from './overlay/ExamCueLayer';
import { InterceptLayer } from './overlay/InterceptLayer';
import { ProgressBar } from './overlay/ProgressBar';
import { SimulationTag } from './overlay/SimulationTag';
import { ThinkPrompt } from './overlay/ThinkPrompt';

ensureFonts();

export type SceneMap = Record<string, ComponentType<SceneProps>>;

/** Throws when the storyboard has a scene the video has no component for. */
export function sceneComponent(scenes: SceneMap, id: string): ComponentType<SceneProps> {
  const Scene = scenes[id];
  if (!Scene) throw new Error(`No scene component for "${id}" (have: ${Object.keys(scenes).join(', ')})`);
  return Scene;
}

/**
 * One lesson video. Layer order (bottom → top): static backdrop, scenes (with
 * transitions), narration audio, then the persistent overlays. Scenes overlap
 * their predecessor by TRANSITION_FRAMES; a chapter change wipes instead of fading.
 */
export function LessonVideo({ timeline, scenes }: { timeline: Timeline; scenes: SceneMap }) {
  const list = timeline.scenes;
  return (
    <TimelineProvider value={timeline}>
      <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text, background: C.ink950 }}>
        <Backdrop />

        {list.map((scene, index) => {
          const Scene = sceneComponent(scenes, scene.id);
          const props = buildSceneProps(timeline, scene.id);
          const next = list[index + 1];
          const kind = index > 0 && list[index - 1].chapter !== scene.chapter ? 'wipe' : 'fade';
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

        {timeline.segments.map((segment) =>
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
        <InterceptLayer />
        <ExamCueLayer />
        <Captions />
        <ProgressBar />
      </AbsoluteFill>
    </TimelineProvider>
  );
}
