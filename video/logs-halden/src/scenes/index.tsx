import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Spray } from './S02Spray';
import { S03Mfa } from './S03Mfa';
import { S04Traversal } from './S04Traversal';
import { S05Amp } from './S05Amp';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-spray': S02Spray,
  's03-mfa': S03Mfa,
  's04-traversal': S04Traversal,
  's05-amp': S05Amp,
  's06-recap': S06Recap,
};
