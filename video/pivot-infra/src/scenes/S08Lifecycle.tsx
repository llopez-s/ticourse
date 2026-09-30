import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, countUp, enter, fadeOut, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, Stamp, type IconName } from '../../../engine/src/ui';
import { RedactedName } from './parts/s07-whois/shared';
import { Stage, wordFrame } from './kit';

const S = 's08-lifecycle';

const SLOT = 288;
const nodeX = (i: number) => SLOT / 2 + SLOT * i;
const RAIL_Y = 470;
const NODE_R = 36;
/** Vignettes live between the top-centre band (kept for the think prompt) and the rail. */
const VIG_TOP = 236;
const VIG_W = 260;

interface StageDef {
  title: string;
  sub: string;
  icon: IconName;
  color: string;
  dashed?: boolean;
}

const STAGES: StageDef[] = [
  { title: 'registro', sub: 'en lote', icon: 'globe', color: C.sky },
  { title: 'dormido', sub: 'semanas o meses', icon: 'clock', color: C.sky },
  { title: 'activación', sub: 'el DNS apunta', icon: 'power', color: C.rose },
  { title: 'uso', sub: 'en la campaña', icon: 'mail', color: C.rose },
  { title: 'quemado', sub: 'detectado', icon: 'x', color: C.rose },
  { title: 'abandono', sub: 'o reventa', icon: 'archive', color: C.muted, dashed: true },
];

/** Sibling bars in the batch (widths only: every name is fully redacted). */
const SIBLINGS = [150, 118, 164, 132];
/** The sibling that wakes next once this one is burned. */
const NEXT = 2;

/**
 * s08-lifecycle «Vida de un dominio malicioso»: a horizontal lifecycle rail.
 *   batch   born in a batch — several siblings the same day (all redacted)
 *   parked  asleep for weeks or months: it ages to dodge «new domain» reputation
 *   active  woken up: its DNS points at the actor's servers
 *   use     used in the campaign
 *   burned  detected and burned — the actor moves on to the next sibling; tail: abandon or resale
 * The think prompt follows s08-04 in the top-centre band, which stays empty from `burned` on.
 */
export function S08Lifecycle(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const batchAt = props.cue('batch');
  const parkedAt = props.cue('parked');
  const activeAt = props.cue('active');
  const useAt = props.cue('use');
  const burnedAt = props.cue('burned');
  const stagesW = wordFrame(S, 's08-01', 'etapas');
  const sameDayW = wordFrame(S, 's08-02', 'mismo');
  const filtersW = wordFrame(S, 's08-03', 'filtros');
  const ageW = wordFrame(S, 's08-03', 'envejecer');
  const serversW = wordFrame(S, 's08-04', 'servidores');
  const burntW = wordFrame(S, 's08-04', 'quemado');
  const actorW = wordFrame(S, 's08-04', 'actor');
  const movesW = wordFrame(S, 's08-04', 'pasa');
  const nextW = wordFrame(S, 's08-04', 'siguiente');

  const litAt = [batchAt, parkedAt, activeAt, useAt, burnedAt, actorW];
  const lit = litAt.map((at) => progress(frame, at - 2, 14));
  let current = -1;
  litAt.forEach((at, i) => {
    if (frame >= at - 2) current = i;
  });

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <Rail frame={frame} lit={lit} litAt={litAt} />
      {STAGES.map((s, i) => (
        <Node key={s.title} frame={frame} fps={fps} i={i} def={s} lit={lit[i]} current={current === i} waveAt={stagesW} />
      ))}

      <Vignette x={nodeX(0)}>
        <Batch frame={frame} at={batchAt} sameDayAt={sameDayW} parkedAt={parkedAt} nextAt={nextW} />
      </Vignette>
      <Vignette x={nodeX(1)}>
        <Parked frame={frame} at={parkedAt} until={activeAt} />
      </Vignette>
      <Vignette x={nodeX(2)}>
        <Active frame={frame} fps={fps} at={activeAt} serversAt={serversW} />
      </Vignette>
      <Vignette x={nodeX(3)}>
        <Use frame={frame} at={useAt} />
      </Vignette>
      <Vignette x={nodeX(4)}>
        <Burned frame={frame} at={burnedAt} stampAt={burntW} />
      </Vignette>
      <Vignette x={nodeX(5)}>
        <Tail frame={frame} at={actorW} />
      </Vignette>

      <Loop frame={frame} at={movesW} />
      <AgeCallout frame={frame} at={filtersW} ageAt={ageW} outAt={activeAt + 6} />
    </Stage>
  );
}

