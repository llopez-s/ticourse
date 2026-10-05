import { useCurrentFrame, useVideoConfig } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Connector, Stamp, Terminal, mix, type TerminalLine } from '../../../engine/src/ui';
import { CERT_CARD, CertCard, GhostCert, QUESTION_CARD, QuestionCard } from './parts/s04-revocar/Cert';
import { CONSOLE, StampChip } from './parts/s04-revocar/Console';
import { HOTEL_POS } from './parts/s04-revocar/places';
import { Caption, FactChip, ShipBadge, TermTag } from './parts/s04-revocar/Marks';
import { CaSeal } from './parts/CaSeal';
import { DniCard, HOTEL_TEXT, Police, Reception, StolenList, dniSize, policeSize, receptionSize } from './parts/Hotel';
import { CRL, EXT, GHOST_TAG, HOTEL, MONTHS, PRETEND, REASONS, REVOKE, REVOKED, WHERE } from '../data/s04-revocar';
import { TIMELINE } from '../timeline/load';
import { Stage, wordFrame } from './kit';

const S = 's04-revocar';
const W = 1728;

// ---- A: the question and the certificate ---------------------------------------------------------
const Q_POS = { x: (W - (QUESTION_CARD.badge + QUESTION_CARD.gap + QUESTION_CARD.width)) / 2, y: 22 } as const;
const CERT_A = { x: (W - CERT_CARD.w) / 2, y: 300 } as const;
// ---- B–D: everything at y ≥ 236 while NULL CIPHER's card is up (stage-local y ≈ 10–200) ----------
const CERT_B = { x: 40, y: 236 } as const;
const GHOST = { x: 928, y: 236 } as const;
const REASONS_X = 880;
const ROW2_Y = CERT_B.y + CERT_CARD.h + 22;
const ROW3_Y = 552;
// ---- E: the console --------------------------------------------------------------------------------
const CON_W = 1290;
const CON = { x: (W - CON_W) / 2, y: 120 } as const;
// ---- F–G: the hotel (s05 starts from the same places) ----------------------------------------------
const LIST = { x: 1012, y: 198, w: 280 } as const;
const DNI = { x: 548, y: 440, w: 190 } as const;
const TERM_Y = 0;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/**
 * s04-revocar «¿Sigue valiendo?». The shipping company's second question over the portal's real
 * certificate; the lesson's two reasons. NULL CIPHER's card types out at the top while everything sits
 * low (y ≥ 236). «¿Esperar a que caduque?»: s02's `NotAfter` lights, «faltan más de seis meses»; a dashed,
 * dimmed ghost of the certificate («si se filtrara la clave»), and REVOKE lands on the ghost only (sfx
 * «block» on `revoke`), never on the real card beside it. «nadie avisa · lo comprueba el cliente». The
 * certificate's two URLs in `openssl x509 -ext` (sky). Then the hotel: the police (= the CA) and
 * reception (= the client), which collects the list of stolen DNI once a day; a DNI stolen this
 * morning is not on today's list. The police's seal (the CA's) lands on the list: CRL.
 */
