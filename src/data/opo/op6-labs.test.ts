import { describe, expect, it } from 'vitest';
import { CLASSIFY_DATA } from '../labs';
import { TRACKS } from '../tracks';

const opo = TRACKS.opo;

/** Código → nombre literal de la tabla de 73 medidas del anexo II (dossier op6, líneas 191–280). */
const ANNEX_II: Record<string, string> = {
  'org.1': 'Política de seguridad',
  'org.2': 'Normativa de seguridad',
  'org.3': 'Procedimientos de seguridad',
  'org.4': 'Proceso de autorización',
  'op.pl.1': 'Análisis de riesgos',
  'op.exp.6': 'Protección frente a código dañino',
  'op.nub.1': 'Protección de servicios en la nube',
  'op.cont.2': 'Plan de continuidad',
  'mp.per.3': 'Concienciación',
  'mp.info.1': 'Datos personales',
  'mp.info.6': 'Copias de seguridad',
  'mp.s.4': 'Protección frente a denegación de servicio',
};

describe('pista Redes y ENS · laboratorios del bloque 6', () => {
  it('block 6 labs exist and are well formed', () => {
    expect(opo.labs.filter((l) => l.sectionId === 'op6').map((l) => l.id)).toEqual(['opl6a', 'opl6b', 'opl6c']);
    for (const id of ['opl6a', 'opl6b', 'opl6c']) {
      const lab = CLASSIFY_DATA[id];
      expect(lab, id).toBeDefined();
      expect(lab.items, id).toHaveLength(12);
      const cats = new Set(lab.categories.map((c) => c.id));
      for (const item of lab.items) expect(cats.has(item.answer), item.text).toBe(true);
      expect(new Set(lab.items.map((i) => i.answer)).size, id).toBe(lab.categories.length);
      for (const item of lab.items) expect(item.why.length, item.text).toBeGreaterThan(40);
    }
    expect(CLASSIFY_DATA.opl6a.categories.map((c) => c.label)).toEqual(['BÁSICA', 'MEDIA', 'ALTA']);
    expect(opo.labs.find((l) => l.id === 'opl6a')?.mission).toBeDefined();
    for (const id of ['opl6a', 'opl6b', 'opl6c']) expect(opo.labs.find((l) => l.id === id)?.kind, id).toBe('classify');
  });

  it('opl6a answers follow the annex I rule (highest dimension level decides)', () => {
    const rank: Record<string, number> = { BAJO: 1, MEDIO: 2, ALTO: 3 };
    const cat = ['', 'basica', 'media', 'alta'];
    for (const item of CLASSIFY_DATA.opl6a.items) {
      const levels = [...item.text.matchAll(/\[[CITAD]\] (BAJO|MEDIO|ALTO)\b/g)].map((m) => rank[m[1]]);
      expect(levels.length, item.text).toBeGreaterThan(0);
      for (const d of ['[C]', '[I]', '[T]', '[A]', '[D]']) expect(item.text, `${item.text} ${d}`).toContain(d);
      expect(item.answer, item.text).toBe(cat[Math.max(...levels)]);
    }
  });

  it('opl6b explanations cite an article or the ITS', () => {
    for (const item of CLASSIFY_DATA.opl6b.items) expect(item.why, item.text).toMatch(/[Aa]rtículo|ITS/);
  });

  it('opl6c names the measure in the text and opens the explanation with its literal annex II code', () => {
    for (const item of CLASSIFY_DATA.opl6c.items) {
      expect(item.text, item.text).not.toMatch(/\b(org|op|mp)\./);
      const m = item.why.match(/^((org|op|mp)\.[a-z0-9.]*\d) (.+?)\. /);
      expect(m?.[2], item.text).toBe(item.answer);
      expect(m?.[3], item.text).toBe(item.text);
      expect(ANNEX_II[m?.[1] ?? ''], item.text).toBe(item.text);
    }
    expect(CLASSIFY_DATA.opl6c.items.map((i) => i.why.split(' ')[0]).sort()).toEqual(Object.keys(ANNEX_II).sort());
  });
});
