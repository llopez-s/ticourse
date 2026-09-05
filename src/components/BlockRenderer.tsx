import { useState } from 'react';
import type { Block, CheckQ } from '../lib/types';
import { md } from '../lib/md';
import { useStore } from '../lib/store';

const CALLOUT_STYLE: Record<
  string,
  { border: string; bg: string; icon: string; label: string }
> = {
  tip: { border: 'border-cyan-500/40', bg: 'bg-cyan-950/30', icon: '💡', label: 'Tip' },
  warn: { border: 'border-amber-500/40', bg: 'bg-amber-950/30', icon: '⚠️', label: 'Cuidado' },
  example: { border: 'border-slate-500/40', bg: 'bg-ink-850', icon: '🧩', label: 'Ejemplo' },
  exam: { border: 'border-violet-500/40', bg: 'bg-violet-950/30', icon: '🎓', label: 'Nota de examen' },
  story: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/30', icon: '🎖️', label: 'Operación VELVET CICADA' },
};

function CheckBlock({
  q,
  rewardEnabled,
  onAnswered,
}: {
  q: CheckQ;
  rewardEnabled: boolean;
  onAnswered: () => void;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const awardCheckpoint = useStore((s) => s.awardCheckpoint);

  const submit = () => {
    if (chosen === null || submitted) return;
    setSubmitted(true);
    if (chosen === q.answer && rewardEnabled) awardCheckpoint();
    onAnswered();
  };

  return (
    <div className="my-5 rounded-xl border border-cyan-500/30 bg-ink-900 p-4">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
        ⚡ Checkpoint
      </div>
      <p className="mb-3 font-medium text-slate-100">{q.q}</p>
      <div className="flex flex-col gap-2">
        {q.choices.map((c, i) => {
          let cls =
            'rounded-lg border px-3 py-2 text-left text-sm transition-colors ';
          if (!submitted) {
            cls +=
              chosen === i
                ? 'border-cyan-400 bg-cyan-950/40 text-slate-100'
                : 'border-ink-600 bg-ink-850 text-slate-300 hover:border-ink-500 hover:bg-ink-800';
          } else if (i === q.answer) {
            cls += 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
          } else if (i === chosen) {
            cls += 'border-rose-500 bg-rose-950/40 text-rose-200';
          } else {
            cls += 'border-ink-700 bg-ink-900 text-slate-500';
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={submitted}
              onClick={() => setChosen(i)}
            >
              {c}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button
          onClick={submit}
          disabled={chosen === null}
          className="mt-3 rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
        >
          Comprobar
        </button>
      ) : (
        <div
          className={`animate-pop-in mt-3 rounded-lg border px-3 py-2 text-sm ${
            chosen === q.answer
              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
              : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
          }`}
        >
          <span className="font-semibold">
            {chosen === q.answer ? '✓ Correcto.' : '✗ No exactamente.'}
          </span>{' '}
          <span className="text-slate-300">{q.explain}</span>
        </div>
      )}
    </div>
  );
}

export default function BlockRenderer({
  blocks,
  rewardEnabled,
  onCheckAnswered,
}: {
  blocks: Block[];
  rewardEnabled: boolean;
  onCheckAnswered: () => void;
}) {
  return (
    <div className="space-y-1">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'p':
            return (
              <p key={i} className="my-4 leading-relaxed text-slate-300">
                {md(b.md)}
              </p>
            );
          case 'h':
            return (
              <h2
                key={i}
                className="mb-2 mt-8 border-l-2 border-cyan-400 pl-3 text-lg font-bold text-slate-50"
              >
                {b.text}
              </h2>
            );
          case 'list':
            return b.ordered ? (
              <ol
                key={i}
                className="my-4 list-decimal space-y-2 pl-6 text-slate-300 marker:font-semibold marker:text-cyan-400"
              >
                {b.items.map((it, j) => (
                  <li key={j} className="leading-relaxed">
                    {md(it)}
                  </li>
                ))}
              </ol>
            ) : (
              <ul
                key={i}
                className="my-4 list-disc space-y-2 pl-6 text-slate-300 marker:text-cyan-400"
              >
                {b.items.map((it, j) => (
                  <li key={j} className="leading-relaxed">
                    {md(it)}
                  </li>
                ))}
              </ul>
            );
          case 'table':
            return (
              <div
                key={i}
                className="my-5 overflow-x-auto rounded-xl border border-ink-700"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink-800">
                      {b.headers.map((h, j) => (
                        <th
                          key={j}
                          className="px-3 py-2 text-left font-semibold text-slate-200"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr
                        key={j}
                        className={j % 2 ? 'bg-ink-850' : 'bg-ink-900'}
                      >
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="px-3 py-2 align-top text-slate-300"
                          >
                            {md(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'code':
            return (
              <div
                key={i}
                className="my-5 overflow-hidden rounded-xl border border-ink-700 bg-ink-950"
              >
                {(b.title || b.lang) && (
                  <div className="flex items-center justify-between gap-3 border-b border-ink-700 bg-ink-900 px-4 py-2">
                    <span className="text-xs font-semibold text-slate-300">
                      {b.title}
                    </span>
                    {b.lang && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                        {b.lang}
                      </span>
                    )}
                  </div>
                )}
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
                  <code>{b.text}</code>
                </pre>
              </div>
            );
          case 'callout': {
            const s = CALLOUT_STYLE[b.kind];
            return (
              <div
                key={i}
                className={`my-5 rounded-xl border ${s.border} ${s.bg} p-4`}
              >
                <div className="mb-1 text-sm font-semibold text-slate-100">
                  {s.icon} {b.title ?? s.label}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {md(b.md)}
                </p>
              </div>
            );
          }
          case 'quote':
            return (
              <blockquote
                key={i}
                className="my-5 border-l-2 border-slate-500 pl-4 italic text-slate-400"
              >
                {md(b.md)}
                {b.by && (
                  <div className="mt-1 text-xs not-italic text-slate-500">
                    — {b.by}
                  </div>
                )}
              </blockquote>
            );
          case 'check':
            return (
              <CheckBlock
                key={i}
                q={b.q}
                rewardEnabled={rewardEnabled}
                onAnswered={onCheckAnswered}
              />
            );
          default: {
            const _exhaustive: never = b;
            return _exhaustive;
          }
        }
      })}
    </div>
  );
}
