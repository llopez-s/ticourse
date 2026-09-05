import type { ClassifyData, LabMeta, OrderData, SelectData } from '../labs';

// ---------------------------------------------------------------------------
// Security+ (SY0-701) Domain 4 labs — Halden Port Authority scenario
// ---------------------------------------------------------------------------

export const SP4_LABS: LabMeta[] = [
  {
    id: 'spl4a',
    sectionId: 'sp4',
    title: 'Log Hunt',
    icon: '🔦',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce preguntas de una investigación en el puerto. Para cada una, elige la fuente de datos que la responde: firewall logs, endpoint logs, OS security logs o packet capture. Necesitas ≥80%.',
    mission: {
      n: 4,
      briefing:
        'Tres de la madrugada: el SOC del puerto detecta actividad rara en la red de la terminal de contenedores. Tienes SIEM, EDR, capturas y logs de todo — y una hora antes de que el CISO pida respuestas. No mires todo: elige para cada pregunta la fuente que de verdad la contesta.',
    },
  },
  {
    id: 'spl4b',
    sectionId: 'sp4',
    title: 'Incident Response Drill',
    icon: '🚨',
    minutes: 8,
    xp: 75,
    kind: 'order',
    brief:
      'Ordena las 7 fases del proceso de respuesta a incidentes, de la preparación a las lecciones aprendidas.',
  },
  {
    id: 'spl4c',
    sectionId: 'sp4',
    title: 'Vulnerability Triage',
    icon: '🩺',
    minutes: 10,
    xp: 100,
    kind: 'select',
    brief:
      'El escaneo mensual devuelve 8 hallazgos y solo hay ventana para 4 esta semana. Elige los 4 que de verdad tocan primero. Cada elección viene con feedback.',
  },
];

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

