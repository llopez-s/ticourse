/**
 * s06-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md). The rules follow the frozen voice
 * (s06-01..03), not the ficha's draft «Cierre» (which still said «en clave»): the title is the shape the voice
 * names, then three lines — the detail, the exam name (English, violet) and what to do (emerald). Titles are
 * two hard lines ≤ 15 characters so RuleCards keeps them at 54 px; sub lines ≤ 27 characters at 32 px. Words of
 * `detail` in capitals are exam terms (violet): rule 3 shows «reflejadas y amplificadas» as REFLECTED y AMPLIFIED,
 * the English the brief keeps on screen.
 */
import type { TrailKind } from '../scenes/parts/TrailRow';

export interface RecapRule {
  kind: TrailKind;
  title: readonly [string, string];
  detail: string;
  exam: string;
  action: { lead: string; strong?: string };
}

export const RULES: readonly RecapRule[] = [
  // «Una llave en muchas puertas, sin ningún bloqueo, es spraying. Contra eso, MFA.»
  { kind: 'key', title: ['Una llave en', 'muchas puertas'], detail: 'sin ningún bloqueo', exam: 'PASSWORD SPRAYING', action: { lead: 'contra eso: ', strong: 'MFA' } },
  // «Puntos y barras en una ruta, aunque vengan codificados, es traversal. Resuelve la ruta y mira dónde acaba…»
  { kind: 'folder', title: ['Puntos y barras', 'en una ruta'], detail: 'aunque vengan codificados', exam: 'DIRECTORY TRAVERSAL', action: { lead: 'resuelve y mira dónde acaba' } },
  // «Y respuestas que nunca pediste, reflejadas y amplificadas, se paran en el proveedor.»
  { kind: 'pipe', title: ['Respuestas que', 'nunca pediste'], detail: 'REFLECTED y AMPLIFIED', exam: 'DNS AMPLIFICATION', action: { lead: 'se paran en el proveedor' } },
];

/** The one next step (brief, exact) and the lesson it points to. */
export const NEXT = 'Ahora te toca: las preguntas de la lección';
export const LESSON = 'sp2m7 · 8 preguntas';

export const END = {
  title: { lead: 'Ataques en los ', accent: 'logs' },
  sub: 'spraying, traversal y amplificación DNS',
  objective: 'Security+ SY0-701 · objetivo 2.4',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
