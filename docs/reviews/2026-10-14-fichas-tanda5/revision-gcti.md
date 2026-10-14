# Revisión de exactitud y canon · V27 (GCTI, s5m3, VELVET CICADA)

Revisión de solo lectura del 2026-10-14 sobre `ficha-V27.md` (esta carpeta), contra `src/data/s5.ts`, `src/data/s2.ts`,
`src/data/s3.ts`, `docs/superpowers/canon/velvet-cicada.md`, el plan `docs/superpowers/plans/2026-09-25-lesson-videos.md`
y los datos de pantalla y guiones publicados de V3, V7, V8, V13, V14, V15, V22 y V23. Rutas relativas a la raíz del repo
(worktree `video-fichas-tanda5`). `ficha-V27.md:NN` remite al borrador tal como está hoy.

Gravedad, la de las tandas 3 y 4: **bloquea** (la ficha congelaría algo que enseña lo contrario de la lección o del
examen, o un dato de canon en contra), **corregir en la ficha** (cambiar una frase o una línea de la pantalla) y
**a tener en cuenta** (pulido o aviso para el guion).

## Veredicto

| Ficha | Veredicto | Por qué |
|---|---|---|
| **V27** · s5m3 | **listo con arreglos** (sin bloqueo) | Ninguna regla de las tres es sintácticamente inválida, ningún dato de canon se pisa y el diseño (leer dos reglas hechas, no elegir cadenas) esquiva bien el Lab 3B y s3m5. Pero hay nueve cosas que arreglar antes de congelar: la escalera contradice a la lección en dos sitios, un «no son hechos de Meridian» que es falso para `wcssvc.exe`, una bandera de Sigma que no decodifica, el homónimo «cargador», y tres afirmaciones sobre las reglas que la propia regla en pantalla desmiente. |

## Límites del validador, recontados con Node

Script propio (`scratchpad/check.mjs`) contra `video/engine/scripts/lib/narration.mjs:15-24,287-288,303-304,322-323,
391-392,412` y `profiles.mjs:58-71` (`capsula-yt`). **Todo lo que dice la ficha coincide**:

- Tarjetas 39, 50, 50 y 54 (máx. 58, `EXAM_TEXT_MAX`); 4 tarjetas dentro de 3–5; `objective: "Dissemination"` es dominio
  válido (`GCTI_DOMAINS`, `profiles.mjs:80`); una por escena de s02 a s05, ninguna en s01 ni en la última (el validador
  da error con más de una por escena y con una en el cierre, `narration.mjs:391-392`).
- Pregunta 45 (máx. 48, `THINK_Q_MAX`), `holdMs` 4500 (rango 1800–5000, mínimo 4000 en `-yt`); un solo `think`.
- Mensajes 63 y 56 (máx. 70), `holdMs` 3500 (2500–4500); uno por capítulo (s03 en el I, s04 en el II), ninguno en
  s06, y el mensaje y la pregunta de s04 en segmentos distintos (el validador no los admite juntos, `narration.mjs:327`).
- Ni `FORBIDDEN_SYMBOLS` ni `{}[]|<>` en tarjetas, pregunta y mensajes. El `|` de `Image|endswith` solo está en la
  pantalla de la regla.
- Suma de escenas 18+34+46+60+36+24 = 218 s (ventana 190–260); `wordBudget` 49, 92, 124, 162, 97, 65 = 589. Las
  cápsulas publicadas con 218 s de plan llevan 542–562 palabras (V22 552, V23 549, V7 562, V8 559, V15 542) y salieron en
  3:45–3:59, así que «unas 550 palabras → ~3:50» es realista y el estimado de ~250 s de la ficha es conservador.
- Tres capítulos (máx. 3); 3 conceptos (2–3).
- `sfx`: `alarm`, `error` y `check` existen en `video/engine/sfx/` (`sfx.json`); los tres ids de cue (`flood`, `miss`,
  `hit`) son únicos y cada uno vive en una sola escena (el motor lo exige, `sfx.mjs:49-50`).
- **Lo que el validador no mira y sí importa** (ver «A tener en cuenta» 5): el título del capítulo II se ve durante la
  pregunta.

## Hallazgos

### Bloquea

Ninguno.

### Corregir en la ficha

