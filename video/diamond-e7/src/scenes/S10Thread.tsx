import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../engine/src/ui';
import { VERTEX, type VertexId } from './parts/Diamond';
import { Stage, segment, wordFrame } from './kit';

const S = 's10-thread';

/** Kill chain phases with labels short enough for one slot of the rail. */
const PHASES = ['Recon', 'Weaponization', 'Delivery', 'Exploitation', 'Installation', 'C2', 'Actions on Objectives'];
const C2 = 5;
const AOO = 6;

const RAIL_X0 = 20;
const RAIL_X1 = 1708;
const RAIL_Y = 470;
const SLOT = (RAIL_X1 - RAIL_X0) / PHASES.length;
const dotX = (i: number) => RAIL_X0 + SLOT * (i + 0.5);

const CARD_W = 470;
const CARD_H = 250;
const CARD_TOP = 70;

/** Card centres: loose (before ordering) and ordered along the kill chain. */
const LOOSE = { e7: 470, e9: 1150 };
const ORDERED = { e7: 990, e9: 1480 };

/**
 * S10 «De evento a hilo»:
 *   (start) E7 as a compact diamond card over the kill chain rail
 *   e9      E9 arrives two days later: same capability, same methodology
 *   s10-02  Actions on Objectives lights up: it goes for what it came for
 *   chrono  both events snap into time / kill chain order
 *   thread  a line joins them: activity thread (next lesson)
 */
export function S10Thread(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e9At = props.cue('e9');
  const aooAt = wordFrame(S, 's10-02', 'Ahora');
  const chronoAt = props.cue('chrono');
  const threadAt = props.cue('thread');
  const filmAt = wordFrame(S, 's10-04', 'película');
  const nextAt = wordFrame(S, 's10-04', 'lección');
  const s04 = segment(props, 's10-04').from;

  const e9In = springIn(frame, fps, e9At, { damping: 16 });
  const snap = progress(frame, chronoAt, 26, EASE.inOut);
  const leaders = progress(frame, chronoAt + 16, 16);
  const thread = progress(frame, threadAt, 24, EASE.inOut);
  const aoo = progress(frame, aooAt - 4, 14);
  const glow = aoo * (0.6 + 0.4 * pulse(frame, fps, 0.6)) * (1 - 0.5 * thread);

  const e7x = LOOSE.e7 + (ORDERED.e7 - LOOSE.e7) * snap;
  const e9x = LOOSE.e9 + (ORDERED.e9 - LOOSE.e9) * snap + (1 - Math.min(1, e9In)) * 260;

  return (
    <Stage>
      <Rail frame={frame} aoo={glow} thread={thread} />
      <svg width={STAGE.width} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Leader x1={e7x} x2={dotX(C2)} p={leaders} color={C.roseSoft} />
        <Leader x1={e9x} x2={dotX(AOO)} p={leaders} color={C.roseSoft} />
      </svg>
      <EventCard
        x={e7x}
        opacity={Math.min(1, fadeIn(frame, 0, 10))}
        id="E7"
        date="2026-03-05"
        time="02:13 UTC"
        method="beacon HTTPS · 60 s"
        phase="C2"
        phaseHot={0}
      />
      {e9In > 0.001 ? (
        <EventCard
          x={e9x}
          opacity={Math.min(1, e9In * 1.3)}
          id="E9"
          date="2026-03-07"
          time="+2 días"
          method="misma metodología"
          phase="Actions on Objectives"
          phaseHot={glow}
        />
      ) : null}
      <ThreadPanel frame={frame} threadAt={threadAt} filmAt={filmAt} nextAt={nextAt} s04={s04} />
    </Stage>
  );
}

/** The seven kill chain phases on a horizontal rail; AoO can glow, C2 to AoO becomes the thread. */
function Rail({ frame, aoo, thread }: { frame: number; aoo: number; thread: number }) {
  const railIn = progress(frame, 0, 16);
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: RAIL_X0, top: 395, fontSize: TYPE.micro, fontWeight: 700, letterSpacing: 3, color: C.faint, opacity: railIn }}>
        KILL CHAIN
      </div>
      <svg width={STAGE.width} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={RAIL_X0} y1={RAIL_Y} x2={RAIL_X0 + (RAIL_X1 - RAIL_X0) * railIn} y2={RAIL_Y} stroke={C.ink600} strokeWidth={6} strokeLinecap="round" />
        {thread > 0 ? (
          <>
            <line
              x1={dotX(C2)}
              y1={RAIL_Y}
              x2={dotX(C2) + (dotX(AOO) - dotX(C2)) * thread}
              y2={RAIL_Y}
              stroke={C.rose}
              strokeWidth={12}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 12px ${alpha(C.rose, 0.7)})` }}
            />
            <line
              x1={dotX(C2)}
              y1={RAIL_Y}
              x2={dotX(C2) - (dotX(C2) - dotX(1)) * thread}
              y2={RAIL_Y}
              stroke={alpha(C.rose, 0.55)}
              strokeWidth={6}
              strokeDasharray="4 18"
              strokeLinecap="round"
            />
          </>
        ) : null}
        {PHASES.map((_, i) => {
          const hot = i === AOO ? aoo : 0;
          const lit = i === C2 || i === AOO ? thread : 0;
          const r = 13 + 6 * Math.max(hot, lit);
          const color = i === AOO && (hot > 0 || lit > 0) ? C.rose : i === C2 && lit > 0 ? C.rose : C.ink500;
          return (
            <circle
              key={i}
              cx={dotX(i)}
              cy={RAIL_Y}
              r={r}
              fill={Math.max(hot, lit) > 0.05 ? color : C.ink800}
              stroke={color}
              strokeWidth={4}
              opacity={progress(frame, 2 + i * 2, 12)}
              style={hot > 0.05 ? { filter: `drop-shadow(0 0 ${Math.round(18 * hot)}px ${alpha(C.rose, 0.8)})` } : undefined}
            />
          );
        })}
      </svg>
      {PHASES.map((label, i) => {
        const hot = i === AOO ? Math.max(aoo, thread) : i === C2 ? thread : 0;
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: dotX(i) - SLOT / 2,
              top: RAIL_Y + 30,
              width: SLOT,
              textAlign: 'center',
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.15,
              color: hot > 0.3 ? C.roseSoft : C.muted,
              opacity: progress(frame, 2 + i * 2, 12),
            }}
          >
            {label === 'Actions on Objectives' ? (
              <>
                Actions on
                <br />
                Objectives
              </>
            ) : (
              label
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Curved leader from a card's bottom edge down to its phase on the rail. */
function Leader({ x1, x2, p, color }: { x1: number; x2: number; p: number; color: string }) {
  if (p <= 0) return null;
  const y1 = CARD_TOP + CARD_H + 4;
  const y2 = RAIL_Y - 20;
  const d = `M ${x1} ${y1} C ${x1} ${y1 + 70}, ${x2} ${y2 - 70}, ${x2} ${y2}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={alpha(color, 0.8)}
      strokeWidth={4}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={`${p} 1`}
    />
  );
}

