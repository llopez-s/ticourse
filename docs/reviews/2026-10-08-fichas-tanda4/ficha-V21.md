### V21 · sp4m2 · Cápsula · «WPA3-Enterprise: de una clave para todos a una identidad para cada uno»

> Propuesta del 2026-10-08 (tanda 4), con las opciones recomendadas ya elegidas; falta que Lidia diga qué cambia. La versión
> vigente de escenas y guion será `video/wifi-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/wifi-halden/out/script-notes.md`. Las decisiones, con lo descartado y los riesgos, están en
> `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V20-V21.md` (apartado V21).
>
> **Orden del curso.** sp4m2 es la segunda lección de sp4, anterior a sp4m6 (el SIEM) y a sp4m7 (V1): quien sigue el curso
> ve V21 antes que cualquier otro vídeo de SILENT PAGER y antes del caso de septiembre. Por eso V21 no remite a ningún
> vídeo, no nombra el caso ni a Lucía, y presenta a SILENT PAGER desde cero, con la fórmula de V1 («cuenta con que tu SOC
> duerma»). Ni siquiera necesita V17: explica el modo enterprise entero, en una frase, sin los nombres de los tres papeles.
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`.

- **Carpeta:** `wifi-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo **4.1**
  (cabecera de la lección, `sp/sp4-part1.ts:266`) · adversario **SILENT PAGER** (sección sp4, `sp/sections.ts:101-106`), dos
  mensajes interceptados, con la voz de V1, V5 y V5b (`sapi/Microsoft Pablo`, `rate` 0, `machine`;
  `video/ir-halden-pruebas/narration.json:11-15`) · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · música `Go On Going - Stayloose.mp3` · en `video.json`,
  `"lesson": "sp4m2"` y `"adversary": "SILENT PAGER"`.
- **Etiquetas** (`video.json`, clave `"tags"`): WPA3, WPA2, SAE, four-way handshake, forward secrecy, WPA3-Enterprise, 802.1X,
  RADIUS, EAP-TLS, PEAP, site survey, heat map, seguridad wifi, Security+.
- **Efectos (`sfx`):** los automáticos del motor y cuatro momentos: `spill` («error», la señal llega al aparcamiento), `captured`
  («glitch», el portátil graba el apretón de manos), `sealed` («lock», SAE: la captura no sirve) y `reject` («block», la
  tableta revocada no entra).
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "secplus"`, `"adversary": "SILENT PAGER"`, `"lesson": "sp4m2"`, la música de arriba y los
  `"tags"` de arriba. Título de YouTube: «WPA3-Enterprise: de una clave para todos a una identidad para cada uno | CompTIA Security+ en
  español». Ritmo: `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3800.
- **Léxico** (se reutiliza lo que Lidia ya dice y lo nuevo se confirma al grabar, porque el importador ancla cada frase a
  lo que ella diga): ya fijados `RADIUS` («rádius»), `EAP` («eap»), `EAP-TLS` («eap te ele ese»), `TLS` («te ele ese»),
  `802.1X` («ochocientos dos punto uno equis»), `VLAN`; nuevos, con la lectura habitual en España: `WPA3` («uve doble pe a
  tres»), `WPA2` («uve doble pe a dos»), `SAE` («ese a e»), `PEAP` («píap»), `TTLS` («te te ele ese»), `PSK` («pe ese ca»),
  `PKI` («pe ca i»), `AAA` («a a a»). `four-way handshake`, `forward secrecy`, `heat map` y `site survey` se dicen en inglés.
- **Lo que se lee no se deletrea:** `HALDEN-OPS`, `tableta 07`, `ptl-pruebas-02`, las direcciones del punto de acceso y las
  líneas del registro de RADIUS van solo en pantalla; la voz dice «la red de las tabletas», «una tableta», «tu portátil de
  pruebas» y «el servidor RADIUS». Las notas en dBm sí se dicen («menos cincuenta y cinco»): son el dato. Ninguna excepción.
