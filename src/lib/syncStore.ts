import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SyncStatus = 'off' | 'syncing' | 'ok' | 'error';

interface SyncState {
  /** The sync code in plain text. Stored here, never inside the progress blob. */
  code: string;
  status: SyncStatus;
  lastSyncedAt: string | null;
  error: string | null;
  setCode: (code: string) => void;
  disconnect: () => void;
  _set: (p: Partial<SyncState>) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      code: '',
      status: 'off',
      lastSyncedAt: null,
      error: null,
      setCode: (code) => set({ code: code.trim(), status: 'off', error: null }),
      disconnect: () =>
        set({ code: '', status: 'off', lastSyncedAt: null, error: null }),
      _set: (p) => set(p),
    }),
    {
      name: 'intelforge-sync',
      // status/error are runtime-only; only the code and the timestamp persist
      partialize: (s) => ({ code: s.code, lastSyncedAt: s.lastSyncedAt }),
    },
  ),
);
