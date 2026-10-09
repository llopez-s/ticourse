import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { SCRIPT } from '../data/echo';
import { SCREENS } from '../data/s01-hook';
import { ACTION, CHAIN, EXAM_LINE, EXTRAS, NAME, QUESTION, SAME_ROOT, VITRINA_CAPTION } from '../data/s05-vitrina';
import { TermName, EXAM_TEXT } from './parts/bits';
import { ThreeScreens } from './parts/Login';
import { PageBody, SourceView, Vitrina } from './parts/Page';
import { PortForm } from './parts/PortForm';
import { WebWindow } from './parts/WebWindow';
import { Stage, cardWindow, wordFrame } from './kit';

const S = 's05-vitrina';
const W = 1728;

/**
 * s05-vitrina «Dentro de una vitrina». `fix` asks «¿Y con el script, qué se hace?» over the page of s04 at half light
 * (RED MARROW's second message owns the top of the stage). The picture of why the defence goes in the server: the
 * browser only obeys the page (`browser-obeys`) and the server writes it, with somebody else's text inside
 * (`server-writes`). The same page, its text now encoded (`encoded`): the source shows `&lt;`/`&gt;` where the angle
 * brackets were and the script is on view as plain text; only at `vitrina` does the glass go up around it with its
 * lock («se lee, pero no se obedece»). Name OUTPUT ENCODING (`output-enc`); the lesson's complements small and grey
 * (`extras`) and the exam line (`exam-line`). The action (`action`): the three boxes and a line with owner and date;
 * the two images side by side, the box and the display case: «el dato en su sitio» (`same-root`).
 */
