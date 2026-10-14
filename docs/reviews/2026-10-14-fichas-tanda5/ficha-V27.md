### V27 · s5m3 · Cápsula · «YARA y Sigma: del indicador a la regla»

> Propuesta del 2026-10-14, con las opciones recomendadas ya elegidas; pendiente de que Lidia diga qué cambia. Tanda 5;
> rama prevista `video-reglas-aeropuerto`, desde `main`. La versión vigente de escenas y guion será
> `video/reglas-aeropuerto/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/reglas-aeropuerto/out/script-notes.md`. Las decisiones, con la alternativa descartada de cada una, van al final
> de esta ficha («Decisiones de esta ficha»). **Revisada el 2026-10-14** contra `revision-gcti.md` y `reconciliacion.md`;
> lo que cambió, al final («Cambios de la revisión»).
>
> **Es el único vídeo GCTI de la tanda y el primero de S5** (`src/data/s5.ts` no tiene ningún bloque `video`). Continúa a V7
> (qué detectar: comportamiento antes que hash) con lo que V7 dejó sin contar: **cómo se escribe una regla** y qué mira cada
> una. Recoge también la mitad que V8 dejó fuera de s3m5 («YARA entera… si hace falta, otra cápsula», plan
> `docs/superpowers/plans/2026-09-25-lesson-videos.md:1153-1154`), aunque aquí la lección es la de S5.
> **Dos penalizaciones mandan en el diseño:** el Lab 3B ya practica YARA (elegir cadenas y umbral frente a cuatro muestras,
> `src/data/labs.ts:114-124,746-843`) y s3m5 ya enseña la anatomía (`src/data/s3.ts:1123-1163`). El vídeo **no enseña a elegir
> cadenas**: lee dos reglas ya hechas, cuenta qué mira cada una y qué las rompe. **Ninguna fecha, ningún hash, ningún equipo
> y ningún resultado:** la pared del canon (hashes, `winhlp.exe`, el PDB) manda en todo.
> **Tercera penalización (V7):** el nombre original, el nombre del disco tachado y la regla de la cadena entera ya los contó
> V7 (`video/attack-piramide`, s03 y s05). V27 los menciona con **una frase** y gasta el tiempo en lo que V7 no hizo: cómo se
> lee una regla Sigma (`logsource`, `selection`, `filter_expected`, `condition`), la condición de la YARA y qué rompe cada
> regla.

- **Carpeta:** `reglas-aeropuerto` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) ·
  objetivo GCTI **Dissemination** (dominio del curso de S5, `src/data/course-gcti.ts:89`, y de las diez preguntas de s5m3,
  `src/data/s5.ts:671-811`); las tarjetas llevan `"objective": "Dissemination"` e insignia «GCTI» · adversario **VELVET
  CICADA** (el de la sección, `src/data/course-gcti.ts:93`), dos mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · **voz del adversario: ya existe, la de V3, V4, V7, V8, V13, V14, V15
  y V22** (`"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`,
  `video/coa-precios/narration.json:11-15`) · música de V4 a V23 (`Go On Going - Stayloose.mp3`). No hace falta voz ni efecto
  nuevos. **Es la primera vez que VELVET CICADA habla** (ver «Canon nuevo» y «Decisiones»).
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "gcti"`, `"adversary": "VELVET CICADA"`, `"lesson": "s5m3"`, la
  música de arriba y `"tags"`: «YARA», «Sigma», «reglas de detección», «ingeniería de detección», «detection engineering»,
  «inteligencia de amenazas», «threat intelligence», «diseminación», «SOC», «GCTI». Título de YouTube: «YARA y Sigma: del
  indicador a la regla | GIAC GCTI en español».
- **Ritmo:** `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3500. En s04 el
  mensaje abre la escena y la pregunta llega muchos segmentos después (el validador no los deja en el mismo segmento).
- **Efectos (`sfx`):** los automáticos del motor y tres momentos con sonidos de la biblioteca que ya existen
  (`video/engine/sfx/`: `alarm`, `error`, `check`): `flood` («alarm», la pila de avisos falsos de s03), `miss` («error», la
  regla por nombre del fichero que no ve el nombre nuevo, s04) y `hit` («check», la regla por nombre original que sí avisa,
  s04). Los tres ids son únicos en todo el guion, que es lo que pide la tabla `sfx`.
- **Léxico nuevo** (formas propuestas; **se confirman con Lidia antes de congelar**, porque con su grabación el léxico solo
  debe llevar lo que ella dice): `YARA` («yara»), `Sigma` («sigma»), `certutil` («certútil»; V7 lo dice en voz sin entrada de
  léxico, `video/attack-piramide/narration.json`, s03-02). Reutiliza `SIEM` («síem», `video/capas-halden/lexicon.json`), `PDB`
  («pe de be», `video/hilos-pelicula/lexicon.json`), `EDR` («e de erre», `video/diamond-e7/lexicon.json`) y `SOC` («soc»,
  `video/attack-piramide/lexicon.json`). **Ninguna excepción de «lo que se lee no se deletrea»:** `OriginalFileName` va
  escrito en pantalla y la voz dice «el nombre original, el que el programa lleva por dentro». La voz **no dice «loader»**
  (sale solo en el nombre de la regla, como V8): dice «el programa».
- **Duración:** suma de `s` **218 s** (como V7, V8, V15, V22 y V23); `wordBudget` a 2,7 palabras/s: 49, 92, 124, 162, 97 y 65
  (589 palabras). El guion se queda en **unas 550**, por debajo del presupuesto, porque lleva dos mensajes (unos 4–5 s cada
  uno) y una pregunta de 4,5 s. Estimado de `build-timeline --estimate` ~4:10–4:15; con el ritmo de Lidia (V8 al 92 %, V9 al
  91 %), **~3:50–3:55** renderizados. Dentro de 190–260. No se rellena. s04 es la escena densa (60 s: mensaje, regla leída
  línea a línea, tres eventos de tres campos, pregunta y respuesta); el aligeramiento del solape con V7 libera ~5 s de ella
  (ya no explica el nombre original). Si el estimado pasa de ~255 s se recorta en este orden: primero, en s04, el evento del
  nombre legítimo (pasa a pantalla sin voz); después, en s04, la lectura de `falsepositives` (ya no se lee en voz, solo
  pantalla); después, en s05, los tres chips de la escalera (se quedan en pantalla, sin voz salvo la tira). **No se
  recortan** la regla de que una cadena genérica sola salta con medio mundo (es el check de `:568-582`), la frase de «si
  cambia de herramienta, la regla del nombre original ya no ve» (es s2m5q8, `src/data/s2.ts:1360-1373`) ni la de «una regla
  de YARA vive mientras el programa conserve esas piezas» (es lo que impide prometer de más). Si baja de ~195 s, se alarga
  s03, leyendo la condición línea a línea con más calma.
