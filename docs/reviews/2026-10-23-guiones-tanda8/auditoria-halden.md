# Revisión del guion · V39 `auditoria-halden` (sp5m7, `caso-principal-yt`)

Revisión de solo lectura del borrador sin congelar (`video.json` sin `frozen`). Fuentes leídas: ficha `docs/superpowers/plans/fichas-tanda8/V39-sp5m7.md`,
`video/auditoria-halden/{storyboard,narration,video}.json`, `out/script-notes.md`, `out/canon-refs.md`, lección `src/data/secplus/sp5-part4.ts` (sp5m7 entera:
bloques, tres checks, quiz q1 a q8), `sp5-part1.ts:262-270`, `placement-sp5.ts` (pl-sp5q10, pl-sp5q11), objetivo SY0-701 5.5, plan §1 «Narración hablada»,
y el registro `glass-harbor.md` (cabecera, §1 con la tabla de vídeos, §2, §3, §4, notas de V25/V26 y búsqueda dirigida por términos en §5 y §6; el archivo
no se puede leer de una vez porque cada línea de §1 y §3 pasa de 3.000 caracteres). También los guiones de V25 y V26 (para el acta y el «Y vuelve») y los de
V42, V43 y V44 de la tanda (solapes). Cifras recontadas con Node: 59 segmentos, 1.227 palabras, escenario/pregunta/opciones/`why`/`trapWhy`/tarjetas/acta
dentro de los límites del motor; todos los cues exigidos por el storyboard están en la voz y no sobra ninguno; `answer`/`trap` apuntan a las opciones que dice la ficha.

**Lo que está bien y no necesita tocarse:** las seis definiciones técnicas coinciden con la lección y con el 5.5 (attestation frente a acknowledgement, audit
committee que no audita, independencia como lo que da peso fuera, regulatory examination que no se contrata y puede sancionar, auditoría frente a pentest,
known/partially known/unknown con su precio, pasivo frente a activo por la huella en los registros). Las preguntas 1, 2, 4 y 5 tienen una sola respuesta
defendible. Ninguna copia ni parafrasea al banco: q5 de la lección lleva la regulatory examination solo de distractor, q4 es el escaneo activo (la otra
cara de la 5), q6 es el purple con el red de trampa, q7 es known por presupuesto. El acta de PAPER GOVERNOR sigue la forma de V25/V26 («Se acuerda: … Queda en
acta.»), la etiqueta y la frase del «Y vuelve» son literales de V26, la voz es la misma, y el error que recoge es el de la nota de examen (`:161`). Sin fechas,
IP, equipos, cuentas ni personas con nombre; `canon-refs.md` vacío es creíble (comprobado: el registro no contiene «autoridad marítima», «ascensor», «puente
nuevo», «sala de escape», «red team», «purple» ni «pentest» salvo la mención de pasada de §5 sobre sp5m7).

---

## A. Exactitud y canon

### A-1 · CORREGIR · s08-p3, `s08-01` (y escenario de la pregunta 3) · defensive frente a purple: la voz dice «una a una»

Es la duda 1 de `script-notes.md`. **Decisión:** la clave (Defensive) se sostiene y la pregunta se puede conservar, pero el escenario tal como está deja
abierto el purple, y es el único punto de la pregunta que un lector estricto discutiría. Motivos:

- La voz dice «reproduce en su red, **una a una**, técnicas de ataque ya conocidas». El purple de la lección (`:109`, tabla `:131`, q6 `:259`) es «lanzando cada
  técnica, comprobando al momento si generó telemetría y creando la regla antes de pasar a la siguiente», y el propio vídeo lo rotula en s07 «técnica a
  técnica». «Una a una» es la misma idea con otras palabras, y es la opción C.
- Lo que echa fuera al purple es la colaboración inmediata con el SOC, y el escenario no la niega. Hoy descarta bien al red (no hay objetivo) pero deja al purple
  solo con «solo se mide».
