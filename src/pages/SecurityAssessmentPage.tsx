import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EXAM_FORMS } from '../data/security/exams';
import { FOUNDATION_EXIT } from '../data/security/foundations';
import { finishLearningAttempt, startLearningAttempt, type ItemAnswer } from '../lib/securityLearning';
import { useSecurityLearning } from '../lib/useSecurityLearning';
import { useStore } from '../lib/store';
import { LearningFeedback, LearningItemInput, learningButton } from '../components/SecurityLearning';
import { PageTitle, Panel } from '../components/Bits';
export default function SecurityAssessmentPage() {
    const { id } = useParams();
    const form = [...EXAM_FORMS, FOUNDATION_EXIT].find(f => f.id === id);
    const snapshot = useSecurityLearning(s => s.snapshot);
    const update = useSecurityLearning(s => s.update);
    const storageError = useSecurityLearning(s => s.error);
    const setTrack = useStore(s => s.setTrack);
    const [index, setIndex] = useState(0);
    const [now, setNow] = useState(Date.now);
    const [confirmFinish, setConfirmFinish] = useState(false);
    const attempt = snapshot.attempts.filter(a => a.formId === id).at(-1);
    const active = attempt && attempt.finishedAt === undefined;
    useEffect(() => setTrack('secplus'), [setTrack]);
    useEffect(() => { if (!active)
        return; const tick = () => setNow(Date.now()); const timer = setInterval(tick, 1000); document.addEventListener('visibilitychange', tick); return () => { clearInterval(timer); document.removeEventListener('visibilitychange', tick); }; }, [active]);
    useEffect(() => { if (!attempt || !active || !form || now < attempt.deadline)
        return; update(s => ({ ...s, attempts: s.attempts.map(a => a.id === attempt.id ? finishLearningAttempt(a, form, now) : a) })); }, [attempt, active, form, now, update]);
    if (!form)
        return <Panel>Evaluación no encontrada. <Link to="/security/study?view=exam">Ver formas disponibles</Link></Panel>;
    const start = () => { const time = Date.now(); update(s => startLearningAttempt(s, form, time, crypto.randomUUID())); setNow(time); setIndex(0); setConfirmFinish(false); };
    const intro = <><p className="text-sm leading-7 text-slate-300">{form.id === 'foundation-exit' ? '24 situaciones de fundamentos en español. Objetivo: 80%.' : '90 elementos en inglés: 74 de respuesta única, 12 de selección múltiple y cuatro PBQs. Objetivo interno: 85% global, 80% por dominio y práctico, sin fallos críticos.'} La corrección aparece al entregar. El reloj continúa aunque cierres la página. Las respuestas se guardan en este dispositivo.</p><p className="mt-3 text-xs leading-relaxed text-slate-400">Puedes marcar y revisar antes de entregar. Consultar materiales o declarar ayuda impide que un simulacro cuente como evidencia nueva. Son casos originales incluidos en una web estática; no es una evaluación confidencial ni supervisada.</p></>;
    if (!attempt)
        return <div><PageTitle kicker="Evaluación independiente" title={form.title} sub={`${form.items.length} elementos · ${form.minutes} minutos`}/><Panel>{intro}<button className={`${learningButton} mt-5`} onClick={start}>Comenzar evaluación</button></Panel></div>;
    const selected = Math.min(index, form.items.length - 1);
    const item = form.items[selected];
    const answer = attempt.answers[item.id];
    const remaining = Math.max(0, Math.ceil((attempt.deadline - now) / 1000));
    const finished = attempt.finishedAt !== undefined;
    const locked = finished || Date.now() >= attempt.deadline;
    const change = (value: ItemAnswer) => update(s => ({ ...s, attempts: s.attempts.map(a => a.id === attempt.id && !a.finishedAt && Date.now() < a.deadline ? { ...a, answers: { ...a.answers, [item.id]: value } } : a) }));
    const help = () => update(s => ({ ...s, attempts: s.attempts.map(a => a.id === attempt.id ? { ...a, helps: [...new Set([...a.helps, 'declared-help'])] } : a) }));
    const flag = () => update(s => ({ ...s, attempts: s.attempts.map(a => a.id === attempt.id ? { ...a, flagged: a.flagged.includes(item.id) ? a.flagged.filter(x => x !== item.id) : [...a.flagged, item.id] } : a) }));
    const finish = () => update(s => ({ ...s, attempts: s.attempts.map(a => a.id === attempt.id ? finishLearningAttempt(a, form, Date.now()) : a) }));
    return <div><Link className="text-cyan-300 underline" to="/security/study?view=exam">← Evaluaciones y evidencias</Link><PageTitle kicker={finished ? 'Revisión explicada en español' : 'Evaluación en curso'} title={form.title} sub={finished ? `${Math.round(attempt.overall ?? 0)}% · ${attempt.exposedBefore ? 'repetición' : 'primera exposición'}${attempt.helps.length ? ' · con ayudas' : ''}${attempt.imported ? ' · importado como práctica' : ''}` : `${form.items.length} elementos · ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')} restantes`}/>
    {storageError ? <p className="mb-4 text-amber-200" role="alert">{storageError}</p> : null}
    {attempt.revision !== form.revision ? <Panel>El contenido de este intento pertenece a otra revisión. Su historial se conserva; comienza un intento de la versión actual para practicar.<button className={`${learningButton} ml-3`} onClick={start}>Nueva versión</button></Panel> : <>
    {finished ? <Panel className="mb-5"><div className="flex flex-wrap gap-4 text-sm text-slate-300">{Object.entries(attempt.domains ?? {}).map(([d, v]) => <p key={d}>Dominio {d}: <strong className="text-slate-100">{Math.round(v)}%</strong></p>)}{attempt.practical !== undefined ? <p>Práctico: <strong>{Math.round(attempt.practical)}%</strong></p> : null}</div><p className="mt-3 text-xs text-slate-400">Estos porcentajes describen este intento; no equivalen a puntos del examen oficial. Cada PBQ aporta un elemento normalizado y ofrece crédito parcial por criterios.</p><button className={`${learningButton} mt-4`} onClick={start}>Repetir para practicar</button></Panel> : <div className="sticky top-16 z-10 mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-cyan-500/40 bg-ink-950/95 p-3"><span className="font-mono text-lg text-cyan-200" aria-label="Tiempo restante">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span><span className="text-xs text-slate-400">{Object.keys(attempt.answers).length}/{form.items.length} con respuesta</span><button className={`${learningButton} ml-auto`} onClick={help}>{attempt.helps.length ? 'Ayuda registrada' : 'He consultado ayuda'}</button></div>}
    <details className="mb-5" open={finished}><summary className="cursor-pointer text-sm font-semibold text-cyan-200">{finished ? 'Revisar resultados por elemento' : 'Navegar y revisar preguntas marcadas'}</summary><nav aria-label="Elementos de la evaluación" className="mt-3 flex flex-wrap gap-2">{form.items.map((q, i) => <button key={q.id} className={`min-w-10 rounded-lg border px-2 py-2 text-xs ${i === selected ? 'border-cyan-300 bg-cyan-950 text-cyan-100' : attempt.flagged.includes(q.id) ? 'border-amber-400 text-amber-100' : 'border-ink-600 text-slate-300'}`} aria-label={`Elemento ${i + 1}${attempt.flagged.includes(q.id) ? ' marcado' : ''}${attempt.answers[q.id] ? ' respondido' : ''}`} aria-current={i === selected ? 'step' : undefined} onClick={() => { setIndex(i); setConfirmFinish(false); }}>{i + 1}{attempt.flagged.includes(q.id) ? ' ★' : attempt.answers[q.id] ? ' ·' : ''}</button>)}</nav></details>
    <Panel><div className="mb-4 flex items-center justify-between gap-4"><span className="font-mono text-xs text-cyan-400">{selected + 1}/{form.items.length} · {item.kind === 'pbq' ? 'PBQ' : item.kind === 'multiple' ? 'MULTIPLE SELECT' : 'SINGLE SELECT'}</span>{!finished ? <button className="text-xs text-amber-200 underline" onClick={flag}>{attempt.flagged.includes(item.id) ? 'Quitar marca' : 'Marcar para revisar'}</button> : null}</div><LearningItemInput key={`${attempt.id}-${item.id}`} item={item} answer={answer} onChange={change} disabled={locked} language={form.id === 'foundation-exit' ? 'es' : 'en'}/>{finished ? <LearningFeedback item={item} answer={answer}/> : null}</Panel>
    <div className="my-5 flex flex-wrap gap-3"><button className={learningButton} disabled={selected === 0} onClick={() => { setIndex(i => i - 1); setConfirmFinish(false); }}>Anterior</button><button className={learningButton} disabled={selected === form.items.length - 1} onClick={() => { setIndex(i => i + 1); setConfirmFinish(false); }}>Siguiente</button>{!finished ? <button className={`${learningButton} ml-auto`} onClick={() => setConfirmFinish(true)}>Preparar entrega</button> : null}</div>
    {confirmFinish && !finished ? <Panel className="border-amber-500/40"><p className="text-sm text-slate-300">Al entregar se revelará la corrección. Los elementos sin respuesta puntúan cero. Si has usado ayuda externa, regístrala antes de entregar.</p><div className="mt-4 flex flex-wrap gap-3"><button className={learningButton} onClick={help}>Registrar ayuda externa</button><button className={learningButton} onClick={finish}>Entregar y ver corrección</button><button className={learningButton} onClick={() => setConfirmFinish(false)}>Seguir revisando</button></div></Panel> : null}
    </>}
  </div>;
}
