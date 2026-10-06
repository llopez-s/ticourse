/**
 * s09-limites «Cuando no hay caja» — on-screen strings (canon: out/scene-brief.md «Canon»; the lesson's «Crítica
 * habitual», `src/data/s2.ts:44-48`, and s2m1q6, `:185-198`). The insider is a hypothetical, faceless figure («¿y
 * si…?»), not tied to Meridian: no name, role or badge. The Diamond Model card shows a small four-corner diamond with
 * nothing in its vertices (Lab 2B is not touched).
 */
import type { IconName } from '../../../engine/src/ui';

/** The hypothetical (s09-01 «¿Y si quien se lleva los planos vive en la casa, o tiene una llave de verdad?»). */
export const WHAT_IF = '¿y si…?';

/** `limits` (s09-03), one chip per case the voice names; `word` is where it lands. */
export const LIMITS: readonly { text: string; word: string; icon: IconName }[] = [
  { text: 'insider con acceso legítimo', word: 'insider', icon: 'user' },
  { text: 'credenciales válidas', word: 'credenciales', icon: 'key' },
  { text: 'servicios en la nube (SaaS)', word: 'nube', icon: 'cloud' },
];

/** `fits` (s09-04). */
export const FITS = 'encaja bien: intrusiones con malware y fases en fila';

/** `complements` (s09-05): the two models that complete it; `word` is where each card lands. */
export const COMPLEMENTS = [
  { name: 'ATT&CK', sub: 'el cómo, técnica a técnica', word: 'ATT&CK' },
  { name: 'Diamond Model', sub: 'cada paso, un diamante de cuatro esquinas', word: 'Diamond' },
] as const;
