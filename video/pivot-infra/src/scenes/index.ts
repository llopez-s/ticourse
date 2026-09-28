import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { S01Hook } from './S01Hook';
import { S02Sources } from './S02Sources';
import { S03Pdns } from './S03Pdns';
import { S04Tenants } from './S04Tenants';
import { S05Cert } from './S05Cert';
import { S06Ct } from './S06Ct';
import { S07Whois } from './S07Whois';
import { S08Lifecycle } from './S08Lifecycle';
import { S09Preblock } from './S09Preblock';
import { S10Opsec } from './S10Opsec';
import { S11Recap } from './S11Recap';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': S01Hook,
  's02-sources': S02Sources,
  's03-pdns': S03Pdns,
  's04-tenants': S04Tenants,
  's05-cert': S05Cert,
  's06-ct': S06Ct,
  's07-whois': S07Whois,
  's08-lifecycle': S08Lifecycle,
  's09-preblock': S09Preblock,
  's10-opsec': S10Opsec,
  's11-recap': S11Recap,
};
