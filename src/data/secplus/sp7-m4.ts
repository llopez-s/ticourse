import type { Module } from '../../lib/types';

/**
 * sp7m4 — Vectores e indicadores nuevos (optional SY0-801 complement).
 * Based on the pre-launch draft objectives (v2.0): 2.3, 2.5 and 5.6.
 * Original wording; fictional examples only, no new Halden canon facts.
 */
export const SP7M4: Module = {
  id: 'sp7m4',
  sectionId: 'sp7',
  title: 'Vectores e indicadores nuevos',
  minutes: 20,
  objectives: [
    'Reconocer los vectores de mensaje, imagen y navegador que el borrador del SY0-801 nombra de forma explícita: RCS, collaboration tools, QR codes, CAPTCHA, extensions y session tokens',
    'Explicar qué son las living-off-the-land tools y por qué el indicador es el comportamiento, no el fichero',
    'Describir los vectores signal-based (Bluetooth, RF y NFC) y el hábito de defensa que corresponde a cada uno',
    'Interpretar indicadores como quishing, deepfake, impossible travel, concurrent sessions, log manipulation y MFA bypass',
    'Guiar un caso de quishing paso a paso desde el punto de vista de quien defiende',
    'Relacionar BEC y el personnel behavior risk scoring con la formación de concienciación',
  ],
  blocks: [
    {
      t: 'callout',
      kind: 'warn',
      title: 'Fuera del SY0-701 · novedad del SY0-801',
      md: 'Esta lección es material **complementario y opcional**. Se basa en el listado de objetivos del SY0-801 (documento v2.0), que es un **borrador previo al lanzamiento**: CompTIA prevé el examen para el 17 de noviembre de 2026 o alrededor, y el listado puede cambiar. Nada de aquí cuenta para el SY0-701, y este material es independiente y no está afiliado a CompTIA.',
    },
    {
      t: 'p',
      md: 'Las lecciones del Dominio 2 te dieron el catálogo clásico de **threat vectors** y de **indicators of malicious activity**. Según el borrador de objetivos del 801, el catálogo crece en tres sitios: el vector se vuelve más concreto (ya no basta «mensajes», se nombran RCS y las herramientas de colaboración), aparecen superficies que antes se daban por supuestas (el navegador, las señales inalámbricas de corto alcance) y entran indicadores que hablan de **identidad y confianza** más que de malware. Para cada novedad vas a ver tres cosas: qué es, cómo se reconoce y qué hábito o control la frena.',
    },
    { t: 'h', text: 'Mensajes, imágenes y herramientas de colaboración' },
    {
      t: 'p',
      md: 'Dentro de los vectores **message-based**, además del correo, **SMS** y mensajería instantánea, el borrador nombra **Rich Communication Services (RCS)**, el sucesor del SMS en muchos móviles: admite imágenes, grupos y enlaces enriquecidos, así que un engaño por RCS se ve más «real» que un SMS plano. También nombra las **collaboration tools** (chats de equipo, canales compartidos, videollamadas): el mensaje llega desde una plataforma que la persona considera interna y por eso baja la guardia. El indicador común es un mensaje inesperado, con urgencia, que empuja a salir del canal para abrir un enlace o a saltarse un procedimiento. El hábito de defensa es tratar un chat interno con la misma desconfianza que el correo, verificar por otro canal las peticiones inusuales y restringir qué invitados externos pueden escribir en los canales.',
    },
    {
      t: 'p',
      md: 'Los vectores **image-based** incluyen los **QR codes**, el **embedded content** (imágenes o bloques incrustados en un mensaje que cargan contenido remoto o esconden un enlace) y el **CAPTCHA**. Un código QR es una URL que tus ojos no pueden leer, así que el filtro de enlaces del correo no la ve si va en una imagen y la persona no la inspecciona antes de escanearla. El CAPTCHA entra como señuelo: una página falsa imita la comprobación de «no soy un robot» para dar apariencia de legitimidad o para pedir un gesto extraño al usuario. Regla práctica: una comprobación legítima nunca te pide ejecutar algo ni copiar nada fuera del navegador.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'An employee receives a chat message in the company collaboration platform from an external guest who joined a shared channel. The message uses an urgent tone and asks her to open a document through a link outside the platform. What is the BEST first reaction?',
        choices: [
          'Open the link, because the platform is internal and therefore trusted',
          'Reply in the channel asking the guest to resend the link',
          'Disable the platform notifications for the channel',
          'Confirm the request through a separate, known channel before opening anything and report it',
        ],
        answer: 3,
        explain:
          'A collaboration tool is a message-based vector, and guests in shared channels do not inherit the trust of internal staff. Verifying out of band and reporting is the habit that breaks the attack. Asking the sender to resend through the same channel proves nothing, and muting notifications hides the problem instead of handling it.',
      },
    },
    { t: 'h', text: 'El navegador: extensions, cookies y session tokens' },
    {
      t: 'p',
      md: 'Los vectores **browser-based** del borrador son las **extensions**, el **JavaScript**, los **password managers**, las **cookies** y los **session tokens**. Piensa en el navegador como un sistema operativo pequeño donde la persona ya está autenticada en todo. Una extensión maliciosa, o una legítima que cambia de manos y recibe una actualización hostil, puede leer lo que ves en cada página. Los **session tokens** son la prueba de que ya iniciaste sesión: quien los copia puede hacerse pasar por ti **sin conocer tu contraseña ni pasar de nuevo por el MFA**, que es justo el atractivo para el atacante. Un password manager concentra las credenciales, así que protegerlo con una clave maestra fuerte, MFA y un navegador actualizado importa más que en cualquier otra aplicación.',
    },
    {
      t: 'p',
      md: 'Los indicadores de este vector son extensiones que nadie instaló a propósito, permisos desmedidos («leer y cambiar todos tus datos en todos los sitios»), sesiones que continúan desde un dispositivo o lugar distinto del habitual y sitios que piden volver a iniciar sesión sin motivo. Los controles: lista blanca de extensiones gestionada por la organización, caducidad corta de las sesiones y reautenticación para acciones sensibles, cookies con los atributos de seguridad activados, cerrar sesión en equipos compartidos y revocar los tokens de una cuenta en cuanto haya sospecha.',
    },
    { t: 'h', text: 'Endpoint: living-off-the-land' },
    {
      t: 'p',
      md: 'En los vectores **endpoint-based** (workstations, servidores, tablets, dispositivos móviles) el borrador añade dos conceptos que se leen juntos: los **trusted devices** y las **built-in tools**, y dentro de ellas las **living-off-the-land tools**. La idea es sencilla y contraintuitiva: el atacante no trae malware propio, sino que usa herramientas que ya vienen con el sistema (intérpretes de comandos, utilidades de administración, planificadores de tareas). Como esas herramientas están firmadas y son legítimas, el antivirus basado en firmas no tiene nada que marcar. Un **fileless malware** vive en memoria y encaja con esta idea, pero la técnica es más amplia que el malware sin fichero.',
    },
    {
      t: 'p',
      md: 'Aquí el indicador no es un hash ni un nombre de archivo, sino el **comportamiento**: una herramienta de administración lanzada por un proceso que nunca debería lanzarla, a una hora rara, con parámetros que ofuscan su contenido, desde la cuenta de un usuario que no es administrador. El control es **baseline + telemetría**: saber qué hace normalmente cada herramienta, registrar la línea de comandos de los procesos, restringir qué herramientas puede usar cada rol (**least privilege**, listas de aplicaciones permitidas) y alertar sobre las combinaciones raras, no solo sobre ficheros.',
    },
    { t: 'h', text: 'Vectores signal-based' },
    {
      t: 'p',
      md: 'El grupo **signal-based** del borrador reúne **Bluetooth**, **radio frequency (RF)** y **near-field communications (NFC)**. No hay cable ni enlace que hacer clic: el atacante necesita estar físicamente cerca (o tener una antena potente) y explotar un emparejamiento débil, una señal sin autenticar o una tarjeta que acepta cualquier lector. En un puerto, donde conviven mandos de grúa por radio, tarjetas de acceso y móviles con auriculares, la superficie es real. Indicadores: dispositivos emparejados que el usuario no reconoce, interferencias o pérdidas de control sin causa, lecturas de tarjeta registradas fuera de su puerta habitual. Hábitos y controles: desactivar Bluetooth y NFC cuando no se usan, no aceptar emparejamientos inesperados, exigir autenticación y cifrado en los enlaces de radio de los sistemas de control y usar credenciales con challenge-response en lugar de identificadores estáticos.',
    },
    {
      t: 'table',
      headers: ['Vector / ataque', 'Indicador', 'Control principal'],
      rows: [
        ['RCS o collaboration tools como canal de engaño', 'Mensaje urgente e inesperado, enlace que saca de la plataforma', 'Verificar por otro canal; limitar invitados externos'],
        ['QR codes (quishing)', 'Código impreso o pegado sobre otro, destino que pide credenciales', 'Previsualizar la URL, formación, MFA resistente al phishing'],
        ['Browser extensions', 'Extensión no solicitada, permisos desmedidos', 'Lista de extensiones permitidas y gestionadas'],
        ['Session tokens robados', 'Sesión activa desde dispositivo o lugar nuevo sin nuevo MFA', 'Caducidad corta, reautenticación, revocación de tokens'],
        ['Living-off-the-land tools', 'Herramienta legítima con parámetros y padre inusuales', 'Baseline, registro de línea de comandos, allowlisting'],
        ['Bluetooth, RF, NFC', 'Emparejamientos desconocidos, lecturas fuera de lugar', 'Desactivar si no se usa, cifrado y autenticación del enlace'],
        ['Deepfake de voz o vídeo', 'Petición excepcional que no admite verificación habitual', 'Contraseña verbal acordada, callback a un número conocido'],
        ['Impossible travel', 'Dos accesos válidos en lugares inalcanzables en ese tiempo', 'Revocar sesiones, restablecer credenciales, acceso condicional'],
        ['Log manipulation', 'Huecos, horas incoherentes o borrados en los registros', 'Logs enviados a un SIEM aparte, inmutables y con hora sincronizada'],
      ],
    },
    { t: 'h', text: 'Indicadores nuevos: quishing, deepfake y señales de identidad' },
    {
      t: 'p',
      md: 'En los ataques de ingeniería social el borrador añade **quishing** (phishing cuyo señuelo es un código QR), **impersonation** y **deepfake**: audio, imagen o vídeo generados o alterados para imitar a una persona real. El deepfake no cambia el patrón (autoridad, urgencia, secreto) sino su credibilidad: ya no basta con reconocer la voz de la directora. Lo que lo delata es lo que pide, no cómo suena: una acción excepcional, fuera del proceso, que se resiste a la verificación. El control es de proceso: una segunda vía de confirmación acordada de antemano, doble aprobación de pagos y cambios sensibles, y una cultura donde comprobar no sea una falta de respeto.',
    },
    {
      t: 'p',
      md: 'Entre los **indicators of compromise** destacan tres que ya conoces a medias. **Impossible travel**: dos inicios de sesión correctos desde lugares que no se pueden recorrer en el tiempo que separa los eventos; la lectura más probable es que alguien más usa una credencial o un token, aunque una VPN o un proxy corporativo pueden producir falsos positivos que se descartan con contexto. **Concurrent sessions**: la misma cuenta activa a la vez en dos sitios incompatibles con un único usuario. **Log manipulation**: el atacante borra o edita registros para ocultar su paso, y se delata por huecos de tiempo, entradas fuera de orden, un servicio de logging detenido o un tamaño de fichero que no cuadra. La defensa es sacar los logs del equipo comprometido casi en tiempo real hacia un almacén de solo escritura. El borrador también lista **MFA bypass** como ataque a credenciales: ya no se roba la contraseña, se roba el segundo factor ya validado (un token de sesión) o se agota al usuario con peticiones hasta que acepta una. Resistir exige factores resistentes al phishing y límites en las notificaciones push.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A cloud identity log shows a successful sign-in for one account from a city on one continent. Eleven minutes later the same account signs in successfully from a city on another continent, and no MFA prompt appears for the second event. What is the MOST likely explanation and best immediate action?',
        choices: [
          'The user traveled quickly; no action is needed',
          'A stolen session token or credential is being used; revoke the sessions and reset the credentials',
          'The log clock is wrong; restart the logging service',
          'The user enabled a corporate VPN; close the alert as a false positive',
        ],
        answer: 1,
        explain:
          'Two valid sign-ins that cannot be physically reached in the elapsed time are the classic impossible travel pattern, and the missing MFA prompt hints at a reused token. A VPN can explain some cases, but it should be confirmed with context before closing the alert, not assumed.',
      },
    },
    { t: 'h', text: 'Escenario guiado: un cartel con un QR en una garita' },
    {
      t: 'p',
      md: 'Imagina este caso ficticio en la Autoridad Portuaria de Halden. Alguien pega un cartel junto a una garita de acceso: «Escanea para consultar el estado de tu cita de recogida». El código lleva a una página con el aspecto del portal de transportistas que pide usuario, contraseña y el código del segundo factor. El defensor lo trabaja así.',
    },
    {
      t: 'list',
      ordered: true,
      items: [
        '**Detectar.** Un conductor avisa de que el cartel «estaba pegado encima de otro». Es la señal humana más valiosa: se registra como incidente aunque nadie haya perdido nada todavía.',
        '**Contener lo físico.** Se retira el cartel, se conserva como prueba y se revisa el CCTV de la zona para saber cuándo apareció y si hay más carteles en otras garitas.',
        '**Analizar el destino sin escanearlo con un móvil de trabajo.** El equipo de seguridad decodifica el QR en un entorno aislado y lee la URL. Marca de alarma: un dominio que se parece al real pero no lo es, o un acortador que oculta el destino.',
        '**Buscar víctimas.** Se cruzan los registros del proxy y del DNS con ese dominio para saber quién lo visitó, y los de autenticación para ver si alguna cuenta inició sesión poco después desde un lugar nuevo.',
        '**Cerrar la puerta.** Se bloquea el dominio, se obliga a cambiar la credencial y se revocan los session tokens de las cuentas que lo visitaron. Si el atacante reenvió el segundo factor en tiempo real, solo la revocación corta el acceso.',
        '**Aprender.** Se avisa a los transportistas por los canales oficiales, se añaden controles para inspeccionar las garitas y se pasa a MFA resistente al phishing, que no se deja engañar por una página falsa.',
      ],
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'After removing a fake QR poster from a gate, the analyst finds that several drivers visited the look-alike login page. Which action BEST limits the damage for the accounts that submitted their details?',
        choices: [
          'Send a reminder email asking drivers not to scan unknown codes',
          'Only block the domain at the web proxy',
          'Reset the credentials and revoke active sessions and tokens for those accounts',
          'Wait until the accounts show suspicious activity',
        ],
        answer: 2,
        explain:
          'Blocking the domain stops new victims but does nothing for credentials and tokens that were already captured. Resetting passwords and revoking sessions is what cuts the attacker off. Awareness messages are useful afterwards, not as the containment step.',
      },
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'During an investigation, an analyst notices that a legitimate, signed administration utility ran at an unusual hour, launched by a document-reader process, with an obfuscated argument. No unknown file was found on disk. Which concept does this BEST describe?',
        choices: [
          'A zero-day in the utility',
          'A rogue device on the network',
          'A watering hole attack',
          'Living-off-the-land tool abuse',
        ],
        answer: 3,
        explain:
          'The attacker used a tool that was already on the system, so no new file exists to detect. The anomaly is in the parent process, the time and the arguments, which is the behavior-based indicator of living-off-the-land activity.',
      },
    },
    { t: 'h', text: 'BEC y personnel behavior risk scoring en la formación' },
    {
      t: 'p',
      md: 'El apartado de concienciación del borrador (5.6) incluye **business email compromise (BEC)** entre los temas de formación habituales, junto a ingeniería social, gestión de credenciales, teletrabajo, BYOD, soportes extraíbles y **situational awareness**. Ya viste el BEC en Dominio 2 como ataque; aquí se plantea como tema que hay que enseñar: el patrón es una petición creíble de pago o de cambio de datos bancarios que parece venir de un directivo o de un proveedor, y lo que lo frena no es un filtro sino un procedimiento (doble aprobación, devolución de llamada a un número ya registrado, nada de cambios de cuenta por correo).',
    },
    {
      t: 'p',
      md: 'Para medir si la formación funciona, el borrador menciona **metrics**, **managerial reports** y el **personnel behavior risk scoring**: una puntuación de riesgo por persona o por grupo basada en conductas observables, como hacer clic en simulacros de phishing, reportar mensajes sospechosos, completar la formación o infringir políticas. Bien usada, sirve para dirigir **targeted training** a quien más lo necesita. Mal usada, castiga y desincentiva reportar. Tres precauciones: puntuar conductas y no personalidades, usar los datos para formar y no para sancionar sin más, y respetar la privacidad y la normativa laboral y de protección de datos.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A security team wants to use a personnel behavior risk scoring program to reduce phishing incidents. Which approach is the MOST appropriate?',
        choices: [
          'Publish a ranking of the highest-risk employees to motivate them',
          'Use observed behaviors to assign targeted training and report aggregated trends to managers',
          'Automatically dismiss anyone who fails two phishing simulations',
          'Score employees only on how fast they complete their training',
        ],
        answer: 1,
        explain:
          'Behavior-based scores are most useful to steer targeted training and to feed aggregated managerial reports. Public rankings and automatic dismissals punish people and discourage reporting, and completion speed alone says little about real risk.',
      },
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Cómo estudiar estas novedades',
      md: 'Si te presentas al SY0-701, esta lección no sustituye nada: es un mapa de lo que viene. Lo útil para ambos exámenes es el método: ante cualquier vector nuevo pregúntate **qué es, qué rastro deja y qué hábito o control lo frena**. Y recuerda que las fuentes pueden cambiar: contrasta siempre con el listado de objetivos oficial vigente de CompTIA.',
    },
    {
      t: 'links',
      title: 'Complementa',
      items: [
        { label: 'Quién ataca: actores de amenaza', href: '/learn/sp2m1' },
        { label: 'Vectores de amenaza y superficie de ataque', href: '/learn/sp2m2' },
        { label: 'Ataques de red, aplicación, criptográficos y de contraseña', href: '/learn/sp2m7' },
      ],
    },
  ],
  quiz: [],
};