1. **La escalera contradice a la lección en dos sitios, y la ficha solo avisa de uno** (`ficha-V27.md:96`, `:119`,
   `:106-109`, decisión 5 `:343-345`). El escalón 2 («por el nombre original») va a «herramienta» con los rótulos de
   V7. Pero:
   - la tabla de s5m3 pone Sigma entera en TTPs (`src/data/s5.ts:565`), que es lo único que la ficha reconoce;
   - **el árbol de s2m5 etiqueta la propia línea `wcssvc.exe -decode …` como `[Pyramid: TTP - tough]`**
     (`src/data/s2.ts:1182-1185`), y esa es la lección de la que viene V7;
   - V7 puso en Tools el *nombre* `wcssvc.exe (CertUtil)`, un artefacto, no la regla (`video/attack-piramide/src/data/
     s04-piramide.ts:38`). La regla de conducta de V7 es la del rótulo «sin hash» de `s05-otra-ropa.ts:33-38`.
   Un alumno que repase s2m5 verá TTP-tough junto a esa misma línea y V27 dirá «herramienta».
   **Cambio.** Quitar de la escalera los nombres de nivel de la pirámide (que sean solo tres escalones rotulados «el
   nombre del disco», «el nombre original» y «la cadena entera») y no decir «artefactos», «herramienta» ni «cima».
   El mensaje que sí es de la lección, y no choca con ninguna tabla, es el de s2m5q8 (`src/data/s2.ts:1360-1373`):
   «si cambia de herramienta, la regla del nombre original ya no ve». Si se quiere conservar la pirámide, que la
   ficha nombre las dos líneas (`s5.ts:565`, `s2.ts:1185`) y diga que V27 sigue a V7.

2. **«No son hechos de Meridian» es falso para el evento con `wcssvc.exe`, y la regla B «salta» sobre un hecho de
   canon** (`ficha-V27.md:209-212`, `:78`, `:208`, `:118`). `wcssvc.exe -decode a.txt payload.bin` es el comando de
   `src/data/s2.ts:1182`, el de la rama de V7 (`video/attack-piramide/storyboard.json:57`, escena s03; `s03-ramas.ts:49-51`
   con `OriginalFileName: CertUtil.exe`) y el de s5m3q9 (`s5.ts:786`). El registro lo tiene en §3 «Capacidades»
   (`velvet-cicada.md:154`) y en §7 V7. Solo `otro-nombre.exe` y `certutil.exe` con el nombre normal son del vídeo. Y la
   ficha dice a la vez que el vídeo «no dice que hayan saltado alguna vez» (`:78`, `:208`) y que en s04 «salta» (`:118`).
   Quien vio V7 reconocerá la línea y leerá un segundo acierto retrospectivo de una regla nueva, justo el tipo de dato
   que V7 declaró «sin fecha ni dueño».
   **Cambio.** Reescribir `:209-212`: «`wcssvc.exe` y su comando ya son canon (V7, s2m5); lo nuevo es la regla A, el
   evento con el nombre normal y `otro-nombre.exe`». Poner en pantalla sobre los eventos el rótulo «evento de ejemplo»
   y en voz «si llega un evento así», nunca «salta» en pasado. Si Lidia prefiere no acercarse a la línea de V7, usar
   `otro-nombre.exe` también en el primer evento y dejar `wcssvc.exe` solo en la regla A.

3. **`-urlcache` no decodifica** (`ficha-V27.md:96`, `:118`; `s5.ts:543-545`). La ficha llama a las dos banderas «las
   banderas de decodificar». `-decode` convierte un fichero codificado; `-urlcache` descarga desde una URL (de memoria,
   uso conocido de `certutil` como LOLBin; no contrastado con FOR578). La lección tampoco lo dice bien: el
   `description` del Sigma habla de «decoding a staged payload» (`s5.ts:534`) y la q7 de «decode flags» (`s5.ts:766`).
   En s04 la ficha ya dice «una de dos banderas», que es correcto.
   **Cambio.** En el concepto 3 sustituir «las banderas de decodificar» por «una de dos banderas de uso» y que la voz diga
   «decodificar o descargar». No decir «banderas de decodificar» en ningún sitio.

4. **«Cargador» es el programa malicioso y la botella-cargador de la analogía** (`ficha-V27.md:87`, `:66`, `:68`).
   La imagen de las cadenas genéricas es «la botella y el cargador», y la voz va a decir «la regla del cargador» y «el
   cargador de la primera etapa» (el loader). En el mismo vídeo, dos «cargadores». El alumno que oye «un cargador lo
   lleva cualquiera» mientras ve la regla `GLASSVIPER_Loader_MemMap` entiende «el loader lo lleva cualquiera».
   **Cambio.** En la analogía, objetos sin doble sentido: botella de agua, un paraguas, un libro. Y que la voz diga
   «el programa» o «el loader» (V8 lo escribe `loader` en pantalla), no «cargador», en toda la ficha.

