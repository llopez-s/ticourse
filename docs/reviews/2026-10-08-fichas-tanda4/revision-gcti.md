# Revisión de exactitud y canon · V22 y V23 (GCTI, VELVET CICADA)

Revisión de solo lectura del 2026-10-08 sobre las fichas `ficha-V22.md` (s2m2) y `ficha-V23.md` (s4m5) y sobre
`decisiones-V22-V23.md`, todas en esta carpeta. Rutas relativas a la raíz del repo (worktree `video-fichas-tanda4`). Las
citas `ficha-V22.md:NN`, `ficha-V23.md:NN` y `decisiones-V22-V23.md:NN` remiten a los borradores tal como están hoy.

Gravedad, la de la tanda 3: **bloquea** (la ficha congelaría algo que enseña lo contrario de la lección o del examen, o
un dato de canon en contra), **arreglar** (corrección clara que se hace cambiando una frase de la ficha) y **nota**
(pulido o aviso para el guion).

## Veredictos

| Ficha | Veredicto | Por qué |
|---|---|---|
| **V22** · s2m2 | **bloquea** (un solo asunto, de arreglo corto; el diseño en sí está bien) | La imagen de la tienda usa el mismo gesto, «echar a quien ya está dentro», para Disrupt (concepto 1) y para el sinkhole del C2, que es Deny (concepto 3). Y la cámara es Discover (mira atrás) en un concepto y vigilancia en directo, Detect, en otro. Es justo el par que el vídeo quiere desenredar. |
| **V23** · s4m5 | **listo con arreglos** | Ningún dato de canon se pisa y no destripa el dosier de HALL OF MIRRORS ni los labs. Pero la regla 2 del cierre dice que lo caro «no se falsifica» (la lección dice «cara», y V9 dice que lo fuerte también se puede plantar), la banda de sponsor choca con el Lab 5B y la ficha niega algo que la lección sí dice (victimología como evidencia de sponsor). |

## Límites del validador, recontados con Node

Recuento con un script propio contra `video/engine/scripts/lib/narration.mjs:15-24,287-288,303-304,322-323,391-392,412` y
`profiles.mjs:58-71` (perfil `capsula-yt`). Todo coincide con lo que dicen las fichas:

- **V22.** Tarjetas 47, 52, 50 y 52 (máx. 58); pregunta 44 (máx. 48); mensajes 47 y 57 (máx. 70); suma de escenas
  18+38+46+34+58+24 = 218 s; `wordBudget` 49, 103, 124, 92, 157, 65 = 590. Una tarjeta por escena de s02 a s05, ninguna
  en s06; un mensaje por capítulo (s03 en el I, s05 en el II), ninguno en la última escena; el mensaje y la pregunta de
  s05 van en segmentos distintos (el validador no los admite juntos, `narration.mjs:327`).
- **V23.** Tarjetas 51, 42, 51 y 54; pregunta 39; mensajes 68 y 66; suma 20+52+38+48+36+24 = 218 s; `wordBudget` 54, 140,
  103, 130, 97, 65 = 589. Misma estructura de tarjetas y mensajes (s03 en el capítulo I, s04 en el II).
- Ninguna cadena de pantalla (tarjetas, pregunta, mensajes) lleva `FORBIDDEN_SYMBOLS` ni `{}[]|<>`. Los `≤` que
  encuentra un barrido de las fichas están en la prosa de «Comprobación de límites» (`ficha-V22.md:205`,
  `ficha-V23.md:203`), no en pantalla. Los sonidos pedidos existen (`alarm`, `block`, `error`, `lock`, `check`; `glitch`
  es un sonido automático del motor, `sfx.mjs:13`).
- Las frases de voz de muestra no pasan de 22 palabras. Llevan un «:» cada una (V22 s03 y s05, V23 s03); el validador
  solo avisa si pasan de uno por segmento o de un tercio de los segmentos, así que son muestras, no un problema.
- Duración: los 218 s son los de V7, V8 y V15 y el estimado de ~250 s deja poco margen hasta el techo de 260 s. El orden
  de recorte de cada ficha está bien pensado; no hay nada que corregir hasta tener guion.

---

## V22 · s2m2 · «Courses of Action: ¿cortas o miras?»

### Bloquea

