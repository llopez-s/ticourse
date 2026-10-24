import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Entra } from './S02Entra';
import { S03Piensa } from './S03Piensa';
import { S04Ingenua } from './S04Ingenua';
import { S05Capas } from './S05Capas';
import { S06Salida } from './S06Salida';
import { S07Cierre } from './S07Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-entra': S02Entra,
  's03-piensa': S03Piensa,
  's04-ingenua': S04Ingenua,
  's05-capas': S05Capas,
  's06-salida': S06Salida,
  's07-cierre': S07Cierre,
};
