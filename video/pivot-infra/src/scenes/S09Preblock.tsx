import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, Panel, type IconName } from '../../../engine/src/ui';
import { PATTERN, PatternChip, RedactedName } from './parts/s07-whois/shared';
import { Stage, wordFrame } from './kit';

const S = 's09-preblock';

// --- top strip: the lifecycle rail from s08, compact ---------------------------------
const RAIL_STAGES: { title: string; icon: IconName }[] = [
  { title: 'registro', icon: 'globe' },
  { title: 'dormido', icon: 'clock' },
  { title: 'activación', icon: 'power' },
  { title: 'uso', icon: 'mail' },
  { title: 'quemado', icon: 'x' },
];
const R_SLOT = 1728 / RAIL_STAGES.length;
const rx = (i: number) => R_SLOT / 2 + R_SLOT * i;
const R_Y = 124;
const R_NODE = 24;
/** The block lands between «dormido» and «activación». */
const BARRIER_X = (rx(1) + rx(2)) / 2;

// --- panels ---------------------------------------------------------------------
const PANEL_TOP = 212;
const PANEL_H = 660 - PANEL_TOP;
const SIDE_W = 520;
const RES_LEFT = SIDE_W + 28;
const RES_W = 1728 - RES_LEFT;

/** Bar widths of the siblings (every name fully redacted). */
const SIBLINGS = [248, 196, 286, 214, 262];

const COA_ACTIONS = ['Discover', 'Detect', 'Deny', 'Disrupt', 'Degrade', 'Deceive', 'Destroy'];

/**
 * s09-preblock «Ir por delante».
 *   batch-detect  the registration-pattern search (the same three chips as s07) finds the lot
 *   siblings      several siblings, fully redacted, still asleep — same pattern, same day
 *   pre-block     blocked before the first mail: stamps, and a mail that never arrives
 *   coa-deny      Courses of Action, DELIVERY: Deny
 *   s09-04        on the lifecycle rail you now stand ahead of the attack
 */
export function S09Preblock(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const detectAt = props.cue('batch-detect');
  const siblingsAt = props.cue('siblings');
  const blockAt = props.cue('pre-block');
  const denyAt = props.cue('coa-deny');
  const patternW = wordFrame(S, 's09-02', 'patrón');
  const dayW = wordFrame(S, 's09-02', 'día');
  const asleepW = wordFrame(S, 's09-02', 'todavía');
  const blockW = wordFrame(S, 's09-03', 'bloqueas');
  const beforeW = wordFrame(S, 's09-03', 'antes');
  const mailW = wordFrame(S, 's09-03', 'correo');
  const behindW = wordFrame(S, 's09-04', 'detrás');
  const aheadW = wordFrame(S, 's09-04', 'Vas');

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <TopRail
        frame={frame}
        fps={fps}
        detectAt={detectAt}
        siblingsAt={siblingsAt}
        blockAt={blockAt}
        mailAt={beforeW}
        neverAt={mailW}
        behindAt={behindW}
        aheadAt={aheadW}
      />

      {/* Left: the registration pattern as a search… */}
      <div style={{ position: 'absolute', left: 0, top: PANEL_TOP, width: SIDE_W, height: PANEL_H, ...enter(frame, 2, { distance: 18 }) }}>
        <QueryPanel frame={frame} detectAt={detectAt} siblingsAt={siblingsAt} patternAt={patternW} dayAt={dayW} />
      </div>
      {/* …and, once blocked, the Courses of Action card lands on top of it. */}
      <CoaCard frame={frame} fps={fps} at={denyAt} />

      {/* Right: the lot, asleep, then blocked. */}
      <div style={{ position: 'absolute', left: RES_LEFT, top: PANEL_TOP, width: RES_W, height: PANEL_H, ...enter(frame, 8, { distance: 18 }) }}>
        <Panel title="Mismo patrón · mismo día" icon="globe" accent="cyan" style={{ height: '100%' }} bodyStyle={{ padding: '16px 26px' }}>
          {/* Skeleton rows: the list the search is about to fill (there from the first frame). */}
          <div style={{ position: 'absolute', left: 40, right: 40, top: 30, display: 'grid', gap: 36, opacity: 1 - progress(frame, siblingsAt - 6, 12) }}>
            {SIBLINGS.map((w, i) => (
              <div key={i} style={{ width: w + 120, height: 22, borderRadius: 6, background: alpha(C.ink600, 0.35 + 0.2 * progress(frame, detectAt, 10)) }} />
            ))}
          </div>
          <Scan frame={frame} fps={fps} from={detectAt} to={siblingsAt} />
          {SIBLINGS.map((w, i) => (
            <SiblingRow
              key={i}
              frame={frame}
              i={i}
              width={w}
              at={siblingsAt + i * 7}
              asleepAt={asleepW + i * 4}
              blockAt={blockW + i * 7}
            />
          ))}
        </Panel>
      </div>
    </Stage>
  );
}

