import type { Evidence, PivotCase } from '../../lib/labChallenge';

const noise: Evidence[] = [
  { id: 'N1', at: '2026-04-14', source: 'Geolocalización del ASN · desde P1', requires: 'P1', cost: 1, text: 'La IP está anunciada por un proveedor multinacional. El país del ASN no identifica al operador del dominio.' },
  { id: 'N2', at: '2026-04-14', source: 'Registro · desde P0', requires: 'P0', cost: 1, text: 'El registrador ofrece privacidad WHOIS a todos sus clientes. No se obtiene correo de registro.' },
  { id: 'N3', at: '2026-04-14', source: 'DNS · desde P0', requires: 'P0', cost: 1, text: 'Nameservers del proveedor con 80.000 dominios atendidos. No hay resolución histórica adicional en esta consulta.' },
  { id: 'N4', at: '2026-04-14', source: 'HTTP · desde P0', requires: 'P0', cost: 1, text: 'Respuesta Server: nginx. La versión no se expone. Cabecera presente en numerosos servicios sin relación.' },
  { id: 'N5', at: '2026-04-14', source: 'Feed Eco · desde P0', requires: 'P0', cost: 1, text: 'El feed cita el mismo aviso inicial de Meridian. No aporta observación propia ni nuevos artefactos.' },
  { id: 'N6', at: '2026-04-14', source: 'Reputación ASN · desde P1', requires: 'P1', cost: 1, text: 'El ASN contiene otros avisos históricos. No se facilita evidencia de vínculo operativo con este caso.' },
];

