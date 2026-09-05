import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// sp1m3 — Zero Trust: control plane y data plane (SY0-701, objetivo 1.2)
// ---------------------------------------------------------------------------
const sp1m3: Module = {
  id: 'sp1m3',
  sectionId: 'sp1',
  title: 'Zero Trust: control plane y data plane',
  minutes: 13,
  objectives: [
    'Explicar el principio «never trust, always verify» frente al modelo de perímetro',
    'Distinguir el control plane del data plane en una arquitectura Zero Trust',
    'Identificar el papel del policy engine, el policy administrator y el policy enforcement point',
    'Describir adaptive identity, threat scope reduction y policy-driven access control',
    'Situar subject/system e implicit trust zones dentro del flujo de una petición',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Durante décadas la seguridad de red se diseñó como un castillo con foso: un **perimeter** fuerte (firewall, VPN) y, una vez dentro, confianza casi total. El problema es que el atacante que roba una credencial o compromete un portátil **ya está dentro**, y el castillo no vuelve a preguntarle nada. **Zero Trust** invierte la premisa: ninguna petición se considera de fiar por su origen, y cada acceso se verifica de forma explícita. Su lema examinable es **«never trust, always verify»**.',
    },
    {
      t: 'table',
      headers: ['Aspecto', 'Modelo de perímetro', 'Zero Trust'],
      rows: [
        [
          'Supuesto base',
          'Lo que está dentro de la red es de confianza',
          'Nada es de confianza por defecto, ni dentro ni fuera',
        ],
        [
          'Dónde se decide el acceso',
          'En el borde (firewall, VPN), una vez',
          'En cada petición, evaluando identidad, dispositivo y contexto',
        ],
        [
          'Movimiento lateral',
          'Fácil tras el primer compromiso',
          'Limitado por micro-segmentación y mínimo privilegio',
        ],
        [
          'Unidad de confianza',
          'La red interna completa',
          'Zonas pequeñas y explícitas (implicit trust zones)',
        ],
      ],
    },
    { t: 'h', text: 'Dos planos: quién decide y quién ejecuta' },
    {
      t: 'p',
      md: 'CompTIA describe Zero Trust siguiendo la arquitectura de NIST SP 800-207 y la divide en dos planos. El **control plane** es donde se *piensa*: se recogen señales, se evalúan políticas y se decide si una petición se autoriza. El **data plane** es donde *fluye el tráfico real*: el sujeto, la puerta que lo deja pasar o no, y el recurso. Como analista, te interesa recordar que la decisión y la aplicación de esa decisión viven en planos distintos.',
    },
    {
      t: 'list',
      items: [
        '**Adaptive identity** — la autenticación no es un sí/no fijo: se adapta al contexto (ubicación, salud del dispositivo, hora, comportamiento habitual). Un login desde un país nuevo a las 3 a.m. exige más pruebas que el mismo usuario desde la oficina.',
        '**Threat scope reduction** — reducir el radio de impacto (*blast radius*) de un compromiso: mínimo privilegio, micro-segmentación, accesos acotados en tiempo. Si roban una cuenta, que sirva para muy poco.',
        '**Policy-driven access control** — cada acceso se concede o deniega según políticas explícitas y centralizadas, no según la topología de red.',
        '**Policy engine** — el componente que **decide**: cruza la petición con las políticas y las señales (identidad, dispositivo, riesgo) y emite grant/deny.',
        '**Policy administrator** — el componente que **comunica y ejecuta la decisión**: establece o revoca la sesión, genera el token y ordena al enforcement point que abra o cierre la puerta. Engine y administrator actúan juntos como el **Policy Decision Point (PDP)**; ninguno toca el tráfico de la usuaria. En el data plane, en cambio, encontramos tres piezas.',
      ],
    },
    {
      t: 'list',
      items: [
        '**Subject/system** — quien pide acceso: la persona (subject) más el dispositivo o proceso desde el que lo pide (system). Zero Trust evalúa a los dos, no solo al usuario.',
        '**Implicit trust zones** — zonas pequeñas y bien delimitadas donde, una vez autorizada la petición, el tráfico circula hacia el recurso. Sustituyen a la «red interna de confianza» por islas mínimas.',
        '**Policy Enforcement Point (PEP)** — la puerta: recibe la petición, consulta al PDP y **aplica** la decisión. Es el único componente de control situado en el data plane, y el único punto por el que el tráfico llega al recurso.',
      ],
    },
    {
      t: 'table',
      headers: ['Componente', 'Plano', 'Rol en una palabra'],
      rows: [
        ['Adaptive identity', 'Control plane', 'Contextualiza la autenticación'],
        ['Threat scope reduction', 'Control plane', 'Acota el daño'],
        ['Policy-driven access control', 'Control plane', 'Gobierna por política'],
        ['Policy engine', 'Control plane (PDP)', 'Decide'],
        ['Policy administrator', 'Control plane (PDP)', 'Comunica y gestiona la sesión'],
        ['Subject/system', 'Data plane', 'Pide acceso'],
        ['Policy enforcement point', 'Data plane', 'Aplica la decisión'],
        ['Implicit trust zone', 'Data plane', 'Aloja el tráfico autorizado'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'In a Zero Trust architecture, which component is responsible for evaluating a request against policy and deciding whether access is granted?',
        choices: [
          'Policy enforcement point',
          'Policy administrator',
          'Policy engine',
          'Implicit trust zone',
        ],
        answer: 2,
        explain:
          'The policy engine makes the grant/deny decision. The policy administrator communicates that decision and manages the session; the PEP only enforces it in the data plane.',
      },
    },
    { t: 'h', text: 'El flujo de una petición' },
    {
      t: 'code',
      lang: 'text',
      title: 'Flujo Zero Trust (NIST SP 800-207 simplificado)',
      text: `        DATA PLANE                                CONTROL PLANE
 ┌───────────────────┐                     ┌──────────────────────────────┐
 │  SUBJECT / SYSTEM │                     │   POLICY DECISION POINT (PDP)│
 │  (usuaria + dispo)│                     │  ┌────────────────────────┐  │
 └─────────┬─────────┘                     │  │ Policy Engine          │  │
           │ 1. petición de acceso         │  │  · evalúa políticas     │  │
           ▼                               │  │  · señales: identidad,  │  │
 ┌───────────────────┐  2. consulta        │  │    dispositivo, riesgo  │  │
 │ POLICY ENFORCEMENT│ ───────────────────►│  │  · decide grant / deny  │  │
 │ POINT (PEP)       │                     │  └───────────┬────────────┘  │
 │  «la puerta»      │  4. orden: abrir /  │              │ 3. decisión    │
 │                   │ ◄───────────────────│  ┌───────────▼────────────┐  │
 └─────────┬─────────┘     cerrar sesión   │  │ Policy Administrator   │  │
           │ 5. tráfico autorizado         │  │  · crea / revoca sesión │  │
           ▼                               │  │  · emite el token       │  │
 ┌───────────────────┐                     │  │  · instruye al PEP      │  │
 │  RESOURCE         │   (implicit trust   │  └────────────────────────┘  │
 │  (app, datos)     │    zone mínima)     └──────────────────────────────┘
 └───────────────────┘`,
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Una petición, paso a paso',
      md: 'Marta, analista de finanzas, abre el ERP desde su portátil corporativo en una cafetería. **(1)** Su dispositivo (subject/system) envía la petición al **PEP**. **(2)** El PEP la reenvía al **PDP**. **(3)** El **policy engine** ve identidad correcta, MFA reciente, disco cifrado y EDR activo, pero ubicación inusual: por *adaptive identity* exige un segundo factor y, superado, decide *grant* con acceso de solo lectura (*threat scope reduction*). **(4)** El **policy administrator** emite un token de sesión de 30 minutos y ordena al PEP abrir. **(5)** El tráfico circula dentro de una **implicit trust zone** que solo contiene el ERP. Si el EDR reporta malware a los diez minutos, el administrator revoca la sesión y el PEP la corta.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen',
      md: 'Memoriza el trío en tres verbos: el **policy engine decide**, el **policy administrator comunica** (crea y revoca la sesión) y el **policy enforcement point aplica**. Engine + administrator = **PDP**, siempre en el control plane. El **PEP es el único componente de control del data plane**. Si la pregunta dice «which component makes the decision» la respuesta nunca es el PEP; si dice «which component sits between the subject and the resource» la respuesta es el PEP.',
    },
    {
      t: 'check',
      q: {
        q: 'Which Zero Trust component resides in the data plane?',
        choices: [
          'Policy engine',
          'Policy administrator',
          'Adaptive identity',
          'Policy enforcement point',
        ],
        answer: 3,
        explain:
          'The PEP sits in the data plane, between the subject and the resource, enforcing the PDP decision. Engine, administrator and adaptive identity are all control-plane functions.',
      },
    },
    {
      t: 'p',
      md: 'Dos matices que el examen explota. Primero, **adaptive identity** no significa «autenticación más fuerte» a secas: significa que la exigencia **cambia según el contexto** de cada petición, y puede relajarse o endurecerse. Segundo, **threat scope reduction** no es un producto: es el resultado de combinar mínimo privilegio, segmentación fina y sesiones cortas para que un compromiso valga poco. Y recuerda que Zero Trust es una **arquitectura**, no una caja que se compra: un proveedor puede vender un PEP o un PDP, pero la política, las señales y la segmentación las diseña tu organización.',
    },
    {
      t: 'check',
      q: {
        q: 'A user who normally signs in from headquarters attempts to log in from an unfamiliar country at 03:00. The system requires an additional authentication factor before granting access. Which Zero Trust concept does this BEST illustrate?',
        choices: [
          'Adaptive identity',
          'Implicit trust zone',
          'Policy enforcement point',
          'Threat scope reduction',
        ],
        answer: 0,
        explain:
          'Adaptive identity adjusts authentication requirements based on context such as location, time and device. Threat scope reduction limits what a compromised session can reach, but it is not what changes the login requirement.',
      },
    },
    {
      t: 'p',
      md: 'Zero Trust decide quién entra en cada recurso lógico, pero un atacante con acceso físico al armario de servidores o al despacho de la CFO se salta el PEP por completo. Por eso la siguiente lección baja al mundo físico: **bollards**, **vestíbulos de control de acceso**, **sensores** y, para atrapar a quien ya se coló, las **tecnologías de engaño**.',
    },
  ],
  quiz: [
    {
      id: 'sp1m3q1',
      domain: 'General Security Concepts',
      prompt:
        'A company is redesigning its network so that no user or device is trusted by default, even when connected to the corporate LAN. Which security concept BEST describes this approach?',
      choices: [
        'Defense in depth',
        'Perimeter-based security',
        'Zero Trust',
        'Network address translation',
      ],
      answer: 2,
      explain:
        'Zero Trust removes implicit trust based on network location and verifies every request explicitly. Defense in depth layers controls but does not by itself remove the trusted-internal-network assumption, and perimeter security is exactly the model being replaced.',
    },
    {
      id: 'sp1m3q2',
      domain: 'General Security Concepts',
      prompt:
        'In a Zero Trust architecture, which two components together form the Policy Decision Point?',
      choices: [
        'Policy engine and policy administrator',
        'Policy engine and policy enforcement point',
        'Policy administrator and policy enforcement point',
        'Subject/system and implicit trust zone',
      ],
      answer: 0,
      explain:
        'The PDP is the control-plane pair: the policy engine decides and the policy administrator communicates the decision and manages sessions. The PEP is a separate data-plane component that enforces the decision, so any option including it is wrong.',
    },
    {
      id: 'sp1m3q3',
      domain: 'General Security Concepts',
      prompt:
        'After the policy engine approves a request, a session token must be issued and the gateway instructed to allow traffic to the resource. Which component performs this task?',
      choices: [
        'Policy enforcement point',
        'Subject/system',
        'Threat scope reduction',
        'Policy administrator',
      ],
      answer: 3,
      explain:
        'The policy administrator establishes and terminates sessions and tells the PEP what to do. The PEP is tempting because it ultimately opens the path, but it does not issue tokens; it only enforces what the administrator communicates.',
    },
    {
      id: 'sp1m3q4',
      domain: 'General Security Concepts',
      prompt:
        'A security architect wants to ensure that if an attacker compromises one account, the damage is limited to a small set of resources. Which Zero Trust principle is the architect applying?',
      choices: [
        'Adaptive identity',
        'Threat scope reduction',
        'Policy-driven access control',
        'Implicit trust zone',
      ],
      answer: 1,
      explain:
        'Threat scope reduction limits the blast radius of a compromise through least privilege and micro-segmentation. Implicit trust zones are the small areas where authorized traffic flows, but they are a data-plane structure, not the design principle that minimizes damage.',
    },
    {
      id: 'sp1m3q5',
      domain: 'General Security Concepts',
      prompt:
        'Which of the following BEST describes the role of the policy enforcement point in a Zero Trust design?',
      choices: [
        'It evaluates contextual signals and decides whether a request should be allowed',
        'It stores the access policies used by the policy engine',
        'It sits between the subject and the resource and allows or blocks traffic according to the PDP decision',
        'It defines the boundaries of each implicit trust zone',
      ],
      answer: 2,
      explain:
        'The PEP is the gateway in the data plane that enforces the decision made elsewhere. Evaluating signals and deciding is the job of the policy engine, which is why the first option is the classic distractor.',
    },
    {
      id: 'sp1m3q6',
      domain: 'General Security Concepts',
      prompt:
        'Under Zero Trust, a request to access a file server is evaluated. Which of the following is MOST likely to be considered part of the subject/system?',
      choices: [
        'The user account together with the laptop from which the request originates',
        'The gateway that forwards the request to the policy engine',
        'The set of rules that determine whether access is granted',
        'The segment of the network where the file server resides',
      ],
      answer: 0,
      explain:
        'The subject/system is the requesting entity: the person plus the device or process making the request, both of which Zero Trust evaluates. The gateway is the PEP, the rules are the policy, and the network segment is the implicit trust zone.',
    },
  ],
};

