import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { S02_FORGOTTEN, S02_PLANNING, S02_WRAP } from '../data/s02-ciclo';
import { EmberCard } from './parts/EmberCard';
import { Scribbles, Ticket } from './parts/Ticket';
import { StationLine, stationX, type StationState } from './parts/StationLine';
import { Stage, interceptWindow, segment, wordFrame } from './kit';

const S = 's02-ciclo';
const W = STAGE.width;

const TICKET = { x: 0, y: 215, w: 250, h: 290 } as const;
const LINE = { x: 320, y: 240, w: W - 320, tile: 128 } as const;

/**
 * s02-ciclo «El ciclo, como un restaurante». While EMBER FOX's message is up (`reply-i`) its card sits low,
 * «EMBER FOX · célula de acceso inicial · spearphishing», and glows as the voice names it; it leaves when the
 * message does. On `order` the restaurant opens: a comanda on the left (scribbled lines, nothing readable) and the
 * first station, the order rail. In s02-03 the line fills as the voice walks it — compra (market), prepara
 * (chopping board), guisa (stove), sirve (tray), qué tal estuvo (guest book) — each lit for a moment. On `six`
 * the official names land from left to right; on «primera» and «última» those two stations turn amber under one
 * bracket, «las que más se olvidan». On `planning` the first station grows and the others step back, with «con
 * quien decide · qué necesita saber = requirements» (requirements underlined as the voice says it). On `wrap-i`
 * the comanda goes blank, a question mark on it, and «el ciclo convierte preguntas en respuestas» closes the
 * chapter. This restaurant is the one image the whole video keeps. No data of the case.
 */