1. **La imagen de la tienda se contradice y enseña sinkhole ≈ Disrupt** (`ficha-V22.md:74-78`, `:82`, `:84`, `:94`).
   - En el concepto 1, «la persiana que se echa antes de que entre alguien» es Deny y «echar a quien ya está dentro» es
     Disrupt (`ficha-V22.md:82`; la lección, `src/data/s2.ts:290`: «Matar la conexión C2 activa; aislar el host»).
   - En el concepto 3 y en s05, «echar al sospechoso a gritos» es la acción de cortar el C2 (`ficha-V22.md:84,94`), y el
     C2 se corta con el **sinkhole, que la lección y el Lab 2C clasifican como Deny** (`src/data/s2.ts:342`;
     `src/data/labs.ts:367-371`). Quien vea «echar a quien ya está dentro» dos veces, con dos nombres, sale con los
     dos verbos otra vez mezclados.
   - La cámara tiene el mismo problema: en el concepto 1 es Discover, la que «rebobina la cinta de ayer»
     (`ficha-V22.md:76`); en el concepto 3 «seguirlo un rato en la cámara» es mirar en directo, o sea Detect
     (`ficha-V22.md:84,94`). Un objeto, dos tiempos.
   - **Arreglo.** Una función por objeto. Discover = «la cinta grabada de ayer» (el archivo); Detect = «la alarma y la
     cámara en directo». Basta con la regla «un gesto, un verbo»; la imagen concreta la elige quien escriba el guion. Una posibilidad: para el C2, ni la persiana ni «echar» (ya son Deny y Disrupt): el sospechoso habla por un walkie
     con su jefe, y el sinkhole es «que el walkie no conteste a nadie» (Deny: ninguna llamada futura llega a ninguna
     parte), frente a Detect más Degrade, «dejarle hablar con la línea ruidosa y escuchar». Disrupt queda para «sacar a
     alguien en plena faena» (aislar el host). Con eso el concepto 3 no reutiliza ningún gesto de los conceptos 1 y 2.

### Arreglar

2. **La tarjeta «Deny impide el inicio» y el sinkhole de s05 no cuadran sin una frase** (`ficha-V22.md:101,92,94`). La
   tarjeta es la nota de examen de la lección (`src/data/s2.ts:300`) y está bien. Pero s01 y s05 enseñan un C2 que ya
   llama a casa cada minuto y s05 pone el sinkhole bajo Deny: quien se fije preguntará por qué cortar algo que ya está en
   marcha no es Disrupt. La lección lo resuelve sin decirlo: el sinkhole hace que cada llamada futura no llegue
   («Impedir que la acción funcione», `src/data/s2.ts:289`), mientras que «matar la conexión activa» es Disrupt
   (`:290`) y el check 3 es «poner en cuarentena el host mientras su implante hace beacon» (`:379-388`).
   **Arreglo.** En s05, una frase en voz: «el sinkhole no mata la llamada de hoy, hace que las siguientes no lleguen a
   ninguna parte: eso es Deny». Y, si se prefiere que la tarjeta no admita la duda, «Deny: no llega a funcionar;
   Disrupt: lo cortas en curso» (55).
3. **La premisa de la pregunta deja fuera la condición de la lección** (`ficha-V22.md:104-108`). «Aún no sacan nada»
   solo dice que no han robado todavía. La lección deja correr la intrusión «mientras proteges los activos»
   (`src/data/s2.ts:309`), y s2m2q8 (`:475-489`) da por mala la observación solo cuando se están llevando lo crítico. Con
   la premisa tal cual, la respuesta «sigue mirando» se lee como regla («si no han sacado nada, mira»), y el lector que
   vio V3 sabe que dos días después (E9) van a por lo que vinieron a buscar (canon §2, línea E9, y
   `video/diamond-e7/narration.json:329`). La ficha ya pone las dos condiciones en la respuesta, pero en la voz de la
   pregunta solo va «supón que todavía no han sacado nada» (`:105-106`).
   **Arreglo.** Meter la segunda condición en la propia pregunta: «Nada robado y lo crítico a salvo: ¿cortas?» (42), o
   «Lo crítico está a salvo. ¿Cortas o sigues mirando?» (50, no cabe) y, en voz, «supón que lo importante está a salvo y
   que todavía no han sacado nada». La respuesta se queda como está («mirar, con Detect y Degrade; si empiezan a
   llevarse lo crítico, cortar ya»).