/** Compact lifecycle rail: where in the domain's life the block lands, and where you stand. */
function TopRail({
  frame,
  fps,
  detectAt,
  siblingsAt,
  blockAt,
  mailAt,
  neverAt,
  behindAt,
  aheadAt,
}: {
  frame: number;
  fps: number;
  detectAt: number;
  siblingsAt: number;
  blockAt: number;
  mailAt: number;
  neverAt: number;
  behindAt: number;
  aheadAt: number;
}) {
  const appear = progress(frame, 0, 18);
  const litAt = [detectAt, siblingsAt];
  const blocked = progress(frame, blockAt, 16);
  const barrier = springIn(frame, fps, blockAt - 2, { damping: 13 });
  const fill = rx(0) + (rx(1) - rx(0)) * progress(frame, siblingsAt - 2, 16);
  const ghostMail = enter(frame, mailAt - 4, { distance: 10 });
  const never = fadeIn(frame, neverAt - 2, 12);
  const behind = fadeIn(frame, behindAt - 4, 12) * (1 - 0.7 * progress(frame, aheadAt, 16));
  const ahead = springIn(frame, fps, aheadAt - 2, { damping: 14 });
  const aheadGlow = progress(frame, aheadAt, 14) * (0.7 + 0.3 * pulse(frame, fps, 0.6));
  const badge = enter(frame, siblingsAt + 4, { distance: 10 });
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 196, opacity: appear }}>
      <svg width={1728} height={196} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* Past the block the rail goes dashed: those stages are not going to happen. */}
        <line x1={rx(0)} y1={R_Y} x2={BARRIER_X} y2={R_Y} stroke={C.ink600} strokeWidth={6} strokeLinecap="round" />
        <line
          x1={BARRIER_X}
          y1={R_Y}
          x2={rx(4)}
          y2={R_Y}
          stroke={C.ink600}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={blocked > 0.5 ? '4 14' : undefined}
          opacity={1 - 0.4 * blocked}
        />
        {frame >= detectAt ? <line x1={rx(0)} y1={R_Y} x2={fill} y2={R_Y} stroke={C.sky} strokeWidth={6} strokeLinecap="round" /> : null}
      </svg>
      {RAIL_STAGES.map((st, i) => {
        const lit = i < 2 ? progress(frame, litAt[i] - 2, 14) : 0;
        const dead = i >= 2 ? blocked : 0;
        const color = lit > 0.01 ? C.sky : C.faint;
        return (
          <div key={st.title}>
            <div
              style={{
                position: 'absolute',
                left: rx(i) - R_NODE,
                top: R_Y - R_NODE,
                width: R_NODE * 2,
                height: R_NODE * 2,
                boxSizing: 'border-box',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: lit > 0.01 ? `linear-gradient(${alpha(C.sky, 0.2 * lit)}, ${alpha(C.sky, 0.2 * lit)}), ${C.ink850}` : C.ink850,
                border: `3px ${dead > 0.5 ? 'dashed' : 'solid'} ${lit > 0.01 ? alpha(C.sky, 0.5 + 0.5 * lit) : C.ink600}`,
                opacity: 1 - 0.45 * dead,
              }}
            >
              <Icon name={st.icon} size={26} color={color} strokeWidth={2} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: rx(i) - R_SLOT / 2,
                width: R_SLOT,
                top: R_Y + 32,
                textAlign: 'center',
                fontSize: TYPE.small,
                fontWeight: 700,
                color: lit > 0.5 ? C.sky : C.muted,
                opacity: (0.55 + 0.45 * lit) * (1 - 0.4 * dead),
                whiteSpace: 'nowrap',
              }}
            >
              {st.title}
            </div>
          </div>
        );
      })}

      {/* The lot sits in «dormido». */}
      <div style={{ position: 'absolute', left: rx(1) - 150, width: 300, top: 36, display: 'flex', justifyContent: 'center', ...badge }}>
        <Chip accent="cyan" icon="clock" size={TYPE.label}>
          5 hermanos
        </Chip>
      </div>

      {/* The block: an emerald wall across the rail before «activación». */}
      {barrier > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: BARRIER_X - 27,
            top: R_Y - 27,
            width: 54,
            height: 54,
            borderRadius: 16,
            display: 'grid',
            placeItems: 'center',
            background: C.emeraldDeep,
            border: `3px solid ${C.emerald}`,
            boxShadow: `0 0 ${Math.round(30 * Math.min(1, barrier))}px ${alpha(C.emerald, 0.55)}`,
            transform: `scale(${Math.min(1.08, barrier)})`,
            opacity: Math.min(1, barrier * 1.4),
          }}
        >
          <Icon name="shield" size={32} color={C.emerald} strokeWidth={2.4} />
        </div>
      ) : null}

      {/* The first mail: announced, never delivered. */}
      <div style={{ position: 'absolute', left: rx(3) - 26, top: 18, display: 'flex', alignItems: 'flex-start', gap: 14, ...ghostMail }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            display: 'grid',
            placeItems: 'center',
            border: `2px dashed ${alpha(C.rose, 0.7)}`,
            background: alpha(C.rose, 0.06),
          }}
        >
          <Icon name="mail" size={34} color={alpha(C.roseSoft, 0.75)} />
        </div>
        <div style={{ lineHeight: 1.1, whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: TYPE.label, fontWeight: 750, color: C.roseSoft }}>primer correo</div>
          <div style={{ fontSize: TYPE.small, fontWeight: 650, color: C.muted, marginTop: 4, opacity: never }}>nunca llega</div>
        </div>
      </div>

      {/* Where you usually are (behind the attack) and where you are now (ahead of it). */}
      <Marker x={rx(4)} opacity={behind} color={C.muted} label="detrás" labelColor={C.muted} />
      {ahead > 0.001 ? (
        <Marker
          x={BARRIER_X}
          opacity={Math.min(1, ahead * 1.3)}
          scale={Math.min(1.06, ahead)}
          color={C.cyan}
          glow={aheadGlow}
          label="vas por delante"
          labelColor={C.cyanSoft}
          big
        />
      ) : null}
    </div>
  );
}

