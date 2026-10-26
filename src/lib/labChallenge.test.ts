import { describe, expect, it } from 'vitest';
import { CHALLENGE_CASES } from '../data/lab-challenges';
import { LABS } from '../data/labs';
import { moduleById } from '../data/course';
import { emptyChallengeAnswer, evaluateChallenge, filterLogs, queryEvidence, readyToSubmit, WRITING_FIELDS } from './labChallenge';
import type { ChallengeAnswer, ChallengeCase, PivotCase } from './labChallenge';

function solved(data: ChallengeCase): ChallengeAnswer {
  const answer = emptyChallengeAnswer();
  for (const field of WRITING_FIELDS[data.kind]) answer.text[field.id] = 'Conclusión con evidencias y límites, para revisar con la rúbrica.';
  if (data.kind === 'pivot') for (const candidate of data.candidates) {
    answer.decisions[candidate.id] = candidate.verdict;
    answer.references[candidate.id] = candidate.evidenceSets[0];
  }
  if (data.kind === 'report') {
    answer.decisions = { assessment: data.assessment, confidence: data.confidence[0], tlp: data.tlp[0] };
    answer.references.report = data.evidenceSets[0];
  }
  if (data.kind === 'logs') { answer.text.host = data.host; answer.text.account = data.account; answer.timeline = [...data.timeline]; }
  return answer;
}

