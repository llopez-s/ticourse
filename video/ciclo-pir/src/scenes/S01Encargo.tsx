import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { useVideoConfig } from 'remotion';
import { WHERE } from '../data/canon';
import { S01_ASK, S01_PROMISE, S01_TITLE, S01_WORRY } from '../data/s01-encargo';
import { Ciso } from './parts/Ciso';
import { Stage, wordFrame } from './kit';

const S = 's01-encargo';
const W = STAGE.width;

// The CISO card is laid out once at this size and moved with a transform: centred and big while it speaks alone,
// then small on the left under the title.
const CARD = { w: 1000, size: 50 } as const;
const SOLO = { x: (W - CARD.w) / 2, y: 232, s: 1 } as const;
const SIDE = { x: 0, y: 330, s: 0.84 } as const;
const COL_X = 900;

/**
 * s01-encargo «Un encargo de una frase». Meridian's frame opens the scene (the labels «Meridian Dynamics ·
 * aeroespacial» / «tú, su analista de inteligencia») and the CISO's card waits in the middle with its cursor;
 * on `ask` the task is typed into it, «Propónme nuestros primeros PIRs», no name, no face. Before 10 s (`title`)
 * «Antes de recoger nada: la pregunta» lands across the top with «el ciclo de inteligencia y los PIRs» under it
 * and, as the voice says «Un PIR», the one-line definition; the card steps left and small. On `promise` three
 * rows light on the right, one per idea. On `worry` two small amber notes stick under the card («rumores de robo
 * de diseños en el sector», «consejo: inquieto») while the rest steps back. No date, team, domain or name.
 */
