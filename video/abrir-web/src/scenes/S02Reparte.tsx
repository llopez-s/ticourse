import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, windowWeight } from '../../../engine/src/ui';
import { Stage } from './kit';
import { ConfigCard } from './parts/ConfigCard';
import { Lanes, LaneArrow, laneX, type LaneDef } from './parts/Lanes';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';

const LANES_W = 1068;
const LANES_H = 500;
const X = [laneX(0, LANES_W), laneX(1, LANES_W), laneX(2, LANES_W)] as const;
const LANES: LaneDef[] = [
  { title: 'portátil', tone: 'cyan', icon: 'laptop' },
  { title: 'otros equipos', tone: 'muted' },
  { title: 'router', sub: 'servidor DHCP', tone: 'sky', icon: 'router' },
];

// Rows of the exchange (lane-local y).
const ASK_Y = 222;
const OFFER_Y = 318;
const REQ_Y = 398;
const ACK_Y = 478;

/** A message label centred over an arrow, on an opaque plate so the middle lane's lifeline does not cross the words. */
function Msg({ x1, x2, y, text, show, dim = 0, color = C.text }: { x1: number; x2: number; y: number; text: string; show: number; dim?: number; color?: string }) {
  if (show <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: (x1 + x2) / 2,
        top: y - 66,
        transform: `translateX(-50%) translateY(${(1 - show) * 8}px)`,
        padding: '2px 18px',
        borderRadius: RADIUS.md,
        background: alpha(C.ink950, 0.92),
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        color,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, show * 1.6) * (1 - 0.6 * dim),
      }}
    >
      {text}
    </div>
  );
}

/**
 * s02-reparte «¿Quién reparte?».
 *   blank     the laptop's network card, all blank, with «concesión del viernes · caducada».
 *   ask       «¿alguien reparte?» goes to the whole network (a fan to the other devices) …
 *   server    … and only the router (the DHCP server) answers.
 *   offer / request / ack   the other three messages (ding on `ack`).
 *   card / mask / gateway / resolver   the card fills row by row; then the DHCP box of the ribbon lights.
 * The lanes use three columns (portátil · otros equipos · router) so that «a toda la red» is literal: the fan
 * reaches the middle column and only the right one answers. Addresses are on screen only.
 */
export function S02Reparte(props: SceneProps) {
  const frame = useCurrentFrame();
  const blank = props.cue('blank');
  const ask = props.cue('ask');
  const server = props.cue('server');
  const offer = props.cue('offer');
  const request = props.cue('request');
  const ack = props.cue('ack');
  const card = props.cue('card');
  const mask = props.cue('mask');
  const gateway = props.cue('gateway');
  const resolver = props.cue('resolver');

  const cardIn = progress(frame, blank - 6, 20);
  const typeP = (at: number, dur = 36) => progress(frame, at, dur, EASE.linear);
  const fill = [typeP(card), typeP(mask), typeP(gateway), typeP(resolver)];
  const glow = [
    windowWeight(frame, card, mask, { ramp: 8, lead: 0 }),
    windowWeight(frame, mask, gateway, { ramp: 8, lead: 0 }),
    windowWeight(frame, gateway, resolver, { ramp: 8, lead: 0 }),
    windowWeight(frame, resolver, resolver + 90, { ramp: 8, lead: 0 }),
  ];
  const stale = 1 - progress(frame, card - 4, 14);
  const done = progress(frame, resolver + 54, 18);

  // The exchange fades back once the card starts to fill (it stays readable, dimmed).
  const late = progress(frame, card, 20, EASE.inOut);
  const askDraw = progress(frame, ask + 2, 24, EASE.inOut);
  const offerDraw = progress(frame, offer + 2, 20, EASE.inOut);
  const reqDraw = progress(frame, request + 2, 18, EASE.inOut);
  const ackDraw = progress(frame, ack + 2, 18, EASE.inOut);
  const devicesIn = progress(frame, ask - 4, 14);
  const devicesDim = progress(frame, server, 16, EASE.inOut);
  const devicesOut = 1 - progress(frame, offer - 8, 14, EASE.inOut);
  const routerGlow = windowWeight(frame, server, offer, { ramp: 12 });
  const dimArrows = 0.6 * late;

  // The fan: from the laptop's lifeline to the two other devices; only the main arrow reaches the router.
  const fanY = [ASK_Y - 52, ASK_Y + 52];

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, { DHCP: resolver + 70 })} />

      <div style={{ position: 'absolute', left: 0, top: 100, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 18}px)` }}>
        <ConfigCard fill={fill} stale={stale} fresh={1 - stale} glow={glow} done={done} />
      </div>

      <div style={{ position: 'absolute', left: 660, top: 96 }}>
        <Lanes
          lanes={LANES}
          width={LANES_W}
          height={LANES_H}
          at={ask - 28}
          glow={[0, 0, routerGlow]}
          dim={[0.5 * late, 0.55 + 0.3 * late, 0.5 * late]}
        >
          {/* the fan to the other devices */}
          <svg width={LANES_W} height={LANES_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: devicesIn * (1 - 0.5 * devicesDim) * devicesOut }}>
            {fanY.map((y, i) => {
              const x1 = X[0] + 12;
              const x2 = X[1] - 40;
              const d = progress(frame, ask + 2 + i * 3, 22, EASE.inOut);
              const tx = x1 + (x2 - x1) * d;
              const ty = ASK_Y + (y - ASK_Y) * d;
              return (
                <g key={i} opacity={1 - 0.5 * late}>
                  <line x1={x1} y1={ASK_Y} x2={tx} y2={ty} stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeLinecap="round" />
                  {d > 0.9 ? <circle cx={x2} cy={y} r={6} fill={alpha(C.cyan, 0.8)} /> : null}
                </g>
              );
            })}
          </svg>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: X[1] - 27,
                top: fanY[i] - 27,
                opacity: devicesIn * (1 - 0.55 * devicesDim) * devicesOut,
              }}
            >
              <Icon name={i === 0 ? 'desktop' : 'server'} size={54} color={C.muted} strokeWidth={1.6} />
            </div>
          ))}

          {/* 1. ask: to everybody */}
          <LaneArrow x1={X[0] + 12} x2={X[2] - 14} y={ASK_Y} draw={askDraw} color={C.cyan} dim={dimArrows} />
          <Msg x1={X[1] + 30} x2={X[2]} y={ASK_Y} text="¿alguien reparte?" show={progress(frame, ask, 14)} dim={late} />
          {/* 2. offer */}
          <LaneArrow x1={X[2] - 14} x2={X[0] + 12} y={OFFER_Y} draw={offerDraw} color={C.sky} dim={dimArrows} />
          <Msg x1={X[0]} x2={X[2]} y={OFFER_Y} text="te ofrezco esta" show={progress(frame, offer, 14)} dim={late} color="#bae6fd" />
          {/* 3. request */}
          <LaneArrow x1={X[0] + 12} x2={X[2] - 14} y={REQ_Y} draw={reqDraw} color={C.cyan} dim={dimArrows} />
          <Msg x1={X[0]} x2={X[2]} y={REQ_Y} text="la quiero" show={progress(frame, request, 12)} dim={late} />
          {/* 4. ack */}
          <LaneArrow x1={X[2] - 14} x2={X[0] + 12} y={ACK_Y} draw={ackDraw} color={C.sky} dim={dimArrows} />
          <Msg x1={X[0]} x2={X[2]} y={ACK_Y} text="es tuya" show={progress(frame, ack, 12)} dim={late} color="#bae6fd" />
        </Lanes>
      </div>

      <ImaginaSeal />
    </Stage>
  );
}
