import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { CISO_ASK } from '../data/canon';
import { S06_CRITERIA, S06_DECISION, S06_EXPIRE, S06_PEOPLE, S06_PIR, S06_TICKETS } from '../data/s06-pir';
import { Ciso } from './parts/Ciso';
import { Person, PirCard } from './parts/PirCard';
import { Ticket } from './parts/Ticket';
import { Stage, wordFrame } from './kit';

const S = 's06-pir';
const W = STAGE.width;

/**
 * s06-pir «Una pregunta bien pedida». On `back` the CISO's strip returns with the same sentence. On `comanda` two
 * order slips: a grey one, «tráeme algo de comer», and the one that works, «mesa cuatro · pescado sin gluten ·
 * antes de las diez», lit. On `criteria` the card «Priority Intelligence Requirement» (P, I, R lit as the voice
 * spells it) takes the five criteria one by one — una sola pregunta, específico (sector, actor, tecnología,
 * geografía), ligado a una decisión, factible, acotado en el tiempo — the voice names the first two here; `decision`
 * lights the third with «¿qué decisión cambia con la respuesta?»; `feasible` the fourth and fifth, with a small
 * clock and «las prioridades caducan». On `consumer` the card gives way to two figures: «tú · redactas y propones»
 * sends a sheet across to «quien decide · valida la prioridad», who gets the tick. No PIR of Meridian's.
 */
