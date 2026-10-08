/**
 * s10-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md). The rules follow the frozen voice
 * (s10-01..03): the title is the shape the voice names, then two lines. Titles are two hard lines ≤ 15 characters
 * so RuleCards keeps them at 54 px; sub lines ≤ 27 characters at 32 px. Words in capitals are exam terms (violet).
 * Rule 1 mirrors s03's rule («cifras con SU pública») and s07's («tu privada no esconde: firma»).
 */

export type RuleArt = 'mailbox-seal' | 'fingerprint' | 'paint-key';

export interface RecapLine {
  text: string;
  /** 'naviera' = emerald (her mailbox, her keys); 'puerto' = cyan (your seal); 'exam' = violet. */
  tone?: 'naviera' | 'puerto' | 'exam';
}

export interface RecapRule {
  art: RuleArt;
  title: readonly [string, string];
  sub: readonly [RecapLine, RecapLine];
}

export const RULES: readonly RecapRule[] = [
  // «Para que solo lo lea el destinatario, su buzón, su clave pública. Para que sepa que eres tú, tu sello, tu privada.»
  {
    art: 'mailbox-seal',
    title: ['Su buzón,', 'tu sello'],
    sub: [
      { text: 'cifras con SU pública', tone: 'naviera' },
      { text: 'firmas con TU privada', tone: 'puerto' },
    ],
  },
  // «Un hash es una huella, y no se descifra. Las contraseñas se guardan así, con sal y despacio.»
  {
    art: 'fingerprint',
    title: ['Un hash no', 'se descifra'],
    sub: [{ text: 'contraseñas: sal y despacio' }, { text: 'SALT · KEY STRETCHING', tone: 'exam' }],
  },
  // «Y la asimétrica acuerda la clave y pone el sello. La simétrica cifra todo lo demás. Eso es TLS.»
  {
    art: 'paint-key',
    title: ['La asimétrica', 'acuerda y sella'],
    sub: [{ text: 'la simétrica cifra el resto' }, { text: 'eso es TLS', tone: 'exam' }],
  },
];

/** The one next step (s10-04 «Ahora te toca el laboratorio Crypto Toolbox») and the lab it points to (spl1c). */
export const NEXT = 'Ahora te toca: el laboratorio Crypto Toolbox';
export const LAB = 'spl1c · 12 necesidades';

export const END = {
  title: ['Criptografía:', 'quién usa qué clave'],
  sub: 'y por qué TLS es híbrido',
  lab: 'spl1c · 12 necesidades · aprueba con 80 %',
  objective: 'Security+ SY0-701 · objetivo 1.4',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
