import { describe, expect, it } from 'vitest';
import { CLASSIFY_DATA, ORDER_DATA } from '../labs';
import { TRACKS } from '../tracks';
import { OP2_CLASSIFY_DATA as OWN_CLASSIFY, OP2_ORDER_DATA as OWN_ORDER } from './labs-op2';

// Los labs se leen ya cableados, como en op4-labs.test.ts: pista opo y mapas globales.
const OP2_LABS = TRACKS.opo.labs.filter((l) => l.sectionId === 'op2');
const OP2_CLASSIFY_DATA = CLASSIFY_DATA;
const OP2_ORDER_DATA = ORDER_DATA;

describe('pista Redes y ENS · laboratorios del bloque 2', () => {
  it('block 2 labs exist and are well formed', () => {
    expect(OP2_LABS.map((l) => l.id)).toEqual(['opl2a', 'opl2b', 'opl2c']);
    for (const l of OP2_LABS) {
      expect(l.sectionId, l.id).toBe('op2');
      expect(l.brief.length, l.id).toBeGreaterThan(80);
      expect(l.minutes, l.id).toBeGreaterThan(0);
      expect(l.xp, l.id).toBeGreaterThan(0);
    }
    expect(OP2_LABS.find((l) => l.id === 'opl2a')?.kind).toBe('order');
    expect(Object.keys(OWN_ORDER)).toEqual(OP2_LABS.filter((l) => l.kind === 'order').map((l) => l.id));
    expect(Object.keys(OWN_CLASSIFY)).toEqual(OP2_LABS.filter((l) => l.kind === 'classify').map((l) => l.id));

    for (const id of ['opl2b', 'opl2c']) {
      expect(OP2_LABS.find((l) => l.id === id)?.kind, id).toBe('classify');
      const lab = OP2_CLASSIFY_DATA[id];
      expect(lab, id).toBeDefined();
      expect(lab.passPct, id).toBe(80);
      expect(lab.items, id).toHaveLength(12);
      const cats = new Set(lab.categories.map((c) => c.id));
      expect(cats.size, id).toBe(lab.categories.length);
      for (const item of lab.items) expect(cats.has(item.answer), item.text).toBe(true);
      expect(new Set(lab.items.map((i) => i.answer)).size, id).toBe(lab.categories.length);
      for (const c of lab.categories) {
        expect(lab.items.filter((i) => i.answer === c.id), `${id} ${c.label}`).toHaveLength(12 / lab.categories.length);
      }
      for (const item of lab.items) expect(item.why.length, item.text).toBeGreaterThan(40);
      expect(new Set(lab.items.map((i) => i.text)).size, id).toBe(12);
    }

    const order = OP2_ORDER_DATA.opl2a;
    expect(order.steps).toHaveLength(8);
    for (const s of order.steps) expect(s.detail.length, s.text).toBeGreaterThan(80);
    expect(new Set(order.steps.map((s) => s.text)).size).toBe(8);
  });

  it('opl2a brings IKEv2 up behind a NAT: UDP 500, then 4500, then the 0xFF keepalive', () => {
    const { prompt, steps } = OP2_ORDER_DATA.opl2a;
    expect(prompt).toMatch(/203\.0\.113\.10/);
    expect(prompt).toMatch(/198\.51\.100\.31/);
    expect(prompt).toMatch(/10\.20\.8\.0\/24/);
    expect(prompt).toMatch(/Supuesto/);

    const texts = steps.map((s) => s.text);
    const idx = (re: RegExp) => texts.findIndex((t) => re.test(t));
    const on500 = texts.map((t, i) => (/UDP 500\b/.test(t) ? i : -1)).filter((i) => i >= 0);
    const on4500 = texts.map((t, i) => (/(UDP|puerto) 4500/.test(t) ? i : -1)).filter((i) => i >= 0);
    expect(on500).toEqual([0]);
    expect(on4500.length).toBeGreaterThanOrEqual(3);
    expect(Math.min(...on4500)).toBeGreaterThan(Math.max(...on500));

    // IKE_SA_INIT (petición, respuesta) → NAT detectado → IKE_AUTH (petición, respuesta) → SA hija → ESP → keepalive
    expect(idx(/petición IKE_SA_INIT/)).toBe(0);
    expect(idx(/contesta IKE_SA_INIT/)).toBe(1);
    expect(idx(/detrás de un NAT/)).toBe(2);
    expect(idx(/petición IKE_AUTH/)).toBe(3);
    expect(idx(/responde IKE_AUTH/)).toBe(4);
    expect(idx(/SA hija/)).toBe(5);
    expect(idx(/ESP dentro de UDP 4500/)).toBe(6);
    expect(idx(/0xFF/)).toBe(7);

    expect(steps[0].detail).toMatch(/NAT_DETECTION_SOURCE_IP/);
    expect(steps[0].detail).toMatch(/NAT_DETECTION_DESTINATION_IP/);
    expect(texts[3]).toMatch(/cuatro octetos a cero/);
    expect(steps[5].detail).toMatch(/sin CREATE_CHILD_SA/);
    expect(steps[7].detail).toMatch(/RFC 3948/);
    expect(steps[7].detail).toMatch(/20 s/);
    expect(steps[7].detail).toMatch(/MUST NOT/);

    // Ningún texto delata su posición.
    for (const t of texts) expect(t, t).not.toMatch(/\b(primer[oa]?|segund[oa]|últim[oa]|luego|después|antes|finalmente)\b/i);
  });

  it('opl2b asks for the technology without naming it in the requirement', () => {
    const lab = OP2_CLASSIFY_DATA.opl2b;
    expect(lab.categories.map((c) => c.label)).toEqual([
      'VPN MPLS de capa 3',
      'Túnel IPsec por Internet',
      'VPN de capa 2 (VPLS/EVPN)',
      'Fibra oscura con DWDM',
    ]);
    for (const item of lab.items) {
      expect(item.text, item.text).not.toMatch(/MPLS|IPsec|VPLS|EVPN|DWDM|fibra oscura|\bcapa [23]\b|\bVPN\b/i);
    }
    // El Consorcio no tiene VPN de capa 2 ni CPD de respaldo: se rotulan como otra red o supuesto.
    expect(lab.items.some((i) => i.answer === 'l2vpn' && /otra red/.test(i.why))).toBe(true);
    expect(lab.items.some((i) => i.answer === 'dwdm' && /Supuesto/.test(i.why))).toBe(true);
  });

  it('opl2c keeps the NIST nuance on split tunnelling and the ENS only as op6 states it', () => {
    const lab = OP2_CLASSIFY_DATA.opl2c;
    expect(lab.categories.map((c) => c.id)).toEqual(['full', 'split', 'ztna', 'rdgw']);
    for (const item of lab.items) {
      expect(item.text, item.text).not.toMatch(/túnel (completo|dividido)|ZTNA|confianza cero|pasarela|gateway/i);
    }
    const brief = OP2_LABS.find((l) => l.id === 'opl2c')!.brief;
    expect(brief).toMatch(/SP 800-77r1/);
    expect(brief).toMatch(/SP 800-46r2/);
    expect(brief).toMatch(/SP 800-207/);
    expect(brief).toMatch(/op\.acc\.6 R8 y R9/);
    // Cada respuesta de túnel dividido recuerda que NIST lo desaconseja o cita la SP 800-207.
    for (const item of lab.items.filter((i) => i.answer === 'split')) {
      expect(item.why, item.text).toMatch(/desaconsej|800-207/);
    }
    // ZTNA no es término de la SP 800-207: se atribuye a Gartner/Mplify.
    const ztnaWhys = lab.items.filter((i) => i.answer === 'ztna').map((i) => i.why).join(' ');
    expect(ztnaWhys).toMatch(/no usa la palabra ZTNA/);
    expect(ztnaWhys).toMatch(/Mplify 117\.1/);
    // El dato de RD Gateway va rotulado como valor del fabricante.
    expect(lab.items.find((i) => /3389/.test(i.text))?.why).toMatch(/valor del fabricante/);
  });
});
