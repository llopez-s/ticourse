import { describe, expect, it } from 'vitest';
import op2s2 from './supuestos/op2s2';
import type { Task } from '../../lib/supuesto';
import type { Block } from '../../lib/types';

// op2s2: recalcula desde el texto del expediente las cifras que el caso da por buenas.

const s = op2s2;

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

const allText = (id: string): string => (doc(id).body ?? []).map((b) => JSON.stringify(b)).join('\n');

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
const written = (id: string) => {
  const t = task(id);
  if (t.kind !== 'written') throw new Error(`${id} no es redactada`);
  return t;
};

/** «09:14:04» -> segundos desde medianoche. */
const secs = (hms: string): number => {
  const [h, m, x] = hms.split(':').map(Number);
  return h * 3600 + m * 60 + (x ?? 0);
};

// Datos de la cuenta de MTU: los del enunciado, cada uno contra su origen.
const IPV4 = 20; // supuesto, como en op2m2
const UDP_NATT = 8; // RFC 3948 §2.1
const ESP_GCM16_WORST = 8 + 16 + 13; // RFC 4106 §7: IV 8 + ICV 16 + 10–13
const TCP = 20; // RFC 9293, sin opciones

describe('op2s2: cálculos del expediente', () => {
  it('MSS que cabe por el túnel con NAT-T: 1500 − 20 − 8 − 37 − 20 − 20 = 1395', () => {
    const mtu = Number(/MTU del acceso hacia Internet: \*\*(\d+)\*\* octetos/.exec(allText('d-proveedor'))![1]);
    expect(mtu).toBe(1500);
    expect(ESP_GCM16_WORST).toBe(37);
    const inner = mtu - IPV4 - UDP_NATT - ESP_GCM16_WORST;
    expect(inner).toBe(1435);
    const mss = inner - IPV4 - TCP;
    expect(numeric('f3t3')).toBe(mss);
    // el enunciado da las cifras que usa la cuenta
    const prompt = task('f3t3').prompt;
    for (const n of [`${mtu} octetos`, `${IPV4} octetos`, `${UDP_NATT} octetos`, `${ESP_GCM16_WORST} octetos`, `${TCP} octetos`]) expect(prompt).toContain(n);
    // la explicación da las trampas con sus cifras
    const ex = task('f3t3').explain;
    expect(ex).toContain(`= ${inner}`);
    expect(ex).toContain(String(mtu - IPV4 - ESP_GCM16_WORST - IPV4 - TCP)); // 1403 sin NAT
    expect(ex).toContain(String(mtu - IPV4 - TCP)); // 1460 sin túnel
    // el carry de f3 y el modelo del parte repiten el MSS
    expect(phase('f3').carry).toContain(`MSS a ${mss}`);
    expect(written('f5t3').model).toContain(`MSS a ${mss}`);
  });

  it('un segmento lleno con el MSS anunciado se pasa 65 octetos', () => {
    const cap = codeOf('d-captura-servidor');
    const announced = [...cap.matchAll(/opción MSS (\d+)/g)].map((m) => Number(m[1]));
    expect(announced.length).toBe(2);
    expect(new Set(announced).size).toBe(1);
    const mss = announced[0];
    const inner = mss + TCP + IPV4;
    // la captura enseña paquetes de esa longitud con esos datos
    expect(cap).toContain(`longitud IP ${inner} (datos ${mss})`);
    const outer = inner + ESP_GCM16_WORST + UDP_NATT + IPV4;
    expect(outer).toBe(1565);
    const over = outer - 1500;
    expect(numeric('f3t4')).toBe(over);
    expect(over).toBe(mss - numeric('f3t3'));
    const ex = task('f3t4').explain;
    expect(ex).toContain(`= ${outer}`);
    expect(ex).toContain(String(over - UDP_NATT)); // 57, sin UDP
    expect(ex).toContain(String(over - IPV4)); // 45, sin IP exterior
    // el paquete pequeño de la captura sí cabe
    const small = Number(/longitud IP (\d+) \(datos 412\)/.exec(cap)![1]);
    expect(small).toBe(412 + TCP + IPV4);
    expect(small + ESP_GCM16_WORST + UDP_NATT + IPV4).toBeLessThanOrEqual(1500);
  });

  it('los descartes del encaminador central y los ICMP denegados cuadran', () => {
    const cnt = codeOf('d-contadores');
    const [central, office] = cnt.split('Encaminador de la oficina');
    const num = (txt: string, re: RegExp) => Number(re.exec(txt)![1]);
    const drops = num(central, /DF activo\s+(\d+)/);
    const icmp = num(central, /hacia el origen de esos paquetes\s+(\d+)/);
    expect(drops).toBe(1284);
    expect(icmp).toBe(drops);
    const denied = num(codeOf('d-cortafuegos'), /10\.20\.72\.10\s+(\d+) veces/);
    expect(denied).toBe(icmp);
    expect(codeOf('d-cortafuegos')).toContain('ICMP tipo 3, código 4');
    // en la oficina también se generan, y sus avisos no pasan por el cortafuegos
    const officeDrops = num(office, /DF activo\s+(\d+)/);
    expect(officeDrops).toBe(37);
    expect(num(office, /hacia el origen de esos paquetes\s+(\d+)/)).toBe(officeDrops);
    for (const n of [drops, officeDrops]) expect(task('f3t2').explain).toContain(String(n));
  });

  it('el retraso de los NAT-keepalive (20 s) es menor que la caducidad del NAT del proveedor', () => {
    const timeout = Number(/caducan a los \*\*(\d+) s\*\*/.exec(allText('d-proveedor'))![1]);
    expect(timeout).toBe(60);
    const opt = task('f1t3');
    if (opt.kind !== 'multi') throw new Error('f1t3 no es múltiple');
    const c = opt.options.find((o) => o.id === 'c')!.text;
    expect(c).toContain('20 s');
    expect(c).toContain(`${timeout} s`);
    expect(20).toBeLessThan(timeout);
  });

  it('aislamiento: de 09:14:04 a 10:48:04 = 94 minutos', () => {
    const down = /(\d{2}:\d{2}:\d{2})\s+mpls0: pérdida de señal/.exec(codeOf('d-registro-oficina'))![1];
    const up = /(\d{2}:\d{2}(?::\d{2})?)\s+tun-respaldo: SA IKE establecida; SA hija establecida/.exec(codeOf('d-negociacion'))![1];
    const min = (secs(up) - secs(down)) / 60;
    expect(min).toBe(94);
    expect(numeric('f4t2')).toBe(min);
    expect(written('f5t3').model).toContain(`${min} minutos`);
    // el aviso del operador cuadra con la hora del corte
    expect(allText('d-aviso')).toContain(`**${down.slice(0, 5)}**`);
    // la ruta por el túnel se instala en el mismo segundo que la SA hija
    expect(codeOf('d-negociacion')).toMatch(new RegExp(`${up}\\s+rutas: 10\\.20\\.0\\.0/16 por tun-respaldo instalada`));
  });

  it('asimetría: del martes 17:06:30 al miércoles 08:56:30 = 950 minutos', () => {
    const r = codeOf('d-rutas');
    const start = /(\d{2}:\d{2}:\d{2})\s+BGP: 10\.20\.9\.0\/24 aprendida del PE/.exec(r)![1];
    const table = /tabla de rutas, miércoles (\d{2}:\d{2}:\d{2})/.exec(r)![1];
    const min = (24 * 3600 - secs(start) + secs(table)) / 60;
    expect(min).toBe(950);
    expect(numeric('f4t3')).toBe(min);
    expect(doc('d-contadores-tunel').title).toContain(`martes ${start}`);
    expect(doc('d-contadores-tunel').title).toContain(`miércoles ${table}`);
    expect(doc('d-rutas').title).toContain(table);
    expect(written('f5t3').model).toContain(`${min} minutos`);
    expect(phase('f4').carry).toContain(start);
    // el operador verifica a las 17:06 y la sesión de la oficina sube justo antes que la ruta de la sede
    const officeUp = /(\d{2}:\d{2}:\d{2})\s+BGP: sesión con el PE del operador establecida/.exec(r)![1];
    expect(secs(officeUp)).toBeLessThan(secs(start));
    expect(allText('d-reparacion')).toContain(`**${start.slice(0, 5)}**`);
    // 17:02 (empalme) daría otra cifra: la trampa que cita la explicación
    expect(task('f4t3').explain).toContain('17:02');
  });

  it('las distancias de la tabla explican qué ruta gana en cada extremo', () => {
    const r = codeOf('d-rutas');
    const tun = Number(/10\.20\.0\.0\/16\s+tun-respaldo\s+estática\s+\[(\d+)\/0\]\s+<- instalada/.exec(r)![1]);
    const ebgp = Number(/PE del operador \(mpls0\)\s+eBGP\s+\[(\d+)\/0\]\s+\(no instalada\)/.exec(r)![1]);
    expect([tun, ebgp]).toEqual([1, 20]);
    expect(tun).toBeLessThan(ebgp); // por eso gana el túnel en la oficina
    const sedeBgp = Number(/aprendida del PE del operador \[(\d+)\/0\]/.exec(r)![1]);
    const sedeTun = Number(/estática por tun-32 \[(\d+)\/0\]/.exec(r)![1]);
    expect(sedeBgp).toBeLessThan(sedeTun); // y gana el MPLS en la sede
    expect(sedeTun).toBe(250);
    // el arreglo propuesto sube la de la oficina por encima de la de eBGP
    const fix = task('f4t4');
    if (fix.kind !== 'choice') throw new Error('f4t4 no es de una opción');
    expect(fix.options.find((o) => o.id === fix.answer)!.text).toContain(`a ${sedeTun}`);
    // contadores por sentido: casi todo sale por el túnel
    const rows = tableOf('d-contadores-tunel');
    const n = (x: string) => Number(x.replace(/\s/g, ''));
    expect(n(rows[0][1])).toBeGreaterThan(1000 * n(rows[1][1]));
  });

  it('las propuestas: la de la oficina no comparte nada con la de la sede y la nueva sí', () => {
    const p = codeOf('d-propuestas');
    const [office, sede] = p.split('Encaminador central');
    for (const a of ['ENCR_3DES', 'PRF_HMAC_SHA1', 'AUTH_HMAC_SHA1_96', 'grupo DH 2']) {
      expect(office).toContain(a);
      expect(codeOf('d-ike-sede')).toContain(a);
    }
    expect(sede).not.toMatch(/3DES|SHA1|grupos? DH 2\b/);
    expect(sede).toContain('grupos DH 19 y 14');
    // lo negociado a las 10:48 está en el perfil de la sede
    const neg = codeOf('d-negociacion');
    for (const a of ['ENCR_AES_GCM_16', 'PRF_HMAC_SHA2_256']) {
      expect(neg).toContain(a);
      expect(sede).toContain(a);
    }
    expect(neg).toContain('grupo 19');
    // la tabla de f2t2 coincide con la configuración en la columna de la sede
    const t = task('f2t2');
    if (t.kind !== 'table') throw new Error('f2t2 no es tabla');
    for (const row of t.rows) {
      const name = row.label.split(' ')[0];
      if (name === 'Grupo') {
        const g = /Grupo DH (\d+)/.exec(row.label)![1];
        const accepted = /grupos DH 19 y 14/.test(sede) && (g === '19' || g === '14');
        expect(row.answer.sede, row.id).toBe(accepted ? 'Lo acepta' : 'Lo rechaza');
      } else {
        expect(row.answer.sede, row.id).toBe(sede.includes(name) ? 'Lo acepta' : 'Lo rechaza');
      }
    }
  });

  it('el puerto que cambió el NAT aparece en el registro de la sede y en la tarea', () => {
    const port = /petición IKE_SA_INIT de 198\.51\.100\.32:(\d+)/.exec(codeOf('d-ike-sede'))![1];
    expect(port).not.toBe('500');
    expect(codeOf('d-registro-oficina-2')).toContain('192.168.1.2:500');
    const t = task('f3t1');
    if (t.kind !== 'multi') throw new Error('f3t1 no es múltiple');
    expect(t.options.find((o) => o.id === 'c')!.text).toContain(port);
  });

  it('reintentos cada 30 s y horas que repiten carry, contexto y registros', () => {
    const cadence = (text: string, re: RegExp) => {
      const t = [...text.matchAll(re)].map((m) => secs(m[1]));
      expect(t.length).toBeGreaterThanOrEqual(3);
      for (const x of t) expect((x - t[0]) % 30).toBe(0);
      for (let i = 1; i < t.length; i++) expect(t[i]).toBeGreaterThan(t[i - 1]);
      return t;
    };
    expect(codeOf('d-registro-oficina')).toContain('cada 30 s');
    const r1 = cadence(codeOf('d-registro-oficina'), /^(\d{2}:\d{2}:\d{2})\s+tun-respaldo: arranque del túnel/gm);
    expect(r1[r1.length - 1]).toBe(secs('09:40:05'));
    const r2 = cadence(codeOf('d-registro-oficina-2'), /^(\d{2}:\d{2}:\d{2})\s+tun-respaldo: respuesta de 203\.0\.113\.10/gm);
    expect(r2[0]).toBe(secs('10:05:31'));
    expect(r2[r2.length - 1]).toBe(secs('10:48:01'));
    // la última respuesta rechazada cae antes del cambio de perfil de las 10:48:02
    const change = /(\d{2}:\d{2}:\d{2})\s+configuración: tun-respaldo pasa al perfil/.exec(codeOf('d-negociacion'))![1];
    expect(secs(change) - r2[r2.length - 1]).toBeLessThan(30);
    // el primer intento con 192.168.1.2 llega a la sede en el mismo segundo
    expect(codeOf('d-ike-sede')).toMatch(/^10:05:31\s+IKE\s+petición IKE_SA_INIT/m);
    // las horas del carry y del contexto salen de la incidencia y de la captura
    const ticket = allText('d-ticket');
    for (const h of ['10:05', '10:20']) {
      expect(ticket).toContain(`**${h}**`);
      expect(phase('f1').carry).toContain(h);
    }
    expect(phase('f2').context).toContain('10:05');
    expect(phase('f2').context).toContain('10:20');
    expect(phase('f2').carry).toContain(change.slice(0, 5));
    expect(phase('f3').context).toContain(change.slice(0, 5));
    // la queja de las 11:05 y la captura de las 11:12 son posteriores a la SA hija y anteriores a la corrección (11:50)
    expect(doc('d-quejas').title).toContain('11:05');
    expect(phase('f3').carry).toContain('11:50');
    expect(secs('11:12:03')).toBeLessThan(secs('11:50:00'));
  });

  it('puntos, rúbrica y longitud del modelo', () => {
    expect(tasks.reduce((n, t) => n + t.points, 0)).toBe(100);
    const w = written('f5t3');
    expect(w.rubric.reduce((n, r) => n + r.points, 0)).toBe(w.points);
    const words = w.model.split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x)).length;
    expect(words).toBeGreaterThanOrEqual(150);
    expect(words).toBeLessThanOrEqual(w.words!);
  });
});
