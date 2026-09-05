import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP2M5 — Vulnerabilidades II: virtualización, cloud, supply chain,
// criptografía, misconfiguración y móviles (SY0-701, objetivo 2.3)
// ---------------------------------------------------------------------------
const sp2m5: Module = {
  id: 'sp2m5',
  sectionId: 'sp2',
  title:
    'Vulnerabilidades II: virtualización, cloud, supply chain, criptografía, misconfiguración y móviles',
  minutes: 13,
  objectives: [
    'Explicar VM escape y resource reuse como vulnerabilidades propias de la virtualización',
    'Identificar las vulnerabilidades cloud más frecuentes y aplicar el modelo de shared responsibility',
    'Distinguir los tres frentes de la supply chain: service provider, hardware provider y software provider',
    'Reconocer algoritmos y prácticas criptográficas débiles o deprecadas',
    'Detectar misconfiguration y los riesgos móviles de side loading y jailbreaking/rooting',
  ],
  blocks: [
    {
      t: 'p',
      md: 'En la lección anterior viste vulnerabilidades que viven *dentro* de una aplicación o de un sistema operativo. Esta segunda parte del objetivo 2.3 sube un nivel: las debilidades aparecen en la **capa que sostiene** los sistemas (el hypervisor, la nube), en **quién te los suministra** (la supply chain), en **cómo los proteges** (la criptografía), en **cómo los configuras** y en **qué llevan los usuarios en el bolsillo**. Como analista, tu ventaja en el examen es reconocer a qué familia pertenece cada escenario, porque la mitigación correcta depende de esa clasificación.',
    },
    { t: 'h', text: 'Virtualización: cuando el aislamiento falla' },
    {
      t: 'p',
      md: 'Un **hypervisor** promete que cada **virtual machine** está aislada de las demás y del host. Dos vulnerabilidades rompen esa promesa. El **VM escape** ocurre cuando código malicioso dentro de un guest explota un fallo del hypervisor para ejecutar instrucciones en el host o en otras VMs: es la pesadilla del multi-tenant, porque un cliente podría leer datos de otro. El **resource reuse** es más silencioso: cuando el hypervisor libera memoria o almacenamiento de una VM y lo asigna a otra sin limpiarlo, la nueva VM puede encontrar **restos de datos** (claves, fragmentos de bases de datos) que pertenecían a la anterior. La defensa combina parcheo riguroso del hypervisor, borrado seguro de recursos antes de reasignarlos y separación de cargas sensibles en hosts dedicados.',
    },
    {
      t: 'check',
      q: {
        q: 'A tenant in a public cloud spins up a new virtual machine and, while inspecting uninitialized disk blocks, finds database fragments belonging to another customer. Which vulnerability does this BEST describe?',
        choices: ['VM escape', 'Resource reuse', 'Side loading', 'Firmware tampering'],
        answer: 1,
        explain:
          'Storage that was freed by one VM and reassigned to another without being wiped leaks data remnants, which is resource reuse. VM escape is the tempting distractor, but that would require breaking out of the guest to run code on the hypervisor; here the tenant never left its own VM.',
      },
    },
    { t: 'h', text: 'Cloud: la mayoría de las brechas son configuración, no infraestructura' },
    {
      t: 'p',
      md: 'Los proveedores cloud tienen equipos enormes protegiendo sus centros de datos, y aun así los incidentes se suceden. La razón es que las **cloud-specific vulnerabilities** casi siempre están del lado del cliente: **storage buckets** públicos por error, **APIs** expuestas sin autenticación o sin límite de peticiones, **IAM sprawl** (cientos de roles y claves de acceso acumuladas que nadie revisa, muchas con permisos de administrador) y **shared responsibility gaps**, es decir, tareas que el cliente cree que hace el proveedor y el proveedor cree que hace el cliente, y que en realidad no hace nadie.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: shared responsibility',
      md: 'El **shared responsibility model** reparte la seguridad entre las dos partes. El **provider** asegura la infraestructura: hardware físico, red del centro de datos, hypervisor y, según el servicio, el sistema operativo o la plataforma. El **customer** asegura lo que pone encima: **configuración**, **datos** e **identidades** (usuarios, roles, claves). Cuanto más gestionado es el servicio (IaaS → PaaS → SaaS) más asume el proveedor, pero **los datos y las identidades siempre son del cliente**. Si el escenario dice «bucket público», «clave de API filtrada» o «rol con permisos excesivos», la respuesta apunta al cliente, nunca al proveedor.',
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority stores vessel manifests in an IaaS provider. An auditor finds that the object storage container is readable by anyone on the internet. Under the shared responsibility model, who is responsible for this exposure?',
        choices: [
          'The cloud provider, because it operates the storage hardware',
          'The customer, because access configuration of the data is its responsibility',
          'Both equally, because IaaS splits every control in half',
          'Neither, because public read access is the default for object storage',
        ],
        answer: 1,
        explain:
          'Access permissions on stored data are configuration, and configuration, data and identities are always on the customer side of the model. The provider secures the physical and virtualization layers; it does not decide who may read a specific bucket.',
      },
    },
    { t: 'h', text: 'Supply chain: el riesgo que entra por la puerta de los proveedores' },
    {
      t: 'list',
      items: [
        '**Service provider** — un MSP, un proveedor de soporte o un integrador con acceso remoto a tu red. Si lo comprometen a él, el atacante hereda su acceso a todos sus clientes a la vez.',
        '**Hardware provider** — dispositivos **tampered** (manipulados en tránsito, con implantes o firmware alterado) o **counterfeit** (falsificaciones sin las protecciones del original). El indicador clásico es hardware comprado a un canal no autorizado o a un precio sospechosamente bajo.',
        '**Software provider** — **compromised libraries** (una dependencia open source con código malicioso inyectado) o **compromised updates** (el atacante firma su malware con el proceso legítimo de actualización del fabricante, así que llega a miles de clientes como si fuera un parche).',
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Ejemplo: el parche que no era un parche',
      md: 'El equipo de la Autoridad Portuaria de Halden despliega la actualización mensual de su software de gestión de grúas, firmada correctamente por el fabricante. Semanas después, el EDR detecta conexiones salientes desde el servidor de gestión hacia un dominio desconocido. La investigación revela que el atacante había comprometido el **build server** del fabricante e insertado una puerta trasera antes de la firma. Nada en la red del puerto falló: la vulnerabilidad estaba en la **supply chain de software**, y la única defensa razonable habría sido la vigilancia del comportamiento del sistema tras cada actualización y un inventario de proveedores con evaluación de su seguridad.',
    },
    { t: 'h', text: 'Criptografía débil: cifrar mal es casi tan grave como no cifrar' },
    {
      t: 'p',
      md: 'Una **cryptographic vulnerability** no significa que las matemáticas hayan fallado, sino que se usa algo que la comunidad ya ha declarado roto o que se implementa de forma descuidada. Cuatro patrones cubren la mayoría de las preguntas. Primero, **algoritmos deprecados**: **DES** y **3DES** (bloques y claves demasiado cortos), **RC4** (sesgos estadísticos explotables), **MD5** y **SHA-1** (colisiones prácticas, por lo que ya no sirven para firmas ni certificados). Segundo, **claves cortas**: RSA de 1024 bits o menos, cifrado simétrico por debajo de 128 bits. Tercero, **poor key management**: claves incrustadas en el código fuente, compartidas por correo, nunca rotadas o guardadas junto a los datos que protegen. Cuarto, **predictable IVs**: un initialization vector que se repite o se deduce permite reconocer patrones en el texto cifrado y, en algunos modos, recuperar el texto en claro.',
    },
    {
      t: 'check',
      q: {
        q: 'During a code review, an analyst finds that a legacy application stores password digests using MD5 with no salt. What is the MOST accurate description of the weakness?',
        choices: [
          'A misconfiguration, because the algorithm should have been enabled in the web server',
          'A cryptographic vulnerability, because MD5 is deprecated and vulnerable to collisions and fast brute force',
          'A supply chain vulnerability, because MD5 comes from a third-party library',
          'A resource reuse issue, because the digests are kept in memory',
        ],
        answer: 1,
        explain:
          'Using a deprecated hash without a salt is a weakness in the cryptographic design itself, so the category is cryptographic. Supply chain is the tempting distractor because a library implements MD5, but the library works exactly as designed; the problem is the choice of algorithm.',
      },
    },
    { t: 'h', text: 'Misconfiguración y dispositivos móviles' },
    {
      t: 'p',
      md: 'La **misconfiguration** es la vulnerabilidad más común y la más barata de corregir: **default settings** (contraseñas de fábrica, servicios de ejemplo activos), **open shares** accesibles sin credenciales, **verbose errors** que revelan versiones, rutas internas o consultas SQL, y **permissive ACLs** que conceden más de lo necesario. No hace falta ningún exploit: el atacante simplemente usa el sistema tal como quedó. En el frente móvil, dos prácticas del usuario desmontan las protecciones del fabricante. El **side loading** instala aplicaciones desde fuera de la tienda oficial, saltándose la revisión de código y la firma; es la vía habitual del spyware disfrazado de app útil. El **jailbreaking** (iOS) y el **rooting** (Android) eliminan las restricciones del sistema operativo para obtener control total, lo que también anula el sandboxing de aplicaciones, el arranque verificado y a menudo la capacidad del MDM corporativo de aplicar políticas.',
    },
    {
      t: 'table',
      headers: ['Categoría', 'Ejemplo', 'Mitigación'],
      rows: [
        [
          'Virtualization',
          'VM escape hacia el hypervisor; restos de datos en memoria reasignada',
          'Parchear el hypervisor, sanitizar recursos antes de reasignarlos, hosts dedicados para cargas sensibles',
        ],
        [
          'Cloud-specific',
          'Bucket público, API sin autenticación, cientos de roles IAM sin revisar',
          'Baselines de configuración, CSPM, revisión periódica de IAM, aplicar el shared responsibility model',
        ],
        [
          'Supply chain',
          'Actualización legítima con backdoor; switch falsificado; MSP comprometido',
          'Evaluación de proveedores, canales de compra autorizados, SBOM, monitorización tras actualizar',
        ],
        [
          'Cryptographic',
          'MD5/SHA-1 en firmas, RC4 en TLS, claves en el código, IV repetido',
          'AES-256, SHA-256 o superior, TLS 1.2+, HSM o vault para claves, rotación',
        ],
        [
          'Misconfiguration',
          'Credenciales por defecto, share abierto, errores detallados en producción',
          'Hardening con baselines, escaneo de configuración, deshabilitar lo que no se usa',
        ],
        [
          'Mobile device',
          'App instalada desde un APK descargado; teléfono rooteado con MDM anulado',
          'MDM con detección de jailbreak/root, bloquear side loading, tiendas de apps gestionadas',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Cómo clasificar rápido en el examen',
      md: 'Pregúntate **dónde nació el fallo**. ¿En el hypervisor o en recursos compartidos entre VMs? *Virtualization*. ¿En un bucket, una API o un rol de la nube? *Cloud*. ¿En algo que te vendió, fabricó o actualizó un tercero? *Supply chain*. ¿En el algoritmo, la longitud de clave o su custodia? *Cryptographic*. ¿En un ajuste que alguien dejó como venía? *Misconfiguration*. ¿En una app fuera de la tienda o en un teléfono rooteado o con jailbreak? *Mobile*. Si el escenario encaja en dos, elige la que el enunciado subraya con su verbo principal.',
    },
    {
      t: 'check',
      q: {
        q: 'A warehouse supervisor at the Halden Port Authority roots his corporate Android phone to install a modified inventory app downloaded from a forum. Which TWO mobile vulnerabilities are present?',
        choices: [
          'Jailbreaking and VM escape',
          'Side loading and resource reuse',
          'Rooting and side loading',
          'Rooting and IAM sprawl',
        ],
        answer: 2,
        explain:
          'Removing Android protections is rooting, and installing an app from outside the official store is side loading; both are the mobile device vulnerabilities listed in objective 2.3. Jailbreaking is the iOS term, and the other options mix in virtualization or cloud concepts that have nothing to do with a handset.',
      },
    },
    {
      t: 'p',
      md: 'Con esta lección cierras el catálogo de vulnerabilidades del objetivo 2.3: ya sabes reconocer dónde está el hueco, desde una inyección en una aplicación hasta un teléfono rooteado. La siguiente lección cambia de perspectiva y mira a quien aprovecha esos huecos: los **tipos de malware** y los **indicadores** que delatan actividad maliciosa antes de que el daño sea irreversible.',
    },
  ],
  quiz: [
    {
      id: 'sp2m5q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A researcher demonstrates that a specially crafted instruction sequence inside a guest operating system allows arbitrary code execution on the underlying hypervisor. Which vulnerability has been demonstrated?',
      choices: ['Resource reuse', 'Side loading', 'VM escape', 'Permissive ACL'],
      answer: 2,
      explain:
        'Breaking out of the guest to run code on the hypervisor or host is the definition of VM escape. Resource reuse is the tempting distractor because it also involves virtualization, but it concerns leftover data in reallocated resources, not code execution outside the guest.',
    },
    {
      id: 'sp2m5q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A company discovers that a customer database hosted on a SaaS platform was accessed using an administrator account that had no MFA and a password reused from a breached site. Which statement about responsibility is MOST accurate?',
      choices: [
        'The customer is responsible, because identity and access configuration belong to the customer in every service model',
        'The SaaS provider is responsible, because it hosts the application and the database',
        'The SaaS provider is responsible, because SaaS transfers all security duties to the provider',
        'Neither party is responsible, because credential reuse is a user problem outside the model',
      ],
      answer: 0,
      explain:
        'Even in SaaS, where the provider secures infrastructure, platform and application, the customer keeps ownership of its data and identities, including enforcing MFA and password hygiene. The provider-blaming options are tempting because SaaS is the most managed model, but the shared responsibility model never hands identity management to the provider.',
    },
    {
      id: 'sp2m5q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An organization receives network switches purchased from an unauthorized online reseller at a large discount. Weeks later, the devices are found to contain modified firmware that forwards management traffic to an external address. Which vulnerability category does this represent?',
      choices: [
        'Cryptographic vulnerability',
        'Hardware provider supply chain vulnerability',
        'Cloud misconfiguration',
        'Software provider supply chain vulnerability',
      ],
      answer: 1,
      explain:
        'Tampered or counterfeit devices arriving through an untrusted channel are the classic hardware provider supply chain scenario. Software provider is the tempting distractor because firmware is code, but the compromise entered with the physical device from the reseller, not through a vendor update.',
    },
    {
      id: 'sp2m5q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A penetration tester reports that a web application encrypts session tokens with a symmetric cipher but uses the same initialization vector for every message. What is the PRIMARY risk?',
      choices: [
        'The application will run out of entropy and stop issuing tokens',
        'The provider will no longer be responsible for the encryption layer',
        'Attackers can lose their sessions because tokens expire early',
        'Patterns across ciphertexts become recognizable and may allow token recovery',
      ],
      answer: 3,
      explain:
        'A predictable or repeated IV means identical plaintext produces identical ciphertext, letting an attacker detect patterns and, in some cipher modes, recover or forge tokens. The other options describe effects unrelated to IV reuse; entropy exhaustion in particular sounds technical but does not follow from reusing an IV.',
    },
    {
      id: 'sp2m5q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A production web server returns detailed stack traces, including database connection strings, whenever a page fails to load. Which vulnerability type is this?',
      choices: ['Misconfiguration', 'Resource reuse', 'Jailbreaking', 'VM escape'],
      answer: 0,
      explain:
        'Verbose error messages exposed in production are a misconfiguration: the server works as designed but was left in a debug-style setting. Resource reuse is the tempting distractor because sensitive data leaks, but the leak comes from a configuration choice, not from reallocated memory or storage.',
    },
    {
      id: 'sp2m5q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Which of the following BEST explains why a jailbroken corporate iPhone is a security concern even when the user has installed no malicious apps?',
      choices: [
        'The device can no longer connect to Wi-Fi networks',
        'Operating system protections such as sandboxing and verified boot are removed, and MDM policies may no longer be enforceable',
        'The device automatically becomes part of a botnet',
        'The provider takes over responsibility for the device under the shared responsibility model',
      ],
      answer: 1,
      explain:
        'Jailbreaking strips the OS of the restrictions that isolate apps and validate the boot chain, and it commonly breaks the ability of MDM to enforce corporate policy, so the device is exposed regardless of what is installed later. The botnet option is tempting because jailbroken devices are more easily infected, but infection is a possible consequence, not an automatic one.',
    },
    {
      id: 'sp2m5q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A developer adds a popular open-source logging library to an application. Months later it is revealed that a maintainer account was hijacked and a malicious version of the library was published and downloaded by thousands of projects. Which vulnerability category BEST fits?',
      choices: [
        'Hardware provider supply chain',
        'Cryptographic vulnerability',
        'Software provider supply chain',
        'Cloud-specific vulnerability',
      ],
      answer: 2,
      explain:
        'A compromised third-party library or update is the software provider branch of the supply chain. Cloud-specific is the tempting distractor if the application happens to run in the cloud, but the weakness entered through the code dependency, not through cloud configuration.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP2M6 — Malware e indicadores de actividad maliciosa (SY0-701, objetivo 2.4)
// ---------------------------------------------------------------------------
const sp2m6: Module = {
  id: 'sp2m6',
  sectionId: 'sp2',
  title: 'Malware e indicadores de actividad maliciosa',
  minutes: 14,
  objectives: [
    'Distinguir los nueve tipos de malware del SY0-701 por su forma de propagarse y su objetivo',
    'Asociar cada tipo de malware con su indicador característico y la respuesta adecuada',
    'Explicar por qué un rootkit exige reinstalación y por qué una logic bomb es difícil de detectar',
    'Reconocer los nueve indicadores generales de actividad maliciosa en logs y alertas',
    'Resolver escenarios de examen que mezclan síntomas con el tipo de malware o indicador correcto',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El objetivo 2.4 es enorme, así que esta lección lo aborda por su parte más reconocible: el **malware** y los **indicadores de actividad maliciosa**. Como analista, verás muy pocas muestras de malware con nombre y apellido; lo que verás son **síntomas**: un proceso que consume CPU, una cuenta que se bloquea a las tres de la mañana, un log que ha dejado de llegar. El examen funciona igual: te describe el síntoma y espera que lo traduzcas al tipo de malware o al indicador. Esta lección construye esa tabla de traducción.',
    },
    { t: 'h', text: 'Los nueve tipos de malware' },
    {
      t: 'p',
      md: 'Empieza por los tres que se definen por **cómo se mueven**. El **virus** necesita un **host file** y una acción del usuario (abrir el documento, ejecutar el programa) para activarse y copiarse; sus variantes **fileless** viven en memoria o en scripts del sistema (PowerShell, WMI) y no dejan un ejecutable en disco, lo que las hace invisibles para el antivirus basado en firmas. El **worm** se **autopropaga por la red** explotando vulnerabilidades sin que nadie haga clic: su firma es la velocidad y la saturación de red. El **trojan** se disfraza de software legítimo para que el usuario lo instale voluntariamente; el subtipo estrella es el **RAT** (remote access trojan), que entrega control remoto completo al atacante.',
    },
    {
      t: 'p',
      md: 'Los siguientes se definen por **lo que hacen** una vez dentro. El **ransomware** cifra los datos y exige un rescate; la variante **double extortion** roba los datos antes de cifrar y amenaza con publicarlos, de modo que tener backups ya no basta. El **spyware** recopila información del usuario (hábitos, credenciales, capturas) y la envía fuera; el **keylogger** es su forma más específica, registrando cada pulsación de teclado, sea por software o por un dispositivo físico entre el teclado y el equipo. La **logic bomb** es código dormido que se activa cuando se cumple una **condición**: una fecha, la eliminación de un usuario, un contador; es típica del **insider** con acceso de administración. El **rootkit** se instala en el **kernel** o en el proceso de **arranque** para ocultar su presencia y la de otros programas al sistema operativo, por lo que las herramientas del propio sistema no lo ven. Y el **bloatware** es software preinstalado no deseado: no es malicioso en sí, pero amplía la superficie de ataque, consume recursos y a veces incluye componentes vulnerables o de telemetría agresiva.',
    },
    {
      t: 'table',
      headers: ['Malware', 'Propagación', 'Indicador clave', 'Respuesta'],
      rows: [
        [
          'Ransomware',
          'Phishing, RDP expuesto, vulnerabilidad sin parchear',
          'Ficheros con extensiones extrañas, nota de rescate, cifrado masivo',
          'Aislar, no pagar como norma, restaurar desde backup offline, revisar exfiltración',
        ],
        [
          'Trojan / RAT',
          'El usuario instala un programa que parece legítimo',
          'Conexiones salientes persistentes a C2, proceso desconocido con acceso de red',
          'Aislar, bloquear el C2, reimagen si hay control remoto',
        ],
        [
          'Worm',
          'Autopropagación por red explotando un servicio',
          'Saturación de red, muchos hosts infectados en minutos, escaneo interno',
          'Segmentar, parchear el servicio explotado, limpiar host a host',
        ],
        [
          'Spyware',
          'Bundles de software gratuito, side loading, adware',
          'Tráfico saliente inusual, cambios en el navegador, lentitud',
          'Eliminar, rotar credenciales, revisar qué se exfiltró',
        ],
        [
          'Bloatware',
          'Preinstalado por el fabricante o el distribuidor',
          'Recursos consumidos, servicios innecesarios activos',
          'Desinstalar, imágenes corporativas limpias',
        ],
        [
          'Virus',
          'Fichero host + acción del usuario; fileless en memoria',
          'Ficheros modificados, detección de firma, scripts en memoria',
          'Antivirus/EDR, limpiar o restaurar ficheros afectados',
        ],
        [
          'Keylogger',
          'Instalado con otro malware o como dispositivo físico USB',
          'Credenciales robadas sin phishing aparente, dispositivo entre teclado y PC',
          'Eliminar, inspección física, rotar todas las contraseñas',
        ],
        [
          'Logic bomb',
          'Insertada por un insider o en código de terceros',
          'Nada hasta que se cumple la condición; tarea programada o script sospechoso',
          'Revisión de código y tareas programadas, separación de funciones',
        ],
        [
          'Rootkit',
          'Instalado tras una compromisión previa con privilegios',
          'Discrepancias entre lo que ve el sistema y un análisis externo; antivirus desactivado',
          'Reimagen completa desde medios limpios; secure boot para prevenir',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Rootkit: no se limpia, se reinstala',
      md: 'Un **rootkit** se sitúa por debajo del sistema operativo o dentro de su kernel, así que cualquier herramienta que ejecutes sobre ese sistema puede estar viendo lo que el rootkit quiere que vea. Por eso la respuesta correcta en el examen casi nunca es «ejecutar el antivirus» sino **reimage** desde medios de confianza y, en el caso de rootkits de firmware, revisar o reflashear la BIOS/UEFI. La prevención pasa por **secure boot** y **measured boot**, que verifican la cadena de arranque antes de cargar el sistema.',
    },
    {
      t: 'check',
      q: {
        q: 'Within 20 minutes, hundreds of workstations across three sites of the Halden Port Authority become infected. No user reported opening an attachment, and internal network utilization spikes to saturation. Which malware type is MOST likely?',
        choices: ['Trojan', 'Logic bomb', 'Worm', 'Keylogger'],
        answer: 2,
        explain:
          'Rapid, network-wide spread with no user interaction is the signature of a worm, which propagates by exploiting a vulnerable service on its own. A trojan is the tempting distractor, but it requires each user to install something disguised as legitimate, which does not match the absence of user action.',
      },
    },
    {
      t: 'check',
      q: {
        q: 'A database administrator who was recently notified of layoffs leaves a scheduled job that deletes the backups table if her account no longer appears in the HR system. Which type of malware does this represent?',
        choices: ['Rootkit', 'Logic bomb', 'Ransomware', 'Bloatware'],
        answer: 1,
        explain:
          'Code that stays dormant and fires when a specific condition is met, in this case the removal of an account, is a logic bomb, and the insider with administrative access is its classic author. Ransomware is tempting because data is destroyed, but nothing is encrypted and no ransom is demanded.',
      },
    },
    {
      t: 'check',
      q: {
        q: 'An analyst confirms that a server\'s kernel has been modified so that a malicious process and its network connections are hidden from the operating system\'s own tools. What is the BEST remediation?',
        choices: [
          'Run a full antivirus scan from within the compromised operating system',
          'Kill the hidden process and reboot the server',
          'Rebuild the server from trusted installation media and verified backups',
          'Uninstall the unwanted preinstalled applications',
        ],
        answer: 2,
        explain:
          'A kernel-level rootkit can subvert anything that runs on the same operating system, so only a full reimage from trusted media provides confidence that it is gone. Scanning from inside the compromised OS is the tempting distractor, but the rootkit can hide its files from the scanner just as it hides the process.',
      },
    },
    { t: 'h', text: 'Indicadores generales de actividad maliciosa' },
    {
      t: 'p',
      md: 'La segunda mitad del objetivo 2.4 no habla de malware concreto sino de **señales** que cualquier analista debe reconocer en un SIEM, en una consola de identidad o en un informe de capacidad. Muchas son ambiguas por separado, pero cada una tiene una lectura por defecto que el examen espera.',
    },
    {
      t: 'list',
      items: [
        '**Account lockout** — una cuenta se bloquea por intentos fallidos repetidos; sugiere **brute force** o **password spraying**, sobre todo si afecta a muchas cuentas a la vez o fuera de horario.',
        '**Concurrent session usage** — la misma cuenta tiene sesiones activas desde dos lugares o dispositivos al mismo tiempo; indica credenciales robadas o un token de sesión secuestrado.',
        '**Blocked content** — el proxy, el filtro de correo o el EDR bloquean repetidamente descargas o accesos desde un mismo host; el bloqueo funcionó, pero el intento revela que algo en ese host está tratando de contactar con el exterior.',
        '**Impossible travel** — dos inicios de sesión válidos desde ubicaciones geográficas que no se pueden recorrer en el tiempo transcurrido entre ellos; casi siempre credenciales comprometidas.',
        '**Resource consumption** — picos de CPU, memoria, disco o ancho de banda sin causa legítima; la lectura habitual es **cryptomining**, exfiltración o un worm en marcha.',
        '**Resource inaccessibility** — ficheros, servicios o sistemas que dejan de estar disponibles; la lectura por defecto es **ransomware** o un ataque de denegación de servicio.',
        '**Out-of-cycle logging** — eventos que aparecen fuera de su patrón normal: backups a mediodía, cambios de configuración un domingo, autenticaciones de una cuenta de servicio en horario de oficina.',
        '**Published / documented** — los datos de la organización aparecen en un **leak site**, en un foro o en un informe público; a veces es el primer indicio de una brecha que nadie detectó.',
        '**Missing logs** — un origen de logs deja de enviar eventos o hay huecos en la línea temporal; los atacantes borran o detienen el registro para cubrir sus huellas, así que la ausencia es tan sospechosa como una alerta.',
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: del síntoma a la respuesta',
      md: 'Memoriza estas tres traducciones porque aparecen con distinto disfraz: **«logins from two countries 10 minutes apart»** → *impossible travel* (credenciales comprometidas). **«Scheduled task that wipes data when an employee is removed from payroll»** → *logic bomb*. **«CPU spikes plus an unknown process»** → *resource consumption*, normalmente *cryptomining*. Y dos matices: si el enunciado dice que los datos «aparecieron en un sitio de filtraciones», el indicador es *published/documented* aunque nadie haya visto ninguna alerta; y si un servidor «dejó de enviar logs al SIEM», la respuesta es *missing logs*, no «el servidor está apagado».',
    },
    {
      t: 'check',
      q: {
        q: 'A SIEM alert shows that a logistics coordinator authenticated to the VPN from Norway and, twelve minutes later, from Southeast Asia. Both logins used the correct password. Which indicator does this represent, and what is the MOST likely cause?',
        choices: [
          'Account lockout caused by password spraying',
          'Impossible travel caused by compromised credentials',
          'Out-of-cycle logging caused by a misconfigured time zone',
          'Resource consumption caused by cryptomining',
        ],
        answer: 1,
        explain:
          'Two valid logins from locations that cannot be physically reached in the elapsed time is impossible travel, and the usual explanation is that someone else holds the user\'s credentials. Out-of-cycle logging is the tempting distractor because timing is involved, but the anomaly here is geography, not the schedule of events.',
      },
    },
    {
      t: 'callout',
      kind: 'story',
      title: 'Halden, turno de noche',
      md: 'A las 02:40 el SIEM del puerto muestra tres cosas a la vez: el servidor de facturación ha dejado de enviar eventos (**missing logs**), la CPU del servidor de aplicaciones está al 95 % con un proceso llamado *svchost32* que no figura en el inventario (**resource consumption**), y el proxy registra bloqueos repetidos de conexiones a un dominio recién registrado (**blocked content**). Ninguna de las tres señales por separado sería concluyente. Juntas describen a un atacante que ya está dentro, minando o exfiltrando, y que intenta borrar sus huellas. La lección para ti como analista: los indicadores se leen **en conjunto**, y el primero que debes investigar es siempre el que implica pérdida de visibilidad.',
    },
    {
      t: 'p',
      md: 'Ya puedes poner nombre al malware a partir de su comportamiento y leer los nueve indicadores como lo haría una analista de SOC. La siguiente lección completa el objetivo 2.4 con los ataques que no necesitan un programa malicioso instalado: **ataques de red**, **de aplicación**, **criptográficos** y **de contraseña**, muchos de los cuales producen precisamente los indicadores que acabas de aprender.',
    },
  ],
  quiz: [
    {
      id: 'sp2m6q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Users at a shipping company report that their documents now have a .locked extension and a text file demands payment in cryptocurrency. The attackers also claim to have copied the files and threaten to publish them. Which malware type and technique are described?',
      choices: [
        'Spyware using a keylogger',
        'Ransomware using double extortion',
        'Worm using network propagation',
        'Rootkit using boot-level hiding',
      ],
      answer: 1,
      explain:
        'Encryption with a ransom demand is ransomware, and adding the threat to publish stolen data is the double extortion variant, which is designed to pressure victims even when they have backups. Spyware is the tempting distractor because data was stolen, but spyware collects information silently rather than encrypting files and demanding payment.',
    },
    {
      id: 'sp2m6q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An employee installs what appears to be a free PDF converter. Shortly afterward, the endpoint begins maintaining a persistent outbound connection to an unknown server and the attacker can browse the file system remotely. Which malware type is this?',
      choices: ['Worm', 'Logic bomb', 'Bloatware', 'Remote access trojan'],
      answer: 3,
      explain:
        'Software that pretends to be useful so the user installs it, and then hands remote control to an attacker, is a trojan of the RAT variety. A worm is the tempting distractor because of the network connection, but a worm spreads by itself and does not rely on the user installing a disguised program.',
    },
    {
      id: 'sp2m6q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Which malware characteristic BEST distinguishes a virus from a worm?',
      choices: [
        'A virus requires a host file and user action to execute, while a worm self-propagates across the network',
        'A virus encrypts data for ransom, while a worm steals credentials',
        'A virus hides in the kernel, while a worm hides in the boot sector',
        'A virus is preinstalled by the manufacturer, while a worm is downloaded by the user',
      ],
      answer: 0,
      explain:
        'The defining difference is the propagation mechanism: a virus attaches to a host file and needs someone to run it, whereas a worm spreads on its own by exploiting network services. The other options confuse viruses and worms with ransomware, rootkits and bloatware respectively.',
    },
    {
      id: 'sp2m6q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A security team notices that several finance employees\' passwords were used by an attacker, yet none of them received phishing emails and no credential dump has been published. A technician later finds a small USB device plugged in between the keyboard and the desktop of one of the shared workstations. Which malware type is MOST likely responsible?',
      choices: ['Rootkit', 'Hardware keylogger', 'Fileless virus', 'Bloatware'],
      answer: 1,
      explain:
        'A physical device that sits between the keyboard and the computer captures every keystroke, including passwords, without any software or phishing being involved. A fileless virus is the tempting distractor because it also evades traditional detection, but the physical evidence points to a hardware keylogger rather than in-memory code.',
    },
    {
      id: 'sp2m6q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'New laptops arrive with a dozen manufacturer-installed utilities and trial applications that the company never requested. They are not malicious, but two of them have known unpatched vulnerabilities. What is this software called and what is the recommended action?',
      choices: [
        'Spyware; rotate all user credentials',
        'Trojan; reimage the laptops from vendor media',
        'Bloatware; remove it and deploy a clean corporate image',
        'Logic bomb; review scheduled tasks',
      ],
      answer: 2,
      explain:
        'Unwanted preinstalled software that is not malicious but adds attack surface and consumes resources is bloatware, and the standard response is to strip it by deploying a hardened corporate image. Spyware is the tempting distractor because some preinstalled utilities collect telemetry, but the question explicitly states the software is not malicious.',
    },
    {
      id: 'sp2m6q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'During a routine review, an analyst notices that the file server stopped forwarding events to the SIEM three days ago, although the server itself is online and serving files normally. Which indicator of malicious activity should the analyst suspect FIRST?',
      choices: ['Missing logs', 'Account lockout', 'Blocked content', 'Concurrent session usage'],
      answer: 0,
      explain:
        'A log source going silent while the system keeps working is the missing logs indicator; attackers routinely stop or delete logging to hide their actions, so the gap itself is the alert. The other indicators involve authentication or filtering events, none of which is described here.',
    },
    {
      id: 'sp2m6q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'The identity platform reports that a single user account has active sessions from a corporate laptop in the office and, at the same time, from an unmanaged device in another region. The user confirms she is only using the laptop. Which indicator is this?',
      choices: [
        'Out-of-cycle logging',
        'Resource inaccessibility',
        'Published or documented data',
        'Concurrent session usage',
      ],
      answer: 3,
      explain:
        'The same account being active from two devices at the same moment, one of which the user does not recognize, is concurrent session usage and points to stolen credentials or a hijacked session token. Out-of-cycle logging is the tempting distractor, but that describes events occurring outside their normal schedule, not two simultaneous sessions.',
    },
    {
      id: 'sp2m6q8',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A monitoring dashboard shows that an application server\'s CPU has been at 98% for two days. The process responsible is not part of the approved software inventory and communicates with a mining pool on the internet. Which indicator is present and what is the MOST likely activity?',
      choices: [
        'Resource inaccessibility caused by ransomware',
        'Resource consumption caused by cryptomining',
        'Impossible travel caused by a VPN misconfiguration',
        'Account lockout caused by brute force',
      ],
      answer: 1,
      explain:
        'Sustained CPU usage by an unknown process talking to a mining pool is resource consumption, and the activity is cryptomining, where the attacker monetizes the victim\'s hardware. Resource inaccessibility is the tempting distractor because the server may become slow, but nothing has been made unavailable or encrypted; the server is simply being overused.',
    },
  ],
};

export const SP2_PART3: Module[] = [sp2m5, sp2m6];