- En pantalla ya no está «una a una» (la ficha lo quitó), así que el defecto está en la voz y en lo que falta, no en el texto corto.

**Corrección** (quita «una a una» y añade lo que mata al purple sin devolver el «sin avisar», que es rasgo del red):

- Voz `s08-01`: «`<curious> {q3}Un banco lanza contra su red técnicas de ataque ya conocidas. No hay ningún objetivo que alcanzar y nadie trabaja con su centro de operaciones de seguridad. Solo se mide cuánto tarda en verlas, entenderlas y contenerlas. ¿Qué tipo de prueba describe mejor el ejercicio?`» (45 palabras, una más que ahora).
- `scenario` en pantalla (147 caracteres): «Un banco lanza en su red técnicas de ataque conocidas, sin objetivo y sin trabajar con su SOC. Solo mide cuánto tarda el SOC en verlas y contenerlas.»
- `q`, `options`, `answer`, `trap`, `why` y `trapWhy` se quedan. La resolución (`s08-02`, `s08-03`, `s08-04`) se queda tal cual.

Con esto: Offensive queda fuera por «sin objetivo» (rasgo central del red en la lección, `:122`); Integrated, por «nadie trabaja con su SOC» (rasgo central del
purple); Physical, por no haber barreras; y Defensive es lo que queda y lo que se mide. Si Lidia prefiere no tocar el escenario, el mínimo imprescindible es
quitar «una a una» de la voz.

### A-2 · CORREGIR · s12-p5, `s12-02` y `s12-03` · «nadie ha escaneado nada» es falso dentro de la propia explicación

La resolución dice que la passive reconnaissance «consulta a un tercero que **ya lo recogió**» y, dos frases después, «Pero **nadie ha escaneado nada**». Un buscador
de aparatos expuestos existe porque alguien los escaneó, y el `why` en pantalla lo dice («Consulta a un tercero que ya lo recogió»). Quien lo oiga con atención
oye una contradicción, y es justo el punto fino de la pregunta (lo que separa pasivo de activo es quién toca al objetivo, no si se ha tocado alguna vez).
`s12-03` («nadie ha llamado a la puerta») arrastra lo mismo. Es la duda 2 en su vertiente de voz; la clave (Passive) es correcta, y el buscador como fuente
pasiva es la lectura estándar de CompTIA y de la lección (`:155`), aunque algún material lo llame OSINT; «Port scanning» como opción sirve de segunda trampa y es
aceptable (es una técnica, no «un tipo de actividad», pero la pregunta tolera ese nivel).

**Corrección:**
- `s12-02`: «`<firm> {ok-5}Passive reconnaissance, porque consulta a un tercero que ya lo recogió. {trap-5}La active reconnaissance tienta, porque salen puertos y versiones. Pero el equipo no ha escaneado nada.`»
- `s12-03`: «`<warm> {log-back}El registro no miente: el equipo no ha llamado a la puerta.`»
- `trapWhy` («…pero no ha tocado ni un equipo») es correcto: se queda.

### A-3 · CORREGIR · s11-mirar, `s11-02` y `s11-03` (y s07, `s07-03`) · tiempos verbales: el plan suena a hecho

La ficha y las notas dicen «todo es plan, nada se ejecuta», y casi todo el guion lo cumple («va a firmar», «dirá», «consultaría», «podría escanear»). Tres
frases rompen la regla y suenan a algo que ya ha pasado en el puerto:
- `s11-02`: «Y el registro del SOC **está** vacío, porque nadie **ha** tocado nada del puerto» (presente y perfecto, sin condicional).
- `s11-03`: «Y **ahora** el registro sí **tiene** líneas» («ahora» es un presente real).
- `s07-03`: «Aquí, llegar a un fichero marcado en un servidor de pruebas» (sin verbo; en voz no se oye que sea la propuesta).

