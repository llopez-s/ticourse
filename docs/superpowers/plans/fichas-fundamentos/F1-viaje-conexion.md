# F1 · «Cómo viaja una conexión»

> **Estado: propuesta, 2026-10-28.** Sin congelar, sin escenas ni voz. Rutas relativas a la raíz del repo; `fund` =
> `src/data/security/foundations.ts`, `prac` = `src/data/security/practicals.ts`, `reg` =
> `docs/superpowers/canon/glass-harbor.md`, `plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md`. Decisiones
> comunes a los cuatro vídeos: [00-propuesta.md](00-propuesta.md) §6.

## A. Ficha didáctica

| | |
|---|---|
| **Título** | Cómo viaja una conexión |
| **Título de YouTube** | Cómo viaja una conexión: IP, gateway, NAT y puertos · Fundamentos para Security+ |
| **Pregunta central** | ¿Qué le pasa a una conexión desde que sale de tu portátil hasta que llega a un servidor de Internet, y quién decide si pasa? |
| **Objetivos observables** | Al terminar, quien lo ve puede: (1) decir si dos equipos con prefijo /24 están en la misma red; (2) nombrar el siguiente salto hacia otra red y explicar por qué también hace falta ruta de vuelta; (3) leer los cuatro datos de una conexión (dirección y puerto de origen y de destino) y su protocolo; (4) elegir TCP o UDP según lo que necesita la aplicación; (5) explicar qué cambia NAT y qué registro hace falta para saber qué equipo salió; (6) distinguir traducir direcciones de filtrar flujos. |
| **Prerrequisitos** | Lecciones f05, f06, f07 y f08 (`fund:21-36`) leídas. No hace falta calcular subredes ni saber de memoria ningún puerto. |
| **Duración estimada** | **9:56 (596,4 s) con `build-timeline --estimate`** tras las revisiones del 2026-10-28 (1345 palabras de locución; ver G.8). La cifra de la propuesta (~9:44, 1414 palabras, cálculo en E.2) ya no vale. |
| **Práctica relacionada** | «Mapa de red» (`foundation-network`, `prac:129`), desde `#/security/study?view=practice&foundation=1`. Allí se aplica lo mismo a otra red (tres equipos y su gateway). |
| **Dónde va** | Al final de f08, antes de la práctica. Es el primer vídeo de fundamentos. |
| **Conceptos clave (5)** | misma red o no (IP y prefijo) · gateway y rutas, de ida y de vuelta · puerto y transporte (TCP/UDP) · NAT · traducir no es filtrar. |
| **Se queda en las lecciones** | cálculo de subredes y prefijos distintos de /24, IPv6, la capa de enlace (tramas, MAC), la lista de puertos habituales (22 y 3389 salen en pantalla, no se piden), DNS por TCP. |

## B. Guion audiovisual por escenas

- **Carpeta** `video/viaje-conexion/` · perfil `principal-yt` · `"track": "secplus"` · `"lesson": "f07"` (el motor solo
  lo usa en `scene-brief`, que avisará de que no lo encuentra en `src/data/secplus/`; es inofensivo) · sin
  `"adversary"` ni mensajes interceptados · voz `recording/lidia`, tempo 1 · música `Go On Going - Stayloose.mp3` ·
  `"examTiming": "sentence-end"`.
- **Sello** en todas las escenas desde s02: «Imagina · caso de entrenamiento · sin fecha · la oficina no es del
  puerto», y debajo el de siempre, «Simulación educativa · datos ficticios».
- **Hilo visual: la etiqueta.** Una tarjeta pegada al paquete con cuatro casillas, «origen» (dirección:puerto),
  «destino» (dirección:puerto) y una quinta pequeña, «TCP» o «UDP». Se dibuja siempre igual y es lo que cambia en s08.
- **El escenario, de izquierda a derecha:** la oficina de la naviera (portátil, impresora, servidor de ficheros), su
  router con el cortafuegos dentro, una nube «Internet» con tres o cuatro routers sin nombre, y a la derecha el portal
  del puerto, rotulado «Autoridad Portuaria de Halden · portal de reservas». La red interna del puerto **no** se
  dibuja.
- **Imágenes** (rotuladas «imagen · no es del puerto»): la calle y el número, el edificio y su despacho (dirección y
  puerto); los carteles de cada cruce (routing); la llamada y el recado en el contestador (TCP y UDP). NAT y cortafuegos van sin
  imagen: se ven en su tabla.
- **Datos en pantalla** (nunca en la voz): portátil `192.168.20.10/24`, impresora `192.168.20.80/24`, servidor de
  ficheros `192.168.30.10/24`, gateway `192.168.20.1` (y `192.168.30.1` en la otra pata), pública de la naviera
  `198.51.100.17`, portal `reservas.haldenport.example` en `192.0.2.44`, puertos `51422` → `61002` y `443`.

### Capítulo 1 · Tu red

#### s01 · «Un clic» · ~31 s · 78 palabras

- **Propósito didáctico:** plantear la pregunta central y la promesa en los primeros 12 s; presentar el escenario.
- **En pantalla:** el navegador con el portal de reservas y el botón «Reservar atraque»; tras el clic, «Reserva
  confirmada» y un cronómetro que se para en «0,4 s». Al decir «paso a paso», el título «Cómo viaja una conexión» y
  debajo, pequeño, «IP · gateway · NAT · puertos». Después, el plano entero (oficina, router, nube, portal) con cuatro
  chips que se encienden al nombrarlos: «por dónde sale», «qué lleva encima», «quién lo cambia», «quién decide».
- **Acciones visuales:** zoom out desde el botón hasta el plano completo; una línea discontinua une portátil y portal.
- **Narración:**

> Haces clic en «Reservar atraque» y, en menos de un segundo, la web del puerto te contesta. ¿Qué ha pasado por el camino? Hoy vas a seguir esa conexión, paso a paso.
> Imagina que trabajas en una naviera, una empresa de barcos. Reserváis atraques en el puerto de Halden, el escenario de este curso.
> Al terminar sabrás por dónde sale una conexión y qué datos lleva encima. Y también quién se los cambia y quién decide si pasa.

#### s02 · «Una dirección con dos partes» · ~54 s · 140 palabras

- **Propósito didáctico:** dirección IPv4, sus dos partes y el prefijo, sin cálculo; presentar el paquete y su
  etiqueta.
- **En pantalla:** la dirección del portátil en grande, `192.168.20.10/24`. Al decir «cuatro números», cada número se
  enmarca. Al decir «dos partes», `192.168.20` se tiñe de cian con el rótulo «la red · la calle» y `.10` de ámbar con
  «el equipo · el número». Una regla debajo: «/24 = 24 bits = 3 números × 8 bits». A la derecha, la imagen de una calle
  con portales numerados. Al final, un paquete sale del portátil con su etiqueta vacía (origen, destino).
- **Acciones visuales:** los bits se insinúan como 32 rayitas en cuatro grupos de ocho; las 24 primeras se iluminan.
- **Narración:**

> Empecemos por tu portátil. Para que algo le llegue, necesita una dirección, igual que un edificio. Es su dirección IP.
> En la versión más usada, IPv4, son cuatro números del cero al doscientos cincuenta y cinco, separados por puntos. La de tu portátil está en pantalla.
> Y tiene dos partes. Una dice en qué red estás, como el nombre de la calle. La otra dice qué equipo eres, como el número del edificio.
> ¿Y dónde acaba la calle? Lo marca el prefijo, ese «barra veinticuatro» del final. Por dentro, cada número son ocho bits, ocho casillas de unos y ceros. Así que veinticuatro bits son los tres primeros números. Esa es la red. El último, tu portátil.
> Todo lo que envías viaja troceado en paquetes. Y cada paquete lleva una etiqueta con la dirección de origen y la de destino.

#### s03 · «¿Vecina o no?» · ~48 s · 109 palabras

- **Propósito didáctico:** misma red = mismo prefijo completo; entrega directa; direcciones privadas. Primera pausa.
- **En pantalla:** la impresora `192.168.20.80/24` junto al portátil, con los tres primeros números alineados bajo
  los del portátil y un ✓ cian «misma red». Luego el servidor de ficheros `192.168.30.10/24`: los dos primeros números
  coinciden (cian) y el tercero no (ámbar). Tras la respuesta, chip «direcciones privadas» con los tres rangos en
  pequeño: `10.0.0.0/8` · `172.16.0.0/12` · `192.168.0.0/16`, y el rótulo «dentro sí · por Internet no».
- **Acciones visuales:** un paquete va del portátil a la impresora en línea recta, sin pasar por el router. Durante la
  pausa, el servidor parpadea con «¿misma red?». Tras la respuesta, la calle de la imagen se parte en dos calles.
- **Narración:**