5. **El concepto 2 y la tarjeta 2 prometen más de lo que la regla hace** (`ficha-V27.md:95`, `:125`, s03 `:117`;
   `s5.ts:509,515,520`). Tres cosas:
   - La imagen dice que «dos objetos medio raros juntos también [pitan]». `2 of ($api, $pipe, $op)` también se cumple con
     `$api` + `$op`, y `$op` = `6A 40 68 00 30 00 00` es `push 0x40; push 0x3000` (los argumentos clásicos de una
     reserva de memoria RWX: `PAGE_EXECUTE_READWRITE`, `MEM_COMMIT|MEM_RESERVE`; de memoria, el decodificado de los
     bytes es seguro, que aparezca en mucho software legítimo no lo he contrastado). O sea: dos cadenas genéricas se
     bastan. Solo `$pipe` y `$pdb` son raras.
   - La tarjeta «Artefacto único: solo» y la propia regla en pantalla discrepan: `$pipe`, que la lección llama
     «pipe con formato propio… puede disparar solo» (`s5.ts:520`), en la regla *necesita* compañía (`2 of`). Solo el PDB
     va solo.
   - La ficha dice «el PDB, que ya basta» (`:117`) y «artefacto de alta especificidad» (`:95`). La especificidad es
     lo que quita ruido; no es lo que cuesta cambiar (ver 7).
   **Cambio.** Tarjeta 2: «Cadena genérica, acompañada. El PDB, que es único, solo» (55). En voz, «con compañía»
   sin prometer que cualquier pareja sea rara; «dos señales juntas bajan mucho el ruido» y no «no hay ruido». Y que la
   pantalla marque `$pdb` como «único» y `$pipe`, `$api`, `$op` como «de compañía».

6. **«Autor: Meridian CTI» no es de la regla Sigma** (`ficha-V27.md:73-74`, `:117`, `:203`). La regla YARA lleva
   `author = "Meridian CTI"` (`s5.ts:500`); la Sigma no tiene `author` en ningún sitio (`s5.ts:531-551`). El registro
   dice «Autor de flash alert, YARA y Sigma» (`velvet-cicada.md:98`, con `s5.ts:47,69,500`) y la ficha lo hereda, pero la
   lección solo da el autor de la YARA. Y el rótulo «ejemplo de la lección · ficticia» sobre una regla a la que se le han
   quitado cuatro líneas sugiere copia literal.
   **Cambio.** YARA: «extracto de la lección · ficticia», con su `author` tal como está. Sigma: «extracto de la
   lección · ficticia», sin autor. Y apuntar en el registro de §3 que el autor de la Sigma no consta. «Extracto» es el
   rótulo que ya usó V9 para su matriz.

7. **«Sobrevive a recompilar» y «el PDB que ya basta» chocan con la tesis «lo que no cambia gratis»**
   (`ficha-V27.md:96`, `:102`, `:149-151`, s05 `:119`, recorte `:46-47`).
   - El escalón 2 «sobrevive a renombrar y a recompilar»: `certutil.exe` es de Microsoft y no lo compila el actor, así que
     «recompilar» no es aplicable; si compilase *su* decodificador, llevaría su propio `OriginalFilename`. La lección sí
     dice «Re-compilación y renombrado de herramientas» en la tabla (`s5.ts:564`), de modo que no es un error de
     la ficha sino un arrastre. Aun así, en voz solo «renombrar».
   - El campo `OriginalFilename` de una copia de `certutil` no se puede reescribir sin invalidar la firma de Microsoft, y
     por eso la regla funciona *para un LOLBin renombrado*. Para un binario del actor es un campo que él controla (de
     memoria; la ficha ya lo pone a verificar en `:285-287`).
   - La YARA «robusta» lo es contra el *ruido*, no contra la *evasión*: si el actor compila desde otra carpeta, `$pdb`
     desaparece; con otro compilador o banderas, `$op` cambia. La ficha lo dice de la regla frágil
     («ruido, no evasión», `:102`) pero llama «robusta» a la de la lección sin matizar, y el cierre regla 3 («apóyate en lo
     que el atacante no cambia gratis») la deja a medias: el PDB sí se cambia gratis. V14 y V15 ya dicen «a veces… no
     siempre la lleva» (`video/hilos-pelicula/narration.json:178`; `video/sandbox-muestra/narration.json` s05-07).
   **Cambio.** En s05, la frase que se recorta en `:46-47` («la segunda mitad de la frase sobre YARA y la
   recompilación») debe **entrar** y decir lo que la tabla de la lección ya dice (`s5.ts:564`: YARA sobrevive a la
   *rotación de infraestructura*, no a un cambio de compilación): «una regla de YARA vive mientras el programa conserve
   esas piezas». Cambiar en la ficha la columna «Robusta» a «con menos ruido».