- **Duración:** suma de `s` **210 s** (6 escenas), la estructura de V10 y V12 (dos mensajes, una pregunta y escenas de
  consola): estimado ~260 s y **unos 235–250 s renderizados (unos 4:00)**, dentro de 190–260. No se rellena. La suma predice
  mal (0,89 en V5 y 1,22 en V4), así que el primer borrador se mide por los dos lados: si el estimado pasa de 255 s, se
  recorta primero s02 (la repetición del mapa de calor, solo en pantalla) y luego s05 (la pantalla del punto de acceso
  falso, que se queda en media frase); si se acerca a 190 s, se alarga s03, la escena más densa. s03 es la escena crítica
  (el apretón de manos, el ataque sin conexión, SAE y forward secrecy en 50 s): si no cabe, el forward secrecy pasa a una
  frase y un rótulo.
- **Inserción:** en `sp/sp4-part1.ts`, lección sp4m2, entre el check de WPA3-Enterprise (`:310-324`) y el encabezado
  «Movilidad: MDM y los modelos BYOD, COPE y CYOD» (`:325`), como bloque `t: 'video'` con su id de YouTube, su póster y su
  transcripción propios en `public/`, precedido de una línea: «Antes de pasar a los móviles, míralo en la terminal: hasta dónde
  llega la señal, qué se lleva quien la escucha y qué cambia con WPA3». Todo lo que enseña el vídeo va antes en la lección: el
  site survey y el heat map (`:285-304`), WPA3, SAE, el modo enterprise y EAP (`:305-309`) y el check de enterprise
  (`:310-324`). **El vídeo llega antes que el recuadro de Halden de la lección** (`:380-385`, «Tres hallazgos de la auditoría de
  este trimestre»): lo que ese recuadro cuenta en presente («pasa a WPA3-Enterprise», «se bajan dos antenas»), el vídeo lo
  fecha y lo cuenta con detalle; no contradice nada, y se propone aparte dar fecha al recuadro (decisiones). Se fija en la
  suite `lesson videos` de `src/data/content.test.ts` (`:248`), con su línea `toBe('sp4m2')` en el test que ata cada vídeo
  a su lección.
- **Enfoque («una clave que sabe toda la terminal»):** lunes 14-12, revisión de campo de la auditoría del trimestre (la de
  la lección, `sp/sp4-part1.ts:384`). Recorres la terminal con el portátil de pruebas: el mapa de calor deja la señal de
  la red de las tabletas de las grúas, HALDEN-OPS, a −55 dBm en el aparcamiento de visitantes, y la red sigue en WPA2 con una
  clave que sabe toda la terminal y que no cambia desde 2022. Qué se llevaría quien la escucha, lo enseñas **tú misma,
  con una prueba autorizada en un punto de acceso de pruebas con la misma configuración** (nada se ataca en la red de
  verdad, ni sale ninguna clave de verdad). Tres movimientos: bajar lo que se oye fuera (el martes 15-12 Infraestructura
  baja la potencia de dos antenas y las gira hacia dentro, y el miércoles 16-12 la segunda medición deja −78 dBm), hacer
  que lo que se oiga valga poco (SAE) y quitar la clave que todos comparten (modo enterprise con EAP-TLS, decidido ese
  mismo día y con fecha de ejecución el martes 22-12, a cargo de Infraestructura). SILENT PAGER trae dos atajos de manual, sin atacar nada. Registro: auditoría y
  prueba de laboratorio; la mejora de fondo, en futuro. Sin frase de puente: el vídeo no continúa ningún otro.

**Conceptos (3) y su imagen:**

