import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Canal } from './S02Canal';
import { S03Bec } from './S03Bec';
import { S04P1 } from './S04P1';
import { S05Fuera } from './S05Fuera';
import { S06P2 } from './S06P2';
import { S07Disfraz } from './S07Disfraz';
import { S08Abrevadero } from './S08Abrevadero';
import { S09P3 } from './S09P3';
import { S10Bulo } from './S10Bulo';
import { S11P4 } from './S11P4';
import { S12Cierre } from './S12Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-canal': S02Canal,
  's03-bec': S03Bec,
  's04-p1': S04P1,
  's05-fuera': S05Fuera,
  's06-p2': S06P2,
  's07-disfraz': S07Disfraz,
  's08-abrevadero': S08Abrevadero,
  's09-p3': S09P3,
  's10-bulo': S10Bulo,
  's11-p4': S11P4,
  's12-cierre': S12Cierre,
};
