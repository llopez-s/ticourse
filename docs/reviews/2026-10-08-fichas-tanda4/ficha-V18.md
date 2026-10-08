### V18 · sp4m5 · Cápsula · «Triaje de vulnerabilidades: el contexto manda sobre el número»

> Propuesta del 2026-10-08, lista para pegar tal cual en el plan de vídeos (§5, tras V17). Se graba con V19 (sp2m4): dos
> cápsulas de Security+ en la misma sesión, SILENT PAGER y RED MARROW, que no se parecen en la voz. La versión vigente de
> escenas y guion será `video/cvss-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/cvss-halden/out/script-notes.md`. Las decisiones, con la alternativa descartada de cada una, están en
> `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V18-V19.md` (apartado V18).
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`.

- **Carpeta:** `cvss-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo
  **4.3** (lo confirma la cabecera de la lección, `sp/sp4-part3.ts:5`) · adversario **SILENT PAGER** (sección sp4,
  `sp/sections.ts:101-106`), dos mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: la de siempre,
  `"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }` (V1, V5, V5b y V6) · música
  `Go On Going - Stayloose.mp3` · `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con
  `intercept.holdMs` 3800.
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "secplus"`, `"adversary": "SILENT PAGER"`, `"lesson": "sp4m5"` y
  `"tags"`: CVSS, CVE, priorización de vulnerabilidades, vulnerability management, gestión de vulnerabilidades,
  compensating controls, exception, rescan, false positive, Security+. Título de YouTube: «Triaje de vulnerabilidades:
  por qué el 9,8 no siempre va primero | CompTIA Security+ en español».
- **Efectos (`sfx`):** los automáticos del motor (mensaje, tarjetas, capítulos) y cuatro momentos: `tie` («ding», las dos
  filas empatan), `no-patch` («block», «parchear» se tacha), `record` («lock», el registro de la excepción con su
  caducidad) y `closed` («check», el sello «cerrado · con prueba»).
- **Léxico nuevo** (lo confirma Lidia al grabar): `CVSS` («ce ve ese ese»), `CVE` («ce ve e»), `exploit`, `rescan`,
  `false positive`. Los números de CVE, los nombres de equipo y las versiones no se dicen nunca: van en pantalla.
- **Lo que se lee no se deletrea:** la voz dice «el primer servidor», «el segundo», «el grabador de las cámaras», «el
  servicio de mensajería», «el nombre del fallo» y «la nota». Van solo en pantalla los CVE, los equipos, los vectores
  CVSS, las versiones (`3.1.4`, `3.1.7`) y el banner. Ninguna excepción. «Nueve coma ocho» y «ocho coma uno»
  sí se dicen: son la nota, no un identificador.
- **Duración:** suma de `s` **210 s** (6 escenas; `wordBudget` a 2,7 palabras/s: 54, 113, 113, 119, 108 y 59, unas 566).
  Es la estructura de V12 (dos mensajes y una pregunta), que con 210 s estimó unos 260 s y renderizó unos 235–245 s
  (≈ 4:00): dentro de 190–260. Los extremos conocidos (0,89 y 1,22 veces la suma) dan 187–256 s. La suma predice mal el
  renderizado, así que el primer borrador se mide por los dos lados: si el estimado pasa de 255 s, se recorta en este
  orden: primero, en s05, la frase que descarta el reinicio (se queda en la consola); después, en s04, la del seguro (queda
  tachada en pantalla, pero el mensaje ya la nombra). Si se acerca a 190 s, se alarga s03, que lee las cuatro preguntas
  una a una. No se rellena.
- **Inserción:** en `sp/sp4-part3.ts`, lección sp4m5, entre el callout de ejemplo «En la Autoridad Portuaria de Halden»
  (`:163-168`) y el párrafo de cierre «Con esto cierras el ciclo…» (`:169-172`), que salta a sp4m6, como bloque
  `{ t: 'video', title: 'Triaje de vulnerabilidades: el contexto manda sobre el número', youtube: '<id>', poster: 'videos/cvss-halden-poster.png', transcript: 'videos/cvss-halden-transcript.txt' }`,
  precedido de una línea: «Antes de cerrar el ciclo, hazlo con un informe nuevo: qué va primero, qué se hace con lo que
  no tiene parche y cuándo un hallazgo está cerrado de verdad». Todo lo que enseña el vídeo va antes en la lección: la
  nota CVSS frente al contexto (`:44-48`, el informe de `:53-80` y el check de `:85-96`), las respuestas (`:97-137`, la
  nota de examen `:141-142` y el check de `:145-158`) y la validación (`:160-161`). Se fija en la suite `lesson videos` de
  `src/data/content.test.ts` (`:267-296`) con su línea `toBe('sp4m5')`.
