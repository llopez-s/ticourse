import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP2M3 — Ingeniería social (SY0-701, objetivo 2.2, vectores humanos)
// ---------------------------------------------------------------------------
const sp2m3: Module = {
  id: 'sp2m3',
  sectionId: 'sp2',
  title: 'Ingeniería social',
  minutes: 13,
  objectives: [
    'Reconocer las variantes de phishing por canal: phishing, vishing, smishing, spear phishing y whaling',
    'Explicar cómo funciona un business email compromise y qué controles lo detienen de verdad',
    'Diferenciar pretexting, impersonation, brand impersonation, typosquatting y watering hole a partir de un escenario',
    'Distinguir misinformation de disinformation por la intención de quien la difunde',
    'Identificar el principio psicológico (authority, urgency, scarcity, familiarity, trust, intimidation, consensus) que explota un mensaje',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior repasó los vectores técnicos: puertos abiertos, credenciales por defecto, software sin soporte. Esta se centra en el vector que ningún parche corrige: **la persona**. La **social engineering** es la manipulación psicológica de alguien con acceso legítimo para que haga algo que beneficia al atacante —hacer clic, revelar una contraseña, aprobar una transferencia, abrir una puerta—. En la Autoridad Portuaria de Halden, como en cualquier organización, la mayoría de los incidentes graves empiezan con un mensaje bien escrito, no con un exploit brillante. Como analista, tu trabajo es reconocer la técnica por el canal y el gancho, y proponer el control que rompe el engaño.',
    },
    { t: 'h', text: 'La familia phishing: el mismo engaño por distintos canales' },
    {
      t: 'table',
      headers: ['Técnica', 'Canal', 'Señal delatora', 'Control principal'],
      rows: [
        [
          'Phishing',
          'Correo masivo',
          'Remitente genérico, enlace a dominio raro, urgencia artificial, errores sutiles',
          'Awareness training, filtrado de correo, MFA para que la credencial robada no baste',
        ],
        [
          'Spear phishing',
          'Correo dirigido a una persona o equipo',
          'Menciona proyectos, nombres o proveedores reales; parece interno',
          'Training específico por rol, verificación de peticiones inusuales',
        ],
        [
          'Whaling',
          'Correo dirigido a directivos («peces grandes»)',
          'Va al CEO, CFO o consejo; suele hablar de contratos, demandas o pagos',
          'Protección reforzada de cuentas ejecutivas, doble aprobación de pagos',
        ],
        [
          'Vishing',
          'Llamada de voz',
          'Quien llama pide datos o un código MFA «para verificar»; presiona en tiempo real',
          'Política de devolver la llamada a un número conocido (callback verification)',
        ],
        [
          'Smishing',
          'SMS o mensajería',
          'Enlace acortado, «tu paquete está retenido», «tu cuenta bancaria ha sido bloqueada»',
          'No seguir enlaces de SMS; acceder tecleando la URL oficial',
        ],
        [
          'Business email compromise',
          'Correo del buzón real o suplantado de un directivo',
          'Petición de transferencia o cambio de cuenta bancaria, confidencial y urgente',
          'Verificación fuera de banda + dual approval; DMARC/SPF/DKIM contra el spoofing',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A logistics coordinator at a port authority receives a text message stating that a customs package is on hold and must be released by tapping a shortened link within two hours. Which attack does this BEST describe?',
        choices: ['Vishing', 'Whaling', 'Smishing', 'Watering hole'],
        answer: 2,
        explain:
          'The lure arrives by SMS, which makes it smishing regardless of the story it tells. Vishing would require a voice call, and whaling targets executives by email; the delivery channel is the discriminator the exam expects you to use.',
      },
    },
    { t: 'h', text: 'Los principios que hacen que el engaño funcione' },
    {
      t: 'list',
      items: [
        '**Authority** — el mensaje parece venir de alguien a quien se obedece: la dirección, la policía portuaria, la agencia tributaria.',
        '**Urgency** — hay que actuar ahora: «el barco no zarpa si no apruebas esto antes de las 14:00».',
        '**Scarcity** — la oportunidad se acaba: «quedan dos plazas», «la oferta caduca hoy».',
        '**Familiarity** — el atacante se muestra cercano y simpático, o cita detalles personales para parecer conocido.',
        '**Trust** — se apoya en una relación ya existente: un proveedor habitual, una compañera, la marca del banco.',
        '**Intimidation** — amenaza con consecuencias: sanción, despido, denuncia, publicar datos.',
        '**Consensus / social proof** — «todos tus compañeros ya lo han hecho», reseñas falsas, cadenas reenviadas.',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Cómo identificar el principio en un escenario',
      md: 'El examen suele describir el mensaje y preguntar **qué principio** explota. Busca la frase que hace el trabajo psicológico: si nombra un cargo o una institución que manda → *authority*; si pone un reloj → *urgency*; si habla de cantidades limitadas → *scarcity*; si amenaza → *intimidation*; si apela a que «los demás ya lo hicieron» → *consensus*. Un mismo correo puede combinar varios, pero la pregunta apunta al que domina la frase citada.',
    },
    { t: 'h', text: 'BEC y pretexting: el ataque que no necesita malware' },
    {
      t: 'p',
      md: 'El **business email compromise (BEC)** es el fraude por ingeniería social que más dinero mueve. El atacante escribe desde el buzón **real comprometido** de un directivo, o desde un dominio suplantado casi idéntico, y pide a finanzas una transferencia urgente, un cambio de cuenta bancaria de un proveedor o el envío de datos de nómina. No hay adjunto malicioso ni enlace: el antivirus no ve nada porque no hay nada técnico que ver. El BEC casi siempre se apoya en un **pretexting**: una historia inventada pero verosímil que justifica la petición y explica por qué no se puede seguir el procedimiento normal («estoy en una reunión con el comprador y no puedo llamar», «la auditoría exige que esto sea confidencial»). El pretexto también funciona solo, sin correo: alguien que llama diciendo ser del proveedor de grúas y necesita «confirmar» las credenciales del portal de mantenimiento está haciendo pretexting por voz.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: cómo se detiene un BEC',
      md: 'Cuando la pregunta dice «el CFO pidió por correo una transferencia urgente y se envió el dinero», la respuesta correcta a «¿qué control lo habría evitado?» es siempre **procedimental**: **verificación fuera de banda** (llamar al directivo a un número ya conocido, nunca al que aparece en el correo) y **dual approval** para pagos o cambios de cuenta bancaria. Las opciones «más antivirus», «un firewall mejor» o «cifrar el correo» son distractores: el ataque no contiene código y el mensaje puede ser técnicamente legítimo si el buzón está comprometido. **DMARC, SPF y DKIM** ayudan contra el *spoofing* del dominio, pero no contra un buzón real secuestrado.',
    },
    {
      t: 'check',
      q: {
        q: 'The finance clerk at a port authority receives an email from the CFO\'s actual mailbox asking for an immediate wire to a new account for a crane supplier, marked confidential because of an ongoing negotiation. Which attack is MOST likely occurring?',
        choices: [
          'Whaling',
          'Business email compromise',
          'Watering hole',
          'Typosquatting',
        ],
        answer: 1,
        explain:
          'A trusted executive mailbox requesting an urgent, confidential payment to a new account is the signature of business email compromise. Whaling is the tempting distractor, but whaling is an attack against the executive; here the executive\'s identity is the weapon aimed at the finance clerk.',
      },
    },
    { t: 'h', text: 'Impersonation, marcas falsas, dominios parecidos y sitios envenenados' },
    {
      t: 'p',
      md: 'La **impersonation** es hacerse pasar por una persona o un rol concreto —el técnico de mantenimiento, la nueva auditora, el repartidor— para obtener acceso o información; puede ser presencial, por teléfono o por correo. La **brand impersonation** suplanta a una **organización** en lugar de a una persona: el correo, la web o el SMS copian los logos y el tono de un banco, de la naviera o de la propia Autoridad Portuaria. El **typosquatting** es la herramienta técnica que sostiene muchas de estas suplantaciones: el atacante registra un dominio que se parece al legítimo (una letra cambiada, un guion añadido, «.co» en lugar de «.com») para alojar una página de login falsa o para enviar correos que pasan una lectura rápida. Por último, el **watering hole** invierte la lógica: en vez de ir a por la víctima, el atacante compromete un **sitio que la víctima ya visita** —el portal de la asociación de operadores portuarios, el foro del software de aduanas— y espera a que el grupo objetivo llegue por sí solo.',
    },
    {
      t: 'check',
      q: {
        q: 'Employees receive an email inviting them to "re-validate" their webmail password. The link opens a page that looks identical to the corporate login, hosted at haldenp0rt-mail.com instead of the real domain. Which TWO techniques are combined here?',
        choices: [
          'Vishing and pretexting',
          'Watering hole and whaling',
          'Phishing and typosquatting',
          'Smishing and brand impersonation',
        ],
        answer: 2,
        explain:
          'The lure is a mass email asking for credentials (phishing) and the fake page lives on a look-alike domain with a character swapped (typosquatting). Watering hole is wrong because the attacker built a new fake site rather than compromising one the staff already visit.',
      },
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Misinformation no es disinformation',
      md: 'Ambas son información falsa, pero se distinguen por la **intención de quien la difunde**. **Misinformation** es falsa y se comparte **sin saberlo**: la empleada que reenvía un aviso de «corte de red mañana» que resultó ser un bulo. **Disinformation** es falsa y se difunde **deliberadamente** para engañar: la campaña que publica que el puerto ha sufrido una fuga de datos para hundir su reputación o para preparar un fraude. Si el escenario dice «creyendo que era cierto», es misinformation; si dice «con el fin de» o describe una campaña coordinada, es disinformation.',
    },
    {
      t: 'p',
      md: 'Con los vectores técnicos y los humanos ya en tu radar, sabes por dónde entra un atacante. La siguiente lección cambia de pregunta: una vez dentro, **qué debilidad explota**. Empezamos con las vulnerabilidades de aplicación, web, sistema operativo y hardware, y con el caso especial en el que nadie tiene todavía el parche: el **zero-day**.',
    },
  ],
  quiz: [
    {
      id: 'sp2m3q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A payroll assistant receives an email that appears to come from the port authority\'s managing director, who is "traveling and unreachable by phone", asking for an urgent transfer to a new supplier account. The sending domain differs from the real one by a single character. Which attack is being attempted?',
      choices: [
        'Watering hole',
        'Smishing',
        'Business email compromise',
        'Disinformation',
      ],
      answer: 2,
      explain:
        'An executive identity used to pressure finance into a payment to a new account is business email compromise, here supported by a look-alike domain. Smishing is wrong because the channel is email, and a watering hole would involve a compromised website rather than a direct request.',
    },
    {
      id: 'sp2m3q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An employee gets a phone call from someone claiming to be the IT help desk. The caller says a security incident is in progress and asks the employee to read back the six-digit code that just arrived on her phone. Which technique is being used?',
      choices: ['Vishing', 'Whaling', 'Typosquatting', 'Watering hole'],
      answer: 0,
      explain:
        'Social engineering delivered over a voice call is vishing, and harvesting an MFA code in real time is one of its most common goals. Whaling is a tempting distractor because the request is urgent, but whaling specifically targets executives and is delivered by email.',
    },
    {
      id: 'sp2m3q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Threat researchers discover that the website of a regional shipping-operators association was modified to serve an exploit kit. Analysis shows the attacker chose the site because most port logistics staff visit it weekly. Which attack does this describe?',
      choices: ['Spear phishing', 'Brand impersonation', 'Pretexting', 'Watering hole'],
      answer: 3,
      explain:
        'Compromising a legitimate site that the target group already frequents, and waiting for them to arrive, is the definition of a watering hole attack. Brand impersonation is the tempting distractor, but the attacker did not create a fake copy; they poisoned the real site.',
    },
    {
      id: 'sp2m3q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A phishing email states: "Over 90% of your department has already completed the new compliance form; you are one of the last three pending." Which social engineering principle is the message PRIMARILY exploiting?',
      choices: ['Intimidation', 'Consensus', 'Scarcity', 'Authority'],
      answer: 1,
      explain:
        'Claiming that nearly everyone else has already acted is social proof, which the exam labels consensus. Scarcity is the tempting distractor because of the "last three" wording, but scarcity concerns a limited supply of something desirable, not pressure to conform to what peers did.',
    },
    {
      id: 'sp2m3q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'After a fraudulent transfer caused by a spoofed executive email, the CISO must recommend the control that would MOST effectively prevent a repeat. Which option is BEST?',
      choices: [
        'Require out-of-band verification and dual approval for any payment or bank-account change',
        'Deploy a next-generation antivirus on all finance workstations',
        'Encrypt all outbound email with S/MIME',
        'Increase the password length requirement for finance staff',
      ],
      answer: 0,
      explain:
        'BEC contains no malicious code, so the effective defense is procedural: confirm the request through a known channel and require a second approver. Antivirus is the tempting distractor because it sounds like a security upgrade, but there is no malware for it to detect in a plain-text payment request.',
    },
    {
      id: 'sp2m3q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A crane operator shares a social media post claiming that the port authority\'s badge system was hacked, sincerely believing it to be true. The claim is false. How should this activity be classified?',
      choices: ['Disinformation', 'Pretexting', 'Misinformation', 'Impersonation'],
      answer: 2,
      explain:
        'False information spread by someone who believes it is true is misinformation. Disinformation is the tempting distractor, but it requires deliberate intent to deceive, which the scenario explicitly rules out.',
    },
    {
      id: 'sp2m3q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A security analyst finds that someone registered the domain ha1denport.com, which mirrors the port authority\'s real domain with the letter L replaced by the digit 1, and is hosting a copy of the staff portal login page on it. Which technique does the domain registration represent?',
      choices: ['Vishing', 'Typosquatting', 'Watering hole', 'Misinformation'],
      answer: 1,
      explain:
        'Registering a look-alike domain that exploits a visual or typing confusion is typosquatting. Watering hole is wrong because no legitimate site was compromised; the attacker built a new fake one under a deceptive name.',
    },
    {
      id: 'sp2m3q8',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A carefully written email references a real pending lawsuit and asks the port authority\'s chief financial officer to open a "court filing" attachment. Only the CFO received it. Which term BEST describes this attack?',
      choices: ['Smishing', 'Watering hole', 'Brand impersonation', 'Whaling'],
      answer: 3,
      explain:
        'A highly targeted phishing message aimed at a senior executive is whaling. Spear phishing would be the generic label for any targeted phishing, but when the exam highlights that the recipient is a top executive, whaling is the more precise and therefore best answer.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP2M4 — Vulnerabilidades I: aplicaciones, web, SO, hardware y zero-day (2.3)
// ---------------------------------------------------------------------------
const sp2m4: Module = {
  id: 'sp2m4',
  sectionId: 'sp2',
  title: 'Vulnerabilidades I: aplicaciones, web, sistema operativo, hardware y zero-day',
  minutes: 13,
  objectives: [
    'Explicar las vulnerabilidades de aplicación: memory injection, buffer overflow, race condition (TOC/TOU) y malicious update',
    'Describir SQL injection y cross-site scripting (reflected y stored) y nombrar la defensa de cada una',
    'Reconocer las vulnerabilidades del sistema operativo y del hardware: firmware, legacy y end-of-life',
    'Definir zero-day y enumerar las mitigaciones disponibles cuando todavía no existe parche',
    'Asociar cada vulnerabilidad a su causa raíz y a su corrección principal',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Una **vulnerability** es una debilidad en un sistema, un código o un proceso que un atacante puede aprovechar; la **threat** es quien la aprovecha y el **exploit** es el código o la técnica concreta que lo hace. El objetivo 2.3 te pide reconocer la vulnerabilidad por su síntoma y saber cuál es la corrección principal. En esta primera parte recorremos las que viven en el software que la Autoridad Portuaria escribe o compra —aplicaciones, web, sistema operativo, firmware— y terminamos con el caso en el que la debilidad existe pero nadie tiene aún el parche.',
    },
    { t: 'h', text: 'Vulnerabilidades de aplicación: memoria, tiempo y confianza' },
    {
      t: 'list',
      items: [
        '**Memory injection** — el atacante consigue introducir su propio código en el espacio de memoria de un proceso legítimo y hacer que lo ejecute (por ejemplo, inyectando una DLL en un proceso de confianza para esquivar controles). La causa es que el proceso no valida qué se carga en su memoria.',
        '**Buffer overflow** — el programa reserva un espacio fijo (un buffer) para una entrada y no comprueba su longitud; una entrada mayor sobrescribe la memoria adyacente, incluyendo direcciones de retorno, y permite redirigir la ejecución. Corrección: **input validation** con comprobación de límites y lenguajes o compiladores con protecciones de memoria.',
        '**Race condition** — dos operaciones compiten por el mismo recurso y el resultado depende del orden en que llegan. El caso de examen es **time-of-check to time-of-use (TOC/TOU)**: el programa **comprueba** algo (¿tiene permiso este fichero?) y **lo usa** un instante después; si el atacante cambia el recurso entre ambos pasos, la comprobación ya no vale. Corrección: operaciones atómicas y bloqueo del recurso.',
        '**Malicious update** — el atacante envenena un mecanismo de actualización legítimo, de modo que el propio software instala la puerta trasera con la firma y los privilegios del fabricante. Corrección: verificar firmas e integridad de las actualizaciones y vigilar la cadena de suministro del proveedor.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A backup script on a port authority server verifies that a target file is owned by the backup account and then, a few milliseconds later, writes to it. An attacker replaces the file with a symbolic link to a system file in between, and the script overwrites it. Which vulnerability was exploited?',
        choices: [
          'Buffer overflow',
          'Time-of-check to time-of-use race condition',
          'Malicious update',
          'Memory injection',
        ],
        answer: 1,
        explain:
          'The permission check and the actual use happened at different moments, and the attacker changed the resource in the gap: that is a TOC/TOU race condition. Buffer overflow is unrelated because no input exceeded a memory boundary; the flaw is about timing, not size.',
      },
    },
    { t: 'h', text: 'Vulnerabilidades web: cuando el input se convierte en código' },
    {
      t: 'p',
      md: 'La **SQL injection (SQLi)** aparece cuando una aplicación construye una consulta a la base de datos **concatenando** texto que viene del usuario. Si el campo de login se pega directamente en la consulta, quien escribe en ese campo está escribiendo SQL. El resultado clásico es saltarse la autenticación, pero la misma debilidad permite leer tablas enteras, modificar registros o, según la configuración, ejecutar comandos en el servidor. La defensa correcta no es «filtrar comillas» sino cambiar la forma de construir la consulta.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'SQLi: el payload y la corrección',
      text: `Consulta vulnerable (el input del usuario se pega dentro del SQL):
  SELECT * FROM users WHERE name = '<input>' AND pass = '<input>'

Payload introducido en el campo "name":
  ' OR 1=1 --

Consulta resultante que ejecuta la base de datos:
  SELECT * FROM users WHERE name = '' OR 1=1 --' AND pass = ''
  -> "1=1" siempre es verdadero y "--" comenta el resto: devuelve todos
     los usuarios y la aplicación deja entrar al atacante sin contraseña.

Corrección: parameterized queries (prepared statements).
  La consulta se envía a la base de datos con marcadores fijos
  (WHERE name = ? AND pass = ?) y el input viaja aparte, como DATO.
  El motor nunca interpreta el texto del usuario como código SQL,
  así que ' OR 1=1 -- se compara literalmente como un nombre y falla.
  Complementos: input validation (allow list) y least privilege en la
  cuenta de base de datos que usa la aplicación.`,
    },
    {
      t: 'p',
      md: 'El **cross-site scripting (XSS)** sigue la misma lógica pero el código inyectado es JavaScript y quien lo ejecuta es el **navegador de otra usuaria**, no el servidor. En el **reflected XSS** el script viaja en la URL o en un formulario y el servidor lo devuelve en la respuesta: la víctima tiene que hacer clic en un enlace preparado, así que suele combinarse con phishing. En el **stored XSS** el script queda **guardado** en el servidor —un comentario, un nombre de perfil, un ticket— y se ejecuta para **todas** las personas que visiten esa página, sin necesidad de engañar a nadie. Con ello el atacante roba cookies de sesión, suplanta acciones o redirige a páginas falsas. La defensa principal es el **output encoding** (el servidor convierte los caracteres especiales en texto inofensivo antes de mostrarlos), acompañada de input validation y de cabeceras como Content Security Policy.',
    },
    {
      t: 'check',
      q: {
        q: 'A user posts a message on the port authority\'s internal ticketing portal containing a script tag. Every employee who later opens that ticket has their session cookie sent to an external server. Which vulnerability is present?',
        choices: ['Stored cross-site scripting', 'Reflected cross-site scripting', 'SQL injection', 'Buffer overflow'],
        answer: 0,
        explain:
          'The script was saved on the server and executes for every visitor, which is stored XSS. Reflected XSS is the tempting distractor, but it requires each victim to follow a crafted link; here the payload persists in the ticket itself.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: dos reflejos automáticos',
      md: 'Primero: ante cualquier pregunta de la familia **injection** (SQLi, XSS, command injection, buffer overflow), si entre las opciones aparece **input validation** —o su versión específica, **parameterized queries** para SQLi y **output encoding** para XSS— esa es la respuesta; «un firewall», «cifrar la base de datos» o «contraseñas más largas» no impiden que el input se interprete como código. Segundo: cuando el escenario describe «se comprueba una condición y luego se actúa, y algo cambió entre medias», el término es **race condition**, y el nombre técnico que el examen quiere ver es **TOC/TOU**.',
    },
    { t: 'h', text: 'Sistema operativo y hardware: lo que no puedes reescribir' },
    {
      t: 'p',
      md: 'Las vulnerabilidades **OS-based** viven en el kernel, en los servicios del sistema o en su configuración: un servidor sin parches, un servicio innecesario escuchando, permisos demasiado amplios. La corrección es aburrida y decisiva: **patch management** y **hardening** (que veremos en la última lección del dominio). Un escalón más abajo están las vulnerabilidades de **hardware**. El **firmware** es el software grabado en el propio dispositivo —BIOS/UEFI, controladoras de red, lectores de tarjetas, PLC de las grúas— y suele actualizarse poco y tarde, por lo que un fallo ahí sobrevive a cualquier reinstalación del sistema operativo. Un sistema **legacy** sigue funcionando pero ya no encaja con los controles actuales: no soporta cifrado moderno, MFA o agentes de EDR. Y un producto **end-of-life (EOL)** ha dejado de recibir soporte del fabricante: las vulnerabilidades que se descubran a partir de ahora **nunca tendrán parche**. Ante EOL las opciones son sustituir, o aislar y compensar mientras se sustituye.',
    },
    {
      t: 'table',
      headers: ['Vulnerabilidad', 'Causa raíz', 'Corrección principal'],
      rows: [
        ['Buffer overflow', 'No se comprueba la longitud del input frente al tamaño del buffer', 'Input validation con bounds checking; protecciones de memoria'],
        ['Memory injection', 'El proceso no controla qué código se carga en su memoria', 'Protección de endpoint/EDR, integridad de código, parches'],
        ['Race condition / TOC/TOU', 'Comprobación y uso ocurren en momentos distintos', 'Operaciones atómicas, bloqueo del recurso'],
        ['Malicious update', 'Se confía en el actualizador sin verificar la integridad', 'Firmas y verificación de integridad; vigilancia de la cadena de suministro'],
        ['SQL injection', 'La consulta se construye concatenando input del usuario', 'Parameterized queries + input validation'],
        ['Cross-site scripting', 'El servidor devuelve input sin neutralizarlo', 'Output encoding + input validation, CSP'],
        ['OS sin parches / mal configurado', 'Gestión de parches y baseline inexistentes', 'Patch management, hardening, configuración base'],
        ['Firmware vulnerable', 'Firmware desactualizado o sin verificación de arranque', 'Firmware updates, secure boot, inventario de dispositivos'],
        ['Legacy / end-of-life', 'El fabricante ya no publica correcciones', 'Reemplazo; mientras tanto, aislamiento y compensating controls'],
      ],
    },
    {
      t: 'p',
      md: 'Queda el caso más incómodo. Un **zero-day** es una vulnerabilidad que el atacante conoce y explota **antes de que el fabricante la conozca o publique un parche**: el «día cero» es el tiempo que la defensa ha tenido para prepararse. No puedes parchear lo que no existe, así que la respuesta al zero-day es **defense in depth**: **segmentation** para que un host comprometido no alcance al resto, **EDR** que detecte el comportamiento anómalo aunque no reconozca el exploit, **application allow lists** que impidan ejecutar binarios no aprobados, principio de **least privilege** para limitar lo que el atacante gana, y monitorización intensiva mientras llega el parche. Cuando el fabricante publica la corrección, el zero-day deja de serlo y pasa a ser una vulnerabilidad más que se cierra con patch management.',
    },
    {
      t: 'check',
      q: {
        q: 'A vendor confirms that a flaw in its terminal-operating software is being actively exploited and that a fix will not be available for at least three weeks. Which action provides the BEST protection in the meantime?',
        choices: [
          'Wait for the patch and apply it immediately when released',
          'Disable antivirus to avoid false positives on the affected servers',
          'Segment the affected servers and restrict execution to approved applications',
          'Ask the vendor to sign a longer support contract',
        ],
        answer: 2,
        explain:
          'With no patch available, the exam expects layered mitigations such as segmentation, allow lists and monitoring to limit what an exploit can achieve. Simply waiting is the tempting distractor because patching is normally the right answer, but here the scenario explicitly says the patch does not yet exist.',
      },
    },
    {
      t: 'p',
      md: 'Ya sabes leer una vulnerabilidad por su causa raíz y elegir la corrección que la cierra. La siguiente lección completa el objetivo 2.3 con las debilidades que aparecen cuando el código ya no corre en tu servidor: **virtualización**, **cloud**, **supply chain**, **criptografía débil**, **misconfiguration** y dispositivos **móviles**.',
    },
  ],
  quiz: [
    {
      id: 'sp2m4q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A crane-scheduling application crashes whenever a container ID longer than 256 characters is submitted. A researcher then shows that a specially crafted long ID makes the application execute arbitrary instructions. Which vulnerability is being exploited?',
      choices: ['SQL injection', 'Buffer overflow', 'Race condition', 'Malicious update'],
      answer: 1,
      explain:
        'Input that exceeds a fixed-size buffer and overwrites adjacent memory until execution can be redirected is a buffer overflow. SQL injection is the tempting distractor because both involve malicious input, but SQLi targets a database query rather than the memory layout of the process.',
    },
    {
      id: 'sp2m4q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'During a security review, an analyst enters the string \' OR 1=1 -- into the username field of a vessel-tracking portal and is logged in without a valid password. Which remediation would MOST effectively fix the underlying flaw?',
      choices: [
        'Enforce a stronger password policy for portal users',
        'Enable full-disk encryption on the database server',
        'Place a network firewall in front of the web server',
        'Rewrite the login code to use parameterized queries',
      ],
      answer: 3,
      explain:
        'The flaw is that user input is concatenated into a SQL statement, and parameterized queries make the database treat that input strictly as data. Encryption at rest and firewalls are tempting because they sound protective, but neither stops the application itself from building a malicious query.',
    },
    {
      id: 'sp2m4q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An attacker submits a comment containing JavaScript on a public port-services forum. The comment is saved, and every visitor who views the thread has their browser silently send authentication cookies to the attacker. Which type of vulnerability does this represent?',
      choices: ['Stored cross-site scripting', 'Reflected cross-site scripting', 'Memory injection', 'Time-of-check to time-of-use'],
      answer: 0,
      explain:
        'The malicious script persists on the server and runs for everyone who loads the page, which defines stored XSS. Reflected XSS is the tempting distractor, but it would require each victim to click a crafted link carrying the script rather than simply visiting a normal page.',
    },
    {
      id: 'sp2m4q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A file-upload service checks whether a user is authorized to write to a directory and then performs the write a moment later. Testers demonstrate that swapping the directory for a link to a protected system path between the two steps lets them overwrite critical files. Which term BEST describes this weakness?',
      choices: ['Buffer overflow', 'Firmware vulnerability', 'Race condition', 'Cross-site scripting'],
      answer: 2,
      explain:
        'The check and the use are separated in time, and the attacker changes the state in between: this is a race condition of the TOC/TOU variety. Buffer overflow is a tempting choice because both lead to unauthorized writes, but no input size limit is involved here; the problem is sequencing.',
    },
    {
      id: 'sp2m4q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'The vendor of the badge readers used at the port gates announces that the readers\' embedded operating system will receive no further security updates. Replacement is scheduled for next year. Which statement BEST describes the current risk and the appropriate short-term response?',
      choices: [
        'The devices are a zero-day risk; the vendor must be forced to release a patch',
        'The devices are end-of-life; isolate them on a dedicated segment and apply compensating controls until replaced',
        'The devices are legacy but fully supported; no action is needed until replacement',
        'The devices are vulnerable to SQL injection; deploy a web application firewall',
      ],
      answer: 1,
      explain:
        'A product that no longer receives vendor updates is end-of-life, and any new flaw will never be patched, so isolation plus compensating controls is the correct interim strategy. Zero-day is the tempting distractor, but that term refers to a specific unpatched flaw being exploited, not to a product losing support.',
    },
    {
      id: 'sp2m4q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Security researchers publish proof that a widely used remote-access tool is being exploited in the wild through a flaw the vendor was unaware of. No patch exists yet. Which term describes this vulnerability, and which mitigation is MOST appropriate right now?',
      choices: [
        'Legacy vulnerability; replace the tool with a newer product',
        'Misconfiguration; restore the default settings',
        'Firmware vulnerability; reflash the affected devices',
        'Zero-day; apply defense in depth such as segmentation, EDR and application allow lists',
      ],
      answer: 3,
      explain:
        'A flaw exploited before the vendor knows about it or can patch it is a zero-day, and the only available defense is layered controls that limit what the exploit can do. Replacing the product is the tempting distractor, but the tool is current and supported; its problem is a not-yet-fixed flaw, not obsolescence.',
    },
    {
      id: 'sp2m4q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Attackers gain access to the build server of a company that supplies the port authority\'s customs-declaration software. The next official update, digitally signed by the vendor, installs a backdoor on every customer that applies it. Which vulnerability type does this scenario illustrate?',
      choices: [
        'Malicious update',
        'Reflected cross-site scripting',
        'Buffer overflow',
        'Race condition',
      ],
      answer: 0,
      explain:
        'A legitimate, signed update mechanism turned into a delivery channel for malware is the malicious update vulnerability, a supply chain problem at the application level. The other options describe flaws in how an application handles input or timing, none of which involve a poisoned distribution channel.',
    },
  ],
};

export const SP2_PART2: Module[] = [sp2m3, sp2m4];
