import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Binder } from './parts/Binder';
import { Dial } from './parts/Dial';
import { MAP_H, MAP_W, MapArt } from './parts/MapArt';
import { Bar, PAPER, Paper, Tag, Verdict } from './parts/paper';
import { Stage, wordFrame } from './kit';

const S = 's09-semilla';
const W = STAGE.width;

/** A few entries of the app's Glossary page, grouped by section (terms as in src/data/glossary.ts). */
const GROUPS = [
  { s: 'S1', items: [{ t: 'F3EAD', d: 'Find, Fix, Finish + Exploit, Analyze, Disseminate' }, { t: 'PIR', d: 'Priority Intelligence Requirement' }] },
  { s: 'S2', items: [{ t: 'Cyber Kill Chain', d: 'Romper un eslabón frustra el objetivo' }, { t: 'Diamond Model', d: '4 vértices: Adversary, Capability, Infrastructure, Victim' }] },
  { s: 'S4', items: [{ t: 'ACH', d: 'Analysis of Competing Hypotheses (Heuer)' }] },
] as const;

const STEPS: { text: string; icon: IconName | null; word: string }[] = [
  { text: 'duda', icon: null, word: 'Duda' },
  { text: 'índice', icon: 'file', word: 'índice' },
  { text: 'localizar', icon: 'search', word: 'localizar' },
  { text: 'decidir', icon: 'target', word: 'decidir' },
];

/**
 * s09-semilla «Sin partir de cero». `seed`: a mock of the app's Glossary page with the course terms
 * grouped by section (S1, S2, S4). `print`: the «Imprimir índice» button lights and a printed sheet
 * comes out with the columns término · definición breve · tus referencias, the last one empty and
 * dashed. `rehearse`: «el examen de práctica de la app» and, beside it, the dashed «prácticas de
 * GIAC · si tienes acceso», both «con tu índice a mano». `gesture`: four steps in a row (duda, índice,
 * localizar, decidir) and a stopwatch that runs down from 60 s to «segundos». `extension`: the index as
 * an arm's length of you (a person, an arm ending in the binder) against a new map, struck out.
 */
