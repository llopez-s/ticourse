import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { ANSWER, VEST, WALKERS } from '../data/s02-dentro';
import { Person, VEST_YELLOW, VestGlyph } from './parts/People';
import { RuleCard, ruleCardSize } from './parts/RuleCard';
import { MODEL_PANEL, ModelPanel, NamePlate } from './parts/s02-dentro/Models';
import { BorrowedVest, Cargo, CarriedLaptop, Floor, OpenQuestion, PaintedLine, QUAY } from './parts/s02-dentro/Quay';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-dentro';
const W = STAGE.width;
const H = STAGE.height;

// ---- The quay (stage units). Everything from `same-rule` to the end of s02-03 lives below
// y 230: the top-centre band is the engine's (NULL CIPHER's message) for most of that time.
const CARD_W = 700;
const CARD_X = 16;
const CARD_Y = 234;
const CARD = ruleCardSize(CARD_W, 1);
/** The port's people: [x, height]. The last three are the ones who will reach the rule. */
const CREW = { e1: [100, 208], e2: [198, 216], laptop: [296, 212], stolen: [436, 218], worker: [540, 214] } as const;
/** Where each one waits its turn, and where it ends up once across. */
const FRONT_X = CREW.worker[0];
const SLOT_X = [920, 1228, 1536] as const;
const WALK = [22, 26, 30] as const;
/** The close-up of s02-01: the crew, bigger, centred on the stage. */
const CLOSE = { scale: 1.7, cx: (CREW.e1[0] + CREW.worker[0]) / 2 } as const;
/** The quay fades out at the stage's sides instead of ending on an edge. */
const EDGE_FADE = `linear-gradient(90deg, transparent 0px, #000 64px, #000 ${W - 64}px, transparent ${W}px)`;

// ---- s02-01: the vest and what it says, over the crew.
const SAY_TOP = 10;
const SAY_SIZE = 54;

// ---- s02-04 / s02-05: the two models and the name.
const PANEL_GAP = W - 2 * MODEL_PANEL.w;
/** The panels sit in the middle of the stage until the name needs the room under them. */
const PANELS_TOP = 110;
const NAME_TOP = MODEL_PANEL.h + 34;

/** First frame at which a figure gliding from x0 to x1 is past the painted line. */
function crossFrame(start: number, dur: number, x0: number, x1: number): number {
  for (let f = 0; f <= dur; f++) {
    if (mix(x0, x1, progress(start + f, start, dur, EASE.inOut)) >= QUAY.lineX) return start + f;
  }
  return start + dur;
}

/**
 * s02-dentro «Todos con chaleco». The port up close: five people, and on «chaleco» all of them
 * in the port's hi-vis vest; above them the vest and «El chaleco no debería abrir nada» / «solo
 * dice que estás dentro». On `same-rule` the view pulls back: a line is painted across the
 * floor and s01's rule card hovers over it, now read «chaleco de Operaciones: pasa». Three of
 * the five reach it and cross with the same gesture, «pasa» popping emerald each time: «quien
 * trabaja allí», «una credencial robada» · «usada desde dentro» (`stolen`: a vest that is not
 * theirs, an amber outline) and «un portátil comprometido» (`compromised`: an amber dot on the
 * laptop). NULL CIPHER's message takes the top band; under the card the answer writes itself,
 * «Haber pasado el control solo dice que está dentro» / «de si es de fiar, no dice nada», with a
 * dashed grey ring under each of the three. Then the lesson's row as two panels, «Perímetro: se
 * decide una vez, en la entrada» (`once`) against «Zero Trust: se decide en cada petición, venga
 * de donde venga» (`every`), and the name ZERO TRUST with «never trust, always verify»
 * (`zerotrust`), all still before the exam card arrives.
 */
