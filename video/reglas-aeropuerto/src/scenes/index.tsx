import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Miradas } from './S02Miradas';
import { S03Condicion } from './S03Condicion';
import { S04Sigma } from './S04Sigma';
import { S05Aguanta } from './S05Aguanta';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-miradas': S02Miradas,
  's03-condicion': S03Condicion,
  's04-sigma': S04Sigma,
  's05-aguanta': S05Aguanta,
  's06-recap': S06Recap,
};