export function S09Semilla(props: SceneProps) {
  const frame = useCurrentFrame();
  const seed = props.cue('seed');
  const print = props.cue('print');
  const rehearse = props.cue('rehearse');
  const gesture = props.cue('gesture');
  const extension = props.cue('extension');

  const winIn = progress(frame, seed - 2, 18);
  const btn = progress(frame, wordFrame(S, 's09-02', 'botón') - 6, 14);
  const sheetAt = wordFrame(S, 's09-02', 'completas') - 6;
  const printOut = progress(frame, rehearse - 12, 14, EASE.inOut);

  const appAt = rehearse + 4;
  const giacAt = wordFrame(S, 's09-03', 'GIAC') - 8;
  const handAt = wordFrame(S, 's09-03', 'mano') - 8;
  const rehearseOut = progress(frame, gesture - 12, 14, EASE.inOut);

  const stepAt = STEPS.map((s) => wordFrame(S, 's09-04', s.word) - 8);
  const secAt = wordFrame(S, 's09-04', 'segundos') - 4;
  const run = progress(frame, stepAt[0], secAt - stepAt[0], EASE.inOut);
  const gestureOut = progress(frame, extension - 12, 14, EASE.inOut);

  const entry = (t: string, d: string, k: number) => (
    <div key={t} style={{ height: 70, boxSizing: 'border-box', padding: '6px 18px', borderRadius: 12, background: C.ink900, border: `2px solid ${C.ink700}`, marginBottom: 6, ...enter(frame, seed + 10 + k * 5, { distance: 12 }) }}>
      <div style={{ fontSize: 31, fontWeight: 750, color: C.cyanSoft, lineHeight: 1.1 }}>{t}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: C.muted, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden' }}>{d}</div>
    </div>
  );

  let k = 0;
  return (
    <Stage>
      {/* the Glossary page of the app, and the printed sheet */}
      {printOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - printOut, transform: `translateX(${-printOut * 30}px)`, fontFamily: FONT.sans }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 12,
              width: 980,
              height: 622,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              overflow: 'hidden',
              background: C.ink850,
              border: `2px solid ${C.ink700}`,
              boxShadow: `0 28px 60px ${alpha('#000000', 0.45)}`,
              opacity: winIn,
              transform: `translateY(${(1 - winIn) * 24}px)`,
            }}
          >
            <div style={{ height: 70, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', background: alpha(C.ink800, 0.95), borderBottom: `2px solid ${C.ink700}` }}>
              <Icon name="archive" size={36} color={C.cyan} />
              <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>Glosario · Índice</span>
              <span
                style={{
                  marginLeft: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 20px',
                  borderRadius: 12,
                  border: `3px solid ${alpha(C.emerald, 0.5 + 0.5 * btn)}`,
                  background: alpha(C.emerald, 0.08 + 0.2 * btn),
                  boxShadow: btn > 0.05 ? `0 0 ${Math.round(30 * btn)}px ${alpha(C.emerald, 0.5 * btn)}` : undefined,
                  fontSize: 30,
                  fontWeight: 800,
                  color: '#6ee7b7',
                  whiteSpace: 'nowrap',
                  transform: `scale(${1 + 0.06 * btn})`,
                }}
              >
                <Icon name="file" size={32} color="#6ee7b7" strokeWidth={2.2} />
                Imprimir índice
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '12px 22px' }}>
              {['Todas', 'S1', 'S2', 'S3', 'S4', 'S5'].map((p, i) => (
                <span key={p} style={{ padding: '2px 18px', borderRadius: 999, background: i === 0 ? C.cyan : C.ink800, color: i === 0 ? C.ink950 : C.muted, fontSize: 26, fontWeight: 800 }}>
                  {p}
                </span>
              ))}
            </div>
            <div style={{ padding: '0 22px' }}>
              {GROUPS.map((g) => (
                <div key={g.s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 36, fontSize: 26, fontWeight: 800, letterSpacing: 2, color: C.faint, ...enter(frame, seed + 6 + k * 5, { distance: 8 }) }}>
                    <span style={{ fontFamily: FONT.mono, color: C.cyan }}>{g.s}</span>
                    <span style={{ flex: 1, height: 2, background: C.ink700 }} />
                  </div>
                  {g.items.map((it) => entry(it.t, it.d, k++))}
                </div>
              ))}
            </div>
          </div>

          {/* the printed sheet */}
          {frame >= print - 6 ? (
            <div style={{ position: 'absolute', left: 1010, top: 60, ...enter(frame, print, { distance: 50, axis: 'x' }) }}>
              <Paper w={700} h={540} rotate={1.5} style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', fontSize: 26, fontWeight: 800, letterSpacing: 0.5, color: PAPER.soft, borderBottom: `3px solid ${PAPER.ink}`, paddingBottom: 10 }}>
                  <span style={{ width: 190 }}>término</span>
                  <span style={{ width: 260 }}>definición breve</span>
                  <span style={{ width: 200, color: PAPER.cyan }}>tus referencias</span>
                </div>
                {['F3EAD', 'PIR', 'Kill Chain', 'Diamond', 'ACH'].map((t, i) => (
                  <div key={t} style={{ height: 78, display: 'flex', alignItems: 'center', borderBottom: `2px solid ${alpha(PAPER.line, 0.7)}` }}>
                    <span style={{ width: 190, fontSize: 28, fontWeight: 800, color: PAPER.ink }}>{t}</span>
                    <span style={{ width: 260, display: 'grid', gap: 8 }}>
                      <Bar w={200} h={9} color={alpha(PAPER.soft, 0.5)} />
                      <Bar w={150 - (i % 2) * 30} h={9} color={alpha(PAPER.soft, 0.4)} />
                    </span>
                    <span style={{ width: 170, height: 50, borderRadius: 8, border: `3px dashed ${alpha(PAPER.cyan, 0.7)}`, boxSizing: 'border-box', opacity: progress(frame, sheetAt + i * 5, 10) }} />
                  </div>
                ))}
              </Paper>
              {frame >= sheetAt - 4 ? (
                <div style={{ position: 'absolute', left: 100, top: 566, ...enter(frame, sheetAt, { distance: 14 }) }}>
                  <Tag color={C.cyan} size={32} icon="link">
                    la completas tú
                  </Tag>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* rehearse */}
      {frame >= rehearse - 8 && rehearseOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - rehearseOut) * progress(frame, rehearse - 8, 12), fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 20, top: 200, width: 780, height: 260, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12)} 0%, ${alpha(C.ink900, 0.95)} 80%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, ...enter(frame, appAt, { distance: 30, axis: 'x' }) }}>
            <Icon name="mortarboard" size={88} color={C.cyan} strokeWidth={1.9} />
            <span style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, textAlign: 'center', lineHeight: 1.1 }}>
              el examen de práctica
              <br />
              de la app
            </span>
          </div>
          <div style={{ position: 'absolute', left: 928, top: 200, width: 780, height: 260, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px dashed ${alpha(C.sky, 0.85)}`, background: alpha(C.sky, 0.07), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, ...enter(frame, giacAt, { distance: 30, axis: 'x' }) }}>
            <Icon name="globe" size={88} color={C.sky} strokeWidth={1.9} />
            <span style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, textAlign: 'center', lineHeight: 1.1 }}>
              prácticas de GIAC
              <br />
              <span style={{ fontSize: 40, fontWeight: 700, color: '#7dd3fc' }}>si tienes acceso</span>
            </span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 500, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, handAt, { distance: 18 }) }}>
            <Tag color={C.emerald} size={46} icon="file">
              con tu índice a mano
            </Tag>
          </div>
        </div>
      ) : null}

      {/* the whole gesture */}
      {frame >= gesture - 8 && gestureOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - gestureOut) * progress(frame, gesture - 8, 12), fontFamily: FONT.sans }}>
          {STEPS.map((s, i) => {
            const e = enter(frame, stepAt[i], { distance: 30 });
            const hot = progress(frame, stepAt[i], 10);
            const x = i * (360 + 72);
            return (
              <div key={s.text}>
                <div style={{ position: 'absolute', left: x, top: 200, width: 360, height: 210, boxSizing: 'border-box', borderRadius: RADIUS.lg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: alpha(C.cyan, 0.06 + 0.08 * hot), border: `3px solid ${alpha(C.cyan, 0.35 + 0.55 * hot)}`, boxShadow: hot > 0.05 ? `0 0 ${Math.round(28 * hot)}px ${alpha(C.cyan, 0.25 * hot)}` : undefined, ...e }}>
                  {s.icon ? <Icon name={s.icon} size={78} color={C.cyan} strokeWidth={2} /> : <span style={{ fontSize: 88, fontWeight: 850, color: C.amber, lineHeight: 0.95 }}>?</span>}
                  <span style={{ fontSize: 52, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5 }}>{s.text}</span>
                </div>
                {i < STEPS.length - 1 ? (
                  <div style={{ position: 'absolute', left: x + 362, top: 282, width: 70, display: 'grid', placeItems: 'center', opacity: progress(frame, stepAt[i + 1] - 6, 10) }}>
                    <Icon name="arrowRight" size={56} color={C.cyanSoft} strokeWidth={2.6} />
                  </div>
                ) : null}
              </div>
            );
          })}
          {/* the stopwatch comes down to «segundos» */}
          {frame >= stepAt[0] ? (
            <div style={{ position: 'absolute', left: 430, top: 440, display: 'flex', alignItems: 'center', gap: 44, opacity: progress(frame, stepAt[0], 12) }}>
              <Dial size={150} sweep={1 - run * 0.93} hand={1 - run * 0.93} color={C.emerald} stopwatch glow={0.4} />
              <div style={{ fontSize: 96, fontWeight: 850, letterSpacing: -2, color: frame >= secAt ? C.emerald : C.textStrong, lineHeight: 1, whiteSpace: 'nowrap', textShadow: frame >= secAt ? `0 0 34px ${alpha(C.emerald, 0.45)}` : undefined }}>
                {frame >= secAt ? 'segundos' : `${Math.max(9, Math.round(60 - 51 * run))} s`}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* extension of you vs a new map */}
      {frame >= extension - 8 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: progress(frame, extension - 8, 14), fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 20, top: 214, ...enter(frame, extension, { distance: 30, axis: 'x' }) }}>
            <div style={{ position: 'relative', width: 760, height: 330, transform: 'scale(1.2)', transformOrigin: 'left top' }}>
              <div style={{ position: 'absolute', left: 0, top: 36, width: 200, height: 200, borderRadius: 100, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.1), border: `4px solid ${alpha(C.cyan, 0.75)}` }}>
                <Icon name="user" size={140} color={C.cyan} strokeWidth={1.8} />
              </div>
              <svg width={760} height={330} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
                <path d="M186 150 C 280 110, 340 120, 410 150" stroke={C.cyanDeep} strokeWidth={34} strokeLinecap="round" fill="none" />
                <path d="M186 150 C 280 110, 340 120, 410 150" stroke={C.cyan} strokeWidth={22} strokeLinecap="round" fill="none" strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - progress(frame, extension + 6, 30, EASE.inOut)} />
                <circle cx={424} cy={152} r={26} fill={C.cyan} opacity={progress(frame, extension + 30, 10)} />
              </svg>
              <div style={{ position: 'absolute', left: 408, top: 0, opacity: progress(frame, extension + 20, 14) }}>
                <Binder w={190} glow={0.6} tabs={progress(frame, extension + 30, 20)} />
              </div>
              <div style={{ position: 'absolute', left: 0, top: 262, display: 'flex', alignItems: 'center', gap: 14, ...enter(frame, extension + 26, { distance: 12 }) }}>
                <Verdict ok size={50} />
                <span style={{ fontSize: 42, fontWeight: 850, color: C.textStrong }}>extensión de tu memoria</span>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 960, top: 222, ...enter(frame, wordFrame(S, 's09-05', 'no') - 8, { distance: 30, axis: 'x' }) }}>
            <div style={{ transform: 'scale(0.9)', transformOrigin: 'left top', width: MAP_W * 0.9, height: MAP_H * 0.9 }}>
              <MapArt kind="foreign" cross={progress(frame, wordFrame(S, 's09-05', 'nuevo') - 4, 22, EASE.inOut)} />
            </div>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <Verdict ok={false} size={50} />
              <span style={{ fontSize: 42, fontWeight: 850, color: C.muted }}>un mapa nuevo</span>
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
