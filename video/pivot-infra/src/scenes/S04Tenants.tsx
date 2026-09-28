import type { CSSProperties, ReactNode } from 'react';
import { interpolateColors, useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse } from '../../../engine/src/theme/motion';
import { Chip, Icon, type IconName } from '../../../engine/src/ui';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's04-tenants';

/** The street every building stands on. */
const GROUND_Y = 524;

// The apartment block: 185.220.x.x, shared hosting.
const BX = 20;
const BTOP = 44;
const BW = 302;
const BH = GROUND_Y - BTOP;
const COLS = 10;
const ROWS = 20;
const WIN_W = 20;
const WIN_H = 14;
const winX = (c: number) => BX + 15 + c * 28;
const winY = (r: number) => BTOP + 16 + r * 22.4;
const winCenter = (c: number, r: number) => ({ x: winX(c) + WIN_W / 2, y: winY(r) + WIN_H / 2 });

const SUSPECT = { c: 6, r: 8 };
/** Neighbours the threads run to (spread over the whole block, never the suspect). */
const NEIGHBOURS = [
  { c: 1, r: 2 },
  { c: 9, r: 1 },
  { c: 3, r: 15 },
  { c: 8, r: 12 },
  { c: 4, r: 5 },
  { c: 7, r: 18 },
  { c: 0, r: 9 },
  { c: 5, r: 13 },
  { c: 2, r: 19 },
  { c: 8, r: 3 },
  { c: 9, r: 8 },
  { c: 3, r: 10 },
  { c: 9, r: 16 },
  { c: 1, r: 6 },
  { c: 6, r: 1 },
  { c: 0, r: 14 },
];
const NEIGHBOUR_SET = new Set(NEIGHBOURS.map((n) => `${n.c}:${n.r}`));

/** Window look: 0 grey (routine), 1 cyan (lit), 2 dim amber. Deterministic. */
function windowKind(i: number): 0 | 1 | 2 {
  const h = (i * 37 + 11) % 31;
  return h < 1 ? 2 : h < 9 ? 1 : 0;
}

// Callouts to the right of the block.
const CALL_X = 356;
const CALL_W = 740 - CALL_X;
/** Offset that centres the block + callouts group (x 0–760) on the stage before column 2 arrives. */
const BLOCK_GROUP_SHIFT = (1728 - 760) / 2;

// Column 2: the other noisy buildings.
const COL2_X = 780;
const CDN = { x: 800, w: 160, top: 300, cols: 5, rows: 9 };
const SINK = { x: 1040, w: 160, top: 340, cols: 5, rows: 7 };

// Column 3: the house.
const COL3_X = 1250;
const COL3_W = 1728 - COL3_X;
const HOUSE_CX = COL3_X + COL3_W / 2;

// Bottom strip: the rule.
const RULE_TOP = 556;
const RULE_H = 94;

/**
 * s04-tenants «¿Cuántos inquilinos?»: the IP is a block with 14.000 flats.
 * Your suspect lives there, but the neighbours are not accomplices — follow
 * them all and the threads tangle into false leads. CDN IPs and sinkholes are
 * just as noisy (and so are generic registrar nameservers and mass free-CA
 * certificates). The opposite is a house with a single tenant: a dedicated
 * resource. Rule: count the tenants — shared contaminates, dedicated
 * discriminates.
 */
