import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S04Caza } from './S04Caza';
import { S05Huecos } from './S05Huecos';
import { S01Hook } from './S01Hook';
import { S02Mesa } from './S02Mesa';
import { S03Simulacro } from './S03Simulacro';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-mesa': S02Mesa,
  's03-simulacro': S03Simulacro,
  's04-caza': S04Caza,
  's05-huecos': S05Huecos,
  's06-recap': S06Recap,
};
