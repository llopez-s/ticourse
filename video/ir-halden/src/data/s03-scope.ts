import type { IconName } from '../../../engine/src/ui';

/**
 * s03-scope: scene-only text (canon: out/scene-brief.md). The three hosts of
 * the 3-9 scope (V1 s08) are shared with s04-key, which zooms the third one.
 * No account is in the 3-9 scope: that the credential had left was not known.
 */

export interface ScopeHost {
  host: string;
  role: string;
  icon: IconName;
  /** Isolation time from the EDR (V1); absent = not isolated. */
  isolated?: string;
  /** «donde viven las llaves» (the admin workstation). */
  keys?: boolean;
}

export const SCOPE_HOSTS: readonly ScopeHost[] = [
  { host: 'OPS-WS-14', role: 'portátil de Lucía', icon: 'laptop', isolated: '16:11' },
  { host: 'OPS-WS-08', role: 'Operaciones', icon: 'desktop', isolated: '16:15' },
  { host: 'ADM-WS-02', role: 'estación de administración', icon: 'desktop', keys: true },
];

export const SCOPE_HEADER = { title: 'Alcance del 3-9', count: 'tres equipos' } as const;
export const KEYS_TAG = 'donde viven las llaves';
export const ISOLATED_LABEL = 'aislado';
export const POWER_TAG = 'encendido · memoria preservada';
/** s03-05: callout under the Contención cell when the box is ticked. */
export const MARKED_TAG = 'casilla marcada';

/** Body of Análisis on the full board (s03-01). */
export const ANALYSIS_QUESTION = ['¿hasta dónde ha', 'llegado la atacante?'] as const;
export const SCOPE_TAG = 'alcance';

/** s03-04: why they stay on. */
export const RAM_LINES = {
  evidence: { lines: ['lo que hay en la memoria', 'también es prueba'], word: 'memoria' },
  off: { lines: ['si lo apagas,', 'se pierde para siempre'], word: 'apagas,' },
} as const;
