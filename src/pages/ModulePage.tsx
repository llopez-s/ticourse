import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Module } from '../lib/types';
import {
  moduleById,
  modulesOfTrack,
  sectionById,
  trackOf,
} from '../data/course';
import { useStore } from '../lib/store';
import BlockRenderer from '../components/BlockRenderer';
import { Panel } from '../components/Bits';
import { useSyncTrack } from '../components/Layout';

function LessonView({ mod }: { mod: Module }) {
  const lessons = useStore((s) => s.lessons);
  const completeLesson = useStore((s) => s.completeLesson);
  const [answered, setAnswered] = useState(0);
  useSyncTrack(mod.sectionId);

  const totalChecks = useMemo(
    () => mod.blocks.filter((b) => b.t === 'check').length,
    [mod],
  );

  const section = sectionById(mod.sectionId);
  const completed = !!lessons[mod.id];
  const canComplete = answered >= totalChecks;
  const trackMods = modulesOfTrack(trackOf(mod.sectionId));
  const globalIdx = trackMods.findIndex((m) => m.id === mod.id);
  const nextMod = trackMods[globalIdx + 1];

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/section/${mod.sectionId}`}
          className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400 hover:text-cyan-300"
        >
          ← S{section?.num} · {section?.short}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-50">{mod.title}</h1>
        <div className="mt-1 text-xs text-slate-500">
          ⏱ {mod.minutes} min de lectura
          {completed && (
            <span className="ml-2 font-semibold text-emerald-400">
              ✓ completada
            </span>
          )}
        </div>
      </div>

      <Panel className="mb-6">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          🎯 Objetivos
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300 marker:text-cyan-400">
          {mod.objectives.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </Panel>

      <BlockRenderer
        blocks={mod.blocks}
        rewardEnabled={!completed}
        onCheckAnswered={() => setAnswered((a) => a + 1)}
      />

      <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-900 p-5">
        {!completed ? (
          <>
            <div className="mb-3 text-sm text-slate-300">
              {totalChecks > 0 && !canComplete
                ? `Responde los checkpoints para completar la lección (${answered}/${totalChecks}).`
                : '¡Lección leída! Márcala como completada para ganar XP.'}
            </div>
            <button
              onClick={() => completeLesson(mod.id)}
              disabled={!canComplete}
              className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-ink-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
            >
              ✓ Completar lección (+50 XP)
            </button>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-emerald-400">
              ✓ Lección completada
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              {mod.quiz.length > 0 && (
                <Link
                  to={`/quiz/${mod.id}`}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400"
                >
                  🎯 Hacer el quiz
                </Link>
              )}
              {nextMod && (
                <Link
                  to={`/learn/${nextMod.id}`}
                  className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
                >
                  Siguiente lección →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ModulePage() {
  const { moduleId } = useParams();
  const mod = moduleById(moduleId ?? '');
  if (!mod) return <p className="text-slate-400">Lección no encontrada.</p>;
  // key forces a clean remount (checkpoint + progress state) per lesson
  return <LessonView key={mod.id} mod={mod} />;
}
