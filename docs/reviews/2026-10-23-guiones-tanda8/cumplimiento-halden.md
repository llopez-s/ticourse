# Revisión de guion · V43 `cumplimiento-halden` (sp5m6, perfil `caso-yt`)

Revisado el 2026-10-23, solo lectura. Fuentes: ficha `docs/superpowers/plans/fichas-tanda8/V43-sp5m6.md`; `video/cumplimiento-halden/` (`storyboard.json`, `narration.json`, `video.json`, `out/script-notes.md`, `out/canon-refs.md`); lección `src/data/secplus/sp5-part3.ts:263-507` (sp5m6) y flashcards `fcp520`, `fcp524`-`fcp526`; plan de objetivos `docs/superpowers/plans/2026-09-05-security-plus-domain5.md:103-117`; plan de vídeos §1 «Narración hablada»; `docs/superpowers/plans/fichas-tanda8/_revision.md`.

Límites de esta revisión, para que no se lean como más de lo que son:

- **Registro de canon.** `docs/superpowers/canon/glass-harbor.md` mide unos 720 KB (más de 140 000 tokens) y no cabe entero en una lectura. Leí su §1 (cómo se usa y tabla de vídeos) y busqué en todo el archivo los términos del guion: objetos perdidos, cuaderno, gato, peluquería, archivador, cajón, currículos, concursos, mensajería, due care, due diligence, sanctions, legal hold, retention, terminal de pasajeros, cafetería, libreta, reseñas, mostrador, inventario. No leí las notas por vídeo (§5) ni las cronologías línea a línea. Cotejé además las imágenes con todos los `narration.json` y `storyboard.json` de `video/*` y con las fichas de las tandas 8 y 9.
- **PDF oficial de SY0-701.** No hay ningún PDF en el repositorio y aquí no lo he abierto. Contrasté con el texto del objetivo 5.4 tal como lo recoge el plan del dominio 5 (compliance reporting interno/externo; consecuencias: fines, sanctions, reputational damage, loss of license, contractual impacts; monitoring: due diligence/care, attestation y acknowledgement; privacidad: data subject, controller y processor, ownership, data inventory y retention, right to be forgotten). La duda 1 de la ficha («comprobar contra el PDF») queda decidida con esa reserva; ver A-0.

---

## A. Exactitud y canon

### Resumen de la pasada

La estructura es sólida. Las definiciones de la voz coinciden con la lección (due diligence = investigar antes, due care = obrar de forma razonable y sostenida; las cinco consecuencias separadas por quién las impone; inventory, retention y right to be forgotten no absoluto). Las tres preguntas tienen una sola respuesta defendible entre sus opciones. No hay equipo, cuenta, hora, fecha ni persona. Las tres imágenes (gato, peluquería, archivador) no están ocupadas en el registro ni en ningún guion o ficha de las tandas 6 a 9: las únicas coincidencias de «gato» en `video/*` son falsos positivos («obligatorio»). El gato, la peluquería y el archivador solo se nombran en las fichas V43 y en las menciones de «no se toca» de V45 y V48.

Hay un fallo de fondo (A-1), que tiene que arreglarse antes de congelar.

### A-0. Decisión de las «dudas para el revisor» (`out/script-notes.md`, «Dudas de exactitud»)

