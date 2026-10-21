import { describe, expect, it } from 'vitest';
import {
  contentSections,
  isOptionalSection,
  modulesOf,
  nextModule,
  placementBlocks,
  sampleExam,
  sectionById,
} from './course';
import { TRACKS, TRACK_IDS } from './tracks';
import { SP7_FLASHCARDS, SP7_GLOSSARY } from './secplus/sp7-cards';
import { SP7_MODULES } from './secplus/sp7';

const secplus = TRACKS.secplus;

/** Mandatory keywords per lesson (spec, column «Temas»), checked case-insensitively. */
const COVERAGE: Record<string, string[]> = {
  sp7m1: ['16%', '24%', '19%', '27%', '14%', '17 de noviembre', 'gap analysis', 'RTO', 'Zero Trust', 'SY0-701'],
  sp7m2: ['prompt injection', 'poisoning', 'jailbreaking', 'evasion', 'hallucinations', 'bias', 'explainability', 'LLM', 'session hijacking', 'code execution', 'data loss', 'model manipulation'],
  sp7m3: ['guardrails', 'agentic', 'chatbot', 'predictive analysis', 'CI/CD', 'automation logic', 'baseline'],
  sp7m4: ['quishing', 'deepfake', 'RCS', 'living-off-the-land', 'impossible travel', 'log manipulation', 'BEC', 'session tokens'],
  sp7m5: ['hardcoded secrets', 'TOC', 'TOU', 'malicious update', 'secrets scanning', 'passkey', 'passwordless', 'gMSA', 'privilege creep', 'emergency access'],
  sp7m6: ['Security Service Edge', 'out-of-band', 'data steward', 'data custodian', 'deidentification', 'data transpose', 'autoscaling', 'immutability', 'restoration testing', 'capacity planning'],
  sp7m7: ['fail forward', 'CAB', 'CSPM', 'IPAM', 'bounty', 'responsible disclosure', 'negotiation', 'MITRE ATT&CK', 'Diamond Model', 'behavior'],
};

