import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { ANSWER, PHRASES, SOURCE_RULE } from '../data/s03-fuente';
import { NAMES } from '../data/shared';
import { CraneCard } from './parts/CraneCard';
import { Desk } from './parts/Desk';
import { ExampleLabel } from './parts/ExampleLabel';
import { Magnifier, NameTag } from './parts/Marks';
import { Note, STRIKE_BOX, VENDOR_WORD } from './parts/Note';
import { DraftSheet, PAPER, Sheet } from './parts/Paper';
import { RedPen } from './parts/Pen';
import { Stroke, ellipsePoints, linePoints, partial, roundRectPoints } from './parts/strokes';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-fuente';
const W = STAGE.width;

const NOTE_L = { x: 40, y: 300 } as const;
const NOTE_R = { x: 888, y: 300 } as const;
/** The draft of s01 and its pen: centred on the desk while the message is up, then parked on the right, dim. */
const DRAFT_0 = { x: 678, y: 286, s: 0.6 } as const;
const DRAFT_1 = { x: 1115, y: 300, s: 0.56 } as const;
const CARD = { y: 236, w: 800, h: 210 } as const;
const CARD_X = [40, 888] as const;

/** A sentence card (A or B): a paper card with its letter. Normal-flow box 800 x 210. */
function PhraseCard({ letter, text }: { letter: string; text: string }) {
  return (
    <Sheet width={CARD.w} height={CARD.h} tone={C.sky}>
      <div style={{ position: 'absolute', left: 22, top: 22, width: 64, height: 64, borderRadius: 32, background: alpha(C.sky, 0.25), border: `3px solid ${alpha(C.sky, 0.85)}`, display: 'grid', placeItems: 'center', fontSize: 40, fontWeight: 900, color: PAPER.ink }}>{letter}</div>
      <div style={{ position: 'absolute', left: 108, top: 20, width: CARD.w - 108 - 24, fontSize: 40, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.22, color: PAPER.ink }}>{text}</div>
    </Sheet>
  );
}

/** The two-line label that goes under a card. */
function Verdict({ head, sub, color, show }: { head: string; sub: string; color: string; show: number }) {
  return (
    <div style={{ width: CARD.w, textAlign: 'center', fontFamily: FONT.sans, opacity: show, transform: `translateY(${(1 - show) * 12}px)` }}>
      <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: 1, color, textTransform: 'uppercase' }}>{head}</div>
      <div style={{ fontSize: 38, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>{sub}</div>
    </div>
  );
}

/**
 * s03-fuente «La fuente no es la prueba». The note «Frases de ejemplo de la lección · no son el caso de Meridian» is on
 * screen from the first frame, at the foot of the stage. The engine's message (PAPER CRANE) takes the top of the stage
 * until s03-01 ends, so everything else stays below y 250 until then.
 *   (start)       the desk with the draft of s01 and its pen, dim; PAPER CRANE's card, top right
 *   reply-crane   the draft steps aside; a sheet of the lesson's examples comes in: «VendorCo lo atribuye a APT-Z»
 *   authority     «Lo dice X, luego es verdad»; the pen rings the vendor's name and leaves «qué pruebas trae» empty:
 *                 APPEAL TO AUTHORITY
 *   hominem       a second note: «Ese informe viene de un vendor pequeño, ignóralo» and «la evidencia era buena»;
 *                 the pen strikes the whole note: AD HOMINEM
 *   source        in both, «quién lo dice» slides over «qué pruebas trae»: «la fuente no es la prueba». Exam card (engine)
 *   two           two sentence cards, A and B, at rest
 *   pick          nothing moves (the engine's think prompt is on top): no lens, no pen on either
 *   answer        (sfx «check») B: the red ring and «falacia · la identidad sustituye a la evaluación»; A: a lens and
 *                 «rigor · revisa sus pruebas con lupa»
 */
