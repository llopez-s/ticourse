import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { moduleById, sectionById, supuestoMetaById } from '../data/course';
import { loadSupuesto } from '../data/supuestos';
import { useSyncTrack } from '../components/Layout';
import { labButton, LabWorkspaceProvider } from '../components/labs/LabWorkspace';
import SupuestoRunner from '../components/supuestos/SupuestoRunner';
import { useStore } from '../lib/store';
import type { Supuesto, SupuestoMode } from '../lib/supuesto';
import { workspaceIdentity } from '../lib/supuestoFlow';
import { supuestoXp } from '../lib/xp';

type Load = { state: 'loading' } | { state: 'missing' } | { state: 'failed' } | { state: 'ok'; s: Supuesto };

const MODES: { id: SupuestoMode; label: string; sub: string }[] = [
  { id: 'practice', label: 'Práctica', sub: 'sin reloj, con corrección por fase y pistas' },
  { id: 'exam', label: 'Simulacro', sub: 'con reloj, sin pistas ni corrección hasta el final' },
];

const grade = (n: number) => n.toFixed(1).replace('.', ',');

export default function SupuestoPage() {
  const { id = '' } = useParams();
  const [search, setSearch] = useSearchParams();
  const meta = supuestoMetaById(id);
  const best = useStore((st) => st.supuestos[id]);
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  useSyncTrack(meta?.sectionIds[0]);

  useEffect(() => {
    let alive = true;
    setLoad({ state: 'loading' });
    loadSupuesto(id)
      .then((s) => { if (alive) setLoad(s ? { state: 'ok', s } : { state: 'missing' }); })
      .catch(() => { if (alive) setLoad({ state: 'failed' }); });
    return () => { alive = false; };
  }, [id]);

  if (!meta) return <p className="text-slate-400">Supuesto no encontrado.</p>;

  if (load.state === 'ok' && load.s.id !== id) return <p role="status" className="text-slate-400">Abriendo el expediente…</p>;

  const raw = search.get('mode');
  const mode: SupuestoMode | null = raw === 'practice' || raw === 'exam' ? raw : null;
  const setMode = (m: SupuestoMode) => setSearch((prev) => { const next = new URLSearchParams(prev); next.set('mode', m); return next; });
  const section = sectionById(meta.sectionIds[0]);

  return (
    <div>
      <div className="no-print mb-6">
        <Link to={`/section/${meta.sectionIds[0]}`} className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400 hover:text-cyan-300">
          ← {section ? `S${section.num} · ${section.short}` : 'Volver'}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-50">🗂️ {meta.title}</h1>
        <div className="mt-1 text-xs text-slate-500">
          Supuesto práctico{meta.integrator && ' integrador'} · {meta.minutes} min ·
          +{supuestoXp(meta, 'practice')} XP práctico al aprobar la práctica, +{supuestoXp(meta, 'exam')} el simulacro
        </div>
        {(best?.practice || best?.exam) && (
          <div className="mt-1 text-xs font-semibold text-emerald-400">
            Mejores notas:
            {best.practice && ` práctica ${grade(best.practice.grade)}`}
            {best.practice && best.exam && ' ·'}
            {best.exam && ` simulacro ${grade(best.exam.grade)}`}
          </div>
        )}
      </div>

      <p className="no-print mb-5 text-sm leading-relaxed text-slate-400">{meta.brief}</p>

      {load.state === 'loading' && <p role="status" className="text-slate-400">Abriendo el expediente…</p>}
      {load.state === 'missing' && <p className="text-slate-400">Este supuesto todavía no tiene contenido.</p>}
      {load.state === 'failed' && (
        <div role="alert" className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-sm text-amber-100">
          <p className="mb-3">No se pudo cargar el supuesto. Puede que haya una versión nueva de la web o que se haya cortado la conexión.</p>
          <button className={labButton} onClick={() => window.location.reload()}>Recargar la página</button>
        </div>
      )}

      {load.state === 'ok' && <>
        {load.s.prerequisites.length > 0 && (
          <section aria-label="Repaso previo" className="no-print mb-5 rounded-xl border border-ink-700 bg-ink-900 p-4">
            <h2 className="text-sm font-semibold text-slate-100">Antes de empezar, repasa</h2>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {load.s.prerequisites.map((m) => (
                <li key={m}><Link className="text-cyan-300 underline underline-offset-4" to={`/learn/${m}`}>{moduleById(m)?.title ?? m}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <div role="group" aria-label="Modo" className="no-print mb-5 grid gap-2 sm:grid-cols-2">
          {MODES.map((m) => (
            <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => setMode(m.id)} className={labButton + ' text-left'}>
              <span className="block">{m.label}</span>
              <span className="block text-xs font-normal text-slate-400">{m.sub}</span>
            </button>
          ))}
        </div>

        {mode
          ? <LabWorkspaceProvider key={workspaceIdentity(meta, mode)} identity={workspaceIdentity(meta, mode)}>
              <SupuestoRunner s={load.s} meta={meta} mode={mode} />
            </LabWorkspaceProvider>
          : <p className="text-sm text-slate-400">Elige un modo para empezar. Cada modo guarda su propio cuaderno en este dispositivo.</p>}
      </>}
    </div>
  );
}