- **Inserción:** en `src/data/s5.ts`, lección s5m3, **después del primer check** («A YARA rule with condition `any of ($s*)`…»,
  `:568-582`) y **antes del encabezado «STIX/TAXII: el indicador empaquetado»** (`:583`), como bloque `youtube`:
  `{ t: 'video', title: 'YARA y Sigma: del indicador a la regla', youtube: '<id>', poster: 'videos/reglas-aeropuerto-poster.png', transcript: 'videos/reglas-aeropuerto-transcript.txt' }`.
  **El punto «después de los checks y antes de la Nota de examen» no existe en este fichero:** la nota de examen
  (`:630-635`) va antes de dos de los tres checks (TLP `:640-654` y «LONGEST-lived» `:655-669`). Se elige este hueco porque
  es el que cierra la mitad de la lección que el vídeo cuenta (`:488-567`, YARA, Sigma y su tabla) justo después de su check,
  como V8 cerró la mitad de STIX de s3m5 (`src/data/s3.ts:1116-1123`); el vídeo no habla de STIX, TLP ni de caducidad de
  indicadores, que son lo que viene después. **Coste que se acepta:** el vídeo queda antes del check 3 (`:655-669`, «¿qué
  forma de diseminación vive más?»), cuya respuesta (reglas de comportamiento) ya está en el texto de la lección
  (`:484`, `:564-565`) y es la idea del vídeo. Descartado ponerlo como último bloque, tras el check 3 y antes del `quiz`
  (`:669-671`, como V22): quedaría a tres secciones de lo que resume. Hay un tercer hueco, entre la tabla (`:558-567`) y el
  check 1, descartado porque destripa el check 1. Si Lidia prefiere no adelantar el check 3, el segundo hueco es el de
  después del check 3. Se fija en la suite `lesson videos` de `src/data/content.test.ts` (`:267-319`) con una línea
  `youtubeVideos.find(... '<id>')?.module → 's5m3'`.
- **Lo que se lee no se deletrea:** los nombres de regla, de campo y de fichero (`GLASSVIPER_Loader_MemMap`,
  `OriginalFileName`, `wcssvc.exe`, `vc_pipe_%08x`, la ruta del PDB) van en pantalla; la voz dice qué son («la regla del
  programa», «el nombre original», «el molde del nombre del canal interno, no el nombre de cada ejecución», «la ruta del
  PDB»). Las tres partes de YARA se dicen **una vez con el par** («el contexto, `meta`; las cadenas, `strings`; y la
  condición, `condition`»), porque el examen las pregunta en inglés (s3m5q4, `src/data/s3.ts:1211-1224`) y la pantalla tiene
  el término encendido. La voz **nunca** dice GLASS VIPER ni VELVET CICADA: dice «el atacante», «el programa de la primera
  etapa» o «el grupo» (y **nunca «cargador»**, que se confunde con el objeto de la analogía; la analogía tampoco usa
  cargadores). Los nombres de las reglas llevan GLASS VIPER en pantalla tal como los escribe la lección (la lectura de V8,
  registro §5 punto 9: GLASS VIPER es el nombre del programa de primera etapa, el loader); la firma del mensaje es VELVET CICADA, como en
  el grafo de V8.
- **Enfoque («una regla que dure más que el hash»):** el SOC de Meridian (equipo que ya existe, registro §3) pregunta a la
  analista qué se le puede dar que no caduque cada vez que el atacante cambia algo. La respuesta no es otra lista de
  indicadores sino dos reglas del equipo de la analista (**el autor de la YARA es «Meridian CTI»**, `src/data/s5.ts:500`; la
  regla Sigma de la lección **no lleva autor**, `:531-551`; `cti@` y el resto del contacto no salen): una que mira **dentro
  de un fichero** y otra que mira **lo que ocurre en los registros**. VELVET CICADA empuja dos atajos (una palabra suelta;
  fiarse del nombre del fichero) y la narradora los contesta con la condición de la regla de YARA y con el nombre original
  de Sigma. El cierre dice honestamente que ninguna regla es para siempre: si el atacante cambia de herramienta, hay que
  subir de nivel, y mides si dispara (`:636-639`). **El vídeo no dice que el SOC las despliegue, que hayan saltado alguna
  vez ni cuándo se escribieron:** los eventos de pantalla son «evento de ejemplo» y la voz habla de lo que pasaría «si llega
  un evento así», nunca en pasado. Una frase sitúa a quien no ha visto nada: eres la analista de inteligencia de Meridian,
  una aeroespacial, y el SOC te pide algo que dure.

**Conceptos (3) y su imagen:**

Una sola imagen para todo el vídeo, con un detalle distinto en cada concepto: **el aeropuerto y sus dos controles**. El
escáner de equipaje abre la maleta y mira lo que hay dentro (YARA); el registro de la puerta de embarque anota quién pasa,
con qué tarjeta y con qué pasaporte (Sigma). **Regla de la imagen: un objeto, una función.** El escáner solo mira dentro
(nunca «cámara» ni «registro»); la tarjeta de embarque es el nombre del fichero en el disco y el pasaporte es el nombre
original que lleva por dentro; **una botella de agua, un paraguas o un libro** son las cadenas genéricas (los lleva
cualquiera), y una pieza que casi nadie lleva es el artefacto único. **Ningún objeto con doble sentido** («cargador»,
«llave», «carga»). No es la ropa, el acento ni «cómo anda» de V7, ni la casa, el taller o la etiqueta de V13 a V15, ni la
tienda, la alarma y el walkie de V22, ni el cuadro y la cartela de V23, ni el diamante de V3, ni la carta de V8, ni el
coche de V15. La voz no usa «alarma» para el escáner (es de V22): el escáner «salta» o «avisa».

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | **Dos reglas, dos miradas** (`src/data/s5.ts:491,525`, tabla `:558-567`). **YARA** describe contenido de ficheros o memoria; **Sigma** mira eventos de los registros. YARA corre en un escáner, un sandbox, un EDR o un repositorio de muestras; Sigma es un YAML genérico que **se convierte** al lenguaje del SIEM: no corre en el SIEM tal cual (`:525`, nota de examen `:634`). Primero la idea, luego el nombre: «mirar dentro» y «mirar lo que pasa» antes de decir YARA y Sigma | El escáner abre la maleta y mira dentro; el registro de la puerta anota quién pasa y con qué documento | «YARA mira contenido; Sigma mira eventos» · «Sigma no corre en el SIEM tal cual: se convierte» |
| 2 | **La condición es el arte** (`:520`, check `:568-582`). Una cadena genérica como `MapViewOfSection` aparece en miles de programas legítimos y, sola, haría saltar a medio mundo; la regla pide **compañía** (`2 of ($api, $pipe, $op)`: dos señales corrientes juntas bajan mucho el ruido) o **una pieza única que va sola** (la ruta del PDB, `$pdb`). Ojo: `$pipe` y `$op` **tampoco van solos** en esta regla (`2 of`), y dos genéricas se bastan: lo raro de verdad es el PDB (`:520` dice que el pipe «puede disparar solo»; la regla en pantalla le pide compañía, y el vídeo lee la regla). `uint16(0) == 0x5A4D` ancla el ejecutable y `filesize` acota el coste. La voz dice que el PDB «a veces se queda escrito» (V14, V15) y que por eso la regla tiene un segundo camino. La pantalla marca `$pdb` «único» y `$api`, `$pipe`, `$op` «de compañía». **El vídeo lee una regla hecha; no pide elegir cadenas** (eso es el Lab 3B) | El escáner: una botella de agua o un paraguas los lleva cualquiera y, solos, no dicen nada; una pieza que casi nadie lleva pita sola; dos objetos corrientes juntos ya llaman la atención | «Cadena genérica, acompañada. El PDB, que es único, solo» |
| 3 | **La regla mira lo que cuesta cambiar** (`:555`; s5m3q7 y q9, `:758-796`). La regla Sigma selecciona por `OriginalFileName` (que va en el programa, no en el nombre del disco) y excluye el uso con su nombre legítimo (`filter_expected`). El vídeo se apoya en V7 con una frase y se dedica a **qué rompe cada regla**: (a) una YARA **vive mientras el programa conserve esas piezas** (`:564` la hace sobrevivir a la *rotación de infraestructura*, no a un cambio de compilación; si compilan desde otra carpeta, `$pdb` desaparece); (b) la Sigma por nombre original **no ve otra herramienta** (s2m5q8 `:1360-1373`: «si cambia de herramienta, la regla del nombre original ya no ve»); (c) el filtro por nombre **admite cualquier carpeta** (`endswith '\certutil.exe'`). Tres escalones, **sin nombres de nivel de la pirámide**: «el nombre del disco», «el nombre original», «la cadena entera» (la regla del árbol de procesos que V7 ya contó, `src/data/s2.ts:1200`). Ninguna regla es para siempre: se mide si dispara (`s5.ts:636-639`) | La tarjeta de embarque lleva el nombre que cada cual quiera; el pasaporte no cambia al cambiar la tarjeta; quien viaja con su tarjeta normal pasa sin que el registro avise; si cambia de pasaporte, otro control | «OriginalFileName viene del PE header, no del disco» |

