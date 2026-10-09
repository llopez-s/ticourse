import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix } from '../../../engine/src/ui';
import { ADVERSARY, CAPACITY, COIN, HEADS, NOTE, QUESTIONS, RESULT } from '../data/s03-orden';
import { TIMELINE } from '../timeline/load';
import { ScoreBadge } from './parts/Finding';
import { Hull } from './parts/Hull';
import { Stage, wordFrame } from './kit';

const S = 's03-orden';
const W = STAGE.width;

// ---- Columns: the label column on the left, one column per server.
const LABEL_W = 400;
const COL_X = [424, 1083] as const;
const COL_W = 645;
const HEAD_H = 184;
/** A: the tie, alone under SILENT PAGER's tag. B: below the intercept card's slot (stage y 10–175). C: the comparison. */
const HEAD_TOP_A = 110;
const HEAD_TOP_B = 190;
const HEAD_TOP_C = 18;
const ROW_H = [108, 92, 72, 76] as const;
const ROW_GAP = 6;
/** Row offset from the matrix top. */
const rowOff = (i: number) => ROW_H.slice(0, i).reduce((a, b) => a + b, 0) + i * ROW_GAP;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/**
 * s03-orden «¿Y ahora, cuál?». On `tie` the two findings stand side by side, 9.8 and 9.8 (an equals sign pops, sfx
 * «ding»), with the week's capacity: «esta semana cabe: 1». SILENT PAGER's tag («cuenta con que tu SOC duerma») gives
 * way to the intercepted message at the top; the heads step down under it. On `coin` a coin flips in the empty
 * space («una moneda»: it looks at nothing) and goes as «cuatro preguntas» skeletons arrive. Each question lands on its cue,
 * and its answers only once the voice has said them: `reach` (the two answers differ), `exploit`, `front`, `impact`
 * (one shared answer each, spanning both columns). «Tres respuestas iguales y una distinta»: the shared rows step back, the
 * odd one lights. `p1`: the first server's head takes «P1 · parche hoy · ventana de emergencia (24 h)» and the note
 * «Sistemas · parche en srv-msg01 · hoy · 18:00»; `p3`: the second's «P3 · ciclo mensual».
 */
