// Practical-case ("supuesto") downloadable Markdown report. Pure: no DOM, no store.
import type { Supuesto, Task } from './supuesto';
import { parseNumber, type SupuestoRun, type TaskAnswer, type Score } from './supuestoGrade';

const NONE = 'sin responder';

const num = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');
const grade = (n: number) => n.toFixed(1).replace('.', ',');

const asList = (a: TaskAnswer): string[] => (Array.isArray(a) ? a : typeof a === 'string' && a !== '' ? [a] : []);
const asRecord = (a: TaskAnswer): Record<string, string> =>
  a && typeof a === 'object' && !Array.isArray(a) ? a : {};

type Opt = { id: string; text: string };
const textOf = (opts: Opt[], id: string) => opts.find((o) => o.id === id)?.text ?? id;
const docTitle = (s: Supuesto, id: string) => s.dossier.find((d) => d.id === id)?.title ?? id;

/** Human-readable correct answer of a task. */
function correctText(t: Task, s: Supuesto): string {
  switch (t.kind) {
    case 'choice': return textOf(t.options, t.answer);
    case 'multi': return t.answer.map((id) => textOf(t.options, id)).join('; ');
    case 'numeric': return `${num(t.answer)}${t.unit ? ` ${t.unit}` : ''}`;
    case 'table': return t.rows.map((r) => `${r.label}: ${t.fields.map((f) => `${f.label} = ${r.answer[f.id]}`).join(', ')}`).join('; ');
    case 'order': return t.answer.map((id, i) => `${i + 1}. ${textOf(t.items, id)}`).join(' ');
    case 'match': return Object.entries(t.answer).map(([l, r]) => `${textOf(t.left, l)} → ${textOf(t.right, r)}`).join('; ');
    case 'cite': return t.answerSets.map((set) => set.map((d) => docTitle(s, d)).join(' + ')).join(' / ');
    case 'written': return t.model;
  }
}

/** Human-readable given answer, or null when nothing was answered. */
function givenText(t: Task, a: TaskAnswer, self: string[], s: Supuesto): string | null {
  switch (t.kind) {
    case 'choice': return typeof a === 'string' && a ? textOf(t.options, a) : null;
    case 'multi': { const l = asList(a); return l.length ? l.map((id) => textOf(t.options, id)).join('; ') : null; }
    case 'numeric': {
      if (a === undefined || a === '') return null;
      const v = typeof a === 'number' ? a : typeof a === 'string' ? parseNumber(a) : undefined;
      if (v !== undefined) return `${num(v)}${t.unit ? ` ${t.unit}` : ''}`;
      return String(a);
    }
    case 'table': {
      const r = asRecord(a);
      const parts: string[] = [];
      for (const row of t.rows) for (const f of t.fields) {
        const v = r[`${row.id}.${f.id}`];
        if (v !== undefined) parts.push(`${row.label} / ${f.label} = ${v}`);
      }
      return parts.length ? parts.join('; ') : null;
    }
    case 'order': { const l = asList(a); return l.length ? l.map((id, i) => `${i + 1}. ${textOf(t.items, id)}`).join(' ') : null; }
    case 'match': {
      const parts = Object.entries(asRecord(a)).map(([l, rr]) => `${textOf(t.left, l)} → ${textOf(t.right, rr)}`);
      return parts.length ? parts.join('; ') : null;
    }
    case 'cite': { const l = asList(a); return l.length ? l.map((d) => docTitle(s, d)).join('; ') : null; }
    case 'written': {
      const ticked = t.rubric.filter((r) => self.includes(r.id)).map((r) => r.text);
      const text = typeof a === 'string' ? a.trim().replace(/\s*\n\s*/g, ' ') : '';
      if (!text && ticked.length === 0) return null;
      return [text, ticked.length ? `(autoevaluación, criterios cumplidos: ${ticked.join('; ')})` : ''].filter(Boolean).join(' ');
    }
  }
}

export function buildReport(s: Supuesto, run: SupuestoRun, score: Score): string {
  const modeName = run.mode === 'exam' ? 'Simulacro' : 'Práctica';
  const out: string[] = [];
  out.push(`# ${s.title}`, '');
  out.push(`- Modo: ${modeName}`);
  out.push(`- Fecha: ${run.startedAt.slice(0, 10)}`);
  out.push(`- Nota: ${grade(score.grade)} / 10 (${score.passed ? 'aprobado' : 'suspenso'})`);
  out.push(`- Puntos: ${num(score.earned)} / ${num(score.max)}`);
  if (score.hintCost > 0) out.push(`- Penalización por pistas: ${num(score.hintCost)}`);
  out.push('');

  out.push('## Resultado por fase', '');
  for (const p of score.byPhase) out.push(`- ${p.title}: ${num(p.earned)} / ${num(p.max)}`);
  out.push('');

  s.phases.forEach((p, i) => {
    out.push(`## Fase ${i + 1}. ${p.title}`, '');
    for (const t of p.tasks) {
      const given = givenText(t, run.answers[t.id], run.self[t.id] ?? [], s);
      out.push(`### ${t.prompt}`, '');
      out.push(`- Tu respuesta: ${given ?? NONE}`);
      out.push(`- ${t.kind === 'written' ? 'Respuesta modelo' : 'Respuesta correcta'}: ${correctText(t, s)}`);
      if (t.explain) out.push(`- Explicación: ${t.explain}`);
      out.push('');
    }
  });

  out.push('## Para repasar', '');
  if (score.review.length === 0) out.push('Nada pendiente: todas las tareas con lección asociada salieron bien.');
  else for (const r of score.review) out.push(r.href ? `- ${r.label} (${r.href})` : `- ${r.label}`);
  out.push('');
  return out.join('\n');
}

export function reportFilename(s: Supuesto, run: SupuestoRun): string {
  return `supuesto-${s.id}-${run.mode === 'exam' ? 'simulacro' : 'practica'}-${run.startedAt.slice(0, 10)}.md`;
}
