import { describe, expect, it } from 'vitest';
import { describeDiagram, linkSegments } from './netDiagram';
import type { NetDiagram } from '../../lib/supuesto';

const d: NetDiagram = {
  width: 400, height: 200,
  nodes: [
    { id: 'a', label: 'FW', kind: 'firewall', x: 100, y: 50, sub: '10.0.0.1' },
    { id: 'b', label: 'SW1', kind: 'l3switch', x: 300, y: 150 },
  ],
  links: [{ from: 'a', to: 'b', label: 'VLAN 10' }, { from: 'a', to: 'zz' }],
};

describe('netDiagram', () => {
  it('computes segments with midpoints and drops dangling links', () => {
    const s = linkSegments(d);
    expect(s).toHaveLength(1);
    expect(s[0]).toMatchObject({ mx: 200, my: 100, label: 'VLAN 10' });
  });
  it('describes nodes and links as text', () => {
    const t = describeDiagram(d);
    expect(t.nodes[0]).toBe('FW (cortafuegos): 10.0.0.1');
    expect(t.links).toContain('FW ↔ SW1 (VLAN 10)');
  });
});
