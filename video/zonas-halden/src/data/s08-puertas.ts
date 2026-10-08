/**
 * s08-puertas «La salida de emergencia» — on-screen strings (canon: out/scene-brief.md).
 * The verbs are never elided: the exit «se abre», the server-room door «se queda bloqueada».
 * Not canon (taken from the narration): the building plaque, the two door signs, the two verb
 * chips and the wrap's two group headers.
 */

export const S08 = {
  building: 'edificio de oficinas',
  exitSign: ['salida de', 'emergencia'] as const,
  serverSign: ['sala de', 'servidores'] as const,
  opens: 'se abre',
  locked: 'se queda bloqueada',
  safe: { term: 'FAIL-SAFE', sub: 'primero, la gente' },
  secure: { term: 'FAIL-SECURE', sub: 'primero, lo que guarda' },
  /** «en las personas manda la vida; en los datos, la protección» (lesson sp3m4, :383). */
  life: ['en las personas manda la vida;', 'en los datos, la protección'] as const,
  wrap: {
    controls: 'cada control',
    doors: 'cada puerta',
    terms: { open: 'FAIL-OPEN', closed: 'FAIL-CLOSED', safe: 'FAIL-SAFE', secure: 'FAIL-SECURE' },
  },
} as const;
