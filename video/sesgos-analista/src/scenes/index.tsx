import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Instrumento } from './S02Instrumento';
import { S03Ancla } from './S03Ancla';
import { S04Noticias } from './S04Noticias';
import { S05Pesas } from './S05Pesas';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-instrumento': S02Instrumento,
  's03-ancla': S03Ancla,
  's04-noticias': S04Noticias,
  's05-pesas': S05Pesas,
  's06-recap': S06Recap,
};
