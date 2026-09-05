// Core domain types for IntelForge Academy

export type Conf = 'low' | 'med' | 'high';
export type Grade = 0 | 3 | 4 | 5; // Again / Hard / Good / Easy

export type TrackId = 'gcti' | 'secplus';

export type Domain =
  // GCTI
  | 'Requirements'
  | 'Intrusion Analysis'
  | 'Collection'
  | 'Analysis'
  | 'Dissemination'
  // Security+ SY0-701
  | 'General Security Concepts'
  | 'Threats, Vulnerabilities & Mitigations'
  | 'Security Architecture'
  | 'Security Operations'
  | 'Security Program Management & Oversight';

export interface Question {
  id: string;
  prompt: string;
  choices: string[];
  answer: number; // index into choices
  explain: string;
  domain: Domain;
}

/** One placement-test block: a whole exam domain, worth one section. */
export interface PlacementBlock {
  id: string; // "pl-sp1"
  sectionId: string; // "sp1"
  domain: Domain;
  title: string; // Spanish, shown on the block card
  blurb: string; // Spanish, one line describing what it covers
  questions: Question[]; // exactly PLACEMENT_BLOCK_N
}

export type ExemptStatus = 'exempt' | 'revoked';

/**
 * One module exempted (or un-exempted) by a placement block. Revocation writes
 * a tombstone rather than deleting, so it can win a sync merge.
 */
export interface ExemptEntry {
  status: ExemptStatus;
  at: string; // ISO timestamp — drives the merge
  via: string; // placement block id that granted it
  score: number; // block percentage at grant time, 0-100
}

export interface PlacementResult {
  date: string; // ISO timestamp
  track: TrackId;
  blockId: string;
  sectionId: string;
  correct: number;
  total: number;
  pct: number;
  passed: boolean;
}

export interface CheckQ {
  q: string;
  choices: string[];
  answer: number;
  explain?: string;
}

export type Block =
  | { t: 'p'; md: string }
  | { t: 'h'; text: string }
  | { t: 'list'; items: string[]; ordered?: boolean }
  | { t: 'table'; headers: string[]; rows: string[][] }
  | { t: 'code'; lang?: string; title?: string; text: string }
  | {
      t: 'callout';
      kind: 'tip' | 'warn' | 'example' | 'exam' | 'story';
      title?: string;
      md: string;
    }
  | { t: 'quote'; md: string; by?: string }
  | { t: 'check'; q: CheckQ };

export interface Module {
  id: string; // "s1m1"
  sectionId: string; // "s1"
  title: string;
  minutes: number;
  objectives: string[];
  blocks: Block[];
  quiz: Question[];
}

export interface BossMeta {
  codename: string; // operation name
  adversary: string; // adversary cell name
  flavor: string; // Spanish flavor text
  dossier: string; // dossier fragment revealed on victory (Spanish)
}

export interface SectionMeta {
  id: string;
  track: TrackId;
  num: number;
  title: string;
  short: string;
  subtitle: string;
  domain: Domain | null;
  icon: string;
  boss: BossMeta | null;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  sectionId: string;
}

export interface GlossaryEntry {
  term: string;
  def: string;
  sectionId: string;
}

export interface CardState {
  ease: number;
  interval: number; // days
  due: string; // YYYY-MM-DD
  reps: number;
  lapses: number;
}

export interface StreakState {
  current: number;
  best: number;
  lastDay: string | null;
  freezes: number;
}

export type CounterKey =
  | 'lessons'
  | 'questions'
  | 'correct'
  | 'cards'
  | 'labs'
  | 'highConfCorrect';

export interface DayState {
  date: string;
  lessons: number;
  questions: number;
  correct: number;
  cards: number;
  labs: number;
  highConfCorrect: number;
  xpEarned: number;
  newCards: number;
  questsAwarded: string[];
}

export interface Totals {
  questions: number;
  correct: number;
  cards: number;
  maxCombo: number;
  highConfCorrect: number;
  perfectQuizzes: number;
  questsDone: number;
  checkpoints: number;
}

export interface ExamResult {
  date: string;
  track: TrackId;
  pct: number;
  correct: number;
  total: number;
  domains: Record<string, { n: number; c: number }>;
}

export interface ProgressSnapshot {
  track: TrackId; // active study track
  xp: number;
  streak: StreakState;
  activity: Record<string, number>; // day -> xp earned
  lessons: Record<string, boolean>;
  quizBest: Record<string, number>;
  labs: Record<string, boolean>;
  bosses: Record<string, number>; // sectionId -> best pct
  exams: ExamResult[];
  srs: Record<string, CardState>;
  calibration: Record<Conf, { n: number; c: number }>;
  totals: Totals;
  achievements: Record<string, string>; // id -> ISO date unlocked
  exempt: Record<string, ExemptEntry>; // moduleId -> entry
  placement: PlacementResult[]; // full attempt history
  day: DayState;
}

export interface AchievementDef {
  id: string;
  icon: string;
  title: string;
  desc: string;
  xp: number;
  secret?: boolean;
  test: (s: ProgressSnapshot) => boolean;
}

export interface QuestDef {
  id: string;
  icon: string;
  title: string;
  desc: string;
  target: number;
  counter: CounterKey;
  xp: number;
}
