/** s03-techo «Hasta dónde llega lo que ves» — on-screen strings (canon: storyboard goal, exact). */

/** PAPER CRANE's card: V9's wording (src/data/course-gcti.ts). */
export const S03_CRANE = { name: 'PAPER CRANE', role: 'célula de engaño', does: 'siembra pistas falsas' } as const;

/** The word of the intercepted message that is tied to the SPONSOR band. */
export const S03_COUNTRY = { word: 'país', is: 'el tercer nivel' } as const;

export const S03_SPOT = 'tu telemetría';

/** The level names as the lanes write them here (the first one over two lines). */
export const S03_NAMES = [['MÁQUINA /', 'INFRAESTRUCTURA'], ['OPERADOR'], ['SPONSOR']] as const;

export const S03_DARK = 'no deja rastro en tu red';

/** What it would take to see band 3 (sky: sources beyond your network). `word` of s03-03 lights the line. */
export const S03_SOURCES = [
  { text: 'fuentes humanas', term: 'HUMINT', word: 'humanas' },
  { text: 'comunicaciones interceptadas', term: 'SIGINT', word: 'escuchas' },
  { text: 'financiación y órdenes', term: null, word: null },
  { text: 'registros legales', term: null, word: null },
] as const;
export const S03_HOLDERS = 'suelen tenerlas gobiernos, o fusión público-privada';

/**
 * The generic report card. The name stays in brackets (no vendor report on Meridian exists) and the
 * country is a dash: absent data, never a censored name.
 */
export const S03_REPORT = {
  header: ['así habla un informe serio:', 'se detiene donde acaba su evidencia'],
  name: '[nombre del conjunto]',
  overlap: 'solapamiento a nivel de operador con actividad anterior',
  confidence: { word: 'confianza', value: 'moderada', pips: 2 },
  country: { label: 'país:', value: '—' },
} as const;

export const S03_SET = { name: 'INTRUSION SET', sub: 'el grupo, tal como se le ve trabajar' } as const;

/** On the beam's edge. */
export const S03_CEILING = { reach: ['hasta aquí llega', 'la evidencia técnica'], rigor: ['no es debilidad,', 'es rigor'] } as const;

export const S03_WRAP = { levels: 'tres niveles', first: 'tu red ilumina bien el primero' } as const;
