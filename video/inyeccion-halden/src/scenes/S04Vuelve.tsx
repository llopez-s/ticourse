import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { PLATE, SCRIPT, URL_PATH } from '../data/echo';
import { ANSWERS, BOX2, BOX3, LIST, NOTES, REFLECTED, STORED, XSS } from '../data/s04-vuelve';
import { Attr, Pill, TermName } from './parts/bits';
import { PageBody, SourceView } from './parts/Page';
import { RUN_SIZE, RunDiagram } from './parts/Run';
import { Cartel, Person, Tablon } from './parts/Signs';
import { WebWindow } from './parts/WebWindow';
import { Stage, cardWindow, wordFrame } from './kit';

const S = 's04-vuelve';
const W = 1728;

function typed(frame: number, start: number, n: number, rate: number): number {
  return Math.max(0, Math.min(n, Math.floor((frame - start) / rate)));
}

/** The numbered header of a box («2  el buscador de citas»). */
function BoxTag({ n, text, show }: { n: string; text: string; show: number }) {
  return (
    <div style={{ opacity: show, transform: `translateY(${(1 - show) * 12}px)`, display: 'inline-block' }}>
      <Pill tone={C.cyan} size={42} style={{ paddingLeft: 12 }}>
        <span style={{ width: 46, height: 46, borderRadius: 23, display: 'grid', placeItems: 'center', background: C.cyan, color: C.ink950, fontSize: 32, fontWeight: 850 }}>{n}</span>
        {text}
      </Pill>
    </div>
  );
}

/**
 * s04-vuelve «Un texto que vuelve». Phase A, the second box: the search address with a script instead of the plate
 * (`link`), the page repeating it (`echo`: «Resultados para:» and the page's source, the text untouched), then the
 * pause, with the page still and two buttons, «servidor» and «navegador» (`question`: no label answers it). Phase B:
 * the answer lights (`browser`), the server only returned text, the browser of whoever followed the link runs it, and
 * its session cookie «podría» leave (`cookie`: a dashed road and the word, never a completed theft); the names arrive
 * with their words, CROSS-SITE SCRIPTING (`xss`) and REFLECTED (`reflected`: three lines, one per sentence, and the
 * notice sign that repeats what you ask). Phase C, the third box (`notes`): the same script goes into the observations
 * and is saved with the appointment (`saved`); the day's list, labelled «simulación · en la copia de pruebas», will be
 * opened by the gate staff, silhouettes whose browsers would run it (`opens`: dashed, conditional). Phase D: STORED
 * (`stored`) on the notice board where what one person pins is read by everyone (`board`), beside the sign.
 */
