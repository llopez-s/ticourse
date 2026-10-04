# CLAUDE.md — TICourse (Alertópolis, formerly IntelForge Academy)

Guidance for working in this repository. Part of the `D:\LLM projects` collection — see
`../PROJECTS.md` for the cross-project index. The Spanish `README.md` is the authoritative
content/feature doc.

## What this is

**Alertópolis** (renamed from IntelForge Academy on 2026-09-26; storage keys keep the old name on purpose) — a gamified, **unofficial** web study companion with **two tracks**
sharing one engine:

- **`gcti`** — GIAC GCTI (SANS FOR578 Cyber Threat Intelligence). Complete: 27 lessons, 174
  questions, 12 labs, 80 flashcards, 60 placement questions. Campaign "Operación VELVET CICADA".
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
`localStorage` under the store key `intelforge-v1` (persist **version 3**; `migrateProgress` in
`lib/store.ts` upgrades v1 data by adding `track` and stamping exams, and v2 data by adding the
placement test's `exempt` and `placement` fields).

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
  - Daily **streaks** with freezes; rotating daily **quests**; **28 achievements**
    (23 general + 3 Security+ `sp-*` + 2 placement `pl-*`);
    per-section exam-readiness meters.
- **Placement test.** `TRACKS[t].placement` holds one `PlacementBlock` (12 dedicated questions,
  never reused from the lesson bank) per content section. Passing at ≥80% lets the learner
  *convalidate* that section's theory: `store.exempt` maps moduleId → `ExemptEntry`, read
  everywhere through `isDone`/`exemptScore` in `lib/placement.ts`. Labs and bosses are never
  exempted. Exemption is revocable, which is why `mergeProgress` is **no longer monotonic for
  `exempt`** — that field is last-write-wins by `at`. Persist version **3**. Both tracks now
  ship one: `SP_PLACEMENT` (`secplus/placement.ts`) and `GCTI_PLACEMENT` (`placement-gcti.ts`,
  spreading `placement-gcti-sN.ts`). A track with an empty `placement` still degrades cleanly —
  the Dashboard, Profile and `/placement` all check for it.
- **SM-2 spaced repetition** (`lib/srs.ts`) drives flashcards (10 new cards/day).
- State shape and persistence live in `lib/store.ts` (Zustand + `persist`, key `intelforge-v1`).
  Changing the store shape can invalidate a user's saved progress — migrate carefully.

- **Brand (matches the YouTube channel art).** `lib/brand.ts` holds `APP_NAME`, `APP_WORDMARK` +
  `WORDMARK_PARTS` (ALERT white / ÓPOLIS cyan), `APP_TAGLINE` ("Ciberseguridad en español, con chispa") and
  `SITE_URL`. `components/Brand.tsx` draws the lockup (`BrandMark` = the videos' diamond, `Wordmark`);
  `components/Skyline.tsx` + `lib/skyline.ts` draw the Dashboard's night city (seeded, deterministic; windows
  dim/cyan/amber = routine/data/warning, rose beacon on the tallest tower near the right edge, everything
  left of `RISE_FROM` stays under `LOW_MAX` so text can sit above it). `public/favicon.svg` is the avatar
  (diamond + rose badge); `public/apple-touch-icon.png` and `public/og-image.png` are the channel avatar and
  a banner crop. OG/Twitter meta in `index.html` use absolute `SITE_URL` paths; `brand.test.ts` pins all of it.
  Track icons must not reuse the app's `◆`.

## State & gotchas

- **Complete / functional** product, not a scaffold. GCTI: 27 lessons, 174 quiz questions, 12
  labs, 80 flashcards, ~95 glossary terms. Security+: all 5 domains (see above). Fresh `dist/`
  build present. The weighted 90-question mock samples 11/20/16/25/18 across the five SY0-701
  domains, matching the official 12/22/18/28/20 weights exactly.
- **Git repo** initialized 2026-09-05, remote `llopez-s/ticourse` (public), default branch `main`.
- **Progress sync (opt-in, currently OFF).** `src/lib/sync.ts` (pure merge + hashing + HTTP client),
  scheduler / tab-hide triggers), `syncSchedule.ts` (the write-rate policy),
  `components/SyncPanel.tsx` (Profile UI), `worker/` (Cloudflare Worker + KV, deployed manually
  with `wrangler deploy`, **not** in CI). The code is SHA-256'd in
  Worker + KV, deployed manually with `wrangler deploy`, **not** in CI). The code is SHA-256'd in
  the browser; only the digest reaches the Worker. Conflicts resolve via `mergeProgress`, which is
  commutative and idempotent, and monotonic for every field **except `exempt`**: a placement
  exemption can be revoked, so that field is last-write-wins by `at` instead — otherwise an older
  grant synced in from another device could resurrect a revocation. 54 tests in `sync.test.ts`,
  7 in `syncSchedule.test.ts`.
  Spec: `docs/superpowers/specs/2026-09-05-progress-sync-design.md`.
  **Live** at `https://ticourse-sync.ojamajo.workers.dev` (KV namespace
  `4bf63897857f4ee1af821e0f756a2857`, account subdomain `ojamajo`). `SYNC_URL` in `sync.ts` holds
  that URL and is typed `string` so `syncEnabled()` stays meaningful; setting it back to `''`
  disables the whole feature cleanly.
  **Writes, not reads, are the free-tier constraint:** Cloudflare KV allows 1,000 writes a day
  against 100,000 reads. The original 5 s debounce spent roughly one write per answered question
  and tripped a quota alert on 2026-09-06; `syncSchedule.ts` now floors the gap between syncs at
  3 minutes, the tab-hide push only fires when the snapshot actually differs from the last one
  pushed, and both "did anything change?" guards use `stableStringify` (key-order blind) rather
  than `JSON.stringify`, which reported a change on every sync between two devices.
  The Worker endpoint is **public, unauthenticated and unrate-limited** — anyone who learns the
  URL can spend the quota or fill the 1 GB with 512 KB `PUT`s that have no TTL and no DELETE path.
  **Cloudflare KV is eventually consistent and caches misses for up to ~60 s**, so a first `pull()`
  on a new device can return 404 even though the bucket exists. `syncNow` then treats it as a new
  bucket and pushes local state, overwriting the remote until the other device re-pushes. It
  converges, because `mergeProgress` is commutative/idempotent (and monotonic outside `exempt`)
  and each device keeps its own copy locally, but it is the one place where a device whose
  `localStorage` was cleared *before* its next push can lose data. Retrying once after a 404 on
  the first sync for a code would shrink the window.
