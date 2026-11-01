/** s12-tiempo «El tiempo y las simulaciones» — on-screen strings (canon: out/scene-brief.md). */

export const SIM_TAG = 'simulación · ejemplo · datos ficticios';
export const PBQ = 'performance-based questions';
export const CROSSWORD_TAG = 'imagen · no es del puerto';

export const BAR = {
  title: '90 minutos',
  sims: '15–20 min',
  test: 'test',
  budget: 'algo menos de 1 min por pregunta',
  blank: 'sin penalización · nunca en blanco',
} as const;

/** The three simulation thumbnails, each lit on its word of segment s12-02. */
export const SIM_WORDS = ['cortafuegos', 'ordenas', 'clasificas'] as const;

/** Firewall-rules thumbnail: the action of each row. */
export const FIREWALL_ROWS = ['permitir', 'denegar', 'permitir', 'denegar'] as const;
/** Response-steps thumbnail: the (disordered) number badges. */
export const STEP_NUMBERS = [3, 1, 4, 2] as const;
