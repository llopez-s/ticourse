import { createContext, useContext } from 'react';
import type { Timeline } from './types';

/**
 * The timeline of the video being rendered. LessonVideo provides it; the
 * persistent overlays read it, so the engine never imports a video's
 * timeline.json directly.
 */
const TimelineContext = createContext<Timeline | null>(null);

export const TimelineProvider = TimelineContext.Provider;

export function useTimeline(): Timeline {
  const timeline = useContext(TimelineContext);
  if (!timeline) throw new Error('useTimeline() needs a <TimelineProvider> (mount the overlay inside LessonVideo)');
  return timeline;
}
