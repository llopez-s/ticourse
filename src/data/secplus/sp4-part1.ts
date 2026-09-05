import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP4M1 — Baselines seguros y hardening por tipo de objetivo
// (SY0-701, objetivo 4.1)
// ---------------------------------------------------------------------------
const sp4m1: Module = {
  id: 'sp4m1',
  sectionId: 'sp4',
  title: 'Baselines seguros y hardening por tipo de objetivo',
  minutes: 13,
  objectives: [
    'Recorrer el ciclo de vida de un **secure baseline**: establish, deploy y maintain',
    'Reconocer el **configuration drift** y saber qué lo provoca y cómo se detecta',
    'Elegir las medidas de hardening que de verdad corresponden a cada objetivo: workstations, servers, switches, routers, cloud, móviles, ICS/SCADA, embedded, RTOS e IoT',
    'Justificar por qué en entornos OT la respuesta esperada son compensating controls y no parchear',
    'Explicar el papel del **sandboxing** y de la **monitorización** como refuerzo continuo del baseline',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Bienvenida al dominio 4, **Security Operations**: el más grande del SY0-701 (**28%** del examen) y el más cercano al trabajo diario de una analista. Aquí ya no se discute qué comprar ni cómo dibujar la arquitectura; se trata de **operar** lo que existe. Y el objetivo 4.1 abre con lo más básico y lo peor hecho en casi todas las organizaciones: aplicar técnicas de seguridad comunes a los recursos de cómputo. Es decir, decidir **cuál es la configuración mínima aceptable** de cada sistema, desplegarla en todas partes y comprobar que sigue ahí seis meses después. Esta lección cubre el **secure baseline** y el **hardening** por tipo de objetivo; la siguiente, el wireless, la movilidad y la seguridad de aplicaciones.',
    },
    { t: 'h', text: 'El secure baseline: establish, deploy, maintain' },
    {
      t: 'p',
      md: 'Un **secure baseline** es la **configuración mínima documentada** que debe cumplir cada clase de sistema: qué servicios están activos, qué cuentas existen, qué política de contraseñas se aplica, qué se registra y qué está cifrado. El examen lo trocea en tres verbos y espera que sepas en cuál estás. **Establish** es escribirlo: se parte de fuentes reconocidas —los **CIS Benchmarks**, las **STIG** de DISA, las guías de endurecimiento del fabricante— y se ajusta a la política y a la realidad de la organización, porque un benchmark aplicado en bruto rompe aplicaciones. **Deploy** es imponerlo de forma automática y repetible, no a mano: **Group Policy** en un dominio Windows, **MDM** para móviles, **imágenes maestras** para nuevos equipos, **IaC** y gestión de configuración para servidores y nube. Y **maintain** es la fase que casi nadie hace: comprobar que los sistemas **siguen** en el baseline, revisarlo cuando aparece una vulnerabilidad nueva o cambia el software, y volver a aplicarlo tras cada cambio. El enemigo de esa tercera fase se llama **configuration drift**: la deriva silenciosa entre lo que dice el documento y lo que hay realmente en la máquina. No suele nacer de un ataque, sino de la prisa —una regla de firewall abierta un domingo para resolver una incidencia, un servicio reactivado «solo para probar», una cuenta local creada por un proveedor— y de que nadie deshizo el cambio ni lo documentó. Se detecta comparando el estado real con el baseline: agentes de gestión de configuración que reportan desviaciones, escaneos con **SCAP** contra un benchmark, o revisiones periódicas de configuración. Y se corrige de dos maneras legítimas: **volver al baseline**, o **cambiar el baseline** si la desviación estaba justificada, documentarla y aprobarla. Lo que nunca es válido es dejar la excepción viva y sin dueño.',
    },
    {
      t: 'check',
      q: {
        q: 'During a night-time outage at the Halden Port Authority, an engineer disables the host firewall on three servers to restore a service and never re-enables it. Two months later a configuration review finds the change. Which phase of the secure baseline lifecycle failed, and what is the correct outcome?',
        choices: [
          'Establish failed; the team should write a new benchmark from scratch',
          'Deploy failed; the servers should be rebuilt from a fresh image before anything else',
          'Maintain failed; the drift must be corrected back to the baseline, or the deviation formally approved and documented',
          'No phase failed, because emergency changes are exempt from the baseline',
        ],
        answer: 2,
        explain:
          'The baseline existed and had been deployed correctly, so what broke down is maintenance: nobody verified that the systems still matched the approved configuration after an emergency change. Calling emergency changes exempt is the tempting shortcut, but an undocumented temporary exception with no owner and no expiry is exactly how drift becomes permanent.',
      },
    },
    { t: 'h', text: 'Hardening: qué cambia según el objetivo' },
    {
      t: 'p',
      md: '**Hardening** es reducir la superficie de ataque de un sistema quitando lo que no necesita y protegiendo lo que sí. El principio es idéntico en todas partes —desactivar servicios y puertos innecesarios, eliminar cuentas y credenciales por defecto, cifrar la gestión, aplicar mínimo privilegio, registrar— pero el examen te va a preguntar por **el objetivo concreto**, y ahí cada tipo tiene su acento. En las **workstations** manda el endpoint: **EDR** desplegado, **cifrado de disco completo** (un portátil perdido es una brecha de datos si no está cifrado) y, sobre todo, **quitar los derechos de administrador local** a la usuaria habitual, porque casi todo el malware de oficina depende de que la cuenta pueda instalar cosas. En los **servers** el acento está en la superficie mínima: solo los roles y servicios que el servidor necesita, nada de navegador ni utilidades de escritorio, la consola de gestión fuera de internet y un ciclo de parcheo con ventana definida. En **switches y routers** el guion es siempre el mismo: **cambiar credenciales por defecto**, **desactivar los puertos que no se usan**, sustituir la gestión en claro por **SSH y HTTPS** —telnet, HTTP y **SNMPv1/v2c** con community `public` no tienen defensa posible— y separar la red de gestión del tráfico de usuarias.',
    },
    {
      t: 'check',
      q: {
        q: 'A scan of the port network shows an access switch that still answers telnet on port 23 with the vendor default password and has eight unused ports enabled in a publicly reachable room. Which pair of hardening actions addresses the findings MOST directly?',
        choices: [
          'Install an endpoint detection and response agent on the switch and enable full-disk encryption',
          'Replace telnet with SSH and change the default credentials, then disable the unused ports',
          'Add the switch to the vulnerability scanner and schedule a monthly credentialed scan',
          'Place the switch behind a web application firewall and enable DNS filtering',
        ],
        answer: 1,
        explain:
          'The two findings are cleartext management with default credentials and unnecessary open ports, so encrypted management plus new credentials and disabling the unused ports fixes exactly what was found. Scheduling scans is the plausible distractor because scanning is good practice, but a scan only tells you again what you already know; it does not remove the exposure.',
      },
    },
    {
      t: 'p',
      md: 'La **cloud infrastructure** se endurece en la consola, no en la máquina: **IAM de mínimo privilegio** (roles en vez de claves de larga vida, MFA en las cuentas privilegiadas), **registro habilitado en todas las regiones y cuentas**, **ningún almacenamiento público** salvo decisión expresa y documentada, cifrado activado y grupos de seguridad revisados. Los **mobile devices** se endurecen a través del **MDM**: inscripción obligatoria, cifrado y bloqueo de pantalla forzados por política, borrado remoto disponible, detección de **jailbreak/root** y separación entre datos corporativos y personales. La regla operativa que atraviesa los tres casos es la misma: si el sistema puede inscribirse en una consola de gestión, el baseline se **impone** desde ahí; si no puede, hay que compensarlo con la red.',
    },
    {
      t: 'p',
      md: 'Y ahí empieza la parte incómoda. Los **ICS/SCADA** que gobiernan grúas, esclusas y bombas priorizan la **disponibilidad y la seguridad física** por encima de todo: un parche mal probado no provoca una pantalla azul, provoca una parada de producción o un accidente. El fabricante suele condicionar el soporte a una versión concreta, las ventanas de mantenimiento son anuales y muchos equipos no aguantan un agente. Lo mismo pasa con los **embedded systems** (firmware fijo, ciclos de vida de quince años, a veces sin mecanismo de actualización) y con los **RTOS**, sistemas operativos de tiempo real donde el determinismo temporal es el requisito y añadir un antivirus rompe el propósito del sistema. En los tres casos la respuesta del examen **no es parchear**: es **compensating controls** —segmentación estricta con acceso mínimo, monitorización pasiva del tráfico, control férreo de medios extraíbles y de accesos de proveedor, y sustitución planificada cuando el equipo llega al final de soporte—. Los **IoT devices** son el caso más doméstico y más frecuente: cámaras, sensores y controladoras que llegan con **credenciales por defecto** publicadas en internet, servicios abiertos y un fabricante que deja de publicar firmware a los dos años. Aquí sí hay una primera acción clara y barata: **cambiar las credenciales por defecto**, **aislarlos en su propia VLAN** sin salida a internet ni acceso a la red corporativa, y **sustituirlos** cuando el soporte se acaba.',
    },
    {
      t: 'table',
      headers: ['Objetivo', 'Los dos pasos que más importan', 'Lo que suele salir mal'],
      rows: [
        [
          '**Workstations**',
          '**EDR** y cifrado de disco completo · quitar el administrador local',
          'Usuaria diaria con derechos de admin; portátil sin cifrar que se pierde',
        ],
        [
          '**Servers**',
          'Solo los roles y servicios necesarios · parcheo con ventana definida',
          'Servicios heredados encendidos «por si acaso»; consola de gestión expuesta',
        ],
        [
          '**Switches y routers**',
          'Cambiar credenciales por defecto y desactivar puertos sin usar · gestión cifrada (SSH/HTTPS)',
          'Telnet y SNMPv1; un puerto activo en una sala accesible al público',
        ],
        [
          '**Cloud infrastructure**',
          '**IAM** de mínimo privilegio y MFA · registro activo y cero almacenamiento público',
          'Bucket público, claves de larga vida sin rotar, regiones sin logs',
        ],
        [
          '**Mobile devices**',
          'Inscripción en **MDM** con cifrado y bloqueo · borrado remoto y contenedor corporativo',
          'Dispositivo sin inscribir con correo corporativo; jailbreak sin detectar',
        ],
        [
          '**ICS/SCADA**',
          'Segmentación estricta hacia la red ofimática · monitorización pasiva del tráfico',
          'Intentar parchear en caliente; conectar el HMI a la red de oficina',
        ],
        [
          '**Embedded systems** y **RTOS**',
          'Reducir servicios y activar arranque seguro · aislar en su propio segmento',
          'Dar por hecho que admite un agente; firmware sin soporte y sin plan de relevo',
        ],
        [
          '**IoT devices**',
          '**Cambiar las credenciales por defecto** · VLAN aislada sin salida a internet',
          'Cámaras con admin/admin alcanzables desde internet; sustitución que nunca llega',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: la primera respuesta esperada',
      md: 'Dos reflejos que valen varias preguntas. **Primero:** si aparece una clase de dispositivo nueva —cámaras IP, sensores, un switch recién sacado de la caja, una plataforma cloud— la primera acción esperada es casi siempre **aplicar el secure baseline y cambiar las credenciales por defecto**, antes que escanear, monitorizar o comprar una herramienta. **Segundo:** si el escenario es **OT** —ICS, SCADA, PLC, un RTOS, un sistema embebido crítico— la respuesta **nunca** es «parchearlo inmediatamente» ni «instalar un antivirus»: es **compensating controls**, y en la práctica eso significa **segmentar y monitorizar**. Ojo también con la trampa inversa: «air gap» y «no hacer nada hasta la ventana anual» tampoco son respuestas si el enunciado ya te dice que el sistema está conectado. Y recuerda que **hardening reduce la probabilidad, no la elimina**: por eso el baseline se acompaña siempre de monitorización.',
    },
    { t: 'h', text: 'Sandboxing y monitorización: el baseline en movimiento' },
    {
      t: 'p',
      md: 'El **sandboxing** es ejecutar algo desconocido en un **entorno aislado y desechable** para observar qué hace sin arriesgar nada real: un adjunto sospechoso, un instalador de origen dudoso, una actualización de firmware antes de tocar la grúa. Lo que aporta es **observación segura**: qué ficheros escribe, con qué dominios habla, qué claves de registro toca. Sus dos límites también entran en el examen: el malware moderno usa **técnicas de evasión de sandbox** —detecta que está en una máquina virtual, espera horas o exige interacción humana antes de activarse— y el aislamiento debe ser real, porque una sandbox con acceso a la red corporativa es un laboratorio de infección. La **monitorización**, por su parte, es lo que convierte un baseline estático en un control vivo: registrar y vigilar sistemas, aplicaciones e infraestructura permite ver el drift, detectar el servicio que alguien reactivó y notar el comportamiento que ninguna configuración impidió. Endurecer sin vigilar te deja ciega ante todo lo que el hardening no cubrió; vigilar sin endurecer te condena a perseguir incidentes que no debieron existir.',
    },
    {
      t: 'check',
      q: {
        q: 'The port SOC receives a suspicious executable attached to an invoice email. Analysts want to know what the file does before deciding on a response. Which technique is designed for this, and what is its main limitation?',
        choices: [
          'Sandboxing, run it in an isolated disposable environment; sophisticated malware may detect the sandbox and stay dormant',
          'Credentialed vulnerability scanning, which reports what the file would exploit; it produces many false positives',
          'Full-disk encryption of the analyst workstation, which contains the damage; it slows the machine down',
          'Deploying the file to a pilot group of users and watching the EDR alerts; it needs user consent',
        ],
        answer: 0,
        explain:
          'A sandbox exists precisely to detonate unknown code in isolation and record its behaviour, and its well-known weakness is evasion, since malware can check for virtualization or delay execution until the analysis window closes. Running the file on real user machines is never acceptable, however small the pilot group, because that is executing unknown malicious code on production endpoints.',
      },
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'La revisión trimestral del puerto deja cuatro hallazgos que son cuatro objetivos distintos del 4.1. Las **cámaras** del muelle 3 siguen con la contraseña del fabricante y responden desde internet: cambiar credenciales y meterlas en su **VLAN aislada**, hoy mismo. Los **PLC** de las esclusas tienen una vulnerabilidad publicada y el fabricante no sacará firmware hasta el año que viene: no se parchea, se **segmenta y se monitoriza** el tráfico hacia ellos. Once **servidores** llevan el firewall local desactivado desde una incidencia de julio: **drift** puro, se restaura el baseline y se documenta. Y el equipo de sistemas quiere probar una actualización de la herramienta de estiba descargada de un foro: eso va a la **sandbox**, no a un servidor de preproducción conectado al dominio.',
    },
    {
      t: 'p',
      md: 'Ya tienes el baseline y el hardening por objetivo. La siguiente lección cierra el objetivo 4.1 con los tres frentes que quedan: el **wireless** (dónde poner los puntos de acceso y con qué protocolos protegerlos), la **movilidad** (MDM y los modelos BYOD, COPE y CYOD) y la **seguridad de aplicaciones** (validación de entrada, cookies seguras, análisis de código y firma). Después, el dominio 4 pasa a la gestión de activos y a las vulnerabilidades.',
    },
  ],
  quiz: [
    {
      id: 'sp4m1q1',
      domain: 'Security Operations',
      prompt:
        'A port authority deploys forty new IP cameras across its container terminal. The devices ship with a published default administrator password and expose a web management interface. Which action should the security team take FIRST?',
      choices: [
        'Add the cameras to the monthly vulnerability scan schedule',
        'Purchase an extended support contract from the camera vendor',
        'Change the default credentials and apply the organizational secure baseline to each device',
        'Deploy an endpoint detection and response agent to every camera',
      ],
      answer: 2,
      explain:
        'Default credentials on an internet-reachable management interface are the single most exploited weakness in IoT deployments, so removing them and applying the documented baseline is the first and cheapest control. Adding the devices to the scan schedule is worth doing later, but a scan only reports the exposure that already exists instead of closing it.',
    },
    {
      id: 'sp4m1q2',
      domain: 'Security Operations',
      prompt:
        'Which activity BEST describes the "maintain" phase of the secure baseline lifecycle?',
      choices: [
        'Continuously verifying that deployed systems still match the approved configuration and correcting or formally approving any deviation',
        'Selecting a CIS benchmark and adapting it to organizational policy',
        'Pushing the approved settings to endpoints through group policy and MDM',
        'Documenting the business justification for buying a new class of device',
      ],
      answer: 0,
      explain:
        'Maintaining a baseline means detecting configuration drift and either restoring the approved state or approving and documenting the change, which is what keeps the baseline real over time. Adapting a benchmark is the establish phase and pushing settings through group policy is the deploy phase, so both describe earlier steps rather than ongoing verification.',
    },
    {
      id: 'sp4m1q3',
      domain: 'Security Operations',
      prompt:
        'A SCADA system that controls lock gates runs an operating system with a published critical vulnerability. The vendor will not certify a patch for eleven months and withdraws support if the system is modified. Which response is MOST appropriate?',
      choices: [
        'Apply the vendor-uncertified patch immediately and accept the loss of support',
        'Disconnect the system permanently until the certified patch is released',
        'Accept the risk and take no action until the next annual maintenance window',
        'Apply compensating controls: tighten segmentation around the system and monitor traffic to and from it',
      ],
      answer: 3,
      explain:
        'Operational technology prioritizes availability and safety and often cannot be patched on the defender timetable, so the expected answer is compensating controls that reduce exposure without touching the system. Disconnecting it permanently is tempting because it sounds maximally safe, but shutting down the process the system controls is an availability decision the security team is not entitled to make unilaterally.',
    },
    {
      id: 'sp4m1q4',
      domain: 'Security Operations',
      prompt:
        'Which hardening measure is MOST specific to workstations rather than to network devices or servers?',
      choices: [
        'Disabling unused physical ports on the device',
        'Removing local administrator rights from the standard user account',
        'Replacing cleartext management protocols with encrypted equivalents',
        'Restricting the device to the minimum set of running services',
      ],
      answer: 1,
      explain:
        'Removing local administrator rights targets the workstation problem directly, because most endpoint malware relies on the interactive user being able to install or modify software. Disabling unused ports and minimizing services are genuine hardening steps, but they apply across servers and network devices too, so they are not what distinguishes workstation hardening.',
    },
    {
      id: 'sp4m1q5',
      domain: 'Security Operations',
      prompt:
        'An organization defines its server baseline once and enforces it with a configuration management tool that reports any host whose settings no longer match. Which risk is this control designed to address?',
      choices: [
        'Vendor lock-in with the configuration management supplier',
        'Insider threat from privileged database administrators',
        'Configuration drift between the documented baseline and the real state of the hosts',
        'Supply chain compromise of the operating system installation media',
      ],
      answer: 2,
      explain:
        'Comparing live systems against the approved definition and flagging differences is the standard way to detect and correct configuration drift caused by undocumented or temporary changes. Insider threat is a plausible-sounding option because privileged users often cause the drift, but the control detects the deviation itself regardless of whether the cause was malicious, careless or urgent.',
    },
    {
      id: 'sp4m1q6',
      domain: 'Security Operations',
      prompt:
        'Which set of measures BEST reflects hardening of cloud infrastructure rather than of an on-premises server?',
      choices: [
        'Least-privilege IAM roles with MFA, logging enabled in every region, and no publicly readable storage',
        'Full-disk encryption, an antivirus agent and a screen lock policy',
        'Disabling telnet, changing the enable password and shutting unused switch ports',
        'Installing a host intrusion prevention agent and running weekly offline backups to tape',
      ],
      answer: 0,
      explain:
        'Cloud hardening happens in the control plane, so identity and permissions, logging coverage and the exposure of storage services are the levers that matter most. Full-disk encryption and antivirus describe endpoint hardening: they are real controls, but they say nothing about the misconfigurations that cause the majority of cloud incidents.',
    },
    {
      id: 'sp4m1q7',
      domain: 'Security Operations',
      prompt:
        'A real-time operating system controls crane movement with strict timing requirements. A security engineer proposes installing the standard antivirus agent on it. What is the BEST evaluation of this proposal?',
      choices: [
        'It is correct, because every computing device in the organization must run the standard endpoint agent',
        'It is inappropriate, because the agent can break the deterministic timing the RTOS exists to guarantee; isolation and monitoring are the fitting controls',
        'It is inappropriate, because RTOS platforms cannot be targeted by malware at all',
        'It is correct, provided the agent is configured to scan only once a week outside working hours',
      ],
      answer: 1,
      explain:
        'A real-time operating system is built to guarantee predictable timing, and an agent that consumes CPU unpredictably can violate that guarantee and endanger the process being controlled, so segmentation and passive monitoring are the appropriate compensating controls. Claiming that an RTOS cannot be attacked is the dangerous distractor: these platforms are targeted precisely because they are rarely updated and rarely monitored.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP4M2 — Wireless, movilidad y seguridad de aplicaciones
// (SY0-701, objetivo 4.1)
// ---------------------------------------------------------------------------
const sp4m2: Module = {
  id: 'sp4m2',
  sectionId: 'sp4',
  title: 'Wireless, movilidad y seguridad de aplicaciones',
  minutes: 12,
  objectives: [
    'Planificar una instalación wireless con **site survey** y **heat map** y detectar cobertura que se escapa del perímetro',
    'Explicar qué mejora **WPA3** frente a WPA2 y cuándo toca modo enterprise con **AAA/RADIUS**',
    'Comparar los protocolos de autenticación **EAP-TLS**, **PEAP** y **EAP-TTLS** por fuerza y por requisitos',
    'Elegir entre **BYOD**, **COPE** y **CYOD** según propiedad, control y riesgo, y situar el papel del **MDM**',
    'Aplicar los controles de **application security**: input validation, secure cookies, análisis estático y code signing',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior endureció máquinas; esta endurece lo que se mueve. El objetivo 4.1 cierra con tres bloques que en la práctica comparten un mismo problema: **el perímetro ya no existe**. La señal Wi-Fi sale del edificio, los dispositivos de las empleadas entran y salen del recinto con datos corporativos dentro, y las aplicaciones aceptan entradas de cualquiera desde cualquier sitio. En la Autoridad Portuaria de Halden eso se traduce en antenas que cubren doce hectáreas de muelle, tabletas que viven en las grúas y un portal público donde las navieras declaran su carga.',
    },
    { t: 'h', text: 'Instalación wireless: site survey y heat map' },
    {
      t: 'p',
      md: 'Antes de atornillar un solo punto de acceso se hace un **site survey**: medir sobre el terreno la cobertura real, las fuentes de **interferencia** (motores, estructuras metálicas, otras redes vecinas, hornos y equipos industriales) y cómo se propaga la señal en ese edificio concreto, con sus paredes, sus contenedores apilados y sus naves. El resultado se representa en un **heat map**, un mapa de intensidad de señal superpuesto al plano que hace visibles dos problemas opuestos. Los **dead zones** —zonas sin cobertura donde el servicio simplemente no funciona— y, el que interesa a seguridad, el **over-reach**: la señal que se escapa del perímetro y llega al aparcamiento, a la calle o al barco atracado enfrente, donde cualquiera puede intentar asociarse o capturar tráfico con toda la comodidad del mundo. La respuesta a esa fuga no es una contraseña más larga: es **colocación y potencia** —reubicar antenas, bajar la potencia de transmisión, usar antenas direccionales hacia dentro del recinto— más el cifrado adecuado. Y conviene recordar que **ocultar el SSID no es un control de seguridad**: la red se descubre en cuanto un cliente legítimo se asocia.',
    },
    {
      t: 'check',
      q: {
        q: 'A heat map produced after a wireless deployment at the port shows strong coverage extending into the public car park and across the quay wall. Which response BEST addresses the security concern this raises?',
        choices: [
          'Increase the length and complexity of the wireless passphrase',
          'Adjust antenna placement and transmit power, using directional antennas to keep coverage inside the perimeter',
          'Disable SSID broadcast so outsiders cannot see the network',
          'Move the access points to a separate VLAN with a captive portal',
        ],
        answer: 1,
        explain:
          'Signal spilling beyond the site is a physical coverage problem, so the fitting controls are placement, transmit power and antenna directionality, which reduce how much of the network is reachable from outside. Hiding the SSID is the classic wrong answer: the name is revealed as soon as a legitimate client associates, and the radio signal remains just as available to anyone listening.',
      },
    },
    { t: 'h', text: 'Cifrado y autenticación: WPA3, RADIUS y EAP' },
    {
      t: 'p',
      md: '**WPA3** es el estándar vigente y lo que el examen espera ver elegido. Su mejora central en modo personal es sustituir la clave precompartida clásica por **SAE** (*Simultaneous Authentication of Equals*): en WPA2-PSK, quien capturaba el **four-way handshake** podía llevárselo a casa y probar millones de contraseñas **offline** hasta acertar; con SAE ese ataque de diccionario sin conexión deja de ser viable y además se obtiene **forward secrecy**, de modo que comprometer la contraseña hoy no descifra el tráfico grabado ayer. En modo **enterprise** el salto es distinto y más importante para una organización: en lugar de una contraseña compartida por toda la plantilla, cada usuaria o dispositivo se autentica **individualmente** contra un servidor **AAA**, normalmente **RADIUS**, mediante **802.1X**. Eso da tres cosas que una PSK no puede dar: identidad por usuaria en los registros, revocación individual —se va una persona y se desactiva su cuenta, sin cambiar la clave a todo el puerto— y políticas distintas por perfil. El precio es infraestructura: un servidor RADIUS, un directorio detrás y, si eliges certificados, una **PKI**. Dentro de 802.1X, el método de autenticación lo pone **EAP**: **EAP-TLS** es el más fuerte porque exige **certificado en el servidor y en el cliente** —autenticación mutua, sin contraseñas que robar o adivinar—, mientras que **PEAP** y **EAP-TTLS** solo requieren certificado en el servidor y hacen viajar las credenciales dentro de un túnel TLS; son más fáciles de desplegar, pero dependen críticamente de que el cliente **valide el certificado del servidor**, porque si no lo hace, un punto de acceso falso recoge las credenciales en el primer intento.',
    },
    {
      t: 'check',
      q: {
        q: 'The port replaces a single shared wireless passphrase with WPA3-Enterprise backed by a RADIUS server. Which benefit does this change deliver that a shared passphrase cannot?',
        choices: [
          'Each user authenticates individually, so access can be revoked for one person without changing anything for everyone else',
          'Wireless traffic becomes encrypted, which a shared passphrase never provided',
          'The wireless network no longer requires a site survey or heat map',
          'Devices can connect without any credentials because RADIUS trusts the network',
        ],
        answer: 0,
        explain:
          'Enterprise mode ties every session to an individual identity in the AAA server, which delivers per-user logging and per-user revocation instead of rotating one secret for the whole organization. Saying that encryption only appears with enterprise mode is wrong, since WPA2 and WPA3 personal modes also encrypt traffic; what they lack is individual identity.',
      },
    },
    { t: 'h', text: 'Movilidad: MDM y los modelos BYOD, COPE y CYOD' },
    {
      t: 'p',
      md: 'El **mobile device management (MDM)** es la consola desde la que se impone el baseline a teléfonos y tabletas: exigir cifrado y código de bloqueo, distribuir configuraciones de red y certificados, instalar o prohibir aplicaciones, detectar **jailbreak/root** y, sobre todo, ejecutar un **remote wipe** cuando un dispositivo se pierde. Su función más delicada es la **containerization**: separar los datos corporativos en un contenedor cifrado e independiente del resto del teléfono, de modo que el borrado remoto pueda eliminar **solo el contenedor** —correo, documentos, credenciales— sin tocar las fotos ni los mensajes personales. Esa distinción es la que evita la mitad de los conflictos con la plantilla. Los **connection methods** también entran en el objetivo: **celular** (el operador transporta el tráfico; menos expuesto a un punto de acceso falso, pero fuera de tu visibilidad), **Wi-Fi** (rápido y barato, con el riesgo de las redes públicas y los **evil twins**, que se mitiga exigiendo VPN) y **Bluetooth**, de corto alcance pero con su propio historial de emparejamientos abusivos y de dispositivos que se dejan permanentemente detectables. El modelo de despliegue decide luego cuánto control tienes realmente.',
    },
    {
      t: 'table',
      headers: ['Modelo', 'Propiedad del dispositivo', 'Control de la organización', 'Riesgo típico'],
      rows: [
        [
          '**BYOD** (bring your own device)',
          'De la empleada',
          'Bajo: solo alcanza al contenedor corporativo',
          'Fricción de privacidad al borrar; parque de dispositivos diverso y sin parchear',
        ],
        [
          '**COPE** (corporate owned, personally enabled)',
          'De la organización',
          'Alto: se gestiona el dispositivo completo',
          'Coste de adquisición alto; datos personales conviviendo en un equipo corporativo',
        ],
        [
          '**CYOD** (choose your own device)',
          'De la organización, elegido de una lista aprobada',
          'Alto, con menos variedad de modelos que soportar',
          'Menos flexibilidad para la plantilla; catálogo que envejece y hay que renovar',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A crane operator leaves the port authority. Her personal phone, enrolled under the BYOD programme, holds corporate email and berth documents alongside years of family photos. What is the appropriate action?',
        choices: [
          'Wipe the entire device, because it held corporate data',
          'Take no action, because the device belongs to the employee',
          'Wipe only the corporate container through the MDM, leaving personal data untouched',
          'Ask the employee to delete the corporate applications herself and confirm by email',
        ],
        answer: 2,
        explain:
          'Containerization exists exactly for this moment: a selective wipe removes corporate mail, documents and credentials while leaving the personal side of a device the organization does not own. A full device wipe is the tempting answer because it feels thorough, but destroying an employee personal data on a device she owns creates a legal and reputational problem that the container was designed to avoid.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: tres reflejos de 4.1',
      md: '**«Señal que llega al aparcamiento»** o **«zona sin cobertura»** → **site survey** y **heat map**, luego ajuste de **colocación y potencia**. Nunca una contraseña más larga y nunca ocultar el SSID. **«Dispositivo personal con datos corporativos»** → **MDM con containerization** y una política escrita que la empleada acepta al inscribirse; el borrado que se espera es **selectivo**, no total. **«Cada usuaria con su identidad en el Wi-Fi»** → modo **enterprise** con **802.1X y RADIUS**; si además piden *el método más fuerte*, es **EAP-TLS** por la autenticación mutua con certificados. Y en aplicaciones, la regla que más se pregunta: **la validación de entrada se hace en el servidor**. La validación en el cliente es usabilidad, no seguridad, porque quien ataca no usa tu formulario.',
    },
    { t: 'h', text: 'Seguridad de aplicaciones: entrada, cookies, código y firma' },
    {
      t: 'p',
      md: 'El portal donde las navieras declaran su carga recibe entradas de todo el mundo, y de ahí salen los fallos clásicos. La **input validation** es la primera defensa: comprobar que cada dato recibido tiene el tipo, la longitud, el formato y el rango esperados, preferiblemente con **allow-list** (definir lo que sí se acepta) en lugar de **deny-list** (enumerar lo que se prohíbe, lista que siempre se queda corta). Y se hace **en el servidor**: la validación en el navegador mejora la experiencia, pero se salta con una petición fabricada a mano. Es la raíz de las inyecciones —SQL, comandos— y del **XSS**. Las **secure cookies** protegen la sesión con tres atributos que conviene memorizar: `Secure` (la cookie solo viaja por HTTPS, nunca en claro), `HttpOnly` (JavaScript no puede leerla, así que un XSS no se lleva la sesión) y `SameSite` (no se envía en peticiones de otros sitios, lo que corta el **CSRF**). En el ciclo de desarrollo, el **static code analysis (SAST)** revisa el **código fuente sin ejecutarlo**: encuentra patrones peligrosos muy pronto y muy barato, a cambio de bastantes falsos positivos y de no ver nada que dependa del entorno; el **dynamic analysis (DAST)** ataca la **aplicación en ejecución**, así que ve fallos de configuración y de tiempo de ejecución pero llega tarde y no señala la línea culpable — y es la única opción cuando no tienes el fuente, como en una aplicación de un tercero. Por último, el **code signing** firma digitalmente el binario o el script con la clave del desarrollador: quien lo recibe verifica **quién lo publicó y que no ha sido alterado** desde entonces, que es justo lo que impide que una actualización manipulada se cuele como legítima.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'Tres hallazgos de la auditoría de este trimestre. La red **HALDEN-OPS** usa WPA2 con una clave que conoce toda la terminal y que no se cambia desde 2022: pasa a **WPA3-Enterprise** con RADIUS y **EAP-TLS** para las tabletas de las grúas, que ya tienen certificado. El **heat map** muestra cobertura de −55 dBm en el aparcamiento de visitantes: se bajan dos antenas de potencia y se giran hacia el interior. Y en el portal de declaración de carga, un test descubre que el campo «número de contenedor» solo se valida con JavaScript en el navegador y que la cookie de sesión viaja sin `HttpOnly`: validación en servidor con allow-list y los tres atributos de cookie activados.',
    },
    {
      t: 'p',
      md: 'Con esto queda cerrado el objetivo 4.1 completo: baseline, hardening por objetivo, sandboxing, monitorización, wireless, movilidad y aplicaciones. La siguiente lección salta al 4.2 y a una pregunta que precede a todo lo anterior: **¿de qué activos estamos hablando?** Adquisición con requisitos de seguridad, propiedad y clasificación, inventario y enumeración, y el final del ciclo —**sanitization**, **destruction**, **certification** y **retention**—, porque un disco mal retirado deshace años de hardening.',
    },
  ],
  quiz: [
    {
      id: 'sp4m2q1',
      domain: 'Security Operations',
      prompt:
        'Before deploying access points across a new container terminal, a network team wants to know where coverage will be weak, where signal will leak past the fence, and which industrial equipment causes interference. Which activity provides this information?',
      choices: [
        'A credentialed vulnerability scan of the wireless controllers',
        'A wireless site survey, with the results rendered as a heat map',
        'A penetration test focused on the guest wireless network',
        'A review of the RADIUS authentication logs for the last quarter',
      ],
      answer: 1,
      explain:
        'A site survey measures real signal propagation and interference on site, and the heat map turns those measurements into a visual picture of dead zones and coverage that escapes the perimeter. A penetration test can confirm that an outsider can associate, but it is performed after deployment and tells you nothing about where to place antennas or how to set transmit power.',
    },
    {
      id: 'sp4m2q2',
      domain: 'Security Operations',
      prompt:
        'Which improvement does WPA3 personal mode provide over WPA2 personal mode?',
      choices: [
        'It removes the need for a passphrase by authenticating devices with their MAC address',
        'It hides the network name so that the SSID cannot be discovered',
        'SAE replaces the pre-shared key handshake, defeating offline dictionary attacks on a captured handshake and adding forward secrecy',
        'It moves authentication to a RADIUS server, giving each user a separate identity',
      ],
      answer: 2,
      explain:
        'WPA3 personal replaces the WPA2 four-way handshake with SAE, so capturing the exchange no longer lets an attacker crack the passphrase offline, and past traffic stays protected if the passphrase is later discovered. Per-user identity through RADIUS is the tempting distractor because it is a genuine wireless improvement, but that is what enterprise mode provides, not what distinguishes WPA3 personal from WPA2 personal.',
    },
    {
      id: 'sp4m2q3',
      domain: 'Security Operations',
      prompt:
        'An organization with an existing internal PKI wants the STRONGEST 802.1X authentication method for its wireless network. Which option should it choose, and why?',
      choices: [
        'EAP-TLS, because both the server and the client present certificates, so authentication is mutual and no password is transmitted',
        'PEAP, because the password is protected inside a TLS tunnel and no client certificate is needed',
        'WPA3 personal with a long passphrase, because SAE resists offline cracking',
        'MAC address filtering, because only known hardware addresses are permitted to associate',
      ],
      answer: 0,
      explain:
        'EAP-TLS requires certificates on both ends, which removes credentials from the equation entirely and authenticates the server to the client as well as the client to the server. PEAP is the reasonable runner-up and much easier to roll out, but it still relies on a password inside the tunnel and on the client correctly validating the server certificate, so it is weaker than mutual certificate authentication.',
    },
    {
      id: 'sp4m2q4',
      domain: 'Security Operations',
      prompt:
        'A port authority wants employees to be able to pick a phone, but only from a short list of models that the organization buys, owns and manages in full. Which deployment model matches this requirement?',
      choices: [
        'BYOD, because employees choose the device they prefer',
        'A model in which no mobile devices are permitted at all',
        'COPE, because the organization owns the device and permits personal use',
        'CYOD, because the organization owns the device and the employee selects it from an approved catalogue',
      ],
      answer: 3,
      explain:
        'CYOD is defined by corporate ownership combined with employee choice restricted to an approved list, which is exactly the described arrangement and keeps the supported model range small. COPE is the closest alternative and also involves corporate ownership, but its defining feature is permitted personal use rather than a curated catalogue the employee selects from.',
    },
    {
      id: 'sp4m2q5',
      domain: 'Security Operations',
      prompt:
        'Employees use personal smartphones to read corporate email. Management wants to protect company data on those devices without taking control of personal photos and messages. Which solution BEST meets the requirement?',
      choices: [
        'Require every employee to hand in the device for a full forensic image each quarter',
        'Enrol the devices in MDM and use containerization, so corporate data lives in a managed encrypted container that can be wiped selectively',
        'Block all mobile access to email and provide desktop access only',
        'Install a network access control agent that blocks the phones from the corporate wireless network',
      ],
      answer: 1,
      explain:
        'Containerization keeps corporate data in an isolated managed space that MDM can encrypt and wipe on its own, which protects the organization while leaving the personal side of the device alone. Blocking mobile access entirely would technically remove the risk, but it fails the stated business requirement and usually pushes users towards unmanaged workarounds.',
    },
    {
      id: 'sp4m2q6',
      domain: 'Security Operations',
      prompt:
        'A cargo declaration portal validates the container number field with JavaScript in the browser. A tester submits a crafted request directly to the API and injects unexpected characters that reach the database query. What is the correct conclusion?',
      choices: [
        'The validation logic is fine; the API simply needs rate limiting',
        'Client-side validation should be removed entirely, since it offers no benefit to anyone',
        'Input validation must be enforced on the server, because client-side checks are bypassed by requests that never use the browser form',
        'The database should be moved behind a VPN so that only internal systems can query it',
      ],
      answer: 2,
      explain:
        'Anything enforced only in the browser is advisory, because an attacker sends requests directly to the endpoint and never executes your JavaScript, so validation has to happen server side with an allow-list. Removing client-side validation altogether goes too far: it is still useful for usability and immediate feedback, it simply must never be the security boundary.',
    },
    {
      id: 'sp4m2q7',
      domain: 'Security Operations',
      prompt:
        'Which cookie attribute prevents a session cookie from being read by JavaScript running in the page, limiting the impact of a cross-site scripting flaw?',
      choices: [
        'HttpOnly',
        'Secure',
        'SameSite',
        'Domain',
      ],
      answer: 0,
      explain:
        'HttpOnly tells the browser that the cookie is available to HTTP requests only, so injected script cannot read it and cannot exfiltrate the session token. Secure is the tempting neighbour because it also protects the cookie, but it restricts transmission to HTTPS and does nothing to stop script in the page from reading the value.',
    },
  ],
};

export const SP4_PART1: Module[] = [sp4m1, sp4m2];