/** A «tú» pin standing on the rail, label to its right. */
function Marker({
  x,
  opacity,
  scale = 1,
  color,
  glow = 0,
  label,
  labelColor,
  big = false,
}: {
  x: number;
  opacity: number;
  scale?: number;
  color: string;
  glow?: number;
  label: string;
  labelColor: string;
  big?: boolean;
}) {
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x - 24, top: 0, opacity, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale})`, transformOrigin: '24px 80px' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            display: 'grid',
            placeItems: 'center',
            background: alpha(color, 0.18),
            border: `3px solid ${color}`,
            boxShadow: glow > 0.01 ? `0 0 ${Math.round(28 * glow)}px ${alpha(color, 0.6 * glow)}` : undefined,
          }}
        >
          <Icon name="user" size={28} color={color} strokeWidth={2.2} />
        </div>
        <div style={{ width: 4, height: 30, background: color, borderRadius: 2 }} />
      </div>
      <div
        style={{
          marginTop: big ? 2 : 8,
          fontSize: big ? 40 : TYPE.label,
          fontWeight: big ? 850 : 650,
          color: labelColor,
          whiteSpace: 'nowrap',
          letterSpacing: big ? -0.4 : 0,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/** The search: the three chips of the registration pattern, then the result count. */
function QueryPanel({
  frame,
  detectAt,
  siblingsAt,
  patternAt,
  dayAt,
}: {
  frame: number;
  detectAt: number;
  siblingsAt: number;
  patternAt: number;
  dayAt: number;
}) {
  const searching = progress(frame, detectAt, 10) * (1 - progress(frame, siblingsAt, 10));
  const found = progress(frame, siblingsAt, 12);
  // Each filter glows while it is named: the pattern (first two), then «mismo día».
  const hot = [
    progress(frame, patternAt - 4, 10) * (1 - progress(frame, dayAt + 10, 14)),
    progress(frame, patternAt - 4, 10) * (1 - progress(frame, dayAt + 10, 14)),
    progress(frame, dayAt - 4, 10) * (1 - progress(frame, dayAt + 40, 14)),
  ];
  const ring = ((frame - detectAt) % 45) / 45;
  return (
    <Panel title="Patrón de registro" icon="search" accent="cyan" glow={searching * 0.7} style={{ height: '100%' }} bodyStyle={{ padding: '26px 28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
        {PATTERN.map((p, i) => (
          <div
            key={p.text}
            style={{
              borderRadius: RADIUS.pill,
              boxShadow: hot[i] > 0.01 ? `0 0 0 3px ${alpha(C.textStrong, 0.55 * hot[i])}` : undefined,
            }}
          >
            <PatternChip text={p.text} icon={p.icon} lit={1} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 28, right: 28, bottom: 26, height: 64, display: 'flex', alignItems: 'center', gap: 16, borderTop: `2px solid ${C.ink700}`, paddingTop: 18 }}>
        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
          {searching > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 22 - 22 * (0.6 + ring),
                top: 22 - 22 * (0.6 + ring),
                width: 44 * (0.6 + ring),
                height: 44 * (0.6 + ring),
                borderRadius: '50%',
                border: `3px solid ${alpha(C.cyan, (1 - ring) * searching)}`,
              }}
            />
          ) : null}
          <Icon name={found > 0.5 ? 'check' : 'radar'} size={44} color={found > 0.5 ? C.emerald : searching > 0.01 ? C.cyan : C.faint} strokeWidth={2.2} />
        </div>
        <div style={{ display: 'grid' }}>
          <span style={{ gridArea: '1 / 1', fontSize: TYPE.label, fontWeight: 700, color: C.cyanSoft, opacity: (1 - found) * (0.45 + 0.55 * searching), whiteSpace: 'nowrap' }}>
            {searching > 0.01 ? 'buscando el lote' : 'buscar el lote'}
          </span>
          <span style={{ gridArea: '1 / 1', fontSize: TYPE.label, fontWeight: 750, color: C.emerald, opacity: found, whiteSpace: 'nowrap' }}>
            lote encontrado
          </span>
        </div>
      </div>
    </Panel>
  );
}

/** While the search runs, a soft band sweeps the empty result list. */
function Scan({ frame, fps, from, to }: { frame: number; fps: number; from: number; to: number }) {
  const on = progress(frame, from, 10) * (1 - progress(frame, to - 6, 12));
  if (on <= 0.001) return null;
  const t = (((frame - from) / fps) % 1.6) / 1.6;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: on }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${-20 + t * 110}%`,
          height: '22%',
          background: `linear-gradient(180deg, transparent, ${alpha(C.cyan, 0.12)} 50%, transparent)`,
        }}
      />
    </div>
  );
}

