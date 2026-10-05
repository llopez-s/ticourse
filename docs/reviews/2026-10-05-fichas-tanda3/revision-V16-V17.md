# Revisión de exactitud y canon · V16 (sp3m4) y V17 (sp3m5)

> Las citas `fichas/Vnn-…-ficha.md:NN` y `fichas/Vnn-…-decisiones.md:NN` remiten a los borradores que se revisaron,
> antes de aplicar esta revisión. Las fichas corregidas están en el plan de vídeos (§5) y sus decisiones en `decisiones.md`.

> Revisión de la primera versión de las fichas, del 2026-10-05. Se guarda por las citas (ruta:línea) que necesitará el
> revisor de exactitud del guion.

Revisión de solo lectura. Fuentes: `brief-fichas-tanda3.md`, `brief-revision-tanda3.md`, las dos fichas con sus
decisiones, las fichas V11 y V12 (por el portal y la voz), `docs/superpowers/canon/glass-harbor.md` (el «registro»), la
ficha de V10 en el plan y su rama, las lecciones `sp3-part1.ts`, `sp3-part2.ts` y `sp3-part3.ts`, los laboratorios de sp3
(y los de sp1, sp2 y sp4 que tocan VPN o grúas), `sections.ts` y los datos en pantalla del SIEM, V1, V5, V5b y V6. Rutas
relativas a la raíz del repo (`sp/` = `src/data/secplus/`, `siem/` = `video/siem/`, `v1/` = `video/capas-halden/`,
`v5/` = `video/ir-halden/`, `v5b/` = `video/ir-halden-pruebas/`, `v6/` = `video/iam-halden/`, `eng/` = `video/engine/`,
`plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md`).
`v10/` = `D:/LLM projects/TICourse/.claude/worktrees/video-logs-halden/video/logs-halden/` (rama de V10, congelada y sin
fusionar). `fichas/` = la carpeta de fichas del scratchpad.

Gravedad: **bloquea** (hay que resolverlo antes de aprobar) · **conviene** (error de exactitud o de canon con arreglo
barato) · **menor** (pulido).

**Hay un solo bloqueante, y es una tarjeta de V16:** la de las puertas dice, tal como está escrita, que la puerta
fail-secure se abre (V16, punto 1). Se arregla con una palabra. Lo demás son arreglos de canon y de imagen que no cambian
la estructura de ninguna de las dos fichas.

Límites recontados con Node (`[...texto].length`, `revisiones/count-v16v17.mjs`): todo dentro. V16, 7 tarjetas de 41 a 55,
preguntas de 40 y 46, mensajes de 61, 62 y 67, suma 472 s (420–576 con 0,89 y 1,22). V17, 7 tarjetas de 42 a 57, preguntas
de 46 y 45, mensajes de 66, 68 y 55, suma 476 s (424–581). Una tarjeta por escena como mucho, ninguna en la última, un
mensaje por capítulo, ninguno en la última escena, sin símbolos prohibidos. Los textos de sustitución de esta revisión
llevan su recuento entre paréntesis (`revisiones/count-fixes*.mjs`).

---

## V16 · sp3m4 · «Zonas de seguridad: dónde va cada cosa y qué pasa si falla»

1. **Bloquea** · s08, tarjeta «Fail-safe abre por la gente; fail-secure, por el activo» (`fichas/V16-sp3m4-ficha.md:87`).
   La coma de la segunda mitad sobreentiende el verbo de la primera: en castellano, «Juan come pan; María, arroz» quiere
   decir que María come arroz. Leída así, la tarjeta dice que la puerta fail-secure **se abre** por el activo, justo al
   revés de la lección («una puerta fail-secure se bloquea para proteger el activo», `sp/sp3-part2.ts:383`) y en la
   trampa que el examen mezcla a propósito. Con «cierra» escrito, la versión obvia pasa del límite (61).
   Arreglo: «Sin luz: fail-safe abre por la gente; fail-secure cierra» (56). El motivo del activo ya lo dice el rótulo
   de s08 («primero, lo que guarda»). Si se quiere en la tarjeta: «Fail-safe abre (personas); fail-secure cierra
   (bienes)» (54). No «(activo)»: en un vídeo con el eje active/passive, se leería como el modo, no como el bien.