describe('lab curriculum and challenge contracts', () => {
  it('keeps 27 labs, valid prerequisites, two objectives and explicit completion criteria', () => {
    expect(LABS).toHaveLength(27);
    for (const lab of LABS) {
      expect(lab.objectives?.length, lab.id).toBeGreaterThanOrEqual(2);
      expect(lab.outcome?.length, lab.id).toBeGreaterThan(25);
      expect(lab.prerequisites?.length, lab.id).toBeGreaterThan(0);
      for (const id of lab.prerequisites ?? []) expect(moduleById(id), `${lab.id} prerequisite ${id}`).toBeDefined();
    }
    expect(LABS.filter((l) => l.challengeId).map((l) => l.id)).toEqual(['lab3a', 'lab5b', 'spl4a']);
  });
  for (const cases of Object.values(CHALLENGE_CASES)) for (const data of cases) {
    it(`${data.id}: has a complete answer and a reproducible objective correction`, () => {
      const answer = solved(data);
      const opened = data.kind === 'pivot' ? data.evidence.map((e) => e.id) : [];
      expect(readyToSubmit(data, answer, opened)).toBe(true);
      expect(evaluateChallenge(data, answer).every((check) => check.ok)).toBe(true);
      expect(data.solution.length).toBeGreaterThan(200);
      expect(data.minutes).toBeGreaterThanOrEqual(20);
      expect(data.minutes).toBeLessThanOrEqual(30);
      answer.text[WRITING_FIELDS[data.kind][0].id] = '   ';
      expect(readyToSubmit(data, answer, opened)).toBe(false);
    });
  }
  it('requires opened evidence in pivot submissions and rejects unsupported candidates', () => {
    const data = CHALLENGE_CASES.pivot[0] as PivotCase;
    const answer = solved(data);
    expect(readyToSubmit(data, answer, ['P0'])).toBe(false);
    answer.decisions.hr = 'uncertain';
    answer.references.updates = ['P2'];
    const checks = evaluateChallenge(data, answer);
    expect(checks.find((c) => c.id === 'hr-decision')?.ok).toBe(false);
    expect(checks.find((c) => c.id === 'updates-evidence')?.ok).toBe(false);
  });
  it('makes both pivot cases solvable within budget, with more queries available than affordable', () => {
    for (const data of CHALLENGE_CASES.pivot as PivotCase[]) {
      let opened = ['P0'];
      for (const evidence of data.evidence.filter((e) => !e.id.startsWith('N'))) opened = queryEvidence(data, opened, evidence.id);
      expect(readyToSubmit(data, solved(data), opened)).toBe(true);
      expect(data.evidence.reduce((s, e) => s + (e.cost ?? 0), 0)).toBeGreaterThan(data.budget);
      const all = [...opened];
      for (const e of data.evidence) opened = queryEvidence(data, opened, e.id);
      expect(data.evidence.filter((e) => opened.includes(e.id)).reduce((s, e) => s + (e.cost ?? 0), 0)).toBeLessThanOrEqual(data.budget);
      expect(queryEvidence(data, opened, 'missing')).toBe(opened);
      expect(queryEvidence(data, all, 'P2')).toBe(all);
      expect(queryEvidence(data, ['P0'], 'P3')).toEqual(['P0']);
    }
  });
  it('tests a changed relationship in variant B rather than renaming the same solution', () => {
    const [a, b] = CHALLENGE_CASES.report;
    expect(a.kind === 'report' && b.kind === 'report' && a.assessment !== b.assessment).toBe(true);
    const [pa, pb] = CHALLENGE_CASES.pivot as PivotCase[];
    expect(pa.candidates[1].verdict).not.toBe(pb.candidates[0].verdict); // certificate: corroborated vs provider-shared
    const [la, lb] = CHALLENGE_CASES.logs;
    expect(la.kind === 'logs' && lb.kind === 'logs' && la.host !== lb.host && la.account !== lb.account).toBe(true);
  });
  it('does not count circular reporting as independent evidence or text as automatically graded', () => {
    const data = CHALLENGE_CASES.report[1];
    const answer = solved(data);
    answer.references.report = ['R1', 'R2'];
    expect(evaluateChallenge(data, answer).find((c) => c.id === 'references')?.ok).toBe(false);
    answer.references.report = ['R1', 'R3'];
    answer.text.bluf = 'Unsupported text';
    expect(evaluateChallenge(data, answer).every((c) => c.ok)).toBe(true); // writing must be assessed with the explicit rubric
  });
  it('accepts justified moderate confidence and normalizes account/host whitespace and case', () => {
    const report = CHALLENGE_CASES.report[0];
    const answer = solved(report); answer.decisions.confidence = 'moderate';
    expect(evaluateChallenge(report, answer).find((c) => c.id === 'confidence')?.ok).toBe(true);
    const data = CHALLENGE_CASES.logs[0];
    const logAnswer = solved(data); logAnswer.text.host = ' ws-17 '; logAnswer.text.account = ' ANA.OPS ';
    expect(evaluateChallenge(data, logAnswer).every((c) => c.ok)).toBe(true);
  });
  it('requires the right events in temporal order, with no duplicates', () => {
    const data = CHALLENGE_CASES.logs[0];
    const answer = solved(data); answer.timeline.reverse();
    expect(evaluateChallenge(data, answer).find((c) => c.id === 'timeline')?.ok).toBe(false);
    answer.timeline[1] = answer.timeline[0];
    expect(readyToSubmit(data, answer)).toBe(false);
  });
  it('filters by field, source and inclusive UTC window without mutating records', () => {
    const data = CHALLENGE_CASES.logs[0];
    if (data.kind !== 'logs') throw new Error('wrong fixture');
    const before = JSON.stringify(data.records);
    expect(data.records).toHaveLength(32);
    expect(filterLogs(data.records, 'ANA.OPS', 'auth', 'user', '03:10', '03:11', false).map((r) => r.id)).toEqual(data.timeline.slice(0, 2));
    expect(filterLogs(data.records, 'ana.ops', 'all', 'all', '03:10', '03:14', true).map((r) => r.id)).toEqual([...data.timeline].reverse());
    expect(filterLogs(data.records, 'missing', 'all', 'all', '', '', false)).toEqual([]);
    expect(filterLogs(data.records, '', 'all', 'all', '03:20', '03:10', false)).toEqual([]);
    expect(JSON.stringify(data.records)).toBe(before);
  });
  it('uses unique evidence IDs and valid references and query dependencies', () => {
    for (const data of Object.values(CHALLENGE_CASES).flat()) {
      const evidence = data.kind === 'logs' ? data.records : data.evidence;
      const ids = evidence.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
      if (data.kind === 'pivot') {
        for (const e of data.evidence) if (e.requires) expect(ids).toContain(e.requires);
        for (const c of data.candidates) for (const set of c.evidenceSets) for (const id of set) expect(ids).toContain(id);
      }
      if (data.kind === 'report') for (const set of data.evidenceSets) for (const id of set) expect(ids).toContain(id);
    }
  });
});
