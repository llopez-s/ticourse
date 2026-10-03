import type { IconName } from '../../../engine/src/ui';

/** s07-factors «Tarjeta y PIN»: on-screen text (canon: out/scene-brief.md, «Exact on-screen strings»). */

/** The generic login (no brand, not the VPN nor Halden's IdP): two screens. */
export const LOGIN = {
  title: 'Iniciar sesión',
  password: 'contraseña',
  questionLabel: 'pregunta secreta:',
  question: '¿cómo se llamaba tu primera mascota?',
  next: 'Siguiente',
  enter: 'Entrar',
} as const;

/** The four factor types, with their examples. */
export interface FactorType {
  id: 'know' | 'have' | 'are' | 'where';
  title: string;
  icon: IconName;
  examples: string[];
}
export const TYPES: FactorType[] = [
  { id: 'know', title: 'algo que sabes', icon: 'brain', examples: ['contraseña', 'PIN', 'pregunta secreta'] },
  { id: 'have', title: 'algo que tienes', icon: 'key', examples: ['token', 'app de códigos', 'llave de seguridad', 'tarjeta inteligente'] },
  { id: 'are', title: 'algo que eres', icon: 'user', examples: ['huella', 'cara', 'iris'] },
  { id: 'where', title: 'dónde estás', icon: 'globe', examples: ['ubicación', 'red'] },
];

/** Tokens that drop into the trays. */
export const TOKENS = {
  card: 'tarjeta',
  pin: 'PIN',
  password: 'contraseña',
  question: 'pregunta secreta',
  token: 'token',
  app: 'app de códigos',
} as const;

export const LABELS = {
  twoThefts: 'dos robos distintos',
  oneCall: 'en una sola llamada te sacan las dos',
  oneFactor: '1 factor',
  mfa: 'MFA · multifactor',
  mfaSub: 'tipos distintos, no pantallas',
} as const;
