import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Tres } from './S02Tres';
import { S03Credenciales } from './S03Credenciales';
import { S04Equipo } from './S04Equipo';
import { S05Alcance } from './S05Alcance';
import { S06Revocacion } from './S06Revocacion';
import { S07Boton } from './S07Boton';
import { S08Evidencia } from './S08Evidencia';
import { S09Ana } from './S09Ana';
import { S10Cierre } from './S10Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-caso': S02Tres,
  's03-caso': S03Credenciales,
  's04-caso': S04Equipo,
  's05-caso': S05Alcance,
  's06-caso': S06Revocacion,
  's07-caso': S07Boton,
  's08-caso': S08Evidencia,
  's09-caso': S09Ana,
  's10-cierre': S10Cierre,
};
