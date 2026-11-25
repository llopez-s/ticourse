# BORRADOR · no grabes todavía · Subredes a mano: una calle, un maletero y una centralita

**Borrador:** el guion aún no está congelado (falta `"frozen"` en video.json) y puede cambiar. No lo grabes todavía.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/subredes-arcedo lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Las tarjetas de examen y las opciones de las preguntas de examen salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.
En cada pregunta de examen **sí lees el caso y la pregunta**, como vienen en la hoja; las cuatro opciones A–D solo se ven.

## 1. Leer un prefijo

### Doscientas cincuenta y seis direcciones

**s01-01** · *con curiosidad* — A una oficina del Consorcio de Arcedo le dan un bloque de direcciones. Y ahí tienen que caber puestos, teléfonos, impresoras y un enlace.

**s01-02** · *segura* — Eso se hace con subredes. Cuando acabes sabrás leer un prefijo, repartir un bloque sin pisarte y qué pasa al salir a Internet.

### La calle y el portal

**s02-01** · *clara* — Una dirección tiene dos partes. Lo de la izquierda dice en qué red estás, y lo de la derecha, qué equipo eres dentro de ella.

**s02-02** · *cercana* — Es como una calle y un portal. Y el prefijo, ese número detrás de la barra, dice dónde acaba la calle y empieza el portal.

**s02-03** · *pausada* — Mira un teléfono de la oficina, con barra veintiséis. Una dirección tiene treinta y dos bits. Aquí veintiséis son de red, y quedan seis para equipos.

**s02-04** · *animada* — Con seis bits salen sesenta y cuatro direcciones. Pero la primera es el nombre de la red, como el cartel de la calle.

**s02-05** · *pensativa* — Y la última es la de difusión, un megáfono que oyen todos. Ninguna de las dos se le da a un equipo, así que caben sesenta y dos.

### Doscientos cincuenta y seis menos la máscara

**s03-01** · *segura* — Y ahora, el truco para no pasar a binario. El prefijo también se escribe como cuatro números, que es la máscara.

**s03-02** · *pausada* — Cada número es un octeto. Busca el único que no está ni lleno ni a cero. Aquí es el último, ciento noventa y dos.

**s03-03** · *clara* — Doscientos cincuenta y seis menos ese número te da el tamaño de bloque, aquí sesenta y cuatro. Y las redes empiezan de sesenta y cuatro en sesenta y cuatro.

**s03-04** · *pausada* — El teléfono acaba en ciento cuarenta y uno, así que cae en el bloque que empieza en ciento veintiocho. Esa es su red.

**s03-05** · *firme* — La siguiente red empieza en ciento noventa y dos. Una menos, ciento noventa y uno, es la difusión, y lo de en medio son los equipos.

### El último portal

**s04-01** · *intrigada* — A ver ese cálculo. A un equipo de otra oficina le ponen una dirección que acaba en doscientos tres, con barra veintiocho. ¿Cuál es la última dirección de su subred que puede llevar un equipo?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s04-02** · *segura* — La que acaba en doscientos seis. Con barra veintiocho los bloques son de dieciséis, y este va del ciento noventa y dos al doscientos siete.

**s04-03** · *firme* — La trampa es la que acaba en doscientos siete, la última del bloque. Pero esa es el megáfono. La difusión es la siguiente red menos uno. **(pausa larga)**

## 2. Repartir el bloque

### Primero, la maleta grande

**s05-01** · *clara* — Ya sabes leer un prefijo, así que vamos a repartir el bloque de la oficina. Hay que colocar cuatro cosas, y no son del mismo tamaño.

**s05-02** · *cercana* — Piensa en cómo se carga un maletero. Primero entra la maleta grande, y cada cosa va en el hueco más justo que le sirve.

**s05-03** · *pausada* — Lo más grande son los cien puestos. En una barra veintiséis caben sesenta y dos, así que necesitan una barra veinticinco, que es medio bloque.

**s05-04** · *animada* — Después, los cincuenta teléfonos. Les vale una barra veintiséis, que empieza donde acaba la anterior, en el ciento veintiocho. Es la subred del teléfono de antes.

**s05-05** · *segura* — Impresoras y equipos de gestión suman veinte, y les toca una barra veintisiete, donde caben treinta. Al enlace con la sede le basta una barra treinta, con solo dos direcciones.

**s05-06** · *pensativa* — Cada subred ocupa el primer hueco libre que empieza en un múltiplo de su tamaño, y por eso ninguna pisa a otra. Y aún sobran direcciones para crecer.

**s05-07** · *firme* — Repartir así, con prefijos de distinta longitud, se llama VLSM. O sea, de mayor a menor, y a cada uno la subred más pequeña que le sirve.

### Quince equipos

**s06-01** · *con curiosidad* — Vamos con otra. En otra oficina ya hay dos subredes repartidas, una barra veintiséis y, pegada a ella, una barra veintisiete. Falta una para quince equipos de gestión. ¿Dónde va la subred más pequeña que sirve, sin pisar a las otras dos?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s06-02** · *segura* — En el noventa y seis, y con barra veintisiete. Es el primer hueco libre, y caben treinta. En el sesenta y cuatro cabría igual, pero ese sitio ya está ocupado.