export function S04Vuelve(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (id: string) => props.cue(id);
  const searchAt = at('search');
  const linkAt = at('link');
  const echoAt = at('echo');
  const questionAt = at('question');
  const browserAt = at('browser');
  const cookieAt = at('cookie');
  const xssAt = at('xss');
  const reflectedAt = at('reflected');
  const notesAt = at('notes');
  const savedAt = at('saved');
  const opensAt = at('opens');
  const storedAt = at('stored');
  const boardAt = at('board');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const think = cardWindow(S, 'think') ?? [questionAt + 110, questionAt + 240];

  // ====================== phase A ======================
  const tagA = progress(frame, searchAt - 4, 14) * (1 - progress(frame, think[0] - 20, 12, EASE.inOut));
  const aIn = progress(frame, searchAt - 2, 16);
  const aOut = progress(frame, browserAt + 26, 16, EASE.inOut);
  const plateN = frame < linkAt - 8 ? typed(frame, searchAt + 16, PLATE.length, 3) : 0;
  const scriptN = typed(frame, linkAt, SCRIPT.length, 1.5);
  const resultsIn = progress(frame, echoAt - 4, 14);
  const sourceIn = progress(frame, echoAt + 4, 18);
  const sourceLit = progress(frame, w('s04-01', 'repite') - 6, 12) * (1 - progress(frame, questionAt, 14));
  const btnIn = progress(frame, questionAt - 2, 14);
  const lit = progress(frame, browserAt - 2, 12);
  const btnOut = progress(frame, browserAt + 70, 14);

  // ====================== phase B ======================
  const bIn = progress(frame, w('s04-03', 'servidor') - 14, 16);
  const bOut = progress(frame, notesAt - 22, 14, EASE.inOut);
  const send = progress(frame, w('s04-03', 'servidor') - 4, 36, EASE.inOut);
  const bolt = progress(frame, w('s04-03', 'ejecuta') - 6, 14);
  const person = progress(frame, w('s04-03', 'pulsó') - 8, 12);
  const cookie = progress(frame, cookieAt - 2, 90, EASE.inOut);
  const maybe = progress(frame, w('s04-03', 'podría') - 8, 12);
  const shrink = progress(frame, reflectedAt - 8, 22, EASE.inOut);
  const runScale = mix(1, 0.62, shrink);
  const xssW = progress(frame, xssAt - 4, 16);
  const abbrW = progress(frame, w('s04-04', 'XSS') - 6, 12);
  const reflW = progress(frame, reflectedAt - 4, 16);
  const cartelW = progress(frame, w('s04-04', 'cartel') - 8, 14);

  // ====================== phase C ======================
  const tagC = progress(frame, notesAt - 4, 14);
  const cIn = progress(frame, notesAt - 2, 16);
  const c1Out = progress(frame, opensAt - 18, 14, EASE.inOut);
  const cOut = progress(frame, storedAt - 14, 14, EASE.inOut);
  const noteN = typed(frame, savedAt + 4, SCRIPT.length, 0.9);
  const savedW = progress(frame, w('s04-06', 'guarda') - 8, 16);
  const listIn = progress(frame, opensAt - 12, 16);
  const simW = progress(frame, opensAt - 16, 14);
  const staffAt = [opensAt - 2, opensAt + 24, opensAt + 48];
  const boltsW = progress(frame, w('s04-07', 'ejecutaría') - 8, 14);
  const dayW = progress(frame, w('s04-07', 'cada') - 4, 12);

  // ====================== phase D ======================
  const dIn = progress(frame, storedAt - 6, 16);
  const storedW = progress(frame, storedAt - 4, 16);
  const hot = progress(frame, w('s04-08', 'guardado') - 8, 16);
  const readers = progress(frame, w('s04-08', 'salta') - 6, 16);
  const slide = progress(frame, boardAt - 6, 26, EASE.inOut);
  const refD = progress(frame, boardAt - 2, 18);
  const colX = mix(474, 948, slide);

  return (
    <Stage>
      {/* ======================= phase A: the search box ======================= */}
      {aIn > 0.001 && aOut < 1 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <BoxTag n={BOX2.n} text={BOX2.text} show={tagA} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 224, opacity: aIn * (1 - aOut), transform: `translateY(${(1 - aIn) * 18}px)` }}>
            <WebWindow
              width={W}
              height={332}
              urlSize={34}
              url={
                <>
                  <span style={{ color: C.text }}>{URL_PATH}</span>
                  <span style={{ color: C.cyan }}>{frame < linkAt - 8 ? PLATE.slice(0, plateN) : SCRIPT.slice(0, scriptN)}</span>
                </>
              }
            >
              {resultsIn < 0.5 ? (
                <div style={{ position: 'absolute', left: 34, top: 24, opacity: 1 - resultsIn, fontFamily: FONT.sans }}>
                  <div style={{ fontSize: 44, fontWeight: 800, color: C.textStrong }}>Buscar cita</div>
                  <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 22 }}>
                    <div style={{ width: 560, height: 70, boxSizing: 'border-box', borderRadius: 14, padding: '0 20px', display: 'flex', alignItems: 'center', background: C.ink950, border: `3px solid ${alpha(C.cyan, 0.6)}`, fontFamily: FONT.mono, fontSize: 36, fontWeight: 650, color: C.cyan }}>
                      {frame < linkAt - 8 ? PLATE.slice(0, plateN) : null}
                    </div>
                    <div style={{ height: 70, padding: '0 30px', borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.14), border: `2px solid ${alpha(C.cyan, 0.5)}`, fontSize: 34, fontWeight: 800, color: C.cyanSoft }}>Buscar</div>
                  </div>
                </div>
              ) : null}
              {resultsIn > 0.001 ? (
                <div style={{ position: 'absolute', left: 0, top: 0, width: 780, height: 280, opacity: resultsIn }}>
                  <PageBody encoded={0} vitrina={0} lock={0} pad={34} />
                </div>
              ) : null}
              {sourceIn > 0.001 ? (
                <div style={{ position: 'absolute', left: W - 34 - 880, top: 24, opacity: sourceIn, transform: `translateX(${(1 - sourceIn) * 40}px)` }}>
                  <SourceView width={880} lit={sourceLit} />
                </div>
              ) : null}
            </WebWindow>
          </div>
          {/* the pause: two buttons, neither lit; the answer lights on `browser` */}
          {btnIn > 0.001 && btnOut < 1 ? (
            <div style={{ position: 'absolute', left: 0, top: 580, width: W, display: 'flex', justifyContent: 'center', gap: 44, opacity: btnIn * (1 - btnOut) }}>
              {ANSWERS.map((a) => {
                const right = a === 'navegador';
                const k = right ? lit : 0;
                const dim = right ? 0 : 0.55 * lit;
                return (
                  <Pill key={a} tone={right && k > 0.02 ? C.emerald : C.sky} size={44} solid={right && k > 0.5} icon={right && k > 0.5 ? 'check' : undefined} style={{ opacity: 1 - dim, minWidth: 300, justifyContent: 'center' }}>
                    {a}
                  </Pill>
                );
              })}
            </div>
          ) : null}
        </>
      ) : null}

      {/* ======================= phase B: whose browser runs it ======================= */}
      {bIn > 0.001 && bOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: bIn * (1 - bOut) }}>
          {xssW > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
              <TermName text={XSS.title} show={xssW} size={64} />
              <Pill tone={C.violet} size={50} show={abbrW} style={{ color: '#c4b5fd', background: alpha(C.violet, 0.14) }}>
                {XSS.abbr}
              </Pill>
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: 0, top: 150, width: RUN_SIZE.w, height: RUN_SIZE.h, transform: `scale(${runScale})`, transformOrigin: '0 0', opacity: 1 - 0.45 * shrink }}>
            <RunDiagram show={1} send={send} bolt={bolt} cookie={cookie} maybe={maybe} person={person} frame={frame} fps={fps} />
          </div>
          {reflW > 0.001 ? (
            <div style={{ position: 'absolute', left: 1010, top: 138, width: 718, opacity: reflW, transform: `translateX(${(1 - reflW) * 36}px)` }}>
              <TermName text={REFLECTED.title} show={1} size={68} />
              <div style={{ marginTop: 18, width: 380, fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: C.text, opacity: cartelW }}>{REFLECTED.cartel}</div>
              <div style={{ position: 'absolute', left: 410, top: -8 }}>
                <Cartel width={308} show={cartelW} />
              </div>
              <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {REFLECTED.attrs.map((a) => (
                  <Attr key={a.text} icon={a.icon} text={a.text} show={progress(frame, w(a.seg, a.word) - 6, 12)} tone={C.cyan} size={38} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ======================= phase C: the third box, saved, opened by others ======================= */}
      {cIn > 0.001 && cOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: cIn * (1 - cOut) }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <BoxTag n={BOX3.n} text={BOX3.text} show={tagC} />
          </div>
          {c1Out < 1 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - c1Out }}>
              <div style={{ position: 'absolute', left: 0, top: 96 }}>
                <WebWindow width={860} height={420} title="Observaciones">
                  <div style={{ position: 'absolute', left: 30, top: 18, fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.muted, lineHeight: 1.2 }}>
                    {NOTES.label[0]}
                    <br />
                    {NOTES.label[1]}
                  </div>
                  <div style={{ position: 'absolute', left: 30, top: 108, width: 800, height: 150, boxSizing: 'border-box', borderRadius: 14, padding: '16px 16px', background: C.ink950, border: `3px solid ${alpha(C.cyan, 0.65)}`, fontFamily: FONT.mono, fontSize: 32, letterSpacing: -0.6, fontWeight: 600, color: C.cyan, whiteSpace: 'pre' }}>
                    {SCRIPT.slice(0, noteN)}
                  </div>
                  <div style={{ position: 'absolute', left: 30, top: 282, height: 62, padding: '0 34px', display: 'grid', placeItems: 'center', borderRadius: 14, background: alpha(C.cyan, 0.14), border: `2px solid ${alpha(C.cyan, 0.5)}`, fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.cyanSoft }}>Guardar</div>
                </WebWindow>
              </div>
              {savedW > 0.001 ? (
                <>
                  <div style={{ position: 'absolute', left: 862, top: 270, opacity: savedW }}>
                    <Icon name="arrowRight" size={46} color={C.muted} strokeWidth={2.4} />
                  </div>
                  <div style={{ position: 'absolute', left: 910, top: 96, width: 818, opacity: savedW, transform: `translateX(${(1 - savedW) * -40}px)` }}>
                    <RecordCard />
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
          {listIn > 0.001 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: listIn }}>
              <div style={{ position: 'absolute', left: 0, top: 84, opacity: simW }}>
                <Pill tone={C.amber} size={34} icon="alert">
                  {NOTES.sim}
                </Pill>
              </div>
              <div style={{ position: 'absolute', left: 0, top: 172 }}>
                <ListPanel width={1100} />
              </div>
              <div style={{ position: 'absolute', left: 1150, top: 160, width: 578, fontFamily: FONT.sans }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: C.textStrong, opacity: progress(frame, w('s04-07', 'personal') - 8, 12), textAlign: 'center' }}>{NOTES.staff}</div>
                <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between' }}>
                  {staffAt.map((a, i) => (
                    <div key={i} style={{ position: 'relative', opacity: progress(frame, a, 14), transform: `translateY(${(1 - progress(frame, a, 14)) * 16}px)` }}>
                      <Person size={150} tone={C.sky} />
                      <div style={{ position: 'absolute', right: -6, top: -22, opacity: boltsW }}>
                        <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.2 3.2">
                          <path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5l1-8Z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 22, textAlign: 'center', fontSize: 40, fontWeight: 750, color: C.muted, opacity: dayW }}>cada día</div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ======================= phase D: the notice board ======================= */}
      {dIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: dIn }}>
          {/* the sign that repeats what you ask */}
          {refD > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 780, opacity: refD }}>
              <TermName text={REFLECTED.title} show={1} size={64} align="center" style={{ width: 780 }} />
              <div style={{ position: 'absolute', left: 90, top: 118 }}>
                <Cartel width={600} show={refD} />
              </div>
              <div style={{ position: 'absolute', left: 0, top: 520, width: 780, textAlign: 'center', fontFamily: FONT.sans, fontSize: 38, fontWeight: 700, color: C.text }}>{REFLECTED.cartel}</div>
            </div>
          ) : null}
          {/* the board where what one person pins is read by all */}
          <div style={{ position: 'absolute', left: colX, top: 0, width: 780 }}>
            <TermName text={STORED.title} show={storedW} size={64} align="center" style={{ width: 780 }} />
            <div style={{ position: 'absolute', left: 90, top: 118 }}>
              <Tablon width={600} hot={hot} readers={readers} show={storedW} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 540, width: 780, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              {STORED.attrs.map((a) => (
                <Attr key={a.text} icon={a.icon} text={a.text} show={progress(frame, w(a.seg, a.word) - 6, 12)} tone={C.cyan} size={36} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** The saved appointment (s04-06 «se guarda con la cita»): plate and observations, the script among them. */
function RecordCard() {
  return (
    <div style={{ borderRadius: 24, overflow: 'hidden', background: `linear-gradient(180deg, ${C.ink850}, ${C.ink900})`, border: `2px solid ${alpha(C.cyan, 0.5)}`, boxShadow: `0 24px 50px ${alpha('#000000', 0.4)}`, fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 70, padding: '0 28px', background: alpha(C.ink800, 0.95), borderBottom: `2px solid ${C.ink700}`, fontSize: 36, fontWeight: 800, color: C.textStrong }}>
        <Icon name="database" size={38} color={C.cyan} />
        {NOTES.saved}
      </div>
      <div style={{ padding: '22px 24px 26px' }}>
        <div style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>{NOTES.plate}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 700, color: C.textStrong, marginBottom: 20 }}>{PLATE}</div>
        <div style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>{NOTES.obs}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 32, letterSpacing: -0.6, fontWeight: 600, color: C.cyan, whiteSpace: 'pre' }}>{SCRIPT}</div>
      </div>
    </div>
  );
}