- **Enfoque («tres filas rojas, un solo parche»):** jueves 1-10, informe del escaneo mensual de esa noche (el que corre cada
  día 1, `credentialed`, como el de la lección). La cola trae tres filas rojas y esta semana cabe un solo parche. Dos son
  el mismo fallo en dos servidores, con la misma nota, y la tercera es de un equipo que no tiene parche. El vídeo hace el
  triaje entero en el orden en que se trabaja: pone el contexto al lado de la nota y decide, aísla y apunta una excepción
  con dueño y fecha, y comprueba el lunes siguiente que lo parcheado está cerrado de verdad. SILENT PAGER propone un atajo
  en cada uno de los dos primeros pasos. **No cuenta el escaneo de septiembre de la lección** (ni el portal, ni sus cifras):
  es un informe nuevo, con otros equipos, y la lección sigue siendo la del 1-9. No hace falta frase de puente: el vídeo no
  continúa ningún otro. En el orden del curso, V18 es el **segundo** vídeo de SILENT PAGER, tras V21 (sp4m2), y el primero de
  vulnerabilidades; se presenta desde cero, sin «otra vez».

**Conceptos (3) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | La nota CVSS mide severidad, no riesgo. El CVE es el nombre público del fallo; el CVSS, su nota de gravedad de 0 a 10, calculada sin saber nada de tu red (la nota base). Dos servidores con el mismo CVE y la misma nota pueden no tener la misma prisa: la prioridad la ponen la exposición (¿se llega?), el exploit, lo que hay delante y lo que se para si cae (`sp/sp4-part3.ts:44-48`, `:78-80`, nota `:141`, q3 `:206-219`, q4 `:221-234`) | El casco de un barco. El agujero es la nota: cuánto daño haría en abstracto. El mar es el contexto: el mismo agujero, del mismo tamaño, en un barco en dique seco puede esperar a la próxima reparación programada, y en alta mar, con temporal, no. El casco vuelve en los conceptos 2 y 3 | «CVSS mide severidad; el riesgo lo pone el contexto» · «Prioridad: exposición, exploit, controles e impacto» |
| 2 | «No se puede parchear» no es «no se hace nada». Se reduce la exposición (segmentation) y se compensa (compensating controls y vigilancia), y el riesgo que queda lo acepta alguien del negocio con una exception con dueño, justificación, controles, fecha de caducidad y revisión. Un seguro transfiere impacto financiero; no hace menos explotable el fallo (`:99-100`, tabla `:102-137`, nota `:142`, check `:145-158`, q5, q6, q8) | El mismo casco, que no se puede soldar porque el astillero ya no existe: mamparos (aislar) y bombas de achique (controles y vigilancia) mientras dure; el seguro paga parte de la reparación del barco, pero el agujero sigue ahí; y el acta del armador, firmada y con fecha de revisión (el armador es quien manda en el negocio, no el mecánico que lo encontró) | «Sin parche: aislar, compensar y excepción con caducidad» |
| 3 | Un hallazgo se cierra cuando se revalida (rescan, verification o audit), no cuando alguien dice que lo arregló. Si tras el parche sigue saliendo, antes de discutir se comprueba qué versión corre de verdad: puede faltar un reinicio o el escáner puede estar leyendo un dato viejo (`:160-161`). Hoy es lo segundo, y lo que se documenta es un false positive (q1 `:176-189`, q7 `:266-279`) | El taller dice «soldado»; tú botas el barco y miras la sentina, no el parte. Hoy el escáner leía el letrero del casco, no el casco | «Se cierra al revalidar: rescan, verification o audit» |