> En la oficina hay una impresora. Su dirección empieza por los mismos tres números que la tuya. Misma calle, así que tu portátil le entrega los paquetes directamente, sin intermediarios.
> Ahora mira el servidor de ficheros de la naviera. Los dos primeros números coinciden. ¿Está en tu red?

- **Pausa para decidir** (`think`, `holdMs` 4500): «¿El servidor está en tu misma red?» · en pantalla: «Sí» / «No».

> No. Con barra veinticuatro cuentan los tres primeros números, y el tercero es distinto. Otra calle. Que empiecen igual no basta, tiene que coincidir todo el prefijo.
> O sea, que si coincide el prefijo entero, es tu red y entregas tú.
> Y un detalle que volverá luego. Las direcciones de esta oficina son privadas. Sirven dentro, pero Internet no las lleva.

- **Tarjeta de examen** (3.2): «Misma red: coincide el prefijo entero, no solo el inicio».

### Capítulo 2 · Salir de tu red

#### s04 · «La salida de tu calle» · ~59 s · 152 palabras

- **Propósito didáctico:** gateway como siguiente salto; tabla de rutas; la ruta de vuelta.
- **En pantalla:** la configuración de red del portátil con una fila resaltada, «puerta de enlace `192.168.20.1`».
  El router con tres patas rotuladas (`192.168.20.1`, `192.168.30.1` y la del proveedor) y su tabla de rutas de tres filas:
  «`192.168.20.0/24` → pata oficina» · «`192.168.30.0/24` → pata servidores» · «todo lo demás → proveedor de
  Internet». En la imagen, la salida de la calle hacia la avenida.
- **Acciones visuales:** el paquete hacia el servidor va primero al router; la fila de su red se ilumina y sale por
  la otra pata. La respuesta vuelve; al decir «si falta», una variante en ámbar: la respuesta sale del servidor y se
  queda dando vueltas con «sin ruta de vuelta».
- **Narración:**

> ¿Cómo llegas, entonces, a otra calle? Tu portátil no conoce el camino, y no le hace falta.
> Tiene apuntada una dirección especial, la del router de la oficina. El router es el aparato que une tus redes entre sí y con Internet. Cuando el destino no está en tu calle, tu portátil le entrega los paquetes a él.
> Esa dirección se llama puerta de enlace, o default gateway. O sea, la salida de tu calle.
> El router sí sabe por dónde seguir. Su tabla de rutas es como los carteles de un cruce. Dice por dónde se va a cada red y, para todo lo demás, hacia Internet. Así que manda tus paquetes a la calle del servidor.
> Pero ojo, que la vuelta también cuenta. El servidor contesta a tu dirección, así que su lado también necesita una ruta hasta tu calle. Si falta, tu petición llega y la respuesta se pierde.

- **Tarjeta de examen** (3.2): «Default gateway: el siguiente salto fuera de tu red».

#### s05 · «Hasta el puerto» · ~45 s · 114 palabras

- **Propósito didáctico:** routing salto a salto hasta Internet; cerrar el capítulo.
- **En pantalla:** el plano entero. La dirección del portal, `192.0.2.44`, se compara con las dos redes de la oficina:
  no encaja en ninguna. La fila «todo lo demás» de la tabla se ilumina. En la nube, cuatro routers sin nombre; en cada
  uno aparece un cartel de cruce con una sola flecha.
- **Acciones visuales:** el paquete salta de router en router; en cada salto se enciende solo el cartel de ese cruce,
  nunca el recorrido entero. Al llegar, el portal se ilumina.
- **Narración:**

> Ahora, el portal del puerto. Su dirección no está en ninguna de tus redes. Así que tus paquetes van a la puerta de enlace, y el router los manda hacia tu proveedor de Internet.
> De ahí, router a router, hasta el portal. Ninguno conoce el viaje entero. Cada uno mira el destino y decide solo el siguiente salto. Como los carteles de cada cruce, que no te dan la ruta, solo por dónde seguir.
> Eso es el routing, decidir en cada salto hacia dónde seguir.
> O sea, que dentro de tu calle entregas tú y, para salir, vas a la puerta de enlace. Y cada router elige el siguiente paso, también a la vuelta.

### Capítulo 3 · Puertos, TCP y UDP

#### s06 · «Edificio y despacho» · ~48 s · 123 palabras

- **Propósito didáctico:** el puerto de destino como servicio; el puerto efímero de origen; la etiqueta completa; el
  443 no prueba el contenido.
- **En pantalla:** el portal como un edificio con tres despachos numerados (`443`, `22`, `25`) y solo el `443` con luz.
  La etiqueta se completa casilla a casilla: origen `192.168.20.10:51422`, destino `192.0.2.44:443`. Junto al `51422`,
  el rótulo «efímero · lo elige tu portátil para esta conversación». Al final, la etiqueta se vuelve translúcida y
  dentro del paquete aparece un signo de interrogación: «¿qué lleva?».
- **Acciones visuales:** al decir «la conversación correcta», el navegador muestra tres conexiones abiertas, cada una
  con su puerto efímero, y la respuesta entra en la suya.
- **Narración:**

> Llegar a la máquina del portal no basta. En ella pueden estar atendiendo varios servicios a la vez. ¿Cómo sabe a cuál van tus paquetes?
> Por el número de puerto. Si la dirección es el edificio, el puerto es el despacho. La web segura suele atender en el 443.
> Tu portátil también pone un puerto de origen, uno temporal que elige para esta conversación. Así la respuesta vuelve a la conversación correcta de tu navegador. Se llama puerto efímero.
> Así que la etiqueta completa lleva cuatro datos. Dirección y puerto de origen, y dirección y puerto de destino.
> Eso sí, el número es una costumbre, no una garantía. Que algo vaya al 443 te dice a qué servicio llama, no qué lleva dentro.

- **Tarjeta de examen** (4.5): «Puerto: a qué servicio va, no qué contenido lleva».

#### s07 · «Llamada o contestador» · ~51 s · 131 palabras

- **Propósito didáctico:** TCP (conexión, orden, reenvío) frente a UDP (datagramas sin esas garantías); quién pone las
  garantías.
- **En pantalla:** a la izquierda, la imagen de una llamada: «descuelga», «¿me oyes?», «repite eso». Debajo, el saludo
  de TCP en tres flechas cortas entre portátil y portal, y tres segmentos numerados «1 · 2 · 3» con un «✓ recibido»
  por cada uno; el 2 se pierde y vuelve a salir. A la derecha, la imagen de un contestador: el recado entra y nadie
  confirma; debajo, una consulta «DNS · UDP» que no recibe respuesta y se repite. En la casilla pequeña de la
  etiqueta, «TCP».
- **Acciones visuales:** las dos columnas se encienden por turno al compás de la voz.
- **Narración:**

> Falta saber cómo se entregan. Hay dos maneras principales, y se parecen mucho a hablar por teléfono.
> La primera es una llamada. Antes de hablar, el otro descuelga y os saludáis. Luego vas comprobando que te oye y, si una frase se pierde, la repites.
> Eso es TCP, con conexión, orden y reenvío. La web suele usarlo, porque una página no puede llegar a trozos ni desordenada.
> La segunda es dejar un recado en el contestador. Lo dejas y cuelgas, sin saludo ni confirmación. Eso es UDP, más ligero.
> Lo usan consultas cortas como el DNS, que traduce nombres a direcciones. Si no llega respuesta, el programa vuelve a preguntar.
> O sea, que con TCP las garantías vienen de serie y, con UDP, si hacen falta, las pone el propio programa.

- **Tarjeta de examen** (4.5): «TCP: conexión, orden y reenvío · UDP: sin garantías».

### Capítulo 4 · La etiqueta que cambia

#### s08 · «Tachar y apuntar» · ~45 s · 115 palabras

- **Propósito didáctico:** NAT traduce dirección y, a menudo, puerto; guarda la traducción; la respuesta vuelve por la
  tabla.
- **En pantalla:** el paquete llega al router. En la etiqueta, el origen `192.168.20.10:51422` se tacha y se escribe
  encima `198.51.100.17:61002`. A la vez, la tabla de NAT gana una fila: «interno `192.168.20.10:51422` · público
  `198.51.100.17:61002` · destino `192.0.2.44:443` · hora». Con la respuesta, la tabla se consulta (la fila parpadea) y
  el destino vuelve a ser `192.168.20.10:51422`. Al final, otras tres filas de otros portátiles, todas con la misma
  pública y puertos distintos.
- **Acciones visuales:** la etiqueta se escribe a mano alzada, como quien corrige un remite. Nada se dibuja como
  muro ni escudo.
- **Narración:**

