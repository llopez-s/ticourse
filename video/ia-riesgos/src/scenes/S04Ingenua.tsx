import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, Redacted, clamp01, dimStyle, focusWeights } from '../../../engine/src/ui';
import { HOPE, REASONS } from '../data/s04-ingenua';
import { Stage, overlayWindow, wordFrame } from './kit';

const S = 's04-ingenua';
const W = STAGE.width;
/** The cards live under the intercepted message's band (stage y 10–205) for the whole scene. */
const CARD = { top: 236, w: 544, h: 392, gap: 48 };
const BANNER = { top: 22, h: 180 };

/**
 * s04-ingenua «Por qué no basta». `advice`: BORROWED VOICE's message is the
 * engine's intercept card (top band); under it three numbered slots wait
 * («tres razones»). Then one card at a time: `channel` (defence and attack,
 * two gray sentences in the same pipe), `list` (a list of banned phrases and
 * the same sentence rephrased, translated and split getting round it) and
 * `one-percent` (99 of 100 hold; the one that fails reads everything and
 * takes it out). `hope`: the cards step back and the top band, free again,
 * says «un control» struck out → «una esperanza».
 */
export function S04Ingenua(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const advice = props.cue('advice');
  const at = [props.cue('channel'), props.cue('list'), props.cue('one-percent')];
  const hope = props.cue('hope');
  const tres = wordFrame(S, 's04-01', 'tres');
  const falla = wordFrame(S, 's04-04', 'falla.');
  const fuera = wordFrame(S, 's04-04', 'fuera.');
  const esperanza = wordFrame(S, 's04-05', 'esperanza.');
  const ic = overlayWindow(S);

  const { weights, dims } = focusWeights(frame, at, { end: hope });
  const allDim = progress(frame, hope - 4, 14);
  const bannerIn = springIn(frame, fps, Math.max(hope - 2, ic ? ic.to : 0), { damping: 16 });
  const strike = progress(frame, esperanza - 26, 14, EASE.inOut);
  const hopeWord = enter(frame, esperanza - 6, { distance: 18, axis: 'x' });

  return (
    <Stage>
      {[0, 1, 2].map((i) => {
        const left = i * (CARD.w + CARD.gap);
        const slot = progress(frame, Math.max(advice, tres - 4) + i * 5, 12);
        const p = springIn(frame, fps, at[i] - 4, { damping: 16 });
        const lit = Math.min(1, p * 1.3);
        const glow = weights[i] * (0.75 + 0.25 * pulse(frame, fps, 0.5));
        const d = Math.max(dims[i], 0.5 * allDim) * lit;
        return (
          <div key={i}>
            {lit < 1 && slot > 0.001 ? (
              <div style={{ position: 'absolute', left, top: CARD.top, width: CARD.w, height: CARD.h, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `2px dashed ${C.ink600}`, display: 'grid', placeItems: 'center', opacity: slot * (1 - lit), transform: `translateY(${(1 - slot) * 14}px)`, fontFamily: FONT.sans, fontSize: 96, fontWeight: 850, color: C.ink700 }}>
                {i + 1}
              </div>
            ) : null}
            {lit > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: CARD.top,
                  width: CARD.w,
                  height: CARD.h,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(C.amber, 0.3 + 0.55 * glow)}`,
                  background: `linear-gradient(180deg, ${alpha(C.amber, 0.06 + 0.06 * glow)} 0%, ${alpha(C.ink900, 0.96)} 40%)`,
                  boxShadow: glow > 0.02 ? `0 0 ${Math.round(36 * glow)}px ${alpha(C.amber, 0.25 * glow)}` : `0 18px 44px ${alpha('#000000', 0.3)}`,
                  fontFamily: FONT.sans,
                  overflow: 'hidden',
                  ...dimStyle(d, lit),
                  transform: `translateY(${(1 - p) * 22}px)`,
                }}
              >
                <div style={{ position: 'absolute', left: 26, top: 22, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: glow > 0.3 ? C.amber : alpha(C.amber, 0.18), fontSize: 30, fontWeight: 850, color: glow > 0.3 ? C.ink950 : '#fcd34d' }}>{i + 1}</div>
                  <span style={{ fontSize: 50, fontWeight: 850, letterSpacing: -0.6, color: C.textStrong }}>{REASONS[i].title}</span>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 100, width: CARD.w, height: CARD.h - 100 }}>
                  {i === 0 ? <ChannelArt frame={frame} at={at[0]} /> : null}
                  {i === 1 ? <ListArt frame={frame} at={at[1]} /> : null}
                  {i === 2 ? <OneArt frame={frame} fps={fps} at={at[2]} failAt={falla - 6} outAt={fuera - 10} /> : null}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      {/* hope: the top band, once the intercepted message has gone */}
      {bannerIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: BANNER.top, width: W, height: BANNER.h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: Math.min(1, bannerIn * 1.3), transform: `translateY(${(1 - Math.min(1, bannerIn)) * 18}px)` }}>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.muted }}>{HOPE.lead}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 34, fontSize: 72, fontWeight: 850, letterSpacing: -1.6 }}>
            <span style={{ position: 'relative', color: strike > 0.5 ? C.muted : C.textStrong }}>
              {HOPE.not}
              <span style={{ position: 'absolute', left: -8, top: '54%', height: 7, width: `calc((100% + 16px) * ${strike})`, borderRadius: 4, background: C.rose }} />
            </span>
            <Icon name="arrowRight" size={60} color={C.faint} strokeWidth={2.4} style={{ opacity: hopeWord.opacity }} />
            <span style={{ color: C.amber, ...hopeWord }}>{HOPE.is}</span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Card art. Card-local coordinates: 544 × 292 under the title.
// ---------------------------------------------------------------------------

/** Defence and attack, two gray sentences in the same pipe; nobody knows which wins. */
function ChannelArt({ frame, at }: { frame: number; at: number }) {
  const r = REASONS[0];
  const l = progress(frame, at + 8, 16);
  const rr = progress(frame, at + 20, 16);
  const q = progress(frame, at + 34, 12);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 26, top: 0, opacity: l }}>
        <Chip accent="emerald" icon="shield" size={30}>
          {r.left}
        </Chip>
      </div>
      <div style={{ position: 'absolute', right: 26, top: 0, opacity: rr }}>
        <Chip accent="rose" icon="file" size={30}>
          {r.right}
        </Chip>
      </div>
      {/* the one channel */}
      <div style={{ position: 'absolute', left: 26, top: 80, width: 492, height: 92, boxSizing: 'border-box', borderRadius: 46, border: `3px solid ${C.ink600}`, background: alpha(C.ink800, 0.9) }}>
        <div style={{ position: 'absolute', left: 22 + (1 - l) * -20, top: 34, opacity: l }}>
          <Redacted width={150} height={20} tone="emerald" strength={0.65} />
        </div>
        <div style={{ position: 'absolute', right: 22 + (1 - rr) * -20, top: 34, opacity: rr }}>
          <Redacted width={150} height={20} tone="rose" strength={0.65} />
        </div>
        <div style={{ position: 'absolute', left: 246 - 32, top: 14, width: 64, height: 64, borderRadius: 32, display: 'grid', placeItems: 'center', background: C.ink950, border: `3px solid ${alpha(C.amber, 0.8)}`, opacity: q, transform: `scale(${0.7 + 0.3 * q})`, fontSize: 40, fontWeight: 850, color: C.amber }}>?</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 200, width: 544, textAlign: 'center', fontSize: 38, fontWeight: 750, color: C.text, opacity: q }}>{r.versus}</div>
    </div>
  );
}

/** A list of banned phrases; the same sentence rephrased, translated and split goes round it. */
function ListArt({ frame, at }: { frame: number; at: number }) {
  const r = REASONS[1];
  const wall = progress(frame, at + 6, 14);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 26, top: 0, opacity: wall }}>
        <Chip accent="amber" icon="funnel" size={28}>
          {r.blocked}
        </Chip>
      </div>
      <svg width={544} height={292} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={360} y1={64} x2={360} y2={64 + 210 * wall} stroke={alpha(C.amber, 0.85)} strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />
        {r.variants.map((_, k) => {
          const p = progress(frame, at + 22 + k * 14, 18, EASE.inOut);
          const y = 96 + k * 70;
          // the arrow bends round the wall's end
          const x2 = 300 + 210 * p;
          return p > 0.001 ? (
            <g key={k}>
              <path d={`M 300 ${y} C ${330} ${y}, ${340} ${280}, ${360} ${280} S ${400} ${y}, ${x2} ${y}`} fill="none" stroke={alpha(C.rose, 0.8)} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
              {p > 0.95 ? <path d={`M 498 ${y - 10} L 512 ${y} L 498 ${y + 10}`} fill="none" stroke={C.rose} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
            </g>
          ) : null;
        })}
      </svg>
      {r.variants.map((v, k) => {
        const p = progress(frame, at + 18 + k * 14, 12);
        return (
          <div key={v} style={{ position: 'absolute', left: 26, top: 74 + k * 70, height: 44, display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateX(${(1 - p) * 12}px)`, whiteSpace: 'nowrap' }}>
            <span style={{ width: 176, fontSize: 32, fontWeight: 750, color: C.text }}>{v}</span>
            <Redacted width={90} height={16} tone="rose" strength={0.6} />
          </div>
        );
      })}
    </div>
  );
}

