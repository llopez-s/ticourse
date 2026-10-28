import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Clic } from './S01Clic';
import { S02Direccion } from './S02Direccion';
import { S03Vecina } from './S03Vecina';
import { S04Salida } from './S04Salida';
import { S05Internet } from './S05Internet';
import { S06Despacho } from './S06Despacho';
import { S07Llamada } from './S07Llamada';
import { S08Tachar } from './S08Tachar';
import { S09Portal } from './S09Portal';
import { S10Decidir } from './S10Decidir';
import { S11IdaVuelta } from './S11IdaVuelta';
import { S12Reglas } from './S12Reglas';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-clic': S01Clic,
  's02-direccion': S02Direccion,
  's03-vecina': S03Vecina,
  's04-salida': S04Salida,
  's05-internet': S05Internet,
  's06-despacho': S06Despacho,
  's07-llamada': S07Llamada,
  's08-tachar': S08Tachar,
  's09-portal': S09Portal,
  's10-decidir': S10Decidir,
  's11-ida-vuelta': S11IdaVuelta,
  's12-reglas': S12Reglas,
};
