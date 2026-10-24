import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { PagePile } from './parts/Book';
import { TAB_COLORS } from './parts/Binder';
import { MAP_H, MAP_W, MapArt } from './parts/MapArt';
import { Dial } from './parts/Dial';
import { Bar, IndexLine, PAPER, Paper, Tag, Verdict } from './parts/paper';
import { Stage, wordFrame } from './kit';

const S = 's08-mientras';
const W = STAGE.width;
const MAP_TOP = 214;

const STEPS = [
  { n: 1, text: 'apuntar términos y dónde viven' },
  { n: 2, text: 'orden alfabético + micronota de una línea' },
  { n: 3, text: 'un color por sección' },
] as const;
const STEP_W = 800;
const STEP_H = 124;
const STEP_X = [0, 84, 168] as const;
const STEP_Y = [506, 366, 226] as const;

/**
 * s08-mientras «Hazlo mientras estudias». Under the intercepted message (top band kept clear) two
 * maps: `reply-c` — a city you do not know, no names, struck out in rose as the voice says «ciudad
 * que no conoces»; `map` — your own neighbourhood with streets you know (course topics) and the
 * little checks of «cada entrada te la has ganado». `pass1`–`pass3`: a three-step staircase,
 * «apuntar términos y dónde viven», «orden alfabético + micronota de una línea», «un color por
 * sección» (the last one with section tabs). `bind`: loose sheets get rings and a padlock,
 * «imprime y encuaderna». `study`: «pasadas 1 y 2 = estudio» brackets the first two steps.
 * `tlp`: one entry of the lesson, TLP:AMBER+STRICT · solo tu organización, sin clientes · S3M4,
 * as a note that is worth it. The exam card draws outside the stage.
 */