2. **Conviene** · s06, rótulo de FAIL-CLOSED «no pasa nada · gana la seguridad» (`:74`). «No pasa nada» es la frase hecha
   de «tranquila, todo bien», y la propia ficha prohíbe decirla (`fichas/V16-sp3m4-decisiones.md:66`). En pantalla, debajo
   de un modo de fallo, se lee como lo contrario de lo que quiere decir.
   Arreglo: «no pasa ni un camión · gana la seguridad» (40), que además sigue con la imagen de la barrera.

3. **Conviene** · canon nuevo, «La red antes del plan» (`:144-150`) y s01 («entre VLAN: el router no filtra», «Operaciones
   … el único control dibujado dentro», `:69`). Dos pantallas publicadas enseñan más filtrado interno del que la ficha
   admite:
   - El SIEM enseña un **«Firewall interno»**, `fw-int01`, que acepta una conexión de `10.20.6.52` a `10.20.9.14` por el 22
     (`siem/src/data/s03-normalize.ts:66-88`) y vuelve a salir en la cola de avisos, «Cambio de configuración · `fw-int01`»
     (`siem/src/data/s06-fatigue.ts:32`). La ficha no lo menciona.
   - El panel de V1 se titula «Cortafuegos · Zona Operaciones» (`v1/src/scenes/S05Rules.tsx:88`), pero sus reglas tienen
     como origen también a Contratistas (regla 4, `DENY Contratistas → Internet`) y a Administración (regla 5,
     `ALLOW Administración → gestion.local tcp/22`) (`:23-24`). Ese cortafuegos está en el camino de más zonas que
     Operaciones.

   No se rompe nada en pantalla si se acota la frase: lo que el concepto necesita es que entre las VLAN de Oficinas,
   Administración, Producción y Pruebas nadie decide, no que Operaciones sea lo único filtrado.
   Arreglo:
   - Canon nuevo: «Entre las VLAN de Oficinas, Administración, Producción y Pruebas, el router central no filtra. El único
     cortafuegos interno (el de V1, «Zona Operaciones», y, deducido, el `fw-int01` del SIEM) tenía reglas para
     Operaciones, la salida de Contratistas y el SSH de Administración a gestión.» Y anotar en el registro que
     `srv-gis01` (`10.20.9.14`) queda detrás de ese cortafuegos (deducido).
   - s01: el rótulo de la etiqueta pasa a «entre estas VLAN: el router no filtra», y el cortafuegos de Operaciones se
     dibuja como «cortafuegos interno», sin «el único».
   - s05: «Hoy: Administración · gestión · SSH · directo» pasa a «Administración a gestión · SSH · desde cada puesto»
     (50). La regla 5 de V1 es un ALLOW que atraviesa un cortafuegos; «directo» parece contradecirla.

4. **Conviene** · s01 y canon nuevo: el plano de antes **explica el hueco de los 38 GB** aunque la ficha diga que no lo
   toca (`:178-180`). El registro lo apunta como hueco: V1 retira la regla 3 el 3-9 y, con la tabla corregida, nada deja
   salir a `srv-tc-app03` por el 443 (`glass-harbor.md:281-283`). Con el plano de V16, la regla 3 vivía en el cortafuegos
   de Operaciones, y la VLAN de Producción (la de `srv-tc-app03`, `siem/src/scenes/parts/s10-contain/Topology.tsx:70`)
   cuelga de `rt-core` y sale por `fw-perimetro-01`, que el arreglo de V1 nunca tocó. Quien junte las dos pantallas tiene
   la respuesta. No contradice nada publicado y es una explicación sensata, pero tiene que ser una decisión, no un efecto
   secundario.
   Arreglo: aceptarlo, anotarlo en el registro como «(deducido de V16) la salida de Producción no pasaba por el
   cortafuegos de Operaciones» y que ningún vídeo lo diga en voz. No hay forma barata de dejar el hueco abierto: el plano
   necesita `fw-perimetro-01` entre Internet y `rt-core` para la regla 443 del portal (s04) y para el alcance de s03, así
   que, si Lidia quiere guardarlo para otro vídeo, el que cambia es V16 entero, no un rótulo. Se recomienda aceptarlo.