**Qué regla es la más ruidosa o la más cara de esquivar (decidido):**

| Regla | Más ruidosa o más barata de esquivar (sale en el vídeo) | Con menos ruido (sale en el vídeo) | Qué la rompe | Dónde está |
|---|---|---|---|---|
| YARA | Una cadena genérica sola (`any of`): ruido, no evasión | La condición de la lección: `$pdb or 2 of (...)` | La genérica sola: el SOC se cansa de avisos falsos. La de la lección: que el programa deje de conservar esas piezas (otra ruta de compilación quita `$pdb`; otro compilador cambia `$op`, de memoria) | `s5.ts:520,564,571-582` |
| Sigma | `Image|endswith` sobre `wcssvc.exe`, la regla A (ejemplo, no de Meridian) | `OriginalFileName` + banderas de uso + filtro del uso legítimo | A: cambiar el nombre, que cuesta cero. B: cambiar de herramienta; y el filtro por nombre, que admite cualquier carpeta | `s5.ts:531-551,555,786-796`; `s2.ts:1360-1373` |
| Hash | **No sale** (ni `4c81...b3` ni `9f3a...e1`, ni un valor ilegible) | — | — | V7 s04 y s05 ya lo hicieron: `video/attack-piramide/src/data/s05-otra-ropa.ts:24` («regla: hash», «0 coincidencias») |

La regla por hash es el peldaño de la base de V7 y V27 no la repite: enseñarla de nuevo obligaría a decidir sobre qué foto
pasa (§5 punto 1) y no aporta nada. **La pirámide no se redibuja ni se nombran sus niveles** (ni «artefactos», ni
«herramienta», ni «cima»): la lección está partida (la tabla de s5m3 pone Sigma entera en TTPs, `s5.ts:565`; el árbol de
s2m5 pone la propia línea `wcssvc.exe -decode …` en `TTP - tough`, `s2.ts:1182-1185`; V7 puso el nombre `wcssvc.exe
(CertUtil)` en Tools, `s04-piramide.ts:38`) y cualquier nivel que V27 rotule contradice una de las tres. La escalera lleva
solo tres rótulos de lo que mira cada regla (ver decisión 5).

