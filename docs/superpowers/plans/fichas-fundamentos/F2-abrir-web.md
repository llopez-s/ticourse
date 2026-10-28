# F2 · «Qué sucede al abrir una web»

> **Estado: propuesta, 2026-10-28.** Sin congelar, sin escenas ni voz. Rutas relativas a la raíz del repo; `fund` =
> `src/data/security/foundations.ts`, `prac` = `src/data/security/practicals.ts`, `reg` =
> `docs/superpowers/canon/glass-harbor.md`, `plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md`. Decisiones
> comunes a los cuatro vídeos: [00-propuesta.md](00-propuesta.md) §6.

## A. Ficha didáctica

| | |
|---|---|
| **Título** | Qué sucede al abrir una web |
| **Título de YouTube** | Qué sucede al abrir una web: DHCP, DNS, TLS y certificados · Fundamentos para Security+ |
| **Pregunta central** | ¿Qué hace tu equipo, y en qué orden, desde que entra en la red hasta que ves una página segura, y qué te asegura de verdad un certificado válido? |
| **Objetivos observables** | Al terminar, quien lo ve puede: (1) ordenar DHCP, DNS, TCP, TLS y HTTP en una primera visita y decir el trabajo de cada uno; (2) enumerar lo que entrega una concesión DHCP; (3) explicar el TTL y por qué no hay una consulta DNS en cada clic; (4) decir qué se repite y qué no en una segunda visita a los tres minutos y a las dos horas; (5) enumerar las cuatro comprobaciones de un certificado (nombre, firma y cadena, fechas, revocación) y la prueba de la clave privada; (6) dar dos cosas que un certificado válido no garantiza. |
| **Prerrequisitos** | Lecciones f09 y f10 (`fund:37-44`). F1 visto, o f05–f08: dirección, gateway, puerto 443, TCP y UDP. |
| **Duración estimada** | ~9:14 renderizados (1329 palabras de locución; cálculo en E.2). |
| **Práctica relacionada** | «Diagnóstico de conectividad» (`foundation-connectivity`, `prac:130`), desde `#/security/study?view=practice&foundation=1`. El vídeo enseña qué hace cada pieza; la práctica pide decidir por cuál empezar ante un fallo. |
| **Dónde va** | Al final de f10, antes de la práctica. |
| **Conceptos clave (5)** | DHCP y su concesión · DNS y el TTL · TLS: canal y autenticación del servidor · qué comprueba un certificado · lo que un certificado válido no dice. HTTP entra como la pieza que viaja dentro. |
| **Se queda en las lecciones** | ataques a DHCP y DNS, DNSSEC, DNS cifrado, HSTS, versiones de HTTP, códigos distintos de 200, tipos de certificado, CRL frente a OCSP (es V12, sp1m7). |

### Escenario técnico (fijo)

| Paso | Qué pasa en la primera visita | ¿Se repite a los 3 min? | ¿Y a las 2 h? |
|---|---|---|---|
| Equipo y momento | El portátil de la naviera de F1, por cable, en la red de la oficina (`192.168.20.0/24`). Lunes, 8:58, tras el fin de semana apagado. | — | — |
| DHCP | La concesión del viernes (8 h) caducó. El portátil empieza de cero: descubre, recibe oferta, la pide, recibe confirmación. El servidor es el router (`192.168.20.1`). Entrega: dirección `192.168.20.10`, máscara `255.255.255.0` (/24), puerta de enlace `192.168.20.1`, resolutor `192.168.20.2`, concesión de 8 h. | No: la concesión sigue viva | No: renovará a mitad de plazo, a las 12:58 |
| DNS | Caché del sistema vacía (acaba de arrancar). El resolutor de la oficina tampoco tiene el nombre (primera consulta del día) y resuelve desde la raíz hasta el servidor autoritativo del puerto. Respuesta: registro A de `reservas.haldenport.example` → `192.0.2.44`, TTL 3600 s (una hora). | No: la respuesta vale hasta las 9:58 | Sí: el TTL caducó |
| TCP | Conexión a `192.0.2.44:443` desde un puerto efímero (sale por NAT y por la regla 1 de F1). | Probablemente sí: la conexión de antes ya se habrá cerrado por inactividad | Sí |
| TLS | TLS 1.3: el navegador saluda con el nombre del sitio y sus cifrados; acuerdan claves de sesión; el servidor envía su certificado y la intermedia, firma el saludo con su clave privada y adjunta una respuesta OCSP reciente (stapling). | Si hay conexión nueva, puede retomarse la sesión con un saludo abreviado | Saludo nuevo, o abreviado si el navegador aún guarda la sesión |
| Certificado | nombres alternativos: `reservas.haldenport.example` (sujeto `CN = reservas.haldenport.example`), emisor `Confianza Global TLS Issuing CA 3`, raíz `Confianza Global Root` (en el almacén del sistema), válido del 9-11-2026 al 27-5-2027, OCSP grapado. | — | — |
| HTTP | `GET` de la página de reservas, con cabecera `Host` y la cookie de sesión si la hay. Respuesta `200`. | **Sí**: cada visita hace su petición | **Sí** |

El día no se dice ni se ve. Tiene que ser posterior al jueves 12-11, cuando el portal activa el OCSP stapling (V12,
`video/pki-halden/narration.json:201`).

## B. Guion audiovisual por escenas

- **Carpeta** `video/abrir-web/` · perfil `principal-yt` · `"track": "secplus"` · `"lesson": "f10"` · sin adversario ni
  mensajes interceptados · voz `recording/lidia`, tempo 1 · música `Go On Going - Stayloose.mp3` ·
  `"examTiming": "sentence-end"`.
- **Sello** desde s02: «Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto» y «Simulación
  educativa · datos ficticios». En s10, el dominio parecido lleva además «ejemplo · no existe en el caso».
- **Hilo visual: la cinta de cinco piezas.** Una franja horizontal arriba con cinco casillas, «DHCP · DNS · TCP · TLS ·
  HTTP», que se encienden por orden y se quedan encendidas. En s09 se vuelve tabla de tres columnas (primera vez · 3
  min · 2 h). El navegador del portátil está siempre en una esquina; su indicador de conexión segura se dibuja
  **neutro** (sin candado: el candado es imagen de V21 y además los navegadores ya no lo muestran igual).
