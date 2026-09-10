import type { Question } from "@/lib/types";

// Logical reasoning bank — two INDEPENDENT banks (Arabic + English).
// Hand-authored; not copied from any standardized test.
//
// Fairness contract for this bank: the audience is every adult and older child
// regardless of schooling or trade — a plumber, a fisherman, a sixth-grader and
// a physics professor must all get a fair reading. So: everyday framing only
// (market, harvest, distance, weight, queues), no facts that depend on formal
// schooling, region, religion, politics, brands or job jargon.
//
// Two rules this bank enforces strictly:
//  1. Every sequence has EXACTLY ONE rule that lands on a listed option. Each
//     item below was re-checked for a second rule reaching a different choice;
//     where one existed the distractors or the sequence were changed.
//  2. Arabic items contain NO Latin letters and no letter-variables at all —
//     Arabic-Indic numerals ٠١٢٣٤٥٦٧٨٩ everywhere, in stems, choices and
//     explanations alike.
//
// Item kinds used: number and shape sequences, syllogisms, conditional
// reasoning, ordering/ranking, set relations, and deduction from a few facts.

export const LOGICAL_QUESTIONS: Question[] = [
  // ============================================================
  // ARABIC — difficulty 1
  // ============================================================
  {
    id: "log-1",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    stem: "أكمل المتتالية: ٢، ٤، ٦، ٨، ؟",
    choices: ["١٠", "١٢", "١٤", "١٦"],
    answer: 0,
    explanation: "المتتالية تزيد باثنين في كل خطوة، و٨ + ٢ = ١٠.",
    source: "authored",
  },
  {
    id: "log-2",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    stem: "أكمل المتتالية: ٥، ١٠، ١٥، ٢٠، ؟",
    choices: ["٢٢", "٢٤", "٢٥", "٢٦"],
    answer: 2,
    explanation: "الزيادة خمسة في كل خطوة، و٢٠ + ٥ = ٢٥.",
    source: "authored",
  },
  {
    id: "log-3",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    stem: "أكمل المتتالية: ١، ٣، ٥، ٧، ؟",
    choices: ["٨", "٩", "١٠", "١١"],
    answer: 1,
    explanation: "هذه الأعداد الفردية المتتالية، والذي يلي ٧ هو ٩.",
    source: "authored",
  },
  {
    id: "log-4",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    stem: "كل الطيور تبيض، والحمامة طائر. إذن:",
    choices: [
      "الحمامة لا تبيض",
      "بعض الحمام لا يبيض",
      "لا يمكن الجزم بشيء",
      "الحمامة تبيض",
    ],
    answer: 3,
    explanation:
      "ما دامت كل الطيور تبيض والحمامة طائر، فالحمامة تبيض بالضرورة.",
    source: "authored",
  },
  {
    id: "log-5",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    stem: "إذا كان اليوم هو الأحد، فأيّ يوم يكون بعد ٣ أيام؟",
    choices: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    answer: 2,
    explanation: "نعدّ ٣ أيام بعد الأحد: الاثنين ثم الثلاثاء ثم الأربعاء.",
    source: "authored",
  },

  // ============================================================
  // ARABIC — difficulty 2
  // ============================================================
  {
    id: "log-6",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    stem: "أكمل المتتالية: ١، ٢، ٤، ٨، ؟",
    choices: ["١١", "١٢", "١٤", "١٦"],
    answer: 3,
    explanation: "كل عدد ضعف الذي قبله، و٨ × ٢ = ١٦.",
    source: "authored",
  },
  {
    id: "log-7",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    stem: "أكمل المتتالية: ٢٠، ١٧، ١٤، ١١، ؟",
    choices: ["٧", "٨", "٩", "١٠"],
    answer: 1,
    explanation: "المتتالية تنقص ثلاثة في كل خطوة، و١١ − ٣ = ٨.",
    source: "authored",
  },
  {
    id: "log-8",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    stem: "سعاد أطول من هدى، وهدى أطول من منى. من الأقصر؟",
    choices: ["سعاد", "هدى", "منى", "لا يمكن التحديد"],
    answer: 2,
    explanation: "الترتيب من الأطول: سعاد ثم هدى ثم منى، فمنى هي الأقصر.",
    source: "authored",
  },
  {
    id: "log-9",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    stem: "كل الكرات الحمراء في الصندوق صغيرة. سحبنا من الصندوق كرة كبيرة. إذن:",
    choices: [
      "الكرة ليست حمراء",
      "الكرة حمراء",
      "كل كرات الصندوق كبيرة",
      "لا يمكن معرفة شيء",
    ],
    answer: 0,
    explanation:
      "ما دامت كل الكرات الحمراء صغيرة، فالكرة الكبيرة لا يمكن أن تكون حمراء.",
    source: "authored",
  },
  {
    id: "log-10",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    stem: "أكمل النمط: مثلث، مربّع، مثلث، مربّع، مثلث، ؟",
    choices: ["دائرة", "مثلث", "خطّ مستقيم", "مربّع"],
    answer: 3,
    explanation: "النمط يتناوب بين المثلث والمربّع، وبعد المثلث يأتي المربّع.",
    source: "authored",
  },

  // ============================================================
  // ARABIC — difficulty 3
  // ============================================================
  {
    id: "log-11",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    stem: "أكمل المتتالية: ٣، ٦، ١١، ١٨، ؟",
    choices: ["٢٤", "٢٥", "٢٧", "٢٩"],
    answer: 2,
    explanation:
      "الفروق أعداد فردية متزايدة: زائد ٣ ثم زائد ٥ ثم زائد ٧ ثم زائد ٩، و١٨ + ٩ = ٢٧.",
    source: "authored",
  },
  {
    id: "log-12",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    stem: "أكمل المتتالية: ٢، ٦، ١٢، ٢٠، ٣٠، ؟",
    choices: ["٤٠", "٤٢", "٤٤", "٤٦"],
    answer: 1,
    explanation:
      "الفروق تكبر باثنين في كل مرّة: زائد ٤ ثم ٦ ثم ٨ ثم ١٠ ثم ١٢، و٣٠ + ١٢ = ٤٢.",
    source: "authored",
  },
  {
    id: "log-13",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    stem: "بعض الفلاحين شعراء، وكل الشعراء يقرؤون. أيّ نتيجة تلزم؟",
    choices: [
      "كل الفلاحين يقرؤون",
      "لا أحد من الفلاحين يقرأ",
      "كل من يقرأ فلّاح",
      "بعض الفلاحين يقرؤون",
    ],
    answer: 3,
    explanation:
      "الفلاحون الذين هم شعراء يقرؤون بالضرورة، فيلزم أن بعض الفلاحين يقرؤون، لا كلّهم.",
    source: "authored",
  },
  {
    id: "log-14",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    stem: "في سباق وصل خالد قبل مازن، ووصل مازن قبل رامي. من وصل ثانياً؟",
    choices: ["خالد", "مازن", "رامي", "لا يمكن التحديد"],
    answer: 1,
    explanation: "الترتيب خالد ثم مازن ثم رامي، فالثاني هو مازن.",
    source: "authored",
  },
  {
    id: "log-15",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    stem: "في النادي: كل من دفع الاشتراك دخل القاعة. وقد دخل سمير القاعة. ماذا نستنتج يقيناً؟",
    choices: [
      "سمير دفع الاشتراك",
      "سمير لم يدفع الاشتراك",
      "لا يمكن الجزم بأنّ سميراً دفع الاشتراك",
      "لم يدفع أحد الاشتراك",
    ],
    answer: 2,
    explanation:
      "القاعدة تخبرنا بما يحدث لمن دفع، ولا تمنع دخول غيره، فدخول سمير لا يثبت أنه دفع.",
    source: "authored",
  },

  // ============================================================
  // ARABIC — difficulty 4
  // ============================================================
  {
    id: "log-16",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    stem: "أكمل المتتالية: ١، ١، ٢، ٣، ٥، ٨، ؟",
    choices: ["١٣", "١٤", "١٦", "٢١"],
    answer: 0,
    explanation: "كل عدد هو مجموع العددين السابقين له، و٥ + ٨ = ١٣.",
    source: "authored",
  },
  {
    id: "log-17",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    stem: "أكمل المتتالية: ١، ٤، ٩، ١٦، ٢٥، ؟",
    choices: ["٣٠", "٣٦", "٤٠", "٤٩"],
    answer: 1,
    explanation:
      "كل عدد هو حاصل ضرب رتبته في نفسها: ٥ × ٥ = ٢٥، والتالي ٦ × ٦ = ٣٦.",
    source: "authored",
  },
  {
    id: "log-18",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    stem: "العبارة «كل من ذاكر نجح» صحيحة. أيّ ممّا يلي يلزم عنها حتماً؟",
    choices: [
      "من لم ينجح لم يذاكر",
      "كل من نجح ذاكر",
      "من لم يذاكر لم ينجح",
      "من ذاكر لم ينجح",
    ],
    answer: 0,
    explanation:
      "إذا كان كل من ذاكر ناجحاً، فمن لم ينجح لا يمكن أن يكون قد ذاكر؛ وهذا وحده اللازم.",
    source: "authored",
  },
  {
    id: "log-19",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    stem: "سلّة التمر أثقل من سلّة التين، وسلّة التين أثقل من سلّة الزيتون، وسلّة الزيتون أثقل من سلّة العنب. أيّ السلال هي الثانية في الثقل؟",
    choices: ["التمر", "التين", "الزيتون", "العنب"],
    answer: 1,
    explanation:
      "الترتيب من الأثقل: التمر ثم التين ثم الزيتون ثم العنب، فالثانية سلّة التين.",
    source: "authored",
  },
  {
    id: "log-20",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    stem: "كل النجّارين في السوق يملكون منشاراً، وبعض من يملكون منشاراً ليسوا نجّارين. أيّ العبارات صحيحة بالضرورة؟",
    choices: [
      "كل من يملك منشاراً نجّار",
      "بعض النجّارين لا يملكون منشاراً",
      "من لا يملك منشاراً ليس نجّاراً في السوق",
      "لا يوجد نجّار يملك منشاراً",
    ],
    answer: 2,
    explanation:
      "ما دام كل نجّار في السوق يملك منشاراً، فمن لا يملك منشاراً ليس نجّاراً فيه.",
    source: "authored",
  },

  // ============================================================
  // ARABIC — difficulty 5
  // ============================================================
  {
    id: "log-21",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    stem: "أكمل المتتالية: ٢، ٣، ٥، ٩، ١٧، ؟",
    choices: ["٢٥", "٢٩", "٣١", "٣٣"],
    answer: 3,
    explanation:
      "الفرق يتضاعف في كل خطوة: زائد ١ ثم ٢ ثم ٤ ثم ٨ ثم ١٦، و١٧ + ١٦ = ٣٣.",
    source: "authored",
  },
  {
    id: "log-22",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    stem: "أكمل المتتالية: ١، ٢، ٦، ٢٤، ؟",
    choices: ["١٢٠", "١٤٤", "٢٤٠", "٧٢٠"],
    answer: 0,
    explanation:
      "نضرب في عدد يكبر خطوة بخطوة: ١ × ٢ = ٢، و٢ × ٣ = ٦، و٦ × ٤ = ٢٤، و٢٤ × ٥ = ١٢٠.",
    source: "authored",
  },
  {
    id: "log-23",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    stem: "في مسابقة اشترك أربعة: هاني ووسيم وبدر وفادي. وصل هاني قبل وسيم، ووصل بدر بعد وسيم، ووصل فادي بعد بدر. من وصل أخيراً؟",
    choices: ["هاني", "وسيم", "بدر", "فادي"],
    answer: 3,
    explanation:
      "الترتيب هاني ثم وسيم ثم بدر ثم فادي، فالأخير هو فادي.",
    source: "authored",
  },
  {
    id: "log-24",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    stem: "قاعدة المخزن: لا يدخله أحد إلا وهو يلبس خوذة. ورأينا رجلاً داخل المخزن. ماذا نستنتج يقيناً؟",
    choices: [
      "الرجل يلبس خوذة",
      "الرجل لا يلبس خوذة",
      "كل من يلبس خوذة دخل المخزن",
      "لا يمكن معرفة شيء",
    ],
    answer: 0,
    explanation:
      "القاعدة تمنع الدخول بغير خوذة، فمن هو داخل المخزن لا بدّ أنه يلبسها.",
    source: "authored",
  },
  {
    id: "log-25",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    stem: "قال البائع: «كل السمك في الصندوق طازج»، ثم تبيّن أنّ كلامه غير صحيح. ما الذي يكون صحيحاً بالضرورة؟",
    choices: [
      "كل السمك غير طازج",
      "نصف السمك غير طازج",
      "لا يوجد سمك في الصندوق",
      "توجد سمكة واحدة على الأقلّ غير طازجة",
    ],
    answer: 3,
    explanation:
      "نفي «كل السمك طازج» يعني وجود سمكة واحدة على الأقلّ ليست طازجة، ولا يعني أن السمك كلّه غير طازج.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 1
  // ============================================================
  {
    id: "en-log-1",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 2, 4, 6, 8, ?",
    choices: ["9", "10", "11", "12"],
    answer: 1,
    explanation: "The sequence grows by two each step, and 8 + 2 = 10.",
    source: "authored",
  },
  {
    id: "en-log-2",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 5, 10, 15, 20, ?",
    choices: ["25", "26", "28", "30"],
    answer: 0,
    explanation: "Each step adds five, and 20 + 5 = 25.",
    source: "authored",
  },
  {
    id: "en-log-3",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 1, 3, 5, 7, ?",
    choices: ["6", "8", "9", "10"],
    answer: 2,
    explanation: "These are consecutive odd numbers, so the one after 7 is 9.",
    source: "authored",
  },
  {
    id: "en-log-4",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "All birds lay eggs, and a dove is a bird. Therefore:",
    choices: [
      "A dove does not lay eggs",
      "A dove lays eggs",
      "Some doves do not lay eggs",
      "It cannot be decided",
    ],
    answer: 1,
    explanation:
      "Since all birds lay eggs and a dove is a bird, a dove must lay eggs.",
    source: "authored",
  },
  {
    id: "en-log-5",
    skill: "logical",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "If today is Tuesday, what day will it be 3 days later?",
    choices: ["Wednesday", "Thursday", "Friday", "Saturday"],
    answer: 2,
    explanation:
      "Counting three days on from Tuesday gives Wednesday, Thursday, then Friday.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 2
  // ============================================================
  {
    id: "en-log-6",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 1, 2, 4, 8, ?",
    choices: ["10", "12", "14", "16"],
    answer: 3,
    explanation: "Each number is double the one before it, and 8 × 2 = 16.",
    source: "authored",
  },
  {
    id: "en-log-7",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 20, 17, 14, 11, ?",
    choices: ["8", "9", "10", "12"],
    answer: 0,
    explanation: "The sequence drops by three each step, and 11 − 3 = 8.",
    source: "authored",
  },
  {
    id: "en-log-8",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "Sara is taller than Huda, and Huda is taller than Mona. Who is the shortest?",
    choices: ["Sara", "Huda", "It cannot be decided", "Mona"],
    answer: 3,
    explanation:
      "From tallest down the order is Sara, then Huda, then Mona, so Mona is the shortest.",
    source: "authored",
  },
  {
    id: "en-log-9",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "Every red ball in the box is small. We drew a large ball from the box. Therefore:",
    choices: [
      "The ball is red",
      "The ball is not red",
      "All the balls in the box are large",
      "Nothing can be known",
    ],
    answer: 1,
    explanation:
      "If every red ball is small, then a large ball cannot be one of the red ones.",
    source: "authored",
  },
  {
    id: "en-log-10",
    skill: "logical",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "Complete the pattern: triangle, square, triangle, square, triangle, ?",
    choices: ["square", "triangle", "circle", "straight line"],
    answer: 0,
    explanation:
      "The pattern alternates between triangle and square, so a square comes after a triangle.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 3
  // ============================================================
  {
    id: "en-log-11",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 3, 6, 11, 18, ?",
    choices: ["21", "24", "25", "27"],
    answer: 3,
    explanation:
      "The gaps are growing odd numbers: plus 3, then 5, then 7, then 9, and 18 + 9 = 27.",
    source: "authored",
  },
  {
    id: "en-log-12",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 2, 6, 12, 20, 30, ?",
    choices: ["36", "40", "42", "44"],
    answer: 2,
    explanation:
      "Each gap is two larger than the last: plus 4, 6, 8, 10, then 12, and 30 + 12 = 42.",
    source: "authored",
  },
  {
    id: "en-log-13",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "Some farmers are poets, and all poets read. Which conclusion follows?",
    choices: [
      "All farmers read",
      "Some farmers read",
      "No farmer reads",
      "Everyone who reads is a farmer",
    ],
    answer: 1,
    explanation:
      "The farmers who are poets must read, so some farmers read — but not necessarily all.",
    source: "authored",
  },
  {
    id: "en-log-14",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "In a race Khaled finished before Mazen, and Mazen finished before Ramy. Who finished second?",
    choices: ["Khaled", "Ramy", "Mazen", "It cannot be decided"],
    answer: 2,
    explanation:
      "The order is Khaled, then Mazen, then Ramy, so Mazen finished second.",
    source: "authored",
  },
  {
    id: "en-log-15",
    skill: "logical",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "At the club, everyone who paid the fee entered the hall. Samir entered the hall. What follows for certain?",
    choices: [
      "Samir paid the fee",
      "Samir did not pay the fee",
      "Nobody paid the fee",
      "We cannot be sure that Samir paid",
    ],
    answer: 3,
    explanation:
      "The rule says what happens to those who paid; it does not keep others out, so entering does not prove he paid.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 4
  // ============================================================
  {
    id: "en-log-16",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 1, 1, 2, 3, 5, 8, ?",
    choices: ["11", "13", "16", "21"],
    answer: 1,
    explanation: "Each number is the sum of the two before it, and 5 + 8 = 13.",
    source: "authored",
  },
  {
    id: "en-log-17",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 1, 4, 9, 16, 25, ?",
    choices: ["36", "40", "45", "49"],
    answer: 0,
    explanation:
      "Each number is its position multiplied by itself: 5 × 5 = 25, so next comes 6 × 6 = 36.",
    source: "authored",
  },
  {
    id: "en-log-18",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "The statement 'everyone who studied passed' is true. Which must also be true?",
    choices: [
      "Everyone who passed studied",
      "Whoever did not study did not pass",
      "Whoever did not pass did not study",
      "Whoever studied did not pass",
    ],
    answer: 2,
    explanation:
      "If studying always led to passing, then anyone who did not pass cannot have studied.",
    source: "authored",
  },
  {
    id: "en-log-19",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "The basket of dates is heavier than the basket of figs, the figs are heavier than the olives, and the olives are heavier than the grapes. Which basket is the second heaviest?",
    choices: ["dates", "olives", "grapes", "figs"],
    answer: 3,
    explanation:
      "From heaviest down: dates, figs, olives, grapes — so the figs are second.",
    source: "authored",
  },
  {
    id: "en-log-20",
    skill: "logical",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "Every carpenter in the market owns a saw, and some saw owners are not carpenters. Which statement must be true?",
    choices: [
      "Anyone who does not own a saw is not a carpenter in the market",
      "Everyone who owns a saw is a carpenter",
      "Some carpenters do not own a saw",
      "No carpenter owns a saw",
    ],
    answer: 0,
    explanation:
      "Since every carpenter in the market owns a saw, someone with no saw cannot be a carpenter there.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 5
  // ============================================================
  {
    id: "en-log-21",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 2, 3, 5, 9, 17, ?",
    choices: ["25", "33", "34", "36"],
    answer: 1,
    explanation:
      "The gap doubles each step: plus 1, 2, 4, 8, then 16, and 17 + 16 = 33.",
    source: "authored",
  },
  {
    id: "en-log-22",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "Complete the sequence: 1, 2, 6, 24, ?",
    choices: ["48", "72", "96", "120"],
    answer: 3,
    explanation:
      "The multiplier grows step by step: 1 × 2 = 2, 2 × 3 = 6, 6 × 4 = 24, and 24 × 5 = 120.",
    source: "authored",
  },
  {
    id: "en-log-23",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "Four people entered a contest: Hani, Wesam, Bader and Fady. Hani finished before Wesam, Bader finished after Wesam, and Fady finished after Bader. Who finished last?",
    choices: ["Hani", "Wesam", "Fady", "Bader"],
    answer: 2,
    explanation:
      "The order is Hani, Wesam, Bader, Fady, so Fady finished last.",
    source: "authored",
  },
  {
    id: "en-log-24",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "Store rule: nobody enters unless they are wearing a helmet. We saw a man inside the store. What follows for certain?",
    choices: [
      "The man is not wearing a helmet",
      "The man is wearing a helmet",
      "Everyone wearing a helmet entered the store",
      "Nothing can be known",
    ],
    answer: 1,
    explanation:
      "The rule blocks entry without a helmet, so anyone inside must be wearing one.",
    source: "authored",
  },
  {
    id: "en-log-25",
    skill: "logical",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "The seller said 'every fish in the box is fresh', and then his claim turned out to be false. What must be true?",
    choices: [
      "At least one fish is not fresh",
      "None of the fish is fresh",
      "Half of the fish are not fresh",
      "There is no fish in the box",
    ],
    answer: 0,
    explanation:
      "Denying 'every fish is fresh' only means at least one is not fresh; it does not mean all of them are stale.",
    source: "authored",
  },
];
