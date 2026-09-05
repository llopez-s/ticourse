import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { contentSections, questionsOf, sectionById } from '../data/course';
import { useStore } from '../lib/store';
import QuizEngine from '../components/QuizEngine';
import { sample } from '../lib/util';
import { useSyncTrack } from '../components/Layout';

const BOSS_Q = 12;
const BOSS_TIME = 360;

export default function BossPage() {
  const { sectionId } = useParams();
  const section = sectionById(sectionId ?? '');
  const finishBoss = useStore((s) => s.finishBoss);
  const bossBest = useStore((s) => s.bosses[sectionId ?? ''] ?? 0);
  const [attempt, setAttempt] = useState(0);
  const [started, setStarted] = useState(false);
  useSyncTrack(section?.id);

  const questions = useMemo(
    () =>
      section
        ? sample(
            questionsOf(section.id),
            BOSS_Q,
            `boss-${section.id}-${attempt}-${Date.now()}`,
          )
        : [],
    [section, attempt],
  );

  if (!section || !section.boss)
    return <p className="text-slate-400">Boss no encontrado.</p>;

  const boss = section.boss;
  const secs = contentSections(section.track);
  const nextSec = secs[secs.findIndex((x) => x.id === section.id) + 1];

  if (!started) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="animate-boss-glow rounded-2xl border border-rose-500/40 bg-gradient-to-b from-ink-900 to-rose-950/30 p-8 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400">
            Operation {boss.codename}
          </div>
          <div className="my-4 text-6xl">☠️</div>
          <h1 className="text-3xl font-black tracking-tight text-slate-50">
            {boss.adversary}
          </h1>
          {bossBest >= 80 && (
            <div className="mt-2 text-sm font-bold text-emerald-400">
              ⚔️ Ya derrotado ({bossBest}%) — puedes volver a luchar por práctica
            </div>
          )}
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">
            {boss.flavor}
          </p>
          <div className="mx-auto mt-5 flex max-w-sm justify-center gap-4 text-xs text-slate-400">
            <span>🎯 {BOSS_Q} preguntas</span>
            <span>⏱ 6:00</span>
            <span>⚔️ ≥80% para vencer</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Recompensa: +200 XP · 🧊 +1 streak freeze · fragmento del dossier
          </div>
          <button
            onClick={() => setStarted(true)}
            className="mt-6 rounded-xl bg-rose-500 px-8 py-3 text-base font-black text-ink-950 transition-colors hover:bg-rose-400"
          >
            ⚔️ ENTRAR EN COMBATE
          </button>
          <div className="mt-4">
            <Link
              to={`/section/${section.id}`}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              ← Mejor me preparo un poco más
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-rose-400">
          Operation {boss.codename}
        </span>
      </div>
      <QuizEngine
        key={attempt}
        questions={questions}
        mode="boss"
        adversary={boss.adversary}
        timeLimitSec={BOSS_TIME}
        onFinish={(r) => finishBoss(section.id, r.pct)}
        onRetry={() => {
          setAttempt((a) => a + 1);
        }}
        resultExtra={(r) => (
          <div className="mb-4">
            {r.pct >= 80 && (
              <div className="animate-pop-in mb-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                  📁 Fragmento del dossier desbloqueado
                </div>
                <p className="font-mono text-xs leading-relaxed text-slate-200">
                  {boss.dossier}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/section/${section.id}`}
                className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
              >
                ← Volver a la sección
              </Link>
              {r.pct >= 80 && nextSec && (
                <Link
                  to={`/section/${nextSec.id}`}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-emerald-400"
                >
                  Siguiente sección →
                </Link>
              )}
              {r.pct >= 80 && !nextSec && (
                <Link
                  to="/exam"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-emerald-400"
                >
                  🏆 Campaña completada — al examen →
                </Link>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
