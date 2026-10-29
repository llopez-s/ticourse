import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Pasaporte } from './S02Pasaporte';
import { S03Grupos } from './S03Grupos';
import { S04Permisos } from './S04Permisos';
import { S05Minimo } from './S05Minimo';
import { S06Procesos } from './S06Procesos';
import { S07Servicio } from './S07Servicio';
import { S08Windows } from './S08Windows';
import { S09Linux } from './S09Linux';
import { S10Vuelta } from './S10Vuelta';
import { S11Reglas } from './S11Reglas';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-pasaporte': S02Pasaporte,
  's03-grupos': S03Grupos,
  's04-permisos': S04Permisos,
  's05-minimo': S05Minimo,
  's06-procesos': S06Procesos,
  's07-servicio': S07Servicio,
  's08-windows': S08Windows,
  's09-linux': S09Linux,
  's10-vuelta': S10Vuelta,
  's11-reglas': S11Reglas,
};
