import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Hash } from './S02Hash';
import { S03Mitades } from './S03Mitades';
import { S04Llamadas } from './S04Llamadas';
import { S05Etiqueta } from './S05Etiqueta';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-hash': S02Hash,
  's03-mitades': S03Mitades,
  's04-llamadas': S04Llamadas,
  's05-etiqueta': S05Etiqueta,
  's06-recap': S06Recap,
};
