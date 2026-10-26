import { PIVOT_CASES } from './pivot';
import { REPORT_CASES } from './report';
import { LOG_CASES } from './logs';
import type { ChallengeCase } from '../../lib/labChallenge';

export const CHALLENGE_CASES: Record<'pivot' | 'report' | 'logs', ChallengeCase[]> = {
  pivot: PIVOT_CASES, report: REPORT_CASES, logs: LOG_CASES,
};
