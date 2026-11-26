import { useEffect, useState } from 'react';
import type { Supuesto, SupuestoMeta, SupuestoMode } from '../../lib/supuesto';
import { expireRun, formatClock, isExpired, remainingMs } from '../../lib/supuestoClock';
import { applyHint, needsSelfAssessment, newDocIds, submitPhase } from '../../lib/supuestoFlow';
import { freshRun, visibleDocs, type SupuestoRun, type TaskAnswer } from '../../lib/supuestoGrade';
import { labButton, useLabSession, useLabState, useLabWorkspace } from '../labs/LabWorkspace';
import Dossier from './Dossier';
import PhaseView from './PhaseView';
import SelfAssessment from './SelfAssessment';
import SupuestoResult from './SupuestoResult';

const MIN = 60_000;

function ExamClock({ ms }: { ms: number }) {
  const warning = ms <= MIN ? 'Queda menos de un minuto. Lo que no entregues se corregirá tal cual esté.'
    : ms <= 10 * MIN ? 'Quedan menos de diez minutos.'
    : '';
  return (
    <div className="no-print sticky top-24 z-10 mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink-700 bg-ink-950/95 px-4 py-2 backdrop-blur md:top-16">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Simulacro · tiempo restante</span>
      <span className={'font-mono text-xl font-bold ' + (ms <= MIN ? 'text-rose-300' : ms <= 10 * MIN ? 'text-amber-300' : 'text-slate-100')}>
        <span className="sr-only">Tiempo restante: </span>{formatClock(ms)}
      </span>
      {/* Only the threshold message is announced, never the ticking clock. */}
      <p aria-live="assertive" className="w-full text-xs text-amber-200">{warning}</p>
    </div>
  );
}