8. **Los eventos de pantalla no dejan ver lo que cada regla lee** (`ficha-V27.md:118`; `s5.ts:546-548`). La ficha pinta
   los eventos como una línea de comando. Pero A lee `Image`; B lee `OriginalFileName` y `CommandLine`, y su filtro vuelve
   a leer `Image`. Con solo la línea de comando, «por qué no salta el evento legítimo» no es legible: el original de ese
   evento es también `CertUtil.exe`, y lo que lo libra es el *filtro* por nombre. Además `endswith '\certutil.exe'`
   admite *cualquier carpeta* (un `certutil.exe` copiado a otra ruta queda filtrado); que la ficha lo diga si hay hueco:
   es el fallo evidente de la regla de la lección y un lector de Sigma lo verá.
   **Cambio.** Cada evento como tarjeta de tres campos: `Image`, `OriginalFileName`, `CommandLine`. El evento legítimo
   lleva el mismo original que el renombrado (`CertUtil.exe`) y distinta `Image`. Con el filtro marcado como lo que lo
   explica. Y una nota en `script-notes`: el filtro por nombre admite cualquier ruta.

9. **El mensaje 2 habla de «mi programa» y lo renombrado es de Microsoft** (`ficha-V27.md:143`, `:134-135`). «A mi programa
   lo llamo como quiero» promete que el atacante nombra lo suyo; lo que la regla B ve es `certutil`, una herramienta
   de Windows. La ficha lo anclaba «al fichero» para que no se lea como cambio de grupo, pero el sujeto sigue siendo «mi
   programa». El mensaje 1 sí está bien («una palabra de mi programa» es el loader).
   **Cambio.** «Le pongo el nombre que quiero. Tu regla no lo verá.» (51), o «A mis herramientas las llamo como quiero.
   Tu regla no lo verá.» (62). Con cualquiera sigue siendo un atajo de método.

### A tener en cuenta

1. **La pregunta casi se contesta sola** (`ficha-V27.md:128-135`, la misma nota que V23 recibió en la tanda 4). La regla A
   es literalmente `Image|endswith '\wcssvc.exe'` y el evento nuevo es `otro-nombre.exe`: quien lo lee ve que A no
   puede saltar sin saber nada de Sigma, y la respuesta de B ya la enseñó s04 (los eventos de ejemplo). El título de la
   escena no la da; el contenido sí. Una elección que obligue a usar lo contado (y que pague la escalera de s05) es la de
   s2m5q8, que ya está en la lección:
   - Pregunta: «Decodificador propio: ¿cuál sigue viéndolo?» (43), con A, B y el evento de un programa del actor con
     otro nombre *y* otro original.
   - Respuesta: «Ninguna de las dos. Hace falta subir un nivel» → escalón 3 de s05, con su sfx `miss` en A y en B, y
     `hit` en la regla de la cadena entera.
   Es una decisión de Lidia: la propuesta actual es válida (respuesta B, sin error técnico) y la segunda cambia el mensaje
   2 y la respuesta de s04.

2. **«Sigma no se ejecuta» frente a «Sigma corre en el SIEM»** (`ficha-V27.md:119`, tarjeta 4 `:127`; `s5.ts:562,634`).
   Es la tabla y la nota de examen de la lección, y la tarjeta la copia bien. Pero en la misma escena la columna dice
   «corre en: el SIEM, tras convertirla» y la tarjeta «no se ejecuta». Dos verbos para lo mismo en 36 s. Y, de memoria,
   herramientas como Chainsaw, Hayabusa o Zircolite sí evalúan reglas Sigma directamente sobre los logs, sin SIEM; la
   afirmación segura es «no se ejecuta en el SIEM tal cual». Alternativa: «Sigma no corre en el SIEM tal cual: se
   convierte» (48), y la columna «se traduce a la consulta de tu SIEM, y esa corre».

