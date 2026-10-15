# V27 · reglas-aeropuerto · revisión de exactitud del guion (solo lectura)

Revisado el 2026-10-16: `video/reglas-aeropuerto/narration.json`, `storyboard.json` (campo `goal`), `src/timeline.json`
(estimado 259,5 s, título a los 8,2 s), el transcript y `out/script-notes.md`. Lo he comparado con `src/data/s5.ts:488-582,630-639,671-811`,
`src/data/s3.ts:1123-1224`, `src/data/s2.ts:1155-1200,1340-1373`, la ficha (plan `:5633-6109`, idéntica a
`ficha-V27.md`), `docs/superpowers/canon/velvet-cicada.md`, `out/canon-refs.md` y las voces de V7, V8 y V3.
Las escenas todavía son placeholders (`src/scenes/S0*.tsx`), así que los hallazgos de pantalla se refieren al `goal`.

Las frases de reemplazo tienen las mismas palabras que el original o menos (el estimado ya está en 259,5 s de 260).

## Bloquea

Nada.

## Corregir

1. **`s04-05` (`narration.json:165`): la voz dice «tres eventos» cuando en pantalla hay dos.** Según `storyboard.json:79`, en
   `ev-legit`/`ev-renamed` solo salen los eventos 1 y 2; el tercero entra en `ev-new` (`s04-07`), y la voz lo presenta entonces
   como «Imagina un tercero». Contar tres antes de tiempo deja al espectador buscando un evento que no está y hace que «un tercero»
   suene a cuarto.
   Reemplazo: «Mira dos eventos de ejemplo. El de otro nombre, ese sí avisaría.» (mismo número de palabras).

2. **`s04-10` (`narration.json:205`): «Una regla por el nombre del fichero, quizá. Esta, no.» se puede entender al revés.**
   Es la respuesta al mensaje «Tu regla no lo verá», pero llega nueve segmentos después. Con las dos elipsis negativas seguidas,
   «Esta, no» se oye fácilmente como «esta no lo verá» (como en «—No vendrá. —Juan, quizá. María, no.»), y eso es justo lo que la
   regla B no hace. Pegada a «el filtro no la frena», además, invita a leer «el filtro quizá la frena».
   Reemplazo (16 palabras, las mismas): «Y el filtro no la frena. Una por el nombre del fichero, quizá no. Esta, sí.»
   La frase no se parece a la de V22 («tiene razón en algo») y corrige el error exacto del mensaje: renombrar le basta contra A,
   no contra B.

3. **Pantalla de `s04` (`storyboard.json:79`): `Image` aparece sin ruta, y con eso las reglas no casan con lo que se ve.** El
   filtro de la lección es `Image|endswith: '\certutil.exe'` (`s5.ts:547`) y la regla A, `'\wcssvc.exe'`. En `process_creation`,
   `Image` es la ruta completa (Sysmon y los EDR la dan así). Un evento con `Image: certutil.exe` a secas no termina en
   `\certutil.exe`: el filtro no lo cubriría y el evento 1 avisaría. Lo mismo le pasa a A con `wcssvc.exe`. Quien lea la pantalla con
   lupa vería reglas que no hacen lo que dice la voz.
   Arreglo, sin cambiar la voz: `Image` = `C:\Windows\System32\certutil.exe` (la ruta real de Windows, no es canon del caso),
   `…\wcssvc.exe` y `…\otro-nombre.exe` (con elipsis para no inventar carpeta, porque `s2.ts:1182` no da ninguna). La `CommandLine`
   debería llevar el programa delante, como en el canon (`wcssvc.exe -decode a.txt payload.bin`, `s2.ts:1182`; y `certutil.exe -decode …`
   y `otro-nombre.exe -decode …`). `contains '-decode'` sigue casando.

4. **Pantalla de `s05`, `breaks-filter` (`storyboard.json:104`): «una copia en otra carpeta», sola, es falsa.** Una copia con
   otro nombre en otra carpeta la caza la regla. El hueco existe solo si la copia conserva el nombre normal, porque
   `endswith '\certutil.exe'` admite cualquier carpeta. La voz (`s05-04`) ya lo dice bien; el rótulo tiene que decir lo mismo:
   «una copia con su nombre normal, en otra carpeta».

