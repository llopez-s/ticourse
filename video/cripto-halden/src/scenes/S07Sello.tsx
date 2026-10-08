import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix } from '../../../engine/src/ui';
import { S04 } from '../data/s04-huella';
import { INTRO, LANES, PAIR, SIGNATURE, STEPS } from '../data/s07-sello';
import { FingerprintGlyph, FingerprintMachine, HashLine, OfferSheet, machineAnchors } from './parts/Fingerprint';
import { Mailbox, PrivateKey } from './parts/Mailbox';
import { TermTag } from './parts/s02-familias/Marks';
import { PortGlyph, ShipGlyph } from './parts/s02-familias/Parties';
import { SealPattern, SealRing, SealedPrint, WaxSeal, ringFace, sealedPrintSeal, sealedPrintSize, type SealVerdict } from './parts/WaxSeal';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-sello';
const W = 1728;

// ---- P1: the three pieces of the image -----------------------------------------------------
const RING1 = { x: 250, y: 142, w: 150 } as const;
const SEAL1 = { cx: 864, cy: 250, size: 240 } as const;
const PATTERN1 = { x: 1400, y: 154, size: 170 } as const;
const LABEL1_Y = 352;
const NAME1_Y = 86;

// ---- P2–P4: the two lanes -------------------------------------------------------------------
const SHEET_P = { x: 30, y: 100, w: 260 } as const;
const SHEET_N = { x: 930, y: 100, w: 260 } as const;
const MACH_P = { x: 330, y: 116, w: 240 } as const;
const MACH_N = { x: 1222, y: 116, w: 240 } as const;
const LINE_P = { x: 340, y: 270 } as const;
const LINE_N = { x: 1232, y: 270 } as const;
const SEALED_W = 500;
const SEALED_P = { x: 60, y: 388 } as const;
const SEALED_N = { x: 960, y: 388 } as const;
const RING_REST = { x: 600, y: 360, w: 100 } as const;
const RING_PRESS_W = 110;
const PATTERN_N = { x: 1584, y: 90, size: 112 } as const;
const PRINT_SIZE = 32;

/**
 * s07-sello «El sello del puerto». The image in three pieces: the port's wax
 * seal in the middle, the ring on the left («clave privada · solo lo tiene el
 * puerto») and the design on the right («clave pública · lo conoce todo el
 * mundo», with a crowd). Then two lanes. Port: the offer goes through the
 * fingerprint machine and the ring seals its fingerprint («huella sellada con
 * su privada»). The bundle crosses to the shipping company: her machine
 * takes the fingerprint again, the port's design is laid over the seal and
 * it fits — «el sello encaja con la huella que acaba de sacar» · «del puerto ·
 * intacta» (sfx on `seal-ok`). Variant: one price changes (12,41), the
 * fingerprint changes entirely and the seal no longer fits. DIGITAL SIGNATURE
 * with INTEGRITY · AUTHENTICATION · NON-REPUDIATION («el puerto no puede negar
 * que la ofreció»). Last, s03's warning comes back as «tu privada no esconde:
 * firma» and the pair of rules with their two images: her mailbox, your seal.
 */
