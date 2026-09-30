import type { ReactNode } from 'react';
import { interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, mix, windowWeight } from '../../../engine/src/ui';
import {
  BOARD_BEFORE,
  CLEANED,
  CLEAN_ITEMS,
  CLEAN_TITLE,
  ERADICATE,
  FLEET,
  FLEET_TITLE,
  HUNT_TITLE,
  HUNT_WORDS,
  INDICATORS,
  NAVE_ACTIONS,
  NAVE_LABEL,
  NO_AGENT,
  PERSIST,
  RESULT,
  SERVER,
  STATION,
  TASK,
  TASK_WORDS,
  UNSEEN_HOST,
  UNSEEN_TAG,
  type CleanItem,
  type Host,
  type Indicator,
  type NaveAction,
} from '../data/s06-eradicate';
import { Board, columnDef, emWidth, type BoardProps } from './parts/Board';
import { Nave, naveAnchors, naveSize } from './parts/Nave';
import { Stage, segment, wordFrame } from './kit';

const S = 's06-eradicate';

/**
 * s06-eradicate «Nos vemos el jueves».
 *   (intercept)  SILENT PAGER: «¿Borraste mi programa? … Nos vemos el jueves.» Under the card
 *                (top band clear until s06-01 ends): srv-tc-app03, «programa · borrado».
 *   task         on it, a scheduled task created at 01:58 that runs «cada jueves · 23:30».
 *   persist      its name, «persistencia», and the same task on ADM-WS-07 (no EDR agent).
 *   holes        the cleaning list, struck item by item: the programme, the task on both
 *                hosts, the hole (macro permission withdrawn; firewall rule 3 confirmed);
 *                «esto es erradicar».
 *   window       the port warehouse: throw the intruder out, check every corner, brick up
 *                the window — each action names what it stands for.
 *   hunt / zero  the V1 search plus the task, on every host of the port (ADM-WS-07 now with
 *                an agent); the counter lands on 0 and the board ticks Erradicación.
 */
export function S06Eradicate(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const persist = props.cue('persist');
  const holes = props.cue('holes');
  const windowAt = props.cue('window');
  const hunt = props.cue('hunt');
  const zero = props.cue('zero');
  // The intercept card owns the top band until s06-01 has been heard.
  const interceptEnd = segment(props, 's06-01').to;

  const w = {
    task: wordFrame(S, 's06-01', TASK_WORDS.task),
    when: wordFrame(S, 's06-01', TASK_WORDS.when),
    persist: wordFrame(S, 's06-02', PERSIST.word),
    twin: wordFrame(S, 's06-02', PERSIST.twinWord),
    noAgent: wordFrame(S, 's06-02', PERSIST.noAgentWord),
    clean: CLEAN_ITEMS.map((it) => wordFrame(S, 's06-03', it.word)),
    eradicate: wordFrame(S, 's06-03', ERADICATE.word),
    nave: wordFrame(S, 's06-04', NAVE_LABEL.word),
    actions: NAVE_ACTIONS.map((a) => wordFrame(S, 's06-04', a.word)),
    rincon: wordFrame(S, 's06-04', 'rincón'),
    naveDone: wordFrame(S, 's06-04', NAVE_LABEL.doneWord),
    thisOne: wordFrame(S, 's06-05', HUNT_WORDS.thisOne),
    search: wordFrame(S, 's06-05', HUNT_WORDS.search),
    all: wordFrame(S, 's06-05', HUNT_WORDS.all),
    also: wordFrame(S, 's06-05', HUNT_WORDS.also),
    unseen: wordFrame(S, 's06-05', HUNT_WORDS.unseen),
  };

  const tasksOn = fadeIn(frame, 0, 12) * (1 - progress(frame, holes - 6, 14, EASE.inOut));
  const cleanOn = progress(frame, holes, 14) * (1 - progress(frame, windowAt - 4, 14, EASE.inOut));
  const naveOn = progress(frame, windowAt, 12) * (1 - progress(frame, hunt - 6, 14, EASE.inOut));
  const huntOn = progress(frame, hunt - 4, 14);

  const board: BoardProps = {
    compact: 1,
    columns: {
      ...BOARD_BEFORE,
      eradicate: {
        focus: [hunt - 4, Number.POSITIVE_INFINITY],
        box: [{ at: zero, state: 'checked' }],
        glow: progress(frame, zero + 6, 16),
      },
    },
  };

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {tasksOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: tasksOn }}>
          <Tasks frame={frame} persistAt={persist} labelAt={Math.max(w.persist, interceptEnd + 2)} taskAt={w.task} whenAt={w.when} twinAt={w.twin} noAgentAt={w.noAgent} />
        </div>
      ) : null}

      {cleanOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: cleanOn }}>
          <CleanList frame={frame} at={holes} wordAt={w.clean} eradicateAt={w.eradicate} />
        </div>
      ) : null}

      {naveOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: naveOn }}>
          <NaveSearch frame={frame} fps={fps} enterAt={windowAt} naveAt={w.nave} actionAt={w.actions} rinconAt={w.rincon} doneAt={w.naveDone} />
        </div>
      ) : null}

      {huntOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: huntOn }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <Board {...board} show={progress(frame, hunt - 6, 18)} frame={frame} />
          </div>
          <Hunt frame={frame} fps={fps} at={hunt} w={w} zero={zero} />
        </div>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// s06-01 / s06-02: the scheduled task, then the same one on ADM-WS-07.
