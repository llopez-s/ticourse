import { describe, expect, it } from 'vitest';
import { nextRank, rankFor, RANKS, type Rank } from './xp';

const ALT: Rank[] = [
  { lvl: 1, name: 'A', icon: 'a' },
  { lvl: 5, name: 'B', icon: 'b' },
];

describe('ranks', () => {
  it('defaults to RANKS', () => {
    expect(rankFor(1).name).toBe(RANKS[0].name);
  });
  it('uses a custom table', () => {
    expect(rankFor(4, ALT).name).toBe('A');
    expect(rankFor(5, ALT).name).toBe('B');
    expect(nextRank(1, ALT)?.name).toBe('B');
    expect(nextRank(5, ALT)).toBeNull();
  });
});
