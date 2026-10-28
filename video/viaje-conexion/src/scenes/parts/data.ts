/**
 * Canon data of «Cómo viaja una conexión» (F1). Every readable string of the video lives here so that
 * no scene retypes a literal; public addresses are constants because they may change (RFC 5737 ranges).
 * Source: out/scene-brief.md «Canon» and docs/superpowers/plans/fichas-fundamentos/F1-viaje-conexion.md.
 */

/** The shipping company's public address (what NAT puts in the origin box). Single source for F1, F2, F4. */
export const PUBLIC_IP = '198.51.100.17';
/** The booking portal's public address. */
export const PORTAL_IP = '192.0.2.44';
export const PORTAL_HOST = 'reservas.haldenport.example';
export const PORTAL_NAME = 'Autoridad Portuaria de Halden · portal de reservas';
export const PORTAL_BUTTON = 'Reservar atraque';
export const PORTAL_OK = 'Reserva confirmada';
/** The stopwatch of s01 and s11 (Spanish decimal comma). */
export const STOPWATCH = '0,4 s';

/** Stamps and image tags drawn by the scenes (the engine draws «Simulación educativa · datos ficticios»). */
export const CASE_STAMP = 'Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto';
export const IMAGE_TAG = 'imagen · no es del puerto';
export const TRAINING_TAG = 'ejemplo de entrenamiento';

/** A host of the office, split in the four numbers of its address. */
export interface Host {
  name: string;
  ip: string;
  prefix: number;
}
export const LAPTOP: Host = { name: 'portátil', ip: '192.168.20.10', prefix: 24 };
export const PRINTER: Host = { name: 'impresora', ip: '192.168.20.80', prefix: 24 };
/** Never `srv-fich02`: that name is kept free for F3/F4. */
export const SERVER: Host = { name: 'servidor de ficheros', ip: '192.168.30.10', prefix: 24 };
export const GATEWAY_OFFICE = '192.168.20.1';
export const GATEWAY_SERVERS = '192.168.30.1';
export const NET_OFFICE = '192.168.20.0/24';
export const NET_SERVERS = '192.168.30.0/24';
/** The router's third leg has no address in the video. */
export const ISP_LEG = 'proveedor de Internet';

/** Ports. 22 and 25 are shown as unlit offices, never asked. */
export const EPHEMERAL_PORT = '51422';
export const NAT_PORT = '61002';
export const HTTPS_PORT = '443';
export const OFFICES = ['443', '22', '25'] as const;
/** Ephemeral ports of the two other open connections in s06 (not canon elsewhere; new fillers, easy to change). */
export const OTHER_EPHEMERAL = ['51431', '51457'] as const;
export const RDP_PORT = '3389';

/** RFC 1918, in the order the video shows them. */
export const PRIVATE_RANGES = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'] as const;

/** The one time shown (NAT table in s08 and the portal's log line in s09). No date anywhere. */
export const NAT_TIME = '11:27:43';

/** Route table of s04/s05 (exact canon; the third row has no network). */
export const ROUTES = [
  { net: NET_OFFICE, leg: 'pata oficina' },
  { net: NET_SERVERS, leg: 'pata servidores' },
  { net: 'todo lo demás', leg: ISP_LEG },
] as const;

/** NAT table of s08/s09 (rows 2–4 are the fixed fillers: other laptops, same public address, same second). */
export const NAT_ROWS = [
  { inside: `${LAPTOP.ip}:${EPHEMERAL_PORT}`, outside: `${PUBLIC_IP}:${NAT_PORT}`, dest: `${PORTAL_IP}:${HTTPS_PORT}`, time: NAT_TIME },
  { inside: '192.168.20.31:49810', outside: `${PUBLIC_IP}:61003`, dest: `${PORTAL_IP}:${HTTPS_PORT}`, time: NAT_TIME },
  { inside: '192.168.20.32:50233', outside: `${PUBLIC_IP}:61004`, dest: `${PORTAL_IP}:${HTTPS_PORT}`, time: NAT_TIME },
  { inside: '192.168.20.33:52077', outside: `${PUBLIC_IP}:61005`, dest: `${PORTAL_IP}:${HTTPS_PORT}`, time: NAT_TIME },
] as const;

/** Outbound rules of s10 (exact canon). The third has no number and is grey. */
export const RULES = [
  { n: 1, who: 'Oficina a Internet', proto: 'TCP', ports: '443 y 80', verdict: 'permitir' },
  { n: 2, who: 'resolutor de la oficina a Internet', proto: 'UDP y TCP', ports: '53', verdict: 'permitir' },
  { n: null, who: 'lo demás hacia Internet', proto: '', ports: '', verdict: 'denegar' },
] as const;
export const RDP_PACKET = `equipo externo · ${RDP_PORT} · escritorio remoto`;
/** The translation NAT would write for the remote-desktop packet of s10 (another laptop; its own row, not a web row). */
export const RDP_NAT = { inside: '192.168.20.34:50761', outside: `${PUBLIC_IP}:61006` } as const;

/** Label stages of s11. */
export const STAGES = {
  office: { title: 'en la oficina', src: `${LAPTOP.ip}:${EPHEMERAL_PORT}`, dst: `${PORTAL_IP}:${HTTPS_PORT}` },
  router: { title: 'tras el router', src: `${PUBLIC_IP}:${NAT_PORT}`, dst: `${PORTAL_IP}:${HTTPS_PORT}` },
  portal: { title: 'en el portal', src: `${PUBLIC_IP}:${NAT_PORT}`, dst: `${PORTAL_IP}:${HTTPS_PORT}` },
} as const;

/** The three rules of s12 (exact canon). */
export const THREE_RULES = [
  'Misma red: entregas tú; si no, puerta de enlace; cada router decide el siguiente salto, también a la vuelta',
  'La etiqueta lleva direcciones y puertos; el puerto dice a qué servicio apunta, no qué contiene',
  'NAT cambia la etiqueta y lo apunta; quien decide qué pasa es el cortafuegos',
] as const;