export function S03Orden(props: SceneProps) {
  const frame = useCurrentFrame();
  const tieAt = props.cue('tie');
  const coinAt = props.cue('coin');
  const qAt = [props.cue('reach'), props.cue('exploit'), props.cue('front'), props.cue('impact')];
  const p1At = props.cue('p1');
  const p3At = props.cue('p3');
  const ic = interceptWindow();

  // ---- Heads: present from the start, stepping down just before the intercepted message arrives.
  const headsIn = progress(frame, 4, 18);
  const step = progress(frame, ic.from - 26, 22, EASE.inOut);
  const rise = progress(frame, ic.to - 8, 24, EASE.inOut);
  const headTop = mix(mix(HEAD_TOP_A, HEAD_TOP_B, step), HEAD_TOP_C, rise);
  const matTop = headTop + HEAD_H + 8;
  const tieIn = springIn(frame, 30, tieAt - 2, { damping: 13 });
  const capIn = springIn(frame, 30, tieAt + 8, { damping: 15 });

  // ---- SILENT PAGER's tag on s03-02, then the engine's intercept card owns the top.
  const advAt = wordFrame(S, 's03-02', 'SILENT') - 8;
  const advOut = progress(frame, ic.from - 10, 10, EASE.inOut);
  const advIn = enter(frame, advAt, { distance: 14 });

  // ---- The coin.
  const coinIn = springIn(frame, 30, coinAt - 4, { damping: 14 });
  const cuatroAt = wordFrame(S, 's03-03', 'cuatro') - 6;
  const coinOut = progress(frame, cuatroAt, 14, EASE.inOut);
  const skel = progress(frame, cuatroAt + 2, 16);

  // ---- Questions and answers.
  const ansAt = [
    [wordFrame(S, 's03-04', 'primero') - 4, wordFrame(S, 's03-04', 'segundo') - 4],
    [wordFrame(S, 's03-05', 'Sí') - 4, wordFrame(S, 's03-05', 'fallo') - 4],
    [wordFrame(S, 's03-06', 'Nada') - 4],
    [wordFrame(S, 's03-06', 'mismo') - 4],
  ];
  const sameAt = wordFrame(S, 's03-07', 'iguales') - 6;
  const oneAt = wordFrame(S, 's03-07', 'distinta') - 6;
  const sameDim = progress(frame, sameAt, 16, EASE.inOut);
  const oneGlow = progress(frame, oneAt, 14, EASE.inOut);

  // ---- The verdicts.
  const p1In = springIn(frame, 30, p1At - 2, { damping: 15 });
  const p3In = springIn(frame, 30, p3At - 2, { damping: 15 });
  const noteAt = wordFrame(S, 's03-07', 'hoy') + 4;
  const noteIn = enter(frame, noteAt, { distance: 14, duration: 14 });
  const shipsAt = ansAt[0][0];
  const head1Win = Math.min(1, p1In);
  const head2Dim = 0.55 * head1Win * (1 - progress(frame, p3At - 2, 12));

  return (
    <Stage>
      {/* The heads: the same two findings, now columns of a comparison */}
      <div style={{ position: 'absolute', left: 0, top: headTop, width: W, height: HEAD_H, opacity: headsIn }}>
        {/* capacity chip, in the label column */}
        {capIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: LABEL_W, height: HEAD_H, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', opacity: Math.min(1, capIn * 1.4), transform: `scale(${0.9 + 0.1 * Math.min(1, capIn)})`, transformOrigin: 'left center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 18px',
                borderRadius: RADIUS.pill,
                border: `3px solid ${alpha(C.amber, 0.85)}`,
                background: alpha(C.amberDeep, 0.5),
                boxShadow: `0 0 26px ${alpha(C.amber, 0.25)}`,
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 800,
                color: '#fde68a',
                whiteSpace: 'nowrap',
              }}
            >
              {CAPACITY}
            </div>
          </div>
        ) : null}
        {HEADS.map((h, i) => {
          const resultIn = i === 0 ? p1In : p3In;
          const shipIn = progress(frame, shipsAt + (i === 0 ? 0 : 20), 16);
          const win = i === 0 ? head1Win : 0;
          return (
            <div
              key={h.host}
              style={{
                position: 'absolute',
                left: COL_X[i],
                top: 0,
                width: COL_W,
                height: HEAD_H,
                boxSizing: 'border-box',
                borderRadius: RADIUS.lg,
                border: `2px solid ${alpha(C.rose, mix(0.55, 0.95, win))}`,
                background: `linear-gradient(90deg, ${alpha(C.roseDeep, 0.7)} 0%, ${alpha(C.ink900, 0.97)} 70%)`,
                boxShadow: win > 0.05 ? `0 0 ${Math.round(34 * win)}px ${alpha(C.rose, 0.3 * win)}` : undefined,
                transform: win > 0.01 ? `scale(${1 + 0.02 * win})` : undefined,
                padding: '12px 22px',
                fontFamily: FONT.sans,
                ...(i === 1 ? dimStyle(head2Dim) : {}),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 76 }}>
                {shipIn > 0.02 ? (
                  <div style={{ width: 150, opacity: shipIn }}>
                    <Hull width={150} sea={i === 0 ? 1 : 0} storm={i === 0 ? 1 : 0} dock={i === 0 ? 0 : 1} hole={1} />
                  </div>
                ) : null}
                <span style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{h.host}</span>
                <ScoreBadge score={h.score} sev="CRITICAL" size={44} withSev={false} lit={0.9} />
              </div>
              {resultIn > 0.02 ? (
                <div style={{ marginTop: 4, opacity: Math.min(1, resultIn * 1.4), transform: `translateY(${(1 - Math.min(1, resultIn)) * 12}px)`, lineHeight: 1.15 }}>
                  {i === 0 ? (
                    <>
                      <div style={{ fontSize: 42, fontWeight: 850, color: '#fda4af', whiteSpace: 'nowrap' }}>{RESULT.p1.big}</div>
                      <div style={{ fontSize: 32, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>{RESULT.p1.sub}</div>
                    </>
                  ) : (
                    <div style={{ fontSize: 42, fontWeight: 850, color: '#7dd3fc', whiteSpace: 'nowrap' }}>{RESULT.p3.big}</div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
        {/* the tie: 9.8 = 9.8 */}
        {tieIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: COL_X[0] + COL_W + 7 - 28,
              top: 60,
              width: 56,
              height: 56,
              borderRadius: 28,
              display: 'grid',
              placeItems: 'center',
              background: C.ink900,
              border: `3px solid ${C.amber}`,
              fontFamily: FONT.mono,
              fontSize: 42,
              fontWeight: 850,
              color: '#fde68a',
              opacity: Math.min(1, tieIn * 1.4) * (1 - 0.6 * head1Win),
              transform: `scale(${0.6 + 0.4 * Math.min(1.1, tieIn)})`,
              zIndex: 2,
            }}
          >
            =
          </div>
        ) : null}
      </div>

      {/* SILENT PAGER's tag (s03-02), before the intercepted message */}
      {frame >= advAt - 2 && advOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 18, width: W, display: 'flex', justifyContent: 'center', ...advIn, opacity: advIn.opacity * (1 - advOut) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '10px 28px 10px 20px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.rose, 0.85)}`, background: alpha(C.roseDeep, 0.7), whiteSpace: 'nowrap', fontFamily: FONT.sans }}>
            <Icon name="terminal" size={36} color={C.rose} />
            <span style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 850, letterSpacing: 2, color: '#fecdd3' }}>{ADVERSARY.name}</span>
            <span style={{ fontSize: 34, fontWeight: 650, color: C.text }}>{ADVERSARY.says}</span>
          </div>
        </div>
      ) : null}

      {/* The coin: a decision that looks at nothing */}
      {coinIn > 0.01 && coinOut < 1 ? (
        <div style={{ position: 'absolute', left: W / 2 - 150, top: matTop + 40, width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, coinIn * 1.3) * (1 - coinOut), transform: `scale(${1 - 0.25 * coinOut})`, fontFamily: FONT.sans }}>
          <Coin frame={frame} at={coinAt} />
          <span style={{ fontSize: 40, fontWeight: 800, color: C.text }}>{COIN}</span>
        </div>
      ) : null}

      {/* The four questions: skeletons first, then label and answers as the voice goes */}
      {QUESTIONS.map((q, i) => {
        const top = matTop + rowOff(i);
        const h = ROW_H[i];
        const labelIn = progress(frame, qAt[i] - 2, 12);
        const isOdd = q.key === 'reach';
        const dimRow = isOdd ? 0 : sameDim * 0.6;
        const glow = isOdd ? oneGlow : 0;
        return (
          <div key={q.key} style={{ position: 'absolute', left: 0, top, width: W, height: h, ...dimStyle(dimRow) }}>
            {/* skeleton slot */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: h, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.ink600, 0.55)}`, opacity: skel * (1 - labelIn) }} />
            {/* label */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: LABEL_W, height: h, display: 'flex', alignItems: 'center', gap: 14, opacity: labelIn, transform: `translateX(${(1 - labelIn) * -16}px)` }}>
              <span style={{ width: 40, height: 40, borderRadius: 20, display: 'grid', placeItems: 'center', flexShrink: 0, background: alpha(C.violet, 0.18), border: `2px solid ${alpha(C.violet, 0.8)}`, fontFamily: FONT.mono, fontSize: 26, fontWeight: 800, color: '#c4b5fd' }}>{i + 1}</span>
              <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{q.q}</span>
            </div>
            {/* answers */}
            {typeof q.a === 'string' ? (
              <Cell x={COL_X[0]} w={COL_X[1] + COL_W - COL_X[0]} h={h} show={progress(frame, ansAt[i][0], 14)} tone={C.ink600}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 20, display: 'grid', placeItems: 'center', background: alpha(C.ink700, 0.9), border: `2px solid ${C.ink500}`, fontFamily: FONT.mono, fontSize: 28, fontWeight: 850, color: C.muted }}>=</span>
                  <span style={{ fontSize: q.key === 'impact' ? 37 : 42, fontWeight: 750, color: C.textStrong }}>{q.a}</span>
                  {q.note && progress(frame, ansAt[i][1] ?? ansAt[i][0], 12) > 0.02 ? (
                    <span style={{ fontSize: 32, fontWeight: 650, color: C.muted, opacity: progress(frame, ansAt[i][1] ?? ansAt[i][0], 12) }}>· {q.note}</span>
                  ) : null}
                </span>
              </Cell>
            ) : (
              q.a.map((txt, k) => (
                <Cell key={k} x={COL_X[k]} w={COL_W} h={h} show={progress(frame, ansAt[i][k], 14)} tone={k === 0 ? C.rose : C.sky} glow={glow}>
                  <span style={{ fontSize: 37, fontWeight: 750, lineHeight: 1.18, color: k === 0 ? '#fecdd3' : '#bae6fd' }}>{txt}</span>
                </Cell>
              ))
            )}
          </div>
        );
      })}

      {/* The note: who patches, and when */}
      {frame >= noteAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 592, width: W, display: 'flex', justifyContent: 'center', ...noteIn }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '10px 30px 10px 22px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.emerald, 0.8)}`, background: alpha(C.emeraldDeep, 0.55), fontFamily: FONT.sans, fontSize: 38, fontWeight: 750, color: '#a7f3d0', whiteSpace: 'nowrap' }}>
            <Icon name="clock" size={38} color={C.emerald} />
            {NOTE}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

function Cell({ x, w, h, show, tone, glow = 0, children }: { x: number; w: number; h: number; show: number; tone: string; glow?: number; children: ReactNode }) {
  if (show < 0.02) return null;
  const style: CSSProperties = {
    position: 'absolute',
    left: x,
    top: 0,
    width: w,
    height: h,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    padding: '0 22px',
    borderRadius: RADIUS.md,
    border: `2px solid ${alpha(tone, 0.55 + 0.4 * glow)}`,
    background: alpha(tone, 0.08 + 0.1 * glow),
    boxShadow: glow > 0.05 ? `0 0 ${Math.round(28 * glow)}px ${alpha(tone, 0.35 * glow)}` : undefined,
    fontFamily: FONT.sans,
    opacity: show,
    transform: `translateY(${(1 - show) * 10}px)`,
    overflow: 'hidden',
  };
  return <div style={style}>{children}</div>;
}

/** A coin, flipping about its vertical axis (slowly: nothing on screen flashes). */
function Coin({ frame, at }: { frame: number; at: number }) {
  const t = Math.max(0, frame - at);
  const flip = Math.cos(t * 0.09);
  return (
    <div style={{ width: 150, height: 150, perspective: 600 }}>
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          background: `radial-gradient(circle at 35% 30%, #fde68a 0%, ${C.amber} 55%, #b45309 100%)`,
          border: `6px solid #fcd34d`,
          boxShadow: `0 0 36px ${alpha(C.amber, 0.35)}`,
          display: 'grid',
          placeItems: 'center',
          transform: `scaleX(${Math.max(0.08, Math.abs(flip))})`,
          fontFamily: FONT.sans,
          fontSize: 78,
          fontWeight: 900,
          color: '#78350f',
        }}
      >
        ?
      </div>
    </div>
  );
}
