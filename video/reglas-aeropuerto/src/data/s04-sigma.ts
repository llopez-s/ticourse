/**
 * s04-sigma «Sigma, línea a línea» — on-screen strings (canon: out/scene-brief.md, «Canon strings», s04).
 * The lesson's Sigma rule itself lives in `rules.ts` (`SIGMA_RULE` / `SIGMA_LINE`): never retype it here.
 */

/** Rule A: the video's own «ejemplo» rule, one line that only looks at the card (the file name on disk). */
export const RULE_A: readonly string[] = ["Image|endswith: '\\wcssvc.exe'"];
export const RULE_A_LABEL = 'ejemplo';
/** Token of rule A that names the card it looks for. */
export const RULE_A_TOKEN = "'\\wcssvc.exe'";

export type SampleEvent = {
  /** Field `Image`: the boarding card (file name on disk), full path. */
  image: string;
  /** Field `OriginalFileName`: the passport (name inside the program). */
  ofn: string;
  /** Field `CommandLine`: the program first, then its arguments. */
  cmd: string;
};

/** The three sample events (no host, no time). The third enters on `ev-new`. */
export const EVENTS: readonly [SampleEvent, SampleEvent, SampleEvent] = [
  {
    image: 'C:\\Windows\\System32\\certutil.exe',
    ofn: 'CertUtil.exe',
    cmd: 'certutil.exe -decode a.txt payload.bin',
  },
  {
    image: '…\\wcssvc.exe',
    ofn: 'CertUtil.exe',
    cmd: 'wcssvc.exe -decode a.txt payload.bin',
  },
  {
    image: '…\\otro-nombre.exe',
    ofn: 'CertUtil.exe',
    cmd: 'otro-nombre.exe -decode a.txt payload.bin',
  },
];

export const S04_TEXT = {
  eventHeader: 'evento de ejemplo',
  fields: { image: 'Image', ofn: 'OriginalFileName', cmd: 'CommandLine' },
  quiet: 'no avisa',
  fires: 'avisa',
  /** Callouts while the rule is read part by part. */
  logsource: 'creación de procesos de Windows',
  selection: 'pasaporte',
  selectionSub: 'el nombre de dentro',
  flags: 'decodificar o descargar',
  filter: 'tarjeta',
  filterSub: 'el uso con su nombre normal no salta',
  cond: 'resta lo que filtra',
  /** Note beside event 1's verdict: the filter covers it. */
  filterCovers: 'el filtro lo cubre',
  /** Note beside event 3's verdict on «Ni el filtro la frena». */
  filterMisses: 'el filtro no cuadra',
  /** Rule A on `miss`. */
  missTag: 'no lo ve',
} as const;
