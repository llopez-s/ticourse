import { describe, expect, it } from 'vitest';
import op4s2 from './supuestos/op4s2';
import type { Task } from '../../lib/supuesto';
import type { Block } from '../../lib/types';

// op4s2: recalcula desde el texto del expediente las cifras que el caso da por buenas.

const s = op4s2;

const doc = (id: string) => {
  const d = s.dossier.find((x) => x.id === id);
  if (!d) throw new Error(`falta el documento ${id}`);
  return d;
};

const codeOf = (id: string): string => {
  const b = doc(id).body?.find((x: Block) => x.t === 'code') as { text: string } | undefined;
  if (!b) throw new Error(`sin bloque de código en ${id}`);
  return b.text;
};

const tableOf = (id: string): string[][] => {
  const b = doc(id).body?.find((x: Block) => x.t === 'table') as { rows: string[][] } | undefined;
  if (!b) throw new Error(`sin tabla en ${id}`);
  return b.rows;
};

const allText = (id: string): string =>
  (doc(id).body ?? [])
    .map((b) => JSON.stringify(b))
    .join('\n');

const tasks = s.phases.flatMap((p) => p.tasks);
const task = (id: string): Task => {
  const t = tasks.find((x) => x.id === id);
  if (!t) throw new Error(`falta la tarea ${id}`);
  return t;
};
const numeric = (id: string): number => {
  const t = task(id);
  if (t.kind !== 'numeric') throw new Error(`${id} no es numérica`);
  return t.answer;
};
const phase = (id: string) => s.phases.find((p) => p.id === id)!;

/** «02:13:21» -> segundos desde medianoche. */
const secs = (hms: string): number => {
  const [h, m, x] = hms.split(':').map(Number);
  return h * 3600 + m * 60 + (x ?? 0);
};

