import { useState } from 'react';
import BlockRenderer from '../BlockRenderer';
import NetDiagramView from './NetDiagramView';
import type { DossierDoc } from '../../lib/supuesto';

const ICON: Record<DossierDoc['kind'], string> = {
  memo: '📄', email: '✉️', table: '📊', diagram: '🗺️', config: '⚙️', log: '📜', norma: '⚖️', acta: '🗒️',
};
const KIND: Record<DossierDoc['kind'], string> = {
  memo: 'Memorándum', email: 'Correo', table: 'Tabla', diagram: 'Esquema', config: 'Configuración', log: 'Registro', norma: 'Norma', acta: 'Acta',
};

export const docIcon = (k: DossierDoc['kind']) => ICON[k];

const noop = () => {};

export default function Dossier({ docs, newIds }: { docs: DossierDoc[]; newIds: string[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = docs.find((d) => d.id === openId) ?? null;

  if (docs.length === 0) {
    return <p className="text-sm text-slate-400">El expediente todavía no tiene documentos.</p>;
  }

  return (
    <section aria-label="Expediente" className="rounded-xl border border-ink-700 bg-ink-900 p-3">
      <h3 className="mb-2 text-sm font-bold text-slate-100">Expediente ({docs.length})</h3>
      <ul className="space-y-1">
        {docs.map((d) => {
          const isNew = newIds.includes(d.id);
          const active = d.id === openId;
          return (
            <li key={d.id}>
              <button
                type="button"
                aria-expanded={active}
                aria-controls={'doc-' + d.id}
                onClick={() => setOpenId(active ? null : d.id)}
                className="flex w-full items-center gap-2 rounded-lg border border-ink-600 bg-ink-850 px-3 py-2 text-left text-sm text-slate-200 hover:border-cyan-400 focus-visible:outline-2 focus-visible:outline-cyan-400 aria-expanded:border-cyan-400 aria-expanded:bg-cyan-950/40"
              >
                <span aria-hidden="true">{ICON[d.kind]}</span>
                <span className="flex-1">
                  <span className="sr-only">{KIND[d.kind]}: </span>
                  {d.title}
                </span>
                {isNew && <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">nuevo</span>}
              </button>
              {active && open && (
                <div id={'doc-' + d.id} className="mt-2 rounded-lg border border-ink-700 bg-ink-950 p-3">
                  {open.body && <BlockRenderer blocks={open.body} rewardEnabled={false} onCheckAnswered={noop} />}
                  {open.diagram && <NetDiagramView diagram={open.diagram} title={open.title} />}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