- **Imágenes** (rotuladas «imagen · no es del puerto»): el libro de la biblioteca con fecha de devolución (concesión);
  la agenda del móvil (DNS); el DNI (certificado, la misma imagen que usa V12 para la revocación,
  `video/pki-halden/narration.json:165`).
- **Datos en pantalla** (nunca en la voz): los de la tabla de arriba y `haldenp0rt.example` en s10.

### Capítulo 1 · La configuración: DHCP

#### s01 · «Tres segundos» · ~35 s · 88 palabras

- **Propósito didáctico:** la pregunta central y la promesa en 12 s; enlazar con F1; anunciar la segunda visita.
- **En pantalla:** el navegador: se escribe la dirección del portal y la página aparece; un cronómetro se para en
  «3 s». Al decir «qué ha pasado», el título «Qué sucede al abrir una web» y la cinta de cinco piezas, aún apagadas.
  Después, la oficina de la naviera de F1 con el reloj de pared en «8:58» y un rótulo «lunes».
- **Acciones visuales:** el cronómetro se rebobina hasta el momento del encendido del portátil.
- **Narración:**

> Abres el navegador, escribes la dirección del portal del puerto y, en tres segundos, tienes la página. ¿Qué ha pasado en ese rato?
> Hoy vas a separar cinco piezas que trabajan una detrás de otra. Y vas a ver qué no se repite cuando vuelves a la página un rato después.
> Al final sabrás qué comprueba un certificado y, sobre todo, qué no te puede asegurar.
> Es lunes, son las nueve menos dos. Acabas de encender el portátil en la oficina de la naviera, la del vídeo anterior.

#### s02 · «¿Quién reparte?» · ~42 s · 108 palabras

- **Propósito didáctico:** DHCP: por qué hace falta, el intercambio y lo que entrega.
- **En pantalla:** en la configuración del portátil, todo en blanco y un rótulo «concesión del viernes · caducada».
  Diagrama de carriles (portátil · router con «servidor DHCP») con cuatro mensajes: «¿alguien reparte?» (a toda la
  red), «te ofrezco esta», «la quiero», «es tuya». Después, la tarjeta de la concesión, que se rellena fila a fila
  al compás de la voz: dirección `192.168.20.10`, máscara `255.255.255.0`, puerta de enlace `192.168.20.1`, resolutor
  DNS `192.168.20.2`. La casilla «DHCP» de la cinta se enciende.
- **Acciones visuales:** el primer mensaje sale en abanico hacia todos los equipos de la oficina; solo contesta el
  router.
- **Narración:**

> Al arrancar, tu portátil no sabe qué dirección usar. La que le dieron el viernes ya caducó durante el fin de semana.
> Así que pregunta a toda la red si hay alguien que reparta configuración. Contesta el servidor DHCP de la oficina, que aquí vive en el router.
> Le ofrece una dirección, el portátil la pide y el servidor se la confirma. Cuatro mensajes, y ya tiene sitio.
> Y no le da solo la dirección. Le da la máscara, otra forma de escribir el prefijo, o sea, dónde acaba su red. La puerta de enlace, por dónde salir. Y el resolutor DNS, a quién preguntar por los nombres.

#### s03 · «Con fecha de devolución» · ~39 s · 98 palabras

- **Propósito didáctico:** la concesión y su renovación; DHCP no trabaja en cada visita; cada pieza falla por separado.
- **En pantalla:** la imagen del libro de la biblioteca con su ficha «devolver antes de…». Al lado, la tarjeta de la
  concesión con una barra de tiempo «8:58 → 16:58» y una marca a mitad, «12:58 · renueva». Al final, tres
  mini-escenas en fila: «concesión ✓ · resolutor no contesta», «concesión ✓ · gateway sin salida», «concesión ✓ ·
  todo bien».
- **Acciones visuales:** la barra avanza rápida hasta la mitad y se rellena otra vez («renovada»).
- **Narración:**

> Todo eso no es para siempre. Te lo dejan por un tiempo, como un libro de la biblioteca. Se llama concesión, y aquí dura ocho horas.
> A mitad de plazo, el portátil pide renovarla, sin hacer ruido. Si el servidor dice que sí, sigue con la misma dirección.
> O sea, que DHCP trabaja al conectarte y al renovar, no cada vez que abres una web.
> Y tener dirección no lo arregla todo. Puedes tener una concesión perfecta y que el resolutor no conteste, o que la puerta de enlace no tenga salida. Cada pieza falla a su manera.

### Capítulo 2 · El nombre: DNS

#### s04 · «La agenda» · ~47 s · 119 palabras

- **Propósito didáctico:** por qué hace falta DNS; caché local; resolutor; resolución por niveles.
- **En pantalla:** la imagen de la agenda del móvil (un nombre, un número). Luego la caché del portátil, vacía. Una
  escalera de cuatro peldaños a la derecha: «tu portátil» → «resolutor de la oficina» → «raíz» → «servidores del
  final del nombre» → «servidor del puerto». La consulta lleva la casilla «UDP» de la etiqueta de F1.
- **Acciones visuales:** el portátil pregunta solo al resolutor y espera. Es el resolutor quien baja la escalera
  peldaño a peldaño y recibe en cada uno un papelito «pregunta a…»; el último le da la dirección, y él se la pasa al
  portátil.
- **Narración:**

> Ahora, el nombre del portal. Tu navegador no sabe ir a un nombre, necesita una dirección. Es como la agenda del móvil. Tú buscas un nombre y el móvil marca el número.
> Primero, tu portátil mira si ya tiene ese nombre guardado. Acaba de arrancar, así que no.
> Entonces pregunta al resolutor que le dio DHCP, normalmente por UDP, el recado en el contestador del vídeo anterior.
> El resolutor tampoco lo sabe, es la primera consulta del día. Así que lo busca por su cuenta.
> Empieza por arriba del todo, por unos servidores que no saben la respuesta, pero sí a quién preguntar. Y así, de nivel en nivel, llega al servidor que manda en los nombres del puerto.

