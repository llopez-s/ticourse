import { useCurrentFrame } from 'remotion';
import type { ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { dimStyle } from '../../../engine/src/ui';
import { FireTriangle, FIRE_H, FIRE_W } from './parts/Fire';
import { ThreatTriangle } from './parts/Triangle';
import type { Piece } from '../data/canon';
import { Stage, wordFrame } from './kit';

const S = 's05-triada';
const W = STAGE.width;

/** The three pieces, with the lesson's gloss (src/data/s1.ts, «threat») and the Spanish name the voice uses. */
const ROWS: { piece: Piece; name: string; es: string; gloss: string }[] = [
  { piece: 'intent', name: 'INTENT', es: 'intención', gloss: 'quiere algo de ti · dinero · propiedad intelectual · parar tu actividad' },
  { piece: 'capability', name: 'CAPABILITY', es: 'capacidad', gloss: 'herramientas · infraestructura · habilidad' },
  { piece: 'opportunity', name: 'OPPORTUNITY', es: 'oportunidad', gloss: 'un camino hasta tus sistemas o tus personas · y el momento' },
];
const PANEL = { x: 780, top: 186, w: W - 780 } as const;

/**
 * s05-triada «Tres piezas a la vez». Two labels open it: «en la calle: cualquier cosa mala», dimmed, and «en inteligencia:
 * tres cosas a la vez». On the left the threat triangle, AMENAZA in the middle and three empty slots; on `intent`,
 * `capability` and `opportunity` a piece lands in its slot and its row (English name, Spanish name, the lesson's short
 * gloss) lights on the right. On `fire` the rows give way to the fire triangle — calor, combustible, oxígeno drawn on the
 * words, then «Quita» takes the last side away and the flame goes out (no side is tied to a component); the threat
 * triangle glows whole on «las tres a la vez». On `names` the right side shows the formula, «threat = intent + capability +
 * opportunity», its three names lighting as the voice says them, and «las tres a la vez: una combinación, no una suma».
 */
export function S05Triada(props: SceneProps) {
  const frame = useCurrentFrame();
  const threat = props.cue('threat');
  const cue: Record<Piece, number> = { intent: props.cue('intent'), capability: props.cue('capability'), opportunity: props.cue('opportunity') };
  const fire = props.cue('fire');
  const names = props.cue('names');

  // ---- Header.
  const preciseAt = wordFrame(S, 's05-01', 'inteligencia', 0) - 8;
  const streetIn = enter(frame, threat, { distance: 14 });
  const intelIn = enter(frame, Math.max(preciseAt, threat + 20), { distance: 16 });

  // ---- The pieces land.
  const lit: Record<Piece, number> = {
    intent: progress(frame, cue.intent, 18, EASE.out),
    capability: progress(frame, cue.capability, 18, EASE.out),
    opportunity: progress(frame, cue.opportunity, 18, EASE.out),
  };
  const next = (p: Piece) => (p === 'intent' ? cue.capability : p === 'capability' ? cue.opportunity : fire);
  const wholeAt = wordFrame(S, 's05-05', 'tres', 0) - 8;
  const whole = progress(frame, wholeAt, 24, EASE.inOut);

  // ---- Panel phases.
  const rowsOut = progress(frame, fire - 6, 16, EASE.inOut);
  const fireOut = progress(frame, names - 8, 16, EASE.inOut);
  const fireIn = progress(frame, fire, 18);
  const calorAt = wordFrame(S, 's05-05', 'calor') - 6;
  const combAt = wordFrame(S, 's05-05', 'combustible') - 6;
  const oxyAt = wordFrame(S, 's05-05', 'oxígeno') - 6;
  const quitaAt = wordFrame(S, 's05-05', 'Quita') - 4;
  const sides = [progress(frame, calorAt, 14), progress(frame, combAt, 14), progress(frame, oxyAt, 14)] as const;
  const out = progress(frame, quitaAt + 4, 14);
  const flame = 1 - progress(frame, quitaAt + 12, 22);

  return (
    <Stage>
      {/* Header: two labels */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 38, fontWeight: 650, color: C.faint, ...streetIn, opacity: streetIn.opacity * 0.8 }}>en la calle: cualquier cosa mala</div>
        <div style={{ marginTop: 6, fontSize: 60, fontWeight: 850, letterSpacing: -1, color: C.textStrong, ...intelIn }}>
          en inteligencia: <span style={{ color: C.roseSoft }}>tres cosas a la vez</span>
        </div>
      </div>

      {/* The threat triangle */}
      <div style={{ position: 'absolute', left: 40, top: 190 }}>
        <ThreatTriangle lit={lit} whole={whole} />
      </div>

      {/* Rows: one per piece */}
      {rowsOut < 1 ? (
        <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.top, width: PANEL.w, opacity: 1 - rowsOut, fontFamily: FONT.sans }}>
          {ROWS.map((r, i) => {
            const at = cue[r.piece];
            const e = enter(frame, at - 4, { distance: 24, axis: 'x' });
            const focus = progress(frame, at, 12) * (1 - progress(frame, next(r.piece) - 4, 12));
            const tops = [0, 163, 288];
            return (
              <div
                key={r.piece}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: tops[i],
                  width: PANEL.w,
                  boxSizing: 'border-box',
                  padding: '12px 32px 12px',
                  borderRadius: RADIUS.lg,
                  border: `${focus > 0.3 ? 3 : 2}px solid ${alpha(C.rose, 0.3 + 0.55 * focus)}`,
                  background: `linear-gradient(90deg, ${alpha(C.rose, 0.04 + 0.1 * focus)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
                  boxShadow: focus > 0.02 ? `0 0 ${Math.round(34 * focus)}px ${alpha(C.rose, 0.25 * focus)}` : undefined,
                  ...e,
                  ...dimStyle(0.4 * (1 - focus) * progress(frame, at + 20, 12), e.opacity),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 46, lineHeight: '46px', fontWeight: 850, letterSpacing: 3, color: '#fecdd3' }}>{r.name}</span>
                  <span style={{ fontSize: 34, fontWeight: 650, color: C.muted }}>· {r.es}</span>
                </div>
                <div style={{ marginTop: 4, fontSize: 31, fontWeight: 600, lineHeight: '38px', color: C.text }}>{r.gloss}</div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* The fire triangle */}
      {fireIn > 0 && fireOut < 1 ? (
        <div style={{ position: 'absolute', left: PANEL.x + (PANEL.w - FIRE_W) / 2, top: 196, opacity: fireIn * (1 - fireOut), transform: `translateY(${(1 - fireIn) * 24}px)` }}>
          <FireTriangle sides={sides} out={out} flame={flame} />
        </div>
      ) : null}
      {fireIn > 0 && fireOut < 1 ? (
        <div style={{ position: 'absolute', left: PANEL.x, top: 196 + FIRE_H - 6, width: PANEL.w, textAlign: 'center', fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.muted, opacity: progress(frame, quitaAt, 14) * (1 - fireOut) }}>
          quita un lado y se apaga
        </div>
      ) : null}

      {/* The formula */}
      {progress(frame, names - 6, 16) > 0 ? <Formula frame={frame} at={names} /> : null}
    </Stage>
  );

  function Formula({ frame, at }: { frame: number; at: number }) {
    const p = progress(frame, at - 6, 18);
    const w = (word: string) => progress(frame, wordFrame(S, 's05-06', word) - 8, 12);
    const wi = w('intent,');
    const wc = w('capability');
    const wo = w('opportunity.');
    const note = progress(frame, wordFrame(S, 's05-06', 'combinación') - 8, 14);
    const part = (text: string, k: number, last = false): ReactNode => (
      <span style={{ color: k > 0.5 ? '#fecdd3' : C.text, textShadow: k > 0.05 ? `0 0 ${Math.round(24 * k)}px ${alpha(C.rose, 0.7 * k)}` : undefined, fontWeight: 850 }}>
        {text}
        {last ? '' : ' '}
      </span>
    );
    return (
      <div style={{ position: 'absolute', left: PANEL.x, top: 206, width: PANEL.w, fontFamily: FONT.sans, opacity: p, transform: `translateY(${(1 - p) * 22}px)` }}>
        <div style={{ boxSizing: 'border-box', padding: '28px 44px 32px', borderRadius: 32, border: `3px solid ${alpha(C.rose, 0.7)}`, background: `linear-gradient(180deg, ${alpha(C.rose, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 70%)`, boxShadow: `0 0 50px ${alpha(C.rose, 0.18)}` }}>
          <div style={{ fontSize: 66, lineHeight: 1.1, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.roseSoft }}>threat</span> =
          </div>
          <div style={{ marginTop: 12, fontSize: 60, lineHeight: 1.15, fontWeight: 850, letterSpacing: -1, whiteSpace: 'nowrap' }}>
            <div>{part('intent', wi, true)}</div>
            <div>
              <span style={{ color: C.muted }}>+ </span>
              {part('capability', wc, true)}
            </div>
            <div>
              <span style={{ color: C.muted }}>+ </span>
              {part('opportunity', wo, true)}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 26, fontSize: 36, fontWeight: 700, lineHeight: 1.25, color: C.text, textAlign: 'center', opacity: note, transform: `translateY(${(1 - note) * 12}px)` }}>
          las tres a la vez: una <span style={{ color: C.roseSoft }}>combinación</span>, no una suma
        </div>
      </div>
    );
  }
}