**Escenas:** seis, en tres capítulos (El número y el contexto · Sin parche y sin prueba · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Una cola, un solo parche» | I El número y el contexto | 20 | La cola del SOC, «01-10 · jueves · 09:00 · informe de escaneo mensual · credentialed», con tres filas rojas a media luz, cada una con su equipo y su nota: `srv-msg01` 9.8, `srv-msg02` 9.8 y `cam-nvr-02` 8.1, y un contador «esta semana cabe: 1 parche». La primera frase habla del informe entero («El informe del mes trae tres filas rojas, y esta semana solo cabe un parche»); al acabarla, título «Qué se arregla primero» (hacia los 7 s, siempre antes de los 12) y la promesa en tres chips: «el número y el contexto · lo que no tiene parche · cerrar con prueba». Después las tres filas se encienden juntas y el resto se atenúa | La promesa en los primeros 10 s: tres filas, un parche; al acabar, saber qué va primero, qué hacer cuando no hay parche y cuándo está cerrado · `report, rows, title, promise` |
| s02-contexto «El mismo fallo, dos servidores» | I | 42 | Se amplían las dos primeras filas: `srv-msg01` y `srv-msg02`, las dos «CVE-2026-40218 · ejecución remota de código en el servicio de mensajería · CVSS v3.1 9.8 CRITICAL · AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H». Dónde mirar, por pasos y con el resto atenuado: la columna CVE (la misma en las dos: «el nombre del fallo»), la nota (la misma: «gravedad en abstracto · de 0 a 10 · nota base») y, por último, lo que la nota no sabe y la ficha de cada equipo sí: «escucha en: la red interna» (`srv-msg01`) y «escucha en: solo este equipo» (`srv-msg02`). La imagen: dos barcos con el mismo agujero rotulado «9.8», uno en dique seco (`srv-msg02`) y otro en alta mar con temporal (`srv-msg01`). Nombres CVE y CVSS. La tarjeta, con las dos fichas ya quietas | El CVE nombra el fallo; el CVSS lo puntúa en abstracto; el mismo fallo no pesa lo mismo en dos servidores · `rows, cve, score, listens, hull, names` |
| s03-orden «¿Y ahora, cuál?» | I | 42 | Las dos filas empatadas, «9.8 · 9.8», con el chip «esta semana cabe: 1». La narradora presenta a SILENT PAGER con el anuncio del jefe de sp4 («cuenta con que tu SOC duerma», `sp/sections.ts:104`) y llega el mensaje interceptado. Respuesta: una moneda no mira nada de esto; cuatro preguntas, una por vez y aplicadas a las dos filas. «¿Se llega?» (`srv-msg01`: «sí · desde cualquier puesto de la red interna»; `srv-msg02`: «solo desde el propio equipo»); «¿Hay exploit?» (las dos: «público desde hace 9 días», porque es del fallo y no del servidor); «¿Hay algo delante?» (las dos: «nada»); «¿Qué se para si cae?» (las dos: «el intercambio de mensajes entre las aplicaciones del puerto»). Tres respuestas iguales y una distinta: decide la que distingue. Resultado en la fila de `srv-msg01`: «P1 · parche hoy · ventana de emergencia (24 h)», y en la de `srv-msg02`, «P3 · ciclo mensual». Nota: «Sistemas · parche en `srv-msg01` · hoy · 18:00». El barco de alta mar sube a primera fila | La nota empata; el contexto desempata. Se decide por exposición, exploit, controles e impacto, no tirando una moneda · `tie, coin, reach, exploit, front, impact, p1, p3` · **intercept** |
| s04-sinparche «Lo que no tiene parche» | II Sin parche y sin prueba | 44 | La tercera fila, ampliada: `cam-nvr-02` · «grabador de las cámaras del recinto» · «CVE-2026-38105 · CVSS v3.1 8.1 (AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H) · firmware sin soporte · el fabricante no publica parche». Cuatro opciones en fila que se tachan o se encienden una a una: «parchear» (tachada: no existe parche, `no-patch`), «seguro · insurance» (tachada tras el mensaje), «aislar · segmentation y compensar · compensating controls» y «excepción». Mensaje interceptado. Respuesta: junto al sello «seguro · insurance · transfiere el coste · el fallo sigue igual de explotable». Después, mamparos y bombas de achique sobre el casco (aislar y vigilar), y el registro de la excepción rellenándose campo a campo: «Qué: grabador de las cámaras · firmware sin soporte» · «Por qué: el fabricante no publica parche» · «Dueño: director de operaciones» (con la nota pequeña «quien manda en el negocio, no quien lo encontró») · «Controles: aislado · acceso solo desde un equipo autorizado · alertas reforzadas» · «Caduca: 01-04-2027» · «Revisión: cada 90 días» (`record`). La tarjeta, con el registro quieto | Sin parche se aísla y se compensa, y lo que queda lo firma el negocio con caducidad; un seguro no cierra el fallo · `unpatchable, options, no-patch, insurance, isolate, record, owner, expiry` · **intercept** |
| s05-despues «Después del parche» | II | 40 | «Lunes 5-10 · 08:30 · rescan». La fila de `srv-msg01` sigue en la lista: «CVE-2026-40218 · detectada de nuevo», y al lado «Sistemas · parche instalado el 1-10 · 18:00». Pregunta para pensar, con la fila quieta (el método y la versión detectada todavía no se ven) y dos botones: «volver a parchear» y «comprobar la versión». Respuesta: comprobar. Con ella aparece el método de la fila, «comprobación remota del servicio, sin sesión · versión que anuncia: `msgq/3.1.4`», con la frase de la voz «aunque el escaneo lleve credenciales, esta comprobación lee lo que el servicio anuncia por la red», y la consola de `srv-msg01`: `msgq --version` da `3.1.7`; paquete instalado `3.1.7`; servicio activo «desde 01-10 18:12» (descarta que falte un reinicio); y el banner que el servicio anuncia, `msgq/3.1.4`, ampliado: «texto de la configuración · nadie lo cambió». Rótulo: «el escáner leía el letrero, no el servicio». Veredicto: FALSE POSITIVE, «documentado», y «Sistemas corrige el texto · 5-10». Nuevo rescan: limpio, y el sello «cerrado · con prueba» (`closed`). La tarjeta, con el sello ya quieto | Un hallazgo se cierra con una comprobación, no con un parte; antes de dar por malo el parche se mira qué corre de verdad; si no existe, se documenta como false positive · `rescan, still, question, version, running, banner, false-positive, fix, closed` · **think** |
| s06-recap «Tres reglas» | III Para el examen | 22 | Tres tarjetas de reglas, cada una con su viñeta en miniatura (el casco con el agujero y el mar · el casco con mamparos y el acta · la sentina); tarjeta final Alertópolis: «Ahora te toca: el laboratorio de triaje» (Vulnerability Triage, spl4c); la voz dice «en el laboratorio lo aplicas con otros ocho hallazgos» | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 4.3), una por escena de s02 a s05, ninguna en la última y cada una con su cue antes de
  la última frase de la escena (`examTiming: sentence-end`):
  - «CVSS mide severidad; el riesgo lo pone el contexto» (s02) (50)
  - «Prioridad: exposición, exploit, controles e impacto» (s03) (51)
  - «Sin parche: aislar, compensar y excepción con caducidad» (s04) (55)
  - «Se cierra al revalidar: rescan, verification o audit» (s05) (52)
