import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { focusWeights, mix } from '../../../engine/src/ui';
import { RULES } from '../data/s06-recap';
import { EndCard, GlassesAndRing, MiniRing, NextAction, RuleRow, TwoPhrases } from './parts/Recap';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const GREEN = ACCENT.emerald.soft;

/** The three rows: tops and heights. */
const ROWS = [
  { top: 0, h: 186 },
  { top: 200, h: 186 },
  { top: 400, h: 186 },
] as const;
const BOARD_H = ROWS[2].top + ROWS[2].h;
/** On `next` the board steps back to this scale, to make room for the call to action under it. */
const BACK = 0.8;
const NEXT_TOP = Math.round(BOARD_H * BACK + 24);

/** A rule's text: a bold lead and the rest, with the part the voice stresses highlighted (lit on its word). */
function RuleText({ lead, rest, hl, color, lit }: { lead: string; rest: string; hl: string; color: string; lit: number }): ReactNode {
  const i = rest.indexOf(hl);
  const before = rest.slice(0, i);
  const after = rest.slice(i + hl.length);
  return (
    <div style={{ fontFamily: FONT.sans }}>
      <div style={{ fontSize: 44, fontWeight: 850, letterSpacing: -0.6, lineHeight: 1.14, color: C.textStrong, whiteSpace: 'nowrap' }}>{lead}</div>
      <div style={{ marginTop: 4, fontSize: 38, fontWeight: 700, lineHeight: 1.2, color: C.text, maxWidth: 1250 }}>
        {before}
        <span style={{ color: lit > 0.5 ? color : C.text, fontWeight: 850 }}>{hl}</span>
        {after}
      </div>
    </div>
  );
}

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame; on `recap` each shows its picture, dim; each
 * rule card then lights as the voice starts it:
 *   rule-1  the tinted glasses beside the sheet with the red ring — sesgo: cómo miras; falacia: cómo argumentas
 *   rule-2  the two sentence cards of s03 — the source is evaluated, it does not replace the evidence
 *   rule-3  the ring of three sources — count only independent evidence
 * `next`   the board steps back and «Tu turno: las preguntas de la lección» (s4m2 · 6 preguntas) comes in under it;
 *          `endcard`: the ALERTÓPOLIS end card takes the stage and holds to the last frame. No lab.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')] as const;
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  const back = progress(frame, nextAt - 8, 22, EASE.inOut);
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);
  const { weights, dims } = focusWeights(frame, [...ruleAt], { end: nextAt });
  const allDim = p(nextAt - 4, 14);
  const glow = weights.map((w) => w * (0.75 + 0.25 * pulse(frame, fps, 0.5)));
  const waitAt = Math.min(recapAt + 2, ruleAt[0] - 24);
  const rowDim = (i: number) => Math.max(dims[i], 0.55 * allDim);

  // The stressed words light on their word.
  const lit = [p(at('s06-01', 'boli') - 6, 12), p(at('s06-02', 'examinar') - 6, 12), p(at('s06-03', 'independientes') - 6, 12)];

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: BOARD_H, transform: `scale(${mix(1, BACK, back)})`, transformOrigin: '50% 0%' }}>
            {([
              { art: <GlassesAndRing lit={weights[0]} />, hl: 'boli rojo', color: C.roseSoft },
              { art: <TwoPhrases lit={weights[1]} />, hl: 'examina sus pruebas', color: GREEN },
              { art: <MiniRing lit={weights[2]} />, hl: 'cuenta solo las pruebas independientes', color: GREEN },
            ] as const).map((r, i) => (
              <RuleRow key={i} index={i} top={ROWS[i].top} height={ROWS[i].h} frame={frame} fps={fps} slotAt={-14} waitAt={waitAt} at={ruleAt[i]} dim={rowDim(i)} glow={glow[i]}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30, height: '100%' }}>
                  <div style={{ flexShrink: 0 }}>{r.art}</div>
                  <RuleText lead={RULES[i].lead} rest={RULES[i].rest} hl={r.hl} color={r.color} lit={lit[i]} />
                </div>
              </RuleRow>
            ))}
          </div>
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
