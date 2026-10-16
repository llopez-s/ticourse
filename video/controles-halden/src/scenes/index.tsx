import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Cuarto } from './S02Cuarto';
import { S03P1 } from './S03P1';
import { S04Camara } from './S04Camara';
import { S05P2 } from './S05P2';
import { S06Sustituto } from './S06Sustituto';
import { S07P3 } from './S07P3';
import { S08Cierre } from './S08Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-cuarto': S02Cuarto,
  's03-p1': S03P1,
  's04-camara': S04Camara,
  's05-p2': S05P2,
  's06-sustituto': S06Sustituto,
  's07-p3': S07P3,
  's08-cierre': S08Cierre,
};
