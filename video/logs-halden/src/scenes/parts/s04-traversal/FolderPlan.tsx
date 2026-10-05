import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';
import { DEFENCE, PLAN } from '../../../data/s04-traversal';

/** Plan box (local coordinates). */
export const PLAN_W = 1480;
export const PLAN_H = 340;

type P = { x: number; y: number };
const DX = 170;
const DY = 56;
/** The start folder (the room), four steps up to the root, then `etc` and `passwd`. */
const N0: P = { x: 112, y: 294 };
const UP: P[] = [1, 2, 3, 4].map((k) => ({ x: N0.x + k * DX, y: N0.y - k * DY }));
const ROOT = UP[3];
const ETC: P = { x: ROOT.x + DX, y: ROOT.y + DY };
const FILE: P = { x: ETC.x + DX, y: ETC.y + DY };
/** Every node along the route, in order. */
const ROUTE: P[] = [N0, ...UP, ETC, FILE];
const ROOM = { x: 2, y: N0.y - 44, w: 180, h: 88 } as const;
const FOLDER = { w: 62, h: 46 } as const;

const ROSE_TXT = '#fecdd3';
const EMERALD_TXT = '#6ee7b7';

/** Point at fraction `t` (0–1) of the segment from node `i` to node `i + 1`, trimmed at both folders. */
function segPoints(i: number): [P, P] {
  const a = ROUTE[i];
  const b = ROUTE[i + 1];
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const trim = 36;
  return [
    { x: a.x + ux * trim, y: a.y + uy * trim },
    { x: b.x - ux * trim, y: b.y - uy * trim },
  ];
}

/** Folder glyph centred on (0, 0). */
function Folder({ color, fill, strong }: { color: string; fill: number; strong?: boolean }) {
  const w = FOLDER.w;
  const h = FOLDER.h;
  const x0 = -w / 2;
  const y0 = -h / 2;
  return (
    <path
      d={`M${x0} ${y0 + 8} q0 -8 8 -8 h16 l7 7 h${w - 31} q8 0 8 8 v${h - 15} q0 8 -8 8 h${-(w - 16)} q-8 0 -8 -8 Z`}
      fill={alpha(color, fill)}
      stroke={color}
      strokeWidth={strong ? 3.5 : 2.5}
      strokeLinejoin="round"
    />
  );
}

