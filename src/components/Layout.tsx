import { useEffect, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { levelInfo, nextRank, rankFor } from '../lib/xp';
import { buildQueue, NEW_PER_DAY } from '../lib/srs';
import { todayStr } from '../lib/util';
import { modulesOf, sectionsOf, trackOf } from '../data/course';
import { TRACKS, TRACK_IDS, type TrackMeta } from '../data/tracks';
import { Bar } from './Bits';

/** The active study track (content scope). */
export function useTrack(): TrackMeta {
  const id = useStore((s) => s.track);
  return TRACKS[id];
}

/**
 * Deep-link support: content pages call this so that opening a lesson/quiz/
 * boss/lab from another track switches the active track automatically.
 */
export function useSyncTrack(sectionId: string | undefined) {
  const track = useStore((s) => s.track);
  const setTrack = useStore((s) => s.setTrack);
  useEffect(() => {
    if (!sectionId) return;
    const t = trackOf(sectionId);
    if (t !== track) setTrack(t);
  }, [sectionId, track, setTrack]);
}

function useDueCount(): number {
  const srs = useStore((s) => s.srs);
  const day = useStore((s) => s.day);
  const track = useTrack();
  const today = todayStr();
  const newUsed = day.date === today ? day.newCards : 0;
  const q = buildQueue(
    srs,
    track.flashcards.map((c) => c.id),
    today,
    NEW_PER_DAY - newUsed,
  );
  return q.due.length + q.fresh.length;
}

const navLink = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
    isActive
      ? 'bg-ink-700 font-semibold text-cyan-300'
      : 'text-slate-300 hover:bg-ink-800 hover:text-slate-100'
  }`;

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 mt-5 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
      {children}
    </div>
  );
}

function TrackSwitcher({ compact = false }: { compact?: boolean }) {
  const track = useStore((s) => s.track);
  const setTrack = useStore((s) => s.setTrack);
  const navigate = useNavigate();
  return (
    <div
      role="tablist"
      aria-label="Track de estudio"
      className={`flex shrink-0 rounded-lg border border-ink-600 bg-ink-850 p-0.5 ${
        compact ? '' : 'mx-3 mb-2'
      }`}
    >
      {TRACK_IDS.map((id) => (
        <button
          key={id}
          role="tab"
          aria-selected={track === id}
          onClick={() => {
            if (track !== id) {
              setTrack(id);
              navigate('/');
            }
          }}
          className={`flex-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
            track === id
              ? 'bg-cyan-500 text-ink-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {TRACKS[id].icon} {TRACKS[id].name}
        </button>
      ))}
    </div>
  );
}

function SectionLinks() {
  const lessons = useStore((s) => s.lessons);
  const bosses = useStore((s) => s.bosses);
  const track = useTrack();
  return (
    <>
      {sectionsOf(track.id).map((sec) => {
        const mods = modulesOf(sec.id);
        const done = mods.filter((m) => lessons[m.id]).length;
        const bossDown = (bosses[sec.id] ?? 0) >= 80;
        return (
          <NavLink key={sec.id} to={`/section/${sec.id}`} className={navLink}>
            <span className="text-base leading-none">{sec.icon}</span>
            <span className="flex-1 truncate">
              S{sec.num} · {sec.short}
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              {bossDown && '⚔️ '}
              {done}/{mods.length}
            </span>
          </NavLink>
        );
      })}
    </>
  );
}

