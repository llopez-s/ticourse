import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { Stage, wordFrame } from './kit';
import { PORTAL_IP } from './parts/data';
import { Parcel } from './parts/Glyphs';
import { CaseStamp, Line, TrainingTag } from './parts/Marks';
import { PLANO, Plano, routeFraction, routePoint } from './parts/Plano';
import { ROUTE_TABLE_W, RouteTable, routeRowTop } from './parts/RouteTable';

const S = 's05-internet';
const W = STAGE.width;
const K = 0.8;
const VIEW = { x: Math.round((W - PLANO.w * K) / 2), y: STAGE.height - Math.round(PLANO.h * K), k: K };
const TABLE_K = 0.8;
const F_ISP = routeFraction('isp');
const HOP_FRACTIONS = [routeFraction('hop1'), routeFraction('hop2'), routeFraction('hop3'), routeFraction('hop4')];

/** Closeness (0-1) of a parcel at fraction t to a stop at fraction f. */
const near = (t: number, f: number, span = 0.035) => Math.max(0, 1 - Math.abs(t - f) / span);

/**
 * s05-internet «Hasta el puerto». The whole plan at 0.8 with the route table above it: the portal's address
 * 192.0.2.44 («ejemplo de entrenamiento») fits neither office network and the row «todo lo demás» lights; on
 * `isp` the packet goes to the gateway and out to the provider; on `hops` it jumps router to router; on
 * `signs` a crossroads sign with one arrow appears at each router and only the sign of the current crossing
 * lights (second, slower pass); `routing` labels it; the portal lights on arrival; `wrap` closes the chapter
 * with three lines, the last one while a reply travels back.
 */
