import type { ComponentType } from 'react';
import type { SceneId, SceneProps } from '../../../engine/src/timeline/types';
import { Placeholder } from './Placeholder';
import { S01Encargo } from './S01Encargo';
import { S02Ciclo } from './S02Ciclo';

const stub = (id: string): ComponentType<SceneProps> => (props) => <Placeholder id={id} props={props} />;

export const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  's01-encargo': S01Encargo,
  's02-ciclo': S02Ciclo,
  's03-pedido': stub('s03-pedido'),
  's04-final': stub('s04-final'),
  's05-f3ead': stub('s05-f3ead'),
  's06-pir': stub('s06-pir'),
  's07-reconocer': stub('s07-reconocer'),
  's08-permanentes': stub('s08-permanentes'),
  's09-examen': stub('s09-examen'),
  's10-cierre': stub('s10-cierre'),
};