// ---------------------------------------------------------------------------

const CARD = { top: 250, width: 800, height: 390 } as const;
const HERO_X = (1728 - CARD.width) / 2;
const TWIN_X = 1728 - CARD.width;

function Tasks({
  frame,
  persistAt,
  labelAt,
  taskAt,
  whenAt,
  twinAt,
  noAgentAt,
}: {
  frame: number;
  persistAt: number;
  labelAt: number;
  taskAt: number;
  whenAt: number;
  twinAt: number;
  noAgentAt: number;
}) {
  const slide = progress(frame, persistAt - 4, 26, EASE.inOut);
  const ax = mix(HERO_X, 0, slide);
  const twin = progress(frame, twinAt - 8, 18);
  const label = progress(frame, labelAt - 6, 14);
  const lineA = progress(frame, labelAt + 4, 16, EASE.inOut);
  const lineB = progress(frame, twinAt + 4, 16, EASE.inOut);
  const whenGlow = (at: number) => progress(frame, at - 4, 12) * (0.75 + 0.25 * pulse(frame, 30, 0.6));
  return (
    <>
      <HostCard host={SERVER} left={ax} frame={frame} appearAt={0}>
        <Row top={120} at={0} frame={frame}>
          <Icon name="check" size={44} color={C.emerald} strokeWidth={2.6} />
          <span style={{ fontSize: 40, fontWeight: 700, color: C.text }}>{CLEANED.label}</span>
          <Chip accent="emerald" size={30}>
            {CLEANED.chip}
          </Chip>
        </Row>
        <TaskRows frame={frame} top={196} at={taskAt - 4} whenAt={whenAt - 4} glow={whenGlow(whenAt)} />
      </HostCard>

      {twin > 0.001 ? (
        <div style={{ opacity: twin, transform: `translateX(${(1 - twin) * 40}px)` }}>
          <HostCard host={STATION} left={TWIN_X} frame={frame} appearAt={twinAt - 8}>
            <Row top={120} at={noAgentAt - 4} frame={frame}>
              <Icon name="eyeOff" size={44} color={C.amber} strokeWidth={2.4} />
              <span style={{ fontSize: 40, fontWeight: 750, color: '#fcd34d' }}>{NO_AGENT}</span>
            </Row>
            <TaskRows frame={frame} top={196} at={twinAt - 2} whenAt={twinAt + 6} glow={whenGlow(twinAt + 6)} />
          </HostCard>
        </div>
      ) : null}

      {label > 0.001 ? (
        <>
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {[
              { x: ax + CARD.width / 2, p: lineA },
              { x: TWIN_X + CARD.width / 2, p: lineB },
            ].map((l, i) =>
              l.p > 0.001 ? (
                <path
                  key={i}
                  d={`M 864 142 C 864 ${196}, ${l.x} ${190}, ${l.x} ${CARD.top - 6}`}
                  fill="none"
                  stroke={alpha(C.rose, 0.8)}
                  strokeWidth={4}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - l.p}
                />
              ) : null,
            )}
          </svg>
          <div style={{ position: 'absolute', left: 864, top: 44, transform: `translateX(-50%) scale(${0.9 + 0.1 * label})`, opacity: label }}>
            <Chip accent="rose" icon="clock" size={56} style={{ fontWeight: 850 }}>
              {PERSIST.label}
            </Chip>
          </div>
        </>
      ) : null}
    </>
  );
}

