import type { SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';

/** s01-hook: stub until the scene is built (see out/scene-brief.md). */
export function S01Hook(props: SceneProps) {
  return <Placeholder id="s01-hook" props={props} />;
}