5. **Pantalla de `s03`, `cond-size` (`storyboard.json:58`): «que no pese más de 250 KB» significa ≤, y la regla dice
   `filesize < 250KB`.** La voz («que pese menos de») está bien. El rótulo, junto al código, debería decir «que pese menos de 250 KB».

## Notas

- **(a) Analogía: aprobada; solo un matiz de pantalla.** La voz reparte bien los papeles: la puerta «apunta» (es la fuente del
  registro, como Sysmon) y Sigma «mira lo que ha pasado, en los registros» (lee eventos, no los genera). El riesgo está en
  `storyboard.json:42`, que pone el rótulo SIGMA sobre «el registro de la puerta de embarque **anota**». Conviene que el rótulo
  señale a quien lee el libro de la puerta (una lupa sobre el registro), no el acto de anotar. Si se quiere reforzar en voz sin
  añadir palabras: `s02-04` «Una que **lee** lo que ha pasado, en los registros, es de Sigma». Escáner = YARA, tarjeta de embarque =
  nombre en disco, pasaporte = nombre original y botella = cadena genérica no falsean nada.
- **`s03-04` + `s03-07`: `$pipe` puede quedar como «corriente».** «Pide compañía, como las otras dos» y el cierre «lo corriente
  pide compañía» dejan deducir que `vc_pipe_%08x` es una cadena vulgar. La lección dice lo contrario (`s5.ts:520`: el pipe con
  formato propio «puede disparar solo») y V3 también («el patrón del pipe suele seguir ahí, como un acento»). La voz es correcta
  *para esta regla*, que es lo que manda la ficha. Arreglo sin palabras, en pantalla: la etiqueta de `$pipe` = «molde propio · aquí,
  de compañía», no «de compañía» a secas.
- **`s03-05` (`:113`) «Casi nadie la lleva»** puede generalizarse a «las rutas de PDB son raras». No lo son: muchos binarios
  legítimos llevan la suya; lo raro es *esta*. Opcional, mismas palabras: «Casi nadie lleva esa.»
- **(b) `s03-03` «miles de programas legítimos»** sigue a la lección (`s5.ts:520`). En el mundo real, `MapViewOfSection` casa
  como subcadena de `NtMapViewOfSection` (exportada por ntdll, importada por bastantes binarios); «miles» no lo puedo contrastar.
  Además, la propia regla dejaría fuera ntdll por `filesize < 250KB`. Se acepta porque es la lección. La lectura de la condición
  (`s03-06`) coincide con `s5.ts:513-515`: «ejecutable» por el `MZ` (también casa con DLL; la pantalla dice «empieza por MZ»),
  «menos de 250 KB» y «la ruta del PDB o dos de las otras tres». La rama `2 of` que pide compañía a `$pipe` y `$op` y el PDB como
  única rama que va sola están bien leídos.
- **(c) Sigma.** `logsource` windows/process_creation = «procesos que arrancan en Windows»; `selection` por `OriginalFileName`
  `CertUtil.exe` (el valor real del recurso de versión de certutil) Y una de las dos banderas (la lista de `contains` es un OR);
  `filter_expected`; `condition: selection and not filter_expected` = «lo que busca menos lo que filtra». Todo correcto.
  «Renombrar no lo toca» es cierto y no promete que el campo sea inalterable. «El filtro no la frena» es cierto porque
  `otro-nombre.exe` no termina en `\certutil.exe` (con el arreglo 3 se verá). «La de descargar» para `-urlcache` es una
  simplificación válida (descarga con `-urlcache -f <url>`; sin URL, gestiona la caché).
- **Tarjeta «OriginalFileName viene del PE header, no del disco».** Técnicamente el campo está en el recurso de versión del PE
  (VS_VERSIONINFO), no en la cabecera. Copia la lección y la q9 (`s5.ts:555,789`), y lo decidió la ficha. La voz («va dentro del
  programa») es segura.
- **(d) `s05`.** «Sigma no corre en el SIEM tal cual. Se traduce a la consulta de tu SIEM» es correcto (sigma-cli/pySigma con su
  backend). La cautela de «tal cual» cubre a Chainsaw, Hayabusa y Zircolite, que evalúan Sigma sin SIEM (esto lo digo de memoria).
  YARA en escáner, sandbox o EDR coincide con `s5.ts:562`. Los tres «qué la rompe» están bien; el del filtro, con el arreglo 4.
  «Vive mientras el programa conserve esas piezas» no promete de más en lo esencial; a rigor, también la rompen `filesize` y el
  `MZ` si el programa crece o se empaqueta. Opcional, sin voz: la fila de pantalla puede decir «el programa deja de conservar esas
  piezas (otra compilación, otro empaquetado)».
