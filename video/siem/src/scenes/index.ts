import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Collect } from './S02Collect';
import { S03Normalize } from './S03Normalize';
import { S04Enrich } from './S04Enrich';
import { S05Correlate } from './S05Correlate';
import { S06Fatigue } from './S06Fatigue';
import { S07Tuning } from './S07Tuning';
import { S08Triage } from './S08Triage';
import { S09Pivot } from './S09Pivot';
import { S10Contain } from './S10Contain';
import { S11Limits } from './S11Limits';
import { S12Recap } from './S12Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-collect': S02Collect,
  's03-normalize': S03Normalize,
  's04-enrich': S04Enrich,
  's05-correlate': S05Correlate,
  's06-fatigue': S06Fatigue,
  's07-tuning': S07Tuning,
  's08-triage': S08Triage,
  's09-pivot': S09Pivot,
  's10-contain': S10Contain,
  's11-limits': S11Limits,
  's12-recap': S12Recap,
};
