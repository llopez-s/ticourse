import { useState } from 'react';
import { CALIB } from '../../data/labs';

export default function CalibrationLab({
  onComplete,
}: {
  onComplete: () => void;
}) {
  // part 1: phrase → band
  const [bands, setBands] = useState<Record<number, string>>({});
  const [p1Checked, setP1Checked] = useState(false);
  // part 2: sliders
  const [est, setEst] = useState<Record<number, number>>({});
  const [p2Checked, setP2Checked] = useState(false);

  const p1AllSet = CALIB.phrases.every((_, i) => bands[i]);
  const p1Correct = CALIB.phrases.every((p, i) => bands[i] === p.band);
  const p1Done = p1Checked && p1Correct;

  const scoreFor = (i: number) => {
    const v = est[i] ?? 50;
    const s = CALIB.scenarios[i];
    if (v >= s.lo && v <= s.hi) return 2;
    if (v >= s.lo - 10 && v <= s.hi + 10) return 1;
    return 0;
  };
  const p2Score = CALIB.scenarios.reduce((acc, _, i) => acc + scoreFor(i), 0);
  const p2Max = CALIB.scenarios.length * 2;
  const p2Passed = p2Checked && p2Score >= 8;

  const checkP2 = () => {
    setP2Checked(true);
    const sc = CALIB.scenarios.reduce((acc, _, i) => acc + scoreFor(i), 0);
    if (sc >= 8 && p1Done) onComplete();
  };

  return (
    <div>
      {/* ------------------------------------------------ part 1 */}
      <h3 className="mb-2 text-sm font-bold text-slate-100">
        Parte 1 · Vocabulario ICD 203
      </h3>
      <p className="mb-3 text-xs text-slate-400">
        Asigna cada expresión estimativa a su banda de probabilidad.
      </p>
      <div className="mb-4 space-y-2">
        {CALIB.phrases.map((p, i) => {
          const ok = bands[i] === p.band;
          return (
            <div
              key={i}
              className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-2.5 ${
                p1Checked
                  ? ok
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-rose-500/50 bg-rose-950/20'
                  : 'border-ink-700 bg-ink-900'
              }`}
            >
              <span className="flex-1 font-mono text-sm text-slate-100">
                {p1Checked && (ok ? '✅ ' : '❌ ')}
                {p.phrase}
              </span>
              <select
                value={bands[i] ?? ''}
                onChange={(e) => {
                  setBands((b) => ({ ...b, [i]: e.target.value }));
                  setP1Checked(false);
                }}
                className="rounded-lg border border-ink-600 bg-ink-850 px-3 py-1.5 font-mono text-xs text-slate-200 outline-none focus:border-cyan-400"
              >
                <option value="" disabled>
                  — banda —
                </option>
                {CALIB.bands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {p1Checked && !ok && (
                <span className="font-mono text-xs text-amber-300">
                  → {p.band}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {!p1Done && (
        <button
          onClick={() => setP1Checked(true)}
          disabled={!p1AllSet}
          className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:bg-ink-700 disabled:text-slate-500"
        >
          Comprobar bandas
        </button>
      )}
      {p1Done && (
        <div className="text-sm font-bold text-emerald-400">
          ✅ Vocabulario dominado — sigue con la parte 2
        </div>
      )}

      {/* ------------------------------------------------ part 2 */}
      {p1Done && (
        <div className="animate-pop-in mt-6">
          <h3 className="mb-2 text-sm font-bold text-slate-100">
            Parte 2 · El campo de tiro
          </h3>
          <p className="mb-3 text-xs text-slate-400">
            Estima la probabilidad de cada afirmación (1–99%). Puntuación:
            dentro de la banda de escuela = 2 pts, a ±10 = 1 pt. Necesitas ≥8/
            {p2Max}.
          </p>
          <div className="space-y-4">
            {CALIB.scenarios.map((s, i) => {
              const v = est[i] ?? 50;
              const pts = scoreFor(i);
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${
                    p2Checked
                      ? pts === 2
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : pts === 1
                          ? 'border-amber-500/40 bg-amber-950/20'
                          : 'border-rose-500/50 bg-rose-950/20'
                      : 'border-ink-700 bg-ink-900'
                  }`}
                >
                  <div className="mb-2 text-sm text-slate-200">{s.text}</div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={99}
                      value={v}
                      onChange={(e) => {
                        setEst((x) => ({ ...x, [i]: Number(e.target.value) }));
                        setP2Checked(false);
                      }}
                      className="flex-1 accent-cyan-400"
                    />
                    <span className="w-12 text-right font-mono text-sm font-bold text-slate-100">
                      {v}%
                    </span>
                  </div>
                  {p2Checked && (
                    <div className="mt-2 text-xs leading-relaxed text-slate-400">
                      <span
                        className={
                          pts === 2
                            ? 'font-bold text-emerald-300'
                            : pts === 1
                              ? 'font-bold text-amber-300'
                              : 'font-bold text-rose-300'
                        }
                      >
                        {pts} pts · escuela: {s.lo}–{s.hi}%
                      </span>{' '}
                      — {s.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={checkP2}
              className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400"
            >
              Puntuar estimaciones
            </button>
            {p2Checked && (
              <span
                className={`text-sm font-bold ${p2Passed ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {p2Score}/{p2Max} pts{' '}
                {p2Passed ? '— ¡lab completado! 🔮' : '— ajusta y reintenta'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
