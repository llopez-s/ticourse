/**
 * s08-fatigue «Avisos sin parar»: on-screen text (canon: out/scene-brief.md). The phone demo is
 * hypothetical and undated: clock 00:04 (the voice says «a medianoche»; never 03:xx). No ATM here.
 * Nothing says or hints that Halden will use keys. The look-alike is V1 s11's haldenp0rt.example;
 * the real site carries no domain at all.
 */

export const PHONE = {
  clock: '00:04',
  sim: 'simulación · sin fecha',
  strip: 'alguien ya tiene tu contraseña',
  push: '¿Estás iniciando sesión?',
  approve: 'Aprobar',
  reject: 'Rechazar',
  counter: 'avisos',
  counterOne: 'aviso',
} as const;

export const FATIGUE = { term: 'MFA FATIGUE', sub: 'push bombing' } as const;

export const SMS = {
  title: 'códigos SMS',
  swap: 'se desvía a otro móvil: SIM swapping',
  fake: 'se teclea en una web falsa',
  verdict: 'solo cambia el ataque',
} as const;

export const KEY = {
  title: 'llave de seguridad FIDO2',
  touch: 'hay que tocarla, en el equipo donde se entra',
  origin: 'solo firma para la web de verdad',
  real: 'la web de verdad',
  fakeHost: 'haldenp0rt.example',
  /** Index of the swapped character in fakeHost (the zero). */
  fakeIndex: 7,
  signs: 'firma',
  noSign: 'no firma',
  resist: 'resistente al phishing',
  login: 'Iniciar sesión',
} as const;

export const CLOSE = ['no se aprueba desde lejos', 'no sirve en una web falsa'] as const;
