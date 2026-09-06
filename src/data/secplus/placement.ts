import type { PlacementBlock } from '../../lib/types';
import { SP1_PLACEMENT } from './placement-sp1';
import { SP2_PLACEMENT } from './placement-sp2';
import { SP3_PLACEMENT } from './placement-sp3';
import { SP4_PLACEMENT } from './placement-sp4';

/** Security+ placement blocks, one per content section (sp1-sp5). */
export const SP_PLACEMENT: PlacementBlock[] = [
  SP1_PLACEMENT,
  SP2_PLACEMENT,
  SP3_PLACEMENT,
  SP4_PLACEMENT,
];
