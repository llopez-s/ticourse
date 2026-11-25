# BORRADOR · no grabes todavía · Encaminamiento: carteles, una rueda de repuesto y un teléfono de guardia

**Borrador:** el guion aún no está congelado (falta `"frozen"` en video.json) y puede cambiar. No lo grabes todavía.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/rutas-arcedo lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Las tarjetas de examen y las opciones de las preguntas de examen salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.
En cada pregunta de examen **sí lees el caso y la pregunta**, como vienen en la hoja; las cuatro opciones A–D solo se ven.

## 1. Por dónde sale un paquete

### Una sola cosa

**s01-01** · *con curiosidad* — El encaminador central del Consorcio de Arcedo hace una sola cosa con cada paquete. Mira adónde va y decide por dónde sacarlo.

**s01-02** · *segura* — Lo decide con su tabla de rutas. Hoy aprendes cómo elige una ruta, quién rellena esa tabla y qué pasa cuando algo se cae.

### El cartel más concreto

**s02-01** · *clara* — Esta es su tabla. Cada fila dice que, para llegar a una red, el paquete sale por una interfaz concreta.

**s02-02** · *pensativa* — Ahora llega un paquete para un equipo. Y resulta que su dirección encaja en tres filas a la vez.

**s02-03** · *cercana* — Piensa en los carteles de una carretera. Uno pone todas las direcciones, otro el nombre de tu ciudad y otro, el de tu calle.

**s02-04** · *segura* — Tú sigues el más concreto, y el encaminador también. Gana la fila con más bits de red, o sea, la del prefijo más largo.

**s02-05** · *pausada* — Aquí es la barra veinticuatro. Y da igual quién le haya contado esa ruta.

**s02-06** · *animada* — El cartel de todas las direcciones es la ruta por defecto. Encaja con todo, así que solo se usa cuando ninguna otra fila sirve.

### Dos rutas y ninguna por defecto

**s03-01** · *intrigada* — Primera decisión. Otro encaminador solo tiene dos rutas, la de las oficinas y la del CPD, y no tiene ruta por defecto. Le llega un paquete para la dirección que ves en pantalla. ¿Qué hace con él?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s03-02** · *segura* — Lo descarta. El rango de las oficinas empieza justo después de esa dirección, así que ninguna fila la contiene.

**s03-03** · *firme* — Mandarlo por la ruta más parecida tienta, pero aquí no hay parecidos. O el prefijo contiene el destino, o esa fila no cuenta. **(pausa larga)**

## 2. Quién rellena la tabla

### De quién te fías

**s04-01** · *clara* — Ya sabes cómo se elige una fila. Falta saber cómo llega cada fila a la tabla.

**s04-02** · *pausada* — Unas rutas las escribe la administradora a mano, y son las estáticas. Otras las aprende él, hablando con otros encaminadores por un protocolo como OSPF.

**s04-03** · *pensativa* — ¿Y si la ruta a mano y el protocolo le ofrecen la misma red, con la misma máscara? Solo entra una, la de quien más se fía.

**s04-04** · *cercana* — Es como preguntar una dirección por la calle. Si te contestan dos, haces caso al que te parece más de fiar.

**s04-05** · *segura* — Esa confianza es un número, la distancia administrativa, y gana el más bajo. Ojo, que los valores que suelen citarse son los de Cisco, no los de un estándar.

**s04-06** · *animada* — Y si las dos rutas vienen del mismo protocolo, decide la métrica. En OSPF es el coste, y en RIP, otro más antiguo, los saltos.

**s04-07** · *firme* — Al reenviar manda el prefijo más largo. Si el prefijo es el mismo, desempata la distancia. Y si además el protocolo es el mismo, la métrica.

### Cuatro parejas

**s05-01** · *con curiosidad* — Vamos con otra. Con los valores de Cisco, a un encaminador le ofrecen rutas de dos en dos. ¿En cuál de estas cuatro parejas decide la métrica qué ruta entra en la tabla?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s05-02** · *segura* — En la de las dos rutas de OSPF al mismo prefijo. Solo ahí la métrica tiene con qué medirse, coste con coste.

**s05-03** · *firme* — La pareja de OSPF y RIP llama mucho, porque tres saltos parecen poco. Pero entre dos protocolos decide la distancia. La métrica solo compara rutas de un mismo protocolo. **(pausa larga)**

## 3. La ruta de repuesto

### La rueda de repuesto

**s06-01** · *clara* — Y esa distancia tiene un uso muy práctico. La red del centro de Valdecierzo llega a la sede por una fibra, con OSPF.

**s06-02** · *pausada* — Por si la fibra cae, la administradora escribe una ruta estática a la misma red, por un enlace de respaldo.

**s06-03** · *pensativa* — Pero le sube la distancia a ciento treinta, por encima del ciento diez que tiene OSPF en equipos Cisco.

**s06-04** · *segura* — Mientras la fibra funciona, gana OSPF, y la estática ni siquiera aparece en la tabla.

**s06-05** · *cercana* — Es la rueda de repuesto, que va en el maletero y no se ve hasta que pinchas.

**s06-06** · *preocupada* — Si la fibra se corta, la ruta de OSPF desaparece, y la estática sube ella sola a la tabla. Por eso se llama ruta estática flotante.

