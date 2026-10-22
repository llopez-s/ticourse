import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Estados } from './S02Estados';
import { S03P1 } from './S03P1';
import { S04Metodos } from './S04Metodos';
import { S05P2 } from './S05P2';
import { S06Pais } from './S06Pais';
import { S07P3 } from './S07P3';
import { S08Cierre } from './S08Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-estados': S02Estados,
  's03-p1': S03P1,
  's04-metodos': S04Metodos,
  's05-p2': S05P2,
  's06-pais': S06Pais,
  's07-p3': S07P3,
  's08-cierre': S08Cierre,
};
