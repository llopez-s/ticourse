import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { S04 } from '../data/s04-eap';
import { EntranceGate } from './parts/EntranceGate';
import { ArrowHead, mixHex, polylinePoint } from './parts/glyphs';
import { EapChip, RoleLanes, SwitchPort, roleLanesLayout } from './parts/RoleLanes';
import { BlueprintPanel, ZoneBox } from './parts/ZoneRow';
import { DecisionCard, EapTitle, LaptopTile, MethodCard, QuarantineBox, RadiusTile, RuleLabel, VerdictText } from './parts/s04-eap/Bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's04-eap';
const W = 1728;

// ---- A: the three lanes (left) with EAP travelling in them; EAP and its methods (right column).
const LANES = { x: 0, y: 72, w: 1200, lh: 178, gap: 12 } as const;
const LL = roleLanesLayout({ width: LANES.w, laneHeight: LANES.lh, gap: LANES.gap });
const RCOL = { x: 1236, w: 492 } as const;
const EAP_Y = 0;
const TLS_Y = 196;
const PEAP_Y = 454;

// ---- B: the compound's entrance (EAP-TLS: the office shows its own accreditation).
const GATE = { x: 6, y: 96, w: 1190 } as const;

// ---- C: the two endings, one column each (accept first, centred; it slides left when reject comes).
const COL = { w: 836, top: 70 } as const;
const ACC_X = { solo: Math.round((W - COL.w) / 2), pair: 0 } as const;
const REJ_X = W - COL.w;
/** Column-local geometry, shared by both endings. */
const ROW_CY = 238;
const LAPTOP = { w: 124, h: 99, cx: 62 } as const;
const PORT = { cx: 300, size: 108 } as const;
const RAD = { x: 524, size: 96 } as const;
const DEST_Y = 330;
// Accept: the plan's zones on blueprint paper; the laptop lands in «interna».
const PANEL = { w: COL.w, h: 262 } as const;
const ZB = { w: 254, h: 178, y: 64, xs: [18, 291, 564] } as const;
/** The office laptop's zone first (Oficinas becomes «interna»), then two other zones of V16's plan, in its order. */
const ZONES = ['interna', 'gestion', 'invitados'] as const;
/**
 * Where the laptop lands inside «interna»: right of the confidence pill, which wraps under the name in a
 * 254-px box (so `zoneBoxContent` would put it on the pill).
 */
const IN_SLOT = { x: ZB.xs[0] + 190, y: DEST_Y + ZB.y + 124, scale: 0.7 } as const;
// Reject: the quarantine VLAN under the port (the switch's fallback), not a zone of the plan.
const QBOX = { x: PORT.cx - 270, y: DEST_Y + 12, w: 540, h: 236 } as const;
const Q_SLOT = { x: PORT.cx, y: QBOX.y + 150 } as const;
// D: the proposal under the endings.
const SHRINK = 0.72;
const DECISION_Y = 512;

/**
 * s04-eap «Sí, no o cuarentena». The fixed label «con 802.1X · así será desde el 1-12» stays from the first
 * frame to the last (nothing here runs on 23-11).
 *   eap         the three lanes as s03 left them; the accreditation cards on the arrows turn into «EAP»
 *               and one EAP chip travels down to RADIUS and back; right: EAP «el marco, no el método».
 *   methods     two cards: EAP-TLS «certificado en el equipo y en el servidor» and PEAP · EAP-TTLS
 *               «credenciales dentro de un túnel TLS»; the lanes step back.
 *   eaptls      EAP-TLS in focus, «el más fuerte» on «fuerte»; PEAP steps back. (Exam card, top band.)
 *   s04-03      the compound's entrance: the office holds up its own accreditation and sends it to the
 *               driver (both sides show one); the EAP-TLS card stays.
 *   accept      a column, centred: the port opens (emerald), Access-Accept «puerto abierto»; RADIUS
 *               beside it; under it the plan's zones as plan (interna · OT · gestión, V16's colours).
 *   zone-vlan   «· y la VLAN de su zona»; «VLAN» rides RADIUS's yes into the port and the laptop goes
 *               through the port into «interna».
 *   reject      (block) the column slides left; a second column: a laptop «sin dar de alta», the port
 *               stays shut with a rose cross, Access-Reject «puerto cerrado». RADIUS sends nothing.
 *   quarantine  «· o VLAN de cuarentena, solo para que lo arreglen»; the quarantine box appears under the
 *               port and the laptop falls into it from the port (the switch's fallback).
 *   s04-06      both endings shrink up; the proposal «802.1X en los switches de acceso de la planta de
 *               oficinas / Infraestructura · desde el 1-12» under them.
 *   wrap        the endings come back to full strength; on «decidir» both RADIUS tiles glow. Holds.
 */
