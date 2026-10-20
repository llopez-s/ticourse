import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Motor } from './S02Motor';
import { S03Errores } from './S03Errores';
import { S04Regresion } from './S04Regresion';
import { S05Reglas } from './S05Reglas';
import { S06Doce } from './S06Doce';
import { S07Paquete } from './S07Paquete';
import { S08Bloquear } from './S08Bloquear';
import { S09Ficha } from './S09Ficha';
import { S10Cierre } from './S10Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-caso': S02Motor,
  's03-caso': S03Errores,
  's04-caso': S04Regresion,
  's05-caso': S05Reglas,
  's06-caso': S06Doce,
  's07-caso': S07Paquete,
  's08-caso': S08Bloquear,
  's09-caso': S09Ficha,
  's10-cierre': S10Cierre,
};
