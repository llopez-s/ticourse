import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S07_A, S07_B, S07_DOUBLE, S07_END, S07_LABEL, S07_REVEAL } from '../data/s07-reconocer';
import { Candidate } from './parts/Candidate';
import { Person } from './parts/PirCard';
import { Stage, wordFrame } from './kit';

const S = 's07-reconocer';
const W = STAGE.width;
/** Everything lives under y 200: EMBER FOX's message (s07-01) and the think prompt (s07-03) own the top. */
const TOP = 214;

/**
 * s07-reconocer «Dos candidatas». While EMBER FOX's message is up (`reply-iv`): one long question with a loose
 * «y también» glued into it; as the voice says «dos requirements» it comes apart into two cards, «requirement 1» and
 * «requirement 2», the «y también» left floating, and a question mark over both («nadie sabe cuál se responde»).
 * On `pair` the two candidates of the lesson, under «Ejemplo de la lección · no es el caso de Meridian»: A «Tell
 * me about ransomware.», B the long sentence about VPN appliances (on screen only). Neutral while the think prompt
 * («Dos candidatas, ¿cuál es el PIR bien formado?») runs. On `reveal` B lights emerald with «concreta · acaba en
 * algo que vigilar · se puede responder» and A steps back under «un tema, no una pregunta»; B's comma glows with
 * «misma pregunta, su consecuencia de detección» (it is not a «y también»). On `not-same` the stamp «bien formado no
 * es lo mismo que prioritario» and the one who decides, «lo valida quien decide».
 */
