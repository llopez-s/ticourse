import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Cadena } from './S02Cadena';
import { S03Arreglo } from './S03Arreglo';
import { S04Revocar } from './S04Revocar';
import { S05Ocsp } from './S05Ocsp';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-cadena': S02Cadena,
  's03-arreglo': S03Arreglo,
  's04-revocar': S04Revocar,
  's05-ocsp': S05Ocsp,
  's06-recap': S06Recap,
};
