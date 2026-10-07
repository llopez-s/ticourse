import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, windowWeight } from '../../../engine/src/ui';
import { S07 } from '../data/s07-decidir';
import { Checkpoint } from './parts/Checkpoint';
import { BlueprintPanel, ZoneBox, zoneBoxContent, zoneColor } from './parts/ZoneRow';
import { ChoiceButton, TermCard } from './parts/s06-barrera/marks';
import { STOP_P, crossings, freeFlow } from './parts/s06-barrera/traffic';
import { MgmtTile, PlanRoad, PortLane, PumpsNet, Slot } from './parts/s07-decidir/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-decidir';
const W = 1728;
const H = 660;

// ---- One control = a planned checkpoint on a road that turns into its zone (same spot for both).
// Everything stays below y 170 except at the far left until `closes`: the think prompt's card
// covers roughly x 225–1500, y 0–160 of the stage during the hold.
const CP = { x: 560, y: 250, w: 400 } as const;
const RC = CP.x + 0.65 * CP.w; // the road's centre through the checkpoint (design x 390 of 600)
const HW = 0.1 * CP.w;
const HY = 250;
const ZONE = { x: 1000, y: 180, w: 500, h: 340 } as const;
const ZONE_IN = zoneBoxContent(ZONE.w, ZONE.h, { layout: 'header', zone: 'gestion' });

// ---- Left column: the label, the two buttons, the term
const BTN_W = 230;
const BTN_Y = 420;
const TAG_Y = 528;

// ---- Recap (cost): two columns
const COL = [470, 1258] as const;

/**
 * s07-decidir «Dos controles, dos respuestas».
 *   0           the blueprint with two numbered empty slots («dos controles del plan»).
 *   mgmt-fw     control 1 drawn as a plan: a planned checkpoint («cortafuegos de gestión») on a
 *               road that turns into the management zone (ZoneBox «gestión» «máxima», drawn on
 *               «gestión», its switch and firewall interfaces inside). An admin truck crosses it.
 *   s07-02      on «cae» the power goes with the arm caught halfway up (neither answer); the two
 *               buttons «abre» / «cierra» appear together on «Qué», identical. Think hold: they
 *               glow alike; the top-centre band (and the wider card area) is empty.
 *   closes      the arm drops, «cierra» is chosen, «abre» steps back; FAIL-CLOSED on
 *               «fail-closed»; «los mandos de cada switch y cada cortafuegos» inside the zone on
 *               «mandos»; the waiting truck stays waiting.
 *   why         the port's own road, apart, trucks flowing («el tráfico del puerto»), and on
 *               «único»: «lo único que se para es administrar».
 *   pumps       control 1 leaves; control 2 at the same spot: a planned checkpoint into a network of
 *               its own (rose, pumps and water, no line to any zone), caption «en la red de las
 *               bombas de las esclusas» on «red».
 *   flood       Operaciones' note: «si se paran las bombas, se puede inundar un muelle».
 *   opens       the power goes; on «fail-open» the arm goes up and trucks keep flowing: FAIL-OPEN
 *               «o fuera del camino» (on «camino»); «el riesgo se cubre separando y vigilando» (on
 *               «separando»; the network glows, an eye on «vigilando»).
 *   cost        recap: the two controls side by side, same question, two answers («cierra» +
 *               FAIL-CLOSED / «abre» + FAIL-OPEN); bar «ninguno es el bueno: decide lo que cuesta
 *               más» on «Ningún». Holds.
 */
