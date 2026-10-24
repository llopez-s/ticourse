import { C } from '../../../engine/src/theme/tokens';
import type { IconName } from '../../../engine/src/ui';

/** The four ways to test, shared by s07 (the cards) and s08 (their miniature in the resolution). */
export interface Mode {
  id: 'physical' | 'red' | 'blue' | 'purple';
  /** The English term the voice says. */
  term: string;
  /** A short pill label for the miniature. */
  short: string;
  icon: IconName;
  tone: string;
}

export const MODES: readonly Mode[] = [
  { id: 'physical', term: 'Physical', short: 'physical', icon: 'unlock', tone: C.sky },
  { id: 'red', term: 'Offensive', short: 'red', icon: 'target', tone: C.rose },
  { id: 'blue', term: 'Defensive', short: 'blue', icon: 'shield', tone: C.cyan },
  { id: 'purple', term: 'Integrated', short: 'purple', icon: 'merge', tone: C.cyan },
];
