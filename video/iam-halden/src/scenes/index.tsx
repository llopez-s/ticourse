import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';

/** One line per scene; each placeholder is replaced by its scene when it is built. */
export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': (p) => <Placeholder id="s01-hook" props={p} />,
  's02-creep': (p) => <Placeholder id="s02-creep" props={p} />,
  's03-leaver': (p) => <Placeholder id="s03-leaver" props={p} />,
  's04-saml': (p) => <Placeholder id="s04-saml" props={p} />,
  's05-oauth': (p) => <Placeholder id="s05-oauth" props={p} />,
  's06-cual': (p) => <Placeholder id="s06-cual" props={p} />,
  's07-factors': (p) => <Placeholder id="s07-factors" props={p} />,
  's08-fatigue': (p) => <Placeholder id="s08-fatigue" props={p} />,
  's09-vault': (p) => <Placeholder id="s09-vault" props={p} />,
  's10-jit': (p) => <Placeholder id="s10-jit" props={p} />,
  's11-recap': (p) => <Placeholder id="s11-recap" props={p} />,
};
