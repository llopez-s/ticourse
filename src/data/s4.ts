import type { Module } from '../lib/types';

export const S4_MODULES: Module[] = [
  // -------------------------------------------------------------------------
  {
    id: 's4m1',
    sectionId: 's4',
    title: 'Sesgos cognitivos del analista',
    minutes: 13,
    objectives: [
      'Reconocer los sesgos que más dañan el análisis CTI',
      'Detectarlos en afirmaciones reales de analistas',
      'Aplicar contramedidas estructuradas',
    ],
    blocks: [
      {
        t: 'p',
        md: 'El instrumento de medida en CTI eres **tú**: tu cerebro percibe, recuerda y conecta — y lo hace con atajos (*heurísticas*) que funcionan en la vida diaria pero traicionan al análisis. Richards Heuer (CIA, *Psychology of Intelligence Analysis*) lo resumió: los sesgos no se eliminan con fuerza de voluntad; se **mitigan con estructura** (S4M3).',
      },
      {
        t: 'table',
        headers: ['Sesgo', 'Qué hace', 'Ejemplo CTI'],
        rows: [
          [
            'Confirmation bias',
            'Buscas/pesas evidencia que confirma tu hipótesis inicial',
            '«Ya dijimos que era APT-X; este nuevo log también lo confirma» (lo lees forzado)',
          ],
          [
            'Anchoring',
            'El primer dato encuadra todo lo demás',
            'El primer informe dijo «Rusia» y toda evidencia posterior se interpreta desde ahí',
          ],
          [
            'Availability',
            'Lo reciente/memorable parece lo más probable',
            '«Hay ransomware en todas las noticias → esto será ransomware»',
          ],
          [
            'Mirror imaging',
            'Asumes que el adversario razona como tú',
            '«Nadie quemaría un 0-day en un objetivo tan pequeño» — tú no lo harías; ellos quizá sí',
          ],
          [
            'Hindsight bias',
            'Tras saber el resultado, «siempre fue obvio»',
            '«Era evidente que entrarían por el VPN» — nadie lo dijo antes',
          ],
          [
            'Base-rate neglect',
            'Ignoras la frecuencia real de fondo',
            'Horario UTC+8 ⇒ «es China» — millones de personas operan en UTC+8',
          ],
        ],
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'El más letal',
        md: '**Confirmation bias** es el asesino silencioso de los análisis de atribución: una vez el equipo "sabe" quién fue, cada dato nuevo se dobla para encajar. Por eso ACH (S4M3) obliga a intentar **refutar** hipótesis en vez de confirmarlas.',
      },
      {
        t: 'list',
        items: [
          '**Contramedidas**: técnicas estructuradas (ACH, Key Assumptions Check), revisión por pares hostil (red team analítico), registrar juicios *antes* de conocer el desenlace, lenguaje estimativo explícito y diversidad cognitiva en el equipo.',
        ],
      },
      {
        t: 'check',
        q: {
          q: 'An analyst writes: "Activity occurred during UTC+8 business hours, so the operator is certainly Chinese state-sponsored." The PRIMARY reasoning failure is:',
          choices: [
            'Hindsight bias',
            'Base-rate neglect plus overconfidence — timezone is weak, non-diagnostic evidence',
            'Mirror imaging',
            'There is no failure; timezones are conclusive',
          ],
          answer: 1,
          explain:
            'Billions of people and many actors operate in UTC+8, and timestamps are forgeable. Treating weak evidence as conclusive ignores base rates (and invites false flags).',
        },
      },
      {
        t: 'check',
        q: {
          q: '"A sophisticated actor would never reuse infrastructure, so these incidents must be unrelated." This is:',
          choices: [
            'Mirror imaging — assuming the adversary follows your logic of what is "professional"',
            'Availability bias',
            'Anchoring',
            'Sound analytic reasoning',
          ],
          answer: 0,
          explain:
            'Projecting your own standards onto the adversary is mirror imaging. Real actors make opsec mistakes constantly.',
        },
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Te darán una frase de analista y pedirán **identificar el sesgo**. Claves: «confirma lo que ya pensábamos» → confirmation; «el primer informe decía…» → anchoring; «está en todas las noticias» → availability; «ningún actor racional haría…» → mirror imaging.',
      },
    ],
    quiz: [
      {
        id: 's4m1q1',
        domain: 'Analysis',
        prompt:
          'After an early vendor report names Group X, the team interprets every subsequent artifact as Group X activity despite contradictions. This is primarily:',
        choices: ['Availability bias', 'Anchoring plus confirmation bias', 'Hindsight bias', 'Base-rate neglect'],
        answer: 1,
        explain:
          'The first label anchored the analysis; subsequent evidence is bent to confirm it. The classic attribution failure pattern.',
      },
      {
        id: 's4m1q2',
        domain: 'Analysis',
        prompt:
          'Why can biases NOT be removed by simply being aware of them?',
        choices: [
          'Because they are useful',
          'Because they operate pre-consciously in perception and memory; only structured external process reliably counters them',
          'Because analysts are poorly trained',
          'They can be removed with enough coffee',
        ],
        answer: 1,
        explain:
          'Heuer\'s core point: cognition itself is biased. Structure (SATs, peer review, explicit hypotheses) is the countermeasure, not willpower.',
      },
      {
        id: 's4m1q3',
        domain: 'Analysis',
        prompt:
          '"Last quarter three peers were hit by ransomware, so this anomalous SMB traffic is probably ransomware staging" — before checking alternatives. Which bias?',
        choices: ['Availability', 'Mirror imaging', 'Hindsight', 'Sunk cost'],
        answer: 0,
        explain:
          'Recent, memorable events inflate perceived probability. The traffic deserves hypothesis testing, not headline-driven conclusion.',
      },
      {
        id: 's4m1q4',
        domain: 'Analysis',
        prompt:
          'A post-incident review concludes "the entry vector was obvious; the SOC was negligent," though no pre-incident document flagged it. The review suffers from:',
        choices: ['Base-rate neglect', 'Hindsight bias', 'Anchoring', 'Authority bias'],
        answer: 1,
        explain:
          'Knowing the outcome makes the path look inevitable. Fair reviews evaluate decisions against information available at the time.',
      },
      {
        id: 's4m1q5',
        domain: 'Analysis',
        prompt: 'Which practice BEST counters confirmation bias in attribution work?',
        choices: [
          'Assigning the analysis to one senior expert',
          'Explicitly competing multiple hypotheses and seeking evidence that would REFUTE the favorite (ACH)',
          'Reading more reports that mention the suspected group',
          'Waiting for law enforcement',
        ],
        answer: 1,
        explain:
          'ACH inverts the instinct: instead of confirming the pet hypothesis, you try to knock each hypothesis down with disconfirming evidence.',
      },
      {
        id: 's4m1q6',
        domain: 'Analysis',
        prompt:
          'Registering analytic judgments in writing BEFORE outcomes are known primarily mitigates:',
        choices: [
          'Anchoring',
          'Hindsight bias — and enables honest calibration of the team over time',
          'Availability bias',
          'Mirror imaging',
        ],
        answer: 1,
        explain:
          'Written, timestamped judgments prevent retrospective "we always knew" and create a calibration record.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's4m2',
    sectionId: 's4',
    title: 'Falacias lógicas aplicadas a CTI',
    minutes: 11,
    objectives: [
      'Distinguir falacias (errores de argumentación) de sesgos (errores de cognición)',
      'Identificar las falacias más comunes en informes y debates CTI',
      'Blindar tus propios argumentos analíticos',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Los **sesgos** distorsionan cómo percibes; las **falacias** rompen cómo argumentas. Un informe puede partir de evidencia sólida y arruinarse en la cadena lógica. Estas son las que más aparecen en CTI:',
      },
      {
        t: 'table',
        headers: ['Falacia', 'Estructura', 'Ejemplo CTI'],
        rows: [
          [
            'Appeal to authority',
            '«Lo dice X, luego es verdad»',
            '«VendorCo lo atribuye a APT-Z, caso cerrado» — sin evaluar su evidencia',
          ],
          [
            'Ad hominem',
            'Atacar la fuente en lugar del contenido',
            '«Ese informe viene de un vendor pequeño, ignóralo» — la evidencia era buena',
          ],
          [
            'Post hoc ergo propter hoc',
            'B siguió a A ⇒ A causó B',
            '«Publicamos el informe y el actor desapareció: nuestro informe lo expulsó»',
          ],
          [
            'Hasty generalization',
            'Muestra mínima ⇒ regla general',
            '«Esta muestra usa DGA ⇒ toda la familia usa DGA»',
          ],
          [
            'False dilemma',
            'Solo dos opciones cuando hay más',
            '«O es un estado o es un script kiddie»',
          ],
          [
            'Circular reasoning',
            'La conclusión es una premisa',
            '«Es APT-X porque usa TTPs de APT-X» (TTPs definidos por… este incidente)',
          ],
        ],
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'El bucle circular del threat intel',
        md: 'La falacia circular tiene una variante industrial: el **eco de feeds**. Vendor A publica una atribución tentativa; B la cita; C cita a B; A ve «consenso» y sube su confianza. Tres fuentes, cero evidencias nuevas. Cuenta **evidencia independiente**, no repeticiones.',
      },
      {
        t: 'p',
        md: 'Matiz importante: evaluar la **fiabilidad de una fuente** es legítimo y necesario (no es ad hominem). La falacia aparece cuando la identidad de la fuente *sustituye* a la evaluación de su evidencia. «Viene de un vendor con historial de exageración, **así que revisemos su evidencia con lupa**» es rigor; «viene de ese vendor, **luego es falso**» es falacia.',
      },
      {
        t: 'check',
        q: {
          q: '"Three vendors say it is Group Y, so it must be Group Y." If all three trace back to one original report, this argument is:',
          choices: [
            'Strong corroboration',
            'An appeal to authority resting on circular citation — one source counted three times',
            'A valid statistical inference',
            'Ad hominem',
          ],
          answer: 1,
          explain:
            'Independence is what makes corroboration. Citation chains create false consensus from a single evidence base.',
        },
      },
      {
        t: 'check',
        q: {
          q: '"After we deployed the new EDR, no APT activity was detected for a month — the EDR stopped them." The reasoning gap is:',
          choices: [
            'Post hoc ergo propter hoc — absence of detection after deployment does not prove causation (or even absence of activity)',
            'False dilemma',
            'Hasty generalization',
            'No gap; the conclusion follows',
          ],
          answer: 0,
          explain:
            'Sequence is not causation: the actor may be dormant, undetected, or finished. Classic post hoc.',
        },
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Diferencia **bias** (cognición: confirmation, anchoring, mirror imaging…) de **fallacy** (argumentación: ad hominem, post hoc, circular…). El examen mezcla ambos en la misma pregunta.',
      },
    ],
    quiz: [
      {
        id: 's4m2q1',
        domain: 'Analysis',
        prompt:
          '"This report must be wrong — it was written by a junior analyst." Evaluating ONLY the author rather than the evidence is:',
        choices: ['Post hoc', 'Ad hominem', 'False dilemma', 'Circular reasoning'],
        answer: 1,
        explain:
          'Dismissing content because of its source is ad hominem. Source reliability informs scrutiny, never replaces evaluation.',
      },
      {
        id: 's4m2q2',
        domain: 'Analysis',
        prompt:
          'Defining a group by the TTPs of one incident, then attributing that incident to the group because the TTPs match, is:',
        choices: ['Hasty generalization', 'Appeal to authority', 'Circular reasoning', 'Availability bias'],
        answer: 2,
        explain:
          'The conclusion (it is Group X) is smuggled into the premise (these are Group X TTPs). The definition and the attribution must rest on independent evidence.',
      },
      {
        id: 's4m2q3',
        domain: 'Analysis',
        prompt:
          'Concluding an entire malware family communicates over DNS after analyzing a single sample is:',
        choices: ['Hasty generalization', 'Post hoc', 'False dilemma', 'Mirror imaging'],
        answer: 0,
        explain:
          'One sample is a tiny, possibly unrepresentative sample of a family. Variants differ — generalize only with sufficient sampling.',
      },
      {
        id: 's4m2q4',
        domain: 'Analysis',
        prompt:
          '"Either we attribute this publicly to a nation-state, or we admit we know nothing." The flaw is:',
        choices: [
          'False dilemma — intermediate options (activity-group tracking, confidence-bounded assessments) exist',
          'Appeal to authority',
          'Ad hominem',
          'Sound reasoning',
        ],
        answer: 0,
        explain:
          'Attribution is a spectrum (machine→operator→sponsor, with confidence levels), not a binary.',
      },
      {
        id: 's4m2q5',
        domain: 'Analysis',
        prompt:
          'What converts "VendorCo attributes this to APT-Z" from fallacy into legitimate evidence?',
        choices: [
          'VendorCo\'s market share',
          'Independently evaluating VendorCo\'s published evidence and methodology, and weighing its visibility and track record',
          'Two more vendors repeating the claim',
          'The confidence of the press release',
        ],
        answer: 1,
        explain:
          'Authority is not evidence; evaluated evidence is. Sources earn weight through methodology and track record, and even then their data must be examined.',
      },
      {
        id: 's4m2q6',
        domain: 'Analysis',
        prompt:
          'The "feed echo" problem — many feeds repeating one origin — undermines which analytic principle?',
        choices: [
          'Timeliness',
          'Independence of corroborating sources',
          'Need to know',
          'Defense in depth',
        ],
        answer: 1,
        explain:
          'Corroboration requires independent evidence chains. Recirculated copies of one report add zero corroborative weight.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's4m3',
    sectionId: 's4',
    title: 'Técnicas estructuradas y ACH',
    minutes: 14,
    objectives: [
      'Conocer las SATs principales y cuándo usarlas',
      'Ejecutar Analysis of Competing Hypotheses paso a paso',
      'Entender diagnosticidad y por qué ACH refuta en vez de confirmar',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Las **Structured Analytic Techniques (SATs)** externalizan el razonamiento: lo sacan de tu cabeza (donde mandan los sesgos) y lo ponen en una estructura revisable. Algunas esenciales:',
      },
      {
        t: 'list',
        items: [
          '**Key Assumptions Check** — lista los supuestos implícitos del análisis y pregúntate: ¿y si este es falso?',
          '**Devil\'s Advocacy** — alguien defiende formalmente la posición contraria a la del equipo.',
          '**What-If Analysis** — asume que ocurrió el escenario improbable y razona hacia atrás qué señales verías.',
          '**Brainstorming estructurado** — generar hipótesis ANTES de pesar evidencia, para no casarse con la primera.',
          '**ACH** — la reina: análisis de hipótesis en competencia.',
        ],
      },
      { t: 'h', text: 'Analysis of Competing Hypotheses (ACH)' },
      {
        t: 'p',
        md: 'Creada por Richards Heuer. La idea que lo cambia todo: en lugar de buscar evidencia que **confirme** tu hipótesis favorita, construyes una matriz y tratas de **refutar todas**. Gana la que sobrevive con menos inconsistencias.',
      },
      {
        t: 'list',
        ordered: true,
        items: [
          'Genera **todas las hipótesis** plausibles (con el equipo, no en solitario).',
          'Lista la **evidencia** y los argumentos relevantes.',
          'Construye la **matriz**: evalúa cada evidencia contra cada hipótesis — Consistente (C), Inconsistente (I) o Neutral (N).',
          'Analiza la **diagnosticidad**: la evidencia consistente con TODAS las hipótesis no discrimina nada (vale poco).',
          'Refina, elimina hipótesis con inconsistencias letales.',
          'Concluye con la **menos inconsistente** — no la "más confirmada".',
          'Haz análisis de **sensibilidad**: ¿qué pieza de evidencia, si fuera falsa, cambiaría la conclusión? Vigílala.',
          'Reporta la conclusión **y** las alternativas descartadas con su porqué.',
        ],
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'Diagnosticidad: el concepto estrella',
        md: '«El actor usa phishing» es consistente con espionaje, crimen y hacktivismo a la vez → **diagnosticidad nula**. «No hay monetización tras 6 meses de acceso» es inconsistente con motivación financiera → **alta diagnosticidad**. ACH te entrena a valorar la evidencia por su poder de *discriminar*, no por su dramatismo.',
      },
      { t: 'h', text: 'La matriz, leída' },
      {
        t: 'p',
        md: 'Un extracto de la matriz ACH de VELVET CICADA (la versión completa la trabajarás en el Lab 4B). Tres hipótesis, cuatro piezas de evidencia. Lee la columna de la derecha: **la diagnosticidad de cada fila importa más que el número de C**.',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Extracto de matriz ACH — VELVET CICADA (ficticio)',
        text: `C = Consistente | I = Inconsistente | N = Neutral
H1 = espionaje estatal-industrial
H2 = ransomware/crimen financiero
H3 = hacktivismo/insider

EVIDENCIA                                    | H1 | H2 | H3 | Diagnosticidad
---------------------------------------------+----+----+----+---------------
E1 Entrada por spearphishing                 | C  | C  | C  | NULA (no discrimina)
E2 6 meses de acceso, cero cifrado/extorsión | C  | I  | N  | ALTA (mata H2)
E3 Exfil selectiva de diseños de propulsión  | C  | I  | I  | ALTA
E4 Cert TLS compartido con campaña de
   espionaje reportada por el ISAC            | C  | I  | I  | ALTA (strong link)
---------------------------------------------+----+----+----+---------------
Inconsistencias:                               0    3    2

Sensibilidad: si E4 fuera un false flag plantado,
H1 seguiría siendo la menos inconsistente por E2+E3.`,
      },
      {
        t: 'p',
        md: 'Cómo se lee. Gana **H1 por ser la menos inconsistente** (0 vs 3 vs 2) — no «la más confirmada»: nadie *prueba* una hipótesis, se eliminan las demás. **E1 no aporta nada**: es C con las tres, diagnosticidad nula — la evidencia más «obvia» a menudo no discrimina. El trabajo pesado lo hacen **E2, E3 y E4**, que son *I* para las alternativas. Y el **análisis de sensibilidad** es la póliza anti-decepción: E4 es el strong link, justo el tipo de evidencia que un actor podría **plantar** (S4M5, PAPER CRANE) — por eso se comprueba qué pasa si cae. Aquí la conclusión aguanta sin E4, así que es robusta. Si dependiera solo de E4, tu confianza tendría que bajar.',
      },
      {
        t: 'check',
        q: {
          q: 'In this matrix, which row has the HIGHEST diagnostic value and which has essentially ZERO — and why can the zero-diagnosticity row not support the conclusion?',
          choices: [
            'E1 is highest; E4 is zero',
            'E2 (or E3/E4) is highest; E1 is zero — "used spearphishing" is consistent with all three hypotheses, so it discriminates nothing',
            'All rows are equal',
            'E4 is zero because it is a strong link',
          ],
          answer: 1,
          explain:
            'Rows that are Inconsistent with alternatives (E2/E3/E4) do the discriminating work. E1 is Consistent with every hypothesis → zero diagnosticity → it cannot favor any hypothesis.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'If E4 (the shared TLS cert) turns out to be a planted false flag, what happens to the conclusion?',
          choices: [
            'It collapses — H1 was entirely dependent on E4',
            'It holds: H1 is still least-inconsistent on E2+E3, which is exactly what the sensitivity line checks',
            'H2 now wins automatically',
            'The matrix must be discarded',
          ],
          answer: 1,
          explain:
            'Sensitivity analysis asks which single item, if false, flips the answer. Here E2+E3 still eliminate H2/H3, so the conclusion is robust to losing E4 — a deception-resistant result.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'In ACH, the winning hypothesis is the one:',
          choices: [
            'With the most consistent evidence',
            'With the FEWEST inconsistencies after attempting to refute all hypotheses',
            'Proposed by the most senior analyst',
            'That matches the latest vendor report',
          ],
          answer: 1,
          explain:
            'ACH is refutation-driven: consistent evidence piles up easily (confirmation bias); inconsistencies are what eliminate hypotheses.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Evidence that is consistent with every hypothesis in the matrix:',
          choices: [
            'Proves all hypotheses',
            'Has low diagnostic value — it cannot discriminate between them',
            'Should be weighted double',
            'Eliminates the need for more evidence',
          ],
          answer: 1,
          explain:
            'Diagnosticity = power to discriminate. Universal evidence (e.g., "uses phishing") moves nothing.',
        },
      },
      {
        t: 'callout',
        kind: 'story',
        title: '🎖️ Campaña',
        md: 'En el **Lab 4B: ACH Matrix** enfrentarás tres hipótesis sobre VELVET CICADA (espionaje estatal, crimen financiero, hacktivismo/insider) contra ocho piezas de evidencia. PAPER CRANE ha sembrado señuelos: solo la disciplina ACH los atraviesa.',
      },
    ],
    quiz: [
      {
        id: 's4m3q1',
        domain: 'Analysis',
        prompt: 'The FIRST step of ACH is:',
        choices: [
          'Rating evidence against your preferred hypothesis',
          'Generating the full set of plausible competing hypotheses',
          'Writing the conclusion',
          'Collecting more data',
        ],
        answer: 1,
        explain:
          'Hypothesis generation comes first — ideally as a group — so evidence is later judged against ALL candidates, not one favorite.',
      },
      {
        id: 's4m3q2',
        domain: 'Analysis',
        prompt: 'Why does ACH focus on INCONSISTENT evidence?',
        choices: [
          'Inconsistencies are easier to find',
          'Confirming evidence accumulates for many hypotheses at once, while inconsistencies actively eliminate hypotheses',
          'Consistent evidence is usually fabricated',
          'It reduces the matrix size',
        ],
        answer: 1,
        explain:
          'Heuer: you cannot prove a hypothesis by piling up consistent facts (they often fit rivals too); you can disprove with solid inconsistencies.',
      },
      {
        id: 's4m3q3',
        domain: 'Analysis',
        prompt:
          'A "Key Assumptions Check" on the assessment "the actor cannot reach the OT network" would ask:',
        choices: [
          'Who wrote the assessment?',
          'What unstated assumptions (e.g., "the IT/OT segmentation works as documented") underpin it, and what happens if each is wrong?',
          'Which font the report uses',
          'Whether the actor agrees',
        ],
        answer: 1,
        explain:
          'KAC surfaces the invisible load-bearing assumptions and stress-tests the analysis against their failure.',
      },
      {
        id: 's4m3q4',
        domain: 'Analysis',
        prompt:
          'Sensitivity analysis at the end of ACH identifies:',
        choices: [
          'The most junior analyst',
          'Which pieces of evidence, if wrong or deceptive, would flip the conclusion — so they get extra scrutiny and monitoring',
          'The cheapest collection source',
          'How fast the report can be published',
        ],
        answer: 1,
        explain:
          'Conclusions resting on one or two linchpin items are fragile; sensitivity analysis flags those items explicitly.',
      },
      {
        id: 's4m3q5',
        domain: 'Analysis',
        prompt:
          'Which evidence item has the HIGHEST diagnosticity between "state espionage" and "ransomware affiliate" hypotheses?',
        choices: [
          'The actor sent phishing emails',
          'The actor used PowerShell',
          'Six months of access with data staging and zero encryption or extortion attempts',
          'Activity occurred on weekdays',
        ],
        answer: 2,
        explain:
          'Long quiet collection without monetization is strongly inconsistent with ransomware economics — it discriminates. Phishing/PowerShell/weekdays fit both.',
      },
      {
        id: 's4m3q6',
        domain: 'Analysis',
        prompt: 'A completed ACH should be reported as:',
        choices: [
          'Only the winning hypothesis, stated as fact',
          'The least-inconsistent hypothesis with confidence level, PLUS the rejected alternatives and why they fell',
          'The full raw matrix with no conclusion',
          'A list of IOCs',
        ],
        answer: 1,
        explain:
          'Transparent reasoning — including what was considered and rejected — lets consumers weigh the judgment and future analysts revisit it.',
      },
      {
        id: 's4m3q7',
        domain: 'Analysis',
        prompt:
          'Evidence "consistent with espionage" (H1) does NOT prove espionage because:',
        choices: [
          'Consistency is fabricated evidence',
          'Consistency accumulates for several hypotheses at once; only inconsistency eliminates — proof comes from what the evidence rules OUT',
          'Espionage is never the answer',
          'ACH ignores consistent evidence entirely',
        ],
        answer: 1,
        explain:
          'ACH is refutation-driven. Many hypotheses can be consistent with the same fact; the discriminating power lives in inconsistencies that kill rivals, not in piling up confirmations.',
      },
      {
        id: 's4m3q8',
        domain: 'Analysis',
        prompt:
          'Given columns of inconsistency counts H1=0, H2=3, H3=2, ACH concludes:',
        choices: [
          'H2, because it has the most entries',
          'H1, the least-inconsistent hypothesis',
          'H3, as a compromise',
          'No conclusion is possible from counts',
        ],
        answer: 1,
        explain:
          'The surviving hypothesis is the one with the fewest inconsistencies after trying to refute all — here H1 with zero. It is "least wrong," not "most confirmed."',
      },
      {
        id: 's4m3q9',
        domain: 'Analysis',
        prompt:
          'The team keeps unconsciously assuming the intruder is state-sponsored, skewing every reading. Which SAT most directly targets this?',
        choices: [
          'What-If Analysis',
          'Key Assumptions Check — surface and challenge the implicit assumptions',
          'Brainstorming',
          'Devil\'s Advocacy',
        ],
        answer: 1,
        explain:
          'A Key Assumptions Check lists the implicit premises (e.g., "this is state-sponsored") and asks what follows if each is false — the precise remedy for an unexamined baseline.',
      },
      {
        id: 's4m3q10',
        domain: 'Analysis',
        prompt:
          'A hypothesis has five Consistent marks and one lethal Inconsistency. ACH says:',
        choices: [
          'Five-to-one, so it wins',
          'A single solid inconsistency can eliminate it despite many consistencies — inconsistencies carry the eliminating weight',
          'Consistencies and inconsistencies cancel out',
          'It must be re-scored until consistent',
        ],
        answer: 1,
        explain:
          'One well-established inconsistency refutes a hypothesis regardless of how many consistent items it has; consistencies do not "outvote" a genuine contradiction.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's4m4',
    sectionId: 's4',
    title: 'Clustering, activity groups y el zoo de nombres',
    minutes: 12,
    objectives: [
      'Construir activity groups con criterios analíticos defendibles',
      'Navegar la proliferación de nombres entre vendors',
      'Evitar fusiones y confusiones (grupo ≠ malware ≠ campaña)',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Agrupar intrusiones (S2M4) a escala produce **intrusion sets / activity groups**: conjuntos de actividad que se comportan como una unidad analítica. Hacerlo bien exige **criterios explícitos**: ¿agrupamos por capability? ¿por infraestructura? ¿por victimología? Cambiar de criterio a mitad de camino fabrica monstruos: grupos que mezclan actores distintos.',
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'El zoo de nombres',
        md: 'Cada vendor nombra **su propia visibilidad**: el «APT28» de uno y el «Fancy Bear» de otro se solapan mucho — pero **no son por definición lo mismo**, porque cada uno agrupó con datos y criterios distintos. Las tablas «Rosetta» de equivalencias son aproximaciones útiles y peligrosas: fusionar clusters ajenos sin ver su evidencia importa los errores de todos.',
      },
      {
        t: 'table',
        headers: ['Concepto', 'Qué es', 'Error común'],
        rows: [
          [
            'Activity group / intrusion set',
            'Cluster analítico de intrusiones enlazadas por criterios definidos',
            'Tratarlo como una "organización" con empleados',
          ],
          [
            'Campaign',
            'Subconjunto de actividad con objetivo y marco temporal acotados',
            'Confundir una campaña con todo el grupo',
          ],
          [
            'Malware family',
            'Código; puede venderse, compartirse o robarse',
            '«Usa PlugX ⇒ es el grupo X» — el malware compartido no define grupos',
          ],
          [
            'Threat actor (persona/org)',
            'Entidad del mundo real detrás (operadores, sponsor)',
            'Saltar del cluster técnico a personas sin evidencia adicional',
          ],
        ],
      },
      {
        t: 'p',
        md: 'Disciplina de mantenimiento: los clusters **evolucionan**. Documenta los criterios de inclusión, registra qué evidencia metió cada intrusión, y revisa cuando llegue evidencia contradictoria. Divide (split) cuando un cluster mezcla; fusiona (merge) solo con enlaces fuertes en *múltiples* vértices del diamante.',
      },
      { t: 'h', text: 'Dos clusters sobre la mesa' },
      {
        t: 'p',
        md: 'La decisión merge/split, en concreto. Dos dossiers de cluster que aterrizan en tu mesa; cada feature etiquetada por su fuerza como enlace. La pregunta: ¿son el mismo actor?',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Dossiers de cluster A vs B — decisión de fusión (ficticio)',
        text: `                        CLUSTER-A            CLUSTER-B
                        (Meridian)           (Orbital-2)
------------------------+--------------------+--------------------
Loader / weaponizer     GLASS VIPER          Async RAT commodity   [B: WEAK]
PDB path                D:\\proj\\cicada\\...   (ninguno)             [A: STRONG]
C2                      update-svc-cdn.com   varios dinámicos DNS  [neutral]
Cert TLS                autofirmado reusado  (no observado)        [A: STRONG]
Registrar de dominios   NameFlow LLC         GoDaddy               [distinto]
Victimología            propulsión aeroesp.  RRHH aeroespacial     [WEAK: solo sector]
IP solapada             198.51.100.84 (shared hosting, 300+ dominios) [WEAK]
Actividad               nov-2025 → mar-2026  abr-2026 → hoy        [neutral]
------------------------+--------------------+--------------------
¿Enlaces fuertes compartidos en varios vértices? → NO
Único solape: una IP de shared hosting + mismo sector.
VEREDICTO: mantener SEPARADOS, documentar criterios. Revisar si aparece
un weaponizer o cert compartido.`,
      },
      {
        t: 'p',
        md: 'El veredicto se sostiene sobre qué enlaces **comparten**, no sobre cuántos features tienen. El único solape es una **IP de shared hosting** (300+ dominios de terceros — enlace débil, como enseñó S3M3) y el **mismo sector** (débil: media industria aeroespacial comparte sector; recuerda la lección DNC de S5M4, donde dos grupos distintos golpearon la misma víctima). Los enlaces que *de verdad* pesan — el weaponizer propio, el PDB path, el cert autofirmado reutilizado — **no aparecen en B**. Fusionar aquí importaría en tu cluster limpio un RAT commodity y una victimología distinta: fabricarías un monstruo. Regla: **merge solo con enlaces fuertes en múltiples vértices**; ante la duda, mantener separados y documentar el criterio, que es reversible. Y el nombre de cada cluster es una **etiqueta analítica, no una organización**.',
      },
      {
        t: 'check',
        q: {
          q: 'The only overlap between A and B is one shared-hosting IP (300+ tenant domains). Does that justify a merge?',
          choices: [
            'Yes — a shared IP is a strong link',
            'No — shared-hosting IPs connect hundreds of unrelated tenants; it is a weak link, not multi-vertex evidence',
            'Yes — any infrastructure overlap merges clusters',
            'Only if they are in the same country',
          ],
          answer: 1,
          explain:
            'Shared hosting is high-noise (per S3M3): many tenants, no actor control implied. A merge needs rare, actor-controlled links across multiple Diamond vertices.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'A and B both hit aerospace suppliers but use different tradecraft, tooling, and registrars. The right call is:',
          choices: [
            'Merge — same sector means same actor',
            'Track separately — shared victimology (sector) is a weak link; distinct tradecraft argues against a common actor (cf. the DNC dual-intrusion lesson)',
            'Delete cluster B',
            'Rename B to match A',
          ],
          answer: 1,
          explain:
            'Two distinct actors can target the same sector — or even the same victim (DNC). Sector overlap alone is weak; different tradecraft across vertices supports keeping them apart.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Two vendors publish "Group A" and "Group B" with 70% overlapping indicators. The analytically sound position is:',
          choices: [
            'They are the same group; merge them',
            'Track them as related-but-distinct clusters until your own evidence justifies a merge under explicit criteria',
            'Ignore both names',
            'Adopt whichever name is more famous',
          ],
          answer: 1,
          explain:
            'Different visibility + different clustering criteria = different clusters. Partial overlap is expected; merging requires your own analytic justification.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Multiple unrelated intrusions all drop the same commodity RAT sold in forums. Clustering them as one actor based on the RAT alone fails because:',
          choices: [
            'RATs cannot be detected',
            'Shared/sold capability is a weak link — many actors buy the same tool',
            'Forums are TLP:RED',
            'It violates the kill chain',
          ],
          answer: 1,
          explain:
            'Commodity malware appears across unrelated actors. Strong clustering needs rare, actor-controlled features across multiple Diamond vertices.',
        },
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Frases clave: los nombres de grupo son **etiquetas de cluster, no organizaciones**; el malware compartido **no** define grupos; merge/split exige criterios explícitos y enlaces fuertes.',
      },
    ],
    quiz: [
      {
        id: 's4m4q1',
        domain: 'Analysis',
        prompt: 'A vendor\'s named group (e.g., "GLASS VIPER") fundamentally represents:',
        choices: [
          'A legally identified organization',
          'That vendor\'s analytic cluster of related activity, built from its own visibility and criteria',
          'A malware family',
          'A government attribution',
        ],
        answer: 1,
        explain:
          'Group names label clusters of observed activity. Different vendors cluster differently because they see differently.',
      },
      {
        id: 's4m4q2',
        domain: 'Analysis',
        prompt: 'Why is "uses the same malware" weak evidence for clustering?',
        choices: [
          'Malware analysis is unreliable',
          'Malware is sold, shared, leaked and stolen — multiple unrelated actors operate identical families',
          'Malware changes its hash',
          'It is actually the strongest evidence',
        ],
        answer: 1,
        explain:
          'Capability transfers between actors. Clustering needs convergence across vertices: infrastructure patterns, victimology, tradecraft.',
      },
      {
        id: 's4m4q3',
        domain: 'Analysis',
        prompt: 'A CAMPAIGN differs from an ACTIVITY GROUP in that a campaign is:',
        choices: [
          'Larger and permanent',
          'A time-bounded, objective-bounded subset of activity, while the group is the enduring cluster',
          'Only used for nation-states',
          'A synonym',
        ],
        answer: 1,
        explain:
          'Campaigns are operations within a group\'s history — bounded in time and objective.',
      },
      {
        id: 's4m4q4',
        domain: 'Analysis',
        prompt:
          'New evidence shows half of a tracked cluster uses different infrastructure patterns, victimology, and hours. Best practice is to:',
        choices: [
          'Ignore it to keep reporting consistent',
          'Consider SPLITTING the cluster and document the revised criteria and evidence',
          'Merge with another vendor\'s group',
          'Rename the group',
        ],
        answer: 1,
        explain:
          'Clusters are living analytic constructs: split when internal coherence breaks, with documented reasoning.',
      },
      {
        id: 's4m4q5',
        domain: 'Analysis',
        prompt:
          'The safest use of public "Rosetta stone" name-mapping tables is:',
        choices: [
          'Authoritative merging of all listed groups',
          'A navigation aid for reading reports, while maintaining your own clusters on your own evidence',
          'A replacement for internal tracking',
          'Legal attribution',
        ],
        answer: 1,
        explain:
          'Mappings help you read the ecosystem. Your tracking should rest on evidence you can defend.',
      },
      {
        id: 's4m4q6',
        domain: 'Analysis',
        prompt:
          'Which combination BEST justifies merging two internally tracked clusters?',
        choices: [
          'Both use phishing and Cobalt Strike',
          'Strong links on several Diamond vertices: shared unique weaponizer, same infrastructure registration pattern, and consistent victimology over time',
          'A tweet claims they are the same',
          'They have similar names',
        ],
        answer: 1,
        explain:
          'Merges demand convergent, rare, multi-vertex evidence — not commodity tooling or rumor.',
      },
      {
        id: 's4m4q7',
        domain: 'Analysis',
        prompt:
          'Which single NEW piece of evidence would most justify merging Cluster-A and Cluster-B?',
        choices: [
          'A second shared-hosting IP overlap',
          'The same custom weaponizer, or the reused self-signed TLS cert, appearing in B',
          'Both targeting aerospace again',
          'B registering a domain at NameFlow LLC once',
        ],
        answer: 1,
        explain:
          'A shared bespoke weaponizer or reused actor-controlled cert is a strong, rare, multi-vertex link. More shared-hosting overlap or sector match stays weak.',
      },
      {
        id: 's4m4q8',
        domain: 'Analysis',
        prompt:
          'All of the following are valid reasons to keep A and B separate EXCEPT:',
        choices: [
          'Different weaponizers (bespoke loader vs commodity RAT)',
          'Different registrars and infrastructure patterns',
          'They share a reused self-signed TLS certificate across servers',
          'Overlap limited to one shared-hosting IP and the same sector',
        ],
        answer: 2,
        explain:
          'A reused self-signed cert across servers is a genuine strong link — it argues FOR a merge, not against. The others are weak overlaps or genuine differences that justify separation.',
      },
      {
        id: 's4m4q9',
        domain: 'Analysis',
        prompt:
          'A vendor "Rosetta" table equates their GLASS VIPER with your Cluster-A. The safe use of it is:',
        choices: [
          'Immediately merge your cluster into theirs',
          'Treat it as a hint to compare evidence; adopt equivalence only after reviewing their clustering criteria and links yourself',
          'Rename your cluster to theirs',
          'Discard your own cluster as redundant',
        ],
        answer: 1,
        explain:
          'Rosetta tables map different vendors\' visibility, which never perfectly coincides. Use them to prompt comparison, not to import another team\'s errors sight-unseen.',
      },
      {
        id: 's4m4q10',
        domain: 'Analysis',
        prompt:
          'New evidence shows half of Cluster-A used a different weaponizer and operated in a distinct timezone. The disciplined action is:',
        choices: [
          'Ignore it — the cluster is already published',
          'Split the cluster along the divergent evidence and document the new inclusion criteria',
          'Merge it with Cluster-B',
          'Delete Cluster-A entirely',
        ],
        answer: 1,
        explain:
          'Clusters evolve. Contradictory internal evidence means a monster was forming; split along the fault line and record why, keeping the analysis reversible and transparent.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's4m5',
    sectionId: 's4',
    title: 'Campañas y niveles de atribución',
    minutes: 15,
    objectives: [
      'Distinguir los niveles de atribución: máquina, operador, sponsor',
      'Explicar qué tipo de evidencia desbloquea cada nivel',
      'Diferenciar campaign de intrusion set (y modelarlo en STIX)',
      'Valorar cuándo la atribución aporta (y cuándo no)',
      'Reconocer false flags y sus límites',
    ],
    blocks: [
      {
        t: 'p',
        md: '«¿Quién fue?» tiene tres respuestas de profundidad creciente: **nivel máquina/infraestructura** (qué hosts y herramientas actuaron), **nivel operador** (qué personas/equipo teclearon) y **nivel sponsor** (qué organización o estado dirigió y se benefició). La evidencia técnica llega cómoda al primer nivel, con esfuerzo al segundo, y **rara vez basta sola** para el tercero.',
      },
      { t: 'h', text: 'La escalera de evidencia' },
      {
        t: 'table',
        headers: ['Nivel', 'Evidencia que lo desbloquea', 'Quién suele alcanzarlo', 'Confianza realista'],
        rows: [
          ['**Máquina / infraestructura**', 'Telemetría propia, forense, malware, C2', 'Cualquier defensor con visibilidad', 'Alta'],
          ['**Operador**', 'Errores de opsec humanos: reuso de alias/cuentas, logins personales desde la infra, tradecraft idiosincrático sostenido', 'Vendors con visibilidad global + años de tracking', 'Media'],
          ['**Sponsor**', 'HUMINT/SIGINT, financiación y tasking, registros legales, victimología plurianual alineada a intereses', 'Gobiernos, o fusión público-privada', 'Media, siempre con lenguaje estimativo explícito'],
        ],
      },
      {
        t: 'p',
        md: 'Fíjate en el patrón: subir un peldaño no exige *más* evidencia técnica, exige evidencia **de otro tipo**. De máquina a operador pasas de *qué actuó* a *quién tecleó* — y eso lo regalan los **errores humanos**: el operador que entra en su cuenta personal desde la VPN del C2, el alias reutilizado en un foro de 2019. De operador a sponsor pasas de *quién* a **por cuenta de quién** — órdenes, dinero, tasking — y eso **no deja rastro en tu red**. Por eso el sector privado honesto se detiene en el intrusion set con overlaps a nivel operador, y deja el «país X» a quien tiene SIGINT: no es falta de habilidad, es falta de *acceso a ese tipo de evidencia*.',
      },
      {
        t: 'p',
        md: 'La atribución a sponsor suele requerir fusionar inteligencia técnica con fuentes **no técnicas** (HUMINT, SIGINT, contexto geopolítico, errores de opsec acumulados durante años) — capacidades de estados. Por eso los vendors serios hablan de *intrusion sets* y dejan el «país X» a los gobiernos, o lo emiten con confianza explícita y matizada.',
      },
      {
        t: 'callout',
        kind: 'tip',
        title: '¿Necesitas atribución?',
        md: 'Para defender Meridian, saber que «es el cluster VELVET CICADA, busca robo de IP de propulsión, entra por proveedores» vale oro **aunque jamás sepas el país**. La atribución a estado importa para gobiernos (respuesta diplomática/legal), seguros, y decisiones geopolíticas de negocio. Pregunta del examen y de la vida: ¿qué decisión cambia con el nombre del país?',
      },
      { t: 'h', text: 'Campaña vs. intrusion set, formalizado' },
      {
        t: 'p',
        md: 'Vocabulario de precisión: una **campaign** es actividad acotada en el tiempo con un objetivo concreto; un **intrusion set** es el conjunto persistente de comportamiento, recursos y patrones que atraviesa *varias* campañas — el «actor» tal y como lo conoce un defensor. STIX 2.1 los modela como objetos distintos, y la atribución entre ellos es **una relación con confianza**, no una etiqueta:',
      },
      {
        t: 'code',
        lang: 'json',
        title: 'STIX 2.1 — campaign atribuida a un intrusion set (ficticio)',
        text: `{
  "type": "intrusion-set",
  "spec_version": "2.1",
  "id": "intrusion-set--44af81d9-0f3c-4e55-9b27-meridian0002",
  "name": "GLASS VIPER",
  "description": "Espionage-motivated set targeting aerospace suppliers",
  "first_seen": "2025-11-03T00:00:00Z",
  "resource_level": "organization",
  "primary_motivation": "organizational-gain"
}
{
  "type": "campaign",
  "spec_version": "2.1",
  "id": "campaign--9c0d55e1-7a2b-4f60-bd13-meridian0044",
  "name": "PO-REVISION phishing wave",
  "description": "Credential phishing against Meridian supplier portals",
  "first_seen": "2026-02-27T00:00:00Z",
  "objective": "supplier-portal-credentials"
}
{
  "type": "relationship",
  "spec_version": "2.1",
  "id": "relationship--e1f20c87-3b54-4a09-8d66-meridian0091",
  "relationship_type": "attributed-to",
  "source_ref": "campaign--9c0d55e1-7a2b-4f60-bd13-meridian0044",
  "target_ref": "intrusion-set--44af81d9-0f3c-4e55-9b27-meridian0002",
  "confidence": 75
}`,
      },
      {
        t: 'p',
        md: 'Lo elegante del modelo: la relación `attributed-to` lleva su propio campo `confidence` — la atribución viaja como **afirmación analítica con confianza explícita**, exactamente como debería aparecer en tu informe. Y un peldaño más allá existe el objeto `threat-actor` (personas/grupo humano): el nivel operador también tiene su sitio formal. Si tu herramienta no te deja expresar «campaña X atribuida al set Y con confianza media», la herramienta está aplanando tu análisis.',
      },
      {
        t: 'check',
        q: {
          q: 'In STIX 2.1 terms, a time-bounded phishing wave with a specific objective, run by a persistent adversary you track as GLASS VIPER, is modeled as:',
          choices: [
            'A threat-actor related to an indicator',
            'A campaign linked by an attributed-to relationship (with explicit confidence) to an intrusion-set',
            'An intrusion-set attributed to a campaign',
            'A single malware object',
          ],
          answer: 1,
          explain:
            'Campaign = bounded activity; intrusion-set = the persistent actor construct behind multiple campaigns; attribution flows campaign → set as a confidence-bearing relationship.',
        },
      },
      { t: 'h', text: 'False flags' },
      {
        t: 'p',
        md: 'Los actores siembran señuelos: strings en otros idiomas, horarios manipulados, herramientas de otros grupos, infraestructura «prestada». Los false flags efectivos atacan la evidencia **barata de falsificar** (idioma, timezone, tooling compartido). Es mucho más difícil falsificar consistentemente la evidencia **estructural**: años de patrones de registro, victimología alineada con intereses concretos, cadenas completas de tradecraft. ACH con sensibilidad a la decepción es tu antídoto.',
      },
      {
        t: 'table',
        headers: ['Evidencia', 'Falsificable', 'Peso para atribución'],
        rows: [
          ['Strings/idioma en el binario', 'Trivial', 'Muy bajo aislada'],
          ['Compile times / horario aparente', 'Trivial', 'Muy bajo aislada'],
          ['Tooling de otro grupo', 'Fácil (si es público/robado)', 'Bajo'],
          ['Victimología sostenida alineada a intereses', 'Cara de sostener', 'Medio-alto'],
          ['Tradecraft estructural multianual + errores de opsec', 'Muy cara', 'Alto (en agregado)'],
        ],
      },
      {
        t: 'check',
        q: {
          q: 'A binary contains Russian-language strings and compile times in a Moscow workday. Alone, this evidence:',
          choices: [
            'Proves Russian state sponsorship',
            'Is cheap to fabricate and supports only low-confidence inferences — classic false-flag material',
            'Rules out all non-Russian actors',
            'Is irrelevant in all cases',
          ],
          answer: 1,
          explain:
            'Language artifacts and timestamps are trivially forgeable. They contribute only as part of a much larger consistent body of evidence.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'For a private-sector defender, the MOST actionable attribution level is usually:',
          choices: [
            'Sponsor (country) attribution',
            'Activity-group level: cluster behavior, objectives, and TTPs',
            'Individual operator names',
            'No attribution has value',
          ],
          answer: 1,
          explain:
            'Group-level knowledge drives detection, hunting and risk decisions. Sponsor attribution mainly serves governments and policy.',
        },
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Tres niveles de atribución; cada nivel exige evidencia de **otro tipo**, no solo más; **campaign** (acotada, un objetivo) ≠ **intrusion set** (persistente, varias campañas); la técnica sola rara vez alcanza el sponsor; false flags explotan evidencia barata; el valor de la atribución depende de la **decisión del consumidor**.',
      },
    ],
    quiz: [
      {
        id: 's4m5q1',
        domain: 'Analysis',
        prompt: 'The three commonly cited levels of attribution are:',
        choices: [
          'Tactical, operational, strategic',
          'Machine/infrastructure, human operator, organization/sponsor',
          'Low, medium, high',
          'IOC, TTP, campaign',
        ],
        answer: 1,
        explain:
          'What machines acted, which humans operated, and which organization directed/benefited — each level needs progressively more (and less technical) evidence.',
      },
      {
        id: 's4m5q2',
        domain: 'Analysis',
        prompt:
          'Why does sponsor-level attribution usually exceed what technical evidence alone can support?',
        choices: [
          'Technical evidence is always classified',
          'Linking activity to a directing organization typically requires non-technical sources (HUMINT/SIGINT/geopolitical context) beyond defender telemetry',
          'Sponsors do not use computers',
          'It does not — hashes identify countries',
        ],
        answer: 1,
        explain:
          'Telemetry shows machines and behavior, not orders and funding. State-level claims fuse intelligence disciplines most defenders lack.',
      },
      {
        id: 's4m5q3',
        domain: 'Analysis',
        prompt:
          'An actor plants another group\'s leaked tool and foreign-language strings. This deception is MOST likely to fool analysis that:',
        choices: [
          'Weighs structural, long-term evidence',
          'Anchors on cheap, single-source artifacts without ACH or deception sensitivity',
          'Uses the Diamond Model',
          'Considers victimology',
        ],
        answer: 1,
        explain:
          'False flags target shallow analysis. Structured methods stress-test exactly the evidence deception manipulates.',
      },
      {
        id: 's4m5q4',
        domain: 'Analysis',
        prompt:
          'Which question BEST determines whether to invest in deeper attribution?',
        choices: [
          'Which name will trend on social media?',
          'What consumer decision would change with a more specific answer?',
          'Which country is easiest to blame?',
          'How fast can we publish?',
        ],
        answer: 1,
        explain:
          'Attribution is intelligence: it exists to serve decisions. No decision, no requirement.',
      },
      {
        id: 's4m5q5',
        domain: 'Analysis',
        prompt:
          'Sustained victimology aligned with a specific state\'s collection interests, over years and many campaigns, is valuable attribution evidence because:',
        choices: [
          'Victims never lie',
          'It is structurally expensive to fake consistently at scale, unlike strings or timestamps',
          'It is the only public evidence',
          'It identifies the operators by name',
        ],
        answer: 1,
        explain:
          'Long-horizon targeting patterns require real, sustained tasking — far costlier to fabricate than binary artifacts.',
      },
      {
        id: 's4m5q6',
        domain: 'Analysis',
        prompt:
          'A government publicly attributes a campaign to a foreign intelligence service. A mature CTI team should:',
        choices: [
          'Treat it as one more (often well-resourced) source: note its evidence basis and confidence, and update assessments accordingly',
          'Automatically adopt it as ground truth for clustering',
          'Ignore it as propaganda',
          'Delete its own conflicting analysis',
        ],
        answer: 0,
        explain:
          'Government statements draw on capabilities defenders lack, but they remain sources with purposes — incorporate with source evaluation, not blind adoption.',
      },
      {
        id: 's4m5q7',
        domain: 'Analysis',
        prompt: 'The distinction between a campaign and an intrusion set is:',
        choices: [
          'They are synonyms used by different vendors',
          'A campaign is time-bounded activity toward a specific objective; an intrusion set is the persistent pattern of behavior and resources spanning multiple campaigns',
          'Campaigns are public, intrusion sets are classified',
          'An intrusion set is always state-sponsored',
        ],
        answer: 1,
        explain:
          'One actor construct (set) runs many bounded operations (campaigns). Conflating them muddles both tracking and reporting.',
      },
      {
        id: 's4m5q8',
        domain: 'Analysis',
        prompt:
          'Which evidence typically UNLOCKS operator-level (vs. machine-level) attribution?',
        choices: [
          'More C2 domain telemetry',
          'Human opsec failures: personal account logins from operation infrastructure, alias reuse across years, idiosyncratic tradecraft habits',
          'A larger IOC feed',
          'Sandbox detonation reports',
        ],
        answer: 1,
        explain:
          'Moving from "what machines acted" to "who typed" requires evidence about humans — which mostly surfaces through their mistakes.',
      },
      {
        id: 's4m5q9',
        domain: 'Analysis',
        prompt:
          'A reputable vendor reports "GLASS VIPER intrusion set, moderate-confidence operator overlap with previously reported activity" instead of naming a country. This restraint reflects:',
        choices: [
          'Fear of legal action only',
          'Evidence-type honesty: sponsor claims need access (SIGINT, HUMINT, financial records) that private telemetry cannot provide',
          'Lack of analytic skill',
          'Marketing strategy',
        ],
        answer: 1,
        explain:
          'Stopping at the evidence\'s natural ceiling is rigor, not weakness. The country claim belongs to those holding non-technical sources.',
      },
      {
        id: 's4m5q10',
        domain: 'Analysis',
        prompt:
          'In STIX 2.1, attribution of a campaign to an intrusion set is expressed as a relationship object carrying its own confidence value. This design matters because:',
        choices: [
          'It reduces file size',
          'It forces attribution to travel as an explicit, confidence-qualified analytic claim rather than an implicit binary label',
          'It encrypts the attribution',
          'It makes attribution permanent',
        ],
        answer: 1,
        explain:
          'Attribution is a judgment, not a property. Modeling it as a confidence-bearing claim keeps the analytic nuance machine-readable.',
      },
    ],
  },
];
