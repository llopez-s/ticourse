import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Contexto } from './S02Contexto';
import { S03Orden } from './S03Orden';
import { S04Sinparche } from './S04Sinparche';
import { S05Despues } from './S05Despues';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-contexto': S02Contexto,
  's03-orden': S03Orden,
  's04-sinparche': S04Sinparche,
  's05-despues': S05Despues,
  's06-recap': S06Recap,
};
