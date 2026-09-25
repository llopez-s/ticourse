import type { IconName } from '../ui';

/**
 * Content of scene 02 "Recoger" (log aggregation). Fictitious data only:
 * Autoridad Portuaria de Halden, internal hosts, no vendor names.
 */

export type GroupId = 'sys' | 'app' | 'inf';
export type LinkId = 'sys' | 'app' | 'fw' | 'cloud' | 'router';
export type InputId = 'agent' | 'syslog' | 'api' | 'netflow';

export interface SourceGroup {
  id: GroupId;
  icon: IconName;
  title: string;
  /** One-line meaning from the narration ("quién entró"...). */
  meaning: string;
  /** Local clock before NTP (drifted) — they all snap to CLOCK_SYNCED. */
  clock: string;
}

export const GROUPS: SourceGroup[] = [
  { id: 'sys', icon: 'server', title: 'Sistemas', meaning: '«quién entró»', clock: '10:14:37' },
  { id: 'app', icon: 'app', title: 'Aplicaciones', meaning: '«qué hizo»', clock: '10:14:51' },
  { id: 'inf', icon: 'network', title: 'Infraestructura', meaning: '«por dónde se movió»', clock: '10:14:16' },
];

export const CLOCK_SYNCED = '10:14:30';

/** Device line of the two single-row groups. */
export const DEVICE_LINE: Record<'sys' | 'app', string> = {
  sys: 'servidores y estaciones',
  app: 'correo, web, ERP',
};

/** Infrastructure rows, each with its own exit towards the collector. */
export const INFRA_ROWS: { link: LinkId; icon: IconName; text: string }[] = [
  { link: 'fw', icon: 'firewall', text: 'firewalls y switches' },
  { link: 'cloud', icon: 'cloud', text: 'nube' },
  { link: 'router', icon: 'router', text: 'routers' },
];

/** Collector inputs (one per collection method named in the narration). */
export const INPUTS: { id: InputId; label: string; detail?: string }[] = [
  { id: 'agent', label: 'agente' },
  { id: 'syslog', label: 'syslog', detail: '514 / 6514 TLS' },
  { id: 'api', label: 'API' },
  { id: 'netflow', label: 'NetFlow' },
];

export interface StoreLine {
  id: string;
  link: LinkId;
  host: string;
  what: string;
  /** Timestamp as stamped by the drifting source clock. */
  drifted: string;
  /** Timestamp once every source follows NTP. */
  synced: string;
  /** Position in true time order (0 = first). */
  order: number;
  /** Which packet of its link delivers it (0 = first, 1 = second...). */
  packet: number;
  /** Lines that also live in the domain controller's local log. */
  dc?: boolean;
}

/**
 * The central copy. Listed in ARRIVAL order; `order` is the true order that
 * appears once the clocks agree (drift: sistemas +7 s, aplicaciones +21 s,
 * infraestructura -14 s).
 */
export const STORE_LINES: StoreLine[] = [
  { id: 'b', link: 'sys', host: 'dc-01', what: 'inicio de sesión 4624', drifted: '10:14:08', synced: '10:14:01', order: 1, packet: 0, dc: true },
  { id: 'f', link: 'sys', host: 'dc-01', what: 'privilegios 4672', drifted: '10:14:12', synced: '10:14:05', order: 5, packet: 1, dc: true },
  { id: 'a', link: 'fw', host: 'fw-01', what: 'conexión permitida', drifted: '10:13:46', synced: '10:14:00', order: 0, packet: 0 },
  { id: 'd', link: 'cloud', host: 'nube', what: 'cambio de permisos', drifted: '10:13:49', synced: '10:14:03', order: 3, packet: 0 },
  { id: 'e', link: 'router', host: 'rt-core', what: 'flujo registrado', drifted: '10:13:50', synced: '10:14:04', order: 4, packet: 0 },
  { id: 'c', link: 'app', host: 'correo', what: 'buzón consultado', drifted: '10:14:23', synced: '10:14:02', order: 2, packet: 0 },
];

/** The domain controller's own copy, erased by the intruder. */
export const LOCAL_LOG: { time: string; id: string; what: string }[] = [
  { time: '10:14:01', id: '4624', what: 'inicio de sesión correcto' },
  { time: '10:14:05', id: '4672', what: 'privilegios especiales' },
];
