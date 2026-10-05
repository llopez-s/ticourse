import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Connector, Terminal, clamp01, mix, type MonoToken, type TerminalLine } from '../../../engine/src/ui';
import { CaSeal } from './parts/CaSeal';
import {
  Guest,
  HOTEL_TEXT,
  Justificante,
  Police,
  Reception,
  StapledPair,
  Staple,
  guestHand,
  guestSize,
  justificanteSize,
  policePhone,
  policeSize,
  receptionPhone,
  receptionSize,
  stapledPairLayout,
} from './parts/Hotel';
import { CONSOLE, EventStrip, StampChip, terminalRows } from './parts/s04-revocar/Console';
import { Caption, FactChip, TermTag } from './parts/s04-revocar/Marks';
import { HOTEL_POS } from './parts/s04-revocar/places';
import { PORTAL_CARD, PortalCard } from './parts/s05-ocsp/Portal';
import {
  AFTER,
  BEFORE,
  CMD,
  CONSOLE_TITLE,
  COSTS,
  DAY_AFTER,
  DAY_BEFORE,
  FRESH,
  IMPROVEMENT,
  NOTE,
  NOW,
  OCSP,
  OCSP_URL,
  PORTAL,
  SEAL_ONLY,
  SIGNED,
  STAPLING,
} from '../data/s05-ocsp';
import { HOTEL } from '../data/s04-revocar';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-ocsp';
const W = 1728;

// ---- A–D: the hotel (same places as s04) -----------------------------------------------------------
const GUEST = { x: 880, w: 90 } as const;
const PAIR_DNI_W = 236;
const QUEUE_X = [748, 616, 484] as const;
// ---- E: the hotel steps back to the left; the portal does the same on the right ---------------------
const SHRINK = { k: 0.48, x: 0, y: 150 } as const;
const CARD = { x: 836, y: 210 } as const;
// The CA's response overlaps the card's right edge, raised (as the receipt does the DNI's); the staple binds them.
const SLIP = { x: CARD.x + PORTAL_CARD.w - 30, y: 150, w: 220 } as const;
const SLIP_STAPLE = { x: SLIP.x - 34, y: CARD.y + 26, w: 78 } as const;
// ---- F–I: the console -------------------------------------------------------------------------------
/** The command at 28 px (never read) keeps the console narrow enough for the notes column at its right. */
const CMD_SIZE = 28;
const CON_W = 1190;
const CON = { x: 0, y: 66 } as const;
const COL_X = 1216;
/** Gap between the command and the response block: the slip's top border and its staple sit in it. */
const SLIP_GAP = 30;
/** Rows of the 12-11 console (indices in `linesAfter`). */
const ROW = { first: 2, thisUpdate: 8, nextUpdate: 9 } as const;

/**
 * s05-ocsp «Un justificante recién sellado». «La otra dirección» (the OCSP URL from s04's console),
 * and the same hotel: reception phones the police for each guest and gets the answer at once — but
 * with a queue, a saturated police and the police knowing where everyone sleeps (three amber chips; the
 * third is screen-only). OCSP. Better: the guest brings, stapled to the DNI, a police receipt sealed
 * this morning; reception only checks the seal. The portal does the same with the CA's response:
 * OCSP STAPLING. The demo: Tuesday's `-status` says `no response sent`; Thursday, with stapling on, the
 * same command shows the stapled response (sfx «lock» on `after`): `Cert Status: good`, sealed this
 * morning, expiring tonight; the CA signs it and the portal brings it, stapled.
 */
