import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { ANSWER, EMPTY_FENCE, NOT_A_ZONE, TERM, ZONE_LABEL } from '../data/s02-garita';
import { Checkpoint, checkpointSize } from './parts/Checkpoint';
import { NAPKIN_HALT_AT, Napkin, napkinPoint, napkinSize } from './parts/Napkin';
import { BadgeCard, Outcome, TryPath } from './parts/s02-garita/Badge';
import { TermTag } from './parts/s02-garita/Marks';
import { PORT, PortMap, portArea, portAreaIndex } from './parts/s02-garita/PortMap';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-garita';
const W = STAGE.width;
const H = STAGE.height;

// ---- Napkin layouts (x = left, y = top, w = width) ----------------------------------------
/** s02-03/04 and s02-06: the voice reads «Oficinas», «Producción» — 1100 wide, centred. */
const NAP_BIG = { w: 1100, x: Math.round((W - 1100) / 2), y: Math.round((H - napkinSize(1100).h) / 2) } as const;
/** The intercepted message's window: small and bottom-left, clear of the top-centre band (card ≈ stage y 10–192). */
const NAP_LOW = { w: 760, x: 0, y: H - Math.round(napkinSize(760).h) } as const;
/** s02-07/08: left, beside the definition column. */
const NAP_SIDE = { w: 1000, x: 0, y: Math.round((H - napkinSize(1000).h) / 2) } as const;
const COL_X = NAP_SIDE.w + 30;
const COL_W = W - COL_X;
const ANS_X = NAP_LOW.w + 40;
/** s02-08: the empty checkpoint (with its fence stubs) beside «una valla con / la garita vacía». */
const FENCE_CK_W = 290;
const FENCE_ROW_H = 14 + Math.ceil(checkpointSize(FENCE_CK_W).h);

// ---- The packet's route on the napkin (design units), to time its crossing of rt-core --------
const BASE = 1280;
const ROUTE = (() => {
  const a = napkinPoint('oficinas', 'top', BASE);
  const bus = napkinPoint('bus', 'center', BASE);
  const rt = napkinPoint('rtcore', 'bottom', BASE);
  const gate = napkinPoint('gate', 'center', BASE);
  const b = napkinPoint('produccion', 'top', BASE);
  const pts = [a, { x: a.x, y: bus.y }, bus, rt, bus, { x: gate.x, y: bus.y }, b];
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = acc[acc.length - 1];
  return { atRouter: acc[3] / total, backOnBus: acc[4] / total };
})();

const OFFICES = portAreaIndex('oficinas');
const DOCK = portAreaIndex('muelle');

/**
 * s02-garita «Una valla con la garita vacía». The port from above settles in
 * from the first frame: the street along the bottom, the passenger terminal,
 * the offices, the dock and Operations' control room; each area's fence draws
 * on «Cada área tiene su valla» and a staffed checkpoint pops into each gate on
 * `checkpoint`. The accreditation card sits on the street: on «oficinas» a
 * dashed try reaches the offices' gate, its barrier lifts and an emerald tick
 * lands; on «muelle» the dock's barrier stays down under a rose cross. On
 * «Dentro…» the label «zona: misma confianza dentro · un control en cada paso»
 * arrives and every area takes one even tint. On «Vuelve a la servilleta» the
 * napkin returns at 1100 px: the red packet leaves Oficinas, crosses `rt-core`
 * on `passes` (the router and its note flash) and drops into Producción. On
 * `empty-gate` Producción's fence and its EMPTY checkpoint draw in (nobody ever
 * posted there, barrier raised: not a failure mode) and on «barrera» the packet
 * runs again under the raised arm. For BLIND ARCHITECT's message the napkin
 * shrinks to the bottom-left, clear of the card; the answer «la VLAN aparta el
 * tráfico; / nadie decide qué cruza» comes in on the right. On `control` the
 * napkin grows back, the control takes the gate (guard, lamp, barrier down)
 * and the same packet halts at it, «solo si una regla lo deja». From s02-07 the
 * napkin moves left: «zona: misma confianza dentro / un control en cada paso»,
 * then SECURITY ZONE on `zone`; s02-08 adds the empty checkpoint with «una VLAN
 * sin control / no es una zona» and «una valla con la garita vacía».
 */
