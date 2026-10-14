import { BrandMark } from '../../../../../engine/src/overlay/ChapterRail';
import { C, FONT, STAGE, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';
import { isElevenLabsVoice } from '../../../../../engine/src/timeline/voice';
import { END, NEXT } from '../../../data/s06-recap';
import { TIMELINE } from '../../../timeline/load';
import { CarnetGlyph, TabletGlyph } from '../Glyphs';

const W = STAGE.width;

/** The one next step: finish the lesson. A pill centred in the stage, from `at`. */
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
const ART = { w: 372, h: 430 } as const;

/** Where the video ends: a tablet with its own carné. The halo comes up on `at`. */
function IdentityBig({ frame, at }: { frame: number; at: number }) {
  const halo = 0.35 + 0.65 * progress(frame, at, 22);
  return (
    <svg width={ART.w} height={ART.h} viewBox={`0 0 ${ART.w} ${ART.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="s06-id-halo">
          <stop offset="0%" stopColor={C.emerald} stopOpacity={0.2} />
          <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={ART.w / 2} cy={ART.h / 2} r={214} fill="url(#s06-id-halo)" opacity={halo} />
      <TabletGlyph x={150} y={196} h={300} screen={0.5} />
      <CarnetGlyph x={232} y={300} h={148} glow={0.5 * halo} />
    </svg>
  );
}

/**
 * Closing card (the series' layout): the tablet with its carné; ALERTÓPOLIS, the video's title, the
 * next step, the objective and the disclaimer. Everything is in by `at` + ~35 and nothing moves or
 * fades afterwards: it holds to the scene's last frame (the music tail).
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
        gap: 50,
        padding: '0 56px 0 44px',
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
      <div style={{ flexShrink: 0, width: ART.w, ...art }}>
        <IdentityBig frame={frame} at={at + 8} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ fontSize: 76, letterSpacing: -2, lineHeight: 1.05, color: C.cyan }}>{END.title[0]}</div>
          <div style={{ fontSize: 56, letterSpacing: -1.4, lineHeight: 1.1 }}>{END.title[1]}</div>
          <div style={{ fontSize: 56, letterSpacing: -1.4, lineHeight: 1.1 }}>{END.title[2]}</div>
        </div>
        <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 20, display: 'flex', ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
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
