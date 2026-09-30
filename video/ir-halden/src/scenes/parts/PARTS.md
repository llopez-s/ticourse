# Shared parts of `ir-halden`

Three parts, identical in every scene. They never read the timeline: pass Sequence-relative frames and
0–1 weights computed in your scene (`props.cue`, `segment`, `wordFrame`, `progress`, `windowWeight`).

**Units, per part.**
- `Board`: **frames** for box steps (`{ at, state }`); **`FocusInput`** for `focus`/`dim` (a 0–1 weight, a
  boolean or a `[from, to)` frame window); **0–1 weights** for everything else (`compact`, `reveal`, `glow`,
  `boxGlow`, `condition`, `loop`, `show`).
- `Nave`: **0–1 weights** only (`open`, `lock`, `bricked`, `keyTaken`, `intruder`, `intruderHidden`, `glow`,
  `dim`, `show`). Drive them with `progress(frame, at, dur)`.
- `Leak`: **frames** (`dripFrom`, `mopAt`, `mopUntil`, `patchAt`) plus a static `state` shorthand; it animates
  by itself from `frame` (drops, mop).

Place every part in a `position: absolute` div with stage-local `left`/`top` (the stage is 1728×660, inside
`<Stage>`). Canon times: `CASE_TIMES` in `Board.tsx` (declared **16:09**, first containment **16:15**,
containment closed **10:30**).

## `Board` (`parts/Board.tsx`) — the case whiteboard

Full layout = the whole stage (1728×660); compact = a 150 px strip. Title «CASO IR-2026-0147 · Autoridad
Portuaria de Halden». Columns come from `COLUMNS` (ids `prep` `detect` `analysis` `contain` `eradicate`
`recover` `lessons`, with `es`, `en`, `condition`); use `columnName(id)` for the one-line Spanish name. Widths
follow the name lengths (the long names need them to stay at 40 px); a focused column widens and the others
dim and shrink their text.

Board props: `columns` (per id), `defaults` (merged under every column), `compact` 0–1 (morphs), `width`,
`height`, `compactHeight`, `focusGrow` (default 2.4), `autoDim` (default true), `ramp` (default 16),
`title` (bool or 0–1), `loop` 0–1 + `loopTone`, `show`, `frame`.

Column state (`ColumnState`):
- `box`: a static state or steps `[{ at, state, time? }]`; before the first step the box is empty.
  States: `empty` · `checked` (emerald tick draws in 12 f, `time` label fades in) · `wrong` (a ticked box turns
  amber, is struck in rose, holds, then empties — `WRONG_FRAMES` = 54 f; it keeps the previous `time` and
  strikes it too) · `pulse` (keeps its mark and breathes; use it for think prompts).
- `time`: label for a static `checked`.
- `focus`, `grow`, `dim`, `tone` (focus colour, default cyan).
- `glow` + `glowTone` (default emerald): highlight without resizing.
- `boxGlow` (the box + «¿terminada?»), `condition` + `conditionTone` (the condition line).
- `reveal` 0 = silhouette (grey bars, empty boxes; the title stays), 1 = written. `show` 0–1.
- `body`: a node or `(geo) => node`, drawn between the English name and «¿terminada?» (full layout only,
  clipped; ≈ 214 px high, ≈ 600 px wide when focused with `grow: 3`).

`boardGeometry(boardProps, frame)` returns the same layout the Board draws (board-local): per column `x`, `w`,
`innerX/innerW`, `focus`, `dim`, `box: { x, y, size, cx, cy }`, `body: { x, y, w, h }`, plus `height`. Pass it
the **same props** you give the Board to anchor overlays (a chip by a box, an improvement flying into
Preparación).