- **Pregunta para pensar:** «Parcheado y sigue saliendo. ¿Qué haces primero?» (s05) (47), `holdMs` 4500, con la fila de
  `srv-msg01` quieta y sin ningún rótulo que la conteste. Respuesta: comprobar la versión que corre. Sin ese paso no se
  sabe si falta un reinicio, si el escáner lee un dato viejo o si el parche no se aplicó; volver a parchear sin mirar
  repite el trabajo y no demuestra nada. Aquí la comprobación enseña lo segundo. **No es la pregunta de la lección**
  (`:85`, 9.8 frente a 7.5) ni la q7 (`:266-279`, «¿qué haces antes de cerrar por correo?»): trabaja la mitad que esas
  dos no cubren, qué hacer cuando el rescan contradice al parche. El título de la escena («Después del parche») no da la
  respuesta.
- **Mensajes interceptados** (SILENT PAGER, `holdMs` 3800, uno por capítulo en I y II; ninguno en el cierre):
  - s03: «Mismo 9.8, misma prisa. Que decida una moneda.» (46). El error concreto que corrige la narradora: que dos
    hallazgos con la misma nota tengan la misma prioridad. Una moneda no mira si se llega, si hay exploit, si hay algo
    delante ni qué se para; con esas cuatro preguntas, el que se alcanza va primero (nota `:141`, q3). Con la ironía en el
    marco: la que propone dejarlo al azar es justo quien, según el anuncio del jefe de sp4, «cuenta con que tu SOC duerma» (`sp/sections.ts:104`); no hay otra cita de ella.
  - s04: «¿Sin parche? Contrata un seguro y a otra cosa.» (46). El error: tomar el seguro por una respuesta a la
    vulnerabilidad. Cubre parte del coste de un incidente; el fallo sigue igual de explotable, y «a otra cosa» es justo lo que
    no es una excepción: la excepción lleva dueño, controles y fecha, y se vuelve a mirar (q8 `:281-294`, nota `:142`).
    Sin coletilla: ni «De nada.» (V5 s08, `video/ir-halden/narration.json`) ni «Duerme tranquila» (V5b) ni «Qué elegante.» (V21), para que la
    suya no se vuelva firma sin haberlo decidido.

  Los dos mantienen su voz de V1, V5, V5b y V6 (tutea, frases cortas, ironía, atajos que le convienen; ninguno de sus diez mensajes llama «analista» a la jugadora, que es el tic de HOLLOW LANTERN en GCTI) y no
  contradicen sus diez mensajes publicados (registro §4). Ninguno marca el género de quien habla: la voz de Pablo la hace «ella» como en
  los demás, y la narradora dice «la atacante» si la nombra (registro §5, notas de V5b y V6).