3. **«PE header» en la tarjeta 3** (`ficha-V27.md:126`, `:285-287`). La ficha ya lo marca. De memoria: `OriginalFilename`
   está en el recurso de versión (VERSIONINFO) del PE, no en la cabecera, y se lee como `OriginalFileName` en Sysmon
   (evento 1) y en EDR. V7 ya publicó «cabecera PE» (`video/attack-piramide/src/data/s03-ramas.ts:45-52`), la lección
   en s2m5 y s5m3 dicen lo mismo, así que V27 no contradice a nadie diciendo «cabecera». Si se quiere ser exacto sin
   chocar con V7: «El nombre original va dentro del programa, no en el disco» (57). Ojo con el aviso de plataforma:
   `OriginalFileName` lo dan Sysmon y la mayoría de EDR, no el evento 4688 de Seguridad; una regla Sigma con ese campo
   solo vale con telemetría que lo lleve (de memoria).

4. **Voz de VELVET CICADA: Pablo + `machine` no es nuevo ni único** (`ficha-V27.md:22-25`, decisión 2 `:333-337`). Los
   hechos: la usan GLASS VIPER (V3, V7, V13, V14, V22) y HOLLOW LANTERN (V4, V8, V15), y en Security+ SILENT PAGER (todos
   los vídeos `-halden` de esa voz). Lo comprobé en `adversaryVoice` de cada `video/*/narration.json`. La ficha lo cuenta
   bien en lo primero, pero «se parece a GLASS VIPER» (`:336`) se queda corto: es la voz *por defecto* del adversario,
   así que VELVET CICADA será indistinguible de oído de dos de los cuatro adversarios GCTI. Sec+ diferencia por `fx`
   (`cifrado`, `telefono`, `megafonia`); GCTI solo ha diferenciado a PAPER CRANE (Laura). No choca con nada y la firma en
   pantalla basta; si Lidia quiere que el jefe de S5 suene distinto, el hueco es un `fx` propio, no otra voz. Decisión
   suya.
   Dos comprobaciones de canon que sí encajan: «analista» es de la ficha de la sección (`course-gcti.ts:95`, «Última
   palabra, analista.»), y los dos mensajes no repiten ninguno de los 22 del registro (`velvet-cicada.md:190-214`).
   El «Qué fácil» de M1 es el cebo de método de V22; el M2 es de la familia de «Bloquea mi hash» (V7) y «Me mudo en
   cinco minutos» (V22): «te hago algo barato y tu defensa no me ve». Tres vídeos con esa forma; no choca, pero
   conviene que la respuesta de V27 no sea la misma frase de V22 («tiene razón en algo»).

5. **El título del capítulo II («La regla que aguanta») se ve durante la pregunta** (`ficha-V27.md:111`, s04 `:118`).
   `video/engine/src/overlay/ChapterRail.tsx` pinta los títulos de capítulo; el plan §1 pide que el título de la
   *escena* no destripe su pregunta (revisión de V11). Aquí el capítulo anuncia que hay una regla que aguanta. Sugerido:
   «Leer una regla Sigma» o «Qué mira cada regla». Mismo aviso para el título del capítulo del I («Dos miradas») si hay
   una pregunta en él: no la hay.

6. **Densidad de s04** (`ficha-V27.md:44-47`, `:118`). 60 s con mensaje (3,5 s + el tecleo), pregunta (4,5 s), regla de
   seis bloques leída línea a línea, tres eventos, A y B, respuesta y tarjeta. Es la misma alerta que V22 s05 en la
   tanda 4. El orden de recorte de la ficha es sensato (el evento legítimo pasa a pantalla sin voz); añadir al punto de
   corte la lectura de `falsepositives`, que ya no se lee en voz. Con el cambio de «Corregir» 8 (tarjetas de tres campos)
   los eventos ocupan más pantalla, no más voz.

7. **El PDB y la imagen de la etiqueta del taller** (`ficha-V27.md:88`, `:95`; `velvet-cicada.md:627-630,666-671`). La
   ficha excluye «la casa, el taller o la etiqueta de V13 a V15» y es una decisión coherente con «una imagen por
   concepto». Pero la ruta del PDB *es* esa etiqueta en tres vídeos; si V27 dice «a veces se queda escrita» sin la imagen,
   rompe un hilo (V13 la nombra a medias, V14 y V15 con la frase completa). Una referencia de una frase («la ruta del PDB,
   la etiqueta del taller de V14») la ata sin añadir imagen nueva. Si no, que la ficha lo escriba como decisión.

