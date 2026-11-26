import type { ClassifyData, LabMeta, OrderData } from '../labs';

// ---------------------------------------------------------------------------
// Redes y ENS · Bloque 3 (Servicios de red) — Consorcio Provincial de Arcedo
// Fuente única: docs/superpowers/sources/2026-11-26-op3-fuentes.md
// ---------------------------------------------------------------------------

export const OP3_LABS: LabMeta[] = [
  {
    id: 'opl3a',
    sectionId: 'op3',
    title: 'Una concesión que cruza el relay',
    icon: '📨',
    minutes: 10,
    xp: 75,
    kind: 'order',
    brief:
      'Ordena los 8 tramos que recorre la concesión de un portátil de la VLAN 10 hasta DHCP1 y de vuelta, pasando por el agente relay de la SVI. Fíjate en las direcciones, el puerto de destino y el campo giaddr de cada tramo.',
  },
  {
    id: 'opl3b',
    sectionId: 'op3',
    title: 'Cada dato en su registro',
    icon: '📇',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Las zonas del Consorcio necesitan doce datos nuevos. Decide qué tipo de registro DNS guarda cada uno: A, AAAA, CNAME, MX, NS, SOA, PTR o SRV. Necesitas ≥80 %.',
  },
  {
    id: 'opl3c',
    sectionId: 'op3',
    title: '¿Qué servicio ha fallado?',
    icon: '🩺',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce avisos llegan al Servicio de Informática y Comunicaciones. Atribuye cada síntoma al servicio que lo provoca: resolución de nombres, asignación de direcciones, hora o proxy web. Necesitas ≥80 %.',
  },
];

// ---------------------------------------------------------------------------
// Order labs
// ---------------------------------------------------------------------------

