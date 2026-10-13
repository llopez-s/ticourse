import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { dimStyle, mix } from '../../../engine/src/ui';
import { S01 } from '../data/s01-hook';
import { CHAIN_W, Chain } from './parts/s01-hook/Chain';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
/** The chain: alone in the middle of the stage at first (a little bigger), then a row at the top. */
const CHAIN = { topA: 236, scaleA: 1.16, topB: 96 } as const;
/** The question: big in the middle of the stage, then a line under the chain once the title lands. */
const ASK = { topA: 318, topB: 236, scaleB: 0.6 } as const;
const TITLE_TOP = 322;
const CHIPS_TOP = 506;
const VIOLET = '#c4b5fd';

/**
 * s01-hook «Qué hacemos con esto».
 *   start     the context strip «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia»
 *             (its last third still dim) and the chain's five steps settling in, dim, mid-stage.
 *   chain     the steps come in one by one; Command & Control is the one still alive: an amber ring
 *             that beats slowly and its mark «llama a casa cada minuto».
 *   ask       the chain steps up to a small row; «equipo de respuesta: ¿qué hacemos con esto?», big,
 *             takes the middle of the stage.
 *   title     (before 12 s) the question steps up under the chain and «Courses of Action» lands with
 *             «la matriz de decisiones»; «tú, su analista de inteligencia» lights on «analista».
 *   promise   three chips, each on its words: «los verbos que se confunden», «una matriz con huecos»,
 *             «cuánto cuesta cada acción». Holds.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chainAt = props.cue('chain');
  const askAt = props.cue('ask');
  // The title is on screen before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = props.cue('promise');
  const w2 = (word: string) => wordFrame(S, 's01-02', word);

  const stripIn = progress(frame, 0, 16);
  const youLit = progress(frame, Math.max(titleAt, w2('analista') - 6), 14);
  // The chain is there from the first frames (the scene never opens on an empty stage).
  const steps = S01.chain.map((_, i) => progress(frame, Math.min(2, chainAt - 14) + i * 4, 12));
  const mark = progress(frame, wordFrame(S, 's01-01', 'paso') - 6, 14);
  const beat = pulse(frame, fps, 0.5);

  const rise = progress(frame, askAt - 18, 24, EASE.inOut);
  const askIn = enter(frame, askAt - 4, { distance: 18, duration: 16 });
  const up = progress(frame, titleAt - 10, 24, EASE.inOut);
  const titleIn = enter(frame, titleAt, { distance: 24, duration: 18 });
  const subIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });
  const chipAt = S01.promise.map((c) => Math.max(promiseAt - 4, w2(c.word) - 6));

  return (
    <Stage>
      {/* Who and where */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: W, display: 'flex', justifyContent: 'center', opacity: stripIn }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 16, height: 58, boxSizing: 'border-box', padding: '8px 30px 0', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.4)}`, background: alpha(C.cyan, 0.06), fontFamily: FONT.sans, fontSize: 34, whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 850, color: C.textStrong }}>{S01.context[0]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 700, color: C.text }}>{S01.context[1]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 800, color: mix(0, 1, youLit) > 0.5 ? C.cyanSoft : C.text, opacity: 0.6 + 0.4 * youLit }}>{S01.context[2]}</span>
        </div>
      </div>

      {/* The chain, already known */}
      <div style={{ position: 'absolute', left: Math.round((W - CHAIN_W) / 2), top: mix(CHAIN.topA, CHAIN.topB, rise), transform: `scale(${mix(CHAIN.scaleA, 1, rise)})`, transformOrigin: '50% 0', ...dimStyle(0.25 * up) }}>
        <Chain show={steps} mark={mark} beat={beat} />
      </div>

      {/* The response team's question */}
      {frame >= askAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: mix(ASK.topA, ASK.topB, up), width: W, display: 'flex', justifyContent: 'center', ...askIn }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, fontFamily: FONT.sans, whiteSpace: 'nowrap', transform: `scale(${mix(1, ASK.scaleB, up)})`, transformOrigin: '50% 0', opacity: 1 - 0.35 * up }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: C.muted }}>{S01.team}</span>
            <span style={{ fontSize: 68, fontWeight: 900, letterSpacing: -1.2, color: C.textStrong }}>{S01.ask}</span>
          </div>
        </div>
      ) : null}

      {/* The answer: a menu */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans }}>
          <div style={{ fontSize: 104, lineHeight: 1, fontWeight: 900, letterSpacing: -2, color: VIOLET, textShadow: `0 0 40px ${alpha(C.violet, 0.4)}`, whiteSpace: 'nowrap', ...titleIn }}>{S01.title}</div>
          <div style={{ marginTop: 12, fontSize: 46, lineHeight: 1.1, fontWeight: 750, color: C.textStrong, ...subIn }}>{S01.sub}</div>
        </div>
      ) : null}

      {/* The promise */}
      <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 22, fontFamily: FONT.sans }}>
        {S01.promise.map((c, i) => {
          const e = enter(frame, chipAt[i], { distance: 16 });
          const on = progress(frame, chipAt[i], 10) * (1 - 0.5 * progress(frame, (chipAt[i + 1] ?? Number.MAX_SAFE_INTEGER) - 2, 12, EASE.inOut));
          return (
            <div key={c.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, height: 66, boxSizing: 'border-box', padding: '0 30px 0 22px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`, background: alpha(C.cyan, 0.06 + 0.12 * on), boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined, fontSize: 34, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', ...e }}>
              <span style={{ width: 34, height: 34, borderRadius: 17, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.2), border: `2px solid ${alpha(C.cyan, 0.7)}`, fontSize: 22, fontWeight: 900, color: C.cyanSoft }}>{i + 1}</span>
              {c.text}
            </div>
          );
        })}
      </div>
    </Stage>
  );
}
