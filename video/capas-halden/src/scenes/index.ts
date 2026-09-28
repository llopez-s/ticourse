import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Spoof } from './S02Spoof';
import { S03Dmarc } from './S03Dmarc';
import { S04Dns } from './S04Dns';
import { S05Rules } from './S05Rules';
import { S06Ids } from './S06Ids';
import { S07Edr } from './S07Edr';
import { S08Scope } from './S08Scope';
import { S09Isolate } from './S09Isolate';
import { S10Data } from './S10Data';
import { S11Limits } from './S11Limits';
import { S12Recap } from './S12Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-spoof': S02Spoof,
  's03-dmarc': S03Dmarc,
  's04-dns': S04Dns,
  's05-rules': S05Rules,
  's06-ids': S06Ids,
  's07-edr': S07Edr,
  's08-scope': S08Scope,
  's09-isolate': S09Isolate,
  's10-data': S10Data,
  's11-limits': S11Limits,
  's12-recap': S12Recap,
};
