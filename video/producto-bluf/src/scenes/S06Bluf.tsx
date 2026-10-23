import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { Stage, segment, wordFrame } from './kit';

const S = 's06-bluf';
const W = STAGE.width;

/** The six layers, from the judgment to the annexes (lesson s5m2, first paragraph). */
const LAYERS = ['juicio principal (con confianza)', 'hallazgos clave', 'evidencia / análisis', 'implicaciones', 'recomendaciones', 'anexos técnicos'] as const;
const LAYER = { x: 150, w: W - 300, top: 348, h: 46, gap: 4 } as const;

// The mock report on the left (grey blocks only: no legible text).
const MOCK = { x: 130, top: 276, w: 520, h: 372 } as const;

/**
 * s06-bluf «Arriba del todo». VELVET CICADA's message owns the top band, so everything starts
 * under it.
 *   chrono     a report made only of grey blocks in a column on a timeline, labelled «cronología»;
 *              a «30 s» clock runs down beside it and a thumb decides «sigo / paro».
 *   bluf-def   the report comes again with its conclusion on top (cyan) and the word BLUF, big,
 *              with «Bottom Line Up Front» under it.
 *   headline   a newspaper in miniature beside the word.
 *   order      the word and the paper step up; below them the six layers stack, from the main
 *              judgment (with confidence) to the technical annexes.
 *   rest       the reader stops after the first layer: «ya tiene lo importante»; the rest steps back.
 */