export function S01Encargo(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const askAt = props.cue('ask');
  const titleCue = props.cue('title');
  const promiseAt = props.cue('promise');
  const worryAt = props.cue('worry');

  // ---- The title lands before 10 s whatever the voice does.
  const titleAt = Math.min(titleCue - 6, 10 * 30 - 26);
  const side = progress(frame, titleAt - 8, 26, EASE.inOut);
  const card = { x: mix(SOLO.x, SIDE.x, side), y: mix(SOLO.y, SIDE.y, side), s: mix(SOLO.s, SIDE.s, side) };

  // ---- The task typed into the card.
  const typed = Math.max(0, Math.floor((frame - askAt) * 0.8));
  const text = S01_ASK.slice(0, Math.min(S01_ASK.length, typed));
  const cardIn = progress(frame, 6, 20);
  // A small bump when the task lands.
  const bump = 1 + 0.025 * springIn(frame, fps, askAt - 2, { damping: 6 }) * (1 - progress(frame, askAt + 8, 14));
  const caret = (frame < askAt || text.length < S01_ASK.length) && Math.floor(frame / 15) % 2 === 0;
  const cisoGlow = progress(frame, askAt + 20, 14) * (1 - progress(frame, titleAt + 6, 24, EASE.inOut));

  // ---- Frame labels: centred over the card first, then a quiet header of the left column.
  const labelIn = enter(frame, -4, { distance: 14, duration: 18 });
  const youIn = enter(frame, wordFrame(S, 's01-01', 'Meridian') - 4, { distance: 12, duration: 16 });

  // ---- Title block.
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const subIn = enter(frame, titleAt + 10, { distance: 12, duration: 16 });
  const defAt = wordFrame(S, 's01-02', 'PIR') - 8;
  const defIn = enter(frame, defAt, { distance: 12, duration: 16 });
  const defLit = progress(frame, defAt, 12);

  // ---- Promise: one row per idea; the unvoiced middle one lights between its neighbours.
  const firstAt = wordFrame(S, 's01-03', S01_PROMISE[0].word) - 6;
  const lastAt = wordFrame(S, 's01-03', S01_PROMISE[2].word) - 6;
  const rowAt = [firstAt, Math.round((firstAt + lastAt) / 2), lastAt];
  const promiseDim = progress(frame, worryAt - 4, 22, EASE.inOut);

  // ---- Worry notes.
  const noteAt = S01_WORRY.map((n) => wordFrame(S, 's01-04', n.word) - 6);
  const cisoDim = 0.3 * progress(frame, worryAt, 20, EASE.inOut);

  return (
    <Stage>
      {/* Meridian's frame */}
      <div
        style={{
          position: 'absolute',
          left: mix(0, SIDE.x, side),
          top: mix(10, 238, side),
          width: mix(W, 860, side),
          textAlign: mix(0, 1, side) < 0.5 ? 'center' : 'left',
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
          opacity: labelIn.opacity * (1 - 0.35 * side),
        }}
      >
        <div style={{ fontSize: mix(40, 36, side), fontWeight: 850, lineHeight: 1.12, color: C.textStrong, transform: labelIn.transform }}>
          {WHERE.org}
          <span style={{ color: C.faint }}> · </span>
          <span style={{ color: C.text, fontWeight: 700 }}>{WHERE.sector}</span>
        </div>
        <div style={{ marginTop: 4, fontSize: mix(34, 32, side), fontWeight: 750, lineHeight: 1.15, color: C.cyanSoft, opacity: youIn.opacity }}>{WHERE.you}</div>
      </div>

      {/* The CISO and his task */}
      <div style={{ position: 'absolute', left: card.x, top: card.y, transformOrigin: '0 0', opacity: cardIn }}>
        <div style={{ transformOrigin: '0 0', transform: `translateY(${(1 - cardIn) * 20}px) scale(${card.s * bump})` }}>
        <Ciso width={CARD.w} text={text} full={S01_ASK} size={CARD.size} caret={caret} glow={cisoGlow} dim={cisoDim} />
        </div>
      </div>

      {/* Title, subtitle and the definition */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, fontFamily: FONT.sans, textAlign: 'center' }}>
          <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: -1.6, lineHeight: 1, whiteSpace: 'nowrap', ...titleIn }}>
            <span style={{ color: C.cyan, textShadow: `0 0 34px ${alpha(C.cyan, 0.28)}` }}>{S01_TITLE.lead}</span>
            <span style={{ color: C.textStrong }}> {S01_TITLE.rest}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 92, width: W, fontSize: 40, fontWeight: 750, lineHeight: 1.1, color: C.cyanSoft, whiteSpace: 'nowrap', ...subIn }}>{S01_TITLE.sub}</div>
          <div style={{ position: 'absolute', left: 0, top: 154, width: W, display: 'flex', justifyContent: 'center', ...defIn }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 16,
                padding: '8px 30px 10px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.cyan, 0.35 + 0.4 * defLit)}`,
                background: alpha(C.cyan, 0.06 + 0.06 * defLit),
                fontSize: 34,
                fontWeight: 700,
                color: C.text,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 850, color: C.cyan, letterSpacing: 2 }}>{S01_TITLE.def[0]}</span>
              <span style={{ color: C.faint }}>·</span>
              {S01_TITLE.def[1]}
            </div>
          </div>
        </div>
      ) : null}

      {/* The promise: three empty slots on `promise`, each filled on its words */}
      {frame >= promiseAt - 4
        ? S01_PROMISE.map((_, i) => {
            const slot = progress(frame, promiseAt + i * 5, 14) * (1 - progress(frame, rowAt[i] - 2, 8));
            if (slot <= 0.01) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: COL_X, top: 250 + i * 118, display: 'flex', alignItems: 'center', gap: 26, opacity: slot, transform: `translateX(${(1 - slot) * 22}px)` }}>
                <div style={{ width: 92, height: 92, borderRadius: 46, boxSizing: 'border-box', border: `3px dashed ${C.ink600}` }} />
                <div style={{ width: 520, height: 14, borderRadius: 7, background: alpha(C.ink700, 0.8) }} />
              </div>
            );
          })
        : null}
      {frame >= rowAt[0] - 4
        ? S01_PROMISE.map((p, i) => {
            const e = enter(frame, rowAt[i], { distance: 22, axis: 'x' });
            const next = rowAt[i + 1] ?? worryAt;
            const lit = progress(frame, rowAt[i], 10) * (1 - 0.55 * progress(frame, next - 2, 12, EASE.inOut));
            const draw = Math.max(lit, 0.45 * progress(frame, rowAt[i], 10));
            return (
              <div
                key={p.text}
                style={{
                  position: 'absolute',
                  left: COL_X,
                  top: 250 + i * 118,
                  width: W - COL_X,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  ...e,
                  opacity: e.opacity * (0.55 + 0.45 * lit) * (1 - 0.5 * promiseDim),
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 92,
                    height: 92,
                    borderRadius: 46,
                    display: 'grid',
                    placeItems: 'center',
                    background: alpha(C.cyan, 0.06 + 0.1 * lit),
                    border: `3px solid ${alpha(C.cyan, 0.35 + 0.55 * lit)}`,
                    boxShadow: lit > 0.05 ? `0 0 ${Math.round(28 * lit)}px ${alpha(C.cyan, 0.35 * lit)}` : undefined,
                  }}
                >
                  <Icon name={p.icon} size={52} color={C.cyan} strokeWidth={2 + draw * 0.2} />
                </div>
                <div style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 750, lineHeight: 1.14, color: C.textStrong, width: W - COL_X - 120, textWrap: 'balance' }}>{p.text}</div>
              </div>
            );
          })
        : null}

      {/* Two small notes under the card */}
      {S01_WORRY.map((n, i) => {
        if (frame < noteAt[i] - 4) return null;
        const e = enter(frame, noteAt[i], { distance: 16, duration: 16 });
        return (
          <div key={n.text} style={{ position: 'absolute', left: 6 + i * 26, top: 548 + i * 52, ...e }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '6px 24px 8px 16px',
                borderRadius: RADIUS.sm,
                border: `2px solid ${alpha(C.amber, 0.7)}`,
                background: alpha(C.amberDeep, 0.7),
                boxShadow: `0 10px 24px ${alpha('#000000', 0.4)}`,
                transform: `rotate(${i === 0 ? -1.2 : 1}deg)`,
                fontFamily: FONT.sans,
                fontSize: 30,
                fontWeight: 750,
                color: '#fde68a',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="alert" size={30} color={C.amber} strokeWidth={2.2} />
              {n.text}
            </div>
          </div>
        );
      })}
    </Stage>
  );
}
