import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { focusWeights, mix, windowWeight } from '../../../engine/src/ui';
import { ORDER, POLICY, REQUEST, REQUEST_SAID, RESOURCE, RESULT, STEPS, SUBJECT, VERDICT, ZONE } from '../data/s04-peticion';
import { SIM, SIM_NAVE, SimCard, SimFrame, SimTerm, simCardHeight, type SimRow } from './parts/Sim';
import { Warehouse, warehouseLayout } from './parts/Warehouse';
import { ResourcePlate } from './parts/s04-peticion/ResourcePlate';
import { StepBar, Zone, ZoneLine } from './parts/s04-peticion/Zone';
import { Stage, wordFrame } from './kit';

const S = 's04-peticion';
const POLICY_SIZE = 26;
const REQUEST_SIZE = 32;
const POLICY_H = simCardHeight(POLICY.rows, POLICY_SIZE);
const REQUEST_Y = SIM.col.y + POLICY_H + 8;
const L = warehouseLayout(SIM.pane.w, SIM.nave.h, SIM_NAVE);
/** «Nada está en marcha»: the stamp lands big over the nave, then goes to its place under the cards. */
const STAMP_BIG = { x: SIM.pane.x + 26, y: SIM.zone.y + 40, scale: 1.55 } as const;

/**
 * s04-peticion «Una petición, paso a paso». The nave of s03, now inside the policy simulator.
 *   sim         the simulator's header: «simulador de políticas» · «propuesta de Seguridad» · «sin
 *               efectos: el ERP no se toca». The policy card is there from the first frame, empty; its
 *               rows write themselves from «ERP» on (it is read on screen only).
 *   policy      the policy is complete, and the stamp «diseño y simulación · sin efectos» lands big over
 *               the nave (nothing is running); it goes to its place under the cards before `request`.
 *   request     request 1 and whoever makes it (a figure with a laptop); on «Cuentan» SUBJECT/SYSTEM
 *               and «la persona y su portátil: los dos cuentan».
 *   consult     step 1 «la petición llega al PEP» (the slip reaches the counter); on «pregunta» step 2
 *               «el PEP pregunta a la oficina» (up the order system).
 *   decide      step 3 «el engine decide»: the request's rows light with «cuenta, portátil y hora», and
 *               the office — nobody else — says «diría que sí».
 *   issue       step 4 «el administrator emite la orden: token de 30 min»: the order is printed, held
 *               up («orden», then «token»), and goes down to the mozo's tray.
 *   traffic     step 5 «el tráfico va a una zona mínima».
 *   zone        IMPLICIT TRUST ZONE around the ERP's shelf, with its two lines.
 *   grant       «concedido · lectura y escritura · 30 min».
 *   planes      the cards step back; the two floors tint: CONTROL PLANE above (lit), DATA PLANE below.
 *   pdp         the bracket around the office and the administrativo, PDP. Everything is still when the
 *               exam card lands.
 *   data-plane  DATA PLANE lights; the PEP and the traffic glow.
 */
