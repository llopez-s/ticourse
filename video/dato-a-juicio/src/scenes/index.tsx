import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Ip } from './S01Ip';
import { S02Pasos } from './S02Pasos';
import { S03Kent } from './S03Kent';
import { S04Pruebas } from './S04Pruebas';
import { S05Triada } from './S05Triada';
import { S06Caso } from './S06Caso';
import { S07Herramienta } from './S07Herramienta';
import { S08Conducta } from './S08Conducta';
import { S09Riesgo } from './S09Riesgo';
import { S10Ventaja } from './S10Ventaja';
import { S11Reglas } from './S11Reglas';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-ip': S01Ip,
  's02-pasos': S02Pasos,
  's03-kent': S03Kent,
  's04-pruebas': S04Pruebas,
  's05-triada': S05Triada,
  's06-caso': S06Caso,
  's07-herramienta': S07Herramienta,
  's08-conducta': S08Conducta,
  's09-riesgo': S09Riesgo,
  's10-ventaja': S10Ventaja,
  's11-reglas': S11Reglas,
};
