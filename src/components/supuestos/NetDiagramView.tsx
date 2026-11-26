import type { NetDiagram } from '../../lib/supuesto';
import { NODE_H, NODE_W, describeDiagram, linkSegments } from './netDiagram';

const GLYPH: Record<string, string> = {
  router: '⟲', switch: '⇄', l3switch: '⇄', firewall: '🛡', server: '▤', pc: '🖥', ap: '📶', cloud: '☁',
};

export default function NetDiagramView({ diagram, title }: { diagram: NetDiagram; title: string }) {
  const segs = linkSegments(diagram);
  const text = describeDiagram(diagram);
  return (
    <figure className="my-3">
      <div className="overflow-x-auto rounded-xl border border-ink-700 bg-ink-950 p-2">
        <svg
          role="img"
          aria-label={'Esquema de red: ' + title}
          viewBox={'0 0 ' + diagram.width + ' ' + diagram.height}
          width={diagram.width}
          height={diagram.height}
          className="mx-auto max-w-none"
        >
          {diagram.zones?.map((z, i) => (
            <g key={i}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={10} fill="none" stroke="#475569" strokeDasharray="6 4" />
              <text x={z.x + 8} y={z.y + 16} fontSize={11} fill="#94a3b8">{z.label}</text>
            </g>
          ))}
          {segs.map((s, i) => (
            <g key={i}>
              <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#64748b" strokeWidth={1.5} />
              {s.label && (
                <text x={s.mx} y={s.my - 4} fontSize={10} textAnchor="middle" fill="#a5f3fc" stroke="#020617" strokeWidth={3} paintOrder="stroke">{s.label}</text>
              )}
            </g>
          ))}
          {diagram.nodes.map((n) => (
            <g key={n.id}>
              <rect x={n.x - NODE_W / 2} y={n.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx={8} fill="#0f172a" stroke="#22d3ee" strokeWidth={1.2} />
              <text x={n.x - NODE_W / 2 + 8} y={n.y + 5} fontSize={15} fill="#67e8f9">{GLYPH[n.kind] ?? '■'}</text>
              <text x={n.x + 8} y={n.sub ? n.y - 3 : n.y + 4} fontSize={11} fontWeight={600} textAnchor="middle" fill="#e2e8f0">{n.label}</text>
              {n.sub && <text x={n.x + 8} y={n.y + 12} fontSize={9} textAnchor="middle" fill="#94a3b8">{n.sub}</text>}
            </g>
          ))}
        </svg>
      </div>
      <details className="mt-2 text-sm text-slate-300">
        <summary className="cursor-pointer text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400">Ver el esquema como texto</summary>
        <p className="mt-2 font-semibold text-slate-200">Equipos</p>
        <ul className="list-disc pl-5">{text.nodes.map((t, i) => <li key={i}>{t}</li>)}</ul>
        <p className="mt-2 font-semibold text-slate-200">Enlaces</p>
        <ul className="list-disc pl-5">{text.links.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </details>
    </figure>
  );
}