| Duda | Decisión |
|---|---|
| 1. **Sanctions frente a fines** | **Se queda como está.** La lección (`sp5-part3.ts:291`, tabla `:303-306`), `fcp524` y el plan del dominio 5 las separan, y el 5.4 las lista por separado. La voz (`s04-02`) define las fines como multa y las sanctions como prohibición o límite, y la pregunta 2 cierra la otra lectura con «Sin multa». «Una sanction restringe, no multa» (`s05-04`) es una regla válida *dentro de este objetivo*. Riesgo residual que hay que aceptar a sabiendas: en el uso general, y en algún material de preparación, «sanctions» incluye las multas. Por eso la voz nunca debe decir que las sanctions «no son dinero» en general, y ahora no lo dice. Sin PDF a mano, no puedo cerrar más. |
| 2. **«Borrar lo que caduca» como due care** | **Se quita** (A-1). Es lo único que el vídeo cuenta en dos sitios con claves distintas. |
| 3. **Due care como «lo de después»** | **Correcto, se queda.** Es la definición de la lección (`:342`), de la nota de examen (`:363`), de `fcp520` y del plan. Que haya materiales que llamen due diligence a la vigilancia continua queda cubierto por el «MEJOR» y por el escenario (el análisis legal se hizo *antes de lanzar* y es el único que se menciona). |
| 4. **«Dos años» y «doce años»** | **Aceptadas como cifras de ejemplo.** Ni la lección ni el banco dan plazos de retención en años, y el escenario 2 dice «dos años» de la prohibición, no de una ley. Doce frente a dos es una discrepancia inequívoca con la política *propia*, que es lo que la pregunta mide. Los 12 «meses» de V26 son otra unidad y otro hecho. Solo hay que alinear el `why` de la pregunta 3 con esa política (A-3). |
| 5. **La peluquería en la voz** | **Correcto.** Nombra tres elementos (multa, prohibición de tintes, reseñas), cada uno ligado a su consecuencia. La licencia y la marca de champú quedan solo en pantalla; no falsea nada. |

### A-1 · BLOQUEANTE · «borrar lo que caduca» es due care en s02/s03 y retention en s06/s07

**Dónde.** `s02-05` («borrar lo que caduca»), `s03-01` (voz y `question.scenario`: «nadie borra lo que caduca» / «nadie borra lo caducado»), `s03-02` («porque borrar y corregir son rutinas que se mantienen»), y los textos de pantalla de `storyboard.json` s02 (`routines`: «borrar lo que caduca»).

**Qué está mal.**

1. La lección no pone el borrado en la due care. Su lista (`sp5-part3.ts:342`) es parchear cuando toca, revisar accesos cada trimestre, formar a la plantilla y arreglar lo que la auditoría encontró. El borrado es de la retention (`:372`: «un borrado que ocurre de verdad y también en las copias de seguridad»). Tampoco lo trae `fcp520`.
2. El propio vídeo lo contradice. La pregunta 1 dice que no borrar lo caducado es la falta de due care, y la pregunta 3 dice que no borrar lo que pasó de plazo es el fallo de retention. Es el mismo hecho con dos claves distintas, separadas por unos 150 s. Quien aprenda las dos sale con una regla inconsistente. Un candidato que sepa el examen elegiría «Retention» en la pregunta 1 si estuviera entre las opciones, y solo se salva porque no está.
3. `s06-03` enseña «luego se borran… eso es la retention», justo lo que `s02-05` acaba de contar como due care.

**Corrección.** Quitar el borrado de la due care y usar rutinas que la lección sí pone ahí.

- `s02-05`: `"<focused> {routines}Cosas como revisar quién entra, poner el sistema al día y arreglar lo que salga en las revisiones."` (el «Cosas como» además evita que «Como revisar…» suene a causal; ver B-9).
- `storyboard.json` s02, `goal`/rótulo `routines`: «revisar quién entra, cada trimestre · aplicar las actualizaciones · formar a quien llega al mostrador · arreglar lo que salga en la revisión». (Se cambia solo «borrar lo que caduca» por «aplicar las actualizaciones», que es el «parchear cuando toca» de la lección.)
- `s03-01`, voz: `"…Tres años después, nadie vuelve a revisar quién tiene acceso ni corrige lo que salió en la última revisión. ¿Qué describe mejor lo que le ha faltado?…"` (el resto del segmento igual).
- `s03-01`, `question.scenario` (153 caracteres, límite 160): `"Antes de lanzar su app, una empresa hizo un análisis legal impecable. Tres años después, nadie revisa los accesos ni corrige lo que salió en la revisión."`
- `s03-02`: `"<firm> {ok-1}Le ha faltado la due care, porque revisar y corregir son rutinas que no se acaban. {trap-1}La due diligence tienta, pero esa ya se hizo, y bien."`
- `why` y `trapWhy` de la pregunta 1 siguen valiendo tal cual.

