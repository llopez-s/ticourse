import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { Board, type Cell } from './parts/Board';
import { ThoughtBubble, Trail } from './parts/Bubbles';
import { ExampleLabel } from './parts/ExampleLabel';
import { TrafficChart } from './parts/TrafficChart';
import { Stage, wordFrame } from './kit';

const S = 's04-noticias';
const W = STAGE.width;
const AMBER = '#fcd34d';

/** The wall of headlines: the lesson's q3 word, ransomware, in every one. Generic: no company, no case. */
const HEADLINES: readonly (readonly [string, string, string])[] = [
  ['', 'Ransomware', ', otra vez en portada'],
  ['Ola de ', 'ransomware', ' esta semana'],
  ['Más ', 'ransomware', ' que nunca'],
  ['', 'Ransomware', ': todo el mundo habla'],
  ['El ', 'ransomware', ' no da tregua'],
  ['', 'Ransomware', ' en todos los telediarios'],
  ['', 'Ransomware', ', la palabra de la semana'],
  ['Todos hablan del ', 'ransomware', ''],
];
const WALL = { cols: 4, cardW: 410, cardH: 104, gap: 16, top: 0 } as const;

/** Phase 1 layout: the wall, the quote under it, the chart on the left and the name on the right. */
const QUOTE = { top: 238, h: 62 } as const;
const CHART = { x: 0, y: 318, w: 1000, h: 262 } as const;
const NAME_X = 1060;

/** Phase 2: the thought, the player, the board. */
const BUBBLE = { x: 40, w: 760, top: 262 } as const;
const TILE = 50;
const BOARD = { x: 1010, y: 186 } as const;
const PLAYER = { l: { x: 912, y: 386 }, r: { x: 1532, y: 386 }, size: 128 } as const;
const MINE: readonly Cell[] = [[0, 1], [0, 3], [0, 5], [1, 2], [1, 4], [1, 6]];
const GHOSTS: readonly Cell[] = MINE.map((c) => [7 - c[0], c[1]] as Cell);
const REAL: readonly Cell[] = [[7, 0], [7, 4], [6, 1], [5, 3], [4, 6], [6, 7]];
const FLAGGED = 4;

/**
 * s04-noticias «Dos atajos más». The note «Frases de ejemplo de la lección · no son el caso de Meridian» is
 * there from the first frame.
 *   news      odd traffic on a chart with no axes (soft alarm); on «ransomware» a wall of headlines above it
 *   headline  the wall steps back and under it the sentence «hay ransomware en todas las noticias, así que
 *             esto será ransomware»
 *   avail     AVAILABILITY on the right with «lo reciente o memorable parece más probable»; on «pista» the
 *             signal phrase «está en todas las noticias»; on «hipótesis» three pins on the chart and the wall
 *             goes quiet — «ese tráfico merece sus hipótesis, no los titulares»
 *   mirror    the tone changes: a chessboard with a player on the left, looking at it from their own side;
 *             in a bubble the lesson's sentence «un actor sofisticado nunca reutilizaría infraestructura, así
 *             que estos incidentes no están relacionados». The opponent's side is only dashed rings: what the
 *             player imagines — your own pieces, reflected
 *   think     (top ~170 px kept clear) nothing moves and nothing is highlighted: the sentence is quiet
 *   verdict   the player walks round to the other side; the dashed rings give way to the real pieces, not
 *             a reflection, one on a wrong square; MIRROR IMAGING with «la frase da por hecho que el
 *             adversario razona como tú» and «los actores reales se equivocan, y mucho»
 */
