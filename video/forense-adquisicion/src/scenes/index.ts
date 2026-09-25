import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hold } from './S01Hold';
import { S02Volatility } from './S02Volatility';
import { S03Image } from './S03Image';
import { S04Mismatch } from './S04Mismatch';
import { S05Custody } from './S05Custody';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hold': S01Hold,
  's02-volatility': S02Volatility,
  's03-image': S03Image,
  's04-mismatch': S04Mismatch,
  's05-custody': S05Custody,
  's06-recap': S06Recap,
};
