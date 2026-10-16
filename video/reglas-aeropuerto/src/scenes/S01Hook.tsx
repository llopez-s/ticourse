import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix } from '../../../engine/src/ui';
import { CONTEXT, INDICATORS, PROMISE, SOC, TITLE } from '../data/s01-hook';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const VIOLET = '#c4b5fd';

/** The three indicator cards: a row in the middle of the stage, then small under the context strip. */
const CARD_W = 440;
const CARD_H = 210;
const CARD_GAP = 48;
const ROW_W = 3 * CARD_W + 2 * CARD_GAP;
const ROW = { topA: 128, topB: 84, scaleB: 0.56 } as const;
/** Each card lies a little askew: loose, nobody has filed them. */
const TILT = [-2.2, 1.4, -1.1] as const;
/** The SOC's ask: big under the cards, then a smaller line under the small row. */
const ASK = { topA: 404, topB: 214, scaleB: 0.62 } as const;
const TITLE_TOP = 296;
const CHIPS_TOP = 510;

/**
 * s01-hook «¿Qué le damos al SOC?».
 *   start     the context strip «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia» (its
 *             last part still dim) and three empty card slots settling in, so the stage is never empty.
 *   pile      the three loose indicator cards, dimmed, each on its own word: «un dominio», «una dirección
 *             IP», «un hash» — no value on any of them, each with an expiry clock that runs. On «caducan»
 *             the three clocks run out together and turn amber.
 *   soc       «el SOC: ¿y qué le damos que dure?» comes in, big, under the cards.
 *   title     (always before 12 s) the cards and the ask step up into a small row, and «YARA y Sigma» lands
 *             with «del indicador a la regla» under it.
 *   promise   three chips, each on its words: «qué mira cada una» · «cuándo salta de más» · «qué rompe cada
 *             regla». On s01-03 «tú, su analista de inteligencia» lights on «analista». Holds.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pileAt = props.cue('pile');
  const socAt = props.cue('soc');
  // The title is on screen before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = props.cue('promise');
  const w1 = (word: string) => wordFrame(S, 's01-01', word);
  const w2 = (word: string) => wordFrame(S, 's01-02', word);
  const w3 = (word: string) => wordFrame(S, 's01-03', word);

  const stripIn = progress(frame, 0, 16);
  const meridian = progress(frame, w3('Meridian') - 6, 14) * (1 - 0.6 * progress(frame, w3('Meridian') + 30, 30, EASE.inOut));
  const youLit = progress(frame, w3('analista') - 6, 14);

  // Cards: slots from the first frames, each card on its own word (never before the cue).
  const slotIn = progress(frame, 2, 14);
  const cardAt = INDICATORS.map((ind, i) => Math.max(pileAt - 4 + i * 4, w1(ind.word) - 6));
  const expireAt = w1('caducan') - 4;
  const expired = progress(frame, expireAt, 22, EASE.inOut);

  const rise = progress(frame, titleAt - 10, 24, EASE.inOut);
  const askIn = enter(frame, socAt - 4, { distance: 18, duration: 16 });
  const titleIn = enter(frame, titleAt, { distance: 24, duration: 18 });
  const subIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });
  const chipAt = PROMISE.map((c) => Math.max(promiseAt - 4, w2(c.word) - 6));

  return (
    <Stage>
      {/* Who and where */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: W, display: 'flex', justifyContent: 'center', opacity: stripIn }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 16,
            height: 58,
            boxSizing: 'border-box',
            padding: '8px 30px 0',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * meridian)}`,
            background: alpha(C.cyan, 0.06 + 0.08 * meridian),
            boxShadow: meridian > 0.02 ? `0 0 ${Math.round(24 * meridian)}px ${alpha(C.cyan, 0.3 * meridian)}` : undefined,
            fontFamily: FONT.sans,
            fontSize: 34,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontWeight: 850, color: C.textStrong }}>{CONTEXT[0]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 700, color: C.text }}>{CONTEXT[1]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 800, color: youLit > 0.5 ? C.cyanSoft : C.text, opacity: 0.6 + 0.4 * youLit }}>{CONTEXT[2]}</span>
        </div>
      </div>

      {/* The loose indicators: no values, each with its expiry clock */}
      <div
        style={{
          position: 'absolute',
          left: Math.round((W - ROW_W) / 2),
          top: mix(ROW.topA, ROW.topB, rise),
          width: ROW_W,
          height: CARD_H,
          transform: `scale(${mix(1, ROW.scaleB, rise)})`,
          transformOrigin: '50% 0',
          ...dimStyle(0.35 * rise),
        }}
      >
        {INDICATORS.map((ind, i) => {
          const p = progress(frame, cardAt[i], 16);
          // The clock runs slowly from the card's entrance, then runs out on «caducan».
          const left = Math.max(0, mix(1 - 0.25 * progress(frame, cardAt[i], Math.max(1, expireAt - cardAt[i]), EASE.linear), 0, expired));
          return (
            <div key={ind.label} style={{ position: 'absolute', left: i * (CARD_W + CARD_GAP), top: 0, width: CARD_W, height: CARD_H }}>
              {/* the empty slot */}
              {p < 1 ? (
                <div style={{ position: 'absolute', inset: 0, borderRadius: 24, border: `2px dashed ${C.ink600}`, opacity: slotIn * (1 - p) }} />
              ) : null}
              {p > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    boxSizing: 'border-box',
                    padding: '26px 30px 24px',
                    borderRadius: 24,
                    border: `2px solid ${alpha(expired > 0.5 ? C.amber : C.cyan, 0.3 + 0.15 * expired)}`,
                    background: `linear-gradient(180deg, ${alpha(C.ink800, 0.95)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
                    boxShadow: `0 18px 40px ${alpha('#000000', 0.3)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 26}px) rotate(${TILT[i] * p}deg)`,
                  }}
                >
                  {/* The card is dimmed (loose, nobody filed it); its clock is not: it runs out in amber. */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ opacity: 0.75 - 0.2 * expired, filter: `saturate(${0.75 - 0.35 * expired})` }}>
                      <IndicatorGlyph kind={ind.glyph} />
                    </div>
                    <ExpiryClock left={left} expired={expired} beat={pulse(frame, fps, 0.9)} />
                  </div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 42, fontWeight: 800, letterSpacing: -0.5, color: C.text, whiteSpace: 'nowrap', opacity: 0.75 - 0.2 * expired }}>{ind.label}</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* The SOC's ask */}
      {frame >= socAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: mix(ASK.topA, ASK.topB, rise), width: W, display: 'flex', justifyContent: 'center', ...askIn }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 24,
              padding: '14px 40px 14px 30px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.cyan, 0.5)}`,
              background: alpha(C.cyan, 0.07),
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
              transform: `scale(${mix(1, ASK.scaleB, rise)})`,
              transformOrigin: '50% 0',
              opacity: 1 - 0.3 * rise,
            }}
          >
            <Icon name="users" size={54} color={C.cyan} strokeWidth={2} />
            <span style={{ fontSize: 42, fontWeight: 750, color: C.muted }}>{SOC.who}</span>
            <span style={{ fontSize: 62, fontWeight: 900, letterSpacing: -1.2, color: C.textStrong }}>{SOC.ask}</span>
          </div>
        </div>
      ) : null}

      {/* The answer: two rules */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans }}>
          <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 900, letterSpacing: -2, color: VIOLET, textShadow: `0 0 40px ${alpha(C.violet, 0.4)}`, whiteSpace: 'nowrap', ...titleIn }}>{TITLE.main}</div>
          <div style={{ marginTop: 14, fontSize: 50, lineHeight: 1.1, fontWeight: 750, color: C.textStrong, ...subIn }}>{TITLE.sub}</div>
        </div>
      ) : null}

      {/* The promise */}
      <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 22, fontFamily: FONT.sans }}>
        {PROMISE.map((c, i) => {
          const e = enter(frame, chipAt[i], { distance: 16 });
          const on = progress(frame, chipAt[i], 10) * (1 - 0.5 * progress(frame, (chipAt[i + 1] ?? Number.MAX_SAFE_INTEGER) - 2, 12, EASE.inOut));
          return (
            <div
              key={c.text}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                height: 68,
                boxSizing: 'border-box',
                padding: '0 30px 0 22px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
                background: alpha(C.cyan, 0.06 + 0.12 * on),
                boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined,
                fontSize: 36,
                fontWeight: 750,
                color: C.textStrong,
                whiteSpace: 'nowrap',
                ...e,
              }}
            >
              <span style={{ width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.2), border: `2px solid ${alpha(C.cyan, 0.7)}`, fontSize: 22, fontWeight: 900, color: C.cyanSoft }}>{i + 1}</span>
              {c.text}
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

/** The kind of indicator, as an icon in a disc (the hash as a «#»: no value, ever). */
function IndicatorGlyph({ kind }: { kind: 'globe' | 'network' | 'hash' }) {
  const size = 78;
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.1), border: `3px solid ${alpha(C.cyan, 0.55)}` }}>
      {kind === 'hash' ? (
        <span style={{ fontFamily: FONT.mono, fontSize: 46, fontWeight: 800, lineHeight: 1, color: C.cyanSoft, marginTop: 2 }}>#</span>
      ) : (
        <Icon name={kind} size={44} color={C.cyanSoft} strokeWidth={2.2} />
      )}
    </div>
  );
}

/** An expiry clock: the arc is the time left; the hand turns as it runs down. Amber once it has run out. */
function ExpiryClock({ left, expired, beat }: { left: number; expired: number; beat: number }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const col = expired > 0.5 ? C.amber : C.cyanSoft;
  const angle = (1 - left) * 360;
  return (
    <svg width={80} height={80} viewBox="-40 -40 80 80" style={{ display: 'block', overflow: 'visible' }}>
      {expired > 0.5 ? <circle r={38} fill={alpha(C.amber, 0.14 + 0.1 * beat)} /> : null}
      <circle r={r} fill={alpha(C.ink950, 0.6)} stroke={expired > 0.5 ? alpha(C.amber, 0.75) : alpha(C.muted, 0.35)} strokeWidth={5} />
      <circle r={r} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${circ * left} ${circ}`} transform="rotate(-90)" />
      <line x1={0} y1={0} x2={0} y2={-20} stroke={col} strokeWidth={4} strokeLinecap="round" transform={`rotate(${angle})`} />
      <line x1={0} y1={0} x2={12} y2={0} stroke={alpha(col, 0.7)} strokeWidth={4} strokeLinecap="round" />
      <circle r={4} fill={col} />
    </svg>
  );
}