/** The rail: drawn in at the start, then filled up to the last lit stage (sky, then rose once it is used). */
function Rail({ frame, lit, litAt }: { frame: number; lit: number[]; litAt: number[] }) {
  const draw = progress(frame, 0, 26, EASE.inOut);
  const x0 = nodeX(0);
  const x4 = nodeX(4);
  const x5 = nodeX(5);
  // Fill: from node 0 to the latest lit node, easing between nodes.
  let fill = x0;
  for (let i = 1; i < 5; i++) fill += (nodeX(i) - nodeX(i - 1)) * lit[i];
  const skyEnd = Math.min(fill, nodeX(2));
  const tail = progress(frame, litAt[5], 18, EASE.inOut);
  return (
    <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <line x1={x0} y1={RAIL_Y} x2={x0 + (x4 - x0) * draw} y2={RAIL_Y} stroke={C.ink600} strokeWidth={8} strokeLinecap="round" />
      <line
        x1={x4}
        y1={RAIL_Y}
        x2={x4 + (x5 - x4) * draw}
        y2={RAIL_Y}
        stroke={C.ink600}
        strokeWidth={6}
        strokeDasharray="6 16"
        strokeLinecap="round"
        opacity={draw}
      />
      {lit[0] > 0 && skyEnd > x0 ? (
        <line x1={x0} y1={RAIL_Y} x2={skyEnd} y2={RAIL_Y} stroke={C.sky} strokeWidth={8} strokeLinecap="round" />
      ) : null}
      {fill > nodeX(2) ? (
        <line
          x1={nodeX(2)}
          y1={RAIL_Y}
          x2={fill}
          y2={RAIL_Y}
          stroke={C.rose}
          strokeWidth={8}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${alpha(C.rose, 0.6)})` }}
        />
      ) : null}
      {tail > 0 ? (
        <line
          x1={x4}
          y1={RAIL_Y}
          x2={x4 + (x5 - x4) * tail}
          y2={RAIL_Y}
          stroke={C.muted}
          strokeWidth={6}
          strokeDasharray="6 16"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

function Node({
  frame,
  fps,
  i,
  def,
  lit,
  current,
  waveAt,
}: {
  frame: number;
  fps: number;
  i: number;
  def: StageDef;
  lit: number;
  current: boolean;
  waveAt: number;
}) {
  const x = nodeX(i);
  const appear = progress(frame, 4 + i * 3, 14);
  const wave = progress(frame, waveAt + i * 5, 7) * (1 - progress(frame, waveAt + i * 5 + 7, 10));
  const glow = lit * (current ? 0.65 + 0.35 * pulse(frame, fps, 0.6) : 0.35);
  const border = lit > 0.01 ? def.color : C.ink600;
  const size = def.dashed ? NODE_R * 1.7 : NODE_R * 2;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: RAIL_Y - size / 2,
          width: size,
          height: size,
          boxSizing: 'border-box',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: lit > 0.01 ? `linear-gradient(${alpha(def.color, 0.18 * lit)}, ${alpha(def.color, 0.18 * lit)}), ${C.ink850}` : C.ink850,
          border: `3px ${def.dashed ? 'dashed' : 'solid'} ${lit > 0.01 ? alpha(border, 0.5 + 0.5 * lit) : C.ink600}`,
          boxShadow: glow > 0.01 ? `0 0 ${Math.round(34 * glow)}px ${alpha(def.color, 0.55 * glow)}` : undefined,
          opacity: appear,
          transform: `scale(${(0.85 + 0.15 * appear) * (1 + 0.1 * wave)})`,
        }}
      >
        <Icon name={def.icon} size={def.dashed ? 30 : 36} color={lit > 0.01 ? def.color : C.faint} strokeWidth={2} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: x - SLOT / 2,
          width: SLOT,
          top: RAIL_Y + 50,
          textAlign: 'center',
          opacity: appear * (0.42 + 0.58 * lit),
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 800, color: lit > 0.5 ? C.textStrong : C.muted, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
          {def.title}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: TYPE.label,
            fontWeight: 600,
            color: def.color === C.rose ? C.roseSoft : def.color === C.sky ? C.sky : C.muted,
            whiteSpace: 'nowrap',
            opacity: lit,
          }}
        >
          {def.sub}
        </div>
      </div>
    </>
  );
}

function Vignette({ x, children }: { x: number; children: ReactNode }) {
  return <div style={{ position: 'absolute', left: x - VIG_W / 2, top: VIG_TOP, width: VIG_W, height: RAIL_Y - NODE_R - 16 - VIG_TOP }}>{children}</div>;
}

/** A redacted domain inside a small pill. */
function DomainPill({
  width,
  color,
  glow = 0,
  strike = 0,
  dashed = false,
  strength = 0.7,
  compact = false,
}: {
  width: number;
  color: string;
  glow?: number;
  strike?: number;
  dashed?: boolean;
  strength?: number;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: compact ? '4px 12px' : '7px 14px',
        borderRadius: RADIUS.pill,
        border: `2px ${dashed ? 'dashed' : 'solid'} ${alpha(color, 0.55 + 0.4 * glow)}`,
        background: alpha(color, 0.08 + 0.12 * glow),
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(26 * glow)}px ${alpha(color, 0.5 * glow)}` : undefined,
      }}
    >
      <Icon name="globe" size={24} color={color} />
      <RedactedName width={width} height={20} tld={40} tint={color === C.rose ? C.roseSoft : C.muted} strength={strength} strike={strike} />
    </div>
  );
}

