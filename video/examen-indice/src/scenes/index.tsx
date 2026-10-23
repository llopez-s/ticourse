import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Noche } from './S01Noche';
import { S02Abierto } from './S02Abierto';
import { S03Anatomia } from './S03Anatomia';
import { S04Calificadores } from './S04Calificadores';
import { S05Descartar } from './S05Descartar';
import { S06Micronota } from './S06Micronota';
import { S07Buena } from './S07Buena';
import { S08Mientras } from './S08Mientras';
import { S09Semilla } from './S09Semilla';
import { S10Hechos } from './S10Hechos';
import { S11Reglas } from './S11Reglas';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-noche': S01Noche,
  's02-abierto': S02Abierto,
  's03-anatomia': S03Anatomia,
  's04-calificadores': S04Calificadores,
  's05-descartar': S05Descartar,
  's06-micronota': S06Micronota,
  's07-buena': S07Buena,
  's08-mientras': S08Mientras,
  's09-semilla': S09Semilla,
  's10-hechos': S10Hechos,
  's11-reglas': S11Reglas,
};
