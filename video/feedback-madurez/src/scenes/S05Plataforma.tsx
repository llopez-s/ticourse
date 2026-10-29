import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S05_ANSWER, S05_HYPOTHETICAL, S05_ORDER, S05_TOKEN, S05_TRAP } from '../data/s05-plataforma';
import { STAGES_LABEL } from '../data/stages';
import { Fleet, TIP_W, TipBox } from './parts/Platform';
import { STAGE_BAR_REST, STAGE_W, STAGE_X, StageBar } from './parts/StageBar';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-plataforma';
const W = STAGE.width;
const BAR_TOP = 20;
const BAR_ASK = 270;
/** After the think prompt has gone the bar goes back up and the verdict and the steps use the stage. */
const BAR_FINAL = 70;
const LOT_TOP = 232;
const TOKEN = { w: 500, h: 132 };

/**
 * s05-plataforma «Una compra tentadora».
 *   start     the bar of s04 where it was left; it rises as the voice speaks.
 *   tempt     an arrow between stages 1 and 2: «la trampa del paso 1 a 2».
 *   fleet     a fleet parked in the depot over a map with no lines drawn (error sfx).
 *   tip       a big platform box full of indicator tiles, no arrow out of it.
 *   question  the bar goes down and quiet; a neutral token «plataforma cara · sin requirements escritos» (hypothetical team).
 *   answer    the token lands on stage 1: «sin requirements escritos no hay estadio 2».
 *   order     three steps, one by one: consumidores y requirements, productos y proceso, herramienta.
 * The top band (y 0–230) is free while the think prompt is up (the end of s05-04): the bar is down below it by then.
 */
