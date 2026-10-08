/**
 * s06-barrera «Cuando se va la luz» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * The checkpoint before the cut is staffed and powered (guard, lamp lit): never s02's empty one.
 * No hosts, dates or people here.
 */

export const S06 = {
  /** «Lo que va en el camino del tráfico acabará fallando», split in two lines. */
  headline: ['Lo que va en el camino del tráfico', 'acabará fallando'] as const,
  /** Three causes, one chip each, on their words in s06-02. */
  causes: ['memoria', 'firmas corruptas', 'corriente'] as const,
  open: { term: 'FAIL-OPEN', lines: ['pasa sin inspeccionar', 'gana la disponibilidad'] as const },
  closed: { term: 'FAIL-CLOSED', lines: ['no pasa ni un camión', 'gana la seguridad'] as const, also: 'también: fail-secure' },
  depends: { q: '¿siempre?', a: 'Depende de qué sale más caro' },
} as const;
