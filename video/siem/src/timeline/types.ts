/**
 * Contract between the Node timeline builder (scripts/build-timeline.mjs) and
 * the Remotion composition. Every frame number is ABSOLUTE (video frame) unless
 * a field says otherwise. The builder is the only writer of timeline.json.
 */

export type SceneId =
  | 's01-hook'
  | 's02-collect'
  | 's03-normalize'
  | 's04-enrich'
  | 's05-correlate'
  | 's06-fatigue'
  | 's07-tuning'
  | 's08-triage'
  | 's09-pivot'
  | 's10-contain'
  | 's11-limits'
  | 's12-recap';

export type ChapterNumber = 1 | 2 | 3 | 4 | 5;

/** One display token (word + attached punctuation) with its spoken interval. */
export interface TimedWord {
  text: string;
  /** First frame the word is being spoken. */
  from: number;
  /** Frame after the last spoken frame (exclusive). Always > from. */
  to: number;
}

export interface TimedSegment {
  id: string;
  scene: SceneId;
  /** Display text (what captions and the transcript show). */
  text: string;
  /** Frame at which this segment's audio starts. */
  from: number;
  /** Length of the audio in frames (ceil). */
  audioFrames: number;
  /** audioFrames + the pause (and any think hold) that follows it. */
  durationInFrames: number;
  /** Path relative to the Remotion public dir, e.g. "voice/s01-01.mp3"; null in estimate mode. */
  audio: string | null;
  words: TimedWord[];
}

/** One caption page: 1–2 lines, each line a list of timed display tokens. */
export interface CaptionPage {
  from: number;
  /** Exclusive. */
  to: number;
  lines: TimedWord[][];
}

export interface SceneTiming {
  id: SceneId;
  chapter: ChapterNumber;
  chapterTitle: string;
  title: string;
  /** Nominal start. The scene's visuals begin TRANSITION_FRAMES earlier (except the first). */
  from: number;
  /** Nominal length: from this scene's start to the next scene's start. */
  durationInFrames: number;
}

export interface CuePoint {
  scene: SceneId;
  id: string;
  frame: number;
}

export interface ExamCue {
  scene: SceneId;
  from: number;
  durationInFrames: number;
  /** SY0-701 objective, e.g. "4.4". */
  objective: string;
  text: string;
}

export interface ThinkPrompt {
  scene: SceneId;
  from: number;
  durationInFrames: number;
  q: string;
}

export interface Timeline {
  mode: 'audio' | 'estimate';
  /** sha256 of narration.json + lexicon.json + storyboard.json used to build this file. */
  sourceHash: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  voice: string;
  scenes: SceneTiming[];
  segments: TimedSegment[];
  captions: CaptionPage[];
  cues: CuePoint[];
  exam: ExamCue[];
  think: ThinkPrompt[];
}

/** What every scene component receives. All frames are LOCAL to the scene's Sequence. */
export interface SceneProps {
  /** Local length of the scene's Sequence, including the enter overlap. */
  durationInFrames: number;
  /** Frames of overlap with the previous scene at the start (0 for the first scene). */
  enterFrames: number;
  /** Local frame at which cue `id` fires. Throws on an unknown id so typos fail fast. */
  cue: (id: string) => number;
  /** This scene's narration segments in local frames. */
  segments: { id: string; from: number; to: number }[];
}
