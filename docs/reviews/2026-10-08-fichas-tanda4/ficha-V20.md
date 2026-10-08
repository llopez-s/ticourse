### V20 · sp1m3 · Cápsula · «Zero Trust: quién decide, quién comunica y quién aplica»

> Propuesta del 2026-10-08 (tanda 4), con las opciones recomendadas ya elegidas; falta que Lidia diga qué cambia. La versión
> vigente de escenas y guion será `video/zero-trust-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/zero-trust-halden/out/script-notes.md`. Las decisiones, con lo descartado y los riesgos, están en
> `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V20-V21.md` (apartado V20).
>
> **Orden del curso.** sp1m3 va antes que sp1m6 y sp1m7, así que quien sigue el curso ve V20 antes que V11 y V12: es lo
> primero de Halden que ve en sp1 y la primera aparición de NULL CIPHER *en su orden*, aunque V11 la estrene en la
> cronología. Por eso V20 no remite a ningún otro vídeo, no nombra el caso de septiembre y presenta el puerto y a NULL CIPHER
> desde cero, con la fórmula de V11.
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`, `v1/` = `video/capas-halden/`.

- **Carpeta:** `zero-trust-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo
  **1.2** (cabecera de la lección, `sp/sp1-part2.ts:4`) · adversario **NULL CIPHER** (sección sp1, `sp/sections.ts:43-50`),
  dos mensajes interceptados, con la voz con que se publicó V11 (`sapi/Microsoft Helena`, `rate` 0 y `cifrado`; la misma que
  V12: una sola voz por adversario, para siempre) · voz `recording/lidia` con `"recording": { "tempo": 1.08, "maxPauseMs": 250 }`
  · música `Go On Going - Stayloose.mp3` · en `video.json`, `"lesson": "sp1m3"` y `"adversary": "NULL CIPHER"`.
- **Etiquetas** (`video.json`, clave `"tags"`): Zero Trust, never trust always verify, control plane, data plane, policy engine,
  policy administrator, policy enforcement point, PEP, PDP, adaptive identity, threat scope reduction, NIST SP 800-207,
  Security+.
- **Efectos (`sfx`):** los automáticos del motor y cuatro momentos: `order` («lock», el encargado pasa la orden al mozo),
  `grant` («check», petición 1 concedida), `step-up` («ding», el engine pide un segundo factor) y `revoke` («block», la
  sesión se cierra).
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "secplus"`, `"adversary": "NULL CIPHER"`, `"lesson": "sp1m3"`, la música de arriba y los
  `"tags"` de arriba. Título de YouTube: «Zero Trust: quién decide, quién comunica y quién aplica | CompTIA Security+ en
  español». Ritmo: `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3800.
- **Léxico** (se reutiliza lo que Lidia ya dice y lo nuevo se confirma al grabar): ya fijados `TLS` («te ele ese»), `EDR`
  («e de erre»), `NULL` («nal»), `CIPHER` («sáifer»); nuevos, con la lectura habitual en España: `PEP` («pep»), `PDP`
  («pe de pe»), `ERP` («e erre pe»), `NIST` («nist»). `policy engine` y `policy administrator` se dicen en inglés, como
  `account lockout` en V10, y siempre después de la idea en llano («el que decide… es el policy engine»).
- **Lo que se lee no se deletrea:** `erp.local`, la regla del cortafuegos, la política y los campos de la petición van solo
  en pantalla; la voz dice «el ERP», «la regla de Operaciones», «un portátil del puerto» y «una cuenta de prueba».
  `SUBJECT/SYSTEM` y `IMPLICIT TRUST ZONE` son rótulos, no frases habladas. Ninguna excepción.
