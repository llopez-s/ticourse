import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { Binder } from './parts/Binder';
import { MiniNote } from './parts/paper';
import { Stage, wordFrame } from './kit';

const S = 's01-noche';
const W = STAGE.width;
const H = STAGE.height;

/** Loose micro-notes around the binder (offsets from the binder centre). `wave` 0 lands on `notes`, 1 on «montón». */
const NOTES = [
  { dx: -330, dy: -120, rot: -9, c: C.cyan, wave: 0 },
  { dx: 300, dy: 70, rot: 7, c: C.amber, wave: 0 },
  { dx: -260, dy: 150, rot: 11, c: C.emerald, wave: 0 },
  { dx: 330, dy: -110, rot: 9, c: C.roseSoft, wave: 1 },
  { dx: -400, dy: 20, rot: -4, c: C.sky, wave: 1 },
  { dx: 260, dy: 190, rot: -6, c: C.cyan, wave: 1 },
  { dx: -170, dy: -190, rot: 6, c: C.amber, wave: 1 },
  { dx: 190, dy: -200, rot: -11, c: C.emerald, wave: 1 },
  { dx: 118, dy: 150, rot: 13, c: C.sky, wave: 1 },
  { dx: -120, dy: 190, rot: -12, c: C.roseSoft, wave: 1 },
] as const;

const PROMISE: { text: string; icon: IconName; word: string; tone: string }[] = [
  { text: 'leer una pregunta de verdad', icon: 'eye', word: 'cómo', tone: C.cyan },
  { text: 'escribir notas que respondan solas', icon: 'file', word: 'hace', tone: C.emerald },
  { text: 'saber qué no entra en el índice', icon: 'funnel', word: 'no', tone: C.amber },
];

/**
 * s01-noche «Una mesa y un índice». A desk seen from above at night: it is dark until the
 * lamp comes on at `notes`, three micro-notes land («Es la noche antes del examen»), the
 * printed index drops in on `index` (cover «ÍNDICE · GCTI», coloured tabs slide out) and the
 * rest of the pile arrives on «montón». On `title` the whole desk steps down and the title
 * «Tu índice vale 60 segundos» lands across the top (before 10 s) with «preguntas ·
 * micronotas · hechos y juicios» under it. On `promise` the desk shrinks to the left and the
 * three promises light on the right, one per sentence: leer una pregunta de verdad, escribir
 * notas que respondan solas, saber qué no entra en el índice.
 */
