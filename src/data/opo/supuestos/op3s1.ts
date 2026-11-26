import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op3s1 — «El edificio anexo de la sede» (bloque 3, Servicios de red; diseño)
//
// Fuente única: docs/superpowers/sources/2026-11-26-op3-fuentes.md. Tres citas
// literales de RFC que el dossier no recoge (anotadas en el informe):
// RFC 1035 §3.5 (orden inverso de IN-ADDR.ARPA), RFC 1542 §4.1.1 (giaddr = la
// dirección de la interfaz por la que llegó la petición) y RFC 5905 §3 (cada
// nivel secundario, un estrato más que el anterior).
//
// Decisiones de escenario (hechos nuevos, a registrar en el canon):
// - La sede central estrena un edificio anexo, unido por fibra a los dos
//   conmutadores de distribución de capa 3 de la sede (DIST1 y DIST2).
// - VLAN 50 «Usuarios del anexo», red 10.20.50.0/23 (libre en el canon: el dato
//   de ejercicio 10.20.32.0/20 acaba en 10.20.47.255). Solo en esta VLAN: puerta
//   virtual 10.20.50.1 (VRRP), SVI de DIST1 10.20.50.2 y de DIST2 10.20.50.3.
//   Las 20 primeras direcciones (10.20.50.1–.20) quedan para equipos fijos.
// - Servidor de impresión del anexo IMP-ANX, 10.20.50.10; alias «impresion».
// - Resolutores del operador: 198.51.100.53 y 198.51.100.54 (documentación).
// - Zonas inversas internas: una por cada /24, en DC1 y DC2. La zona
//   ad.arcedo.example solo la sirven DC1 y DC2 y no se publica fuera.
// - NTP1 anuncia estrato 2 (sus fuentes públicas son de estrato 1).
// - Hora (fijado por el controlador): DC1 es el emulador de PDC y se sincroniza
//   con NTP1/NTP2; los demás miembros del dominio, por la jerarquía de Windows;
//   los equipos fuera del dominio, directamente con NTP1/NTP2. DNS de los DC:
//   dc1.ad.arcedo.example y dc2.ad.arcedo.example.
// - Conmutación por error DHCP: Windows Server, modo de reparto de carga.
// ---------------------------------------------------------------------------

const L1 = { label: 'Lección: DNS: cómo funciona', href: '/learn/op3m1' };
const L2 = { label: 'Lección: DNS en la organización', href: '/learn/op3m2' };
const L3 = { label: 'Lección: DHCP', href: '/learn/op3m3' };
const L4 = { label: 'Lección: NTP y la hora', href: '/learn/op3m4' };
const L5 = { label: 'Lección: Servicios de conectividad', href: '/learn/op3m5' };

const RFC1034 = { label: 'RFC 1034: conceptos del DNS', href: 'https://www.rfc-editor.org/rfc/rfc1034' };
const RFC1035 = { label: 'RFC 1035: implementación del DNS (IN-ADDR.ARPA, §3.5)', href: 'https://www.rfc-editor.org/rfc/rfc1035' };
const RFC2181 = { label: 'RFC 2181: aclaraciones del DNS (CNAME, §10)', href: 'https://www.rfc-editor.org/rfc/rfc2181' };
const RFC2782 = { label: 'RFC 2782: registros SRV', href: 'https://www.rfc-editor.org/rfc/rfc2782' };
const RFC9499 = { label: 'RFC 9499: terminología del DNS', href: 'https://www.rfc-editor.org/rfc/rfc9499' };
const RFC2131 = { label: 'RFC 2131: DHCP', href: 'https://www.rfc-editor.org/rfc/rfc2131' };
const RFC2132 = { label: 'RFC 2132: opciones de DHCP', href: 'https://www.rfc-editor.org/rfc/rfc2132' };
const RFC1542 = { label: 'RFC 1542: agentes relay de BOOTP/DHCP (§4.1.1)', href: 'https://www.rfc-editor.org/rfc/rfc1542' };
const RFC3074 = { label: 'RFC 3074: algoritmo de reparto de carga de DHCP', href: 'https://www.rfc-editor.org/rfc/rfc3074' };
const RFC5905 = { label: 'RFC 5905: NTP versión 4', href: 'https://www.rfc-editor.org/rfc/rfc5905' };
const RFC4120 = { label: 'RFC 4120: Kerberos V5', href: 'https://www.rfc-editor.org/rfc/rfc4120' };
const MS_SRV = {
  label: 'Microsoft Learn: registros SRV de los controladores de dominio (valores del fabricante)',
  href: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/verify-srv-dns-records-have-been-created',
};
const MS_FAILOVER = {
  label: 'Microsoft Learn: conmutación por error de DHCP (valores del fabricante)',
  href: 'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-failover',
};
const MS_KERB = {
  label: 'Microsoft Learn: tolerancia máxima de sincronización del reloj para Kerberos (valor del fabricante)',
  href: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/maximum-tolerance-for-computer-clock-synchronization',
};
const DRAFT_FAILOVER = {
  label: 'draft-ietf-dhc-failover-12 (borrador caducado, nunca fue RFC)',
  href: 'https://datatracker.ietf.org/doc/draft-ietf-dhc-failover/',
};