8. **Nombres de las tres partes de YARA solo en castellano** (`ficha-V27.md:66-67`). El examen es en inglés y s3m5q4
   pregunta «meta, strings, condition» (`src/data/s3.ts:1211-1224`). En pantalla van los tres; en voz, «contexto, cadenas
   y condición» una sola vez sin los términos del examen no ayuda. Que diga el par una vez («el contexto, `meta`; las
   cadenas, `strings`; y la condición») o lo deje a la pantalla con el cue encendido.

9. **`vc_pipe_%08x` en la regla y `vc_pipe_3a7f09c1` en V3** (`ficha-V27.md:350-356`;
   `video/diamond-e7/narration.json:95`, s03-04; `velvet-cicada.md:148`). La regla busca la *cadena de formato* que está en
   el binario; el EDR de V3 y el sandbox de V15 ven el nombre ya con el número. Quien viene de V15 («mismo formato, otro
   número en cada ejecución») lo entenderá; la voz de V27 puede ahorrarse la confusión con «el molde del nombre, no el
   nombre de cada ejecución». No es un choque.

10. **La q7 dice «la inversión más duradera» y el vídeo dice «ninguna regla es para siempre»** (`ficha-V27.md:149-151`;
    `s5.ts:759-772`, check 3 `:655-669`). No se contradicen (la q7 compara con listas y hashes), pero la frase de
    cierre conviene con «entre estas, la que más aguanta», para que quien responda la q7 después del vídeo no sienta que
    el vídeo le quita la respuesta.

## Respuestas a los seis puntos del encargo

**1. Exactitud técnica y sintaxis.** Comprobado evaluando las dos plantillas de `s5.ts:497-516` y `:531-551` con Node:
`\\\\` → `\\` en el `$pdb` de YARA y `'\\certutil.exe'` → `'\certutil.exe'` en Sigma, como dice la ficha.
- **YARA** (`ficha-V27.md:221-238`): válida. `meta`/`strings`/`condition` en orden, los cuatro identificadores se usan
  (el compilador de YARA rechaza cadenas sin usar), `ascii wide` y el hex entre llaves, `250KB`, `uint16(0)` y
  `2 of (...)` son sintaxis estándar. Sin `date` ni `reference` sigue siendo válida: son metadatos libres.
- **Sigma** (`:245-263`): válida. Sin `id` ni `references` también: la especificación pide `title`, `logsource` y
  `detection` (de memoria; `id` recomendado, no obligatorio). `OriginalFileName: 'CertUtil.exe'` y la lista bajo
  `CommandLine|contains` se leen como `Y` entre campos y `O` dentro de la lista, que es lo que dice la ficha
  («una de dos banderas»); `Image|endswith: '\certutil.exe'` con comillas simples no necesita escapes.
  `selection and not filter_expected` es la condición correcta. El `id` de la lección
  (`4b8d2f6a-9c31-4e02-b7aa-meridian0042`) no es un UUID: la ficha acierta quitándolo.
- **Regla A** (`:267-277`): válida, mínima (`title`, `logsource`, `detection`, `level`).
- **Honestidad del recorte**: aceptable con el rótulo «extracto» (Corregir 6). El retoque no cambia ninguna decisión de
  la regla.
- **Claims de la ficha sin respaldo de la lección**: la regla A y los tres eventos son del vídeo, como dice (`:279`); el
  uso de `wcssvc.exe` es canon (Corregir 2); el escalón 3 («la cadena entera») está en `s2.ts:1186` y q8.
- **No contrastado con FOR578** (no tengo acceso): el significado de «section map», el campo `OriginalFileName` como
  recurso de versión, la afirmación de que Sigma lo evalúa un SIEM solo por conversión, las banderas de `certutil`.

**2. Canon.** Sin choque; tres puntos de redacción.
- `wcssvc.exe` en V7 sale en el árbol (`video/attack-piramide/src/scenes/parts/ProcessTree.tsx:70-73`), en la rama de
  Defense Evasion con `OriginalFileName: CertUtil.exe` y el nombre en disco tachado (`s03-ramas.ts:45-52`) y como chip
  `wcssvc.exe (CertUtil)` en Tools (`s04-piramide.ts:38`). La voz de V7 dice «Por dentro es certutil, de Windows, con otro
  nombre» (`narration.json:87`). Ficha: «`wcssvc.exe` sale solo como en V7» es verdad en nombre y comando, pero no que «no son
  hechos de Meridian» (Corregir 2).
