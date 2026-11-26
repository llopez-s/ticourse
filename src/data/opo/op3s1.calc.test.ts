import { describe, expect, it } from 'vitest';
import { loadSupuesto } from '../supuestos/index';
import type { Supuesto, Task } from '../../lib/supuesto';
import type { Block } from '../../lib/types';

// op3s1: recalcula desde el texto del expediente las cifras que el caso da por buenas.

/** Todo el texto de un documento del expediente, en bruto. */
const textOf = (s: Supuesto, docId: string): string => {
  const d = s.dossier.find((x) => x.id === docId);
  if (!d) throw new Error(`falta el documento ${docId}`);
  return JSON.stringify(d.body ?? []);
};

const codeOf = (s: Supuesto, docId: string): string => {
  const d = s.dossier.find((x) => x.id === docId);
  const b = d?.body?.find((x: Block) => x.t === 'code') as { text: string } | undefined;
  if (!b) throw new Error(`sin bloque de código en ${docId}`);
  return b.text;
};

const task = (s: Supuesto, id: string): Task => s.phases.flatMap((p) => p.tasks).find((t) => t.id === id)!;

const toInt = (ip: string): number => ip.split('.').reduce((acc, o) => acc * 256 + Number(o), 0);
const toIp = (n: number): string => [24, 16, 8, 0].map((sh) => Math.floor(n / 2 ** sh) % 256).join('.');
const maskOf = (prefix: number): string => toIp(2 ** 32 - 2 ** (32 - prefix));

const load = async () => (await loadSupuesto('op3s1'))!;

describe('op3s1: cálculos del expediente', () => {
  it('380 equipos más las reservas no caben en un /24 y sí en el /23 10.20.50.0', async () => {
    const s = await load();
    const memo = textOf(s, 'd-memo');
    const hosts = Number(/hasta \*\*(\d+)\*\*/.exec(memo)?.[1]);
    const fixed = Number(/\*\*(\d+) primeras direcciones\*\*/.exec(memo)?.[1]);
    expect(hosts).toBe(380);
    expect(fixed).toBe(20);
    const need = hosts + fixed;
    const usable = (prefix: number) => 2 ** (32 - prefix) - 2;
    expect(need).toBeGreaterThan(usable(24));
    expect(need).toBeLessThanOrEqual(usable(23));
    const prefix = [30, 29, 28, 27, 26, 25, 24, 23, 22].find((p) => usable(p) >= need)!;
    expect(prefix).toBe(23);

    const net = /red `(\d+\.\d+\.\d+\.\d+)`/.exec(memo)?.[1];
    expect(net).toBe('10.20.50.0');
    expect(toInt(net!) % 2 ** (32 - prefix)).toBe(0);
    const mask = maskOf(prefix);
    const broadcast = toIp(toInt(net!) + 2 ** (32 - prefix) - 1);
    expect(mask).toBe('255.255.254.0');
    expect(broadcast).toBe('10.20.51.255');

    const f1t1 = task(s, 'f1t1');
    if (f1t1.kind !== 'numeric') throw new Error('tipo inesperado');
    expect(f1t1.answer).toBe(prefix);
    const f1t2 = task(s, 'f1t2');
    if (f1t2.kind !== 'table') throw new Error('tipo inesperado');
    const row = f1t2.rows.find((r) => r.id === 'vlan50')!;
    expect(row.answer.mascara).toBe(mask);
    expect(row.answer.difusion).toBe(broadcast);
  });

  it('el PTR de IMP-ANX (10.20.50.10) es 10.50.20.10.in-addr.arpa', async () => {
    const s = await load();
    const ip = /IMP-ANX\*\*, con la dirección fija `(\d+\.\d+\.\d+\.\d+)`/.exec(textOf(s, 'd-memo'))?.[1];
    expect(ip).toBe('10.20.50.10');
    const ptr = `${ip!.split('.').reverse().join('.')}.in-addr.arpa`;
    expect(ptr).toBe('10.50.20.10.in-addr.arpa');

    const f2t2 = task(s, 'f2t2');
    if (f2t2.kind !== 'choice') throw new Error('tipo inesperado');
    const chosen = f2t2.options.find((o) => o.id === f2t2.answer)!;
    expect(chosen.text.startsWith(`\`${ptr}\``)).toBe(true);
  });

  it('DHCP2 queda en estrato 4: NTP1 2 -> DC1 3 -> DHCP2 4', async () => {
    const s = await load();
    const log = codeOf(s, 'd-registro');
    const ntp1 = Number(/^NTP1\s+servidores públicos de referencia\s+(\d+)/m.exec(log)?.[1]);
    expect(ntp1).toBe(2);
    expect(log).toMatch(/^DC1\s+NTP1 \(10\.20\.72\.41\)/m);
    const dc1 = ntp1 + 1;
    const dhcp2 = dc1 + 1;
    expect(dc1).toBe(3);
    expect(dhcp2).toBe(4);

    const f4t3 = task(s, 'f4t3');
    if (f4t3.kind !== 'numeric') throw new Error('tipo inesperado');
    expect(f4t3.answer).toBe(dhcp2);
  });
});
