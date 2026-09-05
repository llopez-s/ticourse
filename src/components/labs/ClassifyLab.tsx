import { useState } from 'react';
import type { ClassifyData } from '../../data/labs';
import { pct } from '../../lib/util';

export default function ClassifyLab({
  data,
  onComplete,
}: {
  data: ClassifyData;
  onComplete: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = data.items.every((_, i) => answers[i]);
  const score = data.items.filter((it, i) => answers[i] === it.answer).length;
  const scorePct = pct(score, data.items.length);
  const passed = scorePct >= data.passPct;

  const submit = () => {
    setSubmitted(true);
    if (pct(score, data.items.length) >= data.passPct) onComplete();
  };

  return (
    <div>
      <div className="mb-4 text-xs text-slate-400">
        Clasifica cada elemento. Necesitas ≥{data.passPct}% para completar el
        lab.
      </div>
      <div className="space-y-3">
        {data.items.map((it, i) => {
          const chosen = answers[i];
          const ok = chosen === it.answer;
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                submitted
                  ? ok
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-rose-500/40 bg-rose-950/20'
                  : 'border-ink-700 bg-ink-900'
              }`}
            >
              <div className="mb-2 text-sm font-medium text-slate-100">
                {submitted && (ok ? '✅ ' : '❌ ')}
                {it.text}
              </div>
              <select
                value={chosen ?? ''}
                disabled={submitted}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [i]: e.target.value }))
                }
                className="w-full max-w-xs rounded-lg border border-ink-600 bg-ink-850 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-400"
              >
                <option value="" disabled>
                  — elegir categoría —
                </option>
                {data.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              {submitted && !ok && (
                <div className="mt-2 text-xs text-rose-200">
                  Correcto:{' '}
                  <strong>
                    {data.categories.find((c) => c.id === it.answer)?.label}
                  </strong>
                </div>
              )}
              {submitted && (
                <div className="mt-1 text-xs leading-relaxed text-slate-400">
                  {it.why}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {!submitted ? (
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
          >
            Corregir ({Object.keys(answers).length}/{data.items.length})
          </button>
        ) : (
          <>
            <span
              className={`text-sm font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {score}/{data.items.length} ({scorePct}%) —{' '}
              {passed ? '¡Lab completado!' : `necesitas ≥${data.passPct}%`}
            </span>
            {!passed && (
              <button
                onClick={() => setSubmitted(false)}
                className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
              >
                ↻ Corregir mis fallos
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
