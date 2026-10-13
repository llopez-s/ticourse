/** s05-despues «Después del parche» — on-screen strings (storyboard.json, ficha V18). */
import { SRV_MSG01 } from './findings';

export const RESCAN = { day: 'lunes 5-10', time: '08:30', what: 'rescan' } as const;

export const ROW = {
  host: SRV_MSG01.host,
  cve: SRV_MSG01.cve,
  again: 'detectada de nuevo',
  patched: 'Sistemas · parche instalado el 1-10 · 18:00',
} as const;

/** The think prompt's two buttons (the engine card carries the question). */
export const BUTTONS = ['volver a parchear', 'comprobar la versión'] as const;

/** How the row was found (shown only once the voice says «solo mira lo que el servicio anuncia»). */
export const METHOD = {
  how: 'comprobación remota del servicio, sin sesión',
  announces: 'versión que anuncia:',
  banner: 'msgq/3.1.4',
} as const;

/** The check on the machine itself. */
export const CONSOLE = {
  title: 'srv-msg01 · en el equipo',
  cmd: 'msgq --version',
  version: '3.1.7',
  changes: { label: 'registro de cambios', date: '1-10 · 18:00', before: 'msgq 3.1.4', after: '3.1.7' },
  package: { label: 'paquete instalado', value: '3.1.7' },
  service: { label: 'servicio activo', value: 'desde 1-10 18:12', note: 'no falta ningún reinicio' },
} as const;

export const SIGN = {
  banner: 'msgq/3.1.4',
  note: 'texto de la configuración · nadie lo cambió',
  label: 'el escáner leía el letrero, no el servicio',
} as const;

export const VERDICT = {
  stamp: 'FALSE POSITIVE',
  sub: 'documentado',
  fix: 'Sistemas corrige el texto · 5-10',
} as const;

export const CLOSED = { stamp: 'cerrado · con prueba', rescan: 'rescan · limpio' } as const;
