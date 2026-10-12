/**
 * s03-verbos «Una oficina, un administrativo y un mozo» — the strings only this scene writes (canon:
 * out/scene-brief.md, «Canon strings», s03). The place labels, the three exam names with their verbs,
 * «sistema de pedidos», «el historial de quien recoge», «las normas · las mismas para todos» and «orden»
 * live in the shared part (parts/Warehouse.tsx → WAREHOUSE_TEXT).
 */
export const S03 = {
  /** `clerk-alone`: the mozo hands the mercancía over on his own. */
  alone: 'sin preguntar a nadie',
  /** Answering the intercepted message (s03-02): what the mozo does have in front of him. */
  sees: 've pasar la mercancía',
  /** The printed order's clock (`order`). */
  expiry: 'con su caducidad',
  /** `wrap`: «el engine decide · el administrator comunica · el PEP aplica», as article + exam term + verb. */
  wrap: [
    { article: 'el', term: 'engine', verb: 'decide' },
    { article: 'el', term: 'administrator', verb: 'comunica' },
    { article: 'el', term: 'PEP', verb: 'aplica' },
  ],
} as const;
