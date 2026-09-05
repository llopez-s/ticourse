import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { moduleById, sectionById } from '../data/course';
import { useStore } from '../lib/store';
import QuizEngine from '../components/QuizEngine';
import { shuffle } from '../lib/util';
import { PageTitle } from '../components/Bits';
import { useSyncTrack } from '../components/Layout';

export default function QuizPage() {
  const { moduleId } = useParams();
  const mod = moduleById(moduleId ?? '');
  const finishQuiz = useStore((s) => s.finishQuiz);
  const [attempt, setAttempt] = useState(0);
  useSyncTrack(mod?.sectionId);

  const questions = useMemo(
    () => (mod ? shuffle(mod.quiz, `${mod.id}-${attempt}-${Date.now()}`) : []),
    [mod, attempt],
  );

  if (!mod || mod.quiz.length === 0)
    return <p className="text-slate-400">Quiz no encontrado.</p>;

  const section = sectionById(mod.sectionId);

  return (
    <div>
      <PageTitle
        kicker={`Quiz · S${section?.num}`}
        title={`🎯 ${mod.title}`}
        sub="Apuesta tu confianza en cada respuesta: gana más XP si aciertas con confianza alta, pero pierdes si fallas. Así entrenas tu calibración estimativa."
      />
      <QuizEngine
        key={attempt}
        questions={questions}
        mode="quiz"
        onFinish={(r) => finishQuiz(mod.id, r.pct, r.maxCombo)}
        onRetry={() => setAttempt((a) => a + 1)}
        resultExtra={() => (
          <div className="mb-4 flex flex-wrap gap-2">
            <Link
              to={`/section/${mod.sectionId}`}
              className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-ink-800"
            >
              ← Volver a la sección
            </Link>
          </div>
        )}
      />
    </div>
  );
}
