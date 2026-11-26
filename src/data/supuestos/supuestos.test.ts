import { describe, expect, it } from 'vitest';
import { loadSupuesto, SUPUESTO_IDS } from './index';
import { metaOf, validateSupuesto } from '../../lib/supuesto';
import { ALL_MODULES, ALL_QUESTIONS, SECTIONS, supuestoMetaById, supuestosOf } from '../course';
import { TRACKS, TRACK_IDS } from '../tracks';
import { LABS } from '../labs';
import { ACHIEVEMENTS } from '../achievements';
import type { ProgressSnapshot } from '../../lib/types';

const ctx = {
  moduleIds: new Set(ALL_MODULES.map((m) => m.id)),
  sectionIds: new Set(SECTIONS.map((s) => s.id)),
};
const allMetas = TRACK_IDS.flatMap((t) => TRACKS[t].supuestos);

describe('supuestos registry', () => {
  it('has at least the pilot', () => {
    expect(SUPUESTO_IDS).toContain('op1s1');
  });

  it.each(SUPUESTO_IDS.map((id) => [id]))('%s loads and validates', async (id) => {
    const s = await loadSupuesto(id);
    expect(s).toBeDefined();
    expect(validateSupuesto(s!, ctx)).toEqual([]);
  });

  it('registers exactly the loadable ids, with metadata equal to metaOf(data)', async () => {
    expect(allMetas.map((m) => m.id).sort()).toEqual([...SUPUESTO_IDS].sort());
    for (const m of allMetas) {
      const s = await loadSupuesto(m.id);
      expect(m).toEqual(metaOf(s!));
      expect(TRACKS[s!.track].supuestos).toContain(m);
    }
  });

  it('returns undefined for an unknown id', async () => {
    expect(await loadSupuesto('nope')).toBeUndefined();
  });

  it('keeps ids unique against modules, labs, questions, sections and cards', () => {
    const taken = new Set<string>([
      ...ALL_MODULES.map((m) => m.id),
      ...LABS.map((l) => l.id),
      ...ALL_QUESTIONS.map((q) => q.id),
      ...SECTIONS.map((s) => s.id),
      ...TRACK_IDS.flatMap((t) => TRACKS[t].flashcards.map((c) => c.id)),
    ]);
    for (const id of SUPUESTO_IDS) expect(taken.has(id), id).toBe(false);
    expect(new Set(SUPUESTO_IDS).size).toBe(SUPUESTO_IDS.length);
  });

  it('exposes lookups by section and id, hiding integrators from sections', () => {
    expect(supuestosOf('op1').map((m) => m.id)).toContain('op1s1');
    expect(supuestosOf('s1')).toEqual([]);
    expect(supuestoMetaById('op1s1')?.title).toBe('La oficina comarcal nueva');
    expect(supuestoMetaById('zzz')).toBeUndefined();
    for (const sec of SECTIONS) for (const m of supuestosOf(sec.id)) expect(m.integrator).toBeFalsy();
  });
});

describe('sup-first-exam achievement', () => {
  const snap = (supuestos: ProgressSnapshot['supuestos']) => ({ supuestos }) as ProgressSnapshot;
  const a = ACHIEVEMENTS.find((x) => x.id === 'sup-first-exam')!;
  const best = (grade: number) => ({ grade, auto: grade, at: 'd', version: 1 });
  it('needs an exam grade of 5', () => {
    expect(a.test(snap({}))).toBe(false);
    expect(a.test(snap({ op1s1: { practice: best(9) } }))).toBe(false);
    expect(a.test(snap({ op1s1: { exam: best(4.9) } }))).toBe(false);
    expect(a.test(snap({ op1s1: { exam: best(5) } }))).toBe(true);
  });
});
