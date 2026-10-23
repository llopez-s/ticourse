import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, focusWeights, mix } from '../../../engine/src/ui';
import { CLASSIFY, INTEL_EXAMPLE, SCALE_HEAD, STOPS } from '../data/niveles';
import { SlidingHouse, type PieceId } from './parts/House';
import { ScaleBar } from './parts/ScaleBar';
import { Stage } from './kit';

const W = STAGE.width;
const HOUSE_POS = { x: 4, y: 114 } as const;
const COL_X = 650;
const COL_W = W - COL_X;
const BAR_Y = 206;
const DETAIL_Y = 478;
const CARD_W = 1000;
const CARD_H = 188;

/**
 * s04-escala «Una casa en cinco piezas». On `scale` the bar is there, empty (five dashed stops), under
 * its header «Sliding Scale of Cyber Security / ordena las inversiones de seguridad», and the ground
 * of the house. A piece goes up with each stop, on its cue: `arch` foundation and walls («sistemas
 * defendibles · segmentación · hardening · parcheo»), `passive` the armoured door, `active` the
 * watchman on his round, `intel` the roof («informes de actor» as the example), `offense` outside the
 * house, dark and padlocked. The arrow of the bar says where the return is. On `classify`, with the
 * house still, the stops switch off and the card «EDR que bloquea malware conocido sin que nadie
 * intervenga» waits apart from the bar, with nothing that hints the answer (the header leaves too:
 * the engine's think card owns the top). On `answer` the card settles under Passive Defense, that
 * stop and the door light in emerald, «firewalls, EDR/AV, filtrado» beside it and the label «¿hay una
 * persona al mando?»; the other stops come back on.
 */