export function S06Pir(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('back');
  const comandaAt = props.cue('comanda');
  const criteriaAt = props.cue('criteria');
  const decisionAt = props.cue('decision');
  const feasibleAt = props.cue('feasible');
  const consumerAt = props.cue('consumer');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  // ---- The CISO.
  const cisoIn = p(backAt - 6, 18);
  const cisoDim = Math.max(0.45 * p(comandaAt, 20), 0.2 * p(consumerAt, 20));

  // ---- The two slips.
  const vagueAt = at('s06-02', 'tráeme') - 8;
  const preciseAt = at('s06-02', 'mesa') - 8;
  const vague = p(vagueAt, 16);
  const precise = p(preciseAt, 16);
  const preciseGlow = precise * (1 - 0.4 * p(criteriaAt, 20));
  const slipsDim = p(criteriaAt, 20);
  const slipsOut = 1 - progress(frame, consumerAt - 10, 14, EASE.inOut);

  // ---- The card.
  const wordAt = (w: string) => at('s06-03', w) - 6;
  const letters = [p(wordAt('Priority'), 10), p(wordAt('Intelligence'), 10), p(wordAt('Requirement'), 10)];
  const rowAt = S06_CRITERIA.map((c, i) => (i === 2 ? decisionAt : i === 3 ? feasibleAt : at(c.seg, c.word as string) - 8));
  const rows = rowAt.map((a) => p(a, 16));
  const { lit } = litRows(frame, rowAt, consumerAt - 12);
  const cardOut = 1 - progress(frame, consumerAt - 10, 14, EASE.inOut);

  // ---- The two callouts under the slips.
  const decisionIn = enter(frame, at('s06-04', 'decisión') - 6, { distance: 14, duration: 16 });
  const decisionOut = 1 - progress(frame, feasibleAt - 8, 12, EASE.inOut);
  const expireIn = enter(frame, at('s06-05', 'prioridades') - 8, { distance: 14, duration: 16 });
  const tick = progress(frame, at('s06-05', 'prioridades'), 36, EASE.linear);

  // ---- The two people.
  const people = p(consumerAt - 4, 18);
  const sendAt = at('s06-06', 'propones') - 10;
  const send = progress(frame, sendAt, 40, EASE.inOut);
  const checkAt = at('s06-06', 'valida') - 6;
  const check = p(checkAt, 14);

  const slipText = (lines: readonly string[], size: number, color: string) => (
    <div style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 800, lineHeight: 1.18, color, letterSpacing: -0.3 }}>
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  );

  return (
    <Stage>
      {/* The CISO's strip */}
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: cisoIn, transform: `translateY(${(1 - cisoIn) * -16}px)` }}>
        <Ciso width={1500} layout="strip" size={40} text={CISO_ASK} dim={cisoDim} />
      </div>

      {/* The two order slips */}
      <div style={{ position: 'absolute', inset: 0, opacity: slipsOut }}>
        <div style={{ position: 'absolute', left: 0, top: 168, opacity: 1 - 0.4 * slipsDim }}>
          <Ticket width={360} height={270} grey show={vague} dim={0.2 * slipsDim}>
            {slipText([S06_TICKETS.vague], 38, C.muted)}
          </Ticket>
        </div>
        <div style={{ position: 'absolute', left: 400, top: 148 }}>
          <Ticket width={400} height={300} show={precise} glow={preciseGlow} dim={0.35 * slipsDim}>
            {slipText(S06_TICKETS.precise, 38, C.textStrong)}
          </Ticket>
        </div>

        {/* «¿qué decisión cambia con la respuesta?» then the clock */}
        {frame >= at('s06-04', 'decisión') - 8 && decisionOut > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 492, width: 800, display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT.sans, fontSize: 42, fontWeight: 850, lineHeight: 1.15, color: C.cyanSoft, opacity: decisionIn.opacity * decisionOut, transform: decisionIn.transform }}>
            <Icon name="flag" size={52} color={C.cyan} strokeWidth={2.2} />
            {S06_DECISION}
          </div>
        ) : null}
        {frame >= at('s06-05', 'prioridades') - 10 ? (
          <div style={{ position: 'absolute', left: 0, top: 492, width: 800, display: 'flex', alignItems: 'center', gap: 20, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: C.amber, opacity: expireIn.opacity, transform: expireIn.transform }}>
            <Clock tick={tick} />
            {S06_EXPIRE}
          </div>
        ) : null}
      </div>

      {/* The PIR card */}
      {frame >= criteriaAt - 8 && cardOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 840, top: 128, opacity: cardOut }}>
          <PirCard width={888} title={S06_PIR} letters={letters} criteria={S06_CRITERIA} rows={rows} lit={lit} show={p(criteriaAt - 6, 18)} />
        </div>
      ) : null}

      {/* The two people */}
      {people > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: 120, top: 175 }}>
            <Person size={170} who={S06_PEOPLE.you.who} does={S06_PEOPLE.you.does} tone={C.cyan} show={people} />
          </div>
          <div style={{ position: 'absolute', left: W - 120 - 480, top: 175 }}>
            <Person size={170} who={S06_PEOPLE.boss.who} does={S06_PEOPLE.boss.does} tone={C.emerald} show={people} check={check} glow={check * 0.8} />
          </div>
          {/* The sheet that travels */}
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <path d={`M 560 260 H 1130`} stroke={alpha(C.cyan, 0.5)} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" opacity={people} />
            <path d="M 1114 244 L 1136 260 L 1114 276" fill="none" stroke={alpha(C.cyan, 0.8)} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={people} />
          </svg>
          {send > 0 && send < 1 ? (
            <div style={{ position: 'absolute', left: mix(540, 1060, send), top: 218, opacity: Math.sin(Math.PI * Math.min(1, send * 1.05)) * 1.4 }}>
              <Icon name="file" size={80} color={C.cyan} strokeWidth={2} />
            </div>
          ) : null}
        </>
      ) : null}
    </Stage>
  );
}

/**
 * Which criterion is «the one the voice is on»: a 0–1 weight per row, the last row whose start has been reached,
 * easing out when the next starts and all of them off from `end`.
 */
function litRows(frame: number, starts: readonly number[], end: number): { lit: number[] } {
  const lit = starts.map((s, i) => {
    const next = starts[i + 1] ?? end;
    return progress(frame, s - 2, 10, EASE.inOut) * (1 - progress(frame, next - 2, 10, EASE.inOut));
  });
  // After the last one the card rests with its five criteria half lit.
  const rest = progress(frame, starts[starts.length - 1] + 90, 20, EASE.inOut) * (1 - progress(frame, end, 10));
  return { lit: lit.map((l) => Math.max(l, 0.4 * rest)) };
}

/** A small clock whose hand sweeps (`tick` 0–1 is a full turn). */
function Clock({ tick }: { tick: number }) {
  const a = tick * 2 * Math.PI - Math.PI / 2;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx={32} cy={32} r={27} stroke={C.amber} strokeWidth={4} />
      <path d={`M 32 32 L ${32 + 18 * Math.cos(a)} ${32 + 18 * Math.sin(a)}`} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
      <path d="M 32 10 V 15" stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}