export function S03Fuente(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyAt = props.cue('reply-crane');
  const authorityAt = props.cue('authority');
  const hominemAt = props.cue('hominem');
  const sourceAt = props.cue('source');
  const twoAt = props.cue('two');
  const answerAt = props.cue('answer');
  const msg = segment(props, 's03-01');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  // ---- PAPER CRANE's card, top right, outside the engine's message.
  const craneStart = Math.max(8, msg.from - 80);
  const crane = p(craneStart, 16) * (1 - p(msg.to - 10, 14));

  // ---- The draft of s01: centred while the message is up, then parked on the right, dim; gone with the second note.
  const park = progress(frame, replyAt - 4, 30, EASE.inOut);
  const dx = mix(DRAFT_0.x, DRAFT_1.x, park);
  const dy = mix(DRAFT_0.y, DRAFT_1.y, park);
  const ds = mix(DRAFT_0.s, DRAFT_1.s, park);
  const draftGone = p(hominemAt - 10, 18);
  const draftDim = 0.5 * park;
  const draftChecks = [1, 1, 1];

  // ---- The notes.
  const noteLIn = enter(frame, replyAt, { distance: -70, duration: 24, axis: 'x' });
  const noteRIn = enter(frame, hominemAt - 4, { distance: 60, duration: 22, axis: 'x' });
  const notesOut = p(twoAt - 12, 18);
  const formula = p(authorityAt, 16);
  const aside = p(at('s03-03', 'buenas') - 20, 16);
  const whoIn = [p(at('s03-04', 'quién') - 8, 14), p(at('s03-04', 'quién') - 4, 14)];
  const slideAt = at('s03-04', 'ocupa') - 2;
  const slide = [progress(frame, slideAt, 30, EASE.inOut), progress(frame, slideAt + 6, 30, EASE.inOut)];
  const rule = enter(frame, at('s03-04', 'trae') - 4, { distance: 16, duration: 16 });
  const nameA = p(at('s03-02', 'appeal') - 8, 16);
  const nameB = p(at('s03-03', 'hominem') - 10, 16);

  // ---- Pen 1: rings «VendorCo», leaves the evidence box empty.
  const ringPts = ellipsePoints(VENDOR_WORD.x + VENDOR_WORD.w / 2 - 6, VENDOR_WORD.cy, VENDOR_WORD.w / 2 - 6, 36, { start: -0.5, turns: 1.08 });
  const ring1T = at('s03-02', 'proveedor') - 18;
  const ring1 = progress(frame, ring1T, 36, EASE.inOut);
  const ring1Pt = partial(ringPts, ring1).tip;
  const in1 = progress(frame, ring1T - 22, 22, EASE.out);
  const out1 = progress(frame, hominemAt - 26, 22, EASE.inOut);
  const pen1X = ring1 > 0 ? NOTE_L.x + ring1Pt.x : mix(NOTE_L.x + ringPts[0].x + 170, NOTE_L.x + ringPts[0].x, in1);
  const pen1Y = ring1 > 0 ? NOTE_L.y + ring1Pt.y : mix(NOTE_L.y + ringPts[0].y - 190, NOTE_L.y + ringPts[0].y, in1);
  const pen1Show = p(ring1T - 22, 10) * (1 - out1);

  // ---- Pen 2: strikes the whole second note.
  const strikePts = linePoints({ x: STRIKE_BOX.x + STRIKE_BOX.w - 6, y: STRIKE_BOX.y + 4 }, { x: STRIKE_BOX.x + 6, y: STRIKE_BOX.y + STRIKE_BOX.h - 4 }, { n: 40, wobble: 3 });
  const strikeT = at('s03-03', 'Descartar') - 6;
  const strike = progress(frame, strikeT, 40, EASE.inOut);
  const strikeTip = partial(strikePts, strike).tip;
  const in2 = progress(frame, strikeT - 24, 24, EASE.out);
  const out2 = progress(frame, sourceAt - 20, 22, EASE.inOut);
  const pen2X = strike > 0 ? NOTE_R.x + strikeTip.x : mix(NOTE_R.x + strikePts[0].x + 200, NOTE_R.x + strikePts[0].x, in2);
  const pen2Y = strike > 0 ? NOTE_R.y + strikeTip.y : mix(NOTE_R.y + strikePts[0].y - 200, NOTE_R.y + strikePts[0].y, in2);
  const pen2Show = p(strikeT - 24, 10) * (1 - out2);

  // ---- The two sentence cards and the answer.
  const cardIn = [enter(frame, twoAt - 4, { distance: 40, duration: 20 }), enter(frame, segment(props, 's03-06').from - 4, { distance: 40, duration: 20 })];
  const ringB = roundRectPoints(CARD_X[1] - 14, CARD.y - 14, CARD.w + 28, CARD.h + 28, 26);
  const ringT = answerAt;
  const ringP = progress(frame, ringT, 44, EASE.inOut);
  const ringTip = partial(ringB, ringP).tip;
  const in3 = progress(frame, ringT - 22, 22, EASE.out);
  const out3 = progress(frame, ringT + 96, 26, EASE.inOut);
  const pen3X = ringP > 0 ? ringTip.x : mix(ringB[0].x + 170, ringB[0].x, in3);
  const pen3Y = ringP > 0 ? ringTip.y : mix(ringB[0].y - 190, ringB[0].y, in3);
  const pen3Show = p(ringT - 22, 10) * (1 - out3);
  const lens = progress(frame, at('s03-08', 'primera') - 6, 18, EASE.out);
  const lensPop = 1 + 0.12 * Math.sin(Math.PI * Math.min(1, lens));
  const labelB = p(ringT + 34, 16);
  const labelA = p(at('s03-08', 'rigor') - 12, 16);

  return (
    <Stage>
      <Desk />
      <ExampleLabel width={W} />

      {/* PAPER CRANE's card, outside the engine's message */}
      <div style={{ position: 'absolute', left: 1326, top: 14 }}>
        <CraneCard width={390} show={crane} />
      </div>

      {/* The draft of s01 and its pen, with the cap on */}
      {draftGone < 0.999 ? (
        <div style={{ opacity: 1 - draftGone }}>
          <div style={{ position: 'absolute', left: dx, top: dy }}>
            <DraftSheet scale={ds} checks={draftChecks} pill={1} q={1} dim={draftDim} />
          </div>
          <RedPen x={dx + 620 * ds + 70} y={dy + 270} angle={-72} capped show={1 - 0.45 * park} />
        </div>
      ) : null}

      {/* Note 1: the authority */}
      {frame >= replyAt - 4 && notesOut < 0.999 ? (
        <div style={{ position: 'absolute', left: NOTE_L.x, top: NOTE_L.y, opacity: noteLIn.opacity * (1 - notesOut), transform: noteLIn.transform }}>
          <Note kind={1} formula={formula} whoIn={whoIn[0]} slide={slide[0]} overlay={<Stroke points={ringPts} p={ring1} width={8} glow={0.4} />} />
        </div>
      ) : null}
      {nameA > 0.01 && notesOut < 0.999 ? (
        <div style={{ position: 'absolute', left: NOTE_L.x, top: 222, opacity: 1 - notesOut }}>
          <NameTag text={NAMES.authority} show={nameA} />
        </div>
      ) : null}

      {/* Note 2: the ad hominem */}
      {frame >= hominemAt - 8 && notesOut < 0.999 ? (
        <div style={{ position: 'absolute', left: NOTE_R.x, top: NOTE_R.y, opacity: noteRIn.opacity * (1 - notesOut), transform: noteRIn.transform }}>
          <Note kind={2} aside={aside} whoIn={whoIn[1]} slide={slide[1]} overlay={<Stroke points={strikePts} p={strike} width={12} glow={0.4} />} />
        </div>
      ) : null}
      {nameB > 0.01 && notesOut < 0.999 ? (
        <div style={{ position: 'absolute', left: NOTE_R.x, top: 222, opacity: 1 - notesOut }}>
          <NameTag text={NAMES.hominem} show={nameB} />
        </div>
      ) : null}

      {/* «la fuente no es la prueba» */}
      {rule.opacity > 0.01 && notesOut < 0.999 ? (
        <div style={{ position: 'absolute', left: 0, top: 130, width: W, display: 'flex', justifyContent: 'center', opacity: rule.opacity * (1 - notesOut), transform: rule.transform }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, height: 84, padding: '0 40px 0 30px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.ink900, 0.94), boxShadow: `0 0 30px ${alpha(C.cyan, 0.25)}`, fontFamily: FONT.sans, fontSize: 48, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <Icon name="file" size={44} color={C.cyan} strokeWidth={2} />
            {SOURCE_RULE}
          </div>
        </div>
      ) : null}

      {/* Pens */}
      <RedPen x={pen1X} y={pen1Y} angle={-52} hand show={pen1Show} glow={0.4} />
      <RedPen x={pen2X} y={pen2Y} angle={-52} hand show={pen2Show} glow={0.4} />

      {/* The two sentence cards */}
      {frame >= twoAt - 6 ? (
        <>
          <div style={{ position: 'absolute', left: CARD_X[0], top: CARD.y, opacity: cardIn[0].opacity, transform: cardIn[0].transform }}>
            <PhraseCard letter="A" text={PHRASES.a} />
          </div>
          {frame >= segment(props, 's03-06').from - 8 ? (
            <div style={{ position: 'absolute', left: CARD_X[1], top: CARD.y, opacity: cardIn[1].opacity, transform: cardIn[1].transform }}>
              <PhraseCard letter="B" text={PHRASES.b} />
            </div>
          ) : null}

          {/* The answer: a lens on A, the red ring on B */}
          <svg width={W} height={STAGE.height} viewBox={`0 0 ${W} ${STAGE.height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Stroke points={ringB} p={ringP} width={9} glow={0.5} />
          </svg>
          {lens > 0.01 ? (
            <div style={{ position: 'absolute', left: CARD_X[0] + CARD.w - 110, top: CARD.y - 44, opacity: lens, transform: `scale(${lensPop})`, transformOrigin: '40% 40%' }}>
              <Magnifier size={130} glow={0.6} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: CARD_X[0], top: CARD.y + CARD.h + 18 }}>
            <Verdict head={ANSWER.a[0]} sub={ANSWER.a[1]} color={ACCENT.emerald.soft} show={labelA} />
          </div>
          <div style={{ position: 'absolute', left: CARD_X[1], top: CARD.y + CARD.h + 18 }}>
            <Verdict head={ANSWER.b[0]} sub={ANSWER.b[1]} color={C.roseSoft} show={labelB} />
          </div>
          <RedPen x={pen3X} y={pen3Y} angle={-52} hand show={pen3Show} glow={0.4} />
        </>
      ) : null}
    </Stage>
  );
}
