# Catálogo de piezas de escena (`engine/src/ui`)

Piezas reutilizables sacadas de V4 (`video/pivot-infra/src/scenes/`), para que cada escena nueva
no reinvente consolas, tablones o fichas. Todo entra por props; los frames (`at`, `from`, `promptAt`…)
son **relativos a la Sequence** de la escena — nunca leen el timeline. Cada pieza acepta `frame`
opcional (por defecto `useCurrentFrame()`). Colores con `tone`: un acento del tema, `'sky'` o un
`#rrggbb`. Tamaños por defecto según la revisión del 2026-09-29 (§2): lo que explica la voz a 48–60 px
(`FOCUS_TEXT`), comprobado a 480 px de ancho. Se importan de `engine/src/ui` (índice).
QA visual: composición `UiGallery` (carpeta *dev* de cualquier vídeo, `src/dev/SceneKitGallery.tsx`).

| Pieza | Para qué | Props principales | Origen en V4 |
|---|---|---|---|
| `Focus` + `focusWeights` / `focusIndex` / `useFocus` / `dimStyle` | «Amplía lo que explica la voz y atenúa el resto»: escala el foco y deja lo demás a ~40 % de opacidad, media saturación y algo más pequeño. Los helpers dicen cuál de N elementos está en foco a partir de sus frames de inicio. | `focus` (0–1, boolean o `[from, to]`), `dim`, `scale`, `origin`; `focusWeights(frame, starts, { end })` → `{ weights, dims }` | `S05Cert.tsx` (`dimStyle` de `parts/s05-cert/bits.tsx`), `S11Recap.tsx` (`dimOf`) |
| `Terminal` | Consola: barra de título (icono + título + chip), comandos tecleados tras `$`, salida, filas-resultado resaltadas con chip, filas censuradas, desenfoque para «texto que pasa»; hace scroll si se llena. | `title`, `chip`, `lines: TerminalLine[]` (`kind` cmd/out/result/redacted/gap, `at`, `text`, `tag`, `note`, `focus`), `width`, `height`, `resultSize` | `S03Pdns.tsx` (`Console`) y `parts/s05-cert/PdnsConsole.tsx` |
| `Building` | Recurso compartido: bloque de pisos con ventanas deterministas (gris rutina, cian dato, ámbar aviso) que se encienden planta a planta; ventana resaltada (el sospechoso) y etiqueta. `buildingWindowCenter` da el centro de una ventana para trazar hilos. | `width`, `height`, `cols`, `rows`, `seed`, `mix`, `tone`, `glow`, `highlight: { col, row, at }`, `label`, `sub`, `at` | `S04Tenants.tsx` (`Block`, `MiniBuilding`), `parts/s01-hook/Problem.tsx` |
| `House` | Recurso dedicado: una casa, un inquilino (esmeralda); la ventana se enciende y muestra al inquilino. | `width`, `tone`, `glow`, `tenant`, `label`, `sub`, `at`, `litAt` | `S04Tenants.tsx` (`House`), `parts/s11-recap/Rules.tsx` |
| `KeyBadge` | La «llave hecha a mano» (certificado autofirmado, lo que es solo del actor): llave en círculo luminoso o baldosa pequeña, con etiqueta grande y píldora mono. | `size`, `shape` circle/tile, `tone`, `glow`, `label`, `sub`, `direction`, `at` | `parts/s05-cert/bits.tsx` (`KeyBadge`), `S06Ct.tsx` («autofirmado»), `Rules.tsx` (`HandKey`) |
| `NoticeBoard` | Tablón público (p. ej. CT logs): cabecera + avisos que se clavan en una rejilla en sus frames; aviso censurado o resaltado que crece con sus etiquetas. | `title`, `chip`, `notices: Notice[]` (`title` o `null`, `meta`, `code`, `at`, `slot`, `tone`, `badge`, `grey`, `focus`, `tags`), `cols`, `rows`, `width`, `height` | `S06Ct.tsx`, `parts/s06-ct/Notice.tsx` |
| `RecordCard` | Ficha campo/valor (WHOIS, registro…): valores censurados con barrido, tecleados, fila resaltada con el valor ampliado, chip a la derecha; variante `older` = versión antigua detrás que se asoma y se desliza a la derecha. | `title`, `rows: RecordRow[]` (`label`, `value`, `at`, `typed`, `redacted`, `redactAt`, `redactedLabel`, `focus`, `tag`), `footer`, `older`, `width`, `dim` | `S07Whois.tsx` (`Card`), `parts/s07-whois/shared.tsx` |
| `StageTimeline` | Línea de etapas horizontal: nodos con icono, título y subtítulo; el raíl se dibuja y se rellena hasta la última etapa encendida (color de cada etapa); la actual late y crece; viñeta opcional encima. | `stages: TimelineStage[]` (`title`, `sub`, `icon`, `tone`, `at`, `dashed`, `above`), `width`, `drawAt`, `focusEnd` | `S08Lifecycle.tsx` (`Rail`, `Node`, `Vignette`) |
| `RuleCards` | N tarjetas de regla (número, icono o ilustración, título de 54 px, subtítulo) que se encienden de una en una; las anteriores se atenúan; `dimFrom` las atenúa todas (p. ej. llega la llamada a la acción). | `rules: RuleCardDef[]` (`title`, `sub`, `icon`, `art`, `tone`, `at`), `width`, `height`, `slotAt`, `dimFrom` | `parts/s11-recap/Rules.tsx`, `S11Recap.tsx` |
| `Redacted` | Censura anti-spoiler dibujada con CSS (nunca el glifo ▇: las fuentes son subconjuntos latinos): barra, nombre de dominio (barra · punto · TLD) o bloque con el texto del registro; barrido y tachado. | `width`, `height`, `tone`, `tld`, `label`, `sweep` (0–1), `strike` (0–1), `glow` | `parts/s05-cert/bits.tsx` (`RedactBar`), `parts/s07-whois/shared.tsx` (`RedactedName`), `S07Whois.tsx` (`Redaction`) |

Notas para quien construye escenas:

- Una pieza no se coloca sola: envuélvela en un `div` con `position: absolute; left; top` (coordenadas del
  escenario, 1728×660 dentro de `STAGE`). `Focus` usa `transform`: no le pases tu propio `transform` en `style`.
- `RecordCard` con `older` necesita sitio para dos fichas (`width + gap + width`); `NoticeBoard` hace crecer el
  aviso en foco hacia dentro del tablón y pone sus etiquetas debajo (o encima, en la última fila).
- `NoticeBoard`, `StageTimeline`, `RuleCards` y `RecordCard` encogen solos el texto que no cabría a su tamaño
  de foco; `Terminal` no (ajusta `width` o acorta la línea). Revisa siempre el fotograma a 480 px de ancho
  (`remotion still … --scale=0.25`).