#### s05 · «Una respuesta que caduca» · ~31 s · 76 palabras

- **Propósito didáctico:** registro A; TTL; caché; cerrar el capítulo.
- **En pantalla:** la respuesta: «`reservas.haldenport.example` · A · `192.0.2.44` · TTL 3600». Una cuenta atrás de
  una hora junto al resolutor y otra junto al portátil. Chip pequeño: «AAAA = IPv6 · MX = correo». La casilla
  «DNS» de la cinta se enciende.
- **Acciones visuales:** las dos cuentas atrás avanzan; al llegar a cero, la respuesta se desvanece.
- **Narración:**

> La respuesta es un registro de tipo A, una ficha que guarda una dirección IPv4. Y viene con un tiempo de vida, el TTL. Aquí, una hora.
> Durante ese tiempo, el resolutor y tu portátil pueden contestar de memoria, sin preguntar a nadie. Pasado el plazo, lo olvidan y se vuelve a preguntar.
> O sea, que DNS traduce nombres a direcciones, y su respuesta se guarda un rato. No hay una consulta nueva en cada clic.

- **Tarjeta de examen** (4.5): «DNS: del nombre al registro, guardado durante su TTL».

### Capítulo 3 · El canal: TCP y TLS

#### s06 · «Hola, soy el portal» · ~55 s · 142 palabras

- **Propósito didáctico:** TCP primero; TLS: saludo, claves de sesión, certificado y prueba de la clave privada.
- **En pantalla:** carriles portátil · portal. El saludo TCP (las tres flechas de F1, pequeñas). Después, el saludo
  TLS: «hola · quiero hablar con el portal de reservas · sé estos cifrados» / «hola · usamos este · aquí va mi
  certificado · y esta firma, hecha con mi clave privada». Una llave pequeña «claves de sesión» aparece en los dos
  lados a la vez. Al final, la línea de la conexión al estilo de V11 (`TlsLine.tsx`): `TLSv1.3 /
  TLS_AES_256_GCM_SHA384 / X25519`. Se encienden «TCP» y «TLS» en la cinta.
- **Acciones visuales:** un segundo personaje en gris, «copia del certificado», intenta firmar y no puede (no tiene la
  clave privada).
- **Narración:**

> Con la dirección en la mano, el navegador abre una conexión TCP al 443 del portal. Es la llamada del vídeo anterior, la que se saluda antes de hablar.
> Y aquí empieza lo nuevo. Antes de pedir nada, tu navegador y el portal montan un canal protegido. Tu navegador saluda, dice con quién quiere hablar y qué formas de cifrar conoce.
> Mientras se saludan, los dos acuerdan unas claves solo para esta conversación. Y el portal enseña su certificado, que es como su DNI.
> Además, demuestra que ese DNI es suyo con un secreto que solo él guarda, su clave privada. Quien solo haya copiado el certificado no puede hacer eso.
> Si tu navegador da todo por bueno, desde ahí todo viaja cifrado con esas claves. Eso es TLS. Un canal protegido y, a la vez, una prueba de con quién hablas.

- **Tarjeta de examen** (1.4): «TLS: canal cifrado y autenticación del servidor».

#### s07 · «El DNI del servidor» · ~62 s · 162 palabras

- **Propósito didáctico:** las cuatro comprobaciones del certificado y la prueba de posesión de la clave.
- **En pantalla:** la imagen del DNI a la izquierda; a la derecha, el certificado del portal como tarjeta con cuatro
  filas que se marcan una a una: «nombres alternativos: `reservas.haldenport.example` ✓», «firma: `Confianza Global TLS Issuing CA 3`
  → `Confianza Global Root` (en tu equipo) ✓» (la cadena de V12, `AnchorChain.tsx`, con el sello de `CaSeal.tsx`),
  «fechas: 9-11-2026 a 27-5-2027 ✓», «no anulado: respuesta de la CA, grapada ✓». Cada fila se refleja en el DNI:
  nombre, quién lo expide, caducidad, «no denunciado». Al final, junto al DNI aparece una cara: «foto = clave pública · cara = clave
  privada · el DNI se fotocopia, la cara no».
- **Acciones visuales:** la raíz aparece dentro de una caja rotulada «almacén de confianza de tu equipo».
- **Narración:**

> ¿Y qué comprueba exactamente tu navegador en ese DNI del servidor? Cuatro cosas.
> Primero, el nombre. El que has escrito tiene que figurar en el certificado. Si figura otro, no te sirve, por bueno que sea.
> Segundo, quién lo firma. No te fías de un DNI porque lo diga el DNI, sino porque reconoces a quien lo expide.
> Es una cadena. Al del portal lo firma una autoridad intermedia, y a esa, una raíz que tu equipo ya trae instalada.
> Tercero, las fechas. Este vale de noviembre a mayo.
> Y cuarto, que no lo hayan anulado. El servidor adjunta una respuesta reciente de la autoridad, firmada, que dice que sigue vigente.
> La foto del DNI es como la clave pública, que va dentro del certificado. La cara es la clave privada, y solo la tiene el servidor.
> Quien copia un DNI no tiene la cara de su dueño.
> O sea, que el navegador comprueba quién es el servidor antes de mandarle nada.

- **Tarjeta de examen** (1.4): «Certificado: nombre, cadena, vigencia y revocación».

### Capítulo 4 · La petición y la segunda visita

#### s08 · «Por fin, la página» · ~43 s · 109 palabras

- **Propósito didáctico:** HTTP dentro de TLS; qué ve quien observa la red.
- **En pantalla:** la petición como tarjeta: «`GET /reservas` · `Host: reservas.haldenport.example` · `Cookie: sesión`».
  La respuesta: «`200 OK` · página». Las dos tarjetas entran en un tubo opaco rotulado «TLS». Fuera del tubo, un
  observador con lupa ve «`192.0.2.44`» y, en gris, «nombre del sitio (normalmente)»; la ruta y el contenido quedan
  tapados. Se enciende «HTTP».