export function S04Tenants(props: SceneProps) {
  const frame = useCurrentFrame();
  const building = props.cue('building');
  const shared = props.cue('shared');
  const cdn = props.cue('cdn');
  const dedicated = props.cue('dedicated');
  const rule = props.cue('rule');

  const seg2 = segment(props, 's04-02').from;
  const flatsAt = wordFrame(SCENE, 's04-01', 'pisos');
  const suspectAt = Math.max(seg2, wordFrame(SCENE, 's04-02', 'sospechoso') - 4);
  const notAccomplices = wordFrame(SCENE, 's04-02', 'cómplices');
  const falseAt = wordFrame(SCENE, 's04-02', 'falsas');
  const sinkAt = wordFrame(SCENE, 's04-03', 'sinkhole');
  const houseAt = wordFrame(SCENE, 's04-04', 'casa');
  const serverAt = wordFrame(SCENE, 's04-04', 'servidor');
  const certAt = wordFrame(SCENE, 's04-04', 'certificado');
  const dedicatedWord = wordFrame(SCENE, 's04-04', 'dedicado');
  const tenantsAt = wordFrame(SCENE, 's04-05', 'inquilinos');
  const contaminaAt = wordFrame(SCENE, 's04-05', 'contamina');
  const discriminaAt = wordFrame(SCENE, 's04-05', 'discrimina');

  // Focus: the shared side steps back while the house is introduced, and comes back for the rule.
  const sharedDim = 1 - 0.55 * progress(frame, dedicated, 16) * (1 - progress(frame, contaminaAt - 4, 14));
  const contaminaGlow = progress(frame, contaminaAt - 4, 12) * (0.7 + 0.3 * pulse(frame, 30, 0.5));
  const discriminaGlow = progress(frame, discriminaAt - 4, 12) * (0.7 + 0.3 * pulse(frame, 30, 0.5));

  return (
    <Stage>
      {/* The street */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <linearGradient id="s04-street" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={alpha(C.ink600, 0.5)} />
            <stop offset="1" stopColor={alpha(C.ink600, 0)} />
          </linearGradient>
        </defs>
        <g opacity={fadeIn(frame, 0, 12)}>
          <rect x={0} y={GROUND_Y} width={1728} height={18} fill="url(#s04-street)" />
          <line x1={0} y1={GROUND_Y} x2={1728} y2={GROUND_Y} stroke={C.ink600} strokeWidth={3} strokeLinecap="round" />
        </g>
      </svg>

      <div style={{ position: 'absolute', inset: 0, opacity: sharedDim }}>
        {/* The block and its callouts start centred and move aside when the other buildings arrive. */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${BLOCK_GROUP_SHIFT * (1 - progress(frame, cdn - 26, 26, EASE.inOut))}px)` }}>
          <Block frame={frame} building={building} suspectAt={suspectAt} shared={shared} falseAt={falseAt} glow={contaminaGlow} />
          <SignCard frame={frame} at={building + 8} flatsAt={flatsAt} />
          <SuspectCard frame={frame} at={suspectAt} />
          <FalseLeadsCard frame={frame} notAt={notAccomplices} shared={shared} falseAt={falseAt} glow={contaminaGlow} />
        </div>

        {/* Column 2: just as noisy */}
        <div
          style={{
            position: 'absolute',
            left: COL2_X,
            top: 14,
            fontFamily: FONT.sans,
            fontSize: TYPE.small,
            fontWeight: 800,
            letterSpacing: 2,
            color: C.amber,
            whiteSpace: 'nowrap',
            ...enter(frame, cdn, { distance: 10 }),
          }}
        >
          IGUAL DE RUIDOSOS
        </div>
        <div style={{ position: 'absolute', left: COL2_X, top: 60, display: 'grid', gap: 12, justifyItems: 'start' }}>
          <div style={{ ...enter(frame, sinkAt + 36, { distance: 10, axis: 'x' }) }}>
            <Chip accent="amber" icon="server" size={TYPE.micro}>
              NS genéricos del registrador
            </Chip>
          </div>
          <div style={{ ...enter(frame, sinkAt + 48, { distance: 10, axis: 'x' }) }}>
            <Chip accent="amber" icon="lock" size={TYPE.micro}>
              CA gratuitas masivas
            </Chip>
          </div>
        </div>
        <MiniBuilding frame={frame} at={cdn} spec={CDN} seed={3} icon="cloud" title="IP de CDN" sub="miles de empresas" glow={contaminaGlow} />
        <MiniBuilding frame={frame} at={sinkAt - 4} spec={SINK} seed={7} icon="funnel" title="sinkhole" sub="dominios cazados" glow={contaminaGlow} />
      </div>

      <House
        frame={frame}
        at={dedicated}
        houseAt={houseAt}
        serverAt={serverAt}
        certAt={certAt}
        dedicatedAt={dedicatedWord}
        glow={discriminaGlow}
      />

      <RuleStrip frame={frame} at={rule} tenantsAt={tenantsAt} contaminaAt={contaminaAt} discriminaAt={discriminaAt} />
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// The apartment block
// ---------------------------------------------------------------------------

function Block({
  frame,
  building,
  suspectAt,
  shared,
  falseAt,
  glow,
}: {
  frame: number;
  building: number;
  suspectAt: number;
  shared: number;
  falseAt: number;
  glow: number;
}) {
  const rise = progress(frame, 2, 28, EASE.out);
  const outline = progress(frame, building, 14) * (1 - 0.6 * progress(frame, building + 50, 30));
  const suspectOn = progress(frame, suspectAt, 10);
  const suspectPulse = suspectOn * (0.65 + 0.35 * pulse(frame, 30, 0.6));
  const amberT = progress(frame, falseAt - 2, 14);
  const threadColor = interpolateColors(amberT, [0, 1], [C.muted, C.amber]);
  const S = winCenter(SUSPECT.c, SUSPECT.r);

  const windows: ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      if (c === SUSPECT.c && r === SUSPECT.r) continue;
      // Lights come on floor by floor, from the street up.
      const on = progress(frame, 6 + (ROWS - 1 - r) * 1.4 + (c % 3), 8);
      if (on <= 0) continue;
      const kind = windowKind(i);
      const isNeighbour = NEIGHBOUR_SET.has(`${c}:${r}`);
      const neighbourAmber = isNeighbour ? amberT : 0;
      const base = kind === 1 ? alpha(C.cyan, 0.5) : kind === 2 ? alpha(C.amber, 0.3) : alpha(C.muted, 0.22);
      const fill = neighbourAmber > 0 ? interpolateColors(neighbourAmber, [0, 1], [base, C.amber]) : base;
      windows.push(
        <rect
          key={i}
          x={winX(c)}
          y={winY(r)}
          width={WIN_W}
          height={WIN_H}
          rx={2}
          fill={fill}
          opacity={on}
          style={neighbourAmber > 0.5 ? { filter: `drop-shadow(0 0 6px ${alpha(C.amber, 0.8)})` } : undefined}
        />,
      );
    }
  }

  return (
    <svg
      width={760}
      height={GROUND_Y + 4}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: rise, transform: `translateY(${(1 - rise) * 30}px)` }}
    >
      {/* Antenna + roof */}
      <line x1={BX + BW - 50} y1={BTOP - 10} x2={BX + BW - 50} y2={BTOP - 40} stroke={C.ink500} strokeWidth={4} strokeLinecap="round" />
      <circle cx={BX + BW - 50} cy={BTOP - 42} r={5} fill={alpha(C.sky, 0.8)} />
      <rect x={BX - 8} y={BTOP - 12} width={BW + 16} height={14} rx={4} fill={C.ink700} />
      {/* Facade */}
      <rect
        x={BX}
        y={BTOP}
        width={BW}
        height={BH}
        rx={6}
        fill={C.ink850}
        stroke={outline > 0 ? alpha(C.sky, 0.3 + 0.5 * outline) : glow > 0 ? alpha(C.amber, 0.3 + 0.5 * glow) : C.ink700}
        strokeWidth={3}
        style={{ filter: glow > 0 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(C.amber, 0.5 * glow)})` : undefined }}
      />
      {windows}

      {/* Threads to the neighbours: they tangle, then turn amber (false leads). */}
      {NEIGHBOURS.map((n, k) => {
        const p = progress(frame, shared + k * 3, 16, EASE.inOut);
        if (p <= 0) return null;
        const N = winCenter(n.c, n.r);
        const clampX = (x: number) => Math.max(4, Math.min(BX + BW + 24, x));
        const dx1 = ((k * 67) % 220) - 110;
        const dy1 = ((k * 41) % 200) - 100;
        const dx2 = ((k * 29 + 50) % 220) - 110;
        const dy2 = ((k * 83 + 30) % 200) - 100;
        const d = `M${S.x},${S.y} C${clampX(S.x + dx1)},${S.y + dy1} ${clampX(N.x + dx2)},${N.y + dy2} ${N.x},${N.y}`;
        return (
          <g key={k}>
            <path d={d} fill="none" stroke={threadColor} strokeOpacity={0.85} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
            <circle cx={N.x} cy={N.y} r={5 * progress(frame, shared + k * 3 + 12, 6)} fill={threadColor} />
          </g>
        );
      })}

      {/* The suspect's window: rose, gently pulsing */}
      <rect
        x={winX(SUSPECT.c) - 3}
        y={winY(SUSPECT.r) - 3}
        width={WIN_W + 6}
        height={WIN_H + 6}
        rx={3}
        fill={suspectOn > 0 ? interpolateColors(suspectOn, [0, 1], [alpha(C.muted, 0.22), C.rose]) : alpha(C.muted, 0.22)}
        opacity={progress(frame, 6 + (ROWS - 1 - SUSPECT.r) * 1.4, 8)}
        style={suspectPulse > 0 ? { filter: `drop-shadow(0 0 ${Math.round(12 * suspectPulse)}px ${alpha(C.rose, 0.9)})` } : undefined}
      />
      {/* Leader to the suspect card */}
      {suspectOn > 0 ? (
        <path
          d={`M${winX(SUSPECT.c) + WIN_W + 4},${S.y} L${CALL_X - 12},${S.y}`}
          stroke={alpha(C.rose, 0.8)}
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - progress(frame, suspectAt + 2, 12, EASE.inOut)}
        />
      ) : null}
    </svg>
  );
}

