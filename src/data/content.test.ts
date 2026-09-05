import { describe, expect, it } from 'vitest';
import { ALL_MODULES, ALL_PLACEMENT, ALL_QUESTIONS, sectionById } from './course';
import { CLASSIFY_DATA, LABS, ORDER_DATA, SELECT_DATA } from './labs';
import { TRACKS } from './tracks';
import { PLACEMENT_BLOCK_N } from '../lib/placement';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

describe('content integrity', () => {
  it('questions have 4 choices, a valid answer and an explanation', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThan(4);
      expect(q.explain.length, q.id).toBeGreaterThan(20);
    }
  });

  it('inline checks have 4 choices and a valid answer', () => {
    for (const m of ALL_MODULES) {
      for (const b of m.blocks) {
        if (b.t !== 'check') continue;
        expect(b.q.choices, m.id).toHaveLength(4);
        expect(b.q.answer, m.id).toBeGreaterThanOrEqual(0);
        expect(b.q.answer, m.id).toBeLessThan(4);
      }
    }
  });

  it('modules, cards, glossary and labs point at existing sections', () => {
    for (const m of ALL_MODULES) {
      expect(sectionById(m.sectionId), m.id).toBeDefined();
    }
    for (const t of Object.values(TRACKS)) {
      for (const c of t.flashcards) {
        expect(sectionById(c.sectionId), c.id).toBeDefined();
      }
      for (const g of t.glossary) {
        expect(sectionById(g.sectionId), g.term).toBeDefined();
      }
      for (const l of t.labs) {
        expect(sectionById(l.sectionId), l.id).toBeDefined();
      }
    }
  });

  it('lab data exists for every classify/order/select lab', () => {
    for (const l of LABS) {
      if (l.kind === 'classify') expect(CLASSIFY_DATA[l.id], l.id).toBeDefined();
      if (l.kind === 'order') expect(ORDER_DATA[l.id], l.id).toBeDefined();
      if (l.kind === 'select') expect(SELECT_DATA[l.id], l.id).toBeDefined();
    }
  });

  it('classify items only use declared categories', () => {
    for (const [id, d] of Object.entries(CLASSIFY_DATA)) {
      const cats = new Set(d.categories.map((c) => c.id));
      for (const item of d.items) expect(cats.has(item.answer), `${id}: ${item.text}`).toBe(true);
    }
  });

  it('Security+ Domain 1 is complete', () => {
    const d1 = ALL_MODULES.filter((m) => m.sectionId === 'sp1');
    expect(d1.map((m) => m.id)).toEqual([
      'sp1m1', 'sp1m2', 'sp1m3', 'sp1m4', 'sp1m5', 'sp1m6', 'sp1m7',
    ]);
    const qs = d1.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(40);
    for (const q of qs) expect(q.domain).toBe('General Security Concepts');
    for (const m of d1) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(6);
    }
    expect(TRACKS.secplus.flashcards.length).toBeGreaterThanOrEqual(25);
    expect(TRACKS.secplus.glossary.length).toBeGreaterThanOrEqual(40);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp1').map((l) => l.id)).toEqual(['spl1a', 'spl1b', 'spl1c']);
  });

  it('Security+ Domain 2 is complete', () => {
    const d2 = ALL_MODULES.filter((m) => m.sectionId === 'sp2');
    expect(d2.map((m) => m.id)).toEqual([
      'sp2m1', 'sp2m2', 'sp2m3', 'sp2m4', 'sp2m5', 'sp2m6', 'sp2m7', 'sp2m8',
    ]);
    const qs = d2.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(56);
    for (const q of qs) expect(q.domain).toBe('Threats, Vulnerabilities & Mitigations');
    for (const m of d2) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(7);
    }
    expect(TRACKS.secplus.flashcards.filter((c) => c.sectionId === 'sp2').length).toBeGreaterThanOrEqual(28);
    expect(TRACKS.secplus.glossary.filter((g) => g.sectionId === 'sp2').length).toBeGreaterThanOrEqual(44);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp2').map((l) => l.id)).toEqual(['spl2a', 'spl2b', 'spl2c']);
  });

  it('Security+ Domain 3 is complete', () => {
    const d3 = ALL_MODULES.filter((m) => m.sectionId === 'sp3');
    expect(d3.map((m) => m.id)).toEqual([
      'sp3m1', 'sp3m2', 'sp3m3', 'sp3m4', 'sp3m5', 'sp3m6', 'sp3m7',
    ]);
    const qs = d3.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(53);
    for (const q of qs) expect(q.domain).toBe('Security Architecture');
    for (const m of d3) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(7);
    }
    expect(TRACKS.secplus.flashcards.filter((c) => c.sectionId === 'sp3').length).toBeGreaterThanOrEqual(30);
    expect(TRACKS.secplus.glossary.filter((g) => g.sectionId === 'sp3').length).toBeGreaterThanOrEqual(46);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp3').map((l) => l.id)).toEqual(['spl3a', 'spl3b', 'spl3c']);
  });

  it('Security+ Domain 4 is complete', () => {
    const d4 = ALL_MODULES.filter((m) => m.sectionId === 'sp4');
    expect(d4.map((m) => m.id)).toEqual([
      'sp4m1', 'sp4m2', 'sp4m3', 'sp4m4', 'sp4m5', 'sp4m6',
      'sp4m7', 'sp4m8', 'sp4m9', 'sp4m10', 'sp4m11',
    ]);
    const qs = d4.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(82);
    for (const q of qs) expect(q.domain).toBe('Security Operations');
    for (const m of d4) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(7);
    }
    expect(TRACKS.secplus.flashcards.filter((c) => c.sectionId === 'sp4').length).toBeGreaterThanOrEqual(36);
    expect(TRACKS.secplus.glossary.filter((g) => g.sectionId === 'sp4').length).toBeGreaterThanOrEqual(55);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp4').map((l) => l.id)).toEqual(['spl4a', 'spl4b', 'spl4c']);
  });

  it('Security+ Domain 5 is complete', () => {
    const d5 = ALL_MODULES.filter((m) => m.sectionId === 'sp5');
    expect(d5.map((m) => m.id)).toEqual([
      'sp5m1', 'sp5m2', 'sp5m3', 'sp5m4', 'sp5m5', 'sp5m6', 'sp5m7', 'sp5m8',
    ]);
    const qs = d5.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(59);
    for (const q of qs) {
      expect(q.domain).toBe('Security Program Management & Oversight');
    }
    for (const m of d5) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(7);
    }
    expect(TRACKS.secplus.flashcards.filter((c) => c.sectionId === 'sp5').length).toBeGreaterThanOrEqual(32);
    expect(TRACKS.secplus.glossary.filter((g) => g.sectionId === 'sp5').length).toBeGreaterThanOrEqual(48);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp5').map((l) => l.id)).toEqual(['spl5a', 'spl5b', 'spl5c']);
  });

  it('the whole Security+ track is playable: every content section has questions', () => {
    for (const sec of TRACKS.secplus.sections) {
      if (!sec.boss) continue;
      const qs = ALL_MODULES.filter((m) => m.sectionId === sec.id).flatMap((m) => m.quiz);
      // boss battles draw 12 questions from the section
      expect(qs.length, sec.id).toBeGreaterThanOrEqual(12);
    }
  });

  it('order labs have at least 6 steps', () => {
    for (const [id, d] of Object.entries(ORDER_DATA)) {
      expect(d.steps.length, id).toBeGreaterThanOrEqual(6);
    }
  });

  it('select labs pick exactly pickN good options', () => {
    for (const [id, d] of Object.entries(SELECT_DATA)) {
      expect(d.options.filter((o) => o.good).length, id).toBe(d.pickN);
    }
  });

  it('every track section id carries its track', () => {
    for (const t of Object.values(TRACKS)) {
      for (const s of t.sections) expect(s.track).toBe(t.id);
    }
  });
});

