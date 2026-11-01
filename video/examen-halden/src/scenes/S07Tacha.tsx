import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { QUESTIONS, STEPS, type MiniQuestion } from '../data/s07-tacha';
import { QUALIFIERS } from '../data/qualifiers';
import { OptionCard, type OptionItem } from './parts/OptionStack';
import { Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's07-tacha';
const W = STAGE.width;
const GAP = 24;
const CARD_W = (W - 3 * GAP) / 4;
const CARD_H = 88;
const ROW_Y = [0, 196] as const;
const HEAD_H = 58;
const CARDS_DY = 72;
const STEP_Y = [420, 536] as const;
const STEP_H = 96;

/**
 * s07-tacha «Tacha antes de elegir». The four options of questions 1 and 2 in miniature (not posed again), two rows:
 *   recap-1 / recap-2   the row lands (label + qualifier pill, dim); two options are struck with a white stroke on the words
 *                       of the voice, the reason lands in a chip, and the qualifier that decides lights up
 *   steps               the two steps appear: «1 · tacha lo que no responde o llega a destiempo» on the cue,
 *                       «2 · entre las que quedan, manda el calificador» on «Después»
 *   «tientan»           the two options left in each row turn amber: the decision is between the two that tempt
 */
export function S07Tacha(props: SceneProps) {
  const frame = useCurrentFrame();
  // Row 1 is already there from the first frame (the cue falls right after the overlap): no empty stage.
  const recapAt = [0, props.cue('recap-2') - 6] as const;
  const step1At = props.cue('steps') - 4;
  const step2At = wordFrame(S, 's07-04', 'Después') - 6;
  const tempt = progress(frame, wordFrame(S, 's07-05', 'tientan') - 10, 16);

  return (
    <Stage>
      {QUESTIONS.map((qn, r) => (
        <MiniRow key={qn.label} qn={qn} y={ROW_Y[r]} at={recapAt[r]} tempt={tempt} />
      ))}
      {STEPS.map((st, i) => (
        <Step key={st.n} n={st.n} text={st.text} y={STEP_Y[i]} at={i === 0 ? step1At : step2At} dim={i === 0 ? 0.35 * progress(frame, step2At, 14) : 0} />
      ))}
    </Stage>
  );
}

function MiniRow({ qn, y, at, tempt }: { qn: MiniQuestion; y: number; at: number; tempt: number }) {
  const frame = useCurrentFrame();
  const inP = progress(frame, at, 16);
  const strikeAt = [wordFrame(S, qn.segment, qn.words.first) - 4, wordFrame(S, qn.segment, qn.words.second) - 4];
  const reason = progress(frame, wordFrame(S, qn.segment, qn.words.reason) - 8, 14);
  const lit = progress(frame, wordFrame(S, qn.segment, qn.words.light) - 12, 16);
  const qual = QUALIFIERS[qn.q];

  const items: OptionItem[] = qn.options.map((label, i) => {
    const k = (qn.struck as readonly number[]).indexOf(i);
    if (k >= 0) return { label, strike: progress(frame, strikeAt[k], 18) };
    if (tempt > 0.01) return { label, state: 'tempt', on: tempt };
    if (lit > 0.01) return { label, state: 'lit', on: lit };
    return { label };
  });

  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: W, opacity: inP, transform: `translateY(${(1 - inP) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: HEAD_H, fontFamily: FONT.sans }}>
        <span style={{ fontSize: 34, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{qn.label}</span>
        <Pill text={`${qual.es} · ${qual.en}`} tone={C.violet} on={0.15 + 0.85 * lit} size={34} weight={850} />
        {reason > 0.01 ? (
          <Pill
            text={qn.reason}
            tone={C.text}
            on={reason}
            size={34}
            style={{ opacity: reason, transform: `translateX(${(1 - reason) * 16}px)`, background: alpha(C.ink700, 0.9) }}
          />
        ) : null}
      </div>
      <div style={{ position: 'absolute', left: 0, top: CARDS_DY, display: 'flex', gap: GAP }}>
        {items.map((it, i) => (
          <OptionCard key={i} item={it} w={CARD_W} h={CARD_H} fontSize={32} />
        ))}
      </div>
    </div>
  );
}

function Step({ n, text, y, at, dim }: { n: string; text: string; y: number; at: number; dim: number }) {
  const frame = useCurrentFrame();
  const p = progress(frame, at, 16);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: W,
        height: STEP_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '0 36px 0 24px',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.violet, 0.75)}`,
        background: alpha(C.violetDeep, 0.65),
        opacity: p * (1 - dim),
        transform: `translateY(${(1 - p) * 22}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          borderRadius: 999,
          background: C.violet,
          fontFamily: FONT.mono,
          fontSize: 40,
          fontWeight: 800,
          color: C.ink950,
          flexShrink: 0,
        }}
      >
        {n}
      </span>
      <span style={{ fontSize: 46, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  );
}
