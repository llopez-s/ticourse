import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';
import { S01Ip } from './S01Ip';
import { S02Pasos } from './S02Pasos';

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-ip': S01Ip,
  's02-pasos': S02Pasos,
  's03-kent': (p) => <Placeholder id="s03-kent" props={p} />,
  's04-pruebas': (p) => <Placeholder id="s04-pruebas" props={p} />,
  's05-triada': (p) => <Placeholder id="s05-triada" props={p} />,
  's06-caso': (p) => <Placeholder id="s06-caso" props={p} />,
  's07-herramienta': (p) => <Placeholder id="s07-herramienta" props={p} />,
  's08-conducta': (p) => <Placeholder id="s08-conducta" props={p} />,
  's09-riesgo': (p) => <Placeholder id="s09-riesgo" props={p} />,
  's10-ventaja': (p) => <Placeholder id="s10-ventaja" props={p} />,
  's11-reglas': (p) => <Placeholder id="s11-reglas" props={p} />,
};
