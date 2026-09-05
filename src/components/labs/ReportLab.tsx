import { useMemo, useState } from 'react';
import { REPORT } from '../../data/labs';
import { shuffle } from '../../lib/util';

function PickStep({
  title,
  options,
  onPassed,
}: {
  title: string;
  options: { label?: string; text?: string; good: boolean; why: string }[];
  onPassed: () => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const ok = pick !== null && options[pick].good;

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
      <div className="mb-3 text-sm font-semibold text-slate-100">{title}</div>
      <div className="space-y-2">
        {options.map((o, i) => {
          let cls = 'w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ';
          if (!checked) {
            cls +=
              pick === i
                ? 'border-cyan-400 bg-cyan-950/40 text-slate-100'
                : 'border-ink-600 bg-ink-850 text-slate-300 hover:bg-ink-800';
          } else if (o.good) {
            cls += 'border-emerald-500/50 bg-emerald-950/20 text-slate-100';
          } else if (pick === i) {
            cls += 'border-rose-500/50 bg-rose-950/20 text-slate-300';
          } else {
            cls += 'border-ink-700 bg-ink-900 text-slate-500';
          }
          return (
            <button
              key={i}
              disabled={checked && ok}
              onClick={() => {
                setPick(i);
                setChecked(false);
              }}
              className={cls}
            >
              <span className="leading-relaxed">{o.label ?? o.text}</span>
              {checked && (pick === i || o.good) && (
                <div className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {o.why}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {!(checked && ok) && (
        <button
          onClick={() => {
            setChecked(true);
            if (pick !== null && options[pick].good) onPassed();
          }}
          disabled={pick === null}
          className="mt-3 rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:bg-ink-700 disabled:text-slate-500"
        >
          Validar
        </button>
      )}
      {checked && ok && (
        <div className="mt-3 text-sm font-bold text-emerald-400">✓ Correcto</div>
      )}
    </div>
  );
}

function OrderStep({ onPassed }: { onPassed: () => void }) {
  const pool = useMemo(
    () => shuffle(REPORT.sections.map((_, i) => i), 'report-order'),
    [],
  );
  const [seq, setSeq] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const correct = seq.length === REPORT.sections.length && seq.every((s, p) => s === p);

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
      <div className="mb-3 text-sm font-semibold text-slate-100">
        2 · Ordena las secciones del informe
      </div>
      <div className="mb-3 space-y-1.5">
        {seq.map((sIdx, pos) => (
          <button
            key={sIdx}
            onClick={() => {
              setSeq((s) => s.filter((x) => x !== sIdx));
              setChecked(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
              checked
                ? sIdx === pos
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-100'
                  : 'border-rose-500/50 bg-rose-950/20 text-rose-100'
                : 'border-cyan-500/40 bg-cyan-950/20 text-slate-100'
            }`}
          >
            <span className="font-mono text-xs text-cyan-300">{pos + 1}.</span>
            <span className="flex-1">{REPORT.sections[sIdx].text}</span>
            {checked && sIdx === pos && (
              <span className="text-[10px] text-slate-500">
                {REPORT.sections[sIdx].detail}
              </span>
            )}
          </button>
        ))}
        {seq.length === 0 && (
          <div className="rounded-lg border border-dashed border-ink-600 p-3 text-center text-xs text-slate-500">
            Toca las secciones de abajo en orden (la primera arriba)
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pool
          .filter((i) => !seq.includes(i))
          .map((i) => (
            <button
              key={i}
              onClick={() => {
                setSeq((s) => [...s, i]);
                setChecked(false);
              }}
              className="rounded-lg border border-ink-600 bg-ink-850 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-400"
            >
              {REPORT.sections[i].text}
            </button>
          ))}
      </div>
      {!(checked && correct) ? (
        <button
          onClick={() => {
            setChecked(true);
            if (seq.length === REPORT.sections.length && seq.every((s, p) => s === p))
              onPassed();
          }}
          disabled={seq.length !== REPORT.sections.length}
          className="mt-3 rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-bold text-ink-950 hover:bg-cyan-400 disabled:bg-ink-700 disabled:text-slate-500"
        >
          Validar orden
        </button>
      ) : (
        <div className="mt-3 text-sm font-bold text-emerald-400">
          ✓ Estructura BLUF-first perfecta
        </div>
      )}
    </div>
  );
}

export default function ReportLab({ onComplete }: { onComplete: () => void }) {
  const [passed, setPassed] = useState<Set<string>>(new Set());

  const pass = (k: string, totalNeeded: number) => {
    setPassed((p) => {
      const n = new Set(p).add(k);
      if (n.size >= totalNeeded) onComplete();
      return n;
    });
  };

  // steps: bluf, order, f0..f2, tlp0..tlp1 → 7 total
  const TOTAL = 2 + REPORT.findings.length + REPORT.tlp.length;
  const done = passed.size >= TOTAL;

  return (
    <div className="space-y-4">
      <PickStep
        title="1 · Elige el BLUF del informe"
        options={REPORT.blufOptions}
        onPassed={() => pass('bluf', TOTAL)}
      />
      <OrderStep onPassed={() => pass('order', TOTAL)} />
      {REPORT.findings.map((f, i) => (
        <PickStep
          key={i}
          title={`${3 + i} · Asigna confianza — ${f.finding}`}
          options={f.options}
          onPassed={() => pass(`f${i}`, TOTAL)}
        />
      ))}
      {REPORT.tlp.map((t, i) => (
        <PickStep
          key={i}
          title={`${3 + REPORT.findings.length + i} · Marca TLP — ${t.product}`}
          options={t.options}
          onPassed={() => pass(`t${i}`, TOTAL)}
        />
      ))}

      <div className="text-xs text-slate-500">
        Pasos superados: {passed.size}/{TOTAL}
      </div>

      {done && (
        <div className="animate-pop-in rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-ink-900 to-emerald-950/40 p-6">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            Operación VELVET CICADA · Epílogo
          </div>
          <p className="text-sm leading-relaxed text-slate-200">
            {REPORT.epilogue}
          </p>
          <p className="mt-3 text-xs text-slate-400">
            ¿Lista para el cierre? El boss final de la S5 —{' '}
            <strong className="text-rose-300">VELVET CICADA</strong> en
            persona — te espera en Operation LAST WORD.
          </p>
        </div>
      )}
    </div>
  );
}
