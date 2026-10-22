import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Manda } from './S02Manda';
import { S03P1 } from './S03P1';
import { S04Tiempo } from './S04Tiempo';
import { S05P2 } from './S05P2';
import { S06Parche } from './S06Parche';
import { S07P3 } from './S07P3';
import { S08Cierre } from './S08Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-manda': S02Manda,
  's03-p1': S03P1,
  's04-tiempo': S04Tiempo,
  's05-p2': S05P2,
  's06-parche': S06Parche,
  's07-p3': S07P3,
  's08-cierre': S08Cierre,
};