export function S04Eap(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const eapAt = props.cue('eap');
  const methodsAt = props.cue('methods');
  const eaptlsAt = props.cue('eaptls');
  const acceptAt = props.cue('accept');
  const zoneVlanAt = props.cue('zone-vlan');
  const rejectAt = props.cue('reject');
  const quarantineAt = props.cue('quarantine');
  const wrapAt = props.cue('wrap');
  const s03 = segment(props, 's04-03');
  const s06 = segment(props, 's04-06');

  const at = {
    marco: w('s04-01', 'marco'),
    eapWord: w('s04-01', 'EAP'),
    fuerte: w('s04-02', 'fuerte'),
    oficina: w('s04-03', 'oficina'),
    ensenara: w('s04-03', 'enseñara'),
    abre: w('s04-04', 'abre'),
    radius: w('s04-04', 'RADIUS'),
    meter: w('s04-04', 'meter'),
    zona: w('s04-04', 'zona'),
    cerrada: w('s04-05', 'cerrada'),
    cae: w('s04-05', 'cae'),
    propones: w('s04-06', 'propones'),
    dentro: w('s04-07', 'dentro'),
    decidir: w('s04-07', 'decidir'),
  };

  // ================= A: lanes + EAP + methods =================
  const aOut = progress(frame, s03.from - 8, 14, EASE.inOut);
  const eapMorph = progress(frame, eapAt, 16);
  // The cards on the arrows become «EAP», step aside while one chip travels, and come back on `methods`.
  const travel = windowWeight(frame, eapAt + 18, methodsAt, { ramp: 10, lead: 0 });
  const tokens = 1 - travel;
  const lanesDim = 0.55 * windowWeight(frame, methodsAt + 4, s03.from, { ramp: 14 });
  const PERIOD = 104;
  const loop = frame < eapAt + 18 ? 0 : ((frame - eapAt - 18) % PERIOD) / PERIOD;
  const down = loop < 0.5;
  const legK = EASE.inOut(down ? loop * 2 : (loop - 0.5) * 2);
  const chip = {
    x: down ? LL.arrows.ask.x : LL.arrows.answer.x,
    y: down ? mix(LL.life.device, LL.life.radius, legK) : mix(LL.life.radius, LL.life.device, legK),
  };
  const chipFade = Math.min(1, loop * 12, (1 - loop) * 12);

  const titleIn = progress(frame, at.marco - 6, 16);
  const titleGlow = windowWeight(frame, at.eapWord - 2, at.eapWord + 34, { ramp: 8 });
  const tlsIn = progress(frame, methodsAt, 16);
  const peapIn = progress(frame, methodsAt + 8, 16);
  const tlsFocus = windowWeight(frame, eaptlsAt, s03.to, { ramp: 12 });
  const peapDim = progress(frame, eaptlsAt, 14);
  const peapOut = progress(frame, s03.from - 6, 14, EASE.inOut);
  const badgeIn = progress(frame, at.fuerte - 4, 12);
  const eapTitleDim = 0.5 * progress(frame, s03.from, 14);
  const rOut = progress(frame, acceptAt - 12, 12, EASE.inOut);

  // ================= B: the entrance gate (EAP-TLS) =================
  const gateIn = progress(frame, s03.from - 2, 16) * (1 - progress(frame, acceptAt - 12, 12, EASE.inOut));
  const officeCard = progress(frame, at.oficina - 8, 16);
  const officeSent = progress(frame, at.ensenara - 4, 40, EASE.inOut);
  const officeFocus = windowWeight(frame, s03.from + 8, acceptAt - 12, { ramp: 12 });

  // ================= C: the two endings =================
  const accIn = progress(frame, acceptAt - 8, 16);
  const slide = progress(frame, rejectAt - 18, 16, EASE.inOut);
  const accX = mix(ACC_X.solo, ACC_X.pair, slide);
  const accDim = 0.5 * windowWeight(frame, rejectAt - 2, s06.from, { ramp: 12 });
  const shrink = progress(frame, s06.from - 4, 22, EASE.inOut);
  const groupScale = mix(1, SHRINK, shrink);
  const bothDim = 0.45 * windowWeight(frame, at.propones - 4, wrapAt, { ramp: 14 });
  const radiusGlow = progress(frame, at.decidir - 6, 14);

  // Accept
  const accTitle = progress(frame, acceptAt + 2, 14);
  const accArrow = progress(frame, acceptAt + 2, 14);
  const portOpen = progress(frame, at.abre - 4, 14);
  const accHead = progress(frame, at.abre - 4, 12);
  const accRest = progress(frame, zoneVlanAt, 14);
  const panelIn = progress(frame, acceptAt + 10, 18);
  const zoneDraw = (i: number) => progress(frame, acceptAt + 14 + i * 7, 22, EASE.inOut);
  const vlanRide = progress(frame, at.radius - 2, 22, EASE.inOut);
  const accMove = progress(frame, at.meter - 4, 46, EASE.inOut);
  const internaFocus = progress(frame, at.zona - 6, 14) * (1 - accDim * 1.2);
  const accPath = [
    { x: LAPTOP.cx, y: ROW_CY },
    { x: PORT.cx, y: ROW_CY },
    { x: PORT.cx, y: DEST_Y + 20 },
    { x: IN_SLOT.x, y: IN_SLOT.y - 40 },
    { x: IN_SLOT.x, y: IN_SLOT.y },
  ];
  const accPos = polylinePoint(accPath, accMove);
  const accScale = mix(1, IN_SLOT.scale, progress(accMove, 0.6, 0.4));

  // Reject
  const rejIn = progress(frame, rejectAt - 12, 14);
  const rejTitle = progress(frame, rejectAt, 10);
  const cross = progress(frame, rejectAt, 8);
  const rejArrow = progress(frame, rejectAt - 4, 12);
  const rejHead = progress(frame, at.cerrada - 4, 12);
  const rejRest = progress(frame, quarantineAt, 14);
  const bump = progress(frame, rejectAt - 6, 6, EASE.out) * (1 - progress(frame, rejectAt + 2, 12, EASE.inOut));
  const qBox = progress(frame, quarantineAt + 2, 16);
  const chute = progress(frame, quarantineAt + 8, 12);
  const toPort = progress(frame, quarantineAt + 10, 16, EASE.inOut);
  const fall = progress(frame, Math.max(at.cae - 2, quarantineAt + 26), 18, EASE.in);
  const landed = progress(frame, Math.max(at.cae - 2, quarantineAt + 26) + 16, 10);
  const rejPos = {
    x: mix(LAPTOP.cx, PORT.cx, toPort) + 34 * bump,
    y: mix(ROW_CY, Q_SLOT.y, fall),
  };
  const rejScale = mix(1, 0.86, fall);
  const tagOut = progress(frame, quarantineAt + 8, 10);

  // ================= D: the proposal =================
  const decisionIn = progress(frame, at.propones - 2, 18);
  const decisionDim = 0.3 * progress(frame, at.dentro - 4, 18);

  // ---- One ending column ------------------------------------------------------------------
  const column = (kind: 'accept' | 'reject') => {
    const yes = kind === 'accept';
    const verdictCol = yes ? C.emerald : C.rose;
    const arrow = yes ? accArrow : rejArrow;
    const portCol = yes ? mixHex(C.amber, C.emerald, portOpen) : mixHex(C.amber, C.rose, cross);
    const radTone = mixHex(C.cyan, verdictCol, arrow);
    const lap = yes ? accPos : rejPos;
    const lapScale = yes ? accScale : rejScale;
    const arrowX0 = RAD.x - 10;
    const arrowX1 = PORT.cx + PORT.size / 2 + 12;
    const vlanX = mix(arrowX0 - 40, arrowX1 + 30, vlanRide);
    const cable = 1 - (yes ? progress(accMove, 0, 0.25) : toPort);
    return (
      <div style={{ position: 'relative', width: COL.w, height: 590 }}>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          {yes ? (
            <VerdictText kind="accept" title={S04.accept.title} head={S04.accept.head} rest={S04.accept.rest} titleShow={accTitle} headShow={accHead} restShow={accRest} width={COL.w} />
          ) : (
            <VerdictText kind="reject" title={S04.reject.title} head={S04.reject.head} rest={S04.reject.rest} titleShow={rejTitle} headShow={rejHead} restShow={rejRest} width={COL.w} />
          )}
        </div>

        {/* Destination: the plan's zones (accept) / the quarantine VLAN (reject) */}
        {yes ? (
          <div style={{ position: 'absolute', left: 0, top: DEST_Y }}>
            <BlueprintPanel width={PANEL.w} height={PANEL.h} draw={panelIn}>
              {ZONES.map((z, i) => (
                <div key={z} style={{ position: 'absolute', left: ZB.xs[i], top: ZB.y }}>
                  <ZoneBox zone={z} width={ZB.w} height={ZB.h} layout="header" draw={zoneDraw(i)} focus={z === 'interna' ? internaFocus : 0} dim={z === 'interna' ? 0 : 0.45 * internaFocus} />
                </div>
              ))}
            </BlueprintPanel>
          </div>
        ) : (
          <div style={{ position: 'absolute', left: QBOX.x, top: QBOX.y }}>
            <QuarantineBox label={S04.quarantine} width={QBOX.w} height={QBOX.h} show={qBox} glow={landed} />
          </div>
        )}

        {/* Cable (laptop to port), RADIUS's answer (to the port), the quarantine chute */}
        <svg width={COL.w} height={590} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line x1={LAPTOP.cx + LAPTOP.w / 2} y1={ROW_CY} x2={PORT.cx - PORT.size / 2 - 4} y2={ROW_CY} stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeDasharray="8 9" opacity={cable} />
          {arrow > 0.01 ? (
            <g>
              <line x1={arrowX0} y1={ROW_CY} x2={mix(arrowX0, arrowX1, arrow)} y2={ROW_CY} stroke={verdictCol} strokeWidth={6} strokeLinecap="round" />
              <ArrowHead x={mix(arrowX0, arrowX1, arrow) - 4} y={ROW_CY} angle={Math.PI} size={22} color={verdictCol} />
            </g>
          ) : null}
          {!yes && chute > 0.01 ? (
            <line x1={PORT.cx} y1={ROW_CY + PORT.size / 2 + 6} x2={PORT.cx} y2={mix(ROW_CY + PORT.size / 2 + 6, QBOX.y + 6, chute)} stroke={C.amber} strokeWidth={5} strokeDasharray="10 9" strokeLinecap="round" />
          ) : null}
        </svg>

        {/* The port (the switch's), RADIUS beside it */}
        <div style={{ position: 'absolute', left: PORT.cx - PORT.size / 2, top: ROW_CY - PORT.size / 2 }}>
          <SwitchPort size={PORT.size} open={yes ? portOpen : 0} color={portCol} cross={yes ? 0 : cross} glow={yes ? 0.4 + 0.6 * portOpen : 0.4 + 0.6 * cross} />
        </div>
        <div style={{ position: 'absolute', left: RAD.x, top: ROW_CY - RAD.size / 2 }}>
          <RadiusTile name={S04.radius} size={RAD.size} tone={radTone} glow={0.25 * arrow + radiusGlow} />
        </div>
        {/* «VLAN» rides the yes into the port */}
        {yes && vlanRide > 0.01 && vlanRide < 0.995 ? (
          <div
            style={{
              position: 'absolute',
              left: vlanX,
              top: ROW_CY - 46,
              transform: 'translate(-50%, -50%)',
              opacity: Math.min(1, vlanRide * 6, (1 - vlanRide) * 6),
              padding: '3px 14px 5px',
              borderRadius: 999,
              border: `2.5px solid ${C.emerald}`,
              background: C.ink900,
              fontFamily: FONT.mono,
              fontSize: 32,
              fontWeight: 820,
              color: '#6ee7b7',
              whiteSpace: 'nowrap',
            }}
          >
            {S04.vlan}
          </div>
        ) : null}

        {/* The laptop (cyan: the port's own; neutral: nobody registered it) */}
        <div style={{ position: 'absolute', left: lap.x - LAPTOP.w / 2, top: lap.y - LAPTOP.h / 2, transform: `scale(${lapScale})` }}>
          <LaptopTile width={LAPTOP.w} tone={yes ? C.cyan : '#cbd5e1'} glow={yes ? 0.6 * internaFocus : 0} />
        </div>
        {!yes ? (
          <div
            style={{
              position: 'absolute',
              left: LAPTOP.cx,
              top: ROW_CY + LAPTOP.h / 2 + 8,
              transform: 'translateX(-50%)',
              fontFamily: FONT.sans,
              fontSize: 32,
              fontWeight: 760,
              color: '#cbd5e1',
              whiteSpace: 'nowrap',
              opacity: 1 - tagOut,
            }}
          >
            {S04.unregistered}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= A ================= */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', left: LANES.x, top: LANES.y, opacity: 1 - aOut }}>
          <RoleLanes
            width={LANES.w}
            laneHeight={LANES.lh}
            gap={LANES.gap}
            closed={1}
            ask={1}
            relay={1}
            check={1}
            answer={1}
            eap={eapMorph}
            tokens={tokens}
            dim={{ device: lanesDim, switch: lanesDim, radius: lanesDim }}
            frame={frame}
          >
            {travel > 0.01 ? (
              <div style={{ position: 'absolute', left: chip.x, top: chip.y, transform: 'translate(-50%, -50%)', opacity: travel * chipFade }}>
                <EapChip size={34} />
              </div>
            ) : null}
          </RoleLanes>
        </div>
      ) : null}

      {/* Right column: EAP, its methods */}
      {rOut < 1 ? (
        <div style={{ position: 'absolute', left: RCOL.x, top: 0, width: RCOL.w, opacity: 1 - rOut }}>
          <div style={{ position: 'absolute', left: 0, top: EAP_Y }}>
            <EapTitle term={S04.eap.term} sub={S04.eap.sub} show={titleIn} glow={titleGlow} dim={eapTitleDim} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: TLS_Y }}>
            <MethodCard term={S04.cards.tls.term} what={S04.cards.tls.what} badge={S04.cards.tls.badge} width={RCOL.w} show={tlsIn} badgeShow={badgeIn} glow={tlsFocus} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: PEAP_Y, opacity: 1 - peapOut }}>
            <MethodCard term={S04.cards.peap.term} what={S04.cards.peap.what} width={RCOL.w} show={peapIn} dim={peapDim} />
          </div>
        </div>
      ) : null}

      {/* ================= B ================= */}
      {gateIn > 0.001 ? (
        <div style={{ position: 'absolute', left: GATE.x, top: GATE.y, opacity: gateIn }}>
          <EntranceGate width={GATE.w} card={1} call={1} check={1} officeCard={officeCard} officeCardSent={officeSent} focus={{ office: officeFocus }} frame={frame} />
        </div>
      ) : null}

      {/* ================= C + D ================= */}
      {accIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: COL.top, width: W, height: 590, transform: `scale(${groupScale})`, transformOrigin: `${W / 2}px 0px` }}>
          {/* A thin divider between the two endings */}
          <div style={{ position: 'absolute', left: W / 2 - 1, top: 6, width: 2, height: 570, background: alpha(C.muted, 0.28), opacity: rejIn }} />
          <div style={{ position: 'absolute', left: accX, top: 0, opacity: accIn * (1 - 0.6 * clamp01(accDim + bothDim)) }}>{column('accept')}</div>
          {rejIn > 0.001 ? (
            <div style={{ position: 'absolute', left: REJ_X + (1 - rejIn) * 30, top: 0, opacity: rejIn * (1 - 0.6 * bothDim) }}>{column('reject')}</div>
          ) : null}
        </div>
      ) : null}
      {decisionIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: DECISION_Y, width: W, display: 'flex', justifyContent: 'center' }}>
          <DecisionCard what={S04.decision.what} owner={S04.decision.owner} when={S04.decision.when} show={decisionIn} dim={decisionDim} />
        </div>
      ) : null}

      {/* The rule, fixed for the whole scene */}
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <RuleLabel lead={S04.rule.lead} rest={S04.rule.rest} />
      </div>
    </Stage>
  );
}
