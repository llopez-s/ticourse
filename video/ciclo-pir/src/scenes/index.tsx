import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';
import { S01Encargo } from './S01Encargo';
import { S02Ciclo } from './S02Ciclo';
import { S03Pedido } from './S03Pedido';
import { S04Final } from './S04Final';
import { S05F3ead } from './S05F3ead';
import { S06Pir } from './S06Pir';
import { S07Reconocer } from './S07Reconocer';

const stub = (id: string): ComponentType<SceneProps> => (props) => <Placeholder id={id} props={props} />;

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-encargo': S01Encargo,
  's02-ciclo': S02Ciclo,
  's03-pedido': S03Pedido,
  's04-final': S04Final,
  's05-f3ead': S05F3ead,
  's06-pir': S06Pir,
  's07-reconocer': S07Reconocer,
  's08-permanentes': stub('s08-permanentes'),
  's09-examen': stub('s09-examen'),
  's10-cierre': stub('s10-cierre'),
};
