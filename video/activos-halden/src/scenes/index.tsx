import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Lista } from './S02Lista';
import { S03P1 } from './S03P1';
import { S04Dueno } from './S04Dueno';
import { S05P2 } from './S05P2';
import { S06Retirada } from './S06Retirada';
import { S07P3 } from './S07P3';
import { S08Cierre } from './S08Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-lista': S02Lista,
  's03-p1': S03P1,
  's04-dueno': S04Dueno,
  's05-p2': S05P2,
  's06-retirada': S06Retirada,
  's07-p3': S07P3,
  's08-cierre': S08Cierre,
};
