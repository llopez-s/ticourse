import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Firmas } from './S02Firmas';
import { S03Quien } from './S03Quien';
import { S04P1 } from './S04P1';
import { S05Aguantar } from './S05Aguantar';
import { S06P2 } from './S06P2';
import { S07Modos } from './S07Modos';
import { S08P3 } from './S08P3';
import { S09Contar } from './S09Contar';
import { S10P4 } from './S10P4';
import { S11Mirar } from './S11Mirar';
import { S12P5 } from './S12P5';
import { S13Cierre } from './S13Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-firmas': S02Firmas,
  's03-quien': S03Quien,
  's04-p1': S04P1,
  's05-aguantar': S05Aguantar,
  's06-p2': S06P2,
  's07-modos': S07Modos,
  's08-p3': S08P3,
  's09-contar': S09Contar,
  's10-p4': S10P4,
  's11-mirar': S11Mirar,
  's12-p5': S12P5,
  's13-cierre': S13Cierre,
};
