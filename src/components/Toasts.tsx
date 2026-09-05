import { useEffect } from 'react';
import { useToasts, type ToastMsg } from '../lib/store';

const STYLES: Record<ToastMsg['kind'], string> = {
  xp: 'border-cyan-500/40 bg-ink-900',
  level: 'border-fuchsia-500/50 bg-gradient-to-r from-ink-900 to-fuchsia-950',
  ach: 'border-amber-500/50 bg-gradient-to-r from-ink-900 to-amber-950',
  quest: 'border-emerald-500/50 bg-gradient-to-r from-ink-900 to-emerald-950',
  info: 'border-ink-600 bg-ink-900',
};

function Toast({ t, onDone }: { t: ToastMsg; onDone: () => void }) {
  useEffect(() => {
    const h = setTimeout(onDone, t.kind === 'xp' ? 2200 : 3800);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.ts]);

  if (t.kind === 'xp') {
    const amt = t.amount ?? 0;
    return (
      <div
        className={`animate-toast-in pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-lg ${STYLES.xp}`}
      >
        <span
          className={`font-mono text-lg font-bold ${amt >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
        >
          {amt >= 0 ? `+${amt}` : amt} XP
        </span>
        {t.sub && <span className="text-xs text-slate-400">{t.sub}</span>}
      </div>
    );
  }

  return (
    <div
      className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${STYLES[t.kind]}`}
    >
      {t.icon && <span className="text-xl leading-none">{t.icon}</span>}
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-100">{t.title}</div>
        {t.sub && <div className="mt-0.5 text-xs text-slate-400">{t.sub}</div>}
      </div>
    </div>
  );
}

export default function Toasts() {
  const list = useToasts((s) => s.list);
  const remove = useToasts((s) => s.remove);
  return (
    <div className="no-print pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 max-w-[90vw] flex-col gap-2">
      {list.map((t) => (
        <Toast key={t.id} t={t} onDone={() => remove(t.id)} />
      ))}
    </div>
  );
}
