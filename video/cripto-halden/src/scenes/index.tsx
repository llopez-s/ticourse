import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Familias } from './S02Familias';
import { S03Naviera } from './S03Naviera';
import { S04Huella } from './S04Huella';
import { S05Contrasenas } from './S05Contrasenas';
import { S06SoloHuella } from './S06SoloHuella';
import { S07Sello } from './S07Sello';
import { S08Mezcla } from './S08Mezcla';
import { S09Linea } from './S09Linea';
import { S10Recap } from './S10Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-familias': S02Familias,
  's03-naviera': S03Naviera,
  's04-huella': S04Huella,
  's05-contrasenas': S05Contrasenas,
  's06-solo-huella': S06SoloHuella,
  's07-sello': S07Sello,
  's08-mezcla': S08Mezcla,
  's09-linea': S09Linea,
  's10-recap': S10Recap,
};
