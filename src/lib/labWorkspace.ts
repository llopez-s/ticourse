/** Local workbooks are deliberately separate from the synced certification profile. */
export const LAB_STORAGE_PREFIX = 'alertopolis-labs-v1:';

export interface LabResult {
  step: string;
  title: string;
  passed: boolean;
  correct?: number;
  total?: number;
  mistakes: string[];
  at: string;
  assisted: boolean;
}

export interface LabStepHistory {
  first: LabResult;
  latest: LabResult;
  submissions: number;
}

export interface LabRun {
  startedAt: string;
  draft: Record<string, unknown>;
  results: Record<string, LabStepHistory>;
  revealed: string[];
  helpSeen: boolean;
}

export interface LabWorkspace {
  version: 1;
  identity: string;
  current: LabRun;
  history: LabRun[];
  saveFailed: boolean;
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
export type ResultInput = Omit<LabResult, 'at' | 'assisted'>;

const freshRun = (): LabRun => ({
  startedAt: new Date().toISOString(), draft: {}, results: {}, revealed: [], helpSeen: false,
});

// Sets are used by the existing lab engines. Preserve their type on reload.
export const encodeWorkspace = (value: unknown): string => JSON.stringify(value,
  (_key, item) => item instanceof Set ? { __labSet: [...item] } : item);

export function decodeWorkspace(raw: string | null, identity: string): LabWorkspace | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw, (_key, item) => item && typeof item === 'object'
      && Object.keys(item).length === 1 && Array.isArray(item.__labSet) ? new Set(item.__labSet) : item);
    const validRun = (run: LabRun) => run && typeof run.startedAt === 'string'
      && run.draft && typeof run.draft === 'object' && !Array.isArray(run.draft)
      && run.results && typeof run.results === 'object' && !Array.isArray(run.results)
      && Array.isArray(run.revealed) && run.revealed.every((id: unknown) => typeof id === 'string')
      && typeof run.helpSeen === 'boolean'
      && Object.values(run.results).every((entry) => entry && entry.first && entry.latest
        && typeof entry.submissions === 'number' && entry.submissions > 0
        && [entry.first, entry.latest].every((r) => typeof r.title === 'string'
          && typeof r.passed === 'boolean' && Array.isArray(r.mistakes)
          && r.mistakes.every((m: unknown) => typeof m === 'string')));
    return value?.version === 1 && value.identity === identity && validRun(value.current)
      && Array.isArray(value.history) && value.history.every(validRun)
      ? { ...value, history: value.history.slice(-10), saveFailed: false } : null;
  } catch { return null; }
}

export function browserLabStorage(): StorageLike | null {
  try { return typeof window === 'undefined' ? null : window.localStorage; }
  catch { return null; }
}

export type ClearableStorage = Pick<Storage, 'length' | 'key' | 'removeItem'>;

/** «Resetear progreso» clears the workbooks too: a restored finished run would show a lab as done without XP. */
export function clearLabWorkbooks(storage: ClearableStorage | null = browserLabStorage() as Storage | null): number {
  if (!storage) return 0;
  try {
    const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i))
      .filter((key): key is string => !!key?.startsWith(LAB_STORAGE_PREFIX));
    keys.forEach((key) => storage.removeItem(key));
    return keys.length;
  } catch { return 0; }
}

export function createLabSession(identity: string, storage: StorageLike | null = browserLabStorage()) {
  let restored: LabWorkspace | null = null;
  let readFailed = !storage;
  try { restored = decodeWorkspace(storage?.getItem(LAB_STORAGE_PREFIX + identity) ?? null, identity); }
  catch { readFailed = true; }
  let snapshot: LabWorkspace = restored ?? {
    version: 1, identity, current: freshRun(), history: [], saveFailed: readFailed,
  };
  const listeners = new Set<() => void>();
  const publish = (next: LabWorkspace) => {
    try {
      if (!storage) throw new Error('Storage unavailable');
      storage.setItem(LAB_STORAGE_PREFIX + identity, encodeWorkspace({ ...next, saveFailed: false }));
      snapshot = { ...next, saveFailed: false };
    } catch { snapshot = { ...next, saveFailed: true }; }
    listeners.forEach((listener) => listener());
  };
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    setDraft: (key: string, value: unknown) => publish({ ...snapshot,
      current: { ...snapshot.current, draft: { ...snapshot.current.draft, [key]: value } } }),
    record: (input: ResultInput, reveal = true) => {
      const run = snapshot.current;
      const result: LabResult = { ...input, at: new Date().toISOString(),
        assisted: run.helpSeen || run.revealed.includes(input.step) };
      const previous = run.results[input.step];
      publish({ ...snapshot, current: { ...run,
        results: { ...run.results, [input.step]: {
          first: previous?.first ?? result, latest: result, submissions: (previous?.submissions ?? 0) + 1,
        } },
        revealed: reveal ? [...new Set([...run.revealed, input.step])] : run.revealed,
      } });
    },
    revealHelp: () => publish({ ...snapshot, current: { ...snapshot.current, helpSeen: true } }),
    restart: () => {
      const run = snapshot.current;
      const used = Object.keys(run.draft).length > 0 || Object.keys(run.results).length > 0 || run.helpSeen;
      publish({ ...snapshot, current: freshRun(),
        history: used ? [...snapshot.history, run].slice(-10) : snapshot.history });
    },
  };
}

export type LabSession = ReturnType<typeof createLabSession>;

export function downloadLabFile(filename: string, content: string, type = 'application/json;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