- Hash: ninguno en V27, ni en voz ni en pantalla. Los de V7 son `4c81...b3` (`s05-otra-ropa.ts:24`) y `9f3a...e1`
  (`s05-otra-ropa.ts:13`); V27 no los repite. Los bytes `$op` son código, no un hash.
- `winhlp.exe` y `updsvc.exe` no salen. Pipes: `vc_pipe_%08x` como molde; V3 y V15 enseñan las instancias. PDB: la
  ruta canónica (`velvet-cicada.md:146`); V14 la enseña tal cual (`CompareTable.tsx:61,82`). Dominios y horas: ninguno.
- Plan §6 P4 (`lesson-videos.md:4520`): «certutil renombrado = `wcssvc.exe`, párrafo de Sigma de s5m3 y q9 corregidos».
  V27 usa `wcssvc.exe` como regla del plan. Respeta además «se deja sin tocar `4c81...b3`». Sin choque.
- §5: respeta 1 y 11 (hash y PDB sin número de muestras), 17 (MER-2026-011 quitado), 19 (sin hora ni equipo para
  `wcssvc.exe`) y 9 (GLASS VIPER = loader; VELVET CICADA firma). Aviso en 9: la regla en pantalla dice «GLASS VIPER
  stage-1 loader» y la firma es VELVET CICADA, que es la lectura de V8, y esta sigue abierta en el registro.
- BROKEN CHAIN (`course-gcti.ts:40`): la regla mete el PDB en una YARA, no dice «tres muestras» ni «cara técnica». Bien.

**3. Primera voz de VELVET CICADA.** Ver «A tener en cuenta» 4. Verificado que nunca ha hablado (`velvet-cicada.md:190-214`
no tiene ninguna fila) y que `adversary: "VELVET CICADA"` es el de la sección (`course-gcti.ts:93`). Encaja con la ficha
del jefe («El núcleo del grupo…», `:94-95`). El dosier de LAST WORD («al descubierto», `:97`) no se destripa: los mensajes
no dicen qué es VELVET CICADA ni qué hará. El que conoce V3 («Llámame GLASS VIPER… Mi nombre no lo sabrás») y V14
(«dime quién soy») no queda contradicho: el nombre del adversario sigue siendo un nombre de seguimiento, que la ficha
mantiene.

**4. Reglas de `capsula-yt`.** Recontadas arriba; todo en regla. Sin avisos del validador previstos. Falta confirmar
solo lo que depende del guion real (frases de 22 palabras, un «:» por segmento, tercio de segmentos).

**5. Inserción.** Posiciones verificadas en `src/data/s5.ts`: check 1 `:568-582`, encabezado STIX `:583`, nota de examen
`:630-635`, check TLP `:640-654`, check 3 `:655-669`, `quiz` `:671`. `s5.ts` no tiene ningún bloque `video` hoy.
- El bloque `{ t: 'video', title, youtube, poster, transcript }` es la forma de V7 (`s2.ts:1203-1208`).
- La suite `lesson videos` (`src/data/content.test.ts`): no pide posición. Exige el `youtubeVideos.find(...)?.module` que
  la ficha propone (`:267-319`), que el id sea un id de YouTube de 11 caracteres (`isYouTubeId`, `youtube.ts:6`),
  que el póster y la transcripción existan en `public/videos/` con extensión y sin `/` ni `..`, y que ningún activo se
  comparta (`:346-364`). No se puede publicar el bloque con `'<id>'` mientras no exista el vídeo en YouTube.
- Los checks 2 y 3 que quedan: el 2 (TLP) no se toca. El 3 («longest-lived», respuesta: reglas de comportamiento)
  queda contestado por la tesis del vídeo, como declara la ficha. Su respuesta ya está en la lección (`s5.ts:484`,
  `:564-565`) y en V7, así que el coste es bajo.