4. **El Lab 2C sí queda mostrado en gran parte, y la ficha dice que no** (`ficha-V22.md:145-148`; la propia ficha admite en
   `ficha-V22.md:9-11` que los ocho ítems son casi las filas de la tabla). Los ejemplos de s02 son los ítems 1 y 3 del
   laboratorio con su etiqueta: «buscar el hash del loader en 90 días de EDR» = Discover
   (`src/data/labs.ts:353`, `src/data/s2.ts:287`) y «regla Sigma para un LNK que lanza PowerShell» = Detect
   (`labs.ts:363`, `s2.ts:288`). El sinkhole de `update-svc-cdn.com` como Deny es el ítem 4 con otro verbo
   (`labs.ts:368`), el aislamiento del host como Disrupt es el 5 (`labs.ts:373`), y la matriz de s03 a s05 enseña,
   bajo su columna, las celdas de los ítems 6 y 7 (rate-limit de salida, planos señuelo; `s2.ts:347-348`;
   `labs.ts:378,383`). Solo se escapan el ítem 2 y el 8. Es la lección, que va antes, así que no es destripar nada nuevo,
   pero «el vídeo nunca clasifica ninguna de sus ocho medidas ni enseña la etiqueta de ninguna con su respuesta» es falso
   y no debe quedar escrito en la ficha ni en `script-notes.md`.
   **Arreglo.** (a) Reescribir la afirmación: «el vídeo enseña la matriz de la lección, que ya contiene seis de los ocho
   ítems; no añade ninguno ni los practica». (b) Para quitar peso a los ejemplos, que s02 use solo la imagen
   (cinta y alarma), sin las dos líneas de ejemplo, y que el ejemplo de Detect del resto del vídeo sea una celda que no es
   ítem (`schtasks /create` fuera del inventario, `s2.ts:337`). Es también el primer recorte del plan de duración
   (`ficha-V22.md:41-43`), así que sale gratis.
5. **s05: dejar explícito que «la celda Deny» es la del C2** (`ficha-V22.md:94`). La frase se lee bien si «la celda Deny»
   es la del sinkhole, que acaba de presentarse en la fila de C2 (`src/data/s2.ts:342`); la alarma va sobre Actions on
   Objectives porque ahí se vería salir lo crítico (s2m2q8, `s2.ts:475-489`), y esa fila no tiene Deny (`:345-348`). No es
   un error de la ficha: solo conviene que el guion y la pantalla mantengan la fila de C2 ampliada cuando la elegida vuelve
   a Deny, para que nadie busque un Deny en Actions on Objectives. Se baja a nota.
6. **El cierre del concepto 2 afirma de más** (`ficha-V22.md:83` «aguanta»; `:93` «si una falla, quedan las otras»). La
   lección dice «sobrevive al fallo de una» (`src/data/s2.ts:352`). En Delivery, si falla el Deny, las dos que quedan
   son Detect y Deceive: avisan y atrapan, pero el correo ha entrado. **Arreglo.** En voz y rótulo: «si una falla, otra
   avisa o atrapa» en vez de «quedan las otras» u «oposición».
7. **El cambio de lección 3 queda corto** (`decisiones-V22-V23.md:221` frente a `:93`). El texto con «hilo» no solo está en
   `src/data/s2.ts:342`, también en `:314` («pierdes el hilo»). Si se aplica el cambio, se hace en las dos. Lo demás de
   las propuestas 1 a 3 es correcto y es solo texto (ver «Cambios de lección»).

### Nota

8. **Eco con V13** (`video/kill-chain-eslabon/narration.json:393`, s08-05, y `:465`, s10-04). V13 cierra con «cuanto más a
   la izquierda cortes, más pasos le quitas» y dice que cortar el beacon «también sirve, pero para entonces ya ha
   avanzado más». V22 le dice a la misma analista «mira un tiempo». No se contradicen (V22 habla de un C2 que ya está
   instalado y V13 de en qué paso cortar), pero una frase de puente en s05 lo evita: «ya no estás a tiempo de impedir los
   pasos de antes; lo que decides es qué haces con el que queda».