// ---------------------------------------------------------------------------
// sp1m4 — Seguridad física y tecnologías de engaño (SY0-701, objetivo 1.2)
// ---------------------------------------------------------------------------
const sp1m4: Module = {
  id: 'sp1m4',
  sectionId: 'sp1',
  title: 'Seguridad física y tecnologías de engaño',
  minutes: 12,
  objectives: [
    'Reconocer los controles físicos del objetivo 1.2 y el problema que resuelve cada uno',
    'Explicar cómo un access control vestibule frena el tailgating',
    'Distinguir los sensores infrared, pressure, microwave y ultrasonic y su mejor uso',
    'Diferenciar honeypot, honeynet, honeyfile y honeytoken',
    'Elegir la tecnología de engaño adecuada según el activo que se quiere proteger',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Toda la criptografía y todo el Zero Trust del mundo caen si alguien puede entrar al CPD con una furgoneta, arrancar un disco y salir. La **physical security** es la capa que protege personas, instalaciones y hardware frente a acceso no autorizado, y CompTIA la examina con una lista concreta de controles. Conviene aprenderlos no como nombres sueltos sino por la **pregunta que responde cada uno**: ¿qué amenaza detiene, y es preventivo, disuasorio o detectivo?',
    },
    { t: 'h', text: 'Barreras, puertas y personas' },
    {
      t: 'list',
      items: [
        '**Bollards** — postes o bloques fijos (a veces retráctiles) que impiden que un **vehículo** embista una entrada o aparque pegado a un edificio. Preventivo frente a ataques con vehículo; no detienen a un peatón.',
        '**Fencing** — vallado perimetral: define el límite, retrasa al intruso y disuade. Su eficacia depende de altura, material y de que esté vigilado; una valla sola solo compra tiempo.',
        '**Lighting** — iluminación de perímetros y accesos: disuade (nadie quiere ser visto) y hace que cámaras y guardias funcionen. Se combina con sensores para encenderse al detectar movimiento.',
        '**Access control vestibule** — antes llamado *mantrap*: dos puertas enclavadas donde **solo una puede abrirse a la vez** y el espacio intermedio admite a una persona. Frena el **tailgating** (colarse detrás de alguien) y permite verificar identidad antes de abrir la segunda puerta.',
        '**Access badge** — tarjeta o credencial (RFID, NFC, smart card) que identifica a la persona y registra sus accesos. Es lo que el vestibule verifica; sin badge, la puerta no distingue empleadas de visitantes.',
        '**Security guard** — la única medida que **razona**: verifica identidades, escolta visitantes, responde a alarmas y detecta comportamientos raros que ningún sensor entiende. Cara, pero flexible; disuasoria, preventiva y detectiva a la vez.',
        '**Video surveillance** — CCTV: disuade cuando es visible y **detecta** al grabar. Los sistemas modernos añaden **motion recognition** (alerta al detectar movimiento) y **object detection** (distingue una persona de un animal o identifica un paquete abandonado).',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Tailgating vs. piggybacking',
      md: 'Ambos describen a alguien que entra tras una persona autorizada, pero el examen los separa por **consentimiento**: en el **tailgating** la empleada *no sabe* que la siguen; en el **piggybacking** la empleada *deja pasar* a la otra persona (le sostiene la puerta, «se le olvidó la tarjeta»). El control técnico contra ambos es el **access control vestibule**; el control humano es la formación y un **security guard**.',
    },
    {
      t: 'check',
      q: {
        q: 'An organization installs a small room with two interlocking doors at the data center entrance so that only one person can pass through at a time. What is the PRIMARY purpose of this control?',
        choices: [
          'Detect unauthorized vehicles approaching the building',
          'Prevent tailgating by allowing only one person to enter per authentication',
          'Record video evidence of everyone who enters',
          'Provide fire-safe egress in an emergency',
        ],
        answer: 1,
        explain:
          'An access control vestibule interlocks two doors so a second person cannot slip in behind an authorized one. Vehicles are the job of bollards and video evidence is the job of surveillance cameras.',
      },
    },
    { t: 'h', text: 'Sensores: cuatro físicas distintas' },
    {
      t: 'table',
      headers: ['Sensor', 'Qué detecta', 'Mejor para', 'Limitación típica'],
      rows: [
        [
          '**Infrared (IR / PIR)**',
          'Cambios de calor: el cuerpo de una persona frente al fondo',
          'Interiores y pasillos; detección de personas',
          'Falsas alarmas con calefacción, sol directo o animales; menos fiable si el intruso se mueve muy despacio',
        ],
        [
          '**Pressure**',
          'Peso sobre una superficie: alfombras, baldosas o suelo instrumentado',
          'Puntos de paso obligados, delante de una puerta o de un rack',
          'Solo cubre la superficie instrumentada; se puede esquivar si se conoce su ubicación',
        ],
        [
          '**Microwave**',
          'Movimiento mediante el reflejo de microondas emitidas (efecto Doppler)',
          'Áreas grandes, exteriores, naves; atraviesa paredes finas',
          'Puede «ver» a través de tabiques y disparar por movimiento fuera de la zona; más caro',
        ],
        [
          '**Ultrasonic**',
          'Movimiento mediante ondas de sonido de alta frecuencia y su eco',
          'Habitaciones pequeñas y cerradas',
          'Corto alcance; afectado por corrientes de aire y ruido; no atraviesa paredes',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Elegir sensor según el espacio',
      md: 'Los sensores detectan presencia o movimiento y disparan alarmas, luces o grabación; el examen no pide instalarlos, sino saber **qué fenómeno mide cada uno** y dónde rinde mejor. Un almacén de 2 000 m² con puertas de carga: **microwave**, que cubre grandes volúmenes. El pasillo de acceso a la sala de servidores: **infrared**, que distingue el calor de una persona. Justo delante de la puerta del rack de backups, donde nadie debería pisar fuera de horario: **pressure** bajo la alfombra. Un cuarto de telecomunicaciones de 6 m² sin ventanas: **ultrasonic**. Y en todos ellos, **lighting** que se enciende al disparar y **video surveillance** que confirma qué ha pasado.',
    },
    {
      t: 'check',
      q: {
        q: 'A security team wants to be alerted whenever someone stands directly in front of a locked server cabinet outside business hours, regardless of how slowly they move. Which sensor type is BEST suited?',
        choices: [
          'Microwave',
          'Ultrasonic',
          'Pressure',
          'Infrared',
        ],
        answer: 2,
        explain:
          'A pressure sensor under the floor or mat detects weight at that exact spot, independent of movement speed. Infrared is the tempting choice because it detects people, but it relies on thermal change and motion and covers an area rather than a precise position.',
      },
    },
    { t: 'h', text: 'Tecnologías de engaño y disrupción' },
    {
      t: 'p',
      md: 'Los controles anteriores intentan que el intruso no entre. Las **deception and disruption technologies** asumen que alguien ya ha entrado (o que hay una insider) y le ponen delante **cebos que ningún usuario legítimo tocaría**. Cualquier interacción con un cebo es, por definición, sospechosa: eso las convierte en detectores con una tasa de falsos positivos bajísima, y además hacen perder tiempo al atacante mientras el equipo de defensa observa sus técnicas.',
    },
    {
      t: 'table',
      headers: ['Tecnología', 'Qué es', 'Qué detecta o consigue'],
      rows: [
        [
          '**Honeypot**',
          'Un sistema señuelo (servidor, servicio, dispositivo) que parece real y vulnerable pero no contiene nada valioso',
          'Escaneos, intentos de explotación y movimiento lateral; permite estudiar herramientas y TTPs del atacante sin exponer producción',
        ],
        [
          '**Honeynet**',
          'Una red completa de honeypots que simula un segmento o una organización entera',
          'Campañas y comportamiento a lo largo de varios sistemas; distrae al atacante de la red real durante más tiempo',
        ],
        [
          '**Honeyfile**',
          'Un fichero cebo con nombre irresistible («passwords.xlsx», «salaries_2026.docx») que se monitoriza',
          'Quién abre, copia o exfiltra lo que no debería: ideal contra insiders y ransomware que recorre carpetas',
        ],
        [
          '**Honeytoken**',
          'Un dato falso pero verosímil: una credencial, una API key, un registro de base de datos o una dirección de correo que nunca se usa legítimamente',
          'Su **uso** en cualquier lugar (login, llamada a la API, aparición en un dump) prueba que la fuente fue comprometida',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen',
      md: 'Si la pregunta busca «detect an attacker or insider **without risking real assets**» o «study attacker techniques», la respuesta está en la familia **honey** (honeypot, honeynet, honeyfile, honeytoken). Para elegir cuál: **sistema** aislado → honeypot; **varios sistemas / red** → honeynet; **documento** → honeyfile; **dato o credencial** (un registro en una base de datos, una API key, un usuario falso) → honeytoken. Pregunta clásica: «which would BEST detect unauthorized access to a customer **database**?» → un **honeytoken** insertado como registro falso, porque su aparición fuera de la base de datos delata la fuga.',
    },
    {
      t: 'check',
      q: {
        q: 'A company inserts a fake customer record with a unique email address into its CRM database. Weeks later, that address starts receiving spam. Which deception technology was used?',
        choices: [
          'Honeypot',
          'Honeynet',
          'Honeyfile',
          'Honeytoken',
        ],
        answer: 3,
        explain:
          'A honeytoken is a fake data element whose use reveals a compromise; here the unique record proves the database was exfiltrated. A honeyfile is a bait document, not a record inside a database.',
      },
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Un señuelo mal aislado es una puerta real',
      md: 'Un **honeypot** debe estar **segmentado** del entorno de producción y monitorizado de cerca: si el atacante lo compromete y desde él llega a sistemas reales, has fabricado tu propio punto de entrada. Y los cebos tienen que ser creíbles pero **nunca contener datos reales**: un honeyfile con contraseñas verdaderas ya no es un cebo, es una fuga esperando a ocurrir.',
    },
    {
      t: 'p',
      md: 'Con los controles físicos y los señuelos cierras la parte «defensiva» del objetivo 1.2. Pero cada bollard nuevo, cada regla de firewall y cada honeypot es un **cambio** en el entorno, y los cambios sin proceso son la fuente número uno de incidentes autoinfligidos. La siguiente lección trata precisamente eso: **change management**, con su aprobación, su análisis de impacto y su **backout plan**.',
    },
  ],
  quiz: [
    {
      id: 'sp1m4q1',
      domain: 'General Security Concepts',
      prompt:
        'A facilities manager is concerned that a vehicle could be driven through the glass front entrance of the headquarters. Which physical control would BEST mitigate this risk?',
      choices: [
        'Access control vestibule',
        'Bollards',
        'Video surveillance',
        'Infrared sensors',
      ],
      answer: 1,
      explain:
        'Bollards are fixed barriers designed specifically to stop vehicles from reaching a building. A vestibule controls pedestrian flow, and cameras or sensors would only record or detect the impact rather than prevent it.',
    },
    {
      id: 'sp1m4q2',
      domain: 'General Security Concepts',
      prompt:
        'During an audit, several employees admit they regularly hold the door open for colleagues who forgot their badges. Which control MOST directly prevents this behavior from granting unauthorized access?',
      choices: [
        'Additional perimeter fencing',
        'Brighter exterior lighting',
        'Microwave motion sensors in the lobby',
        'An access control vestibule',
      ],
      answer: 3,
      explain:
        'This is piggybacking, and a vestibule with interlocking doors forces one authenticated person through at a time regardless of goodwill. Fencing and lighting address the outer perimeter, and motion sensors would alarm on legitimate traffic in a busy lobby.',
    },
    {
      id: 'sp1m4q3',
      domain: 'General Security Concepts',
      prompt:
        'A large open warehouse with thin partition walls needs motion detection covering the entire floor with as few devices as possible. Which sensor type is the BEST choice?',
      choices: [
        'Microwave',
        'Ultrasonic',
        'Pressure',
        'Infrared',
      ],
      answer: 0,
      explain:
        'Microwave sensors cover large volumes and are not stopped by thin walls, so few units are needed. Ultrasonic sensors are limited to small enclosed rooms, and pressure sensors only cover the surface where they are installed.',
    },
    {
      id: 'sp1m4q4',
      domain: 'General Security Concepts',
      prompt:
        'Which of the following BEST explains why a security guard is retained at a facility that already has badge readers, cameras and sensors?',
      choices: [
        'Guards are less expensive than maintaining electronic systems',
        'Cameras cannot record without a guard present',
        'A guard can verify identities, escort visitors and respond to situations that automated controls cannot interpret',
        'Sensors are legally required to be supervised by a person',
      ],
      answer: 2,
      explain:
        'Guards provide judgment: they challenge suspicious behavior, verify identity and respond in real time, which no sensor can do. Guards are typically the most expensive control, so cost is the wrong reason.',
    },
    {
      id: 'sp1m4q5',
      domain: 'General Security Concepts',
      prompt:
        'A security team wants to observe the tools and techniques of attackers targeting the organization without exposing any production system. Which of the following should they deploy?',
      choices: [
        'A honeyfile on the CFO\'s workstation',
        'A honeypot in an isolated network segment',
        'Ultrasonic sensors in the server room',
        'An access badge audit log',
      ],
      answer: 1,
      explain:
        'A honeypot is a decoy system built to be attacked so defenders can study techniques safely, and isolation keeps it from becoming a pivot into production. A honeyfile only reveals that someone opened a document; it does not capture attacker tooling.',
    },
    {
      id: 'sp1m4q6',
      domain: 'General Security Concepts',
      prompt:
        'An administrator places a document named "Q4_layoffs_confidential.docx" in a shared folder and configures alerts on any access to it. Which deception technology is this?',
      choices: [
        'Honeynet',
        'Honeytoken',
        'Honeypot',
        'Honeyfile',
      ],
      answer: 3,
      explain:
        'A honeyfile is a bait document whose access triggers an alert, useful for catching insiders and malware that enumerates shares. A honeytoken is a fake data element such as a credential or database record, not a monitored file.',
    },
    {
      id: 'sp1m4q7',
      domain: 'General Security Concepts',
      prompt:
        'A developer embeds an unused but valid-looking API key in a public code repository and monitors for any attempt to use it. What is the MOST likely goal of this action?',
      choices: [
        'Detect when the key is harvested and used, indicating that someone is scraping the repository for secrets',
        'Provide a backup credential in case the primary key is revoked',
        'Simulate an entire cloud environment for attackers to explore',
        'Prevent tailgating into the development office',
      ],
      answer: 0,
      explain:
        'This is a honeytoken: the key has no legitimate use, so any attempt to use it proves it was harvested. Simulating an entire environment describes a honeynet, which is a much larger deception than a single planted credential.',
    },
  ],
};

export const SP1_PART2: Module[] = [sp1m3, sp1m4];
