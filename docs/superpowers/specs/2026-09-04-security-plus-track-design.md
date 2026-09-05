# Security+ track for IntelForge Academy — design

Date: 2026-09-04 · Status: approved by Lidia (chat) · Path: architectural

## Goal

Add a second study track, **CompTIA Security+ (SY0-701)**, to the existing IntelForge Academy
app, reusing the whole gamification engine (quizzes with confidence bets, SM-2 flashcards, XP,
ranks, streaks, quests, achievements, boss battles, timed exam). First pass ships the full track
skeleton (5 domain sections + exam-prep section) and **Domain 1 — General Security Concepts —
complete**. Later sessions fill Domains 2–5.

Unofficial, original material. Not affiliated with CompTIA. "CompTIA" and "Security+" are
trademarks of CompTIA, Inc.

## Non-goals

- No backend, no accounts. Progress stays in `localStorage`.
- No new lab engines. Domain 1 labs reuse `classify` and `order`.
- No separate XP/streak per track. One learner profile.
- Domains 2–5 have section metadata only (no lessons yet).

## Architecture

### Track registry (`src/data/tracks.ts`, new)

```ts
export type TrackId = 'gcti' | 'secplus';
export interface TrackMeta {
  id: TrackId;
  name: string;            // 'CTI · GCTI' | 'Security+'
  brand: string;           // sidebar subtitle, e.g. 'CTI Academy' / 'Security+ Forge'
  icon: string;
  tagline: string;         // dashboard subtitle (Spanish)
  disclaimer: string;      // sidebar footer (Spanish)
  domains: Domain[];       // exam domains in official order
  domainWeights: Record<string, number>; // sums to 1
  sections: SectionMeta[];
  modules: Module[];
  flashcards: Flashcard[];
  glossary: GlossaryEntry[];
  labs: LabMeta[];
  ranks: Rank[];           // same lvl thresholds as xp.RANKS, track-flavored names
  exam: {
    name: string;          // 'Simulacro GCTI' | 'Simulacro Security+'
    realFormat: string;    // Spanish one-liner shown on exam hub
    passPct: number;       // 75 (GCTI proxy) | 83 (750/900)
    sprint: { n: number; minutes: number };
    full: { n: number; minutes: number };
  };
  campaign: {
    title: string;         // 'Operación VELVET CICADA' | 'Operación GLASS HARBOR'
    intro: string;         // Spanish
  };
}
export const TRACKS: Record<TrackId, TrackMeta>;
export const TRACK_IDS: TrackId[];
```

GCTI's `TrackMeta` is assembled from the existing `SECTIONS`, `S1..S6_MODULES`, `FLASHCARDS`,
`GLOSSARY`, `LABS`. Security+ data lives in new files:

```
src/data/secplus/
  sections.ts      SP_SECTIONS (sp1..sp6) with bosses + campaign dossiers
  sp1.ts           SP1_MODULES (7 lessons + quizzes, Domain 1)
  sp6.ts           SP6_MODULES (1 lesson: exam format + strategy)
  flashcards.ts    SP_FLASHCARDS (≈25, ids fcp101…)
  glossary.ts      SP_GLOSSARY (≈40 terms)
  labs.ts          SP_LABS + SP_CLASSIFY_DATA + SP_ORDER_DATA (3 labs: spl1a, spl1b, spl1c)
```

`data/labs.ts` merges `SP_CLASSIFY_DATA`/`SP_ORDER_DATA` into `CLASSIFY_DATA`/`ORDER_DATA` so
`LabPage` keeps working unchanged. `LABS` (global) = GCTI labs + SP labs. To avoid a circular
import (`labs.ts` ↔ `secplus/labs.ts`), `secplus/labs.ts` imports only the *types* from
`../labs`.

### Ids (must be globally unique)

| Thing | GCTI | Security+ |
|---|---|---|
| section | `s1`…`s6` | `sp1`…`sp6` |
| module | `s1m1` | `sp1m1` |
| question | `s1m1q1` | `sp1m1q1` |
| flashcard | `fc101` | `fcp101` |
| lab | `lab1a` | `spl1a` |
| achievement | `first-lesson`… | `sp-first-lesson`, `sp-campaign`, `sp-exam-ready` |

### Types (`src/lib/types.ts`)

