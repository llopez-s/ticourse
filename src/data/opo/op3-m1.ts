import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP3M1 — DNS: cómo funciona
// ---------------------------------------------------------------------------
export const OP3_M1: Module = {
  id: 'op3m1',
  sectionId: 'op3',
  title: 'DNS: cómo funciona',
  minutes: 24,
  objectives: [
    'Explicar la jerarquía del DNS (raíz, dominio de primer nivel y zona) y cómo una zona padre delega en una hija con registros NS y, cuando hace falta, registros de pegamento',
    'Distinguir la resolución recursiva de la iterativa y el papel de los bits RD, RA y AA de la cabecera',
    'Calcular cuánto puede guardarse en caché una respuesta positiva o negativa a partir del TTL y del registro SOA',
    'Reconocer los tipos de registro habituales por su función y su código, y leer los siete campos de un SOA',
    'Describir cómo se mantienen al día primario y secundarios (NOTIFY, AXFR, IXFR) y qué transporte usa cada mensaje: UDP o TCP 53, límite de 512 octetos y EDNS',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Este bloque reúne los **servicios de red** que nadie ve hasta que fallan: el **DNS** (*Domain Name System*), que traduce nombres en direcciones; el **DHCP** (*Dynamic Host Configuration Protocol*), que reparte la configuración de red; el **NTP** (*Network Time Protocol*), que mantiene la hora; y los servicios de conectividad que hay alrededor, como el proxy web o la gestión de direcciones. Seguimos en el Consorcio Provincial de Arcedo. Su dominio público es **`arcedo.example`**, cuya zona autoritativa no está en el CPD: la aloja un **proveedor de DNS externo**. Dentro, los controladores de dominio llevan un DNS interno para Active Directory, pero eso es materia de la lección siguiente. Aquí toca el mecanismo: cómo está organizado el espacio de nombres, quién pregunta a quién, cuánto dura una respuesta en caché, qué guarda cada tipo de registro y cómo viajan los mensajes. Es una lección de cifras: 13 nombres de servidor raíz, 63 y 255 octetos, 512 octetos por UDP, el puerto 53 y un código numérico para cada tipo de registro.',
    },
    { t: 'h', text: 'Un árbol de nombres repartido en zonas' },
    {
      t: 'p',
      md: 'El espacio de nombres del DNS es un **árbol**. Cada nodo tiene una **etiqueta** de **63 octetos como máximo**, y un nombre completo, que se lee de la hoja a la raíz separando etiquetas con puntos, no pasa de **255 octetos** (RFC 1035 §2.3.4). En la cima está la **raíz**, que se escribe como un punto final; debajo, los **dominios de primer nivel** (TLD, *top-level domain*), la etiqueta más a la derecha del nombre; y debajo de cada TLD, los dominios de las organizaciones. Un **dominio** es una rama del árbol; una **zona** es la parte de esa rama que administra un mismo responsable. La zona se separa de su padre con una **delegación**: la zona padre publica un conjunto de registros **NS** con los servidores de la hija, y ese punto se llama **corte de zona** (RFC 9499). Si el nombre de un servidor de la hija cae **por debajo** del propio corte (por ejemplo, `ns1.arcedo.example` para la zona `arcedo.example`), el padre tiene que añadir también su dirección, porque si no nadie podría encontrarlo: son los **registros de pegamento** (*glue*), que no son datos autoritativos de la zona padre y solo se usan en las remisiones. Una delegación que apunta a un servidor que no sirve la zona se llama **delegación coja** (*lame delegation*).',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'De la raíz a arcedo.example: quién delega en quién',
      text: `.                         zona raíz, servida por a.root-servers.net ... m.root-servers.net
└── example.              la raíz publica sus NS: la raíz delega en el TLD
    └── arcedo.example.   el TLD publica sus NS: delega en el proveedor de DNS
            arcedo.example.   NS   ns1.proveedor-dns.example.
            arcedo.example.   NS   ns2.proveedor-dns.example.
        ├── www.arcedo.example.      datos de la zona del Consorcio
        └── correo.arcedo.example.

Los servidores de arcedo.example se llaman ns1/ns2.proveedor-dns.example:
están FUERA del corte, así que el TLD no necesita registros de pegamento
para esta delegación. Sus direcciones se averiguan en su propia zona.`,
    },
    {
      t: 'p',
      md: 'La raíz la sirven **13 nombres de servidor**, de **`a.root-servers.net`** a **`m.root-servers.net`**, a cargo de **12 operadores**: Verisign lleva dos, la `a` y la `j`, y el resto (entre otros RIPE NCC, ICANN, Netnod o el proyecto WIDE) uno cada uno. Cada nombre tiene dirección IPv4 e IPv6. Un resolvedor recursivo no las descubre preguntando a nadie: las conoce por un fichero de **pistas de la raíz** (*root hints*), que es su punto de partida para cualquier resolución.',
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio decide alojar su zona en dos servidores propios llamados ns1.arcedo.example y ns2.arcedo.example. ¿Qué tiene que publicar la zona padre para que la delegación funcione?',
        choices: [
          'Solo los dos registros NS, porque las direcciones ya están en la zona arcedo.example',
          'Los dos registros NS y, como registros de pegamento, las direcciones de ns1 y ns2',
          'Un registro SOA que apunte a ns1.arcedo.example',
          'Un CNAME de arcedo.example hacia ns1.arcedo.example',
        ],
        answer: 1,
        explain:
          'La delegación se hace con un conjunto de NS en la zona padre. Como los dos nombres caen por debajo del corte, sus direcciones están dentro de la propia zona que se intenta encontrar; sin pegamento, el resolvedor no tendría por dónde entrar. Solo los NS bastaría si los servidores estuvieran fuera del corte, como ocurre hoy con los del proveedor. El SOA pertenece a la zona hija, no al padre.',
      },
    },
    { t: 'h', text: 'Quién pregunta y quién responde: resolución recursiva e iterativa' },
    {
      t: 'p',
      md: 'En una resolución intervienen tres papeles. El **resolvedor stub** del puesto de trabajo no sabe recorrer el árbol: delega todo en un **resolvedor recursivo**, que hace el trabajo y normalmente guarda en caché lo que aprende. Y los **servidores autoritativos** conocen su zona por conocimiento propio y lo marcan poniendo el bit **AA** (*Authoritative Answer*) a 1 en la respuesta. La RFC 1034 (§4.3.1) define dos modos de servidor. En el **no recursivo** responde solo con lo que tiene: la respuesta, un error o una **remisión** a servidores más cercanos al nombre buscado; **todos los servidores deben implementar este modo**. En el **recursivo** el servidor resuelve por su cuenta y devuelve respuesta o error, nunca remisiones; ofrecerlo es opcional y el servidor puede limitar a qué clientes se lo da. Se negocia con dos bits: el cliente pide recursión con **RD** (*Recursion Desired*) en la consulta, y el servidor dice si la ofrece con **RA** (*Recursion Available*) en **todas** sus respuestas. Ojo: RA anuncia que el servicio existe, no que se haya usado. A la forma de trabajar del recursivo, que pregunta servidor a servidor siguiendo remisiones, se la llama **iterativa**: el término «iterativo» es de uso común (RFC 9499), porque la RFC 1034 habla de «no recursivo». Un recursivo que acepta consultas de casi cualquiera es un **resolvedor abierto**, casi siempre por mala configuración.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Una vecina de Arcedo busca www.arcedo.example desde casa (caché vacía)',
      text: `Equipo de casa (stub)  --- consulta A www.arcedo.example, RD=1 --->  resolvedor recursivo del operador

Resolvedor  ->  a.root-servers.net   «A www.arcedo.example?»
            <-  remisión: NS de example.                             AA=0
Resolvedor  ->  servidor del TLD example.
            <-  remisión: NS ns1/ns2.proveedor-dns.example.          AA=0
Resolvedor  ->  ns1.proveedor-dns.example
            <-  respuesta: www.arcedo.example. 3600 IN A 203.0.113.10   AA=1

Resolvedor  --- respuesta, RA=1 (sin AA: no es autoritativo) --->  Equipo

Hacia el equipo, una pregunta y una respuesta: eso es la parte recursiva.
Hacia los autoritativos, preguntas sueltas que devuelven remisiones: la iterativa.`,
    },
    {
      t: 'table',
      headers: ['Campo de la cabecera', 'Qué indica'],
      rows: [
        ['**QR**', '0 en la consulta, 1 en la respuesta'],
        ['**OPCODE**', 'Tipo de operación: 0 QUERY (consulta normal), 4 NOTIFY (RFC 1996), 5 UPDATE (RFC 2136)'],
        ['**AA**', 'Respuesta autoritativa: la da un servidor de la zona'],
        ['**TC**', 'Respuesta truncada (*TrunCation*): no cabía en el mensaje'],
        ['**RD**', 'El cliente pide recursión (se copia en la respuesta)'],
        ['**RA**', 'El servidor ofrece recursión; va en toda respuesta'],
        ['**RCODE**', '0 sin error, 1 error de formato, 2 fallo del servidor (*Server failure*), 3 el nombre no existe (NXDOMAIN), 4 no implementado, 5 rechazada (*Refused*)'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Un técnico lanza una consulta con RD = 1 contra un servidor autoritativo del proveedor, por un nombre de otra organización. Recibe una remisión con RA = 0. ¿Qué significa?',
        choices: [
          'Que el servidor está caído y devuelve una respuesta vacía',
          'Que el nombre no existe (NXDOMAIN)',
          'Que el servidor no ofrece recursión y ha respondido en modo no recursivo, con lo que sabe',
          'Que el servidor ha resuelto el nombre, pero no puede dar la respuesta por UDP',
        ],
        answer: 2,
        explain:
          'RD solo es una petición: si el servidor no ofrece recursión, lo dice con RA = 0 y contesta en modo no recursivo, que en este caso es una remisión hacia servidores más cercanos al nombre. Un NXDOMAIN es otra cosa: RCODE 3, el nombre no existe. Y una respuesta que no cabe por UDP llega truncada, con TC = 1, no como remisión.',
      },
    },
    { t: 'h', text: 'Caché y TTL, también para decir «no existe»' },
    {
      t: 'p',
      md: 'Cada registro lleva un **TTL** (*time to live*) en segundos: el tiempo **máximo** que otro servidor puede guardarlo en caché, no un tiempo obligatorio. Es un entero **sin signo** que va de 0 a **2 147 483 647** (2^31 − 1, RFC 2181 §8). Los registros con el mismo nombre, clase y tipo forman un **RRset** (*resource record set*) y deben compartir TTL (RFC 2181 §5.2). La consecuencia práctica sale de la definición: si el Consorcio va a cambiar la dirección de `www.arcedo.example` y su TTL es de un día, durante un día habrá resolvedores que sigan dando la antigua.\n\nLas respuestas negativas también se guardan: es la **caché negativa** de la RFC 2308. Hay dos casos. **NXDOMAIN** (RCODE 3) dice que el nombre no existe. **NODATA** dice que el nombre existe pero no tiene registros de ese tipo: la respuesta llega con RCODE 0 y la sección de respuesta vacía. En los dos casos el servidor autoritativo **debe** incluir el **SOA** (*Start of Authority*) de la zona en la sección de autoridad, y ese SOA fija cuánto vale la negativa: el **menor** entre el campo **MINIMUM** del SOA y el TTL del propio registro SOA. La RFC 2308 (§5) añade que, como tope en el resolvedor, de **una a tres horas** funciona bien y más de un día da problemas.',
    },
    {
      t: 'check',
      q: {
        q: 'El SOA de arcedo.example tiene un TTL de 3600 s y su campo MINIMUM vale 900. Desde Internet, alguien pregunta por noexiste.arcedo.example, un nombre que no está en la zona pública. ¿Cuánto tiempo, como máximo, puede guardar el resolvedor esa respuesta negativa?',
        choices: ['900 segundos', '3600 segundos', 'Nada: las respuestas negativas no se guardan', '4500 segundos, la suma de los dos'],
        answer: 0,
        explain:
          'Según la RFC 2308, el TTL de la respuesta negativa es el menor entre MINIMUM y el TTL del SOA: min(900, 3600) = 900. Tomar los 3600 del SOA es el error tentador, porque es el TTL que se ve en el registro, pero el MINIMUM lo recorta. Las respuestas negativas sí se guardan: para eso existe la RFC 2308.',
      },
    },
    { t: 'h', text: 'Tipos de registro: qué guarda cada uno' },
    {
      t: 'table',
      headers: ['Tipo', 'Código', 'Qué guarda', 'Ejemplo'],
      rows: [
        ['**A**', '1', 'Una dirección IPv4', '`www.arcedo.example. A 203.0.113.10`'],
        ['**AAAA**', '28', 'Una dirección IPv6 (RFC 3596)', 'El Consorcio no tiene prefijo IPv6; un ejemplo genérico: `AAAA 2001:db8::1`'],
        ['**CNAME**', '5', 'El nombre canónico de un alias', '`portal.arcedo.example. CNAME www.arcedo.example.`'],
        ['**MX**', '15', 'Servidor de correo de un dominio: preferencia y nombre', '`arcedo.example. MX 10 correo.arcedo.example.`'],
        ['**NS**', '2', 'Un servidor autoritativo de la zona', '`arcedo.example. NS ns1.proveedor-dns.example.`'],
        ['**SOA**', '6', 'El inicio de una zona de autoridad y sus parámetros', 'Uno solo, en el ápice de la zona (tabla siguiente)'],
        ['**PTR**', '12', 'Un puntero (*pointer*) a un nombre: la resolución inversa', '`10.72.20.10.in-addr.arpa.` → nombre del servidor de expedientes (zona inversa interna)'],
        ['**TXT**', '16', 'Cadenas de texto', 'Datos que leen otros sistemas o personas'],
        ['**SRV**', '33', 'Dónde está un servicio (*service*): prioridad, peso, puerto y destino (RFC 2782)', '`_servicio._tcp.nombre. SRV 0 100 <puerto> destino.`'],
        ['**CAA**', '257', 'Qué autoridades de certificación pueden emitir para el dominio (*Certification Authority Authorization*, RFC 8659)', '`arcedo.example. CAA 0 issue "ca.example"`'],
      ],
    },
    {
      t: 'p',
      md: 'Todos estos registros son de la clase **IN** (Internet), código 1. Cuatro detalles se preguntan mucho. **CNAME**: un nombre que tiene un CNAME **no puede tener ningún otro dato** (RFC 2181 §10.1; las únicas excepciones son registros de DNSSEC). Por eso **no puede haber un CNAME en el ápice** de una zona, que siempre lleva SOA y NS. Y el destino de un **NS**, de un **MX** o de un **SRV** **no puede ser un alias**: tiene que ser un nombre con su propio A o AAAA. **MX**: si hay varios, se prefiere el de **preferencia más baja** (RFC 1035 §3.3.9: «Lower values are preferred»). **PTR**: la resolución inversa de IPv4 cuelga de **`in-addr.arpa`** con los octetos **al revés**, de modo que `10.20.72.10` se busca como `10.72.20.10.in-addr.arpa`; la de IPv6, de **`ip6.arpa`**. La zona inversa la administra quien tiene el bloque de direcciones: la de las direcciones internas `10.20.x.x` es del Consorcio, pero el PTR de su dirección pública `203.0.113.10` lo publica el operador, que es el dueño de ese bloque.\n\n**SRV** sigue el formato `_Servicio._Protocolo.Nombre TTL Clase SRV Prioridad Peso Puerto Destino`. El cliente **debe** intentar primero el destino de **prioridad más baja**; entre los de igual prioridad, el **peso** reparte la carga (más peso, más probabilidad). Los tres campos van de 0 a 65535, y un destino «.» significa que el servicio no existe en ese dominio. Active Directory se apoya en estos registros para que los equipos encuentren sus controladores; lo verás en la lección siguiente. **CAA**: antes de emitir un certificado, una autoridad de certificación conforme **debe** consultar el CAA del nombre y no emitir si no la autoriza. Las etiquetas son **issue** (autoriza a una autoridad), **issuewild** (lo mismo para certificados comodín) e **iodef** (dónde avisar de una solicitud que viola la política). Si el CAA solo contiene iodef, no restringe nada.',
    },
    {
      t: 'table',
      headers: ['Campo del SOA', 'Qué significa', 'En arcedo.example (valores del Consorcio)'],
      rows: [
        ['**MNAME**', 'El servidor que es la fuente original o primaria de los datos de la zona', '`ns1.proveedor-dns.example.`'],
        ['**RNAME**', 'El buzón del responsable; el primer punto hace de «@»', '`hostmaster.arcedo.example.` = hostmaster@arcedo.example'],
        ['**SERIAL**', 'Versión de la zona; entero de 32 bits sin signo, se compara con aritmética de números de secuencia', '`2026112601` (el Consorcio usa la fecha y un contador)'],
        ['**REFRESH**', 'Cada cuánto comprueba el secundario si hay versión nueva', '3600 s'],
        ['**RETRY**', 'Cuánto espera para reintentar si falló la comprobación', '900 s'],
        ['**EXPIRE**', 'Tope sin poder refrescar tras el cual la zona deja de ser autoritativa en el secundario', '1 209 600 s (14 días)'],
        ['**MINIMUM**', 'Hoy, el TTL de las respuestas negativas (RFC 2308)', '900 s'],
      ],
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Zona arcedo.example en el proveedor (formato de fichero de zona, extracto)',
      text: `arcedo.example.        3600 IN SOA   ns1.proveedor-dns.example. hostmaster.arcedo.example. (
                                      2026112601 ; SERIAL
                                      3600       ; REFRESH
                                      900        ; RETRY
                                      1209600    ; EXPIRE
                                      900 )      ; MINIMUM = TTL de las negativas
arcedo.example.        3600 IN NS    ns1.proveedor-dns.example.
arcedo.example.        3600 IN NS    ns2.proveedor-dns.example.
arcedo.example.        3600 IN MX    10 correo.arcedo.example.
arcedo.example.        3600 IN CAA   0 issue "ca.example"
arcedo.example.        3600 IN CAA   0 iodef "mailto:seguridad@arcedo.example"
www.arcedo.example.    3600 IN A     203.0.113.10
correo.arcedo.example. 3600 IN A     203.0.113.10
portal.arcedo.example. 3600 IN CNAME www.arcedo.example.

; Ningún CNAME en el ápice (arcedo.example ya tiene SOA, NS, MX y CAA).
; El MX apunta a correo, que tiene su propio A: nunca a portal, que es un alias.
; www y correo comparten la única dirección pública: el encaminador reenvía cada
; puerto al servidor que toca.`,
    },
    {
      t: 'check',
      q: {
        q: '¿Qué código de tipo tiene el registro AAAA?',
        choices: ['1', '6', '28', '33'],
        answer: 2,
        explain:
          'La RFC 3596 asigna el 28 al AAAA, el registro de las direcciones IPv6. El 1 es el A, la versión IPv4, con la que se confunde a menudo; el 6 es el SOA y el 33 el SRV.',
      },
    },
    { t: 'h', text: 'Primario, secundarios y transferencias de zona' },
    {
      t: 'p',
      md: 'Una zona se sirve desde varios servidores autoritativos para no depender de uno solo. El **primario** es donde se edita la zona y el origen de las transferencias; los **secundarios** obtienen su copia **por transferencia de zona** (RFC 9499; los términos antiguos «maestro» y «esclavo» ya no se usan). El secundario se mantiene al día con los tiempos del SOA: cada **REFRESH** pide el SOA al primario y compara el **SERIAL**; si ha subido, transfiere la zona; si la comprobación falla, reintenta cada **RETRY**; y si pasa **EXPIRE** sin conseguirlo, deja de responder como si tuviera la zona (RFC 1035 §6.3), porque prefiere callar a servir datos que pueden estar caducados. Esperar al REFRESH es lento, así que existe **NOTIFY** (RFC 1996, OPCODE 4): el primario avisa a los secundarios de que el SOA ha cambiado, y cada secundario actúa como si hubiera vencido su REFRESH: pide el SOA y, **solo si el SERIAL ha subido**, transfiere.\n\nHay dos formas de transferir. **AXFR** (QTYPE **252**, RFC 5936) copia la zona entera y **solo se define sobre TCP**. **IXFR** (QTYPE **251**, RFC 1995) copia solo lo que ha cambiado: el secundario mete en la sección de autoridad el SOA de **su** versión y el primario le manda las diferencias desde ella o, si no puede, la zona completa como haría un AXFR. IXFR puede intentarse primero por UDP si la respuesta cabe en un paquete; si no cabe, se repite por TCP, y si el servidor no entiende IXFR, se pasa a AXFR. Quién puede transferir lo decide el servidor por política, y la negativa llega con **RCODE 5 (*Refused*)**. Cómo se autentican estas transferencias se ve en la lección siguiente.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Cambio en la zona del Consorcio: del primario al secundario',
      text: `El Consorcio añade un registro en el panel del proveedor.
ns1 (primario) pasa la zona al SERIAL 2026112602.

ns1  --- NOTIFY (OPCODE 4) para arcedo.example ------------------->  ns2
ns2  --- consulta SOA arcedo.example ----------------------------->  ns1
ns1  <-- SOA ... SERIAL 2026112602 --------------------------------  (responde)
     ns2 tenía 2026112601: el SERIAL ha subido, hay que transferir
ns2  --- IXFR arcedo.example, autoridad: SOA SERIAL 2026112601 --->  ns1
ns1  <-- solo las diferencias entre 2026112601 y 2026112602 -------  (responde)

Si el SERIAL no hubiera subido, ns2 se quedaría con su copia:
el aviso de NOTIFY no basta, manda la comparación del SERIAL.`,
    },
    {
      t: 'check',
      q: {
        q: 'Un técnico edita a mano la zona en el primario, cambia la dirección de un registro A y recarga el servicio, pero olvida subir el SERIAL. El primario envía NOTIFY. ¿Qué hace el secundario?',
        choices: [
          'Transfiere la zona completa por AXFR, porque NOTIFY obliga a hacerlo',
          'Deja de responder por la zona hasta que el SERIAL cambie',
          'Pide el SOA, ve el mismo SERIAL y sigue sirviendo la dirección antigua',
          'Aplica el cambio por IXFR, porque solo afecta a un registro',
        ],
        answer: 2,
        explain:
          'NOTIFY solo adelanta la comprobación: el secundario pide el SOA y transfiere únicamente si el SERIAL ha subido. Con el mismo número, cree que su copia está al día y sigue dando el dato antiguo. Que el aviso obligue a transferir es la confusión habitual. El secundario solo deja de responder cuando vence EXPIRE sin poder refrescar.',
      },
    },
    { t: 'h', text: 'Transporte: UDP y TCP en el puerto 53, y EDNS' },
    {
      t: 'table',
      headers: ['Situación', 'Transporte', 'Detalle'],
      rows: [
        ['Consulta normal', 'UDP 53 (preferido)', 'Respuesta de hasta **512 octetos** sin EDNS, sin contar cabeceras IP y UDP'],
        ['La respuesta no cabe', 'UDP con **TC = 1**, y el cliente repite por **TCP 53**', 'RFC 1035 §4.2.1 y RFC 7766'],
        ['Cliente con EDNS(0) (*Extension Mechanisms for DNS*)', 'UDP 53 con un pseudo-registro **OPT** (tipo 41)', 'Anuncia cuánto acepta: 4096 octetos como punto de partida; menos de 512 cuenta como 512'],
        ['Transferencia completa (AXFR)', '**Solo TCP 53**', '«AXFR sessions over UDP transport are not defined» (RFC 5936)'],
        ['Transferencia incremental (IXFR)', 'UDP si cabe; si no, TCP 53', 'RFC 1995'],
        ['Mensaje por TCP', 'TCP 53', 'Precedido de un campo de longitud de dos octetos'],
      ],
    },
    {
      t: 'p',
      md: 'El DNS usa el **puerto 53** tanto en **UDP** como en **TCP** (RFC 1035 §4.2), y **no es «solo UDP»**. Las consultas van por UDP porque es más ligero, pero un mensaje UDP clásico no pasa de **512 octetos**: si la respuesta no cabe, el servidor la recorta y pone el bit **TC**, y el cliente repite la consulta por TCP. La RFC 7766 ha convertido TCP en **obligatorio** para todos: autoritativos, recursivos, reenviadores y resolvedores stub. Por TCP, cada mensaje va precedido de dos octetos con su longitud. Para no caer en TCP con cada respuesta grande existe **EDNS(0)** (RFC 6891): el cliente añade en la sección adicional un pseudo-registro **OPT**, tipo **41**, con el tamaño de carga UDP que acepta. La RFC propone **4096 octetos** como punto de partida, con un valor más bajo de reserva si falla, y cualquier valor anunciado **por debajo de 512 cuenta como 512**. Por eso, si un cortafuegos solo deja pasar UDP 53, el DNS funciona a medias: fallan las respuestas grandes y las transferencias.',
    },
    {
      t: 'links',
      title: 'Para ampliar sin repetir',
      items: [
        { label: 'UDP, TCP y los puertos (op1m1)', href: '/learn/op1m1' },
        { label: 'DNS en la organización: interno y externo, Active Directory, DNSSEC y ataques (op3m2)', href: '/learn/op3m2' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Raíz:** 13 **nombres** (`a` a `m`.root-servers.net) y **12 operadores** (Verisign lleva la `a` y la `j`). **Límites:** etiqueta de 63 octetos, nombre de 255, UDP clásico de 512. **Delegación:** NS en la zona **padre**; pegamento solo si el servidor está por debajo del corte. **Recursiva o iterativa:** RD lo pide el cliente, RA lo anuncia el servidor en toda respuesta, AA marca al autoritativo; todo servidor debe saber responder sin recursión. **Caché negativa:** NXDOMAIN es RCODE 3; NODATA es RCODE 0 con respuesta vacía; dura el **menor** entre MINIMUM y el TTL del SOA. **MINIMUM** ya no es «el TTL mínimo de la zona». **Códigos:** A 1, NS 2, CNAME 5, SOA 6, PTR 12, MX 15, TXT 16, AAAA 28, SRV 33, OPT 41, IXFR 251, AXFR 252, CAA 257. **Reglas:** nada de CNAME en el ápice ni junto a otros datos; NS, MX y SRV nunca apuntan a un alias; en MX y en la prioridad de SRV gana el número **más bajo**. **Inversa:** octetos al revés bajo `in-addr.arpa`. **Transferencias:** NOTIFY es OPCODE 4 y solo adelanta la comprobación; manda el SERIAL; AXFR solo TCP; IXFR puede probar UDP; si vence EXPIRE, el secundario deja de responder por la zona. **Transporte:** puerto 53 en UDP **y** TCP; TC = 1 obliga a repetir por TCP; EDNS usa OPT (41) y 4096 como punto de partida.',
    },
  ],
  quiz: [
    {
      id: 'op3m1q1',
      domain: 'Servicios de red',
      prompt: '¿Qué afirmación sobre los servidores raíz del DNS es correcta?',
      choices: [
        'Hay 13 nombres, de a.root-servers.net a m.root-servers.net, a cargo de 12 operadores',
        'Hay 13 nombres y 13 operadores, uno por nombre',
        'Hay 12 nombres, uno por operador, y cada resolvedor los descubre preguntando a su TLD',
        'Hay 26 nombres: 13 para IPv4 y 13 para IPv6',
      ],
      answer: 0,
      explain:
        'Según la IANA son 13 nombres, de la a a la m, y 12 operadores, porque Verisign opera dos (la a y la j). La opción de 13 operadores tienta porque parece lógico un nombre por operador. Cada nombre tiene dirección IPv4 e IPv6, sin nombres separados por protocolo, y los resolvedores los conocen por el fichero de pistas de la raíz, no preguntando a un TLD.',
    },
    {
      id: 'op3m1q2',
      domain: 'Servicios de red',
      prompt:
        'Desde su casa, una vecina de Arcedo busca www.arcedo.example: su equipo envía al resolvedor recursivo de su operador una consulta con RD = 1. ¿Qué describe mejor lo que pasa a continuación si ese resolvedor tiene la caché vacía?',
      choices: [
        'El resolvedor reenvía la consulta a la raíz, que la resuelve de forma recursiva hasta el final y devuelve la respuesta',
        'El resolvedor devuelve al equipo una remisión a la raíz para que el equipo siga preguntando',
        'El resolvedor pregunta a la raíz, luego al TLD y luego a un autoritativo del proveedor, siguiendo remisiones, y devuelve al equipo la respuesta final',
        'El resolvedor pregunta directamente al proveedor de DNS, porque conoce de antemano los servidores de cada dominio',
      ],
      answer: 2,
      explain:
        'Hacia el equipo, el resolvedor trabaja en modo recursivo: devuelve respuesta o error, nunca remisiones. Para conseguirla pregunta de forma iterativa: la raíz y el TLD le dan remisiones y el autoritativo del proveedor, la respuesta con AA = 1. La primera opción tienta, pero la raíz no hace recursión: responde con remisiones. El resolvedor solo conoce de antemano la raíz, por las pistas de la raíz.',
    },
    {
      id: 'op3m1q3',
      domain: 'Servicios de red',
      prompt:
        'El SOA de una zona tiene TTL de 86 400 s y su campo MINIMUM vale 3600. Un resolvedor recibe un NXDOMAIN para un nombre de esa zona. ¿Durante cuánto tiempo, como máximo, puede guardar esa respuesta según la RFC 2308?',
      choices: ['86 400 segundos', '3600 segundos', '0 segundos: un NXDOMAIN no se guarda', '300 segundos, el valor fijo de la caché negativa'],
      answer: 1,
      explain:
        'La respuesta negativa dura el menor entre MINIMUM y el TTL del SOA que viaja en la sección de autoridad: min(3600, 86 400) = 3600. Los 86 400 tientan porque son el TTL visible del SOA, pero MINIMUM lo recorta. La RFC 2308 existe precisamente para guardar las respuestas negativas, y no fija ningún valor de 300 segundos.',
    },
    {
      id: 'op3m1q4',
      domain: 'Servicios de red',
      prompt:
        'Un secundario lleva varios días sin poder contactar con su primario. ¿Qué campo del SOA determina cuándo deja de responder como autoritativo por la zona?',
      choices: ['REFRESH', 'RETRY', 'MINIMUM', 'EXPIRE'],
      answer: 3,
      explain:
        'EXPIRE es el tope tras el cual la zona deja de ser autoritativa: el secundario responde entonces como si no tuviera la zona. RETRY tienta porque también trata de fallos, pero solo fija cada cuánto se reintenta el refresco. REFRESH marca las comprobaciones normales y MINIMUM es hoy el TTL de las respuestas negativas.',
    },
    {
      id: 'op3m1q5',
      domain: 'Servicios de red',
      prompt:
        'Entre un servidor primario y su secundario, un cortafuegos solo permite UDP al puerto 53. ¿Qué se puede esperar?',
      choices: [
        'Todo funciona, porque el DNS solo usa UDP',
        'Fallan solo las consultas normales, porque usan TCP',
        'Fallan las transferencias completas, porque AXFR solo está definido sobre TCP, y las respuestas que no quepan por UDP',
        'Las transferencias funcionan por UDP, aunque más despacio',
      ],
      answer: 2,
      explain:
        'La RFC 5936 deja claro que AXFR no está definido sobre UDP, y una respuesta truncada (TC = 1) obliga a repetir por TCP, que el cortafuegos corta. Un IXFR pequeño podría pasar por UDP, pero en cuanto no cupiera tendría que ir por TCP. Que el DNS sea «solo UDP» es el error que hace tentadora la primera opción; la RFC 7766 obliga a todas las implementaciones a soportar TCP.',
    },
    {
      id: 'op3m1q6',
      domain: 'Servicios de red',
      prompt:
        'En la zona arcedo.example, portal.arcedo.example es un CNAME de www.arcedo.example. Un técnico propone que el MX del dominio apunte a portal.arcedo.example. ¿Qué responderías?',
      choices: [
        'No es válido: el destino de un MX no puede ser un alias; debe ser un nombre con su propio registro de dirección',
        'Es válido siempre que el CNAME tenga el mismo TTL que el MX',
        'Es válido, porque el resolvedor seguirá el CNAME hasta la dirección',
        'Solo es válido si el MX tiene preferencia 0',
      ],
      answer: 0,
      explain:
        'La RFC 2181 (§10.3) prohíbe que el valor de un NS o de un MX sea un alias; tiene que ser un nombre con registros A o AAAA, como correo.arcedo.example. La opción de que el resolvedor siga el CNAME tienta porque es lo que ocurre con un alias en una consulta normal, pero la norma no lo admite como destino de un MX. Ni el TTL ni la preferencia cambian esa regla.',
    },
    {
      id: 'op3m1q7',
      domain: 'Servicios de red',
      prompt:
        '¿Con qué nombre se busca el registro PTR del servidor de expedientes del Consorcio, cuya dirección es 10.20.72.10?',
      choices: [
        '10.20.72.10.in-addr.arpa',
        '10.72.20.10.ip6.arpa',
        'arpa.in-addr.10.20.72.10',
        '10.72.20.10.in-addr.arpa',
      ],
      answer: 3,
      explain:
        'La resolución inversa de IPv4 cuelga de in-addr.arpa con los octetos al revés, porque el DNS lee de lo concreto a lo general y en una dirección IPv4 lo general va a la izquierda: 10.20.72.10 se busca como 10.72.20.10.in-addr.arpa. Escribir los octetos en su orden normal es el error más frecuente. ip6.arpa es el árbol de la inversa de IPv6.',
    },
    {
      id: 'op3m1q8',
      domain: 'Servicios de red',
      prompt:
        'Un resolvedor que no usa EDNS hace una consulta por UDP cuya respuesta ocupa unos 1400 octetos. ¿Qué ocurre?',
      choices: [
        'El servidor la fragmenta en tres datagramas UDP de 512 octetos',
        'El servidor envía la parte que cabe en 512 octetos con el bit TC activado y el resolvedor repite la consulta por TCP 53',
        'El servidor responde con RCODE 5 (Refused) por exceso de tamaño',
        'El servidor la envía entera, porque el límite de 512 octetos solo se aplica a las consultas',
      ],
      answer: 1,
      explain:
        'Sin EDNS, un mensaje DNS por UDP no pasa de 512 octetos; si la respuesta no cabe, se trunca y se marca con TC, y el cliente repite por TCP en el mismo puerto 53. Partirla en varios datagramas tienta, pero la RFC 1035 no reparte un mensaje entre datagramas: lo que no cabe se trunca. Refused es la negativa por política, por ejemplo a una transferencia, y el límite afecta a cualquier mensaje UDP, no solo a las consultas.',
    },
  ],
};
