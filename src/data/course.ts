import type {
  Module,
  PlacementBlock,
  ProgressSnapshot,
  Question,
  SectionMeta,
  TrackId,
} from '../lib/types';
import { pct, sample, shuffle } from '../lib/util';
import { LABS } from './labs';
import { TRACKS, TRACK_IDS } from './tracks';

/** All sections / modules / questions across every track (ids are unique). */
export const SECTIONS: SectionMeta[] = TRACK_IDS.flatMap((t) => TRACKS[t].sections);
export const ALL_MODULES: Module[] = TRACK_IDS.flatMap((t) => TRACKS[t].modules);
export const ALL_QUESTIONS: Question[] = ALL_MODULES.flatMap((m) => m.quiz);
export const ALL_PLACEMENT: PlacementBlock[] = TRACK_IDS.flatMap(
  (t) => TRACKS[t].placement,
);

// ---- global lookups ---------------------------------------------------------
export const sectionById = (id: string) => SECTIONS.find((s) => s.id === id);
export const moduleById = (id: string) => ALL_MODULES.find((m) => m.id === id);
export const modulesOf = (sectionId: string) =>
  ALL_MODULES.filter((m) => m.sectionId === sectionId);
export const labsOf = (sectionId: string) =>
  LABS.filter((l) => l.sectionId === sectionId);
export const questionsOf = (sectionId: string): Question[] =>
  modulesOf(sectionId).flatMap((m) => m.quiz);
export const placementBlockById = (id: string) =>
  ALL_PLACEMENT.find((b) => b.id === id);

// ---- track scoping ----------------------------------------------------------
export const trackOf = (sectionId: string): TrackId =>
  sectionById(sectionId)?.track ?? 'gcti';
export const sectionsOf = (track: TrackId) => TRACKS[track].sections;
/** Sections that carry a boss (= exam content sections). */
export const contentSections = (track: TrackId) =>
  TRACKS[track].sections.filter((s) => s.boss !== null);
export const modulesOfTrack = (track: TrackId) => TRACKS[track].modules;
export const placementBlocks = (track: TrackId) => TRACKS[track].placement;
export const questionsOfTrack = (track: TrackId): Question[] =>
  TRACKS[track].modules.flatMap((m) => m.quiz);
export const nextModule = (track: TrackId, s: Pick<ProgressSnapshot, 'lessons'>) =>
  TRACKS[track].modules.find((m) => !s.lessons[m.id]);

type Prog = Pick<ProgressSnapshot, 'lessons' | 'quizBest' | 'labs' | 'bosses'>;

/**
 * Section mastery 0-100: lessons 40%, best quiz scores 30%, labs 15%, boss 15%.
 * Sections without boss/labs redistribute weight onto lessons+quizzes.
 */
export function sectionMastery(
  sectionId: string,
  s: Prog,
): number {
  const mods = modulesOf(sectionId);
  const labs = labsOf(sectionId);
  const section = sectionById(sectionId);
  if (mods.length === 0) return 0;

  const lessonPct = pct(
    mods.filter((m) => s.lessons[m.id]).length,
    mods.length,
  );
  const quizMods = mods.filter((m) => m.quiz.length > 0);
  const quizPct =
    quizMods.length === 0
      ? null
      : Math.round(
          quizMods.reduce((acc, m) => acc + (s.quizBest[m.id] ?? 0), 0) /
            quizMods.length,
        );
  const labPct =
    labs.length === 0
      ? null
      : pct(labs.filter((l) => s.labs[l.id]).length, labs.length);
  const bossPct = section?.boss
    ? Math.min(100, ((s.bosses[sectionId] ?? 0) / 80) * 100)
    : null;

  let total = 0;
  let weight = 0;
  const add = (v: number | null, w: number) => {
    if (v !== null) {
      total += v * w;
      weight += w;
    }
  };
  add(lessonPct, 0.4);
  add(quizPct, 0.3);
  add(labPct, 0.15);
  add(bossPct, 0.15);
  return weight === 0 ? 0 : Math.round(total / weight);
}

/** Overall readiness: mean mastery of the track's content sections that have modules. */
export function examReadiness(track: TrackId, s: Prog): number {
  const ids = contentSections(track)
    .filter((sec) => modulesOf(sec.id).length > 0)
    .map((sec) => sec.id);
  if (ids.length === 0) return 0;
  return Math.round(
    ids.reduce((acc, id) => acc + sectionMastery(id, s), 0) / ids.length,
  );
}

/**
 * Weighted exam sample: round(n × weight) per domain, capped at the questions
 * available in that domain; any shortfall goes to the domains with the most
 * spare questions. Domains with no questions are skipped. Deterministic per seed.
 */
export function sampleExam(track: TrackId, n: number, seed: string): Question[] {
  const t = TRACKS[track];
  const all = questionsOfTrack(track);
  const pools = t.domains
    .map((d) => ({ d, qs: all.filter((q) => q.domain === d) }))
    .filter((p) => p.qs.length > 0);
  if (pools.length === 0) return [];
  const w = (d: string) => t.domainWeights[d] ?? 0;
  const totalW = pools.reduce((acc, p) => acc + w(p.d), 0);
  const take = pools.map((p) =>
    Math.min(p.qs.length, Math.round((n * w(p.d)) / totalW)),
  );
  let assigned = take.reduce((a, b) => a + b, 0);
  while (assigned < n) {
    let best = -1;
    let spare = 0;
    pools.forEach((p, i) => {
      const sp = p.qs.length - take[i];
      if (sp > spare) {
        spare = sp;
        best = i;
      }
    });
    if (best < 0) break;
    take[best] += 1;
    assigned += 1;
  }
  while (assigned > n) {
    let best = 0;
    take.forEach((c, i) => {
      if (c > take[best]) best = i;
    });
    take[best] -= 1;
    assigned -= 1;
  }
  const picked = pools.flatMap((p, i) => sample(p.qs, take[i], `${seed}-${p.d}`));
  return shuffle(picked, seed);
}
