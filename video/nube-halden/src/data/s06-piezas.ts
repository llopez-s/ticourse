/** s06-piezas «Una puerta por pieza» — on-screen strings (canon: out/scene-brief.md). */

export const BRANCHES_SAFE = 'las demás no pierden nada';

export const PORT = { what: 'En el puerto · aplicación nueva', kind: 'propuesta · sin fecha' } as const;

/** The three pieces, no names: what each one does. */
export const PIECES = ['recibe las peticiones', 'guarda los datos', 'manda los avisos'] as const;
export const DEPLOY = 'despliegue propio';

export const TERMS = { micro: 'microservices', blast: 'blast radius', s2s: 'service-to-service authentication' } as const;

export const MONOLITH = { name: 'una sola pieza', hit: 'el daño llega a todo' } as const;

export const API = 'API';
export const CALLS = 'más puertas · más registros';

export const DECISION = { text: 'cada pieza comprueba quién la llama, aunque venga de dentro', small: 'mTLS · tokens' } as const;
