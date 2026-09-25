import { BrandMark } from '../../../../../engine/src/overlay/ChapterRail';
import { C, FONT, STAGE, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';

const CARD_W = 1320;

/**
 * Closing card: IntelForge mark, title, exam objective, where to practise and
 * the disclaimer. Arrives at `at` and holds, unchanged, to the last frame.
 */
export function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const objective = enter(frame, at + 8, { distance: 18 });
  const ruleDraw = progress(frame, at + 8, 18);
  const cta = enter(frame, at + 14, { distance: 18 });
  const disclaimer = enter(frame, at + 22, { distance: 12 });

  return (
    <div
      style={{
        position: 'absolute',
        left: (STAGE.width - CARD_W) / 2,
        top: 40,
        width: CARD_W,
        height: STAGE.height - 80,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
      {/* Cyan hairline across the top edge. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 4,
          background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
        <BrandMark size={34} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>INTELFORGE ACADEMY</span>
      </div>

      <div
        style={{
          marginTop: 22,
          fontSize: TYPE.hero,
          fontWeight: 850,
          letterSpacing: -2,
          lineHeight: 1.05,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          ...title,
        }}
      >
        <span style={{ color: C.cyan }}>SIEM</span> en acción
      </div>

      <div style={{ marginTop: 22, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          Security+ SY0-701 · objetivo 4.4
        </Chip>
      </div>

      <div style={{ marginTop: 38, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />

      <div
        style={{
          marginTop: 38,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '16px 30px 16px 22px',
          borderRadius: 999,
          background: alpha(C.cyan, 0.08),
          border: `2px solid ${alpha(C.cyan, 0.55)}`,
          ...cta,
        }}
      >
        <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 36, fontWeight: 650, color: C.textStrong, whiteSpace: 'nowrap' }}>
          Practica el caso en la lección <span style={{ color: C.cyanSoft }}>«Alerting y monitorización»</span>
        </span>
      </div>

      <div
        style={{
          marginTop: 40,
          fontSize: TYPE.small,
          fontWeight: 550,
          color: C.muted,
          textAlign: 'center',
          lineHeight: 1.35,
          ...disclaimer,
        }}
      >
        Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.
        <br />
        Voz: ElevenLabs.
      </div>
    </div>
  );
}