9. **Mensajes de GLASS VIPER** (`ficha-V22.md:112-120`). Cumplen: dos frases, tutea, sin «analista», no repiten el error
   de V7. Tres avisos de voz: (a) «Tú ponme alarmas» vuelve a la fórmula «Tú + imperativo» de V13 («Tú vigila tus
   planos», `video/kill-chain-eslabon/narration.json:318`; «Tú tienes que acertar siempre», `:96`); (b) «Córtame ya»
   es un cebo para que bloquees, igual que «Bloquea mi hash» (`video/attack-piramide/narration.json:128`) y que el
   «Bloquea esos dos» de V15: con V22 serían tres vídeos en los que el adversario pide que bloquees; (c) un adversario
   real no quiere que lo corten, así que la respuesta debería decir que es un cebo («te lo pide para que gastes la
   visibilidad»). El primer mensaje es cierto en parte («para pararme ya habrá tiempo» es la respuesta final cuando lo
   valioso está a salvo): la ficha lo recoge con «le da la razón en el dato y se la quita en la conclusión»; vale.
10. **Densidad de s05** (`ficha-V22.md:94`, 58 s). Lleva mensaje, ampliación de la fila, leyenda, tres celdas, viñeta,
    chip, pregunta con 4,5 s, respuesta, vuelta a Actions on Objectives, «decide el negocio» y tarjeta. Si el guion se
    pasa, la regla «decide el negocio» puede ir a la tercera regla del cierre (`ficha-V22.md:125-126`), donde ya está.
11. **Léxico** (`ficha-V22.md:33-35`). Se declara `Deceive`, pero la voz «solo nombra los verbos que usa» y la lista de
    cinco que da no lo incluye (`:57-58`). Una de las dos: o `Deceive` sale en voz en la fila de Delivery de s04 y la
    lista de cinco pasa a seis, o se quita del léxico.
12. **Definiciones frente al artículo de Lockheed Martin y FOR578: no puedo verificarlas aquí.** Lo que sí puedo decir
    de memoria, sin acceso al texto: (a) las seis acciones sin Discover son de la matriz del artículo original de
    2011; no recuerdo con seguridad que **Discover** sea de allí, ni cómo lo define FOR578; (b) la duda de las
    decisiones, «Degrade es contraatacar» (`decisiones-V22-V23.md:16-17,108-109`), no coincide con mi recuerdo: la matriz
    del artículo pone «queuing» y «tarpit» como ejemplos de Degrade, que es frenar, justo como la lección
    (`src/data/s2.ts:291`, s2m2q5); (c) el ejemplo del artículo para **Deceive** es un DNS redirect, así que un lector
    que venga del original pondría el sinkhole en Deceive, mientras que la lección y el Lab 2C lo ponen en Deny. El vídeo
    sigue la lección y el laboratorio, que es lo correcto para este curso; no hace falta advertirlo en voz.

### Lo que queda bien

- Los siete verbos se usan como la lección: Discover/Detect hacia atrás/adelante, Deny/Disrupt como en la nota de examen
  (`src/data/s2.ts:285-301`), Degrade como «frenar sin cortar» (q5) y Destroy fuera, con el límite legal (q3) en la lección.
- La matriz se recuenta bien: Delivery 3, Exploitation 2, Installation 2, C2 3, Actions on Objectives 3
  (`src/data/s2.ts:327-348`); Discover y Destroy no ocupan celda; la leyenda `[!]` es la de la lección.
- Los tres retoques de la matriz en pantalla (`hacia el C2`, sin «quema el hilo», buzón señuelo atenuado) no cambian
  ninguna acción ni columna.
- Sin fecha, sin «48 horas», sin E9 ni 7 de marzo: el razonamiento de las decisiones (el «+2 días» de E9 coincide con las
  48 h de la lección y el pDNS del C2 acaba el 7-3, canon §2) es correcto y evita el punto 7 de §5.
- `update-svc-cdn.com` y `cdn-sync-status.example` solo como texto de celdas, ya legibles (V3, V4, V13, la lección); ninguna
  IP, hash, persona ni hora nueva. «RR. HH.» solo en la celda atenuada y nunca junto a `ENG-WS-041` (§5, punto 5).
- No se toca el dosier de BROKEN CHAIN (`src/data/course-gcti.ts:40`), el Lab 2A ni el 3A (el «dominio que no está en la
  lista» de s04 es hipotético, `src/data/labs.ts:704-707`).
- Voz: Pablo con `machine` como V3, V7 y V13 (`video/kill-chain-eslabon/narration.json`, `adversaryVoice`); música y
  `recording` como V13. `sfx` con nombres existentes.
