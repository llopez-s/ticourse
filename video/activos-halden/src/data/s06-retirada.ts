/** s06-retirada «Cuando el disco de red se jubila» — on-screen strings (canon: out/scene-brief.md). */

export const LATER = 'Más adelante · sin fecha';
/** No name, no contract. */
export const RECYCLER = 'un gestor autorizado';
export const MAGNETIC = 'magnético';

/** Drive A, the one that still works. */
export const OVERWRITE = ['sobrescritura completa', 'y verificada'] as const;
/** Drive B, the broken one. */
export const NO_OVERWRITE = 'no admite sobrescritura';

export const TERMS = {
  sanitization: 'sanitization',
  destruction: 'destruction',
  certification: 'certification',
} as const;

/** What never counts (no voice; on screen while the overwrite is explained). */
export const NEVER = { head: 'no valen:', items: ['borrar ficheros', 'vaciar la papelera', 'quick format'] } as const;

/** The car («imagen · no es del puerto»): two outcomes, each lit on its words. */
export const CAR_SELL = ['rueda y pasa la ITV,', 'se vende'] as const;
export const CAR_SCRAP = ['si no, al desguace, con su', 'certificado de destrucción'] as const;

/** The last line, on screen only (the ficha's first cut): it announces question 3. */
export const SSD_TEASER = 'los discos de estado sólido se borran de otra manera';
