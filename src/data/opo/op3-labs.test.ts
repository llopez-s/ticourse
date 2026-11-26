import { describe, expect, it } from 'vitest';
import { CLASSIFY_DATA, ORDER_DATA } from '../labs';
import { TRACKS } from '../tracks';

const opo = TRACKS.opo;

/** Códigos de tipo de la tabla del dossier op3 §1.3 (RFC 1035 §3.2.2, 3596 §2.1, 2782). */
const RR_CODE: Record<string, number> = { A: 1, NS: 2, CNAME: 5, SOA: 6, PTR: 12, MX: 15, AAAA: 28, SRV: 33 };

const CLIENT = '0.0.0.0';
const BROADCAST = '255.255.255.255';
// SVI de la VLAN 10 (canon de Arcedo). La RFC 1542 no fija la IP de origen del relay:
// que sus tramos salgan con la de la SVI es una convención de este lab.
const RELAY = '10.20.10.1';
const DHCP1 = '10.20.72.21';

interface Leg { src: string; dst: string; port: number; giaddr: string }

function leg(detail: string): Leg {
  const m = detail.match(/^Tramo: (\S+) → (\S+) · UDP destino (\d+) · giaddr (\S+)\. /);
  if (!m) throw new Error(`sin tramo: ${detail}`);
  return { src: m[1], dst: m[2], port: Number(m[3]), giaddr: m[4] };
}

describe('pista Redes y ENS · laboratorios del bloque 3', () => {
  it('block 3 labs exist and are well formed', () => {
    expect(opo.labs.filter((l) => l.sectionId === 'op3').map((l) => l.id)).toEqual(['opl3a', 'opl3b', 'opl3c']);
    expect(opo.labs.find((l) => l.id === 'opl3a')?.kind).toBe('order');
    for (const id of ['opl3b', 'opl3c']) {
      expect(opo.labs.find((l) => l.id === id)?.kind, id).toBe('classify');
      const lab = CLASSIFY_DATA[id];
      expect(lab, id).toBeDefined();
      expect(lab.items, id).toHaveLength(12);
      const cats = new Set(lab.categories.map((c) => c.id));
      for (const item of lab.items) expect(cats.has(item.answer), item.text).toBe(true);
      expect(new Set(lab.items.map((i) => i.answer)).size, id).toBe(lab.categories.length);
      for (const item of lab.items) expect(item.why.length, item.text).toBeGreaterThan(40);
      expect(new Set(lab.items.map((i) => i.text)).size, id).toBe(12);
    }
    const order = ORDER_DATA.opl3a;
    expect(order.steps).toHaveLength(8);
    for (const s of order.steps) expect(s.detail.length, s.text).toBeGreaterThan(80);
    expect(new Set(order.steps.map((s) => s.text)).size).toBe(8);
  });

  it('opl3a follows DORA through the relay, two legs per message', () => {
    const msgs = ORDER_DATA.opl3a.steps.map((s) => s.text.match(/DHCP(DISCOVER|OFFER|REQUEST|ACK)/)?.[1]);
    expect(msgs).toEqual(['DISCOVER', 'DISCOVER', 'OFFER', 'OFFER', 'REQUEST', 'REQUEST', 'ACK', 'ACK']);
  });

  it('opl3a legs obey RFC 2131 §4.1 / RFC 1542 §4.1 (ports, giaddr, destinations; relay source IP is a lab convention)', () => {
    for (const s of ORDER_DATA.opl3a.steps) {
      const l = leg(s.detail);
      if (l.src === CLIENT) {
        // El cliente sin dirección difunde al puerto del servidor y nunca rellena giaddr.
        expect(l, s.text).toEqual({ src: CLIENT, dst: BROADCAST, port: 67, giaddr: CLIENT });
      } else if (l.src === RELAY && l.dst === DHCP1) {
        // El relay pone en giaddr la IP de la interfaz por la que entró la petición (RFC 1542);
        // el origen 10.20.10.1 es convención del lab.
        expect(l, s.text).toEqual({ src: RELAY, dst: DHCP1, port: 67, giaddr: RELAY });
      } else if (l.src === DHCP1) {
        // Con giaddr ≠ 0 el servidor responde al puerto 67 del relay que figura en giaddr.
        expect(l.giaddr, s.text).toBe(RELAY);
        expect(l.dst, s.text).toBe(l.giaddr);
        expect(l.port, s.text).toBe(67);
      } else {
        // El relay entrega al cliente en el puerto 68; el bit B = 1 pide difusión (RFC 1542 §4.1.2).
        // El origen 10.20.10.1 es convención del lab.
        expect(l, s.text).toEqual({ src: RELAY, dst: BROADCAST, port: 68, giaddr: RELAY });
      }
    }
    const legs = ORDER_DATA.opl3a.steps.map((s) => leg(s.detail));
    expect(legs.map((l) => l.src)).toEqual([CLIENT, RELAY, DHCP1, RELAY, CLIENT, RELAY, DHCP1, RELAY]);
    expect(ORDER_DATA.opl3a.prompt).toMatch(/B = 1/);
  });

  it('opl3a offers and acknowledges an address inside the VLAN 10 scope (.100–.250)', () => {
    const steps = ORDER_DATA.opl3a.steps;
    for (const i of [2, 6]) {
      const y = steps[i].detail.match(/yiaddr 10\.20\.10\.(\d+)/);
      expect(y, steps[i].text).not.toBeNull();
      expect(Number(y![1])).toBeGreaterThanOrEqual(100);
      expect(Number(y![1])).toBeLessThanOrEqual(250);
    }
    expect(steps[6].detail).toMatch(/28 800 s/); // concesión de 8 horas del ámbito
  });

  it('opl3b uses the eight record types and opens each explanation with the type and its code', () => {
    const lab = CLASSIFY_DATA.opl3b;
    expect(lab.categories.map((c) => c.label)).toEqual(['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'PTR', 'SRV']);
    for (const item of lab.items) {
      const label = lab.categories.find((c) => c.id === item.answer)!.label;
      expect(item.why.startsWith(`${label} (tipo ${RR_CODE[label]}). `), item.text).toBe(true);
      expect(item.text, item.text).not.toMatch(/\b(A|AAAA|CNAME|MX|NS|SOA|PTR|SRV)\b/);
    }
  });

  it('opl3c covers four services and never names the culprit in the symptom', () => {
    const lab = CLASSIFY_DATA.opl3c;
    expect(lab.categories.map((c) => c.label)).toEqual(['DNS', 'DHCP', 'NTP', 'Proxy web']);
    for (const c of lab.categories) expect(lab.items.filter((i) => i.answer === c.id), c.label).toHaveLength(3);
    for (const item of lab.items) expect(item.text, item.text).not.toMatch(/\b(DNS|DHCP|NTP|proxy)\b/i);
  });
});
