/**
 * s04-aplicacion «Una aplicación por dentro y en marcha» — on-screen strings (canon: out/scene-brief.md). The port's own
 * application has no name; the third-party library has no name or version. No SQL injection, no XSS.
 */

export const STAMP = { what: 'Caso de ejemplo', kind: 'sin fecha' } as const;
export const WHO = 'Desarrollo · una aplicación propia';

export interface Finding {
  text: string;
  /** The voice's word that brings it in (in `seg`), or none: then it follows the previous one. */
  seg?: string;
  word?: string;
  /** Struck through as noise. */
  noise?: boolean;
}

export const PANELS = [
  {
    head: 'El código',
    sub: 'antes de desplegar',
    findings: [
      { text: 'contraseña escrita en el código', seg: 's04-02', word: 'contraseña' },
      { text: 'cifrado obsoleto' },
      { text: 'ruido', noise: true },
    ] as Finding[],
    term: 'static analysis · SAST',
    termSeg: 's04-02',
    termWord: 'SAST',
    house: 'los planos',
  },
  {
    head: 'La aplicación en marcha',
    sub: 'desde fuera, sin el código',
    findings: [
      { text: 'la sesión no caduca', seg: 's04-03', word: 'sesión' },
      { text: 'inicio de sesión sin límite de intentos' },
    ] as Finding[],
    term: 'dynamic analysis · DAST',
    termSeg: 's04-03',
    termWord: 'DAST',
    house: 'los grifos',
  },
  {
    head: 'La lista de componentes',
    sub: 'SBOM',
    findings: [] as Finding[],
    term: 'package monitoring',
    termSeg: 's04-05',
    termWord: 'package',
    house: 'la lista de materiales',
  },
] as const;

/** Panel 3: the unnamed third-party library and its newly announced flaw. */
export const LIBRARY = { name: 'biblioteca de terceros', flaw: 'fallo recién anunciado', apps: 'aplicaciones del puerto' } as const;
/** Which of the port's applications carry the library (lit on «cuáles la llevan»). */
export const APPS_WITH_LIBRARY = [false, true, false, true, true] as const;
