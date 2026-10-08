import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Sqli } from './S02Sqli';
import { S03Casilla } from './S03Casilla';
import { S04Vuelve } from './S04Vuelve';
import { S05Vitrina } from './S05Vitrina';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-sqli': S02Sqli,
  's03-casilla': S03Casilla,
  's04-vuelve': S04Vuelve,
  's05-vitrina': S05Vitrina,
  's06-recap': S06Recap,
};
