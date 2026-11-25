# BORRADOR · no grabes todavía · WAN y wifi: la carretera, las mesas y el director

**Borrador:** el guion aún no está congelado (falta `"frozen"` en video.json) y puede cambiar. No lo grabes todavía.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/wan-wifi-arcedo lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Las tarjetas de examen y las opciones de las preguntas de examen salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.
En cada pregunta de examen **sí lees el caso y la pregunta**, como vienen en la hoja; las cuatro opciones A–D solo se ven.

## 1. Con qué unir las sedes

### Cuatro sedes y un aire

**s01-01** · *con curiosidad* — El Consorcio de Arcedo tiene cuatro sedes que hablan entre sí. Y en cada una hay un wifi que se reparte el mismo aire.

**s01-02** · *segura* — Hoy toca elegir red entre sedes y wifi. Vas a ver con qué unirlas, qué canales poner y quién manda en los puntos de acceso.

### La carretera de todos y el carril reservado

**s02-01** · *clara* — Empecemos por unir las sedes. La central y las tres oficinas comparten teléfonos y aplicaciones, así que hablan todas con todas.

**s02-02** · *pensativa* — Lo barato es Internet, con un túnel cifrado entre sedes. Es como un furgón blindado por la carretera de todos. Nadie lo abre, pero si hay atasco, llega tarde.

**s02-03** · *pausada* — Y en Internet nadie te firma un plazo.

**s02-04** · *animada* — Lo otro es alquilarle al operador un carril reservado. Ahí sí hay contrato, con plazo de entrega y la voz por delante.

**s02-05** · *clara* — El operador le pone a cada paquete una etiqueta suya, y en el interior de su red solo se mira eso.

**s02-06** · *segura* — Se llama MPLS, y es lo que elige el Consorcio.

**s02-07** · *tranquila* — El túnel por Internet se queda de respaldo en cada oficina.

**s02-08** · *cercana* — ¿Y si un día el Consorcio montara un segundo centro de datos cerca? Alquilaría la carretera entera, vacía, y los carriles los pondría él. Es la fibra oscura.

### Cae el acceso principal

**s03-01** · *intrigada* — Ahora decides tú. Una oficina comarcal pierde su acceso principal y pasa a trabajar por el túnel de respaldo, el de Internet. Y la gente sigue llamando a la sede. ¿Qué cambia para esas llamadas?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s03-02** · *segura* — Van cifradas, pero ya nadie garantiza cuánto tardan ni que lleguen enteras. El furgón va blindado, pero por la carretera de todos.

**s03-03** · *firme* — Lo fácil es pensar que el túnel conserva la prioridad, pero quien la daba era el operador, dentro de su red. Cifrar no es garantizar. **(pausa larga)**

## 2. Canales que se pisan

### Mesas de más de dos metros

**s04-01** · *clara* — Ahora, el wifi. En la banda de dos coma cuatro gigahercios, los canales van muy juntos. Entre uno y el siguiente solo hay cinco megahercios.

**s04-02** · *pausada* — Pero un punto de acceso, un AP, al emitir ocupa algo más de veinte. O sea, que cada canal pisa a sus vecinos.

**s04-03** · *cercana* — Imagínate una sala con marcas en el suelo cada medio metro, y mesas de algo más de dos metros. Sin tocarse, caben muy pocas.

**s04-04** · *segura* — Para no pisarse hacen falta cinco números de distancia. Por eso el plan de siempre son los canales uno, seis y once.

**s04-05** · *pensativa* — ¿Y dos AP en el mismo canal? Se oyen, se entienden y se turnan, como en una misma mesa. Va más lento, pero funciona.

### Del canal 1 al 3

**s05-01** · *con curiosidad* — Otra, y esta vez fuera del Consorcio. Dos AP vecinos se oyen entre sí y comparten el canal uno. Para separarlos, pasan uno al canal tres, y la red va peor. ¿Qué explica que vaya peor?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s05-02** · *segura* — Que ya no se entienden ni se turnan. En el mismo canal compartían mesa. Ahora cada uno es solo ruido para el otro.

**s05-03** · *firme* — Pero tampoco hay que compartir siempre. Con cinco números de distancia ya no se molestan. Mejor compartir un canal que pisarse a medias. **(pausa larga)**

## 3. Quién manda

### Un coro con director

**s06-01** · *clara* — Y ahora, quién manda. Un AP autónomo guarda su configuración y decide solo. Con cincuenta, son cincuenta configuraciones que mantener.

**s06-02** · *animada* — Es un coro sin director. La otra forma es ponerles uno, que es el controlador.

**s06-03** · *pausada* — Los AP se registran en él, y él les envía la configuración y reparte canales y potencias.

**s06-04** · *segura* — Se hablan por un túnel propio, que no es el de las sedes. Lleva dos caminos, uno protegido para las órdenes y otro para los datos. Eso es CAPWAP.

**s06-05** · *pensativa* — Y ojo, ese túnel va por el cable. En el aire, entre tu portátil y el AP, sigue habiendo wifi del de siempre.

### Doce canales que cambiar

**s07-01** · *intrigada* — Una más y acabamos. Supón que en la sede un controlador gestiona ya los AP con CAPWAP, y hay que cambiarles el canal a doce. ¿Dónde se hace ese cambio, y cómo le llega a cada uno?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s07-02** · *segura* — En el controlador, una sola vez. Y a cada AP le llega por el túnel, por el camino de las órdenes.

**s07-03** · *firme* — Ir uno a uno tienta, pero eso se hace con los autónomos. Aquí la configuración la reparte el director. **(pausa larga)**

### Para llevarte

**s08-01** · *alegre* — Resumen en tres. La primera, entre sedes eliges por lo que necesitas. Garantías con MPLS, precio con Internet y capacidad con fibra oscura.

**s08-02** · *clara* — La segunda, en la banda de dos coma cuatro, el plan clásico es uno, seis y once. Y mejor compartir canal que pisarse.

**s08-03** · *pausada* — Y la tercera, con controlador, se configura en un solo sitio.

**s08-04** · *animada* — Cuando te den a elegir, mira primero qué te piden que garantices. Ahora te toca a ti, con las preguntas de la lección.
