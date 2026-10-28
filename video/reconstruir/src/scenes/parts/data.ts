/**
 * Canon of «Cómo reconstruir lo ocurrido» (F4). Everything the screen shows as data lives here, once: the voice
 * never reads identifiers, so these strings are the only place they exist. All of it is «imagina» (training case,
 * no date). Change a public IP here and every scene follows.
 *
 * Source of truth: out/scene-brief.md «Canon» + docs/superpowers/plans/fichas-fundamentos/F4-reconstruir.md.
 */
import type { IconName } from '../../../../engine/src/ui';

// ---- Constants (public IPs are constants because they can change; 198.51.100.90 clashed with V4's listing).
export const UPLOAD_SITE_IP = '198.51.100.117';
export const UPLOAD_PORT = '443';
/** `198.51.100.117:443` */
export const UPLOAD_DST = `${UPLOAD_SITE_IP}:${UPLOAD_PORT}`;
export const UPLOAD_DOMAIN = 'subidas.compartir.example';
export const UPLOAD_URL = `${UPLOAD_DOMAIN}/upload`;
export const HOST = 'SALES-WS-03';
export const ACCOUNT = 'l.prado';
export const HOST_IP = '10.20.6.37';
export const EPHEMERAL_PORT = '52811';
/** `10.20.6.37:52811` */
export const HOST_SRC = `${HOST_IP}:${EPHEMERAL_PORT}`;
export const PROGRAM = 'syncbox.exe';
export const PID = 6120;
export const BYTES_OUT = '46180352';
/** The same figure as the chronology prints it. */
export const BYTES_OUT_SPACED = '46 180 352';

/** The case stamp, drawn by the scene from s02 to s11 (the engine only draws «Simulación educativa · datos ficticios»). */
export const STAMP_PARTS = ['Autoridad Portuaria de Halden', 'imagina', 'caso de entrenamiento', 'sin fecha', 'no ha pasado'] as const;

/** s01's alert. */
export const ALERT_TEXT = 'Subida bloqueada · almacenamiento personal';
export const ALERT_QUESTION = '¿se han llevado datos?';
export const VIDEO_TITLE = 'Cómo reconstruir lo ocurrido';
export const PROMISE_CHIPS = ['leer', 'normalizar', 'ordenar', 'afirmar lo justo'] as const;

// ---- The four sources (the «mesa»). Same order, icon and colour every time they appear.
export type SourceId = 'login' | 'proxy' | 'edr' | 'firewall';
export type WitnessKind = 'counter' | 'door' | 'window' | 'exit';

export interface SourceDef {
  id: SourceId;
  /** Full name, as the card prints it. */
  name: string;
  /** Short name, as a chip or the chronology's «fuente» column. */
  short: string;
  /** Format in one word. */
  format: string;
  /** Format with what makes it readable. */
  formatLong: string;
  icon: IconName;
  /** The witness that stands for the source (s02, s03, s10). */
  witness: WitnessKind;
  /** Where the witness stands, as the caption says. */
  place: string;
  /** How the source writes its time. */
  zone: string;
}

export const SOURCES: Record<SourceId, SourceDef> = {
  login: {
    id: 'login',
    name: 'Inicio de sesión del equipo',
    short: 'equipo',
    format: 'CSV',
    formatLong: 'CSV · columnas',
    icon: 'user',
    witness: 'counter',
    place: 'mostrador',
    zone: 'hora local, sin zona',
  },
  proxy: {
    id: 'proxy',
    name: 'Proxy web',
    short: 'proxy',
    format: 'texto',
    formatLong: 'texto',
    icon: 'globe',
    witness: 'door',
    place: 'puerta',
    zone: 'UTC (Z)',
  },
  edr: {
    id: 'edr',
    name: 'EDR del equipo',
    short: 'EDR',
    format: 'JSON',
    formatLong: 'JSON · nombre: valor',
    icon: 'shield',
    witness: 'window',
    place: 'ventana',
    zone: 'UTC',
  },
  firewall: {
    id: 'firewall',
    name: 'Cortafuegos de salida',
    short: 'cortafuegos',
    format: 'clave=valor',
    formatLong: 'clave=valor',
    icon: 'firewall',
    witness: 'exit',
    place: 'salida',
    zone: 'hora local, +01:00',
  },
};
export const SOURCE_ORDER: SourceId[] = ['login', 'proxy', 'edr', 'firewall'];