/** A mini diamond: four vertex dots in canonical positions and colours. */
function MiniDiamond({ size }: { size: number }) {
  const h = size / 2;
  const pts: Record<VertexId, [number, number]> = { adv: [h, 8], infra: [size - 8, h], vic: [h, size - 8], cap: [8, h] };
  const order: VertexId[] = ['adv', 'infra', 'vic', 'cap'];
  return (
    <svg width={size} height={size} style={{ flex: 'none' }}>
      <polygon points={order.map((v) => pts[v].join(',')).join(' ')} fill={alpha(C.ink700, 0.5)} stroke={alpha(C.muted, 0.7)} strokeWidth={3} />
      {order.map((v) => (
        <circle key={v} cx={pts[v][0]} cy={pts[v][1]} r={v === 'cap' ? 9 : 7} fill={VERTEX[v].tint} />
      ))}
    </svg>
  );
}

function EventCard({
  x,
  opacity,
  id,
  date,
  time,
  method,
  phase,
  phaseHot,
}: {
  x: number;
  opacity: number;
  id: string;
  date: string;
  time: string;
  method: string;
  phase: string;
  phaseHot: number;
}) {
  const cap = VERTEX.cap.tint;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - CARD_W / 2,
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        padding: '18px 22px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontSize: TYPE.h3, fontWeight: 850, color: C.textStrong, lineHeight: 1 }}>{id}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{date}</span>
        <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, fontSize: TYPE.micro, color: C.muted, whiteSpace: 'nowrap' }}>{time}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <MiniDiamond size={76} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 800, color: cap, whiteSpace: 'nowrap' }}>GLASS VIPER</span>
          <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>{method}</span>
        </div>
      </div>
      <div
        style={{
          alignSelf: 'flex-start',
          padding: '4px 14px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.rose, 0.45 + 0.55 * phaseHot)}`,
          background: alpha(C.rose, 0.08 + 0.22 * phaseHot),
          boxShadow: phaseHot > 0.05 ? `0 0 ${Math.round(22 * phaseHot)}px ${alpha(C.rose, 0.55 * phaseHot)}` : undefined,
          fontSize: TYPE.label,
          fontWeight: 750,
          color: phaseHot > 0.3 ? C.textStrong : C.roseSoft,
          whiteSpace: 'nowrap',
        }}
      >
        {phase}
      </div>
    </div>
  );
}

/** Left side, once the events are ordered: what the line means and where it continues. */
function ThreadPanel({ frame, threadAt, filmAt, nextAt, s04 }: { frame: number; threadAt: number; filmAt: number; nextAt: number; s04: number }) {
  const title = enter(frame, threadAt + 6, { distance: 20 });
  const sub = enter(frame, threadAt + 16, { distance: 16 });
  const film = enter(frame, Math.max(s04, filmAt - 30), { distance: 14 });
  const next = enter(frame, nextAt - 4, { distance: 14 });
  if (frame < threadAt) return null;
  return (
    <div style={{ position: 'absolute', left: RAIL_X0, top: CARD_TOP, width: 700, fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...title }}>
        <Icon name="link" size={44} color={C.rose} />
        <span style={{ fontSize: TYPE.h2, fontWeight: 850, color: C.textStrong, letterSpacing: -1 }}>activity thread</span>
      </div>
      <div style={{ marginTop: 14, fontSize: TYPE.label, fontWeight: 600, color: C.text, lineHeight: 1.3, ...sub }}>
        E7 y E9, ordenados en el tiempo y por fase de la kill chain
      </div>
      <div style={{ marginTop: 12, fontSize: TYPE.label, fontWeight: 600, color: C.muted, ...film }}>
        un evento es una foto · un hilo es la película
      </div>
      <div style={{ marginTop: 12, ...next }}>
        <Chip accent="cyan" icon="play" size={TYPE.label}>
          siguiente lección: activity threads
        </Chip>
      </div>
    </div>
  );
}
