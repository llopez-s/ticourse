import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP3M5 — Firewalls, port security y comunicación segura (SY0-701, objetivo 3.2)
// ---------------------------------------------------------------------------
const sp3m5: Module = {
  id: 'sp3m5',
  sectionId: 'sp3',
  title: 'Firewalls, port security y comunicación segura: VPN, TLS/IPSec, SD-WAN y SASE',
  minutes: 14,
  objectives: [
    'Diferenciar los tipos de firewall del SY0-701 —WAF, UTM, NGFW y filtrado de layer 4— y elegir el adecuado según el riesgo real',
    'Explicar el filtrado de layer 4 frente al de layer 7 y por qué un puerto permitido no significa tráfico seguro',
    'Describir 802.1X y EAP identificando los papeles de supplicant, authenticator y authentication server',
    'Comparar VPN site-to-site y remote access, y full tunnel frente a split tunnel, con el riesgo de cada opción',
    'Situar TLS e IPSec en su capa (AH/ESP, transport/tunnel) y distinguir SD-WAN de SASE',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El objetivo 3.2 se resume en una pregunta que el examen repite de mil formas: **¿qué control encaja con este riesgo?** Esta lección responde a tres riesgos distintos. Un **firewall** decide qué tráfico pasa entre zonas, y lo decisivo es **a qué altura mira**: un filtro de **layer 4** solo ve dirección IP, puerto, protocolo y estado de la sesión, mientras que uno de **layer 7** entiende la aplicación y su contenido —por eso permitir 443/tcp no equivale a permitir «tráfico seguro», sino a permitir *cualquier cosa* que sepa hablar por ese puerto—. El **port security** decide quién puede siquiera enchufarse a la red. Y la **comunicación segura** —**VPN**, **TLS**, **IPSec**, **SD-WAN** y **SASE**— decide cómo viaja el tráfico cuando sale de tu edificio. Como analista de la Autoridad Portuaria de Halden, tu trabajo es colocar cada control donde hace falta y no donde queda bonito.',
    },
    { t: 'h', text: 'Firewalls: del puerto al contenido de la aplicación' },
    {
      t: 'table',
      headers: ['Tipo', 'Qué inspecciona', 'Dónde encaja', 'Su límite'],
      rows: [
        [
          'Packet filter / stateful (**layer 4**)',
          'IP origen y destino, puerto, protocolo y estado de la sesión',
          'Frontera entre zonas, VLANs y subredes; reglas rápidas y baratas',
          'No ve el contenido: si el ataque viaja dentro de 443/tcp, lo deja pasar',
        ],
        [
          '**WAF** (web application firewall)',
          'Peticiones HTTP/HTTPS completas: parámetros, cabeceras, cookies y cuerpo',
          'Delante de una aplicación web publicada (portal de reservas, licitaciones)',
          'Solo protege aplicaciones web; no filtra el resto del tráfico de la red',
        ],
        [
          '**UTM** (unified threat management)',
          'Varias funciones en un solo appliance: firewall, IPS, antivirus, filtrado web, antispam y VPN',
          'Sede pequeña o remota, con poco personal y un único enlace',
          'Punto único de fallo y cuello de botella; menos profundidad en cada función',
        ],
        [
          '**NGFW** (next-generation firewall)',
          'Aplicación (**layer 7**), identidad de la usuaria, inspección TLS e **IPS** integrado',
          'Perímetro y bordes internos de una red grande',
          'Caro y exigente en CPU; no sustituye a un WAF frente a ataques web concretos',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A vulnerability scan flags the port authority\'s public tender portal for reflected cross-site scripting. The site already sits behind an NGFW. Which addition MOST directly mitigates the finding while developers fix the code?',
        choices: [
          'A WAF in front of the portal',
          'A second NGFW in a high-availability pair',
          'Port security on the DMZ switch',
          'A forward proxy for staff browsing',
        ],
        answer: 0,
        explain:
          'A WAF parses each HTTP request and can block the XSS payload as a virtual patch while the code is corrected. The NGFW already in place identifies applications and runs IPS signatures, but it does not validate every parameter of one specific web application the way a WAF does.',
      },
    },
    { t: 'h', text: 'Port security: 802.1X y EAP' },
    {
      t: 'p',
      md: 'El **port security** ataca un riesgo anterior a cualquier firewall: alguien enchufa un equipo no autorizado a una toma de red y ya está dentro del perímetro. **802.1X** es el estándar de **port-based network access control**: el puerto del switch —o la asociación Wi-Fi— permanece **cerrado**, dejando pasar únicamente tráfico de autenticación, hasta que el dispositivo demuestra quién es. Intervienen tres papeles que el examen pregunta con nombre propio. El **supplicant** es el software del equipo que quiere entrar. El **authenticator** es el switch o la controladora inalámbrica: controla el puerto y hace de intermediario, pero **no decide nada**. Y el **authentication server**, casi siempre un **RADIUS**, es quien valida la identidad contra el directorio o la PKI y responde *accept* o *reject*. Lo que viaja entre ellos es **EAP** (**Extensible Authentication Protocol**), que no es un método concreto sino un **marco** capaz de transportar varios: **EAP-TLS** usa certificados en cliente y servidor y es el más fuerte, mientras que **PEAP** y **EAP-TTLS** encapsulan credenciales dentro de un túnel TLS. Sobre la LAN, EAP viaja encapsulado como **EAPOL**. Un detalle que aparece mucho en escenarios: si la respuesta es *reject*, el puerto puede quedarse cerrado o caer a una **VLAN de cuarentena** con acceso solo a remediación.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Intercambio 802.1X: quién habla con quién',
      text: `  SUPPLICANT                    AUTHENTICATOR                 AUTHENTICATION SERVER
  (equipo con cliente           (switch de acceso o           (RADIUS + directorio
   802.1X)                       controladora Wi-Fi)           o PKI)

      |                               |                               |
      | 1. conecta el cable           |  puerto = UNAUTHORIZED        |
      |------------------------------>|  (solo se admite EAPOL)       |
      | 2. EAPOL-Start                |                               |
      |------------------------------>|                               |
      | 3. EAP-Request / Identity     |                               |
      |<------------------------------|                               |
      | 4. EAP-Response / Identity    |                               |
      |------------------------------>| 5. RADIUS Access-Request      |
      |                               |------------------------------>|
      | 6. reto EAP (con EAP-TLS: certificados de cliente y servidor) |
      |<==============================================================|
      | 7. respuesta EAP                                              |
      |==============================================================>|
      |                               | 8. RADIUS Access-Accept       |
      |                               |<------------------------------|
      |                               |    (+ VLAN y ACL dinamicas)   |
      | 9. puerto = AUTHORIZED  ->  ahora si hay DHCP y acceso a la red
      |<------------------------------|                               |

  Access-Reject  ->  el puerto sigue cerrado o cae a una VLAN de cuarentena.
  EAP es el marco de autenticacion; 802.1X lo transporta sobre la LAN (EAPOL).
  El authenticator nunca decide: solo abre o cierra el puerto segun le digan.`,
    },
    {
      t: 'check',
      q: {
        q: 'A visitor plugs a personal laptop into a live wall jack in a meeting room during a public tender event and immediately receives an internal IP address. Which control would have prevented this?',
        choices: [
          'A split tunnel VPN policy for remote staff',
          '802.1X port-based authentication on the access switch',
          'A reverse proxy published in the DMZ',
          'IPSec transport mode between the file servers',
        ],
        answer: 1,
        explain:
          'With 802.1X the switch port stays unauthorised until the device proves its identity to the RADIUS server, so no DHCP lease and no network access are granted first. The reverse proxy only mediates inbound connections to published applications and does nothing about a device already attached to an internal port.',
      },
    },
    { t: 'h', text: 'Comunicación segura: VPN, TLS/IPSec, SD-WAN y SASE' },
    {
      t: 'p',
      md: 'Una **VPN** crea un túnel cifrado sobre una red que no controlas. El examen distingue dos formas y siempre te da la pista en el escenario. La **site-to-site VPN** se establece **una sola vez entre dos gateways** —la sede y la terminal de contenedores— y cifra el tráfico de forma transparente: los equipos de cada lado no instalan nada ni saben que existe. La **remote access VPN** la levanta una persona desde su portátil con un cliente, y sirve para teletrabajo o para una técnica de mantenimiento en un hotel. Dentro de la remote access hay una decisión que cae mucho: **full tunnel** frente a **split tunnel**. En **full tunnel** todo el tráfico del equipo entra en el túnel, incluida la navegación general, así que pasa por el filtrado web, el **DLP** y los registros de la organización; el precio es más latencia y más ancho de banda consumido en la sede. En **split tunnel** solo se encamina por el túnel lo dirigido a las redes corporativas y el resto sale directo a Internet: rinde mejor y descarga el gateway, pero ese tráfico **no se inspecciona ni se registra** y el portátil queda haciendo de puente entre una sesión de Internet sin vigilancia y la red interna.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Full tunnel frente a split tunnel',
      text: `FULL TUNNEL — todo el trafico del equipo entra en el tunel
                    ==== tunel cifrado ====>
   [ portatil ] ------------------------------> [ VPN gateway ] --> red interna
        |                                              |
        +---- Internet, SaaS, streaming ---------------+--> sale por la sede:
                                                            filtrado web, DLP,
                                                            IPS y logs del SOC
   +  Todo el trafico se inspecciona y se registra.
   -  Mas latencia y mas ancho de banda consumido en la sede.

SPLIT TUNNEL — solo lo corporativo entra en el tunel
                    ==== tunel cifrado ====>
   [ portatil ] ------------------------------> [ VPN gateway ] --> red interna
        |
        +---- Internet, SaaS ---------------------> DIRECTO, sin pasar por la sede
                                                    (sin inspeccion, sin DLP,
                                                     sin registro)
   +  Mejor rendimiento y menos carga en el gateway.
   -  El portatil hace de puente entre Internet sin vigilancia y la red interna.`,
    },
    {
      t: 'p',
      md: 'Debajo de cualquier VPN hay un protocolo de **tunneling**, y los dos que pregunta el examen operan a alturas distintas. **IPSec** trabaja en la **capa de red**: protege paquetes IP completos y es el estándar para unir sedes. Tiene dos protocolos —**AH** (*Authentication Header*) aporta integridad y autenticación del origen pero **no cifra**, y **ESP** (*Encapsulating Security Payload*) añade **confidencialidad**, por lo que es el que se usa en la práctica— y dos modos: **transport mode** cifra solo la carga útil y conserva la cabecera IP original (host a host dentro de una red), mientras que **tunnel mode** encapsula el paquete entero dentro de uno nuevo (gateway a gateway, el modo de una site-to-site). **TLS**, en cambio, trabaja a nivel de **aplicación** sobre 443/tcp, y ahí está su ventaja operativa: atraviesa NAT, proxies y redes hostiles que bloquean todo lo que no parezca web, motivo por el que las VPN de acceso remoto suelen ser TLS. Esa misma lógica de «política central sobre enlaces baratos» se lleva a la WAN con **SD-WAN**: un plano de control central decide por qué enlace —fibra, banda ancha o LTE— sale cada aplicación, con cifrado sobre transportes públicos y sin depender de circuitos MPLS caros. **SASE** (*Secure Access Service Edge*) es el paso siguiente: **SD-WAN más seguridad entregada desde la nube** —**SWG**, **CASB**, **ZTNA** y firewall as a service— aplicada por **identidad** en el punto de presencia más cercano a quien se conecta, de modo que la persona que teletrabaja recibe exactamente la misma política que la sucursal, sin retornar el tráfico a la sede.',
    },
    {
      t: 'table',
      headers: ['Necesidad del escenario', 'Control esperado', 'Capa / dónde actúa'],
      rows: [
        [
          'Bloquear SQLi y XSS contra el portal público de reservas',
          '**WAF**',
          'Capa 7 (HTTP/HTTPS), delante de la aplicación',
        ],
        [
          'Permitir solo 443/tcp hacia una subred y denegar el resto',
          'Firewall **stateful** de **layer 4**',
          'Capas 3–4: IP, puerto y estado de la sesión',
        ],
        [
          'Distinguir una aplicación de otra dentro del mismo puerto y aplicar política por usuaria',
          '**NGFW**',
          'Capa 7 con identidad e **IPS** integrado',
        ],
        [
          'Un solo appliance con firewall, antivirus, filtrado web y VPN para una terminal pequeña',
          '**UTM**',
          'Perímetro de la sede, varias funciones en una caja',
        ],
        [
          'Impedir que un equipo no autorizado use una toma de red',
          '**802.1X** con **EAP-TLS**',
          'Puerto del switch, antes incluso del DHCP',
        ],
        [
          'Unir de forma permanente la sede y la terminal de contenedores',
          'VPN **site-to-site** con **IPSec** (**ESP**, tunnel mode)',
          'Capa 3, gateway a gateway',
        ],
        [
          'Dar acceso remoto desde hoteles y redes que bloquean casi todo',
          'VPN **remote access** sobre **TLS**',
          'Capa de aplicación (443/tcp): atraviesa NAT y proxies',
        ],
        [
          'Conectar doce oficinas por enlaces baratos con política central',
          '**SD-WAN**',
          'WAN, superpuesta sobre banda ancha, fibra o LTE',
        ],
        [
          'Lo mismo, pero con seguridad en la nube también para el personal remoto',
          '**SASE**',
          'Nube: SD-WAN + SWG/CASB/ZTNA, guiado por identidad',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'The port authority must guarantee that every website visited from a corporate laptop is filtered and logged by its own security stack, even when the user works from home. Which VPN configuration meets the requirement?',
        choices: ['Split tunnel', 'Full tunnel', 'Site-to-site tunnel', 'IPSec transport mode'],
        answer: 1,
        explain:
          'Only a full tunnel forces all traffic, including general internet browsing, through the corporate gateway where filtering and logging happen. A split tunnel is the tempting distractor because it also encrypts corporate traffic, but it sends everything else straight out of the laptop, which is precisely the traffic the requirement wants inspected.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: cada pista apunta a un control concreto',
      md: '**«Ataques contra una aplicación web pública»** → **WAF**, nunca NGFW: el NGFW identifica aplicaciones y usuarias, pero no valida los parámetros de *tu* portal. **«Oficina pequeña, un solo appliance, personal escaso»** → **UTM**. **«Distinguir aplicaciones dentro de un puerto permitido o aplicar política por usuaria»** → **NGFW**. **«Autenticar el dispositivo antes de que reciba una IP»** → **802.1X**; si además menciona certificados, **EAP-TLS**. Memoriza los tres papeles: **supplicant** (el equipo), **authenticator** (el switch o la controladora) y **authentication server** (**RADIUS**, quien decide). **«Todo el tráfico debe pasar por nuestra inspección»** → **full tunnel**; si el escenario se queja de latencia o de ancho de banda, buscan **split tunnel** y su riesgo. **«La red del hotel bloquea todo menos web»** → VPN sobre **TLS**, no **IPSec**. **«Unir dos sedes de forma permanente y transparente»** → **site-to-site IPSec**. **«Muchas sucursales, enlaces baratos, política central»** → **SD-WAN**; si añade **seguridad entregada desde la nube y basada en identidad**, la respuesta es **SASE**.',
    },
    {
      t: 'p',
      md: 'Con esto cierras la parte de infraestructura del dominio 3: ya sabes dónde colocar los dispositivos, cómo filtrar el tráfico y cómo cifrarlo mientras viaja. La siguiente lección cambia el foco del **tubo** al **contenido**. El objetivo 3.3 trata la **protección de datos**: qué tipos de dato existen, cómo se clasifican, en qué **estados** viven y qué métodos —encryption, hashing, masking, tokenization— los protegen en cada uno de esos estados.',
    },
  ],
  quiz: [
    {
      id: 'sp3m5q1',
      domain: 'Security Architecture',
      prompt:
        'The public booking portal of the Halden Port Authority is being hit with SQL injection and cross-site scripting attempts. The perimeter firewall already permits only 443/tcp to the web servers. Which control is BEST suited to stop these specific attacks?',
      choices: [
        'A tighter stateful layer 4 rule set on the perimeter firewall',
        'A web application firewall placed in front of the portal',
        'A UTM appliance installed at the branch terminal',
        'Port security with 802.1X on the data centre switches',
      ],
      answer: 1,
      explain:
        'SQL injection and XSS live inside HTTP requests, so only a layer 7 control that parses parameters, headers and bodies can recognise them, which is exactly what a WAF does. The stateful layer 4 firewall is the tempting distractor because it is already in the path, but it decides only on IP, port and session state, and the payload arrives on the very port it is required to allow.',
    },
    {
      id: 'sp3m5q2',
      domain: 'Security Architecture',
      prompt:
        'In an 802.1X deployment, a laptop is plugged into an access switch, which forwards the credentials to a RADIUS server that approves or denies them. Which role does the access switch play?',
      choices: ['Supplicant', 'Authentication server', 'Authenticator', 'Certificate authority'],
      answer: 2,
      explain:
        'The device that controls the physical port and relays EAP messages between the client and RADIUS is the authenticator. Authentication server is the tempting distractor, but that is the RADIUS server, which makes the accept or reject decision; the switch only enforces whatever it is told.',
    },
    {
      id: 'sp3m5q3',
      domain: 'Security Architecture',
      prompt:
        'Remote employees connect with a VPN configured so that only traffic destined for internal subnets enters the tunnel, while everything else leaves the laptop straight to the internet. Which statement BEST describes the security consequence?',
      choices: [
        'All remote traffic is now inspected by the corporate web filter and DLP',
        'Corporate traffic is no longer encrypted between the laptop and the gateway',
        'Remote users lose the ability to reach internal file servers',
        'Internet traffic bypasses corporate inspection while the same laptop is attached to the internal network',
      ],
      answer: 3,
      explain:
        'This is a split tunnel: corporate traffic is still encrypted and reachable, but internet traffic never passes through the organisation\'s filtering, DLP or logging, and the same host bridges an uninspected internet session with the internal network. The first option describes a full tunnel, the design that deliberately forces every packet through the gateway so it can be inspected.',
    },
    {
      id: 'sp3m5q4',
      domain: 'Security Architecture',
      prompt:
        'Halden runs nine small terminals that currently backhaul all traffic to headquarters over expensive dedicated circuits just so it can be filtered there. Management wants cheap internet links, centrally defined policy, and cloud-delivered security enforced per user, including for staff working from home. Which architecture BEST fits?',
      choices: [
        'SASE',
        'A full mesh of site-to-site IPSec tunnels',
        'A UTM appliance at each terminal',
        'SD-WAN with no other change',
      ],
      answer: 0,
      explain:
        'SASE combines SD-WAN connectivity with cloud-delivered security services applied by user identity, which covers branch sites and remote workers under a single policy. SD-WAN alone is the closest distractor, because it does solve the cheap-links and central-policy part, but it provides no cloud security stack, which is half of what the requirement asks for.',
    },
    {
      id: 'sp3m5q5',
      domain: 'Security Architecture',
      prompt:
        'A maintenance engineer needs remote access from hotel networks that block everything except web traffic and force all connections through an HTTP proxy. Which remote access approach is MOST likely to work?',
      choices: [
        'IPSec in tunnel mode using ESP',
        'IPSec in transport mode using AH',
        'A TLS-based VPN listening on 443/tcp',
        'An 802.1X supplicant profile pushed to the laptop',
      ],
      answer: 2,
      explain:
        'A TLS VPN rides over 443/tcp like ordinary HTTPS, so it survives NAT, restrictive filters and proxies that drop anything else. IPSec with ESP is a perfectly sound VPN, but it relies on its own IP protocol numbers and on IKE over UDP 500/4500, which such networks normally block, and 802.1X is LAN port authentication, not a remote access tunnel at all.',
    },
    {
      id: 'sp3m5q6',
      domain: 'Security Architecture',
      prompt:
        'A small ferry terminal has one part-time technician, a single internet link and no space for a rack. It needs firewalling, intrusion prevention, antivirus, web filtering and a VPN endpoint. Which option matches the requirement MOST closely?',
      choices: [
        'A dedicated web application firewall',
        'A UTM appliance',
        'A passive network tap feeding an IDS',
        'A load balancer with TLS offload',
      ],
      answer: 1,
      explain:
        'A UTM bundles firewall, IPS, antivirus, web filtering and VPN into one appliance, which is precisely what a small site with minimal staff and space needs. The WAF is the tempting distractor because it is also a security appliance, but it protects only web applications and would leave every other stated requirement unmet.',
    },
    {
      id: 'sp3m5q7',
      domain: 'Security Architecture',
      prompt:
        'The port authority wants the container terminal network and the headquarters network to behave as one routed network across the public internet, with no software installed on individual workstations. Which solution BEST meets this requirement?',
      choices: [
        'A site-to-site IPSec VPN between the two gateways',
        'A remote access VPN client deployed to every workstation',
        'A reverse proxy published at headquarters',
        'A jump server placed in the DMZ',
      ],
      answer: 0,
      explain:
        'A site-to-site VPN is built once between the two gateways and encrypts traffic transparently for every host behind them, so nothing is installed on the workstations. The remote access VPN is the tempting distractor because it also encrypts the traffic, but it requires a client on each machine and is designed for individual users rather than for joining two networks.',
    },
    {
      id: 'sp3m5q8',
      domain: 'Security Architecture',
      prompt:
        'Traffic analysis shows a file-sharing application smuggling data out of the port network over 443/tcp, a port the firewall must keep open for legitimate web traffic. Which capability would let the security team block that application without closing the port?',
      choices: [
        'A larger stateful session table on the firewall',
        'Port security enforced on the access switches',
        'A fail-closed configuration on the firewall',
        'Application awareness on a next-generation firewall',
      ],
      answer: 3,
      explain:
        'Identifying and blocking a specific application regardless of the port it uses is the layer 7 application awareness that defines an NGFW. Fail-closed configuration is the tempting distractor because it sounds stricter, but it only describes what the device does when it itself fails, and it cannot tell one application from another inside an allowed port.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP3M6 — Protección de datos (SY0-701, objetivo 3.3)
// ---------------------------------------------------------------------------
const sp3m6: Module = {
  id: 'sp3m6',
  sectionId: 'sp3',
  title: 'Protección de datos: tipos, clasificaciones, estados y métodos',
  minutes: 13,
  objectives: [
    'Clasificar la información por tipo: regulated, trade secret, intellectual property, legal, financial y human-readable frente a non-human-readable',
    'Ordenar las clasificaciones public, private, sensitive, confidential, restricted y critical por impacto, y saber que las asigna el data owner',
    'Distinguir los tres estados del dato —at rest, in transit e in use— y el control primario de cada uno',
    'Explicar data sovereignty y geolocation, y por qué manda la ubicación física del dato',
    'Elegir entre encryption, hashing, masking, tokenization, obfuscation, segmentation, permission restrictions y geographic restrictions ante un escenario',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Hasta ahora has protegido **caminos**: zonas, firewalls, túneles. El objetivo 3.3 protege el **contenido** que circula por ellos, y lo hace con cuatro preguntas encadenadas que conviene responder en este orden: **qué tipo de dato** es, **cómo de sensible** es —su **classification**—, **en qué estado** se encuentra ahora mismo y **qué método** lo protege en ese estado. Si te saltas alguna, acabas cifrando discos mientras el dato se escapa por una pantalla. En la Autoridad Portuaria de Halden conviven manifiestos de carga, listas de pasaje, nóminas y los planos de la red OT: el mismo edificio y cuatro respuestas distintas.',
    },
    { t: 'h', text: 'Tipos de dato: qué estás protegiendo exactamente' },
    {
      t: 'list',
      items: [
        '**Regulated data** — su tratamiento lo impone una ley o un estándar externo: **GDPR** para datos personales en la UE, **PCI DSS** para datos de tarjeta, normativa sanitaria para historiales. La organización no elige las reglas: las cumple y las demuestra.',
        '**Trade secret** — información cuyo valor depende de que nadie más la conozca y que se protege **manteniéndola en secreto**, no registrándola: una fórmula, un proceso, el algoritmo con el que el puerto asigna atraques.',
        '**Intellectual property** — creaciones protegidas por patentes, copyright o marcas. A diferencia del trade secret, aquí la protección es **legal y pública**: el registro es precisamente lo que te da derechos.',
        '**Legal information** — expedientes, contratos, correspondencia con la asesoría jurídica. Suele arrastrar obligaciones de retención y, en litigios, de conservación (**legal hold**).',
        '**Financial information** — contabilidad, nóminas, facturación y previsiones. Se solapa con regulated en cuanto entra una auditoría o una norma contable.',
        '**Human-readable vs. non-human-readable** — un PDF o una hoja de cálculo se leen directamente; un volcado binario, un fichero serializado o un modelo entrenado necesitan una herramienta. Que no se lea a simple vista **no es un control**: la clasificación depende del contenido, nunca del formato.',
      ],
    },
    { t: 'h', text: 'Data classifications: el daño que causaría divulgarlo' },
    {
      t: 'table',
      headers: ['Clasificación', 'Qué significa', 'Ejemplo en Halden', 'Manejo típico'],
      rows: [
        [
          '**Public**',
          'Divulgarlo no causa daño; ya es abierto o está pensado para serlo',
          'Horarios de atraque publicados, notas de prensa',
          'Sin restricción de acceso; revisión editorial antes de publicar',
        ],
        [
          '**Private**',
          'Información de personas u organizaciones que no debe hacerse pública',
          'Domicilio y teléfono del personal de estiba',
          'Acceso por necesidad, cifrado en reposo, retención limitada',
        ],
        [
          '**Sensitive**',
          'Daño moderado si se filtra; a menudo cae también en regulated',
          'Datos de salud del servicio médico portuario',
          'Cifrado, registro de accesos, permisos estrictos',
        ],
        [
          '**Confidential**',
          'Uso interno limitado a un grupo concreto de personas',
          'Ofertas selladas de la licitación de la nueva grúa',
          'Etiquetado, acuerdos de confidencialidad, DLP de salida',
        ],
        [
          '**Restricted**',
          'Círculo mínimo; el daño de una filtración sería grave',
          'Planos de la red OT y credenciales de los PLC de las esclusas',
          'Need to know, MFA, aprobación nominal y revisión periódica',
        ],
        [
          '**Critical**',
          'Su pérdida o alteración detiene la operación del puerto',
          'Base de datos de manifiestos y sistema de control de esclusas',
          'Alta disponibilidad, backups verificados, controles de integridad',
        ],
      ],
    },
    {
      t: 'p',
      md: 'Clasificar no es un adorno burocrático: es la etiqueta que decide **qué controles se aplican después**. Quien clasifica es el **data owner** —la responsable de negocio de esa información—, no la administradora que configura los permisos ni el SOC que la vigila; esos son el **data custodian** y quienes la procesan. La escala exacta varía entre organizaciones y algunas usan solo tres niveles, así que el examen no te va a pedir memorizar una jerarquía universal: te dará un escenario y esperará que razones por el **impacto de la divulgación**. Una vez asignada, la clasificación se materializa en **labeling** (marcas visibles en los documentos y metadatos que las herramientas puedan leer), en reglas de manejo —cifrado, retención, destrucción segura— y en las políticas de **DLP** que impiden que un fichero marcado como restricted salga por correo.',
    },
    {
      t: 'check',
      q: {
        q: 'Sealed bids for a new crane contract may be seen only by the tender committee until the opening date, and early disclosure would compromise the procurement process. Which classification level fits BEST?',
        choices: ['Public', 'Private', 'Confidential', 'Critical'],
        answer: 2,
        explain:
          'Confidential describes internal information restricted to a defined group, which is exactly the tender committee before the opening date. Critical is the tempting distractor, but that level is reserved for information whose loss or corruption would stop operations, and leaking the bids damages the procurement process rather than halting the port.',
      },
    },
    { t: 'h', text: 'Los tres estados del dato, la soberanía y la geolocalización' },
    {
      t: 'table',
      headers: ['Estado', 'Dónde está el dato', 'Amenaza principal', 'Control primario'],
      rows: [
        [
          '**At rest**',
          'Disco, cabina de almacenamiento, backup, móvil, USB',
          'Robo del equipo o del soporte, copia del fichero, backup extraviado',
          '**FDE**, cifrado de base de datos o de fichero, permisos y control de acceso',
        ],
        [
          '**In transit**',
          'La red: LAN, WAN, Wi-Fi, Internet, enlaces con terceros',
          'Sniffing y **on-path attack** sobre protocolos en claro',
          '**TLS**, **IPSec**, VPN, SSH/SFTP: cifrar el canal de extremo a extremo',
        ],
        [
          '**In use**',
          'Memoria RAM, CPU, pantalla, portapapeles, ficheros temporales',
          'Malware que lee la memoria, capturas de pantalla, shoulder surfing, exceso de privilegio',
          '**Least privilege**, **masking** en pantalla, bloqueo de sesión, secure enclaves y cifrado en memoria',
        ],
      ],
    },
    {
      t: 'p',
      md: 'De los tres estados, **data in use** es el que suspende casi todo el mundo. Mientras una aplicación procesa un manifiesto, el dato está **descifrado** en la memoria del equipo: el cifrado de disco ya lo abrió al leerlo y el túnel TLS ya terminó al llegar. Por eso sus controles son distintos —**least privilege** para que menos procesos puedan tocarlo, **masking** para que la pantalla no muestre más de lo necesario, bloqueo de sesión contra el *shoulder surfing* y, en entornos avanzados, **secure enclaves** o cifrado en memoria—. La otra mitad de las consideraciones generales del 3.3 es geográfica. La **data sovereignty** establece que un dato queda sujeto a las leyes del país **donde reside físicamente**: si Halden guarda registros de pasaje en un centro de datos de otro continente, la legislación de ese país puede alcanzarlos por mucho que la sede esté en la Unión Europea. La **geolocation** es el dato técnico que lo hace comprobable y accionable —en qué región vive ese almacenamiento, desde qué país se conecta esa cuenta— y es la base de los controles de acceso por ubicación.',
    },
    {
      t: 'check',
      q: {
        q: 'Cargo manifests are pulled every night from a shipping partner across the public internet. Which control protects that data while it is in transit?',
        choices: [
          'Full disk encryption on the receiving file server',
          'A TLS or IPSec tunnel protecting the nightly transfer',
          'Masking the consignee names in the operations console',
          'Hashing each file before it is archived',
        ],
        answer: 1,
        explain:
          'Data in transit is protected by encrypting the channel it travels through, which is what TLS or an IPSec VPN provides for that nightly transfer. Full disk encryption is the tempting distractor because it also uses encryption, but it only protects the files once they have been written to storage, which is the at-rest state.',
      },
    },
    { t: 'h', text: 'Métodos para proteger los datos' },
    {
      t: 'list',
      items: [
        '**Encryption** — convierte el dato en ilegible sin la clave y es reversible con ella. Es el control de referencia **at rest** (FDE, cifrado de base de datos) e **in transit** (TLS, IPSec).',
        '**Hashing** — resumen de longitud fija y **de un solo sentido**. Sirve para **integridad** y para almacenar contraseñas; no es cifrado precisamente porque no hay vuelta atrás.',
        '**Masking** — oculta **parte** del valor al mostrarlo (por ejemplo, ************4417 en la pantalla del agente). El dato original sigue intacto allí donde se guarde; lo que cambia es lo que ve quien mira.',
        '**Tokenization** — sustituye el valor por un **token** sin valor propio; la correspondencia vive en una **vault** protegida, de modo que **es reversible** para quien tenga acceso a esa vault. Reduce el alcance de PCI DSS porque el sistema deja de almacenar el número real.',
        '**Obfuscation** — hace el dato o el código difíciles de interpretar, pero sin garantía criptográfica: es un obstáculo, no una barrera, y nunca sustituye al cifrado.',
        '**Segmentation** — separa la información en redes, bases de datos o entornos distintos para que el compromiso de uno no alcance a todos.',
        '**Permission restrictions** — quién puede leer, escribir o borrar: **least privilege** y **need to know** implementados con ACL, roles y grupos.',
        '**Geographic restrictions** — limitan **dónde** puede residir el dato y desde dónde se accede a él: **geofencing** de accesos y almacenamiento anclado a una región. Es el control con el que se cumplen las exigencias de **data sovereignty**.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Support agents at the ferry booking desk see passenger card numbers rendered as ************4417 in the CRM, while the payment platform still holds the complete value. Which method is being applied in the CRM?',
        choices: ['Hashing', 'Masking', 'Tokenization', 'Segmentation'],
        answer: 1,
        explain:
          'Hiding part of a value for display while the original remains unchanged wherever it is stored is masking. Tokenization is the tempting distractor, but it replaces the number with an unrelated surrogate mapped in a vault instead of showing a partially obscured version of the real one.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: los tres cortes que más caen del 3.3',
      md: '**Estados.** Si el escenario ya menciona **full disk encryption** y **TLS** y aun así hay fuga, el estado desprotegido es **data in use**: el dato descifrado en memoria, en la pantalla o en el portapapeles. Es justo el estado que el cifrado en reposo y en tránsito **no** cubren. **Soberanía.** Las preguntas de **data sovereignty** se responden por **dónde reside físicamente el dato**, no por dónde está la sede ni por la nacionalidad de la empresa; la nube no cambia la regla, solo hace muy fácil incumplirla sin darse cuenta. **Métodos.** **Masking** oculta parte de un valor para mostrarlo; **tokenization** lo sustituye por un token sin valor cuya correspondencia vive en una **vault**, así que es **reversible** para quien controle esa vault; **hashing** es de **un solo sentido** y sirve para integridad o contraseñas, nunca para recuperar el dato. Y recuerda: **quien clasifica es el data owner**, no la administradora que aplica los permisos.',
    },
    {
      t: 'p',
      md: 'Ya sabes qué proteger, con qué etiqueta y con qué método. La última lección del dominio 3 responde a la pregunta que queda abierta: **qué pasa cuando algo se cae**. Verás la **resiliencia y la recuperación** del objetivo 3.4 —alta disponibilidad, load balancing frente a clustering, sitios hot, warm y cold, dispersión geográfica, backups y sus pruebas, y la energía que sostiene todo lo demás—.',
    },
  ],
  quiz: [
    {
      id: 'sp3m6q1',
      domain: 'Security Architecture',
      prompt:
        'The billing support application shows an agent only the last four digits of a customer card number, while the payment system continues to hold the complete value unchanged. Which data protection method is being used?',
      choices: ['Tokenization', 'Hashing', 'Masking', 'Full disk encryption'],
      answer: 2,
      explain:
        'Masking hides part of a value while leaving enough visible for the task, which is exactly what showing only the last four digits does. Tokenization is the tempting distractor, but it substitutes the value with a different surrogate stored in a vault rather than displaying a partially obscured version of the original.',
    },
    {
      id: 'sp3m6q2',
      domain: 'Security Architecture',
      prompt:
        'To support recurring billing, the port authority wants its invoicing system to keep charging customers without ever storing real card numbers, while the payment provider can still recover the original value when a charge is processed. Which method meets this requirement?',
      choices: [
        'Tokenization',
        'Masking of the stored numbers',
        'Hashing of the stored numbers',
        'Obfuscation of the invoicing source code',
      ],
      answer: 0,
      explain:
        'Tokenization replaces the card number with a token that has no exploitable value on its own, and only the provider\'s vault can map it back when a charge must be made. Hashing is the tempting distractor because it also substitutes the value, but it is one-way, so no future charge could ever be processed from what was stored.',
    },
    {
      id: 'sp3m6q3',
      domain: 'Security Architecture',
      prompt:
        'Halden is headquartered in the European Union, but its new analytics platform stores passenger records in a data centre located in another country. Legal counsel warns that the laws of that country may now apply to those records. Which concept is counsel describing?',
      choices: ['Data classification', 'Data sovereignty', 'Data masking', 'Data retention'],
      answer: 1,
      explain:
        'Data sovereignty means information is subject to the laws of the jurisdiction where it physically resides, which is why the storage location rather than the headquarters address drives the analysis. Data classification is the tempting distractor because it also governs how records must be handled, but classification is an internal sensitivity label and does not decide which country\'s law applies.',
    },
    {
      id: 'sp3m6q4',
      domain: 'Security Architecture',
      prompt:
        'A port authority workstation uses full disk encryption and every application connects over TLS. An attacker installs malware that reads decrypted passenger records out of memory while a clerk works with them. Which data state was left unprotected?',
      choices: ['Data at rest', 'Data in transit', 'Data in backup', 'Data in use'],
      answer: 3,
      explain:
        'Full disk encryption covers data at rest and TLS covers data in transit, but once information is decrypted into memory for processing it becomes data in use, the state neither control protects. Data at rest is the tempting distractor because the records also live on the encrypted disk, yet the theft happened from memory while they were actively being processed.',
    },
    {
      id: 'sp3m6q5',
      domain: 'Security Architecture',
      prompt:
        'A new dataset of berth scheduling records has been created and nobody has decided how sensitive it is. Who is responsible for assigning its classification?',
      choices: [
        'The systems administrator who provisions the storage',
        'The data owner, who is accountable for that information',
        'The SOC analyst who monitors access to the dataset',
        'The cloud provider hosting the database',
      ],
      answer: 1,
      explain:
        'Classification is a business judgement about the impact of disclosure, so it belongs to the data owner who is accountable for the information. The systems administrator is the tempting distractor because they implement encryption and permissions, but that is the custodian role, which executes the decision rather than making it.',
    },
    {
      id: 'sp3m6q6',
      domain: 'Security Architecture',
      prompt:
        'An auditor must prove that an archived cargo manifest has not been altered since it was filed three years ago, and the stored verification value must not allow anyone to reconstruct the file. Which method fits BEST?',
      choices: [
        'Store a hash of the file and recompute it for comparison',
        'Encrypt the file with a symmetric key held by the archive team',
        'Tokenize the file name in the archive index',
        'Mask the contents of the file in the viewer',
      ],
      answer: 0,
      explain:
        'A hash is a one-way, fixed-length digest, so recomputing it and comparing digests proves integrity without the stored value revealing anything about the file. Encryption is the tempting distractor because it also transforms the data, but it is designed to be reversed with the key and by itself addresses confidentiality rather than proving nothing changed.',
    },
    {
      id: 'sp3m6q7',
      domain: 'Security Architecture',
      prompt:
        'After an incident, the port authority decides that its crew management portal must refuse connections originating outside the countries where it operates, and that backups must never leave the European region. Which method is being applied?',
      choices: [
        'Segmentation',
        'Permission restrictions',
        'Obfuscation',
        'Geographic restrictions',
      ],
      answer: 3,
      explain:
        'Blocking access by source country and pinning storage to a region are geographic restrictions, usually implemented as geofencing and region-locked storage, and they are how data sovereignty requirements get enforced. Permission restrictions is the tempting distractor, but permissions decide which identity may act on the data, not from which physical location it may be reached or where it may reside.',
    },
    {
      id: 'sp3m6q8',
      domain: 'Security Architecture',
      prompt:
        'The port authority holds the source code and tuning parameters of the algorithm it developed to allocate berths. It has never been registered or published, and its value depends entirely on competitors not knowing how it works. Which data type BEST describes it?',
      choices: [
        'Regulated data',
        'Financial information',
        'Trade secret',
        'Non-human-readable data',
      ],
      answer: 2,
      explain:
        'Information whose value comes from being kept secret, and which is protected by confidentiality rather than by registration, is a trade secret. Regulated data is the tempting distractor, but that label applies to information governed by an external law or standard such as GDPR or PCI DSS, and no such regime covers an internal berth-scheduling algorithm.',
    },
  ],
};

export const SP3_PART3: Module[] = [sp3m5, sp3m6];