export function S04Revocar(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionAt = props.cue('question');
  const reasonsAt = props.cue('reasons');
  const waitAt = props.cue('wait');
  const monthsAt = props.cue('months');
  const pretendAt = props.cue('pretend');
  const revokeAt = props.cue('revoke');
  const whereAt = props.cue('where');
  const crlUrlAt = props.cue('crl-url');
  const hotelAt = props.cue('hotel');
  const listAt = props.cue('list');
  const crlAt = props.cue('crl');
  const ic = interceptWindow();

  // ---- A ------------------------------------------------------------------------------------------
  // On screen from the first frame (the cut from s03 cross-fades into it).
  const qIn = progress(frame, 0, 14);
  const certIn = progress(frame, Math.min(questionAt, 8), 16);
  const certWord = wordFrame(S, 's04-01', 'certificado');
  const certGlowA = progress(frame, certWord - 4, 10) * (1 - progress(frame, reasonsAt, 14));
  // The question leaves before NULL CIPHER's card arrives (at the latest by the intercept's start).
  const qOut = progress(frame, Math.min(reasonsAt + 4, ic.from - 24), 16, EASE.inOut);
  const toB = progress(frame, Math.min(reasonsAt, ic.from - 30), 20, EASE.inOut);

  // ---- B: the two reasons -------------------------------------------------------------------------
  const leadIn = progress(frame, reasonsAt - 2, 14);
  const reasonAt = [wordFrame(S, 's04-02', 'filtra') - 4, wordFrame(S, 's04-02', 'dominio') - 4];
  const reasonsOut = progress(frame, waitAt + 6, 14, EASE.inOut);

  // ---- C: wait, months, pretend -------------------------------------------------------------------
  const notAfterLit = progress(frame, wordFrame(S, 's04-03', 'caduque') - 6, 10) * (1 - 0.5 * progress(frame, revokeAt, 14));
  const monthsIn = progress(frame, monthsAt - 2, 12) * (1 - progress(frame, revokeAt + 4, 14, EASE.inOut));
  const ghostIn = progress(frame, pretendAt - 4, 18, EASE.inOut);
  const pretendIn = progress(frame, pretendAt, 14) * (1 - progress(frame, revokeAt - 6, 10, EASE.inOut));

  // ---- D: REVOKE on the ghost; nobody warns -------------------------------------------------------
  const revokedIn = progress(frame, revokeAt + 4, 14);
  const newKeyIn = progress(frame, wordFrame(S, 's04-04', 'otro') - 4, 12);
  const whereIn = progress(frame, Math.max(whereAt - 2, ic.to + 2), 14);
  const whereSub = progress(frame, wordFrame(S, 's04-04', 'comprueba') - 6, 12);

  // ---- E: the console -----------------------------------------------------------------------------
  const consoleAt = crlUrlAt - 30;
  const bdOut = progress(frame, consoleAt - 8, 14, EASE.inOut);
  const dosAt = wordFrame(S, 's04-04', 'dos') - 2;
  const listaAt = wordFrame(S, 's04-05', 'lista') - 4;
  const consoleOut = progress(frame, hotelAt - 14, 14, EASE.inOut);
  const lines: TerminalLine[] = [
    { kind: 'cmd', at: consoleAt + 6, promptAt: consoleAt, cps: 110, text: EXT.cmd },
    ...EXT.lines.map((t, i): TerminalLine => {
      const isUrl = i === EXT.crl || i === EXT.ocsp;
      return {
        kind: 'out',
        at: crlUrlAt + 4 + i * 3,
        text: t,
        color: isUrl ? C.sky : C.muted,
        focus: i === EXT.crl ? [dosAt, hotelAt] : i === EXT.ocsp ? [dosAt, listaAt] : undefined,
      };
    }),
  ];
  const urlGlow = progress(frame, dosAt - 2, 10);

  // ---- F: the hotel -------------------------------------------------------------------------------
  const receptionIn = progress(frame, hotelAt - 6, 16);
  const policeIn = progress(frame, hotelAt + 2, 16);
  const diaAt = wordFrame(S, 's04-05', 'día');
  const travel = progress(frame, hotelAt + 12, Math.max(18, diaAt + 6 - (hotelAt + 12)), EASE.inOut);
  const dailyIn = progress(frame, diaAt - 10, 12);
  const listGlow = progress(frame, listAt - 2, 10) * (1 - progress(frame, listAt + 40, 16));
  const robanAt = wordFrame(S, 's04-05', 'roban') - 6;
  const saleAt = wordFrame(S, 's04-05', 'sale') - 4;
  const dniIn = progress(frame, robanAt, 14);
  const stolen = progress(frame, robanAt + 8, 10);
  const pending = progress(frame, saleAt, 14);
  const lagIn = progress(frame, saleAt + 2, 14);

  // ---- G: CRL -------------------------------------------------------------------------------------
  const sealPress = progress(frame, wordFrame(S, 's04-06', 'firmada') - 2, 8, EASE.out);
  const crlTermAt = wordFrame(S, 's04-06', 'CRL') - 6;
  const mapIn = progress(frame, crlAt + 6, 14);
  const tardeAt = wordFrame(S, 's04-06', 'tarde') - 6;
  const lagPulse = progress(frame, tardeAt, 10) * (1 - progress(frame, tardeAt + 40, 20));

  // ---- Places -------------------------------------------------------------------------------------
  const cert = { x: mix(CERT_A.x, CERT_B.x, toB), y: mix(CERT_A.y, CERT_B.y, toB) };
  const ghostX = mix(CERT_B.x + 40, GHOST.x, ghostIn);
  const ghostCx = GHOST.x + CERT_CARD.w / 2;
  const ghostCy = GHOST.y + CERT_CARD.h / 2;

  const pol = HOTEL_POS.police;
  const rec = HOTEL_POS.reception;
  const polH = policeSize(pol.w).h;
  const recH = receptionSize(rec.w).h;
  // Centre of the list's dashed amber slot (StolenList: rows from 22u, 14u each; u = width / 100).
  const pendingY = LIST.y + (LIST.w / 100) * (22 + 4 * 14 + 7);
  // The list flies from the police station to its place beside reception, growing as it goes.
  const listFrom = { x: pol.x + pol.w * 0.55, y: pol.y + polH * 0.35, s: 0.3 };
  const listS = mix(listFrom.s, 1, travel);
  const listX = mix(listFrom.x, LIST.x, travel);
  const listY = mix(listFrom.y, LIST.y, travel) - Math.sin(Math.PI * travel) * 60;
  const pathA = { x: pol.x + pol.w - 10, y: pol.y + polH * 0.42 };
  const pathB = { x: LIST.x - 14, y: LIST.y + 110 };
  const dni = dniSize(DNI.w);

  return (
    <Stage>
      {/* ================= A: the question ================= */}
      {qIn * (1 - qOut) > 0.001 ? (
        <div style={{ position: 'absolute', left: Q_POS.x, top: Q_POS.y, opacity: qIn * (1 - qOut), transform: `translateY(${(1 - qIn) * 14 - qOut * 10}px)` }}>
          <QuestionCard glow={progress(frame, questionAt, 12) * (1 - qOut) * 0.6} />
        </div>
      ) : null}

      {/* ================= A–D: the real certificate (never stamped) ================= */}
      {certIn * (1 - bdOut) > 0.001 ? (
        <div style={{ position: 'absolute', left: cert.x, top: cert.y, opacity: certIn * (1 - bdOut), transform: `translateY(${(1 - certIn) * 14}px)` }}>
          <CertCard glow={Math.max(certGlowA, 0.25 * notAfterLit)} notAfterLit={notAfterLit} />
        </div>
      ) : null}

      {/* ================= B: the lesson's two reasons ================= */}
      {leadIn * (1 - reasonsOut) > 0.001 ? (
        <div style={{ position: 'absolute', left: REASONS_X, top: CERT_B.y + 4, opacity: leadIn * (1 - reasonsOut), transform: `translateY(${(1 - leadIn) * 12}px)`, fontFamily: FONT.sans }}>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
            {REASONS.lead.split(' ').slice(0, 6).join(' ')}
            <br />
            {REASONS.lead.split(' ').slice(6).join(' ')}
          </div>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
            {REASONS.items.map((r, i) => {
              const p = progress(frame, reasonAt[i], 12);
              return (
                <span key={r} style={{ opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
                  <FactChip icon={i === 0 ? 'key' : 'globe'} tone="#cbd5e1" size={38}>
                    {r}
                  </FactChip>
                </span>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ================= C: «faltan más de seis meses» ================= */}
      {monthsIn * (1 - bdOut) > 0.001 ? (
        <div style={{ position: 'absolute', left: CERT_B.x + 24, top: ROW2_Y, opacity: monthsIn * (1 - bdOut), transform: `translateY(${(1 - monthsIn) * 10}px)` }}>
          <FactChip icon="clock" tone="amber" size={38} glow={0.4}>
            {MONTHS}
          </FactChip>
        </div>
      ) : null}

      {/* ================= C–D: the ghost copy, and REVOKE on it ================= */}
      {ghostIn * (1 - bdOut) > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - bdOut }}>
          <div style={{ position: 'absolute', left: ghostX, top: GHOST.y }}>
            <GhostCert show={ghostIn} />
          </div>
          <div style={{ position: 'absolute', left: ghostCx, top: ROW2_Y, transform: 'translateX(-50%)', opacity: ghostIn }}>
            <FactChip tone="muted" size={34} dashed>
              {GHOST_TAG}
            </FactChip>
          </div>
          <div style={{ position: 'absolute', left: ghostCx, top: ghostCy, transform: 'translate(-50%, -50%)' }}>
            <Stamp frame={frame} at={revokeAt} accent="rose" rotate={-9} size={72}>
              {REVOKE}
            </Stamp>
          </div>
        </div>
      ) : null}
      <Caption x={W / 2} y={ROW3_Y} show={pretendIn * (1 - bdOut)} size={38} weight={750}>
        {PRETEND[0]}
        <br />
        {PRETEND[1]}
      </Caption>
      {revokedIn * (1 - bdOut) > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: W / 2,
            top: ROW3_Y - 12,
            transform: `translateX(-50%) translateY(${(1 - revokedIn) * 10}px)`,
            opacity: revokedIn * (1 - bdOut),
            textAlign: 'center',
            fontFamily: FONT.sans,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontSize: 50, fontWeight: 850, lineHeight: 1.15, color: C.textStrong }}>{REVOKED[0]}</div>
          <div style={{ fontSize: 40, fontWeight: 750, lineHeight: 1.25, color: C.text, opacity: newKeyIn, transform: `translateY(${(1 - newKeyIn) * 8}px)` }}>{REVOKED[1]}</div>
        </div>
      ) : null}

      {/* ================= D: nobody warns, the client checks (top, once the card has gone) ================= */}
      {whereIn * (1 - bdOut) > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: W / 2,
            top: 18,
            transform: `translateX(-50%) translateY(${(1 - whereIn) * 12}px)`,
            opacity: whereIn * (1 - bdOut),
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            fontFamily: FONT.sans,
            whiteSpace: 'nowrap',
          }}
        >
          <ShipBadge size={120} glow={0.4 * whereSub} />
          <div>
            <div style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, lineHeight: 1.15 }}>{WHERE[0]}</div>
            <div style={{ fontSize: 46, fontWeight: 800, color: HOTEL_TEXT.reception, lineHeight: 1.2, opacity: whereSub }}>{WHERE[1]}</div>
          </div>
        </div>
      ) : null}

      {/* ================= E: the certificate's two addresses ================= */}
      {frame >= consoleAt - 2 && consoleOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - consoleOut, transform: `translateY(${-consoleOut * 16}px)` }}>
          <div style={{ position: 'absolute', left: CON.x, top: CON.y }}>
            <Terminal
              title={CONSOLE.title}
              accent="cyan"
              right={<StampChip text={EXT.day} />}
              lines={lines}
              width={CON_W}
              size={CONSOLE.size}
              outSize={CONSOLE.outSize}
              focusScale={CONSOLE.focusScale}
              glow={0.25 * urlGlow}
              at={consoleAt - 2}
            />
          </div>
        </div>
      ) : null}

      {/* ================= F–G: the hotel ================= */}
      {receptionIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* The daily round from the police to the list */}
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
            <Connector
              curve={[pathA, { x: mix(pathA.x, pathB.x, 0.3), y: pathA.y - 70 }, { x: mix(pathA.x, pathB.x, 0.7), y: pathB.y - 70 }, pathB]}
              color={C.sky}
              width={4}
              draw={policeIn}
              dashed
              opacity={0.9 * policeIn}
            />
          </svg>
          <Caption x={(pathA.x + pathB.x) / 2} y={pathA.y + 8} show={dailyIn} size={36} color={HOTEL_TEXT.police} weight={800}>
            {HOTEL.daily}
          </Caption>

          <div style={{ position: 'absolute', left: pol.x, top: pol.y, opacity: policeIn, transform: `translateY(${(1 - policeIn) * 14}px)` }}>
            <Police width={pol.w} glow={0.5 * sealPress * (1 - progress(frame, crlTermAt + 30, 20))} />
          </div>
          <Caption x={pol.x + pol.w / 2} y={pol.y + polH + 10} show={policeIn} size={40} color={HOTEL_TEXT.police}>
            {HOTEL.police}
          </Caption>
          <Caption x={pol.x + pol.w / 2} y={pol.y + polH + 60} show={mapIn} size={34} color={C.text} weight={700}>
            {HOTEL.policeIs}
          </Caption>

          <div style={{ position: 'absolute', left: rec.x, top: rec.y, opacity: receptionIn, transform: `translateY(${(1 - receptionIn) * 14}px)` }}>
            <Reception width={rec.w} />
          </div>
          <Caption x={rec.x + rec.w / 2} y={rec.y + recH + 10} show={receptionIn} size={40} color={HOTEL_TEXT.reception}>
            {HOTEL.reception}
          </Caption>
          <Caption x={rec.x + rec.w / 2} y={rec.y + recH + 60} show={mapIn} size={34} color={C.text} weight={700}>
            {HOTEL.receptionIs}
          </Caption>

          {/* The list of stolen DNI (= the CRL) */}
          {travel > 0.001 ? (
            <div style={{ position: 'absolute', left: listX, top: listY, transform: `scale(${listS})`, transformOrigin: '0 0', opacity: Math.min(1, travel * 3) }}>
              <StolenList
                width={LIST.w}
                rows={4}
                tab={HOTEL.listTab}
                pending={pending}
                glow={Math.max(listGlow, 0.5 * sealPress * (1 - progress(frame, crlTermAt + 30, 20)))}
                seal={(size) => <CaSeal size={size} press={sealPress} glow={0.4} />}
              />
            </div>
          ) : null}

          {/* A DNI stolen this morning: not on today's list */}
          {dniIn > 0.001 ? (
            <>
              <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
                <Connector
                  curve={[
                    { x: DNI.x + DNI.w + 8, y: DNI.y + dni.h / 2 },
                    { x: DNI.x + DNI.w + 160, y: DNI.y + dni.h / 2 },
                    { x: LIST.x - 120, y: pendingY },
                    { x: LIST.x - 10, y: pendingY },
                  ]}
                  color={C.amber}
                  width={4}
                  draw={pending}
                  dashed
                  opacity={pending}
                />
              </svg>
              <div style={{ position: 'absolute', left: DNI.x, top: DNI.y, opacity: dniIn, transform: `translateY(${(1 - dniIn) * 12}px)` }}>
                <DniCard width={DNI.w} stolen={stolen} glow={0.3 * stolen + 0.5 * lagPulse} />
              </div>
            </>
          ) : null}
          <Caption x={W / 2 - 60} y={590} show={lagIn} size={38} color="#fcd34d" weight={800} style={{ textShadow: lagPulse > 0.01 ? `0 0 ${Math.round(18 * lagPulse)}px ${alpha(C.amber, 0.6)}` : undefined }}>
            {HOTEL.lag}
          </Caption>

          {/* CRL */}
          <div style={{ position: 'absolute', left: W / 2, top: TERM_Y, transform: 'translateX(-50%)' }}>
            <TermTag frame={frame} fps={fps} at={crlTermAt} term={CRL.term} sub={CRL.sub} subAt={crlTermAt + 10} size={58} subSize={34} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
