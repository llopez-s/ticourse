import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP2M3 — Acceso remoto: VPN de cliente (IPsec/IKEv2 y TLS/DTLS), túnel completo
// o dividido, autenticación y MFA (ENS op.acc.6), postura del equipo, confianza
// cero (NIST SP 800-207) y ZTNA, escritorio remoto, pasarela y bastión, registro
// Fuente única: docs/superpowers/sources/2026-11-27-op2-fuentes.md (§5, §9, §10,
// §11.2, §15, §17, §18) y, para el ENS, 2026-11-26-op6-fuentes.md (op.acc.6, op.exp.8).
// ---------------------------------------------------------------------------
export const OP2_M3: Module = {
  id: 'op2m3',
  sectionId: 'op2',
  title: 'Acceso remoto: VPN de cliente, confianza cero y escritorio remoto',
  minutes: 26,
  objectives: [
    'Describir el modelo de acceso remoto de NIST SP 800-77r1 y los cuatro tipos de acceso remoto de SP 800-46r2, y comparar una VPN de cliente con IPsec e IKEv2 (con EAP), una basada en TLS o DTLS 1.3 (RFC 9147) y WireGuard, que no es un estándar de la IETF',
    'Decidir entre túnel completo y túnel dividido sabiendo qué dice cada fuente: SP 800-77r1 lo desaconseja con fuerza, SP 800-46r2 pide plantearse desactivarlo en redes no fiables y SP 800-207 empuja en sentido contrario',
    'Relacionar la autenticación del acceso remoto con la medida op.acc.6 del ENS (refuerzos R8 y R9 desde el nivel BAJO, R5 Registro desde MEDIO) y explicar por qué un segundo factor habría cambiado el incidente del registro de entrada del Consorcio',
    'Explicar los principios de confianza cero de NIST SP 800-207, sus componentes (motor de políticas, administrador de políticas y PEP) y sus modelos de despliegue, y distinguir ZTNA, que la SP 800-207 no usa, según la definición de Mplify y la de Gartner',
    'Situar el escritorio remoto directo e indirecto, la pasarela de Escritorio remoto de Microsoft (valores del fabricante) y el bastión como idea de diseño, y qué registros hacen falta para reconstruir una sesión remota',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Un jueves, un correo de suplantación consigue, según el análisis preliminar, la contraseña de la cuenta `adm-reg`. El lunes siguiente, a las **01:58**, alguien abre con ella una sesión en la **VPN de administración** del Consorcio Provincial de Arcedo desde `198.51.100.77`, y a partir de las 02:12 salen 14,2 GB del servidor REG-DOC hacia esa misma dirección. Es el incidente de ransomware del registro de entrada (supuesto `op6s2`). El supuesto no dice qué pedía esa VPN además de la contraseña; si solo pedía eso, hizo exactamente lo que estaba pensado: dejar entrar a quien presentó una credencial válida. Esta lección trata de cómo se diseña el acceso desde fuera para que una contraseña robada no baste: qué tipos de VPN de cliente hay, qué tráfico mandar por el túnel, cómo autenticar, qué aporta la **confianza cero** (*zero trust*) y qué hacer con el escritorio remoto.',
    },
    {
      t: 'links',
      title: 'Antes de seguir',
      items: [
        { label: 'IPsec, ESP e IKEv2 entre sedes (lección op2m2)', href: '/learn/op2m2' },
        { label: 'Security+: comunicación segura con VPN, TLS e IPsec (sp3m5)', href: '/learn/sp3m5' },
        { label: 'Security+: identidades, federación, control de acceso y MFA (sp4m8)', href: '/learn/sp4m8' },
        { label: 'Security+: Zero Trust, plano de control y plano de datos (sp1m3)', href: '/learn/sp1m3' },
        { label: 'Servicios de conectividad: 802.1X y el servidor RADIUS (lección op3m5)', href: '/learn/op3m5' },
        { label: 'Las medidas del anexo II del ENS, op.acc.6 incluida (lección op6m3)', href: '/learn/op6m3' },
      ],
    },
    { t: 'h', text: 'Qué es acceso remoto para NIST' },
    {
      t: 'p',
      md: 'La guía de VPN IPsec de NIST, la **SP 800-77 Rev. 1** (junio de 2020), describe el modelo de **acceso remoto** (§2.4.2) así: cada usuario establece la VPN entre **su equipo** y una **pasarela** de la organización, y es la pasarela quien autentica al usuario, ella misma o apoyándose en un servidor de autenticación. Señala también sus límites: el tramo entre la pasarela y los servidores interiores **no** va protegido por esa VPN, hay que gestionar credenciales de todos los equipos y usuarios, y no es transparente para quien la usa. La guía de teletrabajo, la **SP 800-46 Rev. 2** (julio de 2016), mira el problema desde más arriba y distingue cuatro **tipos de acceso remoto** (§2.2).',
    },
    {
      t: 'table',
      headers: ['Tipo (SP 800-46r2 §2.2)', 'En esta lección'],
      rows: [
        ['**Tunneling**', 'VPN de cliente (IPsec, TLS o DTLS, WireGuard) y túnel completo o dividido'],
        ['**Application portals**', 'Solo el nombre: no se desarrolla aquí'],
        ['**Remote desktop access**', 'Escritorio remoto directo e indirecto, pasarela y bastión'],
        ['**Direct application access**', 'Solo el nombre: no se desarrolla aquí'],
      ],
    },
    { t: 'h', text: 'VPN de cliente con IPsec e IKEv2' },
    {
      t: 'p',
      md: 'La pieza de IPsec ya la conoces de la lección `op2m2`: IKEv2 (*Internet Key Exchange* versión 2, RFC 7296) negocia las asociaciones de seguridad y ESP cifra los paquetes. En el acceso remoto cambia sobre todo **quién se autentica y cómo**. Entre dos sedes se autentican dos equipos; aquí, una persona. Para eso IKEv2 admite **EAP** (*Extensible Authentication Protocol*) dentro del propio intercambio (RFC 7296 §2.16): el iniciador omite el campo AUTH en su primer mensaje IKE_AUTH y se van añadiendo intercambios IKE_AUTH hasta completar EAP. En el ejemplo mínimo de la RFC son **8 mensajes** (un IKE_SA_INIT y tres IKE_AUTH, frente a los 4 del intercambio inicial sin EAP). Y una regla que conviene recordar: EAP **debe** (MUST) ir acompañado de autenticación por firma de clave pública **del respondedor**, es decir, la pasarela demuestra quién es con su certificado antes de que el usuario le entregue nada.',
    },
    {
      t: 'p',
      md: 'Lo demás es lo que ya pasa entre sedes, pero más a menudo. Un portátil en casa o en una cafetería casi siempre está detrás de un NAT, así que IKE y ESP acaban en **UDP 4500** (RFC 7296 §2.23). Si la red bloquea todo UDP, la RFC 9329 define la **encapsulación TCP**, que las implementaciones deben soportar en **TCP 4500**; NIST la presenta como **último recurso** (SP 800-77r1 §2.4.2). Y como el portátil cambia de red (de la wifi a los datos móviles), existe **MOBIKE** (movilidad y multihoming de IKEv2, RFC 4555), que mantiene la asociación de seguridad de IKE cuando cambia la dirección del equipo: la SP 800-77r1 recomienda activarlo en los servidores de acceso remoto (§7.2.4.2), aunque reconoce que lo más seguro es desactivarlo si no hace falta, por el riesgo de redirección.',
    },
    {
      t: 'p',
      md: 'En el Consorcio ya hay un servidor RADIUS, `10.20.72.60`, que autentica los puestos de la VLAN 10 por 802.1X (lección `op3m5`). Que una pasarela VPN se apoye en un servidor de autenticación es justo lo que describe NIST; qué servidor usaría la VPN del personal, y con qué método EAP, es una decisión que se toma en el supuesto `op2s1`, no un dato del Consorcio.',
    },
    { t: 'h', text: 'VPN sobre TLS o DTLS, y WireGuard' },
    {
      t: 'p',
      md: 'La otra gran familia de VPN de cliente no usa IPsec, sino **TLS**. TLS necesita un transporte fiable (TCP); para llevar el túnel sobre UDP existe **DTLS** (*Datagram Transport Layer Security*), la versión de TLS para datagramas. La vigente es **DTLS 1.3**, RFC 9147 (abril de 2022, actualizada por la **RFC 9853** de marzo de 2026, que añade una comprobación de retorno para el Connection ID). Da las mismas garantías que TLS 1.3 salvo la protección de orden y la antirrepetición, y conserva la semántica de datagrama sobre **UDP**. Un detalle que sorprende: **no existe DTLS 1.1**; se saltó ese número para igualar la numeración con TLS. Ni la RFC 9147 ni ninguna otra fuente de este bloque asigna un puerto a una VPN TLS o DTLS: el puerto es cosa de cada fabricante.',
    },
    {
      t: 'p',
      md: '**WireGuard** es una tercera vía, con una advertencia: **no es una RFC** ni un estándar de la IETF; se describe con su documentación oficial (`wireguard.com` y su documento técnico). Encapsula paquetes IP sobre **UDP** y asocia a cada par una clave pública y una lista **AllowedIPs**: al enviar, esa lista funciona como tabla de rutas, y al recibir, como lista de control de acceso (*Cryptokey Routing*). Fija sus algoritmos (ChaCha20Poly1305, Curve25519, BLAKE2s) y carece a propósito de agilidad criptográfica: no se negocia nada. Su saludo se resuelve en un solo viaje de **ida y vuelta** con **4 tipos de mensaje**, y renueva claves cada pocos minutos: en el documento técnico (§6.1), **Rekey-After-Time** es **120 s** y **Reject-After-Time** **180 s**. El puerto `51820` y la MTU `1420` que verás en muchos tutoriales salen de **ejemplos** de la documentación, no de un valor por defecto normativo.',
    },
    {
      t: 'table',
      headers: ['', 'IPsec con IKEv2', 'TLS o DTLS', 'WireGuard'],
      rows: [
        ['**Norma**', 'RFC 7296 (IKEv2), 4303 (ESP)', 'TLS 1.3 (RFC 9846); DTLS 1.3 (RFC 9147, actualizada por la 9853)', 'Ninguna: documentación oficial del proyecto'],
        ['**Transporte**', 'UDP 500 y 4500; TCP 4500 como último recurso (RFC 9329)', 'TCP (TLS) o UDP (DTLS)', 'UDP'],
        ['**Puerto**', 'Fijado por la RFC 7296 §2.23', 'Valor del fabricante (sin fuente en este bloque)', 'Solo ejemplos en la documentación (51820)'],
        ['**Autenticación del usuario**', 'EAP dentro de IKE_AUTH, con firma de la pasarela', 'Depende del producto', 'Por clave pública del par; reparto de claves fuera de su alcance'],
        ['**Algoritmos**', 'Negociados', 'Negociados', 'Fijos, sin agilidad'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Una VPN de cliente con IKEv2 autentica a cada persona con EAP. Según la RFC 7296, ¿qué tiene que hacer además la pasarela?',
        choices: [
          'Nada más: EAP sustituye a cualquier otra autenticación en los dos sentidos',
          'Autenticarse ella misma con una firma de clave pública, porque EAP debe ir acompañado de esa autenticación del respondedor',
          'Repetir el intercambio IKE_SA_INIT por cada mensaje EAP',
          'Pasar a TCP 4500, porque EAP no funciona sobre UDP',
        ],
        answer: 1,
        explain:
          'La RFC 7296 §2.16 exige que EAP vaya acompañado de autenticación por firma de clave pública del respondedor: la pasarela prueba quién es antes de recibir las credenciales. Los intercambios que se añaden son IKE_AUTH, no IKE_SA_INIT. TCP 4500 es para redes que bloquean UDP y no tiene que ver con EAP.',
      },
    },
    { t: 'h', text: 'Túnel completo o túnel dividido' },
    {
      t: 'p',
      md: 'Con el túnel levantado, queda decidir **qué tráfico va por él**. En el **túnel completo** (*full tunnel*) todo sale por la VPN y cruza el cortafuegos de la organización; en el **túnel dividido** (*split tunneling*) solo el tráfico hacia la organización va por la VPN y el resto sale directamente a Internet desde casa. La SP 800-77r1 §2.4.2 explica para qué sirve el primero: se usa cuando no se confía en que el equipo hable directamente con Internet. Y aquí está el matiz importante: las tres guías de NIST de esta lección **no dicen lo mismo**.',
    },
    {
      t: 'table',
      headers: ['Fuente', 'Qué dice del túnel dividido', 'Por qué'],
      rows: [
        ['**SP 800-77r1** §7.2.1.2', 'Está «strongly discouraged»: desaconsejado con fuerza', 'Si el equipo está comprometido, el atacante entra por él a la red. Reconoce ventajas: menos tráfico ajeno y menos ancho de banda en la sede. Aun prohibiéndolo, otras interfaces (wifi, datos móviles) pueden saltárselo: conviene que solo esté activa la del túnel, o un cortafuegos personal'],
        ['**SP 800-46r2** §3.3.3', 'En redes no fiables, como una wifi pública, las organizaciones «should consider disabling»: deberían plantearse desactivarlo', 'Mejora la eficiencia, pero impide examinar y proteger buena parte del tráfico y puede convertir el equipo en un **puente** entre una red de confianza y otra que no lo es'],
        ['**SP 800-207** §3.4.1', 'No habla de túnel dividido, pero empuja en sentido contrario', 'Supone que un equipo remoto debe poder llegar a los recursos **sin pasar antes por la red corporativa**; su ejemplo es no tener que volver por la VPN a la sede para leer el correo en la nube'],
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Grados distintos, no una respuesta única',
      md: '«Desaconsejado con fuerza» (SP 800-77r1) no es lo mismo que «plantearse desactivarlo en redes no fiables» (SP 800-46r2), y la SP 800-207 parte de otra idea de red. Si te preguntan por el túnel dividido, **atribuye** la postura a su guía y razona con el contexto: qué controla la organización del equipo, por qué redes se conecta y dónde están los servicios. En el Consorcio, por ejemplo, toda la navegación sale hoy por el proxy `10.20.72.50` (lección `op3m5`); un túnel dividido sacaría la navegación del teletrabajo fuera de ese control. Es un argumento para el supuesto `op2s1`, no una decisión ya tomada.',
    },
    {
      t: 'check',
      q: {
        q: '¿Cuál de estas frases atribuye bien la postura de NIST sobre el túnel dividido?',
        choices: [
          'La SP 800-207 lo prohíbe, porque todo acceso debe pasar por la red corporativa',
          'La SP 800-46r2 lo declara obligatorio en el teletrabajo para ahorrar ancho de banda',
          'La SP 800-77r1 lo desaconseja con fuerza, y la SP 800-46r2 pide plantearse desactivarlo en redes no fiables',
          'Las tres guías coinciden en recomendarlo, salvo en wifis públicas',
        ],
        answer: 2,
        explain:
          'La SP 800-77r1 §7.2.1.2 dice «strongly discouraged» y la SP 800-46r2 §3.3.3 «should consider disabling» en redes no fiables. La SP 800-207 va en sentido contrario a la primera opción: quiere que el equipo remoto llegue a los recursos sin pasar por la red corporativa. Ninguna lo hace obligatorio ni coinciden las tres.',
      },
    },
    { t: 'h', text: 'Autenticación, MFA y el ENS' },
    {
      t: 'p',
      md: 'La SP 800-46r2 §3.3.1 es directa: si el acceso remoto solo pide contraseña, que al menos sea distinta de las demás; si hace falta más seguridad, **MFA** (*multi-factor authentication*, autenticación multifactor). Cita una exigencia federal de Estados Unidos de doble factor, con uno de ellos en un dispositivo separado, y de reautenticar tras **30 minutos** de inactividad, y pone como ejemplo de práctica reautenticar cada **8 horas**. Volvamos al lunes del registro: con un segundo factor en la VPN de administración, la contraseña robada el jueves no habría bastado por sí sola para abrir la sesión de las 01:58.',
    },
    {
      t: 'p',
      md: 'El ENS lo recoge en la medida **op.acc.6** «Mecanismo de autenticación (usuarios de la organización)». Se exige **por dimensiones** (confidencialidad, integridad, trazabilidad y autenticidad: C I T A), así que su columna se lee con el nivel de esas dimensiones, no con la categoría del sistema. Lo que conviene retener es que **R8** y **R9** aparecen **ya en el nivel BAJO**.',
    },
    {
      t: 'table',
      headers: ['Nivel (C I T A)', 'Celda de op.acc.6 en el anexo II'],
      rows: [
        ['**BAJO**', '+ [R1 o R2 o R3 o R4] + R8 + R9'],
        ['**MEDIO**', '+ [R1 o R2 o R3 o R4] + R5 + R8 + R9'],
        ['**ALTO**', '+ [R1 o R2 o R3 o R4] + R5 + R6 + R7 + R8 + R9'],
      ],
    },
    {
      t: 'p',
      md: 'Los refuerzos, con su nombre literal: R1 Contraseñas · R2 Contraseña + otro factor de autenticación · R3 Certificados · R4 Certificados en dispositivo físico · R5 Registro · R6 Limitación de la ventana de acceso · R7 Suspensión por no utilización · **R8 Doble factor para acceso desde o a través de zonas no controladas** · **R9 Acceso remoto (todos los niveles)**. El corchete obliga a elegir un mecanismo; R8 y R9 se **suman** siempre. Las fuentes de este bloque solo dan el nombre de R8; leído al pie de la letra, una conexión desde casa o desde una wifi pública llega a través de una zona que la organización no controla. El detalle de qué pide R9 por dentro no está resumido en las fuentes de este bloque: aquí basta con su nombre y con que se aplica en todos los niveles.',
    },
    {
      t: 'check',
      q: {
        q: 'Un sistema con sus dimensiones C, I, T y A en nivel BAJO dará acceso desde casa a parte del personal. ¿Qué exige op.acc.6?',
        choices: [
          'Solo contraseñas (R1), porque el nivel es BAJO',
          'R5 Registro y nada más, porque el acceso es remoto',
          'Nada: op.acc.6 se aplica solo a sistemas de categoría ALTA',
          'Un mecanismo a elegir entre R1 y R4, más R8 (doble factor desde zonas no controladas) y R9 (acceso remoto)',
        ],
        answer: 3,
        explain:
          'La celda de nivel BAJO es «+ [R1 o R2 o R3 o R4] + R8 + R9». R1 es una de las opciones del corchete, pero R8 y R9 se suman siempre. R5 Registro aparece desde MEDIO, y op.acc.6 se exige por dimensiones desde BAJO, no por categoría ALTA.',
      },
    },
    { t: 'h', text: 'Postura del equipo: no solo quién, también desde qué' },
    {
      t: 'p',
      md: 'Una credencial correcta no dice nada del equipo desde el que se usa. Por eso se habla de **postura** (*posture*): el estado de seguridad del dispositivo en el momento del acceso. La SP 800-207 la convierte en principio: el acceso se decide con una **política dinámica** que incluye, entre otras cosas, el estado del equipo, y la organización vigila la **integridad y la postura** de todos sus activos, sin dar a ninguno por fiable de por sí (§2.1, principios 4 y 5). La SP 800-77r1 añade una medida concreta para la VPN: que en el equipo solo esté activa la interfaz del túnel, o un cortafuegos personal, para que la wifi o los datos móviles no abran otra puerta (§7.2.1.2). Qué se comprueba exactamente, y con qué herramienta, depende del producto.',
    },
    { t: 'h', text: 'Confianza cero según NIST SP 800-207' },
    {
      t: 'p',
      md: 'La **SP 800-207** «Zero Trust Architecture» (agosto de 2020) parte de una idea: la **zona de confianza implícita**, el área donde todo se considera fiable, debe ser lo más pequeña posible (§2). Estar dentro de la red no da confianza. Una lectura de esta lección, no una frase de la guía: una VPN que autentica en la puerta y luego deja al equipo dentro de la red se parece más a la zona de confianza amplia que a la mínima. La guía tampoco presenta la confianza cero como inmune: al hablar de amenazas (§5.2) explica que un atacante puede cortar el acceso a un PEP o al administrador de políticas, y añade que «This is also possible in legacy remote-access VPNs».',
    },
    {
      t: 'table',
      headers: ['Principio (SP 800-207 §2.1)', 'En una frase'],
      rows: [
        ['1', 'Todo dato y todo servicio es un **recurso**'],
        ['2', 'Toda comunicación se protege **sea cual sea la ubicación**: estar en la red corporativa no da confianza'],
        ['3', 'El acceso se concede **por sesión** y con el mínimo privilegio'],
        ['4', 'El acceso se decide con una **política dinámica**: identidad, aplicación, estado del equipo, comportamiento, entorno'],
        ['5', 'Se vigila la **integridad y la postura** de todos los activos; ninguno es fiable de por sí'],
        ['6', 'Autenticación y autorización **dinámicas y estrictas** antes de cada acceso, con MFA y reevaluación continua'],
        ['7', 'Se recoge toda la información posible para mejorar la seguridad'],
      ],
    },
    {
      t: 'p',
      md: 'Los componentes (§3) separan **decidir** de **aplicar**. El **PDP** (*Policy Decision Point*) se compone del **motor de políticas** (*Policy Engine*), que concede, deniega o revoca el acceso y **registra** la decisión, y del **administrador de políticas** (*Policy Administrator*), que la ejecuta: abre o cierra el camino y genera credenciales de sesión. El administrador de políticas da órdenes al **PEP** (*Policy Enforcement Point*), que habilita, vigila y termina las conexiones, y que puede partirse en un agente en el equipo y una pasarela delante del recurso. El plano de **control** va separado del plano de **datos**. La guía describe cuatro modelos de despliegue (§3.2).',
    },
    {
      t: 'table',
      headers: ['Modelo (SP 800-207 §3.2)', 'Cómo es', 'Cuándo encaja y qué pega tiene'],
      rows: [
        ['**Agente y pasarela**', 'Agente en el equipo y pasarela delante de cada recurso', 'Con buena gestión de los equipos y sin equipos personales (*bring your own device*)'],
        ['**Enclave**', 'Una pasarela protege un conjunto de recursos, por ejemplo un CPD o aplicaciones heredadas', 'Pega: no protege cada recurso por separado'],
        ['**Portal de recursos**', 'El PEP es un portal y el equipo no lleva agente', 'Más flexible para equipos personales y terceros, pero se ve poco del equipo y el portal queda expuesto a denegación de servicio'],
        ['**Aislamiento de aplicaciones** (*sandboxing*)', 'Las aplicaciones se ejecutan aisladas en el equipo', '—'],
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'ZTNA: un término con dos definiciones',
      md: 'La SP 800-207 **no usa** el término **ZTNA** (*Zero Trust Network Access*): no aparece ni una vez en su texto. Es un término de analistas y fabricantes. La especificación **Mplify 117.1** (junio de 2025; Mplify es el nombre actual del antiguo MEF) recoge dos lecturas en un apéndice informativo. Para **Mplify**, ZTNA es no permitir ningún acceso salvo por política explícita, con mínimo privilegio y vigilancia continua, **en cualquier lugar**, también dentro de la red. Mplify cita además la definición de **Gartner**: productos que crean un perímetro lógico, basado en identidad y contexto, alrededor de un usuario y una o varias aplicaciones internas. Y advierte de que, con esa definición, ZTNA se ha convertido en sinónimo de **sustituto de la VPN de acceso remoto**. Cuando alguien diga «ZTNA», conviene preguntar en qué sentido.',
    },
    {
      t: 'check',
      q: {
        q: 'En una arquitectura de confianza cero según la SP 800-207, ¿qué componente decide conceder, denegar o revocar un acceso y deja constancia de esa decisión?',
        choices: [
          'El motor de políticas (Policy Engine), que forma parte del PDP junto con el administrador de políticas',
          'El PEP, que es quien abre y cierra las conexiones',
          'El agente instalado en el equipo del usuario',
          'La pasarela VPN, que sigue siendo el punto de decisión',
        ],
        answer: 0,
        explain:
          'La SP 800-207 §3 asigna la decisión al motor de políticas (Policy Engine), que la registra; el administrador de políticas la ejecuta dando órdenes al PEP. El PEP aplica la decisión (habilita, vigila y termina conexiones) pero no la toma, y el agente del equipo puede ser una parte del PEP. La VPN no es un componente de la SP 800-207.',
      },
    },
    { t: 'h', text: 'Escritorio remoto, pasarela y bastión' },
    {
      t: 'p',
      md: 'El tercer tipo de acceso de la SP 800-46r2 es el **escritorio remoto**: controlar desde fuera un equipo interno. La guía distingue dos formas (§2.2.3). En la **directa**, el cliente se conecta al equipo interno, algo que muchos cortafuegos y NAT impiden. En la **indirecta**, pasa por un servidor intermedio, cuya seguridad es crítica, porque autentica y ve el tráfico entre las dos conexiones. Y añade un aviso: como el cifrado de extremo a extremo cruza el perímetro, los cortafuegos y los sistemas de detección no ven el contenido.',
    },
    {
      t: 'table',
      headers: ['Dato', 'Valor', 'Fuente'],
      rows: [
        ['Puerto por defecto de RDP (*Remote Desktop Protocol*) en el equipo', '**3389**', 'Microsoft Learn: valor del fabricante'],
        ['Puertos que debe aceptar la **pasarela de Escritorio remoto** (*RD Gateway*)', '**TCP 443** (HTTPS) y **UDP 3391**', 'Microsoft Learn: valor del fabricante'],
        ['Cifrado del canal en la pasarela', 'Cifrado TLS, con un certificado de confianza para los clientes (Microsoft recomienda uno público)', 'Microsoft Learn: valor del fabricante'],
      ],
    },
    {
      t: 'p',
      md: 'La pasarela de Escritorio remoto de Microsoft es un ejemplo del modelo indirecto: da acceso desde redes públicas a escritorios y aplicaciones internos y, según su documentación, lo hace «without the need for a VPN». Ojo con una confusión frecuente: la pasarela escucha en **443 y 3391**; el **3389** es el puerto de RDP en el equipo interno, no el que se publica.',
    },
    {
      t: 'p',
      md: 'El **bastión** o **equipo de salto** (*jump host*) es la misma idea aplicada a la administración: en lugar de abrir el escritorio remoto u otros accesos de administración desde fuera hacia cada servidor, el administrador entra en un único equipo muy vigilado y desde él salta a los demás. Ninguna de las fuentes primarias de este bloque lo define, así que aquí se trata solo como concepto de diseño, sin cifras ni requisitos normativos. Encaja con lo que ya sabes del modelo indirecto: un único punto que autentica, que ve todo lo que pasa y cuya seguridad se vuelve crítica. En el Consorcio no hay un bastión fijado; la red de gestión que consta es la VLAN 99 de la sede.',
    },
    {
      t: 'check',
      q: {
        q: 'Un técnico quiere publicar el escritorio remoto de unos servidores internos con la pasarela de Escritorio remoto de Microsoft. ¿Qué puertos debe abrir hacia la pasarela, según la documentación del fabricante?',
        choices: [
          'TCP 3389, el de RDP, porque la pasarela solo reenvía ese puerto',
          'UDP 500 y 4500, como cualquier VPN',
          'TCP 443 y UDP 3391',
          'TCP 4500, porque la pasarela encapsula RDP en TCP',
        ],
        answer: 2,
        explain:
          'Según Microsoft Learn (valor del fabricante), la pasarela debe aceptar TCP 443 (HTTPS) y UDP 3391. El 3389 es el puerto por defecto de RDP en el equipo interno, no el de la pasarela. UDP 500 y 4500 son de IKE y NAT-T, y TCP 4500 es la encapsulación TCP de la RFC 9329.',
      },
    },
    { t: 'h', text: 'Registrar el acceso remoto' },
    {
      t: 'p',
      md: 'Todo lo que se pudo reconstruir del lunes del registro empieza por una línea de registro: la sesión de la VPN a las 01:58, con el usuario `adm-reg` y la dirección `198.51.100.77`, y después el flujo de 14,2 GB hacia esa misma dirección. Sin esa línea no habría ni hora ni origen. Las fuentes van en la misma dirección por caminos distintos: en op.acc.6, **R5 Registro** se añade desde el nivel MEDIO; la medida **op.exp.8** pide un registro de auditoría con usuario, fecha y hora, información afectada, tipo y resultado (y el RD no fija un plazo de retención); y en confianza cero el motor de políticas registra cada decisión y el séptimo principio pide recoger toda la información posible.',
    },
    {
      t: 'list',
      items: [
        'Quién se autenticó, con qué método y con qué resultado, también los intentos fallidos',
        'Desde qué dirección y a qué hora empezó y terminó cada sesión',
        'Qué recursos internos alcanzó la sesión, que es lo que permite relacionar la entrada con lo que pasó después',
        'En confianza cero, cada decisión del motor de políticas: concedida, denegada o revocada',
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'El lunes del registro, leído con esta lección',
      md: 'Ejemplo de razonamiento, no diseño del Consorcio: (1) un segundo factor (op.acc.6 R8) habría hecho insuficiente la contraseña robada; (2) un acceso concedido por sesión y con mínimo privilegio, como pide la SP 800-207, habría limitado lo que esa sesión podía alcanzar; (3) el registro de la VPN es lo que permitió fijar la hora y el origen. Cómo se aplica todo esto al teletrabajo del personal es el trabajo del supuesto `op2s1`.',
    },
  ],
  quiz: [
    {
      id: 'op2m3q1',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Según la NIST SP 800-77r1, en el modelo de acceso remoto con VPN IPsec, ¿qué tramo no queda protegido por la VPN?',
      choices: [
        'El tramo entre el equipo del usuario y la pasarela',
        'El tramo entre la pasarela y los servidores interiores',
        'Ninguno: la VPN protege de extremo a extremo hasta el servidor',
        'Solo el intercambio IKE_SA_INIT, que va en claro',
      ],
      answer: 1,
      explain:
        'La SP 800-77r1 §2.4.2 describe la VPN entre el equipo del usuario y la pasarela, y señala que no protege el tramo entre la pasarela y los servidores interiores. El tramo equipo–pasarela es justo el que cifra. La tercera opción tienta porque se piensa en la VPN como cifrado total, pero termina en la pasarela.',
    },
    {
      id: 'op2m3q2',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Una VPN de cliente con IKEv2 autentica a las personas con EAP. ¿Cuántos mensajes tiene el ejemplo mínimo de la RFC 7296 para ese caso?',
      choices: [
        '8: un intercambio IKE_SA_INIT y tres IKE_AUTH',
        '4: un intercambio IKE_SA_INIT y uno IKE_AUTH',
        '6: los mismos 4 más el intercambio de COOKIE',
        '2: EAP va entero dentro de IKE_SA_INIT',
      ],
      answer: 0,
      explain:
        'La RFC 7296 §2.16 da 8 mensajes en el ejemplo mínimo con EAP (IKE_SA_INIT ×1 e IKE_AUTH ×3). Cuatro es el intercambio inicial sin EAP y seis el caso con COOKIE: ambos tientan porque también son cifras de la RFC. EAP va en IKE_AUTH, no en IKE_SA_INIT.',
    },
    {
      id: 'op2m3q3',
      domain: 'Infraestructuras de comunicaciones',
      prompt: '¿Cuál de estas afirmaciones sobre DTLS es correcta según la RFC 9147?',
      choices: [
        'DTLS 1.3 funciona sobre TCP para garantizar el orden de los paquetes',
        'La RFC 9147 asigna a las VPN DTLS un puerto UDP propio',
        'DTLS 1.3 es la versión siguiente a DTLS 1.1',
        'DTLS 1.3 adapta TLS 1.3 a datagramas sobre UDP y no existe DTLS 1.1',
      ],
      answer: 3,
      explain:
        'La RFC 9147 define DTLS 1.3 como TLS 1.3 para datagramas, sobre UDP, sin protección de orden; DTLS 1.1 no existe porque se saltó para igualar la numeración con TLS. No asigna puerto: el de una VPN DTLS es valor del fabricante. TCP es el transporte de TLS, no de DTLS.',
    },
    {
      id: 'op2m3q4',
      domain: 'Infraestructuras de comunicaciones',
      prompt: '¿Qué afirmación sobre WireGuard se apoya en su documentación oficial?',
      choices: [
        'Es un estándar de la IETF y su puerto por defecto normativo es el 51820',
        'Negocia los algoritmos con el par, como IKEv2',
        'No es un estándar de la IETF, fija sus algoritmos y en su documento técnico Rekey-After-Time vale 120 s y Reject-After-Time 180 s',
        'Funciona sobre TCP y renueva claves una vez al día',
      ],
      answer: 2,
      explain:
        'WireGuard no es una RFC, carece a propósito de agilidad criptográfica y su documento técnico (§6.1) fija Rekey-After-Time en 120 s y Reject-After-Time en 180 s. El 51820 solo aparece en ejemplos, no como valor normativo. Va siempre sobre UDP y renueva claves cada pocos minutos.',
    },
    {
      id: 'op2m3q5',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Un equipo de teletrabajo con túnel dividido navega por una wifi pública mientras está conectado a la red corporativa. ¿Qué riesgo señala la NIST SP 800-46r2?',
      choices: [
        'Que el equipo haga de puente entre una red de confianza y otra que no lo es, y que la organización no pueda examinar buena parte del tráfico',
        'Que la VPN pase automáticamente a TCP 4500 y se corte',
        'Que el túnel dividido obligue a reautenticar cada 30 minutos',
        'Ninguno: la SP 800-46r2 lo recomienda precisamente en redes públicas',
      ],
      answer: 0,
      explain:
        'La SP 800-46r2 §3.3.3 dice que el túnel dividido impide examinar parte del tráfico y puede convertir el equipo en puente entre redes, y que en redes no fiables conviene plantearse desactivarlo. Los 30 minutos son la reautenticación por inactividad de §3.3.1, sin relación con el túnel dividido. Lo contrario de recomendarlo en redes públicas es lo que dice la guía.',
    },
    {
      id: 'op2m3q6',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'En el ENS, ¿desde qué nivel de las dimensiones C, I, T y A exige op.acc.6 el refuerzo R8, doble factor para el acceso desde o a través de zonas no controladas?',
      choices: [
        'Solo en nivel ALTO, junto con R6 y R7',
        'Desde MEDIO, junto con R5 Registro',
        'Desde BAJO: R8 y R9 aparecen en las tres columnas',
        'En ningún nivel: R8 es una recomendación sin carácter obligatorio',
      ],
      answer: 2,
      explain:
        'La fila de op.acc.6 incluye R8 y R9 ya en BAJO, y se mantienen en MEDIO y ALTO. R5 Registro se añade desde MEDIO y R6 y R7 solo en ALTO, por eso las otras dos opciones tientan: confunden R8 con los refuerzos que sí dependen del nivel.',
    },
    {
      id: 'op2m3q7',
      domain: 'Infraestructuras de comunicaciones',
      prompt: '¿Qué relación hay entre la NIST SP 800-207 y el término ZTNA?',
      choices: [
        'La SP 800-207 define ZTNA como sustituto de la VPN de acceso remoto',
        'ZTNA es el nombre que la SP 800-207 da al Policy Enforcement Point',
        'La SP 800-207 obliga a usar ZTNA en lugar del modelo de enclave',
        'La SP 800-207 no usa el término; ZTNA es de analistas y fabricantes, y Mplify 117.1 recoge su definición y la de Gartner',
      ],
      answer: 3,
      explain:
        'El término ZTNA no aparece en la SP 800-207. Mplify 117.1 lo define como acceso solo por política explícita en cualquier lugar y cita a Gartner, cuya definición lo ha convertido en sinónimo de sustituto de la VPN; por eso la primera opción tienta, pero esa lectura no es de NIST. El PEP es un componente con nombre propio, y el enclave es uno de los modelos de la guía.',
    },
    {
      id: 'op2m3q8',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Según la NIST SP 800-46r2, ¿qué caracteriza al escritorio remoto indirecto?',
      choices: [
        'El cliente se conecta directamente al equipo interno por el puerto 3389',
        'La conexión pasa por un servidor intermedio cuya seguridad es crítica, porque autentica y ve el tráfico entre las dos conexiones',
        'Los cortafuegos del perímetro pueden inspeccionar el contenido de la sesión',
        'Solo puede usarse dentro de una VPN IPsec',
      ],
      answer: 1,
      explain:
        'La SP 800-46r2 §2.2.3 describe el modelo indirecto con un servidor intermedio que autentica y ve el tráfico, y por eso su seguridad es crítica. La conexión directa al equipo es el otro modelo, y el 3389 es un valor de Microsoft. La misma guía advierte que, con cifrado de extremo a extremo, los cortafuegos no ven el contenido.',
    },
  ],
};
