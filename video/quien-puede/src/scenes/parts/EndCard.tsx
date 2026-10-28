import { BrandMark } from '../../../../engine/src/overlay/ChapterRail';
import { C, FONT, STAGE, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../engine/src/ui';
import { isElevenLabsVoice } from '../../../../engine/src/timeline/voice';
import { TIMELINE } from '../../timeline/load';
import { FolderGlyph } from './FolderAcl';
import { GateBar } from './Gate';

const W = STAGE.width;
const CARD_W = 1620;

/** Texts of the closing card (the practice name is the one of the app, `foundation-permissions`). */
export const END = {
  title: ['Quién puede', 'hacer qué'],
  practice: 'Práctica · Permisos de una carpeta',
  objective: 'Security+ SY0-701 · objetivos 1.2 y 4.6',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;

/**
 * Closing card (the series' layout): the video's image — the folder with its gate, now open —, ALERTÓPOLIS, the title,
 * the one task («Práctica · Permisos de una carpeta») as a button-shaped pill, the objectives and the disclaimer.
 * Everything is in by `at` + ~35 and nothing moves afterwards: it holds to the scene's last frame.
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
  const open = progress(frame, at + 10, 26);
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
        gap: 70,
        padding: '0 56px 0 60px',
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
      {/* the folder with its gate, opening */}
      <div style={{ flexShrink: 0, width: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, ...art }}>
        <FolderGlyph width={230} glow={0.8 * glow} />
        <GateBar width={210} open={open} tone={open > 0.5 ? C.emerald : C.rose} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ fontSize: 76, letterSpacing: -2, lineHeight: 1.05, color: C.cyan }}>{END.title[0]}</div>
          <div style={{ fontSize: 76, letterSpacing: -2, lineHeight: 1.05 }}>{END.title[1]}</div>
        </div>
        <div
          style={{
            marginTop: 26,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 18,
            height: 84,
            padding: '0 34px 0 26px',
            boxSizing: 'border-box',
            borderRadius: 24,
            border: `3px solid ${alpha(C.cyan, 0.85)}`,
            background: alpha(C.cyan, 0.14),
            boxShadow: `0 0 ${Math.round(34 * glow)}px ${alpha(C.cyan, 0.3 * glow)}`,
            fontSize: 44,
            fontWeight: 850,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            ...cta,
          }}
        >
          <Icon name="play" size={40} color={C.cyan} strokeWidth={2.2} />
          {END.practice}
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