Esto no choca con ningún hecho del registro (no hay pentest ni red team en Halden en ninguna fila), pero sí con la regla de canon de la ficha («Nada se ejecuta»)
y con la cautela del registro §5 sobre los vídeos «sin hecho cumplido». Además, que el registro de un SOC esté literalmente «vacío» no es realista (siempre hay
ruido de Internet); lo que enseña el 5.5 es que **no hay rastro de la prueba**, y así conviene decirlo en voz. En pantalla puede seguir «vacío».

**Corrección:**
- `s07-03`: «`<steady> {red}El offensive, o red team, es un adversario simulado que persigue un objetivo. En el plan del puerto, llegar a un fichero marcado en un servidor de pruebas.`» (esto también resuelve A-7).
- `s11-02`: «`<thoughtful> {empty-log}Y el registro del SOC seguiría vacío, porque no se habría tocado nada del puerto.`»
- `s11-03`: «`<steady> {window}Dentro de la ventana pactada ya podría escanear y preguntar versiones. {active}Eso es active reconnaissance. {log-lines}Y entonces el registro sí tendría líneas.`»

### A-4 · CORREGIR · s06-p2, pregunta 2 · la pregunta pide un «documento» y dos opciones no lo son

`q`: «¿Qué **documento** responde MEJOR…?». Las opciones: *Signed self-assessment* (documento), *Independent third-party audit* (una actividad; su documento sería el
informe), *Penetration test report* (documento) y *Purple team exercise* (un ejercicio, no un documento). Dos opciones quedan descartadas por tipo y no por
contenido: la D se tacha sola por una pista gramatical y la B es la única «actividad» que no es un informe. La clave sigue siendo B, pero la pregunta no pasa
la prueba de «opciones sin pistas». La ficha aceptó *Purple team exercise* como distractor «de otra prueba técnica» (A de la ficha, «Las otras dos»), pero con
«documento» en la pregunta no funciona como tal.

**Corrección** (las opciones pasan a ser todas informes, y D vuelve a ser un distractor de verdad: el informe interno, que le falta justo lo mismo que a la
A, la independencia):
- `options`: `["Signed self-assessment", "Independent third-party audit report", "Penetration test report", "Internal audit report"]` (22 · 36 · 23 · 21 caracteres; `answer` 1 y `trap` 2 no cambian).
- La voz de `s06-02` («La independent third-party audit, porque piden cumplir un estándar…») se queda: la audit y su informe son lo mismo para el oyente.
- Reflejo en `trapWhy` (ver A-5): «Que nadie entrara no dice que cumpla cada control del estándar» (62 caracteres) es más exacto que «dice que aguantó».
- Comprobado: con las nuevas opciones, ninguna es defendible salvo B para un cliente de fuera, y el banco no pregunta nada igual (q2 y q8 premian la
  independencia, pero sin pentest que tiente). Un lector de PCI DSS podría decir que un *signed self-assessment* es una validación aceptada; lo cubre el
  «MEJOR» y el «cliente grande», y no hace falta tocarlo.

### A-5 · OPCIONAL · s05, s06, s13 y tarjeta de s05 · «un pentest, que aguantas» promete más de lo que da un pentest

Un pentest demuestra qué se puede romper; uno limpio no demuestra que aguantes (la lección: «demuestra explotabilidad real y camino de ataque», `:83-88` y
`:111`; la q5 dice «prove whether an attacker could actually reach…»). «Auditoría: cumples. Pentest: aguantas» (tarjeta de s05), «dice que aguantó» (s06) y la frase
de cierre «un pentest, que aguantas» suenan a que un pentest *certifica* resistencia. No lo corrige la lección, pero un lector estricto puede objetarlo, y
es la frase que Lidia repetirá. No es un error de examen (el examen no pregunta esto) y la frase de cierre es la que fija la ficha; si se quiere afinar:
- Tarjeta de s05: «Auditoría: ¿cumples? Pentest: ¿aguantas?» (40 caracteres).
- `s13-04`: «`Una firma declara, una auditoría comprueba que cumples y un pentest, si aguantas.`»
- `trapWhy` de la pregunta 2: «Que nadie entrara no dice que cumpla cada control del estándar» (62).
- `s06-02`: «…El pentest limpio tienta, pero no dice que cumplas cada control.»

