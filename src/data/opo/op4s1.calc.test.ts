import { describe, expect, it } from 'vitest';
import op4s1 from './supuestos/op4s1';
import type { Supuesto, Task } from '../../lib/supuesto';
import type { Block } from '../../lib/types';

// op4s1: recalcula desde el texto del expediente todas las cifras que el caso da
// por buenas (disponibilidades, minutos al año, capacidad, umbrales × intervalos,
// horas del incidente y del parcheo) y comprueba que las respuestas, las
// explicaciones y los textos de arrastre las repiten bien.

const s: Supuesto = op4s1;

const docOf = (id: string) => {
  const d = s.dossier.find((x) => x.id === id);
  if (!d) throw new Error(`falta el documento ${id}`);
  return d;
};

/** Todo el texto de un documento del expediente, en bruto. */
const textOf = (id: string): string => JSON.stringify(docOf(id).body ?? []);

const codeOf = (id: string, index = 0): string => {
  const codes = (docOf(id).body ?? []).filter((b: Block) => b.t === 'code') as { text: string }[];
  if (!codes[index]) throw new Error(`sin bloque de código ${index} en ${id}`);
  return codes[index].text;
};

const rowsOf = (id: string): string[][] => {
  const t = (docOf(id).body ?? []).find((b: Block) => b.t === 'table') as { rows: string[][] } | undefined;
  if (!t) throw new Error(`sin tabla en ${id}`);
  return t.rows;
};

const task = (id: string): Task => {
  const t = s.phases.flatMap((p) => p.tasks).find((x) => x.id === id);
  if (!t) throw new Error(`falta la tarea ${id}`);
  return t;
};
const numeric = (id: string) => {
  const t = task(id);
  if (t.kind !== 'numeric') throw new Error(`${id} no es numérica`);
  return t;
};
const carryOf = (phaseId: string) => s.phases.find((p) => p.id === phaseId)!.carry ?? '';
const optionText = (taskId: string, optionId: string) => {
  const t = task(taskId);
  if (t.kind !== 'choice' && t.kind !== 'multi') throw new Error(`${taskId} sin opciones`);
  return t.options.find((o) => o.id === optionId)!.text;
};

/** Número con coma decimal, como lo escribe el caso. */
const es = (n: number, digits: number) => n.toFixed(digits).replace('.', ',');
/** «99,95 %» -> 0.9995, sin error de coma flotante en la división. */
const pct = (txt: string) => Number((Number(txt.replace(' %', '').replace(',', '.')) / 100).toFixed(10));
const toInt = (ip: string): number => ip.split('.').reduce((acc, o) => acc * 256 + Number(o), 0);
const hm = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const YEAR_MIN = 365 * 24 * 60;

// Disponibilidades supuestas, leídas de la tabla del expediente.
const cifras = rowsOf('d-cifras');
const avail = (label: string) => {
  const r = cifras.find((row) => row[0].startsWith(label));
  if (!r) throw new Error(`sin fila ${label}`);
  return { count: Number(r[1]), a: pct(r[2]) };
};
const linea = avail('Línea del operador');
const encaminador = avail('Encaminador de salida');
const adc = avail('ADC');
const nodo = avail('Nodo de aplicación');
const regdoc = avail('REG-DOC');
const regapp = avail('REG-APP');

const parallel = (a: number, n: number) => 1 - (1 - a) ** n;
const adcPair = parallel(adc.a, adc.count);
const nodePair = parallel(nodo.a, nodo.count);
const interno = adcPair * nodePair * regdoc.a;
const ciudadania = linea.a * encaminador.a * interno;
const actual = regapp.a * regdoc.a;
const minutes = (a: number) => (1 - a) * YEAR_MIN;

