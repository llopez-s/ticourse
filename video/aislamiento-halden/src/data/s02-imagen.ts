/** s02-imagen «Se cambia, no se parchea» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

export const CASE = 'tablón interno · contenedores de prueba · sin desplegar';
export const IMAGE_LABEL = 'imagen del tablón';
export const COPIES_LABEL = 'copias · contenedores de prueba';
/** After `rebuild`: the test copies are replaced. */
export const COPIES_NEW = 'copias nuevas · imagen corregida';

/** The four controls on the image, each lit on its cue; exam names only on screen. */
export const CONTROLS: { cue: string; text: string; icon: IconName; term?: string }[] = [
  { cue: 'registry', text: 'de nuestro registro interno', icon: 'database', term: 'REGISTRY TRUST' },
  { cue: 'provenance', text: 'firmada: se sabe de dónde viene', icon: 'check', term: 'IMAGE PROVENANCE' },
  { cue: 'scan', text: 'escaneada antes de desplegar', icon: 'search' },
  { cue: 'no-root', text: 'nada corre como root', icon: 'user' },
];

/** What the scan finds before deploying: no name, no version. */
export const FINDING = 'un componente con un fallo ya publicado';

/** The two paths (`two-paths`, `rebuild`). */
export const PATH_PATCH = { text: 'entrar en cada copia y corregirlo dentro', note: 'la próxima copia sale igual' } as const;
export const PATH_REBUILD = ['corregir la imagen y escanearla otra vez', 'copias nuevas, que sustituyen a las de prueba'] as const;
