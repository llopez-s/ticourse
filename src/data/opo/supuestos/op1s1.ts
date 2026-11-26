import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op1s1 — «La oficina comarcal nueva» (supuesto piloto del bloque 1, Redes)
//
// Decisiones de escenario (docs/superpowers/canon/arcedo.md):
// - Una oficina comarcal existente estrena edificio: no es una cuarta oficina.
// - Bloque 10.20.11.0/24, dentro de 10.20.8.0/22; no se dice que sea «el de
//   reserva» ni se toca 10.20.8.0/24 (lección y laboratorio), 10.20.9.0/24
//   (borradores de vídeo) ni 10.20.10.0/24 (VLAN 10 de la sede).
// - WAN de la lección op1m5: VPN de capa 3 sobre MPLS y respaldo por Internet
//   con túnel IPsec hacia la sede (203.0.113.10, su única dirección pública).
//   El enlace PE-CE es un /30 del bloque de la oficina, como en op1m2.
// - Distancias administrativas: valores por defecto de Cisco, como en op1m4.
// ---------------------------------------------------------------------------

const L1 = { label: 'Lección: modelos OSI y TCP/IP (Ethernet y ARP)', href: '/learn/op1m1' };
const L2 = { label: 'Lección: direccionamiento IPv4 e IPv6 y cálculo de subredes', href: '/learn/op1m2' };
const L3 = { label: 'Lección: conmutación Ethernet, VLAN y 802.1Q', href: '/learn/op1m3' };
const L4 = { label: 'Lección: encaminamiento estático, OSPF y BGP', href: '/learn/op1m4' };
const L5 = { label: 'Lección: arquitecturas WAN y WLAN', href: '/learn/op1m5' };
const RFC4632 = { label: 'RFC 4632: CIDR', href: 'https://www.rfc-editor.org/rfc/rfc4632' };
const RFC1918 = { label: 'RFC 1918: direcciones privadas', href: 'https://www.rfc-editor.org/rfc/rfc1918' };
const IEEE8021Q = { label: 'IEEE 802.1Q: puentes y VLAN' };
const RFC9568 = { label: 'RFC 9568: VRRP versión 3', href: 'https://www.rfc-editor.org/rfc/rfc9568' };
const RFC4364 = { label: 'RFC 4364: VPN de capa 3 sobre MPLS', href: 'https://www.rfc-editor.org/rfc/rfc4364' };
const RFC4577 = { label: 'RFC 4577: OSPF entre PE y CE en VPN BGP/MPLS', href: 'https://www.rfc-editor.org/rfc/rfc4577' };

const INCIDENCIA =
  'Tres semanas después de la puesta en marcha, a las 09:40, una avería de la operadora deja caído el acceso MPLS. ' +
  'El túnel IPsec de ENC-B está levantado y ENC-B llega a la sede, pero ningún puesto llega a la sede ni a Internet. ' +
  'En el expediente tienes ahora la configuración de ENC-A y su tabla de rutas durante la incidencia.';

