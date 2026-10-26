import { createContext, useCallback, useContext, useRef, useState, useSyncExternalStore } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { createLabSession, downloadLabFile, encodeWorkspace } from '../../lib/labWorkspace';
import type { LabSession } from '../../lib/labWorkspace';

const Context = createContext<LabSession | null>(null);

export function LabWorkspaceProvider({ identity, children }: { identity: string; children: ReactNode }) {
  const [session] = useState(() => createLabSession(identity));
  return <Context.Provider value={session}>{children}</Context.Provider>;
}

export function useLabSession() {
  const session = useContext(Context);
  if (!session) throw new Error('LabWorkspaceProvider missing');
  return session;
}

export function useLabWorkspace() {
  const session = useLabSession();
  return useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
}

export function useLabState<T>(key: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const session = useLabSession();
  const snapshot = useLabWorkspace();
  const fallback = useRef<{ value: T } | null>(null);
  if (!fallback.current) fallback.current = { value: typeof initial === 'function' ? (initial as () => T)() : initial };
  const value = (Object.hasOwn(snapshot.current.draft, key) ? snapshot.current.draft[key] : fallback.current.value) as T;
  const setValue = useCallback<Dispatch<SetStateAction<T>>>((update) => {
    const draft = session.getSnapshot().current.draft;
    const previous = (Object.hasOwn(draft, key) ? draft[key] : fallback.current!.value) as T;
    session.setDraft(key, typeof update === 'function' ? (update as (old: T) => T)(previous) : update);
  }, [key, session]);
  return [value, setValue];
}

export const labInput = 'w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-slate-100 focus-visible:outline-2 focus-visible:outline-cyan-400';
export const labButton = 'rounded-lg border border-ink-600 bg-ink-850 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-cyan-400 focus-visible:outline-2 focus-visible:outline-cyan-400 aria-pressed:border-cyan-400 aria-pressed:bg-cyan-950/40 aria-pressed:text-cyan-200 disabled:opacity-40';

export function LabWorkbookBar() {
  const session = useLabSession();
  const workspace = useLabWorkspace();
  const [confirm, setConfirm] = useState(false);
  return <div className="mb-5 rounded-xl border border-ink-700 bg-ink-900 p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p role="status" className={`text-xs ${workspace.saveFailed ? 'text-amber-300' : 'text-slate-400'}`}>
        {workspace.saveFailed ? 'No se pudo guardar. Exporta tu trabajo antes de salir.' : 'Autoguardado en este dispositivo · puedes salir y reanudar.'}
        <span className="mt-1 block">Borradores e historial no se sincronizan. Se conservan hasta 10 intentos anteriores.</span>
      </p>
      <div className="flex flex-wrap gap-2">
        <button className={labButton} onClick={() => downloadLabFile(
          `${workspace.identity.replaceAll(/[^a-z0-9-]/gi, '-')}.json`, encodeWorkspace(workspace))}>Exportar trabajo</button>
        <button className={labButton} onClick={() => setConfirm(true)}>Nuevo intento</button>
      </div>
    </div>
    {confirm && <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-ink-700 pt-3 text-sm">
      <span>El intento actual quedará en el historial local.</span>
      <button className={labButton} onClick={() => { session.restart(); setConfirm(false); }}>Empezar de nuevo</button>
      <button className={labButton} onClick={() => setConfirm(false)}>Seguir trabajando</button>
    </div>}
    {workspace.history.length > 0 && <details className="mt-3 text-xs text-slate-400">
      <summary className="cursor-pointer">Historial local ({workspace.history.length})</summary>
      <ul className="mt-2 space-y-2">{workspace.history.map((run, i) => <li key={`${run.startedAt}-${i}`}>
        {new Date(run.startedAt).toLocaleString('es-ES')} · {Object.keys(run.results).length} pasos evaluados
        <button className="ml-3 text-cyan-300 underline" onClick={() => downloadLabFile(`intento-${i + 1}.json`, encodeWorkspace(run))}>Descargar intento</button>
      </li>)}</ul>
    </details>}
  </div>;
}

export function LabResultSummary({ reviewLinks }: { reviewLinks: { id: string; title: string }[] }) {
  const { current } = useLabWorkspace();
  const results = Object.values(current.results);
  if (!results.length) return null;
  return <section aria-label="Resumen de práctica" className="mt-6 rounded-xl border border-cyan-500/30 bg-ink-900 p-5">
    <h2 className="font-semibold text-slate-100">Tu práctica, paso a paso</h2>
    <p className="mt-1 text-xs text-slate-400">El primer resultado se conserva aunque corrijas. Las puntuaciones pertenecen a cada ejercicio.</p>
    <ul className="mt-4 space-y-4">{results.map(({ first, latest, submissions }) => <li key={first.step}>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <strong className="text-slate-200">{first.title}</strong>
        <span className="text-cyan-300">{latest.passed ? latest.assisted ? 'Corregido con ayuda' : 'Resuelto sin ayuda' : 'Por repasar'}</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">Primer resultado: {first.correct !== undefined ? `${first.correct}/${first.total}` : first.passed ? 'objetivo cumplido' : 'objetivo pendiente'}
        {' · '}{submissions} {submissions === 1 ? 'validación' : 'validaciones'}
        {latest.correct !== undefined && ` · Último: ${latest.correct}/${latest.total}`}</p>
      {latest.mistakes.length > 0 && <ul className="mt-1 list-inside list-disc text-xs text-amber-200">{latest.mistakes.map((m, i) => <li key={i}>{m}</li>)}</ul>}
    </li>)}</ul>
    {reviewLinks.length > 0 && <p className="mt-4 border-t border-ink-700 pt-3 text-xs text-slate-400">Repaso recomendado: {reviewLinks.map((link, i) => <span key={link.id}>
      {i > 0 && ' · '}<Link className="text-cyan-300 underline" to={`/learn/${link.id}`}>{link.title}</Link>
    </span>)}</p>}
  </section>;
}
