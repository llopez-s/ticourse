import raw from '../timeline.json';
import { checkTimeline } from '../../../engine/src/timeline/load';

/** This video's timeline (built by video/engine/scripts/build-timeline.mjs --video kill-chain-eslabon). */
export const TIMELINE = checkTimeline(raw);
