import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Creep } from './S02Creep';
import { S03Leaver } from './S03Leaver';
import { S04Saml } from './S04Saml';
import { S05Oauth } from './S05Oauth';
import { S06Cual } from './S06Cual';
import { S07Factors } from './S07Factors';
import { S08Fatigue } from './S08Fatigue';
import { S09Vault } from './S09Vault';
import { S10Jit } from './S10Jit';
import { S11Recap } from './S11Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-creep': S02Creep,
  's03-leaver': S03Leaver,
  's04-saml': S04Saml,
  's05-oauth': S05Oauth,
  's06-cual': S06Cual,
  's07-factors': S07Factors,
  's08-fatigue': S08Fatigue,
  's09-vault': S09Vault,
  's10-jit': S10Jit,
  's11-recap': S11Recap,
};
