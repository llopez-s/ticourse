import type { Conf } from './types';

/** Flat XP rewards */
export const XP = {
  lesson: 50,
  checkpoint: 10,
  boss: 200,
  card: 2,
  quizPass: 30,
  examPass: 100,
  examTry: 40,
  placement: 50,
} as const;

/** Confidence-bet stakes: the signature mechanic. Win/lose XP per answer. */
export const STAKES: Record<Conf, { win: number; lose: number }> = {
  low: { win: 5, lose: 0 },
  med: { win: 10, lose: 5 },
  high: { win: 20, lose: 15 },
};

export const CONF_LABEL: Record<Conf, string> = {
  low: 'Possible',
  med: 'Likely',
  high: 'Almost certain',
};

/**
 * Level curve: level 1→2 costs 200 XP, each next level costs +100 more.
 * Returns current level, XP into the level, and XP needed for next.
 */
export function levelInfo(xp: number): { level: number; into: number; need: number } {
  let level = 1;
  let rem = xp;
  let need = 200;
  while (rem >= need) {
    rem -= need;
    level += 1;
    need = 200 + (level - 1) * 100;
  }
  return { level, into: rem, need };
}

export interface Rank {
  lvl: number;
  name: string;
  icon: string;
}

export const RANKS: Rank[] = [
  { lvl: 1, name: 'Trainee', icon: '🎓' },
  { lvl: 3, name: 'Junior Analyst', icon: '🔍' },
  { lvl: 5, name: 'Analyst', icon: '🛰️' },
  { lvl: 8, name: 'Senior Analyst', icon: '🧠' },
  { lvl: 11, name: 'Principal Analyst', icon: '⚙️' },
  { lvl: 14, name: 'Intel Lead', icon: '🎖️' },
  { lvl: 18, name: 'CTI Director', icon: '👑' },
];

export function rankFor(level: number, ranks: Rank[] = RANKS): Rank {
  let r = ranks[0];
  for (const rank of ranks) if (level >= rank.lvl) r = rank;
  return r;
}

export function nextRank(level: number, ranks: Rank[] = RANKS): Rank | null {
  for (const rank of ranks) if (rank.lvl > level) return rank;
  return null;
}