export function S07Sello(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringAt = props.cue('ring');
  const designAt = props.cue('design');
  const sealAt = props.cue('seal');
  const recomputeAt = props.cue('recompute');
  const verifyAt = props.cue('verify');
  const sealOkAt = props.cue('seal-ok');
  const tamperedAt = props.cue('tampered');
  const signatureAt = props.cue('signature');
  const pairAt = props.cue('pair');
  const s02 = segment(props, 's07-02');

  // ---- P1 -------------------------------------------------------------------------------------
  const sealIntro = progress(frame, Math.min(wordFrame(S, 's07-01', 'sello') - 6, 10), 10, EASE.out);
  const ringIn = progress(frame, ringAt - 4, 14);
  const designIn = progress(frame, designAt - 4, 14);
  const crowdIn = (i: number) => progress(frame, designAt + 6 + i * 3, 10);
  const p2 = progress(frame, sealAt - 8, 20, EASE.inOut);

  // ---- P2: the port seals the offer's fingerprint ----------------------------------------------
  const wSaca = wordFrame(S, 's07-02', 'saca');
  const wHuella = wordFrame(S, 's07-02', 'huella');
  const wOferta = wordFrame(S, 's07-02', 'oferta');
  const wSella = wordFrame(S, 's07-02', 'sella');
  const wPrivada = wordFrame(S, 's07-02', 'privada');
  const sheetPIn = progress(frame, sealAt - 4, 14);
  const runP = progress(frame, wSaca - 8, 8) * (1 - progress(frame, wSella, 12));
  const lineP = progress(frame, wHuella - 4, 10);
  const tagIn = progress(frame, Math.min(wOferta + 4, wSella - 10), 10);
  const ringToSeal = progress(frame, Math.max(sealAt + 6, wSella - 18), Math.max(8, Math.min(16, wSella - sealAt - 6)), EASE.inOut);
  const press = progress(frame, wSella - 2, 6, EASE.in);
  const sealP = progress(frame, wSella + 2, 8);
  const ringLift = progress(frame, wSella + 10, 14, EASE.inOut);
  const sealedLabelIn = progress(frame, Math.min(wPrivada - 6, s02.to - 30), 12);

  // ---- P3: the shipping company checks -----------------------------------------------------------
  const cross = progress(frame, recomputeAt - 10, 20, EASE.inOut);
  const portDim = 0.5 * cross;
  const machNIn = progress(frame, recomputeAt - 4, 12);
  const wSacar = wordFrame(S, 's07-03', 'sacar');
  const wRecibido = wordFrame(S, 's07-03', 'recibido');
  const runN = progress(frame, wSacar - 6, 8) * (1 - progress(frame, wRecibido + 10, 10));
  const lineNIn = progress(frame, Math.min(wRecibido - 4, wSacar + 14), Math.max(8, wRecibido - wSacar));
  // The design glows on «comprueba el sello», then travels onto the seal on «la pública del puerto».
  const wPublica = wordFrame(S, 's07-03', 'pública');
  const patternGo = Math.max(verifyAt + 4, Math.min(wPublica - 8, sealOkAt - 26));
  const patternTo = progress(frame, patternGo, Math.max(10, Math.min(18, sealOkAt - patternGo - 6)), EASE.inOut);
  const patternGlow = progress(frame, verifyAt - 4, 10);
  const compare = progress(frame, verifyAt - 2, 12);
  const okP = progress(frame, sealOkAt, 8, EASE.out); // the tick lands on the cue (sfx «check»)
  const okLabelIn = progress(frame, sealOkAt + 4, 12);
  const okChipIn = progress(frame, wordFrame(S, 's07-04', 'puerto') - 6, 12);

  // ---- P4: one price changes ------------------------------------------------------------------------
  const wCambia = wordFrame(S, 's07-05', 'cambia');
  const wHuella5 = wordFrame(S, 's07-05', 'huella');
  const wEncaja5 = wordFrame(S, 's07-05', 'encaja');
  const tamper = progress(frame, tamperedAt - 4, 10);
  const change = progress(frame, wCambia - 4, 12);
  const runN2 = progress(frame, wHuella5 - 10, 8) * (1 - progress(frame, wEncaja5, 10));
  const morph = progress(frame, wHuella5 - 2, 16, EASE.inOut);
  const badP = progress(frame, wEncaja5 - 6, 8, EASE.out);
  const badLabelIn = progress(frame, wEncaja5 - 4, 12);

  // ---- P5: the name ------------------------------------------------------------------------------------
  const lanesOut = progress(frame, signatureAt - 8, 14, EASE.inOut);
  const p5In = progress(frame, signatureAt - 2, 14);
  const p5Out = progress(frame, pairAt - 14, 12, EASE.inOut);
  const chipAt = [wordFrame(S, 's07-06', 'integridad'), wordFrame(S, 's07-06', 'autenticidad'), wordFrame(S, 's07-06', 'repudio')];
  const nrNoteIn = progress(frame, wordFrame(S, 's07-06', 'puerto') - 6, 12);

  // ---- P6: the pair ------------------------------------------------------------------------------------
  const headIn = progress(frame, pairAt, 12);
  const mailCardIn = progress(frame, wordFrame(S, 's07-07', 'naviera') - 10, 14);
  const sealCardIn = progress(frame, wordFrame(S, 's07-07', 'eres') - 10, 14);

  // ---- Places ------------------------------------------------------------------------------------------
  const seal1Out = p2;
  const pattern = {
    x: mix(PATTERN1.x, PATTERN_N.x, p2),
    y: mix(PATTERN1.y, PATTERN_N.y, p2),
    size: mix(PATTERN1.size, PATTERN_N.size, p2),
  };
  const sealedSize = sealedPrintSize(SEALED_W);
  const sealC = sealedPrintSeal(SEALED_W);
  const sealedPos = { x: mix(SEALED_P.x, SEALED_N.x, cross), y: mix(SEALED_P.y, SEALED_N.y, cross) };
  const sheetPos = { x: mix(SHEET_P.x, SHEET_N.x, cross), y: mix(SHEET_P.y, SHEET_N.y, cross) };
  const sealCentreP = { x: SEALED_P.x + sealC.x, y: SEALED_P.y + sealC.y };
  const sealCentreN = { x: SEALED_N.x + sealC.x, y: SEALED_N.y + sealC.y };
  // The ring: intro place → over the seal (lift, press) → resting beside it
  const face = ringFace(RING_PRESS_W);
  const overSeal = { x: sealCentreP.x - face.x, y: sealCentreP.y - face.y - 70 * (1 - press) };
  const ringA = { x: mix(RING1.x, overSeal.x, ringToSeal), y: mix(RING1.y, overSeal.y, ringToSeal), w: mix(RING1.w, RING_PRESS_W, ringToSeal) };
  const ring = { x: mix(ringA.x, RING_REST.x, ringLift), y: mix(ringA.y, RING_REST.y, ringLift), w: mix(ringA.w, RING_REST.w, ringLift) };
  const mP = machineAnchors(MACH_P.w);
  const outletP = { x: MACH_P.x + mP.outlet.x, y: MACH_P.y + mP.outlet.y };
  const lineFly = progress(frame, wHuella - 4, 14, EASE.inOut);
  const linePos = { x: mix(outletP.x - 40, LINE_P.x, lineFly), y: mix(outletP.y - 28, LINE_P.y, lineFly) };
  const verdict: SealVerdict | undefined = badP > 0 ? 'bad' : okP > 0 ? 'ok' : undefined;
  const check = badP > 0 ? badP : okP * (1 - tamper);
  const lineTone = badP > 0.01 || morph > 0.01 ? C.rose : C.emerald;

  return (
    <Stage>
      {/* ================= P1: ring · seal · design ================= */}
      {seal1Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - seal1Out }}>
          <div style={{ position: 'absolute', left: SEAL1.cx - SEAL1.size / 2, top: SEAL1.cy - SEAL1.size / 2 }}>
            <WaxSeal size={SEAL1.size} press={sealIntro} glow={0.5} />
          </div>
          <Caption x={SEAL1.cx} y={SEAL1.cy + SEAL1.size / 2 + 30} size={38} color={C.textStrong} show={sealIntro}>
            {INTRO.seal}
          </Caption>
          <Caption x={RING1.x + RING1.w / 2} y={NAME1_Y} size={38} color={C.cyanSoft} show={ringIn}>
            {INTRO.ring.name}
          </Caption>
          <KeyNote x={RING1.x + RING1.w / 2} y={LABEL1_Y} title={INTRO.ring.title} sub={INTRO.ring.sub} color={C.cyanSoft} show={ringIn} />
          <Caption x={PATTERN1.x + PATTERN1.size / 2} y={NAME1_Y} size={38} color={C.cyanSoft} show={designIn}>
            {INTRO.design.name}
          </Caption>
          <KeyNote x={PATTERN1.x + PATTERN1.size / 2} y={LABEL1_Y} title={INTRO.design.title} sub={INTRO.design.sub} color={C.cyanSoft} show={designIn} />
          {Array.from({ length: 6 }, (_, i) => {
            const p = crowdIn(i);
            if (p <= 0.001) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: PATTERN1.x + PATTERN1.size / 2 - 168 + i * 56, top: LABEL1_Y + 104, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
                <Icon name="user" size={46} color={i % 3 === 0 ? C.sky : i % 3 === 1 ? '#cbd5e1' : '#fcd9b6'} strokeWidth={2.2} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ================= P2–P4: the two lanes ================= */}
      {p2 > 0.001 && lanesOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: p2 * (1 - lanesOut) }}>
          {/* Lane headers and the line between */}
          <LaneHeader x={30} who="port" label={LANES.port} />
          <LaneHeader x={930} who="naviera" label={LANES.naviera} />
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
            <line x1={880} y1={20} x2={880} y2={520} stroke={alpha(C.sky, 0.35)} strokeWidth={3} strokeDasharray="10 12" />
            {/* Recomputed line ↔ seal: the comparison */}
            {compare > 0.001 ? (
              <line
                x1={LINE_N.x + 124}
                y1={LINE_N.y + 56}
                x2={sealCentreN.x}
                y2={sealCentreN.y - sealedSize.seal / 2 - 4}
                stroke={alpha(lineTone, 0.85)}
                strokeWidth={4}
                strokeDasharray="8 7"
                opacity={compare}
              />
            ) : null}
          </svg>

          {/* Port: machine */}
          <div style={{ position: 'absolute', left: MACH_P.x, top: MACH_P.y, opacity: sheetPIn, ...dimOf(portDim) }}>
            <FingerprintMachine width={MACH_P.w} label={S04.machine} run={runP} frame={frame} />
          </div>
          {/* The print coming out, before it goes on the tag */}
          {lineP * (1 - tagIn) > 0.001 ? (
            <div style={{ position: 'absolute', left: linePos.x, top: linePos.y, opacity: 1 - tagIn }}>
              <HashLine value={S04.print} size={PRINT_SIZE} tone={C.cyan} reveal={lineP} />
            </div>
          ) : null}

          {/* Shipping company: machine and her own print */}
          {machNIn > 0.001 ? (
            <div style={{ position: 'absolute', left: MACH_N.x, top: MACH_N.y, opacity: machNIn }}>
              <FingerprintMachine width={MACH_N.w} label={S04.machine} tone={C.emerald} run={Math.max(runN, runN2)} frame={frame} />
            </div>
          ) : null}
          {lineNIn > 0.001 ? (
            <>
              <div style={{ position: 'absolute', left: LINE_N.x, top: LINE_N.y }}>
                <HashLine
                  value={S04.changed}
                  from={S04.print}
                  morph={morph}
                  size={PRINT_SIZE}
                  tone={C.emerald}
                  reveal={lineNIn}
                  mark={Math.max(okP * (1 - tamper), badP)}
                  markTone={badP > 0 ? C.rose : C.emerald}
                />
              </div>
              <div style={{ position: 'absolute', left: LINE_N.x, top: LINE_N.y + 64, fontFamily: FONT.sans, fontSize: 32, fontWeight: 780, color: '#6ee7b7', opacity: lineNIn * (1 - compare), whiteSpace: 'nowrap' }}>
                {STEPS.recomputed}
              </div>
            </>
          ) : null}

          {/* The offer: at the port, then received */}
          <div style={{ position: 'absolute', left: sheetPos.x, top: sheetPos.y, opacity: sheetPIn, transform: `translateY(${(1 - sheetPIn) * 14}px)` }}>
            <OfferSheet width={SHEET_P.w} change={change} glow={0.3 * cross * (1 - tamper)} />
          </div>
          {/* The sealed print: made at the port, then received */}
          {tagIn > 0.001 ? (
            <div style={{ position: 'absolute', left: sealedPos.x, top: sealedPos.y, opacity: tagIn, transform: `translateY(${(1 - tagIn) * 12}px)` }}>
              <SealedPrint width={SEALED_W} seal={sealP} verdict={verdict} check={check} tone={C.cyan} glow={0.35 * okP * (1 - tamper)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                  <FingerprintGlyph size={40} tone={C.cyan} strokeWidth={6.5} />
                  <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 760, color: C.textStrong }}>{S04.print}</span>
                </span>
              </SealedPrint>
            </div>
          ) : null}
          {sealedLabelIn * (1 - cross) > 0.001 ? (
            <div style={{ position: 'absolute', left: SEALED_P.x, top: SEALED_P.y + sealedSize.height + 10, fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: sealedLabelIn * (1 - cross) }}>
              {STEPS.sealed}
            </div>
          ) : null}

          {/* Verdict lines, under the shipping company's lane */}
          {okLabelIn * (1 - tamper) > 0.001 ? (
            <div style={{ position: 'absolute', left: 1300, top: 552, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: okLabelIn * (1 - tamper) }}>
              <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{STEPS.ok}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 22px',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.emerald, 0.7)}`,
                  background: alpha(C.emeraldDeep, 0.5),
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 850,
                  color: '#6ee7b7',
                  whiteSpace: 'nowrap',
                  opacity: okChipIn,
                }}
              >
                <Icon name="check" size={36} color={C.emerald} strokeWidth={2.8} />
                {STEPS.okChip}
              </span>
            </div>
          ) : null}
          {badLabelIn > 0.001 ? (
            <div style={{ position: 'absolute', left: 1300, top: 566, transform: `translateX(-50%) translateY(${(1 - badLabelIn) * 10}px)`, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, color: C.roseSoft, whiteSpace: 'nowrap', opacity: badLabelIn }}>
              <Icon name="x" size={40} color={C.rose} strokeWidth={2.8} />
              {STEPS.bad}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The design (public key): from the intro to the shipping company's lane, then over the seal */}
      {designIn > 0.001 && lanesOut < 1 ? (
        <div style={{ opacity: 1 - lanesOut }}>
          <div style={{ position: 'absolute', left: pattern.x, top: pattern.y, opacity: designIn }}>
            <PatternCard size={pattern.size} glow={Math.max(0.3 * (1 - p2), patternGlow * (1 - patternTo))} />
          </div>
          {p2 > 0.5 ? (
            <div style={{ position: 'absolute', left: PATTERN_N.x + PATTERN_N.size / 2, top: PATTERN_N.y + PATTERN_N.size + 8, transform: 'translateX(-50%)', textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 780, lineHeight: 1.15, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: (p2 - 0.5) * 2 }}>
              {STEPS.pattern[0]}
              <br />
              {STEPS.pattern[1]}
            </div>
          ) : null}
          {/* The stencil laid over the received seal */}
          {patternTo > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: mix(PATTERN_N.x + PATTERN_N.size / 2, sealCentreN.x, patternTo) - sealedSize.seal * 0.45,
                top: mix(PATTERN_N.y + PATTERN_N.size / 2, sealCentreN.y, patternTo) - sealedSize.seal * 0.45,
                opacity: Math.min(1, patternTo * 2) * (1 - 0.6 * okP),
              }}
            >
              <SealPattern size={sealedSize.seal * 0.9} stencil color={C.cyanSoft} glow={0.6} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The ring: intro → press on the tag → rests by the port's lane */}
      {ringIn > 0.001 && lanesOut < 1 ? (
        <div style={{ position: 'absolute', left: ring.x, top: ring.y, opacity: ringIn * (1 - lanesOut), ...dimOf(portDim) }}>
          <SealRing width={ring.w} glow={0.4 + 0.5 * press * (1 - ringLift)} />
        </div>
      ) : null}

      {/* ================= P5: DIGITAL SIGNATURE ================= */}
      {p5In * (1 - p5Out) > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: p5In * (1 - p5Out) }}>
          <div style={{ position: 'absolute', left: (W - 560) / 2, top: 64, transform: `translateY(${(1 - p5In) * 14}px)` }}>
            <SealedPrint width={560} verdict="ok" check={1} tone={C.cyan} glow={0.4}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                <FingerprintGlyph size={44} tone={C.cyan} strokeWidth={6.5} />
                <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 760, color: C.textStrong }}>{S04.print}</span>
              </span>
            </SealedPrint>
          </div>
          <div style={{ position: 'absolute', left: W / 2, top: 268, transform: 'translateX(-50%)' }}>
            <TermTag frame={frame} fps={fps} at={signatureAt + 2} term={SIGNATURE.term} size={58} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 406, width: W, display: 'flex', justifyContent: 'center', gap: 26 }}>
            {SIGNATURE.chips.map((c, i) => {
              const p = springIn(frame, fps, chipAt[i] - 4, { damping: 16 });
              if (frame < chipAt[i] - 6) return <span key={c} style={{ visibility: 'hidden' }}><ExamChip text={c} glow={0} /></span>;
              return (
                <span key={c} style={{ opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - Math.min(1, p)) * 14}px)` }}>
                  <ExamChip text={c} glow={i === 2 ? nrNoteIn : 0} />
                </span>
              );
            })}
          </div>
          {nrNoteIn > 0.001 ? (
            <div style={{ position: 'absolute', left: W / 2, top: 498, transform: `translateX(-50%) translateY(${(1 - nrNoteIn) * 10}px)`, fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', opacity: nrNoteIn }}>
              {SIGNATURE.nonRepudiation}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= P6: the pair of rules ================= */}
      {headIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: W / 2,
            top: 24,
            transform: `translateX(-50%) translateY(${(1 - headIn) * 12}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            fontFamily: FONT.sans,
            fontSize: 56,
            fontWeight: 850,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            opacity: headIn,
          }}
        >
          <PrivateKey width={110} color={C.cyan} glow={0.5} />
          {PAIR.head}
        </div>
      ) : null}
      <RuleCard x={60} show={mailCardIn} tone={C.emerald} lead={PAIR.mailbox.lead} keyText={PAIR.mailbox.key} art={<Mailbox width={170} glow={0.4} slotGlow={0.8} />} />
      <RuleCard x={908} show={sealCardIn} tone={C.cyan} lead={PAIR.seal.lead} keyText={PAIR.seal.key} art={<WaxSeal size={190} glow={0.5} />} />
    </Stage>
  );
}

