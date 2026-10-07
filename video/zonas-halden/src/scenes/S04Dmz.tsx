import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { S04 } from '../data/s04-dmz';
import { Checkpoint, PEN, checkpointSize } from './parts/Checkpoint';
import { ServiceCounter, counterSize } from './parts/Counter';
import { NAPKIN_TEXT, Napkin, PerimeterRule, napkinPoint } from './parts/Napkin';
import { BlueprintPanel, ZoneBox, zoneBoxContent, zoneColor } from './parts/ZoneRow';
import { PLAN_PORTAL_TILE, PenNote, PlanPortal, PortalCallout, RuleHeader, RuleRow, TraitRow } from './parts/s04-dmz/Bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's04-dmz';
const W = 1728;

// ---- A: the napkin. Centred at the start → right (portal: its callout in the freed left half) →
// small and low on the right (rule-in): from then until s04-03 ends everything sits below
// stage y 230, so the intercepted message finds the top centre empty.
const NAP0 = { w: 1040, x: (W - 1040) / 2, y: 21 } as const;
const NAP1 = { w: 1040, x: W - 1040, y: 21 } as const;
const NAP2 = { w: 740, x: W - 740, y: 220 } as const;
const RULE_X = 0;
const RULE_HEADER_Y = 240;
const RULE_Y = 318;
const NOTE = { x: 30, y: 520 } as const;
const CALLOUT_GAP = 30;
/**
 * The «puestos de Importación» tag sits between the bus and Oficinas, over the workstations (design
 * units: bus at y 300, Oficinas' top at 452, the right monitor's top at 528). It fits there at both
 * napkin widths, and leaves before the dotted breach runs along the bus.
 */
const TAG_DESIGN = { x: 231, bus: 300, oficinas: 452, leaderX: 295, wsTop: 528 } as const;
const TAG_H = 86;

// ---- B: the counter (left) and its three properties (right).
const CTR = { x: 90, y: 104, w: 660 } as const;
const TRAITS_X = 840;

// ---- C: the plan on a blueprint panel at the top, the DMZ's rules under it.
const PANEL_H = 372;
const BOX_Y = 64;
const BOX_H = 276;
const Z = { internet: { x: 56, w: 300 }, dmz: { x: 476, w: 640 }, interna: { x: 1236, w: 436 } } as const;
const DMZ_NAME = 56;
const DMZ_IN = zoneBoxContent(Z.dmz.w, BOX_H, { layout: 'header', zone: 'dmz', nameSize: DMZ_NAME });
/** Road (and both rule paths) height: the portal tile's centre. */
const ROAD_Y = BOX_Y + DMZ_IN.y + 78;
const PORTAL_AT = { x: Z.dmz.x + 200, y: ROAD_Y } as const;
const GLOBE_AT = { x: Z.internet.x + Z.internet.w / 2, y: ROAD_Y } as const;
const DESKS_AT = { x: Z.interna.x + Z.interna.w / 2, y: ROAD_Y } as const;
const GATE_W = 92;
const GATE_SIZE = checkpointSize(GATE_W, { fence: false });
const GATE_GROUND = ((240 - 22) / 258) * GATE_SIZE.h;
const GATES = [(Z.internet.x + Z.internet.w + Z.dmz.x) / 2, (Z.dmz.x + Z.dmz.w + Z.interna.x) / 2] as const;
/** The counter as the DMZ's emblem: first alone between the gates, then in the DMZ's header. */
const SLOT = { w: 200, cx: (Z.dmz.x + Z.dmz.x + Z.dmz.w) / 2 + 40, cy: ROAD_Y } as const;
const EMBLEM = { w: 120, x: Z.dmz.x + 168, y: BOX_Y + 6 } as const;
const NAP3 = { w: 450, x: 0, y: 392 } as const;
const ROWS_Y = [400, 468] as const;
const CAPTION_Y = 566;

