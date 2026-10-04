import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, windowWeight } from '../../../engine/src/ui';
import {
  S05_BACKLOG,
  S05_CLOSE,
  S05_COLLECTIONS,
  S05_ISAC,
  S05_LETTER_DATE,
  S05_MARKING,
  S05_MERIDIAN,
  S05_MNEMONIC,
  S05_PULL,
  S05_STIX,
  S05_TAXII,
} from '../data/s05-taxii';
import { Stage, wordFrame } from './kit';
import { ENVELOPE, Envelope, LETTER, Letter, POBOX, PoBoxes, poBoxCenterX, poBoxesWidth } from './parts/Letter';
import { StixJson } from './parts/StixJson';

const S = 's05-taxii';
const W = 1728;

// ---------------------------------------------------------------------------
// Layout (stage-local, 1728×660). Boxes are { x, y, w } — the part scales to w.

type Box = { x: number; y: number; w: number };

// Act 1: the letter and the envelope side by side, a label under each.
const A_LETTER: Box = { x: 300, y: 0, w: 400 };
const A_ENV: Box = { x: 1010, y: 190, w: 400 };
const LABEL_Y = 532;

// The ISAC's wall of PO boxes (TAXII collections) and Meridian's platform.
const BOXES = 5;
const BOX_I = 2;
const WALL = { x: 30, y: 290, w: poBoxesWidth(BOXES) };
const BOX_C = { x: WALL.x + poBoxCenterX(BOX_I), y: WALL.y + POBOX.pad + POBOX.boxH / 2 };
const MER = { x: 1380, y: 280, w: 330, h: 206 };
const REQ = { x1: MER.x - 8, x2: WALL.x + WALL.w + 14, y: BOX_C.y };

// The envelope once it has reached Meridian, and the letters that come out of it.
const D_ENV: Box = { x: 830, y: 400, w: 300 };
const FAN: { x: number; y: number; w: number; rot: number }[] = [
  { x: 676, y: 214, w: 140, rot: -14 },
  { x: 762, y: 168, w: 140, rot: -7 },
  { x: 855, y: 66, w: 250, rot: 0 }, // the 11-03 letter
  { x: 1108, y: 168, w: 140, rot: 7 },
  { x: 1222, y: 214, w: 140, rot: 14 },
];
const OURS = 2;

// Act 2: close-up of the 11-03 letter and the empty envelope; at the close they
// shift left and Meridian comes back on the right.
const C_LETTER: Box = { x: 380, y: 0, w: 400 };
const C_ENV: Box = { x: 920, y: 200, w: 360 };
const SHIFT = 150;
const C_MER = { x: 1300, y: 170, w: 330, h: 206 };
const MNEMONIC_Y = 530;
const CLOSE_Y = 600;

const envH = (w: number) => (ENVELOPE.h * w) / ENVELOPE.w;

/**
 * s05-taxii «La carta y el correo».
 *   letter      the letter (dated 11-03, the STIX JSON in miniature inside, its
 *               mark printed faint); «STIX · qué se cuenta y cómo» under it
 *   envelope    the envelope opens beside it: «TAXII · cómo llega»
 *   collection  the ISAC's row of PO boxes (no names); the letter slips into the
 *               envelope and the envelope into one box
 *   pull        ON the cue (sfx «mail»): Meridian appears, the request line and
 *               «consulta (pull) · 02-07 · primera vez», the box opens and the
 *               envelope comes out and travels to Meridian
 *   backlog     «llega todo lo que había»: the envelope opens and several
 *               letters fan out; the 11-03 one lifts, its date readable
 *   marking     close-up: `tlp-amber-strict` lights INSIDE the letter; the
 *               envelope beside it carries nothing
 *   mnemonic    «STIX describe · TAXII transporta» (letter, then envelope glow)
 *   close       «el contexto viaja en la carta · tu plataforma la recoge»:
 *               Meridian comes back and the envelope's path to it draws
 */
