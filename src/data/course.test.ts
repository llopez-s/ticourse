import { describe, expect, it } from 'vitest';
import {
  ALL_MODULES,
  ALL_QUESTIONS,
  SECTIONS,
  examReadiness,
  modulesOfTrack,
  nextModule,
  placementBlockById,
  placementBlocks,
  sampleExam,
  sectionMastery,
  sectionsOf,
  trackOf,
} from './course';
import { LABS } from './labs';
import { TRACKS, TRACK_IDS } from './tracks';

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('ids', () => {
  it('are globally unique', () => {
    expect(unique(SECTIONS.map((s) => s.id))).toBe(true);
    expect(unique(ALL_MODULES.map((m) => m.id))).toBe(true);
    expect(unique(ALL_QUESTIONS.map((q) => q.id))).toBe(true);
    expect(unique(LABS.map((l) => l.id))).toBe(true);
    expect(
      unique(TRACK_IDS.flatMap((t) => TRACKS[t].flashcards.map((c) => c.id))),
    ).toBe(true);
  });
});

describe('track scoping', () => {
  it('maps sections to tracks', () => {
    expect(trackOf('s1')).toBe('gcti');
    expect(trackOf('sp1')).toBe('secplus');
    expect(trackOf('nope')).toBe('gcti');
    expect(sectionsOf('secplus').map((s) => s.id)).toEqual([
      'sp1',
      'sp2',
      'sp3',
      'sp4',
      'sp5',
      'sp6',
    ]);
    expect(modulesOfTrack('gcti').every((m) => /^s\d/.test(m.id))).toBe(true);
    expect(modulesOfTrack('secplus').every((m) => m.id.startsWith('sp'))).toBe(
      true,
    );
  });

  it('nextModule respects the track', () => {
    const s = { lessons: { s1m1: true }, exempt: {} };
    expect(nextModule('gcti', s)?.id).toBe('s1m2');
    expect(
      nextModule('secplus', { lessons: {}, exempt: {} })?.id.startsWith('sp'),
    ).toBe(true);
  });

  it('examReadiness ignores sections without modules', () => {
    const empty = { lessons: {}, quizBest: {}, labs: {}, bosses: {}, exempt: {} };
    expect(examReadiness('gcti', empty)).toBe(0);
    // Master every Security+ section that has modules; empty ones must not
    // drag the mean down.
    const spMods = modulesOfTrack('secplus');
    const withContent = new Set(spMods.map((m) => m.sectionId));
    const done = {
      lessons: Object.fromEntries(spMods.map((m) => [m.id, true])),
      quizBest: Object.fromEntries(spMods.map((m) => [m.id, 100])),
      labs: Object.fromEntries(
        LABS.filter((l) => withContent.has(l.sectionId)).map((l) => [l.id, true]),
      ),
      bosses: Object.fromEntries([...withContent].map((id) => [id, 100])),
      exempt: {},
    };
    expect(examReadiness('secplus', done)).toBe(100);
  });
});

describe('sampleExam', () => {
  it('returns n questions weighted by domain for gcti', () => {
    const qs = sampleExam('gcti', 25, 'seed');
    expect(qs).toHaveLength(25);
    for (const d of TRACKS.gcti.domains) {
      expect(qs.filter((q) => q.domain === d)).toHaveLength(5);
    }
  });

  it('skips empty domains and caps at what exists', () => {
    const qs = sampleExam('secplus', 30, 'seed');
    const available = modulesOfTrack('secplus').flatMap((m) => m.quiz).length;
    expect(qs.length).toBe(Math.min(30, available));
    expect(qs.every((q) => TRACKS.secplus.domains.includes(q.domain))).toBe(
      true,
    );
    expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
  });

  it('redistributes shortfall when a domain is short', () => {
    // 50 GCTI questions with equal weights → 10 per domain; every domain has ≥10
    const qs = sampleExam('gcti', 50, 'seed2');
    expect(qs).toHaveLength(50);
  });

  it('is deterministic for a seed', () => {
    expect(sampleExam('gcti', 10, 'x').map((q) => q.id)).toEqual(
      sampleExam('gcti', 10, 'x').map((q) => q.id),
    );
  });
});

const emptyProg = {
  lessons: {} as Record<string, boolean>,
  quizBest: {} as Record<string, number>,
  labs: {} as Record<string, boolean>,
  bosses: {} as Record<string, number>,
  exempt: {} as Record<string, import('../lib/types').ExemptEntry>,
};

describe('placement lookups', () => {
  it('every placement block points at a real section of its own track', () => {
    for (const t of TRACK_IDS) {
      for (const b of placementBlocks(t)) {
        expect(trackOf(b.sectionId), b.id).toBe(t);
        expect(placementBlockById(b.id), b.id).toBe(b);
      }
    }
  });

  it('returns undefined for an unknown block', () => {
    expect(placementBlockById('pl-nope')).toBeUndefined();
  });
});

describe('mastery with exemptions', () => {
  const ids = modulesOfTrack('secplus')
    .filter((m) => m.sectionId === 'sp1')
    .map((m) => m.id);

  const exemptAll = (score: number) => {
    const exempt: Record<string, import('../lib/types').ExemptEntry> = {};
    for (const id of ids) {
      exempt[id] = { status: 'exempt', at: '2026-09-05T10:00:00.000Z', via: 'pl-sp1', score };
    }
    return { ...emptyProg, exempt };
  };

  it('a fully exempted section scores above nothing and below full mastery', () => {
    const before = sectionMastery('sp1', emptyProg);
    const after = sectionMastery('sp1', exemptAll(83));
    expect(before).toBe(0);
    expect(after).toBeGreaterThan(before);
    expect(after).toBeLessThan(100);
  });

  it('credits the quiz with the block score, not with 100', () => {
    expect(sectionMastery('sp1', exemptAll(100))).toBeGreaterThan(
      sectionMastery('sp1', exemptAll(83)),
    );
  });

  it('a real quiz score beats a lower exemption instead of being dragged down', () => {
    const quizBest: Record<string, number> = {};
    for (const id of ids) quizBest[id] = 100;
    // 100% quizzes under an 83% exemption must score exactly as 100% quizzes
    // do: sectionMastery takes the max, so convalidating never demotes work
    // the learner genuinely earned.
    expect(sectionMastery('sp1', { ...exemptAll(83), quizBest })).toBe(
      sectionMastery('sp1', { ...exemptAll(100), quizBest }),
    );
  });

  it('a revoked exemption counts for nothing', () => {
    const revoked = exemptAll(83);
    for (const id of ids) revoked.exempt[id].status = 'revoked';
    expect(sectionMastery('sp1', revoked)).toBe(0);
  });
});

describe('nextModule skips convalidated theory', () => {
  it('lands on the first module that is neither studied nor exempt', () => {
    const ids = modulesOfTrack('secplus').map((m) => m.id);
    const s = {
      lessons: { [ids[0]]: true },
      exempt: {
        [ids[1]]: {
          status: 'exempt' as const,
          at: '2026-09-05T10:00:00.000Z',
          via: 'pl-sp1',
          score: 90,
        },
      },
    };
    expect(nextModule('secplus', s)?.id).toBe(ids[2]);
  });
});
