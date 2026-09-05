import type { ClassifyData, LabMeta, SelectData } from '../labs';

// ---------------------------------------------------------------------------
// Security+ (SY0-701) Domain 5 labs — Halden Port Authority scenario
// ---------------------------------------------------------------------------

export const SP5_LABS: LabMeta[] = [
  {
    id: 'spl5a',
    sectionId: 'sp5',
    title: 'Governance Docs',
    icon: '📚',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Clasifica 12 documentos y frases del programa de seguridad del puerto: policy, standard, procedure o guideline. Necesitas ≥80%.',
    mission: {
      n: 5,
      briefing:
        'Última misión. El consejo de la Autoridad Portuaria convoca una auditoría externa y pide «la documentación del programa de seguridad». Lo que hay es una carpeta compartida con 12 archivos sin clasificar. Ordénalos por lo que realmente son: solo así el auditor verá un programa y no un montón de papeles.',
    },
  },
  {
    id: 'spl5b',
    sectionId: 'sp5',
    title: 'Agreement Desk',
    icon: '📝',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce situaciones con proveedores del puerto. Elige el acuerdo que corresponde: SLA, MOU, MSA, SOW, NDA o BPA. Necesitas ≥80%.',
  },
  {
    id: 'spl5c',
    sectionId: 'sp5',
    title: 'Risk Math',
    icon: '🧮',
    minutes: 8,
    xp: 75,
    kind: 'select',
    brief:
      'Un riesgo cuantificado del puerto, ocho afirmaciones. Elige las 4 correctas sobre SLE, ALE y la decisión de control.',
  },
];

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

