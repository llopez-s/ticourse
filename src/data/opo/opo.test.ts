import { describe, expect, it } from 'vitest';
import { ALL_MODULES, contentSections, sampleExam, trackOf } from '../course';
import { CLASSIFY_DATA, ORDER_DATA } from '../labs';
import { TRACKS, TRACK_IDS } from '../tracks';

const opo = TRACKS.opo;
const others = [TRACKS.gcti, TRACKS.secplus];

describe('pista Redes y ENS', () => {
  it('is registered as a third track with its own disclaimer', () => {
    expect(TRACK_IDS).toEqual(['gcti', 'secplus', 'opo']);
    expect(opo.disclaimer).toMatch(/no oficial/i);
    expect(opo.disclaimer).toMatch(/No afiliado/);
    expect(opo.icon).not.toBe('◆');
    expect(Object.values(opo.domainWeights).reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });

  it('keeps its ids in its own families, apart from GCTI and Security+', () => {
    for (const s of opo.sections) expect(s.id).toMatch(/^op\d+$/);
    for (const m of opo.modules) {
      expect(m.id).toMatch(/^op\d+m\d+$/);
      m.quiz.forEach((q, i) => expect(q.id).toBe(`${m.id}q${i + 1}`));
    }
    for (const c of opo.flashcards) expect(c.id).toMatch(/^fco\d{3}$/);
    for (const l of opo.labs) expect(l.id).toMatch(/^opl\d[a-z]$/);

    const taken = new Set(
      others.flatMap((t) => [
        ...t.sections.map((s) => s.id),
        ...t.modules.flatMap((m) => [m.id, ...m.quiz.map((q) => q.id)]),
        ...t.flashcards.map((c) => c.id),
        ...t.labs.map((l) => l.id),
      ]),
    );
    const mine = [
      ...opo.sections.map((s) => s.id),
      ...opo.modules.flatMap((m) => [m.id, ...m.quiz.map((q) => q.id)]),
      ...opo.flashcards.map((c) => c.id),
      ...opo.labs.map((l) => l.id),
    ];
    expect(new Set(mine).size).toBe(mine.length);
    for (const id of mine) expect(taken.has(id), id).toBe(false);
  });

  it('does not leak into the other tracks', () => {
    const domains = new Set<string>(opo.domains);
    for (const t of others) {
      for (const m of t.modules) {
        expect(m.sectionId.startsWith('op'), m.id).toBe(false);
        for (const q of m.quiz) expect(domains.has(q.domain), q.id).toBe(false);
      }
      for (const g of t.glossary) expect(g.ca, g.term).toBeUndefined();
    }
    for (const s of opo.sections) expect(trackOf(s.id)).toBe('opo');
  });

  it('block 1 (redes) is complete', () => {
    const mods = ALL_MODULES.filter((m) => m.sectionId === 'op1');
    expect(mods.map((m) => m.id)).toEqual(['op1m1', 'op1m2', 'op1m3', 'op1m4', 'op1m5']);
    for (const m of mods) {
      expect(m.objectives.length, m.id).toBeGreaterThanOrEqual(4);
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(4);
      expect(m.blocks.filter((b) => b.t === 'table').length, m.id).toBeGreaterThanOrEqual(2);
      expect(m.quiz.length, m.id).toBe(8);
      for (const q of m.quiz) expect(q.domain, q.id).toBe('Redes de comunicaciones');
      // the correct answer must not sit in the same position every time
      expect(new Set(m.quiz.map((q) => q.answer)).size, m.id).toBeGreaterThanOrEqual(3);
    }
    expect(opo.flashcards.filter((c) => c.sectionId === 'op1').length).toBeGreaterThanOrEqual(30);
    expect(opo.glossary.filter((g) => g.sectionId === 'op1').length).toBeGreaterThanOrEqual(40);
    expect(opo.labs.filter((l) => l.sectionId === 'op1').map((l) => l.id)).toEqual(['opl1a', 'opl1b']);
  });

  it('every content section can run a boss and a mock exam', () => {
    for (const sec of contentSections('opo')) {
      const qs = ALL_MODULES.filter((m) => m.sectionId === sec.id).flatMap((m) => m.quiz);
      expect(qs.length, sec.id).toBeGreaterThanOrEqual(12);
    }
    const exam = sampleExam('opo', opo.exam.sprint.n, 'seed');
    expect(exam).toHaveLength(opo.exam.sprint.n);
    expect(new Set(exam.map((q) => q.id)).size).toBe(exam.length);
  });

  it('labs carry a guide, and the subnet lab is arithmetically sound', () => {
    for (const l of opo.labs) {
      expect(l.objectives?.length, l.id).toBeGreaterThan(0);
      expect(l.prerequisites?.every((p) => opo.modules.some((m) => m.id === p)), l.id).toBe(true);
    }
    expect(ORDER_DATA.opl1b.steps).toHaveLength(8);

    // Each category label names its subnet (a.b.c.d/nn) and each item its host
    // address: recompute where every address belongs instead of trusting the data.
    const toInt = (ip: string) => ip.split('.').reduce((acc, o) => acc * 256 + Number(o), 0);
    const cidr = /(\d+\.\d+\.\d+\.\d+)\/(\d+)/;
    const ipv4 = /\d+\.\d+\.\d+\.\d+/;
    const lab = CLASSIFY_DATA.opl1a;
    const nets = lab.categories.map((c) => {
      const m = cidr.exec(c.label);
      expect(m, c.label).not.toBeNull();
      const size = 2 ** (32 - Number(m![2]));
      const base = toInt(m![1]);
      expect(base % size, c.label).toBe(0);
      return { id: c.id, base, last: base + size - 1 };
    });
    for (const a of nets) {
      for (const b of nets) {
        if (a.id !== b.id) expect(a.last < b.base || b.last < a.base, `${a.id}/${b.id}`).toBe(true);
      }
    }
    expect(lab.items).toHaveLength(12);
    for (const item of lab.items) {
      const m = ipv4.exec(item.text);
      expect(m, item.text).not.toBeNull();
      const ip = toInt(m![0]);
      const home = nets.filter((n) => ip > n.base && ip < n.last);
      expect(home.map((n) => n.id), item.text).toEqual([item.answer]);
    }
  });

  // Only terms confirmed in a source (TERMCAT, or the Catalan Wikipedia) carry `ca`;
  // an acronym with no settled Catalan form goes without rather than with a guess.
  it('glossary gives the Catalan term where one is confirmed, never an empty one', () => {
    const withCa = opo.glossary.filter((g) => g.ca !== undefined);
    expect(withCa.length).toBeGreaterThanOrEqual(40);
    for (const g of withCa) expect(g.ca!.trim().length, g.term).toBeGreaterThan(0);
  });
});
