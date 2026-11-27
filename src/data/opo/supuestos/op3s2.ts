import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op3s2 — «Un lunes sin hora ni nombres» (bloque 3, Servicios de red; avería)
//
// Fuente única: docs/superpowers/sources/2026-11-26-op3-fuentes.md.
// Decisiones del caso (hechos nuevos para el canon, ver el informe de la tarea):
// - Dos averías independientes: DC2 (10.20.72.12) se queda con su reloj local
//   como fuente tras un traslado de anfitrión de virtualización el sábado y va
//   400 s adelantado (LI 3, estrato 16); y el viernes se cambió la opción 6 del
//   ámbito de los puestos de una oficina comarcal por los resolutores
//   del operador, que no tienen la zona interna ad.arcedo.example.
// - Oficina: la de 10.20.9.0/24 (fijado por el controlador; 10.20.8.0/24 ya
//   está repartido en el lab opl1a). Puerta de enlace 10.20.9.1, intervalo
//   10.20.9.20–10.20.9.120 y concesión de 8 horas.
// - Resolutores del operador 198.51.100.53 y 198.51.100.54 (hecho nuevo, rango
//   de documentación). www.arcedo.example resuelve a 203.0.113.10, la única
//   dirección pública del Consorcio (decisión del controlador, como op3m1).
// - Hora (fijado por el controlador, igual que op3m4): DC1 es el emulador de
//   PDC y toma la hora de NTP1 y NTP2; DC2 y los equipos del dominio la toman
//   por la jerarquía de dominio de Windows (comportamiento de Windows); lo que
//   no es del dominio apunta a NTP1 y NTP2. Que el emulador sea DC1 es hecho
//   nuevo. Las referencias públicas son de estrato 1 (hecho nuevo): NTP1 y NTP2
//   en estrato 2, DC1 en 3 y DC2, corregido, en 4.
// - Valores de fabricante, rotulados: tolerancia de 5 minutos de Kerberos en la
//   directiva del dominio (Microsoft), registros SRV de _msdcs (Microsoft),
//   formato de ipconfig (orden de Windows), conmutación por error de DHCP.
// - Salidas de órdenes sintéticas: «salida ilustrativa, sin sintaxis de fabricante».
// - Cite: el registro centralizado y el cortafuegos dan direcciones; solo el
//   inventario las une a un nombre. Ni el esquema ni las consultas NTP llevan
//   direcciones de servidores.
// ---------------------------------------------------------------------------

