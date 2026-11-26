import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op6s1 — «La sede electrónica del Consorcio» (bloque 6, ENS y normativa)
//
// Fuente única: docs/superpowers/sources/2026-11-26-op6-fuentes.md (RD 311/2022,
// ITS de Auditoría, Leyes 39/2015 y 40/2015, eIDAS consolidado, Ley 6/2020).
//
// Decisiones de escenario (a registrar en el canon):
// - Roles fijados por el controlador: Gerencia = responsable de la información;
//   Secretaría General = responsable del servicio (sede y registro); Unidad de
//   Seguridad de la Información = responsable de la seguridad; jefatura del
//   Servicio de Informática y Comunicaciones = responsable del sistema.
// - La sede, en el CPD de la sede central, da acceso al registro de entrada
//   (sistema propio, MEDIA; justificante automático), notificaciones por comparecencia, tablón de
//   anuncios y comprobación de copias con CSV.
// - Valoraciones de este caso → niveles del sistema C MEDIO, I MEDIO, T BAJO,
//   A MEDIO, D MEDIO → categoría MEDIA, que determina y firma la Unidad de
//   Seguridad de la Información (art. 41; la DA, art. 28.2).
// - El cortafuegos de aplicaciones web de la sede no tiene la funcionalidad de
//   seguridad certificada: se mantiene con medidas compensatorias (art. 28.3).
// - Auditoría para la certificación (primera): FAVORABLE CON NO CONFORMIDADES,
//   tres no conformidades menores y una observación.
// - Las medidas que se preguntan dependen de la categoría, de una sola
//   dimensión o de dos dimensiones con el mismo nivel (mp.com.3, mp.info.3: I y
//   A en MEDIO), para no depender de una regla de niveles mezclados que el
//   dossier no recoge.
// ---------------------------------------------------------------------------

const L1 = { label: 'Lección: El ENS: marco, principios y roles', href: '/learn/op6m1' };
const L2 = { label: 'Lección: Categorizar un sistema', href: '/learn/op6m2' };
const L3 = { label: 'Lección: Las medidas del anexo II', href: '/learn/op6m3' };
const L4 = { label: 'Lección: Conformidad, auditoría e incidentes', href: '/learn/op6m4' };
const L6 = { label: 'Lección: Gobierno de la seguridad', href: '/learn/op6m6' };
const L7 = { label: 'Lección: Firma e identificación electrónicas', href: '/learn/op6m7' };

const BOE_ENS = 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191';
const BOE_LRJSP = 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-10566';
const BOE_LPAC = 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565';
const BOE_LEY6 = 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-14046';
const BOE_ITS_AUD = 'https://www.boe.es/buscar/doc.php?id=BOE-A-2018-4573';
const ELI_EIDAS = 'http://data.europa.eu/eli/reg/2014/910/oj';

const ENS = { label: 'Real Decreto 311/2022, Esquema Nacional de Seguridad', href: BOE_ENS };
const ENS_A12 = { label: 'RD 311/2022, art. 12.1.d (el comité en la política de seguridad)', href: BOE_ENS };
const ENS_A13 = { label: 'RD 311/2022, art. 13 (funciones de los responsables)', href: BOE_ENS };
const ENS_A28 = { label: 'RD 311/2022, art. 28 (declaración de aplicabilidad y medidas compensatorias)', href: BOE_ENS };
const ENS_A31 = { label: 'RD 311/2022, art. 31 (auditoría de la seguridad)', href: BOE_ENS };
const ENS_A38 = { label: 'RD 311/2022, art. 38 (determinación de la conformidad)', href: BOE_ENS };
const ENS_A41 = { label: 'RD 311/2022, art. 41 (quién valora y quién determina la categoría)', href: BOE_ENS };
const ENS_AI = { label: 'RD 311/2022, anexo I (categorías de seguridad)', href: BOE_ENS };
const ENS_AII = { label: 'RD 311/2022, anexo II (medidas de seguridad)', href: BOE_ENS };
const ENS_AIII = { label: 'RD 311/2022, anexo III (auditoría de la seguridad)', href: BOE_ENS };
const ITS_AUD = { label: 'Instrucción Técnica de Seguridad de Auditoría de la Seguridad de los Sistemas de Información (Resolución de 27 de marzo de 2018)', href: BOE_ITS_AUD };
const LRJSP = { label: 'Ley 40/2015, de Régimen Jurídico del Sector Público', href: BOE_LRJSP };
const LRJSP_SEDE = { label: 'Ley 40/2015, arts. 38, 40, 42 y 43 (sede, sello, actuación automatizada y firma del personal)', href: BOE_LRJSP };
const LPAC = { label: 'Ley 39/2015, art. 27 (copias auténticas)', href: BOE_LPAC };
const EIDAS = { label: 'Reglamento (UE) 910/2014 (eIDAS), versión consolidada: arts. 3 y 35', href: ELI_EIDAS };
const LEY6 = { label: 'Ley 6/2020, art. 4 (vigencia de los certificados cualificados)', href: BOE_LEY6 };

const BORRADOR =
  'El Servicio de Informática y Comunicaciones ha preparado un borrador de declaración de aplicabilidad para la sede y lo ha dejado en el expediente. ' +
  'Revísalo contra el anexo II antes de que se firme: ojo con las medidas que se exigen por categoría y con las que se exigen por una dimensión.';

