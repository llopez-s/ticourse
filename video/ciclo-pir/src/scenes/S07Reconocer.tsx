import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { S07_A, S07_B, S07_DOUBLE, S07_END, S07_LABEL, S07_REVEAL } from '../data/s07-reconocer';
import { Candidate } from './parts/Candidate';
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
  const half1 = p(at('s07-05', 'entran') - 6, 12);
  const half2 = p(at('s07-05', 'saltar') - 6, 12);
  const comma = p(at('s07-06', 'también') - 8, 12);
  const commaNote = enter(frame, at('s07-06', 'también') - 6, { distance: 12, duration: 16 });
  const pairOut = 1 - progress(frame, notSameAt - 10, 14, EASE.inOut);

  // ---- The remate.
  const stamp = p(notSameAt, 12);
  const who = p(at('s07-07', 'quien') - 6, 16);

  return (
    <Stage>
      {/* ---- One question with a «y también» glued in, then two */}
      {doubleOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 330, width: W, display: 'flex', justifyContent: 'center', opacity: doubleIn * doubleOut, transform: `translateY(${(1 - doubleIn) * 16}px)` }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Chunk text={S07_DOUBLE.a} split={split} dx={-34} dy={-14} tag={S07_DOUBLE.tags[0]} tagShow={tagIn} />
            {/* the loose «y también» sits in the gap; it falls out when the question comes apart */}
            <div style={{ position: 'relative', width: 240, height: 80, flexShrink: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 8 + 124 * split,
                  width: 240,
                  textAlign: 'center',
                  transform: `rotate(${split * 7}deg)`,
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 24px 10px',
                    borderRadius: RADIUS.pill,
                    border: `3px ${split > 0.5 ? 'dashed' : 'solid'} ${alpha(C.amber, 0.9)}`,
                    background: alpha(C.amberDeep, 0.9),
                    boxShadow: glueGlow > 0.02 ? `0 0 ${Math.round(30 * glueGlow)}px ${alpha(C.amber, 0.6 * glueGlow)}` : undefined,
                    fontFamily: FONT.sans,
                    fontSize: 36,
                    fontWeight: 850,
                    color: '#fde68a',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {S07_DOUBLE.glue}
                </span>
              </div>
              {/* nobody knows which of the two is being answered */}
              {unknown > 0.01 ? (
                <div style={{ position: 'absolute', left: 0, top: -16, width: 240, textAlign: 'center', fontFamily: FONT.sans, fontSize: 96, fontWeight: 900, lineHeight: 1, color: C.amber, opacity: unknown * split, textShadow: `0 0 30px ${alpha(C.amber, 0.4)}` }}>?</div>
              ) : null}
            </div>
            <Chunk text={S07_DOUBLE.b} split={split} dx={34} dy={14} tag={S07_DOUBLE.tags[1]} tagShow={tagIn} />
          </div>
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
                <span style={{ borderBottom: `5px solid ${alpha(C.cyan, half1)}`, paddingBottom: 2 }}>{S07_B[0]}</span>
                <span style={{ position: 'relative', display: 'inline-block', width: 22, textAlign: 'center' }}>
                  <span style={{ position: 'absolute', left: -14, top: -16, width: 50, height: 50, borderRadius: 25, background: alpha(C.cyan, 0.32 * comma), boxShadow: comma > 0.02 ? `0 0 ${Math.round(30 * comma)}px ${alpha(C.cyan, 0.8 * comma)}` : undefined, transform: `scale(${comma})` }} />
                  <span style={{ position: 'relative', fontWeight: 900, color: comma > 0.3 ? C.cyan : C.textStrong, fontSize: `${1 + 0.5 * comma}em`, lineHeight: 0 }}>{S07_B[1]}</span>
                </span>
                <span style={{ borderBottom: `5px solid ${alpha(C.emerald, half2)}`, paddingBottom: 2 }}>{S07_B[2].trimStart()}</span>
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
          <div style={{ position: 'absolute', left: 0, top: 150, width: W, display: 'flex', justifyContent: 'center', opacity: stamp, transform: `rotate(-2deg) scale(${1 + (1 - stamp) * 0.12})` }}>
            <span style={{ display: 'inline-block', padding: '12px 44px 16px', borderRadius: RADIUS.md, border: `6px solid ${alpha(C.amber, 0.92)}`, background: alpha(C.amberDeep, 0.5), fontFamily: FONT.sans, fontSize: 66, fontWeight: 900, letterSpacing: -1, color: C.amber, whiteSpace: 'nowrap' }}>{S07_END.stamp}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 350, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, opacity: who, transform: `translateY(${(1 - who) * 16}px)` }}>
            <Candidate width={420} height={130} letter="B" lit={1}>
              <span style={{ fontSize: 40 }}>bien formada</span>
            </Candidate>
            <Icon name="arrowRight" size={64} color={C.emerald} strokeWidth={2.6} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <div style={{ position: 'relative', width: 130, height: 130 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 65, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.1), border: `4px solid ${alpha(C.emerald, 0.85)}`, boxShadow: `0 0 ${Math.round(34 * who)}px ${alpha(C.emerald, 0.35 * who)}` }}>
                  <Icon name="user" size={74} color={C.emerald} strokeWidth={2} />
                </div>
                <div style={{ position: 'absolute', right: -6, bottom: -6, width: 46, height: 46, borderRadius: 23, display: 'grid', placeItems: 'center', background: C.emerald, border: `4px solid ${C.ink950}` }}>
                  <Icon name="check" size={28} color={C.ink950} strokeWidth={3.4} />
                </div>
              </div>
              <span style={{ fontFamily: FONT.sans, fontSize: 54, fontWeight: 850, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap' }}>{S07_END.who}</span>
            </div>
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** One half of the double question: a plain card with its tag; `split` pulls it apart by (dx, dy). */
function Chunk({ text, split, dx, dy, tag, tagShow }: { text: string; split: number; dx: number; dy: number; tag: string; tagShow: number }) {
  return (
    <div style={{ position: 'relative', transform: `translate(${dx * split}px, ${dy * split}px)` }}>
      <div style={{ position: 'absolute', left: 6, top: -56, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.cyanSoft, opacity: tagShow, whiteSpace: 'nowrap' }}>{tag}</div>
      <div style={{ boxSizing: 'border-box', padding: '20px 34px 24px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.5 + 0.3 * split)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.08)} 0%, ${alpha(C.ink900, 0.97)} 70%)`, boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`, fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.4 }}>
        {text}
      </div>
    </div>
  );
}
