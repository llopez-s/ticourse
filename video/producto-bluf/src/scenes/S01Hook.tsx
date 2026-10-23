import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S01 } from '../data/s01-hook';
import { Silhouette } from './parts/Icons';
import { EnvelopeRain } from './parts/Rain';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// Final layout: finding card on top, one slot under it per copy, the three readers, the promise at the bottom.
const READER_X = [360, 864, 1368] as const;
const CARD = { w: 380, h: 116, top: 140 } as const;
const SLOT = { w: 300, h: 46, top: 268 } as const;
const READER_TOP = 330;
const PROMISE_TOP = 590;
// Before `readers` the card sits where the clock was and the title is big.
const CARD_MID_TOP = 330;
const CLOCK = { cx: W / 2, cy: 318, r: 118 } as const;

/**
 * s01-hook «Un hallazgo, tres lectores». The frame is on from the first frame: «Meridian
 * Dynamics · aeroespacial · tú, su analista de inteligencia» and a clock at «06:00 UTC».
 *   day       the date chip lands (18-04-2026) and envelopes start to fall as rain over the stage,
 *             labelled «correos de phishing · cadena de suministro» (no number, no domain).
 *   title     «Escribir para quien decide» lands before 10 s, «productos, BLUF y lenguaje
 *             estimativo» under it; the clock and the rain step back.
 *   readers   the title steps up; ONE card, «un hallazgo», takes the middle and three faceless
 *             readers arrive one per name (SOC with a headset, CISO with a shield, the board as a
 *             group), each tied to the card by a curve.
 *   promise   three chips along the bottom, one per sentence.
 *   differ    the card splits into three copies, one above each reader, each with an empty slot
 *             («?») nobody has filled yet.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const day = props.cue('day');
  const titleCue = props.cue('title');
  const readersCue = props.cue('readers');
  const promise = props.cue('promise');
  const differ = props.cue('differ');

  const w = (seg: string, word: string) => wordFrame(S, seg, word);

  // ---- Frame strip, date, clock.
  const stripIn = progress(frame, 0, 16);
  const dateAt = Math.min(day, w('s01-01', 'Dieciocho')) - 4;
  const dateIn = enter(frame, dateAt, { distance: 14 });
  const analystLit = progress(frame, w('s01-02', 'analista') - 6, 14);
  const beat = pulse(frame, fps, 0.5);

  // ---- Title (before 10 s whatever the voice does).
  const titleAt = Math.min(titleCue - 6, 10 * 30 - 22);
  const titleP = progress(frame, titleAt, 18);
  const subIn = enter(frame, titleAt + 8, { distance: 12, duration: 16 });
  const cardAt = Math.max(titleAt + 20, w('s01-02', 'hallazgo') - 10);
  const clockOut = progress(frame, cardAt - 10, 14, EASE.inOut);
  const toTop = progress(frame, readersCue - 26, 26, EASE.inOut);

  // ---- Rain.
  const rainBase = 1 - 0.72 * progress(frame, titleAt - 8, 18, EASE.inOut);
  const rainOpacity = rainBase * (1 - 0.8 * progress(frame, cardAt - 10, 20, EASE.inOut));
  const labelAt = Math.max(day + 8, w('s01-01', 'llueven') - 10);
  const labelOut = progress(frame, titleAt - 4, 12, EASE.inOut);

  // ---- Finding card, readers, copies.
  const cardIn = frame < cardAt ? 0 : progress(frame, cardAt, 18);
  const cardTop = mix(CARD_MID_TOP, CARD.top, toTop);
  const readerAt = S01.readers.map((r) => w('s01-03', r.word) - 10);
  const split = progress(frame, differ - 4, 30, EASE.inOut);
  const slotIn = progress(frame, differ + 18, 16);
  const chipAt = S01.promise.map((c) => w('s01-04', c.word) - 8);
  const chipsDim = 0.55 * progress(frame, differ - 4, 16);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <EnvelopeRain frame={frame} from={day - 4} count={32} opacity={rainOpacity} calm={0} />

      {/* Who and where, and the date */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: stripIn * (1 - toTop) }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 16, height: 58, boxSizing: 'border-box', padding: '8px 30px 0', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.4)}`, background: alpha(C.ink950, 0.85), fontSize: 32, whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 850, color: C.textStrong }}>{S01.context[0]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 700, color: C.text }}>{S01.context[1]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 800, color: analystLit > 0.5 ? C.cyanSoft : C.text, opacity: 0.65 + 0.35 * analystLit }}>{S01.context[2]}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 58, boxSizing: 'border-box', padding: '0 24px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.amber, 0.6)}`, background: alpha(C.amber, 0.1), fontSize: 32, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap', ...dateIn }}>
          <Icon name="clock" size={30} color={C.amber} />
          {S01.date}
        </div>
      </div>

      {/* The clock at 06:00 UTC */}
      {clockOut < 1 ? (
        <div style={{ position: 'absolute', left: CLOCK.cx - CLOCK.r - 20, top: CLOCK.cy - CLOCK.r - 20, width: 2 * CLOCK.r + 40, height: 2 * CLOCK.r + 40, opacity: (1 - clockOut) * (1 - 0.7 * titleP), transform: `scale(${1 - 0.1 * clockOut})` }}>
          <svg width={2 * CLOCK.r + 40} height={2 * CLOCK.r + 40} viewBox={`${-CLOCK.r - 20} ${-CLOCK.r - 20} ${2 * CLOCK.r + 40} ${2 * CLOCK.r + 40}`} style={{ position: 'absolute', inset: 0 }}>
            <circle r={CLOCK.r + 10 + 6 * beat} fill="none" stroke={alpha(C.amber, 0.12 + 0.1 * beat)} strokeWidth={3} />
            <circle r={CLOCK.r} fill={alpha(C.ink950, 0.92)} stroke={C.amber} strokeWidth={5} />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1={0} y1={-CLOCK.r + 8} x2={0} y2={-CLOCK.r + (i % 3 === 0 ? 26 : 16)} stroke={alpha(C.amber, i % 3 === 0 ? 0.9 : 0.5)} strokeWidth={i % 3 === 0 ? 5 : 3} strokeLinecap="round" transform={`rotate(${i * 30})`} />
            ))}
            {/* 06:00: minute hand up, hour hand down */}
            <line x1={0} y1={0} x2={0} y2={-CLOCK.r + 40} stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" />
            <line x1={0} y1={0} x2={0} y2={CLOCK.r - 58} stroke={C.amber} strokeWidth={8} strokeLinecap="round" />
            <circle r={8} fill={C.amber} />
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 2 * CLOCK.r + 40 + 14, textAlign: 'center', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 76, fontWeight: 850, color: C.textStrong, letterSpacing: -1, textShadow: `0 0 24px ${alpha(C.ink950, 1)}, 0 0 8px ${alpha(C.ink950, 1)}` }}>{S01.clock.time}</span>
            <span style={{ marginLeft: 14, fontSize: 44, fontWeight: 800, color: C.amber, textShadow: `0 0 18px ${alpha(C.ink950, 1)}` }}>{S01.clock.zone}</span>
          </div>
        </div>
      ) : null}

      {/* What the rain is */}
      {frame >= labelAt && labelOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 566, width: W, display: 'flex', justifyContent: 'center', opacity: (1 - labelOut) * progress(frame, labelAt, 14), transform: `translateY(${(1 - progress(frame, labelAt, 14)) * 16}px)` }}>
          <div style={{ padding: '10px 32px 12px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.amber, 0.6)}`, background: alpha(C.ink950, 0.92), fontSize: 38, fontWeight: 750, color: C.amber, whiteSpace: 'nowrap' }}>{S01.rainLabel}</div>
        </div>
      ) : null}

      {/* Title */}
      {titleP > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: mix(78, 0, toTop),
            width: W,
            textAlign: 'center',
            opacity: titleP,
            transform: `translateY(${(1 - titleP) * 18}px)`,
          }}
        >
          <div style={{ display: 'inline-block', padding: '4px 30px 10px', borderRadius: RADIUS.lg, background: `radial-gradient(closest-side, ${alpha(C.ink950, 0.9)} 70%, transparent 100%)` }}>
            <div style={{ fontSize: mix(96, 66, toTop), lineHeight: 1.08, fontWeight: 850, letterSpacing: -1.8, color: C.textStrong, whiteSpace: 'nowrap', textShadow: `0 0 36px ${alpha(C.cyan, 0.28)}` }}>
              <span style={{ color: C.cyan }}>Escribir</span> para quien decide
            </div>
            <div style={{ marginTop: mix(8, 0, toTop), fontSize: mix(46, 34, toTop), fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap', ...subIn }}>{S01.sub}</div>
          </div>
        </div>
      ) : null}

      {/* The single finding, tied to its three readers */}
      <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {S01.readers.map((r, i) => {
          const p = progress(frame, readerAt[i] + 4, 22, EASE.inOut);
          const x0 = W / 2;
          const y0 = CARD.top + CARD.h;
          const x1 = READER_X[i];
          const y1 = READER_TOP + 8;
          const d = `M${x0} ${y0} C${x0} ${y0 + 90} ${x1} ${y1 - 90} ${x1} ${y1}`;
          const fade = 1 - split;
          return (
            <path key={r.kind} d={d} fill="none" stroke={alpha(C.cyan, 0.5 * fade)} strokeWidth={4} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - p)} opacity={cardIn} />
          );
        })}
        {/* after the split: a short arrow from each copy down to its reader */}
        {S01.readers.map((r, i) => {
          const a = progress(frame, differ + 6, 18);
          const x = READER_X[i];
          return <path key={r.kind} d={`M${x} ${SLOT.top + SLOT.h + 4} L${x} ${READER_TOP - 2}`} stroke={alpha(C.cyan, 0.6)} strokeWidth={4} strokeLinecap="round" opacity={a} />;
        })}
      </svg>

      {cardIn > 0 ? (
        <>
          {[0, 1, 2].map((i) => {
            if (i !== 1 && split <= 0.001) return null;
            const cx = mix(W / 2, READER_X[i], i === 1 ? 0 : split);
            return (
              <div key={i} style={{ position: 'absolute', left: cx - CARD.w / 2, top: cardTop, opacity: i === 1 ? cardIn : cardIn * Math.min(1, split * 3) }}>
                <FindingCard />
              </div>
            );
          })}
          {/* the empty slots */}
          {slotIn > 0 ? (
            <>
              {READER_X.map((x, i) => (
                <div key={i} style={{ position: 'absolute', left: x - SLOT.w / 2, top: SLOT.top, width: SLOT.w, height: SLOT.h, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.cyan, 0.65)}`, display: 'grid', placeItems: 'center', fontSize: 34, fontWeight: 800, color: alpha(C.cyanSoft, 0.8), opacity: slotIn, transform: `scale(${0.9 + 0.1 * slotIn})` }}>
                  ?
                </div>
              ))}
            </>
          ) : null}
        </>
      ) : null}

      {/* The three readers */}
      {S01.readers.map((r, i) => {
        const e = enter(frame, readerAt[i], { distance: 26, duration: 18 });
        const on = progress(frame, readerAt[i], 12);
        const soft = progress(frame, (readerAt[i + 1] ?? promise) - 4, 14);
        return (
          <div key={r.kind} style={{ position: 'absolute', left: READER_X[i] - 210, top: READER_TOP, width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, ...e, opacity: e.opacity * (1 - 0.25 * soft) }}>
            <Silhouette kind={r.kind} size={128} glow={0.7 * on * (1 - soft)} />
            <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.1 }}>{r.name}</div>
            {r.role ? <div style={{ fontSize: 30, fontWeight: 650, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{r.role}</div> : null}
          </div>
        );
      })}

      {/* The promise */}
      <div style={{ position: 'absolute', left: 0, top: PROMISE_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 16 }}>
        {S01.promise.map((c, i) => {
          const e = enter(frame, chipAt[i], { distance: 16 });
          const on = progress(frame, chipAt[i], 10) * (1 - 0.5 * progress(frame, (chipAt[i + 1] ?? differ) - 2, 12, EASE.inOut));
          return (
            <div key={c.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 60, boxSizing: 'border-box', padding: '0 24px 0 16px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`, background: alpha(C.cyan, 0.07 + 0.12 * on), boxShadow: on > 0.02 ? `0 0 ${Math.round(20 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined, fontSize: 30, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', ...e, opacity: e.opacity * (1 - chipsDim) }}>
              <span style={{ width: 34, height: 34, borderRadius: 17, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.2), border: `2px solid ${alpha(C.cyan, 0.7)}`, fontSize: 22, fontWeight: 900, color: C.cyanSoft }}>{i + 1}</span>
              {c.text}
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

/** The one finding: a card with a magnifier. */
function FindingCard() {
  return (
    <div style={{ width: CARD.w, height: CARD.h, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.85)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.16)} 0%, ${alpha(C.ink900, 0.97)} 70%)`, boxShadow: `0 0 40px ${alpha(C.cyan, 0.22)}, 0 22px 50px ${alpha('#000000', 0.45)}`, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <Icon name="search" size={58} color={C.cyan} strokeWidth={2} />
      <span style={{ fontSize: 52, fontWeight: 850, color: C.textStrong, letterSpacing: -0.6 }}>{S01.finding}</span>
    </div>
  );
}