- **Duración:** suma de `s` **210 s** (6 escenas), la misma que V12, que tiene la misma estructura (dos mensajes, una
  pregunta, dos escenas de consola): estimado ~260 s y **unos 235–250 s renderizados (unos 4:00)**, dentro de 190–260. No se
  rellena. La suma predice mal (V5 salió a 0,89 veces la suya y V4 a 1,22), así que el primer borrador se mide por los
  dos lados: si el estimado pasa de 255 s, se recorta primero s04 (la política, solo en pantalla, sin leerla) y luego s02;
  si se acerca a 190 s, se alarga s03, la escena que más cuenta.
- **Inserción:** en `sp/sp1-part2.ts`, lección sp1m3, entre el check de adaptive identity (`:157-171`) y el párrafo que baja
  a la seguridad física (`:172-175`), como bloque `t: 'video'` con su id de YouTube, su póster y su transcripción propios en
  `public/`, precedido de una línea: «Antes de pasar a lo físico, míralo en el puerto: una petición al ERP y quién decide qué».
  Todo lo que enseña el vídeo va antes en la lección: el contraste con el perímetro (`:19-48`), los dos planos y sus
  componentes (`:49-85`), el flujo y el ejemplo (`:101-131`), la nota de examen (`:132-137`), los dos checks (`:86-100`,
  `:138-152`) y los matices de adaptive identity y threat scope reduction (`:153-171`). El vídeo **repasa en el puerto**
  lo que ya has leído. **Es casi un repaso uno a uno del ejemplo de la lección** (`:126-131`: ubicación inusual, segundo factor, solo lectura, token de 30 minutos y EDR a los diez minutos), con otra cuenta y **el mismo ERP**. Lo que aporta de más, que es poco pero es lo que lo hace un vídeo: la regla de V1 como «antes» (hoy se decide por el origen), un simulador donde se ve cada decisión con sus campos, los tres verbos como tres personas con un papel que caduca, y la revocación contada paso a paso; no adelanta nada que la lección no diga. Se fija en la suite
  `lesson videos` de `src/data/content.test.ts` (`:248`), con su línea `toBe('sp1m3')` en el test que ata cada vídeo a su
  lección.
- **Enfoque («tres peticiones al ERP»):** viernes 13-11, el día siguiente al último hecho de V12 y el fin de semana antes de
  que empiece el rediseño de la red de V16. Hoy, llegar al ERP depende de una línea del cortafuegos que mira de dónde vienes
  (la regla de V1, «Operaciones a `erp.local` por 443», sin citarlo). Seguridad ha escrito en papel cómo se decidiría el
  acceso si cada petición se verificara, y tú la pruebas en un simulador de políticas: **no funciona nada, el ERP no se
  toca**. Tres peticiones de una cuenta de prueba: la normal, la misma cuenta desde otro país a las tres de la madrugada, y
  un aviso del EDR a los diez minutos. NULL CIPHER trae dos atajos de manual. Registro de diseño y simulación, como el «plan»
  de V16: lo que el motor «decidiría», «pediría», «cerraría»; nada «ya funciona». Sin frase de puente: el vídeo no continúa
  ningún otro y se entiende solo.

**Conceptos (3) y su imagen:**

