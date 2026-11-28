import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP2M4 — SD-WAN: qué resuelve frente a la WAN clásica, superposición y
// subyacente, Edge / controlador / orquestador, selección de camino por
// aplicación, ZTP, seguridad del overlay, SASE y SSE como términos
// Fuente única: docs/superpowers/sources/2026-11-27-op2-fuentes.md
// (§7 RFC 10090 §3.1.1, §11.1 MEF 70.2 y RFC 10090, §11.2 Mplify 117.1,
// §12.1 RFC 4364 §1.2, §17 trampas 12, 13, 27 y 28, §18)
// Escenario: docs/superpowers/canon/arcedo.md §6 y §7e (el Consorcio NO tiene
// SD-WAN: todo lo que lo aplica al Consorcio va rotulado como supuesto)
// ---------------------------------------------------------------------------
export const OP2_M4: Module = {
  id: 'op2m4',
  sectionId: 'op2',
  title: 'SD-WAN',
  minutes: 25,
  objectives: [
    'Explicar qué problema resuelve una SD-WAN frente a la WAN clásica de MPLS con un respaldo que solo se usa cuando cae el principal',
    'Distinguir la red superpuesta (overlay) de la subyacente (underlay) con los términos de MEF 70.2, y explicar por qué la RFC 4364 dice que una VPN MPLS de capa 3 no es un overlay',
    'Situar el Edge, el controlador y el orquestador, sabiendo qué fuente define cada uno y cuál no tiene definición en las fuentes leídas',
    'Describir la selección de camino por aplicación a partir de medidas de retardo, variación del retardo y pérdida, y separar lo que fija MEF 70.2 de los umbrales de cada fabricante',
    'Explicar el aprovisionamiento sin intervención (ZTP) y cómo se protege la superposición con IPsec según la RFC 10090',
    'Usar SASE y SSE como lo que son, términos de analista y fabricante, y comparar MPLS, SD-WAN e híbrido para una organización como el Consorcio, como supuesto',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Recuerda cómo une hoy el Consorcio de Arcedo sus sedes: una **VPN de capa 3 sobre MPLS** del operador, con un acceso en la sede central y otro en cada una de las tres oficinas comarcales, y, como respaldo, un **acceso a Internet barato** en cada oficina con un **túnel IPsec** hacia la sede que **solo se usa si cae el principal** (lo viste en la lección de opciones WAN, y verás el MPLS en la de conectividad entre centros y el túnel en la de IPsec). Es un diseño sensato, pero tiene dos pegas. La primera: la línea de respaldo pasa casi todo el tiempo **parada**, pagada y sin llevar tráfico. La segunda: la decisión es **todo o nada**; mientras el MPLS esté vivo, todo va por él, aunque esté congestionado y la línea de Internet esté libre. La **SD-WAN** (*Software-Defined WAN*, WAN definida por software) resuelve eso: usar **a la vez** varios accesos de tipos distintos y decidir **por qué camino va cada aplicación** según una política y según cómo se están comportando los caminos en ese momento.',
    },
    { t: 'h', text: 'Qué es una SD-WAN según MEF 70.2' },
    {
      t: 'p',
      md: 'La referencia pública es **MEF 70.2** «SD-WAN Service Attributes and Service Framework» (octubre de 2023), del **MEF**, que hoy se llama **Mplify Alliance**: la web antigua redirige a la nueva, las normas nuevas salen como «Mplify» seguido del número y las viejas conservan el nombre «MEF 70.2». MEF 70.2 describe el **servicio** SD-WAN como un servicio de conectividad **superpuesto** (*overlay*) que optimiza el transporte de paquetes IP sobre uno o varios **servicios de conectividad subyacentes** (*Underlay Connectivity Services*, **UCS**), reconociendo las **aplicaciones** (*Application Flows*) y aplicando **políticas** (*Policies*). Es una red **de capa 3**: lo que transporta es el paquete IP. Más reciente es la **RFC 10090** (noviembre de 2026, **informativa**), que trata cómo usar **BGP** en las superposiciones SD-WAN y cita MEF 70.2; la propia RFC avisa de que no define una solución completa.',
    },
    {
      t: 'table',
      headers: ['Término de MEF 70.2', 'Qué es', 'Ejemplo o matiz'],
      rows: [
        ['**Servicio SD-WAN**', 'Conectividad superpuesta que reparte paquetes IP sobre uno o varios UCS según la aplicación y la política', 'Lo que contrata o monta la organización'],
        ['**SD-WAN Edge**', 'Conjunto de funciones de red, físicas o virtuales, entre la interfaz con el cliente y la interfaz con los UCS', 'El equipo de cada sede; puede ser un aparato o una máquina virtual'],
        ['**UCS**', 'Servicio que une sedes entre sí o con Internet y sobre el que se presta la SD-WAN', '**Public** = acceso a Internet; **Private** = cualquier otro, como una VPN IP privada o Carrier Ethernet'],
        ['**TVC** (*Tunnel Virtual Connection*)', 'Relación punto a punto entre dos Edges sobre un UCS (o sobre dos accesos a Internet)', 'Tiene características propias: retardo, seguridad, ancho de banda'],
        ['**Application Flow**', 'El tráfico clasificado como una aplicación', 'Cada flujo puede tener sus objetivos de rendimiento'],
        ['**Policy**', 'Reglas que dicen qué trato recibe cada flujo', 'Cifrado, salida a Internet, tipo de UCS, respaldo, rendimiento…'],
      ],
    },
    { t: 'h', text: 'Superposición y subyacente' },
    {
      t: 'p',
      md: 'La **red subyacente** (*underlay*) son los accesos de verdad: la VPN MPLS del operador, una fibra a Internet, una línea móvil. La **red superpuesta** (*overlay*) es la que dibujan los Edges **por encima**, con túneles entre ellos, y que ve la organización como «su» WAN. Los Edges deciden por qué subyacente mandan cada paquete; el operador de cada acceso solo ve tráfico entre dos Edges. La RFC 10090 insiste en no mezclar los dos niveles: el **BGP de control de la superposición** es uno, y el BGP que usen por dentro las redes subyacentes es otro. Y aquí hay un contraste útil: la RFC 4364, la de las VPN de capa 3 sobre MPLS, dice literalmente que esa VPN «is NOT an "overlay"» sobre la red del proveedor. La razón: cada CE es par de enrutamiento del PE del operador, **no** de los CE de las otras sedes, así que el cliente no gestiona una troncal virtual propia. En una SD-WAN pasa justo lo contrario: los Edges montan túneles (TVC) entre sí y forman una superposición propia, que gestiona el proveedor del servicio SD-WAN o la propia organización. Lo curioso es que la RFC 10090 reutiliza piezas de la 4364 para segmentar (**VRF** y **Route Target**), como verás más abajo.',
    },
    {
      t: 'check',
      q: {
        q: 'Según sus propios documentos, ¿cuál de estas dos es una red superpuesta (overlay): una VPN de capa 3 sobre MPLS (RFC 4364) o una SD-WAN (MEF 70.2)?',
        choices: [
          'Las dos, porque las dos llevan el tráfico del cliente por encima de la red de un operador',
          'Solo la SD-WAN: la RFC 4364 dice que su VPN no es un overlay, porque cada CE se empareja con el PE del operador y no con los CE de las otras sedes',
          'Solo la VPN MPLS: la SD-WAN funciona directamente sobre la capa 2',
          'Ninguna: overlay es un término de fabricante sin uso en las normas',
        ],
        answer: 1,
        explain:
          'MEF 70.2 define el servicio SD-WAN como superpuesto a uno o varios servicios subyacentes, y la RFC 10090 habla de redes superpuestas SD-WAN. La RFC 4364, en cambio, dice expresamente que su VPN no es un overlay: el cliente no tiene una troncal virtual propia, porque sus CE solo hablan con los PE del operador. MEF 70.2 dice además que la SD-WAN es una red de capa 3, no de capa 2.',
      },
    },
    { t: 'h', text: 'Edge, controlador y orquestador' },
    {
      t: 'p',
      md: 'Se suele hablar de tres piezas, pero conviene saber quién define qué. El **Edge** lo define MEF 70.2, como ya has visto. MEF 70.2 dice también que la red del proveedor de SD-WAN está formada por los UCS, las TVC, los Edges y «controllers, and orchestrators», pero **solo los nombra**: no los define. La definición de **controlador** está en la **RFC 10090**: un sistema lógico que **gestiona la superposición** y que puede incluir un *Route Reflector* de BGP. La RFC añade que el plano de control está **lógicamente centralizado** (aunque físicamente puede estar repartido), que la superposición es de **un solo dominio administrativo** y que el canal entre controlador y Edge tiene que ser **seguro**. Del **orquestador** no hay definición propia en ninguna de las fuentes de esta lección: MEF 70.2 lo menciona y dice que el servicio se alinea con la **orquestación de servicio** del propio MEF, y poco más. En la práctica se usa para la pieza que da de alta servicios y sedes de principio a fin, pero eso es uso, no norma.',
    },
    {
      t: 'table',
      headers: ['Pieza', 'Qué hace', 'Quién la define'],
      rows: [
        ['**Edge**', 'Clasifica el tráfico por aplicación, elige el camino y monta los túneles con los otros Edges', 'MEF 70.2 §3 (definición propia)'],
        ['**Controlador**', 'Gestiona la superposición; puede incluir un *Route Reflector* de BGP', 'RFC 10090 §2 (MEF 70.2 solo lo nombra)'],
        ['**Orquestador**', 'Uso habitual: da de alta servicios y sedes de principio a fin', '⚠ sin definición en las fuentes leídas; MEF 70.2 solo lo nombra'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Un compañero afirma que el controlador SD-WAN está definido en MEF 70.2. ¿Qué le contestas?',
        choices: [
          'Que tiene razón: MEF 70.2 define el controlador y el orquestador en su tabla de términos',
          'Que el controlador lo define Mplify 117.1, la norma de SASE',
          'Que MEF 70.2 solo lo nombra; la definición de controlador, un sistema lógico que gestiona la superposición, está en la RFC 10090',
          'Que no lo define nadie y que es un término exclusivo de fabricante',
        ],
        answer: 2,
        explain:
          'MEF 70.2 incluye en la red del proveedor «controllers, and orchestrators», pero no los define. La RFC 10090, en su apartado de terminología, define el controlador como el sistema lógico que gestiona la superposición, que puede incluir un Route Reflector. El orquestador sí se queda sin definición propia en las fuentes de esta lección. Mplify 117.1 trata de SASE, no del controlador SD-WAN.',
      },
    },
    { t: 'h', text: 'Elegir el camino por aplicación' },
    {
      t: 'p',
      md: 'Aquí está el corazón de la SD-WAN. El Edge **clasifica** el tráfico en flujos de aplicación y, para cada uno, aplica la política: por qué tipo de subyacente puede ir, si va cifrado, si puede salir directamente a Internet desde la sede, qué camino es el de respaldo. MEF 70.2 obliga a que el servicio ofrezca tres criterios de política: `ENCRYPTION`, `INTERNET-BREAKOUT` y `PUBLIC-PRIVATE`; y recomienda otros, entre ellos `BACKUP`, `VIRTUAL-TOPOLOGY`, `BUSINESS-IMPORTANCE`, `PERFORMANCE` y `BANDWIDTH`. Para decidir según el rendimiento hace falta **medir**, y MEF 70.2 fija tres métricas: el **retardo medio en un sentido** (*One-Way Mean Packet Delay*), la **variación media del retardo en un sentido** (*One-Way Mean Packet Delay Variation*, lo que en la práctica se llama *jitter*) y la **proporción de paquetes perdidos en un sentido** (*One-Way Packet Loss Ratio*). Los caminos se eligen **dinámicamente**: si el MPLS empieza a perder paquetes y la línea de Internet va bien, la voz puede pasar a Internet sin esperar a que el MPLS caiga del todo. Lo que **no** fijan ni MEF 70.2 ni la RFC 10090 son los **umbrales**: cuánto retardo o cuánta pérdida hacen saltar a otro camino lo decide cada organización en su política, con los valores que traiga cada fabricante.',
    },
    {
      t: 'table',
      headers: ['Rasgo (RFC 10090 §1)', 'Qué significa', 'Frente a la WAN clásica'],
      rows: [
        ['**Transport Augmentation**', 'Usar varios tipos de subyacente a la vez, privados o públicos', 'El respaldo deja de estar parado'],
        ['**Direct Internet Breakout**', 'Salida a Internet en la propia sede, sin pasar por la central', 'En la WAN clásica, la sede pequeña sale a Internet a través de la central'],
        ['**Policy-Based Traffic Steering**', 'Cada aplicación va por el camino que dice la política', 'Ya no es «todo por el MPLS»'],
        ['**Performance-Based Forwarding**', 'El camino se elige según retardo, pérdida y *jitter* medidos', 'Se reacciona a la degradación, no solo a la caída'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Una SD-WAN tiene dos subyacentes en una sede: MPLS e Internet. El MPLS sigue arriba, pero empieza a perder paquetes y a variar mucho el retardo. ¿Qué permite hacer la SD-WAN que no permitía el diseño clásico de respaldo?',
        choices: [
          'Nada distinto: mientras el MPLS no caiga del todo, todo el tráfico sigue por él',
          'Desviar las aplicaciones sensibles, como la voz, al otro camino según la política y las medidas de pérdida, retardo y variación del retardo, aunque el MPLS no haya caído',
          'Pedir al operador MPLS que reserve más ancho de banda de forma automática',
          'Cambiar la dirección IP de los equipos de la sede para que usen Internet',
        ],
        answer: 1,
        explain:
          'MEF 70.2 dice que los caminos se eligen dinámicamente según la política y fija las métricas de retardo, variación del retardo y pérdida; la RFC 10090 lo llama Performance-Based Forwarding. Eso permite reaccionar a la degradación y no solo a la caída, que era lo único que hacía el respaldo clásico. Los umbrales que disparan el cambio no los fija la norma: son de la política de cada organización y de cada fabricante.',
      },
    },
    { t: 'h', text: 'Aprovisionamiento sin intervención (ZTP)' },
    {
      t: 'p',
      md: 'Una red con muchas sedes pequeñas tiene un problema práctico: alguien tiene que configurar el equipo de cada una. La RFC 10090 define el **aprovisionamiento sin intervención** (*Zero Touch Provisioning*, **ZTP**) como aprovisionar y configurar equipos remotos **sin intervención manual**. La idea: el equipo llega a la oficina, alguien lo enchufa a sus accesos y el equipo obtiene su configuración del lado central, sin que un técnico de redes tenga que desplazarse. Cómo se hace en concreto (cómo se identifica el equipo, de dónde saca la primera dirección, cómo confía en el controlador) depende de cada fabricante, y las fuentes de esta lección no lo detallan. Lo que sí importa desde el punto de vista de la seguridad es que el canal entre el Edge y el controlador, que es por donde llega esa configuración, la RFC 10090 lo exige **seguro**.',
    },
    { t: 'h', text: 'Seguridad de la superposición' },
    {
      t: 'p',
      md: 'Si la SD-WAN usa Internet como subyacente, los túneles entre Edges cruzan una red que no controla nadie de la organización, así que hay que **cifrarlos**. MEF 70.2 recoge que el cifrado entre Edges es posible y que `ENCRYPTION` es uno de los criterios de política obligatorios: el servicio debe dejar decidir qué flujos van cifrados. La RFC 10090 define además la **SD-WAN cifrada homogénea** (*Homogeneous Encrypted SD-WAN*): **todo** el tráfico va en **IPsec**, también el que circula por el MPLS. Tiene sentido: así la seguridad no depende de cuál de los caminos se haya elegido en cada momento. La RFC señala un detalle técnico que enlaza con la lección de IPsec: para llevar dentro de un túnel IPsec el identificador de cada segmento hace falta **otra encapsulación dentro de ESP**, como **GRE** (RFC 2784) o **VXLAN** (*Virtual eXtensible Local Area Network*, RFC 7348). La **segmentación** de una SD-WAN, cada segmento una «VPN SD-WAN», se apoya en los PE en **VRF** (tablas de enrutamiento y reenvío separadas) y en el **Route Target**, que distingue las rutas de cada VPN SD-WAN: las mismas piezas que la RFC 4364 usa en las VPN MPLS.',
    },
    {
      t: 'check',
      q: {
        q: 'En una SD-WAN cifrada homogénea, según la RFC 10090, ¿qué tráfico va en IPsec?',
        choices: [
          'Solo el que sale por los accesos a Internet; el del MPLS va en claro porque es una red privada',
          'Solo la voz, porque es el tráfico más sensible',
          'Solo el canal de control entre el controlador y los Edges',
          'Todo el tráfico, también el que va por el MPLS',
        ],
        answer: 3,
        explain:
          'La RFC 10090 define la Homogeneous Encrypted SD-WAN como aquella en la que todo el tráfico va en IPsec, también sobre MPLS. Cifrar solo lo que va por Internet es una opción que permite la política de MEF 70.2 (criterio ENCRYPTION), pero no es la cifrada homogénea. El canal controlador-Edge tiene que ser seguro siempre, se cifre o no el tráfico de datos.',
      },
    },
    { t: 'h', text: 'SASE y SSE: términos de analista y de fabricante' },
    {
      t: 'p',
      md: 'Junto a SD-WAN aparecen dos siglas que conviene manejar con cuidado. **SASE** (*Secure Access Service Edge*) es un concepto que Mplify atribuye a una firma de analistas, Gartner: la norma de servicio **Mplify 117.1** (junio de 2025, revisión de MEF 117) dice expresamente que amplía «the Gartner SASE concept». Para Mplify 117.1, SASE es un servicio que da **acceso seguro, funciones de seguridad y conectividad segura** entre usuarios, dispositivos o aplicaciones y los recursos, **independiente de dónde estén** y según las políticas del cliente. Describe funciones de seguridad «atómicas» y trata los paquetes habituales, como el **SWG** (*Secure Web Gateway*, pasarela web segura), el WAF o el cortafuegos, como combinaciones de ellas; define entre otras el **CASB** (*Cloud Access Security Broker*, intermediario de seguridad para el acceso a la nube) y el **RBI** (*Remote Browser Isolation*, aislamiento remoto del navegador), y dedica un apartado a cuando el servicio SASE usa SD-WAN. Con **ZTNA** (*Zero Trust Network Access*) hay dos definiciones que no coinciden: la de Gartner, que Mplify cita, lo describe como productos que crean un perímetro lógico por identidad y contexto alrededor de un usuario y unas aplicaciones internas, y Mplify advierte de que con ella ZTNA ha pasado a ser sinónimo de **sustituto de la VPN de acceso remoto**; Mplify lo amplía a todo acceso, en cualquier lugar, también dentro de la red. La NIST SP 800-207, la referencia de confianza cero, ni siquiera usa la palabra. **SSE** (*Security Service Edge*) circula como término de analistas y fabricantes, pero **ninguna de las fuentes de esta lección lo define** (Mplify solo lo usa como nombre de una certificación): no lo trates como término normativo.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Supuesto: si el Consorcio de Arcedo sustituyera su WAN por una SD-WAN',
      md: '**El Consorcio no tiene SD-WAN.** Hoy cada oficina comarcal tiene su encaminador propio con dos salidas: el acceso MPLS del operador, que lleva todo el tráfico, y un acceso a Internet de otro proveedor, con las direcciones públicas `198.51.100.31`, `198.51.100.32` y `198.51.100.33` (una por oficina), que **solo** se usa para el túnel IPsec de respaldo hacia la sede, terminado en el encaminador central en `203.0.113.10`. Imagina que el Consorcio sustituyera esos encaminadores por Edges SD-WAN. Los dos accesos de cada oficina pasarían a ser dos **UCS**: el MPLS, uno **Private**; Internet, uno **Public**. Entre el Edge de cada oficina, por ejemplo la de `10.20.8.0/24` o la de `10.20.9.0/24`, y el de la sede habría TVC por los dos caminos, y la política diría, por ejemplo, que la voz va por el camino con mejor retardo y variación del retardo medidos, que las copias de seguridad aprovechan Internet y que todo va cifrado. La línea de Internet dejaría de estar parada. A cambio, el Consorcio tendría que decidir varias cosas que hoy no se plantea: dónde vive el controlador y quién lo administra; si permite la **salida directa a Internet** desde las oficinas, que es una decisión de seguridad y no solo de rendimiento, porque hoy esa salida no existe; y si cifra también lo que va por el MPLS. Nada de esto forma parte del diseño actual.',
    },
    {
      t: 'table',
      headers: ['Criterio (supuesto para una organización como el Consorcio)', 'MPLS con respaldo IPsec (hoy)', 'SD-WAN sobre Internet', 'Híbrido: SD-WAN sobre MPLS e Internet'],
      rows: [
        ['Uso de la línea de respaldo', 'Parada salvo avería', 'No hay MPLS: todo va por Internet', 'Las dos se usan a la vez'],
        ['Reacción a un camino degradado', 'Ninguna hasta que cae', 'Cambia entre accesos a Internet si hay más de uno', 'Desvía por aplicación según las medidas'],
        ['Calidad para la voz', 'Clase de servicio del operador en el MPLS', 'Depende de Internet; solo se mide y se esquiva', 'MPLS para la voz, Internet como alternativa medida'],
        ['Cifrado', 'IPsec solo en el túnel de respaldo', 'Imprescindible en todos los túneles', 'Según la política; o todo, si es cifrada homogénea'],
        ['Piezas nuevas que administrar', 'Ninguna', 'Edges, controlador y su canal seguro', 'Edges, controlador y su canal seguro'],
        ['Salida a Internet en las oficinas', 'No existe', 'Posible; decisión de seguridad', 'Posible; decisión de seguridad'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Según el canon del curso, ¿qué hace hoy la línea de Internet de cada oficina comarcal del Consorcio?',
        choices: [
          'Solo lleva el túnel IPsec de respaldo hacia la sede, y únicamente si cae el acceso MPLS',
          'Es un subyacente público de la SD-WAN del Consorcio, que reparte el tráfico con el MPLS',
          'Da salida directa a Internet a los puestos de la oficina',
          'Lleva la voz, porque el MPLS se reserva para los datos',
        ],
        answer: 0,
        explain:
          'El Consorcio no tiene SD-WAN: su WAN principal es la VPN de capa 3 sobre MPLS, y la línea de Internet de cada oficina, con su dirección pública propia, solo sirve para el túnel IPsec de respaldo hacia el encaminador central, cuando cae el principal. La salida directa a Internet desde las oficinas y el reparto de tráfico entre caminos solo existirían en el supuesto de que se montara una SD-WAN.',
      },
    },
    {
      t: 'links',
      title: 'Lo que se explica en otras lecciones',
      items: [
        { label: 'Arquitecturas WAN y WLAN: líneas dedicadas, VPN MPLS y respaldo por Internet (lección op1m5)', href: '/learn/op1m5' },
        { label: 'VPN IPsec: arquitectura, IKEv2 y túneles (lección op2m2)', href: '/learn/op2m2' },
        { label: 'Conectividad entre centros: la VPN de capa 3 sobre MPLS en detalle, VRF, RD y RT (lección op2m5)', href: '/learn/op2m5' },
        { label: 'Security+: firewalls, port security y comunicación segura (VPN, TLS/IPsec, SD-WAN y SASE) (lección sp3m5)', href: '/learn/sp3m5' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**MEF es hoy Mplify:** MEF 70.2 (oct. 2023) para SD-WAN; Mplify 117.1 (jun. 2025) para SASE. **Overlay frente a underlay:** la SD-WAN es superpuesta sobre uno o varios **UCS** (Public = Internet; Private = lo demás); la VPN MPLS de la RFC 4364 **no** es un overlay, según la propia RFC. **Quién define qué:** Edge, MEF 70.2; **controlador** y **ZTP**, RFC 10090 (informativa, nov. 2026); **orquestador**, nadie en las fuentes leídas (MEF 70.2 solo lo nombra). **Política:** criterios obligatorios `ENCRYPTION`, `INTERNET-BREAKOUT`, `PUBLIC-PRIVATE`. **Métricas de MEF 70.2:** retardo medio, variación del retardo (*jitter*) y pérdida, todas en un sentido. **Umbrales:** de cada organización y fabricante, nunca de la norma. **Cifrada homogénea:** todo en IPsec, también sobre MPLS; para llevar el segmento dentro de ESP hace falta GRE o VXLAN; segmentación con VRF y Route Target. **SASE:** según Mplify 117.1, concepto de Gartner que esa norma amplía; **ZTNA**, dos definiciones (Gartner, sustituto de la VPN; Mplify, todo acceso); **SSE**, sin definición en las fuentes. **El Consorcio no tiene SD-WAN:** MPLS de capa 3 más respaldo IPsec por Internet en cada oficina.',
    },
  ],
  quiz: [
    {
      id: 'op2m4q1',
      domain: 'Infraestructuras de comunicaciones',
      prompt: 'Una organización une sus sedes con una VPN MPLS y tiene en cada sede una línea de Internet que solo lleva un túnel IPsec cuando cae el MPLS. ¿Qué problema de ese diseño ataca directamente una SD-WAN?',
      choices: [
        'Que el MPLS no permite direcciones privadas en las sedes',
        'Que la línea de respaldo está parada casi siempre y que, mientras el MPLS esté vivo, todo va por él aunque esté degradado',
        'Que IPsec no puede atravesar los accesos a Internet',
        'Que la VPN MPLS obliga a cada sede a tener un sistema autónomo propio',
      ],
      answer: 1,
      explain:
        'La SD-WAN usa a la vez varios subyacentes, privados o públicos (Transport Augmentation en la RFC 10090), y elige el camino de cada aplicación según la política y el rendimiento medido. Eso resuelve justo las dos pegas del respaldo clásico: la línea ociosa y la decisión de todo o nada. Las VPN MPLS admiten direcciones privadas, IPsec cruza Internet sin problema y nada obliga a un AS por sede.',
    },
    {
      id: 'op2m4q2',
      domain: 'Infraestructuras de comunicaciones',
      prompt: 'En la terminología de MEF 70.2, ¿qué es un UCS de tipo Public?',
      choices: [
        'Un servicio subyacente que es un acceso a Internet',
        'Una VPN IP privada de un operador',
        'La interfaz por la que el cliente entra en el servicio SD-WAN',
        'El túnel punto a punto entre dos Edges',
      ],
      answer: 0,
      explain:
        'MEF 70.2 llama UCS (Underlay Connectivity Service) a cada servicio subyacente sobre el que se presta la SD-WAN, y distingue el Public, que es un acceso a Internet, del Private, que es cualquier otro, como una VPN IP privada o Carrier Ethernet. El túnel punto a punto entre dos Edges es la TVC, y la interfaz con el cliente es la del lado del cliente del Edge.',
    },
    {
      id: 'op2m4q3',
      domain: 'Infraestructuras de comunicaciones',
      prompt: '¿Por qué la RFC 4364 dice que una VPN de capa 3 sobre MPLS no es un overlay sobre la red del proveedor?',
      choices: [
        'Porque no usa etiquetas MPLS en la troncal',
        'Porque cifra todo el tráfico entre sedes',
        'Porque cada CE es par de enrutamiento del PE del operador y no de los CE de las otras sedes, así que el cliente no gestiona una troncal virtual propia',
        'Porque solo admite una sede por cliente',
      ],
      answer: 2,
      explain:
        'La RFC 4364 lo explica en su introducción: el CE intercambia rutas con el PE, no con los CE remotos, y el cliente no tiene que gestionar una troncal virtual. En una SD-WAN, en cambio, los Edges montan túneles entre sí y forman una superposición propia, gestionada por el proveedor del servicio o por la organización. La VPN MPLS sí usa etiquetas, no cifra por sí misma y une muchas sedes.',
    },
    {
      id: 'op2m4q4',
      domain: 'Infraestructuras de comunicaciones',
      prompt: '¿Qué fuente define el controlador de una SD-WAN como el sistema lógico que gestiona la superposición?',
      choices: [
        'MEF 70.2, en su tabla de términos',
        'Mplify 117.1, la norma de servicio SASE',
        'La RFC 4364, al describir los PE',
        'La RFC 10090, en su apartado de terminología',
      ],
      answer: 3,
      explain:
        'La RFC 10090 define el controlador como el sistema lógico que gestiona la superposición, que puede incluir un Route Reflector, y define también el ZTP. MEF 70.2 nombra controladores y orquestadores como parte de la red del proveedor, pero no los define. Mplify 117.1 trata de SASE y la RFC 4364 no habla de SD-WAN.',
    },
    {
      id: 'op2m4q5',
      domain: 'Infraestructuras de comunicaciones',
      prompt: '¿Cuáles son las tres métricas de rendimiento que fija MEF 70.2 para un servicio SD-WAN?',
      choices: [
        'Ancho de banda contratado, número de saltos y tiempo de convergencia de BGP',
        'Retardo medio en un sentido, variación media del retardo en un sentido y proporción de paquetes perdidos en un sentido',
        'Tiempo de ida y vuelta, tamaño máximo de paquete y número de túneles activos',
        'Disponibilidad mensual, tiempo de reparación y tiempo de aprovisionamiento',
      ],
      answer: 1,
      explain:
        'MEF 70.2 fija One-Way Mean Packet Delay, One-Way Mean Packet Delay Variation (lo que se suele llamar jitter) y One-Way Packet Loss Ratio, las tres en un sentido. Son las mismas magnitudes que la RFC 10090 cita para el Performance-Based Forwarding. Los umbrales con los que se cambia de camino no los fija la norma.',
    },
    {
      id: 'op2m4q6',
      domain: 'Infraestructuras de comunicaciones',
      prompt: 'Un fabricante anuncia que su SD-WAN cambia la voz de camino cuando la pérdida supera cierto porcentaje. ¿De dónde sale ese porcentaje?',
      choices: [
        'De MEF 70.2, que fija los umbrales de cada métrica',
        'De la RFC 10090, que fija los umbrales para BGP',
        'De la política de la organización y de los valores del fabricante: ni MEF 70.2 ni la RFC 10090 fijan umbrales',
        'De la RFC 4364, que define la clase de servicio de la voz',
      ],
      answer: 2,
      explain:
        'MEF 70.2 define las métricas y que los caminos se eligen según la política, y la RFC 10090 describe el reenvío según el rendimiento, pero ninguna fija a partir de qué pérdida o qué retardo se cambia de camino. Ese valor es del fabricante o de quien escribe la política, y hay que presentarlo como tal.',
    },
    {
      id: 'op2m4q7',
      domain: 'Infraestructuras de comunicaciones',
      prompt: 'En una SD-WAN con varios segmentos sobre túneles IPsec, ¿qué señala la RFC 10090 sobre cómo llevar el identificador de cada segmento?',
      choices: [
        'Que hace falta otra encapsulación dentro de ESP, como GRE o VXLAN',
        'Que va en el campo SPI de ESP, que identifica el segmento',
        'Que no hace falta: IPsec separa los segmentos por sí solo',
        'Que obliga a usar AH en lugar de ESP',
      ],
      answer: 0,
      explain:
        'La RFC 10090 indica que, para llevar el identificador de la VPN SD-WAN dentro de un túnel IPsec, hace falta otra encapsulación, como GRE (RFC 2784) o VXLAN (RFC 7348), dentro de ESP. La segmentación en sí se apoya en VRF y en el Route Target, como en la RFC 4364. Nada en la RFC propone usar AH ni reutilizar el SPI.',
    },
    {
      id: 'op2m4q8',
      domain: 'Infraestructuras de comunicaciones',
      prompt: '¿Qué afirmación sobre SASE, ZTNA y SSE se ajusta a las fuentes de esta lección?',
      choices: [
        'Los tres están definidos por la NIST SP 800-207',
        'SSE es la norma de Mplify que sustituye a MEF 70.2',
        'ZTNA tiene una única definición, la de Mplify, idéntica a la de Gartner',
        'Según Mplify 117.1, SASE es un concepto de Gartner que esa norma amplía; ZTNA tiene dos definiciones distintas y SSE no está definido en las fuentes leídas',
      ],
      answer: 3,
      explain:
        'Mplify 117.1 dice que amplía el concepto SASE de Gartner. Para ZTNA, cita la definición de Gartner, como sustituto de la VPN de acceso remoto, y propone la suya, más amplia, para todo acceso en cualquier lugar. La SP 800-207 no usa la palabra ZTNA, y SSE no aparece definido ni en Mplify 117.1 ni en ninguna otra fuente leída.',
    },
  ],
};