- `TrackId = 'gcti' | 'secplus'` lives in types.
- `Domain` union extended with the 5 SY0-701 domains:
  `'General Security Concepts' | 'Threats, Vulnerabilities & Mitigations' | 'Security Architecture' | 'Security Operations' | 'Security Program Management & Oversight'`.
- `SectionMeta.track: TrackId`.
- `ExamResult.track: TrackId`.
- `ProgressSnapshot.track: TrackId` (active track).

### Course helpers (`src/data/course.ts`)

Keep global lookups (ids unique): `sectionById`, `moduleById`, `modulesOf(sectionId)`,
`labsOf(sectionId)`, `questionsOf(sectionId)`, `sectionMastery(sectionId, s)`.
`SECTIONS`/`ALL_MODULES`/`ALL_QUESTIONS` become **all tracks combined** (used only by global
lookups). Add track-scoped helpers:

- `trackOf(sectionId): TrackId` (falls back to `'gcti'` for unknown ids)
- `sectionsOf(track)`, `modulesOfTrack(track)`, `questionsOfTrack(track)`
- `contentSections(track)` = sections with `boss !== null`
- `examReadiness(track, s)` = mean mastery of that track's content sections **that have
  modules** (so empty Sec+ domains do not drag readiness to 0). Returns 0 if none.
- `nextModule(track, s)` = first uncompleted module of the track, or `undefined`.
- `sampleExam(track, n, seed)` — weighted sampling: target per domain =
  `round(n × weight)`, capped at the number of available questions in that domain; the
  shortfall is redistributed across domains that still have spare questions (largest
  remaining capacity first, one at a time). Domains with zero questions are skipped. Returns a
  shuffled array of at most `n` questions.

### Store (`src/lib/store.ts`)

- New persisted field `track: TrackId` (default `'gcti'`), action `setTrack(t)`.
- `persist` version `1 → 2`, `migrate(v1)`: add `track: 'gcti'`, stamp every existing exam with
  `track: 'gcti'`. Everything else untouched (id-keyed maps are already per-track).
- `resetAll` keeps the active track.
- `recordExam` unchanged (caller passes `track`).

### XP / ranks (`src/lib/xp.ts`)

`RANKS` stays the level table. `rankFor(level, ranks = RANKS)` and `nextRank(level, ranks = RANKS)`
accept a rank list; UI passes `TRACKS[track].ranks`. Sec+ ranks (same `lvl` thresholds):
Trainee 🎓 → Help Desk 🎧 → SOC Analyst I 🛡️ → SOC Analyst II 🔎 → Security Engineer ⚙️ →
Security Architect 🏛️ → CISO 👑.

### Achievements (`src/data/achievements.ts`)

- `bookworm`, `all-labs`, `campaign-hero` compute their thresholds from GCTI track data
  (module/lab/boss counts) and count only GCTI ids (`trackOf(section) === 'gcti'`).
- New: `sp-first-lesson` (🛡️ "Primer parche", 25 XP), `sp-campaign` (⚓ "Operación GLASS
  HARBOR", 200 XP, 5 sp bosses ≥80), `sp-exam-ready` (🎖️ "750/900", 150 XP, a `secplus`
  exam ≥83%).
- Generic ones (streaks, combos, cards, centurion, quests, exam-ready ≥75% any track) unchanged.
- `achievements.ts` must not import `tracks.ts` at module top-level in a way that creates a
  cycle with `store.ts`; it imports from `course.ts` only.

### UI

- **Track switcher**: segmented control in the sidebar header (desktop) and as the first chip in
  the mobile quick-nav. Switching calls `setTrack` and navigates to `/`.
- **Layout**: sidebar subtitle, section list, due-card count, disclaimer footer, mobile chips all
  come from the active track. Rank pill uses track ranks.
- **Dashboard**: title/tagline, "continuar" (track `nextModule`), readiness ring
  (`examReadiness(track)`), campaign panel (track `campaign` + track labs with `mission` + track
  bosses), section cards for the track. Sections with 0 modules render a muted "Próximamente"
  card (not a link).
- **SectionPage**: unchanged layout; if section has 0 modules show a "Contenido en preparación"
  panel. The exam CTA block shows for the last section of either track (`s6` and `sp6`).
