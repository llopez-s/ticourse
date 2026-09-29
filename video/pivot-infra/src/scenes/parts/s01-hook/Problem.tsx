import type { ReactNode } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, countUp, fmtInt, progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { Icon, Stamp, cubicLength, cubicPath, type Point } from '../../../../../engine/src/ui';

const W = 1728;

// Top band: the question, then the title and its promise.
const Q_TOP = 24;
const TITLE_TOP = 0;
const SUB_TOP = 104;

// The fork: the domain on the left, the noisy branch up (the IP), the good branch down.
const DOM = { x: 0, y: 336, w: 600, h: 168 };
const DOM_CY = DOM.y + DOM.h / 2;
const IPC = { x: 760, y: 206, w: 440, h: 150 };
const IP_CX = IPC.x + IPC.w / 2;
const IP_CY = IPC.y + IPC.h / 2;
const NODE = { cx: 900, cy: 572, r: 62 };

// Mini apartment block (the s04 look, small): where the IP's 14.000 neighbours live.
const BLK = { x: 1296, y: 184, w: 184, h: 272 };
const B_COLS = 6;
const B_ROWS = 10;
const B_WW = 18;
const B_WH = 12;
const B_GX = (BLK.w - B_COLS * B_WW) / (B_COLS + 1);
const B_GY = (BLK.h - 16 - B_ROWS * B_WH) / (B_ROWS + 1);
const winPos = (c: number, r: number): Point => ({ x: BLK.x + B_GX + c * (B_WW + B_GX), y: BLK.y + 8 + B_GY + r * (B_WH + B_GY) });
const CNT_X = 1508;

type Curve = [Point, Point, Point, Point];
const UPPER: Curve = [
  { x: DOM.x + DOM.w, y: DOM_CY - 26 },
  { x: DOM.x + DOM.w + 90, y: DOM_CY - 26 },
  { x: IPC.x - 80, y: IP_CY },
  { x: IPC.x - 4, y: IP_CY },
];
const LOWER: Curve = [
  { x: DOM.x + DOM.w, y: DOM_CY + 26 },
  { x: DOM.x + DOM.w + 110, y: DOM_CY + 26 },
  { x: NODE.cx - NODE.r - 120, y: NODE.cy },
  { x: NODE.cx - NODE.r - 6, y: NODE.cy },
];
const LOWER_LEN = cubicLength(LOWER);

/** First `t` of a cubic (de Casteljau), so a dashed path can be drawn progressively. */
function cubicHead([p0, p1, p2, p3]: Curve, t: number): Curve {
  const l = (a: Point, b: Point) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  const p01 = l(p0, p1);
  const p12 = l(p1, p2);
  const p23 = l(p2, p3);
  const p012 = l(p01, p12);
  const p123 = l(p12, p23);
  return [p0, p01, p012, l(p012, p123)];
}

/** Hex colour between `a` and `b` (both #rrggbb), so `alpha()` still applies to the result. */
function mixHex(a: string, b: string, t: number): string {
  const ch = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const pa = ch(a);
  const pb = ch(b);
  return `#${pa.map((v, k) => Math.round(v + (pb[k] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, '0')).join('')}`;
}

/** Window look: mostly amber (noise), some cyan, some grey. Deterministic. */
function windowFill(i: number): string {
  const h = (i * 53 + 17) % 20;
  return h < 9 ? alpha(C.amber, 0.8) : h < 13 ? alpha(C.cyan, 0.55) : alpha(C.muted, 0.3);
}

export type ProblemTimes = {
  /** «dominio» — the domain card glows. */
  domainAt: number;
  /** «IP» — the IP card glows. */
  ipAt: number;
  /** Just before «catorce»: the IP bursts into its 14.000 neighbours. */
  burstAt: number;
  /** Just before «¿Por dónde tiras?»: the fork and the question. */
  forkAt: number;
  /** {title}: the question turns into the title. */
  titleAt: number;
  elegirAt: number;
  pistaAt: number;
  atacanteAt: number;
  ruidoAt: number;
  /** The whole opening leaves (the E7 card takes over). */
  outAt: number;
};

/**
 * s01-01 / s01-02, the first ~17 s: the problem at once (a malicious domain and
 * an IP that bursts into 14.000 neighbours; «¿Por dónde tiras?» with two
 * paths), then the promise — the title «Pivotar por la infraestructura» and
 * «elegir la pista que lleva al atacante, no al ruido»: the emerald path finds
 * the attacker, the amber branch gets stamped RUIDO.
 */
