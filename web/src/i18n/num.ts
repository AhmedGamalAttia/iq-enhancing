// Number and plural helpers for the Arabic dictionary.
//
// Two defects this fixes:
//  1. Mixed numerals — the authored questions are written in Arabic-Indic
//     (٠١٢٣٤٥٦٧٨٩) while every interpolated count came out Western (0123456789),
//     so a single card showed both systems.
//  2. Broken agreement — Arabic counts don't take one plural form. "٣ يوم
//     متتالي" and "من ٢ سؤالاً" are both ungrammatical; the noun changes with
//     the number.

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Western digits → Arabic-Indic, leaving everything else untouched. */
export function ar(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

export interface ArabicForms {
  /** 0 items */
  zero: string;
  /** exactly 1 */
  one: string;
  /** exactly 2 (dual) */
  two: string;
  /** 3–10 (broken plural) */
  few: string;
  /** 11+ (singular accusative — tamyeez) */
  many: string;
}

/**
 * Pick the grammatical form for a count, then render the count in Arabic-Indic.
 * `{n}` inside a form is replaced by the number; forms that name the count in
 * words (one/two) simply omit it.
 */
export function arCount(n: number, forms: ArabicForms): string {
  const mod100 = n % 100;
  let form: string;
  if (n === 0) form = forms.zero;
  else if (n === 1) form = forms.one;
  else if (n === 2) form = forms.two;
  else if (mod100 >= 3 && mod100 <= 10) form = forms.few;
  else form = forms.many;
  return form.replace("{n}", ar(n));
}

/** English pluralisation, so no user-facing string says "day(s)". */
export function enCount(n: number, one: string, many: string): string {
  return (n === 1 ? one : many).replace("{n}", String(n));
}