describe('placement blocks', () => {
  it('hold exactly 12 well-formed questions in their own domain', () => {
    for (const b of ALL_PLACEMENT) {
      expect(b.questions, b.id).toHaveLength(PLACEMENT_BLOCK_N);
      for (const q of b.questions) {
        expect(q.choices, q.id).toHaveLength(4);
        expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
        expect(q.answer, q.id).toBeLessThan(4);
        expect(q.explain.length, q.id).toBeGreaterThan(20);
        expect(q.domain, q.id).toBe(b.domain);
      }
    }
  });

  it('use the pl- id family and are globally unique', () => {
    const ids = ALL_PLACEMENT.flatMap((b) => [b.id, ...b.questions.map((q) => q.id)]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith('pl-'), id).toBe(true);
    const lesson = new Set([
      ...ALL_QUESTIONS.map((q) => q.id),
      ...ALL_MODULES.map((m) => m.id),
    ]);
    for (const id of ids) expect(lesson.has(id), id).toBe(false);
  });

  it('never reuse a lesson question', () => {
    const lesson = new Set(ALL_QUESTIONS.map((q) => norm(q.prompt)));
    for (const b of ALL_PLACEMENT) {
      for (const q of b.questions) {
        expect(lesson.has(norm(q.prompt)), q.id).toBe(false);
      }
    }
  });

  it('point at a section that exists', () => {
    for (const b of ALL_PLACEMENT) {
      expect(sectionById(b.sectionId), b.id).toBeDefined();
    }
  });
});
