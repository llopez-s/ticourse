import { BrandMark } from '../../../../../engine/src/overlay/ChapterRail';
import { C, FONT, STAGE, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';
import { isElevenLabsVoice } from '../../../../../engine/src/timeline/voice';
import { END, NEXT } from '../../../data/s08-cierre';
import { TIMELINE } from '../../../timeline/load';
import { InventoryList } from '../Inventory';
import { Nas } from '../Nas';

const W = STAGE.width;

/** The one next step: the lesson's questions. A pill centred in the stage, from `at`. */
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
const ART_W = 400;
const ART_H = 320;

/**
 * The video's image for the closing card: Sistemas' list with the network disk in front of it, now on the list
 * (emerald check). No names, nothing legible.
 */
export function EndArt({ frame, glow }: { frame: number; glow: number }) {
  return (
    <div style={{ position: 'relative', width: ART_W, height: ART_H }}>
      <div style={{ position: 'absolute', left: 70, top: 0 }}>
        <InventoryList width={330} rows={4} title="lista" columns={false} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 150, filter: `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(C.cyan, 0.4)})` }}>
        <Nas width={200} frame={frame} glow={0.4 * glow} />
      </div>
      <div style={{ position: 'absolute', left: 168, top: 140, width: 56, height: 56, borderRadius: 28, background: C.emeraldDeep, border: `3px solid ${C.emerald}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: glow }}>
        <Icon name="check" size={34} color={C.emerald} strokeWidth={3} />
      </div>
    </div>
  );
}

/**
 * Closing card (the series' layout): the video's image — the list and the network disk, now on it —,
 * ALERTÓPOLIS, the title, the one task «Tu turno: las preguntas de la lección», the objective and the disclaimer.
 * Everything is in by `at` + ~35 and nothing fades afterwards: it holds to the scene's last frame (only the cars move).
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
  const glow = progress(frame, at + 8, 20);
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
        gap: 56,
        padding: '0 56px 0 56px',
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
      <div style={{ flexShrink: 0, ...art }}>
        <EndArt frame={frame} glow={glow} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ fontSize: 72, letterSpacing: -2, lineHeight: 1.05, color: C.cyan }}>{END.title[0]}</div>
          <div style={{ fontSize: 56, letterSpacing: -1.5, lineHeight: 1.1 }}>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 44, fontWeight: 850, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={40} color={C.cyan} strokeWidth={2} />
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