describe('sp7 optional section', () => {
  it('sp7 is a domainless, bossless optional section', () => {
    const sec = sectionById('sp7');
    expect(sec).toBeDefined();
    expect(sec?.domain).toBeNull();
    expect(sec?.boss).toBeNull();
    expect(sec?.num).toBe(7);
    expect(contentSections('secplus').map((s) => s.id)).toEqual(['sp1', 'sp2', 'sp3', 'sp4', 'sp5']);
    expect(isOptionalSection('sp7')).toBe(true);
    expect(isOptionalSection('sp6')).toBe(false);
  });

  it('sp7 lessons follow sp6 in the track and carry no quiz', () => {
    const ids = secplus.modules.map((m) => m.id);
    expect(ids.slice(-8)).toEqual(['sp6m1', 'sp7m1', 'sp7m2', 'sp7m3', 'sp7m4', 'sp7m5', 'sp7m6', 'sp7m7']);
    const mods = modulesOf('sp7');
    expect(mods).toHaveLength(7);
    for (const m of mods) {
      expect(m.sectionId).toBe('sp7');
      expect(m.quiz).toEqual([]);
      const mandatory = m.blocks.filter((b) => b.t === 'check' && !b.q.optional);
      expect(mandatory, `${m.id} has a mandatory check`).toEqual([]);
    }
    expect(SP7_MODULES.map((m) => m.id)).toEqual(mods.map((m) => m.id));
  });

  it('every sp7 lesson opens with the out-of-701 notice and ends with links', () => {
    for (const m of modulesOf('sp7')) {
      const first = m.blocks[0];
      expect(first.t, `${m.id} first block`).toBe('callout');
      if (first.t === 'callout') expect(first.title).toContain('Fuera del SY0-701');
      expect(m.blocks[m.blocks.length - 1].t, `${m.id} last block`).toBe('links');
    }
  });

  it('nextModule skips optional sections', () => {
    const lessons: Record<string, boolean> = {};
    for (const m of secplus.modules) if (m.sectionId !== 'sp7') lessons[m.id] = true;
    expect(nextModule('secplus', { lessons, exempt: {} })).toBeUndefined();
  });

  it('placement and exam sampling are unchanged', () => {
    expect(placementBlocks('secplus')).toHaveLength(5);
    const exam = sampleExam('secplus', 90, '1');
    expect(exam).toHaveLength(90);
    const sp7Ids = new Set(modulesOf('sp7').flatMap((m) => m.quiz.map((q) => q.id)));
    expect(exam.filter((q) => sp7Ids.has(q.id)).length).toBe(0);
    expect(exam.some((q) => /^sp7m/.test(q.id))).toBe(false);
  });

  it('sp7 flashcards come last and ids are unique', () => {
    const cards = secplus.flashcards;
    const tail = cards.slice(cards.length - SP7_FLASHCARDS.length);
    expect(tail).toEqual(SP7_FLASHCARDS);
    const ids = TRACK_IDS.flatMap((t) => TRACKS[t].flashcards.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of SP7_FLASHCARDS) {
      expect(c.sectionId).toBe('sp7');
      expect(c.id).toMatch(/^fcp7\d\d$/);
    }
  });

  it('sp7 glossary terms belong to sp7 and are not duplicated', () => {
    const terms = SP7_GLOSSARY.map((g) => g.term.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
    for (const g of SP7_GLOSSARY) expect(g.sectionId).toBe('sp7');
    const gl = secplus.glossary;
    expect(gl.slice(gl.length - SP7_GLOSSARY.length)).toEqual(SP7_GLOSSARY);
  });

  it('sp7 has at least 38 flashcards and 48 glossary terms', () => {
    expect(SP7_FLASHCARDS.length).toBeGreaterThanOrEqual(38);
    expect(SP7_GLOSSARY.length).toBeGreaterThanOrEqual(48);
    for (const c of SP7_FLASHCARDS) {
      expect(c.front.trim().length, c.id).toBeGreaterThan(0);
      expect(c.back.trim().length, c.id).toBeGreaterThan(0);
    }
    for (const g of SP7_GLOSSARY) {
      expect(g.term.trim().length, g.term).toBeGreaterThan(0);
      expect(g.def.trim().length, g.term).toBeGreaterThan(0);
    }
  });

  it('sp7 flashcard ids are unique across the whole track', () => {
    const ids = secplus.flashcards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    // Sequential, gap-free numbering fcp701, fcp702, ...
    expect(SP7_FLASHCARDS.map((c) => c.id)).toEqual(
      SP7_FLASHCARDS.map((_, i) => `fcp7${String(i + 1).padStart(2, '0')}`),
    );
  });

  it('every sp7 coverage keyword has a flashcard or glossary entry for the AI lessons', () => {
    const cardText = SP7_FLASHCARDS.map((c) => `${c.front} ${c.back}`).join(' ');
    const termText = SP7_GLOSSARY.map((g) => g.term).join(' ');
    const corpus = `${cardText} ${termText}`.toLowerCase();
    for (const id of ['sp7m2', 'sp7m3']) {
      for (const kw of COVERAGE[id]) {
        expect(corpus, `${id} keyword "${kw}" needs a card or glossary term`).toContain(kw.toLowerCase());
      }
    }
  });

  it('no sp7 card or term says that an omitted topic stops being tested in the 701', () => {
    const text = [
      ...SP7_FLASHCARDS.map((c) => `${c.front} ${c.back}`),
      ...SP7_GLOSSARY.map((g) => `${g.term} ${g.def}`),
    ].join('\n');
    expect(text).not.toMatch(/no longer (tested|assessed|covered)|stops? being tested|ya no (cae|entra|se examina)|dejó de caer/i);
  });

  it('sp7 lessons mention their topics', () => {
    for (const m of modulesOf('sp7')) {
      const text = JSON.stringify(m.blocks).toLowerCase();
      for (const kw of COVERAGE[m.id] ?? []) {
        expect(text, `${m.id} should mention "${kw}"`).toContain(kw.toLowerCase());
      }
    }
    expect(Object.keys(COVERAGE).sort()).toEqual(modulesOf('sp7').map((m) => m.id).sort());
  });
});

