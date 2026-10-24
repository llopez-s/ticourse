import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Lectores } from './S02Lectores';
import { S03Reloj } from './S03Reloj';
import { S04Flash } from './S04Flash';
import { S05Plazo } from './S05Plazo';
import { S06Bluf } from './S06Bluf';
import { S07BlufFlash } from './S07BlufFlash';
import { S08Bandas } from './S08Bandas';
import { S09Diales } from './S09Diales';
import { S10Cierre } from './S10Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-lectores': S02Lectores,
  's03-reloj': S03Reloj,
  's04-flash': S04Flash,
  's05-plazo': S05Plazo,
  's06-bluf': S06Bluf,
  's07-bluf-flash': S07BlufFlash,
  's08-bandas': S08Bandas,
  's09-diales': S09Diales,
  's10-cierre': S10Cierre,
};
