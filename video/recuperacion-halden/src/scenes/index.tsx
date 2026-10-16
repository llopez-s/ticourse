import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Sitios } from './S02Sitios';
import { S03Paralelo } from './S03Paralelo';
import { S04Conmutar } from './S04Conmutar';
import { S05Copia } from './S05Copia';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-sitios': S02Sitios,
  's03-paralelo': S03Paralelo,
  's04-conmutar': S04Conmutar,
  's05-copia': S05Copia,
  's06-recap': S06Recap,
};
