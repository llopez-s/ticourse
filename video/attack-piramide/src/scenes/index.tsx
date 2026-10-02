import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Escalera } from './S02Escalera';
import { S03Ramas } from './S03Ramas';
import { S04Piramide } from './S04Piramide';
import { S05OtraRopa } from './S05OtraRopa';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-escalera': S02Escalera,
  's03-ramas': S03Ramas,
  's04-piramide': S04Piramide,
  's05-otra-ropa': S05OtraRopa,
  's06-recap': S06Recap,
};
