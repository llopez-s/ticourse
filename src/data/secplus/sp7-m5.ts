import type { Module } from '../../lib/types';

/**
 * sp7m5 — Código, repositorios y credenciales.
 * Complemento opcional del borrador de objetivos SY0-801 (v2.0): 2.4, 4.1, 4.5 y 3.2.
 * Sin preguntas de banco (`quiz: []`) y todas las comprobaciones son opcionales.
 * Ejemplos ficticios: ningún valor es una credencial real ni un hecho del canon de Halden.
 */
export const SP7M5: Module = {
  id: 'sp7m5',
  sectionId: 'sp7',
  title: 'Código, repositorios y credenciales',
  minutes: 22,
  objectives: [
    'Explicar por qué los hardcoded secrets, el unsafe exception handling y los repositorios u object storage públicos son superficie de ataque',
    'Describir una race condition TOC/TOU con un ejemplo de comprobar-y-usar y cómo se corrige',
    'Distinguir una malicious update de una actualización legítima y qué aportan el code signing y la verificación de integridad',
    'Aplicar secrets scanning y static code analysis como controles preventivos en los repositorios',
    'Comparar contraseña, passkey y passwordless, y justificar por qué un passkey resiste el phishing',
    'Diseñar emergency access accounts, cuentas gMSA y cuentas de mínimo privilegio, y detectar privilege creep con access reviews y compromised credential monitoring',
  ],
  blocks: [
    {
      t: 'callout',
      kind: 'warn',
      title: 'Fuera del SY0-701 · novedad del SY0-801',
      md: 'Esta lección es material complementario y **opcional**. Se basa en el listado de objetivos del SY0-801 en su versión 2.0, un **borrador previo al lanzamiento**: CompTIA prevé el examen para el **17 de noviembre de 2026 o alrededor**, y el listado final puede cambiar. Si te presentas al SY0-701, esto no sustituye al temario del 701; lo que ya estudiaste sigue siendo válido. Contenido original y no oficial, sin afiliación con CompTIA. Leerla cuenta como cualquier lección (XP y progreso normales), pero sus comprobaciones son opcionales, no dan XP y nada de lo que contiene entra en los bancos de preguntas, los jefes, el simulacro ni el examen de nivel.',
    },
    {
      t: 'p',
      md: 'Casi todos los incidentes de acceso acaban en una de dos preguntas: **¿dónde estaba el secreto?** y **¿quién podía usarlo?** La lección tiene dos mitades que responden a eso. La primera mira el **código y los repositorios**: los sitios donde las credenciales se escapan sin que nadie las robe. La segunda mira la **identidad moderna**: cómo dejar de depender de contraseñas que se pueden escapar, y cómo evitar que las cuentas acumulen poder con los años.',
    },
    {
      t: 'p',
      md: 'No repetimos lo que ya está en el 701. TOC/TOU y malicious update ya los viste en la lección sp2m4 y aquí se repasan con la mirada del código; los buckets públicos y la cadena de suministro están en sp2m5, el ciclo de vida de la identidad, el permission creep y el SSO en sp4m8, y los secretos en infraestructura como código en sp3m1. Aquí nos quedamos con lo que el borrador del 801 nombra de forma explícita y que conviene tener claro.',
    },
    { t: 'h', text: 'Primera mitad: código y repositorios' },
    {
      t: 'p',
      md: 'Empezamos por los sitios donde un secreto se queda escrito: el código, los repositorios y el almacenamiento de objetos. Después veremos cómo se firman y se actualizan los programas, y qué falla cuando el código decide mal.',
    },
    { t: 'h', text: 'Hardcoded secrets' },
    {
      t: 'p',
      md: 'Un **hardcoded secret** es una contraseña, token, clave de API o clave privada escrita directamente en el código fuente o en un fichero de configuración que viaja con él. Es cómodo al principio ("así funciona en mi máquina") y desastroso después, porque el secreto se copia con cada clon, cada copia de seguridad y cada contenedor construido a partir del código. Quien lea el repositorio hereda el acceso.',
    },
    {
      t: 'code',
      lang: 'ini',
      title: 'Ficticio: lo que NO debe llegar al repositorio',
      text: '# config.ini (ejemplo inventado, el valor es un marcador)\nAPI_KEY="REEMPLAZAR"\nDB_PASSWORD="REEMPLAZAR"',
    },
    {
      t: 'p',
      md: 'El patrón correcto es separar el código del secreto. El programa pide el valor en tiempo de ejecución a una **variable de entorno inyectada** o, mejor, a un **secrets manager** (una bóveda con control de acceso, auditoría y rotación). Cuando se puede, se prefieren credenciales **de vida corta** que caducan solas: si se filtran, valen poco tiempo.',
    },
    {
      t: 'code',
      lang: 'ini',
      title: 'Ficticio: el código solo conoce el nombre del secreto',
      text: '# El valor vive en la bóveda; aquí solo hay una referencia\nAPI_KEY_REF="vault://servicio-demo/api"',
    },
    { t: 'h', text: 'Public repositories y public object storage' },
    {
      t: 'p',
      md: 'Un **public repository** convierte cualquier error en un incidente mundial: los buscadores de secretos de los atacantes rastrean repositorios públicos de forma automática y encuentran una clave en cuestión de minutos. Y hay una trampa que sorprende: **borrar el fichero en el siguiente commit no borra el secreto**, porque sigue en el historial. La respuesta correcta a una filtración es primero **revocar y rotar** la credencial, y solo después limpiar el historial. Tratar un secreto filtrado como "ya borrado" es el error típico.',
    },
    {
      t: 'p',
      md: 'El **public object storage** es el mismo problema en otro envase: un contenedor de almacenamiento de objetos (buckets, blobs) con permisos de lectura abiertos a cualquiera. Suele ser una **misconfiguration** heredada de una prueba, un permiso demasiado amplio o una plantilla copiada. Los ficheros que se subieron "para compartir con un proveedor" acaban indexados. Se controla con acceso privado por defecto, bloqueo del acceso público a nivel de cuenta y revisiones periódicas de qué contenedores están expuestos.',
    },
    { t: 'h', text: 'Secrets scanning y static code analysis' },
    {
      t: 'p',
      md: 'El **secrets scanning** es el control que busca patrones de credenciales (formatos de claves conocidos, cadenas de alta entropía, nombres como `password=`) en el código y en su historial. Funciona mejor en capas, y cuanto antes, más barato:',
    },
    {
      t: 'list',
      items: [
        '**En el equipo del desarrollador** (pre-commit): detiene el secreto antes de que exista en el repositorio.',
        '**En el servidor del repositorio** (push protection): rechaza el envío si detecta un secreto, aunque alguien se haya saltado la primera capa.',
        '**En la canalización CI/CD**: revisa cada cambio y también el historial completo de forma periódica.',
        '**Sobre repositorios antiguos**: es donde aparecen los secretos que nadie recordaba.',
      ],
    },
    {
      t: 'p',
      md: 'Su pariente es la **static code analysis** (SAST): examina el código sin ejecutarlo y detecta secretos escritos a mano, entradas sin validar o consultas construidas de forma insegura. Ninguno de los dos es perfecto. Generan falsos positivos y no ven un secreto que está cifrado o partido en trozos, así que se combinan con revisión de código y con la regla de fondo: lo que no está en el repositorio no se puede filtrar desde él.',
    },
    { t: 'h', text: 'Unsafe exception handling' },
    {
      t: 'p',
      md: 'Una excepción es el programa diciendo "algo ha ido mal". El **unsafe exception handling** aparece cuando la forma de gestionar ese error ayuda al atacante, de tres maneras distintas:',
    },
    {
      t: 'table',
      headers: ['Fallo', 'Qué ocurre', 'Corrección'],
      rows: [
        [
          'Error demasiado hablador',
          'La pantalla muestra la traza completa: rutas del servidor, versiones, consulta SQL, nombres de tablas, a veces un fragmento de configuración con un secreto',
          'Mensaje genérico para el usuario con un identificador del incidente; el detalle va solo al registro interno',
        ],
        [
          'Fail open',
          'Si el servicio de autorización falla, el código captura la excepción y deja pasar "para no bloquear a nadie"',
          'Fail closed: ante la duda, denegar y alertar',
        ],
        [
          'Error tragado',
          'Se captura la excepción y no se registra nada; el ataque deja de ser visible',
          'Registrar el fallo con contexto suficiente y vigilar los patrones anómalos',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Para recordar',
      md: 'Un buen error tiene dos destinatarios: el usuario recibe una frase corta y neutra, y el equipo de seguridad recibe el detalle en los registros. El error que cuenta demasiado al usuario es información de reconocimiento gratis para el atacante.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A developer pushes a configuration file with an API key to a public repository, notices a minute later, and deletes the file in the next commit. What should the team do FIRST?',
        choices: [
          'Nothing further, because the file no longer exists in the latest commit',
          'Rewrite the history so nobody can read the old commit',
          'Revoke and rotate the key, then clean the history and add secrets scanning',
          'Make the repository private and keep the same key',
        ],
        answer: 2,
        explain:
          'The secret survives in the commit history and may already have been copied by automated scanners, so the key must be treated as compromised: revoke and rotate it first. Cleaning the history matters but is not enough alone, and making the repository private does not recall copies already taken.',
      },
    },
    { t: 'h', text: 'Malicious update y code signing' },
    {
      t: 'p',
      md: 'Una **malicious update** es código dañino que llega por el canal de actualización legítimo: el atacante compromete al proveedor, su servidor de distribución, su canalización de compilación o una dependencia, y el software de confianza instala el cambio por su cuenta. Es un ataque de cadena de suministro con un efecto muy concreto: la víctima hizo "lo correcto" (actualizar) y aun así se infectó. En la lección sp2m4 ya viste la variante de examen del 701 (y la cadena de suministro en sp2m5); aquí lo importante son las defensas.',
    },
    {
      t: 'list',
      items: [
        '**Code signing**: el proveedor firma el binario o el paquete con su clave privada, y el cliente verifica la firma con el certificado correspondiente antes de instalar. Demuestra **origen e integridad**: quién lo publicó y que nadie lo modificó después.',
        '**Verificación de hashes** publicados por un canal independiente del que sirve el fichero.',
        '**Despliegue escalonado**: probar la actualización en un grupo piloto antes de aplicarla a toda la flota.',
        '**Control de dependencias**: inventario de qué componentes se incluyen y desde dónde se descargan.',
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Qué NO garantiza la firma',
      md: 'Un binario firmado dice **quién** lo firmó, no que el código sea **bueno**. Si el atacante roba la clave de firma, o compromete la compilación *antes* de firmar, el malware sale con firma válida. Por eso la clave de firma vive en un módulo protegido (HSM), con acceso mínimo y auditoría.',
    },
    { t: 'h', text: 'Race conditions: TOC/TOU' },
    {
      t: 'p',
      md: 'Una **race condition** ocurre cuando el resultado depende del orden en que se ejecutan dos operaciones que compiten. La versión que nombra el borrador del 801, y que ya viste en sp2m4, es **time-of-check / time-of-use**: el programa comprueba una condición (**TOC**, time-of-check) y actúa sobre ella un instante después (**TOU**, time-of-use). Si el recurso cambia en ese hueco, la comprobación ya no vale. Piensa en un portero que mira tu entrada, se da la vuelta, y para cuando te deja pasar ya tienes otra entrada en la mano.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Pseudocódigo ficticio de un check-then-use',
      text: 'si usuario_puede_escribir(ruta):        # 1. COMPRUEBA  (TOC)\n    # ... hueco: otro proceso cambia "ruta" para apuntar a otro fichero\n    escribir(ruta, datos)                # 2. USA        (TOU)',
    },
    {
      t: 'p',
      md: 'La corrección no es "ir más rápido", sino **eliminar el hueco**: hacer la comprobación y el uso en una sola operación **atómica** (abrir el recurso una vez y trabajar con ese identificador), usar **bloqueos** sobre el recurso mientras se trabaja (ojo: muchos bloqueos de ficheros son solo consultivos, es decir, protegen únicamente a los programas que deciden respetarlos) y dejar que el sistema aplique el permiso en el momento de la operación en lugar de preguntarlo antes. El mismo patrón se ve en operaciones de negocio: comprobar el saldo y descontarlo como dos pasos separados permite gastar dos veces el mismo importe si dos peticiones llegan a la vez.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A service verifies that a user may write to a path and, a few milliseconds later, writes to it. An attacker swaps the path in between. Which fix addresses the root cause?',
        choices: [
          'Make the service check the path twice',
          'Perform the check and the write as one atomic operation on the same opened resource',
          'Show a generic error message to the user',
          'Sign the binary with code signing',
        ],
        answer: 1,
        explain:
          'The flaw is the gap between TOC and TOU, so the fix is to close the gap with an atomic operation or a lock. Checking twice only adds a second gap, an error message does not change the timing, and signing proves origin but cannot fix a logic flaw.',
      },
    },
    { t: 'h', text: 'Identity providers como superficie de ataque' },
    {
      t: 'p',
      md: 'Con SSO y federación, el **identity provider (IdP)** es la puerta de entrada a casi todas las aplicaciones. Es cómodo, pero concentra el riesgo: si un atacante controla el IdP, o consigue una cuenta administradora, o roba los tokens de sesión, o altera una relación de federación, entra en muchas aplicaciones con un único movimiento. Las defensas son las ya conocidas de la lección sp4m8, reforzadas donde más duele: **autenticación resistente al phishing** para los administradores del IdP, alertas sobre cambios de configuración y de federación, y un plan para cuando el propio IdP no esté disponible. Ese último punto enlaza con la segunda mitad.',
    },
    { t: 'h', text: 'Segunda mitad: identidad moderna' },
    {
      t: 'p',
      md: 'Ahora cambiamos de mirada: de dónde se escapan los secretos a cómo se reduce la dependencia de ellos y cómo se controla el poder de las cuentas, sobre todo las privilegiadas, las de servicio y las de emergencia.',
    },
    { t: 'h', text: 'Passkey y passwordless' },
    {
      t: 'p',
      md: 'Un **passkey** es una credencial basada en criptografía de clave pública (el estándar FIDO2/WebAuthn). Al registrarlo se crea un par de claves: la **privada** se queda en tu dispositivo o en tu gestor de credenciales, y el servicio solo guarda la **pública**. Para entrar, el dispositivo firma un reto; tú lo desbloqueas localmente con biometría o PIN, y ese dato **nunca sale** del dispositivo. No viaja ningún secreto compartido que robar de un servidor o que teclear en una página falsa.',
    },
    {
      t: 'p',
      md: 'Por eso es **resistente al phishing**: el passkey está ligado al **dominio legítimo** (el origen) con el que se registró. Una página falsa con otro dominio no puede obtener una firma válida para el sitio verdadero, por muy convincente que sea. Y no hay nada que "reutilizar": cada sitio tiene su propio par de claves. **Passwordless** es el objetivo de diseño más amplio: que el usuario no tenga contraseña que recordar, teclear ni robar. Puede conseguirse con passkeys, llaves de seguridad físicas u otros factores fuertes; lo importante es que la contraseña deja de ser el eslabón débil.',
    },
    {
      t: 'table',
      headers: ['Aspecto', 'Contraseña (+ OTP)', 'Passkey'],
      rows: [
        ['Qué se guarda en el servidor', 'Un hash de la contraseña (secreto compartido)', 'Solo la clave pública, inútil para el atacante'],
        ['Phishing', 'El usuario puede teclearla en un sitio falso; un OTP también se puede retransmitir', 'Ligado al dominio legítimo: la página falsa no obtiene firma válida'],
        ['Reutilización', 'Frecuente entre servicios', 'Imposible: un par de claves por sitio'],
        ['Qué se roba si hay una brecha en el servidor', 'Hashes que se pueden intentar romper', 'Nada utilizable para entrar'],
        ['Recuperación', 'Correo o preguntas, un punto débil', 'Depende del respaldo del gestor o de dispositivos registrados; hay que diseñarla bien'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Matiz de examen',
      md: 'No confundas **passwordless** con "sin factores". Un passkey combina algo que **tienes** (el dispositivo con la clave privada) con algo que **eres o sabes** (biometría o PIN local), de modo que ya cumple varios factores en un solo gesto. Además, su punto débil se traslada: el proceso de **recuperación** de la cuenta pasa a ser lo que el atacante intenta engañar.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'Why is a passkey considered phishing-resistant, unlike a password followed by a one-time code?',
        choices: [
          'It is longer and more complex than any password',
          'The server stores it encrypted with a stronger algorithm',
          'It expires every thirty seconds',
          'It is bound to the legitimate site origin, so a look-alike site cannot obtain a valid signature',
        ],
        answer: 3,
        explain:
          'The private key signs a challenge only for the origin it was registered with, so a fake page gets nothing useful. Length and server-side encryption do not change what a user can be tricked into typing, and short expiry is a property of OTPs, which can still be relayed in real time.',
      },
    },
    { t: 'h', text: 'Emergency access accounts' },
    {
      t: 'p',
      md: 'Si todo el acceso depende de un IdP y de MFA, ¿qué pasa cuando el IdP se cae, falla el proveedor de MFA o los administradores se quedan fuera por un error de configuración? Para eso existen las **emergency access accounts** (cuentas de acceso de emergencia, también llamadas *break-glass*, "rompe el cristal"). Son cuentas privilegiadas reservadas para el peor día. Como son muy poderosas, se diseñan con reglas estrictas:',
    },
    {
      t: 'list',
      items: [
        '**Pocas y de función**, no personales: al menos dos, para no quedarse sin ninguna.',
        '**Independientes de la ruta normal**: no deben depender del mismo IdP o del mismo método de MFA que se supone que han fallado. Eso no significa una exención permanente de MFA: lo habitual es que tengan su propio factor, como una llave de seguridad física dedicada guardada con la credencial.',
        '**Credencial larga y aleatoria**, custodiada fuera de línea (por ejemplo, partida entre dos personas o en un sobre en una caja fuerte), nunca en el gestor de contraseñas diario.',
        '**Vigiladas**: cualquier inicio de sesión genera una alerta inmediata al equipo de seguridad. Si se usa una vez sin incidente declarado, es una investigación.',
        '**Probadas** de forma periódica en un ejercicio controlado, para saber que funcionan antes de necesitarlas.',
        '**Rotadas** tras cada uso real, y cuyo uso queda documentado.',
      ],
    },
    {
      t: 'p',
      md: 'La tensión de diseño es clara: una cuenta que salta los controles normales para poder rescatar al equipo es exactamente lo que un atacante querría tener. Sin vigilancia, una cuenta de emergencia es una puerta trasera con permiso.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'Which statement best describes a well-run emergency access (break-glass) account?',
        choices: [
          'A shared administrator account used daily so everyone knows its password',
          'A rarely used privileged account kept offline, independent of the normal MFA path, alerted on any sign-in and tested periodically',
          'A personal account of the CISO with MFA permanently disabled',
          'A service account whose password never changes so it never fails',
        ],
        answer: 1,
        explain:
          'The account exists for failures of the normal path, so it must not depend on it, and because it is so powerful every use must be alerted and rehearsed in advance. Daily shared use destroys accountability, and a permanent MFA exemption or a never-changing password are weaknesses, not safeguards.',
      },
    },
    { t: 'h', text: 'Cuentas de servicio y gMSA' },
    {
      t: 'p',
      md: 'Una cuenta de servicio la usa un programa, no una persona. El problema clásico es su contraseña: casi nadie la cambia por miedo a romper algo, se comparte entre varias máquinas y vive años. Las **Group Managed Service Accounts (gMSA)** resuelven eso en entornos de directorio Windows: el **dominio genera y rota la contraseña automáticamente**, la entrega solo a los servidores autorizados que ejecutan el servicio, y ninguna persona llega a conocerla ni a teclearla. La cuenta no sirve para iniciar sesión interactiva, así que robarle la contraseña a un humano deja de ser un camino.',
    },
    {
      t: 'table',
      headers: ['Tipo de cuenta de servicio', 'Quién gestiona la contraseña', 'Riesgo principal', 'Mejora'],
      rows: [
        ['Cuenta de servicio clásica', 'Una persona, a mano', 'Contraseña antigua, compartida y rara vez rotada', 'Rotar con proceso o migrar'],
        ['gMSA', 'El dominio, de forma automática', 'Menor; queda el alcance de sus permisos', 'Mínimo privilegio y revisión de qué servidores pueden usarla'],
        ['Identidad gestionada de plataforma cloud', 'La plataforma, sin secreto que guardar', 'Permisos demasiado amplios', 'Rol mínimo por carga de trabajo'],
      ],
    },
    {
      t: 'p',
      md: 'La última fila es la misma idea trasladada a la nube (en el borrador del 801 el nombre explícito es gMSA): quitar al humano de la gestión del secreto. Una cuenta bien gestionada con permisos excesivos sigue siendo un riesgo, por eso el siguiente tema es el alcance.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A Windows service runs on three application servers with one shared service-account password that nobody has changed in four years. Which change best reduces the risk?',
        choices: [
          'Migrate the service to a gMSA so the domain rotates the password automatically',
          'Move the password into a shared spreadsheet that the whole operations team can open',
          'Add the service account to the Domain Admins group so that permission errors can never stop the service',
          'Allow the account to sign in interactively so administrators can test it whenever they like',
        ],
        answer: 0,
        explain:
          'A gMSA removes the human from password management: the domain rotates the secret automatically and only the authorized hosts receive it, and the account cannot be used for interactive sign-in. A shared spreadsheet spreads the secret, Domain Admins grants far more power than the service needs, and interactive sign-in reopens the path a gMSA closes.',
      },
    },
    { t: 'h', text: 'Least privilege access accounts y privilege creep' },
    {
      t: 'p',
      md: 'Las **least privilege access accounts** son cuentas con solo los permisos que la tarea necesita. En la práctica significa **separar** las identidades: una persona con rol de administración tiene una cuenta normal para correo y navegación, y una cuenta distinta, restringida y monitorizada, para tareas administrativas. Así, un phishing al correo diario no entrega las llaves del dominio.',
    },
    {
      t: 'p',
      md: 'El **privilege creep** (también *permission creep*) es la acumulación silenciosa de permisos. Nace de lo cotidiano: alguien cambia de puesto y conserva los accesos del anterior, recibe un permiso temporal para una incidencia y nadie lo retira, o se le añade "por si acaso" a un grupo. Con los años, una cuenta ordinaria acaba reuniendo un poder que nadie aprobó de una sola vez. Es difícil de ver porque cada paso era razonable por separado. En el 701 lo viste en sp4m8 con el nombre de permission creep; el borrador del 801 lo llama privilege creep.',
    },
    {
      t: 'table',
      headers: ['Cómo se acumula', 'Control que lo frena'],
      rows: [
        ['Cambio de puesto sin retirar los permisos antiguos', 'Proceso de movimientos (mover = revisar), con baja de permisos del rol anterior'],
        ['Permisos temporales que nunca caducan', 'Acceso just-in-time o con fecha de caducidad'],
        ['Pertenencia a grupos "por si acaso"', 'Roles definidos y un propietario que aprueba cada grupo'],
        ['Cuentas de personas que ya no están o de terceros', 'Deprovisioning y revisión periódica de cuentas inactivas'],
      ],
    },
    {
      t: 'p',
      md: 'El contrapeso es la **access review** (recertificación de accesos): cada cierto tiempo, el responsable de cada recurso confirma quién sigue necesitando qué, y lo que nadie justifica se retira. Funciona cuando es breve, frecuente en los sistemas más sensibles y con consecuencias reales; se vuelve ritual cuando el revisor aprueba todo sin mirar. Las cuentas privilegiadas, de servicio y de emergencia entran siempre en la revisión.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A long-serving employee has changed teams three times and still holds the permissions of every previous role. Which concept describes this, and which control best addresses it?',
        choices: [
          'Privilege creep; a periodic access review plus removing permissions on role change',
          'Privilege escalation; a stronger password policy',
          'Shadow IT; a content filter',
          'Race condition; code signing',
        ],
        answer: 0,
        explain:
          'Permissions that accumulate across role changes are privilege creep, and the remedy is to review access regularly and to revoke the old role on every move. Privilege escalation is an attack technique, not an administrative accumulation, and password strength does not remove permissions.',
      },
    },
    { t: 'h', text: 'Compromised credential monitoring y buenas prácticas' },
    {
      t: 'p',
      md: 'Aunque la contraseña sea larga y única, puede acabar en una filtración de un tercero. El **compromised credential monitoring** consiste en comparar de forma continua las credenciales de tu organización con colecciones de filtraciones conocidas y con datos de mercados clandestinos, y reaccionar: forzar un cambio, cerrar sesiones y mirar si hubo un uso anómalo. Se aplica también **en el momento de crear o cambiar una contraseña**, rechazando las que ya aparecen en esas listas.',
    },
    {
      t: 'list',
      items: [
        '**Longitud** antes que complejidad: una frase larga y única es mejor que una cadena corta con símbolos.',
        '**Reuse**: ninguna contraseña repetida entre servicios; el gestor de contraseñas lo hace viable.',
        '**Expiration y age**: la guía moderna desaconseja los cambios obligatorios por calendario sin motivo y prefiere cambiar **cuando hay indicio de compromiso**, apoyado por la monitorización anterior.',
        '**Account auditing y policy report**: informes periódicos de cuentas sin MFA, sin uso, con contraseñas antiguas o fuera de política, que alimentan la access review.',
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Cómo encaja todo',
      md: 'Un secreto escrito en un repositorio público, un servicio que corre con una contraseña vieja y una cuenta que acumuló permisos durante años son tres versiones del mismo error: **un acceso que dura más y llega más lejos de lo que nadie decidió**. Las defensas de esta lección apuntan al mismo sitio: que el secreto no esté donde se pueda leer (secrets scanning, secrets manager), que no se pueda reutilizar (passkey, gMSA, credenciales de vida corta) y que el poder se revise (least privilege, access review).',
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Tarea breve',
      md: 'Haz una lista de dónde vive hoy cada secreto de un proyecto tuyo y cuál rotarías primero si se filtrara.',
    },
    {
      t: 'links',
      title: 'Complementa',
      items: [
        { label: 'Vulnerabilidades I: aplicaciones, web, sistema operativo, hardware y zero-day (sp2m4)', href: '/learn/sp2m4' },
        { label: 'Vulnerabilidades II: virtualización, cloud, supply chain, criptografía, misconfiguración y móviles (sp2m5)', href: '/learn/sp2m5' },
        { label: 'Identidad y acceso (sp4m8)', href: '/learn/sp4m8' },
        { label: 'Modelos de arquitectura: cloud, IaC, serverless y microservicios (sp3m1)', href: '/learn/sp3m1' },
      ],
    },
  ],
  quiz: [],
};