5. **Conviene** · concepto 2, la imagen de la DMZ: «La ventanilla … metida en la valla: se atiende desde fuera y no tiene
   puerta a las oficinas» (`:58`, s04 `:72`). El concepto, dos líneas más arriba, dice que desde la DMZ se abren las
   conexiones imprescindibles, con regla (`sp/sp3-part2.ts:337`), y el laboratorio que es la tarea final pone un reverse
   proxy en la DMZ que reenvía al servidor de aplicación oculto en la red interna (`sp/labs-sp3.ts:73-75`). «Sin puerta»
   enseña aislamiento total, que es otra cosa (el air gap de sp3m2). Y en s04 dos de las tres reglas se pisan: «de la DMZ
   a la red interna: solo lo imprescindible, con regla» y «de la DMZ hacia dentro por su cuenta: nada» parecen decir una
   que sí y otra que no.
   Arreglo:
   - La imagen: la ventanilla no tiene puerta a las oficinas, solo una bandeja para pasar papeles, y detrás hay alguien
     que mira cada uno. Nadie cruza por ella.
   - s04, dos reglas: «de Internet a la DMZ: solo 443, al portal» y «de la DMZ a la red interna: solo lo imprescindible, con
     regla; nada más» (71, rótulo, no tarjeta).

6. **Conviene** · concepto 3, la imagen del jump server: «La sala de control con una sola puerta» (`:59`, s05 `:73`). En el
   canon de Halden la sala de control es la de Operaciones, la del muelle 3, donde trabaja Lucía y donde se incauta el SSD
   (`glass-harbor.md:39`, `:56`; es incluso el ejemplo de la regla 1 de la narración, `plan:55-56`), y en este mismo vídeo
   la OT es una zona distinta de la de gestión (s03, s07). Si gestión es «la sala de control», quien lo ve junta gestión y
   OT, que es lo que el concepto separa. Lo mismo, en pequeño, con el «edificio de control» de s08 (`:76`).
   Arreglo: «la sala de mandos de la red» o «el cuarto de cuadros», con su torno de tarjeta y PIN, y en s08, «el edificio
   de oficinas». En la lista de áreas de s02 (`:70`), la sala de control puede quedarse, pero como área de Operaciones, no
   como la puerta única.

7. **Conviene** · concepto 1 y la respuesta al mensaje de s02: «separa el cable» (`:57`, `:99`). Una VLAN no separa cables:
   la segmentación lógica es justo la que deja la red físicamente unida y la divide en VLAN (`sp/sp3-part1.ts:283`). Los
   riesgos de la ficha ya lo dicen bien («separa el tráfico», `fichas/V16-sp3m4-decisiones.md:60`); el concepto y la
   corrección no.
   Arreglo: «La VLAN aparta el tráfico, pero si el router lo pasa todo de una a otra, nadie decide qué cruza.»

8. **Menor** · s03, la confianza de la OT: «crítica, no de confianza» (`:71`). La lección dice «crítica, pero frágil (alta
   criticidad, no alta confianza)» (`sp/sp3-part2.ts:348`). «No de confianza» la pone al nivel de Internet y de invitados.
   Arreglo: «crítica, pero frágil».

9. **Menor** · mensaje de s02, «¿Cortafuegos entre VLAN? Ya tienen nombres distintos. Menos es más.» (`:98`). Nadie cree
   que un nombre separe nada; el error de verdad es creer que la VLAN ya basta. La corrección de la narradora no cambia.
   Arreglo: «¿Cortafuegos entre VLAN? Ya están separadas. Menos es más.» (58).

10. **Menor** · s09, tarjeta «Bloquear exige inline y active; un tap solo alerta» (`:88`). El tap no alerta: deriva una copia,
    y lo que alerta es el sensor que la recibe (`sp/sp3-part2.ts:409`).
    Arreglo: «Bloquear exige inline y active; en un tap, solo alerta» (54).

11. **Menor** · s09, «Los sensores del plan, en taps y puertos espejo» (`:77`) y la lista de lo aprobado (`:44-45`, `:163`).
    V1 ya tiene un sensor en un tap detrás del cortafuegos el 3-9 (`v1/narration.json:215`; la ficha cita `:213`, que es la
    línea del id). Si el plan los presenta como nuevos, quien vea V1 después ve un sensor que «aún no existía».
    Arreglo: «más sensores, en taps y puertos espejo», y la cita a `:215`.

12. **Menor** · Riesgo para el guion, no para la ficha: en el canon nuevo la ficha escribe «La narradora lo presenta»
    (`:169`). Es prosa de la ficha, pero quien escribe el guion la copia, y con ella el masculino.
    Arreglo: «La narradora presenta a BLIND ARCHITECT con…».