- **Acciones visuales:** la lupa intenta leer dentro del tubo y solo ve ruido.
- **Narración:**

> Con el canal abierto, llega la web. El navegador pide la página en el idioma de la web, que se llama HTTP. Dice qué quiere, GET, o sea, dame, y qué página.
> Si ya habías entrado antes, lleva también una cookie, una nota que te dejó el portal para reconocerte.
> El servidor responde con un código, el doscientos, que quiere decir todo bien, y con la página.
> Todo eso viaja dentro del canal de TLS. Por eso se llama HTTPS, HTTP con su canal seguro.
> Quien mire la red ve con qué dirección hablas, y normalmente el nombre del sitio. Pero no qué página pides ni qué te contestan.

- **Tarjeta de examen** (3.2): «HTTPS: HTTP dentro de un canal TLS».

#### s09 · «Un rato después» · ~57 s · 131 palabras

- **Propósito didáctico:** qué no se repite en una segunda visita; primera pausa.
- **En pantalla:** el reloj de pared pasa a «9:01». La cinta de cinco piezas se convierte en una tabla con tres
  columnas, «primera vez · 3 min · 2 h», que se rellena tras la pausa: DHCP «sí · no · no»; DNS «sí · no (TTL) · sí»;
  TCP «sí · probablemente · sí»; TLS «completo · abreviado si se retoma · nuevo o abreviado»; HTTP «sí · sí · sí».
- **Acciones visuales:** en la columna «3 min», las casillas que no se repiten se apagan con el motivo al lado
  («concesión viva», «TTL vigente», «sesión TLS retomada»).
- **Narración:**

> Haces tu reserva, cierras la pestaña y, tres minutos después, vuelves al portal. ¿Se repite todo lo que has visto?

- **Pausa para decidir** (`think`, `holdMs` 4500): «¿Se repite todo el proceso?» · en pantalla: «Sí, todo» / «No,
  casi nada».

> Casi nada, aunque es fácil pensar que cada visita empieza de cero. La concesión sigue viva, así que no hay DHCP. Y la respuesta del DNS sigue dentro de su TTL, así que no se pregunta.
> La conexión de antes, seguramente, ya se cerró. Pero el navegador puede retomar la sesión TLS con un saludo más corto.
> Lo que sí va es una petición HTTP nueva, dentro del canal.
> ¿Y si vuelves dos horas después? El TTL ya pasó, así que hay consulta DNS. Seguramente también conexión y saludo TLS nuevos. Pero la concesión sigue valiendo.
> O sea, que cada pieza tiene su propio reloj, y solo la petición va siempre.

### Capítulo 5 · Lo que el certificado no dice

#### s10 · «Un correo con enlace» · ~42 s · 91 palabras

- **Propósito didáctico:** un certificado válido autentica un nombre, no la honradez de quien lo tiene; segunda pausa.
- **En pantalla:** un correo con un enlace; el navegador abre `haldenp0rt.example` (el ejemplo de dominio parecido de
  V1, `reg:395`), con la página copiada del portal. El indicador de conexión segura, idéntico al de antes. Tras la
  pausa, la barra de direcciones se amplía y el `0` se pone ámbar al lado de la `o` del dominio del puerto. El
  certificado de la copia, en su tarjeta: nombre `haldenp0rt.example` ✓, firma ✓, fechas ✓, no anulado ✓.
- **Acciones visuales:** las cuatro casillas en verde contrastan con el rótulo ámbar «pero ¿de quién?».
- **Narración:**

> Ahora imagina otra cosa. Te llega un correo con un enlace. Lleva a una web casi igual a la del puerto, con un cero en lugar de una o.
> La abres y el navegador no protesta. Certificado válido. ¿Te puedes fiar?

- **Pausa para decidir** (`think`, `holdMs` 4500): «Certificado válido: ¿web de fiar?» · en pantalla: «Sí» / «No
  basta».

> No basta. El certificado demuestra que hablas, cifrado, con quien controla ese nombre. Y ese nombre es el del cero.
> Conseguir un certificado para un dominio propio es fácil. Solo tienes que demostrar que controlas ese nombre.
> Igual que un DNI auténtico tampoco dice si quien lo lleva es honrado.

- **Tarjeta de examen** (2.2): «Certificado válido no es lo mismo que sitio de fiar».

#### s11 · «Lo que el canal no arregla» · ~46 s · 117 palabras

- **Propósito didáctico:** HTTPS no hace segura una aplicación; no saltarse los avisos de certificado.
- **En pantalla:** dentro del tubo TLS viaja un paquete marcado «entrada maliciosa» y llega intacto a la aplicación,
  que se pone ámbar: «el canal la trae igual de protegida». Después, un aviso de certificado del navegador con sus tres
  causas en fila: «el nombre no cuadra · falta parte de la cadena · fuera de fecha · …». Un dedo va hacia «continuar de todos
  modos» y se detiene: «quitar la comprobación = quitar la protección».
- **Acciones visuales:** ninguna transición nueva.
- **Narración:**

> Y hay más cosas que un certificado no dice. No dice que la aplicación esté bien hecha. Un ataque puede viajar dentro de HTTPS tan tranquilo.
> El cifrado protege el camino, no lo que la web hace con lo que recibe. Tampoco dice qué hará el puerto con tus datos cuando lleguen.
> Y si un día el navegador te avisa de un problema con el certificado, no lo saltes. Puede que el nombre no cuadre, que falte parte de la cadena o que esté fuera de fecha, entre otras causas.
> Quitar la comprobación para que funcione es quitar la protección.
> O sea, que el certificado te dice con quién hablas, no si te conviene hablar con él.

- **Tarjeta de examen** (3.2): «TLS protege el canal, no la aplicación».

#### s12 · «Cinco piezas» · ~35 s · 88 palabras

- **Propósito didáctico:** cierre con tres reglas y una acción.
- **En pantalla:** la cinta de cinco piezas encendida; tres tarjetas numeradas; la tarjeta final «Alertópolis · Qué
  sucede al abrir una web» con el botón «Práctica · Diagnóstico de conectividad».
