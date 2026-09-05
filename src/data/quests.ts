import type { QuestDef } from '../lib/types';
import { sample } from '../lib/util';

export const DAILY_ALL_BONUS = 50;

export const QUEST_POOL: QuestDef[] = [
  {
    id: 'q-lesson',
    icon: '📖',
    title: 'Estudio diario',
    desc: 'Completa 1 lección',
    target: 1,
    counter: 'lessons',
    xp: 30,
  },
  {
    id: 'q-questions',
    icon: '🎯',
    title: 'Bajo fuego',
    desc: 'Responde 15 preguntas',
    target: 15,
    counter: 'questions',
    xp: 30,
  },
  {
    id: 'q-correct',
    icon: '✅',
    title: 'Precisión',
    desc: 'Acierta 10 preguntas',
    target: 10,
    counter: 'correct',
    xp: 30,
  },
  {
    id: 'q-cards',
    icon: '🃏',
    title: 'Memoria de analista',
    desc: 'Repasa 15 flashcards',
    target: 15,
    counter: 'cards',
    xp: 30,
  },
  {
    id: 'q-lab',
    icon: '🧪',
    title: 'Trabajo de campo',
    desc: 'Completa 1 lab',
    target: 1,
    counter: 'labs',
    xp: 40,
  },
  {
    id: 'q-highconf',
    icon: '🔮',
    title: 'Almost certain',
    desc: 'Acierta 5 preguntas apostando confianza alta',
    target: 5,
    counter: 'highConfCorrect',
    xp: 40,
  },
];

/** 3 quests per day, deterministic per date */
export function questsForDate(date: string): QuestDef[] {
  return sample(QUEST_POOL, 3, `quests-${date}`);
}