describe('op4s1: disponibilidad', () => {
  it('lee las cifras supuestas del expediente', () => {
    expect([linea.a, encaminador.a, adc.a, nodo.a, regdoc.a, regapp.a]).toEqual([0.999, 0.999, 0.9995, 0.995, 0.9995, 0.995]);
    expect([adc.count, nodo.count, regdoc.count, linea.count, encaminador.count]).toEqual([2, 2, 1, 1, 1]);
    expect(s.phases[0].context).toContain('525 600 minutos');
    expect(YEAR_MIN).toBe(525600);
  });

  it('pareja de nodos: 1 − 0,005² = 99,9975 %', () => {
    expect(nodePair).toBeCloseTo(0.999975, 12);
    const t = numeric('f1t1');
    expect(Math.abs(nodePair * 100 - t.answer)).toBeLessThanOrEqual(t.tolerance ?? 0);
    expect(Number((nodePair * 100).toFixed(4))).toBe(t.answer);
    // el error en serie que señala la explicación
    expect(es(nodo.a * nodo.a, 6)).toBe('0,990025');
    expect(t.explain).toContain('0,990025');
    expect(carryOf('f1')).toContain(es(nodePair * 100, 4));
  });

  it('cadena del personal: ADC × nodos × REG-DOC = 99,947 %, unos 276 min al año', () => {
    expect(adcPair).toBeCloseTo(0.99999975, 14);
    const t2 = numeric('f1t2');
    expect(Number((interno * 100).toFixed(3))).toBe(t2.answer);
    expect(Math.abs(interno * 100 - t2.answer)).toBeLessThanOrEqual(t2.tolerance ?? 0);
    expect(t2.explain).toContain('0,99999975');
    expect(t2.explain).toContain(es(interno, 8).slice(0, 10)); // 0,99947476
    // sin REG-DOC, la ilusión que cita la explicación
    expect(t2.explain).toContain(es(adcPair * nodePair * 100, 3));

    const t3 = numeric('f1t3');
    const m = minutes(interno);
    expect(m).toBeCloseTo(276.06, 2);
    expect(Math.round(m)).toBe(t3.answer);
    // partiendo del 99,947 % ya redondeado de f1t2 salen unos 279 min: dentro de la tolerancia
    const fromRounded = (1 - numeric('f1t2').answer / 100) * YEAR_MIN;
    expect(Math.round(fromRounded)).toBe(279);
    expect(Math.abs(fromRounded - t3.answer)).toBeLessThanOrEqual(t3.tolerance ?? 0);
    expect(t3.explain).toContain('279 minutos');
    // y REG-DOC solo (262,8) queda fuera
    expect(Math.abs((1 - regdoc.a) * YEAR_MIN - t3.answer)).toBeGreaterThan(t3.tolerance ?? 0);
    expect(t3.explain).toContain(es(m, 2));
    expect(Math.floor(m / 60)).toBe(4);
    expect(Math.round(m % 60)).toBe(36);
    expect(t3.explain).toContain('4 h 36 min');
    expect(carryOf('f1')).toContain(`${Math.round(m)} minutos`);
  });

  it('el diseño actual da unos 2889 min al año: más de diez veces más', () => {
    expect(actual).toBeCloseTo(0.9945025, 12);
    const m = minutes(actual);
    expect(Math.floor(m)).toBe(2889);
    expect(Math.floor(m / 60)).toBe(48);
    expect(Math.floor(m % 60)).toBe(9);
    expect(m / minutes(interno)).toBeGreaterThan(10);
    const e = numeric('f1t3').explain;
    expect(e).toContain('0,9945025');
    expect(e).toContain('2889 minutos');
    expect(e).toContain('48 h 9 min');
  });

  it('REG-DOC pone 262,8 min; los nodos unos 13,1; los ADC unos 0,13', () => {
    const doc = (1 - regdoc.a) * YEAR_MIN;
    const nodes = (1 - nodePair) * YEAR_MIN;
    const adcs = (1 - adcPair) * YEAR_MIN;
    expect(doc).toBeCloseTo(262.8, 9);
    expect(es(nodes, 1)).toBe('13,1');
    expect(es(adcs, 2)).toBe('0,13');
    const t = task('f1t4');
    expect(t.explain).toContain('262,8');
    expect(t.explain).toContain('13,1');
    expect(t.explain).toContain('0,13');
    expect(optionText('f1t4', 'c')).toContain('262,8');
    expect(carryOf('f1')).toContain('262,8');
    // un tercer nodo no baja de una hora: REG-DOC solo ya pasa de 60 min
    expect(doc).toBeGreaterThan(60);
  });

  it('ciudadanía: × línea × encaminador = 99,748 %, unos 1326 min (22 h 6 min)', () => {
    expect(linea.a * encaminador.a).toBeCloseTo(0.998001, 12);
    const m = minutes(ciudadania);
    expect(es(ciudadania * 100, 3)).toBe('99,748');
    expect(Math.round(m)).toBe(1326);
    expect(`${Math.floor(Math.round(m) / 60)} h ${Math.round(m) % 60} min`).toBe('22 h 6 min');
    const e = task('f1t5').explain;
    expect(e).toContain('0,998001');
    expect(e).toContain('99,748');
    expect(e).toContain('1326 minutos');
    expect(e).toContain('22 h 6 min');
    expect(optionText('f1t5', 'a')).toContain('1326');
    expect(carryOf('f1')).toContain('1326');
  });

  it('el incidente (05:10 a 14:30) son 560 min, más del doble de 276', () => {
    const memo = textOf('d-memo');
    const m = /de las (\d\d:\d\d) a las (\d\d:\d\d)/.exec(memo);
    expect(m).not.toBeNull();
    const caida = hm(m![2]) - hm(m![1]);
    expect(caida).toBe(560);
    expect(`${Math.floor(caida / 60)} h ${caida % 60} min`).toBe('9 h 20 min');
    expect(s.brief).toContain('9 h 20 min');
    const presupuesto = Math.round(minutes(interno));
    expect(caida).toBeGreaterThan(2 * presupuesto);
    const e = task('f1t5').explain;
    expect(e).toContain('560');
    expect(e).toContain(`2 × ${presupuesto} = ${2 * presupuesto}`);
  });
});

