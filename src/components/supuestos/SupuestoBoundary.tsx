import { Component, type ReactNode } from 'react';
import { labButton } from '../labs/LabWorkspace';

// The supuesto page is a lazy chunk. If it cannot load (a deploy replaced it, or the
// network dropped), keep the failure on this route instead of unmounting the whole app.
export default class SupuestoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div role="alert" className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-sm text-amber-100">
      <p className="mb-3">No se pudo abrir el supuesto. Puede que haya una versión nueva de la web o que se haya cortado la conexión.</p>
      <button className={labButton} onClick={() => window.location.reload()}>Recargar la página</button>
    </div>;
  }
}
