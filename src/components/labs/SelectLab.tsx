import { useState } from 'react';
import type { SelectData } from '../../data/labs';

export default function SelectLab({
  data,
  onComplete,
}: {
  data: SelectData;
  onComplete: () => void;
}) {
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i: number) => {
    if (submitted) return;
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(i)) n.delete(i);
      else if (n.size < data.pickN) n.add(i);
      return n;
    });
  };

  const perfect = data.options.every(
    (o, i) => o.good === picked.has(i),
  );

  const submit = () => {
    setSubmitted(true);
    if (perfect) onComplete();
  };

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-slate-300">
        {data.prompt}
      </p>
      <div className="mb-2 text-xs text-slate-500">
        Seleccionadas: {picked.size}/{data.pickN}
      </div>
      <div className="space-y-2">
        {data.options.map((o, i) => {
          const isPicked = picked.has(i);
          let cls = 'w-full rounded-xl border p-4 text-left text-sm transition-colors ';
          if (!submitted) {
            cls += isPicked
              ? 'border-cyan-400 bg-cyan-950/40 text-slate-100'
              : 'border-ink-700 bg-ink-900 text-slate-300 hover:border-ink-500';
          } else if (o.good) {
            cls += 'border-emerald-500/50 bg-emerald-950/20 text-slate-100';
          } else if (isPicked) {
            cls += 'border-rose-500/50 bg-rose-950/20 text-slate-200';
          } else {
            cls += 'border-ink-700 bg-ink-900 text-slate-400';
          }
          return (
            <button key={i} className={cls} onClick={() => toggle(i)}>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 font-mono text-xs">
                  {submitted ? (o.good ? '✅' : isPicked ? '❌' : '◻️') : isPicked ? '☑️' : '◻️'}
                </span>
                <span className="leading-relaxed">{o.text}</span>
              </div>
              {submitted && (
                <div className="mt-2 pl-6 text-xs leading-relaxed text-slate-400">
                  {o.why}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-3">
        {!submitted ? (
          <button
            onClick={submit}
            disabled={picked.size !== data.pickN}
            className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
          >
            Presentar al CISO
          </button>
        ) : perfect ? (
          <span className="text-sm font-bold text-emerald-400">
            ✅ El CISO aprueba tus PIRs — lab completado
          </span>
        ) : (
          <>
            <span className="text-sm font-bold text-rose-400">
              Casi — revisa el feedback de cada opción
            </span>
            <button
              onClick={() => setSubmitted(false)}
              className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
            >
              ↻ Reintentar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
