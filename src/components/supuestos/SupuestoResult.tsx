import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { moduleById, sectionById } from '../../data/course';
import { downloadLabFile } from '../../lib/labWorkspace';
import { useStore } from '../../lib/store';
import type { Supuesto, SupuestoMeta } from '../../lib/supuesto';
import { PASS_GRADE, scoreRun, type SupuestoRun } from '../../lib/supuestoGrade';
import { buildReport, reportFilename } from '../../lib/supuestoReport';
import { labButton } from '../labs/LabWorkspace';

const grade = (n: number) => n.toFixed(1).replace('.', ',');
const pts = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');
const topicLabel = (id: string) => moduleById(id)?.title ?? sectionById(id)?.title ?? id;

function Bar({ earned, max }: { earned: number; max: number }) {
  const pct = max > 0 ? Math.round((Math.max(0, earned) / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-ink-700" aria-hidden="true">
      <div className="h-1.5 rounded-full bg-cyan-400" style={{ width: pct + '%' }} />
    </div>
  );
}

export default function SupuestoResult({ s, meta, run, onRecorded, onRepeat }: {
  s: Supuesto;
  meta: SupuestoMeta;
  run: SupuestoRun;
  /** Marks the run as sent to the store. */
  onRecorded: () => void;
  onRepeat: () => void;
}) {
  const finishSupuesto = useStore((st) => st.finishSupuesto);
  const score = scoreRun(s, run);
  const [granted, setGranted] = useState<number | null>(null);
  // StrictMode runs effects twice in development: the ref keeps it to one store write.
  const sent = useRef(false);

  useEffect(() => {
    if (run.recorded || sent.current) return;
    sent.current = true;
    setGranted(finishSupuesto(meta, run.mode, { grade: score.grade, auto: score.autoGrade }));
    onRecorded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run.recorded]);

  const modeName = run.mode === 'exam' ? 'Simulacro' : 'Práctica';
  const hasWritten = score.autoMax < score.max;

  return (
    <section aria-labelledby="result-title" className="print-area supuesto-report rounded-xl border border-cyan-500/30 bg-ink-900 p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">{modeName} · resultado</div>
      <h2 id="result-title" className="mt-1 text-xl font-bold text-slate-50">{s.title}</h2>

      <div className="mt-4 flex flex-wrap items-end gap-6">
        <div>
          <div className="text-xs text-slate-400">Nota</div>
          <div className={'text-4xl font-bold ' + (score.passed ? 'text-emerald-300' : 'text-rose-300')}>
            {grade(score.grade)} <span className="text-base font-normal text-slate-400">/ 10</span>
          </div>
        </div>
        <div className={'rounded-full px-3 py-1 text-sm font-bold ' + (score.passed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300')}>
          {score.passed ? 'Aprobado' : 'Suspenso'}
        </div>
        {hasWritten && (
          <div className="text-sm text-slate-400">
            Nota automática (sin lo redactado): <strong className="text-slate-200">{grade(score.autoGrade)}</strong>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {pts(score.earned)} de {pts(score.max)} puntos · se aprueba con {PASS_GRADE}
        {score.hintCost > 0 && ` · pistas: −${pts(score.hintCost)} puntos`}
      </p>

      {granted !== null && granted > 0 && (
        <p role="status" className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3 text-sm text-emerald-200">
          🛠️ Has ganado {granted} XP práctico por aprobar este supuesto en modo {modeName.toLowerCase()}.
        </p>
      )}
      {granted === 0 && score.passed && (
        <p role="status" className="mt-3 text-xs text-slate-400">Ya tenías el XP práctico de este modo; la nota queda guardada si mejora tu marca.</p>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section>
          <h3 className="text-sm font-semibold text-slate-100">Por fase</h3>
          <ul className="mt-2 space-y-2">
            {score.byPhase.map((p, i) => (
              <li key={p.id} className="text-sm">
                <div className="flex justify-between gap-2 text-slate-300">
                  <span>{i + 1}. {p.title}</span>
                  <span className="text-slate-400">{pts(p.earned)} / {pts(p.max)}</span>
                </div>
                <Bar earned={p.earned} max={p.max} />
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-sm font-semibold text-slate-100">Por tema</h3>
          <ul className="mt-2 space-y-2">
            {score.byTopic.map((t) => (
              <li key={t.topic} className="text-sm">
                <div className="flex justify-between gap-2 text-slate-300">
                  <span>{topicLabel(t.topic)}</span>
                  <span className="text-slate-400">{pts(t.earned)} / {pts(t.max)}</span>
                </div>
                <Bar earned={t.earned} max={t.max} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-slate-100">Para repasar</h3>
        {score.review.length === 0
          ? <p className="mt-1 text-sm text-slate-400">Nada pendiente: todas las tareas con lección asociada salieron bien.</p>
          : <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              {score.review.map((r) => (
                <li key={r.href}><Link to={r.href!} className="text-cyan-300 underline hover:text-cyan-200">{r.label}</Link></li>
              ))}
            </ul>}
      </section>

      <div className="no-print mt-6 flex flex-wrap gap-2 border-t border-ink-700 pt-4">
        <button type="button" className={labButton} onClick={() => window.print()}>Imprimir</button>
        <button
          type="button"
          className={labButton}
          onClick={() => downloadLabFile(reportFilename(s, run), buildReport(s, run, score), 'text/markdown;charset=utf-8')}
        >
          Descargar informe
        </button>
        <button type="button" className={labButton} onClick={onRepeat}>Repetir</button>
      </div>
    </section>
  );
}
