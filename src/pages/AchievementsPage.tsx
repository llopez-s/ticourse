import { useStore } from '../lib/store';
import { ACHIEVEMENTS } from '../data/achievements';
import { PageTitle } from '../components/Bits';

export default function AchievementsPage() {
  const unlocked = useStore((s) => s.achievements);
  const count = Object.keys(unlocked).length;

  return (
    <div>
      <PageTitle
        kicker="Sala de trofeos"
        title="🏆 Logros"
        sub={`${count}/${ACHIEVEMENTS.length} desbloqueados. Cada logro otorga XP extra.`}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a) => {
          const at = unlocked[a.id];
          return (
            <div
              key={a.id}
              className={`flex items-start gap-3 rounded-xl border p-4 ${
                at
                  ? 'border-amber-500/40 bg-gradient-to-br from-ink-900 to-amber-950/30'
                  : 'border-ink-700 bg-ink-900 opacity-60 grayscale'
              }`}
            >
              <span className="text-3xl">{a.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-100">
                  {a.title}
                  <span className="ml-2 font-mono text-[10px] text-amber-300">
                    +{a.xp} XP
                  </span>
                </div>
                <div className="mt-0.5 text-xs leading-relaxed text-slate-400">
                  {a.desc}
                </div>
                {at && (
                  <div className="mt-1 font-mono text-[10px] text-slate-500">
                    ✓ {new Date(at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