### A-6 · OPCIONAL · s02, `s02-04` y `s02-05` y s13 · attestation solo como declaración de la dirección

Es la duda 3. **Decisión:** «management attestation» es correcta, está en la lección (`:27`) y el chip la rotula; el caso (la dirección firma ante el regulador) se
puede conservar. Dos matices de exactitud, sin gravedad:
- «Pero **ninguna de las dos comprueba nada**» exagera: la attestation que emite una firma independiente (el caso del check `:29-43`) sí viene de una revisión. Lo
  que enseña la lección es que es «una declaración, no una prueba técnica». Mejor: «`Pero ninguna de las dos prueba que funcione.`»
- `s02-04` («Eso es una attestation, la organización comprometida con un hecho») es un fragmento escrito. Mejor, y deja la puerta abierta a la attestation de
  terceros sin gastar más tiempo: «`Lo firmará la dirección. Eso es una attestation, y quien la firma responde de que es cierto.`»

### A-7 · OPCIONAL · s07, `s07-03` · «sin avisar» como parte de la definición del red team

La lección lo dice (`:122`: «sin avisar a nadie»; q6: «deliberately unannounced»), así que no es un error. Pero es el rasgo que causó la versión con dos
respuestas de la pregunta 3 (`rev8` A-1) y un red team puede ser anunciado a la dirección y a veces al SOC. Más seguro dejar «sin avisar» solo en la propuesta del
puerto (`s07-06`, que ya lo trae) y definir el red por el objetivo. Queda resuelto con el texto de A-3 (`s07-03`).

### A-8 · OPCIONAL · pregunta 4 (s10) · opción D de otra categoría, y «reservas» pegado a «la aplicación nueva»

- La opción D, *Integrated (purple team)*, es un tipo de prueba, no un nivel de conocimiento, y la pregunta pide un nivel: se descarta sola (la ficha lo sabe y
  lo acepta). El taxonomía solo tiene tres niveles; si se quiere otra opción del mismo tipo, serviría *Black box* (sinónimo de unknown, también incorrecta aquí).
  No es bloqueante: A, B y C bastan para que la pregunta discrimine.
- El oyente oye en `s09-07` «Para el puerto, la aplicación nueva, known» y 30 s después «una plataforma de **reservas**». El registro tiene un portal de reservas
  de atraque (V10, V11, V12), una web de citas de camiones (V19) y la lección tiene una *cargo booking application* en q7. La ficha lo evita en la pantalla
  («sin puerto, buques ni camiones»), pero la voz sigue juntando «aplicación nueva» y «reservas». Mejor un dominio sin relación:
  - voz `s10-01`: «`Una plataforma de cursos en línea quiere saber qué podría hacer alguien que ya es alumno. Al equipo de pruebas solo le da una cuenta de alumno normal: ni planos, ni código fuente, ni accesos de administración. ¿Qué nivel de conocimiento del entorno encaja mejor?`»
  - `scenario` (158 caracteres): «Una plataforma de cursos quiere saber qué podría hacer un alumno. Al equipo de pruebas solo le da una cuenta de alumno: ni planos, ni código, ni acceso total.»
  - `s10-02`: «…porque recibe la información de un alumno normal, y nada más.» Título de escena «Una cuenta de cliente» → «Una cuenta de alumno».
  Con esto la «aplicación nueva» de s09-07 tampoco se confunde con ninguna otra.

### A-9 · decisión sobre las demás dudas y desvíos de `script-notes.md` (sin hallazgo)

- **Duda 4 (s03):** «el audit committee no audita, protege a quien audita» y «la regulatory examination la hace la autoridad marítima» siguen la lección (`:47`,
  tabla `:53-82`; la fila de la autoridad marítima nacional es la del propio ejemplo de Halden, `:81`). Aceptado. La imagen de Industria funciona en España; ver
  B-1 para el problema de que el oyente no la sigue.
