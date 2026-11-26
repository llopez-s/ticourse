import { Link } from 'react-router-dom';
import { useTrack } from '../components/Layout';
import { PageTitle } from '../components/Bits';
import SupuestoCard from '../components/supuestos/SupuestoCard';
import { sectionsOf, supuestosOf } from '../data/course';

export default function SupuestosPage() {
  const track = useTrack();
  const groups = sectionsOf(track.id)
    .map((sec) => ({ sec, items: supuestosOf(sec.id) }))
    .filter((g) => g.items.length > 0);
  const integrators = track.supuestos.filter((m) => m.integrator);

  if (track.supuestos.length === 0) {
    return (
      <div>
        <PageTitle kicker="Práctica" title="🗂️ Supuestos prácticos" />
        <p className="text-slate-400">Esta pista no tiene supuestos prácticos.</p>
        <Link to="/" className="text-sm text-cyan-300 hover:text-cyan-200">← Panel de mando</Link>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        kicker="Práctica"
        title="🗂️ Supuestos prácticos"
        sub="Casos largos con documentación, como en el examen: practica con ayudas o haz el simulacro con tiempo."
      />
      {groups.map(({ sec, items }) => (
        <section key={sec.id} className="mb-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            {sec.icon} {sec.title}
          </h2>
          <div className="space-y-2">
            {items.map((m) => <SupuestoCard key={m.id} meta={m} />)}
          </div>
        </section>
      ))}
      {integrators.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            🧩 Supuesto integrador
          </h2>
          <div className="space-y-2">
            {integrators.map((m) => <SupuestoCard key={m.id} meta={m} />)}
          </div>
        </section>
      )}
    </div>
  );
}