> ¿Te acuerdas de que tu dirección era privada? Pues Internet no la lleva.
> Así que, al salir de la oficina, el router hace algo más. Cambia el origen de la etiqueta por la dirección pública de la naviera, que sí viaja por Internet. Y muchas veces, también el puerto.
> Y lo apunta en una tabla. Esta conversación, de este portátil, sale ahora con este otro puerto.
> Cuando el portal responde, la respuesta llega a la dirección pública. El router busca en su tabla y se la pasa a tu portátil.
> Eso es NAT, la traducción de direcciones. Así, toda la oficina sale con una sola dirección pública, y cada conversación se distingue por su puerto.

- **Tarjeta de examen** (3.2): «NAT traduce; lo que pasa lo deciden las reglas».

#### s09 · «Lo que ve el portal» · ~44 s · 97 palabras

- **Propósito didáctico:** atribuir una conexión detrás de NAT; segunda pausa.
- **En pantalla:** el lado del portal: una línea de su registro (la voz lo explica: «apunta cada reserva»), «`198.51.100.17:61002` → reserva creada ·
  hora». Detrás de esa dirección, en la oficina, treinta siluetas de portátil iguales. Tras la respuesta, la tabla de
  NAT de la naviera con la hora y los puertos; la fila que coincide se ilumina y señala un único portátil.
- **Acciones visuales:** durante la pausa, una lupa recorre las treinta siluetas sin detenerse en ninguna.
- **Narración:**

> Ahora ponte al otro lado. El portal apunta cada reserva en su registro, con la dirección desde la que llega y la hora. Y ahí aparece la dirección pública de la naviera. ¿Puede saber el portal desde qué ordenador se hizo?

- **Pausa para decidir** (`think`, `holdMs` 4500): «¿El portal sabe qué ordenador fue?» · en pantalla: «Sí» / «No».

> No. El portal solo ve la dirección traducida, y detrás puede haber treinta personas.
> Para saberlo hace falta el registro de NAT de la naviera, con la hora y los puertos. Con esos datos se encuentra la línea que dice qué equipo salió.
> O sea, que una dirección compartida, por sí sola, no señala a nadie.

### Capítulo 5 · Traducir no es filtrar

#### s10 · «Traducir no es decidir» · ~65 s · 169 palabras

- **Propósito didáctico:** NAT no es un cortafuegos; la regla decide; primera coincidencia y denegación implícita;
  seguimiento de estado; ninguno cifra.
- **En pantalla:** un segundo paquete, de otro portátil, con destino «equipo externo · `3389` · escritorio remoto». En
  el router, dos cajas lado a lado: «NAT · traduce» y «cortafuegos · decide». La lista de reglas de salida de la naviera
  (componente de `RuleCard.tsx`, con estos datos):
  1. «Oficina → Internet · TCP 443 y 80 · permitir»;
  2. «resolutor de la oficina → Internet · UDP y TCP 53 · permitir»;
  3. (gris, sin número) «lo demás · denegar», con el rótulo «denegación implícita».

  La lista detiene el paquete del 3389 en la fila gris y la caja NAT no llega a escribir nada; a su lado, en gris, «lo
  habría traducido igual» (en el router se filtra antes de traducir el origen). Después, la
  respuesta del portal entra con el rótulo «conversación abierta desde dentro · estado». Al final, un chip sobre las
  dos cajas: «ninguno cifra · eso es TLS, en el siguiente vídeo» (sin candado: el candado es imagen de V21).
- **Acciones visuales:** la lista se lee de arriba abajo con una barra que baja fila a fila y se para en la primera que
  coincide.
- **Narración:**

> Mucha gente cree que el NAT protege. Pero proteger es decidir qué pasa y qué no. Y eso lo hace otra pieza, el cortafuegos.
> Mira. Alguien de la oficina intenta manejar a distancia un ordenador de fuera, lo que se llama escritorio remoto. El router traduciría esa conexión igual que la del portal. Para él, es una etiqueta más.
> Lo que la para es una regla. El cortafuegos tiene una lista de reglas. Cada una describe un tipo de conexión y dice si pasa o no.
> La lee de arriba abajo, aplica la primera que coincide y, si ninguna coincide, deniega. Eso es la denegación implícita. Aquí, la web sale y el escritorio remoto no.
> ¿Y la respuesta del portal, que viene de fuera? Entra porque el cortafuegos recuerda que esa conversación la abriste tú.
> NAT y cortafuegos suelen vivir en el mismo aparato, pero hacen trabajos distintos. Uno traduce y el otro decide. Y ninguno cifra, o sea, ninguno esconde lo que viaja. Eso, en el siguiente vídeo.

- **Tarjeta de examen** (4.5): «Firewall: gana la primera regla; si ninguna, deny».

#### s11 · «Ida y vuelta» · ~40 s · 102 palabras

- **Propósito didáctico:** síntesis con un solo paquete que recorre todo; ver la etiqueta en cada tramo.
- **En pantalla:** el plano entero; el paquete con su etiqueta recorre el camino y, en cada tramo, la etiqueta se
  amplía a un lado: «en la oficina» (privada:51422 → portal:443), «tras el router» (pública:61002 → portal:443),
  «en el portal» (igual). La respuesta vuelve con la etiqueta invertida y se deshace la traducción en el router.
- **Acciones visuales:** en cada parada se enciende el concepto con su chip: «gateway», «regla», «NAT», «routing»,
  «puerto efímero».
- **Narración:**

> Vamos a juntarlo todo con una sola petición. Sale de tu portátil con tu dirección privada, un puerto efímero y, como destino, el 443 del portal.
> Como el destino no es de tu calle, va a la puerta de enlace. El cortafuegos busca su regla, y la web puede salir. El router cambia el origen por la dirección pública y lo apunta.
> Router a router, llega al portal. La respuesta hace el viaje al revés. Llega a la dirección pública, la tabla la devuelve a tu portátil y, por el puerto efímero, a tu navegador.
> Todo eso, en menos de un segundo.

#### s12 · «Tres reglas» · ~34 s · 84 palabras

- **Propósito didáctico:** cierre con tres reglas prácticas y una sola acción siguiente.
- **En pantalla:** tres tarjetas numeradas que se encienden con la voz, y la tarjeta final «Alertópolis · Cómo viaja
  una conexión» con el botón «Práctica · Mapa de red».
- **Acciones visuales:** ninguna nueva; sin tarjeta de examen en esta escena.
- **Narración:**

> Te quedas con tres reglas.
> Una. Si el destino está en tu red, entregas directamente. Si no, a la puerta de enlace, y cada router decide el siguiente salto, también a la vuelta.
> Dos. La etiqueta lleva direcciones y puertos, y el puerto dice a qué servicio va, no qué contiene.
> Tres. NAT cambia la etiqueta y lo apunta. Quien decide qué pasa es el cortafuegos.
> Ahora te toca a ti. Abre la práctica «Mapa de red» y sigue el recorrido de tres equipos.

## C. Texto de locución

#### Capítulo 1 · Tu red

Haces clic en «Reservar atraque» y, en menos de un segundo, la web del puerto te contesta. ¿Qué ha pasado por el camino? Hoy vas a seguir esa conexión, paso a paso.

Imagina que trabajas en una naviera, una empresa de barcos. Reserváis atraques en el puerto de Halden, el escenario de este curso.

Al terminar sabrás por dónde sale una conexión y qué datos lleva encima. Y también quién se los cambia y quién decide si pasa.

Empecemos por tu portátil. Para que algo le llegue, necesita una dirección, igual que un edificio. Es su dirección IP.

En la versión más usada, IPv4, son cuatro números del cero al doscientos cincuenta y cinco, separados por puntos. La de tu portátil está en pantalla.

Y tiene dos partes. Una dice en qué red estás, como el nombre de la calle. La otra dice qué equipo eres, como el número del edificio.

¿Y dónde acaba la calle? Lo marca el prefijo, ese «barra veinticuatro» del final. Por dentro, cada número son ocho bits, ocho casillas de unos y ceros. Así que veinticuatro bits son los tres primeros números. Esa es la red. El último, tu portátil.

Todo lo que envías viaja troceado en paquetes. Y cada paquete lleva una etiqueta con la dirección de origen y la de destino.

En la oficina hay una impresora. Su dirección empieza por los mismos tres números que la tuya. Misma calle, así que tu portátil le entrega los paquetes directamente, sin intermediarios.

Ahora mira el servidor de ficheros de la naviera. Los dos primeros números coinciden. ¿Está en tu red?

No. Con barra veinticuatro cuentan los tres primeros números, y el tercero es distinto. Otra calle. Que empiecen igual no basta, tiene que coincidir todo el prefijo.

O sea, que si coincide el prefijo entero, es tu red y entregas tú.

Y un detalle que volverá luego. Las direcciones de esta oficina son privadas. Sirven dentro, pero Internet no las lleva.

#### Capítulo 2 · Salir de tu red

¿Cómo llegas, entonces, a otra calle? Tu portátil no conoce el camino, y no le hace falta.

