import { LessonVideo } from '../../engine/src/LessonVideo';
import { SCENES } from './scenes';
import { TIMELINE } from './timeline/load';

export function SIEMVideo() {
  return <LessonVideo timeline={TIMELINE} scenes={SCENES} />;
}
