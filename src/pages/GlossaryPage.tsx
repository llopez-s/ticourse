import { useMemo, useState } from 'react';
import { contentSections, sectionById } from '../data/course';
import { PageTitle } from '../components/Bits';
import { useTrack } from '../components/Layout';

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const track = useTrack();

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return track.glossary.filter(
      (e) =>
        (!filter || e.sectionId === filter) &&
        (!q ||
          e.term.toLowerCase().includes(q) ||
          e.def.toLowerCase().includes(q)),
    ).sort((a, b) => a.term.localeCompare(b.term));
  }, [query, filter, track]);

  return (
    <div className="print-area">
      <div className="no-print">
        <PageTitle
          kicker="Índice open-book"
          title="📖 Glosario · Índice"
          sub={
            track.id === 'gcti'
              ? 'Términos en inglés (como el examen) con definición breve. Es tu semilla de índice GIAC: imprímelo y complétalo con referencias a tus materiales.'
              : 'Términos en inglés (como el examen) con definición breve. El Security+ es closed-book: usa esta lista como chequeo rápido de vocabulario antes de cada simulacro.'
          }
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar término…"
            className="w-56 rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => setFilter(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${!filter ? 'bg-cyan-500 text-ink-950' : 'bg-ink-800 text-slate-400 hover:bg-ink-700'}`}
          >
            Todas
          </button>
          {contentSections(track.id).map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(filter === s.id ? null : s.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === s.id ? 'bg-cyan-500 text-ink-950' : 'bg-ink-800 text-slate-400 hover:bg-ink-700'}`}
            >
              S{s.num}
            </button>
          ))}
          <button
            onClick={() => window.print()}
            className="ml-auto rounded-lg border border-emerald-500/50 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-950/40"
          >
            🖨️ Imprimir índice
          </button>
        </div>
        <div className="mb-4 text-xs text-slate-500">
          {entries.length} términos
        </div>
      </div>

      {/* print header */}
      <div className="mb-4 hidden print:block">
        <h1 className="text-xl font-bold">
          Índice — IntelForge Academy · {track.name} (material no oficial)
        </h1>
      </div>

      <div className="space-y-2">
        {entries.map((e) => {
          const sec = sectionById(e.sectionId);
          return (
            <div
              key={e.term}
              className="rounded-lg border border-ink-700 bg-ink-900 px-4 py-2.5 print:break-inside-avoid print:rounded-none print:border-x-0 print:border-t-0 print:px-0"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-cyan-300 print:text-black">
                  {e.term}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-slate-500">
                  S{sec?.num}
                </span>
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-300">
                {e.def}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
