import { describe, expect, it } from 'vitest';
import op2s1 from './supuestos/op2s1';
import type { Supuesto, Task } from '../../lib/supuesto';
import type { Block } from '../../lib/types';

// op2s1: recalcula desde el texto del expediente todas las cifras que el caso da
// por buenas (capacidad del acceso de la sede y del encaminador, MTU y MSS del
// túnel, desfase del reloj del encaminador, tamaño del conjunto de direcciones)
// y comprueba que las respuestas, las explicaciones y los textos de arrastre las
// repiten bien. Además, que ninguna respuesta aparezca antes de su fase y que
// todas las direcciones del CPD sean del canon.

const s: Supuesto = op2s1;

const docOf = (id: string) => {
  const d = s.dossier.find((x) => x.id === id);
  if (!d) throw new Error(`falta el documento ${id}`);
  return d;
};
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
const phase = (id: string) => s.phases.find((p) => p.id === id)!;
const carryOf = (id: string) => phase(id).carry ?? '';
const optionText = (taskId: string, optionId: string) => {
  const t = task(taskId);
  if (t.kind !== 'choice' && t.kind !== 'multi') throw new Error(`${taskId} sin opciones`);
  return t.options.find((o) => o.id === optionId)!.text;
};
/** «1,5» -> 1.5 */
const num = (txt: string) => Number(txt.replace(',', '.'));
const toInt = (ip: string): number => ip.split('.').reduce((acc, o) => acc * 256 + Number(o), 0);
const cidr = (c: string) => {
  const [ip, len] = c.split('/');
  const size = 2 ** (32 - Number(len));
  const lo = toInt(ip);
  expect(lo % size, `${c} alineada`).toBe(0);
  return { lo, hi: lo + size - 1, size };
};
const hms = (t: string) => {
  const [h, m, x] = t.split(':').map(Number);
  return h * 3600 + m * 60 + x;
};

// --- Datos para dimensionar, leídos del expediente --------------------------
const cifras = rowsOf('d-cifras');
const row = (label: string) => {
  const r = cifras.find((x) => x[0].startsWith(label));
  if (!r) throw new Error(`sin fila ${label}`);
  return r[1];
};
const acceso = Number(/\*\*(\d+) Mbit\/s\*\* simétricos/.exec(row('Acceso a Internet'))![1]);
const punta = /\*\*(\d+) Mbit\/s\*\* de bajada.*\*\*(\d+) Mbit\/s\*\* de subida/.exec(row('Uso del acceso'))!;
const bajadaHoy = Number(punta[1]);
const subidaHoy = Number(punta[2]);
const personas = Number(/\*\*(\d+)\*\*/.exec(row('Personas conectadas'))![1]);
const recibe = /\*\*([\d,]+) Mbit\/s\*\* de las aplicaciones internas y \*\*([\d,]+) Mbit\/s\*\* de Internet/.exec(row('Lo que recibe'))!;
const interna = num(recibe[1]);
const internet = num(recibe[2]);

const ficha = rowsOf('d-ficha');
const capacidad = ficha.find((r) => r[0] === 'Capacidad')![1];
const maxTuneles = Number(/\*\*(\d+) túneles IPsec simultáneos\*\*/.exec(capacidad)![1]);
const maxIpsec = Number(/\*\*(\d+) Mbit\/s\*\* de tráfico IPsec/.exec(capacidad)![1]);
const oficinas = (rowsOf('d-puertos').find((r) => r[0] === 'UDP 500 y UDP 4500')![2].match(/198\.51\.100\.\d+/g) ?? []).length;

describe('op2s1: datos del expediente', () => {
  it('lee el acceso, la hora punta, las personas y los consumos supuestos', () => {
    expect([acceso, bajadaHoy, subidaHoy, personas, interna, internet]).toEqual([300, 120, 60, 90, 0.5, 1.5]);
    expect(textOf('d-memo')).toContain(`hasta ${personas} personas conectadas a la vez`);
    expect(textOf('d-memo')).toContain('**150 personas**');
  });
  it('lee la ficha del encaminador y las tres oficinas con túnel', () => {
    expect([maxTuneles, maxIpsec, oficinas]).toEqual([200, 400, 3]);
  });
  it('los hechos que hacen falsas las opciones de f1 están escritos en el expediente', () => {
    expect(textOf('d-ficha')).toContain('no puede reenviar esos mismos puertos a otro equipo');
    expect(textOf('d-memo')).toContain('siguen terminando en el encaminador central');
    expect(textOf('d-memo')).toContain('no se abre en esa dirección ningún puerto que hoy no esté abierto');
    expect(textOf('d-puertos')).toContain('El **TCP 4500 no está abierto** hoy');
    expect(textOf('d-puertos')).toContain('La entrada de la VPN de administración');
  });
});

