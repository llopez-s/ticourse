import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op4s2 — «El último día de plazo» (bloque 4, Balanceo y alta disponibilidad; avería)
//
// Fuente única: docs/superpowers/sources/2026-11-27-op4-fuentes.md. Canon: §7d de
// docs/superpowers/canon/arcedo.md (ADC1 10.20.72.71 y ADC2 10.20.72.72 en
// activo-pasivo con VIP 10.20.72.70; grupo sede SEDE1 .91 y SEDE2 .92 en el 443
// con TLS recifrado; cookie insertada por el ADC; comprobación GET /salud que
// espera 200). No toca el registro electrónico (lo usa op4s1).
// Hechos nuevos del caso (ver el informe de la tarea):
// - Cronología del caso, sin fechas: el plazo de unas ayudas cierra el jueves a
//   las 23:59. Miércoles 18:40: al servicio virtual sede se le aplica una copia
//   del perfil de www (sin persistencia, menos conexiones). Jueves 02:13:21 a
//   02:17:29: los dos ADC activos a la vez (248 s). Jueves 07:58: SEDE2 empieza a
//   devolver 500 («almacén temporal de sesiones lleno»); 07:58:16 sale del grupo;
//   08:18:40 la guardia cambia la comprobación a una conexión TCP al 443 y
//   08:18:44 SEDE2 vuelve a entrar.
// - Algoritmo del grupo sede antes del cambio: round robin con pesos iguales
//   (§7d no lo fijaba). Nombre de la cookie insertada: SEDE_SRV, valores s1/s2.
//   Cookie de sesión de la aplicación: SESION_APP. Cabecera de diagnóstico
//   X-Servidor que añade la aplicación.
// - Comprobaciones del grupo sede: intervalo 2 s, 3 fallos para salir y 2
//   aciertos para volver. op4m4 dice que no estaban decididas: son valores que
//   configura el Consorcio en su ADC, iguales a los valores por defecto que
//   documenta HAProxy 3.4 (inter, fall, rise; valores del fabricante). El ADC no
//   se llama HAProxy en ningún sitio.
// - MAC de las interfaces de datos de los ADC: 00:00:5e:00:53:71 (ADC1) y
//   00:00:5e:00:53:72 (ADC2), rango de documentación. Cada ADC anuncia la VIP
//   con su propia MAC (comportamiento del protocolo de alta disponibilidad de
//   su fabricante, dato del caso). El enlace de latido pasa por el panel de
//   parcheo P3, puerto 22, del bastidor B; no se numera.
// - El ARP no solicitado («ARP gratuito») no está en el dossier de op4: sale solo
//   como observación del encaminador, sin afirmaciones normativas.
// - Por qué se cortó el latido queda sin confirmar, como dice el fragmento del
//   jefe: el parte de la empresa de mantenimiento dice «sin incidencias».
// - Otros hechos del caso: ADC1 es el activo habitual (prioridad mayor); la
//   configuración se hace en ADC1 y el ADC la copia a ADC2; el protocolo de la
//   pareja da por caído al otro tras 3 s sin latido (valor del fabricante,
//   configurado así); una empresa de mantenimiento del CPD, por contrato (no
//   figura entre las empresas de §7b), cambia latiguillos del panel P3 esa
//   noche y su parte dice «ninguna incidencia»; sus trabajos no pasan por el
//   registro de cambios; la causa del fallo de SEDE2 es «almacén temporal de
//   sesiones lleno»; el jueves es el día de más tráfico del año en la sede.
// - Direcciones de ciudadanos: 192.0.2.x y 198.51.100.120 / .140 (documentación).
// ---------------------------------------------------------------------------

const L1 = { label: 'Lección: alta disponibilidad: conceptos y cálculo', href: '/learn/op4m1' };
const L2 = { label: 'Lección: balanceo en capa 4', href: '/learn/op4m2' };
const L3 = { label: 'Lección: balanceo en capa 7 y persistencia de sesión', href: '/learn/op4m3' };
const L4 = { label: 'Lección: comprobaciones de salud', href: '/learn/op4m4' };
const L5 = { label: 'Lección: descarga de TLS y publicación de aplicaciones', href: '/learn/op4m5' };
const LARP = { label: 'Lección: modelos OSI y TCP/IP (trama Ethernet y ARP)', href: '/learn/op1m1' };
const RFC6265 = { label: 'RFC 6265: cookies (Set-Cookie, Secure, HttpOnly)', href: 'https://www.rfc-editor.org/rfc/rfc6265' };
const HAP = {
  label: 'HAProxy 3.4: manual de configuración (check, inter, fall, rise, leastconn, cookie insert; valores del fabricante)',
  href: 'https://docs.haproxy.org/3.4/configuration.html',
};
const MS_CLUSTER = {
  label: 'Microsoft: clúster de conmutación por error (latido, activo-pasivo; documentación del fabricante)',
  href: 'https://learn.microsoft.com/en-us/windows-server/failover-clustering/failover-clustering-overview',
};
const MS_QUORUM = {
  label: 'Microsoft: quórum y testigo (documentación del fabricante)',
  href: 'https://learn.microsoft.com/en-us/windows-server/storage/storage-spaces/quorum',
};

/** Cada conjunto base más cualquier combinación de documentos que solo suman. */
const withExtras = (base: string[], extras: string[]): string[][] =>
  Array.from({ length: 2 ** extras.length }, (_, mask) => [...base, ...extras.filter((_, i) => mask & (1 << i))]);

