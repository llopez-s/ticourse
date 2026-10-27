export interface Evidence {
  id: string;
  at: string;
  source: string;
  text: string;
  cost?: number;
  requires?: string;
}

export interface ChallengeBase {
  id: string;
  title: string;
  brief: string;
  minutes: number;
  hint: string;
  solution: string;
}

export type PivotDecision = 'linked' | 'unrelated' | 'uncertain';
export interface PivotCandidate {
  id: string;
  label: string;
  verdict: PivotDecision;
  evidenceSets: string[][];
  explanation: string;
}
export interface PivotCase extends ChallengeBase {
  kind: 'pivot';
  budget: number;
  evidence: Evidence[];
  candidates: PivotCandidate[];
}

export interface ReportCase extends ChallengeBase {
  kind: 'report';
  evidence: Evidence[];
  assessment: 'exfiltration' | 'access' | 'attempt';
  confidence: string[];
  tlp: string[];
  evidenceSets: string[][];
}

export interface LogRecord {
  id: string;
  at: string;
  source: 'auth' | 'endpoint' | 'firewall';
  host: string;
  user: string;
  event: string;
  detail: string;
}
export interface LogCase extends ChallengeBase {
  kind: 'logs';
  records: LogRecord[];
  host: string;
  account: string;
  timeline: string[];
}

export type ChallengeCase = PivotCase | ReportCase | LogCase;
export interface ChallengeAnswer {
  decisions: Record<string, string>;
  references: Record<string, string[]>;
  text: Record<string, string>;
  timeline: string[];
}

export interface ChallengeCheck { id: string; label: string; ok: boolean; explanation: string }

export const emptyChallengeAnswer = (): ChallengeAnswer => ({ decisions: {}, references: {}, text: {}, timeline: [] });

export const WRITING_FIELDS = {
  pivot: [
    { id: 'conclusion', label: 'Conclusión y evidencia', prompt: '¿Qué vinculas al caso y con qué evidencias? Usa sus IDs y distingue observación de inferencia.' },
    { id: 'alternative', label: 'Alternativa e incertidumbre', prompt: 'Propón otra explicación y explica qué dato permitiría refutarla o aumentar tu confianza.' },
    { id: 'action', label: 'Recomendación', prompt: '¿Qué investigas o contienes ahora, quién debe hacerlo y qué límite condiciona la acción?' },
  ],
  report: [
    { id: 'bluf', label: 'BLUF', prompt: 'Abre con el juicio principal, su importancia y la decisión que debe tomar el destinatario.' },
    { id: 'evidence', label: 'Evidencias y razonamiento', prompt: 'Cita IDs del dossier y explica cómo sostienen el juicio. No cuentes una republicación como fuente independiente.' },
    { id: 'limits', label: 'Confianza, probabilidad y límites', prompt: 'Justifica la confianza, separa lo observado de la previsión y explica qué sigue sin saberse.' },
    { id: 'action', label: 'Recomendación operativa', prompt: 'Indica acción proporcionada, responsable y plazo. Ajusta el detalle al destinatario del briefing.' },
  ],
  logs: [
    { id: 'conclusion', label: 'Diagnóstico', prompt: 'Explica la secuencia citando los IDs de eventos. ¿Qué permite afirmar y qué no demuestra?' },
    { id: 'limits', label: 'Alternativa y visibilidad', prompt: 'Distingue actividad autorizada y sospechosa. Explica una alternativa y una carencia de telemetría.' },
    { id: 'action', label: 'Contención y verificación', prompt: 'Propón acciones sobre equipo y cuenta, conservación de evidencia, responsable y comprobación posterior.' },
  ],
} as const;

export const RUBRIC = [
  { id: 'evidence', title: 'Evidencia', levels: ['No cita datos comprobables.', 'Cita datos pertinentes, pero falta trazabilidad o independencia.', 'Cita IDs concretos, contrasta procedencia y distingue hechos de inferencias.'] },
  { id: 'reasoning', title: 'Razonamiento', levels: ['Afirma una conclusión sin explicarla.', 'Explica la hipótesis principal con algún salto lógico.', 'Conecta datos y juicio, considera una alternativa y explica cómo contrastarla.'] },
  { id: 'uncertainty', title: 'Incertidumbre', levels: ['Expresa certeza sin límites.', 'Menciona una limitación sin explicar su efecto.', 'Justifica confianza, separa probabilidad y confianza, y nombra qué evidencia falta.'] },
  { id: 'action', title: 'Utilidad de la acción', levels: ['No propone una decisión aplicable.', 'Propone una acción, pero sin responsable o verificación.', 'Propone acción proporcionada, responsable, plazo y criterio de verificación.'] },
] as const;

function supports(selected: string[], accepted: string[][]) {
  const allowed = new Set(accepted.flat());
  return accepted.some((set) => set.every((id) => selected.includes(id)))
    && selected.every((id) => allowed.has(id));
}

