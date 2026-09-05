import { useState } from 'react';
import { useSyncStore } from '../lib/syncStore';
import { syncEnabled, syncNow } from '../lib/useSync';
import { generateCode, isWeakCode } from '../lib/sync';
import { Panel } from './Bits';

const STATUS: Record<string, { dot: string; label: string }> = {
  off: { dot: 'bg-slate-500', label: 'Sin sincronizar' },
  syncing: { dot: 'bg-cyan-400 animate-pulse', label: 'Sincronizando…' },
  ok: { dot: 'bg-emerald-400', label: 'Sincronizado' },
  error: { dot: 'bg-rose-400', label: 'Error de sincronización' },
};

export default function SyncPanel() {
  const { code, status, lastSyncedAt, error, setCode, disconnect } = useSyncStore();
  const [draft, setDraft] = useState('');
  const [confirming, setConfirming] = useState(false);

  if (!syncEnabled()) {
    return (
      <Panel className="mb-5">
        <h2 className="mb-2 font-bold text-slate-100">🔄 Sincronización</h2>
        <p className="text-xs text-slate-400">
          No disponible en esta versión. Tu progreso se guarda solo en este
          navegador.
        </p>
      </Panel>
    );
  }

  const s = STATUS[status] ?? STATUS.off;

  return (
    <Panel className="mb-5">
      <h2 className="mb-2 font-bold text-slate-100">🔄 Sincronización</h2>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        Escribe el mismo código en cada dispositivo y tu progreso se combinará
        entre ellos. Tu navegador nunca envía el código: envía solo un hash
        SHA-256 de ese código. El servidor no ve el código, solo guarda tu
        progreso de estudio. Quien conozca el código puede leer y modificar ese
        progreso, así que trátalo como una contraseña.
      </p>

      {code ? (
        <>
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <span className="font-semibold text-slate-200">{s.label}</span>
            {lastSyncedAt && (
              <span className="font-mono text-[11px] text-slate-500">
                {new Date(lastSyncedAt).toLocaleString()}
              </span>
            )}
          </div>
          {error && <p className="mb-3 text-xs text-rose-300">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => void syncNow()}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400"
            >
              Sincronizar ahora
            </button>
            <button
              onClick={disconnect}
              className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-ink-800"
            >
              Desconectar
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-500">
            Desconectar borra el código de este navegador; tu progreso local se
            queda intacto.
          </p>
        </>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="tu-código-de-sincronización"
              aria-label="Código de sincronización"
              disabled={confirming}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-56 flex-1 rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 font-mono text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              onClick={() => setDraft(generateCode())}
              disabled={confirming}
              className="rounded-lg border border-ink-600 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Generar
            </button>
          </div>
          {draft.trim() !== '' && isWeakCode(draft) && (
            <p className="mb-2 text-xs text-amber-300">
              ⚠️ Código corto: quien lo adivine puede leer y sobrescribir tu
              progreso. Usa 16 caracteres o más, o pulsa «Generar».
            </p>
          )}
          {!confirming ? (
            <button
              disabled={draft.trim() === ''}
              onClick={() => setConfirming(true)}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
            >
              Conectar
            </button>
          ) : (
            <div className="rounded-lg border border-ink-600 bg-ink-850 p-3">
              <p className="mb-2 text-xs leading-relaxed text-slate-300">
                Se combinará el progreso de este navegador con el guardado en ese
                código. Si el código es nuevo, se creará con tu progreso actual.
                Guárdalo: sin él no podrás recuperar la sincronización.
              </p>
              <p className="mb-2 text-xs text-slate-300">
                Código: <span className="font-mono text-slate-100">{draft.trim()}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // No syncNow() here: setCode changes the store's `code`,
                    // which is useSync's effect dependency, so the effect
                    // re-runs and syncs. Calling it here too fired two
                    // concurrent syncs — two pulls and two pushes — on connect.
                    setCode(draft);
                    setConfirming(false);
                    setDraft('');
                  }}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-emerald-400"
                >
                  Conectar y sincronizar
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-ink-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}
