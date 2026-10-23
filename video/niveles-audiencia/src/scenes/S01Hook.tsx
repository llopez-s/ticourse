import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { ENVELOPES, PROMISE, S01_TITLE, type EnvelopeId } from '../data/niveles';
import { ContextStrip, Desk } from './parts/Desk';
import { ENV, Envelope } from './parts/Envelope';
import { EnvelopeAsk } from './parts/EnvelopeCards';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// Big: two envelopes side by side on the desk. Small: left cluster, the title column on the right.
const BIG = { w: 540, gap: 100, y: 96 } as const;
const SMALL = { w: 356, gap: 40, x: 20, y: 150 } as const;
const BIG_X = (W - (2 * BIG.w + BIG.gap)) / 2;
const COL_X = 860;

function slot(id: EnvelopeId, shrink: number) {
  const i = id === 'board' ? 0 : 1;
  return {
    w: mix(BIG.w, SMALL.w, shrink),
    x: mix(BIG_X + i * (BIG.w + BIG.gap), SMALL.x + i * (SMALL.w + SMALL.gap), shrink),
    y: mix(BIG.y, SMALL.y, shrink),
  };
}

/**
 * s01-hook «Dos sobres sobre tu mesa». The analyst's desk seen from above, with the strip «Meridian
 * Dynamics · aeroespacial · tú, su analista de inteligencia» (no date, no alert: the same day, not a
 * moment) and two dashed slots waiting. On `board` the sealed envelope «consejo» lands (mail sfx) and
 * opens halfway: one question, «¿hacia dónde va el sector?», and «¿dónde invertimos?» small under it.
 * On `soc` the second one, same shape and size, lands (ping2) with «¿qué bloqueamos hoy?». They are
 * questions, not decisions. On `title` both step to the left and the title («Niveles de CTI y la
 * Sliding Scale», «el producto correcto para la persona correcta») takes the right; on `promise` three
 * chips, each on its words: los tres niveles · la escala de la seguridad · por qué no empezar por el
 * tejado.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const boardAt = props.cue('board');
  const socAt = props.cue('soc');
  const titleAt = props.cue('title');
  const promiseAt = props.cue('promise');

  const deskIn = progress(frame, 0, 14);
  const shrink = progress(frame, titleAt - 26, 26, EASE.inOut);

  const at: Record<EnvelopeId, number> = { board: boardAt, soc: socAt };
  const stripLit = progress(frame, boardAt - 10, 14) * (1 - 0.6 * progress(frame, boardAt + 40, 30, EASE.inOut));

  const chipAt = PROMISE.map((p) => Math.max(promiseAt - 4, wordFrame(S, 's01-02', p.word) - 8));

  return (
    <Stage>
      <Desk opacity={deskIn} />
      <ContextStrip opacity={deskIn} lit={stripLit} />

      {/* Waiting slots */}
      {(['board', 'soc'] as const).map((id) => {
        const p = slot(id, shrink);
        const arrived = progress(frame, at[id] - 8, 10);
        return arrived < 1 ? (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y + (ENV.bodyY * p.w) / ENV.w,
              width: p.w,
              height: (ENV.bodyH * p.w) / ENV.w,
              boxSizing: 'border-box',
              borderRadius: 22,
              border: `2px dashed ${C.ink600}`,
              opacity: deskIn * (1 - arrived) * 0.9,
            }}
          />
        ) : null;
      })}

      {/* The two envelopes */}
      {(['board', 'soc'] as const).map((id) => {
        const e = ENVELOPES[id];
        const p = slot(id, shrink);
        const side = id === 'board' ? -1 : 1;
        const land = progress(frame, at[id] - 12, 22);
        if (land <= 0) return null;
        const open = progress(frame, at[id] + 28, 24, EASE.inOut);
        const smallIn = progress(frame, at[id] + 52, 16);
        const glow = progress(frame, at[id] + 20, 14) * (1 - progress(frame, at[id] + 90, 30, EASE.inOut)) * 0.7;
        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              opacity: Math.min(1, land * 1.6),
              transform: `translate(${side * 150 * (1 - land)}px, ${-90 * (1 - land)}px) rotate(${side * 7 * (1 - land)}deg)`,
              transformOrigin: '50% 50%',
            }}
          >
            <Envelope
              width={p.w}
              label={e.label}
              tone={e.tone}
              icon={id === 'board' ? 'users' : 'bell'}
              open={open}
              sealOpacity={1}
              glow={glow}
              card={<EnvelopeAsk id={id} smallIn={smallIn} />}
            />
          </div>
        );
      })}

      {/* Title column */}
      <TitleColumn frame={frame} titleAt={titleAt} chipAt={chipAt} promiseAt={promiseAt} />
    </Stage>
  );
}

function TitleColumn({ frame, titleAt, chipAt, promiseAt }: { frame: number; titleAt: number; chipAt: number[]; promiseAt: number }) {
  const titleIn = enter(frame, titleAt - 8, { distance: 22, duration: 18 });
  const subIn = enter(frame, titleAt + 8, { distance: 16, duration: 16 });
  if (titleIn.opacity <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: COL_X, top: 92, width: W - COL_X, fontFamily: FONT.sans }}>
      <div style={{ ...titleIn, fontSize: 68, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {S01_TITLE.main.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div style={{ ...subIn, marginTop: 18, fontSize: 42, fontWeight: 750, lineHeight: 1.16, color: '#c4b5fd', whiteSpace: 'nowrap' }}>
        {S01_TITLE.sub.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      {frame >= promiseAt - 8 ? (
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 16, axis: 'x' });
            const lit = progress(frame, chipAt[i], 10) * (1 - 0.45 * progress(frame, (chipAt[i + 1] ?? chipAt[i] + 400) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  height: 62,
                  padding: '0 26px 0 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * lit)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * lit),
                  boxShadow: lit > 0 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
                  fontSize: 34,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={34} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
