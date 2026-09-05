# Cross-device progress sync via sync code — design

Date: 2026-09-05 · Status: approved in chat by Lidia · Path: architectural

## Goal

Let one learner continue studying across devices (laptop ↔ phone) without losing progress.
A **sync code** identifies a private progress bucket; the app pulls, merges and pushes the
`ProgressSnapshot` it already keeps in `localStorage`.

No accounts, no email, no passwords. The app stays a static site on GitHub Pages; a small
Cloudflare Worker backed by KV stores one JSON blob per code.

## Non-goals

- No user accounts, email, passwords or OAuth.
- No sharing or comparing progress between different people.
- No server-side merge logic — the Worker is a dumb key-value box.
- No real-time or cross-tab live sync.
- Worker deployment is **not** wired into CI (that would require a Cloudflare API token as a
  repo secret for no real benefit).
- Sync stays **opt-in and off by default**. With no code entered, no network code path runs and
  the app behaves exactly as it does today.

## Threat model and privacy

- The code is hashed **in the browser** with SHA-256; only the 64-char hex digest reaches
  Cloudflare. The plaintext code never leaves the device, so a code containing a personal name
  does not disclose that name to the service.
- The digest is a **bearer secret**: anyone who knows the code can read and overwrite that
  bucket. There is no second factor. Users are told to pick a high-entropy code; the UI shows a
  generated suggestion and warns on short codes (< 16 characters) without blocking.
- The stored blob contains **study progress only** — lessons completed, scores, XP, streak,
  flashcard scheduling, achievements, exam history. No name, email or free text.
- The Worker exposes no listing or enumeration endpoint. Cloudflare's dashboard shows key
  digests, never codes.
- The code is stored in `localStorage` under its own key, **outside** the progress blob, so it is
  never itself uploaded.

## Architecture

```
Browser (GitHub Pages, static)                    Cloudflare
┌──────────────────────────────┐                 ┌─────────────────────┐
│ Zustand store (localStorage) │                 │ Worker ticourse-sync│
│   ProgressSnapshot           │  GET /p/:hash   │   GET  → blob|404   │
│                              │ ──────────────► │   PUT  → store      │
│ lib/sync.ts                  │  PUT /p/:hash   │                     │
│   sha256(code) → hash        │ ◄────────────── │ KV namespace        │
│   mergeProgress(a,b) (pure)  │                 │   PROGRESS          │
│ components/SyncPanel.tsx     │                 │   hash → {v,data,ts}│
└──────────────────────────────┘                 └─────────────────────┘
```

`localStorage` remains the source of truth. Sync is additive: pull → merge → save locally →
push the merged result. The operation is idempotent, so repeating it changes nothing.

## The merge function

`mergeProgress(a, b): ProgressSnapshot` in `src/lib/sync.ts` — pure, no network, no clock reads.
Study progress is almost entirely monotonic, which is what makes a safe merge possible.

| Field | Rule | Why |
|---|---|---|
| `track` | keep local | UI preference, not progress |
| `xp` | `max` | monotonic; avoids double-counting on repeated syncs |
| `streak.best` | `max` | a record, never decreases |
| `streak` (rest) | from the side with the later `lastDay`, **except** that when the two `lastDay`s are consecutive the older side's `current + 1` is carried forward (`current` takes the max of the two); tie on `lastDay` → greater `current`, then greater `freezes` | the more recent device knows the live streak, but it may have reset its own counter while offline — see below |
| `activity` | union of days, `max` per day | **never sums** — re-syncing must not inflate the heatmap |
| `lessons`, `labs` | union (`true` wins) | completion is irreversible |
| `quizBest`, `bosses` | union, `max` per key | best score is a record |
| `exams` | concatenate, de-duplicate, sort by date | history is append-only |
| `srs` | per card: greater `reps`; tie → later `due`, then greater `interval`, then fewer `lapses` | the more-reviewed card carries the better schedule |
| `calibration` | per level: the side with greater `n`; tie → greater `c` | picking field-wise maxima could yield `c > n`, an impossible state |
| `totals` | `max` per field | all are counters or records |
| `achievements` | union, keep the **earliest** unlock date | an achievement cannot be un-earned |
| `day` | later `date` wins wholesale; same date → `max` per counter, union `questsAwarded` | daily counters reset at midnight |

**Why the streak rule is not simply "later date wins".** An earlier draft of this design took the
later-`lastDay` streak wholesale. That loses data in the ordinary case: a phone that has not synced
for a week is used offline, resets its own `current` to 1 because it cannot see the laptop's
activity, and then wins the merge on date — turning a 57-day streak into 1, irreversibly, in both
merge orders. Carrying the older side forward when the days are consecutive fixes that while still
breaking the streak on a genuine gap. `dayDiff` is pure arithmetic over two date strings, so the
merge stays clock-free.

**Accepted trade-offs, stated explicitly:**

- **XP is maxed, not summed.** Studying on two devices in parallel keeps the higher total rather
  than the sum. Chosen because summing double-counts every time a sync repeats, which is far
  worse than under-counting a rare parallel session.
- **Exam de-duplication** keys on `date|track|pct|correct|total`. Two genuinely distinct mock
  exams with identical date and identical results collapse into one row. Adding an `id` to
  `ExamResult` was considered and rejected: it changes a persisted type and existing saved data
  has no id, so the migration cost outweighs a cosmetic duplicate.
