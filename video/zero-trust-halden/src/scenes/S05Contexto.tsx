import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { RESOURCE } from '../data/s04-peticion';
import { ADAPTIVE, CLOSED, EVENT, OPTIONS, PILOT, READ_ONLY, REQUEST2, REVOKE, SCOPE, STEP_UP } from '../data/s05-contexto';
import { SIM, SIM_NAVE, SimCard, SimChip, SimFrame, SimTerm, simCardHeight, type SimRow } from './parts/Sim';
import { Warehouse, warehouseLayout } from './parts/Warehouse';
import { ResourcePlate } from './parts/s04-peticion/ResourcePlate';
import { Zone, ZoneLine } from './parts/s04-peticion/Zone';
import { EventCard, OptionButton, PilotNote } from './parts/s05-contexto/Bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-contexto';
const L = warehouseLayout(SIM.pane.w, SIM.nave.h, SIM_NAVE);
const CARD_H = simCardHeight([...REQUEST2.same, ...REQUEST2.odd], 32);
/** From the test event on, the cards column starts under the think prompt's band. */
const LOW_Y = SIM.nave.y - 2;
const EVENT_Y = LOW_Y + 88;
/** The annulled order, held up beside the mozo's tray (clear of the shelf and of the track). */
const TRAY_ZOOM = { w: 176, at: { x: L.x.tray + 0.3 * L.hDown + 94, y: L.floorY + L.slab + 8 + 53 } } as const;
const dot = <span style={{ color: C.faint, margin: '0 10px' }}>·</span>;
/** The three limits, each in the colour of what draws it: the order's mode, its clock, the zone. */
const SCOPE_TONE = ['amber', 'cyan', 'emerald'] as const;

/**
 * s05-contexto «Otro país, las tres de la madrugada». The same simulator; the stamp «diseño y simulación
 * · sin efectos» is on screen from the first frame to the last.
 *   req2      request 2: «misma cuenta» · «mismo portátil»; the request goes up to the office again.
 *   odd       «otro país» · «03:00» (amber).
 *   step-up   the office asks for more proof (amber dots): «el engine pide un segundo factor», a
 *             requirement inside the simulator, and the port's plan, in the future.
 *   (s05-03)  «la exigencia sube o baja según el contexto», then its name, ADAPTIVE IDENTITY.
 *   readonly  the engine would grant «solo lectura · 30 min»: the order is printed so, goes down to the
 *             tray and the traffic flows.
 *   event     «evento de prueba · a los 10 min»: «EDR: malware en el portátil» (rose, on the laptop).
 *   think     the two buttons «PEP» and «administrator» under the engine's prompt; the page holds still
 *             and nothing answers.
 *   (s05-05)  «administrator» lights; the EDR's signal reaches the office, which decides to close
 *             (the only verdict mark); on `revoke` the decision reaches the administrativo and the order
 *             is annulled; the PEP cuts the traffic: «sesión cerrada · 10 min».
 *   scope     THREAT SCOPE REDUCTION and its three limits, still before the exam card lands.
 *   pilot     «siguiente paso · piloto con el ERP de pruebas · Seguridad · 11-12».
 */
