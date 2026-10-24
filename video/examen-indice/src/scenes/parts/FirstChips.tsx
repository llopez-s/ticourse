import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { enter } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';
import { Tag } from './paper';

/** Geometry shared by s05 (the question, cold) and s06 (the answer): both scenes draw the chips in the same place. */
export const CHIP = { top: 300, w: 560, h: 170, lefts: [190, 830] as const };

/**
 * The two chips of the «¿qué va primero?» question: «recoger datos» and «planificar». `appearAt`
 * (one frame per chip) slides them in cold: identical, nothing highlighted, no clue. `reveal`
 * (0–1) is the answer: «recoger datos» steps back with «fuera de turno» and «planificar» is
 * marked first, with «definir qué necesitas saber» under it.
 */
export function FirstChips({ frame, appearAt, reveal = 0 }: { frame: number; appearAt: readonly [number, number]; reveal?: number }) {
  const defs = [
    { text: 'recoger datos', icon: 'database' as const, sub: '' },
    { text: 'planificar', icon: 'target' as const, sub: 'definir qué necesitas saber' },
  ];
  return (
    <>
      {defs.map((c, i) => {
        const win = i === 1;
        const k = reveal;
        const accent = win ? C.emerald : C.cyan;
        const e = enter(frame, appearAt[i], { distance: 24 });
        const dim = win ? 0 : k;
        return (
          <div key={c.text} style={{ position: 'absolute', left: CHIP.lefts[i], top: CHIP.top, width: CHIP.w, ...e, opacity: e.opacity * (1 - 0.58 * dim), filter: dim > 0.05 ? `saturate(${1 - 0.6 * dim})` : undefined }}>
            <div
              style={{
                width: CHIP.w,
                height: CHIP.h,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                borderRadius: RADIUS.lg,
                background: alpha(accent, win ? 0.07 + 0.08 * k : 0.07),
                border: `3px solid ${alpha(accent, win ? 0.6 + 0.35 * k : 0.6)}`,
                boxShadow: win && k > 0.05 ? `0 0 ${Math.round(40 * k)}px ${alpha(C.emerald, 0.35 * k)}` : undefined,
                fontFamily: FONT.sans,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 60, fontWeight: 800, color: C.textStrong, lineHeight: 1.05 }}>
                <Icon name={c.icon} size={64} color={accent} strokeWidth={2} />
                {c.text}
              </div>
              <div style={{ height: 40, fontSize: 36, fontWeight: 700, color: '#6ee7b7', opacity: win ? k : 0 }}>{c.sub}</div>
            </div>
            {win && k > 0.05 ? (
              <div style={{ position: 'absolute', left: -22, top: -22, width: 64, height: 64, borderRadius: 32, display: 'grid', placeItems: 'center', background: C.emerald, color: C.ink950, fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, opacity: k, transform: `scale(${0.6 + 0.4 * k})` }}>1</div>
            ) : null}
            {!win && k > 0.05 ? (
              <div style={{ position: 'absolute', left: 0, top: CHIP.h + 18, width: CHIP.w, display: 'flex', justifyContent: 'center', opacity: k }}>
                <Tag color={C.amber} size={34} icon="alert">
                  fuera de turno
                </Tag>
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