- **Acciones visuales:** ninguna nueva; sin tarjeta de examen.
- **Narración:**

> Te quedas con tres reglas.
> Una. Cada pieza tiene su trabajo. DHCP te configura y DNS traduce el nombre. Luego TCP abre la conversación, TLS la protege y HTTP pide la página.
> Dos. No todo se repite. La concesión dura horas, la respuesta del DNS vive lo que dice su TTL, y las sesiones TLS se pueden retomar.
> Tres. Un certificado válido dice con quién hablas, no si es de fiar.
> Ahora te toca a ti. Abre la práctica «Diagnóstico de conectividad» y decide por qué pieza empezar.

## C. Texto de locución

#### Capítulo 1 · La configuración: DHCP

Abres el navegador, escribes la dirección del portal del puerto y, en tres segundos, tienes la página. ¿Qué ha pasado en ese rato?

Hoy vas a separar cinco piezas que trabajan una detrás de otra. Y vas a ver qué no se repite cuando vuelves a la página un rato después.

Al final sabrás qué comprueba un certificado y, sobre todo, qué no te puede asegurar.

Es lunes, son las nueve menos dos. Acabas de encender el portátil en la oficina de la naviera, la del vídeo anterior.

Al arrancar, tu portátil no sabe qué dirección usar. La que le dieron el viernes ya caducó durante el fin de semana.

Así que pregunta a toda la red si hay alguien que reparta configuración. Contesta el servidor DHCP de la oficina, que aquí vive en el router.

Le ofrece una dirección, el portátil la pide y el servidor se la confirma. Cuatro mensajes, y ya tiene sitio.

Y no le da solo la dirección. Le da la máscara, otra forma de escribir el prefijo, o sea, dónde acaba su red. La puerta de enlace, por dónde salir. Y el resolutor DNS, a quién preguntar por los nombres.

Todo eso no es para siempre. Te lo dejan por un tiempo, como un libro de la biblioteca. Se llama concesión, y aquí dura ocho horas.

A mitad de plazo, el portátil pide renovarla, sin hacer ruido. Si el servidor dice que sí, sigue con la misma dirección.

O sea, que DHCP trabaja al conectarte y al renovar, no cada vez que abres una web.

Y tener dirección no lo arregla todo. Puedes tener una concesión perfecta y que el resolutor no conteste, o que la puerta de enlace no tenga salida. Cada pieza falla a su manera.

#### Capítulo 2 · El nombre: DNS

Ahora, el nombre del portal. Tu navegador no sabe ir a un nombre, necesita una dirección. Es como la agenda del móvil. Tú buscas un nombre y el móvil marca el número.

Primero, tu portátil mira si ya tiene ese nombre guardado. Acaba de arrancar, así que no.

Entonces pregunta al resolutor que le dio DHCP, normalmente por UDP, el recado en el contestador del vídeo anterior.

El resolutor tampoco lo sabe, es la primera consulta del día. Así que lo busca por su cuenta.

Empieza por arriba del todo, por unos servidores que no saben la respuesta, pero sí a quién preguntar. Y así, de nivel en nivel, llega al servidor que manda en los nombres del puerto.

La respuesta es un registro de tipo A, una ficha que guarda una dirección IPv4. Y viene con un tiempo de vida, el TTL. Aquí, una hora.

Durante ese tiempo, el resolutor y tu portátil pueden contestar de memoria, sin preguntar a nadie. Pasado el plazo, lo olvidan y se vuelve a preguntar.

O sea, que DNS traduce nombres a direcciones, y su respuesta se guarda un rato. No hay una consulta nueva en cada clic.

#### Capítulo 3 · El canal: TCP y TLS

Con la dirección en la mano, el navegador abre una conexión TCP al 443 del portal. Es la llamada del vídeo anterior, la que se saluda antes de hablar.

Y aquí empieza lo nuevo. Antes de pedir nada, tu navegador y el portal montan un canal protegido. Tu navegador saluda, dice con quién quiere hablar y qué formas de cifrar conoce.

Mientras se saludan, los dos acuerdan unas claves solo para esta conversación. Y el portal enseña su certificado, que es como su DNI.

Además, demuestra que ese DNI es suyo con un secreto que solo él guarda, su clave privada. Quien solo haya copiado el certificado no puede hacer eso.

Si tu navegador da todo por bueno, desde ahí todo viaja cifrado con esas claves. Eso es TLS. Un canal protegido y, a la vez, una prueba de con quién hablas.

¿Y qué comprueba exactamente tu navegador en ese DNI del servidor? Cuatro cosas.

Primero, el nombre. El que has escrito tiene que figurar en el certificado. Si figura otro, no te sirve, por bueno que sea.

Segundo, quién lo firma. No te fías de un DNI porque lo diga el DNI, sino porque reconoces a quien lo expide.

Es una cadena. Al del portal lo firma una autoridad intermedia, y a esa, una raíz que tu equipo ya trae instalada.

Tercero, las fechas. Este vale de noviembre a mayo.

Y cuarto, que no lo hayan anulado. El servidor adjunta una respuesta reciente de la autoridad, firmada, que dice que sigue vigente.

La foto del DNI es como la clave pública, que va dentro del certificado. La cara es la clave privada, y solo la tiene el servidor.

Quien copia un DNI no tiene la cara de su dueño.

O sea, que el navegador comprueba quién es el servidor antes de mandarle nada.

#### Capítulo 4 · La petición y la segunda visita

Con el canal abierto, llega la web. El navegador pide la página en el idioma de la web, que se llama HTTP. Dice qué quiere, GET, o sea, dame, y qué página.

Si ya habías entrado antes, lleva también una cookie, una nota que te dejó el portal para reconocerte.

El servidor responde con un código, el doscientos, que quiere decir todo bien, y con la página.

Todo eso viaja dentro del canal de TLS. Por eso se llama HTTPS, HTTP con su canal seguro.

Quien mire la red ve con qué dirección hablas, y normalmente el nombre del sitio. Pero no qué página pides ni qué te contestan.

