import type { Block, Module } from '../../lib/types';

export interface LessonExpansion {
  minutes: number;
  objectives: string[];
  blocks: Block[];
}
export const p = (md: string): Block => ({ t: 'p', md });
export const h = (text: string): Block => ({ t: 'h', text });
export const list = (...items: string[]): Block => ({ t: 'list', items, ordered: true });
export const table = (headers: string[], rows: string[][]): Block => ({ t: 'table', headers, rows });
export const code = (title: string, text: string, lang = 'text'): Block => ({ t: 'code', title, text, lang });
export const links = (title: string, items: { label: string; href: string }[]): Block => ({ t: 'links', title, items });
export const check = (q: string, choices: string[], answer: number, explain: string, optional = true): Block =>
  ({ t: 'check', q: { q, choices, answer, explain, optional } });
/** A practical-series video on YouTube; its poster and transcript are public/videos/<slug>-poster.png and -transcript.txt. */
export const video = (title: string, youtube: string, slug: string): Block => ({
  t: 'video', title, youtube, poster: `videos/${slug}-poster.png`, transcript: `videos/${slug}-transcript.txt`,
});
export const complement = (title: string): Block => ({
  t: 'callout', kind: 'tip', title: `Ampliación práctica complementaria · ${title}`,
  md: 'Actividad profesional opcional. Los datos del caso son ficticios. Estos detalles no se presentan como objetivos oficiales de certificación. Sus checkpoints no bloquean la lección ni otorgan XP; no se añaden preguntas avanzadas a simulacros, bosses o pruebas de nivel.',
});

/** Append only: existing lesson IDs, quizzes and ?block= deep links stay stable. */
export function expandLesson(mod: Module, additions: Record<string, LessonExpansion>): Module {
  const extra = additions[mod.id];
  return extra ? {
    ...mod,
    minutes: mod.minutes + extra.minutes,
    objectives: [...mod.objectives, ...extra.objectives],
    blocks: [...mod.blocks, ...extra.blocks],
  } : mod;
}
