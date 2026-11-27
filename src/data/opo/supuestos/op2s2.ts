import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op2s2 — «La excavadora y el túnel» (bloque 2, Infraestructuras de
// comunicaciones; avería del túnel IPsec de respaldo de una oficina).
//
// Fuente única: docs/superpowers/sources/2026-11-27-op2-fuentes.md (RFC 7296,
// 3948, 8221, 8247, 9395, 4106, 1191, 8201, 4459, 9293 y NIST SP 800-77r1).
// Canon: §3, §6 y §7e de docs/superpowers/canon/arcedo.md (WAN principal MPLS
// de capa 3 y respaldo IPsec por Internet de otro proveedor; el encaminador
// central termina los túneles en 203.0.113.10 con IKEv2 por UDP 500 y 4500;
// accesos de respaldo 198.51.100.31/.32/.33; oficina 10.20.9.0/24 con puerta
// 10.20.9.1, de op3s2; servidor de expedientes 10.20.72.10:443; eBGP «el
// Consorcio con su operador», de op1m4). Coherente con el jefe de op2 (TÚNEL
// APAGADO / EL RESPALDO QUE NADIE PROBÓ).
// Hechos nuevos del caso (ver el informe de la tarea):
// - La oficina es la de 10.20.9.0/24 y su acceso de respaldo es 198.51.100.32.
// - El lunes de la semana anterior, el proveedor de respaldo cambió su equipo
//   por uno con NAT: la pública 198.51.100.32 queda en ese equipo (192.168.1.1
//   hacia dentro) y el encaminador de la oficina pasa a 192.168.1.2/24. El NAT
//   cambia el puerto de origen (61702 en el registro). Filtro de salida del
//   equipo: perfil «paso de IPsec» (UDP 500 y protocolo IP 50) más DNS y web;
//   el resto, cerrado. Entradas UDP del NAT: caducan a los 60 s sin tráfico.
//   MTU del acceso: 1500. Todo, dato del proveedor.
// - Configuración del túnel (sintaxis ilustrativa): VPN por ruta, interfaz
//   tun-respaldo en la oficina y tun-32 en la sede, selectores 0.0.0.0/0,
//   clave precompartida, reintento de IKE cada 30 s. El túnel arranca cuando
//   cae la sesión eBGP con el operador y se queda arriba hasta que alguien lo
//   baja. El filtro del proveedor deja salir también el eco ICMP.
// - Corrección de la MTU a las 11:50 (solo en el carry de f3). Unas veinte
//   personas en la oficina. Segunda fibra por otro trazado pedida por el
//   Consorcio, presupuesto pendiente (aviso del operador, como en el jefe).
// - Hace dos meses la sede endureció su perfil IKEv2 «OFICINAS» (fuera 3DES,
//   SHA-1 y grupos 2 y 5); la oficina .32 quedó pendiente con el perfil
//   «oficina-v1», importado de una configuración de IKEv1.
// - Encaminamiento PE-CE por eBGP en las dos puntas (configuración del caso).
//   Distancias en la escala del fabricante de los encaminadores, iguales a los
//   valores por defecto de Cisco que da op1m4: eBGP 20, estática 1. La estática
//   de respaldo de la sede (tun-32) va con 250; la de la oficina quedó con 1.
// - Cortafuegos de la sede entre el encaminador central y el CPD, regla 14
//   «ICMP hacia el CPD: solo eco».
// - Cronología (un martes y el miércoles, sin fecha): 09:14:04 cae el MPLS
//   (excavadora); 10:05 la guardia corrige la dirección local; 10:20 el
//   proveedor abre UDP 4500; 10:48:02 perfil oficina-v2; 10:48:04 SA hija;
//   11:05 quejas de descargas; 17:02 empalme; 17:06:30 la sede vuelve a usar el
//   MPLS; miércoles 08:56:30 tabla de rutas de la oficina.
// - Puesto de la oficina 10.20.9.57 (dato de ejercicio de op3s2).
// ---------------------------------------------------------------------------

const L_IPSEC = { label: 'Lección: VPN IPsec e IKEv2', href: '/learn/op2m2' };
const L_CENTROS = { label: 'Lección: conectividad entre centros (doble acceso y respaldo)', href: '/learn/op2m5' };
const L_RUTAS = { label: 'Lección: encaminamiento (distancia administrativa, ruta flotante, BGP)', href: '/learn/op1m4' };
const L_NAT = { label: 'Lección: direccionamiento IPv4 y NAT', href: '/learn/op1m2' };
const L_WAN = { label: 'Lección: WAN (VPN MPLS y clase de servicio para la voz)', href: '/learn/op1m5' };
const RFC7296 = { label: 'RFC 7296: IKEv2 (§1.2, §2.4, §2.23)', href: 'https://www.rfc-editor.org/rfc/rfc7296' };
const RFC3948 = { label: 'RFC 3948: ESP encapsulado en UDP y NAT-keepalive', href: 'https://www.rfc-editor.org/rfc/rfc3948' };
const RFC8247 = { label: 'RFC 8247: algoritmos para IKEv2', href: 'https://www.rfc-editor.org/rfc/rfc8247' };
const RFC8221 = { label: 'RFC 8221: algoritmos para ESP y AH', href: 'https://www.rfc-editor.org/rfc/rfc8221' };
const RFC9395 = { label: 'RFC 9395: IKEv1 y algoritmos obsoletos', href: 'https://www.rfc-editor.org/rfc/rfc9395' };
const RFC4106 = { label: 'RFC 4106: AES-GCM en ESP (§7, crecimiento del paquete)', href: 'https://www.rfc-editor.org/rfc/rfc4106' };
const RFC1191 = { label: 'RFC 1191: descubrimiento de la MTU del camino', href: 'https://www.rfc-editor.org/rfc/rfc1191' };
const RFC8201 = { label: 'RFC 8201: PMTUD en IPv6 («black-hole connection»)', href: 'https://www.rfc-editor.org/rfc/rfc8201' };
const RFC4459 = { label: 'RFC 4459: MTU y túneles (MSS clamping)', href: 'https://www.rfc-editor.org/rfc/rfc4459' };
const RFC9293 = { label: 'RFC 9293: TCP (opción MSS)', href: 'https://www.rfc-editor.org/rfc/rfc9293' };
const RFC9329 = { label: 'RFC 9329: IKE y ESP encapsulados en TCP', href: 'https://www.rfc-editor.org/rfc/rfc9329' };
const SP80077 = { label: 'NIST SP 800-77 Rev. 1: guía de VPN IPsec', href: 'https://csrc.nist.gov/pubs/sp/800/77/r1/final' };

/** Cada conjunto base más cualquier combinación de documentos que solo suman. */
const withExtras = (base: string[], extras: string[]): string[][] =>
  Array.from({ length: 2 ** extras.length }, (_, mask) => [...base, ...extras.filter((_, i) => mask & (1 << i))]);

const op2s2: Supuesto = {
  id: 'op2s2',
  track: 'opo',
  sectionIds: ['op2'],
  version: 1,
  title: 'La excavadora y el túnel',
  brief:
    'Una excavadora corta la fibra del operador y una oficina comarcal se queda sola: el túnel IPsec de respaldo no levanta. Sigue la cadena de fallos que nadie había probado (un NAT nuevo, propuestas que ya no casan, una MTU que se traga las descargas y una ruta que no vuelve), calcula lo que cabe por el túnel y deja el respaldo listo para la próxima.',
  minutes: 60,
  prerequisites: ['op2m2', 'op2m5', 'op1m4'],
  dossier: [
    {
      id: 'd-aviso',
      title: 'Aviso del operador de la WAN · martes 09:31',
      kind: 'email',
      body: [
        {
          t: 'p',
          md: '«Avería en curso. A las **09:14** una excavadora de unas obras municipales ha cortado el cable de fibra que da servicio, entre otros clientes, a una de sus oficinas comarcales (la de `10.20.9.0/24`). El acceso MPLS de esa oficina está caído. Hay que abrir zanja y empalmar: **reparación estimada hacia las 17:00**. Las demás sedes del Consorcio no están afectadas.»',
        },
      ],
    },
    {
      id: 'd-parte',
      title: 'Llamada de la oficina comarcal 10.20.9.0/24 al Servicio de Informática y Comunicaciones · martes 09:25',
      kind: 'memo',
      body: [
        {
          t: 'p',
          md: '«Desde hace diez minutos no abre la aplicación de expedientes, el correo no se actualiza y los teléfonos no llaman a la sede. Internet sí parece funcionar en el móvil. ¿No teníamos una línea de reserva para esto?»',
        },
        {
          t: 'p',
          md: 'La guardia empieza a revisar a las 09:40. La oficina tiene unas veinte personas atendiendo al público.',
        },
      ],
    },
    {
      id: 'd-ficha',
      title: 'Ficha de diseño de la WAN de las oficinas (diseño aprobado)',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Elemento', 'Dato', 'Notas'],
          rows: [
            ['Camino principal de cada oficina', 'VPN de capa 3 sobre MPLS del operador', 'Clase de servicio para la voz. Rutas con el PE del operador por eBGP en cada sede (configuración del Consorcio)'],
            ['Camino de respaldo de cada oficina', 'Acceso a Internet de **otro proveedor**, solo para el túnel IPsec', 'Oficina `10.20.9.0/24`: dirección pública de respaldo `198.51.100.32`'],
            ['Terminación de los túneles en la sede', 'Encaminador central, `203.0.113.10`', 'IKEv2 por UDP 500 y 4500. En la sede, la interfaz del túnel de esta oficina se llama `tun-32`'],
            ['Tipo de VPN', 'Por ruta: qué entra en el túnel lo decide la tabla de rutas', 'Selectores de tráfico `0.0.0.0/0` ↔ `0.0.0.0/0`; autenticación con clave precompartida'],
            ['Cuándo se usa el respaldo', 'Solo si falta la ruta aprendida por el MPLS', 'Rutas estáticas de respaldo por la interfaz del túnel, en los dos extremos. El túnel arranca cuando cae la sesión eBGP con el operador y, una vez arriba, se queda arriba hasta que alguien lo baja'],
            ['Servicios de la oficina en la sede', 'Aplicación de expedientes en `10.20.72.10:443` (CPD), correo, telefonía IP', 'Entre el encaminador central y el CPD está el cortafuegos de la sede, que filtra sin ser un salto de encaminamiento: el encaminador sigue teniendo una interfaz en la red del CPD (cómo se monta así depende del fabricante del cortafuegos)'],
          ],
        },
        {
          t: 'p',
          md: 'El eBGP con el PE, la VPN por ruta, cuándo arranca el túnel y el cortafuegos entre el encaminador central y el CPD son datos de **este caso**: el canon del Consorcio no los fija. Los nombres de interfaz y la sintaxis de los extractos del expediente son ilustrativos: cada fabricante usa los suyos.',
        },
      ],
    },
    {
      id: 'd-esquema',
      title: 'Esquema de la WAN de la oficina (ficha de diseño)',
      kind: 'diagram',
      diagram: {
        width: 760,
        height: 460,
        zones: [
          { label: 'Oficina comarcal 10.20.9.0/24', x: 16, y: 250, w: 290, h: 160 },
          { label: 'Sede central', x: 500, y: 16, w: 244, h: 310 },
        ],
        nodes: [
          { id: 'pc', label: 'Puestos', kind: 'pc', x: 80, y: 330, sub: '10.20.9.0/24' },
          { id: 'ro', label: 'Encaminador de la oficina', kind: 'router', x: 220, y: 330, sub: 'puerta 10.20.9.1' },
          { id: 'mpls', label: 'MPLS del operador', kind: 'cloud', x: 390, y: 170, sub: 'principal' },
          { id: 'inet', label: 'Internet (otro proveedor)', kind: 'cloud', x: 420, y: 400, sub: 'respaldo 198.51.100.32' },
          { id: 'rc', label: 'Encaminador central', kind: 'router', x: 620, y: 270, sub: '203.0.113.10' },
          { id: 'fw', label: 'Cortafuegos de la sede', kind: 'firewall', x: 620, y: 165 },
          { id: 'srv', label: 'Expedientes', kind: 'server', x: 620, y: 60, sub: '10.20.72.10 :443' },
        ],
        links: [
          { from: 'pc', to: 'ro' },
          { from: 'ro', to: 'mpls', label: 'eBGP con el PE' },
          { from: 'mpls', to: 'rc' },
          { from: 'ro', to: 'inet', label: 'túnel IPsec' },
          { from: 'inet', to: 'rc' },
          { from: 'rc', to: 'fw' },
          { from: 'fw', to: 'srv' },
        ],
      },
    },
    {
      id: 'd-registro-oficina',
      title: 'Registro del encaminador de la oficina · martes de 09:14 a 09:40',
      kind: 'log',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante. El reintento cada 30 s es un valor configurado en este encaminador',
          text: `09:14:04  mpls0: pérdida de señal óptica; interfaz DOWN
09:14:04  BGP: sesión con el PE del operador cerrada (interfaz caída)
09:14:04  rutas: 10.20.0.0/16 por el MPLS retirada; la de respaldo por tun-respaldo no se instala (interfaz del túnel caída)
09:14:05  tun-respaldo: arranque del túnel (lo dispara la caída de la sesión eBGP): la dirección local 198.51.100.32 no está asignada a ninguna interfaz; IKE no se inicia
09:14:35  tun-respaldo: arranque del túnel: la dirección local 198.51.100.32 no está asignada a ninguna interfaz; IKE no se inicia
09:15:05  tun-respaldo: arranque del túnel: la dirección local 198.51.100.32 no está asignada a ninguna interfaz; IKE no se inicia
   ...    (la misma línea cada 30 s)
09:40:05  tun-respaldo: arranque del túnel: la dirección local 198.51.100.32 no está asignada a ninguna interfaz; IKE no se inicia`,
        },
      ],
    },
    {
      id: 'd-config-oficina',
      title: 'Encaminador de la oficina: túnel de respaldo e interfaz de Internet (configuración actual)',
      kind: 'config',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Extracto (sintaxis ilustrativa: cada fabricante usa la suya). Las propuestas criptográficas están en otro apartado',
          text: `túnel tun-respaldo
  versión de IKE          2
  par remoto              203.0.113.10
  dirección local         198.51.100.32
  autenticación           clave precompartida
  encapsulación en UDP    automática (si IKE_SA_INIT detecta un NAT)
  propuestas              perfil «oficina-v1»

interfaz inet0            192.168.1.2/24
ruta 203.0.113.10/32      por 192.168.1.1 (inet0)`,
        },
      ],
    },
    {
      id: 'd-cambios-oficina',
      title: 'Registro de cambios del Servicio de Informática y Comunicaciones · encaminador de la oficina 10.20.9.0/24',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Cuándo', 'Cambio', 'Comprobación'],
          rows: [
            [
              'Lunes de la semana pasada, 12:30',
              'El proveedor de respaldo cambia su equipo de línea. La interfaz `inet0` del encaminador pasa de `198.51.100.32` a `192.168.1.2/24`, como pide el proveedor; la ruta a `203.0.113.10/32` pasa a ir por `192.168.1.1`. Se rehace la ruta de respaldo hacia `10.20.0.0/16` por la interfaz `tun-respaldo`',
              '«El encaminador llega a 203.0.113.10 (ping)». El túnel no se prueba: el MPLS funciona',
            ],
          ],
        },
      ],
    },
    {
      id: 'd-proveedor',
      title: 'Nota de instalación del proveedor de respaldo · lunes de la semana pasada',
      kind: 'memo',
      body: [
        {
          t: 'list',
          items: [
            'Se sustituye el equipo antiguo por un **encaminador con traducción de direcciones (NAT) y cortafuegos básico**.',
            'La dirección pública **`198.51.100.32`** pasa a estar en nuestro equipo. Red interna del equipo: `192.168.1.0/24`; el equipo es `192.168.1.1` y el encaminador del cliente queda en **`192.168.1.2`** (asignación fija).',
            'El NAT traduce la dirección y puede cambiar el puerto de origen. Las entradas UDP caducan a los **60 s** sin tráfico.',
            'Filtro de salida por defecto: perfil **«paso de IPsec»** (UDP 500 y protocolo IP 50), DNS, web (TCP 80 y 443) y eco ICMP (*ping*). El resto de salidas, cerradas. Cambios, por incidencia.',
            'MTU del acceso hacia Internet: **1500** octetos.',
          ],
        },
        { t: 'p', md: 'Todos los datos de esta nota son de la configuración del proveedor, no de una norma.' },
      ],
    },
    // --- fase 2 -------------------------------------------------------------
    {
      id: 'd-ticket',
      title: 'Incidencia con el proveedor de respaldo · martes',
      kind: 'email',
      unlockedBy: 'f1',
      body: [
        {
          t: 'list',
          items: [
            '**10:05** · La guardia cambia en el encaminador de la oficina la dirección local del túnel de `198.51.100.32` a `192.168.1.2`.',
            '**10:08** · El Consorcio pide al proveedor que deje salir **UDP 4500** (y sus respuestas) desde `192.168.1.2` hacia `203.0.113.10`.',
            '**10:20** · El proveedor contesta: «Hecho. El perfil del cliente deja salir ahora UDP 500 y UDP 4500».',
          ],
        },
      ],
    },
    {
      id: 'd-registro-oficina-2',
      title: 'Registro del encaminador de la oficina · martes de 10:05 a 10:48',
      kind: 'log',
      unlockedBy: 'f1',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante',
          text: `10:05:31  tun-respaldo: IKE_SA_INIT enviado de 192.168.1.2:500 a 203.0.113.10:500 (perfil oficina-v1)
10:05:31  tun-respaldo: respuesta de 203.0.113.10: ninguna propuesta aceptable; SA IKE no creada
10:06:01  tun-respaldo: IKE_SA_INIT enviado de 192.168.1.2:500 a 203.0.113.10:500 (perfil oficina-v1)
10:06:01  tun-respaldo: respuesta de 203.0.113.10: ninguna propuesta aceptable; SA IKE no creada
   ...    (lo mismo cada 30 s)
10:48:01  tun-respaldo: respuesta de 203.0.113.10: ninguna propuesta aceptable; SA IKE no creada`,
        },
      ],
    },
    {
      id: 'd-ike-sede',
      title: 'Registro de IKE del encaminador central · martes 10:05',
      kind: 'log',
      unlockedBy: 'f1',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante (los avisos se dan con su nombre en la RFC 7296)',
          text: `10:05:31  IKE  petición IKE_SA_INIT de 198.51.100.32:61702 (ID de mensaje 0)
            SAi1, propuesta 1: ENCR_3DES · PRF_HMAC_SHA1 · AUTH_HMAC_SHA1_96 · grupo DH 2
            KEi: grupo DH 2 · Ni
            N(NAT_DETECTION_SOURCE_IP): no coincide con 198.51.100.32:61702 -> el iniciador está detrás de un NAT
            N(NAT_DETECTION_DESTINATION_IP): coincide con 203.0.113.10:500
10:05:31  IKE  par 198.51.100.32 -> perfil OFICINAS
10:05:31  IKE  ninguna propuesta del iniciador es aceptable para el perfil OFICINAS
10:05:31  IKE  respuesta a 198.51.100.32:61702: rechazo por falta de propuesta aceptable; no se crea la SA IKE`,
        },
      ],
    },
    {
      id: 'd-propuestas',
      title: 'Propuestas criptográficas configuradas en la oficina y en la sede',
      kind: 'config',
      unlockedBy: 'f1',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Extracto (sintaxis ilustrativa). Nombres de las transformadas como en la IANA y las RFC 8247 y 8221',
          text: `Oficina 10.20.9.0/24 · perfil «oficina-v1» (importado de la configuración de IKEv1 del túnel antiguo)
  SA IKE   cifrado ENCR_3DES · PRF PRF_HMAC_SHA1 · integridad AUTH_HMAC_SHA1_96 · grupo DH 2
  SA hija  ESP: cifrado ENCR_3DES · integridad AUTH_HMAC_SHA1_96 · grupo DH en las reclaves 2

Encaminador central · perfil «OFICINAS» (desde el endurecimiento)
  SA IKE   cifrado ENCR_AES_GCM_16 o ENCR_AES_CBC (claves de 256 bits)
           PRF PRF_HMAC_SHA2_256 o PRF_HMAC_SHA2_512
           integridad AUTH_HMAC_SHA2_256_128 (solo con ENCR_AES_CBC)
           grupos DH 19 y 14
  SA hija  ESP: ENCR_AES_GCM_16, o ENCR_AES_CBC con AUTH_HMAC_SHA2_256_128
           grupo DH en las reclaves: 19 o 14`,
        },
      ],
    },
    {
      id: 'd-cambios-sede',
      title: 'Registro de cambios del Servicio de Informática y Comunicaciones · encaminador central (extracto)',
      kind: 'table',
      unlockedBy: 'f1',
      body: [
        {
          t: 'table',
          headers: ['Cuándo', 'Cambio', 'Comprobación'],
          rows: [
            [
              'Hace dos meses',
              'Endurecimiento del perfil IKEv2 «OFICINAS»: se retiran 3DES, SHA-1 y los grupos DH 2 y 5, como recomienda NIST SP 800-77r1 al dejar atrás IKEv1, y se dejan los algoritmos de las RFC 8247 y 8221 que aparecen en la configuración',
              'Oficina `198.51.100.31`: actualizada y túnel probado. Oficina `198.51.100.33`: actualizada y túnel probado. Oficina `198.51.100.32`: **pendiente**, «se hará en la próxima visita»',
            ],
          ],
        },
      ],
    },
    // --- fase 3 -------------------------------------------------------------
    {
      id: 'd-negociacion',
      title: 'Captura en la interfaz inet0 del encaminador de la oficina · martes 10:48',
      kind: 'log',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante. Se ve el lado interior del NAT del proveedor',
          text: `10:48:02  configuración: tun-respaldo pasa al perfil «oficina-v2» (usuario: guardia)
10:48:03.112  192.168.1.2:500  -> 203.0.113.10:500   UDP  IKE_SA_INIT petición: SAi1, KEi (grupo 19), Ni,
                                                          N(NAT_DETECTION_SOURCE_IP), N(NAT_DETECTION_DESTINATION_IP)
10:48:03.141  203.0.113.10:500 -> 192.168.1.2:500    UDP  IKE_SA_INIT respuesta: SAr1 (ENCR_AES_GCM_16 de 256 bits,
                                                          PRF_HMAC_SHA2_256, grupo 19), KEr, Nr, los dos N(NAT_DETECTION_...)
10:48:03.150  192.168.1.2:4500 -> 203.0.113.10:4500  UDP  carga: 00 00 00 00 + cabecera IKE · IKE_AUTH petición (cifrada)
10:48:03.188  203.0.113.10:4500 -> 192.168.1.2:4500  UDP  carga: 00 00 00 00 + cabecera IKE · IKE_AUTH respuesta (cifrada)
10:48:04      tun-respaldo: SA IKE establecida; SA hija establecida (ESP, ENCR_AES_GCM_16)
10:48:04      rutas: 10.20.0.0/16 por tun-respaldo instalada
10:48:04.020  192.168.1.2:4500 -> 203.0.113.10:4500  UDP  carga: SPI 0xc1a4e2b7 + número de secuencia 1 · ESP
10:48:04.061  203.0.113.10:4500 -> 192.168.1.2:4500  UDP  carga: SPI 0x5d0e9f13 + número de secuencia 1 · ESP`,
        },
      ],
    },
    {
      id: 'd-quejas',
      title: 'Segunda llamada de la oficina · martes 11:05',
      kind: 'memo',
      unlockedBy: 'f2',
      body: [
        {
          t: 'p',
          md: '«Ya llamamos a la sede y el correo entra. Pero la aplicación de expedientes se queda en blanco al abrir un expediente, y descargar un PDF del gestor no termina nunca. Lo curioso es que **subir** documentos al registro sí funciona. Y el *ping* que nos pidió el técnico, también.»',
        },
      ],
    },
    {
      id: 'd-captura-servidor',
      title: 'Captura en el servidor de expedientes 10.20.72.10 · martes 11:12',
      kind: 'log',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante. Puesto de la oficina 10.20.9.57; segmentos de datos con cabecera TCP sin opciones',
          text: `11:12:03.401  10.20.9.57:52144 -> 10.20.72.10:443   SYN           opción MSS 1460 · DF
11:12:03.402  10.20.72.10:443 -> 10.20.9.57:52144   SYN, ACK      opción MSS 1460 · DF
11:12:03.441  10.20.9.57 -> 10.20.72.10              ACK
11:12:03.442  10.20.9.57 -> 10.20.72.10              datos 517 (inicio de TLS) · DF
11:12:03.443  10.20.72.10 -> 10.20.9.57              ACK
11:12:03.444  10.20.72.10 -> 10.20.9.57              longitud IP 1500 (datos 1460) · DF
11:12:03.444  10.20.72.10 -> 10.20.9.57              longitud IP 1500 (datos 1460) · DF
11:12:03.444  10.20.72.10 -> 10.20.9.57              longitud IP 452 (datos 412) · DF
11:12:03.701  10.20.72.10 -> 10.20.9.57              retransmisión: longitud IP 1500 (datos 1460) · DF
11:12:04.215  10.20.72.10 -> 10.20.9.57              retransmisión: longitud IP 1500 (datos 1460) · DF
11:12:05.243  10.20.72.10 -> 10.20.9.57              retransmisión: longitud IP 1500 (datos 1460) · DF
11:12:07.299  10.20.72.10 -> 10.20.9.57              retransmisión: longitud IP 1500 (datos 1460) · DF

Durante la captura, el servidor no recibe ningún mensaje ICMP.`,
        },
      ],
    },
    {
      id: 'd-contadores',
      title: 'Contadores de las interfaces de túnel · martes de 10:48:04 a 11:15:00',
      kind: 'log',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante',
          text: `Encaminador central · tun-32 (hacia la oficina)
  paquetes descartados por no caber sin fragmentar con DF activo     1284
  ICMP tipo 3, código 4 generados hacia el origen de esos paquetes    1284
  origen de los paquetes descartados                                 10.20.72.10 (todos)

Encaminador de la oficina · tun-respaldo (hacia la sede)
  paquetes descartados por no caber sin fragmentar con DF activo       37
  ICMP tipo 3, código 4 generados hacia el origen de esos paquetes      37
  origen de los paquetes descartados                                 puestos de 10.20.9.0/24`,
        },
      ],
    },
    {
      id: 'd-cortafuegos',
      title: 'Cortafuegos de la sede: regla 14 y su registro · martes de 10:48 a 11:15',
      kind: 'log',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Extracto (sintaxis ilustrativa). Regla del conjunto del Consorcio, no de una norma',
          text: `regla 14 · «ICMP hacia el CPD: solo eco»
  permitir  ICMP eco (petición y respuesta)   cualquiera -> 10.20.72.0/21
  denegar   resto de ICMP                     cualquiera -> 10.20.72.0/21   (con registro)

registro, agrupado por regla:
  regla 14  DENEGADO  ICMP tipo 3, código 4   encaminador central (interfaz interior) -> 10.20.72.10   1284 veces`,
        },
      ],
    },
    // --- fase 4 -------------------------------------------------------------
    {
      id: 'd-reparacion',
      title: 'Aviso del operador de la WAN · martes 17:10',
      kind: 'email',
      unlockedBy: 'f3',
      body: [
        {
          t: 'p',
          md: '«Empalme terminado a las **17:02**. Servicio de la oficina `10.20.9.0/24` verificado de extremo a extremo a las **17:06**: la sesión eBGP con su encaminador vuelve a estar establecida y la VPN anuncia de nuevo sus rutas. Sobre la **segunda fibra por otro trazado** que pidió el Consorcio para esta oficina: el presupuesto sigue pendiente.»',
        },
      ],
    },
    {
      id: 'd-quejas-miercoles',
      title: 'Llamada de la oficina · miércoles 08:50',
      kind: 'memo',
      unlockedBy: 'f3',
      body: [
        {
          t: 'p',
          md: '«Desde ayer por la tarde, en la sede **nos oyen a trozos** cuando les llamamos. Nosotros a ellos les oímos bien. El operador dice que su línea está perfecta.»',
        },
      ],
    },
    {
      id: 'd-rutas',
      title: 'Rutas hacia la sede y hacia la oficina · martes por la tarde y miércoles 08:56:30',
      kind: 'log',
      unlockedBy: 'f3',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante. Distancias en la escala del fabricante de los encaminadores, igual a los valores por defecto de Cisco (eBGP 20, estática 1)',
          text: `Encaminador central · registro, martes
17:06:30  BGP: 10.20.9.0/24 aprendida del PE del operador [20/0]; sustituye a la estática por tun-32 [250/0]

Encaminador de la oficina · registro, martes
17:06:28  BGP: sesión con el PE del operador establecida
17:06:29  BGP: 10.20.0.0/16 aprendida del PE [20/0]; no se instala: hay otra ruta con menor distancia

Encaminador de la oficina · tabla de rutas, miércoles 08:56:30
  destino           siguiente salto          origen       [distancia/métrica]
  10.20.0.0/16      tun-respaldo             estática     [1/0]     <- instalada
                    PE del operador (mpls0)  eBGP         [20/0]    (no instalada)
  10.20.9.0/24      lan0 (directa)           conectada    [0/0]     <- instalada
  203.0.113.10/32   192.168.1.1 (inet0)      estática     [1/0]     <- instalada`,
        },
      ],
    },
    {
      id: 'd-contadores-tunel',
      title: 'Tráfico de tun-respaldo por sentido · desde el martes 17:06:30 hasta el miércoles 08:56:30',
      kind: 'table',
      unlockedBy: 'f3',
      body: [
        {
          t: 'table',
          headers: ['Sentido', 'Paquetes por el túnel', 'Notas'],
          rows: [
            ['Oficina → sede (sale por el túnel)', '2 913 448', 'ESP: incluye la voz de los teléfonos de la oficina'],
            ['Sede → oficina (entra por el túnel)', '0', 'Ningún paquete; por inet0 solo pasan los mensajes de IKE de la propia sesión'],
          ],
        },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'La oficina sola',
      context:
        'Martes, 09:40. Tienes el aviso del operador, la llamada de la oficina, la ficha de diseño y su esquema, el registro del encaminador de la oficina, la configuración de su túnel, su registro de cambios y la nota del proveedor que le da el acceso de respaldo. Averigua por qué el túnel no levanta y qué hará falta para que lo haga.',
      carry:
        'Desde el lunes de la semana pasada, el encaminador de la oficina está detrás del NAT del equipo nuevo del proveedor, y su túnel seguía configurado con la dirección pública como dirección local: ni siquiera empezaba a negociar. A las 10:05 la guardia puso como dirección local la de `inet0`, y a las 10:20 el proveedor abrió la salida UDP 4500, que su filtro cerraba y que el paso de NAT necesita.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'multi',
          topic: 'op2m5',
          prompt: 'Marca **todo** lo que demuestran los documentos.',
          options: [
            { id: 'a', text: 'La avería del MPLS es del operador (el corte de la fibra); la oficina se ha quedado aislada porque el respaldo no ha arrancado' },
            { id: 'b', text: 'Desde el lunes de la semana pasada, la dirección pública `198.51.100.32` está en el equipo del proveedor, que hace NAT, y el encaminador de la oficina tiene `192.168.1.2`' },
            { id: 'c', text: 'El túnel sigue configurado con `198.51.100.32` como dirección local, una dirección que el encaminador ya no tiene: IKE ni siquiera empieza' },
            { id: 'd', text: 'Tras el cambio del proveedor nadie probó el túnel: la única comprobación fue un *ping* a la sede' },
            { id: 'e', text: 'La sede ha cambiado su dirección pública y el túnel apunta a una que ya no existe' },
            { id: 'f', text: 'El proveedor bloquea todo IPsec, así que por ese acceso no habrá respaldo posible' },
          ],
          answer: ['a', 'b', 'c', 'd'],
          points: 6,
          explain:
            'El aviso del operador sitúa el corte en su fibra, y el registro del encaminador enseña por qué no hay respaldo: «la dirección local 198.51.100.32 no está asignada a ninguna interfaz». La nota del proveedor y el registro de cambios explican esa dirección: desde el lunes pasado la pública está en el equipo del proveedor, que hace NAT, y el encaminador tiene `192.168.1.2`; el cambio se dio por bueno con un *ping*, sin probar el túnel, porque el MPLS funcionaba. Tienta leer la ficha de diseño, que sigue poniendo `198.51.100.32` en la oficina, como si fuera la situación actual: es el diseño aprobado, no lo que hay. La sede sigue en `203.0.113.10` (la ruta y el *ping* del registro de cambios van ahí). Y el proveedor no bloquea todo IPsec: deja salir UDP 500 y el protocolo 50, y los cambios se piden por incidencia.',
          refs: [L_CENTROS, L_IPSEC, L_NAT],
        },
        {
          id: 'f1t2',
          kind: 'choice',
          topic: 'op2m2',
          prompt: '¿Qué hay que cambiar primero en la configuración del túnel de la oficina para que empiece a negociar?',
          options: [
            { id: 'a', text: 'Poner `192.168.1.1` como par remoto, porque ahora la sede se alcanza a través del equipo del proveedor' },
            { id: 'b', text: 'Añadir `198.51.100.32` como segunda dirección de `inet0`, para que la dirección local vuelva a existir' },
            { id: 'c', text: 'Usar como dirección local la de `inet0`, `192.168.1.2`, y dejar el par remoto en `203.0.113.10`; el NAT del proveedor traducirá la dirección por el camino' },
            { id: 'd', text: 'Cambiar en la sede el par esperado a `192.168.1.2`, que es la dirección que tendrá ahora la oficina' },
          ],
          answer: 'c',
          points: 4,
          explain:
            'El encaminador solo puede enviar IKE desde una dirección que tenga, y ahora tiene `192.168.1.2`. La sede no verá nunca `192.168.1.2` como dirección de origen: el NAT presenta la oficina con `198.51.100.32` (op1m2); la identidad que la oficina declare en IKE_AUTH se configura aparte. El par remoto no cambia: la sede sigue en `203.0.113.10`, y `192.168.1.1` es solo el siguiente salto, que ya está en la ruta. Poner `198.51.100.32` en `inet0` duplicaría una dirección que pertenece al equipo del proveedor. Y la sede no verá nunca `192.168.1.2`: el NAT presenta la oficina con `198.51.100.32` (op1m2), así que el par que espera la sede sigue siendo válido.',
          refs: [L_IPSEC, L_NAT, RFC7296],
        },
        {
          id: 'f1t3',
          kind: 'multi',
          topic: 'op2m2',
          prompt: 'Corregida la dirección local, la oficina negociará detrás del NAT. Marca **todo** lo que hará IKEv2, según las RFC 7296 y 3948 y la nota del proveedor.',
          options: [
            { id: 'a', text: 'En IKE_SA_INIT los dos incluyen `NAT_DETECTION_SOURCE_IP` y `NAT_DETECTION_DESTINATION_IP` (un SHA-1 de los SPI, la IP y el puerto); a la sede no le casará el de origen y a la oficina, el de destino' },
            { id: 'b', text: 'Detectado el NAT, IKE y ESP pasan a UDP 4500: IKE con cuatro octetos a cero delante de su cabecera y ESP justo detrás de la cabecera UDP' },
            { id: 'c', text: 'Como está detrás del NAT, la oficina enviará NAT-keepalive (un octeto `0xFF`) si lleva 20 s sin mandar nada, para que el NAT no borre su entrada, que según la nota del proveedor caduca a los 60 s' },
            { id: 'd', text: 'Si el proveedor lo prefiere, la encapsulación en UDP puede seguir en el puerto 500' },
            { id: 'e', text: 'Los NAT-keepalive le servirán además a la oficina para saber si la sede sigue viva' },
            { id: 'f', text: 'ESP seguirá viajando como protocolo IP 50, porque el perfil del proveedor lo deja pasar' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'Según la RFC 7296 §2.23, si no casa el *hash* de origen, el emisor está detrás de un NAT (lo ve la sede), y si no casa el de destino, lo está el receptor (lo ve la oficina al leer la respuesta); quien lo detecta pasa todo al UDP 4500 y, con NAT, los dos encapsulan ESP en UDP. En el 4500, IKE lleva el marcador de cuatro octetos a cero y ESP va directo, porque su SPI nunca es 0 (RFC 3948 §2.2). El NAT-keepalive es un octeto `0xFF` que se envía tras 20 s sin otro paquete (valor por defecto de la RFC 3948), menos que los 60 s del NAT del proveedor. Pero la encapsulación **nunca** va por el 500, el keepalive **no debe** usarse para saber si el otro vive (para eso está el INFORMATIONAL vacío de la RFC 7296 §2.4) y, con NAT, ESP ya no va como protocolo 50: que el proveedor deje pasar el 50 no sirve de nada.',
          refs: [L_IPSEC, RFC7296, RFC3948],
        },
        {
          id: 'f1t4',
          kind: 'choice',
          topic: 'op2m2',
          prompt: 'Con lo que dice la nota del proveedor, ¿qué hay que pedirle?',
          options: [
            { id: 'a', text: 'Nada: su perfil «paso de IPsec» ya deja salir UDP 500 y el protocolo 50, que es todo lo que usa IPsec' },
            { id: 'b', text: 'Que deje salir también UDP 4500 desde `192.168.1.2` hacia `203.0.113.10`, con sus respuestas: con NAT, todo lo que sigue a IKE_SA_INIT va por ese puerto' },
            { id: 'c', text: 'Que reenvíe el UDP 500 entrante de `198.51.100.32` a `192.168.1.2`, para que la sede pueda abrir el túnel' },
            { id: 'd', text: 'Que abra TCP 443, porque los túneles IPsec se pasan a TCP cuando hay un NAT' },
          ],
          answer: 'b',
          points: 3,
          explain:
            'Con su filtro actual, IKE_SA_INIT saldría por el 500, pero IKE_AUTH y el ESP encapsulado, que van por el 4500, se quedarían en el equipo del proveedor. La oficina es la que inicia, así que basta con que la salida esté abierta y vuelvan las respuestas; un reenvío entrante del 500 no hace falta. El protocolo 50 sirve sin NAT, no aquí. Y la encapsulación en TCP existe (RFC 9329, en TCP 4500, y NIST la deja como último recurso, a veces por el 443), pero se preconfigura en los dos extremos y no se activa sola por haber un NAT.',
          refs: [L_IPSEC, RFC7296, RFC3948, RFC9329, SP80077],
        },
        {
          id: 'f1t5',
          kind: 'cite',
          topic: 'op2m2',
          prompt: 'Señala los documentos que, juntos, prueban que la oficina está ahora detrás de un NAT y que su túnel sigue configurado como si no lo estuviera.',
          answerSets: [
            ...withExtras(['d-proveedor', 'd-config-oficina'], ['d-cambios-oficina', 'd-registro-oficina']),
            ...withExtras(['d-proveedor', 'd-registro-oficina'], ['d-cambios-oficina']),
          ],
          points: 3,
          explain:
            'La nota del proveedor es la que dice que ahora hay NAT y que la pública está en su equipo. La configuración del túnel (dirección local `198.51.100.32`) o el registro que se queja de esa dirección enseñan que el túnel no se adaptó. El registro de cambios puede sumarse, porque explica cuándo cambió `inet0`, pero no dice que haya NAT. La ficha de diseño no sirve: describe la situación anterior.',
          refs: [L_IPSEC, L_NAT],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'Propuestas que no casan',
      context:
        'Desde las 10:05 el encaminador de la oficina ya envía IKE_SA_INIT, y desde las 10:20 el UDP 4500 está abierto, pero el túnel sigue sin levantar. Tienes la incidencia con el proveedor, los registros de los dos encaminadores, las propuestas configuradas en cada extremo y el registro de cambios del encaminador central.',
      carry:
        'La oficina ofrecía el perfil importado de IKEv1 (3DES, SHA-1 y el grupo DH 2), y la sede, que endureció su perfil hace dos meses, ya no acepta nada de eso: IKE_SA_INIT se rechazaba antes de crear la SA IKE. Esta oficina era la única que quedó pendiente. A las 10:48 la guardia le puso un perfil nuevo con AES-GCM-16, PRF_HMAC_SHA2_256 y los grupos 19 y 14, y el túnel levantó.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'choice',
          topic: 'op2m2',
          prompt: '¿En qué punto falla la negociación y por qué?',
          options: [
            { id: 'a', text: 'En IKE_AUTH: la SA IKE se crea y lo que se rechaza es la SA hija, con `NO_PROPOSAL_CHOSEN`' },
            { id: 'b', text: 'En IKE_SA_INIT: la oficina solo ofrece un grupo que la sede no acepta, así que la sede debería contestar `INVALID_KE_PAYLOAD` y la oficina repetir con otro grupo' },
            { id: 'c', text: 'En IKE_SA_INIT, en el primer par de mensajes: ninguna de las suites que ofrece la oficina es aceptable para el perfil de la sede, así que no llega a crearse la SA IKE ni a haber IKE_AUTH' },
            { id: 'd', text: 'En la reclave: la oficina y la sede tienen vidas de SA distintas y no se ponen de acuerdo' },
          ],
          answer: 'c',
          points: 4,
          explain:
            'El registro de la sede lo dice en la petición IKE_SA_INIT (ID de mensaje 0): ninguna propuesta es aceptable y no se crea la SA IKE. En IKE_SA_INIT se negocian los algoritmos de la SA IKE y el respondedor elige una suite de las ofrecidas (RFC 7296 §1.2); si no hay ninguna, no hay nada que autenticar después. El caso de la opción a existe, pero es otro: si falla solo la SA hija en IKE_AUTH, la SA IKE se crea igual. `INVALID_KE_PAYLOAD` es para cuando el iniciador acertó mal el grupo de su KE pero ofrecía otro que el respondedor sí acepta; la oficina solo ofrece el 2, así que no hay grupo al que volver. Y en IKEv2 las vidas de las SA no se negocian: cada extremo aplica la suya (§2.8).',
          refs: [L_IPSEC, RFC7296],
        },
        {
          id: 'f2t2',
          kind: 'table',
          topic: 'op2m2',
          prompt: 'Para cada algoritmo, indica su nivel de requisito en la RFC que le corresponde (8247 para IKEv2, 8221 para ESP) y si el perfil «OFICINAS» de la sede lo acepta.',
          fields: [
            { id: 'nivel', label: 'Nivel en la RFC', options: ['MUST', 'SHOULD+', 'SHOULD', 'MAY', 'MUST-', 'SHOULD NOT', 'MUST NOT'] },
            { id: 'sede', label: 'Perfil de la sede', options: ['Lo acepta', 'Lo rechaza'] },
          ],
          rows: [
            { id: 'r1', label: 'ENCR_3DES en la SA IKE', answer: { nivel: 'MAY', sede: 'Lo rechaza' } },
            { id: 'r2', label: 'PRF_HMAC_SHA1', answer: { nivel: 'MUST-', sede: 'Lo rechaza' } },
            { id: 'r3', label: 'AUTH_HMAC_SHA1_96 en la SA IKE', answer: { nivel: 'MUST-', sede: 'Lo rechaza' } },
            { id: 'r4', label: 'Grupo DH 2 (MODP 1024)', answer: { nivel: 'SHOULD NOT', sede: 'Lo rechaza' } },
            { id: 'r5', label: 'ENCR_3DES en ESP', answer: { nivel: 'SHOULD NOT', sede: 'Lo rechaza' } },
            { id: 'r6', label: 'ENCR_AES_GCM_16 en la SA IKE', answer: { nivel: 'SHOULD', sede: 'Lo acepta' } },
            { id: 'r7', label: 'PRF_HMAC_SHA2_256', answer: { nivel: 'MUST', sede: 'Lo acepta' } },
            { id: 'r8', label: 'Grupo DH 19 (ECP 256)', answer: { nivel: 'SHOULD', sede: 'Lo acepta' } },
          ],
          points: 8,
          hint: { text: 'La RFC 8247 baja SHA-1 a MUST- («MUST que probablemente bajará») y sube el grupo 14 a MUST; el 3DES en IKEv2 no está prohibido.', cost: 2 },
          explain:
            'Según la RFC 8247: en IKEv2, `ENCR_3DES` es MAY, `PRF_HMAC_SHA1` y `AUTH_HMAC_SHA1_96` son MUST- (siguen siendo obligatorios, pero van a bajar), el grupo 2 es SHOULD NOT, `ENCR_AES_GCM_16` es SHOULD, `PRF_HMAC_SHA2_256` es MUST y el grupo 19 es SHOULD (el 14, MUST). En ESP, según la RFC 8221, `ENCR_3DES` es SHOULD NOT. La trampa está en la primera fila: el 3DES en IKEv2 no lo prohíbe ninguna RFC, y aun así la sede lo rechaza, porque su perfil sigue la recomendación de NIST SP 800-77r1 de no usar 3DES, SHA-1 ni los grupos 2 y 5 al dejar IKEv1. Que la sede no acepte algo no significa que la norma lo prohíba: es su política. La columna de la sede sale de comparar las dos listas de la configuración.',
          refs: [L_IPSEC, RFC8247, RFC8221, SP80077],
        },
        {
          id: 'f2t3',
          kind: 'choice',
          topic: 'op2m2',
          prompt: '¿Qué perfil le pones a la oficina?',
          options: [
            { id: 'a', text: 'El mismo «oficina-v1» con AES-GCM-16 y el grupo 19 añadidos como segunda propuesta, y 3DES y el grupo 2 de primera, por si la sede vuelve atrás' },
            { id: 'b', text: 'SA IKE con ENCR_AES_GCM_16, PRF_HMAC_SHA2_256 y los grupos 19 y 14; SA hija con ESP ENCR_AES_GCM_16 y el mismo grupo en las reclaves; sin 3DES, SHA-1 ni grupo 2' },
            { id: 'c', text: 'Ninguno nuevo: se añade el grupo 2 al perfil OFICINAS de la sede solo para el par `198.51.100.32`, que es más rápido' },
            { id: 'd', text: 'Volver a IKEv1 en los dos extremos, que es lo que traía la configuración importada' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'La opción b casa con el perfil de la sede y usa lo que recomiendan las RFC: `ENCR_AES_GCM_16` es MUST en ESP (RFC 8221) y SHOULD en IKEv2, `PRF_HMAC_SHA2_256` es MUST y los grupos 19 y 14 son SHOULD y MUST (RFC 8247). NIST SP 800-77r1 aconseja además el mismo grupo DH para la SA IKE y las SA IPsec. Dejar 3DES y el grupo 2 en la lista mantiene lo que se quería retirar, y la RFC 9395 pide justo lo contrario: no llevarse a IKEv2 la configuración de IKEv1 sin actualizar los algoritmos. Rebajar la sede para una oficina deshace el endurecimiento. E IKEv1 está pasado a histórico por la RFC 9395.',
          refs: [L_IPSEC, RFC8247, RFC8221, RFC9395, SP80077],
        },
        {
          id: 'f2t4',
          kind: 'cite',
          topic: 'op2m2',
          prompt: 'Señala los documentos que, juntos, prueban que el túnel no levanta porque las propuestas de la oficina ya no casan con las de la sede.',
          answerSets: [
            ...withExtras(['d-ike-sede', 'd-propuestas'], ['d-cambios-sede', 'd-registro-oficina-2']),
            ...withExtras(['d-registro-oficina-2', 'd-propuestas'], ['d-cambios-sede']),
            ...withExtras(['d-ike-sede', 'd-cambios-sede'], ['d-registro-oficina-2']),
          ],
          points: 2,
          explain:
            'Un registro de IKE (el de la sede, que da el detalle, o el de la oficina, que recibe el rechazo) enseña dónde falla, y las propuestas de los dos extremos enseñan por qué. También vale el registro de la sede junto con su registro de cambios: el primero dice qué ofrece la oficina y el segundo, que la sede retiró justo eso. El registro de cambios puede sumarse a las otras parejas: explica desde cuándo y por qué esta oficina quedó atrás, pero no prueba el rechazo de hoy. La incidencia con el proveedor solo habla del puerto.',
          refs: [L_IPSEC, RFC7296],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'Lo pequeño pasa, lo grande no',
      context:
        'Desde las 10:48 el túnel está arriba y la oficina vuelve a llamar a la sede, pero las descargas se cuelgan. Tienes la captura de la negociación, la segunda llamada de la oficina, una captura en el servidor de expedientes, los contadores de las dos interfaces de túnel y la regla 14 del cortafuegos de la sede con su registro.',
      carry:
        'El encaminador central descartaba los paquetes de 1500 octetos con DF que no cabían en el túnel y avisaba al servidor con ICMP tipo 3, código 4, pero la regla 14 del cortafuegos de la sede tiraba esos avisos: el servidor nunca bajaba el tamaño. Hacia la sede no pasaba porque los puestos sí recibían el aviso del encaminador de la oficina. A las 11:50 se permitieron esos ICMP hacia el CPD y se ajustó el MSS a 1395 en las dos interfaces del túnel; las descargas funcionan.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'multi',
          topic: 'op2m2',
          prompt: 'Marca **todo** lo que enseña la captura de las 10:48 (con ayuda del registro de IKE de la sede de las 10:05).',
          options: [
            { id: 'a', text: 'IKE_SA_INIT va por UDP 500 y, detectado el NAT, IKE_AUTH y ESP van por UDP 4500' },
            { id: 'b', text: 'En el 4500, los paquetes de IKE empiezan por cuatro octetos a cero y los de ESP, por su SPI: así los separa quien los recibe' },
            { id: 'c', text: 'El NAT del proveedor cambia el puerto de origen (la sede vio la oficina en el 61702) y la sede contesta a ese puerto' },
            { id: 'd', text: 'Después de IKE_AUTH, ESP viaja como protocolo IP 50, fuera de UDP' },
            { id: 'e', text: 'El tráfico del 4500 es la encapsulación en TCP de la RFC 9329' },
            { id: 'f', text: 'IKE_AUTH va en claro, y por eso la captura enseña las identidades de los dos extremos' },
          ],
          answer: ['a', 'b', 'c'],
          points: 4,
          explain:
            'La captura sigue la RFC 7296 §2.23: IKE_SA_INIT en el 500, con los avisos de detección de NAT, y todo lo demás en el 4500. IKE lleva delante el marcador de cuatro octetos a cero y ESP empieza por un SPI que nunca es 0 (RFC 3948 §2.2), así se distinguen. La sede vio a la oficina en `198.51.100.32:61702` aunque la oficina envió desde el 500: el NAT cambió el puerto, y la RFC 7296 manda aceptar IKE desde cualquier puerto y contestar al de origen. ESP va dentro de UDP, no como protocolo 50. Es UDP, no TCP. E IKE_AUTH va cifrado con las claves de IKE_SA_INIT: las identidades quedan ocultas a quien escucha.',
          refs: [L_IPSEC, RFC7296, RFC3948, RFC9329],
        },
        {
          id: 'f3t2',
          kind: 'choice',
          topic: 'op2m2',
          prompt: '¿Por qué se cuelgan las descargas y no las subidas?',
          options: [
            { id: 'a', text: 'Porque la entrada del NAT del proveedor caduca a mitad de la descarga y el túnel se corta' },
            { id: 'b', text: 'Porque los paquetes de 1500 con DF no caben en el túnel: el encaminador central los descarta y avisa al servidor con un ICMP tipo 3, código 4, pero el cortafuegos de la sede tira ese aviso y el servidor reenvía una y otra vez lo mismo. Hacia la sede, el aviso del encaminador de la oficina sí llega a los puestos y estos bajan el tamaño' },
            { id: 'c', text: 'Porque la ventana antirrepetición de ESP descarta los paquetes grandes' },
            { id: 'd', text: 'Porque el puesto anuncia un MSS de 536, el valor por defecto, y el servidor no lo respeta' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'Es el agujero negro de la MTU: el saludo TCP pasa porque sus paquetes son pequeños, y la conexión se para en cuanto los segmentos crecen (la RFC 8201 lo llama, en IPv6, «black-hole connection»). Según la RFC 1191, quien no puede reenviar sin fragmentar un paquete con DF lo descarta y devuelve un ICMP tipo 3, código 4 con la MTU del siguiente salto. Los contadores dicen que el encaminador central lo hizo 1284 veces, y el cortafuegos, que la regla 14 tiró los 1284 avisos; la captura del servidor confirma que no le llega ningún ICMP. En la oficina no hay ese filtro: sus 37 avisos llegan a los puestos y las subidas funcionan. El NAT no caduca con tráfico circulando, la antirrepetición no mira el tamaño y la captura enseña un MSS de 1460, no de 536.',
          refs: [L_IPSEC, RFC1191, RFC8201],
        },
        {
          id: 'f3t3',
          kind: 'numeric',
          topic: 'op2m2',
          prompt: 'Calcula el MSS de TCP que cabe siempre por el túnel sin fragmentar, contando para ESP su peor caso, con estos datos: MTU del acceso de 1500 octetos (nota del proveedor); cabeceras IPv4 exterior e interior de 20 octetos cada una, sin opciones (supuesto, como en la lección); UDP de NAT-T, 8 octetos (RFC 3948); ESP en modo túnel con `ENCR_AES_GCM_16`, peor caso de 37 octetos (RFC 4106 §7); TCP sin opciones, 20 octetos (RFC 9293).',
          answer: 1395,
          unit: 'octetos',
          points: 4,
          hint: { text: 'Primero el paquete IP interior más grande (MTU menos lo que añade el túnel) y luego quítale las cabeceras IPv4 y TCP interiores.', cost: 1 },
          explain:
            'Paquete interior: 1500 − 20 (IPv4 exterior) − 8 (UDP de NAT-T) − 37 (ESP) = 1435. MSS: 1435 − 20 (IPv4 interior) − 20 (TCP) = **1395**. Tienta responder 1403, que es el caso sin NAT y olvida los 8 octetos de UDP: aquí hay NAT, así que el UDP está. El 1435 es el paquete interior, no el MSS, y el 1460 es lo que cabe en 1500 sin túnel. La cuenta exacta depende del relleno: con estas longitudes cabría un MSS de 1398 (lo enseña op2m2), pero se fija el valor con margen, el del peor caso.',
          refs: [L_IPSEC, RFC4106, RFC3948, RFC9293],
        },
        {
          id: 'f3t4',
          kind: 'numeric',
          topic: 'op2m2',
          prompt: 'Con los mismos datos, el servidor envía un segmento lleno con el MSS que le anunció el puesto en la captura. ¿Cuántos octetos se pasa de la MTU del acceso el paquete exterior que tendría que salir por el túnel? Cuenta el ESP con su peor caso, 37 octetos, como en la tarea anterior.',
          answer: 65,
          unit: 'octetos',
          points: 3,
          explain:
            'El puesto anuncia MSS 1460, así que el paquete interior es 1460 + 20 (TCP) + 20 (IPv4) = 1500, la longitud que se ve en la captura. Encapsulado: 1500 + 37 (ESP) + 8 (UDP) + 20 (IPv4 exterior) = 1565 octetos, 65 más de los 1500 que caben. Coincide con la diferencia entre el MSS anunciado y el que cabe: 1460 − 1395 = 65. Responder 57 es olvidar el UDP de NAT-T; 45, olvidar la cabecera IP exterior. Con el relleno real de un paquete interior de 1500 (2 octetos), el ESP ocupa 36 y el exterior 1564, como en la lección: 64 de más.',
          refs: [L_IPSEC, RFC4106, RFC3948],
        },
        {
          id: 'f3t5',
          kind: 'multi',
          topic: 'op2m2',
          prompt: 'Marca **todas** las correcciones que tienen sentido.',
          options: [
            { id: 'a', text: 'Permitir en el cortafuegos de la sede el ICMP tipo 3, código 4 hacia el CPD, para que el descubrimiento de la MTU del camino funcione' },
            { id: 'b', text: 'Rebajar a 1395 como máximo el MSS de las conexiones TCP que cruzan el túnel, en sus dos extremos: el *MSS clamping* que la RFC 4459 llama un «hack», que solo sirve para TCP y cuya orden y valor exacto dependen del fabricante' },
            { id: 'c', text: 'Pedir al proveedor una MTU de 1565 en su acceso a Internet, para que quepan los paquetes de 1500 encapsulados' },
            { id: 'd', text: 'Ajustar el MSS también arregla el tráfico UDP grande que cruce el túnel' },
            { id: 'e', text: 'Bloquear también el ICMP en el encaminador de la oficina, para que los dos extremos se comporten igual' },
            { id: 'f', text: 'Cambiar ESP por AH, que añade menos octetos' },
          ],
          answer: ['a', 'b'],
          points: 5,
          explain:
            'La causa es el filtro: dejar pasar el ICMP tipo 3, código 4 devuelve al servidor el aviso que la RFC 1191 necesita. El ajuste del MSS es la red de seguridad que describe la RFC 4459: los extremos del túnel rebajan el MSS que se anuncia al abrir cada conexión TCP, y así nadie envía segmentos que no quepan, aunque se pierda algún ICMP por el camino; el valor de 1395 sale de la cuenta y la orden concreta es del fabricante. La RFC 4459 menciona una MTU mayor de 1500 en la red que lleva los túneles, pero en Internet eso no está en manos del Consorcio. El MSS es de TCP: no toca a UDP. Bloquear el ICMP en la oficina rompería las subidas, que hoy funcionan. Y AH no cruza un NAT.',
          refs: [L_IPSEC, RFC4459, RFC1191],
        },
        {
          id: 'f3t6',
          kind: 'cite',
          topic: 'op2m2',
          prompt: 'Señala los documentos que, juntos, prueban que la causa es un ICMP tipo 3, código 4 filtrado y no un problema del NAT ni del cifrado.',
          answerSets: [
            ...withExtras(['d-contadores', 'd-cortafuegos'], ['d-captura-servidor', 'd-quejas', 'd-negociacion']),
            ...withExtras(['d-cortafuegos', 'd-captura-servidor'], ['d-quejas', 'd-negociacion']),
          ],
          points: 3,
          explain:
            'Los contadores enseñan que el encaminador central descarta los paquetes que no caben y genera los ICMP; el registro del cortafuegos, que la regla 14 los tira todos. También vale el registro del cortafuegos con la captura del servidor: avisos denegados hacia `10.20.72.10` y, en el servidor, retransmisiones de 1500 sin ningún ICMP. Los contadores solos no dicen adónde van a parar los avisos, ni la captura sola por qué no llegan. La llamada de la oficina suma el efecto (subidas que sí funcionan) y la captura de la negociación, que el túnel está arriba, pero ninguna de las dos prueba la causa.',
          refs: [L_IPSEC, RFC1191],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'La vuelta al MPLS',
      context:
        'El operador reparó la fibra el martes por la tarde. El miércoles a primera hora la oficina vuelve a llamar. Tienes el aviso de la reparación, la llamada del miércoles, los registros y la tabla de rutas de los dos encaminadores y los contadores del túnel por sentido.',
      carry:
        'Al rehacer la ruta de respaldo de la oficina el lunes pasado, se quedó con la distancia por defecto (1), menor que la de eBGP (20): mientras el túnel esté arriba, la oficina lo prefiere al MPLS. La sede, con su estática a 250, volvió al MPLS a las 17:06:30. El tráfico iba hacia la sede por Internet y volvía por el MPLS, y la voz de la oficina llegaba a trozos. El miércoles se subió la distancia de la ruta de la oficina por encima de la de eBGP y los dos sentidos volvieron al MPLS.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'choice',
          topic: 'op1m4',
          prompt: '¿Por qué, reparada la fibra, la oficina sigue enviando a la sede por el túnel? (Las distancias de la tabla están en la escala del fabricante de los encaminadores, igual a los valores por defecto de Cisco.)',
          options: [
            { id: 'a', text: 'Porque la sesión eBGP con el operador no ha vuelto a establecerse' },
            { id: 'b', text: 'Porque su ruta estática por `tun-respaldo` tiene distancia 1, la de por defecto, y gana a la de eBGP (20) mientras el túnel esté arriba; la sede, en cambio, tiene su estática a 250 y ha vuelto al MPLS' },
            { id: 'c', text: 'Porque el operador aún no ha restablecido la VRF del Consorcio en su red' },
            { id: 'd', text: 'Porque el túnel tiene más ancho de banda que el MPLS y la métrica lo prefiere' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'La tabla de la oficina tiene las dos rutas a `10.20.0.0/16`: la de eBGP, que ha vuelto, con distancia 20, y la estática por el túnel con 1. Gana la de menor distancia (op1m4), así que la estática no es «flotante»: lo sería con una distancia mayor que la de eBGP, como la de la sede, con 250. Las cifras son de la escala del fabricante, iguales a los valores por defecto de Cisco; no salen de ninguna norma. La sesión eBGP sí está (el registro de las 17:06:28 y la ruta en la tabla), y la VRF funciona: la sede llega a la oficina por el MPLS. Entre rutas de orígenes distintos no se comparan métricas.',
          refs: [L_RUTAS, L_CENTROS],
        },
        {
          id: 'f4t2',
          kind: 'numeric',
          topic: 'op2m5',
          prompt: 'Para el parte: ¿cuántos minutos estuvo la oficina sin ningún camino hacia la sede el martes, desde que cayó su acceso MPLS hasta que quedó establecida la SA hija del túnel?',
          answer: 94,
          unit: 'min',
          points: 3,
          explain:
            'El acceso MPLS cae a las 09:14:04 (registro de la oficina) y la SA hija queda establecida a las 10:48:04 (captura de la negociación): 1 h 34 min, es decir, **94 minutos**. Tienta contar desde las 09:31, la hora del aviso del operador, o desde las 09:25 de la llamada, pero la oficina llevaba aislada desde el corte.',
          refs: [L_CENTROS, L_IPSEC],
        },
        {
          id: 'f4t3',
          kind: 'numeric',
          topic: 'op1m4',
          prompt: '¿Cuántos minutos llevaba el tráfico yendo a la sede por el túnel y volviendo por el MPLS cuando se tomó la tabla de rutas del miércoles?',
          answer: 950,
          unit: 'min',
          points: 3,
          explain:
            'La asimetría empieza cuando la sede vuelve a usar el MPLS hacia la oficina, a las 17:06:30 del martes (antes, los dos sentidos iban por el túnel), y la tabla se toma el miércoles a las 08:56:30: 6 h 53 min 30 s hasta medianoche más 8 h 56 min 30 s, es decir, 15 h 50 min, **950 minutos**. Tienta contar desde las 17:02, el empalme, pero hasta que la sesión eBGP vuelve, la sede no tiene la ruta del MPLS.',
          refs: [L_RUTAS, L_CENTROS],
        },
        {
          id: 'f4t4',
          kind: 'choice',
          topic: 'op1m4',
          prompt: '¿Cómo lo corriges? (Distancias en la escala del fabricante, como en la tabla.)',
          options: [
            { id: 'a', text: 'Subiendo la distancia de la ruta estática de la oficina por encima de la de eBGP (por ejemplo, a 250, como en la sede) y comprobando que los dos sentidos vuelven al MPLS y el túnel se queda sin tráfico' },
            { id: 'b', text: 'Borrando la ruta estática por el túnel: con eBGP basta' },
            { id: 'c', text: 'Apagando el túnel hasta la próxima avería' },
            { id: 'd', text: 'Bajando a 1 la estática de la sede, para que los dos sentidos vayan por el túnel y no haya asimetría' },
          ],
          answer: 'a',
          points: 3,
          explain:
            'Una ruta flotante es una estática con la distancia por encima de la del protocolo al que respalda (op1m4): mientras eBGP aprende la ruta, la estática no se usa, y si falta, sale sola. Hay que comprobarlo en los dos extremos, porque el fallo era justo que uno lo hacía bien y el otro no. Borrar la estática o apagar el túnel deja otra vez a la oficina sin respaldo, que es lo que pasó el martes. Y mandar los dos sentidos por Internet elimina la asimetría a costa de perder la clase de servicio del MPLS para la voz.',
          refs: [L_RUTAS, L_CENTROS, L_WAN],
        },
        {
          id: 'f4t5',
          kind: 'cite',
          topic: 'op1m4',
          prompt: 'Señala los documentos que, juntos, prueban que el tráfico va a la sede por el túnel y vuelve por el MPLS.',
          answerSets: withExtras(['d-rutas', 'd-contadores-tunel'], ['d-quejas-miercoles', 'd-reparacion']),
          points: 3,
          explain:
            'Las rutas de los dos encaminadores enseñan la causa (la oficina instala la estática por el túnel; la sede, la de eBGP), y los contadores, el efecto: casi tres millones de paquetes salen de la oficina por el túnel y no entra nada. La llamada del miércoles encaja (solo se oye mal en un sentido, el que va por Internet sin clase de servicio) y el aviso del operador fecha la reparación, pero ninguno de los dos prueba por dónde va cada sentido.',
          refs: [L_RUTAS, L_WAN],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Que la próxima vez levante',
      context:
        'Todo funciona por el MPLS y el túnel está listo, sin tráfico. Queda dejar escrito cómo se prueba el respaldo, qué se cambia para que no vuelva a fallar en silencio y el parte de lo ocurrido.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'order',
          topic: 'op2m5',
          prompt: 'Ordena los pasos de la prueba periódica del respaldo de una oficina.',
          items: [
            { id: 'o5', text: 'Probar una transferencia grande (abrir un expediente, descargar un PDF), además del *ping* y una llamada' },
            { id: 'o2', text: 'Simular la caída del MPLS en la oficina (cortar la sesión con el operador o desconectar el acceso)' },
            { id: 'o8', text: 'Anotar el resultado, los tiempos y cualquier fallo en el registro de cambios' },
            { id: 'o4', text: 'Comprobar las rutas en los dos extremos: la oficina sale por el túnel y la sede vuelve por él' },
            { id: 'o1', text: 'Avisar a la oficina y elegir una franja de poco uso, con la vuelta atrás preparada' },
            { id: 'o7', text: 'Comprobar que los dos sentidos vuelven al MPLS y que el túnel se queda sin tráfico' },
            { id: 'o3', text: 'Comprobar que se crean la SA IKE y la SA hija, con qué algoritmos y por qué puertos (4500 si hay NAT)' },
            { id: 'o6', text: 'Restablecer el MPLS' },
          ],
          answer: ['o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7', 'o8'],
          points: 6,
          hint: { text: 'Cada fallo del martes se habría visto en un paso distinto: la negociación, las rutas, la MTU y la vuelta.', cost: 2 },
          explain:
            'Se avisa y se prepara la vuelta atrás antes de tocar nada; después se provoca la caída y se mira de abajo arriba: primero que el túnel negocie (ahí se habrían visto el NAT y las propuestas), luego que las rutas usen el túnel en los dos extremos, y luego que quepa una transferencia grande, porque el *ping* y la voz pasaban con la MTU rota. La prueba no acaba al levantar el túnel: hay que restablecer el MPLS y comprobar que los dos sentidos vuelven, que es lo que falló el miércoles. Y se anota, para que la siguiente prueba tenga con qué compararse.',
          refs: [L_CENTROS, L_IPSEC, L_RUTAS],
        },
        {
          id: 'f5t2',
          kind: 'multi',
          topic: 'op2m5',
          prompt: 'Marca **todas** las medidas que tienen sentido para que no se repita.',
          options: [
            { id: 'a', text: 'Hacer la prueba del respaldo de forma periódica y, además, después de cualquier cambio en el acceso de Internet, en las propuestas de IKE o en las rutas de una oficina' },
            { id: 'b', text: 'Cuando la sede endurezca sus algoritmos, llevar la lista de lo que ofrece cada oficina y no cerrar el cambio hasta que todas estén actualizadas y probadas' },
            { id: 'c', text: 'Estudiar la segunda fibra por otro trazado que el Consorcio pidió al operador para el acceso MPLS (presupuesto pendiente, sin decidir), y comprobar que los accesos de la oficina no compartan zanja; la diversidad de trazado es práctica de diseño, no una norma' },
            { id: 'd', text: 'Dejar 3DES y el grupo 2 como segunda propuesta en todas las oficinas, por si acaso' },
            { id: 'e', text: 'Desactivar la detección de NAT para que el túnel vaya siempre por UDP 500 y no dependa del 4500' },
            { id: 'f', text: 'Usar los NAT-keepalive para dar por caída la sede y conmutar antes' },
            { id: 'g', text: 'Actualizar la ficha de diseño cuando cambie un acceso (dirección, NAT, filtro, MTU), y revisar con ella la configuración del túnel' },
          ],
          answer: ['a', 'b', 'c', 'g'],
          points: 5,
          explain:
            'Las cuatro medidas buenas atacan por qué el fallo estuvo escondido: nadie probó el túnel tras el cambio del proveedor ni tras el endurecimiento, la oficina pendiente se quedó así dos meses, y la ficha seguía describiendo un acceso que ya no existía. La segunda fibra por otro trazado es la que el Consorcio pidió al operador, según su aviso de las 17:10, con el presupuesto pendiente: se propone, no está aprobada, y tener dos fibras por la misma zanja no protegería de otra excavadora. Mantener 3DES y el grupo 2 va contra lo que se quería retirar: el grupo 2 es SHOULD NOT en la RFC 8247, 3DES es SHOULD NOT en ESP según la RFC 8221 y NIST SP 800-77r1 aconseja no usar ninguno de los dos; la RFC 9395 pide además no arrastrar a IKEv2 la configuración de IKEv1 sin revisar sus algoritmos. La encapsulación en UDP **nunca** va por el 500 (RFC 7296 §2.23), así que con NAT no hay túnel sin el 4500. Y el NAT-keepalive no debe usarse para saber si el otro vive (RFC 3948).',
          refs: [L_CENTROS, L_IPSEC, RFC8247, RFC8221, SP80077, RFC9395, RFC7296, RFC3948],
        },
        {
          id: 'f5t3',
          kind: 'written',
          topic: 'op2m5',
          prompt: 'Redacta en **150 a 230 palabras** el parte para la jefatura del Servicio de Informática y Comunicaciones: qué pasó, cuánto duró, qué se corrigió y qué propones. Después, compáralo con el modelo y marca los criterios que cumple.',
          words: 230,
          model:
            'El martes a las 09:14 una excavadora cortó la fibra del operador y la oficina 10.20.9.0/24 se quedó 94 minutos sin conexión con la sede: el túnel de respaldo no levantó por cuatro fallos sin probar. Uno: desde el cambio de equipo del proveedor, la oficina está detrás de un NAT, el túnel conservaba la dirección pública como dirección local y el filtro del proveedor cerraba el UDP 4500; se corrigió la dirección y se abrió el puerto. Dos: la oficina ofrecía 3DES, SHA-1 y el grupo 2, que la sede retiró hace dos meses; se cambió por AES-GCM-16, PRF_HMAC_SHA2_256 y los grupos 19 y 14. Tres: las descargas se colgaban porque el cortafuegos de la sede tiraba los ICMP tipo 3, código 4; se permitieron y se ajustó el MSS a 1395. Cuatro: tras la reparación, la ruta de respaldo de la oficina, con distancia 1, ganaba a la de eBGP, y durante al menos 950 minutos la voz fue a la sede por Internet, a trozos; se subió la distancia.\n\n' +
            'Propongo probar el respaldo periódicamente y tras cada cambio, con una descarga grande y la vuelta al MPLS; no cerrar un endurecimiento sin probar todas las oficinas, y estudiar la segunda fibra por otro trazado pedida al operador, con presupuesto pendiente. Las distancias son valores del fabricante, no de una norma.',
          rubric: [
            { id: 'r1', text: 'Separa las cuatro causas con su efecto: dirección local y UDP 4500 por el NAT nuevo, propuestas retiradas por la sede, ICMP filtrado con descargas colgadas, y distancia de la ruta de respaldo con la vuelta asimétrica', points: 4 },
            { id: 'r2', text: 'Da el alcance con cifras del expediente: 94 minutos de aislamiento, el MSS de 1395 y los 950 minutos de asimetría', points: 2 },
            { id: 'r3', text: 'Dice qué se corrigió en cada caso (dirección local y 4500, perfil nuevo, ICMP y MSS, distancia de la ruta)', points: 2 },
            { id: 'r4', text: 'Propone medidas concretas: prueba periódica y tras cada cambio con descarga grande y vuelta al MPLS, endurecimientos cerrados solo con todas las oficinas probadas, y la segunda fibra por otro trazado como propuesta pendiente', points: 1 },
            { id: 'r5', text: 'Rotula lo que no es norma: las distancias son del fabricante y la segunda fibra está sin aprobar', points: 1 },
          ],
          points: 10,
          explain:
            'El parte tiene que dejar claro que no fue «la línea de reserva no funciona», sino una cadena de fallos que se iban tapando unos a otros: el NAT impedía ver las propuestas, las propuestas impedían ver la MTU, y la ruta mal puesta solo se vio al volver el MPLS. Cada uno tiene su corrección y su medida. Tienta contarlo solo como una avería del operador, pero el corte de la fibra fue el detonante: el respaldo llevaba al menos dos meses roto. Las cifras dan la medida del daño, y lo que es valor de un fabricante o propuesta sin aprobar se dice como tal.',
          refs: [L_CENTROS, L_IPSEC, L_RUTAS],
        },
      ],
    },
  ],
  sources: [L_IPSEC, L_CENTROS, L_RUTAS, L_NAT, L_WAN, RFC7296, RFC3948, RFC8247, RFC8221, RFC9395, RFC4106, RFC1191, RFC8201, RFC4459, RFC9293, RFC9329, SP80077],
};

export default op2s2;
