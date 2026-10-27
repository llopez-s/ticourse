import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ALL_MODULES, ALL_PLACEMENT, moduleById, sampleExam } from './course';
import { TRACKS, TRACK_IDS } from './tracks';
import { PRACTICAL_EXPANSIONS } from './practical';
import { LABS } from './labs';
import { S1_MODULES } from './s1';
import { S2_MODULES } from './s2';
import { S3_MODULES } from './s3';
import { S4_MODULES } from './s4';
import { S5_MODULES } from './s5';
import { S6_MODULES } from './s6';
import { SP1_MODULES } from './secplus/sp1';
import { SP2_MODULES } from './secplus/sp2';
import { SP3_MODULES } from './secplus/sp3';
import { SP4_MODULES } from './secplus/sp4';
import { SP5_MODULES } from './secplus/sp5';
import { SP6_MODULES } from './secplus/sp6';
import { SP7_MODULES } from './secplus/sp7';

const originals = [...S1_MODULES, ...S2_MODULES, ...S3_MODULES, ...S4_MODULES, ...S5_MODULES, ...S6_MODULES,
  ...SP1_MODULES, ...SP2_MODULES, ...SP3_MODULES, ...SP4_MODULES, ...SP5_MODULES, ...SP6_MODULES, ...SP7_MODULES];

describe('practical curriculum compatibility', () => {
  it('preserves module IDs, original block indices, quizzes and official domain weights', () => {
    expect(ALL_MODULES.map((m) => m.id)).toEqual(originals.map((m) => m.id));
    for (const original of originals) {
      const mod = moduleById(original.id)!;
      expect(mod.blocks.slice(0, original.blocks.length), original.id).toEqual(original.blocks);
      expect(mod.quiz, original.id).toEqual(original.quiz);
    }
    expect(TRACKS.secplus.domains.map((d) => TRACKS.secplus.domainWeights[d])).toEqual([.12, .22, .18, .28, .20]);
    expect(TRACKS.gcti.domains.map((d) => TRACKS.gcti.domainWeights[d])).toEqual([.2, .2, .2, .2, .2]);
  });

  it('keeps advanced practice out of default exams, bosses, placement and lesson completion', () => {
    for (const [id, extra] of Object.entries(PRACTICAL_EXPANSIONS)) {
      expect(moduleById(id)?.minutes, id).toBeGreaterThan(originals.find((m) => m.id === id)!.minutes);
      const checks = extra.blocks.filter((b) => b.t === 'check');
      for (const block of checks) {
        if (block.t !== 'check') continue;
        // Only the elementary identity distinction and stealer evidence checks are required.
        if (id !== 'sp4m8' && id !== 'sp2m6') expect(block.q.optional, id).toBe(true);
        expect(block.q.choices).toHaveLength(4);
        expect(block.q.answer).toBeGreaterThanOrEqual(0);
        expect(block.q.answer).toBeLessThan(4);
        expect(block.q.explain!.length).toBeGreaterThan(80);
      }
    }
    for (const track of TRACK_IDS) {
      const pool = originals.filter((m) => TRACKS[track].sections.some((s) => s.id === m.sectionId)).flatMap((m) => m.quiz);
      expect(TRACKS[track].modules.flatMap((m) => m.quiz)).toEqual(pool);
      for (const q of sampleExam(track, 90, 'practical-safety')) expect(pool).toContain(q);
    }
    expect(ALL_PLACEMENT.flatMap((b) => b.questions)).toHaveLength(120);
  });

  it('resolves every new lesson/lab link and restricts references to primary documentation', () => {
    for (const mod of ALL_MODULES) for (const block of mod.blocks) {
      if (block.t !== 'links') continue;
      for (const item of block.items) {
        if (item.href.startsWith('/learn/')) expect(moduleById(item.href.slice(7)), item.href).toBeDefined();
        else if (item.href.startsWith('/lab/')) expect(LABS.some((lab) => lab.id === item.href.slice(5)), item.href).toBe(true);
        else expect(['learn.microsoft.com', 'docs.virustotal.com', 'yara.readthedocs.io', 'www.nvb.nl']).toContain(new URL(item.href).hostname);
      }
    }
  });

  it('places the TaHiTI hunting capsule after s5m5\'s other expansion and points to it from s1m3', () => {
    const titles = moduleById('s5m5')!.blocks.flatMap((b) => (b.t === 'callout' ? [b.title ?? ''] : []));
    expect(titles.at(-1)).toContain('TaHiTI');
    expect(titles.findIndex((t) => t.includes('Dos preguntas'))).toBeLessThan(titles.length - 1);
    const s1m3Links = moduleById('s1m3')!.blocks.flatMap((b) => (b.t === 'links' ? b.items.map((i) => i.href) : []));
    expect(s1m3Links).toContain('/learn/s5m5');
  });

  it('ships an inert corpus, a real-engine verifier and an honest browser editor', () => {
    expect(existsSync('public/labs/yara-practice.zip')).toBe(true);
    expect(readFileSync('public/labs/yara-practice/verify.py', 'utf8')).toContain('yara.compile');
    expect(moduleById('s3m5')!.blocks.filter((b) => b.t === 'yara-practice')).toHaveLength(1);
    expect(readFileSync('src/components/labs/YaraLab.tsx', 'utf8')).toContain('no compila ni ejecuta YARA');
    expect(readFileSync('src/components/YaraPractice.tsx', 'utf8')).toContain('no compila ni ejecuta YARA');
  });
});