- **Duda 5 (s11):** el condicional es lo correcto (ver A-3); lo que sobra es el presente de `s11-02` y `s11-03`.
- **Desvío 1 (s01 repartido en dos frases):** aceptado; el título cae en la segunda frase (~8 s en lectura real).
- **Desvío 2 (título de s08):** aceptado; «Un ejercicio en el banco» no da la respuesta.
- **Desvío 3 (`youtubeTitle`):** aceptado. `paths.mjs:50` rechaza `|` y el motor añade «| Security+ SY0-701 en español» (`youtube-meta.mjs:22`).
- **Desvío 5 (s06 en 98 palabras):** aceptado. La glosa de «mejor» es la de V28 (`controles-halden/narration.json:143`), literal.
- **Desvío 10 (corte pendiente):** ver B-4; el recorte de la ficha para s03 se aplica fusionando, no suprimiendo.
- **Canon nuevo que hay que apuntar al cerrar** (`canon-refs.md` vacío es normal): la dirección que va a firmar una management attestation ante la autoridad
  marítima antes de su revisión anual; la independent third-party audit «ya encargada» (sin firma auditora, sin resultado); el *audit committee* como comité
  del consejo (distinto del comité de riesgos de V25, el de seguridad de la información de la sección 5 y el comité de cambios de V16/V17); el plan de pentest
  (rules of engagement con cinco casillas, «primero purple, después red team sin avisar», objetivo «un fichero marcado en un servidor de pruebas», «la
  aplicación nueva, known; lo que se ve desde fuera, unknown», dos semanas de reconocimiento y el registro del SOC); las tres imágenes (ascensor, puente nuevo,
  sala de escape); la quinta acta de PAPER GOVERNOR; y los cinco escenarios de pregunta.
- **Solapes con la tanda, comprobados:** V43 (`cumplimiento-halden`) enseña *loss of license* como consecuencia de incumplir (5.4) y V39 pregunta una licencia
  en la pregunta 1 (5.5): no se contradicen. V42 (`proveedores-halden`) usa «informe firmado de la auditoría interna del proveedor» como trampa (5.3); V39 no
  repite el supuesto. V43 tiene *Attestation* de distractor y V39 la enseña después (orden del curso sp5m6 antes que sp5m7): sin choque. V42 y V43 no traen a
  PAPER GOVERNOR, así que el «Y vuelve» de V39 sigue a V25 y V26 sin interferencias. «Socio» (`s09-03`) coincide con el socio de la plataforma aduanera de V6; es
  genérico y la ficha evitó contratista/proveedor, pero si se quiere cero roce, «lo que tendría un cliente» da lo mismo y casa con la pregunta 4.

---

## B. Naturalidad

Lectura con las doce reglas de §1 del plan y con el ritmo 1,08 de Lidia. En conjunto el guion habla: las frases son cortas y casi todas llevan conector hablado;
cero colones de lista y cero siglas deletreadas (SOC se lee como palabra). Los avisos del validador (los cinco segmentos de lectura de pregunta) son
inherentes al formato. Lo que queda:

### B-1 · CORREGIR · s03-quien, `s03-06`, y s04-p1, `s04-03` · el ascensor no se entiende al oído

`s03-06`: «Piensa en el ascensor de una comunidad. **La hoja de los vecinos** pesa poco. **Industria, que no la llama nadie,** puede multar.» Tres problemas oyéndolo
sin la pantalla:
1. «La hoja de los vecinos» no dice qué es (la revisión que rellena la propia comunidad).
2. El «organismo de control» que contrata la comunidad (la independent third-party audit) y el administrador (la internal audit) solo salen en la imagen, pero
   `s04-03` los usa en voz: «es Industria con su expediente, **no el organismo que contrata la comunidad**». El oyente nunca ha oído ese organismo.
