/** s06-bolsillo «La puerta de atrás» — on-screen strings (canon: out/scene-brief.md). */

export const CONCERT = {
  sneak: 'se cuela por la puerta de atrás',
  skips: 'se salta el control',
  inside: 'la seguridad sigue dentro',
  gone: ['sin seguridad dentro', 'todas las puertas abiertas'],
} as const;

export const STORE = { name: 'tienda oficial', review: 'revisión', outside: 'fuera de la tienda' } as const;
export const BYPASS = ['sin pasar por la', 'revisión de la tienda'] as const;
export const INTACT = 'el sistema sigue entero';
export const SIDELOAD = 'side loading';

export const PROTECTIONS = {
  main: 'aislamiento entre apps',
  often: 'a menudo:',
  boot: 'arranque verificado',
  mdm: 'MDM',
} as const;
export const ROOTING = { term: 'rooting', os: 'Android' } as const;
export const JAILBREAK = { term: 'jailbreaking', os: 'iPhone' } as const;
