import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Fotos } from './S01Fotos';
import { S02Pelicula } from './S02Pelicula';
import { S03Orbital } from './S03Orbital';
import { S04Taller } from './S04Taller';
import { S05Debiles } from './S05Debiles';
import { S06Grupo } from './S06Grupo';
import { S07Nombre } from './S07Nombre';
import { S08Grafo } from './S08Grafo';
import { S09Noche } from './S09Noche';
import { S10Reglas } from './S10Reglas';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-fotos': S01Fotos,
  's02-pelicula': S02Pelicula,
  's03-orbital': S03Orbital,
  's04-taller': S04Taller,
  's05-debiles': S05Debiles,
  's06-grupo': S06Grupo,
  's07-nombre': S07Nombre,
  's08-grafo': S08Grafo,
  's09-noche': S09Noche,
  's10-reglas': S10Reglas,
};
