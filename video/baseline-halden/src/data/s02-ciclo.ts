/** s02-ciclo «Escribirlo, imponerlo y que siga ahí» — on-screen strings (canon: out/scene-brief.md). */

export const GUIDE = { title: 'guía pública', chips: ['CIS Benchmark', 'STIG'] } as const;

/** The note beside the two struck lines (s02-01 «porque tal cual rompería aplicaciones»), two lines. */
export const NOTE = ['rompería una aplicación', 'del puerto · escrito por qué'] as const;

/** The three verbs, each lit when the voice names it (`word` in `seg`). */
export const VERBS = [
  { text: 'Establish', seg: 's02-01', word: 'establish' },
  { text: 'Deploy', seg: 's02-02', word: 'deploy' },
  { text: 'Maintain', seg: 's02-03', word: 'maintain' },
] as const;

export const CHANNEL = 'Group Policy';
export const SERVERS_LABEL = 'servidores Windows';
export const COMPARE = 'comparación semanal';
export const TRY = '«solo para probar»';
export const DRIFT = 'configuration drift';

/** The two exits, side by side, and their shop-window version under each. */
export const EXITS = [
  { title: 'la máquina vuelve al papel', sub: 'el maniquí vuelve a su sitio', seg: 's02-06', word: 'vuelve' },
  { title: 'el papel cambia, aprobado y por escrito', sub: 'la central cambia la foto', seg: 's02-06', word: 'cambia' },
] as const;

/** What never counts (struck). */
export const NEVER = 'la diferencia, viva y sin dueño';