Las tres imágenes salen del propio puerto o de la vida diaria y no se mezclan con las de V16 y V17 (valla, garita, puerta del
recinto, aduana, ventanilla): un foco, un candado de combinación y el carné de cada uno. Nada de llaves ni de puertas para las
claves, que ya son otras cosas en el canal.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | La señal que se escapa (over-reach). El site survey mide la cobertura real y el heat map la dibuja, con dos problemas opuestos: las zonas sin cobertura y, el que interesa a seguridad, la señal que llega al aparcamiento, a la calle o al barco de enfrente. Se arregla con **colocación y potencia**: reubicar antenas, bajar la potencia, orientarlas hacia dentro. No con una clave más larga y no ocultando el SSID, que se descubre en cuanto un cliente legítimo se conecta (`sp/sp4-part1.ts:288`, check `:290-304`, q1) | Un foco del muelle que alumbra también al vecino de enfrente. No arreglas el foco poniéndole una cerradura ni tapando su etiqueta: lo bajas y lo giras hacia dentro | «Cobertura fuera del perímetro: colocación y potencia» |
| 2 | WPA3 personal frente a WPA2-PSK. En WPA2-PSK, quien captura el **four-way handshake** se lo lleva y prueba millones de claves **sin conexión** hasta acertar, sin que la red se entere. **SAE** (Simultaneous Authentication of Equals) sustituye ese apretón: capturarlo no sirve, cada intento exige hablar con la red, y además da **forward secrecy**: averiguar la clave hoy no abre el tráfico grabado ayer. Sigue siendo una clave compartida (`:308`, q2) | Un candado de combinación. En WPA2 es como si pudieras desmontarlo y llevártelo a casa a probar combinaciones sin que nadie te vea; con SAE el candado está atornillado a la taquilla del muelle y solo se prueba allí, uno a uno y a la vista | «SAE: frena el ataque offline y da forward secrecy» |
| 3 | Modo enterprise y método EAP. En lugar de una clave compartida, cada usuario o dispositivo se autentica individualmente contra un servidor AAA, normalmente RADIUS, con 802.1X: identidad en los registros, revocación individual sin cambiar nada al resto, políticas por perfil. El precio: un servidor RADIUS, un directorio y, si hay certificados, una PKI. El método lo pone EAP: **EAP-TLS** (certificado en el servidor y en el cliente, autenticación mutua, sin contraseñas) es el más fuerte; **PEAP** y **EAP-TTLS** llevan las credenciales dentro de un túnel TLS y dependen de que el cliente **valide el certificado del servidor**, o un punto de acceso falso las recoge a la primera (`:308`, check `:310-324`, q3) | El código de la escalera frente al carné de cada uno. Con la clave compartida, es el código de la escalera que sabe todo el edificio: echar a uno exige cambiarlo para todos. Con el modo enterprise, cada uno lleva su carné y se anula solo el que se pierde | «Modo enterprise: 802.1X y RADIUS, identidad individual» · «EAP-TLS, el más fuerte; PEAP exige validar al servidor» |