- Inserción: `src/data/s2.ts` entre el check 3 (`:379-388`) y `quiz:` (`:390`) existe; el bloque tiene la forma de V13
  (`s2.ts:117-122`). Poner el vídeo después de los checks es lo correcto (el check 1, `:355-367`, es la pregunta del
  sinkhole). `content.test.ts` pide solo que el id sea válido, que el póster y la transcripción existan y que haya una
  línea `moduleOf` (`src/data/content.test.ts:267-296`); no fija ningún texto de s2m2.

---

## V23 · s4m5 · «Atribución: ¿quién fue? Los tres niveles y las pistas falsas»

### Arreglar

1. **La regla 2 del cierre es ambigua al oído y puede leerse como que lo caro «no» se falsifica** (`ficha-V23.md:118-119`:
   «un idioma o una hora se falsifican en un minuto; años de objetivos y de rutina, no»). Leída como «no [en un minuto]»
   sería correcta; pero en un cierre no puede ser ambigua. La lección dice «cara de sostener» y «muy cara», con peso
   «medio-alto» y «alto (en agregado)» (`src/data/s4.ts:1079-1080`), no imposible. V9 enseña lo contrario de «no se puede
   plantar»: el certificado, la prueba más fuerte, «es justo el tipo de prueba que alguien podría plantar»
   (`video/ach-matriz/narration.json:342`, s08-03, y canon §7 V9). Es voz y es el cierre, lo que se lleva el espectador.
   **Arreglo.** «Un idioma o una hora se falsifican en un minuto; años de objetivos y de rutina cuestan mucho más» y, en
   la tarjeta final de regla, «caro no es imposible». La ficha ya lo dice bien en el concepto 2 («muy caro de falsificar
   (alto, en agregado)», `:81`): solo hay que alinear el cierre con eso.
2. **La banda de sponsor choca con el Lab 5B** (`ficha-V23.md:89` «confianza media, con lenguaje estimativo»;
   `src/data/labs.ts:1056-1076`: un juicio de sponsor «basado solo en victimología, horario y overlap de infraestructura»
   es «low confidence», y «High» y «No incluir el juicio» son las malas). La tabla de la lección sí dice «Media»
   (`src/data/s4.ts:993`), pero es la de quien tiene HUMINT/SIGINT; en el vídeo, justo debajo de «tu telemetría», un
   «media» sin más la aplica a Meridian. La ficha lo sabe (`decisiones-V22-V23.md:177-182`) y lo deja para el cambio de
   lección 5, que es opcional; pero el vídeo no debería depender de él.
   **Arreglo.** En la banda: «moderada, y solo con fuentes que tu red no tiene». Eso es verdad con y sin el cambio 5, no
   adelanta el «baja» del laboratorio y no lo contradice.
3. **«Media», «moderada» y «alta» mezclados, y el eje de probabilidad** (`ficha-V23.md:89` frente a `:90`). La banda
   dice «media» y la ficha del informe serio dice «moderada» en la misma pieza; ICD 203 usa low/moderate/high para la
   confianza, y la lección y el Lab 5B avisan de que «lenguaje estimativo» (almost certain, likely…) es otro eje
   (`src/data/labs.ts:1094`: «No confundas los dos ejes»). **Arreglo.** Una sola palabra para el nivel, «moderada» (como V9
   y como la ficha genérica), y que «lenguaje estimativo» no se rotule como si fuera un grado de confianza. Si se acepta el
   cambio 5, que conserve «lenguaje estimativo explícito» (la propuesta actual de `decisiones-V22-V23.md:223` lo quita).
4. **La ficha niega algo que la lección afirma** (`decisiones-V22-V23.md:187-188`: «La victimología sostenida no es una
   prueba de sponsor»). La tabla de la lección la lista como evidencia de sponsor (`src/data/s4.ts:993`: «victimología
   plurianual alineada a intereses») y s4m5q5 (`:1181-1194`) la llama evidencia de atribución «valiosa». Y la banda de
   sponsor de la ficha la omite (`ficha-V23.md:89`, `:80`). Lo cierto es «sola no basta» y «pide otro tipo de evidencia
   para llegar a quién dirige» (`:996-999`). **Arreglo.** Añadir «años de victimología alineada con intereses» a la banda
   de sponsor y cambiar la frase del riesgo a «no se vende como prueba de país por sí sola». En s04 la victimología sale
   como «medio-alto», no «alto»: la ficha agrupa las dos filas como «peso alto en agregado» (`ficha-V23.md:91`); solo el
   tradecraft multianual con errores de opsec es «alto (en agregado)» (`s4.ts:1079-1080`).
