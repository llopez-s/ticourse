/**
 * s07-decidir «Dos controles, dos respuestas» — on-screen strings (canon: out/scene-brief.md).
 * Anti-spoiler: the think prompt's two buttons stay identical until `closes`. The pumps network
 * is drawn on its own (no line to any zone or VLAN), with pumps and water only: no PLC, nothing
 * named. `portTraffic` is the only string not in the canon (the separate road at `why`).
 */

export const S07 = {
  mgmtFw: 'cortafuegos de gestión',
  /** The two think-prompt buttons, in this order. */
  choices: { open: 'abre', close: 'cierra' },
  closedTerm: 'FAIL-CLOSED',
  /** What sits behind the management firewall (inside the management zone). */
  behind: ['los mandos de cada switch', 'y cada cortafuegos'] as const,
  /** Not canon: label of the port's own road, which never crosses the management firewall. */
  portTraffic: 'el tráfico del puerto',
  onlyAdmin: { lead: 'lo único que se para es ', key: 'administrar' },
  pumps: 'en la red de las bombas de las esclusas',
  ops: 'Operaciones',
  flood: ['si se paran las bombas,', 'se puede inundar un muelle'] as const,
  /** Canon «fail-open, o fuera del camino», shown as the exam term plus its alternative. */
  opens: { term: 'FAIL-OPEN', sub: 'o fuera del camino' },
  risk: ['el riesgo se cubre', 'separando y vigilando'] as const,
  cost: 'ninguno es el bueno: decide lo que cuesta más',
} as const;
