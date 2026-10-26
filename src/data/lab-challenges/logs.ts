import type { LogCase, LogRecord } from '../../lib/labChallenge';

// Deterministic, inert background activity. IDs below are remapped so they do not reveal the solution.
function background(day: string): LogRecord[] {
  return Array.from({ length: 25 }, (_, i) => ({
    id: `B${String(i + 1).padStart(2, '0')}`,
    at: `${day}T03:${String(1 + i).padStart(2, '0')}:30Z`,
    source: (['auth', 'endpoint', 'firewall'] as const)[i % 3],
    host: ['WS-04', 'WS-08', 'FILE-02', 'WS-17', 'WS-22'][i % 5],
    user: i % 3 === 0 ? 'operador.turno' : i % 3 === 1 ? 'system' : '-',
    event: ['session_ok', 'scheduled_job', 'allow'][i % 3],
    detail: ['Inicio habitual desde terminal autorizada, MFA completado.', 'Inventario firmado según tarea programada; hash en allowlist local.', 'DNS corporativo hacia 192.0.2.53:53; 180 bytes.'][i % 3],
  }));
}

const keyIds: Record<string, string>[] = [
  { A1: 'E07', A2: 'E19', A3: 'E04', A4: 'E26', A5: 'E12', A6: 'E31', A7: 'E02' },
  { C1: 'E23', C2: 'E05', C3: 'E17', C4: 'E01', C5: 'E29', C6: 'E10', C7: 'E32' },
];

function withOpaqueIds(data: LogCase, mapping: Record<string, string>): LogCase {
  const remaining = Array.from({ length: data.records.length }, (_, i) => `E${String(i + 1).padStart(2, '0')}`)
    .filter((id) => !Object.values(mapping).includes(id));
  const ids = { ...mapping };
  for (const record of data.records) if (!ids[record.id]) ids[record.id] = remaining.shift()!;
  return { ...data, records: data.records.map((r) => ({ ...r, id: ids[r.id] })),
    timeline: data.timeline.map((id) => ids[id]),
    solution: data.solution.replace(/\b[AC][1-7]\b/g, (id) => ids[id] ?? id) };
}