5. **El chip «tu caso» nombra el certificado junto a «alta»** (`ficha-V23.md:89`). El canon dice que E4 de V9 **no** se
   identifica con `CN=updatesvc` (canon §7 V9, última viñeta) y V9 deja el certificado como la prueba plantable. Poner «su
   certificado» como evidencia de nivel máquina con confianza alta, en un vídeo sobre pistas plantadas, no lo contradice
   (nivel máquina no es nivel grupo), pero acerca los dos. **Arreglo.** «tu caso: el programa y su servidor».
6. **El mensaje s03 es ambiguo al oído** (`ficha-V23.md:107`: «Los consejos adoran los nombres»). «Consejos» se lee como
   «avisos» antes que como «consejos de administración», y el canon habla de «el consejo» en singular (canon §3, tabla
   de personas). Opción dentro del límite: «Ponle un país al informe, analista. Todo consejo adora un nombre.» (65); o
   «...Al consejo le encantan los nombres.» (71, **se pasa**). Con cualquiera sigue siendo un atajo de método.
7. **s04 junta el mensaje de PAPER CRANE con el binario de ejemplo que repite el dosier** (`ficha-V23.md:91`). El dosier de
   HALL OF MIRRORS dice «plantaban strings en cirílico y horarios falsos» (`src/data/course-gcti.ts:78`); la escena abre
   con PAPER CRANE y pone sobre la mesa «textos en otro idioma» y «horas de una jornada de oficina concreta». Con el rótulo
   «Ejemplo de la lección · no es el caso de Meridian» y sin país no afirma nada del caso, y el texto de la lección ya dice
   lo mismo en general (`src/data/s4.ts:1070`), así que no lo considero un bloqueo; pero la sucesión «PAPER CRANE, luego
   idioma y horas» es lo que el boss revela como hecho. **Arreglo.** Que la voz no diga «PAPER CRANE las siembra» mientras
   las dos pistas están a la vista, y que el binario aparezca ya con el rótulo antes de que hable el mensaje (la respuesta
   «pues vamos a ver cuánto dice» es neutra y vale).
8. **La banda del operador deja fuera un desbloqueo de la lección** (`ficha-V23.md:80,89`; `decisiones-V22-V23.md:189-191`
   «la mano no es la pincelada»). La tabla pone «tradecraft idiosincrático sostenido» entre lo que desbloquea el nivel
   operador (`src/data/s4.ts:992`) y s4m5q8 lo incluye en la respuesta correcta (`:1231`). La ficha lo excluye para que la
   analogía no diga «el estilo no se copia», lo cual protege bien lo caro, pero el espectador de q8 se encuentra con una
   opción buena que el vídeo no ha enseñado. **Arreglo.** Añadir «hábitos de trabajo propios, sostenidos» a las dos
   frases de la banda («errores humanos: una cuenta personal, un alias reutilizado, hábitos propios años seguidos»), y
   mantener que lo copiable es la firma y la fecha y lo caro la procedencia.
9. **«Si se dice» en la nota de s05** (`ficha-V23.md:92`: «para quién trabajan: tu red no tiene esa clase de prueba; si se
   dice, con su confianza y diciendo qué falta»). El Lab 5B califica omitir el juicio como incorrecto
   (`src/data/labs.ts:1071-1074`) y la ficha ya lo sabe (`ficha-V23.md:159-161`). «Si se dice» suena a opcional.
   **Arreglo.** «para quién trabajan: tu red no tiene esa clase de prueba; el juicio se emite con su confianza y diciendo
   qué falta, no se calla», sin dar el nivel que pide el laboratorio.

### Nota

10. **«Detectar, cazar y proteger no cambian con el país»** (`ficha-V23.md:92`). La lección dice que el conocimiento de
    grupo es lo que mueve detección, caza y riesgo (`src/data/s4.ts:1110`) y que el país sirve sobre todo a gobiernos,
    seguros y decisiones geopolíticas (`:1008`); no que el país «no cambie» nada. Mejor «rara vez cambian».
