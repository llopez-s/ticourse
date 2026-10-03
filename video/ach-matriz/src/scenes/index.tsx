import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Fuera } from './S02Fuera';
import { S03Supuestos } from './S03Supuestos';
import { S04Hipotesis } from './S04Hipotesis';
import { S05Matriz } from './S05Matriz';
import { S06Diagnosticidad } from './S06Diagnosticidad';
import { S07Inconsistente } from './S07Inconsistente';
import { S08Sensibilidad } from './S08Sensibilidad';
import { S09Informe } from './S09Informe';
import { S10Recap } from './S10Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-fuera': S02Fuera,
  's03-supuestos': S03Supuestos,
  's04-hipotesis': S04Hipotesis,
  's05-matriz': S05Matriz,
  's06-diagnosticidad': S06Diagnosticidad,
  's07-inconsistente': S07Inconsistente,
  's08-sensibilidad': S08Sensibilidad,
  's09-informe': S09Informe,
  's10-recap': S10Recap,
};