export function readyToSubmit(data: ChallengeCase, answer: ChallengeAnswer, opened: string[] = []) {
  if (!WRITING_FIELDS[data.kind].every((f) => typeof answer.text[f.id] === 'string' && answer.text[f.id].trim().length > 0)) return false;
  if (data.kind === 'pivot') return data.candidates.every((c) =>
    ['linked', 'unrelated', 'uncertain'].includes(answer.decisions[c.id])
    && answer.references[c.id]?.length > 0
    && answer.references[c.id].every((id) => opened.includes(id) && data.evidence.some((e) => e.id === id)));
  if (data.kind === 'report') return ['exfiltration', 'access', 'attempt'].includes(answer.decisions.assessment)
    && ['low', 'moderate', 'high'].includes(answer.decisions.confidence)
    && ['TLP:RED', 'TLP:AMBER+STRICT', 'TLP:AMBER', 'TLP:GREEN', 'TLP:CLEAR'].includes(answer.decisions.tlp)
    && answer.references.report?.length >= 2
    && answer.references.report.every((id) => data.evidence.some((e) => e.id === id));
  return !!answer.text.host?.trim() && !!answer.text.account?.trim() && answer.timeline.length === data.timeline.length
    && new Set(answer.timeline).size === answer.timeline.length
    && answer.timeline.every((id) => data.records.some((e) => e.id === id));
}

export function evaluateChallenge(data: ChallengeCase, answer: ChallengeAnswer): ChallengeCheck[] {
  if (data.kind === 'pivot') return data.candidates.flatMap((c) => [
    { id: `${c.id}-decision`, label: `${c.label} · valoración`, ok: answer.decisions[c.id] === c.verdict, explanation: c.explanation },
    { id: `${c.id}-evidence`, label: `${c.label} · soporte documental`, ok: supports(answer.references[c.id] ?? [], c.evidenceSets),
      explanation: `Soporte esperado: ${c.evidenceSets.map((set) => set.join(' + ')).join(' o ')}. ${c.explanation}` },
  ]);
  if (data.kind === 'report') return [
    { id: 'assessment', label: 'Alcance demostrado', ok: answer.decisions.assessment === data.assessment,
      explanation: data.assessment === 'exfiltration' ? 'Hay evidencia de transferencia de datos fuera del entorno, además del acceso.'
        : data.assessment === 'access' ? 'Hay acceso confirmado; la evidencia no basta para confirmar exfiltración.' : 'Se observa un intento bloqueado; no se demuestra acceso con éxito.' },
    { id: 'confidence', label: 'Confianza defendible', ok: data.confidence.includes(answer.decisions.confidence),
      explanation: `Se aceptan ${data.confidence.join(' / ')} con justificación en la rúbrica; el selector no valida por sí solo tu razonamiento.` },
    { id: 'tlp', label: 'Distribución acordada', ok: data.tlp.includes(answer.decisions.tlp), explanation: `El acuerdo explícito de este dossier admite ${data.tlp.join(' o ')}.` },
    { id: 'references', label: 'Fuentes que sostienen el juicio', ok: supports(answer.references.report ?? [], data.evidenceSets),
      explanation: `Combina ${data.evidenceSets.map((set) => set.join(' + ')).join(' o ')}. Una copia del mismo informe no añade corroboración independiente.` },
  ];
  return [
    { id: 'host', label: 'Equipo afectado', ok: answer.text.host?.trim().toUpperCase() === data.host, explanation: `La secuencia investigada afecta a ${data.host}.` },
    { id: 'account', label: 'Cuenta afectada', ok: answer.text.account?.trim().toLowerCase() === data.account, explanation: `La cuenta que enlaza la secuencia es ${data.account}.` },
    { id: 'timeline', label: 'Cronología sustentada', ok: answer.timeline.join('|') === data.timeline.join('|'),
      explanation: `Cadena esperada: ${data.timeline.join(' → ')}. Se exige orden temporal y evidencia de las acciones, no solo proximidad horaria.` },
  ];
}

export function filterLogs(records: LogRecord[], query: string, source: string, field: 'all' | 'host' | 'user' | 'event', from: string, to: string, descending: boolean) {
  const needle = query.trim().toLowerCase();
  return records.filter((r) => (source === 'all' || r.source === source)
    && (!from || r.at.slice(11, 16) >= from) && (!to || r.at.slice(11, 16) <= to)
    && (field === 'all' ? Object.values(r).join(' ') : r[field]).toLowerCase().includes(needle))
    .sort((a, b) => (descending ? -1 : 1) * (a.at.localeCompare(b.at) || a.id.localeCompare(b.id)));
}

export function queryEvidence(data: PivotCase, opened: string[], id: string): string[] {
  const item = data.evidence.find((e) => e.id === id);
  if (!item || opened.includes(id) || (item.requires && !opened.includes(item.requires))) return opened;
  const spent = data.evidence.filter((e) => opened.includes(e.id)).reduce((sum, e) => sum + (e.cost ?? 0), 0);
  return spent + (item.cost ?? 0) <= data.budget ? [...opened, id] : opened;
}