- **Tests:** vitest, `npm test` (158 tests in `src/**/*.test.ts`, 13 files). Content tests assert
  Domain 1–5 completeness, that every Security+ boss section has ≥12 questions, 4 choices + valid
  answer per question, ids unique, lab data present, and (placement blocks) that every content
  section has exactly one 12-question block with contiguous ids and non-empty text. Partial
  placement coverage fails for **every** track; shipping none at all is still allowed. A
  `lesson videos` suite walks every `t: 'video'` block of both tracks (assets exist, relative,
  < 50 MB, VTT header, no shared assets) and pins SIEM to sp4m6 and the forensics capsule to sp4m11.
- **Lesson videos (`t: 'video'` blocks).** One shared Remotion engine in `video/engine/` (scripts,
  UI, overlays, theme, fonts, timeline types — see its `README.md`) and one folder per video with a
  `video.json` (output name, composition/poster ids, `profile` principal|capsula|principal-yt|capsula-yt, `track`):
  `video/siem/` (sp4m6, ~6:07, ElevenLabs voice Sarah) and `video/forense-adquisicion/` (sp4m11,
  capsule ~2:52, edge-tts Elvira until the ElevenLabs quota resets on 2026-10-25 — re-voice steps in
  its README). Every script takes `--video <slug>`. Pipeline: `narration.json` →
  `scripts/tts-elevenlabs.mjs` (ElevenLabs v3, one request per scene with `<tag>` emotion
  directions; needs `ELEVENLABS_API_KEY` in the git-ignored `.env.local`; free plan = 10k chars/month,
  premade voices only + "Voz: ElevenLabs" credit) — or `scripts/tts-chatterbox.mjs` (Chatterbox, local
  MIT model on CPU, voice `chatterbox/<es-es|mtl>/<default|clip>`; a Python worker in the git-ignored
  `video/engine/.venv-chatterbox` synthesises each segment and transcribes it with faster-whisper for
  word timings + a script-match retry; ~4–6 GB RAM, slow) — or `scripts/tts.py` (edge-tts) →
  `scripts/build-timeline.mjs` (`src/timeline.json` + transcript + WebVTT) → `scripts/render.mjs`
  (bundles first, then MP4 + poster, ffprobe/A-V-sync checks). Rendering is local only (not in CI).
  Voice clips live in `video/<slug>/public/` (Remotion `--public-dir`), never in the app's `public/`.
  The video content plan (ranking, batches, briefs) is
  `docs/superpowers/plans/2026-09-25-lesson-videos.md`. The old EDR video (`video/edr/`, a separate,
  older pipeline) was replaced in sp4m7 by V1 «Defensa en capas» (YouTube `GfjE0lP2H0s`) on 2026-09-28
  and its `public/videos/edr-blue-team.*` files retired; `video/edr/` stays until P2. **New videos (V1+) use the `-yt` profiles**:
  livelier writing (now «narración hablada», see below), intercepted adversary messages, `scripts/voice-plan.mjs`
  (picks ElevenLabs vs. Chatterbox from the remaining quota) and `scripts/youtube-meta.mjs` (writes
  the title/description/tags for upload) — the MP4 renders to `video/<slug>/out/` (git-ignored) and is
  published to YouTube instead of being committed to `public/videos/`; the app embeds it via a
  `youtube` block id, not an MP4 file. Design:
  `docs/superpowers/specs/2026-09-26-video-narration-style-design.md`. Intercepted messages can now be
  voiced: `narration.json` → `adversaryVoice` (SAPI Pablo + the `machine` fx preset, via `tts-adversary.mjs`)
  and `sfx` (11-sound library + per-cue key moments, via `sfx_generate.py`) — `capas-halden` (sp4m7) ships
  both. Design: `docs/superpowers/specs/2026-09-28-adversary-voice-sfx-design.md`.
  **V3 `video/diamond-e7/`** (s2m3, GCTI, YouTube `rwMIu0XBoWQ`, 7:54) is the first GCTI video: exam
  cards are track-aware (`EXAM_BADGE`/`GCTI_DOMAINS` in `scripts/lib/profiles.mjs` — a GCTI card names a
  course domain, badge «GCTI»), and every scene draws the shared `src/scenes/parts/Diamond.tsx`.
  **V4 `video/pivot-infra/`** (s3m3, GCTI, YouTube `8pet46MOGmk`, 8:08, published 2026-09-30 on the Alertópolis
  channel) is the first narrated by Lidia's own recording end to end: `verify-voice.mjs` re-transcribes every clip
  as the video plays it and `render.mjs` refuses a recording with cut words or leftover takes; and the first with
  **library music** instead of the generated bed — `video.json` → `"music"` names a YouTube Audio Library track in
  the git-ignored `video/engine/music/library/` (licences in `music/LICENSES.md`), which `music_kit.py` re-arranges
  to the story. YouTube does not allow external links in the channel's descriptions, so `youtube-meta` writes none.
  **V5 `video/ir-halden/`** (sp4m10, Security+, YouTube `S_nVqWYkKXM`, 8:19, published 2026-10-01) continues the
  Halden case (the morning after V1/SIEM/V2) and is the reason for the **new production order** in the video plan §8
  «Orden de trabajo»: read the campaign's **canon registry** first (`docs/superpowers/canon/glass-harbor.md`,
  `velvet-cicada.md` — every on-screen fact of the published videos with `path:line`, plus the contradictions found
  between sources), run `canon-check.mjs --video <slug>` (writes `out/canon-refs.md` for the accuracy reviewer),
  freeze the script (`video.json` → `"frozen": "YYYY-MM-DD"`; until then the recording sheet is a «BORRADOR»), build
  scenes while the narrator records, and fix bad cuts from her own takes with `recut_recording.py` before asking for a
  re-record. V5's script had to change twice after review because the SIEM video's *screen data* (01:52 logon from
  `ADM-WS-07`, morning triage) and V1's (16:04 alert, 16:11 isolation) contradicted it — transcripts alone miss this.
  Engine additions from V5: `principal-yt` up to 600 s; reading-sheet tones in Spanish; `video.json` → `"tags"` for
  YouTube topic tags; a machine-wide **heavy-job lock** (`lib/heavy-lock.mjs`: render, qa-frames and both Whisper
  passes queue; `RENDER_LOCK=0` skips it); Windows/worktree fixes (bundle rename/remove retries, repo-relative
  qa-frames folder for paths under `.claude`, `CHATTERBOX_PYTHON` to borrow the main checkout's venv, since this
  exFAT drive allows no junctions).
  **V5b `video/ir-halden-pruebas/`** (sp4m10, Security+, `capsula-yt`, YouTube `vlJ9FRtSIlM`, 3:35, published
  2026-10-01): tabletop vs simulation and threat hunting, the first capsule made with the §8 order end to end. Lessons:
  check the validator's arithmetic at design time (one exam card per scene and none in the closing one forced a sixth
  scene; think prompts ≤ 48 chars); Lidia's real reading lands at ~88 % of `--estimate`; `verify-voice` cannot hear a
  restart Whisper merges into the next words («Pues… digo… Pues igual» passed as one clean sentence), so after
  importing, compare the full-recording ASR with each clip and look for non-word speech inside clips; and a
  `--only` re-import must reuse the full import's gain (`--lufs=<excerpt LUFS + that gain>`), because `--match`
  measured on one sentence gave it ~1 dB more.
  **V7 `video/attack-piramide/`** (s2m5, GCTI, `capsula-yt`, YouTube `XCOAc7tlPTE`, 3:59, published 2026-10-03): the
  s2m5 process tree read with ATT&CK and the Pyramid of Pain, and the two loader hashes shown as two photos of
  `ENG-WS-041` (registry §5.1 resolved only in part; §7 has the rest). Lessons: Lidia's reading landed at 93 % of
  `--estimate` this time (V5 ~88 %, V5b 85 %), so aim the estimate near the profile's ceiling minus ~10 %; an abandoned first take
  of the next sentence can stick to a clip's end (`verify-voice` flags it as edge energy) — rebuild that clip from her
  own take with `recut_recording.py --part` and re-import with `--only <id> --lufs=<excerpt LUFS + full import gain>`;
  in YouTube Studio, typed tags do not turn into chips — fill the field with `form_input`, then read the chips back and
  delete any garbled one.
  **V6 `video/iam-halden/`** (sp4m8, Security+, `principal-yt`, YouTube `It1DrWKbFe4`, 9:17, published 2026-10-03):
  identity and access in Halden from the 01:52 logon to the vault of 27-10 (lifecycle, SAML, OAuth, MFA, PAM; SILENT
  PAGER ×3). Lessons: when all three Whisper passes agree on a *different word* («el privilegio se pierde» for «se
  pide»), ask Lidia to listen before rendering — it was a misreading, re-recorded; an RMS envelope of the master
  (`soundfile`, 20 ms frames) settles ASR artefacts instead (a «se Se» stutter and a dropped «y su baja» were both
  Whisper's); the `--only` re-import repeated V5b's `--match` mistake (s10-02 ~1.4 dB under its neighbours in the
  published video) — always `--lufs=<excerpt LUFS + full import gain>`; an `sfx` stamp that must coincide with a word
  needs its own cue on that word (`{done}Hecho.`), which changes neither the script nor the recording sheet; in
  YouTube Studio this time, typing the comma-separated tags and pressing Enter did create the chips (read them back
  either way). To preview a worktree, `preview_start` reads the **main checkout's** `.claude/launch.json`: add a
  temporary entry `cmd /c npm --prefix "<worktree, forward slashes>" run dev -- --port 5174 --strictPort`, start it,
  and restore the file at once.
  **V8 `video/stix-isac/`** (s3m5, GCTI, `capsula-yt`, YouTube `KO4REQeaKgM`, 3:53, published 2026-10-04): the
  ISAC's expired STIX indicator reaches Meridian's platform on 2-7 through its first TAXII pull — not blocked, hunted
  backwards; the graph («indicates», «uses») and «STIX describe, TAXII transporta» (HOLLOW LANTERN ×1). Fixes the
  lesson's «today» (2026-07-02) in the VELVET CICADA registry. Lidia's reading landed at 92 % of `--estimate`, as
  predicted; she uploaded it to YouTube herself, so the id came from the channel's public feed
  (`https://www.youtube.com/feeds/videos.xml?channel_id=UCe0XBMwoI3bI61K8qolacJA`).
  **Mastering** (Python, venv + `pedalboard pyloudnorm librosa soundfile scipy`): `scripts/master_voice.py`
  on the narrator's WAV *before* `import-recording` (time-aligned EQ/de-ess/compression, no denoise) and
  `scripts/master_mix.py` on the rendered MP4 (generated ambient bed ducked under speech, −14 LUFS,
  −1 dBTP); see the engine README «Masterización». In a git worktree, run `render.mjs` with
  `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.directory GIT_CONFIG_VALUE_0=*` (its git-ignore check
  otherwise trips on "dubious ownership"), and `npm ci` there first — the scripts resolve Remotion and
  ffmpeg from the worktree's own `node_modules`.
  **From V4 on, scripts follow «Narración hablada»** (2026-09-28; rules only in the video plan §1, design
  `docs/superpowers/specs/2026-09-28-spoken-narration-design.md`), which replaces «con chispa» — V1 and V3
  still sounded read aloud, and they are **not** redone. Talk like a person (no stage directions, spoken
  connectors instead of colons, idea before its name, repeat what matters, never spell out domains/hosts/
  hashes — they go on screen), **4–6 key concepts per principal** (2–3 per capsule; `-yt` exam cards now 5–8 /
  3–5), `wordBudget` at 2.7 words/s, and a read-only **naturalness reviewer** next to the accuracy one. The
  `-yt` validator warns on colon connectors, spelled identifiers and «¿Y …?» formulas (it no longer asks for
  a question per scene). Own recordings can be sped up: `narration.json` → `"recording": { "tempo": 1.08,
  "maxPauseMs": 250 }` (provisional values; absent = tempo 1, older videos re-import unchanged).
- **Remotion on this machine:** when the CPU is busy, the CLI's bundling blocks the event loop and
  Chrome's connection times out after 25 s. `render.mjs`/`qa-frames.mjs` therefore bundle first;
  for ad-hoc renders do `remotion bundle` then render from the bundle dir. In the Bash tool,
  Remotion renders need the sandbox disabled.
- **Bash gotcha in this harness:** commands containing backticks fail to parse before running —
  write patch scripts to a file (or use Edit/Write) instead of inline heredocs with backticks.
- `.claude/settings.local.json` has **stale hardcoded Bash paths** from a previous location
  (`/c/1ALLDOCUMENTS/ClaudeCodeProjects/TICourse`). Harmless but outdated — safe to fix if editing
  that file.