export function S05Taxii(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letterAt = props.cue('letter');
  const envAt = props.cue('envelope');
  const collAt = props.cue('collection');
  const pullAt = props.cue('pull');
  const backlogAt = props.cue('backlog');
  const markingAt = props.cue('marking');
  const mnemonicAt = props.cue('mnemonic');
  const closeAt = props.cue('close');
  const diceAt = wordFrame(S, 's05-01', 'dice');
  const marcaAt = Math.max(markingAt + 4, wordFrame(S, 's05-04', 'marca') - 4);
  const sobreAt = wordFrame(S, 's05-04', 'sobre');
  const describeAt = Math.max(mnemonicAt, wordFrame(S, 's05-04', 'describe') - 4);
  const transportaAt = Math.max(describeAt + 8, wordFrame(S, 's05-04', 'transporta') - 4);
  const beat = pulse(frame, fps, 0.6);

  // --- act 1
  const letterIn = springIn(frame, fps, Math.min(4, letterAt - 6), { damping: 16 });
  const stixLabelIn = progress(frame, Math.max(letterAt + 6, diceAt - 6), 14);
  const envIn = springIn(frame, fps, envAt, { damping: 15 });
  const taxiiLabelIn = progress(frame, envAt + 4, 14);
  const labelsOut = progress(frame, collAt, 12);

  // --- collection: letter into the envelope, envelope into a box
  const wallIn = springIn(frame, fps, collAt + 6, { damping: 16 });
  const tuck = progress(frame, collAt + 2, 18, EASE.inOut);
  const flapOpen1 = progress(frame, envAt + 6, 14) * (1 - progress(frame, collAt + 16, 10));
  const fly = progress(frame, collAt + 26, 24, EASE.inOut);
  const flyFade = progress(frame, collAt + 44, 6);
  const boxHasMail = windowWeight(frame, collAt + 46, pullAt + 4, { ramp: 8, lead: 0 });

  // --- pull: everything starts ON the cue (the «mail» sound)
  const merIn = frame >= pullAt ? springIn(frame, fps, pullAt, { damping: 15 }) : 0;
  const reqDraw = progress(frame, pullAt, 12);
  const pullLabelIn = frame >= pullAt ? springIn(frame, fps, pullAt + 2, { damping: 15 }) : 0;
  const boxOpen = progress(frame, pullAt, 10);
  const travel = progress(frame, pullAt + 6, 44, EASE.inOut);

  // --- backlog
  const backlogLabelIn = frame >= backlogAt ? springIn(frame, fps, backlogAt, { damping: 15 }) : 0;
  const envOpen2 = progress(frame, backlogAt - 2, 12);
  const fanP = FAN.map((_, i) => progress(frame, backlogAt + 6 + (i === OURS ? 6 : Math.abs(i - OURS) * 3), 18, EASE.out));
  const oursGlow = windowWeight(frame, backlogAt + 24, markingAt - 10, { ramp: 10, lead: 0 });

  // --- act 2: close-up, marking, mnemonic, close
  const closeUp = progress(frame, markingAt - 14, 22, EASE.inOut);
  const markLit = progress(frame, marcaAt, 14);
  const sobreLook = windowWeight(frame, sobreAt - 4, mnemonicAt, { ramp: 8 });
  const mnemonicIn = frame >= mnemonicAt - 2 ? springIn(frame, fps, mnemonicAt - 2, { damping: 16 }) : 0;
  const letterGlow2 = windowWeight(frame, describeAt, transportaAt, { ramp: 8, lead: 0 });
  const envGlow2 = windowWeight(frame, transportaAt, closeAt, { ramp: 8, lead: 0 });
  const shift = progress(frame, closeAt - 4, 20, EASE.inOut);
  const closeIn = frame >= closeAt ? springIn(frame, fps, closeAt + 2, { damping: 16 }) : 0;
  const merBack = frame >= closeAt ? springIn(frame, fps, closeAt + 6, { damping: 16 }) : 0;
  const pathDraw = progress(frame, closeAt + 10, 18, EASE.inOut);

  // --- the act-1 letter (until it is inside the envelope)
  // It shrinks onto the paper slot of the open envelope, then the envelope shows it inside.
  const envS = A_ENV.w / ENVELOPE.w;
  const a1Letter: Box = {
    x: mix(A_LETTER.x, A_ENV.x + ((ENVELOPE.w - 250) / 2) * envS, tuck),
    y: mix(A_LETTER.y, A_ENV.y - 20 * envS, tuck),
    w: mix(A_LETTER.w, 250 * envS, tuck),
  };
  const a1LetterOpacity = Math.min(1, letterIn * 1.4) * (1 - progress(frame, collAt + 15, 6));

  // --- the envelope's journey: act 1 → into the box → out to Meridian → close-up
  let env: Box;
  let envOpacity = 1;
  let envOpen = 0;
  let envLetters = 0;
  let envFill = 1;
  if (frame < pullAt) {
    // act 1, then flying into the box
    const boxW = 84;
    env = {
      x: mix(A_ENV.x, BOX_C.x - boxW / 2, fly),
      y: mix(A_ENV.y, BOX_C.y - envH(boxW) / 2, fly),
      w: mix(A_ENV.w, boxW, fly),
    };
    envOpacity = Math.min(1, envIn * 1.4) * (1 - flyFade);
    envOpen = flapOpen1;
    envLetters = tuck > 0.75 ? 1 : 0;
    envFill = 1 - progress(frame, collAt + 18, 8);
  } else {
    // out of the box to Meridian, then the close-up
    const boxW = 84;
    const atD: Box = {
      x: mix(BOX_C.x - boxW / 2, D_ENV.x, travel),
      y: mix(BOX_C.y - envH(boxW) / 2, D_ENV.y, travel),
      w: mix(boxW, D_ENV.w, travel),
    };
    const cEnv: Box = { x: C_ENV.x - SHIFT * shift, y: C_ENV.y, w: C_ENV.w };
    env = { x: mix(atD.x, cEnv.x, closeUp), y: mix(atD.y, cEnv.y, closeUp), w: mix(atD.w, cEnv.w, closeUp) };
    envOpacity = progress(frame, pullAt + 4, 6);
    envOpen = envOpen2;
    envLetters = envOpen2 > 0.5 && closeUp < 0.5 ? 3 : 0;
    envFill = (1 - Math.max(...fanP) * 0.6) * (1 - closeUp);
  }

  // --- the 11-03 letter: from its fan slot to the close-up
  const ours = FAN[OURS];
  const oursBox: Box = {
    x: mix(mix(D_ENV.x + D_ENV.w / 2 - 40, ours.x, fanP[OURS]), C_LETTER.x - SHIFT * shift, closeUp),
    y: mix(mix(D_ENV.y + 40, ours.y, fanP[OURS]), C_LETTER.y, closeUp),
    w: mix(mix(80, ours.w, fanP[OURS]), C_LETTER.w, closeUp),
  };
  const oursDateSize = mix(64, 40, closeUp);

  const jsonMini = (
    <StixJson mini width={LETTER.content.w} focus={[{ key: 'object_marking_refs', from: marcaAt, tone: 'amber' }]} frame={frame} />
  );

  return (
    <Stage>
      {/* ---------- the ISAC's wall of PO boxes ---------- */}
      {wallIn > 0.001 && closeUp < 1 ? (
        <div style={{ position: 'absolute', left: WALL.x, top: WALL.y - 66, opacity: Math.min(1, wallIn * 1.4) * (1 - closeUp), transform: `translateY(${(1 - Math.min(1, wallIn)) * 20}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 54, fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: '#7dd3fc', whiteSpace: 'nowrap' }}>
            <Icon name="server" size={40} color={C.sky} />
            {S05_ISAC}
          </div>
          <div style={{ marginTop: 12 }}>
            <PoBoxes count={BOXES} active={BOX_I} glow={Math.max(boxHasMail, windowWeight(frame, pullAt, backlogAt, { ramp: 8 }))} open={boxOpen} contents={1 - travel} />
          </div>
          <div style={{ width: WALL.w, marginTop: 12, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: C.muted, letterSpacing: 1 }}>{S05_COLLECTIONS}</div>
        </div>
      ) : null}

      {/* ---------- Meridian's platform (pull), and again at the close ---------- */}
      {merIn > 0.001 && closeUp < 1 ? (
        <div style={{ position: 'absolute', left: MER.x, top: MER.y, opacity: (1 - closeUp) }}>
          <MeridianNode w={MER.w} h={MER.h} show={merIn} glow={windowWeight(frame, pullAt, backlogAt, { ramp: 8 }) * 0.8} />
        </div>
      ) : null}
      {merBack > 0.001 ? (
        <div style={{ position: 'absolute', left: C_MER.x, top: C_MER.y }}>
          <MeridianNode w={C_MER.w} h={C_MER.h} show={merBack} glow={0.6 + 0.2 * beat} />
        </div>
      ) : null}

      {/* request line + pull label */}
      {reqDraw > 0 && frame < backlogAt + 8 ? (
        <>
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - progress(frame, backlogAt - 4, 10) }}>
            <line x1={REQ.x1} y1={REQ.y} x2={mix(REQ.x1, REQ.x2 + 16, reqDraw)} y2={REQ.y} stroke={C.cyan} strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" />
            {reqDraw >= 1 ? <polygon points={`${REQ.x2},${REQ.y} ${REQ.x2 + 22},${REQ.y - 13} ${REQ.x2 + 22},${REQ.y + 13}`} fill={C.cyan} /> : null}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: (REQ.x1 + REQ.x2) / 2,
              top: REQ.y - 92,
              transform: `translateX(-50%) scale(${0.9 + 0.1 * Math.min(1, pullLabelIn)})`,
              opacity: Math.min(1, pullLabelIn * 1.4) * (1 - progress(frame, backlogAt - 4, 10)),
            }}
          >
            <Pill color={C.cyan} size={34}>
              {S05_PULL}
            </Pill>
          </div>
        </>
      ) : null}

      {/* ---------- act 1 labels ---------- */}
      {stixLabelIn > 0 && labelsOut < 1 ? (
        <Caption x={A_LETTER.x + A_LETTER.w / 2} y={LABEL_Y} show={stixLabelIn * (1 - labelsOut)}>
          <span style={{ color: '#c4b5fd' }}>{S05_STIX.term}</span>
          <span style={{ color: C.faint }}> · </span>
          {S05_STIX.rest}
        </Caption>
      ) : null}
      {taxiiLabelIn > 0 && labelsOut < 1 ? (
        <Caption x={A_ENV.x + A_ENV.w / 2} y={LABEL_Y} show={taxiiLabelIn * (1 - labelsOut)}>
          <span style={{ color: '#c4b5fd' }}>{S05_TAXII.term}</span>
          <span style={{ color: C.faint }}> · </span>
          {S05_TAXII.rest}
        </Caption>
      ) : null}

      {/* ---------- the fan of letters (all that was waiting) ---------- */}
      {FAN.map((slot, i) => {
        if (i === OURS) return null;
        const p = fanP[i];
        if (p <= 0.001 || closeUp >= 1) return null;
        const x = mix(D_ENV.x + D_ENV.w / 2 - 40, slot.x, p);
        const y = mix(D_ENV.y + 40, slot.y, p);
        const w = mix(80, slot.w, p);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${slot.rot * p}deg)`, opacity: Math.min(1, p * 2) * (1 - closeUp) * (1 - 0.35 * oursGlow) }}>
            <Letter width={w} showMark={false} />
          </div>
        );
      })}

      {/* ---------- the envelope ---------- */}
      {envOpacity > 0.001 && (frame < pullAt ? envIn > 0.001 : frame >= pullAt + 4) ? (
        <div style={{ position: 'absolute', left: env.x, top: env.y, opacity: envOpacity }}>
          <Envelope
            width={env.w}
            open={envOpen}
            letters={envLetters}
            fill={envFill}
            glow={Math.max(frame < pullAt ? taxiiLabelIn * (1 - labelsOut) * 0.5 : 0, sobreLook * 0.7, envGlow2)}
          />
        </div>
      ) : null}

      {/* the 11-03 letter coming out on top of the envelope */}
      {frame >= backlogAt && fanP[OURS] > 0.001 ? (
        <div style={{ position: 'absolute', left: oursBox.x, top: oursBox.y, opacity: Math.min(1, fanP[OURS] * 2) }}>
          <Letter width={oursBox.w} date={S05_LETTER_DATE} dateSize={oursDateSize} markingText={S05_MARKING} marking={markLit} glow={Math.max(oursGlow, letterGlow2, 0.35 * markLit)}>
            {jsonMini}
          </Letter>
        </div>
      ) : null}

      {/* the act-1 letter (until it is inside the envelope) */}
      {a1LetterOpacity > 0.001 ? (
        <div style={{ position: 'absolute', left: a1Letter.x, top: a1Letter.y, opacity: a1LetterOpacity, transform: `scale(${0.94 + 0.06 * Math.min(1, letterIn)})`, transformOrigin: '50% 50%' }}>
          <Letter width={a1Letter.w} date={S05_LETTER_DATE} markingText={S05_MARKING} glow={stixLabelIn * (1 - labelsOut) * 0.5}>
            {jsonMini}
          </Letter>
        </div>
      ) : null}

      {/* backlog label */}
      {backlogLabelIn > 0.001 && closeUp < 1 ? (
        <Caption x={D_ENV.x + D_ENV.w / 2} y={608} size={38} show={Math.min(1, backlogLabelIn * 1.4) * (1 - closeUp)}>
          {S05_BACKLOG}
        </Caption>
      ) : null}

      {/* ---------- close: the envelope's path to Meridian ---------- */}
      {pathDraw > 0 ? (
        <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <PathArrow from={{ x: C_ENV.x - SHIFT + C_ENV.w + 18, y: C_ENV.y + envH(C_ENV.w) / 2 }} to={{ x: C_MER.x - 14, y: C_MER.y + C_MER.h / 2 }} draw={pathDraw} />
        </svg>
      ) : null}

      {/* ---------- mnemonic and close ---------- */}
      {mnemonicIn > 0.001 ? (
        <Caption x={W / 2} y={MNEMONIC_Y} size={52} show={Math.min(1, mnemonicIn * 1.4) * (1 - 0.45 * closeIn)}>
          <span style={{ color: '#c4b5fd', textShadow: letterGlow2 > 0.1 ? `0 0 ${Math.round(18 * letterGlow2)}px ${alpha(C.violet, 0.8)}` : undefined }}>{S05_MNEMONIC.stix}</span> {S05_MNEMONIC.describe}
          <span style={{ color: C.faint }}> · </span>
          <span style={{ color: '#c4b5fd', textShadow: envGlow2 > 0.1 ? `0 0 ${Math.round(18 * envGlow2)}px ${alpha(C.violet, 0.8)}` : undefined }}>{S05_MNEMONIC.taxii}</span> {S05_MNEMONIC.transports}
        </Caption>
      ) : null}
      {closeIn > 0.001 ? (
        <Caption x={W / 2} y={CLOSE_Y} size={40} weight={750} color={C.text} show={Math.min(1, closeIn * 1.4)}>
          {S05_CLOSE}
        </Caption>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------

/** A centred caption line at stage-local (x centre, y top). */
function Caption({
  x,
  y,
  show,
  size = 44,
  weight = 800,
  color = C.textStrong,
  children,
}: {
  x: number;
  y: number;
  show: number;
  size?: number;
  weight?: number;
  color?: string;
  children: ReactNode;
}) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(-50%) translateY(${(1 - clamp01(show)) * 14}px)`,
        opacity: clamp01(show),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: -0.5,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

function Pill({ color, size, children }: { color: string; size: number; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: Math.round(size * 1.7),
        padding: `0 ${Math.round(size * 0.7)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, 0.75)}`,
        background: alpha(C.ink900, 0.92),
        boxShadow: `0 0 24px ${alpha(color, 0.25)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

/** Meridian's platform as a node: radar disc and the company name (cyan). */
function MeridianNode({ w, h, show, glow = 0 }: { w: number; h: number; show: number; glow?: number }) {
  const g = clamp01(glow);
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 26px',
        borderRadius: 26,
        border: `${g > 0.3 ? 3 : 2}px solid ${alpha(C.cyan, 0.5 + 0.45 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.1 + 0.06 * g)} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 20px 46px ${alpha('#000000', 0.4)}${g > 0.02 ? `, 0 0 ${Math.round(34 * g)}px ${alpha(C.cyan, 0.3 * g)}` : ''}`,
        opacity: Math.min(1, show * 1.4),
        transform: `scale(${0.88 + 0.12 * Math.min(1, show)})`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ width: 86, height: 86, borderRadius: 43, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.14), border: `3px solid ${alpha(C.cyan, 0.8)}` }}>
        <Icon name="radar" size={50} color={C.cyan} strokeWidth={2} />
      </div>
      <div style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.1, color: C.cyanSoft, letterSpacing: -0.5 }}>
        {S05_MERIDIAN.map((l) => (
          <div key={l} style={{ whiteSpace: 'nowrap' }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dashed sky path with an arrowhead (the envelope on its way to Meridian). */
function PathArrow({ from, to, draw }: { from: { x: number; y: number }; to: { x: number; y: number }; draw: number }) {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const ux = (to.x - from.x) / len;
  const uy = (to.y - from.y) / len;
  const end = { x: from.x + (to.x - from.x) * draw, y: from.y + (to.y - from.y) * draw };
  const head = 20;
  const base = { x: end.x - ux * head, y: end.y - uy * head };
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={base.x} y2={base.y} stroke={C.sky} strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" />
      {draw > 0.6 ? (
        <polygon points={`${end.x},${end.y} ${base.x - uy * head * 0.6},${base.y + ux * head * 0.6} ${base.x + uy * head * 0.6},${base.y - ux * head * 0.6}`} fill={C.sky} />
      ) : null}
    </g>
  );
}