**Escenas:** seis, en tres capítulos (Lo que se oye fuera · De una clave a una identidad · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Una clave para toda la terminal» | I Lo que se oye fuera | 22 | Sello «14-12 · lunes · auditoría del trimestre · wifi de la terminal». Dos hallazgos en dos tarjetas: «la señal llega al aparcamiento de visitantes · −55 dBm» y «HALDEN-OPS · WPA2 · una clave que sabe toda la terminal · sin cambiar desde 2022». La primera frase dice el problema en llano («La clave del wifi de las tabletas la sabe toda la terminal, y lleva sin cambiar desde 2022»); al acabarla, título «WPA3» (hacia los 8 s, siempre antes de los 12) y la promesa en tres chips: «hasta dónde llega la señal · qué se lleva quien la escucha · una identidad para cada uno». Entra la etiqueta «SILENT PAGER · sección 4» con «cuenta con que tu SOC duerma» | La promesa en los primeros 10 s: dos hallazgos, una señal que se escapa y una clave de todos · `audit, findings, title, promise, adversary` |
| s02-foco «Un foco que alumbra al vecino» | I | 36 | El plano de la terminal con el mapa de calor: rojo y naranja dentro, y una mancha que sale del límite de la terminal hasta el aparcamiento de visitantes (`spill`). El portátil de pruebas en el aparcamiento enseña la lista de redes que oye: «HALDEN-OPS · WPA2 · −55 dBm». La imagen: un foco del muelle que alumbra también la casa de enfrente. Nombres SITE SURVEY y HEAT MAP. Mensaje interceptado. Respuesta: dos tachados, «ocultar el nombre» («se ve en cuanto una tableta se conecta») y «una clave más larga» («no baja la señal»). Lo que sí: «colocación y potencia»; el 15-12 dos antenas bajan potencia y giran hacia dentro, y el 16-12 la segunda medición deja el aparcamiento en «−78 dBm»: «se oye menos, pero se oye». Cierre del capítulo con la pregunta que abre el siguiente: ¿y lo que aún se oiga? | La fuga es un problema de colocación y potencia; ocultar el SSID no es un control y la clave no baja la señal · `survey, spill, scan, floodlight, hide, fix, remeasure, still` · **intercept** |
| s03-apreton «El apretón de manos» | II De una clave a una identidad | 50 | Rótulo fijo: «prueba autorizada · punto de acceso de pruebas · misma configuración que HALDEN-OPS · clave de prueba, corriente a propósito». Una tableta de pruebas se conecta y el four-way handshake se dibuja como cuatro intercambios entre la tableta y el punto de acceso; tu portátil de pruebas, cerca, los graba: «captura · 1 handshake» (`captured`). Se lleva el archivo «a casa» (otra pantalla, «sin conexión con la red»): contadores «claves probadas · 38.000.000» y, en el punto de acceso, «intentos recibidos · 0», **sin tiempos ni velocidades**, sin nombre de adaptador ni de modo de captura. El contador sigue y la escena **no enseña ningún resultado**: la voz dice qué pasaría («con una clave corriente acabaría acertando; una larga y aleatoria aguanta»). Nombres FOUR-WAY HANDSHAKE y OFFLINE. La imagen: el candado de combinación que te llevas a casa. Segunda mitad, WPA3 personal: el mismo intercambio, ahora con SAE (SIMULTANEOUS AUTHENTICATION OF EQUALS): el portátil graba y no tiene nada que probar; cada intento tiene que hacerse contra el punto de acceso, uno a uno y a la vista (`sealed`), con el candado atornillado a la taquilla. Una cinta del tráfico grabado ayer: con WPA2, la clave averiguada hoy la abre; con SAE sigue cerrada: FORWARD SECRECY. Rótulo final: «sigue siendo una clave para todos» | Quien captura el apretón de WPA2 lo ataca sin conexión; SAE lo impide y da forward secrecy; la clave sigue compartida · `lab-stamp, handshake, captured, offline, padlock, sealed, one-by-one, tape, still-shared` |
| s04-enterprise «La clave de todos» | II | 40 | La clave compartida, en un cartel: «HALDEN-OPS · una clave · toda la terminal · sin cambiar desde 2022». Mensaje interceptado. Respuesta: una clave larga ayuda contra el diccionario, pero sigue siendo la misma para todos: no sabes quién entra y no puedes echar a uno sin cambiarla en todos los demás. La imagen: el código de la escalera que sabe todo el edificio. Ejemplo (rotulado «ejemplo · sin fecha»): «si una tableta se pierde». Con la clave compartida, hay que cambiarla en todas las demás. Con el modo enterprise, el registro de RADIUS: «tableta 07 · EAP-TLS · certificado válido · Access-Accept»; «ejemplo: certificado de la tableta 07 revocado»; «tableta 07 · Access-Reject» (`reject`); «tableta 08 · Access-Accept». La imagen: cada uno con su carné. Nombres WPA3-ENTERPRISE, con «802.1X · RADIUS (AAA)» debajo. Tres chips con lo que hace falta: «servidor RADIUS · directorio · PKI». El sello: «HALDEN-OPS a WPA3-Enterprise · EAP-TLS · Infraestructura · 22-12» | Una identidad por usuario o dispositivo: registros por persona y revocación individual · `shared, long-key, lost, accept, revoke, reject, aaa, needs, decision` · **intercept** |
| s05-eap «Dos formas de entrar» | II | 42 | Dos carriles para la misma conexión. Primero, solo los títulos: «PEAP · TTLS» y «EAP-TLS». Pregunta para pensar, con dos botones: «PEAP» y «EAP-TLS». Respuesta: EAP-TLS, porque las tabletas ya tienen certificado (el dato de la lección) y se puede pedir lo más fuerte. Luego los carriles se llenan. PEAP: «usuario y contraseña dentro de un túnel TLS · certificado solo en el servidor»; la advertencia en grande, «el cliente tiene que validar el certificado del servidor». Un punto de acceso falso, dibujado fuera de la terminal y rotulado «hipótesis», con el mismo nombre de red: si la tableta no valida, recoge sus credenciales a la primera (el dibujo dice «credenciales», no «contraseña»). EAP-TLS: «certificado en la tableta y en el servidor · autenticación mutua · no hay contraseña que robar». Nombre EAP | EAP-TLS pide certificados en los dos lados y es el más fuerte; PEAP y TTLS dependen de validar el certificado del servidor · `lanes, think, answer, peap, validate, fake-ap, tls, mutual, wrap` · **think** |
| s06-recap «Tres reglas» | III Para el examen | 20 | Tres tarjetas de reglas, cada una con su icono (el foco · el candado atornillado · el carné); tarjeta final Alertópolis: «Tu turno: termina la lección y sus preguntas» | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 4.1), una por escena de s02 a s05, cada una con su cue antes de la última frase de la
  escena (`examTiming: sentence-end`):
  - «Cobertura fuera del perímetro: colocación y potencia» (s02) (52)
  - «SAE: frena el ataque offline y da forward secrecy» (s03) (49). «Frena», no «elimina»: SAE impide el diccionario
    sin conexión, pero se puede seguir adivinando contra la red, uno a uno.
  - «Modo enterprise: 802.1X y RADIUS, identidad individual» (s04) (54)
  - «EAP-TLS, el más fuerte; PEAP exige validar al servidor» (s05) (54). Repite a propósito la idea de la tarjeta de V17
    («802.1X con certificados en los dos lados: EAP-TLS») y añade lo que V17 deja solo en pantalla: la condición de PEAP.
