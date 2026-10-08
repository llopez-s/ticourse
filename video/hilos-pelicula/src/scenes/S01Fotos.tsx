import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeOut, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, clamp01, mix } from '../../../engine/src/ui';
import { BRIDGE, ORBITAL_PILE, PROMISE, QUESTIONS, TITLE } from '../data/s01-fotos';
import { E7_CARD, E9_CARD, EventCard, type VertexId } from './parts/EventCard';
import { FilmLabel, VICTIMS } from './parts/FilmRail';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-fotos';
const W = STAGE.width;

// ---- Final layout (after the title). Before it, the photos sit higher (no empty top band).
const GROUP_Y = 188; // Meridian's label
const CARDS_Y = GROUP_Y + 52;
const E7_X = 0;
const E9_X = 506;
const PILE = { x: 1150, y: 202, w: 540, h: 282 };
const PRE_LIFT = 50;
const BAND_Y = 538; // promise chips, then the bridge strip

/**
 * s01-fotos «Dos fotos y una pregunta». Meridian's two loose photos — V3's E7 and E9 cards, field by field — fade up
 * from the first frame and settle on `photos`; on `orbital` a third pile lands on the right (Orbital's raw events
 * of 2026-03-09). Before 10 s (`title`) the photos step down and the title lands on top, with the two questions on
 * their words (s01-02). The promise, three chips on their verbs (`promise`); on `bridge` they give way to V3's
 * phrase in a small strip of film, and on «Quién, con qué, por dónde y contra quién» each word lights its vertex
 * on both cards' mini diamonds. Last frame: title, questions, photos, pile, bridge.
 */
export function S01Fotos(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const photosAt = props.cue('photos');
  const orbitalAt = props.cue('orbital');
  const titleCue = props.cue('title');
  const promiseAt = props.cue('promise');
  const bridgeAt = props.cue('bridge');
  const s04 = segment(props, 's01-04');

  // ---- The title before 10 s, whatever the voice does.
  const titleAt = Math.min(titleCue - 6, 10 * 30 - 22);
  const settle = progress(frame, titleAt - 12, 26, EASE.inOut);
  const lift = PRE_LIFT * (1 - settle);

  // ---- Photos: faint from frame 0 (the video's first frame is never empty), sharp on `photos`.
  const photosIn = mix(0.38, 1, progress(frame, Math.max(0, photosAt - 18), 30, EASE.inOut));
  const drift = (1 - progress(frame, 0, photosAt + 30, EASE.out)) * 16;
  const e9Pop = springIn(frame, fps, photosAt + 4, { damping: 17 });

  // ---- Orbital's pile on `orbital`.
  const pileIn = springIn(frame, fps, orbitalAt - 4, { damping: 16 });
  const pileFan = progress(frame, orbitalAt + 4, 22, EASE.out);

  // ---- Questions on their words (never before the title).
  const qAt = QUESTIONS.map((q, i) => Math.max(titleAt + 10 + i * 8, wordFrame(S, 's01-02', q.word) - 6));

  // ---- Promise chips on their verbs; they leave for the bridge strip.
  const chipAt = PROMISE.map((p, i) => Math.max(promiseAt + i * 8, wordFrame(S, 's01-03', p.word) - 6));
  const chipsOut = fadeOut(frame, bridgeAt - 10, 14);

  // ---- Bridge: the strip on `bridge`; the photos glow on «evento … foto»; the four words light their vertices.
  const stripIn = progress(frame, bridgeAt + 2, 20, EASE.out);
  const photoGlowAt = Math.max(bridgeAt + 10, wordFrame(S, 's01-04', 'evento') - 4);
  const photoGlow = progress(frame, photoGlowAt, 16) * (1 - 0.6 * progress(frame, wordFrame(S, 's01-04', 'ataque') + 6, 20));
  const subAt = BRIDGE.sub.map((w, i) => Math.max(photoGlowAt + 10 + i * 6, wordFrame(S, 's01-04', w.word) - 3));
  const hot: Partial<Record<VertexId, number>> = {};
  BRIDGE.sub.forEach((w, i) => {
    const on = progress(frame, subAt[i], 10);
    const next = i < subAt.length - 1 ? subAt[i + 1] : s04.to;
    hot[w.vertex] = on * (0.45 + 0.55 * (1 - progress(frame, next, 14)));
  });

  const title = enter(frame, titleAt, { distance: 26, duration: 20 });
  const titleSub = enter(frame, titleAt + 8, { distance: 18, duration: 18 });

  return (
    <Stage>
      {/* ---- Title (top left) */}
      <div style={{ position: 'absolute', left: 0, top: 0, fontFamily: FONT.sans }}>
        <div style={{ fontSize: TYPE.h1, fontWeight: 850, color: C.textStrong, letterSpacing: -1.5, lineHeight: 1.05, whiteSpace: 'nowrap', ...title }}>
          {TITLE.main}
        </div>
        <div style={{ marginTop: 10, fontSize: 42, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', ...titleSub }}>{TITLE.sub}</div>
      </div>

      {/* ---- The two questions (top right) */}
      <div style={{ position: 'absolute', right: 0, top: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
        {QUESTIONS.map((q, i) => (
          <Question key={q.text} text={q.text} style={enter(frame, qAt[i], { distance: 22, axis: 'x', duration: 16 })} />
        ))}
      </div>

      {/* ---- Meridian's two loose photos */}
      <div style={{ position: 'absolute', left: 0, top: GROUP_Y - lift, opacity: photosIn }}>
        <FilmLabel name={VICTIMS.meridian.name} tone={VICTIMS.meridian.tone} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: E7_X,
          top: CARDS_Y - lift + drift,
          opacity: photosIn,
          transform: 'rotate(-2.2deg)',
          transformOrigin: '50% 50%',
        }}
      >
        <EventCard data={E7_CARD} hot={hot} glow={photoGlow} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: E9_X + (1 - Math.min(1, e9Pop)) * 60,
          top: CARDS_Y + 26 - lift + drift * 0.6,
          opacity: photosIn * Math.min(1, 0.4 + e9Pop),
          transform: 'rotate(1.8deg)',
          transformOrigin: '50% 50%',
        }}
      >
        <EventCard data={E9_CARD} hot={hot} glow={photoGlow} />
      </div>

      {/* ---- Orbital's pile */}
      <OrbitalPile show={pileIn} fan={pileFan} y={PILE.y - lift} />

      {/* ---- Promise chips, then the bridge strip, in the bottom band */}
      {chipsOut > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: BAND_Y + 14, width: W, display: 'flex', justifyContent: 'center', gap: 22, opacity: chipsOut }}>
          {PROMISE.map((p, i) => (
            <div key={p.text} style={enter(frame, chipAt[i], { distance: 18, duration: 16 })}>
              <Chip accent="cyan" size={TYPE.label}>
                {p.text}
              </Chip>
            </div>
          ))}
        </div>
      ) : null}
      {stripIn > 0.001 ? <BridgeStrip show={stripIn} subShow={subAt.map((at) => progress(frame, at, 12))} /> : null}
    </Stage>
  );
}