function HostCard({ host, left, frame, appearAt, children }: { host: Host; left: number; frame: number; appearAt: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: CARD.top,
        width: CARD.width,
        height: CARD.height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
        ...enter(frame, appearAt, { distance: 16 }),
      }}
    >
      <div style={{ position: 'absolute', left: 30, top: 22, display: 'flex', alignItems: 'center', gap: 20, whiteSpace: 'nowrap' }}>
        <Icon name={host.icon} size={56} color={C.cyan} />
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{host.name}</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.muted, marginTop: 2 }}>{host.role}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 30, right: 30, top: 108, height: 2, background: C.ink700 }} />
      {children}
    </div>
  );
}

function Row({ top, at, frame, children }: { top: number; at: number; frame: number; children: ReactNode }) {
  if (frame < at - 1) return null;
  return <div style={{ position: 'absolute', left: 30, top, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap', ...enter(frame, at, { distance: 12, axis: 'x' }) }}>{children}</div>;
}

function TaskRows({ frame, top, at, whenAt, glow }: { frame: number; top: number; at: number; whenAt: number; glow: number }) {
  return (
    <>
      <Row top={top} at={at} frame={frame}>
        <Icon name="clock" size={48} color={C.rose} strokeWidth={2.4} />
        <div>
          <div style={{ fontSize: 46, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{TASK.title}</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.muted, lineHeight: 1.3 }}>{TASK.created}</div>
        </div>
      </Row>
      <Row top={top + 104} at={whenAt} frame={frame}>
        <div
          style={{
            marginLeft: 66,
            padding: '6px 18px',
            borderRadius: RADIUS.sm,
            border: `2px solid ${alpha(C.rose, 0.4 + 0.5 * glow)}`,
            background: alpha(C.rose, 0.08 + 0.1 * glow),
            boxShadow: glow > 0.01 ? `0 0 ${Math.round(22 * glow)}px ${alpha(C.rose, 0.35 * glow)}` : undefined,
            fontFamily: FONT.mono,
            fontSize: 42,
            fontWeight: 800,
            color: C.roseSoft,
          }}
        >
          {TASK.when}
        </div>
      </Row>
    </>
  );
}

// ---------------------------------------------------------------------------
// s06-03: the cleaning list, struck item by item.
// ---------------------------------------------------------------------------

const LIST = { left: 214, top: 146, width: 1300 } as const;
const ROW_TOPS = [0, 100, 228, 314, 402];

function CleanList({ frame, at, wordAt, eradicateAt }: { frame: number; at: number; wordAt: number[]; eradicateAt: number }) {
  // Tick frames: each item as the voice names it; the group row once both of its lines are done.
  const ticks = CLEAN_ITEMS.map((it, i) => wordAt[i] + (it.sub ? (i === 3 ? 10 : 4) : 6));
  ticks[2] = ticks[4] + 10;
  const stamp = springIn(frame, 30, eradicateAt - 4, { damping: 14 });
  return (
    <>
      <div style={{ position: 'absolute', left: LIST.left, top: 44, height: 70, display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap', ...enter(frame, at + 2, { distance: 14 }) }}>
        <Icon name="check" size={52} color={C.emerald} strokeWidth={2.6} />
        <span style={{ fontSize: 52, fontWeight: 850, letterSpacing: -0.4, color: C.textStrong }}>{CLEAN_TITLE}</span>
      </div>
      {frame >= eradicateAt - 5 ? (
        <div style={{ position: 'absolute', left: LIST.left + LIST.width, top: 52, transform: `translateX(-100%) scale(${mix(1.25, 1, stamp)})`, transformOrigin: 'right center', opacity: Math.min(1, stamp * 1.4), display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
          <Chip accent="emerald" solid size={36}>
            {ERADICATE.label}
          </Chip>
          <span style={{ fontSize: 30, fontWeight: 650, color: '#c4b5fd' }}>{columnDef('eradicate').en}</span>
        </div>
      ) : null}
      {CLEAN_ITEMS.map((it, i) => (
        <CleanRow key={it.text} item={it} top={LIST.top + ROW_TOPS[i]} frame={frame} appearAt={at + 6 + i * 6} tickAt={ticks[i]} />
      ))}
    </>
  );
}

function CleanRow({ item, top, frame, appearAt, tickAt }: { item: CleanItem; top: number; frame: number; appearAt: number; tickAt: number }) {
  const size = item.sub ? 40 : 50;
  const box = item.sub ? 46 : 56;
  const left = LIST.left + (item.sub ? 84 : 0);
  const tick = progress(frame, tickAt, 12, EASE.inOut);
  const strike = progress(frame, tickAt + 4, 12, EASE.inOut);
  const chipIn = enter(frame, tickAt + 2, { distance: 10, axis: 'x' });
  const textW = emWidth(item.text) * size;
  const sw = Math.max(3, box * 0.07);
  return (
    <div style={{ position: 'absolute', left, top, ...enter(frame, appearAt, { distance: 14 }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: box + 12, whiteSpace: 'nowrap' }}>
        <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} style={{ flexShrink: 0, overflow: 'visible' }}>
          <rect x={sw / 2} y={sw / 2} width={box - sw} height={box - sw} rx={box * 0.18} fill={alpha(C.emerald, 0.12 * tick)} stroke={interpolateColors(tick, [0, 1], [alpha(C.muted, 0.7), C.emerald])} strokeWidth={sw} />
          {tick > 0.001 ? (
            <path
              d={`M ${box * 0.22} ${box * 0.53} L ${box * 0.43} ${box * 0.73} L ${box * 0.8} ${box * 0.3}`}
              fill="none"
              stroke={C.emerald}
              strokeWidth={box * 0.13}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - tick}
            />
          ) : null}
        </svg>
        <span style={{ position: 'relative', fontSize: size, fontWeight: item.sub ? 700 : 800, color: interpolateColors(strike, [0, 1], [C.textStrong, C.muted]) }}>
          {item.text}
          {strike > 0.001 ? <span style={{ position: 'absolute', left: -6, top: '54%', height: Math.max(4, size * 0.09), width: (textW + 12) * strike, borderRadius: 3, background: alpha(C.emerald, 0.9) }} /> : null}
        </span>
        {item.chip && frame >= tickAt ? (
          <div style={chipIn}>
            <Chip accent="emerald" icon="check" size={32}>
              {item.chip}
            </Chip>
          </div>
        ) : null}
      </div>
      {item.mono ? (
        <div style={{ marginLeft: box + 22, marginTop: -4, fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: item.sub ? C.muted : C.cyanSoft, whiteSpace: 'nowrap', opacity: 1 - 0.35 * strike }}>{item.mono}</div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// s06-04: the port warehouse — throw her out, check every corner, brick up the window.
// ---------------------------------------------------------------------------

const NAVE_W = 600;
const NAVE_POS = { left: 120, top: 26 } as const;
const ACTIONS = { left: 800, top: 84, gap: 170 } as const;
/** Interior corners the search visits (design units of the 400×330 nave). */
const CORNERS = [
  { x: 140, y: 200 },
  { x: 262, y: 200 },
  { x: 262, y: 302 },
  { x: 140, y: 302 },
];

function NaveSearch({ frame, fps, enterAt, naveAt, actionAt, rinconAt, doneAt }: { frame: number; fps: number; enterAt: number; naveAt: number; actionAt: number[]; rinconAt: number; doneAt: number }) {
  const s = NAVE_W / 400;
  const outAt = actionAt[0] + 4;
  const sweepFrom = actionAt[1] - 2;
  const sweepTo = Math.max(sweepFrom + 40, Math.min(rinconAt + 18, actionAt[2] - 4));
  const brickFrom = actionAt[2] + 2;
  const brickTo = brickFrom + 40;
  const done = [outAt + 16, sweepTo + 2, brickTo];
  const leg = (sweepTo - sweepFrom) / CORNERS.length;
  // The magnifier glides corner to corner; each corner it reaches keeps an emerald dot.
  const t = Math.max(0, Math.min(CORNERS.length - 1e-6, (frame - sweepFrom) / leg));
  const k = Math.floor(t);
  const f = EASE.inOut(Math.min(1, (t - k) * 1.6));
  const from = k === 0 ? { x: 200, y: 250 } : CORNERS[k - 1];
  const to = CORNERS[k];
  const mag = { x: mix(from.x, to.x, f) * s, y: mix(from.y, to.y, f) * s };
  const magOn = progress(frame, sweepFrom - 4, 8) * (1 - progress(frame, sweepTo + 4, 10));
  const glow = progress(frame, doneAt - 4, 16);
  // «tapiar la ventana»: the small gable window gets a ring while it is bricked up.
  const win = naveAnchors(NAVE_W).window;
  const ring = windowWeight(frame, brickFrom - 6, brickTo + 24, { ramp: 10 }) * (0.75 + 0.25 * pulse(frame, fps, 0.8));
  return (
    <>
      <div style={{ position: 'absolute', left: NAVE_POS.left, top: NAVE_POS.top, ...enter(frame, Math.min(naveAt - 8, enterAt + 4), { distance: 20 }) }}>
        <Nave
          width={NAVE_W}
          open={progress(frame, naveAt - 2, 20, EASE.inOut)}
          contents="crates"
          intruder={1 - progress(frame, outAt, 16)}
          bricked={progress(frame, brickFrom, brickTo - brickFrom, EASE.linear)}
          plate="03"
          label={NAVE_LABEL.label}
          sub={NAVE_LABEL.sub}
          glow={glow}
          glowTone="emerald"
          frame={frame}
        />
        <svg width={NAVE_W} height={naveSize(NAVE_W).height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
          {ring > 0.001 ? <circle cx={win.x} cy={win.y} r={62} fill="none" stroke={C.emerald} strokeWidth={5} opacity={ring} style={{ filter: `drop-shadow(0 0 10px ${alpha(C.emerald, 0.8)})` }} /> : null}
          {CORNERS.map((c, i) => {
            const hit = progress(frame, sweepFrom + leg * (i + 0.62), 8);
            return hit > 0.001 ? <circle key={i} cx={c.x * s} cy={c.y * s} r={9} fill={C.emerald} opacity={hit} style={{ filter: `drop-shadow(0 0 6px ${alpha(C.emerald, 0.9)})` }} /> : null;
          })}
        </svg>
        {magOn > 0.001 ? (
          <div style={{ position: 'absolute', left: mag.x, top: mag.y, transform: 'translate(-30%, -30%)', opacity: magOn }}>
            <Icon name="search" size={64} color={C.textStrong} strokeWidth={2.4} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.9)})` }} />
          </div>
        ) : null}
      </div>
      {NAVE_ACTIONS.map((a, i) => (
        <ActionItem key={a.action} action={a} top={ACTIONS.top + i * ACTIONS.gap} frame={frame} fps={fps} at={actionAt[i] - 6} doneAt={done[i]} />
      ))}
    </>
  );
}

function ActionItem({ action, top, frame, fps, at, doneAt }: { action: NaveAction; top: number; frame: number; fps: number; at: number; doneAt: number }) {
  if (frame < at - 1) return null;
  const inn = enter(frame, at, { distance: 18, axis: 'x' });
  const ok = springIn(frame, fps, doneAt, { damping: 13 });
  const lit = windowWeight(frame, at + 4, doneAt + 30, { ramp: 10 });
  return (
    <div style={{ position: 'absolute', left: ACTIONS.left, top, display: 'flex', alignItems: 'center', gap: 28, whiteSpace: 'nowrap', ...inn }}>
      <div
        style={{
          width: 84,
          height: 84,
          flexShrink: 0,
          borderRadius: 42,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${interpolateColors(lit, [0, 1], [C.ink600, C.cyan])}`,
          background: alpha(C.cyan, 0.06 + 0.1 * lit),
          boxShadow: lit > 0.01 ? `0 0 ${Math.round(24 * lit)}px ${alpha(C.cyan, 0.35 * lit)}` : undefined,
        }}
      >
        <Icon name={action.icon} size={46} color={C.cyan} strokeWidth={2.2} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontSize: 52, fontWeight: 850, letterSpacing: -0.4, color: C.textStrong }}>{action.action}</span>
          {frame >= doneAt ? <Icon name="check" size={52} color={C.emerald} strokeWidth={3} style={{ transform: `scale(${ok})`, opacity: Math.min(1, ok) }} /> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <svg width={22} height={22} viewBox="0 0 22 22">
            <path d="M 6 3 L 16 11 L 6 19" fill="none" stroke={C.emerald} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 650, color: '#6ee7b7' }}>{action.means}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s06-05: the search on every host of the port, down to 0.
// ---------------------------------------------------------------------------

const PANEL = { left: 0, top: 178, width: 860, height: 472 } as const;
const FLEET_BOX = { left: 900, top: 178, width: 828 } as const;
const TILE = { w: 196, h: 64, gapX: 14, gapY: 12, top: 232 } as const;

type HuntWords = { thisOne: number; search: number; all: number; also: number; unseen: number };

function Hunt({ frame, fps, at, w, zero }: { frame: number; fps: number; at: number; w: HuntWords; zero: number }) {
  // Scan order: every host but ADM-WS-07 between «todos» and «también»; ADM-WS-07 last, on «veían».
  const unseenIdx = FLEET.indexOf(UNSEEN_HOST);
  const others = FLEET.map((_, i) => i).filter((i) => i !== unseenIdx);
  const step = Math.max(2, (w.also - 4 - w.all) / others.length);
  const scanAt: number[] = [];
  others.forEach((idx, j) => {
    scanAt[idx] = w.all + j * step;
  });
  scanAt[unseenIdx] = w.unseen - 2;
  const scanned = scanAt.filter((s) => frame >= s + 4).length;
  const thisOne = windowWeight(frame, at + 4, w.search, { ramp: 10 });
  const agent = progress(frame, w.also - 4, 14);
  const result = springIn(frame, fps, zero - 2, { damping: 14 });
  return (
    <>
      {/* The indicators of V1, plus the scheduled task */}
      <div
        style={{
          position: 'absolute',
          left: PANEL.left,
          top: PANEL.top,
          width: PANEL.width,
          height: PANEL.height,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          ...enter(frame, at, { distance: 16 }),
        }}
      >
        <div style={{ position: 'absolute', left: 28, top: 18, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
          <Icon name="search" size={40} color={C.cyan} strokeWidth={2.4} />
          <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>{HUNT_TITLE}</span>
        </div>
        <div style={{ position: 'absolute', left: 28, right: 28, top: 76, height: 2, background: C.ink700 }} />
        {INDICATORS.map((ind, i) => (
          <IndicatorRow key={ind.label} ind={ind} top={92 + i * 94} frame={frame} at={w.search - 4 + i * 8} />
        ))}
      </div>

      {/* The fleet */}
      <div style={{ position: 'absolute', left: FLEET_BOX.left, top: FLEET_BOX.top, width: FLEET_BOX.width, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap', ...enter(frame, at + 4, { distance: 12 }) }}>
        <span style={{ fontSize: 32, fontWeight: 750, color: C.text }}>{FLEET_TITLE}</span>
        <span style={{ fontSize: 30, fontWeight: 650, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>
          revisados <span style={{ color: scanned === FLEET.length ? '#6ee7b7' : C.textStrong, fontWeight: 800 }}>{scanned}</span> de {FLEET.length}
        </span>
      </div>
      {FLEET.map((name, i) => (
        <FleetTile
          key={i}
          i={i}
          name={name}
          frame={frame}
          appearAt={at + 6 + (i % 4) * 2 + Math.floor(i / 4) * 3}
          scanAt={scanAt[i]}
          focus={name === SERVER.name ? thisOne : 0}
          unseen={name === UNSEEN_HOST ? agent : null}
        />
      ))}
      {frame >= w.also - 6 && frame < zero + 4 ? (
        <div style={{ position: 'absolute', left: FLEET_BOX.left, top: 560, ...enter(frame, w.also - 4, { distance: 12 }), opacity: progress(frame, w.also - 4, 18) * (1 - progress(frame, zero - 8, 10)) }}>
          <Chip accent="emerald" icon="eye" size={32}>
            {UNSEEN_HOST} · {UNSEEN_TAG.after}
          </Chip>
        </div>
      ) : null}
      {frame >= zero - 3 ? (
        <div
          style={{
            position: 'absolute',
            left: FLEET_BOX.left + FLEET_BOX.width / 2,
            top: 530,
            transform: `translateX(-50%) scale(${mix(1.3, 1, result)})`,
            transformOrigin: 'center center',
            opacity: Math.min(1, result * 1.5),
            display: 'flex',
            alignItems: 'baseline',
            gap: 16,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 104, fontWeight: 850, color: C.emerald, lineHeight: 1, textShadow: `0 0 30px ${alpha(C.emerald, 0.5)}` }}>0</span>
          <span style={{ fontSize: 40, fontWeight: 750, color: '#6ee7b7' }}>{RESULT.label}</span>
        </div>
      ) : null}
    </>
  );
}

function IndicatorRow({ ind, top, frame, at }: { ind: Indicator; top: number; frame: number; at: number }) {
  if (frame < at - 1) return null;
  return (
    <div style={{ position: 'absolute', left: 28, top, whiteSpace: 'nowrap', ...enter(frame, at, { distance: 12, axis: 'x' }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 26, fontWeight: 650, color: C.muted }}>{ind.label}</span>
        {ind.chip ? (
          <Chip accent="emerald" size={22}>
            {ind.chip}
          </Chip>
        ) : null}
      </div>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, color: ind.chip ? C.roseSoft : C.cyanSoft }}>
        {ind.pattern
          ? ind.pattern.map((p, k) => (
              <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 28 }}>
                {k > 0 ? <Chevron /> : null}
                {p}
              </span>
            ))
          : ind.value}
      </div>
    </div>
  );
}

/** «>» between processes, drawn (no arrow characters in text). */
function Chevron() {
  return (
    <svg width={18} height={26} viewBox="0 0 18 26" style={{ flexShrink: 0 }}>
      <path d="M 4 4 L 14 13 L 4 22" fill="none" stroke={C.muted} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FleetTile({ i, name, frame, appearAt, scanAt, focus, unseen }: { i: number; name: string | null; frame: number; appearAt: number; scanAt: number; focus: number; unseen: number | null }) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const left = FLEET_BOX.left + col * (TILE.w + TILE.gapX);
  const top = FLEET_BOX.top + TILE.top - FLEET_BOX.top + row * (TILE.h + TILE.gapY);
  const scanning = windowWeight(frame, scanAt - 4, scanAt + 6, { ramp: 4, lead: 0 });
  const ok = progress(frame, scanAt + 2, 8);
  const unseenAmber = unseen !== null ? 1 - unseen : 0;
  const border = unseenAmber > 0.5 && ok < 0.5 ? alpha(C.amber, 0.8) : interpolateColors(ok, [0, 1], [C.ink600, alpha(C.emerald, 0.75)]);
  const inn = progress(frame, appearAt, 18);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: TILE.w,
        height: TILE.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        border: `2px solid ${focus > 0.3 ? C.cyan : border}`,
        background: scanning > 0.01 ? alpha(C.cyan, 0.2 * scanning) : alpha(ok > 0.5 ? C.emerald : C.ink800, ok > 0.5 ? 0.08 : 0.9),
        boxShadow: focus > 0.01 ? `0 0 ${Math.round(26 * focus)}px ${alpha(C.cyan, 0.45 * focus)}` : undefined,
        opacity: inn,
        transform: `translateY(${(1 - inn) * 10}px) scale(${1 + 0.08 * focus})`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px',
      }}
    >
      {name ? (
        <span style={{ fontFamily: FONT.mono, fontSize: name.length > 11 ? 21 : 23, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{name}</span>
      ) : (
        <div style={{ width: 110, height: 12, borderRadius: 6, background: C.ink600 }} />
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        {unseen !== null && ok < 0.5 ? <Icon name={unseen > 0.5 ? 'eye' : 'eyeOff'} size={26} color={unseen > 0.5 ? C.emerald : C.amber} strokeWidth={2.4} /> : null}
        {ok > 0.01 ? <Icon name="check" size={28} color={C.emerald} strokeWidth={3} style={{ opacity: ok }} /> : null}
      </div>
    </div>
  );
}
