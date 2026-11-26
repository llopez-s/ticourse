// Pure geometry/text helpers for the network diagram (no React).
import type { NetDiagram } from '../../lib/supuesto';

export const NODE_W = 120;
export const NODE_H = 46;

export interface LinkSegment {
  from: string;
  to: string;
  x1: number; y1: number; x2: number; y2: number;
  mx: number; my: number;
  label?: string;
}

/** Link segments between node centres; links that point at unknown nodes are dropped. */
export function linkSegments(d: NetDiagram): LinkSegment[] {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  const out: LinkSegment[] = [];
  for (const l of d.links) {
    const a = byId.get(l.from);
    const b = byId.get(l.to);
    if (!a || !b) continue;
    out.push({ from: l.from, to: l.to, x1: a.x, y1: a.y, x2: b.x, y2: b.y, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, label: l.label });
  }
  return out;
}

const KIND_LABEL: Record<string, string> = {
  router: 'router', switch: 'switch', l3switch: 'switch de capa 3', firewall: 'cortafuegos',
  server: 'servidor', pc: 'puesto', ap: 'punto de acceso', cloud: 'nube',
};
export const kindLabel = (k: string) => KIND_LABEL[k] ?? k;

/** Text alternative: one line per node and per link. */
export function describeDiagram(d: NetDiagram): { nodes: string[]; links: string[] } {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  return {
    nodes: d.nodes.map((n) => n.label + ' (' + kindLabel(n.kind) + ')' + (n.sub ? ': ' + n.sub : '')),
    links: d.links.map((l) => {
      const a = byId.get(l.from)?.label ?? l.from;
      const b = byId.get(l.to)?.label ?? l.to;
      return a + ' ↔ ' + b + (l.label ? ' (' + l.label + ')' : '');
    }),
  };
}
