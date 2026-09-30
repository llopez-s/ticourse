import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';

const placeholder = (id: SceneId): ComponentType<SceneProps> =>
  function PlaceholderScene(props: SceneProps) {
    return <Placeholder id={id} props={props} />;
  };

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-hook': placeholder('s01-hook'),
  's02-mesa': placeholder('s02-mesa'),
  's03-simulacro': placeholder('s03-simulacro'),
  's04-caza': placeholder('s04-caza'),
  's05-huecos': placeholder('s05-huecos'),
  's06-recap': placeholder('s06-recap'),
};
