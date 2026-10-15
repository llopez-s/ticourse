import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { ASK, BIA, CAPACITY, PROCESSES, SLOTS } from '../data/s02-negocio';
import { TIMELINE } from '../timeline/load';
import { CARD, CardSlot, ProcessCard } from './parts/s02-negocio/ProcessCard';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-negocio';
const W = STAGE.width;
// ---- Two cards side by side, low enough to sit under the intercepted message's slot (stage y 10–205).
const CARD_GAP = 48;
const CARDS_X = Math.round((W - (2 * CARD.w + CARD_GAP)) / 2);
const CARDS_TOP = 244;
// ---- The header: who is asked (top), and the name of the method.
const ASK_TOP = 22;
const BIA_TOP = 112;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/** One of the two «who do you ask» chips: lit (the business) or struck through (the servers). */
function AskChip({ icon, text, lit, struck, show }: { icon: 'users' | 'server'; text: string; lit: number; struck: number; show: number }) {
  const color = struck > 0.5 ? C.faint : C.cyan;
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        height: 68,
        padding: '0 32px 0 24px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px ${struck > 0.5 ? 'dashed' : 'solid'} ${struck > 0.5 ? alpha(C.muted, 0.6) : alpha(C.cyan, 0.4 + 0.5 * lit)}`,
        background: struck > 0.5 ? alpha(C.ink800, 0.6) : alpha(C.cyan, 0.06 + 0.12 * lit),
        boxShadow: lit > 0.02 && struck < 0.5 ? `0 0 ${Math.round(24 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 42,
        fontWeight: 750,
        color: struck > 0.5 ? C.muted : C.textStrong,
        whiteSpace: 'nowrap',
        opacity: show * (struck > 0.5 ? 0.7 : 1),
      }}
    >
      <Icon name={icon} size={40} color={color} />
      {text}
      {struck > 0.01 ? <div style={{ position: 'absolute', left: 20, top: '50%', height: 4, width: `calc(${Math.round(100 * struck)}% - 40px)`, background: C.rose, borderRadius: 2, transform: 'rotate(-3deg)' }} /> : null}
    </div>
  );
}

/**
 * s02-negocio «Empiezas preguntando al negocio». Two dashed card slots wait from the first frame, under two chips: «el
 * negocio» (lit on its word) and «los servidores» (struck on «no»); on «business» the name «BIA · business impact
 * analysis» lands under them. On `proc-bills` and `proc-board` the two process cards take their slots; on «parado» and
 * «datos» each card's slots are asked (cyan «?»), and on «duele» the bar «cuánto duele cada hora parado» grows on both,
 * without a figure. The header leaves before the intercepted message (the engine's card owns stage y 10–205): the cards
 * are already low, «cero minutos» is written into each first slot with the message, and on «capacidad» a rose chip
 * «más capacidad» appears. On `order` the zeros are struck, the chips become «aguanta menos» (Operaciones) and
 * «aguanta más» (Facturación) and the BIA's name comes back: it orders the processes by what each one holds.
 */
export function S02Negocio(props: SceneProps) {
  const frame = useCurrentFrame();
  const ic = interceptWindow();
  const s04 = segment(props, 's02-04');
  const orderAt = props.cue('order');
  const hourAt = props.cue('hour');
  const settle = progress(frame, -8, 22);
  const w1 = (word: string) => wordFrame(S, 's02-01', word);

  // ---- Header: who is asked, and the method's name.
  const negocioLit = progress(frame, w1('negocio') - 8, 12);
  const noAt = w1('no') - 2;
  const struck = progress(frame, noAt, 10);
  const biaAt = Math.min(w1('business') - 8, props.cue('bia') + 150);
  const biaIn = springIn(frame, 30, biaAt, { damping: 16 });
  const away = progress(frame, ic.from - 16, 12, EASE.inOut);
  const back = progress(frame, orderAt + 2, 18);
  const askShow = settle * (1 - away);
  const biaShow = Math.max(Math.min(1, biaIn * 1.3) * (1 - away), back);

  // ---- Cards.
  const cardAt = PROCESSES.map((p) => props.cue(p.cue) - 6);
  const cardIn = cardAt.map((a) => springIn(frame, 30, a, { damping: 16 }));
  const slotAt = SLOTS.map((s) => wordFrame(S, 's02-03', s.word) - 8);
  const painAt = wordFrame(S, 's02-03', 'duele') - 6;
  const capAt = wordFrame(S, 's02-04', 'capacidad') - 6;
  // The message is typed during the silent lead; the zeros are written as it finishes.
  const zeroAt = Math.min(ic.from + 36, s04.from - 6);
  const zeroOutAt = orderAt - 4;

  return (
    <Stage>
      {/* Who is asked */}
      <div style={{ position: 'absolute', left: 0, top: ASK_TOP, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34, opacity: askShow }}>
        <AskChip icon="users" text={ASK.yes} lit={negocioLit} struck={0} show={0.7 + 0.3 * negocioLit} />
        <AskChip icon="server" text={ASK.no} lit={0} struck={struck} show={0.7} />
      </div>

      {/* The method's name: BIA in violet (an exam term), then what it stands for */}
      {biaShow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: BIA_TOP,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: 26,
            fontFamily: FONT.sans,
            opacity: biaShow,
            transform: `translateY(${(1 - Math.min(1, biaShow)) * 16}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 96, fontWeight: 900, letterSpacing: -2, color: '#c4b5fd', textShadow: `0 0 30px ${alpha(C.violet, 0.3)}` }}>{BIA.short}</span>
          <span style={{ fontSize: 48, fontWeight: 750, color: C.textStrong }}>{BIA.long}</span>
        </div>
      ) : null}

      {/* The cards: dashed slots first, then the process cards on their cues */}
      {PROCESSES.map((p, i) => {
        const x = CARDS_X + i * (CARD.w + CARD_GAP);
        const lit = cardIn[i] * (1 - 0.7 * progress(frame, i === 0 ? cardAt[1] : hourAt, 14));
        const pain = progress(frame, painAt + i * 10, 40, EASE.inOut) * p.pain;
        const cap = progress(frame, capAt + i * 8, 12);
        const holds = progress(frame, orderAt + 2 + i * 12, 14);
        const zero = progress(frame, zeroAt + i * 8, 14);
        return (
          <div key={p.id} style={{ position: 'absolute', left: x, top: CARDS_TOP }}>
            {cardIn[i] < 0.999 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, opacity: settle * (1 - Math.min(1, cardIn[i] * 1.3)) }}>
                <CardSlot />
              </div>
            ) : null}
            {cardIn[i] > 0.01 ? (
              <div style={{ opacity: Math.min(1, cardIn[i] * 1.4), transform: `translateY(${(1 - Math.min(1, cardIn[i])) * 24}px) scale(${0.97 + 0.03 * Math.min(1, cardIn[i])})` }}>
                <ProcessCard
                  view={{
                    dept: p.dept,
                    name: p.name,
                    icon: p.icon,
                    lit: mix(0, 1, lit),
                    ask: [progress(frame, slotAt[0] + i * 6, 10), progress(frame, slotAt[1] + i * 6, 10)],
                    zero,
                    zeroOut: progress(frame, zeroOutAt, 14),
                    painOn: progress(frame, painAt - 6, 10),
                    pain,
                    capacity: cap,
                    capacityText: CAPACITY,
                    holds,
                    holdsText: p.holds,
                  }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </Stage>
  );
}