export function S02Dentro(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vestAt = props.cue('vest');
  const sameRuleAt = props.cue('same-rule');
  const stolenAt = props.cue('stolen');
  const compromisedAt = props.cue('compromised');
  const onceAt = props.cue('once');
  const everyAt = props.cue('every');
  const nameAt = props.cue('zerotrust');
  const s02 = segment(props, 's02-02');
  const w1 = (word: string, nth = 0) => wordFrame(S, 's02-01', word, nth);
  const w2 = (word: string, nth = 0) => wordFrame(S, 's02-02', word, nth);
  const w3 = (word: string, nth = 0) => wordFrame(S, 's02-03', word, nth);
  const w4 = (word: string, nth = 0) => wordFrame(S, 's02-04', word, nth);
  const w5 = (word: string, nth = 0) => wordFrame(S, 's02-05', word, nth);
  /** One short swell (a halo), starting at `at`. */
  const swell = (at: number) => progress(frame, at, 10) * (1 - progress(frame, at + 18, 28, EASE.inOut));

  // ---- s02-01: the crew up close; the vests come on as the voice says «chaleco».
  const settle = progress(frame, 0, 16);
  const vestOn = (i: number) => progress(frame, vestAt - 2 + i * 4, 12);
  const glyphIn = progress(frame, w1('chaleco') - 6, 14);
  const opensIn = enter(frame, w1('chaleco', 1) - 10, { distance: 16, duration: 16 });
  // «no debería abrir nada»: the vest empties to an outline; «solo dice que estás dentro»: it fills again.
  const empty = progress(frame, w1('no') - 2, 10, EASE.inOut) * (1 - progress(frame, w1('solo') - 2, 14, EASE.inOut));
  const saysIn = enter(frame, w1('solo') - 4, { distance: 16, duration: 16 });
  const sayDim = 0.55 * progress(frame, sameRuleAt - 12, 16, EASE.inOut);
  // Gone before the engine's card needs the band.
  const sayOut = progress(frame, s02.to - 28, 14, EASE.inOut);

  // ---- `same-rule`: the view pulls back, the line is painted, the rule card hovers over it.
  const pull = progress(frame, sameRuleAt - 26, 28, EASE.inOut);
  const camScale = mix(CLOSE.scale, 1, pull);
  const camX = mix(W / 2, CLOSE.cx, pull);
  const lineIn = progress(frame, sameRuleAt - 6, 16);
  const cardIn = enter(frame, sameRuleAt - 6, { distance: 18, duration: 16 });
  const reading = progress(frame, w2('regla') - 4, 14, EASE.inOut);

  // ---- The three crossings: the same glide, the same answer.
  const start = [w2('pasar') - 10, stolenAt - 2, compromisedAt - 2];
  const walk = start.map((at, i) => progress(frame, at, WALK[i], EASE.inOut));
  // The queue steps up to the front as it empties.
  const step = (from: number, until: number) => progress(frame, from + 8, Math.max(8, Math.min(18, until - from - 12)), EASE.inOut);
  const stolenFront = step(start[0], start[1]);
  const laptopMid = step(start[0], start[1]);
  const laptopFront = step(start[1], start[2]);
  const x = {
    worker: mix(FRONT_X, SLOT_X[0], walk[0]),
    stolen: mix(mix(CREW.stolen[0], FRONT_X, stolenFront), SLOT_X[1], walk[1]),
    laptop: mix(mix(mix(CREW.laptop[0], CREW.stolen[0], laptopMid), FRONT_X, laptopFront), SLOT_X[2], walk[2]),
  };
  const crossAt = start.map((at, i) => crossFrame(at, WALK[i], FRONT_X, SLOT_X[i]));
  const pass = Math.max(...crossAt.map((c) => progress(frame, c - 2, 6) * (1 - progress(frame, c + 8, 22, EASE.inOut))));
  const borrowed = progress(frame, stolenAt - 4, 12);
  const warned = progress(frame, compromisedAt - 4, 12);
  const labelAt = WALKERS.map((wk, i) => Math.max(w2(wk.word) - 4, start[i] + WALK[i] - 10));

  // ---- s02-03: the answer, under the card (the top band is NULL CIPHER's until the segment ends).
  const extrasOut = progress(frame, w3('Haber') - 18, 12, EASE.inOut);
  const passedIn = [enter(frame, w3('Haber') - 4, { distance: 14, duration: 14 }), enter(frame, w3('solo') - 4, { distance: 14, duration: 14 })];
  const trustAt = w3('no') - 4;
  const trustIn = enter(frame, trustAt, { distance: 14, duration: 14 });
  const insideGlow = windowWeight(frame, w3('dentro') - 4, trustAt + 4, { ramp: 10 });
  const openQ = (i: number) => progress(frame, trustAt + 4 + i * 5, 14);
  // The two amber hints swell when they appear and again on «de fiar».
  const hintStolen = 0.3 + 0.7 * Math.max(swell(stolenAt - 4), swell(trustAt + 6));
  const hintLaptop = 0.3 + 0.7 * Math.max(swell(compromisedAt - 4), swell(trustAt + 6));

  // ---- s02-04: the quay leaves, the two models take the stage.
  // It hands over to the first panel: its last frames overlap the panel's first ones.
  const quayOut = progress(frame, onceAt - 14, 14, EASE.inOut);
  const quay = 1 - quayOut;
  const perimeterIn = enter(frame, onceAt - 2, { distance: 20, duration: 16 });
  const zeroTrustIn = enter(frame, everyAt - 2, { distance: 20, duration: 16 });
  const gateLit = progress(frame, w4('una') - 4, 12);
  const freeFlow = progress(frame, w4('luego') - 4, 22, EASE.inOut);
  const eachAt = w4('cada') - 6;
  const eachLit = [0, 1, 2].map((i) => progress(frame, eachAt + i * 8, 10));
  const eachFlow = [0, 1, 2].map((i) => progress(frame, eachAt + i * 8 + 6, 10, EASE.inOut));
  const perimeterDim = 0.45 * progress(frame, everyAt - 4, 16, EASE.inOut);
  const zeroTrustDim = 0.2 * progress(frame, nameAt - 4, 14, EASE.inOut);
  const panelsY = PANELS_TOP * (1 - progress(frame, nameAt - 12, 22, EASE.inOut));

  // ---- s02-05: the name and its motto; nothing moves once «verify» is said.
  const nameIn = springIn(frame, fps, nameAt - 2, { damping: 16 });
  const mottoSaid = [progress(frame, w5('never') - 4, 10), progress(frame, w5('always') - 4, 10)];

  const beamTop = CARD_Y + ruleCardSize(CARD_W, reading).h + 4;

  return (
    <Stage>
      {quay > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden', opacity: quay * settle }}>
          {/* ============ The quay: floor, line, people ============ */}
          <svg style={{ position: 'absolute', left: 0, top: 0, maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <g transform={`translate(${camX} ${QUAY.floor}) scale(${camScale}) translate(${-CLOSE.cx} ${-QUAY.floor})`}>
              <Cargo opacity={0.75 * (1 - 0.5 * pull) * (1 - extrasOut)} />
              <Floor />
              <PaintedLine draw={lineIn} flash={pass} beamTop={beamTop} />

              {/* The two who stay behind (they leave room for the answer) */}
              <Person x={CREW.e1[0]} y={QUAY.floor} h={CREW.e1[1]} vest={vestOn(0)} facing="left" opacity={1 - extrasOut} />
              <Person x={CREW.e2[0]} y={QUAY.floor} h={CREW.e2[1]} vest={vestOn(1)} opacity={1 - extrasOut} />

              {[0, 1, 2].map((i) => (
                <OpenQuestion key={i} x={SLOT_X[i]} show={openQ(i)} />
              ))}

              {/* A laptop that can no longer be trusted: an amber dot, nothing written on it */}
              <Person x={x.laptop} y={QUAY.floor} h={CREW.laptop[1]} vest={vestOn(2)} carry="laptop" glow={0.55 * insideGlow} glowTone={VEST_YELLOW}>
                <CarriedLaptop warn={warned} pulse={hintLaptop} />
              </Person>
              {/* A stolen credential, used from inside: a vest that is not theirs */}
              <Person x={x.stolen} y={QUAY.floor} h={CREW.stolen[1]} vest={vestOn(3)} glow={0.55 * insideGlow} glowTone={VEST_YELLOW}>
                <BorrowedVest show={borrowed} pulse={hintStolen} />
              </Person>
              {/* Who works there */}
              <Person x={x.worker} y={QUAY.floor} h={CREW.worker[1]} vest={vestOn(4)} glow={0.55 * insideGlow} glowTone={VEST_YELLOW} />
            </g>
          </svg>

          {/* ============ s02-01: the vest and what it says ============ */}
          {glyphIn > 0.001 && sayOut < 0.999 ? (
            <div style={{ position: 'absolute', left: 0, top: SAY_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: 1 - sayOut }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 38, ...dimStyle(sayDim) }}>
                <svg width={140} height={172} viewBox="-70 -86 140 172" style={{ display: 'block', flexShrink: 0, opacity: glyphIn, transform: `scale(${0.9 + 0.1 * glyphIn})` }}>
                  <VestGlyph x={0} y={0} h={160} empty={empty} />
                </svg>
                <div style={{ fontFamily: FONT.sans, fontSize: SAY_SIZE, fontWeight: 850, letterSpacing: -0.8, lineHeight: 1.22, color: C.textStrong, whiteSpace: 'nowrap' }}>
                  <div style={{ ...opensIn }}>{VEST.opens}</div>
                  <div style={{ ...saysIn }}>{VEST.says}</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* ============ The rule, over its line ============ */}
          {frame >= sameRuleAt - 8 ? (
            <div style={{ position: 'absolute', left: CARD_X, top: CARD_Y, ...cardIn }}>
              <RuleCard width={CARD_W} reading={reading} pass={pass} />
            </div>
          ) : null}

          {/* ============ Who crossed ============ */}
          {WALKERS.map((wk, i) => {
            if (frame < labelAt[i] - 2) return null;
            const e = enter(frame, labelAt[i], { distance: 12, duration: 14 });
            const h = CREW[wk.id][1];
            const tone = wk.id === 'worker' ? C.textStrong : '#fde68a';
            const smallIn = wk.smallWord ? progress(frame, w2(wk.smallWord) - 4, 12) : 0;
            return (
              <div
                key={wk.id}
                style={{
                  position: 'absolute',
                  left: SLOT_X[i] - 200,
                  width: 400,
                  bottom: H - (QUAY.floor - h - 12),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontFamily: FONT.sans,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  ...e,
                }}
              >
                <div style={{ fontSize: 38, fontWeight: 850, lineHeight: 1.12, color: tone }}>
                  <div>{wk.lines[0]}</div>
                  <div>{wk.lines[1]}</div>
                </div>
                {wk.small ? <div style={{ marginTop: 4, fontSize: 32, fontWeight: 700, lineHeight: 1.15, color: C.text, opacity: smallIn }}>{wk.small}</div> : null}
              </div>
            );
          })}

          {/* ============ s02-03: the answer ============ */}
          {frame >= w3('Haber') - 6 ? (
            <div style={{ position: 'absolute', left: CARD_X + 18, top: CARD_Y + CARD.h + 26, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
              {ANSWER.passed.map((line, k) => (
                <div key={line} style={{ fontSize: 42, fontWeight: 850, letterSpacing: -0.4, lineHeight: 1.2, color: C.textStrong, ...passedIn[k] }}>
                  {line}
                </div>
              ))}
              <div style={{ marginTop: 12, fontSize: 38, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.2, color: '#fde68a', ...trustIn }}>{ANSWER.trust}</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ============ s02-04: where access is decided ============ */}
      {frame >= onceAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: panelsY, ...perimeterIn }}>
          <div style={{ ...dimStyle(perimeterDim) }}>
            <ModelPanel kind="perimeter" decided={[gateLit]} flow={[freeFlow, freeFlow, freeFlow]} />
          </div>
        </div>
      ) : null}
      {/* The other model's place, empty until the voice gets to it (dashed grey: not there yet) */}
      {frame >= onceAt - 4 && zeroTrustIn.opacity < 0.999 ? (
        <div
          style={{
            position: 'absolute',
            left: MODEL_PANEL.w + PANEL_GAP,
            top: panelsY,
            width: MODEL_PANEL.w,
            height: MODEL_PANEL.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `3px dashed ${alpha(C.faint, 0.55)}`,
            opacity: perimeterIn.opacity * (1 - zeroTrustIn.opacity),
          }}
        />
      ) : null}
      {frame >= everyAt - 4 ? (
        <div style={{ position: 'absolute', left: MODEL_PANEL.w + PANEL_GAP, top: panelsY, ...zeroTrustIn }}>
          <div style={{ ...dimStyle(zeroTrustDim) }}>
            <ModelPanel kind="zeroTrust" decided={eachLit} flow={eachFlow} />
          </div>
        </div>
      ) : null}

      {/* ============ s02-05: the name and its motto ============ */}
      {frame >= nameAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: NAME_TOP, width: W, display: 'flex', justifyContent: 'center' }}>
          <NamePlate show={nameIn} said={mottoSaid} />
        </div>
      ) : null}
    </Stage>
  );
}