export function S02Garita(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const checkpointAt = props.cue('checkpoint');
  const packetAt = props.cue('packet');
  const passesAt = props.cue('passes');
  const emptyAt = props.cue('empty-gate');
  const controlAt = props.cue('control');
  const zoneAt = props.cue('zone');
  const s03 = segment(props, 's02-03');
  const s04 = segment(props, 's02-04');
  const s05 = segment(props, 's02-05');
  const s07 = segment(props, 's02-07');
  const s08 = segment(props, 's02-08');
  // BLIND ARCHITECT's card: from the end of s02-04 (its silent lead) to the end of s02-05.
  const icFrom = s04.to;
  const icTo = s05.to;

  // ================= Part 1: the port from above =================
  const settle = progress(frame, -12, 22);
  const zoom = 1.03 - 0.03 * progress(frame, 0, 120, EASE.inOut);
  const fenceAt = wordFrame(S, 's02-01', 'área') - 8;
  const fence = [0, 1, 2, 3].map((i) => progress(frame, fenceAt + i * 7, 30, EASE.inOut));
  const gates = [0, 1, 2, 3].map((i) => progress(frame, checkpointAt - 4 + i * 6, 16));
  const officesAt = wordFrame(S, 's02-02', 'oficinas');
  const dockAt = wordFrame(S, 's02-02', 'muelle');
  const insideAt = wordFrame(S, 's02-02', 'Dentro');
  const sameAt = wordFrame(S, 's02-02', 'misma');
  const badgeShow = progress(frame, wordFrame(S, 's02-02', 'acreditación') - 8, 14);
  const officesUp = progress(frame, officesAt - 2, 14) * (1 - progress(frame, insideAt + 14, 16, EASE.inOut));
  const barrier = [0, 0, 0, 0];
  barrier[OFFICES] = officesUp;
  const gateGlow = [0, 0, 0, 0];
  gateGlow[OFFICES] = windowWeight(frame, officesAt - 2, insideAt + 14);
  const tint = progress(frame, sameAt - 8, 18);
  const labelIn = enter(frame, insideAt - 6, { distance: 16 });
  const portOut = progress(frame, s03.from - 8, 16, EASE.inOut);

  const off = portArea(OFFICES);
  const dock = portArea(DOCK);
  const badge = { x: (off.road + dock.road) / 2, y: PORT.street.y + PORT.street.h / 2 };
  const tryOffices = [badge, { x: off.road, y: badge.y }, { x: off.road, y: off.barrierY + 24 }];
  const tryDock = [badge, { x: dock.road, y: badge.y }, { x: dock.road, y: dock.barrierY + 24 }];

  // ================= Part 2: back to the napkin =================
  const napIn = progress(frame, s03.from - 2, 18);
  const toLow = progress(frame, icFrom - 24, 22, EASE.inOut);
  const toBig = progress(frame, icTo + 2, 22, EASE.inOut);
  const toSide = progress(frame, s07.from - 8, 26, EASE.inOut);
  const lowW = toLow * (1 - toBig);
  const napW = mix(mix(NAP_BIG.w, NAP_LOW.w, lowW), NAP_SIDE.w, toSide);
  const napX = mix(mix(NAP_BIG.x, NAP_LOW.x, lowW), NAP_SIDE.x, toSide);
  const napY = mix(mix(NAP_BIG.y, NAP_LOW.y, lowW), NAP_SIDE.y, toSide);

  // The packet: crosses rt-core on `passes` and lands in Producción as the voice says it…
  const arriveAt = Math.max(passesAt + 20, wordFrame(S, 's02-03', 'Producción') + 6);
  const pass1 = interpolate(frame, [packetAt, passesAt, arriveAt], [0, ROUTE.atRouter, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // …runs again under the raised barrier on «barrera»…
  const againAt = wordFrame(S, 's02-04', 'barrera') - 6;
  const pass1b = interpolate(frame, [againAt, againAt + 40], [ROUTE.backOnBus, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.inOut });
  // …and, once the control is on, halts at the gate on «se para».
  const haltAt = wordFrame(S, 's02-06', 'para') + 2;
  const runFrom = Math.min(wordFrame(S, 's02-06', 'frontera'), haltAt - 50);
  const pass2 = interpolate(frame, [runFrom, haltAt], [0, NAPKIN_HALT_AT], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.inOut });
  const packet = frame < againAt - 2 ? pass1 : frame < controlAt ? (frame < againAt ? 0 : pass1b) : pass2;

  const gate = progress(frame, emptyAt - 2, 22);
  const gateControl = progress(frame, controlAt + 16, 18);
  const haltNote = progress(frame, wordFrame(S, 's02-06', 'salvo') - 4, 14) * (1 - progress(frame, s07.from - 12, 12, EASE.inOut));

  const routerWord = wordFrame(S, 's02-05', 'router') - 4;
  const routerW = Math.max(windowWeight(frame, passesAt - 2, emptyAt - 4, { ramp: 8 }), windowWeight(frame, routerWord, icTo - 4, { ramp: 12 }));
  const sameAt7 = wordFrame(S, 's02-07', 'misma');
  const highlight = {
    oficinas: 0.8 * windowWeight(frame, packetAt - 6, passesAt, { ramp: 8 }),
    rtcore: routerW,
    note: routerW,
    produccion: Math.max(0.75 * windowWeight(frame, wordFrame(S, 's02-03', 'Producción') - 4, emptyAt + 24, { ramp: 10 }), progress(frame, sameAt7 - 6, 16)),
  };

  // Answer to the message (right of the small napkin, below the band).
  const ans1 = enter(frame, wordFrame(S, 's02-05', 'aparta') - 6, { distance: 16 });
  const ans2 = enter(frame, wordFrame(S, 's02-05', 'nadie') - 6, { distance: 16 });
  const ansOut = progress(frame, icTo - 4, 14, EASE.inOut);

  // Definition column (s02-07/08).
  const def1 = enter(frame, sameAt7 - 6, { distance: 16 });
  const def2 = enter(frame, wordFrame(S, 's02-07', 'control') - 6, { distance: 16 });
  const defDim = 0.55 * progress(frame, s08.from - 4, 16, EASE.inOut);
  const notIn = enter(frame, wordFrame(S, 's02-08', 'VLAN') - 8, { distance: 18 });
  const fenceGrow = progress(frame, wordFrame(S, 's02-08', 'valla') - 8, 18, EASE.inOut);

  return (
    <Stage>
      {/* ---- Part 1: the port from above ---- */}
      {portOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: 1 - portOut, transform: `scale(${zoom * (1 - 0.03 * portOut)})`, transformOrigin: '50% 45%' }}>
          <PortMap settle={settle} fence={fence} gates={gates} barrier={barrier} gateGlow={gateGlow} tint={tint} focus={{ oficinas: windowWeight(frame, officesAt - 4, insideAt), muelle: windowWeight(frame, dockAt - 4, insideAt) }} />
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <TryPath pts={tryOffices} p={progress(frame, officesAt - 18, 18, EASE.inOut)} />
            <TryPath pts={tryDock} p={progress(frame, dockAt - 16, 16, EASE.inOut)} />
            <BadgeCard x={badge.x} y={badge.y} show={badgeShow} />
            <Outcome x={off.road} y={off.barrierY - 72} kind="pass" show={progress(frame, officesAt + 6, 12)} />
            <Outcome x={dock.road} y={dock.barrierY - 72} kind="refuse" show={progress(frame, dockAt + 2, 12)} />
          </svg>
          {/* «zona: misma confianza dentro · un control en cada paso» */}
          {frame >= insideAt - 8 ? (
            <div style={{ position: 'absolute', left: 0, top: 598, width: W, display: 'flex', justifyContent: 'center', ...labelIn }}>
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 14, fontFamily: FONT.sans, fontSize: 40, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <span style={{ color: C.cyan, fontWeight: 850 }}>{ZONE_LABEL.lead}</span>
                <span style={{ color: tint > 0.5 ? C.cyanSoft : C.textStrong }}>{ZONE_LABEL.trust}</span>
                <span style={{ color: C.faint }}>·</span>
                <span>{ZONE_LABEL.control}</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---- Part 2: the napkin ---- */}
      {napIn > 0 ? (
        <div style={{ position: 'absolute', left: napX, top: napY, opacity: napIn, transform: `scale(${0.96 + 0.04 * napIn})`, transformOrigin: '50% 50%' }}>
          <Napkin width={napW} packet={packet} gate={gate} gateControl={gateControl} haltNote={haltNote} highlight={highlight} />
        </div>
      ) : null}

      {/* The answer to BLIND ARCHITECT's message (below the card, right of the small napkin) */}
      {frame >= icFrom && ansOut < 1 ? (
        <div style={{ position: 'absolute', left: ANS_X, top: 240, width: W - ANS_X, height: H - 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: 1 - ansOut, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ ...ans1, fontSize: 46, fontWeight: 750, color: C.text }}>{ANSWER[0]}</div>
          <div
            style={{
              ...ans2,
              fontSize: 50,
              fontWeight: 850,
              color: C.textStrong,
              padding: '10px 26px',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.amber, 0.75)}`,
              background: alpha(C.amber, 0.1),
            }}
          >
            {ANSWER[1]}
          </div>
        </div>
      ) : null}

      {/* ---- Definition column (s02-07/08) ---- */}
      {toSide > 0 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 0, width: COL_W, height: H, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 26, ...dimStyle(defDim) }}>
            {frame >= sameAt7 - 8 ? (
              <div style={{ ...def1, fontSize: 34, fontWeight: 850, color: C.cyan, marginBottom: 6 }}>{ZONE_LABEL.lead}</div>
            ) : null}
            <div style={{ ...def1, fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.25 }}>{ZONE_LABEL.trust}</div>
            <div style={{ ...def2, fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.25 }}>{ZONE_LABEL.control}</div>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 214 }}>
            <TermTag frame={frame} fps={fps} at={zoneAt} term={TERM} dim={defDim} />
          </div>
          {frame >= wordFrame(S, 's02-08', 'VLAN') - 10 ? (
            <div style={{ position: 'absolute', left: 0, top: 350, ...notIn }}>
              <div
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  padding: '16px 24px 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `2px solid ${alpha(C.amber, 0.6)}`,
                  background: alpha(C.ink900, 0.9),
                }}
              >
                <div style={{ fontSize: 40, fontWeight: 800, color: C.textStrong, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  <div>{NOT_A_ZONE[0]}</div>
                  <div style={{ color: C.amber }}>{NOT_A_ZONE[1]}</div>
                </div>
                {/* «Es una valla con la garita vacía»: the row opens its own room as it arrives */}
                <div style={{ height: Math.round(FENCE_ROW_H * fenceGrow), overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 14, opacity: fenceGrow, transform: `translateY(${(1 - fenceGrow) * 10}px)` }}>
                    <Checkpoint width={FENCE_CK_W} state="empty" />
                    <div style={{ fontSize: 34, fontWeight: 750, color: C.text, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                      {EMPTY_FENCE.map((l) => (
                        <div key={l}>{l}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}