### Distancia cincuenta

**s07-01** · *intrigada* — Otra más. Imagina que a esa estática de respaldo le hubieran puesto distancia cincuenta. OSPF sigue con su ciento diez de Cisco, y los dos enlaces funcionan. ¿Por dónde va el tráfico?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s07-02** · *segura* — Va siempre por el respaldo. Es el mismo prefijo con dos fuentes, así que entra la de menor distancia, la estática.

**s07-03** · *firme* — Ojo con pensar en el coste, que es cosa de OSPF y aquí hay dos fuentes. Una flotante necesita una distancia mayor que la del protocolo al que respalda. **(pausa larga)**

## 4. Dentro y fuera: OSPF y BGP

### El callejero

**s08-01** · *clara* — Vamos ya con OSPF. Una ruta estática no se entera de nada, y un protocolo dinámico se adapta él solo a los cambios.

**s08-02** · *animada* — En OSPF, cada encaminador cuenta cómo están sus enlaces. Con eso, todos montan el mismo mapa y calculan sus caminos más cortos.

**s08-03** · *pausada* — A eso se le llama estado de enlace. Y su métrica es el coste, que se suma enlace a enlace.

**s08-04** · *cercana* — Es el callejero de tu ciudad. Lo comparten todos los conductores, y cada uno busca en él su camino.

**s08-05** · *pensativa* — Para que ese mapa no crezca sin control, la red se parte en áreas. Y todas tienen que conectarse a una, el área cero, que hace de columna vertebral.

### Las provincias que cruzas

**s09-01** · *con curiosidad* — Pero el callejero se acaba donde acaba la ciudad. Todas las redes que gestiona una misma organización forman un sistema autónomo, y OSPF trabaja dentro de él.

**s09-02** · *segura* — Entre sistemas autónomos manda otro protocolo, BGP. Es el que usaría el Consorcio para hablar con su operador.

**s09-03** · *animada* — BGP no lleva un callejero. Con cada red anuncia la lista de sistemas autónomos que hay que cruzar, como las provincias de un viaje largo.

**s09-04** · *pausada* — Sus vecinos se configuran a mano, y hablan por TCP, en el puerto ciento setenta y nueve.

**s09-05** · *firme* — O sea, OSPF para dentro de casa, y BGP para tratar con los de fuera.

### Cuatro áreas

**s10-01** · *intrigada* — Salimos un momento del Consorcio. Una empresa reparte su red de OSPF en cuatro áreas, y toda sigue bajo la misma administración. ¿Cuántos sistemas autónomos forma esa red?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s10-02** · *segura* — Uno solo. Las áreas son un reparto interno de OSPF, y la administración sigue siendo la misma.

**s10-03** · *firme* — Uno por área, casi. Pero un área no separa organizaciones. Dentro de un sistema autónomo, OSPF. Y entre sistemas autónomos, BGP. **(pausa larga)**

## 5. La puerta que no se cae

### El teléfono de guardia

**s11-01** · *clara* — Falta un cabo por atar. Un servidor no habla OSPF ni BGP, y para salir de su subred solo conoce su puerta de enlace.

**s11-02** · *preocupada* — Si el equipo que hace de puerta se apaga, la subred entera se queda aislada, aunque haya otro encaminador al lado.

**s11-03** · *animada* — El arreglo es que los dos compartan una dirección IP virtual, con su propia MAC virtual. Los servidores apuntan a ella y no saben quién la atiende.

**s11-04** · *cercana* — Es el teléfono de guardia. El número es siempre el mismo, y contesta quien esté de turno.

**s11-05** · *pausada* — Uno atiende y el otro escucha sus anuncios. Si deja de oírlos, toma el relevo, y los servidores ni se enteran.

**s11-06** · *segura* — Esto lo hace VRRP, que es un estándar abierto. Cisco tiene el suyo, HSRP, que hace lo mismo pero no es un estándar.

### Dos fabricantes

**s12-01** · *con curiosidad* — Y la última. En una subred hay dos encaminadores de fabricantes distintos. Los puestos solo conocen una puerta de enlace, y no deben notar nada si uno de los dos se apaga. ¿Qué se configura en esos dos encaminadores?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s12-02** · *segura* — VRRP, porque es el estándar abierto, y lo pueden hablar equipos de fabricantes distintos.

**s12-03** · *firme* — HSRP suena igual de bien, pero es de Cisco y no un estándar. Y OSPF aquí no ayuda, porque los puestos no participan en él. **(pausa larga)**

### Para llevarte

**s13-01** · *alegre* — Si solo recuerdas cuatro cosas, que sean estas. Una, al reenviar gana el prefijo más largo.

**s13-02** · *clara* — Dos, con el mismo prefijo desempata la distancia, y con el mismo protocolo, la métrica.

**s13-03** · *pausada* — Tres, OSPF dentro del sistema autónomo y BGP entre ellos. Y cuatro, VRRP para que la puerta de enlace no dependa de un solo equipo.

**s13-04** · *animada* — Ante una pregunta de rutas, mira si el prefijo es el mismo, y luego el protocolo. Ahora te toca a ti, con las preguntas de la lección.
