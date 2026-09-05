const pad = (n: number) => String(n).padStart(2, '0');

/** Local date as YYYY-MM-DD */
export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Add n days to a YYYY-MM-DD string */
export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 12); // noon avoids DST edge cases
  dt.setDate(dt.getDate() + n);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

/** Whole days from a to b (positive if b is later) */
export function dayDiff(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const ams = Date.UTC(ay, am - 1, ad);
  const bms = Date.UTC(by, bm - 1, bd);
  return Math.round((bms - ams) / 86400000);
}

/** djb2 string hash (unsigned) */
export function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

/** Deterministic PRNG */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle; deterministic when seed is given */
export function shuffle<T>(arr: readonly T[], seed?: string): T[] {
  const rnd = seed !== undefined ? mulberry32(hashStr(seed)) : Math.random;
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function sample<T>(arr: readonly T[], n: number, seed?: string): T[] {
  return shuffle(arr, seed).slice(0, Math.min(n, arr.length));
}

export const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

export const pct = (num: number, den: number) =>
  den === 0 ? 0 : Math.round((num / den) * 100);

/** Last n day-strings ending today, oldest first */
export function lastNDays(n: number): string[] {
  const t = todayStr();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(t, -i));
  return out;
}
