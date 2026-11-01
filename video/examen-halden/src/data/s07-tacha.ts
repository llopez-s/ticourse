/** s07-tacha «Tacha antes de elegir» — on-screen strings (canon: out/scene-brief.md). The options are the ones of questions 1 and 2, in miniature. */
import type { QualifierId } from './qualifiers';

export interface MiniQuestion {
  /** Small label before the qualifier pill. */
  label: string;
  /** The qualifier that decides. */
  q: QualifierId;
  /** The four options A–D, shortened (no scenario, no question: they are not posed again). */
  options: readonly [string, string, string, string];
  /** The two that fall (0-based), in the order the voice strikes them. */
  struck: readonly [number, number];
  /** Why they fall, in the chip. */
  reason: string;
  /** Word of the segment on which each option is struck, on which the reason lands, and on which the qualifier lights. */
  segment: string;
  words: { first: string; second: string; reason: string; light: string };
}

export const QUESTIONS: readonly [MiniQuestion, MiniQuestion] = [
  {
    label: 'pregunta 1',
    q: 'best',
    options: ['Gestor de contraseñas', 'MFA', 'Contraseñas largas', 'Inicio de sesión único'],
    struck: [1, 2],
    reason: 'no resuelve ninguna de las dos cosas',
    segment: 's07-01',
    words: { first: 'quitar', second: 'opciones', reason: 'resolvían', light: 'cuentas' },
  },
  {
    label: 'pregunta 2',
    q: 'first',
    options: ['Seguro cibernético', 'Inventario de activos', 'Listar amenazas', 'Pérdida anual esperada'],
    struck: [0, 3],
    reason: 'aún no sabes qué cubrir',
    segment: 's07-02',
    words: { first: 'seguro', second: 'pérdida', reason: 'dependían', light: 'existía' },
  },
];

/** The two steps, numbered. */
export const STEPS = [
  { n: '1', text: 'tacha lo que no responde o llega a destiempo' },
  { n: '2', text: 'entre las que quedan, manda el calificador' },
] as const;
