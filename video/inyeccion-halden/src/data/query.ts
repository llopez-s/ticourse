/**
 * The lesson's query and payload (src/data/secplus/sp2-part2.ts:301-307), ON SCREEN ONLY: the voice never reads them
 * (it says «una comilla, una condición que siempre se cumple y dos guiones»). Illustrative text for an exam; the
 * test copy has no real data.
 *
 * Payload parts, by index: [0,1) the quote, [1,8) « OR 1=1», [8,11) « --». QueryBlock relies on these indices.
 */
export const PAYLOAD = "' OR 1=1 --";

export const QUERY = {
  l1: 'SELECT * FROM users',
  l2Head: "WHERE name = '",
  l3Head: "  AND pass = '",
  /** The closing quote after a slot. */
  quote: "'",
  slot: '<input>',
  /** Corrected query (sp2-part2.ts:312-313): `WHERE name = ? AND pass = ?`, one mark per datum. */
  l2ParamHead: 'WHERE name = ',
  l3ParamHead: '  AND pass = ',
} as const;
