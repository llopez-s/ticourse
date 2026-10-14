import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Evento } from './S02Evento';
import { S03Ano } from './S03Ano';
import { S04Control } from './S04Control';
import { S05Aguanta } from './S05Aguanta';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-evento': S02Evento,
  's03-ano': S03Ano,
  's04-control': S04Control,
  's05-aguanta': S05Aguanta,
  's06-recap': S06Recap,
};
