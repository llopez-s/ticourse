# CLAUDE.md — TICourse (IntelForge Academy)

Guidance for working in this repository. Part of the `D:\LLM projects` collection — see
`../PROJECTS.md` for the cross-project index. The Spanish `README.md` is the authoritative
content/feature doc.

## What this is

**IntelForge Academy** — a gamified, **unofficial** web study companion with **two tracks**
sharing one engine:

- **`gcti`** — GIAC GCTI (SANS FOR578 Cyber Threat Intelligence). Complete: 27 lessons, 174
  questions, 12 labs, 80 flashcards. Campaign "Operación VELVET CICADA".
- **`secplus`** — CompTIA Security+ SY0-701. Skeleton for all 5 domains (`sp1`–`sp5`) + exam
  prep (`sp6`). **COMPLETE — all five domains** (2026-09-05): 41 content lessons + 1 exam-prep,
  305 questions, 132 checkpoints, 15 labs, 152 flashcards, 233 glossary terms.
  Per domain: D1 7 lessons / 51 q / 26 cards / 40 terms; D2 8 / 60 / 28 / 44; D3 7 / 53 / 30 / 46;
  D4 (largest, 28%) 11 lessons `sp4m1–11` across `sp4-part1..6.ts` / 82 q / 36 cards / 55 terms;
  D5 8 lessons / 59 q / 32 cards / 48 terms. Every section has 3 labs (`splNa/b/c`) and a
  playable boss. Campaign "Operación GLASS HARBOR" (Autoridad Portuaria de Halden) is
  completable end to end. Spec + per-domain plans in `docs/superpowers/`
  (`...-domain4.md` / `...-domain5.md` are the most refined recipe).

Content is Spanish with English exam terminology; quiz questions/flashcards in English.

> Independent, original material. **Not affiliated with SANS/GIAC or CompTIA** — keep both
> disclaimers intact (see `README.md` and `TRACKS[*].disclaimer`).

Fully **client-side**, static-deployable. **No backend** — all user progress persists in browser
`localStorage` under the store key `intelforge-v1` (persist **version 2**; `migrateProgress` in
`lib/store.ts` upgrades v1 data by adding `track` and stamping exams).

## Stack & layout

Vite 7 · React 19 · TypeScript (strict) · Tailwind CSS 4 · Zustand (`persist` middleware) ·
react-router-dom 7 (**HashRouter**).

```
src/
  main.tsx, App.tsx        entry + HashRouter routes (11 routes)
  lib/                     engine: types.ts, xp.ts (XP/ranks), srs.ts (SM-2 spaced repetition),
                           store.ts (Zustand persisted store), util.ts, md.tsx (markdown-lite)
  data/                    CONTENT as data:
    tracks.ts              TRACKS registry (TrackMeta per track: sections, modules, cards,
                           glossary, labs, domains+weights, exam config, campaign, ranks)
    course.ts              global lookups (ids unique across tracks) + track-scoped helpers
                           (sectionsOf, modulesOfTrack, examReadiness(track), sampleExam)
    course-gcti.ts, s1–s6.ts, flashcards.ts, glossary.ts   GCTI content
    secplus/               Security+ content: sections.ts, spN.ts (= spN-partK.ts aggregators),
                           sp6.ts, flashcards.ts + glossary.ts (spread spN-cards.ts),
                           labs.ts (spreads labs-spN.ts)
    labs.ts                GCTI_LABS + merged LABS/CLASSIFY_DATA/ORDER_DATA/SELECT_DATA (both tracks)
    achievements.ts, quests.ts
  components/              Layout (TrackSwitcher, useTrack, useSyncTrack), Toasts,
                           BlockRenderer, QuizEngine, Bits, labs/ (8 lab engines)
  pages/                   Dashboard, Section, Module, Quiz, Lab, Boss, Exam, Cards, Glossary,
                           Achievements, Profile
dist/                      prebuilt static output
.claude/                   launch.json (intelforge-dev, port 5173), settings.local.json
```

Routes: Dashboard `/`, Section, Module/learn, Quiz, Lab, Boss, Exam, Cards, Glossary,
Achievements, Profile. ~13k lines across ~45 files; the bulk is content data.

## How to run

```bash
npm install
npm run dev      # http://localhost:5173  (or use .claude/launch.json -> intelforge-dev)
npm run build    # tsc --noEmit && vite build  -> static dist/
npm run preview  # preview the production build
npm test         # vitest (content integrity, exam sampling, store migration, achievements)
```

Node comes from **fnm**; in Bash run `eval "$(fnm env)"` first if `npm` is not on PATH. The
Browser-pane launch config `intelforge-dev` lives in `../.claude/launch.json` (root), port 5173.

**Deployed at https://llopez-s.github.io/ticourse/** (repo `llopez-s/ticourse`, public). Every
push to `main` runs `.github/workflows/deploy.yml`: `npm ci` → `npm test` → `npm run build` →
Pages. `vite.config.ts` sets `base` to `/ticourse/` for that sub-path; build with
`BASE_PATH=/ npm run build` for a root-hosted deploy. HashRouter avoids server rewrite rules.

## Architecture notes (read before editing content)

