import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Chip } from '../../../engine/src/ui/Chip';
import { Icon } from '../../../engine/src/ui/Icon';
import { Stage, wordFrame } from './kit';
import { SignPost } from './parts/Carteles';
import { GATEWAY_OFFICE, GATEWAY_SERVERS, ISP_LEG, LAPTOP, SERVER } from './parts/data';
import { DeviceTile, Parcel } from './parts/Glyphs';
import { CaseStamp, ImageTag, Line } from './parts/Marks';
import { RouterBox } from './parts/Router';
import { RouteTable } from './parts/RouteTable';

const S = 's04-salida';
const W = STAGE.width;
const Y = 470;
const LAP = { x: 150, y: Y };
const RT = { x: 864, y: Y };
const SRV = { x: 1520, y: Y };
const X_LAP = LAP.x + 66;
const X_R1 = RT.x - 110;
const X_R2 = RT.x + 110;
const X_SRV = SRV.x - 66;

/** A mono pill that follows a parcel and says where it is going (the destination never changes at the router). */
function DestTag({ x, text, tone = C.cyanSoft, opacity }: { x: number; text: string; tone?: string; opacity: number }) {
  return (
    <div style={{ position: 'absolute', left: x - 175, top: Y - 106, width: 350, textAlign: 'center', opacity }}>
      <span style={{ display: 'inline-block', padding: '4px 16px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(tone, 0.7)}`, background: alpha(C.ink950, 0.92), fontFamily: FONT.mono, fontSize: 26, fontWeight: 700, color: tone, whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  );
}

/**
 * s04-salida «La salida de tu calle». Laptop and file server on two different streets with a «?» between
 * them; on `config` the laptop's network settings come in with «puerta de enlace 192.168.20.1» highlighted;
 * on `handoff` the packet goes to the router first (its destination tag does not change); on `gateway` the
 * router lights with its three legs («la salida de tu calle»); on `table` the route table and the crossroads
 * signs arrive; on `forward` the server's row lights and the packet leaves by the other leg; on `back` the
 * reply returns along the first row; on `missing` the amber variant: the reply loops near the server under
 * «sin ruta de vuelta» while the request has arrived.
 */
export function S04Salida(props: SceneProps) {
  const frame = useCurrentFrame();
  const configAt = props.cue('config');
  const handoffAt = props.cue('handoff');
  const gatewayAt = props.cue('gateway');
  const tableAt = props.cue('table');
  const forwardAt = props.cue('forward');
  const backAt = props.cue('back');
  const missingAt = props.cue('missing');

  const amber = progress(frame, missingAt - 2, 10);
  const routerIn = progress(frame, configAt + 10, 20);
  const question = (1 - progress(frame, configAt, 14)) * 0.9;

  // ---- config panel ----
  const cfg = enter(frame, configAt - 2, { distance: 18 });
  const gwHi = progress(frame, wordFrame(S, 's04-01', 'apuntada') - 4, 12);
  const cfgDim = 0.5 * progress(frame, tableAt - 6, 14);

  // ---- packet to the router (handoff) ----
  const goAt = wordFrame(S, 's04-03', 'entrega') - 8;
  const toRouter = progress(frame, goAt, 50, EASE.inOut);
  const reqX = frame < forwardAt ? X_LAP + (X_R1 - X_LAP) * toRouter : X_R2 + (X_SRV - 20 - X_R2) * progress(frame, forwardAt + 14, 56, EASE.inOut);
  const reqShow = progress(frame, goAt - 6, 8);
  const hop = progress(frame, goAt + 44, 14);
  const hopText = enter(frame, goAt + 40, { distance: 12 });
  // while the packet waits inside the router the tag keeps the original destination

  // ---- gateway ----
  const gw = progress(frame, gatewayAt - 2, 14) * (1 - progress(frame, tableAt - 4, 14) * 0.7);
  const legs = progress(frame, gatewayAt - 4, 14);
  const exitAt = wordFrame(S, 's04-04', 'salida') - 6;
  const exitLabel = enter(frame, exitAt, { distance: 14 });
  const exitOut = 1 - progress(frame, tableAt + 4, 14);

  // ---- table ----
  const t0 = progress(frame, wordFrame(S, 's04-06', 'cada') - 12, 14);
  const t1 = progress(frame, wordFrame(S, 's04-06', 'cada') + 6, 14);
  const t2 = progress(frame, wordFrame(S, 's04-06', 'demás') - 6, 14);
  const tableIn = progress(frame, tableAt - 2, 14);
  const fwd = progress(frame, forwardAt - 4, 12) * (1 - progress(frame, backAt - 6, 12));
  const back = progress(frame, backAt - 2, 12) * (1 - amber);
  const lit = [back, fwd, 0];
  // the router's own row (a connected route) never fails; what is missing is the server's way back (its gateway)
  const miss = [0, 0, 0];
  const signs = progress(frame, tableAt + 8, 18);

  // ---- reply (back) ----
  const replyAt = wordFrame(S, 's04-07', 'contesta') - 6;
  const replyP = progress(frame, replyAt, 110, EASE.inOut);
  const replyX = X_SRV - 20 - (X_SRV - 20 - X_LAP) * replyP;
  const replyShow = progress(frame, replyAt - 4, 8) * (1 - amber);
  const replyTag = progress(frame, replyAt, 10) * (1 - amber);

  // ---- missing: the reply loops, the request has arrived ----
  const loopIn = progress(frame, missingAt, 26, EASE.inOut);
  const ang = Math.max(0, frame - (missingAt + 26)) * 0.085;
  const loopX = frame < missingAt + 26 ? X_SRV - 20 - (X_SRV - 20 - 1390) * loopIn : 1300 + 90 * Math.cos(ang);
  const loopY = frame < missingAt + 26 ? Y : Y + 62 * Math.sin(ang);
  const reached = progress(frame, missingAt + 4, 12);
  const legGlowRight = Math.max(fwd, amber * 0.4);
  const legGlowLeft = Math.max(back, toRouter * (1 - progress(frame, forwardAt, 10)));

  return (
    <>
      <Stage>
        {/* ---- top left: the laptop's network settings ---- */}
        {frame >= configAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 6, width: 640, boxSizing: 'border-box', padding: '12px 22px 16px', borderRadius: RADIUS.lg, border: `2px solid ${C.ink600}`, background: C.ink850, ...cfg, opacity: cfg.opacity * (1 - cfgDim * 0.6) }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted, marginBottom: 6 }}>configuración de red del portátil</div>
            {[
              { k: 'dirección IP', v: `${LAPTOP.ip}/${LAPTOP.prefix}`, hi: 0 },
              { k: 'puerta de enlace', v: GATEWAY_OFFICE, hi: 1 },
            ].map((r) => (
              <div
                key={r.k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 64,
                  marginTop: 8,
                  padding: '0 18px',
                  borderRadius: RADIUS.md,
                  border: `2px solid ${r.hi ? alpha(C.cyan, 0.35 + 0.6 * gwHi) : C.ink700}`,
                  background: r.hi ? alpha(C.cyan, 0.06 + 0.14 * gwHi) : 'transparent',
                  boxShadow: r.hi && gwHi > 0.05 ? `0 0 ${Math.round(28 * gwHi)}px ${alpha(C.cyan, 0.35 * gwHi)}` : undefined,
                }}
              >
                <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: r.hi ? C.textStrong : C.text }}>{r.k}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 750, color: r.hi ? C.cyanSoft : C.text }}>{r.v}</span>
              </div>
            ))}
          </div>
        ) : null}

        {/* ---- top: the route table and the crossroads signs ---- */}
        {tableIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 676, top: 0, opacity: tableIn }}>
            <RouteTable rows={[t0, t1, t2]} lit={lit} miss={miss} />
          </div>
        ) : null}
        {signs > 0.01 ? (
          <div style={{ position: 'absolute', left: 1500, top: 0, opacity: signs }}>
            <SignPost
              plates={[
                { dir: -1, lit: lit[0] + miss[0] * 0.0, tilt: -4 },
                { dir: 1, lit: lit[1], tilt: 3 },
                { dir: 1, lit: 0, tilt: -3 },
              ]}
              scale={0.92}
            />
          </div>
        ) : null}
        {signs > 0.01 ? (
          <div style={{ position: 'absolute', left: 1400, top: 236, opacity: signs }}>
            <ImageTag />
          </div>
        ) : null}

        {/* ---- the two streets ---- */}
        <div style={{ position: 'absolute', left: LAP.x - 170, top: Y - 50, width: 340, display: 'flex', justifyContent: 'center' }}>
          <DeviceTile kind="laptop" tile={100} name={LAPTOP.name} sub={`${LAPTOP.ip}/${LAPTOP.prefix}`} glow={gwHi * (1 - progress(frame, handoffAt + 40, 14)) * 0.5} />
        </div>
        <div style={{ position: 'absolute', left: SRV.x - 200, top: Y - 50, width: 400, display: 'flex', justifyContent: 'center' }}>
          <DeviceTile kind="server" tile={100} name={SERVER.name} sub={`${SERVER.ip}/${SERVER.prefix}`} tone={amber > 0.5 ? 'amber' : 'cyan'} glow={reached * 0.4} />
        </div>

        {/* the line between them and the question mark */}
        <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {question > 0.01 ? <path d={`M${X_LAP + 10},${Y} H${X_SRV - 10}`} stroke={alpha(C.faint, 0.8)} strokeWidth={4} strokeDasharray="12 14" opacity={question} /> : null}
          <path d={`M${X_LAP},${Y} H${X_R1}`} stroke={alpha(C.cyan, 0.3 + 0.6 * legGlowLeft)} strokeWidth={4 + 2 * legGlowLeft} strokeLinecap="round" opacity={routerIn} />
          <path d={`M${X_R2},${Y} H${X_SRV}`} stroke={alpha(C.cyan, 0.3 + 0.6 * legGlowRight)} strokeWidth={4 + 2 * legGlowRight} strokeLinecap="round" opacity={routerIn} />
          <path d={`M${RT.x},${Y + 85} V${Y + 128}`} stroke={alpha(C.sky, 0.55)} strokeWidth={4} strokeLinecap="round" opacity={routerIn} />
        </svg>
        {question > 0.01 ? (
          <div style={{ position: 'absolute', left: RT.x - 50, top: Y - 62, width: 100, textAlign: 'center', fontFamily: FONT.sans, fontSize: 96, fontWeight: 850, color: C.amber, opacity: question }}>?</div>
        ) : null}

        {/* ---- the router ---- */}
        <div style={{ position: 'absolute', left: RT.x - 110, top: Y - 85, opacity: routerIn }}>
          <RouterBox width={220} height={170} glow={gw} name={null} iconSize={72} />
        </div>
        <div style={{ position: 'absolute', left: RT.x - 200, top: Y - 160, width: 400, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.textStrong, opacity: routerIn, whiteSpace: 'nowrap' }}>router · cortafuegos</div>
        {legs > 0.01 ? (
          <div style={{ opacity: legs }}>
            <div style={{ position: 'absolute', left: (X_LAP + X_R1) / 2 - 130, top: Y - 54, width: 260, textAlign: 'center', fontFamily: FONT.mono, fontSize: 30, fontWeight: 750, color: C.cyanSoft }}>{GATEWAY_OFFICE}</div>
            <div style={{ position: 'absolute', left: (X_R2 + X_SRV) / 2 - 130, top: Y - 54, width: 260, textAlign: 'center', fontFamily: FONT.mono, fontSize: 30, fontWeight: 750, color: C.cyanSoft }}>{GATEWAY_SERVERS}</div>
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: RT.x - 220, top: Y + 128, width: 440, textAlign: 'center', opacity: routerIn }}>
          <Chip accent="muted" size={30}>
            {ISP_LEG}
          </Chip>
        </div>
        {exitOut > 0.01 && frame >= exitAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 250, width: W, textAlign: 'center', ...exitLabel, opacity: exitLabel.opacity * exitOut }}>
            <Line size={48} weight={800} color={C.cyan}>
              default gateway · la salida de tu calle
            </Line>
          </div>
        ) : null}

        {/* ---- parcels ---- */}
        {reqShow > 0.01 && amber < 0.5 ? (
          <>
            <div style={{ position: 'absolute', left: reqX - 32, top: Y - 24, opacity: reqShow }}>
              <Parcel width={64} glow={0.4} />
            </div>
            <DestTag x={reqX} text={`destino ${SERVER.ip}`} opacity={reqShow * (1 - replyShow) * (1 - progress(frame, forwardAt + 60, 10))} />
          </>
        ) : null}
        {hop > 0.01 && frame < forwardAt ? (
          <div style={{ position: 'absolute', left: RT.x - 300, top: Y + 96, width: 600, textAlign: 'center', ...hopText, opacity: hopText.opacity * (1 - progress(frame, gatewayAt - 4, 10)) }}>
            <Line size={34} color={C.cyanSoft} weight={750}>
              siguiente salto: el router
            </Line>
          </div>
        ) : null}
        {replyShow > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: replyX - 32, top: Y - 24, opacity: replyShow }}>
              <Parcel width={64} tone="emerald" glow={0.4} />
            </div>
            <DestTag x={replyX} text={`destino ${LAPTOP.ip}`} tone={C.emerald} opacity={replyTag * replyShow} />
          </>
        ) : null}
        {amber > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: loopX - 32, top: loopY - 24, opacity: amber }}>
              <Parcel width={64} tone="amber" glow={0.5} />
            </div>
            <div style={{ position: 'absolute', left: 1064, top: Y - 176, width: 664, textAlign: 'center', ...enter(frame, missingAt + 6, { distance: 12 }) }}>
              <Line size={46} color={C.amber} weight={850}>
                sin ruta de vuelta
              </Line>
              <Line size={30} color={C.amber} weight={700} style={{ marginTop: 4 }}>
                falta o falla la puerta de enlace del servidor
              </Line>
            </div>
            <div style={{ position: 'absolute', left: SRV.x - 250, top: Y + 138, width: 500, display: 'flex', justifyContent: 'center', opacity: reached }}>
              <Chip accent="emerald" icon="check" size={30}>
                la petición sí llegó
              </Chip>
            </div>
          </>
        ) : null}
        {amber > 0.01 ? (
          <div style={{ position: 'absolute', left: SRV.x + 70, top: Y - 70, opacity: 0.4 + 0.6 * pulse(frame, 30, 0.8) }}>
            <Icon name="alert" size={44} color={C.amber} />
          </div>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}
