import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Conf,
  DayState,
  ExamResult,
  Grade,
  PlacementResult,
  ProgressSnapshot,
  TrackId,
} from './types';
import { levelInfo, STAKES, XP } from './xp';
import { review } from './srs';
import { dayDiff, todayStr } from './util';
import { exemptionsFor, gradePlacement, revocationsFor } from './placement';
import { ACHIEVEMENTS } from '../data/achievements';
import { modulesOf, placementBlockById, trackOf } from '../data/course';
import { DAILY_ALL_BONUS, questsForDate } from '../data/quests';

// ---------------------------------------------------------------------------
// Transient toast store (not persisted)
// ---------------------------------------------------------------------------

export interface ToastMsg {
  id: number;
  kind: 'xp' | 'level' | 'ach' | 'quest' | 'info';
  icon?: string;
  title: string;
  sub?: string;
  amount?: number;
  ts: number;
}

interface ToastStore {
  list: ToastMsg[];
  push: (t: Omit<ToastMsg, 'id' | 'ts'>) => void;
  remove: (id: number) => void;
}

let toastSeq = 1;

export const useToasts = create<ToastStore>((set, get) => ({
  list: [],
  push: (t) => {
    // Coalesce rapid-fire XP toasts into one running total
    if (t.kind === 'xp') {
      const existing = get().list.find((x) => x.kind === 'xp');
      if (existing) {
        set({
          list: get().list.map((x) =>
            x.id === existing.id
              ? { ...x, amount: (x.amount ?? 0) + (t.amount ?? 0), ts: Date.now() }
              : x,
          ),
        });
        return;
      }
    }
    set({ list: [...get().list, { ...t, id: toastSeq++, ts: Date.now() }] });
  },
  remove: (id) => set({ list: get().list.filter((t) => t.id !== id) }),
}));

const toast = (t: Omit<ToastMsg, 'id' | 'ts'>) => useToasts.getState().push(t);

// ---------------------------------------------------------------------------
// Persistent progress store
// ---------------------------------------------------------------------------

function freshDay(date: string): DayState {
  return {
    date,
    lessons: 0,
    questions: 0,
    correct: 0,
    cards: 0,
    labs: 0,
    highConfCorrect: 0,
    xpEarned: 0,
    newCards: 0,
    questsAwarded: [],
  };
}

function initialState(): ProgressSnapshot {
  return {
    track: 'gcti',
    xp: 0,
    streak: { current: 0, best: 0, lastDay: null, freezes: 1 },
    activity: {},
    lessons: {},
    quizBest: {},
    labs: {},
    bosses: {},
    exams: [],
    srs: {},
    calibration: {
      low: { n: 0, c: 0 },
      med: { n: 0, c: 0 },
      high: { n: 0, c: 0 },
    },
    totals: {
      questions: 0,
      correct: 0,
      cards: 0,
      maxCombo: 0,
      highConfCorrect: 0,
      perfectQuizzes: 0,
      questsDone: 0,
      checkpoints: 0,
    },
    achievements: {},
    exempt: {},
    placement: [],
    day: freshDay(todayStr()),
  };
}

export interface Store extends ProgressSnapshot {
  /** Switch the active study track (content scope); XP/streak are shared. */
  setTrack: (t: TrackId) => void;
  /** Add (or subtract) XP. label: undefined = plain toast, null = silent, string = toast subtitle. */
  addXp: (n: number, label?: string | null) => void;
  recordAnswer: (
    correct: boolean,
    conf: Conf,
    opts?: {
      combo?: number;
      stakes?: boolean;
      /** false = do not touch calibration (no confidence bet was placed) */
      calibrated?: boolean;
      /** false = the answer pays no XP (placement test) */
      xp?: boolean;
    },
  ) => number;
  awardCheckpoint: () => void;
  completeLesson: (id: string) => void;
  finishQuiz: (moduleId: string, scorePct: number, maxCombo: number) => void;
  completeLab: (id: string, xp: number) => void;
  finishBoss: (sectionId: string, scorePct: number) => boolean;
  recordExam: (r: ExamResult) => void;
  /** Record a placement attempt. Grants nothing — cashing in is a separate step. */
  finishPlacement: (blockId: string, correct: number, total: number) => PlacementResult;
  /** Cash in a passed block: convalidate the section's unstudied theory. */
  grantExemption: (blockId: string) => void;
  /** Undo a section's convalidation, leaving tombstones so sync respects it. */
  revokeExemption: (sectionId: string) => void;
  gradeCard: (id: string, grade: Grade) => void;
  resetAll: () => void;
  _check: () => void;
}