Tiene apuntada una dirección especial, la del router de la oficina. El router es el aparato que une tus redes entre sí y con Internet. Cuando el destino no está en tu calle, tu portátil le entrega los paquetes a él.

Esa dirección se llama puerta de enlace, o default gateway. O sea, la salida de tu calle.

El router sí sabe por dónde seguir. Su tabla de rutas es como los carteles de un cruce. Dice por dónde se va a cada red y, para todo lo demás, hacia Internet. Así que manda tus paquetes a la calle del servidor.

Pero ojo, que la vuelta también cuenta. El servidor contesta a tu dirección, así que su lado también necesita una ruta hasta tu calle. Si falta, tu petición llega y la respuesta se pierde.

Ahora, el portal del puerto. Su dirección no está en ninguna de tus redes. Así que tus paquetes van a la puerta de enlace, y el router los manda hacia tu proveedor de Internet.

De ahí, router a router, hasta el portal. Ninguno conoce el viaje entero. Cada uno mira el destino y decide solo el siguiente salto. Como los carteles de cada cruce, que no te dan la ruta, solo por dónde seguir.

Eso es el routing, decidir en cada salto hacia dónde seguir.

O sea, que dentro de tu calle entregas tú y, para salir, vas a la puerta de enlace. Y cada router elige el siguiente paso, también a la vuelta.

#### Capítulo 3 · Puertos, TCP y UDP

Llegar a la máquina del portal no basta. En ella pueden estar atendiendo varios servicios a la vez. ¿Cómo sabe a cuál van tus paquetes?

Por el número de puerto. Si la dirección es el edificio, el puerto es el despacho. La web segura suele atender en el 443.

Tu portátil también pone un puerto de origen, uno temporal que elige para esta conversación. Así la respuesta vuelve a la conversación correcta de tu navegador. Se llama puerto efímero.

Así que la etiqueta completa lleva cuatro datos. Dirección y puerto de origen, y dirección y puerto de destino.

Eso sí, el número es una costumbre, no una garantía. Que algo vaya al 443 te dice a qué servicio llama, no qué lleva dentro.

Falta saber cómo se entregan. Hay dos maneras principales, y se parecen mucho a hablar por teléfono.

La primera es una llamada. Antes de hablar, el otro descuelga y os saludáis. Luego vas comprobando que te oye y, si una frase se pierde, la repites.

Eso es TCP, con conexión, orden y reenvío. La web suele usarlo, porque una página no puede llegar a trozos ni desordenada.

La segunda es dejar un recado en el contestador. Lo dejas y cuelgas, sin saludo ni confirmación. Eso es UDP, más ligero.

Lo usan consultas cortas como el DNS, que traduce nombres a direcciones. Si no llega respuesta, el programa vuelve a preguntar.

O sea, que con TCP las garantías vienen de serie y, con UDP, si hacen falta, las pone el propio programa.

#### Capítulo 4 · La etiqueta que cambia

¿Te acuerdas de que tu dirección era privada? Pues Internet no la lleva.

Así que, al salir de la oficina, el router hace algo más. Cambia el origen de la etiqueta por la dirección pública de la naviera, que sí viaja por Internet. Y muchas veces, también el puerto.

Y lo apunta en una tabla. Esta conversación, de este portátil, sale ahora con este otro puerto.

Cuando el portal responde, la respuesta llega a la dirección pública. El router busca en su tabla y se la pasa a tu portátil.

Eso es NAT, la traducción de direcciones. Así, toda la oficina sale con una sola dirección pública, y cada conversación se distingue por su puerto.

Ahora ponte al otro lado. El portal apunta cada reserva en su registro, con la dirección desde la que llega y la hora. Y ahí aparece la dirección pública de la naviera. ¿Puede saber el portal desde qué ordenador se hizo?

No. El portal solo ve la dirección traducida, y detrás puede haber treinta personas.

Para saberlo hace falta el registro de NAT de la naviera, con la hora y los puertos. Con esos datos se encuentra la línea que dice qué equipo salió.

O sea, que una dirección compartida, por sí sola, no señala a nadie.

#### Capítulo 5 · Traducir no es filtrar

Mucha gente cree que el NAT protege. Pero proteger es decidir qué pasa y qué no. Y eso lo hace otra pieza, el cortafuegos.

Mira. Alguien de la oficina intenta manejar a distancia un ordenador de fuera, lo que se llama escritorio remoto. El router traduciría esa conexión igual que la del portal. Para él, es una etiqueta más.

Lo que la para es una regla. El cortafuegos tiene una lista de reglas. Cada una describe un tipo de conexión y dice si pasa o no.

La lee de arriba abajo, aplica la primera que coincide y, si ninguna coincide, deniega. Eso es la denegación implícita. Aquí, la web sale y el escritorio remoto no.

¿Y la respuesta del portal, que viene de fuera? Entra porque el cortafuegos recuerda que esa conversación la abriste tú.

NAT y cortafuegos suelen vivir en el mismo aparato, pero hacen trabajos distintos. Uno traduce y el otro decide. Y ninguno cifra, o sea, ninguno esconde lo que viaja. Eso, en el siguiente vídeo.

Vamos a juntarlo todo con una sola petición. Sale de tu portátil con tu dirección privada, un puerto efímero y, como destino, el 443 del portal.

Como el destino no es de tu calle, va a la puerta de enlace. El cortafuegos busca su regla, y la web puede salir. El router cambia el origen por la dirección pública y lo apunta.

Router a router, llega al portal. La respuesta hace el viaje al revés. Llega a la dirección pública, la tabla la devuelve a tu portátil y, por el puerto efímero, a tu navegador.

Todo eso, en menos de un segundo.

Te quedas con tres reglas.

Una. Si el destino está en tu red, entregas directamente. Si no, a la puerta de enlace, y cada router decide el siguiente salto, también a la vuelta.

Dos. La etiqueta lleva direcciones y puertos, y el puerto dice a qué servicio va, no qué contiene.

Tres. NAT cambia la etiqueta y lo apunta. Quien decide qué pasa es el cortafuegos.

Ahora te toca a ti. Abre la práctica «Mapa de red» y sigue el recorrido de tres equipos.

## D. Actividades

### D.1 Durante el vídeo (pausas para decidir)

**Pausa 1 · s03 · «¿El servidor está en tu misma red?»**

| Opción | Correcta | Feedback (lo dice la voz tras la pausa; en la app, también por escrito) |
|---|---|---|
| Sí | No | Error plausible: comparar solo el principio. Los dos primeros números coinciden, pero con /24 la red son los tres primeros, y el tercero cambia. |
| No | **Sí** | Con /24, los tres primeros números forman la red; el tercero es distinto, así que es otra red y hace falta el gateway. |

**Pausa 2 · s09 · «¿Esa dirección dice qué ordenador fue?»** (la voz pregunta «¿Basta esa dirección para saber qué ordenador fue?»)

| Opción | Correcta | Feedback |
|---|---|---|
| Sí | No | Error plausible: tratar la dirección pública como si fuera de un equipo. Es de toda la oficina tras NAT; puede haber treinta equipos detrás. |
| No | **Sí** | Con esa dirección no basta: el portal ve la dirección traducida. Para llegar al portátil hace falta el registro de NAT de la naviera, con la hora y los puertos (el portal apunta la dirección y el puerto de origen, y la hora). |

### D.2 Después del vídeo

Formato compatible con `SCENES` de `src/data/security/video-learning.ts`: id `video-viaje-conexion-N`, objetivo
`pre-07`, primera `understand` y segunda `apply`.

**D.2.1 · Comprensión · traducir o filtrar**

- **ES:** Una gestoría usa NAT para que sus 25 equipos salgan a Internet con una sola dirección pública. Alguien del
  equipo dice: «Con el NAT ya no necesitamos reglas de salida». ¿Qué respuesta es correcta?
- **EN:** An accounting firm uses NAT so its 25 computers reach the Internet through one public address. Someone says:
  "With NAT we no longer need outbound rules." Which reply is correct?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | Cierto: NAT oculta los equipos y bloquea lo no permitido | True: NAT hides the hosts and blocks what is not allowed | NAT no tiene una lista de lo permitido: traduciría igual cualquier salida. Que desde fuera no se vean las direcciones internas es un efecto, no una política. |
| B | Cierto, siempre que la dirección pública no cambie | True, as long as the public address never changes | Que la pública sea fija cambia cómo te ven desde fuera, no qué flujos dejas salir. |
| C | **Falso: NAT traduce, y qué sale lo deciden las reglas** | **False: NAT translates; rules decide what leaves** | **Correcta.** NAT cambia direcciones y puertos y apunta la traducción. Decidir qué flujos pasan es de las reglas del cortafuegos (origen, destino, protocolo, puerto y acción). |
| D | Cierto para la salida: las reglas solo hacen falta para lo que entra | True for outbound: rules are only needed for inbound traffic | NAT traduciría cualquier salida. Sin reglas de salida, sale todo lo que inicie un equipo, también lo que no debería. |

