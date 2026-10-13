import { BrandMark } from '../../../../../engine/src/overlay/ChapterRail';
import { C, FONT, STAGE, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';
import { isElevenLabsVoice } from '../../../../../engine/src/timeline/voice';
import { END, NEXT } from '../../../data/s06-recap';
import { TIMELINE } from '../../../timeline/load';
import { Shop } from '../Shop';

const W = STAGE.width;
const VIOLET_SOFT = '#c4b5fd';

/** The one next step: Lab 2C. A pill centred in the stage, from `at`. */
export function NextAction({ frame, fps, at, top }: { frame: number; fps: number; at: number; top: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
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
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
      </div>
    </div>
  );
}

const CARD_W = 1620;
const ART_W = 600;
/** The channel's pulses stand still on the end card (nothing moves once it has landed). */
const STILL_PHASE = 0.62;

/**
 * Where the video ends: the whole shop, with everything it taught lit at once. The tape, the alarm
 * and its camera (cyan: they look), the safe closed (emerald) and the suspect still on his walkie
 * (amber): the question stays open, nothing is cut and nothing is decided.
 */
function ShopBig({ halo }: { halo: number }) {
  return (
    <div style={{ position: 'relative', width: ART_W }}>
      <div style={{ position: 'absolute', left: -40, top: -90, width: ART_W + 80, height: 480, background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.13 * halo)} 0%, transparent 100%)` }} />
      <Shop width={ART_W} phase={STILL_PHASE} tape={1} tapeWound={0.9} alarm={1} camera={1} live={1} safe={1} suspect={1} channel={{ draw: 1, talk: 1 }} style={{ position: 'relative' }} />
    </div>
  );
}

/**
 * Closing card (the series' layout): the shop; ALERTÓPOLIS, the video's title, the next step, the
 * objective and the disclaimer. Everything is in by `at` + ~35 and nothing moves or fades afterwards:
 * it holds to the scene's last frame (the music tail).
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
        left: (W - CARD_W) / 2,
        top: 24,
        width: CARD_W,
        height: STAGE.height - 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 48,
        padding: '0 52px 0 44px',
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
      <div style={{ flexShrink: 0, width: ART_W, ...art }}>
        <ShopBig halo={0.35 + 0.65 * progress(frame, at + 4, 22)} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 76, fontWeight: 850, letterSpacing: -2, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ color: VIOLET_SOFT }}>{END.title[0]}</div>
          <div>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={38} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 22, display: 'flex', ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 22, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        {/* One sentence per line, so the last word is never left alone on a second line */}
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
