import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui';
import { S05 } from '../data/s05-sedes';
import { polylinePath } from './parts/glyphs';
import { Sites, corridorPoint, launchAnchor, launchPoint, sitesLayout, sitesPoint } from './parts/Sites';
import { ClientLaptop, DateStamp, MiniCorridor, MiniLaunch, TermTag } from './parts/s05-sedes/Bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-sedes';
const W = 1728;

// The two sites fill the stage under a 96-px top band (the date stamp, later the two exam names).
const SITES = { w: 1440, x: (W - 1440) / 2, y: 104 } as const;
const SL = sitesLayout(SITES.w);
const toStage = (p: { x: number; y: number }) => ({ x: SITES.x + p.x, y: SITES.y + p.y });
const GW_SEDE = toStage(sitesPoint(SITES.w, 'gatewaySede'));
const GW_TERM = toStage(sitesPoint(SITES.w, 'gatewayTerminal'));
const MID = toStage(corridorPoint(SITES.w, 0.5));
/** Where the launch waits (route start): the laptop with its client stands there before it boards. */
const LAUNCH_W = 280 * SL.scale;
const BOAT0 = (() => {
  const lp = launchPoint(SITES.w, 0);
  const wl = launchAnchor(LAUNCH_W, 'waterline');
  return toStage({ x: lp.x - wl.x + LAUNCH_W / 2, y: lp.y - wl.y + 70 * SL.scale });
})();
const CLIENT_BOX = { w: 196, h: 128 } as const;
const TAG_GAP = 40;
/** Its own tunnel: along the launch's route on the water, to the sede's jetty. */
const ROUTE = Array.from({ length: 33 }, (_, i) => toStage(launchPoint(SITES.w, i / 32)));

/** Packets launched every `step` frames inside the windows; each crosses the corridor in `cross` frames. */
function corridorPackets(frame: number, windows: readonly (readonly [number, number])[], step = 40, cross = 120): number[] {
  const out: number[] = [];
  for (const [from, to] of windows) {
    for (let launch = from; launch < to; launch += step) {
      if (frame >= launch && frame < launch + cross) out.push((frame - launch) / cross);
    }
  }
  return out;
}

/**
 * s05-sedes «Un pasillo y una lancha».
 *   two-sites   the stamp «25-11 · miércoles · revisión del túnel entre la sede y la terminal»; the two
 *               sites draw in with the corridor that already joins them (lit on «túnel»).
 *   gateways    the street «Internet» in focus, cars on it; on «salidas» the two doors light and
 *               «pasarela de la sede» / «pasarela de la terminal» appear.
 *   transparent the equipment of both sites: «no instalan nada · no saben que existe».
 *   corridor    the corridor in focus (covered walkway across the street, never a bridge); packets
 *               cross it on «Lo usa quien está dentro».
 *   client      everything steps back; one person with a laptop at the water's edge (right); on «abre»
 *               its own thin tunnel draws along the water to the sede's jetty; «cliente» on «programa».
 *   launch      the laptop boards the launch (one person, «cliente» tag); on «pides» it sails to the
 *               jetty; it stays in focus («solo te lleva a ti»).
 *   names       the stamp leaves; SITE-TO-SITE VPN (with a small corridor) as the corridor lights, then
 *               REMOTE ACCESS VPN (with a small launch) on «lancha». (Exam card, top band.)
 *   s05-08      «El túnel de la terminal es un pasillo»: the corridor and both gateway doors light,
 *               packets cross; on «Ahora» one packet stops in the middle of the corridor and glows
 *               («a ver qué lleva dentro»). Holds.
 */