- **Respuesta:** C. **Explicación:** traducir y filtrar son trabajos distintos aunque vivan en el mismo aparato; sin
  reglas de salida, cualquier conexión que inicie un equipo saldría traducida.

**D.2.2 · Aplicación · la ruta de vuelta**

- **ES:** En un centro de salud, la red de consultas (`10.8.1.0/24`) y la de radiología (`10.8.2.0/24`) se unen con un
  router. Un equipo de consultas pide una imagen al servidor de radiología. La captura muestra que la petición llega,
  pero la respuesta nunca vuelve. Las direcciones y máscaras de los dos equipos son correctas. ¿Qué revisas primero?
- **EN:** At a health centre, the consulting-room network (`10.8.1.0/24`) and the radiology network (`10.8.2.0/24`) are
  joined by a router. A consulting-room computer requests an image from the radiology server. A capture shows the
  request arrives but the reply never comes back. Both hosts have correct addresses and masks. What do you check first?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | **La ruta de vuelta, empezando por el gateway del servidor** | **The return path, starting with the server's gateway** | **Correcta.** La ida funciona y falla la vuelta. Con un solo router, la ruta entre las dos redes la tiene de serie; el sospechoso es el gateway configurado en el servidor. Si hubiera más routers, también sus rutas hacia consultas. |
| B | El puerto efímero que eligió el equipo de consultas | The ephemeral port chosen by the consulting-room host | El puerto efímero sirve para entregar la respuesta a la aplicación correcta cuando llega; no decide si la respuesta sale de radiología hacia otra red. |
| C | Ampliar las máscaras para que las dos redes sean una | Widen the masks so both networks become one | Cambiar máscaras para saltarse el router rompe el diseño y la separación entre redes, y esconde el fallo de rutas en vez de arreglarlo. |
| D | Activar NAT entre la red de consultas y la de radiología | Enable NAT between the two internal networks | NAT traduce direcciones; entre dos redes internas enrutadas no hace falta y taparía el problema real, que es la ruta de vuelta. |

- **Respuesta:** A. **Explicación:** una comunicación entre redes necesita camino en los dos sentidos. Si la petición
  llega y la respuesta no, el sospechoso es la vuelta: primero el gateway del que responde y, si hay más routers, sus
  rutas hacia la red de origen.

## E. Producción y accesibilidad

### E.1 Recursos

- **Reutilizados (comprobados en el repositorio):** el portal y su nombre (`reg:396`); «una naviera» como cliente
  (`reg:200`); `RuleCard.tsx` de `video/zero-trust-halden/src/scenes/parts/` como base de la lista de reglas de s10
  (copiar el componente y cambiar sus datos, que son los del ERP de V20); iconos, tema, sellos, tarjetas de examen y
  pausas del motor (`video/engine/src/`); la música de biblioteca de V18 y V28.
- **Nuevos:** el plano oficina–router–Internet–portal; la etiqueta de cinco casillas (componente propio, reutilizable
  en F2 y F4); la tabla de rutas; la tabla de NAT; las imágenes de la calle, el edificio con despachos, los carteles de
  cruce y la llamada frente al recado en el contestador.
- **Efectos (`sfx`)**, cuatro, todos de la biblioteca del motor (`video/engine/sfx/sfx.json`): `ping2` con la
  respuesta del portal en s01, `check` cuando el paquete llega a la impresora (s03), `typing` al reescribir la
  etiqueta (s08) y `block` cuando la regla para el escritorio remoto (s10).
- **Léxico** (`lexicon.json`): IPv4, TCP, UDP, DNS, NAT, TLS, default gateway, «barra veinticuatro», «443»
  (Lidia decide si «cuatro, cuatro, tres» o «cuatrocientos cuarenta y tres»; el guion lo escribe en cifra).

### E.2 Capítulos y duración (cálculo)

> Cifras de la propuesta. Las vigentes tras las revisiones del 2026-10-28 (capítulos en 0:00, 2:19, 3:54, 5:47 y 7:21; total 9:56) están en G.8.

| Capítulo | Empieza en | Escenas |
|---|---|---|
| 1 · Tu red | 0:00 | s01–s03 |
| 2 · Salir de tu red | 2:13 | s04–s05 |
| 3 · Puertos, TCP y UDP | 3:57 | s06–s07 |
| 4 · La etiqueta que cambia | 5:36 | s08–s09 |
| 5 · Traducir no es filtrar | 7:05 | s10–s12 |

| Escena | Palabras | Segundos |
|---|---|---|
| s01 «Un clic» | 78 | 31 |
| s02 «Una dirección con dos partes» | 140 | 54 |
| s03 «¿Vecina o no?» | 109 | 48 (incluye la pausa) |
| s04 «La salida de tu calle» | 152 | 59 |
| s05 «Hasta el puerto» | 114 | 45 |
| s06 «Edificio y despacho» | 123 | 48 |
| s07 «Llamada o contestador» | 131 | 51 |
| s08 «Tachar y apuntar» | 115 | 45 |
| s09 «Lo que ve el portal» | 97 | 44 (incluye la pausa) |
| s10 «Traducir no es decidir» | 169 | 65 |
| s11 «Ida y vuelta» | 102 | 40 |
| s12 «Tres reglas» | 84 | 34 |
| **Suma de escenas** | **1414** | **564** |
| Márgenes de la tubería (entrada, transiciones, tarjeta final) | | 20 |
| **Renderizado estimado** | | **584 (9:44)** |

Cálculo: palabras / 2.7 + 2 s de aire por escena + 5.5 s por pausa para pensar (4,5 s de tarjeta y la entrada/salida), más 20 s de márgenes. Tarjetas de examen: 6. Pausas para pensar: 2. Es una estimación: con la grabación a tempo 1 la duración real puede moverse ±10 %, y se comprueba con `build-timeline --estimate` antes de congelar.

### E.3 Información visual que la voz y la transcripción tienen que contar

La voz no lee direcciones ni puertos (regla 5 del `plan` §1). Para que quien no ve la pantalla, o quien usa la
alternativa por transcripción, pueda resolver las actividades, la transcripción lleva una línea `[En pantalla: …]` en
estos puntos (no entran en los subtítulos, que siguen el audio):

| Escena | Lo que solo se ve | Cómo lo cubre la voz | Línea en la transcripción |
|---|---|---|---|
| s02 | la dirección del portátil y su prefijo | «cuatro números… barra veinticuatro… los tres primeros son la red» | `[En pantalla: portátil 192.168.20.10/24; la red son los tres primeros números]` |
| s03 | impresora y servidor con sus direcciones; rangos privados | «empieza por los mismos tres números… el tercero es distinto… privadas» | `[En pantalla: impresora 192.168.20.80/24, misma red; servidor 192.168.30.10/24, otra red. Rangos privados: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16]` |
| s04 | gateway y tabla de rutas | «la del router… su tabla de rutas… dice por dónde se va a cada red» | `[En pantalla: puerta de enlace 192.168.20.1; rutas: 192.168.20.0/24 y 192.168.30.0/24 directas, el resto hacia el proveedor]` |
| s06 | la etiqueta completa | «dirección y puerto de origen, y dirección y puerto de destino» | `[En pantalla: origen 192.168.20.10:51422, destino 192.0.2.44:443, TCP]` |
| s08 | la fila de la tabla de NAT | «cambia el origen… y lo apunta en una tabla» | `[En pantalla: 192.168.20.10:51422 sale como 198.51.100.17:61002 hacia 192.0.2.44:443]` |
| s10 | la lista de reglas | «cada una describe un tipo de conexión y dice si pasa o no… la primera que coincide» | `[En pantalla: regla 1 permite TCP 443 y 80 de la oficina a Internet; regla 2 permite el DNS del resolutor; el resto se deniega. El escritorio remoto (TCP 3389) no coincide con ninguna]` |

Además: ningún dato depende solo del color (cian/ámbar van siempre con rótulo), y las etiquetas clave a 48–60 px,
comprobadas a 480 px de ancho (`plan` §1, «Claridad y ritmo»).

## F. Revisión

### F.1 Errores conceptuales que el guion previene