const op1s1: Supuesto = {
  id: 'op1s1',
  track: 'opo',
  sectionIds: ['op1'],
  version: 1,
  title: 'La oficina comarcal nueva',
  brief: 'Diseña la red del edificio nuevo de una oficina comarcal: direccionamiento, VLAN, encaminamiento con respaldo, una avería real y un informe para la gerencia.',
  minutes: 60,
  prerequisites: ['op1m1', 'op1m2', 'op1m3', 'op1m4', 'op1m5'],
  dossier: [
    {
      id: 'd-memo',
      title: 'Memorando de la gerencia: necesidades del edificio nuevo',
      kind: 'memo',
      body: [
        { t: 'p', md: '**De:** Gerencia del Consorcio Provincial de Arcedo · **Para:** Servicio de Informática · **Asunto:** red del edificio nuevo de la oficina comarcal' },
        {
          t: 'p',
          md: 'Otra de nuestras oficinas comarcales, no la del bloque `10.20.8.0/24`, se traslada a un edificio nuevo y queremos estrenar red, diseñada desde cero. Para ese edificio se reserva el bloque `10.20.11.0/24`, dentro del `10.20.8.0/22` de las oficinas comarcales. Estas son las necesidades, en este orden:',
        },
        {
          t: 'table',
          headers: ['#', 'Necesidad', 'Equipos'],
          rows: [
            ['1', 'Puestos de trabajo (PC)', '58'],
            ['2', 'Teléfonos IP (45 de los 58 PC se conectan detrás de un teléfono)', '45'],
            ['3', 'Wifi de invitados', '24 dispositivos a la vez'],
            ['4', 'Impresoras', '9'],
            ['5', 'Cámaras IP', '12'],
          ],
        },
        {
          t: 'list',
          items: [
            'Cada necesidad, su propia red: los invitados y las cámaras no deben compartir red con los puestos.',
            'En cada una de esas cinco subredes, reserva **tres direcciones** para los equipos de red: los dos encaminadores (routers) y la puerta de enlace que comparten.',
            'El enlace con la operadora necesita su propia subred, del tamaño que pida la operadora.',
            'La oficina tiene que seguir trabajando si se apaga un encaminador o si cae el acceso principal, sin tocar la configuración de los ordenadores.',
            'Toda la salida de la oficina, hacia la sede y hacia Internet, pasa por la sede central.',
          ],
        },
      ],
    },
    {
      id: 'd-inventario',
      title: 'Inventario de equipos de red',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Equipo', 'Qué es', 'Detalles'],
          rows: [
            ['ENC-A', 'Encaminador (router), fabricante 1', 'Equipo del cliente (CE) en el acceso MPLS. Un puerto hacia SW-ACC. Admite subinterfaces 802.1Q, VRRP, HSRP y OSPF. Usa las distancias administrativas por defecto de Cisco.'],
            ['ENC-B', 'Encaminador, fabricante 2', 'Acceso a Internet y túnel IPsec hacia la sede. Un puerto hacia SW-ACC. Admite subinterfaces 802.1Q y VRRP; **no admite HSRP**.'],
            ['SW-ACC', 'Conmutador (switch) de acceso de capa 2', '96 puertos con PoE. VLAN 802.1Q, VLAN de voz y RSTP. **No encamina**: no tiene funciones de capa 3.'],
            ['AP-INV', 'Punto de acceso inalámbrico', 'Solo emite la red wifi de invitados.'],
            ['Equipos finales', '58 PC, 45 teléfonos IP, 9 impresoras y 12 cámaras IP', 'Cada teléfono tiene un segundo puerto para conectar el PC detrás.'],
          ],
        },
      ],
    },
    {
      id: 'd-esquema',
      title: 'Esquema de la red del edificio nuevo',
      kind: 'diagram',
      diagram: {
        width: 720,
        height: 430,
        zones: [{ label: 'Oficina comarcal · edificio nuevo', x: 16, y: 112, w: 688, h: 306 }],
        nodes: [
          { id: 'mpls', label: 'Red MPLS', kind: 'cloud', x: 170, y: 50, sub: 'de la operadora' },
          { id: 'sede', label: 'Sede central', kind: 'server', x: 360, y: 50, sub: 'salida a Internet' },
          { id: 'inet', label: 'Internet', kind: 'cloud', x: 550, y: 50 },
          { id: 'enca', label: 'ENC-A', kind: 'router', x: 170, y: 170, sub: 'acceso MPLS' },
          { id: 'encb', label: 'ENC-B', kind: 'router', x: 550, y: 170, sub: 'Internet + IPsec' },
          { id: 'sw', label: 'SW-ACC', kind: 'switch', x: 360, y: 260, sub: 'capa 2 · PoE' },
          { id: 'pc', label: 'Puestos', kind: 'pc', x: 90, y: 370, sub: 'PC y teléfonos IP' },
          { id: 'ap', label: 'AP-INV', kind: 'ap', x: 270, y: 370, sub: 'wifi de invitados' },
          { id: 'cam', label: 'Cámaras', kind: 'pc', x: 450, y: 370, sub: '12 cámaras IP' },
          { id: 'imp', label: 'Impresoras', kind: 'pc', x: 630, y: 370, sub: '9 impresoras' },
        ],
        links: [
          { from: 'mpls', to: 'sede', label: 'VPN MPLS' },
          { from: 'inet', to: 'sede', label: 'túnel IPsec' },
          { from: 'mpls', to: 'enca', label: 'acceso principal' },
          { from: 'inet', to: 'encb', label: 'respaldo' },
          { from: 'enca', to: 'sw', label: 'P95' },
          { from: 'encb', to: 'sw', label: 'P96' },
          { from: 'sw', to: 'pc' },
          { from: 'sw', to: 'ap' },
          { from: 'sw', to: 'cam' },
          { from: 'sw', to: 'imp' },
        ],
      },
    },
    {
      id: 'd-config',
      title: 'Configuración de SW-ACC propuesta por el instalador',
      kind: 'config',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'SW-ACC · extracto (sintaxis ilustrativa: cada fabricante usa sus propias órdenes)',
          text: `# Un puerto de muestra por tipo; el resto de puertos de cada tipo, igual.

interfaz P3                       # puesto con teléfono IP (el PC, detrás)
  modo acceso
  vlan de acceso 112
  vlan de voz 111
  puerto de borde

interfaz P50                      # puesto sin teléfono
  modo acceso
  vlan de acceso 111
  puerto de borde

interfaz P61                      # punto de acceso de invitados
  modo acceso
  vlan de acceso 113

interfaz P70                      # cámara IP
  modo acceso
  vlan de acceso 114

interfaz P85                      # impresora
  modo acceso
  vlan de acceso 115

interfaz P95                      # troncal hacia ENC-A
  modo troncal 802.1Q
  vlan permitidas 111,112,113,114,115
  vlan nativa 999

interfaz P96                      # troncal hacia ENC-B
  modo troncal 802.1Q
  vlan permitidas 111,112,113,115
  vlan nativa 1`,
        },
      ],
    },
    {
      id: 'd-correo',
      title: 'Correo de la operadora: accesos del edificio nuevo',
      kind: 'email',
      body: [
        { t: 'p', md: '**De:** Operadora, servicio a empresas · **Para:** Servicio de Informática del Consorcio · **Asunto:** altas del edificio nuevo' },
        {
          t: 'list',
          items: [
            '**Acceso principal:** VPN de capa 3 sobre MPLS, la misma que usan sus otras sedes, con la clase de servicio para la voz. Se entrega en fibra directamente en el puerto WAN de su CE (ENC-A): si el acceso cae, el puerto cae.',
            '**Enlace PE-CE:** necesitamos una subred **/30** de su direccionamiento. Su CE usará la primera dirección útil y nuestro PE, la segunda.',
            '**Encaminamiento:** el PE intercambiará rutas con su CE por OSPF. Le anunciará las redes de sus demás sedes y la ruta por defecto que origina su sede central, porque su salida a Internet está allí, y aprenderá de su CE las redes de la oficina.',
            '**Acceso de respaldo:** Internet de mejor esfuerzo, sin garantía de retardo, conectado a ENC-B. Dirección `198.51.100.22/30`, puerta de enlace de la operadora `198.51.100.21`. El túnel IPsec hacia su sede (`203.0.113.10`) lo configuran ustedes; la sede ya tiene preparado su extremo.',
          ],
        },
      ],
    },
    {
      id: 'd-acta',
      title: 'Acta de la reunión técnica con el instalador',
      kind: 'acta',
      unlockedBy: 'f2',
      body: [
        { t: 'p', md: 'Reunión del Servicio de Informática con el instalador, una vez corregida la configuración de SW-ACC. Acuerdos:' },
        {
          t: 'list',
          ordered: true,
          items: [
            'ENC-A será el encaminador principal y ENC-B el de respaldo. Cada uno se une a SW-ACC con un troncal 802.1Q: ENC-A por P95 y ENC-B por P96.',
            'En cada una de las cinco subredes de equipos, la **primera** dirección útil será la puerta de enlace que configuran los equipos, la **segunda** será de ENC-A y la **tercera**, de ENC-B.',
            'Si la puerta de enlace se comparte con un protocolo de redundancia, el número de grupo de cada VLAN será el número de la VLAN.',
            'Mientras ENC-A funcione, debe ser él quien atienda la puerta de enlace.',
            'ENC-B enviará todo el tráfico de la oficina por el túnel IPsec hacia la sede; la dirección pública de la sede, `203.0.113.10`, la alcanzará por su acceso a Internet.',
            'Pendiente: decidir dónde vive la puerta de enlace de cada VLAN y cómo se comparte entre los dos encaminadores.',
          ],
        },
      ],
    },
    {
      id: 'd-enca',
      title: 'Configuración de ENC-A tras la puesta en marcha',
      kind: 'config',
      unlockedBy: 'f3',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'ENC-A · extracto (sintaxis ilustrativa: cada fabricante usa sus propias órdenes)',
          text: `interfaz wan0                     # acceso MPLS, enlace con el PE
  ip 10.20.11.209/30
  ospf activado                   # vecino: el PE, 10.20.11.210

# las cinco redes de la oficina se anuncian al PE por OSPF (interfaces pasivas)
ospf pasivo en lan.111 lan.112 lan.113 lan.114 lan.115

interfaz lan.999
  etiqueta 802.1Q 999 nativa      # sin dirección IP

interfaz lan.111                  # Puestos
  etiqueta 802.1Q 111
  ip 10.20.11.2/26
  vrrp 111 ip virtual 10.20.11.1    prioridad 120

interfaz lan.112                  # Voz
  etiqueta 802.1Q 112
  ip 10.20.11.66/26
  vrrp 112 ip virtual 10.20.11.65   prioridad 120

interfaz lan.113                  # Invitados
  etiqueta 802.1Q 113
  ip 10.20.11.130/27
  vrrp 113 ip virtual 10.20.11.129  prioridad 120

interfaz lan.114                  # Cámaras
  etiqueta 802.1Q 114
  ip 10.20.11.162/27
  vrrp 114 ip virtual 10.20.11.161  prioridad 120

interfaz lan.115                  # Impresoras
  etiqueta 802.1Q 115
  ip 10.20.11.194/28
  vrrp 115 ip virtual 10.20.11.193  prioridad 120

# respaldo si cae el acceso MPLS
ruta 0.0.0.0/0   siguiente salto 10.20.1.3   distancia 130`,
        },
      ],
    },
    {
      id: 'd-tabla',
      title: 'Tabla de rutas y registro de ENC-A durante la incidencia',
      kind: 'log',
      unlockedBy: 'f3',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'ENC-A a las 09:42 (salida ilustrativa, sin sintaxis de fabricante)',
          text: `destino            siguiente salto   interfaz   origen      [dist./métrica]
10.20.11.0/26      (directa)         lan.111    conectada   [0/0]
10.20.11.64/26     (directa)         lan.112    conectada   [0/0]
10.20.11.128/27    (directa)         lan.113    conectada   [0/0]
10.20.11.160/27    (directa)         lan.114    conectada   [0/0]
10.20.11.192/28    (directa)         lan.115    conectada   [0/0]

registro
09:40:12  wan0: enlace caído
09:40:12  ospf: vecino 10.20.11.210 perdido; rutas de ospf retiradas
09:40:12  estática 0.0.0.0/0 por 10.20.1.3: siguiente salto inalcanzable, no se instala
09:40:13  vrrp 111-115: sigo como maestro
09:41:30  prueba: ping a 10.20.11.3 por lan.111 -> responde`,
        },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'Direccionamiento del bloque',
      context:
        'Reparte el bloque `10.20.11.0/24` con VLSM, como en la lección: ordena las necesidades **de mayor a menor**, da a cada una el prefijo más largo que la aloje (recuerda que la dirección de red y la de difusión no se asignan) y asígnale el **primer bloque libre** que empiece en un múltiplo de su tamaño. Si dos necesidades piden el mismo tamaño, respeta el orden del memorando. Cuenta las tres direcciones para los equipos de red que pide la gerencia en cada subred de equipos, y el tamaño que pide la operadora para su enlace.',
      carry:
        'Plan correcto: Puestos `10.20.11.0/26`, Voz `10.20.11.64/26`, Invitados `10.20.11.128/27`, Cámaras `10.20.11.160/27`, Impresoras `10.20.11.192/28` y enlace con la operadora `10.20.11.208/30`. Quedan libres 44 direcciones, de `10.20.11.212` a `10.20.11.255`.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'numeric',
          topic: 'op1m2',
          prompt: '¿Qué longitud de prefijo necesita la subred de las cámaras? Escribe solo el número (por ejemplo, 24 para un /24).',
          answer: 27,
          points: 5,
          hint: { text: 'Suma a las cámaras las tres direcciones para los equipos de red que pide el memorando antes de elegir el tamaño.', cost: 1 },
          explain:
            'Las 12 cámaras más las tres direcciones de los equipos de red (dos encaminadores y la puerta de enlace compartida) suman 15 direcciones. Un /28 da 16 − 2 = 14 utilizables, una menos de las necesarias; el siguiente tamaño, /27, da 30. El /28 tienta porque las 12 cámaras caben solas en él: falla en cuanto se cuentan los equipos de red.',
          refs: [L2, RFC4632],
        },
        {
          id: 'f1t2',
          kind: 'table',
          topic: 'op1m2',
          prompt: 'Completa el plan VLSM: dirección de red, prefijo y dirección de difusión de cada subred. Las filas siguen el orden del memorando, no el de asignación.',
          fields: [
            { id: 'red', label: 'Dirección de red', options: ['10.20.11.0', '10.20.11.64', '10.20.11.128', '10.20.11.160', '10.20.11.176', '10.20.11.192', '10.20.11.208', '10.20.11.224'] },
            { id: 'prefijo', label: 'Prefijo', options: ['/25', '/26', '/27', '/28', '/29', '/30'] },
            { id: 'difusion', label: 'Difusión', options: ['10.20.11.63', '10.20.11.127', '10.20.11.159', '10.20.11.175', '10.20.11.191', '10.20.11.207', '10.20.11.211', '10.20.11.223'] },
          ],
          rows: [
            { id: 'puestos', label: 'Puestos (58)', answer: { red: '10.20.11.0', prefijo: '/26', difusion: '10.20.11.63' } },
            { id: 'voz', label: 'Teléfonos IP (45)', answer: { red: '10.20.11.64', prefijo: '/26', difusion: '10.20.11.127' } },
            { id: 'invitados', label: 'Wifi de invitados (24)', answer: { red: '10.20.11.128', prefijo: '/27', difusion: '10.20.11.159' } },
            { id: 'impresoras', label: 'Impresoras (9)', answer: { red: '10.20.11.192', prefijo: '/28', difusion: '10.20.11.207' } },
            { id: 'camaras', label: 'Cámaras IP (12)', answer: { red: '10.20.11.160', prefijo: '/27', difusion: '10.20.11.191' } },
            { id: 'enlace', label: 'Enlace PE-CE con la operadora', answer: { red: '10.20.11.208', prefijo: '/30', difusion: '10.20.11.211' } },
          ],
          points: 12,
          explain:
            'Con las tres direcciones de los equipos de red, Puestos (61) y Voz (48) piden un /26 (62 utilizables); Invitados (27) y Cámaras (15), un /27 (30); Impresoras (12), un /28 (14); y la operadora pide un /30. De mayor a menor y, a igual tamaño, en el orden del memorando: Puestos `.0/26` (difusión `.63`), Voz `.64/26` (`.127`), Invitados `.128/27` (`.159`), Cámaras `.160/27` (`.191`), Impresoras `.192/28` (`.207`) y el enlace `.208/30` (`.211`). La trampa es dejar las cámaras en un /28: entonces las impresoras subirían a `.160` y las cámaras caerían en `.176`, sin sitio para sus equipos de red. También tienta asignar en el orden del memorando y no por tamaño, lo que deja huecos, porque cada subred tiene que empezar en un múltiplo de su tamaño.',
          refs: [L2, RFC4632, RFC1918],
        },
        {
          id: 'f1t3',
          kind: 'numeric',
          topic: 'op1m2',
          prompt: 'Con el plan terminado, ¿cuántas direcciones del bloque `10.20.11.0/24` quedan libres para crecer?',
          answer: 44,
          unit: 'direcciones',
          points: 4,
          explain:
            'El plan ocupa 64 + 64 + 32 + 32 + 16 + 4 = 212 direcciones, de `10.20.11.0` a `10.20.11.211`. Quedan de `10.20.11.212` a `10.20.11.255`: 256 − 212 = 44. Tienta responder 42 restando una red y una difusión, pero eso solo se hace dentro de una subred ya definida; aquí se cuentan direcciones del bloque sin repartir.',
          refs: [L2],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'VLAN y troncales 802.1Q',
      context:
        'El servicio de sistemas fija la numeración de las VLAN: **111** Puestos, **112** Voz, **113** Invitados, **114** Cámaras y **115** Impresoras. Como en la sede, la **VLAN 999** existe solo para ser la nativa de los troncales y no tiene ningún puerto de acceso. El instalador ha dejado en el expediente su propuesta de configuración para SW-ACC: revísala antes de darla por buena.',
      carry:
        'Configuración correcta: puertos de puesto en acceso 111, con VLAN de voz 112 donde hay teléfono; AP de invitados en 113, cámaras en 114 e impresoras en 115; los troncales P95 (ENC-A) y P96 (ENC-B) permiten de la 111 a la 115 con la nativa 999 en los dos extremos. El instalador ya ha corregido sus dos fallos: en el puerto con teléfono había cruzado la VLAN de datos con la de voz, y P96 no dejaba pasar la 114 y tenía la nativa en 1.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'table',
          topic: 'op1m3',
          prompt: 'Indica la configuración **correcta** de cada tipo de puerto de SW-ACC (que no tiene por qué coincidir con la del instalador).',
          fields: [
            { id: 'modo', label: 'Modo del puerto', options: ['acceso', 'acceso con VLAN de voz', 'troncal 802.1Q'] },
            { id: 'nativa', label: 'VLAN de las tramas sin etiqueta', options: ['111', '112', '113', '114', '115', '999'] },
          ],
          rows: [
            { id: 'tel', label: 'Puesto con teléfono IP (el PC conectado al teléfono)', answer: { modo: 'acceso con VLAN de voz', nativa: '111' } },
            { id: 'pc', label: 'Puesto sin teléfono', answer: { modo: 'acceso', nativa: '111' } },
            { id: 'ap', label: 'AP-INV (solo wifi de invitados)', answer: { modo: 'acceso', nativa: '113' } },
            { id: 'cam', label: 'Cámara IP', answer: { modo: 'acceso', nativa: '114' } },
            { id: 'imp', label: 'Impresora', answer: { modo: 'acceso', nativa: '115' } },
            { id: 'p95', label: 'P95, enlace con ENC-A', answer: { modo: 'troncal 802.1Q', nativa: '999' } },
            { id: 'p96', label: 'P96, enlace con ENC-B', answer: { modo: 'troncal 802.1Q', nativa: '999' } },
          ],
          points: 7,
          explain:
            'Con VLAN de voz el puerto sigue siendo de acceso para el PC, que envía sin etiqueta y queda en la 111, mientras el teléfono etiqueta sus tramas con la 112. El instalador lo puso al revés (acceso 112, voz 111) y metió los PC en la red de voz: es el error que tienta, porque parece que «el teléfono va primero». El AP solo emite la red de invitados, así que le basta un puerto de acceso en la 113; un troncal solo haría falta si emitiera varias redes. Los dos troncales llevan la nativa 999 en los dos extremos: en un troncal, lo que llega sin etiqueta va a la nativa.',
          refs: [L3, IEEE8021Q],
        },
        {
          id: 'f2t2',
          kind: 'choice',
          topic: 'op1m3',
          prompt: '¿Por qué la norma del Consorcio usa como nativa de los troncales la VLAN 999, sin puertos de acceso y la misma en los dos extremos?',
          options: [
            { id: 'a', text: 'Porque IEEE 802.1Q obliga a usar la VLAN 999 como nativa en todos los troncales' },
            { id: 'b', text: 'Para que ningún equipo pueda colar tramas por la nativa con un doble etiquetado y para que el tráfico sin etiqueta no salte de una VLAN a otra' },
            { id: 'c', text: 'Porque los troncales descartan las tramas sin etiqueta y así no se pierde tráfico de usuario' },
            { id: 'd', text: 'Para que las tramas de voz tengan más prioridad que las de datos' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'Si la nativa coincide con la VLAN de algún puerto de acceso, un equipo de ese puerto puede enviar tramas con doble etiqueta: el primer conmutador quita la exterior y el segundo entrega la trama en la VLAN de la interior. Con una nativa sin equipos ese ataque no tiene origen, y con la misma en los dos extremos el tráfico sin etiqueta no cambia de VLAN. La primera opción tienta porque la 999 es «la del Consorcio», pero el número lo elige cada organización: «VLAN nativa» ni siquiera es un término del IEEE, sino de los fabricantes (el estándar habla del PVID). Las tramas sin etiqueta no se descartan: van a la nativa.',
          refs: [L3, IEEE8021Q],
        },
        {
          id: 'f2t3',
          kind: 'cite',
          topic: 'op1m3',
          prompt: 'El instalador da por buena su propuesta. Señala el documento que prueba que, si ENC-A se apagara, las cámaras se quedarían sin puerta de enlace aunque ENC-B siguiera encendido.',
          answerSets: [['d-config']],
          points: 5,
          explain:
            'En la configuración de SW-ACC, el troncal P96 hacia ENC-B solo permite las VLAN 111, 112, 113 y 115: la 114, la de las cámaras, no pasa, así que ENC-B nunca recibiría sus tramas. Es una avería de VLAN muy habitual y se ve en la lista de VLAN permitidas del troncal, no en los puertos de acceso (el de las cámaras, P70, está bien). El esquema tienta porque dibuja el enlace P96, pero no dice qué VLAN transporta.',
          refs: [L3],
        },
        {
          id: 'f2t4',
          kind: 'choice',
          topic: 'op1m3',
          prompt: 'Los teléfonos marcan sus tramas con una prioridad alta para que los conmutadores las atiendan antes. ¿En qué campo de la etiqueta 802.1Q viaja esa prioridad?',
          options: [
            { id: 'a', text: 'En el VID, de 12 bits, que también identifica la VLAN' },
            { id: 'b', text: 'En el DEI, de 1 bit' },
            { id: 'c', text: 'En el PCP, de 3 bits: valores de 0 a 7' },
            { id: 'd', text: 'En el TPID, de 16 bits, que vale 0x8100' },
          ],
          answer: 'c',
          points: 4,
          explain:
            'La prioridad va en el PCP (Priority Code Point), de 3 bits: ocho clases, de 0 a 7; es lo que se conoce como 802.1p. El DEI tienta porque también tiene que ver con la congestión, pero solo marca qué tramas se pueden descartar antes. El VID identifica la VLAN y el TPID (0x8100) indica que la trama va etiquetada.',
          refs: [L3, IEEE8021Q],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'Encaminamiento y respaldo',
      context:
        'Toca el encaminamiento. Las cinco VLAN tienen que hablar entre sí y con la sede, y la gerencia quiere que la oficina siga trabajando si se apaga un encaminador o si cae el acceso MPLS. Hay un acta nueva en el expediente. Las distancias administrativas de este supuesto son los valores por defecto de Cisco (conectada 0, estática 1, OSPF 110), que no están en ningún estándar.',
      carry:
        'Puertas de enlace en subinterfaces 802.1Q de ENC-A y ENC-B, compartidas con VRRP, con ENC-A como maestro mientras funcione. ENC-A aprende del PE por OSPF la ruta por defecto y, para cuando caiga el acceso MPLS, lleva como respaldo una estática flotante por defecto hacia ENC-B. ENC-B lo envía todo por el túnel IPsec hacia la sede.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'choice',
          topic: 'op1m4',
          prompt: 'Con el inventario y el acta, ¿dónde pones la puerta de enlace de cada VLAN?',
          options: [
            { id: 'a', text: 'En subinterfaces 802.1Q de ENC-A y ENC-B, que comparten en cada VLAN una IP virtual con VRRP' },
            { id: 'b', text: 'En subinterfaces 802.1Q de ENC-A y ENC-B, que comparten en cada VLAN una IP virtual con HSRP' },
            { id: 'c', text: 'En una interfaz virtual de VLAN (SVI) por VLAN en SW-ACC, compartida con VRRP' },
            { id: 'd', text: 'En subinterfaces de ENC-A; si ENC-A cae, se cambia a mano la puerta de enlace de cada equipo por la dirección de ENC-B' },
          ],
          answer: 'a',
          points: 5,
          explain:
            'SW-ACC es de capa 2 y no encamina, así que la puerta de enlace tiene que vivir en los encaminadores, con una subinterfaz por VLAN sobre su troncal (*router-on-a-stick*). Para que la compartan sin tocar los equipos hace falta un protocolo de redundancia de primer salto, y como ENC-B es de otro fabricante y no admite HSRP, que es propietario de Cisco, queda VRRP, el estándar abierto. HSRP tienta porque ENC-A sí lo admite, pero los dos encaminadores tienen que hablar el mismo protocolo. Cambiar la puerta de enlace a mano incumple el requisito de la gerencia.',
          refs: [L4, L3, RFC9568],
        },
        {
          id: 'f3t2',
          kind: 'choice',
          topic: 'op1m4',
          prompt: 'En la VLAN 111 el grupo VRRP es el 111, como fija el acta. ¿Qué dirección MAC verán los PC de esa VLAN cuando pregunten por ARP por su puerta de enlace?',
          options: [
            { id: 'a', text: '00-00-5E-00-01-111' },
            { id: 'b', text: 'La MAC real de la interfaz de ENC-A' },
            { id: 'c', text: '00-00-5E-00-01-11' },
            { id: 'd', text: '00-00-5E-00-01-6F' },
          ],
          answer: 'd',
          points: 4,
          explain:
            'En IPv4, la MAC virtual de VRRP empieza por 00-00-5E-00-01 y su último byte es el número del grupo (VRID). Un byte se escribe con dos cifras hexadecimales, y 111 en decimal es 6F (6 × 16 + 15). El maestro responde al ARP de la IP virtual con esa MAC, no con la suya: así, si ENC-B toma el relevo, los PC no tienen que actualizar nada. «01-111» no es un byte válido, y «01-11» sería el grupo 17, porque copia las cifras decimales como si fueran hexadecimales.',
          refs: [L4, RFC9568],
        },
        {
          id: 'f3t3',
          kind: 'order',
          topic: 'op1m4',
          prompt: 'Ordena lo que pasa cuando cae el acceso MPLS con el diseño previsto: primero lo que ocurre en ENC-A y después el viaje del primer paquete que un PC envía a la sede.',
          items: [
            { id: 'o4', text: 'El PC envía el paquete a su puerta de enlace, 10.20.11.1, que sigue atendiendo ENC-A como maestro de VRRP' },
            { id: 'o2', text: 'Las rutas aprendidas por OSPF, entre ellas la ruta por defecto, salen de la tabla de ENC-A' },
            { id: 'o6', text: 'ENC-B lo cifra y lo envía por el túnel IPsec hacia 203.0.113.10, la sede' },
            { id: 'o1', text: 'El puerto wan0 de ENC-A cae y se pierde la adyacencia OSPF con el PE' },
            { id: 'o5', text: 'ENC-A reenvía el paquete a ENC-B, 10.20.11.3' },
            { id: 'o3', text: 'La estática flotante por defecto hacia ENC-B, con distancia 130, entra en la tabla de ENC-A' },
          ],
          answer: ['o1', 'o2', 'o3', 'o4', 'o5', 'o6'],
          points: 6,
          explain:
            'Al caer el puerto se pierde el vecino OSPF y con él sus rutas; sin la ruta de distancia 110, la estática de 130 «sale a flote». Después llega el paquete: el PC no sabe nada de esto y lo envía a la IP virtual, que sigue en ENC-A porque VRRP solo vigila que el maestro envíe sus anuncios, no el estado de su acceso WAN (algunos fabricantes permiten que la prioridad baje al caer una interfaz, pero es una función suya, no del estándar, y aquí no está configurada). ENC-A lo pasa a ENC-B por la propia VLAN y ENC-B lo mete en el túnel. Tienta poner a ENC-B como primer receptor del paquete, como si VRRP cambiara de maestro al caer el acceso: no lo hace, y por eso la estática flotante de ENC-A es imprescindible.',
          refs: [L4, L5, RFC9568, RFC4577],
        },
        {
          id: 'f3t4',
          kind: 'multi',
          topic: 'op1m4',
          prompt: 'Sobre la estática flotante de ENC-A (valores por defecto de Cisco), marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'Mientras el PE anuncie la ruta por defecto por OSPF (110), la estática con distancia 130 no aparece en la tabla' },
            { id: 'b', text: 'Con la distancia por defecto de las estáticas (1), ganaría a la ruta por defecto de OSPF y el tráfico hacia Internet iría por ENC-B aunque el acceso MPLS funcionara' },
            { id: 'c', text: 'Con distancia 255 no se instalaría nunca, ni siquiera al caer el acceso MPLS' },
            { id: 'd', text: 'VRRP pasa el papel de maestro a ENC-B en cuanto cae el acceso MPLS de ENC-A' },
            { id: 'e', text: 'La distancia administrativa viaja en los anuncios de OSPF, así que el PE también la conoce' },
            { id: 'f', text: 'Para que sea de respaldo hay que darle un prefijo más largo que el de la ruta por defecto de OSPF' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'Una estática flotante lleva una distancia mayor que la del protocolo al que respalda: con 130 pierde frente a OSPF (110) y solo entra al desaparecer esa ruta; con 1 ganaría siempre a la ruta por defecto de OSPF y todo lo que solo encaja en ella, como el tráfico hacia Internet, iría por el respaldo (las redes de las otras sedes seguirían por MPLS, porque llegan con prefijos más largos); y con 255 (inalcanzable) no entraría nunca. La distancia administrativa es un valor local de cada fabricante y no viaja en ningún protocolo. Un prefijo más largo tienta porque parece «más preciso», pero el prefijo más largo se impone siempre y el tráfico que cubriera iría por el respaldo de forma permanente. VRRP, tal como lo define el estándar, no sabe nada del acceso WAN.',
          refs: [L4],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'Una avería real',
      context: 'La gerencia aprobó el diseño con subinterfaces en ENC-A y ENC-B y VRRP, y el instalador lo montó así. ' + INCIDENCIA,
      variants: [
        {
          when: { task: 'f3t1', chose: 'a' },
          context: 'La gerencia aprobó tu diseño, subinterfaces en ENC-A y ENC-B con VRRP, y el instalador lo montó tal cual. ' + INCIDENCIA,
        },
        {
          when: { task: 'f3t1', chose: 'b' },
          context: 'Propusiste HSRP, pero es propietario de Cisco y ENC-B, de otro fabricante, no lo admite. La gerencia aprobó el mismo diseño con VRRP, el estándar abierto, y así se montó. ' + INCIDENCIA,
        },
        {
          when: { task: 'f3t1', chose: 'c' },
          context: 'Propusiste SVI en SW-ACC, pero el inventario lo describe como un conmutador de capa 2 que no encamina. La gerencia aprobó subinterfaces en ENC-A y ENC-B con VRRP, y así se montó. ' + INCIDENCIA,
        },
        {
          when: { task: 'f3t1', chose: 'd' },
          context: 'Tu propuesta obligaba a tocar a mano cada equipo si caía ENC-A, justo lo que la gerencia quería evitar. Se aprobaron subinterfaces en ENC-A y ENC-B con VRRP, y así se montó. ' + INCIDENCIA,
        },
      ],
      carry:
        'Causa: la estática flotante de ENC-A apuntaba a `10.20.1.3`, una dirección que no está en ninguna red conectada de ENC-A, así que no podía instalarse al caer OSPF. Corrección: siguiente salto `10.20.11.3` (ENC-B) con distancia 130. Cuando vuelve el acceso MPLS, la ruta por defecto vuelve a ser la de OSPF (110).',
      tasks: [
        {
          id: 'f4t1',
          kind: 'cite',
          topic: 'op1m4',
          prompt: 'Señala los documentos que, juntos, prueban que la ruta de respaldo de ENC-A no apunta a ENC-B.',
          answerSets: [['d-enca', 'd-acta'], ['d-tabla', 'd-acta']],
          points: 5,
          hint: { text: 'Necesitas un documento con el siguiente salto de la ruta y otro con la dirección que se acordó para ENC-B.', cost: 1 },
          explain:
            'La configuración de ENC-A, y también el registro de la incidencia, muestran el siguiente salto de la estática: `10.20.1.3`. El acta fija que ENC-B tiene la tercera dirección útil de cada subred, es decir, `10.20.11.3` en Puestos. Hace falta uno de esos dos documentos y el acta: con la configuración sola sabes a dónde apunta la ruta, pero no a dónde debería apuntar. El esquema y el inventario tientan, pero no llevan direcciones: muestran que los dos encaminadores comparten las VLAN, y solo el acta dice qué dirección tiene ENC-B.',
          refs: [L4],
        },
        {
          id: 'f4t2',
          kind: 'multi',
          topic: 'op1m4',
          prompt: 'Marca **todo** lo que demuestran la tabla de rutas y el registro de ENC-A.',
          options: [
            { id: 'a', text: 'Las rutas de OSPF, la ruta por defecto incluida, desaparecieron al caer wan0' },
            { id: 'b', text: 'La estática flotante no ha entrado en la tabla' },
            { id: 'c', text: 'La estática no puede instalarse porque su siguiente salto no se alcanza con ninguna ruta que le queda a ENC-A: no está en ninguna de sus redes conectadas' },
            { id: 'd', text: 'ENC-B ha tomado el papel de maestro de VRRP' },
            { id: 'e', text: 'La estática no entra porque su distancia (130) es mayor que la de OSPF (110)' },
            { id: 'f', text: 'Los puestos no llegan a la sede porque ENC-A ha perdido la ruta hacia su propia subred' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'El registro muestra la caída de wan0, la pérdida del vecino OSPF y que la estática tiene el «siguiente salto inalcanzable» y no se instala; la tabla solo conserva las cinco redes conectadas. Un encaminador solo instala una estática si sabe llegar a su siguiente salto, y `10.20.1.3` no cae en ninguna red de ENC-A ni en ninguna ruta que le quede. La distancia 130 tienta como explicación, pero solo compite con la ruta de OSPF, que ya no existe. ENC-A sigue siendo maestro de VRRP (lo dice el registro), y las redes de la oficina siguen en la tabla como conectadas.',
          refs: [L4, L1, RFC4577],
        },
        {
          id: 'f4t3',
          kind: 'choice',
          topic: 'op1m4',
          prompt: '¿Qué corrección aplicas en ENC-A?',
          options: [
            { id: 'a', text: 'Bajar la distancia de la estática a 1 para que tenga preferencia' },
            { id: 'b', text: 'Cambiar el siguiente salto de la estática a 10.20.11.3 y mantener la distancia 130' },
            { id: 'c', text: 'Añadir una ruta hacia 10.20.1.0/24 por wan0' },
            { id: 'd', text: 'Subir a 130 la prioridad VRRP de ENC-B' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'El fallo es el siguiente salto: con `10.20.11.3`, la dirección de ENC-B en Puestos, la ruta se puede instalar y con 130 sigue flotando por debajo de OSPF. Bajarla a 1 tienta porque parece darle prioridad, pero no arregla el salto inalcanzable y, una vez corregido el salto, ganaría a la ruta por defecto de OSPF: el tráfico hacia Internet iría siempre por el respaldo aunque el acceso MPLS funcionara. Una ruta por wan0 no sirve con wan0 caído. Con prioridad 130, ENC-B superaría los 120 de ENC-A y se quedaría siempre como maestro, en contra del acta.',
          refs: [L4, RFC9568],
        },
        {
          id: 'f4t4',
          kind: 'numeric',
          topic: 'op1m4',
          prompt: 'Corregida la ruta, la operadora repara el acceso MPLS y vuelve la adyacencia OSPF. ¿Qué distancia administrativa tiene la ruta por defecto que queda instalada en ENC-A? (valores por defecto de Cisco)',
          answer: 110,
          points: 4,
          explain:
            'El PE vuelve a anunciar la ruta por defecto por OSPF, con distancia 110, que gana a la estática de 130 hacia el mismo prefijo `0.0.0.0/0`: la estática sale de la tabla sola y el tráfico vuelve al acceso MPLS sin tocar nada. Responder 130 es pensar que la ruta de respaldo se queda hasta que alguien la quite; responder 1 es confundir la estática flotante con una estática normal.',
          refs: [L4],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Informe para la gerencia',
      context:
        'La gerencia pide un informe breve, sin configuración, que pueda leer cualquiera del equipo directivo: qué se ha montado, por qué, qué pasó en la avería y qué se hace para que no se repita.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'written',
          topic: 'op1m5',
          prompt: 'Redacta el informe para la gerencia en **120 a 180 palabras**. Después, compáralo con el modelo y marca los criterios que cumple.',
          words: 180,
          model:
            'La oficina usa el bloque 10.20.11.0/24, repartido en cinco redes, una por uso: puestos, telefonía, wifi de invitados, cámaras e impresoras, más un pequeño enlace con la operadora. Sobran 44 direcciones para crecer.\n\n' +
            'Cada red es una red local virtual (VLAN) separada de las demás. Así, un problema en la wifi de invitados o en una cámara no alcanza a los puestos, y todo lo que pasa de una red a otra atraviesa un encaminador, donde se puede controlar.\n\n' +
            'Hay dos encaminadores que comparten la puerta de enlace con un protocolo estándar (VRRP): si uno se apaga, el otro la atiende sin tocar los ordenadores. La salida principal es la red privada de la operadora (MPLS); si cae, el tráfico pasa solo a un túnel cifrado por Internet.\n\n' +
            'En la primera avería, el respaldo falló porque la ruta de reserva apuntaba a una dirección equivocada. Ya está corregida. Propongo probar el respaldo cada trimestre, desconectando el acceso principal fuera del horario de atención.',
          rubric: [
            { id: 'r1', text: 'Explica cómo se reparte el bloque (una red por uso) y que queda margen para crecer', points: 4 },
            { id: 'r2', text: 'Justifica la separación en VLAN con un beneficio que entienda la gerencia (contener problemas, controlar el paso entre redes)', points: 4 },
            { id: 'r3', text: 'Describe la doble protección: puerta de enlace compartida entre dos encaminadores y salida de respaldo por un túnel cifrado que entra sola', points: 4 },
            { id: 'r4', text: 'Cuenta la avería con su causa (ruta de respaldo hacia una dirección equivocada), dice que está corregida y propone probar el respaldo', points: 4 },
            { id: 'r5', text: 'Está escrito para la gerencia: entre 120 y 180 palabras, sin configuración ni jerga innecesaria, con las siglas que usa explicadas', points: 3 },
          ],
          points: 19,
          explain:
            'Un buen informe para la gerencia cuenta decisiones y consecuencias, no órdenes de configuración: qué se ha montado, qué protege y qué falló. Tienta llenarlo de prefijos, VLAN y distancias administrativas, pero eso va en la documentación técnica; aquí cada dato tiene que responder a «¿y eso qué nos aporta?».',
          refs: [L2, L3, L4, L5],
        },
      ],
    },
  ],
  sources: [L1, L2, L3, L4, L5, RFC1918, RFC4632, IEEE8021Q, RFC9568, RFC4364, RFC4577],
};

export default op1s1;