describe('op4s1: capacidad de los nodos', () => {
  it('cada nodo aguanta el pico: 260 de 300 sesiones, un 86,7 %', () => {
    const pico = Number(/hasta (\d+) sesiones a la vez/.exec(textOf('d-memo'))?.[1]);
    const cap = Number(/Hasta \*\*(\d+) sesiones simultáneas\*\*/.exec(textOf('d-ficha'))?.[1]);
    expect(pico).toBe(260);
    expect(cap).toBe(300);
    expect(pico).toBeLessThanOrEqual(cap);
    const uso = (pico / cap) * 100;
    const t = numeric('f2t3');
    expect(Math.round(uso)).toBe(t.answer);
    expect(t.explain).toContain(es(uso, 1));
    expect(t.explain).toContain(es(((pico / 2) / cap) * 100, 1));
    expect(t.explain).toContain(`${pico / 2} sesiones`);
    expect(carryOf('f2')).toContain(`${pico} de sus ${cap}`);
  });
});

describe('op4s1: comprobación de salud', () => {
  const cfg = codeOf('d-salud', 1);
  const num = (re: RegExp) => Number(re.exec(cfg)?.[1]);
  const inter = num(/intervalo\s+(\d+) s/);
  const fall = num(/fallos para salir\s+(\d+)/);
  const rise = num(/aciertos para volver\s+(\d+)/);

  it('lee la configuración del Consorcio: 5 s, 3 fallos, 2 aciertos', () => {
    expect([inter, fall, rise]).toEqual([5, 3, 2]);
    expect(cfg).toMatch(/respuesta esperada\s+200/);
  });

  it('sale en fall × inter = 15 s y vuelve en rise × inter = 10 s', () => {
    expect(numeric('f5t2').answer).toBe(fall * inter);
    expect(numeric('f5t3').answer).toBe(rise * inter);
    expect(task('f5t2').explain).toContain(`${fall} × ${inter} = ${fall * inter} s`);
    expect(task('f5t3').explain).toContain(`${rise} × ${inter} = ${rise * inter} s`);
    expect(carryOf('f5')).toContain(`${fall * inter} s`);
    expect(carryOf('f5')).toContain(`${rise * inter} s`);
  });

  it('en el parcheo, REG1 vuelve 10 s después de pasar a ready (rise × inter)', () => {
    const log = codeOf('d-parcheo');
    const ready = /^07:51:(\d\d)\s+REG1\s+maint -> ready/m.exec(log);
    const vuelta = /^07:51:(\d\d)\s+REG1\s+\/salud 200, 200/m.exec(log);
    expect(ready && vuelta).toBeTruthy();
    expect(Number(vuelta![1]) - Number(ready![1])).toBe(rise * inter);
  });

  it('las comparaciones con valores de fabricante del dossier: HAProxy 3.4 y AWS ALB', () => {
    // HAProxy 3.4: inter 2000 ms, fall 3, rise 2; AWS ALB: 30 s, 2 para caer, 5 para volver
    const haproxy = { inter: 2, fall: 3, rise: 2 };
    const alb = { inter: 30, fall: 2, rise: 5 };
    expect(task('f5t2').explain).toContain(`${haproxy.fall * haproxy.inter} s`);
    expect(task('f5t2').explain).toContain(`${alb.fall * alb.inter} s`);
    expect(task('f5t3').explain).toContain(`${haproxy.rise * haproxy.inter} s`);
    expect(task('f5t3').explain).toContain(`${alb.rise * alb.inter} s`);
  });
});

