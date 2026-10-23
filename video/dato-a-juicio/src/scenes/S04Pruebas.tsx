import { useCurrentFrame } from 'remotion';
import type { CSSProperties, ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { IP } from '../data/canon';
import { IpChip } from './parts/Stairs';
import { Stage, wordFrame } from './kit';

const S = 's04-pruebas';
const W = STAGE.width;

const CARD = { w: 828, h: 290, top: 372 } as const;

/**
 * s04-pruebas «Pruebas a medias». Under the think prompt (top band clear until the answer) the IP's card — the same IP and
 * what the course already knows of it, nothing new — sits above two sentences for the CISO, side by side, NEITHER
 * highlighted (`hyp`). On `answer` the second lights up and the first steps back: «promete una certeza que no tienes» /
 * «dice lo que sabes de verdad». On `words` «probablemente» is picked out as «lenguaje estimativo» and, apart, «y dices
 * cuánto te fías de tu juicio». On `blind` they give way to the board's choice: «callarte» struck, then two columns,
 * «decide con tu juicio» against «decide a ciegas».
 */
export function S04Pruebas(props: SceneProps) {
  const frame = useCurrentFrame();
  const hyp = props.cue('hyp');
  const answer = props.cue('answer');
  const words = props.cue('words');
  const blind = props.cue('blind');

  // ---- Sentences enter on their words.
  const fichaAt = hyp + 2;
  const aAt = wordFrame(S, 's04-01', 'atacante', 0) - 8;
  const bAt = wordFrame(S, 's04-01', 'probablemente', 0) - 8;
  const labelAt = wordFrame(S, 's04-01', 'formas') - 8;

  // ---- Answer.
  const secondAt = Math.max(answer, wordFrame(S, 's04-02', 'segunda') - 6);
  const promiseAt = wordFrame(S, 's04-02', 'promete') - 6;
  const trueAt = wordFrame(S, 's04-02', 'dice') - 6;
  const lit = progress(frame, secondAt, 14);
  const aOut = progress(frame, secondAt, 16);

  // ---- Words.
  const estAt = wordFrame(S, 's04-03', 'estimativo') - 10;
  const trustAt = wordFrame(S, 's04-03', 'dices') - 8;
  const toMid = progress(frame, words - 4, 24, EASE.inOut);
  const aGone = progress(frame, words - 4, 18);

  // ---- Blind.
  const stage1Out = progress(frame, blind - 12, 16, EASE.inOut);
  const quietAt = wordFrame(S, 's04-04', 'Callarte') - 6;
  const boardAt = wordFrame(S, 's04-04', 'consejo') - 6;
  const judgeAt = wordFrame(S, 's04-04', 'juicio') - 8;
  const blindAt = wordFrame(S, 's04-04', 'ciegas') - 8;

  return (
    <Stage>
      {stage1Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - stage1Out, fontFamily: FONT.sans }}>
          {/* The IP's card: what we already know, nothing new */}
          <div
            style={{
              position: 'absolute',
              left: (W - 1180) / 2,
              top: 190,
              width: 1180,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              padding: '16px 34px',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.cyan, 0.45)}`,
              background: alpha(C.ink900, 0.9),
              ...enter(frame, fichaAt, { distance: 20 }),
            }}
          >
            <IpChip ip={IP} size={40} />
            <span style={{ fontSize: 38, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>alojó un panel de phishing el martes</span>
          </div>

          <div style={{ position: 'absolute', left: 0, top: 316, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700, color: C.muted, ...enter(frame, labelAt, { distance: 10 }) }}>
            <Icon name="user" size={36} color={C.cyan} />
            lo que le dices al CISO
          </div>

          {/* A: «volverá» */}
          <Sentence
            x={0}
            w={CARD.w}
            frame={frame}
            at={aAt}
            tone={C.amber}
            mark={0}
            out={Math.max(aOut * 0.62, aGone)}
            verdictAt={promiseAt}
            verdict="promete una certeza que no tienes"
            icon="alert"
          >
            «El atacante <b>volverá</b> a usar este proveedor»
          </Sentence>

          {/* B: «probablemente» */}
          <Sentence
            x={mix(900, 450, toMid)}
            w={CARD.w}
            frame={frame}
            at={bAt}
            tone={C.emerald}
            mark={lit}
            out={0}
            verdictAt={trueAt}
            verdict="dice lo que sabes de verdad"
            verdictOut={progress(frame, estAt - 4, 12)}
            icon="check"
            note={
              <Tag at={estAt} frame={frame} icon="chart">
                lenguaje estimativo
              </Tag>
            }
          >
            «<b style={{ color: progress(frame, estAt - 6, 12) > 0.3 ? C.emerald : C.textStrong, textShadow: `0 0 ${Math.round(26 * progress(frame, estAt - 6, 12))}px ${alpha(C.emerald, 0.7)}` }}>Probablemente</b> volverá a usarlo»
          </Sentence>

          {/* aparte: and you say how sure you are */}
          {frame >= trustAt - 2 ? (
            <div style={{ position: 'absolute', left: 450, top: CARD.top + CARD.h + 28, width: CARD.w, display: 'flex', justifyContent: 'center', ...enter(frame, trustAt, { distance: 16 }) }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 30px', borderRadius: 999, border: `2px solid ${alpha(C.sky, 0.8)}`, background: alpha(C.sky, 0.12), fontSize: 36, fontWeight: 750, color: '#e0f2fe', whiteSpace: 'nowrap' }}>
                <Icon name="eye" size={38} color={C.sky} />y dices cuánto te fías de tu juicio
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The board decides anyway */}
      {frame >= blind - 14 ? <Board frame={frame} quietAt={quietAt} boardAt={boardAt} judgeAt={judgeAt} blindAt={blindAt} /> : null}
    </Stage>
  );
}

/** A sentence for the CISO. `mark` lights it as the right one, `out` steps it back. */
function Sentence({
  x,
  w,
  frame,
  at,
  tone,
  mark,
  out,
  verdictAt,
  verdict,
  verdictOut = 0,
  icon,
  note,
  children,
}: {
  x: number;
  w: number;
  frame: number;
  at: number;
  tone: string;
  mark: number;
  out: number;
  verdictAt: number;
  verdict: string;
  verdictOut?: number;
  icon: IconName;
  note?: ReactNode;
  children: ReactNode;
}) {
  const e = enter(frame, at, { distance: 24 });
  const v = progress(frame, verdictAt, 14);
  const style: CSSProperties = {
    position: 'absolute',
    left: x,
    top: CARD.top,
    width: w,
    height: CARD.h,
    boxSizing: 'border-box',
    padding: '30px 40px',
    borderRadius: RADIUS.lg,
    border: `${mark > 0.3 || v > 0.3 ? 3 : 2}px solid ${alpha(v > 0 || mark > 0 ? tone : C.cyan, v > 0 || mark > 0 ? 0.4 + 0.5 * Math.max(v, mark) : 0.35)}`,
    background: `linear-gradient(180deg, ${alpha(v > 0 || mark > 0 ? tone : C.cyan, 0.05 + 0.08 * Math.max(v, mark))} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
    boxShadow: mark > 0.02 ? `0 0 ${Math.round(40 * mark)}px ${alpha(tone, 0.25 * mark)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
    opacity: e.opacity * (1 - out),
    filter: out > 0.01 ? `saturate(${1 - 0.5 * out})` : undefined,
    transform: e.transform,
  };
  return (
    <div style={style}>
      <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.18, letterSpacing: -0.6, color: C.textStrong}}>{children}</div>
      <div style={{ position: 'absolute', left: 40, right: 30, bottom: 28, minHeight: 56 }}>
        {v > 0.01 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: tone === C.amber ? '#fcd34d' : '#6ee7b7', opacity: v * (1 - verdictOut), transform: `translateY(${(1 - v) * 10}px)`, whiteSpace: 'nowrap', position: 'absolute', left: 0, bottom: 0 }}>
            <Icon name={icon} size={40} color={tone} strokeWidth={2.4} />
            {verdict}
          </div>
        ) : null}
        {note}
      </div>
    </div>
  );
}

function Tag({ at, frame, icon, children }: { at: number; frame: number; icon: IconName; children: ReactNode }) {
  const p = progress(frame, at, 14);
  if (p <= 0.01) return null;
  return (
    <span style={{ position: 'absolute', left: 0, bottom: 0, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 26px 8px 18px', borderRadius: 999, border: `2px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.14), fontSize: 36, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      <Icon name={icon} size={36} color={C.cyan} />
      {children}
    </span>
  );
}

