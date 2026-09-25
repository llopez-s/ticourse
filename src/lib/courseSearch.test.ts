import { describe, expect, it } from 'vitest';
import { TRACKS } from '../data/tracks';
import { searchCourse } from './courseSearch';

describe('course search', () => {
  it('finds lesson prose and tables, linking to the matching block', () => {
    const prose = searchCourse(TRACKS.gcti, 'Sherman Kent');
    expect(prose.find((result) => result.key === 's1m1')?.to).toMatch(/^\/learn\/s1m1\?block=\d+$/);

    const table = searchCourse(TRACKS.gcti, '141.98.6.10');
    expect(table.find((result) => result.key === 's1m1')?.to).toBe('/learn/s1m1?block=1');
  });

  it('ignores case and accents and requires every search word', () => {
    const results = searchCourse(TRACKS.gcti, 'ANALISIS inteligencia');
    expect(results.length).toBeGreaterThan(0);
    expect(searchCourse(TRACKS.gcti, 'Sherman banana')).toEqual([]);
  });

  it('keeps results inside the selected track', () => {
    const results = searchCourse(TRACKS.secplus, 'compensating');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => !result.key.startsWith('s1m'))).toBe(true);
    expect(results.some((result) => result.kind === 'glossary')).toBe(true);
  });
});
