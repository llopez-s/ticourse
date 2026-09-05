import { Link, useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import {
  labsOf,
  modulesOf,
  sectionById,
  sectionMastery,
} from '../data/course';
import { Bar, PageTitle, Panel, Ring } from '../components/Bits';
import { useSyncTrack } from '../components/Layout';

export default function SectionPage() {
  const { id } = useParams();
  const s = useStore();
  const section = sectionById(id ?? '');
  useSyncTrack(section?.id);
  if (!section) return <p className="text-slate-400">Sección no encontrada.</p>;

  const mods = modulesOf(section.id);
  const labs = labsOf(section.id);
  const mastery = sectionMastery(section.id, s);
  const bossBest = s.bosses[section.id] ?? 0;
  const bossDown = bossBest >= 80;

  return (
    <div>
      <PageTitle
        kicker={`Sección ${section.num}`}
        title={`${section.icon} ${section.title}`}
        sub={section.subtitle}
      />

      <Panel className="mb-5 flex items-center gap-5">
        <Ring value={mastery} size={72} stroke={7} />
        <div className="flex-1 text-sm text-slate-300">
          <div className="font-semibold text-slate-100">Dominio de sección</div>
          <div className="mt-1 text-xs text-slate-400">
            Se calcula con lecciones (40%), mejores quizzes (30%), labs (15%) y
            boss (15%). Súbelo por encima del 80% antes del examen.
          </div>
        </div>
      </Panel>

      {/* lessons */}
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
        📖 Teoría
      </h2>
      {mods.length === 0 && (
        <Panel className="mb-6">
          <div className="text-sm font-bold text-slate-100">
            🚧 Contenido en preparación
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Las lecciones de esta sección llegarán en una próxima actualización.
            Mientras tanto, avanza con las secciones disponibles.
          </p>
        </Panel>
      )}
      <div className="mb-6 space-y-2">
        {mods.map((m, i) => {
          const done = !!s.lessons[m.id];
          const best = s.quizBest[m.id];
          return (
            <div
              key={m.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                  done
                    ? 'bg-emerald-500 text-ink-950'
                    : 'bg-ink-700 text-slate-400'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/learn/${m.id}`}
                  className="block truncate text-sm font-semibold text-slate-100 hover:text-cyan-300"
                >
                  {m.title}
                </Link>
                <span className="text-xs text-slate-500">{m.minutes} min</span>
              </div>
              <Link
                to={`/learn/${m.id}`}
                className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-ink-800"
              >
                {done ? 'Repasar' : 'Estudiar'}
              </Link>
              {m.quiz.length > 0 && (
                <Link
                  to={`/quiz/${m.id}`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    best !== undefined
                      ? best >= 80
                        ? 'border border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                        : 'border border-amber-500/40 bg-amber-950/40 text-amber-300'
                      : 'bg-cyan-500 text-ink-950 hover:bg-cyan-400'
                  }`}
                >
                  Quiz{best !== undefined ? ` · ${best}%` : ''}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* labs */}
      {labs.length > 0 && (
        <>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            🧪 Labs
          </h2>
          <div className="mb-6 space-y-2">
            {labs.map((l) => {
              const done = !!s.labs[l.id];
              return (
                <Link
                  key={l.id}
                  to={`/lab/${l.id}`}
                  className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 transition-colors hover:border-ink-500 hover:bg-ink-850"
                >
                  <span className="text-xl">{l.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                      {l.title}
                      {l.mission && (
                        <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          🎖️ Misión {l.mission.n}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {l.minutes} min · +{l.xp} XP
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${done ? 'text-emerald-400' : 'text-slate-600'}`}
                  >
                    {done ? '✓ completado' : '→'}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* boss */}
      {section.boss && (
        <>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            ☠️ Boss de sección
          </h2>
          <Link
            to={`/boss/${section.id}`}
            className={`block rounded-2xl border p-5 transition-colors ${
              bossDown
                ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400'
                : 'animate-boss-glow border-rose-500/40 bg-gradient-to-br from-ink-900 to-rose-950/30 hover:border-rose-400'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-rose-400">
              Operation {section.boss.codename}
            </div>
            <div className="mt-1 text-lg font-black text-slate-50">
              {bossDown ? '⚔️ ' : '☠️ '}
              {section.boss.adversary}
              {bossDown && (
                <span className="ml-2 text-sm font-semibold text-emerald-400">
                  derrotado · {bossBest}%
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {section.boss.flavor}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span>12 preguntas</span>·<span>6:00 min</span>·
              <span>≥80% para vencer</span>·<span>+200 XP & 🧊 freeze</span>
            </div>
            {bossBest > 0 && !bossDown && (
              <div className="mt-3">
                <div className="mb-1 text-xs text-slate-500">
                  Mejor intento: {bossBest}%
                </div>
                <Bar value={bossBest} color="bg-rose-400" />
              </div>
            )}
          </Link>
        </>
      )}

      {section.boss === null && mods.length > 0 && (
        <Panel className="mt-2">
          <div className="text-sm font-bold text-slate-100">
            ⏱️ Examen de práctica
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Cuando termines las lecciones de esta sección, ve al examen
            cronometrado con desglose por dominios.
          </p>
          <Link
            to="/exam"
            className="mt-3 inline-block rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400"
          >
            Ir al examen →
          </Link>
        </Panel>
      )}
    </div>
  );
}
