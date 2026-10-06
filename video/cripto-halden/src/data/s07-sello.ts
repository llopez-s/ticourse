/** On-screen text of s07-sello «El sello del puerto» (storyboard goal). Prints come from s04's data. */

export const INTRO = {
  seal: 'el sello de lacre del puerto',
  ring: { name: 'el anillo', title: 'clave privada', sub: 'solo lo tiene el puerto' },
  design: { name: 'el dibujo', title: 'clave pública', sub: 'lo conoce todo el mundo' },
} as const;

export const LANES = { port: 'puerto', naviera: 'naviera' } as const;

export const STEPS = {
  sealed: 'huella sellada con su privada',
  recomputed: 'vuelve a sacar la huella',
  pattern: ['pública', 'del puerto'] as const,
  ok: 'el sello encaja con la huella que acaba de sacar',
  okChip: 'del puerto · intacta',
  bad: 'un precio cambiado: el sello ya no encaja',
} as const;

export const SIGNATURE = {
  term: 'DIGITAL SIGNATURE',
  chips: ['INTEGRITY', 'AUTHENTICATION', 'NON-REPUDIATION'] as const,
  nonRepudiation: 'el puerto no puede negar que la ofreció',
} as const;

export const PAIR = {
  head: 'tu privada no esconde: firma',
  mailbox: { lead: 'para que solo lo lea la naviera', key: 'su buzón' },
  seal: { lead: 'para que sepa que eres tú', key: 'tu sello' },
} as const;