const op6s1: Supuesto = {
  id: 'op6s1',
  track: 'opo',
  sectionIds: ['op6'],
  version: 1,
  title: 'La sede electrónica del Consorcio',
  brief: 'Categoriza la sede electrónica del Consorcio, corrige su declaración de aplicabilidad, elige sus certificados y su sello, responde a una auditoría y explícaselo todo al comité de seguridad.',
  minutes: 60,
  prerequisites: ['op6m1', 'op6m2', 'op6m3', 'op6m4', 'op6m6', 'op6m7'],
  dossier: [
    {
      id: 'd-memo',
      title: 'Memorando de la Gerencia: la sede electrónica y su categoría',
      kind: 'memo',
      body: [
        { t: 'p', md: '**De:** Gerencia del Consorcio Provincial de Arcedo · **Para:** Unidad de Seguridad de la Información · **Asunto:** categorización de la sede electrónica' },
        {
          t: 'p',
          md: 'La sede electrónica del Consorcio funciona en el CPD de la sede central. La gestiona técnicamente el Servicio de Informática y Comunicaciones y presta estos servicios:',
        },
        {
          t: 'list',
          items: [
            '**Acceso al registro electrónico:** desde la sede, los interesados presentan solicitudes, escritos y documentos en el registro electrónico de entrada, que es un sistema propio del Consorcio, con su categoría y su auditoría. El registro emite de forma automática, sin intervención de ningún empleado público, el justificante de cada presentación.',
            '**Notificaciones por comparecencia en la sede:** el interesado se identifica y accede a la notificación.',
            '**Tablón electrónico de anuncios:** anuncios y edictos públicos del Consorcio.',
            '**Comprobación de copias:** quien recibe una copia en papel de un documento del Consorcio puede comprobar en la sede que es auténtica.',
          ],
        },
        {
          t: 'p',
          md: 'Esta Gerencia, como responsable de la información, y la Secretaría General, como responsable del servicio, hemos hecho nuestras valoraciones; van adjuntas. Por la visibilidad que tiene la sede ante la ciudadanía, la Gerencia **propone que se categorice como ALTA** y aprobará la categoría en la próxima reunión del Comité de Seguridad de la Información. Rogamos a la Unidad que estudie las valoraciones y que, con el Servicio de Informática, prepare la declaración de aplicabilidad.',
        },
      ],
    },
    {
      id: 'd-informacion',
      title: 'Valoración de la información (responsable de la información: la Gerencia)',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Información', 'C', 'I', 'T', 'A', 'D', 'Motivo de los niveles MEDIO'],
          rows: [
            ['Solicitudes, escritos y documentos que presentan los interesados', 'MEDIO', 'MEDIO', 'BAJO', 'BAJO', '—', 'Contienen datos personales y económicos: divulgarlos o alterarlos causaría un perjuicio grave a los interesados, de difícil reparación.'],
            ['Anuncios y edictos del tablón electrónico', '—', 'MEDIO', 'BAJO', 'BAJO', '—', 'Son públicos, pero un anuncio alterado podría anular un procedimiento: perjuicio grave.'],
          ],
        },
        { t: 'p', md: '«—»: la dimensión no se ve afectada y no se adscribe a ningún nivel. Los niveles BAJO corresponden a un perjuicio limitado.' },
      ],
    },
    {
      id: 'd-servicio',
      title: 'Valoración de los servicios (responsable del servicio: la Secretaría General)',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Servicio', 'C', 'I', 'T', 'A', 'D', 'Motivo de los niveles MEDIO'],
          rows: [
            ['Acceso al registro electrónico', 'BAJO', 'BAJO', 'BAJO', 'MEDIO', 'MEDIO', 'Si alguien presentara escritos suplantando a un interesado, o si el registro no estuviera disponible el último día de un plazo, muchos interesados sufrirían un perjuicio grave, de difícil reparación.'],
            ['Notificaciones por comparecencia en la sede', 'BAJO', 'BAJO', 'BAJO', 'BAJO', 'BAJO', '—'],
          ],
        },
        { t: 'p', md: 'Los niveles BAJO corresponden a un perjuicio limitado: las actuaciones quedan anotadas en el asiento de registro y en el expediente.' },
      ],
    },
    {
      id: 'd-da',
      title: 'Borrador de declaración de aplicabilidad (extracto)',
      kind: 'table',
      unlockedBy: 'f1',
      body: [
        { t: 'p', md: '**Sistema:** sede electrónica del Consorcio · **Categoría:** MEDIA · **Preparado por:** Servicio de Informática y Comunicaciones' },
        {
          t: 'table',
          headers: ['Código', 'Medida', 'Se exige por', 'Decisión del borrador'],
          rows: [
            ['op.pl.5', 'Componentes certificados', 'Categoría', 'No aplica: los componentes certificados solo se exigen en categoría ALTA.'],
            ['op.exp.5', 'Gestión de cambios', 'Categoría', 'Aplica.'],
            ['op.cont.1', 'Análisis de impacto', 'D', 'No aplica: la continuidad solo se exige con disponibilidad ALTO.'],
            ['op.cont.2', 'Plan de continuidad', 'D', 'No aplica.'],
            ['op.exp.8', 'Registro de la actividad', 'T', 'Aplica + R1 + R2 + R3 + R4: la categoría MEDIA sube la trazabilidad a MEDIO.'],
            ['mp.info.4', 'Sellos de tiempo', 'T', 'No aplica.'],
            ['mp.info.6', 'Copias de seguridad', 'D', 'Aplica + R1.'],
            ['mp.s.4', 'Protección frente a denegación de servicio', 'D', 'No aplica: la denegación de servicio solo se trata en categoría ALTA.'],
            ['mp.com.3', 'Protección de la integridad y de la autenticidad', 'I A', 'Aplica + R1 + R2.'],
            ['mp.info.3', 'Firma electrónica', 'I A', 'Pendiente: se decidirá con los certificados de la sede.'],
          ],
        },
        {
          t: 'list',
          items: [
            '**Componente sin funcionalidad certificada:** el cortafuegos de aplicaciones web que protege la sede. Como op.pl.5 no se exige, no se hace nada.',
            '**Firma:** la jefatura del Servicio de Informática y Comunicaciones.',
          ],
        },
      ],
    },
    {
      id: 'd-oferta',
      title: 'Correo del prestador de servicios de confianza: lotes ofertados',
      kind: 'email',
      unlockedBy: 'f2',
      body: [
        { t: 'p', md: '**De:** prestador cualificado de servicios de confianza (incluido en la lista de confianza) · **Para:** Secretaría General del Consorcio · **Asunto:** oferta para la sede electrónica' },
        {
          t: 'table',
          headers: ['Lote', 'Producto', 'Unidades'],
          rows: [
            ['1', 'Certificado cualificado de autenticación de sitio web', '1'],
            ['2', 'Certificado cualificado de sello electrónico a nombre del Consorcio', '1'],
            ['3', 'Certificados cualificados de empleado público', '15'],
            ['4', 'Sellos cualificados de tiempo electrónicos', 'bono de 10 000'],
          ],
        },
        { t: 'p', md: 'Pueden contratar los lotes por separado.' },
      ],
    },
    {
      id: 'd-auditoria',
      title: 'Extracto del informe de auditoría para la certificación',
      kind: 'acta',
      unlockedBy: 'f3',
      body: [
        { t: 'p', md: 'Primera auditoría para la certificación de la sede electrónica, hecha por una entidad certificadora sobre la declaración de aplicabilidad ya firmada. **Dictamen: FAVORABLE CON NO CONFORMIDADES.**' },
        {
          t: 'table',
          headers: ['#', 'Tipo de hallazgo', 'Medida', 'Hallazgo'],
          rows: [
            ['1', 'No Conformidad Menor', 'op.cont.1', 'La declaración la da por aplicable, pero no existe análisis de impacto de la sede.'],
            ['2', 'No Conformidad Menor', 'mp.info.6', 'Las copias de seguridad de la sede no se someten a pruebas de recuperación.'],
            ['3', 'No Conformidad Menor', 'org.1', 'La política de seguridad no recoge la estructura y composición del comité de seguridad.'],
            ['4', 'Observación', 'mp.info.4', 'Se recomienda estudiar el uso de sellos de tiempo en los anuncios del tablón.'],
          ],
        },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'Categorizar la sede',
      context:
        'Eres técnico de la Unidad de Seguridad de la Información. La Gerencia y la Secretaría General ya han valorado la información y los servicios de la sede, y la Gerencia propone una categoría. Antes de nada, calcula el nivel del sistema en cada dimensión y la categoría que le corresponde según el anexo I.',
      carry:
        'La Unidad de Seguridad de la Información, como responsable de la seguridad, ha determinado la categoría **MEDIA** (art. 41). En cada dimensión manda el nivel más alto de todas las informaciones y servicios: C MEDIO, I MEDIO, T BAJO, A MEDIO y D MEDIO. Ninguna llega a ALTO.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'table',
          topic: 'op6m2',
          prompt: 'Con las dos valoraciones, indica el nivel del sistema en cada dimensión.',
          fields: [{ id: 'nivel', label: 'Nivel del sistema', options: ['sin nivel', 'BAJO', 'MEDIO', 'ALTO'] }],
          rows: [
            { id: 'c', label: 'Confidencialidad [C]', answer: { nivel: 'MEDIO' } },
            { id: 'i', label: 'Integridad [I]', answer: { nivel: 'MEDIO' } },
            { id: 't', label: 'Trazabilidad [T]', answer: { nivel: 'BAJO' } },
            { id: 'a', label: 'Autenticidad [A]', answer: { nivel: 'MEDIO' } },
            { id: 'd', label: 'Disponibilidad [D]', answer: { nivel: 'MEDIO' } },
          ],
          points: 10,
          hint: { text: 'En cada dimensión, recorre las cuatro filas de las dos valoraciones (dos informaciones y dos servicios) y quédate con el nivel más alto.', cost: 2 },
          explain:
            'Cuando un sistema maneja varias informaciones y presta varios servicios, el anexo I manda tomar en cada dimensión el mayor de los niveles fijados para cada información y cada servicio. C sale de las solicitudes (MEDIO); I, de las solicitudes y del tablón (MEDIO); A y D, del acceso al registro electrónico (MEDIO); T es BAJO en las cuatro filas. Tienta poner «sin nivel» en la disponibilidad porque la Gerencia no la valoró en la información, o BAJO en C porque los servicios la dejan en BAJO: no se promedia ni se mira solo una de las valoraciones, se toma la más alta.',
          refs: [L2, ENS_AI],
        },
        {
          id: 'f1t2',
          kind: 'choice',
          topic: 'op6m2',
          prompt: '¿Qué categoría tiene la sede electrónica?',
          options: [
            { id: 'a', text: 'BÁSICA: la mayoría de los niveles de las valoraciones son BAJO' },
            { id: 'b', text: 'MEDIA: alguna dimensión alcanza MEDIO y ninguna llega a ALTO' },
            { id: 'c', text: 'ALTA, como propone la Gerencia, por la visibilidad de la sede ante la ciudadanía' },
            { id: 'd', text: 'MEDIA en confidencialidad, integridad, autenticidad y disponibilidad, y BÁSICA en trazabilidad' },
          ],
          answer: 'b',
          points: 5,
          explain:
            'Según el anexo I, un sistema es de categoría ALTA si alguna dimensión alcanza ALTO; MEDIA si alguna alcanza MEDIO y ninguna supera ese nivel; y BÁSICA si alguna alcanza BAJO y ninguna lo supera. Aquí cuatro dimensiones están en MEDIO y ninguna en ALTO: MEDIA. La categoría no se decide por mayoría de valoraciones ni por la visibilidad del servicio, sino por el impacto que tendría un incidente, valorado dimensión a dimensión. Y es una sola para todo el sistema: no hay una categoría por dimensión, aunque cada dimensión conserva su propio nivel.',
          refs: [L2, ENS_AI],
        },
        {
          id: 'f1t3',
          kind: 'match',
          topic: 'op6m1',
          prompt: 'Empareja cada tarea de la categorización con quien la hace en el Consorcio.',
          left: [
            { id: 'm1', text: 'Determina los requisitos de la información tratada' },
            { id: 'm2', text: 'Determina los requisitos de los servicios prestados' },
            { id: 'm3', text: 'Determina la categoría del sistema' },
            { id: 'm4', text: 'Implanta la seguridad en el sistema y supervisa su operación diaria' },
          ],
          right: [
            { id: 'r-ger', text: 'La Gerencia' },
            { id: 'r-sg', text: 'La Secretaría General' },
            { id: 'r-usi', text: 'La Unidad de Seguridad de la Información' },
            { id: 'r-inf', text: 'La jefatura del Servicio de Informática y Comunicaciones' },
            { id: 'r-com', text: 'El Comité de Seguridad de la Información' },
          ],
          answer: { m1: 'r-ger', m2: 'r-sg', m3: 'r-usi', m4: 'r-inf' },
          points: 6,
          explain:
            'Según el art. 13.2, el responsable de la información (la Gerencia) determina los requisitos de la información tratada y el responsable del servicio (la Secretaría General), los de los servicios prestados; por eso son ellos quienes valoran (art. 41). La categoría la determina el responsable de la seguridad, la Unidad de Seguridad de la Información (art. 41), y el responsable del sistema, la jefatura del Servicio de Informática, implanta la seguridad y supervisa la operación diaria (art. 13). Tienta dar la categoría al comité, como anuncia la Gerencia en su memorando, o a la propia Gerencia, que lo preside; pero ninguno de los dos la determina. Que la Unidad dependa de la Gerencia y no del Servicio de Informática cumple el art. 13.3: el responsable de la seguridad es distinto del responsable del sistema y sin dependencia jerárquica entre ambos.',
          refs: [L1, L2, ENS_A41, ENS_A13],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'La declaración de aplicabilidad',
      context: 'La Unidad de Seguridad de la Información ha determinado la categoría MEDIA. ' + BORRADOR,
      variants: [
        {
          when: { task: 'f1t2', chose: 'a' },
          context: 'Propusiste BÁSICA porque predominaban los niveles BAJO, pero la categoría la da la dimensión más alta, no la mayoría. La Unidad de Seguridad de la Información determinó MEDIA. ' + BORRADOR,
        },
        {
          when: { task: 'f1t2', chose: 'c' },
          context: 'Propusiste ALTA, como pedía la Gerencia, pero ninguna dimensión llega a ALTO y la visibilidad no cuenta. La Unidad de Seguridad de la Información determinó MEDIA. ' + BORRADOR,
        },
        {
          when: { task: 'f1t2', chose: 'd' },
          context: 'Diste una categoría distinta por dimensión, pero la categoría es una sola para todo el sistema. La Unidad de Seguridad de la Información determinó MEDIA. ' + BORRADOR,
        },
      ],
      carry:
        'La declaración de aplicabilidad está corregida según el anexo II y la firma la Unidad de Seguridad de la Información. El cortafuegos de aplicaciones web sin funcionalidad certificada sigue en servicio con medidas compensatorias justificadas y aprobadas formalmente por la Unidad. Queda pendiente la línea de la firma electrónica (mp.info.3), que depende de los certificados de la sede.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'table',
          topic: 'op6m3',
          prompt: 'Para cada medida del borrador, indica lo que **exige el anexo II** para esta sede (que no tiene por qué coincidir con lo que dice el borrador).',
          fields: [
            { id: 'exige', label: 'Lo que exige el anexo II', options: ['no se exige (n.a.)', 'aplica', 'aplica + R1', 'aplica + R1 + R2', 'aplica + R1 + R2 + R3 + R4'] },
          ],
          rows: [
            { id: 'pl5', label: 'op.pl.5 Componentes certificados (categoría)', answer: { exige: 'aplica' } },
            { id: 'exp5', label: 'op.exp.5 Gestión de cambios (categoría)', answer: { exige: 'aplica' } },
            { id: 'cont1', label: 'op.cont.1 Análisis de impacto (D)', answer: { exige: 'aplica' } },
            { id: 'cont2', label: 'op.cont.2 Plan de continuidad (D)', answer: { exige: 'no se exige (n.a.)' } },
            { id: 'exp8', label: 'op.exp.8 Registro de la actividad (T)', answer: { exige: 'aplica' } },
            { id: 'info4', label: 'mp.info.4 Sellos de tiempo (T)', answer: { exige: 'no se exige (n.a.)' } },
            { id: 'info6', label: 'mp.info.6 Copias de seguridad (D)', answer: { exige: 'aplica + R1' } },
            { id: 's4', label: 'mp.s.4 Protección frente a denegación de servicio (D)', answer: { exige: 'aplica' } },
            { id: 'com3', label: 'mp.com.3 Protección de la integridad y de la autenticidad (I A)', answer: { exige: 'aplica + R1 + R2' } },
          ],
          points: 14,
          hint: { text: 'Las medidas «por categoría» se miran en la columna MEDIA; las que se exigen por una dimensión, en el nivel de esa dimensión, que no sube por la categoría.', cost: 2 },
          explain:
            'Por categoría MEDIA: op.pl.5 (n.a. solo en BÁSICA) y op.exp.5 aplican. Por disponibilidad MEDIO: op.cont.1 aplica, mientras que op.cont.2 (y también op.cont.3 y op.cont.4) solo se exigen con disponibilidad ALTO; mp.s.4 aplica (es n.a. solo con D BAJO) y mp.info.6 lleva R1. Por trazabilidad BAJO: op.exp.8 aplica sin refuerzos y mp.info.4 solo se exige con T ALTO. mp.com.3, con integridad y autenticidad en MEDIO, lleva R1 y R2. El borrador falla en cuatro líneas: op.pl.5, op.cont.1 y mp.s.4 no son solo de ALTA, y op.exp.8 no sube a MEDIO por ser la categoría MEDIA, porque la categoría no altera el nivel de las dimensiones (anexo I). Poner más refuerzos de los exigidos no está prohibido, se pueden añadir medidas (art. 28.2), pero no es lo que exige el anexo II.',
          refs: [L3, L2, ENS_AII, ENS_AI],
        },
        {
          id: 'f2t2',
          kind: 'choice',
          topic: 'op6m2',
          prompt: '¿Quién debe firmar la declaración de aplicabilidad?',
          options: [
            { id: 'a', text: 'La jefatura del Servicio de Informática y Comunicaciones, que la ha preparado' },
            { id: 'b', text: 'La Gerencia, como responsable de la información' },
            { id: 'c', text: 'La Unidad de Seguridad de la Información, como responsable de la seguridad' },
            { id: 'd', text: 'El Comité de Seguridad de la Información, por acuerdo de sus miembros' },
          ],
          answer: 'c',
          points: 4,
          explain:
            'El art. 28.2 dice que la relación de medidas seleccionadas se formaliza en un documento denominado Declaración de Aplicabilidad, firmado por el responsable de la seguridad: aquí, la Unidad de Seguridad de la Información. Que la prepare el Servicio de Informática no le da la firma; es lo que tienta, porque el borrador ya lleva su nombre al pie. Ni la Gerencia ni el comité la firman.',
          refs: [L2, L3, ENS_A28],
        },
        {
          id: 'f2t3',
          kind: 'choice',
          topic: 'op6m3',
          prompt: 'El cortafuegos de aplicaciones web de la sede no tiene la funcionalidad de seguridad certificada y sustituirlo llevará meses. ¿Qué haces?',
          options: [
            { id: 'a', text: 'Mantenerlo con medidas compensatorias, justificando por escrito que protegen igual o mejor y con la aprobación formal de la Unidad de Seguridad de la Información' },
            { id: 'b', text: 'Nada: los componentes certificados solo se exigen en categoría ALTA' },
            { id: 'c', text: 'Basta con que la jefatura del Servicio de Informática, como responsable del sistema, lo anote en el inventario de activos' },
            { id: 'd', text: 'Retirarlo de inmediato: el ENS no admite ninguna alternativa a una medida del anexo II' },
          ],
          answer: 'a',
          points: 5,
          explain:
            'op.pl.5 se aplica desde la categoría MEDIA, así que el borrador se equivoca al no hacer nada. El art. 28.3 permite sustituir una medida del anexo II por medidas compensatorias si se justifica documentalmente que protegen igual o mejor el riesgo y las aprueba formalmente el responsable de la seguridad. Retirarlo tienta por prudencia, pero el ENS sí prevé esta vía; anotarlo en el inventario no compensa nada, y la aprobación no es del responsable del sistema.',
          refs: [L3, ENS_A28, ENS_AII],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'El certificado de la sede y el sello electrónico',
      context:
        'Con la declaración corregida, la Secretaría General tiene que decidir cómo se identifican la sede y los documentos que salen de ella. El registro emite cada justificante de forma automática, sin intervención de ningún empleado público; la persona titular de la Secretaría General firma las resoluciones; y muchos interesados piden copias en papel. En el expediente tienes la oferta del prestador.',
      carry:
        'La sede se identifica con un certificado cualificado de autenticación de sitio web; los justificantes automáticos llevan el sello electrónico del Consorcio, con certificado cualificado de sello; las resoluciones se firman con certificado cualificado de empleado público; y las copias en papel llevan un CSV que se comprueba en la sede. mp.info.3 entra en la declaración con R1, R2 y R3.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'match',
          topic: 'op6m7',
          prompt: 'Empareja cada necesidad de la sede con el instrumento que la cubre.',
          left: [
            { id: 'n1', text: 'Que el navegador del interesado compruebe que la sede pertenece al Consorcio' },
            { id: 'n2', text: 'Firmar el justificante que emite el registro con un certificado a nombre del Consorcio (su NIF y su denominación), no de una persona' },
            { id: 'n3', text: 'Que la persona titular de la Secretaría General firme una resolución' },
            { id: 'n4', text: 'Que quien recibe una copia en papel compruebe en la sede que es auténtica e íntegra' },
          ],
          right: [
            { id: 'i-web', text: 'Certificado cualificado de autenticación de sitio web' },
            { id: 'i-sello', text: 'Sello electrónico con certificado cualificado de sello' },
            { id: 'i-emp', text: 'Firma con certificado cualificado de empleado público' },
            { id: 'i-csv', text: 'Código seguro de verificación (CSV)' },
            { id: 'i-tiempo', text: 'Sello cualificado de tiempo electrónico' },
            { id: 'i-clave', text: 'Clave concertada, como Cl@ve' },
          ],
          answer: { n1: 'i-web', n2: 'i-sello', n3: 'i-emp', n4: 'i-csv' },
          points: 8,
          explain:
            'La sede se identifica con certificados reconocidos o cualificados de autenticación de sitio web o un medio equivalente (Ley 40/2015, art. 38.6). La administración se identifica con un sello electrónico basado en un certificado con su NIF y su denominación (art. 40), y la actuación automatizada, como el justificante del registro, se firma con sello electrónico o con CSV (art. 42); como aquí se pide un certificado a nombre del Consorcio, es el sello. Las resoluciones las firma el titular del órgano con su firma electrónica (art. 43). Y el CSV permite comprobar en la sede la integridad del documento (art. 42.b; las copias en papel con código, Ley 39/2015, art. 27.3.c). El sello de tiempo tienta por llamarse «sello», pero da fecha y hora, no identifica a nadie; la clave concertada sirve para que se identifiquen los interesados, no la administración.',
          refs: [L7, LRJSP_SEDE, LPAC],
        },
        {
          id: 'f3t2',
          kind: 'multi',
          topic: 'op6m7',
          prompt: 'Marca **todas** las afirmaciones ciertas sobre el sello y los certificados de la sede.',
          options: [
            { id: 'a', text: 'El sello electrónico es de una persona jurídica, aquí el Consorcio, y garantiza el origen y la integridad de lo sellado' },
            { id: 'b', text: 'Un sello electrónico cualificado goza de presunción de integridad de los datos y de corrección de su origen' },
            { id: 'c', text: 'Los certificados cualificados se expiden por un plazo no superior a cinco años' },
            { id: 'd', text: 'La Ley 40/2015 solo admite, para identificar la sede, un certificado cualificado de autenticación de sitio web: ningún otro medio vale' },
            { id: 'e', text: 'El sello electrónico solo produce efectos si lo acompaña la firma de la persona titular de la Secretaría General' },
            { id: 'f', text: 'Con el CSV el navegador ya identifica la sede, así que sobra el certificado de sitio web' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'El eIDAS define el sello electrónico como el de una persona jurídica, que garantiza el origen y la integridad (art. 3.25), y da al sello cualificado presunción de integridad de los datos y de corrección del origen (art. 35). La Ley 6/2020 (art. 4) limita la vigencia de los certificados cualificados a cinco años como máximo. La opción d tienta, pero la Ley 40/2015 habla de certificados «reconocidos o cualificados» de autenticación de sitio web «o medio equivalente». El sello no necesita la firma de ninguna persona, y el CSV sirve para comprobar documentos, no para identificar la sede ante el navegador.',
          refs: [L7, EIDAS, LEY6, LRJSP_SEDE],
        },
        {
          id: 'f3t3',
          kind: 'choice',
          topic: 'op6m3',
          prompt: 'Toca cerrar la línea pendiente de la declaración. Con integridad y autenticidad en MEDIO, ¿qué exige mp.info.3 (firma electrónica)?',
          options: [
            { id: 'a', text: 'Aplica, sin refuerzos' },
            { id: 'b', text: 'Aplica + R5: firma cualificada en todos los casos' },
            { id: 'c', text: 'Aplica + R1 + R2 + R3 + R4: además, firma avanzada con certificado cualificado y un segundo factor' },
            { id: 'd', text: 'Aplica + R1 + R2 + R3: certificados cualificados, algoritmos autorizados por el CCN y verificación y validación de las firmas' },
          ],
          answer: 'd',
          points: 4,
          explain:
            'En la tabla del anexo II, mp.info.3 se exige por integridad y autenticidad: con nivel BAJO aplica sin refuerzos, con MEDIO suma R1, R2 y R3, y con ALTO añade R4, la firma avanzada con certificado cualificado y un segundo factor. Aquí I y A están las dos en MEDIO. R5, la firma cualificada, existe en la ficha de la medida, pero no figura en la aplicación por niveles: no se exige en ninguno.',
          refs: [L3, L7, ENS_AII],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'La auditoría',
      context:
        'Meses después de firmar la declaración, una entidad certificadora ha hecho la auditoría para la certificación de la sede; tienes el extracto de su informe en el expediente.',
      carry:
        'La Unidad de Seguridad analiza el informe y presenta sus conclusiones a la jefatura del Servicio de Informática. El Plan de Acciones Correctivas va a la entidad certificadora en un mes como máximo (ITS de Auditoría): análisis de impacto de la sede, pruebas de recuperación de las copias y política de seguridad con la estructura y composición del comité. La observación sobre los sellos de tiempo no obliga.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'table',
          topic: 'op6m4',
          prompt: 'Completa el calendario que sigue a la auditoría: el plazo de cada paso y la norma que lo fija.',
          fields: [
            { id: 'plazo', label: 'Plazo', options: ['un mes como máximo', 'tres meses', 'seis meses como máximo', 'al menos cada dos años', 'anualmente o ante modificaciones significativas', '72 horas'] },
            { id: 'norma', label: 'Norma', options: ['RD 311/2022, art. 31', 'RD 311/2022, art. 38', 'RD 311/2022, anexo I', 'RD 311/2022, anexo III', 'ITS de Auditoría'] },
          ],
          rows: [
            { id: 'pac', label: 'Presentar el Plan de Acciones Correctivas a la entidad certificadora', answer: { plazo: 'un mes como máximo', norma: 'ITS de Auditoría' } },
            { id: 'ordinaria', label: 'Próxima auditoría ordinaria del sistema', answer: { plazo: 'al menos cada dos años', norma: 'RD 311/2022, art. 31' } },
            { id: 'prorroga', label: 'Prórroga de la auditoría si una causa de fuerza mayor impide hacerla a tiempo', answer: { plazo: 'tres meses', norma: 'RD 311/2022, art. 31' } },
            { id: 'extra', label: 'Auditoría extraordinaria si el dictamen hubiera sido DESFAVORABLE', answer: { plazo: 'seis meses como máximo', norma: 'ITS de Auditoría' } },
            { id: 'reeval', label: 'Revisar la categoría del sistema', answer: { plazo: 'anualmente o ante modificaciones significativas', norma: 'RD 311/2022, anexo I' } },
          ],
          points: 8,
          explain:
            'Con un dictamen favorable con no conformidades, la ITS de Auditoría pide presentar a la entidad certificadora un Plan de Acciones Correctivas en el plazo máximo de un mes; si hubiera sido desfavorable, habría que hacer una auditoría extraordinaria en un plazo no superior a seis meses. El anexo III del RD tienta para el plan de acciones, pero no fija ningún plazo: está en la ITS. El art. 31 fija la auditoría ordinaria al menos cada dos años y una prórroga de tres meses por fuerza mayor; el art. 38 dice qué procedimiento toca (auditoría o autoevaluación), no cada cuánto. La categoría se reevalúa anualmente o ante modificaciones significativas (anexo I). Las 72 horas son de la notificación de brechas del RGPD, no de una auditoría.',
          refs: [L4, L2, ITS_AUD, ENS_A31, ENS_AI],
        },
        {
          id: 'f4t2',
          kind: 'choice',
          topic: 'op6m4',
          prompt: '¿Quién analiza el informe de auditoría y a quién presenta sus conclusiones?',
          options: [
            { id: 'a', text: 'El Comité de Seguridad de la Información lo analiza y la Gerencia decide' },
            { id: 'b', text: 'La jefatura del Servicio de Informática lo analiza y eleva sus conclusiones a la Unidad de Seguridad' },
            { id: 'c', text: 'La Secretaría General, como responsable del servicio, lo analiza y contesta a la entidad certificadora' },
            { id: 'd', text: 'La Unidad de Seguridad de la Información lo analiza y presenta sus conclusiones a la jefatura del Servicio de Informática' },
          ],
          answer: 'd',
          points: 4,
          explain:
            'En las categorías MEDIA y ALTA, el anexo III (2.2) dice que el responsable de la seguridad analiza el informe de auditoría y presenta sus conclusiones al responsable del sistema; el art. 31 dirige los informes a los dos. La opción b invierte los papeles y es la que tienta, porque es el Servicio de Informática quien tendrá que corregir buena parte de los hallazgos.',
          refs: [L4, L1, ENS_AIII, ENS_A31],
        },
        {
          id: 'f4t3',
          kind: 'multi',
          topic: 'op6m4',
          prompt: 'Marca **todas** las afirmaciones ciertas sobre el informe.',
          options: [
            { id: 'a', text: 'Las pruebas de recuperación que echa en falta el hallazgo 2 son el refuerzo R1 de mp.info.6, exigible con disponibilidad MEDIO' },
            { id: 'b', text: 'La falta de pruebas periódicas del plan de continuidad (op.cont.3) no puede ser hallazgo en esta sede: solo se exigen con disponibilidad ALTO' },
            { id: 'c', text: 'El CCN puede requerir los informes de auditoría' },
            { id: 'd', text: 'La no conformidad de la política se cierra recogiendo en ella la estructura y composición del comité de seguridad' },
            { id: 'e', text: 'Como el dictamen es favorable, no hay que presentar nada hasta la próxima auditoría ordinaria' },
            { id: 'f', text: 'Por ser de categoría MEDIA, a la sede le habría bastado una autoevaluación' },
            { id: 'g', text: 'El plazo del Plan de Acciones Correctivas lo fija el anexo III del RD 311/2022' },
          ],
          answer: ['a', 'b', 'c', 'd'],
          points: 6,
          explain:
            'Con disponibilidad MEDIO, mp.info.6 lleva el refuerzo R1, las pruebas de recuperación, que es justo lo que falta según el hallazgo 2. op.cont.3, como op.cont.2 y op.cont.4, solo se exige con disponibilidad ALTO, y la sede está en MEDIO. La observación del tablón tampoco obliga: mp.info.4 solo se exige con trazabilidad ALTO. El art. 31 permite al CCN requerir los informes. La política de seguridad debe recoger la estructura y composición del comité o los comités (art. 12.1.d y org.1). «Favorable con no conformidades» sí obliga a presentar un plan de acciones en un mes (ITS de Auditoría, no el anexo III). La autoevaluación solo vale para la categoría BÁSICA (art. 38 y anexo III): es la opción que tienta, porque ninguna dimensión de la sede llega a ALTO.',
          refs: [L4, L3, L6, ENS_A31, ENS_A12, ENS_A38, ITS_AUD],
        },
        {
          id: 'f4t4',
          kind: 'cite',
          topic: 'op6m3',
          prompt: 'Un miembro del comité pregunta si la no conformidad del análisis de impacto se podía haber previsto. Señala los documentos que, juntos, prueban que la medida era exigible en la sede y que el borrador de la declaración la descartó con un motivo equivocado.',
          answerSets: [['d-servicio', 'd-da'], ['d-servicio', 'd-da', 'd-auditoria']],
          points: 4,
          hint: { text: 'Necesitas el documento que fija la disponibilidad del sistema y el que decidió no aplicar la medida.', cost: 1 },
          explain:
            'La valoración de los servicios pone la disponibilidad del acceso al registro electrónico en MEDIO, y con ese nivel op.cont.1 se exige; el borrador de la declaración la marcó como «No aplica» con un motivo falso (que la continuidad solo se exige con disponibilidad ALTO, cosa que vale para op.cont.2 a op.cont.4, no para el análisis de impacto). El informe de auditoría muestra la consecuencia, pero por sí solo no prueba que se pudiera prever. El memorando y la valoración de la información tientan, pero ninguno fija la disponibilidad.',
          refs: [L3, L2, ENS_AII],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Nota al comité de seguridad',
      context:
        'El Comité de Seguridad de la Información, presidido por la Gerencia, se reúne la semana que viene. La Unidad de Seguridad le debe una nota breve, que entienda quien no sea técnico: qué categoría tiene la sede y por qué, qué se corrigió, cómo se identifican la sede y sus documentos, y qué pasa tras la auditoría.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'written',
          topic: 'op6m6',
          prompt: 'Redacta la nota al comité en **120 a 180 palabras**. Después, compárala con el modelo y marca los criterios que cumple.',
          words: 180,
          model:
            'La sede electrónica es de categoría MEDIA. La ha determinado esta Unidad, como responsable de la seguridad, a partir de las valoraciones de la Gerencia y de la Secretaría General: la confidencialidad, la integridad, la autenticidad y la disponibilidad llegan a MEDIO y ninguna dimensión a ALTO. La visibilidad de la sede no cambia la categoría.\n\n' +
            'Hemos corregido el borrador de la declaración de aplicabilidad: los componentes certificados, el análisis de impacto y la protección frente a la denegación de servicio sí se exigen, y el registro de actividad no necesita refuerzos. La declaración la firma esta Unidad.\n\n' +
            'La sede se identifica ante el navegador con un certificado cualificado de autenticación de sitio web, los justificantes automáticos llevan el sello electrónico del Consorcio y las copias en papel, un código seguro de verificación.\n\n' +
            'La auditoría es favorable con tres no conformidades menores. Presentaremos el plan de acciones correctivas a la entidad certificadora en un mes como máximo.',
          rubric: [
            { id: 'r1', text: 'Da la categoría MEDIA con su motivo (la dimensión más alta llega a MEDIO y ninguna a ALTO), dice quién la determinó y aclara que la visibilidad no cuenta', points: 4 },
            { id: 'r2', text: 'Resume las correcciones de la declaración de aplicabilidad con al menos dos medidas y dice que la firma el responsable de la seguridad', points: 4 },
            { id: 'r3', text: 'Explica cómo se identifican la sede y sus documentos: certificado de sitio web, sello electrónico y código seguro de verificación', points: 3 },
            { id: 'r4', text: 'Recoge el dictamen de la auditoría y el plan de acciones correctivas ante la entidad certificadora en un mes como máximo', points: 3 },
            { id: 'r5', text: 'Está escrita para el comité: entre 120 y 180 palabras, sin códigos de medida sin explicar ni jerga innecesaria', points: 2 },
          ],
          points: 16,
          explain:
            'Una nota al comité cuenta decisiones y consecuencias, no tablas: qué categoría, quién la decidió y por qué, qué se ha corregido y qué queda pendiente. Tienta llenarla de códigos del anexo II y de refuerzos, pero eso va en la declaración de aplicabilidad; aquí cada dato tiene que responder a «¿qué tiene que saber o decidir el comité?».',
          refs: [L6, L2, L4, L7],
        },
      ],
    },
  ],
  sources: [L1, L2, L3, L4, L6, L7, ENS, ITS_AUD, LRJSP, LPAC, EIDAS, LEY6],
};

export default op6s1;
