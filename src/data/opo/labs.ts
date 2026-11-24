import type { ClassifyData, LabMeta, OrderData } from '../labs';
import { withLabGuide } from '../lab-guides';
import { OP1_CLASSIFY_DATA, OP1_LABS, OP1_ORDER_DATA } from './labs-op1';

/** Registro de labs de la pista «Redes y ENS» (escenario: Consorcio Provincial de Arcedo). */
export const OP_LABS: LabMeta[] = [...OP1_LABS].map(withLabGuide);

export const OP_CLASSIFY_DATA: Record<string, ClassifyData> = { ...OP1_CLASSIFY_DATA };

export const OP_ORDER_DATA: Record<string, OrderData> = { ...OP1_ORDER_DATA };