function CalloutCard({
  top,
  height,
  accent,
  glow = 0,
  style,
  children,
}: {
  top: number;
  height: number;
  accent: string;
  glow?: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: CALL_X,
        top,
        width: CALL_W,
        height,
        boxSizing: 'border-box',
        padding: '14px 20px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(accent, 0.45 + 0.45 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(accent, 0.08)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: glow > 0 ? `0 0 ${Math.round(28 * glow)}px ${alpha(accent, 0.3 * glow)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SignCard({ frame, at, flatsAt }: { frame: number; at: number; flatsAt: number }) {
  if (frame < at - 2) return null;
  const flats = progress(frame, flatsAt - 2, 12);
  return (
    <CalloutCard top={14} height={196} accent={C.sky} glow={progress(frame, at, 12) * (1 - 0.7 * progress(frame, at + 60, 30))} style={enter(frame, at, { distance: 18, axis: 'x' })}>
      <div style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.sky, whiteSpace: 'nowrap', lineHeight: 1.2 }}>185.220.x.x</div>
      <div style={{ marginTop: 8 }}>
        <Chip accent="amber" icon="users" size={TYPE.label}>
          shared hosting
        </Chip>
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: TYPE.label,
          fontWeight: 800,
          color: flats > 0.5 ? C.amber : C.textStrong,
          whiteSpace: 'nowrap',
          textShadow: flats > 0 ? `0 0 ${Math.round(18 * flats)}px ${alpha(C.amber, 0.5 * flats)}` : undefined,
        }}
      >
        14.000 dominios
      </div>
    </CalloutCard>
  );
}

