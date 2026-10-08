/**
 * On-screen strings of s01-fotos (canon: out/scene-brief.md «Canon», s01). The two V3 cards live in
 * `scenes/parts/EventCard.tsx` (`E7_CARD`, `E9_CARD`); the victims' names in `scenes/parts/FilmRail.tsx` (`VICTIMS`).
 * `word` = the spoken word (in its segment) the item lands on.
 */

export const TITLE = { main: 'De la foto a la película', sub: 'activity threads y grupos' } as const;

/** The third pile: Orbital's raw events of that Monday (ISO date, as in the lesson's lines). */
export const ORBITAL_PILE = {
  date: '2026-03-09',
  name: 'Orbital Components',
  relation: 'proveedor de Meridian',
  tag: 'eventos nuevos',
} as const;

/** The two questions that open the video and stay its spine (s01-02). */
export const QUESTIONS = [
  { text: '¿el mismo atacante?', word: 'mismo' },
  { text: '¿qué hará después?', word: 'hará' },
] as const;

/** The promise (s01-03), one chip per verb. */
export const PROMISE = [
  { text: 'montar el hilo de una intrusión', word: 'montas' },
  { text: 'saber si dos son del mismo', word: 'miras' },
  { text: 'adelantarte a lo que viene', word: 'adelantas' },
] as const;

/** The bridge to V3 (s01-04): its panel phrase and, small, the four questions of a Diamond event. */
export const BRIDGE = {
  line: 'un evento es una foto · un hilo es la película',
  /** Each word lands on its spoken word; `vertex` is the mini-diamond vertex it lights on the cards. */
  sub: [
    { text: 'quién', word: 'Quién', vertex: 'adv' },
    { text: 'con qué', word: 'con', vertex: 'cap' },
    { text: 'por dónde', word: 'dónde', vertex: 'infra' },
    { text: 'contra quién', word: 'contra', vertex: 'vic' },
  ],
} as const;