13. **Menor** · Laboratorios, «doce sistemas que el vídeo no coloca» (`:113-114`). Coloca tres casi literalmente: el portal
    (la web pública, `sp/labs-sp3.ts:63-65`), el jump server (`:108-110`) y las interfaces de gestión (`:113-116`). No es
    destripe, porque la tabla de la lección ya da los doce por filas (`sp/sp3-part2.ts:335-361`), pero la frase no es
    cierta.
    Arreglo: «nueve sistemas que el vídeo no toca; los otros tres ya los da la tabla de la lección».

Preguntas del encargo sin hallazgo: los días de la semana (16-11 lunes, 20-11 viernes, 1-12 martes, con Node). L. Ferrer
existe y ya es de Infraestructura (`sp/sp1-part3.ts:71`, V6). `fw-perimetro-01` y `rt-core` están en pantalla en el SIEM
(`siem/src/data/s08-triage.ts:14`, `siem/src/data/s02-collect.ts:78`); Producción, en `Topology.tsx:70`; Pruebas, en
`v5b/src/data/s03-simulacro.ts:10`. La nota de que V5 no tiene ninguna mejora de segmentación (`v5/src/data/s09-plan.ts:26-31`)
deja el rediseño como algo nuevo, sin culpa. Exactitud: fail-open y fail-closed, el sinónimo fail-secure, las puertas
(fail-safe se abre por la gente, fail-secure se bloquea por el activo, igual que `sp/placement-sp3.ts:104` y
`sp/sp3-cards.ts:25`), el cortafuegos de gestión fail-closed y el equipo de las bombas fail-open o fuera del camino
(`sp/sp3-part2.ts:383`, `:394-403`), inline frente a tap, active frente a passive, que el modo de fallo solo se decide en lo
que va en línea (`:389`, `:409`), la DMZ (`:337`) y el jump server en gestión con MFA y sesión grabada (`:355`, `:377`,
`:414`): todo correcto. Las dos barreras (la garita vacía de s02 y la que se queda arriba sin luz en s06) están bien
separadas en los riesgos. La q6 de la lección encaja con V16 mejor de lo que la ficha dice (ver «Entre fichas», punto 3).
La inserción, tras el último check y antes del párrafo puente (`sp/sp3-part2.ts:464-482`), no adelanta nada. Suite
`lesson videos`: el bloque no es de tipo `youtube` sino `t: 'video'` con su id de YouTube (la ficha dice «bloque
`youtube`», `:30-32`); lleva póster y transcripción en `public/`, sin compartir ninguno con otro vídeo
(`src/data/content.test.ts:313-326`), y su línea `expect(...).toBe('sp3m4')` en el test que fija cada vídeo en su lección
(`:267-284`), como V6 y V9.

---

## V17 · sp3m5 · «Por dónde se entra: 802.1X, VPN e IPSec»

1. **Conviene** · s01, la frase de puente: «La semana pasada, el puerto dividió su red en zonas, cada una con su control.»
   (`fichas/V17-sp3m5-ficha.md:37-38`). El puerto no la dividió: aprobó el plan el 20-11, por fases desde el 1-12
   (V16, canon nuevo), y la propia s02 de V17 dice «el plan aún no está en marcha» (`:60`).
   Arreglo: «La semana pasada, el puerto aprobó dividir su red en zonas, cada una con su control.» (16 palabras).

2. **Conviene** · s04 (`:62`). El Access-Accept enciende «las zonas de V16» y el portátil sin dar de alta recibe un reject
   «en la misma toma de s02». Todo eso pasa el 23-11, cuando ni las zonas ni 802.1X existen: los dos arrancan el 1-12
   (`:136-138`). Tal como está, la pantalla enseña 802.1X funcionando una semana antes de aprobarlo.
   Arreglo: s04 lleva una etiqueta fija, «con 802.1X · así será desde el 1-12» (35), y el reject no dice «en la misma
   toma», sino «en una toma con 802.1X».

