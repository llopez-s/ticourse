# Shared parts — V19 «SQL injection y XSS» (`inyeccion-halden`)

Conventions (all parts, as V17): nothing positions itself (wrap each part in an absolutely positioned div, stage-local
coordinates, stage 1728 × 660); `at` props are frames relative to the scene's Sequence, every other animated prop is a
0–1 weight the scene computes (from `props.cue(...)` / `wordFrame(...)`, never a hard-coded frame); deterministic;
text the voice points at ≥ 32 px. Strings live in `src/data/*.ts`; the payload, the script and the query are ON SCREEN
ONLY (the voice never reads them), `enviar(...)` does not exist and there is no domain, host or address anywhere.

The through-line images (they must stay the same drawing wherever they come back):

| Image | Part | Where |
|---|---|---|
| the form with a hole → the pre-printed form with a box per datum | `PortForm` (`box` 0 → 1) | s02 `form` (hole), s03 `form-box` (boxes), s05 `same-root`, s06 rule 1 + end card, poster |
| the cartel (repeats what you ask) → the notice board (what one pins, all read) → the display case | `Cartel`, `Tablon`, `Vitrina` | s04 `board`, s05 `vitrina`, s06 rules 2 and 3 + end card |
| the three boxes | `ThreeScreens` | s01 (promise), s05 `action` |

## `kit.tsx` (scene kit, in `scenes/`)

`Stage`, `segment`, `wordFrame` (from the other videos) plus `overlayWindows(sceneId)` (the scene's intercept and
think-prompt windows in local frames, 14-frame lead) and `cardWindow(sceneId, 'intercept' | 'think')`. Both cards draw at
the top-centre of the stage (stage-local y 10–200): anything there steps aside, anything else sits below y 230.

## `bits.tsx`

`EXAM_TEXT` (violet), `PAPER*` colours, `pop(show)`, `between(...)`, `TermName` (the exam name: big violet caps,
growing underline, optional sub line; `\n` allowed in `text`), `Attr` (icon + one line the voice says), `Pill`, `Lit`,
`MonoChip`.

## `WebWindow`

`width`, `height`, `url` (mono ReactNode) or `title` (sans), `urlSize`, `accent`, `glow`, `dim`; body-local children,
`WIN_BAR` = 60.

## `Login.tsx`

- `LoginScreen`: `user` (visible text, cyan), `dots`, `caret`, `error` (0–1, «usuario o contraseña incorrectos»),
  `session` (0–1, «Sesión abierta · sin contraseña», rose), `glowUser`, `glowPass`, `glow`, `frame`. Window 540 × 552.
- `MiniScreen` / `ThreeScreens` (`screens`, `show[3]`, `lit[3]`, `dim`): the three small screens of the test copy with the
  numbered name under each; design width 1728.

## `QueryBlock.tsx`

- `QueryBlock` (`state: QueryState`, `size`): the lesson's query as three mono lines, program white, the person's text
  cyan. State weights: `typed` (characters of the payload in the name slot), `emptyPass`, `quote`, `always`,
  `comment` (those parts of the payload turn white / amber / rose and the rest of the line is struck in grey),
  `hole` (name slot lit, rest dimmed), `params` (the corrected query: `?` marks), `marks` (marks glow), `boxFill`
  (the name mark holds the person's text, inside its box). `QUERY_REST` is the all-zero state.
- `QueryNote` (callout under a part of the query), `RowsTable` (`rows`, `show`, `lit`): the `users` table; `lit` 0
  leaves it neutral (s03: nobody has that name).
- Payload part indices (`data/query.ts`): `[0,1)` quote, `[1,8)` « OR 1=1», `[8,11)` « --».

## `PortForm.tsx`

`PortForm` (`box` 0–1 hole → box, `slip` 0–1 pastes the cyan slip with the payload, `tape` 0–1 lets it run over the
rest of the sentence (hole form only), `ok` 0–1 the «la frase sigue igual» tick (boxed form), `glow`, `scale`). Design
920 × 330 (`FORM`).

## `Page.tsx`

- `Vitrina` (`w` 0–1 draws the glass and sweeps the sheen once, `lock` 0–1, `pad`): exists from `w` > 0 only.
- `PageBody` (`encoded`, `vitrina`, `lock`, optional `caption` + `captionW`): the results page; before encoding it shows
  nothing after «Resultados para:» (the browser would run the text).
- `SourceView` (`width`, `encoded`, `lit`): the page's source, the person's text untouched (cyan); encoded, the
  `&lt;` / `&gt;` the server changed in emerald. Needs ≥ 1100 px for the encoded line at 32 px.

## `Signs.tsx`

`Person` (silhouette, never an account), `CookieIcon` (`dashed` = only a possibility), `Cartel` (`width`, `show`),
`Tablon` (`width`, `hot` pins the cyan script notice, `readers` three silhouettes with dashed bolts), `Arrow`.

## `Run.tsx`

`RunDiagram` (design 1500 × 440): server → text → the browser of whoever followed the link; `send`, `bolt` (the script
runs), `person`, `cookie` (0–1 along a dashed road), `maybe` (the word «podría» and the outside site, drawn dashed:
a possibility, never a completed theft). The scene scales it down (0.62) when REFLECTED takes the right side.
