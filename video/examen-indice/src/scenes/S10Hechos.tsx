import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, countUp, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Binder } from './parts/Binder';
import { CLIMB_PX, Climber, ropePoint } from './parts/Climber';
import { Bar, Paper, Tag, withOpacity } from './parts/paper';
import { Stage, wordFrame } from './kit';

const S = 's10-hechos';
const W = STAGE.width;
const PANEL_TOP = 205;
const PANEL_H = 440;
const PANEL_W = 836;
const RIGHT_X = W - PANEL_W;

const FACTS = [
  { text: 'very likely = 80–95 %', word: 'very' },
  { text: 'las fases de la kill chain, en orden', word: 'kill' },
  { text: 'TLP: quién puede redistribuir', word: 'TLP' },
] as const;

/** The ten essentials of the lesson (s6m2), shortened to a line each, with where they live. */
const ESSENTIALS = [
  ['Las 7 bandas ICD 203', 'S5M2'],
  ['Las 7 fases de la Kill Chain', 'S2M1'],
  ['Los 4 vértices del Diamond', 'S2M3'],
  ['Courses of Action: 7 acciones por fase', 'S2M2'],
  ['Las 5 marcas TLP 2.0', 'S3M4'],
  ['Niveles de atribución', 'S4M5'],
  ['Tipos de hash y su pivote', 'S3M2'],
  ['F3EAD y las 6 fases del ciclo', 'S1M4'],
  ['Sesgos y su contramedida', 'S4M1'],
  ['Pyramid of Pain', 'S2M5'],
] as const;

/**
 * s10-hechos «Qué rescata el índice». Under the intercepted message (top band clear) a perfect
 * index glows alone; as the voice says «te da datos» it steps into the left column and the two columns
 * open: `hechos` (cyan) and `juicios` (amber). `facts`: three lesson entries light up in turn, «very
 * likely = 80–95 %», «las fases de la kill chain, en orden», «TLP: quién puede redistribuir». `judgment`: a
 * generic question, «¿qué respuesta equilibra mejor llegar a tiempo y llegar completa?», behind a
 * padlock, «no está en el libro». `train`: a counter climbs, «las preguntas que ya habrás
 * peleado», and «tu calibración». `rope-2`: the climber of s02 again — the rope catches the fact that
 * slips (it stops, lit), and the judgment rises with the climber. `essentials`: the ten essentials of
 * the lesson with where they live, ticked one by one.
 */