La imagen sale del almacén de un puerto, no de la valla, la garita ni la puerta del recinto (que ya son V16 y V17): un
mundo de pedidos y mercancía, con tres personas y un papel.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Dentro no es de fiar. El modelo de perímetro decide una vez, en el borde, y después confía; el atacante que roba una credencial o compromete un portátil **ya está dentro**. Zero Trust decide en cada petición, con identidad, dispositivo y contexto: «never trust, always verify». No es denegar a todo el mundo: es pedir pruebas en cada acceso (`sp/sp1-part2.ts:21`, tabla `:33-36`) | El chaleco amarillo: dentro del recinto lo lleva todo el que trabaja allí, y no abre ninguna mercancía; solo dice que estás dentro. La regla de hoy se comporta como si el chaleco bastara | «Never trust, always verify: se verifica cada petición» |
| 2 | Dos planos y tres verbos. El **policy engine decide**, el **policy administrator comunica** (crea y revoca la sesión, emite el token, ordena al PEP) y el **policy enforcement point aplica**. Engine y administrator son el PDP, en el control plane; el PEP es el único componente de control del data plane. Si la pregunta dice «quién decide», nunca es el PEP (`:52`, `:60-61`, `:69`, nota `:136`, q2, q3, q5) | Un almacén del puerto: la **oficina de pedidos** decide, el **encargado de turno** escribe la orden de salida y se la pasa, y el **mozo** del almacén entrega solo lo que dice la orden. El mozo ve pasar la mercancía, pero no tiene los datos ni las normas; la oficina sí, y son las mismas para todos los mozos. Todo va por el sistema de pedidos, **sin teléfono ni llamadas**: el mozo manda la petición, la oficina decide y la orden sale impresa, con su hora de caducidad, a la bandeja del mozo. No es el vigilante que llama a la oficina de acreditaciones de V17: aquí son tres personas y un papel que caduca | «Engine decide, administrator comunica, PEP aplica» · «PDP en el control plane; el PEP, en el data plane» |
| 3 | El contexto cambia la exigencia y el daño se acota. **Adaptive identity**: la autenticación no es un sí o un no fijo, se endurece o se relaja según ubicación, hora, salud del equipo y comportamiento. **Threat scope reduction**: mínimo privilegio, zona pequeña y sesión corta, para que un compromiso valga poco; no es un producto. Y la sesión se revoca si llega una señal nueva (`:57-58`, `:129-131`, `:153-156`, q4) | La misma orden de salida: de siempre, a las diez de la mañana, la orden es normal. Hoy llega a las tres de la madrugada y desde un sitio que nadie conoce: la oficina pide una comprobación más y la orden es solo para mirar, no para llevarse. Vale para esa mercancía y media hora, y si llega un aviso sobre quien la retira, el encargado la anula y el mozo la devuelve a su sitio | «Threat scope reduction: que un compromiso valga poco» |

