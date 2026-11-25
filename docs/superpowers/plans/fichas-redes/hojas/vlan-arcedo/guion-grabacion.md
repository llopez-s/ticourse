# BORRADOR · no grabes todavía · VLAN y 802.1Q: tabiques, etiquetas y una puerta

**Borrador:** el guion aún no está congelado (falta `"frozen"` en video.json) y puede cambiar. No lo grabes todavía.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/vlan-arcedo lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Las tarjetas de examen y las opciones de las preguntas de examen salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.
En cada pregunta de examen **sí lees el caso y la pregunta**, como vienen en la hoja; las cuatro opciones A–D solo se ven.

## 1. Qué separa una VLAN

### Los mismos aparatos

**s01-01** · *con curiosidad* — En la sede del Consorcio de Arcedo, puestos, servidores y teléfonos cuelgan de los mismos conmutadores. Y no se oyen entre ellos.

**s01-02** · *segura* — Eso lo hacen las VLAN. Te cuento qué separan, cómo cruzan de una planta a otra y cómo vuelven a hablarse.

### Una pregunta en voz alta

**s02-01** · *clara* — Empecemos por el conmutador. Cada una de sus bocas, cada puerto, es un carril propio, así que dos equipos ya no chocan.

**s02-02** · *pausada* — Cada carril es un dominio de colisión, el trozo donde dos equipos podrían chocar.

**s02-03** · *pensativa* — Pero hay tramas que van para todos, como cuando un equipo pregunta quién tiene una dirección. El conmutador las saca por los demás puertos.

**s02-04** · *cercana* — Es como una planta diáfana. Si alguien pregunta en voz alta, lo oyen todos.

**s02-05** · *animada* — Hasta donde llega esa pregunta, eso es un dominio de difusión. Y una VLAN es un tabique, que pones por configuración, sin tocar un cable.

**s02-06** · *firme* — En la sede hay cuatro VLAN con equipos, como Usuarios o Servidores. O sea, cuatro dominios de difusión en los mismos aparatos.

### Sesenta equipos

**s03-01** · *intrigada* — Prueba tú. Una planta tiene sesenta equipos en un solo conmutador, todos en la misma VLAN. Lo que uno pregunta en voz alta llega a los otros cincuenta y nueve. ¿Qué cambio hace que esas preguntas lleguen a menos equipos?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s03-02** · *segura* — Repartirlos en dos VLAN, porque cada VLAN es su propio dominio de difusión.

**s03-03** · *firme* — Lo fácil es pensar en el dúplex completo, hablar y escuchar a la vez. Pero eso solo quita colisiones. El conmutador separa colisiones, y la VLAN, difusiones. **(pausa larga)**

## 2. De una planta a otra

### El sobre y la pegatina

**s04-01** · *clara* — ¿Y cómo sabe el conmutador de qué VLAN es cada trama? En el puerto de un puesto es fácil, porque es de una sola.

**s04-02** · *pausada* — Se llama puerto de acceso, y la trama entra y sale sin marca.

**s04-03** · *animada* — El problema es el cable entre dos plantas, por donde pasan las cuatro VLAN juntas. Así que cada trama viaja con una etiqueta que dice de cuál es.

**s04-04** · *segura* — Ese enlace es un troncal. La etiqueta sale de un estándar, el ochocientos dos punto uno cu. Ocupa cuatro bytes, y doce de sus bits son el número de VLAN.

**s04-05** · *cercana* — Piensa en el correo interno. Dentro del departamento, el sobre va sin nada. En el montacargas, lleva la pegatina del suyo.

**s04-06** · *pensativa* — ¿Y si por el troncal llega una trama sin etiqueta? Como un sobre sin pegatina, cae en la bandeja que ese puerto tiene asignada, la VLAN nativa.

**s04-07** · *tranquila* — En la sede, la nativa es una VLAN vacía, sin equipos.

### Dos nativas distintas

**s05-01** · *con curiosidad* — Esta es de otra red, no del Consorcio. Un troncal tiene de nativa la VLAN diez en el extremo A y la veinte en el B. Un equipo de la VLAN diez, conectado en A, envía una trama que lo cruza. Si ningún equipo vigila las nativas, ¿qué le pasa?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s05-02** · *segura* — Cruza sin etiqueta y acaba en la veinte. En A, la diez es la nativa y sale sin marca, y B la mete en la suya.

**s05-03** · *firme* — Que se descarte suena lógico, pero el estándar no comprueba que las nativas coincidan. Por eso la nativa tiene que ser la misma en los dos extremos. **(pausa larga)**

## 3. Volver a hablarse

### La puerta

**s06-01** · *clara* — Ya tienes tabiques y montacargas. Falta la puerta, porque los puestos tienen que llegar a sus servidores.

**s06-02** · *pausada* — Entre dos VLAN bien configuradas solo se pasa por un equipo que mire direcciones IP, o sea, de capa tres.

**s06-03** · *cercana* — Cada VLAN de la sede lleva su subred, y en ese equipo tiene su puerta de enlace. El puesto le entrega todo lo que va fuera.

**s06-04** · *animada* — Aquí lo hacen los conmutadores de distribución, con una interfaz virtual por VLAN.

**s06-05** · *pensativa* — De aquí sale una regla para averías. Si dos equipos de la misma VLAN, en plantas distintas, no se ven, mira el troncal.

**s06-06** · *firme* — Si son de VLAN distintas, mira la puerta de enlace.

### Sin puerta de enlace

**s07-01** · *intrigada* — Y cerramos con esta. A un puesto de la VLAN de Usuarios le han puesto la dirección a mano. La puerta de enlace se ha quedado en blanco, y lo demás está bien. ¿Con quién puede hablar ese puesto?

> *(En pantalla: la pregunta y sus cuatro opciones. Deja cinco segundos de silencio.)*

**s07-02** · *segura* — Solo con los de su VLAN, porque a esos les habla directamente, sin pasar por nadie.

**s07-03** · *firme* — Lo del mismo conmutador tienta, pero ahí hay puertos de otras VLAN. A esos solo se llega por la puerta. **(pausa larga)**

### Para llevarte

**s08-01** · *alegre* — Quédate con tres cosas. Una, el conmutador separa colisiones, y la VLAN, difusiones.

**s08-02** · *clara* — Dos, en el acceso la trama va sin marca, y en el troncal, con etiqueta. Y tres, de una VLAN a otra, por capa tres.

**s08-03** · *animada* — Si dos equipos no se ven, lo primero, ver si están en la misma VLAN. Ahora te toca a ti, con las preguntas de la lección.
