import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageTitle } from '../components/Bits';
import { useTrack } from '../components/Layout';
import { searchCourse, type CourseSearchResult } from '../lib/courseSearch';

type Kind = CourseSearchResult['kind'];
const kinds: { id: Kind | 'all'; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'lesson', label: 'Lecciones' },
  { id: 'section', label: 'Secciones' },
  { id: 'lab', label: 'Labs' },
  { id: 'glossary', label: 'Glosario' },
];
const kindLabel: Record<Kind, string> = {
  lesson: 'Lección', section: 'Sección', lab: 'Lab', glossary: 'Glosario',
};
const kindIcon: Record<Kind, string> = {
  lesson: '📖', section: '🗂️', lab: '🧪', glossary: '🔤',
};

export default function SearchPage() {
  const track = useTrack();
  const [params, setParams] = useSearchParams();
  const [kind, setKind] = useState<Kind | 'all'>('all');
  const query = params.get('q') ?? '';
  const ready = query.trim().length >= 2;
  const results = useMemo(
    () => ready ? searchCourse(track, query) : [],
    [track, query, ready],
  );
  const visible = kind === 'all' ? results : results.filter((result) => result.kind === kind);

  const updateQuery = (value: string) => {
    setParams(value ? { q: value } : {}, { replace: true });
  };

  return (
    <div>
      <PageTitle
        kicker={`Buscar en ${track.name}`}
        title="Buscar en el curso"
        sub="Encuentra conceptos en lecciones, secciones, laboratorios y glosario."
      />

      <div className="rounded-2xl border border-cyan-500/30 bg-ink-900 p-4 shadow-[0_0_36px_rgba(34,211,238,0.06)] sm:p-5">
        <label htmlFor="course-search" className="mb-2 block text-xs font-bold uppercase tracking-wider text-cyan-300">
          Palabra clave
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-ink-600 bg-ink-950 px-4 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20">
          <span aria-hidden="true" className="text-lg text-cyan-400">⌕</span>
          <input
            id="course-search"
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Ej. phishing, SIEM, análisis…"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => updateQuery('')} className="text-xs font-semibold text-slate-400 hover:text-slate-100">
              Borrar
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">Busca varias palabras a la vez; se ignoran las tildes y mayúsculas.</p>
      </div>

      {!ready ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink-600 px-5 py-8 text-center text-sm text-slate-400">
          Escribe al menos dos caracteres para buscar en {track.name}.
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Filtrar resultados">
            {kinds.map((option) => {
              const count = option.id === 'all' ? results.length : results.filter((item) => item.kind === option.id).length;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setKind(option.id)}
                  aria-pressed={kind === option.id}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${kind === option.id ? 'bg-cyan-500 text-ink-950' : 'border border-ink-600 bg-ink-900 text-slate-300 hover:border-cyan-500/50 hover:text-slate-100'}`}
                >
                  {option.label} <span className="ml-1 font-mono opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
          <p className="my-4 text-xs text-slate-500" role="status">
            {visible.length} {visible.length === 1 ? 'resultado' : 'resultados'} para «{query.trim()}»
          </p>

          {visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-600 px-5 py-8 text-center text-sm text-slate-400">
              No hay coincidencias. Prueba con otro término o cambia el filtro.
            </div>
          ) : (
            <div className="space-y-2">
              {visible.map((result) => (
                <Link
                  key={`${result.kind}-${result.key}`}
                  to={result.to}
                  className="group block rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 transition-colors hover:border-cyan-500/50 hover:bg-ink-850 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:px-5"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    <span className="text-cyan-400">{kindIcon[result.kind]} {kindLabel[result.kind]}</span>
                    <span>·</span>
                    <span>{result.section}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">{result.title}</h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{result.excerpt}</p>
                    </div>
                    <span aria-hidden="true" className="text-cyan-400 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