const op3s1: Supuesto = {
  id: 'op3s1',
  track: 'opo',
  sectionIds: ['op3'],
  version: 1,
  title: 'El edificio anexo de la sede',
  brief: 'Da servicio de red al edificio anexo de la sede: ámbito DHCP, zonas y registros DNS, relay con giaddr, conmutación por error entre DHCP1 y DHCP2, la hora de los servidores y una nota para la jefatura.',
  minutes: 60,
  prerequisites: ['op3m1', 'op3m2', 'op3m3', 'op3m4', 'op3m5'],
  dossier: [
    {
      id: 'd-memo',
      title: 'Memorando de la jefatura del Servicio: el edificio anexo',
      kind: 'memo',
      body: [
        { t: 'p', md: '**De:** jefatura del Servicio de Informática y Comunicaciones · **Para:** equipo de sistemas y redes · **Asunto:** servicios de red del edificio anexo' },
        {
          t: 'p',
          md: 'El edificio anexo de la sede central abre el mes que viene. Está unido por fibra a los dos conmutadores de distribución de la sede, DIST1 y DIST2, y tendrá su propia VLAN, la **50** («Usuarios del anexo»), con la red `10.20.50.0` y el prefijo que calculéis. Necesito, antes de la mudanza:',
        },
        {
          t: 'list',
          items: [
            'Direcciones por DHCP para los equipos del anexo: **350 puestos y portátiles** al abrir y hasta **380** dentro de dos años. Además, las **20 primeras direcciones** de la red quedan fuera del reparto para equipos con dirección fija (puerta de enlace, conmutadores, impresoras y el servidor de impresión).',
            'Que los equipos del anexo resuelvan nombres internos, se unan al dominio `ad.arcedo.example` y encuentren sus controladores de dominio.',
            'Un servidor de impresión, **IMP-ANX**, con la dirección fija `10.20.50.10`, al que la gente llegue también con el nombre corto «impresion».',
            'Que el anexo siga recibiendo direcciones aunque se caiga uno de los dos servidores DHCP.',
            'Que todos los servidores tengan la hora bien: sin eso fallan cosas que no parecen de la hora.',
          ],
        },
      ],
    },
    {
      id: 'd-inventario',
      title: 'Inventario de servidores y equipos que intervienen',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Equipo', 'Dirección', 'Qué hace'],
          rows: [
            ['DC1 (`dc1.ad.arcedo.example`)', '`10.20.72.11` (CPD)', 'Controlador de dominio de `ad.arcedo.example` con DNS interno. Reenvía a los resolutores del operador lo que no es suyo. Tiene el rol de emulador de PDC.'],
            ['DC2 (`dc2.ad.arcedo.example`)', '`10.20.72.12` (CPD)', 'Controlador de dominio y DNS interno, como DC1.'],
            ['DHCP1', '`10.20.72.21` (CPD)', 'Servidor DHCP (Windows Server), miembro del dominio.'],
            ['DHCP2', '`10.20.72.22` (CPD)', 'Servidor DHCP (Windows Server), miembro del dominio, instalado hace una semana para formar pareja con DHCP1.'],
            ['NTP1 y NTP2', '`10.20.72.41` y `10.20.72.42` (CPD)', 'Servidores de hora internos. Se sincronizan con servidores públicos de referencia y dan la hora al emulador de PDC y a los equipos que no son del dominio.'],
            ['DIST1 y DIST2', 'Conmutadores de distribución de capa 3 de la sede', 'Encaminan entre las VLAN de la sede con interfaces virtuales de VLAN (SVI, nombre de Cisco que se ha generalizado). Son los agentes relay de DHCP de la sede.'],
            ['Resolutores del operador', '`198.51.100.53` y `198.51.100.54`', 'Resuelven nombres de Internet. No conocen las zonas internas del Consorcio.'],
          ],
        },
      ],
    },
    {
      id: 'd-normas',
      title: 'Normas de direccionamiento, DNS y hora del Consorcio',
      kind: 'norma',
      body: [
        {
          t: 'list',
          ordered: true,
          items: [
            'En la VLAN 50 del anexo, la **primera** dirección útil será la puerta de enlace virtual, compartida con VRRP entre DIST1 y DIST2; la **segunda**, la SVI de DIST1, y la **tercera**, la de DIST2.',
            'La concesión de DHCP de los puestos de usuario es de **8 horas** (decisión del Consorcio, como en la VLAN 10).',
            'Todos los equipos internos se registran en la zona `ad.arcedo.example`, integrada en Active Directory. Esa zona **solo la sirven DC1 y DC2**: no se publica fuera ni la conocen los resolutores del operador.',
            'Zonas inversas internas: **una por cada bloque /24** que se use, en DC1 y DC2.',
            'Los equipos de usuario usan como servidores DNS a DC1 y DC2, que reenvían a los resolutores del operador lo que no es suyo.',
            'Hora: el controlador de dominio con el rol de emulador de PDC (DC1) la toma de **NTP1 y NTP2**; los demás miembros del dominio, servidores incluidos, la toman por la **jerarquía de hora del dominio** (comportamiento de Windows); los equipos que no son del dominio (conmutadores, encaminadores, impresoras, Linux) apuntan directamente a NTP1 y NTP2.',
          ],
        },
      ],
    },
    {
      id: 'd-borrador',
      title: 'Borrador del ámbito DHCP de la VLAN 50, preparado por el instalador',
      kind: 'config',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Ámbito «Anexo · VLAN 50» · borrador (sintaxis ilustrativa, sin órdenes de fabricante)',
          text: `ámbito            Anexo · VLAN 50
intervalo         10.20.50.1 - 10.20.50.254
máscara           255.255.255.0
concesión         8 días
opción 3          10.20.10.1                  # copiada del ámbito de la VLAN 10
opción 6          198.51.100.53, 198.51.100.54
opción 15         ad.arcedo.example
opción 4          10.20.72.41, 10.20.72.42    # «para que tengan la hora de NTP1 y NTP2»`,
        },
      ],
    },
    {
      id: 'd-esquema',
      title: 'Esquema del anexo y del CPD',
      kind: 'diagram',
      diagram: {
        width: 720,
        height: 400,
        zones: [
          { label: 'Edificio anexo · VLAN 50', x: 16, y: 260, w: 330, h: 126 },
          { label: 'CPD', x: 380, y: 16, w: 324, h: 200 },
        ],
        nodes: [
          { id: 'dist1', label: 'DIST1', kind: 'l3switch', x: 110, y: 150, sub: 'SVI VLAN 50' },
          { id: 'dist2', label: 'DIST2', kind: 'l3switch', x: 260, y: 150, sub: 'SVI VLAN 50' },
          { id: 'acc', label: 'Acceso anexo', kind: 'switch', x: 185, y: 290, sub: 'capa 2' },
          { id: 'pc', label: 'Puestos', kind: 'pc', x: 90, y: 360, sub: 'DHCP' },
          { id: 'imp', label: 'IMP-ANX', kind: 'server', x: 280, y: 360, sub: 'impresión' },
          { id: 'dc', label: 'DC1 · DC2', kind: 'server', x: 450, y: 70, sub: 'AD + DNS' },
          { id: 'dhcp', label: 'DHCP1 · DHCP2', kind: 'server', x: 620, y: 70, sub: 'conmutación por error' },
          { id: 'ntp', label: 'NTP1 · NTP2', kind: 'server', x: 535, y: 170, sub: 'hora interna' },
          { id: 'inet', label: 'Internet', kind: 'cloud', x: 620, y: 300, sub: 'resolutores del operador' },
        ],
        links: [
          { from: 'acc', to: 'dist1', label: 'fibra' },
          { from: 'acc', to: 'dist2', label: 'fibra' },
          { from: 'acc', to: 'pc' },
          { from: 'acc', to: 'imp' },
          { from: 'dist1', to: 'dc' },
          { from: 'dist2', to: 'dhcp' },
          { from: 'dc', to: 'ntp' },
          { from: 'dhcp', to: 'ntp' },
          { from: 'dc', to: 'inet', label: 'reenvío DNS' },
        ],
      },
    },
    {
      id: 'd-config',
      title: 'Configuración de las SVI de la VLAN 50 en DIST1 y DIST2',
      kind: 'config',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'DIST1 y DIST2 · extracto (sintaxis ilustrativa: cada fabricante usa sus propias órdenes)',
          text: `# DIST1
interfaz vlan 50
  ip 10.20.50.2/23
  vrrp 50 ip virtual 10.20.50.1   prioridad 120
  relay dhcp hacia 10.20.72.21

# DIST2
interfaz vlan 50
  ip 10.20.50.3/23
  vrrp 50 ip virtual 10.20.50.1   prioridad 100
  relay dhcp hacia 10.20.72.11`,
        },
      ],
    },
    {
      id: 'd-registro',
      title: 'Registro del asistente de conmutación por error y estado de la hora',
      kind: 'log',
      unlockedBy: 'f3',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'DHCP1 y servidores del CPD (salida ilustrativa, sin sintaxis de fabricante)',
          text: `asistente de conmutación por error en DHCP1
10:02:15  relación nueva: DHCP1 (10.20.72.21) <-> DHCP2 (10.20.72.22), ámbito Anexo · VLAN 50
10:02:16  conexión con el socio por TCP 647: correcta
10:02:16  hora de DHCP1: 10:02:16 · hora de DHCP2: 09:58:06
10:02:16  la diferencia de hora con el socio supera un minuto: se detiene la configuración

estado de la hora
equipo   fuente                              estrato   desfase con NTP1
NTP1     servidores públicos de referencia   2         -
DC1      NTP1 (10.20.72.41)                  sincr.    +0,004 s
DHCP1    jerarquía del dominio (DC1)         sincr.    +0,006 s
DHCP2    reloj local del equipo              16        -250 s`,
        },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'El ámbito DHCP del anexo',
      context:
        'Empieza por las direcciones. Con el memorando y las normas, calcula la red de la VLAN 50 y el ámbito que repartirá DHCP. El instalador ha dejado un borrador: revísalo antes de darlo por bueno. Los servidores DNS del ámbito los revisas en la fase siguiente.',
      carry:
        'Ámbito correcto: red `10.20.50.0/23` (máscara 255.255.254.0), puerta de enlace `10.20.50.1`, difusión `10.20.51.255`; reparte de `10.20.50.21` a `10.20.51.254`, 490 direcciones; concesión de 8 horas. Opciones: 3 (puerta), 6 (DNS), 15 (dominio), 42 (servidores NTP) y 51 (concesión).',
      tasks: [
        {
          id: 'f1t1',
          kind: 'numeric',
          topic: 'op3m3',
          prompt: '¿Qué longitud de prefijo necesita la red de la VLAN 50? Escribe solo el número (24 para un /24).',
          answer: 23,
          points: 4,
          hint: { text: 'Suma los equipos con DHCP previstos dentro de dos años y las direcciones fijas.', cost: 1 },
          explain:
            'Hay que alojar 380 equipos por DHCP (la previsión a dos años) más las 20 direcciones fijas: 400. Un /24 da 256 − 2 = 254 utilizables y no llega; un /23 da 512 − 2 = 510. Tienta el /24 porque las demás VLAN de la sede lo son, o porque se cuentan solo los 350 puestos de hoy, que tampoco caben.',
          refs: [L3, RFC2131],
        },
        {
          id: 'f1t2',
          kind: 'table',
          topic: 'op3m3',
          prompt: 'Completa los datos **correctos** del ámbito de la VLAN 50 (no tienen por qué coincidir con el borrador).',
          fields: [
            { id: 'mascara', label: 'Máscara (opción 1)', options: ['255.255.255.0', '255.255.254.0', '255.255.252.0', '255.255.255.128'] },
            { id: 'puerta', label: 'Puerta de enlace (opción 3)', options: ['10.20.10.1', '10.20.50.0', '10.20.50.1', '10.20.51.254'] },
            { id: 'difusion', label: 'Difusión', options: ['10.20.50.255', '10.20.51.254', '10.20.51.255', '10.20.53.255'] },
            { id: 'primera', label: 'Primera dirección que reparte', options: ['10.20.50.1', '10.20.50.4', '10.20.50.20', '10.20.50.21'] },
            { id: 'ultima', label: 'Última dirección que reparte', options: ['10.20.50.254', '10.20.51.0', '10.20.51.254', '10.20.51.255'] },
          ],
          rows: [
            { id: 'vlan50', label: 'Ámbito «Anexo · VLAN 50»', answer: { mascara: '255.255.254.0', puerta: '10.20.50.1', difusion: '10.20.51.255', primera: '10.20.50.21', ultima: '10.20.51.254' } },
          ],
          points: 8,
          explain:
            'Un /23 es la máscara 255.255.254.0: la red va de `10.20.50.0` a `10.20.51.255`, que es la difusión. Según las normas, la primera dirección útil, `10.20.50.1`, es la puerta de enlace; el borrador copió la `10.20.10.1` de la VLAN 10, que no está en esta red. Las 20 primeras direcciones (`.1` a `.20`) son fijas, así que el reparto empieza en `10.20.50.21` y acaba en `10.20.51.254`, la última antes de la difusión. El borrador, pensado para un /24, repartía también la puerta y las SVI y se quedaba sin la mitad alta de la red. Tienta acabar en `10.20.50.254`, como el borrador, o empezar en `.20`, que todavía es una de las fijas.',
          refs: [L3, RFC2131, RFC2132],
        },
        {
          id: 'f1t3',
          kind: 'numeric',
          topic: 'op3m3',
          prompt: '¿Cuántas direcciones puede repartir el ámbito, de la primera a la última?',
          answer: 490,
          unit: 'direcciones',
          points: 3,
          explain:
            'De `10.20.50.21` a `10.20.50.255` hay 256 − 21 = 235 direcciones, y de `10.20.51.0` a `10.20.51.254`, 255: en total 490, de sobra para 380. Tienta responder 489 quitando `10.20.51.0` como si fuera una dirección de red, pero en un /23 la única dirección de red es `10.20.50.0`: `10.20.51.0` y `10.20.50.255` son direcciones normales.',
          refs: [L3],
        },
        {
          id: 'f1t4',
          kind: 'match',
          topic: 'op3m3',
          prompt: 'Empareja cada dato que debe recibir el equipo con la opción de DHCP que lo lleva.',
          left: [
            { id: 'l-puerta', text: 'Puerta de enlace' },
            { id: 'l-dns', text: 'Servidores DNS' },
            { id: 'l-dominio', text: 'Nombre de dominio DNS del cliente' },
            { id: 'l-ntp', text: 'Servidores NTP (NTP1 y NTP2) para los equipos que no son del dominio y los pidan' },
            { id: 'l-concesion', text: 'Duración de la concesión' },
          ],
          right: [
            { id: 'o3', text: 'Opción 3' },
            { id: 'o4', text: 'Opción 4' },
            { id: 'o6', text: 'Opción 6' },
            { id: 'o15', text: 'Opción 15' },
            { id: 'o42', text: 'Opción 42' },
            { id: 'o51', text: 'Opción 51' },
          ],
          answer: { 'l-puerta': 'o3', 'l-dns': 'o6', 'l-dominio': 'o15', 'l-ntp': 'o42', 'l-concesion': 'o51' },
          points: 4,
          explain:
            'En la RFC 2132, la 3 es «Router», la 6 «Domain Name Server», la 15 «Domain Name», la 42 «Network Time Protocol Servers» y la 51 «IP Address Lease Time». La trampa es la del borrador: la opción 4, «Time Server», es para servidores del protocolo de hora de la RFC 868, no para NTP. Un equipo que pida servidores NTP mirará la 42.',
          refs: [L3, L4, RFC2132],
        },
        {
          id: 'f1t5',
          kind: 'numeric',
          topic: 'op3m3',
          prompt: 'Con la concesión de 8 horas de las normas y los valores por defecto de la RFC 2131 (sin contar la pequeña variación aleatoria), ¿cuántas horas después de recibir la concesión pasa un puesto al estado REBINDING?',
          answer: 7,
          unit: 'horas',
          points: 3,
          explain:
            'REBINDING empieza en T2, que por defecto es 0,875 × la duración de la concesión: 0,875 × 8 = 7 horas. A las 4 horas (T1 = 0,5 × 8) el puesto pasa a RENEWING y pide la renovación en unidifusión al servidor que le concedió la dirección; solo si a las 7 horas sigue sin respuesta la pide por difusión a cualquier servidor. Tienta responder 6,4 usando el 0,8 de DHCPv6, que es otra norma.',
          refs: [L3, RFC2131],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'Zonas y registros DNS',
      context:
        'Ahora el DNS. Los puestos del anexo registrarán sus nombres solos con actualizaciones dinámicas, pero las zonas donde van esos registros tienen que existir, y el servidor de impresión necesita los suyos. Revisa también qué servidores DNS daba el borrador del instalador.',
      carry:
        'Se crean dos zonas inversas, `50.20.10.in-addr.arpa` y `51.20.10.in-addr.arpa`; ninguna zona directa nueva, porque todo va en `ad.arcedo.example`. IMP-ANX lleva un registro A, su PTR `10.50.20.10.in-addr.arpa` y un CNAME «impresion». El ámbito da como DNS a DC1 (`10.20.72.11`) y DC2 (`10.20.72.12`), los únicos que sirven `ad.arcedo.example` y los registros SRV con los que los puestos encuentran un controlador de dominio.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'multi',
          topic: 'op3m1',
          prompt: 'Siguiendo las normas del Consorcio, marca **todas** las zonas que hay que crear para el anexo.',
          options: [
            { id: 'a', text: '`50.20.10.in-addr.arpa`' },
            { id: 'b', text: '`51.20.10.in-addr.arpa`' },
            { id: 'c', text: '`10.20.50.in-addr.arpa`' },
            { id: 'd', text: 'Una zona directa nueva, `anexo.ad.arcedo.example`' },
            { id: 'e', text: 'Una zona directa nueva, `anexo.local`' },
            { id: 'f', text: '`50.20.10.ip6.arpa`' },
          ],
          answer: ['a', 'b'],
          points: 5,
          explain:
            'La red `10.20.50.0/23` ocupa dos bloques /24, `10.20.50.0` y `10.20.51.0`, y las normas piden una zona inversa por cada /24: dos zonas. En IN-ADDR.ARPA cada etiqueta es un octeto y se escriben al revés (RFC 1035 §3.5): `50.20.10.in-addr.arpa` y `51.20.10.in-addr.arpa`. Tienta crear solo la del `.50`, olvidando que la segunda mitad del /23 es otro /24, o escribir los octetos en su orden normal. No hace falta zona directa nueva, porque todo se registra en `ad.arcedo.example`; `.local` no se usa en el Consorcio, y `ip6.arpa` es para IPv6.',
          refs: [L1, L2, RFC1035],
        },
        {
          id: 'f2t2',
          kind: 'choice',
          topic: 'op3m1',
          prompt: '¿Qué nombre tiene el registro PTR de IMP-ANX, `10.20.50.10`?',
          options: [
            { id: 'a', text: '`10.20.50.10.in-addr.arpa`' },
            { id: 'b', text: '`10.50.20.10.in-addr.arpa`, dentro de la zona `50.20.10.in-addr.arpa`' },
            { id: 'c', text: '`10.50.20.10.ip6.arpa`' },
            { id: 'd', text: '`50.20.10.in-addr.arpa`, el nombre de la zona' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'La RFC 1035 lo explica con un ejemplo: los datos de la dirección 10.2.0.52 están en el nombre 52.0.2.10.IN-ADDR.ARPA. Con `10.20.50.10` queda `10.50.20.10.in-addr.arpa`, en la zona del /24 `10.20.50.0`. Tienta no invertir los octetos; el nombre de la zona solo, sin la etiqueta del equipo, sería el ápice de la zona, no el registro del servidor.',
          refs: [L1, RFC1035],
        },
        {
          id: 'f2t3',
          kind: 'match',
          topic: 'op3m1',
          prompt: 'Empareja cada necesidad con el tipo de registro que la resuelve.',
          left: [
            { id: 'l-a', text: '`imp-anx.ad.arcedo.example` debe dar `10.20.50.10`' },
            { id: 'l-alias', text: 'El nombre corto «impresion» debe llevar a IMP-ANX' },
            { id: 'l-dc', text: 'Un puesto busca un controlador de dominio que atienda LDAP' },
          ],
          right: [
            { id: 'r-a', text: 'A' },
            { id: 'r-aaaa', text: 'AAAA' },
            { id: 'r-cname', text: 'CNAME' },
            { id: 'r-ptr', text: 'PTR' },
            { id: 'r-srv', text: 'SRV' },
            { id: 'r-txt', text: 'TXT' },
          ],
          answer: { 'l-a': 'r-a', 'l-alias': 'r-cname', 'l-dc': 'r-srv' },
          points: 3,
          explain:
            'El A da la dirección IPv4 de un nombre (AAAA sería para IPv6). El CNAME convierte un nombre en alias de otro: `impresion` apunta a `imp-anx`, y ese nombre no puede tener ningún otro registro (RFC 2181 §10.1). Los controladores de dominio se localizan con registros SRV, que dan servicio, protocolo, prioridad, peso, puerto y equipo (RFC 2782); Active Directory los usa bajo `_msdcs` (valor del fabricante). El PTR tienta, pero es el camino inverso, de dirección a nombre.',
          refs: [L1, L2, RFC2181, RFC2782, MS_SRV],
        },
        {
          id: 'f2t4',
          kind: 'choice',
          topic: 'op3m2',
          prompt: 'El borrador da a los puestos como DNS `198.51.100.53` y `198.51.100.54`. ¿Qué pasaría si se quedara así?',
          options: [
            { id: 'a', text: 'Nada: esos servidores reenvían a DC1 y DC2 lo que es de `ad.arcedo.example`' },
            { id: 'b', text: 'Los puestos preguntarían por `_ldap._tcp.dc._msdcs.ad.arcedo.example` (registro de Active Directory, valor de Microsoft) a quien no conoce esa zona, no encontrarían ningún controlador de dominio y no podrían unirse al dominio ni iniciar sesión en él' },
            { id: 'c', text: 'Solo fallaría la resolución inversa de las direcciones del anexo' },
            { id: 'd', text: 'Funcionaría, porque `ad.arcedo.example` cuelga de `arcedo.example`, cuya zona está en el proveedor de DNS externo' },
          ],
          answer: 'b',
          points: 4,
          hint: { text: 'Mira en las normas quién sirve la zona del dominio y en el inventario qué conocen los resolutores del operador.', cost: 1 },
          explain:
            'Un puesto encuentra su controlador de dominio con una consulta SRV como `_ldap._tcp.dc._msdcs.ad.arcedo.example` (puerto 389; valores de Microsoft). Esa zona solo la sirven DC1 y DC2, así que el resolutor del operador no puede responder y el puesto se queda sin dominio. El reenvío va en el otro sentido: DC1 y DC2 reenvían al operador lo que no es suyo, no al revés. Que `ad.arcedo.example` sea un subdominio del público no lo publica: las normas dicen que no se ve fuera. La solución es la opción 6 con `10.20.72.11` y `10.20.72.12`.',
          refs: [L2, RFC9499, MS_SRV],
        },
        {
          id: 'f2t5',
          kind: 'cite',
          topic: 'op3m2',
          prompt: 'Señala los documentos que, juntos, prueban que los servidores DNS del borrador no sirven para el dominio interno.',
          answerSets: [['d-borrador', 'd-inventario'], ['d-borrador', 'd-inventario', 'd-normas']],
          points: 4,
          explain:
            'El borrador muestra qué servidores DNS reciben los puestos (`198.51.100.53` y `.54`), y solo el inventario dice de quién son esas direcciones: los resolutores del operador, que no conocen las zonas internas. Hacen falta los dos; las normas pueden acompañarlos, porque confirman que `ad.arcedo.example` solo la sirven DC1 y DC2, pero sin el inventario no prueban nada: no dicen qué es `198.51.100.53`. El memorando tienta, pero solo pide que se resuelvan los nombres internos.',
          refs: [L2],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'Relay y conmutación por error',
      context:
        'Los servidores DHCP están en el CPD y los puestos, en la VLAN 50: entre medias, las SVI de DIST1 y DIST2 hacen de agente relay. Ya tienes en el expediente cómo las ha configurado el instalador. Además, DHCP1 y DHCP2 van a trabajar en conmutación por error con la función de Windows Server, en modo de reparto de carga. Lo que es de Microsoft se dice como tal: la conmutación por error de DHCPv4 no tiene RFC.',
      carry:
        'Las dos SVI de la VLAN 50 retransmiten a DHCP1 (`10.20.72.21`) y a DHCP2 (`10.20.72.22`); el instalador lo ha corregido, porque DIST1 solo apuntaba a DHCP1 y DIST2 a DC1. Cada SVI pone su propia dirección en giaddr y el servidor elige con ella el ámbito de `10.20.50.0/23`. DHCP1 y DHCP2 forman una relación de conmutación por error de Windows Server en reparto de carga (por defecto de Microsoft, 50:50, por TCP 647).',
      tasks: [
        {
          id: 'f3t1',
          kind: 'choice',
          topic: 'op3m3',
          prompt: 'Cuando la SVI de la VLAN 50 de DIST1 retransmite un DHCPDISCOVER, ¿qué pone en `giaddr` y para qué le sirve al servidor?',
          options: [
            { id: 'a', text: '`10.20.72.21`, la del servidor al que lo reenvía, para que sepa que el mensaje es para él' },
            { id: 'b', text: '`10.20.50.2`, la de la interfaz por la que llegó la petición: con ella el servidor elige el ámbito de `10.20.50.0/23` y sabe a qué relay devolver la respuesta, al puerto 67' },
            { id: 'c', text: '`0.0.0.0`: el servidor elige el ámbito por la opción 82, que añade el relay' },
            { id: 'd', text: 'Su dirección de gestión en la VLAN 99: el servidor elige el ámbito de la red de gestión' },
          ],
          answer: 'b',
          points: 5,
          explain:
            'Si `giaddr` llega a cero, el relay debe escribir «the IP address of the interface on which the request was received» (RFC 1542 §4.1.1): la SVI de la VLAN 50, `10.20.50.2`. El servidor elige la dirección según `giaddr` cuando no es cero (RFC 2131 §4.3.1), así que cae en el ámbito de la VLAN 50, y envía la respuesta al relay, al puerto 67. La opción 82 tienta: la añade el relay y el servidor puede usarla para su política, pero no sustituye a `giaddr` ni hace que valga cero. La dirección de gestión haría que el servidor buscara el ámbito de otra red.',
          refs: [L3, RFC1542, RFC2131],
        },
        {
          id: 'f3t2',
          kind: 'order',
          topic: 'op3m3',
          prompt: 'Ordena lo que pasa cuando un portátil del anexo pide dirección por primera vez, con las SVI ya bien configuradas.',
          items: [
            { id: 'o3', text: 'El servidor al que le toca ese cliente elige, por giaddr, el ámbito de `10.20.50.0/23` y envía un DHCPOFFER al relay, al puerto 67' },
            { id: 'o6', text: 'El servidor confirma con DHCPACK y el portátil, tras comprobar que nadie usa la dirección, la configura' },
            { id: 'o1', text: 'El portátil, aún sin dirección, envía un DHCPDISCOVER desde `0.0.0.0` a `255.255.255.255`, al puerto UDP 67' },
            { id: 'o5', text: 'El portátil envía un DHCPREQUEST que nombra al servidor elegido (opción 54), y el relay lo vuelve a retransmitir' },
            { id: 'o2', text: 'La SVI de la VLAN 50 de DIST1 recibe la difusión, escribe su propia dirección en giaddr y la reenvía en unidifusión a DHCP1 y a DHCP2' },
            { id: 'o4', text: 'El relay entrega la oferta al portátil en la VLAN 50' },
          ],
          answer: ['o1', 'o2', 'o3', 'o4', 'o5', 'o6'],
          points: 6,
          explain:
            'Es el intercambio de cuatro mensajes (DISCOVER, OFFER, REQUEST, ACK; «DORA» es solo una forma de recordarlo) con un relay en medio: la difusión del cliente no sale de su VLAN, así que el relay la convierte en unidifusión hacia los servidores y les devuelve las respuestas. El REQUEST lleva el identificador del servidor elegido (opción 54) y rechaza de paso las demás ofertas. Antes de usar la dirección, el cliente debería hacer una última comprobación, por ejemplo con ARP (RFC 2131). Tienta poner el OFFER directo al portátil: el servidor, con giaddr distinto de cero, responde al relay.',
          refs: [L3, RFC2131, RFC2132, RFC1542],
        },
        {
          id: 'f3t3',
          kind: 'cite',
          topic: 'op3m3',
          prompt: 'Señala los documentos que, juntos, prueban que, si DHCP1 se cayera, ningún puesto del anexo podría pedir dirección a DHCP2.',
          answerSets: [['d-config', 'd-inventario']],
          points: 4,
          hint: { text: 'Necesitas saber a qué direcciones retransmiten las SVI y de quién es cada dirección.', cost: 1 },
          explain:
            'En la configuración, DIST1 retransmite solo a `10.20.72.21` y DIST2 solo a `10.20.72.11`. El inventario dice que la primera es DHCP1 y la segunda, DC1, que no es servidor DHCP; DHCP2 es `10.20.72.22` y no aparece en ningún relay. Microsoft lo dice en su guía de conmutación por error: con los servidores en otra subred hacen falta dos direcciones de relay. El esquema tienta porque dibuja a DHCP2, pero no dice a quién retransmiten las SVI.',
          refs: [L3, MS_FAILOVER],
        },
        {
          id: 'f3t4',
          kind: 'multi',
          topic: 'op3m3',
          prompt: 'Sobre la conmutación por error de DHCP1 y DHCP2, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'La de Windows Server se basa en un borrador de la IETF que caducó en 2003 y nunca llegó a RFC' },
            { id: 'b', text: 'En reparto de carga, el modo por defecto de Microsoft, cada servidor atiende a la mitad de los clientes, repartidos con el hash de la RFC 3074' },
            { id: 'c', text: 'Los dos socios se comunican por TCP 647, como hace Windows Server' },
            { id: 'd', text: 'La RFC 3074 define el protocolo completo de conmutación por error de DHCPv4' },
            { id: 'e', text: 'Si un día el anexo tiene ámbitos DHCPv6, la misma relación de Windows Server los cubrirá' },
            { id: 'f', text: 'Con la conmutación por error ya no hace falta que los relay apunten a DHCP2' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'El borrador draft-ietf-dhc-failover-12 caducó en 2003; Microsoft se basa en él. La RFC 3074 solo define el algoritmo de reparto: un hash del identificador del cliente con valores de 0 a 255; el reparto 50:50 por defecto y el puerto TCP 647 son valores de Microsoft. La relación de Windows Server no admite ámbitos IPv6 (la única RFC de conmutación por error, la 8156, es para DHCPv6). Y cada servidor solo atiende lo que le llega: si el relay no le retransmite, DHCP2 nunca ve las peticiones aunque esté en la relación.',
          refs: [L3, RFC3074, DRAFT_FAILOVER, MS_FAILOVER],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'La hora de los servidores',
      context:
        'Con los relay corregidos, el equipo lanza el asistente de conmutación por error en DHCP1 y no termina. En el expediente tienes su registro y el estado de la hora de los servidores del CPD. Los valores de Windows Server y de Kerberos en Active Directory son del fabricante; lo demás sale de las RFC.',
      carry:
        'DHCP2 iba con su reloj local, 250 segundos por detrás. Se configura para tomar la hora por la jerarquía del dominio, como DHCP1, corrige el desfase de un salto y deja de estar en estrato 16; después, el asistente completa la relación de conmutación por error.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'cite',
          topic: 'op3m4',
          prompt: 'Señala los documentos que, juntos, prueban que DHCP2 no toma la hora de donde debe.',
          answerSets: [['d-registro', 'd-normas'], ['d-registro', 'd-normas', 'd-inventario']],
          points: 4,
          explain:
            'El registro muestra que la fuente de DHCP2 es su reloj local, con estrato 16. Las normas reparten la hora en tres casos (emulador de PDC, miembros del dominio y equipos fuera del dominio): sea cual sea su papel, ninguna norma permite el reloj local; como miembro del dominio, a DHCP2 le toca la jerarquía del dominio (comportamiento de Windows), como hace DHCP1 en el mismo registro. Con el registro solo sabes de dónde la toma, pero no de dónde debería tomarla; con el registro y las normas ya queda probado que el reloj local no vale. El inventario completa la prueba, porque solo él dice que DHCP2 es miembro del dominio y, por tanto, en qué caso de las normas cae: por eso también vale citar los tres. El memorando tienta porque habla de la hora, pero no dice cuál es la fuente.',
          refs: [L4],
        },
        {
          id: 'f4t2',
          kind: 'multi',
          topic: 'op3m4',
          prompt: 'Con los 250 segundos (4 min 10 s) que DHCP2 va por detrás, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'El asistente de Windows Server se detiene porque la diferencia con el socio supera un minuto (valor de Microsoft)' },
            { id: 'b', text: 'Kerberos todavía acepta a DHCP2 frente a DC1 con la tolerancia por defecto de Active Directory, 5 minutos (valor de Microsoft)' },
            { id: 'c', text: 'El estrato 16 de DHCP2 significa que no está sincronizado' },
            { id: 'd', text: 'El estrato 16 es el de menor calidad que todavía se puede usar como fuente' },
            { id: 'e', text: 'Kerberos ya rechaza a DHCP2, porque la RFC 4120 fija una tolerancia de un minuto' },
            { id: 'f', text: 'Se arregla dando la opción 4 de DHCP a los servidores' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'Microsoft detiene la configuración de la conmutación por error si los relojes difieren más de un minuto, y 250 s son más de 60. La tolerancia de Kerberos en Active Directory es de 5 minutos por defecto (300 s), así que todavía no salta el error KRB_AP_ERR_SKEW; la RFC 4120 no fija ninguna cifra: dice que es configurable y suele ser del orden de 5 minutos. En NTP, el estrato 16 significa «unsynchronized»: los servidores secundarios van del 2 al 15. La opción 4 es la del protocolo de la RFC 868, y los servidores del CPD no toman la hora por DHCP.',
          refs: [L4, RFC5905, RFC4120, MS_FAILOVER, MS_KERB],
        },
        {
          id: 'f4t3',
          kind: 'numeric',
          topic: 'op3m4',
          prompt: 'Imagina una cadena NTP pura: DC1 toma la hora de NTP1 y DHCP2 la toma de DC1. Según la RFC 5905, ¿qué estrato tendrá DHCP2 cuando esté sincronizado?',
          answer: 4,
          points: 4,
          explain:
            'NTP1 anuncia estrato 2 (el registro lo muestra) y cada nivel secundario tiene un estrato más que el anterior (RFC 5905 §3): DC1 queda en estrato 3 y DHCP2, que la toma de DC1, en estrato 4. Tienta responder 3, contando como si DHCP2 tomara la hora de NTP1 directamente, o 1, pensando que cualquier servidor interno es «primario»: el estrato 1 es el servidor conectado directamente a un reloj de referencia, como un receptor GPS. Cómo anuncia Windows el estrato dentro del dominio es cosa del fabricante; aquí se cuenta con el modelo de la RFC.',
          refs: [L4, RFC5905],
        },
        {
          id: 'f4t4',
          kind: 'choice',
          topic: 'op3m4',
          prompt: '¿Cómo corrige un desfase de 250 segundos un cliente que aplique el algoritmo de la RFC 5905?',
          options: [
            { id: 'a', text: 'Poco a poco, acelerando el reloj, porque el desfase está por debajo de 1000 s' },
            { id: 'b', text: 'De un salto, porque el desfase supera los 125 ms y no llega a los 1000 s' },
            { id: 'c', text: 'No lo corrige: más de 125 ms se considera pánico y el programa se detiene' },
            { id: 'd', text: 'De un salto solo si el administrador lo autoriza, porque supera los 128 s' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'La RFC 5905 fija dos umbrales: por debajo de STEPT, 125 ms, el reloj se ajusta poco a poco; entre 125 ms y PANICT, 1000 s, se corrige de un salto; por encima de 1000 s el programa debería salir con un diagnóstico. 250 s caen en el tramo del salto. Tienta el ajuste gradual leyendo solo el límite de 1000 s, o confundir el umbral de 125 ms con el de pánico.',
          refs: [L4, RFC5905],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Nota para la jefatura',
      context:
        'La jefatura del Servicio quiere una nota breve antes de la mudanza: qué se ha preparado para el anexo, qué fallos tenían los borradores y qué se ha corregido. La leerá también la Unidad de Seguridad de la Información.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'written',
          topic: 'op3m3',
          prompt: 'Redacta la nota en **150 a 220 palabras**. Después, compárala con el modelo y marca los criterios que cumple.',
          words: 220,
          model:
            'El anexo tiene su propia red local virtual (VLAN), con sitio para los 380 equipos previstos. El servicio que reparte direcciones (DHCP) entrega de 10.20.50.21 a 10.20.51.254 en préstamos de 8 horas; las primeras 20 direcciones quedan para equipos fijos, como el servidor de impresión.\n\n' +
            'Para el servicio de nombres (DNS) se han creado las dos zonas inversas que ocupa la red y los registros del servidor de impresión, con su alias «impresion». Los puestos usan como DNS a los controladores de dominio: el borrador les daba los servidores del operador y no habrían encontrado el dominio.\n\n' +
            'Los conmutadores de la sede retransmiten las peticiones a los dos servidores DHCP; antes solo llegaban a uno. Los dos trabajan en pareja con la conmutación por error de Windows Server, una función de Microsoft sin norma pública, repartiéndose los clientes: si uno cae, el otro sigue.\n\n' +
            'Al montar la pareja apareció un fallo de hora: el segundo servidor iba con su reloj interno, cuatro minutos atrasado, y la pareja no se formaba. Ya toma la hora por el dominio, como los demás servidores, que a su vez la reciben de los servidores de hora internos. Propongo vigilar la hora de todos los servidores, porque de ella dependen también el inicio de sesión y los registros.',
          rubric: [
            { id: 'r1', text: 'Describe la red y el ámbito: red propia con sitio para el crecimiento, qué se reparte, la concesión y las direcciones fijas', points: 4 },
            { id: 'r2', text: 'Explica el DNS: zonas inversas, registros y alias del servidor de impresión, y por qué los puestos deben usar los controladores de dominio y no los servidores del operador', points: 4 },
            { id: 'r3', text: 'Cuenta el relay hacia los dos servidores y la conmutación por error, rotulándola como función de Microsoft y no como norma', points: 4 },
            { id: 'r4', text: 'Cuenta el fallo de hora (reloj local atrasado), su corrección con la jerarquía de hora del dominio, que bebe de los servidores NTP internos, y por qué importa la hora más allá de DHCP', points: 4 },
            { id: 'r5', text: 'Está escrita para la jefatura: entre 150 y 220 palabras, sin configuración ni siglas sin explicar', points: 3 },
          ],
          points: 19,
          explain:
            'Una buena nota cuenta qué se ha montado, qué falló en los borradores y qué consecuencia habría tenido cada fallo, sin órdenes de configuración. Tienta llenarla de opciones y prefijos; lo que importa a quien la lee es que los puestos tendrán dirección, dominio y servicio aunque caiga un servidor, y que la hora ya no rompe nada.',
          refs: [L2, L3, L4, L5],
        },
      ],
    },
  ],
  sources: [L1, L2, L3, L4, L5, RFC1034, RFC1035, RFC2181, RFC2782, RFC9499, RFC2131, RFC2132, RFC1542, RFC3074, RFC5905, RFC4120, DRAFT_FAILOVER, MS_SRV, MS_FAILOVER, MS_KERB],
};

export default op3s1;