export function S02Ciclo(props: SceneProps) {
  const frame = useCurrentFrame();
  const win = interceptWindow(S);
  const replyAt = props.cue('reply-i');
  const orderAt = props.cue('order');
  const sixAt = props.cue('six');
  const planningAt = props.cue('planning');
  const wrapAt = props.cue('wrap-i');
  const s0201 = segment(props, 's02-01');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const pulse = (start: number, hold = 22) => progress(frame, start, 8) * (1 - progress(frame, start + hold, 16, EASE.inOut));

  // ---- EMBER FOX: under the message, until the voice has finished answering it.
  const emberFrom = (win?.from ?? 0) + 22;
  const emberIn = p(emberFrom, 18) * (1 - progress(frame, s0201.to - 12, 14, EASE.inOut));
  // The card lights when the voice announces the message (`reply-i`) and again on its name.
  const emberGlow = Math.max(pulse(replyAt, 26), pulse(at('s02-01', 'EMBER') - 4, 40));

  // ---- The restaurant.
  const ticketIn = p(orderAt - 4, 18);
  const scribble = p(orderAt + 6, 40);
  const blank = p(wrapAt - 2, 16);
  const walk = [orderAt, at('s02-03', 'compra') - 4, at('s02-03', 'prepara') - 4, at('s02-03', 'guisa') - 4, at('s02-03', 'sirve') - 4, at('s02-03', 'estuvo') - 4];
  const nameAt = [0, 1, 2, 3, 4, 5].map((i) => sixAt + 6 + i * 14);
  const firstAmber = at('s02-04', 'primera') - 6;
  const lastAmber = at('s02-04', 'ultima') - 6;
  // The bracket draws as the last station turns amber, leaves for the first station's explanation and comes back with the chapter's line.
  const bk = Math.max(p(lastAmber, 22) * (1 - progress(frame, planningAt - 10, 14, EASE.inOut)), p(wrapAt + 24, 22));
  const grow = p(planningAt - 6, 18) * (1 - progress(frame, wrapAt - 6, 18, EASE.inOut));

  const states: StationState[] = [0, 1, 2, 3, 4, 5].map((i) => {
    const forgotten = i === 0 || i === 5;
    const named = p(nameAt[i], 14);
    const flash = pulse(walk[i]);
    const settled = progress(frame, sixAt + 4, 20) * named;
    const amber = forgotten ? p(i === 0 ? firstAmber : lastAmber, 12) : 0;
    return {
      show: p(walk[i] - 6, 14),
      name: named,
      lit: Math.max(flash * (1 - settled), settled * 0.85),
      tone: amber > 0.5 ? 'amber' : 'cyan',
      scale: i === 0 ? 1 + 0.26 * grow : 1,
      dim: i === 0 ? 0 : 0.6 * grow,
    };
  });

  const planIn = enter(frame, planningAt + 4, { distance: 16, duration: 18 });
  const planOut = 1 - progress(frame, wrapAt - 8, 12, EASE.inOut);
  const reqAt = at('s02-06', 'requirements') - 4;
  const underline = p(reqAt, 14);
  const wrapIn = enter(frame, wrapAt + 4, { distance: 16, duration: 18 });

  const c0 = LINE.x + stationX(LINE.w, 0);
  const c5 = LINE.x + stationX(LINE.w, 5);

  return (
    <Stage>
      {/* EMBER FOX's card, low, under the engine's message */}
      {emberIn > 0.01 ? (
        <div style={{ position: 'absolute', left: (W - 900) / 2, top: 262, opacity: emberIn, transform: `translateY(${(1 - emberIn) * 22}px)` }}>
          <EmberCard width={900} glow={emberGlow} highlight={emberGlow} />
        </div>
      ) : null}

      {/* The comanda, and the arrow that hangs it on the rail */}
      <div style={{ position: 'absolute', left: TICKET.x, top: TICKET.y }}>
        <Ticket width={TICKET.w} height={TICKET.h} show={ticketIn} question={blank}>
          <div style={{ opacity: 1 - blank, width: '100%' }}>
            <Scribbles show={scribble} />
          </div>
        </Ticket>
      </div>
      {ticketIn > 0.05 ? (
        <div style={{ position: 'absolute', left: TICKET.w + 8, top: LINE.y + LINE.tile / 2 - 22, opacity: ticketIn * (1 - 0.6 * grow) }}>
          <Icon name="arrowRight" size={44} color={C.cyan} strokeWidth={2.6} />
        </div>
      ) : null}

      {/* The six stations */}
      <StationLine width={LINE.w} tile={LINE.tile} labelSize={30} states={states} style={{ position: 'absolute', left: LINE.x, top: LINE.y }} />

      {/* «las que más se olvidan»: one bracket under the first and the last */}
      {bk > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height }}>
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
            <path d={`M ${c0} ${LINE.y + 226} V ${LINE.y + 256} H ${c5} V ${LINE.y + 226}`} pathLength={1} stroke={C.amber} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="1" strokeDashoffset={1 - bk} />
          </svg>
          <div style={{ position: 'absolute', left: 0, width: W, top: LINE.y + 268, textAlign: 'center', fontFamily: FONT.sans, fontSize: 42, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap', opacity: bk }}>{S02_FORGOTTEN}</div>
        </div>
      ) : null}

      {/* The first station explained */}
      {frame >= planningAt - 2 && planOut > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: LINE.x,
            top: LINE.y + 258,
            width: W - LINE.x,
            display: 'flex',
            justifyContent: 'center',
            opacity: planOut * planIn.opacity,
            transform: planIn.transform,
          }}
        >
          <div style={{ padding: '18px 40px 22px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 70%)`, boxShadow: `0 0 34px ${alpha(C.cyan, 0.18)}`, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 40, fontWeight: 850, color: C.cyan, letterSpacing: -0.5 }}>{S02_PLANNING.title}</div>
            <div style={{ marginTop: 8, fontSize: 40, fontWeight: 750, color: C.textStrong, lineHeight: 1.2 }}>
              <div>{S02_PLANNING.lines[0]}</div>
              <div>
                qué necesita saber ={' '}
                <span style={{ position: 'relative', color: C.cyanSoft }}>
                  requirements
                  <span style={{ position: 'absolute', left: 0, bottom: -5, height: 4, width: `${underline * 100}%`, borderRadius: 2, background: C.cyan }} />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* The chapter's line */}
      {frame >= wrapAt - 2 ? (
        <div style={{ position: 'absolute', left: LINE.x, top: LINE.y + 330, width: W - LINE.x, display: 'flex', justifyContent: 'center', ...wrapIn }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 52, fontWeight: 850, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap' }}>
            {S02_WRAP[0]}
            <span style={{ color: C.amber }}>{S02_WRAP[1]}</span>
            {S02_WRAP[2]}
            <span style={{ color: C.emerald }}>{S02_WRAP[3]}</span>
          </span>
        </div>
      ) : null}
    </Stage>
  );
}