```tsx
const board: BoardProps = {
  columns: {
    detect: { box: 'checked', time: CASE_TIMES.declared },
    analysis: { focus: [props.cue('scope'), Number.POSITIVE_INFINITY] },
    contain: {
      box: [
        { at: props.cue('isolate') + 10, state: 'checked', time: CASE_TIMES.firstContainment },
        { at: segment(props, 's03-05').to - 140, state: 'pulse' },
      ],
    },
  },
};
<div style={{ position: 'absolute', left: 0, top: 0 }}><Board {...board} /></div>
const box = boardGeometry(board, frame).columns.contain.box; // add the board's left/top
```

Notes for the scenes that follow:
- **s01** ends on the board at stage (0, 0), full size, `defaults={{ reveal: 0 }}` — s02 starts from exactly
  that frame and writes the names in.
- **Compact strip and the top-centre band.** s06 has an intercept card in stage-local y 0–230 (x ≈ 400–1330)
  from before `segment('s06-01').from` to its `.to`; s03/s07 have think prompts there. A strip at the top of the
  stage sits under that card: lower it (e.g. `top: 480`) or fade it (`show`) during those windows.
- `loop` needs `BOARD_LOOP_SPACE` (64 px) free under the board: use `height ≤ 590`, or the compact strip.
- Keep earlier columns consistent with the story: Detección `checked` «16:09»; Contención `checked` «16:15»
  in s03, `wrong` in s04, `checked` «10:30» from s05 on.

## `Nave` (`parts/Nave.tsx`) — a port warehouse

Gabled shed, bi-parting sliding door, small gable window, number plate over the door; contents are seen only
through the open door (draw order interior, back crates, intruder, front crate, door). Art is 400×330 design
units scaled to `width` (default 320 → 264 px high); `label` (mono 32) and `sub` (sans 26) sit under it
(~80 px).

Props: `width`, `open` 0–1, `lock` 0–1 (cyan padlock on the closed door), `bricked` 0–1 (emerald bricks,
bottom row first), `contents` `'keys' | 'crates' | 'none'`, `keyTaken` 0–1 (the bright master key leaves the
rack), `intruder` 0–1 (rose), `intruderHidden` 0–1 (behind the front crate, only the top of the head shows;
needs `crates`), `plate`, `label`, `sub`, `labelTone`, `glow` + `glowTone`, `dim`, `show`, `frame`.

Helpers: `naveSize(width)` → `{ width, height, labelTop }`; `naveAnchors(width)` → px points from the nave's
top-left: `key` (the master key on the rack), `door`, `lock`, `window`, `plate`, `ground`; `NaveKey` = the same
amber key glyph, to fly it out.

```tsx
const W = 300;
const key = naveAnchors(W).key; // relative to the nave at (left, top)
<div style={{ position: 'absolute', left: 1200, top: 80 }}>
  <Nave width={W} open={1} contents="keys" keyTaken={progress(frame, out, 6)} label="ADM-WS-02" sub="donde viven las llaves" />
</div>
<div style={{ position: 'absolute', left: 1200 + key.x + flyX, top: 80 + key.y + flyY, transform: 'translate(-50%, -50%)' }}>
  <NaveKey size={70} glow={1} />
</div>
```

## `Leak` (`parts/Leak.tsx`) — roof hole, drops, puddle, mop

Art is 520×380 design units scaled to `width` (default 520 → 380 px high). The hole has a rose outline (the
cause); drops are sky; the patch is emerald.

Props: `width`, `state` (`'dripping' | 'mopping' | 'patched'`, static shorthand), `dripFrom` (default 0),
`dripEvery` (default 36 f), `mopAt` (mop walks in and sweeps), `mopUntil` (walks back; defaults to 110 f after
`patchAt`), `patchAt` (the patch slaps on; no drop leaves the hole afterwards, the one in the air still lands),
`dim`, `show`, `frame`.

Helper: `leakAnchors(width)` → `{ hole, puddle, mop, height }` in px, to hang your own labels («el síntoma»,
«la causa»).

```tsx
<Leak width={520} mopAt={props.cue('drip')} patchAt={wordFrame(S, 's08-03', 'tejado')} />
<Leak width={300} state="patched" />   // s10 rule-card art
```
