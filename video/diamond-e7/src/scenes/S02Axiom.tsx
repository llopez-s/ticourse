import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, fadeOut, progress, pulse } from '../../../engine/src/theme/motion';
import { Diamond, VERTEX, vertexPoint, type VertexId } from './parts/Diamond';
import { Stage, segment, wordFrame } from './kit';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import { TIMELINE } from '../timeline/load';

const SCENE = 's02-axiom';

/**
 * Low, flat diamond: during the GLASS VIPER intercept (before s02-04) the
 * stage's top-centre must stay clear, so the Adversary card sits below y 230.
 */
const GEO = { cx: 864, cy: 445, hw: 440, hh: 158 };
const CARD_W = 330;
/** Half height of a vertex card with label + question (no items). */
const CARD_HALF_H = 54;

/** Local frame at which the GLASS VIPER intercept card appears (it shows during the silent lead before s02-04). */
function interceptFrom(fallback: number): number {
  const hit = (TIMELINE.intercept ?? []).find((i) => i.scene === SCENE);
  if (!hit) return fallback;
  return hit.from - (sceneTiming(TIMELINE, SCENE).from - enterFramesFor(TIMELINE, SCENE));
}

/**
 * Frame the narrator says a word. Throws when the word is missing, like kit.tsx's wordFrame, so a
 * re-voiced script that drops it fails loudly; `_fallback` documents the old estimate-mode offset.
 */
function safeWord(segmentId: string, word: string, nth: number, _fallback: number): number {
  return wordFrame(SCENE, segmentId, word, nth);
}

/** The three clauses of the axiom's second half, each tinted with its vertex colour. */
const CLAUSES: { pre: string; term: string; v: VertexId; word: string }[] = [
  { pre: 'usando una ', term: 'capability', v: 'cap', word: 'capacidad' },
  { pre: 'sobre una ', term: 'infraestructura', v: 'infra', word: 'infraestructura' },
  { pre: 'contra una ', term: 'víctima', v: 'vic', word: 'víctima' },
];

/**
 * S02 «El axioma»: the axiom is read, then the diamond is drawn vertex by
 * vertex (Adversary, Capability, Infrastructure, Victim) and its edges. In
 * s02-04 one lit vertex sends pulses along the edges to the others: know one,
 * look for the rest. The top-centre stays free for the intercept.
 */
