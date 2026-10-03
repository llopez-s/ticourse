/**
 * s02-creep «La acreditación que solo suma» — on-screen strings (canon: scene brief «Canon» > s02).
 * c.navarro's badge: one column per post, oldest first, so the doors read as
 * a history that only added. Cyan = her current post, amber = earlier posts.
 */
import type { BadgeCaption, BadgeHead, DoorDef } from '../scenes/parts/Badge';

export const HEADER = { date: '19-10', text: 'revisión trimestral de accesos' } as const;

export const PERSON = { name: 'c.navarro', dept: 'Comunicación' } as const;

/** The three posts as column heads (oldest first), with the word that brings each in (s02-02). */
export const POSTS: (BadgeHead & { word: string })[] = [
  { text: 'Atención a navieras · 2021', tone: 'amber', word: 'otros' },
  { text: 'Facturación · 2023', tone: 'amber', word: 'dos' },
  { text: 'Comunicación · 2025', tone: 'cyan', word: 'comunicación' },
];

export const CAPTIONS: Omit<BadgeCaption, 'at'>[] = [
  { text: 'de puestos anteriores', tone: 'amber', col: 0, span: 2 },
  { text: 'de su puesto', tone: 'cyan', col: 2, span: 1 },
];

/** The eleven doors. Column = post. */
export const DOORS: Pick<DoorDef, 'label' | 'tone' | 'col' | 'row'>[] = [
  { label: 'avisos a navieras', tone: 'amber', col: 0, row: 0 },
  { label: 'escalas de buques · ver', tone: 'amber', col: 0, row: 1 },
  { label: 'buzón de navieras', tone: 'amber', col: 0, row: 2 },
  { label: 'facturas a navieras · emitir', tone: 'amber', col: 1, row: 0 },
  { label: 'tarifas portuarias · editar', tone: 'amber', col: 1, row: 1 },
  { label: 'cobros pendientes', tone: 'amber', col: 1, row: 2 },
  { label: 'abonos', tone: 'amber', col: 1, row: 3 },
  { label: 'web del puerto · editar', tone: 'cyan', col: 2, row: 0 },
  { label: 'notas de prensa', tone: 'cyan', col: 2, row: 1 },
  { label: 'redes sociales del puerto', tone: 'cyan', col: 2, row: 2 },
  { label: 'archivo de fotos', tone: 'cyan', col: 2, row: 3 },
];

export const FOCUS_DOOR = { label: 'facturas a navieras · emitir', note: 'nadie lo decidió' } as const;

export const TERMS = {
  creep: 'PERMISSION CREEP',
  least: { term: 'LEAST PRIVILEGE', sub: 'solo lo que pide el puesto' },
  attest: { term: 'ATTESTATION', sub: 'cada responsable confirma qué se queda' },
} as const;

export const CONFIRM = 'responsable de Comunicación: confirma 4';
export const RETIRED = 'no confirmado · retirado';