Haces tu reserva, cierras la pestaña y, tres minutos después, vuelves al portal. ¿Se repite todo lo que has visto?

Casi nada, aunque es fácil pensar que cada visita empieza de cero. La concesión sigue viva, así que no hay DHCP. Y la respuesta del DNS sigue dentro de su TTL, así que no se pregunta.

La conexión de antes, seguramente, ya se cerró. Pero el navegador puede retomar la sesión TLS con un saludo más corto.

Lo que sí va es una petición HTTP nueva, dentro del canal.

¿Y si vuelves dos horas después? El TTL ya pasó, así que hay consulta DNS. Seguramente también conexión y saludo TLS nuevos. Pero la concesión sigue valiendo.

O sea, que cada pieza tiene su propio reloj, y solo la petición va siempre.

#### Capítulo 5 · Lo que el certificado no dice

Ahora imagina otra cosa. Te llega un correo con un enlace. Lleva a una web casi igual a la del puerto, con un cero en lugar de una o.

La abres y el navegador no protesta. Certificado válido. ¿Te puedes fiar?

No basta. El certificado demuestra que hablas, cifrado, con quien controla ese nombre. Y ese nombre es el del cero.

Conseguir un certificado para un dominio propio es fácil. Solo tienes que demostrar que controlas ese nombre.

Igual que un DNI auténtico tampoco dice si quien lo lleva es honrado.

Y hay más cosas que un certificado no dice. No dice que la aplicación esté bien hecha. Un ataque puede viajar dentro de HTTPS tan tranquilo.

El cifrado protege el camino, no lo que la web hace con lo que recibe. Tampoco dice qué hará el puerto con tus datos cuando lleguen.

Y si un día el navegador te avisa de un problema con el certificado, no lo saltes. Puede que el nombre no cuadre, que falte parte de la cadena o que esté fuera de fecha, entre otras causas.

Quitar la comprobación para que funcione es quitar la protección.

O sea, que el certificado te dice con quién hablas, no si te conviene hablar con él.

Te quedas con tres reglas.

Una. Cada pieza tiene su trabajo. DHCP te configura y DNS traduce el nombre. Luego TCP abre la conversación, TLS la protege y HTTP pide la página.

Dos. No todo se repite. La concesión dura horas, la respuesta del DNS vive lo que dice su TTL, y las sesiones TLS se pueden retomar.

Tres. Un certificado válido dice con quién hablas, no si es de fiar.

Ahora te toca a ti. Abre la práctica «Diagnóstico de conectividad» y decide por qué pieza empezar.

## D. Actividades

### D.1 Durante el vídeo (pausas para decidir)

**Pausa 1 · s09 · «¿Se repite todo el proceso?»**

| Opción | Correcta | Feedback |
|---|---|---|
| Sí, todo | No | Error plausible: pensar que cada visita empieza de cero. La concesión dura ocho horas y la respuesta DNS una hora; mientras valen, no se repiten. |
| No, casi nada | **Sí** | Sin DHCP ni consulta DNS; la sesión TLS puede retomarse con un saludo corto. Lo que va siempre es la petición HTTP nueva. |

**Pausa 2 · s10 · «Certificado válido: ¿web de fiar?»**

| Opción | Correcta | Feedback |
|---|---|---|
| Sí | No | Error plausible: confundir «válido» con «de confianza». El certificado es válido para el nombre con el cero: autentica a quien controla ese nombre, no al puerto. |
| No basta | **Sí** | Un certificado demuestra con quién hablas, cifrado. Si ese «quién» es un dominio parecido, todo está en verde y aun así no es el puerto. |

### D.2 Después del vídeo

Formato `SCENES` de `src/data/security/video-learning.ts`: id `video-abrir-web-N`, objetivo `pre-10` (la segunda,
`pre-09` si se prefiere), primera `understand` y segunda `apply`.

**D.2.1 · Comprensión · qué se repite**

- **ES:** Un portátil se conecta a las 10:00 y abre la intranet por primera vez ese día. La concesión DHCP dura 12
  horas y la respuesta DNS de la intranet tiene un TTL de 600 segundos. A las 10:04 la vuelve a abrir en una pestaña
  nueva. ¿Qué es lo más probable a las 10:04?
- **EN:** A laptop connects at 10:00 and opens the intranet for the first time that day. The DHCP lease lasts 12 hours
  and the intranet's DNS answer has a TTL of 600 seconds. At 10:04 it opens the intranet again in a new tab. What is
  most likely at 10:04?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | Una concesión DHCP nueva y una consulta DNS nueva | A new DHCP lease and a new DNS query | La concesión dura 12 h y se renueva a mitad de plazo, a las 16:00; y a los 4 minutos el TTL de 10 minutos no ha vencido. |
| B | Una consulta DNS nueva, pero sin pasar por DHCP | A new DNS query, but no DHCP | Aciertas con DHCP, pero 4 minutos quedan dentro de un TTL de 600 s: la respuesta sigue en caché. |
| C | Solo DHCP, porque la dirección se renueva cada vez | Only DHCP, because the address renews every time | La concesión no se renueva por abrir webs, sino a mitad de plazo. |
| D | **Ni DHCP ni consulta DNS: una petición HTTP nueva** | **Neither DHCP nor a DNS query: a new HTTP request** | **Correcta.** Concesión y respuesta DNS siguen vigentes. Lo que siempre se hace es la petición HTTP, por una conexión nueva o reutilizada. |

- **Respuesta:** D. **Explicación:** cada pieza tiene su propio plazo. DHCP trabaja al conectarse y al renovar; la
  respuesta DNS se guarda durante su TTL (salvo que alguien vacíe la caché); la petición HTTP es de cada visita.

**D.2.2 · Aplicación · las fechas del certificado**

- **ES:** En la secretaría de un colegio, un ordenador antiguo arranca con la fecha de 2019 porque se ha agotado la pila
  que conserva la hora. Desde entonces, todas las webs con HTTPS le dan error de certificado. La red funciona, los
  nombres se resuelven y las mismas webs abren bien en los demás ordenadores. ¿Qué explica mejor el error?