// ---------------------------------------------------------------------------

function dimOf(d: number) {
  const k = clamp01(d);
  return k > 0.001 ? { filter: `saturate(${1 - 0.5 * k})`, opacity: 1 - 0.6 * k } : {};
}

function Caption({ x, y, size, color, show, children }: { x: number; y: number; size: number; color: string; show: number; children: string }) {
  if (show <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translateX(-50%) translateY(${(1 - show) * 10}px)`, fontFamily: FONT.sans, fontSize: size, fontWeight: 850, color, whiteSpace: 'nowrap', opacity: show }}>
      {children}
    </div>
  );
}

function KeyNote({ x, y, title, sub, color, show }: { x: number; y: number; title: string; sub: string; color: string; show: number }) {
  if (show <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translateX(-50%) translateY(${(1 - show) * 10}px)`, textAlign: 'center', fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: show }}>
      <div style={{ fontSize: 44, fontWeight: 850, color, lineHeight: 1.12 }}>{title}</div>
      <div style={{ fontSize: 34, fontWeight: 700, color: C.text, lineHeight: 1.25 }}>{sub}</div>
    </div>
  );
}

function LaneHeader({ x, who, label }: { x: number; who: 'port' | 'naviera'; label: string }) {
  const color = who === 'port' ? C.cyanSoft : '#6ee7b7';
  return (
    <div style={{ position: 'absolute', left: x, top: 8, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: 36, fontWeight: 850, color, whiteSpace: 'nowrap' }}>
      {who === 'port' ? <PortGlyph size={52} /> : <ShipGlyph size={52} />}
      {label}
    </div>
  );
}

