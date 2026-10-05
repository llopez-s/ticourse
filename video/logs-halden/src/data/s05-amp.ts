/**
 * s05-amp «Pedidos que nadie hizo» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * NetFlow inbound to `hpa-portal-web-01`, 05:40–06:05: only the four example resolvers are readable;
 * the other rows are drawn texture (bars, no digits). The 60 / 3.000 bytes figures are the lesson's
 * (`src/data/secplus/sp2-part4.ts:31`) and are shown as a sketch of the mechanism, never as log data.
 */

export const FLOW = {
  title: 'NetFlow · entrante a',
  host: 'hpa-portal-web-01',
  window: '05:40–06:05',
  cols: { proto: 'proto', src: 'origen', port: 'puerto' },
} as const;

/** The four readable rows: `UDP · 198.51.100.61:53`… */
export const FLOW_ROWS: readonly { proto: string; ip: string; port: string }[] = [
  { proto: 'UDP', ip: '198.51.100.61', port: '53' },
  { proto: 'UDP', ip: '198.51.100.140', port: '53' },
  { proto: 'UDP', ip: '198.51.100.203', port: '53' },
  { proto: 'UDP', ip: '198.51.100.212', port: '53' },
];

export const COUNTERS = {
  sources: { lead: 'orígenes distintos:', value: 340 },
  link: { lead: 'enlace de 1 Gb/s', sep: ' · ', value: '100 %' },
  asked: { lead: 'consultas DNS del portal a esos servidores:', value: '0' },
} as const;

/** The image: the address the caller gives. */
export const ADDRESS = 'tu dirección';

/** Mechanism sketch, labelled as such. */
export const SKETCH = {
  tag: ['esquema del mecanismo', 'no es del registro'],
  question: 'pregunta: 60 bytes',
  answer: 'respuesta: 3.000 bytes',
  /** Bytes, for bars drawn to scale. */
  q: 60,
  a: 3000,
} as const;

/** Exam names (English) and what each stands for in the image. */
export const NAMES = {
  reflected: 'REFLECTED',
  reflectedSub: 'la dirección falsa',
  amplified: 'AMPLIFIED',
  amplifiedSub: 'el pedido enorme',
  joined: 'DNS AMPLIFICATION',
} as const;

/** The struck-through trap: only «DNS poisoning» is struck; the reason stays readable. */
export const NOT_POISON = { term: 'DNS poisoning', sep: ': ', rest: 'te cambia a dónde vas; esto te atasca la calle' } as const;

/**
 * The answer, after the think prompt, in the order the voice gives it («Al proveedor. Esos servidores
 * son de terceros…»), then the source-side fix the voice leaves to the screen.
 */
export const ANSWER: readonly { id: 'provider' | 'third' | 'source'; text: string }[] = [
  { id: 'provider', text: 'filtrado en el proveedor · servicio anti-DDoS' },
  { id: 'third', text: 'resolvers abiertos de terceros' },
  { id: 'source', text: 'en origen: cerrar los resolvers abiertos' },
];

/** Shown only after the answer (no spoiler): what the night shift did. */
export const ON_CALL = { lead: 'guardia', sep: ' · ', time: '05:44', rest: ['aviso de caída', 'llamada al proveedor'] } as const;
