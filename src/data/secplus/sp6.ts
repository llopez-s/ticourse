import type { Module } from '../../lib/types';

export const SP6_MODULES: Module[] = [
  {
    id: 'sp6m1',
    sectionId: 'sp6',
    title: 'El examen Security+: formato y estrategia',
    minutes: 10,
    objectives: [
      'Conocer el formato del examen SY0-701',
      'Saber qué son las PBQs y cómo gestionarlas',
      'Repartir el tiempo por tipo de pregunta',
      'Usar los pesos por dominio para priorizar el estudio',
    ],
    blocks: [
      {
        t: 'p',
        md: 'El **CompTIA Security+ (SY0-701)** es un examen **closed-book** de hasta **90 preguntas** en **90 minutos**, puntuado en una escala de **100 a 900** con corte en **750**. Mezcla preguntas tipo test (una o varias respuestas correctas) con **performance-based questions (PBQs)**: simulaciones donde configuras un firewall, ordenas pasos de respuesta o clasificas controles. Verifica siempre los datos vigentes en `comptia.org`.',
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'PBQs primero… o no',
        md: 'Las PBQs suelen aparecer al principio y consumen mucho tiempo. Estrategia recomendada: **marca y salta** las PBQs, resuelve el test (tu puntuación segura) y vuelve con el tiempo restante. El examen permite revisar preguntas marcadas.',
      },
      {
        t: 'table',
        headers: ['Dominio', 'Peso', 'Sección aquí'],
        rows: [
          ['1.0 General Security Concepts', '12%', 'S1'],
          ['2.0 Threats, Vulnerabilities & Mitigations', '22%', 'S2'],
          ['3.0 Security Architecture', '18%', 'S3'],
          ['4.0 Security Operations', '28%', 'S4'],
          ['5.0 Security Program Management & Oversight', '20%', 'S5'],
        ],
      },
      {
        t: 'p',
        md: 'Los pesos importan: **Operaciones (28%) y Amenazas (22%)** suman la mitad del examen. Los conceptos generales (12%) pesan poco en preguntas pero son el **vocabulario** que todas las demás usan: sin ellos no entiendes las preguntas de los otros dominios.',
      },
      {
        t: 'list',
        items: [
          '**Ritmo**: ~1 minuto por pregunta de test; reserva 15–20 minutos para las PBQs.',
          '**Lee el qualifier**: BEST, MOST likely, FIRST, LEAST. Dos opciones serán defendibles; una encaja *mejor* con el objetivo oficial.',
          '**Piensa como CompTIA**: la respuesta correcta es la práctica estándar de la industria, no la más ingeniosa. Si una opción es un control formal (política, MFA, segmentación), suele ganar a una improvisación.',
          '**No dejes preguntas en blanco**: no hay penalización por fallar.',
        ],
      },
      {
        t: 'check',
        q: {
          q: 'You open the exam and the first three questions are PBQs that look time-consuming. What is the BEST approach?',
          choices: [
            'Solve them first — they are worth more points',
            'Mark them, complete the multiple-choice questions, then return with the remaining time',
            'Skip them permanently; PBQs are optional',
            'Spend up to 30 minutes on each',
          ],
          answer: 1,
          explain:
            'PBQs are heavy; securing the multiple-choice score first and returning to marked items protects your pace. Blank items score nothing, so never skip permanently.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Which two domains together make up about half of the SY0-701 exam?',
          choices: [
            'General Security Concepts and Security Architecture',
            'Security Operations and Threats, Vulnerabilities & Mitigations',
            'Security Architecture and Program Management',
            'General Security Concepts and Security Operations',
          ],
          answer: 1,
          explain: 'Operations (28%) + Threats (22%) = 50%. Plan study time accordingly.',
        },
      },
      {
        t: 'p',
        md: 'Tu plan en esta app: completa las secciones S1→S5 (lecciones, quizzes y labs), derrota a los 5 bosses (≥80%), mantén las flashcards al día y cierra con **simulacros completos** de 90 preguntas hasta superar el **83%** (equivalente aproximado al 750/900) de forma estable.',
      },
      {
        t: 'callout',
        kind: 'warn',
        md: 'Esta app es material **no oficial** e independiente. No reproduce contenido de CompTIA ni está afiliada a ella. CompTIA y Security+ son marcas de CompTIA, Inc.',
      },
    ],
    quiz: [],
  },
];
