import { useCurrentFrame } from 'remotion';
import type { ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { ClockArt, RodMini, RodScene, Silhouette } from './parts/Glyphs';
import { Stage, wordFrame } from './kit';

const S = 's08-conducta';
const W = STAGE.width;

const ROD_X = [110, 380, 650, 920, 1190] as const;

/**
 * s08-conducta «Lo que cuesta cambiar». The fisherman changes rods in an afternoon: a row of five rods, each one struck out
 * as the next arrives (words «cambia», «tarde», «programa», «nombre», «versión») beside a short clock, «horas». On `habit` the
 * rods leave and the fisherman of the last scene is back, still fishing the same way: «hábitos», «pasos» and «forma de trabajar»
 * land on their words, and a long clock, «mucho más», is set against the short one. On `bet` two bars say how long a clue lasts —
 * «el fichero: poco», «el comportamiento: más» — with «bloquear ficheros sigue valiendo» (a check, not a warning: blocking still
 * works). The close, on «herramienta» and «persona»: «la herramienta cambia en horas · la forma de trabajar, no» and «una persona,
 * no un programa».
 */
export function S08Conducta(props: SceneProps) {
  const frame = useCurrentFrame();
  const change = props.cue('change');
  const habit = props.cue('habit');
  const bet = props.cue('bet');

  // ---- Rods.
  const rodAt = [
    change,
    wordFrame(S, 's08-01', 'tarde') - 8,
    wordFrame(S, 's08-01', 'programa') - 8,
    wordFrame(S, 's08-01', 'nombre') - 8,
    wordFrame(S, 's08-01', 'versión') - 8,
  ];
  const horasAt = wordFrame(S, 's08-01', 'tarde') - 4;
  const yesterdayAt = wordFrame(S, 's08-01', 'ayer') - 10;
  const rodsOut = progress(frame, habit - 8, 16, EASE.inOut);

  // ---- Fisherman and habits.
  const fisherIn = progress(frame, habit - 4, 18);
  const habitsAt = wordFrame(S, 's08-02', 'hábitos') - 8;
  const stepsAt = wordFrame(S, 's08-02', 'pasos') - 8;
  const wayAt = wordFrame(S, 's08-02', 'forma') - 8;
  const longAt = wordFrame(S, 's08-02', 'cuesta') - 6;
  const sceneOut = progress(frame, bet - 8, 16, EASE.inOut);

  // ---- Bars.
  const barsIn = progress(frame, bet - 2, 16);
  const fileBar = progress(frame, wordFrame(S, 's08-03', 'ficheros') - 6, 20, EASE.out);
  const behaviourBar = progress(frame, wordFrame(S, 's08-03', 'comportamiento') - 4, 30, EASE.out);
  const stillAt = wordFrame(S, 's08-03', 'bloquear') - 8;
  const barsOut = progress(frame, wordFrame(S, 's08-04', 'herramienta') - 12, 16, EASE.inOut);

  // ---- Close.
  const toolAt = wordFrame(S, 's08-04', 'herramienta') - 6;
  const wayCloseAt = wordFrame(S, 's08-04', 'forma') - 8;
  const personAt = wordFrame(S, 's08-04', 'persona') - 10;

  return (
    <Stage>
      {/* Rods that replace one another */}
      {rodsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - rodsOut, fontFamily: FONT.sans }}>
          {ROD_X.map((x, i) => {
            const e = enter(frame, rodAt[i], { distance: 26 });
            const struck = progress(frame, (rodAt[i + 1] ?? 1e9) + 6, 12);
            return (
              <div key={x} style={{ position: 'absolute', left: x, top: 226, ...e, opacity: e.opacity * (1 - 0.55 * struck) }}>
                <RodMini size={250} struck={struck} color={i % 2 ? C.amber : '#fcd34d'} />
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 1470, top: 236, width: 220, textAlign: 'center', opacity: progress(frame, horasAt, 14), transform: `translateY(${(1 - progress(frame, horasAt, 14)) * 14}px)` }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ClockArt size={150} fill={0.14} />
            </div>
            <div style={{ marginTop: 8, fontSize: 50, fontWeight: 850, color: '#fcd34d' }}>horas</div>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 500, width: 1400, textAlign: 'center', fontSize: 40, fontWeight: 700, color: C.muted, opacity: progress(frame, yesterdayAt, 14) }}>
            el fichero de ayer ya no vale
          </div>
        </div>
      ) : null}

      {/* The fisherman, same as before, with his habits and the long clock */}
      {fisherIn > 0 && sceneOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: fisherIn * (1 - sceneOut), fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 20, top: 190 }}>
            <RodScene width={700} fisher={1} draw={1} />
          </div>
          <Habit top={208} at={habitsAt} frame={frame} icon="gear">
            hábitos
          </Habit>
          <Habit top={308} at={stepsAt} frame={frame} icon="layers">
            pasos
          </Habit>
          <Habit top={408} at={wayAt} frame={frame} icon="user">
            forma de trabajar
          </Habit>
          <div style={{ position: 'absolute', left: 800, top: 530, display: 'flex', alignItems: 'center', gap: 36, opacity: progress(frame, longAt, 16) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.55 }}>
              <ClockArt size={96} fill={0.14} />
              <span style={{ fontSize: 36, fontWeight: 800, color: '#fcd34d' }}>horas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <ClockArt size={130} fill={0.82 * progress(frame, longAt + 6, 40, EASE.inOut)} color={C.cyan} />
              <span style={{ fontSize: 56, fontWeight: 850, color: C.cyanSoft }}>mucho más</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Two bars: how long a clue lasts */}
      {barsIn > 0 && barsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: barsIn * (1 - barsOut), fontFamily: FONT.sans }}>
          <Bar top={216} label="el fichero: poco" value={0.2 * fileBar} tone={C.amber} />
          <Bar top={382} label="el comportamiento: más" value={0.86 * behaviourBar} tone={C.cyan} />
          {frame >= stillAt - 2 ? (
            <div style={{ position: 'absolute', left: 0, top: 560, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, stillAt, { distance: 16 }) }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 38px 12px 26px', borderRadius: 999, border: `3px solid ${alpha(C.emerald, 0.85)}`, background: alpha(C.emerald, 0.12), fontSize: 44, fontWeight: 800, color: '#d1fae5', whiteSpace: 'nowrap' }}>
                <Icon name="check" size={46} color={C.emerald} strokeWidth={2.6} />
                bloquear ficheros sigue valiendo
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The close */}
      {frame >= toolAt - 4 ? (
        <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
          <Close top={190} at={toolAt} frame={frame}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
              <RodMini size={78} />
              <span style={{ fontSize: 54, fontWeight: 850, color: C.textStrong }}>
                la herramienta cambia en <span style={{ color: '#fcd34d' }}>horas</span>
              </span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: progress(frame, wayCloseAt, 14), transform: `translateY(${(1 - progress(frame, wayCloseAt, 14)) * 12}px)` }}>
              <ClockArt size={78} fill={0.85} color={C.cyan} />
              <span style={{ fontSize: 54, fontWeight: 850, color: C.textStrong }}>
                la forma de trabajar, <span style={{ color: C.cyanSoft }}>no</span>
              </span>
            </span>
          </Close>
          {frame >= personAt - 4 ? (
            <div style={{ position: 'absolute', left: (W - 1200) / 2, top: 486, width: 1200, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, padding: '18px 34px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.rose, 0.8)}`, background: `linear-gradient(90deg, ${alpha(C.rose, 0.14)}, ${alpha(C.ink900, 0.96)})`, boxShadow: `0 0 44px ${alpha(C.rose, 0.22)}`, ...enter(frame, personAt, { distance: 20 }) }}>
              <div style={{ flexShrink: 0 }}>
                <Silhouette width={96} />
              </div>
              <span style={{ fontSize: 64, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap' }}>
                una <span style={{ color: C.roseSoft }}>persona</span>, no un programa
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

function Habit({ top, at, frame, icon, children }: { top: number; at: number; frame: number; icon: IconName; children: ReactNode }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ position: 'absolute', left: 800, top, display: 'inline-flex', alignItems: 'center', gap: 22, padding: '12px 38px 12px 24px', borderRadius: 999, border: `3px solid ${alpha(C.rose, 0.8)}`, background: alpha(C.rose, 0.12), fontSize: 54, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
      <Icon name={icon} size={52} color={C.roseSoft} strokeWidth={2.2} />
      {children}
    </div>
  );
}

function Bar({ top, label, value, tone }: { top: number; label: string; value: number; tone: string }) {
  return (
    <div style={{ position: 'absolute', left: 120, top, width: W - 240 }}>
      <div style={{ fontSize: 50, fontWeight: 850, color: tone === C.amber ? '#fcd34d' : C.cyanSoft, marginBottom: 14, whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ height: 70, borderRadius: 18, border: `3px solid ${C.ink500}`, background: alpha(C.ink800, 0.8), boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ width: `${value * 100}%`, height: '100%', background: `linear-gradient(90deg, ${alpha(tone, 0.55)} 0%, ${tone} 100%)`, boxShadow: `0 0 30px ${alpha(tone, 0.4)}` }} />
      </div>
    </div>
  );
}

function Close({ top, at, frame, children }: { top: number; at: number; frame: number; children: ReactNode }) {
  const p = progress(frame, at, 16);
  return (
    <div style={{ position: 'absolute', left: (W - 1100) / 2, top, width: 1100, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24, padding: '30px 54px', borderRadius: 32, border: `3px solid ${alpha(C.cyan, 0.55)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.08)} 0%, ${alpha(C.ink900, 0.96)} 70%)`, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      {children}
    </div>
  );
}