**Efecto lateral que hay que anotar.** Con estas rutinas, la pregunta 1 queda cerca de `sp5m6q1` (`:402-415`: accesos, parches, formación y hallazgos cerrados, clave due care, trampa due diligence), que era justo lo que `_revision.md` B-2 quiso evitar al meter el borrado. Todas las rutinas que la lección asigna a la due care ya están en `q1`, así que no hay forma de evitar el parecido sin volver al fallo de arriba. Es aceptable: el banco la pregunta en positivo (todo hecho, sin due diligence en escena) y el vídeo, en negativo con el análisis legal ya hecho; y el vídeo no se mete en el banco (diseño §4.3). Pero la ficha y `script-notes.md` (duda 2 y comprobación «Banco más cercano», que hoy dicen lo contrario) deben dejar escrito que es un espejo declarado de `q1`.

### A-2 · CORREGIR · «legal hold» se usa sin explicarlo (s06-05)

**Dónde.** `s06-05`: «Una ley o un legal hold lo pueden parar, y se borra lo demás.» Además `legal hold` es la opción A de la pregunta 3 (`s07`) y sale en el chip de pantalla y en la regla 3 del cierre.

**Qué está mal.** Regla 3 del plan («ningún término se usa antes de explicarlo»). La voz nunca dice qué es un legal hold (orden de guardar datos por un litigio o una investigación). Quien oye la pregunta 3 no puede descartar la opción A con fundamento, y «lo pueden parar» tiene el antecedente lejos («el right to be forgotten», frase anterior). Además, la lección y la nota de examen (`:363`) lo usan como pieza central del segundo reflejo.

**Corrección** (`s06-05`, `<steady>`):

`"<steady> Si una ley te obliga a guardarlos, no se borran. Con un legal hold, una orden de guardar por un juicio, igual. Lo demás sí se borra."`

Suma unas 14 palabras a las 14 originales. Ver la nota de duración al final.

### A-3 · CORREGIR · Pregunta 3: el `why` mide contra «el propósito» y el escenario mide contra «su política» (s07-01)

**Dónde.** `question.why` de `s07-01`: «Guarda más tiempo del que el propósito justifica: falla la retention». La voz de la resolución (`s07-02`) dice bien «mucho más de lo que su plazo permite».

**Qué está mal.** El escenario fija el plazo de la empresa (dos años), pero no dice cuál es el propósito ni que doce años no lo justifiquen. Quien lee la pantalla en vez de oír la voz recibe una razón distinta de la que prueba el escenario, y el `why` es lo que se ve al resolver.

**Corrección** (63 caracteres, límite 90): `why`: `"Guarda mucho más de lo que su plazo permite: falla la retention"`. `trapWhy` de la pregunta 3 se queda.

### A-4 · CORREGIR · s05-04: la línea de pantalla y la voz no coinciden en el cue `regulator`

**Dónde.** `s05-04`: `{regulator}Recuerda, una sanction restringe, no multa. Y en el examen, mira quién la impone.`

**Qué está mal.** El cue `regulator` enciende en pantalla la línea «la impone el regulador, no un cliente» (storyboard s05). Pero lo primero que dice la voz tras el cue es «una sanction restringe, no multa», que es otra regla (frente a las fines). La línea de quién la impone solo aparece con la segunda oración, unos 3 s después. Y la tarjeta de examen («Sanctions: la autoridad restringe, no multa») cuelga del mismo cue, así que sale cuando termina la oración.

**Corrección.** Invertir las dos oraciones para que la voz diga lo que la pantalla muestra en el cue y deje la regla del «no multa» para el cierre, donde la tarjeta la repite:

`"<clear> {regulator}En el examen, mira quién la impone, porque aquí es el regulador y no un cliente. Y recuerda, una sanction restringe, no multa."`

Conserva `pauseAfterMs: 1000`, que garantiza los 5 s de `holdSec`. Suma unas 10 palabras.

### A-5 · OPCIONAL · «empresa de mensajería» se oye como «mensajería» a secas (s05-01)

En esta pista «mensajería» ya significa aplicación o servicio de mensajes: `srv-msg01` y `srv-msg02` («ejecución remota de código en el servicio de mensajería», V18) y el grupo de mensajería de los amarradores (V35). En `s05-01`, «una empresa de mensajería» es en castellano una empresa de paquetería, pero alguien que viene de V18 o V35 puede oír una empresa de mensajes. No cambia la respuesta, pero distrae. Propuesta: «una empresa de transporte» (mismo largo en pantalla). Escenario de pantalla (147 caracteres): `"Tras una inspección, un regulador prohíbe a una empresa de transporte ir a concursos públicos dos años. Sin multa; sigue con sus clientes privados."`

