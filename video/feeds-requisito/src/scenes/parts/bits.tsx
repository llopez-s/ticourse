import { C } from '../../../../engine/src/theme/tokens';
import type { IconName } from '../../../../engine/src/ui/Icon';

export * from '../../../../engine/src/practica/bits';

export type FeedId = 'faro' | 'atlas' | 'eco';

/**
 * The three fictitious feeds. Identity is the name plus an icon; the colour is a neutral one (cyan and sky are
 * both «datos / enlaces», muted is the echo), so success and failure keep amber and emerald for themselves.
 */
export const FEED: Record<FeedId, { name: string; color: string; icon: IconName }> = {
  faro: { name: 'Faro', color: C.cyan, icon: 'radar' },
  atlas: { name: 'Atlas', color: C.sky, icon: 'globe' },
  eco: { name: 'Eco', color: C.muted, icon: 'layers' },
};
export const FEED_IDS: FeedId[] = ['faro', 'atlas', 'eco'];