11. **«Qué buscan: la propiedad intelectual de propulsión»** (`ficha-V23.md:92`). Aguanta: es lo que ya dice V3 («por su
    propiedad intelectual de propulsión: es lo que necesita el customer», `video/diamond-e7/narration.json:231`) y lo
    que describe la lección (`src/data/s4.ts:1008`). La ficha ya evita «moderada» de V9; vale. En la misma nota,
    «cómo trabajan: lo ves en tu red» es de nivel máquina y está bien.
12. **La pregunta casi se contesta sola** (`ficha-V23.md:101-104`). El espectador llega a ella tras s03 («sponsor pide
    fuentes que tu red no tiene»), tras la banda de la firma falsa y tras el mensaje, y es un sí o no. El plan pide «una
    decisión breve, mejor con dos opciones» (plan §1, «Claridad y ritmo», punto 2). Una elección real sería, p. ej., «Un
    país o un grupo: ¿qué escribes?» (34), con respuesta «el grupo, y con su confianza» (es el check 3 de la lección,
    `:1099-1112`, y ya no contesta a la escena anterior). Si no se cambia, queda aceptable; la ficha lo anticipa.
13. **Eco de V4 en la banda del operador** (`ficha-V23.md:89`). V4 dice en voz «aparece un correo de contacto. Puede que no
    sea un nombre real, pero es un pivote dedicado» (`video/pivot-infra/narration.json`, s07-04) y la lección ata ese
    correo al operator «si el pivote confirma» (`src/data/s2.ts:598`). «Una cuenta personal desde la infraestructura» lo
    evoca. La ficha lo contiene bien (la voz solo nombra el tipo de descuido y la nota dice «quién teclea: desconocido»,
    `:92`, `:175-178`); cualquier ejemplo más concreto que «un alias reutilizado» lo rompería.
14. **`customer` = sponsor** (`decisiones-V22-V23.md:173-176`). Confirmado: `src/data/s2.ts:556-557` define customer como
    «quien se beneficia/encarga» y remite a S4M5, y V3 dice «el customer lo encarga y se queda el botín»
    (`video/diamond-e7/narration.json:171`). El chip «Adversary = operator + customer» es correcto como puente; la lección
    no los iguala con las palabras «sponsor» y «operador», así que la voz dice «nivel operador» y «nivel sponsor» y usa
    operator/customer solo en el chip.
15. **Análisis de la analogía.** Los dos avisos de la ficha (`decisiones-V22-V23.md:189-194`) son los correctos; hay un
    tercero: «la cartela es una afirmación con su confianza» es verdad, pero en el mundo del arte una cartela se pone
    **después** de un juicio de expertos y se corrige; conviene decir «atribuido a» con el matiz («atribuido a», no
    «de»). Ya lo recoge la ficha en `:82`.

### Lo que queda bien

- Los tres niveles y su evidencia son los de la lección (`src/data/s4.ts:984,989-994,996-1003`; s4m5q1, q2, q8, q9);
  «sube un nivel, otro tipo de evidencia» está en la nota de examen (`:1117`); las cuatro tarjetas son la nota de examen
  recortada (`:1117`) y no enseñan nada distinto.
- Canon: sin fechas, sin IP, hashes, equipos ni personas nuevos; Adversary sigue en UNKNOWN como en V3
  (`video/diamond-e7/narration.json:133,139,159,353`); el CISO es el de V9 (`video/ach-matriz/src/data/s01-hook.ts`,
  `S01_CISO`); el binario de ejemplo no es `9f3a...e1`; no sale VELVET CICADA, GLASS VIPER, `kazuo.tanji@`, ni países,
  ni UTC+8.
- No se toca el dosier de HALL OF MIRRORS (con el aviso 7), ni el de DEEP WELL, ni el punto 9 de §5, ni E4 (con el aviso 5),
  ni Cluster-A y B (`src/data/s4.ts:729-744`), ni el STIX del campaign (`:1015-1047`), ni «entra por proveedores»
  (`:1008`).
- Los mensajes de PAPER CRANE siguen su registro (dos frases, ironía, «analista», sin confesar), y no repiten ni
  «Fíate de lo que ves», ni «Cuenta las que te dan la razón», ni «Si una prueba es falsa…» (canon §3).
- Lab 4A, 4B y 5B: no sale ninguna de las ocho frases del 4A (`src/data/labs.ts:461-498`), ni «UTC+8», ni las ocho pruebas
  del 4B, ni el juicio de Meridian del 5B. La excepción es el aviso 2.
