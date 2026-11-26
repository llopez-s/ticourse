import { md } from '../../lib/md';
import type { Supuesto, Task } from '../../lib/supuesto';
import type { SupuestoRun } from '../../lib/supuestoGrade';
import { labButton } from '../labs/LabWorkspace';

type Written = Extract<Task, { kind: 'written' }>;

export default function SelfAssessment({ s, run, onToggle, onDone }: {
  s: Supuesto;
  run: SupuestoRun;
  onToggle: (taskId: string, criterionId: string) => void;
  onDone: () => void;
}) {
  const written = s.phases.flatMap((p) => p.tasks).filter((t): t is Written => t.kind === 'written');
  return (
    <section aria-labelledby="self-title" className="rounded-xl border border-cyan-500/30 bg-ink-900 p-5">
      <h2 id="self-title" className="text-lg font-bold text-slate-50">Autoevaluación</h2>
      <p className="mt-1 text-sm text-slate-400">
        Las respuestas redactadas no se corrigen solas. Compara la tuya con la respuesta modelo y marca, con honestidad,
        los criterios que cumple. Cada criterio suma sus puntos a la nota.
      </p>
      <div className="mt-5 space-y-6">
        {written.map((t) => {
          const own = typeof run.answers[t.id] === 'string' ? (run.answers[t.id] as string).trim() : '';
          const ticked = run.self[t.id] ?? [];
          return (
            <article key={t.id} className="border-t border-ink-700 pt-4">
              <h3 className="text-sm font-semibold text-slate-100">{md(t.prompt)}</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-ink-700 bg-ink-950 p-3">
                  <div className="text-xs font-semibold uppercase text-slate-400">Tu respuesta</div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">{own || <span className="italic text-slate-500">Sin responder</span>}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/10 p-3">
                  <div className="text-xs font-semibold uppercase text-emerald-300">Respuesta modelo</div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-200">{md(t.model)}</p>
                </div>
              </div>
              <fieldset className="mt-3">
                <legend className="mb-2 text-xs font-semibold uppercase text-slate-400">Criterios que cumple tu respuesta</legend>
                <div className="space-y-2">
                  {t.rubric.map((r) => (
                    <label key={r.id} className="flex cursor-pointer items-start gap-2 rounded-lg border border-ink-600 bg-ink-850 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400 has-[:checked]:border-cyan-400 has-[:checked]:bg-cyan-950/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan-400">
                      <input type="checkbox" checked={ticked.includes(r.id)} onChange={() => onToggle(t.id, r.id)} className="mt-0.5 accent-cyan-400" />
                      <span className="flex-1">{r.text}</span>
                      <span className="text-xs text-slate-400">{r.points} {r.points === 1 ? 'punto' : 'puntos'}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </article>
          );
        })}
      </div>
      <button type="button" className={labButton + ' mt-6 border-cyan-500 text-cyan-200'} onClick={onDone}>
        Terminar la autoevaluación y ver la nota
      </button>
    </section>
  );
}
