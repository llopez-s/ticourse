import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Difusion } from './S02Difusion';
import { S03P1 } from './S03P1';
import { S04Etiqueta } from './S04Etiqueta';
import { S05P2 } from './S05P2';
import { S06Capa3 } from './S06Capa3';
import { S07P3 } from './S07P3';
import { S08Cierre } from './S08Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-difusion': S02Difusion,
  's03-p1': S03P1,
  's04-etiqueta': S04Etiqueta,
  's05-p2': S05P2,
  's06-capa3': S06Capa3,
  's07-p3': S07P3,
  's08-cierre': S08Cierre,
};
