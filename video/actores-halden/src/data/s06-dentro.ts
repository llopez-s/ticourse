/** s06-dentro «Los que ya están dentro» — on-screen strings (canon: out/scene-brief.md). */

export const CASE = 'Imagina una semana · caso de ejemplo · sin fecha';
export const ACCESS = 'su ventaja es el acceso';

/** The three faces, each with its panel title, its object and its chips. */
export const FACES = {
  sanction: { title: 'un empleado sancionado', list: 'pedidos de su sección', chips: ['a propósito', 'revenge'] },
  mail: { title: 'otra persona, por error', letter: 'lista de turnos y teléfonos', outside: 'fuera', belief: 'creía que escribía a un compañero' },
  chat: { title: 'grupo de los amarradores', photo: 'listas de buques', systems: 'Sistemas no lo sabe', after: 'sin malicia · nadie lo vigila' },
} as const;

/** The exam names, one per face. */
export const NAMES = ['Intentional insider', 'Unintentional insider', 'Shadow IT'] as const;
