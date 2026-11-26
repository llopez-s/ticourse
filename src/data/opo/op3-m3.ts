import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP3M3 — DHCP: de DORA a la conmutación por error, DHCPv6 y el snooping
// Fuente única: docs/superpowers/sources/2026-11-26-op3-fuentes.md (§6, §7, §8, §16)
// ---------------------------------------------------------------------------
export const OP3_M3: Module = {
  id: 'op3m3',
  sectionId: 'op3',
  title: 'DHCP: concesiones, relay, conmutación por error y DHCPv6',
  minutes: 25,
  objectives: [
    'Describir el intercambio DORA y los ocho tipos de mensaje de la opción 53, con los puertos UDP 67 y 68 y el papel del bit BROADCAST',
    'Calcular T1 y T2 de una concesión y distinguir el estado RENEWING (unidifusión al mismo servidor) del REBINDING (difusión a cualquiera)',
    'Reconocer las opciones DHCP habituales por su código y separar lo que dice la norma (subred, giaddr, asignación manual) de lo que es producto (ámbito, exclusión, reserva)',
    'Explicar cómo un agente relay reenvía las peticiones con giaddr, hops y la opción 82, y cómo se reparten dos servidores en conmutación por error',
    'Comparar DHCPv6 (RFC 9915) con SLAAC según los flags M y O del Router Advertisement, y explicar qué protege el DHCP snooping',
  ],
  blocks: [
    {
      t: 'p',
      md: 'En el Consorcio Provincial de Arcedo nadie escribe a mano la dirección de un puesto. Cuando un portátil se conecta en la VLAN 10 de la sede, enseguida sabe su dirección, su máscara, su puerta de enlace `10.20.10.1` y sus servidores DNS, `10.20.72.11` y `10.20.72.12`. Quien se lo dice es **DHCP** (*Dynamic Host Configuration Protocol*, RFC 2131, con las opciones de la RFC 2132), y quien lo sirve está a varios saltos, en el CPD: **DHCP1** (`10.20.72.21`) y **DHCP2** (`10.20.72.22`), dos servidores en conmutación por error. Para llegar hasta ellos, las SVI (interfaces virtuales de VLAN) de los conmutadores de distribución de la sede y los encaminadores de cada oficina comarcal hacen de **agente relay**. Esta lección sigue ese camino: el intercambio de mensajes, la concesión y su renovación, las opciones, el relay, el reparto entre DHCP1 y DHCP2, la versión de IPv6 y la protección del conmutador frente a servidores falsos.',
    },
    { t: 'h', text: 'DORA: cuatro mensajes para conseguir una dirección' },
    {
      t: 'p',
      md: 'DHCP viaja sobre **UDP**: el cliente envía al puerto **67** del servidor (la IANA lo registra como `bootps`) y el servidor responde al puerto **68** del cliente (`bootpc`). Al principio el cliente no tiene dirección, así que usa como origen **0.0.0.0** y envía su primer mensaje a la difusión **255.255.255.255**. El intercambio básico tiene cuatro pasos, que se recuerdan con el acrónimo **DORA**, una regla mnemotécnica que la RFC no usa: **DHCPDISCOVER** (el cliente busca servidores), **DHCPOFFER** (cada servidor que puede atenderlo le ofrece una dirección), **DHCPREQUEST** (el cliente pide lo ofrecido por uno de ellos, lo que rechaza implícitamente a los demás) y **DHCPACK** (el servidor confirma la dirección y los parámetros). La dirección ofrecida viaja en el campo **`yiaddr`** («your IP address»); el campo **`xid`** es un identificador aleatorio que liga las respuestas a la petición; **`chaddr`** lleva la dirección hardware del cliente (16 octetos), y **`ciaddr`** su dirección IP cuando ya tiene una. Antes de ofrecer, el servidor puede sondear la dirección con un **ICMP Echo Request**; después del ACK, el cliente debería hacer una última comprobación, por ejemplo con **ARP**, y si alguien ya la usa responde con **DHCPDECLINE**.',
    },
    {
      t: 'table',
      headers: ['Opción 53', 'Mensaje', 'Lo envía', 'Para qué'],
      rows: [
        ['1', 'DHCPDISCOVER', 'Cliente', 'Buscar servidores, por difusión'],
        ['2', 'DHCPOFFER', 'Servidor', 'Ofrecer una dirección y parámetros'],
        ['3', 'DHCPREQUEST', 'Cliente', 'Pedir lo ofrecido por un servidor; también confirmar tras reiniciar y renovar'],
        ['4', 'DHCPDECLINE', 'Cliente', 'Avisar de que la dirección ya está en uso'],
        ['5', 'DHCPACK', 'Servidor', 'Confirmar la dirección y los parámetros'],
        ['6', 'DHCPNAK', 'Servidor', 'Rechazar: la idea del cliente es incorrecta (cambió de subred) o la concesión expiró'],
        ['7', 'DHCPRELEASE', 'Cliente', 'Liberar la dirección'],
        ['8', 'DHCPINFORM', 'Cliente', 'Pedir solo parámetros; ya tiene la dirección configurada'],
      ],
    },
    {
      t: 'p',
      md: 'El tipo de cada mensaje no va en la cabecera, sino en la **opción 53**, «DHCP Message Type», de un octeto (RFC 2132 §9.6). Son **ocho** valores; la RFC 3203 añadió el 9, **DHCPFORCERENEW**, con el que el servidor obliga a renovar y que debe ir autenticado. Fíjate en que el **4 es DECLINE y el 5 es ACK**: el orden numérico no sigue el de DORA, y es una confusión frecuente. El cuarto mensaje de DORA, el ACK, lleva el valor 5. Otro detalle de formato: las opciones empiezan siempre por la «magic cookie» 99.130.83.99.',
    },
    {
      t: 'p',
      md: '¿Cómo llega la respuesta a un cliente que todavía no tiene dirección? La RFC 2131 §4.1 fija el orden: si el campo **`giaddr`** no es cero, el servidor responde al **puerto 67 del relay** que figura en él; si `giaddr` es cero y `ciaddr` no, responde en unidifusión a `ciaddr`; si los dos son cero y el cliente ha activado el **bit BROADCAST**, responde a la difusión 255.255.255.255; y si no, en unidifusión a la MAC del cliente y a `yiaddr`. El bit BROADCAST es el bit más a la izquierda del campo `flags` (el resto va a cero): lo activa el cliente que no es capaz de recibir datagramas en unidifusión antes de tener su dirección configurada. Un DHCPNAK sin relay (`giaddr` = 0) se envía siempre por difusión. Si el cliente no recibe respuesta, reintenta a los **4 s** aproximadamente (±1), luego a los 8, doblando hasta un máximo de **64 s**.',
    },
    {
      t: 'check',
      q: {
        q: 'Un portátil con una concesión de la VLAN 10 de la sede se lleva a una oficina comarcal (10.20.8.0/22) y, al encenderse allí, envía un DHCPREQUEST pidiendo su dirección antigua, 10.20.10.130. ¿Qué responde el servidor?',
        choices: [
          'Un DHCPACK, porque la concesión aún no ha expirado',
          'Un DHCPOFFER con su dirección antigua, porque el servidor la reconoce por chaddr',
          'Un DHCPNAK, porque la dirección no corresponde a la subred desde la que pide',
          'Un DHCPDECLINE, porque la dirección pertenece a otra red',
        ],
        answer: 2,
        explain:
          'El DHCPNAK existe justo para esto: la idea que tiene el cliente de su dirección es incorrecta, por ejemplo porque ha cambiado de subred. Tras el NAK el cliente vuelve a empezar con un DISCOVER. El DHCPDECLINE tienta, pero lo envía el cliente, no el servidor, y significa que la dirección ya está en uso.',
      },
    },
    { t: 'h', text: 'La concesión y su renovación: T1 y T2' },
    {
      t: 'p',
      md: 'La RFC 2131 §1 describe tres formas de asignar direcciones: **automática** (una dirección permanente), **dinámica** (por tiempo limitado, la única que **reutiliza** direcciones) y **manual** (el administrador fija la dirección y DHCP solo la entrega). La dinámica es la habitual, y su tiempo es la **concesión**: los tiempos se expresan en segundos y el valor 0xffffffff está reservado para una concesión infinita. Dentro de la concesión hay dos relojes (§4.4.5). Al llegar a **T1** el cliente pasa al estado **RENEWING** y envía un DHCPREQUEST **en unidifusión al servidor que se la concedió**. Si ese servidor no contesta, al llegar a **T2** pasa a **REBINDING** y envía el DHCPREQUEST **por difusión, a cualquier servidor**. Si la concesión expira sin respuesta, el cliente pierde la dirección y vuelve a INIT. Por defecto, **T1 = 0,5** y **T2 = 0,875** de la duración de la concesión, con un pequeño margen aleatorio para que no renueven todos a la vez; el servidor puede fijar otros valores con las opciones **58** (T1) y **59** (T2). Los estados del cliente son INIT, SELECTING, REQUESTING, BOUND, RENEWING, REBINDING, INIT-REBOOT y REBOOTING.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Un puesto de la VLAN 10 con la concesión de 8 horas del Consorcio',
      text: `Concesión: 8 h (decisión del Consorcio para el ámbito de la VLAN 10)
Obtenida por DORA a las 08:00 · servidor que la concede: DHCP1 10.20.72.21

08:00  BOUND       dirección 10.20.10.130, puerta 10.20.10.1, DNS 10.20.72.11 y .12
12:00  T1 = 0,5 x 8 h = 4 h   -> RENEWING
       DHCPREQUEST en unidifusión a DHCP1 (el que figura en la opción 54)
       Si DHCP1 responde con DHCPACK: concesión renovada, vuelta a BOUND
15:00  T2 = 0,875 x 8 h = 7 h -> REBINDING (solo si DHCP1 no ha contestado)
       DHCPREQUEST por difusión: puede contestar DHCP2
16:00  Expira la concesión sin respuesta -> el puesto deja la dirección y vuelve a INIT`,
    },
    {
      t: 'check',
      q: {
        q: 'Con la concesión de 8 horas de la VLAN 10, DHCP1 lleva caído desde antes de T1. ¿Qué hace el puesto y cuándo puede atenderlo DHCP2?',
        choices: [
          'A las 4 horas envía un DHCPREQUEST por difusión y DHCP2 lo atiende entonces',
          'A las 4 horas reintenta en unidifusión con DHCP1; a las 7 horas pasa a REBINDING y envía el DHCPREQUEST por difusión, que DHCP2 puede atender',
          'A las 7 horas pierde la dirección y empieza de nuevo con un DHCPDISCOVER',
          'Espera a que expire la concesión, a las 8 horas, y entonces pide la renovación a DHCP2 en unidifusión',
        ],
        answer: 1,
        explain:
          'En T1 (0,5 × 8 = 4 h) la renovación va en unidifusión al servidor que concedió, DHCP1, que no contesta. En T2 (0,875 × 8 = 7 h) el cliente pasa a REBINDING y difunde la petición a cualquier servidor, así que DHCP2 puede responder. La primera opción mezcla los dos estados: la difusión es propia de T2, no de T1. A las 7 horas no se pierde la dirección; eso ocurre al expirar la concesión.',
      },
    },
    { t: 'h', text: 'Opciones habituales y el «ámbito»' },
    {
      t: 'table',
      headers: ['Código', 'Opción', 'Uso'],
      rows: [
        ['1', 'Subnet Mask', 'Máscara de la subred'],
        ['3', 'Router', 'Puerta de enlace (lista por preferencia)'],
        ['4', 'Time Server', 'Servidores de hora del protocolo **RFC 868**: **no es NTP** (*Network Time Protocol*)'],
        ['6', 'Domain Name Server', 'Servidores DNS'],
        ['15', 'Domain Name', 'Dominio DNS del cliente'],
        ['42', 'Network Time Protocol Servers', 'Servidores **NTP**, por preferencia'],
        ['43 y 60', 'Vendor Specific Information · Vendor class identifier', 'Datos del fabricante (43) para la clase que el cliente declara en la 60'],
        ['50', 'Requested IP Address', 'El cliente pide una dirección concreta'],
        ['51', 'IP Address Lease Time', 'Duración de la concesión'],
        ['53', 'DHCP Message Type', 'Tipo de mensaje (1 a 8)'],
        ['54', 'Server Identifier', 'Identifica al servidor; el cliente lo usa como destino en unidifusión'],
        ['55', 'Parameter Request List', 'Opciones que pide el cliente'],
        ['58 y 59', 'Renewal (T1) · Rebinding (T2) Time Value', 'Tiempos de renovación y de reasociación'],
        ['61', 'Client-identifier', 'Identificador del cliente'],
        ['66 y 67', 'TFTP server name · Bootfile name', 'Arranque en red: servidor TFTP (*Trivial File Transfer Protocol*) y archivo de arranque'],
        ['81', 'Client FQDN', 'El cliente comunica su FQDN (*Fully Qualified Domain Name*), su nombre completo (base del DNS dinámico desde DHCP, RFC 4702)'],
        ['82', 'Relay Agent Information', 'La añade el relay (RFC 3046)'],
        ['119', 'Domain Search', 'Lista de sufijos de búsqueda DNS (RFC 3397)'],
        ['121', 'Classless Static Route', 'Rutas estáticas sin clase; si llega junto a la 3, el cliente ignora la 3 (RFC 3442)'],
      ],
    },
    {
      t: 'p',
      md: 'La palabra **ámbito** (*scope*) no aparece en la RFC 2131. La norma solo dice que el servidor elige la dirección según la **subred por la que llegó el mensaje** o, si lo trajo un relay, según la dirección que figura en **`giaddr`** (§4.3.1). «Ámbito» es un término de producto. En la documentación de **Microsoft** (Windows Server), un ámbito es una agrupación administrativa de las direcciones IP de los equipos de una subred: se crea **uno por subred física**, con su intervalo de direcciones, su máscara, la duración de la concesión y sus opciones (puerta de enlace, DNS). También son de fabricante el **intervalo de exclusión**, un rango contiguo dentro del ámbito que el servidor no reparte porque está ocupado por equipos con dirección fija (encaminadores, servidores, impresoras), y la **reserva**, que hace que un equipo reciba siempre la misma dirección. La reserva es la versión de producto de la **asignación manual** que sí define la RFC. El ámbito de la VLAN 10 del Consorcio reparte de `10.20.10.100` a `10.20.10.250`, con puerta `10.20.10.1`, DNS `10.20.72.11` y `10.20.72.12` y concesión de 8 horas. Las direcciones bajas quedan fuera del intervalo, así que no hace falta excluirlas; la impresora de la planta 2, en cambio, tiene una reserva en `10.20.10.200`, dentro del ámbito.',
    },
    {
      t: 'check',
      q: {
        q: 'Un ámbito entrega la opción 3 con la puerta 10.20.10.1 y, además, la opción 121 con varias rutas estáticas sin clase. ¿Qué hace el cliente con la opción 3?',
        choices: [
          'La usa como ruta por defecto y añade las rutas de la 121 por encima',
          'La usa solo si ninguna ruta de la 121 coincide con el destino',
          'Rechaza la oferta entera con un DHCPDECLINE por contener datos contradictorios',
          'La ignora: cuando llega la 121, el cliente debe ignorar la opción Router',
        ],
        answer: 3,
        explain:
          'La RFC 3442 dice que, si llegan la 121 y la 3, el cliente «MUST ignore the Router option». Por eso, si se usa la 121, la ruta por defecto tiene que ir dentro de ella. Las dos primeras opciones tientan porque parecen lógicas, pero la norma no combina ambas. El DHCPDECLINE solo se envía cuando la dirección ya está en uso.',
      },
    },
    { t: 'h', text: 'El agente relay: giaddr, hops y la opción 82' },
    {
      t: 'p',
      md: 'Una difusión no atraviesa un encaminador, así que un DHCPDISCOVER de la VLAN 10 nunca llegaría por sí solo al CPD. El **agente relay** (RFC 2131 §4.1 y RFC 1542) resuelve el problema: recibe la difusión del cliente, escribe **su propia dirección en `giaddr`** y la reenvía **en unidifusión** al servidor. El servidor responde al relay, a su puerto 67, y el relay entrega la respuesta al cliente. El valor de `giaddr` sirve además para algo clave: con él el servidor sabe **de qué subred** viene la petición y, por tanto, de qué ámbito tiene que sacar la dirección. El campo **`hops`** pone un límite a los reenvíos: la RFC 1542 §4.1.1 obliga al relay a descartar en silencio las peticiones con `hops` mayor que **16**, un umbral configurable cuyo valor recomendado por defecto es **4**. La orden `ip helper-address`, que se ve a menudo, es la **sintaxis de Cisco IOS** para configurar el relay, no un término de la norma.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Un DHCPDISCOVER de la VLAN 10 atraviesa la SVI hasta el CPD',
      text: `Puesto de la VLAN 10 (sin dirección)
  IP 0.0.0.0:68  ->  255.255.255.255:67   DHCPDISCOVER   giaddr 0.0.0.0

SVI de la VLAN 10 en el conmutador de distribución (agente relay)
  rellena giaddr = 10.20.10.1 y añade la opción 82 (subopciones 1 y 2)
  SVI  ->  10.20.72.21:67  (DHCP1)   unidifusión
  SVI  ->  10.20.72.22:67  (DHCP2)   unidifusión: dos direcciones de relay

DHCP1 (en load balance, el servidor al que el hash de la RFC 3074 asigna este cliente)
  giaddr 10.20.10.1 -> la petición viene de 10.20.10.0/24 -> ámbito de la VLAN 10
  DHCPOFFER  ->  10.20.10.1:67 (al relay), con la opción 82 devuelta tal cual

SVI
  quita la opción 82 y entrega el DHCPOFFER al puesto en la VLAN 10`,
    },
    {
      t: 'p',
      md: 'La **opción 82**, «Relay Agent Information» (RFC 3046), la **inserta el relay** al reenviar los mensajes del cliente. Lleva subopciones; las dos básicas son la **1, «Agent Circuit ID»** (el circuito o puerto por el que llegó la petición) y la **2, «Agent Remote ID»** (un identificador del extremo remoto). El servidor puede usarla para su política, por ejemplo para decidir según el puerto de origen, y la **devuelve tal cual** en su respuesta; el relay **la quita** antes de entregar la respuesta, de modo que **el cliente nunca la ve**. Hay además una regla de confianza (§2.1): si un relay recibe por un circuito que considera no confiable un paquete con `giaddr` = 0 que ya trae la opción 82, lo descarta y anota un error, porque un cliente legítimo no debería traerla. Qué circuitos son confiables lo decide la configuración local.',
    },
    {
      t: 'check',
      q: {
        q: 'Un DHCPDISCOVER de la VLAN 10 llega a DHCP1 a través del relay de la SVI. ¿Con qué dato decide DHCP1 de qué ámbito sacar la dirección?',
        choices: [
          'Con la dirección IP de origen del cliente, 0.0.0.0',
          'Con el campo giaddr, que el relay ha rellenado con 10.20.10.1',
          'Con la MAC del cliente, que figura en chaddr',
          'Con el campo ciaddr, que el cliente rellena con su subred',
        ],
        answer: 1,
        explain:
          'Cuando giaddr no es cero, el servidor elige la dirección según la dirección del relay que reenvió el mensaje (RFC 2131 §4.3.1): 10.20.10.1 pertenece a 10.20.10.0/24, el ámbito de la VLAN 10. El origen 0.0.0.0 no dice nada de la subred, y ciaddr solo lleva la dirección del cliente cuando ya tiene una. La MAC de chaddr sirve para identificar al cliente, por ejemplo en una reserva, no para elegir la subred.',
      },
    },
    { t: 'h', text: 'Dos servidores a la vez: la conmutación por error' },
    {
      t: 'p',
      md: 'Que DHCP1 y DHCP2 se repartan las concesiones sin pisarse no está resuelto por ninguna RFC en IPv4. El protocolo de conmutación por error de DHCP se quedó en un **borrador IETF** (*Internet Engineering Task Force*), el draft-ietf-dhc-failover-12 de marzo de 2003, que **caducó** ese mismo año y **nunca llegó a RFC**. De él vienen los términos que usan los productos: el **MCLT** (*maximum client lead time*, que Microsoft usa para las concesiones temporales que da un servidor mientras no tiene contacto con su socio) y los estados NORMAL, COMMUNICATIONS-INTERRUPTED y PARTNER-DOWN. Sí es RFC el **algoritmo de reparto** de la **RFC 3074**: un *hash* del identificador del cliente (o de `chaddr`) que da un valor de **0 a 255** y reparte esos valores entre los dos servidores. Y sí tiene RFC la conmutación por error de **DHCPv6**, la **RFC 8156**. Cada fabricante ha hecho lo demás a su manera: Kea, del ISC (*Internet Systems Consortium*), por ejemplo, no implementa el borrador y usa su propia «alta disponibilidad».',
    },
    {
      t: 'table',
      headers: ['Qué', 'Dónde está fijado', 'Detalle'],
      rows: [
        ['Protocolo de conmutación por error DHCPv4', 'Borrador IETF caducado (2003)', 'Nunca fue RFC; de él salen el MCLT y los estados NORMAL, COMMUNICATIONS-INTERRUPTED y PARTNER-DOWN'],
        ['Algoritmo de reparto', 'RFC 3074', 'Hash del identificador del cliente con valores 0–255'],
        ['Conmutación por error DHCPv6', 'RFC 8156', 'Solo IPv6'],
        ['Modos «load balance» y «hot standby»', 'Valor de Microsoft', 'Solo dos servidores por relación; no admite ámbitos IPv6'],
        ['Reparto 50:50 en load balance (modo por defecto)', 'Valor de Microsoft', 'Cada servidor atiende la mitad de los clientes, según el hash de la RFC 3074'],
        ['Reserva del 5 % en hot standby', 'Valor de Microsoft', 'Direcciones que guarda el servidor de reserva'],
        ['Puerto TCP 647', 'Valor de Microsoft (y del borrador)', 'En la IANA, el 647/tcp `dhcp-failover` remite a la RFC 8156, que es solo DHCPv6'],
        ['Relojes con más de un minuto de diferencia', 'Valor de Microsoft', 'El asistente se detiene: hace falta NTP'],
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: DHCP1 y DHCP2 en Windows Server',
      md: 'El Consorcio tiene DHCP1 y DHCP2 en una relación de conmutación por error. Si se dejan los valores por defecto de **Microsoft**, trabajan en **load balance**, repartiéndose los clientes **50:50**, y hablan entre sí por **TCP 647**. Como los servidores están en el CPD y los clientes en otras subredes, cada relay necesita **dos direcciones de destino**: la SVI de la VLAN 10 y los encaminadores de las oficinas comarcales reenvían a `10.20.72.21` **y** a `10.20.72.22`. Si solo apuntaran a DHCP1, la caída de DHCP1 dejaría sin servicio a los clientes nuevos aunque DHCP2 estuviera sano. Y como el asistente se detiene si los relojes difieren más de un minuto, los dos sincronizan con los NTP internos `10.20.72.41` y `10.20.72.42`. Nada de esto es norma IETF: son las reglas del producto.',
    },
    { t: 'h', text: 'IPv6: SLAAC, los flags M y O, y DHCPv6' },
    {
      t: 'links',
      title: 'APIPA, NDP y SLAAC ya están explicados en el bloque de redes',
      items: [{ label: 'Direccionamiento IPv4 e IPv6: APIPA, NDP y SLAAC (lección op1m2)', href: '/learn/op1m2' }],
    },
    {
      t: 'p',
      md: 'En IPv6 un equipo puede configurarse sin servidor con **SLAAC** (*Stateless Address Autoconfiguration*, RFC 4862), a partir del prefijo que anuncian los encaminadores. Lo que decide si además interviene DHCPv6 son dos flags del **Router Advertisement** (RA, RFC 4861 §4.2). El flag **M** («Managed address configuration») indica que hay direcciones por DHCPv6; si está activo, el flag O es redundante. El flag **O** («Other configuration») indica que por DHCPv6 hay **otra configuración**, como los servidores DNS. Si **ninguno** está activo, no hay nada disponible por DHCPv6. Además, cada prefijo anunciado lleva su flag **A** (*autonomous*), que dice si ese prefijo vale para SLAAC. Los DNS también pueden llegar en el propio RA, con la opción **RDNSS** (*Recursive DNS Server*, tipo 25, RFC 8106). Y la **puerta de enlace** llega por los RA (su campo Router Lifetime anuncia al encaminador como router por defecto).',
    },
    {
      t: 'p',
      md: '**DHCPv6** tiene hoy como referencia la **RFC 9915**, Internet Standard de enero de 2026, que **deja obsoleta la RFC 8415** (la que a su vez había sustituido a la 3315). Los clientes escuchan en el puerto UDP **546** y los servidores y relays en el **547**. El cliente no usa difusión, que en IPv6 no existe, sino la multidifusión de enlace **ff02::1:2** («All_DHCP_Relay_Agents_and_Servers»); el relay usa la de sitio **ff05::1:3** («All_DHCP_Servers»). El intercambio con estado es **Solicit, Advertise, Request, Reply**, y con **Rapid Commit** se reduce a dos mensajes, Solicit y Reply. Para pedir solo configuración, sin dirección (el «DHCPv6 sin estado» que encaja con O = 1), el cliente envía un **Information-request**. Cliente y servidor se identifican con un **DUID** (*DHCP Unique Identifier*), que hace el papel de la MAC y del Client-identifier de DHCPv4. Las direcciones van en una **IA_NA** (*Identity Association for Non-temporary Addresses*) y los prefijos delegados en una **IA_PD** (*Identity Association for Prefix Delegation*). Para T1 y T2 la RFC 9915 recomienda **0,5 y 0,8** de la vida preferida más corta, no el 0,875 de DHCPv4.',
    },
    {
      t: 'table',
      headers: ['', 'DHCPv4', 'DHCPv6'],
      rows: [
        ['Norma', 'RFC 2131 y 2132', 'RFC 9915 (obsoleta la 8415)'],
        ['Puertos UDP', 'Cliente 68 · servidor 67', 'Cliente 546 · servidor y relay 547'],
        ['Primer mensaje', 'DHCPDISCOVER a 255.255.255.255', 'Solicit a la multidifusión ff02::1:2'],
        ['Intercambio con estado', 'DISCOVER, OFFER, REQUEST, ACK', 'Solicit, Advertise, Request, Reply (dos con Rapid Commit)'],
        ['Solo parámetros', 'DHCPINFORM', 'Information-request'],
        ['Identificador del cliente', 'chaddr y opción 61', 'DUID'],
        ['T1 y T2 por defecto o recomendados', '0,5 y 0,875 de la concesión', '0,5 y 0,8 de la vida preferida más corta'],
        ['Puerta de enlace', 'Opción 3 (o rutas de la 121)', 'Por el Router Advertisement'],
        ['Conmutación por error', 'Borrador caducado; cada fabricante a su manera', 'RFC 8156'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Un encaminador anuncia un Router Advertisement con M = 0 y O = 1, y su prefijo lleva el flag A activo. ¿Cómo se configura un equipo de ese enlace?',
        choices: [
          'Obtiene la dirección por SLAAC y pide por DHCPv6 solo otros datos, como los DNS, con un Information-request',
          'Obtiene la dirección y los DNS por DHCPv6 con Solicit, Advertise, Request y Reply',
          'No puede usar DHCPv6, porque M está desactivado',
          'Obtiene la dirección por DHCPv6 y la puerta de enlace por SLAAC',
        ],
        answer: 0,
        explain:
          'Con M = 0 no hay direcciones por DHCPv6, así que la dirección sale de SLAAC con el prefijo marcado con A; con O = 1 hay otra configuración por DHCPv6, que se pide sin estado con un Information-request. El intercambio de cuatro mensajes es el que correspondería a M = 1. Decir que no se puede usar DHCPv6 olvida el flag O.',
      },
    },
    { t: 'h', text: 'DHCP snooping: que solo responda quien debe' },
    {
      t: 'p',
      md: 'Un servidor DHCP falso conectado a un puerto de usuario, por error o con mala intención, puede repartir una puerta de enlace o unos DNS que no son los del Consorcio y desviar así el tráfico de toda una planta. El **DHCP snooping** es la defensa, y conviene saber de dónde sale: **no es una RFC**, sino una **función de los conmutadores**. El equivalente normativo es **SAVI-DHCP** (*Source Address Validation Improvement* para DHCP, RFC 7513), que describe el mismo mecanismo. Cada puerto tiene un atributo **DHCP-Trust** (lo que los fabricantes llaman puerto de confianza) que dice si el equipo conectado puede **originar mensajes de servidor a cliente** (OFFER, ACK, NAK); solo se activa en los puertos por los que llegan el servidor o el relay. Así, un DHCPOFFER que entra por un puerto de usuario se descarta. Además, el conmutador observa los intercambios DHCP legítimos y construye una **tabla de vínculos** (dirección IP, punto de conexión), con la que filtra el tráfico cuyo origen no coincide. Las órdenes concretas para activarlo dependen de cada fabricante.',
    },
    {
      t: 'check',
      q: {
        q: 'En un conmutador de acceso de la VLAN 10, con DHCP snooping, ¿qué puertos deben marcarse como de confianza para los mensajes de servidor a cliente?',
        choices: [
          'Todos los puertos de la VLAN 10, para que ningún puesto se quede sin dirección',
          'Los puertos de los puestos que tienen una reserva DHCP',
          'Ninguno: el snooping descarta todos los DHCPOFFER',
          'Solo el enlace troncal hacia los conmutadores de distribución, por donde vuelven las respuestas del relay',
        ],
        answer: 3,
        explain:
          'Las respuestas legítimas de DHCP1 y DHCP2 llegan a través del relay de la SVI, así que entran por el troncal hacia distribución; ese es el único puerto que debe poder originar mensajes de servidor a cliente. Confiar en todos los puertos anula la protección, y una reserva no convierte a un puesto en servidor. Si ningún puerto fuera de confianza, se descartarían también las ofertas legítimas.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Puertos:** DHCPv4, servidor **67** y cliente **68** (UDP); DHCPv6, cliente **546** y servidor/relay **547**. **Opción 53:** 1 DISCOVER, 2 OFFER, 3 REQUEST, **4 DECLINE**, **5 ACK**, 6 NAK, 7 RELEASE, 8 INFORM; el ACK no es el 4. **DORA** es una regla mnemotécnica, no un término de la RFC. **Renovar no es reasociar:** en **T1 = 0,5** (RENEWING) la petición va en **unidifusión al mismo servidor**; en **T2 = 0,875** (REBINDING), por **difusión a cualquiera**. En DHCPv6, 0,5 y **0,8**. **Opción 4 frente a 42:** NTP es la **42**; la 4 es el protocolo de hora de la RFC 868. **Opción 3 y 121:** si llegan las dos, se ignora la 3. **Ámbito, exclusión y reserva** son términos de producto; la norma habla de subred, `giaddr` y asignación manual. **Opción 82:** la pone el relay, el servidor la devuelve tal cual y el relay la quita; el cliente nunca la ve. **hops:** descarte por encima de 16. **Conmutación por error DHCPv4:** borrador caducado en 2003, no RFC; 50:50, 5 % y TCP 647 son de Microsoft; la RFC 3074 es solo el reparto por *hash* (0–255) y la 8156 es solo DHCPv6. **DHCPv6:** cita la **RFC 9915**, no la 8415. **M y O:** M = direcciones por DHCPv6; solo O = otros datos (DHCPv6 sin estado); ninguno = nada por DHCPv6. **DHCP snooping** no es una RFC; su equivalente es SAVI-DHCP (RFC 7513).',
    },
  ],
  quiz: [
    {
      id: 'op3m3q1',
      domain: 'Servicios de red',
      prompt:
        'Un puesto de la VLAN 10 del Consorcio obtiene a las 09:00 una concesión de 8 horas de DHCP1. Con los valores por defecto de la RFC 2131, ¿cuándo intenta renovarla por primera vez y cómo?',
      choices: [
        'A las 13:00, con un DHCPREQUEST por difusión a cualquier servidor',
        'A las 13:00, con un DHCPREQUEST en unidifusión a DHCP1',
        'A las 16:00, con un DHCPREQUEST en unidifusión a DHCP1',
        'A las 15:00, con un DHCPDISCOVER por difusión',
      ],
      answer: 1,
      explain:
        'T1 es por defecto 0,5 de la concesión: 4 horas después, a las 13:00, el cliente pasa a RENEWING y pide la renovación en unidifusión al servidor que se la concedió. La difusión a cualquier servidor tienta, pero es propia de REBINDING, que empieza en T2 = 0,875 × 8 = 7 h, a las 16:00. En ninguno de los dos estados se envía un DHCPDISCOVER.',
    },
    {
      id: 'op3m3q2',
      domain: 'Servicios de red',
      prompt:
        'En una captura de tráfico, un mensaje DHCP lleva la opción 53 con el valor 4. ¿De qué mensaje se trata?',
      choices: [
        'DHCPACK, el cuarto paso de DORA',
        'DHCPNAK',
        'DHCPDECLINE',
        'DHCPRELEASE',
      ],
      answer: 2,
      explain:
        'En la RFC 2132 §9.6 el valor 4 es DHCPDECLINE, con el que el cliente avisa de que la dirección ya está en uso. DHCPACK tienta porque es el cuarto mensaje de DORA, pero su valor es el 5: la numeración no sigue el orden del intercambio. DHCPNAK es el 6 y DHCPRELEASE el 7.',
    },
    {
      id: 'op3m3q3',
      domain: 'Servicios de red',
      prompt:
        'La SVI de la VLAN 10 (10.20.10.1) actúa como agente relay hacia DHCP1. ¿A qué dirección y puerto envía DHCP1 su DHCPOFFER?',
      choices: [
        'A 10.20.10.1, puerto UDP 67, porque giaddr no es cero',
        'A 255.255.255.255, puerto UDP 68, porque el cliente aún no tiene dirección',
        'A la dirección ofrecida en yiaddr, puerto UDP 68',
        'A 10.20.10.1, puerto UDP 68, el puerto de los clientes',
      ],
      answer: 0,
      explain:
        'La RFC 2131 §4.1 dice que, si giaddr no es cero, el servidor responde al puerto 67 del relay que figura en ese campo; es el relay quien entrega luego la respuesta al cliente. La difusión al 68 es lo que haría un servidor en la misma subred con el bit BROADCAST activo y sin relay. El puerto 68 es el del cliente, no el del relay.',
    },
    {
      id: 'op3m3q4',
      domain: 'Servicios de red',
      prompt: '¿Qué afirmación sobre la opción 82, «Relay Agent Information» (RFC 3046), es correcta?',
      choices: [
        'La añade el cliente para indicar en qué puerto está conectado',
        'La añade el servidor para que el relay sepa a qué cliente entregar la respuesta',
        'La añade el relay y el cliente la recibe en el DHCPACK para guardarla con su concesión',
        'La añade el relay, el servidor la devuelve tal cual y el relay la quita antes de entregar la respuesta al cliente',
      ],
      answer: 3,
      explain:
        'El relay inserta la opción 82, con subopciones como Agent Circuit ID (1) y Agent Remote ID (2); el servidor la puede usar para su política y la devuelve sin cambios, y el relay la retira antes de entregar la respuesta, de modo que el cliente nunca la ve. La tercera opción tienta porque acierta quién la añade, pero falla en el final. Un cliente que la trajera por un circuito no confiable vería su paquete descartado.',
    },
    {
      id: 'op3m3q5',
      domain: 'Servicios de red',
      prompt:
        'El Consorcio quiere que todos los puestos usen sus NTP internos, 10.20.72.41 y 10.20.72.42, configurados desde DHCP. ¿Qué opción debe añadir a los ámbitos?',
      choices: [
        'La opción 4, Time Server',
        'La opción 42, Network Time Protocol Servers',
        'La opción 15, Domain Name',
        'La opción 119, Domain Search',
      ],
      answer: 1,
      explain:
        'La opción 42 de la RFC 2132 lista los servidores NTP por orden de preferencia. La opción 4, Time Server, tienta por el nombre, pero corresponde al protocolo de hora de la RFC 868, que no es NTP. Las opciones 15 y 119 son de DNS: el dominio del cliente y la lista de sufijos de búsqueda.',
    },
    {
      id: 'op3m3q6',
      domain: 'Servicios de red',
      prompt:
        'DHCP1 y DHCP2 trabajan en conmutación por error con Windows Server, en load balance 50:50 y comunicándose por TCP 647. ¿Qué afirmación es correcta?',
      choices: [
        'El reparto 50:50 y el puerto 647 los fija la RFC 3074, que define el protocolo de conmutación por error de DHCPv4',
        'La misma relación cubre también los ámbitos IPv6, porque la RFC 8156 lo exige',
        'Microsoft se basa en un borrador IETF caducado en 2003; el 50:50 y el puerto TCP 647 son valores del fabricante',
        'Es un Internet Standard desde 2003, y por eso cualquier servidor DHCP puede ser socio de un Windows Server',
      ],
      answer: 2,
      explain:
        'La conmutación por error de DHCPv4 nunca llegó a RFC: el draft-ietf-dhc-failover-12 caducó en 2003, y Microsoft se basa en él con sus propios valores (load balance 50:50 por defecto, reserva del 5 % en hot standby, TCP 647). La RFC 3074 tienta porque sí la usa Microsoft, pero solo define el algoritmo de reparto por hash (0–255), no el protocolo. La RFC 8156 es solo para DHCPv6, y la conmutación por error de Microsoft no admite ámbitos IPv6.',
    },
    {
      id: 'op3m3q7',
      domain: 'Servicios de red',
      prompt:
        'Un equipo IPv6 recibe un Router Advertisement con el flag M activo. ¿Qué afirmación sobre DHCPv6 es correcta?',
      choices: [
        'El cliente obtiene su dirección por DHCPv6, enviando un Solicit a ff02::1:2 desde el puerto UDP 546 al 547',
        'El cliente envía un DHCPDISCOVER a 255.255.255.255 al puerto UDP 67',
        'El cliente envía el Solicit a la multidifusión de sitio ff05::1:3, desde el puerto UDP 547',
        'La norma vigente es la RFC 8415, y el servidor escucha en el puerto 546',
      ],
      answer: 0,
      explain:
        'Con M = 1 hay direcciones por DHCPv6. Según la RFC 9915, el cliente escucha en el 546, los servidores y relays en el 547, y el cliente envía su Solicit a la multidifusión de enlace ff02::1:2, porque en IPv6 no hay difusión. La última opción tienta con dos errores reales: la 8415 está obsoleta desde la 9915 y el 546 es el puerto del cliente. La multidifusión ff05::1:3 es la que usan los relays para llegar a los servidores, y el 547 es el puerto de servidores y relays.',
    },
    {
      id: 'op3m3q8',
      domain: 'Servicios de red',
      prompt:
        'En una planta de la sede, varios puestos de la VLAN 10 reciben como puerta de enlace una dirección que no es 10.20.10.1: alguien ha conectado a un puerto de usuario un encaminador doméstico con su servidor DHCP activo. ¿Qué control del conmutador lo evita?',
      choices: [
        'Reducir la concesión del ámbito para que los puestos renueven antes con DHCP1',
        'Activar la opción 121 en el ámbito, que obliga a ignorar las puertas de enlace de otros servidores',
        'Configurar el umbral de hops del relay a 4',
        'DHCP snooping: solo los puertos de confianza (el troncal hacia distribución) pueden originar mensajes de servidor a cliente',
      ],
      answer: 3,
      explain:
        'El DHCP snooping, cuyo equivalente normativo es SAVI-DHCP (RFC 7513), solo deja que los puertos de confianza originen OFFER y ACK; el del encaminador doméstico no lo es, así que sus ofertas se descartan. La opción 121 tienta porque hace ignorar la opción 3, pero solo dentro de la respuesta de un mismo servidor, no frente a un servidor ajeno. Acortar la concesión no impide que el falso conteste, y el umbral de hops solo afecta a las peticiones que pasan por el relay.',
    },
  ],
};
