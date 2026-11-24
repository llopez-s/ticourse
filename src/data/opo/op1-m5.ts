import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP1M5 — Arquitecturas WAN y WLAN (bloque 1, Redes de comunicaciones)
// ---------------------------------------------------------------------------
export const OP1_M5: Module = {
  id: 'op1m5',
  sectionId: 'op1',
  title: 'Arquitecturas WAN y WLAN',
  minutes: 17,
  objectives: [
    'Comparar las formas de unir sedes —línea dedicada, MPLS, Internet con VPN, fibra oscura con DWDM— y elegir la adecuada para un caso',
    'Explicar cómo conmuta MPLS por etiquetas, qué campos tiene la etiqueta y cómo se construye una VPN de capa 3',
    'Relacionar cada enmienda de IEEE 802.11 con su banda y su nombre comercial Wi-Fi, y planificar canales en 2,4 GHz',
    'Distinguir CSMA/CA de CSMA/CD y los conceptos SSID, BSSID, BSS y ESS',
    'Diferenciar puntos de acceso autónomos y gestionados por controlador (CAPWAP), diagnosticar problemas de itinerancia y dimensionar PoE',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Hasta aquí la red vivía dentro de un edificio: conmutadores (switches), VLAN y encaminamiento propio. Esta lección la saca por los dos extremos. Por arriba, la **WAN** (*Wide Area Network*), que une sedes separadas por kilómetros usando la infraestructura de un operador: ya no decides tú el cable, sino qué servicio contratas y con qué garantías. Por abajo, la **WLAN** (*Wireless Local Area Network*), donde el medio deja de ser un par de cobre exclusivo y pasa a ser el aire, compartido por todos. En las dos, un examen de oposición pide lo mismo: datos exactos del estándar y criterio para elegir.',
    },
    { t: 'h', text: 'WAN: cuatro maneras de unir sedes' },
    {
      t: 'p',
      md: 'Una **línea dedicada** (o circuito punto a punto) es capacidad reservada entre dos puntos, solo para ti: caudal simétrico y garantizado, con un **acuerdo de nivel de servicio (SLA)**. La jerarquía clásica en Europa parte del **E1**, de **2,048 Mbit/s** (32 intervalos de 64 kbit/s); hoy el circuito dedicado suele entregarse como un enlace Ethernet sobre fibra. Su inconveniente es el precio y que cada pareja de sedes necesita su propio circuito. En el otro extremo está el **acceso a Internet con VPN**: cada sede contrata una conexión corriente y se levantan túneles cifrados entre ellas, normalmente con **IPsec**. Es barato y rápido de desplegar, pero Internet es una red de *mejor esfuerzo*: nadie garantiza retardo ni pérdidas de extremo a extremo. Entre ambos se sitúa **MPLS**, el servicio con el que los operadores han construido durante años las redes corporativas.',
    },
    {
      t: 'table',
      headers: ['Opción', 'Qué contratas', 'Garantías', 'Cuándo encaja'],
      rows: [
        [
          '**Línea dedicada**',
          'Un circuito punto a punto con capacidad reservada',
          'Caudal garantizado y simétrico, con SLA',
          'Pocas sedes y un enlace crítico entre dos puntos',
        ],
        [
          '**MPLS** (VPN de capa 3)',
          'Una red privada virtual dentro de la red del operador',
          'SLA y clases de **calidad de servicio (QoS)** de extremo a extremo',
          'Muchas sedes que hablan todas con todas; voz y vídeo',
        ],
        [
          '**Internet con VPN**',
          'Acceso a Internet en cada sede y túneles **IPsec** entre ellas',
          'Mejor esfuerzo: sin garantía de retardo ni de pérdidas',
          'Sedes pequeñas, enlace de respaldo, presupuesto ajustado',
        ],
        [
          '**Fibra oscura** (con **DWDM**)',
          'La fibra sin equipos: la iluminas tú',
          'La capacidad la decides tú; la disponibilidad depende del trazado',
          'Unir dos centros de datos cercanos con mucho caudal y poca latencia',
        ],
      ],
    },
    {
      t: 'p',
      md: '**MPLS** (*Multiprotocol Label Switching*, **RFC 3031**) cambia la pregunta que se hace cada encaminador (router). En IP clásico, cada salto busca la dirección de destino en su tabla de rutas. En MPLS, el encaminador de entrada clasifica el paquete una sola vez, le antepone una **etiqueta** corta y, a partir de ahí, los encaminadores del núcleo solo miran esa etiqueta: la buscan en una tabla, la **cambian por otra** y reenvían. El camino resultante se llama **LSP** (*Label Switched Path*). El equipo de borde que pone o quita etiquetas es un **LER** (*Label Edge Router*) y el interior que solo las intercambia, un **LSR** (*Label Switching Router*). Las tres operaciones se llaman **push** (añadir), **swap** (intercambiar) y **pop** (retirar). La etiqueta ocupa **32 bits** y se inserta entre la cabecera de enlace y la de IP, por eso se dice que MPLS trabaja en la «capa 2,5»: **20 bits** de valor de etiqueta, **3 bits** de clase de tráfico (**TC**, antes llamado EXP), **1 bit S** que marca el fondo de la pila y **8 bits** de TTL. Las etiquetas pueden apilarse, y eso es lo que permite la **VPN de capa 3** (**RFC 4364**): el encaminador del operador en el borde (**PE**) mantiene una tabla de rutas separada por cliente (**VRF**), intercambia las rutas de cada cliente con los demás PE mediante **BGP** y usa dos etiquetas, una exterior para llegar al PE de destino y otra interior que identifica la VPN. El equipo del cliente (**CE**) no sabe nada de etiquetas: entrega y recibe paquetes IP normales. La QoS se apoya en el campo TC: el operador traduce a esos 3 bits la marca **DSCP** del paquete IP y da prioridad en cada salto.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Etiqueta MPLS y recorrido de un paquete por una VPN de capa 3',
      text: `Etiqueta MPLS (32 bits, entre la cabecera de enlace y la cabecera IP)

  +----------------------+------+---+----------+
  |  Etiqueta (20 bits)  |  TC  | S |   TTL    |
  |                      | (3)  |(1)| (8 bits) |
  +----------------------+------+---+----------+
  Valores 0-15 reservados.  S = 1 en la última etiqueta de la pila.

Oficina comarcal (10.20.8.0/24)  --->  Sede central (10.20.10.0/24)

  CE-oficina     PE1 (LER)        P (LSR)        PE2 (LER)      CE-sede
      |             |                |               |             |
      |--- IP ----->|                |               |             |
      |             | push 2 etiquetas               |             |
      |             |-- [304][72] IP ->              |             |
      |             |                | swap 304->511 |             |
      |             |                |- [511][72] IP ->            |
      |             |                |               | pop: la 72  |
      |             |                |               | indica VRF  |
      |             |                |               |--- IP ----->|

  [exterior][interior]: la exterior lleva el paquete hasta PE2 y cambia
  en cada salto; la interior (72) no cambia y dice a PE2 de qué cliente es.
  El núcleo (P) nunca consulta la dirección IP de destino del cliente.`,
    },
    {
      t: 'check',
      q: {
        q: 'Un paquete del Consorcio atraviesa el núcleo de la red MPLS del operador. ¿En qué se basa un encaminador interior (LSR) para decidir por dónde lo reenvía?',
        choices: [
          'En la dirección IP de destino, buscada en la tabla de rutas del cliente',
          'En la etiqueta exterior, que busca en su tabla y sustituye por otra',
          'En la dirección MAC de destino de la trama',
          'En el número de sistema autónomo del cliente',
        ],
        answer: 1,
        explain:
          'El LSR solo mira la etiqueta exterior: la busca, la intercambia (swap) y reenvía. La dirección IP de destino solo se consulta en el borde (LER), al clasificar el paquete; por eso el núcleo no necesita conocer las rutas de los clientes.',
      },
    },
    {
      t: 'p',
      md: 'Cuando lo que hay que unir son dos centros de datos, las cuentas cambian. La **fibra oscura** es fibra óptica alquilada sin equipos del operador: tú pones la electrónica en los dos extremos y decides la capacidad. Para aprovecharla se usa **DWDM** (*Dense Wavelength Division Multiplexing*): varias señales viajan a la vez por la misma fibra, cada una en una **longitud de onda** distinta, como canales independientes. La rejilla de frecuencias de DWDM está en la recomendación **UIT-T G.694.1**; su hermana menos densa, **CWDM**, en la **G.694.2**, con canales separados 20 nm. Por último, **SD-WAN** (*Software-Defined WAN*) no es un transporte más, sino una capa de control por encima de los anteriores: un controlador central decide, aplicación por aplicación, si el tráfico sale por MPLS, por Internet o por la red móvil, según el estado de cada enlace. Aquí solo la presentamos; se desarrolla en el bloque de infraestructuras.',
    },
    {
      t: 'links',
      title: 'Para ampliar sin repetir',
      items: [{ label: 'SD-WAN, VPN e IPsec en Security+ (sp3m5)', href: '/learn/sp3m5' }],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'El Consorcio Provincial de Arcedo elige su WAN',
      md: 'El Consorcio tiene la sede central, con su CPD, y tres oficinas comarcales. Las cuatro comparten la telefonía IP y las aplicaciones de gestión, así que necesitan hablar **todas con todas** y dar **prioridad a la voz**. Con líneas dedicadas harían falta seis circuitos para una malla completa (4 × 3 / 2); con Internet y VPN nadie garantizaría el retardo de las llamadas. La opción que encaja es una **VPN de capa 3 sobre MPLS**: un acceso por sede, encaminamiento entre todas resuelto por el operador y una clase de servicio para la voz. Como respaldo, cada oficina mantiene un acceso a Internet barato con un túnel IPsec hacia la sede, que solo se usa si cae el acceso principal. Y si el Consorcio montara un CPD de respaldo en la misma ciudad, la réplica entre los dos centros iría por **fibra oscura** con DWDM, no por la VPN de las oficinas.',
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio quiere replicar de forma síncrona el almacenamiento entre su CPD y un segundo centro situado a pocos kilómetros. Necesita mucho caudal, latencia mínima y poder ampliar capacidad sin contratar nuevos circuitos. ¿Qué opción encaja mejor?',
        choices: [
          'Un túnel IPsec sobre los accesos a Internet de ambos centros',
          'Una VPN de capa 3 MPLS compartida con las oficinas comarcales',
          'Un circuito E1 dedicado entre los dos centros',
          'Fibra oscura entre los dos centros, iluminada con DWDM',
        ],
        answer: 3,
        explain:
          'Con fibra oscura y DWDM la capacidad se amplía añadiendo longitudes de onda sobre la misma fibra, y la latencia es la del propio trazado. Internet no garantiza retardo, un E1 se queda en 2,048 Mbit/s y la VPN de las oficinas está dimensionada para tráfico de usuario, no para réplica de almacenamiento.',
      },
    },
    { t: 'h', text: 'WLAN: enmiendas 802.11, bandas y canales' },
    {
      t: 'table',
      headers: ['Enmienda IEEE', 'Nombre comercial', 'Banda', 'Novedad principal'],
      rows: [
        ['**802.11b**', 'Sin nombre oficial', '2,4 GHz', 'DSSS; canales de 22 MHz'],
        ['**802.11a**', 'Sin nombre oficial', '5 GHz', 'OFDM; canales de 20 MHz'],
        ['**802.11g**', 'Sin nombre oficial', '2,4 GHz', 'OFDM en 2,4 GHz, compatible con 802.11b'],
        ['**802.11n**', '**Wi-Fi 4**', '2,4 y 5 GHz', 'MIMO; canales de hasta 40 MHz'],
        ['**802.11ac**', '**Wi-Fi 5**', 'Solo 5 GHz', 'Canales de hasta 160 MHz; MU-MIMO en sentido descendente'],
        ['**802.11ax**', '**Wi-Fi 6**', '2,4 y 5 GHz', 'OFDMA; MU-MIMO también ascendente'],
        ['**802.11ax** en 6 GHz', '**Wi-Fi 6E**', '6 GHz', 'La misma enmienda, extendida a la banda de 6 GHz'],
        ['**802.11be**', '**Wi-Fi 7**', '2,4, 5 y 6 GHz', 'Canales de hasta 320 MHz; operación multienlace (MLO)'],
      ],
    },
    {
      t: 'p',
      md: 'Los nombres «Wi-Fi 4» a «Wi-Fi 7» son de la Wi-Fi Alliance; el estándar es siempre **IEEE 802.11** y sus enmiendas. Dos detalles se preguntan mucho: **802.11ac solo trabaja en 5 GHz** y **Wi-Fi 6E no es una enmienda nueva**, sino 802.11ax en 6 GHz. En **2,4 GHz** los canales están numerados cada **5 MHz** (el canal 1 se centra en 2412 MHz, el 6 en 2437 y el 11 en 2462; en Europa se usan del 1 al 13), pero cada transmisión ocupa unos 20–22 MHz. Dos canales contiguos se pisan: hacen falta **cinco números de separación** para que no se solapen, y de ahí sale el plan clásico **1-6-11**, con solo tres canales independientes. Un punto de acceso en el canal 3 no «aprovecha un hueco»: interfiere a la vez con el 1 y con el 6, y además esa interferencia de canal adyacente es peor que compartir el mismo canal, porque las estaciones no se entienden entre sí y no pueden turnarse. La banda de **5 GHz** ofrece muchos más canales de 20 MHz sin solapamiento, aunque en parte de ella es obligatorio **DFS** (*Dynamic Frequency Selection*): el punto de acceso debe abandonar el canal si detecta un radar. A cambio, a mayor frecuencia, menor alcance y peor paso por paredes. Y hay una diferencia de fondo con el cable: el aire es un medio compartido y **semidúplex**: una radio no puede escuchar mientras transmite, así que no puede detectar una colisión como hacía el Ethernet clásico con **CSMA/CD** (*Collision Detection*). Por eso 802.11 usa **CSMA/CA** (*Collision Avoidance*): la estación escucha el canal; si está libre durante un intervalo fijo, espera además un **tiempo aleatorio de contienda** (*backoff*) y entonces transmite. Como tampoco puede saber si la trama llegó bien, el receptor responde con un **ACK** a cada trama unidifusión; si el ACK no llega, se retransmite. Queda el problema del **nodo oculto**: dos estaciones que alcanzan al punto de acceso pero no se oyen entre sí. Para ese caso existe el mecanismo opcional **RTS/CTS**: la estación pide permiso con una trama corta y la respuesta del punto de acceso, que todos oyen, reserva el medio.',
    },
    {
      t: 'check',
      q: {
        q: 'En una planta hay tres puntos de acceso de 2,4 GHz configurados en los canales 1, 4 y 8, y la red va mal. ¿Qué plan de canales corrige el problema?',
        choices: [
          'Canales 1, 6 y 11',
          'Canales 1, 2 y 3, para concentrar la interferencia',
          'Canales 2, 4 y 6',
          'Los tres en el canal 13, el más alto disponible en Europa',
        ],
        answer: 0,
        explain:
          'En 2,4 GHz los canales están separados 5 MHz y cada uno ocupa unos 20–22 MHz, así que solo 1, 6 y 11 no se solapan entre sí. Los canales 1, 4 y 8 se pisan parcialmente, que es el peor caso: interferencia de canal adyacente que CSMA/CA no puede arbitrar.',
      },
    },
    { t: 'h', text: 'Arquitectura de la WLAN: controlador, itinerancia y PoE' },
    {
      t: 'p',
      md: 'Cuatro nombres ordenan una WLAN. El **SSID** (*Service Set Identifier*) es el nombre de la red, de hasta **32 octetos**. Un **BSS** (*Basic Service Set*) es un punto de acceso (**AP**) con las estaciones asociadas a él, y se identifica por su **BSSID**, que tiene formato de dirección MAC de 48 bits: la de la radio del AP. Cuando varios BSS comparten el mismo SSID y están unidos por la red cableada (el *sistema de distribución*), forman un **ESS** (*Extended Service Set*): para la usuaria es una sola red, aunque por debajo cambie de BSSID al moverse. En cuanto a la gestión, un **AP autónomo** guarda su propia configuración y toma solo sus decisiones; funciona, pero con cincuenta AP hay cincuenta configuraciones que mantener. En la arquitectura **gestionada por controlador**, los AP (ligeros) se registran en un controlador central que les envía la configuración, reparte canales y potencias y aplica las políticas. El protocolo estándar entre ambos es **CAPWAP** (*Control And Provisioning of Wireless Access Points*, **RFC 5415**): viaja sobre **UDP**, con el **puerto 5246 para control** y el **5247 para datos**, y protege el canal de control con **DTLS**. Define dos repartos de trabajo: en **Split MAC** el AP hace lo que exige tiempo real (balizas, ACK) y envía las tramas 802.11 por el túnel al controlador; en **Local MAC** el AP procesa toda la capa MAC y puede entregar el tráfico directamente en su conmutador.',
    },
    {
      t: 'p',
      md: 'La **itinerancia** (*roaming*) es el cambio de un AP a otro dentro del mismo ESS sin perder la conexión. Dato clave: **la decisión la toma el cliente**, no la red. De ahí el síntoma clásico del **cliente pegajoso**, que sigue asociado a un AP lejano con mala señal aunque tenga otro al lado. Tres enmiendas ayudan: **802.11k** permite al AP informar de sus vecinos para que el cliente no tenga que explorar todos los canales, **802.11v** permite a la red sugerirle un AP mejor y **802.11r** (*Fast BSS Transition*) acorta la reautenticación al cambiar. Para que haya itinerancia hacen falta además el mismo SSID y la misma configuración de seguridad en todos los AP, celdas que se solapen lo suficiente y que el cliente conserve su dirección IP. Queda la alimentación: los AP suelen recibirla por el propio cable de datos con **PoE** (*Power over Ethernet*). El conmutador es el **PSE** (el que suministra) y el AP el **PD** (el que consume); la potencia que llega al PD es menor que la que sale del PSE por la pérdida en el cable, que puede medir hasta 100 m.',
    },
    {
      t: 'table',
      headers: ['Estándar', 'Nombre habitual', 'Potencia en el PSE', 'Potencia garantizada en el PD', 'Pares usados'],
      rows: [
        ['**IEEE 802.3af**', 'PoE (tipo 1)', '15,4 W', '12,95 W', '2'],
        ['**IEEE 802.3at**', 'PoE+ (tipo 2)', '30 W', '25,5 W', '2'],
        ['**IEEE 802.3bt** tipo 3', 'PoE++', '60 W', '51 W', '4 (para 60 W)'],
        ['**IEEE 802.3bt** tipo 4', 'PoE++', '90 W', '71,3 W', '4'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'En una WLAN gestionada por controlador con CAPWAP, ¿qué afirmación es correcta?',
        choices: [
          'Cada AP guarda y decide su configuración; el controlador solo recoge estadísticas',
          'CAPWAP viaja sobre TCP y usa el puerto 179',
          'El AP y el controlador hablan por UDP: puerto 5246 para control, protegido con DTLS, y 5247 para datos',
          'CAPWAP sustituye a 802.11 en el enlace de radio entre el AP y las estaciones',
        ],
        answer: 2,
        explain:
          'La RFC 5415 define CAPWAP sobre UDP, con el puerto 5246 para control (protegido con DTLS) y el 5247 para datos. La opción en la que cada AP decide su configuración describe un AP autónomo; CAPWAP solo actúa entre AP y controlador, por la red cableada, y no toca el enlace de radio.',
      },
    },
    {
      t: 'links',
      title: 'La seguridad wifi está en otra lección',
      items: [{ label: 'WPA3, 802.1X y seguridad inalámbrica en Security+ (sp4m2)', href: '/learn/sp4m2' }],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Cómo cae en un examen',
      md: '**MPLS**: RFC 3031; etiqueta de **32 bits** = 20 de etiqueta + 3 de TC + 1 bit S + 8 de TTL; LER en el borde, LSR en el núcleo; push, swap y pop. Si el enunciado dice «todas las sedes con todas, con QoS garantizada», buscan la VPN de capa 3 MPLS; si dice «barato» o «respaldo», Internet con VPN; si dice «entre dos CPD, mucha capacidad», fibra oscura con DWDM. **802.11**: la trampa habitual es la banda —**802.11ac solo 5 GHz**, 802.11b/g solo 2,4 GHz, 802.11n las dos— y los nombres: Wi-Fi 4 = n, Wi-Fi 5 = ac, Wi-Fi 6 y 6E = ax, Wi-Fi 7 = be. **Canales**: 1-6-11 en 2,4 GHz. **Acceso al medio**: CSMA/**CA** en 802.11, CSMA/**CD** en el Ethernet semidúplex; si te dan las dos opciones, mira la última letra. **CAPWAP**: RFC 5415, UDP 5246 (control) y 5247 (datos). **Itinerancia**: decide el cliente; 802.11k/v/r la ayudan. **PoE**: 802.3af 15,4 W, 802.3at 30 W, 802.3bt 60 y 90 W en el PSE; cuidado con si preguntan la potencia en el PSE o en el PD.',
    },
  ],
  quiz: [
    {
      id: 'op1m5q1',
      domain: 'Redes de comunicaciones',
      prompt: '¿Cuál es la estructura de una etiqueta MPLS?',
      choices: [
        '24 bits: 20 de etiqueta, 3 de clase de tráfico y 1 bit de fondo de pila',
        '32 bits: 12 de etiqueta, 3 de prioridad, 1 bit S y 16 de identificador de protocolo',
        '32 bits: 20 de etiqueta, 3 de clase de tráfico (TC), 1 bit S de fondo de pila y 8 de TTL',
        '48 bits: 24 de etiqueta y 24 de identificador del operador',
      ],
      answer: 2,
      explain:
        'La etiqueta MPLS mide 32 bits: 20 de valor, 3 de TC (antes EXP), 1 bit S que vale 1 en la última etiqueta de la pila y 8 de TTL. La opción de 12 + 3 + 1 + 16 bits tienta porque mezcla tamaños reales de la etiqueta 802.1Q (VID de 12 bits, 3 de prioridad), que es otra cosa: una etiqueta de VLAN en la trama Ethernet.',
    },
    {
      id: 'op1m5q2',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un organismo con una sede central y doce oficinas quiere que todas se comuniquen entre sí, con telefonía IP y un retardo garantizado por contrato, sin gestionar túneles entre cada pareja de sedes. ¿Qué servicio WAN encaja mejor?',
      choices: [
        'Una VPN de capa 3 sobre MPLS con una clase de servicio para voz',
        'Accesos a Internet con una malla completa de túneles IPsec',
        'Líneas dedicadas punto a punto entre cada pareja de sedes',
        'Fibra oscura con DWDM desde cada oficina hasta la sede',
      ],
      answer: 0,
      explain:
        'La VPN de capa 3 MPLS da conectividad de todas con todas con un solo acceso por sede, y el operador garantiza clases de servicio de extremo a extremo. La malla IPsec sobre Internet también conecta todas las sedes, pero Internet es de mejor esfuerzo y no hay retardo garantizado; con trece sedes, la malla de líneas dedicadas exigiría 78 circuitos.',
    },
    {
      id: 'op1m5q3',
      domain: 'Redes de comunicaciones',
      prompt: '¿Por qué las redes 802.11 usan CSMA/CA en lugar de CSMA/CD?',
      choices: [
        'Porque CSMA/CD está reservado por el IEEE para redes de fibra óptica',
        'Porque en 802.11 no pueden producirse colisiones',
        'Porque CSMA/CA no necesita confirmaciones y ahorra tiempo de aire',
        'Porque una radio no puede escuchar mientras transmite y, por tanto, no puede detectar la colisión',
      ],
      answer: 3,
      explain:
        'La radio es semidúplex: mientras transmite no puede oír el canal, así que detectar colisiones es imposible y solo cabe intentar evitarlas con la escucha previa y la espera aleatoria. La opción de que no necesita confirmaciones dice justo lo contrario de la realidad: como no se detectan colisiones, CSMA/CA exige un ACK por cada trama unidifusión.',
    },
    {
      id: 'op1m5q4',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un pasillo largo se cubre con cuatro puntos de acceso de 2,4 GHz colocados en fila (A, B, C, D); cada uno solo oye a sus vecinos inmediatos. ¿Qué asignación de canales es la más adecuada?',
      choices: [
        'A = 1, B = 3, C = 5, D = 7',
        'A = 1, B = 6, C = 11, D = 1',
        'A = 6, B = 6, C = 6, D = 6',
        'A = 1, B = 5, C = 9, D = 14',
      ],
      answer: 1,
      explain:
        'Solo hay tres canales sin solapamiento en 2,4 GHz (1, 6 y 11), así que el cuarto AP reutiliza el canal del más lejano: A y D comparten el 1 porque no se oyen. La serie 1-3-5-7 parece repartir mejor, pero esos canales se solapan parcialmente y generan interferencia de canal adyacente; el canal 14 no está permitido en Europa.',
    },
    {
      id: 'op1m5q5',
      domain: 'Redes de comunicaciones',
      prompt:
        'En la sede, los teléfonos wifi cortan la llamada al caminar de un ala a otra. El estudio de cobertura muestra buena señal en todo el recorrido y los AP comparten SSID y seguridad, pero cada teléfono sigue asociado al AP de origen hasta que casi pierde la señal. ¿Cuál es el diagnóstico más probable y su mejora?',
      choices: [
        'Falta potencia de PoE; hay que pasar los conmutadores a 802.3bt',
        'Los AP están en canales distintos; hay que ponerlos todos en el mismo canal',
        'El SSID es demasiado largo; hay que acortarlo por debajo de 16 octetos',
        'Itinerancia tardía decidida por el cliente; conviene activar 802.11k/v/r y revisar el solapamiento de celdas y las potencias',
      ],
      answer: 3,
      explain:
        'La cobertura es buena y el cliente no cambia de AP a tiempo: es el cliente pegajoso, porque la decisión de itinerar es suya. 802.11k y 802.11v le dan información y sugerencias, y 802.11r acorta la transición. Poner todos los AP en el mismo canal tienta porque evitaría explorar canales, pero haría que todas las celdas compitieran por el mismo medio.',
    },
    {
      id: 'op1m5q6',
      domain: 'Redes de comunicaciones',
      prompt: '¿Qué define la RFC 5415?',
      choices: [
        'CAPWAP, el protocolo entre puntos de acceso y controlador, sobre UDP 5246 (control) y 5247 (datos)',
        'La arquitectura MPLS de conmutación por etiquetas',
        'La alimentación de equipos a través del cable Ethernet',
        'El mecanismo de itinerancia rápida entre puntos de acceso',
      ],
      answer: 0,
      explain:
        'La RFC 5415 especifica CAPWAP, con canal de control en UDP 5246 protegido con DTLS y canal de datos en UDP 5247. La arquitectura MPLS es la RFC 3031; PoE y la itinerancia rápida no son RFC, sino estándares del IEEE (802.3af/at/bt y 802.11r).',
    },
    {
      id: 'op1m5q7',
      domain: 'Redes de comunicaciones',
      prompt:
        'Se van a instalar puntos de acceso cuyo fabricante indica un consumo máximo de 22 W. Los conmutadores de planta actuales solo cumplen IEEE 802.3af. ¿Qué hay que hacer para alimentarlos a plena potencia por el cable de datos?',
      choices: [
        'Nada: 802.3af entrega hasta 30 W por puerto',
        'Usar cable de categoría superior para reducir las pérdidas',
        'Pasar a conmutadores (o inyectores) 802.3at, que garantizan 25,5 W en el equipo alimentado',
        'Pasar obligatoriamente a 802.3bt tipo 4, el único que supera los 20 W',
      ],
      answer: 2,
      explain:
        '802.3af garantiza solo 12,95 W en el equipo alimentado (15,4 W en el puerto), insuficiente para 22 W. 802.3at garantiza 25,5 W en el PD, que cubre el consumo. 802.3bt también serviría, pero no es obligatorio ni el único que pasa de 20 W; la cifra de 30 W corresponde al puerto de 802.3at, no a 802.3af.',
    },
    {
      id: 'op1m5q8',
      domain: 'Redes de comunicaciones',
      prompt: '¿A qué corresponde el nombre comercial «Wi-Fi 6E»?',
      choices: [
        'A la enmienda 802.11be, que añade canales de 320 MHz',
        'A la enmienda 802.11ax operando en la banda de 6 GHz',
        'A la enmienda 802.11ac ampliada a la banda de 2,4 GHz',
        'A una versión de 802.11ax con cifrado reforzado',
      ],
      answer: 1,
      explain:
        'Wi-Fi 6E es 802.11ax extendido a la banda de 6 GHz: la misma enmienda que Wi-Fi 6, con espectro nuevo. 802.11be es Wi-Fi 7, que tienta porque también usa 6 GHz, y 802.11ac (Wi-Fi 5) nunca ha trabajado en 2,4 GHz.',
    },
  ],
};
