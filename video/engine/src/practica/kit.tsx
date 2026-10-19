import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { enterFramesFor, sceneTiming } from '../timeline/load';
import type { SceneProps } from '../timeline/types';
import { C, FONT, LAYOUT, RADIUS, STAGE, TYPE, alpha } from '../theme/tokens';
import type { Timeline } from '../timeline/types';

export const SEAL_TEXT = 'Práctica complementaria · datos ficticios';

/** Where the permanent seal sits: right-aligned under the engine's simulation pill, inside the top band. */
function Seal() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 92,
        right: LAYOUT.width - LAYOUT.stage.right,
        height: 40,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 18px 0 14px',
        borderRadius: RADIUS.pill,
        background: alpha(C.amberDeep, 0.55),
        border: `2px solid ${alpha(C.amber, 0.55)}`,
        fontFamily: FONT.sans,
        fontSize: TYPE.micro,
        fontWeight: 700,
        lineHeight: 1,
        color: '#fcd34d',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 4, background: C.amber, flexShrink: 0 }} />
      {SEAL_TEXT}
    </div>
  );
}

/**
 * The drawable stage (1728×660 at y 190) with the complementary border and seal that every scene of this
 * practice video keeps visible. Children use stage-local coordinates.
 */
export function Stage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <AbsoluteFill>
      <Seal />
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height, ...style }}>
        {children}
      </div>
    </AbsoluteFill>
  );
}

/** Local [from, to) of a narration segment in the scene's Sequence. */
export function segment(props: SceneProps, id: string): { from: number; to: number } {
  const seg = props.segments.find((s) => s.id === id);
  if (!seg) throw new Error(`segment ${id} is not in this scene (have ${props.segments.map((s) => s.id).join(', ')})`);
  return seg;
}

const norm = (s: string) =>
  s
    .toLocaleLowerCase('es-ES')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '');

/** Narration-timing helpers bound to one video's timeline (each video passes its own TIMELINE). */
export function createSceneTools(timeline: Timeline) {
  const origin = (sceneId: string) => sceneTiming(timeline, sceneId).from - enterFramesFor(timeline, sceneId);
  const timed = (segmentId: string) => {
    const seg = timeline.segments.find((s) => s.id === segmentId);
    if (!seg) throw new Error(`segment ${segmentId} is missing from timeline.json`);
    return seg;
  };
  return {
    /**
     * Local frame at which the narration starts saying `word` inside segment `segmentId` (the `nth` match,
     * 0-based). Throws when the word is missing, so a script edit that drops it fails loudly instead of drifting.
     */
    wordFrame(sceneId: string, segmentId: string, word: string, nth = 0): number {
      const seg = timed(segmentId);
      const hit = seg.words.filter((w) => norm(w.text) === norm(word))[nth];
      if (!hit) throw new Error(`"${word}" (#${nth}) is not spoken in ${segmentId}: ${seg.text}`);
      return hit.from - origin(sceneId);
    },
    /** Local frame at which the audio of a segment ends (before the pause that follows it). */
    audioEnd(sceneId: string, segmentId: string): number {
      const seg = timed(segmentId);
      return seg.from + seg.audioFrames - origin(sceneId);
    },
  };
}