- **Pregunta para pensar** (`holdMs` 4500): «Tabletas con certificado: ¿PEAP o EAP-TLS?» (s05) (42). Llega con los dos carriles
  solo con su título, para que el dibujo no la conteste. Respuesta: EAP-TLS. Las tabletas ya tienen certificado, así que el
  puerto puede pedir autenticación mutua y quitar las contraseñas de en medio; PEAP es lo razonable cuando no hay
  certificados de cliente, y más fácil de desplegar, pero más débil (`sp/sp4-part1.ts:308`, q3 `:422-435`).
- **Mensajes interceptados** (SILENT PAGER, `holdMs` ~3800; uno por capítulo en I y II, ninguno en el cierre; tutea a la
  analista y cierra con ironía, como en V1 y V5b; no ataca nada ni dice dónde está; no usa «Duerme tranquila» (es de V5b) ni
  «De nada» (V5 y V18)):
  - s02: «Oculta el nombre de la red. Si no la ven, no existe.» (52). El error que corrige la narradora: creer que
    ocultar el SSID es un control. El nombre se descubre en cuanto un cliente legítimo se conecta y la señal sigue
    llegando al aparcamiento; lo que se arregla es la cobertura (`sp/sp4-part1.ts:288`, check `:290-304`).
  - s04: «Una clave larga para toda la terminal. Qué elegante.» (52). El error: dar por resuelto un problema de
    identidad con una clave mejor. Una clave larga ayuda contra el diccionario, pero sigue siendo una para todos: no hay
    nombres en los registros y no se puede revocar a uno sin cambiarla en todos (`:308`, check `:310-324`).