| Error | Dónde se corrige |
|---|---|
| «Si dos direcciones empiezan igual, están en la misma red» | s03 (pausa 1): cuenta el prefijo entero |
| «El router conoce el camino completo hasta el destino» | s05: cada router decide solo el siguiente salto |
| «Basta con que la petición llegue» | s04 y s11: la ruta de vuelta; actividad D.2.2 |
| «El puerto 443 garantiza que es web, y web legítima» | s06 (el puerto dice a qué servicio apunta por costumbre, no qué contiene) |
| «TCP es más seguro que UDP» | s07 habla de garantías de entrega, nunca de seguridad |
| «La dirección pública identifica a la persona o al equipo» | s09 (pausa 2) |
| «NAT protege / es un cortafuegos / cifra» | s10; actividad D.2.1 |
| «El cortafuegos bloquea todo lo que viene de fuera, también las respuestas» | s10: seguimiento de estado |
| «Cambiar la máscara es una forma de llegar a otra red» | actividad D.2.2, opción C (lo dice f06, `fund:28`) |

**Simplificaciones conscientes** (correctas para este nivel, ampliables en la lección): el portátil decide «misma red
o no» comparando con su propio prefijo; en la red local la entrega usa la capa de enlace, que no se nombra. El paquete
«va al gateway» significa que se le entrega al router como siguiente salto, sin cambiar la dirección de destino. NAT
«a menudo» cambia el puerto (NAPT); no siempre. El seguimiento de estado se presenta en una frase. NAT descarta lo
que llega de fuera sin una fila en su tabla, pero eso es un efecto, no una política (por eso, desde las revisiones del 2026-10-28, la tarjeta de s08 dice «NAT traduce direcciones y puertos y apunta la traducción»
y la de s10 dice «deciden las reglas»). «La web suele usar TCP»: HTTP/3 va sobre QUIC, por UDP, y pone las garantías en
el propio programa, que es lo que dice la última frase de s07.

**Matices que quedan fuera de la voz (decisión del 2026-10-28, solo documentación):**

- *Objetivos de las tarjetas (3.2 / 4.5).* Es una decisión editorial: s03, s04 y s08 se apoyan en 3.2 y s06, s07 y s10 en 4.5 de forma
  aproximada (las direcciones, el gateway y NAT caben en redes; el puerto, TCP/UDP y las reglas del cortafuegos, en operaciones).
  Si el objetivo exacto de alguna tarjeta importa, `examBadge` admite otro texto.
- *Asimetría del enrutamiento.* El vídeo cuenta que ida y vuelta necesitan ruta; no dice que en Internet pueden ir por caminos distintos
  (enrutamiento asimétrico). Es cierto y queda para la lección.
- *Las pausas 1 y 2 reutilizan ideas de f06 y f07 a propósito* (prefijo entero; la dirección pública no identifica al equipo), según
  `00-propuesta.md` §6: el vídeo las pone como pregunta, la lección las da como texto.
- *La analogía de la llamada y el contestador.* La llamada TCP no reserva una línea (en una red de paquetes no hay circuito
  reservado) y el recado de UDP no «espera»: se entrega o se pierde. Es una imagen para las garantías, no un modelo de la red; por
  eso no hay línea reservada en pantalla y el recado «entra» sin que nadie confirme.
- *Seguimiento de estado y tabla de NAT.* En la práctica suelen ser **la misma tabla** (el cortafuegos con NAT guarda una entrada por
  conexión); el vídeo los separa en dos piezas con dos trabajos para que no se confundan, y lo dice con «uno traduce y el otro decide».

### F.2 Fuentes primarias

Revisión de exactitud del 2026-10-28: ninguna de las fuentes de esta lista se abrió para F1 (sus comprobaciones se
apoyaron en las lecciones y en el razonamiento técnico). Quedan pendientes de cotejo antes de congelar.

- RFC 791 (IPv4) y RFC 4632 (notación con prefijo).
- RFC 1918 (direcciones privadas) y RFC 5737 (rangos de documentación, los de las direcciones públicas del vídeo).
- RFC 1122 (requisitos de los equipos: entrega directa en la red local o al gateway).
- RFC 9293 (TCP) y RFC 768 (UDP).
- RFC 3022 (NAT tradicional y NAPT).
- RFC 6335 y el registro de puertos de IANA (443 para HTTPS, 3389 para escritorio remoto; rango dinámico 49152–65535).
- CompTIA Security+ SY0-701, objetivos 3.2 y 4.5 (documento 7.0, el que cita `src/data/security/objectives.ts:1`).

### F.3 Comprobado en el repositorio frente a propuesta

| Dato | Estado |
|---|---|
| El portal se llama `reservas.haldenport.example`; una naviera es cliente | comprobado: `reg:396`, `reg:200` |
| Números del portátil, impresora y servidor | propuesta; son los del ejemplo resuelto de f06 (`fund:28`) |
| Puertos 51422 y 61002 | propuesta; son los de los ejemplos de f05 y f07 (`fund:24`, `fund:32`) |
| `198.51.100.17` (naviera) y `192.0.2.44` (portal) | propuesta; no aparecen en `reg` (búsqueda del 2026-10-28) |
| Reglas de salida de la naviera | propuesta; ningún dato del puerto |
| Modelo de cortafuegos del curso: primera coincidencia y denegación implícita | comprobado: f08, `fund:36` |

### F.4 Pendiente de comprobar

- Que Lidia acepte situar F1 y F2 fuera del puerto, en la oficina de la naviera.
- La imagen «etiqueta»: V1 (capas-halden) ya compara las cabeceras del correo con «la etiqueta de envío de un paquete»
  (`plan` §1, ejemplo de s02) y V17 dibuja IPSec como un envío (`video/fronteras-halden/src/scenes/parts/Shipment.tsx`).
  Aquí la etiqueta es la cabecera IP: el mismo concepto (cabecera), sin envío ni mensajería. Si se prefiere no tocarla,
  la alternativa es «la cabecera» a secas, sin imagen.
- La llamada y el recado en el contestador no figuran como imagen ocupada en `reg` §6; los canales de voz de V34 son otra cosa
  (ingeniería social). Confirmarlo en la revisión de canon.
- El objetivo de cada tarjeta de examen (00-propuesta §6).
- La duración real tras `build-timeline --estimate` y la grabación.

## G. Decisiones tomadas (fase 1)

> **2026-10-28.** Fase 1 hecha: carpeta `video/viaje-conexion/` con `video.json`, `storyboard.json`, `narration.json`,
> `lexicon.json` y `lexicon.chatterbox.json` (idénticos), andamio de escenas con un stub por id y póster provisional. **Sin
> congelar** (no hay `"frozen"`), sin escenas montadas, sin voz. Lo que decía la ficha como pendiente (F.4) se resuelve con la
> opción recomendada, pero ninguna decisión editorial es definitiva hasta que Lidia congele el guion.

### G.1 Comprobaciones (rama `video-viaje-conexion`)

| Comprobación | Resultado |
|---|---|
| `build-timeline --video viaje-conexion --estimate` | 12 escenas, 76 segmentos, 1414 palabras, 6 tarjetas de examen, 2 pausas para pensar, 77 cues. **Un solo aviso: duración estimada 625,2 s (10:25), fuera de la ventana de `principal-yt` (380 a 600 s).** Ningún otro aviso (ni de emoción repetida, ni de frases largas, ni de identificadores leídos, ni de léxico). |
| `script-sheets` | solo el aviso de «no congelado» |
| `canon-check` | 6 tokens: 1 con historia (`reservas.haldenport.example`) y 5 nuevos (`192.168.20.1`, `192.168.30.1`, `192.168.20.10`, `192.0.2.44`, `198.51.100.17`). Ningún nombre choca. **Pero hay un choque que `canon-check` no ve: ver G.4.** |
| `brand-yt.test.mjs` | pasa (el póster dice «ALERTÓPOLIS») |
| `tsc` | no se lanzó (falta de memoria, según el encargo). Los stubs y el póster copian el molde de `zonas-halden` sin cambios de forma |

### G.2 Duración: 625 s frente a los 584 s de la ficha

El cálculo de E.2 usa 2,7 palabras por segundo; `build-timeline --estimate` usa **2,5** (`TIMING.estimateWordsPerSec`), más
pausas de 0,44 s de media (33,5 s en total), 9 s de las dos pausas para pensar y las entradas de escena. Con la misma
locución, el motor da 625 s. Dos lecturas:

- Con la lectura real de Lidia (85 a 93 % del estimado en V5, V5b, V7, V8 y V9) saldrían unos **530 a 580 s**, dentro de la
  ventana. El aviso es del estimado, no de la grabación.
- Aun así, no se puede bajar de 600 con solo recortar pausas: a 250 ms todas, el total sería unos 611 s. Se dejó el ritmo
  natural (350 a 650 ms) y **no se tocó el contenido**. Si se quiere un estimado dentro de la ventana, hay que quitar unos
  25 s (unas 63 palabras con sus pausas). Frases de apoyo que repiten algo que se dice en otro sitio: `s05-07` (5,1 s, la
  repite `s12-02`), `s07-06` (8,8 s, el ejemplo del DNS), `s10-03` (6,9 s, «para él es una etiqueta más») y `s09-05` (5,3 s);
  suman unos 26 s. Decide Lidia al congelar.

