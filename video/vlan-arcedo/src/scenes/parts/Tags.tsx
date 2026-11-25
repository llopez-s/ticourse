/**
 * Labels shared by every scene of «VLAN y 802.1Q».
 *   ImageTag     «imagen · no es el Consorcio» — on every analogy image (the floor, the mail room, the wall)
 *   QuestionTagFallback  «pregunta tipo test · ejemplo» — the ENGINE draws this label itself (the question's `tag` in
 *                the timeline, above its veil, under the panel). The fallback draws the same pill in the same place
 *                ONLY while the timeline's question carries no `tag`, so there is always exactly one label
 *   Rotulo       the plain label pill for anything the voice names (≥ 32 px)
 *   CaseStamp, PlaqueChip   the case stamp and the track plate of s01
 */
import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui';
import { CASE, PLAQUE } from '../../data/vlans';
import { TIMELINE } from '../../timeline/load';

export const IMAGE_TAG = 'imagen · no es el Consorcio';
export const QUESTION_TAG = 'pregunta tipo test · ejemplo';
/** Question 2 is about another network: s05 passes this to <QuestionTagFallback text>. */
export const QUESTION_TAG_OTHER = 'pregunta tipo test · ejemplo · otra red, no el Consorcio';

/** The small dashed pill that marks an analogy image as an image, not a fact of the Consorcio. */
export function ImageTag({ size = 26, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `${Math.round(size * 0.24)}px ${Math.round(size * 0.6)}px`,
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.muted, 0.7)}`,
        background: alpha(C.ink950, 0.82),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        color: C.text,
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
        ...style,
      }}
    >
      <Icon name="eye" size={Math.round(size * 0.95)} color={C.muted} />
      {IMAGE_TAG}
    </div>
  );
}

export const QUESTION_TAG_H = 40;
/**
 * Stage-local top of the question label: just under the stage's bottom edge (absolute y ≈ 858–898), where the
 * engine draws its own (ExamQuestionLayer: STAGE.top + STAGE.height + 8).
 */
const QUESTION_TAG_TOP = 668;

/**
 * The question label of scene `scene`, drawn by the scene ONLY when the engine will not draw it: the engine reads
 * `tag` from the question in timeline.json and draws the pill itself, above its veil. While a timeline was built
 * without that field (narration.json has it, the build dropped it), this keeps the label on screen; once the timeline
 * carries it, this renders nothing, so the label is never drawn twice. Place it directly inside <Stage>.
 */
export function QuestionTagFallback({ scene, text = QUESTION_TAG, stageW = 1728 }: { scene: string; text?: string; stageW?: number }) {
  if (TIMELINE.questions?.some((q) => q.scene === scene && q.tag)) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: QUESTION_TAG_TOP, width: stageW, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          height: QUESTION_TAG_H,
          padding: '0 26px 0 18px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.violet, 0.9)}`,
          background: C.ink900,
          fontFamily: FONT.sans,
          fontSize: 28,
          fontWeight: 800,
          color: '#ffffff',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="mortarboard" size={28} color={C.violet} />
        {text}
      </div>
    </div>
  );
}

/**
 * A label pill on a solid dark ground, so it reads over the art as well as over the backdrop. `on` (0–1) lifts the
 * border and adds a glow while the voice is on it.
 */
export function Rotulo({
  children,
  tone = C.cyan,
  size = 32,
  icon,
  on = 0,
  style,
}: {
  children: ReactNode;
  tone?: string;
  size?: number;
  icon?: IconName;
  on?: number;
  style?: CSSProperties;
}) {
  const o = Math.max(0, Math.min(1, on));
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.36),
        padding: `${Math.round(size * 0.2)}px ${Math.round(size * 0.56)}px`,
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, 0.6 + 0.35 * o)}`,
        background: alpha(C.ink950, 0.9),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(24 * o)}px ${alpha(tone, 0.35 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        lineHeight: 1.15,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.95)} color={tone} /> : null}
      {children}
    </div>
  );
}

/** The case stamp in two lines: «Consorcio Provincial de Arcedo» / «caso de ejemplo» (no date). */
export function CaseStamp() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '10px 24px 10px 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.ink950, 0.78),
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="flag" size={38} color={C.cyan} />
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>{CASE.who}</div>
        <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: C.cyanSoft }}>{CASE.kind}</div>
      </div>
    </div>
  );
}

/** The track plate «REDES Y ENS · Redes» (violet = the test), as the engine's cards name the track and its block. */
export function PlaqueChip() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 50,
        padding: '0 22px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.violet, 0.7)}`,
        background: alpha(C.ink950, 0.78),
        fontFamily: FONT.sans,
        fontSize: 30,
        fontWeight: 800,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="mortarboard" size={30} color={C.violet} />
      <span>{PLAQUE}</span>
    </div>
  );
}
