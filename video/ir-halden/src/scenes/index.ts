import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Board } from './S02Board';
import { S03Scope } from './S03Scope';
import { S04Key } from './S04Key';
import { S05Order } from './S05Order';
import { S06Eradicate } from './S06Eradicate';
import { S07Recovery } from './S07Recovery';
import { S08Rca } from './S08Rca';
import { S09Plan } from './S09Plan';
import { S10Recap } from './S10Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-board': S02Board,
  's03-scope': S03Scope,
  's04-key': S04Key,
  's05-order': S05Order,
  's06-eradicate': S06Eradicate,
  's07-recovery': S07Recovery,
  's08-rca': S08Rca,
  's09-plan': S09Plan,
  's10-recap': S10Recap,
};