- **Tracks.** `TrackId = 'gcti' | 'secplus'`. The active track is `store.track` (persisted);
  `useTrack()` returns its `TrackMeta`; content pages call `useSyncTrack(sectionId)` so deep
  links switch tracks. Progress maps (`lessons`, `quizBest`, `labs`, `bosses`, `srs`) are keyed by
  globally unique ids, so they are per-track for free; XP/level/streak/quests/calibration are one
  shared profile. `ExamResult.track` scopes exam history. Rank *names* come from
  `TRACKS[t].ranks` (same level thresholds).
- **Id conventions (must stay globally unique):** GCTI `s1`/`s1m1`/`s1m1q1`/`fc101`/`lab1a`;
  Security+ `sp1`/`sp1m1`/`sp1m1q1`/`fcp101`/`spl1a`; achievements `sp-*`.
- **Content-as-data.** Lessons are structured `Block[]` unions (paragraph, table, code, callout,
  inline checkpoint) rendered by `components/BlockRenderer.tsx`. Quizzes are typed `Question[]`
  tagged by `Domain` (5 GCTI + 5 SY0-701 domains). `sampleExam(track, n, seed)` samples by the
  track's official domain weights (Sec+ 12/22/18/28/20), capped at available questions, skipping
  empty domains. To add/edit course material, edit `src/data/**/*.ts` — don't hardcode content in
  components. **To add a Security+ domain N (recipe used for D2):** write a plan like
  `docs/superpowers/plans/2026-09-04-security-plus-domain2.md` (lesson outlines, labs, card
  list); scaffold `data/secplus/spN-part1..4.ts` (2 lessons each), `spN.ts` aggregator,
  `spN-cards.ts` (`SPN_FLASHCARDS`, `SPN_GLOSSARY`), `labs-spN.ts` (`SPN_LABS`, data maps);
  spread them into `secplus/flashcards.ts`, `secplus/glossary.ts`, `secplus/labs.ts`, and add
  `SPN_MODULES` to `TRACKS.secplus.modules`; add a completeness test in `content.test.ts`; then
  dispatch parallel content subagents (one per file) + one read-only accuracy reviewer.
- **Gamification engine** is the differentiator:
  - **Confidence-betting** on answers (Possible / Likely / Almost certain, ±XP) — doubles as
    **ICD 203 estimative-language calibration** training.
  - XP with **7 analyst ranks**; narrative campaign ("Operación VELVET CICADA") where each
    section's **boss battle** unlocks a dossier fragment.
  - Daily **streaks** with freezes; rotating daily **quests**; **26 achievements** (23 + 3 Security+);
    per-section exam-readiness meters.
- **SM-2 spaced repetition** (`lib/srs.ts`) drives flashcards (10 new cards/day).
- State shape and persistence live in `lib/store.ts` (Zustand + `persist`, key `intelforge-v1`).
  Changing the store shape can invalidate a user's saved progress — migrate carefully.

## State & gotchas

- **Complete / functional** product, not a scaffold. GCTI: 27 lessons, 174 quiz questions, 12
  labs, 80 flashcards, ~95 glossary terms. Security+: all 5 domains (see above). Fresh `dist/`
  build present. The weighted 90-question mock samples 11/20/16/25/18 across the five SY0-701
  domains, matching the official 12/22/18/28/20 weights exactly.
- **Git repo** initialized 2026-09-05, remote `llopez-s/ticourse` (public), default branch `main`.
- **Progress sync (opt-in, currently OFF).** `src/lib/sync.ts` (pure merge + hashing + HTTP client),
  `syncStore.ts` (code + status under `intelforge-sync`, never uploaded), `useSync.ts` (mount /
  debounce / tab-hide triggers), `components/SyncPanel.tsx` (Profile UI), `worker/` (Cloudflare
  Worker + KV, deployed manually with `wrangler deploy`, **not** in CI). The code is SHA-256'd in
  the browser; only the digest reaches the Worker. Conflicts resolve via `mergeProgress`, which is
  commutative, idempotent and monotonic — 28 tests in `sync.test.ts`. Spec:
  `docs/superpowers/specs/2026-09-05-progress-sync-design.md`.
  **Live** at `https://ticourse-sync.ojamajo.workers.dev` (KV namespace
  `4bf63897857f4ee1af821e0f756a2857`, account subdomain `ojamajo`). `SYNC_URL` in `sync.ts` holds
  that URL and is typed `string` so `syncEnabled()` stays meaningful; setting it back to `''`
  disables the whole feature cleanly.
  **Cloudflare KV is eventually consistent and caches misses for up to ~60 s**, so a first `pull()`
  on a new device can return 404 even though the bucket exists. `syncNow` then treats it as a new
  bucket and pushes local state, overwriting the remote until the other device re-pushes. It
  converges, because `mergeProgress` is monotonic and each device keeps its own copy locally, but it
  is the one place where a device whose `localStorage` was cleared *before* its next push can lose
  data. Retrying once after a 404 on the first sync for a code would shrink the window.
- **Tests:** vitest, `npm test` (32 tests in `src/**/*.test.ts`). Content tests assert Domain 1–5
  completeness, that every Security+ boss section has ≥12 questions, 4 choices + valid answer per question, ids unique, lab data present.
- **Bash gotcha in this harness:** commands containing backticks fail to parse before running —
  write patch scripts to a file (or use Edit/Write) instead of inline heredocs with backticks.
- `.claude/settings.local.json` has **stale hardcoded Bash paths** from a previous location
  (`/c/1ALLDOCUMENTS/ClaudeCodeProjects/TICourse`). Harmless but outdated — safe to fix if editing
  that file.