function SuspectCard({ frame, at }: { frame: number; at: number }) {
  if (frame < at) return null;
  return (
    <CalloutCard top={218} height={108} accent={C.rose} glow={progress(frame, at, 12) * 0.8} style={enter(frame, at + 6, { distance: 16, axis: 'x' })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="target" size={32} color={C.rose} />
        <span style={{ fontSize: TYPE.label, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap' }}>tu sospechoso</span>
      </div>
      <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>update-svc-cdn.com</div>
    </CalloutCard>
  );
}

function FalseLeadsCard({ frame, notAt, shared, falseAt, glow }: { frame: number; notAt: number; shared: number; falseAt: number; glow: number }) {
  if (frame < notAt - 4) return null;
  const falseOn = progress(frame, falseAt - 2, 12);
  return (
    <CalloutCard top={340} height={172} accent={C.amber} glow={Math.max(falseOn * 0.6 * (1 - progress(frame, falseAt + 40, 30)), glow)} style={enter(frame, notAt - 4, { distance: 16, axis: 'x' })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="users" size={32} color={C.muted} />
        <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>no son cómplices</span>
      </div>
      <div style={{ marginTop: 12, fontSize: TYPE.small, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap', opacity: fadeIn(frame, shared, 12) }}>si los sigues a todos…</div>
      <div
        style={{
          marginTop: 4,
          fontSize: 40,
          fontWeight: 850,
          color: C.amber,
          whiteSpace: 'nowrap',
          opacity: falseOn,
          transform: `translateY(${(1 - falseOn) * 8}px)`,
        }}
      >
        pistas falsas
      </div>
    </CalloutCard>
  );
}

// ---------------------------------------------------------------------------
// The other noisy buildings
// ---------------------------------------------------------------------------

function MiniBuilding({
  frame,
  at,
  spec,
  seed,
  icon,
  title,
  sub,
  glow,
}: {
  frame: number;
  at: number;
  spec: { x: number; w: number; top: number; cols: number; rows: number };
  seed: number;
  icon: IconName;
  title: string;
  sub: string;
  glow: number;
}) {
  if (frame < at - 2) return null;
  const rise = progress(frame, at, 20, EASE.out);
  const h = GROUND_Y - spec.top;
  const ww = 18;
  const wh = 12;
  const gx = (spec.w - spec.cols * ww) / (spec.cols + 1);
  const gy = (h - 20 - spec.rows * wh) / (spec.rows + 1);
  const cx = spec.x + spec.w / 2;
  const windows: ReactNode[] = [];
  for (let r = 0; r < spec.rows; r++) {
    for (let c = 0; c < spec.cols; c++) {
      const i = r * spec.cols + c;
      const kind = windowKind(i * seed + seed);
      const on = progress(frame, at + 4 + (spec.rows - 1 - r) * 1.5 + (c % 2), 8);
      windows.push(
        <rect
          key={i}
          x={spec.x + gx + c * (ww + gx)}
          y={spec.top + 10 + gy + r * (wh + gy)}
          width={ww}
          height={wh}
          rx={2}
          fill={kind === 1 ? alpha(C.cyan, 0.45) : kind === 2 ? alpha(C.amber, 0.55) : alpha(C.muted, 0.22)}
          opacity={on}
        />,
      );
    }
  }
  return (
    <>
      <svg width={1728} height={GROUND_Y + 4} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: rise, transform: `translateY(${(1 - rise) * 24}px)` }}>
        <rect x={spec.x - 6} y={spec.top - 10} width={spec.w + 12} height={12} rx={4} fill={C.ink700} />
        <rect
          x={spec.x}
          y={spec.top}
          width={spec.w}
          height={h}
          rx={6}
          fill={C.ink850}
          stroke={alpha(C.amber, 0.35 + 0.5 * glow)}
          strokeWidth={3}
          style={{ filter: glow > 0 ? `drop-shadow(0 0 ${Math.round(16 * glow)}px ${alpha(C.amber, 0.45 * glow)})` : undefined }}
        />
        {windows}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: cx - 150,
          width: 300,
          top: spec.top - 94,
          textAlign: 'center',
          fontFamily: FONT.sans,
          ...enter(frame, at + 6, { distance: 12 }),
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <Icon name={icon} size={32} color={C.amber} />
          <span style={{ fontSize: TYPE.label, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{title}</span>
        </div>
        <div style={{ marginTop: 4, fontSize: TYPE.small, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// The house: a dedicated resource
// ---------------------------------------------------------------------------

function House({
  frame,
  at,
  houseAt,
  serverAt,
  certAt,
  dedicatedAt,
  glow,
}: {
  frame: number;
  at: number;
  houseAt: number;
  serverAt: number;
  certAt: number;
  dedicatedAt: number;
  glow: number;
}) {
  if (frame < at - 2) return null;
  const rise = progress(frame, at, 22, EASE.out);
  const lit = progress(frame, houseAt, 14);
  const g = Math.max(glow, progress(frame, dedicatedAt, 12) * (1 - progress(frame, dedicatedAt + 40, 30)) * 0.8);

  const roofTop = 336;
  const bodyTop = 410;
  const bodyL = HOUSE_CX - 112;
  const bodyW = 224;

  return (
    <>
      <svg width={1728} height={GROUND_Y + 4} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: rise, transform: `translateY(${(1 - rise) * 24}px)` }}>
        <g style={{ filter: g > 0 ? `drop-shadow(0 0 ${Math.round(22 * g)}px ${alpha(C.emerald, 0.55 * g)})` : undefined }}>
          {/* Chimney */}
          <rect x={HOUSE_CX + 62} y={roofTop + 18} width={26} height={46} rx={3} fill={C.ink800} stroke={alpha(C.emerald, 0.6)} strokeWidth={3} />
          {/* Roof: an opaque base hides the chimney's foot, then the emerald tint */}
          <path d={`M${HOUSE_CX - 142},${bodyTop + 4} L${HOUSE_CX},${roofTop} L${HOUSE_CX + 142},${bodyTop + 4} Z`} fill={C.ink850} />
          <path
            d={`M${HOUSE_CX - 142},${bodyTop + 4} L${HOUSE_CX},${roofTop} L${HOUSE_CX + 142},${bodyTop + 4} Z`}
            fill={alpha(C.emerald, 0.14)}
            stroke={alpha(C.emerald, 0.75 + 0.25 * g)}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {/* Body */}
          <rect x={bodyL} y={bodyTop} width={bodyW} height={GROUND_Y - bodyTop} rx={6} fill={C.ink850} stroke={alpha(C.emerald, 0.75 + 0.25 * g)} strokeWidth={4} />
          {/* Door */}
          <rect x={HOUSE_CX + 18} y={GROUND_Y - 70} width={44} height={70} rx={4} fill={C.ink800} stroke={alpha(C.emerald, 0.5)} strokeWidth={3} />
          <circle cx={HOUSE_CX + 52} cy={GROUND_Y - 34} r={3.5} fill={alpha(C.emerald, 0.8)} />
          {/* The one lit window */}
          <rect
            x={HOUSE_CX - 86}
            y={bodyTop + 28}
            width={70}
            height={56}
            rx={5}
            fill={interpolateColors(lit, [0, 1], [alpha(C.muted, 0.22), alpha(C.emerald, 0.85)])}
            stroke={alpha(C.emerald, 0.8)}
            strokeWidth={3}
          />
        </g>
      </svg>
      {/* The single tenant */}
      <div style={{ position: 'absolute', left: HOUSE_CX - 86 + 35 - 17, top: bodyTop + 28 + 28 - 17, opacity: lit * rise }}>
        <Icon name="user" size={34} color={C.ink950} strokeWidth={2.4} />
      </div>

      {/* Caption, examples and title */}
      <div style={{ position: 'absolute', left: COL3_X, width: COL3_W, top: 278, textAlign: 'center', fontFamily: FONT.sans, ...enter(frame, houseAt, { distance: 10 }) }}>
        <span style={{ fontSize: TYPE.label, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>una casa: solo vive él</span>
      </div>
      <div style={{ position: 'absolute', left: COL3_X, width: COL3_W, top: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ ...enter(frame, dedicatedAt - 2, { distance: 10 }), marginBottom: 6 }}>
          <Chip accent="emerald" icon="check" size={TYPE.label} solid style={{ boxShadow: g > 0 ? `0 0 ${Math.round(30 * g)}px ${alpha(C.emerald, 0.55 * g)}` : undefined }}>
            recurso dedicado
          </Chip>
        </div>
        <div style={{ ...enter(frame, serverAt - 2, { distance: 10, axis: 'x' }) }}>
          <Chip accent="emerald" icon="server" size={TYPE.small}>
            VPS propio
          </Chip>
        </div>
        <div style={{ ...enter(frame, certAt - 2, { distance: 10, axis: 'x' }) }}>
          <Chip accent="emerald" icon="key" size={TYPE.small}>
            cert autofirmado a medida
          </Chip>
        </div>
        <div style={{ ...enter(frame, dedicatedAt + 8, { distance: 10, axis: 'x' }) }}>
          <Chip accent="emerald" icon="mail" size={TYPE.small}>
            email de registro real
          </Chip>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// The rule
// ---------------------------------------------------------------------------

function RuleStrip({ frame, at, tenantsAt, contaminaAt, discriminaAt }: { frame: number; at: number; tenantsAt: number; contaminaAt: number; discriminaAt: number }) {
  if (frame < at - 2) return null;
  const stripIn = enter(frame, at, { distance: 18 });
  const q = progress(frame, Math.min(at + 6, tenantsAt - 6), 12);
  const shared = progress(frame, contaminaAt - 6, 12);
  const dedicated = progress(frame, discriminaAt - 6, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: RULE_TOP,
        width: 1728,
        height: RULE_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        fontSize: 42,
        fontWeight: 850,
        whiteSpace: 'nowrap',
        ...stripIn,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, color: C.textStrong, opacity: q }}>
        <Icon name="users" size={40} color={C.sky} />
        ¿Cuántos inquilinos?
      </span>
      <span style={{ width: 3, height: 50, borderRadius: 2, background: C.ink600, opacity: q }} />
      <span style={{ color: C.amber, opacity: shared, transform: `translateY(${(1 - shared) * 8}px)` }}>Compartido contamina</span>
      <span style={{ color: C.faint, opacity: dedicated }}>·</span>
      <span style={{ color: C.emerald, opacity: dedicated, transform: `translateY(${(1 - dedicated) * 8}px)` }}>dedicado discrimina</span>
    </div>
  );
}