/**
 * s04-dmz «La ventanilla».
 *   portal      the napkin slides right; the portal (in Oficinas) comes up and grows, its callout
 *               `hpa-portal-web-01` · «portal público de reservas de atraque» in the freed left half;
 *               on «Importación» the napkin's tag «puestos de Importación» over the workstations.
 *   rule-in     the napkin shrinks to the bottom-right (below the intercept band); `fw-perimetro-01`
 *               lit in highlighter yellow; on the left its header and the rule in columns «origen:
 *               Internet · destino: hpa-portal-web-01 · tcp/443 · permitir» (column lit as the voice
 *               says Internet / el portal / cualquiera).
 *   (intercept) BLIND ARCHITECT: «Deja el portal dentro…». The top centre stays empty.
 *   inside      the napkin's dotted red line: Internet → portal → the workstations beside it;
 *               Oficinas washes red; «si alguien lo rompe, ya está dentro» in red pen.
 *   counter     the counter window (ServiceCounter), «la ventanilla · de navieras y transportistas»;
 *               s04-05: the crossed door, the tray, the paper and the person who checks it, each with
 *               its line («sin puerta a las oficinas · solo una bandeja · alguien mira cada papel»).
 *   s04-06      the counter shrinks onto the road of the plan (blueprint): Internet and interna,
 *               a checkpoint between each two; today's napkin small at the bottom-left.
 *   dmz         whoosh: the DMZ box («baja», amber) draws around the counter, which becomes its
 *               emblem; the portal flies out of the napkin into the DMZ (clean blueprint tile).
 *   dmz-rules   the two rules as the voice says them: «de Internet a la DMZ: solo 443, al portal»
 *               (a cyan path through the first checkpoint) and, on «hacia», «de la DMZ a la red
 *               interna: solo lo imprescindible, con regla; nada más» (a narrow path to interna).
 *               Nothing cuts the portal's own way out to Internet.
 *   s04-08      a red dotted line reaches the portal and stops at the second checkpoint: «quien
 *               rompa el portal se queda en la ventanilla». Holds.
 */