describe('op4s1: parcheo', () => {
  const log = codeOf('d-parcheo');
  const line = (re: RegExp) => {
    const m = re.exec(log);
    if (!m) throw new Error(`sin línea ${re}`);
    return m;
  };

  it('el drenaje de REG1 dura los 30 minutos del procedimiento y deja 2 sesiones', () => {
    expect(textOf('d-parcheo')).toContain('como máximo 30 minutos');
    const ini = line(/^(\d\d:\d\d):\d\d\s+REG1\s+ready -> drain\s+(\d+)/m);
    const fin = line(/^(\d\d:\d\d):\d\d\s+REG1\s+drain -> maint\s+(\d+)/m);
    expect(hm(fin[1]) - hm(ini[1])).toBe(30);
    expect(Number(ini[2])).toBe(14);
    expect(Number(fin[2])).toBe(2);
    expect(optionText('f6t2', 'a')).toContain(`${fin[2]} personas`);
    expect(optionText('f6t2', 'd')).toContain(`${ini[2]} sesiones`);
  });

  it('REG2 pasa a maint sin drenar con 23 sesiones: 2 + 23 = 25 personas', () => {
    const fin1 = Number(line(/^\d\d:\d\d:\d\d\s+REG1\s+drain -> maint\s+(\d+)/m)[1]);
    const reg2 = line(/^\d\d:\d\d:\d\d\s+REG2\s+ready -> maint\s+\d+\s+(\d+)/m);
    const cortadas2 = Number(reg2[1]);
    expect(cortadas2).toBe(23);
    const total = fin1 + cortadas2;
    expect(numeric('f6t3').answer).toBe(total);
    expect(task('f6t3').explain).toContain(`${fin1} + ${cortadas2} = ${total}`);
    expect(optionText('f6t2', 'c')).toContain(`${cortadas2} personas`);
    expect(task('f6t2').explain).toContain(`sus ${cortadas2} sesiones`);
  });

  it('la sesión caduca a los 20 minutos sin actividad, como dice la ficha', () => {
    expect(textOf('d-ficha')).toContain('**20 minutos sin actividad**');
    expect(optionText('f6t2', 'f')).toContain('20 minutos');
  });
});

describe('op4s1: direcciones dentro de lo reservado', () => {
  const inv = textOf('d-inventario');
  it('REG1 y REG2 en 10.20.72.100–119; la VIP nueva en 10.20.72.73–79; todo en el CPD', () => {
    const cpd = { lo: toInt('10.20.72.0'), hi: toInt('10.20.79.255') };
    for (const ip of ['10.20.72.101', '10.20.72.102']) {
      expect(inv).toContain(ip);
      expect(toInt(ip)).toBeGreaterThanOrEqual(toInt('10.20.72.100'));
      expect(toInt(ip)).toBeLessThanOrEqual(toInt('10.20.72.119'));
    }
    const vipRow = rowsOf('d-inventario').find((r) => r[0] === 'VIP nueva')!;
    const vip = /`(\d+\.\d+\.\d+\.\d+)`/.exec(vipRow[1])![1];
    expect(toInt(vip)).toBeGreaterThanOrEqual(toInt('10.20.72.73'));
    expect(toInt(vip)).toBeLessThanOrEqual(toInt('10.20.72.79'));
    expect(s.phases.find((p) => p.id === 'f3')!.context).toContain(vip);
    for (const r of rowsOf('d-inventario').filter((x) => x[0] === 'REG1 y REG2')) {
      expect(r[1]).toContain('10.20.72.101');
      expect(r[1]).toContain('10.20.72.102');
    }
    const all = JSON.stringify(s).match(/10\.20\.\d+\.\d+/g) ?? [];
    for (const ip of all) {
      const n = toInt(ip);
      expect(n >= cpd.lo && n <= cpd.hi, ip).toBe(true);
    }
  });
});
