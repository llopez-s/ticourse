import type { ReportCase } from '../../lib/labChallenge';

export const REPORT_CASES: ReportCase[] = [
  {
    kind: 'report', id: 'report-a', title: 'A · Datos fuera del enclave', minutes: 25,
    brief: 'El CISO de Meridian necesita un informe ejecutivo para decidir hoy sobre el acceso del proveedor de diseño. El acuerdo del dossier permite distribución interna y prohíbe reenviar a clientes: usa TLP:AMBER+STRICT. Redacta una página de trabajo, sin atribuir el incidente a una persona o grupo que los datos no identifican.',
    hint: 'Separa el acceso, el movimiento de datos y la identidad del actor. Comprueba si los informes citan observaciones propias o se copian entre sí.',
    assessment: 'exfiltration', confidence: ['high', 'moderate'], tlp: ['TLP:AMBER+STRICT'], evidenceSets: [['R1', 'R2']],
    evidence: [
      { id: 'R1', at: '2026-05-06T11:12:00Z', source: 'DLP de Meridian · primaria', text: 'Transferencia completada de 18 documentos de diseño, 12 MB, desde ENG-041 al destino externo no autorizado entrega-demo.example. Los hashes del contenido transferido coinciden con los documentos inventariados.' },
      { id: 'R2', at: '2026-05-06T11:12:04Z', source: 'Proxy y respuesta del servidor · primaria independiente', text: 'Sesión HTTPS de ENG-041 al mismo destino: cuerpo enviado de 12 MB y respuesta 201. El registro de acceso al enclave vincula el host a una sesión de la cuenta del proveedor, iniciada a las 11:02.' },
      { id: 'R3', at: '2026-05-06T12:00:00Z', source: 'Feed Faro · secundaria', text: 'Faro resume el aviso de DLP de Meridian (R1). No aporta captura, muestra ni observación independiente.' },
      { id: 'R4', at: '2026-05-06T12:20:00Z', source: 'Feed Eco · copia de R3', text: 'Eco cita a Faro y reproduce la cifra de 18 documentos. No se ha observado otra transferencia fuera de la ventana de seis horas cubierta por el proxy.' },
      { id: 'R5', at: '2026-05-06T12:30:00Z', source: 'Responsable del enclave', text: 'El proveedor debía consultar planos, no exportarlos a destinos externos. Suspender su sesión durante cuatro horas permite continuar la producción con otra cuenta controlada. No hay autorización para distribuir este dossier fuera de Meridian.' },
    ],
    solution: 'BLUF posible: «La evidencia sustenta con confianza alta que 18 documentos de diseño salieron de Meridian mediante una sesión del proveedor el 6 de mayo. Recomendamos suspender esa sesión y revisar su alcance hoy; la identidad del operador sigue sin determinar». R1 identifica contenido y R2 corrobora la transferencia desde otra fuente. R3/R4 no son dos corroboraciones nuevas. Una confianza moderada también es defendible si se explica qué limitación material afecta al juicio. No concluir que todos los diseños fueron robados ni atribuir al proveedor intención maliciosa. Responsable IAM/IR: suspender y revocar la sesión de aplicación según su alcance, preservar registros y comprobar que cesan las conexiones. TLP:AMBER+STRICT por el acuerdo del dossier.',
  },
  {
    kind: 'report', id: 'report-b', title: 'B · Intento bloqueado y eco de fuentes', minutes: 25,
    brief: 'El ISAC sectorial pide una alerta sobre intentos contra el portal de proveedores de Meridian. La comunidad ha acordado distribución interna entre sus miembros, sin publicación abierta: TLP:GREEN. Decide qué se puede afirmar sin transformar un intento bloqueado en una brecha confirmada.',
    hint: 'Distingue una respuesta de bloqueo de una autenticación aceptada. La falta de cobertura de una ventana debe aparecer como límite, sin convertirla en evidencia de compromiso.',
    assessment: 'attempt', confidence: ['high', 'moderate'], tlp: ['TLP:GREEN'], evidenceSets: [['R1', 'R3']],
    evidence: [
      { id: 'R1', at: '2026-05-08T07:00:00Z', source: 'Gateway de acceso · primaria', text: 'Entre 06:50 y 07:00 se registran 240 intentos con credenciales inválidas contra cuentas del proveedor. Todas las peticiones registradas terminan denegadas antes de crear sesión.' },
      { id: 'R2', at: '2026-05-08T07:20:00Z', source: 'Faro y Eco · misma procedencia', text: 'Faro titula «ataque al portal» usando R1; Eco cita a Faro. Ninguno recoge eventos posteriores al gateway ni evidencia de ficheros transferidos.' },
      { id: 'R3', at: '2026-05-08T07:10:00Z', source: 'Auditoría del portal · primaria independiente', text: 'En la ventana 06:45–07:10 no se creó ninguna sesión para las cuentas objetivo. El almacenamiento auditado no registra lecturas con esas identidades durante la misma ventana.' },
      { id: 'R4', at: '2026-05-08T07:30:00Z', source: 'Responsable de telemetría', text: 'La auditoría anterior a las 06:45 está fuera del dossier. Estos registros no permiten afirmar que nunca hubo otro acceso. No hay datos para identificar al operador.' },
      { id: 'R5', at: '2026-05-08T07:40:00Z', source: 'Acuerdo del ISAC', text: 'Se autoriza compartir patrones y medidas defensivas en la comunidad del ISAC, sin publicación pública ni detalles personales. El portal sigue operativo; detenerlo por completo interrumpiría pedidos.' },
    ],
    solution: 'BLUF posible: «Meridian observó un intento de acceso contra cuentas de proveedores, bloqueado en la ventana analizada; no hay evidencia de sesión creada ni de exfiltración en ese intervalo. Se recomienda a los miembros del ISAC revisar intentos equivalentes y validar sus controles». R1 y R3 son observaciones independientes; R2 es eco. Puede justificarse confianza alta o moderada sobre el bloqueo observado, sin extrapolar a ventanas no cubiertas. No presentar una previsión como hecho confirmado. Mantener servicio, revisar cuentas e indicadores con IAM/SOC hoy y verificar ausencia de nuevas sesiones no autorizadas. TLP:GREEN por el acuerdo explícito de comunidad.',
  },
];
