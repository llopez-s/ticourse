import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP1M3 — LAN: conmutación Ethernet, VLAN y 802.1Q (bloque 1, Redes de comunicaciones)
// ---------------------------------------------------------------------------
export const OP1_M3: Module = {
  id: 'op1m3',
  sectionId: 'op1',
  title: 'LAN: conmutación Ethernet, VLAN y 802.1Q',
  minutes: 16,
  objectives: [
    'Explicar cómo un conmutador aprende, reenvía e inunda tramas con su tabla MAC, y contar dominios de colisión y de difusión',
    'Describir para qué sirve el árbol de expansión, cómo se elige el puente raíz y en qué se diferencian STP (802.1D) y RSTP (802.1w)',
    'Detallar la etiqueta 802.1Q campo a campo y distinguir puertos de acceso, enlaces troncales, VLAN nativa y VLAN de voz',
    'Elegir entre encaminador con subinterfaces y conmutador de capa 3 para comunicar VLAN, y diagnosticar por qué dos equipos no se ven',
    'Situar la agregación de enlaces con LACP (802.1AX) y los diseños jerárquico y spine-leaf',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Una red local Ethernet moderna es un conjunto de **conmutadores (switches)** que trabajan en la capa 2: no miran direcciones IP, solo **direcciones MAC**. Esta lección sigue una trama por dentro de la LAN del Consorcio Provincial de Arcedo: cómo decide el conmutador por qué puerto sacarla, qué impide que dé vueltas eternamente cuando hay enlaces redundantes, cómo se parte una misma infraestructura en varias redes lógicas (**VLAN**) y qué hace falta para que esas redes vuelvan a hablarse. Son preguntas fijas de cualquier temario de redes, y casi siempre se preguntan con números: bits de un campo, estados de un puerto, cuántos dominios de difusión hay.',
    },
    { t: 'h', text: 'La tabla MAC: aprender, reenviar e inundar' },
    {
      t: 'p',
      md: 'Un conmutador es, en términos del estándar, un **puente transparente** con muchos puertos. Con cada trama que recibe hace dos cosas. Primero **aprende**: anota en su **tabla MAC** la dirección de **origen**, el puerto por el que ha llegado y la VLAN. Después decide con la dirección de **destino**: si la conoce y está en otro puerto, **reenvía** la trama solo por ese puerto; si está en el mismo puerto por el que entró, la **filtra** (la descarta); y si no la conoce, la **inunda**, es decir, la saca por todos los puertos de esa VLAN salvo el de entrada. También se inundan las tramas de **difusión** (destino `ff:ff:ff:ff:ff:ff`) y, si no hay ningún mecanismo que lo limite, las de multidifusión. Las entradas aprendidas **caducan**: el valor de envejecimiento recomendado por 802.1D es de **300 segundos** sin ver tramas de esa dirección. De aquí salen los dos conceptos que más se preguntan. Cada puerto del conmutador es un **dominio de colisión** propio (y con dúplex completo ya no hay colisiones, así que CSMA/CD deja de actuar), mientras que el **dominio de difusión** abarca todos los puertos de la misma VLAN: un conmutador separa colisiones, pero solo una VLAN o un encaminador (router) separan difusiones.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Tabla MAC de un conmutador de acceso (salida ilustrativa, sin sintaxis de fabricante)',
      text: `VLAN   Dirección MAC        Tipo       Puerto   Edad (s)
----   ------------------   --------   ------   --------
  10   00:00:5e:00:53:0a    dinámica   P3            12
  10   00:00:5e:00:53:0b    dinámica   P4           187
  10   00:00:5e:00:53:1f    dinámica   P24            4
  20   00:00:5e:00:53:2c    dinámica   P24           41
  30   00:00:5e:00:53:7d    dinámica   P3             9
  99   00:00:5e:00:53:01    estática   P24            -

P24 es el enlace troncal hacia el conmutador de distribución.

Lectura:
- En P3 hay dos direcciones en dos VLAN: un PC (VLAN 10) conectado
  detrás de un teléfono IP (VLAN 30, voz).
- En P24 se aprenden direcciones de varias VLAN: es normal en un troncal,
  porque detrás hay más conmutadores.
- La misma dirección puede figurar en VLAN distintas: la tabla se consulta
  por la pareja (VLAN, MAC), no solo por la MAC.
- Una trama de la VLAN 10 hacia una MAC que no figura aquí se inunda por
  P4 y P24 si entró por P3: por todos los puertos de la VLAN 10 menos
  el de entrada.`,
    },
    {
      t: 'check',
      q: {
        q: 'Un conmutador de 24 puertos tiene todos sus puertos en uso, repartidos entre tres VLAN. No hay ningún encaminador conectado. ¿Cuántos dominios de colisión y de difusión hay?',
        choices: [
          '1 dominio de colisión y 24 de difusión',
          '24 dominios de colisión y 1 de difusión',
          '24 dominios de colisión y 3 de difusión',
          '3 dominios de colisión y 3 de difusión',
        ],
        answer: 2,
        explain:
          'Cada puerto de un conmutador es su propio dominio de colisión, así que hay 24. El dominio de difusión lo delimita la VLAN, no el aparato: tres VLAN son tres dominios de difusión aunque compartan el mismo conmutador. La opción «24 y 1» sería correcta si todos los puertos estuvieran en la misma VLAN.',
      },
    },
    { t: 'h', text: 'Enlaces redundantes sin bucles: STP y RSTP' },
    {
      t: 'p',
      md: 'En cuanto se añade un segundo enlace entre conmutadores para tener redundancia aparece un **bucle de capa 2**. La trama Ethernet **no tiene campo TTL**, de modo que una difusión inundada daría vueltas sin fin, multiplicándose en cada pasada: es la **tormenta de difusión**, que además vuelve inestable la tabla MAC porque la misma dirección se aprende por puertos distintos una y otra vez. El **protocolo de árbol de expansión** (**STP**, IEEE **802.1D**) lo evita bloqueando de forma lógica los enlaces sobrantes hasta dejar una topología en árbol. Los conmutadores intercambian mensajes **BPDU** y eligen un **puente raíz**: el de **menor identificador de puente**, que se forma con la **prioridad** (valor por defecto **32768**, configurable en múltiplos de 4096) seguida de la dirección MAC; a igual prioridad gana la MAC más baja. Cada conmutador que no es raíz elige su **puerto raíz** (el de menor coste hacia la raíz), cada segmento elige un **puerto designado**, y el resto de puertos quedan bloqueados. Con los temporizadores por defecto (**hello 2 s**, **forward delay 15 s**, **max age 20 s**) el STP original tarda entre **30 y 50 segundos** en recuperar la conectividad tras un cambio. **RSTP** (**802.1w**, integrado después en 802.1D-2004) mantiene la misma lógica de raíz y costes, pero converge en pocos segundos o menos gracias a una negociación directa entre vecinos, a los **puertos de borde** (los que dan a equipos finales pasan a reenviar de inmediato) y a los roles **alternativo** y **de respaldo**, que dejan preparado el camino de reserva. Para no calcular un árbol por cada VLAN ni uno solo para todas existe **MSTP** (802.1s, hoy dentro de 802.1Q), que agrupa las VLAN en unas pocas instancias de árbol.',
    },
    {
      t: 'table',
      headers: ['Estado en STP (802.1D)', 'Estado en RSTP (802.1w)', '¿Aprende direcciones MAC?', '¿Reenvía tramas de datos?'],
      rows: [
        ['Deshabilitado (*disabled*)', '**Descarte** (*discarding*)', 'No', 'No'],
        ['Bloqueo (*blocking*)', '**Descarte** (*discarding*)', 'No', 'No'],
        ['Escucha (*listening*)', '**Descarte** (*discarding*)', 'No', 'No'],
        ['Aprendizaje (*learning*)', '**Aprendizaje** (*learning*)', 'Sí', 'No'],
        ['Reenvío (*forwarding*)', '**Reenvío** (*forwarding*)', 'Sí', 'Sí'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Dos conmutadores quedan unidos por dos cables en paralelo, sin árbol de expansión ni agregación de enlaces. Un PC envía una petición de difusión. ¿Qué ocurre y por qué?',
        choices: [
          'La trama circula indefinidamente y se multiplica, porque la trama Ethernet no tiene un campo TTL que la haga caducar',
          'La trama da 255 vueltas y se descarta al agotarse su TTL',
          'El segundo cable se desactiva solo, porque Ethernet detecta el bucle mediante CSMA/CD',
          'No ocurre nada: los conmutadores nunca reenvían difusiones entre sí',
        ],
        answer: 0,
        explain:
          'El TTL es un campo de la cabecera IP y solo lo decrementan los encaminadores; en capa 2 no hay nada equivalente, así que la difusión se reinunda sin fin y provoca una tormenta de difusión. CSMA/CD gestiona colisiones en un medio compartido, no bucles. Por eso hace falta STP o RSTP, o convertir los dos cables en un único enlace lógico con LACP.',
      },
    },
    { t: 'h', text: 'VLAN y la etiqueta 802.1Q' },
    {
      t: 'p',
      md: 'Una **VLAN** es un dominio de difusión definido por configuración y no por cableado: los puertos de una VLAN se comportan como si estuvieran en un conmutador aparte. Se segmenta por tres motivos. **Rendimiento**: las difusiones de una VLAN no llegan a las demás. **Seguridad**: entre dos VLAN no hay comunicación directa en capa 2; todo lo que cruza pasa por un equipo de capa 3, donde se puede filtrar. Y **organización**: usuarios, servidores, voz y gestión se separan aunque compartan edificio y conmutadores, y a cada VLAN se le asigna normalmente su propia subred IP. Para que una VLAN se extienda por varios conmutadores, las tramas tienen que viajar marcadas entre ellos. De eso se ocupa IEEE **802.1Q**: inserta una **etiqueta de 4 bytes** entre la dirección MAC de origen y el campo EtherType, y obliga a recalcular el **FCS**. La trama máxima pasa así de 1518 a **1522 bytes**.',
    },
    {
      t: 'table',
      headers: ['Campo de la etiqueta 802.1Q', 'Tamaño', 'Para qué sirve'],
      rows: [
        [
          '**TPID** (*Tag Protocol Identifier*)',
          '16 bits',
          'Vale **0x8100** e indica que la trama va etiquetada. Ocupa el lugar donde una trama sin etiqueta lleva el EtherType.',
        ],
        [
          '**PCP** (*Priority Code Point*)',
          '3 bits',
          'Prioridad de la trama, de 0 a 7 (ocho clases de servicio). Es lo que se conoce como **802.1p**.',
        ],
        [
          '**DEI** (*Drop Eligible Indicator*)',
          '1 bit',
          'Marca las tramas que pueden descartarse antes si hay congestión. En ediciones antiguas del estándar este bit se llamaba CFI.',
        ],
        [
          '**VID** (*VLAN Identifier*)',
          '12 bits',
          '4096 valores. El **0** indica trama con prioridad pero sin VLAN, y el **4095** está reservado: quedan utilizables del **1 al 4094**.',
        ],
      ],
    },
    {
      t: 'p',
      md: 'Los puertos se configuran de dos maneras. Un **puerto de acceso** pertenece a una sola VLAN y entrega las tramas **sin etiqueta**: el PC no sabe en qué VLAN está. Un **enlace troncal (trunk)** transporta varias VLAN a la vez y etiqueta cada trama con su VID; se usa entre conmutadores, hacia encaminadores y hacia servidores de virtualización. En un troncal queda una excepción: las tramas que llegan **sin etiqueta** se asignan a la VLAN que marque el identificador de VLAN del puerto (**PVID**), lo que los fabricantes llaman **VLAN nativa**; en muchos equipos es la VLAN 1 por defecto. Si los dos extremos del troncal no coinciden en la VLAN nativa, el tráfico sin etiqueta salta de una VLAN a otra. Además, la VLAN nativa abre la puerta al **doble etiquetado**: un atacante conectado a un puerto de acceso cuya VLAN coincide con la nativa del troncal envía una trama con dos etiquetas; el primer conmutador retira la exterior (la nativa viaja sin etiqueta) y el segundo lee la interior y entrega la trama en la VLAN de la víctima. El ataque es de **un solo sentido**, porque la respuesta no puede volver por el mismo camino. Se evita usando como nativa una VLAN sin equipos, distinta de la VLAN 1 y de cualquier VLAN de usuario, o etiquetando también la nativa. Por último, la **VLAN de voz** no es un estándar IEEE, sino una función de los fabricantes: el puerto sigue siendo de acceso para el PC, pero acepta además tramas etiquetadas del teléfono IP en una segunda VLAN, normalmente con un PCP más alto. El teléfono suele aprender esa VLAN mediante **LLDP-MED**.',
    },
    {
      t: 'check',
      q: {
        q: 'Dos PC están conectados al mismo conmutador, con las direcciones 10.20.10.21/24 y 10.20.10.37/24. El puerto del primero es de acceso en la VLAN 10 y el del segundo, de acceso en la VLAN 20. El conmutador tiene activado el encaminamiento entre VLAN. No se responden al ping. ¿Cuál es la causa?',
        choices: [
          'Falta una ruta estática entre las dos VLAN',
          'El árbol de expansión ha bloqueado uno de los dos puertos de acceso',
          'Las máscaras no coinciden y cada PC cree que el otro está en una red remota',
          'Cada PC cree que el otro está en su misma subred y lo busca con ARP, pero esa difusión no sale de su VLAN',
        ],
        answer: 3,
        explain:
          'Ambas direcciones pertenecen a 10.20.10.0/24, así que cada PC intenta la entrega directa y lanza una petición ARP de difusión. Esa difusión se queda en su VLAN y el otro PC, que está en otro dominio de difusión, nunca la recibe. El encaminamiento entre VLAN no ayuda porque ninguno de los dos envía el paquete a su puerta de enlace: la solución es poner los dos puertos en la misma VLAN o dar a cada VLAN su propia subred.',
      },
    },
    { t: 'h', text: 'Comunicar VLAN, agregar enlaces y diseñar la red' },
    {
      t: 'p',
      md: 'Entre dos VLAN solo se pasa por **capa 3**, y hay dos diseños clásicos. En el **router-on-a-stick** un encaminador se conecta al conmutador por **un único enlace troncal** y define una **subinterfaz** por VLAN, cada una con su etiqueta 802.1Q y con la dirección IP que hace de puerta de enlace de esa VLAN. Es barato y suficiente para pocas VLAN, pero todo el tráfico entre ellas entra y sale por el mismo enlace, que se convierte en cuello de botella y en punto único de fallo. En un **conmutador de capa 3** el encaminamiento se hace dentro del propio equipo: se crea una **interfaz virtual de VLAN** (**SVI**, por *Switch Virtual Interface*, el nombre que le da Cisco y que se ha generalizado) por cada VLAN, con la IP de la puerta de enlace, y el paso de una a otra se resuelve en el hardware de conmutación. Es el diseño habitual en la capa de distribución o en el núcleo de una red corporativa.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Troncal, puerto de acceso con voz y puertas de enlace (sintaxis ilustrativa: cada fabricante usa sus propias órdenes)',
      text: `# --- Conmutador de acceso -------------------------------------------
interfaz P24                      # enlace hacia distribución
  modo troncal 802.1Q
  vlan permitidas 10,20,30,99     # lo que no está en la lista no pasa
  vlan nativa 999                 # VLAN sin equipos, igual en ambos extremos

interfaz P3                       # puesto de trabajo con teléfono IP
  modo acceso
  vlan de acceso 10               # el PC envía tramas sin etiqueta
  vlan de voz 30                  # el teléfono envía tramas etiquetadas
  puerto de borde                 # RSTP: pasa a reenvío sin esperar

# --- Opción A: conmutador de capa 3 con SVI ---------------------------
encaminamiento ip activado
interfaz vlan 10
  ip 10.20.10.1/24                # puerta de enlace de Usuarios
interfaz vlan 20
  ip 10.20.20.1/24                # puerta de enlace de Servidores

# --- Opción B: router-on-a-stick (subinterfaces en un encaminador) ----
interfaz G0.10
  etiqueta 802.1Q 10
  ip 10.20.10.1/24
interfaz G0.20
  etiqueta 802.1Q 20
  ip 10.20.20.1/24`,
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Consorcio de Arcedo: cuatro VLAN en la sede central',
      md: 'La sede reparte el bloque 10.20.0.0/16 con una subred por VLAN: **VLAN 10 Usuarios** (10.20.10.0/24), **VLAN 20 Servidores** (10.20.20.0/24), **VLAN 30 Voz** (10.20.30.0/24) y **VLAN 99 Gestión** (10.20.99.0/24). La VLAN 20 es la de los servidores de planta, como los de ficheros e impresión; las aplicaciones corporativas están en el CPD, que ocupa una sala del mismo edificio y tiene su propio bloque, 10.20.72.0/21. La **VLAN 999** existe solo para ser la nativa de los troncales y no tiene ningún puerto de acceso. Los conmutadores de planta son de capa 2; los dos de distribución son de capa 3, tienen una SVI por VLAN y uno de ellos se configura con prioridad 4096 para que sea el **puente raíz** de forma deliberada, en vez de dejar que lo sea el equipo con la MAC más baja, que suele ser el más antiguo. Un día, una técnica da de alta la **VLAN 40 Impresoras** en dos plantas y las impresoras de una no ven el servidor de la otra: la VLAN está creada en ambos conmutadores, pero nadie la añadió a la lista de **VLAN permitidas** del troncal. Es la avería de VLAN más frecuente y se diagnostica leyendo la configuración del troncal, no la de los puertos de acceso.',
    },
    {
      t: 'p',
      md: 'Cuando un solo enlace entre dos equipos se queda corto o no puede fallar, se recurre a la **agregación de enlaces**: varios enlaces físicos se comportan como un único enlace lógico (**LAG**). El árbol de expansión lo ve como un solo puerto y por eso no bloquea ninguno de sus miembros. La negociación automática la hace **LACP**, definido primero en **802.3ad** (año 2000) y trasladado en 2008 a **802.1AX**: los dos extremos se intercambian mensajes y solo agrupan los enlaces que conectan con el mismo vecino; cada extremo puede estar en modo **activo** (inicia la negociación) o **pasivo** (solo responde). Los enlaces miembros deben ser punto a punto, en dúplex completo y de la misma velocidad. El reparto de carga se hace **por flujo**, no por trama, para no desordenar las tramas de una misma conversación: una única transferencia nunca supera la velocidad de **un** enlace miembro. En cuanto al diseño, la red de campus sigue el **modelo jerárquico** de tres capas: **acceso** (donde se conectan los equipos finales y se asignan las VLAN), **distribución** (agrega los conmutadores de acceso, encamina entre VLAN y aplica políticas) y **núcleo** (transporte rápido entre bloques, sin filtrado). En el CPD se prefiere **spine-leaf**, un patrón de diseño y no un estándar: cada conmutador **leaf** (hoja) se conecta a **todos** los **spine** (espina), y no hay enlaces leaf-leaf ni spine-spine. Así, dos servidores cualesquiera están siempre a la misma distancia (leaf, spine, leaf), hay tantos caminos de igual coste como spines y la red crece añadiendo hojas o espinas, lo que encaja con el tráfico entre servidores, que es el dominante en un CPD.',
    },
    {
      t: 'check',
      q: {
        q: 'Un servidor de copias se une a un conmutador mediante un LAG de dos enlaces de 1 Gbit/s negociado con LACP. Una única copia entre ese servidor y otro equipo nunca pasa de 1 Gbit/s aproximadamente. ¿Por qué?',
        choices: [
          'Porque LACP mantiene uno de los dos enlaces en reserva y solo lo usa si el otro cae',
          'Porque el reparto de carga se hace por flujo: todas las tramas de una misma conversación salen por el mismo enlace miembro',
          'Porque el árbol de expansión bloquea uno de los dos enlaces para evitar el bucle',
          'Porque la etiqueta 802.1Q limita la velocidad del enlace troncal',
        ],
        answer: 1,
        explain:
          'La agregación reparte conversaciones, no tramas sueltas, para conservar el orden de entrega; un flujo usa siempre el mismo enlace miembro. El LAG suma capacidad cuando hay muchos flujos distintos y aporta redundancia. El árbol de expansión no bloquea nada porque ve el grupo como un único puerto lógico.',
      },
    },
    {
      t: 'video',
      title: 'VLAN y 802.1Q: acceso, troncal y VLAN nativa',
      youtube: 'U1RSSBd7o1A',
      poster: 'videos/vlan-arcedo-poster.png',
      transcript: 'videos/vlan-arcedo-transcript.txt',
    },
    {
      t: 'links',
      title: 'Seguridad de puerto: ya está explicada en la pista de Security+',
      items: [
        {
          label: 'Control de acceso al puerto con 802.1X y EAP (lección sp3m5)',
          href: '/learn/sp3m5',
        },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Cómo cae en un examen',
      md: '**Números de la etiqueta**: 4 bytes, TPID **0x8100**, PCP **3 bits**, DEI **1 bit**, VID **12 bits**, VLAN utilizables **1–4094** (la trampa habitual es responder 4096 o 4095). **Dominios**: el conmutador separa dominios de **colisión** (uno por puerto); la VLAN y el encaminador separan dominios de **difusión**. **Estados**: STP tiene bloqueo, escucha, aprendizaje y reenvío (más deshabilitado); RSTP solo **descarte, aprendizaje y reenvío**. Ojo: *alternativo* y *de respaldo* son **roles**, no estados. **Puente raíz**: menor identificador, primero la prioridad (32768 por defecto) y después la MAC; un número **menor** gana. **Estándares**: STP 802.1D, RSTP 802.1w, MSTP 802.1s, VLAN 802.1Q, prioridad 802.1p, LACP **802.1AX** (antes 802.3ad). **Diagnóstico**: dos equipos de la misma VLAN en conmutadores distintos que no se ven → mirar las VLAN permitidas y la nativa del troncal; dos equipos de VLAN distintas que no se ven → mirar la puerta de enlace y el equipo de capa 3. Y si el enunciado dice «tramas sin etiqueta en un troncal», la respuesta es la **VLAN nativa**.',
    },
  ],
  quiz: [
    {
      id: 'op1m3q1',
      domain: 'Redes de comunicaciones',
      prompt:
        'En la etiqueta que IEEE 802.1Q inserta en una trama Ethernet, ¿cuántos bits ocupa el identificador de VLAN (VID) y cuántas VLAN quedan utilizables?',
      choices: [
        '16 bits; 65 534 VLAN utilizables',
        '12 bits; del 1 al 4094',
        '12 bits; del 0 al 4095',
        '10 bits; del 1 al 1022',
      ],
      answer: 1,
      explain:
        'El VID ocupa 12 de los 32 bits de la etiqueta, lo que da 4096 valores. El 0 identifica una trama que solo lleva prioridad y el 4095 está reservado, así que se pueden usar del 1 al 4094. La opción «del 0 al 4095» tienta porque es el rango matemático de 12 bits, pero ignora los dos valores reservados; los 16 bits corresponden al TPID.',
    },
    {
      id: 'op1m3q2',
      domain: 'Redes de comunicaciones',
      cognitiveLevel: 'apply',
      prompt:
        'La tabla MAC de un conmutador contiene solo estas entradas: (VLAN 10, 00:00:5e:00:53:0a, puerto P3), (VLAN 10, 00:00:5e:00:53:0b, puerto P4) y (VLAN 20, 00:00:5e:00:53:2c, puerto P24). Los puertos P3, P4 y P5 son de acceso en la VLAN 10 y P24 es un troncal que transporta las VLAN 10 y 20. Por P3 entra una trama con destino 00:00:5e:00:53:2c. ¿Qué hace el conmutador?',
      choices: [
        'La reenvía solo por P24, porque esa dirección está aprendida en ese puerto',
        'La descarta, porque el destino pertenece a otra VLAN',
        'La envía a su puerta de enlace para que la encamine hacia la VLAN 20',
        'La inunda por P4, P5 y P24, porque en la VLAN 10 no conoce esa dirección',
      ],
      answer: 3,
      explain:
        'La tabla se consulta por la pareja VLAN y MAC. La trama entra por un puerto de la VLAN 10 y en esa VLAN no hay ninguna entrada para la dirección de destino, de modo que se trata como unidifusión desconocida y se inunda por todos los puertos de la VLAN 10 menos el de entrada, incluido el troncal. Reenviarla solo por P24 es el distractor que más tienta, pero esa entrada pertenece a la VLAN 20 y un conmutador nunca pasa tramas de una VLAN a otra en capa 2.',
    },
    {
      id: 'op1m3q3',
      domain: 'Redes de comunicaciones',
      cognitiveLevel: 'apply',
      prompt:
        'Tres conmutadores forman un triángulo con STP. Sus identificadores son: SW-A, prioridad 32768 y MAC 00:00:5e:00:53:0c; SW-B, prioridad 32768 y MAC 00:00:5e:00:53:03; SW-C, prioridad 4096 y MAC 00:00:5e:00:53:9f. ¿Cuál se elige como puente raíz?',
      choices: [
        'SW-C, porque tiene la prioridad más baja y la prioridad se compara antes que la MAC',
        'SW-B, porque tiene la dirección MAC más baja',
        'SW-A, porque es el primero que envía BPDU',
        'SW-C, porque tiene la dirección MAC más alta',
      ],
      answer: 0,
      explain:
        'El puente raíz es el de menor identificador de puente, y en ese identificador la prioridad va delante de la MAC: 4096 es menor que 32768, así que gana SW-C sin llegar a comparar direcciones. SW-B tienta porque tiene la MAC más baja, pero la MAC solo desempata entre prioridades iguales; habría sido raíz si los tres conservaran la prioridad por defecto.',
    },
    {
      id: 'op1m3q4',
      domain: 'Redes de comunicaciones',
      prompt: '¿Cuáles son los estados de puerto que define RSTP (IEEE 802.1w)?',
      choices: [
        'Bloqueo, escucha, aprendizaje y reenvío',
        'Raíz, designado, alternativo y de respaldo',
        'Descarte, aprendizaje y reenvío',
        'Activo y pasivo',
      ],
      answer: 2,
      explain:
        'RSTP reduce los estados a tres: descarte (que reúne deshabilitado, bloqueo y escucha del STP original), aprendizaje y reenvío. La primera opción son los estados de STP 802.1D. La segunda es la trampa clásica: raíz, designado, alternativo y de respaldo son roles de puerto, no estados. Activo y pasivo son modos de LACP.',
    },
    {
      id: 'op1m3q5',
      domain: 'Redes de comunicaciones',
      cognitiveLevel: 'analyze',
      prompt:
        'En el Consorcio de Arcedo, el PC-1 (10.20.10.21/24) está en un puerto de acceso de la VLAN 10 del conmutador de la planta 1, y el PC-2 (10.20.10.37/24), en un puerto de acceso de la VLAN 10 del conmutador de la planta 2. Los dos conmutadores se unen por un troncal 802.1Q cuya lista de VLAN permitidas es 20, 30 y 99 en ambos extremos, con la VLAN nativa 999. Cada PC responde al ping de otros equipos de su misma planta, pero no se ven entre sí. ¿Cuál es la causa más probable?',
      choices: [
        'Los dos PC están en subredes distintas y necesitan una puerta de enlace',
        'La VLAN nativa no coincide en los dos extremos del troncal',
        'La VLAN 10 no está en la lista de VLAN permitidas del troncal, así que sus tramas no cruzan de una planta a otra',
        'RSTP mantiene el troncal en estado de descarte',
      ],
      answer: 2,
      explain:
        'Los dos equipos comparten subred y VLAN, y funcionan dentro de su planta, luego el fallo está en el camino entre conmutadores: el troncal solo transporta las VLAN 20, 30 y 99, y las tramas de la VLAN 10 se quedan en cada planta. La VLAN nativa tienta porque es otra avería típica de troncales, pero el enunciado dice que es la 999 en ambos extremos. Si el troncal estuviera en descarte, tampoco pasarían las demás VLAN y nada del enunciado lo indica.',
    },
    {
      id: 'op1m3q6',
      domain: 'Redes de comunicaciones',
      cognitiveLevel: 'apply',
      prompt:
        'Otra red, no la del Consorcio: la sede de un organismo pasa de 4 a 30 VLAN y el tráfico entre ellas (usuarios hacia servidores, copias de seguridad) crece mucho. Hoy las comunica un encaminador con subinterfaces unido al conmutador por un único enlace troncal de 1 Gbit/s, que está saturado. ¿Qué diseño resuelve mejor el problema?',
      choices: [
        'Encaminar entre VLAN en un conmutador de capa 3, con una SVI por VLAN como puerta de enlace',
        'Crear una subinterfaz adicional en el encaminador por cada VLAN nueva',
        'Unificar todos los equipos en una sola VLAN para que no haga falta encaminar',
        'Activar RSTP en el enlace troncal para que converja más deprisa',
      ],
      answer: 0,
      explain:
        'Con un conmutador de capa 3 el paso entre VLAN se resuelve dentro del propio equipo, sin que cada paquete tenga que entrar y salir por un mismo enlace hacia un encaminador externo. Añadir subinterfaces es lo que ya se hace y tienta por continuidad, pero mantiene el cuello de botella: todas comparten el mismo enlace físico. Una sola VLAN elimina el encaminamiento a costa de un dominio de difusión enorme y sin separación entre usuarios y servidores.',
    },
    {
      id: 'op1m3q7',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un atacante conectado a un puerto de acceso envía tramas con dos etiquetas 802.1Q para alcanzar una VLAN que no es la suya (doble etiquetado). ¿Qué medida de diseño impide directamente este ataque?',
      choices: [
        'Reducir el tiempo de envejecimiento de la tabla MAC',
        'Dar a todos los conmutadores la misma prioridad de árbol de expansión',
        'Agregar los enlaces troncales con LACP',
        'Usar como VLAN nativa de los troncales una VLAN sin equipos, distinta de cualquier VLAN de usuario',
      ],
      answer: 3,
      explain:
        'El ataque solo funciona si el puerto del atacante está en la misma VLAN que la nativa del troncal: el primer conmutador retira la etiqueta exterior porque la nativa viaja sin etiquetar, y el segundo lee la interior. Si la nativa es una VLAN sin puertos de acceso, nadie puede emitir desde ella. Las otras opciones afectan a la tabla MAC, a la elección de raíz o a la capacidad del enlace, pero no al tratamiento de las etiquetas.',
    },
    {
      id: 'op1m3q8',
      domain: 'Redes de comunicaciones',
      cognitiveLevel: 'apply',
      prompt:
        'En el CPD del Consorcio, dos conmutadores se unen con cuatro enlaces de 10 Gbit/s agrupados mediante LACP. ¿Qué afirmación describe correctamente el resultado?',
      choices: [
        'El árbol de expansión bloquea tres de los cuatro enlaces y deja uno activo',
        'El grupo se ve como un único enlace lógico; reparte los flujos entre los cuatro enlaces, pero un flujo individual no supera los 10 Gbit/s',
        'Cualquier transferencia individual alcanza 40 Gbit/s, porque sus tramas se reparten entre los cuatro enlaces',
        'LACP solo funciona si los cuatro enlaces pertenecen a VLAN distintas',
      ],
      answer: 1,
      explain:
        'La agregación de enlaces (802.1AX) presenta los cuatro enlaces como uno solo ante el árbol de expansión, que por eso no bloquea ninguno, y reparte la carga por flujo para no desordenar las tramas de una conversación. La capacidad total llega a 40 Gbit/s solo con muchos flujos simultáneos. La opción de los 40 Gbit/s por transferencia es la que más tienta y es justo el malentendido habitual sobre los LAG.',
    },
  ],
};