### A-6 · OPCIONAL · Pregunta 2: el `why` no descarta «Loss of license»

`why` («La impone la autoridad y restringe una actividad: es una sanction») también describe una pérdida de licencia, que la impone una autoridad y restringe lo que haces. Lo que la separa es que sigue operando (el escenario ya lo dice: «sigue con sus clientes privados»), y la voz de `s05-02` ha dicho lo mismo que el `why`. Un `why` que lo cierra (63 caracteres): `"Restringe una actividad sin quitar la licencia: es una sanction"`, y `s05-02`: `"<firm> {ok-2}Es una sanction, porque la impone la autoridad y le restringe una actividad, pero la empresa sigue operando."` Solo si se quiere blindar la pregunta; hoy tiene una sola respuesta defendible.

### A-7 · OPCIONAL · «Se lanza el sistema» suena a hecho (s02-04)

El sello de s01 y el storyboard exigen que el vídeo sea una propuesta («no dice que el sistema ya funcione»). `s02-04` dice en indicativo «Se lanza el sistema. Y empieza lo otro». La línea del tiempo es genérica y el contexto lo salva, pero se arregla gratis: `"<thoughtful> {launch}El día que se lance el sistema, {after}empieza lo otro, que no se acaba."`

### Comprobación de canon (sin hallazgos)

- Sin equipos, cuentas, IP, dominios, hashes, personas ni fechas; `canon-refs.md` vacío es correcto. Halden, la Autoridad Portuaria y la terminal de pasajeros existen en el registro y no se contradicen con un registro de objetos perdidos; la terminal ya tiene «oficina» (V32) y «pantallas de salidas» (V35), ninguno con objetos perdidos.
- «Naviera» como parte de un contrato sin nombre: coherente con la lección (`:320`) y con el registro.
- La política de retención ya existe en el canon (V6: «buzón, archivos y registros se conservan hasta que lo permita la política de retención») y el legal hold de V2 también. V43 no los toca ni los contradice.
- La frase del «MEJOR» es la de V28 (registro: «Fíjate en ese “mejor”. Pide la que más encaja con este caso, aunque otra suene bien»). Coincide palabra por palabra.
- Imágenes: el gato, la peluquería y el archivador no figuran en el §6 ni en las listas de imágenes ocupadas; no se dice «cajón» (V38), «caja», «reloj» ni «libreta» (V26). La libreta del registro de V26 es otro objeto y otro vídeo.
- Preguntas fuera del puerto («una empresa», «una empresa de mensajería») sin nombre ni país: correcto, y rotuladas «pregunta tipo examen · ejemplo».
- Cifras: ninguna cifra, nombre ni plazo que no esté en la ficha. «Tres años», «dos años» y «doce años/dos años» son de escenarios de pregunta; en pantalla s04 el ejemplo de los buques que no atracan es de la lección (`:291`).

---

## B. Naturalidad

### Resumen de la pasada

Muy bien en general. Frases de 8 a 25 palabras (ninguna pasa de 21 por oración), sin colones, sin siglas deletreadas, sin identificadores, una imagen por concepto que vuelve cuando el concepto vuelve (gato, peluquería, archivador), emociones sin repetirse en segmentos seguidos y pausas en la banda 250-300 ms con 500-1000 ms tras las revelaciones. La carga de términos ingleses (doce) es la que pide el examen y los explica con una frase llana antes del nombre casi siempre. Los fallos son de frases que no se entienden sin la pantalla.

### B-1 · CORREGIR · «parar el registro» no tiene antecedente en la voz (s04-02)

La voz nunca ha dicho «registro»: habla de «los objetos perdidos» y de «el sistema». «Parar el registro hasta corregirlo» solo se entiende si se leyó el rótulo en pantalla de la escena anterior. Corrección:

`"<clear> {fines}Una autoridad puede multarte, y eso son las fines. {sanctions}O prohibirte algo, como parar el sistema hasta corregirlo. Eso son las sanctions."`