/** One sibling: redacted name, asleep, then struck through and stamped. */
function SiblingRow({ frame, i, width, at, asleepAt, blockAt }: { frame: number; i: number; width: number; at: number; asleepAt: number; blockAt: number }) {
  if (frame < at - 4) return null;
  const inn = enter(frame, at, { distance: 14, axis: 'x' });
  const sleep = enter(frame, asleepAt, { distance: 8 });
  const strike = progress(frame, blockAt, 12, EASE.inOut);
  const stamp = progress(frame, blockAt + 4, 10, EASE.out);
  return (
    <div
      style={{
        position: 'relative',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 14px',
        borderBottom: i < SIBLINGS.length - 1 ? `2px solid ${alpha(C.ink700, 0.7)}` : undefined,
        ...inn,
      }}
    >
      <Icon name="globe" size={30} color={strike > 0.5 ? C.roseSoft : C.sky} />
      <div style={{ width: 400, flexShrink: 0 }}>
        <RedactedName width={width} height={24} tld={56} tint={strike > 0.5 ? C.roseSoft : C.muted} strength={0.7 - 0.25 * strike} strike={strike} />
      </div>
      <div style={{ ...sleep, opacity: sleep.opacity * (1 - 0.35 * strike) }}>
        <Chip accent="muted" icon="clock" size={TYPE.label}>
          dormido
        </Chip>
      </div>
      {stamp > 0 ? (
        <div
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '5px 16px',
            borderRadius: RADIUS.md,
            border: `3px solid ${C.emerald}`,
            background: alpha(C.ink950, 0.7),
            color: C.emerald,
            fontSize: TYPE.label,
            fontWeight: 850,
            letterSpacing: 2,
            whiteSpace: 'nowrap',
            opacity: stamp,
            transform: `rotate(-4deg) scale(${1.5 - 0.5 * stamp})`,
          }}
        >
          <Icon name="shield" size={30} color={C.emerald} strokeWidth={2.4} />
          BLOQUEADO
        </div>
      ) : null}
    </div>
  );
}