export function S05Vitrina(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => props.cue(id);
  const fixAt = at('fix');
  const obeysAt = at('browser-obeys');
  const writesAt = at('server-writes');
  const encodedAt = at('encoded');
  const vitrinaAt = at('vitrina');
  const outAt = at('output-enc');
  const extrasAt = at('extras');
  const examAt = at('exam-line');
  const actionAt = at('action');
  const sameAt = at('same-root');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- the question, over the page of s04 at half light; it clears before RED MARROW's card takes the top
  const msg = cardWindow(S, 'intercept') ?? [fixAt + 140, fixAt + 500];
  const qIn = progress(frame, fixAt - 4, 14);
  const qOut = progress(frame, msg[0] - 16, 12, EASE.inOut);
  const ctxIn = progress(frame, 6, 16);
  const ctxOut = progress(frame, obeysAt - 16, 14, EASE.inOut);

  // ---- phase A: the browser obeys the page, the server writes it
  const aIn = progress(frame, obeysAt - 14, 16);
  const aOut = progress(frame, encodedAt - 16, 14, EASE.inOut);
  const obeysW = progress(frame, obeysAt - 4, 16);
  const writesW = progress(frame, writesAt - 4, 16);
  const insideW = progress(frame, w('s05-02', 'texto') - 6, 14);

  // ---- phase B: the same page, encoded, in its case
  const bIn = progress(frame, encodedAt - 6, 18);
  const bOut = progress(frame, actionAt - 16, 14, EASE.inOut);
  const encodedW = progress(frame, w('s05-03', 'inofensivo') - 4, 22, EASE.inOut);
  const vitrinaW = progress(frame, vitrinaAt - 4, 26, EASE.inOut);
  const lockW = progress(frame, vitrinaAt + 14, 12);
  const captionW = progress(frame, w('s05-03', 'lee') - 8, 12);
  const nameW = progress(frame, outAt - 4, 16);
  const extrasW = progress(frame, extrasAt - 4, 14);
  const examW = progress(frame, examAt - 6, 16);

  // ---- phase C: the action, then the box and the case together
  const cIn = progress(frame, actionAt - 6, 16);
  const screensIn = [0, 1, 2].map((i) => progress(frame, actionAt - 4 + i * 6, 14));
  const screensOut = progress(frame, sameAt - 14, 14, EASE.inOut);
  const actionW = progress(frame, actionAt - 2, 16);
  const rootIn = progress(frame, sameAt - 6, 18);
  const rootLit = progress(frame, w('s05-05', 'casilla') - 6, 14);
  const rootLit2 = progress(frame, w('s05-05', 'vitrina') - 6, 14);
  const rootCaption = progress(frame, w('s05-05', 'dato') - 6, 14);

  return (
    <Stage>
      {/* ---------------- the question and the page of s04 ---------------- */}
      <div style={{ position: 'absolute', left: 0, top: 6, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 80, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, opacity: qIn * (1 - qOut), transform: `translateY(${(1 - qIn) * 14 - 12 * qOut}px)` }}>
        {QUESTION}
      </div>
      {ctxOut < 1 ? (
        <div style={{ position: 'absolute', left: 314, top: 300, opacity: ctxIn * (1 - ctxOut) * 0.5, filter: 'saturate(0.6)' }}>
          <WebWindow width={1100} height={250} title="Resultados de búsqueda">
            <PageBody encoded={0} vitrina={0} lock={0} pad={34} />
          </WebWindow>
        </div>
      ) : null}

      {/* ---------------- A: the browser obeys, the server writes ---------------- */}
      {aIn > 0.001 && aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: aIn * (1 - aOut) }}>
          <ChainPicture obeys={obeysW} writes={writesW} inside={insideW} />
        </div>
      ) : null}

      {/* ---------------- B: the same page, encoded, in its glass case ---------------- */}
      {bIn > 0.001 && bOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: bIn * (1 - bOut) }}>
          <div style={{ position: 'absolute', left: 0, top: 20 }}>
            <WebWindow width={1130} height={350} urlSize={30} url={<span style={{ color: C.text }}>{'/buscar?matricula='}</span>}>
              <PageBody encoded={encodedW} vitrina={vitrinaW} lock={lockW} pad={34} caption={VITRINA_CAPTION} captionW={captionW} />
            </WebWindow>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 388 }}>
            <SourceView width={1130} encoded={encodedW} lit={encodedW * (1 - progress(frame, vitrinaAt, 14))} />
          </div>
          <div style={{ position: 'absolute', left: 1190, top: 10, width: 538 }}>
            <TermName text={NAME.title} show={nameW} size={68} />
            <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: 32, fontWeight: 600, color: C.muted, lineHeight: 1.4, opacity: extrasW * 0.9, transform: `translateY(${(1 - extrasW) * 10}px)` }}>
              {EXTRAS.map((e) => (
                <div key={e}>{e}</div>
              ))}
            </div>
            <div
              style={{
                marginTop: 30,
                padding: '20px 24px 24px',
                borderRadius: 22,
                background: alpha(C.violet, 0.1),
                border: `2px solid ${alpha(C.violet, 0.65)}`,
                boxShadow: `0 0 ${Math.round(30 * examW)}px ${alpha(C.violet, 0.25 * examW)}`,
                fontFamily: FONT.sans,
                fontSize: 34,
                fontWeight: 750,
                lineHeight: 1.24,
                color: EXAM_TEXT,
                opacity: examW,
                transform: `translateY(${(1 - examW) * 12}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 24, fontWeight: 800, letterSpacing: 3, color: C.violet }}>
                <Icon name="mortarboard" size={26} color={C.violet} />
                EXAMEN
              </div>
              {EXAM_LINE}
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------- C: the action and the two images together ---------------- */}
      {cIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: cIn }}>
          {screensOut < 1 ? (
            <div style={{ position: 'absolute', left: 0, top: 20, opacity: 1 - screensOut }}>
              <ThreeScreens screens={SCREENS} show={screensIn} lit={[1, 1, 1]} dim={0} />
            </div>
          ) : null}
          {rootIn > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 470, opacity: rootIn }}>
              <div style={{ position: 'absolute', left: 90, top: 70, opacity: 0.45 + 0.55 * rootLit }}>
                <PortForm box={1} slip={1} ok={rootLit} scale={0.8} glow={0.5 * rootLit} />
              </div>
              <div style={{ position: 'absolute', left: 830, top: 150, opacity: rootLit2 }}>
                <Icon name="check" size={64} color={C.emerald} strokeWidth={2.6} />
              </div>
              <div style={{ position: 'absolute', left: 940, top: 96, opacity: 0.45 + 0.55 * rootLit2 }}>
                <Vitrina w={1} lock={1} pad={26}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 650, color: C.cyan, letterSpacing: -0.6, whiteSpace: 'pre' }}>{SCRIPT}</span>
                </Vitrina>
              </div>
              <div style={{ position: 'absolute', left: 0, top: 360, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 78, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, opacity: rootCaption, transform: `translateY(${(1 - rootCaption) * 12}px)` }}>
                <span style={{ color: C.emerald }}>{SAME_ROOT}</span>
              </div>
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: 0, top: 500, width: W, display: 'flex', justifyContent: 'center', opacity: actionW, transform: `translateY(${(1 - actionW) * 18}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '18px 36px 18px 28px', borderRadius: 28, background: alpha(C.cyan, 0.08), border: `3px solid ${alpha(C.cyan, 0.7)}`, boxShadow: `0 0 34px ${alpha(C.cyan, 0.2)}`, fontFamily: FONT.sans }}>
              <Icon name="flag" size={58} color={C.cyan} strokeWidth={2} />
              <div style={{ lineHeight: 1.18 }}>
                <div style={{ fontSize: 42, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{ACTION.what}</div>
                <div style={{ fontSize: 38, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
                  {ACTION.where} <span style={{ color: C.faint }}>·</span> <span style={{ color: C.cyanSoft, fontWeight: 800 }}>{ACTION.who}</span> <span style={{ color: C.faint }}>·</span>{' '}
                  <span style={{ fontFamily: FONT.mono, color: C.cyanSoft, fontWeight: 800 }}>{ACTION.when}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** server → the page (with somebody else's text inside) → browser: the browser only obeys what the page says. */
function ChainPicture({ obeys, writes, inside }: { obeys: number; writes: number; inside: number }) {
  const Y = 250;
  const NODE = { w: 380, h: 300 };
  const xs = [0, 674, 1348];
  const node = (x: number, label: string, content: ReactNode, show: number, tone: string) => (
    <div style={{ position: 'absolute', left: x, top: Y, width: NODE.w, height: NODE.h, boxSizing: 'border-box', borderRadius: 24, background: `linear-gradient(180deg, ${C.ink850}, ${C.ink900})`, border: `3px solid ${alpha(tone, 0.6)}`, boxShadow: `0 24px 50px ${alpha('#000000', 0.4)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: show, transform: `translateY(${(1 - show) * 12}px)` }}>
      {content}
      <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.textStrong }}>{label}</div>
    </div>
  );
  const arrow = (x0: number, label: string, show: number, tone: string) => (
    <div style={{ position: 'absolute', left: x0, top: Y + NODE.h / 2 - 44, width: xs[1] - xs[0] - NODE.w, textAlign: 'center', fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: tone, opacity: show }}>
      {label}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Icon name="arrowRight" size={64} color={tone} strokeWidth={2.4} />
      </div>
    </div>
  );
  return (
    <>
      {node(xs[0], CHAIN.server, <Icon name="server" size={120} color={C.sky} strokeWidth={1.4} />, writes, C.sky)}
      {node(
        xs[1],
        CHAIN.page,
        <div style={{ fontFamily: FONT.sans, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>Resultados para:</div>
          <div style={{ marginTop: 10, display: 'inline-block', padding: '6px 16px', borderRadius: 12, background: alpha(C.cyan, 0.12), border: `2px solid ${alpha(C.cyan, 0.6)}`, fontSize: 32, fontWeight: 700, color: C.cyan, opacity: inside, whiteSpace: 'nowrap' }}>{CHAIN.inside}</div>
        </div>,
        Math.max(obeys, writes),
        C.cyan,
      )}
      {node(xs[2], CHAIN.browser, <Icon name="globe" size={120} color={C.rose} strokeWidth={1.4} />, obeys, C.rose)}
      {arrow(xs[0] + NODE.w, CHAIN.writes, writes, C.sky)}
      {arrow(xs[1] + NODE.w, CHAIN.obeys, obeys, C.roseSoft)}
    </>
  );
}

