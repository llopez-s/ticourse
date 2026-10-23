import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Dial } from './parts/Dial';
import { Tag, Verdict } from './parts/paper';
import { Stage, wordFrame } from './kit';

const S = 's04-calificadores';
const W = STAGE.width;

// Columns of the table (stage px): qualifier 290 | qué exige 640 | error típico 640 | marks (rest).
const COL_W = [360, 600, 620, W - 1580] as const;
const HEAD_H = 56;
const ROW_H = 94;

/** The lesson's qualifier table (s6m1), in the order the narration goes through it. */
const ROWS = [
  { q: 'BEST', exige: 'Hay 2+ defendibles; gana la más completa y directa al framework', error: 'Quedarte con la primera defendible que ves' },
  { q: 'FIRST / NEXT', exige: 'Orden del proceso (ciclo, kill chain, IR)', error: 'Elegir una acción correcta… fuera de orden' },
  { q: 'EXCEPT / NOT', exige: 'Lógica invertida: tres verdaderas, una falsa', error: 'Responder como si fuera pregunta normal' },
  { q: 'PRIMARY / MAIN', exige: 'El propósito central, no un beneficio colateral', error: 'Elegir un efecto secundario real pero no central' },
  { q: 'MOST likely', exige: 'La opción más probable, no la única posible', error: 'Elegir algo posible pero raro' },
] as const;

const LINKS = [
  { text: 'rasgo único', strong: true },
  { text: 'certificado propio', strong: true },
  { text: 'registro inusual', strong: true },
  { text: 'herramienta comercial popular', strong: false },
] as const;

/**
 * s04-calificadores «Una palabra cambia la respuesta». The lesson's qualifier table: on `table`
 * its header and the five qualifier names appear; each row fills in and lights when the voice names it
 * (`best`, `first` with a mini process clock, `except` with three green marks and one red).
 * `example`: four links to group intrusions as chips under the table, three strong (emerald)
 * and «herramienta comercial popular» in amber with «la usan muchísimos grupos» (reworded from
 * the lesson's check, no PDB). `others`: PRIMARY / MAIN and MOST likely fill in and stay.
 * `wrap-qual`: «primera lectura = cazar el calificador». The exam card draws outside the stage.
 */