/** File glyph (`passwd`) centred on (0, 0). */
function FileGlyph({ color, fill }: { color: string; fill: number }) {
  const w = 44;
  const h = 56;
  const x0 = -w / 2;
  const y0 = -h / 2;
  return (
    <g>
      <path
        d={`M${x0} ${y0 + 6} q0 -6 6 -6 h${w - 20} l14 14 v${h - 20} q0 6 -6 6 h${-(w - 12)} q-6 0 -6 -6 Z`}
        fill={alpha(color, fill)}
        stroke={color}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d={`M${x0 + 9} ${y0 + 24} h${w - 18} M${x0 + 9} ${y0 + 33} h${w - 18} M${x0 + 9} ${y0 + 42} h${w - 24}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

/**
 * The folder plan of s04. Before anything climbs, the plan sits faint: the portal's folder in a cyan
 * «room», four unnamed steps up to the root, then `etc` and `passwd`. `steps[k]` (0–1) lights the k-th
 * `../` and the step it climbs; `etc`, `file` light the way down. `served` turns the file rose,
 * `users` writes «lista de usuarios». The defence (s04-08): `calc` traces the whole route as a dashed
 * cyan line from the room while the route itself steps back; `resolve` shows where it ends
 * (`/etc/passwd`); `confine` lights the room's wall emerald; `reject` crosses the end out.
 * All inputs are 0–1 weights; the scene turns frames into them.
 */
export function FolderPlan({
  steps,
  etc,
  file,
  served = 0,
  users = 0,
  roomLeft = 0,
  calc = 0,
  resolve = 0,
  confine = 0,
  reject = 0,
  clerk = 0,
  marker = true,
  style,
}: {
  steps: [number, number, number, number];
  etc: number;
  file: number;
  served?: number;
  users?: number;
  /** The route has left the room (its wall flashes rose). */
  roomLeft?: number;
  calc?: number;
  resolve?: number;
  confine?: number;
  reject?: number;
  /** The clerk in the room (defence only). */
  clerk?: number;
  marker?: boolean;
  style?: CSSProperties;
}) {
  // Lit weight of each route segment (0..5): four climbs, then the two steps down.
  const seg = [...steps, etc, file];
  // Route steps back while the clerk calculates.
  const routeDim = 1 - 0.65 * calc;
  // Where the request is: the last lit node.
  const reached = seg.reduce((n, w) => (w > 0.5 ? n + 1 : n), 0);
  const nodeLit = (i: number) => (i === 0 ? 1 : clamp01(seg[i - 1] ?? 0));
  const wallRose = roomLeft * (1 - confine);
  const wallColor = confine > 0 ? C.emerald : wallRose > 0.01 ? C.rose : C.cyan;

  // The dashed «calculated» route: total length along all segments.
  const segs = ROUTE.slice(0, -1).map((_, i) => segPoints(i));
  const lens = segs.map(([a, b]) => Math.hypot(b.x - a.x, b.y - a.y));
  const total = lens.reduce((s, l) => s + l, 0);

  return (
    <div style={{ position: 'relative', width: PLAN_W, height: PLAN_H, fontFamily: FONT.sans, ...style }}>
      <svg width={PLAN_W} height={PLAN_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* The room: the portal's folder */}
        <rect
          x={ROOM.x}
          y={ROOM.y}
          width={ROOM.w}
          height={ROOM.h}
          rx={18}
          fill={alpha(confine > 0 ? C.emerald : C.cyan, 0.06 + 0.08 * confine)}
          stroke={wallColor}
          strokeOpacity={0.55 + 0.45 * Math.max(wallRose, confine)}
          strokeWidth={3 + 2 * confine}
          strokeDasharray={confine > 0.5 ? undefined : '10 8'}
        />
        {confine > 0 ? (
          <rect
            x={ROOM.x - 8}
            y={ROOM.y - 8}
            width={ROOM.w + 16}
            height={ROOM.h + 16}
            rx={24}
            fill="none"
            stroke={alpha(C.emerald, 0.35 * confine)}
            strokeWidth={10}
          />
        ) : null}

        {/* Faint plan + lit route */}
        {segs.map(([a, b], i) => {
          const w = clamp01(seg[i]);
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={alpha(C.muted, 0.35)} strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" />
              {w > 0 ? (
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={mix(a.x, b.x, w)}
                  y2={mix(a.y, b.y, w)}
                  stroke={C.rose}
                  strokeOpacity={routeDim}
                  strokeWidth={6}
                  strokeLinecap="round"
                />
              ) : null}
            </g>
          );
        })}

        {/* The clerk's calculation: the whole route, dashed, before anyone moves */}
        {calc > 0
          ? (() => {
              let left = calc * total;
              return segs.map(([a, b], i) => {
                const l = lens[i];
                const t = clamp01(left / l);
                left -= l;
                if (t <= 0) return null;
                const head = t > 0 && t < 1 && calc < 1;
                return (
                  <g key={`c${i}`}>
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={mix(a.x, b.x, t)}
                      y2={mix(a.y, b.y, t)}
                      stroke={C.cyanSoft}
                      strokeWidth={7}
                      strokeDasharray="2 13"
                      strokeLinecap="round"
                    />
                    {head ? <circle cx={mix(a.x, b.x, t)} cy={mix(a.y, b.y, t)} r={10} fill={C.cyan} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.9)})` }} /> : null}
                  </g>
                );
              });
            })()
          : null}

        {/* Nodes */}
        {ROUTE.map((p, i) => {
          const isFile = i === ROUTE.length - 1;
          const lit = nodeLit(i);
          if (isFile) {
            const color = served > 0.5 ? C.rose : lit > 0.5 ? C.roseSoft : C.muted;
            return (
              <g key={i} transform={`translate(${p.x} ${p.y})`} opacity={0.55 + 0.45 * lit}>
                <FileGlyph color={color} fill={0.08 + 0.3 * served} />
              </g>
            );
          }
          const color = i === 0 ? C.cyan : lit > 0.5 ? C.roseSoft : C.muted;
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`} opacity={i === 0 ? 1 : 0.5 + 0.5 * lit}>
              <Folder color={color} fill={i === 0 ? 0.18 : 0.06 + 0.12 * lit} strong={i === 0} />
            </g>
          );
        })}

        {/* Where the request is (the last folder it reached) */}
        {marker && reached > 0 && calc < 0.01 ? (
          (() => {
            const i = Math.min(reached, ROUTE.length - 1);
            const p = ROUTE[i];
            return <circle cx={p.x + FOLDER.w / 2 - 2} cy={p.y - FOLDER.h / 2 + 2} r={9} fill={C.rose} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.rose, 0.9)})` }} />;
          })()
        ) : null}

        {/* Rejected: the end of the route is crossed out */}
        {reject > 0 ? (
          <g transform={`translate(${FILE.x} ${FILE.y})`} opacity={reject}>
            <circle r={42} fill={alpha(C.rose, 0.12)} stroke={C.rose} strokeWidth={4} />
            <path d={`M-20 -20 L${-20 + 40 * reject} ${-20 + 40 * reject} M20 -20 L${20 - 40 * reject} ${-20 + 40 * reject}`} stroke={C.rose} strokeWidth={6} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>

      {/* `../` pills on the four climbs */}
      {UP.map((p, k) => {
        const w = clamp01(steps[k]);
        const a = k === 0 ? N0 : UP[k - 1];
        const cx = (a.x + p.x) / 2;
        const cy = (a.y + p.y) / 2;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: cx - 38,
              top: cy - 22,
              width: 76,
              height: 44,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 10,
              background: w > 0 ? alpha(C.rose, 0.18 + 0.12 * w) : alpha(C.ink850, 0.9),
              border: `2px solid ${w > 0 ? alpha(C.rose, 0.4 + 0.5 * w) : alpha(C.muted, 0.25)}`,
              fontFamily: FONT.mono,
              fontSize: 32,
              fontWeight: 800,
              color: w > 0.5 ? ROSE_TXT : alpha(C.muted, 0.6),
              opacity: (0.35 + 0.65 * Math.max(w, 0)) * routeDim + (1 - routeDim) * 0.3,
              transform: `scale(${1 + 0.12 * Math.sin(Math.PI * clamp01(w))})`,
            }}
          >
            {PLAN.dots}
          </div>
        );
      })}

      {/* Labels */}
      <div style={{ position: 'absolute', left: ROOM.x + ROOM.w + 16, top: N0.y + 2, fontSize: 32, fontWeight: 750, color: confine > 0.5 ? EMERALD_TXT : C.cyanSoft, whiteSpace: 'nowrap' }}>
        {PLAN.start}
      </div>
      <div style={{ position: 'absolute', left: ROOT.x - 110, top: ROOT.y - 70, width: 180, textAlign: 'center', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 800, color: nodeLit(4) > 0.5 ? ROSE_TXT : C.text }}>{PLAN.root}</span>
        <span style={{ fontSize: 28, fontWeight: 650, color: C.muted, marginLeft: 10 }}>{PLAN.rootSub}</span>
      </div>
      <div style={{ position: 'absolute', left: ETC.x - 60, top: ETC.y + 28, width: 120, textAlign: 'center', fontFamily: FONT.mono, fontSize: 32, fontWeight: 750, color: nodeLit(5) > 0.5 ? ROSE_TXT : C.muted, whiteSpace: 'nowrap' }}>
        {PLAN.etc}
      </div>
      <div style={{ position: 'absolute', left: FILE.x + 40, top: FILE.y - 44, whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: served > 0.5 || nodeLit(6) > 0.5 ? ROSE_TXT : C.muted }}>{PLAN.passwd}</div>
        {users > 0 ? (
          <div style={{ fontSize: 32, fontWeight: 750, color: C.roseSoft, opacity: users * (1 - resolve), transform: `translateY(${(1 - users) * 8}px)` }}>{PLAN.users}</div>
        ) : null}
      </div>

      {/* Defence: where the calculated route ends */}
      {resolve > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: FILE.x + 40,
            top: FILE.y + 2,
            whiteSpace: 'nowrap',
            opacity: resolve,
            transform: `translateY(${(1 - resolve) * 8}px)`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '2px 12px',
              borderRadius: 10,
              border: `2px solid ${alpha(C.cyan, 0.75)}`,
              background: alpha(C.cyan, 0.12),
              fontFamily: FONT.mono,
              fontSize: 32,
              fontWeight: 800,
              color: C.cyanSoft,
            }}
          >
            {DEFENCE.resolved}
          </span>
        </div>
      ) : null}
      {reject > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: FILE.x + 40,
            top: FILE.y + 56,
            padding: '4px 16px',
            borderRadius: RADIUS.pill,
            background: alpha(C.rose, 0.22),
            border: `2px solid ${alpha(C.rose, 0.9)}`,
            fontSize: 34,
            fontWeight: 850,
            color: ROSE_TXT,
            whiteSpace: 'nowrap',
            opacity: reject,
            transform: `scale(${mix(1.25, 1, reject)})`,
            transformOrigin: '0% 50%',
          }}
        >
          {DEFENCE.reject}
        </div>
      ) : null}

      {/* The clerk, inside the room, working it out before moving */}
      {clerk > 0 ? (
        <div style={{ position: 'absolute', left: ROOM.x + 12, top: N0.y - 26, opacity: clerk }}>
          <Icon name="user" size={50} color={C.cyanSoft} strokeWidth={2.2} />
        </div>
      ) : null}
    </div>
  );
}

/** 0–1 weights of the four climbs + the two steps down, from their start frames. */
export function planWeights(frame: number, at: { steps: readonly number[]; etc: number; file: number }, dur = 12) {
  const steps = at.steps.map((s) => progress(frame, s, dur, EASE.inOut)) as [number, number, number, number];
  return { steps, etc: progress(frame, at.etc, dur, EASE.inOut), file: progress(frame, at.file, dur, EASE.inOut) };
}