export const SP4_CLASSIFY_DATA: Record<string, ClassifyData> = {
  spl4a: {
    passPct: 80,
    categories: [
      { id: 'firewall', label: 'Firewall logs' },
      { id: 'endpoint', label: 'Endpoint / EDR logs' },
      { id: 'oslog', label: 'OS security logs' },
      { id: 'pcap', label: 'Packet capture' },
    ],
    items: [
      {
        text: 'Which external IP addresses did the container-terminal workstation contact last night, and was each connection allowed or blocked?',
        answer: 'firewall',
        why: 'Solo el firewall ve todas las sesiones que cruzan el perímetro y registra el veredicto allow/deny junto a la IP de destino. El EDR contaría la conexión únicamente si ese host tuviera agente y estuviera vivo.',
      },
      {
        text: 'Did anything from the office VLAN still reach the OT segment after the new deny rule went live?',
        answer: 'firewall',
        why: 'La pregunta es si una regla de frontera se está aplicando, y eso se comprueba en el log del dispositivo que la aplica. Los PLC del segmento OT no admiten agente, así que la telemetría de endpoint no existe ahí.',
      },
      {
        text: 'Which destination ports did the suspicious host use for its outbound sessions over the past two weeks, whether each session was allowed or denied, and how many bytes it carried?',
        answer: 'firewall',
        why: 'El firewall registra el 5-tuple y los contadores de bytes de cada sesión, así que da el volumen y los puertos sin necesidad de guardar el tráfico. Una captura completa respondería igual, pero solo si estaba grabando justo en ese punto y en ese momento.',
      },
      {
        text: 'Which process spawned the suspicious binary, and what is its SHA-256 hash?',
        answer: 'endpoint',
        why: 'La relación padre-hijo entre procesos y el hash del fichero solo existen dentro del host, y el EDR es quien la registra. El log de seguridad del sistema puede mostrar la creación del proceso, pero no el hash ni el árbol completo con esa fidelidad.',
      },
      {
        text: 'Did the loader write anything to disk and register a persistence entry on the workstation?',
        answer: 'endpoint',
        why: 'Escrituras en disco y cambios de persistencia (tarea programada, clave Run, servicio) son telemetría de endpoint. El firewall no ve nada de lo que pasa dentro de la máquina: solo lo que sale por el cable.',
      },
      {
        text: 'Has that same file hash executed on any other endpoint in the port during the last 30 days?',
        answer: 'endpoint',
        why: 'Buscar un hash en toda la flota es exactamente para lo que sirve la consola de EDR, que centraliza la ejecución de todos los agentes. Una captura de red no contiene hashes de ficheros ejecutados localmente.',
      },
      {
        text: 'Which account logged on interactively at 03:12, and had it failed several times before succeeding?',
        answer: 'oslog',
        why: 'Los eventos de logon (tipo de inicio de sesión, éxito y fallos previos) están en el log de seguridad del sistema operativo. El EDR se centra en procesos y ficheros, no en el detalle de autenticación de cada cuenta.',
      },
      {
        text: 'Was a new account created during the night and added to the Domain Admins group?',
        answer: 'oslog',
        why: 'La creación de cuentas y los cambios de pertenencia a grupos son eventos de auditoría del controlador de dominio. Ningún log de firewall ni captura de red muestra quién acabó siendo administrador.',
      },
      {
        text: 'Did someone clear the security event log or change the audit policy on the file server?',
        answer: 'oslog',
        why: 'El borrado del registro y los cambios de política de auditoría se auditan como eventos propios del sistema operativo — y son señal clásica de antiforense. El EDR puede alertar de la acción, pero la evidencia primaria es el log de seguridad.',
      },
      {
        text: 'What data actually travelled inside the unencrypted FTP session to the shipping line?',
        answer: 'pcap',
        why: 'Solo la captura conserva el contenido de la sesión, así que es la única fuente que dice qué ficheros se transfirieron. El firewall confirma que la sesión existió y cuántos bytes movió, pero no qué iba dentro.',
      },
      {
        text: 'Which exact commands did the operator type over the plaintext Telnet session to the crane controller?',
        answer: 'pcap',
        why: 'Los comandos viajan en el payload y se reconstruyen siguiendo el flujo TCP de la captura. El controlador de la grúa no genera logs de sistema útiles, así que sin captura esa actividad simplemente no queda registrada.',
      },
      {
        text: 'Is the traffic leaving on port 443 really TLS, or is another protocol being tunnelled over that port?',
        answer: 'pcap',
        why: 'Distinguir el protocolo real del puerto declarado exige inspeccionar los bytes de la sesión, y eso solo lo permite la captura. El log del firewall se queda en el número de puerto, que es justo lo que el atacante está usando para camuflarse.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Order labs
// ---------------------------------------------------------------------------

export const SP4_ORDER_DATA: Record<string, OrderData> = {
  spl4b: {
    prompt:
      'El SOC del puerto confirma un implante en la terminal de contenedores y se activa el equipo de respuesta. Toca las 7 fases del proceso de respuesta a incidentes en su orden correcto, de la preparación a las lecciones aprendidas.',
    steps: [
      {
        text: 'Preparation',
        detail:
          'Todo lo que se hace antes de que haya incidente: plan escrito, roles y contactos, herramientas y accesos listos, formación y ejercicios. Va primero porque durante la crisis ya no hay tiempo de decidir quién manda ni de conseguir una licencia forense.',
      },
      {
        text: 'Detection',
        detail:
          'Una alerta del SIEM, del EDR o un aviso de un usuario indica que algo va mal y alguien lo valida como incidente real. Sin declarar la detección no arranca ningún reloj ni ninguna autoridad de respuesta.',
      },
      {
        text: 'Analysis',
        detail:
          'Se determina alcance, severidad y vector: qué sistemas y cuentas están afectados y hasta dónde llegó el atacante. Se hace antes de contener porque contener sin saber el alcance deja hosts comprometidos fuera del cerco.',
      },
      {
        text: 'Containment',
        detail:
          'Se detiene la propagación aislando los sistemas afectados (segmentar, bloquear el C2, deshabilitar cuentas) sin apagarlos ni limpiarlos todavía. Va antes de la erradicación precisamente para que la evidencia volátil —memoria, conexiones, procesos vivos— sobreviva a la respuesta.',
      },
      {
        text: 'Eradication',
        detail:
          'Con el incidente acotado y la evidencia recogida, se elimina la causa: borrar el malware y la persistencia, cerrar la vulnerabilidad explotada y rotar las credenciales comprometidas. Erradicar sin haber contenido antes solo hace que el atacante vuelva a entrar por el mismo sitio.',
      },
      {
        text: 'Recovery',
        detail:
          'Se restauran los sistemas desde copias limpias, se validan y se devuelven a producción con monitorización reforzada. Va después de erradicar porque restaurar sobre una causa raíz viva es reinfectarse en el acto.',
      },
      {
        text: 'Lessons learned',
        detail:
          'Reunión posterior y informe: qué funcionó, qué falló, qué controles y detecciones faltaban. Cierra el ciclo alimentando de nuevo la preparación, así que el proceso es circular y no una lista que termina.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Select labs
// ---------------------------------------------------------------------------

export const SP4_SELECT_DATA: Record<string, SelectData> = {
  spl4c: {
    pickN: 4,
    prompt:
      'El escaneo mensual de vulnerabilidades de la Autoridad Portuaria devuelve 8 hallazgos y la ventana de cambios de esta semana solo da para 4. Prioriza combinando exposición e impacto real, no la puntuación CVSS más alta de la lista: elige los 4 que hay que remediar primero.',
    options: [
      {
        text: 'Internet-facing berth-booking portal: CVSS 9.1 remote code execution with a working public exploit',
        good: true,
        why: '✅ Expuesto a Internet, ejecución remota de código y exploit público disponible: exposición máxima e impacto máximo. Es el caso de libro de parche inmediato.',
      },
      {
        text: 'VPN concentrator missing the vendor patch for an authentication-bypass flaw already seen exploited in the wild',
        good: true,
        why: '✅ El concentrador es la puerta de entrada remota del puerto y el fallo permite saltarse la autenticación: quien lo explote entra como si fuera personal legítimo. Explotación activa en el mundo real lo sube al primer puesto.',
      },
      {
        text: 'Domain controller vulnerable to a local privilege-escalation flaw that turns any authenticated user into a domain administrator',
        good: true,
        why: '✅ No está expuesto a Internet, pero el impacto es total: cualquier cuenta phisheada se convierte en administrador del dominio. Alcanzable desde cualquier puesto de la red interna, así que la exposición práctica es enorme.',
      },
      {
        text: 'Internet-facing file transfer server still running with the vendor default credentials',
        good: true,
        why: '✅ Credenciales por defecto en un servicio publicado a Internet no necesitan ni exploit: basta con teclearlas. Además custodia manifiestos de carga, así que el impacto sobre el negocio del puerto es directo.',
      },
      {
        text: 'CVSS 9.8 remote code execution on an isolated lab VM with no network path from any other segment',
        good: false,
        why: '❌ La nota es la más alta de la lista, pero sin ruta de red nadie puede alcanzarla: exposición nula. Priorizar por CVSS bruto es exactamente el error que este ejercicio busca corregir; se planifica, no se corre.',
      },
      {
        text: 'Medium-severity flaw in the badge management server, already covered by a documented compensating control',
        good: false,
        why: '❌ El riesgo ya está mitigado por un control compensatorio documentado y aprobado, así que puede esperar a la ventana ordinaria. Lo que sí toca es revalidar que el control sigue vigente, no gastar la ventana de esta semana.',
      },
      {
        text: 'Informational finding: the intranet server still accepts TLS 1.0 alongside TLS 1.2',
        good: false,
        why: '❌ Es un hallazgo informativo sobre un servicio interno, sin explotación conocida ni impacto inmediato. Entra en el plan de endurecimiento, no en la lista de remediación urgente.',
      },
      {
        text: 'High-severity finding on the payroll server that the team has already investigated and confirmed as a false positive',
        good: false,
        why: '❌ Un falso positivo confirmado no es trabajo de remediación: la vulnerabilidad no existe. Lo correcto es documentarlo y afinar el escáner para que deje de aparecer, no consumir la ventana de cambios.',
      },
    ],
  },
};