export function S05Plataforma(props: SceneProps) {
  const frame = useCurrentFrame();
  const temptAt = props.cue('tempt');
  const fleetAt = props.cue('fleet');
  const tipAt = props.cue('tip');
  const questionAt = props.cue('question');
  const answerAt = props.cue('answer');
  const orderAt = props.cue('order');
  const s5 = segment(props, 's05-05');

  // ---- The bar: where s04 left it, up for the trap, down for the question.
  const riseAt = temptAt + 40;
  const rise = progress(frame, riseAt, 30, EASE.inOut);
  const drop = progress(frame, questionAt, 26, EASE.inOut);
  const settleBar = progress(frame, answerAt, 26, EASE.inOut);
  const barTop = mix(mix(mix(STAGE_BAR_REST, BAR_TOP, rise), BAR_ASK, drop), BAR_FINAL, settleBar);
  const trap = progress(frame, temptAt, 18) * (1 - progress(frame, questionAt - 6, 14));
  const lit1 = progress(frame, temptAt, 14) * (1 - progress(frame, questionAt - 6, 12));
  const landed = progress(frame, answerAt + 24, 14);
  const lit: [number, number, number] = [Math.max(lit1 * 0.9, landed * (1 - progress(frame, orderAt - 4, 12))), lit1 * 0.9, 0.35 * lit1];
  const barDim = 0.5 * drop * (1 - landed);

  // ---- The things on the lot, until the question.
  const lotFade = 1 - progress(frame, questionAt - 4, 18);

  // ---- The token and its verdict.
  const tokenIn = progress(frame, questionAt + 14, 16);
  const settle = progress(frame, answerAt + 6, 26, EASE.inOut);
  const tokenX = mix((W - TOKEN.w) / 2, 0, settle);
  const tokenY = mix(432, BAR_FINAL + 86, settle);
  const verdict = enter(frame, answerAt + 30, { distance: 20, axis: 'x', duration: 18 });
  const orderOut = 1 - progress(frame, orderAt - 2, 14);
  const hypoOpacity = progress(frame, questionAt, 12) * (1 - progress(frame, s5.to - 6, 12));

  // ---- The healthy order.
  const stepAt = S05_ORDER.map((s, i) => (i === 0 ? Math.max(orderAt + 6, wordFrame(S, 's05-06', s.word) - 8) : wordFrame(S, 's05-06', s.word) - 8));
  const slots = progress(frame, orderAt, 14);

  return (
    <Stage>
      {/* The bar and the trap arrow */}
      <div style={{ position: 'absolute', left: 0, top: barTop }}>
        <StageBar show={[1, 1, 1]} lit={lit} dim={barDim} label={rise < 0.2 && drop < 0.2 ? STAGES_LABEL : undefined} labelOpacity={1 - rise * 5} />
      </div>
      {trap > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: barTop + 78, width: W, opacity: trap }}>
          <svg width={W} height={130} viewBox={`0 0 ${W} 130`} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
            <path
              d={`M ${STAGE_X[0] + STAGE_W[0] / 2} 10 C ${STAGE_X[0] + STAGE_W[0] / 2} 90, ${STAGE_X[1] + STAGE_W[1] / 2} 90, ${STAGE_X[1] + STAGE_W[1] / 2} 14`}
              fill="none"
              stroke={C.amber}
              strokeWidth={8}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - progress(frame, temptAt + 4, 28)}
            />
            <path
              d={`M ${STAGE_X[1] + STAGE_W[1] / 2 - 16} 34 L ${STAGE_X[1] + STAGE_W[1] / 2} 10 L ${STAGE_X[1] + STAGE_W[1] / 2 + 16} 34`}
              fill="none"
              stroke={C.amber}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={progress(frame, temptAt + 28, 8)}
            />
          </svg>
          <div style={{ position: 'absolute', left: 0, top: 78, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: '#fde68a', whiteSpace: 'nowrap' }}>{S05_TRAP}</div>
        </div>
      ) : null}

      {/* The depot and the platform */}
      {lotFade > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: lotFade }}>
          {frame >= fleetAt - 8 ? (
            <div style={{ position: 'absolute', left: 0, top: LOT_TOP }}>
              <Fleet frame={frame} at={fleetAt} />
            </div>
          ) : null}
          {frame >= tipAt - 8 ? (
            <div style={{ position: 'absolute', left: W - TIP_W, top: LOT_TOP }}>
              <TipBox frame={frame} at={tipAt} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The question: a token for a hypothetical team */}
      {frame >= questionAt + 8 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: tokenX,
              top: tokenY,
              width: TOKEN.w,
              height: TOKEN.h,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 26px',
              borderRadius: 24,
              border: `3px solid ${alpha(settle > 0.5 ? C.amber : C.sky, 0.85)}`,
              background: `linear-gradient(180deg, ${alpha(settle > 0.5 ? C.amber : C.sky, 0.16)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
              boxShadow: `0 22px 50px ${alpha('#000000', 0.4)}`,
              fontFamily: FONT.sans,
              opacity: tokenIn * orderOut,
              transform: `translateY(${(1 - tokenIn) * 26}px)`,
            }}
          >
            <Icon name="server" size={52} color={settle > 0.5 ? C.amber : C.sky} />
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.22, color: C.textStrong, whiteSpace: 'nowrap' }}>
              {S05_TOKEN.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>
          {frame >= answerAt + 28 ? (
            <div style={{ position: 'absolute', left: 560, top: BAR_FINAL + 100, ...verdict, opacity: verdict.opacity * orderOut }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '0 34px 0 22px', height: 90, boxSizing: 'border-box', borderRadius: 28, border: `3px solid ${alpha(C.amber, 0.85)}`, background: alpha(C.amberDeep, 0.5), fontFamily: FONT.sans, fontSize: 42, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <Icon name="lock" size={44} color={C.amber} />
                {S05_ANSWER}
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {/* Hypothetical team: from the first frame of the question to the end of the answer */}
      {hypoOpacity > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 594, width: W, display: 'flex', justifyContent: 'center', opacity: hypoOpacity }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, height: 58, padding: '0 28px 0 20px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.violet, 0.8)}`, background: alpha(C.violetDeep, 0.55), fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: '#ddd6fe', whiteSpace: 'nowrap' }}>
            <Icon name="brain" size={34} color={C.violet} />
            {S05_HYPOTHETICAL}
          </span>
        </div>
      ) : null}

      {/* The healthy order */}
      {frame >= orderAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: 330, width: W, height: 190 }}>
          {S05_ORDER.map((s, i) => {
            const w = (W - 48) / 3;
            const left = i * (w + 24);
            const p = progress(frame, stepAt[i], 16);
            const hot = progress(frame, stepAt[i], 10) * (1 - 0.5 * progress(frame, (stepAt[i + 1] ?? stepAt[i] + 400) - 2, 14));
            return (
              <div key={s.n}>
                {p < 1 ? (
                  <div style={{ position: 'absolute', left, top: 0, width: w, height: 170, boxSizing: 'border-box', borderRadius: 24, border: `2px dashed ${C.ink600}`, display: 'grid', placeItems: 'center', opacity: slots * (1 - p) }}>
                    <span style={{ fontSize: 96, fontWeight: 850, color: C.ink700 }}>{s.n}</span>
                  </div>
                ) : null}
                {p > 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left,
                      top: 0,
                      width: w,
                      height: 170,
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 22,
                      padding: '0 26px',
                      borderRadius: 24,
                      border: `${hot > 0.4 ? 3 : 2}px solid ${alpha(C.emerald, 0.35 + 0.55 * hot)}`,
                      background: `linear-gradient(180deg, ${alpha(C.emerald, 0.06 + 0.1 * hot)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
                      boxShadow: hot > 0.05 ? `0 0 ${Math.round(34 * hot)}px ${alpha(C.emerald, 0.26 * hot)}` : undefined,
                      fontFamily: FONT.sans,
                      opacity: p,
                      transform: `translateY(${(1 - p) * 24}px)`,
                    }}
                  >
                    <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 36, display: 'grid', placeItems: 'center', background: hot > 0.3 ? C.emerald : alpha(C.emerald, 0.18), border: `2px solid ${alpha(C.emerald, 0.7)}`, fontSize: 42, fontWeight: 850, color: hot > 0.3 ? C.ink950 : '#6ee7b7' }}>{s.n}</div>
                    <div style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.14, letterSpacing: -0.5, color: C.textStrong }}>{s.text}</div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}

