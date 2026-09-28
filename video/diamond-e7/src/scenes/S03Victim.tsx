import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, fadeOut, progress, pulse } from '../../../engine/src/theme/motion';
import { Cursor, Icon, Panel } from '../../../engine/src/ui';
import { EDR_LOG, type LogDrag } from '../data/s03-victim';
import { Diamond, VERTEX, vertexPoint } from './parts/Diamond';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's03-victim';

// Log panel (left) and a smaller diamond (right half).
const LOG_W = 940;
const LOG_H = 460;
const LOG_SIZE = 24;
const CHAR_W = LOG_SIZE * 0.6; // JetBrains Mono advance
const LINE_H = Math.round(LOG_SIZE * 1.35 * 10) / 10;
const PAD_X = 28;
const PAD_Y = 16;
const BODY_TOP = 2 + 64 + 2; // panel border + header + header rule

const GEO = { cx: 1354, cy: 330, hw: 205, hh: 230 };
const CARD_W = 330;

const BAND_TOP = 492; // note band under the log

/** Frames a drag takes from pick-up to drop (matches the engine Cursor's 24-frame glide). */
const DRAG = 28;

/**
 * Frame the narrator says a word. Throws when the word is missing, like kit.tsx's wordFrame, so a
 * re-voiced script that drops it fails loudly; `_fallback` documents the old estimate-mode offset.
 */
function safeWord(segmentId: string, word: string, nth: number, _fallback: number): number {
  return wordFrame(SCENE, segmentId, word, nth);
}

/** Stage-local centre of a drag token inside the log panel. */
function tokenCentre(lineIndex: number, drag: LogDrag): { x: number; y: number } {
  const col = EDR_LOG[lineIndex].text.indexOf(drag.token);
  return {
    x: 2 + PAD_X + (col + drag.token.length / 2) * CHAR_W,
    y: BODY_TOP + PAD_Y + lineIndex * LINE_H + LINE_H / 2,
  };
}

/**
 * S03 «Víctima y capability» (demo): raw EDR lines from that night. The
 * analyst drags ENG-WS-041 and Meridian Dynamics into Victim, then the
 * SHA-256 (implant GLASS VIPER, stage-1 loader) and the named pipe pattern
 * vc_pipe_%08x into Capability. The hash changes on recompile; the pipe
 * pattern tends to stay.
 */