/**
 * Persist migrations, applied cumulatively so an old blob passes through every
 * step. v1 (single GCTI track) → v2: add the active `track` and stamp every
 * stored exam. v2 → v3: add the placement test's `exempt` and `placement`.
 */
export function migrateProgress(
  persisted: unknown,
  version: number,
): Partial<ProgressSnapshot> {
  let p = (persisted ?? {}) as Partial<ProgressSnapshot> & {
    exams?: Partial<ExamResult>[];
  };
  if (version < 2) {
    p = {
      ...p,
      track: 'gcti',
      exams: (p.exams ?? []).map((e) => ({ ...e, track: 'gcti' }) as ExamResult),
    };
  }
  if (version < 3) {
    p = { ...p, exempt: p.exempt ?? {}, placement: p.placement ?? [] };
  }
  return p;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState(),

      setTrack: (t) => set({ track: t }),

      addXp: (n, label) => {
        const s = get();
        const t = todayStr();
        const day = s.day.date === t ? { ...s.day } : freshDay(t);

        // streak upkeep — any tracked activity counts
        const streak = { ...s.streak };
        if (streak.lastDay !== t) {
          const diff = streak.lastDay ? dayDiff(streak.lastDay, t) : Infinity;
          if (diff === 1) {
            streak.current += 1;
          } else if (diff === 2 && streak.freezes > 0) {
            streak.freezes -= 1;
            streak.current += 1;
            toast({
              kind: 'info',
              icon: '🧊',
              title: 'Streak freeze usado',
              sub: 'Tu racha sobrevivió al día perdido',
            });
          } else {
            streak.current = 1;
          }
          streak.best = Math.max(streak.best, streak.current);
          streak.lastDay = t;
        }

        const before = levelInfo(s.xp).level;
        const xp = Math.max(0, s.xp + n);
        const after = levelInfo(xp).level;
        if (n > 0) day.xpEarned += n;
        const activity = {
          ...s.activity,
          [t]: (s.activity[t] ?? 0) + Math.max(0, n),
        };
        set({ xp, streak, day, activity });

        if (n !== 0 && label !== null) {
          toast({ kind: 'xp', title: '', amount: n, sub: label });
        }
        if (after > before) {
          toast({
            kind: 'level',
            icon: '🚀',
            title: `¡Nivel ${after}!`,
            sub: 'Sigue así, analista',
          });
        }
        get()._check();
      },

      recordAnswer: (correct, conf, opts = {}) => {
        const { combo = 0, stakes = true, calibrated = true, xp = true } = opts;
        const s = get();
        const t = todayStr();
        const day0 = s.day.date === t ? s.day : freshDay(t);
        const day = {
          ...day0,
          questions: day0.questions + 1,
          correct: day0.correct + (correct ? 1 : 0),
          highConfCorrect:
            day0.highConfCorrect + (correct && conf === 'high' ? 1 : 0),
        };
        const calibration = calibrated
          ? {
              ...s.calibration,
              [conf]: {
                n: s.calibration[conf].n + 1,
                c: s.calibration[conf].c + (correct ? 1 : 0),
              },
            }
          : s.calibration;
        const totals = {
          ...s.totals,
          questions: s.totals.questions + 1,
          correct: s.totals.correct + (correct ? 1 : 0),
          highConfCorrect:
            s.totals.highConfCorrect + (correct && conf === 'high' ? 1 : 0),
          maxCombo: Math.max(s.totals.maxCombo, combo),
        };
        set({ day, calibration, totals });

        let delta: number;
        if (!xp) {
          delta = 0; // placement: measured, not paid
        } else if (stakes) {
          delta = correct ? STAKES[conf].win : -STAKES[conf].lose;
          if (correct && combo >= 5) delta += 10;
          else if (correct && combo >= 3) delta += 5;
        } else {
          delta = correct ? 5 : 0; // exam mode: flat, no losses
        }
        get().addXp(delta, null); // addXp(0) still keeps the streak alive
        return delta;
      },

      awardCheckpoint: () => {
        const s = get();
        set({
          totals: { ...s.totals, checkpoints: s.totals.checkpoints + 1 },
        });
        get().addXp(XP.checkpoint, 'Checkpoint');
      },

      completeLesson: (id) => {
        const s = get();
        if (s.lessons[id]) return;
        const t = todayStr();
        const day0 = s.day.date === t ? s.day : freshDay(t);
        set({
          lessons: { ...s.lessons, [id]: true },
          day: { ...day0, lessons: day0.lessons + 1 },
        });
        get().addXp(XP.lesson, 'Lección completada');
      },

      finishQuiz: (moduleId, scorePct, maxCombo) => {
        const s = get();
        const prev = s.quizBest[moduleId] ?? -1;
        set({
          quizBest: {
            ...s.quizBest,
            [moduleId]: Math.max(prev, scorePct),
          },
          totals: {
            ...s.totals,
            maxCombo: Math.max(s.totals.maxCombo, maxCombo),
            perfectQuizzes:
              s.totals.perfectQuizzes + (scorePct === 100 ? 1 : 0),
          },
        });
        if (scorePct >= 80 && prev < 80) {
          get().addXp(XP.quizPass, 'Quiz superado');
        } else {
          get()._check();
        }
      },

      completeLab: (id, xp) => {
        const s = get();
        if (s.labs[id]) return;
        const t = todayStr();
        const day0 = s.day.date === t ? s.day : freshDay(t);
        set({
          labs: { ...s.labs, [id]: true },
          day: { ...day0, labs: day0.labs + 1 },
        });
        get().addXp(xp, 'Lab completado');
      },

      finishBoss: (sectionId, scorePct) => {
        const s = get();
        const prev = s.bosses[sectionId] ?? 0;
        set({
          bosses: { ...s.bosses, [sectionId]: Math.max(prev, scorePct) },
        });
        const defeated = scorePct >= 80;
        if (defeated && prev < 80) {
          const st = get().streak;
          set({ streak: { ...st, freezes: Math.min(3, st.freezes + 1) } });
          toast({
            kind: 'info',
            icon: '🧊',
            title: '+1 Streak freeze',
            sub: 'Recompensa por derrotar al boss',
          });
          get().addXp(XP.boss, 'Boss derrotado');
        } else {
          get()._check();
        }
        return defeated;
      },

      recordExam: (r) => {
        const s = get();
        set({ exams: [...s.exams, r] });
        get().addXp(
          r.pct >= 75 ? XP.examPass : XP.examTry,
          'Examen de práctica',
        );
      },

      finishPlacement: (blockId, correct, total) => {
        const s = get();
        const block = placementBlockById(blockId);
        if (!block) {
          throw new Error(`unknown placement block: ${blockId}`);
        }
        const track = trackOf(block.sectionId);
        const r = gradePlacement(
          blockId,
          block.sectionId,
          track,
          correct,
          total,
          new Date().toISOString(),
        );
        const first = !s.placement.some((p) => p.track === track);
        set({ placement: [...s.placement, r] });
        if (first) get().addXp(XP.placement, 'Prueba de nivel');
        else get()._check();
        return r;
      },

      grantExemption: (blockId) => {
        const s = get();
        const block = placementBlockById(blockId);
        if (!block) return;
        // Any passing attempt can be cashed in, not only the most recent one.
        // The spec lets a learner pass and then choose to study the section
        // anyway; if they change their mind and retake the block worse, the
        // pass they already earned must still be spendable. The best pass wins,
        // so a later, weaker retake never drags the exemption score down.
        const best = s.placement.reduce<PlacementResult | null>(
          (acc, p) =>
            p.blockId === blockId && p.passed && (!acc || p.pct > acc.pct)
              ? p
              : acc,
          null,
        );
        if (!best) return;
        const ids = modulesOf(block.sectionId).map((m) => m.id);
        const added = exemptionsFor(
          ids,
          s.lessons,
          blockId,
          best.pct,
          new Date().toISOString(),
        );
        if (Object.keys(added).length === 0) return;
        set({ exempt: { ...s.exempt, ...added } });
        toast({
          kind: 'info',
          icon: '⏩',
          title: 'Sección convalidada',
          sub: `${Object.keys(added).length} lecciones dadas por vistas`,
        });
        get()._check();
      },

      revokeExemption: (sectionId) => {
        const s = get();
        const ids = modulesOf(sectionId).map((m) => m.id);
        const undone = revocationsFor(s.exempt, ids, new Date().toISOString());
        if (Object.keys(undone).length === 0) return;
        set({ exempt: { ...s.exempt, ...undone } });
      },

      gradeCard: (id, grade) => {
        const s = get();
        const t = todayStr();
        const prevCs = s.srs[id];
        const isNew = !prevCs;
        const cs = review(prevCs, grade, t);
        const day0 = s.day.date === t ? s.day : freshDay(t);
        set({
          srs: { ...s.srs, [id]: cs },
          day: {
            ...day0,
            cards: day0.cards + 1,
            newCards: day0.newCards + (isNew ? 1 : 0),
          },
          totals: { ...s.totals, cards: s.totals.cards + 1 },
        });
        get().addXp(XP.card, null);
      },

      resetAll: () => set({ ...initialState(), track: get().track }),

      _check: () => {
        // --- daily quests ---
        const s = get();
        const quests = questsForDate(s.day.date);
        let day = s.day;
        let questsDone = s.totals.questsDone;
        let bonus = 0;
        let changed = false;
        for (const q of quests) {
          if (!day.questsAwarded.includes(q.id) && day[q.counter] >= q.target) {
            if (!changed) {
              day = { ...day, questsAwarded: [...day.questsAwarded] };
              changed = true;
            }
            day.questsAwarded.push(q.id);
            questsDone += 1;
            bonus += q.xp;
            toast({
              kind: 'quest',
              icon: q.icon,
              title: 'Misión diaria completada',
              sub: `${q.title} · +${q.xp} XP`,
            });
          }
        }
        if (
          changed &&
          quests.every((q) => day.questsAwarded.includes(q.id)) &&
          !day.questsAwarded.includes('daily-all')
        ) {
          day.questsAwarded.push('daily-all');
          bonus += DAILY_ALL_BONUS;
          toast({
            kind: 'quest',
            icon: '🏅',
            title: '¡Las 3 misiones del día!',
            sub: `Bonus +${DAILY_ALL_BONUS} XP`,
          });
        }
        if (changed) {
          set({ day, totals: { ...get().totals, questsDone } });
        }
        if (bonus > 0) get().addXp(bonus, null);

        // --- achievements ---
        for (const a of ACHIEVEMENTS) {
          const cur = get();
          if (!cur.achievements[a.id] && a.test(cur)) {
            set({
              achievements: {
                ...cur.achievements,
                [a.id]: new Date().toISOString(),
              },
            });
            toast({
              kind: 'ach',
              icon: a.icon,
              title: `Logro: ${a.title}`,
              sub: `${a.desc} · +${a.xp} XP`,
            });
            get().addXp(a.xp, null);
          }
        }
      },
    }),
    {
      name: 'intelforge-v1',
      version: 3,
      migrate: (persisted, version) =>
        migrateProgress(persisted, version) as Store,
      partialize: (s) => ({
        track: s.track,
        xp: s.xp,
        streak: s.streak,
        activity: s.activity,
        lessons: s.lessons,
        quizBest: s.quizBest,
        labs: s.labs,
        bosses: s.bosses,
        exams: s.exams,
        srs: s.srs,
        calibration: s.calibration,
        totals: s.totals,
        achievements: s.achievements,
        exempt: s.exempt,
        placement: s.placement,
        day: s.day,
      }),
    },
  ),
);
