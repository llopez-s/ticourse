/**
 * S08 "Alcance: la flota y el XDR" — fictitious hosts only. Row 1 is the
 * three infected machines (Lucía's laptop, already known from s07, plus the
 * two new hits from the hunt); row 2 is clean, for contrast. ADM-WS-02 is an
 * administration station: "donde viven las llaves" per the narration.
 */
export const FLEET = [
  { host: 'OPS-WS-14', role: 'Portátil de Lucía', already: true, hit: false, admin: false },
  { host: 'OPS-WS-08', role: 'Operaciones', already: false, hit: true, admin: false },
  { host: 'ADM-WS-02', role: 'Administración', already: false, hit: true, admin: true },
  { host: 'FIN-WS-05', role: 'Finanzas', already: false, hit: false, admin: false },
  { host: 'LOG-WS-11', role: 'Logística', already: false, hit: false, admin: false },
  { host: 'SALES-WS-03', role: 'Comercial', already: false, hit: false, admin: false },
] as const;

/** The three IOCs the hunt searches for across every enrolled endpoint. */
export const HUNT_QUERY = [
  { label: 'Hash', value: 'b41f0e7c…c7a2' },
  { label: 'Dominio', value: 'cdn-halden-sync.example' },
  { label: 'Patrón', value: 'WINWORD.EXE > cmd.exe > powershell.exe -enc' },
] as const;

/** The five signal sources XDR correlates into one incident. */
export const XDR_SOURCES = [
  { icon: 'mail', label: 'Correo' },
  { icon: 'globe', label: 'DNS' },
  { icon: 'firewall', label: 'Firewall' },
  { icon: 'radar', label: 'IDS' },
  { icon: 'laptop', label: 'Endpoint' },
] as const;
