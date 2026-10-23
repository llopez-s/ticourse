/** s05-f3ead «Cuando hay un incidente» — on-screen strings (canon: storyboard goal, exact). Generic: no team, no case, no date. */
export const S05_STEPS = [
  { en: 'Find', es: 'localizar', half: 'ops' },
  { en: 'Fix', es: 'fijar', half: 'ops' },
  { en: 'Finish', es: 'neutralizar', half: 'ops' },
  { en: 'Exploit', es: 'explotar', half: 'intel' },
  { en: 'Analyze', es: 'analizar', half: 'intel' },
  { en: 'Disseminate', es: 'difundir', half: 'intel' },
] as const;
export const S05_BORN = 'nació en operaciones militares';
export const S05_OPS = { label: 'operación', steps: ['localizar', 'fijar', 'neutralizar'], until: 'hasta contener el incidente' } as const;
export const S05_INTEL = { label: 'inteligencia', steps: ['explotar la evidencia capturada', 'analizarla', 'difundirla'] } as const;
export const S05_LOOP = 'la evidencia alimenta el siguiente ciclo';
export const S05_INCIDENT = { incident: 'incidente', contained: 'contenido', evidence: 'evidencia capturada' } as const;
export const S05_GEARS = { big: ['ciclo de inteligencia', 'ritmo del equipo'], small: ['F3EAD', 'incidente activo'], wrap: 'uno marca el ritmo, el otro acelera' } as const;