- **`s05-05` «Queda la de la cadena entera, que ya viste».** Para quien sigue el curso es cierto: s2m5 y V7 van antes que s5m3
  (`s2.ts:1200,1203-1205`, la regla y el vídeo V7 dentro de s2m5), y la regla coincide con la de s2m5q8 (`s2.ts:1360-1373`). Para quien solo ve
  YouTube queda flojo. Sin tocar la voz: el chip «la cadena entera» puede llevar debajo «explorer, PowerShell, tarea programada».
- **(f) La pregunta.** No la contestan ni el título de la escena, ni el del capítulo, ni la respuesta neutra al mensaje de `s04`.
  Pero `s04-02` + `s04-05` («ese sí avisaría») + la regla A con `'\wcssvc.exe'` a la vista la dejan casi contestada. Es la decisión 7
  de la ficha y la duda 3 de las notas: le toca a Lidia, no es un error.
- **(e) Límites, todo correcto.** Tarjetas de 39, 55, 50 y 48 caracteres (máximo 58), con el texto exacto de la ficha, una por
  escena de s02 a s05 y `objective` «Dissemination» (válido en `GCTI_DOMAINS`). La pregunta tiene 45 caracteres (máximo 48) y
  `holdMs` 4500. Los mensajes tienen 63 y 62 caracteres (máximo 70) y `holdMs` 3500, uno por capítulo. Están todos los cues de
  `requiredCues`. Los `sfx` caen donde pide la ficha: `alarm` en `flood` (80,9 s, s03), `error` en `miss` (170,3 s) y `check` en
  `hit` (172,6 s), en s04. Dos escenas pasan el `wordBudget` por 2 palabras (s03 126/124, s05 99/97); cualquier palabra que se
  añada tiene que salir de otro sitio. El título sale en el estimado a los 8,2 s (la ficha pide antes de 8); con el ritmo de
  Lidia (~90 %) caería hacia 7,4 s, así que conviene mirarlo tras importar la grabación.
- **Lo que la ficha prohíbe: comprobado.** En voz no salen GLASS VIPER, VELVET CICADA, «cargador», «loader», «alarma», «cámara»,
  «llave», «artefactos» ni «cima». «Herramienta» solo aparece en «otra herramienta» y «si cambia de herramienta» (s2m5q8), nunca
  como nivel. «Hash» solo como tipo de indicador en `s01`, sin valor. No hay fecha, hora ni equipo, y los eventos van en
  condicional. La YARA es de «Meridian CTI»; la Sigma, sin autor; `date`, `reference`, `id` y `references` fuera.
- **(g) Mensajes.** M1 (regla de una sola cadena) se contesta con las dos ramas, como pide `s5.ts:520`. M2 (renombrar esquiva
  cualquier regla) tiene apertura neutra y la respuesta de verdad en `s04-10`, que corrige el error exacto con el arreglo 2.
- **Canon.** No hay choques. V7 («Por dentro es certutil, de Windows, con otro nombre»; «otro nombre y otra carpeta, que ya le
  cuestan más») no contradice «lo cambia el atacante cuando quiere». V3 («Llámame GLASS VIPER») queda intacto: M2 dice
  «herramientas», no «nombre». V8 («Eres la analista de Meridian, una aeroespacial») coincide. Trivial: V7 dice «descodifica» y V27
  «decodificar»; las dos formas valen.
  Para apuntar en el registro al congelar: los dos primeros mensajes de VELVET CICADA (Pablo + `machine`, la misma voz que GLASS
  VIPER y HOLLOW LANTERN), que la Sigma no tiene autor (`velvet-cicada.md:98`), la regla A y `otro-nombre.exe` como marcador de la
  analogía, y las rutas de `Image` si se aplica el arreglo 3.

## Veredicto

**Apto con correcciones.** No hay nada que bloquee. En la voz hay dos cambios sin coste de palabras: `s04-05` («dos eventos») y
`s04-10` («quizá no. Esta, sí»). En pantalla hay tres, a aplicar al construir las escenas: rutas en `Image`, «con su nombre normal»
en `breaks-filter` y «menos de 250 KB». El resto son notas.