export const SP5_CLASSIFY_DATA: Record<string, ClassifyData> = {
  spl5a: {
    passPct: 80,
    categories: [
      { id: 'policy', label: 'Policy' },
      { id: 'standard', label: 'Standard' },
      { id: 'procedure', label: 'Procedure' },
      { id: 'guideline', label: 'Guideline' },
    ],
    items: [
      {
        text: 'Acceptable use policy: staff and contractors must not install unapproved software on port-owned devices.',
        answer: 'policy',
        why: 'Es obligatorio, lo aprueba la dirección y dice qué está permitido y por qué, sin entrar en cómo se comprueba ni con qué herramienta. Esa neutralidad tecnológica es la prueba decisiva: una policy sigue siendo válida aunque cambie el software de inventario.',
      },
      {
        text: 'The Port Authority shall protect the confidentiality, integrity and availability of all cargo manifest data; the Executive Board is accountable for this commitment.',
        answer: 'policy',
        why: 'Declara la intención de la organización y asigna la responsabilidad al máximo nivel: es la information security policy que da autoridad a todo lo demás. No fija ninguna cifra ni ningún paso, así que no puede ser standard ni procedure.',
      },
      {
        text: 'Every suspected security incident affecting port operations must be reported; the Authority will maintain an incident response capability at all times.',
        answer: 'policy',
        why: 'Establece una obligación de alto nivel («debe reportarse», «habrá capacidad de respuesta») aprobada por la dirección, no la secuencia de acciones. El playbook que dice qué teclear al recibir el aviso es otro documento: ese sí es el procedure.',
      },
      {
        text: 'Administrative account passwords must be at least 14 characters and are checked against a breached-password list.',
        answer: 'standard',
        why: 'Es un requisito técnico concreto y medible, obligatorio, que desarrolla lo que la policy exige en abstracto. La prueba está en el número: en cuanto aparece un valor específico y exigible, estás ante un standard.',
      },
      {
        text: 'Traffic between terminal systems and shipping-line partners must use TLS 1.3 with AES-256-GCM; no other cipher suites are permitted.',
        answer: 'standard',
        why: 'Fija exactamente qué configuración es aceptable y prohíbe el resto: es la especificación obligatoria, no la intención. La policy diría «los datos en tránsito deben protegerse»; el standard nombra el protocolo y el cifrado.',
      },
      {
        text: 'Each rack in the port data centre must be protected by a badge reader and covered by recorded CCTV.',
        answer: 'standard',
        why: 'Un standard también puede ser de seguridad física: define el control mínimo exigible para cada rack. Sigue sin explicar cómo se instala ni cómo se solicita el acceso, que es lo que haría un procedure.',
      },
      {
        text: 'Ransomware playbook, step 4: isolate the affected VLAN at the core switch, notify the incident commander on the duty phone, then capture memory before powering anything off.',
        answer: 'procedure',
        why: 'Un playbook numerado es el ejemplo canónico de procedure: instrucciones paso a paso, en orden, para ejecutar durante el incidente. El orden importa —memoria antes de apagar— y esa secuencia operativa es justo lo que nunca vive en una policy.',
      },
      {
        text: 'Offboarding checklist: disable the directory account, collect badge and laptop, transfer file ownership to the line manager, then close the ticket.',
        answer: 'procedure',
        why: 'Onboarding y offboarding son procedures nombrados por el propio objetivo del examen: una lista ordenada de acciones concretas con un responsable. Que sea obligatorio cumplirla no la convierte en standard; lo que la define es que describe el cómo.',
      },
      {
        text: 'To request a firewall change: open a ticket, attach the business justification, obtain CAB approval, and schedule it in the Thursday window.',
        answer: 'procedure',
        why: 'Es el procedure de change management: la ruta concreta que sigue una solicitud desde el ticket hasta la ventana de cambios. La policy de change management diría «ningún cambio en producción sin aprobación»; esto explica cómo se consigue esa aprobación.',
      },
      {
        text: 'We suggest choosing a passphrase of four unrelated words, since it is easier to remember than a random string.',
        answer: 'guideline',
        why: 'El verbo lo delata: «suggest» es recomendación, no obligación, así que nadie incumple nada por ignorarla. El requisito exigible de longitud vive en el standard; esto solo ayuda a cumplirlo con menos fricción.',
      },
      {
        text: 'Where practical, teams are encouraged to review shared-folder permissions each quarter.',
        answer: 'guideline',
        why: '«Where practical» y «encouraged» dejan la decisión en manos del equipo: es una buena práctica recomendada, no una regla auditable. Si el consejo quisiera exigir la revisión trimestral, tendría que escribirla como standard con su cadencia obligatoria.',
      },
      {
        text: 'This document offers recommended practices for securing home-office setups; adoption is at each department discretion.',
        answer: 'guideline',
        why: 'El propio texto declara que la adopción es discrecional, y una guideline es precisamente el documento no vinculante. Por eso un auditor no puede levantar un hallazgo por no seguirla: solo por no cumplir una policy o un standard.',
      },
    ],
  },
  spl5b: {
    passPct: 80,
    categories: [
      { id: 'sla', label: 'SLA' },
      { id: 'mou', label: 'MOU' },
      { id: 'msa', label: 'MSA' },
      { id: 'sow', label: 'SOW' },
      { id: 'nda', label: 'NDA' },
      { id: 'bpa', label: 'BPA' },
    ],
    items: [
      {
        text: 'The port needs the terminal-software vendor bound to 99.9% availability and a four-hour response on critical tickets, with service credits when it is missed.',
        answer: 'sla',
        why: 'Niveles de servicio medibles y penalizaciones por incumplirlos son la definición del service level agreement. Cuando la pregunta menciona uptime, tiempos de respuesta o créditos, la respuesta es SLA y no el contrato marco que lo contiene.',
      },
      {
        text: 'After three slow support responses, legal wants the document that fixes the measurable service levels and the penalties for breaching them.',
        answer: 'sla',
        why: 'Lo que se reclama es la métrica exigible y su consecuencia económica, que es exactamente lo que vive en el SLA. El SOW diría qué se entrega; el SLA dice con qué calidad y en cuánto tiempo se presta el servicio.',
      },
      {
        text: 'The port and the municipal fire service want to record their shared intent to run joint emergency drills; neither side commits budget or enforceable obligations.',
        answer: 'mou',
        why: 'Intención compartida sin obligaciones exigibles ni dinero de por medio es un memorandum of understanding. En cuanto hubiera contraprestación económica y obligaciones vinculantes estaríamos ante un contrato, no ante un MOU.',
      },
      {
        text: 'Two public port authorities agree in writing to cooperate on cyber-incident information sharing; the text states it is not intended to be legally binding.',
        answer: 'mou',
        why: 'El documento declara expresamente que no es vinculante, y esa es la prueba decisiva del MOU frente a cualquier acuerdo contractual. El MOA es su primo más cercano al compromiso, pero aquí el propio texto descarta la obligatoriedad.',
      },
      {
        text: 'Before engaging a consultancy for several unrelated projects over three years, the port wants one umbrella contract fixing liability, payment terms and confidentiality once.',
        answer: 'msa',
        why: 'Un master service agreement es el paraguas que fija de una vez los términos generales para toda la relación. Cada proyecto concreto colgará después de él con su propio SOW, sin renegociar responsabilidad ni condiciones de pago.',
      },
      {
        text: 'Legal wants to stop renegotiating the same general terms with the systems integrator every time a new project starts.',
        answer: 'msa',
        why: 'Ese cansancio de renegociar lo resuelve el MSA: se pacta una sola vez el marco jurídico y comercial de la relación. Confundirlo con el SOW es el error típico, porque el SOW se firma una vez por proyecto y no evita ninguna renegociación de fondo.',
      },
      {
        text: 'Under the existing umbrella contract, the port needs the exact deliverables, milestones and acceptance criteria for the OT segmentation project.',
        answer: 'sow',
        why: 'Entregables, hitos y criterios de aceptación son el contenido propio del statement of work. La pista está en «under the existing umbrella contract»: el marco ya existe (MSA) y lo que falta es el detalle de este trabajo concreto.',
      },
      {
        text: 'The integrator asks what precisely is in scope for this engagement, how many hours are budgeted and when each deliverable is due.',
        answer: 'sow',
        why: 'Alcance, esfuerzo y fechas de entrega definen el trabajo concreto, así que el documento es el SOW (o work order). El SLA respondería con qué calidad se sostiene el servicio después, no qué se construye ahora.',
      },
      {
        text: 'Before showing candidate vendors the port network diagrams and last pentest report during the tender, each of them must be bound to confidentiality.',
        answer: 'nda',
        why: 'Proteger información sensible compartida antes de firmar nada es exactamente para lo que existe el non-disclosure agreement. Se firma en la fase de due diligence, cuando todavía no hay contrato de servicio que regule nada más.',
      },
      {
        text: 'A contractor joining the crane-control project will see proprietary schematics and must be legally prevented from disclosing them.',
        answer: 'nda',
        why: 'La obligación que se busca es de confidencialidad sobre información propietaria, y esa cláusula es el NDA. Un MSA suele incluir confidencialidad, pero cuando el enunciado pide solo impedir la divulgación, el instrumento nombrado es el NDA.',
      },
      {
        text: 'The port and a logistics operator launch a joint container-tracking service and must record each partner responsibilities, contributions and revenue split.',
        answer: 'bpa',
        why: 'Cuando dos organizaciones entran en una relación de socios y reparten responsabilidades y beneficios, el documento es el business partner agreement. No es un MOU porque sí crea obligaciones vinculantes, y no es un MSA porque no hay cliente y proveedor sino dos socios.',
      },
      {
        text: 'Two companies entering a business partnership need to set out their respective roles, liabilities and profit sharing.',
        answer: 'bpa',
        why: 'Roles, responsabilidad legal y reparto de beneficios entre socios son el contenido característico del BPA. La prueba decisiva es la simetría: en un MSA hay quien compra y quien vende; en un BPA ambas partes comparten el negocio.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Select labs
// ---------------------------------------------------------------------------

export const SP5_SELECT_DATA: Record<string, SelectData> = {
  spl5c: {
    pickN: 4,
    prompt:
      'El sistema de gestión de la terminal de contenedores de Halden está valorado en 400.000 €. Un incidente de ransomware destruiría el 25% de su valor (exposure factor 0,25) y se espera una vez cada dos años (ARO 0,5). Un proveedor ofrece un paquete de backup y EDR por 20.000 € al año. De las ocho afirmaciones siguientes, elige las 4 correctas.',
    options: [
      {
        text: 'The SLE for this risk is €100,000.',
        good: true,
        why: '✅ SLE = valor del activo × exposure factor = 400.000 € × 0,25 = 100.000 €. Es la pérdida esperada de un solo incidente, todavía sin contar cuántas veces ocurre al año.',
      },
      {
        text: 'The ALE for this risk is €50,000.',
        good: true,
        why: '✅ ALE = SLE × ARO = 100.000 € × 0,5 = 50.000 €. Como el incidente se espera una vez cada dos años, la pérdida anualizada es la mitad de la de un evento único.',
      },
      {
        text: 'At €20,000 per year the control is financially justified, because it costs less than the €50,000 annual expected loss.',
        good: true,
        why: '✅ La regla del examen es comparar el coste anual del control con el ALE que elimina: 20.000 € < 50.000 €, así que el gasto se sostiene y deja unos 30.000 € de beneficio anual esperado. Si el paquete costara 60.000 €, la decisión correcta sería no comprarlo y buscar otra respuesta al riesgo.',
      },
      {
        text: 'Buying cyber-insurance instead would be a risk transfer, and it would not remove the port duty to protect the data.',
        good: true,
        why: '✅ El seguro traslada el impacto económico a un tercero: eso es transfer, no mitigate. La responsabilidad legal y regulatoria sobre los datos no se puede subcontratar, así que el puerto sigue obligado a proteger la información aunque cobre la póliza.',
      },
      {
        text: 'The SLE is €400,000, because that is what the system is worth.',
        good: false,
        why: '❌ Confunde el valor del activo con la pérdida de un evento: el exposure factor de 0,25 dice que solo se destruye el 25%. El SLE correcto es 400.000 € × 0,25 = 100.000 €; usar los 400.000 € equivaldría a un exposure factor de 1,0, es decir, pérdida total.',
      },
      {
        text: 'The ALE is €200,000.',
        good: false,
        why: '❌ Ese número sale de multiplicar mal (400.000 € × 0,5) o de sumar eventos que no ocurren. La cadena correcta es primero SLE = 400.000 € × 0,25 = 100.000 € y después ALE = 100.000 € × 0,5 = 50.000 €.',
      },
      {
        text: 'An ARO of 0.5 means the event happens twice a year.',
        good: false,
        why: '❌ El ARO es el número de eventos por año, no el intervalo entre ellos: 0,5 significa medio evento al año, o sea una vez cada dos años. Dos veces al año sería un ARO de 2, que dispararía el ALE hasta 200.000 €.',
      },
      {
        text: 'Because the CVSS score of the underlying vulnerability is 9.8, the risk must be accepted as critical regardless of the numbers.',
        good: false,
        why: '❌ El CVSS puntúa la severidad técnica de una vulnerabilidad, no el riesgo del negocio, que depende del valor del activo, la exposición y la frecuencia. Además «aceptar» es una estrategia de respuesta concreta —asumir la pérdida y documentarla—, no una etiqueta que se derive de una puntuación.',
      },
    ],
  },
};
