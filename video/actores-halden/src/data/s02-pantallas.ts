/** s02-pantallas «Dos pantallas, el mismo hueco» — on-screen strings (canon: out/scene-brief.md). */
import type { Level } from '../scenes/parts/Bars';

export const CASE = 'Imagina dos mañanas · caso de ejemplo · sin fecha';
/** Between the two screens once they change: no hole and no tool named. */
export const SAME = 'mismo hueco · misma herramienta descargada';
/** The departure screens' header (the passenger terminal). */
export const BOARD = 'Salidas';

/** The first morning: the slogan, and a link to a statement. */
export const CAUSE = { lines: ['Fuera los cruceros:', 'la ciudad no es un aparcamiento'], link: 'enlace a un comunicado' } as const;
/** The second morning: a mote (an unreadable tag) and greetings. */
export const NICK = 'saludos a los del foro';

/** Left: the one who protests; right: the one who shows off. Bars almost the same; the motive differs. */
export const ACTORS: {
  name: string;
  money: Level;
  skill: Level;
  wants: { text: string; en: string };
}[] = [
  {
    name: 'Hacktivist',
    money: { lo: 0.22, hi: 0.5, note: 'bajo o medio' },
    skill: { lo: 0.36 },
    wants: { text: 'que se sepa su causa', en: 'philosophical/political beliefs' },
  },
  {
    name: 'Unskilled attacker',
    money: { lo: 0.16 },
    skill: { lo: 0.26 },
    wants: { text: 'ver si puede, presumir', en: 'disruption/chaos' },
  },
];
