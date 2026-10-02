/** s02-mesa «Ensayo en la sala»: scene-only text (canon: out/scene-brief.md). */

export const HEAD = 'Dos formas de probar un plan';

export const CAPTION = { mesa: 'la mesa', drill: 'el simulacro' } as const;

/** The answer: why the table («La mesa, porque ahí solo se habla»). */
export const TABLE_CHIPS = ['se habla', 'no se toca ningún sistema', 'barato'] as const;

/** The exam name, in English on screen. */
export const NAME = { label: 'en el examen', en: 'TABLETOP EXERCISE' } as const;

/** The port's tabletop. */
export const ROOM = { date: '2026-10-02', time: '09:30', room: 'sala de crisis' } as const;
export const AREAS = ['Seguridad', 'Sistemas', 'Operaciones', 'Comunicación', 'Dirección', 'Asesoría jurídica'] as const;

/** The case card: hypothetical, a rehearsal card (nothing is touched in the room). */
export const CASE = {
  tag: 'Caso',
  time: '03:00',
  what: 'se cae el correo corporativo',
  ask: '¿a quién llamas?',
  rehearsal: 'ensayo',
} as const;

export const ANSWER = 'a la suplente de Seguridad';

/** The deputy's number lives in the plan's contact list, inside the mailbox. */
export const MAILBOX = { title: 'correo', list: 'lista de contactos del plan' } as const;

/** The fix: a copy of the list on paper and on the on-call phone (the mail copy stays). */
export const FIX = {
  paper: 'papel',
  phone: 'móvil de guardia',
  row: { text: 'lista de contactos fuera de banda', owner: 'Seguridad', date: '05-10' },
} as const;
