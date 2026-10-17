/** s06-fuera «Lo que pasa fuera» — on-screen strings (canon: out/scene-brief.md). No keys, no sale in the port. */
import type { TiendaKind } from '../scenes/parts/Tienda';

/** Phase A labels under the silhouettes. */
export const INSIDE_LABEL = 'dentro de casa';
export const OUTSIDE_LABEL = 'fuera';

export interface Source {
  kind: TiendaKind;
  cue: string;
  title: string;
  /** Where the title lands (a word in `seg`); otherwise with the card. */
  titleSeg?: string;
  titleWord?: string;
  term?: string;
  lines: readonly string[];
  small?: string;
  width: number;
}

/** The four sources, in narration order, widths chosen so every line fits at ≥ 32 px (sum + 3 gaps = 1728). */
export const SOURCES: readonly Source[] = [
  { kind: 'periodico', cue: 'osint', title: 'OSINT', titleSeg: 's06-02', titleWord: 'OSINT', lines: ['publicado · gratis', 'hay que cribar'], width: 360 },
  { kind: 'avisos', cue: 'paid', title: 'fuentes de pago', term: 'proprietary', lines: ['alguien criba por ti'], width: 380 },
  {
    kind: 'grupo',
    cue: 'isac',
    title: 'ISAC',
    titleSeg: 's06-05',
    titleWord: 'ISAC',
    lines: ['el sector se lo cuenta', 'no se publica'],
    small: 'para un puerto, el ISAC marítimo',
    width: 440,
  },
  {
    kind: 'mercadillo',
    cue: 'darkweb',
    title: 'dark web monitoring',
    lines: ['lo tuyo a la venta', 'tus credenciales', 'tus datos', 'tu nombre como objetivo'],
    width: 476,
  },
];

/** The sign on the mercadillo's stall, on `keys` (two lines). */
export const STALL_SIGN = ['tus credenciales', 'tus datos · tu nombre'] as const;
