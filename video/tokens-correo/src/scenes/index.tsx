import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Caso } from './S02Caso';
import { S03Caso } from './S03Caso';
import { S04Caso } from './S04Caso';
import { S05Caso } from './S05Caso';
import { S06Caso } from './S06Caso';
import { S07Caso } from './S07Caso';
import { S08Caso } from './S08Caso';
import { S09Caso } from './S09Caso';
import { S10Cierre } from './S10Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-caso': S02Caso,
  's03-caso': S03Caso,
  's04-caso': S04Caso,
  's05-caso': S05Caso,
  's06-caso': S06Caso,
  's07-caso': S07Caso,
  's08-caso': S08Caso,
  's09-caso': S09Caso,
  's10-cierre': S10Cierre,
};