export function Problem({ frame, fps, t }: { frame: number; fps: number; t: ProblemTimes }) {
  const out = progress(frame, t.outAt, 10, EASE.inOut);
  if (out >= 1) return null;

  // Focus: the diagram steps back when the title lands; the voice then points at each branch.
  const titleDim = progress(frame, t.titleAt - 4, 16);
  const ruidoHot = progress(frame, t.ruidoAt - 6, 10);
  const domainOpacity = 1 - 0.35 * titleDim;
  const noiseOpacity = 1 - 0.5 * titleDim + 0.3 * ruidoHot;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-20 * out}px)`, fontFamily: FONT.sans }}>
      <Paths frame={frame} t={t} noiseOpacity={noiseOpacity} />
      <div style={{ opacity: noiseOpacity }}>
        <Burst frame={frame} at={t.burstAt} />
        <NeighbourCount frame={frame} at={t.burstAt} />
        <IpCard frame={frame} fps={fps} t={t} />
      </div>
      <div style={{ position: 'absolute', left: IPC.x + 236, top: IPC.y + IPC.h - 34 }}>
        <Stamp frame={frame} at={t.ruidoAt - 4} accent="amber" rotate={-8} size={TYPE.h3}>
          RUIDO
        </Stamp>
      </div>
      <div style={{ opacity: domainOpacity }}>
        <DomainCard frame={frame} fps={fps} t={t} />
      </div>
      <AttackerNode frame={frame} fps={fps} t={t} />
      <TopBand frame={frame} fps={fps} t={t} />
    </div>
  );
}

/** The malicious domain (rose): on screen from the very first frame. */
function DomainCard({ frame, fps, t }: { frame: number; fps: number; t: ProblemTimes }) {
  const inn = progress(frame, -8, 14);
  const glow = progress(frame, t.domainAt - 4, 10) * (1 - 0.6 * progress(frame, t.ipAt - 4, 14)) * (0.75 + 0.25 * pulse(frame, fps, 0.6));
  return (
    <div
      style={{
        position: 'absolute',
        left: DOM.x,
        top: DOM.y,
        width: DOM.w,
        height: DOM.h,
        boxSizing: 'border-box',
        padding: '24px 28px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.55 + 0.4 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 ${Math.round(10 + 34 * glow)}px ${alpha(C.rose, 0.18 + 0.3 * glow)}`,
        opacity: inn,
        transform: `translateX(${(1 - inn) * -16}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="radar" size={32} color={C.rose} />
        <span style={{ fontSize: 30, fontWeight: 750, color: C.roseSoft, whiteSpace: 'nowrap' }}>dominio malicioso</span>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="globe" size={40} color={C.rose} />
        <span style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.1 }}>update-svc-cdn.com</span>
      </div>
    </div>
  );
}

/** The IP the domain resolves to; it shakes as it bursts into its neighbours. */
function IpCard({ frame, fps, t }: { frame: number; fps: number; t: ProblemTimes }) {
  const inn = progress(frame, -12, 18);
  const glow = progress(frame, t.ipAt - 4, 10) * (1 - 0.5 * progress(frame, t.burstAt + 30, 20)) * (0.75 + 0.25 * pulse(frame, fps, 0.6));
  const burst = progress(frame, t.burstAt, 6) * (1 - progress(frame, t.burstAt + 6, 14));
  const amber = progress(frame, t.burstAt, 14);
  const edge = mixHex(C.sky, C.amber, amber);
  return (
    <div
      style={{
        position: 'absolute',
        left: IPC.x,
        top: IPC.y,
        width: IPC.w,
        height: IPC.h,
        boxSizing: 'border-box',
        padding: '22px 26px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(edge, 0.5 + 0.45 * Math.max(glow, burst))}`,
        background: `linear-gradient(180deg, ${alpha(edge, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 ${Math.round(8 + 34 * Math.max(glow, burst))}px ${alpha(edge, 0.12 + 0.35 * Math.max(glow, burst))}`,
        opacity: inn,
        transform: `translateX(${(1 - inn) * 20}px) scale(${1 + 0.05 * burst})`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="server" size={30} color={edge} />
        <span style={{ fontSize: 30, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>IP</span>
      </div>
      <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.1 }}>185.220.x.x</div>
    </div>
  );
}

