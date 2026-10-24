import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { MODES, type Mode } from '../../data/modes';

/**
 * The glyph of a mode. Purple is not a colour of the theme (violet is the exam's): it is drawn the way the team is
 * built — two overlapping rings, the attacker's rose and the defender's cyan.
 */
export function ModeGlyph({ mode, size = 40, strokeWidth = 2.2 }: { mode: Mode; size?: number; strokeWidth?: number }) {
  if (mode.id !== 'purple') return <Icon name={mode.icon} size={size} color={mode.tone} strokeWidth={strokeWidth} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="9" cy="12" r="6" stroke={C.rose} />
      <circle cx="15" cy="12" r="6" stroke={C.cyan} />
    </svg>
  );
}

/** A mode's accent for borders and glows: purple blends rose and cyan. */
export function modeBorder(mode: Mode, a: number): string {
  return mode.id === 'purple' ? `linear-gradient(90deg, ${alpha(C.rose, a)}, ${alpha(C.cyan, a)})` : alpha(mode.tone, a);
}

/** A rounded pill for a mode (s08's miniature). `on` 0–1 brightens it; purple gets a rose-to-cyan border. */
export function ModePill({ mode, on = 0, size = 30, height = 56, opacity = 1 }: { mode: Mode; on?: number; size?: number; height?: number; opacity?: number }) {
  const purple = mode.id === 'purple';
  const a = 0.45 + 0.5 * on;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height,
        padding: '0 24px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: purple ? '2px solid transparent' : `2px solid ${alpha(mode.tone, a)}`,
        background: purple
          ? `linear-gradient(${C.ink900}, ${C.ink900}) padding-box, linear-gradient(90deg, ${alpha(C.rose, a)}, ${alpha(C.cyan, a)}) border-box`
          : alpha(mode.tone, 0.07 + 0.14 * on),
        boxShadow: on > 0.02 ? `0 0 ${Math.round(24 * on)}px ${alpha(purple ? C.cyan : mode.tone, 0.3 * on)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity,
      }}
    >
      <ModeGlyph mode={mode} size={Math.round(size * 0.95)} />
      <span>{mode.short}</span>
    </div>
  );
}

export { MODES };
