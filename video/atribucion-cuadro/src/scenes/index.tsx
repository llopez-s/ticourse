import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Niveles } from './S02Niveles';
import { S03Techo } from './S03Techo';
import { S04Binario } from './S04Binario';
import { S05Decision } from './S05Decision';
import { S06Recap } from './S06Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-niveles': S02Niveles,
  's03-techo': S03Techo,
  's04-binario': S04Binario,
  's05-decision': S05Decision,
  's06-recap': S06Recap,
};
