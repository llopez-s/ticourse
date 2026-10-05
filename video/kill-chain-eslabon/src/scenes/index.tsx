import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Alerta } from './S01Alerta';
import { S02Cadena } from './S02Cadena';
import { S03Correo } from './S03Correo';
import { S04Equipo } from './S04Equipo';
import { S05Taller } from './S05Taller';
import { S06Frontera } from './S06Frontera';
import { S07Izquierda } from './S07Izquierda';
import { S08Cortar } from './S08Cortar';
import { S09Limites } from './S09Limites';
import { S10Reglas } from './S10Reglas';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-alerta': S01Alerta,
  's02-cadena': S02Cadena,
  's03-correo': S03Correo,
  's04-equipo': S04Equipo,
  's05-taller': S05Taller,
  's06-frontera': S06Frontera,
  's07-izquierda': S07Izquierda,
  's08-cortar': S08Cortar,
  's09-limites': S09Limites,
  's10-reglas': S10Reglas,
};
