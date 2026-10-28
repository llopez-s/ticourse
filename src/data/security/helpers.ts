import type { LearningQuestion, LearningText, Remediation } from '../../lib/securityLearning';
export const text = (es: string, en = es): LearningText => ({ es, en });
export type Option = [string, string, string, string?];
/** Options are authored in semantic order; rotate the key deterministically, never by length. */
export function question(id: string, objective: string, domain: number, prompt: LearningText,
  options: Option[], answers: number[], remediation: Remediation, level: LearningQuestion['level'] = 'apply'): LearningQuestion {
  const choices = options.map((o, i) => ({ id: `${id}-o${i}`, text: text(o[0], o[1]), why: text(o[2], o[3] ?? o[2]) }));
  const offset = [...id].reduce((s, c) => s + c.charCodeAt(0), 0) % choices.length;
  return { kind: answers.length > 1 ? 'multiple' : 'single', id, objective, domain, prompt,
    choices: [...choices.slice(offset), ...choices.slice(0, offset)], correct: answers.map(i => `${id}-o${i}`),
    explain: choices[answers[0]].why, remediation, level };
}
