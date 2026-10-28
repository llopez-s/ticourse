import type { ReactNode } from 'react';
import { Icon } from '../../../../engine/src/ui/Icon';
import { RouterBox } from './Router';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Edificio } from './Edificio';
import { SignPost } from './Carteles';
import { DeviceTile } from './Glyphs';
import { GATEWAY_OFFICE, GATEWAY_SERVERS, ISP_LEG, LAPTOP, PORTAL_IP, PORTAL_NAME, PRINTER, SERVER } from './data';
import { polyFraction, polyLength, polyPath, polyPoint, type Point } from './geo';

/**
 * THE PLAN: office · router with the firewall inside · cloud «Internet» with four unnamed routers · portal.
 * Left to right and identical in every scene that shows it. The port's internal network is never drawn.
 * Native size PLANO.w x PLANO.h (stage-local 1728 x 540); place it with `view` ({x, y, k}) and draw packets
 * as `children`, which share the native coordinate space (use PLANO points and ROUTE).
 */
export const PLANO = {
  w: 1728,
  h: 540,
  office: { x: 0, y: 0, w: 430, h: 540 },
  laptop: { x: 110, y: 170 },
  printer: { x: 330, y: 170 },
  server: { x: 220, y: 410 },
  routerBox: { x: 620, y: 190, w: 210, h: 200 },
  router: { x: 725, y: 290 },
  legOffice: { x: 620, y: 255 },
  legServers: { x: 620, y: 325 },
  legIsp: { x: 830, y: 290 },
  cloud: { x: 1090, y: 285, w: 440, h: 390 },
  hops: [
    { x: 965, y: 345 },
    { x: 1065, y: 235 },
    { x: 1165, y: 355 },
    { x: 1262, y: 245 },
  ] as Point[],
  portal: { x: 1428, y: 14, w: 300, h: 380 },
  portalDoor: { x: 1428, y: 220 },
} as const;

/** The packet's route from the laptop to the portal (native plan coordinates). */
export const ROUTE: Point[] = [
  { x: PLANO.laptop.x, y: 268 },
  { x: PLANO.laptop.x, y: 300 },
  { x: PLANO.office.w, y: 300 },
  PLANO.legOffice,
  PLANO.router,
  PLANO.legIsp,
  PLANO.hops[0],
  PLANO.hops[1],
  PLANO.hops[2],
  PLANO.hops[3],
  PLANO.portalDoor,
];
/** Indexes of the named stops in ROUTE. */
export const ROUTE_AT = { laptop: 0, officeExit: 2, router: 4, isp: 5, hop1: 6, hop2: 7, hop3: 8, hop4: 9, portal: 10 } as const;
/** Fraction (0-1) of the whole route at which a stop sits. */
export function routeFraction(stop: keyof typeof ROUTE_AT): number {
  return polyFraction(ROUTE, ROUTE_AT[stop]);
}
/** Point of the route at fraction t. */
export function routePoint(t: number): Point {
  return polyPoint(ROUTE, t);
}

export type NodeKey = 'laptop' | 'printer' | 'server' | 'router' | 'cloud' | 'portal';
type Weights = Partial<Record<NodeKey, number>>;

export interface PlanView {
  x: number;
  y: number;
  k: number;
}
export const FULL_VIEW: PlanView = { x: 0, y: 0, k: 1 };

/** Map a native plan point to stage-local coordinates for a given view. */
export function planToStage(p: Point, view: PlanView = FULL_VIEW): Point {
  return { x: view.x + p.x * view.k, y: view.y + p.y * view.k };
}

function Leg({ a, b, color, opacity = 1 }: { a: Point; b: Point; color: string; opacity?: number }) {
  return <path d={`M${a.x},${a.y} L${b.x},${b.y}`} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={opacity} fill="none" />;
}

