import { BrandMark } from '../../../../../engine/src/overlay/ChapterRail';
import { C, FONT, STAGE, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';
import { isElevenLabsVoice } from '../../../../../engine/src/timeline/voice';
import { END, NEXT } from '../../../data/s08-cierre';
import { PLAQUE } from '../../../data/vlans';
import { TIMELINE } from '../../../timeline/load';
import { Illustration } from '../Illustration';
import { ImageTag } from '../Tags';

const W = STAGE.width;
const CARD_W = 1620;
const ART = 420;

/**
 * Closing card (the series' layout): the video's image — the floor with its partitions, tagged as an image —,
 * ALERTÓPOLIS, the title, the one task «Tu turno: las preguntas de la lección», the track plate and the disclaimer.
 * The card comes in at `at` (the voice's «Ahora te toca a ti») and the task lands at `taskAt` («con las preguntas de
 * la lección»); nothing moves or fades afterwards: it holds to the scene's last frame.
 */
export function EndCard({ frame, fps, at, taskAt }: { frame: number; fps: number; at: number; taskAt: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at - 4, { distance: 20 });
  const brand = enter(frame, at - 4, { distance: 16 });
  const title = enter(frame, at - 2, { distance: 24 });
  const cta = enter(frame, taskAt - 4, { distance: 18 });
  const chips = enter(frame, at + 8, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18);
  const disclaimer = enter(frame, at + 12, { distance: 12 });
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
        padding: '0 56px 0 52px',
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
        <Illustration
          src={END.art.src}
          width={ART}
          height={ART}
          focus={END.art.focus}
          mono
          overlay={
            <div style={{ position: 'absolute', left: 12, bottom: 12 }}>
              <ImageTag size={22} />
            </div>
          }
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ fontSize: 80, letterSpacing: -2, lineHeight: 1.05, color: C.cyan }}>{END.title[0]}</div>
          <div style={{ fontSize: 52, letterSpacing: -1, lineHeight: 1.15 }}>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 44, fontWeight: 850, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={40} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 20, display: 'flex', ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {PLAQUE}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 12, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, whiteSpace: 'nowrap', ...disclaimer }}>
          {END.disclaimer.map((s) => (
            <div key={s}>{s}</div>
          ))}
          {isElevenLabsVoice(TIMELINE.voice) ? <div>Voz: ElevenLabs.</div> : null}
        </div>
      </div>
    </div>
  );
}