- **Cierre:** tres reglas y una sola tarea.
  1. Si la señal se escapa, colocación y potencia. Ni una clave más larga ni ocultar el nombre.
  2. WPA3 cambia el apretón de manos de WPA2 por SAE: frena el ataque sin conexión y da forward secrecy. Pero la clave sigue
     siendo de todos.
  3. Una identidad para cada uno: modo enterprise con 802.1X y RADIUS. EAP-TLS, con certificados en los dos lados, es lo más
     fuerte; PEAP y TTLS exigen que el cliente valide el certificado del servidor.

  Tarea: terminar la lección y sus preguntas. El vídeo va a mitad de sp4m2, antes de los móviles y de las aplicaciones
  (`:325-379`); de las siete preguntas, las q1, q2 y q3 tocan lo que cuenta el vídeo y las q4 a q7 (CYOD, MDM, validación de
  entrada y cookies) tratan de lo que viene después.
- **Se queda fuera** (sigue en la lección):
  - Las zonas sin cobertura y la interferencia (`sp/sp4-part1.ts:287-288`): solo sale la fuga, que es la que interesa a
    seguridad.
  - MDM, containerization, remote wipe, jailbreak y los modelos BYOD, COPE y CYOD, y los métodos de conexión (`:325-368`; quiz
    q4 y q5).
  - La seguridad de aplicaciones (`:375-379`; quiz q6 y q7): validación de entrada, secure cookies, SAST y DAST y code signing.
    Es el vecindario de V19 (sp2m4) y del tercer hallazgo del recuadro de Halden, y el vídeo ni lo cuenta ni lo numera.
  - Los tres papeles de 802.1X (supplicant, authenticator y authentication server) y EAPOL, que cuenta V17; en V21, «el
    punto de acceso pregunta al servidor RADIUS».
  - WPA3-Enterprise de 192 bits, PMF y la protección de las tramas de gestión: no están en la lección.
- **Laboratorios:** ninguno de sp4 toca la seguridad inalámbrica (`sp/labs-sp4.ts`: spl4a Log Hunt, spl4b Incident Response
  Drill, spl4c Vulnerability Triage), así que no hay solución que destripar. Una precaución fuera de la sección: spl2a
  clasifica a un jefe de operaciones que enchufa un router wifi sin registrar en la red del patio «para que su equipo use
  tabletas» y que TI solo encuentra en un «wireless survey» (`sp/labs-sp2.ts:119-121`, shadow IT). **El survey de V21 no
  encuentra ningún aparato ni ningún router sin registrar**, y la voz no habla de shadow IT ni de nadie que instale redes.
- **Lo que enseñan las pantallas de la prueba** (precaución de producción): los contadores y rótulos de s03 no nombran
  ninguna herramienta, ni listan palabras ni enseñan una clave encontrada. La prueba es con un punto de acceso de pruebas y
  una clave de prueba; el vídeo no es una receta contra una red real.

**Canon nuevo que fija V21** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-12-14 (lunes): revisión de campo de la auditoría del trimestre.** La analista (segunda persona, sin nombre) recorre
  la terminal con el portátil de pruebas: el mapa de calor deja **−55 dBm** en el aparcamiento de visitantes (el dato de la
  lección, `sp/sp4-part1.ts:384`) y la lista de redes que oye allí incluye **HALDEN-OPS**, en WPA2. Esa red, la de las
  tabletas de las grúas, comparte una sola clave entre toda la terminal, sin cambiar desde 2022 (también de la lección).
  No se dice quién hace la auditoría ni quién conoce la clave. Sin culpables: «creció así».
