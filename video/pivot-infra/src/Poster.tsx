import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon, type IconName } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';

ensureFonts();

// Pivot graph on the right half (absolute 1920×1080 coordinates).
const DOMAIN = { cx: 1470, cy: 250, w: 600, h: 108 };
const KEY = { cx: 1590, cy: 540, r: 92 };
const SERVER = { cx: 1600, cy: 868, w: 480, h: 108 };
const BLOCK = { x: 1090, y: 460, w: 210, h: 300 };

/**
 * Poster / YouTube thumbnail for «Pivotar por la infraestructura». Big two-line
 * title on the left for small-size legibility; on the right, the video's pivot
 * in one glance: the C2 domain, the hand-made key (self-signed certificate)
 * and the second server it opens, with the 14.000-tenant block crossed out as noise.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      <PivotGraph />

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 262, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 310, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Pivotar por la</div>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>infraestructura</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: TYPE.h3, fontWeight: 600, lineHeight: 1.25 }}>
        <div style={{ color: C.text }}>passive DNS, WHOIS</div>
        <div style={{ color: C.muted }}>y certificados</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 712, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Collection
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~8 min
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}

/** C2 domain, then the key, then the dedicated server; the shared block is noise. */
function PivotGraph() {
  const keyTop = KEY.cy - KEY.r;
  const keyLabelBottom = KEY.cy + KEY.r + 70;
  const domainBottom = DOMAIN.cy + DOMAIN.h / 2;
  const serverTop = SERVER.cy - SERVER.h / 2;
  const blockTop = BLOCK.y - 28;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* domain to the shared block: a dead end */}
        <path
          d={`M${DOMAIN.cx - 210},${domainBottom + 6} C${DOMAIN.cx - 230},${domainBottom + 90} ${BLOCK.x + BLOCK.w / 2},${blockTop - 80} ${BLOCK.x + BLOCK.w / 2},${blockTop - 10}`}
          fill="none"
          stroke={alpha(C.amber, 0.7)}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray="4 16"
        />
        {/* domain to key to server: the pivot */}
        <Arrow x1={DOMAIN.cx + 40} y1={domainBottom + 8} x2={KEY.cx} y2={keyTop - 14} />
        <Arrow x1={KEY.cx} y1={keyLabelBottom + 8} x2={SERVER.cx} y2={serverTop - 12} />
        {/* key halo */}
        <circle cx={KEY.cx} cy={KEY.cy} r={KEY.r + 26} fill={alpha(C.emerald, 0.1)} />
      </svg>

      <Block />

      {/* C2 domain */}
      <GraphNode cx={DOMAIN.cx} cy={DOMAIN.cy} w={DOMAIN.w} h={DOMAIN.h} icon="globe" tint={C.rose} tag="C2">
        update-svc-cdn…
      </GraphNode>

      {/* the hand-made key */}
      <div
        style={{
          position: 'absolute',
          left: KEY.cx - KEY.r,
          top: KEY.cy - KEY.r,
          width: KEY.r * 2,
          height: KEY.r * 2,
          borderRadius: KEY.r,
          display: 'grid',
          placeItems: 'center',
          border: `5px solid ${C.emerald}`,
          background: `radial-gradient(circle at 50% 40%, ${alpha(C.emerald, 0.28)} 0%, ${alpha(C.ink900, 0.96)} 75%)`,
          boxShadow: `0 0 60px ${alpha(C.emerald, 0.45)}`,
        }}
      >
        <Icon name="key" size={104} color={C.emerald} strokeWidth={2.2} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: KEY.cx - 260,
          top: KEY.cy + KEY.r + 16,
          width: 520,
          textAlign: 'center',
          fontFamily: FONT.mono,
          fontSize: 40,
          fontWeight: 800,
          color: C.emerald,
          whiteSpace: 'nowrap',
        }}
      >
        CN=updatesvc
      </div>

      {/* the second server the key opens */}
      <GraphNode cx={SERVER.cx} cy={SERVER.cy} w={SERVER.w} h={SERVER.h} icon="server" tint={C.emerald}>
        141.98.6.10
      </GraphNode>
    </>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <path d={`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2 - 18}`} fill="none" stroke={C.emerald} strokeWidth={9} strokeLinecap="round" />
      <polygon points={`${x2 - 17},${y2 - 22} ${x2 + 17},${y2 - 22} ${x2},${y2}`} fill={C.emerald} />
    </g>
  );
}