// ---- The five ingredients of a line (s03). Colours avoid the video's semantic ones (rose = 403 only,
// amber = doubt, emerald = checked, violet = exam, cyan = the source).
export type Ingredient = 'cuando' | 'donde' | 'quien' | 'que' | 'resultado';
export const INGREDIENTS: { id: Ingredient; label: string; color: string }[] = [
  { id: 'cuando', label: 'cuándo', color: '#60a5fa' },
  { id: 'donde', label: 'dónde', color: '#2dd4bf' },
  { id: 'quien', label: 'quién', color: '#e879f9' },
  { id: 'que', label: 'qué', color: '#a3e635' },
  { id: 'resultado', label: 'resultado', color: '#cbd5e1' },
];
export const INGREDIENT: Record<Ingredient, { label: string; color: string }> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, { label: i.label, color: i.color }]),
) as Record<Ingredient, { label: string; color: string }>;

// ---- Raw lines. A line is a list of pieces; the pieces joined are the line, character for character.
export interface Piece {
  t: string;
  /** Which of the five ingredients this piece is (proxy and firewall lines). */
  ing?: Ingredient;
  /** A field the later scenes can point at (`action`, `bytes_out`, `src`…). */
  field?: string;
  /** Syntax of the piece, for the JSON / CSV highlight: key, value or separator. */
  syn?: 'key' | 'val' | 'sep';
}
export type RawLine = Piece[];

const text = (line: RawLine) => line.map((p) => p.t).join('');
export const lineText = text;

/** `{"ts":"…","host":"…"}` from [key, value, quoted] triples. */
function jsonLine(pairs: [string, string, boolean][]): RawLine {
  const out: RawLine = [{ t: '{', syn: 'sep' }];
  pairs.forEach(([k, v, quoted], i) => {
    out.push({ t: `"${k}"`, syn: 'key', field: k });
    out.push({ t: ':', syn: 'sep' });
    out.push({ t: quoted ? `"${v}"` : v, syn: 'val', field: k });
    out.push({ t: i === pairs.length - 1 ? '}' : ',', syn: 'sep' });
  });
  return out;
}

/** `a,b,c` as pieces. */
function csvLine(cells: string[], fields: string[]): RawLine {
  const out: RawLine = [];
  cells.forEach((c, i) => {
    out.push({ t: c, syn: 'val', field: fields[i] });
    if (i < cells.length - 1) out.push({ t: ',', syn: 'sep' });
  });
  return out;
}


/** `key=value` as three pieces sharing one field (so a highlight boxes the whole pair). */
function kv(key: string, value: string, ing?: Ingredient): RawLine {
  return [
    { t: key, field: key, ing, syn: 'key' },
    { t: '=', field: key, ing, syn: 'sep' },
    { t: value, field: key, ing, syn: 'val' },
  ];
}

const CSV_FIELDS = ['hora', 'equipo', 'cuenta', 'evento', 'resultado'];

export const RAW: Record<SourceId, RawLine[]> = {
  login: [
    csvLine(CSV_FIELDS, CSV_FIELDS).map((p) => (p.syn === 'val' ? { ...p, syn: 'key' as const } : p)),
    csvLine(['09:58:12', HOST, ACCOUNT, '4624 inicio de sesión', 'correcto'], CSV_FIELDS),
  ],
  proxy: [
    [
      { t: '09:01:40Z', ing: 'cuando', field: 'ts' },
      { t: ' ' },
      { t: HOST, ing: 'donde', field: 'host' },
      { t: ' ' },
      { t: ACCOUNT, ing: 'quien', field: 'user' },
      { t: ' ' },
      { t: `POST ${UPLOAD_URL}`, ing: 'que', field: 'request' },
      { t: ' ' },
      { t: '403 BLOQUEADO', ing: 'resultado', field: 'status' },
      { t: ' categoría=almacenamiento personal' },
    ],
  ],
  edr: [
    jsonLine([
      ['ts', '09:02:41Z', true],
      ['host', HOST, true],
      ['user', ACCOUNT, true],
      ['event', 'process_start', true],
      ['process', PROGRAM, true],
      ['pid', String(PID), false],
      ['parent', 'explorer.exe', true],
    ]),
    jsonLine([
      ['ts', '09:02:58Z', true],
      ['host', HOST, true],
      ['user', ACCOUNT, true],
      ['event', 'network_connect', true],
      ['pid', String(PID), false],
      ['src', HOST_SRC, true],
      ['dst', UPLOAD_DST, true],
    ]),
  ],
  firewall: [
    [
      ...kv('start', '10:03:05+01:00', 'cuando'),
      { t: ' ' },
      ...kv('end', '10:06:06+01:00'),
      { t: ' ' },
      ...kv('action', 'ALLOW', 'resultado'),
      { t: ' ' },
      ...kv('src', HOST_SRC, 'donde'),
      { t: ' ' },
      ...kv('dst', UPLOAD_DST, 'que'),
      { t: ' ' },
      ...kv('proto', 'TCP'),
      { t: ' ' },
      ...kv('duration', '181s'),
      { t: ' ' },
      ...kv('bytes_out', BYTES_OUT, 'que'),
      { t: ' ' },
      ...kv('bytes_in', '61420'),
    ],
  ],
};