- **Cierre:** tres reglas y una sola tarea.
  1. La nota CVSS dice lo grave que es el fallo; el contexto, lo urgente que es en tu servidor. Dos hallazgos con la misma
     nota no tienen por qué ir juntos.
  2. Sin parche no se hace nada «a lo bruto»: se aísla, se compensa y el negocio firma una excepción con dueño y caducidad.
     Un seguro no cierra el fallo.
  3. Hasta que no lo compruebas, no está cerrado: rescan o verificación, no un correo. Si sigue saliendo, primero mira qué
     corre de verdad.

  Tarea: el laboratorio Vulnerability Triage (spl4c), que practica justo esta decisión con otros ocho hallazgos
  (`sp/labs-sp4.ts:35-45`). Las preguntas de la lección (8) tocan el vídeo casi todas (q1, q3, q4, q5, q6, q7 y q8), pero
  el laboratorio es la práctica que falta.
- **Se queda fuera** (sigue en la lección):
  - El false negative y por qué es el error peligroso: `:27`, check `:29-43`, q2. El false positive sí sale, en la práctica
    de s05; lo que no sale es su asimetría con el negativo.
  - La classification de la vulnerabilidad, el exposure factor y la risk tolerance como conceptos con nombre: `:47`. En
    pantalla salen las preguntas que los resumen, no sus nombres.
  - La tabla completa de respuestas (`:102-137`), el SLA de la política y la audit como forma de validación (solo en la
    tarjeta de s05).
  - El reporting al owner técnico y a la dirección, y el mean time to remediate: `:161`.
  - El ejemplo de septiembre con sus cifras (`:163-168`) y el informe del 1-9 con los hallazgos #0147 y #0203
    (`:53-80`): ni se citan ni se comparan.
- **Laboratorios:** el único relacionado es spl4c (`sp/labs-sp4.ts:35-45`, datos `:175-229`), de tipo `select`: ocho
  hallazgos, cuatro huecos. Al ya ejercitar la misma decisión (penalización L del ranking), el vídeo aporta el porqué
  (la nota frente al contexto, con el mismo CVE en dos equipos) y dos demos que el laboratorio no tiene: el registro de
  la excepción rellenándose y la comprobación de la versión tras un rescan que contradice al parche. Tres precauciones:
  - **Ninguno de los tres hallazgos del vídeo es una de las ocho opciones**: el portal de reservas con RCE, el
    concentrador de VPN con el bypass de autenticación, el controlador de dominio con escalada local, el servidor FTP con
    credenciales por defecto, la VM de laboratorio 9.8, el servidor de credenciales con control compensatorio, el TLS 1.0
    informativo y el servidor de nóminas con un falso positivo. Un servicio de mensajería (dos veces) y un grabador de
    cámaras no están.
  - **No se monta un juego de elegir cuatro de ocho.** Hay tres filas y un solo hueco; la decisión se enseña, no se
    juega.
  - **El falso positivo de s05 no es el del laboratorio** (el servidor de nóminas, ya investigado y confirmado): aquí se
    llega a él comprobando la versión, y es del propio hallazgo que se cerraba. Nada de nóminas ni de «ya investigado».

