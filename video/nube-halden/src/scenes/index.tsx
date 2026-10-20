import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Plantilla } from './S02Plantilla';
import { S03P1 } from './S03P1';
import { S04Funcion } from './S04Funcion';
import { S05P2 } from './S05P2';
import { S06Piezas } from './S06Piezas';
import { S07P3 } from './S07P3';
import { S08Cierre } from './S08Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-plantilla': S02Plantilla,
  's03-p1': S03P1,
  's04-funcion': S04Funcion,
  's05-p2': S05P2,
  's06-piezas': S06Piezas,
  's07-p3': S07P3,
  's08-cierre': S08Cierre,
};
