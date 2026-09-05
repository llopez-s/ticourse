import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { sampleExam } from '../data/course';
import QuizEngine, { type QuizResult } from '../components/QuizEngine';
import { todayStr } from '../lib/util';
import { Bar, PageTitle, Panel } from '../components/Bits';
import { useTrack } from '../components/Layout';

type Config = { n: number; minutes: number };

export default function ExamPage() {
  const recordExam = useStore((s) => s.recordExam);
  const track = useTrack();
  const allExams = useStore((s) => s.exams);
  const exams = allExams.filter((e) => e.track === track.id);
  const passPct = track.exam.passPct;
  const [config, setConfig] = useState<Config | null>(null);
  const [attempt, setAttempt] = useState(0);

  const questions = useMemo(
    () =>
      config
        ? sampleExam(track.id, config.n, `exam-${attempt}-${Date.now()}`)
        : [],
    [config, attempt, track.id],
  );

  if (config && questions.length === 0) {
    return (
      <Panel>
        <div className="text-sm font-bold text-slate-100">
          Aún no hay preguntas suficientes en este track
        </div>
        <p className="mt-1 text-xs text-slate-400">
          El simulacro se construye con las preguntas de las lecciones
          disponibles. Vuelve cuando haya más contenido publicado.
        </p>
        <button
          onClick={() => setConfig(null)}
          className="mt-3 rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
        >
          ← Volver
        </button>
      </Panel>
    );
  }

  if (config) {
    return (
      <div>
        <PageTitle
          kicker={`Examen de práctica · ${track.name}`}
          title={`⏱️ ${track.exam.name}`}
          sub={`${questions.length} preguntas · ${config.minutes} minutos · sin feedback hasta el final, como el examen real. Objetivo: ≥${passPct}%.`}
        />
        <QuizEngine
          key={attempt}
          questions={questions}
          mode="exam"
          timeLimitSec={config.minutes * 60}
          onFinish={(r) =>
            recordExam({
              date: todayStr(),
              track: track.id,
              pct: r.pct,
              correct: r.correct,
              total: r.total,
              domains: r.domains,
            })
          }
          onRetry={() => setAttempt((a) => a + 1)}
          resultExtra={(r: QuizResult) => (
            <Panel className="mb-4">
              <div className="mb-3 text-sm font-bold text-slate-100">
                Desglose por dominio
              </div>
              <div className="space-y-2">
                {Object.entries(r.domains).map(([d, v]) => {
                  const p = Math.round((v.c / v.n) * 100);
                  return (
                    <div key={d}>
                      <div className="mb-0.5 flex justify-between text-xs">
                        <span className="text-slate-300">{d}</span>
                        <span className="font-mono text-slate-400">
                          {v.c}/{v.n} · {p}%
                        </span>
                      </div>
                      <Bar
                        value={p}
                        color={
                          p >= passPct
                            ? 'bg-emerald-400'
                            : p >= 50
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setConfig(null)}
                className="mt-4 rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
              >
                ← Volver al hub del examen
              </button>
            </Panel>
          )}
        />
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        kicker={track.name}
        title="⏱️ Examen de práctica"
        sub={`${track.exam.realFormat} Tu confianza se sigue registrando para la calibración.`}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => {
            setAttempt((a) => a + 1);
            setConfig(track.exam.sprint);
          }}
          className="rounded-2xl border border-ink-600 bg-ink-900 p-6 text-left transition-colors hover:border-cyan-400"
        >
          <div className="text-lg font-bold text-slate-50">🏃 Sprint</div>
          <div className="mt-1 text-sm text-slate-400">
            {track.exam.sprint.n} preguntas · {track.exam.sprint.minutes} minutos
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Muestreo por dominio. Ideal para diagnóstico rápido.
          </div>
        </button>
        <button
          onClick={() => {
            setAttempt((a) => a + 1);
            setConfig(track.exam.full);
          }}
          className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-ink-900 to-cyan-950/30 p-6 text-left transition-colors hover:border-cyan-400"
        >
          <div className="text-lg font-bold text-slate-50">🎓 Simulacro completo</div>
          <div className="mt-1 text-sm text-slate-400">
            {track.exam.full.n} preguntas · {track.exam.full.minutes} minutos
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Pesos por dominio y ritmo del examen real.
          </div>
        </button>
      </div>

      <Panel>
        <div className="mb-3 text-sm font-bold text-slate-100">
          📜 Historial de exámenes
        </div>
        {exams.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aún no has hecho ningún simulacro. El primero marca tu línea base —
            no esperes a "estar lista".
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="py-1 pr-4">Fecha</th>
                  <th className="py-1 pr-4">Resultado</th>
                  <th className="py-1 pr-4">Preguntas</th>
                  <th className="py-1">Dominio más flojo</th>
                </tr>
              </thead>
              <tbody>
                {[...exams].reverse().map((e, i) => {
                  const worst = Object.entries(e.domains).sort(
                    (a, b) => a[1].c / a[1].n - b[1].c / b[1].n,
                  )[0];
                  return (
                    <tr key={i} className="border-t border-ink-700">
                      <td className="py-2 pr-4 font-mono text-xs text-slate-400">
                        {e.date}
                      </td>
                      <td
                        className={`py-2 pr-4 font-bold ${
                          e.pct >= passPct ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {e.pct}%
                      </td>
                      <td className="py-2 pr-4 text-slate-400">
                        {e.correct}/{e.total}
                      </td>
                      <td className="py-2 text-xs text-slate-400">
                        {worst ? worst[0] : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