export function S04Calificadores(props: SceneProps) {
  const frame = useCurrentFrame();
  const table = props.cue('table');
  const best = props.cue('best');
  const first = props.cue('first');
  const except = props.cue('except');
  const example = props.cue('example');
  const others = props.cue('others');
  const wrap = props.cue('wrap-qual');

  // The frame each row is named (fills in and lights); rows 4–5 together on `others`.
  const named = [best, first, except, others, others + 24];
  const nextOf = (i: number) => (i < 2 ? named[i + 1] : i === 2 ? example + 400 : 1e9);

  const marksAt = wordFrame(S, 's04-04', 'verdad') - 8;
  const linkAt = [
    example - 2,
    example + 8,
    example + 18,
    wordFrame(S, 's04-05', 'herramienta') - 6,
  ];
  const noteAt = wordFrame(S, 's04-05', 'muchísimos') - 6;
  const exOut = progress(frame, wrap - 10, 14, EASE.inOut);
  const exampleIn = progress(frame, example - 6, 16);

  return (
    <Stage>
      {/* header */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: HEAD_H, display: 'flex', fontFamily: FONT.sans, ...enter(frame, table, { distance: 14 }) }}>
        {['qualifier', 'qué exige', 'error típico', ''].map((h, i) => (
          <div key={i} style={{ width: COL_W[i], boxSizing: 'border-box', padding: '0 22px', display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: i === 2 ? C.amber : C.cyanSoft, borderBottom: `3px solid ${C.ink600}` }}>
            {h}
          </div>
        ))}
      </div>

      {ROWS.map((r, i) => {
        const top = HEAD_H + i * ROW_H;
        const appear = enter(frame, table + 14 + i * 9, { distance: 16 });
        const fill = progress(frame, named[i] - 4, 16);
        const hot = progress(frame, named[i] - 4, 12) * (1 - progress(frame, nextOf(i) - 4, 14));
        const dimmed = fill > 0.9 && hot < 0.4;
        return (
          <div
            key={r.q}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width: W,
              height: ROW_H,
              display: 'flex',
              alignItems: 'stretch',
              fontFamily: FONT.sans,
              boxSizing: 'border-box',
              borderRadius: 14,
              background: hot > 0.02 ? `linear-gradient(90deg, ${alpha(C.cyan, 0.05 + 0.16 * hot)} 0%, ${alpha(C.cyan, 0.03 + 0.08 * hot)} 100%)` : alpha(C.ink850, 0.6),
              border: `2px solid ${hot > 0.02 ? alpha(C.cyan, 0.3 + 0.6 * hot) : alpha(C.ink700, 0.8)}`,
              boxShadow: hot > 0.05 ? `0 0 ${Math.round(28 * hot)}px ${alpha(C.cyan, 0.2 * hot)}` : undefined,
              ...appear,
              opacity: appear.opacity * (dimmed ? 0.72 : 1),
            }}
          >
            <div style={{ width: COL_W[0], boxSizing: 'border-box', padding: '0 22px', display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 850, letterSpacing: -0.3, color: fill > 0.3 ? C.textStrong : C.muted }}>{r.q}</div>
            <div style={{ width: COL_W[1], boxSizing: 'border-box', padding: '0 22px', display: 'flex', alignItems: 'center', fontSize: 33, fontWeight: 600, lineHeight: 1.14, color: C.text, opacity: fill }}>{r.exige}</div>
            <div style={{ width: COL_W[2], boxSizing: 'border-box', padding: '0 22px', display: 'flex', alignItems: 'center', fontSize: 33, fontWeight: 600, lineHeight: 1.14, color: '#fcd34d', opacity: fill }}>{r.error}</div>
            <div style={{ width: COL_W[3], display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {i === 1 ? (
                <div style={{ opacity: fill }}>
                  <Dial size={62} sweep={progress(frame, first, 70, EASE.inOut) * 0.75} hand={progress(frame, first, 70, EASE.inOut) * 0.75} color={C.cyan} />
                </div>
              ) : null}
              {i === 2
                ? [true, true, true, false].map((ok, k) => {
                    const p = progress(frame, marksAt + k * 12, 10, EASE.out);
                    return p > 0 ? (
                      <div key={k} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})` }}>
                        <Verdict ok={ok} size={28} />
                      </div>
                    ) : null;
                  })
                : null}
            </div>
          </div>
        );
      })}

      {/* the EXCEPT example */}
      {exampleIn > 0 && exOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 540, width: W, opacity: exampleIn * (1 - exOut), fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, fontWeight: 800, color: C.textStrong, transform: `translateY(${(1 - exampleIn) * 14}px)` }}>
            <Tag color={C.cyan} size={30} solid>
              EXCEPT
            </Tag>
            ¿qué enlace para agrupar intrusiones no es fuerte?
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 20 }}>
            {LINKS.map((l, i) => {
              const e = enter(frame, linkAt[i], { distance: 20 });
              const color = l.strong ? C.emerald : C.amber;
              return (
                <div key={l.text} style={{ ...e }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 22px 10px 14px', borderRadius: 999, border: `3px solid ${alpha(color, 0.85)}`, background: alpha(color, l.strong ? 0.1 : 0.16), fontSize: 32, fontWeight: 750, color: l.strong ? C.textStrong : '#fde68a', whiteSpace: 'nowrap' }}>
                    <Icon name={l.strong ? 'link' : 'alert'} size={34} color={color} strokeWidth={2.2} />
                    {l.text}
                  </span>
                </div>
              );
            })}
          </div>
          {frame >= noteAt - 4 ? (
            <div style={{ position: 'absolute', left: 1180, top: 4, display: 'flex', alignItems: 'center', gap: 12, ...enter(frame, noteAt, { distance: 14 }) }}>
              <Icon name="users" size={38} color={C.amber} strokeWidth={2} />
              <span style={{ fontSize: 32, fontWeight: 700, color: '#fcd34d', whiteSpace: 'nowrap' }}>la usan muchísimos grupos</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* wrap */}
      {frame >= wrap - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: 548, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, wrap, { distance: 24 }) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 24, padding: '14px 44px 18px 32px', borderRadius: 32, background: alpha(C.cyan, 0.1), border: `3px solid ${alpha(C.cyan, 0.75)}`, boxShadow: `0 0 36px ${alpha(C.cyan, 0.25)}`, fontFamily: FONT.sans }}>
            <Icon name="target" size={64} color={C.cyan} strokeWidth={2.1} />
            <span style={{ fontSize: 58, fontWeight: 850, color: C.textStrong, letterSpacing: -1, whiteSpace: 'nowrap' }}>
              primera lectura = <span style={{ color: C.cyan }}>cazar el calificador</span>
            </span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
