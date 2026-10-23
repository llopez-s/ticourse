import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { focusWeights, mix } from '../../../engine/src/ui';
import { HypothesisStone } from './parts/Proofs';
import { EndCard, NextAction, RuleRow, ScaleAndWeight } from './parts/Recap';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const AMBER = '#fcd34d';

/** The three rows: their tops and heights (rule 2 holds the four phrases, so it is the tall one). */
const ROWS = [
  { top: 0, h: 150 },
  { top: 166, h: 272 },
  { top: 454, h: 150 },
] as const;
const BOARD_H = ROWS[2].top + ROWS[2].h;
/** On `next` the board steps back to this scale, to make room for the call to action under it. */
const BACK = 0.8;
const NEXT_TOP = Math.round(BOARD_H * BACK + 24);

/** Rule 2's four bubbles: the phrase that gives each shortcut away, and its name (the lesson's exam note). */
const PHRASES = [
  { phrase: 'confirma lo que ya pensábamos', name: 'confirmation' },
  { phrase: 'el primer informe decía…', name: 'anchoring' },
  { phrase: 'está en todas las noticias', name: 'availability' },
  { phrase: 'ningún actor racional haría…', name: 'mirror imaging' },
] as const;

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame (the chapter's wipe reveals them);
 * on `recap` each shows its picture, dim; each rule card then lights as the voice starts it:
 *   rule-1  the scale and, outside it, a weight — «El instrumento eres tú:» and, on «método», «se compensa con
 *           método, no con ganas»
 *   rule-2  «Aprende la frase que delata cada atajo» and the four bubbles with the phrase that gives each
 *           one away (they appear on «delata»); on «nombre» each phrase gets its name — confirmation,
 *           anchoring, availability, mirror imaging — one after the other
 *   rule-3  a hypothesis and a stone — «Intenta tumbar tu primera respuesta» / «antes de defenderla»
 * `next`   the board steps back and «Tu turno: las preguntas de la lección» (s4m1, 6 preguntas) comes in under
 *          it; `endcard`: the ALERTÓPOLIS end card takes the stage and holds to the last frame. No lab.
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
  // The three pictures come into their waiting slots with «tres reglas», always before rule 1 lights.
  const waitAt = Math.min(recapAt + 2, ruleAt[0] - 24);
  const rowDim = (i: number) => Math.max(dims[i], 0.55 * allDim);

  // Rule 1
  const rest1 = p(at('s06-01', 'método') - 6, 12);
  // Rule 2: the bubbles come on «delata», their names on «nombre»
  const bubbleAt = at('s06-02', 'delata') - 2;
  const nameAt = at('s06-02', 'nombre') - 4;
  // Rule 3
  const rest3 = p(at('s06-03', 'defenderla') - 14, 12);
  const throwAt = at('s06-03', 'tumbarla') - 4;
  const thrown = progress(frame, throwAt, 20, EASE.linear);
  const dt = frame - (throwAt + 20);
  const wobble = dt > 0 ? 16 * Math.sin(dt * 0.55) * Math.exp(-dt / 12) : 0;

  const lineStyle = (size: number, weight: number, color: string, lit: number, rest = 0.4) => ({
    fontSize: size,
    fontWeight: weight,
    color,
    letterSpacing: -0.8,
    lineHeight: 1.12,
    whiteSpace: 'nowrap' as const,
    opacity: rest + (1 - rest) * lit,
  });

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: BOARD_H, transform: `scale(${mix(1, BACK, back)})`, transformOrigin: '50% 0%' }}>
            {/* Rule 1: the instrument is you */}
            <RuleRow index={0} top={ROWS[0].top} height={ROWS[0].h} frame={frame} fps={fps} slotAt={-14} waitAt={waitAt} at={ruleAt[0]} dim={rowDim(0)} glow={glow[0]}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 34, height: '100%' }}>
                <ScaleAndWeight lit={weights[0]} />
                <div>
                  <div style={lineStyle(56, 850, C.textStrong, 1, 0.45)}>El instrumento eres tú:</div>
                  <div style={{ marginTop: 4, ...lineStyle(44, 750, C.text, rest1) }}>
                    se compensa con <span style={{ color: '#6ee7b7' }}>método</span>, no con ganas
                  </div>
                </div>
              </div>
            </RuleRow>

            {/* Rule 2: the phrase that gives each shortcut away */}
            <RuleRow index={1} top={ROWS[1].top} height={ROWS[1].h} frame={frame} fps={fps} slotAt={-14} waitAt={waitAt} at={ruleAt[1]} dim={rowDim(1)} glow={glow[1]}>
              <div style={{ paddingTop: 18 }}>
                <div style={lineStyle(52, 850, C.textStrong, 1, 0.45)}>Aprende la frase que delata cada atajo</div>
                <div style={{ marginTop: 18, display: 'flex', gap: 18 }}>
                  {PHRASES.map((ph, i) => {
                    const a = p(bubbleAt + i * 7, 14);
                    const n = p(nameAt + i * 22, 12);
                    return (
                      <div
                        key={ph.name}
                        style={{
                          width: 372,
                          height: 150,
                          boxSizing: 'border-box',
                          padding: '14px 20px',
                          borderRadius: 28,
                          border: `3px solid ${alpha(C.cyan, 0.3 + 0.5 * a)}`,
                          background: alpha(C.cyan, 0.05 + 0.07 * a),
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          opacity: 0.35 + 0.65 * a,
                          transform: `translateY(${(1 - a) * 12}px)`,
                        }}
                      >
                        <div style={{ fontSize: 33, fontWeight: 750, lineHeight: 1.15, color: C.textStrong }}>«{ph.phrase}»</div>
                        <div style={{ alignSelf: 'flex-start', opacity: n, transform: `translateY(${(1 - n) * 8}px)` }}>
                          <span style={{ display: 'inline-block', padding: '2px 16px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.amber, 0.7)}`, background: alpha(C.amber, 0.14), fontSize: 32, fontWeight: 850, letterSpacing: 0.5, color: AMBER, whiteSpace: 'nowrap' }}>
                            {ph.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </RuleRow>

            {/* Rule 3: knock your first answer down before defending it */}
            <RuleRow index={2} top={ROWS[2].top} height={ROWS[2].h} frame={frame} fps={fps} slotAt={-14} waitAt={waitAt} at={ruleAt[2]} dim={rowDim(2)} glow={glow[2]}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 34, height: '100%' }}>
                <div style={{ width: 210, height: 130 }}>
                  <HypothesisStone thrown={thrown} wobble={wobble} />
                </div>
                <div>
                  <div style={lineStyle(52, 850, C.textStrong, 1, 0.45)}>Intenta tumbar tu primera respuesta</div>
                  <div style={{ marginTop: 4, ...lineStyle(44, 750, C.text, rest3) }}>
                    antes de <span style={{ color: '#6ee7b7' }}>defenderla</span>
                  </div>
                </div>
              </div>
            </RuleRow>
          </div>
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
