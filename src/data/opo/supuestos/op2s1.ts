import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op2s1 — «Teletrabajar sin abrir la puerta» (bloque 2, Infraestructuras de
// comunicaciones; diseño)
//
// Fuente única de cifras y valores: docs/superpowers/sources/2026-11-27-op2-fuentes.md
// (§3 ESP con AES-GCM, §4 IKEv2 y EAP, §5 NAT-T y TCP, §8 MTU y MSS, §9 acceso
// remoto, §10 confianza cero, §17.11 y §17.20) y, para el ENS, las filas de
// op.acc.6 y op.exp.8 de docs/superpowers/sources/2026-11-26-op6-fuentes.md.
// Canon: docs/superpowers/canon/arcedo.md §3, §5, §7b (incidente de op6s2),
// §7c (DNS, proxy y PAC, RADIUS, NTP), §7d (443 a la VIP de los ADC) y §7e
// (el encaminador central termina los túneles IKEv2 en 203.0.113.10, UDP 500
// y 4500).
//
// Decisiones de escenario (hechos nuevos, a registrar en el canon):
// - El Consorcio formaliza el teletrabajo: 150 personas autorizadas, hasta 90
//   conectadas a la vez en la hora punta; portátiles del Consorcio, miembros
//   del dominio, gestionados y con el disco cifrado; algunas conexiones desde
//   hoteles y estaciones.
// - Condiciones del memorando: VPN del personal aparte de la VPN de
//   administración (que sigue como está; su equipo sigue sin fijar), no se toca
//   el reenvío del 443 ni se abre ningún puerto nuevo en 203.0.113.10, y los
//   mismos controles que en la oficina siempre que se pueda.
// - Qué recibe hoy 203.0.113.10: TCP 443 -> VIP 10.20.72.70:443; UDP 500 y
//   4500, el propio encaminador central; el puerto del correo -> su servidor;
//   el resto, descartado. TCP 4500 no está abierto.
// - Ficha del encaminador central (valor del fabricante, sin marca): túneles
//   entre sedes y de acceso remoto en la misma dirección y puertos, con
//   perfiles separados; EAP contra RADIUS externo; entrega dirección interna y
//   DNS; hasta 200 túneles IPsec y 400 Mbit/s de IPsec; encapsulación TCP
//   (RFC 9329) en TCP 4500, desactivada de fábrica.
// - Acceso a Internet de la sede: 300 Mbit/s simétricos. Hora punta medida sin
//   el teletrabajo: 120 Mbit/s de bajada y 60 de subida. Consumo supuesto por
//   persona: recibe 0,5 Mbit/s de aplicaciones internas y 1,5 de Internet; lo
//   que envía no se cuenta.
// - Plan: según el Servicio, de 10.20.54.0 a 10.20.71.255 no hay nada asignado.
// - Diseño resultante (las respuestas): la VPN del personal termina en el
//   encaminador central (IKEv2 con EAP, perfil propio, sin equipo nuevo ni
//   dirección nueva en el CPD); RADIUS 10.20.72.60 con política propia y
//   segundo factor; túnel completo; conjunto de direcciones 10.20.64.0/24;
//   DNS DC1 y DC2; MSS rebajado a 1387 como mucho.
// - Piloto: portátil B en una línea con MTU 1492 (dato de su operador, no de
//   una norma); portátil C en un hotel que bloquea UDP. Conexión de ejemplo de
//   la persona p0142 desde 192.0.2.150, dirección interna 10.20.64.37; el reloj
//   del encaminador iba 220 s atrasado durante el piloto.
// ---------------------------------------------------------------------------

const L_DIR = { label: 'Lección: Direccionamiento IPv4 e IPv6 y cálculo de subredes', href: '/learn/op1m2' };
const L2 = { label: 'Lección: VPN IPsec: arquitectura, IKEv2 y túneles', href: '/learn/op2m2' };
const L3 = { label: 'Lección: Acceso remoto: VPN de cliente, confianza cero y escritorio remoto', href: '/learn/op2m3' };
const L_DNS = { label: 'Lección: DNS en la organización: interno y externo, Active Directory, DNSSEC y DNS cifrado', href: '/learn/op3m2' };
const L_NTP = { label: 'Lección: NTP y la hora', href: '/learn/op3m4' };
const L_CON = { label: 'Lección: Servicios de conectividad: proxies, PAC y WPAD, IPAM y 802.1X', href: '/learn/op3m5' };
const L_ENS = { label: 'Lección: Las medidas del anexo II', href: '/learn/op6m3' };

const RFC4301 = { label: 'RFC 4301: arquitectura de IPsec (contextos separados §4.4, PAD §4.4.3)', href: 'https://www.rfc-editor.org/rfc/rfc4301' };
const RFC7296 = { label: 'RFC 7296: IKEv2 (EAP §2.16, acceso remoto §2.19, NAT-T §2.23)', href: 'https://www.rfc-editor.org/rfc/rfc7296' };
const RFC8247 = { label: 'RFC 8247: algoritmos de IKEv2 (métodos de autenticación §3.1)', href: 'https://www.rfc-editor.org/rfc/rfc8247' };
const RFC3948 = { label: 'RFC 3948: ESP encapsulado en UDP (cabecera UDP de 8 octetos)', href: 'https://www.rfc-editor.org/rfc/rfc3948' };
const RFC4106 = { label: 'RFC 4106: AES-GCM en ESP (crecimiento del paquete, §7)', href: 'https://www.rfc-editor.org/rfc/rfc4106' };
const RFC9293 = { label: 'RFC 9293: TCP (opción MSS, §3.7.1)', href: 'https://www.rfc-editor.org/rfc/rfc9293' };
const RFC1191 = { label: 'RFC 1191: descubrimiento de la MTU del camino', href: 'https://www.rfc-editor.org/rfc/rfc1191' };
const RFC4459 = { label: 'RFC 4459: MTU y fragmentación en túneles (MSS clamping, §3.2)', href: 'https://www.rfc-editor.org/rfc/rfc4459' };
const RFC9395 = { label: 'RFC 9395: IKEv1 pasa a «Historic»', href: 'https://www.rfc-editor.org/rfc/rfc9395' };
const RFC9329 = { label: 'RFC 9329: encapsulación TCP de IKE e IPsec (TCP 4500)', href: 'https://www.rfc-editor.org/rfc/rfc9329' };
const NIST77 = { label: 'NIST SP 800-77 Rev. 1: guía de VPN IPsec (acceso remoto §2.4.2, túnel dividido §7.2.1.2)', href: 'https://csrc.nist.gov/pubs/sp/800/77/r1/final' };
const NIST46 = { label: 'NIST SP 800-46 Rev. 2: teletrabajo y acceso remoto (MFA §3.3.1, túnel dividido §3.3.3)', href: 'https://csrc.nist.gov/pubs/sp/800/46/r2/final' };
const NIST207 = { label: 'NIST SP 800-207: arquitectura de confianza cero (principios §2.1, supuestos §3.4.1)', href: 'https://csrc.nist.gov/pubs/sp/800/207/final' };
const ENS = { label: 'Real Decreto 311/2022 (ENS), anexo II: op.acc.6 y op.exp.8', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191' };

const op2s1: Supuesto = {
  id: 'op2s1',
  track: 'opo',
  sectionIds: ['op2'],
  version: 1,
  title: 'Teletrabajar sin abrir la puerta',
  brief: 'El Consorcio formaliza el teletrabajo y quiere una VPN para el personal sin abrir ningún puerto nuevo en su única dirección pública: decide dónde termina el túnel, cómo se autentica cada persona, qué tráfico va por él, sus direcciones y su DNS, comprueba que el acceso de la sede lo aguanta, ajusta el tamaño de los paquetes y deja rastro de cada sesión.',
  minutes: 60,
  prerequisites: ['op2m2', 'op2m3'],
  dossier: [
    {
      id: 'd-memo',
      title: 'Memorando de la jefatura del Servicio: acceso remoto para el teletrabajo',
      kind: 'memo',
      body: [
        { t: 'p', md: '**De:** jefatura del Servicio de Informática y Comunicaciones · **Para:** equipo de sistemas y redes · **Asunto:** la VPN del personal en teletrabajo' },
        {
          t: 'p',
          md: 'La Gerencia ha aprobado el teletrabajo para parte de la plantilla: **150 personas** autorizadas, que trabajarán desde casa algunos días a la semana. En los días de más teletrabajo calculamos **hasta 90 personas conectadas a la vez** en la hora punta. Desde casa necesitan lo mismo que en la oficina: la aplicación de expedientes, el registro de entrada (las de la oficina de registro) y navegar. Usarán **portátiles del Consorcio**, miembros del dominio, gestionados por el Servicio y con el disco cifrado; nada de equipos personales. Cuando estén de viaje, algunas se conectarán también desde hoteles y estaciones. Antes de comprar o configurar nada, necesito vuestro diseño, con estas condiciones:',
        },
        {
          t: 'list',
          items: [
            'Es una VPN **para el personal**, aparte de la **VPN de administración**, que sigue como está y solo usan los administradores. Lo que pasó el lunes del registro con la cuenta `adm-reg` no puede repetirse por esta otra puerta.',
            'Seguimos con **una sola dirección pública**, `203.0.113.10`, y un solo operador. **No se toca el reenvío del 443** y **no se abre en esa dirección ningún puerto que hoy no esté abierto**: si una opción necesita una puerta nueva, se descarta.',
            'Los túneles de respaldo de las oficinas comarcales **siguen terminando en el encaminador central**, sin cambios.',
            'La Unidad de Seguridad de la Información pide que, desde casa, el personal tenga **los mismos controles que en la oficina** siempre que se pueda.',
            'Comprobad que el acceso a Internet de la sede y el encaminador central aguantan lo que propongáis.',
          ],
        },
      ],
    },
    {
      id: 'd-puertos',
      title: 'Qué recibe hoy la dirección pública 203.0.113.10',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Puerto', 'A dónde va', 'Para qué'],
          rows: [
            ['TCP 443', 'Reenviado a la VIP `10.20.72.70:443` de la pareja de balanceadores ADC1 y ADC2', '`www.arcedo.example` y `sede.arcedo.example`: el ADC elige el certificado por SNI y el grupo por `Host`'],
            ['UDP 500 y UDP 4500', 'Los atiende **el propio encaminador central**: no se reenvían a ningún equipo', 'IKEv2 y NAT-T de los túneles IPsec de respaldo de las tres oficinas comarcales (`198.51.100.31`, `198.51.100.32` y `198.51.100.33`)'],
            ['El puerto del correo', 'Reenviado a su servidor', 'Correo de `correo.arcedo.example`'],
            ['La entrada de la VPN de administración', 'Sigue como está: queda fuera de este diseño y no cambia', 'Administradores'],
            ['Cualquier otro, TCP o UDP', 'Ninguno: el cortafuegos lo descarta', '—'],
          ],
        },
        { t: 'p', md: 'El **TCP 4500 no está abierto** hoy. Los puestos de la sede salen a Internet con esta misma dirección, con PAT; eso no abre ningún puerto de entrada.' },
      ],
    },
    {
      id: 'd-ficha',
      title: 'Ficha del encaminador central (documentación de su fabricante)',
      kind: 'table',
      body: [
        { t: 'p', md: 'Datos de la documentación del fabricante del encaminador central de la sede. Son **valores del fabricante**, no de ninguna norma; aquí no se nombra la marca.' },
        {
          t: 'table',
          headers: ['Aspecto', 'Qué dice la documentación'],
          rows: [
            ['IPsec', 'IKEv2 con ESP. Un mismo equipo, con una misma dirección y en los mismos puertos UDP 500 y 4500, puede atender túneles entre sedes y conexiones de acceso remoto, cada uno con su propio perfil: identidades admitidas, método de autenticación, direcciones y filtros. Mientras atiende IKE en UDP 500 y 4500, no puede reenviar esos mismos puertos a otro equipo.'],
            ['Acceso remoto', 'Autentica a cada persona con EAP dentro de IKEv2 y puede pasar esa autenticación a un servidor RADIUS externo. Entrega a cada cliente una dirección interna de un conjunto que se configura y los servidores DNS que se le indiquen.'],
            ['Capacidad', 'Hasta **200 túneles IPsec simultáneos**, sumando los de entre sedes y los de acceso remoto, y hasta **400 Mbit/s** de tráfico IPsec cifrado.'],
            ['Encapsulación TCP (RFC 9329)', 'La admite en TCP 4500. Viene desactivada de fábrica.'],
          ],
        },
      ],
    },
    {
      id: 'd-cifras',
      title: 'Datos para dimensionar',
      kind: 'table',
      body: [
        { t: 'p', md: 'El acceso y la hora punta salen del contrato y de las mediciones del Servicio. Los consumos por persona son **supuestos para el diseño**, no medidas.' },
        {
          t: 'table',
          headers: ['Dato', 'Valor'],
          rows: [
            ['Acceso a Internet de la sede (un solo operador)', '**300 Mbit/s** simétricos'],
            ['Uso del acceso en la hora punta, medido hoy y **sin contar a quienes van a teletrabajar**', '**120 Mbit/s** de bajada (de Internet hacia la sede) y **60 Mbit/s** de subida (de la sede hacia Internet)'],
            ['Personas conectadas a la vez en la hora punta', '**90**'],
            ['Lo que recibe cada persona en la hora punta (supuesto)', '**0,5 Mbit/s** de las aplicaciones internas y **1,5 Mbit/s** de Internet'],
            ['Lo que envía cada persona (supuesto)', 'Poco: no se cuenta'],
          ],
        },
        {
          t: 'list',
          items: [
            'Todo lo que recibe una persona por la VPN **sale** de la sede hacia Internet: cuenta en la **subida** del acceso de la sede.',
            'Con túnel completo, la navegación de cada persona la trae el proxy desde Internet (**bajada** de la sede) y luego viaja por el túnel hasta casa (**subida**): cruza el acceso dos veces.',
            'No se cuenta lo que añade el túnel (cabeceras de ESP, de UDP y la IP exterior).',
          ],
        },
      ],
    },
    {
      id: 'd-red',
      title: 'Servicios internos y reglas que afectan al teletrabajo',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Equipo o regla', 'Dato'],
          rows: [
            ['DC1 y DC2', '`10.20.72.11` y `10.20.72.12`: controladores del dominio `ad.arcedo.example`, con el DNS interno. Lo que no es suyo lo reenvían a los resolutores del operador (`198.51.100.53` y `198.51.100.54`), que no conocen `ad.arcedo.example`.'],
            ['Cortafuegos de salida', 'Solo deja salir DNS desde DC1 y DC2, y tráfico web solo desde el proxy.'],
            ['Proxy web', '`10.20.72.50`, puerto 8080. Los navegadores de los portátiles del dominio usan el archivo PAC del Consorcio: `DIRECT` para nombres sin dominio, para `.ad.arcedo.example` y para `10.20.*`; todo lo demás, a `PROXY 10.20.72.50:8080`.'],
            ['RADIUS', '`10.20.72.60`: hoy autentica por 802.1X los puestos de la VLAN 10.'],
            ['NTP1 y NTP2', '`10.20.72.41` y `10.20.72.42`. Los equipos que no son del dominio (encaminadores, conmutadores, cortafuegos) toman la hora directamente de ellos.'],
            ['Aplicación de expedientes', '`10.20.72.10`, puerto 443. Sistema de categoría MEDIA, con C e I en MEDIO.'],
            ['Registro electrónico de entrada (personal)', 'VIP `10.20.72.73:443`, nombre `registro.ad.arcedo.example`. Sistema de categoría MEDIA; las solicitudes tienen la confidencialidad en MEDIO.'],
            ['Red de gestión', 'VLAN 99 de la sede, `10.20.99.0/24`.'],
          ],
        },
      ],
    },
    {
      id: 'd-plan',
      title: 'Extracto del plan de direccionamiento (10.20.0.0/16)',
      kind: 'table',
      body: [
        { t: 'p', md: 'Solo las redes en uso alrededor de las opciones que se barajan. Según el Servicio, **de `10.20.54.0` a `10.20.71.255` no hay nada asignado**.' },
        {
          t: 'table',
          headers: ['Red', 'Uso'],
          rows: [
            ['`10.20.8.0/24` y `10.20.9.0/24`', 'Oficinas comarcales'],
            ['`10.20.10.0/24`', 'Sede · VLAN 10 Usuarios; ámbito de DHCP `10.20.10.100`–`10.20.10.250`'],
            ['`10.20.20.0/24`', 'Sede · VLAN 20 Servidores'],
            ['`10.20.30.0/24`', 'Sede · VLAN 30 Voz'],
            ['`10.20.40.0/22`', 'Centro de formación de Valdecierzo'],
            ['`10.20.50.0/23`', 'Edificio anexo · VLAN 50 (puerta virtual `10.20.50.1`)'],
            ['`10.20.72.0/21`', 'CPD (de `10.20.72.0` a `10.20.79.255`)'],
            ['`10.20.99.0/24`', 'Sede · VLAN 99 Gestión'],
          ],
        },
      ],
    },
    {
      id: 'd-piloto',
      title: 'Informe del piloto: tres portátiles durante una semana',
      kind: 'table',
      unlockedBy: 'f3',
      body: [
        { t: 'p', md: 'Antes de abrir el servicio, el Servicio probó la VPN del personal con tres portátiles, con lo decidido hasta ahora. Resumen:' },
        {
          t: 'table',
          headers: ['Portátil', 'Desde dónde', 'Qué pasó'],
          rows: [
            ['A', 'Casa. Según el operador de la persona, su línea tiene una MTU de **1500** octetos', 'Sin incidencias.'],
            ['B', 'Casa. Según el operador de la persona, su línea tiene una MTU de **1492** octetos', 'Conecta y navega, pero al subir un anexo grande a la aplicación de expedientes la transferencia se queda parada: el saludo TCP termina bien y la conexión se cuelga en cuanto los paquetes crecen.'],
            ['C', 'Wifi de un hotel', '`IKE_SA_INIT` sale y no vuelve ninguna respuesta, ni por el 500 ni por el 4500. Con los datos móviles del teléfono, conecta a la primera.'],
          ],
        },
        { t: 'p', md: 'Con A y con B, el encaminador detectó un NAT delante del portátil.' },
      ],
    },
    {
      id: 'd-log-vpn',
      title: 'Registros de una conexión del piloto: encaminador central y RADIUS',
      kind: 'log',
      unlockedBy: 'f4',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Encaminador central · hora de su propio reloj (salida ilustrativa, sin sintaxis de fabricante)',
          text: `09:10:21  IKE_SA_INIT desde 192.0.2.150    NAT delante del cliente: se sigue por UDP 4500
09:10:22  IKE_AUTH  identidad p0142            EAP: se pasa al RADIUS 10.20.72.60
09:10:39  EAP correcto (Access-Accept)         perfil teletrabajo   dirección interna 10.20.64.37
09:10:39  SA hija creada                       selectores 10.20.64.37/32 <-> 0.0.0.0/0`,
        },
        {
          t: 'code',
          lang: 'text',
          title: 'RADIUS 10.20.72.60 · hora del dominio (salida ilustrativa)',
          text: `09:14:02  Access-Request   usuario p0142   cliente: encaminador central   política: teletrabajo
09:14:05  primer factor (contraseña del dominio): correcto
09:14:19  segundo factor: correcto
09:14:19  Access-Accept    usuario p0142`,
        },
      ],
    },
    {
      id: 'd-log-proxy',
      title: 'Registro del proxy en esa misma mañana',
      kind: 'log',
      unlockedBy: 'f4',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Proxy 10.20.72.50 · hora del dominio (salida ilustrativa)',
          text: `09:15:10  10.20.64.37   CONNECT recursos.example:443   200
09:15:12  10.20.64.37   CONNECT recursos.example:443   200`,
        },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'Dónde termina el túnel',
      context:
        'Lo primero es decidir dónde termina el túnel del personal y con qué tecnología. Lee el memorando, lo que recibe hoy `203.0.113.10` y la ficha del encaminador central. Las dos familias de VPN de cliente que se barajan son IPsec con IKEv2, autenticando a cada persona con EAP, y una VPN sobre TLS o DTLS.',
      carry:
        'La VPN del personal termina en el propio encaminador central, en `203.0.113.10` y en los mismos UDP 500 y 4500 que los túneles de las oficinas, con un perfil propio: IKEv2 con EAP, y el encaminador se presenta con su certificado. No hace falta ningún equipo nuevo, no se abre ninguna puerta y el 443 sigue en los ADC. Como los portátiles suelen estar detrás de un NAT, IKE y ESP irán por UDP 4500.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'choice',
          topic: 'op2m3',
          prompt: '¿Dónde termina la VPN del personal y con qué tecnología?',
          options: [
            { id: 'a', text: 'En una pasarela nueva en el CPD, con IKEv2 y EAP, a la que el encaminador reenvía UDP 500 y 4500' },
            { id: 'b', text: 'En una pasarela nueva en el CPD, con una VPN sobre TLS, a la que el encaminador reenvía el TCP 443' },
            { id: 'c', text: 'En el propio encaminador central, con IKEv2 y EAP, en `203.0.113.10` y en los mismos UDP 500 y 4500 que los túneles de las oficinas, con un perfil propio para el personal' },
            { id: 'd', text: 'En una pasarela nueva en el CPD, con una VPN sobre TLS y DTLS en otro puerto que el encaminador le reenvía' },
          ],
          answer: 'c',
          points: 6,
          hint: { text: 'Mira en la tabla de 203.0.113.10 quién atiende cada puerto y vuelve a leer la segunda condición del memorando.', cost: 2 },
          explain:
            'El 443 ya va a la VIP de los ADC y el memorando prohíbe tocarlo: reenviarlo a otra pasarela dejaría sin publicar la web y la sede. UDP 500 y 4500 tampoco se pueden reenviar a otra máquina: los atiende el propio encaminador para los túneles de las oficinas, que según el memorando siguen ahí, y su ficha dice que mientras atiende IKE en esos puertos no puede reenviarlos a otro equipo. Una VPN TLS o DTLS en otro puerto funcionaría, pero abre una puerta nueva, justo lo que el memorando descarta; además, ninguna norma le asigna puerto: es valor del fabricante. Queda el encaminador. Su ficha dice que atiende túneles entre sedes y de acceso remoto en la misma dirección y los mismos puertos, cada uno con su perfil, y es lo que prevé la RFC 4301: una pasarela que da servicio a varios clientes puede mantener contextos separados (§4.4), y la PAD dice qué pares pueden hablar con ella y cómo se autentica cada uno (§4.4.3). No hace falta ningún equipo nuevo.',
          refs: [L3, L2, RFC7296, RFC4301],
        },
        {
          id: 'f1t2',
          kind: 'cite',
          topic: 'op2m3',
          prompt: 'Señala los documentos que, juntos, prueban que ninguna pasarela nueva en el CPD puede atender al personal sin romper algo o sin abrir una puerta nueva.',
          answerSets: [['d-memo', 'd-puertos'], ['d-memo', 'd-puertos', 'd-ficha']],
          points: 4,
          explain:
            'La tabla de `203.0.113.10` dice que el 443 va a los ADC y que el 500 y el 4500 los atiende el propio encaminador. El memorando prohíbe tocar el 443 y abrir puertos nuevos, y mantiene los túneles de las oficinas en el encaminador. Con uno solo no basta: la tabla dice qué está ocupado, y el memorando, que no se puede abrir otra cosa ni mover lo que hay. La ficha del encaminador puede acompañarlos, porque añade que no puede reenviar el 500 y el 4500 mientras atiende IKE, pero sola no dice qué puertos están dados.',
          refs: [L3, L2],
        },
        {
          id: 'f1t3',
          kind: 'multi',
          topic: 'op2m3',
          prompt: 'Sobre ese diseño, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'El encaminador distingue los túneles de las oficinas de las conexiones del personal por la identidad y el método de autenticación de cada par, que es lo que recoge la PAD (RFC 4301 §4.4.3)' },
            { id: 'b', text: 'Con EAP, el encaminador tiene que autenticarse ante el portátil con una firma de clave pública, es decir, con su certificado (RFC 7296 §2.16)' },
            { id: 'c', text: 'Un portátil en casa suele estar detrás de un NAT, así que IKE y ESP acabarán en UDP 4500 (RFC 7296 §2.23)' },
            { id: 'd', text: 'Que muchas redes dejen pasar HTTPS por el 443 (NIST SP 800-77r1 §4.2.2) no ayudaría aquí a una VPN TLS: el 443 de `203.0.113.10` ya es de los ADC' },
            { id: 'e', text: 'Con EAP, el arranque sigue siendo de 4 mensajes, como entre sedes' },
            { id: 'f', text: 'Para que el personal y las oficinas convivan en el mismo encaminador, los túneles de las oficinas tienen que pasar a IKEv1' },
          ],
          answer: ['a', 'b', 'c', 'd'],
          points: 6,
          explain:
            'La PAD identifica qué pares pueden hablar con la pasarela, con qué método se autentica cada uno y qué identidades puede reclamar: las oficinas con su método y el personal con EAP. EAP debe ir acompañado de la firma de clave pública del respondedor, así que el portátil comprueba el certificado del encaminador antes de entregar nada. Detrás de un NAT, la RFC 7296 manda pasar a UDP 4500 y encapsular ESP en UDP. Y el argumento del 443 no sirve cuando el 443 ya está dado. Lo falso: el ejemplo mínimo con EAP de la RFC 7296 son 8 mensajes (un IKE_SA_INIT y tres IKE_AUTH), no 4. Y nadie tiene que volver a IKEv1: la RFC 9395 lo pasó a «Historic», y la separación entre perfiles es cosa de la PAD y de la configuración, no de la versión de IKE.',
          refs: [L3, L2, RFC4301, RFC7296, RFC9395, NIST77],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'Quién entra',
      context:
        'Ahora, quién entra y cómo lo demuestra. Recuerda el lunes del registro: a las 01:58 alguien abrió una sesión en la VPN de administración con la contraseña de `adm-reg`, que según el análisis preliminar se había robado el jueves anterior con un correo de suplantación. En el expediente tienes qué sistemas usará el personal desde casa y con qué niveles.',
      carry:
        'Cada persona se autentica con EAP dentro de IKEv2, y el encaminador pasa esa autenticación al RADIUS `10.20.72.60`, con una política propia del teletrabajo: contraseña del dominio y un segundo factor en un dispositivo separado. Con C e I en MEDIO, op.acc.6 pide un mecanismo de R1 a R4, más R5, R8 y R9. La VPN del personal tiene su propio conjunto de direcciones, su política en el RADIUS (las cuentas de administración no entran por ella) y sus filtros: solo lo que el personal necesita.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'multi',
          topic: 'op2m3',
          prompt: 'El personal usará desde casa la aplicación de expedientes y el registro, con C e I en MEDIO. ¿Qué pide op.acc.6 para su autenticación? Marca **todo** lo que se aplica.',
          options: [
            { id: 'a', text: 'Un mecanismo a elegir entre R1 y R4 (contraseñas, contraseña y otro factor, certificados, o certificados en dispositivo físico)' },
            { id: 'b', text: 'R5 Registro' },
            { id: 'c', text: 'R8 Doble factor para acceso desde o a través de zonas no controladas' },
            { id: 'd', text: 'R9 Acceso remoto' },
            { id: 'e', text: 'R6 Limitación de la ventana de acceso' },
            { id: 'f', text: 'R7 Suspensión por no utilización' },
          ],
          answer: ['a', 'b', 'c', 'd'],
          points: 5,
          explain:
            'op.acc.6 se exige por las dimensiones C, I, T y A; con C e I en MEDIO se lee la columna MEDIO: «+ [R1 o R2 o R3 o R4] + R5 + R8 + R9». R8 y R9 están ya desde BAJO, y R5 se añade en MEDIO. R6 y R7 solo aparecen en ALTO. Una conexión desde casa o desde la wifi de un hotel llega a través de zonas que el Consorcio no controla, que es justo el nombre de R8. Lo que pide R9 por dentro no está resumido en las fuentes de este bloque: basta con saber que se aplica en todos los niveles.',
          refs: [L3, L_ENS, ENS],
        },
        {
          id: 'f2t2',
          kind: 'choice',
          topic: 'op2m3',
          prompt: '¿Cómo se autentica cada persona?',
          options: [
            { id: 'a', text: 'Con EAP dentro de IKEv2: el encaminador pasa la autenticación al RADIUS `10.20.72.60`, con una política propia del teletrabajo que pide la contraseña del dominio y un segundo factor en un dispositivo separado; el encaminador se presenta con su certificado' },
            { id: 'b', text: 'Con una clave compartida (PSK) igual para todo el personal, que la RFC 8247 obliga a implementar, y la contraseña del dominio al abrir la sesión del portátil' },
            { id: 'c', text: 'Solo con la contraseña del dominio, porque los portátiles son del Consorcio y llevan el disco cifrado' },
            { id: 'd', text: 'Con las mismas cuentas, la misma política y el mismo servidor que la VPN de administración, para no tener dos sistemas' },
          ],
          answer: 'a',
          points: 5,
          explain:
            'EAP es la forma que tiene IKEv2 de autenticar a una persona (RFC 7296 §2.16), y la pasarela puede apoyarse en un servidor de autenticación (SP 800-77r1 §2.4.2). Reutilizar el RADIUS `10.20.72.60` evita un sistema nuevo, con una política distinta de la del 802.1X. El segundo factor cubre R8, y tenerlo en un dispositivo separado sigue el criterio que cita la SP 800-46r2 §3.3.1. Qué método EAP y qué segundo factor concretos, lo decide el Consorcio con sus productos. Que la RFC 8247 obligue a implementar la clave compartida no la hace buena para 150 personas: es un secreto común que no identifica a nadie, y quien lo tenga entra. El disco cifrado protege un portátil perdido, no una cuenta robada: con solo la contraseña, lo del lunes se repetiría. Y mezclarla con la VPN de administración es lo contrario de lo que pide el memorando.',
          refs: [L3, L_CON, RFC7296, RFC8247, NIST77, NIST46],
        },
        {
          id: 'f2t3',
          kind: 'multi',
          topic: 'op2m3',
          prompt: '¿Qué separa la VPN del personal de la VPN de administración? Marca **todo** lo que debe hacerse.',
          options: [
            { id: 'a', text: 'Un conjunto propio de direcciones internas para los portátiles, que no se comparta con ninguna otra red' },
            { id: 'b', text: 'Una política propia en el RADIUS que solo admita a las personas autorizadas para teletrabajar; las cuentas de administración no entran por ella' },
            { id: 'c', text: 'Filtros propios: desde esas direcciones, solo la aplicación de expedientes, la VIP del registro, el DNS y el proxy; nunca la VLAN 99 ni los accesos de administración' },
            { id: 'd', text: 'Compartir el conjunto de direcciones con la VPN de administración, para que los filtros sean los mismos' },
            { id: 'e', text: 'Con doble factor ya no hace falta filtrar: quien entra puede alcanzar toda la red `10.20.0.0/16`' },
          ],
          answer: ['a', 'b', 'c'],
          points: 5,
          explain:
            'Separar es que cada VPN tenga sus direcciones, su política y sus filtros: así una regla puede tratar distinto a quien teletrabaja y a quien administra, y una cuenta de administración robada no sirve por esta puerta. Compartir direcciones lo impide, porque el filtro no sabría de qué VPN viene cada paquete. Y el segundo factor dice quién entra, no a qué puede llegar: el acceso con mínimo privilegio es otro principio (SP 800-207 §2.1, principio 3). El lunes del registro, la sesión de `adm-reg` llegó a REG-DOC y a REG-APP.',
          refs: [L3, NIST207],
        },
        {
          id: 'f2t4',
          kind: 'choice',
          topic: 'op2m3',
          prompt: 'Un correo de suplantación consigue la contraseña del dominio de una persona en teletrabajo, como pasó con `adm-reg`. ¿Qué ocurre si el atacante intenta entrar con ella por la VPN del personal?',
          options: [
            { id: 'a', text: 'El RADIUS le pide además el segundo factor, que no tiene: la contraseña sola no abre la sesión, y el intento queda registrado' },
            { id: 'b', text: 'Entra, pero el cifrado de ESP le impide ver nada' },
            { id: 'c', text: 'No llega a intentarlo, porque el doble factor impide que el correo de suplantación robe la contraseña' },
            { id: 'd', text: 'Entra, porque EAP solo comprueba la contraseña' },
          ],
          answer: 'a',
          points: 4,
          explain:
            'Con la política del teletrabajo, el RADIUS no da el Access-Accept hasta que pasan los dos factores: con la contraseña robada el atacante se queda en el primero, y el intento fallido queda en el registro. El segundo factor no evita que roben la contraseña: hace que no baste. ESP protege lo que viaja por el túnel, no decide quién entra. Y EAP es un marco: lo que se comprueba lo fija la política del servidor. Tampoco es una garantía absoluta, y por eso siguen haciendo falta los filtros y el registro.',
          refs: [L3, L_ENS, NIST46],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'Qué va por el túnel',
      context:
        'Queda decidir qué tráfico va por el túnel y comprobar que cabe. Los datos para dimensionar están en el expediente, con la forma de contar; no cuentes lo que añade el túnel.',
      carry:
        'Túnel completo: todo el tráfico de los portátiles va por la VPN, y la navegación sale por el proxy y el cortafuegos de la sede, como en la oficina. En la hora punta, el acceso de la sede llega a 255 Mbit/s de bajada y a 240 de subida (un 85 % y un 80 % de 300), y el encaminador cifra unos 180 Mbit/s de los 400 que admite. Cabe, con poco margen si el teletrabajo crece.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'choice',
          topic: 'op2m3',
          prompt: '¿Túnel completo o túnel dividido para la VPN del personal?',
          options: [
            { id: 'a', text: 'Completo: todo el tráfico de los portátiles va por la VPN y la navegación sale por el proxy y el cortafuegos de la sede, como en la oficina' },
            { id: 'b', text: 'Dividido, porque la NIST SP 800-207 obliga a que los equipos remotos no pasen por la red corporativa' },
            { id: 'c', text: 'Dividido, porque con túnel completo no cabe en el acceso de 300 Mbit/s de la sede' },
            { id: 'd', text: 'Completo, porque el refuerzo R9 de op.acc.6 obliga a usar túnel completo' },
          ],
          answer: 'a',
          points: 6,
          hint: { text: 'Vuelve a leer qué deja salir el cortafuegos y desde dónde se conectará el personal.', cost: 2 },
          explain:
            'Los datos del caso empujan al túnel completo. La Unidad pide los mismos controles que en la oficina, y en la sede la navegación solo sale por el proxy: el cortafuegos no deja salir tráfico web desde otro sitio. Los portátiles se conectarán también desde wifis de hoteles, que son redes no fiables. Y el acceso lo aguanta, como calculas en las tareas siguientes. La SP 800-207 no obliga a nada parecido: supone que un equipo remoto debe poder llegar a los recursos sin pasar antes por la red corporativa (§3.4.1), que es un argumento de diseño, no una norma, y aquí los recursos están en el CPD. El ENS no habla de túneles: R9 se llama «Acceso remoto», y lo que pide por dentro no está resumido en las fuentes de este bloque.',
          refs: [L3, NIST77, NIST46, NIST207],
        },
        {
          id: 'f3t2',
          kind: 'numeric',
          topic: 'op2m3',
          prompt: 'Con túnel completo, en la hora punta, ¿cuántos Mbit/s de **bajada** (de Internet hacia la sede) tendrá el acceso de la sede?',
          answer: 255,
          unit: 'Mbit/s',
          points: 4,
          explain:
            'Con túnel completo, la navegación de cada persona la trae el proxy desde Internet: 90 × 1,5 = 135 Mbit/s más de bajada. Lo de las aplicaciones internas no entra por la bajada, porque sale de la sede hacia casa. Total: 120 + 135 = 255 Mbit/s, un 85 % de los 300. Tienta sumar los 2 Mbit/s de cada persona (120 + 180 = 300), pero esos 180 Mbit/s son de la subida, que parte de los 60 de hoy.',
          refs: [L3],
        },
        {
          id: 'f3t3',
          kind: 'numeric',
          topic: 'op2m3',
          prompt: '¿Y qué porcentaje de los 300 Mbit/s de **subida** (de la sede hacia Internet) se usará en la hora punta? Redondea al entero.',
          answer: 80,
          unit: '%',
          points: 4,
          explain:
            'Todo lo que recibe cada persona por la VPN sale de la sede: 90 × (0,5 + 1,5) = 180 Mbit/s. Con los 60 de hoy, 240 Mbit/s: 240 / 300 = 80 %. Cabe, con 60 Mbit/s de margen en la subida y 45 en la bajada: poco si el teletrabajo crece. Si la navegación saliera directamente desde casa (lo que exigiría además otro PAC, como se ve en la tarea siguiente), solo subirían las aplicaciones internas, 90 × 0,5 = 45 Mbit/s, y la subida se quedaría en 105 Mbit/s, un 35 %.',
          refs: [L3],
        },
        {
          id: 'f3t4',
          kind: 'multi',
          topic: 'op2m3',
          prompt: 'Sobre el túnel dividido, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'La NIST SP 800-77r1 lo desaconseja con fuerza («strongly discouraged»), aunque le reconoce menos tráfico ajeno y menos ancho de banda en la sede' },
            { id: 'b', text: 'La NIST SP 800-46r2 pide plantearse desactivarlo en redes no fiables, como las wifi públicas' },
            { id: 'c', text: 'La NIST SP 800-207 lo prohíbe' },
            { id: 'd', text: 'Con el PAC actual, un túnel dividido que solo llevara `10.20.0.0/16` seguiría mandando la navegación al proxy `10.20.72.50` por el túnel: no ahorraría ancho de banda sin cambiar también el PAC' },
            { id: 'e', text: 'Con túnel dividido, el portátil no puede hacer nunca de puente entre Internet y la red interna' },
          ],
          answer: ['a', 'b', 'd'],
          points: 5,
          explain:
            'Las guías de NIST no dicen lo mismo, y hay que atribuir cada postura: la SP 800-77r1 §7.2.1.2 lo «strongly discouraged» y le reconoce ventajas de tráfico; la SP 800-46r2 §3.3.3 dice que las organizaciones «should consider disabling» en redes no fiables. La SP 800-207 no lo prohíbe: va en sentido contrario, con equipos que llegan a los recursos sin pasar por la red corporativa (§3.4.1). El PAC manda a `PROXY 10.20.72.50:8080` todo lo que no es interno, y esa dirección está en `10.20.0.0/16`, que iría por el túnel: la navegación seguiría entrando por la VPN. Y el riesgo de puente es precisamente del túnel dividido (SP 800-46r2 §3.3.3).',
          refs: [L3, L_CON, NIST77, NIST46, NIST207],
        },
        {
          id: 'f3t5',
          kind: 'numeric',
          topic: 'op2m3',
          prompt: 'Según la ficha del fabricante, el encaminador cifra hasta 400 Mbit/s de tráfico IPsec. Con túnel completo, en la hora punta, ¿qué porcentaje de esa capacidad ocupará el teletrabajo? Redondea al entero.',
          answer: 45,
          unit: '%',
          points: 3,
          explain:
            'Por el túnel viaja todo lo que recibe cada persona: 90 × 2 = 180 Mbit/s (lo que envían no se cuenta). 180 / 400 = 45 %. Los túneles también caben: 90 del personal y 3 de las oficinas, 93 de los 200 que admite (valores del fabricante). Los túneles de respaldo de las oficinas solo llevan tráfico si cae el MPLS, y entonces habría que sumarlo.',
          refs: [L3, L2],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'Direcciones, nombres y paquetes',
      context:
        'Con el túnel decidido, faltan los datos que el encaminador entrega a cada portátil (su dirección interna y los servidores DNS) y el tamaño de los paquetes. En el expediente tienes un extracto del plan de direccionamiento y el informe del piloto.',
      carry:
        'Los portátiles reciben direcciones de `10.20.64.0/24`, que el encaminador central anuncia al resto de la red, y usan como DNS a DC1 y DC2. Con NAT-T y ESP con AES-GCM-16 en el peor caso, el MSS que cabe es 1395 en una línea de 1500 y 1387 en una de 1492: el encaminador lo rebaja a 1387 como mucho. La red del hotel bloqueaba UDP; la encapsulación TCP sería una puerta nueva y queda fuera por ahora, anotada.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'choice',
          topic: 'op2m3',
          prompt: '¿Qué red asignas al conjunto de direcciones internas de los portátiles?',
          options: [
            { id: 'a', text: '`10.20.10.0/24`, la de los usuarios de la sede, para que tengan las mismas reglas que en la oficina' },
            { id: 'b', text: '`10.20.51.0/24`, que queda fuera del ámbito de DHCP del anexo' },
            { id: 'c', text: '`10.20.64.0/24`' },
            { id: 'd', text: '`10.20.76.0/24`, dentro del CPD, para que estén cerca de los servidores' },
          ],
          answer: 'c',
          points: 5,
          explain:
            'Hace falta una red que no se use en ningún otro sitio, para que el encaminador central sea el único camino hacia ella y los filtros sepan que ese tráfico es teletrabajo. `10.20.64.0/24` está en el tramo que el plan da por libre (de `10.20.54.0` a `10.20.71.255`) y tiene 254 direcciones: caben las 150 personas autorizadas aunque se conecten todas. `10.20.10.0/24` es una red conectada en la sede, con su ámbito de DHCP: los portátiles tendrían direcciones de una red que vive en otro sitio, y en los filtros se mezclarían con el personal de la oficina. `10.20.51.0/24` es la mitad alta de `10.20.50.0/23`, la red del anexo, aunque su DHCP no reparta ahí. Y `10.20.76.0/24` está dentro del CPD, `10.20.72.0/21`, que ya está conectado en otro sitio.',
          refs: [L3, L_DIR],
        },
        {
          id: 'f4t2',
          kind: 'choice',
          topic: 'op3m2',
          prompt: '¿Qué servidores DNS entrega el encaminador a los portátiles?',
          options: [
            { id: 'a', text: 'DC1 y DC2, `10.20.72.11` y `10.20.72.12`' },
            { id: 'b', text: 'Los resolutores del operador, `198.51.100.53` y `198.51.100.54`' },
            { id: 'c', text: 'El del encaminador de casa de cada persona' },
            { id: 'd', text: 'El proxy `10.20.72.50`, que ya resuelve los nombres de la navegación' },
          ],
          answer: 'a',
          points: 4,
          explain:
            'Los portátiles son del dominio y tienen que resolver `ad.arcedo.example`, que solo sirven DC1 y DC2, empezando por `registro.ad.arcedo.example`; lo de fuera lo reenvían ellos a los resolutores del operador. Esos resolutores no conocen `ad.arcedo.example`, y además el cortafuegos solo deja salir DNS desde DC1 y DC2: con túnel completo, un portátil que les preguntara directamente se quedaría sin respuesta. El encaminador de casa tampoco conoce la zona interna. Y el proxy no es un servidor DNS: atiende peticiones web en el 8080.',
          refs: [L3, L_DNS],
        },
        {
          id: 'f4t3',
          kind: 'numeric',
          topic: 'op2m2',
          prompt: 'Supón una línea de casa con MTU de 1500 octetos, cabeceras IPv4 de 20 octetos (la exterior y la interior), NAT-T (cabecera UDP de 8 octetos), ESP en modo túnel con AES-GCM-16 en el peor caso (37 octetos) y TCP sin opciones (20 octetos). ¿Cuál es el MSS de TCP máximo que cabe por el túnel?',
          answer: 1395,
          unit: 'octetos',
          points: 4,
          hint: { text: 'Primero el paquete interior más grande (MTU menos lo que añade el túnel); luego, el MSS.', cost: 1 },
          explain:
            '1500 − 20 (IPv4 exterior) − 8 (UDP de NAT-T, RFC 3948) − 37 (ESP con AES-GCM-16, RFC 4106 §7) = 1435 de paquete interior; 1435 − 20 (IPv4 interior) − 20 (TCP, RFC 9293) = 1395. Un portátil en casa casi siempre está detrás de un NAT, así que se cuenta el UDP. Tienta 1403, que es la cuenta sin NAT-T, y 1460, que es lo que queda en 1500 sin ningún túnel.',
          refs: [L2, RFC3948, RFC4106, RFC9293],
        },
        {
          id: 'f4t4',
          kind: 'numeric',
          topic: 'op2m2',
          prompt: 'El portátil B del piloto está en una línea con MTU de 1492 octetos. Con las mismas suposiciones (IPv4 de 20, UDP de NAT-T de 8, ESP de 37 en el peor caso y TCP de 20), ¿qué MSS máximo fijarías en el encaminador para que valga en las dos líneas del piloto?',
          answer: 1387,
          unit: 'octetos',
          points: 4,
          explain:
            '1492 − 20 − 8 − 37 = 1427 de paquete interior, y 1427 − 20 − 20 = 1387. El valor que vale para las dos líneas es el menor: 1387 (en la de 1500 cabría hasta 1395). Encaja con lo que le pasaba a B: el saludo TCP pasa porque sus paquetes son pequeños, y la subida se para en cuanto crecen, que es como se ve un fallo del descubrimiento de la MTU del camino (RFC 1191) cuando se pierden los ICMP. Rebajar el MSS en los extremos del túnel es el «MSS clamping» de la RFC 4459 §3.2: solo sirve para TCP, y el valor y el comando concretos son del fabricante. Que esa línea tenga 1492 es un dato del operador de esa persona, no de ninguna norma.',
          refs: [L2, RFC1191, RFC4459, RFC9293],
        },
        {
          id: 'f4t5',
          kind: 'choice',
          topic: 'op2m3',
          prompt: 'El portátil C, en la wifi de un hotel, envía IKE_SA_INIT y no recibe respuesta ni por el 500 ni por el 4500; con los datos móviles conecta a la primera. ¿Qué haces?',
          options: [
            { id: 'a', text: 'Nada en `203.0.113.10`: lo más probable es que esa red bloquee UDP. La encapsulación TCP lo resolvería, pero es una puerta nueva y NIST la presenta como último recurso; en esas redes se usan los datos móviles y la decisión queda anotada' },
            { id: 'b', text: 'Rebajar más el MSS, porque es un problema de MTU' },
            { id: 'c', text: 'Activar ya la encapsulación TCP, que no abre nada nuevo porque usa el mismo número, el 4500' },
            { id: 'd', text: 'Cambiar el segundo factor, porque el RADIUS está rechazando a C' },
          ],
          answer: 'a',
          points: 3,
          explain:
            'Si IKE_SA_INIT no recibe respuesta, la negociación ni ha empezado: no hay autenticación que falle, y el RADIUS ni se entera. Tampoco apunta a la MTU: los mensajes de IKE que suelen pasar de 1500 octetos son, sobre todo, los IKE_AUTH con certificados (SP 800-77r1 §3.5), e IKE_SA_INIT no lleva certificados; además, el MSS solo toca a TCP dentro del túnel. Que por datos móviles funcione apunta a la red del hotel, y hay redes que bloquean todo UDP (SP 800-77r1 §2.4.2). La RFC 9329 define la encapsulación TCP en TCP 4500; aunque el número coincida, TCP y UDP son puertos distintos, y el TCP 4500 hoy no está abierto: sería una puerta nueva. Abrirla más adelante es una decisión que se puede tomar, documentada.',
          refs: [L3, L2, RFC9329, NIST77],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Dejar rastro',
      context:
        'Último paso: que cada sesión deje rastro y que ese rastro se pueda cruzar con el de los demás equipos. En el expediente tienes los registros de una conexión del piloto: el encaminador central, el RADIUS y el proxy.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'numeric',
          topic: 'op3m4',
          prompt: 'En los registros de la conexión de `p0142`, ¿cuántos segundos va atrasado el reloj del encaminador central respecto a la hora del dominio?',
          answer: 220,
          unit: 's',
          points: 4,
          explain:
            'El mismo hecho aparece dos veces. El encaminador pasa la autenticación al RADIUS a las 09:10:22 según su reloj, y el RADIUS recibe la petición a las 09:14:02; el encaminador da el EAP por bueno a las 09:10:39, y el RADIUS envía el Access-Accept a las 09:14:19. Las dos parejas dan 3 min 40 s: 220 s. El que va mal es el encaminador: el RADIUS y el proxy llevan la hora del dominio y cuentan una historia coherente, con la sesión abierta antes de la primera petición al proxy.',
          refs: [L_NTP, L3],
        },
        {
          id: 'f5t2',
          kind: 'choice',
          topic: 'op3m4',
          prompt: '¿Qué hay que corregir?',
          options: [
            { id: 'a', text: 'Que el encaminador tome la hora directamente de NTP1 y NTP2, como todos los equipos que no son del dominio, y tener en cuenta los 220 s al leer sus registros del piloto' },
            { id: 'b', text: 'Que el encaminador tome la hora de DC1 por la jerarquía de hora de Windows' },
            { id: 'c', text: 'Adelantar a mano 220 s el reloj del encaminador y no tocar nada más' },
            { id: 'd', text: 'Atrasar 220 s los relojes del RADIUS y del proxy para que coincidan con el del encaminador' },
          ],
          answer: 'a',
          points: 3,
          explain:
            'En el Consorcio, los equipos que no son del dominio (encaminadores, conmutadores, cortafuegos) toman la hora directamente de NTP1 y NTP2. La jerarquía de Windows es para los miembros del dominio, y el encaminador no lo es. Ajustarlo a mano lo arregla hoy y deja que se desvíe otra vez mañana. Y mover los relojes buenos estropearía todos los demás registros. Sin una hora común, cruzar el registro de la VPN con el del RADIUS o el del proxy, que es lo que permitió reconstruir el lunes del registro, se convierte en adivinar.',
          refs: [L_NTP, L3],
        },
        {
          id: 'f5t3',
          kind: 'multi',
          topic: 'op2m3',
          prompt: '¿Qué debe registrar el acceso remoto del personal? Marca **todo** lo que procede.',
          options: [
            { id: 'a', text: 'Quién se autenticó, con qué método y con qué resultado, también los intentos fallidos y los del segundo factor' },
            { id: 'b', text: 'Desde qué dirección pública, y a qué hora, empezó y terminó cada sesión' },
            { id: 'c', text: 'Qué dirección interna recibió cada sesión, para poder cruzarla con los registros del proxy y de los servidores' },
            { id: 'd', text: 'La contraseña tecleada en los intentos fallidos, para ver qué probó el atacante' },
            { id: 'e', text: 'Nada de lo que pase dentro del túnel, porque va cifrado' },
          ],
          answer: ['a', 'b', 'c'],
          points: 4,
          explain:
            'Con C e I en MEDIO, op.acc.6 añade R5 Registro, y op.exp.8 pide un registro de auditoría con usuario, fecha y hora, información afectada, tipo y resultado. La dirección interna es la que aparece en el proxy y en los servidores: sin la relación entre sesión y dirección, una línea del proxy no tiene dueño. Guardar contraseñas, aunque sean erróneas, no es un dato de auditoría y crea un riesgo nuevo. Y lo que va cifrado es el tramo de Internet: dentro de la red, el proxy y los servidores ven y registran ese tráfico como el de cualquier puesto.',
          refs: [L3, L_ENS, ENS],
        },
        {
          id: 'f5t4',
          kind: 'cite',
          topic: 'op2m3',
          prompt: 'Señala los documentos que, juntos, permiten decir qué persona hizo las peticiones que el proxy anotó a las 09:15.',
          answerSets: [['d-log-vpn', 'd-log-proxy']],
          points: 3,
          explain:
            'El proxy solo ve `10.20.64.37`. El registro del encaminador dice que esa dirección se dio a la sesión de `p0142`, y el del RADIUS, con qué factores entró. Hacen falta los dos documentos: el proxy sin la VPN no tiene nombre, y la VPN sin el proxy no dice qué se hizo. Con los 220 s corregidos, la primera petición llega 51 s después del Access-Accept. El informe del piloto tienta, pero no habla de esta conexión.',
          refs: [L3, L_NTP],
        },
        {
          id: 'f5t5',
          kind: 'written',
          topic: 'op2m3',
          prompt: 'La Unidad de Seguridad de la Información pide una nota de **120 a 180 palabras** sobre la VPN del personal: cómo se entra, qué pasa con la navegación, qué se registra y qué queda pendiente. Escríbela y compárala con el modelo.',
          words: 180,
          model:
            'El personal en teletrabajo entra por una VPN propia, separada de la de administración, que termina en el encaminador de la sede sin abrir ningún puerto nuevo. Cada persona se identifica con su contraseña y con un segundo factor en otro dispositivo, así que una contraseña robada no basta para entrar. Desde la VPN solo se llega a las aplicaciones que el personal necesita, nunca a la red de gestión.\n\n' +
            'Todo el tráfico va por el túnel: la navegación sale por el proxy de la sede, con los mismos controles que en la oficina. En la hora punta, el acceso a Internet de la sede quedará al 80 % o al 85 % de su capacidad.\n\n' +
            'Se registra quién entra, desde dónde, a qué hora, con qué resultado y qué dirección interna recibe, y todos los equipos comparten la misma hora.\n\n' +
            'Queda pendiente: desde las redes que bloquean UDP, como la de algún hotel, no se puede entrar por ahora; y si el teletrabajo crece, habrá que ampliar la línea.',
          rubric: [
            { id: 'r1', text: 'Explica que es una VPN aparte de la de administración, sin puertos nuevos, y que pide un segundo factor, de modo que una contraseña robada no basta', points: 2 },
            { id: 'r2', text: 'Dice que todo el tráfico va por el túnel y la navegación pasa por el proxy, y que el acceso de la sede lo aguanta con poco margen', points: 2 },
            { id: 'r3', text: 'Cuenta que desde la VPN solo se alcanza lo necesario, nunca la red de gestión', points: 1 },
            { id: 'r4', text: 'Enumera lo que se registra (quién, desde dónde, cuándo, con qué resultado y qué dirección interna) y menciona la hora común', points: 2 },
            { id: 'r5', text: 'Señala lo pendiente (redes que bloquean UDP, crecimiento del teletrabajo) y está escrita para la Unidad: entre 120 y 180 palabras, sin configuración ni siglas sin explicar', points: 2 },
          ],
          points: 9,
          explain:
            'Una buena nota cuenta decisiones y riesgos, no configuración: sobran los puertos, el MSS y las direcciones. Tienta presentar el segundo factor como una garantía absoluta; no lo es, y por eso la nota habla también de lo que se alcanza desde la VPN y de lo que se registra.',
          refs: [L3, L_ENS],
        },
      ],
    },
  ],
  sources: [L2, L3, L_DIR, L_DNS, L_NTP, L_CON, L_ENS, RFC4301, RFC7296, RFC8247, RFC3948, RFC4106, RFC9293, RFC1191, RFC4459, RFC9329, RFC9395, NIST77, NIST46, NIST207, ENS],
};

export default op2s1;
