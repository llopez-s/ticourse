import { createLessonRoot } from '../../engine/src/LessonRoot';
import { Poster } from './Poster';
import { SCENES } from './scenes';
import { TIMELINE } from './timeline/load';

/** Ids must match video.json ("composition", "poster"). */
export const HilosPeliculaRoot = createLessonRoot({
  timeline: TIMELINE,
  scenes: SCENES,
  composition: 'HilosPelicula',
  poster: 'HilosPeliculaPoster',
  Poster,
});