describe('op2s1: capacidad con túnel completo', () => {
  const bajada = bajadaHoy + personas * internet;
  const subidaVpn = personas * (interna + internet);
  const subida = subidaHoy + subidaVpn;

  it('bajada = 120 + 90 × 1,5 = 255 Mbit/s (85 %)', () => {
    expect(bajada).toBe(255);
    expect(numeric('f3t2').answer).toBe(bajada);
    const e = task('f3t2').explain;
    expect(e).toContain(`${personas} × 1,5 = ${personas * internet} Mbit/s`);
    expect(e).toContain(`120 + ${personas * internet} = ${bajada} Mbit/s`);
    expect(e).toContain(`un ${Math.round((bajada / acceso) * 100)} %`);
    // la tentación: sumar los 2 Mbit/s de cada persona a la bajada
    expect(bajadaHoy + subidaVpn).toBe(300);
    expect(e).toContain('120 + 180 = 300');
  });

  it('subida = 60 + 90 × 2 = 240 Mbit/s, un 80 %; sin navegación, 105 (35 %)', () => {
    expect(subidaVpn).toBe(180);
    expect(subida).toBe(240);
    expect(Math.round((subida / acceso) * 100)).toBe(numeric('f3t3').answer);
    const e = task('f3t3').explain;
    expect(e).toContain(`${personas} × (0,5 + 1,5) = ${subidaVpn} Mbit/s`);
    expect(e).toContain(`${subida} / ${acceso} = 80 %`);
    expect(e).toContain(`${acceso - subida} Mbit/s de margen en la subida y ${acceso - bajada} en la bajada`);
    const soloInterna = personas * interna;
    expect(e).toContain(`${personas} × 0,5 = ${soloInterna} Mbit/s`);
    expect(e).toContain(`${subidaHoy + soloInterna} Mbit/s, un ${Math.round(((subidaHoy + soloInterna) / acceso) * 100)} %`);
  });

  it('el encaminador cifra 180 de 400 Mbit/s (45 %) y lleva 93 de 200 túneles', () => {
    const t = numeric('f3t5');
    expect(Math.round((subidaVpn / maxIpsec) * 100)).toBe(t.answer);
    expect(t.explain).toContain(`${personas} × 2 = ${subidaVpn} Mbit/s`);
    expect(t.explain).toContain(`${subidaVpn} / ${maxIpsec} = 45 %`);
    expect(t.explain).toContain(`${personas + oficinas} de los ${maxTuneles}`);
  });

  it('el arrastre de f3 repite las cifras', () => {
    const c = carryOf('f3');
    expect(c).toContain(`${bajada} Mbit/s de bajada y a ${subida} de subida`);
    expect(c).toContain(`un ${Math.round((bajada / acceso) * 100)} % y un ${Math.round((subida / acceso) * 100)} % de ${acceso}`);
    expect(c).toContain(`${subidaVpn} Mbit/s de los ${maxIpsec}`);
  });
});

