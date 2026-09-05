import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP4M7 — Endurecer capacidades de seguridad (SY0-701, objetivo 4.5)
// ---------------------------------------------------------------------------
const sp4m7: Module = {
  id: 'sp4m7',
  sectionId: 'sp4',
  title:
    'Endurecer capacidades: firewall, IDS/IPS, filtrado, email, DLP, NAC y EDR/XDR',
  minutes: 14,
  objectives: [
    'Interpretar un conjunto de reglas de firewall —access lists, puertos y protocolos— y explicar por qué siempre termina en implicit deny',
    'Distinguir la detección por signatures de la detección por trends o anomalías, y el papel de un IDS frente a un IPS',
    'Elegir el método de filtrado adecuado —web filter agent-based o proxy centralizado, DNS filtering, reputación y categorización— según dónde esté la usuaria',
    'Explicar cómo SPF, DKIM y DMARC se complementan para impedir la suplantación del dominio de correo',
    'Situar FIM, DLP, NAC, EDR/XDR y UBA en la pregunta concreta que cada uno responde',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El objetivo 4.5 es un catálogo, y el examen lo pregunta siempre igual: te describe un problema en una frase y espera que señales **la capacidad que lo resuelve**, no una lista de todo lo que suena parecido. Como analista de la Autoridad Portuaria de Halden vas a manejar una docena de controles que se solapan lo justo para confundir —un **firewall** y un **web filter** bloquean, un **IDS** y un **EDR** detectan, un **DLP** y un **NAC** impiden— y la diferencia está en **qué pregunta contesta cada uno y dónde se coloca**. Esta lección recorre el catálogo por bloques: primero lo que decide el paso del tráfico, después lo que filtra contenido y refuerza el sistema operativo, luego el correo, y por último las capacidades que vigilan el dato y el endpoint.',
    },
    { t: 'h', text: 'Firewall e IDS/IPS: quién pasa y qué se reconoce' },
    {
      t: 'p',
      md: 'Un **firewall** aplica un conjunto ordenado de **rules** —lo que en un router se llama **access list (ACL)**— y cada regla combina origen, destino, **puerto** y **protocolo** con una acción de permitir o denegar. Dos ideas caen una y otra vez. La primera es que **el orden importa**: se evalúa de arriba abajo y gana la primera coincidencia, así que una regla permisiva colocada demasiado arriba anula todas las prohibiciones que vengan después. La segunda es el **implicit deny**: todo conjunto de reglas termina denegando lo que no se ha permitido explícitamente, de modo que la postura por defecto es «cerrado». Por eso, cuando un servicio nuevo deja de funcionar y nadie ha tocado nada, la explicación más probable no es un fallo del firewall sino que **nunca se escribió la regla que lo permitía**. Muchas organizaciones añaden además una regla final explícita de denegar y registrar, no para cambiar el comportamiento —el implicit deny ya bloquea—, sino para **tener el log** de lo que se está descartando. La colocación de los servicios publicados sigue la misma lógica: el portal de licitaciones vive en una **screened subnet** (la antigua DMZ), una zona intermedia accesible desde Internet pero desde la que **no** se puede alcanzar la red interna, de forma que comprometer el portal no regala el resto de la Autoridad Portuaria. La detección de intrusiones que trabaja junto al firewall se pregunta por dos ejes. El primero es **cómo reconoce**: la detección por **signatures** compara el tráfico con patrones conocidos —es precisa y con pocos falsos positivos, pero **solo ve lo que ya está catalogado**—, mientras que la detección por **trends** o anomalías construye una línea base de comportamiento normal y avisa cuando algo se desvía, lo que le permite pillar lo nunca visto a cambio de más ruido y de necesitar un periodo de aprendizaje. El segundo eje es **dónde se coloca**: un **IDS** trabaja fuera de línea, sobre una copia del tráfico, así que **detecta y alerta pero no bloquea**; un **IPS** se sitúa en línea y puede descartar el paquete antes de que llegue, con el riesgo asumido de que un falso positivo corte tráfico legítimo.',
    },
    {
      t: 'check',
      q: {
        q: 'The port authority\'s sensor generated an alert for an exploit attempt against the container terminal server, but the packets still reached the server and the attempt succeeded. Which conclusion is BEST supported?',
        choices: [
          'The sensor is an IDS deployed out of band, so it can alert but not block',
          'The signature database is out of date',
          'The firewall rule set is missing its implicit deny',
          'The sensor was operating in anomaly mode instead of signature mode',
        ],
        answer: 0,
        explain:
          'An IDS receives a copy of the traffic, so it can raise the alert while the original packets continue to their destination untouched; stopping them requires an inline IPS. An outdated signature database is the tempting distractor, but the alert did fire, which proves the pattern was recognised and that the problem is placement, not detection.',
      },
    },
    {
      t: 'h',
      text: 'Filtrado y refuerzo: web, DNS, sistema operativo y protocolos seguros',
    },
    {
      t: 'p',
      md: 'El **web filter** decide a qué sitios puede llegar la plantilla, y el examen distingue **dónde vive**. En el modelo **agent-based** el filtro es un agente instalado en cada equipo, de modo que la política viaja con el portátil y se aplica igual en la oficina, en casa o a bordo de un ferry. En el modelo de **proxy centralizado** todo el tráfico atraviesa un servidor de la organización, lo que da un punto único de inspección y registro pero **solo funciona mientras la usuaria pase por él**. Sobre cualquiera de los dos se apoyan las técnicas que el objetivo enumera: **URL scanning** (analizar la dirección concreta), **content categorization** (clasificar los sitios por temática y permitir o bloquear categorías enteras), **block rules** (listas explícitas) y **reputation** (puntuar dominios por su historial y frenar los recién registrados o ya señalados). El **DNS filtering** actúa antes y más barato: si el dominio malicioso no se resuelve, **la conexión ni siquiera llega a intentarse**, y con eso se corta buena parte del phishing y del command and control sin tocar el tráfico. El refuerzo del sistema operativo aparece con dos nombres propios. En Windows, la **group policy** distribuye de forma centralizada la configuración de seguridad —políticas de contraseña, servicios, restricciones de software, auditoría— a miles de equipos desde el directorio, y es el mecanismo con el que se impone y se mantiene una baseline. En Linux, **SELinux** implementa **mandatory access control**: cada proceso y cada archivo llevan una etiqueta y el sistema aplica una política obligatoria que **ni siquiera el propietario del archivo ni un servicio con privilegios pueden saltarse**, de forma que un servicio web comprometido queda confinado a su dominio y no puede leer lo que no le corresponde. Y el último bloque de endurecimiento es el más sencillo de recordar: **secure protocols**. La elección del protocolo, del puerto y del método de transporte se resume en sustituir lo que viaja en claro por su equivalente cifrado y autenticado: **telnet** (23/tcp) por **SSH** (22/tcp), **HTTP** por **HTTPS** sobre **TLS** (443/tcp), **FTP** por **SFTP** o **FTPS**, **LDAP** (389/tcp) por **LDAPS** (636/tcp), **SNMPv1/v2c** por **SNMPv3** —y con ello se acaban las community strings públicas—, y en el caso del **DNS**, **DNSSEC** para la integridad de la respuesta y **DoT/DoH** para la confidencialidad de la consulta.',
    },
    {
      t: 'check',
      q: {
        q: 'Half of Halden\'s inspectors work from ferries and home offices and never route their browsing through headquarters. Management wants the same browsing policy applied to them without backhauling all their traffic. Which approach fits BEST?',
        choices: [
          'A centralised forward proxy at headquarters',
          'Agent-based web filtering installed on each laptop',
          'A block rule added to the perimeter firewall',
          'An email gateway with URL rewriting',
        ],
        answer: 1,
        explain:
          'An agent enforces the policy locally, so it travels with the device and keeps working on any network without forcing the traffic back to the office. The centralised proxy is the tempting distractor because it is the classic web filtering design, but it only sees traffic that actually passes through it, which is exactly what these users avoid.',
      },
    },
    { t: 'h', text: 'Correo: SPF, DKIM y DMARC contra la suplantación del dominio' },
    {
      t: 'p',
      md: 'La suplantación del dominio de correo es el vector favorito contra una autoridad portuaria: un mensaje que parece venir de la dirección financiera y pide cambiar el número de cuenta de un proveedor. Los tres mecanismos que el examen pregunta no compiten, **se encadenan**. **SPF** (*Sender Policy Framework*) es un registro DNS que publica **qué servidores están autorizados a enviar** correo en nombre del dominio; el receptor comprueba la IP que le entrega el mensaje contra esa lista. **DKIM** (*DomainKeys Identified Mail*) **firma criptográficamente el mensaje** con una clave privada del dominio, y el receptor verifica la firma con la clave pública publicada en DNS, lo que demuestra que el contenido no ha sido alterado y que procede de quien dice. Ninguno de los dos, por sí solo, mira **la dirección que la destinataria ve**. Ahí entra **DMARC** (*Domain-based Message Authentication, Reporting and Conformance*): exige **alineación** entre el dominio del From visible y el dominio validado por SPF o DKIM, publica una **política** —*none*, *quarantine* o *reject*— que dice al receptor qué hacer cuando falla, y activa **informes** periódicos que revelan quién está enviando en tu nombre. Por eso la respuesta completa a «están falsificando nuestro dominio» son **los tres juntos**, con DMARC en modo *reject* una vez que los informes confirman que los envíos legítimos pasan. El **email gateway** es la capa complementaria: filtra spam, malware y enlaces, aplica reputación y pone en cuarentena, pero resuelve el contenido, no la identidad del dominio.',
    },
    {
      t: 'table',
      headers: ['Mecanismo', 'Qué comprueba', 'Dónde vive', 'Qué NO resuelve por sí solo'],
      rows: [
        [
          '**SPF**',
          'Si la IP que entrega el mensaje está en la lista de servidores autorizados del dominio',
          'Registro TXT en el DNS del dominio remitente',
          'No mira el From visible ni protege el contenido; se rompe al reenviar el mensaje',
        ],
        [
          '**DKIM**',
          'Que la firma criptográfica del mensaje valida con la clave pública del dominio',
          'Firma en la cabecera del mensaje + clave pública en DNS',
          'No dice qué hacer si falla, ni exige que el dominio firmante sea el que se ve',
        ],
        [
          '**DMARC**',
          'Alineación del From visible con SPF o DKIM, y aplica la política declarada',
          'Registro TXT en DNS; depende de que SPF o DKIM existan',
          'No filtra contenido malicioso enviado desde un dominio parecido pero legítimo',
        ],
        [
          '**Email gateway**',
          'Contenido: spam, malware, enlaces, reputación del remitente y del dominio',
          'En línea, delante del servidor de correo o en la nube',
          'No autentica el dominio: sin DMARC, un mensaje bien redactado puede pasar',
        ],
      ],
    },
    { t: 'h', text: 'Endpoint, red y datos: FIM, DLP, NAC, EDR/XDR y UBA' },
    {
      t: 'p',
      md: 'Las últimas capacidades del objetivo se distinguen mejor por la pregunta que contestan. El **file integrity monitoring (FIM)** calcula un hash de referencia de los archivos críticos —configuración, binarios del sistema, contenido web— y avisa cuando cambian: responde a **«¿alguien ha modificado esto y cuándo?»**, que es justo lo que hace falta tras una intrusión o para demostrar cumplimiento. El **data loss prevention (DLP)** inspecciona el dato en movimiento, en uso y en reposo buscando patrones o etiquetas —números de contenedor, datos personales, el contrato de practicaje— y bloquea o registra la salida por correo, USB o nube: responde a **«¿se está yendo información que no debería salir?»**. El **network access control (NAC)** decide **si un dispositivo puede siquiera estar en la red**, comprobando identidad y estado de salud (parches, agente, cifrado) antes de conceder acceso, y derivando a una VLAN de cuarentena lo que no cumple. El **EDR** (*endpoint detection and response*) vigila el comportamiento del endpoint —procesos, ejecuciones, persistencia—, permite **aislar el equipo** y deja la telemetría para la investigación; el **XDR** es la evolución que **correlaciona** esa telemetría con la del correo, la red, la identidad y la nube para reconstruir una cadena que en un solo endpoint parecería inocua. Y el **user behavior analytics (UBA)** construye una línea base **de la persona**, no de la máquina: descargas masivas a las tres de la mañana, un acceso desde dos países en veinte minutos o una cuenta que empieza a tocar sistemas que nunca usó.',
    },
    {
      t: 'table',
      headers: ['Lo que necesitas conseguir', 'Capacidad esperada', 'Dónde se sitúa'],
      rows: [
        [
          'Impedir que se llegue a un dominio malicioso antes de abrir la conexión',
          '**DNS filtering**',
          'Resolutor DNS de la organización o servicio en la nube',
        ],
        [
          'Saber si alguien alteró un archivo de configuración y cuándo',
          '**FIM**',
          'Agente en el host, comparando contra hashes de referencia',
        ],
        [
          'Evitar que datos sensibles salgan por correo, USB o nube',
          '**DLP**',
          'Endpoint, gateway de correo y servicios cloud',
        ],
        [
          'Decidir si un equipo puede conectarse a la red y en qué estado',
          '**NAC**',
          'Switch, Wi-Fi o VPN, antes de conceder acceso',
        ],
        [
          'Detectar y contener actividad maliciosa en un portátil, con aislamiento remoto',
          '**EDR**',
          'Agente en el endpoint, con consola central',
        ],
        [
          'Unir señales de endpoint, correo, red, identidad y nube en un solo incidente',
          '**XDR**',
          'Plataforma que correlaciona varias telemetrías',
        ],
        [
          'Notar que una cuenta legítima se comporta de forma anómala',
          '**UBA**',
          'Analítica sobre logs de identidad y actividad',
        ],
        [
          'Confinar un servicio Linux comprometido a lo que su etiqueta permite',
          '**SELinux** (**MAC**)',
          'Núcleo del sistema operativo del servidor',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'An employee of the Halden Port Authority attaches the complete pilotage contract database to a message sent from her corporate account to her personal webmail. Which capability is designed to detect and stop this specific action?',
        choices: [
          'Network access control',
          'File integrity monitoring',
          'Data loss prevention',
          'Endpoint detection and response',
        ],
        answer: 2,
        explain:
          'DLP inspects content leaving the organisation and can block or log a transfer that matches a sensitive pattern or classification label, which is exactly this case. EDR is the tempting distractor because it also runs on the endpoint, but it looks for malicious process behaviour rather than for authorised software moving sensitive data.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: cada frase del escenario apunta a una capacidad',
      md: '**«Están falsificando nuestro dominio en los correos»** → **SPF + DKIM + DMARC**, y si el escenario dice que SPF y DKIM ya existen pero el fraude continúa, la respuesta es **DMARC** con política de rechazo: es el único que exige alineación con el **From visible** y el único que dicta qué hacer al fallar. **«El servicio no funciona y no hay ninguna regla que lo mencione»** → **implicit deny**: lo que no se permite explícitamente se bloquea. **«Detectó pero no bloqueó»** → **IDS** fuera de línea; para bloquear hace falta un **IPS** en línea. **«Malware nunca visto»** → detección por **trends/anomalías**, no por **signatures**. **«¿Quién cambió este archivo?»** → **FIM**. **«¿Debería este dispositivo estar siquiera en la red?»** → **NAC**. **«Los datos se están yendo»** → **DLP**. **«La usuaria es legítima pero se comporta raro»** → **UBA**. **«Portátiles que nunca pasan por la sede»** → web filter **agent-based**, no proxy centralizado. Y ante cualquier protocolo en claro —telnet, HTTP, FTP, LDAP, SNMPv2c— la respuesta esperada es **sustituirlo por su equivalente seguro**, nunca «restringirlo por IP».',
    },
    {
      t: 'p',
      md: 'Con esto tienes el catálogo de capacidades técnicas del dominio 4 colocado sobre el mapa: qué bloquea el tráfico, qué filtra el contenido, qué autentica el correo y qué vigila el dato y el endpoint. Pero todos estos controles comparten un supuesto que aún no hemos examinado: que **quien está al otro lado es quien dice ser y solo puede hacer lo que le corresponde**. Esa es la materia del objetivo 4.6, y la siguiente lección la recorre entera: el ciclo de vida de la identidad, la federación y el SSO, los modelos de control de acceso, la autenticación multifactor y la gestión del acceso privilegiado.',
    },
  ],
  quiz: [
    {
      id: 'sp4m7q1',
      domain: 'Security Operations',
      prompt:
        'Suppliers of the Halden Port Authority keep receiving invoices whose From address displays the port authority domain but which originate from servers the organisation does not own. SPF and DKIM records are already published and correct. Which addition MOST directly causes receiving servers to reject these messages?',
      choices: [
        'A stricter SPF record listing fewer authorised hosts',
        'A second DKIM selector with a longer signing key',
        'An email gateway rule that quarantines all external attachments',
        'A DMARC record published with a reject policy',
      ],
      answer: 3,
      explain:
        'DMARC is the only one of the three that requires the domain in the visible From header to align with the domain validated by SPF or DKIM, and the only one that tells receivers what to do when that check fails. Tightening SPF is the tempting distractor, but a spoofed message can pass SPF on the attacker\'s own sending domain while still displaying the port authority address, so SPF alone never closes this gap.',
    },
    {
      id: 'sp4m7q2',
      domain: 'Security Operations',
      prompt:
        'A newly deployed application at the container terminal cannot reach its database server. Reviewing the firewall, the analyst finds rules permitting HTTPS and SSH to that subnet and no rule mentioning the database port at all. Why is the traffic being dropped?',
      choices: [
        'Stateful inspection requires a matching return rule for every session',
        'The rule set ends in an implicit deny, so anything not explicitly permitted is blocked',
        'The screened subnet blocks east-west traffic between internal hosts by design',
        'The firewall failed open and is discarding unmatched packets',
      ],
      answer: 1,
      explain:
        'Firewall rule sets are evaluated top to bottom and finish with an implicit deny, so a service with no permitting rule is blocked by default and the fix is to add the rule. The stateful return-rule option is the tempting distractor, but a stateful firewall automatically tracks and permits the return traffic of a session it already allowed, and here the outbound session was never allowed in the first place.',
    },
    {
      id: 'sp4m7q3',
      domain: 'Security Operations',
      prompt:
        'A contractor arrives at the port authority with an unmanaged laptop and needs to plug into the office network. Policy says no device may reach the production VLAN until it proves it is patched, encrypted and running the corporate agent. Which capability enforces this?',
      choices: [
        'Network access control',
        'Data loss prevention',
        'File integrity monitoring',
        'A web filter with content categorisation',
      ],
      answer: 0,
      explain:
        'NAC evaluates both the identity and the posture of a device before granting access, and can drop a non-compliant machine into a remediation or quarantine VLAN. DLP is the tempting distractor because it also blocks things, but it governs sensitive data leaving the organisation and has no say in whether a device is admitted to the network.',
    },
    {
      id: 'sp4m7q4',
      domain: 'Security Operations',
      prompt:
        'After containing an intrusion, the incident team must establish whether the configuration files of the berth-allocation server were altered and at what time. Which capability answers this question MOST directly?',
      choices: [
        'DNS filtering logs',
        'User behaviour analytics',
        'File integrity monitoring',
        'An updated IPS signature set',
      ],
      answer: 2,
      explain:
        'FIM stores a cryptographic baseline of critical files and alerts on any deviation, so it provides both the fact of the change and its timestamp. User behaviour analytics is the tempting distractor because it also detects anomalies, but it models how accounts behave rather than recording the state of individual files.',
    },
    {
      id: 'sp4m7q5',
      domain: 'Security Operations',
      prompt:
        'The port authority is targeted with a bespoke malware sample written for this campaign, with no public sample, hash or vendor rule available. Which detection approach is MOST likely to notice it?',
      choices: [
        'Signature-based detection on the IPS',
        'Trend and anomaly-based detection on the IPS',
        'Block rules listing known-malicious URLs',
        'Reputation filtering on the email gateway',
      ],
      answer: 1,
      explain:
        'Anomaly detection compares activity against a learned baseline of normal behaviour, so it can flag something that has never been catalogued anywhere. Signature-based detection is the tempting distractor because it is far more precise in day-to-day operations, but it can only match patterns that already exist in its database, which is exactly what a bespoke sample avoids.',
    },
    {
      id: 'sp4m7q6',
      domain: 'Security Operations',
      prompt:
        'A Linux server hosts the public tender portal. The security team wants a control that confines the web service to the files and actions its policy label allows, so that even a full compromise of the service, running with its own privileges, cannot read unrelated data on the host. Which control provides this?',
      choices: [
        'A host-based firewall rule set',
        'File integrity monitoring on the web root',
        'Discretionary permissions tightened by the file owner',
        'SELinux enforcing mandatory access control',
      ],
      answer: 3,
      explain:
        'SELinux applies a mandatory policy based on labels that neither the file owner nor a privileged process can override, so a compromised service stays confined to its domain. Tightening discretionary permissions is the tempting distractor, but under DAC the owner, and anything running as that owner, can still change or bypass those permissions.',
    },
    {
      id: 'sp4m7q7',
      domain: 'Security Operations',
      prompt:
        'The port authority must publish a tender portal reachable from the internet while ensuring that a compromise of that server does not give direct access to the internal network. Where should the server be placed?',
      choices: [
        'In a screened subnet isolated from the internal network by its own firewall policy',
        'On the internal LAN with a port-forwarding rule on the perimeter firewall',
        'On the management VLAN with an access list limiting inbound sources',
        'Directly on the internet-facing router with a public address',
      ],
      answer: 0,
      explain:
        'A screened subnet is an intermediate zone reachable from the internet whose policy denies it access back into the internal network, so compromising the portal does not extend to internal systems. Port forwarding to an internal host is the tempting distractor because it also publishes the service, but the server itself would still sit inside the internal network, which is precisely the exposure the requirement wants to avoid.',
    },
    {
      id: 'sp4m7q8',
      domain: 'Security Operations',
      prompt:
        'A user opened a phishing message and clicked the link. The endpoint agent later shows a suspicious process, and the analyst needs to see how the message, the click, the process and a subsequent cloud login relate to one another as a single incident. Which capability is described?',
      choices: [
        'An intrusion detection system on the terminal segment',
        'File integrity monitoring across the affected hosts',
        'Extended detection and response correlating endpoint, email, network and cloud telemetry',
        'A web filter with URL scanning and reputation checks',
      ],
      answer: 2,
      explain:
        'XDR exists precisely to correlate telemetry from several domains, so events that look unremarkable in isolation are reconstructed as one attack chain. EDR-style endpoint visibility is the closest distractor, and it would show the suspicious process, but it does not by itself tie in the email that started it or the cloud sign-in that followed.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP4M8 — Identity and access management (SY0-701, objetivo 4.6)
// ---------------------------------------------------------------------------
const sp4m8: Module = {
  id: 'sp4m8',
  sectionId: 'sp4',
  title: 'IAM: identidades, federación, control de acceso, MFA y PAM',
  minutes: 13,
  objectives: [
    'Describir el ciclo de vida de la identidad —provisioning, cambios de puesto y deprovisioning— y el papel de la attestation frente al permission creep',
    'Distinguir LDAP, SAML y OAuth y explicar qué aporta la federación al single sign-on',
    'Comparar los modelos de control de acceso MAC, DAC, RBAC, rule-based y ABAC identificando quién decide en cada uno',
    'Clasificar correctamente los factores de autenticación y reconocer cuándo una combinación no es MFA real',
    'Aplicar la orientación actual sobre contraseñas y explicar qué resuelve el PAM con JIT, vaulting y credenciales efímeras',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Todo lo que endureciste en la lección anterior asume algo que aún no habías comprobado: que **quien está al otro lado es quien dice ser** y que **solo puede hacer lo que le corresponde**. De eso trata el objetivo 4.6, y por eso el **identity and access management** es donde más incidentes empiezan y más preguntas del examen se concentran. En la Autoridad Portuaria de Halden hay estibadoras que rotan de turno, prácticos que solo entran a un sistema, contratistas de mantenimiento de grúas que aparecen tres semanas al año y una plataforma aduanera de un socio externo a la que hay que entrar con las cuentas propias. Cada una de esas situaciones tiene una respuesta distinta, y el examen espera que la identifiques por la pista que te da el escenario.',
    },
    {
      t: 'h',
      text: 'Ciclo de vida de la identidad: provisioning, deprovisioning y attestation',
    },
    {
      t: 'p',
      md: 'La identidad nace con el **identity proofing**: verificar de forma fiable que la persona es quien dice antes de darle nada —documento, presencia física, validación por RR. HH.—, porque toda la cadena posterior hereda ese error si se falla aquí. Después viene el **provisioning**: crear la cuenta y asignarle permisos. La buena práctica que el examen premia es la **asignación por grupos o roles**, no persona a persona, porque un permiso concedido a un individuo es invisible para el siguiente que revise y prácticamente imposible de auditar. El punto débil real es el movimiento intermedio del ciclo **joiner-mover-leaver**: cuando alguien cambia de puesto se le añaden los permisos nuevos y **casi nunca se le retiran los antiguos**, y esa acumulación silenciosa es el **permission creep**, que convierte a una operadora con tres cambios de departamento en la cuenta más privilegiada de la organización sin que nadie lo haya decidido. El antídoto es doble: **least privilege** al conceder y **attestation** de forma periódica, es decir, una recertificación en la que los responsables confirman por escrito quién debe seguir teniendo cada acceso y se retira todo lo que no se confirme. Y el cierre del ciclo, el **deprovisioning**, es la pregunta de examen más previsible de este objetivo. Cuando alguien se marcha, **la cuenta se deshabilita el mismo día**, idealmente a la vez que se comunica la salida, y no se borra de inmediato: se conserva deshabilitada porque el buzón, los archivos y los registros pueden hacer falta para una investigación o por obligaciones de retención, y se elimina más tarde según la política. Deshabilitar primero y borrar después es el orden correcto en cualquier escenario de baja, y muy especialmente en una salida conflictiva.',
    },
    {
      t: 'check',
      q: {
        q: 'A crane maintenance supervisor is dismissed on Friday morning after a dispute. What should the port authority do with her accounts?',
        choices: [
          'Delete every account immediately so nothing remains accessible',
          'Disable all accounts the same day and retain the data until the retention policy allows deletion',
          'Change the passwords and leave the accounts enabled for the handover',
          'Wait for the quarterly attestation review to remove the access',
        ],
        answer: 1,
        explain:
          'Same-day disabling removes access instantly while preserving the mailbox, files and logs that an investigation or a retention obligation may require. Immediate deletion is the tempting distractor because it feels safer, but it destroys evidence and cannot be undone, and account removal is a later step governed by the retention schedule.',
      },
    },
    { t: 'h', text: 'Federación y SSO: LDAP, SAML y OAuth' },
    {
      t: 'p',
      md: 'El **single sign-on (SSO)** permite autenticarse una vez y acceder a varias aplicaciones sin repetir credenciales; reduce la fatiga de contraseñas y centraliza el corte de acceso, a cambio de concentrar el riesgo en una sola autenticación —que por eso debe llevar **MFA**—. La **federation** lleva la idea más allá de la organización: se establece una **relación de confianza** entre un proveedor de identidad (**IdP**) y proveedores de servicio de otra entidad, de modo que la plantilla de la Autoridad Portuaria entra en la plataforma aduanera del socio con **sus propias cuentas** y el socio **nunca custodia esas contraseñas**; cuando la cuenta se deshabilita en el IdP, el acceso al servicio externo muere con ella. Los tres protocolos que el examen confunde a propósito hacen cosas distintas. **LDAP** es el **protocolo de directorio**: consultar y mantener el árbol de usuarias, grupos y atributos, y hacer *bind* para validar credenciales dentro de la organización. **SAML** transporta **aserciones de autenticación** en XML entre el IdP y el proveedor de servicio, y es el estándar clásico del **SSO web empresarial** y de la federación con socios. **OAuth** no autentica: **autoriza y delega**, entregando a una aplicación un token de acceso con un alcance limitado para actuar en nombre de la usuaria sin conocer su contraseña; para obtener además identidad se usa **OpenID Connect**, la capa de autenticación construida sobre OAuth. La **interoperabilidad** es lo que hace todo esto posible: son estándares abiertos, y por eso un IdP puede servir a decenas de aplicaciones de fabricantes distintos.',
    },
    {
      t: 'table',
      headers: ['Tecnología', 'Qué hace realmente', 'Escenario típico'],
      rows: [
        [
          '**LDAP** / **LDAPS**',
          'Consultar y mantener el directorio de usuarias, grupos y atributos; validar credenciales con un bind',
          'Aplicaciones internas que se apoyan en el directorio corporativo',
        ],
        [
          '**SAML**',
          'Transportar una **aserción de autenticación** firmada del IdP al proveedor de servicio',
          'SSO web empresarial y federación con la plataforma de un socio',
        ],
        [
          '**OAuth 2.0**',
          '**Autorizar y delegar**: entrega un token con alcance limitado sin revelar la contraseña',
          'Una aplicación de terceros que necesita leer un calendario o un repositorio',
        ],
        [
          '**OpenID Connect**',
          'Capa de **autenticación** sobre OAuth: añade identidad verificable al token',
          '«Iniciar sesión con...» en aplicaciones modernas y móviles',
        ],
        [
          '**Federation**',
          'Confianza entre organizaciones para que el IdP de una autentique ante los servicios de otra',
          'Personal del puerto entrando en el sistema aduanero del socio con su cuenta',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A berth-planning application from a third-party vendor needs to read the schedules stored in the port authority\'s cloud calendar. It must never learn any user password and its access must be limited to that calendar only. Which standard fits the requirement?',
        choices: ['OAuth', 'SAML', 'LDAP', 'RADIUS'],
        answer: 0,
        explain:
          'OAuth is the delegation standard: it issues a scoped access token that lets an application act on the user\'s behalf for one defined resource without ever seeing the credentials. SAML is the tempting distractor because it also avoids sharing passwords, but it carries an authentication assertion so a user can sign in to a service, not a scoped grant for an application to read specific data.',
      },
    },
    { t: 'h', text: 'Modelos de control de acceso' },
    {
      t: 'p',
      md: 'Cuando ya sabes quién es la usuaria, hay que decidir **qué puede tocar**, y el examen distingue cinco modelos por **quién toma esa decisión**. En el **mandatory access control (MAC)** la decide el sistema a partir de etiquetas de clasificación y niveles de habilitación fijados por la administración de seguridad; **nadie**, ni el propietario del archivo, puede saltarse la política, por eso es el modelo de entornos militares y de sistemas como SELinux. En el **discretionary access control (DAC)** decide el **propietario** del recurso, que comparte con quien quiere: flexible y natural, pero imposible de gobernar a escala. El **role-based access control (RBAC)** asigna permisos a **roles** y personas a roles —«práctica del puerto», «operadora de grúa»—, y es el modelo por defecto de la mayoría de organizaciones porque un cambio de puesto se resuelve cambiando de rol. El **rule-based** aplica reglas iguales para todo el mundo, con independencia de quién sea: una ACL que solo permite tráfico desde una subred, o un bloqueo por origen. Y el **attribute-based access control (ABAC)** evalúa en cada petición una combinación de atributos —departamento, proyecto asignado, estado del dispositivo, ubicación, hora— y es el único que expresa políticas condicionales finas sin multiplicar los roles. A todos ellos se les superponen las **time-of-day restrictions** —una cuenta de contratista que solo funciona en horario de obra— y el principio que lo gobierna todo, el **least privilege**: el mínimo acceso necesario, durante el mínimo tiempo necesario.',
    },
    {
      t: 'table',
      headers: ['Modelo', 'Quién decide', 'Uso típico', 'Su límite'],
      rows: [
        [
          '**MAC**',
          'El sistema, según etiquetas fijadas por la administración de seguridad',
          'Entornos clasificados; confinamiento de servicios con SELinux',
          'Rígido y costoso de administrar; poco flexible para negocio',
        ],
        [
          '**DAC**',
          'La propietaria del recurso',
          'Carpetas compartidas y colaboración cotidiana',
          'Se descontrola a escala; nadie sabe quién compartió qué',
        ],
        [
          '**RBAC**',
          'La organización, mediante roles asignados al puesto',
          'Modelo general de una autoridad portuaria: roles por función',
          'Explosión de roles cuando hay muchas excepciones',
        ],
        [
          '**Rule-based**',
          'Reglas globales del sistema, iguales para todas',
          'ACL de red, restricciones por origen o por horario',
          'No distingue a la persona: no es control por identidad',
        ],
        [
          '**ABAC**',
          'Una política que evalúa atributos en cada petición',
          'Acceso condicionado a proyecto, dispositivo, ubicación y hora',
          'Complejo de diseñar, probar y depurar',
        ],
      ],
    },
    { t: 'h', text: 'MFA, contraseñas y acceso privilegiado' },
    {
      t: 'p',
      md: 'La **autenticación multifactor (MFA)** exige pruebas de **categorías distintas**, y ahí está la trampa favorita del examen. Los factores son **algo que sabes** (contraseña, PIN, pregunta de seguridad), **algo que tienes** (**hard token**, **soft token** en el móvil, **security key** FIDO2, tarjeta inteligente), **algo que eres** (**biometría**: huella, iris, rostro) y **en algún sitio donde estás** (ubicación o red de confianza). Dos cosas que *tienes* —un token físico y una aplicación de códigos en el móvil— **siguen siendo un solo factor**, igual que una contraseña más una pregunta de seguridad son dos cosas que *sabes*. Entre las implementaciones no todas resisten igual: los códigos por SMS son vulnerables al **SIM swapping**, las notificaciones push sufren el **MFA fatigue** o *push bombing*, y una **security key** FIDO2 está vinculada al origen del sitio, por lo que es **resistente al phishing** aunque la usuaria caiga en un dominio falso. En **contraseñas**, la orientación moderna invirtió las prioridades: **la longitud pesa más que la complejidad forzada**, se contrastan las candidatas contra listas de contraseñas ya filtradas, se prohíbe la reutilización entre servicios y **se desaconseja la caducidad periódica obligatoria** —que solo empuja a variaciones predecibles— salvo cuando hay sospecha de compromiso. De ahí que se recomienden los **password managers**, que hacen viable tener una contraseña larga y distinta en cada sitio, y que el destino sea el **passwordless**: passkeys, certificados o biometría local que eliminan el secreto compartido. Por encima de todo esto, las cuentas privilegiadas necesitan su propia disciplina, y eso es el **privileged access management (PAM)**. Tres piezas del examen: el **password vaulting** guarda las credenciales administrativas en una bóveda con custodia, aprobación y rotación automática, de modo que nadie las memoriza ni las guarda en una hoja de cálculo; las **just-in-time permissions** conceden el privilegio **solo durante la ventana aprobada** y lo retiran solo, de forma que no existan administradoras permanentes; y las **ephemeral credentials** son credenciales de un solo uso o de vida muy corta que caducan al terminar la sesión y no sirven si se roban después. Junto a ello, la práctica de **cuentas administrativas separadas** de la cuenta diaria y el registro de sesión completan el control.',
    },
    {
      t: 'check',
      q: {
        q: 'To meet an insurer\'s requirement, Halden enables multifactor authentication for its VPN. Users must now enter a password and then a security question answer. Does this satisfy MFA?',
        choices: [
          'Yes, because two separate credentials are required',
          'Yes, because the security question is a knowledge-based token',
          'No, because both are something you know, so it is still a single factor',
          'No, because MFA requires biometrics as one of the factors',
        ],
        answer: 2,
        explain:
          'Multifactor means factors from different categories, and a password and a security question are both something you know, so the requirement is not met. The first option is the tempting distractor because two prompts feel like two factors, but counting credentials instead of categories is exactly the error the exam tests, and the same trap applies to a hardware token plus a phone app, which are both something you have.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: las pistas de IAM son casi siempre literales',
      md: '**«Alguien se marcha»** → **deshabilitar la cuenta el mismo día** y borrarla más tarde según retención; borrar de inmediato destruye pruebas. **«Acumula permisos de tres puestos anteriores»** → **permission creep**, y la respuesta es **least privilege** más **attestation** periódica. **«Los responsables revisan y confirman los accesos cada trimestre»** → **attestation**, no auditoría ni provisioning. **«Aplicación de terceros que necesita acceder a un recurso sin conocer la contraseña»** → **OAuth**; **«entrar en la web de un socio con nuestra cuenta corporativa»** → **SAML** y **federation**; **«consultar el directorio»** → **LDAP**. **«Condiciones combinadas: departamento, proyecto, dispositivo, hora»** → **ABAC**; **«permisos según el puesto»** → **RBAC**; **«etiquetas que ni el propietario puede cambiar»** → **MAC**; **«el propietario comparte lo que quiere»** → **DAC**. **Dos cosas que tienes siguen siendo un factor**, y dos cosas que sabes también. **«Push aprobado por error tras decenas de avisos»** → **MFA fatigue**, y la mitigación fuerte es una **security key** resistente al phishing. En contraseñas, la respuesta correcta favorece **longitud**, listas de contraseñas filtradas y **password manager**, y desaconseja la **caducidad forzada**. Y **«privilegio solo durante la ventana aprobada, credenciales en bóveda que rotan»** → **PAM** con **just-in-time** y **vaulting**.',
    },
    {
      t: 'p',
      md: 'Con la identidad bajo control cierras la mitad preventiva del dominio 4: sabes endurecer los sistemas, filtrar el tráfico, autenticar el correo y decidir quién entra y hasta dónde. Lo que queda es hacerlo **a escala y sin depender de que alguien se acuerde**. La siguiente lección aborda el objetivo 4.7, la **automatización y la orquestación**: aprovisionar usuarias y recursos, imponer guard rails y baselines, integrar sistemas por API y reconocer también su precio —complejidad, deuda técnica y una plataforma automatizada que se convierte en punto único de fallo y en objetivo privilegiado—.',
    },
  ],
  quiz: [
    {
      id: 'sp4m8q1',
      domain: 'Security Operations',
      prompt:
        'Every quarter, department heads at the Halden Port Authority receive a list of their staff and the systems each person can reach, and must confirm or revoke each entry. Several long-forgotten permissions are removed as a result. Which practice does this describe?',
      choices: ['Identity proofing', 'Provisioning', 'Attestation', 'Federation'],
      answer: 2,
      explain:
        'Attestation is the periodic recertification in which accountable managers confirm which access is still justified, and it is the standard control against accumulated entitlements. Identity proofing is the tempting distractor because it also validates something about a person, but it happens once at enrolment to establish who they are, not repeatedly to review what they may reach.',
    },
    {
      id: 'sp4m8q2',
      domain: 'Security Operations',
      prompt:
        'A port operator who has moved from the ferry terminal to crane maintenance and then to procurement can still open the payroll share, the crane maintenance console and the tender folder. Which problem is this, and which measure addresses it?',
      choices: [
        'Permission creep, addressed by least privilege and periodic access reviews',
        'An identity proofing failure, addressed by stronger onboarding verification',
        'A broken federation trust, addressed by rebuilding the trust with the identity provider',
        'Password reuse, addressed by deploying a password manager',
      ],
      answer: 0,
      explain:
        'Permissions added at each move and never removed accumulate into permission creep, which is corrected by granting least privilege and revoking what recertification does not confirm. Identity proofing is the tempting distractor, but it governs how confidently the person was identified at enrolment and has nothing to do with entitlements accumulating afterwards.',
    },
    {
      id: 'sp4m8q3',
      domain: 'Security Operations',
      prompt:
        'Access to the dredging survey files must be granted only to users in the engineering department, connecting from a managed device, during working hours, and only for the specific projects they are assigned to. Which access control model natively expresses this policy?',
      choices: [
        'Discretionary access control',
        'Role-based access control',
        'Mandatory access control',
        'Attribute-based access control',
      ],
      answer: 3,
      explain:
        'ABAC evaluates a combination of attributes such as department, device state, time and project assignment at each request, which is exactly the conditional policy described. RBAC is the tempting distractor because roles could cover the department, but reproducing every combination of device, hour and project assignment would require an unmanageable proliferation of roles.',
    },
    {
      id: 'sp4m8q4',
      domain: 'Security Operations',
      prompt:
        'In a system used by the port authority, the security administrator assigns classification labels to documents and clearance levels to users, and no document owner is permitted to share a classified file with a colleague of lower clearance. Which access control model is in force?',
      choices: [
        'Discretionary access control',
        'Mandatory access control',
        'Role-based access control',
        'Rule-based access control',
      ],
      answer: 1,
      explain:
        'When labels and clearances are set centrally and the system enforces them so that owners cannot override the policy, the model is mandatory access control. DAC is the tempting distractor because it is the most common model in file shares, but its defining trait is precisely that the owner decides who gets access, which this scenario explicitly forbids.',
    },
    {
      id: 'sp4m8q5',
      domain: 'Security Operations',
      prompt:
        'Attackers are spamming push notifications until tired employees approve one, and several accounts have been taken over this way. Which MFA implementation MOST reduces this specific risk?',
      choices: [
        'One-time codes delivered by SMS',
        'A security question added as a second step',
        'A FIDO2 security key bound to the site origin',
        'A longer minimum password length',
      ],
      answer: 2,
      explain:
        'A FIDO2 security key is cryptographically bound to the legitimate site origin and requires a deliberate physical action, so there is no prompt to approve by accident and no credential to replay on a fake site. SMS codes are the tempting distractor because they replace push approvals, but they remain phishable and vulnerable to SIM swapping, so the account takeover simply changes technique.',
    },
    {
      id: 'sp4m8q6',
      domain: 'Security Operations',
      prompt:
        'The port authority is rewriting its password policy. Which option BEST reflects current guidance?',
      choices: [
        'Require long passphrases, screen candidates against known-breached password lists, and drop scheduled expiration unless compromise is suspected',
        'Require eight characters with four character classes and a forced change every 30 days',
        'Require quarterly changes and prohibit the use of password managers',
        'Require complexity rules and allow reuse after three intervening passwords',
      ],
      answer: 0,
      explain:
        'Modern guidance favours length over imposed complexity, blocks passwords already known to be compromised, and treats routine expiration as counterproductive because it drives predictable variations. The short-and-complex option with monthly rotation is the tempting distractor because it was standard practice for years, but it is precisely the approach current guidance moved away from.',
    },
    {
      id: 'sp4m8q7',
      domain: 'Security Operations',
      prompt:
        'Domain administrator credentials at Halden are stored in a vault, checked out only for an approved change window, granted for the duration of that window and rotated automatically the moment the session ends. Which capability is described?',
      choices: [
        'Federation with an external identity provider',
        'Single sign-on based on SAML assertions',
        'Time-of-day restrictions configured in the directory',
        'Privileged access management with password vaulting and just-in-time permissions',
      ],
      answer: 3,
      explain:
        'Vaulting the credential, granting the privilege only for an approved window and rotating it afterwards is the definition of PAM with just-in-time access and ephemeral credentials. Time-of-day restrictions are the tempting distractor because they also limit when access works, but they apply a fixed schedule to a standing account instead of granting and revoking the privilege per approved request.',
    },
    {
      id: 'sp4m8q8',
      domain: 'Security Operations',
      prompt:
        'Port authority staff must sign in to a partner customs platform using their own corporate accounts, and the partner must never store or handle those passwords. Which technology carries the authentication assertion between the two organisations?',
      choices: ['LDAP', 'SAML', 'RADIUS', 'Kerberos'],
      answer: 1,
      explain:
        'SAML transports a signed authentication assertion from the organisation\'s identity provider to the partner acting as service provider, which is the standard pattern for federated enterprise web SSO. LDAP is the tempting distractor because it is the directory where those accounts actually live, but it is a directory access protocol used inside the organisation, not a means of asserting an authenticated identity to an external service.',
    },
  ],
};

export const SP4_PART4: Module[] = [sp4m7, sp4m8];