- **Hay tres huecos, no dos.** Los dos de la ficha (tras el check 1; tras el check 3 y antes del `quiz`) y un tercero
  que la ficha no nombra: entre la tabla (`:558-567`) y el check 1. Este último destripa el check 1 (su respuesta es
  la mitad del vídeo), así que el de la ficha es el mejor de los tres: es el único que no destripa ninguno de los dos
  checks más allá de lo que la lección ya dice. El final de la lección (como V22) queda a tres secciones de lo que
  resume y es peor en este caso, porque V27 solo cuenta una mitad. Conclusión: **mantener la inserción de la ficha**.
  Un precedente en el mismo tema: V8 va entre las dos mitades de s3m5 (`s3.ts:1110`).

**6. Solapes.** V27 aporta más de lo que repite, pero menos de lo que parece.
- **Con V7**: el escalón 2 es V7 s03-02 (nombre original, nombre del disco tachado, «por dentro es certutil») y el
  escalón 3 es V7 s05 (la regla de la cadena entera, `s05-otra-ropa.ts:33-38`). Más de la mitad de s04 y casi toda
  s05 son V7 con otro envoltorio. **Lo nuevo de verdad** es: cómo se *lee* una regla Sigma (`logsource`, `selection`,
  `filter_expected`, `condition`), la condición de una YARA (`$pdb or 2 of`, MZ y tamaño), YARA frente a Sigma y dónde
  corre cada una. Recomendación: que V27 se apoye en V7 con una frase (no explique otra vez qué es el nombre original)
  y gaste el tiempo en el filtro y en la condición.
- **Con V3**: el pipe como línea de regla, no como «acento». Sin choque (A tener en cuenta 9).
- **Con V8**: «YARA entera» es justo lo que V8 dejó para «otra cápsula» (`lesson-videos.md:1153-1154`). Con s3m5, que ya
  tiene «YARA en 60 segundos» (`s3.ts:1123-1148`, q4 y q5), V27 es el segundo pase sobre la misma idea en otra sección,
  con otro ejemplo: aceptable y declarado.
- **Con V13 a V15**: el PDB y la etiqueta del taller (A tener en cuenta 7).
- **Con V22 y V23**: tres vídeos con el adversario empujando un atajo; la forma es la de V7 y V22 (A tener en cuenta 4).

## Lo que queda bien

- La penalización L está bien resuelta: no se elige ninguna cadena, no se repite ninguna de las seis cadenas ni las
  cuatro muestras del Lab 3B, y la coincidencia del PDB (`labs.ts:772`) está declarada.
- Ningún hash, fecha, equipo, número de informe ni persona nueva. Los motivos del recorte de `date`, `reference`, `id` y
  `references` son los correctos (§5 punto 17 y el `id` que no es UUID).
- La separación «la voz nunca dice GLASS VIPER ni VELVET CICADA» es la de V22 y V23.
- Los mensajes ni confiesan ni dicen qué es el grupo, y el primero se contesta dejando las dos ramas de la condición
  (`s5.ts:520`), no una sola.
- Cierre: tres reglas y una sola acción (las diez preguntas de la lección), con el Lab 3B en las notas.
- La referencia a la lección del Lab 2C y a la placement está bien medida: no sale `Create a Sigma rule…` ni se usan los
  escenarios de `pl-s5q7`, `pl-s3q10` y `pl-s3q12`.
- La propia ficha pone a verificar (`:283-287`) tres de las cosas que aquí se confirman a medias: queda como lista de
  tareas.

## Lo que no he podido verificar

- **GIAC GCTI / SANS FOR578**: no tengo acceso al material. Todo lo dicho de memoria va marcado arriba: que `-urlcache`
  descarga, que `OriginalFilename` es un recurso de versión y no cabecera, que `6A 40 68 00 30 00 00` son los
  argumentos de una reserva RWX, que Chainsaw, Hayabusa y Zircolite ejecutan Sigma sin SIEM, que la especificación de
  Sigma exige solo `title`, `logsource` y `detection` y que `OriginalFileName` no viene en el evento 4688.
- **Cómo evalúa YARA el `$pdb`**: el escape `\\` es de la sintaxis de YARA (de memoria); no he ejecutado el compilador.
- **El guion de V14 y V15 completo**: sí he leído sus `narration.json` publicados, no su `out/`, que no está en el árbol.
- **Duración real**: no hay guion; solo he recalculado sumas y presupuestos y los he comparado con las cápsulas
  publicadas.
- **El comportamiento de `ChapterRail`**: sé que pinta los títulos de capítulo (`ChapterRail.tsx`), no cuándo se
  atenúan frente a la pregunta.
