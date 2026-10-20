/** s06-ejes «Dónde vive y quién decide» — on-screen strings (canon: out/scene-brief.md). */

export const QUESTION = ['¿Por qué no llevarlas', 'a la nube?'] as const;

export const AXIS_WHERE = 'DÓNDE VIVE';
export const AXIS_WHO = ['QUIÉN LA', 'GESTIONA'] as const;

/** One line per entry: `seg` + `word` light it; `con` = the price (amber). */
export interface Entry {
  text: string;
  seg: string;
  word: string;
  con?: boolean;
  /** Frames after the word (for lines the voice does not say word for word). */
  delay?: number;
}

export const ON_PREM: { title: string; lines: Entry[] } = {
  title: 'ON-PREMISES',
  lines: [
    { text: 'control · latencia baja', seg: 's06-02', word: 'control' },
    { text: 'datos dentro', seg: 's06-02', word: 'datos' },
    { text: 'se compra antes de usar (capex)', seg: 's06-02', word: 'compras', con: true },
    { text: 'escalar es esperar', seg: 's06-02', word: 'compras', con: true, delay: 16 },
  ],
};

export const CLOUD: { title: string; lines: Entry[] } = {
  title: 'NUBE',
  lines: [
    { text: 'se paga por uso (opex)', seg: 's06-03', word: 'pagas' },
    { text: 'escala ya', seg: 's06-03', word: 'escalas' },
    { text: 'menos visibilidad', seg: 's06-03', word: 'ves', con: true },
    { text: 'dependes de otro', seg: 's06-03', word: 'dependes', con: true },
  ],
};

export const CENTRAL: { title: string; lines: Entry[] } = {
  title: 'CENTRALIZED',
  lines: [
    { text: 'una consola · la misma política', seg: 's06-04', word: 'consola' },
    { text: 'una sola vista', seg: 's06-04', word: 'política' },
    { text: 'si cae la consola, todas a ciegas', seg: 's06-04', word: 'si', con: true },
    { text: 'y es un objetivo', seg: 's06-04', word: 'ciegas', con: true, delay: 12 },
  ],
};

export const DECENTRAL: { title: string; lines: Entry[] } = {
  title: 'DECENTRALIZED',
  lines: [
    { text: 'cada sede decide rápido', seg: 's06-05', word: 'decide' },
    { text: 'si cae una, no arrastra al resto', seg: 's06-05', word: 'rápido', delay: 8 },
    { text: 'políticas distintas', seg: 's06-05', word: 'políticas', con: true },
    { text: 'registros que nadie junta', seg: 's06-05', word: 'registros', con: true },
  ],
};

/** The port's one dot, on the horizontal axis only. */
export const PORT_DOT = ['oficina: en su centro', 'de datos (on-premises)'] as const;

/** The football image's two words. */
export const FOOTBALL_WHERE = 'dónde';
export const FOOTBALL_WHO = 'quién';
