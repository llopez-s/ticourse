import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// sp1m5 — Change management (SY0-701 objective 1.3)
// ---------------------------------------------------------------------------
const sp1m5: Module = {
  id: 'sp1m5',
  sectionId: 'sp1',
  title: 'Change management: proceso, implicaciones técnicas y documentación',
  minutes: 13,
  objectives: [
    'Explicar por qué el change management es un control de seguridad y no solo un trámite',
    'Identificar los elementos del proceso de negocio: approval process, ownership, stakeholders, impact analysis, test results, backout plan, maintenance window y SOP',
    'Reconocer las implicaciones técnicas de un cambio: allow/deny lists, restricted activities, downtime, restarts y dependencies',
    'Saber qué documentación se actualiza tras un cambio y qué aporta el version control',
    'Responder preguntas de examen del tipo «¿qué debe hacerse FIRST / antes de implementar?»',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Una parte sorprendente de los incidentes de seguridad no la causa un atacante, sino **un cambio mal gestionado**: una regla de firewall que abre más de lo previsto, un certificado renovado que rompe tres servicios, un parche aplicado a mediodía que tumba el ERP. **Change management** es el proceso formal para solicitar, evaluar, aprobar, ejecutar y documentar cambios en sistemas y configuraciones. Security+ lo sitúa en el dominio 1 porque protege directamente la **availability** y la **integrity** de la CIA triad: sin proceso, cualquier persona con permisos puede alterar el entorno sin que nadie sepa qué cambió, cuándo ni por qué.',
    },
    { t: 'h', text: 'El proceso de negocio' },
    {
      t: 'list',
      items: [
        '**Approval process** — nadie ejecuta un cambio porque «le parece bien»: la solicitud pasa por una revisión formal, habitualmente el **CAB (Change Advisory Board)**, un comité con representantes de operaciones, seguridad y negocio que aprueba, rechaza o pospone.',
        '**Ownership** — cada cambio tiene un **change owner** identificado, responsable de que el cambio se justifique, se pruebe y se cierre. Quien lo ejecuta técnicamente puede ser otra persona; la responsabilidad no se diluye.',
        '**Stakeholders** — las personas y equipos afectados: dueños de aplicaciones dependientes, help desk, negocio. Deben ser identificados y avisados *antes*, no descubrir el cambio por un ticket de incidencia.',
        '**Impact analysis** — evaluación previa de qué sistemas, usuarios y procesos se ven afectados, qué puede salir mal y con qué gravedad. Es el paso que convierte una idea en una decisión informada.',
        '**Test results** — el cambio se prueba en un entorno de **staging** o laboratorio y los resultados se adjuntan a la solicitud. «Funciona en mi máquina» no es un test result.',
        '**Backout plan** — el procedimiento documentado para **revertir** el cambio si falla: qué restaurar, en qué orden y cuánto tarda. Se escribe *antes* de tocar producción.',
        '**Maintenance window** — franja horaria acordada de bajo impacto (madrugada, fin de semana) en la que se ejecutan cambios que pueden causar interrupción; los usuarios saben que el servicio puede degradarse.',
        '**Standard operating procedure (SOP)** — instrucciones paso a paso para cambios rutinarios y repetibles (renovar un certificado, añadir una VLAN). El SOP hace que el cambio lo haga igual quien lo haga. Estos elementos se encadenan en un flujo que conviene memorizar en orden, porque el examen pregunta con frecuencia **qué va antes de qué**:',
      ],
    },
    {
      t: 'list',
      ordered: true,
      items: [
        '**Request** — el change owner registra la solicitud: qué se cambia, por qué y en qué sistemas.',
        '**Impact analysis** — se evalúan riesgos, sistemas afectados y stakeholders.',
        '**Test + backout plan** — se prueba en staging y se deja listo el plan de reversión con criterios claros para activarlo; nada llega al comité sin ambas cosas.',
        '**Approval (CAB)** — el comité revisa la solicitud con el análisis de impacto, los test results y el backout plan, y aprueba o rechaza.',
        '**Maintenance window** — se programa la ejecución en una franja de bajo impacto y se avisa a los stakeholders.',
        '**Implement** — se ejecuta el cambio en producción siguiendo el SOP o el plan detallado.',
        '**Verify** — se comprueba que el cambio funciona y que no ha roto nada (monitorización, pruebas funcionales, restart de servicios si procede).',
        '**Document** — se actualizan diagramas, políticas y procedimientos, y la configuración queda registrada en **version control**.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A systems administrator wants to upgrade the database engine on a production server that several internal applications rely on. Which of the following should be completed FIRST?',
        choices: [
          'Schedule the maintenance window and notify users',
          'Perform an impact analysis to identify affected systems and risks',
          'Restart the dependent applications to confirm they reconnect',
          'Update the network diagram with the new database version',
        ],
        answer: 1,
        explain:
          'Impact analysis comes before scheduling or approval: you cannot pick a sensible window or get a meaningful CAB decision without knowing what the change touches. Scheduling the window is tempting but happens after the impact is understood; restarts and diagram updates belong to the verify and document phases.',
      },
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Ejemplo de change ticket (resumido)',
      text: `CHG-2041  Rotación del certificado TLS wildcard *.halden-port.local
Owner:            L. Ferrer (Infraestructura)     Estado: APPROVED (CAB 2026-09-02)
Tipo:             Normal                          Riesgo: Medio
Stakeholders:     Equipo web, SOC, help desk, dueño del portal de proveedores
Impact analysis:  El certificado lo usan 6 servicios (portal, API, VPN SSL, SMTP,
                  monitorización, SSO). Todos requieren service restart tras el cambio.
Test results:     Renovación probada en staging 2026-08-30; los 6 servicios OK.
Maintenance win.: Sábado 2026-09-06, 02:00–04:00 (downtime estimado: 15 min)
Restricted act.:  No se despliegan otros cambios en esos hosts durante la ventana.
Backout plan:     Restaurar cert anterior desde el repositorio (tag cert-2025-09),
                  reiniciar los 6 servicios. Tiempo estimado: 10 min.
Verify:           openssl s_client contra cada endpoint + panel de monitorización verde.
Document:         Actualizar inventario de certificados, diagrama de servicios,
                  y commit de la nueva config en el repo (tag cert-2026-09).`,
    },
    { t: 'h', text: 'Implicaciones técnicas' },
    {
      t: 'p',
      md: 'Aprobar un cambio es la mitad del trabajo; la otra mitad es entender **qué toca técnicamente**. Un cambio aparentemente pequeño puede exigir actualizar listas de control, provocar **downtime**, requerir reinicios o arrastrar a otros sistemas a través de sus **dependencies**. Como analista, tu aportación al impact analysis suele ser precisamente esta tabla:',
    },
    {
      t: 'table',
      headers: ['Implicación', 'Qué significa', 'Ejemplo'],
      rows: [
        [
          'Allow lists / deny lists',
          'Listas de lo permitido (allow) o bloqueado (deny) en firewalls, proxies, application control o EDR que deben actualizarse para que el cambio funcione — y solo lo que el cambio necesita.',
          'Desplegar un nuevo agente de backup requiere añadir su ejecutable firmado a la allow list de application control; si no, el endpoint lo bloquea.',
        ],
        [
          'Restricted activities',
          'Acciones prohibidas mientras el cambio está en curso, para no mezclar causas si algo falla.',
          'Durante la migración del servidor de correo nadie despliega parches ni modifica reglas de firewall en esa subred.',
        ],
        [
          'Downtime',
          'Periodo en que el servicio no está disponible; debe estimarse, aprobarse y comunicarse.',
          'Actualizar el firmware del switch de core implica 20 minutos sin red en la planta: se hace en la maintenance window y se avisa a producción.',
        ],
        [
          'Service restart',
          'Un servicio o daemon debe reiniciarse para cargar la nueva configuración; el proceso se interrumpe brevemente.',
          'Tras cambiar el archivo de configuración del servidor web, hay que reiniciar el servicio para que lea el nuevo certificado.',
        ],
        [
          'Application restart',
          'La aplicación completa (y a veces los clientes conectados) debe cerrarse y abrirse; puede implicar que los usuarios pierdan sesiones.',
          'Un parche del ERP exige cerrar la aplicación en todos los puestos; se planifica al final del turno.',
        ],
        [
          'Dependencies',
          'Otros sistemas que dependen del componente cambiado o de los que el componente depende; el fallo se propaga en cadena.',
          'Cambiar el certificado del SSO afecta a todas las aplicaciones que confían en él; una app legacy con el cert antiguo «pinned» deja de autenticar.',
        ],
        [
          'Legacy applications',
          'Sistemas antiguos que no soportan el cambio (un protocolo, un cifrado o una versión nueva) y obligan a excepciones documentadas o a compensating controls.',
          'Al desactivar TLS 1.0 en el proxy, el software de las básculas del muelle deja de conectar: se aísla en su propia VLAN hasta que el proveedor lo actualice.',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Las dependencies son el punto ciego',
      md: 'Los cambios que más incidentes causan no son los grandes, sino los que parecen aislados. Renovar un certificado, cambiar una IP de DNS o subir la versión de una librería compartida rara vez afecta a *un* sistema. Antes de aprobar, pregunta siempre: **«¿quién más usa esto?»**. Si nadie lo sabe, el impact analysis no está terminado — y probablemente falte un diagrama actualizado.',
    },
    {
      t: 'check',
      q: {
        q: 'After a scheduled change replaced the certificate on the corporate single sign-on server, users report that a legacy inventory application no longer accepts logins, although every other application works. Which change-management element was MOST likely overlooked?',
        choices: [
          'The maintenance window was too short',
          'The backout plan was never written',
          'The change owner was not assigned',
          'The dependencies of the certificate were not fully identified',
        ],
        answer: 3,
        explain:
          'The legacy app depended on the old certificate (for example, by pinning it), and that dependency was missed during impact analysis. A missing backout plan would explain a slow recovery, not why the failure happened; the window length and ownership do not cause a single dependent application to break.',
      },
    },
    { t: 'h', text: 'Documentación y control de versiones' },
    {
      t: 'p',
      md: 'Un cambio no está cerrado cuando funciona, sino cuando **la documentación refleja la nueva realidad**. Eso implica **updating diagrams** (topología de red, flujos de datos, inventario de servicios: si el diagrama muestra una regla de firewall que ya no existe, el siguiente impact analysis se hará sobre una ficción), **updating policies/procedures** (si el cambio altera cómo se hace algo, el SOP y la política correspondiente se revisan en el mismo ticket), y **version control**: la configuración —reglas de firewall, ficheros de servidores, infraestructura como código— vive en un repositorio con historial. Cada cambio es un *commit* etiquetado, lo que da tres cosas que el examen valora: saber **quién cambió qué y cuándo** (accountability), poder **comparar** la versión actual con la anterior, y hacer **rollback** a una versión conocida y buena con un solo comando. De hecho, el backout plan más fiable suele ser «desplegar el tag anterior».',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen',
      md: 'Dos patrones se repiten en SY0-701. **(1)** Si la pregunta dice «FIRST», «before implementing» o «prior to», la respuesta casi siempre es **impact analysis** (antes de aprobar) o **backout plan / test in staging** (antes de tocar producción), nunca «implement» ni «document». **(2)** Un **emergency change** (por ejemplo, parchear una vulnerabilidad explotada activamente) puede saltarse el orden habitual y ejecutarse antes de la reunión del CAB, pero **sigue necesitando aprobación retroactiva y documentación completa**. «Emergencia» nunca significa «sin proceso».',
    },
    {
      t: 'check',
      q: {
        q: 'A security team stores all firewall configurations in a Git repository and tags each approved change. Which of the following BEST describes the primary benefit of this practice for change management?',
        choices: [
          'It eliminates the need for a change advisory board',
          'It enables quick rollback to a known-good configuration and shows who changed what',
          'It encrypts the firewall rules so attackers cannot read them',
          'It automatically performs the impact analysis for each change',
        ],
        answer: 1,
        explain:
          'Version control gives history, accountability and a reliable backout path (deploy the previous tag). It does not replace the approval process, and a repository is not an encryption or impact-analysis tool, even though those distractors sound security-related.',
      },
    },
    {
      t: 'p',
      md: 'Con el proceso de cambios claro, ya sabes *cómo* introducir un control nuevo en producción sin romper nada. La siguiente lección entra en uno de los controles técnicos que más aparece en esos tickets: la **criptografía** — simétrica, asimétrica, hashing y firmas digitales — y por qué renovar un certificado es, como acabas de ver, mucho más que cambiar un fichero.',
    },
  ],
  quiz: [
    {
      id: 'sp1m5q1',
      domain: 'General Security Concepts',
      prompt:
        'A network engineer is preparing to replace the core router configuration during Saturday\'s maintenance window. The change advisory board asks for one additional document before approving. Which of the following is the board MOST likely requesting?',
      choices: [
        'The updated network diagram reflecting the new configuration',
        'A list of users who will be notified after the change succeeds',
        'A backout plan describing how to restore the previous configuration if the change fails',
        'The vendor\'s end-of-life notice for the current router model',
      ],
      answer: 2,
      explain:
        'A backout plan must exist before a change is approved so the team knows how to recover if the implementation fails. The updated diagram is produced after the change as part of documentation, so it cannot be a precondition for approval; notifications and vendor notices are not approval prerequisites either.',
    },
    {
      id: 'sp1m5q2',
      domain: 'General Security Concepts',
      prompt:
        'An organization requires that all server patches be applied between 01:00 and 04:00 on Sundays. Which of the following BEST explains the purpose of this requirement?',
      choices: [
        'To limit the impact of downtime by performing changes when the fewest users are affected',
        'To ensure that the security team is not present during the change',
        'To allow changes to be applied without going through the approval process',
        'To reduce the number of dependencies the patched servers have',
      ],
      answer: 0,
      explain:
        'A maintenance window is a pre-agreed period of low business activity so that any downtime or degradation affects as few users as possible. A window never bypasses approval, and it does not alter the technical dependencies of a system; it only changes when the change is executed.',
    },
    {
      id: 'sp1m5q3',
      domain: 'General Security Concepts',
      prompt:
        'A change to update a shared authentication library was approved and tested on the web portal. After deployment, the portal works, but the payroll system and the VPN gateway stop authenticating users. Which of the following was MOST likely missing from the change request?',
      choices: [
        'A defined change owner',
        'A standard operating procedure',
        'A shorter maintenance window',
        'A complete analysis of dependencies on the shared library',
      ],
      answer: 3,
      explain:
        'The library was shared, so every system that depended on it had to be identified and tested; the impact analysis stopped at the web portal. An SOP or a named owner would not by itself have revealed the other consumers, and the window length has no effect on which systems break.',
    },
    {
      id: 'sp1m5q4',
      domain: 'General Security Concepts',
      prompt:
        'Every month, the help desk renews the same set of internal TLS certificates. Different technicians perform the task and the results are inconsistent, occasionally leaving services down. Which of the following would BEST address this problem?',
      choices: [
        'Requiring CAB approval for every certificate renewal',
        'Creating a standard operating procedure for the renewal process',
        'Extending the maintenance window for certificate work',
        'Assigning the task permanently to a single technician',
      ],
      answer: 1,
      explain:
        'A standard operating procedure makes a routine, repeatable change consistent regardless of who performs it, which is exactly the gap described. Routing every routine renewal through the CAB adds bureaucracy without fixing inconsistency, and depending on one person creates a single point of failure rather than a repeatable process.',
    },
    {
      id: 'sp1m5q5',
      domain: 'General Security Concepts',
      prompt:
        'A security analyst recommends managing firewall rule sets as code in a version-controlled repository. Which of the following is the MOST significant security benefit of this recommendation?',
      choices: [
        'Firewall rules will be applied faster because no testing is required',
        'The firewall will automatically block newly discovered malicious IP addresses',
        'Each change is attributable to a person and can be reverted to a known-good version',
        'The rules will be hidden from unauthorized administrators',
      ],
      answer: 2,
      explain:
        'Version control provides accountability (who changed what and when) and a reliable rollback path, both core to controlled change. It does not remove the need for testing, does not add threat intelligence to the firewall, and a repository is not an access-control mechanism for hiding rules.',
    },
    {
      id: 'sp1m5q6',
      domain: 'General Security Concepts',
      prompt:
        'A developer wants to open an additional inbound port on the perimeter firewall to support a new application. The developer has already written the request and the impact analysis. Who should formally approve the change before it is scheduled?',
      choices: [
        'The change advisory board',
        'The developer, as the change owner',
        'The on-call firewall administrator who will implement it',
        'The help desk, as the team that will receive user complaints',
      ],
      answer: 0,
      explain:
        'Formal approval belongs to the change advisory board, which represents operations, security and the business. The change owner is accountable for the change but cannot approve their own request, and the implementer or the help desk are stakeholders, not the approval authority.',
    },
    {
      id: 'sp1m5q7',
      domain: 'General Security Concepts',
      prompt:
        'A firewall change that added a new allow-list entry for a partner network was implemented and verified successfully during the maintenance window. Which of the following should the team do NEXT to close the change?',
      choices: [
        'Restart the firewall to confirm the rule persists',
        'Remove the rule until the next CAB meeting reviews it',
        'Perform a second impact analysis on the partner network',
        'Update the network diagram and the documented rule set to reflect the new entry',
      ],
      answer: 3,
      explain:
        'After implementation and verification, the remaining step is documentation: diagrams, policies or procedures, and the version-controlled configuration must match the new reality. Impact analysis was completed before approval, the rule was already verified so removing it makes no sense, and an unnecessary restart introduces risk rather than closing the change.',
    },
    {
      id: 'sp1m5q8',
      domain: 'General Security Concepts',
      prompt:
        'A critical vulnerability is being actively exploited against the company\'s public web servers, and the next change advisory board meeting is in three days. The administrator applies the vendor patch immediately. Which of the following BEST describes what is still required?',
      choices: [
        'Nothing further, because emergency changes are exempt from the change process',
        'Retroactive approval and full documentation of the emergency change',
        'Reverting the patch until the change can be formally scheduled',
        'A new maintenance window to reapply the patch with proper approval',
      ],
      answer: 1,
      explain:
        'An emergency change may bypass the normal sequence to reduce immediate risk, but it must still be approved retroactively and documented like any other change. Reverting a security patch during active exploitation would reintroduce the vulnerability, and reapplying an already-applied patch adds no value; "exempt from the process" is never the correct answer.',
    },
  ],
};

export const SP1_PART3: Module[] = [sp1m5];