export function S07Reconocer(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyAt = props.cue('reply-iv');
  const pairAt = props.cue('pair');
  const revealAt = props.cue('reveal');
  const notSameAt = props.cue('not-same');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  // ---- The double question, glued and then split.
  const doubleIn = p(8, 20);
  const glueGlow = p(replyAt, 10) * (1 - progress(frame, replyAt + 40, 20, EASE.inOut));
  const splitAt = at('s07-01', 'requirements') - 8;
  const split = progress(frame, splitAt, 24, EASE.inOut);
  const tagIn = p(splitAt + 10, 14);
  const unknown = p(at('s07-01', 'nadie') - 4, 14);
  const doubleOut = 1 - progress(frame, pairAt - 8, 14, EASE.inOut);

  // ---- The pair.
  const labelIn = enter(frame, pairAt - 2, { distance: 12, duration: 16 });
  const aIn = p(pairAt, 16);
  const bIn = p(at('s07-02', 'dos') + 4, 16);
  const lit = p(revealAt, 14);
  const dimA = p(revealAt, 14);
  const goodAt = S07_REVEAL.good.map((_, i) => revealAt + 6 + i * 12);
  const topicIn = enter(frame, revealAt + 12, { distance: 12, duration: 16 });
  const commaAt = at('s07-05', 'mitades') - 6;
  const comma = p(commaAt, 12);
  const commaNote = enter(frame, at('s07-06', 'también') - 6, { distance: 12, duration: 16 });
  const pairOut = 1 - progress(frame, notSameAt - 10, 14, EASE.inOut);

  // ---- The remate.
  const stamp = p(notSameAt, 12);
  const who = p(at('s07-07', 'quien') - 6, 16);

  const double = (
    <>
      <div style={{ position: 'absolute', left: mix(0, -6, split), top: mix(0, -16, split), opacity: 1 }}>
        <Chunk text={S07_DOUBLE.a} split={split} />
      </div>
      <div style={{ position: 'absolute', left: mix(612, 720, split), top: mix(0, 16, split) }}>
        <Chunk text={S07_DOUBLE.b} split={split} />
      </div>
    </>
  );

  return (
    <Stage>
      {/* ---- One question with a «y también» glued in, then two */}
      {doubleOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 44, top: 310, width: W - 88, height: 180, opacity: doubleIn * doubleOut, transform: `translateY(${(1 - doubleIn) * 16}px)` }}>
          {double}
          {/* the loose «y también» */}
          <div
            style={{
              position: 'absolute',
              left: mix(528, 548, split),
              top: mix(0, 112, split),
              transform: `rotate(${split * 6}deg)`,
              padding: '8px 24px 10px',
              borderRadius: RADIUS.pill,
              border: `3px ${split > 0.5 ? 'dashed' : 'solid'} ${alpha(C.amber, 0.9)}`,
              background: alpha(C.amberDeep, 0.85),
              boxShadow: glueGlow > 0.02 ? `0 0 ${Math.round(30 * glueGlow)}px ${alpha(C.amber, 0.6 * glueGlow)}` : undefined,
              fontFamily: FONT.sans,
              fontSize: 38,
              fontWeight: 850,
              color: '#fde68a',
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}
          >
            {S07_DOUBLE.glue}
          </div>
          {/* two requirements, and nobody knows which is answered */}
          {tagIn > 0.01
            ? S07_DOUBLE.tags.map((t, i) => (
                <div key={t} style={{ position: 'absolute', left: i === 0 ? 0 : 720, top: -62, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.cyanSoft, opacity: tagIn, whiteSpace: 'nowrap' }}>
                  {t}
                </div>
              ))
            : null}
          {unknown > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, width: W - 88, top: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: unknown, fontFamily: FONT.sans, fontSize: 44, fontWeight: 900, color: C.amber }}>
              <span style={{ fontSize: 70, lineHeight: 1 }}>?</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---- The two candidates */}
      {frame >= pairAt - 6 && pairOut > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: pairOut }}>
          <div style={{ position: 'absolute', left: 0, top: TOP - 4, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap', ...labelIn }}>{S07_LABEL}</div>

          <div style={{ position: 'absolute', left: 0, top: TOP + 76 }}>
            <Candidate width={560} height={200} letter="A" dim={dimA} show={aIn}>
              {S07_A}
            </Candidate>
          </div>
          {topicIn.opacity > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: TOP + 76 + 214, width: 560, textAlign: 'center', fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.amber, ...topicIn }}>{S07_REVEAL.topic}</div>
          ) : null}

          <div style={{ position: 'absolute', left: 620, top: TOP + 56 }}>
            <Candidate width={W - 620} height={240} letter="B" lit={lit} show={bIn}>
              <span style={{ fontSize: 38 }}>
                {S07_B[0]}
                <span style={{ display: 'inline-block', padding: '0 7px', margin: '0 1px', borderRadius: 8, fontWeight: 900, color: comma > 0.3 ? C.cyan : C.textStrong, background: alpha(C.cyan, 0.28 * comma), boxShadow: comma > 0.02 ? `0 0 ${Math.round(24 * comma)}px ${alpha(C.cyan, 0.7 * comma)}` : undefined, transform: `scale(${1 + 0.35 * comma})`, transformOrigin: '50% 80%' }}>{S07_B[1]}</span>
                {S07_B[2]}
              </span>
            </Candidate>
          </div>
          {/* Why B is the one */}
          <div style={{ position: 'absolute', left: 620, top: TOP + 56 + 258, display: 'flex', gap: 14 }}>
            {S07_REVEAL.good.map((g, i) => {
              const e = enter(frame, goodAt[i], { distance: 12, duration: 14 });
              return (
                <span key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 20px 8px 14px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.emerald, 0.8)}`, background: alpha(C.emeraldDeep, 0.7), fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: '#a7f3d0', whiteSpace: 'nowrap', ...e }}>
                  <Icon name="check" size={30} color={C.emerald} strokeWidth={3} />
                  {g}
                </span>
              );
            })}
          </div>
          {/* The comma */}
          {commaNote.opacity > 0.01 ? (
            <div style={{ position: 'absolute', left: 620, top: TOP + 56 + 258 + 66, width: W - 620, fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...commaNote }}>{S07_REVEAL.comma}</div>
          ) : null}
        </div>
      ) : null}

      {/* ---- Remate: well formed is not the same as priority */}
      {stamp > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: TOP + 26, width: W, display: 'flex', justifyContent: 'center', opacity: stamp, transform: `rotate(-2deg) scale(${1 + (1 - stamp) * 0.12})` }}>
            <span style={{ display: 'inline-block', padding: '12px 44px 16px', borderRadius: RADIUS.md, border: `6px solid ${alpha(C.amber, 0.92)}`, background: alpha(C.amberDeep, 0.5), fontFamily: FONT.sans, fontSize: 66, fontWeight: 900, letterSpacing: -1, color: C.amber, whiteSpace: 'nowrap' }}>{S07_END.stamp}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: TOP + 190, width: W, display: 'flex', justifyContent: 'center' }}>
            <Person size={150} who={S07_END.who} does="" tone={C.emerald} show={who} check={who} glow={who * 0.7} style={{ flexDirection: 'row', gap: 36 }} />
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** One half of the double question: a plain card; `split` pulls them apart. */
function Chunk({ text, split }: { text: string; split: number }) {
  return (
    <div style={{ boxSizing: 'border-box', padding: '22px 36px 26px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.5 + 0.3 * split)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.08)} 0%, ${alpha(C.ink900, 0.97)} 70%)`, boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`, fontFamily: FONT.sans, fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.4 }}>
      {text}
    </div>
  );
}
