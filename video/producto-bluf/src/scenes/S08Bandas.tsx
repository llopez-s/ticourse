import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { Silhouette, StormIcon } from './parts/Icons';
import { Stage, wordFrame } from './kit';

const S = 's08-bandas';
const W = STAGE.width;

/** The ICD 203 table of the lesson (s5m2), top to bottom = high to low. `a`–`b` is the band on the 0–100 scale. */
const BANDS = [
  { words: 'almost certain / nearly certain', pct: '95–99%', a: 95, b: 99 },
  { words: 'very likely / highly probable', pct: '80–95%', a: 80, b: 95 },
  { words: 'likely / probable', pct: '55–80%', a: 55, b: 80 },
  { words: 'roughly even chance', pct: '45–55%', a: 45, b: 55 },
  { words: 'unlikely / improbable', pct: '20–45%', a: 20, b: 45 },
  { words: 'very unlikely / highly improbable', pct: '05–20%', a: 5, b: 20 },
  { words: 'almost no chance / remote', pct: '01–05%', a: 1, b: 5 },
] as const;

// The vertical scale (a proportional bar) and the seven rows to its right.
const BAR = { x: 24, w: 46, top: 40, h: 580 } as const;
const ROW = { x: 190, w: 960, top: 40, h: 72, gap: 8 } as const;
const yOf = (v: number) => BAR.top + ((100 - v) / 100) * BAR.h;
const rowY = (i: number) => ROW.top + i * (ROW.h + ROW.gap);
const RIGHT_X = 1220;

/**
 * s08-bandas «Un número detrás de cada palabra».
 *   words    two faceless readers hear the same word, «probable», and each imagines a different
 *            figure: a «?» marker at a different place on a bar, never a number.
 *   icd      «ICD 203 · comunidad de inteligencia de EE. UU.» takes the middle of the stage.
 *   table    the readers leave: a proportional 0–100 bar with seven bands on the left and the
 *            lesson's table (character for character) in seven rows tied to it; a small weather
 *            icon beside it.
 *   likely / vlikely / unlikely   the band the voice names lights (55–80 %, then 80–95 %, then
 *            20–45 % and, on «almost certain», 95–99 %); the rest steps back.
 *   memo     all seven lit and the chip «Nota de examen · memoriza las bandas».
 */