/** Born in a batch: several siblings, the same day. They fall asleep with the lot; later the next one wakes. */
function Batch({ frame, at, sameDayAt, parkedAt, nextAt }: { frame: number; at: number; sameDayAt: number; parkedAt: number; nextAt: number }) {
  if (frame < at - 4) return null;
  const asleep = progress(frame, parkedAt, 20);
  const wake = progress(frame, nextAt - 2, 12);
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          position: 'absolute',
          top: -64,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 16px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.sky, 0.6)}`,
          background: alpha(C.sky, 0.1),
          fontSize: TYPE.label,
          fontWeight: 700,
          color: C.sky,
          whiteSpace: 'nowrap',
          ...enter(frame, sameDayAt - 2, { distance: 10 }),
        }}
      >
        <Icon name="clock" size={28} color={C.sky} />
        mismo día
      </div>
      {SIBLINGS.map((w, i) => {
        const inn = enter(frame, at + i * 5, { distance: 16 });
        const isNext = i === NEXT;
        const color = isNext && wake > 0.5 ? C.rose : C.sky;
        return (
          <div key={i} style={{ ...inn, opacity: inn.opacity * (1 - 0.45 * asleep * (isNext ? 1 - wake : 1)) }}>
            <DomainPill width={w - 40} color={color} glow={isNext ? wake : 0} compact />
          </div>
        );
      })}
    </div>
  );
}

/** Asleep: a clock hand turning, a slow «z z z» and the domain's age climbing. */
function Parked({ frame, at, until }: { frame: number; at: number; until: number }) {
  if (frame < at - 4) return null;
  const inn = enter(frame, at, { distance: 16 });
  const running = Math.min(frame, until) - at;
  const angle = Math.max(0, running) * 3;
  const days = countUp(frame, at + 6, Math.max(30, until - at - 30), 1, 120);
  const R = 58;
  const cx = VIG_W / 2;
  const cy = 72;
  return (
    <div style={{ position: 'relative', height: '100%', ...inn }}>
      <svg width={VIG_W} height={150} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <circle cx={cx} cy={cy} r={R} fill={alpha(C.sky, 0.07)} stroke={alpha(C.sky, 0.7)} strokeWidth={4} />
        {Array.from({ length: 12 }, (_, k) => {
          const a = (k / 12) * Math.PI * 2;
          const r1 = R - (k % 3 === 0 ? 14 : 8);
          return (
            <line
              key={k}
              x1={cx + Math.sin(a) * r1}
              y1={cy - Math.cos(a) * r1}
              x2={cx + Math.sin(a) * (R - 3)}
              y2={cy - Math.cos(a) * (R - 3)}
              stroke={alpha(C.sky, 0.6)}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
        <line
          x1={cx}
          y1={cy}
          x2={cx + Math.sin((angle * Math.PI) / 180) * (R - 16)}
          y2={cy - Math.cos((angle * Math.PI) / 180) * (R - 16)}
          stroke={C.textStrong}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={6} fill={C.textStrong} />
        {[0, 1, 2].map((k) => {
          // Three z's drifting up and fading, one after another (slow, well under 1 Hz).
          const t = ((frame - at + k * 30) % 90) / 90;
          const z = frame < until ? 1 : 1 - progress(frame, until, 16);
          return (
            <text
              key={k}
              x={cx + R + 4 + t * 34}
              y={cy - R + 24 - t * 44}
              fill={C.sky}
              fontFamily={FONT.sans}
              fontWeight={800}
              fontSize={24 + k * 6}
              opacity={Math.sin(t * Math.PI) * 0.9 * z}
            >
              z
            </text>
          );
        })}
      </svg>
      <div style={{ position: 'absolute', left: 0, width: VIG_W, top: 142, textAlign: 'center', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: TYPE.small, fontWeight: 600, color: C.muted }}>edad </span>
        <span style={{ fontSize: TYPE.label, fontWeight: 800, color: C.textStrong, fontVariantNumeric: 'tabular-nums' }}>{Math.round(days)} {Math.round(days) === 1 ? 'día' : 'días'}</span>
      </div>
    </div>
  );
}

/** Woken up: its DNS now points at the actor's server. */
function Active({ frame, fps, at, serversAt }: { frame: number; fps: number; at: number; serversAt: number }) {
  if (frame < at - 4) return null;
  const inn = enter(frame, at, { distance: 16 });
  const link = progress(frame, at + 10, 18, EASE.inOut);
  const server = springIn(frame, fps, serversAt - 6, { damping: 15 });
  const glow = progress(frame, at, 14);
  return (
    <div style={{ position: 'relative', height: '100%', ...inn }}>
      <div style={{ position: 'absolute', left: 0, width: VIG_W, top: 8, display: 'flex', justifyContent: 'center' }}>
        <DomainPill width={96} color={C.rose} glow={glow} />
      </div>
      <svg width={VIG_W} height={190} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={VIG_W / 2} y1={58} x2={VIG_W / 2} y2={58 + 44 * link} stroke={C.rose} strokeWidth={4} strokeLinecap="round" strokeDasharray="8 8" />
      </svg>
      <div style={{ position: 'absolute', left: VIG_W / 2 + 18, top: 66, fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color: C.roseSoft, opacity: link }}>
        DNS
      </div>
      <div
        style={{
          position: 'absolute',
          left: VIG_W / 2 - 38,
          top: 106,
          width: 76,
          height: 76,
          borderRadius: 18,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.rose, 0.14),
          border: `2px solid ${alpha(C.rose, 0.75)}`,
          boxShadow: `0 0 ${Math.round(26 * Math.min(1, server))}px ${alpha(C.rose, 0.35)}`,
          opacity: Math.min(1, server * 1.3),
          transform: `scale(${0.7 + 0.3 * Math.min(1.05, server)})`,
        }}
      >
        <Icon name="server" size={42} color={C.rose} />
      </div>
    </div>
  );
}

/** Used in the campaign: mail goes out towards the target. */
function Use({ frame, at }: { frame: number; at: number }) {
  if (frame < at - 4) return null;
  const inn = enter(frame, at, { distance: 16 });
  const target = { x: 196, y: 92 };
  const hit = progress(frame, at + 34, 16);
  return (
    <div style={{ position: 'relative', height: '100%', ...inn }}>
      <div
        style={{
          position: 'absolute',
          left: target.x - 40,
          top: target.y - 40,
          width: 80,
          height: 80,
          borderRadius: 40,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.rose, 0.1 + 0.1 * hit),
          border: `2px solid ${alpha(C.rose, 0.6)}`,
        }}
      >
        <Icon name="target" size={48} color={C.rose} />
      </div>
      {hit > 0 && hit < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: target.x - 40 - 30 * hit,
            top: target.y - 40 - 30 * hit,
            width: 80 + 60 * hit,
            height: 80 + 60 * hit,
            borderRadius: '50%',
            border: `3px solid ${alpha(C.rose, 1 - hit)}`,
          }}
        />
      ) : null}
      {[0, 1, 2].map((k) => {
        const p = progress(frame, at + k * 8, 30, EASE.inOut);
        const sx = 20;
        const sy = 30 + k * 56;
        const ex = target.x - 92 + k * 6;
        const ey = target.y - 34 + k * 30;
        const x = sx + (ex - sx) * p;
        const y = sy + (ey - sy) * p - Math.sin(p * Math.PI) * 16;
        return (
          <div key={k} style={{ position: 'absolute', left: x, top: y, opacity: progress(frame, at + k * 8, 8) }}>
            <Icon name="mail" size={40} color={C.roseSoft} />
          </div>
        );
      })}
    </div>
  );
}

/** Detected: burned — struck through and stamped. */
function Burned({ frame, at, stampAt }: { frame: number; at: number; stampAt: number }) {
  if (frame < at - 4) return null;
  const inn = enter(frame, at, { distance: 16 });
  const strike = progress(frame, at + 8, 14, EASE.inOut);
  return (
    <div style={{ position: 'relative', height: '100%', ...inn }}>
      <div style={{ position: 'absolute', left: 0, width: VIG_W, top: 30, display: 'flex', justifyContent: 'center' }}>
        <DomainPill width={96} color={C.rose} strike={strike} />
      </div>
      <div style={{ position: 'absolute', left: 0, width: VIG_W, top: 104, display: 'flex', justifyContent: 'center' }}>
        <Stamp frame={frame} at={stampAt} accent="rose" rotate={-8} size={TYPE.label}>
          quemado
        </Stamp>
      </div>
    </div>
  );
}

/** Abandoned or resold: a dashed ghost of the domain. */
function Tail({ frame, at }: { frame: number; at: number }) {
  if (frame < at - 4) return null;
  const inn = enter(frame, at, { distance: 16 });
  return (
    <div style={{ position: 'relative', height: '100%', ...inn, opacity: inn.opacity * 0.75 }}>
      <div style={{ position: 'absolute', left: 0, width: VIG_W, top: 60, display: 'flex', justifyContent: 'center' }}>
        <DomainPill width={96} color={C.muted} dashed strength={0.35} />
      </div>
    </div>
  );
}

/** «pasa al siguiente»: a dashed loop under the rail from the burned stage back to the batch. */
function Loop({ frame, at }: { frame: number; at: number }) {
  const draw = progress(frame, at, 26, EASE.inOut);
  if (draw <= 0) return null;
  const x1 = nodeX(4);
  const x0 = nodeX(0) + 30;
  const y = 618;
  const d = `M${x1},${y} C${x1},${y + 46} ${x0},${y + 46} ${x0},${y}`;
  const head = progress(frame, at + 22, 8);
  return (
    <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <path d={d} fill="none" stroke={alpha(C.rose, 0.75)} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
      <path
        d={`M${x0 - 11},${y + 14} L${x0},${y} L${x0 + 11},${y + 14}`}
        fill="none"
        stroke={C.rose}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={head}
      />
    </svg>
  );
}

/** s08-03: why asleep. Lives in the top band only until the domain wakes up (well before the think prompt). */
function AgeCallout({ frame, at, ageAt, outAt }: { frame: number; at: number; ageAt: number; outAt: number }) {
  const out = fadeOut(frame, outAt, 14);
  if (frame < at - 6 || out <= 0) return null;
  const inn = enter(frame, at - 4, { distance: 14 });
  const line2 = enter(frame, ageAt - 2, { distance: 10 });
  const line2Open = progress(frame, ageAt - 8, 12, EASE.inOut);
  const leader = progress(frame, at + 6, 14);
  const LEFT = 170;
  const TOP = 26;
  // Approximate bottom edge of the box (one line, plus the second as it opens).
  const boxBottom = TOP + 84 + 58 * line2Open;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: out }}>
      <svg width={1728} height={260} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={nodeX(1)} y1={boxBottom} x2={nodeX(1)} y2={boxBottom + (VIG_TOP + 12 - boxBottom) * leader} stroke={alpha(C.amber, 0.7)} strokeWidth={3} strokeDasharray="6 7" opacity={inn.opacity} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: TOP,
          boxSizing: 'border-box',
          padding: '18px 30px 20px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.amber, 0.55)}`,
          background: alpha(C.ink900, 0.94),
          boxShadow: `0 20px 50px ${alpha('#000000', 0.45)}`,
          ...inn,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name="shield" size={34} color={C.amber} strokeWidth={2.2} />
          <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>muchos filtros desconfían de lo recién nacido</span>
        </div>
        {/* The box grows to take the second line when it is said. */}
        <div style={{ height: 58 * line2Open, overflow: 'hidden' }}>
          <div style={{ paddingTop: 10, fontSize: 38, fontWeight: 800, color: '#fcd34d', whiteSpace: 'nowrap', letterSpacing: -0.3, ...line2 }}>
            envejece para esquivar la reputación por edad
          </div>
        </div>
      </div>
    </div>
  );
}

