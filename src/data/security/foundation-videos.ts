import type { YouTubeVideoBlock } from '../../lib/types';

/**
 * Lesson videos of the fundamentals, keyed by FoundationLesson id. The page shows each one between
 * «Ejemplo resuelto» and «Error que conviene evitar». The blocks use the same shape as the lessons of the
 * two tracks, so the pending-scripts page finds them as «integrado» from the poster path.
 */
export const FOUNDATION_VIDEOS: Record<string, YouTubeVideoBlock> = {
  // F1 puts f05–f08 together in one round trip, so it closes the network block, in f08
  f08: {
    t: 'video',
    title: 'Cómo viaja una conexión: IP, gateway, NAT y puertos',
    youtube: 'MivW8FBd6Is',
    poster: 'videos/viaje-conexion-poster.png',
    transcript: 'videos/viaje-conexion-transcript.txt',
  },
  // F4 reads four logs with fields, UTC and a timeline, the subject of f12
  f12: {
    t: 'video',
    title: 'Cómo reconstruir lo ocurrido: logs, UTC y cronologías',
    youtube: '69BGahUytbg',
    poster: 'videos/reconstruir-poster.png',
    transcript: 'videos/reconstruir-transcript.txt',
  },
};
