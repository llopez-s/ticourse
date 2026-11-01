/** s10-estandar «La respuesta de libro» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

export const COLUMN_TITLES = { standard: 'práctica estándar', trick: 'ocurrencia' } as const;

/** The lesson's three controls (left column), each lit on its word in segment s10-02. */
export const CONTROLS: { label: string; icon: IconName; word: string }[] = [
  { label: 'una política', icon: 'file', word: 'política' },
  { label: 'el multifactor', icon: 'key', word: 'multifactor' },
  { label: 'la segmentación', icon: 'split', word: 'segmentación' },
];

/** The empty box of the right column. */
export const TRICK = 'un truco propio';

/** The third row (from another lesson of the course): two lines. */
export const AUTHORITY: readonly [string, string] = ['para el público: una autoridad pública,', 'no un certificado hecho en casa'];

/** The beam's labels: «suele», not «siempre» (struck). */
export const BEAM = { usually: 'suele', always: 'siempre' } as const;