/** Pill node with an icon and a mono label; `tag` adds a small corner label. */
function GraphNode({ cx, cy, w, h, icon, tint, tag, children }: { cx: number; cy: number; w: number; h: number; icon: IconName; tint: string; tag?: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        borderRadius: RADIUS.pill,
        border: `4px solid ${tint}`,
        background: `linear-gradient(180deg, ${alpha(tint, 0.2)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 44px ${alpha(tint, 0.35)}, 0 24px 60px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.mono,
        fontSize: 48,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={56} color={tint} strokeWidth={2.2} />
      {children}
      {tag ? (
        <span
          style={{
            position: 'absolute',
            left: 40,
            top: -22,
            padding: '2px 16px',
            borderRadius: RADIUS.sm,
            background: tint,
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 850,
            letterSpacing: 2,
            color: C.ink950,
          }}
        >
          {tag}
        </span>
      ) : null}
    </div>
  );
}

/** The shared-hosting block: many windows, 14.000 tenants, crossed out as noise. */
function Block() {
  const cols = 5;
  const rows = 9;
  const pad = 22;
  const cellW = (BLOCK.w - 2 * pad) / cols;
  const cellH = (BLOCK.h - 2 * pad) / rows;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <g opacity={0.6}>
          <polygon points={`${BLOCK.x - 8},${BLOCK.y} ${BLOCK.x + BLOCK.w / 2},${BLOCK.y - 34} ${BLOCK.x + BLOCK.w + 8},${BLOCK.y}`} fill={alpha(C.amber, 0.35)} />
          <rect x={BLOCK.x} y={BLOCK.y} width={BLOCK.w} height={BLOCK.h} rx={10} fill={alpha(C.ink850, 0.95)} stroke={alpha(C.amber, 0.7)} strokeWidth={4} />
          {Array.from({ length: cols * rows }, (_, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            // Mostly routine grey windows, a scatter of amber ones.
            const warm = (i * 7) % 5 === 0;
            return (
              <rect
                key={i}
                x={BLOCK.x + pad + c * cellW + 5}
                y={BLOCK.y + pad + r * cellH + 5}
                width={cellW - 10}
                height={cellH - 10}
                rx={3}
                fill={warm ? alpha(C.amber, 0.85) : alpha(C.muted, 0.45)}
              />
            );
          })}
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          left: BLOCK.x + BLOCK.w / 2 - 130,
          top: BLOCK.y + BLOCK.h + 34,
          width: 260,
          height: 92,
          display: 'grid',
          placeItems: 'center',
          borderRadius: RADIUS.md,
          background: alpha(C.ink950, 0.92),
          border: `4px solid ${C.amber}`,
          fontFamily: FONT.sans,
          fontSize: 66,
          fontWeight: 900,
          letterSpacing: -1,
          color: C.amber,
        }}
      >
        14.000
      </div>
      <div
        style={{
          position: 'absolute',
          left: BLOCK.x + BLOCK.w / 2 - 160,
          top: BLOCK.y + BLOCK.h + 138,
          width: 320,
          textAlign: 'center',
          fontFamily: FONT.mono,
          fontSize: 32,
          fontWeight: 700,
          color: alpha(C.amber, 0.85),
          whiteSpace: 'nowrap',
        }}
      >
        185.220.x.x
      </div>
      {/* crossed out; an ink outline keeps the stroke visible over the amber windows */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {[
          { stroke: C.ink950, width: 26 },
          { stroke: C.amber, width: 14 },
        ].map((s) => (
          <g key={s.width} stroke={s.stroke} strokeWidth={s.width} strokeLinecap="round">
            <line x1={BLOCK.x - 22} y1={BLOCK.y - 44} x2={BLOCK.x + BLOCK.w + 22} y2={BLOCK.y + BLOCK.h + 12} />
            <line x1={BLOCK.x + BLOCK.w + 22} y1={BLOCK.y - 44} x2={BLOCK.x - 22} y2={BLOCK.y + BLOCK.h + 12} />
          </g>
        ))}
      </svg>
    </>
  );
}
