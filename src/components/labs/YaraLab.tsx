import { useState } from 'react';
import { YARA } from '../../data/labs';

type Cond = 'any' | 'two' | 'all';

const COND_LABEL: Record<Cond, string> = {
  any: 'any of them',
  two: '2 of them',
  all: 'all of them',
};

export default function YaraLab({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [cond, setCond] = useState<Cond>('two');
  const [tested, setTested] = useState(false);

  const toggle = (id: string) => {
    setTested(false);
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const threshold =
    cond === 'any' ? 1 : cond === 'two' ? 2 : Math.max(selected.size, 1);
  const valid =
    selected.size >= 1 && (cond !== 'two' || selected.size >= 2);

  const results = YARA.samples.map((sample) => {
    const hits = [...selected].filter((id) => sample.contains.includes(id));
    const match = valid && hits.length >= threshold;
    const ok = match === sample.malicious;
    return { sample, hits, match, ok };
  });
  const success = tested && valid && results.every((r) => r.ok);
  const rareSelected = [...selected].filter(
    (id) => YARA.strings.find((s) => s.id === id)?.rarity === 'rare',
  ).length;
  const robust = success && rareSelected >= 2 && cond === 'two';

  const test = () => {
    setTested(true);
    const allOk =
      valid &&
      YARA.samples.every((sample) => {
        const hits = [...selected].filter((id) =>
          sample.contains.includes(id),
        );
        return (hits.length >= threshold) === sample.malicious;
      });
    if (allOk) onComplete();
  };

  return (
    <div>
      <p className="mb-4 text-sm text-slate-300">
        Strings extraídos de <code className="font-mono text-cyan-300">VC_Loader_v1.dll</code>.
        Elige los strings y la condición de tu regla; luego pruébala contra el
        corpus: debe detectar <strong className="text-slate-100">ambas variantes</strong> con{' '}
        <strong className="text-slate-100">cero falsos positivos</strong>.
      </p>

      {/* strings dump */}
      <div className="mb-4 space-y-2">
        {YARA.strings.map((s) => {
          const on = selected.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                on
                  ? 'border-cyan-400 bg-cyan-950/30'
                  : 'border-ink-700 bg-ink-900 hover:border-ink-500'
              }`}
            >
              <span className="mt-0.5 font-mono text-xs">{on ? '☑️' : '◻️'}</span>
              <div className="min-w-0 flex-1">
                <code className="block break-all font-mono text-xs text-slate-100">
                  ${s.id} = {s.kind === 'hex' ? s.text : `"${s.text}"`}
                </code>
                <span
                  className={`text-[10px] font-semibold ${s.rarity === 'rare' ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {s.rarity === 'rare' ? '◆ raro' : '◇ común'}
                </span>{' '}
                <span className="text-[10px] text-slate-500">{s.note}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* condition + rule preview */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">condition:</span>
        {(['any', 'two', 'all'] as Cond[]).map((c) => (
          <button
            key={c}
            onClick={() => {
              setCond(c);
              setTested(false);
            }}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-bold ${
              cond === c
                ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200'
                : 'border-ink-600 bg-ink-850 text-slate-400 hover:bg-ink-800'
            }`}
          >
            {COND_LABEL[c]}
          </button>
        ))}
      </div>

      <pre className="mb-4 overflow-x-auto rounded-xl border border-ink-700 bg-ink-950 p-4 font-mono text-xs leading-relaxed text-slate-300">
{`rule VELVET_CICADA_Loader {
  meta:
    author = "tú, analista de Meridian"
    family = "VC_Loader"
  strings:
${[...selected].map((id) => `    $${id} = ${YARA.strings.find((s) => s.id === id)!.kind === 'hex' ? YARA.strings.find((s) => s.id === id)!.text : `"${YARA.strings.find((s) => s.id === id)!.text}"`}`).join('\n') || '    // selecciona strings arriba'}
  condition:
    ${selected.size === 0 ? '/* vacía */' : COND_LABEL[cond]}
}`}
      </pre>

      {!valid && selected.size > 0 && (
        <div className="mb-3 text-xs text-amber-300">
          ⚠️ Con "2 of them" necesitas al menos 2 strings seleccionados.
        </div>
      )}

      <button
        onClick={test}
        disabled={selected.size === 0}
        className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
      >
        ▶ Ejecutar contra el corpus
      </button>

      {tested && (
        <div className="mt-4 space-y-2">
          {results.map(({ sample, hits, match, ok }) => (
            <div
              key={sample.id}
              className={`rounded-xl border p-3 text-sm ${
                ok
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-rose-500/50 bg-rose-950/20'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span>{ok ? '✅' : '❌'}</span>
                <code className="font-mono text-xs text-slate-100">
                  {sample.name}
                </code>
                <span className="text-[10px] text-slate-500">
                  ({sample.malicious ? 'malicioso' : 'benigno'})
                </span>
                <span
                  className={`ml-auto font-mono text-xs font-bold ${match ? 'text-amber-300' : 'text-slate-500'}`}
                >
                  {match ? 'MATCH' : 'no match'}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {sample.desc} — strings presentes: {hits.length}/{selected.size}
                {!ok && sample.malicious && ' · 🔻 variante NO detectada'}
                {!ok && !sample.malicious && ' · 🔺 FALSO POSITIVO'}
              </div>
            </div>
          ))}

          {success && (
            <div className="animate-pop-in rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4">
              <div className="font-bold text-emerald-300">
                📜 Regla operativa — lab completado
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {robust
                  ? '🏅 Y además robusta: combinación de strings raros con "2 of them" — cubre variantes sin falsos positivos. Así se escribe YARA de producción.'
                  : selected.size === 1
                    ? 'Funciona… pero con un solo string es frágil: si el actor lo renombra, pierdes la familia entera. En producción, cubre con combinaciones: "2 of" strings raros.'
                    : 'Funciona. Para máxima robustez: solo strings raros e independientes, condición "2 of them".'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
