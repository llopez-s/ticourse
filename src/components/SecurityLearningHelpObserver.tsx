import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSecurityLearning } from '../lib/useSecurityLearning';
/** Opening study material during a running mock is an observable use of help. */
export default function SecurityLearningHelpObserver() {
    const { pathname, search } = useLocation();
    const update = useSecurityLearning(s => s.update);
    useEffect(() => {
        const reading = /^\/(learn|quiz|lab|cards|glossary|search|security\/(foundation|practice))\b/.test(pathname) || pathname === '/security/study' && ['coverage', 'videos', 'foundations', 'practice'].includes(new URLSearchParams(search).get('view') ?? '');
        const otherAssessment = pathname.startsWith('/security/assessment/');
        if (!reading && !otherAssessment)
            return;
        const record=()=>{
        if(document.visibilityState==='hidden')return;
        const current = useSecurityLearning.getState().snapshot;
        const affected = (a: typeof current.attempts[number]) => a.formId.startsWith('form-') && a.finishedAt === undefined && Date.now() < a.deadline && (reading || otherAssessment && !pathname.endsWith(`/${a.formId}`));
        if (!current.attempts.some(a => affected(a) && !a.helps.includes('study-material')))
            return;
        update(s => ({ ...s, attempts: s.attempts.map(a => affected(a) ? { ...a, helps: [...new Set([...a.helps, 'study-material'])] } : a) }));
        };
        record();
        window.addEventListener('focus',record);
        document.addEventListener('visibilitychange',record);
        return ()=>{window.removeEventListener('focus',record);document.removeEventListener('visibilitychange',record);};
    }, [pathname, search, update]);
    return null;
}