export function Plano({
  view = FULL_VIEW,
  show,
  glow,
  dim,
  legs = 0,
  dashed = 0,
  hops,
  signs,
  addrs = 0,
  names = 1,
  originTransform,
  children,
}: {
  view?: PlanView;
  /** 0-1 reveal of each zone (default all drawn). */
  show?: Partial<Record<'office' | 'router' | 'cloud' | 'portal', number>>;
  glow?: Weights;
  dim?: Weights;
  /** 0-1: the three legs of the router get their labels (192.168.20.1, 192.168.30.1, proveedor de Internet). */
  legs?: number;
  /** 0-1: the dashed line laptop-portal draws itself. */
  dashed?: number;
  /** Light (0-1) of each of the four cloud routers. */
  hops?: readonly number[];
  /** Per cloud router: a crossroads sign with one arrow (show 0-1, lit 0-1). */
  signs?: readonly { show: number; lit: number }[];
  /** 0-1: addresses under the laptop, printer and server. */
  addrs?: number;
  /** 0-1: names under the devices. */
  names?: number;
  /** CSS transform-origin in native coordinates (for zoom-out animations). */
  originTransform?: Point;
  children?: ReactNode;
}) {
  const sh = (k: 'office' | 'router' | 'cloud' | 'portal') => show?.[k] ?? 1;
  const g = (k: NodeKey) => glow?.[k] ?? 0;
  const d = (k: NodeKey) => dim?.[k] ?? 0;
  const route = polyPath(ROUTE);
  const routeLen = polyLength(ROUTE);
  const org = originTransform ?? { x: 0, y: 0 };
  return (
    <div
      style={{
        position: 'absolute',
        left: view.x,
        top: view.y,
        width: PLANO.w,
        height: PLANO.h,
        transform: `scale(${view.k})`,
        transformOrigin: `${org.x}px ${org.y}px`,
      }}
    >
      {/* ---- links (under everything) ---- */}
      <svg width={PLANO.w} height={PLANO.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g opacity={Math.min(sh('office'), sh('router'))}>
          <Leg a={{ x: PLANO.office.w, y: 300 }} b={PLANO.legOffice} color={alpha(C.cyan, 0.5)} />
          <Leg a={{ x: PLANO.office.w, y: 410 }} b={PLANO.legServers} color={alpha(C.cyan, 0.5)} />
        </g>
        <g opacity={Math.min(sh('router'), sh('cloud'))}>
          <Leg a={PLANO.legIsp} b={PLANO.hops[0]} color={alpha(C.sky, 0.5)} />
        </g>
        <g opacity={Math.min(sh('cloud'), sh('portal'))}>
          <Leg a={PLANO.hops[3]} b={PLANO.portalDoor} color={alpha(C.sky, 0.5)} />
        </g>
        <g opacity={sh('cloud')}>
          {PLANO.hops.slice(0, 3).map((p, i) => (
            <Leg key={i} a={p} b={PLANO.hops[i + 1]} color={alpha(C.sky, 0.35)} />
          ))}
        </g>
        {dashed > 0 ? (
          <>
            <mask id="plano-dash-mask" maskUnits="userSpaceOnUse" x={-40} y={-40} width={PLANO.w + 80} height={PLANO.h + 80}>
              <path d={route} fill="none" stroke="#ffffff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${routeLen} ${routeLen}`} strokeDashoffset={routeLen * (1 - dashed)} />
            </mask>
            <path d={route} fill="none" stroke={C.cyanSoft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="14 16" opacity={0.9} mask="url(#plano-dash-mask)" />
          </>
        ) : null}
      </svg>

      {/* ---- office ---- */}
      <div style={{ position: 'absolute', left: PLANO.office.x, top: PLANO.office.y, width: PLANO.office.w, height: PLANO.office.h, opacity: sh('office') }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.lg, border: `2px solid ${C.ink600}`, background: alpha(C.ink850, 0.7) }} />
        <div style={{ position: 'absolute', left: 24, top: 16, fontFamily: FONT.sans, fontSize: 30, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>Oficina de la naviera</div>
      </div>
      {[
        { key: 'laptop' as const, kind: 'laptop' as const, host: LAPTOP, at: PLANO.laptop },
        { key: 'printer' as const, kind: 'printer' as const, host: PRINTER, at: PLANO.printer },
        { key: 'server' as const, kind: 'server' as const, host: SERVER, at: PLANO.server },
      ].map(({ key, kind, host, at }) => (
        <div key={key} style={{ position: 'absolute', left: at.x - 150, top: at.y - 48, width: 300, display: 'flex', justifyContent: 'center', opacity: sh('office') }}>
          <DeviceTile kind={kind} tile={96} name={names > 0.01 ? host.name : undefined} sub={addrs > 0.01 ? `${host.ip}/${host.prefix}` : undefined} glow={g(key)} dim={d(key)} subSize={24} style={{ opacity: names }} />
        </div>
      ))}

      {/* ---- router with the firewall inside ---- */}
      <div style={{ position: 'absolute', left: PLANO.routerBox.x, top: PLANO.routerBox.y, width: PLANO.routerBox.w, opacity: sh('router') * (1 - 0.6 * d('router')) }}>
        <RouterBox width={PLANO.routerBox.w} height={PLANO.routerBox.h} glow={g('router')} name={names > 0.01 ? 'router · cortafuegos' : null} style={{ opacity: 1 }} />
      </div>
      {/* the three legs, labelled */}
      {legs > 0.01 ? (
        <div style={{ opacity: legs * sh('router') }}>
          <div style={{ position: 'absolute', left: PLANO.office.w + 6, top: 196, fontFamily: FONT.mono, fontSize: 26, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{GATEWAY_OFFICE}</div>
          <div style={{ position: 'absolute', left: PLANO.office.w + 6, top: 346, fontFamily: FONT.mono, fontSize: 26, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{GATEWAY_SERVERS}</div>
          <div style={{ position: 'absolute', left: PLANO.legIsp.x + 6, top: PLANO.legIsp.y - 62, width: 130, fontFamily: FONT.sans, fontSize: 26, fontWeight: 650, lineHeight: 1.1, color: C.sky }}>{ISP_LEG}</div>
        </div>
      ) : null}

      {/* ---- Internet ---- */}
      <div style={{ position: 'absolute', left: PLANO.cloud.x - PLANO.cloud.w / 2, top: PLANO.cloud.y - PLANO.cloud.h / 2, width: PLANO.cloud.w, height: PLANO.cloud.h, opacity: sh('cloud') * (1 - 0.6 * d('cloud')) }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at 50% 45%, ${alpha(C.sky, 0.14 + 0.1 * g('cloud'))}, ${alpha(C.sky, 0.04)} 70%, transparent 74%)`,
            border: `2px dashed ${alpha(C.sky, 0.35 + 0.4 * g('cloud'))}`,
          }}
        />
        <div style={{ position: 'absolute', left: 0, right: 0, top: PLANO.cloud.h + 2, textAlign: 'center', fontFamily: FONT.sans, fontSize: 44, fontWeight: 800, color: C.sky }}>Internet</div>
      </div>
      {PLANO.hops.map((p, i) => {
        const lit = hops?.[i] ?? 0;
        const sg = signs?.[i];
        return (
          <div key={i} style={{ position: 'absolute', left: p.x - 34, top: p.y - 34, width: 68, height: 68, opacity: sh('cloud') * (1 - 0.6 * d('cloud')) }}>
            <div
              style={{
                width: 68,
                height: 68,
                boxSizing: 'border-box',
                borderRadius: 18,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.sky, 0.1 + 0.18 * lit),
                border: `2px solid ${alpha(C.sky, 0.5 + 0.5 * lit)}`,
                boxShadow: lit > 0.01 ? `0 0 ${Math.round(34 * lit)}px ${alpha(C.sky, 0.55 * lit)}` : undefined,
              }}
            >
              <Icon name="router" size={40} color={C.sky} />
            </div>
            {sg && sg.show > 0.01 ? (
              <div style={{ position: 'absolute', left: i % 2 === 0 ? 36 : -112, top: i % 2 === 0 ? 30 : -118, opacity: sg.show }}>
                <SignPost plates={[{ dir: 1, lit: sg.lit, tilt: i % 2 === 0 ? -4 : 4 }]} scale={0.85} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* ---- portal ---- */}
      <div style={{ position: 'absolute', left: PLANO.portal.x, top: PLANO.portal.y, width: PLANO.portal.w, opacity: sh('portal') * (1 - 0.6 * d('portal')) }}>
        <Edificio width={PLANO.portal.w} height={PLANO.portal.h} glow={g('portal')} />
        <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: 30, fontWeight: 700, lineHeight: 1.18, color: C.textStrong, width: PLANO.portal.w, opacity: names }}>{PORTAL_NAME}</div>
        {addrs > 0.01 ? <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.cyanSoft, opacity: addrs }}>{PORTAL_IP}</div> : null}
      </div>

      {children}
    </div>
  );
}
