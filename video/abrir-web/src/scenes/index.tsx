import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Tres } from './S01Tres';
import { S02Reparte } from './S02Reparte';
import { S03Concesion } from './S03Concesion';
import { S04Agenda } from './S04Agenda';
import { S05Ttl } from './S05Ttl';
import { S06Saludo } from './S06Saludo';
import { S07Dni } from './S07Dni';
import { S08Pagina } from './S08Pagina';
import { S09Rato } from './S09Rato';
import { S10Correo } from './S10Correo';
import { S11Canal } from './S11Canal';
import { S12Cierre } from './S12Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-tres': S01Tres,
  's02-reparte': S02Reparte,
  's03-concesion': S03Concesion,
  's04-agenda': S04Agenda,
  's05-ttl': S05Ttl,
  's06-saludo': S06Saludo,
  's07-dni': S07Dni,
  's08-pagina': S08Pagina,
  's09-rato': S09Rato,
  's10-correo': S10Correo,
  's11-canal': S11Canal,
  's12-cierre': S12Cierre,
};
