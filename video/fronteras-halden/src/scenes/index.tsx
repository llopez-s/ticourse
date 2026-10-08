import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Toma } from './S02Toma';
import { S03Dot1x } from './S03Dot1x';
import { S04Eap } from './S04Eap';
import { S05Sedes } from './S05Sedes';
import { S06AhEsp } from './S06AhEsp';
import { S07Modos } from './S07Modos';
import { S08Hotel } from './S08Hotel';
import { S09Tunel } from './S09Tunel';
import { S10Recap } from './S10Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-toma': S02Toma,
  's03-8021x': S03Dot1x,
  's04-eap': S04Eap,
  's05-sedes': S05Sedes,
  's06-ah-esp': S06AhEsp,
  's07-modos': S07Modos,
  's08-hotel': S08Hotel,
  's09-tunel': S09Tunel,
  's10-recap': S10Recap,
};