3. **Conviene** · canon nuevo, el túnel entre la sede y la terminal (`:129-133`): «Que el túnel ya existía lo pide el SIEM,
   que enseña una estación de administración llegando a un servidor de la terminal en la misma red interna el 4-9».
   - Ninguna pantalla pone `srv-tc-app03` físicamente en la terminal. Su rótulo es «terminal de contenedores»
     (`siem/src/data/s08-triage.ts:25`), que puede ser a quién sirve; que la VLAN de producción es la red de la terminal
     solo lo dice un comentario del código (`siem/src/scenes/parts/s10-contain/Topology.tsx:19`), no la pantalla.
   - Y choca con V16, que cuelga la VLAN de Producción del router central de la sede (`fichas/V16-sp3m4-ficha.md:69`,
     `:146-148`). Si el SIEM «pide» que el servidor esté en la terminal, el plano de V16 está mal; si no, el túnel no lo
     pide nadie.
   - El túnel puede quedarse como canon nuevo: encaja con la lección (`sp/sp3-part3.ts:124`, `:184-186`) y no choca con
     nada. Lo que sobra es la deducción.

   Arreglo: «Ya existía (sin fecha de creación); encaja con el SIEM, que enseña la sede y la terminal dentro de la misma
   red interna» y en el registro: «la VLAN de Producción, la de `srv-tc-app03`, está en la sede (V16); la terminal de
   contenedores es otra sede, unida por el túnel (V17); qué equipos están físicamente en la terminal no consta». La q4 de
   la lección habla de «nueve terminales pequeñas» con circuitos dedicados (`sp/sp3-part3.ts:271`): son otras, y conviene
   apuntarlo para que nadie las mezcle con la de contenedores.

4. **Menor** · concepto 4 y s08, NAT (`:48`, `:66`). La ficha dice que TLS cruza NAT, proxies y redes que cortan todo lo
   demás, y que IPSec necesita sus propios protocolos. Bien. El riesgo está en el guion: «IPSec no cruza un NAT» sería
   falso. ESP lo cruza encapsulado en UDP 4500 (por eso sale el 4500 en pantalla); el que no sobrevive a un NAT es AH,
   porque protege también las direcciones, y eso no está en la lección. En el hotel, IPSec falla porque la red solo deja
   salir web y por un proxy (`sp/sp3-part3.ts:286`, `:295`).
   Arreglo: en la voz, la razón es la red que solo deja web, nunca el NAT. AH y NAT no se cuentan.

5. **Menor** · s08, «ESP · protocolo 50» (`:66`) y la cita de los riesgos (`fichas/V17-sp3m5-decisiones.md:49-50`). Es
   correcto, pero la lección no lo dice: la q5 habla de «its own IP protocol numbers» (`sp/sp3-part3.ts:295`). Solo en
   pantalla está bien.
   Arreglo: corregir la cita («correcto; la q5 no da el número»).

6. **Menor** · concepto 1, la imagen de la garita (`:45`, s03 `:61`). En V16 la garita es el control entre zonas (s02) y la
   barrera que se cae sin luz (s06); en V17 pasa a ser el switch que pregunta quién eres. Quien vea los dos seguidos tiene
   la misma garita haciendo tres cosas. Además, 802.1X está en la entrada, no entre zonas.
   Arreglo: «el control de la puerta del recinto», con el mismo vigilante al teléfono con la oficina de acreditaciones.

7. **Menor** · concepto 2, «Un pasillo cubierto entre dos edificios» (`:46`). La VPN existe porque el tráfico cruza una red
   que no controlas (`sp/sp3-part3.ts:124`), y un pasillo entre dos edificios vecinos no lo enseña.
   Arreglo: «un pasillo cubierto que cruza la calle». El nombre «pasarela» no sirve: en la ficha ya es el equipo de la VPN.

8. **Menor** · s02, la consola: «DHCP: 10.20.6.140» · «VLAN Oficinas · 3 s» (`:60`). Un portátil no ve en qué VLAN está; ve
   su dirección. La IP está libre (ningún archivo usa `10.20.6.140`) y la subred encaja con `a.soto` (`10.20.6.52`).
   Arreglo: «VLAN Oficinas» como nota de la analista, aparte de la salida de consola.

