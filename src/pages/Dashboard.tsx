import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import {
  contentSections,
  examReadiness,
  labsOf,
  modulesOf,
  nextModule,
  sectionMastery,
  sectionsOf,
} from '../data/course';
import { questsForDate, DAILY_ALL_BONUS } from '../data/quests';
import { useTrack } from '../components/Layout';
import { todayStr } from '../lib/util';
import { levelInfo, rankFor } from '../lib/xp';
import { Bar, Panel, Ring } from '../components/Bits';

function QuestsPanel() {
  const day = useStore((s) => s.day);
  const today = todayStr();
  const quests = questsForDate(today);
  const live = day.date === today;
  const allDone = live && day.questsAwarded.includes('daily-all');

  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-slate-100">🗓️ Misiones diarias</h2>
        <span className="text-xs text-slate-500">
          {allDone ? `Bonus +${DAILY_ALL_BONUS} XP conseguido ✓` : `Las 3 = +${DAILY_ALL_BONUS} XP extra`}
        </span>
      </div>
      <div className="space-y-3">
        {quests.map((q) => {
          const prog = live ? Math.min(day[q.counter], q.target) : 0;
          const done = live && day.questsAwarded.includes(q.id);
          return (
            <div key={q.id} className="flex items-center gap-3">
              <span className="text-xl">{q.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`text-sm font-medium ${done ? 'text-emerald-300 line-through' : 'text-slate-200'}`}
                  >
                    {q.desc}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {done ? '✓' : `${prog}/${q.target}`}
                  </span>
                </div>
                <Bar
                  value={done ? 100 : (prog / q.target) * 100}
                  color={done ? 'bg-emerald-400' : 'bg-cyan-400'}
                  className="mt-1 h-1.5"
                />
              </div>
              <span className="font-mono text-xs text-amber-300">+{q.xp}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function CampaignPanel() {
  const labs = useStore((s) => s.labs);
  const bosses = useStore((s) => s.bosses);
  const track = useTrack();
  const missions = track.labs
    .filter((l) => l.mission)
    .sort((a, b) => a.mission!.n - b.mission!.n);
  const secs = contentSections(track.id);
  const bossesDown = secs.filter((s) => (bosses[s.id] ?? 0) >= 80).length;

  return (
    <Panel>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
        Campaña narrativa
      </div>
      <h2 className="font-bold text-slate-100">🎖️ {track.campaign.title}</h2>
      <p className="mb-4 mt-1 text-xs leading-relaxed text-slate-400">
        {track.campaign.intro}
      </p>
      <div className="mb-3 space-y-2">
        {missions.map((m) => {
          const done = !!labs[m.id];
          return (
            <Link
              key={m.id}
              to={`/lab/${m.id}`}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                done
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                  : 'border-ink-600 bg-ink-850 text-slate-300 hover:bg-ink-800'
              }`}
            >
              <span className="font-mono text-xs">{done ? '✅' : '◻️'}</span>
              <span className="flex-1">
                Misión {m.mission!.n}: {m.title}
              </span>
              <span className="text-xs text-slate-500">{m.icon}</span>
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Bosses derrotados:</span>
        {secs.map((s) => (
          <span
            key={s.id}
            title={s.boss!.adversary}
            className={
              (bosses[s.id] ?? 0) >= 80 ? '' : 'opacity-25 grayscale'
            }
          >
            ⚔️
          </span>
        ))}
        <span className="ml-auto font-mono">
          {bossesDown}/{secs.length}
        </span>
      </div>
      {bossesDown >= 1 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-semibold text-cyan-300">
            📁 Dossier del caso ({bossesDown}/{secs.length} fragmentos)
          </summary>
          <div className="mt-2 space-y-2">
            {secs
              .filter((s) => (bosses[s.id] ?? 0) >= 80)
              .map((s) => (
                <p
                  key={s.id}
                  className="rounded-lg border border-ink-700 bg-ink-850 p-3 font-mono text-[11px] leading-relaxed text-slate-300"
                >
                  {s.boss!.dossier}
                </p>
              ))}
          </div>
        </details>
      )}
    </Panel>
  );
}

export default function Dashboard() {
  const s = useStore();
  const track = useTrack();
  const { level } = levelInfo(s.xp);
  const rank = rankFor(level, track.ranks);
  const readiness = examReadiness(track.id, s);
  const next = nextModule(track.id, s);

  return (
    <div>
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
          Centro de operaciones
        </div>
        <h1 className="text-2xl font-bold text-slate-50">
          Hola, {rank.name} {rank.icon}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {track.tagline}
        </p>
      </div>

      {/* top row: continue + readiness */}
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Link
          to={next ? `/learn/${next.id}` : '/exam'}
          className="group rounded-xl border border-cyan-500/40 bg-gradient-to-br from-ink-900 to-cyan-950/40 p-5 transition-colors hover:border-cyan-400 md:col-span-2"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
            {next ? 'Continuar estudio' : 'Todo el temario completado'}
          </div>
          <div className="mt-2 text-lg font-bold text-slate-50 group-hover:text-cyan-200">
            {next ? `📖 ${next.title}` : '⏱️ Ve a por el examen de práctica'}
          </div>
          {next && (
            <div className="mt-1 text-xs text-slate-400">
              {sectionsOf(track.id).find((x) => x.id === next.sectionId)?.title}{' '}
              · {next.minutes} min
            </div>
          )}
        </Link>
        <div className="flex items-center justify-center gap-4 rounded-xl border border-ink-700 bg-ink-900 p-4">
          <Ring
            value={readiness}
            size={84}
            stroke={8}
            color={readiness >= 75 ? '#34d399' : readiness >= 40 ? '#22d3ee' : '#64748b'}
          />
          <div>
            <div className="text-sm font-bold text-slate-100">
              Exam readiness
            </div>
            <div className="text-xs leading-relaxed text-slate-400">
              Lecciones, quizzes,
              <br />
              labs y bosses
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <QuestsPanel />
        <CampaignPanel />
      </div>

      {/* sections */}
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
        Secciones del curso
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {sectionsOf(track.id).map((sec) => {
          const mods = modulesOf(sec.id);
          const labs = labsOf(sec.id);
          if (mods.length === 0 && sec.boss) {
            return (
              <div
                key={sec.id}
                className="flex items-center gap-4 rounded-xl border border-dashed border-ink-700 bg-ink-900/50 p-4 opacity-70"
              >
                <Ring value={0} size={56} stroke={5} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-slate-300">
                    {sec.icon} S{sec.num} · {sec.short}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    Próximamente · contenido en preparación
                  </div>
                </div>
              </div>
            );
          }
          const lessonsDone = mods.filter((m) => s.lessons[m.id]).length;
          const labsDone = labs.filter((l) => s.labs[l.id]).length;
          const mastery = sectionMastery(sec.id, s);
          const bossDown = (s.bosses[sec.id] ?? 0) >= 80;
          return (
            <Link
              key={sec.id}
              to={`/section/${sec.id}`}
              className="flex items-center gap-4 rounded-xl border border-ink-700 bg-ink-900 p-4 transition-colors hover:border-ink-500 hover:bg-ink-850"
            >
              <Ring value={mastery} size={56} stroke={5} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-slate-100">
                  {sec.icon} S{sec.num} · {sec.short}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {lessonsDone}/{mods.length} lecciones
                  {labs.length > 0 && <> · {labsDone}/{labs.length} labs</>}
                  {sec.boss && (
                    <>
                      {' '}
                      ·{' '}
                      <span className={bossDown ? 'text-emerald-400' : ''}>
                        {bossDown ? '⚔️ boss ✓' : '☠️ boss'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span className="text-slate-600">→</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
