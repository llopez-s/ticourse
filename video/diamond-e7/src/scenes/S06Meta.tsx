import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, typewriter } from '../../../engine/src/theme/motion';
import { Chip, Icon, Panel } from '../../../engine/src/ui';
import { E7_VALUES, WIDE_CARD } from '../data/s04-infra';
import { Stage, wordFrame } from './kit';
import { Diamond, type VertexId } from './parts/Diamond';

const SCENE = 's06-meta';

const CARD_W = 1060;
const CARD_TOP = 34;
const LABEL_W = 290;
const ROW_H = 66;
const BEAT_H = 64;
const BEAT_W = 580;

/** Diamond shrinks from full size to a sidekick on the right (scale around its centre 864,330). */
const SMALL = 0.55;
const SMALL_DX = 534;

type Field = { key: string; label: string; cue: string; value?: string };

const FIELDS: Field[] = [
  { key: 'ts', label: 'Timestamp', cue: 'ts', value: '2026-03-05 02:13 UTC' },
  { key: 'phase', label: 'KC phase', cue: 'phase', value: 'Command & Control' },
  { key: 'result', label: 'Result', cue: 'result', value: 'success' },
  { key: 'direction', label: 'Direction', cue: 'direction' },
  { key: 'method', label: 'Methodology', cue: 'method', value: 'beacon HTTPS · 60 s · jitter' },
  { key: 'resources', label: 'Resources', cue: 'resources', value: 'hosting, dominio, cert TLS' },
];

/** Beacon spikes: roughly every 60 s, but never exactly (jitter). x in px inside the heartbeat strip. */
const BEATS = [30, 124, 204, 312, 392, 498];
const CLOCK_STEP = 94;

/**
 * s06-meta «Meta-features» (demo): the diamond says who / with what / through
 * what / against whom; the rest of the context goes into meta-features. The E7
 * record fills field by field while the diamond shrinks to the side; the
 * direction is drawn on it as an arrow from Victim to Infrastructure.
 */
