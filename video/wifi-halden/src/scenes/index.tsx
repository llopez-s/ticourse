import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Foco } from './S02Foco';
import { S03Apreton } from './S03Apreton';
import { S04Enterprise } from './S04Enterprise';
import { S05Eap } from './S05Eap';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-foco': S02Foco,
  's03-apreton': S03Apreton,
  's04-enterprise': S04Enterprise,
  's05-eap': S05Eap,
  's06-recap': S06Recap,
};
