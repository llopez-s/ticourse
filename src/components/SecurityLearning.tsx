import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { gradeItem, preparationEvidence, type AssessmentItem, type ItemAnswer, type LearningLanguage } from '../lib/securityLearning';
import { useSecurityLearning } from '../lib/useSecurityLearning';
import { VIDEO_INVENTORY } from '../data/security/video-inventory';
import { VIDEO_LEARNING } from '../data/security/video-learning';
import { OBJECTIVE_PRACTICE } from '../data/security/objective-practice';
import { objectiveForLesson } from '../data/security/objectives';
import { Panel } from './Bits';
import { shuffle } from '../lib/util';
export const learningButton = 'rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-900/40 focus-visible:outline-2 focus-visible:outline-cyan-300 disabled:opacity-40';
export function LearningItemInput({ item, answer, onChange, language = 'es', disabled = false }: {
    item: AssessmentItem;
    answer?: ItemAnswer;
    onChange: (v: ItemAnswer) => void;
    language?: LearningLanguage;
    disabled?: boolean;
}) {
    if (item.kind === 'pbq') {
        const values = answer && !Array.isArray(answer) ? answer : {};
        return <fieldset disabled={disabled} className="space-y-4"><legend className="mb-3 text-base font-semibold text-slate-100">{item.prompt[language]}</legend>
      <pre className="overflow-x-auto rounded-lg border border-ink-600 bg-ink-950 p-4 text-xs leading-6 text-cyan-100">{item.artifacts}</pre>
      {item.criteria.map(c => <label key={c.id} className="block text-sm text-slate-200">{c.label[language]}
        <select aria-label={c.label[language]} className="mt-2 block w-full min-w-0 rounded-lg border border-ink-600 bg-ink-950 p-3 text-slate-100" value={values[c.id] ?? ''} onChange={e => onChange({ ...values, [c.id]: e.target.value })}>
          <option value="">{language === 'es' ? 'Selecciona una configuración' : 'Select a configuration'}</option>
          {shuffle(c.options, `${item.id}-${c.id}`).map(o => <option key={o.id} value={o.id}>{o.text[language]}</option>)}
        </select></label>)}
    </fieldset>;
    }
    const values = Array.isArray(answer) ? answer : [];
    return <fieldset disabled={disabled}><legend className="mb-3 text-base font-semibold leading-relaxed text-slate-100">{item.prompt[language]}</legend>
    <p className="mb-3 text-xs text-slate-400">{item.kind === 'multiple' ? (language === 'es' ? 'Selecciona todas las respuestas solicitadas.' : 'Select all requested answers.') : (language === 'es' ? 'Una respuesta correcta.' : 'Select one answer.')}</p>
    <div className="space-y-2">{item.choices.map(c => <label key={c.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${values.includes(c.id) ? 'border-cyan-400 bg-cyan-950/40 text-cyan-50' : 'border-ink-600 text-slate-300'}`}>
      <input className="mt-1 accent-cyan-400" type={item.kind === 'multiple' ? 'checkbox' : 'radio'} name={item.id} value={c.id} checked={values.includes(c.id)} onChange={() => onChange(item.kind === 'single' ? [c.id] : values.includes(c.id) ? values.filter(x => x !== c.id) : [...values, c.id])}/><span>{c.text[language]}</span>
    </label>)}</div>
  </fieldset>;
}
export function LearningFeedback({ item, answer }: {
    item: AssessmentItem;
    answer?: ItemAnswer;
}) {
    const grade = gradeItem(item, answer);
    return <div className="mt-4 rounded-lg border border-ink-600 bg-ink-950 p-4 text-sm" role="region" aria-label="Corrección explicada">
    <p className={`mb-3 font-bold ${grade.score >= 80 && !grade.critical ? 'text-emerald-300' : 'text-amber-200'}`}>{Math.round(grade.score)}%{grade.critical ? ' · criterio crítico pendiente' : ''}</p>
    {item.kind === 'pbq' ? item.criteria.map((c, i) => <p key={c.id} className="mb-2 text-slate-300">{grade.criteria[i].ok ? '✓' : '○'} {c.label.es}: {c.explain.es}</p>) : item.choices.map(c => <p key={c.id} className="mb-2 text-slate-300"><strong className={item.correct.includes(c.id) ? 'text-emerald-300' : 'text-slate-200'}>{item.correct.includes(c.id) ? '✓' : '○'} {c.text.es}:</strong> {c.why.es}</p>)}
    <RemediationLink item={item}/>
  </div>;
}
export function RemediationLink({ item }: {
    item: AssessmentItem;
}) {
    const r = item.remediation;
    const video = VIDEO_INVENTORY.find(v => v.id === r.videoId) || VIDEO_INVENTORY.find(v => v.lessonId === r.lessonId && v.status === 'integrated');
    const destination = r.lessonId.startsWith('f') ? `/security/foundation/${r.lessonId}` : `/learn/${r.lessonId}`;
    return <div className="mt-3 flex flex-wrap gap-3 text-xs"><Link className="text-cyan-300 underline" to={destination}>Repasar {r.lessonId} · objetivo {item.objective}</Link>
    {video ? <Link className="text-cyan-300 underline" to={`/learn/${video.lessonId}?video=${video.id}&start=${video.chapters[r.chapter ?? 0]?.start ?? 0}`}>Volver al vídeo: {video.chapters[r.chapter ?? 0]?.title ?? video.title}</Link> : null}
    <Link className="text-cyan-300 underline" to="/cards">Repaso espaciado</Link></div>;
}
export function LearningPractice({ item }: {
    item: AssessmentItem;
}) {
    const answer = useSecurityLearning(s => s.snapshot.drafts[item.id]);
    const previous = useSecurityLearning(s => s.snapshot.practice[item.id]);
    const update = useSecurityLearning(s => s.update);
    const error = useSecurityLearning(s => s.error);
    const [checked, setChecked] = useState(!!previous);
    const [language, setLanguage] = useState<LearningLanguage>('es');
    const change = (value: ItemAnswer) => { setChecked(false); update(s => ({ ...s, drafts: { ...s.drafts, [item.id]: value } })); };
    const submit = () => { const grade = gradeItem(item, answer); update(s => ({ ...s, seen: [...new Set([...s.seen, item.id])], practice: { ...s.practice, [item.id]: { first: s.practice[item.id]?.first ?? grade.score, latest: grade.score, helped: !!s.practice[item.id] || !!s.practice[item.id]?.helped } } })); setChecked(true); };
    return <Panel className="my-4"><div className="mb-4 flex items-center justify-between gap-3"><span className="font-mono text-xs text-cyan-400">PRÁCTICA · {item.objective}</span><label className="text-xs text-slate-300">Idioma <select value={language} onChange={e => setLanguage(e.target.value as LearningLanguage)} className="rounded border border-ink-600 bg-ink-950 p-1"><option value="es">Español</option>{item.prompt.en !== item.prompt.es ? <option value="en">English</option> : null}</select></label></div>
    <LearningItemInput item={item} answer={answer} onChange={change} language={language}/>
    <button className={`${learningButton} mt-4`} onClick={submit}>Comprobar mi decisión</button>
    {previous ? <p className="mt-2 text-xs text-slate-400">Primer resultado: {Math.round(previous.first)}% · Último: {Math.round(previous.latest)}%{previous.helped ? ' · corregido con feedback' : ''}</p> : null}
    {error ? <p role="alert" className="mt-3 text-sm text-amber-200">{error}</p> : null}
    {checked ? <LearningFeedback item={item} answer={answer}/> : null}
  </Panel>;
}
export function SecurityVideoStudy({ videoId, children }: {
    videoId: string;
    children: ReactNode;
}) {
    const data = VIDEO_LEARNING.find(v => v.videoId === videoId);
    const video = VIDEO_INVENTORY.find(v => v.id === videoId);
    if (!data || !video)
        return <>{children}</>;
    return <section className="my-6 scroll-mt-24 rounded-xl border border-cyan-500/30 bg-ink-900/50 p-4" aria-label={`Aprender con ${video.title}`}>
    <div className="font-mono text-xs uppercase tracking-widest text-cyan-400">Mira · decide · aplica</div>
    <p className="mt-3 text-sm leading-relaxed text-slate-200">{data.guidingQuestion}</p>
    <p className="mt-2 text-xs text-slate-400">Objetivos: {data.objectives.length ? data.objectives.join(', ') : 'Preparación final · estrategia del curso'}. Antes de empezar: {data.prerequisites.map((id, i) => <span key={id}>{i ? ', ' : ''}<Link className="text-cyan-300 underline" to={`/security/foundation/${id}`}>{id}</Link></span>)}.</p>
    {children}
    <nav aria-label={`Capítulos de ${video.title}`} className="my-4 flex flex-wrap gap-2">{video.chapters.map(c => <Link key={c.start} className="rounded border border-ink-600 px-3 py-2 text-xs text-cyan-200 hover:bg-ink-800" to={`/learn/${video.lessonId}?video=${video.id}&start=${c.start}`}>{Math.floor(c.start / 60)}:{String(c.start % 60).padStart(2, '0')} · {c.title}</Link>)}</nav>
    <p className="text-xs text-slate-400">Puedes usar el vídeo o su transcripción. Comprueba después lo aprendido en un contexto distinto.</p>
    {data.activities.map(q => <LearningPractice key={q.id} item={q}/>)}
    <Link className={learningButton} to={!data.objectives.length ? '/security/study?view=exam' : objectiveForLesson(video.lessonId).some(o => o.family) ? `/security/practice/practice-${objectiveForLesson(video.lessonId).find(o => o.family)!.family}-a` : `/security/practice/objective-practice-${data.objectives[0]}`}>Aplicar en una práctica autónoma</Link>
  </section>;
}
export function SecurityEvidencePanel() {
    const snapshot = useSecurityLearning(s => s.snapshot);
    const evidence = preparationEvidence(snapshot);
    return <Panel className="my-5 border-cyan-500/30"><div className="font-mono text-xs uppercase tracking-widest text-cyan-400">Evidencias de preparación · Security+</div>
    <h2 className="mt-2 text-lg font-bold text-slate-100">{evidence.ready ? 'Criterios internos alcanzados' : 'Construye una preparación comprobable'}</h2>
    <p className="mt-2 text-sm leading-relaxed text-slate-300">Fundamentos: {evidence.fundamentals ? 'superados' : 'pendientes'} · Formas recientes sin ayudas: {evidence.qualifying.length}. Se requieren dos formas distintas, separadas siete días, en los últimos 30 días.</p>
    <p className="mt-2 text-xs text-slate-400">85% global, 80% por dominio y práctico; sin fallos críticos. Umbrales provisionales del curso, sin equivalencia con la puntuación oficial. Evidencias guardadas en este dispositivo.</p>
    {evidence.exhausted && !evidence.ready ? <p className="mt-2 text-sm text-amber-200">Ya has abierto las tres formas. Repetir sirve para practicar; necesitarás casos nuevos o validación externa para obtener evidencia nueva.</p> : null}
    <div className="mt-4 flex flex-wrap gap-3"><Link className={learningButton} to="/security/study">Recorrido de 24 semanas</Link><Link className={learningButton} to="/security/study?view=exam">Simulacros independientes</Link></div>
  </Panel>;
}
export function SecurityLessonApplication({ lessonId }: {
    lessonId: string;
}) {
    if (!lessonId.startsWith('sp') || lessonId.startsWith('sp6'))
        return null;
    const objectives = objectiveForLesson(lessonId);
    return <section className="my-7" aria-label="Aplicar sin ayuda"><h2 className="text-lg font-bold text-slate-100">Aplica lo aprendido a otra situación</h2><p className="mt-2 text-sm text-slate-400">Resuelve antes de consultar la corrección. Estas actividades son entrenamiento y no forman parte de los simulacros.</p>{objectives.map(o => { const q = OBJECTIVE_PRACTICE.find(q => q.objective === o.id); return q ? <LearningPractice key={q.id} item={q}/> : null; })}</section>;
}
