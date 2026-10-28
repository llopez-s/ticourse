import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FOUNDATIONS } from '../data/security/foundations';
import { useStore } from '../lib/store';
import { useSecurityLearning } from '../lib/useSecurityLearning';
import { PageTitle, Panel } from '../components/Bits';
import { learningButton } from '../components/SecurityLearning';
export default function SecurityFoundationPage() {
    const { id } = useParams();
    const f = FOUNDATIONS.find(x => x.id === id);
    const setTrack = useStore(s => s.setTrack);
    const snapshot = useSecurityLearning(s => s.snapshot);
    const update = useSecurityLearning(s => s.update);
    useEffect(() => setTrack('secplus'), [setTrack]);
    if (!f)
        return <Panel>Fundamento no encontrado. <Link to="/security/study?view=foundations">Volver al índice</Link></Panel>;
    const index = FOUNDATIONS.indexOf(f);
    const next = FOUNDATIONS[index + 1];
    return <article className="mx-auto max-w-3xl"><Link className="text-sm text-cyan-300 underline" to="/security/study?view=foundations">← Fundamentos</Link><PageTitle kicker={`Antes de Security+ · ${index + 1}/12`} title={f.title} sub="Lectura, ejemplo y aplicación. Puedes avanzar libremente y volver a repasar."/><Panel><h2 className="font-semibold text-slate-100">Qué aprenderás</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">{f.goals.map(g => <li key={g}>{g}</li>)}</ul></Panel><div className="my-6 flex flex-wrap gap-2">{f.terms.map(t => <span key={t} className="rounded border border-ink-600 px-3 py-2 text-xs text-cyan-200">{t}</span>)}</div>{f.paragraphs.map(p => <p className="my-5 leading-8 text-slate-300" key={p}>{p}</p>)}<Panel><h2 className="font-semibold text-slate-100">Ejemplo resuelto</h2><p className="mt-3 leading-7 text-slate-300">{f.example}</p></Panel><Panel className="my-5 border-amber-600/40"><h2 className="font-semibold text-amber-200">Error que conviene evitar</h2><p className="mt-2 text-sm text-slate-300">{f.pitfall}</p></Panel><div className="flex flex-wrap gap-3"><button className={learningButton} onClick={() => update(s => ({ ...s, completed: [...new Set([...s.completed, f.id])] }))}>{snapshot.completed.includes(f.id) ? '✓ Lectura estudiada' : 'Marcar lectura estudiada'}</button><Link className={learningButton} to="/security/study?view=practice&foundation=1">Aplicar en una práctica</Link><Link className={learningButton} to={next ? `/security/foundation/${next.id}` : '/security/assessment/foundation-exit'}>{next ? 'Siguiente fundamento' : 'Evaluación de salida'}</Link></div><p className="mt-4 text-xs text-slate-400">La marca de lectura registra progreso. La evidencia de fundamentos se obtiene con la evaluación de salida.</p></article>;
}
