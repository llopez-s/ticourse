/** s04-fuera «Cuando el portátil sale» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

export const OFFICE = 'oficina';
export const PERIMETER = 'el cortafuegos del perímetro';
export const INTERNET = 'Internet';
export const OUTSIDE = 'red de fuera';

/** Where the laptop goes, each lit on its word in s04-02 (the client's office is screen only). */
export const PLACES: { text: string; word?: string }[] = [
  { text: 'casa', word: 'casa' },
  { text: 'una feria', word: 'feria' },
  { text: 'la oficina de un cliente' },
];

/** What travels with the laptop. `dim`: always at half light (no claim that every port device has it). */
export const TRAVELS: { term: string; what: string; icon: IconName; seg: string; word: string; dim?: boolean }[] = [
  { term: 'host-based firewall', what: 'quién se conecta', icon: 'firewall', seg: 's04-03', word: 'host-based' },
  { term: 'endpoint protection', what: 'qué se ejecuta', icon: 'shield', seg: 's04-04', word: 'endpoint', dim: true },
  { term: 'disco cifrado', what: 'si se pierde', icon: 'key', seg: 's04-04', word: 'protection' },
];

/** Screen only, small, on `hips-hids`. */
export const HIPS_HIDS = 'HIPS bloquea · HIDS solo avisa';

/** The rule in plain words (never «solo»). */
export const RULE = 'fuera, te protege lo que llevas puesto';
export const HEATER_LABEL = 'se queda';
export const COAT_LABEL = 'viaja contigo';