export const OP3_ORDER_DATA: Record<string, OrderData> = {
  opl3a: {
    prompt:
      'Un portátil recién conectado a un puerto de acceso de la VLAN 10 de la sede (10.20.10.0/24) arranca sin dirección y marca el bit de difusión (B = 1). Su puerta de enlace, la SVI 10.20.10.1 del conmutador de distribución, hace de agente relay hacia los dos servidores del CPD, DHCP1 (10.20.72.21) y DHCP2 (10.20.72.22). Sigue la copia que va a DHCP1, que es el que contesta. Cada tramo indica IP de origen → IP de destino, puerto UDP de destino y valor de giaddr. Toca los tramos en el orden en que ocurren.',
    steps: [
      {
        text: 'El portátil difunde un DHCPDISCOVER en la VLAN 10',
        detail:
          'Tramo: 0.0.0.0 → 255.255.255.255 · UDP destino 67 · giaddr 0.0.0.0. Todavía no tiene dirección, así que la IP de origen es 0 y el destino es la difusión limitada; todo mensaje del cliente al servidor va al puerto 67 (bootps). El cliente nunca rellena giaddr. Esa difusión no sale de la VLAN 10: sin relay, DHCP1 no la vería nunca.',
      },
      {
        text: 'La SVI rellena giaddr y reenvía el DHCPDISCOVER a DHCP1',
        detail:
          'Tramo: 10.20.10.1 → 10.20.72.21 · UDP destino 67 · giaddr 10.20.10.1. Como giaddr llega a 0, el relay escribe la IP de la interfaz por la que entró la petición (la SVI de la VLAN 10), suma 1 al campo hops y la envía en unidifusión al puerto 67 del servidor. La RFC no fija la IP de origen del relay; aquí se muestra la de la SVI. Si se usa la opción 82, la inserta aquí. Una copia igual sale hacia DHCP2, porque el Consorcio configuró en la SVI los dos servidores como destino del relay (con la conmutación por error de Windows Server y los servidores en otra subred, Microsoft pide las dos direcciones).',
      },
      {
        text: 'DHCP1 elige el ámbito por giaddr y responde al relay con un DHCPOFFER',
        detail:
          'Tramo: 10.20.72.21 → 10.20.10.1 · UDP destino 67 · giaddr 10.20.10.1. Con giaddr distinto de 0, DHCP1 elige la dirección según la red del relay: 10.20.10.1 está en 10.20.10.0/24, así que usa el ámbito de la VLAN 10 y ofrece yiaddr 10.20.10.137. La respuesta va al puerto 67 del relay que figura en giaddr, no directamente al cliente, y copia el giaddr de la petición.',
      },
      {
        text: 'La SVI entrega el DHCPOFFER al portátil',
        detail:
          'Tramo: 10.20.10.1 → 255.255.255.255 · UDP destino 68 · giaddr 10.20.10.1. giaddr le dice al relay por qué interfaz sacarlo. La RFC no fija la IP de origen del relay; aquí se muestra la de la SVI. Como el portátil marcó B = 1, lo difunde en la VLAN 10; con B = 0 iría en unidifusión a yiaddr y a la MAC de chaddr. El destino es el puerto 68 (bootpc), el del cliente. giaddr sigue en el mensaje; lo que el relay quita antes de entregar es la opción 82, si la había.',
      },
      {
        text: 'El portátil difunde un DHCPREQUEST con el identificador de DHCP1',
        detail:
          'Tramo: 0.0.0.0 → 255.255.255.255 · UDP destino 67 · giaddr 0.0.0.0. Sigue sin dirección configurada (ciaddr 0): pide por difusión la 10.20.10.137 en la opción 50 e incluye la opción 54 con el identificador de DHCP1. Con un solo mensaje acepta esa oferta y rechaza cualquier otra que hubiera llegado.',
      },
      {
        text: 'La SVI vuelve a rellenar giaddr y reenvía el DHCPREQUEST',
        detail:
          'Tramo: 10.20.10.1 → 10.20.72.21 · UDP destino 67 · giaddr 10.20.10.1. El cliente vuelve a dejar giaddr a 0 y el relay repite el trabajo: su IP de la VLAN 10 en giaddr, hops + 1 y unidifusión al puerto 67 de cada servidor configurado. DHCP2 también recibe su copia; si hubiera hecho una oferta, al ver otro servidor en la opción 54 la daría por rechazada (RFC 2131 §3.1).',
      },
      {
        text: 'DHCP1 confirma la concesión con un DHCPACK al relay',
        detail:
          'Tramo: 10.20.72.21 → 10.20.10.1 · UDP destino 67 · giaddr 10.20.10.1. DHCP1 compromete yiaddr 10.20.10.137 y añade los parámetros del ámbito: máscara (opción 1), puerta 10.20.10.1 (opción 3), DNS 10.20.72.11 y 10.20.72.12 (opción 6) y la concesión de 8 horas, 28 800 s (opción 51). giaddr sigue distinto de 0, así que la respuesta vuelve al puerto 67 del relay.',
      },
      {
        text: 'La SVI entrega el DHCPACK y el portátil comprueba la dirección',
        detail:
          'Tramo: 10.20.10.1 → 255.255.255.255 · UDP destino 68 · giaddr 10.20.10.1. El relay lo difunde en la VLAN 10 hacia el puerto 68, igual que la oferta. El portátil debería hacer una última comprobación de la 10.20.10.137 (por ejemplo, con ARP) y, si otro equipo ya la usa, enviar DHCPDECLINE. Si está libre, pasa a BOUND y en T1 (por defecto la mitad de la concesión: 4 horas) renovará en unidifusión directamente con DHCP1.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

export const OP3_CLASSIFY_DATA: Record<string, ClassifyData> = {
  opl3b: {
    passPct: 80,
    categories: [
      { id: 'a', label: 'A' },
      { id: 'aaaa', label: 'AAAA' },
      { id: 'cname', label: 'CNAME' },
      { id: 'mx', label: 'MX' },
      { id: 'ns', label: 'NS' },
      { id: 'soa', label: 'SOA' },
      { id: 'ptr', label: 'PTR' },
      { id: 'srv', label: 'SRV' },
    ],
    items: [
      {
        text: 'dc1.ad.arcedo.example tiene que resolver a 10.20.72.11',
        answer: 'a',
        why: 'A (tipo 1). Asocia un nombre a una dirección IPv4 («a host address», RFC 1035). Es lo que pregunta un puesto cuando busca DC1 por su nombre.',
      },
      {
        text: 'Si el Consorcio desplegara IPv6, los puestos tendrían que encontrar por su nombre la dirección IPv6 de un servidor',
        answer: 'aaaa',
        why: 'AAAA (tipo 28). Es el registro de dirección IPv6 (RFC 3596). El registro de tipo 1 solo guarda direcciones IPv4 de 32 bits: no admite una IPv6.',
      },
      {
        text: 'intranet.ad.arcedo.example debe ser otro nombre del servidor web interno, sin repetir su dirección',
        answer: 'cname',
        why: 'CNAME (tipo 5). Da «the canonical name for an alias». Un nombre con CNAME no puede tener ningún otro registro, salvo los de DNSSEC (RFC 2181 §10.1), así que intranet queda solo como alias.',
      },
      {
        text: 'Indicar qué servidor recibe el correo dirigido a cuentas @arcedo.example',
        answer: 'mx',
        why: 'MX (tipo 15). «mail exchange»: guarda una preferencia y el nombre del servidor de correo. Ese nombre no puede ser un alias (RFC 2181 §10.3): necesita sus propios registros de dirección.',
      },
      {
        text: 'Indicar qué servidores son autoritativos de arcedo.example en el proveedor de DNS externo',
        answer: 'ns',
        why: 'NS (tipo 2). «an authoritative name server». Un servidor autoritativo responde con el bit AA = 1 y aparece en el RRset NS de la zona; en la zona padre, ese mismo RRset es la delegación.',
      },
      {
        text: 'Saber qué versión de la zona arcedo.example tiene el primario, para que un secundario decida si debe transferirla',
        answer: 'soa',
        why: 'SOA (tipo 6). Su campo SERIAL es el número de versión de la zona (32 bits sin signo). El secundario lo compara al vencer REFRESH o tras un NOTIFY y, si ha subido, transfiere la zona.',
      },
      {
        text: 'Al consultar 10.20.72.11 hay que obtener el nombre dc1.ad.arcedo.example',
        answer: 'ptr',
        why: 'PTR (tipo 12). «a domain name pointer»: resolución inversa. Las direcciones IPv4 cuelgan de IN-ADDR.ARPA con los octetos al revés: 11.72.20.10.in-addr.arpa (RFC 1035 §3.5).',
      },
      {
        text: 'Los puestos que se unen al dominio deben averiguar qué equipo ofrece LDAP en ad.arcedo.example, en qué puerto y con qué prioridad',
        answer: 'srv',
        why: 'SRV (tipo 33). Localiza servicios con prioridad, peso, puerto y destino (RFC 2782). Active Directory publica así sus DC para _ldap y _kerberos (valor del fabricante: Microsoft; puerto 389 en su ejemplo de _ldap).',
      },
      {
        text: 'Fijar cuánto tiempo pueden guardar los resolutores la respuesta «ese nombre no existe» en arcedo.example',
        answer: 'soa',
        why: 'SOA (tipo 6). El autoritativo incluye el SOA al responder NXDOMAIN o NODATA, y el tiempo de caché negativa es el menor entre su campo MINIMUM y el TTL del propio SOA (RFC 2308). El sentido antiguo de MINIMUM como «TTL mínimo de la zona» está en desuso.',
      },
      {
        text: 'El visor de eventos tiene que mostrar el nombre del equipo a partir de su dirección IPv6',
        answer: 'ptr',
        why: 'PTR (tipo 12). La inversa de IPv6 usa el mismo tipo de registro, pero colgado de IP6.ARPA (RFC 3596 §2.5, que sustituyó a IP6.INT). El registro de tipo 28 solo resuelve en sentido directo.',
      },
      {
        text: 'encuestas.arcedo.example debe apuntar a arcedo.encuestas-proveedor.example, el nombre que asigna el proveedor externo que aloja las encuestas',
        answer: 'cname',
        why: 'CNAME (tipo 5). Convierte encuestas.arcedo.example en alias del nombre del proveedor. No serviría para arcedo.example a secas: el ápice siempre tiene SOA y NS, y un nombre con CNAME no puede tener más registros.',
      },
      {
        text: 'El nombre del proxy corporativo tiene que resolver a 10.20.72.50',
        answer: 'a',
        why: 'A (tipo 1). Nombre → dirección IPv4. El puerto 8080 no se guarda aquí: un registro de dirección solo lleva la dirección, y el puerto lo indica el archivo PAC o la configuración del navegador.',
      },
    ],
  },
  opl3c: {
    passPct: 80,
    categories: [
      { id: 'dns', label: 'DNS' },
      { id: 'dhcp', label: 'DHCP' },
      { id: 'ntp', label: 'NTP' },
      { id: 'proxy', label: 'Proxy web' },
    ],
    items: [
      {
        text: 'Tras cambiar un conmutador de distribución, los puestos de la VLAN 10 se quedan sin dirección; los servidores del CPD siguen bien. En la SVI nueva no se configuró el reenvío hacia los servidores de direcciones del CPD',
        answer: 'dhcp',
        why: 'El DHCPDISCOVER es una difusión que no sale de la VLAN 10. Sin agente relay en la SVI, nadie rellena giaddr ni lo lleva en unidifusión a DHCP1 y DHCP2 (RFC 2131 §4.1, RFC 1542).',
      },
      {
        text: 'Un lunes, los últimos portátiles en llegar a la VLAN 10 no obtienen dirección: ya hay 151 equipos con concesión vigente en esa red',
        answer: 'dhcp',
        why: 'El ámbito de la VLAN 10 va de 10.20.10.100 a 10.20.10.250: 151 direcciones. Con todas concedidas, el ámbito está agotado. Hay que ampliarlo o acortar la concesión de 8 horas.',
      },
      {
        text: 'Un portátil que viene de una oficina comarcal intenta seguir con la dirección que tenía allí, el servidor le contesta con una negativa y el equipo vuelve a empezar desde cero',
        answer: 'dhcp',
        why: 'Es un DHCPNAK: la idea que tiene el cliente de su dirección es incorrecta porque ha cambiado de subred (RFC 2131 §3.1). El portátil tiene que empezar de nuevo el intercambio para obtener una dirección de la sede.',
      },
      {
        text: 'El ping a 10.20.72.10 responde, pero el navegador no abre expedientes.ad.arcedo.example y la consulta del nombre devuelve NXDOMAIN',
        answer: 'dns',
        why: 'Si hay conectividad por IP y la respuesta es NXDOMAIN (RCODE 3, «Name Error»), lo que falla es la resolución: el nombre no existe en la zona que consulta el puesto. Toca revisar el registro en los DC.',
      },
      {
        text: 'Un puesto nuevo no consigue unirse a ad.arcedo.example: no localiza ningún controlador de dominio, aunque llega por IP a 10.20.72.11. Tiene configurados a mano los resolutores del operador',
        answer: 'dns',
        why: 'Los DC se localizan con registros SRV bajo _msdcs, que solo publican DC1 y DC2 (valor del fabricante: Microsoft). Los resolutores del operador no conocen la zona interna. El puesto tiene que usar 10.20.72.11 y 10.20.72.12.',
      },
      {
        text: 'Las respuestas grandes llegan truncadas (bit TC) y el reintento falla porque el cortafuegos solo deja pasar UDP 53',
        answer: 'dns',
        why: 'Con TC, el cliente debería repetir la consulta por TCP 53 (RFC 7766 §4), y la RFC 7766 hace TCP obligatorio para todos. Si el cortafuegos bloquea TCP 53, las respuestas que no caben en UDP no llegan nunca.',
      },
      {
        text: 'Un portátil que ha pasado semanas fuera de la red va 9 minutos adelantado y el inicio de sesión en el dominio falla con KRB_AP_ERR_SKEW',
        answer: 'ntp',
        why: 'El error 37 «Clock skew too great» de Kerberos (RFC 4120) salta cuando la diferencia supera la tolerancia: 5 minutos por defecto en la Default Domain Policy (valor del fabricante: Microsoft). La solución es sincronizar la hora.',
      },
      {
        text: 'Al reconstruir un incidente, los registros del cortafuegos aparecen 3 minutos desfasados respecto a los de los controladores de dominio y la secuencia no cuadra',
        answer: 'ntp',
        why: 'Correlacionar registros exige una hora común. Todos los equipos deben sincronizarse con 10.20.72.41 y 10.20.72.42; el registro de actividad del ENS (op.exp.8) pide además fecha y hora en cada evento.',
      },
      {
        text: 'Los equipos de una oficina comarcal dejan de ajustar la hora desde que un cortafuegos nuevo descarta el tráfico UDP 123 hacia 10.20.72.41 y 10.20.72.42',
        answer: 'ntp',
        why: 'NTPv4 viaja en datagramas UDP al puerto 123 (RFC 5905). Si se cortan, los relojes de la oficina derivan y, tarde o temprano, fallan Kerberos y la correlación de registros.',
      },
      {
        text: 'Cualquier web externa devuelve un código 407 a la usuaria de un puesto nuevo, mientras la intranet abre sin problemas',
        answer: 'proxy',
        why: '407 «Proxy Authentication Required»: lo devuelve el proxy, no el servidor web (que usaría 401). El proxy envía Proxy-Authenticate y el navegador tiene que repetir la petición con Proxy-Authorization (RFC 9110).',
      },
      {
        text: 'Después de trasladar el archivo .pac a otro servidor, los navegadores que lo tenían apuntado no salen a internet; las aplicaciones internas siguen funcionando',
        answer: 'proxy',
        why: 'El archivo PAC (FindProxyForURL) decide para cada URL si se va DIRECT o por PROXY 10.20.72.50:8080. Si el navegador no lo encuentra en la ruta que tiene apuntada, ya no sabe que debe ir por el proxy, y en el Consorcio el cortafuegos de salida solo deja pasar la web que viene de 10.20.72.50. Hay que actualizar la ruta del PAC.',
      },
      {
        text: 'Una web externa concreta devuelve un código 504 generado por 10.20.72.50:8080: no recibió a tiempo la respuesta del servidor de origen. El resto de webs externas abren con normalidad',
        answer: 'proxy',
        why: '504 «Gateway Timeout» (RFC 9110 §15.6.5): el intermediario no recibió respuesta a tiempo del servidor de dentro de la cadena, aquí el de origen. El puesto llega bien al proxy; el fallo está entre el proxy y esa web. Si la respuesta llegara pero no fuera válida, sería un 502 (§15.6.3).',
      },
    ],
  },
};
