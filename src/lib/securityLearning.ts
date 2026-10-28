// Security+ learning evidence is deliberately separate from legacy XP and sync.
export type LearningLanguage = 'es' | 'en';
export interface LearningText {
    es: string;
    en: string;
}
export interface Remediation {
    lessonId: string;
    videoId?: string;
    chapter?: number;
}
export interface LearningChoice {
    id: string;
    text: LearningText;
    why: LearningText;
}
export interface LearningQuestion {
    kind: 'single' | 'multiple';
    id: string;
    objective: string;
    domain: number;
    prompt: LearningText;
    choices: LearningChoice[];
    correct: string[];
    explain: LearningText;
    remediation: Remediation;
    level: 'understand' | 'apply' | 'analyze';
}
export interface PracticalCriterion {
    id: string;
    label: LearningText;
    options: LearningChoice[];
    accepted: string[];
    critical?: boolean;
    explain: LearningText;
}
export interface PracticalCase {
    kind: 'pbq';
    id: string;
    family: number;
    objective: string;
    domain: number;
    title: LearningText;
    prompt: LearningText;
    artifacts: string;
    criteria: PracticalCriterion[];
    remediation: Remediation;
}
export type AssessmentItem = LearningQuestion | PracticalCase;
export type ItemAnswer = string[] | Record<string, string>;
export interface AssessmentForm {
    id: string;
    revision: string;
    title: string;
    minutes: number;
    items: AssessmentItem[];
}
export interface ItemGrade {
    score: number;
    critical: boolean;
    criteria: {
        id: string;
        ok: boolean;
    }[];
}
export interface LearningAttempt {
    id: string;
    formId: string;
    revision: string;
    itemIds: string[];
    startedAt: number;
    deadline: number;
    finishedAt?: number;
    answers: Record<string, ItemAnswer>;
    flagged: string[];
    helps: string[];
    exposedBefore: boolean;
    imported?: boolean;
    scores?: Record<string, ItemGrade>;
    domains?: Record<string, number>;
    overall?: number;
    practical?: number;
}
export interface LearningSnapshot {
    version: 1;
    completed: string[];
    attempts: LearningAttempt[];
    seen: string[];
    practice: Record<string, {
        first: number;
        latest: number;
        helped: boolean;
    }>;
    drafts: Record<string, ItemAnswer>;
}
export const LEARNING_KEY = 'alertopolis-security-learning-v1';
export const LEARNING_REVISION = 'sy0-701-learning-2026-10-28-v1';
export const freshLearning = (): LearningSnapshot => ({ version: 1, completed: [], attempts: [], seen: [], practice: {}, drafts: {} });
/** Same-device tabs share provenance. Assistance and exposure must never be lost. */
export function mergeLocalLearning(current:LearningSnapshot,incoming:LearningSnapshot):LearningSnapshot {
    const attempts=new Map(current.attempts.map(a=>[a.id,a]));
    for(const next of incoming.attempts){
        const previous=attempts.get(next.id);
        if(!previous){attempts.set(next.id,next);continue;}
        const finished=next.finishedAt!==undefined?next:previous.finishedAt!==undefined?previous:next;
        attempts.set(next.id,{...previous,...next,...(finished.finishedAt!==undefined?finished:{}),
            helps:[...new Set([...previous.helps,...next.helps])],
            exposedBefore:previous.exposedBefore||next.exposedBefore,imported:previous.imported||next.imported});
    }
    return {...current,...incoming,completed:[...new Set([...current.completed,...incoming.completed])],
        seen:[...new Set([...current.seen,...incoming.seen])],attempts:[...attempts.values()],
        practice:{...current.practice,...incoming.practice},drafts:{...current.drafts,...incoming.drafts}};
}
export function gradeItem(item: AssessmentItem, answer: ItemAnswer | undefined): ItemGrade {
    if (item.kind !== 'pbq') {
        const selected = Array.isArray(answer) ? [...new Set(answer)].sort() : [];
        const correct = [...item.correct].sort();
        return { score: selected.length === correct.length && selected.every((x, i) => x === correct[i]) ? 100 : 0, critical: false, criteria: [] };
    }
    const values = answer && !Array.isArray(answer) ? answer : {};
    const criteria = item.criteria.map(c => ({ id: c.id, ok: c.accepted.includes(values[c.id]) }));
    return { score: 100 * criteria.filter(c => c.ok).length / Math.max(1, criteria.length),
        critical: item.criteria.some((c, i) => c.critical && !criteria[i].ok), criteria };
}
export function finishLearningAttempt(attempt: LearningAttempt, form: AssessmentForm, now: number): LearningAttempt {
    if (attempt.finishedAt !== undefined)
        return attempt;
    const scores = Object.fromEntries(form.items.map(i => [i.id, gradeItem(i, attempt.answers[i.id])]));
    const domains: Record<string, number> = {};
    for (const d of new Set(form.items.map(i => i.domain))) {
        const items = form.items.filter(i => i.domain === d);
        domains[d] = items.reduce((s, i) => s + scores[i.id].score, 0) / items.length;
    }
    const practical = form.items.filter(i => i.kind === 'pbq');
    return { ...attempt, finishedAt: Math.min(now, attempt.deadline), scores, domains,
        overall: form.items.reduce((s, i) => s + scores[i.id].score, 0) / Math.max(1, form.items.length),
        practical: practical.length ? practical.reduce((s, i) => s + scores[i.id].score, 0) / practical.length : undefined };
}
export function preparationEvidence(s: LearningSnapshot, now = Date.now()) {
    const day = 86400000;
    const fundamentals = s.attempts.some(a => a.formId === 'foundation-exit' && a.finishedAt !== undefined && (a.overall ?? 0) >= 80 && !a.imported);
    const qualifying = s.attempts.filter(a => /^form-[ABC]$/.test(a.formId) && a.revision === LEARNING_REVISION &&
        a.finishedAt !== undefined && a.finishedAt <= now && now - a.finishedAt <= 30 * day &&
        a.finishedAt >= a.startedAt && a.finishedAt <= a.deadline && a.itemIds.length === 90 && new Set(a.itemIds).size === 90 &&
        Object.keys(a.scores ?? {}).length === 90 && a.itemIds.every(id => Number.isFinite(a.scores?.[id]?.score)) &&
        !a.imported && !a.exposedBefore && a.helps.length === 0 && (a.overall ?? 0) >= 85 && (a.practical ?? 0) >= 80 &&
        [1, 2, 3, 4, 5].every(d => (a.domains?.[d] ?? 0) >= 80) && !Object.values(a.scores ?? {}).some(g => g.critical));
    const pair = qualifying.some(a => qualifying.some(b => a.formId !== b.formId && Math.abs(a.startedAt - b.startedAt) >= 7 * day));
    return { fundamentals, qualifying, ready: fundamentals && pair, exhausted: ['A', 'B', 'C'].every(f => s.attempts.some(a => a.formId === `form-${f}`)) };
}
export function startLearningAttempt(s: LearningSnapshot, form: AssessmentForm, now: number, id: string): LearningSnapshot {
    const active = s.attempts.find(a => a.formId === form.id && a.finishedAt === undefined);
    if (active && active.revision === form.revision)
        return s;
    const ids = form.items.map(i => i.id);
    const concurrent = s.attempts.some(a => a.finishedAt === undefined && a.deadline > now && a.formId !== form.id);
    const previous = s.attempts.map(a => a === active ? { ...a, finishedAt: Math.min(now, a.deadline) } : concurrent && a.finishedAt === undefined && a.deadline > now ? { ...a, helps: [...new Set([...a.helps, 'concurrent-assessment'])] } : a);
    return { ...s, seen: [...new Set([...s.seen, ...ids])], attempts: [...previous, {
                id, formId: form.id, revision: form.revision, itemIds: ids, startedAt: now, deadline: now + form.minutes * 60000,
                answers: {}, flagged: [], helps: concurrent ? ['concurrent-assessment'] : [], exposedBefore: ids.some(i => s.seen.includes(i)),
            }] };
}
export function importLearning(current: LearningSnapshot, raw: unknown): LearningSnapshot {
    if (!raw || typeof raw !== 'object')
        throw new Error('Fichero de aprendizaje no válido.');
    const value = raw as Partial<LearningSnapshot>;
    if (value.version !== 1 || !Array.isArray(value.completed) || !value.completed.every(x => typeof x === 'string') ||
        !Array.isArray(value.seen) || !value.seen.every(x => typeof x === 'string') || !Array.isArray(value.attempts) ||
        value.attempts.some(a => !a || typeof a.id !== 'string' || typeof a.formId !== 'string' || !Array.isArray(a.itemIds) ||
            !a.itemIds.every(x => typeof x === 'string') || !Number.isFinite(a.startedAt) || !Number.isFinite(a.deadline) ||
            a.deadline < a.startedAt || !a.answers || typeof a.answers !== 'object' || !Array.isArray(a.flagged) || !Array.isArray(a.helps) ||
            !a.flagged.every(x => typeof x === 'string') || !a.helps.every(x => typeof x === 'string') ||
            Object.values(a.answers).some(x => !validAnswer(x))))
        throw new Error('Formato de cuaderno no válido.');
    if (value.practice && (typeof value.practice !== 'object' || Object.values(value.practice).some(p => !p || !Number.isFinite(p.first) || !Number.isFinite(p.latest) || p.first < 0 || p.first > 100 || p.latest < 0 || p.latest > 100)))
        throw new Error('Resultados de práctica no válidos.');
    if (value.drafts && (typeof value.drafts !== 'object' || Object.values(value.drafts).some(x => !validAnswer(x))))
        throw new Error('Borradores no válidos.');
    const incoming = value.attempts.filter(a => !current.attempts.some(x => x.id === a.id)).map(a => ({ ...a, imported: true, finishedAt: a.finishedAt ?? a.deadline }));
    return { ...current, completed: [...new Set([...current.completed, ...value.completed])],
        seen: [...new Set([...current.seen, ...value.seen, ...incoming.flatMap(a => a.itemIds)])], attempts: [...current.attempts, ...incoming],
        drafts: { ...(value.drafts ?? {}), ...current.drafts }, practice: { ...Object.fromEntries(Object.entries(value.practice ?? {}).map(([id, p]) => [id, { ...p, helped: true }])), ...current.practice } };
}
function validAnswer(value: unknown): boolean {
    return Array.isArray(value) ? value.every(x => typeof x === 'string') : !!value && typeof value === 'object' && Object.values(value).every(x => typeof x === 'string');
}
