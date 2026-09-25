import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { TIMELINE, TRANSITION_FRAMES } from '../timeline/load';
import type { SceneTiming } from '../timeline/types';
import { EASE, progress } from '../theme/motion';
import { C, FONT, LAYOUT, TYPE } from '../theme/tokens';
import { CHROME_ROW_Y } from './SimulationTag';

const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const;

/** Chapter number as an ASCII Roman numeral (I–V). */
export function roman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

/** "II · CÓMO FUNCIONA" */
export function chapterLabel(scene: Pick<SceneTiming, 'chapter' | 'chapterTitle'>): string {
  return `${roman(scene.chapter)} · ${scene.chapterTitle.toLocaleUpperCase('es-ES')}`;
}

/**
 * IntelForge brand mark: the app favicon (a rounded square rotated 45°, cyan).
 * `size` is the bounding box of the diamond.
 */
export function BrandMark({ size = 22, color = C.cyan, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="14.6 14.6 70.8 70.8"
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-hidden
    >
      <rect x="25" y="25" width="50" height="50" rx="8" transform="rotate(45 50 50)" fill={color} />
    </svg>
  );
}

const LEFT = LAYOUT.marginX;
const LABEL_SIZE = TYPE.micro;
const TITLE_SIZE = 44;
const TITLE_TOP = 80;
const MARK = 20;
const TEXT_LEFT = LEFT + MARK + 14;
/** Titles stop short of the exam card zone (x ≥ 1000). */
const MAX_TITLE_WIDTH = 1000 - 24 - TEXT_LEFT;

/** 0→1 over the scene transition: the outgoing text leaves in the first 60 %, the incoming arrives in the last 60 %. */
function swap(t: number): { out: number; in: number } {
  return {
    out: 1 - Math.min(1, t / 0.6),
    in: Math.max(0, (t - 0.4) / 0.6),
  };
}

function ChapterLine({ text, opacity, dy }: { text: string; opacity: number; dy: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: TEXT_LEFT,
        top: CHROME_ROW_Y - LABEL_SIZE / 2 - 1,
        height: LABEL_SIZE + 2,
        display: 'flex',
        alignItems: 'center',
        fontSize: LABEL_SIZE,
        fontWeight: 700,
        letterSpacing: 3,
        lineHeight: 1,
        color: C.cyan,
        whiteSpace: 'nowrap',
        opacity,
        transform: `translateY(${dy}px)`,
      }}
    >
      {text}
    </div>
  );
}

function TitleLine({ text, opacity, dy }: { text: string; opacity: number; dy: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: TEXT_LEFT,
        top: TITLE_TOP,
        maxWidth: MAX_TITLE_WIDTH,
        fontSize: TITLE_SIZE,
        fontWeight: 800,
        letterSpacing: -0.5,
        lineHeight: 1.15,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        opacity,
        transform: `translateY(${dy}px)`,
      }}
    >
      {text}
    </div>
  );
}

/**
 * Pure view. The incoming scene's title cross-fades in over the same window in
 * which TransitionFrame dissolves (or wipes) the scenes: [from − T, from].
 * The chapter line only animates when the chapter actually changes.
 */
export function ChapterRailView({
  scenes,
  frame,
  transitionFrames = TRANSITION_FRAMES,
}: {
  scenes: SceneTiming[];
  frame: number;
  transitionFrames?: number;
}) {
  if (scenes.length === 0) return null;

  let index = 0;
  for (let k = 1; k < scenes.length; k++) {
    if (frame >= scenes[k].from - transitionFrames) index = k;
  }
  const current = scenes[index];
  const previous = index > 0 ? scenes[index - 1] : null;
  const t = previous ? progress(frame, current.from - transitionFrames, transitionFrames, EASE.inOut) : 1;
  const { out, in: inn } = swap(t);
  const moving = previous !== null && t < 1;
  const chapterChanges = moving && previous.chapter !== current.chapter;
  const DY = 10;

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans, pointerEvents: 'none' }}>
      <BrandMark size={MARK} style={{ position: 'absolute', left: LEFT, top: CHROME_ROW_Y - MARK / 2 }} />

      {chapterChanges ? (
        <>
          <ChapterLine text={chapterLabel(previous)} opacity={out} dy={-DY * (1 - out)} />
          <ChapterLine text={chapterLabel(current)} opacity={inn} dy={DY * (1 - inn)} />
        </>
      ) : (
        <ChapterLine text={chapterLabel(current)} opacity={1} dy={0} />
      )}

      {moving ? (
        <>
          <TitleLine text={previous.title} opacity={out} dy={-DY * (1 - out)} />
          <TitleLine text={current.title} opacity={inn} dy={DY * (1 - inn)} />
        </>
      ) : (
        <TitleLine text={current.title} opacity={1} dy={0} />
      )}
    </div>
  );
}

/** Timeline-driven rail mounted by SIEMVideo (absolute frame). */
export function ChapterRail() {
  const frame = useCurrentFrame();
  return <ChapterRailView scenes={TIMELINE.scenes} frame={frame} />;
}