function TopBar() {
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const track = useTrack();
  const due = useDueCount();
  const { level, into, need } = levelInfo(xp);
  const rank = rankFor(level, track.ranks);
  const next = nextRank(level, track.ranks);

  return (
    <header className="no-print sticky top-0 z-20 border-b border-ink-700 bg-ink-950/85 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-2.5 md:px-6">
        <Link to="/" className="flex items-center gap-2 md:hidden">
          <span className="text-cyan-400">◆</span>
          <span className="font-mono text-sm font-bold tracking-tight text-slate-100">
            INTELFORGE
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <span
            className="rounded-full border border-ink-600 bg-ink-800 px-3 py-1 text-xs font-semibold text-slate-200"
            title={next ? `Siguiente rango: ${next.name} (nivel ${next.lvl})` : 'Rango máximo'}
          >
            {rank.icon} Lv {level} · {rank.name}
          </span>
          <div className="w-44">
            <Bar value={(into / need) * 100} className="h-2.5" />
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            {into}/{need} XP
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span
            className="rounded-full border border-ink-600 bg-ink-800 px-2.5 py-1 text-xs font-semibold text-amber-300"
            title={`Racha: ${streak.current} día(s) · Mejor: ${streak.best}`}
          >
            🔥 {streak.current}
          </span>
          <span
            className="rounded-full border border-ink-600 bg-ink-800 px-2.5 py-1 text-xs font-semibold text-cyan-200"
            title="Streak freezes: protegen tu racha si fallas un día"
          >
            🧊 {streak.freezes}
          </span>
          <Link
            to="/cards"
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
              due > 0
                ? 'border-emerald-500/50 bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                : 'border-ink-600 bg-ink-800 text-slate-400'
            }`}
            title="Flashcards pendientes hoy"
          >
            🃏 {due}
          </Link>
        </div>
      </div>

      {/* mobile quick nav */}
      <nav className="flex items-center gap-1 overflow-x-auto px-3 pb-2 md:hidden">
        <TrackSwitcher compact />
        {[
          ['/', 'Panel'],
          ...sectionsOf(track.id).map(
            (s) => [`/section/${s.id}`, `S${s.num}`] as [string, string],
          ),
          ['/exam', 'Examen'],
          ['/cards', 'Cards'],
          ['/glossary', 'Glosario'],
          ['/achievements', 'Logros'],
          ['/profile', 'Perfil'],
        ].map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-3 py-1 text-xs ${
                isActive
                  ? 'bg-ink-700 font-semibold text-cyan-300'
                  : 'bg-ink-900 text-slate-400'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const track = useTrack();
  return (
    <div className="min-h-screen">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto border-r border-ink-700 bg-ink-900 md:flex">
        <Link to="/" className="flex items-center gap-2.5 px-5 pb-2 pt-5">
          <span className="text-2xl text-cyan-400">◆</span>
          <div>
            <div className="font-mono text-sm font-bold tracking-tight text-slate-50">
              INTELFORGE
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {track.brand}
            </div>
          </div>
        </Link>
        <TrackSwitcher />

        <nav className="flex-1 px-3 pb-4">
          <GroupLabel>General</GroupLabel>
          <NavLink to="/" end className={navLink}>
            <span className="text-base leading-none">🛰️</span> Panel de mando
          </NavLink>

          <GroupLabel>Curso</GroupLabel>
          <SectionLinks />
          <NavLink to="/exam" className={navLink}>
            <span className="text-base leading-none">⏱️</span> Examen de práctica
          </NavLink>

          <GroupLabel>Entrenamiento</GroupLabel>
          <NavLink to="/cards" className={navLink}>
            <span className="text-base leading-none">🃏</span> Flashcards
          </NavLink>
          <NavLink to="/glossary" className={navLink}>
            <span className="text-base leading-none">📖</span> Glosario · Índice
          </NavLink>
          <NavLink to="/achievements" className={navLink}>
            <span className="text-base leading-none">🏆</span> Logros
          </NavLink>
          <NavLink to="/profile" className={navLink}>
            <span className="text-base leading-none">📊</span> Perfil y stats
          </NavLink>
        </nav>

        <div className="border-t border-ink-700 px-5 py-3 text-[10px] leading-relaxed text-slate-600">
          {track.disclaimer}
        </div>
      </aside>

      <div className="md:pl-64">
        <TopBar />
        <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