export function S10Hechos(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyD = props.cue('reply-d');
  const facts = props.cue('facts');
  const judgment = props.cue('judgment');
  const train = props.cue('train');
  const rope2 = props.cue('rope-2');
  const essentials = props.cue('essentials');

  // ---- the perfect index, then the two columns
  const datosAt = wordFrame(S, 's10-01', 'datos') - 8;
  const mejorAt = wordFrame(S, 's10-01', 'mejor') - 8;
  const idxMove = progress(frame, datosAt, 22, EASE.inOut);
  const factsHead = progress(frame, datosAt + 6, 16);
  const judgHead = progress(frame, mejorAt, 16);

  const colsOut = progress(frame, rope2 - 14, 16, EASE.inOut);

  // ---- facts
  const factAt = FACTS.map((f) => wordFrame(S, 's10-02', f.word) - 8);

  // ---- judgment, training
  const lockP = progress(frame, wordFrame(S, 's10-03', 'índice') - 6, 14, EASE.out);
  const trainP = progress(frame, train - 4, 16);
  const count = Math.round(countUp(frame, train, 100, 0, 100));
  const calibAt = wordFrame(S, 's10-04', 'calibración') - 8;

  // ---- rope-2
  const climberIn = progress(frame, rope2 - 6, 16);
  const climberOut = progress(frame, essentials - 14, 16, EASE.inOut);
  const rescataAt = wordFrame(S, 's10-05', 'rescata');
  const fallAt = rescataAt - 30;
  const catchAt = rescataAt + 6;
  const juicioAt = wordFrame(S, 's10-05', 'juicio') - 6;
  const climb = progress(frame, juicioAt, 80, EASE.inOut);

  // The falling fact: from the wall top to the rope, then it hangs there lit.
  const rp = ropePoint(0.5, climb);
  const fall = progress(frame, fallAt, catchAt - fallAt, EASE.in);
  const cardX = rp.x;
  const cardY = -20 + (rp.y - 50 - -20) * fall;
  const caught = progress(frame, catchAt, 10, EASE.out);
  const bounce = frame >= catchAt ? Math.sin((frame - catchAt) * 0.55) * 7 * Math.max(0, 1 - (frame - catchAt) / 30) : 0;

  const column = (x: number, accent: string, title: string, headP: number, children: ReactNode, lit = 0) => (
    <div style={{ position: 'absolute', left: x, top: PANEL_TOP, width: PANEL_W, height: PANEL_H, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(accent, 0.55 + 0.4 * lit)}`, boxShadow: lit > 0.05 ? `0 0 ${Math.round(34 * lit)}px ${alpha(accent, 0.25 * lit)}` : undefined, background: `linear-gradient(180deg, ${alpha(accent, 0.08)} 0%, ${alpha(C.ink900, 0.96)} 55%)`, opacity: headP, transform: `translateY(${(1 - headP) * 20}px)`, fontFamily: FONT.sans }}>
      <div style={{ height: 78, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', borderBottom: `2px solid ${alpha(accent, 0.35)}` }}>
        <span style={{ fontSize: 56, fontWeight: 850, letterSpacing: -1, color: accent }}>{title}</span>
      </div>
      {children}
    </div>
  );

  return (
    <Stage>
      {/* the perfect index: alone first, then it steps into «hechos» */}
      {idxMove < 1 || frame < datosAt + 30 ? (
        <div
          style={{
            position: 'absolute',
            left: (W - 200) / 2 + (36 + 20 - (W - 200) / 2) * idxMove,
            top: 228 + (PANEL_TOP + 100 - 228) * idxMove,
            transform: `scale(${1 - 0.55 * idxMove})`,
            transformOrigin: 'left top',
            opacity: 1 - progress(frame, datosAt + 20, 12),
          }}
        >
          <Binder w={200} glow={0.5 + 0.4 * pulse(frame, 30, 0.7)} tabs={1} />
        </div>
      ) : null}
      {frame >= replyD && frame < datosAt + 14 ? (
        <div style={{ position: 'absolute', left: 0, top: 592, width: W, display: 'flex', justifyContent: 'center', opacity: progress(frame, replyD, 10) * (1 - progress(frame, datosAt, 12)) }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <Tag color={C.rose} size={40} icon="x">
              lo responde todo
            </Tag>
            <span style={{ position: 'absolute', left: -8, right: -8, top: '50%', height: 6, marginTop: -3, borderRadius: 3, background: C.rose, transformOrigin: 'left center', transform: `scaleX(${progress(frame, replyD + 8, 14, EASE.inOut)})` }} />
          </span>
        </div>
      ) : null}
      {frame < datosAt + 14 ? (
        <div style={{ position: 'absolute', left: 0, top: 504, width: W, display: 'flex', justifyContent: 'center', opacity: 1 - progress(frame, datosAt, 12) }}>
          <Tag color={C.cyan} size={48} icon="check">
            un índice perfecto
          </Tag>
        </div>
      ) : null}

      {colsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - colsOut, transform: `translateY(${-colsOut * 18}px)` }}>
          {column(
            0,
            C.cyan,
            'hechos',
            factsHead,
            <div style={{ position: 'relative' }}>
              {FACTS.map((f, i) => {
                const hot = progress(frame, factAt[i], 12);
                const next = factAt[i + 1] ?? 1e9;
                const dim = hot * progress(frame, next, 12) * 0.35;
                return (
                  <div key={f.text} style={{ position: 'absolute', left: 24, top: 20 + i * 112, width: PANEL_W - 48, height: 96, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 20, padding: '0 22px', borderRadius: RADIUS.md, background: alpha(C.cyan, 0.05 + 0.12 * hot), border: `3px solid ${alpha(C.cyan, 0.25 + 0.65 * hot)}`, boxShadow: hot > 0.05 ? `0 0 ${Math.round(26 * hot)}px ${alpha(C.cyan, 0.28 * hot)}` : undefined, opacity: 0.55 + 0.45 * hot - dim, transform: `scale(${1 + 0.03 * hot})` }}>
                    <Icon name={hot > 0.5 ? 'check' : 'search'} size={46} color={hot > 0.5 ? C.emerald : C.cyan} strokeWidth={hot > 0.5 ? 3.2 : 2.2} />
                    <span style={{ fontSize: 40, fontWeight: 760, lineHeight: 1.1, color: C.textStrong }}>{f.text}</span>
                  </div>
                );
              })}
            </div>,
            progress(frame, facts, 14),
          )}
          {column(
            RIGHT_X,
            C.amber,
            'juicios',
            judgHead,
            <div style={{ position: 'relative' }}>
              {frame >= judgment - 4 ? (
                <div style={{ position: 'absolute', left: 28, top: 24, width: PANEL_W - 56, ...withOpacity(enter(frame, judgment, { distance: 24 }), 1 - trainP) }}>
                  <div style={{ fontSize: 46, fontWeight: 760, lineHeight: 1.18, color: C.textStrong }}>¿qué respuesta equilibra mejor llegar a tiempo y llegar completa?</div>
                </div>
              ) : null}
              {lockP > 0.02 ? (
                <div style={{ position: 'absolute', left: 28, top: 214, display: 'flex', alignItems: 'center', gap: 18, opacity: lockP * (1 - trainP), transform: `scale(${0.8 + 0.2 * lockP})`, transformOrigin: 'left center' }}>
                  <div style={{ width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', background: alpha(C.rose, 0.18), border: `4px solid ${C.rose}` }}>
                    <Icon name="lock" size={48} color={C.rose} strokeWidth={2.4} />
                  </div>
                  <Tag color={C.rose} size={42}>
                    no está en el libro
                  </Tag>
                </div>
              ) : null}
              {trainP > 0.02 ? (
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: PANEL_H - 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: trainP, transform: `scale(${0.9 + 0.1 * trainP})` }}>
                  <div style={{ fontSize: 150, fontWeight: 850, letterSpacing: -4, color: C.emerald, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 40px ${alpha(C.emerald, 0.4)}` }}>+{count}</div>
                  <div style={{ fontSize: 40, fontWeight: 750, color: C.textStrong, textAlign: 'center', lineHeight: 1.15 }}>las preguntas que ya habrás peleado</div>
                  {frame >= calibAt - 4 ? (
                    <div style={{ marginTop: 14, ...enter(frame, calibAt, { distance: 14 }) }}>
                      <Tag color={C.cyan} size={34} icon="target">
                        y tu calibración
                      </Tag>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>,
          )}
        </div>
      ) : null}

      {/* the climber again */}
      {climberIn > 0 && climberOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: climberIn * (1 - climberOut) }}>
          <div style={{ position: 'absolute', left: 0, top: 50, width: 860, height: 560 }}>
            <Climber climb={climb} rope={1} glow={0.7 * caught}>
              {/* the fact that slips */}
              {frame >= fallAt - 2 ? (
                <div style={{ position: 'absolute', left: cardX - 78, top: cardY + bounce, transform: `rotate(${rp.angle * caught + (1 - caught) * -12 * (1 - fall)}deg)`, transformOrigin: '50% 50%', opacity: progress(frame, fallAt - 2, 6) }}>
                  <Paper w={156} h={92} style={{ padding: '14px 14px', boxShadow: `0 0 ${Math.round(34 * caught)}px ${alpha(C.emerald, 0.8 * caught)}, 0 10px 18px ${alpha('#000000', 0.5)}`, borderColor: caught > 0.2 ? C.emerald : undefined }}>
                    <div style={{ display: 'grid', gap: 9 }}>
                      <Bar w={110} h={8} color={alpha('#1e2635', 0.6)} />
                      <Bar w={80} h={8} color={alpha('#1e2635', 0.45)} />
                    </div>
                  </Paper>
                </div>
              ) : null}
              {/* the judgment rides up with the climber */}
              {frame >= juicioAt - 4 ? (
                <div style={{ position: 'absolute', left: 640, top: 18 - CLIMB_PX * climb, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 24px 8px 16px', borderRadius: 999, background: alpha(C.amber, 0.16), border: `3px solid ${C.amber}`, boxShadow: `0 0 28px ${alpha(C.amber, 0.35)}`, ...enter(frame, juicioAt, { distance: 14 }) }}>
                  <Icon name="brain" size={44} color={C.amber} strokeWidth={2.2} />
                  <span style={{ fontSize: 42, fontWeight: 850, color: '#fde68a' }}>juicio</span>
                </div>
              ) : null}
            </Climber>
          </div>
          <div style={{ position: 'absolute', left: 930, top: 250, width: W - 930, fontFamily: FONT.sans }}>
            <div style={enter(frame, rescataAt - 10, { distance: 26, axis: 'x' })}>
              <Tag color={C.emerald} size={46} solid icon="link">
                la cuerda rescata
              </Tag>
              <div style={{ marginTop: 14, fontSize: 64, fontWeight: 850, color: C.emerald, letterSpacing: -1 }}>el hecho</div>
            </div>
            <div style={{ marginTop: 56, ...enter(frame, juicioAt, { distance: 26, axis: 'x' }) }}>
              <Tag color={C.amber} size={46} solid icon="user">
                lo subes tú
              </Tag>
              <div style={{ marginTop: 14, fontSize: 64, fontWeight: 850, color: C.amber, letterSpacing: -1 }}>el juicio</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* the ten essentials */}
      {frame >= essentials - 6 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: progress(frame, essentials - 6, 14), fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 200, width: W, textAlign: 'center', fontSize: 50, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5, ...enter(frame, essentials - 4, { distance: 16 }) }}>
            los diez imprescindibles
          </div>
          {ESSENTIALS.map(([label, where], i) => {
            const col = i < 5 ? 0 : 1;
            const row = i % 5;
            const tickAt = essentials + 10 + i * 10;
            const ticked = progress(frame, tickAt, 10, EASE.out);
            return (
              <div key={label} style={{ position: 'absolute', left: col * 880, top: 290 + row * 68, width: 848, height: 58, display: 'flex', alignItems: 'center', gap: 16, ...enter(frame, essentials + i * 3, { distance: 14 }) }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, display: 'grid', placeItems: 'center', border: `3px solid ${ticked > 0.3 ? C.emerald : C.ink500}`, background: alpha(C.emerald, 0.9 * ticked), flexShrink: 0 }}>
                  {ticked > 0.3 ? <Icon name="check" size={34} color={C.ink950} strokeWidth={3.4} /> : null}
                </div>
                <span style={{ fontSize: 33, fontWeight: 650, color: ticked > 0.3 ? C.textStrong : C.text, whiteSpace: 'nowrap' }}>{label}</span>
                <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.cyanSoft, background: alpha(C.cyan, 0.1), border: `2px solid ${alpha(C.cyan, 0.5)}`, borderRadius: 8, padding: '0 12px' }}>{where}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}