export function S03Victim(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rawAt = props.cue('raw');
  const dragVic = props.cue('drag-victim');
  const dragCap = props.cue('drag-cap');
  const pipeCue = props.cue('pipe');
  const s04 = segment(props, 's03-04').from;

  // Pick-up frame of each drag (the cursor reaches the token then).
  const at = {
    host: dragVic + 8,
    org: Math.max(dragVic + 8 + DRAG + 16, safeWord('s03-02', 'Meridian', 0, dragVic + 70) - 6),
    hash: dragCap + 8,
    pipe: Math.max(pipeCue + 8, safeWord('s03-04', 'pipe', 0, pipeCue + 40) - 6),
  };
  const drop = (k: keyof typeof at) => at[k] + DRAG;

  const drags = EDR_LOG.flatMap((line, i) => (line.drag ? [{ i, d: line.drag }] : []));
  const src = (k: LogDrag['key']) => {
    const hit = drags.find((x) => x.d.key === k)!;
    return tokenCentre(hit.i, hit.d);
  };
  const dst = (v: 'vic' | 'cap') => vertexPoint(v, GEO);

  const vicItems = frame >= drop('org') ? 2 : frame >= drop('host') ? 1 : 0;
  const capItems = frame >= drop('pipe') ? 3 : frame >= drop('hash') ? 2 : 0;
  const land = (k: keyof typeof at) => progress(frame, drop(k), 6) * (1 - progress(frame, drop(k) + 8, 30));

  const recompAt = Math.max(pipeCue + 20, safeWord('s03-04', 'recompilan', 0, s04 + 70) - 4);
  const patternAt = Math.max(recompAt + 20, safeWord('s03-04', 'patrón', 0, s04 + 140) - 4);

  const cursorPath = [
    { x: 760, y: 590, at: dragVic - 30 },
    { ...src('host'), at: at.host, click: true },
    { ...dst('vic'), at: drop('host') },
    { ...src('org'), at: at.org, click: true },
    { ...dst('vic'), at: drop('org') },
    { ...src('hash'), at: at.hash, click: true },
    { ...dst('cap'), at: drop('hash') },
    { ...src('pipe'), at: at.pipe, click: true },
    { ...dst('cap'), at: drop('pipe') },
  ];

  return (
    <Stage>
      {/* EDR log */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: LOG_W, height: LOG_H, ...enter(frame, 0, { distance: 14, duration: 14 }) }}>
        <Panel
          title="EDR · ENG-WS-041 · 2026-03-05"
          icon="terminal"
          accent="cyan"
          glow={progress(frame, rawAt, 10) * (1 - progress(frame, rawAt + 20, 30))}
          style={{ height: '100%' }}
          bodyStyle={{ padding: `${PAD_Y}px ${PAD_X}px` }}
        >
          {frame < rawAt ? (
            <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, color: C.muted, fontStyle: 'italic', paddingTop: 8 }}>
              Cargando telemetría de esa madrugada…
            </div>
          ) : (
            EDR_LOG.map((line, i) => {
              const lineAt = rawAt + i * 5;
              if (frame < lineAt) return null;
              return <LogRow key={i} frame={frame} lineAt={lineAt} line={line} at={at} />;
            })
          )}
        </Panel>
      </div>

      {/* Diamond on the right */}
      <Diamond
        {...GEO}
        cardW={CARD_W}
        style={{ opacity: fadeIn(frame, 0, 14) }}
        vertices={{
          adv: { dim: 0.55 },
          infra: { dim: 0.55 },
          vic: {
            items: ['ENG-WS-041', 'Meridian Dynamics'],
            itemsShow: vicItems / 2,
            glow: Math.max(land('host'), land('org')),
          },
          cap: {
            items: ['GLASS VIPER', 'SHA-256 9f3a...e1', 'vc_pipe_%08x'],
            itemsShow: capItems / 3,
            glow: Math.max(land('hash'), land('pipe')),
          },
        }}
      />

      {/* Flying chips (ride with the cursor) */}
      {drags.map(({ d }) => {
        const k = d.key;
        const t0 = at[k];
        if (frame < t0 || frame > drop(k) + 6) return null;
        const t = progress(frame, t0 + DRAG - 24, 24, EASE.inOut);
        const a = src(k);
        const b = dst(d.to);
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const tint = VERTEX[d.to].tint;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${1 + 0.08 * progress(frame, t0, 6)})`,
              opacity: progress(frame, t0, 5) * fadeOut(frame, drop(k), 6),
              padding: '6px 16px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${tint}`,
              background: alpha(C.ink900, 0.95),
              boxShadow: `0 10px 30px ${alpha('#000000', 0.5)}, 0 0 20px ${alpha(tint, 0.35)}`,
              fontFamily: FONT.mono,
              fontSize: TYPE.small,
              fontWeight: 700,
              color: tint,
              whiteSpace: 'nowrap',
            }}
          >
            {d.chip}
          </div>
        );
      })}

      <Cursor frame={frame} path={cursorPath} appearAt={dragVic - 40} />

      {/* Note band under the log */}
      <NoteBand frame={frame} fps={fps} rawAt={rawAt} hashDrop={drop('hash')} pipeAt={at.pipe} recompAt={recompAt} patternAt={patternAt} />
    </Stage>
  );
}

