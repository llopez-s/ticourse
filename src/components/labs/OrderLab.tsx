import { useMemo, useState } from 'react';
import type { OrderData } from '../../data/labs';
import { shuffle } from '../../lib/util';

export default function OrderLab({
  data,
  onComplete,
}: {
  data: OrderData;
  onComplete: () => void;
}) {
  const pool = useMemo(
    () => shuffle(data.steps.map((_, i) => i), 'order-lab-pool'),
    [data],
  );
  const [seq, setSeq] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const correct = seq.every((stepIdx, pos) => stepIdx === pos);

  const submit = () => {
    setSubmitted(true);
    if (seq.every((stepIdx, pos) => stepIdx === pos)) onComplete();
  };

  return (
    <div>
      <p className="mb-4 text-sm text-slate-300">{data.prompt}</p>

      {/* chosen sequence */}
      <div className="mb-4 space-y-2">
        {seq.map((stepIdx, pos) => {
          const ok = stepIdx === pos;
          return (
            <button
              key={stepIdx}
              onClick={() => {
                if (submitted) return;
                setSeq((s) => s.filter((x) => x !== stepIdx));
              }}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm ${
                submitted
                  ? ok
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-100'
                    : 'border-rose-500/50 bg-rose-950/20 text-rose-100'
                  : 'border-cyan-500/40 bg-cyan-950/20 text-slate-100 hover:border-cyan-400'
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-700 font-mono text-xs font-bold text-cyan-300">
                {pos + 1}
              </span>
              <div className="flex-1">
                <div className="font-semibold">
                  {submitted && (ok ? '✅ ' : '❌ ')}
                  {data.steps[stepIdx].text}
                </div>
                {submitted && ok && (
                  <div className="mt-0.5 text-xs text-slate-400">
                    {data.steps[stepIdx].detail}
                  </div>
                )}
              </div>
              {!submitted && <span className="text-xs text-slate-500">quitar ✕</span>}
            </button>
          );
        })}
        {seq.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink-600 p-4 text-center text-xs text-slate-500">
            Toca las fases de abajo en orden para construir la secuencia
          </div>
        )}
      </div>

      {/* pool */}
      <div className="flex flex-wrap gap-2">
        {pool
          .filter((i) => !seq.includes(i))
          .map((i) => (
            <button
              key={i}
              onClick={() => !submitted && setSeq((s) => [...s, i])}
              className="rounded-xl border border-ink-600 bg-ink-850 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-400 hover:bg-ink-800"
            >
              {data.steps[i].text}
            </button>
          ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {!submitted ? (
          <button
            onClick={submit}
            disabled={seq.length !== data.steps.length}
            className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
          >
            Comprobar orden
          </button>
        ) : correct ? (
          <span className="text-sm font-bold text-emerald-400">
            ✅ Ciclo perfecto — lab completado
          </span>
        ) : (
          <button
            onClick={() => {
              setSubmitted(false);
              setSeq([]);
            }}
            className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
          >
            ↻ Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
