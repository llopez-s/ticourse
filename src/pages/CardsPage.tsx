import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { buildQueue, isMature, NEW_PER_DAY } from '../lib/srs';
import { todayStr } from '../lib/util';
import type { Grade } from '../lib/types';
import { sectionById } from '../data/course';
import { PageTitle, Panel, StatBox } from '../components/Bits';
import { useTrack } from '../components/Layout';

const GRADE_BTNS: { g: Grade; label: string; hint: string; cls: string }[] = [
  { g: 0, label: 'Otra vez', hint: 'hoy', cls: 'border-rose-500/50 text-rose-300 hover:bg-rose-950/40' },
  { g: 3, label: 'Difícil', hint: '', cls: 'border-amber-500/50 text-amber-300 hover:bg-amber-950/40' },
  { g: 4, label: 'Bien', hint: '', cls: 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-950/40' },
  { g: 5, label: 'Fácil', hint: '', cls: 'border-emerald-500/50 text-emerald-300 hover:bg-emerald-950/40' },
];

export default function CardsPage() {
  const srs = useStore((s) => s.srs);
  const day = useStore((s) => s.day);
  const gradeCard = useStore((s) => s.gradeCard);
  const cards = useTrack().flashcards;
  const today = todayStr();

  const [queue, setQueue] = useState<string[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);

  const cardById = useMemo(
    () => new Map(cards.map((c) => [c.id, c])),
    [cards],
  );

  const newUsed = day.date === today ? day.newCards : 0;
  const pending = buildQueue(
    srs,
    cards.map((c) => c.id),
    today,
    NEW_PER_DAY - newUsed,
  );
  const ids = new Set(cards.map((c) => c.id));
  const matureCount = Object.entries(srs).filter(
    ([id, c]) => ids.has(id) && isMature(c),
  ).length;
  const learnedCount = Object.keys(srs).filter((id) => ids.has(id)).length;

  const start = () => {
    setQueue([...pending.due, ...pending.fresh]);
    setDone(0);
    setRevealed(false);
  };

  // ---------------------------------------------------------------- session
  if (queue) {
    const currentId = queue[0];
    if (!currentId) {
      return (
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-pop-in rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-10">
            <div className="text-5xl">🎉</div>
            <h1 className="mt-3 text-xl font-bold text-slate-50">
              Sesión completada
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {done} repasos hechos. El algoritmo SM-2 reprogramará cada carta
              según tu respuesta — vuelve mañana a por las siguientes.
            </p>
            <button
              onClick={() => setQueue(null)}
              className="mt-5 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-emerald-400"
            >
              ← Volver
            </button>
          </div>
        </div>
      );
    }
    const card = cardById.get(currentId)!;
    const cs = srs[currentId];
    const sec = sectionById(card.sectionId);

    const grade = (g: Grade) => {
      gradeCard(currentId, g);
      setQueue((q) => {
        if (!q) return q;
        const rest = q.slice(1);
        return g === 0 ? [...rest, currentId] : rest; // "again" re-queues today
      });
      setDone((d) => d + 1);
      setRevealed(false);
    };

    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">
            Quedan {queue.length} · hechas {done}
          </span>
          <span>
            {sec?.icon} S{sec?.num}
            {cs ? ` · intervalo ${cs.interval}d` : ' · 🆕 nueva'}
          </span>
        </div>

        <div className="rounded-2xl border border-ink-600 bg-ink-900 p-8">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {revealed ? 'Respuesta' : 'Pregunta'}
          </div>
          <div className="min-h-28 text-lg font-medium leading-relaxed text-slate-100">
            {revealed ? card.back : card.front}
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mt-6 w-full rounded-xl bg-cyan-500 py-3 text-sm font-bold text-ink-950 hover:bg-cyan-400"
            >
              Mostrar respuesta
            </button>
          ) : (
            <div className="mt-6 grid grid-cols-4 gap-2">
              {GRADE_BTNS.map((b) => (
                <button
                  key={b.g}
                  onClick={() => grade(b.g)}
                  className={`rounded-xl border bg-ink-850 py-2.5 text-sm font-bold transition-colors ${b.cls}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setQueue(null)}
          className="mt-4 text-xs text-slate-500 hover:text-slate-300"
        >
          ← Salir de la sesión
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------- hub
  const total = pending.due.length + pending.fresh.length;
  return (
    <div>
      <PageTitle
        kicker="Spaced repetition"
        title="🃏 Flashcards"
        sub="Repaso espaciado SM-2: las cartas vuelven justo antes de que las olvides. 10 cartas nuevas al día + las que toquen. En inglés, como el examen."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox icon="📥" value={pending.due.length} label="Para repasar hoy" />
        <StatBox
          icon="🆕"
          value={pending.fresh.length}
          label="Nuevas disponibles"
        />
        <StatBox
          icon="📚"
          value={`${learnedCount}/${cards.length}`}
          label="En aprendizaje"
        />
        <StatBox icon="🧠" value={matureCount} label="Maduras (≥21d)" />
      </div>

      {total > 0 ? (
        <button
          onClick={start}
          className="w-full rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-ink-900 to-cyan-950/40 p-8 text-center transition-colors hover:border-cyan-400"
        >
          <div className="text-3xl">⚡</div>
          <div className="mt-2 text-lg font-bold text-slate-50">
            Empezar sesión · {total} cartas
          </div>
          <div className="mt-1 text-xs text-slate-400">
            +2 XP por carta · cuenta para las misiones diarias
          </div>
        </button>
      ) : (
        <Panel className="text-center">
          <div className="text-3xl">😌</div>
          <div className="mt-2 font-bold text-slate-100">
            Nada pendiente por hoy
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Vuelve mañana — la constancia diaria es lo que fija la memoria a
            largo plazo (y tu racha 🔥).
          </p>
        </Panel>
      )}
    </div>
  );
}