export function S05Sedes(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const twoSitesAt = props.cue('two-sites');
  const gatewaysAt = props.cue('gateways');
  const transparentAt = props.cue('transparent');
  const corridorAt = props.cue('corridor');
  const clientAt = props.cue('client');
  const launchAt = props.cue('launch');
  const namesAt = props.cue('names');
  const s08 = segment(props, 's05-08');

  const at = {
    tunel: w('s05-01', 'túnel'),
    salidas: w('s05-02', 'salidas'),
    usa: w('s05-04', 'usa'),
    abre: w('s05-05', 'abre'),
    programa: w('s05-05', 'programa'),
    pides: w('s05-06', 'pides'),
    lancha7: w('s05-07', 'lancha'),
    ahora: w('s05-08', 'Ahora'),
    dentro: w('s05-08', 'dentro'),
  };

  // ---- The drawing --------------------------------------------------------------------------
  // The sites and the corridor that already joins them are there from the start (drawn in with the
  // scene's entrance, never built on screen).
  const draw = progress(frame, Math.min(-8, twoSitesAt - 30), 24);
  const corridor = progress(frame, Math.min(4, twoSitesAt - 20), 18, EASE.inOut);
  const gateways = progress(frame, at.salidas - 4, 14);
  const traffic = progress(frame, gatewaysAt - 4, 20);
  // The caption has done its job once the launch comes (it would sit under the launch's tag).
  const transparent = progress(frame, transparentAt + 2, 16) * (1 - progress(frame, clientAt - 6, 14, EASE.inOut));
  const END = Number.POSITIVE_INFINITY;
  const focus = {
    street: windowWeight(frame, gatewaysAt, at.salidas, { ramp: 12 }),
    corridor: Math.max(
      windowWeight(frame, at.tunel, gatewaysAt, { ramp: 12 }),
      windowWeight(frame, at.salidas, transparentAt, { ramp: 12 }),
      windowWeight(frame, corridorAt, clientAt, { ramp: 12 }),
      windowWeight(frame, namesAt, at.lancha7, { ramp: 12 }),
      windowWeight(frame, s08.from, END, { ramp: 14 }),
    ),
    equipment: windowWeight(frame, transparentAt, corridorAt, { ramp: 12 }),
    launch: Math.max(windowWeight(frame, clientAt, namesAt, { ramp: 12 }), windowWeight(frame, at.lancha7, s08.from, { ramp: 12 })),
  };

  // Packets in the corridor: «lo usa quien está dentro», when the corridor is named, and in s05-08.
  const holdFrom = at.ahora - 6;
  const packets = corridorPackets(frame, [
    [at.usa - 24, clientAt - 30],
    [namesAt, at.lancha7 - 20],
    [s08.from - 4, holdFrom - 40],
  ]);
  const hold = progress(frame, holdFrom, 40, EASE.out);
  if (frame >= holdFrom) packets.push(0.5 * hold + 0.0001);
  const holdGlow = progress(frame, at.dentro - 10, 16);

  // Gateway doors: lit on «salidas … pasarelas», again in s05-08.
  const doors = Math.max(windowWeight(frame, at.salidas, transparentAt, { ramp: 12 }), windowWeight(frame, s08.from, END, { ramp: 14 }));

  // ---- The laptop and the launch -------------------------------------------------------------
  const boardAt = launchAt - 4;
  const clientIn = progress(frame, clientAt + 4, 16) * (1 - progress(frame, boardAt, 12, EASE.inOut));
  const clientTag = progress(frame, at.programa - 4, 12);
  const ownTunnel = progress(frame, at.abre - 2, 40, EASE.inOut);
  const ownTunnelOut = progress(frame, s08.from, 16);
  const launch = progress(frame, boardAt + 2, 14);
  const launchT = progress(frame, at.pides - 4, 100, EASE.inOut);

  // ---- The top band: stamp, then the two exam names --------------------------------------------
  const stampIn = progress(frame, 0, 14);
  const stampOut = progress(frame, namesAt - 16, 12, EASE.inOut);
  const siteTag = progress(frame, namesAt, 16);
  const remoteTag = progress(frame, at.lancha7 - 4, 16);
  const tagsDim = 0.35 * progress(frame, s08.from + 6, 16);
  const siteGlow = windowWeight(frame, namesAt, at.lancha7, { ramp: 10 });
  const remoteGlow = windowWeight(frame, at.lancha7, s08.from, { ramp: 10 });

  // Its own tunnel, drawn from the laptop towards the jetty.
  const routeN = Math.max(2, Math.round(ownTunnel * (ROUTE.length - 1)) + 1);
  const routePts = ROUTE.slice(0, routeN);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: SITES.x, top: SITES.y }}>
        <Sites
          width={SITES.w}
          draw={draw}
          corridor={corridor}
          gateways={gateways}
          traffic={traffic}
          transparent={transparent}
          packet={packets}
          launch={launch}
          launchT={launchT}
          launchClient={1}
          focus={focus}
          frame={frame}
        />
      </div>

      {/* Overlays: the gateway doors, the held packet, the launch's own tunnel */}
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {doors > 0.01
          ? [GW_SEDE, GW_TERM].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={50 * SL.scale + 14} fill="none" stroke={C.cyanSoft} strokeWidth={4} opacity={doors * 0.9} style={{ filter: `drop-shadow(0 0 10px ${alpha(C.cyan, 0.7)})` }} />
            ))
          : null}
        {holdGlow > 0.01 ? (
          <circle cx={MID.x} cy={MID.y} r={44 + 6 * holdGlow} fill="none" stroke={C.cyanSoft} strokeWidth={4} opacity={holdGlow} style={{ filter: `drop-shadow(0 0 12px ${alpha(C.cyan, 0.8)})` }} />
        ) : null}
        {ownTunnel > 0.01 && ownTunnelOut < 1 ? (
          <path d={polylinePath(routePts)} fill="none" stroke={C.cyanSoft} strokeWidth={4} strokeDasharray="10 12" strokeLinecap="round" opacity={0.85 * (1 - ownTunnelOut) * (1 - 0.5 * progress(launchT, 0, 1))} />
        ) : null}
      </svg>

      {/* One person, a laptop and its client (before it becomes the launch) */}
      {clientIn > 0.001 ? (
        <div style={{ position: 'absolute', left: BOAT0.x - CLIENT_BOX.w / 2, top: BOAT0.y - CLIENT_BOX.h / 2 }}>
          <ClientLaptop show={clientIn} client={clientTag} glow={0.5} label={S05.client} />
        </div>
      ) : null}

      {/* Top band: the stamp, then the two exam names */}
      {stampOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 14, width: W, display: 'flex', justifyContent: 'center', opacity: 1 - stampOut }}>
          <DateStamp day={S05.stamp.day} weekday={S05.stamp.weekday} what={S05.stamp.what} show={stampIn} />
        </div>
      ) : null}
      {/* Fixed halves, so the first name does not move when the second arrives */}
      <div style={{ position: 'absolute', left: 0, top: 4, width: W / 2 - TAG_GAP / 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TermTag term={S05.terms.site} art={<MiniCorridor width={92} />} show={siteTag} glow={siteGlow} dim={tagsDim} />
      </div>
      <div style={{ position: 'absolute', left: W / 2 + TAG_GAP / 2, top: 4, display: 'flex' }}>
        <TermTag term={S05.terms.remote} art={<MiniLaunch width={96} />} show={remoteTag} glow={remoteGlow} dim={tagsDim} />
      </div>
    </Stage>
  );
}
