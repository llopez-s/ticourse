import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Dentro } from './S02Dentro';
import { S03Verbos } from './S03Verbos';
import { S04Peticion } from './S04Peticion';
import { S05Contexto } from './S05Contexto';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-dentro': S02Dentro,
  's03-verbos': S03Verbos,
  's04-peticion': S04Peticion,
  's05-contexto': S05Contexto,
  's06-recap': S06Recap,
};