Preguntas del encargo sin hallazgo: los días (23-11 lunes, 25-11 miércoles, 27-11 viernes, 1-12 martes). 802.1X con sus
tres papeles (el switch transmite y obedece, RADIUS decide, `sp/sp3-part3.ts:72`, `:104`, q2 `:250`), EAP como marco y
EAP-TLS con certificado en los dos lados, la VLAN de cuarentena tras un reject (`:72`, `:102`), site-to-site frente a
remote access, AH sin confidencialidad y ESP con ella, transporte de equipo a equipo y túnel de pasarela a pasarela
(`:152`, `:184-186`), TLS por el 443 para el acceso remoto y full frente a split tunnel (`:124`, `:130-148`): todo correcto,
con buenas imágenes (la bolsa transparente con precinto frente a la caja cerrada; el camión dentro del contenedor). La
corrección del mensaje de s07 no dice que el modo transporte esté prohibido entre sedes (`fichas/V17-sp3m5-decisiones.md:50-52`),
que es lo exacto. `ptl-pruebas-02` es el portátil de pruebas (`siem/src/data/s04-enrich.ts:77`) que V5b aisló en un
simulacro el 8-10 (`v5b/src/data/s03-simulacro.ts:8-11`): usarlo después no choca. El NAC de V1 queda a salvo con «esta
toma no preguntaba» (`v1/src/scenes/S10Data.tsx:268-281`). Los laboratorios están bien esquivados (spl1c,
`sp/labs.ts:197-200`; spl2a, `sp/labs-sp2.ts:100`). La inserción antes de la nota de examen (`sp/sp3-part3.ts:205-220`) no
adelanta nada. Suite `lesson videos`: lo mismo que en V16 (bloque `t: 'video'` con id de YouTube, póster y transcripción
propios, y su línea `toBe('sp3m5')` en `src/data/content.test.ts:267-284`).

---

## Entre fichas

1. **Conviene · La voz de BLIND ARCHITECT frente a la de NULL CIPHER (las dos proponen Helena).**
   - **Helena encaja mejor con BLIND ARCHITECT que con NULL CIPHER.** El dosier de sp3 dice «BLIND ARCHITECT derrotada»
     (`sp/sections.ts:87`) y no hay ningún nombre femenino al que pueda ir pegado ese participio: el femenino es de
     BLIND ARCHITECT. En sp1, «NULL CIPHER neutralizada» (`:49`) puede concordar con «una célula» del anuncio (`:47`), como
     ya ve la ficha de V11 (`fichas/V11-sp1m6-decisiones.md:76-78`). Laura no sirve para BLIND ARCHITECT: es RED MARROW con
     `telefono`, y `megafonia` también es una banda recortada, así que sonarían parecidas.
   - **Compartir voz es inevitable:** hay tres voces SAPI y cinco adversarios en Security+. Lo que hay que evitar es que se
     confundan, porque dos adversarios que suenan igual sugieren justo lo que no se destripa, que GH es una sola operación
     (`sp/sections.ts:106`).
   - **Cómo tienen que diferir, en tres ejes, no en uno:**
     - textura: `cifrado` es digital y seco (bajar a ~11 kHz, ~6 bits y una puerta, `fichas/V11-sp1m6-decisiones.md:38-41`);
       `megafonia`, acústica (banda de bocina de 250 a 5000 Hz, `fichas/V16-sp3m4-decisiones.md:84-87`);
     - espacio: `cifrado` sin sala; `megafonia`, con la reverberación de hormigón;
     - ritmo: los dos presets dejan el tono de Helena sin tocar, así que la entonación sería la misma. Que lo cambie el
       ritmo: `"adversaryVoice": { "rate": -2 }` para BLIND ARCHITECT (un aviso por megafonía va despacio) y `0` para NULL
       CIPHER.
   - **Las reservas no se pueden repetir.** Las dos fichas proponen, si el efecto nuevo no llega, Helena con `machine`. Si
     las dos lo usan, suenan idénticas, y además `machine` es la textura de SILENT PAGER (cuatro semitonos abajo y anillo,
     `eng/scripts/adversary_fx.py:17-22`), como avisa la propia V11. V11 se graba antes y puede quedarse esa reserva; V16 se
     graba sola y más tarde, así que `megafonia` es requisito de su render, sin reserva. Antes de congelar V16, una
     prueba: la misma frase con los dos presets, una detrás de otra.
   - **Para PAPER GOVERNOR** (sp5) quedarán Pablo o Laura con un efecto nuevo: conviene apuntarlo ya en el registro.
   - **El género, sin contradicción.** Las decisiones de V16 dicen a la vez que el registro apunta «ella» porque lo dice
     el dosier (`fichas/V16-sp3m4-decisiones.md:89-90`) y que lo que fije la voz lo decide Lidia (ficha `:171-172`). Se
     resuelve como con RED MARROW: el registro anota que el dosier ya lo escribe en femenino y que la voz es Helena, y
     los textos de los vídeos no marcan el género. La pregunta para Lidia se queda en si la voz cuenta como canon.