/** The day's list of appointments, the saved one among them. */
function ListPanel({ width }: { width: number }) {
  return (
    <div style={{ width, borderRadius: 24, overflow: 'hidden', background: `linear-gradient(180deg, ${C.ink850}, ${C.ink900})`, border: `2px solid ${C.ink700}`, boxShadow: `0 24px 50px ${alpha('#000000', 0.4)}`, fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 70, padding: '0 28px', background: alpha(C.ink800, 0.95), borderBottom: `2px solid ${C.ink700}`, fontSize: 36, fontWeight: 800, color: C.textStrong }}>
        <Icon name="file" size={38} color={C.cyan} />
        {NOTES.list}
      </div>
      {LIST.map((r, i) => (
        <div key={r.plate} style={{ display: 'flex', alignItems: 'center', gap: 30, height: 72, padding: '0 28px', borderBottom: i < LIST.length - 1 ? `1px solid ${C.ink700}` : undefined, background: r.note ? alpha(C.cyan, 0.08) : undefined, fontFamily: FONT.mono, fontSize: 32, fontWeight: 600 }}>
          <span style={{ width: 200, color: C.textStrong }}>{r.plate}</span>
          {r.note ? <span style={{ color: C.cyan, letterSpacing: -0.6, whiteSpace: 'pre' }}>{SCRIPT}</span> : <span style={{ color: C.faint }}>—</span>}
        </div>
      ))}
    </div>
  );
}
