import { describe, expect, it } from 'vitest';
import { CLASSIFY_DATA, ORDER_DATA } from '../labs';
import { TRACKS } from '../tracks';
import { OP4_CLASSIFY_DATA as OWN_CLASSIFY, OP4_ORDER_DATA as OWN_ORDER } from './labs-op4';

// Los labs se leen ya cableados, como en op3-labs.test.ts: pista opo y mapas globales.
const OP4_LABS = TRACKS.opo.labs.filter((l) => l.sectionId === 'op4');
const OP4_CLASSIFY_DATA = CLASSIFY_DATA;
const OP4_ORDER_DATA = ORDER_DATA;

const PERSISTENCE = ['cookie', 'ip', 'none'];
const TLS_MODES = ['term', 'recrypt', 'pass'];

/** hh:mm:ss → segundos */
function secs(t: string): number {
  const [h, m, s] = t.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

describe('pista Redes y ENS · laboratorios del bloque 4', () => {
  it('block 4 labs exist and are well formed', () => {
    expect(OP4_LABS.map((l) => l.id)).toEqual(['opl4a', 'opl4b', 'opl4c']);
    expect(new Set(OP4_LABS.map((l) => l.id)).size).toBe(OP4_LABS.length);
    for (const l of OP4_LABS) {
      expect(l.sectionId, l.id).toBe('op4');
      expect(l.brief.length, l.id).toBeGreaterThan(80);
      expect(l.minutes, l.id).toBeGreaterThan(0);
      expect(l.xp, l.id).toBeGreaterThan(0);
    }
    expect(OP4_LABS.find((l) => l.id === 'opl4b')?.kind).toBe('order');
    // Cada mapa de datos tiene exactamente los labs de su tipo.
    expect(Object.keys(OWN_ORDER)).toEqual(OP4_LABS.filter((l) => l.kind === 'order').map((l) => l.id));
    expect(Object.keys(OWN_CLASSIFY)).toEqual(OP4_LABS.filter((l) => l.kind === 'classify').map((l) => l.id));

    for (const id of ['opl4a', 'opl4c']) {
      expect(OP4_LABS.find((l) => l.id === id)?.kind, id).toBe('classify');
      const lab = OP4_CLASSIFY_DATA[id];
      expect(lab, id).toBeDefined();
      expect(lab.passPct, id).toBe(80);
      expect(lab.items, id).toHaveLength(12);
      const cats = new Set(lab.categories.map((c) => c.id));
      expect(cats.size, id).toBe(lab.categories.length);
      for (const item of lab.items) expect(cats.has(item.answer), item.text).toBe(true);
      expect(new Set(lab.items.map((i) => i.answer)).size, id).toBe(lab.categories.length);
      // Reparto equilibrado: el mismo número de elementos por categoría.
      for (const c of lab.categories) {
        expect(lab.items.filter((i) => i.answer === c.id), `${id} ${c.label}`).toHaveLength(12 / lab.categories.length);
      }
      for (const item of lab.items) expect(item.why.length, item.text).toBeGreaterThan(40);
      expect(new Set(lab.items.map((i) => i.text)).size, id).toBe(12);
    }

    const order = OP4_ORDER_DATA.opl4b;
    expect(order.steps).toHaveLength(8);
    for (const s of order.steps) expect(s.detail.length, s.text).toBeGreaterThan(80);
    expect(new Set(order.steps.map((s) => s.text)).size).toBe(8);
  });

  it('opl4a asks capa 4 vs capa 7 and never names the layer in the function', () => {
    const lab = OP4_CLASSIFY_DATA.opl4a;
    expect(lab.categories.map((c) => c.label)).toEqual(['Capa 4 basta', 'Hace falta capa 7']);
    for (const item of lab.items) expect(item.text, item.text).not.toMatch(/\bcapa\b|\bL[47]\b/i);
    // El protocolo PROXY es compatible con capa 4 y se rotula como especificación de un fabricante.
    const proxy = lab.items.find((i) => /protocolo PROXY/.test(i.text))!;
    expect(proxy.answer).toBe('l4');
    expect(proxy.why).toMatch(/No es una RFC/);
    // La pareja de comprobaciones: conexión TCP (capa 4) frente a GET /salud con 200 (capa 7).
    expect(lab.items.find((i) => /conexión TCP en su puerto/.test(i.text))?.answer).toBe('l4');
    expect(lab.items.find((i) => /GET \/salud/.test(i.text))?.answer).toBe('l7');
  });

  it('opl4b follows HAProxy 3.4 defaults: 3 failures to DOWN, 2 successes to UP, every 2000 ms', () => {
    const { prompt, steps } = OP4_ORDER_DATA.opl4b;
    expect(prompt).toMatch(/valores por defecto de HAProxy 3\.4/);
    expect(prompt).toMatch(/inter 2000 ms, fall 3, rise 2 y timeout check sin fijar/);
    expect(prompt).toMatch(/GET \/salud \(por TLS/);
    expect(steps[3].detail).toMatch(/depende del fabricante/);
    expect(prompt).toMatch(/10\.20\.72\.91/);
    expect(prompt).toMatch(/10\.20\.72\.92/);
    expect(prompt).toMatch(/GET \/salud/);

    const texts = steps.map((s) => s.text);
    const down = texts.findIndex((t) => /DOWN/.test(t) && /marca/.test(t));
    const up = texts.findIndex((t) => /UP/.test(t) && /marca/.test(t));
    expect(down).toBeGreaterThan(-1);
    expect(up).toBeGreaterThan(down);
    const fails = texts.map((t, i) => (/comprobación fallida/.test(t) ? i : -1)).filter((i) => i >= 0);
    const oks = texts.map((t, i) => (/comprobación correcta/.test(t) ? i : -1)).filter((i) => i >= 0);
    expect(fails).toEqual([0, 1, 2]);
    expect(down).toBe(fails[2]); // la tercera fallida es la que lo marca DOWN (fall 3)
    expect(oks).toEqual([5, 6]);
    expect(up).toBe(oks[1]); // la segunda correcta es la que lo marca UP (rise 2)

    // Las horas van en el detalle, no en el texto, y cada fase avanza de 2000 en 2000 ms.
    for (const t of texts) expect(t, t).not.toMatch(/\d{2}:\d{2}/);
    const at = (i: number) => secs(steps[i].detail.match(/A las (\d{2}:\d{2}:\d{2})/)![1]);
    expect(at(1) - at(0)).toBe(2);
    expect(at(2) - at(1)).toBe(2);
    expect(at(6) - at(5)).toBe(2);
    expect(at(5)).toBeGreaterThan(at(2));
    // Mientras está caído, las comprobaciones siguen el mismo paso: la primera correcta cae en múltiplo de 2 s.
    expect((at(5) - at(0)) % 2).toBe(0);
  });

  it('opl4c scopes each requirement to one decision: persistence or TLS mode', () => {
    const lab = OP4_CLASSIFY_DATA.opl4c;
    expect(lab.categories.map((c) => c.id)).toEqual([...PERSISTENCE, ...TLS_MODES]);
    for (const item of lab.items) {
      if (item.text.startsWith('Sesión: ')) expect(PERSISTENCE, item.text).toContain(item.answer);
      else if (item.text.startsWith('Cifrado: ')) expect(TLS_MODES, item.text).toContain(item.answer);
      else throw new Error(`sin ámbito: ${item.text}`);
    }
    expect(lab.items.filter((i) => i.text.startsWith('Sesión: '))).toHaveLength(6);
    expect(lab.items.filter((i) => i.text.startsWith('Cifrado: '))).toHaveLength(6);
    // El requisito no nombra la solución.
    for (const item of lab.items) {
      expect(item.text, item.text).not.toMatch(/persistencia|paso directo|re-?cifr|termin/i);
    }
  });
});
