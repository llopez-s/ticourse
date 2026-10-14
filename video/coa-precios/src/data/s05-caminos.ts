/** On-screen strings of s05-caminos (the storyboard's, exactly) and the poses of its two pieces. */
export const S05 = {
  /** The bridge with the kill-chain video, small, beside the three rows above C2. */
  bridge: 'los pasos de antes ya no los puedes impedir',
  /** Gloss beside C2's `[!]` mark (a gloss, not the cell's text). */
  markGloss: 'el actor lo sabrá en minutos',
  /** «no corta la llamada en curso · las siguientes no llegan a ninguna parte · DENY». */
  sinkhole: { lines: ['no corta la llamada en curso', 'las siguientes no llegan a ninguna parte'], verb: 'DENY' },
  chips: [
    { lead: 'Supón que', rest: 'todavía no han sacado nada' },
    { lead: 'Supón que', rest: 'lo importante está a salvo' },
  ],
  watch: { a: 'ves su operación,', b: 'avisas menos', sub: 'mientras lo valioso esté protegido' },
  /** «si ya se llevan lo crítico: contener ahora, recoger después». */
  flip: { if: 'si ya se llevan lo crítico:', now: 'contener ahora,', later: 'recoger después' },
  /** «la decisión final es del negocio, no del SOC · tú pones los precios sobre la mesa». */
  business: { name: 'INTELLIGENCE GAIN/LOSS', decision: 'la decisión final es del negocio, no del SOC', prices: 'tú pones los precios sobre la mesa' },
  /** The row the hypothetical alarm of `flip` sits on, named big enough to read. */
  aoo: 'ACTIONS ON OBJECTIVES',
} as const;

export interface Pose {
  x: number;
  y: number;
  w: number;
}

/** The matrix while GLASS VIPER's card holds the top-centre band: small, under it. */
export const MATRIX_UNDER_CARD: Pose = { x: 954, y: 170, w: 726 };

/** The walkie vignette (the whole shop): under the think prompt's band, over the two chips. */
export const VIGNETTE: Pose = { x: 48, y: 186, w: 672 };
/** …and a little bigger once the chips have gone (from `answer` on). */
export const VIGNETTE_BIG: Pose = { x: 6, y: 192, w: 764 };

export const CHIPS = { x: 48, y: 556, gap: 6 } as const;

export const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const k = Math.max(0, Math.min(1, t));
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k };
};