const L1 = { label: 'Lección: DNS: cómo funciona', href: '/learn/op3m1' };
const L2 = { label: 'Lección: DNS en la organización', href: '/learn/op3m2' };
const L3 = { label: 'Lección: DHCP', href: '/learn/op3m3' };
const L4 = { label: 'Lección: NTP y la hora', href: '/learn/op3m4' };
const LWAN = { label: 'Lección: arquitecturas WAN y WLAN', href: '/learn/op1m5' };
const RFC1034 = { label: 'RFC 1034: conceptos del DNS', href: 'https://www.rfc-editor.org/rfc/rfc1034' };
const RFC1035 = { label: 'RFC 1035: implementación del DNS (RCODE)', href: 'https://www.rfc-editor.org/rfc/rfc1035' };
const RFC2782 = { label: 'RFC 2782: registros SRV', href: 'https://www.rfc-editor.org/rfc/rfc2782' };
const RFC9499 = { label: 'RFC 9499: terminología del DNS (reenviador, NXDOMAIN)', href: 'https://www.rfc-editor.org/rfc/rfc9499' };
const RFC2131 = { label: 'RFC 2131: DHCP', href: 'https://www.rfc-editor.org/rfc/rfc2131' };
const RFC2132 = { label: 'RFC 2132: opciones de DHCP', href: 'https://www.rfc-editor.org/rfc/rfc2132' };
const RFC3046 = { label: 'RFC 3046: opción 82 del agente relay', href: 'https://www.rfc-editor.org/rfc/rfc3046' };
const RFC3203 = { label: 'RFC 3203: DHCPFORCERENEW', href: 'https://www.rfc-editor.org/rfc/rfc3203' };
const RFC5905 = { label: 'RFC 5905: NTP versión 4', href: 'https://www.rfc-editor.org/rfc/rfc5905' };
const RFC4120 = { label: 'RFC 4120: Kerberos V5', href: 'https://www.rfc-editor.org/rfc/rfc4120' };
const MS_KERB = {
  label: 'Microsoft: tolerancia máxima de sincronización de los relojes (valor del fabricante)',
  href: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/maximum-tolerance-for-computer-clock-synchronization',
};
const MS_SRV = {
  label: 'Microsoft: registros SRV de los controladores de dominio (valor del fabricante)',
  href: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/verify-srv-dns-records-have-been-created',
};
const ENS_A2 = { label: 'RD 311/2022, anexo II: op.exp.8, registro de la actividad', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191' };

const op3s2: Supuesto = {
  id: 'op3s2',
  track: 'opo',
  sectionIds: ['op3'],
  version: 1,
  title: 'Un lunes sin hora ni nombres',
  brief: 'Un lunes fallan los inicios de sesión y los registros no cuadran: separa una hora desfasada de una resolución interna rota, corrige en el orden correcto, comprueba cada arreglo y redacta el parte de cierre.',
  minutes: 60,
  prerequisites: ['op3m1', 'op3m2', 'op3m3', 'op3m4'],
  dossier: [
    {
      id: 'd-partes',
      title: 'Partes del servicio de atención a usuarios · lunes, hasta las 09:15',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Parte', 'Hora', 'Dónde', 'Lo que cuenta la persona'],
          rows: [
            ['P1', '08:12', 'Sede, VLAN 10, puesto `10.20.10.137`', '«Al primer intento no me deja entrar; al segundo, sí. El mensaje dice algo de una diferencia de hora.»'],
            ['P2', '08:20', 'Oficina comarcal de la red `10.20.9.0/24`, puesto `10.20.9.57`', '«Internet va bien, pero la intranet, `intranet.ad.arcedo.example`, no abre: dice que no encuentra el servidor.»'],
            ['P3', '08:26', 'Oficina comarcal de la red `10.20.9.0/24`, puesto `10.20.9.64`', '«No puedo iniciar sesión: el equipo dice que no encuentra ningún controlador de dominio.»'],
            ['P4', '08:35', 'Sede, VLAN 10, puesto `10.20.10.212`', '«La aplicación de expedientes me pide la contraseña una y otra vez; a ratos entra sin pedirla.»'],
            ['P5', '08:51', 'Sede, segunda planta', '«La impresora del pasillo se ha quedado sin tóner.»'],
            ['P6', '09:02', 'Unidad de Seguridad de la Información', '«En el registro centralizado, los registros de uno de los controladores de dominio llegan varios minutos por delante de los del cortafuegos para los mismos inicios de sesión.»'],
          ],
        },
        { t: 'p', md: 'El fin de semana nadie trabajó ni en la sede ni en la oficina.' },
      ],
    },
    {
      id: 'd-inventario',
      title: 'Inventario de servicios de red',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Servicio', 'Equipo', 'Dirección', 'Notas'],
          rows: [
            ['Controlador de dominio, DNS interno y Kerberos', 'DC1', '`10.20.72.11`', 'Tiene la zona interna `ad.arcedo.example`; lo que no es suyo lo reenvía a los resolutores del operador'],
            ['Controlador de dominio, DNS interno y Kerberos', 'DC2', '`10.20.72.12`', 'Igual que DC1'],
            ['Servidor NTP interno', 'NTP1', '`10.20.72.41`', 'Se sincroniza con servidores públicos de referencia'],
            ['Servidor NTP interno', 'NTP2', '`10.20.72.42`', 'Se sincroniza con servidores públicos de referencia'],
            ['Servidor DHCP', 'DHCP1', '`10.20.72.21`', 'En conmutación por error con DHCP2'],
            ['Servidor DHCP', 'DHCP2', '`10.20.72.22`', 'En conmutación por error con DHCP1'],
            ['Resolutores DNS del operador', '—', '`198.51.100.53` y `198.51.100.54`', 'Resuelven los nombres públicos. La zona `ad.arcedo.example` no está publicada en el proveedor de DNS externo: solo la tienen DC1 y DC2'],
          ],
        },
        {
          t: 'list',
          items: [
            '**Hora (decisión del Consorcio):** DC1, que tiene el rol de emulador de PDC, toma la hora de NTP1 y NTP2. DC2 y los equipos del dominio la toman por la jerarquía de dominio de Windows (comportamiento de Windows): DC2, de DC1, y los puestos, de un controlador del dominio; con DC2 sin sincronizar, de DC1. Los equipos que no son del dominio (conmutadores, encaminadores, servidores Linux) apuntan directamente a NTP1 y NTP2.',
            '**Agentes relay de DHCP:** las SVI de los conmutadores de distribución de la sede y el encaminador de cada oficina comarcal.',
            '**Oficinas comarcales:** llegan a la sede por la VPN MPLS del operador y salen a Internet a través de la sede.',
          ],
        },
      ],
    },
    {
      id: 'd-esquema',
      title: 'Esquema de los servicios de red',
      kind: 'diagram',
      diagram: {
        width: 760,
        height: 470,
        zones: [
          { label: 'Oficina comarcal', x: 16, y: 112, w: 190, h: 250 },
          { label: 'Sede central y CPD', x: 222, y: 112, w: 522, h: 346 },
        ],
        nodes: [
          { id: 'mpls', label: 'VPN MPLS', kind: 'cloud', x: 110, y: 50, sub: 'del operador' },
          { id: 'resop', label: 'Resolutores', kind: 'cloud', x: 300, y: 50, sub: 'del operador' },
          { id: 'inet', label: 'Internet', kind: 'cloud', x: 490, y: 50 },
          { id: 'refs', label: 'Referencias de hora', kind: 'cloud', x: 670, y: 50, sub: 'servidores públicos' },
          { id: 'enco', label: 'Encaminador', kind: 'router', x: 110, y: 180, sub: 'relay DHCP' },
          { id: 'pcofi', label: 'Puestos', kind: 'pc', x: 110, y: 300, sub: 'oficina comarcal' },
          { id: 'dist', label: 'Distribución', kind: 'l3switch', x: 320, y: 200, sub: 'SVI · relay DHCP' },
          { id: 'pcsede', label: 'Puestos', kind: 'pc', x: 320, y: 360, sub: 'sede, VLAN 10' },
          { id: 'ntp1', label: 'NTP1', kind: 'server', x: 500, y: 180 },
          { id: 'ntp2', label: 'NTP2', kind: 'server', x: 650, y: 180 },
          { id: 'dc1', label: 'DC1', kind: 'server', x: 500, y: 290, sub: 'DNS · Kerberos' },
          { id: 'dc2', label: 'DC2', kind: 'server', x: 650, y: 290, sub: 'DNS · Kerberos' },
          { id: 'dhcp1', label: 'DHCP1', kind: 'server', x: 500, y: 400 },
          { id: 'dhcp2', label: 'DHCP2', kind: 'server', x: 650, y: 400 },
        ],
        links: [
          { from: 'mpls', to: 'enco', label: 'acceso MPLS' },
          { from: 'mpls', to: 'dist', label: 'VPN MPLS' },
          { from: 'enco', to: 'pcofi' },
          { from: 'dist', to: 'pcsede', label: 'VLAN 10' },
          { from: 'dist', to: 'inet', label: 'salida a Internet' },
          { from: 'ntp1', to: 'refs', label: 'NTP' },
          { from: 'ntp2', to: 'refs', label: 'NTP' },
          { from: 'dc1', to: 'resop', label: 'reenvío' },
          { from: 'dist', to: 'dc1' },
          { from: 'dist', to: 'dc2' },
          { from: 'dist', to: 'dhcp1' },
          { from: 'dhcp1', to: 'dhcp2', label: 'conmutación por error' },
        ],
      },
    },
    {
      id: 'd-ntp',
      title: 'Hora: comprobaciones NTP de esta mañana',
      kind: 'log',
      unlockedBy: 'f1',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Estado de NTP1, NTP2 y DC2 y consulta manual desde DC2 (salida ilustrativa, sin sintaxis de fabricante)',
          text: `NTP1 · estado
  LI 0   estrato 2
  fuentes: ref-a (estrato 1, id de referencia «GPS»), ref-b (estrato 1, «GPS»)

NTP2 · estado
  LI 0   estrato 2
  fuentes: ref-a (estrato 1, «GPS»), ref-b (estrato 1, «GPS»)

DC1 (emulador de PDC) · estado
  LI 0   estrato 3
  fuentes: NTP1, NTP2

DC2 · estado
  LI 3   estrato 16
  fuente configurada: reloj local
  última sincronización con DC1: sábado 07:52:10

Puestos 10.20.10.137 y 10.20.10.212 frente a NTP1: desfase de milisegundos

Consulta manual de diagnóstico DC2 -> NTP1 (no cambia el reloj de DC2)
  petición en modo 3 (cliente); respuesta en modo 4 (servidor), LI 0, estrato 2
  T1  sale de DC2      (reloj de DC2)    lunes 09:32:30,000
  T2  llega a NTP1     (reloj de NTP1)   lunes 09:25:50,004
  T3  sale de NTP1     (reloj de NTP1)   lunes 09:25:50,006
  T4  llega a DC2      (reloj de DC2)    lunes 09:32:30,010`,
        },
      ],
    },
    {
      id: 'd-eventos',
      title: 'Registro centralizado: correlación de inicios de sesión',
      kind: 'log',
      unlockedBy: 'f1',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Lunes por la mañana · hora tal como la escribe cada fuente (salida ilustrativa, sin sintaxis de fabricante)',
          text: `hora      fuente          evento
08:12:04  cortafuegos     10.20.10.137 -> 10.20.72.12:88   permitido
08:18:44  10.20.72.12     autenticación de 10.20.10.137 rechazada: KRB_AP_ERR_SKEW
08:12:19  cortafuegos     10.20.10.137 -> 10.20.72.11:88   permitido
08:12:19  10.20.72.11     autenticación de 10.20.10.137 correcta
08:35:40  cortafuegos     10.20.10.212 -> 10.20.72.12:88   permitido
08:42:20  10.20.72.12     autenticación de 10.20.10.212 rechazada: KRB_AP_ERR_SKEW
08:36:02  cortafuegos     10.20.10.212 -> 10.20.72.11:88   permitido
08:36:02  10.20.72.11     autenticación de 10.20.10.212 correcta`,
        },
      ],
    },
    {
      id: 'd-directiva',
      title: 'Directiva Kerberos del dominio (extracto)',
      kind: 'norma',
      unlockedBy: 'f1',
      body: [
        { t: 'p', md: '**Directiva de dominio predeterminada** · Configuración del equipo › Configuración de Windows › Configuración de seguridad › Directivas de cuenta › Directiva Kerberos.' },
        {
          t: 'table',
          headers: ['Directiva', 'Valor en el dominio `ad.arcedo.example`'],
          rows: [
            ['Tolerancia máxima para la sincronización de los relojes de los equipos', '5 minutos: es el valor por defecto de Windows Server en la directiva de dominio predeterminada (valor del fabricante, admite de 1 a 99 999 minutos); el Consorcio no lo ha cambiado'],
          ],
        },
      ],
    },
    {
      id: 'd-cambios',
      title: 'Registro de cambios del Servicio de Informática (viernes a domingo)',
      kind: 'table',
      unlockedBy: 'f2',
      body: [
        {
          t: 'table',
          headers: ['Cuándo', 'Equipo', 'Cambio', 'Comprobación'],
          rows: [
            ['Viernes 15:10', 'DHCP1 y DHCP2', 'Ámbito de los puestos de la oficina comarcal de `10.20.9.0/24`: la opción 6 pasa de `10.20.72.11, 10.20.72.12` a `198.51.100.53, 198.51.100.54`. Cambio hecho en DHCP1 y replicado a DHCP2. Motivo de la petición: «que Internet vaya más rápido en la oficina»', 'Ninguna: la oficina ya había cerrado'],
            ['Viernes 18:00', 'Encaminador de la oficina comarcal', 'Actualización del sistema del equipo', 'Arranca; el relay de DHCP reenvía a DHCP1 y DHCP2'],
            ['Sábado 08:00 – 08:40', 'DC2', 'Traslado a otro anfitrión de virtualización', 'Arranca, replica con DC1 y responde a consultas DNS'],
            ['Sábado 10:30', 'Cortafuegos de la sede', 'Actualización de las firmas', 'Sin incidencias'],
          ],
        },
      ],
    },
    {
      id: 'd-ipconfig',
      title: 'Configuración IP del puesto 10.20.9.57 (oficina comarcal)',
      kind: 'log',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Extracto con el formato de la orden ipconfig /all (orden de Windows, valor del fabricante)',
          text: `Dirección IPv4 ............ 10.20.9.57
Máscara de subred ......... 255.255.255.0
Puerta de enlace .......... 10.20.9.1
Servidor DHCP ............. 10.20.72.21
Concesión obtenida ........ lunes 08:18
La concesión expira ....... lunes 16:18
Servidores DNS ............ 198.51.100.53
                            198.51.100.54
Sufijo DNS ................ ad.arcedo.example`,
        },
      ],
    },
    {
      id: 'd-nslookup',
      title: 'Consultas DNS desde un puesto de la oficina y otro de la sede',
      kind: 'log',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante',
          text: `Desde 10.20.9.57 (oficina comarcal)
  consulta SRV  _ldap._tcp.dc._msdcs.ad.arcedo.example
    servidor 198.51.100.53   ->  NXDOMAIN (RCODE 3)
  consulta A    intranet.ad.arcedo.example
    servidor 198.51.100.53   ->  NXDOMAIN (RCODE 3)
  consulta A    www.arcedo.example
    servidor 198.51.100.53   ->  203.0.113.10

Desde 10.20.10.137 (sede, VLAN 10)
  consulta SRV  _ldap._tcp.dc._msdcs.ad.arcedo.example
    servidor 10.20.72.11     ->  respuesta con autoridad (AA = 1)
      prioridad 0   peso 100   puerto 389   dc1.ad.arcedo.example
      prioridad 0   peso 100   puerto 389   dc2.ad.arcedo.example`,
        },
      ],
    },
    {
      id: 'd-ambito',
      title: 'Ámbito DHCP de los puestos de la oficina comarcal',
      kind: 'config',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Igual en DHCP1 y DHCP2 · extracto (sintaxis ilustrativa: cada fabricante usa sus propias órdenes)',
          text: `ámbito  «Oficina comarcal · puestos»
  subred       10.20.9.0/24
  intervalo    10.20.9.20 - 10.20.9.120

  opción 3   Router                    10.20.9.1
  opción 6   Domain Name Server        198.51.100.53  198.51.100.54
  opción 15  Domain Name               ad.arcedo.example
  opción 51  IP Address Lease Time     28800            # 8 horas
  opción 4   Time Server               10.20.72.41  10.20.72.42   # «para que los puestos tomen la hora de NTP1 y NTP2»`,
        },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'Separar los síntomas',
      context:
        'Lunes, 09:15. Llegan partes de la sede y de una oficina comarcal, y casi todos dicen lo mismo: «no puedo entrar». Antes de tocar nada, ordena lo que tienes: qué partes van juntos, qué no tiene que ver y por dónde empezar a mirar en cada caso.',
      carry:
        'Hay dos averías. En la sede, inicios de sesión y accesos que fallan a ratos con un mensaje sobre la diferencia de hora, y unos registros que no cuadran; en la oficina comarcal, ningún nombre interno se resuelve mientras Internet funciona. Se mira primero la hora de los controladores de dominio y, en la oficina, qué servidores DNS reciben los puestos. El tóner es otra historia.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'table',
          topic: 'op3m4',
          prompt: 'Clasifica cada parte según lo que lo provoca.',
          fields: [
            { id: 'grupo', label: 'Grupo', options: ['Hora y autenticación', 'Resolución de nombres interna', 'Ajeno a la avería'] },
          ],
          rows: [
            { id: 'p1', label: 'P1 · sede: entra al segundo intento, mensaje de diferencia de hora', answer: { grupo: 'Hora y autenticación' } },
            { id: 'p2', label: 'P2 · oficina: Internet sí, la intranet no', answer: { grupo: 'Resolución de nombres interna' } },
            { id: 'p3', label: 'P3 · oficina: no encuentra ningún controlador de dominio', answer: { grupo: 'Resolución de nombres interna' } },
            { id: 'p4', label: 'P4 · sede: la aplicación pide la contraseña a ratos', answer: { grupo: 'Hora y autenticación' } },
            { id: 'p5', label: 'P5 · sede: impresora sin tóner', answer: { grupo: 'Ajeno a la avería' } },
            { id: 'p6', label: 'P6 · registros de un controlador por delante del cortafuegos', answer: { grupo: 'Hora y autenticación' } },
          ],
          points: 8,
          explain:
            'En la sede los fallos son intermitentes y hablan de la hora: P1 entra al segundo intento y P4 a ratos sí y a ratos no, como si unas veces le tocara un controlador de dominio que funciona y otras uno que no. P6 es la misma avería vista desde los registros: un reloj adelantado firma sus eventos con otra hora. En la oficina, en cambio, falla todo nombre interno y no aparece la hora por ningún lado. P3 es la trampa: dice «no puedo iniciar sesión», como los de la sede, pero el mensaje es que no encuentra ningún controlador, y para encontrarlo el puesto necesita resolver nombres de la zona interna. El tóner no tiene nada que ver.',
          refs: [L4, L2, RFC4120],
        },
        {
          id: 'f1t2',
          kind: 'choice',
          topic: 'op3m2',
          prompt: 'Alguien propone tratarlo todo como una sola avería de los controladores de dominio. ¿Qué dato de los partes y del inventario lo desmiente?',
          options: [
            { id: 'a', text: 'Ninguno: en la sede y en la oficina falla el inicio de sesión, así que la causa tiene que ser la misma' },
            { id: 'b', text: 'En la oficina falla todo nombre interno, también la intranet, mientras Internet funciona y nadie habla de la hora; en la sede los fallos van y vienen y el mensaje habla de la diferencia de hora' },
            { id: 'c', text: 'Que la oficina llega a la sede por la VPN MPLS: lo de la oficina es una caída del acceso MPLS' },
            { id: 'd', text: 'Que es lunes: son contraseñas caducadas durante el fin de semana' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'Los síntomas son distintos: en la oficina falla siempre todo lo que lleva un nombre de `ad.arcedo.example` y no hay mensajes de hora; en la sede, el mismo puesto entra o no según el intento. Tienta pensar en el acceso MPLS, pero según el inventario del caso la oficina sale a Internet a través de la sede: si P2 navega, la oficina llega a la sede. Las contraseñas caducadas no explican que P1 entre al segundo intento con la misma contraseña. Que el síntoma se diga igual («no puedo entrar») no significa que la causa sea la misma.',
          refs: [L2, L4, LWAN],
        },
        {
          id: 'f1t3',
          kind: 'choice',
          topic: 'op3m4',
          prompt: '¿Por dónde empiezas a mirar en cada grupo?',
          options: [
            { id: 'a', text: 'Sede: subir la tolerancia de Kerberos para que deje de fallar. Oficina: reiniciar el encaminador' },
            { id: 'b', text: 'Sede: comparar la hora de DC1, DC2 y los puestos con la de NTP1 y NTP2. Oficina: ver qué servidores DNS ha recibido un puesto y si resuelve los registros SRV del dominio' },
            { id: 'c', text: 'Sede y oficina: desbloquear las cuentas de los usuarios afectados' },
            { id: 'd', text: 'Sede: reinstalar los puestos que fallan. Oficina: cambiar el agente relay por otro' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'Primero se mide, después se cambia. Kerberos exige que los relojes estén razonablemente sincronizados (RFC 4120), así que en la sede lo primero es comparar la hora de los controladores con la de las fuentes internas. En la oficina, el puesto tiene dirección e Internet, así que lo que hay que mirar es qué DNS le ha dado DHCP y si con él encuentra los registros SRV que localizan los controladores. Subir la tolerancia tienta porque «quita el error», pero esconde el desfase sin arreglarlo; reiniciar o reinstalar a ciegas no dice nada de la causa.',
          refs: [L4, L2, L3, RFC4120],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'La hora',
      context:
        'En el expediente tienes ahora las comprobaciones NTP de esta mañana, la correlación del registro centralizado y la directiva Kerberos del dominio. Averigua qué reloj se ha ido, cuánto y por qué eso rompe los inicios de sesión.',
      carry:
        'DC2 está en LI 3 y estrato 16: no está sincronizado. Va 400 s (6 minutos y 40 segundos) adelantado respecto a NTP1, más de los 5 minutos que tolera Kerberos en el dominio (valor por defecto de Windows Server), así que rechaza con KRB_AP_ERR_SKEW a los puestos que lo eligen y sus registros llevan la hora adelantada. NTP1 y NTP2 están bien, en estrato 2.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'table',
          topic: 'op3m4',
          prompt: 'Con las comprobaciones NTP, ¿en qué estado está cada reloj?',
          fields: [
            {
              id: 'estado',
              label: 'Estado',
              options: ['Servidor primario', 'Servidor secundario sincronizado', 'No sincronizado', 'Estrato sin especificar o no válido'],
            },
          ],
          rows: [
            { id: 'refa', label: 'ref-a (estrato 1, «GPS»)', answer: { estado: 'Servidor primario' } },
            { id: 'ntp1', label: 'NTP1 (LI 0, estrato 2)', answer: { estado: 'Servidor secundario sincronizado' } },
            { id: 'ntp2', label: 'NTP2 (LI 0, estrato 2)', answer: { estado: 'Servidor secundario sincronizado' } },
            { id: 'dc2', label: 'DC2 (LI 3, estrato 16)', answer: { estado: 'No sincronizado' } },
          ],
          points: 5,
          explain:
            'En NTPv4 (RFC 5905), el estrato 1 es el servidor primario, el que tiene la referencia (aquí un receptor GPS); del 2 al 15 son servidores secundarios que se sincronizan por NTP; el 16 significa «no sincronizado» y el 0, «sin especificar o no válido». DC2 lo dice dos veces, con dos campos distintos: LI 3 («reloj no sincronizado») y estrato 16. La trampa es leer el 16 como «el servidor más lejano, pero válido»: no es un escalón más de la jerarquía, es la señal de que ese reloj no sigue a nadie.',
          refs: [L4, RFC5905],
        },
        {
          id: 'f2t2',
          kind: 'numeric',
          topic: 'op3m4',
          prompt: 'Con las cuatro marcas de la consulta manual, calcula el desfase θ de NTP1 respecto a DC2, en segundos y con su signo (por ejemplo, -12,5 o 3).',
          answer: -400,
          tolerance: 0.01,
          unit: 's',
          points: 5,
          hint: { text: 'θ = ½ [(T2 − T1) + (T3 − T4)]. T1 y T4 son del reloj de DC2; T2 y T3, del de NTP1.', cost: 1 },
          explain:
            'T2 − T1 = 09:25:50,004 − 09:32:30,000 = −399,996 s; T3 − T4 = 09:25:50,006 − 09:32:30,010 = −400,004 s. La suma es −800,000 y la mitad, θ = −400 s: NTP1 va 400 s por detrás de DC2, es decir, DC2 va 400 s (6 minutos y 40 segundos) adelantado. El signo es lo que se confunde: θ es lo que habría que sumar al reloj de quien pregunta (DC2) para ponerlo en hora, y aquí hay que restar. Responder +400 es darle la vuelta a la fórmula.',
          refs: [L4, RFC5905],
        },
        {
          id: 'f2t3',
          kind: 'numeric',
          topic: 'op3m4',
          prompt: 'Con las mismas marcas, ¿cuánto vale el retardo δ de ida y vuelta, en milisegundos?',
          answer: 8,
          tolerance: 0.01,
          unit: 'ms',
          points: 3,
          explain:
            'δ = (T4 − T1) − (T3 − T2) = 0,010 s − 0,002 s = 0,008 s = 8 ms. El retardo resta el tiempo que NTP1 tardó en contestar (T3 − T2) del tiempo total que vio DC2 (T4 − T1), así que no le afecta que los dos relojes difieran: cada resta usa marcas de un mismo reloj. Tienta mezclar marcas de relojes distintos (T2 − T1), que da casi 400 s.',
          refs: [L4, RFC5905],
        },
        {
          id: 'f2t4',
          kind: 'multi',
          topic: 'op3m4',
          prompt: 'Marca **todas** las afirmaciones ciertas sobre el desfase de DC2.',
          options: [
            { id: 'a', text: 'El desfase calculado supera la tolerancia de Kerberos del dominio, que es de 5 minutos por ser el valor por defecto de Windows Server' },
            { id: 'b', text: 'Los 5 minutos los fija la RFC 4120 como valor obligatorio, y ningún dominio puede cambiarlos' },
            { id: 'c', text: 'Un programa NTP que siga la RFC 5905 corregiría el desfase calculado de un salto, no poco a poco: pasa de 125 ms y no llega a 1000 s' },
            { id: 'd', text: 'Si el desfase fuera de 20 minutos, ese programa daría el mismo salto' },
            { id: 'e', text: 'El estrato 16 indica el servidor más alejado de la referencia que todavía se puede usar' },
            { id: 'f', text: 'LI 3 y estrato 16 son dos campos distintos que aquí dicen lo mismo: el reloj no está sincronizado' },
          ],
          answer: ['a', 'c', 'f'],
          points: 5,
          explain:
            'La RFC 4120 pide relojes «loosely synchronized» y pone 5 minutos como ejemplo de una holgura que se configura; el valor de 5 minutos en un dominio lo fija Microsoft en la directiva de dominio predeterminada, y 400 s lo supera, por eso aparece KRB_AP_ERR_SKEW (código 37). Que la RFC «obligue» a 5 minutos es la confusión más habitual. En la disciplina del reloj de la RFC 5905, por debajo de 125 ms (STEPT) se ajusta poco a poco, entre 125 ms y 1000 s (PANICT) se da un salto, y por encima de 1000 s el programa debería salir con un diagnóstico: 20 minutos son 1200 s, así que no saltaría. El estrato 16 no es un escalón más: es «no sincronizado», lo mismo que dice LI 3 en otro campo.',
          refs: [L4, RFC5905, RFC4120, MS_KERB],
        },
        {
          id: 'f2t5',
          kind: 'cite',
          topic: 'op3m4',
          prompt: 'El registro centralizado y el cortafuegos identifican los equipos por su dirección. Señala los documentos que, juntos, prueban qué servidor escribe sus registros con la hora adelantada.',
          answerSets: [['d-eventos', 'd-inventario'], ['d-eventos', 'd-inventario', 'd-ntp']],
          points: 4,
          explain:
            'En la correlación, para los mismos intentos, el cortafuegos y `10.20.72.11` escriben la misma hora, y `10.20.72.12` escribe 6 minutos y 40 segundos más: 08:12:04 frente a 08:18:44, y 08:35:40 frente a 08:42:20. Pero la correlación solo da direcciones; es el inventario el que dice que `10.20.72.12` es DC2. Añadir las comprobaciones NTP no resta: confirman que DC2 va adelantado, pero por sí solas no dan su dirección, así que no sustituyen al inventario. El esquema no lleva direcciones. Los partes solo dicen «uno de los controladores».',
          refs: [L4, RFC4120],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'El DNS de la oficina y el origen de las dos averías',
      context:
        'Un técnico ha mirado un puesto de la oficina y ha hecho unas consultas DNS desde la oficina y desde la sede. También tienes el ámbito DHCP de la oficina y el registro de cambios del fin de semana. Averigua qué falla en la oficina y de dónde viene cada avería.',
      carry:
        'Oficina: el viernes a las 15:10 se puso en la opción 6 del ámbito a los resolutores del operador, que no tienen la zona interna `ad.arcedo.example`; sin los registros SRV, los puestos no encuentran ningún controlador de dominio. El relay y la elección del ámbito funcionan. La opción 4 del ámbito no sirve para NTP (es la del protocolo de hora de la RFC 868; la de NTP es la 42), pero no causa esta avería. DC2: desde el traslado del sábado tiene como fuente su propio reloj local.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'multi',
          topic: 'op3m2',
          prompt: 'Marca **todo** lo que demuestran la configuración IP del puesto y las consultas DNS.',
          options: [
            { id: 'a', text: 'El relay y la elección del ámbito funcionan: el puesto tiene una dirección de `10.20.9.0/24` y la puerta de enlace `10.20.9.1`, que le dio DHCP1' },
            { id: 'b', text: 'El puesto pregunta a los resolutores del operador, que contestan los nombres públicos pero no tienen la zona interna `ad.arcedo.example`' },
            { id: 'c', text: 'Sin el registro SRV `_ldap._tcp.dc._msdcs.ad.arcedo.example` (Active Directory, valor de Microsoft), el puesto no puede localizar ningún controlador de dominio' },
            { id: 'd', text: 'El servicio DNS de DC1 y DC2 está caído' },
            { id: 'e', text: 'Los resolutores del operador están averiados: NXDOMAIN es un fallo del servidor' },
            { id: 'f', text: 'El relay de la oficina reenvía las peticiones a un servidor DHCP que no es del Consorcio' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'El puesto tiene dirección, máscara y puerta de enlace correctas y su servidor DHCP es `10.20.72.21`: el relay rellenó bien su campo y el servidor eligió el ámbito correcto. Lo que falla es la opción 6: pregunta a `198.51.100.53`, que resuelve `www.arcedo.example` pero responde NXDOMAIN para la zona interna. NXDOMAIN es el RCODE 3, «el nombre no existe», una respuesta correcta para quien no tiene esa zona; un fallo del servidor sería el RCODE 2 (SERVFAIL). Los controladores se localizan con registros SRV bajo `_msdcs` (así lo hace Active Directory, valor del fabricante), y sin ellos el puesto no encuentra ninguno. DC1 funciona: desde la sede devuelve los dos SRV con autoridad.',
          refs: [L2, L1, L3, RFC1035, RFC2782, RFC9499, MS_SRV],
        },
        {
          id: 'f3t2',
          kind: 'table',
          topic: 'op3m3',
          prompt: 'Revisa una por una las opciones del ámbito de la oficina.',
          fields: [
            { id: 'veredicto', label: 'Veredicto', options: ['Correcta', 'Causa de la avería de hoy', 'Incorrecta, pero no causa la avería de hoy'] },
          ],
          rows: [
            { id: 'o3', label: 'Opción 3 (Router): `10.20.9.1`', answer: { veredicto: 'Correcta' } },
            { id: 'o6', label: 'Opción 6 (Domain Name Server): `198.51.100.53`, `198.51.100.54`', answer: { veredicto: 'Causa de la avería de hoy' } },
            { id: 'o15', label: 'Opción 15 (Domain Name): `ad.arcedo.example`', answer: { veredicto: 'Correcta' } },
            { id: 'o51', label: 'Opción 51 (IP Address Lease Time): 28800', answer: { veredicto: 'Correcta' } },
            { id: 'o4', label: 'Opción 4 (Time Server): `10.20.72.41`, `10.20.72.42`, «para que los puestos tomen la hora de NTP1 y NTP2»', answer: { veredicto: 'Incorrecta, pero no causa la avería de hoy' } },
          ],
          points: 6,
          explain:
            'La opción 6 debe llevar los servidores DNS que tienen la zona interna, DC1 y DC2; con los del operador, los nombres internos no existen. La 3 es la puerta de enlace de la subred, la 15 el dominio de los puestos y la 51 da 28800 s, las 8 horas de concesión. La 4 es la trampa: «Time Server» es el protocolo de hora de la RFC 868, no NTP; los servidores NTP van en la opción 42 (RFC 2132). Está mal para lo que pretende el comentario, pero no explica que fallen los nombres de la oficina. Se arregla aparte retirándola: los puestos del dominio toman la hora por la jerarquía de dominio, y para anunciar servidores NTP por DHCP la opción sería la 42.',
          refs: [L3, RFC2132],
        },
        {
          id: 'f3t3',
          kind: 'cite',
          topic: 'op3m3',
          prompt: 'Señala los documentos que, juntos, prueban que los puestos de la oficina recibieron por DHCP el DNS equivocado después del cambio del viernes.',
          answerSets: [['d-cambios', 'd-ipconfig']],
          points: 4,
          explain:
            'El registro de cambios fecha el cambio de la opción 6 el viernes a las 15:10, y la configuración del puesto muestra una concesión obtenida el lunes a las 08:18 de DHCP1 con esos mismos servidores DNS. Hacen falta los dos: uno dice cuándo cambió el ámbito y el otro, que el puesto lo recibió después. El ámbito tienta, pero solo enseña el valor que tiene ahora, no desde cuándo ni que un puesto lo haya recibido; las consultas DNS muestran a qué servidor pregunta el puesto, no de dónde lo sacó.',
          refs: [L3, RFC2131],
        },
        {
          id: 'f3t4',
          kind: 'cite',
          topic: 'op3m4',
          prompt: 'Señala los documentos que, juntos, prueban que DC2 se quedó sin fuente de hora por la intervención del sábado.',
          answerSets: [['d-cambios', 'd-ntp']],
          points: 4,
          explain:
            'Las comprobaciones NTP dicen que la fuente configurada de DC2 es su reloj local y que su última sincronización con DC1 fue el sábado a las 07:52; el registro de cambios pone el traslado de DC2 a otro anfitrión de virtualización el sábado entre las 08:00 y las 08:40, y su comprobación no miró la hora. Con uno solo no basta: las comprobaciones dicen qué pasa, pero no qué se hizo justo después de la última sincronización. La correlación de eventos tienta, pero solo muestra el lunes.',
          refs: [L4, RFC5905],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'Corregir en orden y comprobar',
      context:
        'Ya sabes qué ha pasado. Toca arreglarlo sin crear otro problema: cada avería se cierra entera, con su corrección y su comprobación, antes de pasar a la otra, y hay que elegir cuál va primero para que la segunda corrección no tropiece con la primera avería.',
      carry:
        'DC2 vuelve a tomar la hora de DC1 por la jerarquía de dominio. Primero se cerró la hora (corrección, comprobación en DC2 y un inicio de sesión contra él) y después el DNS de la oficina (opción 6 con DC1 y DC2, renovación de las concesiones y comprobación de los SRV), porque los puestos de la oficina, una vez encuentren los controladores, también pueden tocar con DC2. Con la concesión de 8 horas, un puesto renueva por su cuenta a las 4 horas (T1), en unidifusión con su servidor, y a las 7 (T2) lo intenta por difusión con cualquiera.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'choice',
          topic: 'op3m4',
          prompt: '¿Qué corrección aplicas en DC2?',
          options: [
            { id: 'a', text: 'Subir a 10 minutos la tolerancia de Kerberos en la directiva del dominio' },
            { id: 'b', text: 'Devolver DC2 a la jerarquía de dominio, para que tome la hora de DC1 (emulador de PDC), y comprobar que deja de estar en estrato 16 y que su desfase con NTP1 baja a milisegundos' },
            { id: 'c', text: 'Poner en hora DC2 a mano y dejar su configuración como está' },
            { id: 'd', text: 'Configurar DC2 para que tome la hora directamente de los servidores públicos de referencia' },
          ],
          answer: 'b',
          points: 5,
          explain:
            'La causa es que DC2 no tiene fuente: hay que devolverlo a la jerarquía de dominio de Windows (comportamiento de Windows), en la que toma la hora de DC1, el emulador de PDC, que a su vez la toma de NTP1 y NTP2, y comprobarlo. Subir la tolerancia tienta porque el error desaparece, pero DC2 sigue sin sincronizar, el desfase crece cuando quiera y los registros siguen sin cuadrar. Ponerla a mano arregla la hora de hoy, pero con el reloj local como fuente seguirá en estrato 16 y volverá a desviarse. Ir a las referencias públicas se salta la jerarquía decidida, en la que solo NTP1 y NTP2 hablan con el exterior y solo el emulador de PDC habla con ellos entre los controladores.',
          refs: [L4, RFC5905, RFC4120, MS_KERB],
        },
        {
          id: 'f4t2',
          kind: 'order',
          topic: 'op3m4',
          prompt: 'Ordena los pasos para cerrar las dos averías.',
          items: [
            { id: 'o4', text: 'Volver a poner DC1 y DC2 (`10.20.72.11` y `10.20.72.12`) en la opción 6 del ámbito de la oficina' },
            { id: 'o2', text: 'Comprobar que DC2 está en LI 0 y estrato 4 y que su desfase con NTP1 es de milisegundos' },
            { id: 'o6', text: 'Comprobar desde un puesto de la oficina que `_ldap._tcp.dc._msdcs.ad.arcedo.example` (Active Directory, valor de Microsoft) devuelve los dos controladores y que se inicia sesión' },
            { id: 'o1', text: 'Corregir la fuente de hora de DC2 (lo elegido en la tarea anterior)' },
            { id: 'o5', text: 'Hacer que los puestos de la oficina renueven su concesión' },
            { id: 'o3', text: 'Comprobar que un puesto de la sede inicia sesión contra DC2 sin KRB_AP_ERR_SKEW' },
          ],
          answer: ['o1', 'o2', 'o3', 'o4', 'o5', 'o6'],
          points: 8,
          explain:
            'Primero la hora: si se arreglara antes el DNS, los puestos de la oficina encontrarían los dos controladores y la mitad de las veces chocarían con DC2, y el arreglo parecería no haber funcionado. Dentro de cada avería, corregir, comprobar la pieza corregida y después probar lo que ve el usuario: DC2 en estrato 4 (uno más que DC1, que está en el 3) antes del inicio de sesión. En la oficina, cambiar el ámbito no basta: cada puesto conserva el DNS viejo hasta que renueva su concesión, así que la comprobación de los SRV va después de la renovación. Tienta empezar por la oficina porque está «más caída», pero lo que depende de la hora es su comprobación con inicio de sesión: hecha antes de arreglar DC2, podría fallar sin que el DNS tuviera la culpa.',
          refs: [L4, L3, L2, RFC5905, RFC2131],
        },
        {
          id: 'f4t3',
          kind: 'numeric',
          topic: 'op3m3',
          prompt: 'El ámbito no envía las opciones 58 ni 59. Sin contar el pequeño margen aleatorio que permite la norma, ¿cuántas horas después de obtener su concesión de 8 horas pasa un puesto a REBINDING si su servidor no le ha contestado mientras renovaba?',
          answer: 7,
          unit: 'horas',
          points: 4,
          explain:
            'En DHCPv4 (RFC 2131), T1 vale por defecto 0,5 de la concesión y T2, 0,875: con 8 horas, T1 a las 4 horas (RENEWING) y T2 a las 7 (REBINDING). Responder 6,4 es usar el 0,8 que se recomienda en DHCPv6, otra norma; responder 4 es confundir T2 con T1.',
          refs: [L3, RFC2131, RFC2132],
        },
        {
          id: 'f4t4',
          kind: 'multi',
          topic: 'op3m3',
          prompt: 'Sobre la renovación de las concesiones en la oficina, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'En T1 el puesto envía un DHCPREQUEST en unidifusión al servidor que le dio la concesión' },
            { id: 'b', text: 'En T2 lo envía por difusión, a cualquier servidor' },
            { id: 'c', text: 'En DHCPv4, T2 vale por defecto 0,8 de la concesión' },
            { id: 'd', text: 'El servidor puede obligar a renovar con DHCPFORCERENEW, y la RFC 3203 no exige nada especial a ese mensaje' },
            { id: 'e', text: 'La opción 82 que añade el encaminador de la oficina llega al puesto dentro del DHCPACK' },
            { id: 'f', text: 'Cuando un puesto empieza de cero, el relay rellena `giaddr` con su dirección, y por ella el servidor elige el ámbito de la oficina' },
          ],
          answer: ['a', 'b', 'f'],
          points: 5,
          explain:
            'Renovar no es lo mismo que reasociarse: en T1 (RENEWING) el DHCPREQUEST va en unidifusión al mismo servidor; en T2 (REBINDING), por difusión a cualquiera. El servidor elige el ámbito por la subred por la que llega el mensaje o, si `giaddr` no es cero, por la dirección del relay. El 0,8 es de DHCPv6; en DHCPv4, T2 es 0,875. DHCPFORCERENEW (mensaje 9, RFC 3203) existe, pero ese mensaje «MUST be authenticated». La opción 82 la pone el relay, el servidor la devuelve tal cual y el relay la quita antes de entregar la respuesta: el puesto nunca la ve.',
          refs: [L3, RFC2131, RFC3203, RFC3046],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Parte de cierre',
      context:
        'Son las 12:00 y todo funciona. La jefatura del Servicio de Informática y Comunicaciones y la Unidad de Seguridad de la Información esperan el parte de cierre: qué pasó, qué se hizo y en qué orden, cómo se comprobó, qué consecuencias quedan y qué se propone para que no se repita.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'written',
          topic: 'op3m4',
          prompt: 'Redacta el parte de cierre en **180 a 260 palabras**. Después, compáralo con el modelo y marca los criterios que cumple.',
          words: 260,
          model:
            'Hubo dos averías independientes. Primera: desde su traslado del sábado, DC2 tomaba la hora de su reloj local y estaba sin sincronizar (LI 3, estrato 16); el lunes iba 400 s por delante de NTP1. Como la tolerancia de Kerberos del dominio es de 5 minutos (valor por defecto de Windows Server), DC2 rechazaba con KRB_AP_ERR_SKEW a los puestos de la sede que lo elegían. Segunda: el viernes se pusieron en la opción 6 del ámbito de la oficina los resolutores del operador, que no tienen la zona ad.arcedo.example; sin los registros SRV, los puestos no encontraban ningún controlador.\n\n' +
            'Se corrigió primero la hora, para que la oficina no tropezara después con DC2: DC2 vuelve a tomar la hora de DC1, está en estrato 4 con un desfase de milisegundos y un puesto de la sede inicia sesión contra él. Después se devolvieron DC1 y DC2 a la opción 6, se renovaron las concesiones y un puesto de la oficina resuelve los SRV e inicia sesión.\n\n' +
            'Los registros de DC2, desde su última sincronización (sábado, 07:52) hasta la corrección, llevan un desfase que el lunes era de 400 s y que antes no se conoce: hay que acotarlo antes de correlacionarlos.\n\n' +
            'Propuestas: avisar si un servidor está en estrato 16 o LI 3, probar cada cambio de DHCP antes de cerrarlo y retirar la opción 4 del ámbito, porque los puestos del dominio toman la hora por la jerarquía (para anunciar NTP por DHCP sería la 42).',
          rubric: [
            { id: 'r1', text: 'Separa las dos causas, cada una con su efecto: DC2 sin fuente de hora y adelantado (fallos de Kerberos intermitentes en la sede) y la opción 6 con los resolutores del operador (la oficina sin nombres internos ni controlador de dominio)', points: 4 },
            { id: 'r2', text: 'Dice qué se corrigió y en qué orden, y explica por qué la hora va primero', points: 4 },
            { id: 'r3', text: 'Dice cómo se comprobó cada corrección: el estado y el desfase de DC2, un inicio de sesión, y la resolución de los SRV desde la oficina después de renovar', points: 4 },
            { id: 'r4', text: 'Avisa de que los registros de DC2 llevan un desfase desde su última sincronización (sábado, 07:52) hasta la corrección, que solo se conoce el lunes (400 s), y de que hay que acotarlo antes de correlacionarlos', points: 3 },
            { id: 'r5', text: 'Propone medidas concretas: vigilar el estrato o el LI, probar los cambios de DHCP y retirar la opción 4 (los puestos del dominio toman la hora por la jerarquía; para anunciar NTP por DHCP sería la 42)', points: 3 },
            { id: 'r6', text: 'Rotula como de fabricante lo que lo es (los 5 minutos de Kerberos son valor de Windows Server)', points: 1 },
            { id: 'r7', text: 'Tiene entre 180 y 260 palabras', points: 1 },
          ],
          points: 20,
          explain:
            'Un parte de cierre tiene que dejar claro que fueron dos causas y no una, porque cada una tiene su arreglo y su medida para el futuro. Tienta contar solo lo que se tocó, pero a la Unidad de Seguridad le importa igual lo que queda: unos registros con una hora desconocida desde el sábado no valen para reconstruir qué pasó si nadie lo apunta, y el registro de la actividad del ENS exige la fecha y la hora de cada evento. Los 5 minutos de Kerberos se rotulan como valor de Windows Server, no como norma.',
          refs: [L4, L2, L3, ENS_A2, MS_KERB],
        },
      ],
    },
  ],
  sources: [L1, L2, L3, L4, LWAN, RFC1034, RFC1035, RFC2782, RFC9499, RFC2131, RFC2132, RFC3046, RFC3203, RFC5905, RFC4120, MS_KERB, MS_SRV, ENS_A2],
};

export default op3s2;