- **Prueba autorizada de la analista, en laboratorio:** un punto de acceso de pruebas con la configuración de HALDEN-OPS
  (WPA2-PSK, clave de prueba corriente a propósito). Captura de un handshake y un ataque de diccionario sin conexión con
  contadores inventados (38.000.000 de claves probadas, sin tiempo ni velocidad) que no encuentran ni enseñan ninguna clave, ni de verdad ni de prueba. **No se ataca
  HALDEN-OPS ni ninguna red real, y no sale ninguna clave real.**
- **2026-12-15 (martes): Infraestructura baja la potencia de dos antenas y las gira hacia el interior**, y el
  **2026-12-16 (miércoles)** la segunda medición deja el aparcamiento de visitantes en **−78 dBm**: «se oye menos, pero se
  oye». Concreta el «se bajan dos antenas de potencia y se giran hacia el interior» de la lección.
- **Mejora con responsable y fecha: «HALDEN-OPS a WPA3-Enterprise · EAP-TLS · Infraestructura · 22-12»** (martes), la del
  recuadro de la lección, que dice «pasa a WPA3-Enterprise con RADIUS y EAP-TLS para las tabletas de las grúas, que ya tienen
  certificado» sin fecha. **Desde el 22-12**, la red de las tabletas pasa a WPA3-Enterprise con EAP-TLS; hasta entonces sigue en WPA2
  con su clave compartida. Ningún vídeo la enseña cumplida.
- **Las tabletas «ya tienen certificado»** (el dato de la lección, en presente): el vídeo no dice quién se lo emitió, ni
  cuándo, ni con qué CA.
- **El ejemplo de la tableta perdida** (s04) es hipotético y está rotulado «ejemplo · sin fecha». No ha pasado, ni se ha
  revocado nada. Sus nombres, **«tableta 07» y «tableta 08»**, son nuevos y solo salen en pantalla, dentro del ejemplo; no son
  equipos del puerto ni de ningún registro.
- **SILENT PAGER**, con el registro y la voz de V1, V5 y V5b: tutea y cierra con ironía; sin IP, dominio ni equipo; solo da
  consejos equivocados.
- **Comprobado contra la cronología:** 14-12 lunes, 15-12 martes, 16-12 miércoles y 22-12 martes (Node). Queda después de todo
  lo fechado de Halden hasta ahora (V16–V17 del 16 al 27-11, la MFA del 30-11, el 1-12 del plan de zonas) sin tocarlo, y
  dentro del trimestre («este trimestre» de la lección).

**No se toca:**
- **El dosier de SILENT PAGER** (`sp/sections.ts:106`): el ASN de NULL CIPHER, el movimiento lateral con cuentas de servicio,
  los logs sin centralizar, «GH es una sola operación». SILENT PAGER no tiene aquí IP, dominio ni equipo, ni dice que esté
  en el aparcamiento, ni que haya oído o capturado nada: son consejos, no un ataque. Y nada de lo de V21 es un incidente.
- **El aparcamiento de RED MARROW** (`sp/sections.ts:63-68`: «USB en el aparcamiento»): el aparcamiento de visitantes sale solo
  como el sitio donde se mide la señal, y nadie aparca ni deja nada allí. Tampoco los kits contra los operadores de grúas
  (`:68`): las tabletas son «las tabletas de las grúas» de la lección, y la palabra «operadores» no sale.
- **El dosier de BLIND ARCHITECT y la OT** (`sp/sections.ts:87`): la wifi de invitados no sale ni se dibuja; HALDEN-OPS no
  tiene ninguna línea hacia PLC, esclusas ni zonas; el vídeo no dice a qué red llegan las tabletas ni qué hacen (no son el
  control de las grúas, que la lección aísla, `sp/sp3-part1.ts:288`; el servidor de planificación de grúas, R-014, y el
  servidor de control que habla con un dominio de fuera, `sp/sp2-part1.ts:147`, tampoco salen).
