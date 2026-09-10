// Deterministic per-question option shuffling.
//
// The authored bank has a heavy answer-position bias (the correct answer sits in
// position B in ~55% of items), so a test-wise user can score well without
// reading. Shuffling at render time removes the bias for the authored bank AND
// for AI-generated items, without rewriting every item.

/** Random per page load: the same question is ordered differently each session. */
const SESSION_SALT = Math.floor(Math.random() * 0xffffffff);

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A stable permutation of [0..n-1] for a given key. `order[displayIndex]`
 * gives the original index, so answers can always be mapped back.
 */
export function seededOrder(n: number, key: string): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  const rnd = mulberry32(hashString(key) ^ SESSION_SALT);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
