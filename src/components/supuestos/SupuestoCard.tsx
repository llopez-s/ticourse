import { Link } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { supuestoXp } from '../../lib/xp';
import type { SupuestoMeta } from '../../lib/supuesto';

/** Nota con coma decimal: 7,2. */
export const formatGrade = (n: number) => n.toFixed(1).replace('.', ',');

export default function SupuestoCard({ meta }: { meta: SupuestoMeta }) {
  const best = useStore((s) => s.supuestos[meta.id]);
  const practical = useStore((s) => s.practical);
  const earned = (['practice', 'exam'] as const).reduce(
    (sum, mode) => sum + (practical[`${meta.id}:${mode}`] ?? 0),
    0,
  );
  const possible = supuestoXp(meta, 'practice') + supuestoXp(meta, 'exam');
  const grade = (b?: { grade: number }) => (b ? formatGrade(b.grade) : 'sin hacer');
  const done = !!best?.exam && best.exam.grade >= 5;

  return (
    <Link
      to={`/supuesto/${meta.id}`}
      className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 transition-colors hover:border-ink-500 hover:bg-ink-850"
    >
      <span className="text-xl">{meta.integrator ? '🧩' : '🗂️'}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          {meta.title}
          {meta.integrator && (
            <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              Integrador
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500">
          {meta.minutes} min · Simulacro: {grade(best?.exam)} · Práctica: {grade(best?.practice)}
        </div>
        <div className="text-xs text-slate-500">
          🛠️ {earned} / {possible} XP práctico
        </div>
      </div>
      <span className={`text-xs font-bold ${done ? 'text-emerald-400' : 'text-slate-600'}`}>
        {done ? '✓ aprobado' : '→'}
      </span>
    </Link>
  );
}
