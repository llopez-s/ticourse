import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Niveles } from './S02Niveles';
import { S03Error } from './S03Error';
import { S04Escala } from './S04Escala';
import { S05Tejado } from './S05Tejado';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-niveles': S02Niveles,
  's03-error': S03Error,
  's04-escala': S04Escala,
  's05-tejado': S05Tejado,
  's06-recap': S06Recap,
};