3. «Industria, que no **la** llama nadie»: el «la» no tiene antecedente claro (el más cercano es «la hoja»).

Además «Industria» es un organismo español; en Latinoamérica la imagen se pierde. Se mantiene (la ficha y el canal son en español de España) pero conviene que la
voz diga qué hace, que es lo que traspasa.

**Corrección:**
- `s03-06`: «`<warm> {lift}Piensa en el ascensor de una comunidad. La hoja de los vecinos pesa poco. El organismo de control que contratan, más. Y a Industria no la llama nadie, y multa.`» (+8 palabras sobre el actual).
- `s04-03`: «`<warm> {lift-back}Como en el ascensor: es Industria abriendo un expediente, no el organismo que contrata la comunidad.`» (mismo largo).

### B-2 · CORREGIR · s07-modos, `s07-01`, y s11-mirar, `s11-01` · listas leídas y «registros» dos veces

Regla 8 del plan: una lista de más de tres elementos va a la pantalla.
- `s07-01`: «alcance, ventana, técnicas, contactos y quién autoriza» son cinco elementos leídos de corrido; ya están en las cinco casillas de la imagen.
- `s11-01`: «registros públicos, certificados, ofertas de empleo y buscadores de aparatos expuestos» son cuatro, con una oración de 22 palabras, y «registros
  públicos» choca dos frases después con «el registro del SOC» (dos cosas distintas con la misma palabra, en el vídeo que enseña la diferencia).

**Corrección:**
- `s07-01`: «`<engaging> {roe}Antes de probar nada hay un papel, las rules of engagement. Dice qué se toca, cuándo y quién lo autoriza. Sin ese papel no es una prueba.`»
- `s11-01`: «`<curious> {before}Mira las dos semanas del plan. Antes de la ventana, el equipo de pruebas solo miraría lo público, como certificados, ofertas de empleo y buscadores de aparatos expuestos. {passive}Eso es passive reconnaissance.`» (el buscador se queda en voz porque la pregunta 5 lo necesita; «registros públicos» sale de la voz y se queda en la pantalla).

### B-3 · CORREGIR · s13-cierre, `s13-02` y `s13-03` (y `s03-07`) · «cuenta» y «cuentas» con cuatro sentidos

`s13-02`: «**cuenta** quién comprueba»; `s13-03`: «cuánto **cuentas**» (sin «le» ni complemento, se oye «cuánto cuentas» como «cuánto sumas»); `s09-03` y
`s10-01`: «una **cuenta** de usuario»; y `s03-07`: «**cuenta** quién mira, no cuánto mira». En el cierre, que se oye sin pantalla pendiente, `s13-02` y `s13-03`
quedan seguidas con «cuenta» y «cuentas» significando cosas distintas.

**Corrección:**
- `s13-03`: «`<firm> {rule-3}En la prueba, mira qué se mide, cuánto sabe quien prueba y si se ha tocado al objetivo.`» (una palabra menos).
- `s03-07` y `s13-02`: «**lo que pesa** es quién mira, no cuánto mira» / «Para convencer a alguien de fuera, **lo que pesa** es quién comprueba.»
  («pesa» retoma el «peso» de s03 y quita el tercer sentido de «cuenta»).

### B-4 · OPCIONAL · s03-quien · la escena más cargada (138 palabras, +30 sobre presupuesto)

Ya lo dice `script-notes.md` (punto 10). Con B-1 (que añade ocho) conviene compensar fusionando `s03-02` y `s03-03`, en lugar de suprimir la frase del audit
committee (que es lo que el examen pregunta) y de paso corregir el «No le cuenta a Sistemas», que al oído suena a «no le cuenta nada a Sistemas»:
- `s03-02` (y se borra `s03-03`): «`<steady> {internal}Más peso tiene una internal audit, separada de Sistemas. {committee}Responde ante un comité del consejo, el audit committee, que no audita, pero protege a quien audita.`» (26 palabras frente a 31).