**Escenas:** seis, en tres capítulos (Dos miradas · Qué mira cada regla · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «¿Qué le damos al SOC?» | I Dos miradas | 18 | Tira de contexto: «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia». Tres fichas de indicador sueltas y apagadas, sin ningún valor («un dominio», «una dirección IP», «un hash»), cada una con un reloj de caducidad. Tira del SOC: «el SOC: ¿y qué le damos que dure?». Título «YARA y Sigma» con «del indicador a la regla» debajo, antes de los 8 s. La promesa en tres chips: «qué mira cada una · cuándo salta de más · qué rompe cada regla» | La promesa en los primeros 10 s y el puente con V7 en una frase (ya sabes qué detectar; ahora, cómo se escribe) · `pile, soc, title, promise` |
| s02-miradas «Un escáner y un registro» | I | 34 | El aeropuerto en alzado. El escáner de equipaje abre una maleta y mira dentro, rotulado YARA: «mira dentro: ficheros y memoria». El registro de la puerta de embarque anota un pasajero con su tarjeta, rotulado SIGMA: «mira lo que ocurre: los registros». Dos chips: «YARA: lo que hay dentro» y «Sigma: lo que ha pasado». La tarjeta | YARA y Sigma miran cosas distintas · `airport, scanner, yara-inside, gate, sigma-events, pair` |
| s03-condicion «La condición decide» | I | 46 | **Mensaje interceptado** (VELVET CICADA) y su respuesta. Entra la regla YARA, `GLASSVIPER_Loader_MemMap`, con el rótulo «extracto de la lección · ficticia» y su `author = "Meridian CTI"` tal como está en la lección: contexto (`meta`), cadenas (`strings`) y condición (`condition`) se iluminan una a una, con el término del examen encendido. `$api` se resalta, «está en miles de programas legítimos», y una pila de avisos falsos cae sobre la tira del SOC (sfx `flood`). `$pdb` se rotula «único» y `$api`, `$pipe`, `$op` «de compañía». La condición se lee en tres líneas: «que sea un ejecutable (empieza por MZ)», «que no pese más de 250 KB» y «o el PDB, que es único y va solo, o dos señales de las otras tres». La tarjeta. Cierre del capítulo con el «o sea, que…» | Una cadena genérica sola salta con todos; la regla pide compañía o una pieza única · `reply-word, rule, meta, strings, generic, flood, tags-company, cond-mz, cond-size, cond-or, wrap-i` · **intercept** |
| s04-sigma «Sigma, línea a línea» | II Qué mira cada regla | 60 | **Mensaje interceptado** que abre la escena; respuesta neutra («pues vamos a ver qué mira esta regla»). La regla Sigma, rotulada «extracto de la lección · ficticia» (**sin autor**: la lección no lo da), se lee por partes: de qué registro habla (creación de procesos de Windows), `selection` (el nombre original `CertUtil.exe` más una de dos banderas de uso, «decodificar o descargar»), `filter_expected` («el uso con su nombre normal no salta»; es lo que explica los eventos) y `condition`; `falsepositives` queda en pantalla sin voz. **Tres eventos de ejemplo** como tarjeta de tres campos (`Image`, `OriginalFileName`, `CommandLine`), rotulados «evento de ejemplo», sin equipo ni hora, con la misma línea de comando: el primero, `certutil.exe` / `CertUtil.exe` (el filtro lo cubre: «no avisa»); el segundo, `wcssvc.exe` / `CertUtil.exe` («avisa»). Después, la pregunta con las dos reglas a la vista, A por el nombre del fichero (`Image|endswith` `wcssvc.exe`) y B la de la lección, y un tercer evento: `otro-nombre.exe` / `CertUtil.exe` (placeholder de la analogía, no un fichero de Meridian). Respuesta: sobre ese evento, A no ve y B sí (sfx `miss` en A, `hit` en B), con el filtro marcado porque `otro-nombre.exe` no cuadra con él. La tarjeta, después de la respuesta | El nombre del disco lo cambia el atacante gratis; el nombre original va dentro del programa; el filtro por nombre admite cualquier carpeta · `reply-m2, sigma, logsource, selection, flags, filter, cond, ev-legit, ev-renamed, rule-a, rule-b, ev-new, answer, miss, hit` · **intercept** · **think** |
| s05-aguanta «Dónde corre y qué la rompe» | II | 36 | Dos columnas: YARA, «corre en: escáner, sandbox, EDR, repositorio de muestras»; Sigma, «se traduce a la consulta de tu SIEM, y esa corre» (chips genéricos «tu SIEM»; sin nombres de producto, como V15 con el servicio público de análisis). La tarjeta. Después, **«qué la rompe»** en tres filas cortas: YARA, «el programa deja de conservar esas piezas»; Sigma por nombre original, «otra herramienta»; el filtro por nombre, «una copia en otra carpeta». Sigue una **tira de tres chips**, sin nombres de nivel: «el nombre del disco» · «el nombre original» · «la cadena entera» (en voz, «la regla del árbol de procesos, la que ya viste»: nunca un id de módulo leído), con la tira «si cambia de herramienta, la regla del nombre original ya no ve». Y una línea de cierre del capítulo: «mide si dispara» | Dónde corre cada una; qué rompe cada una; ninguna regla es para siempre · `where, yara-runs, sigma-runs, convert, breaks, breaks-yara, breaks-sigma, breaks-filter, ladder, limit, loop, wrap-ii` |
| s06-recap «Tres reglas» | III Para el examen | 24 | Tres tarjetas de reglas con su viñeta en miniatura (el escáner y el registro, la maleta con una botella, el pasaporte); tarjeta final Alertópolis: «Tu turno: las preguntas de la lección (s5m3)» | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (dominio Dissemination), una por escena de s02 a s05, ninguna en s01 ni en el cierre. Cada una espera
  al final de su frase y lleva ~5 s de escena detrás (la de s05 lleva detrás la explicación del SIEM):
  - «YARA mira contenido; Sigma mira eventos» (s02) (39)
  - «Cadena genérica, acompañada. El PDB, que es único, solo» (s03) (55)
  - «OriginalFileName viene del PE header, no del disco» (s04) (50; sale después de la respuesta a la pregunta)
  - «Sigma no corre en el SIEM tal cual: se convierte» (s05) (48)
- **Pregunta para pensar:** «Otro nombre de fichero: ¿cuál sigue saltando?» (s04) (45; `holdMs` 4500; las dos reglas, A por
  el nombre del fichero y B por el nombre original, siguen a la vista, junto a un tercer evento de tres campos con un nombre
  cualquiera, `otro-nombre.exe`, y el mismo nombre original). **La hipótesis va dicha en la propia pregunta**: en el evento
  que ya se enseñó (`wcssvc.exe`) las dos reglas avisan, y la pregunta solo funciona si el nombre cambia otra vez. Es una
  elección de verdad entre dos reglas, no un sí o no. Respuesta: B. El nombre del disco lo cambia el atacante cuando quiere;
  el nombre original va dentro del programa y renombrar no lo toca (s5m3q9, `:782-796`); y B no se libra del filtro por
  casualidad, sino porque `otro-nombre.exe` no es `certutil.exe`. **El título de la escena («Sigma, línea a línea») no da la
  respuesta**, y el mensaje de VELVET CICADA se contesta en neutro («pues vamos a ver qué mira esta regla») para que la
  pregunta no llegue ya contestada. La respuesta no promete que el campo sea inalterable: dice «renombrar no lo toca». **Aviso
  de la revisión:** la pregunta casi se contesta sola (A pide `wcssvc.exe` y el evento es otro); la variante que obliga a
  usar lo contado está en la decisión 7 y en la pregunta 4 para Lidia.
- **Mensajes interceptados** (VELVET CICADA; tutea, ironía, **dice «analista»**: la sección ya lo hace en su ficha de jefe,
  `src/data/course-gcti.ts:95`; empuja atajos de método, nunca una hipótesis, y no confiesa nada; no repite el «Bloquea…» de
  V7 y V15 ni el «Córtame ya» de V22: el primero es un cebo en tono de burla y el segundo, una fanfarronada):
  - s03 (cap. I): «Una palabra de mi programa y ya me pillas. Qué fácil, analista.» (63). El error: una regla de una sola
    cadena. La voz, más o menos así: «Una palabra que lleva medio mundo salta con todos. Una que solo lleva él puede saltar sola.
    Por eso la condición tiene dos caminos.» (la respuesta deja las dos ramas, para no contradecir la tarjeta de s03 ni la lección,
    `:520`). Nada de «el atacante quiere que fallen tus reglas»: es un cebo, no una confesión.
  - s04 (cap. II): «A mis herramientas las llamo como quiero. Tu regla no lo verá.» (62; «herramientas» y no «mi programa»,
    porque lo que la regla B ve es una herramienta de Windows renombrada, y para que no se lea como si el grupo cambiase de
    nombre, que es el «Llámame GLASS VIPER» de V3). El error: creer que renombrar esquiva cualquier regla. La respuesta
    neutra de apertura: «Pues vamos a ver qué mira esta regla.»; la de verdad llega tras la pregunta («Una regla por el nombre
    del fichero, quizá. Esta, no.»; **que no sea la frase de V22** «tiene razón en algo»: M2 es de la familia de «Bloquea mi
    hash» de V7 y «Me mudo en cinco minutos» de V22, y la respuesta tiene que ser otra).
- **Cierre:** tres reglas y una sola tarea.
  1. YARA mira dentro de un fichero y Sigma mira lo que ocurre en los registros. Y Sigma no corre en el SIEM tal cual: se
     convierte.
  2. Una cadena genérica sola salta con medio mundo: pídele compañía, o apóyate en una pieza única, como el PDB.
  3. Apóyate en lo que cuesta cambiar: el nombre original, no el del disco. Entre estas, la que más aguanta; pero ninguna dura
     para siempre, así que mide si tu regla dispara.

  Tarea: las diez preguntas de la lección s5m3 (las q7 y q9 contestan la base de este vídeo; la q10, STIX y TAXII, es de V8).
  El Lab 3B queda como práctica de lo que el vídeo no hace (elegir cadenas y umbral): se nombra en las notas, no en el cierre,
  porque el cierre lleva una sola acción.

**Se queda fuera** (y dónde está):
- **STIX y TAXII** (`src/data/s5.ts:583-623`, s5m3q8 y q10): es la mitad de la lección que V8 ya cuenta. Ni el indicador de
  `cdn-sync-status.example` del JSON (`:592-618`, `confidence: 80`, `valid_until` de 2026-07-18): V8 y V22 lo dejaron fuera a
  propósito (registro §7, V8).
- **El TLP aplicado** (`:624-629`, check `:640-654`): solo asoma `tlp = "AMBER"` como texto de la regla, sin explicarlo. El
  anexo técnico de la lección (`src/data/labs.ts:1032,1123`) es del Lab 5B.
- **Los tres tipos de diseminación táctica y el contexto mínimo** (`:477-487`, s5m3q1 a q5): una frase en s01, «un indicador
  caduca»; el detalle, en la lección.
- **Los bytes `$op`** (`6A 40 68 00 30 00 00`), los modificadores `ascii` y `wide` y el significado de «section map»: la
  lección no los explica y el vídeo tampoco (a verificar con el material oficial).
- **Cómo se convierte Sigma** y a qué productos (Splunk, Sentinel, Elastic, `:525`): ni el proceso ni los nombres de producto
  salen; la pantalla dice «tu SIEM». Tampoco sale que haya herramientas que evalúan Sigma sin SIEM (de memoria): por eso la
  frase es «no corre en el SIEM tal cual» y no «no se ejecuta».
- **El Lab 3B y las preguntas de YARA de s3m5** (`src/data/s3.ts:1123-1163,1209-1236`): ver «Laboratorios».
- **La regla de s2m5 de la cadena entera como regla escrita ni los niveles de la pirámide**: sale como tercer escalón, solo
  con su nombre; no se escribe en Sigma ni se muestra su texto (`src/data/s2.ts:1200`, V7).

**Laboratorios y preguntas que ya ejercitan el tema (penalización L):**
- **Lab 3B · YARA Forge** (`src/data/labs.ts:114-124`; datos `:746-843`; `src/components/labs/YaraLab.tsx`): elegir cadenas y
  `any`/`2`/`all` frente a cuatro muestras. **No se repite** la selección, ni sus seis cadenas (`vc_stage2.bin`, los bytes
  `{ 8B 45 FC 33 45 F8 8B 4D F4 }`, el user-agent con `MSIE 9.0`, `kernel32.dll`, `POST /api/v2/telemetry`), ni sus cuatro
  muestras (`VC_Loader_v1.dll`, `VC_Loader_v2.dll`, `VendorUpdater.exe`, `ChatHelper.exe`), ni las palabras «variante 1» y
  «variante 2». **Una coincidencia que se acepta:** su cadena `s1` es la misma ruta del PDB que `$pdb` de la regla de la lección
  (`labs.ts:772`, con la nota «solo variante 1», `:775`); el vídeo la enseña como la enseña la lección y dice «a veces se
  queda escrita», nunca «la llevan todas» ni «la regla encuentra la familia entera». Las otras tres cadenas de la regla
  (`$api`, `$pipe`, `$op`) son de la lección, no del laboratorio.
- **Lab 2C** (`labs.ts:88-97,340-393`, ítem `:363`: «Create a Sigma rule alerting whenever an LNK spawns PowerShell»,
  Detect): **no sale** esa regla ni se clasifica nada en verbos de la matriz.
- **Lab 5A** (`labs.ts:163-173`, calibración) y **Lab 5B** (`labs.ts:174-189`; anexo técnico y marcas TLP, `:1032,1115-1130`):
  nada. No se pone TLP a ningún producto ni se valora ningún hallazgo.
- **Preguntas de s3m5** (`src/data/s3.ts:1135-1163` y q4, q5 en `:1209-1236`): es el mismo tema en la sección anterior. El vídeo
  da la misma idea (compañía) con otro ejemplo y otra pregunta; no repite «Mozilla/5.0» ni «any of them».
- **Preguntas de colocación** `pl-s5q7` (`src/data/placement-gcti-s5.ts:131-144`), `pl-s3q10` (`placement-gcti-s3.ts:180-193`) y
  `pl-s3q12` (`:210`): no se usan sus escenarios (un servidor de ficheros retirado, una cervecería, un operador de
  transbordadores) ni se restan sus respuestas.
- **s2m5** (`src/data/s2.ts:1212-1223`, q8 `:1360-1373`): V7 ya contestó el check de «dónde va el esfuerzo»; el vídeo cita la
  frontera de q8 («si cambia de herramienta, esa regla ya no ve») y no la regla de la cadena entera.
- **s5m3** (`src/data/s5.ts:568-582,655-669`, q7 `:758-772`, q9 `:782-796`): el vídeo es su explicación. El check de
  `:568-582` llega **antes** que el vídeo; el de `:655-669` queda contestado (ver «Inserción»). La q7 dice «la inversión más
  duradera» y el vídeo «ninguna regla es para siempre»: no se contradicen (la q7 compara con listas y hashes); la frase de
  cierre dice «entre estas, la que más aguanta».

**Canon nuevo que fija V27** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **Sin fecha ni hora**, como V9, V15, V22 y V23. No se ordena contra la cronología del registro. Es posterior a V7 en lo que
  cuenta (la regla habla del `wcssvc.exe` que V7 enseñó) y no se coloca más.
- **VELVET CICADA habla por primera vez**, con la voz de Pablo y el efecto `machine`, con dos mensajes sin fecha que pasan a ser
  canon de su voz: «Una palabra de mi programa y ya me pillas. Qué fácil, analista.» y «A mis herramientas las llamo como
  quiero. Tu regla no lo verá.» Ninguno confiesa nada ni dice qué es VELVET CICADA; la voz de la narradora sigue sin nombrarlo.
- **El SOC de Meridian pregunta** «¿qué le damos que dure?»: es el equipo de §3, sin persona, con una pregunta y ninguna
  decisión ni postura.
- **Las dos reglas de la lección salen en pantalla como «extracto de la lección · ficticia»** (el rótulo que V9 usó para su
  matriz), **sin cuatro líneas que la lección sí lleva** (retoque a propósito): `date = "2026-04-18"` y `reference =
  "Internal report MER-2026-011"` de la regla YARA (`s5.ts:502-503`) y `id` y `references` de la regla Sigma (`:532,535-536`).
  Motivos: la numeración MER-2026-011 choca con MER-2026-019 y MER-2026-023 (registro §5 punto 17), la fecha ordenaría el
  vídeo y el `id` de la lección no es un UUID válido (`4b8d2f6a-9c31-4e02-b7aa-meridian0042`). Las dos reglas siguen siendo
  válidas sin esas líneas (ver «Reglas en pantalla»). **El vídeo no dice que estén desplegadas ni que hayan saltado.**
- **El autor «Meridian CTI» es solo el de la regla YARA** (`s5.ts:500`); la regla Sigma de la lección **no lleva autor** y el
  vídeo no se lo pone. El registro (`velvet-cicada.md:98`) dice «autor de flash alert, YARA y Sigma»: al congelar, **apuntar
  allí que el autor de la Sigma no consta** (esa edición no es de esta ficha).
- **`wcssvc.exe` y su comando ya son canon** (V7 s03 y `s2.ts:1182`, registro §3 «Capacidades»): V27 no los inventa y no
  añade nada sobre ellos. **Lo nuevo es** la regla A (`Image|endswith` `wcssvc.exe`, solo del vídeo), el evento con el
  nombre normal (`certutil.exe` con el mismo comando) y el de `otro-nombre.exe`, que es un placeholder de la analogía y no
  sugiere que el actor haya usado un tercer nombre. Los tres eventos son «evento de ejemplo», sin equipo, hora ni cuenta, y la
  voz habla en condicional («si llega un evento así»), nunca «salta» en pasado: un acierto retrospectivo de una regla nueva es
  justo lo que V7 declaró «sin fecha ni dueño».
- **La imagen del aeropuerto** (escáner, registro de la puerta, tarjeta de embarque, pasaporte) es de la analogía, no del caso.
- Ninguna persona, fecha, equipo, hash, dominio ni IP nuevos.

**Reglas en pantalla (escritas completas y comprobadas con `check-v27-fix.mjs`, que las extrae de esta ficha y las compara con
la plantilla de `src/data/s5.ts`):**

Regla YARA, rótulo «extracto de la lección · ficticia» (`src/data/s5.ts:497-516`, sin `date` ni `reference`; llaves 2/2,
paréntesis 3/3, las tres secciones presentes; la pantalla rotula `$pdb` «único» y `$api`, `$pipe`, `$op` «de compañía»):

```
rule GLASSVIPER_Loader_MemMap
{
    meta:
        author      = "Meridian CTI"
        description = "GLASS VIPER stage-1 loader: section map + named pipe"
        tlp         = "AMBER"

    strings:
        $api  = "MapViewOfSection" ascii
        $pipe = "vc_pipe_%08x" ascii wide
        $op   = { 6A 40 68 00 30 00 00 }
        $pdb  = "D:\\proj\\cicada\\loader\\Release\\ldr.pdb"

    condition:
        uint16(0) == 0x5A4D
        and filesize < 250KB
        and ( $pdb or 2 of ($api, $pipe, $op) )
}
```

Regla Sigma, rótulo «extracto de la lección · ficticia», sin autor (`src/data/s5.ts:531-551`, sin `id` ni `references`; el
`'\certutil.exe'` es como queda tras el escape de la plantilla de la lección):

```
title: GLASS VIPER Staging via Renamed Certutil
status: experimental
description: Renamed certutil.exe decoding a staged payload
logsource:
    product: windows
    category: process_creation
detection:
    selection:
        OriginalFileName: 'CertUtil.exe'
        CommandLine|contains:
            - '-decode'
            - '-urlcache'
    filter_expected:
        Image|endswith: '\certutil.exe'
    condition: selection and not filter_expected
falsepositives:
    - Admin tooling that copies certutil under another name (rare)
level: high
```

Regla ingenua A de la pregunta (solo en pantalla, «ejemplo»; mismo formato, mismo `logsource`):

```
title: Renamed Certutil by file name (example)
logsource:
    product: windows
    category: process_creation
detection:
    selection:
        Image|endswith: '\wcssvc.exe'
    condition: selection
level: high
```

Los tres eventos de ejemplo, como tarjeta de tres campos (el evento legítimo lleva **el mismo nombre original** que el
renombrado y distinta `Image`; lo que lo libra es el filtro, no el nombre original):

| Evento de ejemplo | `Image` | `OriginalFileName` | `CommandLine` | Regla A | Regla B |
|---|---|---|---|---|---|
| 1 · nombre normal | `certutil.exe` | `CertUtil.exe` | `-decode a.txt payload.bin` | no avisa | no avisa (lo cubre `filter_expected`) |
| 2 · ya conocido de V7 | `wcssvc.exe` | `CertUtil.exe` | `-decode a.txt payload.bin` | avisa | avisa |
| 3 · el de la pregunta | `otro-nombre.exe` | `CertUtil.exe` | `-decode a.txt payload.bin` | no avisa | avisa |

- **Qué no es de la lección:** solo la regla A y los tres eventos. El `$pdb` va con `\\` doble porque así se escribe una barra
  en YARA; en la pantalla de V14 la ruta sale con una barra, que es como se escribe fuera de una regla. `MapViewOfSection` es
  subcadena de `NtMapViewOfSection` (V15 cambió la lección de s3m2 a esa forma, `src/data/s3.ts:333`; registro §3
  «Capacidades»), así que la cadena sigue valiendo.
- **A verificar con el material oficial** (no van en tarjeta ni en voz): que `title`, `logsource` y `detection` sean los tres
  campos obligatorios de una regla Sigma y que `id` y `references` sean opcionales (lo que se afirma aquí es solo «sigue siendo
  YAML válido»); que `OriginalFileName` sea técnicamente un campo del recurso de versión del PE y no de su «header» (la lección
  y la q9 lo llaman «PE header», `s5.ts:555,789`; V7 ya dijo «cabecera PE»; la tarjeta copia la lección y la voz dice «por
  dentro del programa»); que un actor no pueda reescribir ese campo al recompilar (la lección solo dice «renombrar no lo
  cambia»; en una copia de `certutil` no se puede tocar sin invalidar la firma de Microsoft, de memoria); que `-urlcache`
  **descargue** y no decodifique (de memoria; por eso la voz dice «decodificar o descargar» y nunca «las banderas de
  decodificar»); que Chainsaw, Hayabusa y Zircolite evalúen Sigma sin SIEM (de memoria; la frase es «no corre en el SIEM tal
  cual»); que `$op` sea `push 0x40; push 0x3000` (de memoria; el vídeo no lo explica); y que `OriginalFileName` lo dé Sysmon
  y la mayoría de EDR pero no el evento 4688 de Seguridad (aviso para las notas, no para la voz).
- **Notas para `script-notes.md`:** el filtro `endswith '\certutil.exe'` admite cualquier carpeta (un `certutil.exe` copiado
  a otra ruta queda filtrado) y sale en s05 como «una copia en otra carpeta»; `vc_pipe_%08x` es el molde que está en el
  binario, no el nombre ya con número que enseñaron V3 y V15; la ruta del PDB es la «etiqueta del taller» de V13 a V15 y
  V27 no la nombra así (decisión 9).

**No se toca:**
- **Ningún hash, en pantalla ni en voz:** ni `4c81...b3` ni `9f3a...e1`/`9f3a2c...e1`, ni un valor ilegible (registro §5
  puntos 1 y 11; V7 s05 ya hizo la comparación). **No se dice qué muestra cumple la regla YARA**: V15 dejó dicho qué
  significaría un acierto y no enseñó ninguno, y V14 decidió que `4c81...b3` lleva el PDB «solo para el registro». El vídeo
  no pasa ninguna regla por ninguna foto. Los bytes de `$op` son código, no un hash.
- **`winhlp.exe` y `updsvc.exe` no salen.** `wcssvc.exe` sí (V7 y la lección), pero **sin hora, sin equipo y sin añadirlo a la
  cadena de s2m1/V13** (registro §5 punto 19). La voz dice «un programa de Windows, con otro nombre».
- **El dosier de BROKEN CHAIN** (`src/data/course-gcti.ts:40`): ni «el mismo PDB en tres muestras», ni cuántas lo comparten, ni
  «VELVET CICADA ya tiene cara técnica». La palabra «cicada» de la ruta sale tal cual y la voz no la comenta (como V14).
- **La solución del Lab 3B** (registro §4, «sin regla escrita»): nada de lo que ya se enumeró arriba.
- **El dosier de LAST WORD** (`src/data/course-gcti.ts:96-97`): ni «espionaje dirigido al programa de propulsión», ni «caso
  cerrado», ni el informe al consejo. Los mensajes no dicen qué hará VELVET CICADA.
- **Fecha 2026-04-18, MER-2026-011, el flash alert MER-FA-2026-014** (`src/data/s5.ts:47-69`) y la ola de phishing de abril.
- **El C2, el certificado y el correo de registro** (`update-svc-cdn.com`, `CN=updatesvc`, `kazuo.tanji@`): no salen.
- **Lab 5B**: ningún juicio ni marca TLP. **Los casos reales de S5** (`src/data/s5.ts:836,855`).
- **Los niveles de la pirámide** («artefactos», «herramienta», «cima», «TTP»): no se rotula ninguno (decisión 5).
- **La voz no dice «cargador» ni «loader»** y la analogía no tiene ningún objeto con ese nombre.
- No se culpa a nadie: ni al SOC por pedir algo que dure ni al equipo por escribir primero la regla ingenua. Casi todo el mundo
  empieza por el nombre.

**Comprobación de límites** (recuentos hechos con un script de Node, `check-v27-fix.mjs` en el directorio temporal de la
sesión, no a ojo; perfil `capsula-yt`, `profiles.mjs:58-70`; las reglas de pantalla se extraen de esta ficha y se comparan con
la plantilla de la lección evaluada desde `src/data/s5.ts`):
- Duración: suma 218 s (seis escenas: 18, 34, 46, 60, 36 y 24); estimado ~250 s; renderizado previsto ~230–235 s; ventana
  190–260. Sí.
- Capítulos: 3 (máximo 3). Sí.
- Conceptos clave: 3 (2–3), con como mucho dos tarjetas por concepto (2, 1 y 1). Sí.
- Tarjetas: 4 (3–5), una por escena de s02 a s05 y ninguna en s01 ni en s06, todas con `"objective": "Dissemination"`.
  Caracteres: 39, 55, 50 y 48 (máximo 58, `EXAM_TEXT_MAX`). Sí.
- Pregunta para pensar: 1, en s04; 45 caracteres (máximo 48); `holdMs` 4500 (mínimo 4000); es una elección entre dos reglas, no
  un sí o no. Sí.
- Mensajes interceptados: 2 (1–2), en s03 (cap. I) y s04 (cap. II), uno por capítulo, ninguno en la escena final; 63 y 62
  caracteres (máximo 70); `holdMs` 3500 (2500–4500). Sí.
- `video.json` lleva `"adversary": "VELVET CICADA"`, que es el de S5 (`course-gcti.ts:93`). Sí.
- Sin flechas, marcas de verificación, viñetas ni emoji (`FORBIDDEN_SYMBOLS` de
  `video/engine/scripts/lib/narration.mjs:23`) ni `{}[]|<>` en tarjetas, pregunta y mensajes (`:288,323`). El carácter `|` de
  `Image|endswith` va solo en la pantalla de la regla, no en ninguno de esos tres campos. Sí.
- Reglas en pantalla: YARA y Sigma idénticas a la lección salvo las cuatro líneas retiradas; llaves 2/2 y paréntesis 3/3 en la
  YARA; las cuatro cadenas se usan; sin ningún hash en reglas, tarjetas, mensajes ni pregunta. Sí.
- Ningún identificador leído en voz (`IDENTIFIER_PATTERNS`, `narration.mjs:135-143`): `certutil` suelto no encaja con el
  patrón de dominio; `OriginalFileName`, `wcssvc.exe` y `vc_pipe_%08x` solo en pantalla. Sí.
- `wordBudget` por escena: 49, 92, 124, 162, 97 y 65 (589 palabras); frases de voz de muestra de ≤ 22 palabras. El título de la
  escena de la pregunta y el del capítulo II («Qué mira cada regla») no la destripan. Sí.

**Decisiones de esta ficha** (con la alternativa descartada de cada una):
1. **Se muestra la regla frágil de Sigma por nombre de fichero, no la de hash.** Alternativa descartada: repetir la regla por
   hash de V7 como «suelo» (`s05-otra-ropa.ts:24`): ya está contada, obligaría a elegir qué foto y qué hash, y roza §5 puntos
   1 y 11. La frágil de YARA es la cadena genérica sola (la del check de la lección).
2. **VELVET CICADA habla, con la voz de Pablo.** Alternativas descartadas: (a) GLASS VIPER, que es el adversario de S2 y no
   el de la sección (la lección lo nombra en las reglas, pero la convención es el de la sección, §1 del plan); (b) la voz de
   Laura, que es la de PAPER CRANE y acaba de oírse en V23 el mismo día. Riesgo, y es mayor de lo que parecía: Pablo +
   `machine` es la voz **por defecto** del adversario y la usan GLASS VIPER (V3, V7, V13, V14, V22), HOLLOW LANTERN (V4, V8,
   V15) y SILENT PAGER en Security+, así que VELVET CICADA sonará igual que dos de los otros tres adversarios GCTI; se
   compensa con la firma «VELVET CICADA» en pantalla y con el «analista». Si Lidia quiere que el jefe de S5 suene distinto, el
   hueco es un `fx` propio (como en Security+: `cifrado`, `telefono`, `megafonia`), no otra voz.
3. **El vídeo va tras el primer check y antes de STIX/TAXII**, no al final de la lección. Alternativa descartada: último
   bloque tras el check 3 (como V22): resumiría lo que quedó a tres secciones de distancia. Coste aceptado: el check 3 queda
   contestado.
4. **Reglas en pantalla recortadas en cuatro líneas** (`date`, `reference`, `id`, `references`) y rotuladas «extracto».
   Alternativa descartada: copiarlas tal cual, que afirma 2026-04-18 y MER-2026-011 en pantalla (§5 punto 17); y descartado
   también el rótulo «ejemplo de la lección» a secas, que sugiere copia literal.
5. **No se redibuja la pirámide y no se rotula ningún nivel.** Las fuentes se contradicen (la tabla de s5m3 pone Sigma en
   TTPs, `s5.ts:565`; el árbol de s2m5 pone la línea de `wcssvc.exe` en `TTP - tough`, `s2.ts:1182-1185`; V7 puso el nombre
   en Tools). Alternativas descartadas: (a) rotular el escalón 2 «herramienta» con los nombres de V7, que choca con las otras
   dos; (b) nombrar las dos líneas y decir que V27 sigue a V7, que mete en un vídeo de reglas un debate de la pirámide. La
   escalera lleva tres rótulos de lo que mira cada regla y la frase de s2m5q8.
6. **La tarea es las diez preguntas de la lección, no el Lab 3B.** Alternativa descartada: mandar al Lab 3B, que es de S3
   y practica algo que el vídeo no hace; sale en las notas, no en el cierre (una sola acción).
7. **La pregunta se queda en «¿cuál sigue saltando?» con la regla A frente a la B, y el filtro es lo que la contesta.**
   Es válida y sin error técnico, pero casi se contesta sola. Alternativa (no elegida, decisión de Lidia): «Decodificador
   propio: ¿cuál sigue viéndolo?» (43), con A, B y el evento de un programa del actor con otro nombre *y* otro original;
   respuesta «Ninguna de las dos. Hace falta subir un nivel», con `miss` en A y en B y `hit` en la regla de la cadena entera
   (s2m5q8). Cambia el mensaje 2, la respuesta de s04 y la escalera de s05 (que pasaría a ser el cuerpo de la respuesta).
8. **No se funde ni se recorta ninguna escena para quitar el solape con V7; se cambia lo que lleva s05.** El escalón del
   nombre original y el del disco (V7 s03) pasan a una frase en s04; la escalera (V7 s05) queda en tres chips de ~6 s; el tiempo
   de s05 va a «qué la rompe» (YARA, Sigma por nombre original, filtro). Alternativas descartadas: (a) quitar la escalera por
   completo (se queda como puente a la q8 y a V7); (b) fundir s05 en s06, que dejaría la tarjeta de Sigma en el cierre, donde
   el validador no admite tarjeta; (c) fundir s04 y s05 en una escena de 96 s, que supera el techo de densidad. La suma sigue
   en 218 s.
9. **La ruta del PDB no se nombra como «la etiqueta del taller» de V13 a V15.** La regla de «una imagen por concepto» lo
   impide y el taller es de V14. Alternativa descartada: una referencia de una frase («la etiqueta del taller de V14»), que ata
   el hilo pero añade una imagen más a un vídeo que ya tiene el aeropuerto.

**Riesgos de solape:**
- **V7** (`video/attack-piramide`): el nombre original, `wcssvc.exe` y la cadena entera ya salen en s03 y s05 de V7. V27 no
  repite su tarjeta («Detecta el comportamiento: sobrevive a recompilar») ni la ropa, el acento y «cómo anda», ni la regla de la
  cadena entera como texto; el nombre original va en **una frase**, la escalera en **tres chips**, y añade cómo se escribe la
  regla de nombre original (lectura línea a línea del filtro y la condición) y qué rompe cada regla. Lo nuevo es más de la
  mitad de s04 y s05; lo repetido es una frase y los tres chips.
- **V3** (`video/diamond-e7/narration.json`, s03-04): ya dijo en voz que el patrón del pipe suele seguir aunque recompilen
  (`vc_pipe_%08x`). V27 lo usa como línea de la regla, dice «el molde», sin repetir la frase y sin la imagen del acento.
- **V8** (`video/stix-isac`): comparte la lección de origen en espíritu (reglas, indicadores). V27 no enseña STIX ni TAXII, ni
  caducidad ni el indicador de `cdn-sync-status.example`.
- **V22/V23**: tres vídeos con un adversario que empuja un atajo. M1 y M2 son uno de método («una palabra») y una
  fanfarronada («me cambio el nombre»), no un «bloquea».

**Preguntas para Lidia** (ninguna bloquea; recomendadas entre paréntesis): (1) ¿El vídeo va tras el primer check de la lección
y antes de STIX/TAXII (**recomendado**), o al final, tras el check 3? (2) ¿VELVET CICADA habla ya en este vídeo, con la voz de
Pablo (**recomendado**), o se queda en GLASS VIPER por ahora? (3) ¿Cómo dices YARA, Sigma y certutil? (4) ¿La pregunta se queda
como «¿cuál sigue saltando?» (**recomendado**, es válida) o se cambia por la del decodificador propio, que obliga a usar la
escalera (decisión 7)?

**Cambios de la revisión** (2026-10-14, `revision-gcti.md` y `reconciliacion.md`):
- **Corregir 1 · escalera:** quitados «artefactos», «herramienta» y «cima»; tres rótulos («el nombre del disco», «el nombre
  original», «la cadena entera») y la frase de s2m5q8. Concepto 3, tabla de escenas, tabla frágil/robusta, párrafo de la
  pirámide y decisión 5 reescritos.
- **Corregir 2 · `wcssvc.exe`:** «no son hechos de Meridian» retirado; ahora el canon dice que `wcssvc.exe` y su comando ya
  son de V7 y que lo nuevo es la regla A y los eventos con el nombre normal y `otro-nombre.exe`. Rótulo «evento de ejemplo»
  en pantalla y condicional en voz.
- **Corregir 3 · `-urlcache`:** «banderas de decodificar» fuera; «una de dos banderas de uso» y «decodificar o descargar»;
  añadido a «A verificar».
- **Corregir 4 · «cargador»:** analogía con botella de agua, paraguas y libro; la voz dice «el programa» y no «cargador» ni
  «loader» (el nombre de la regla lleva «Loader» solo en pantalla).
- **Corregir 5 · compañía y PDB:** tarjeta 2 «Cadena genérica, acompañada. El PDB, que es único, solo» (55); la pantalla marca
  `$pdb` «único» y `$api`, `$pipe`, `$op` «de compañía»; la imagen ya no promete que cualquier pareja sea rara.
- **Corregir 6 · autor:** «extracto de la lección · ficticia»; autor solo en la YARA; la Sigma, sin autor; apuntado el aviso
  para el registro de §3.
- **Corregir 7 · recompilar:** «sobrevive a recompilar» fuera; entra la frase «una regla de YARA vive mientras el programa
  conserve esas piezas» (ya no se recorta); columna «Robusta» pasa a «Con menos ruido»; cierre regla 3 matizada.
- **Corregir 8 · eventos:** tarjetas de tres campos (`Image`, `OriginalFileName`, `CommandLine`); el legítimo lleva el mismo
  original; el filtro marcado; el hueco de «cualquier carpeta» sale en s05 y en las notas.
- **Corregir 9 · mensaje 2:** «A mis herramientas las llamo como quiero. Tu regla no lo verá.» (62).
- **Solape con V7:** una frase en s04 y tres chips en s05; s05 se dedica a «qué la rompe»; suma 218 s sin cambios; decisión 8.
- **De «a tener en cuenta» (aplicados):** 2 (Sigma «no corre en el SIEM tal cual», tarjeta de 48 y columna «se traduce»), 4
  (decisión 2 y respuesta distinta de la de V22), 5 (capítulo II «Qué mira cada regla»), 6 (`falsepositives` al orden de
  recorte), 8 (par `meta`/`strings`/`condition` en voz), 9 (el molde del pipe), 10 (cierre «entre estas, la que más aguanta»).
- **Recontado** con `check-v27-fix.mjs` (tarjetas 39, 55, 50, 48; pregunta 45; mensajes 63 y 62; suma 218 s).

**Hallazgos no aplicados:**
- **A tener en cuenta 3 (tarjeta «PE header»):** se deja la tarjeta como la lección y V7 (50 caracteres); el examen usa «PE
  header» y la voz ya dice «por dentro del programa». Pasa a «A verificar» con el aviso de Sysmon, EDR y el evento 4688.
- **A tener en cuenta 1 (pregunta que casi se contesta sola):** no aplicado en la propuesta, por ser decisión de Lidia según el
  revisor; queda como decisión 7 y pregunta 4, con la variante lista.
- **A tener en cuenta 7 (etiqueta del taller):** resuelto como decisión explícita (9), no como frase nueva.
- Ninguna de las nueve correcciones resultó equivocada al contrastarla con `src/data/s5.ts` y `src/data/s2.ts`.