- **EN:** In a school office, an old computer boots with a 2019 date because its clock battery is flat. Since then,
  every HTTPS site shows a certificate error. The network works, names resolve, and the same sites open fine on other
  computers. What best explains the error?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | El DNS devuelve direcciones guardadas desde 2019 | DNS returns addresses cached since 2019 | Los nombres se resuelven bien, y el DNS no comprueba certificados: no explicaría un error de certificado en todas las webs. |
| B | **Para esa fecha, los certificados aún no son válidos** | **For that date, the certificates are not yet valid** | **Correcta.** El navegador compara las fechas del certificado con el reloj del equipo. En 2019, los certificados de hoy todavía no han empezado a valer. |
| C | DHCP ha dejado de entregar la puerta de enlace | DHCP no longer provides the gateway | Sin puerta de enlace no saldría nada a Internet, y el enunciado dice que la red funciona. |
| D | Las webs han perdido sus claves privadas a la vez | The sites have all lost their private keys | Sería un fallo de los servidores y afectaría a todos los ordenadores; solo falla este. |

- **Respuesta:** B. **Explicación:** la vigencia es una de las cuatro comprobaciones y depende del reloj de quien
  comprueba. Cuando todas las webs fallan en un solo equipo, mira primero lo que es propio de ese equipo: aquí, su fecha.

## E. Producción y accesibilidad

### E.1 Recursos

- **Reutilizados (comprobados en el repositorio):** el portal y la naviera (`reg:396`, `reg:200`); los datos del
  certificado del portal (`video/pki-halden/src/data/s02-cadena.ts:38-41`, `s03-arreglo.ts:26-39`; `reg:397-398`); el
  OCSP grapado (`video/pki-halden/narration.json:201`); `AnchorChain.tsx` y `CaSeal.tsx` de
  `video/pki-halden/src/scenes/parts/` para s07; el estilo de `TlsLine.tsx` de `video/cripto-halden/src/scenes/parts/`
  para s06 (la línea es otra conexión, sin fecha: no se presenta como la del 3-11); `Lanes.tsx` de
  `video/iam-halden/src/scenes/parts/` para los carriles de s02 y s06; `haldenp0rt.example` (`reg:395`) para s10; la
  etiqueta y el plano de F1.
- **Nuevos:** la cinta de cinco piezas y su tabla; la tarjeta de concesión DHCP; la escalera DNS con cuenta atrás de
  TTL; la tarjeta del certificado con cuatro comprobaciones; el tubo TLS con el observador; el navegador con indicador
  neutro; las imágenes del libro de la biblioteca, la agenda del móvil y el DNI.
- **Efectos** (biblioteca del motor, `video/engine/sfx/sfx.json`): `ding` al confirmarse la concesión (s02), `ping2`
  cuando el TTL llega a cero (s05), `check` en cada comprobación del certificado (s07) y `error` al saltar el aviso de
  certificado (s11).
- **Léxico:** DHCP, DNS, TTL, TCP, TLS, HTTP, HTTPS, GET, cookie, «registro A», IPv4.

### E.2 Capítulos y duración (cálculo)

| Capítulo | Empieza en | Escenas |
|---|---|---|
| 1 · La configuración: DHCP | 0:00 | s01–s03 |
| 2 · El nombre: DNS | 1:56 | s04–s05 |
| 3 · El canal: TCP y TLS | 3:14 | s06–s07 |
| 4 · La petición y la segunda visita | 5:11 | s08–s09 |
| 5 · Lo que el certificado no dice | 6:51 | s10–s12 |

| Escena | Palabras | Segundos |
|---|---|---|
| s01 «Tres segundos» | 88 | 35 |
| s02 «¿Quién reparte?» | 108 | 42 |
| s03 «Con fecha de devolución» | 98 | 39 |
| s04 «La agenda» | 119 | 47 |
| s05 «Una respuesta que caduca» | 76 | 31 |
| s06 «Hola, soy el portal» | 142 | 55 |
| s07 «El DNI del servidor» | 162 | 62 |
| s08 «Por fin, la página» | 109 | 43 |
| s09 «Un rato después» | 131 | 57 (incluye la pausa) |
| s10 «Un correo con enlace» | 91 | 42 (incluye la pausa) |
| s11 «Lo que el canal no arregla» | 117 | 46 |
| s12 «Cinco piezas» | 88 | 35 |
| **Suma de escenas** | **1329** | **534** |
| Márgenes de la tubería (entrada, transiciones, tarjeta final) | | 20 |
| **Renderizado estimado** | | **554 (9:14)** |

Cálculo: palabras / 2.7 + 2 s de aire por escena + 5.5 s por pausa para pensar (4,5 s de tarjeta y la entrada/salida), más 20 s de márgenes. Tarjetas de examen: 6. Pausas para pensar: 2. Es una estimación: con la grabación a tempo 1 la duración real puede moverse ±10 %, y se comprueba con `build-timeline --estimate` antes de congelar.

### E.3 Información visual que la voz y la transcripción tienen que contar

| Escena | Lo que solo se ve | Cómo lo cubre la voz | Línea en la transcripción |
|---|---|---|---|
| s02 | los cuatro datos de la concesión | «la máscara… la puerta de enlace… el resolutor DNS» | `[En pantalla: dirección 192.168.20.10, máscara 255.255.255.0, puerta de enlace 192.168.20.1, resolutor 192.168.20.2]` |
| s03 | la duración y la renovación | «ocho horas… a mitad de plazo» | `[En pantalla: concesión de 8:58 a 16:58; renovación a las 12:58]` |
| s05 | el registro y su TTL | «registro de tipo A… TTL… una hora» | `[En pantalla: reservas.haldenport.example, registro A, 192.0.2.44, TTL 3600 s]` |
| s07 | los datos del certificado | «el nombre… quién lo firma… de noviembre a mayo… no anulado» | `[En pantalla: nombre reservas.haldenport.example; emisor Confianza Global TLS Issuing CA 3, raíz Confianza Global Root; válido del 9-11-2026 al 27-5-2027; respuesta OCSP grapada]` |
| s08 | la petición y la respuesta | «GET… qué página… una cookie… el doscientos» | `[En pantalla: GET /reservas, Host: reservas.haldenport.example, cookie de sesión; respuesta 200 OK]` |
| s09 | la tabla de tres columnas | se dice entera | `[En pantalla: tabla primera vez / 3 min / 2 h, como la cuenta la voz]` |
| s10 | el dominio parecido | «con un cero en lugar de una o» | `[En pantalla: haldenp0rt.example, con un cero, frente al dominio del puerto]` |

