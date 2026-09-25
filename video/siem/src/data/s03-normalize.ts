import type { IconName } from '../../../engine/src/ui';

/**
 * Content of scene 03 "Normalizar". Three fictitious log lines, one per
 * dialect, all describing the same user (a.soto) from the same workstation
 * (10.20.6.52) within a few seconds at 10:14 Halden time (UTC+1 in March).
 */

export type FieldKey = 'hora' | 'host' | 'usuario' | 'ip' | 'accion';

export const FIELD_ORDER: FieldKey[] = ['hora', 'host', 'usuario', 'ip', 'accion'];

/** Column headers of the common schema. */
export const COLUMN_LABEL: Record<FieldKey, string> = {
  hora: 'hora',
  host: 'host',
  usuario: 'usuario',
  ip: 'ip_origen',
  accion: 'acción',
};

/** A run of characters in a raw line. `field` marks an extracted value, `key` the dialect's name for it. */
export interface RawPart {
  t: string;
  field?: FieldKey;
  key?: FieldKey;
}

export interface RawSource {
  id: string;
  icon: IconName;
  kind: string;
  dialect: string;
  parts: RawPart[];
  /** Normalised values, as they land in the common schema. */
  row: Record<FieldKey, string>;
  /** hora once stored in UTC. */
  utc: string;
}

export const SOURCES: RawSource[] = [
  {
    id: 'evt',
    icon: 'server',
    kind: 'Servidor',
    dialect: 'registro de eventos de seguridad',
    parts: [
      { t: '14/03 10:14:07', field: 'hora' },
      { t: ' ' },
      { t: 'EventID=', key: 'accion' },
      { t: '4624', field: 'accion' },
      { t: ' ' },
      { t: 'Computer=', key: 'host' },
      { t: 'SRV-TC-APP03', field: 'host' },
      { t: ' ' },
      { t: 'TargetUserName=', key: 'usuario' },
      { t: 'a.soto', field: 'usuario' },
      { t: ' ' },
      { t: 'IpAddress=', key: 'ip' },
      { t: '10.20.6.52', field: 'ip' },
    ],
    row: { hora: '10:14:07', host: 'srv-tc-app03', usuario: 'a.soto', ip: '10.20.6.52', accion: 'inicio de sesión' },
    utc: '09:14:07',
  },
  {
    id: 'fw',
    icon: 'firewall',
    kind: 'Firewall interno',
    dialect: 'pares clave=valor',
    parts: [
      { t: 'time=', key: 'hora' },
      { t: '10:14:09', field: 'hora' },
      { t: ' ' },
      { t: 'dvc=', key: 'host' },
      { t: 'fw-int01', field: 'host' },
      { t: ' ' },
      { t: 'src=', key: 'ip' },
      { t: '10.20.6.52', field: 'ip' },
      { t: ' dst=10.20.9.14 dport=22 ' },
      { t: 'usr=', key: 'usuario' },
      { t: 'a.soto', field: 'usuario' },
      { t: ' ' },
      { t: 'action=', key: 'accion' },
      { t: 'accept', field: 'accion' },
    ],
    row: { hora: '10:14:09', host: 'fw-int01', usuario: 'a.soto', ip: '10.20.6.52', accion: 'conexión permitida' },
    utc: '09:14:09',
  },
  {
    id: 'ssh',
    icon: 'terminal',
    kind: 'Servidor SSH',
    dialect: 'texto libre',
    parts: [
      { t: 'Mar 14 10:14:11', field: 'hora' },
      { t: ' ' },
      { t: 'srv-gis01', field: 'host' },
      { t: ' sshd[2231]: ' },
      { t: 'Accepted password', field: 'accion' },
      { t: ' ' },
      { t: 'for ', key: 'usuario' },
      { t: 'a.soto', field: 'usuario' },
      { t: ' ' },
      { t: 'from ', key: 'ip' },
      { t: '10.20.6.52', field: 'ip' },
      { t: ' port 51422' },
    ],
    row: { hora: '10:14:11', host: 'srv-gis01', usuario: 'a.soto', ip: '10.20.6.52', accion: 'inicio de sesión' },
    utc: '09:14:11',
  },
];

/** The UTC beat. */
export const UTC_BEAT = {
  local: '10:14',
  localLabel: 'hora de Halden',
  offset: 'UTC+1',
  shift: '-1 h',
  utc: '09:14',
  utcNote: 'igual para todas las fuentes',
} as const;
