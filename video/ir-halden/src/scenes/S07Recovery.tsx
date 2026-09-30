import type { CSSProperties, ReactNode } from 'react';
import { interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, Stamp, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import {
  ALERT,
  BACKUPS,
  BACKUPS_TITLE,
  BOARD_BEFORE,
  CAPTURED,
  CHECKS,
  ENTRY,
  LAST_NIGHT,
  PHOTO,
  RECOVER,
  RESTORE,
  SERVER,
  VERDICT,
  WATCH,
  ZONE,
  type Backup,
} from '../data/s07-recovery';
import { Board, type BoardProps } from './parts/Board';
import { Nave } from './parts/Nave';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-recovery';

/**
 * s07-recovery «¿Qué copia?».
 *   backups     srv-tc-app03, memory and disk already captured; three backups on a timeline
 *               (chronological, left to right).
 *   last-night  the 3-9 copy lights up: «la más reciente», «antes de la alerta» (the alert
 *               marker lands on the timeline); it breathes during the think prompt (top band clear).
 *   entry       «no vale»: what counts is when she got in — the entry marker (3-9 afternoon,
 *               Lucía's e-mail) lands before 23:00, the «ella ya dentro» zone covers the 3-9
 *               copy and it is struck out.
 *   photo       that copy as a polaroid of the warehouse with her around; she slips behind a
 *               crate: nobody can promise it is clean.
 *   restore     the 2-9 copy, from before everything, flies over to the server.
 *   verify      «hash coincide», then «Operaciones: manifiestos OK».
 *   watch       back in production with «vigilancia reforzada · 30 días»; the board ticks Recuperación.
 */
export function S07Recovery(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lastNight = props.cue('last-night');
  const entry = props.cue('entry');
  const photo = props.cue('photo');
  const restore = props.cue('restore');
  const verify = props.cue('verify');
  const watch = props.cue('watch');
  // The think prompt holds the top band at the end of s07-02.
  const thinkEnd = segment(props, 's07-02').to;

  const w = {
    captured: CAPTURED.map((c) => wordFrame(S, 's07-01', c.word)),
    recover: wordFrame(S, 's07-01', RECOVER.word),
    three: wordFrame(S, 's07-01', BACKUPS_TITLE.word),
    newest: wordFrame(S, 's07-02', LAST_NIGHT.newestWord),
    before: wordFrame(S, 's07-02', LAST_NIGHT.beforeWord),
    alert: wordFrame(S, 's07-02', ALERT.word),
    seen: wordFrame(S, 's07-03', VERDICT.seenWord),
    entered: wordFrame(S, 's07-03', ENTRY.word, ENTRY.nth),
    zone: wordFrame(S, 's07-03', ENTRY.word, ENTRY.zoneNth),
    strike: wordFrame(S, 's07-03', ENTRY.strikeWord),
    mail: wordFrame(S, 's07-03', ENTRY.mailWord),
    shoot: wordFrame(S, 's07-04', PHOTO.line1Word),
    hide: wordFrame(S, 's07-04', PHOTO.hideWord),
    crate: wordFrame(S, 's07-04', PHOTO.line2Word),
    fromBefore: wordFrame(S, 's07-05', RESTORE.word),
    fly: wordFrame(S, 's07-05', RESTORE.flyWord),
    ops: wordFrame(S, 's07-05', CHECKS.ops.word),
    opsOk: wordFrame(S, 's07-05', CHECKS.ops.tickWord),
    live: wordFrame(S, 's07-06', WATCH.liveWord),
    watched: wordFrame(S, 's07-06', WATCH.word),
    days: wordFrame(S, 's07-06', WATCH.daysWord),
    tick: wordFrame(S, 's07-06', WATCH.tickWord),
  };

  // The 2-9 copy leaves the timeline for the server just before «Primero compruebas…».
  const flyFrom = Math.min(w.fly - 14, verify - 28);
  const heroOn = fadeIn(frame, 0, 12) * (1 - progress(frame, w.three - 8, 14, EASE.inOut));
  const timelineOn = progress(frame, w.three - 4, 16) * (1 - progress(frame, flyFrom, 16, EASE.inOut));
  const photoDim = windowWeight(frame, photo + 2, restore, { ramp: 14 });
  const restoreOn = progress(frame, flyFrom + 2, 18);

  const tickAt = w.tick - 2;
  const board: BoardProps = {
    compact: 1,
    columns: {
      ...BOARD_BEFORE,
      recover: {
        focus: [watch - 4, Number.POSITIVE_INFINITY],
        box: [{ at: tickAt, state: 'checked' }],
        glow: progress(frame, tickAt + 6, 16),
      },
    },
  };

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {heroOn > 0.001 ? <ServerHero frame={frame} opacity={heroOn} capturedAt={w.captured} recoverAt={w.recover} /> : null}

      {timelineOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: timelineOn, ...dimStyle(photoDim * 0.8, timelineOn) }}>
          <Timeline frame={frame} fps={fps} w={w} lastNight={lastNight} entry={entry} thinkEnd={thinkEnd} restore={restore} hideB2={frame >= flyFrom} />
        </div>
      ) : null}

      {frame >= photo - 2 && frame < restore + 24 ? <Polaroid frame={frame} fps={fps} at={photo} out={restore} shootAt={w.shoot} hideAt={w.hide} crateAt={w.crate} /> : null}

      {restoreOn > 0.001 || frame >= flyFrom ? (
        <RestorePanel frame={frame} fps={fps} flyFrom={flyFrom} verify={verify} w={w} />
      ) : null}

      {frame >= watch - 8 ? (
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <Board {...board} show={progress(frame, watch - 6, 18)} frame={frame} />
        </div>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// s07-01: the server, memory and disk already captured.
// ---------------------------------------------------------------------------

function ServerHero({ frame, opacity, capturedAt, recoverAt }: { frame: number; opacity: number; capturedAt: number[]; recoverAt: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 404,
        top: 150,
        width: 920,
        height: 330,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
        opacity,
      }}
    >
      <div style={{ position: 'absolute', left: 40, top: 32, display: 'flex', alignItems: 'center', gap: 24, whiteSpace: 'nowrap' }}>
        <Icon name="server" size={72} color={C.cyan} />
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 56, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{SERVER.name}</div>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.muted, marginTop: 2 }}>{SERVER.role}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 40, top: 172, display: 'flex', gap: 22 }}>
        {CAPTURED.map((c, i) => (
          <div key={c.text} style={enter(frame, capturedAt[i] - 4, { distance: 12 })}>
            <Chip accent="emerald" icon="check" size={36}>
              {c.text}
            </Chip>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 40, top: 250, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...enter(frame, recoverAt - 4, { distance: 12 }) }}>
        <Icon name="archive" size={44} color={C.cyan} strokeWidth={2.2} />
        <span style={{ fontSize: 44, fontWeight: 800, color: C.cyanSoft }}>{RECOVER.text}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The timeline: three backups, the alert, the entry.
// ---------------------------------------------------------------------------

const AXIS_Y = 330;
const BC = { top: 370, width: 330, height: 170 } as const;
const BX: Record<Backup['id'], number> = { b1: 250, b2: 690, b3: 1210 };
const ENTRY_X = 950;
const ALERT_X = 1560;

type TimelineWords = {
  three: number;
  newest: number;
  before: number;
  alert: number;
  seen: number;
  entered: number;
  zone: number;
  strike: number;
  mail: number;
  fromBefore: number;
};

function Timeline({
  frame,
  fps,
  w,
  lastNight,
  entry,
  thinkEnd,
  restore,
  hideB2,
}: {
  frame: number;
  fps: number;
  w: TimelineWords;
  lastNight: number;
  entry: number;
  thinkEnd: number;
  restore: number;
  hideB2: boolean;
}) {
  const axis = progress(frame, w.three - 2, 20, EASE.inOut);
  const newest = progress(frame, w.newest - 4, 12);
  const wrong = progress(frame, entry, 10);
  const struck = progress(frame, w.strike - 2, 14, EASE.inOut);
  // During the think prompt the 3-9 copy breathes (it looks like the right answer).
  const breathe = windowWeight(frame, lastNight + 60, thinkEnd, { ramp: 10 }) * pulse(frame, fps, 0.6) * (1 - wrong);
  const bracket = progress(frame, w.before - 4, 16, EASE.inOut) * (1 - progress(frame, entry, 12));
  const zone = progress(frame, w.zone - 2, 30, EASE.inOut);
  const pick = progress(frame, restore + 2, 14);
  const seen = windowWeight(frame, w.seen - 2, w.entered, { ramp: 8 });
  const entered = windowWeight(frame, w.entered - 2, w.strike + 40, { ramp: 8 });
  const chipFade = 1 - progress(frame, entry + 4, 12);
  return (
    <>
      {/* Title */}
      <div style={{ position: 'absolute', left: 30, top: 238, height: 50, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', ...enter(frame, w.three - 2, { distance: 12 }) }}>
        <Icon name="archive" size={38} color={C.cyan} strokeWidth={2.2} />
        <span style={{ fontSize: 32, fontWeight: 700, color: C.text }}>{BACKUPS_TITLE.text}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, color: C.textStrong }}>{SERVER.name}</span>
      </div>

      {/* «Ella ya dentro»: from the entry to now */}
      {zone > 0.001 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: ENTRY_X,
              top: AXIS_Y + 6,
              width: (1720 - ENTRY_X) * zone,
              height: 244,
              background: `linear-gradient(90deg, ${alpha(C.rose, 0.16)} 0%, ${alpha(C.rose, 0.07)} 100%)`,
              borderLeft: `3px dashed ${alpha(C.rose, 0.8)}`,
              borderRadius: `0 ${RADIUS.md}px ${RADIUS.md}px 0`,
            }}
          />
          <div style={{ position: 'absolute', left: 1410, top: 598, fontSize: 32, fontWeight: 750, color: C.roseSoft, whiteSpace: 'nowrap', opacity: progress(frame, w.zone + 18, 14) }}>{ZONE}</div>
        </>
      ) : null}

      {/* Axis */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={30} y1={AXIS_Y} x2={30 + 1668 * axis} y2={AXIS_Y} stroke={C.ink500} strokeWidth={5} strokeLinecap="round" />
        {bracket > 0.001 ? <line x1={BX.b3} y1={AXIS_Y} x2={BX.b3 + (ALERT_X - BX.b3) * bracket} y2={AXIS_Y} stroke={C.cyan} strokeWidth={9} strokeLinecap="round" /> : null}
        {BACKUPS.map((b, i) => {
          const on = progress(frame, w.three + i * 6, 12);
          if (on <= 0 || (b.id === 'b2' && hideB2)) return null;
          return (
            <g key={b.id} opacity={on}>
              <line x1={BX[b.id]} y1={AXIS_Y} x2={BX[b.id]} y2={BC.top} stroke={C.ink500} strokeWidth={3} />
              <circle cx={BX[b.id]} cy={AXIS_Y} r={10} fill={C.ink900} stroke={C.muted} strokeWidth={4} />
            </g>
          );
        })}
      </svg>

      {/* Markers: the alert (when you saw her) and the entry (when she got in) */}
      <Marker x={ALERT_X} frame={frame} at={w.alert - 4} tone={C.amber} icon="bell" title={ALERT.title} sub={ALERT.when} glow={seen} />
      <Marker x={ENTRY_X} frame={frame} at={w.entered - 4} tone={C.rose} icon="flag" title={ENTRY.title} subIcon="mail" sub={ENTRY.mail} subAt={w.mail - 4} glow={entered} />

      {/* The three backups */}
      {BACKUPS.map((b, i) => {
        if (b.id === 'b2' && hideB2) return null;
        const at = w.three + i * 6;
        if (b.id === 'b3') {
          return (
            <BackupCard
              key={b.id}
              b={b}
              left={BX.b3 - BC.width / 2}
              top={BC.top}
              frame={frame}
              appearAt={at}
              tone={wrong > 0.5 ? C.rose : C.cyan}
              lit={Math.max(newest, breathe)}
              strike={struck}
              dim={0.5 * struck + 0.3 * pick}
            >
            </BackupCard>
          );
        }
        return (
          <BackupCard
            key={b.id}
            b={b}
            left={BX[b.id] - BC.width / 2}
            top={BC.top}
            frame={frame}
            appearAt={at}
            tone={C.emerald}
            lit={b.id === 'b2' ? pick : 0}
            strike={0}
            dim={b.id === 'b1' ? 0.4 * pick : 0}
          />
        );
      })}

      {/* «No vale»: lands under the 3-9 copy, where its chips were */}
      {frame >= entry ? (
        <div style={{ position: 'absolute', left: BX.b3, top: BC.top + BC.height + 30, transform: 'translateX(-50%)', opacity: 1 - 0.3 * pick }}>
          <Stamp frame={frame} at={entry + 2} accent="rose" size={40} rotate={-5}>
            {VERDICT.stamp}
          </Stamp>
        </div>
      ) : null}

      {/* Chips under the 3-9 copy */}
      <div style={{ position: 'absolute', left: BX.b3, top: BC.top + BC.height + 16, transform: 'translateX(-50%)', display: 'grid', justifyItems: 'center', gap: 10, opacity: chipFade }}>
        <div style={enter(frame, w.newest - 4, { distance: 10 })}>
          <Chip accent={wrong > 0.5 ? 'amber' : 'cyan'} icon="clock" size={30}>
            {LAST_NIGHT.newest}
          </Chip>
        </div>
        <div style={enter(frame, w.before - 4, { distance: 10 })}>
          <Chip accent={wrong > 0.5 ? 'amber' : 'cyan'} size={30}>
            {LAST_NIGHT.before}
          </Chip>
        </div>
      </div>

      {/* The chosen one */}
      {!hideB2 && pick > 0.001 ? (
        <div style={{ position: 'absolute', left: BX.b2, top: BC.top + BC.height + 16, transform: 'translateX(-50%)' }}>
          <div style={enter(frame, restore + 4, { distance: 10 })}>
            <Chip accent="emerald" icon="check" size={30}>
              {RESTORE.chip}
            </Chip>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Marker({
  x,
  frame,
  at,
  tone,
  icon,
  title,
  sub,
  subIcon,
  subAt,
  glow,
}: {
  x: number;
  frame: number;
  at: number;
  tone: string;
  icon: 'bell' | 'flag';
  title: string;
  sub: string;
  subIcon?: 'mail';
  subAt?: number;
  glow: number;
}) {
  if (frame < at - 1) return null;
  const drop = springIn(frame, 30, at, { damping: 12 });
  const g = glow * (0.7 + 0.3 * pulse(frame, 30, 0.8));
  return (
    <>
      <div style={{ position: 'absolute', left: x, top: 228, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap', opacity: Math.min(1, drop * 1.4) }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: interpolateColors(0.5, [0, 1], [tone, C.textStrong]), lineHeight: 1.15, textShadow: g > 0.02 ? `0 0 18px ${alpha(tone, 0.8 * g)}` : undefined }}>{title}</div>
        {subAt === undefined ? (
          <div style={{ fontSize: 28, fontWeight: 600, color: C.muted, lineHeight: 1.2 }}>{sub}</div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 650, color: C.text, lineHeight: 1.2, ...enter(frame, subAt, { distance: 8 }) }}>
            {subIcon ? <Icon name={subIcon} size={30} color={C.sky} strokeWidth={2.2} /> : null}
            {sub}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: AXIS_Y,
          width: 46,
          height: 46,
          transform: `translate(-50%, -50%) translateY(${(1 - drop) * -30}px) scale(${1 + 0.12 * g})`,
          borderRadius: 23,
          display: 'grid',
          placeItems: 'center',
          background: C.ink900,
          border: `3px solid ${tone}`,
          boxShadow: `0 0 ${Math.round(12 + 22 * g)}px ${alpha(tone, 0.4 + 0.4 * g)}`,
          opacity: Math.min(1, drop * 1.4),
        }}
      >
        <Icon name={icon} size={26} color={tone} strokeWidth={2.4} />
      </div>
    </>
  );
}

function BackupCard({
  b,
  left,
  top,
  frame,
  appearAt,
  tone,
  lit,
  strike,
  dim,
  scale = 1,
  children,
  style,
}: {
  b: Backup;
  left: number;
  top: number;
  frame: number;
  appearAt: number;
  tone: string;
  lit: number;
  strike: number;
  dim: number;
  scale?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const inn = progress(frame, appearAt, 16);
  if (inn <= 0) return null;
  const d = dimStyle(dim);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: BC.width,
        height: BC.height,
        opacity: inn,
        transform: `translateY(${(1 - inn) * 18}px) scale(${scale * (1 + 0.05 * lit)})`,
        transformOrigin: 'top left',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px solid ${interpolateColors(lit, [0, 1], [C.ink600, tone])}`,
          background: `linear-gradient(180deg, ${alpha(tone, 0.04 + 0.1 * lit)} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 16px 40px ${alpha('#000000', 0.35)}${lit > 0.01 ? `, 0 0 ${Math.round(34 * lit)}px ${alpha(tone, 0.35 * lit)}` : ''}`,
          padding: '20px 24px',
          ...d,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
          <Icon name="archive" size={34} color={interpolateColors(lit, [0, 1], [C.muted, tone])} strokeWidth={2.2} />
          <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: C.text }}>{b.date}</span>
        </div>
        <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: 60, fontWeight: 800, color: C.textStrong, lineHeight: 1.05 }}>{b.time}</div>
      </div>
      {strike > 0.001 ? (
        <svg width={BC.width} height={BC.height} viewBox={`0 0 ${BC.width} ${BC.height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line x1={16} y1={BC.height - 16} x2={16 + (BC.width - 32) * strike} y2={BC.height - 16 - (BC.height - 32) * strike} stroke={C.rose} strokeWidth={10} strokeLinecap="round" />
        </svg>
      ) : null}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// s07-04: that copy is a photo of the warehouse, taken while she was around.
// ---------------------------------------------------------------------------

const POLA = { cx: 1180, cy: 330, width: 520, height: 620, photoH: 440, pad: 26 } as const;
const PAPER = '#ece8df';
const INK = '#1f2937';

function Polaroid({ frame, fps, at, out, shootAt, hideAt, crateAt }: { frame: number; fps: number; at: number; out: number; shootAt: number; hideAt: number; crateAt: number }) {
  const pop = springIn(frame, fps, at + 4, { damping: 15 });
  const gone = progress(frame, out - 4, 18, EASE.inOut);
  const flash = frame >= shootAt - 2 ? 1 - progress(frame, shootAt - 2, 14) : 0;
  const hidden = progress(frame, hideAt - 4, 22, EASE.inOut);
  const doubt = progress(frame, crateAt - 4, 14);
  // It grows out of the 3-9 card on the timeline.
  const x = mix(BX.b3, POLA.cx, pop);
  const y = mix(BC.top + BC.height / 2, POLA.cy, pop) + 60 * gone;
  const scale = mix(0.3, 1, pop) * (1 - 0.1 * gone);
  const rot = mix(0, -3, pop) + 6 * gone;
  const naveW = 420;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - POLA.width / 2,
          top: y - POLA.height / 2,
          width: POLA.width,
          height: POLA.height,
          boxSizing: 'border-box',
          padding: POLA.pad,
          borderRadius: 8,
          background: PAPER,
          boxShadow: `0 30px 70px ${alpha('#000000', 0.55)}`,
          transform: `rotate(${rot}deg) scale(${scale})`,
          opacity: Math.min(1, pop * 1.5) * (1 - gone),
        }}
      >
        <div style={{ position: 'relative', width: POLA.width - 2 * POLA.pad, height: POLA.photoH, overflow: 'hidden', background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink950} 100%)` }}>
          <div style={{ position: 'absolute', left: (POLA.width - 2 * POLA.pad - naveW) / 2, top: 64 }}>
            {/* The part's intruder already stands behind the front crate; so that «rondando» reads, she is
                drawn in the open doorway first and slips behind the crate (the part's own, hidden) on «detrás». */}
            <Nave width={naveW} open={1} contents="crates" intruder={hidden} intruderHidden={1} plate="03" frame={frame} />
            {hidden < 0.999 ? (
              <svg width={naveW} height={(naveW * 330) / 400} viewBox="0 0 400 330" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <g
                  opacity={1 - hidden}
                  transform={`translate(${mix(150, 180, hidden)} ${316 + 1.5 * pulse(frame, fps, 0.4)})`}
                  style={{ filter: `drop-shadow(0 0 6px ${alpha(C.rose, 0.7)})` }}
                >
                  <path d="M -17 0 L -15 -30 Q -14 -40 0 -41 Q 14 -40 15 -30 L 17 0 Z" fill={C.rose} />
                  <circle cx={0} cy={-52} r={11} fill={C.rose} />
                  <rect x={-7} y={-55} width={14} height={4} rx={2} fill={C.roseDeep} />
                </g>
              </svg>
            ) : null}
          </div>
          {doubt > 0.001 ? (
            <div style={{ position: 'absolute', left: 268, top: 280, fontSize: 64, fontWeight: 900, color: C.roseSoft, opacity: doubt, transform: `scale(${0.7 + 0.3 * doubt})`, textShadow: `0 0 18px ${alpha(C.rose, 0.8)}` }}>?</div>
          ) : null}
          {flash > 0.001 ? <div style={{ position: 'absolute', inset: 0, background: '#ffffff', opacity: 0.85 * flash }} /> : null}
        </div>
        <div style={{ marginTop: 22, textAlign: 'center', color: INK, whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800 }}>{PHOTO.host}</div>
          <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4 }}>{PHOTO.caption}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 40, top: 40, whiteSpace: 'nowrap', opacity: 1 - gone }}>
        <div style={{ fontSize: 56, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, ...enter(frame, shootAt - 6, { distance: 14 }) }}>{PHOTO.line1}</div>
        <div style={{ marginTop: 18, fontSize: 46, fontWeight: 800, color: '#fcd34d', ...enter(frame, crateAt - 6, { distance: 12 }) }}>{PHOTO.line2}</div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// s07-05 / s07-06: restore the 2-9 copy, check it, put the server back — watched.
// ---------------------------------------------------------------------------

const REST = { cardLeft: 40, cardTop: 262, scale: 1.15, arrowX0: 450, arrowX1: 650, arrowY: 360, panelLeft: 690, panelTop: 180, panelW: 1038, panelH: 470 } as const;

type RestoreWords = { ops: number; opsOk: number; live: number; watched: number; days: number };

function RestorePanel({ frame, fps, flyFrom, verify, w }: { frame: number; fps: number; flyFrom: number; verify: number; w: RestoreWords }) {
  const fly = progress(frame, flyFrom, 24, EASE.inOut);
  const b2 = BACKUPS[1];
  const cardX = mix(BX.b2 - BC.width / 2, REST.cardLeft, fly);
  const cardY = mix(BC.top, REST.cardTop, fly);
  const panel = progress(frame, flyFrom + 6, 20);
  const arrow = progress(frame, flyFrom + 16, 14, EASE.inOut);
  const hashOk = springIn(frame, fps, verify - 2, { damping: 13 });
  const opsOk = springIn(frame, fps, w.opsOk - 2, { damping: 13 });
  const days = progress(frame, w.days - 4, 12);
  return (
    <>
      <BackupCard b={b2} left={cardX} top={cardY} frame={frame} appearAt={-100} tone={C.emerald} lit={1} strike={0} dim={0} scale={mix(1, REST.scale, fly)} />
      <div style={{ position: 'absolute', left: REST.cardLeft + (BC.width * REST.scale) / 2, top: REST.cardTop + BC.height * REST.scale + 18, transform: 'translateX(-50%)', opacity: fly }}>
        <Chip accent="emerald" icon="check" size={30}>
          {RESTORE.chip}
        </Chip>
      </div>

      {/* restaurar */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {arrow > 0.001 ? (
          <g stroke={C.emerald} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={REST.arrowX0} y1={REST.arrowY} x2={REST.arrowX0 + (REST.arrowX1 - REST.arrowX0) * arrow} y2={REST.arrowY} />
            {arrow > 0.6 ? (
              <path
                d={`M ${REST.arrowX1 - 22} ${REST.arrowY - 22} L ${REST.arrowX1} ${REST.arrowY} L ${REST.arrowX1 - 22} ${REST.arrowY + 22}`}
                opacity={progress(arrow, 0.6, 0.4)}
              />
            ) : null}
          </g>
        ) : null}
      </svg>
      <div style={{ position: 'absolute', left: (REST.arrowX0 + REST.arrowX1) / 2, top: REST.arrowY - 62, transform: 'translateX(-50%)', fontSize: 32, fontWeight: 750, color: '#6ee7b7', whiteSpace: 'nowrap', opacity: arrow }}>{RESTORE.arrow}</div>

      {/* The server, back */}
      <div
        style={{
          position: 'absolute',
          left: REST.panelLeft,
          top: REST.panelTop,
          width: REST.panelW,
          height: REST.panelH,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
          opacity: panel,
          transform: `translateX(${(1 - panel) * 40}px)`,
        }}
      >
        <div style={{ position: 'absolute', left: 32, top: 24, display: 'flex', alignItems: 'center', gap: 20, whiteSpace: 'nowrap' }}>
          <Icon name="server" size={56} color={C.cyan} />
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{SERVER.name}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: C.muted, marginTop: 2 }}>{SERVER.role}</div>
          </div>
        </div>
        {frame >= w.live - 6 ? (
          <div style={{ position: 'absolute', right: 30, top: 34, ...enter(frame, w.live - 4, { distance: 10, axis: 'x' }) }}>
            <Chip accent="emerald" icon="play" solid size={30}>
              {WATCH.live}
            </Chip>
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 32, right: 32, top: 116, height: 2, background: C.ink700 }} />

        <CheckRow top={140} frame={frame} at={verify - 8} ok={hashOk} icon="check" tone={C.emerald} text={CHECKS.hash.text} sub={CHECKS.hash.sub} />
        <CheckRow top={250} frame={frame} at={w.ops - 6} ok={opsOk} icon="check" tone={C.emerald} text={CHECKS.ops.text} />
        {frame >= w.watched - 8 ? (
          <div style={{ position: 'absolute', left: 32, top: 350, display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap', ...enter(frame, w.watched - 6, { distance: 12, axis: 'x' }) }}>
            <div style={{ width: 66, height: 66, borderRadius: 33, display: 'grid', placeItems: 'center', border: `3px solid ${C.cyan}`, background: alpha(C.cyan, 0.12), boxShadow: `0 0 ${Math.round(10 + 14 * pulse(frame, fps, 0.5))}px ${alpha(C.cyan, 0.45)}` }}>
              <Icon name="eye" size={40} color={C.cyan} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong }}>{WATCH.text}</span>
            <span style={{ fontSize: 48, fontWeight: 850, color: interpolateColors(days, [0, 1], [C.muted, C.cyanSoft]), textShadow: days > 0.05 ? `0 0 18px ${alpha(C.cyan, 0.6 * days)}` : undefined }}>· {WATCH.days}</span>
          </div>
        ) : null}
      </div>
    </>
  );
}

function CheckRow({ top, frame, at, ok, icon, tone, text, sub }: { top: number; frame: number; at: number; ok: number; icon: 'check'; tone: string; text: string; sub?: string }) {
  if (frame < at - 1) return null;
  const on = ok > 0.001;
  return (
    <div style={{ position: 'absolute', left: 32, top, display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap', ...enter(frame, at, { distance: 12, axis: 'x' }) }}>
      <div
        style={{
          width: 66,
          height: 66,
          flexShrink: 0,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${on ? tone : alpha(C.muted, 0.6)}`,
          background: alpha(tone, 0.14 * Math.min(1, ok)),
        }}
      >
        {on ? <Icon name={icon} size={46} color={tone} strokeWidth={3} style={{ transform: `scale(${ok})` }} /> : null}
      </div>
      <div>
        <div style={{ fontSize: 48, fontWeight: 850, color: on ? C.textStrong : C.text, lineHeight: 1.1 }}>{text}</div>
        {sub ? <div style={{ fontSize: 28, fontWeight: 600, color: C.muted, lineHeight: 1.3 }}>{sub}</div> : null}
      </div>
    </div>
  );
}