**Escenas:** seis, en tres capítulos (Dentro no es de fiar · Quién decide y quién aplica · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Basta con estar en Operaciones» | I Dentro no es de fiar | 22 | Sello «13-11 · viernes · acceso al ERP · diseño y simulación». Una regla del cortafuegos, la de V1 sin citarlo: «Operaciones · a `erp.local` · tcp/443 · permitir». Al lado, tres rótulos atenuados con lo que la regla no mira: «quién eres · cómo está tu equipo · desde dónde y cuándo». La primera frase dice la regla en llano («Hoy, para llegar al ERP, basta con que tu equipo esté en Operaciones»); al acabarla, título «Zero Trust» (hacia los 8 s, siempre antes de los 12) y la promesa en tres chips: «verificar cada petición · quién decide y quién aplica · adaptarse y acotar». Entra la etiqueta «NULL CIPHER · sección 1» con «célula de acceso inicial» | La promesa en los primeros 10 s: hoy decide de dónde vienes, y Zero Trust lo cambia · `rule, blind, title, promise, adversary` |
| s02-dentro «Todos con chaleco» | I | 36 | El puerto visto de cerca, con gente de chaleco amarillo: «el chaleco no abre nada, solo dice que estás dentro». La regla de s01 vuelve dibujada así: «chaleco de Operaciones: pasa». Tres figuras con chaleco llegan a la misma regla y la pasan: quien trabaja allí, alguien con un chaleco que no es suyo («una credencial robada») y un portátil que ya no es de fiar («un equipo comprometido»); la regla las deja pasar a las tres con el mismo gesto. Mensaje interceptado. Respuesta: «estar dentro no dice si es de fiar». Dos columnas, con la fila de la lección (`sp/sp1-part2.ts:33-36`): «perímetro: se decide una vez, en el borde» frente a «Zero Trust: se decide en cada petición». Nombre ZERO TRUST, con «never trust, always verify» debajo | Una credencial robada o un portátil comprometido ya están dentro; Zero Trust verifica cada petición · `vest, same-rule, stolen, compromised, once, every, zerotrust` · **intercept** |
| s03-verbos «Una oficina, un encargado y un mozo» | II Quién decide y quién aplica | 46 | La nave de un almacén del puerto, con una línea que la parte en dos. Abajo, el mozo, la estantería y quien viene a recoger un pedido; arriba, vacía, la oficina de pedidos y el encargado de turno. Primero, solo el mozo con el pedido en la mano. Mensaje interceptado. Respuesta: el mozo ve pasar la mercancía, pero no tiene el historial de quien recoge ni las normas, que son las mismas para todos los mozos. Suben la oficina y el encargado y se dibuja la secuencia, con su nombre cada uno: el mozo manda la petición por el sistema de pedidos, sin llamar a nadie, la oficina decide (POLICY ENGINE · decide), el encargado imprime la orden de salida con su caducidad y se la deja en la bandeja del mozo (POLICY ADMINISTRATOR · comunica; `order`), y el mozo entrega solo lo que dice la orden (POLICY ENFORCEMENT POINT · aplica). Un corchete une oficina y encargado: PDP. Aparecen los dos planos: arriba CONTROL PLANE, abajo DATA PLANE, con el mozo como lo único de control en la parte de abajo | Engine decide, administrator comunica, PEP aplica; engine y administrator son el PDP, en el control plane · `warehouse, clerk-alone, desk, lead, order, planes, pdp, wrap` · **intercept** |
| s04-peticion «Una petición, paso a paso» | II | 38 | Consola: «simulador de políticas · propuesta de Seguridad · sin efectos: el ERP no se toca». La política, como una tarjeta que solo se lee en pantalla: «ERP · perfil Operaciones · equipo del puerto, cifrado y con EDR activo · ubicación y hora habituales · lectura y escritura · sesión de 30 min», con «policy-driven access control» en pequeño y sin explicar. Petición 1: «cuenta de prueba · perfil Operaciones · portátil del puerto, cifrado, EDR activo · 10:05 · desde la red del puerto», con el rótulo SUBJECT/SYSTEM (la persona más su equipo: los dos cuentan). Los cinco pasos del flujo de la lección (`sp/sp1-part2.ts:106-124`) se encienden en orden, dibujados como conectores entre el mozo, la oficina y el encargado de s03: la petición llega al PEP, el PEP consulta al PDP, el engine decide, el administrator emite la orden y el token de 30 minutos, y el tráfico va a una zona mínima. Resultado: «concedido · lectura y escritura · 30 min» (`grant`). Nombre IMPLICIT TRUST ZONE, con «zona pequeña y explícita: solo el ERP» | El PEP consulta y obedece; la decisión y la orden viven en el control plane; el tráfico, en el data plane · `sim, policy, request, consult, decide, order, traffic, zone, grant` |
| s05-contexto «Otro país, las tres de la madrugada» | II | 46 | El sello «diseño y simulación · sin efectos» **sigue visible en toda la escena**. Petición 2, la misma cuenta y el mismo portátil, ahora «otro país · 03:00». El engine pide un segundo factor («el proveedor de identidad lo pedirá desde el 30-11», nota pequeña y en futuro; `step-up`) y, superado, concede **solo lectura** durante 30 minutos. Nombre ADAPTIVE IDENTITY, con «la exigencia cambia con el contexto» (el check de la lección acaba de preguntarla: aquí solo se ve y se nombra). Evento de prueba a los 10 minutos: «EDR: malware en el equipo». Pregunta para pensar, con dos botones: «PEP» y «administrator». Respuesta: el administrator. El engine ve el aviso y decide cerrar, el administrator revoca la sesión y el PEP la corta: «sesión cerrada · 10 min» (`revoke`). Nombre THREAT SCOPE REDUCTION con tres chips: «solo lectura · 30 min · solo el ERP». Un sello al final: «siguiente paso · piloto con el ERP de pruebas · Seguridad · 11-12» | Adaptive identity ajusta lo que se exige; threat scope reduction hace que valga poco y se puede cerrar en cuanto cambia la señal: decide el engine, revoca el administrator, corta el PEP · `req2, odd, step-up, readonly, event, think, revoke, scope, pilot` · **think** |
| s06-recap «Tres reglas» | III Para el examen | 22 | Tres tarjetas de reglas, cada una con su icono (el chaleco · la oficina, el encargado y el mozo · la orden con su reloj); tarjeta final Alertópolis: «Tu turno: las preguntas de la lección» (sp1m3, 6 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 1.2), una por escena de s02 a s05, cada una con su cue antes de la última frase de la
  escena (`examTiming: sentence-end`):
  - «Never trust, always verify: se verifica cada petición» (s02) (53)
  - «Engine decide, administrator comunica, PEP aplica» (s03) (49)
  - «PDP en el control plane; el PEP, en el data plane» (s04) (49)
  - «Threat scope reduction: que un compromiso valga poco» (s05) (52). Es un principio, no una estructura: la tarjeta no la
    junta con las zonas. Adaptive identity queda en la escena (con su nombre en pantalla) y en la regla 3 del cierre; la pregunta para pensar es la de la revocación.
- **Pregunta para pensar** (`holdMs` 4500): «El EDR avisa: ¿quién revoca la sesión?» (s05) (38). Llega con el aviso ya en
  pantalla y sin rótulo que la conteste. Respuesta: el administrator revoca (crea y revoca la sesión y ordena al PEP,
  `sp/sp1-part2.ts:61`, q3); el engine es quien ve la señal y decide cerrar, y el PEP, quien corta cuando se lo ordenan. La
  tentación es el PEP, que es el que «corta». No repite el check de adaptive identity que sale justo antes en la lección
  (`:157-171`, la misma situación de otro país a las 03:00) y trabaja lo que la lección solo nombra (la revocación,
  `:130`) con la trampa de q3.
- **Mensajes interceptados** (NULL CIPHER, `holdMs` ~3800; uno por capítulo en I y II, ninguno en el cierre; todos en
  infinitivo, sin persona y con «Lógico.», como los de V11 y V12; ni puertas ni llaves):
  - s02: «Confiar en todo equipo de la red interna. Ya pasó el control. Lógico.» (69). El error que corrige la narradora:
    creer que haber pasado el borde basta. Es verdad que pasó el control; por eso un equipo comprometido o una credencial
    robada también están dentro. Estar dentro no dice si es de fiar (`sp/sp1-part2.ts:21`).
  - s03: «Dejar que decida el punto de aplicación. Ve todo el tráfico. Lógico.» (68). El error: que decida el PEP porque
    está en medio. Ve el tráfico, sí, pero no tiene el contexto ni la política; decide el engine, el administrator comunica y
    el PEP aplica (`:136`, q5: «la respuesta nunca es el PEP»).
- **Cierre:** tres reglas y una sola tarea.
  1. Dentro no es de fiar: se verifica cada petición, con identidad, equipo y contexto. Verificar no es negar.
  2. El engine decide, el administrator comunica y el PEP aplica. Engine y administrator son el PDP, en el control plane; el
     PEP, en el data plane.
  3. La exigencia se adapta al contexto y el daño se acota: sesión corta, alcance mínimo y revocable. Zero Trust no es una
     caja que se compra: un proveedor puede vender un PEP o un PDP, pero la política y las señales las diseñas tú
     (`sp/sp1-part2.ts:155`).

  Tarea: las 6 preguntas de la lección sp1m3 (todas tocan lo que cuenta el vídeo: la q1 es la definición, la q2, q3 y q5 son
  los tres verbos, la q4 es threat scope reduction y la q6 se apoya en el rótulo SUBJECT/SYSTEM de s04).
- **Se queda fuera** (sigue en la lección, que quien ve el vídeo ya ha leído, porque va al final):
  - La tabla completa del perímetro frente a Zero Trust (`sp/sp1-part2.ts:23-48`): solo sale la fila de dónde se decide.
  - Policy-driven access control como concepto propio (`:59`, `:78`): rótulo pequeño en s04, sin explicar.
  - NIST SP 800-207 y la tabla de componentes por plano (`:52`, `:72-85`); micro-segmentación como término (`:40`, `:58`).
  - Implicit trust zones y subject/system como conceptos con tarjeta: salen como rótulos en s04. La zona se dice «pequeña y
    explícita».
  - El matiz de que Zero Trust es una arquitectura y no una caja (`:155`): una frase en el cierre.
  - El puente a la seguridad física (`:172-175`), que queda justo después del vídeo.
- **Laboratorios:** ninguno de sp1 toca Zero Trust (`sp/labs.ts:16-55`: spl1a clasifica controles, spl1b ordena un cambio y
  spl1c elige familias criptográficas), así que no hay solución que destripar. Una precaución: s01 y s04 enseñan una regla
  de cortafuegos y una política, y el vídeo **no las clasifica** (technical, preventive, etc.), para no rozar spl1a.

**Canon nuevo que fija V20** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-11-13 (viernes): diseño y simulación del acceso al ERP.** Seguridad ha escrito una política por petición para el
  ERP (`erp.local`, el de la regla de V1, `v1/src/scenes/S05Rules.tsx:25`, y el «correo, web, ERP» del SIEM,
  `video/siem/src/data/s02-collect.ts:33`) y la analista, en segunda persona y sin nombre, la prueba en un simulador de
  políticas. **No funciona nada ni se toca el ERP real.** La política: perfil Operaciones; equipo del puerto, cifrado y con
  EDR activo; ubicación y hora habituales; lectura y escritura; sesión de 30 minutos; con otro contexto, segundo factor y solo
  lectura; si el EDR avisa, sesión cerrada. Sin nombres de equipo nuevos: ni del PEP ni del PDP.
- **Tres peticiones de prueba, con una cuenta de prueba** (sin nombre, no es de nadie): las 10:05 desde la red del puerto
  (concedida), la misma cuenta y equipo desde otro país a las 03:00 (segundo factor y solo lectura) y un evento de prueba
  del EDR a los 10 minutos (sesión cerrada). Son simulaciones, no sucesos.
- **El segundo factor lo pide el proveedor de identidad «desde el 30-11»**, en futuro, como en V10 (la mejora «MFA y lista de
  contraseñas prohibidas en el proveedor de identidad · Sistemas · 30-11»). El 13-11 el proveedor de identidad solo pide
  contraseña; la simulación supone que el 30-11 ya existirá, y lo dice.
- **Mejora con responsable y fecha: «piloto con el ERP de pruebas · Seguridad · 11-12»** (viernes). Es un entorno de pruebas,
  no el de producción, y se fecha después del 30-11 a propósito: el piloto necesita el segundo factor del proveedor de
  identidad. Ningún vídeo la enseña cumplida.
- **NULL CIPHER**, tercera aparición en la cronología (primera, en el orden del curso), con el registro de V11 y V12: manual
  de procedimiento en infinitivo, «Lógico.», sin IP, dominio ni equipo; solo da consejos.
- **Comprobado contra la cronología:** 13-11 viernes, 11-12 viernes, 30-11 lunes (Node). El 13-11 cae entre el último hecho
  de V12 (12-11) y el 16-11 de V16; el 11-12 queda después del 1-12 (fases del plan de zonas) sin relacionarse con ellas.

**No se toca:**
- **El dosier de NULL CIPHER** (`sp/sections.ts:49`): ningún lector de badges (la lección siguiente, sp1m4, es la seguridad
  física), ningún certificado autofirmado ni raíz «temporal», la palabra «inventario» no sale y nadie firma «GH». NULL CIPHER
  no tiene IP, dominio ni equipo; nada la relaciona con otro adversario. Y la regla de V11: **ni puertas ni llaves para NULL
  CIPHER** (es la imagen del spraying de RED MARROW en V10). La narradora puede hablar de «la puerta» al explicar el PEP
  si el guion lo pide; sus mensajes, no. La imagen de V20 evita las dos palabras.
- **El caso `IR-2026-0147`** (3-9 y 4-9): ni sus equipos (`OPS-WS-*`, `ADM-WS-*`, `srv-tc-app03`), ni `svc_tosreport`, ni la
  01:52, ni los 38 GB. **El vídeo no dice que Zero Trust, el segundo factor o el EDR habrían frenado nada de septiembre**
  (el registro, §5, ya lo prohíbe para la bóveda y el segundo factor). La señal «EDR activo» del equipo no insinúa que
  alguna estación no lo tuviera. Lucía no sale: la cuenta de la simulación no es de nadie.
- **La VPN** (V17: «cómo se entra en la VPN» no se toca): el «antes» es la regla de V1, no una VPN. Ni su servidor, ni sus
  factores, ni el túnel dividido o completo.
- **Las zonas y el jump server de V16:** el vídeo no los nombra ni dice que Zero Trust sustituya al plan de zonas. «Zona
  mínima» no es ninguna de las seis zonas de V16. Nada de lo de V16 y V17 funciona antes del 1-12 y V20 no lo adelanta.
- **La MFA del proveedor de identidad** (V10, Sistemas, 30-11): solo en futuro y como nota; ninguna pantalla pide un segundo
  factor real el 13-11, ni se enseña cumplida. El proveedor de identidad no tiene nombre de host.
- **El portal de reservas** (`hpa-portal-web-01`), la noche del 21-10, el certificado del 11-11 (V10–V12): no salen.
- **Contratistas, proveedores y mantenimiento:** ninguno en ninguna escena (dosier de RED MARROW; final de sp5). Nadie con
  nombre: ni `a.soto` ni `r.haugen` ni `c.navarro` ni `o.virta`; la cuenta es «de prueba».
- **Septiembre, ni de lejos:** «credencial robada» y «equipo comprometido» son el supuesto de la lección (`:21`), pero la pareja se parece a lo que pasó el 3 y el 4-9. El guion no dice «como pasó», «como en un caso real» ni «habría frenado».
- No se culpa a nadie de que la regla de hoy mire solo el origen: «la regla creció así», como la red de V16.

**Comprobación de límites** (perfil `capsula-yt`; recuento con Node, `[...texto].length`, por un script que lee esta ficha):
- Duración: suma 210 s; render esperado 235–250 s, dentro de 190–260. Los extremos conocidos (0,89 y 1,22 veces la suma)
  dan 187–256 s: el alto cabe; el bajo queda 3 s por debajo del mínimo, pero V10 y V12, con la misma estructura,
  estimaron por encima de su suma (273 s con 220 y unos 260 con 210), así que se espera lo contrario. Si el primer
  borrador se acerca a 190, se alarga s03.
- 6 escenas en 3 capítulos (máximo 3). 3 conceptos (2–3).
- 4 tarjetas de examen (3–5), una por escena de s02 a s05, ninguna en la última; de 49 a 53 caracteres (máximo 58), sin
  `{}[]|<>`, flechas, marcas, viñetas ni emoji.
- 1 pregunta para pensar (exactamente 1), 38 caracteres (máximo 48), `holdMs` 4500.
- 2 mensajes interceptados (1–2), uno por capítulo (I y II), ninguno en la escena final; 69 y 68 caracteres (máximo 70);
  `holdMs` ~3800 (2500–4500); `video.json` lleva `"adversary": "NULL CIPHER"`.
- `wordBudget` por escena (`s` × 2,7): s01 59 · s02 97 · s03 124 · s04 103 · s05 124 · s06 59 (total 566).
- Sin identificadores en la voz: `erp.local` solo en pantalla (la voz dice «el ERP»); sin hosts, IP ni cuentas. Siglas en
  voz que necesitan léxico (pronunciación, ver decisiones): PEP, PDP, EDR, ERP, NIST.
- El título entra antes de los 12 s (s01: una frase corta y el título).
