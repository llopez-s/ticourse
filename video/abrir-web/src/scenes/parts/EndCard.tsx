import { BrandMark } from '../../../../engine/src/overlay/ChapterRail';
import { C, FONT, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../engine/src/ui';
import { isElevenLabsVoice } from '../../../../engine/src/timeline/voice';
import { TIMELINE } from '../../timeline/load';
import { END, NEXT, PIECES } from './data';
import { RibbonBox } from './Ribbon';

const CARD_W = 1560;
const CARD_TOP = 100;
const CARD_H = 500;

/** The practice pill: «Práctica · Diagnóstico de conectividad». A pill centred at `top` (stage-local). */
export function PracticePill({ frame, fps, at, top, width = 1728 }: { frame: number; fps: number; at: number; top: number; width?: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top, width, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '14px 36px 14px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="terminal" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
      </div>
    </div>
  );
}

/**
 * Closing card (the series' layout): the five pieces lit as the video's image, ALERTÓPOLIS, the title and the
 * practice button, a neutral objective chip and the disclaimer. Everything is in by `at` + ~35 and holds to the
 * last frame. It sits at y 100-600 so the permanent seal (y 616) stays visible.
 */
export function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at - 4, { distance: 20 });
  const brand = enter(frame, at - 4, { distance: 16 });
  const title = enter(frame, at - 2, { distance: 24 });
  const cta = enter(frame, at + 6, { distance: 18 });
  const chips = enter(frame, at + 10, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18);
  const disclaimer = enter(frame, at + 14, { distance: 12 });
  const sentences = END.disclaimer.split('. ');
  return (
    <div
      style={{
        position: 'absolute',
        left: (1728 - CARD_W) / 2,
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 64,
        padding: '0 64px',
        borderRadius: 36,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, cardIn * 1.4),
        transform: `scale(${0.94 + 0.06 * cardIn})`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
      {/* the five pieces, lit: the video's image */}
      <div style={{ position: 'relative', width: 300, height: 5 * 70 + 4 * 14, flexShrink: 0, ...art }}>
        {PIECES.map((p, i) => (
          <RibbonBox key={p} piece={p} rect={{ x: 0, y: i * 84, w: 300, h: 70 }} lit={progress(frame, at + 2 + i * 4, 12)} fontSize={38} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 70, fontWeight: 850, letterSpacing: -2, lineHeight: 1.08, color: C.cyan, whiteSpace: 'nowrap', ...title }}>{END.title}</div>
        <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 26px 10px 20px', borderRadius: 28, border: `3px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.08), fontSize: 42, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="terminal" size={40} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 20, display: 'flex', ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 12, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, whiteSpace: 'nowrap', ...disclaimer }}>
          {sentences.map((s, k) => (
            <div key={k}>{k < sentences.length - 1 ? `${s}.` : s}</div>
          ))}
          {isElevenLabsVoice(TIMELINE.voice) ? <div>Voz: ElevenLabs.</div> : null}
        </div>
      </div>
    </div>
  );
}