**s06-03** · *firme* — Lo fácil es la barra veintiocho, con dieciséis direcciones para quince equipos. Pero dos no se asignan y quedan catorce. La más pequeña que sirva, y en un hueco libre. **(pausa larga)**

## 3. Salir a Internet

### Extensiones de centralita

**s07-01** · *clara* — Fíjate en que todas las direcciones de la oficina empiezan por diez. Son privadas, de un bloque que cualquiera puede usar dentro de su red.

**s07-02** · *cercana* — Son como las extensiones de una centralita. La ciento uno existe en miles de empresas, y fuera del edificio no significa nada.

**s07-03** · *pausada* — Hay tres bloques privados, y los tienes en pantalla. Ninguno se encamina en Internet.

**s07-04** · *pensativa* — Ojo con dos que se les parecen. Una se la pone el propio equipo cuando nadie le da dirección. Solo vale en su enlace, o sea, entre vecinos directos.

**s07-05** · *tranquila* — La otra es el equipo hablando consigo mismo, y nunca sale a la red.

### Todos por el mismo número

**s08-01** · *clara* — Como una privada no llega a Internet, al salir hay que cambiarla por una pública. De eso se encarga el encaminador de salida.

**s08-02** · *animada* — En la sede hay doscientos puestos y una sola dirección pública. Así que todos salen con la misma.

**s08-03** · *pensativa* — ¿Y cómo sabe luego de quién es cada respuesta? Pues porque no cambia solo la dirección. Cambia también el puerto de origen, y apunta cada cambio en una tabla.

**s08-04** · *cercana* — Es la centralita otra vez. Todos llaman fuera con el mismo número, y ella apunta qué extensión hizo cada llamada.

**s08-05** · *segura* — Traducir dirección y puerto, muchos equipos por una sola pública, se llama PAT.

**s08-06** · *pausada* — Y cuando lo hace el operador con todos sus clientes, usa un bloque propio, que no es privado ni tampoco público.

### El mismo puerto

**s09-01** · *intrigada* — La tercera. Dos puestos de la sede abren a la vez la misma web, y por casualidad eligen el mismo puerto de origen. Los dos salen por la única dirección pública. ¿Qué reescribe el encaminador para repartir luego las respuestas?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s09-02** · *segura* — La dirección y el puerto de origen. El puerto nuevo es lo que apunta en su tabla, y con él reparte las respuestas.

**s09-03** · *firme* — Si has pensado en cambiar solo la dirección, normal, es lo primero que se te ocurre. Pero con una sola pública y el mismo puerto, las dos respuestas volverían iguales. **(pausa larga)**

## 4. IPv6, sin megáfono

### Grupos en vez de megáfono

**s10-01** · *clara* — Y nos falta el otro protocolo, IPv6. Sus direcciones tienen ciento veintiocho bits, y se escriben en hexadecimal, en ocho grupos.

**s10-02** · *pausada* — Como son tan largas, se abrevian. Quitas los ceros a la izquierda de cada grupo. Y una tira de ceros, solo una, se cambia por un doble dos puntos.

**s10-03** · *animada* — Aquí cada interfaz se pone ella misma una dirección que solo vale en su enlace. Ningún encaminador la reenvía. Se llama link-local.

**s10-04** · *segura* — Para salir a Internet hace falta otra, la global, que sí se encamina allí. Una interfaz puede tener las dos a la vez.

**s10-05** · *pensativa* — Y aquí no hay megáfono. En IPv6 no existe la dirección de difusión. Lo que hay son grupos, y solo te oyen los que están apuntados.

**s10-06** · *firme* — Eso es la multidifusión. Hasta preguntar quién tiene una dirección se hace así. De eso se encarga NDP, que aquí hace el trabajo de ARP.

### Un aviso para todos

**s11-01** · *con curiosidad* — La última. Un equipo con IPv6 tiene que enviar un aviso a todos los nodos de su mismo enlace. ¿A qué dirección lo envía?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s11-02** · *segura* — A la multidifusión de todos los nodos del enlace. Es un grupo en el que están todos, y por eso llega a todos.

**s11-03** · *firme* — La difusión de la subred tienta, porque en IPv4 se hace así. Pero en IPv6 esa dirección no existe. **(pausa larga)**

### Para llevarte

**s12-01** · *alegre* — Te llevas cuatro ideas. Una, el tamaño de bloque sale de una resta, y la difusión es la siguiente red menos uno.

**s12-02** · *clara* — Dos, al repartir, de mayor a menor y la subred más pequeña que sirva. Tres, las privadas salen a Internet traducidas, con dirección y puerto.

**s12-03** · *pausada* — Y cuatro, en IPv6 no hay difusión, hay grupos.

**s12-04** · *animada* — Y ante cualquier prefijo, empieza por el tamaño del bloque. Ahora te toca a ti, con las preguntas de la lección.