/** Courses of Action for the DELIVERY phase: the block is a Deny. */
function CoaCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const p = springIn(frame, fps, at - 6, { damping: 16 });
  const deny = progress(frame, at + 8, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: PANEL_TOP,
        width: SIDE_W,
        height: PANEL_H,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - Math.min(1, p)) * 60}px)`,
      }}
    >
      <Panel
        title="Courses of Action"
        icon="layers"
        accent="emerald"
        glow={deny * 0.8}
        right={
          <Chip accent="rose" size={TYPE.small}>
            DELIVERY
          </Chip>
        }
        style={{ height: '100%' }}
        bodyStyle={{ padding: '14px 22px' }}
      >
        {COA_ACTIONS.map((a) => (a === 'Deny' ? <DenyRow key={a} p={deny} /> : <ActionRow key={a} label={a} />))}
      </Panel>
    </div>
  );
}

function ActionRow({ label }: { label: string }) {
  return (
    <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 14, padding: '0 12px' }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: C.ink600 }} />
      <span style={{ fontSize: TYPE.small, fontWeight: 600, color: C.faint }}>{label}</span>
    </div>
  );
}

function DenyRow({ p }: { p: number }): ReactNode {
  return (
    <div
      style={{
        height: 64,
        margin: '4px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 12px',
        borderRadius: 14,
        background: alpha(C.emerald, 0.1 + 0.1 * p),
        border: `2px solid ${alpha(C.emerald, 0.35 + 0.6 * p)}`,
        boxShadow: p > 0.01 ? `0 0 ${Math.round(26 * p)}px ${alpha(C.emerald, 0.35 * p)}` : undefined,
      }}
    >
      <Icon name="check" size={32} color={C.emerald} strokeWidth={2.8} />
      <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, letterSpacing: -0.3 }}>Deny</span>
      <span style={{ marginLeft: 'auto', fontSize: TYPE.small, fontWeight: 650, color: '#6ee7b7', whiteSpace: 'nowrap' }}>impide que empiece</span>
    </div>
  );
}