export function S05Internet(props: SceneProps) {
  const frame = useCurrentFrame();
  const portalAt = props.cue('portal');
  const ispAt = props.cue('isp');
  const hopsAt = props.cue('hops');
  const signsAt = props.cue('signs');
  const routingAt = props.cue('routing');
  const wrapAt = props.cue('wrap');
  const backAt = wordFrame(S, 's05-07', 'router') - 4;
  const returnAt = wordFrame(S, 's05-07', 'vuelta') - 40;

  // ---- top band: table + portal address, then the routing label, then the recap ----
  const topFade = 1 - progress(frame, wrapAt - 4, 14);
  const tableIn = progress(frame, portalAt - 2, 16);
  const addrIn = enter(frame, portalAt - 2, { distance: 16 });
  const noFitAt = wordFrame(S, 's05-01', 'ninguna') - 4;
  const no0 = progress(frame, noFitAt, 10);
  const no1 = progress(frame, noFitAt + 14, 10);
  const yes = progress(frame, ispAt - 2, 12);
  const rows = [progress(frame, portalAt, 12), progress(frame, portalAt + 8, 12), progress(frame, portalAt + 16, 12)];
  const lit = [0.5 * no0 * (1 - yes), 0.5 * no1 * (1 - yes), yes];
  const routingIn = enter(frame, routingAt - 2, { distance: 16 });
  const addrOut = 1 - progress(frame, routingAt - 4, 12);
  const tableDim = 1 - 0.55 * progress(frame, routingAt - 4, 14);

  // ---- the parcel ----
  const passA = progress(frame, ispAt, 90, EASE.inOut) * F_ISP;
  const passB = F_ISP + (1 - F_ISP) * progress(frame, hopsAt, 140, EASE.inOut);
  const passC = F_ISP + (1 - F_ISP) * progress(frame, signsAt + 24, Math.max(60, routingAt - signsAt - 40), EASE.inOut);
  const t = frame < hopsAt ? passA : frame < signsAt + 20 ? passB : passC;
  const show = progress(frame, ispAt - 6, 8) * (1 - progress(frame, returnAt, 8)) * (frame > hopsAt + 150 && frame < signsAt + 20 ? 0 : 1);
  const p = routePoint(Math.min(0.999, t));
  const hopLit = HOP_FRACTIONS.map((f) => (frame < signsAt + 20 ? near(t, f) * (frame >= hopsAt ? 1 : 0) : 0));
  const signShow = [0, 1, 2, 3].map((i) => progress(frame, signsAt + i * 8, 14));
  const signLit = HOP_FRACTIONS.map((f) => (frame >= signsAt + 20 ? near(t, f, 0.05) : 0));
  const arrive = progress(frame, routingAt - 20, 14);
  const portalGlow = Math.max(progress(frame, portalAt, 12) * 0.4 * (1 - progress(frame, ispAt, 10)), arrive);
  const routerGlow = near(t, F_ISP, 0.03) * (frame >= ispAt - 10 ? 1 : 0);

  // reply travelling back (s05-07)
  const back = progress(frame, returnAt, 90, EASE.inOut);
  const rp = routePoint(Math.max(0.001, 1 - back));

  // ---- recap ----
  const r1 = enter(frame, wrapAt - 2, { distance: 14 });
  const r2 = enter(frame, wordFrame(S, 's05-06', 'salir') - 6, { distance: 14 });
  const r3 = enter(frame, backAt, { distance: 14 });

  return (
    <>
      <Stage>
        {/* ---- top: route table and the portal's address ---- */}
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: tableIn * topFade * tableDim, transformOrigin: 'top left', transform: `scale(${TABLE_K})` }}>
          <RouteTable rows={rows} lit={lit} />
          {[0, 1].map((i) => (
            <div key={i} style={{ position: 'absolute', left: ROUTE_TABLE_W - 62, top: routeRowTop(i) + 8, opacity: i === 0 ? no0 : no1 }}>
              <Icon name="x" size={48} color={C.amber} strokeWidth={3} />
            </div>
          ))}
          <div style={{ position: 'absolute', left: ROUTE_TABLE_W - 62, top: routeRowTop(2) + 8, opacity: yes }}>
            <Icon name="check" size={48} color={C.emerald} strokeWidth={3} />
          </div>
        </div>
        {frame >= portalAt - 4 && addrOut > 0.01 ? (
          <div style={{ position: 'absolute', left: 680, top: 14, ...addrIn, opacity: addrIn.opacity * addrOut * topFade }}>
            <Line size={34} color={C.muted} weight={650}>
              dirección del portal
            </Line>
            <Line size={72} weight={800} style={{ fontFamily: FONT.mono, marginTop: 4, color: C.cyanSoft }}>
              {PORTAL_IP}
            </Line>
            <div style={{ marginTop: 10 }}>
              <TrainingTag />
            </div>
          </div>
        ) : null}
        {frame >= routingAt - 4 ? (
          <div style={{ position: 'absolute', left: 700, top: 40, ...routingIn, opacity: routingIn.opacity * topFade }}>
            <Line size={62} weight={850}>
              <span style={{ color: C.cyan }}>routing</span>: decidir en cada salto
            </Line>
          </div>
        ) : null}

        {/* ---- the plan ---- */}
        <Plano
          view={VIEW}
          glow={{ router: routerGlow, portal: portalGlow, laptop: progress(frame, ispAt - 6, 10) * (1 - progress(frame, ispAt + 40, 14)) * 0.5 }}
          hops={hopLit}
          signs={signShow.map((s, i) => ({ show: s, lit: signLit[i] }))}
          addrs={0}
        >
          {show > 0.01 ? (
            <div style={{ position: 'absolute', left: p.x - 28, top: p.y - 22, opacity: show }}>
              <Parcel width={56} glow={0.5} />
            </div>
          ) : null}
          {back > 0.01 && back < 0.999 ? (
            <div style={{ position: 'absolute', left: rp.x - 28, top: rp.y - 22 }}>
              <Parcel width={56} tone="emerald" glow={0.5} />
            </div>
          ) : null}
        </Plano>

        {/* ---- recap (chapter close) ---- */}
        {frame >= wrapAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 6, width: W, display: 'grid', gap: 10, justifyItems: 'start' }}>
            <div style={r1}>
              <Line size={48} weight={800}>
                dentro de tu calle <span style={{ color: C.cyan }}>entregas tú</span>
              </Line>
            </div>
            <div style={r2}>
              <Line size={48} weight={800}>
                para salir, <span style={{ color: C.cyan }}>puerta de enlace</span>
              </Line>
            </div>
            <div style={r3}>
              <Line size={48} weight={800}>
                cada router elige el siguiente paso, <span style={{ color: C.emerald }}>también a la vuelta</span>
              </Line>
            </div>
          </div>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}