export function S08Bandas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = props.cue('words');
  const icd = props.cue('icd');
  const table = props.cue('table');
  const likely = props.cue('likely');
  const vlikely = props.cue('vlikely');
  const unlikely = props.cue('unlikely');
  const memo = props.cue('memo');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- Phase A: the same word, two figures.
  const wordIn = progress(frame, words - 6, 18);
  const bubbleAt = [w('s08-01', 'número') - 8, w('s08-01', 'distintas') - 20];
  const toTable = progress(frame, table - 14, 22, EASE.inOut);

  // ---- ICD badge.
  const icdIn = progress(frame, icd - 4, 18);
  const icdPhaseA = progress(frame, icd - 8, 18, EASE.inOut);
  const badgeTop = progress(frame, table - 6, 26, EASE.inOut);
  const bandsAt = w('s08-02', 'bandas') - 6;
  const cadaAt = w('s08-02', 'Cada') - 6;

  // ---- Table.
  const rowAt = BANDS.map((_, i) => table + 4 + i * 7);
  const almost = w('s08-05', 'almost') - 8;
  const lit = BANDS.map(() => 0);
  const win = (from: number, to: number) => windowWeight(frame, from, to, { ramp: 12, lead: 4 });
  lit[2] = win(likely - 2, vlikely - 2);
  lit[1] = win(vlikely - 2, unlikely - 2);
  lit[4] = win(unlikely - 2, almost);
  lit[0] = win(almost, memo - 2);
  const all = progress(frame, memo - 4, 20);
  const anyLit = Math.max(...lit, all);
  const weather = progress(frame, table + 20, 18);
  const chip = progress(frame, w('s08-06', 'imprescindibles') - 20, 16);
  const beat = pulse(frame, fps, 0.6);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* Phase A: the same word for two readers */}
      {icdPhaseA < 0.99 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - icdPhaseA }}>
          {/* the word, on the report both read */}
          <div style={{ position: 'absolute', left: W / 2 - 300, top: 90, width: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: wordIn, transform: `translateY(${(1 - wordIn) * 16}px)` }}>
            <div style={{ fontSize: 28, fontWeight: 850, letterSpacing: 4, color: C.faint, textTransform: 'uppercase', marginBottom: 6 }}>el mismo informe</div>
            <div style={{ padding: '6px 52px 14px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.1), fontSize: 120, fontWeight: 900, letterSpacing: -2, color: C.textStrong, boxShadow: `0 0 50px ${alpha(C.cyan, 0.22)}` }}>probable</div>
          </div>
          {[0, 1].map((i) => {
            const x = i === 0 ? 330 : W - 330;
            const e = enter(frame, bubbleAt[i], { distance: 24, duration: 18 });
            const marker = i === 0 ? 0.5 : 0.86;
            return (
              <div key={i}>
                <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                  <path d={`M${W / 2 + (i === 0 ? -150 : 150)} 296 C${W / 2 + (i === 0 ? -150 : 150)} 380 ${x} 330 ${x} 392`} fill="none" stroke={alpha(C.cyan, 0.5)} strokeWidth={4} strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - progress(frame, bubbleAt[i] - 10, 24, EASE.inOut))} />
                </svg>
                {/* the thought: a «?» on a bar */}
                <Silhouette kind="reader" size={180} tone={C.cyan} style={{ position: 'absolute', left: x - 90, top: 400 }} />
                <div style={{ position: 'absolute', left: x - 210, top: 232, width: 420, height: 130, boxSizing: 'border-box', padding: '20px 30px', borderRadius: 40, border: `3px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.ink900, 0.96), ...e }}>
                  <div style={{ position: 'relative', height: 26, marginTop: 28 }}>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 6, borderRadius: 3, background: C.ink600 }} />
                    <div style={{ position: 'absolute', left: `calc(${marker * 100}% - 28px)`, top: -22, width: 56, height: 56, borderRadius: 28, display: 'grid', placeItems: 'center', background: C.ink950, border: `4px solid ${C.amber}`, fontSize: 38, fontWeight: 900, color: C.amber, boxShadow: `0 0 18px ${alpha(C.amber, 0.4)}` }}>?</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ICD 203 */}
      {icdIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: mix(W / 2 - 520, RIGHT_X, badgeTop),
            top: mix(206, 24, badgeTop),
            width: mix(1040, W - RIGHT_X, badgeTop),
            display: 'flex',
            flexDirection: 'column',
            alignItems: badgeTop > 0.5 ? 'flex-start' : 'center',
            opacity: icdIn,
            transform: `translateY(${(1 - icdIn) * 18}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Icon name="shield" size={mix(96, 60, badgeTop)} color={C.cyan} strokeWidth={1.8} />
            <div style={{ fontSize: mix(130, 76, badgeTop), fontWeight: 900, letterSpacing: -2, color: C.textStrong, lineHeight: 1, whiteSpace: 'nowrap' }}>
              ICD <span style={{ color: C.cyan }}>203</span>
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: mix(52, 36, badgeTop), fontWeight: 750, color: C.cyanSoft, lineHeight: 1.12, textAlign: badgeTop > 0.5 ? 'left' : 'center' }}>comunidad de inteligencia de EE. UU.</div>
        </div>
      ) : null}

      {/* «bandas»: the seven bands as a row, one per expression, under the badge */}
      {icdIn > 0 && badgeTop < 0.98 ? (
        <div style={{ position: 'absolute', left: (W - 1120) / 2, top: 470, width: 1120, opacity: icdIn * (1 - badgeTop) }}>
          <div style={{ display: 'flex', gap: 6, height: 70 }}>
            {[4, 15, 25, 10, 25, 15, 4].map((k, i) => {
              const a = progress(frame, bandsAt + i * 5, 12);
              return <div key={i} style={{ flex: k, borderRadius: 8, background: alpha(C.cyan, 0.12 + 0.05 * i), border: `3px solid ${alpha(C.cyan, 0.6)}`, opacity: a, transform: `scaleY(${0.4 + 0.6 * a})`, transformOrigin: '50% 100%' }} />;
            })}
          </div>
          <div style={{ marginTop: 18, textAlign: 'center', fontSize: 42, fontWeight: 750, color: C.textStrong, opacity: progress(frame, cadaAt, 14), transform: `translateY(${(1 - progress(frame, cadaAt, 14)) * 10}px)` }}>
            cada expresión, <span style={{ color: C.cyan }}>una banda</span> de probabilidad
          </div>
        </div>
      ) : null}

      {/* The proportional scale and the seven rows */}
      {toTable > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: toTable }}>
          <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {BANDS.map((b, i) => {
              const k = Math.max(lit[i], all);
              const y0 = yOf(b.b);
              const y1 = yOf(b.a);
              const strength = 0.22 + 0.5 * ((6 - i) / 6 < 0 ? 0 : 1 - i / 6);
              const rowMid = rowY(i) + ROW.h / 2;
              const bandMid = (y0 + y1) / 2;
              const p = progress(frame, rowAt[i] + 4, 18, EASE.inOut);
              return (
                <g key={b.words}>
                  <rect x={BAR.x} y={y0 + 1} width={BAR.w} height={Math.max(3, y1 - y0 - 2)} rx={4} fill={alpha(C.cyan, anyLit > 0.02 ? 0.16 + 0.8 * k : strength)} stroke={alpha(C.cyan, 0.4 + 0.6 * k)} strokeWidth={2} opacity={0.3 + 0.7 * p} />
                  <path d={`M${BAR.x + BAR.w} ${bandMid} C${BAR.x + BAR.w + 60} ${bandMid} ${ROW.x - 60} ${rowMid} ${ROW.x} ${rowMid}`} fill="none" stroke={alpha(C.cyan, 0.2 + 0.7 * k)} strokeWidth={2 + 2 * k} strokeDasharray="500" strokeDashoffset={500 * (1 - p)} />
                </g>
              );
            })}
            {[0, 100].map((v) => (
              <text key={v} x={BAR.x + BAR.w / 2} y={yOf(v) + (v === 0 ? 34 : -12)} textAnchor="middle" fontFamily={FONT.sans} fontSize={30} fontWeight={800} fill={C.faint}>{v}</text>
            ))}
          </svg>
          {BANDS.map((b, i) => {
            const e = enter(frame, rowAt[i], { distance: 30, axis: 'x', duration: 16 });
            const k = Math.max(lit[i], all);
            const dim = anyLit > 0.02 ? 0.42 + 0.58 * k : 1;
            return (
              <div key={b.words} style={{ position: 'absolute', left: ROW.x, top: rowY(i), width: ROW.w, height: ROW.h, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderRadius: RADIUS.md, border: `3px solid ${alpha(C.cyan, 0.3 + 0.65 * k)}`, background: `linear-gradient(90deg, ${alpha(C.cyan, 0.05 + 0.2 * k)} 0%, ${alpha(C.ink900, 0.96)} 100%)`, boxShadow: k > 0.05 ? `0 0 ${Math.round(34 * k)}px ${alpha(C.cyan, 0.28 * k)}` : undefined, ...e, opacity: e.opacity * dim, transform: `${e.transform} scale(${1 + 0.02 * k})` }}>
                <span style={{ fontSize: 38, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{b.words}</span>
                <span style={{ fontSize: 46, fontWeight: 850, color: C.cyanSoft, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{b.pct}</span>
              </div>
            );
          })}
          {/* the weather icon, small, beside the scale */}
          <div style={{ position: 'absolute', left: RIGHT_X + 120, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: weather, transform: `translateY(${(1 - weather) * 16}px)` }}>
            <StormIcon size={220} variant="warning" tone={C.sky} glow={0.3 + 0.2 * beat} rain={frame} />
            <div style={{ fontSize: 34, fontWeight: 750, color: C.sky, whiteSpace: 'nowrap' }}>como un pronóstico</div>
          </div>
          {/* exam note */}
          {chip > 0 ? (
            <div style={{ position: 'absolute', left: RIGHT_X, top: 520, width: W - RIGHT_X, opacity: chip, transform: `translateY(${(1 - chip) * 16}px)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px 14px 20px', borderRadius: RADIUS.lg, border: `3px solid ${C.sky}`, background: alpha(C.sky, 0.14), fontSize: 36, fontWeight: 800, lineHeight: 1.2, color: C.textStrong }}>
                <Icon name="mortarboard" size={40} color={C.sky} />
                Nota de examen · memoriza las bandas
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}
