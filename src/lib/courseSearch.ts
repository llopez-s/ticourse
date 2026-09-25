import type { LabMeta } from '../data/labs';
import type { Block, GlossaryEntry, Module, SectionMeta } from './types';

export interface SearchScope {
  sections: SectionMeta[];
  modules: Module[];
  labs: LabMeta[];
  glossary: GlossaryEntry[];
}

export interface CourseSearchResult {
  kind: 'lesson' | 'lab' | 'glossary' | 'section';
  key: string;
  title: string;
  section: string;
  excerpt: string;
  to: string;
  score: number;
}

interface SearchField {
  text: string;
  weight: number;
  to?: string;
}

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

const clean = (value: string) => value.replace(/[*`_]/g, '').replace(/\s+/g, ' ').trim();

function blockText(block: Block): string {
  switch (block.t) {
    case 'p':
    case 'quote':
    case 'callout':
      return `${block.t === 'callout' ? block.title ?? '' : ''} ${block.md}`;
    case 'h':
      return block.text;
    case 'list':
      return block.items.join(' ');
    case 'table':
      return [...block.headers, ...block.rows.flat()].join(' ');
    case 'code':
      return `${block.title ?? ''} ${block.lang ?? ''} ${block.text}`;
    case 'video':
      return block.title;
    case 'check':
      return `${block.q.q} ${block.q.explain ?? ''}`;
  }
}

function excerpt(value: string, terms: string[]): string {
  const text = clean(value);
  const normalized = normalize(text);
  const positions = terms.map((term) => normalized.indexOf(term)).filter((at) => at >= 0);
  if (positions.length === 0) return text.slice(0, 160) + (text.length > 160 ? '…' : '');
  const first = Math.min(...positions);
  const start = Math.max(0, first - 48);
  const end = Math.min(text.length, first + 112);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

function matchFields(fields: SearchField[], terms: string[]) {
  const normalized = fields.map((field) => normalize(field.text));
  if (!terms.every((term) => normalized.some((field) => field.includes(term)))) return null;

  let best = 0;
  let bestScore = -1;
  fields.forEach((field, index) => {
    const hits = terms.filter((term) => normalized[index].includes(term)).length;
    const score = hits * field.weight;
    if (score > bestScore) {
      best = index;
      bestScore = score;
    }
  });
  return {
    field: fields[best],
    score: bestScore + terms.filter((term) => normalized[0].includes(term)).length * 3,
  };
}

/** Search only the chosen track's study material, with one result per item. */
export function searchCourse(scope: SearchScope, query: string): CourseSearchResult[] {
  const terms = [...new Set(normalize(query).trim().split(/\s+/).filter(Boolean))];
  if (terms.length === 0) return [];

  const sections = new Map(scope.sections.map((section) => [section.id, section]));
  const sectionLabel = (id: string) => {
    const section = sections.get(id);
    return section ? `S${section.num} · ${section.short}` : '';
  };
  const results: CourseSearchResult[] = [];

  for (const section of scope.sections) {
    const fields = [
      { text: `${section.title} ${section.short}`, weight: 8 },
      { text: section.subtitle, weight: 3 },
    ];
    const match = matchFields(fields, terms);
    if (match) results.push({
      kind: 'section', key: section.id, title: section.title,
      section: `S${section.num}`, excerpt: excerpt(section.subtitle, terms),
      to: `/section/${section.id}`, score: match.score,
    });
  }

  for (const mod of scope.modules) {
    const fields: SearchField[] = [
      { text: mod.title, weight: 10 },
      ...mod.objectives.map((text) => ({ text, weight: 5 })),
      ...mod.blocks.map((block, index) => ({
        text: blockText(block), weight: block.t === 'h' ? 6 : 3,
        to: `/learn/${mod.id}?block=${index}`,
      })),
    ];
    const match = matchFields(fields, terms);
    if (match) results.push({
      kind: 'lesson', key: mod.id, title: mod.title,
      section: sectionLabel(mod.sectionId),
      excerpt: excerpt(match.field === fields[0] ? mod.objectives[0] ?? mod.title : match.field.text, terms),
      to: match.field.to ?? `/learn/${mod.id}`, score: match.score,
    });
  }

  for (const lab of scope.labs) {
    const fields = [
      { text: lab.title, weight: 8 },
      { text: `${lab.brief} ${lab.mission?.briefing ?? ''}`, weight: 3 },
    ];
    const match = matchFields(fields, terms);
    if (match) results.push({
      kind: 'lab', key: lab.id, title: lab.title,
      section: sectionLabel(lab.sectionId), excerpt: excerpt(lab.brief, terms),
      to: `/lab/${lab.id}`, score: match.score,
    });
  }

  for (const entry of scope.glossary) {
    const fields = [
      { text: entry.term, weight: 9 },
      { text: entry.def, weight: 3 },
    ];
    const match = matchFields(fields, terms);
    if (match) results.push({
      kind: 'glossary', key: `${entry.sectionId}-${entry.term}`, title: entry.term,
      section: sectionLabel(entry.sectionId), excerpt: excerpt(entry.def, terms),
      to: `/glossary?q=${encodeURIComponent(entry.term)}`, score: match.score,
    });
  }

  const kindOrder = { lesson: 0, section: 1, lab: 2, glossary: 3 };
  return results.sort((a, b) => b.score - a.score || kindOrder[a.kind] - kindOrder[b.kind] || a.title.localeCompare(b.title));
}