/** The public key as a card: the seal's design (everyone knows it). */
function PatternCard({ size, glow }: { size: number; glow: number }) {
  const g = clamp01(glow);
  return (
    <div
      style={{
        width: size,
        height: size,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.55 + 0.4 * g)}`,
        background: `radial-gradient(circle at 50% 40%, ${alpha(C.cyan, 0.14 + 0.1 * g)} 0%, ${alpha(C.ink900, 0.96)} 75%)`,
        boxShadow: `0 0 ${Math.round(10 + 26 * g)}px ${alpha(C.cyan, 0.15 + 0.3 * g)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SealPattern size={size * 0.78} color={C.cyanSoft} />
    </div>
  );
}

function ExamChip({ text, glow }: { text: string; glow: number }) {
  const g = clamp01(glow);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 26px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.violet, 0.65 + 0.35 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16 + 0.12 * g)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 ${Math.round(14 + 24 * g)}px ${alpha(C.violet, 0.2 + 0.3 * g)}`,
        fontFamily: FONT.sans,
        fontSize: 40,
        fontWeight: 850,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="mortarboard" size={36} color={C.violet} />
      {text}
    </span>
  );
}

function RuleCard({ x, show, tone, lead, keyText, art }: { x: number; show: number; tone: string; lead: string; keyText: string; art: ReactNode }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const words = lead.split(' ');
  const half = Math.ceil(words.length / 2);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 148,
        width: 760,
        height: 420,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.6)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
        boxShadow: `0 0 30px ${alpha(tone, 0.18)}, 0 22px 50px ${alpha('#000000', 0.45)}`,
        display: 'flex',
        alignItems: 'center',
        gap: 40,
        padding: '0 44px',
        opacity: s,
        transform: `translateY(${(1 - s) * 22}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ width: 200, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>{art}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 40, fontWeight: 750, color: C.text, lineHeight: 1.2 }}>
          {words.slice(0, half).join(' ')}
          <br />
          {words.slice(half).join(' ')}
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: tone === C.emerald ? '#6ee7b7' : C.cyanSoft, lineHeight: 1.1 }}>{keyText}</div>
      </div>
    </div>
  );
}