export function S04Peticion(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 12) => progress(frame, start, dur);

  const simAt = props.cue('sim');
  const policyAt = props.cue('policy');
  const requestAt = props.cue('request');
  const consultAt = props.cue('consult');
  const decideAt = props.cue('decide');
  const issueAt = props.cue('issue');
  const trafficAt = props.cue('traffic');
  const zoneAt = props.cue('zone');
  const grantAt = props.cue('grant');
  const planesAt = props.cue('planes');
  const pdpAt = props.cue('pdp');
  const dataAt = props.cue('data-plane');

  // ---------------- The simulator's chrome ----------------
  const header = [p(simAt - 12), p(simAt - 6), p(simAt)];
  const headerLit = [
    windowWeight(frame, at('s04-01', 'simulador'), policyAt - 4),
    windowWeight(frame, at('s04-01', 'Seguridad'), at('s04-01', 'política')),
    windowWeight(frame, policyAt, requestAt - 4),
  ];
  const stamp = progress(frame, policyAt + 4, 10, EASE.out);
  const stampGlow = windowWeight(frame, policyAt + 6, requestAt - 2);
  const dock = progress(frame, requestAt - 8, 20, EASE.inOut);
  const stampAt = { x: mix(STAMP_BIG.x, SIM.stamp.x, dock), y: mix(STAMP_BIG.y, SIM.stamp.y, dock), scale: mix(STAMP_BIG.scale, 1, dock) };

  // ---------------- The cards ----------------
  const policyIn = p(0, 14);
  const requesterIn = p(requestAt - 6, 14);
  const erpAt = at('s04-01', 'ERP') - 4;
  // The policy writes itself while the voice presents it («…para el ERP, y la pruebas en un simulador»)
  // and is complete on `policy`: its last row and its small tag land with the cue.
  const lastRow = POLICY.rows.length - 1;
  const policyRows: SimRow[] = POLICY.rows.map((r, i) => ({ ...r, show: p(mix(erpAt, policyAt - 2, i / lastRow), 10) }));
  const requestIn = p(requestAt - 4, 14);
  const cuentanAt = at('s04-02', 'Cuentan') - 6;
  const said = {
    persona: windowWeight(frame, at('s04-02', 'persona'), at('s04-02', 'portátil') - 2),
    laptop: windowWeight(frame, at('s04-02', 'portátil'), consultAt - 6),
    cuenta: windowWeight(frame, at('s04-03', 'cuenta'), issueAt - 6),
    portatil: windowWeight(frame, at('s04-03', 'portátil'), issueAt - 6),
    hora: windowWeight(frame, at('s04-03', 'hora'), issueAt - 6),
  };
  const rowLit = (i: number) =>
    Math.max(
      (REQUEST_SAID.cuenta as readonly number[]).includes(i) ? Math.max(said.persona, said.cuenta) : 0,
      (REQUEST_SAID.portatil as readonly number[]).includes(i) ? Math.max(said.laptop, said.portatil) : 0,
      (REQUEST_SAID.hora as readonly number[]).includes(i) ? said.hora : 0,
    );
  const requestRows: SimRow[] = REQUEST.rows.map((r, i) => ({ ...r, show: p(requestAt + i * 3, 10), lit: rowLit(i) }));
  const cardsBack = 0.6 * progress(frame, planesAt - 6, 18, EASE.inOut);

  // ---------------- The five steps ----------------
  const step2At = at('s04-03', 'pregunta') - 6;
  const starts = [consultAt - 4, step2At, decideAt - 2, issueAt - 2, trafficAt - 2];
  const live = focusWeights(frame, starts, { end: grantAt - 4, ramp: 8 });
  const liveIndex = starts.reduce((n, s, i) => (frame >= s - 4 ? i + 1 : n), 0);
  const stepsOn = p(consultAt - 10) * (1 - p(planesAt - 6, 14));
  // 1: the request reaches the counter.
  const slipT = progress(frame, consultAt + 4, 28, EASE.inOut);
  // 2: the mozo asks the office, up the order system.
  const capT = progress(frame, step2At + 2, 26, EASE.inOut);
  const deskSlip = p(step2At + 25, 8);
  // 3: the office decides.
  const verdictAt = at('s04-03', 'diría') - 2;
  const verdict = progress(frame, verdictAt, 10, EASE.out);
  // 4: the administrativo prints the order (the token) and leaves it in the mozo's tray.
  const decisionT = progress(frame, at('s04-03', 'sí') + 2, 22, EASE.inOut);
  const emiteAt = at('s04-04', 'emite');
  const tokenAt = at('s04-04', 'token') - 3;
  const printing = p(issueAt + 2, 8) * (1 - p(emiteAt + 26, 16));
  const orderShow = progress(frame, emiteAt - 4, 8, EASE.out);
  const zoom = progress(frame, emiteAt + 4, 14, EASE.out) * (1 - progress(frame, trafficAt - 24, 12, EASE.inOut));
  const travel = progress(frame, trafficAt - 14, 20, EASE.inOut);
  const landed = trafficAt + 6;
  const trayGlow = p(landed - 2, 8) * (1 - p(landed + 20, 24));
  // 5: the traffic goes to a minimal zone.
  const trafficDraw = progress(frame, trafficAt + 2, 18, EASE.inOut);
  // The zone belongs to step 5: it steps out when the planes arrive.
  const zoneIn = p(zoneAt - 2, 14) * (1 - p(planesAt - 8, 14));
  const granted = p(grantAt - 2, 12);

  // ---------------- The planes ----------------
  const planes = progress(frame, planesAt - 2, 18, EASE.inOut);
  const controlOn = p(planesAt + 2, 12);
  const pdp = progress(frame, pdpAt - 2, 14, EASE.inOut);
  const pdpChip = p(at('s04-05', 'PDP') - 6, 10);
  const dataOn = p(dataAt - 2, 12);
  const verbEngine = p(at('s04-05', 'decide') - 4, 10);
  const verbAdmin = p(at('s04-05', 'comunica') - 4, 10);

  // Who the voice is on: a plain glow, the others step back a little.
  const up = [
    windowWeight(frame, at('s04-05', 'oficina'), at('s04-05', 'administrativo') - 2),
    windowWeight(frame, at('s04-05', 'administrativo'), pdpAt - 4),
    windowWeight(frame, at('s04-06', 'PEP'), Number.POSITIVE_INFINITY),
  ];
  const focus = {
    requester: Math.max(said.persona, said.laptop),
    mozo: Math.max(live.weights[0], 0.7 * live.weights[1], live.weights[4], up[2]),
    office: Math.max(live.weights[2], 0.5 * live.weights[1], up[0]),
    admin: Math.max(live.weights[3], up[1]),
    shelf: windowWeight(frame, zoneAt, grantAt - 4),
  };
  const busy = Math.max(...live.weights);
  const back = (own: number) => 0.45 * busy * (1 - own);
  const dim = { requester: back(live.weights[0]), mozo: back(focus.mozo), office: back(focus.office), admin: back(focus.admin), shelf: back(Math.max(live.weights[4], focus.shelf)) };
  const soft = (lit: number, from: number) => lit * (1 - 0.55 * p(from, 20));

  // ---------------- The zone's lines ----------------
  // The lines share one place: each is gone before the next one starts (no two texts over each other).
  const span = (from: number, to: number) => progress(frame, from, 8) * (1 - progress(frame, to - 8, 6));
  const line = (i: number) => span(starts[i], starts[i + 1] ?? zoneAt - 2);
  const subjectLine = span(cuentanAt, starts[0]);
  const zoneLine = span(zoneAt - 2, grantAt - 2);
  const dot = <span style={{ color: C.faint, margin: '0 12px' }}>·</span>;

  return (
    <Stage>
      <SimFrame header={header} lit={headerLit} stamp={stamp} stampGlow={stampGlow} stampAt={stampAt}>
        {/* ---- The cards column ---- */}
        <div style={{ position: 'absolute', left: SIM.col.x, top: SIM.col.y }}>
          <SimCard title={POLICY.title} tag={<SimTerm size={26} icon={false} show={p(policyAt + 4)}>{POLICY.tag}</SimTerm>} rows={policyRows} width={SIM.col.w} size={POLICY_SIZE} skeleton={1} show={policyIn} glow={0.5 * windowWeight(frame, at('s04-01', 'política'), requestAt - 4)} dim={cardsBack} />
        </div>
        <div style={{ position: 'absolute', left: SIM.col.x, top: REQUEST_Y }}>
          <SimCard
            title={REQUEST.title}
            tag={<SimTerm size={30} show={p(cuentanAt)} glow={subjectLine}>{SUBJECT.term}</SimTerm>}
            rows={requestRows}
            width={SIM.col.w}
            size={REQUEST_SIZE}
            tone="plain"
            show={requestIn}
            glow={0.5 * windowWeight(frame, requestAt, consultAt - 6)}
            dim={cardsBack}
          />
        </div>

        {/* ---- The live line ---- */}
        <Zone>
          <StepBar live={frame < grantAt - 4 ? liveIndex : 0} done={frame < grantAt - 4 ? liveIndex - 1 : 5} show={stepsOn} />
          <ZoneLine show={subjectLine} main={SUBJECT.line} mainSize={44} />
          <ZoneLine show={line(0)} n={1} main={STEPS[0]} />
          <ZoneLine show={line(1)} n={2} main={STEPS[1]} />
          <ZoneLine show={line(2)} n={3} main={STEPS[2]} sub={<span style={{ color: '#6ee7b7', fontWeight: 850 }}>{VERDICT}</span>} subShow={verdict} subSize={40} />
          <ZoneLine show={line(3)} n={4} main={STEPS[3].split(': ')[0] + ':'} sub={<span style={{ color: C.cyanSoft, fontWeight: 850 }}>{STEPS[3].split(': ')[1]}</span>} subShow={p(tokenAt - 2)} subSize={40} />
          <ZoneLine show={line(4)} n={5} main={STEPS[4]} />
          <ZoneLine show={zoneLine} n={5} main={ZONE.line} mainSize={42} sub={ZONE.small} subShow={p(zoneAt + 12)} subSize={27} />
          <ZoneLine
            show={granted}
            tone="emerald"
            dim={cardsBack}
            main={
              <span>
                {RESULT[0]}
                {dot}
                <span style={{ color: C.textStrong }}>{RESULT[1]}</span>
                {dot}
                <span style={{ color: C.textStrong }}>{RESULT[2]}</span>
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
            requester={requesterIn}
            requesterShift={-36 * (1 - progress(frame, requestAt - 6, 20, EASE.out))}
            requesterCarry="laptop"
            mozoCarry={slipT >= 0.999 && capT <= 0.001 ? 'slip' : 'none'}
            mozoFacing={frame >= landed - 8 && frame < zoneAt ? 'right' : 'left'}
            deskSlip={deskSlip}
            verdict={verdict}
            printing={printing}
            trayGlow={trayGlow}
            shelfPick={p(trafficAt + 14, 12)}
            flows={{
              request: { draw: requesterIn, lit: Math.max(soft(p(consultAt, 8), consultAt + 40), 0.25), mark: slipT },
              consult: { lit: Math.max(soft(p(step2At, 8), decideAt + 10), 0.2), mark: capT },
              decision: { lit: Math.max(soft(p(at('s04-03', 'sí'), 8), emiteAt + 20), 0.2), mark: decisionT },
              issue: { lit: Math.max(soft(p(trafficAt - 16, 8), trafficAt + 20), 0.2) },
            }}
            traffic={{ draw: trafficDraw, lit: Math.max(p(trafficAt + 4, 10) * (1 - 0.4 * p(planesAt, 20)), windowWeight(frame, at('s04-06', 'tráfico'), Number.POSITIVE_INFINITY)), phase: frame / 30 }}
            order={{ show: orderShow, travel, zoom, zoomWidth: 224, title: frame >= tokenAt ? ORDER.token : ORDER.title, mode: ORDER.mode, expiry: ORDER.expiry, clock: 0.03, glow: 0.6 * zoom }}
            labels={{ engine: 1, administrator: 1, pep: 1, zone: zoneIn, control: controlOn, data: 0.42 * controlOn + 0.58 * dataOn, pdp: pdpChip }}
            verbs={{ engine: verbEngine, administrator: verbAdmin }}
            planes={{ control: planes, data: planes }}
            pdp={pdp}
            zone={zoneIn}
            focus={focus}
            dim={dim}
            autoDim={false}
          />
          {/* The resource's plate, low on the shelf (the DATA PLANE chip takes the corner above it) */}
          <ResourcePlate x={L.at.shelf.x} y={L.groundY - 0.2 * L.hDown} text={RESOURCE} dim={dim.shelf} />
        </div>
      </SimFrame>
    </Stage>
  );
}