export function S06Bluf(props: SceneProps) {
  const frame = useCurrentFrame();
  const chrono = props.cue('chrono');
  const blufDef = props.cue('bluf-def');
  const headline = props.cue('headline');
  const order = props.cue('order');
  const rest = props.cue('rest');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const s1 = segment(props, 's06-01');

  // ---- Phase 1: the chronology, the clock, the thumb.
  const mockIn = progress(frame, 4, 18);
  const labelIn = progress(frame, Math.max(chrono, w('s06-01', 'cronología') - 10), 14);
  const clockAt = w('s06-01', 'treinta') - 6;
  const clockIn = progress(frame, clockAt, 16);
  const run = progress(frame, clockAt + 6, 100, EASE.linear);
  const thumbAt = w('s06-01', 'saber') - 10;
  const thumbIn = progress(frame, thumbAt, 16);
  const pick = progress(frame, w('s06-01', 'seguir') - 6, 14, EASE.inOut);
  const phase1Out = progress(frame, blufDef - 8, 14, EASE.inOut);

  // ---- Phase 2: conclusion first, the word, the paper.
  const mock2In = progress(frame, blufDef - 2, 18);
  const wordIn = progress(frame, w('s06-02', 'BLUF') - 6, 14);
  const subIn = progress(frame, w('s06-02', 'bottom') - 6, 14);
  const paperIn = progress(frame, headline - 2, 18);

  // ---- Phase 3: the six layers.
  const orderP = progress(frame, order - 10, 26, EASE.inOut);
  const layerAt = LAYERS.map((_, i) => order + 4 + i * 8);
  const stop = progress(frame, rest - 4, 14);
  const wordsAt = [w('s06-04', 'juicio'), w('s06-04', 'anexos')];
  const sweep = progress(frame, wordsAt[0] - 4, wordsAt[1] - wordsAt[0] + 20, EASE.inOut);
  void s1;

  // The word group: big in the middle of the stage, then a compact row above the layers.
  const groupX = mix(760, 548, orderP);
  const groupY = mix(246, 188, orderP);
  const groupScale = mix(1, 0.52, orderP);
  const paperX = mix(1400, 1023, orderP);
  const paperY = mix(246, 190, orderP);
  const paperScale = mix(1, 0.52, orderP);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* The chronology report */}
      {phase1Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - phase1Out) * mockIn }}>
          <ChronoReport x={MOCK.x} y={MOCK.top} w={MOCK.w} h={MOCK.h} />
          <div style={{ position: 'absolute', left: MOCK.x, top: MOCK.top - 62, opacity: labelIn }}>
            <div style={{ display: 'inline-block', padding: '3px 24px 6px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.muted, 0.8)}`, background: alpha(C.ink900, 0.9), fontSize: 38, fontWeight: 800, color: C.text }}>cronología</div>
          </div>
          {/* the 30 s clock */}
          <div style={{ position: 'absolute', left: 780, top: 330, opacity: clockIn, transform: `scale(${0.9 + 0.1 * clockIn})` }}>
            <Clock30 run={run} />
          </div>
          {/* the thumb */}
          <div style={{ position: 'absolute', left: 1180, top: 336, opacity: thumbIn, transform: `translateY(${(1 - thumbIn) * 16}px)` }}>
            <Thumb pick={pick} />
          </div>
        </div>
      ) : null}

      {/* The word BLUF and the paper */}
      {mock2In > 0 ? (
        <div style={{ position: 'absolute', left: MOCK.x, top: MOCK.top, opacity: mock2In * (1 - orderP), transform: `translateX(${-orderP * 60}px)` }}>
          <ConclusionReport w={MOCK.w} h={MOCK.h} />
        </div>
      ) : null}
      {wordIn > 0 ? (
        <div style={{ position: 'absolute', left: groupX, top: groupY, transform: `scale(${groupScale})`, transformOrigin: '0 0', opacity: wordIn, whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 196, lineHeight: 0.95, fontWeight: 900, letterSpacing: -3, color: C.cyan, textShadow: `0 0 50px ${alpha(C.cyan, 0.35)}`, transform: `translateY(${(1 - wordIn) * 24}px)` }}>BLUF</div>
          <div style={{ marginTop: 10, fontSize: 60, fontWeight: 800, color: C.textStrong, opacity: subIn, transform: `translateY(${(1 - subIn) * 12}px)` }}>Bottom Line Up Front</div>
        </div>
      ) : null}
      {paperIn > 0 ? (
        <div style={{ position: 'absolute', left: paperX, top: paperY, transform: `scale(${paperScale}) rotate(${(1 - paperIn) * 6 + 2}deg)`, transformOrigin: '0 0', opacity: paperIn }}>
          <Newspaper />
        </div>
      ) : null}

      {/* The six layers */}
      {LAYERS.map((text, i) => {
        const e = enter(frame, layerAt[i], { distance: 26, duration: 16 });
        const first = i === 0;
        const tone = first ? C.cyan : C.muted;
        const tint = first ? 0.2 : Math.max(0.05, 0.12 - i * 0.015);
        const dimmed = i > 0 ? 0.5 * stop : 0;
        const glow = first ? stop : 0;
        const swept = progress(frame, wordsAt[0] + (i / 5) * (wordsAt[1] - wordsAt[0]) - 6, 12) * (1 - progress(frame, wordsAt[0] + ((i + 1) / 5) * (wordsAt[1] - wordsAt[0]) + 10, 12)) * sweep;
        return (
          <div key={text} style={{ position: 'absolute', left: LAYER.x, top: LAYER.top + i * (LAYER.h + LAYER.gap), width: LAYER.w, height: LAYER.h, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', borderRadius: RADIUS.md, border: `2px solid ${alpha(tone, first ? 0.9 : 0.45 + 0.3 * swept)}`, background: alpha(tone, tint + 0.1 * swept), boxShadow: glow > 0.05 ? `0 0 ${Math.round(30 * glow)}px ${alpha(C.cyan, 0.3 * glow)}` : undefined, ...e, opacity: e.opacity * (1 - dimmed) }}>
            <span style={{ width: 34, height: 34, borderRadius: 17, display: 'grid', placeItems: 'center', flexShrink: 0, background: alpha(tone, 0.2), border: `2px solid ${alpha(tone, 0.8)}`, fontSize: 22, fontWeight: 900, color: first ? C.cyanSoft : C.text }}>{i + 1}</span>
            <span style={{ fontSize: 36, fontWeight: first ? 850 : 700, color: first ? C.textStrong : C.text, whiteSpace: 'nowrap' }}>{text}</span>
          </div>
        );
      })}

      {/* The reader stops after the first layer */}
      {stop > 0 ? (
        <div style={{ position: 'absolute', left: LAYER.x + LAYER.w - 520, top: LAYER.top - 6, opacity: stop, transform: `translateX(${(1 - stop) * 24}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '6px 24px 8px 18px', borderRadius: RADIUS.pill, border: `2px solid ${C.emerald}`, background: alpha(C.ink950, 0.94), fontSize: 34, fontWeight: 800, color: C.emerald, whiteSpace: 'nowrap', boxShadow: `0 0 26px ${alpha(C.emerald, 0.3)}` }}>
            <Icon name="check" size={36} color={C.emerald} strokeWidth={2.6} />
            ya tiene lo importante
          </div>
        </div>
      ) : null}
      {stop > 0 ? (
        <div style={{ position: 'absolute', left: LAYER.x, top: LAYER.top + LAYER.h + 1, width: LAYER.w * stop, height: 0, borderTop: `4px dashed ${alpha(C.emerald, 0.85)}` }} />
      ) : null}
    </Stage>
  );
}

/** A report that tells things in the order they happened: a timeline of grey blocks. */
function ChronoReport({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const rows = [0.92, 0.7, 0.84, 0.6, 0.88, 0.5, 0.78, 0.66, 0.82, 0.4];
  const rh = (h - 28) / rows.length;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.muted, 0.55)}`, background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`, boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}` }}>
      <div style={{ position: 'absolute', left: 42, top: 18, bottom: 18, width: 4, borderRadius: 2, background: alpha(C.muted, 0.45) }} />
      {rows.map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: 30, top: 14 + i * rh + rh / 2 - 9, width: 28, height: 18, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: C.ink800, border: `3px solid ${alpha(C.muted, 0.75)}` }} />
        </div>
      ))}
      {rows.map((r, i) => (
        <div key={i} style={{ position: 'absolute', left: 78, top: 14 + i * rh + rh / 2 - 15, width: (w - 78 - 30) * r, height: 30, borderRadius: 8, background: alpha(C.muted, 0.3) }} />
      ))}
    </div>
  );
}

