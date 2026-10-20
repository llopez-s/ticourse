/** s02-maquina «Una pared y un cajón» — on-screen strings (canon: out/scene-brief.md). */

/** The building beat: one caption row per idea, each lit on its own cue/word. */
export const WALL_LABEL = 'hipervisor';
export const WALL_SUB = 'las paredes entre pisos';
export const HOLE = { lead: 'un agujero al piso de al lado', strong: 'salirte del tuyo' } as const;
export const DRAWER = { lead: 'papeles del anterior en un cajón', strong: 'ninguna pared rota' } as const;

/** The diagram rows. */
export const ESCAPE = { term: 'VM escape', fix: 'se cierra parcheando el hipervisor' } as const;
export const REUSE = { term: 'resource reuse', fix: 'se cierra limpiando antes de reasignar', retired: 'de baja', fresh: 'nueva' } as const;
export const QUESTION = '¿alguien ha salido de su máquina?';