export default function SupuestoRunner({ s, meta, mode }: { s: Supuesto; meta: SupuestoMeta; mode: SupuestoMode }) {
  const session = useLabSession();
  const { saveFailed } = useLabWorkspace();
  const [run, setRun] = useLabState<SupuestoRun | null>('run', null);
  // A run found on mount that is still open asks «Continuar» or «Empezar de nuevo».
  const [resumeAsked, setResumeAsked] = useState(() => !!run && run.finishedAt === undefined);
  // Practice only: index of a submitted phase whose correction is on screen.
  const [reviewing, setReviewing] = useState<number | null>(null);
  const [tab, setTab] = useState<'dossier' | 'phase'>('phase');
  const [now, setNow] = useState(() => Date.now());
  // Focus moves to the phase heading only after the learner has navigated, not on first mount.
  const [moved, setMoved] = useState(false);

  const ticking = !!run && run.mode === 'exam' && run.finishedAt === undefined;
  useEffect(() => {
    if (!ticking) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [ticking]);

  // On mount and on every tick: a simulacro past its deadline closes itself.
  useEffect(() => {
    if (run && isExpired(run, s.minutes, now)) {
      setRun((r) => (r && isExpired(r, s.minutes, Date.now()) ? expireRun(s, r, new Date()) : r));
      setReviewing(null);
    }
  }, [run, now, s, setRun]);

  const start = () => {
    session.restart();
    setRun(freshRun(mode, new Date()));
    setNow(Date.now());
    setReviewing(null);
    setResumeAsked(false);
  };

  if (!run || (resumeAsked && run.finishedAt === undefined)) {
    return (
      <section className="rounded-xl border border-ink-700 bg-ink-900 p-5">
        {run ? <>
          <h2 className="font-semibold text-slate-100">Tienes este supuesto a medias</h2>
          <p className="mt-1 text-sm text-slate-400">
            Vas por la fase {run.phaseIndex + 1} de {s.phases.length}.
            {run.mode === 'exam' && ' El reloj del simulacro ha seguido corriendo mientras estabas fuera.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className={labButton + ' border-cyan-500 text-cyan-200'} onClick={() => setResumeAsked(false)}>Continuar</button>
            <button type="button" className={labButton} onClick={start}>Empezar de nuevo</button>
          </div>
        </> : <>
          <h2 className="font-semibold text-slate-100">{mode === 'exam' ? 'Simulacro' : 'Práctica'}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {mode === 'exam'
              ? `Tendrás ${s.minutes} minutos desde que pulses «Empezar», sin pistas ni corrección hasta el final. Si se acaba el tiempo, se entrega lo que tengas.`
              : 'Sin reloj. Al entregar cada fase verás la corrección, y puedes pedir pistas a cambio de algunos puntos.'}
          </p>
          <button type="button" className={labButton + ' mt-4 border-cyan-500 text-cyan-200'} onClick={start}>Empezar</button>
        </>}
      </section>
    );
  }

  const update = (fn: (r: SupuestoRun) => SupuestoRun) => setRun((r) => (r ? fn(r) : r));
  const onAnswer = (taskId: string, value: TaskAnswer) =>
    update((r) => (r.submitted.includes(s.phases[r.phaseIndex].id) ? r : { ...r, answers: { ...r.answers, [taskId]: value } }));
  const onSubmit = () => {
    const index = run.phaseIndex;
    update((r) => submitPhase(s, r));
    if (run.mode === 'practice') setReviewing(index);
    setTab('phase');
    setMoved(true);
    window.scrollTo(0, 0);
  };
  const repeat = () => { session.restart(); setReviewing(null); };

  const finished = run.finishedAt !== undefined;
  const clock = ticking ? <ExamClock ms={remainingMs(run.startedAt, s.minutes, now)} /> : null;

  if (finished && reviewing === null) {
    return needsSelfAssessment(s, run)
      ? <SelfAssessment
          s={s}
          run={run}
          onToggle={(taskId, cid) => update((r) => {
            const cur = r.self[taskId] ?? [];
            return { ...r, self: { ...r.self, [taskId]: cur.includes(cid) ? cur.filter((x) => x !== cid) : [...cur, cid] } };
          })}
          onDone={() => { update((r) => ({ ...r, selfDone: true })); window.scrollTo(0, 0); }}
        />
      : <SupuestoResult s={s} meta={meta} run={run} onRecorded={() => update((r) => ({ ...r, recorded: true }))} onRepeat={repeat} />;
  }

  const saveWarning = saveFailed ? (
    <p role="alert" className="no-print mb-4 rounded-xl border border-amber-500/40 bg-amber-950/20 px-4 py-2 text-sm text-amber-200">
      No se está guardando tu progreso en este dispositivo. No cierres ni recargues la pestaña, y descarga el informe antes de salir.
    </p>
  ) : null;
  const docs = visibleDocs(s, run);
  const fresh = reviewing === null ? newDocIds(s, run) : [];
  const tabBtn = (id: 'dossier' | 'phase', label: string) => (
    <button type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
      className={labButton + ' flex-1 ' + (tab === id ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200' : '')}>
      {label}
    </button>
  );

  return (
    <div>
      {saveWarning}
      {clock}
      <div role="tablist" aria-label="Vista del supuesto" className="mb-3 flex gap-2 md:hidden">
        {tabBtn('dossier', 'Expediente' + (fresh.length ? ` (${fresh.length} nuevo${fresh.length === 1 ? '' : 's'})` : ''))}
        {tabBtn('phase', 'Fase')}
      </div>
      <div className="md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-4">
        <div className={(tab === 'dossier' ? '' : 'hidden ') + 'md:block'}>
          <Dossier docs={docs} newIds={fresh} />
        </div>
        <div className={(tab === 'phase' ? '' : 'hidden ') + 'md:block'}>
          <PhaseView
            key={(reviewing ?? run.phaseIndex) + (reviewing === null ? '' : '-review')}
            s={s}
            run={run}
            index={reviewing ?? run.phaseIndex}
            docs={docs}
            reviewing={reviewing !== null}
            focusHeading={moved}
            onAnswer={onAnswer}
            onHint={(taskId) => update((r) => applyHint(r, taskId))}
            onSubmit={onSubmit}
            onContinue={() => { setReviewing(null); setMoved(true); window.scrollTo(0, 0); }}
          />
        </div>
      </div>
    </div>
  );
}
