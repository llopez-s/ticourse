import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Frena } from './S02Frena';
import { S03P1 } from './S03P1';
import { S04Sensor } from './S04Sensor';
import { S05P2 } from './S05P2';
import { S06Cebo } from './S06Cebo';
import { S07P3 } from './S07P3';
import { S08Cierre } from './S08Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-frena': S02Frena,
  's03-p1': S03P1,
  's04-sensor': S04Sensor,
  's05-p2': S05P2,
  's06-cebo': S06Cebo,
  's07-p3': S07P3,
  's08-cierre': S08Cierre,
};
