# BORRADOR · no grabes todavía · De la trama al segmento: tres envoltorios y una pregunta en voz alta

**Borrador:** el guion aún no está congelado (falta `"frozen"` en video.json) y puede cambiar. No lo grabes todavía.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/trama-arcedo lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Las tarjetas de examen y las opciones de las preguntas de examen salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.
En cada pregunta de examen **sí lees el caso y la pregunta**, como vienen en la hoja; las cuatro opciones A–D solo se ven.

## 1. Qué envuelve a qué

### Un clic, tres envoltorios

**s01-01** · *con curiosidad* — En el Consorcio de Arcedo, alguien abre la aplicación de expedientes del CPD. Y ese clic sale por el cable envuelto tres veces.

**s01-02** · *segura* — Vamos a seguirlo, de la trama al segmento. Vas a ver qué envuelve a qué, a quién va cada envoltorio y cuál cambia por el camino.

### De dentro afuera

**s02-01** · *clara* — La aplicación envía sus datos, y sueltos no llegan a ninguna parte.

**s02-02** · *pausada* — Primero, el puesto les pone delante el número del programa que los espera, el puerto. Eso ya es un segmento.

**s02-03** · *animada* — Después añade la dirección IP del servidor, y el conjunto pasa a llamarse paquete.

**s02-04** · *pensativa* — Y por fuera va la trama. Lleva la dirección física de la tarjeta que la recoge en este tramo, la MAC.

**s02-05** · *cercana* — Piensa en una carta en su sobre, el sobre en una caja y la caja en una furgoneta de reparto.

**s02-06** · *segura* — Y cada aparato decide con un envoltorio. El conmutador solo mira la trama. Ese envoltorio es la capa dos.

**s02-07** · *clara* — El encaminador la abre y mira el paquete, la capa tres. Y el puerto lo lee el servidor.

### El conmutador de la planta

**s03-01** · *intrigada* — Te toca. Al conmutador de la planta, que es de capa dos, le llega esa trama, con la petición dentro. ¿Qué mira para decidir por dónde la reenvía?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s03-02** · *segura* — La MAC de destino, que va en la trama, porque un conmutador de capa dos no abre nada más.

**s03-03** · *firme* — La IP tienta, porque es la del servidor. Pero va en el paquete, y ese lo abre el encaminador. MAC para el conmutador, IP para el encaminador. **(pausa larga)**

## 2. Quién pregunta a quién

### Una pregunta en voz alta

**s04-01** · *con curiosidad* — Para escribir esa trama, el puesto necesita una MAC, y solo tiene una IP.

**s04-02** · *clara* — Así que pregunta en voz alta quién tiene esa dirección. Lo oye toda su subred, los equipos de su misma red. Eso es ARP, y solo le contesta el dueño.

**s04-03** · *pensativa* — Pero esa pregunta viaja sin paquete IP, así que ningún encaminador la saca de su subred.

**s04-04** · *animada* — Y el servidor está en otra, en la del CPD. Por eso el puesto no pregunta por él. Pregunta por el encaminador que lo saca de la suya, su puerta de enlace.

**s04-05** · *pausada* — El encaminador le contesta, y la trama sale con dos destinos. Por fuera, la MAC del encaminador, y por dentro, la IP del servidor.

**s04-06** · *cercana* — Es la furgoneta, que solo reparte en su barrio. Lo demás lo deja en el almacén, y allí la caja cambia de furgoneta.

**s04-07** · *segura* — Eso hace el encaminador. Tira la trama que le ha llegado y mete el paquete en otra, sin tocarle las direcciones.

### Lo que ve el servidor

**s05-01** · *intrigada* — Otra. La petición ha cruzado la red interna y llega al servidor del CPD. El servidor mira el origen de la trama y el del paquete. ¿De quién es cada dirección?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s05-02** · *segura* — La de la trama, del último encaminador, y la del paquete, del puesto. La trama es nueva en cada salto, y el paquete conserva sus direcciones.

**s05-03** · *firme* — Lo fácil es esperar la MAC del puesto, pero esa trama se quedó en la sede. En este viaje, las MAC cambian en cada salto y las IP no. **(pausa larga)**

## 3. Con garantías o sin ellas

### Certificado o postal

**s06-01** · *clara* — Falta el de dentro, el segmento, que era el sobre. Y un sobre se manda de dos maneras.

**s06-02** · *animada* — Una es como el correo certificado. Antes de mandar nada, los dos extremos se ponen de acuerdo con tres mensajes.

**s06-03** · *pausada* — Después cada byte va numerado, y quien recibe confirma lo que le llega. Lo que no se confirma se reenvía, y lo descolocado se ordena.

**s06-04** · *segura* — Eso es TCP, y lo usa la aplicación de expedientes.

**s06-05** · *desenfadada* — La otra es echar una postal al buzón, sin acuerdo, sin numerar y sin confirmación. Eso es UDP, y lo que envía se llama datagrama.

**s06-06** · *pensativa* — Va bien para la voz, porque una palabra que llega tarde ya no sirve.

### Dos segmentos cruzados

**s07-01** · *con curiosidad* — Y para acabar, una de TCP. Dos segmentos seguidos del puesto se cruzan por el camino, y el segundo llega al servidor antes que el primero. ¿Qué recibe la aplicación?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s07-02** · *segura* — Los datos en su orden, porque TCP los recoloca con esa numeración, el número de secuencia.

**s07-03** · *firme* — Que los ordene la aplicación es lo que pasaría con UDP, que no numera nada. Con TCP, el orden y el reenvío ya vienen puestos. **(pausa larga)**

### Para llevarte

**s08-01** · *alegre* — Te llevas tres ideas. Una, de dentro afuera van datos, segmento, paquete y trama.

**s08-02** · *clara* — Dos, ARP no sale de su subred, y para ir fuera se pregunta por la puerta de enlace. Y tres, TCP numera y confirma, y UDP no promete nada.

**s08-03** · *animada* — Cuando veas una dirección, pregúntate primero en qué envoltorio va. Ahora te toca a ti, con las preguntas de la lección.
