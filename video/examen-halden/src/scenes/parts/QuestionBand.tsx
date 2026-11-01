import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../engine/src/theme/motion';
import { QUALIFIERS, type Qualifier, type QualifierId } from '../../data/qualifiers';
import { ExamScreenArt, SCREEN_ART } from './ExamScreenArt';
import { QuestionTag } from './Labels';

/*
 * THE TEMPLATE FOR A QUESTION SCENE (s05, s06, s08, s09, s11).
 *
 * The engine's ExamQuestionLayer paints the whole question (badge, scenario, question, options, countdown, answer and
 * trap) from the scene's first segment to its last frame, as a panel that nearly fills the stage (about 618 px of the
 * 660) under an 86 % dim. A scene therefore cannot draw anything the viewer reads INSIDE the stage. What it owns is:
 *   1. a still, textless background (QuestionStill: a blank exam screen), complete from frame 0 so the 12 overlap
 *      frames look intentional;
 *   2. one thin BAND under the stage (stage-local y 660–720, absolute 850–910, free because -yt videos burn no
 *      captions): on the left the qualifier line (QualifierLine) or the letter strip (LetterStrip), on the right the
 *      fixed tag «pregunta tipo examen · ejemplo».
 * Skeleton of a question scene:
 *   <Stage><QuestionStill><QuestionBand> ...left content, absolutely positioned inside the band... </QuestionBand></QuestionStill></Stage>
 * Everything in the band shows through the dim, so use full white text on solid-ish fills, nothing small.
 */

/** Stage-local geometry of the band under the panel. */
export const BAND = { top: 660, height: 60 } as const;

/** The background of a question scene: a dim blank exam screen. Children (the band) are drawn above it. */
export function QuestionStill({ children }: { children?: ReactNode }) {
  const w = 1000;
  const k = w / SCREEN_ART.w;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: Math.round((STAGE.width - w) / 2),
          top: Math.round((STAGE.height - SCREEN_ART.h * k) / 2),
          width: w,
          height: SCREEN_ART.h * k,
          opacity: 0.55,
          transform: 'none',
        }}
      >
        <div style={{ transform: `scale(${k})`, transformOrigin: '0 0' }}>
          <ExamScreenArt />
        </div>
      </div>
      {children}
    </>
  );
}

/** The band: children sit in its left part (absolute, stage-local x), the question tag is fixed on the right. */
export function QuestionBand({ children }: { children?: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: BAND.top, width: STAGE.width, height: BAND.height }}>
      {children}
      <div style={{ position: 'absolute', right: 0, top: (BAND.height - 52) / 2 }}>
        <QuestionTag />
      </div>
    </div>
  );
}

/**
 * The qualifier highlighted («MEJOR · BEST») with its gloss after it. `at` = frame the pill lands (the `best`-type cue),
 * `glossAt` = frame the gloss text writes in (a word of the voice); pass null for a pill with no gloss (s11).
 * `glossOut` (0–1) fades only the gloss, `out` the whole line. `trail` is anything that should sit after the pill in the
 * place of the gloss once it fades (the letter strip after the reveal); the scene fades `trail` in itself.
 */
export function QualifierLine({
  q,
  at,
  glossAt,
  glossOut = 0,
  out = 0,
  trail,
  size = 38,
}: {
  q: Qualifier | QualifierId;
  at: number;
  glossAt: number | null;
  glossOut?: number;
  out?: number;
  trail?: ReactNode;
  size?: number;
}) {
  const frame = useCurrentFrame();
  const qual = typeof q === 'string' ? QUALIFIERS[q] : q;
  const tone = qual.tone === 'rose' ? C.rose : C.violet;
  const pillIn = enter(frame, at, { distance: 14, duration: 14 });
  const glossP = glossAt === null ? 0 : progress(frame, glossAt, 14);
  if (frame < at - 2) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: BAND.height,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        fontFamily: FONT.sans,
        fontSize: size,
        whiteSpace: 'nowrap',
        opacity: 1 - out,
      }}
    >
      <div
        style={{
          ...pillIn,
          display: 'inline-flex',
          alignItems: 'center',
          height: BAND.height,
          padding: '0 24px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `3px solid ${tone}`,
          background: alpha(tone, 0.55),
          boxShadow: `0 0 28px ${alpha(tone, 0.5)}`,
          fontWeight: 850,
          letterSpacing: 0.5,
          color: '#ffffff',
        }}
      >
        {qual.es} · {qual.en}
      </div>
      <div style={{ display: 'grid', alignItems: 'center', height: BAND.height }}>
        {glossAt !== null ? (
          <span style={{ gridArea: '1 / 1', fontWeight: 700, color: '#ffffff', opacity: glossP * (1 - glossOut), transform: `translateX(${(1 - glossP) * -10}px)` }}>{qual.gloss}</span>
        ) : null}
        {trail ? <div style={{ gridArea: '1 / 1' }}>{trail}</div> : null}
      </div>
    </div>
  );
}