/** The same report with the conclusion on top: one tall cyan block, then the support in grey. */
function ConclusionReport({ w, h }: { w: number; h: number }) {
  const rows = [0.9, 0.7, 0.84, 0.6, 0.76];
  return (
    <div style={{ position: 'relative', width: w, height: h, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.7)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.1)} 0%, ${C.ink850} 40%)`, boxShadow: `0 0 40px ${alpha(C.cyan, 0.2)}, 0 20px 50px ${alpha('#000000', 0.4)}` }}>
      <div style={{ position: 'absolute', left: 28, right: 28, top: 28, height: 108, borderRadius: 12, background: alpha(C.cyan, 0.34), border: `3px solid ${C.cyan}`, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ width: '70%', height: 20, borderRadius: 6, background: alpha(C.textStrong, 0.85) }} />
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ position: 'absolute', left: 28, top: 164 + i * 38, width: (w - 56) * r, height: 22, borderRadius: 6, background: alpha(C.muted, 0.28) }} />
      ))}
    </div>
  );
}

/** A 30-second clock that runs down (`run` 0–1). */
function Clock30({ run }: { run: number }) {
  const r = 100;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 240, height: 240 }}>
      <svg width={240} height={240} viewBox="-120 -120 240 240">
        <circle r={r} fill={alpha(C.ink950, 0.9)} stroke={C.ink600} strokeWidth={14} />
        <circle r={r} fill="none" stroke={C.amber} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${c * (1 - run)} ${c}`} transform="rotate(-90)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 72, fontWeight: 900, color: C.textStrong, letterSpacing: -1 }}>
        <span>30 <span style={{ fontSize: 48, color: C.amber }}>s</span></span>
      </div>
    </div>
  );
}

/** The thumb that decides: up = «sigo», down = «paro»; `pick` 1 lights «sigo» (the voice: «seguir leyendo»). */
function Thumb({ pick }: { pick: number }) {
  const upOn = 0.7 + 0.3 * pick;
  const downOn = 0.7 - 0.4 * pick;
  return (
    <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
      {[
        { label: 'sigo', tone: C.emerald, on: upOn, down: false },
        { label: 'paro', tone: C.rose, on: downOn, down: true },
      ].map((t) => (
        <div key={t.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 0.4 + 0.6 * t.on, transform: `scale(${0.92 + 0.12 * t.on})` }}>
          <svg width={150} height={150} viewBox="0 0 24 24" fill="none" stroke={t.tone} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 ${Math.round(18 * t.on)}px ${alpha(t.tone, 0.4)})` }}>
            {t.down ? (
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            ) : (
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            )}
          </svg>
          <div style={{ fontSize: 48, fontWeight: 850, color: t.tone }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

/** A newspaper in miniature: masthead, a big headline, a picture and columns. No legible text but the label. */
function Newspaper() {
  return (
    <div style={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 300, height: 232, boxSizing: 'border-box', padding: 18, borderRadius: 10, background: '#e8edf5', boxShadow: `0 20px 40px ${alpha('#000000', 0.5)}` }}>
        <div style={{ height: 12, borderRadius: 3, background: '#334155', width: '46%', margin: '0 auto 10px' }} />
        <div style={{ height: 3, background: '#334155', marginBottom: 10 }} />
        <div style={{ height: 26, borderRadius: 4, background: '#0f172a', marginBottom: 8 }} />
        <div style={{ height: 26, borderRadius: 4, background: '#0f172a', width: '70%', marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 96, height: 70, borderRadius: 4, background: '#94a3b8' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[1, 0.85, 1, 0.7, 0.9, 0.6].map((k, i) => (
              <div key={i} style={{ height: 6, width: `${k * 100}%`, borderRadius: 3, background: '#94a3b8' }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: C.text }}>el titular</div>
    </div>
  );
}
