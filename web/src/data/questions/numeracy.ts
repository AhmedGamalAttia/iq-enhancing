import type { Question } from "@/lib/types";

// Numeracy bank — two INDEPENDENT banks (Arabic + English).
// Hand-authored; not copied from any standardized test.
//
// Fairness contract for this bank: the audience is every adult and older child
// regardless of schooling or trade. Difficulty must come from the *reasoning
// about quantities*, never from remembering a formula or a school procedure.
// So: everyday framing only (market prices, distance and time, splitting a
// bill, water in a tank, harvest, rent), any needed conversion is stated in the
// stem itself, and no jargon, brands, region, religion or politics.
//
// Arabic items carry NO Latin letters and no letter-variables: an unknown is
// named in words («العدد المجهول»), numerals are Arabic-Indic ٠١٢٣٤٥٦٧٨٩ in
// stems, choices and explanations alike, ٪ is used for percent and ٫ is the
// decimal separator. Currency is left unnamed wherever the item works without
// it; where a unit is needed the neutral «جنيه» is used.
//
// Item kinds used: percentages, ratio and proportion, averages, rates and
// speed, unit conversion, simple probability, everyday money and measurement,
// and reading a small stated table of numbers.

export const NUMERACY_QUESTIONS: Question[] = [
  // ============================================================
  // ARABIC — difficulty 1
  // ============================================================
  {
    id: "num-1",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    stem: "كم يساوي ١٠٪ من ٢٥٠؟",
    choices: ["١٥", "٢٠", "٢٥", "٣٠"],
    answer: 2,
    explanation: "١٠٪ تعني عُشر العدد، و٢٥٠ ÷ ١٠ = ٢٥.",
    source: "authored",
  },
  {
    id: "num-2",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    stem: "كم يساوي نصف ٤٨؟",
    choices: ["٢٢", "٢٤", "٢٦", "٢٨"],
    answer: 1,
    explanation: "النصف يعني القسمة على اثنين، و٤٨ ÷ ٢ = ٢٤.",
    source: "authored",
  },
  {
    id: "num-3",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    stem: "ثمن ٣ أرغفة ٦ جنيهات. كم ثمن الرغيف الواحد؟",
    choices: ["٢", "٣", "٤", "٦"],
    answer: 0,
    explanation: "نقسم الثمن على عدد الأرغفة، و٦ ÷ ٣ = ٢.",
    source: "authored",
  },
  {
    id: "num-4",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    stem: "في السلّة ١٢ تفاحة، وأُخذ ربعها. كم تفاحة بقيت؟",
    choices: ["٣", "٤", "٦", "٩"],
    answer: 3,
    explanation: "ربع ١٢ هو ٣ تفاحات، والباقي ١٢ − ٣ = ٩.",
    source: "authored",
  },
  {
    id: "num-5",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    stem: "الكيلومتر الواحد ١٠٠٠ متر. كم متراً في ٣ كيلومترات؟",
    choices: ["٣٠", "٣٠٠", "٣٠٠٠", "٣٠٠٠٠"],
    answer: 2,
    explanation: "نضرب عدد الكيلومترات في ١٠٠٠، و٣ × ١٠٠٠ = ٣٠٠٠.",
    source: "authored",
  },

  // ============================================================
  // ARABIC — difficulty 2
  // ============================================================
  {
    id: "num-6",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    stem: "إذا كان ثمن ٣ أقلام ١٢ جنيهاً، فكم ثمن ٥ أقلام؟",
    choices: ["١٦", "١٨", "٢٠", "٢٤"],
    answer: 2,
    explanation: "ثمن القلم الواحد ١٢ ÷ ٣ = ٤، وثمن الخمسة ٥ × ٤ = ٢٠.",
    source: "authored",
  },
  {
    id: "num-7",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    stem: "كم يساوي ثلث ٩٠؟",
    choices: ["٢٧", "٣٠", "٣٣", "٤٥"],
    answer: 1,
    explanation: "الثلث يعني القسمة على ثلاثة، و٩٠ ÷ ٣ = ٣٠.",
    source: "authored",
  },
  {
    id: "num-8",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    stem: "ما متوسط الأعداد ٤ و٧ و١٠؟",
    choices: ["٧", "٨", "٩", "١٠"],
    answer: 0,
    explanation: "نجمعها ٤ + ٧ + ١٠ = ٢١، ثم نقسم على عددها ٢١ ÷ ٣ = ٧.",
    source: "authored",
  },
  {
    id: "num-9",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    stem: "الساعة ٦٠ دقيقة. كم دقيقة في ساعتين ونصف؟",
    choices: ["٩٠", "١٢٠", "١٤٠", "١٥٠"],
    answer: 3,
    explanation:
      "الساعتان ٢ × ٦٠ = ١٢٠ دقيقة، ونصف الساعة ٣٠ دقيقة، والمجموع ١٢٠ + ٣٠ = ١٥٠.",
    source: "authored",
  },
  {
    id: "num-10",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    stem: "فكّر في عدد: إذا أُضيف إليه ٧ صار ١٢. فكم يساوي ضعف هذا العدد؟",
    choices: ["٥", "١٠", "١٢", "١٩"],
    answer: 1,
    explanation: "العدد المجهول هو ١٢ − ٧ = ٥، وضعفه ٢ × ٥ = ١٠.",
    source: "authored",
  },

  // ============================================================
  // ARABIC — difficulty 3
  // ============================================================
  {
    id: "num-11",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    stem: "في صفّ، نسبة عدد الأولاد إلى عدد البنات ٢ : ٣. إذا كان عدد الأولاد ١٠، فكم عدد البنات؟",
    choices: ["٦", "١٢", "١٥", "٢٠"],
    answer: 2,
    explanation:
      "كل ولدين يقابلهم ٣ بنات، وعدد الأولاد ١٠ أي خمسة أمثال الاثنين، فالبنات ٥ × ٣ = ١٥.",
    source: "authored",
  },
  {
    id: "num-12",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    stem: "ثمن ثوب ٢٤٠ جنيهاً، وخُصم منه ٢٥٪. كم صار ثمنه؟",
    choices: ["٦٠", "١٨٠", "٢٠٠", "٢٢٠"],
    answer: 1,
    explanation:
      "٢٥٪ هي ربع الثمن، و٢٤٠ ÷ ٤ = ٦٠، فالثمن بعد الخصم ٢٤٠ − ٦٠ = ١٨٠.",
    source: "authored",
  },
  {
    id: "num-13",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    stem: "تسير سيارة بسرعة ثابتة ٦٠ كيلومتراً في الساعة. كم كيلومتراً تقطع في ساعة ونصف؟",
    choices: ["٦٠", "٧٠", "٧٥", "٩٠"],
    answer: 3,
    explanation:
      "تقطع في الساعة ٦٠ كيلومتراً وفي نصف الساعة ٣٠، والمجموع ٦٠ + ٣٠ = ٩٠.",
    source: "authored",
  },
  {
    id: "num-14",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    stem: "في كيس ٣ كرات حمراء و٥ كرات زرقاء، وسحبنا كرة واحدة دون أن ننظر. ما احتمال أن تكون حمراء؟",
    choices: ["٣ من ٨", "١ من ٣", "٣ من ٥", "٥ من ٨"],
    answer: 0,
    explanation:
      "عدد الكرات كلّها ٣ + ٥ = ٨، والحمراء ٣ منها، فالاحتمال ٣ من ٨.",
    source: "authored",
  },
  {
    id: "num-15",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    stem: "مبيعات محلّ في ٣ أيام متتالية كانت: ١٢٠ ثم ٩٠ ثم ١٥٠. ما متوسط المبيعات اليومية؟",
    choices: ["١١٠", "١٢٠", "١٣٠", "١٤٠"],
    answer: 1,
    explanation:
      "مجموع المبيعات ١٢٠ + ٩٠ + ١٥٠ = ٣٦٠، والمتوسط ٣٦٠ ÷ ٣ = ١٢٠.",
    source: "authored",
  },

  // ============================================================
  // ARABIC — difficulty 4
  // ============================================================
  {
    id: "num-16",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    stem: "عدد زاد بنسبة ٢٠٪، ثم نقص الناتج بنسبة ٢٠٪. كيف يصبح مقارنةً بالعدد الأصلي؟",
    choices: [
      "يساوي الأصل",
      "أكبر من الأصل بـ ٤٪",
      "أقلّ من الأصل بـ ٤٪",
      "أقلّ من الأصل بـ ٢٠٪",
    ],
    answer: 2,
    explanation:
      "لو كان الأصل ١٠٠ لصار ١٢٠ بعد الزيادة، ثم ينقص منه ٢٠٪ وهي ٢٤ فيصير ١٢٠ − ٢٤ = ٩٦، أي أقلّ من الأصل بـ ٤٪.",
    source: "authored",
  },
  {
    id: "num-17",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    stem: "قطع قطار ١٨٠ كيلومتراً في ساعتين ونصف. ما سرعته المتوسطة؟",
    choices: [
      "٦٠ كيلومتراً في الساعة",
      "٧٢ كيلومتراً في الساعة",
      "٧٥ كيلومتراً في الساعة",
      "٩٠ كيلومتراً في الساعة",
    ],
    answer: 1,
    explanation:
      "السرعة المتوسطة هي المسافة مقسومة على الزمن، و١٨٠ ÷ ٢٫٥ = ٧٢.",
    source: "authored",
  },
  {
    id: "num-18",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    stem: "قُسّم مبلغ ٤٥٠ بين ثلاثة أشخاص بنسبة ١ : ٢ : ٣. كم نصيب صاحب النصيب الأكبر؟",
    choices: ["١٥٠", "١٨٠", "٢٢٥", "٢٧٠"],
    answer: 2,
    explanation:
      "مجموع الأنصبة ١ + ٢ + ٣ = ٦، والحصّة الواحدة ٤٥٠ ÷ ٦ = ٧٥، والنصيب الأكبر ٣ × ٧٥ = ٢٢٥.",
    source: "authored",
  },
  {
    id: "num-19",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    stem: "متوسط ٤ أعداد يساوي ١٠. أُضيف إليها عدد خامس فصار المتوسط ١٢. ما العدد المضاف؟",
    choices: ["١٤", "١٦", "١٨", "٢٠"],
    answer: 3,
    explanation:
      "مجموع الأربعة ٤ × ١٠ = ٤٠، ومجموع الخمسة ٥ × ١٢ = ٦٠، فالعدد المضاف ٦٠ − ٤٠ = ٢٠.",
    source: "authored",
  },
  {
    id: "num-20",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    stem: "أسعار الكيلو في السوق: الأرزّ ٢٠، والسكّر ١٥، والعدس ٢٥. اشترى رجل كيلوين من الأرزّ و٣ كيلوغرامات من السكّر. كم يدفع؟",
    choices: ["٧٥", "٨٠", "٨٥", "٩٥"],
    answer: 2,
    explanation:
      "ثمن الأرزّ ٢ × ٢٠ = ٤٠، وثمن السكّر ٣ × ١٥ = ٤٥، والمجموع ٤٠ + ٤٥ = ٨٥.",
    source: "authored",
  },

  // ============================================================
  // ARABIC — difficulty 5
  // ============================================================
  {
    id: "num-21",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    stem: "ينجز عامل عملاً في ٦ أيام، وينجزه عامل آخر في ٣ أيام. كم يوماً يستغرقان لو عملا معاً؟",
    choices: ["يومان", "٣ أيام", "٤ أيام ونصف", "٩ أيام"],
    answer: 0,
    explanation:
      "في اليوم الواحد ينجز الأول سدس العمل والثاني ثلثه، ومجموعهما نصف العمل، فيتمّان العمل في يومين.",
    source: "authored",
  },
  {
    id: "num-22",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    stem: "بعد خصم ٢٠٪ صار ثمن الجهاز ٤٨٠ جنيهاً. ما ثمنه قبل الخصم؟",
    choices: ["٥٢٠", "٥٧٦", "٥٩٠", "٦٠٠"],
    answer: 3,
    explanation:
      "الثمن بعد الخصم يمثّل ٨٠٪ من الأصل، فالأصل ٤٨٠ ÷ ٠٫٨ = ٦٠٠.",
    source: "authored",
  },
  {
    id: "num-23",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    stem: "متوسط وزن ٦ أكياس ١٥ كيلوغراماً، ومتوسط وزن ٤ أكياس أخرى ٢٠ كيلوغراماً. ما متوسط وزن الأكياس العشرة جميعاً؟",
    choices: ["١٧", "١٧٫٥", "١٨", "٢٠"],
    answer: 0,
    explanation:
      "وزن المجموعة الأولى ٦ × ١٥ = ٩٠، والثانية ٤ × ٢٠ = ٨٠، والمجموع ٩٠ + ٨٠ = ١٧٠، والمتوسط ١٧٠ ÷ ١٠ = ١٧.",
    source: "authored",
  },
  {
    id: "num-24",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    stem: "سار رجل ٦ كيلومترات بسرعة ٦ كيلومترات في الساعة، ثم سار ٦ كيلومترات أخرى بسرعة ٣ كيلومترات في الساعة. ما متوسط سرعته في الرحلة كلّها؟",
    choices: [
      "٤ كيلومترات في الساعة",
      "٤٫٥ كيلومتر في الساعة",
      "٥ كيلومترات في الساعة",
      "٦ كيلومترات في الساعة",
    ],
    answer: 0,
    explanation:
      "زمن الجزء الأول ساعة وزمن الثاني ساعتان، فقد قطع ١٢ كيلومتراً في ٣ ساعات، والمتوسط ١٢ ÷ ٣ = ٤.",
    source: "authored",
  },
  {
    id: "num-25",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    stem: "في خزّان ٨٠٠ لتر من الماء. استُهلك ربعه في اليوم الأول، وثلث الباقي في اليوم الثاني. كم لتراً بقي؟",
    choices: ["٢٠٠", "٣٠٠", "٣٥٠", "٤٠٠"],
    answer: 3,
    explanation:
      "ربع ٨٠٠ هو ٢٠٠ فيبقى ٨٠٠ − ٢٠٠ = ٦٠٠، وثلث ٦٠٠ هو ٢٠٠ فيبقى ٦٠٠ − ٢٠٠ = ٤٠٠.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 1
  // ============================================================
  {
    id: "en-num-1",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "What is 10% of 250?",
    choices: ["20", "25", "30", "35"],
    answer: 1,
    explanation: "10% means one tenth, and 250 ÷ 10 = 25.",
    source: "authored",
  },
  {
    id: "en-num-2",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "What is half of 48?",
    choices: ["20", "22", "24", "26"],
    answer: 2,
    explanation: "Half means dividing by two, and 48 ÷ 2 = 24.",
    source: "authored",
  },
  {
    id: "en-num-3",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "Three loaves of bread cost 6. What do 4 loaves cost?",
    choices: ["2", "4", "6", "8"],
    answer: 3,
    explanation: "One loaf costs 6 ÷ 3 = 2, so four loaves cost 4 × 2 = 8.",
    source: "authored",
  },
  {
    id: "en-num-4",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "A basket holds 12 apples, and a quarter of them were taken. How many were taken?",
    choices: ["3", "4", "6", "9"],
    answer: 0,
    explanation: "A quarter means dividing by four, and 12 ÷ 4 = 3.",
    source: "authored",
  },
  {
    id: "en-num-5",
    skill: "numeracy",
    difficulty: 1,
    type: "mcq",
    locale: "en",
    stem: "One kilometre is 1000 metres. How many metres are there in 3 kilometres?",
    choices: ["300", "3000", "30000", "300000"],
    answer: 1,
    explanation: "Multiply the kilometres by 1000, and 3 × 1000 = 3000.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 2
  // ============================================================
  {
    id: "en-num-6",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "If 3 pens cost 12, how much do 5 pens cost?",
    choices: ["12", "15", "18", "20"],
    answer: 3,
    explanation: "One pen costs 12 ÷ 3 = 4, so five pens cost 5 × 4 = 20.",
    source: "authored",
  },
  {
    id: "en-num-7",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "What is one third of 90?",
    choices: ["30", "33", "45", "60"],
    answer: 0,
    explanation: "One third means dividing by three, and 90 ÷ 3 = 30.",
    source: "authored",
  },
  {
    id: "en-num-8",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "What is the average of 4, 7 and 10?",
    choices: ["5", "6", "7", "8"],
    answer: 2,
    explanation: "Add them: 4 + 7 + 10 = 21, then divide by how many: 21 ÷ 3 = 7.",
    source: "authored",
  },
  {
    id: "en-num-9",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "An hour is 60 minutes. How many minutes are there in two and a half hours?",
    choices: ["120", "150", "160", "250"],
    answer: 1,
    explanation:
      "Two hours are 2 × 60 = 120 minutes, and with 30 more for the half hour, 120 + 30 = 150.",
    source: "authored",
  },
  {
    id: "en-num-10",
    skill: "numeracy",
    difficulty: 2,
    type: "mcq",
    locale: "en",
    stem: "You buy two items that cost 18 each. How much do you spend in total?",
    choices: ["18", "20", "32", "36"],
    answer: 3,
    explanation: "Two items at the same price cost 2 × 18 = 36.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 3
  // ============================================================
  {
    id: "en-num-11",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "In a class, the ratio of boys to girls is 2 : 3. If there are 10 boys, how many girls are there?",
    choices: ["15", "20", "25", "30"],
    answer: 0,
    explanation:
      "Every 2 boys go with 3 girls, and 10 boys is five such groups, so the girls are 5 × 3 = 15.",
    source: "authored",
  },
  {
    id: "en-num-12",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "A garment costs 240 and is discounted by 25%. What is its new price?",
    choices: ["60", "160", "180", "200"],
    answer: 2,
    explanation:
      "25% is a quarter, and 240 ÷ 4 = 60, so the new price is 240 − 60 = 180.",
    source: "authored",
  },
  {
    id: "en-num-13",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "A car travels at a steady 60 kilometres per hour. How far does it go in one and a half hours?",
    choices: ["75", "90", "100", "120"],
    answer: 1,
    explanation:
      "It covers 60 kilometres in an hour and 30 in half an hour, and 60 + 30 = 90.",
    source: "authored",
  },
  {
    id: "en-num-14",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "A bag holds 3 red balls and 5 blue balls, and one ball is drawn without looking. What is the chance it is red?",
    choices: ["1 in 3", "3 in 5", "5 in 8", "3 in 8"],
    answer: 3,
    explanation:
      "There are 3 + 5 = 8 balls in all and 3 of them are red, so the chance is 3 in 8.",
    source: "authored",
  },
  {
    id: "en-num-15",
    skill: "numeracy",
    difficulty: 3,
    type: "mcq",
    locale: "en",
    stem: "A shop's sales over 3 days in a row were 120, then 90, then 150. What were the average daily sales?",
    choices: ["100", "110", "120", "130"],
    answer: 2,
    explanation: "The total is 120 + 90 + 150 = 360, and the average is 360 ÷ 3 = 120.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 4
  // ============================================================
  {
    id: "en-num-16",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "A number rises by 20%, and then that result falls by 20%. Compared with the original number it is:",
    choices: [
      "4% below the original",
      "equal to the original",
      "4% above the original",
      "20% below the original",
    ],
    answer: 0,
    explanation:
      "Starting from 100 it becomes 120, then loses 20% of 120, which is 24, giving 120 − 24 = 96 — that is 4% below the original.",
    source: "authored",
  },
  {
    id: "en-num-17",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "A train covers 180 kilometres in two and a half hours. What is its average speed?",
    choices: [
      "72 kilometres per hour",
      "75 kilometres per hour",
      "80 kilometres per hour",
      "90 kilometres per hour",
    ],
    answer: 0,
    explanation:
      "Average speed is distance divided by time, and 180 ÷ 2.5 = 72.",
    source: "authored",
  },
  {
    id: "en-num-18",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "An amount of 450 is split between three people in the ratio 1 : 2 : 3. How much does the largest share come to?",
    choices: ["150", "225", "270", "300"],
    answer: 1,
    explanation:
      "The shares add up to 1 + 2 + 3 = 6, one share is 450 ÷ 6 = 75, so the largest is 3 × 75 = 225.",
    source: "authored",
  },
  {
    id: "en-num-19",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "The average of 4 numbers is 10. A fifth number is added and the average becomes 12. What is the added number?",
    choices: ["16", "18", "20", "22"],
    answer: 2,
    explanation:
      "The four add up to 4 × 10 = 40 and the five add up to 5 × 12 = 60, so the added number is 60 − 40 = 20.",
    source: "authored",
  },
  {
    id: "en-num-20",
    skill: "numeracy",
    difficulty: 4,
    type: "mcq",
    locale: "en",
    stem: "Market prices per kilo: rice 20, sugar 15, lentils 25. A man buys 2 kilos of rice and 3 kilos of sugar. How much does he pay?",
    choices: ["55", "70", "75", "85"],
    answer: 3,
    explanation:
      "The rice costs 2 × 20 = 40 and the sugar costs 3 × 15 = 45, so together 40 + 45 = 85.",
    source: "authored",
  },

  // ============================================================
  // ENGLISH — difficulty 5
  // ============================================================
  {
    id: "en-num-21",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "One worker finishes a job in 6 days, and another finishes the same job in 3 days. Working together, how long do they take?",
    choices: ["1 day", "2 days", "4.5 days", "9 days"],
    answer: 1,
    explanation:
      "Each day the first does a sixth of the job and the second a third, which together is half the job, so they need 2 days.",
    source: "authored",
  },
  {
    id: "en-num-22",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "After a 20% discount, a device costs 480. What was its price before the discount?",
    choices: ["520", "576", "600", "624"],
    answer: 2,
    explanation:
      "The discounted price is 80% of the original, so the original is 480 ÷ 0.8 = 600.",
    source: "authored",
  },
  {
    id: "en-num-23",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "Six sacks weigh 15 kilos on average, and four other sacks weigh 20 kilos on average. What is the average weight of all ten sacks?",
    choices: ["16", "16.5", "17", "17.5"],
    answer: 2,
    explanation:
      "The first group weighs 6 × 15 = 90 and the second 4 × 20 = 80, together 90 + 80 = 170, and 170 ÷ 10 = 17.",
    source: "authored",
  },
  {
    id: "en-num-24",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "A man walks 6 kilometres at 6 kilometres per hour, then another 6 kilometres at 3 kilometres per hour. What is his average speed for the whole walk?",
    choices: [
      "4 kilometres per hour",
      "4.5 kilometres per hour",
      "5 kilometres per hour",
      "6 kilometres per hour",
    ],
    answer: 0,
    explanation:
      "The first part takes one hour and the second takes two, so he covers 12 kilometres in 3 hours, and 12 ÷ 3 = 4.",
    source: "authored",
  },
  {
    id: "en-num-25",
    skill: "numeracy",
    difficulty: 5,
    type: "mcq",
    locale: "en",
    stem: "A tank holds 800 litres of water. A quarter is used on the first day, and a third of what is left on the second day. How many litres remain?",
    choices: ["200", "300", "350", "400"],
    answer: 3,
    explanation:
      "A quarter of 800 is 200, leaving 800 − 200 = 600; a third of 600 is 200, leaving 600 − 200 = 400.",
    source: "authored",
  },
];