(Y el rótulo de pantalla de `sanctions`: «te prohíbe o te limita algo: parar el sistema hasta corregirlo».) El «eso son» en vez de «y son» evita que «y son las fines» suene a continuación de «multarte».

### B-2 · CORREGIR · «retiene pagos o resuelve» (s04-04)

«Resuelve» solo, en voz, se oye como «soluciona»: es jerga jurídica («resolver el contrato») que en escrito se entiende y dicho no. Corrección:

`"<thoughtful> {contract}La otra parte del contrato, una naviera, retiene pagos o cancela el contrato. Son los contractual impacts."`

### B-3 · CORREGIR · «Ese mapa» no se ha presentado (s06-02)

`s06-02` dice «Ese mapa es el data inventory», pero `s06-01` solo ha enumerado tres sitios; nadie ha hablado de mapa. Rompe la regla 3 (primero la idea, luego el nombre). Corrección, cue y emoción iguales:

`"<intrigued> {inventory}Saber qué datos tienes y dónde están, eso es el data inventory. Y no proteges lo que no sabes que tienes."`

### B-4 · CORREGIR · «su copia» y «documento» (s06-01)

«El sistema, su copia y el aviso» deja «su copia» en el aire (¿copia de qué?), y «documento» a secas se oye como cualquier papel. Corrección:

`"<engaging> {three-places}Volvemos a los objetos perdidos. Quien reclama deja nombre, teléfono y documento de identidad, y eso vive en tres sitios. El sistema, su copia de seguridad y el aviso que se le manda."`

### B-5 · OPCIONAL · Promesa con tres miembros desiguales (s01-02)

«Vas a ver qué hacer antes de lanzarlo, mientras funciona y cuánto se guarda» mezcla dos «qué hacer» y un «cuánto se guarda» en una sola lista, y «mientras funciona» queda sin verbo. Alternativa: `"<confident> {title}Antes, después y a tiempo. {promise}Vas a ver qué hacer antes de lanzarlo, qué hacer mientras funciona y cuánto tiempo guardar los datos. Y tres preguntas como las del examen."` (Ya cuadra con los tres chips de pantalla.)

### B-6 · OPCIONAL · La pregunta 1 arranca en seco (s03-01)

Las preguntas 2 y 3 se anuncian («Otra más», «La última») pero la 1 empieza con «Antes de lanzar su aplicación…» justo después del gato. Una entrada de dos palabras ayuda a quien oye a darse cuenta de que cambia el formato: `"<intrigued> {q1}Te toca. Antes de lanzar su aplicación, …"`. Es un segmento largo (53 palabras con la glosa del «mejor»), pero son oraciones cortas; no hace falta partirlo.

### B-7 · OPCIONAL · «Después» y el fragmento «Mientras…» (s06-03)

«Después, cuánto tiempo se guardan» reutiliza «después» (ya usado en s02 para «tras el lanzamiento») para otra cosa, y «Mientras el objeto esté en la oficina y unos meses más.» es una subordinada suelta. Alternativa: `"<clear> {retention}Lo segundo es cuánto tiempo se guardan. Se guardan mientras el objeto esté en la oficina y unos meses más. {backups}Y luego se borran en los tres, copia incluida. Eso es la retention."`

### B-8 · OPCIONAL · «el right to be forgotten, pero no siempre» (s06-04)

El inciso «el right to be forgotten» seguido de «pero no siempre» deja a la oyente sin saber si el «no siempre» es de pedirlo o de que se cumpla. Alternativa: `"<thoughtful> {subject}Quien reclama es la data subject. {rtbf-chip}Puede pedir que se borren sus datos, y eso es el right to be forgotten. Pero no siempre se puede."`

### B-9 · OPCIONAL · Muletillas de plantilla: «tienta» ×3 y «Eso es / Eso son» ×6

«La due diligence tienta» (`s03-02`), «Contractual impacts tienta» (`s05-03`) y «El right to be forgotten tienta» (`s07-03`) son la misma frase tres veces, y «tienta» es palabra de papel. Además, «Eso es/son la X» cierra seis veces el nombre de un concepto (`s02-03`, `s04-02` ×2, `s04-03`, `s04-05`, `s06-03`). No es un fallo, pero a la tercera se oye plantilla. Variantes sin tocar el dato (las que traen otro cambio ya están arriba):