### G.3 Cambios respecto a la ficha (todos de forma, ninguno de contenido)

| Qué | Por qué |
|---|---|
| **Ids de escena con nombre**: `s01-clic`, `s02-direccion`, `s03-vecina`, `s04-salida`, `s05-internet`, `s06-despacho`, `s07-llamada`, `s08-tachar`, `s09-portal`, `s10-decidir`, `s11-ida-vuelta`, `s12-reglas` | el motor exige `sNN-nombre`; los stubs salen como `S01Clic`…`S12Reglas` |
| **Ids de segmento** `sNN-MM`, 76 en total | los párrafos de la parte C se parten en segmentos de 8 a 30 palabras; las frases no cambian ni se reordenan |
| **Segmentos partidos** (un párrafo de la ficha pasa a dos o tres): s01 (P1), s02 (P4 en tres), s03 (P1), s04 (P2, P4 y P5), s05 (P1, P2 y P4), s06 (P3), s07 (P2), s08 (P2), s09 (P1 y P3), s10 (P2, P4 y P6), s11 (P2 y P3), s12 (P1 y P2 se reparten distinto) | la ficha tenía párrafos de 34 a 45 palabras; el validador avisa a partir de 30 |
| **Segmentos unidos**: «Y muchas veces, también el puerto.» va con la frase anterior (s08-03); «Todo eso, en menos de un segundo.» va con la anterior (s11-05); «Te quedas con tres reglas.» y «Una.» van en un solo segmento (s12-01) | cada uno de esos trozos tenía menos de 8 palabras |
| **Cue `title` al inicio de la segunda frase de s01** («¿Qué ha pasado por el camino? Hoy vas a seguir…»), no sobre «paso a paso» | sobre «paso a paso» el título llegaría hacia el segundo 12; así entra hacia el segundo 7 |
| **Etiquetas de emoción** `<…>` asignadas a los 76 segmentos | la ficha no las traía; se alternan para no repetir la misma en dos seguidos |
| **Tags de YouTube** (18): IP, dirección IP, IPv4, prefijo /24, subred, default gateway, puerta de enlace, routing, NAT, puertos, TCP, UDP, firewall, cortafuegos, fundamentos de redes, fundamentos de ciberseguridad, Security+, SY0-701 | la ficha solo traía el título |
| **`"lesson"` omitido** de `video.json` | el motor solo admite ids `sNN`/`spNmN` (`/^sp?\d+m\d+$/`) y `f07` es un error, no un aviso. Sin él, `youtube-meta` no enlaza la lección en la descripción y `scene-brief` no la localiza (la cita a mano en «Canon») |
| **`"examTiming": "sentence-end"` en `narration.json`**, no en `video.json` | es donde el motor lo lee (README del motor, «Claridad y ritmo») |
| **Escena `s05-internet`** conserva el título «Hasta el puerto» de la ficha | pendiente de revisar: «puerto» ya significa puerto de red desde s06; si Lidia lo prefiere, «Hasta el portal» |
| **Sello «Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto»** escrito en el `goal` de cada escena desde s02 | ningún campo del motor lo recoge; `notice` y `simulationLabel` *sustituirían* el sello de «Simulación educativa · datos ficticios», que la ficha quiere conservar |

### G.4 Hallazgo de canon: `198.51.100.7` ya existe en GCTI (resuelto)

El choque era con **`198.51.100.7`**, la dirección original de la naviera: es `blog-recetas.example` en la lista de relleno de V4
(`video/pivot-infra/src/scenes/S03Pdns.tsx:24` y `:50`; `docs/superpowers/canon/velvet-cicada.md:421`). La propuesta
(`00-propuesta.md` §6) decía que no estaba en `reg`; era cierto para `glass-harbor.md`, pero `canon-check` solo lee la campaña de la
pista. Lo mismo pasaba con `198.51.100.90` de F4, que es `tienda-flores.example` en ese listín.

**Resolución (2026-10-28).** F1 y F2 usan **`198.51.100.17`**, el valor **nuevo y libre** (no aparece en ningún archivo del repo salvo
estos documentos), y la dirección del sitio de subidas de F4 pasa a `198.51.100.117`. Un primer reemplazo a ciegas dejó escrito en
esta sección y en el brief de escenas que «`198.51.100.17` es `blog-recetas.example`»; era un error de redacción, no un choque nuevo.
La constante `PUBLIC_IP` (`video/viaje-conexion/src/scenes/parts/data.ts`) concentra la dirección en un solo sitio.

### G.5 Pendientes de F.4, resueltos con la opción recomendada

| Pendiente | Resolución |
|---|---|
| F1 y F2 fuera del puerto | **Fuera, en la oficina de la naviera.** Sigue siendo suposición a confirmar por Lidia |
| La imagen «etiqueta» | **Se queda como «la etiqueta» = cabecera IP/TCP**, sin envío ni mensajería. El componente `Shipment.tsx` de V17 **no se reutiliza**; la etiqueta es una pieza propia (`Label.tsx`). La alternativa («la cabecera» a secas) queda como plan B |
| La llamada y el recado en el contestador | Comprobado: ninguna fila de `glass-harbor.md` usa llamada ni contestador como imagen (búsqueda de «contestador» sin resultados). Se confirma en la revisión de canon |
| Objetivo de cada tarjeta de examen | Se mantienen los de la ficha: 3.2 (s03, s04, s08) y 4.5 (s06, s07, s10); la tarjeta dice «EXAMEN · SY0-701 · N.N» (no se pone `examBadge`) |
| Duración real | Ver G.2 |

### G.6 Léxico y efectos

- `lexicon.json` y `lexicon.chatterbox.json`: `IP`, `IPv4`, `TCP`, `UDP`, `DNS`, `NAT` y `443`. **`443` se dice
  «cuatro cuatro tres» de forma provisional**: la ficha deja la elección a Lidia («cuatro, cuatro, tres» o «cuatrocientos
  cuarenta y tres»). Se puso en el léxico porque, sin entrada, el validador avisa de que la cifra puede leerse mal. Si cambia,
  basta editar los dos archivos y volver a ejecutar `build-timeline` antes de importar la grabación. `TLS` y `default
  gateway` no entran: la voz no dice `TLS`, y el léxico no admite entradas con espacio.
- `sfx`: `ping2` en `reply` (s01), `check` en `direct` (s03), `typing` en `rewrite` (s08) y `block` en `stop` (s10); el motor añade
  `ding` en cada tarjeta y `whoosh` en cada capítulo. `public/sfx/` lo genera `build-timeline`; no se versiona.
- Voz `recording/lidia`, sin `recording.tempo`, con `"recording": { "maxPauseMs": 250 }`. Sin `adversary` y sin mensajes
  interceptados (el motor admite 0 cuando no hay adversario).

### G.7 Lo que la ficha pide y el motor aún no hace

- **Líneas `[En pantalla: …]` de E.3 en la transcripción.** `build-timeline` no tiene ningún campo para escribirlas (solo
  `script-sheets` imprime «En pantalla» en la hoja de grabación). Hay que añadirlas a mano al `.txt` publicado o ampliar el
  motor; queda para la fase de publicación.
- **`RuleCard.tsx` de `zero-trust-halden`** no sirve tal cual para s10: es una sola fila de cuatro campos, sin número de regla y,
  por diseño, sin las palabras permitir/denegar (ver su comentario de cabecera). El brief pide **copiarlo y adaptarlo** a una
  lista de tres filas con barra de lectura, no importarlo.
- **Tarjeta de examen en escena con pausa para pensar:** s03 lleva las dos; la tarjeta espera al final de la oración
  «O sea, que si coincide el prefijo entero…», ya fuera de la pausa, así que no se solapan en el tiempo.

- **IP de la naviera cambiada (2026-10-28):** `198.51.100.7` choca con `blog-recetas.example` del listín de V4 (`video/pivot-infra/src/scenes/S03Pdns.tsx`, `velvet-cicada.md:421`); F1 y F2 usan ahora `198.51.100.17`, libre en todo el repo. La dirección del sitio de subidas de F4 pasa de `198.51.100.90` a `198.51.100.117` por el mismo motivo (`tienda-flores.example`).

### G.8 Revisiones aplicadas (2026-10-28)

Se aplicaron la revisión de exactitud y la de naturalidad, y se recortó la locución para entrar en la ventana de `principal-yt`.
**El guion sigue sin congelar** (`video.json` no lleva `"frozen"`). La locución vigente es `video/viaje-conexion/narration.json`; las
partes B y C de esta ficha y la tabla de E.2 conservan el texto y las cifras de la propuesta y ya no coinciden con ella.