export function S01Noche(props: SceneProps) {
  const frame = useCurrentFrame();
  const notesAt = props.cue('notes');
  const indexAt = props.cue('index');
  const titleAt = props.cue('title');
  const promise = props.cue('promise');
  const pileAt = wordFrame(S, 's01-01', 'montón') - 6;
  const subAt = wordFrame(S, 's01-02', 'duda') - 6;
  const itemAt = PROMISE.map((p) => wordFrame(S, 's01-03', p.word) - 8);

  const lamp = progress(frame, notesAt - 8, 30);
  const toTitle = progress(frame, titleAt - 14, 26, EASE.inOut);
  const toPromise = progress(frame, promise - 20, 26, EASE.inOut);
  const scale = mix(mix(1, 0.84, toTitle), 0.72, toPromise);
  const ty = mix(mix(0, 64, toTitle), 28, toPromise);
  const tx = mix(0, -430, toPromise);

  const binderIn = springIn(frame, 30, indexAt - 6, { damping: 15 });
  const titleIn = progress(frame, titleAt - 6, 18);

  return (
    <Stage>
      {/* the desk and the lamp */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 30,
          overflow: 'hidden',
          background: `linear-gradient(180deg, #2b2019 0%, #1a130f 100%)`,
          border: `2px solid ${C.ink700}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(90deg, ${alpha('#000000', 0.12)} 0px, ${alpha('#000000', 0.12)} 2px, transparent 2px, transparent 54px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(760px 520px at ${W / 2}px 340px, ${alpha('#f59e0b', 0.22 * lamp + 0.04)} 0%, transparent 72%)`,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: alpha('#000000', 0.5 * (1 - lamp)) }} />
      </div>

      {/* the objects on the desk */}
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: '50% 50%' }}>
        {NOTES.map((n, i) => {
          const at = n.wave === 0 ? notesAt + 8 + i * 9 : pileAt + (i - 3) * 5;
          const p = springIn(frame, 30, at, { damping: 13 });
          if (frame < at - 2) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: W / 2 + n.dx - 85,
                top: H / 2 + n.dy - 56,
                opacity: Math.min(1, p * 1.5),
                transform: `translateY(${(1 - Math.min(1, p)) * -46}px) rotate(${n.rot * (0.6 + 0.4 * Math.min(1, p))}deg) scale(${1.15 - 0.15 * Math.min(1, p)})`,
              }}
            >
              <MiniNote stripe={n.c} lines={3 + (i % 2)} />
            </div>
          );
        })}

        {/* a mug, top view */}
        <div style={{ position: 'absolute', left: W / 2 + 440, top: H / 2 + 120, opacity: lamp }}>
          <div style={{ width: 92, height: 92, borderRadius: 46, background: 'radial-gradient(circle at 50% 50%, #3a2a20 0%, #3a2a20 52%, #d7ccb8 54%, #b9ad96 100%)', boxShadow: `0 10px 20px ${alpha('#000000', 0.5)}` }} />
          <div style={{ position: 'absolute', left: 84, top: 28, width: 30, height: 36, borderRadius: 14, border: '9px solid #b9ad96', borderLeft: 'none' }} />
        </div>

        {binderIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: W / 2 - 165,
              top: H / 2 - 218,
              opacity: Math.min(1, binderIn * 1.6),
              transform: `translateY(${(1 - Math.min(1, binderIn)) * -70}px) scale(${1.1 - 0.1 * Math.min(1, binderIn)})`,
            }}
          >
            <Binder w={330} glow={0.5 * progress(frame, indexAt + 4, 20)} tabs={progress(frame, indexAt + 10, 36)} />
          </div>
        ) : null}
      </div>

      {/* title */}
      {titleIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 6, width: W, textAlign: 'center', fontFamily: FONT.sans, ...enter(frame, titleAt - 6, { distance: 20 }) }}>
          <div style={{ fontSize: 92, fontWeight: 850, color: C.textStrong, letterSpacing: -2, lineHeight: 1.05, whiteSpace: 'nowrap', textShadow: `0 4px 24px ${alpha('#000000', 0.7)}` }}>
            Tu índice vale <span style={{ color: C.cyan }}>60 segundos</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 44, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap', textShadow: `0 3px 16px ${alpha('#000000', 0.8)}`, ...enter(frame, subAt, { distance: 12 }) }}>
            preguntas · micronotas · hechos y juicios
          </div>
        </div>
      ) : null}

      {/* the promise */}
      {PROMISE.map((p, i) => {
        const e = enter(frame, itemAt[i], { distance: 40, axis: 'x' });
        const next = itemAt[i + 1] ?? 1e9;
        const hot = progress(frame, itemAt[i], 10) * (1 - 0.55 * progress(frame, next - 2, 12, EASE.inOut));
        return (
          <div
            key={p.text}
            style={{
              position: 'absolute',
              left: 880,
              top: 186 + i * 152,
              width: W - 880,
              height: 130,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              padding: '0 30px',
              borderRadius: RADIUS.lg,
              background: `linear-gradient(180deg, ${alpha(p.tone, 0.1 + 0.08 * hot)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
              border: `3px solid ${alpha(p.tone, 0.35 + 0.55 * hot)}`,
              boxShadow: hot > 0.05 ? `0 0 ${Math.round(34 * hot)}px ${alpha(p.tone, 0.3 * hot)}` : `0 18px 40px ${alpha('#000000', 0.4)}`,
              fontFamily: FONT.sans,
              ...e,
              opacity: e.opacity * (0.6 + 0.4 * hot),
            }}
          >
            <div style={{ width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', background: alpha(p.tone, 0.14), border: `3px solid ${alpha(p.tone, 0.75)}`, flexShrink: 0 }}>
              <Icon name={p.icon} size={50} color={p.tone} strokeWidth={2.1} />
            </div>
            <span style={{ fontSize: 42, fontWeight: 780, lineHeight: 1.14, color: C.textStrong }}>{p.text}</span>
          </div>
        );
      })}
    </Stage>
  );
}
