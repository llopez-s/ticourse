import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PRACTICE_CASES, FOUNDATION_PRACTICES } from '../data/security/practicals';
import { OBJECTIVE_PRACTICE } from '../data/security/objective-practice';
import { useStore } from '../lib/store';
import { useSecurityLearning } from '../lib/useSecurityLearning';
import { LearningPractice, learningButton } from '../components/SecurityLearning';
import { PageTitle, Panel } from '../components/Bits';
export default function SecurityPracticePage() {
    const { id } = useParams();
    const item = [...PRACTICE_CASES, ...FOUNDATION_PRACTICES, ...OBJECTIVE_PRACTICE].find(c => c.id === id);
    const setTrack = useStore(s => s.setTrack);
    const snapshot = useSecurityLearning(s => s.snapshot);
    useEffect(() => setTrack('secplus'), [setTrack]);
    if (!item)
        return <Panel>Práctica no encontrada. <Link to="/security/study?view=practice">Ver casos</Link></Panel>;
    return <div><Link className="text-cyan-300 underline" to="/security/study?view=practice">← Práctica autónoma</Link><PageTitle kicker={`Security+ · ${item.objective}`} title={item.kind === 'pbq' ? item.title.es : `Aplicación del objetivo ${item.objective}`} sub="Simulación sintética en el navegador. Elige una configuración y comprueba sus resultados. No modifica ningún equipo real."/><LearningPractice key={item.id} item={item}/><Panel><h2 className="font-semibold text-slate-100">Explica tu razonamiento</h2><p className="mt-2 text-sm text-slate-300">¿Qué evidencia usaste, qué alternativa descartaste y qué verificarías después? Este texto es reflexión personal y no recibe una calificación automática.</p><textarea aria-label="Mi razonamiento" className="mt-3 min-h-32 w-full rounded-lg border border-ink-600 bg-ink-950 p-3 text-slate-100" value={Array.isArray(snapshot.drafts[`${item.id}-reflection`]) ? (snapshot.drafts[`${item.id}-reflection`] as string[])[0] ?? '' : ''} onChange={e => useSecurityLearning.getState().update(s => ({ ...s, drafts: { ...s.drafts, [`${item.id}-reflection`]: [e.target.value] } }))}/><Link className={`${learningButton} mt-3 inline-block`} to="/security/study?view=workbook">Exportar mi trabajo</Link></Panel></div>;
}
