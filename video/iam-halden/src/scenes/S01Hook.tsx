import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { CLOSE, PROMISE, QUESTION, ROUTE, TITLE, TWO_Q } from '../data/s01-hook';
import { LogonCard, logonCardHeight } from './parts/LogonCard';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';
const W = 1728;

// The 01:52 card: big in the middle, then small on the left while the title enters.
const HERO = { w: 860, top: 34 };
const SIDE = { w: 560, left: 30, top: 86 };
const BANDS = { stamp: true };
const sideH = logonCardHeight(SIDE.w, BANDS);
// The close: the card comes back above the closing line.
const BACK = { w: 700, top: 40 };
const backH = logonCardHeight(BACK.w, BANDS);

// Title block on the right while the card is small.
const TITLE_X = 660;

/**
 * s01-hook «La contraseña buena». The bridge with V5: the SIEM's 01:52 card
 * (4-9 · logon 4624 of svc_tosreport from ADM-WS-07 into srv-tc-app03),
 * big, and the green stamp «contraseña correcta · adelante». At «title» it
 * steps back to the left, «¿era quien decía ser?» appears under it in rose
 * and the title «Identidad y acceso» enters with the IAM line; the promise
 * as three chips. Then the two questions, one at a time, each with its exam
 * name (AUTHENTICATION, AUTHORIZATION), and the route as four stops that
 * light in a row. Close: the 01:52 card again with «saber la contraseña no
 * es ser quien dice». Nobody is blamed: no NULL CIPHER, no ASN.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logon = props.cue('logon');
  const title = props.cue('title');
  const promise = props.cue('promise');
  const twoQ = props.cue('two-q');
  const route = props.cue('route');
  const close = segment(props, 's01-06');

  // ---- The card: builds as the scene opens, stamp on «contraseña de verdad».
  const cardAt = -16;
  const stampAt = wordFrame(S, 's01-01', 'contraseña');
  const toSide = progress(frame, title, 26, EASE.inOut);
  const cardOut = progress(frame, twoQ - 14, 16, EASE.inOut);
  const cardW = mix(HERO.w, SIDE.w, toSide);
  const cardLeft = mix((W - HERO.w) / 2, SIDE.left, toSide);
  const cardTop = mix(HERO.top, SIDE.top, toSide);
  const heroGlow = progress(frame, logon, 18) * (1 - toSide);
  const cardDim = 0.45 * progress(frame, wordFrame(S, 's01-02', 'era') - 4, 14);
  const questionIn = progress(frame, wordFrame(S, 's01-02', 'era') - 6, 14);

  // ---- Title and promise (right), then the title moves to the top centre.
  const titleIn = progress(frame, title + 6, 20);
  const toTop = progress(frame, twoQ - 12, 24, EASE.inOut);
  const titleOut = progress(frame, close.from - 10, 16, EASE.inOut);
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-03', p.word) - 6);
  const chipsOut = progress(frame, twoQ - 14, 14, EASE.inOut);

  // ---- Two questions.
  const qAt = TWO_Q.map((q) => wordFrame(S, 's01-04', q.qWord) - 6);
  const termAt = TWO_Q.map((q) => wordFrame(S, 's01-04', q.termWord) - 4);
  const qDim = progress(frame, route - 4, 16, EASE.inOut);
  const qOut = progress(frame, close.from - 10, 16, EASE.inOut);

  // ---- Route: first stop on «gente», last on «llaves», the middle two between.
  const firstStop = Math.max(route + 4, wordFrame(S, 's01-05', 'gente') - 6);
  const lastStop = Math.max(firstStop + 24, wordFrame(S, 's01-05', 'llaves') - 6);
  const stopAt = ROUTE.map((_, i) => firstStop + ((lastStop - firstStop) * i) / (ROUTE.length - 1));
  const routeIn = progress(frame, route - 2, 16);
  const routeOut = progress(frame, close.from - 10, 16, EASE.inOut);

  // ---- Close: the card comes back with the line.
  const backIn = progress(frame, close.from - 2, 18);
  const lineAt = wordFrame(S, 's01-06', 'sabes') - 4;
  const lineIn = progress(frame, lineAt, 16);
  const noGlow = progress(frame, wordFrame(S, 's01-06', 'no') - 4, 12);

  // Title geometry: right block (big) to top centre (smaller).
  const tSize = mix(92, 58, toTop);
  const tSub = mix(40, 30, toTop);
  const tLeft = mix(TITLE_X, 0, toTop);
  const tWidth = mix(W - TITLE_X, W, toTop);
  const tTop = mix(96, 0, toTop);

  return (
    <Stage>
      {/* The 01:52 card (hook + title) */}
      {cardOut < 1 ? (
        <div style={{ position: 'absolute', left: cardLeft, top: cardTop, opacity: 1 - cardOut }}>
          <LogonCard at={cardAt} stampAt={stampAt} width={cardW} glow={heroGlow} dim={cardDim} frame={frame} />
          {questionIn > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: -SIDE.left,
                top: sideH + 26,
                width: SIDE.w + 2 * SIDE.left + 40,
                textAlign: 'center',
                fontFamily: FONT.sans,
                fontSize: 52,
                fontWeight: 850,
                color: C.roseSoft,
                whiteSpace: 'nowrap',
                ...enter(frame, wordFrame(S, 's01-02', 'era') - 6, { distance: 14 }),
                opacity: questionIn,
                textShadow: `0 0 26px ${alpha(C.rose, 0.35)}`,
              }}
            >
              {QUESTION}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Title */}
      {titleIn > 0 && titleOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: tLeft,
            top: tTop,
            width: tWidth,
            textAlign: 'center',
            fontFamily: FONT.sans,
            opacity: titleIn * (1 - titleOut),
            transform: `translateY(${(1 - titleIn) * 24}px)`,
          }}
        >
          <div style={{ fontSize: tSize, fontWeight: 850, color: C.textStrong, letterSpacing: -1.5, lineHeight: 1.05, whiteSpace: 'nowrap' }}>{TITLE.main}</div>
          <div style={{ marginTop: 10, fontSize: tSub, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{TITLE.sub}</div>
        </div>
      ) : null}

      {/* Promise chips */}
      {chipsOut < 1 && frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: TITLE_X, top: 334, width: W - TITLE_X, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: 1 - chipsOut }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 18 });
            const lit = progress(frame, chipAt[i], 10) * (1 - progress(frame, (chipAt[i + 1] ?? promise + 9999) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 30px',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.45 + 0.45 * lit)}`,
                  background: alpha(C.cyan, 0.06 + 0.1 * lit),
                  fontFamily: FONT.sans,
                  fontSize: 44,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                  boxShadow: lit > 0 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
                }}
              >
                <Icon name={p.icon} size={42} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Two questions */}
      {frame >= twoQ - 6 && qOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 140, width: W, display: 'flex', justifyContent: 'center', gap: 48, opacity: 1 - qOut }}>
          {TWO_Q.map((q, i) => {
            const boxP = progress(frame, twoQ - 4 + i * 6, 16);
            const inP = progress(frame, qAt[i], 16);
            const termP = progress(frame, termAt[i], 14);
            const other = i === 0 ? progress(frame, qAt[1] - 2, 14, EASE.inOut) : 0;
            const dimK = Math.max(0.55 * other, 0.45 * qDim);
            const small = qDim;
            return (
              <div
                key={q.q}
                style={{
                  width: 780,
                  height: mix(300, 230, small),
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `2px solid ${alpha(C.cyan, 0.25 + 0.5 * inP * (1 - dimK))}`,
                  background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
                  boxShadow: `0 24px 56px ${alpha('#000000', 0.4)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: mix(26, 14, small),
                  fontFamily: FONT.sans,
                  opacity: boxP * (1 - dimK),
                  transform: `translateY(${(1 - boxP) * 22}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, whiteSpace: 'nowrap', opacity: 0.35 + 0.65 * inP }}>
                  <Icon name={q.icon} size={mix(64, 50, small)} color={C.cyan} />
                  <span style={{ fontSize: mix(66, 52, small), fontWeight: 850, color: C.textStrong, letterSpacing: -0.5, opacity: inP, transform: `translateX(${(1 - inP) * 14}px)` }}>{q.q}</span>
                </div>
                <div
                  style={{
                    fontSize: mix(50, 40, small),
                    fontWeight: 850,
                    letterSpacing: 2,
                    color: '#c4b5fd',
                    opacity: termP,
                    transform: `translateY(${(1 - termP) * 10}px)`,
                    textShadow: `0 0 22px ${alpha(C.violet, 0.4 * termP)}`,
                  }}
                >
                  {q.term}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Route: four stops */}
      {routeIn > 0 && routeOut < 1 ? (
        <Route frame={frame} fps={fps} stopAt={stopAt} opacity={routeIn * (1 - routeOut)} />
      ) : null}

      {/* Close: the card again and the line */}
      {backIn > 0 ? (
        <>
          <div style={{ position: 'absolute', left: (W - BACK.w) / 2, top: BACK.top, opacity: backIn, transform: `translateY(${(1 - backIn) * 18}px)` }}>
            <LogonCard width={BACK.w} stampAt={-100} dim={0.35 * lineIn} frame={frame} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: BACK.top + backH + 26,
              width: W,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 64,
              fontWeight: 850,
              letterSpacing: -0.5,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              ...enter(frame, lineAt, { distance: 16 }),
              opacity: lineIn,
            }}
          >
            {CLOSE.lead}{' '}
            <span style={{ color: C.cyan, textShadow: `0 0 ${Math.round(24 * noGlow)}px ${alpha(C.cyan, 0.55 * noGlow)}` }}>{CLOSE.mid}</span> {CLOSE.tail}
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** The video's route: four stops on a rail that light in a row. */
function Route({ frame, fps, stopAt, opacity }: { frame: number; fps: number; stopAt: number[]; opacity: number }) {
  const top = 432;
  const n = ROUTE.length;
  const slot = W / n;
  const cx = (i: number) => slot * (i + 0.5);
  const R = 52;
  const fill = progress(frame, stopAt[0], Math.max(12, stopAt[n - 1] - stopAt[0]), EASE.linear);
  const railX0 = cx(0);
  const railX1 = cx(n - 1);
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, height: 240, opacity, fontFamily: FONT.sans }}>
      <svg width={W} height={2 * R + 8} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={railX0} y1={R + 4} x2={railX1} y2={R + 4} stroke={C.ink600} strokeWidth={6} strokeLinecap="round" />
        <line x1={railX0} y1={R + 4} x2={railX0 + (railX1 - railX0) * fill} y2={R + 4} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
      </svg>
      {ROUTE.map((s, i) => {
        const lit = progress(frame, stopAt[i], 12);
        const current = lit * (1 - (i < n - 1 ? progress(frame, stopAt[i + 1], 12, EASE.inOut) : 0));
        const beat = 0.8 + 0.2 * pulse(frame, fps, 0.7);
        return (
          <div key={s.label} style={{ position: 'absolute', left: cx(i) - 200, top: 0, width: 400, textAlign: 'center' }}>
            <div
              style={{
                width: 2 * R,
                height: 2 * R,
                margin: '4px auto 0',
                borderRadius: '50%',
                boxSizing: 'border-box',
                border: `4px solid ${lit > 0 ? alpha(C.cyan, 0.4 + 0.6 * lit) : C.ink600}`,
                background: lit > 0 ? alpha(C.cyan, 0.08 + 0.14 * current) : C.ink900,
                display: 'grid',
                placeItems: 'center',
                boxShadow: current > 0 ? `0 0 ${Math.round(30 * current * beat)}px ${alpha(C.cyan, 0.45 * current)}` : undefined,
                transform: `scale(${1 + 0.1 * current})`,
              }}
            >
              <Icon name={s.icon} size={54} color={lit > 0 ? C.cyan : C.faint} />
            </div>
            <div
              style={{
                marginTop: 16,
                fontSize: 42,
                fontWeight: 800,
                color: lit > 0 ? C.textStrong : C.faint,
                whiteSpace: 'nowrap',
                opacity: 0.45 + 0.55 * lit,
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