function LogRow({
  frame,
  lineAt,
  line,
  at,
}: {
  frame: number;
  lineAt: number;
  line: (typeof EDR_LOG)[number];
  at: Record<LogDrag['key'], number>;
}) {
  const base = line.kind === 'comment' ? C.faint : line.kind === 'head' ? C.text : C.muted;
  const style = {
    fontFamily: FONT.mono,
    fontSize: LOG_SIZE,
    lineHeight: `${LINE_H}px`,
    height: LINE_H,
    whiteSpace: 'pre' as const,
    color: base,
    opacity: fadeIn(frame, lineAt, 8),
  };
  const hostHead = line.kind === 'head' && !line.drag;
  if (!line.drag) {
    // Other ENG-WS-041 mentions echo the host highlight once it is picked up.
    if (hostHead && frame >= at.host) {
      const [pre, post] = line.text.split('ENG-WS-041');
      return (
        <div style={style}>
          {pre}
          <span style={{ color: alpha(C.cyanSoft, 0.85) }}>ENG-WS-041</span>
          {post}
        </div>
      );
    }
    return <div style={style}>{line.text}</div>;
  }
  const d = line.drag;
  const col = line.text.indexOf(d.token);
  const tint = VERTEX[d.to].tint;
  const hot = progress(frame, at[d.key] - 18, 10);
  const taken = frame >= at[d.key];
  return (
    <div style={style}>
      {line.text.slice(0, col)}
      <span
        style={{
          color: hot > 0 ? tint : base,
          fontWeight: hot > 0 ? 700 : 450,
          background: alpha(tint, (taken ? 0.12 : 0.24) * hot),
          boxShadow: hot > 0 ? `0 0 0 2px ${alpha(tint, (taken ? 0.35 : 0.8) * hot)}` : undefined,
          borderRadius: 4,
        }}
      >
        {d.token}
      </span>
      {line.text.slice(col + d.token.length)}
    </div>
  );
}

function NoteBand({
  frame,
  fps,
  rawAt,
  hashDrop,
  pipeAt,
  recompAt,
  patternAt,
}: {
  frame: number;
  fps: number;
  rawAt: number;
  hashDrop: number;
  pipeAt: number;
  recompAt: number;
  patternAt: number;
}) {
  const hintOp = fadeIn(frame, rawAt + 40, 14) * fadeOut(frame, hashDrop - 4, 10);
  const viperOp = fadeIn(frame, hashDrop, 12) * fadeOut(frame, pipeAt - 4, 10);
  return (
    <div style={{ position: 'absolute', left: 0, top: BAND_TOP, width: LOG_W, height: 660 - BAND_TOP }}>
      {hintOp > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 650,
            color: C.muted,
            opacity: hintOp,
          }}
        >
          <Icon name="cursor" size={34} color={C.muted} />
          ¿A qué vértice pertenece cada dato?
        </div>
      ) : null}

      {viperOp > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 24px',
            borderRadius: RADIUS.md,
            border: `2px solid ${alpha(C.amber, 0.7)}`,
            background: alpha(C.amber, 0.08),
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 700,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: viperOp,
            transform: `translateY(${(1 - progress(frame, hashDrop, 14)) * 14}px)`,
          }}
        >
          <Icon name="bolt" size={34} color={C.amber} />
          <span>
            implante <span style={{ color: C.amber, fontWeight: 850 }}>GLASS VIPER</span> · loader de stage 1
          </span>
        </div>
      ) : null}

      {frame >= recompAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 6, display: 'grid', gap: 12 }}>
          <NoteRow frame={frame} at={recompAt} color={C.rose} icon="x" label="hash" text="cambia al recompilar" />
          <NoteRow
            frame={frame}
            at={patternAt}
            color={C.emerald}
            icon="check"
            label="patrón del pipe"
            text="suele seguir"
            glow={progress(frame, patternAt, 10) * (0.5 + 0.5 * pulse(frame, fps, 0.5))}
          />
        </div>
      ) : null}
    </div>
  );
}

function NoteRow({
  frame,
  at,
  color,
  icon,
  label,
  text,
  glow = 0,
}: {
  frame: number;
  at: number;
  color: string;
  icon: 'x' | 'check';
  label: string;
  text: string;
  glow?: number;
}) {
  if (frame < at - 2) return <div style={{ height: 62 }} />;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 62,
        boxSizing: 'border-box',
        padding: '0 22px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(color, 0.6)}`,
        background: alpha(color, 0.08),
        boxShadow: glow > 0 ? `0 0 ${Math.round(24 * glow)}px ${alpha(color, 0.35 * glow)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: TYPE.label,
        whiteSpace: 'nowrap',
        ...enter(frame, at, { distance: 14, axis: 'x' }),
      }}
    >
      <Icon name={icon} size={32} color={color} strokeWidth={3} />
      <span style={{ fontWeight: 800, color }}>{label}:</span>
      <span style={{ fontWeight: 650, color: C.textStrong }}>{text}</span>
    </div>
  );
}
