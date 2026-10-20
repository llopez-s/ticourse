import { fmtInt } from '../../../../engine/src/theme/motion';

/**
 * The fictitious dataset of lesson s4m4 (src/data/practical/analysis-yara.ts): Demo-P, 1–30 September 2026 UTC.
 * Every number on screen comes from here. The family colours carry no engine meaning (cyan stays «data»).
 */
export interface Family {
  id: 'bruma' | 'cobalto' | 'duna';
  name: string;
  color: string;
  muestras: number;
  episodios: number;
  dispositivos: number;
  registros: number;
  organizaciones: number;
  sector: number;
  /** Devices observed in the last week of the window (a subset of `dispositivos`). */
  reciente: number;
  capacidad: string;
}

export const FAMILIES: Family[] = [
  { id: 'bruma', name: 'Bruma', color: '#fb923c', muestras: 1200, episodios: 130, dispositivos: 100, registros: 8000, organizaciones: 40, sector: 4, reciente: 10, capacidad: 'Robo de contraseñas' },
  { id: 'cobalto', name: 'Cobalto', color: '#60a5fa', muestras: 300, episodios: 540, dispositivos: 450, registros: 3000, organizaciones: 60, sector: 90, reciente: 180, capacidad: 'Contraseñas y material de sesión' },
  { id: 'duna', name: 'Duna', color: '#e7c98f', muestras: 80, episodios: 260, dispositivos: 220, registros: 12000, organizaciones: 100, sector: 22, reciente: 20, capacidad: 'Archivos y registros de navegador' },
];

export const [BRUMA, COBALTO, DUNA] = FAMILIES;

export type Metric = 'muestras' | 'episodios' | 'dispositivos' | 'registros' | 'organizaciones' | 'sector' | 'reciente';

export const fmt = (n: number) => fmtInt(n);

/** Row index of the family that leads a metric. */
export const leader = (m: Metric) => FAMILIES.reduce((best, f, i) => (f[m] > FAMILIES[best][m] ? i : best), 0);
