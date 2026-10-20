import { Icon, type IconName } from '../../../../engine/src/ui';

/** An engine icon, or the phone handset the engine does not have. */
export type GlyphName = IconName | 'phone';

/** A phone handset, drawn like the engine's line icons (24-unit box, stroked). */
export function PhoneGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function Glyph({ name, size, color }: { name: GlyphName; size: number; color: string }) {
  return name === 'phone' ? <PhoneGlyph size={size} color={color} /> : <Icon name={name} size={size} color={color} />;
}