/** Domain → IP (sky, amber once it bursts) and, at the question, the second path (emerald). */
function Paths({ frame, t, noiseOpacity }: { frame: number; t: ProblemTimes; noiseOpacity: number }) {
  const upDraw = progress(frame, -10, 16, EASE.inOut);
  const amber = progress(frame, t.burstAt, 14);
  const upColor = mixHex(C.sky, C.amber, amber);
  const tip = UPPER[3];

  const lowDraw = progress(frame, t.forkAt, 16, EASE.inOut);
  const chosen = progress(frame, t.pistaAt - 6, 14);
  const lowHead = cubicHead(LOWER, lowDraw);
  const linkIn = progress(frame, t.burstAt + 20, 12);

  return (
    <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <g opacity={Math.min(noiseOpacity, 1)}>
        {upDraw > 0 ? <path d={cubicPath(cubicHead(UPPER, upDraw))} fill="none" stroke={upColor} strokeWidth={5} strokeLinecap="round" opacity={0.85} /> : null}
        {upDraw > 0.95 ? <polygon points={`${tip.x - 14},${tip.y - 10} ${tip.x},${tip.y} ${tip.x - 14},${tip.y + 10}`} fill={upColor} /> : null}
        {/* IP → its block, once the neighbours have landed. */}
        {linkIn > 0 ? (
          <line
            x1={IPC.x + IPC.w + 8}
            y1={IP_CY}
            x2={IPC.x + IPC.w + 8 + (BLK.x - 16 - IPC.x - IPC.w - 8) * linkIn}
            y2={IP_CY}
            stroke={alpha(C.amber, 0.75)}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="4 10"
          />
        ) : null}
      </g>
      {lowDraw > 0 ? (
        <g>
          {/* The second path: dashed while it is only a question, solid and flowing once it is «la pista». */}
          <path d={cubicPath(lowHead)} fill="none" stroke={alpha(C.emerald, 0.75 * (1 - chosen))} strokeWidth={5} strokeLinecap="round" strokeDasharray="10 12" />
          {chosen > 0 ? (
            <>
              <path d={cubicPath(LOWER)} fill="none" stroke={alpha(C.emerald, 0.3 * chosen)} strokeWidth={14} strokeLinecap="round" />
              <path
                d={cubicPath(LOWER)}
                fill="none"
                stroke={C.emerald}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={`${LOWER_LEN} ${LOWER_LEN}`}
                strokeDashoffset={LOWER_LEN * (1 - chosen)}
              />
              <path d={cubicPath(LOWER)} fill="none" stroke={C.textStrong} strokeWidth={2} strokeLinecap="round" strokeDasharray="8 30" strokeDashoffset={-frame * 1.4} opacity={0.7 * chosen} />
            </>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
}

/** The IP explodes: its windows scatter, then settle into a small block of flats. */
function Burst({ frame, at }: { frame: number; at: number }) {
  if (frame < at) return null;
  const facade = progress(frame, at + 12, 14);
  const windows: ReactNode[] = [];
  for (let r = 0; r < B_ROWS; r++) {
    for (let c = 0; c < B_COLS; c++) {
      const i = r * B_COLS + c;
      const s = at + ((i * 7) % 12);
      const p1 = progress(frame, s, 10, EASE.out);
      if (p1 <= 0) continue;
      const p2 = progress(frame, s + 8, 18, EASE.inOut);
      const angle = i * 2.39996;
      const rad = 90 + ((i * 37) % 80);
      const scatter = { x: IP_CX + Math.cos(angle) * rad * 1.3, y: IP_CY + Math.sin(angle) * rad * 0.8 };
      const from = { x: IP_CX + (scatter.x - IP_CX) * p1, y: IP_CY + (scatter.y - IP_CY) * p1 };
      const to = winPos(c, r);
      windows.push(
        <rect
          key={i}
          x={from.x + (to.x - from.x) * p2}
          y={from.y + (to.y - from.y) * p2}
          width={B_WW}
          height={B_WH}
          rx={2}
          fill={windowFill(i)}
          opacity={Math.min(1, p1 * 2)}
        />,
      );
    }
  }
  return (
    <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <g opacity={facade}>
        <rect x={BLK.x - 8} y={BLK.y - 12} width={BLK.w + 16} height={14} rx={4} fill={C.ink700} />
        <rect x={BLK.x} y={BLK.y} width={BLK.w} height={BLK.h} rx={6} fill={C.ink850} stroke={alpha(C.amber, 0.6)} strokeWidth={3} />
      </g>
      {windows}
    </svg>
  );
}

/** «14.000 vecinos»: counts up while the block fills. */
function NeighbourCount({ frame, at }: { frame: number; at: number }) {
  if (frame < at + 2) return null;
  const inn = progress(frame, at + 2, 12);
  const value = countUp(frame, at + 4, 30, 0, 14000);
  return (
    <div style={{ position: 'absolute', left: CNT_X, top: BLK.y + 64, opacity: inn, transform: `translateY(${(1 - inn) * 12}px)` }}>
      <div style={{ fontSize: 60, fontWeight: 850, color: C.amber, lineHeight: 1, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{fmtInt(value)}</div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: 36, fontWeight: 750, color: '#fcd34d', whiteSpace: 'nowrap' }}>
        <Icon name="users" size={34} color={C.amber} />
        vecinos
      </div>
    </div>
  );
}

/** Where the second path leads: «?» while it is a question, the attacker once the promise names it. */
function AttackerNode({ frame, fps, t }: { frame: number; fps: number; t: ProblemTimes }) {
  if (frame < t.forkAt + 8) return null;
  const inn = springIn(frame, fps, t.forkAt + 8, { damping: 15 });
  const found = progress(frame, t.atacanteAt - 4, 12);
  const glow = found * (0.7 + 0.3 * pulse(frame, fps, 0.6));
  const d = NODE.r * 2;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: NODE.cx - NODE.r,
          top: NODE.cy - NODE.r,
          width: d,
          height: d,
          boxSizing: 'border-box',
          borderRadius: NODE.r,
          display: 'grid',
          placeItems: 'center',
          border: `3px ${found > 0.5 ? 'solid' : 'dashed'} ${found > 0.5 ? C.rose : alpha(C.emerald, 0.8)}`,
          background: found > 0.5 ? alpha(C.rose, 0.16) : alpha(C.emerald, 0.08),
          boxShadow: glow > 0.02 ? `0 0 ${Math.round(34 * glow)}px ${alpha(C.rose, 0.55 * glow)}` : 'none',
          opacity: Math.min(1, inn * 1.3),
          transform: `scale(${0.7 + 0.3 * inn})`,
        }}
      >
        <span style={{ gridArea: '1 / 1', fontSize: 78, fontWeight: 850, color: C.emerald, lineHeight: 1, opacity: 1 - found }}>?</span>
        <span style={{ gridArea: '1 / 1', display: 'grid', placeItems: 'center', opacity: found }}>
          <Icon name="target" size={64} color={C.rose} strokeWidth={2.2} />
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: NODE.cx + NODE.r + 22,
          top: NODE.cy - 28,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          fontSize: 44,
          fontWeight: 850,
          color: C.roseSoft,
          whiteSpace: 'nowrap',
          opacity: found,
          transform: `translateX(${(1 - found) * -14}px)`,
        }}
      >
        el atacante
      </div>
    </>
  );
}

