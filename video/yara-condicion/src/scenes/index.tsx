import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Partes } from './S02Partes';
import { S03Comunes } from './S03Comunes';
import { S04Wide } from './S04Wide';
import { S05Hex } from './S05Hex';
import { S06Condicion } from './S06Condicion';
import { S07Manual } from './S07Manual';
import { S08Limite } from './S08Limite';
import { S09Escribir } from './S09Escribir';
import { S10Cierre } from './S10Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-caso': S02Partes,
  's03-caso': S03Comunes,
  's04-caso': S04Wide,
  's05-caso': S05Hex,
  's06-caso': S06Condicion,
  's07-caso': S07Manual,
  's08-caso': S08Limite,
  's09-caso': S09Escribir,
  's10-cierre': S10Cierre,
};
