import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Formato } from './S02Formato';
import { S03Pesos } from './S03Pesos';
import { S04Califs } from './S04Califs';
import { S05P1 } from './S05P1';
import { S06P2 } from './S06P2';
import { S07Tacha } from './S07Tacha';
import { S08P3 } from './S08P3';
import { S09P4 } from './S09P4';
import { S10Estandar } from './S10Estandar';
import { S11P5 } from './S11P5';
import { S12Tiempo } from './S12Tiempo';
import { S13Cierre } from './S13Cierre';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-formato': S02Formato,
  's03-pesos': S03Pesos,
  's04-califs': S04Califs,
  's05-p1': S05P1,
  's06-p2': S06P2,
  's07-tacha': S07Tacha,
  's08-p3': S08P3,
  's09-p4': S09P4,
  's10-estandar': S10Estandar,
  's11-p5': S11P5,
  's12-tiempo': S12Tiempo,
  's13-cierre': S13Cierre,
};