- `s03-02`: `"…{trap-1}Ojo con la due diligence: esa ya se hizo, y bien."` (el «:» sería el único del segmento; si molesta, «Ojo con la due diligence, que esa ya se hizo, y bien.»)
- `s05-03`: `"<thoughtful> {trap-2}Contractual impacts suena bien, porque se queda sin contratos públicos. Pero ningún cliente se los quita, se los prohíbe el regulador."`
- `s07-03`: `"<thoughtful> {trap-3}El right to be forgotten confunde, porque hay que borrar. Pero se ejerce a petición, y aquí nadie ha pedido nada."`
- `s04-03`: `"{license}Quien te dio el permiso para operar puede quitártelo, y eso es la loss of license."`

### B-10 · OPCIONAL · Dos palabras de papel: «exime» y «el uso»

«Haberlo mirado muy bien no te exime de cuidarlo» (`s02-07`, y la tarjeta) es castellano de contrato; hablado, «no te libra de cuidarlo». Y «guarda lo que pide la ley o el uso» (`s08-04`, `s07` tarjeta) deja «el uso» sin objeto cuando se oye: no se sabe si es «el uso del dato» o «tu costumbre». La lección dice «propósito». Si se quiere cambiar, hay que hacerlo en voz y tarjeta a la vez:

- Tarjeta s02: `"Haberlo mirado bien no te libra de cuidarlo"` y voz `"Haberlo mirado muy bien no te libra de cuidarlo."`
- Tarjeta s07 (54 caracteres): `"Retention: lo que pide la ley o el propósito, nada más"`, y frase final `s08-04`: `"Antes, mira. Después, cuida. Y guarda lo que pide la ley o el propósito, ni un día más."`

### B-11 · OPCIONAL · Sujeto de «sigue» (s05-01)

«No le pone multa, y sigue con sus clientes privados» tiene sujeto implícito: lo que sigue es la empresa, pero la oración anterior terminaba en el regulador. `"…durante dos años. No le pone multa, y la empresa sigue con sus clientes privados. ¿Qué consecuencia del incumplimiento es?"`

---

## Nota de duración (cambios A-2, A-4, B-3, B-4)

Los cambios obligatorios (A-1, A-2, A-4, B-1 a B-4) suman unas 34 palabras (~13 s en la cuenta de `--estimate`, que hoy da 326,4 s y mide con 2,5 palabras/s). La lectura real de Lidia queda en ~0,89 del estimado, así que el render se quedaría cerca de los 295 s, dentro de 240-330 s. Aun así, hay que volver a lanzar `build-timeline --estimate` tras aplicar las correcciones y mirar los avisos. Si hace falta margen, el orden de recorte de `script-notes.md` vale, con una salvedad: de los dos primeros candidatos, es mejor empezar por **la voz de `s04-06`** (el reporting se queda en el chip de pantalla; no es ninguno de los tres conceptos de la ficha) que por la peluquería, porque la peluquería es la única analogía del concepto 2 y las otras dos imágenes sí vuelven.

---

## Veredicto

**Congelar tras corregir A-1, A-2, A-3, A-4, B-1, B-2, B-3 y B-4.** Las demás (A-5 a A-7, B-5 a B-11) son opcionales y no condicionan el congelado; la que más conviene hacer es A-5 por el choque con «mensajería» de V18 y V35.

Recuento por severidad:

- **BLOQUEANTE:** 1 (A-1)
- **CORREGIR:** 7 (A-2, A-3, A-4, B-1, B-2, B-3, B-4)
- **OPCIONAL:** 10 (A-5, A-6, A-7, B-5, B-6, B-7, B-8, B-9, B-10, B-11)

Tras aplicar A-1, actualizar también `docs/superpowers/plans/fichas-tanda8/V43-sp5m6.md` (las rutinas de la due care, la pregunta 1 y el «Banco más cercano») y `out/script-notes.md` (duda 2 resuelta, escenario y rutinas nuevos), para que el registro de canon y la ficha no conserven «borrar lo que caduca» como due care.
