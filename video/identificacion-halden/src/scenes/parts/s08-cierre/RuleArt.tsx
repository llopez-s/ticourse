import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { CasaTile } from '../Casa';
import { ConsultaTile } from '../Consulta';
import { TiendaTile } from '../Tienda';

/** Height of the art slot of a rule card. */
export const ART_H = 130;

const GAP = 12;

/** Small tiles that come in one after another from `at`. */
function staggered(frame: number, at: number, k: number) {
  return progress(frame, at + 2 + k * 8, 14, EASE.out);
}

/** Rule 1 (the machines): la consulta in miniature — the doctor at the door, the blood test, the heart-rate band. */
export function ConsultaArt({ frame, at }: { frame: number; at: number }) {
  return (
    <div style={{ display: 'flex', gap: GAP }}>
      <ConsultaTile kind="puerta" width={150} show={staggered(frame, at, 0)} />
      <ConsultaTile kind="analitica" width={150} show={staggered(frame, at, 1)} />
      <ConsultaTile kind="pulsometro" width={150} show={staggered(frame, at, 2)} />
    </div>
  );
}

/** Rule 2 (the applications): la casa — the plans, the running tap, the materials list. */
export function CasaArt({ frame, at }: { frame: number; at: number }) {
  return (
    <div style={{ display: 'flex', gap: GAP }}>
      <CasaTile kind="planos" width={150} show={staggered(frame, at, 0)} />
      <CasaTile kind="grifo" width={150} show={staggered(frame, at, 1)} />
      <CasaTile kind="lista" width={150} show={staggered(frame, at, 2)} />
    </div>
  );
}

/** Rule 3 (outside): la tienda de la calle — the shops that warn each other, and the mercadillo. */
export function TiendaArt({ frame, at }: { frame: number; at: number }) {
  return (
    <div style={{ display: 'flex', gap: GAP }}>
      <TiendaTile kind="periodico" width={150} show={staggered(frame, at, 0)} />
      <TiendaTile kind="grupo" width={150} show={staggered(frame, at, 1)} />
      <TiendaTile kind="mercadillo" width={150} show={staggered(frame, at, 2)} />
    </div>
  );
}