export function S04Escala(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleAt = props.cue('scale');
  const stopAt = [props.cue('arch'), props.cue('passive'), props.cue('active'), props.cue('intel'), props.cue('offense')];
  const classifyAt = props.cue('classify');
  const answerAt = props.cue('answer');

  // ---- Which stop the voice is on (it keeps the last one until `classify`).
  const { weights } = focusWeights(frame, stopAt, { end: classifyAt });
  const focus = weights.map((w) => w * (1 - progress(frame, classifyAt - 2, 12)));
  const off = progress(frame, classifyAt - 2, 14) * (1 - progress(frame, answerAt + 70, 24, EASE.inOut));
  const answer = progress(frame, answerAt, 16);
  const headerOut = progress(frame, classifyAt - 4, 12);
  const headerIn = enter(frame, Math.min(scaleAt - 12, 6), { distance: 16, duration: 16 });
  const arrow = progress(frame, scaleAt + 30, 16) * (1 - progress(frame, classifyAt - 4, 12));

  const glow: Partial<Record<PieceId, number>> = {
    arch: focus[0],
    passive: focus[1],
    active: focus[2],
    intel: focus[3],
    offense: focus[4],
  };

  // ---- Detail panel: one stop at a time.
  const detailW = STOPS.map((_, i) => progress(frame, stopAt[i] - 2, 12) * (1 - progress(frame, (stopAt[i + 1] ?? classifyAt) - 2, 12)));

  // ---- The card.
  const cardIn = frame < classifyAt - 6 ? 0 : springIn(frame, fps, classifyAt - 4, { damping: 16 });
  const land = progress(frame, answerAt, 26, EASE.inOut);
  const cardScale = mix(1, 0.66, land);
  const cardX = mix((COL_W - CARD_W) / 2, 0, land);
  const cardY = mix(432, 372, land);
  const tagIn = progress(frame, answerAt + 14, 14);
  const askIn = progress(frame, answerAt + 28, 14);

  return (
    <Stage>
      {/* The house */}
      <div style={{ position: 'absolute', left: HOUSE_POS.x, top: HOUSE_POS.y }}>
        <SlidingHouse
          frame={frame}
          at={{ arch: stopAt[0] - 4, passive: stopAt[1] - 4, active: stopAt[2] - 4, intel: stopAt[3] - 4, offense: stopAt[4] - 4 }}
          glow={glow}
          answer={answer}
          dim={0.3 * off}
          freezeAt={classifyAt}
        />
      </div>

      {/* Header */}
      {headerOut < 1 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 0, width: COL_W, opacity: headerIn.opacity * (1 - headerOut), transform: headerIn.transform, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 56, fontWeight: 850, letterSpacing: -1, color: C.textStrong, lineHeight: 1.08 }}>{SCALE_HEAD.main}</div>
          <div style={{ marginTop: 6, fontSize: 38, fontWeight: 700, color: '#bae6fd' }}>{SCALE_HEAD.sub}</div>
        </div>
      ) : null}

      {/* The bar */}
      <div style={{ position: 'absolute', left: COL_X, top: BAR_Y }}>
        <ScaleBar width={COL_W} frame={frame} at={stopAt.map((a) => a - 4)} focus={focus} off={off} answer={answer} arrow={arrow} />
      </div>

      {/* Details of the stop the voice is on */}
      {STOPS.map((stop, i) =>
        detailW[i] > 0.01 ? (
          <div key={stop.id} style={{ position: 'absolute', left: COL_X, top: DETAIL_Y, width: COL_W, opacity: detailW[i], transform: `translateY(${(1 - detailW[i]) * 14}px)`, fontFamily: FONT.sans }}>
            <Detail index={i} frame={frame} at={stopAt[i]} />
          </div>
        ) : null,
      )}

      {/* The card of the question, then of the answer */}
      {cardIn > 0.001 ? (
        <div style={{ position: 'absolute', left: COL_X + cardX, top: cardY, opacity: Math.min(1, cardIn * 1.4), transform: `scale(${cardScale * (0.94 + 0.06 * Math.min(1, cardIn))})`, transformOrigin: '0 0' }}>
          <ClassifyCard land={land} />
        </div>
      ) : null}
      {tagIn > 0.01 ? (
        <div style={{ position: 'absolute', left: COL_X + 692, top: 372, width: 380, opacity: tagIn, transform: `translateX(${(1 - tagIn) * 24}px)`, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', boxSizing: 'border-box', height: 124, padding: '0 24px', borderRadius: 22, border: `3px solid ${alpha(C.emerald, 0.85)}`, background: alpha(C.emerald, 0.12), fontSize: 36, fontWeight: 800, lineHeight: 1.15, color: '#a7f3d0' }}>
            <span>{CLASSIFY.answerTag}</span>
          </div>
        </div>
      ) : null}
      {askIn > 0.01 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 540, width: COL_W, opacity: askIn, transform: `translateY(${(1 - askIn) * 14}px)`, fontFamily: FONT.sans }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, fontSize: 52, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <Icon name="user" size={54} color={C.amber} strokeWidth={2.2} />
            {CLASSIFY.answerQuestion}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** The detail of one stop: its name and, as chips, the lesson's own words. */
function Detail({ index, frame, at }: { index: number; frame: number; at: number }) {
  const stop = STOPS[index];
  const locked = stop.id === 'offense';
  const tone = stop.tone;
  const chipAt = (k: number) => progress(frame, at + 6 + k * 5, 12);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 44, fontWeight: 850, color: locked ? C.text : tone === C.sky ? '#bae6fd' : tone, letterSpacing: -0.5 }}>
        <span style={{ display: 'inline-grid', placeItems: 'center', width: 46, height: 46, borderRadius: 23, background: alpha(tone, 0.2), border: `3px solid ${alpha(tone, 0.8)}`, fontSize: 28 }}>{locked ? <Icon name="lock" size={24} color={C.text} strokeWidth={2.4} /> : index + 1}</span>
        {stop.name}
      </div>
      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 12, maxWidth: COL_W - 20 }}>
        {stop.detail.map((d, k) => (
          <span
            key={d}
            style={{
              opacity: chipAt(k),
              transform: `translateY(${(1 - chipAt(k)) * 10}px)`,
              padding: '8px 22px 10px',
              borderRadius: stop.detail.length === 1 ? 22 : RADIUS.pill,
              border: `2px solid ${alpha(tone, locked ? 0.55 : 0.6)}`,
              background: alpha(tone, 0.1),
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.text,
              maxWidth: COL_W - 30,
            }}
          >
            {d}
          </span>
        ))}
        {stop.id === 'intel' ? (
          <span
            style={{
              opacity: chipAt(2),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 22px 10px 16px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.cyan, 0.85)}`,
              background: alpha(C.cyan, 0.16),
              fontSize: 34,
              fontWeight: 800,
              color: C.cyanSoft,
            }}
          >
            <Icon name="file" size={32} color={C.cyan} strokeWidth={2.2} />
            {INTEL_EXAMPLE}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** The activity to classify. Neutral (sky) until it settles on its stop. */
function ClassifyCard({ land }: { land: number }) {
  const tone = land > 0.5 ? C.emerald : C.sky;
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '0 36px 0 28px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.85)}`,
        background: `linear-gradient(100deg, ${alpha(tone, 0.14)} 0%, ${C.ink900} 70%)`,
        boxShadow: `0 24px 56px ${alpha('#000000', 0.45)}, 0 0 ${Math.round(30 * land)}px ${alpha(tone, 0.3 * land)}`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ flexShrink: 0, width: 104, height: 104, borderRadius: 52, display: 'grid', placeItems: 'center', background: alpha(tone, 0.14), border: `2px solid ${alpha(tone, 0.55)}` }}>
        <Icon name="desktop" size={60} color={tone} strokeWidth={2} />
      </div>
      <div style={{ fontSize: 44, fontWeight: 850, lineHeight: 1.16, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {CLASSIFY.cardLines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
}