describe('op2s1: MTU y MSS del túnel (método de op2m2)', () => {
  const p3 = task('f4t3').prompt;
  const n = (re: RegExp, txt: string) => Number(re.exec(txt)![1]);
  const mtu = n(/MTU de (\d+) octetos/, p3);
  const ip = n(/cabeceras IPv4 de (\d+) octetos/, p3);
  const udp = n(/UDP de (\d+) octetos/, p3);
  const esp = n(/peor caso \((\d+) octetos\)/, p3);
  const tcp = n(/TCP sin opciones \((\d+) octetos\)/, p3);
  const mss = (m: number, nat = true) => m - ip - (nat ? udp : 0) - esp - ip - tcp;

  it('el enunciado trae todas las cifras y ESP de 37 es el peor caso de la RFC 4106 (8 + 16 + 13)', () => {
    expect([mtu, ip, udp, esp, tcp]).toEqual([1500, 20, 8, 37, 20]);
    expect(8 + 16 + 13).toBe(esp);
  });

  it('línea de 1500 con NAT-T: 1435 de paquete interior y MSS 1395', () => {
    expect(mtu - ip - udp - esp).toBe(1435);
    expect(mss(mtu)).toBe(numeric('f4t3').answer);
    const e = task('f4t3').explain;
    expect(e).toContain('= 1435 de paquete interior');
    expect(e).toContain('1435 − 20 (IPv4 interior) − 20 (TCP, RFC 9293) = 1395');
    expect(e).toContain(String(mss(mtu, false))); // 1403 sin NAT-T
    expect(e).toContain(String(mtu - ip - tcp)); // 1460 sin túnel
  });

  it('línea de 1492 (dato del piloto): 1427 y MSS 1387, el menor de los dos', () => {
    const piloto = rowsOf('d-piloto');
    const mtuB = Number(/MTU de \*\*(\d+)\*\*/.exec(piloto.find((r) => r[0] === 'B')![1])![1]);
    const mtuA = Number(/MTU de \*\*(\d+)\*\*/.exec(piloto.find((r) => r[0] === 'A')![1])![1]);
    expect([mtuA, mtuB]).toEqual([1500, 1492]);
    expect(task('f4t4').prompt).toContain(`MTU de ${mtuB} octetos`);
    const t = numeric('f4t4');
    expect(Math.min(mss(mtuA), mss(mtuB))).toBe(t.answer);
    expect(t.explain).toContain(`${mtuB} − 20 − 8 − 37 = ${mtuB - ip - udp - esp} de paquete interior`);
    expect(t.explain).toContain(`${mtuB - ip - udp - esp} − 20 − 20 = ${mss(mtuB)}`);
    expect(t.explain).toContain(`hasta ${mss(mtuA)}`);
    expect(carryOf('f4')).toContain(`${mss(mtuA)} en una línea de ${mtuA} y ${mss(mtuB)} en una de ${mtuB}`);
  });
});

describe('op2s1: registros y hora', () => {
  const rtr = codeOf('d-log-vpn', 0);
  const rad = codeOf('d-log-vpn', 1);
  const prx = codeOf('d-log-proxy');
  const at = (re: RegExp, txt: string) => {
    const m = re.exec(txt);
    if (!m) throw new Error(`sin línea ${re}`);
    return hms(m[1]);
  };

  it('las dos parejas encaminador/RADIUS dan el mismo desfase: 220 s', () => {
    const pide = at(/^(\d\d:\d\d:\d\d)\s+IKE_AUTH .*RADIUS/m, rtr);
    const recibe = at(/^(\d\d:\d\d:\d\d)\s+Access-Request/m, rad);
    const ok = at(/^(\d\d:\d\d:\d\d)\s+EAP correcto/m, rtr);
    const accept = at(/^(\d\d:\d\d:\d\d)\s+Access-Accept/m, rad);
    expect(recibe - pide).toBe(220);
    expect(accept - ok).toBe(220);
    expect(numeric('f5t1').answer).toBe(220);
    expect(`${Math.floor(220 / 60)} min ${220 % 60} s`).toBe('3 min 40 s');
    expect(task('f5t1').explain).toContain('3 min 40 s: 220 s');
    expect(optionText('f5t2', 'a')).toContain('220 s');
  });

  it('la primera petición del proxy llega 51 s después del Access-Accept, y la dirección es la de la sesión', () => {
    const accept = at(/^(\d\d:\d\d:\d\d)\s+Access-Accept/m, rad);
    const primera = at(/^(\d\d:\d\d:\d\d)\s+10\.20\.64\.37/m, prx);
    expect(primera - accept).toBe(51);
    expect(task('f5t4').explain).toContain('51 s después del Access-Accept');
    expect(rtr).toContain('dirección interna 10.20.64.37');
    expect(rtr).toContain('identidad p0142');
  });
});

describe('op2s1: conjunto de direcciones', () => {
  const pool = cidr('10.20.64.0/24');

  it('está en el tramo libre del plan y no pisa ninguna red del canon', () => {
    const plan = textOf('d-plan');
    expect(plan).toContain('de `10.20.54.0` a `10.20.71.255` no hay nada asignado');
    expect(pool.lo).toBeGreaterThanOrEqual(toInt('10.20.54.0'));
    expect(pool.hi).toBeLessThanOrEqual(toInt('10.20.71.255'));
    const used = ['10.20.8.0/22', '10.20.16.0/21', '10.20.32.0/20', '10.20.40.0/22', '10.20.50.0/23', '10.20.72.0/21', '10.20.99.0/24', '10.20.20.0/24', '10.20.30.0/24', '10.20.12.0/24', '10.20.1.0/24', '10.20.80.0/24', '10.20.255.0/24'];
    for (const u of used) {
      const r = cidr(u);
      expect(pool.hi < r.lo || pool.lo > r.hi, u).toBe(true);
    }
  });

  it('las opciones falsas sí pisan redes en uso', () => {
    const inside = (c: string, net: string) => {
      const a = cidr(c);
      const b = cidr(net);
      return a.lo >= b.lo && a.hi <= b.hi;
    };
    expect(inside('10.20.51.0/24', '10.20.50.0/23')).toBe(true);
    expect(inside('10.20.76.0/24', '10.20.72.0/21')).toBe(true);
    expect(optionText('f4t1', 'a')).toContain('10.20.10.0/24');
  });

  it('254 direcciones útiles: caben las 150 personas autorizadas', () => {
    expect(pool.size - 2).toBe(254);
    expect(pool.size - 2).toBeGreaterThanOrEqual(150);
    expect(task('f4t1').explain).toContain('254 direcciones');
    expect(carryOf('f4')).toContain('10.20.64.0/24');
  });
});