**Canon nuevo que fija V18** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **Jueves 2026-10-01, 09:00: informe del escaneo mensual** (`credentialed`, el que corre cada día 1). Queda el día antes
  de la mesa de V5b (viernes 2-10, 09:30) y no toca nada del registro. Tres filas rojas, esta semana cabe un parche:
  - `srv-msg01` y `srv-msg02` (servicio de mensajería entre aplicaciones, nombres nuevos): `CVE-2026-40218`, ejecución
    remota de código, CVSS v3.1 9.8 (`AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`), exploit público desde hace 9 días. En
    `srv-msg01` el servicio escucha en la red interna; en `srv-msg02`, solo en el propio equipo. Las dos con el mismo
    impacto, «el intercambio de mensajes entre las aplicaciones del puerto». Los CVE son inventados.
  - `cam-nvr-02` (grabador de las cámaras del recinto, nombre nuevo): `CVE-2026-38105`, CVSS v3.1 8.1
    (`AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H`), firmware sin soporte, sin parche del fabricante. Sin proveedor con nombre.
- **Decisión de triaje (1-10):** `srv-msg01` es P1 (parche en la ventana de emergencia de 24 h) y Sistemas lo instala a las
  18:00; `srv-msg02` es P3 (ciclo mensual, sin fecha).
- **La excepción del grabador (1-10):** dueño, el director de operaciones (un cargo sin nombre, el de la lección,
  `sp/sp4-part3.ts:167`); controles, aislado, acceso solo desde un equipo autorizado y alertas reforzadas; caduca el
  1-04-2027 (jueves) y se revisa cada 90 días, como la exclusión EXC-01 del SIEM (`video/siem/src/data/s07-tuning.ts:53-58`).
  No se contrata ningún seguro: el seguro solo aparece tachado.
- **Lunes 2026-10-05, 08:30: el rescan** da `srv-msg01` otra vez, por el banner `msgq/3.1.4`. Verificación en
  el equipo: versión `3.1.7`, paquete `3.1.7`, servicio activo desde el 1-10 a las 18:12. El banner es un texto de la
  configuración que nadie había actualizado, y esa fila sale de una comprobación remota del servicio, sin sesión, aunque el escaneo
  sea `credentialed`: **false positive documentado**. Sistemas corrige el texto el 5-10 y el rescan
  lo da por cerrado. No es culpa de nadie.
- **SILENT PAGER**, con su registro de V1–V6: «Mismo 9.8, misma prisa. Que decida una moneda.» y «¿Sin parche?
  Contrata un seguro y a otra cosa.», sin fecha.
- **Comprobado contra la cronología (Node):** 1-10 jueves, 2-10 viernes, 5-10 lunes y 1-04-2027 jueves. Nada choca con la
  mesa del 2-10 (V5b), la copia de contactos del 5-10 (otra área, otro asunto) ni los plazos de V5 (18-09 a 31-10): el
  vídeo no usa ninguno de esos días para nada de ellos.

**No se toca:**
- **El portal y todo lo suyo:** `hpa-portal-web-01`, el FINDING #0147, `CVE-2026-31887`, el informe del 1-9 y el callout de
  septiembre de la lección (640, 180, 22, 6 y 3 hallazgos; el rescan de 5 de 6). El número 0147 no sale (el caso
  `IR-2026-0147` es otra cosa: registro §5, «Mismo número, otra cosa»). La lección se contradice a sí misma sobre el WAF
  del portal (`sp/sp4-part3.ts:57` «sin WAF delante» y `:65` «regla de virtual patching en el WAF»), y V10 («Filtro,
  ninguno») y V16 dan por hecho que no había nada delante: el vídeo no entra. El laboratorio de la lección (`lab-sandbox-07`,
  `CVE-2026-30114`) tampoco.
- **El caso `IR-2026-0147`** y todo lo suyo (`svc_tosreport`, `ADM-WS-*`, `srv-tc-app03`, los 38 GB). Nada relaciona los
  tres hallazgos con él.
- **El dosier de SILENT PAGER** (`sp/sections.ts:106`): ni el ASN ni «GH es una sola operación» ni los logs sin
  centralizar. Solo da consejos, no ataca nada, y no tiene IP, dominio ni equipo.
- **La OT y los proveedores:** ni PLC, esclusas ni grúas (V16 no dibuja la OT y el dosier de BLIND ARCHITECT los
  protege), ni imágenes médicas (q5), ni la megafonía de sp5, ni ningún contratista, técnico de mantenimiento o
  proveedor con nombre. El fabricante del grabador es «el fabricante».