/** «callarte» struck, then the board's two ways of deciding. */
function Board({ frame, quietAt, boardAt, judgeAt, blindAt }: { frame: number; quietAt: number; boardAt: number; judgeAt: number; blindAt: number }) {
  const q = progress(frame, quietAt, 14);
  const strike = progress(frame, quietAt + 16, 14);
  const b = progress(frame, boardAt, 14);
  const j = progress(frame, judgeAt, 16);
  const k = progress(frame, blindAt, 16);
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 196, width: W, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 14}px)` }}>
        <div style={{ position: 'relative', padding: '10px 46px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.faint, 0.6)}`, background: alpha(C.ink900, 0.9), opacity: 1 - 0.3 * strike }}>
          <span style={{ fontSize: 56, fontWeight: 800, color: C.muted }}>callarte</span>
          <div style={{ position: 'absolute', left: 30, top: '50%', width: `calc(${strike * 100}% - 60px)`, height: 7, marginTop: -3, borderRadius: 4, background: C.rose }} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 308, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontSize: 50, fontWeight: 800, color: C.textStrong, opacity: b, transform: `translateY(${(1 - b) * 14}px)` }}>
        <Icon name="users" size={54} color={C.sky} />
        el consejo decide igual
      </div>
      <Column x={0} tone={C.emerald} icon="eye" show={j}>
        decide con tu juicio
      </Column>
      <Column x={900} tone={C.amber} icon="eyeOff" show={k}>
        decide a ciegas
      </Column>
    </div>
  );
}

function Column({ x, tone, icon, show, children }: { x: number; tone: string; icon: IconName; show: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 412,
        width: 828,
        height: 200,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.85)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 75%)`,
        boxShadow: `0 0 44px ${alpha(tone, 0.22)}`,
        opacity: show,
        transform: `translateY(${(1 - show) * 24}px)`,
      }}
    >
      <Icon name={icon} size={76} color={tone} strokeWidth={2} />
      <span style={{ fontSize: 58, fontWeight: 850, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap' }}>{children}</span>
    </div>
  );
}
