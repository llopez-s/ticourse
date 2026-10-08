/**
 * s01-hook «Tres caminos hacia dentro» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * The zone plan draws its own labels (ZoneRow, copied unchanged from V16); this file holds what the scene adds
 * around it: the approval stamp, the title with its English line, the promise chips (which later label the three
 * paths), and BLIND ARCHITECT's tag (a label: no portrait, no gender mark). No other date anywhere.
 */
import type { IconName } from '../../../engine/src/ui';

/** «aprobado · 20-11»: the plan is approved, not running. */
export const STAMP = { what: 'aprobado', day: '20-11' } as const;

/** «Por dónde se entra», its last words lit. */
export const TITLE = { lead: 'Por dónde ', lit: 'se entra' } as const;
/** «802.1X · VPN · IPSec» (exam terms, kept in English). */
export const SUBTITLE = ['802.1X', 'VPN', 'IPSec'] as const;

/**
 * The promise (s01-03 «quién puede enchufarse a la red, cómo se unen dos sedes y cómo entra quien está fuera»),
 * one chip per idea, each on its word. On `paths` each chip moves under its path's icon.
 */
export const PROMISE: { text: string; word: string; icon: IconName }[] = [
  { text: 'quién se enchufa', word: 'enchufarse', icon: 'plug' },
  { text: 'cómo se unen dos sedes', word: 'sedes', icon: 'link' },
  { text: 'cómo entra quien está fuera', word: 'fuera', icon: 'laptop' },
];

/** The three paths (s01-04), in the promise's order, each lit on its word. */
export const PATHS = [
  { kind: 'socket', word: 'toma' },
  { kind: 'terminal', word: 'terminal' },
  { kind: 'hotel', word: 'hotel' },
] as const;

/** «BLIND ARCHITECT · sección 3» with «vive de los planos con atajos» (rose; a label only). */
export const ADVERSARY = { name: 'BLIND ARCHITECT', section: 'sección 3', line: 'vive de los planos con atajos' } as const;
