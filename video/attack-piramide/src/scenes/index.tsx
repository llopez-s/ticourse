import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';

/** One line per scene; each placeholder is replaced by its scene when it is built. */
export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': (p) => <Placeholder id="s01-hook" props={p} />,
  's02-escalera': (p) => <Placeholder id="s02-escalera" props={p} />,
  's03-ramas': (p) => <Placeholder id="s03-ramas" props={p} />,
  's04-piramide': (p) => <Placeholder id="s04-piramide" props={p} />,
  's05-otra-ropa': (p) => <Placeholder id="s05-otra-ropa" props={p} />,
  's06-recap': (p) => <Placeholder id="s06-recap" props={p} />,
};