describe('op2s1: forma, puntos y fugas', () => {
  it('suma 100 puntos, con 5 fases', () => {
    const total = s.phases.flatMap((p) => p.tasks).reduce((n, t) => n + t.points, 0);
    expect(total).toBe(100);
    expect(s.phases.length).toBe(5);
  });

  it('la respuesta modelo tiene entre 120 y 180 palabras', () => {
    const t = task('f5t5');
    if (t.kind !== 'written') throw new Error('f5t5 no es redactada');
    const words = t.model.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(120);
    expect(words).toBeLessThanOrEqual(180);
  });

  it('ninguna respuesta de f4 aparece antes de que se entregue f3, ni las de f3 antes de f3', () => {
    const order = new Map(s.phases.map((p, i) => [p.id, i]));
    // documentos visibles mientras se resuelve f4: sin unlockedBy o desbloqueados por f1–f3
    const visibleInF4 = s.dossier.filter((d) => d.unlockedBy === undefined || order.get(d.unlockedBy)! < order.get('f4')!);
    const early = [
      ...visibleInF4.map((d) => JSON.stringify(d)),
      ...['f1', 'f2', 'f3', 'f4'].map((id) => phase(id).context),
      ...['f1', 'f2', 'f3'].map((id) => carryOf(id)),
    ].join('\n');
    for (const leak of ['10.20.64', '1395', '1387', '1435', '1427', 'p0142', '220 s']) expect(early, leak).not.toContain(leak);
    // las cifras de capacidad (f3) no salen antes del arrastre de f3
    const beforeF3 = [
      ...s.dossier.filter((d) => d.unlockedBy === undefined).map((d) => JSON.stringify(d)),
      ...['f1', 'f2', 'f3'].map((id) => phase(id).context),
      ...['f1', 'f2'].map((id) => carryOf(id)),
    ].join('\n');
    for (const leak of ['255 Mbit', '240 de subida', '85 %', '80 %', '45 %', '180 Mbit']) expect(beforeF3, leak).not.toContain(leak);
    // lo que se ve al corregir f1–f3 (enunciados, opciones y explicaciones) no da las respuestas de f4
    const earlyTasks = JSON.stringify(['f1', 'f2', 'f3'].map((id) => phase(id).tasks));
    for (const leak of ['TCP 4500', '9329', '10.20.64', '1395', '1387', 'DC1 y DC2']) expect(earlyTasks, leak).not.toContain(leak);
    // el sitio donde termina el túnel no se da antes de entregar f1
    expect(s.dossier.filter((d) => d.unlockedBy === undefined).map((d) => JSON.stringify(d)).join('')).not.toContain('termina en');
  });

  it('cada 10.20.72.x del caso es una dirección del canon', () => {
    // .0 es la dirección de red del CPD (10.20.72.0/21), que el plan cita
    const canon = new Set(['0', '10', '11', '12', '21', '22', '30', '31', '41', '42', '50', '60', '70', '71', '72', '73', '81', '82', '91', '92']);
    for (let i = 100; i <= 119; i++) canon.add(String(i));
    const found = JSON.stringify(s).match(/10\.20\.72\.\d+/g) ?? [];
    expect(found.length).toBeGreaterThan(0);
    for (const ip of found) expect(canon.has(ip.split('.')[3]), ip).toBe(true);
    // y las direcciones del CPD que el caso cita son las de sus equipos
    const red = textOf('d-red');
    expect(red).toContain('`10.20.72.11` y `10.20.72.12`');
    expect(red).toContain('`10.20.72.50`, puerto 8080');
    expect(red).toContain('`10.20.72.60`');
    expect(red).toContain('`10.20.72.41` y `10.20.72.42`');
  });
});
