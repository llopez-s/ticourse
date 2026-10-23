import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Pregunta } from './S01Pregunta';
import { S02Moonlight } from './S02Moonlight';
import { S03Informe } from './S03Informe';
import { S04Convergencia } from './S04Convergencia';
import { S05Destructivo } from './S05Destructivo';
import { S06Fuentes } from './S06Fuentes';
import { S07DosGrupos } from './S07DosGrupos';
import { S08Arma } from './S08Arma';
import { S09Puente } from './S09Puente';
import { S10Mapa } from './S10Mapa';
import { S11Cierre } from './S11Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-pregunta': S01Pregunta,
  's02-moonlight': S02Moonlight,
  's03-informe': S03Informe,
  's04-convergencia': S04Convergencia,
  's05-destructivo': S05Destructivo,
  's06-fuentes': S06Fuentes,
  's07-dos-grupos': S07DosGrupos,
  's08-arma': S08Arma,
  's09-puente': S09Puente,
  's10-mapa': S10Mapa,
  's11-cierre': S11Cierre,
};
