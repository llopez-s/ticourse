import type { SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';

/** Stub until the scene is built. */
export function S01Hook(props: SceneProps) {
  return <Placeholder id="s01-hook" props={props} />;
}
