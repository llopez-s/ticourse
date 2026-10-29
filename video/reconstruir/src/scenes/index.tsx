import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Aviso } from './S01Aviso';
import { S02Testigos } from './S02Testigos';
import { S03Ingredientes } from './S03Ingredientes';
import { S04Relojes } from './S04Relojes';
import { S05Utc } from './S05Utc';
import { S06Orden } from './S06Orden';
import { S07Hilos } from './S07Hilos';
import { S08Columnas } from './S08Columnas';
import { S09Megas } from './S09Megas';
import { S10Bloqueo } from './S10Bloqueo';
import { S11Informe } from './S11Informe';
import { S12Reglas } from './S12Reglas';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-aviso': S01Aviso,
  's02-testigos': S02Testigos,
  's03-ingredientes': S03Ingredientes,
  's04-relojes': S04Relojes,
  's05-utc': S05Utc,
  's06-orden': S06Orden,
  's07-hilos': S07Hilos,
  's08-columnas': S08Columnas,
  's09-megas': S09Megas,
  's10-bloqueo': S10Bloqueo,
  's11-informe': S11Informe,
  's12-reglas': S12Reglas,
};
