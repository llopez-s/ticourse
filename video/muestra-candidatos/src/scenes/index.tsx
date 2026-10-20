import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Huellas } from './S02Huellas';
import { S03Etiqueta } from './S03Etiqueta';
import { S04Noventa } from './S04Noventa';
import { S05Consultas } from './S05Consultas';
import { S06Relaciones } from './S06Relaciones';
import { S07Gana } from './S07Gana';
import { S08Casilla } from './S08Casilla';
import { S09Bitacora } from './S09Bitacora';
import { S10Cierre } from './S10Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-caso': S02Huellas,
  's03-caso': S03Etiqueta,
  's04-caso': S04Noventa,
  's05-caso': S05Consultas,
  's06-caso': S06Relaciones,
  's07-caso': S07Gana,
  's08-caso': S08Casilla,
  's09-caso': S09Bitacora,
  's10-cierre': S10Cierre,
};
