import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Papel } from './S02Papel';
import { S03Fuente } from './S03Fuente';
import { S04Circulo } from './S04Circulo';
import { S05Eco } from './S05Eco';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-papel': S02Papel,
  's03-fuente': S03Fuente,
  's04-circulo': S04Circulo,
  's05-eco': S05Eco,
  's06-recap': S06Recap,
};