- **Calibration counters** come from one side, so a parallel session's bets on the other device
  are lost. Any field-wise combination risks producing an invalid `c > n`.

Every comparator is **total and deterministic on content**, which is what makes the function
commutative — merge order cannot change the result.

## Worker contract

Routes (`hash` = exactly 64 lowercase hex characters; anything else → `400`):

| Method | Path | Request | Response |
|---|---|---|---|
| `GET` | `/p/:hash` | — | `200 {"v":1,"updatedAt":"<ISO>","data":{...}}` · `404` if absent |
| `PUT` | `/p/:hash` | `{"v":1,"data":{...}}` | `200 {"ok":true,"updatedAt":"<ISO>"}` |
| `OPTIONS` | `/p/:hash` | — | `204` + CORS preflight headers |
| any | anything else | — | `404` |

- Body larger than **512 KB** → `413`. Malformed JSON → `400`.
- CORS `Access-Control-Allow-Origin` is an allow-list: `https://llopez-s.github.io` and
  `http://localhost:5173`. Requests from other origins get no CORS headers.
- KV binding `PROGRESS`. Value is `{v, updatedAt, data}`; `v` is a schema version for future
  migrations.
- Abuse control is the size cap plus Cloudflare's default protections. No custom rate limiter —
  a WAF rate rule can be added later if it ever matters.

## Client

**`src/lib/sync.ts`** — `hashCode(code)` (trim + lowercase before hashing, so casing and stray
spaces cannot create two buckets), `mergeProgress(a, b)`, `pull(hash)`, `push(hash, snapshot)`,
and `SYNC_URL`. `SYNC_URL` is a build-time constant; it is a public URL, not a secret. When it is
empty the whole feature is inert and the panel says sync is unavailable.

**`src/lib/syncStore.ts`** — a small Zustand store persisted under `intelforge-sync`, separate
from the progress store: `{ code, status, lastSyncedAt, error }` where
`status: 'off' | 'syncing' | 'ok' | 'error'`. Kept separate so the code is never uploaded.

**`src/components/SyncPanel.tsx`** — rendered on the Profile page: code input (with a
"generar código" button producing a high-entropy suggestion), a low-entropy warning, connection
status, last-synced time, "Sincronizar ahora", and "Desconectar" (clears the code, keeps local
progress).

**Triggers.** Full sync on app mount when a code is set. After that, a debounced push 5 s after
progress stops changing, and a `keepalive` push when the tab is hidden. Manual sync any time.

**Failure behaviour.** Network errors surface as a visible `error` status with the message; local
progress is never modified by a failed pull, and a failed push is retried on the next trigger.
Offline, the app is exactly as it is today.

**Edge cases, resolved explicitly:**

- **First sync / unknown code (`404`).** Treated as an empty remote, not an error: local progress
  is pushed as-is and the bucket is created. Typing a wrong code therefore uploads your progress
  to that wrong bucket rather than destroying anything locally — the reason the panel asks for
  confirmation the first time a code is used on a device.
- **Unrecognised schema version.** If a pulled blob has a `v` the client does not know, the pull
  is ignored and the status shows an error. The client never merges data it cannot interpret and
  never overwrites the remote in that state, so a newer device cannot be clobbered by an older
  one.
- **Empty or whitespace-only code.** Rejected by the panel; sync stays off.

## Files

| File | Change |
|---|---|
| `src/lib/sync.ts` | create — hashing, merge, API client |
| `src/lib/sync.test.ts` | create — merge property and rule tests |
| `src/lib/syncStore.ts` | create — sync state |
| `src/components/SyncPanel.tsx` | create — Profile UI |
| `src/pages/ProfilePage.tsx` | modify — mount `SyncPanel` |
| `src/App.tsx` | modify — mount the sync effect once |
| `worker/src/index.ts` | create — the Worker |
| `worker/wrangler.toml` | create — name `ticourse-sync`, KV binding `PROGRESS` |
| `worker/README.md` | create — deploy steps |
| `README.md`, `CLAUDE.md` | modify — correct the privacy claim, document sync |

The root `tsconfig.json` and `vitest.config.ts` both scope to `src`, so `worker/` is excluded
from the app build and test run by construction. The Worker keeps its own `package.json`.

## Testing

`src/lib/sync.test.ts`, all pure:

- **Idempotent:** `merge(a, a)` deep-equals `a`.
- **Commutative:** `merge(a, b)` deep-equals `merge(b, a)` across several fixture pairs.
- **Monotonic:** no counter, best score or total in the result is lower than in either input.
- **No loss:** every completed lesson, lab and achievement from either side survives.
- **Field rules:** activity maxes rather than sums; achievements keep the earliest date; the
  more-reviewed flashcard wins; calibration never yields `c > n`; exams de-duplicate; the later
  `day` wins.
- **Hashing:** `hashCode` is stable and normalizes case and surrounding whitespace.

Manual verification: two browser profiles, sync A → B → A, confirm nothing is lost; disconnect;
offline behaviour; a wrong code yields an empty bucket rather than an error state.

## Rollout

1. Build client, Worker and tests with `SYNC_URL` empty — the feature is inert and everything
   else keeps passing.
2. Lidia runs `wrangler login`, creates the KV namespace and runs `wrangler deploy`, then gives
   me the `*.workers.dev` URL.
3. Set `SYNC_URL`, push, verify on the live site across two browsers.
