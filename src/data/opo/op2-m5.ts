import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP2M5 — Conectividad entre centros: VPN de capa 3 sobre MPLS (RFC 4364),
// VPN de capa 2 (VPLS, EVPN), interconexión de CPD, doble acceso y respaldo,
// y la Red SARA de las administraciones públicas
// ---------------------------------------------------------------------------
export const OP2_M5: Module = {
  id: 'op2m5',
  sectionId: 'op2',
  title: 'Conectividad entre centros: VPN MPLS y Red SARA',
  minutes: 26,
  objectives: [
    'Explicar cómo funciona una VPN de capa 3 sobre MPLS según la RFC 4364: papeles de CE, PE y P, una VRF por cliente, el RD para que los prefijos sean únicos, los Route Targets para decidir qué entra en cada VRF y las opciones de encaminamiento entre PE y CE',
    'Distinguir las VPN de capa 2 multipunto, VPLS (RFC 4761 con BGP y RFC 4762 con LDP) y EVPN (RFC 7432), y valorar cuándo una organización quiere capa 2 entre sitios y qué arriesga al extenderla',
    'Relacionar la interconexión de centros de datos, el doble acceso y el respaldo con el diseño del Consorcio: WAN principal MPLS y túnel IPsec de respaldo por Internet de otro proveedor',
    'Describir qué es la Red SARA, cómo se conecta un organismo (puntos de presencia, Proveedores de Acceso y área de conexión) y su base legal: artículo 13 del Real Decreto 4/2010 y la Norma Técnica de Interoperabilidad de requisitos de conexión de 2011',
    'Reconocer los matices de las fuentes: la RFC 4364 dice que su VPN no es una superposición, la NTI y el artículo 13 citan normas ya derogadas o sustituidas, y el BOE habla de sTESTA mientras la Comisión Europea habla de TESTA',
  ],
  blocks: [
    {
      t: 'p',
      md: 'En la lección `op1m5` el Consorcio Provincial de Arcedo eligió su WAN: una **VPN de capa 3 sobre MPLS** que une la sede central, con su CPD, y las tres oficinas comarcales, todas con todas y con una clase de servicio para la voz; y, como respaldo, un túnel IPsec por Internet en cada oficina. Allí se vio la etiqueta MPLS y el recorrido de un paquete con la pila `[304][72]`. Aquí abrimos la caja del operador: qué tiene que montar para que la red de Arcedo y la de otro cliente no se mezclen, qué cambia si lo que se quiere unir es una LAN y no una red IP, y cómo se conectan entre sí las administraciones públicas españolas, que tienen su propia red: la **Red SARA**.',
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Qué enlace tiene la oficina con la sede',
      md: 'Las lecciones del bloque 1 no coinciden: `op1m2` numera el enlace de la oficina como un /30, `op1m4` lo trata como fibra con OSPF y `op1m5` como una VPN de capa 3 sobre MPLS con un túnel IPsec de respaldo. Esta lección sigue a **`op1m5`**: acceso MPLS del operador como camino principal y túnel IPsec por Internet de otro proveedor como respaldo.',
    },
    { t: 'h', text: 'Los tres papeles: CE, PE y P' },
    {
      t: 'p',
      md: 'La **RFC 4364** (*BGP/MPLS IP Virtual Private Networks*, norma propuesta de febrero de 2006, vigente; deja obsoleta a la 2547 y la actualizan la 4577, la 4684 y la 5462) reparte los equipos en tres papeles (§1.2). Cada sede del cliente tiene uno o más **CE** (*Customer Edge*), el encaminador del cliente, unidos a uno o más **PE** (*Provider Edge*), el encaminador de borde del operador. Los encaminadores del operador que no tienen ningún CE conectado son los **P** (*Provider*). Lo que une el CE con el PE se llama **circuito de acceso** (*attachment circuit*) y puede ser casi cualquier cosa: PPP, Ethernet, una VLAN, un túnel GRE, L2TP o incluso IPsec. Un detalle que la RFC remarca: un conmutador de capa 2 entre el CE y el PE **no** es un CE. El CE pertenece a la red del cliente; los PE y los P, a la del operador.',
    },
    {
      t: 'p',
      md: 'Lo importante es con quién habla cada uno. El CE es **par de encaminamiento del PE**, no de los CE de las otras sedes: el cliente no tiene que gestionar una troncal virtual con túneles entre sus sedes. La RFC lo dice con todas las letras, la VPN «is NOT an "overlay"» sobre la red del operador (§1.2). Es justo lo contrario de la SD-WAN de la lección `op2m4`, que sí es una superposición. Y los **P no guardan ninguna información de las VPN** (§1.5): las rutas de cada cliente viven solo en los PE que tienen sedes de ese cliente.',
    },
    {
      t: 'table',
      headers: ['Papel', 'De quién es', 'Qué sabe de las VPN', 'En la WAN del Consorcio (op1m5)'],
      rows: [
        ['**CE** (*Customer Edge*)', 'Del cliente', 'Solo sus propias rutas; habla con su PE', 'CE-oficina y CE-sede: el encaminador de cada oficina y el de la sede'],
        ['**PE** (*Provider Edge*)', 'Del operador', 'Una VRF por cliente conectado, con sus rutas', 'PE1 (el de la oficina) y PE2 (el de la sede)'],
        ['**P** (*Provider*)', 'Del operador', 'Nada (RFC 4364 §1.5): solo reenvía por etiqueta', 'El P del recorrido, que cambia la etiqueta 304 por la 511'],
      ],
    },
    { t: 'h', text: 'VRF, RD y Route Target' },
    {
      t: 'p',
      md: 'Un PE da servicio a muchos clientes a la vez, y dos clientes pueden usar **las mismas direcciones privadas**: la RFC 4364 §1.3 admite expresamente que VPN que no comparten sedes tengan direcciones solapadas. ¿Cómo lo resuelve? Primero, separando tablas. Cada PE tiene una tabla de reenvío por defecto y varias **VRF** (*VPN Routing and Forwarding tables*); cada circuito de acceso se asocia por configuración a una VRF, normalmente a una sola (§3). El paquete que entra por el circuito del Consorcio se busca en la VRF del Consorcio y en ninguna otra.',
    },
    {
      t: 'p',
      md: 'Segundo, haciendo únicas las rutas cuando viajan entre PE. Si el Consorcio y otro cliente del operador anuncian los dos `10.20.8.0/24`, el PE que recibe las dos rutas necesita distinguirlas. Para eso está el **RD** (*Route Distinguisher*, aquí nada que ver con un real decreto): se antepone al prefijo y forma una dirección **VPN-IPv4** de **12 bytes**, el RD de **8 bytes** más la dirección IPv4 de 4 (§4.1). El RD tiene un campo **Type** de 2 bytes y un **Value** de 6 (§4.2): con el tipo 0, el administrador es un número de sistema autónomo de 2 bytes seguido de un número de 4; con el tipo 1, una dirección IPv4 de 4 bytes y un número de 2; con el tipo 2, un número de sistema autónomo de 4 bytes y un número de 2. Ojo: el RD **solo** sirve para distinguir rutas a un mismo prefijo; **no dice a qué VPN va la ruta**.',
    },
    {
      t: 'p',
      md: 'Eso lo deciden los **Route Targets** (RT), un atributo de BGP del tipo comunidad extendida que identifica un conjunto de VRF (§4.3.1). Cada VRF tiene **Export Targets**, que se ponen a las rutas que salen de sus sedes, e **Import Targets**, que deciden qué rutas acepta; no tienen por qué coincidir. La regla es sencilla: una ruta entra en una VRF solo si **alguno de sus RT es Import Target de esa VRF**. Con RT se monta una malla completa (todas las VRF del cliente exportan e importan el mismo), pero también topologías de concentrador y radios o servicios compartidos entre clientes. Los PE se pasan estas rutas por BGP, que da nombre a la RFC; las de las sedes **no** se filtran al protocolo interior de la troncal (§7).',
    },
    {
      t: 'table',
      headers: ['Pieza', 'Tamaño o forma', 'Para qué sirve', 'Lo que no hace'],
      rows: [
        ['**VRF**', 'Una tabla de encaminamiento y reenvío por VPN en cada PE (§3)', 'Separar el tráfico y las rutas de cada cliente dentro del PE', 'No existe en los P'],
        ['**RD**', '8 bytes: Type (2) + Value (6); tipos 0, 1 y 2 (§4.2)', 'Hacer únicas las rutas a un mismo prefijo de clientes distintos', 'No decide a qué VPN va una ruta'],
        ['**Dirección VPN-IPv4**', '12 bytes: RD (8) + IPv4 (4) (§4.1)', 'Lo que se anuncia entre PE', 'No es una dirección que vea el cliente'],
        ['**Route Target**', 'Comunidad extendida de BGP (§4.3.1)', 'Controlar qué rutas importa y exporta cada VRF', 'No hace únicos los prefijos'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio y otro cliente del mismo operador usan los dos la red 10.20.8.0/24. ¿Qué permite que el PE que recibe ambas rutas por BGP las trate como rutas distintas?',
        choices: [
          'El Route Target, que hace único cada prefijo',
          'El RD de 8 bytes que se antepone al prefijo y forma una dirección VPN-IPv4 de 12 bytes',
          'La etiqueta exterior de la pila MPLS, que cambia en cada salto',
          'Que los P guarden una copia de cada VRF para separar a los clientes',
        ],
        answer: 1,
        explain:
          'La RFC 4364 §4.1 usa el RD solo para eso: convertir prefijos que se solapan en direcciones VPN-IPv4 distintas. El Route Target tienta, pero decide qué rutas entran en cada VRF, no hace únicos los prefijos. La etiqueta exterior lleva el paquete hasta el PE de salida, y los P no guardan información de las VPN (§1.5).',
      },
    },
    { t: 'h', text: 'Las dos etiquetas, otra vez' },
    {
      t: 'p',
      md: 'Con esto se entiende la pila `[304][72]` de `op1m5`. La RFC 4364 §5 pone dos etiquetas: la **interior**, de ruta VPN, la asigna el PE de salida (el «BGP Next Hop») y le dice a qué VRF pertenece el paquete; la **exterior**, de túnel, lleva el paquete por la troncal hasta ese PE. En el recorrido del Consorcio, la 72 es la interior y no cambia; la 304 es la exterior y el P la cambia por la 511. La RFC añade un atajo, el *penultimate hop popping*: el último P antes del PE de salida quita la etiqueta exterior y al PE le llega solo la de la VPN. El dibujo de `op1m5` está hecho sin ese atajo; con él, el P quitaría la 304 y PE2 recibiría solo `[72]`. Para interoperar, la RFC exige soportar **LDP** (*Label Distribution Protocol*) y que cada PE anuncie su dirección /32 en el protocolo interior.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Oficina 10.20.8.0/24 hacia la sede 10.20.10.0/24 (esquema de op1m5, sin sintaxis de fabricante)',
      text: `CE-oficina --IP--> PE1 --[304][72]--> P --[511][72]--> PE2 --IP--> CE-sede

En PE1:  el circuito de la oficina está asociado a la VRF del Consorcio.
         La ruta 10.20.10.0/24 llegó por BGP como VPN-IPv4 (RD + prefijo),
         con un Route Target que la VRF importa y con la etiqueta 72,
         que asignó PE2.
         PE1 pone la 72 (VPN) y encima la 304 (túnel hacia PE2).
En P:    solo mira la exterior: 304 -> 511. No sabe nada del Consorcio.
En PE2:  la 72 le dice la VRF; busca 10.20.10.0/24 en ella y entrega a CE-sede.

Con penultimate hop popping, P quitaría la exterior y PE2 recibiría [72].`,
    },
    {
      t: 'check',
      q: {
        q: 'En el recorrido de op1m5, ¿quién asignó la etiqueta 72 y qué indica?',
        choices: [
          'La asignó PE2, el PE de salida, e indica a qué VRF pertenece el paquete',
          'La asignó el P de la troncal e indica el siguiente salto dentro del núcleo',
          'La asignó CE-oficina e indica la VLAN de origen del paquete',
          'La asignó PE1 e indica el Route Target de la ruta',
        ],
        answer: 0,
        explain:
          'Según la RFC 4364 §5, la etiqueta interior de ruta VPN la asigna el BGP Next Hop, es decir, el PE de salida, y sirve para que este sepa en qué VRF buscar. El P solo cambia la exterior (304 por 511) y no sabe nada de las VPN. El CE no pone etiquetas MPLS, y el Route Target es un atributo de BGP, no una etiqueta.',
      },
    },
    { t: 'h', text: 'Cómo habla el CE con el PE' },
    {
      t: 'p',
      md: 'Entre el CE y el PE hace falta que el PE aprenda las redes de la sede y que la sede aprenda las demás. La RFC 4364 §7 recoge cuatro opciones. El protocolo dinámico que se elija aquí se ejecuta **dentro de la VRF** del cliente, no en la troncal del operador. Cómo se comportan OSPF y BGP en general está en la lección `op1m4`.',
    },
    {
      t: 'table',
      headers: ['Opción PE-CE (RFC 4364 §7)', 'Lo que dice la RFC', 'Cuándo encaja'],
      rows: [
        ['**Rutas estáticas**', 'Útiles sobre todo en una sede *stub*, con una sola salida', 'Sedes pequeñas que no son tránsito para nadie'],
        ['**RIP**', 'Admitido como protocolo PE-CE', 'Equipos de cliente sencillos'],
        ['**OSPF**', 'El PE aparece ante el CE como un encaminador del **área 0**; una instancia de OSPF por VPN en el PE (la RFC 4577 lo desarrolla)', 'Clientes que ya usan OSPF en sus sedes'],
        ['**BGP**, en particular **eBGP**', 'Vale para sedes *stub* y de tránsito; no obliga al PE a mantener varias instancias de protocolo interior; los CE *stub* pueden compartir un número de sistema autónomo privado, que el PE quita', 'Lo más flexible; el operador no necesita un protocolo interior por cliente'],
      ],
    },
    {
      t: 'p',
      md: 'El canon del Consorcio **no fija** qué opción usa la WAN de Arcedo ni ningún número de sistema autónomo, así que aquí no se elige ninguna. Lo que sí se puede razonar: si la sede central es la que concentra el CPD `10.20.72.0/21` y las oficinas solo hablan con ella y entre sí, cualquier opción sirve para anunciar redes; lo que cambia es cuánto trabajo hace el operador y cuánto control conserva el Consorcio.',
    },
    {
      t: 'check',
      q: {
        q: 'Un operador ofrece eBGP como protocolo entre PE y CE a varias sedes stub de un mismo cliente. Según la RFC 4364 §7, ¿qué ventaja tiene frente a OSPF?',
        choices: [
          'Que los P de la troncal aprenden las rutas del cliente y pueden encaminar por IP',
          'Que no hace falta VRF en el PE, porque eBGP ya separa a los clientes',
          'Que las rutas de las sedes se filtran al protocolo interior de la troncal y convergen antes',
          'Que el PE no necesita varias instancias de protocolo interior y los CE stub pueden compartir un número de sistema autónomo privado, que el PE quita',
        ],
        answer: 3,
        explain:
          'La RFC 4364 §7 destaca de eBGP que sirve para sedes stub y de tránsito, que evita varias instancias de protocolo interior en el PE y que los CE stub pueden compartir un número de sistema autónomo privado. Las rutas del cliente no van a los P ni al protocolo interior de la troncal, y la VRF sigue siendo necesaria sea cual sea el protocolo PE-CE.',
      },
    },
    { t: 'h', text: 'Cuando se quiere capa 2 entre sitios: VPLS y EVPN' },
    {
      t: 'p',
      md: 'La VPN de capa 3 une **redes IP**: cada sede tiene sus subredes y el operador encamina entre ellas. A veces una organización quiere otra cosa: que dos o más sitios compartan **la misma LAN**, por ejemplo para mover una máquina virtual de un centro de datos a otro sin cambiarle la dirección o para aplicaciones que necesitan estar en el mismo segmento. Para eso están las VPN de capa 2 multipunto.',
    },
    {
      t: 'p',
      md: '**VPLS** (*Virtual Private LAN Service*, también llamado «Transparent LAN Service») es una VPN de capa 2 **multipunto** que se comporta como una LAN Ethernet, frente a las VPN de capa 2 punto a punto. Hay dos RFC, las dos normas propuestas de enero de 2007: la **RFC 4761** usa **BGP** para el autodescubrimiento de los PE y la señalización, y la **RFC 4762** usa **pseudocables** (*pseudowires*) señalizados con **LDP** y no se ata a ningún método de descubrimiento. La 4762 crea un dominio de difusión que **aprende direcciones MAC** como un conmutador. Para no formar bucles sin depender del protocolo de árbol de expansión en la red del operador, los PE se unen en **malla completa** de pseudocables y aplican la regla de ***split horizon***: un PE **no debe** (MUST NOT) reenviar lo que llega por un pseudocable a otro pseudocable de la misma malla (§4.4). Como la malla completa crece mucho, la §10 define una versión jerárquica, **H-VPLS**.',
    },
    {
      t: 'p',
      md: '**EVPN** (*Ethernet VPN*, RFC 7432, norma propuesta de febrero de 2015; la actualizan, entre otras, la 8584 para la elección del reenviador designado) nace de los límites de VPLS: la RFC 7432 §1 cita el doble acceso y la redundancia, la multidifusión, el aprovisionamiento y el reparto por flujo y por varios caminos, importantes en un CPD. El cambio de fondo es que EVPN **aprende las MAC por el plano de control**, con BGP multiprotocolo, y no por el plano de datos como VPLS (§4). Cada instancia tiene una **MAC-VRF**, una VRF de direcciones MAC, con su RD y uno o más Route Targets, igual que en la capa 3.',
    },
    {
      t: 'p',
      md: 'Su punto fuerte es el doble acceso. Un **segmento Ethernet** es el conjunto de enlaces que unen una sede a uno o más PE (§3), y se identifica con un **ESI** (*Ethernet Segment Identifier*), un entero de **10 octetos**: el ESI 0 indica una sede con un solo acceso y el valor con todos los bits a uno (0xFF en cada octeto) es MAX-ESI, reservado (§5). Un segmento puede funcionar en modo **Single-Active**, en el que un solo PE reenvía por VLAN, o **All-Active**, en el que todos los PE reenvían el tráfico unicast conocido. EVPN anuncia cuatro tipos de ruta (§7): **1** Ethernet Auto-Discovery, **2** MAC/IP Advertisement, **3** Inclusive Multicast Ethernet Tag y **4** Ethernet Segment, en la familia **AFI 25** (*Address Family Identifier*, L2VPN) y **SAFI 70** (*Subsequent Address Family Identifier*, EVPN). Existen otras extensiones de EVPN, como las rutas de prefijos IP o EVPN sobre otros túneles; aquí no se tratan.',
    },
    {
      t: 'table',
      headers: ['Qué se compara', 'VPN de capa 3 (RFC 4364)', 'VPLS (RFC 4761 / 4762)', 'EVPN (RFC 7432)'],
      rows: [
        ['**Qué une**', 'Redes IP; el operador encamina', 'Una LAN Ethernet multipunto', 'Una LAN Ethernet multipunto'],
        ['**Cómo aprende**', 'Rutas IP por BGP entre PE', 'MAC en el plano de datos, como un conmutador', 'MAC por el plano de control, con BGP (§4)'],
        ['**Señalización**', 'BGP (rutas VPN-IPv4) y LDP para los túneles (§5)', 'BGP (4761) o pseudocables con LDP (4762)', 'BGP multiprotocolo; AFI 25 / SAFI 70'],
        ['**Contra los bucles**', 'Encaminamiento IP', 'Malla completa + *split horizon* (4762 §4.4)', '*Split horizon* y reenviador designado (§8)'],
        ['**Doble acceso**', 'Un CE puede unirse a varios PE (§1.2)', 'Limitado (7432 §1)', 'Segmento Ethernet con ESI; Single-Active o All-Active'],
      ],
    },
    {
      t: 'p',
      md: 'Extender la capa 2 tiene un precio que conviene tener claro. VPLS crea **un único dominio de difusión** entre los sitios (RFC 4762), y eso significa que lo que inunda la LAN de un sitio llega a los demás: la difusión, las tramas a destinos desconocidos y, si algo forma un bucle en una de las sedes, sus efectos. Con capa 3, en cambio, cada sitio es su propio dominio de difusión y una avería local se queda en casa (la difusión y el árbol de expansión están en la lección `op1m3`). Por eso la pregunta de diseño no es «¿se puede?», sino «¿de verdad hace falta la misma LAN?». Si basta con que las redes se vean, la capa 3 aísla mejor.',
    },
    {
      t: 'check',
      q: {
        q: 'En otra red, una organización con dos CPD quiere que la misma VLAN exista en ambos y que sus servidores se conecten a dos PE que reenvíen los dos a la vez. ¿Qué tecnología responde a ese requisito según las RFC leídas?',
        choices: [
          'EVPN (RFC 7432), con un segmento Ethernet identificado por su ESI en modo All-Active',
          'Una VPN de capa 3 sobre MPLS (RFC 4364), porque une redes IP entre sedes',
          'VPLS con LDP (RFC 4762), que aprende las MAC por BGP',
          'Una VPN de capa 3 con un RD distinto en cada CPD para que la VLAN sea única',
        ],
        answer: 0,
        explain:
          'La RFC 7432 permite que una sede se una a varios PE en un segmento Ethernet con modo All-Active, en el que todos reenvían el unicast conocido; la §1 presenta justo el doble acceso como un límite de VPLS. La capa 3 une redes IP, no una misma VLAN, y el RD no tiene nada que ver con VLAN. VPLS con LDP aprende las MAC en el plano de datos, no por BGP.',
      },
    },
    { t: 'h', text: 'Interconectar centros de datos, doble acceso y respaldo' },
    {
      t: 'callout',
      kind: 'story',
      title: 'Otra red, no el Consorcio',
      md: 'El Consorcio **no tiene CPD de respaldo** (el de `op1m5` es solo una hipótesis), así que lo que sigue es lo que se ve en organizaciones con dos centros. Para unirlos hay tres familias, que se combinan: la **capa física**, con fibra oscura y DWDM cuando hace falta mucho caudal y latencia mínima (lección `op1m5`); la **capa 3**, con una VPN como la de la RFC 4364, cuando basta con que las redes de los dos centros se vean; y la **capa 2**, con VPLS o EVPN, cuando hay que extender una misma LAN, con el riesgo de compartir el dominio de difusión que se acaba de ver. EVPN aporta el doble acceso con varios PE activos que la RFC 7432 §1 echa en falta en VPLS. Qué hacer con los servicios cuando un centro cae (activo-pasivo, activo-activo) es materia de la lección `op4m1`.',
    },
    {
      t: 'p',
      md: 'El **doble acceso** (*dual-homing*) responde a una pregunta sencilla: ¿qué pasa si cae el enlace o el equipo que une una sede con la red? En la RFC 4364 cada sede puede tener uno o más CE unidos a uno o más PE (§1.2); en EVPN, el segmento Ethernet con varios PE lo formaliza. Pero si los dos accesos van al mismo operador, comparten su suerte. El Consorcio lo resuelve de otra manera, más barata: cada oficina comarcal tiene **su propio encaminador** con **dos salidas**, el acceso MPLS del operador como camino principal y un acceso a Internet **de otro proveedor**, que solo lleva el túnel IPsec de respaldo hasta el encaminador central de la sede, en `203.0.113.10` (IKEv2 por UDP 500 y 4500). La primera oficina sale por `198.51.100.31`. Si cae el MPLS, el tráfico entre `10.20.8.0/24` y la sede va cifrado por Internet; mientras funciona, el túnel no se usa. Cómo se negocia y se mantiene ese túnel es la lección `op2m2`.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Primera oficina comarcal: dos caminos hacia la sede (esquema, sin sintaxis de fabricante)',
      text: `Encaminador de la oficina (10.20.8.0/24)
  |
  |-- principal:  acceso MPLS del operador -> PE1 ... PE2 -> CE-sede
  |               (VPN de capa 3, VRF del Consorcio, clase de servicio para la voz)
  |
  '-- respaldo:   Internet de otro proveedor, 198.51.100.31
                  -> túnel IPsec (IKEv2, UDP 500/4500) -> 203.0.113.10,
                     encaminador central de la sede
                  (solo si cae el principal)

Dos operadores distintos: una avería del operador MPLS no se lleva el respaldo.`,
    },
    {
      t: 'check',
      q: {
        q: 'La primera oficina comarcal pierde el acceso MPLS. ¿Por dónde sigue hablando con la sede y por qué el diseño del Consorcio usa otro proveedor para ese camino?',
        choices: [
          'Por un segundo PE del mismo operador, porque así la VRF del Consorcio no cambia',
          'Por un pseudocable VPLS del mismo operador, que extiende la LAN de la oficina hasta la sede',
          'Por el túnel IPsec sobre el acceso a Internet de otro proveedor hasta 203.0.113.10; con otro proveedor, una avería del operador MPLS no deja también sin respaldo a la oficina',
          'Por la Red SARA, que une a todas las administraciones y sustituye a la WAN del Consorcio',
        ],
        answer: 2,
        explain:
          'El canon fija para cada oficina un encaminador con dos salidas: el MPLS principal y un acceso a Internet de otro proveedor que solo lleva el túnel IPsec de respaldo hacia el encaminador central de la sede, en 203.0.113.10. Un segundo PE del mismo operador comparte su suerte, el Consorcio no tiene VPLS y la Red SARA une administraciones distintas, no las sedes de una misma organización.',
      },
    },
    {
      t: 'links',
      title: 'Lo que ya está explicado en otras lecciones',
      items: [
        { label: 'Etiqueta MPLS, fibra oscura y DWDM (lección op1m5)', href: '/learn/op1m5' },
        { label: 'OSPF, BGP y rutas flotantes (lección op1m4)', href: '/learn/op1m4' },
        { label: 'VLAN, difusión y árbol de expansión (lección op1m3)', href: '/learn/op1m3' },
        { label: 'VPN IPsec e IKEv2 (lección op2m2)', href: '/learn/op2m2' },
        { label: 'SD-WAN, superposición y subyacente (lección op2m4)', href: '/learn/op2m4' },
        { label: 'Alta disponibilidad: activo-activo y activo-pasivo (lección op4m1)', href: '/learn/op4m1' },
        { label: 'SD-WAN, VPN e IPsec en Security+ (sp3m5)', href: '/learn/sp3m5' },
      ],
    },
    { t: 'h', text: 'La Red SARA: la red de las administraciones' },
    {
      t: 'p',
      md: 'Hasta aquí, cómo une una organización sus propias sedes. Las administraciones públicas españolas, además, necesitan hablar **entre sí**: consultar datos de otro organismo, intercambiar documentos o llegar a las instituciones europeas. Para eso existe la **Red SARA** (*Sistemas de Aplicaciones y Redes para las Administraciones*). Según su ficha en el Portal de Administración Electrónica (PAe), es un conjunto de infraestructuras de comunicaciones y servicios básicos que conecta las redes de las administraciones públicas españolas e instituciones europeas, pensado para «Cualquier Administración Pública», y de la que es responsable el Ministerio para la Transformación Digital y de la Función Pública.',
    },
    {
      t: 'p',
      md: 'La misma ficha describe sus características: una red **completamente mallada**, sin puntos únicos de fallo y con soporte 24x7x365; **tráfico cifrado** y un sistema de alerta temprana con el **CCN-CERT**; capacidad de **10 Gbps en los ministerios y 100 Mbps en las comunidades autónomas**, según dice la propia página; calidad de servicio por tipo de dato y una **pasarela IPv6** común. Lo que no da la ficha, y por tanto aquí no se cuenta, es cuántos organismos o ayuntamientos están conectados ni la lista de servicios: el catálogo está en `www.redsara.es`, que solo se puede abrir desde la propia Red SARA.',
    },
    {
      t: 'h',
      text: 'Base legal: el artículo 13 del Esquema Nacional de Interoperabilidad',
    },
    {
      t: 'p',
      md: 'El **ENI** (*Esquema Nacional de Interoperabilidad*) es el **Real Decreto 4/2010**, de 8 de enero, vigente. Su **artículo 13**, «Red de comunicaciones de las Administraciones públicas españolas», dice que las administraciones usarán **preferentemente** esa red para comunicarse entre sí, conectando a ella sus redes o sus nodos de interoperabilidad, para intercambiar información y servicios y para interconectarse con las redes de las **instituciones de la Unión Europea** y de otros Estados miembros. Y añade, literalmente: «La Red SARA prestará la citada Red de comunicaciones de las Administraciones públicas españolas». Para conectarse se aplican los requisitos que remite a la **disposición adicional primera**, que enumera las Normas Técnicas de Interoperabilidad; entre ellas, la de **requisitos de conexión** a esa red y la del **plan de direccionamiento**. El **artículo 14**, en la redacción que le dio el Real Decreto 203/2021, obliga a aplicar el Plan de direccionamiento e interconexión de redes en la Administración, para administrar bien las direcciones IP y no duplicarlas.',
    },
    {
      t: 'p',
      md: 'La **NTI** (*Norma Técnica de Interoperabilidad*) de requisitos de conexión a la red de comunicaciones de las administraciones públicas españolas es una **Resolución de 19 de julio de 2011**, vigente y en vigor desde el 31 de julio de 2011. Fija las condiciones en que cualquier órgano de una administración, o entidad de derecho público vinculada o dependiente, accede a la Red SARA (§I.1). Su modelo de conexión tiene tres piezas:',
    },
    {
      t: 'list',
      items: [
        '**Punto de presencia** (§II.1): la sede que tiene conexión directa con la Red SARA, sin organización intermedia. Los hay de varios tipos: los Proveedores de Acceso, el CPD de SARA, la red sTESTA, centros externos de monitorización, prestadores de servicios de certificación y otros.',
        '**Proveedor de Acceso a la Red SARA** (**PAS**, §II.3): tiene un área de conexión en sus dependencias y da acceso a sus unidades y organismos dependientes; en el caso de las comunidades autónomas, también a las **administraciones locales de su territorio**. Son PAS los ministerios, las comunidades y ciudades autónomas y los órganos constitucionales. Todo órgano usuario final entra a través de un PAS y le pide a él la conexión (§II.4).',
        '**Área de conexión** (§III.1): el **punto único de conexión** con las demás administraciones y con sTESTA. Tiene estructura de DMZ, entre un subsistema de seguridad **externo** y otro **interno**, y alberga los servicios básicos DNS, SMTP, NTP, proxy y proxy inverso. El subsistema externo levanta una VPN con las demás sedes, de modo que todo el tráfico que pasa por el operador va **cifrado en túneles**.',
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'El Consorcio de Arcedo y la Red SARA',
      md: 'El canon **no dice** que el Consorcio esté conectado a la Red SARA, ni con qué equipos. Lo que sí se puede decir es lo que prevé la norma: las entidades locales no tienen PAS propio, quedan asignadas al **PAS de su comunidad autónoma** (NTI §II.3). Así que el Consorcio, como entidad local, llegaría a la Red SARA a través del punto de acceso de su comunidad autónoma, pidiendo a ella la conexión (§II.4), y no directamente ni a través de su operador MPLS. La ficha del PAe no lo explica: sale de la NTI. Y no hay que confundir las dos redes: la WAN MPLS une las sedes **del Consorcio**; la Red SARA une **administraciones distintas**.',
    },
    {
      t: 'table',
      headers: ['Norma o fuente', 'Estado', 'Qué aporta', 'El matiz'],
      rows: [
        ['**Real Decreto 4/2010** (ENI), art. 13', 'Vigente', 'Uso preferente de la red de las administraciones; «La Red SARA prestará» esa red; conexión con las instituciones de la UE', 'Su apartado 1 sigue citando el art. 43 de la **Ley 11/2007**, derogada el 2-4-2021: redacción no actualizada'],
        ['RD 4/2010, art. 14 y disposición adicional primera', 'Vigente (redacción del RD 203/2021; la DA 1.ª, apartado 2, tocada después por el RD 1125/2024)', 'Plan de direccionamiento; lista de NTI, entre ellas la de requisitos de conexión', '—'],
        ['**NTI de requisitos de conexión** (Resolución de 19-7-2011)', 'Vigente, en vigor desde el 31-7-2011', 'Puntos de presencia, PAS, área de conexión; entidades locales a través del PAS de su comunidad autónoma', 'Para el acondicionamiento físico remite al ENS de entonces, el RD 3/2010, hoy sustituido por el **RD 311/2022**'],
        ['Ficha «Red SARA» del PAe', 'Sin fecha (pie de 2025)', 'Qué es, para quién, malla completa, cifrado, 10 Gbps / 100 Mbps', 'Como base legal cita aún el art. 43 de la Ley 11/2007'],
        ['Ley 40/2015', 'Vigente', 'Nada sobre la red: su texto consolidado no nombra la Red SARA', 'No buscar ahí la base legal'],
      ],
    },
    {
      t: 'p',
      md: 'La base legal, por tanto, está **envejecida** pero vigente: el artículo 13 del ENI y la NTI de 2011 siguen en vigor, aunque citan la Ley 11/2007, derogada, y la NTI remite al antiguo ENS, el Real Decreto 3/2010, que hoy es el Real Decreto 311/2022 (lecciones `op6m1` y `op6m3`). Lo prudente al citar es nombrar la norma vigente y el precepto concreto: «según el artículo 13 del Real Decreto 4/2010» o «según la NTI de requisitos de conexión».',
    },
    {
      t: 'p',
      md: 'Queda la parte europea. El anexo del ENI pone como ejemplo de infraestructura común **«la red transeuropea sTESTA»**, y la NTI cuenta sTESTA entre los puntos de presencia. La Comisión Europea, en cambio, describe **TESTA** (*Trans European Services for Telematics between Administrations*): una red de la Comisión para el intercambio seguro entre administraciones, que usa protocolos IP pero está **separada de Internet** y conecta instituciones y agencias de la UE y redes nacionales; habla de su nueva generación, **TESTA-ng**, y no menciona sTESTA. Ninguna de las fuentes leídas relaciona sTESTA con TESTA-ng, así que lo correcto es usar cada nombre donde lo usa su fuente.',
    },
    {
      t: 'check',
      q: {
        q: 'En un informe se lee que la base legal de la Red SARA es el artículo 43 de la Ley 11/2007. ¿Qué corrección es la adecuada?',
        choices: [
          'Ninguna: la Ley 11/2007 sigue vigente y es la norma de referencia',
          'Citar la Ley 40/2015, que regula expresamente la Red SARA',
          'Citar el artículo 13 del Real Decreto 4/2010 (ENI), vigente, y la NTI de requisitos de conexión; la Ley 11/2007 está derogada aunque el artículo 13 aún la mencione',
          'Citar solo la ficha del PAe, porque ninguna norma del BOE nombra la Red SARA',
        ],
        answer: 2,
        explain:
          'El artículo 13 del RD 4/2010 dice que la Red SARA prestará la red de comunicaciones de las administraciones y la NTI de 2011 fija cómo conectarse; los dos están vigentes. La Ley 11/2007 está derogada desde 2021, aunque el artículo 13 la siga citando. La Ley 40/2015 no nombra la Red SARA, y el propio artículo 13 sí lo hace, así que no es cierto que ninguna norma del BOE la mencione.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que se confunde a menudo',
      md: '**CE** del cliente, **PE** y **P** del operador; el **P no sabe nada** de las VPN (RFC 4364 §1.5). La VPN de la 4364 **no es una superposición** (§1.2); la SD-WAN sí. **RD**: 8 bytes (Type 2 + Value 6), forma la dirección **VPN-IPv4** de 12 bytes y **solo** hace únicos los prefijos. **Route Target**: comunidad extendida; **Import** y **Export Targets** deciden qué entra en cada VRF. Etiqueta **interior** = VPN, la asigna el PE de salida; **exterior** = túnel. PE-CE: estáticas, RIP, OSPF (PE como área 0) o **eBGP**. **VPLS**: 4761 con BGP, 4762 con LDP y *split horizon*; aprende MAC en el plano de datos. **EVPN** (7432): MAC por el plano de control, **ESI de 10 octetos**, Single-Active / All-Active, rutas de tipo **1 a 4**, **AFI 25 / SAFI 70**. **Red SARA**: art. 13 del **RD 4/2010** (ENI) y **NTI de 2011**; las entidades locales entran por el **PAS de su comunidad autónoma** (NTI §II.3); **10 Gbps** ministerios / **100 Mbps** comunidades autónomas, según el PAe. El BOE dice **sTESTA**; la Comisión, **TESTA** y **TESTA-ng**.',
    },
  ],
  quiz: [
    {
      id: 'op2m5q1',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Según la RFC 4364, ¿cómo está formado el RD (Route Distinguisher) y qué dirección forma junto con el prefijo IPv4?',
      choices: [
        '4 bytes, igual que una dirección IPv4, y forma una dirección VPN-IPv4 de 8 bytes',
        '6 bytes de valor sin campo de tipo, y forma una dirección VPN-IPv4 de 10 bytes',
        '8 bytes, con un campo Type de 2 bytes y un Value de 6, y forma una dirección VPN-IPv4 de 12 bytes',
        '8 bytes que identifican la VPN de destino, y sustituyen a la dirección IPv4 en la troncal',
      ],
      answer: 2,
      explain:
        'La RFC 4364 §4.1 y §4.2 fijan un RD de 8 bytes (Type de 2 y Value de 6) que, con los 4 bytes de la IPv4, forma una dirección VPN-IPv4 de 12 bytes. La última opción tienta por el tamaño correcto, pero el RD no identifica la VPN de destino: eso lo hacen los Route Targets.',
    },
    {
      id: 'op2m5q2',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Un PE recibe por BGP una ruta VPN-IPv4. Según la RFC 4364 §4.3.1, ¿qué decide si esa ruta entra en una VRF concreta?',
      choices: [
        'Que alguno de los Route Targets de la ruta sea Import Target de esa VRF',
        'Que el RD de la ruta coincida con el RD configurado en la VRF',
        'Que la etiqueta exterior de la ruta sea la misma que usa el túnel hacia el PE',
        'Que el CE de la sede haya anunciado esa misma ruta por OSPF',
      ],
      answer: 0,
      explain:
        'Una ruta entra en una VRF solo si alguno de sus Route Targets es Import Target de esa VRF. El RD tienta, pero solo hace únicos los prefijos: dos VRF pueden compartir rutas con RD distintos si casan sus Route Targets. La etiqueta de túnel no interviene en la importación.',
    },
    {
      id: 'op2m5q3',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'En una VPN de capa 3 sobre MPLS según la RFC 4364, ¿qué información de las VPN de los clientes guardan los encaminadores P de la troncal?',
      choices: [
        'Una VRF por cada cliente, igual que los PE',
        'Las rutas de todos los clientes, filtradas al protocolo interior de la troncal',
        'Solo los Route Targets, para saber a qué PE reenviar cada paquete',
        'Ninguna: las rutas de cada VPN están solo en los PE que tienen sedes de esa VPN',
      ],
      answer: 3,
      explain:
        'La RFC 4364 §1.5 dice que los P no mantienen información por VPN; solo la tienen los PE de esa VPN. Además, la §7 prohíbe filtrar las rutas de las sedes al protocolo interior de la troncal. Los P reenvían mirando solo la etiqueta exterior.',
    },
    {
      id: 'op2m5q4',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Según el artículo 13 del Real Decreto 4/2010, Esquema Nacional de Interoperabilidad, ¿qué papel tiene la Red SARA?',
      choices: [
        'Es una red privada de cada comunidad autónoma, que las administraciones locales pueden usar si quieren',
        'Presta la red de comunicaciones de las administraciones públicas españolas, que estas usarán preferentemente para comunicarse entre sí y con las instituciones de la Unión Europea',
        'Sustituye a Internet para todos los servicios que las administraciones ofrecen a la ciudadanía',
        'Es la red transeuropea de la Comisión Europea, también llamada TESTA-ng',
      ],
      answer: 1,
      explain:
        'El artículo 13 del RD 4/2010 establece el uso preferente de la red de comunicaciones de las administraciones públicas españolas, también para conectarse con las instituciones de la UE y otros Estados miembros, y dice que «La Red SARA prestará» esa red. No sustituye a Internet para la ciudadanía, y TESTA-ng es la red de la Comisión, que ninguna fuente leída identifica con la Red SARA.',
    },
    {
      id: 'op2m5q5',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Una entidad local quiere conectarse a la Red SARA. Según la NTI de requisitos de conexión de 2011, ¿cómo lo hace?',
      choices: [
        'Se convierte en Proveedor de Acceso a la Red SARA y monta su propia área de conexión',
        'Contrata la conexión directamente con el operador de su WAN, que la une al CPD de SARA',
        'A través del Proveedor de Acceso de su comunidad autónoma, al que tiene asignado y al que pide la conexión',
        'A través de la red sTESTA, que es el punto de presencia de las administraciones locales',
      ],
      answer: 2,
      explain:
        'La NTI §II.3 asigna las entidades locales al PAS de su comunidad autónoma, y la §II.4 dice que todo órgano usuario final entra a través de un PAS y le pide a él la conexión. Son PAS los ministerios, las comunidades y ciudades autónomas y los órganos constitucionales, no las entidades locales; sTESTA es otro tipo de punto de presencia, el europeo.',
    },
    {
      id: 'op2m5q6',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        '¿Qué diferencia de fondo hay entre EVPN (RFC 7432) y VPLS en la forma de aprender las direcciones MAC?',
      choices: [
        'EVPN las aprende por el plano de control, con BGP, y VPLS por el plano de datos, como un conmutador',
        'EVPN las aprende por el plano de datos y VPLS por BGP en todos los casos',
        'Ninguna: las dos aprenden por el plano de datos y solo cambia el protocolo de señalización',
        'EVPN no aprende direcciones MAC, porque solo transporta rutas IP',
      ],
      answer: 0,
      explain:
        'La RFC 7432 §4 dice que en EVPN el aprendizaje de MAC entre PE va por el plano de control (BGP multiprotocolo), no por el de datos como en VPLS, y eso permite repartir carga con varios PE activos. La segunda opción tienta porque la RFC 4761 usa BGP, pero para autodescubrir PE y señalizar, no para aprender MAC. EVPN tiene MAC-VRF: sí aprende MAC.',
    },
    {
      id: 'op2m5q7',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'En VPLS con señalización LDP (RFC 4762), los PE forman una malla completa de pseudocables. ¿Qué regla evita los bucles sin depender del árbol de expansión en la red del operador?',
      choices: [
        'Cada PE ejecuta el protocolo de árbol de expansión con los demás PE y bloquea un pseudocable',
        'El RD de cada PE es distinto, así que una trama nunca vuelve al mismo PE',
        'Solo el PE con el ESI más bajo reenvía las tramas de difusión',
        'Split horizon: un PE no debe reenviar lo que llega por un pseudocable a otro pseudocable de la misma malla',
      ],
      answer: 3,
      explain:
        'La RFC 4762 §4.4 combina la malla completa con la regla de split horizon: un PE MUST NOT reenviar de un pseudocable a otro de la misma malla. Así no hace falta árbol de expansión en el proveedor. El RD es de las VPN con BGP, no de VPLS-LDP, y el ESI pertenece a EVPN.',
    },
    {
      id: 'op2m5q8',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Un responsable del Consorcio dice que su VPN de capa 3 sobre MPLS es «una superposición de túneles entre nuestros CE, como una SD-WAN». ¿Qué responde la RFC 4364 §1.2?',
      choices: [
        'Tiene razón: cada CE mantiene túneles con los CE de las otras sedes',
        'No: el CE es par de encaminamiento del PE y no de los CE de otras sedes, y la RFC dice que la VPN no es una superposición sobre la red del operador',
        'Tiene razón solo si el protocolo entre PE y CE es eBGP',
        'No, porque en una VPN MPLS el CE no intercambia rutas con nadie y todo se configura con estáticas en el PE',
      ],
      answer: 1,
      explain:
        'La RFC 4364 §1.2 dice que el CE es par del PE, no de los CE de otras sedes, y que la VPN «is NOT an "overlay"»: el cliente no gestiona una troncal virtual. La SD-WAN sí es una superposición. El CE sí puede intercambiar rutas con el PE (RIP, OSPF, BGP o estáticas, §7), sea cual sea el protocolo elegido.',
    },
  ],
};
