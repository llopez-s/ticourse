import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { ANSWERS, OPTION_LABELS, RULE, RULE_CARDS } from '../data/s04-califs';
import { QUALIFIERS, QUALIFIER_ORDER } from '../data/qualifiers';
import { OptionCard, type OptionItem } from './parts/OptionStack';
import { QualifierChip } from './parts/QualifierChip';
import { Stage, wordFrame } from './kit';

const S = 's04-califs';
const W = STAGE.width;
const CW = 402;
const GAP = (W - 4 * CW) / 3;
const CHIP_Y = 14;
const CHIP_H = 132;
const CARD_Y = 280;
const CARD_H = 168;
const RULE_Y = 530;

const cx = (i: number) => i * (CW + GAP) + CW / 2;

/**
 * s04-califs «Qué te piden». The four qualifiers as cards (`chips`: English big, Spanish under), and beneath them the SAME
 * four blank cards «opción 1…4» (`same-options`, no security content). On `four-answers` each qualifier, on its word,
 * lights a different card through a drawn connector: the same list, another answer. On `rule` two cards tempt (amber,
 * on «tentar») and one fits (emerald, on «encaja») under the fixed phrase «dos tientan · una encaja con el objetivo oficial».
 */
export function S04Califs(props: SceneProps) {
  const frame = useCurrentFrame();
  const chipsAt = props.cue('chips') - 4;
  const cardsAt = props.cue('same-options') - 4;
  const ruleAt = props.cue('rule') - 4;
  const temptAt = wordFrame(S, 's04-04', 'tentar') - 14;
  const fitsAt = wordFrame(S, 's04-04', 'encaja') - 6;
  const starts = ANSWERS.map((a) => wordFrame(S, 's04-03', a.word) - 8);

  // 0–1 weight of each qualifier's turn: in at its word, out when the next one starts (the last, when the rule comes).
  const turn = ANSWERS.map((_, k) => progress(frame, starts[k], 12) * (1 - progress(frame, (starts[k + 1] ?? ruleAt) - 2, 12, EASE.inOut)));
  const anyTurn = Math.max(...turn);
  const tempt = progress(frame, temptAt, 14);
  const fits = progress(frame, fitsAt, 14);

  const cards: OptionItem[] = OPTION_LABELS.map((label, j) => {
    const k = ANSWERS.findIndex((a) => a.card === j);
    if (tempt > 0.01 && (RULE_CARDS.tempt as readonly number[]).includes(j)) {
      return j === RULE_CARDS.fits && fits > 0.5 ? { label, state: 'ok', on: fits } : { label, state: 'tempt', on: tempt };
    }
    return { label, state: k >= 0 && turn[k] > 0.01 ? 'lit' : 'idle', on: k >= 0 ? turn[k] : 0, tone: k >= 0 && ANSWERS[k].id === 'least' ? C.rose : C.violet };
  });
  const chipDim = 1 - 0.5 * progress(frame, ruleAt, 14);

  return (
    <Stage>
      {/* Connectors: chip -> the card it lights */}
      <svg width={W} height={CARD_Y} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {ANSWERS.map((a, k) => {
          if (turn[k] < 0.01) return null;
          const from = cx(QUALIFIER_ORDER.indexOf(a.id));
          const to = cx(a.card);
          const mid = CHIP_Y + CHIP_H + (CARD_Y - CHIP_Y - CHIP_H) / 2 + (k - 1.5) * 8;
          const d = `M ${from} ${CHIP_Y + CHIP_H} V ${mid} H ${to} V ${CARD_Y - 4}`;
          const len = 700;
          const draw = progress(frame, starts[k] + 4, 18, EASE.inOut);
          return (
            <path
              key={a.id}
              d={d}
              fill="none"
              stroke={a.id === 'least' ? C.rose : C.violet}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - draw)}
              opacity={turn[k]}
            />
          );
        })}
      </svg>

      {QUALIFIER_ORDER.map((id, i) => {
        const inP = progress(frame, chipsAt + i * 8, 16);
        const k = ANSWERS.findIndex((a) => a.id === id);
        const on = k >= 0 ? turn[k] : 0;
        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: i * (CW + GAP),
              top: CHIP_Y,
              opacity: inP * chipDim * (anyTurn > 0.01 ? 0.62 + 0.38 * on : 1),
              transform: `translateY(${(1 - inP) * 20}px)`,
            }}
          >
            <QualifierChip q={QUALIFIERS[id]} w={CW} h={CHIP_H} on={on} />
          </div>
        );
      })}

      {cards.map((item, j) => {
        const inP = progress(frame, cardsAt + j * 6, 16);
        const faded = (RULE_CARDS.tempt as readonly number[]).includes(j) && j !== RULE_CARDS.fits ? 1 - 0.5 * fits : 1;
        return (
          <div key={j} style={{ position: 'absolute', left: j * (CW + GAP), top: CARD_Y, opacity: inP * faded, transform: `translateY(${(1 - inP) * 20}px)` }}>
            <OptionCard item={item} w={CW} h={CARD_H} fontSize={42} />
          </div>
        );
      })}

      {/* The fixed phrase */}
      <div style={{ position: 'absolute', left: 0, top: RULE_Y, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, fontFamily: FONT.sans, fontSize: 56, fontWeight: 850, whiteSpace: 'nowrap' }}>
        <span style={{ color: C.amber, opacity: tempt, transform: `translateY(${(1 - tempt) * 14}px)`, textShadow: `0 0 24px ${alpha(C.amber, 0.35)}` }}>{RULE.tempt}</span>
        <span style={{ color: C.faint, opacity: tempt }}>·</span>
        <span style={{ color: C.emerald, opacity: fits, transform: `translateY(${(1 - fits) * 14}px)`, textShadow: `0 0 24px ${alpha(C.emerald, 0.3)}` }}>{RULE.fits}</span>
      </div>
    </Stage>
  );
}
