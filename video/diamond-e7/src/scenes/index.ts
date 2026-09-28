import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Axiom } from './S02Axiom';
import { S03Victim } from './S03Victim';
import { S04Infra } from './S04Infra';
import { S05Adversary } from './S05Adversary';
import { S06Meta } from './S06Meta';
import { S07Axes } from './S07Axes';
import { S08Pivot } from './S08Pivot';
import { S09Quality } from './S09Quality';
import { S10Thread } from './S10Thread';
import { S11Limits } from './S11Limits';
import { S12Recap } from './S12Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-axiom': S02Axiom,
  's03-victim': S03Victim,
  's04-infra': S04Infra,
  's05-adversary': S05Adversary,
  's06-meta': S06Meta,
  's07-axes': S07Axes,
  's08-pivot': S08Pivot,
  's09-quality': S09Quality,
  's10-thread': S10Thread,
  's11-limits': S11Limits,
  's12-recap': S12Recap,
};
