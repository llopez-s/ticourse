import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Piezas } from './S02Piezas';
import { S03Maquinas } from './S03Maquinas';
import { S04Comparten } from './S04Comparten';
import { S05Servicio } from './S05Servicio';
import { S06Comprobar } from './S06Comprobar';
import { S07Instantanea } from './S07Instantanea';
import { S08Copia } from './S08Copia';
import { S09Soporte } from './S09Soporte';
import { S10Vuelta } from './S10Vuelta';
import { S11Reglas } from './S11Reglas';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-piezas': S02Piezas,
  's03-maquinas': S03Maquinas,
  's04-comparten': S04Comparten,
  's05-servicio': S05Servicio,
  's06-comprobar': S06Comprobar,
  's07-instantanea': S07Instantanea,
  's08-copia': S08Copia,
  's09-soporte': S09Soporte,
  's10-vuelta': S10Vuelta,
  's11-reglas': S11Reglas,
};