export function S07Decidir(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const mgmtAt = props.cue('mgmt-fw');
  const closesAt = props.cue('closes');
  const whyAt = props.cue('why');
  const pumpsAt = props.cue('pumps');
  const floodAt = props.cue('flood');
  const opensAt = props.cue('opens');
  const costAt = props.cue('cost');
  const s02 = segment(props, 's07-02');

  const at = {
    gestion: w('s07-01', 'gestión'),
    cae: w('s07-02', 'cae'),
    que: w('s07-02', 'Qué'),
    cierre: w('s07-02', 'cierre'),
    failClosed: w('s07-03', 'fail-closed'),
    mandos: w('s07-03', 'mandos'),
    trafico: w('s07-04', 'tráfico'),
    unico: w('s07-04', 'único'),
    red: w('s07-05', 'red'),
    paran: w('s07-05', 'paran'),
    inundar: w('s07-05', 'inundar'),
    failOpen: w('s07-06', 'fail-open'),
    camino: w('s07-06', 'camino'),
    separando: w('s07-06', 'separando'),
    vigilando: w('s07-06', 'vigilando'),
    dos: w('s07-07', 'dos'),
    ningun: w('s07-07', 'Ningún'),
  };
  // The think hold: from the end of the question to the end of s07-02.
  const holdStart = at.cierre + 18;

  // ---------------- Opening: the blueprint and two empty slots
  const panelIn = progress(frame, 0, 14);
  const slots = progress(frame, 2, 16) * (1 - progress(frame, mgmtAt - 4, 14, EASE.inOut));

  // ---------------- Phase 1: the management firewall
  const p1 = 1 - progress(frame, pumpsAt - 6, 18, EASE.inOut);
  const road1 = progress(frame, mgmtAt, 24, EASE.inOut);
  const zone1 = progress(frame, at.gestion - 8, 26, EASE.inOut);
  const label1 = progress(frame, mgmtAt + 10, 16);
  const traffic1 = crossings(frame, mgmtAt + 24, at.cae - 56);
  const lastTruck = STOP_P * progress(frame, at.cae - 44, 32, EASE.out);
  const power1 = 1 - progress(frame, at.cae + 2, 8);
  const drop = progress(frame, closesAt, 10, EASE.in);
  const barrier1 = Math.max(traffic1.barrier, 0.5 * progress(frame, at.cae - 6, 16, EASE.out)) * (1 - drop);
  const buttons = progress(frame, at.que - 4, 14);
  const holdGlow = windowWeight(frame, holdStart, s02.to, { ramp: 12 });
  const chosen = progress(frame, closesAt, 12);
  const closedTag = progress(frame, at.failClosed - 4, 14);
  const mandos = progress(frame, at.mandos - 6, 14);
  const lane = progress(frame, at.trafico - 8, 16);
  const onlyAdmin = progress(frame, at.unico - 6, 14);

  // ---------------- Phase 2: the pumps
  const p2 = progress(frame, pumpsAt, 18) * (1 - progress(frame, costAt - 6, 18, EASE.inOut));
  const road2 = progress(frame, pumpsAt + 4, 24, EASE.inOut);
  const zone2 = progress(frame, Math.max(pumpsAt + 6, at.red - 8), 26, EASE.inOut);
  const caption2 = progress(frame, at.red - 6, 16);
  const traffic2 = crossings(frame, pumpsAt + 30, opensAt);
  const power2 = 1 - progress(frame, opensAt + 2, 8);
  const barrier2 = Math.max(traffic2.barrier, progress(frame, at.failOpen - 2, 16, EASE.inOut));
  const passing2 = [...traffic2.passing, ...freeFlow(frame, at.failOpen + 6, 60, 80)];
  const note = progress(frame, floodAt - 2, 14);
  const openTag = progress(frame, at.failOpen - 4, 14);
  const risk = progress(frame, at.separando - 6, 14);
  const sepGlow = windowWeight(frame, at.separando - 4, costAt, { ramp: 12 });
  const eye = progress(frame, at.vigilando - 6, 14);

  // ---------------- Phase 3: the recap
  const p3 = progress(frame, costAt + 2, 18);
  const colR = progress(frame, Math.max(costAt + 10, at.dos - 4), 16);
  const bar = progress(frame, at.ningun - 6, 16);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <BlueprintPanel width={W} height={H} draw={panelIn}>
        {/* ================= Opening: two empty slots ================= */}
        {slots > 0.001 ? (
          <div style={{ position: 'absolute', left: 0, width: W, top: 200, display: 'flex', justifyContent: 'center', gap: 56 }}>
            <Slot n={1} w={330} h={300} show={slots} />
            <Slot n={2} w={330} h={300} show={slots} />
          </div>
        ) : null}

        {/* ================= Phase 1: the management firewall ================= */}
        {p1 > 0.001 && road1 > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: p1, transform: `translateX(${(1 - p1) * -40}px)` }}>
            <PlanRoad rc={RC} hw={HW} hy={HY} zx={ZONE.x + 4} draw={road1} />
            <PortLane x0={900} x1={W} y={612} frame={frame} start={at.trafico - 8} show={lane} />
            {lane > 0.001 ? (
              <div style={{ position: 'absolute', right: 12, top: 530, display: 'flex', alignItems: 'center', gap: 10, opacity: lane, whiteSpace: 'nowrap' }}>
                <Icon name="check" size={34} color={C.emerald} strokeWidth={3} />
                <span style={{ fontSize: 34, fontWeight: 800, color: '#6ee7b7' }}>{S07.portTraffic}</span>
              </div>
            ) : null}
            <div style={{ position: 'absolute', left: ZONE.x, top: ZONE.y }}>
              <ZoneBox zone="gestion" width={ZONE.w} height={ZONE.h} layout="header" draw={zone1} focus={0.6 * windowWeight(frame, at.mandos - 6, whyAt, { ramp: 12 })}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 6 }}>
                  {(['network', 'network', 'network', 'firewall', 'firewall'] as const).map((icon, i) => (
                    <MgmtTile key={i} icon={icon} glow={windowWeight(frame, at.mandos - 6, whyAt, { ramp: 12 })} />
                  ))}
                </div>
                {mandos > 0.001 ? (
                  <div style={{ position: 'absolute', left: 0, width: ZONE_IN.w, top: 96, textAlign: 'center', opacity: mandos, transform: `translateY(${(1 - mandos) * 8}px)` }}>
                    {S07.behind.map((l) => (
                      <div key={l} style={{ fontSize: 34, fontWeight: 780, lineHeight: 1.22, color: C.textStrong, whiteSpace: 'nowrap' }}>
                        {l}
                      </div>
                    ))}
                  </div>
                ) : null}
              </ZoneBox>
            </div>
            <div style={{ position: 'absolute', left: CP.x, top: CP.y }}>
              <Checkpoint
                width={CP.w}
                crop="road"
                look="plan"
                state="powered"
                power={power1}
                barrier={barrier1}
                passing={[...traffic1.passing, lastTruck]}
                at={mgmtAt + 4}
                glow={0.6 * windowWeight(frame, closesAt, closesAt + 40, { ramp: 8 })}
              />
            </div>

            {/* «cortafuegos de gestión», with a leader to the hut */}
            {label1 > 0.001 ? (
              <>
                <div style={{ position: 'absolute', left: 30, width: 512, top: 286, textAlign: 'right', fontSize: 42, fontWeight: 820, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: label1 }}>
                  {S07.mgmtFw}
                </div>
                <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: label1 }}>
                  <line x1={550} y1={312} x2={652} y2={338} stroke={alpha(C.cyan, 0.75)} strokeWidth={3} strokeLinecap="round" />
                  <circle cx={656} cy={339} r={5} fill={C.cyan} />
                </svg>
              </>
            ) : null}

            {/* The think prompt's two options: identical until `closes` */}
            <div style={{ position: 'absolute', left: 50, top: BTN_Y, display: 'flex', gap: 30 }}>
              <ChoiceButton label={S07.choices.open} show={buttons} state={-chosen} glow={holdGlow} width={BTN_W} />
              <ChoiceButton label={S07.choices.close} show={buttons} state={chosen} glow={holdGlow} width={BTN_W} />
            </div>

            <div style={{ position: 'absolute', left: 40, top: TAG_Y }}>
              <TermCard term={S07.closedTerm} p={closedTag} size={46} />
            </div>

            {/* «lo único que se para es administrar» */}
            {onlyAdmin > 0.001 ? (
              <div style={{ position: 'absolute', left: 0, width: W, top: 40, display: 'flex', justifyContent: 'center', opacity: onlyAdmin, transform: `translateY(${(1 - onlyAdmin) * 10}px)` }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '6px 22px', borderRadius: RADIUS.md, background: alpha(C.ink950, 0.85), fontSize: 46, fontWeight: 840, color: C.textStrong, whiteSpace: 'nowrap' }}>
                  <Icon name="pause" size={44} color={C.amber} strokeWidth={2.6} />
                  {S07.onlyAdmin.lead}
                  <span style={{ color: '#fcd34d' }}>{S07.onlyAdmin.key}</span>
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ================= Phase 2: the pumps of the lock gates ================= */}
        {p2 > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: p2, transform: `translateX(${(1 - progress(frame, pumpsAt, 18)) * 40}px)` }}>
            <PlanRoad rc={RC} hw={HW} hy={HY} zx={ZONE.x + 4} draw={road2} />
            <div style={{ position: 'absolute', left: ZONE.x, top: ZONE.y }}>
              <ZoneBox zone="ot" name="" confidence={null} color={zoneColor('ot')} width={ZONE.w} height={ZONE.h} layout="header" draw={zone2} focus={0.8 * sepGlow} />
              {zone2 > 0.3 ? (
                <div style={{ position: 'absolute', left: 16, top: 26, opacity: clamp01((zone2 - 0.3) / 0.5) }}>
                  <PumpsNet w={ZONE.w - 32} h={ZONE.h - 42} frame={frame} glow={sepGlow} />
                </div>
              ) : null}
              {eye > 0.001 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: ZONE.w - 34,
                    top: -30,
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    display: 'grid',
                    placeItems: 'center',
                    background: alpha(C.ink900, 0.95),
                    border: `3px solid ${C.cyan}`,
                    boxShadow: `0 0 22px ${alpha(C.cyan, 0.45)}`,
                    opacity: eye,
                    transform: `scale(${0.7 + 0.3 * eye})`,
                  }}
                >
                  <Icon name="eye" size={38} color={C.cyanSoft} strokeWidth={2.4} />
                </div>
              ) : null}
            </div>
            <div style={{ position: 'absolute', left: CP.x, top: CP.y }}>
              <Checkpoint width={CP.w} crop="road" look="plan" state="powered" power={power2} barrier={barrier2} passing={passing2} at={pumpsAt + 8} />
            </div>

            {/* Where the second one goes */}
            {caption2 > 0.001 ? (
              <div style={{ position: 'absolute', left: 0, width: W, top: 40, display: 'flex', justifyContent: 'center', opacity: caption2, transform: `translateY(${(1 - caption2) * 10}px)` }}>
                <span style={{ fontSize: 46, fontWeight: 840, color: C.roseSoft, whiteSpace: 'nowrap' }}>{S07.pumps}</span>
              </div>
            ) : null}

            {/* Operaciones' note */}
            {note > 0.001 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 30,
                  top: 168,
                  width: 500,
                  boxSizing: 'border-box',
                  padding: '14px 22px 18px',
                  borderRadius: RADIUS.lg,
                  border: `3px solid ${alpha(C.amber, 0.8)}`,
                  background: `linear-gradient(180deg, ${alpha(C.amber, 0.16)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
                  boxShadow: `0 0 26px ${alpha(C.amber, 0.22)}`,
                  opacity: note,
                  transform: `translateY(${(1 - note) * 12}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 34, fontWeight: 850, color: '#fcd34d', whiteSpace: 'nowrap' }}>
                  <Icon name="alert" size={36} color={C.amber} strokeWidth={2.5} />
                  {S07.ops}
                </div>
                {S07.flood.map((l, i) => {
                  const k = progress(frame, (i === 0 ? at.paran : at.inundar) - 6, 12);
                  return (
                    <div key={l} style={{ marginTop: i === 0 ? 8 : 0, fontSize: 36, fontWeight: 780, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap', opacity: k }}>
                      {l}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* The risk, covered another way */}
            {risk > 0.001 ? (
              <div style={{ position: 'absolute', left: 40, top: 384, opacity: risk, transform: `translateY(${(1 - risk) * 10}px)` }}>
                {S07.risk.map((l, i) => (
                  <div key={l} style={{ fontSize: 38, fontWeight: i === 0 ? 760 : 850, lineHeight: 1.18, color: i === 0 ? C.text : C.cyanSoft, whiteSpace: 'nowrap' }}>
                    {l}
                  </div>
                ))}
              </div>
            ) : null}

            <div style={{ position: 'absolute', left: 40, top: 490 }}>
              <TermCard term={S07.opens.term} p={openTag} size={46} lines={[{ text: S07.opens.sub, p: progress(frame, at.camino - 6, 12), size: 36 }]} />
            </div>
          </div>
        ) : null}

        {/* ================= Phase 3: same question, two answers ================= */}
        {p3 > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: p3 }}>
            <div style={{ position: 'absolute', left: W / 2 - 1.5, top: 40, width: 3, height: 440, background: alpha(C.cyan, 0.25), borderRadius: 2 }} />
            {[0, 1].map((i) => {
              const show = i === 0 ? p3 : colR;
              if (show <= 0.001) return null;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: COL[i] - 420,
                    width: 840,
                    top: 34,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 18,
                    opacity: show,
                    transform: `translateY(${(1 - show) * 14}px)`,
                  }}
                >
                  <Checkpoint width={360} crop="gate" look="plan" state="cut" barrier={i === 0 ? 0 : 1} />
                  <div style={{ fontSize: i === 0 ? 38 : 34, fontWeight: 820, color: i === 0 ? '#6ee7b7' : C.roseSoft, whiteSpace: 'nowrap' }}>{i === 0 ? S07.mgmtFw : S07.pumps}</div>
                  <ChoiceButton label={i === 0 ? S07.choices.close : S07.choices.open} show={1} state={1} width={BTN_W} />
                  {i === 0 ? (
                    <TermCard term={S07.closedTerm} p={1} size={46} />
                  ) : (
                    <TermCard term={S07.opens.term} p={1} size={46} lines={[{ text: S07.opens.sub, p: 1, size: 34 }]} align="center" />
                  )}
                </div>
              );
            })}
            {bar > 0.001 ? (
              <div style={{ position: 'absolute', left: 0, width: W, top: 560, display: 'flex', justifyContent: 'center', opacity: bar, transform: `translateY(${(1 - bar) * 10}px)` }}>
                <div
                  style={{
                    padding: '12px 36px',
                    borderRadius: RADIUS.lg,
                    border: `3px solid ${alpha(C.cyan, 0.7)}`,
                    background: alpha(C.ink950, 0.92),
                    boxShadow: `0 0 30px ${alpha(C.cyan, 0.25)}`,
                    fontSize: 46,
                    fontWeight: 860,
                    color: C.textStrong,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {S07.cost}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </BlueprintPanel>
    </Stage>
  );
}
