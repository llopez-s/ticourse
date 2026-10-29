import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Medir } from './S02Medir';
import { S03Bucle } from './S03Bucle';
import { S04Madurez } from './S04Madurez';
import { S05Plataforma } from './S05Plataforma';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-medir': S02Medir,
  's03-bucle': S03Bucle,
  's04-madurez': S04Madurez,
  's05-plataforma': S05Plataforma,
  's06-recap': S06Recap,
};
