import { useState } from 'react';
import { PIVOT, type PivotNode } from '../../data/labs';
import { Bar } from '../Bits';

const TYPE_ICON: Record<PivotNode['type'], string> = {
  domain: '🌐',
  ip: '📡',
  email: '✉️',
  cert: '🔐',
  ns: '🧭',
  host: '💻',
};

function NodeView({
  id,
  expanded,
  onExpand,
  canExpand,
  depth,
}: {
  id: string;
  expanded: Set<string>;
  onExpand: (id: string) => void;
  canExpand: boolean;
  depth: number;
}) {
  const node = PIVOT.nodes[id];
  const isOpen = expanded.has(id) || node.verdict === 'start';

  const verdictCls =
    node.verdict === 'asset'
      ? 'border-emerald-500/60 bg-emerald-950/30'
      : node.verdict === 'noise'
        ? 'border-amber-600/40 bg-amber-950/20'
        : node.verdict === 'benign'
          ? 'border-slate-600/40 bg-ink-850'
          : 'border-cyan-500/30 bg-ink-900';

  return (
    <div className={depth > 0 ? 'ml-4 border-l border-ink-700 pl-3' : ''}>
      <div
        className={`my-2 rounded-xl border p-3 ${isOpen ? verdictCls : 'border-ink-600 bg-ink-900'}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span>{TYPE_ICON[node.type]}</span>
          <span className="font-mono text-xs font-semibold text-slate-100">
            {node.label}
          </span>
          {isOpen && node.verdict === 'asset' && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-ink-950">
              🎯 ACTIVO
            </span>
          )}
          {isOpen && node.verdict === 'noise' && (
            <span className="rounded-full bg-amber-600/80 px-2 py-0.5 text-[10px] font-bold text-ink-950">
              ruido
            </span>
          )}
          {isOpen && node.verdict === 'benign' && (
            <span className="rounded-full bg-slate-600 px-2 py-0.5 text-[10px] font-bold text-slate-100">
              benigno
            </span>
          )}
          {!isOpen && (
            <button
              onClick={() => onExpand(id)}
              disabled={!canExpand}
              className="ml-auto rounded-lg bg-cyan-500 px-3 py-1 text-xs font-bold text-ink-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
            >
              Pivotar (1 query)
            </button>
          )}
        </div>
        {isOpen && (
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            {node.note}
          </p>
        )}
      </div>
      {isOpen &&
        node.children.map((cid) => (
          <NodeView
            key={cid}
            id={cid}
            expanded={expanded}
            onExpand={onExpand}
            canExpand={canExpand}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}

export default function PivotLab({ onComplete }: { onComplete: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [queries, setQueries] = useState(0);
  const [finished, setFinished] = useState(false);

  const assetsFound = [...expanded].filter(
    (id) => PIVOT.nodes[id].verdict === 'asset',
  ).length;
  const budgetLeft = PIVOT.budget - queries;
  const failed = budgetLeft <= 0 && assetsFound < PIVOT.assetsNeeded;

  const expand = (id: string) => {
    if (finished || failed || expanded.has(id)) return;
    const next = new Set(expanded).add(id);
    setExpanded(next);
    const q = queries + 1;
    setQueries(q);
    const found = [...next].filter(
      (n) => PIVOT.nodes[n].verdict === 'asset',
    ).length;
    if (found >= PIVOT.assetsNeeded) {
      setFinished(true);
      onComplete();
    }
  };

  const reset = () => {
    setExpanded(new Set());
    setQueries(0);
    setFinished(false);
  };

  return (
    <div>
      {/* HUD */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-ink-700 bg-ink-900 p-3">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-400">Presupuesto de queries</span>
            <span
              className={`font-mono font-bold ${budgetLeft <= 3 ? 'text-rose-400' : 'text-slate-200'}`}
            >
              {budgetLeft}/{PIVOT.budget}
            </span>
          </div>
          <Bar
            value={(budgetLeft / PIVOT.budget) * 100}
            color={budgetLeft <= 3 ? 'bg-rose-400' : 'bg-cyan-400'}
          />
        </div>
        <div className="rounded-xl border border-ink-700 bg-ink-900 p-3">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-400">Activos del actor</span>
            <span className="font-mono font-bold text-emerald-300">
              {assetsFound}/{PIVOT.assetsNeeded}
            </span>
          </div>
          <Bar
            value={(assetsFound / PIVOT.assetsNeeded) * 100}
            color="bg-emerald-400"
          />
        </div>
      </div>

      {finished && (
        <div className="animate-pop-in mb-4 rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4">
          <div className="font-bold text-emerald-300">
            🎯 Grafo mapeado — lab completado con {queries} queries
            {queries <= PIVOT.parBudget && ' · ¡pivoteo de élite! 🏅'}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            Cuatro activos confirmados partiendo de un solo dominio: email de
            registro → persona corporativa y segundo objetivo del sector; VPS
            dedicado → segundo dominio de phishing; certificado autofirmado →
            el C2. Así se expande el vértice Infrastructure del diamante.
          </p>
        </div>
      )}
      {failed && (
        <div className="mb-4 rounded-xl border border-rose-500/50 bg-rose-950/30 p-4">
          <div className="font-bold text-rose-300">
            ⛽ Presupuesto agotado ({assetsFound}/{PIVOT.assetsNeeded} activos)
          </div>
          <p className="mt-1 text-xs text-slate-300">
            En producción, cada pivote cuesta tiempo o dinero. Pista: los
            recursos <em>dedicados</em> (emails de registro, VPS con pocos
            inquilinos, certificados autofirmados) discriminan; los compartidos
            (NS genéricos, shared hosting) queman queries.
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-lg bg-rose-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-rose-400"
          >
            ↻ Reiniciar la caza
          </button>
        </div>
      )}

      <NodeView
        id={PIVOT.startId}
        expanded={expanded}
        onExpand={expand}
        canExpand={!finished && !failed && budgetLeft > 0}
        depth={0}
      />
    </div>
  );
}
