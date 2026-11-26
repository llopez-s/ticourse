import { Link } from 'react-router-dom';
import { md } from '../../lib/md';
import type { Ref, Task } from '../../lib/supuesto';
import type { TaskAnswer, TaskOutcome } from '../../lib/supuestoGrade';

function RefLink({ r }: { r: Ref }) {
  const cls = 'text-cyan-300 underline hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-400';
  if (!r.href) return <span>{r.label}</span>;
  if (r.href.startsWith('/')) return <Link to={r.href} className={cls}>{r.label}</Link>;
  return <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>{r.label}</a>;
}

const txt = (list: { id: string; text: string }[], id: string) => list.find((x) => x.id === id)?.text ?? id;

/** Plain-text rendering of the right answer, per task kind. */
export function correctAnswerText(task: Task, docTitle: (id: string) => string = (i) => i): string[] {
  switch (task.kind) {
    case 'choice': return [txt(task.options, task.answer)];
    case 'multi': return task.answer.map((id) => txt(task.options, id));
    case 'numeric': return [task.answer + (task.unit ? ' ' + task.unit : '') + (task.tolerance ? ' (± ' + task.tolerance + ')' : '')];
    case 'table': return task.rows.map((r) => r.label + ': ' + task.fields.map((f) => f.label + ' = ' + r.answer[f.id]).join(', '));
    case 'order': return task.answer.map((id, i) => (i + 1) + '. ' + txt(task.items, id));
    case 'match': return Object.entries(task.answer).map(([l, r]) => txt(task.left, l) + ' → ' + txt(task.right, r));
    case 'cite': return task.answerSets.map((set) => set.map(docTitle).join(' + '));
    case 'written': return [task.model];
  }
}

export default function TaskFeedback({ task, outcome, docTitle }: {
  task: Task;
  answer: TaskAnswer;
  outcome: TaskOutcome;
  /** Optional id -> title lookup so `cite` answers show document titles. */
  docTitle?: (id: string) => string;
}) {
  const ok = outcome.correct;
  const partial = !ok && outcome.earned > 0;
  const lines = correctAnswerText(task, docTitle);
  const tone = ok ? 'border-emerald-500/40 bg-emerald-950/20' : partial ? 'border-amber-500/40 bg-amber-950/20' : 'border-rose-500/40 bg-rose-950/20';
  return (
    <div role="status" className={'mt-3 rounded-xl border p-4 text-sm ' + tone}>
      <div className="font-bold text-slate-100">
        {ok ? '✅ Correcto' : partial ? '🟡 Parcialmente correcto' : '❌ Incorrecto'}
        <span className="ml-2 font-normal text-slate-400">{outcome.earned} / {outcome.max} puntos</span>
      </div>
      {!ok && (
        <div className="mt-2">
          <div className="text-xs font-semibold uppercase text-slate-400">{task.kind === 'written' ? 'Respuesta modelo' : 'Respuesta correcta'}</div>
          {task.kind === 'written'
            ? <p className="whitespace-pre-line text-slate-200">{md(lines[0])}</p>
            : lines.length === 1
              ? <p className="text-slate-200">{lines[0]}</p>
              : <ul className="list-disc pl-5 text-slate-200">{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>}
        </div>
      )}
      <p className="mt-2 whitespace-pre-line text-slate-300">{md(task.explain)}</p>
      {task.refs.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          Para repasar:{' '}
          {task.refs.map((r, i) => (
            <span key={i}>{i > 0 && ' · '}<RefLink r={r} /></span>
          ))}
        </p>
      )}
    </div>
  );
}
