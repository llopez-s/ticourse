import { create } from 'zustand';
import { freshLearning, importLearning, mergeLocalLearning, LEARNING_KEY, type LearningSnapshot } from './securityLearning';
function restore(): LearningSnapshot {
    try {
        const raw = localStorage.getItem(LEARNING_KEY);
        if (!raw)
            return freshLearning();
        const parsed = JSON.parse(raw) as LearningSnapshot;
        importLearning(freshLearning(), parsed); // Validate structure without changing local provenance.
        return { ...freshLearning(), ...parsed };
    }
    catch {
        return freshLearning();
    }
}
interface LearningStore {
    snapshot: LearningSnapshot;
    error: string;
    update: (fn: (s: LearningSnapshot) => LearningSnapshot) => void;
    importFile: (raw: unknown) => void;
}
export const useSecurityLearning = create<LearningStore>((set, get) => ({
    snapshot: restore(), error: '',
    update: (fn) => {
        const snapshot = fn(mergeLocalLearning(get().snapshot,restore()));
        let error = '';
        try {
            localStorage.setItem(LEARNING_KEY, JSON.stringify(snapshot));
        }
        catch {
            error = 'No se pudo guardar el cuaderno. Puedes continuar en memoria y exportarlo antes de salir.';
        }
        set({ snapshot, error });
    },
    importFile: (raw) => get().update(s => importLearning(s, raw)),
}));
if(typeof window!=='undefined')window.addEventListener('storage',event=>{
    if(event.key!==LEARNING_KEY||!event.newValue)return;
    try {
        const incoming=JSON.parse(event.newValue) as LearningSnapshot;
        importLearning(freshLearning(),incoming);
        useSecurityLearning.setState(s=>({snapshot:mergeLocalLearning(s.snapshot,incoming)}));
    }catch { /* Ignore invalid foreign writes; preserve the in-memory workbook. */ }
});
