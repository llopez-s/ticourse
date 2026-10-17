/** s02-cadena «Del semáforo a la avenida» — on-screen strings (canon: out/scene-brief.md). */
import type { ToolIcon } from '../scenes/parts/Tools';

/** The five windows of s01, now five steps in a row (labels as in s01). */
export const SLOTS: { label: string; icon: ToolIcon }[] = [
  { label: 'EDR', icon: 'shield' },
  { label: 'proveedor de identidad', icon: 'user' },
  { label: 'cola del SOC', icon: 'archive' },
  { label: 'correo', icon: 'mail' },
  { label: 'teléfono', icon: 'phone' },
];
/** The one step that runs alone: the case opens itself (slot index). */
export const AUTO_SLOT = 2;

/** The case it opens, always with the same fields filled. */
export const CASE_TITLE = 'caso';
export const CASE_FIELDS = ['origen', 'cuenta', 'riesgo'] as const;

export const SAME = 'sale siempre igual';
export const AUTOMATION = 'Automation';

/** The flow, step by step (no product names). */
export const FLOW = {
  edr: 'el EDR avisa',
  ask: '¿desde dónde entró esa cuenta?',
  askSub: 'proveedor de identidad',
  open: 'abre el caso con todo dentro',
  risk: '¿riesgo alto?',
  yes: 'sí',
  warn: 'avisa a la guardia',
  warnSub: 'propone cortar sus sesiones',
  human: 'propone · decide la analista',
} as const;

export const ORCHESTRATION = 'Orchestration';
export const SOAR = 'en el SOC: SOAR';
export const PLAYBOOK = 'playbook';
