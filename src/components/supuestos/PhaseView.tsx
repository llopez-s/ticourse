import { md } from '../../lib/md';
import type { DossierDoc, Supuesto } from '../../lib/supuesto';
import { gradeTask, resolvePhase, type SupuestoRun, type TaskAnswer } from '../../lib/supuestoGrade';
import { labButton } from '../labs/LabWorkspace';
import TaskFeedback from './TaskFeedback';
import TaskInput from './TaskInput';

/**
 * One phase of a supuesto. `reviewing` shows a submitted phase, locked, with its
 * correction (practice only); otherwise the phase is open for answers.
 */
export default function PhaseView({ s, run, index, docs, reviewing, onAnswer, onHint, onSubmit, onContinue }: {
  s: Supuesto;
  run: SupuestoRun;
  index: number;
  docs: DossierDoc[];
  reviewing: boolean;
  onAnswer: (taskId: string, value: TaskAnswer) => void;
  onHint: (taskId: string) => void;
  onSubmit: () => void;
  onContinue: () => void;
}) {
  const phase = s.phases[index];
  const last = index === s.phases.length - 1;
  const exam = run.mode === 'exam';
  const { context } = resolvePhase(phase, s, run);
  const carry = index > 0 ? s.phases[index - 1].carry : undefined;
  const docTitle = (id: string) => s.dossier.find((d) => d.id === id)?.title ?? id;

  return (
    <section aria-labelledby={'phase-' + phase.id} className="rounded-xl border border-ink-700 bg-ink-900 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
        Fase {index + 1} de {s.phases.length}{reviewing && ' · corrección'}
      </div>
      <h2 id={'phase-' + phase.id} className="mt-1 text-lg font-bold text-slate-50">{phase.title}</h2>

      {carry && !reviewing && (
        <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-950/20 p-3 text-sm text-amber-100">
          <span className="font-semibold">Viene de la fase anterior: </span>{md(carry)}
        </div>
      )}
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{md(context)}</p>

      <ol className="mt-5 space-y-6">
        {phase.tasks.map((t, ti) => {
          const answer = run.answers[t.id];
          const hintSeen = run.hints.includes(t.id);
          return (
            <li key={t.id} className="border-t border-ink-700 pt-4">
              <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                <span>Tarea {ti + 1}</span>
                <span>{t.points} {t.points === 1 ? 'punto' : 'puntos'}</span>
              </div>
              <TaskInput task={t} value={answer} onChange={(v) => onAnswer(t.id, v)} docs={docs} disabled={reviewing} />

              {!exam && t.hint && (hintSeen
                ? <p className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-2 text-sm text-cyan-100">💡 {md(t.hint.text)}</p>
                : !reviewing && (
                    <button type="button" className={labButton + ' mt-2 text-xs'} onClick={() => onHint(t.id)}>
                      💡 Ver pista (−{t.hint.cost} {t.hint.cost === 1 ? 'punto' : 'puntos'})
                    </button>
                  ))}

              {reviewing && (t.kind === 'written'
                ? <p role="status" className="mt-3 rounded-xl border border-ink-600 bg-ink-850 p-3 text-sm text-slate-300">
                    Esta respuesta la corregirás tú al final, en la autoevaluación, comparándola con la respuesta modelo.
                  </p>
                : <TaskFeedback task={t} answer={answer} outcome={gradeTask(t, answer)} docTitle={docTitle} />)}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 border-t border-ink-700 pt-4">
        {reviewing
          ? <button type="button" className={labButton + ' border-cyan-500 text-cyan-200'} onClick={onContinue}>
              {last ? 'Terminar y ver la nota →' : 'Siguiente fase →'}
            </button>
          : <>
              <button type="button" className={labButton + ' border-cyan-500 text-cyan-200'} onClick={onSubmit}>
                {last ? (exam ? 'Entregar el simulacro' : 'Entregar la última fase') : 'Entregar fase'}
              </button>
              <p className="mt-2 text-xs text-slate-400">
                {exam
                  ? 'Al entregar, las respuestas de esta fase quedan cerradas. No verás la corrección hasta el final.'
                  : 'Al entregar, las respuestas de esta fase quedan cerradas y verás la corrección.'}
              </p>
            </>}
      </div>
    </section>
  );
}
