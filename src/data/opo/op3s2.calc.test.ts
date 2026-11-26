import { describe, expect, it } from 'vitest';
import { loadSupuesto } from '../supuestos/index';
import type { Supuesto, Task } from '../../lib/supuesto';
import type { Block } from '../../lib/types';

// op3s2: recalcula desde el texto del expediente las cifras que el caso da por buenas.

const codeOf = (s: Supuesto, docId: string): string => {
  const d = s.dossier.find((x) => x.id === docId);
  const b = d?.body?.find((x: Block) => x.t === 'code') as { text: string } | undefined;
  if (!b) throw new Error(`sin bloque de código en ${docId}`);
  return b.text;
};

const task = (s: Supuesto, id: string): Task => s.phases.flatMap((p) => p.tasks).find((t) => t.id === id)!;

/** «09:32:30,000» -> segundos desde medianoche. */
const secs = (hms: string): number => {
  const [h, m, rest] = hms.split(':');
  return Number(h) * 3600 + Number(m) * 60 + Number(rest.replace(',', '.'));
};

const load = async () => {
  // op3s2 se registra en LOADERS aparte; si aún no está, se importa directamente.
  const s = (await loadSupuesto('op3s2')) ?? (await import('./supuestos/op3s2')).default;
  return s;
};

describe('op3s2: cálculos del expediente', () => {
  it('θ = −400 s y δ = 0,008 s con las cuatro marcas de d-ntp', async () => {
    const s = await load();
    const text = codeOf(s, 'd-ntp');
    const mark = (n: number) => {
      const m = new RegExp(`T${n}\\s.*?(\\d{2}:\\d{2}:\\d{2},\\d{3})`).exec(text);
      if (!m) throw new Error(`falta T${n}`);
      return secs(m[1]);
    };
    const [t1, t2, t3, t4] = [mark(1), mark(2), mark(3), mark(4)];
    const theta = ((t2 - t1) + (t3 - t4)) / 2;
    const delta = (t4 - t1) - (t3 - t2);
    expect(theta).toBeCloseTo(-400, 6);
    expect(delta).toBeCloseTo(0.008, 6);

    const f2t2 = task(s, 'f2t2');
    const f2t3 = task(s, 'f2t3');
    if (f2t2.kind !== 'numeric' || f2t3.kind !== 'numeric') throw new Error('tipo inesperado');
    expect(f2t2.answer).toBeCloseTo(theta, 6);
    expect(f2t3.answer).toBeCloseTo(delta * 1000, 6);
  });

  it('cada par cortafuegos -> DC2 de d-eventos difiere +400 s', async () => {
    const s = await load();
    const lines = codeOf(s, 'd-eventos').split('\n');
    const diffs: number[] = [];
    lines.forEach((line, i) => {
      const fw = /^(\d{2}:\d{2}:\d{2})\s+cortafuegos\s+(\S+) -> 10\.20\.72\.12:88/.exec(line);
      if (!fw) return;
      const dc = /^(\d{2}:\d{2}:\d{2})\s+10\.20\.72\.12\s+autenticación de (\S+)/.exec(lines[i + 1] ?? '');
      expect(dc, `línea tras ${line}`).not.toBeNull();
      expect(dc![2]).toBe(fw[2]);
      diffs.push(secs(dc![1]) - secs(fw[1]));
    });
    expect(diffs.length).toBeGreaterThanOrEqual(2);
    for (const d of diffs) expect(d).toBe(400);
  });

  it('T2 = 0,875 × la concesión de d-ambito = 7 horas', async () => {
    const s = await load();
    const m = /opción 51\s.*?(\d+)/.exec(codeOf(s, 'd-ambito'));
    expect(m).not.toBeNull();
    const lease = Number(m![1]);
    expect(lease).toBe(28800);
    const t2h = (0.875 * lease) / 3600;
    expect(t2h).toBe(7);
    const f4t3 = task(s, 'f4t3');
    if (f4t3.kind !== 'numeric') throw new Error('tipo inesperado');
    expect(f4t3.answer).toBe(t2h);
  });
});