/** «¿Por dónde tiras?», then the title and the promise in the same place. */
function TopBand({ frame, fps, t }: { frame: number; fps: number; t: ProblemTimes }) {
  const qIn = progress(frame, t.forkAt - 2, 12);
  const qOut = progress(frame, t.titleAt - 8, 12, EASE.inOut);
  const title = springIn(frame, fps, t.titleAt - 2, { damping: 17 });
  const sub = progress(frame, t.elegirAt - 8, 14);
  const pista = progress(frame, t.pistaAt - 4, 12);
  const ruido = progress(frame, t.ruidoAt - 4, 12);
  return (
    <>
      {qIn > 0 && qOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: Q_TOP,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 22,
            opacity: qIn * (1 - qOut),
            transform: `translateY(${(1 - qIn) * 18 - 22 * qOut}px)`,
          }}
        >
          <Icon name="split" size={62} color={C.emerald} />
          <span style={{ fontSize: 68, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>¿Por dónde tiras?</span>
        </div>
      ) : null}
      {frame >= t.titleAt - 2 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: TITLE_TOP,
              width: W,
              textAlign: 'center',
              fontSize: 80,
              fontWeight: 850,
              letterSpacing: -2,
              lineHeight: 1.1,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              opacity: Math.min(1, title * 1.4),
              transform: `translateY(${(1 - title) * 26}px) scale(${0.96 + 0.04 * title})`,
            }}
          >
            Pivotar por la <span style={{ color: C.cyan }}>infraestructura</span>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: SUB_TOP,
              width: W,
              textAlign: 'center',
              fontSize: 42,
              fontWeight: 750,
              color: C.text,
              whiteSpace: 'nowrap',
              opacity: sub,
              transform: `translateY(${(1 - sub) * 12}px)`,
            }}
          >
            elegir <span style={{ color: pista > 0.5 ? C.emerald : C.text }}>la pista que lleva al atacante</span>, <span style={{ color: ruido > 0.5 ? C.amber : C.text }}>no al ruido</span>
          </div>
        </>
      ) : null}
    </>
  );
}
