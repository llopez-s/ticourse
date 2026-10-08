import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Garita } from './S02Garita';
import { S03Alcance } from './S03Alcance';
import { S04Dmz } from './S04Dmz';
import { S05Jump } from './S05Jump';
import { S06Barrera } from './S06Barrera';
import { S07Decidir } from './S07Decidir';
import { S08Puertas } from './S08Puertas';
import { S09Camara } from './S09Camara';
import { S10Recap } from './S10Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-garita': S02Garita,
  's03-alcance': S03Alcance,
  's04-dmz': S04Dmz,
  's05-jump': S05Jump,
  's06-barrera': S06Barrera,
  's07-decidir': S07Decidir,
  's08-puertas': S08Puertas,
  's09-camara': S09Camara,
  's10-recap': S10Recap,
};
