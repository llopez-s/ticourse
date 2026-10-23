# Tanda GCTI · G01–G07 · estado (23-10-2026, congelados)

Siete guiones escritos, revisados dos veces (exactitud y naturalidad; luego una segunda pasada de exactitud sobre el texto corregido) y **congelados el 2026-10-23** (`"frozen"` en cada `video.json`). Las hojas de grabación están regeneradas como «Guion para grabar» (versión definitiva).

Informes: `docs/reviews/2026-10-23-guiones-gcti/` (cuatro de la primera pasada y dos `recheck-*`). Hoja de cada vídeo: `video/<slug>/out/guion-grabacion.md` (ignorada por git). Notas: `video/<slug>/out/script-notes.md`.

| ID | Slug | Lecciones | Perfil | Estimado | Tarjetas | Intercepts | Pensar |
|---|---|---|---|---|---|---|---|
| G01 | `dato-a-juicio` | s1m1 + s1m2 | principal-yt | 9:19 | 7 | 3 | 2 |
| G02 | `niveles-audiencia` | s1m3 | capsula-yt | 4:04 | 4 | 2 | 1 |
| G03 | `ciclo-pir` | s1m4 + s1m5 | principal-yt | 9:01 | 7 | 4 | 2 |
| G04 | `sesgos-analista` | s4m1 | capsula-yt | 3:53 | 4 | 2 | 1 |
| G05 | `producto-bluf` | s5m1 + s5m2 | principal-yt | 8:58 | 7 | 4 | 2 |
| G06 | `casos-espejo` | s5m4 | principal-yt | 9:12 | 7 | 3 | 2 |
| G07 | `examen-indice` | s6m1 + s6m2 | principal-yt | 8:40 | 6 | 4 | 2 |

Con tu lectura habitual (85–93 % del estimado) los principales quedan entre 7:30 y 8:30.

## Decisiones comunes ya tomadas

- Voz de EMBER FOX en G01–G03 (y de VELVET CICADA en G05–G07): `sapi/Microsoft Pablo` con el efecto `machine`. Los mensajes de EMBER FOX no usan «analista» (es el tic de PAPER CRANE) y cierran como un vendedor suave («no te compliques»).
- Una imagen por vídeo, sin repetirlas: capitán sin GPS (G01), club de fútbol (G02), restaurante (G03), báscula (G04), tormenta y pronóstico (G05), expediente que engorda y perchero (G06), páginas de índice (G07).
- En G07 se quitan todas las cifras del examen (preguntas, tiempo, nota). Giac.org solo sale en pantalla.

## Decisiones tomadas (23-10-2026, a petición de Lidia: «decide tú»)

- **Fútbol en G02:** se queda (jugador = tactical, entrenador que estudia al rival = operational, directiva = strategic).
- **G05, «GLASS VIPER»:** se queda en pantalla, sin voz, con el texto literal de la lección.
- **Pronunciaciones:** se quedan las propuestas de cada `lexicon.json`; se corrigen con una línea si al escucharla no te encajan.
- **Secuencia G01/G03:** «tu primera mañana» y «tu primer encargo».
- **EMBER FOX:** la ficha es «EMBER FOX · célula de acceso inicial · spearphishing» en los tres vídeos de la sección 1.

## Pendiente antes del montaje (no de la grabación)

- **G06:** el motor pone «Simulación educativa · datos ficticios» en pantalla (`SimulationTag`) y en la cabecera de la transcripción y de la descripción de YouTube. G06 cuenta casos reales: hay que rotularlo distinto al montar las escenas y ajustar a mano la descripción. No se incluye que los países mencionados niegan las atribuciones (la lección no lo dice).
- Refrescar en el storyboard de G07 las referencias a líneas de `s6.ts` (se movieron unas 5–7 líneas).

## Cambios en las lecciones (hechos el 23-10-2026, sin commitear)

- `src/data/s6.ts`: examen GCTI con las cifras de la página oficial (82 preguntas, 3 horas, nota mínima 71 %, comprobadas en giac.org el 23-10-2026); ritmo de ~130 s por pregunta, y la pregunta de práctica y su explicación con 82 y 130 s. El simulacro propio de la app (25 y 50 preguntas) no cambia.
- `src/data/tracks.ts`: la descripción del simulacro dice 82 preguntas y 3 h.
- `src/data/s6.ts` (tabla de dominios): «TLP aplicado» en Dissemination; TLP se define en S3M4 y se aplica en S5M3.
- `src/data/s6.ts` (página de índice de ejemplo): micronotas de una línea, como dice el texto.
- `src/data/s5.ts` (s5m4): el cuadro de campaña ya no dice «acceso vía proveedores» (canon §5 punto 4); «alimentó» y «confirmando» pasan a redacciones que no afirman causa («años después… presentó», «coincidiendo en buena parte»); «décadas» pasa a «mucho después».
- No he podido ejecutar `npm test` ni `tsc` (el worktree no tiene node_modules): son cambios de texto en literales y ningún test fija esas frases. Conviene lanzar `npm test` antes de fusionar.

## Canon que apuntar al cerrar cada vídeo

- G01–G03: los mensajes de EMBER FOX (primeros de la campaña), su presentación como «célula de acceso inicial · spearphishing», y «alojó un panel de phishing el martes» sobre la IP `141.98.6.10` sin decir nunca que sea suya.
- G05: GLASS VIPER en pantalla sin voz; la hoja del flash sin `Ref`; la decisión del CISO como ejemplo de la lección, no como decisión de Meridian.
- G06: la pregunta del CISO «¿esto ya ha pasado antes?», tres mensajes nuevos de VELVET CICADA y las etiquetas «conjunto 1/2» para los dos intrusion sets del DNC.

## Siguiente paso

Grabar con las hojas «Guion para grabar» (orden recomendado: G01, G02, G03, G04, G05, G06, G07), importar con `import-recording.mjs`, montar las escenas y, al cerrar cada vídeo, apuntar su canon nuevo en `docs/superpowers/canon/velvet-cicada.md`.
