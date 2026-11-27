import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP3M4 — NTP y la hora: estratos, NTPv4, jerarquía, NTS y PTP
// ---------------------------------------------------------------------------
export const OP3_M4: Module = {
  id: 'op3m4',
  sectionId: 'op3',
  title: 'NTP y la hora',
  minutes: 20,
  objectives: [
    'Explicar por qué la hora es un servicio de seguridad: Kerberos, correlación de registros, firmas y validez de certificados',
    'Distinguir los estratos de NTP (0, 1, 2–15 y 16) y el indicador LI, y saber qué significa cada valor',
    'Calcular el desfase y el retardo de NTPv4 a partir de las cuatro marcas de tiempo y decidir si el reloj se ajusta de forma gradual o de golpe',
    'Diseñar la jerarquía de hora de una organización como el Consorcio, con dos servidores internos y Active Directory',
    'Situar NTS (RFC 8915) y PTP (IEEE 1588) frente a NTP: qué protege el primero y para qué sirve el segundo',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La hora parece un detalle hasta que falla. Un puesto con el reloj nueve minutos atrasado no puede iniciar sesión en el dominio aunque la contraseña sea correcta; un registro de cortafuegos con la hora mal puesta no casa con el del servidor y la investigación de un incidente se convierte en adivinanza; una firma o un certificado aparecen como «todavía no válidos» o «caducados» sin estarlo. Por eso la sincronización de la hora es un **servicio de red** más, con su protocolo, el **NTP** (*Network Time Protocol*, protocolo de hora de red), su jerarquía y su seguridad. Esta lección recorre por qué importa, cómo se organiza en **estratos**, cómo calcula **NTPv4** el desfase y el retardo (RFC 5905), cómo se monta en el Consorcio Provincial de Arcedo y qué aportan **NTS** y **PTP**.',
    },
    { t: 'h', text: 'Por qué importa la hora' },
    {
      t: 'table',
      headers: ['Qué depende de la hora', 'Qué pasa si el reloj se desvía', 'Fuente'],
      rows: [
        ['**Kerberos** (autenticación de Active Directory)', 'Si la hora del equipo y la del servidor difieren más que la tolerancia, el servidor responde con el error **KRB_AP_ERR_SKEW** (código **37**, «Clock skew too great») y la autenticación falla', 'RFC 4120 §1.6, §3.2.3 y §7.5.9'],
        ['**Correlación de registros**', 'Los eventos de varios equipos no se pueden ordenar en una línea de tiempo común; la medida de registro de la actividad del ENS (Esquema Nacional de Seguridad) pide que cada registro lleve **fecha y hora**', 'ENS, anexo II (lección op6m3)'],
        ['**TSIG** (transferencias de zona y DDNS firmadas)', 'Error **BADTIME** (18) si la hora está fuera del margen; el margen (*Fudge*) recomendado es **300 s**', 'RFC 8945 §5.2.3 y §10'],
        ['**DNSSEC**', 'Las firmas tienen fecha de inicio y de caducidad: un reloj mal puesto hace fallar la validación', 'RFC 4034 §3.1.5'],
        ['**Certificados**', 'Un certificado solo es válido dentro de su periodo de validez; con el reloj desviado puede parecer caducado o aún no válido', 'Lección de PKI de Security+ (sp1m7)'],
        ['**Conmutación por error de DHCP** en Windows Server', 'Si los relojes de los dos servidores difieren **más de un minuto**, el asistente de configuración se detiene (valor del fabricante, Microsoft)', 'Microsoft Learn, «DHCP failover»'],
      ],
    },
    {
      t: 'p',
      md: 'Kerberos merece un párrafo propio porque se pregunta mucho y casi siempre con una trampa. La RFC 4120 exige que cada equipo tenga un reloj «flojamente sincronizado» (*loosely synchronized*), deja la tolerancia **configurable** en cada servidor y dice que suele ser **del orden de 5 minutos**; los 5 minutos aparecen ahí como ejemplo, no como obligación. Los **5 minutos por defecto** de Active Directory son un **valor de Microsoft**: la directiva «Maximum tolerance for computer clock synchronization» de la *Default Domain Policy* (en Configuración del equipo, Directivas de cuenta, Directiva Kerberos) admite de **1 a 99 999 minutos** y viene a 5. La misma RFC añade algo que se olvida: el protocolo con el que se sincronizan los relojes **«MUST itself be secured»**, tiene que estar protegido frente a atacantes de la red, porque quien mueve la hora de un controlador de dominio rompe la autenticación de todos.',
    },
    {
      t: 'check',
      q: {
        q: 'Durante un incidente, el analista compara los registros del cortafuegos, del proxy y de un servidor del CPD y ve que la misma conexión aparece con minutos de diferencia en cada uno. ¿Qué es lo primero que pone en duda?',
        choices: [
          'Que el cortafuegos esté filtrando el tráfico correcto',
          'Que el proxy esté registrando todas las conexiones',
          'Que los tres equipos tengan el reloj sincronizado con la misma fuente de hora',
          'Que el servidor tenga activado el registro de auditoría',
        ],
        answer: 2,
        explain:
          'Si el mismo hecho sale con horas distintas, el problema está en los relojes, no en lo que registran: sin una fuente de hora común no se puede construir la línea de tiempo del incidente. Las otras tres opciones explicarían que faltaran entradas, pero aquí las entradas existen y solo no coinciden en la hora.',
      },
    },
    { t: 'h', text: 'Estratos y el indicador LI' },
    {
      t: 'p',
      md: 'NTP organiza las fuentes de hora en **estratos**, que miden la distancia en saltos hasta una referencia. El **estrato 1** es el **servidor primario**, el que está conectado directamente a una referencia, por ejemplo un receptor GPS (*Global Positioning System*, sistema de posicionamiento global); ojo, el estrato 1 es el servidor, no el GPS. Los relojes de referencia aparecen por costumbre en el estrato 0. Un servidor que se sincroniza por NTP con uno de estrato 1 pasa a ser de **estrato 2**, el que se sincroniza con ese, de estrato 3, y así hasta el **15**: son los **servidores secundarios**. El **16** no es «el peor servidor», sino **no sincronizado** (es MAXSTRAT, el estrato máximo). En el paquete viajan además otros campos útiles: el **LI** (*Leap Indicator*, indicador de segundo intercalar), la versión (**VN**, hoy 4), el **modo** (3 cliente, 4 servidor) y el **identificador de referencia**, que en un estrato 1 es una cadena ASCII como «GPS». Un servidor puede responder también con un paquete **Kiss-o\'-Death** con códigos como **DENY**, **RSTR** (el cliente debe dejar de usar ese servidor) o **RATE**.',
    },
    {
      t: 'table',
      headers: ['Campo', 'Valor', 'Significado (RFC 5905 §7.3)'],
      rows: [
        ['Estrato', '**0**', '«unspecified or invalid»: sin especificar o no válido; por costumbre se trata internamente como 16'],
        ['Estrato', '**1**', 'Servidor primario (p. ej. con receptor GPS)'],
        ['Estrato', '**2–15**', 'Servidor secundario, sincronizado por NTP'],
        ['Estrato', '**16**', '«unsynchronized»: **no sincronizado**'],
        ['Estrato', '17–255', 'Reservado'],
        ['LI', '0', 'Sin aviso'],
        ['LI', '1', 'El último minuto del día tendrá 61 segundos'],
        ['LI', '2', 'El último minuto del día tendrá 59 segundos'],
        ['LI', '**3**', '«unknown (clock unsynchronized)»: **reloj no sincronizado**'],
        ['Modo', '3 / 4', 'Cliente / servidor (los demás: 0 reservado, 1 y 2 simétrico activo y pasivo, 5 difusión, 6 control, 7 uso privado)'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Un servidor NTP interno se sincroniza con un servidor público que anuncia estrato 2. ¿Qué estrato anuncia el servidor interno a sus clientes, y qué estrato tendrían esos clientes si a su vez sirvieran la hora?',
        choices: [
          'Estrato 3 el servidor interno y estrato 4 sus clientes',
          'Estrato 2 el servidor interno, porque copia el de su fuente, y estrato 3 sus clientes',
          'Estrato 1 el servidor interno, porque es la referencia de la organización',
          'Estrato 16 el servidor interno, porque no tiene receptor GPS',
        ],
        answer: 0,
        explain:
          'Cada salto por NTP suma uno: quien se sincroniza con un estrato 2 pasa a ser estrato 3, y quien se sincroniza con él, estrato 4. El estrato 1 exige estar conectado directamente a una referencia, y el 16 significa no sincronizado, no «sin GPS»: un servidor secundario bien sincronizado está entre 2 y 15.',
      },
    },
    { t: 'h', text: 'NTPv4: cuatro marcas de tiempo, desfase y retardo' },
    {
      t: 'p',
      md: '**NTPv4** está definido en la RFC 5905, que obsoleta la RFC 1305 (NTPv3) y la 4330 (SNTP). El paquete NTP es **un datagrama UDP** y usa el **puerto 123** (la IANA reserva el 123 en UDP y TCP, pero el protocolo viaja por UDP). Cada intercambio cliente-servidor deja cuatro marcas: **T1**, cuando el cliente envía la petición; **T2**, cuando el servidor la recibe; **T3**, cuando el servidor envía la respuesta; y **T4**, cuando el cliente la recibe. T1 y T4 están medidas con el reloj del cliente, y T2 y T3 con el del servidor. Con ellas se calculan dos valores. El **desfase** (*offset*), θ = ½ [(T2 − T1) + (T3 − T4)], es cuánto va adelantado el servidor respecto del cliente, y por tanto cuánto hay que corregir. El **retardo** (*delay*), δ = (T4 − T1) − (T3 − T2), es el tiempo de ida y vuelta por la red sin contar lo que tardó el servidor en contestar. Con el desfase calculado, el cliente decide cómo corregir: por debajo de **125 ms** (STEPT) **ajusta el reloj de forma gradual**; entre 125 ms y **1000 s** (PANICT) da **un salto** si el desfase persiste; y por encima de 1000 s el programa debería salir con un diagnóstico en lugar de mover tanto la hora por su cuenta.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Un intercambio NTP: desfase y retardo con números',
      text: `Marcas (en milisegundos, sobre el mismo segundo)
  T1 = 0     el cliente envía la petición          (reloj del cliente)
  T2 = 130   el servidor recibe la petición         (reloj del servidor)
  T3 = 131   el servidor envía la respuesta         (reloj del servidor)
  T4 = 21    el cliente recibe la respuesta         (reloj del cliente)

Desfase  θ = ½ [(T2 - T1) + (T3 - T4)] = ½ [(130 - 0) + (131 - 21)] = ½ [130 + 110] = 120 ms
Retardo  δ = (T4 - T1) - (T3 - T2)     = (21 - 0) - (131 - 130)    = 21 - 1         = 20 ms

Lectura: el servidor va 120 ms por delante del cliente y la ida y vuelta por la red costó 20 ms.
Como 120 ms < 125 ms (STEPT), el cliente corrige de forma gradual, sin dar un salto.`,
    },
    {
      t: 'p',
      md: 'El cliente no pregunta una sola vez: **sondea** a sus servidores periódicamente. El intervalo de sondeo se expresa en potencias de 2 segundos, y la RFC sugiere como límites por defecto **6 y 10**, es decir, de 64 a 1024 segundos (cuidado: la tabla de parámetros de la misma RFC pone otro mínimo, así que el «mínimo por defecto» depende de dónde se mire). La escala de tiempo de NTP empieza el **1 de enero de 1900 a las 00:00 UTC** (tiempo universal coordinado), y el campo de segundos tiene 32 bits, de modo que **da la vuelta en 2036**; ese día, el 8 de febrero de 2036, empieza la era 1. Por último, **SNTP** (*Simple NTP*) es un subconjunto de NTP que no implementa los algoritmos de mitigación.',
    },
    {
      t: 'check',
      q: {
        q: 'Un cliente NTP calcula un desfase de 300 ms respecto de su servidor. Según la RFC 5905, ¿cómo corrige su reloj?',
        choices: [
          'Ajusta el reloj de forma gradual, porque el desfase es pequeño',
          'Da un salto de hora si el desfase persiste, porque supera los 125 ms pero no los 1000 s',
          'Deja de usar ese servidor, porque el desfase indica un Kiss-o\'-Death',
          'Sale con un diagnóstico, porque el desfase supera el umbral de pánico',
        ],
        answer: 1,
        explain:
          'El ajuste gradual solo se usa por debajo de STEPT, 125 ms; entre 125 ms y PANICT, 1000 s, el reloj se corrige con un salto si el desfase persiste. Salir con un diagnóstico es lo que corresponde por encima de 1000 s, y el Kiss-o\'-Death es un paquete de control del servidor (DENY, RSTR, RATE), no un desfase grande.',
      },
    },
    { t: 'h', text: 'La jerarquía de hora en una organización' },
    {
      t: 'p',
      md: 'Una organización no debería tener cada equipo preguntando la hora a Internet. Lo habitual es montar **pocos servidores internos** que se sincronizan con fuentes externas de referencia y hacer que **todo lo demás se sincronice con ellos**, directamente o a través de la jerarquía del dominio: así hay una sola hora para todos, se controla qué tráfico NTP sale al exterior y basta con proteger bien unos pocos equipos. Active Directory tiene además su propia jerarquía, que son **valores del fabricante (Microsoft)**: los clientes del dominio toman la hora de los controladores de dominio; en un bosque, los controladores de un dominio hijo la toman de los del padre; y el controlador con el rol de **emulador de PDC** (*Primary Domain Controller*, controlador principal de dominio) **del dominio raíz del bosque** es la referencia del bosque y debe sincronizarse con una fuente externa fiable (un servidor NTP o un dispositivo GPS que actúe como servidor NTP). Dentro del bosque, Windows firma los paquetes de hora con la clave de sesión de Kerberos o Net Logon. Los equipos que no están en el dominio usan por defecto `time.windows.com`, algo que conviene cambiar.',
    },
    {
      t: 'table',
      headers: ['Equipo del Consorcio', 'Se sincroniza con', 'Por qué'],
      rows: [
        ['Servidores NTP internos `10.20.72.41` y `10.20.72.42` (CPD)', 'Servidores públicos de referencia', 'Son la entrada de la hora en la red; los dos dan redundancia si uno falla'],
        ['Controlador de dominio con el rol de emulador de PDC: DC1 (`10.20.72.11`)', '`10.20.72.41` y `10.20.72.42`', 'Es la fuente externa fiable que Microsoft pide para el emulador de PDC'],
        ['DC2 (`10.20.72.12`) y los puestos y servidores miembros del dominio `ad.arcedo.example`, entre ellos DHCP1 (`10.20.72.21`) y DHCP2 (`10.20.72.22`)', 'La jerarquía del dominio, que acaba en los servidores internos', 'Jerarquía de Windows (valor del fabricante): Kerberos funciona con la misma hora que el KDC (Key Distribution Center, centro de distribución de claves), que es el propio controlador; DHCP1 y DHCP2 comparten así la hora que necesita su conmutación por error'],
        ['Equipos fuera del dominio: conmutadores, cortafuegos, encaminadores de las oficinas y servidores que no son del dominio', '`10.20.72.41` y `10.20.72.42`', 'No siguen la jerarquía de Windows, y sus registros tienen que casar con los del resto'],
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: el reparto de la hora',
      md: 'Los dos servidores NTP del CPD, `10.20.72.41` y `10.20.72.42`, son los únicos que hablan con los servidores públicos de referencia, así que el cortafuegos puede limitar a ellos la salida de NTP. Los equipos que no son del dominio se sincronizan directamente con ellos: los conmutadores de distribución de la sede y los encaminadores de las oficinas comarcales, por ejemplo. Los equipos miembros del dominio `ad.arcedo.example`, incluidos DC2 y los servidores DHCP1 (`10.20.72.21`) y DHCP2 (`10.20.72.22`), que funcionan en conmutación por error, siguen la jerarquía de Windows, cuya cabeza, el controlador con el rol de emulador de PDC, está apuntado a los dos servidores internos. Si esos dos servidores dicen la hora correcta, la dice toda la red; si alguien la falsea en el camino desde Internet, la falsea para todos, y por eso ese tramo es el primer candidato a protegerse con NTS. Otra vía para que los equipos conozcan los servidores de hora es DHCP: la opción que anuncia servidores **NTP** es la **42**, y sirve para los equipos que no son del dominio y toman su configuración por DHCP, como las impresoras; la opción 4, «Time Server», es del protocolo de la RFC 868, no de NTP.',
    },
    {
      t: 'check',
      q: {
        q: 'En el Consorcio se instala un conmutador nuevo en la VLAN 99 de gestión. No es miembro del dominio. ¿Con qué servidores de hora se configura?',
        choices: [
          'Con los servidores públicos de referencia, para tener la hora más precisa posible',
          'Con su propio reloj interno, anunciándose como estrato 1',
          'Con time.windows.com, que es la fuente por defecto de los equipos fuera del dominio',
          'Con 10.20.72.41 y 10.20.72.42, los servidores NTP internos del CPD',
        ],
        answer: 3,
        explain:
          'En el Consorcio solo los dos servidores internos hablan con las fuentes externas y los equipos que no son del dominio, como este conmutador, se sincronizan directamente con ellos, de modo que todos comparten la misma hora y el NTP hacia Internet queda limitado a dos equipos. Un equipo sin referencia directa no puede ser estrato 1, y time.windows.com es el valor por defecto de Windows fuera del dominio, no una decisión de diseño, además de que un conmutador no es un equipo Windows.',
      },
    },
    { t: 'h', text: 'NTS y PTP' },
    {
      t: 'p',
      md: 'Kerberos exige que la sincronización de la hora esté protegida. Para proteger NTP existe **NTS** (*Network Time Security*, RFC 8915), que añade seguridad criptográfica, con TLS (*Transport Layer Security*, seguridad de la capa de transporte) y cifrado autenticado (AEAD), **solo al modo cliente-servidor** de NTP. Tiene dos piezas. La primera es **NTS-KE** (*NTS Key Establishment*, establecimiento de claves), que se hace por **TLS** sobre **TCP 4460**, con el identificador ALPN (*Application-Layer Protocol Negotiation*, negociación del protocolo de aplicación) «ntske/1», y que no puede negociar versiones de TLS **anteriores a la 1.3**. La segunda son unos **campos de extensión NTS** dentro de los paquetes NTPv4, que siguen viajando por **UDP 123** salvo que en NTS-KE se negocie otro puerto. El servidor no guarda estado por cliente: se lo devuelve en unas «cookies» opacas que el cliente presenta en cada consulta. La idea que más se confunde: **NTS no es NTP metido en TLS**; por TLS solo va el establecimiento de claves.',
    },
    {
      t: 'p',
      md: '**PTP** (*Precision Time Protocol*, protocolo de hora de precisión) es otra cosa: el estándar **IEEE 1588** (versión vigente, IEEE 1588-2019) para sincronizar con mucha más precisión que NTP los relojes de sistemas de medida y control conectados por red. Se adapta a cada uso mediante **perfiles** y la IANA le asigna los puertos **319** (`ptp-event`) y **320** (`ptp-general`). Para una red de oficinas y servidores como la del Consorcio, NTP basta; PTP aparece cuando hace falta una precisión que NTP no da.',
    },
    {
      t: 'table',
      headers: ['', 'NTP (NTPv4)', 'NTS', 'PTP'],
      rows: [
        ['Norma', 'RFC 5905', 'RFC 8915', 'IEEE 1588-2019'],
        ['Qué es', 'Protocolo de sincronización de relojes por red', 'Seguridad para el modo cliente-servidor de NTP', 'Protocolo de sincronización de precisión para sistemas de medida y control'],
        ['Transporte y puertos', 'UDP 123', 'NTS-KE por TLS 1.3 o posterior en TCP 4460; la hora sigue por UDP 123', 'Puertos IANA 319 y 320'],
        ['Cuándo se usa', 'Hora general de una organización', 'Cuando hay que autenticar el servidor de hora', 'Cuando NTP no llega a la precisión necesaria'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Un técnico dice: «Activar NTS es poner NTP dentro de TLS, así que hay que abrir el TCP 4460 y cerrar el UDP 123». ¿Qué falla en su razonamiento?',
        choices: [
          'Nada: con NTS toda la sincronización pasa a TCP 4460',
          'Por TLS en TCP 4460 solo va el establecimiento de claves (NTS-KE); la hora sigue por UDP 123, con campos de extensión autenticados',
          'NTS usa DTLS sobre UDP 4460 y el TCP 4460 no interviene',
          'NTS solo funciona en modo difusión, así que el UDP 123 no hace falta',
        ],
        answer: 1,
        explain:
          'La RFC 8915 separa dos piezas: NTS-KE, por TLS 1.3 o posterior en TCP 4460, y los paquetes NTPv4 con campos de extensión NTS, que siguen por UDP 123 salvo que se negocie otro puerto. Cerrar el UDP 123 dejaría sin hora a los clientes. Y NTS cubre solo el modo cliente-servidor, no la difusión.',
      },
    },
    {
      t: 'links',
      title: 'Lo que ya está explicado en otras lecciones',
      items: [
        { label: 'Kerberos, tickets y por qué dependen del reloj (lección sp4m8 de Security+)', href: '/learn/sp4m8' },
        { label: 'PKI y certificados: periodo de validez y revocación (lección sp1m7 de Security+)', href: '/learn/sp1m7' },
        { label: 'Las medidas del anexo II del ENS, entre ellas el registro de la actividad (lección op6m3)', href: '/learn/op6m3' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Puerto:** NTP va por **UDP 123**; NTS-KE por **TCP 4460** con **TLS 1.3 o posterior**; PTP usa **319 y 320**. **Estratos:** 0 sin especificar o no válido (y relojes de referencia), **1 servidor primario** (el servidor conectado al GPS, no el GPS), **2–15 secundarios**, **16 no sincronizado** (no «el peor»). **LI = 3** también indica reloj no sincronizado, pero es otro campo. **Fórmulas:** desfase θ = ½ [(T2 − T1) + (T3 − T4)]; retardo δ = (T4 − T1) − (T3 − T2). **Corrección:** menos de 125 ms, ajuste gradual; de 125 ms a 1000 s, salto; más de 1000 s, diagnóstico y salida. **Kerberos:** la RFC 4120 deja la tolerancia configurable, «del orden de 5 minutos»; los **5 minutos por defecto son de Microsoft** (Default Domain Policy); el error es **KRB_AP_ERR_SKEW** (37). **Active Directory:** la cabeza es el **emulador de PDC del dominio raíz del bosque** (valor del fabricante). **DHCP:** la opción de servidores NTP es la **42**, no la 4. **NTS** no es NTP sobre TLS: por TLS solo va el establecimiento de claves y solo protege el modo cliente-servidor. **Época:** 1-1-1900; el contador de segundos da la vuelta en **2036**.',
    },
  ],
  quiz: [
    {
      id: 'op3m4q1',
      domain: 'Servicios de red',
      prompt: 'Según la RFC 5905, ¿qué transporte y qué puerto usa NTPv4 para intercambiar la hora entre cliente y servidor?',
      choices: [
        'TCP 123, porque la hora necesita entrega fiable',
        'UDP 123',
        'TCP 4460',
        'UDP 319',
      ],
      answer: 1,
      explain:
        'La RFC 5905 dice que el paquete NTP es un datagrama UDP y fija el puerto 123. TCP 123 tienta porque la IANA reserva el 123 en ambos transportes, pero el protocolo viaja por UDP. TCP 4460 es el de NTS-KE, el establecimiento de claves de NTS, y el 319 es uno de los puertos de PTP.',
    },
    {
      id: 'op3m4q2',
      domain: 'Servicios de red',
      prompt: 'Un cliente NTP recibe de un servidor una respuesta con el campo de estrato a 16. ¿Qué significa?',
      choices: [
        'Que el servidor es un secundario a 16 saltos, el más lejano que admite NTP',
        'Que el servidor es primario y está conectado a un receptor GPS',
        'Que el servidor es un reloj de referencia',
        'Que el servidor no está sincronizado',
      ],
      answer: 3,
      explain:
        'En la RFC 5905 el estrato 16 significa «unsynchronized»: el servidor no está sincronizado y no sirve como fuente. La primera opción es la trampa habitual: los secundarios van del 2 al 15, y el 16 no es «el peor» sino ninguno. El servidor primario conectado a una referencia como el GPS es el estrato 1, y los relojes de referencia aparecen en el estrato 0.',
    },
    {
      id: 'op3m4q3',
      domain: 'Servicios de red',
      prompt:
        'En un intercambio NTP las marcas son, en milisegundos: T1 = 0 y T4 = 12 (reloj del cliente), T2 = 505 y T3 = 507 (reloj del servidor). ¿Cuánto valen el desfase y el retardo, y cómo corrige el cliente?',
      choices: [
        'Desfase de 500 ms y retardo de 10 ms; corrige con un salto, porque supera los 125 ms',
        'Desfase de 500 ms y retardo de 10 ms; corrige de forma gradual, porque no llega a 1000 ms',
        'Desfase de 250 ms y retardo de 12 ms; corrige con un salto',
        'Desfase de 495 ms y retardo de 2 ms; corrige de forma gradual',
      ],
      answer: 0,
      explain:
        'Desfase θ = ½ [(505 − 0) + (507 − 12)] = ½ [505 + 495] = 500 ms; retardo δ = (12 − 0) − (507 − 505) = 10 ms. Como 500 ms supera STEPT, 125 ms, y no llega a PANICT, 1000 s, el reloj se corrige con un salto. La segunda opción tienta porque confunde PANICT, que son 1000 segundos, con 1000 milisegundos, y además el ajuste gradual solo vale por debajo de 125 ms.',
    },
    {
      id: 'op3m4q4',
      domain: 'Servicios de red',
      prompt: '¿Qué afirmación sobre la tolerancia de hora de Kerberos es correcta?',
      choices: [
        'La RFC 4120 fija una tolerancia obligatoria de 5 minutos para todas las implementaciones',
        'En Active Directory la tolerancia no puede superar los 5 minutos',
        'La RFC 4120 deja la tolerancia configurable, del orden de 5 minutos; los 5 minutos por defecto de Active Directory los fija Microsoft en la Default Domain Policy',
        'Kerberos solo comprueba la diferencia de hora cuando el controlador de dominio usa NTS',
      ],
      answer: 2,
      explain:
        'La RFC 4120 pide relojes flojamente sincronizados, deja la tolerancia a cada servidor y dice que suele ser del orden de 5 minutos; el valor por defecto de 5 minutos es de Microsoft. La primera opción es la confusión más habitual: convertir en norma lo que la RFC pone como ejemplo. La directiva de Windows admite de 1 a 99 999 minutos, y la comprobación de hora es de Kerberos, no depende de NTS.',
    },
    {
      id: 'op3m4q5',
      domain: 'Servicios de red',
      prompt: '¿Qué protege NTS (RFC 8915) y cómo?',
      choices: [
        'Todos los modos de NTP, metiendo los paquetes NTP dentro de una sesión TLS en el puerto 123',
        'El modo cliente-servidor de NTP: las claves se establecen por TLS 1.3 o posterior en TCP 4460 (NTS-KE) y la hora sigue por UDP 123 con campos de extensión autenticados',
        'Solo el modo de difusión, firmando los paquetes con la clave de Kerberos',
        'El modo cliente-servidor, cifrando la hora con TLS 1.2 en TCP 123',
      ],
      answer: 1,
      explain:
        'NTS cubre solo el modo cliente-servidor y tiene dos piezas: NTS-KE, por TLS en TCP 4460 y sin versiones anteriores a la 1.3, y los campos de extensión NTS dentro de los paquetes NTPv4, que siguen por UDP 123. La primera opción es la idea equivocada de que NTS es NTP sobre TLS. Firmar con la clave de Kerberos es lo que hace Windows dentro de un bosque, no NTS, y TLS 1.2 queda prohibido por la RFC.',
    },
    {
      id: 'op3m4q6',
      domain: 'Servicios de red',
      prompt:
        'El Consorcio quiere que toda su red tenga la misma hora y que solo dos equipos salgan a Internet por NTP. Con los servidores internos 10.20.72.41 y 10.20.72.42 y el dominio ad.arcedo.example, ¿qué diseño cumple ambas cosas y respeta la jerarquía de Windows?',
      choices: [
        'Todos los equipos, incluidos los controladores de dominio, se sincronizan directamente con servidores públicos de referencia',
        'Los servidores internos se sincronizan con los controladores de dominio, y los controladores con los puestos',
        'Cada equipo del dominio se configura a mano contra time.windows.com y los conmutadores contra los servidores internos',
        'Los servidores internos se sincronizan con fuentes públicas; el emulador de PDC con ellos; el dominio sigue su jerarquía y el resto de equipos apunta a los dos servidores internos',
      ],
      answer: 3,
      explain:
        'Los dos servidores internos son la única entrada de la hora; el emulador de PDC, que según Microsoft debe tener una fuente externa fiable, la toma de ellos; los miembros del dominio la reciben por la jerarquía de Windows y el resto de equipos va contra los servidores internos. Sincronizar todo con Internet rompe el requisito de que solo salgan dos equipos, la segunda opción invierte la jerarquía y time.windows.com es el valor por defecto de los equipos fuera del dominio, no una fuente común.',
    },
    {
      id: 'op3m4q7',
      domain: 'Servicios de red',
      prompt:
        'Un puesto de la VLAN 10 del Consorcio no puede iniciar sesión en el dominio aunque la contraseña es correcta. El registro muestra KRB_AP_ERR_SKEW y el reloj del puesto va 9 minutos atrasado respecto del controlador de dominio, que conserva la configuración por defecto. ¿Cuál es el diagnóstico?',
      choices: [
        'La diferencia de hora supera la tolerancia de Kerberos (5 minutos por defecto en Active Directory, valor de Microsoft); hay que corregir la sincronización del puesto',
        'La contraseña ha caducado y Kerberos lo indica con ese error',
        'El controlador de dominio no escucha en el puerto 88',
        'La RFC 4120 impone 5 minutos y el error solo se resuelve reinstalando el puesto',
      ],
      answer: 0,
      explain:
        'KRB_AP_ERR_SKEW, código 37, significa «Clock skew too great»: la hora del puesto y la del servidor difieren más que la tolerancia, que en Active Directory es de 5 minutos por defecto. La solución es que el puesto vuelva a tomar la hora de la jerarquía del dominio. No es un problema de contraseña ni de puerto, porque la respuesta del servidor llega y dice justo eso, y la RFC no impone los 5 minutos: la tolerancia es configurable.',
    },
    {
      id: 'op3m4q8',
      domain: 'Servicios de red',
      prompt: 'El Consorcio quiere que DHCP anuncie sus servidores NTP 10.20.72.41 y 10.20.72.42 a las impresoras y demás equipos que no son del dominio y toman su configuración por DHCP. ¿Qué opción de DHCPv4 tiene que usar?',
      choices: [
        'La opción 4, «Time Server»',
        'La opción 6, servidores DNS',
        'La opción 42, servidores NTP',
        'La opción 3, encaminador',
      ],
      answer: 2,
      explain:
        'La opción que lleva servidores NTP es la 42. La opción 4 tienta por su nombre, «Time Server», pero corresponde al protocolo de hora de la RFC 868, no a NTP. La 6 anuncia servidores DNS y la 3 la puerta de enlace.',
    },
  ],
};