/** 99 of 100 hold; the one that fails reads everything and takes it out. */
function OneArt({ frame, fps, at, failAt, outAt }: { frame: number; fps: number; at: number; failAt: number; outAt: number }) {
  const r = REASONS[2];
  const fill = progress(frame, at + 4, 30, EASE.inOut);
  const fail = progress(frame, failAt, 10);
  const out = progress(frame, outAt, 18, EASE.inOut);
  const P = 17;
  const dots: ReactNode[] = [];
  for (let k = 0; k < 100; k++) {
    const shown = k / 100 < fill;
    const isFail = k === 99;
    const col = isFail && fail > 0.01 ? C.rose : C.emerald;
    const a = shown ? (isFail ? 0.5 + 0.5 * fail * (0.7 + 0.3 * pulse(frame, fps, 0.8)) : 0.75) : 0.12;
    dots.push(<circle key={k} cx={8 + (k % 10) * P} cy={8 + Math.floor(k / 10) * P} r={isFail && fail > 0.01 ? 7 : 5.5} fill={alpha(col, a)} />);
  }
  return (
    <div style={{ position: 'absolute', inset: 0, whiteSpace: 'nowrap' }}>
      <svg width={180} height={180} style={{ position: 'absolute', left: 26, top: 0, overflow: 'visible' }}>
        {dots}
      </svg>
      <div style={{ position: 'absolute', left: 236, top: 20, fontSize: 36, fontWeight: 800, color: '#6ee7b7', opacity: progress(frame, at + 10, 12) }}>{r.tally}</div>
      <div style={{ position: 'absolute', left: 236, top: 80, display: 'flex', alignItems: 'center', gap: 10, fontSize: 36, fontWeight: 850, color: C.roseSoft, opacity: fail }}>
        <Icon name="x" size={34} color={C.rose} strokeWidth={3} />
        {r.fail}
      </div>
      {/* reads everything → takes it out */}
      <div style={{ position: 'absolute', left: 26, top: 206, width: 492, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: clamp01(fail * 1.4) }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 32, fontWeight: 750, color: C.text }}>
          <Icon name="eye" size={36} color={C.rose} />
          {r.reads}
        </span>
        <Icon name="arrowRight" size={40} color={alpha(C.rose, 0.4 + 0.6 * out)} strokeWidth={2.4} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 32, fontWeight: 750, color: out > 0.5 ? C.roseSoft : C.muted, opacity: 0.4 + 0.6 * out }}>
          <Icon name="globe" size={36} color={C.rose} />
          {r.out}
        </span>
      </div>
    </div>
  );
}