describe('op4s2: cálculos del expediente', () => {
  it('estadísticas: 2760 errores de 4600 peticiones = 60 %', () => {
    const rows = tableOf('d-estadisticas');
    const row = (name: string) => {
      const r = rows.find((x) => x[0] === name);
      if (!r) throw new Error(`falta ${name}`);
      return { req: Number(r[1]), ok: Number(r[2]), err: Number(r[3]), ms: parseFloat(r[4]), conns: Number(r[5]) };
    };
    const s1 = row('SEDE1');
    const s2 = row('SEDE2');
    expect(s1.ok + s1.err).toBe(s1.req);
    expect(s2.ok + s2.err).toBe(s2.req);
    expect(s1.err).toBe(0);
    expect(s2.err).toBe(s2.req); // todo lo de SEDE2 es error
    const total = s1.req + s2.req;
    const errPct = (100 * (s1.err + s2.err)) / total;
    expect(total).toBe(4600);
    expect(errPct).toBeCloseTo(60, 9);
    expect(numeric('f3t2')).toBeCloseTo(errPct, 9);
    // f3t3: SEDE2 recibe más de la mitad, contesta antes y tiene menos conexiones
    expect(s2.req / total).toBeGreaterThan(0.5);
    expect(s2.ms).toBeLessThan(s1.ms);
    expect(s2.conns).toBeLessThan(s1.conns);
    // con round robin y pesos iguales, la mitad: 50 % (explicación de f3t2/f3t3)
    expect(codeOf('d-perfil').match(/peso 1/g)?.length).toBe(2);
    // la cifra se repite en el carry de f3 y en el modelo del parte
    expect(phase('f3').carry).toContain(`${errPct} %`);
    const w = task('f5t4');
    if (w.kind !== 'written') throw new Error('f5t4 no es redactada');
    expect(w.model).toContain(`${errPct} %`);
  });

  it('comprobaciones: salir en 3 × 2 s = 6 s y volver en 2 × 2 s = 4 s', () => {
    const cfg = codeOf('d-comprobacion');
    const inter = Number(/intervalo\s+(\d+)\s*s/.exec(cfg)![1]);
    const fall = Number(/bajada\s+(\d+)/.exec(cfg)![1]);
    const rise = Number(/subida\s+(\d+)/.exec(cfg)![1]);
    expect([inter, fall, rise]).toEqual([2, 3, 2]);
    // coinciden con los valores por defecto de HAProxy 3.4 que cita el documento
    const note = allText('d-comprobacion');
    expect(note).toContain('(2000 ms)');
    expect(note).toContain('`fall` (3)');
    expect(note).toContain('`rise` (2)');
    expect(numeric('f3t4')).toBe(fall * inter);
    expect(numeric('f5t2')).toBe(rise * inter);
  });

  it('el registro de ADC1 sigue esos umbrales y ese intervalo', () => {
    const cfg = codeOf('d-comprobacion');
    const inter = Number(/intervalo\s+(\d+)\s*s/.exec(cfg)![1]);
    const fall = Number(/bajada\s+(\d+)/.exec(cfg)![1]);
    const rise = Number(/subida\s+(\d+)/.exec(cfg)![1]);
    const lines = codeOf('d-registro-adc').split('\n');
    const fails = lines.filter((l) => /\/salud -> 500/.test(l)).map((l) => secs(l.slice(0, 8)));
    const oks = lines.filter((l) => /TCP 443 -> establecida/.test(l)).map((l) => secs(l.slice(0, 8)));
    expect(fails.length).toBe(fall);
    expect(oks.length).toBe(rise);
    for (let i = 1; i < fails.length; i++) expect(fails[i] - fails[i - 1]).toBe(inter);
    for (let i = 1; i < oks.length; i++) expect(oks[i] - oks[i - 1]).toBe(inter);
    const down = lines.find((l) => /SEDE2 DOWN/.test(l))!.slice(0, 8);
    const up = lines.find((l) => /SEDE2 UP/.test(l))!.slice(0, 8);
    const change = lines.find((l) => /configuración/.test(l))!.slice(0, 8);
    expect(secs(down)).toBe(fails[fails.length - 1]);
    expect(secs(up)).toBe(oks[oks.length - 1]);
    expect(secs(change)).toBeLessThan(oks[0]);
    expect(oks[0] - secs(change)).toBe(inter);
    // horas repetidas en el carry de f3 y en el registro de cambios
    expect(phase('f3').carry).toContain(down);
    expect(phase('f3').carry).toContain(up);
    expect(phase('f3').carry).toContain('07:58');
    expect(allText('d-cambios')).toContain(`Jueves ${change.slice(0, 5)}`);
    // la prueba del navegador (07:40) es anterior al primer fallo
    expect(doc('d-trazas').title).toContain('07:40');
    expect(secs('07:40:00')).toBeLessThan(fails[0]);
  });

  it('cerebro dividido: de 02:13:21 a 02:17:29 = 248 s, con 8 cambios ARP en esa ventana', () => {
    const haLines = codeOf('d-ha').split('\n');
    const cut = haLines.findIndex((l) => l.trim() === 'ADC2');
    expect(haLines[0].trim()).toBe('ADC1');
    expect(cut).toBeGreaterThan(0);
    const adc1 = haLines.slice(1, cut).join('\n');
    const adc2 = haLines.slice(cut + 1).join('\n');
    const start = /(\d{2}:\d{2}:\d{2})\s+latido perdido.*ADC2 pasa a ACTIVO/.exec(adc2)![1];
    const end = /(\d{2}:\d{2}:\d{2})\s+latido recuperado.*ADC2 pasa a PASIVO/.exec(adc2)![1];
    const firstMiss = /(\d{2}:\d{2}:\d{2})\s+latido: sin respuesta/.exec(adc2)![1];
    const both = secs(end) - secs(start);
    expect(both).toBe(248);
    expect(numeric('f4t2')).toBe(both);
    // el margen de 3 s del protocolo del fabricante cuadra con el registro
    expect(secs(start) - secs(firstMiss)).toBe(3);
    // ADC1 pierde y recupera el latido a las mismas horas y nunca deja de ser activo
    expect(/(\d{2}:\d{2}:\d{2})\s+latido: sin respuesta/.exec(adc1)![1]).toBe(firstMiss);
    expect(/(\d{2}:\d{2}:\d{2})\s+latido perdido.*ADC1 sigue ACTIVO/.exec(adc1)![1]).toBe(start);
    expect(/(\d{2}:\d{2}:\d{2})\s+latido recuperado.*ADC1 ACTIVO/.exec(adc1)![1]).toBe(end);
    expect(adc1).not.toMatch(/ADC1 pasa a PASIVO/);
    expect(doc('d-ha').body!.find((b) => b.t === 'code')).toMatchObject({ title: expect.stringContaining('3 s sin latido') });
    // el fragmento del jefe habla de «cuatro minutos»
    expect(Math.floor(both / 60)).toBe(4);

    // tabla ARP del encaminador
    const inv = JSON.stringify(doc('d-inventario').body);
    const mac1 = /ADC1.*?MAC de la interfaz de datos `([0-9a-f:]+)`/.exec(inv)![1];
    const mac2 = /ADC2.*?MAC de la interfaz de datos `([0-9a-f:]+)`/.exec(inv)![1];
    expect(adc2).toContain(mac2);
    const arp = codeOf('d-arp').split('\n');
    const changes = arp
      .map((l) => /^(\d{2}:\d{2}:\d{2})\s+10\.20\.72\.70\s+(\S+) -> (\S+)$/.exec(l))
      .filter((m): m is RegExpExecArray => m !== null);
    const stated = Number(/total:\s+(\d+) cambios/.exec(codeOf('d-arp'))![1]);
    expect(changes.length).toBe(stated);
    expect(changes.length).toBe(8);
    expect(changes[0][2]).toBe(mac1);
    for (let i = 1; i < changes.length; i++) {
      expect(changes[i][2]).toBe(changes[i - 1][3]); // encadenados
      expect(secs(changes[i][1])).toBeGreaterThan(secs(changes[i - 1][1]));
    }
    expect(changes[0][1]).toBe(start);
    expect(changes[changes.length - 1][1]).toBe(end);
    expect(changes[changes.length - 1][3]).toBe(mac1); // acaba en ADC1

    // carry, explicación y modelo repiten las horas y los segundos
    expect(phase('f4').carry).toContain(start);
    expect(phase('f4').carry).toContain(end);
    const w = task('f5t4');
    if (w.kind !== 'written') throw new Error('f5t4 no es redactada');
    expect(w.model).toContain(`${both} s`);
    // 02:13:18 -> 02:17:29 serían 251 s (la trampa de f4t2)
    expect(task('f4t2').explain).toContain(`${secs(end) - secs(firstMiss)} s`);

    // la ventana cae dentro del trabajo en el bastidor B (02:05 a 02:25)
    const m = /de (\d{2}:\d{2}) a (\d{2}:\d{2})/.exec(allText('d-mantenimiento'))!;
    expect(secs(m[1])).toBeLessThanOrEqual(secs(firstMiss));
    expect(secs(m[2])).toBeGreaterThanOrEqual(secs(end));
    expect(allText('d-mantenimiento')).toContain('puertos 17 a 24');
    expect(inv).toContain('puerto 22');
  });

  it('las quejas caen donde dice la cronología', () => {
    const rows = tableOf('d-quejas');
    const at = (n: string) => rows.find((r) => r[0] === n)![1];
    const time = (n: string) => secs(at(n).split(' ')[1]);
    // cambio del perfil, leído del registro de cambios
    const change = tableOf('d-cambios').find((r) => r[2].includes('perfil-www'))![0];
    expect(change).toMatch(/^Miércoles \d{2}:\d{2}$/);
    for (const q of ['Q1', 'Q2']) {
      expect(at(q)).toMatch(/^Miércoles /);
      expect(time(q)).toBeGreaterThan(secs(change.split(' ')[1]));
    }
    // Q3 dentro de la ventana de los dos activos (registro de ADC2)
    const ha = codeOf('d-ha').split('\n');
    const from = ha.find((l) => /ADC2 pasa a ACTIVO/.test(l))!.slice(0, 8);
    const to = ha.find((l) => /ADC2 pasa a PASIVO/.test(l))!.slice(0, 8);
    expect(time('Q3')).toBeGreaterThanOrEqual(secs(from));
    expect(time('Q3')).toBeLessThanOrEqual(secs(to));
    // Q4 redondea esa ventana a minutos
    expect(rows.find((r) => r[0] === 'Q4')![3]).toContain(`entre las ${from.slice(0, 5)} y las ${to.slice(0, 5)}`);
    // Q5, Q6 y Q8 después de que SEDE2 vuelva al reparto (registro de ADC1)
    const up = codeOf('d-registro-adc').split('\n').find((l) => /SEDE2 UP/.test(l))!.slice(0, 8);
    for (const q of ['Q5', 'Q6', 'Q8']) expect(time(q)).toBeGreaterThan(secs(up));
  });

  it('las cifras de f3t3 salen de la tabla de estadísticas', () => {
    const rows = tableOf('d-estadisticas');
    const [s1, s2] = ['SEDE1', 'SEDE2'].map((n) => rows.find((r) => r[0] === n)!);
    const t = task('f3t3');
    if (t.kind !== 'choice') throw new Error('f3t3 no es de una opción');
    const right = t.options.find((o) => o.id === t.answer)!.text;
    expect(right).toContain(`en ${s2[4]}`);
    expect(right).toContain(`${s2[5]} de media frente a ${s1[5]}`);
    expect(t.explain).toContain(`tarda ${s1[4]} y mantiene ${s1[5]} conexiones`);
    expect(t.explain).toContain(`en ${s2[4]} y apenas tiene ${s2[5]}`);
  });

  it('puntos, rúbrica y longitud del modelo', () => {
    expect(tasks.reduce((n, t) => n + t.points, 0)).toBe(100);
    const w = task('f5t4');
    if (w.kind !== 'written') throw new Error('f5t4 no es redactada');
    expect(w.rubric.reduce((n, r) => n + r.points, 0)).toBe(w.points);
    const words = w.model.split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x)).length;
    expect(words).toBeGreaterThanOrEqual(150);
    expect(words).toBeLessThanOrEqual(w.words!);
  });
});
