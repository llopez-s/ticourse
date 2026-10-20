/** s06-terceros «Lo que llega firmado» — on-screen strings (canon: out/scene-brief.md). */

export const MAKER = 'las manda su fabricante · nadie de recepción hace nada';
export const IF = 'si pasara · no ha pasado';
export const SIGNED = 'llegaría firmada, por el camino de siempre';
export const SUPPLY = { term: 'Supply chain', plain: 'un tercero de confianza con acceso' } as const;

/** The three third parties of the objective, each with its chip (verbatim). */
export const THIRD_PARTIES: readonly { chip: string; sub: readonly string[]; icon: 'users' | 'app' | 'link' }[] = [
  { chip: 'MSP', sub: ['te administra en remoto'], icon: 'users' },
  { chip: 'vendor', sub: ['te vende y actualiza', 'el programa o el aparato'], icon: 'app' },
  { chip: 'supplier', sub: ['más lejos en la cadena'], icon: 'link' },
];

/** The two crossings-out: the word struck, and the caption in full. */
export const NOT_INSIDER = { word: 'insider', text: 'no es insider: es un actor, no un camino' } as const;
export const NO_CLICK = { text: 'aquí nadie hace clic' } as const;
