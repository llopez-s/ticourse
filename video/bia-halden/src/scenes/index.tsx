import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Negocio } from './S02Negocio';
import { S03Promesas } from './S03Promesas';
import { S04Medida } from './S04Medida';
import { S05Fallos } from './S05Fallos';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-negocio': S02Negocio,
  's03-promesas': S03Promesas,
  's04-medida': S04Medida,
  's05-fallos': S05Fallos,
  's06-recap': S06Recap,
};