Balance de todas las correcciones propuestas: +9 palabras en total, unos +4 s sobre el estimado de 559,9 s (~563 s), es decir, rozando el umbral de 560 s de la
ficha; con la razón real de Lidia (~0,89) son ~500 s, dentro del perfil. Si `build-timeline --estimate` supera 560, aplicar el recorte de la ficha en su orden
que quede: la frase del physical de `s07-02` (queda el rótulo en pantalla; la ficha lo prevé) antes que tocar nada de las preguntas.

### B-5 · OPCIONAL · todo el guion · la muletilla «Eso es un X» / «Es el X environment» (14 veces)

`s02-02`, `s02-04`, `s03-01`, `s03-04`, `s03-05`, `s09-02`, `s09-03`, `s09-04`, `s11-01`, `s11-03` y otras abren o cierran con «Eso es…»/«Es el…» + término inglés.
Es la fórmula de la serie (regla 3 del plan: idea, luego nombre) y en cada caso funciona; pero en un vídeo de ocho minutos se oye plantilla. Variar tres o cuatro:
«Eso se llama self-assessment» (`s03-01`), «A eso se le llama unknown environment» (`s09-02`), «Ese sobre es el partially known environment» (`s09-03`) y dejar el
resto. Es opcional: las otras cápsulas ya publicadas hacen lo mismo y a Lidia le han funcionado.

### B-6 · OPCIONAL · frases sueltas

- `s01-02`: «el consejo quiere saber si **cumplen** y si **aguantan**»: el sujeto de «cumplen» es ambiguo (¿la dirección, los controles?). Mejor «si el puerto cumple y si aguanta».
- `s05-05`: cuatro comas seguidas («…o pentest, pregunta otra cosa, si pueden romperlo, y lo responde intentándolo, con permiso»). Cortar en dos: «`El penetration test, o pentest, pregunta otra cosa, si pueden romperlo. Y lo responde intentándolo, con permiso.`».
- `s05-06`: el puente se queda sin su correspondencia dicha (certificado = auditoría, prueba de carga = pentest); con la pantalla se ve, sin ella se deduce por
  el orden. Si hay hueco: «`Es como un puente nuevo. El certificado de que se construyó según la norma es la auditoría. La prueba de carga, con camiones llenos encima, es el pentest.`» (+4 palabras).
- `s07-02`: «El physical es que alguien intente entrar…» suena a definición escrita. Mejor «`Hay cuatro modos. En el physical, alguien intenta entrar en una oficina detrás de otra persona.`».
- `s09-06`: «Con una pista, tienes ayuda» es relleno y no dice qué pasa. Mejor «`Con una pista, ya tienes por dónde empezar.`»
- `s09-05`/`s09-06`: la correspondencia sin pistas / una pista / plano con unknown / partially / known va solo por el orden; está bien con la pantalla.

---

## Resumen

| Severidad | Hallazgos |
|---|---|
| BLOQUEANTE | 0 |
| CORREGIR | 7 (A-1, A-2, A-3, A-4, B-1, B-2, B-3) |
| OPCIONAL | 7 (A-5, A-6, A-7, A-8, B-4, B-5, B-6) |

**Veredicto: congelar tras corregir A-1, A-2, A-3, A-4, B-1, B-2 y B-3.** Ninguna corrección cambia el esquema del vídeo, los cues ni el número de escenas; todas
son sustituciones de frase (el texto exacto va arriba). Tras aplicarlas: volver a correr `build-timeline --estimate` (previsto ~563 s; si pasa de 560, el recorte
de B-4), `canon-check` (debería seguir en 0) y la validación de `analyzeNarration` (los cinco avisos de lectura de pregunta se mantienen), y apuntar el canon nuevo
(A-9) en el registro al cerrar. Nota para el congelado: los cambios de A-1, A-4 y A-8 tocan el campo `question` (opciones y `scenario`), así que hay que pasar los
límites de caracteres otra vez (`scenario` ≤ 160, opciones ≤ 70); las cifras de arriba ya están contadas con Node.