El indicador de conexión segura no lleva texto propio: la voz dice «el navegador no protesta».

## F. Revisión

### F.1 Errores conceptuales que el guion previene

| Error | Dónde se corrige |
|---|---|
| «Cada visita repite DHCP, DNS y el saludo TLS» | s09 (pausa 1); D.2.1 |
| «DHCP solo da una dirección» | s02 |
| «Si tengo dirección, tengo conexión» | s03 |
| «La respuesta del DNS es permanente» o «se pregunta en cada clic» | s05 |
| «TLS solo cifra» (se olvida de la autenticación del servidor) | s06 |
| «Basta con que el certificado sea válido; da igual para qué nombre» | s07 |
| «Certificado válido = web de confianza» (y el candado como sello de calidad) | s10 (pausa 2) |
| «HTTPS esconde también a qué sitio vas» | s08: la dirección y, normalmente, el nombre se ven |
| «HTTPS protege de los ataques a la aplicación» | s11 |
| «Ante un error de certificado, continúa o desactiva la comprobación» | s11 (es el error de f10, `fund:44`) |
| «Un error de certificado siempre es culpa del servidor» | D.2.2 (el reloj del equipo) |

**Simplificaciones conscientes:** los cuatro mensajes de DHCP no se nombran; la resolución se cuenta como «raíz y nivel
a nivel» (sin nombrar los servidores del dominio de primer nivel); en TLS 1.3 el certificado viaja ya cifrado y las
claves se acuerdan en los propios saludos, la voz solo dice «mientras se saludan»; el nombre se comprueba en el campo
de nombres alternativos del certificado, la voz dice «tiene que figurar»; la revocación se cuenta con el OCSP grapado
del portal (canon), sin CRL, y los navegadores no comprueban la revocación todos igual (pendiente de cotejar). La
conexión de la primera visita se cierra por inactividad antes de los tres minutos en la mayoría de los servidores; lo
que sobrevive es la sesión TLS, que se retoma. `.example` es un dominio reservado que en Internet no resuelve; en la
ficción del curso sí.

### F.2 Fuentes primarias

Abiertas por la revisión de exactitud del 2026-10-28: RFC 2131 («T1 defaults to (0.5 * duration_of_lease)»; al
caducar la concesión, el cliente vuelve al estado INIT), RFC 8446 (primer tercio: `CertificateVerify` firma todo el
saludo con la clave privada; con PSK no se envía `Certificate`) y RFC 9525 (el CN no se usa para identificar el
servicio). Sin abrir: el resto de la lista.

- RFC 2131 (DHCP: el intercambio y la renovación a mitad de plazo, T1 = 0,5 de la concesión) y RFC 2132 (opciones:
  máscara, router, servidores DNS).
- RFC 1034 y RFC 1035 (DNS: resolución, registro A, TTL).
- RFC 8446 (TLS 1.3: saludo, `CertificateVerify`, reanudación con PSK) y RFC 6066 (indicación del nombre del servidor
  y petición de estado OCSP).
- RFC 5280 (validación de la cadena y del periodo de validez), RFC 6960 (OCSP) y RFC 9525 (identidad del servicio:
  nombre en el campo de nombres alternativos).
- RFC 9110 (semántica de HTTP: `GET`, `Host`, `200`) y RFC 6265 (cookies).
- RFC 6761 (`.example`, nombre reservado).
- CompTIA Security+ SY0-701, objetivos 1.4, 2.2, 3.2 y 4.5 (documento 7.0).

### F.3 Comprobado en el repositorio frente a propuesta

| Dato | Estado |
|---|---|
| Nombre del portal, emisor, raíz y fechas del certificado | comprobado: `video/pki-halden/src/data/s02-cadena.ts:38-41`, `s03-arreglo.ts:26-39`, `reg:396-398` |
| OCSP stapling activo desde el 12-11 | comprobado: `video/pki-halden/src/data/s05-ocsp.ts:48-49`, `narration.json:201` |
| Línea TLS `TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey` | comprobado: `reg:400` (es la del 3-11; aquí se usa su estilo, no su fecha) |
| `haldenp0rt.example` como dominio parecido | comprobado: `reg:395`. V34 usa la misma idea, «una o cambiada por un cero», en esquema y sin dominio (`reg`, «Dominios, IP y hashes») |
| Dirección del portal `192.0.2.44`, resolutor `192.168.20.2`, concesión de 8 h, TTL 3600 s | propuesta |
| El DNI como imagen del certificado | coherente con V12, que usa la lista de DNI robados para la revocación (`video/pki-halden/narration.json:165`) |

### F.4 Pendiente de comprobar

- Que el libro de la biblioteca y la agenda del móvil no choquen con imágenes ocupadas (no figuran en `reg` §6; el
  «préstamo» de V6 es el acceso just-in-time, por eso la voz no dice «préstamo»).
- Que el DNI se pueda usar para el certificado entero y no solo para su revocación (V12). Ojo: V21 ya compara el
  certificado de cada tableta con «el carné» (`reg` §6, «el código de la escalera · el carné»); el guion dice siempre
  «DNI» y nunca «carné», para no mezclar dos imágenes del mismo concepto en un vídeo.
- El nombre del dominio parecido: `haldenp0rt.example` (V1) frente al esquema sin dominio de V34.
- Cómo se dibuja el indicador de conexión segura del navegador, sin candado.
- El objetivo de cada tarjeta de examen (00-propuesta §6), sobre todo 4.5 para DNS.
- La duración real tras `build-timeline --estimate` y la grabación.
