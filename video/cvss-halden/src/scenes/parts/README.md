# Shared parts — V18 «Triaje de vulnerabilidades» (`cvss-halden`)

Conventions (all parts): nothing positions itself (wrap each part in an absolutely positioned div, stage-local
coordinates, stage 1728 × 660); `at` props are frames relative to the scene's Sequence, every other animated prop is a
0–1 weight the scene computes; optional `frame` (default `useCurrentFrame()`); deterministic; text the voice points at
≥ 32 px. Every on-screen string lives in `src/data/*.ts` (the CVE numbers, hosts, vectors and versions are screen-only:
the voice never reads them). Date idiom, once for the whole video: day-month without a leading zero, lower case, date
first («jueves 1-10 · 09:00», «lunes 5-10 · 08:30», «1-10 · 18:00», «1-04-2027»).

## `Hull.tsx` — THE image: the cargo ship with a hole in her hull

One drawing (design 1000 × 520) used by s02 (two ships), s03 (mini ships in the heads), s04 (bulkheads and pump), s05
(patched, dry bilge, painted sign), s06 (three miniatures and the end card) and the poster. The hole is the CVSS score
(its size, in the abstract); the sea is the context. Layers, back to front: dry dock · storm clouds and rain · back sea ·
the hull (rocks in a storm) · front sea (translucent, over the lower hull) · inside of the hull · the hole or its weld
patch · the painted sign. Waves, rain and rocking read the Sequence frame (deterministic).

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | px | — | height = `hullSize(width, crop).h` (full: × 0.52) |
| `crop` | `'full' \| 'lower'` | `'full'` | `lower` = the lower half (waterline, bilge) for rule 3's miniature |
| `sea` | 0–1 | 0 | open water around the ship (edges fade out) |
| `storm` | 0–1 | 0 | needs `sea`: higher waves, clouds, rain, the ship rocks |
| `dock` | 0–1 | 0 | dry dock: basin walls, ground, keel blocks, shores. Drain `sea` first |
| `hole` | 0–1 | 1 | the hole draws in |
| `holeLabel` | string \| null | null | pill under the hull with a dashed leader to the hole (the score, «9.8») |
| `labelSize` | px | 46 | font of that pill |
| `patch` | 0–1 | 0 | a welded steel plate over the hole (the fix) |
| `cutaway` | 0–1 | 0 | the hull opens to show its inside (forced on by the next four) |
| `bulkheads` | 0–1 | 0 | the two mamparos around the hole; the flooded compartment stays between them |
| `pumps` | 0–1 | 0 | the bilge pump (bomba de achique) with its pipe and the drops it throws |
| `bilge` | 0–1 | 0 | the sentina highlighted |
| `bilgeWater` | 0–1 | 0 | water level in the bilge (0 = dry) |
| `bilgeOk` | 0–1 | 0 | the green check on a dry bilge |
| `sign`, `signShow` | string, 0–1 | — | a board painted on the bow (s05: «msgq/3.1.4»; 24 design units: illegible below ~700 px, zoom it in a callout) |
| `glow`, `dim`, `show` | 0–1 | 0 / 0 / 1 | whole part |

Helpers: `hullSize(width, crop)` → `{ w, h, k }` (k = px per design unit); `hullPoint(width, which, crop)` with
`which` = `hole`, `label`, `bulkheadL`, `bulkheadR`, `pump`, `bilge`, `sign`, `waterline`, `keel`, `bow`, `stern`, `deck` —
px from the top-left of the drawing (hang labels and leaders on these).

```tsx
// s02: the same hole twice; the sea comes in, then the right ship drains into the dry dock and the left one gets the storm
<Hull width={800} sea={seaAll} storm={stormL} holeLabel="9.8" />
<Hull width={800} sea={seaAll * (1 - dockR)} dock={dockR} holeLabel="9.8" />
// s04: the same hull, its mamparos and its pump
<Hull width={700} sea={1} bulkheads={bulk} pumps={pump} />
// s05: patched, dry bilge with its check, the painted sign
<Hull width={420} sea={1} patch={1} bilge={0.8} bilgeOk={1} sign="msgq/3.1.4" />
```

## `Finding.tsx` — the scan's findings in the SOC queue

- `ScoreBadge({ score, sev, size, withSev, lit })` — «9.8 CRITICAL» / «8.1 HIGH» (mono score, severity word in English).
  `SEV_TONE` holds the two reds (the 8.1 is a notch softer and never wears the word CRITICAL).
- `QueueRow({ width, height, host, score?, sev, lit, dim, show, hostSize, toneColors?, children, right })` — severity bar,
  host (mono), `children` between host and score, `right` before the score. `lit` 0–1 is how bright the row is
  («a media luz» = 0.55); `toneColors` re-tints it (a closed finding turns emerald).
- `DataSeal({ size, show })` — the dashed «datos ficticios» pill that goes next to every invented CVE.

## `Options.tsx` — `OptionTile` (s04's four options)

`OptionTile({ main, terms, width, height, show, cross, lit, litTone, dim, mini })`. `main` is the Spanish word the voice
says (46 px), `terms` the exam words in English under it (mono 30 px). `cross` 0–1 strikes it out (rose strike, cross,
dimmed); `lit` 0–1 tints it and shows a check; `mini` is the strip version (one line, 34 px, no terms) for the top of
the stage once the hull arrives.

## `ExceptionRecord.tsx` — «Excepción · registro»

`ExceptionRecord({ width, title, fields: RecordFieldDef[], at, glow })`. `RecordFieldDef` = `{ key, label, value, at,
note?, noteAt?, tone? }`. Each row is a dashed empty field until its `at`, then its value types in (the layout is
reserved up front: nothing jumps); a row may carry a small note that fades in on `noteAt`; `glow` (`{ [key]: 0–1 }`)
lights a row (the expiry date as the voice says it). The card lands on `at` (sfx «lock» comes from the narration).

## `HostConsole.tsx` — s05's console on the machine

`HostConsole({ width, at, dim, glow })`, `at` = `{ cmd, version, changes, pkg, service, noReboot }` (frames). The
command `msgq --version` types and prints `3.1.7`; then the change log («1-10 · 18:00 · msgq 3.1.4 → 3.1.7», the
arrow drawn with the engine's `arrowRight` icon — the fonts are latin subsets, never the → character), the installed
package, the service start time and the chip «no falta ningún reinicio» (32 px, its own line). Strings in
`data/s05-despues.ts`. Needs ≈ 1100 px of width so the 30 px labels stay on one line.

## `Acta.tsx` — «el acta del armador»

`Acta({ width, show, sign })`: a sheet with bars for text (never letters), a signature stroke that draws with `sign`
0–1, a round seal and a clock for the expiry. Only s06's rule-2 miniature uses it.

## Strings these parts print that are not in the storyboard's canon

«Cola del SOC» (s01 panel title), «srv-msg01 · en el equipo» and the console's row labels («registro de cambios»,
«paquete instalado», «servicio activo»; the storyboard names the facts, not the labels), «Excepción · registro» (the
record's title), «la ficha del equipo · lo que la nota no sabe» (s02's third column caption), «CVE · el nombre público
del fallo», «CVSS · severidad · de 0 a 10», «riesgo · lo pone el contexto» (s02's exam terms), the three rule titles in
`data/s06-recap.ts` and the lab chip «Vulnerability Triage» (the lab's own title).
