import { useState } from 'react';
import { useStore } from '../lib/store';
import { levelInfo, nextRank, rankFor, STAKES, CONF_LABEL } from '../lib/xp';
import { lastNDays } from '../lib/util';
import { contentSections, modulesOf, sectionMastery } from '../data/course';
import { useTrack } from '../components/Layout';
import type { Conf } from '../lib/types';
import { Bar, PageTitle, Panel, StatBox } from '../components/Bits';

function Heatmap() {
  const activity = useStore((s) => s.activity);
  const days = lastNDays(28);
  const tone = (xp: number) =>
    xp === 0
      ? 'bg-ink-800'
      : xp < 50
        ? 'bg-cyan-900'
        : xp < 150
          ? 'bg-cyan-600'
          : 'bg-cyan-400';
  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <div
            key={d}
            title={`${d}: ${activity[d] ?? 0} XP`}
            className={`h-6 rounded ${tone(activity[d] ?? 0)}`}
          />
        ))}
      </div>
      <div className="mt-2 text-[10px] text-slate-500">
        Últimos 28 días · intensidad = XP ganada
      </div>
    </div>
  );
}

function Calibration() {
  const cal = useStore((s) => s.calibration);
  const rows: { c: Conf; target: string; note: string }[] = [
    { c: 'low', target: '—', note: 'Apuesta segura: úsala cuando dudes de verdad.' },
    { c: 'med', target: '≥70%', note: 'Tu zona de trabajo habitual.' },
    { c: 'high', target: '≥85%', note: 'Si baja de 85%, estás sobreconfiada: el examen lo castiga.' },
  ];
  return (
    <div className="space-y-3">
      {rows.map(({ c, target, note }) => {
        const v = cal[c];
        const p = v.n === 0 ? null : Math.round((v.c / v.n) * 100);
        return (
          <div key={c}>
            <div className="mb-0.5 flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-200">
                {CONF_LABEL[c]}{' '}
                <span className="font-mono text-slate-500">
                  (+{STAKES[c].win}/−{STAKES[c].lose})
                </span>
              </span>
              <span className="font-mono text-slate-400">
                {p === null ? 'sin datos' : `${p}% de ${v.n}`}
                {target !== '—' && ` · objetivo ${target}`}
              </span>
            </div>
            <Bar
              value={p ?? 0}
              color={
                p === null
                  ? 'bg-ink-700'
                  : c === 'high'
                    ? p >= 85
                      ? 'bg-emerald-400'
                      : 'bg-rose-400'
                    : c === 'med'
                      ? p >= 70
                        ? 'bg-emerald-400'
                        : 'bg-amber-400'
                      : 'bg-cyan-400'
              }
            />
            <div className="mt-0.5 text-[10px] text-slate-500">{note}</div>
          </div>
        );
      })}
      <p className="text-xs leading-relaxed text-slate-400">
        🔮 Esto entrena el <strong className="text-slate-200">lenguaje estimativo (ICD 203)</strong>:
        decir «almost certain» y acertar el 85–95% de las veces ES estar bien
        calibrada — la habilidad central de un analista CTI.
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const s = useStore();
  const track = useTrack();
  const resetAll = useStore((st) => st.resetAll);
  const [confirmReset, setConfirmReset] = useState(false);
  const { level, into, need } = levelInfo(s.xp);
  const rank = rankFor(level, track.ranks);
  const next = nextRank(level, track.ranks);
  const acc =
    s.totals.questions === 0
      ? 0
      : Math.round((s.totals.correct / s.totals.questions) * 100);

  return (
    <div>
      <PageTitle kicker="Expediente de analista" title="📊 Perfil y estadísticas" />

      <Panel className="mb-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-5xl">{rank.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold text-slate-50">
              {rank.name} · Nivel {level}
            </div>
            <div className="text-xs text-slate-400">
              {s.xp.toLocaleString()} XP total
              {next && ` · siguiente rango: ${next.name} (nivel ${next.lvl})`}
            </div>
            <div className="mt-2">
              <Bar value={(into / need) * 100} className="h-2.5" />
              <div className="mt-0.5 font-mono text-[10px] text-slate-500">
                {into}/{need} XP para nivel {level + 1}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox icon="🔥" value={s.streak.current} label={`Racha (mejor ${s.streak.best})`} />
        <StatBox icon="🎯" value={`${acc}%`} label={`Precisión (${s.totals.questions} preguntas)`} />
        <StatBox icon="⚡" value={s.totals.maxCombo} label="Combo máximo" />
        <StatBox icon="🃏" value={s.totals.cards} label="Repasos de cartas" />
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-bold text-slate-100">🔮 Calibración de confianza</h2>
          <Calibration />
        </Panel>
        <Panel>
          <h2 className="mb-3 font-bold text-slate-100">📆 Actividad</h2>
          <Heatmap />
          <div className="mt-4 space-y-2">
            {contentSections(track.id)
              .filter((sec) => modulesOf(sec.id).length > 0)
              .map((sec) => {
              const m = sectionMastery(sec.id, s);
              return (
                <div key={sec.id}>
                  <div className="mb-0.5 flex justify-between text-xs">
                    <span className="text-slate-300">
                      {sec.icon} S{sec.num} {sec.short}
                    </span>
                    <span className="font-mono text-slate-400">{m}%</span>
                  </div>
                  <Bar
                    value={m}
                    color={m >= 80 ? 'bg-emerald-400' : 'bg-cyan-400'}
                  />
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel className="border-rose-900/50">
        <h2 className="mb-2 font-bold text-rose-300">⚠️ Zona de peligro</h2>
        <p className="mb-3 text-xs text-slate-400">
          Borra todo el progreso (XP, racha, SRS, logros, exámenes). No hay
          vuelta atrás.
        </p>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="rounded-lg border border-rose-500/50 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-950/40"
          >
            Resetear progreso…
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                resetAll();
                setConfirmReset(false);
              }}
              className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-rose-400"
            >
              Sí, borrar todo
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-ink-800"
            >
              Cancelar
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}