export function S08Mientras(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyC = props.cue('reply-c');
  const map = props.cue('map');
  const pass = [props.cue('pass1'), props.cue('pass2'), props.cue('pass3')];
  const bind = props.cue('bind');
  const study = props.cue('study');
  const tlp = props.cue('tlp');

  const cityAt = Math.max(replyC, wordFrame(S, 's08-01', 'ciudad') - 8);
  const crossAt = wordFrame(S, 's08-01', 'conoces') - 4;
  const gainedAt = wordFrame(S, 's08-02', 'ganado') - 20;
  const mapsOut = progress(frame, pass[0] - 14, 16, EASE.inOut);
  const hastyOut = progress(frame, cityAt - 4, 14, EASE.inOut);

  const stairsOut = progress(frame, tlp - 14, 16, EASE.inOut);
  const ringsAt = wordFrame(S, 's08-04', 'encuadernas') - 10;

  const noteIn = progress(frame, tlp - 4, 16);

  return (
    <Stage>
      {/* the hasty list the message asks for: a sheet filling up fast against the clock */}
      {frame < cityAt + 12 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - hastyOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 330, top: 232, ...enter(frame, 4, { distance: 20 }) }}>
            <Paper w={560} h={380} rotate={-3} style={{ padding: '22px 30px' }}>
              <div style={{ fontSize: 42, fontWeight: 850, color: PAPER.ink, letterSpacing: -0.5 }}>una lista</div>
              <div style={{ marginTop: 16, display: 'grid', gap: 18 }}>
                {[420, 360, 470, 300, 440, 380, 330].map((w, i) => (
                  <Bar key={i} w={w * progress(frame, 14 + i * 9, 9, EASE.linear)} h={12} color={alpha(PAPER.soft, 0.6)} />
                ))}
              </div>
            </Paper>
          </div>
          <div style={{ position: 'absolute', left: 1000, top: 240, ...enter(frame, 10, { distance: 20, axis: 'x' }) }}>
            <Dial size={230} sweep={((frame * 0.011) % 1) * 0.999} hand={(frame * 0.011) % 1} color={C.amber} glow={0.3} />
          </div>
          <div style={{ position: 'absolute', left: 990, top: 520, ...enter(frame, 22, { distance: 14 }) }}>
            <Tag color={C.amber} size={40} icon="clock">
              a la carrera
            </Tag>
          </div>
        </div>
      ) : null}

      {/* two maps */}
      {mapsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - mapsOut, transform: `translateY(${-mapsOut * 20}px)` }}>
          {frame >= cityAt - 4 ? (
            <div style={{ position: 'absolute', left: 40, top: MAP_TOP, ...enter(frame, cityAt, { distance: 26 }) }}>
              <MapArt kind="foreign" cross={progress(frame, crossAt, 22, EASE.inOut)} />
              <div style={{ position: 'absolute', left: 0, top: MAP_H + 16, width: MAP_W, display: 'flex', justifyContent: 'center' }}>
                <Tag color={C.muted} size={36}>
                  una ciudad que no conoces
                </Tag>
              </div>
            </div>
          ) : null}
          {frame >= map - 4 ? (
            <div style={{ position: 'absolute', left: W - MAP_W - 40, top: MAP_TOP, ...enter(frame, map, { distance: 26 }) }}>
              <MapArt kind="home" lit={progress(frame, map + 6, 30)} pins={progress(frame, gainedAt, 40)} />
              <div style={{ position: 'absolute', left: 0, top: MAP_H + 16, width: MAP_W, display: 'flex', justifyContent: 'center' }}>
                <Tag color={C.cyan} size={36} solid>
                  tu propio barrio
                </Tag>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the staircase, the printed binder */}
      {frame >= pass[0] - 14 && stairsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - stairsOut, fontFamily: FONT.sans }}>
          {STEPS.map((s, i) => {
            const e = enter(frame, pass[i] - 6, { distance: 34 });
            const hot = progress(frame, pass[i] - 6, 10) * (1 - progress(frame, (pass[i + 1] ?? bind) - 4, 14) * 0.45);
            const isLast = i === 2;
            return (
              <div key={s.n} style={{ position: 'absolute', left: STEP_X[i], top: STEP_Y[i], width: STEP_W, height: 640 - STEP_Y[i], ...e }}>
                {/* the riser under the step */}
                <div style={{ position: 'absolute', left: 0, top: STEP_H - 4, width: STEP_W, bottom: 0, borderRadius: '0 0 14px 14px', background: `linear-gradient(180deg, ${alpha(C.ink700, 0.55)} 0%, ${alpha(C.ink800, 0.2)} 100%)`, borderLeft: `2px solid ${alpha(C.ink600, 0.6)}`, borderRight: `2px solid ${alpha(C.ink600, 0.6)}` }} />
                <div
                  style={{
                    position: 'relative',
                    width: STEP_W,
                    height: STEP_H,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    padding: '0 30px 0 22px',
                    borderRadius: RADIUS.lg,
                    background: `linear-gradient(180deg, ${alpha(C.cyan, 0.06 + 0.1 * hot)} 0%, ${alpha(C.ink900, 0.97)} 80%)`,
                    border: `3px solid ${alpha(C.cyan, 0.35 + 0.5 * hot)}`,
                    boxShadow: hot > 0.05 ? `0 0 ${Math.round(30 * hot)}px ${alpha(C.cyan, 0.25 * hot)}` : `0 16px 34px ${alpha('#000000', 0.4)}`,
                  }}
                >
                  <div style={{ width: 70, height: 70, borderRadius: 35, display: 'grid', placeItems: 'center', background: hot > 0.5 ? C.cyan : alpha(C.cyan, 0.15), border: `3px solid ${alpha(C.cyan, 0.8)}`, fontSize: 42, fontWeight: 850, color: hot > 0.5 ? C.ink950 : C.cyanSoft, flexShrink: 0 }}>{s.n}</div>
                  <span style={{ fontSize: 40, fontWeight: 760, lineHeight: 1.12, color: C.textStrong }}>{s.text}</span>
                  {isLast ? (
                    <span style={{ position: 'absolute', right: 24, top: 14, display: 'flex', gap: 6 }}>
                      {TAB_COLORS.map((c, k) => (
                        <span key={c} style={{ width: 20, height: 38 + (k % 2) * 8, borderRadius: 5, background: c, opacity: progress(frame, pass[2] + 6 + k * 5, 10) }} />
                      ))}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}

          {/* «pasadas 1 y 2 = estudio» */}
          {frame >= study - 4 ? (
            <div style={{ position: 'absolute', left: 920, top: STEP_Y[1], height: STEP_Y[0] + STEP_H - STEP_Y[1], display: 'flex', alignItems: 'center', gap: 18, ...enter(frame, study, { distance: 24, axis: 'x' }) }}>
              <div style={{ width: 18, height: '100%', borderRadius: '0 12px 12px 0', border: `6px solid ${C.emerald}`, borderLeft: 'none', boxSizing: 'border-box' }} />
              <div style={{ fontSize: 44, fontWeight: 850, lineHeight: 1.12, color: C.emerald }}>
                pasadas 1 y 2
                <br />
                <span style={{ color: C.textStrong }}>= estudio</span>
              </div>
            </div>
          ) : null}

          {/* loose sheets, rings, padlock */}
          <div style={{ position: 'absolute', left: 1360, top: 190, ...enter(frame, pass[0], { distance: 24, axis: 'x' }) }}>
            <PagePile w={250} n={10} />
            {frame >= ringsAt ? (
              <>
                {[0.14, 0.4, 0.66].map((t, k) => {
                  const p = progress(frame, ringsAt + k * 6, 10, EASE.out);
                  return (
                    <div key={t} style={{ position: 'absolute', left: 6 - (1 - p) * 40, top: 250 * 1.18 * t + 10, width: 36, height: 36, borderRadius: 18, border: '7px solid #cbd5e1', boxSizing: 'border-box', background: alpha('#0f172a', 0.5), opacity: p, boxShadow: `0 4px 8px ${alpha('#000000', 0.5)}` }} />
                  );
                })}
                <div style={{ position: 'absolute', left: 190, top: 250 * 1.18 - 20, width: 112, height: 112, borderRadius: 56, display: 'grid', placeItems: 'center', background: C.emerald, boxShadow: `0 0 36px ${alpha(C.emerald, 0.5)}`, opacity: progress(frame, bind, 10), transform: `scale(${0.6 + 0.4 * progress(frame, bind, 12, EASE.out)})` }}>
                  <Icon name="lock" size={64} color={C.ink950} strokeWidth={2.6} />
                </div>
              </>
            ) : null}
          </div>
          {frame >= bind - 4 ? (
            <div style={{ position: 'absolute', left: 1280, top: 592, ...enter(frame, bind, { distance: 18 }) }}>
              <Tag color={C.emerald} size={36} solid>
                imprime y encuaderna
              </Tag>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the note that is worth it */}
      {noteIn > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: noteIn, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 190, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, transform: `translateY(${(1 - noteIn) * 20}px)` }}>
            <Verdict ok size={64} />
            <span style={{ fontSize: 54, fontWeight: 850, color: C.emerald, letterSpacing: -1 }}>una nota que vale</span>
          </div>
          <div style={{ position: 'absolute', left: 44, top: 330, transform: `translateY(${(1 - noteIn) * 30}px)` }}>
            <IndexLine term="TLP:AMBER+STRICT" note="solo tu organización, sin clientes" where="S3M4" width={1640} size={46} state="good" cols={[0.31, 0.53, 0.16]} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
