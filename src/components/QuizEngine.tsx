import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Conf, Question } from '../lib/types';
import { CONF_LABEL, STAKES } from '../lib/xp';
import { shuffle } from '../lib/util';
import { useStore } from '../lib/store';
import { Bar } from './Bits';
import { md } from '../lib/md';

export interface QuizResult {
  total: number;
  correct: number;
  pct: number;
  maxCombo: number;
  domains: Record<string, { n: number; c: number }>;
  review: { q: Question; chosen: number; ok: boolean }[];
}

interface Props {
  questions: Question[];
  mode: 'quiz' | 'boss' | 'exam';
  adversary?: string;
  timeLimitSec?: number;
  onFinish: (r: QuizResult) => void;
  onRetry?: () => void;
  resultExtra?: (r: QuizResult) => ReactNode;
}

const fmtTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function QuizEngine({
  questions,
  mode,
  adversary,
  timeLimitSec,
  onFinish,
  onRetry,
  resultExtra,
}: Props) {
  const recordAnswer = useStore((s) => s.recordAnswer);

  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [conf, setConf] = useState<Conf>('med');
  const [submitted, setSubmitted] = useState(false);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [review, setReview] = useState<QuizResult['review']>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimitSec ?? 0);
  const finishedRef = useRef(false);

  // stable per-attempt choice shuffles
  const choiceOrders = useMemo(
    () =>
      new Map(
        questions.map((q) => [
          q.id,
          shuffle(
            q.choices.map((_, i) => i),
            `${q.id}-${questions.length}-${mode}`,
          ),
        ]),
      ),
    [questions, mode],
  );

  const q = questions[idx];
  const total = questions.length;
  const correctCount = review.filter((r) => r.ok).length;
  const allowedWrong = total - Math.ceil(total * 0.8);

  function buildResult(rev: QuizResult['review']): QuizResult {
    const domains: QuizResult['domains'] = {};
    for (const r of rev) {
      const d = (domains[r.q.domain] ??= { n: 0, c: 0 });
      d.n += 1;
      if (r.ok) d.c += 1;
    }
    const correct = rev.filter((r) => r.ok).length;
    return {
      total,
      correct,
      pct: Math.round((correct / total) * 100),
      maxCombo,
      domains,
      review: rev,
    };
  }

  function finish(rev: QuizResult['review']) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    // unanswered questions count as wrong
    const answeredIds = new Set(rev.map((r) => r.q.id));
    const full = [
      ...rev,
      ...questions
        .filter((qq) => !answeredIds.has(qq.id))
        .map((qq) => ({ q: qq, chosen: -1, ok: false })),
    ];
    const r = buildResult(full);
    setResult(r);
    onFinish(r);
  }

  // countdown timer
  useEffect(() => {
    if (!timeLimitSec || result) return;
    const h = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(h);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimitSec, result]);

  useEffect(() => {
    if (timeLimitSec && timeLeft === 0 && !result) finish(review);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (!q && !result) return null;

  // ------------------------------------------------------------------ result
  if (result) {
    const passed = result.pct >= 80;
    return (
      <div className="animate-pop-in">
        <div
          className={`mb-6 rounded-2xl border p-6 text-center ${
            passed
              ? 'border-emerald-500/50 bg-emerald-950/30'
              : 'border-rose-500/50 bg-rose-950/30'
          }`}
        >
          <div className="text-5xl font-black text-slate-50">{result.pct}%</div>
          <div className="mt-1 text-sm text-slate-300">
            {result.correct}/{result.total} correctas · combo máx 🔥{result.maxCombo}
          </div>
          <div
            className={`mt-2 font-semibold ${passed ? 'text-emerald-300' : 'text-rose-300'}`}
          >
            {mode === 'boss'
              ? passed
                ? `⚔️ ${adversary ?? 'El adversario'} ha caído`
                : `${adversary ?? 'El adversario'} resiste — necesitas ≥80%`
              : passed
                ? '¡Superado!'
                : 'Sigue practicando — objetivo ≥80%'}
          </div>
        </div>

        {resultExtra?.(result)}

        <div className="mb-4 flex flex-wrap gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-cyan-400"
            >
              ↻ Reintentar
            </button>
          )}
        </div>

        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
          Revisión
        </h3>
        <div className="space-y-3">
          {result.review.map((r, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                r.ok
                  ? 'border-emerald-500/20 bg-ink-900'
                  : 'border-rose-500/30 bg-ink-900'
              }`}
            >
              <div className="mb-1 text-sm font-medium text-slate-200">
                {r.ok ? '✅' : '❌'} {r.q.prompt}
              </div>
              {!r.ok && (
                <div className="text-xs text-rose-300">
                  Tu respuesta:{' '}
                  {r.chosen >= 0 ? r.q.choices[r.chosen] : '(sin responder)'}
                </div>
              )}
              <div className="text-xs text-emerald-300">
                Correcta: {r.q.choices[r.q.answer]}
              </div>
              <div className="mt-1 text-xs leading-relaxed text-slate-400">
                {md(r.q.explain)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- question
  const order = choiceOrders.get(q.id)!;
  const stakes = mode !== 'exam';

  const submit = () => {
    if (chosen === null || submitted) return;
    const ok = chosen === q.answer;
    const newCombo = ok ? combo + 1 : 0;
    setCombo(newCombo);
    setMaxCombo((m) => Math.max(m, newCombo));
    const delta = recordAnswer(ok, conf, { combo: newCombo, stakes });
    setLastDelta(delta);
    const rev = [...review, { q, chosen, ok }];
    setReview(rev);
    if (mode === 'exam') {
      // no per-question reveal in exam mode
      if (idx + 1 >= total) finish(rev);
      else {
        setIdx(idx + 1);
        setChosen(null);
        setConf('med');
      }
    } else {
      setSubmitted(true);
    }
  };

  const next = () => {
    if (idx + 1 >= total) {
      finish(review);
    } else {
      setIdx(idx + 1);
      setChosen(null);
      setConf('med');
      setSubmitted(false);
      setLastDelta(null);
    }
  };

  return (
    <div>
      {/* status bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-slate-400">
          {idx + 1}/{total}
        </span>
        <div className="min-w-24 flex-1">
          <Bar value={(idx / total) * 100} />
        </div>
        {combo >= 2 && (
          <span className="animate-pop-in rounded-full bg-amber-950 px-2.5 py-1 text-xs font-bold text-amber-300">
            🔥 x{combo}
          </span>
        )}
        {timeLimitSec ? (
          <span
            className={`rounded-full border px-2.5 py-1 font-mono text-xs font-bold ${
              timeLeft < 60
                ? 'border-rose-500/50 bg-rose-950 text-rose-300'
                : 'border-ink-600 bg-ink-800 text-slate-300'
            }`}
          >
            ⏱ {fmtTime(timeLeft)}
          </span>
        ) : null}
      </div>

      {/* boss HP */}
      {mode === 'boss' && (
        <div className="animate-boss-glow mb-4 rounded-xl border border-rose-500/40 bg-ink-900 p-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-mono font-bold tracking-wider text-rose-300">
              ☠️ {adversary}
            </span>
            <span className="text-slate-400">
              Fallos: {review.filter((r) => !r.ok).length}/{allowedWrong}{' '}
              permitidos
            </span>
          </div>
          <Bar
            value={100 * (1 - correctCount / total)}
            color="bg-rose-500"
            className="h-3"
          />
        </div>
      )}

      <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {q.domain}
        </div>
        <p className="mb-4 font-medium leading-relaxed text-slate-100">
          {q.prompt}
        </p>

        <div className="flex flex-col gap-2">
          {order.map((origIdx) => {
            const c = q.choices[origIdx];
            let cls =
              'rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ';
            if (!submitted) {
              cls +=
                chosen === origIdx
                  ? 'border-cyan-400 bg-cyan-950/40 text-slate-100'
                  : 'border-ink-600 bg-ink-850 text-slate-300 hover:border-ink-500 hover:bg-ink-800';
            } else if (origIdx === q.answer) {
              cls += 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
            } else if (origIdx === chosen) {
              cls += 'border-rose-500 bg-rose-950/40 text-rose-200 animate-shake';
            } else {
              cls += 'border-ink-700 bg-ink-900 text-slate-500';
            }
            return (
              <button
                key={origIdx}
                className={cls}
                disabled={submitted}
                onClick={() => setChosen(origIdx)}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* confidence bet */}
        {!submitted && (
          <div className="mt-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {stakes ? '🎲 Apuesta tu confianza' : 'Confianza (calibración)'}
            </div>
            <div className="flex flex-wrap gap-2">
              {(['low', 'med', 'high'] as Conf[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setConf(c)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    conf === c
                      ? c === 'high'
                        ? 'border-fuchsia-400 bg-fuchsia-950/50 text-fuchsia-200'
                        : c === 'med'
                          ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200'
                          : 'border-slate-400 bg-ink-700 text-slate-200'
                      : 'border-ink-600 bg-ink-850 text-slate-400 hover:bg-ink-800'
                  }`}
                >
                  {CONF_LABEL[c]}
                  {stakes && (
                    <span className="ml-1.5 font-mono opacity-80">
                      +{STAKES[c].win}/−{STAKES[c].lose}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* reveal */}
        {submitted && (
          <div
            className={`animate-pop-in mt-4 rounded-lg border px-4 py-3 text-sm ${
              chosen === q.answer
                ? 'border-emerald-500/40 bg-emerald-950/30'
                : 'border-rose-500/40 bg-rose-950/30'
            }`}
          >
            <div className="mb-1 flex items-center gap-2 font-semibold text-slate-100">
              {chosen === q.answer ? '✓ Correcto' : '✗ Incorrecto'}
              {lastDelta !== null && lastDelta !== 0 && (
                <span
                  className={`font-mono text-xs ${lastDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {lastDelta > 0 ? `+${lastDelta}` : lastDelta} XP
                </span>
              )}
            </div>
            <p className="leading-relaxed text-slate-300">{md(q.explain)}</p>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          {!submitted ? (
            <button
              onClick={submit}
              disabled={chosen === null}
              className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
            >
              {mode === 'exam' && idx + 1 >= total ? 'Terminar' : 'Responder'}
            </button>
          ) : (
            <button
              onClick={next}
              className="rounded-lg bg-slate-200 px-5 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-white"
            >
              {idx + 1 >= total ? 'Ver resultado' : 'Siguiente →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
