/** s02-contexto «El mismo fallo, dos servidores» — on-screen strings (storyboard.json, ficha V18). */
import { SRV_MSG01, SRV_MSG02 } from './findings';

export const ROWS = [
  { ...SRV_MSG01, listens: 'escucha en:', where: 'la red interna', sea: 'alta mar con temporal' },
  { ...SRV_MSG02, listens: 'escucha en:', where: 'solo este equipo', sea: 'dique seco' },
] as const;

/** What the voice points at, column by column. */
export const COLUMNS = {
  cve: { head: 'CVE', note: 'el nombre del fallo' },
  score: { head: 'CVSS', note: 'gravedad en abstracto · de 0 a 10 · nota base' },
  listens: { head: 'la ficha del equipo', note: 'lo que la nota no sabe' },
} as const;

/** The ship image (s02-04/05): the hole is the score, the sea is the context. */
export const HULL = {
  holeLabel: '9.8',
  holeNote: 'la nota · el tamaño del agujero',
  seaNote: 'el contexto · el mar',
  dock: 'dique seco',
  open: 'alta mar con temporal',
} as const;

/** The names the exam wants (s02-06). */
export const NAMES = {
  cve: { term: 'CVE', says: 'el nombre público del fallo' },
  cvss: { term: 'CVSS', says: 'severidad · de 0 a 10' },
  risk: { term: 'riesgo', says: 'lo pone el contexto' },
} as const;