export function S04Noticias(props: SceneProps) {
  const frame = useCurrentFrame();
  const newsAt = props.cue('news');
  const headlineAt = props.cue('headline');
  const availAt = props.cue('avail');
  const mirrorAt = props.cue('mirror');
  const verdictAt = props.cue('verdict');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const swell = (start: number, hold = 20) => progress(frame, start, 10) * (1 - progress(frame, start + hold, 26, EASE.inOut));

  // ---- Phase 1 → 2.
  const out1 = progress(frame, mirrorAt - 26, 18, EASE.inOut);
  const in2 = progress(frame, mirrorAt - 10, 22, EASE.out);

  // ---- The chart.
  const chartIn = enter(frame, -12, { distance: 18, duration: 20 });
  const draw = progress(frame, newsAt - 6, 90, EASE.linear);
  const alarm = p(newsAt + 70, 16);
  const alarmRing = swell(newsAt + 70, 40);

  // ---- The wall and the quote.
  const wallAt = at('s04-01', 'ransomware') - 8;
  const wallDim = Math.max(0.5 * p(headlineAt - 4, 18), 0.4 * p(at('s04-03', 'titulares') - 10, 18));
  const quoteIn = enter(frame, headlineAt - 2, { distance: 14, duration: 16 });
  const quoteDim = 0.55 * p(availAt + 10, 18);

  // ---- AVAILABILITY and its signal phrase.
  const nameIn = enter(frame, availAt - 6, { distance: 16, duration: 16 });
  const meansIn = enter(frame, at('s04-02', 'poco') - 6, { distance: 12, duration: 16 });
  const sigIn = enter(frame, at('s04-03', 'pista') - 4, { distance: 14, duration: 14 });
  const hypAt = at('s04-03', 'hipótesis') - 6;
  const pins = [0, 1, 2].map((i) => p(hypAt + i * 9, 12));

  // ---- Phase 2: the player and the board.
  const verdict = progress(frame, verdictAt - 4, 40, EASE.inOut);
  const px = mix(PLAYER.l.x, PLAYER.r.x, verdict);
  const py = PLAYER.l.y - 300 * Math.sin(Math.PI * verdict);
  const realIn = progress(frame, verdictAt + 14, 40, EASE.out);
  const ghostOut = 1 - progress(frame, verdictAt + 4, 22, EASE.inOut);
  const bubblePop = p(mirrorAt - 4, 22);
  const bubbleShrink = progress(frame, verdictAt - 2, 16, EASE.inOut);
  const gaze = p(mirrorAt + 10, 18) * (1 - verdict);
  const mirrorName = enter(frame, at('s04-06', 'mirror') - 6, { distance: 16, duration: 16 });
  const says1 = enter(frame, Math.max(at('s04-06', 'hecho') - 6, verdictAt + 18), { distance: 12, duration: 16 });
  const says2 = enter(frame, at('s04-06', 'actores') - 6, { distance: 12, duration: 16 });

  return (
    <Stage>
      <ExampleLabel width={W} />

      {/* ---- Phase 1: the wall, the chart, the name */}
      {out1 < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 600, opacity: 1 - out1, filter: out1 > 0.05 ? `saturate(${1 - 0.5 * out1})` : undefined }}>
          {/* the wall */}
          <div style={{ position: 'absolute', left: 0, top: WALL.top, width: W, opacity: 1 - wallDim, transition: 'none' }}>
            {HEADLINES.map((h, i) => {
              const col = i % WALL.cols;
              const row = Math.floor(i / WALL.cols);
              const e = enter(frame, wallAt + i * 5, { distance: 16, duration: 14 });
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: col * (WALL.cardW + WALL.gap),
                    top: row * (WALL.cardH + WALL.gap),
                    width: WALL.cardW,
                    height: WALL.cardH,
                    boxSizing: 'border-box',
                    padding: '10px 20px',
                    borderRadius: 14,
                    background: `linear-gradient(180deg, #e8eef6 0%, #c9d4e2 100%)`,
                    border: `2px solid ${alpha('#94a3b8', 0.8)}`,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: FONT.sans,
                    fontSize: 31,
                    fontWeight: 800,
                    lineHeight: 1.12,
                    color: '#1e293b',
                    boxShadow: `0 10px 24px ${alpha('#000000', 0.4)}`,
                    transform: `${e.transform} rotate(${[-1.2, 0.8, -0.6, 1][i % 4]}deg)`,
                    opacity: e.opacity,
                  }}
                >
                  <span>
                    {h[0]}
                    <span style={{ color: '#b45309', background: alpha('#fbbf24', 0.35), padding: '0 3px', borderRadius: 6 }}>{h[1]}</span>
                    {h[2]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* the sentence */}
          {quoteIn.opacity > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: QUOTE.top, width: W, display: 'flex', justifyContent: 'center', opacity: quoteIn.opacity * (1 - quoteDim), transform: quoteIn.transform }}>
              <div style={{ height: QUOTE.h, display: 'inline-flex', alignItems: 'center', padding: '0 34px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.amber, 0.6)}`, background: alpha(C.amber, 0.1), fontFamily: FONT.sans, fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <span>
                  «hay <span style={{ color: AMBER }}>ransomware</span> en todas las noticias, así que esto será <span style={{ color: AMBER }}>ransomware</span>»
                </span>
              </div>
            </div>
          ) : null}

          {/* the chart */}
          <div style={{ position: 'absolute', left: CHART.x, top: CHART.y, ...chartIn }}>
            <TrafficChart width={CHART.w} height={CHART.h} draw={draw} alarm={alarm} />
          </div>
          {alarmRing > 0.02 ? (
            <div style={{ position: 'absolute', left: CHART.x + 14 + 0.52 * (CHART.w - 28) - 14, top: CHART.y + 8, width: 0.2 * (CHART.w - 28) + 28, height: CHART.h - 16, borderRadius: 16, boxShadow: `0 0 ${Math.round(44 * alarmRing)}px ${alpha(C.amber, 0.45 * alarmRing)}`, pointerEvents: 'none' }} />
          ) : null}
          {pins.map((v, i) =>
            v > 0.01 ? (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: CHART.x + 30 + i * 112,
                  top: CHART.y + 76,
                  width: 92,
                  height: 62,
                  borderRadius: RADIUS.pill,
                  border: `3px solid ${alpha(C.cyan, 0.7)}`,
                  background: alpha(C.cyan, 0.12),
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: FONT.mono,
                  fontSize: 34,
                  fontWeight: 800,
                  color: C.cyanSoft,
                  opacity: v,
                  transform: `translateY(${(1 - v) * 12}px)`,
                }}
              >
                H{i + 1}
              </div>
            ) : null,
          )}

          {/* the name and what it means */}
          <div style={{ position: 'absolute', left: NAME_X, top: 322, width: W - NAME_X, fontFamily: FONT.sans }}>
            <div style={{ whiteSpace: 'nowrap', ...nameIn }}>
              <span style={{ fontSize: 66, fontWeight: 900, letterSpacing: 1.5, color: AMBER, textShadow: `0 0 30px ${alpha(C.amber, 0.25)}` }}>AVAILABILITY</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 40, fontWeight: 750, lineHeight: 1.18, color: C.textStrong, ...meansIn }}>lo reciente o memorable parece más probable</div>
            <div style={{ marginTop: 16, ...sigIn }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', height: 66, padding: '0 28px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.12), fontSize: 41, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
                «está en todas las noticias»
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---- Phase 2: a player, a board and the sentence */}
      {in2 > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 600, opacity: in2 }}>
          {/* the sentence, in the player's head */}
          <div
            style={{
              position: 'absolute',
              left: BUBBLE.x,
              top: mix(BUBBLE.top, 230, bubbleShrink),
              transform: `scale(${1 - 0.18 * bubbleShrink})`,
              transformOrigin: '0% 0%',
              opacity: 1 - bubbleShrink,
            }}
          >
            <ThoughtBubble width={BUBBLE.w} pop={bubblePop} tone="cyan" origin="100% 50%">
              <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.22, letterSpacing: -0.4, color: C.textStrong }}>
                «un actor sofisticado nunca reutilizaría infraestructura, así que estos incidentes no están relacionados»
              </div>
            </ThoughtBubble>
            <div style={{ position: 'absolute', left: BUBBLE.w, top: 100, opacity: (1 - verdict) * bubblePop }}>
              <Trail dir="right" />
            </div>
          </div>

          {/* the board */}
          <div style={{ position: 'absolute', left: BOARD.x, top: BOARD.y }}>
            <Board tile={TILE} mine={MINE} ghosts={GHOSTS} others={REAL} flagged={FLAGGED} ghostAmount={ghostOut * p(mirrorAt + 14, 20)} realAmount={realIn} />
          </div>
          {/* the player, and the way they look at the board */}
          <div style={{ position: 'absolute', left: px - PLAYER.size / 2, top: py - PLAYER.size / 2, width: PLAYER.size, height: PLAYER.size, borderRadius: '50%', display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `4px solid ${alpha(C.cyan, 0.75)}`, boxShadow: `0 0 36px ${alpha(C.cyan, 0.25)}` }}>
            <Icon name="user" size={76} color={C.cyan} strokeWidth={2} />
          </div>
          {gaze > 0.01 ? (
            <svg width={200} height={30} viewBox="0 0 200 30" style={{ position: 'absolute', left: PLAYER.l.x + PLAYER.size / 2 + 8, top: PLAYER.l.y - 15, opacity: gaze }}>
              <path d="M 4 15 H 100" stroke={alpha(C.cyanSoft, 0.7)} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
            </svg>
          ) : null}
          <div style={{ position: 'absolute', left: PLAYER.l.x - 94, top: PLAYER.l.y + 80, width: 188, textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted, opacity: 1 - verdict }}>tu lado</div>

          <div style={{ position: 'absolute', left: PLAYER.r.x - 94, top: PLAYER.r.y + 80, width: 188, textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted, opacity: verdict > 0.9 ? (verdict - 0.9) * 10 : 0 }}>su lado</div>

          {/* the verdict: where the bubble was */}
          <div style={{ position: 'absolute', left: 40, top: 236, width: 900, fontFamily: FONT.sans }}>
            <div style={{ whiteSpace: 'nowrap', ...mirrorName }}>
              <span style={{ fontSize: 66, fontWeight: 900, letterSpacing: 1.5, color: AMBER, textShadow: `0 0 30px ${alpha(C.amber, 0.25)}` }}>MIRROR IMAGING</span>
            </div>
            <div style={{ marginTop: 14, fontSize: 44, fontWeight: 750, lineHeight: 1.2, color: C.textStrong, ...says1 }}>la frase da por hecho que el adversario razona como tú</div>
            <div style={{ marginTop: 20, fontSize: 44, fontWeight: 800, lineHeight: 1.2, color: C.roseSoft, ...says2 }}>los actores reales se equivocan, y mucho</div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