export function S04Dmz(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const portalAt = props.cue('portal');
  const ruleInAt = props.cue('rule-in');
  const insideAt = props.cue('inside');
  const counterAt = props.cue('counter');
  const dmzAt = props.cue('dmz');
  const dmzRulesAt = props.cue('dmz-rules');
  const s02 = segment(props, 's04-02');
  const c6 = segment(props, 's04-06').from;

  const at = {
    importacion: w('s04-01', 'Importación'),
    internet2: w('s04-02', 'Internet'),
    portal3: w('s04-03', 'portal'),
    cualquiera3: w('s04-03', 'cualquiera'),
    navieras: w('s04-04', 'navieras'),
    puerta: w('s04-05', 'puerta'),
    bandeja: w('s04-05', 'bandeja'),
    papeles: w('s04-05', 'papeles'),
    alguien: w('s04-05', 'alguien'),
    mira: w('s04-05', 'mira'),
    internet6: w('s04-06', 'Internet'),
    interna: w('s04-06', 'interna'),
    hacia: w('s04-07', 'hacia'),
    rompa: w('s04-08', 'rompa'),
    queda: w('s04-08', 'queda'),
  };

  // ================= A: the napkin =================
  const aOut = progress(frame, counterAt - 6, 14, EASE.inOut);
  const slide = progress(frame, portalAt - 4, 22, EASE.inOut);
  const shrink = progress(frame, ruleInAt - 4, 24, EASE.inOut);
  const nap = {
    w: mix(mix(NAP0.w, NAP1.w, slide), NAP2.w, shrink),
    x: mix(mix(NAP0.x, NAP1.x, slide), NAP2.x, shrink),
    y: mix(mix(NAP0.y, NAP1.y, slide), NAP2.y, shrink),
  };
  const ns = nap.w / 1280;
  const portalLevel = mix(0.38, 1, progress(frame, portalAt, 14));
  const portalZoom = progress(frame, portalAt + 2, 18);
  const breach = progress(frame, insideAt - 2, 46, EASE.linear);
  const redWash = progress(frame, insideAt + 36, 14);
  const highlightColor = frame >= insideAt + 6 ? '#fb7185' : '#facc15';
  const highlight = {
    portal: windowWeight(frame, portalAt + 6, ruleInAt, { ramp: 10 }),
    fw: windowWeight(frame, ruleInAt + 8, insideAt - 2, { ramp: 10 }),
    oficinas: redWash,
  };
  const tagP = progress(frame, at.importacion - 4, 12) * (1 - progress(frame, insideAt - 10, 8));
  const tagAt = { x: TAG_DESIGN.x * ns, y: TAG_DESIGN.bus * ns + Math.max(1, ((TAG_DESIGN.oficinas - TAG_DESIGN.bus) * ns - TAG_H) / 2) };
  const tagLeader = { x: nap.x + TAG_DESIGN.leaderX * ns, y1: nap.y + tagAt.y + TAG_H, y2: nap.y + TAG_DESIGN.wsTop * ns - 4 };

  // The callout: its right-middle CALLOUT_GAP left of the napkin, level with the portal.
  const portalC = napkinPoint('portal', 'center', nap.w);
  const portalStage = { x: nap.x + portalC.x, y: nap.y + portalC.y };
  const portalLeft = nap.x + (101 - 37 * (1 + 0.3 * portalZoom)) * ns;
  const calloutP = progress(frame, portalAt + 8, 16) * (1 - progress(frame, insideAt - 8, 12));
  const calloutRight = nap.x - CALLOUT_GAP;

  const ruleHeader = progress(frame, ruleInAt + 4, 14);
  const ruleShow = progress(frame, ruleInAt + 8, 34, EASE.linear);
  const ruleFocus =
    frame >= at.internet2 - 4 && frame < s02.to
      ? 0
      : frame >= at.portal3 - 4 && frame < at.cualquiera3 - 4
        ? 1
        : frame >= at.cualquiera3 - 4 && frame < insideAt
          ? 0
          : undefined;
  const noteP = progress(frame, insideAt + 36, 14);

  // ================= B: the counter =================
  const morph = progress(frame, c6, 28, EASE.inOut);
  const bigCtr = counterSize(CTR.w);
  const slotTL = { x: SLOT.cx - SLOT.w / 2, y: SLOT.cy - counterSize(SLOT.w).h / 2 };
  const bigK = mix(1, SLOT.w / CTR.w, morph);
  const bigX = mix(CTR.x, slotTL.x, morph);
  const bigY = mix(CTR.y, slotTL.y, morph);
  const bigOpacity = 1 - clamp01((morph - 0.72) / 0.28);
  const titleP = progress(frame, counterAt + 4, 16);
  const subP = progress(frame, at.navieras - 6, 14);
  const bOut = progress(frame, c6 - 4, 16, EASE.inOut);

  // ================= C: the plan =================
  const panelP = progress(frame, c6 + 2, 16);
  const zInternet = progress(frame, Math.min(at.internet6 - 10, dmzAt - 40), 22, EASE.inOut);
  const zInterna = progress(frame, Math.min(at.interna - 10, dmzAt - 30), 22, EASE.inOut);
  const zDmz = progress(frame, dmzAt - 2, 26, EASE.inOut);
  const roadP = Math.min(zInternet, zInterna);
  const small = clamp01((morph - 0.55) / 0.45);
  const emblem = progress(frame, dmzAt - 2, 24, EASE.inOut);
  const ctrW = mix(SLOT.w, EMBLEM.w, emblem);
  const ctrX = mix(slotTL.x, EMBLEM.x, emblem);
  const ctrY = mix(slotTL.y, EMBLEM.y, emblem);

  const nap3In = progress(frame, c6 + 10, 16);
  const flyAt = dmzAt + 6;
  const FLY = 30;
  const fly = progress(frame, flyAt, FLY, EASE.inOut);
  const nap3Out = progress(frame, Math.min(flyAt + FLY + 14, dmzRulesAt - 18), 14, EASE.inOut);
  const nap3PortalC = napkinPoint('portal', 'center', NAP3.w);
  const flyFrom = { x: NAP3.x + nap3PortalC.x, y: NAP3.y + nap3PortalC.y };
  const flyPos = { x: mix(flyFrom.x, PORTAL_AT.x, fly), y: mix(flyFrom.y, PORTAL_AT.y, fly) - Math.sin(Math.PI * fly) * 110 };
  const flyScale = mix(0.42, 1, fly);
  const portalLabel = progress(frame, flyAt + FLY - 4, 12);

  const row1 = progress(frame, dmzRulesAt - 2, 16);
  const row2 = progress(frame, at.hacia - 6, 16);
  const r1 = progress(frame, dmzRulesAt + 2, 22, EASE.inOut);
  const r2 = progress(frame, at.hacia - 2, 24, EASE.inOut);

  const b1 = progress(frame, at.rompa - 8, 26, EASE.linear);
  const ring = progress(frame, at.rompa + 14, 12);
  const b2 = progress(frame, at.rompa + 22, 20);
  const stopGlow = progress(frame, at.rompa + 38, 12);
  const leadP = progress(frame, at.rompa - 4, 14);
  const restP = progress(frame, at.queda - 6, 14);
  const emblemGlow = progress(frame, at.queda - 6, 14);

  // Path ends (stage px)
  const p1From = GLOBE_AT.x + 52;
  const p1To = PORTAL_AT.x - PLAN_PORTAL_TILE / 2 - 10;
  const p2From = PORTAL_AT.x + PLAN_PORTAL_TILE / 2 + 10;
  const p2To = DESKS_AT.x - 162;
  const stopX = GATES[1] - 58;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= A ================= */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut }}>
          <div style={{ position: 'absolute', left: nap.x, top: nap.y }}>
            <Napkin
              width={nap.w}
              portal={portalLevel}
              portalZoom={portalZoom}
              portalCallout={false}
              importTag={tagP}
              importTagAt={tagAt}
              highlight={highlight}
              highlightColor={highlightColor}
              breach={breach}
              frame={frame}
            />
          </div>

          {/* Leaders: the callout to the portal, the tag down to the workstations */}
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {calloutP > 0.001 ? (
              <g opacity={calloutP}>
                {/* Paper-coloured over the dark stage, ink once it is on the napkin */}
                <path d={`M ${calloutRight} ${portalStage.y} L ${nap.x + 10 * ns} ${portalStage.y}`} stroke={PEN.paper} strokeWidth={4} strokeLinecap="round" />
                <path d={`M ${nap.x + 10 * ns} ${portalStage.y} L ${portalLeft - 6} ${portalStage.y}`} stroke={PEN.ink} strokeWidth={4} strokeLinecap="round" />
                <circle cx={portalLeft - 6} cy={portalStage.y} r={7} fill={PEN.ink} />
              </g>
            ) : null}
            {tagP > 0.001 ? (
              <g opacity={tagP}>
                <path d={`M ${tagLeader.x} ${tagLeader.y1} L ${tagLeader.x} ${tagLeader.y2}`} stroke={PEN.ink} strokeWidth={3.5} strokeLinecap="round" />
                <circle cx={tagLeader.x} cy={tagLeader.y2} r={6} fill={PEN.ink} />
              </g>
            ) : null}
          </svg>

          {/* The portal's callout, left of the napkin */}
          <div style={{ position: 'absolute', left: calloutRight, top: portalStage.y, transform: `translate(-100%, -50%) translateX(${(1 - calloutP) * -14}px)` }}>
            <PortalCallout show={calloutP} host={NAPKIN_TEXT.portalHost} lines={S04.portal.what} />
          </div>

          {/* The rule on fw-perimetro-01 */}
          <div style={{ position: 'absolute', left: RULE_X, top: RULE_HEADER_Y }}>
            <RuleHeader show={ruleHeader} host={S04.rule.host} what={S04.rule.what} />
          </div>
          <div style={{ position: 'absolute', left: RULE_X + 6, top: RULE_Y }}>
            <PerimeterRule show={ruleShow} focus={ruleFocus} size={32} />
          </div>

          {/* «si alguien lo rompe, ya está dentro» */}
          <div style={{ position: 'absolute', left: NOTE.x, top: NOTE.y }}>
            <PenNote show={noteP} text={S04.inside} />
          </div>
        </div>
      ) : null}

      {/* ================= B: the counter ================= */}
      {frame >= counterAt - 2 && bigOpacity > 0.001 ? (
        <div style={{ position: 'absolute', left: bigX, top: bigY, transform: `scale(${bigK})`, transformOrigin: '0 0', opacity: bigOpacity, width: CTR.w, height: bigCtr.h }}>
          <ServiceCounter
            width={CTR.w}
            at={counterAt}
            visitor={progress(frame, counterAt + 8, 14) * (1 - morph)}
            noDoor={progress(frame, at.puerta - 4, 12) * (1 - morph)}
            trayGlow={windowWeight(frame, at.bandeja - 2, at.mira + 30, { ramp: 10 })}
            paper={progress(frame, at.papeles - 14, 40, EASE.linear)}
            inspect={progress(frame, Math.max(at.alguien - 4, at.papeles + 24), 30, EASE.linear)}
            frame={frame}
          />
        </div>
      ) : null}
      {titleP > 0.001 && bOut < 1 ? (
        <div style={{ position: 'absolute', left: TRAITS_X, top: 112, opacity: 1 - bOut }}>
          <div style={{ fontSize: 60, fontWeight: 880, color: '#fde68a', whiteSpace: 'nowrap', opacity: titleP, transform: `translateY(${(1 - titleP) * 10}px)` }}>{S04.counter.title}</div>
          <div style={{ marginTop: 4, fontSize: 36, fontWeight: 720, color: C.text, whiteSpace: 'nowrap', opacity: subP }}>{S04.counter.sub}</div>
          <div style={{ marginTop: 46, display: 'flex', flexDirection: 'column', gap: 26 }}>
            <TraitRow show={progress(frame, at.puerta - 6, 14)} kind="noDoor" text={S04.counter.traits[0]} tone={C.roseSoft} />
            <TraitRow show={progress(frame, at.bandeja - 6, 14)} kind="tray" text={S04.counter.traits[1]} tone={C.amber} />
            <TraitRow show={progress(frame, at.mira - 6, 14)} kind="eye" text={S04.counter.traits[2]} tone={C.cyan} />
          </div>
        </div>
      ) : null}

      {/* ================= C: the plan ================= */}
      {panelP > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <BlueprintPanel width={W} height={PANEL_H} draw={panelP} />
        </div>
      ) : null}
      {panelP > 0.001 ? (
        <>
          {/* Roads between neighbouring zones (the DMZ's slot first, then its box) */}
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {[
              [Z.internet.x + Z.internet.w, Z.dmz.x],
              [Z.dmz.x + Z.dmz.w, Z.interna.x],
            ].map(([x1, x2], i) => (
              <line key={i} x1={x1} y1={ROAD_Y} x2={x2} y2={ROAD_Y} stroke={alpha(C.cyan, 0.55)} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - roadP} />
            ))}
            {/* Before the DMZ exists, the road runs on through the slot */}
            {zDmz < 1 ? (
              <line x1={Z.dmz.x} y1={ROAD_Y} x2={Z.dmz.x + Z.dmz.w} y2={ROAD_Y} stroke={alpha(C.cyan, 0.4)} strokeWidth={3} strokeDasharray="10 10" opacity={roadP * (1 - zDmz)} />
            ) : null}
          </svg>
          <div style={{ position: 'absolute', left: Z.internet.x, top: BOX_Y }}>
            <ZoneBox zone="internet" width={Z.internet.w} height={BOX_H} layout="header" draw={zInternet} />
          </div>
          <div style={{ position: 'absolute', left: Z.interna.x, top: BOX_Y }}>
            <ZoneBox zone="interna" width={Z.interna.w} height={BOX_H} layout="header" draw={zInterna} />
          </div>
          <div style={{ position: 'absolute', left: Z.dmz.x, top: BOX_Y }}>
            <ZoneBox zone="dmz" width={Z.dmz.w} height={BOX_H} layout="header" nameSize={DMZ_NAME} draw={zDmz} />
          </div>
          {/* Zone contents: Internet's globe, interna's unnamed workstations */}
          <div style={{ position: 'absolute', left: GLOBE_AT.x - 40, top: GLOBE_AT.y - 40, opacity: clamp01((zInternet - 0.5) / 0.5) }}>
            <Icon name="globe" size={80} color={'#cbd5e1'} strokeWidth={1.8} />
          </div>
          <div style={{ position: 'absolute', left: DESKS_AT.x - 150, top: DESKS_AT.y - 34, width: 300, display: 'flex', justifyContent: 'space-between', opacity: clamp01((zInterna - 0.5) / 0.5) }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 84, height: 68, borderRadius: 12, display: 'grid', placeItems: 'center', border: `2px solid ${alpha(C.sky, 0.6)}`, background: alpha(C.sky, 0.1) }}>
                <Icon name="desktop" size={46} color="#7dd3fc" strokeWidth={2} />
              </div>
            ))}
          </div>
          {/* A planned checkpoint on each frontier */}
          {GATES.map((gx, i) => (
            <div key={i} style={{ position: 'absolute', left: gx - GATE_W / 2, top: ROAD_Y - GATE_GROUND, opacity: clamp01((roadP - 0.5) / 0.5) }}>
              <Checkpoint width={GATE_W} look="plan" fence={false} state="powered" detail="icon" glow={i === 1 ? stopGlow : 0} />
            </div>
          ))}

          {/* The two rules on the plan */}
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {r1 > 0.001 ? (
              <g>
                <line x1={p1From} y1={ROAD_Y} x2={mix(p1From, p1To, r1)} y2={ROAD_Y} stroke={C.cyan} strokeWidth={7} strokeLinecap="round" />
                {r1 >= 0.999 ? <path d={`M ${p1To - 16} ${ROAD_Y - 12} L ${p1To} ${ROAD_Y} L ${p1To - 16} ${ROAD_Y + 12}`} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
              </g>
            ) : null}
            {r2 > 0.001 ? (
              <g>
                <line x1={p2From} y1={ROAD_Y} x2={mix(p2From, p2To, r2)} y2={ROAD_Y} stroke={C.cyanSoft} strokeWidth={4} strokeLinecap="round" strokeDasharray="12 10" />
                {r2 >= 0.999 ? <path d={`M ${p2To - 13} ${ROAD_Y - 10} L ${p2To} ${ROAD_Y} L ${p2To - 13} ${ROAD_Y + 10}`} fill="none" stroke={C.cyanSoft} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
              </g>
            ) : null}
            {/* s04-08: someone breaks the portal and stays at the counter */}
            {b1 > 0.001 ? (
              <line x1={p1From} y1={ROAD_Y - 18} x2={mix(p1From, p1To + 4, b1)} y2={ROAD_Y - 18} stroke={C.rose} strokeWidth={9} strokeLinecap="round" strokeDasharray="1 16" />
            ) : null}
            {b2 > 0.001 ? (
              <g>
                <line x1={p2From} y1={ROAD_Y + 20} x2={mix(p2From, stopX, b2)} y2={ROAD_Y + 20} stroke={C.roseSoft} strokeWidth={5} strokeLinecap="round" strokeDasharray="12 10" />
                {b2 >= 0.999 ? <line x1={stopX + 10} y1={ROAD_Y + 2} x2={stopX + 10} y2={ROAD_Y + 38} stroke={C.rose} strokeWidth={9} strokeLinecap="round" /> : null}
              </g>
            ) : null}
          </svg>
          {/* «443» on the way in; a lock on the narrow way inside */}
          {r1 > 0.6 ? (
            <div style={{ position: 'absolute', left: (Z.dmz.x + p1To) / 2 - 8, top: ROAD_Y - 62, transform: 'translateX(-50%)', opacity: clamp01((r1 - 0.6) / 0.4) }}>
              <span style={{ padding: '2px 12px', borderRadius: 10, background: C.ink900, border: `2px solid ${C.cyan}`, fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, color: C.cyanSoft }}>{S04.port}</span>
            </div>
          ) : null}
          {r2 > 0.6 ? (
            <div
              style={{
                position: 'absolute',
                left: (p2From + Z.dmz.x + Z.dmz.w) / 2 + 20,
                top: ROAD_Y - 64,
                transform: 'translateX(-50%)',
                width: 48,
                height: 48,
                borderRadius: 24,
                display: 'grid',
                placeItems: 'center',
                background: C.ink900,
                border: `2px solid ${C.cyanSoft}`,
                opacity: clamp01((r2 - 0.6) / 0.4),
              }}
            >
              <Icon name="lock" size={28} color={C.cyanSoft} strokeWidth={2.2} />
            </div>
          ) : null}
        </>
      ) : null}

      {/* The counter: shrunk onto the plan's road, then the DMZ's emblem */}
      {small > 0.001 ? (
        <div style={{ position: 'absolute', left: ctrX, top: ctrY, opacity: small }}>
          <ServiceCounter width={ctrW} detail="icon" glow={emblemGlow} frame={frame} />
        </div>
      ) : null}

      {/* Today's napkin, small: the portal leaves it */}
      {nap3In > 0.001 && nap3Out < 1 ? (
        <div style={{ position: 'absolute', left: NAP3.x, top: NAP3.y, opacity: nap3In * (1 - nap3Out) }}>
          <Napkin
            width={NAP3.w}
            portal={frame < flyAt ? 'normal' : 'hidden'}
            highlight={{ portal: windowWeight(frame, c6 + 30, flyAt, { ramp: 10 }) }}
            frame={frame}
          />
        </div>
      ) : null}

      {/* The portal in the plan (flying, then in the DMZ) */}
      {frame >= flyAt ? (
        <div style={{ position: 'absolute', left: flyPos.x - PLAN_PORTAL_TILE / 2, top: flyPos.y - PLAN_PORTAL_TILE / 2, transform: `scale(${flyScale})`, transformOrigin: '50% 50%' }}>
          <PlanPortal host={NAPKIN_TEXT.portalHost} label={portalLabel} ring={ring} glow={windowWeight(frame, dmzRulesAt, at.hacia + 30, { ramp: 12 })} />
        </div>
      ) : null}

      {/* The DMZ's two rules, as the voice says them */}
      <div style={{ position: 'absolute', left: 56, top: ROWS_Y[0] }}>
        <RuleRow show={row1} lead={S04.dmzRules[0].lead} rest={S04.dmzRules[0].rest} from={zoneColor('internet')} to={zoneColor('dmz')} />
      </div>
      <div style={{ position: 'absolute', left: 56, top: ROWS_Y[1] }}>
        <RuleRow show={row2} lead={S04.dmzRules[1].lead} rest={S04.dmzRules[1].rest} from={zoneColor('dmz')} to={zoneColor('interna')} />
      </div>

      {/* s04-08 */}
      {leadP > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: CAPTION_Y, display: 'flex', justifyContent: 'center', gap: 16, whiteSpace: 'nowrap', fontSize: 46, fontWeight: 850 }}>
          <span style={{ color: C.textStrong, opacity: leadP }}>{S04.contained.lead}</span>
          <span style={{ color: '#fde68a', opacity: restP, transform: `translateY(${(1 - restP) * 8}px)` }}>{S04.contained.rest}</span>
        </div>
      ) : null}
    </Stage>
  );
}
