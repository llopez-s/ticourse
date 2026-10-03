import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Lectura } from './S02Lectura';
import { S03Caducado } from './S03Caducado';
import { S04Grafo } from './S04Grafo';
import { S05Taxii } from './S05Taxii';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-lectura': S02Lectura,
  's03-caducado': S03Caducado,
  's04-grafo': S04Grafo,
  's05-taxii': S05Taxii,
  's06-recap': S06Recap,
};