2. **Conviene · Canon nuevo de V16 y V17 frente a todo lo demás.**
   - **Fechas y días:** todos correctos (ver cada vídeo). V11–V12 usan del 3 al 12-11, V10 tiene la MFA el lunes 30-11 y
     V16–V17 caen del 16 al 27-11 con las fases desde el martes 1-12: nada se pisa.
   - **V12 describe mal a V16:** «el borrador de V16 lo mueve a la DMZ a partir del 16-11» (`fichas/V12-sp1m7-ficha.md:141`).
     El 16-11 empieza el dibujo; se aprueba el 20-11 y se ejecuta por fases desde el 1-12. Arreglo en V12: «el plan de V16,
     aprobado el 20-11, lo llevará a la DMZ por fases desde el 1-12». La ficha de V11 lo dice bien (`:170-171`).
   - **«Nada delante» del portal (V10) frente a la regla 443 de V16.** El canon de V10 dice «no hay filtro ni nada delante
     del portal» (`plan:1477`); V16 enseña `fw-perimetro-01` con una regla de entrada al portal (s04). La voz publicada de
     V10 solo dice «Filtro, ninguno» (`v10/narration.json:178`), que sigue siendo cierto con un cortafuegos que solo mira
     puerto y dirección. Arreglo en el registro: «nada que mire dentro de la petición web (ni WAF ni filtro); delante, solo
     la regla 443 del cortafuegos del perímetro (V16)».
   - **El enlace de V10.** Con el portal en la sede, el «enlace de 1 Gb/s · 100 %» del 21-10 (`v10/src/data/s05-amp.ts:25`)
     es el del puerto, no uno del portal: esos 25 minutos se quedó sin Internet todo el puerto (deducido). Nadie lo dice
     ni lo contradice; al registro.
   - **El FINDING #0147, ahora dentro de Oficinas.** El escaneo del 1-9 da al portal una ejecución remota de código con
     exploit público (`sp/sp4-part3.ts:55-61`). Con V16, ese servidor estaba en la VLAN de Oficinas dos días antes del
     correo de Lucía, y el registro sigue sin saber cómo llegó el documento a `OPS-WS-08` y `ADM-WS-02`
     (`glass-harbor.md:286`). Ninguna de las dos fichas lo relaciona, y está bien. Al registro: «ningún vídeo relaciona el
     FINDING #0147 ni el traversal del 21-10 con el caso de septiembre ni con nada dentro de la red».
   - **V1, V5, V5b y V6:** nada choca más allá de los puntos 3 y 4 de V16. V6 usa a L. Ferrer en Infraestructura (como V16)
     y no toca la red. V5 no tiene ninguna mejora de segmentación, así que el rediseño es nuevo.