export function S05Contexto(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 12) => progress(frame, start, dur);

  const req2At = props.cue('req2');
  const stepUpAt = props.cue('step-up');
  const readonlyAt = props.cue('readonly');
  const eventAt = props.cue('event');
  const thinkAt = props.cue('think');
  const revokeAt = props.cue('revoke');
  const scopeAt = props.cue('scope');
  const pilotAt = props.cue('pilot');
  const s3 = segment(props, 's05-03');
  const s4 = segment(props, 's05-04');
  // The silent hold of the think prompt: nothing moves between these two frames.
  const holdFrom = at('s05-04', 'sesión') + 20;
  const holdTo = s4.to;
  const hold = windowWeight(frame, holdFrom - 4, holdTo + 2, { ramp: 8, lead: 0 });

  // ---------------- Request 2 ----------------
  // `odd` («pero desde otro país, a las tres…»): each amber field lands on its own words.
  const oddAt = [Math.max(props.cue('odd'), at('s05-01', 'país') - 10), at('s05-01', 'tres') - 8];
  const rows: SimRow[] = [
    ...REQUEST2.same.map((r, i): SimRow => ({ ...r, show: p(at('s05-01', i === 0 ? 'misma' : 'mismo') - 4, 10) })),
    ...REQUEST2.odd.map((r, i): SimRow => ({ ...r, rule: i === 0, show: p(oddAt[i], 10), lit: windowWeight(frame, oddAt[i], stepUpAt - 6) })),
  ];
  const stageOne = 1 - p(eventAt - 12, 12);
  const docked = p(s3.from - 2);
  const granted = [p(Math.max(readonlyAt, at('s05-03', 'solo') - 4), 10), p(at('s05-03', 'media') - 4, 10)];

  // The request reaches the counter and goes up to the office, as in s04.
  const slipT = progress(frame, req2At + 6, 26, EASE.inOut);
  const capT = progress(frame, req2At + 36, 24, EASE.inOut);
  const deskSlip = p(req2At + 58, 8);

  // ---------------- The office's verdicts (the only ones in the scene) ----------------
  // `readonly` («Si lo supera…»): the request for more proof is met; on «daría» the office would say yes.
  const yesAt = Math.max(readonlyAt + 10, at('s05-03', 'daría') - 2);
  const noAt = at('s05-05', 'decide') - 2;
  const askV = p(stepUpAt - 2, 10) * (1 - p(readonlyAt, 8));
  const yesV = p(yesAt, 10) * (1 - p(eventAt - 16, 10));
  const noV = p(noAt, 10);
  const verdictKind = noV > 0 ? 'no' : yesV > 0 ? 'yes' : 'ask';

  // ---------------- Read only, 30 min ----------------
  const horaAt = at('s05-03', 'hora');
  const decisionT = progress(frame, yesAt + 2, 14, EASE.inOut);
  const orderShow = progress(frame, yesAt + 8, 8, EASE.out);
  const zoomPrinter = progress(frame, yesAt + 12, 12, EASE.out) * (1 - progress(frame, horaAt - 6, 10, EASE.inOut));
  const travel = progress(frame, horaAt + 2, 18, EASE.inOut);
  const landed = horaAt + 20;
  const trafficDraw = progress(frame, landed - 4, 14, EASE.inOut);

  // ---------------- The test event ----------------
  const edrAt = at('s05-04', 'detecta') - 4;
  const alert = p(edrAt, 12);
  const clock = mix(0.03, 1 / 3, progress(frame, eventAt, 30, EASE.inOut));

  // ---------------- The answer, in the voice's order ----------------
  const chosen = p(at('s05-05', 'administrator') - 2, 12);
  const veAt = at('s05-05', 've');
  const signalDraw = progress(frame, veAt - 10, 16, EASE.inOut);
  const signalT = progress(frame, veAt - 6, 28, EASE.inOut);
  // The office's decision reaches the administrativo while the voice says «decide cerrar»; on `revoke`
  // (the «block» sound) he annuls the order.
  const revFrom = noAt + 8;
  const revT = progress(frame, revFrom, Math.max(10, revokeAt - 4 - revFrom), EASE.inOut);
  const revoked = progress(frame, revokeAt, 12, EASE.out);
  const zoomTray = progress(frame, revokeAt - 8, 12, EASE.out);
  const cortaAt = at('s05-05', 'corta') - 4;
  const cut = progress(frame, cortaAt, 14, EASE.inOut);
  const closed = p(cortaAt + 12);
  const revoking = frame >= revFrom - 2;

  // ---------------- Scope and next step ----------------
  const scopeIn = p(scopeAt - 2, 14);
  const chipAt = [at('s05-06', 'solo') - 4, at('s05-06', 'media') - 4, at('s05-06', 'solo', 1) - 4];
  const pilot = progress(frame, pilotAt, 12, EASE.out);
  // The recap chips and the two buttons leave the column's top when the next step lands there.
  const leave = 1 - p(pilotAt - 12, 10);

  // The zone's lines share one place: each is gone before the next one starts.
  const span = (from: number, to: number) => progress(frame, from, 8) * (1 - progress(frame, to - 8, 6));
  const engineAt = at('s05-05', 'engine') - 4;
  const pepAt = at('s05-05', 'PEP') - 6;

  // The traffic's dashes stop while the think prompt is up.
  const phase = (Math.min(frame, holdFrom) + Math.max(0, frame - holdTo)) / 30;
  const focus = {
    office: Math.max(windowWeight(frame, stepUpAt, s3.from - 4), windowWeight(frame, veAt + 8, revokeAt - 6)),
    admin: Math.max(windowWeight(frame, yesAt + 14, horaAt + 2), windowWeight(frame, revokeAt, cortaAt - 2)),
    mozo: windowWeight(frame, cortaAt, scopeAt - 4),
    requester: windowWeight(frame, edrAt, thinkAt - 4),
  };
  const ring = { x: L.at.requesterHand.x + 0.06 * L.hDown, y: L.at.requesterHand.y - 0.06 * L.hDown };

  return (
    <Stage>
      <SimFrame headerDim={hold}>
        {/* ---- Cards column, first half: request 2 and what the engine answers ---- */}
        {stageOne > 0.001 ? (
          <div style={{ position: 'absolute', left: SIM.col.x, top: SIM.col.y, width: SIM.col.w, opacity: stageOne, fontFamily: FONT.sans }}>
            <SimCard title={REQUEST2.title} rows={rows} width={SIM.col.w} size={32} tone="plain" skeleton={1} show={p(req2At - 6, 14)} glow={0.5 * windowWeight(frame, req2At, stepUpAt - 6)} />
            <div style={{ position: 'absolute', left: 0, top: CARD_H + 14 }}>
              <SimChip tone="amber" size={30} show={docked}>
                {STEP_UP.line}
              </SimChip>
            </div>
            <div style={{ position: 'absolute', left: 6, top: CARD_H + 72, fontSize: 26, fontWeight: 650, lineHeight: 1.22, color: '#fcd34d', whiteSpace: 'nowrap', opacity: 0.9 * docked }}>
              {STEP_UP.note.split(' lo ')[0]}
              <br />
              {'lo ' + STEP_UP.note.split(' lo ')[1]}
            </div>
            <div style={{ position: 'absolute', left: 0, top: CARD_H + 152 }}>
              <SimChip tone="amber" size={38} icon="file" show={granted[0]}>
                <span>{READ_ONLY[0]}</span>
                <span style={{ opacity: granted[1] }}>
                  {dot}
                  <span style={{ color: C.textStrong }}>{READ_ONLY[1]}</span>
                </span>
              </SimChip>
            </div>
          </div>
        ) : null}

        {/* ---- Cards column, second half: the event, the two buttons, the result ---- */}
        {frame >= eventAt - 6 ? (
          <div style={{ position: 'absolute', left: SIM.col.x, top: 0, width: SIM.col.w, fontFamily: FONT.sans }}>
            {/* What the session was: left of the think prompt's band */}
            <div style={{ position: 'absolute', left: 0, top: SIM.col.y + 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, opacity: p(eventAt + 2) * leave }}>
              <SimChip tone="amber" size={26} dim={0.3}>
                {REQUEST2.odd[0].text}
                {dot}
                <span style={{ fontFamily: FONT.mono }}>{REQUEST2.odd[1].text}</span>
              </SimChip>
              <SimChip tone="amber" size={26} dim={0.3}>
                {READ_ONLY[0]}
                {dot}
                {READ_ONLY[1]}
              </SimChip>
            </div>
            <div style={{ position: 'absolute', left: 0, top: LOW_Y, width: SIM.col.w, display: 'flex', justifyContent: 'flex-end', gap: 22, opacity: leave }}>
              <OptionButton label={OPTIONS.pep} show={p(thinkAt - 2)} glow={p(thinkAt + 10)} chosen={-chosen} />
              <OptionButton label={OPTIONS.administrator} show={p(thinkAt + 4)} glow={p(thinkAt + 10)} chosen={chosen} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: EVENT_Y }}>
              <EventCard head={EVENT.head} line={EVENT.line} width={SIM.col.w} show={p(eventAt - 2, 14)} lineShow={p(at('s05-04', 'EDR') - 6)} glow={0.6 * windowWeight(frame, edrAt, thinkAt - 4)} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: EVENT_Y + 130 }}>
              <SimChip tone="rose" size={38} icon="x" show={closed} glow={0.5 * windowWeight(frame, cortaAt + 12, scopeAt - 4)}>
                {CLOSED[0]}
                {dot}
                <span style={{ color: C.textStrong }}>{CLOSED[1]}</span>
              </SimChip>
            </div>
            <div style={{ position: 'absolute', left: 0, top: SIM.col.y + 2 }}>
              <PilotNote {...PILOT} show={pilot} />
            </div>
          </div>
        ) : null}

        {/* ---- The live line ---- */}
        <Zone>
          <ZoneLine
            show={span(oddAt[0], stepUpAt - 2)}
            tone="amber"
            main={
              <span>
                {REQUEST2.odd[0].text}
                <span style={{ opacity: p(oddAt[1], 10) }}>
                  {dot}
                  <span style={{ fontFamily: FONT.mono }}>{REQUEST2.odd[1].text}</span>
                </span>
              </span>
            }
          />
          <ZoneLine
            show={span(stepUpAt - 2, s3.from)}
            mainSize={50}
            main={
              <SimChip tone="amber" size={40}>
                {STEP_UP.line}
              </SimChip>
            }
            sub={<span style={{ color: '#fcd34d' }}>{STEP_UP.note}</span>}
            subShow={p(at('s05-02', 'proveedor') - 6)}
            subSize={28}
          />
          <ZoneLine show={span(s3.from + 2, eventAt - 4)} main={<SimTerm size={44}>{ADAPTIVE.term}</SimTerm>} mainShow={p(at('s05-03', 'adaptive') - 6)} sub={<span style={{ color: C.textStrong, fontWeight: 800 }}>{ADAPTIVE.line}</span>} subShow={p(at('s05-03', 'exigencia') - 6)} subSize={38} />
          <ZoneLine show={span(engineAt, revokeAt - 2)} mainSize={44} main={REVOKE[0]} />
          <ZoneLine show={span(revokeAt - 2, pepAt)} mainSize={44} main={REVOKE[1]} />
          <ZoneLine show={span(pepAt, scopeAt - 2)} mainSize={44} main={REVOKE[2]} />
          <ZoneLine
            show={scopeIn}
            top={8}
            main={<SimTerm size={46} glow={windowWeight(frame, at('s05-06', 'threat'), Number.POSITIVE_INFINITY)}>{SCOPE.term}</SimTerm>}
            subSize={46}
            sub={
              <span style={{ display: 'flex', gap: 16 }}>
                {SCOPE.chips.map((c, i) => (
                  <SimChip key={c} tone={SCOPE_TONE[i]} size={32} show={p(chipAt[i], 10)}>
                    {c}
                  </SimChip>
                ))}
              </span>
            }
          />
        </Zone>

        {/* ---- The nave ---- */}
        <div style={{ position: 'absolute', left: SIM.pane.x, top: SIM.nave.y, fontFamily: FONT.sans }}>
          <Warehouse
            width={SIM.pane.w}
            height={SIM.nave.h}
            {...SIM_NAVE}
            pepName="PEP"
            requesterCarry="laptop"
            requesterCarryMark={frame >= edrAt ? C.rose : undefined}
            mozoCarry={slipT >= 0.999 && capT <= 0.001 ? 'slip' : 'none'}
            deskSlip={deskSlip}
            verdict={Math.max(askV, yesV, noV)}
            verdictKind={verdictKind}
            printing={p(yesAt + 6, 8) * (1 - p(yesAt + 30, 14))}
            trayGlow={p(landed - 2, 8) * (1 - p(landed + 18, 20))}
            flows={{
              request: { lit: Math.max(0.25, p(req2At + 2, 8) * (1 - 0.7 * p(req2At + 40, 20))), mark: slipT },
              consult: { lit: Math.max(0.2, p(req2At + 34, 8) * (1 - 0.7 * p(req2At + 70, 20))), mark: capT },
              decision: revoking ? { lit: Math.max(0.3, p(revFrom, 8) * (1 - 0.5 * p(revokeAt + 40, 20))), mark: revT, tone: C.rose } : { lit: Math.max(0.2, p(yesAt + 2, 8) * (1 - 0.7 * p(yesAt + 30, 20))), mark: decisionT },
              issue: revoking ? { lit: Math.max(0.3, p(revokeAt - 4, 8) * (1 - 0.5 * p(revokeAt + 50, 20))), tone: C.rose } : { lit: Math.max(0.2, p(horaAt, 8) * (1 - 0.7 * p(landed + 10, 20))) },
              signal: { draw: signalDraw, lit: p(veAt - 6, 8) * (1 - 0.5 * p(revokeAt + 20, 20)), mark: signalT },
            }}
            traffic={{ draw: trafficDraw, lit: p(landed, 10), phase, cut }}
            order={{
              show: orderShow,
              travel,
              zoom: Math.max(zoomPrinter, zoomTray),
              zoomWidth: zoomTray > 0 ? TRAY_ZOOM.w : 224,
              zoomAt: zoomTray > 0 ? TRAY_ZOOM.at : undefined,
              mode: READ_ONLY[0],
              modeTone: 'amber',
              expiry: READ_ONLY[1],
              clock,
              revoked,
              glow: 0.6 * zoomPrinter,
            }}
            labels={{ engine: 1, administrator: 1, pep: 1 }}
            planes={{ control: 0.6, data: 0.6 }}
            zone={0.85 * trafficDraw * (1 - 0.6 * cut * (1 - p(chipAt[2], 10)))}
            focus={focus}
            autoDim={false}
          />
          <ResourcePlate x={L.at.shelf.x} y={L.groundY - 0.2 * L.hDown} text={RESOURCE} />
          {/* The EDR's alert on the laptop (the signal to the office starts here, later) */}
          {alert > 0.001 ? (
            <svg width={SIM.pane.w} height={SIM.nave.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <circle cx={ring.x} cy={ring.y} r={mix(8, 25, alert)} fill={alpha(C.rose, 0.14)} stroke={C.rose} strokeWidth={4} opacity={alert} style={{ filter: `drop-shadow(0 0 10px ${alpha(C.rose, 0.7)})` }} />
            </svg>
          ) : null}
        </div>
      </SimFrame>
    </Stage>
  );
}