const op4s2: Supuesto = {
  id: 'op4s2',
  track: 'opo',
  sectionIds: ['op4'],
  version: 1,
  title: 'El último día de plazo',
  brief: 'Último día para pedir unas ayudas: en la sede electrónica se pierden formularios a medias, salen errores con el balanceador en verde y una madrugada los dos ADC se creyeron activos. Separa las tres averías, mide su alcance, corrige en un orden que no empeore nada y propón cómo evitarlas.',
  minutes: 60,
  prerequisites: ['op4m1', 'op4m2', 'op4m3', 'op4m4', 'op4m5'],
  dossier: [
    {
      id: 'd-quejas',
      title: 'Quejas y avisos sobre la sede electrónica · desde el miércoles por la tarde hasta el jueves a las 09:30',
      kind: 'table',
      body: [
        { t: 'p', md: 'El plazo para pedir las ayudas termina hoy, **jueves, a las 23:59**. Es el día de más tráfico del año en `sede.arcedo.example`.' },
        {
          t: 'table',
          headers: ['Nº', 'Cuándo', 'Quién y desde dónde', 'Lo que cuenta'],
          rows: [
            ['Q1', 'Miércoles 20:52', 'Ciudadana, desde `192.0.2.41`', '«Relleno los datos personales, pulso "Siguiente" y me vuelve a pedir que me identifique. El formulario, en blanco.»'],
            ['Q2', 'Miércoles 22:15', 'Ciudadano, desde `192.0.2.77`', '«He perdido el formulario dos veces a mitad. A la tercera lo he podido terminar.»'],
            ['Q3', 'Jueves 02:16', 'Ciudadano, desde `192.0.2.130`', '«Estaba adjuntando la documentación y la página se ha quedado cargando hasta dar un error de conexión.»'],
            ['Q4', 'Jueves 02:18', 'Aviso automático de la empresa de vigilancia de la red', '«El encaminador central ha cambiado varias veces, entre las 02:13 y las 02:17, la dirección MAC que asocia a `10.20.72.70`.»'],
            ['Q5', 'Jueves 08:47', 'Oficina de un ayuntamiento de la provincia que tramita solicitudes de sus vecinos, desde `198.51.100.120`', '«Unas veces sale "Error interno del servidor" y otras nos vuelve a pedir la identificación a mitad del formulario.»'],
            ['Q6', 'Jueves 09:05', 'Ciudadana, desde `192.0.2.200`', '«Al pulsar "Presentar" sale una página en blanco que pone "500 Internal Server Error". Tres veces seguidas.»'],
            ['Q7', 'Jueves 09:20', 'Oficina de atención presencial de la sede central', '«El escáner del mostrador no reconoce los documentos.»'],
            ['Q8', 'Jueves 09:30', 'Técnico de guardia del Servicio de Informática y Comunicaciones', '«El panel del ADC muestra SEDE1 y SEDE2 en verde (UP) y no hay ninguna alarma.»'],
          ],
        },
        { t: 'p', md: 'Entre las 02:18 y las 08:47 no llegó ninguna queja más: de madrugada y a primera hora entra poca gente en la sede.' },
      ],
    },
    {
      id: 'd-inventario',
      title: 'Ficha de la publicación de www y sede (diseño aprobado)',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Elemento', 'Dirección', 'Notas'],
          rows: [
            ['Encaminador central', '`203.0.113.10` (única dirección pública)', 'Reenvía el puerto 443 de `203.0.113.10` a la VIP `10.20.72.70:443`'],
            ['VIP de la pareja de ADC', '`10.20.72.70`', 'La tiene el ADC activo; `www.arcedo.example` y `sede.arcedo.example` se distinguen por SNI y por `Host`'],
            ['ADC1', '`10.20.72.71`', 'Activo en condiciones normales (prioridad mayor). MAC de la interfaz de datos `00:00:5e:00:53:71`'],
            ['ADC2', '`10.20.72.72`', 'Pasivo en condiciones normales. MAC de la interfaz de datos `00:00:5e:00:53:72`'],
            ['Grupo `www`', 'WEB1 `10.20.72.81`, WEB2 `10.20.72.82`, puerto 80', 'TLS terminado en el ADC; sin persistencia; menos conexiones; comprobación HTTP a `/` que espera `200`'],
            ['Grupo `sede`', 'SEDE1 `10.20.72.91`, SEDE2 `10.20.72.92`, puerto 443', 'TLS terminado en el ADC y recifrado hacia los servidores; persistencia por *cookie* que inserta el ADC, porque la aplicación guarda la sesión en la memoria de cada servidor; comprobación `GET /salud` que espera `200`'],
          ],
        },
        {
          t: 'list',
          items: [
            '**Alta disponibilidad de la pareja:** activo-pasivo con el protocolo de alta disponibilidad del fabricante del ADC. Cada ADC anuncia la VIP con la MAC de su propia interfaz de datos (comportamiento de ese protocolo, según la configuración del Consorcio).',
            '**Enlace de latido:** un único cable directo entre ADC1 y ADC2, sin conmutador por medio, que pasa por el **panel de parcheo P3, puerto 22, del bastidor B** del CPD.',
            '**Configuración:** se hace en ADC1 y el propio ADC la copia a ADC2.',
          ],
        },
      ],
    },
    {
      id: 'd-esquema',
      title: 'Esquema de la publicación',
      kind: 'diagram',
      diagram: {
        width: 760,
        height: 470,
        zones: [
          { label: 'CPD de la sede central', x: 150, y: 150, w: 594, h: 306 },
        ],
        nodes: [
          { id: 'inet', label: 'Internet', kind: 'cloud', x: 80, y: 60, sub: 'ciudadanos' },
          { id: 'enc', label: 'Encaminador', kind: 'router', x: 300, y: 60, sub: '203.0.113.10 :443' },
          { id: 'adc1', label: 'ADC1', kind: 'server', x: 260, y: 220, sub: 'activo' },
          { id: 'adc2', label: 'ADC2', kind: 'server', x: 480, y: 220, sub: 'pasivo' },
          { id: 'web1', label: 'WEB1', kind: 'server', x: 230, y: 390, sub: 'www :80' },
          { id: 'web2', label: 'WEB2', kind: 'server', x: 370, y: 390, sub: 'www :80' },
          { id: 'sede1', label: 'SEDE1', kind: 'server', x: 520, y: 390, sub: 'sede :443' },
          { id: 'sede2', label: 'SEDE2', kind: 'server', x: 660, y: 390, sub: 'sede :443' },
        ],
        links: [
          { from: 'inet', to: 'enc' },
          { from: 'enc', to: 'adc1', label: 'VIP 10.20.72.70' },
          { from: 'enc', to: 'adc2' },
          { from: 'adc1', to: 'adc2', label: 'latido (P3:22)' },
          { from: 'adc1', to: 'web1' },
          { from: 'adc1', to: 'web2' },
          { from: 'adc1', to: 'sede1' },
          { from: 'adc1', to: 'sede2' },
        ],
      },
    },
    {
      id: 'd-trazas',
      title: 'Prueba del técnico de guardia con un navegador · jueves 07:40, y la misma prueba del lunes',
      kind: 'log',
      unlockedBy: 'f1',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante. La cabecera X-Servidor la añade la aplicación para diagnóstico',
          text: `Jueves 07:40 · portátil de pruebas en una línea móvil, 198.51.100.140

1  GET  /ayudas/solicitud          Cookie: (ninguna)
   <- 200   X-Servidor: SEDE1
            Set-Cookie: SESION_APP=7c1e90; Path=/; Secure; HttpOnly
2  POST /ayudas/solicitud/datos    Cookie: SESION_APP=7c1e90
   <- 302   Location: /acceso   X-Servidor: SEDE2   («sesión no encontrada»)
3  GET  /acceso                    Cookie: SESION_APP=7c1e90
   <- 200   X-Servidor: SEDE1

Lunes 10:05 · misma prueba, archivo de pruebas de la sede

1  GET  /ayudas/solicitud          Cookie: (ninguna)
   <- 200   X-Servidor: SEDE2
            Set-Cookie: SESION_APP=19ab44; Path=/; Secure; HttpOnly
            Set-Cookie: SEDE_SRV=s2; Path=/; Secure; HttpOnly
2  POST /ayudas/solicitud/datos    Cookie: SESION_APP=19ab44; SEDE_SRV=s2
   <- 200   X-Servidor: SEDE2
3  POST /ayudas/solicitud/adjuntos Cookie: SESION_APP=19ab44; SEDE_SRV=s2
   <- 200   X-Servidor: SEDE2`,
        },
      ],
    },
    {
      id: 'd-perfil',
      title: 'Servicio virtual «sede» en ADC1: copia de seguridad del lunes y configuración actual',
      kind: 'config',
      unlockedBy: 'f1',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Extracto (sintaxis ilustrativa: cada fabricante usa la suya). La comprobación de salud está en otro apartado',
          text: `                      copia del lunes                    configuración actual
escucha               10.20.72.70:443                    10.20.72.70:443
nombre (SNI y Host)   sede.arcedo.example                sede.arcedo.example
certificado           sede.arcedo.example (ca.example)   sede.arcedo.example (ca.example)
perfil HTTP           perfil-sede                        perfil-www-copia
  persistencia        cookie insertada SEDE_SRV          ninguna
                      (de sesión; Secure; HttpOnly)
  algoritmo           round robin                        menos conexiones
grupo                 sede                               sede
  miembros            SEDE1 10.20.72.91:443  peso 1  valor s1    sin cambios
                      SEDE2 10.20.72.92:443  peso 1  valor s2
  hacia los miembros  TLS (recifrado)                   TLS (recifrado)`,
        },
      ],
    },
    {
      id: 'd-cambios',
      title: 'Registro de cambios del Servicio de Informática y Comunicaciones (martes a jueves)',
      kind: 'table',
      unlockedBy: 'f2',
      body: [
        {
          t: 'table',
          headers: ['Cuándo', 'Equipo', 'Cambio', 'Comprobación'],
          rows: [
            ['Martes 11:00', 'Cortafuegos de la sede', 'Actualización de las firmas', 'Sin incidencias'],
            ['Miércoles 18:40', 'ADC1 (copiado a ADC2)', 'Servicio virtual `sede`: el perfil HTTP pasa a ser una copia de `perfil-www`. Motivo: «unificar las cabeceras de seguridad de los dos sitios»', 'La portada de la sede abre'],
            ['Jueves 08:18 (urgente, guardia)', 'ADC1 (copiado a ADC2)', 'Comprobación del grupo `sede`: de «HTTPS `GET /salud`, espera `200`» a «conexión TCP al 443». Motivo: «falsa alarma: SEDE2 responde al *ping* y el 443 está abierto»', 'SEDE2 vuelve a UP'],
          ],
        },
        { t: 'p', md: 'Los trabajos de la empresa de mantenimiento del CPD no se apuntan en este registro.' },
      ],
    },
    {
      id: 'd-comprobacion',
      title: 'Comprobaciones de salud del grupo «sede» (configuración actual de ADC1)',
      kind: 'config',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Extracto (sintaxis ilustrativa: cada fabricante usa la suya)',
          text: `grupo sede · comprobación activa
  tipo        conexión TCP al 443           # hasta el jueves 08:18: HTTPS GET /salud, espera 200
  intervalo   2 s
  bajada      3 fallos seguidos  -> DOWN, fuera del reparto
  subida      2 aciertos seguidos -> UP, entra en el reparto`,
        },
        { t: 'p', md: 'El Servicio de Informática puso el intervalo y los umbrales copiando los valores por defecto que documenta **HAProxy 3.4** para `inter` (2000 ms), `fall` (3) y `rise` (2): son **valores de un fabricante**, no de una norma, y el ADC del Consorcio no es HAProxy.' },
      ],
    },
    {
      id: 'd-registro-adc',
      title: 'Registro de ADC1 · grupo «sede» · jueves por la mañana',
      kind: 'log',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante',
          text: `07:58:12  sede/SEDE2  HTTPS GET /salud -> 500           fallo 1 de 3
07:58:14  sede/SEDE2  HTTPS GET /salud -> 500           fallo 2 de 3
07:58:16  sede/SEDE2  HTTPS GET /salud -> 500           fallo 3 de 3  -> SEDE2 DOWN, fuera del reparto
08:18:40  configuración  grupo sede: comprobación = conexión TCP al 443   (usuario: guardia)
08:18:42  sede/SEDE2  conexión TCP 443 -> establecida   acierto 1 de 2
08:18:44  sede/SEDE2  conexión TCP 443 -> establecida   acierto 2 de 2  -> SEDE2 UP, entra en el reparto`,
        },
      ],
    },
    {
      id: 'd-salud',
      title: 'Pruebas manuales desde ADC1 contra SEDE1 y SEDE2 · jueves 09:50',
      kind: 'log',
      unlockedBy: 'f2',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante',
          text: `SEDE1  ping                         -> responde
SEDE1  conexión TCP 443              -> establecida
SEDE1  HTTPS GET /salud              -> 200   {"estado":"ok"}
SEDE1  HTTPS GET /ayudas/solicitud   -> 200

SEDE2  ping                         -> responde
SEDE2  conexión TCP 443              -> establecida
SEDE2  HTTPS GET /salud              -> 500   {"estado":"ko","detalle":"almacén temporal de sesiones lleno"}
SEDE2  HTTPS GET /ayudas/solicitud   -> 500`,
        },
      ],
    },
    {
      id: 'd-estadisticas',
      title: 'Estadísticas del grupo «sede» en ADC1 · jueves de 10:00:00 a 10:15:00',
      kind: 'table',
      unlockedBy: 'f2',
      body: [
        {
          t: 'table',
          headers: ['Miembro', 'Peticiones', 'Respuestas 2xx y 3xx', 'Respuestas 5xx', 'Tiempo medio de respuesta', 'Conexiones activas de media'],
          rows: [
            ['SEDE1', '1840', '1840', '0', '180 ms', '31'],
            ['SEDE2', '2760', '0', '2760', '4 ms', '2'],
          ],
        },
        { t: 'p', md: 'Las respuestas 5xx de SEDE2 son todas 500, generadas por la aplicación y entregadas tal cual al ciudadano.' },
      ],
    },
    {
      id: 'd-ha',
      title: 'Registros de alta disponibilidad de ADC1 y ADC2 · jueves de madrugada',
      kind: 'log',
      unlockedBy: 'f3',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante. Los 3 s sin latido para declarar caído al otro son un valor del protocolo del fabricante del ADC, configurado así por el Consorcio',
          text: `ADC1
02:13:18  latido: sin respuesta de ADC2
02:13:21  latido perdido (3 s sin respuesta); ADC1 sigue ACTIVO con la VIP 10.20.72.70
02:17:29  latido recuperado; ADC2 dice estar ACTIVO; se resuelve por prioridad: ADC1 ACTIVO
02:17:29  ADC1 anuncia la VIP 10.20.72.70 con su MAC

ADC2
02:13:18  latido: sin respuesta de ADC1
02:13:21  latido perdido (3 s sin respuesta); ADC1 se da por caído; ADC2 pasa a ACTIVO
02:13:21  ADC2 anuncia la VIP 10.20.72.70 con su MAC 00:00:5e:00:53:72
02:17:29  latido recuperado; ADC1 ACTIVO con prioridad mayor; ADC2 pasa a PASIVO`,
        },
        { t: 'p', md: 'Ninguno de los dos se reinició ni perdió la alimentación: sus registros de sistema siguen sin cortes toda la noche. Los dos registran conexiones de clientes cortadas a mitad entre las 02:13 y las 02:18.' },
      ],
    },
    {
      id: 'd-arp',
      title: 'Encaminador central: cambios de la entrada ARP de 10.20.72.70 · jueves de madrugada',
      kind: 'log',
      unlockedBy: 'f3',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Salida ilustrativa, sin sintaxis de fabricante. Cada cambio lo provoca un anuncio ARP que nadie había pedido (lo que se suele llamar ARP gratuito)',
          text: `02:13:21  10.20.72.70  00:00:5e:00:53:71 -> 00:00:5e:00:53:72
02:13:52  10.20.72.70  00:00:5e:00:53:72 -> 00:00:5e:00:53:71
02:14:23  10.20.72.70  00:00:5e:00:53:71 -> 00:00:5e:00:53:72
02:14:55  10.20.72.70  00:00:5e:00:53:72 -> 00:00:5e:00:53:71
02:15:26  10.20.72.70  00:00:5e:00:53:71 -> 00:00:5e:00:53:72
02:15:58  10.20.72.70  00:00:5e:00:53:72 -> 00:00:5e:00:53:71
02:16:30  10.20.72.70  00:00:5e:00:53:71 -> 00:00:5e:00:53:72
02:17:29  10.20.72.70  00:00:5e:00:53:72 -> 00:00:5e:00:53:71
total: 8 cambios; desde las 02:17:29, ninguno más`,
        },
      ],
    },
    {
      id: 'd-mantenimiento',
      title: 'Parte de trabajo de la empresa de mantenimiento del CPD · jueves',
      kind: 'memo',
      unlockedBy: 'f3',
      body: [
        { t: 'p', md: '**Horario:** de 02:05 a 02:25. **Lugar:** bastidor B del CPD.' },
        { t: 'p', md: '**Trabajo:** sustitución de los latiguillos dañados del **panel de parcheo P3, puertos 17 a 24**, uno a uno.' },
        { t: 'p', md: '**Incidencias:** «Ninguna.»' },
        { t: 'p', md: '**Nota del Servicio de Informática:** el trabajo estaba en el contrato de mantenimiento, pero nadie del Servicio sabía que se hacía esa noche ni qué servicios dependían de esos puertos.' },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'Separar los síntomas',
      context:
        'Jueves, 10:20. Último día del plazo de las ayudas y la sede electrónica no va bien. Las quejas parecen la misma: «la sede falla». Antes de tocar nada, ordénalas: qué va con qué, qué no tiene que ver y por dónde empezar a mirar en cada caso.',
      carry:
        'Hay tres problemas distintos. Desde el miércoles por la tarde, formularios que vuelven al principio a mitad del trámite. Desde el jueves por la mañana, errores 500 mientras el panel del ADC enseña los dos servidores en verde. Y unos minutos de la madrugada en que el encaminador cambió varias veces la MAC de la VIP y se cortaron conexiones. El escáner es otra historia.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'table',
          topic: 'op4m3',
          prompt: 'Clasifica cada queja o aviso según el problema al que pertenece.',
          fields: [
            { id: 'grupo', label: 'Problema', options: ['Sesión que se pierde', 'Error del servidor', 'Los dos a la vez', 'La madrugada de la VIP', 'Ajeno a la sede'] },
          ],
          rows: [
            { id: 'q1', label: 'Q1 · miércoles 20:52: vuelve a pedir la identificación', answer: { grupo: 'Sesión que se pierde' } },
            { id: 'q2', label: 'Q2 · miércoles 22:15: pierde el formulario a mitad', answer: { grupo: 'Sesión que se pierde' } },
            { id: 'q3', label: 'Q3 · jueves 02:16: página colgada y error de conexión', answer: { grupo: 'La madrugada de la VIP' } },
            { id: 'q4', label: 'Q4 · jueves 02:18: la MAC de 10.20.72.70 cambia varias veces', answer: { grupo: 'La madrugada de la VIP' } },
            { id: 'q5', label: 'Q5 · jueves 08:47: el ayuntamiento ve errores y vuelve a la identificación', answer: { grupo: 'Los dos a la vez' } },
            { id: 'q6', label: 'Q6 · jueves 09:05: «500 Internal Server Error» al presentar', answer: { grupo: 'Error del servidor' } },
            { id: 'q7', label: 'Q7 · jueves 09:20: el escáner del mostrador', answer: { grupo: 'Ajeno a la sede' } },
            { id: 'q8', label: 'Q8 · jueves 09:30: el panel del ADC, todo en verde', answer: { grupo: 'Error del servidor' } },
          ],
          points: 7,
          explain:
            'Q1 y Q2 cuentan lo mismo: el trámite vuelve a la identificación, que es lo que pasa cuando la petición siguiente llega a un servidor que no tiene la sesión. Q6 es un error del servidor en estado puro, y Q8 pertenece a ese mismo problema aunque no lo parezca: el balanceador ve sanos a los dos servidores mientras los ciudadanos reciben 500, así que la comprobación no está viendo lo que ven ellos. Q5 junta las dos cosas, error y vuelta a la identificación: es la queja de la mañana, cuando los dos problemas conviven. Q3 y Q4 son de madrugada, con conexiones que se cuelgan y una VIP que cambia de MAC: eso apunta a la pareja de balanceadores, no a los servidores. Tienta poner Q3 con las sesiones perdidas, pero no habla de volver a la identificación sino de una conexión que se corta. El escáner no tiene nada que ver.',
          refs: [L3, L4, L1],
        },
        {
          id: 'f1t2',
          kind: 'choice',
          topic: 'op4m4',
          prompt: 'Alguien propone tratarlo todo como una avería de SEDE2. ¿Qué dato de las quejas lo desmiente?',
          options: [
            { id: 'a', text: 'Ninguno: todas las quejas son de la sede electrónica, y la sede tiene dos servidores, así que basta con revisar el que falla' },
            { id: 'b', text: 'Que el panel del ADC enseña los dos servidores en verde: si estuvieran mal, el ADC ya los habría sacado del grupo' },
            { id: 'c', text: 'Que el ayuntamiento llega desde una dirección del operador: lo de la mañana es una caída de Internet en la provincia' },
            { id: 'd', text: 'Los formularios se pierden desde el miércoles por la tarde, cuando nadie habla todavía de errores 500; los 500 aparecen el jueves por la mañana; y lo de la madrugada viene con un aviso sobre la MAC de la VIP, que es de la pareja de ADC y no de un servidor' },
          ],
          answer: 'd',
          points: 4,
          explain:
            'Las fechas separan los problemas: los formularios perdidos empiezan el miércoles a las 20:52 y en ninguna queja de esa noche aparece un error del servidor; el primer 500 es del jueves por la mañana; y la madrugada trae un síntoma de red, la MAC asociada a la VIP. Fiarse del panel en verde es justo el error que se quiere evitar: Q6 recibe un 500 veinticinco minutos antes de que la guardia vea todo en verde, así que lo que falla es lo que mira el panel. Y si Internet se cayera en la provincia, el ayuntamiento no recibiría páginas de error de la sede.',
          refs: [L4, L3, L1],
        },
        {
          id: 'f1t3',
          kind: 'choice',
          topic: 'op4m3',
          prompt: '¿Por dónde empiezas a mirar en cada problema?',
          options: [
            { id: 'a', text: 'Reiniciar los dos ADC para empezar de cero; si sigue fallando, reiniciar SEDE1 y SEDE2' },
            { id: 'b', text: 'Sesiones: si las respuestas siguen trayendo la cookie de persistencia que inserta el ADC y qué ha cambiado en el servicio virtual. Errores: qué responden SEDE2 y SEDE1 a la aplicación y a `/salud`, y qué comprueba de verdad el ADC. Madrugada: los registros de alta disponibilidad de los dos ADC y la tabla ARP del encaminador' },
            { id: 'c', text: 'Sesiones: pasar ya la persistencia a IP de origen. Errores: quitar las comprobaciones de salud para que no molesten. Madrugada: nada, ya pasó' },
            { id: 'd', text: 'Pedir a los ciudadanos que borren las cookies del navegador y lo intenten desde otro equipo' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'Primero se mide y después se cambia. Que el trámite vuelva al principio es lo que se espera si se rompe la persistencia, y la de la sede la hace una cookie que inserta el ADC: lo primero es mirar si sigue llegando. Que el panel diga «sano» mientras los ciudadanos ven 500 obliga a comparar lo que responde cada servidor con lo que pregunta la comprobación. Y una VIP que cambia de MAC se mira en los registros de la pareja y en el encaminador. Reiniciar el último día del plazo corta las sesiones de todo el mundo y borra pistas. Cambiar la persistencia o quitar las comprobaciones sin diagnóstico es tocar a ciegas, y lo de la madrugada puede repetirse.',
          refs: [L3, L4, L1],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'La sesión que se pierde',
      context:
        'Ahora tienes en el expediente la prueba que hizo el técnico de guardia a las 07:40, antes de que empezaran los errores, y la configuración del servicio virtual de la sede, la actual y la copia del lunes. Averigua por qué el trámite vuelve al principio.',
      carry:
        'Desde el miércoles a las 18:40 el servicio virtual de la sede usa una copia del perfil de `www`, que no tiene persistencia y reparte por menos conexiones. El ADC ya no inserta la cookie `SEDE_SRV`, así que las peticiones de un mismo trámite pueden ir a servidores distintos, y como la sesión vive en la memoria del servidor que la creó, el otro no la encuentra. La persistencia por IP de origen no es la salida.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'multi',
          topic: 'op4m3',
          prompt: 'Marca **todo** lo que demuestra la prueba del jueves a las 07:40 comparada con la del lunes.',
          options: [
            { id: 'a', text: 'Las respuestas del jueves ya no traen el `Set-Cookie: SEDE_SRV` que pone el ADC; solo la cookie de la aplicación, `SESION_APP`' },
            { id: 'b', text: 'Las peticiones de un mismo trámite, con la misma `SESION_APP`, llegan a servidores distintos' },
            { id: 'c', text: 'SEDE2 no reconoce una sesión que creó SEDE1, porque cada servidor guarda las sesiones en su propia memoria' },
            { id: 'd', text: 'El navegador rechaza las cookies: por eso se pierde la sesión' },
            { id: 'e', text: 'La dirección del portátil cambia entre peticiones y eso confunde al ADC' },
            { id: 'f', text: 'El recifrado hacia SEDE2 falla: el 302 lo genera el ADC al no poder hablar TLS con SEDE2' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'El lunes, la primera respuesta traía dos cookies: la de la aplicación y `SEDE_SRV=s2`, la que inserta el ADC para recordar el servidor; el navegador devolvía las dos y todo el trámite iba a SEDE2. El jueves solo llega `SESION_APP`, y la segunda petición cae en SEDE2, que responde «sesión no encontrada» porque esa sesión vive en la memoria de SEDE1. El navegador no rechaza nada: devuelve `SESION_APP` en cada petición (RFC 6265, la cookie va en la cabecera `Cookie`). La dirección es la misma en las tres peticiones. Y el 302 trae la cabecera `X-Servidor: SEDE2`, que pone la aplicación: SEDE2 contestó, así que el TLS hacia él funciona.',
          refs: [L3, RFC6265, HAP],
        },
        {
          id: 'f2t2',
          kind: 'choice',
          topic: 'op4m3',
          prompt: 'Con la configuración del servicio virtual, ¿qué ha roto la persistencia?',
          options: [
            { id: 'a', text: 'La cookie `SEDE_SRV` es de sesión y caduca a mitad del trámite' },
            { id: 'b', text: 'El atributo `Secure` impide que la cookie viaje por HTTPS' },
            { id: 'c', text: 'El perfil actual es una copia del de `www`, que no tiene persistencia porque la web informativa no la necesita; con él, el ADC ha dejado de insertar `SEDE_SRV`' },
            { id: 'd', text: 'Los ciudadanos llegan detrás de un NAT y el ADC no puede distinguirlos' },
          ],
          answer: 'c',
          points: 5,
          explain:
            'La copia del lunes tenía `perfil-sede`, con cookie insertada `SEDE_SRV`; la actual tiene `perfil-www-copia`, con persistencia «ninguna» y algoritmo de menos conexiones, lo que tiene sentido para `www` y no para una aplicación que guarda la sesión en memoria. Una cookie de sesión no caduca a mitad de un trámite: dura lo que la sesión del navegador (RFC 6265 §4.1.2). `Secure` hace lo contrario de lo que dice la opción b: la cookie **solo** viaja por un canal seguro (§4.1.2.5). El NAT afectaría a una persistencia por IP de origen, no a una por cookie, que reconoce al navegador.',
          refs: [L3, RFC6265, HAP],
        },
        {
          id: 'f2t3',
          kind: 'cite',
          topic: 'op4m3',
          prompt: 'Señala los documentos que, juntos, prueban que la persistencia se quitó en la configuración del ADC y que por eso los trámites se parten entre los dos servidores.',
          answerSets: [['d-perfil', 'd-trazas'], ['d-perfil', 'd-trazas', 'd-inventario']],
          points: 4,
          explain:
            'La configuración enseña la causa (persistencia «ninguna» desde que el perfil es una copia del de `www`) y la prueba del navegador enseña el efecto (sin `SEDE_SRV`, la segunda petición va a SEDE2 y la sesión no aparece). Uno sin el otro se queda corto: la configuración no dice qué ve el ciudadano, y la prueba no dice por qué. La ficha de diseño puede sumarse, porque dice que la sesión vive en la memoria de cada servidor, pero no sustituye a ninguno de los dos. Las quejas solo cuentan el síntoma.',
          refs: [L3, RFC6265],
        },
        {
          id: 'f2t4',
          kind: 'choice',
          topic: 'op4m3',
          prompt: 'Para salir del paso hoy, alguien propone persistencia por IP de origen en lugar de recuperar la cookie. ¿Qué respondes?',
          options: [
            { id: 'a', text: 'Que no: muchos ciudadanos llegan detrás de un NAT (el ayuntamiento de Q5 tramita a todos sus vecinos desde `198.51.100.120`) y caerían todos en el mismo servidor; lo correcto es volver al perfil anterior, que inserta la cookie' },
            { id: 'b', text: 'Que sí: con IP de origen no depende de ninguna cookie y funciona igual' },
            { id: 'c', text: 'Que no, porque la persistencia por IP de origen está prohibida por la RFC 6265' },
            { id: 'd', text: 'Que sí, pero solo con TLS en paso directo, para que el ADC vea la dirección del ciudadano' },
          ],
          answer: 'a',
          points: 4,
          explain:
            'La persistencia por IP de origen choca con la traducción de direcciones: todo un ayuntamiento, o muchos clientes del NAT de un operador, salen por una sola dirección y para el ADC son un único cliente, así que la carga se amontona en un servidor el día de más tráfico. La cookie insertada reconoce al navegador y no depende de la dirección; ya estaba diseñada y probada, y basta con recuperar el perfil anterior. La RFC 6265 no dice nada de la persistencia por IP. El ADC ya ve la dirección del ciudadano, también terminando TLS: el paso directo le quitaría la capa 7, y con ella las cookies.',
          refs: [L3, L2, HAP],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'El servidor que miente',
      context:
        'Tienes el registro de cambios, la configuración de las comprobaciones del grupo `sede`, el registro de ADC1 de esta mañana, unas pruebas manuales contra los dos servidores y las estadísticas del grupo de 10:00 a 10:15. Averigua por qué el ADC reparte a un servidor que da errores y cuánto daño hace.',
      carry:
        'SEDE2 devuelve 500 en la aplicación y en `/salud` desde las 07:58. El ADC lo sacó del grupo a las 07:58:16, pero a las 08:18 la guardia cambió la comprobación por una conexión TCP al 443, que solo mira si el puerto acepta conexiones, y SEDE2 volvió al reparto a las 08:18:44. Entre las 10:00 y las 10:15, el 60 % de las peticiones de la sede acabó en error.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'choice',
          topic: 'op4m4',
          prompt: '¿Por qué el ADC mantiene a SEDE2 en el grupo si devuelve 500 a todas las peticiones?',
          options: [
            { id: 'a', text: 'Porque SEDE2 responde 200 en `/salud` aunque la aplicación falle' },
            { id: 'b', text: 'Porque SEDE2 responde al *ping*, y eso basta para que el ADC lo dé por sano' },
            { id: 'c', text: 'Porque la comprobación actual solo abre una conexión TCP al 443: el proceso de SEDE2 acepta la conexión aunque la aplicación conteste 500 a todo' },
            { id: 'd', text: 'Porque hacen falta 3 fallos seguidos y SEDE2 a veces acierta' },
          ],
          answer: 'c',
          points: 5,
          explain:
            'Una comprobación de conexión TCP solo dice que hay un proceso escuchando en el puerto: es lo que la lección llama una comprobación que miente, TCP abierto con la aplicación rota. Las pruebas manuales lo enseñan: en SEDE2 la conexión al 443 se establece, pero `/salud` y la aplicación devuelven 500. Antes de las 08:18, la comprobación era `GET /salud` esperando 200, y por eso sacó a SEDE2 a las 07:58:16. `/salud` no da 200 en SEDE2: da 500 con «almacén temporal de sesiones lleno». El *ping* responde, pero la comprobación del ADC no es ICMP, y el motivo del cambio de la guardia («responde al *ping*») es justo el razonamiento equivocado. Con una comprobación TCP, SEDE2 no falla nunca, no «a veces».',
          refs: [L4, L5, HAP],
        },
        {
          id: 'f3t2',
          kind: 'numeric',
          topic: 'op4m4',
          prompt: 'Con las estadísticas de 10:00 a 10:15, ¿qué porcentaje de las peticiones del grupo `sede` acabó en un error 5xx?',
          answer: 60,
          tolerance: 0.5,
          unit: '%',
          points: 4,
          hint: { text: 'Respuestas 5xx de los dos miembros entre el total de peticiones del grupo.', cost: 1 },
          explain:
            'Peticiones del grupo: 1840 + 2760 = 4600. Respuestas 5xx: 0 + 2760 = 2760. 2760 / 4600 = 0,6, es decir, un 60 %. Tienta responder 50 % pensando que dos servidores se reparten a medias, pero el grupo no reparte por turno sino por menos conexiones, y las estadísticas dicen que SEDE2 recibió más de la mitad.',
          refs: [L4, L2],
        },
        {
          id: 'f3t3',
          kind: 'choice',
          topic: 'op4m2',
          prompt: '¿Por qué SEDE2 recibe más de la mitad de las peticiones en ese cuarto de hora?',
          options: [
            { id: 'a', text: 'Porque SEDE2 tiene más peso que SEDE1' },
            { id: 'b', text: 'Porque el grupo reparte por menos conexiones (lo trajo el perfil copiado de `www`), y SEDE2, que contesta el error en 4 ms, casi no tiene conexiones abiertas (2 de media frente a 31): casi siempre aparece como el menos cargado' },
            { id: 'c', text: 'Porque la persistencia ata a SEDE2 a quien ya recibió un error, y sus reintentos vuelven siempre a él' },
            { id: 'd', text: 'Por azar: con round robin el reparto oscila y en quince minutos puede salir un 60 %' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'Con menos conexiones, cada petición nueva va al miembro con menos conexiones activas. Las estadísticas dan la clave: SEDE1 tarda 180 ms y mantiene 31 conexiones de media; SEDE2 despacha el error en 4 ms y apenas tiene 2. Con esa regla, el servidor que falla deprisa parece el más desocupado y se lleva más tráfico. Es una deducción a partir de la definición del algoritmo y de estas cifras, no un comportamiento que documente un fabricante. Los dos miembros tienen peso 1. No hay persistencia desde el miércoles, así que nada ata a nadie a SEDE2. Y el grupo ya no reparte por turno: con el round robin de antes y pesos iguales habría ido a SEDE2 la mitad, un 50 %.',
          refs: [L2, L4, HAP],
        },
        {
          id: 'f3t4',
          kind: 'numeric',
          topic: 'op4m4',
          prompt: 'Se vuelve a poner la comprobación `GET /salud` que espera 200, con el intervalo y los umbrales que tiene configurados el grupo (copiados de los valores por defecto de HAProxy 3.4, valores del fabricante). En el peor caso, con la primera comprobación nueva un intervalo completo después del cambio, y contando solo intervalos (sin tiempos de espera), ¿cuántos segundos pasan desde el cambio hasta que SEDE2 sale del reparto?',
          answer: 6,
          unit: 's',
          points: 4,
          explain:
            'Para salir hacen falta 3 fallos seguidos, uno cada 2 s: 3 × 2 s = 6 s en el peor caso; el registro de las 07:58 enseña ese mismo ritmo, tres fallos con 2 s entre uno y otro (07:58:12, :14 y :16). Si la primera comprobación cayera justo al empezar, serían (3 − 1) × 2 s = 4 s. Son valores de fabricante, no de una norma: con otro fabricante, o con otros valores, la cuenta cambia. Y si SEDE2 tardara en contestar en vez de dar 500 al momento, cada comprobación tendría que agotar su tiempo de espera y la cuenta se alargaría.',
          refs: [L4, HAP],
        },
        {
          id: 'f3t5',
          kind: 'cite',
          topic: 'op4m4',
          prompt: 'Señala los documentos que, juntos, prueban que SEDE2 volvió al reparto por el cambio de la comprobación y no porque se hubiera recuperado.',
          answerSets: [
            ...withExtras(['d-registro-adc', 'd-salud'], ['d-cambios', 'd-comprobacion', 'd-estadisticas']),
            ...withExtras(['d-cambios', 'd-salud'], ['d-comprobacion', 'd-estadisticas']),
          ],
          points: 4,
          explain:
            'El registro de ADC1 dice que SEDE2 volvió a UP a las 08:18:44 por una conexión TCP establecida, justo después del cambio de comprobación; las pruebas manuales de las 09:50 dicen que SEDE2 sigue dando 500 en `/salud` y en la aplicación. Juntos prueban que volvió porque se dejó de preguntar lo importante, no porque se curara. El registro de cambios también vale en lugar del registro de ADC1, porque apunta el cambio y que tras él «SEDE2 vuelve a UP». Sin las pruebas manuales falta lo esencial: que SEDE2 seguía roto. La configuración de las comprobaciones y las estadísticas pueden sumarse, pero ninguna dice cuándo ni por qué volvió SEDE2 al reparto.',
          refs: [L4, HAP],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'La madrugada de los dos activos',
      context:
        'Falta lo de la madrugada. Tienes los registros de alta disponibilidad de ADC1 y ADC2, los cambios de la entrada ARP de la VIP en el encaminador central y el parte de la empresa de mantenimiento del CPD. Averigua qué pasó con la pareja y cuánto duró.',
      carry:
        'Entre las 02:13:21 y las 02:17:29 los dos ADC se creyeron activos: dejaron de oírse por el único enlace de latido, ADC2 dio a ADC1 por caído y tomó la VIP, y el encaminador fue cambiando de un ADC a otro, con conexiones cortadas a mitad. Al volver el latido, ADC2 pasó a pasivo. El latido pasa por el panel P3, donde trabajaba a esa hora la empresa de mantenimiento, aunque su parte dice «ninguna incidencia»: es la hipótesis más probable, no un hecho comprobado.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'multi',
          topic: 'op4m1',
          prompt: 'Marca **todo** lo que demuestran los registros de la pareja y del encaminador.',
          options: [
            { id: 'a', text: 'Entre las 02:13:21 y las 02:17:29 los dos ADC se consideraban activos a la vez' },
            { id: 'b', text: 'ADC1 no cayó en ningún momento: siguió activo y con la VIP mientras ADC2 la tomaba' },
            { id: 'c', text: 'El encaminador alternó la VIP entre la MAC de ADC1 y la de ADC2, así que las conexiones iban a uno u otro según el último anuncio' },
            { id: 'd', text: 'ADC1 se averió y ADC2 tomó el relevo como debía: fue una conmutación por error normal' },
            { id: 'e', text: 'Que se perdiera el latido demuestra que ADC1 estaba caído' },
            { id: 'f', text: 'Terminó cuando volvió el latido y ADC2, con menos prioridad, pasó a pasivo' },
          ],
          answer: ['a', 'b', 'c', 'f'],
          points: 6,
          explain:
            'ADC1 escribe «sigue ACTIVO con la VIP» a la misma hora en que ADC2 escribe «ADC1 se da por caído; ADC2 pasa a ACTIVO»: los dos activos, el cerebro dividido (*split-brain*). La tabla ARP del encaminador confirma el efecto: la MAC de la VIP cambia ocho veces entre `…:71` (ADC1, según la ficha) y `…:72` (ADC2), y cada conexión acaba en el ADC que anunció último, de ahí las conexiones cortadas y la queja Q3. La tentación es leerlo como una conmutación normal, pero ADC1 nunca dejó de funcionar: ninguno se reinició. Y perder el latido no prueba que el otro haya muerto: es exactamente lo que un nodo no puede distinguir de un cable cortado. Acabó a las 02:17:29, cuando el latido volvió y la pareja se resolvió por prioridad.',
          refs: [L1, MS_CLUSTER, LARP],
        },
        {
          id: 'f4t2',
          kind: 'numeric',
          topic: 'op4m1',
          prompt: '¿Cuántos segundos estuvieron los dos ADC activos a la vez?',
          answer: 248,
          unit: 's',
          points: 4,
          hint: { text: 'Desde que ADC2 pasa a ACTIVO hasta que vuelve a PASIVO.', cost: 1 },
          explain:
            'ADC2 pasa a ACTIVO a las 02:13:21 y vuelve a PASIVO a las 02:17:29: 4 min 8 s, es decir, 248 s. Tienta contar desde las 02:13:18, cuando se pierde la primera respuesta del latido (251 s), pero hasta las 02:13:21 ADC2 todavía no se había declarado activo: esos 3 s son el margen del protocolo del fabricante. El aviso Q4, redondeado a minutos (de 02:13 a 02:17), no basta para dar segundos.',
          refs: [L1, MS_CLUSTER],
        },
        {
          id: 'f4t3',
          kind: 'choice',
          topic: 'op4m1',
          prompt: '¿Cuál es la explicación más consistente con todas las pruebas?',
          options: [
            { id: 'a', text: 'Alguien envenenó la caché ARP del encaminador desde fuera para desviar el tráfico de la sede' },
            { id: 'b', text: 'ADC2 tiene más prioridad y se impuso a ADC1, como ordena su configuración' },
            { id: 'c', text: 'Se cortó el único camino de latido con los dos ADC vivos. El latido pasa por el panel P3, puerto 22, y a esa hora la empresa de mantenimiento cambiaba los latiguillos de los puertos 17 a 24. Sin desempate, ADC2 tomó un cable cortado por un compañero muerto. Es la hipótesis más probable, pero el parte dice «ninguna incidencia», así que no está confirmada' },
            { id: 'd', text: 'ADC1 se reinició por un corte de alimentación y ADC2 hizo lo que debía' },
          ],
          answer: 'c',
          points: 5,
          explain:
            'Todo cuadra con un latido cortado y dos equipos sanos. Los dos dejan de oírse a la vez (02:13:18), ninguno se reinicia y el latido vuelve solo a las 02:17:29. La ficha dice que el latido es un único cable por el panel P3, puerto 22, y el parte sitúa allí a la empresa entre las 02:05 y las 02:25. Pero el parte no recoge ninguna incidencia, así que la causa queda como hipótesis y hay que preguntarlo. El envenenamiento ARP tienta, porque hay anuncios que nadie pidió, pero todos llevan las MAC de los dos ADC y coinciden con sus registros. ADC2 es el de **menos** prioridad, y ninguno de los dos perdió la alimentación.',
          refs: [L1, MS_CLUSTER, MS_QUORUM, LARP],
        },
        {
          id: 'f4t4',
          kind: 'cite',
          topic: 'op4m1',
          prompt: 'Señala los documentos que, juntos, sostienen la hipótesis de que la pareja se partió por el trabajo en el bastidor B.',
          answerSets: [['d-ha', 'd-mantenimiento', 'd-inventario'], ['d-ha', 'd-mantenimiento', 'd-inventario', 'd-arp']],
          points: 4,
          explain:
            'Los registros de alta disponibilidad dan la hora en que los dos dejaron de oírse (02:13:18) y volvieron (02:17:29). El parte de mantenimiento pone a la empresa en el panel P3, puertos 17 a 24, entre las 02:05 y las 02:25. Y solo la ficha une las dos cosas: el latido pasa por el panel P3, puerto 22. Sin la ficha no hay relación entre un latiguillo y el latido. Los cambios ARP muestran el efecto y pueden sumarse, pero no dicen nada de la causa. El registro de cambios del Servicio no sirve, porque los trabajos de la empresa no se apuntan en él.',
          refs: [L1, MS_CLUSTER],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Corregir en orden y que no se repita',
      context:
        'Son las 10:40 y el plazo cierra a las 23:59. Hay que arreglarlo sin empeorar nada: cada corrección se comprueba antes de pasar a la siguiente, y el orden importa, porque una corrección hecha a destiempo puede atar a los ciudadanos al servidor roto o devolver al reparto un servidor sin persistencia.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'order',
          topic: 'op4m4',
          prompt: 'Ordena los pasos.',
          items: [
            { id: 'o3', text: 'Volver a aplicar al servicio virtual `sede` su perfil de la copia del lunes: cookie insertada `SEDE_SRV` y round robin' },
            { id: 'o6', text: 'Comprobar el grupo con SEDE2 dentro: los dos miembros reciben peticiones, no hay respuestas 5xx y un trámite completo no cambia de servidor' },
            { id: 'o1', text: 'Volver a poner en el grupo `sede` la comprobación `GET /salud` que espera 200' },
            { id: 'o7', text: 'Pasado el plazo, en una ventana de cambios: segundo camino de latido y un desempate entre los dos ADC' },
            { id: 'o2', text: 'Comprobar en ADC1 que SEDE2 está DOWN y que ya no sale ningún 500 a los ciudadanos' },
            { id: 'o5', text: 'Reparar la aplicación de SEDE2 (el almacén temporal de sesiones); en cuanto `/salud` responda 200, el ADC lo devolverá solo al reparto tras dos aciertos' },
            { id: 'o4', text: 'Comprobar con un navegador de prueba que llega `Set-Cookie: SEDE_SRV` y que un trámite de varios pasos termina en el mismo servidor' },
          ],
          answer: ['o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7'],
          points: 8,
          hint: { text: 'Pregúntate qué pasa con cada paso si el anterior no está hecho: ¿y si la cookie vuelve con SEDE2 todavía en el grupo? ¿Y si SEDE2 se cura antes de que vuelva la cookie?', cost: 2 },
          explain:
            'Primero, la comprobación: es lo que más daño corta (el 60 % de errores) y saca a SEDE2 en segundos; con un solo miembro, además, ningún trámite puede cambiar de servidor. La cookie va después, nunca antes: con SEDE2 aún dentro, la persistencia ataría al servidor roto a la mitad de los ciudadanos, que recibirían 500 en cada paso. Y la cookie tiene que estar antes de reparar SEDE2, porque con la comprobación buena el ADC lo devolverá al reparto en cuanto `/salud` dé 200: si vuelve sin persistencia, vuelven los formularios perdidos. Cada corrección, con su comprobación detrás. El latido no se toca hoy: mover la pareja el último día del plazo arriesga otra conmutación, el cable está conectado desde las 02:17:29 y el cambio se planifica para después.',
          refs: [L4, L3, L1, HAP],
        },
        {
          id: 'f5t2',
          kind: 'numeric',
          topic: 'op4m4',
          prompt: 'Reparado SEDE2, su `/salud` empieza a responder 200. Con los valores configurados en el grupo (copiados de HAProxy 3.4, valores del fabricante) y contando solo intervalos, ¿cuántos segundos tarda como máximo en volver al reparto?',
          answer: 4,
          unit: 's',
          points: 3,
          explain:
            'Para volver hacen falta 2 aciertos seguidos, uno cada 2 s: 2 × 2 s = 4 s como máximo, como se ve en el registro de las 08:18 (aciertos a las 08:18:42 y :44). Responder 6 es usar los 3 fallos de la bajada. Una vez dentro, HAProxy permite además subirle el peso poco a poco con `slowstart` (valor del fabricante), para que no reciba de golpe toda su parte.',
          refs: [L4, HAP],
        },
        {
          id: 'f5t3',
          kind: 'multi',
          topic: 'op4m4',
          prompt: 'Marca **todas** las medidas que tienen sentido para que no se repita.',
          options: [
            { id: 'a', text: 'Que `/salud` compruebe lo que SEDE necesita para atender de verdad (la aplicación, su almacén de sesiones, su base de datos) y responda otro código si falla; y que ninguna alarma se «arregle» cambiando la comprobación por una conexión TCP' },
            { id: 'b', text: 'Un segundo camino de latido por otro recorrido físico (práctica de diseño, sin fuente normativa) y un tercer voto que desempate cuando los dos ADC dejan de verse, la idea del testigo que documenta Microsoft para sus clústeres; cómo se monta depende del fabricante del ADC' },
            { id: 'c', text: 'Probar cada cambio del servicio virtual con un trámite de varios pasos (y la cookie `SEDE_SRV` en las respuestas) antes de darlo por bueno, no comprobar solo la portada, y no hacer cambios en la sede en los días de cierre de plazos' },
            { id: 'd', text: 'Pasar la sede a persistencia por IP de origen para no depender de la cookie' },
            { id: 'e', text: 'Desactivar las comprobaciones de salud de la sede en los días de cierre de plazos, para que no haya falsas alarmas' },
            { id: 'f', text: 'Poner los dos ADC en activo-activo: si los dos están siempre activos, no puede haber cerebro dividido' },
            { id: 'g', text: 'Que los trabajos de la empresa de mantenimiento en el CPD pasen por el registro de cambios, con la lista de lo que depende de cada puerto que se toca' },
          ],
          answer: ['a', 'b', 'c', 'g'],
          points: 5,
          explain:
            'Cada medida buena ataca la causa de una avería: un punto de salud que pregunta lo que importa (y nadie que lo sustituya por TCP para callar una alarma); un latido que no dependa de un solo cable, más un desempate, como el testigo de Microsoft, que da a uno de los dos la mayoría; cambios probados con un trámite completo y fuera de los días críticos; y los trabajos del CPD dentro del registro de cambios. La IP de origen ya se descartó por el NAT. Quitar las comprobaciones deja al ADC repartiendo a ciegas a servidores rotos. Y activo-activo no evita nada: el problema de la madrugada fue precisamente tener dos activos sin quererlo, y además la sede guarda la sesión en memoria.',
          refs: [L4, L1, L3, MS_QUORUM, HAP],
        },
        {
          id: 'f5t4',
          kind: 'written',
          topic: 'op4m1',
          prompt: 'Son las 12:30 y todo funciona. Redacta en **150 a 230 palabras** el parte para la jefatura del Servicio de Informática y Comunicaciones y la Secretaría General, responsable del servicio. Después, compáralo con el modelo y marca los criterios que cumple.',
          words: 230,
          model:
            'Hubo tres averías independientes en la sede electrónica. Primera: desde el miércoles a las 18:40, el servicio virtual de la sede usaba una copia del perfil de www, sin persistencia; el ADC dejó de insertar su cookie y los trámites saltaban entre SEDE1 y SEDE2, que no comparten sesiones. Segunda: SEDE2 daba 500 desde las 07:58; el ADC lo sacó, pero a las 08:18 se cambió la comprobación por una conexión TCP y volvió al reparto: entre las 10:00 y las 10:15 falló el 60 % de las peticiones. Tercera: de madrugada, durante 248 s, los dos ADC se creyeron activos al perder el latido, probablemente por un trabajo en el panel donde va su cable, sin confirmar.\n\n' +
            'Orden: primero se repuso la comprobación de /salud, que sacó a SEDE2; después se recuperó la cookie, antes de que SEDE2 volviera, para no atar a nadie al servidor roto ni devolverlo sin persistencia; por último se reparó SEDE2, que entró solo. Se comprobó cada paso: SEDE2 fuera, la cookie en un trámite completo y el grupo sin errores.\n\n' +
            'Propuestas: un punto de salud que compruebe lo necesario, cambios probados con trámites completos, un segundo camino de latido y un desempate (práctica de diseño) tras el plazo, y los trabajos del CPD en el registro de cambios. Los valores de las comprobaciones (2 s, 3 y 2) son de un fabricante.',
          rubric: [
            { id: 'r1', text: 'Separa las tres causas, cada una con su efecto: persistencia perdida por el perfil copiado (formularios perdidos), comprobación TCP con SEDE2 roto (errores 500) y latido perdido con los dos ADC activos (conexiones cortadas de madrugada)', points: 3 },
            { id: 'r2', text: 'Da el orden de las correcciones y por qué: la comprobación antes que la cookie, y la cookie antes de que SEDE2 vuelva', points: 2 },
            { id: 'r3', text: 'Da el alcance con cifras del expediente (60 % de errores entre las 10:00 y las 10:15, 248 s de cerebro dividido) y cómo se comprobó cada corrección', points: 2 },
            { id: 'r4', text: 'Propone medidas concretas: punto de salud con sentido, cambios probados, segundo camino de latido y desempate, y trabajos del CPD en el registro de cambios', points: 2 },
            { id: 'r5', text: 'Rotula lo que no es norma: los valores de las comprobaciones son de un fabricante, el segundo latido es práctica de diseño y la causa del corte del latido no está confirmada', points: 1 },
          ],
          points: 10,
          explain:
            'Un parte tiene que dejar claro que fueron tres causas y no una, porque cada una tiene su arreglo y su medida. Tienta contarlo como «se cayó SEDE2», que es lo único que se ve en el panel, pero los formularios se perdían desde el día anterior y la madrugada no tuvo nada que ver con los servidores. El orden es lo que más se discute después, así que hay que justificarlo. Y hay que rotular lo que no es norma: los valores de las comprobaciones son de un fabricante, y la causa del corte del latido es una hipótesis.',
          refs: [L1, L3, L4],
        },
      ],
    },
  ],
  sources: [L1, L2, L3, L4, L5, LARP, RFC6265, HAP, MS_CLUSTER, MS_QUORUM],
};

export default op4s2;
