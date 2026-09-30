import { ACCENT, C, type Accent } from '../theme/tokens';

/**
 * A colour for the scene-kit components: one of the theme accents (each with
 * one meaning — cyan data, violet exam, amber noise/warning, rose attacker,
 * emerald validated/dedicated), 'sky' (neutral links and IPs, used by V4 but
 * not an Accent) or any raw #rrggbb colour.
 */
export type Tone = Accent | 'sky' | (string & {});

const SKY = { fg: C.sky, soft: '#7dd3fc', deep: '#075985' } as const;

/** Resolves a Tone to its foreground, soft (text) and deep (fill) colours. */
export function tone(t: Tone): { fg: string; soft: string; deep: string } {
  if (t === 'sky') return SKY;
  if (t in ACCENT) return ACCENT[t as Accent];
  return { fg: t, soft: t, deep: t };
}