**Cifras nuevas** (`build-timeline --video viaje-conexion --estimate`, sin avisos): **596,4 s (9:56)**, 73 segmentos (eran 76), 1345 palabras
(eran 1414), 77 cues, 6 tarjetas de examen, 2 pausas para pensar. Antes: 625,2 s. Por escena (s): s01 33,7 · s02 56,9 · s03 48,6 ·
s04 60,2 · s05 35,3 · s06 57,0 · s07 55,4 · s08 51,0 · s09 43,1 · s10 72,9 · s11 42,9 · s12 39,5. Capítulos: 1 en 0:00, 2 en 2:19, 3 en 3:54,
4 en 5:47, 5 en 7:21. `storyboard.json` lleva ya esos `targetSec`/`wordBudget` (`targetTotalSec` 596).

**Recortes aplicados (A a I)**

| | Qué | Ahorro aprox. |
|---|---|---|
| A | s05-04 sin «Como los carteles de cada cruce…» | 6,4 s |
| B | s03-04 sin «Que empiecen igual no basta…» (se quedó esa y no la variante de naturalidad 9) | 4,4 s |
| C | s05-07 borrada; la pausa de s05-06 sube de 350 a 650 ms; s05-05 queda en «Eso es el routing.» | 4,75 s + 1,5 s |
| D | s09-04 + s09-05 fundidas en s09-04 (cues `natlog` y `match` intactos; los dos puntos del texto propuesto pasan a punto, porque el validador avisa de conectores con dos puntos) | 2,85 s |
| E | s10-03: «Para el NAT, esa conexión es una etiqueta más.» | 2,8 s |
| F | s07-06: «Lo usa el DNS, que traduce nombres a direcciones. Si no llega respuesta, el programa vuelve a preguntar.» (anclas `respuesta` y `preguntar` conservadas) | 1,2 s |
| G | s10-04: «El cortafuegos tiene una lista, y cada regla dice si un tipo de conexión pasa o no.» | 1,2 s |
| H | s10-08: «…en el mismo aparato, pero uno traduce y el otro decide.» | 1,2 s |
| I | s04-01/02 sin «Tu portátil no conoce el camino…» | 3,6 s |

**Exactitud aplicada.** (1) `S04Salida`: ya no se tacha la fila `192.168.20.0/24 → pata oficina` (es una ruta conectada y se enciende en
`back`); el fallo se señala en el servidor, con «sin ruta de vuelta» y «falta o falla la puerta de enlace del servidor» en ámbar. (2) El
«reescrito fantasma» de s10 usa un par propio, `192.168.20.34:50761 → 198.51.100.17:61006` (`RDP_NAT` en `data.ts`), y no una fila web.
(3) s09-02/03: «¿Basta esa dirección para saber qué ordenador fue?» / «No. Con esa dirección no basta, detrás puede haber treinta equipos.»;
`think.q` «¿Esa dirección dice qué ordenador fue?»; D.1 actualizado. (4) s09-01 dice «con la dirección y el puerto de origen, y la hora» y
la tabla se rotula «registro de NAT de la naviera · traducciones guardadas». (5) s06-06 «te dice a qué servicio dice llamar», s12-03 «el
puerto dice a qué servicio apunta» (también en la tarjeta de la regla 2). (6) Tarjeta de s08 «NAT traduce direcciones y puertos y apunta la
traducción»; «deciden las reglas» pasa a la de s10. (7) Documentación: G.4 y `out/scene-brief.md` (el choque era con `.7`, no con `.17`);
`00-propuesta.md` §6 ya traía `.17` y `.117` desde el commit `ddd319b8`, así que solo se amplió el porqué. (8) Voz: s03-02 «sin pasar por el
router», s11-04 «La respuesta vuelve.», s06-05 «cuatro datos y el protocolo», s05-03 «Ninguno decide el viaje entero», s10-05 «…en este
modelo», s10-09 «Y ninguno esconde lo que viaja. El contenido sigue a la vista de quien lo mire por el camino.»; en pantalla, la regla 3 de
s10 dice «lo demás hacia Internet». (9) Lo que era solo documentación está en F.1.

**Naturalidad aplicada.** s06-02 «ojo, que no hablo del de los barcos» y s05-01 «el portal de Halden. Su dirección no es de tu calle.»;
s07-04 «incompleta ni desordenada»; s12-01 «Te quedas con tres ideas» y el título de la escena, «Tres ideas»; s08-04 «Y lo apunta, con la
hora, en otra tabla…»; s02-05/06 (ocho bits, «Tres números de ocho bits son veinticuatro»); «conexión» como palabra fija en s06-03, s06-04,
s08-06, s10-07 (y en los rótulos de pantalla de s06, s08 y s10); s04-08 «la petición llega pero la respuesta se pierde»; s10-01 «o
firewall»; ahorros: s04-03, s04-07, s02-02, s10-02 (sin «Mira.»), s01-03 (sin glosa), s07-01 sin «principales», s07-03 con «hablas por
turnos», s11-05 «la tabla se la devuelve a tu portátil». Léxico: `router` «rúter», `routing` «rútin», `default` «defólt», `gateway`
«guéitwei» y `efímero`, iguales en los dos archivos (el validador no admite claves con espacio, así que «default gateway» va en dos
entradas). En la hoja de grabación (`out/`, no versionada) se anotó que «443» se lee «cuatro cuatro tres» en s06-02, s06-06 y s11-01.

**Desviaciones de lo pedido (a conocer, no absorbidas en silencio)**

- **s04-01/02.** El texto propuesto de s04-02 («Tu portátil tiene apuntada la dirección de un aparato de la oficina, el router, que conecta
  tu red con las demás y con Internet.») tiene 24 palabras en una frase (máx. 22) y s04-01 se quedaba en 6 (mín. 8). Quedó repartido: s04-01
  «¿Cómo llegas, entonces, a otra calle? Pues tu portátil tiene apuntada la dirección de un aparato de la oficina.» y s04-02 «Es el router, el
  que conecta tu red con las demás y con Internet.»; el cue `config` pasó a s04-01 (tras la pregunta, cuando se apaga el «?»).
- **s05-05 se fundió en s05-04** (4 palabras, bajo el mínimo): `{routing}Eso es el routing.` cierra s05-04 y el segmento s05-05 desapareció.
- **s06-02 «La web segura va al 443.»** en vez de «suele atender en el 443»: con la frase nueva de «ojo» el segmento pasaba de 30 palabras (aviso).
  Se pierde el «suele»; lo cubre s06-06 («el número es una costumbre»). Alternativa si se prefiere el matiz: quitar «ojo,» y decir «suele ir al 443».
- **Tarjeta de s06 sin «por costumbre»:** «Puerto: a qué servicio apunta, no qué contenido lleva» (53). La propuesta («…apunta por costumbre, no qué
  contenido lleva») tiene 67 caracteres y el motor admite 58. La de s10 queda en 58 exactos: «Firewall: deciden las reglas, gana la primera; si no, deny».
- **s06-06 «te dice a qué servicio dice llamar»** va literal como se pidió; repite «dice» y puede sonar torpe. Si Lidia lo nota, «pretende llamar».
- **s04-07 «su router necesita una ruta hasta tu calle»** va literal; en la topología el router es el mismo y lo que falta en pantalla es la
  puerta de enlace del servidor. Si se quiere más exactitud: «y el servidor necesita una ruta hasta tu calle».
- **s05, tercera línea del cierre** («cada router elige el siguiente paso, también a la vuelta»): ya no la dice la voz (s05-07 se quitó); entra
  mientras suena «vas a la puerta de enlace» y la respuesta vuelve por el plano. La voz de esa idea queda en s12-02.
- **s06, la etiqueta se rellena por pares** («Origen y destino…» enciende origen y luego destino; «protocolo» enciende TCP), porque la frase nueva ya
  no nombra dirección y puerto en cuatro tiempos.
- **s09-06** no se tocó: el encargo decía «(ver abajo)» y no había nada más abajo.
- **No aplicado:** la pausa de s03-03 de 4,5 a 6 s (el margen es de 1,6 s) y «la web con candado» (el indicador es neutro).
- **Conceptos: 8 o 9** (más que los 4 a 6 del perfil); no se cortó más contenido. Si hace falta, lo primero que sale de la voz es el estado de la conexión (s10-07).

**Comprobaciones.** `build-timeline --estimate`: sin avisos. Un script de apoyo comprobó los 68 anclajes `wordFrame`/`wf` contra `timeline.json` (0
fallos). `tsc --noEmit -p video/viaje-conexion/tsconfig.json`: limpio. Una pasada de `qa-frames` (120 imágenes, 11 de ellas extras) revisada en s02,
s03, s04, s05, s06, s07, s08, s09, s10, s11 y s12; tarjeta final de s12 con el mini-plano sin nombres (`Plano` oculta ahora «Oficina de la naviera» e
«Internet» con `names={0}`).