3. **Sin hallazgo en las fichas; conviene en el registro · Las contradicciones de las lecciones.**
   - **La OT: air-gapped, en el mismo switch o alcanzable desde la wifi de invitados.** Es verdad, y ya está en el
     registro (`glass-harbor.md:249-250`): los PLC de las esclusas están air-gapped (`sp/sp3-part1.ts:394`), cuelgan del
     mismo conmutador que la web (`sp/sp3-part2.ts:316`, `sp/labs-sp3.ts:21`, y la q6, `sp/sp3-part2.ts:564`), están «en
     la misma VLAN que las oficinas» según el anuncio del jefe (`sp/sections.ts:85`) y son alcanzables desde la wifi de
     invitados según el dosier (`:87`). Las dos fichas lo esquivan bien: el plano de antes no dibuja la OT, la zona OT sale
     en el plan sin decir de dónde viene y el equipo de las bombas va «en la red de las bombas». El cambio que propone V16
     para `sp3-part1.ts:394` (las grúas en lugar de las esclusas, como el check de `:288`) arregla la contradicción
     principal, pero hereda otra: la aislada pasaría a ser una red que ya choca con un servidor de control de grúas que
     lleva catorce meses hablando con un dominio de fuera (`sp/sp2-part1.ts:147`) y con las tabletas de las grúas en la
     wifi (`sp/sp4-part1.ts:384`). Sigue siendo la mejor opción; el registro debe apuntar las dos cosas.
   - **«Red plana» frente a las VLAN que ya se ven.** «Red plana» en la lección es la idea general (`:321`); lo de Halden es
     «del mismo conmutador» (`:316`) y la q6, «one flat VLAN». En pantalla ya hay VLAN y cortafuegos internos (V1, SIEM,
     V5b). La lectura de V16 (VLAN que el router central deja hablar entre sí: plana en la práctica, y todas cuelgan de
     `rt-core`, que hace de ese conmutador) es defendible. Y la q6 encaja mejor de lo que dice la ficha: la web pública y
     la ofimática de aduanas en una misma VLAN son el portal junto a los puestos de Importación («la oficina que trata con
     aduanas», `v6/src/data/s03-leaver.ts:7`); solo sobran los PLC. Al registro.
   - **La q7 frente al SIEM:** no es una contradicción. La q7 no tiene fecha y quiere que las dos redes funcionen como una
     sola red enrutada (`sp/sp3-part3.ts:316`); el SIEM enseña las dos direcciones dentro de `10.20.0.0/16`
     (`siem/src/data/s07-tuning.ts:40`, `s09-pivot.ts:37-39`, `s08-triage.ts:24`), que es lo que se ve con un túnel ya
     hecho. V17 la trata bien salvo la deducción de su punto 3.

4. **Sin hallazgo · La VPN, su «MFA» y el 30-11.** V17 no enseña ninguna pantalla de inicio de sesión de la VPN, ni
   factores, ni el nombre del servidor (`fichas/V17-sp3m5-ficha.md:145-149`), así que no contradice el check sin fecha de
   la contraseña con pregunta secreta (`sp/sp4-part4.ts:452`) ni la MFA del proveedor de identidad del 30-11
   (`v10/src/data/s03-mfa.ts:31`). El cambio a túnel completo desde el 1-12 es de Sistemas, igual que la MFA del IdP: no
   chocan. Dos líneas para el registro:
   - La autenticación de la VPN sigue sin fecha. Si un vídeo posterior fecha el check de `:452`, tiene que encajar con el
     27-11 de V17, en el que la VPN cambia de túnel sin que nadie toque cómo se entra.
   - `sp/sp4-part1.ts:384` (sin fecha, «este trimestre»): HALDEN-OPS pasa de WPA2 con clave compartida a WPA3-Enterprise
     con RADIUS y EAP-TLS, y las tabletas de las grúas ya tienen certificado. Encaja con el 802.1X cableado de V17, que no
     dice que el puerto no tuviera RADIUS. Que siga así.

5. **Menor · «Menos es más.» seis veces entre los dos vídeos.** Es una firma, como «Confía en mí» de RED MARROW, y está
   bien que se repita. Pero en dos vídeos seguidos del mismo jefe el revisor de naturalidad tiene que mirar dos cosas:
   que las respuestas de la narradora no se vuelvan fórmula, y que el mensaje de s07 de V17 («…menos cabeceras. Menos es
   más.») no suene a eco.

**Para el registro, cuando se cierren V16 y V17** (además del canon nuevo de cada ficha, con los arreglos de arriba):
- `fw-int01` es el cortafuegos interno de V1 (deducido); `srv-gis01` (`10.20.9.14`) queda detrás de él.
- La salida de Producción no pasaba por el cortafuegos de Operaciones (deducido de V16): el hueco de los 38 GB queda
  explicado, y ningún vídeo lo dice.
- La VLAN de Producción está en la sede; la terminal de contenedores es otra sede, unida por el túnel IPSec; qué equipos
  hay físicamente en la terminal no consta. Las «nueve terminales pequeñas» de la q4 son otras.
- El «nada delante» de V10 se precisa (punto 2); el enlace del 21-10 era el del puerto (deducido).
- El FINDING #0147 y el traversal no se relacionan con el caso ni con la red interna.
- La OT antes del plan: no consta cómo estaba conectada. La q6 encaja con la VLAN de Oficinas de V16, salvo los PLC.
- BLIND ARCHITECT: dosier en femenino (`sp/sections.ts:87`), voz Helena con `megafonia` y `rate` −2.
