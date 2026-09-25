import { Composition } from 'remotion';
import timeline from './timeline.json';
import { EDRVideo } from './EDRVideo';

export const EDRRoot = () => (
  <Composition
    id="EDRBlueTeam"
    component={EDRVideo}
    durationInFrames={timeline.durationFrames}
    fps={timeline.fps}
    width={1280}
    height={720}
  />
);