// ---- s03's cells: what each ingredient is on each source (the field names for the firewall).
export const PROXY_CELLS: Record<Ingredient, string> = {
  cuando: '09:01:40Z',
  donde: HOST,
  quien: ACCOUNT,
  que: 'POST subidas…',
  resultado: '403 BLOQUEADO',
};
export const FIREWALL_CELLS: Record<Ingredient, string[]> = {
  cuando: ['start'],
  donde: ['src'],
  quien: [],
  que: ['dst', `:${UPLOAD_PORT}`, 'bytes_out'],
  resultado: ['action=ALLOW'],
};
export const NOT_NOBODY = 'no lo apunta: no significa nadie';

// ---- s04: the clocks as they come (text order, not time order).
export type ClockId = 'proxy' | 'edr1' | 'edr2' | 'login' | 'fw';
export interface Clock {
  id: ClockId;
  source: SourceId;
  /** The clock part of the text. */
  time: string;
  /** What follows it: `Z`, `+01:00` or nothing. */
  zone: string;
  /** The same moment in UTC (s05). */
  utc: string;
}
/** In the order the ruler lays them out when it reads the text (not the order the voice names them). */
export const CLOCKS: Clock[] = [
  { id: 'proxy', source: 'proxy', time: '09:01:40', zone: 'Z', utc: '09:01:40' },
  { id: 'edr1', source: 'edr', time: '09:02:41', zone: 'Z', utc: '09:02:41' },
  { id: 'edr2', source: 'edr', time: '09:02:58', zone: 'Z', utc: '09:02:58' },
  { id: 'login', source: 'login', time: '09:58:12', zone: '', utc: '08:58:12' },
  { id: 'fw', source: 'firewall', time: '10:03:05', zone: '+01:00', utc: '09:03:05' },
];
export const CLOCK: Record<ClockId, Clock> = Object.fromEntries(CLOCKS.map((c) => [c.id, c])) as Record<ClockId, Clock>;
/** The UTC order (s05 on). */
export const UTC_ORDER: ClockId[] = ['login', 'proxy', 'edr1', 'edr2', 'fw'];

// ---- The chronology (s06; s07 and s08 reuse it).
export type Fact = { t: string; mono?: boolean; grey?: boolean }[];
export interface ChronoRow {
  id: 'r1' | 'r2' | 'r3' | 'r4' | 'r5';
  clock: ClockId;
  /** UTC time, as the table prints it. */
  utc: string;
  /** The original, in grey beside it. */
  original: string;
  fact: Fact;
  /** A grey remark under the fact, if any. */
  note?: string;
  source: SourceId;
}
export const CHRONO: ChronoRow[] = [
  {
    id: 'r1',
    clock: 'login',
    utc: '08:58:12',
    original: '09:58:12',
    fact: [{ t: 'inicio de sesión de ' }, { t: ACCOUNT, mono: true }, { t: ' en ' }, { t: HOST, mono: true }],
    source: 'login',
  },
  {
    id: 'r2',
    clock: 'proxy',
    utc: '09:01:40',
    original: '09:01:40Z',
    fact: [{ t: 'subida bloqueada a ' }, { t: UPLOAD_DOMAIN, mono: true }],
    source: 'proxy',
  },
  {
    id: 'r3',
    clock: 'edr1',
    utc: '09:02:41',
    original: '09:02:41Z',
    fact: [{ t: 'arranca ' }, { t: PROGRAM, mono: true }, { t: ` (PID ${PID})` }],
    note: 'solo el nombre del archivo',
    source: 'edr',
  },
  {
    id: 'r4',
    clock: 'edr2',
    utc: '09:02:58',
    original: '09:02:58Z',
    fact: [{ t: PROGRAM, mono: true }, { t: ' conecta a ' }, { t: UPLOAD_DST, mono: true }],
    source: 'edr',
  },
  {
    id: 'r5',
    clock: 'fw',
    utc: '09:03:05',
    original: '10:03:05+01:00',
    fact: [{ t: 'ALLOW', mono: true }, { t: ` desde el inicio, 181 s, ${BYTES_OUT_SPACED} bytes de salida` }],
    source: 'firewall',
  },
];
export const CHRONO_BY_ID = Object.fromEntries(CHRONO.map((r) => [r.id, r])) as Record<ChronoRow['id'], ChronoRow>;