- **El caso `IR-2026-0147`** (3-9 y 4-9) y sus equipos; Lucía; el portal de reservas y la noche del 21-10; el FINDING #0147.
- **El dosier de NULL CIPHER:** ningún lector de badges, ningún autofirmado instalado como raíz. EAP-TLS sale como concepto,
  con «certificado de la tableta» y «certificado del servidor»: ninguna CA con nombre, ninguna raíz que se instale en
  nadie y ninguna «temporal». La CA interna del puerto sigue sin definir (V11–V12) y su raíz, si hiciera falta mencionarla,
  «la reparte el puerto».
- **V17:** el 802.1X de los switches de la planta de oficinas, el NAC de V1 y la VPN no salen; V21 no dice si el puerto tenía
  o no un servidor RADIUS antes del 22-12, ni desde cuándo. «Un servidor RADIUS» a secas.
- **Contratistas, proveedores y auditores externos:** ninguno en ninguna escena (PAPER GOVERNOR, `sp/sections.ts:125`; RED
  MARROW, `:68`). Ni shadow IT ni routers sin registrar (spl2a).
- **El tercer hallazgo del recuadro** (el portal de declaración de carga, `sp/sp4-part1.ts:384`) y todo lo de aplicaciones:
  vecindario de V19.
- **Una señal a −55 dBm no se presenta como un incidente.** Nada indica, ni se dice, que alguien hubiera capturado nunca el
  handshake de HALDEN-OPS; el vídeo no lo afirma ni lo niega.
- **Palabras:** «carné», nunca «badge» ni «pase» (dosier de NULL CIPHER, V6); «el código de la escalera», nunca «del portal» (el portal es el de reservas); no «valla y garita» juntas.
- No se culpa a nadie de la clave de 2022 ni de la cobertura: «creció así».

**Comprobación de límites** (perfil `capsula-yt`; recuento con Node, `[...texto].length`, por un script que lee esta ficha):
- Duración: suma 210 s; render esperado 235–250 s, dentro de 190–260. Los extremos conocidos (0,89 y 1,22 veces la suma)
  dan 187–256 s: el alto cabe; el bajo queda 3 s por debajo del mínimo, pero V10 y V12, con la misma estructura,
  estimaron por encima de su suma, así que se espera lo contrario. Si el primer borrador se acerca a 190, se alarga s03.
- 6 escenas en 3 capítulos (máximo 3). 3 conceptos (2–3).
- 4 tarjetas de examen (3–5), una por escena de s02 a s05, ninguna en la última; de 49 a 54 caracteres (máximo 58), sin
  `{}[]|<>`, flechas, marcas, viñetas ni emoji.
- 1 pregunta para pensar (exactamente 1), 42 caracteres (máximo 48), `holdMs` 4500.
- 2 mensajes interceptados (1–2), uno por capítulo (I y II), ninguno en la escena final; 52 y 52 caracteres (máximo 70);
  `holdMs` ~3800 (2500–4500); `video.json` lleva `"adversary": "SILENT PAGER"`.
- `wordBudget` por escena (`s` × 2,7): s01 59 · s02 97 · s03 135 · s04 108 · s05 113 · s06 54 (total 566).
- Sin identificadores en la voz: HALDEN-OPS, el nombre de la tableta («tableta siete») y `ptl-pruebas-02` solo en pantalla
  (la voz dice «la red de las tabletas» y «tu portátil de pruebas»). Siglas en voz que necesitan léxico: WPA3, SAE, EAP,
  PEAP, TTLS, TLS, PSK, PKI, AAA, RADIUS (ya fijada: «rádius»).
- El título entra antes de los 12 s (s01: una frase corta y el título).