- **El proveedor de identidad, la VPN y la MFA del 30-11**, el plan de zonas de V16 y V17: ningún hallazgo los toca. El
  aislamiento del grabador se dice «aislado», sin VLAN, zona ni equipo de salto.
- **El ruido del SIEM:** el escáner del informe es «el escaneo mensual», sin nombre de equipo. `vulnscan01`, la regla R-087 y
  la exclusión EXC-02 (`video/siem/src/data/s06-fatigue.ts:24`, `s07-tuning.ts:53-69`) son otra cosa.
- **Las mejoras de V5** («excepciones que caducan · Sistemas · 18-09», `video/ir-halden/src/data/s09-plan.ts:26-31`): la
  excepción del vídeo caduca, pero el vídeo no cita ni da por hecha esa mejora.
- Ninguna IP ni dominio en pantalla. No se culpa a nadie: ni a Sistemas por el texto del banner ni al fabricante.

**Comprobación de límites** (perfil `capsula-yt`; recuento con Node, `[...texto].length`):
- 6 escenas en 3 capítulos (máximo 3). Suma de `s`: 210 s; renderizado previsto 235–245 s (extremos 187–256), dentro de
  190–260.
- 3 conceptos (2–3), cada uno con como mucho dos tarjetas.
- 4 tarjetas de examen (3–5), una por escena de s02 a s05, ninguna en s06; de 50, 51, 55 y 52 caracteres (máximo 58), sin
  `{}[]|<>`, flechas, marcas, viñetas ni emoji.
- 1 pregunta para pensar (exactamente 1), 47 caracteres (máximo 48), `holdMs` 4500.
- 2 mensajes interceptados (1–2), uno por capítulo (I y II), ninguno en la escena final; de 46 y 46 caracteres (máximo
  70); `holdMs` 3800 (2500–4500); `video.json` lleva `"adversary": "SILENT PAGER"`.
- `wordBudget` por escena (`s` × 2,7): s01 54 · s02 113 · s03 113 · s04 119 · s05 108 · s06 59 (total 566).
- Título antes de los 12 s: la primera frase de s01 tiene 15 palabras («El informe del mes trae tres filas rojas, y esta
  semana solo cabe un parche»), unos 6 s a 2,7 palabras/s; con una frase de situar delante («Jueves, nueve de la mañana»)
  el título entra hacia los 8 s. Si cae después de los 12 s, se quita la frase de situar.
- Sin identificadores en la voz: CVE, equipos, versiones y banner solo en pantalla.

**Notas para el guion** (revisión de exactitud y canon del 2026-10-08, `revision-secplus.md`):
- **«Credentialed» frente al banner.** La lección enseña el falso positivo por banner como propio del escaneo sin credenciales
  (`sp/sp4-part3.ts:27`). El vídeo lo cuenta en un informe `credentialed` y por eso lo dice: la fila de s05 lleva «comprobación
  remota del servicio, sin sesión» y la voz, «aunque el escaneo lleve credenciales, esta comprobación lee lo que el servicio
  anuncia por la red». La contradicción ya está en la propia lección (`:53` rotula el informe del 1-9 como `credentialed` y `:167`
  atribuye sus 180 falsos positivos a «un escaneo sin credenciales»): va como cambio propuesto en las decisiones.
- **s01.** El gancho dice «tres filas rojas, un solo parche», pero la tercera no tiene parche: la capacidad de la semana compite
  solo entre las dos primeras. s04 lo aclara; si el revisor de naturalidad lo oye como engaño, la frase pasa a «tres filas
  rojas, y esta semana cabe un parche».
- **s04 (la escena más densa).** Si hay que recortar, el registro de la excepción: cuatro campos en voz (qué, dueño, controles,
  caducidad) y seis en pantalla; los mamparos y las bombas de achique no se tocan.
- **Capítulo II («Sin parche y sin prueba»).** Pasa la regla del título por poco, porque «sin prueba» empuja hacia «comprobar». Si
  suena a pista, «Lo que no se puede parchear».
- **Imagen del casco.** En la voz, ni «ancla» ni «a bordo»: son de V12.
- **Identificadores inventados.** `CVE-2026-40218` y `CVE-2026-38105` van rotulados «datos ficticios» y no se contrastan con CVE reales.
- **Términos de examen en pantalla.** «Segmentation», «compensating controls» e «insurance» salen escritos en inglés en los rótulos
  de s04; la voz dice «aislar», «compensar» y «seguro».
