import type { SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';

/** Provisional scene (phase 1): phase 2 replaces this file with the real scene. */
export function S01Hook(props: SceneProps) {
  return <Placeholder id="s01-hook" props={props} />;
}