export const PIVOT_CASES: PivotCase[] = [
  {
    kind: 'pivot', id: 'pivot-a', title: 'A · Vecinos con historia', minutes: 25, budget: 12,
    brief: 'Meridian detecta phishing desde sso-meridian.example el 14 de abril. Investiga cuatro candidatos. Cada consulta descubre un registro, no una atribución. Puedes gastar 12 queries; no necesitas abrirlo todo. Los dominios y datos son ficticios y no se consultan en Internet.',
    hint: 'Compara ventanas temporales y busca observaciones independientes. Un vecino de IP histórico no equivale a un socio actual; un registrador compartido tampoco basta.',
    solution: 'Vincular hr-meridian.example por coexistencia temporal y formulario (P1/P4), y updates-meridian.example por certificado y beaconing (P2/P3). Excluir cdn-halden.example de este conjunto por la reasignación documentada (P5). Mantener vendor-check.example sin determinar (P6): compartir registrador no acredita vínculo ni inocencia. Solicitar telemetría adicional antes de bloquear candidatos inciertos. No atribuir una identidad humana.',
    evidence: [
      { id: 'P0', at: '2026-04-14T09:00:00Z', source: 'Aviso de Meridian · semilla', text: 'Correo de phishing preservado: enlace a sso-meridian.example. Destinatarios de compras de Meridian. Fuente primaria: gateway de correo.' },
      { id: 'P1', at: '2026-04-14', source: 'Passive DNS · desde P0', requires: 'P0', cost: 2, text: 'sso-meridian.example y hr-meridian.example resuelven a 203.0.113.18 entre el 12 y el 15 de abril. El proveedor confirma reasignación de esa IP el 10 de abril.' },
      { id: 'P2', at: '2026-04-14', source: 'Escaneo TLS · desde P0', requires: 'P0', cost: 2, text: 'sso-meridian.example y updates-meridian.example presentan la misma clave de certificado autofirmado entre el 13 y el 14 de abril. El escaneo no demuestra quién controla los servicios.' },
      { id: 'P3', at: '2026-04-14T10:04:00Z', source: 'Proxy de Meridian · desde P2', requires: 'P2', cost: 1, text: 'ENG-041, con ejecución del loader confirmada por EDR, conecta cada 60 s con updates-meridian.example. Captura local independiente del escaneo TLS.' },
      { id: 'P4', at: '2026-04-14T09:20:00Z', source: 'Captura del formulario · desde P1', requires: 'P1', cost: 1, text: 'Captura preservada por el equipo de phishing: hr-meridian.example copia el acceso de Meridian y envía credenciales al mismo endpoint collector de sso-meridian.example.' },
      { id: 'P5', at: '2026-04-14', source: 'Histórico y titularidad · desde P1', requires: 'P1', cost: 1, text: 'cdn-halden.example usó 203.0.113.18 en noviembre de 2025. Desde diciembre usa otra red; el proveedor del CDN confirma su titularidad y retirada antes de la reasignación del 10 de abril. Sin otros vínculos en este expediente.' },
      { id: 'P6', at: '2026-04-14', source: 'Registro de vendor-check · desde P0', requires: 'P0', cost: 1, text: 'vendor-check.example comparte registrador con la semilla. No hay email visible, dirección IP común ni telemetría de contenido. La colección no cubre su actividad.' },
      ...noise,
    ],
    candidates: [
      { id: 'hr', label: 'hr-meridian.example', verdict: 'linked', evidenceSets: [['P1', 'P4']], explanation: 'Coinciden en tiempo y el formulario captura hacia el mismo destino. La IP por sí sola sería insuficiente.' },
      { id: 'updates', label: 'updates-meridian.example', verdict: 'linked', evidenceSets: [['P2', 'P3']], explanation: 'El certificado se corrobora con comunicación del equipo comprometido observada por otra fuente.' },
      { id: 'cdn', label: 'cdn-halden.example', verdict: 'unrelated', evidenceSets: [['P5']], explanation: 'En este expediente se descarta la relación: la coincidencia es anterior a la reasignación y la titularidad está corroborada.' },
      { id: 'vendor', label: 'vendor-check.example', verdict: 'uncertain', evidenceSets: [['P6']], explanation: 'El registrador compartido no permite confirmar ni descartar el vínculo; falta cobertura.' },
    ],
  },
  {
    kind: 'pivot', id: 'pivot-b', title: 'B · El certificado compartido', minutes: 25, budget: 12,
    brief: 'Una nueva campaña usa compras-meridian.example. Esta vez el proveedor termina TLS para muchos clientes. Investiga cuatro candidatos sin trasladar mecánicamente las conclusiones del caso A. Presupuesto: 12 queries.',
    hint: 'Pregunta quién administra el certificado y cuándo se observaron las relaciones. Una evidencia directa del formulario pesa más que una coincidencia de proveedor.',
    solution: 'descargas-meridian.example queda sin determinar: P2 documenta terminación TLS compartida, sin telemetría que la corrobore. Vincular soporte-compras.example: formulario de captura y conexiones observadas en P3/P4. Vincular cdn-almacen.example por artefacto de sesión y configuración del loader en P5/P6; su nombre de CDN no demuestra legitimidad. Descartar estado-proveedor.example en este expediente por el control legítimo y destino verificado de P7. Priorizar contención de candidatos corroborados y pedir datos sobre descargas.',
    evidence: [
      { id: 'P0', at: '2026-04-14T08:30:00Z', source: 'Gateway de correo · semilla', text: 'Mensaje preservado: enlace a compras-meridian.example. No hay ejecución en la pasarela; el resto debe investigarse.' },
      { id: 'P1', at: '2026-04-14', source: 'Passive DNS · desde P0', requires: 'P0', cost: 2, text: 'La semilla usa 198.51.100.25, proxy inverso compartido. soporte-compras.example y estado-proveedor.example también pasan por ese proveedor durante abril.' },
      { id: 'P2', at: '2026-04-14', source: 'TLS y contrato de servicio · desde P0', requires: 'P0', cost: 2, text: 'descargas-meridian.example presenta el mismo certificado gestionado que la semilla. El proveedor confirma terminación TLS común para miles de clientes. No hay contenido preservado ni conexiones de Meridian a descargas.' },
      { id: 'P3', at: '2026-04-14T09:02:00Z', source: 'Captura de phishing · desde P1', requires: 'P1', cost: 1, text: 'soporte-compras.example publica el formulario de compras de Meridian con el mismo identificador de campaña y destino collector que la semilla.' },
      { id: 'P4', at: '2026-04-14T09:10:00Z', source: 'Proxy de Meridian · desde P3', requires: 'P3', cost: 1, text: 'Dos sesiones de navegador de usuarios que recibieron el correo envían POST al collector de soporte-compras.example. Fuente independiente de la captura de phishing.' },
      { id: 'P5', at: '2026-04-14T09:12:00Z', source: 'Captura de sesión · desde P0', requires: 'P0', cost: 1, text: 'La sesión capturada desde la semilla descarga stage-demo.bin de cdn-almacen.example; el hash coincide con la muestra preservada por EDR.' },
      { id: 'P6', at: '2026-04-14T09:15:00Z', source: 'Configuración de muestra · desde P5', requires: 'P5', cost: 1, text: 'El análisis independiente del loader preservado identifica cdn-almacen.example como servidor de segunda etapa y el mismo ID de campaña. No hay evidencia de que sea un CDN comercial legítimo.' },
      { id: 'P7', at: '2026-04-14', source: 'Titularidad y contenido · desde P1', requires: 'P1', cost: 1, text: 'El proveedor acredita control de estado-proveedor.example. Una captura independiente conserva su página de estado y destino de formularios corporativo autorizado. Coincidir en proxy es la única relación con la semilla en el expediente.' },
      ...noise,
    ],
    candidates: [
      { id: 'downloads', label: 'descargas-meridian.example', verdict: 'uncertain', evidenceSets: [['P2']], explanation: 'TLS está terminado por el proveedor: no acredita control común de los dominios. Tampoco demuestra que descargas sea inocuo.' },
      { id: 'support', label: 'soporte-compras.example', verdict: 'linked', evidenceSets: [['P3', 'P4']], explanation: 'El formulario de campaña se corrobora con envíos observados desde usuarios afectados.' },
      { id: 'cdn', label: 'cdn-almacen.example', verdict: 'linked', evidenceSets: [['P5', 'P6']], explanation: 'La descarga y la configuración del loader corroboran el papel operativo del dominio.' },
      { id: 'status', label: 'estado-proveedor.example', verdict: 'unrelated', evidenceSets: [['P7']], explanation: 'Control y contenido legítimos corroborados; la infraestructura de proxy común no basta para vincularlo.' },
    ],
  },
];
