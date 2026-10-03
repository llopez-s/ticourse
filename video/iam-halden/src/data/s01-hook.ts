/**
 * s01-hook «La contraseña buena» — on-screen strings (canon: scene brief «Canon» > s01).
 * The 01:52 card itself lives in scenes/parts/LogonCard.tsx (LOGON_TEXT).
 */
import type { IconName } from '../../../engine/src/ui';

export const QUESTION = '¿era quien decía ser?';

export const TITLE = { main: 'Identidad y acceso', sub: 'IAM · identity and access management' } as const;

/** Promise chips, each synced to the word that says it (s01-03). */
export const PROMISE: { text: string; word: string; icon: IconName }[] = [
  { text: 'quién entra', word: 'quién', icon: 'user' },
  { text: 'cómo lo demuestra', word: 'cómo', icon: 'key' },
  { text: 'hasta dónde llega', word: 'hasta', icon: 'unlock' },
];

/** The two questions (s01-04): the question, then its exam name. */
export const TWO_Q: { q: string; term: string; qWord: string; termWord: string; icon: IconName }[] = [
  { q: '¿eres quien dices?', term: 'AUTHENTICATION', qWord: 'eres', termWord: 'authentication', icon: 'user' },
  { q: '¿qué puedes hacer?', term: 'AUTHORIZATION', qWord: 'qué', termWord: 'authorization', icon: 'unlock' },
];

/** The video's route: four stops (s01-05). */
export const ROUTE: { label: string; icon: IconName }[] = [
  { label: 'altas y bajas', icon: 'users' },
  { label: 'casa ajena', icon: 'globe' },
  { label: 'segundo factor', icon: 'shield' },
  { label: 'llaves maestras', icon: 'key' },
];

/** Chapter close (s01-06). Canon: no not-equal glyph (Latin font subsets). */
export const CLOSE = { lead: 'saber la contraseña', mid: 'no es', tail: 'ser quien dice' } as const;