export function S02Axiom(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const axiomAt = props.cue('axiom');
  const s02 = segment(props, 's02-02').from;
  const s04 = segment(props, 's02-04').from;
  const vAt: Record<VertexId, number> = {
    adv: props.cue('v-adv'),
    cap: props.cue('v-cap'),
    infra: props.cue('v-infra'),
    vic: props.cue('v-vic'),
  };
  const clauseAt = CLAUSES.map((c, i) => Math.max(s02 + i * 12, safeWord('s02-02', c.word, 0, s02 + 20 + i * 30) - 6));

  // The big axiom hands over to a compact two-line version above the diamond,
  // which leaves before the intercept card lands top-centre.
  const bigOut = progress(frame, vAt.adv - 24, 18, EASE.inOut);
  const compactIn = progress(frame, vAt.adv - 12, 16);
  const clearTop = Math.min(interceptFrom(s04 - 110), vAt.vic + 40);
  const compactOut = fadeOut(frame, clearTop - 16, 14);

  const edgesStart = vAt.vic + 10;
  const edges = [0, 1, 2, 3].map((i) => progress(frame, edgesStart + i * 7, 18));

  // s02-04: «una esquina vacía» dims the Adversary; «conoces uno» lights Victim and sends pulses.
  const emptyAt = safeWord('s02-04', 'esquina', 0, s04 + 60);
  const edgesWord = safeWord('s02-04', 'aristas', 0, s04 + 170);
  const knowAt = safeWord('s02-04', 'conoces', 0, edgesWord + 40);
  const advEmpty = progress(frame, emptyAt, 16) * (1 - progress(frame, knowAt + 40, 20));
  const vicLit = progress(frame, edgesWord, 16);

  return (
    <Stage>
      {bigOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 70,
            width: 1728,
            textAlign: 'center',
            fontFamily: FONT.sans,
            opacity: 1 - bigOut,
            transform: `translateY(${-30 * bigOut}px) scale(${1 - 0.08 * bigOut})`,
          }}
        >
          {/* The kicker is there from the first frame so the stage is never empty. */}
          <div style={{ fontSize: TYPE.label, fontWeight: 750, letterSpacing: 4, color: C.muted, textTransform: 'uppercase', opacity: fadeIn(frame, props.enterFrames, 12) }}>
            El axioma
          </div>
          <div style={{ ...enter(frame, axiomAt - 4, { distance: 20 }) }}>
            <div style={{ fontSize: TYPE.h2, fontWeight: 800, color: C.textStrong, lineHeight: 1.2, marginTop: 18 }}>
              En cada intrusión, un <span style={{ color: C.rose }}>adversario</span>
              <br />
              da un paso hacia un objetivo
            </div>
          </div>
          <div style={{ marginTop: 34, display: 'grid', gap: 12 }}>
            {CLAUSES.map((c, i) => (
              <div key={c.term} style={{ fontSize: TYPE.h3, fontWeight: 700, color: C.text, ...enter(frame, clauseAt[i], { distance: 16 }) }}>
                {c.pre}
                <span style={{ color: VERTEX[c.v].tint, fontWeight: 850 }}>{c.term}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {compactIn > 0 && compactOut > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            width: 1728,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 650,
            color: C.text,
            lineHeight: 1.4,
            opacity: compactIn * compactOut,
          }}
        >
          Un <span style={{ color: C.rose, fontWeight: 800 }}>adversario</span> da un paso hacia un objetivo
          <br />
          usando una <span style={{ color: C.amber, fontWeight: 800 }}>capability</span>, sobre una{' '}
          <span style={{ color: C.sky, fontWeight: 800 }}>infraestructura</span>, contra una{' '}
          <span style={{ color: C.cyan, fontWeight: 800 }}>víctima</span>
        </div>
      ) : null}

      {frame >= vAt.adv - 2 ? (
        <Diamond
          {...GEO}
          cardW={CARD_W}
          edges={edges}
          vertices={{
            adv: {
              show: progress(frame, vAt.adv - 2, 14),
              glow: flash(frame, vAt.adv),
              dim: advEmpty * 0.8,
            },
            cap: { show: progress(frame, vAt.cap - 2, 14), glow: flash(frame, vAt.cap) },
            infra: { show: progress(frame, vAt.infra - 2, 14), glow: flash(frame, vAt.infra) },
            vic: {
              show: progress(frame, vAt.vic - 2, 14),
              glow: Math.max(flash(frame, vAt.vic), vicLit * (0.7 + 0.3 * pulse(frame, fps, 0.6))),
            },
          }}
        />
      ) : null}

      <EdgePulses frame={frame} start={edgesWord + 6} />

      {frame >= emptyAt ? (
        <div
          style={{
            position: 'absolute',
            left: GEO.cx + CARD_W / 2 + 24,
            top: GEO.cy - GEO.hh - 22,
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 700,
            color: C.roseSoft,
            fontStyle: 'italic',
            opacity: advEmpty,
          }}
        >
          esquina vacía… y aun así sirve
        </div>
      ) : null}

    </Stage>
  );
}

/** Quick 0→1→0 emphasis when a vertex is named. */
function flash(frame: number, at: number): number {
  return progress(frame, at, 8) * (1 - progress(frame, at + 12, 30));
}

/**
 * Pulses leave the lit Victim along both of its edges (to Capability and
 * Infrastructure), then continue up to the Adversary. Repeats every cycle.
 */
function EdgePulses({ frame, start }: { frame: number; start: number }) {
  if (frame < start) return null;
  const P = (v: VertexId) => vertexPoint(v, GEO);
  const LEG = 40; // frames per edge
  const CYCLE = LEG * 2 + 24;
  const legs: [VertexId, VertexId, number][] = [
    ['vic', 'cap', 0],
    ['vic', 'infra', 0],
    ['cap', 'adv', LEG],
    ['infra', 'adv', LEG],
  ];
  const local = (frame - start) % CYCLE;
  // The lit trail stays on the edge until the cycle ends, then fades before the next wave.
  const trailOp = 1 - Math.max(0, Math.min(1, (local - (CYCLE - 14)) / 14));
  return (
    <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {legs.map(([a, b, delay]) => {
        if (local < delay) return null;
        const t = Math.min(1, (local - delay) / LEG);
        const A = P(a);
        const B = P(b);
        // Only the visible stretch of the edge, between the two vertex cards.
        const ex = Math.min((CARD_W / 2 + 6) / Math.abs(B.x - A.x), (CARD_HALF_H + 6) / Math.abs(B.y - A.y));
        const t0 = ex;
        const t1 = 1 - ex;
        const e = t0 + (t1 - t0) * EASE.inOut(t);
        const x = A.x + (B.x - A.x) * e;
        const y = A.y + (B.y - A.y) * e;
        const sx = A.x + (B.x - A.x) * t0;
        const sy = A.y + (B.y - A.y) * t0;
        const color = VERTEX[b].tint;
        return (
          <g key={`${a}-${b}`} opacity={trailOp}>
            <line x1={sx} y1={sy} x2={x} y2={y} stroke={alpha(color, 0.75)} strokeWidth={7} strokeLinecap="round" />
            {t < 1 ? (
              <>
                <circle cx={x} cy={y} r={22} fill={alpha(color, 0.22)} />
                <circle cx={x} cy={y} r={11} fill={color} />
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