- **ModulePage / QuizPage / BossPage / LabPage**: derive `track = trackOf(sectionId)`; on mount,
  if it differs from the active track call `setTrack` (deep-link support). "Siguiente lección"
  uses `modulesOfTrack`. Boss "Siguiente sección" uses the track's section order; last content
  section links to `/exam`.
- **ExamPage**: uses track `exam` config (names, formats, pass %) and `sampleExam`. History
  table filtered to the active track. Records `track`.
- **CardsPage / GlossaryPage**: use track flashcards/glossary; glossary filter chips = track
  content sections; print header names the track.
- **ProfilePage**: mastery bars for the active track's content sections that have modules; rank
  from track ranks; calibration note stays (it's about confidence, valid for both).
- **AchievementsPage**: unchanged (shows all).

### Security+ content (Domain 1, SY0-701 objectives 1.1–1.4)

Lessons are Spanish with English exam terminology; quiz questions and flashcards in English.

| id | Lesson | Objective |
|---|---|---|
| sp1m1 | Categorías y tipos de controles de seguridad | 1.1 |
| sp1m2 | CIA, non-repudiation, AAA y gap analysis | 1.2 |
| sp1m3 | Zero Trust: control plane y data plane | 1.2 |
| sp1m4 | Seguridad física y tecnologías de engaño | 1.2 |
| sp1m5 | Change management: proceso, implicaciones técnicas y documentación | 1.3 |
| sp1m6 | Criptografía: simétrica, asimétrica, hashing, firmas, key stretching, ofuscación, blockchain | 1.4 |
| sp1m7 | PKI, certificados y raíces de confianza en hardware (TPM/HSM/KMS/secure enclave) | 1.4 |

Each lesson: 4–6 objectives, 10–16 blocks with ≥3 inline checks, 6–8 quiz questions. All
Domain 1 questions use the `'General Security Concepts'` tag so boss/exam sampling is
predictable.

Labs (all `sectionId: 'sp1'`):
- `spl1a` classify "Control Matrix" — 12 controls → category (Technical/Managerial/Operational/
  Physical). Mission 1 of GLASS HARBOR.
- `spl1b` order "Change Flow" — 8 steps of a change-management request.
- `spl1c` classify "Crypto Toolbox" — 12 scenarios → Symmetric / Asymmetric / Hashing / Digital
  signature.

`sp6m1` "El examen Security+: formato y estrategia": up to 90 questions, 90 minutes, scale
100–900, pass 750, PBQs first (skip-and-return), domain weights table, no open book.
`quiz: []`.

Campaign **Operación GLASS HARBOR**: the learner is the first security analyst at *Autoridad
Portuaria de Halden*. Bosses: sp1 NULL CIPHER (op. FIRST KEY), sp2 RED MARROW (op. OPEN WOUND),
sp3 BLIND ARCHITECT (op. LOAD BEARING), sp4 SILENT PAGER (op. NIGHT WATCH), sp5 PAPER GOVERNOR
(op. FINAL AUDIT). Each has flavor + dossier text.

Exam config: sprint 30 q / 30 min, full 90 q / 90 min, passPct 83. Domain weights
0.12 / 0.22 / 0.18 / 0.28 / 0.20.

### Testing

Add `vitest` (devDependency) + `npm test` (`vitest run`). Tests (pure functions only):
- `src/data/course.test.ts`: ids unique across tracks; `sampleExam` respects weights, caps at
  available, skips empty domains, returns exactly `n` when enough questions exist;
  `examReadiness` ignores empty sections.
- `src/lib/store.test.ts`: the exported `migrateProgress(v1, 1)` adds `track` and stamps exams.
- `src/data/content.test.ts`: every question has 4 choices and a valid `answer` index; every
  module's `sectionId` exists; every flashcard/glossary/lab `sectionId` exists; Domain 1 quiz
  count ≥ 40; classify/order data present for every classify/order lab.

Manual verification: `npm run build`, then dev server in the Browser pane: switch tracks, open
sp1m1, complete a checkpoint, run a Sec+ sprint exam, check GCTI progress untouched.

### Docs

Update `README.md` (tracks, counts, disclaimer), `CLAUDE.md` (tracks layout, ids, store v2,
tests), `../PROJECTS.md` row for TICourse.
