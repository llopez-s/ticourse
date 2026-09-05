import { useState } from 'react';
import { ACH, type AchRating } from '../../data/labs';

const RATINGS: { v: AchRating; label: string; cls: string }[] = [
  { v: 'C', label: 'C', cls: 'data-on:bg-emerald-500 data-on:text-ink-950' },
  { v: 'N', label: 'N', cls: 'data-on:bg-slate-400 data-on:text-ink-950' },
  { v: 'I', label: 'I', cls: 'data-on:bg-rose-500 data-on:text-ink-950' },
];

export default function AchLab({ onComplete }: { onComplete: () => void }) {
  const [ratings, setRatings] = useState<Record<string, Record<string, AchRating>>>({});
  const [graded, setGraded] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [pickSubmitted, setPickSubmitted] = useState(false);

  const setCell = (eid: string, hid: string, v: AchRating) => {
    if (graded) return;
    setRatings((r) => ({ ...r, [eid]: { ...(r[eid] ?? {}), [hid]: v } }));
  };

  const totalCells = ACH.evidence.length * ACH.hypotheses.length;
  const filled = ACH.evidence.reduce(
    (acc, e) =>
      acc +
      ACH.hypotheses.filter((h) => ratings[e.id]?.[h.id] !== undefined).length,
    0,
  );

  const matches = ACH.evidence.reduce(
    (acc, e) =>
      acc +
      ACH.hypotheses.filter((h) => ratings[e.id]?.[h.id] === e.expert[h.id])
        .length,
    0,
  );
  const agreementPct = Math.round((matches / totalCells) * 100);
  const matrixPassed = graded && agreementPct >= 70;

  // user's inconsistency counts (the heart of ACH)
  const userICounts = ACH.hypotheses.map((h) => ({
    h,
    i: ACH.evidence.filter((e) => ratings[e.id]?.[h.id] === 'I').length,
  }));

  const submitPick = () => {
    setPickSubmitted(true);
    if (pick === ACH.answer) onComplete();
  };

  return (
    <div>
      {/* hypotheses */}
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {ACH.hypotheses.map((h) => (
          <div key={h.id} className="rounded-xl border border-ink-700 bg-ink-900 p-3">
            <div className="text-sm font-bold text-slate-100">{h.label}</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">{h.desc}</div>
          </div>
        ))}
      </div>

      <p className="mb-3 text-xs text-slate-400">
        Puntúa cada evidencia contra cada hipótesis:{' '}
        <strong className="text-emerald-300">C</strong> consistente ·{' '}
        <strong className="text-slate-300">N</strong> neutral ·{' '}
        <strong className="text-rose-300">I</strong> inconsistente. Recuerda:
        en ACH buscas <em>refutar</em>, no confirmar.
      </p>

      {/* matrix */}
      <div className="space-y-3">
        {ACH.evidence.map((e) => (
          <div key={e.id} className="rounded-xl border border-ink-700 bg-ink-900 p-3">
            <div className="mb-2 text-sm text-slate-200">{e.text}</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {ACH.hypotheses.map((h) => {
                const cur = ratings[e.id]?.[h.id];
                const expertV = e.expert[h.id];
                const wrong = graded && cur !== expertV;
                return (
                  <div
                    key={h.id}
                    className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 ${
                      graded
                        ? wrong
                          ? 'border-rose-500/50 bg-rose-950/20'
                          : 'border-emerald-500/30 bg-emerald-950/10'
                        : 'border-ink-600 bg-ink-850'
                    }`}
                  >
                    <span className="mr-1 font-mono text-[10px] text-slate-500">
                      {h.id.toUpperCase()}
                    </span>
                    {RATINGS.map((r) => (
                      <button
                        key={r.v}
                        onClick={() => setCell(e.id, h.id, r.v)}
                        className={`h-7 w-7 rounded font-mono text-xs font-bold transition-colors ${
                          cur === r.v
                            ? r.v === 'C'
                              ? 'bg-emerald-500 text-ink-950'
                              : r.v === 'N'
                                ? 'bg-slate-400 text-ink-950'
                                : 'bg-rose-500 text-ink-950'
                            : 'bg-ink-700 text-slate-400 hover:bg-ink-600'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                    {graded && wrong && (
                      <span className="ml-auto font-mono text-[10px] text-amber-300">
                        experto: {expertV}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {graded && (
              <div className="mt-2 text-xs leading-relaxed text-slate-400">
                💬 {e.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* grade matrix */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!graded ? (
          <button
            onClick={() => setGraded(true)}
            disabled={filled < totalCells}
            className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
          >
            Evaluar matriz ({filled}/{totalCells})
          </button>
        ) : (
          <span
            className={`text-sm font-bold ${matrixPassed ? 'text-emerald-400' : 'text-rose-400'}`}
          >
            Acuerdo con la solución experta: {agreementPct}%
            {matrixPassed ? ' ✓' : ' — necesitas ≥70%'}
          </span>
        )}
        {graded && !matrixPassed && (
          <button
            onClick={() => setGraded(false)}
            className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
          >
            ↻ Revisar mis celdas
          </button>
        )}
      </div>

      {/* final pick */}
      {matrixPassed && (
        <div className="animate-pop-in mt-6 rounded-2xl border border-ink-600 bg-ink-900 p-5">
          <h3 className="mb-2 text-sm font-bold text-slate-100">
            Paso final: ¿qué hipótesis sobrevive?
          </h3>
          <p className="mb-3 text-xs text-slate-400">
            Tus recuentos de inconsistencias:{' '}
            {userICounts.map(({ h, i }) => `${h.id.toUpperCase()}: ${i} I`).join(' · ')}.
            Gana la <strong className="text-slate-200">menos inconsistente</strong>.
          </p>
          <div className="flex flex-wrap gap-2">
            {ACH.hypotheses.map((h) => (
              <button
                key={h.id}
                onClick={() => !pickSubmitted && setPick(h.id)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                  pickSubmitted && h.id === ACH.answer
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                    : pickSubmitted && h.id === pick
                      ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                      : pick === h.id
                        ? 'border-cyan-400 bg-cyan-950/40 text-slate-100'
                        : 'border-ink-600 bg-ink-850 text-slate-300 hover:bg-ink-800'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
          {!pickSubmitted ? (
            <button
              onClick={submitPick}
              disabled={!pick}
              className="mt-3 rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:bg-ink-700 disabled:text-slate-500"
            >
              Emitir el assessment
            </button>
          ) : pick === ACH.answer ? (
            <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 text-sm text-emerald-200">
              ✅ <strong>Espionaje dirigido</strong> es la hipótesis menos
              inconsistente: H2 cae por la ausencia total de monetización (e1,
              e3) y H3 por el silencio público (e7). Nota cómo e5 y e6 —
              consistentes con todo — no movieron nada: eso es{' '}
              <em>diagnosticidad</em>. Lab completado.
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-rose-500/40 bg-rose-950/30 p-3 text-sm text-rose-200">
              Revisa los recuentos: la hipótesis ganadora es la que acumula{' '}
              <em>menos</em> inconsistencias, no la que "suena" mejor.{' '}
              <button onClick={() => setPickSubmitted(false)} className="font-bold underline">
                Reintentar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