export const LOG_CASES: LogCase[] = ([
  {
    kind: 'logs', id: 'logs-a', title: 'A · La terminal del turno de noche', minutes: 25,
    brief: 'Halden investiga actividad entre las 03:00 y las 03:30 UTC. Correlaciona autenticación, procesos y red. Selecciona los cinco eventos que documentan la secuencia del equipo afectado, en orden temporal, e identifica equipo y cuenta. Todos los registros son sintéticos.',
    hint: 'Empieza por la autenticación de la cuenta y sigue host, proceso y destino. Una conexión permitida no demuestra por sí sola qué datos viajaron.',
    host: 'WS-17', account: 'ana.ops', timeline: ['A1', 'A2', 'A3', 'A4', 'A5'],
    records: [
      ...background('2026-06-03'),
      { id: 'A1', at: '2026-06-03T03:10:00Z', source: 'auth', host: 'WS-17', user: 'ana.ops', event: 'logon_failed', detail: '8 fallos de autenticación desde 192.0.2.77. Sin MFA.' },
      { id: 'A2', at: '2026-06-03T03:11:00Z', source: 'auth', host: 'WS-17', user: 'ana.ops', event: 'logon_success', detail: 'Acceso interactivo desde 192.0.2.77. Ana confirma que no estaba de turno ni inició esta sesión.' },
      { id: 'A3', at: '2026-06-03T03:12:00Z', source: 'endpoint', host: 'WS-17', user: 'ana.ops', event: 'process_start', detail: 'explorer.exe → powershell.exe con argumento codificado; no coincide con las tareas aprobadas.' },
      { id: 'A4', at: '2026-06-03T03:13:00Z', source: 'endpoint', host: 'WS-17', user: 'ana.ops', event: 'task_created', detail: 'PowerShell registra la tarea ActualizaTurno para iniciar demo-loader.exe desde el perfil del usuario.' },
      { id: 'A5', at: '2026-06-03T03:14:00Z', source: 'firewall', host: 'WS-17', user: 'ana.ops', event: 'allow', detail: 'Conexiones periódicas a 198.51.100.44:443; 4200 bytes enviados. Sin captura del contenido.' },
      { id: 'A6', at: '2026-06-03T03:09:00Z', source: 'auth', host: 'WS-04', user: 'admin.guard', event: 'logon_success', detail: 'MFA y equipo de salto autorizado. Cambio CHG-204 aprobado para reinicio del inventario.' },
      { id: 'A7', at: '2026-06-03T03:15:00Z', source: 'endpoint', host: 'WS-04', user: 'admin.guard', event: 'process_start', detail: 'PowerShell ejecuta inventario firmado; hash y horario coinciden con CHG-204.' },
    ],
    solution: 'La cadena A1→A2→A3→A4→A5 vincula ana.ops y WS-17: fallos, éxito no reconocido, ejecución, persistencia y conexión externa. A6/A7 son cambio autorizado en otro equipo. Hay indicios sólidos de compromiso; 4200 bytes y allow no acreditan exfiltración de documentos. IR debe aislar WS-17 preservando evidencia; IAM debe contener la cuenta y sus sesiones según alcance, y SOC buscar la misma secuencia en otros hosts. Verificar cese de conexiones y ausencia de persistencia tras erradicación y recuperación controlada.',
  },
  {
    kind: 'logs', id: 'logs-b', title: 'B · La cuenta que no debía iniciar sesión', minutes: 25,
    brief: 'Halden recibe otra alerta de PowerShell. Hay un cambio autorizado y actividad fuera de función de una cuenta de servicio. Selecciona los cinco eventos de la cadena que exige respuesta, en orden temporal, e identifica equipo y cuenta. Ventana 03:00–03:30 UTC.',
    hint: 'Correlaciona función de la cuenta y autorización del cambio. No elijas automáticamente el primer PowerShell ni confundas tráfico bloqueado con salida efectiva.',
    host: 'WS-22', account: 'svc.backup', timeline: ['C1', 'C2', 'C3', 'C4', 'C5'],
    records: [
      ...background('2026-06-05'),
      { id: 'C1', at: '2026-06-05T03:05:00Z', source: 'auth', host: 'WS-22', user: 'svc.backup', event: 'logon_success', detail: 'Logon interactivo. El inventario de cuentas prohíbe uso interactivo de svc.backup; sin cambio aprobado.' },
      { id: 'C2', at: '2026-06-05T03:06:00Z', source: 'endpoint', host: 'WS-22', user: 'svc.backup', event: 'process_start', detail: 'cmd.exe inicia rundll32.exe con DLL desde perfil temporal, hash no inventariado.' },
      { id: 'C3', at: '2026-06-05T03:07:00Z', source: 'endpoint', host: 'WS-22', user: 'svc.backup', event: 'credential_dump', detail: 'El sensor observa acceso de rundll32 a memoria de lsass y creación de un volcado local. Sin tarea aprobada.' },
      { id: 'C4', at: '2026-06-05T03:08:00Z', source: 'firewall', host: 'WS-22', user: 'svc.backup', event: 'deny', detail: 'Salida a 198.51.100.88:443 bloqueada; 0 bytes de carga entregados al destino.' },
      { id: 'C5', at: '2026-06-05T03:09:00Z', source: 'endpoint', host: 'WS-22', user: 'svc.backup', event: 'file_present', detail: 'El volcado local sigue en el directorio temporal. La cuenta conserva sesión interactiva activa.' },
      { id: 'C6', at: '2026-06-05T03:02:00Z', source: 'auth', host: 'WS-17', user: 'ana.ops', event: 'logon_success', detail: 'Turno aprobado; terminal habitual; MFA completado. No tiene relación con la cuenta de servicio.' },
      { id: 'C7', at: '2026-06-05T03:03:00Z', source: 'endpoint', host: 'WS-04', user: 'admin.guard', event: 'process_start', detail: 'PowerShell firmado para CHG-209; ejecución y hash autorizados, sin procesos descendientes anómalos.' },
    ],
    solution: 'La cadena C1→C2→C3→C4→C5 identifica svc.backup en WS-22. Se observa uso interactivo prohibido y acceso a credenciales, aunque el intento de salida fue bloqueado. No afirmar exfiltración completada ni dar el incidente por resuelto por un deny. C6/C7 son actividad autorizada. Aislar el equipo preservando memoria y volcado; coordinar con IAM y backup la contención/rotación de la identidad y la continuidad de copias. Buscar uso de las credenciales expuestas en otros equipos, cerrar sesiones pertinentes y verificar el alcance antes de recuperar.',
  },
] satisfies LogCase[]).map((data, i) => withOpaqueIds(data, keyIds[i]));
