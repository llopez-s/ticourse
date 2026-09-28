/**
 * S09 "Aislar sin apagar" — fictitious data only. The corrected canon (post
 * accuracy review): the leaked service-account credential is a loose end
 * NOBODY had detected yet at this point in the story — not a known, ignored
 * leak — so on-screen wording must read "aún sin detectar", never "cabo
 * suelto conocido" or similar. It resurfaces at 01:52 in the SIEM video.
 */
export const ISOLATION = {
  // Hostname matches s07-edr.ts / s08-scope.ts (this scene's own invention).
  // No surname for Lucía: other scenes (S02Spoof, S04Dns) only ever say "Lucía".
  host: 'OPS-WS-14',
  user: 'Lucía',
  reason: 'Proceso sospechoso + conexión C2 (EDR)',
  time: '3-9-2026 · 16:11',
  owner: 'Analista de turno · SOC',
} as const;

/** Only the EDR channel survives isolation; everything else is cut. */
export const CHANNELS = [
  { key: 'internet', icon: 'globe', label: 'Internet', cut: true },
  { key: 'mail', icon: 'mail', label: 'Correo', cut: true },
  { key: 'shared', icon: 'database', label: 'Recursos compartidos', cut: true },
  { key: 'edr', icon: 'shield', label: 'Consola EDR', cut: false },
] as const;

/** What staying powered on preserves (RAM is evidence). */
export const PRESERVED = ['Procesos en memoria', 'Conexiones de red activas', 'Claves y tokens en RAM'] as const;