- Quiz: el vídeo contesta sin destripar de forma nueva lo que ya está en los dos checks de la lección; q7 y el check del
  STIX (`src/data/s4.ts:1052-1066`) quedan fuera, y q10 solo en la idea. Eso es coherente con el recorte.
- Inserción: `src/data/s4.ts` entre el último check (`:1099-1112`) y el callout de la nota de examen (`:1113-1118`) existe; la
  forma del bloque es la de V9 (`s4.ts:504-509`).
- Todas las referencias `src/data/s4.ts:NNNN` de la ficha están ya con el +7 corregido (p. ej. `:1023`); el registro
  `docs/superpowers/canon/velvet-cicada.md` las trae todavía sin corregir (`:27`, `:36`, `:124`, `:166`…), como dicen las
  decisiones (`decisiones-V22-V23.md:211-213`). No es un hallazgo de V23.

---

## Cambios de lección propuestos (`decisiones-V22-V23.md:217-227`)

Ninguno toca ids, opciones ni respuestas, y ninguno lo fija `content.test.ts` (no hay `s2m2`, `s4m5`, «throttling»,
«quema», «proveedores» ni «sin firma» en ningún `*.test.ts`; la búsqueda dio vacío).

| # | Veredicto | Comentario |
|---|---|---|
| 1 (`s2.ts:343`, «hacia el C2») | Correcto | La IP es hosting compartido con ~14.000 dominios (`s2.ts:585,598`); limitar por IP perjudica a terceros. El sinkhole, por dominio, no tiene ese problema. |
| 2 (`s2.ts:352`, «con poca firma») | Correcto, pero queda corto | En la misma frase, «tú ves su operación completa» promete más de lo que el check 1 sostiene (`s2.ts:366`: «preserving the collection channel»). Cambiar «completa» por «mucha» o dejarlo. |
| 3 (`s2.ts:342`, «quema el hilo») | Correcto, incompleto | Incluir `s2.ts:314` («pierdes el hilo»); ver V22, punto 7. |
| 4 (`s4.ts:1008`, «ataca también a sus proveedores») | Correcto | El canon sí respalda a los proveedores (Orbital, la ola de abril, la cuenta VPN del Lab 2B; §5 punto 4), así que lo que choca no es «proveedores» sino «entra por», frente al correo de s2m1. La frase propuesta vale. |
| 5 (`s4.ts:993`, sponsor) | Correcto en fondo, pero pierde una palabra | Que conserve «lenguaje estimativo explícito»: «Media para quien dispone de esas fuentes, con lenguaje estimativo explícito; baja con solo telemetría». Y que el vídeo no dependa de él (V23, punto 2). |
| 6, 7, 8 | De acuerdo con «no tocar» | |
| 9 (`s4.ts:1045`, `confidence: 75`) | De acuerdo | En la escala None/Low/Med/High de STIX 2.1, 70 a 100 es High (de memoria; verificar con el apéndice de escalas de confianza de la especificación antes de tocar el JSON). La lección dice «confianza media» en `:1050`. |

## Lo que no he podido verificar

- Las definiciones de las acciones frente al artículo de Lockheed Martin (2011) y frente al material de FOR578: no tengo
  acceso a ninguno de los dos. Lo que va en V22, punto 12, es de memoria.
- La escala de confianza de STIX 2.1: la escala propuesta None/Low/Med/High (0, 1-29, 30-69, 70-100) es de memoria; no la
  he podido comprobar contra la especificación. No afecta a los vídeos (no enseñan el JSON).
- La redacción exacta de ICD 203 sobre niveles de confianza: uso «low/moderate/high» de memoria.
- Los guiones de V14 y V15 (`hilos-pelicula`, `sandbox-muestra`) no están en este árbol: solo he podido contrastar con sus
  fichas aprobadas en el plan. Sus mensajes publicados son los de la ficha, no los de un `narration.json`.
- Los sonidos de la biblioteca (`video/engine/sfx/`) no están en el árbol (se generan); he comprobado los nombres contra
  `sfx.mjs` y `sfx.test.mjs`, no que `cheap`, `dark`, `note`, `alarm`, `deny` y `visible` suenen como pide la ficha.
- Estimados de duración (`build-timeline --estimate`) y ritmos de grabación de Lidia (92 %, 93 %): no hay guion; solo he
  recalculado las sumas y los presupuestos de palabras.
