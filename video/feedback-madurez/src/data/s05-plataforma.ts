/** s05-plataforma «Una compra tentadora»: on-screen text (canon: out/scene-brief.md). */
export const S05_TRAP = 'la trampa del paso 1 a 2';

export const S05_FLEET = 'flota sin líneas';

export const S05_TIP = {
  title: 'plataforma de inteligencia de amenazas (TIP)',
  note: 'amplifica lo que hay · no crea el proceso',
} as const;

/** Hypothetical team: never Meridian. Shown from the first frame of the question to the end of the answer. */
export const S05_HYPOTHETICAL = 'Ejemplo hipotético · no es el equipo de Meridian';

export const S05_TOKEN = ['plataforma cara ·', 'sin requirements escritos'] as const;

export const S05_ANSWER = 'sin requirements escritos no hay estadio 2';

export const S05_ORDER = [
  { n: 1, text: 'consumidores y requirements', word: 'Primero' },
  { n: 2, text: 'productos y proceso', word: 'Luego' },
  { n: 3, text: 'herramienta para escalar', word: 'final' },
] as const;
