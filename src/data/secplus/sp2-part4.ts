import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP2M7 — Ataques de red, aplicación, criptográficos y de contraseña
// (SY0-701, objetivo 2.4)
// ---------------------------------------------------------------------------
const sp2m7: Module = {
  id: 'sp2m7',
  sectionId: 'sp2',
  title: 'Ataques de red, aplicación, criptográficos y de contraseña',
  minutes: 14,
  objectives: [
    'Reconocer los ataques físicos y de red del objetivo 2.4: brute force físico, RFID cloning, DDoS amplificado y reflejado, DNS, wireless, on-path y credential replay',
    'Identificar los ataques de aplicación (injection, buffer overflow, replay, privilege escalation, forgery y directory traversal) a partir de sus indicadores',
    'Diferenciar los ataques criptográficos downgrade, collision y birthday',
    'Distinguir password spraying de brute force por el patrón que dejan en los logs',
    'Asociar cada ataque con su indicador típico y su mitigación más directa',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior cubría el malware; esta cierra el objetivo 2.4 con el resto de **indicators of malicious activity**: lo que un atacante hace contra el edificio, la red, la aplicación, la criptografía y las contraseñas. El examen rara vez pregunta la definición; describe un **síntoma** (un log, una gráfica de tráfico, una URL extraña) y espera que nombres el ataque. Como analista, tu objetivo aquí es construir el mapa síntoma → ataque → mitigación, porque esa es exactamente la estructura de las preguntas.',
    },
    { t: 'h', text: 'Ataques físicos y de red' },
    {
      t: 'p',
      md: 'CompTIA agrupa tres ataques físicos. El **brute force** físico es literalmente forzar una puerta, romper una cerradura o arrancar un armario de comunicaciones; su indicador es el daño visible y su mitigación son barreras más resistentes y detección (alarmas, CCTV). El **RFID cloning** copia la señal de una tarjeta de acceso de proximidad con un lector portátil —basta pasar cerca de la víctima en el ascensor— y reproduce después un duplicado funcional; se mitiga con tarjetas que usan **challenge-response** cifrado en lugar de emitir un identificador estático, fundas bloqueantes y MFA en puertas sensibles. Los ataques **environmental** apuntan a lo que el hardware necesita para funcionar: cortar la alimentación, sabotear el HVAC para que el CPD se sobrecaliente o inundar una sala; se mitigan con UPS, generadores, sensores de temperatura y humedad y control de acceso a las salas técnicas.',
    },
    {
      t: 'p',
      md: 'Un **DDoS** satura un servicio con más tráfico del que puede absorber, desde muchos orígenes a la vez. Dos variantes tienen nombre propio. En un ataque **reflected**, el atacante envía peticiones a servidores legítimos de terceros **falsificando la IP de origen** con la de la víctima, de modo que todas las respuestas llegan a la víctima y el atacante queda oculto. En un ataque **amplified**, la petición es pequeña y la respuesta es enorme (una consulta DNS de 60 bytes puede devolver 3.000 bytes; NTP `monlist` multiplica aún más), así que un ancho de banda modesto se convierte en una inundación. La **DNS amplification** clásica combina las dos: reflejada porque usa resolvers abiertos, amplificada porque las respuestas son mucho mayores que las consultas. La mitigación combina filtrado en el proveedor, capacidad redundante y, en origen, que los operadores cierren sus resolvers abiertos. Los **DNS attacks** manipulan la traducción nombre → IP. En el **DNS poisoning** (o spoofing) el atacante consigue introducir una respuesta falsa en la caché de un resolver, y todos los clientes que dependen de él van a la IP maliciosa; **DNSSEC** firma las respuestas para que la falsificación se detecte. En el **DNS hijacking** se cambia la configuración legítima —el registro en el registrador, el resolver que usa un router doméstico— de modo que el dominio entero apunta a donde el atacante quiere; el indicador es que el registro *whois* o los name servers cambian sin ticket de cambio. Los ataques **wireless** más preguntados son el **evil twin** (un punto de acceso con el mismo SSID que el legítimo para que las víctimas se conecten a él), el **rogue AP** (un AP no autorizado conectado a la red cableada, a menudo por un empleado bienintencionado) y la **deauthentication** (tramas de gestión falsas que expulsan a los clientes, normalmente para forzar reconexiones y capturar el handshake o empujarlos hacia el evil twin). WPA3 y **802.11w** (protected management frames) mitigan la deauth; un **WIDS/WIPS** detecta APs no autorizados.',
    },
    {
      t: 'p',
      md: 'El **on-path attack** (antes *man-in-the-middle*) coloca al atacante entre dos partes que creen hablar directamente: puede leer y modificar el tráfico. **ARP poisoning** en la LAN y el evil twin en Wi-Fi son formas habituales de conseguir esa posición; TLS con validación de certificados y **dynamic ARP inspection** son las defensas. En el **credential replay** el atacante captura un token de autenticación (un hash NTLM, una cookie de sesión, un ticket Kerberos) y lo reenvía tal cual para autenticarse sin conocer la contraseña; los **nonces**, timestamps, tokens de un solo uso y el enlazar la sesión al canal TLS lo neutralizan. Por último, CompTIA lista **malicious code** como indicador de red: scripts, exploits o payloads que viajan dentro del tráfico (un PowerShell codificado en base64 en una petición HTTP, un fichero con macros en un adjunto) y que un IPS o un sandbox de correo pueden detectar.',
    },
    {
      t: 'check',
      q: {
        q: 'Port authority monitoring shows the public web server receiving a flood of large DNS responses from hundreds of open resolvers around the world, although the server never sent any DNS queries. Which attack type BEST describes this?',
        choices: [
          'DNS poisoning',
          'On-path attack',
          'Reflected and amplified DDoS',
          'Deauthentication attack',
        ],
        answer: 2,
        explain:
          'The server receives responses to queries it never sent (spoofed source, so reflected) and the responses are large (amplified): a DNS amplification DDoS. DNS poisoning is the tempting distractor because DNS is involved, but poisoning corrupts a resolver\'s cache to redirect users; it does not flood a victim with traffic.',
      },
    },
    {
      t: 'p',
      md: 'Los ataques de aplicación explotan cómo el software trata la entrada. En una **injection** (SQL, command, LDAP) los datos que introduce el usuario se interpretan como código porque nadie los validó; el indicador son comillas, `OR 1=1` o `;` en campos de formulario, y la mitigación es **input validation** y consultas parametrizadas. En un **buffer overflow** la entrada excede el espacio reservado en memoria y sobrescribe lo adyacente, incluida la dirección de retorno, lo que permite ejecutar código; los indicadores son *crashes* repetidos del proceso y la mitigación es validar longitudes, usar lenguajes seguros en memoria y activar **ASLR/DEP**. El **replay** de aplicación reenvía una petición legítima capturada (una transferencia, un cambio de contraseña); nonces y timestamps lo evitan. La **privilege escalation** convierte un acceso limitado en uno privilegiado —**vertical** de usuario a administradora, **horizontal** de un usuario a otro del mismo nivel— y se detecta por cuentas normales que de pronto ejecutan acciones administrativas. CompTIA llama **forgery** a dos ataques distintos. En el **cross-site request forgery (CSRF)** el atacante hace que el navegador de una usuaria ya autenticada envíe una petición que ella no quería (un enlace en un correo que, al abrirse, cambia el email de recuperación de su cuenta); la web confía en la cookie de sesión y ejecuta la orden. Se mitiga con **anti-CSRF tokens** y cookies *SameSite*. En el **server-side request forgery (SSRF)** el atacante convence al **servidor** para que haga peticiones en su nombre (por ejemplo, pasando una URL interna a una función que descarga imágenes), llegando a servicios que desde fuera son inalcanzables, como el endpoint de metadatos de una nube. El **directory traversal** usa secuencias `../` (a veces codificadas como `%2e%2e%2f`) en un parámetro de ruta para salir del directorio permitido y leer ficheros como `/etc/passwd` o `web.config`. La defensa es canonicalizar la ruta y comprobar que queda dentro del directorio autorizado, nunca filtrar solo la cadena literal.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Dos patrones que debes reconocer a simple vista',
      text: `# 1) Directory traversal en el log del servidor web (la codificación %2e%2e%2f es "../")
GET /gate/viewdoc?file=../../../../etc/passwd HTTP/1.1            200  1834
GET /gate/viewdoc?file=%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fshadow   403     0

# 2) Password spraying en el log de autenticación (muchas cuentas, UNA contraseña, ritmo lento)
2026-09-04 03:10:02  LOGIN FAIL  user=a.berg      src=185.22.9.41  reason=bad_password
2026-09-04 03:10:41  LOGIN FAIL  user=j.solheim   src=185.22.9.41  reason=bad_password
2026-09-04 03:11:19  LOGIN FAIL  user=m.lund      src=185.22.9.41  reason=bad_password
2026-09-04 03:11:58  LOGIN FAIL  user=k.nyborg    src=185.22.9.41  reason=bad_password
2026-09-04 03:12:37  LOGIN OK    user=r.haugen    src=185.22.9.41
# ... una prueba por cuenta, ~40 s entre intentos: ninguna cuenta alcanza el umbral de lockout`,
    },
    {
      t: 'check',
      q: {
        q: 'A web application at the port authority lets users download shipping manifests with the URL parameter ?doc=manifest_2291.pdf. An analyst notices requests where the parameter contains repeated ../ sequences followed by system file names. Which attack is being attempted?',
        choices: [
          'SQL injection',
          'Cross-site request forgery',
          'Directory traversal',
          'Buffer overflow',
        ],
        answer: 2,
        explain:
          'Dot-dot-slash sequences in a file path parameter are the signature of directory traversal, an attempt to read files outside the intended folder. SQL injection is the tempting distractor because both abuse a parameter, but injection uses database syntax such as quotes and OR 1=1, not path navigation.',
      },
    },
    { t: 'h', text: 'Ataques criptográficos y de contraseña' },
    {
      t: 'p',
      md: 'En un **downgrade attack** el atacante, normalmente desde una posición on-path, manipula la negociación inicial para que las dos partes acaben usando una versión o cifrado **más débil** de lo que ambas soportan (forzar TLS 1.0 en lugar de 1.3, o un cifrado exportable), y después rompe ese cifrado débil. El indicador es una negociación a protocolos obsoletos que la política prohíbe; la mitigación es **deshabilitar** las versiones antiguas en servidor y cliente, no solo preferir las nuevas. Una **collision** ocurre cuando dos entradas distintas producen el **mismo hash**; si el atacante puede fabricar un documento malicioso con el mismo hash que uno legítimo, la firma digital del original valida también al falso. MD5 y SHA-1 tienen colisiones prácticas y por eso el examen siempre prefiere **SHA-256** o superior. El **birthday attack** es la matemática que hace las colisiones más baratas de lo intuitivo: igual que en un grupo de 23 personas hay un 50 % de probabilidad de que dos compartan cumpleaños, encontrar *cualquier* par de entradas que colisionen requiere aproximadamente 2^(n/2) intentos para un hash de n bits, no 2^n. La conclusión práctica es la misma: usar hashes largos y modernos.',
    },
    {
      t: 'p',
      md: 'En los ataques de contraseña, el patrón lo dice todo. Un **brute force** de contraseña prueba **muchas contraseñas contra una cuenta** (a menudo con un diccionario primero y fuerza bruta pura después). Su indicador es una cuenta con cientos de fallos seguidos, y el **account lockout** lo detiene en seco. El **password spraying** invierte la matriz: prueba **una o dos contraseñas muy comunes contra muchas cuentas** («Halden2026!», «Verano2026»), esperando que alguien la use; como cada cuenta recibe solo uno o dos intentos, **nunca dispara el lockout**. Su indicador es un mismo origen fallando contra decenas de usuarios diferentes con pocos intentos cada uno, a menudo con ritmo lento y repartido entre horas. Se mitiga con **MFA**, listas de contraseñas prohibidas, detección por origen en el SIEM y bloqueo por IP, no por cuenta. Ambos ataques se vuelven irrelevantes frente a la MFA, que es por eso la respuesta preferida del examen cuando la pregunta pide la mitigación *más eficaz*.',
    },
    {
      t: 'table',
      headers: ['Ataque', 'Indicador típico', 'Mitigación más directa'],
      rows: [
        ['Reflected/amplified DDoS', 'Respuestas masivas a peticiones que la víctima nunca envió', 'Servicio anti-DDoS, filtrado en el ISP, cerrar resolvers abiertos'],
        ['DNS poisoning', 'Un dominio conocido resuelve a una IP inesperada desde un resolver concreto', 'DNSSEC, vaciar y proteger la caché del resolver'],
        ['Evil twin', 'Dos SSID idénticos, uno con señal más fuerte y sin el certificado corporativo', 'WPA3-Enterprise con validación de certificado, WIPS'],
        ['On-path', 'Certificados inesperados, tablas ARP con MAC duplicadas', 'TLS con validación estricta, dynamic ARP inspection'],
        ['Credential replay', 'Autenticación válida desde un host o hora imposibles, sin fallo previo', 'Nonces, timestamps, tokens de un solo uso'],
        ['Injection', 'Comillas, OR 1=1 o ; en parámetros de entrada', 'Input validation, consultas parametrizadas'],
        ['Buffer overflow', 'Crashes repetidos del servicio con entradas largas', 'Validar longitudes, ASLR/DEP, lenguajes memory-safe'],
        ['CSRF', 'Acciones sensibles ejecutadas por usuarios autenticados que no las pidieron', 'Anti-CSRF tokens, cookies SameSite'],
        ['Directory traversal', 'Secuencias ../ o %2e%2e%2f en parámetros de ruta', 'Canonicalizar rutas y confinarlas al directorio permitido'],
        ['Downgrade', 'Negociaciones TLS a versiones prohibidas', 'Deshabilitar protocolos y cifrados antiguos'],
        ['Collision / birthday', 'Dos ficheros distintos con el mismo MD5 o SHA-1', 'Migrar a SHA-256 o superior'],
        ['Password spraying', 'Un origen, muchas cuentas, pocos fallos por cuenta', 'MFA, lista de contraseñas prohibidas, correlación por origen'],
        ['Brute force', 'Una cuenta, cientos de fallos consecutivos', 'Account lockout, MFA'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen',
      md: 'Dos distinciones que caen una y otra vez. **Spraying vs. brute force**: no mires el volumen total, mira la **forma**. *Muchos usuarios, pocas contraseñas* → spraying (y por eso el lockout no salta); *un usuario, muchas contraseñas* → brute force. Si el escenario menciona que «no se disparó ningún bloqueo de cuenta», está señalando spraying. **DNS amplification** es simultáneamente **reflected** (la víctima recibe respuestas a peticiones falsificadas) y **amplified** (la respuesta es mucho mayor que la petición); si la pregunta pide un solo término, «amplification» suele ser la respuesta, pero reconoce que ambas etiquetas son correctas. Y recuerda: cuando pidan la **mitigación más eficaz** contra cualquier ataque de contraseña, la respuesta es **MFA**, no una política de contraseñas más larga.',
    },
    {
      t: 'check',
      q: {
        q: 'Over a single night, the identity provider logs one failed login for each of 900 different port authority accounts, all from the same external IP address and all using the password Halden2026!. No account was locked out. Which attack is this?',
        choices: [
          'Brute force',
          'Credential replay',
          'Password spraying',
          'Downgrade attack',
        ],
        answer: 2,
        explain:
          'One common password tried once across many accounts, deliberately staying under the lockout threshold, is password spraying. Brute force is the tempting distractor because it is also a guessing attack, but it targets a single account with many passwords and would trigger lockout quickly.',
      },
    },
    {
      t: 'p',
      md: 'Ya sabes leer un log o una gráfica y ponerle nombre al ataque, y para cada uno tienes una mitigación en la punta de la lengua. La última lección del dominio ordena esas mitigaciones en un catálogo: **segmentation, access control, allow lists, isolation, patching, encryption, monitoring, least privilege, configuration enforcement, decommissioning** y las técnicas de **hardening** que aplicarás a cada host nuevo antes de conectarlo a la red.',
    },
  ],
  quiz: [
    {
      id: 'sp2m7q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A security analyst reviews authentication logs and finds that a single source IP attempted to log in to 400 different user accounts overnight, trying only two passwords against each account. No lockouts occurred. Which attack is MOST likely taking place?',
      choices: ['Brute force', 'Password spraying', 'Credential replay', 'On-path attack'],
      answer: 1,
      explain:
        'A few common passwords tested against many accounts, deliberately below the lockout threshold, is the signature of password spraying. Brute force is the tempting distractor, but it concentrates many attempts on one account and would have triggered lockouts.',
    },
    {
      id: 'sp2m7q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A company\'s public website becomes unreachable. Network captures show enormous volumes of NTP and DNS responses arriving from thousands of legitimate servers that the company never queried. Which attack characteristics are present?',
      choices: [
        'Reflected and amplified DDoS',
        'DNS hijacking and evil twin',
        'On-path attack with downgrade',
        'Application replay and injection',
      ],
      answer: 0,
      explain:
        'Responses arriving from third-party servers to requests the victim never sent indicate spoofed source addresses (reflection), and DNS and NTP produce responses far larger than the queries (amplification). DNS hijacking is the tempting distractor because DNS is involved, but hijacking redirects name resolution rather than flooding a target with traffic.',
    },
    {
      id: 'sp2m7q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Employees at a shipping terminal report that their laptops keep disconnecting from the corporate Wi-Fi and then reconnecting to a network with the same name but a much stronger signal that does not present the corporate certificate. Which TWO attacks are MOST likely being combined?',
      choices: [
        'DNS poisoning and credential replay',
        'Rogue AP and buffer overflow',
        'RFID cloning and on-path attack',
        'Deauthentication and evil twin',
      ],
      answer: 3,
      explain:
        'Forced disconnections come from spoofed deauthentication frames, and the look-alike network with a stronger signal is an evil twin set up to capture the reconnecting clients. A rogue AP is a tempting distractor, but that term describes an unauthorized access point plugged into the wired network, not one impersonating the corporate SSID.',
    },
    {
      id: 'sp2m7q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A web application log contains the request GET /reports?file=..%2f..%2f..%2fetc%2fpasswd. Which mitigation would MOST directly prevent this attack from succeeding?',
      choices: [
        'Enabling account lockout after five failed logins',
        'Using parameterized SQL queries',
        'Canonicalizing the requested path and restricting it to the allowed directory',
        'Adding anti-CSRF tokens to every form',
      ],
      answer: 2,
      explain:
        'The encoded ../ sequences are a directory traversal attempt, and the correct defense is to resolve the path and verify it stays inside the permitted folder. Parameterized queries are the tempting distractor because they are the classic input-handling fix, but they stop SQL injection, not file path manipulation.',
    },
    {
      id: 'sp2m7q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An attacker on the same LAN manipulates the TLS negotiation so that a client and a server agree on TLS 1.0 with an export-grade cipher, even though both support TLS 1.3. Which attack is being performed, and what is the BEST mitigation?',
      choices: [
        'Collision attack; migrate to SHA-256',
        'Downgrade attack; disable legacy protocol versions and ciphers on both ends',
        'Birthday attack; increase key length',
        'Replay attack; add nonces to each session',
      ],
      answer: 1,
      explain:
        'Forcing two parties to negotiate weaker cryptography than they both support is a downgrade attack, and the only reliable fix is to remove the weak options entirely so they cannot be negotiated. Replay is the tempting distractor because the attacker is also on-path, but nothing is being re-sent; the negotiation itself is being manipulated.',
    },
    {
      id: 'sp2m7q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A security researcher demonstrates two different PDF files that produce identical SHA-1 hashes, meaning a digital signature on one would also validate the other. Which type of cryptographic attack does this demonstrate?',
      choices: ['Downgrade', 'Credential replay', 'Collision', 'Injection'],
      answer: 2,
      explain:
        'Two distinct inputs producing the same hash is by definition a collision, which undermines any signature or integrity check built on that hash function. Downgrade is the tempting distractor because SHA-1 is a weak algorithm, but downgrade refers to forcing a weaker negotiation, not to finding matching hashes.',
    },
    {
      id: 'sp2m7q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A logged-in finance user clicks a link in an email. Without any further action on her part, the accounting portal changes the bank account associated with a supplier. The portal only checked that a valid session cookie was present. Which attack occurred?',
      choices: [
        'Server-side request forgery',
        'Privilege escalation',
        'Buffer overflow',
        'Cross-site request forgery',
      ],
      answer: 3,
      explain:
        'The attacker made the victim\'s own browser send an unwanted request that the application accepted because of the existing session, which is cross-site request forgery. SSRF is the tempting distractor because it is the other forgery on the objective list, but SSRF tricks the server into making requests, not the user\'s browser.',
    },
    {
      id: 'sp2m7q8',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An organization has suffered both brute-force and password-spraying attacks against its remote access portal. Which single control would MOST effectively reduce the risk from both attacks?',
      choices: [
        'Increasing the minimum password length to 16 characters',
        'Locking accounts after three failed attempts',
        'Requiring multifactor authentication for all remote logins',
        'Deploying DNSSEC on the authoritative name servers',
      ],
      answer: 2,
      explain:
        'MFA makes a guessed password insufficient on its own, neutralizing both attacks at once. Account lockout is the tempting distractor because it stops brute force, but spraying is designed to stay below lockout thresholds, and a stricter lockout policy can even be abused to cause a denial of service.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP2M8 — Técnicas de mitigación y hardening (SY0-701, objetivo 2.5)
// ---------------------------------------------------------------------------
const sp2m8: Module = {
  id: 'sp2m8',
  sectionId: 'sp2',
  title: 'Técnicas de mitigación y hardening',
  minutes: 13,
  objectives: [
    'Explicar el propósito de cada técnica de mitigación del objetivo 2.5: segmentation, access control, allow list, isolation, patching, encryption, monitoring, least privilege, configuration enforcement y decommissioning',
    'Elegir la mitigación más adecuada («BEST») para un escenario concreto',
    'Enumerar las técnicas de hardening de un host: encryption, endpoint protection, host-based firewall, HIPS, deshabilitar puertos y protocolos, cambiar contraseñas por defecto y eliminar software innecesario',
    'Aplicar un checklist de hardening a un servidor nuevo antes de ponerlo en producción',
    'Describir qué implica retirar un sistema de forma segura (decommissioning)',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El objetivo 2.5 es el reverso de todo el dominio: después de tres lecciones de actores, vectores, vulnerabilidades y ataques, aquí está el catálogo de lo que **reduce** el riesgo. El examen lo evalúa casi siempre con preguntas de tipo «which of the following would BEST mitigate…», así que no basta con conocer cada técnica: tienes que saber **cuál encaja mejor** con el síntoma descrito. Piensa en cada técnica como una respuesta a una pregunta concreta: ¿cómo evito que el atacante se mueva? ¿cómo evito que ejecute? ¿cómo evito que lea? ¿cómo me entero?',
    },
    { t: 'h', text: 'Segmentación, control de acceso y allow lists' },
    {
      t: 'p',
      md: 'La **segmentation** divide la red en zonas (VLANs, subredes, zonas de firewall, microsegmentación en la nube) de modo que un compromiso en una zona no dé acceso automático a las demás. Su beneficio clave es limitar el **lateral movement**: si la estación de una recepcionista está en la misma red plana que los servidores de control de grúas, un phishing en recepción es un incidente OT; segmentada, es un incidente de una VLAN. El **access control** —**ACLs** en routers y firewalls, **permissions** sobre ficheros y carpetas— decide qué identidad o qué dirección puede alcanzar qué recurso; la lección sobre AAA del Dominio 1 ya te dio el vocabulario. Un **application allow list** (antes *whitelist*) permite ejecutar **solo** el software aprobado y bloquea todo lo demás; es mucho más fuerte que un **deny list**, que solo bloquea lo que ya conoce y deja pasar cualquier binario nuevo. El allow list es la respuesta cuando el escenario dice que «siguen apareciendo ejecutables desconocidos» o que el antivirus no reconoce el malware.',
    },
    {
      t: 'check',
      q: {
        q: 'After a phishing email compromised one workstation at the Halden Port Authority, the attacker was able to reach the crane control servers directly because everything shared a single flat network. Which mitigation would BEST prevent this from happening again?',
        choices: [
          'Full-disk encryption on the workstation',
          'Network segmentation with firewall rules between zones',
          'Changing default passwords on the crane servers',
          'Removing unnecessary software from the workstation',
        ],
        answer: 1,
        explain:
          'The problem described is lateral movement from one host to critical systems, and segmentation is the control that confines an intrusion to its zone. Changing default passwords is the tempting distractor because it hardens the servers, but it does nothing to stop the attacker from reaching them in the first place.',
      },
    },
    { t: 'h', text: 'Aislamiento, parcheo, cifrado y monitorización' },
    {
      t: 'p',
      md: 'La **isolation** va un paso más allá de la segmentación: separa completamente un sistema o un proceso. El **sandboxing** ejecuta código sospechoso en un entorno contenido donde no puede tocar el sistema real; el **air gap** desconecta físicamente una red crítica de cualquier otra; la **quarantine** (de un host infectado, de un adjunto) lo aparta hasta que se analiza. **Patching** elimina la vulnerabilidad en su raíz y es casi siempre la mejor respuesta cuando el escenario menciona una **known vulnerability** o un CVE; cuando no se puede parchear, recuerda el compensating control del Dominio 1. La **encryption** protege la confidencialidad de los datos **at rest** (full-disk, base de datos), **in transit** (TLS, VPN) y, en su forma moderna, **in use**; es la mitigación cuando el riesgo es que alguien lea lo que no debe: un portátil robado, un backup extraviado, tráfico interceptado. El **monitoring** —logs centralizados en un SIEM, alertas, revisión periódica— no evita el ataque pero reduce el **dwell time**: es la respuesta cuando la pregunta insiste en «detect» o en «notice sooner».',
    },
    { t: 'h', text: 'Least privilege, configuration enforcement y decommissioning' },
    {
      t: 'p',
      md: '**Least privilege** limita cada cuenta, servicio y proceso a los permisos mínimos que necesita; su efecto sobre un ataque es que el compromiso de una identidad vale menos. Si el escenario describe a un usuario normal con derechos de administradora local, o un servicio ejecutándose como *SYSTEM* sin necesidad, la respuesta es least privilege. El **configuration enforcement** garantiza que los sistemas cumplen una **secure baseline** y la mantienen: **Group Policy** en Windows, **MDM** en móviles, herramientas de gestión de configuración en servidores, todas capaces de **detectar y corregir el drift** (un administrador que activó SMBv1 «para probar» y lo dejó así). Por último, el **decommissioning**: retirar un sistema sin dejar cabos sueltos. Implica **sanitizar** el soporte de almacenamiento (borrado criptográfico, sobrescritura o destrucción física según la clasificación), revocar sus certificados y credenciales, eliminarlo del inventario, del DNS, de las reglas de firewall y de la monitorización, y documentar todo. Un servidor «apagado» que sigue en DNS y con reglas abiertas es un activo fantasma que el atacante puede resucitar.',
    },
    {
      t: 'check',
      q: {
        q: 'A port authority server is being retired. The disk is wiped, but three months later a penetration tester finds that the server\'s hostname still resolves in DNS, its firewall rules are still active, and its TLS certificate has not been revoked. Which mitigation technique was performed incompletely?',
        choices: [
          'Configuration enforcement',
          'Isolation',
          'Decommissioning',
          'Patching',
        ],
        answer: 2,
        explain:
          'Decommissioning covers the entire lifecycle end: sanitizing storage, revoking certificates, and removing the system from DNS, firewall rules, inventory, and monitoring; only the first step was done. Configuration enforcement is the tempting distractor because stale records look like drift, but that technique keeps live systems aligned to a baseline rather than retiring them.',
      },
    },
    { t: 'h', text: 'Hardening: endurecer cada host' },
    {
      t: 'p',
      md: 'El **hardening** reduce la **attack surface** de un sistema concreto. CompTIA lista siete técnicas. La **encryption** (aquí, cifrado de disco en cada equipo). La **endpoint protection**: antivirus tradicional y sobre todo **EDR**, que además de firmas observa comportamiento y permite responder. El **host-based firewall**, que filtra el tráfico que entra y sale de ese equipo con independencia del firewall de red, esencial para portátiles fuera de la oficina. El **host-based intrusion prevention system (HIPS)**, que inspecciona la actividad en el host y **bloquea** patrones maliciosos (a diferencia de un HIDS, que solo alerta). **Disabling ports/protocols**: cada servicio que escucha es una puerta; si el servidor web no necesita FTP, Telnet, SMBv1 ni el puerto 3389 abierto a Internet, se cierran. **Default password changes**: las credenciales de fábrica de routers, cámaras IP, PLCs y consolas de gestión están publicadas en Internet y son la primera prueba de cualquier atacante o gusano. Y **removal of unnecessary software**: cada aplicación instalada es código que hay que parchear y que puede ser explotado; un servidor de base de datos no necesita navegador ni suite ofimática.',
    },
    {
      t: 'list',
      ordered: true,
      items: [
        'Instalar desde una **imagen base aprobada** y aplicar la **secure baseline** de la organización (CIS Benchmark o equivalente) mediante la herramienta de configuration enforcement.',
        'Aplicar **todos los parches** del sistema operativo y del software instalado antes de exponer el servidor a ninguna red que no sea la de despliegue.',
        'Cambiar **todas las contraseñas por defecto** (SO, BMC/iLO/iDRAC, bases de datos, consolas web) y crear cuentas nominales con **least privilege**; deshabilitar o renombrar las cuentas genéricas.',
        'Eliminar el **software y los roles innecesarios**: herramientas de desarrollo, navegadores, servicios de ejemplo, módulos del servidor web que no se usan.',
        'Deshabilitar **puertos, protocolos y servicios** no requeridos (Telnet, FTP, SMBv1, SNMPv1/v2, RDP hacia Internet) y documentar los que quedan abiertos con su justificación.',
        'Activar el **host-based firewall** con política de denegación por defecto y reglas explícitas solo para los servicios documentados.',
        'Desplegar **endpoint protection (EDR)** y, donde aplique, **HIPS**, y confirmar que reportan a la consola central.',
        'Activar el **cifrado de disco** y del almacenamiento de secretos; comprobar que las claves están custodiadas fuera del propio servidor.',
        'Configurar el **envío de logs al SIEM** (autenticación, cambios de configuración, eventos de seguridad) y verificar que llegan.',
        'Colocar el servidor en la **VLAN/zona correcta** con las ACL correspondientes, ejecutar un **vulnerability scan** de confirmación, y registrar el sistema en el **inventario** con propietaria y fecha de revisión.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A newly built database server for the port authority still has the vendor\'s installation defaults: an administrative web console reachable on port 8080, a sample database with a known password, and a bundled FTP service. Which hardening actions BEST address these findings?',
        choices: [
          'Enable full-disk encryption and forward logs to the SIEM',
          'Change default passwords, remove the sample database and FTP service, and disable unneeded ports',
          'Move the server to an isolated VLAN and install a HIPS',
          'Apply the latest operating system patches and reboot',
        ],
        answer: 1,
        explain:
          'Each finding maps to a specific hardening technique: default password changes, removal of unnecessary software, and disabling unneeded ports and protocols. Segmentation and HIPS are the tempting distractors because they add protection, but they leave the vendor defaults in place for anyone who does reach the server.',
      },
    },
    {
      t: 'table',
      headers: ['Escenario', 'Mitigación BEST', 'Por qué'],
      rows: [
        ['Un host comprometido permitió alcanzar servidores críticos en la misma red', 'Segmentation', 'Confina el lateral movement a una zona'],
        ['Siguen ejecutándose binarios desconocidos que el antivirus no reconoce', 'Application allow list', 'Solo corre lo aprobado, sin depender de firmas'],
        ['Un CVE crítico conocido afecta al servidor web', 'Patching', 'Elimina la vulnerabilidad en origen'],
        ['Hay que analizar un adjunto sospechoso sin arriesgar el equipo', 'Isolation (sandboxing)', 'El código corre en un entorno contenido'],
        ['Un portátil con datos de clientes se pierde en un aeropuerto', 'Encryption (full-disk)', 'Sin la clave, los datos son ilegibles'],
        ['Una usuaria normal tiene derechos de administradora local', 'Least privilege', 'Reduce el valor de un compromiso de cuenta'],
        ['Administradores activan servicios prohibidos y la baseline se degrada', 'Configuration enforcement', 'Detecta y corrige el drift automáticamente'],
        ['Un servicio retirado sigue en DNS con reglas de firewall abiertas', 'Decommissioning completo', 'Elimina el activo fantasma de todos los sistemas'],
        ['Tardan meses en detectar intrusiones', 'Monitoring (SIEM, alertas)', 'Reduce el dwell time'],
        ['Portátiles que trabajan fuera de la oficina sin protección de red', 'Host-based firewall + EDR', 'La protección viaja con el equipo'],
        ['Cámaras IP accesibles con la contraseña del fabricante', 'Default password changes', 'Cierra el vector más barato para gusanos y botnets'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: tres reflejos',
      md: 'Cuando la pregunta describe **lateral movement** tras el compromiso de un solo host, la respuesta es **segmentation**. Cuando dice que **ejecutables desconocidos siguen corriendo** o que el antivirus «no los detecta», la respuesta es **application allow list**, no «actualizar las firmas». Cuando un **dispositivo abandona la organización** (se vende, se devuelve al proveedor, se recicla), la respuesta es **decommissioning con sanitización** del soporte, y si la pregunta ofrece «borrar los ficheros» como opción, es un distractor: borrar no sanitiza. Un matiz de vocabulario: **HIPS** *bloquea*, **HIDS** solo *avisa*; si el escenario pide «prevent» en el host, es HIPS. Y en general, casi todas las opciones son controles válidos: el examen premia el que ataca la **causa** descrita. Localiza el verbo del fallo —¿*llegó* (segmentation, ACL)? ¿*ejecutó* (allow list)? ¿*leyó* (encryption)? ¿*aprovechó un fallo conocido* (patching)? ¿*nadie se enteró* (monitoring)?— y tendrás la técnica.',
    },
    {
      t: 'p',
      md: 'Con esto cierras el Dominio 2: sabes quién ataca y por qué, por dónde entra, qué debilidades busca, cómo se ven sus ataques en los logs y qué técnica reduce cada riesgo. El Dominio 3, **Security Architecture**, toma estas mitigaciones y las convierte en diseño: dónde colocar la segmentación y los firewalls en una arquitectura empresarial, cómo aplicar aislamiento y least privilege en la nube, en infraestructura como código y en entornos OT, y cómo proteger los datos según su estado y su clasificación. Lo que aquí era «la mitigación correcta para un escenario» pasa a ser «la arquitectura correcta para una organización».',
    },
  ],
  quiz: [
    {
      id: 'sp2m8q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A ransomware infection on a single receptionist workstation spread within minutes to file servers, the HR database, and the badge management system, all of which were on the same subnet. Which mitigation would have BEST limited the spread?',
      choices: [
        'Network segmentation',
        'Full-disk encryption on the servers',
        'Removing unnecessary software from the workstation',
        'Changing default passwords',
      ],
      answer: 0,
      explain:
        'The harm came from unrestricted lateral movement across a flat network, which segmentation directly constrains. Encryption at rest is the tempting distractor because ransomware involves encryption, but disk encryption protects data from a thief who steals the drive, not from malware running on a live, authenticated system.',
    },
    {
      id: 'sp2m8q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Despite up-to-date antivirus signatures, employees at a terminal keep running previously unseen malicious executables received through personal email. Which control would MOST effectively stop this?',
      choices: [
        'A deny list of known malware hashes',
        'Application allow listing',
        'A host-based intrusion detection system',
        'Increasing the frequency of signature updates',
      ],
      answer: 1,
      explain:
        'An allow list permits only approved applications to execute, so any unknown binary is blocked regardless of whether a signature exists. A deny list is the tempting distractor, but it can only block what has already been identified, which is exactly the gap the scenario describes.',
    },
    {
      id: 'sp2m8q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Which of the following BEST describes the purpose of configuration enforcement?',
      choices: [
        'Blocking traffic between network zones with firewall rules',
        'Executing suspicious files in a contained environment',
        'Ensuring systems match an approved secure baseline and correcting any drift',
        'Removing a retired system from inventory, DNS, and monitoring',
      ],
      answer: 2,
      explain:
        'Configuration enforcement uses tools such as Group Policy or MDM to keep systems aligned with a baseline and to revert unauthorized changes. The last option is tempting because it is also about keeping records accurate, but it describes decommissioning, which applies to systems leaving service rather than systems in operation.',
    },
    {
      id: 'sp2m8q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A security team must analyze a suspicious document attached to an email without risking infection of the analyst\'s workstation or the corporate network. Which mitigation technique is MOST appropriate?',
      choices: [
        'Patching',
        'Least privilege',
        'Network monitoring',
        'Isolation through sandboxing',
      ],
      answer: 3,
      explain:
        'Sandboxing runs the file in a contained environment where its behavior can be observed without affecting real systems, which is a form of isolation. Least privilege is the tempting distractor because it would reduce the damage of an infection, but it would not prevent the analyst\'s host from being infected during the analysis.',
    },
    {
      id: 'sp2m8q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An organization is donating 200 old laptops to a local school. The laptops previously held customer financial records. Which step is MOST important before the devices leave the organization?',
      choices: [
        'Deleting the user profiles and emptying the recycle bin',
        'Installing the latest operating system patches',
        'Sanitizing the storage media and removing the devices from the asset inventory',
        'Enabling the host-based firewall',
      ],
      answer: 2,
      explain:
        'Decommissioning a device that leaves the organization requires media sanitization (cryptographic erase, overwrite, or destruction) plus updating inventory and revoking any credentials or certificates. Deleting files is the tempting distractor, but deletion only removes directory entries and the data remains recoverable.',
    },
    {
      id: 'sp2m8q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A vulnerability scan of a new web server shows that Telnet, FTP, and SMBv1 are all listening, none of which are required for the server\'s function. Which hardening technique addresses this finding?',
      choices: [
        'Enabling encryption for data at rest',
        'Deploying endpoint detection and response',
        'Implementing least privilege for service accounts',
        'Disabling unnecessary ports and protocols',
      ],
      answer: 3,
      explain:
        'Each listening service that is not needed expands the attack surface, and disabling unneeded ports and protocols is the hardening technique that removes them. EDR is the tempting distractor because it would help detect exploitation of those services, but it does not close the doors themselves.',
    },
    {
      id: 'sp2m8q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A security manager wants a host-level control that will actively BLOCK malicious activity on servers, not merely alert administrators after the fact. Which control meets this requirement?',
      choices: [
        'Host-based intrusion detection system',
        'Centralized log collection in a SIEM',
        'Host-based intrusion prevention system',
        'File integrity monitoring',
      ],
      answer: 2,
      explain:
        'A HIPS inspects activity on the host and stops recognized malicious patterns, whereas a HIDS only generates alerts. The HIDS option is the tempting distractor because the two names differ by a single word, but the requirement to block rather than notify is exactly what separates prevention from detection.',
    },
    {
      id: 'sp2m8q8',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An audit finds that every warehouse employee\'s account is a member of the local Administrators group on their workstation, although their job only requires running the inventory application. Which mitigation technique should be applied FIRST?',
      choices: [
        'Least privilege',
        'Application allow listing',
        'Full-disk encryption',
        'Network segmentation',
      ],
      answer: 0,
      explain:
        'Accounts holding far more rights than their tasks require is the textbook case for least privilege, which reduces what an attacker gains by compromising any one account. Allow listing is the tempting distractor because it also limits what users can run, but it does not remove the administrative rights that let a compromised account disable other controls.',
    },
  ],
};

export const SP2_PART4: Module[] = [sp2m7, sp2m8];