export function S06Meta(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = Object.fromEntries(FIELDS.map((f) => [f.cue, props.cue(f.cue)])) as Record<string, number>;

  // Opening: each vertex lights up as the narration names its question.
  const asks: [VertexId, number][] = [
    ['adv', wordFrame(SCENE, 's06-01', 'quién', 0)],
    ['cap', wordFrame(SCENE, 's06-01', 'qué', 0)],
    ['infra', wordFrame(SCENE, 's06-01', 'dónde', 0)],
    ['vic', wordFrame(SCENE, 's06-01', 'quién', 1)],
  ];
  const askGlow = (v: VertexId) => {
    const at = asks.find(([id]) => id === v)![1];
    return progress(frame, at - 2, 8) * (1 - progress(frame, at + 22, 14));
  };

  const metaAt = wordFrame(SCENE, 's06-01', 'meta-features');
  const shrink = progress(frame, metaAt - 16, 26, EASE.inOut);
  const scale = 1 - (1 - SMALL) * shrink;
  const cardIn = enter(frame, metaAt - 2, { distance: 40, axis: 'x' });

  // Which row the narration is on: the latest cue reached.
  const active = FIELDS.reduce((acc, f, i) => (frame >= cues[f.cue] ? i : acc), -1);

  const dirAt = cues.direction;
  const arrow = progress(frame, dirAt + 4, 18);
  const resourcesGlow = progress(frame, cues.resources, 12);

  return (
    <Stage>
      {/* The diamond, full size at first, then a sidekick on the right. */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${SMALL_DX * shrink}px) scale(${scale})`, transformOrigin: '864px 330px' }}>
        <Diamond
          cardW={WIDE_CARD}
          vertices={{
            adv: { unknown: true, glow: askGlow('adv') },
            cap: { items: [E7_VALUES.cap], glow: askGlow('cap') },
            infra: { items: [E7_VALUES.domain], glow: Math.max(askGlow('infra'), arrow * 0.6, resourcesGlow) },
            vic: { items: [E7_VALUES.vic], glow: Math.max(askGlow('vic'), arrow * 0.6 * (1 - resourcesGlow)) },
          }}
        />
        {arrow > 0 ? <DirectionArrow p={arrow} /> : null}
      </div>

      {frame >= metaAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CARD_TOP, width: CARD_W, ...cardIn }}>
          <Panel
            title="DIAMOND EVENT E7"
            icon="file"
            accent="cyan"
            right={
              <Chip accent="muted" size={TYPE.small}>
                meta-features
              </Chip>
            }
            bodyStyle={{ padding: '14px 26px 18px' }}
          >
            {FIELDS.map((f, i) => (
              <div key={f.key}>
                <Row label={f.label} active={i === active} filled={frame >= cues[f.cue]}>
                  {f.key === 'direction' ? (
                    <DirectionValue frame={frame} at={cues.direction} />
                  ) : f.key === 'result' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: C.emerald }}>
                      {typewriter(f.value!, frame, cues[f.cue], fps, 40)}
                      <span style={{ opacity: fadeIn(frame, cues[f.cue] + 6, 8), display: 'inline-flex' }}>
                        <Icon name="check" size={34} color={C.emerald} strokeWidth={2.6} />
                      </span>
                    </span>
                  ) : (
                    typewriter(f.value!, frame, cues[f.cue], fps, 45)
                  )}
                </Row>
                {f.key === 'method' ? <Heartbeat frame={frame} at={cues.method} /> : null}
              </div>
            ))}
          </Panel>
        </div>
      ) : null}
    </Stage>
  );
}

function Row({ label, active, filled, children }: { label: string; active: boolean; filled: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: ROW_H,
        paddingLeft: 18,
        borderRadius: 10,
        background: active ? alpha(C.cyan, 0.09) : 'transparent',
        fontFamily: FONT.mono,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 5, borderRadius: 3, background: active ? C.cyan : alpha(C.ink600, 0.6) }} />
      <div style={{ width: LABEL_W, flexShrink: 0, fontSize: TYPE.label - 2, fontWeight: 600, color: C.muted }}>{label}</div>
      <div style={{ fontSize: TYPE.label + 2, fontWeight: 700, color: filled ? C.textStrong : C.faint, whiteSpace: 'nowrap' }}>
        {filled ? children : '· · ·'}
      </div>
    </div>
  );
}

/** "victim [arrow] infrastructure": the arrow is drawn, never typed. */
function DirectionValue({ frame, at }: { frame: number; at: number }) {
  const draw = progress(frame, at + 4, 14);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
      <span style={{ color: C.cyan, opacity: fadeIn(frame, at, 8) }}>victim</span>
      <svg width={76} height={30} viewBox="0 0 76 30" style={{ overflow: 'visible' }}>
        <line x1={4} y1={15} x2={4 + 58 * draw} y2={15} stroke={C.text} strokeWidth={4} strokeLinecap="round" />
        {draw > 0.85 ? <path d="M 58 5 L 72 15 L 58 25" fill="none" stroke={C.text} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
      </svg>
      <span style={{ color: C.sky, opacity: fadeIn(frame, at + 14, 8) }}>infrastructure</span>
    </span>
  );
}

/** A beacon trace: spikes at slightly irregular spacing over faint regular clock ticks. */
function Heartbeat({ frame, at }: { frame: number; at: number }) {
  const draw = progress(frame, at + 12, 60, EASE.linear);
  const show = fadeIn(frame, at + 8, 10);
  const base = 40;
  let d = `M 0 ${base}`;
  for (const x of BEATS) {
    d += ` L ${x - 10} ${base} L ${x - 5} ${base - 8} L ${x} ${base + 8} L ${x + 6} ${base - 32} L ${x + 12} ${base + 12} L ${x + 18} ${base}`;
  }
  d += ` L ${BEAT_W} ${base}`;
  return (
    <div style={{ height: BEAT_H, paddingLeft: 18 + LABEL_W, opacity: show }}>
      <svg width={BEAT_W} height={BEAT_H} style={{ overflow: 'visible' }}>
        {Array.from({ length: Math.floor(BEAT_W / CLOCK_STEP) + 1 }, (_, i) => (
          <line key={i} x1={30 + i * CLOCK_STEP + 3} y1={base + 16} x2={30 + i * CLOCK_STEP + 3} y2={base + 22} stroke={alpha(C.muted, 0.45)} strokeWidth={2} />
        ))}
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke={C.roseSoft}
          strokeWidth={3.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
          style={{ filter: `drop-shadow(0 0 6px ${alpha(C.rose, 0.6)})` }}
        />
      </svg>
    </div>
  );
}

/** Victim → Infrastructure on the (scaled) diamond, in the diamond's own coordinates. */
function DirectionArrow({ p }: { p: number }) {
  const d = 'M 1040 596 Q 1230 612 1262 440';
  return (
    <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <defs>
        <marker id="s06-dir-head" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.sky} />
        </marker>
      </defs>
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={C.sky}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        markerEnd={p > 0.95 ? 'url(#s06-dir-head)' : undefined}
      />
    </svg>
  );
}
