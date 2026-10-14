import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Atras } from './S02Atras';
import { S03Impedir } from './S03Impedir';
import { S04Fase } from './S04Fase';
import { S05Caminos } from './S05Caminos';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-atras': S02Atras,
  's03-impedir': S03Impedir,
  's04-fase': S04Fase,
  's05-caminos': S05Caminos,
  's06-recap': S06Recap,
};