export function S05Ocsp(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const callAt = props.cue('call');
  const costsAt = props.cue('costs');
  const ocspAt = props.cue('ocsp');
  const noteAt = props.cue('note');
  const staplingAt = props.cue('stapling');
  const beforeAt = props.cue('before');
  const improvementAt = props.cue('improvement');
  const afterAt = props.cue('after');
  const goodAt = props.cue('good');
  const s4 = segment(props, 's05-04');

  // ---- A: the call --------------------------------------------------------------------------------
  const hotelIn = 1;
  const urlIn = progress(frame, Math.min(callAt + 8, wordFrame(S, 's05-01', 'dirección') - 8), 12);
  const ocspTermAt = Math.max(ocspAt + 6, wordFrame(S, 's05-02', 'OCSP') - 6);
  const urlOut = progress(frame, ocspTermAt - 14, 12, EASE.inOut);
  const guestAt = wordFrame(S, 's05-01', 'hotel') - 10;
  const walk = progress(frame, guestAt, 20, EASE.inOut);
  const llamaraAt = wordFrame(S, 's05-01', 'llamara') - 4;
  const policiaAt = wordFrame(S, 's05-01', 'policía') - 2;
  const phone = progress(frame, llamaraAt, 12) * (1 - progress(frame, noteAt - 4, 14, EASE.inOut));
  const lineDraw = progress(frame, llamaraAt + 4, Math.max(10, policiaAt - llamaraAt), EASE.inOut);
  const ring = progress(frame, policiaAt, 8) * (1 - progress(frame, noteAt - 4, 12));
  const answerAt = Math.max(policiaAt + 14, wordFrame(S, 's05-01', 'huésped') - 2);
  const answer = progress(frame, answerAt, 10);
  const nowIn = answer * (1 - progress(frame, wordFrame(S, 's05-02', 'cola') - 6, 12, EASE.inOut));
  const lineOut = progress(frame, noteAt - 4, 14, EASE.inOut);

  // ---- B: the costs -------------------------------------------------------------------------------
  const colaAt = Math.max(costsAt + 8, wordFrame(S, 's05-02', 'cola') - 6);
  const saturaAt = wordFrame(S, 's05-02', 'policía') - 4;
  const costAt = [colaAt, saturaAt, wordFrame(S, 's05-02', 'satura') + 10];
  const queueIn = (i: number) => progress(frame, colaAt - 4 + i * 5, 14) * (1 - progress(frame, noteAt - 6, 14, EASE.inOut));
  const busy = progress(frame, saturaAt, 20) * (1 - progress(frame, noteAt - 6, 14, EASE.inOut));
  const costsOut = progress(frame, noteAt - 8, 14, EASE.inOut);

  // ---- C: OCSP ------------------------------------------------------------------------------------
  const ocspOut = progress(frame, noteAt - 6, 14, EASE.inOut);

  // ---- D: the receipt -----------------------------------------------------------------------------
  const receiptAt = wordFrame(S, 's05-03', 'justificante') - 6;
  const selladoAt = wordFrame(S, 's05-03', 'sellado') - 2;
  const mananaAt = wordFrame(S, 's05-03', 'mañana') - 2;
  const receipt = progress(frame, receiptAt, 16, EASE.inOut);
  const sealP = progress(frame, selladoAt, 8, EASE.out);
  const staple = progress(frame, mananaAt, 8, EASE.out);
  const lookAt = Math.min(mananaAt + 14, s4.from - 8);
  const look = progress(frame, lookAt, 12);
  const sealCheck = progress(frame, lookAt + 8, 10);
  const noteIn = [receiptAt + 2, selladoAt, wordFrame(S, 's05-03', 'esta') - 4].map((a) => progress(frame, a, 12));
  const noteOut = progress(frame, s4.from - 2, 14, EASE.inOut);

  // ---- E: the portal does the same ----------------------------------------------------------------
  const shrink = progress(frame, s4.from - 4, 22, EASE.inOut);
  const portalAt = wordFrame(S, 's05-04', 'portal') - 4;
  const cardIn = progress(frame, portalAt, 16);
  const grapadaAt = wordFrame(S, 's05-04', 'grapada') - 4;
  const slipIn = progress(frame, grapadaAt - 6, 14);
  const slipSeal = progress(frame, wordFrame(S, 's05-04', 'CA') - 4, 8, EASE.out);
  const slipStaple = progress(frame, grapadaAt + 6, 8, EASE.out);
  const signedE = [progress(frame, wordFrame(S, 's05-04', 'CA') - 2, 12), progress(frame, grapadaAt + 4, 12)];
  const staplingTermAt = Math.max(staplingAt + 4, wordFrame(S, 's05-04', 'OCSP') - 6);
  // E stays up to the end of s05-04 («Lo llaman OCSP stapling»); the console comes in on `before`.
  const consoleAt = Math.min(beforeAt - 8, s4.to - 4);
  const eOut = progress(frame, consoleAt - 10, 10, EASE.inOut);

  // ---- F–I: the console ---------------------------------------------------------------------------
  const conIn = progress(frame, consoleAt, 12);
  const swap = progress(frame, improvementAt - 2, 10, EASE.inOut);
  const ningunaAt = wordFrame(S, 's05-05', 'ninguna') - 10;
  const noRespAt = Math.max(consoleAt + 20, Math.min(beforeAt + 12, ningunaAt));
  const noResp: MonoToken[] = [
    { t: 'OCSP response: ', c: C.text },
    { t: 'no response sent', c: '#fcd34d', bg: alpha(C.amber, 0.16), bold: true },
  ];
  const linesBefore: TerminalLine[] = [
    { kind: 'cmd', at: consoleAt + 2, promptAt: consoleAt, cps: 320, text: CMD },
    { kind: 'out', at: consoleAt + 12, text: BEFORE.texture, color: C.faint },
    { kind: 'gap', at: consoleAt + 12, height: 14 },
    { kind: 'out', at: noRespAt, text: noResp, focus: [noRespAt, improvementAt + 10] },
  ];
  const datesAt = Math.max(goodAt + 18, wordFrame(S, 's05-05', 'good') + 6);
  const respuestaAt = wordFrame(S, 's05-06', 'respuesta') - 4;
  const goodTokens: MonoToken[] = [
    { t: '    Cert Status: ', c: C.text },
    { t: 'good', c: '#6ee7b7', bg: alpha(C.emerald, 0.18), bold: true },
  ];
  const linesAfter: TerminalLine[] = [
    { kind: 'cmd', at: improvementAt + 2, promptAt: improvementAt, cps: 900, text: CMD },
    { kind: 'gap', at: afterAt, height: SLIP_GAP },
    ...AFTER.header.map((t, i): TerminalLine => ({ kind: 'out', at: afterAt + i * 2, text: t, color: C.faint })),
    { kind: 'out', at: afterAt + 6, text: AFTER.status, color: C.text },
    { kind: 'gap', at: afterAt + 8, height: 16 },
    { kind: 'out', at: afterAt + 10, text: goodTokens, focus: [goodAt - 2, datesAt] },
    { kind: 'out', at: afterAt + 12, text: AFTER.thisUpdate, color: C.text, focus: [datesAt, respuestaAt] },
    { kind: 'out', at: afterAt + 14, text: AFTER.nextUpdate, color: C.text, focus: [datesAt, respuestaAt] },
  ];
  const rows = terminalRows(linesAfter, frame, { size: CMD_SIZE });
  const freshIn = [0, 1, 2].map((i) => progress(frame, datesAt + 2 + i * 10, 12));
  const frescaAt = wordFrame(S, 's05-06', 'fresca') - 4;
  const freshPulse = progress(frame, frescaAt, 10) * (1 - progress(frame, frescaAt + 30, 16));
  const firmadaAt = wordFrame(S, 's05-06', 'firmada') - 4;
  const bracket = progress(frame, afterAt, 12);
  const bracketGlow = progress(frame, respuestaAt, 12);
  const consoleSeal = progress(frame, Math.min(respuestaAt + 6, firmadaAt - 10), 8, EASE.out);
  const consoleCheck = progress(frame, firmadaAt, 10);
  const consoleStaple = progress(frame, afterAt + 4, 8, EASE.out);
  const signedIn = [progress(frame, respuestaAt + 8, 12), progress(frame, firmadaAt - 2, 12)];
  const goodGlow = progress(frame, goodAt - 2, 10) * (1 - 0.5 * progress(frame, datesAt, 14));

  // ---- Places -------------------------------------------------------------------------------------
  const pol = HOTEL_POS.police;
  const rec = HOTEL_POS.reception;
  const polH = policeSize(pol.w).h;
  const recH = receptionSize(rec.w).h;
  const gH = guestSize(GUEST.w).h;
  const floor = rec.y + recH;
  const guestY = floor - gH;
  const guestX = mix(GUEST.x - 150, GUEST.x, walk);
  const hand = guestHand(GUEST.w);
  const pairL = stapledPairLayout(PAIR_DNI_W);
  const pairPos = { x: guestX + hand.x - 12, y: guestY + hand.y - pairL.dni.y - pairL.dni.h / 2 };
  const recPhone = receptionPhone(rec.w);
  const polPhone = policePhone(pol.w);
  const callA = { x: rec.x + recPhone.x - 10, y: rec.y + recPhone.y };
  const callB = { x: pol.x + polPhone.x + 10, y: pol.y + polPhone.y + 6 };
  const callCurve: [typeof callA, typeof callA, typeof callA, typeof callA] = [
    callA,
    { x: mix(callA.x, callB.x, 0.25), y: 150 },
    { x: mix(callA.x, callB.x, 0.75), y: 150 },
    callB,
  ];
  // Answer pulse: a dot running back from the police to reception.
  const ansT = progress(frame, answerAt - 16, 16, EASE.inOut);
  const ansDot = cubicAt(callCurve, 1 - ansT);
  // The receptionist's look at the seal (D).
  const j = pairL.receipt;
  const sealC = { x: pairPos.x + j.x + j.w * 0.66, y: pairPos.y + j.y + justificanteSize(j.w).h - j.w * 0.5 * 0.52 };
  const eye = { x: rec.x + rec.w * (102 / 220), y: rec.y + rec.w * (40 / 220) };

  const hotelGroup = {
    transform: `translate(${mix(0, SHRINK.x, shrink)}px, ${mix(0, SHRINK.y, shrink)}px) scale(${mix(1, SHRINK.k, shrink)})`,
    transformOrigin: '0 0',
  } as const;

  return (
    <Stage>
      {/* ================= A–E: the hotel (shrinks to the left in E, gone for the console) ================= */}
      {eOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: hotelIn * (1 - eOut), ...hotelGroup }}>
          {/* The call (OCSP): reception phones the police */}
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
            {lineDraw > 0.001 && lineOut < 1 ? (
              <Connector curve={callCurve} color={C.sky} width={5} draw={lineDraw} flow={lineDraw >= 1 ? frame / fps : undefined} opacity={1 - lineOut} />
            ) : null}
            {answer > 0.001 && ansT < 1 && lineOut < 1 ? <circle cx={ansDot.x} cy={ansDot.y} r={11} fill={C.emerald} opacity={Math.min(1, ansT * 3)} /> : null}
            {/* Reception's look at the seal */}
            {look > 0.001 ? (
              <line x1={eye.x - 20} y1={eye.y + 6} x2={sealC.x + 34} y2={sealC.y - 10} stroke={alpha(C.emerald, 0.8)} strokeWidth={4} strokeDasharray="8 8" opacity={look * (1 - shrink)} />
            ) : null}
          </svg>

          <div style={{ position: 'absolute', left: pol.x, top: pol.y }}>
            <Police width={pol.w} ring={ring} busy={busy} glow={0.35 * ring * (1 - busy)} />
          </div>
          <Caption x={pol.x + pol.w / 2} y={pol.y + polH + 10} show={1} size={40} color={HOTEL_TEXT.police}>
            {HOTEL.police}
          </Caption>

          <div style={{ position: 'absolute', left: rec.x, top: rec.y }}>
            <Reception width={rec.w} phone={phone} check={Math.max(answer * (1 - lineOut), sealCheck)} />
          </div>
          <Caption x={rec.x + rec.w / 2} y={rec.y + recH + 10} show={1} size={40} color={HOTEL_TEXT.reception}>
            {HOTEL.reception}
          </Caption>
          <Caption x={rec.x + rec.w / 2} y={rec.y + recH + 60} show={look * (1 - shrink)} size={32} color={C.text} weight={700}>
            {SEAL_ONLY}
          </Caption>

          {/* The queue behind the first guest */}
          {QUEUE_X.map((x, i) => {
            const p = queueIn(i);
            if (p <= 0.001) return null;
            return (
              <div key={x} style={{ position: 'absolute', left: x, top: guestY, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
                <Guest width={GUEST.w} dim={0.7} />
              </div>
            );
          })}

          {/* The guest, with the DNI (and later the receipt stapled to it) */}
          {walk > 0.001 ? (
            <>
              <div style={{ position: 'absolute', left: guestX, top: guestY, opacity: walk }}>
                <Guest width={GUEST.w} />
              </div>
              <div style={{ position: 'absolute', left: pairPos.x, top: pairPos.y, opacity: walk }}>
                <StapledPair
                  width={PAIR_DNI_W}
                  receipt={receipt}
                  staple={staple}
                  glow={0.4 * sealCheck * (1 - shrink)}
                  seal={(size) => <CaSeal size={size} press={sealP} verdict="ok" check={sealCheck} />}
                />
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {/* «la otra dirección»: the OCSP URL from s04's console */}
      {urlIn * (1 - urlOut) > 0.001 ? (
        <div style={{ position: 'absolute', left: W / 2, top: 6, transform: `translateX(-50%) translateY(${(1 - urlIn) * -10}px)`, opacity: urlIn * (1 - urlOut) }}>
          <span
            style={{
              display: 'inline-block',
              padding: '10px 26px',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.sky, 0.7)}`,
              background: alpha(C.ink900, 0.94),
              boxShadow: `0 0 26px ${alpha(C.sky, 0.25)}`,
              fontFamily: FONT.mono,
              fontSize: 34,
              fontWeight: 700,
              color: '#7dd3fc',
              whiteSpace: 'pre',
            }}
          >
            {OCSP_URL.trim()}
          </span>
        </div>
      ) : null}
      <Caption x={(callA.x + callB.x) / 2} y={192} show={nowIn} size={38} color={HOTEL_TEXT.reception}>
        {NOW}
      </Caption>

      {/* The three costs */}
      {frame >= costAt[0] - 2 && costsOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 520, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 1 - costsOut }}>
          <div style={{ display: 'flex', gap: 22 }}>
            {[0, 1].map((i) => {
              const p = progress(frame, costAt[i], 12);
              return (
                <span key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
                  <FactChip icon={i === 0 ? 'clock' : 'alert'} tone="amber" size={34}>
                    {COSTS[i]}
                  </FactChip>
                </span>
              );
            })}
          </div>
          <span style={{ opacity: progress(frame, costAt[2], 12), transform: `translateY(${(1 - progress(frame, costAt[2], 12)) * 12}px)` }}>
            <FactChip icon="eye" tone="amber" size={34}>
              {COSTS[2]}
            </FactChip>
          </span>
        </div>
      ) : null}

      {/* OCSP */}
      {ocspOut < 1 ? (
        <div style={{ position: 'absolute', left: W / 2, top: 0, transform: 'translateX(-50%)', opacity: 1 - ocspOut }}>
          <TermTag frame={frame} fps={fps} at={ocspTermAt} term={OCSP.term} sub={OCSP.sub} subAt={ocspTermAt + 10} />
        </div>
      ) : null}

      {/* D: the receipt, said in three parts */}
      {noteIn[0] * (1 - noteOut) > 0.001 ? (
        <div style={{ position: 'absolute', left: W / 2, top: 590, transform: 'translateX(-50%)', display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: 1 - noteOut }}>
          {NOTE.map((t, i) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 18, opacity: noteIn[i], transform: `translateY(${(1 - noteIn[i]) * 10}px)` }}>
              {i > 0 ? <span style={{ fontSize: 42, fontWeight: 800, color: C.faint }}>·</span> : null}
              <span style={{ fontSize: 42, fontWeight: 800, color: i === 0 ? C.textStrong : '#7dd3fc' }}>{t}</span>
            </span>
          ))}
        </div>
      ) : null}

      {/* ================= E: the portal does the same ================= */}
      {cardIn * (1 - eOut) > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - eOut }}>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
            <Connector
              curve={[
                { x: SHRINK.x + (pairPos.x + pairL.w) * SHRINK.k + 10, y: SHRINK.y + (pairPos.y + pairL.h / 2) * SHRINK.k },
                { x: 760, y: 300 },
                { x: CARD.x - 100, y: CARD.y + 80 },
                { x: CARD.x - 12, y: CARD.y + 80 },
              ]}
              color={C.cyan}
              width={4}
              draw={cardIn}
              dashed
              opacity={0.8 * cardIn}
            />
          </svg>
          <div style={{ position: 'absolute', left: CARD.x, top: CARD.y, opacity: cardIn, transform: `translateX(${(1 - cardIn) * 24}px)` }}>
            <PortalCard glow={0.3} />
          </div>
          {slipIn > 0.001 ? (
            <div style={{ position: 'absolute', left: SLIP.x, top: SLIP.y, opacity: slipIn, transform: `translateY(${(1 - slipIn) * -20}px) rotate(${2 * slipIn}deg)` }}>
              <Justificante width={SLIP.w} title={PORTAL.response} glow={0.35 * slipSeal} seal={(size) => <CaSeal size={size} press={slipSeal} />} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: SLIP_STAPLE.x, top: SLIP_STAPLE.y }}>
            <Staple size={SLIP_STAPLE.w} press={slipStaple} />
          </div>
          <div style={{ position: 'absolute', left: CARD.x, top: CARD.y + PORTAL_CARD.h + 30, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#7dd3fc', opacity: signedE[0], transform: `translateY(${(1 - signedE[0]) * 10}px)` }}>{SIGNED[0]}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: C.cyanSoft, opacity: signedE[1], transform: `translateY(${(1 - signedE[1]) * 10}px)` }}>{SIGNED[1]}</div>
          </div>
          <div style={{ position: 'absolute', left: CARD.x, top: 506 }}>
            <TermTag frame={frame} fps={fps} at={staplingTermAt} term={STAPLING.term} align="left" size={54} />
          </div>
        </div>
      ) : null}

      {/* ================= F–I: the console ================= */}
      {conIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: conIn }}>
          {/* The change, as a strip above the console */}
          <div style={{ position: 'absolute', left: CON.x, top: 0 }}>
            <EventStrip text={IMPROVEMENT} show={progress(frame, improvementAt - 2, 12)} />
          </div>

          {/* Tuesday: no stapled response */}
          {swap < 1 ? (
            <div style={{ position: 'absolute', left: CON.x, top: CON.y, opacity: 1 - swap }}>
              <Terminal title={CONSOLE_TITLE} right={<StampChip text={DAY_BEFORE} />} lines={linesBefore} width={CON_W} size={CMD_SIZE} outSize={CONSOLE.outSize} focusScale={CONSOLE.focusScale} />
            </div>
          ) : null}

          {/* Thursday: the stapled response */}
          {swap > 0.001 ? (
            <div style={{ position: 'absolute', left: CON.x, top: CON.y, opacity: swap }}>
              <Terminal title={CONSOLE_TITLE} right={<StampChip text={DAY_AFTER} />} lines={linesAfter} width={CON_W} size={CMD_SIZE} outSize={CONSOLE.outSize} focusScale={CONSOLE.focusScale} glow={0.3 * goodGlow} />
              <ResponseSlip rows={rows} show={bracket} glow={bracketGlow} seal={consoleSeal} check={consoleCheck} staple={consoleStaple} />
            </div>
          ) : null}

          {/* Where to look: the two dates */}
          {[rows[ROW.thisUpdate], rows[ROW.nextUpdate]].map((r, i) =>
            r ? (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: COL_X,
                  top: CON.y + r.top + r.h / 2 - 22,
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 800,
                  color: i === 0 ? '#6ee7b7' : C.textStrong,
                  whiteSpace: 'nowrap',
                  opacity: freshIn[i] * swap,
                  transform: `translateX(${(1 - freshIn[i]) * 12}px)`,
                  textShadow: freshPulse > 0.01 ? `0 0 ${Math.round(16 * freshPulse)}px ${alpha(C.emerald, 0.7)}` : undefined,
                }}
              >
                {FRESH[i]}
              </div>
            ) : null,
          )}
          {rows[ROW.nextUpdate] ? (
            <div
              style={{
                position: 'absolute',
                left: COL_X,
                top: CON.y + rows[ROW.nextUpdate]!.top + rows[ROW.nextUpdate]!.h + 6,
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 750,
                color: C.text,
                whiteSpace: 'nowrap',
                opacity: freshIn[2] * swap,
                transform: `translateX(${(1 - freshIn[2]) * 12}px)`,
              }}
            >
              {FRESH[2]}
            </div>
          ) : null}

          {/* The CA signs it, the portal brings it */}
          {signedIn[0] > 0.001 ? (
            <div style={{ position: 'absolute', left: COL_X, top: CON.y + (rows[ROW.first + 1]?.top ?? 200), fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.2, color: '#7dd3fc', opacity: signedIn[0], transform: `translateX(${(1 - signedIn[0]) * 12}px)` }}>{SIGNED[0]}</div>
              <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.25, color: C.cyanSoft, opacity: signedIn[1], transform: `translateX(${(1 - signedIn[1]) * 12}px)` }}>{SIGNED[1]}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** Point on a cubic curve (the answer's dot). */
function cubicAt([p0, p1, p2, p3]: { x: number; y: number }[], t: number) {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

/**
 * The stapled response inside the console: a dashed sky outline around OpenSSL's `OCSP response:` block
 * (rows 1–8), a drawn staple across its top-left corner and the CA's seal in the blank space at its right.
 */
function ResponseSlip({
  rows,
  show,
  glow,
  seal,
  check,
  staple,
}: {
  rows: ({ top: number; h: number } | null)[];
  show: number;
  glow: number;
  seal: number;
  check: number;
  staple: number;
}) {
  const first = rows[ROW.first];
  const last = rows[ROW.nextUpdate];
  if (!first || !last || show <= 0.001) return null;
  const top = first.top - 8;
  const bottom = last.top + last.h + 6;
  const left = 14;
  const right = CON_W - 16;
  const g = clamp01(glow);
  const sealSize = 132;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: right - left,
          height: bottom - top,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px dashed ${alpha(C.sky, 0.45 + 0.45 * g)}`,
          background: alpha(C.sky, 0.03 + 0.04 * g),
          boxShadow: g > 0.02 ? `0 0 ${Math.round(28 * g)}px ${alpha(C.sky, 0.25 * g)}` : undefined,
          opacity: show,
        }}
      />
      <div style={{ position: 'absolute', left: right - sealSize - 40, top: top + 24 }}>
        <CaSeal size={sealSize} press={seal} verdict="ok" check={check} glow={0.3 * g} />
      </div>
      {/* The staple across the slip's top border, in the gap under the command (no text there) */}
      <div style={{ position: 'absolute', left: right - 300, top: top - 16, transform: 'rotate(-6deg)' }}>
        <Staple size={80} press={staple} />
      </div>
    </>
  );
}