/** One of the two questions: a plain outlined pill (the analyst's question, neither victim nor attacker). */
function Question({ text, style }: { text: string; style: { opacity: number; transform: string } }) {
  return (
    <div
      style={{
        padding: '10px 24px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.text, 0.45)}`,
        background: alpha(C.ink800, 0.85),
        fontFamily: FONT.sans,
        fontSize: 36,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
}

/** Orbital's raw events as a third pile of sheets: unsorted, nothing on a rail yet. */
function OrbitalPile({ show, fan, y }: { show: number; fan: number; y: number }) {
  const s = Math.min(1, show);
  if (s <= 0.001) return null;
  const tone = VICTIMS.orbital.tone;
  const sheets = [
    { dx: 26, dy: 22, rot: 4.5 },
    { dx: 13, dy: 11, rot: -2.5 },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: PILE.x + (1 - s) * 140,
        top: y,
        width: PILE.w,
        height: PILE.h,
        opacity: Math.min(1, show * 1.4),
      }}
    >
      {sheets.map((sh, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: RADIUS.lg,
            border: `2px solid ${C.ink600}`,
            background: i === 0 ? C.ink900 : C.ink850,
            transform: `translate(${sh.dx * fan}px, ${sh.dy * fan}px) rotate(${sh.rot * fan}deg)`,
            boxShadow: `0 16px 40px ${alpha('#000000', 0.35)}`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          padding: '24px 28px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(tone, 0.55)}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`,
          transform: `rotate(${-1.2 * fan}deg)`,
          fontFamily: FONT.sans,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.text }}>{ORBITAL_PILE.date}</span>
        <span style={{ fontSize: TYPE.h3, fontWeight: 850, color: tone, letterSpacing: -0.5, lineHeight: 1.05, whiteSpace: 'nowrap' }}>
          {ORBITAL_PILE.name}
        </span>
        <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>{ORBITAL_PILE.relation}</span>
        <div style={{ marginTop: 6 }}>
          <Chip accent="cyan" size={TYPE.label} style={{ color: tone }}>
            {ORBITAL_PILE.tag}
          </Chip>
        </div>
      </div>
    </div>
  );
}

/** V3's phrase in a short strip of film (the image the next scene builds), with the four Diamond questions under it. */
function BridgeStrip({ show, subShow }: { show: number; subShow: number[] }) {
  const w = 1180;
  const h = 76;
  const holes = 34;
  const pitch = w / holes;
  const tints: Record<VertexId, string> = { adv: C.roseSoft, cap: C.amber, infra: C.sky, vic: C.cyanSoft };
  return (
    <div style={{ position: 'absolute', left: (W - w) / 2, top: BAND_Y, width: w, opacity: show, transform: `translateY(${(1 - show) * 16}px)` }}>
      <div style={{ position: 'relative', width: w, height: h }}>
        <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={0} width={w} height={h} rx={8} fill="#151a24" stroke={alpha(C.muted, 0.4)} strokeWidth={2} />
          {Array.from({ length: holes }, (_, i) => {
            const a = clamp01(show * 1.5 - (i / holes) * 0.5);
            return (
              <g key={i} opacity={a}>
                <rect x={pitch * (i + 0.5) - 6} y={5} width={12} height={8} rx={2} fill={C.ink950} />
                <rect x={pitch * (i + 0.5) - 6} y={h - 13} width={12} height={8} rx={2} fill={C.ink950} />
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 18,
            width: w,
            height: h - 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.sans,
            fontSize: 36,
            fontWeight: 750,
            color: C.textStrong,
            whiteSpace: 'nowrap',
          }}
        >
          {BRIDGE.line}
        </div>
      </div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 28, fontWeight: 650, color: C.muted }}>
        {BRIDGE.sub.map((s, i) => (
          <span key={s.text} style={{ display: 'inline-flex', gap: 14, opacity: subShow[i], whiteSpace: 'nowrap' }}>
            {i > 0 ? <span style={{ color: C.faint }}>·</span> : null}
            <span style={{ color: subShow[i] > 0.5 ? tints[s.vertex] : C.muted }}>{s.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

