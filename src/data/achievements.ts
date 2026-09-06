import type { AchievementDef, ProgressSnapshot, TrackId } from '../lib/types';
import { isMature } from '../lib/srs';
import { contentSections, moduleById, modulesOfTrack, trackOf } from './course';
import { TRACKS } from './tracks';

const count = (r: Record<string, unknown>) => Object.keys(r).length;
const bossesBeaten = (s: ProgressSnapshot) =>
  Object.values(s.bosses).filter((p) => p >= 80).length;

// ---- per-track helpers (progress maps are keyed by globally unique ids) ----
const lessonsIn = (s: ProgressSnapshot, t: TrackId) =>
  Object.keys(s.lessons).filter((id) => {
    const m = moduleById(id);
    return m !== undefined && trackOf(m.sectionId) === t;
  }).length;
const labsIn = (s: ProgressSnapshot, t: TrackId) =>
  Object.keys(s.labs).filter((id) => TRACKS[t].labs.some((l) => l.id === id))
    .length;
const bossesBeatenIn = (s: ProgressSnapshot, t: TrackId) =>
  contentSections(t).filter((sec) => (s.bosses[sec.id] ?? 0) >= 80).length;

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-lesson',
    icon: '🌱',
    title: 'Primer paso',
    desc: 'Completa tu primera lección',
    xp: 25,
    test: (s) => count(s.lessons) >= 1,
  },
  {
    id: 'lab-rat',
    icon: '🧪',
    title: 'Rata de laboratorio',
    desc: 'Completa tu primer lab',
    xp: 25,
    test: (s) => count(s.labs) >= 1,
  },
  {
    id: 'scholar',
    icon: '📚',
    title: 'Estudiosa',
    desc: 'Completa 10 lecciones',
    xp: 50,
    test: (s) => count(s.lessons) >= 10,
  },
  {
    id: 'bookworm',
    icon: '🎓',
    title: 'Teoría dominada',
    desc: `Completa las ${modulesOfTrack('gcti').length} lecciones del curso GCTI`,
    xp: 150,
    test: (s) => lessonsIn(s, 'gcti') >= modulesOfTrack('gcti').length,
  },
  {
    id: 'all-labs',
    icon: '🔬',
    title: 'Operadora de campo',
    desc: `Completa los ${TRACKS.gcti.labs.length} labs del curso GCTI`,
    xp: 150,
    test: (s) => labsIn(s, 'gcti') >= TRACKS.gcti.labs.length,
  },
  {
    id: 'sharpshooter',
    icon: '🎯',
    title: 'Pleno',
    desc: 'Consigue un 100% en un quiz',
    xp: 40,
    test: (s) => s.totals.perfectQuizzes >= 1,
  },
  {
    id: 'combo-5',
    icon: '🔥',
    title: 'En racha',
    desc: 'Combo de 5 respuestas correctas seguidas',
    xp: 30,
    test: (s) => s.totals.maxCombo >= 5,
  },
  {
    id: 'combo-10',
    icon: '⚡',
    title: 'Imparable',
    desc: 'Combo de 10 respuestas correctas seguidas',
    xp: 60,
    test: (s) => s.totals.maxCombo >= 10,
  },
  {
    id: 'high-roller',
    icon: '🎰',
    title: 'High roller',
    desc: '25 aciertos apostando confianza alta',
    xp: 50,
    test: (s) => s.totals.highConfCorrect >= 25,
  },
  {
    id: 'well-calibrated',
    icon: '🔮',
    title: 'Bien calibrada',
    desc: '≥85% de acierto en 20+ apuestas de confianza alta',
    xp: 80,
    test: (s) =>
      s.calibration.high.n >= 20 &&
      s.calibration.high.c / s.calibration.high.n >= 0.85,
  },
  {
    id: 'boss-slayer',
    icon: '⚔️',
    title: 'Caza-bosses',
    desc: 'Derrota a tu primer boss de sección',
    xp: 50,
    test: (s) => bossesBeaten(s) >= 1,
  },
  {
    id: 'campaign-hero',
    icon: '🏆',
    title: 'Operación VELVET CICADA',
    desc: 'Derrota a los 5 bosses GCTI y cierra la campaña',
    xp: 200,
    test: (s) => bossesBeatenIn(s, 'gcti') >= 5,
  },
  {
    id: 'streak-3',
    icon: '🕯️',
    title: 'Constancia',
    desc: 'Racha de 3 días',
    xp: 25,
    test: (s) => s.streak.best >= 3,
  },
  {
    id: 'streak-7',
    icon: '🔥',
    title: 'Semana de hierro',
    desc: 'Racha de 7 días',
    xp: 50,
    test: (s) => s.streak.best >= 7,
  },
  {
    id: 'streak-14',
    icon: '🌋',
    title: 'Dos semanas',
    desc: 'Racha de 14 días',
    xp: 80,
    test: (s) => s.streak.best >= 14,
  },
  {
    id: 'streak-30',
    icon: '☄️',
    title: 'Mes imparable',
    desc: 'Racha de 30 días',
    xp: 150,
    test: (s) => s.streak.best >= 30,
  },
  {
    id: 'card-shark',
    icon: '🃏',
    title: 'Tiburón de cartas',
    desc: 'Repasa 100 flashcards',
    xp: 50,
    test: (s) => s.totals.cards >= 100,
  },
  {
    id: 'memory-master',
    icon: '🧠',
    title: 'Memoria a largo plazo',
    desc: '25 flashcards maduras (intervalo ≥ 21 días)',
    xp: 80,
    test: (s) => Object.values(s.srs).filter((c) => isMature(c)).length >= 25,
  },
  {
    id: 'centurion',
    icon: '💯',
    title: 'Centuriona',
    desc: '100 respuestas correctas acumuladas',
    xp: 50,
    test: (s) => s.totals.correct >= 100,
  },
  {
    id: 'quest-runner',
    icon: '🏃‍♀️',
    title: 'Cazarrecompensas',
    desc: 'Completa 10 misiones diarias',
    xp: 50,
    test: (s) => s.totals.questsDone >= 10,
  },
  {
    id: 'pivot-master',
    icon: '🕸️',
    title: 'Maestra del pivote',
    desc: 'Completa el lab Pivot Hunt',
    xp: 40,
    test: (s) => !!s.labs['lab3a'],
  },
  {
    id: 'exam-ready',
    icon: '📋',
    title: 'Lista para el examen',
    desc: '≥75% en un examen de práctica',
    xp: 100,
    test: (s) => s.exams.some((e) => e.pct >= 75),
  },
  {
    id: 'gcti-slayer',
    icon: '🐉',
    title: 'GCTI slayer',
    desc: '≥85% en un examen de práctica',
    xp: 150,
    test: (s) => s.exams.some((e) => e.pct >= 85),
  },

  // ---- Security+ track ----------------------------------------------------
  {
    id: 'sp-first-lesson',
    icon: '🛡️',
    title: 'Primer parche',
    desc: 'Completa tu primera lección de Security+',
    xp: 25,
    test: (s) => lessonsIn(s, 'secplus') >= 1,
  },
  {
    id: 'sp-campaign',
    icon: '⚓',
    title: 'Operación GLASS HARBOR',
    desc: 'Derrota a los 5 bosses de Security+',
    xp: 200,
    test: (s) => bossesBeatenIn(s, 'secplus') >= 5,
  },
  {
    id: 'sp-exam-ready',
    icon: '🎖️',
    title: '750/900',
    desc: '≥83% en un simulacro Security+',
    xp: 150,
    test: (s) => s.exams.some((e) => e.track === 'secplus' && e.pct >= 83),
  },

  // ---- Placement test -------------------------------------------------------
  {
    id: 'pl-tested',
    icon: '🎯',
    title: 'Autoevaluado',
    desc: 'Completa un bloque de la prueba de nivel',
    xp: 25,
    test: (s) => s.placement.length > 0,
  },
  {
    id: 'pl-shortcut',
    icon: '⏩',
    title: 'Atajo ganado',
    desc: 'Ten convalidaciones activas en 3 secciones',
    xp: 100,
    test: (s) =>
      new Set(
        Object.entries(s.exempt)
          .filter(([, e]) => e.status === 'exempt')
          .map(([id]) => moduleById(id)?.sectionId)
          .filter(Boolean),
      ).size >= 3,
  },
];
