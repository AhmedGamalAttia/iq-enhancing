import type { Locale } from "./config";
import type { SkillKey } from "@/lib/types";

// All user-facing strings. Both dictionaries implement the same interface, so
// the type checker guarantees no key is missing in either language.
export interface Messages {
  nav: {
    brand: string;
    home: string;
    journey: string;
    diagnostic: string;
    results: string;
    practice: string;
    login: string;
    logout: string;
    guest: string;
  };
  lang: { switchTo: string; label: string };
  home: {
    heroBadge: string;
    heroTitle1: string;
    heroTitle2: string;
    heroSubtitle: string;
    ctaStart: string;
    ctaPractice: string;
    howTitle: string;
    stepLabel: (n: string) => string;
    steps: { title: string; body: string; icon: string }[];
    dimsTitle: string;
    dimsSubtitle: string;
    principlesTitle: string;
    principles: { t: string; d: string }[];
    ctaTitle: string;
    ctaSubtitle: string;
    ctaNow: string;
    footer: string;
  };
  diagnostic: {
    title: string;
    intro: (count: number) => string;
    notIQ: string;
    start: string;
    saving: string;
    goResults: string;
  };
  question: {
    progress: (i: number, n: number, d: number) => string;
    correct: string;
    incorrect: string;
    next: string;
    finish: string;
    explainAI: string;
    generating: string;
    aiExtraTitle: string;
    aiConnectError: string;
    letters: string[];
  };
  results: {
    loading: string;
    noResultsTitle: string;
    noResultsBody: string;
    startAssessment: string;
    title: string;
    lastAssessment: (date: string) => string;
    outOf100: string;
    correctOfTotal: (correct: number, total: number) => string;
    recommendationTitle: string;
    recommendationBody: (skill: string) => string;
    startTraining: string;
    retake: string;
    trendTitle: string;
    trendNeedMore: string;
    trendAvgLabel: string;
    trendChangeTitle: string;
    trendHistoryTitle: string;
  };
  practice: {
    title: string;
    subtitle: string;
    loading: string;
    emptyTitle: string;
    emptyBody: string;
    newAssessment: string;
    doneTitle: string;
    doneBody: (correct: number, total: number) => string;
    newSession: string;
    myResults: string;
    aiPanelTitle: string;
    difficultyOpt: (d: number) => string;
    generate: string;
    generating: string;
    aiNote: string;
  };
  login: {
    signinTitle: string;
    signupTitle: string;
    subtitle: string;
    email: string;
    password: string;
    genericError: string;
    signupSuccess: string;
    signin: string;
    signup: string;
    busy: string;
    toSignup: string;
    toSignin: string;
    notConfiguredTitle: string;
    notConfiguredBody: string;
    backHome: string;
  };
  journey: {
    title: string;
    subtitle: string;
    streak: (n: number) => string;
    noStreak: string;
    nextStepBadge: string;
    assessTitle: string;
    assessDesc: string;
    assessCta: string;
    assessDoneAt: (date: string) => string;
    practiceTitle: string;
    practiceDesc: string;
    dueToday: (n: number) => string;
    noDueToday: string;
    practiceCta: string;
    cadence: string;
    progressTitle: string;
    progressDesc: string;
    progressCta: string;
    reassessTitle: string;
    reassessDesc: string;
    reassessIn: (days: number) => string;
    reassessReady: string;
    reassessCta: string;
    done: string;
  };
  onboarding: {
    skip: string;
    next: string;
    back: string;
    start: string;
    steps: { title: string; body: string; icon: string }[];
  };
  nback: {
    title: string;
    intro: string;
    instruction: (n: number) => string;
    chooseLevel: string;
    level: (n: number) => string;
    start: string;
    getReady: string;
    match: string;
    matchHint: string;
    progress: (i: number, total: number) => string;
    doneTitle: string;
    scoreLabel: string;
    hitsLabel: string;
    missesLabel: string;
    falseAlarmsLabel: string;
    interpHigh: string;
    interpMid: string;
    interpLow: string;
    playAgain: string;
    toPractice: string;
    bestLabel: (n: number) => string;
    cardHint: string;
  };
  abstract: {
    title: string;
    cardHint: string;
    intro: string;
    patternsNote: string;
    instrSequence: string;
    instrMatrix: string;
    instrOddone: string;
    start: string;
    levelNow: (score: number) => string;
    progress: (i: number, total: number) => string;
    correct: string;
    incorrect: string;
    next: string;
    finish: string;
    doneTitle: string;
    estimatedLevel: string;
    accuracy: (c: number, t: number) => string;
    again: string;
    toPractice: string;
  };
  daily: {
    title: string;
    cardHint: string;
    intro: string;
    nameLabel: string;
    namePlaceholder: string;
    start: string;
    elapsed: string;
    progress: (i: number, total: number) => string;
    doneTitle: string;
    correctLabel: string;
    timeLabel: string;
    scoreLabel: string;
    rank: (rank: number, total: number) => string;
    percentile: (p: number) => string;
    leaderboardTitle: string;
    you: string;
    guestNote: string;
    emptyBoard: string;
    comeBack: string;
    toJourney: string;
    streakDays: (n: number) => string;
    keepStreak: string;
    badgesTitle: string;
    newBadge: string;
    badgeNames: Record<string, string>;
  };
  bands: {
    advanced: string;
    veryGood: string;
    average: string;
    needsWork: string;
    beginner: string;
  };
  skills: Record<SkillKey, { name: string; tagline: string; desc: string }>;
}

const ar: Messages = {
  nav: {
    brand: "منصّة القدرات المعرفية",
    home: "الرئيسية",
    journey: "رحلتي",
    diagnostic: "التقييم",
    results: "النتائج",
    practice: "التدريب",
    login: "دخول",
    logout: "خروج",
    guest: "وضع ضيف",
  },
  lang: { switchTo: "English", label: "اللغة" },
  home: {
    heroBadge: "قائم على الأدلّة العلمية — لا لعبة ولا تسلية",
    heroTitle1: "طوّر قدراتك المعرفية",
    heroTitle2: "بطريقة علمية ممنهجة",
    heroSubtitle:
      "منصّة تبدأ بتقييم دقيق لمهاراتك المعرفية، ثم ترسم لك مسار تطوير مخصّصاً يعتمد على أقوى تقنيات التعلّم المثبتة علمياً — لتتعلّم أسرع وتفكّر أوضح.",
    ctaStart: "ابدأ رحلتك المجانية",
    ctaPractice: "جرّب التدريب",
    howTitle: "كيف تعمل المنصّة",
    stepLabel: (n) => `الخطوة ${n}`,
    steps: [
      { title: "تقييم تشخيصي", body: "أسئلة تكيّفية تحدّد مستواك الحقيقي في كل محور معرفي بدقّة.", icon: "🧭" },
      { title: "مسار مخصّص", body: "نحلّل نقاط قوّتك وضعفك ونوجّه تدريبك نحو ما يحتاج تطويراً فعلاً.", icon: "🗺️" },
      { title: "تدريب بالتكرار المتباعد", body: "خوارزمية FSRS تعيد الأسئلة في التوقيت الأمثل لتثبيتها في ذاكرتك بعيدة المدى.", icon: "🔁" },
    ],
    dimsTitle: "المحاور المعرفية",
    dimsSubtitle: "خمسة محاور تغطّي جوانب أساسية من التفكير والتعلّم، ونتوسّع تدريجياً.",
    principlesTitle: "على ماذا نبني علمياً",
    principles: [
      { t: "الاسترجاع النشط", d: "الاختبار الذاتي يرسّخ التعلّم أكثر من القراءة السلبية." },
      { t: "التكرار المتباعد", d: "مراجعة المعلومة قبيل نسيانها مباشرةً هي الأكفأ." },
      { t: "الممارسة المتعمّدة", d: "تدريب مركّز على نقاط الضعف تحديداً، لا العشوائية." },
      { t: "ما وراء المعرفة", d: "تقارير تجعلك تفهم كيف تتعلّم وتفكّر، لا أن تحفظ فقط." },
    ],
    ctaTitle: "جاهز تبدأ رحلتك؟",
    ctaSubtitle: "التقييم يستغرق دقائق، ويمنحك خريطة واضحة لقدراتك ومسار تطويرك.",
    ctaNow: "ابدأ الآن",
    footer: "منصّة تنمية القدرات المعرفية — نسخة أولية (MVP)",
  },
  diagnostic: {
    title: "التقييم التشخيصي",
    intro: (count) =>
      `${count} سؤالاً تكيّفياً تقيس مستواك في خمسة محاور معرفية. تزداد صعوبة الأسئلة مع إجاباتك الصحيحة لنصل لتقدير دقيق لقدراتك. لن يستغرق الأمر أكثر من بضع دقائق.`,
    notIQ: "ملاحظة: هذا تقييم تشخيصي للمهارات المعرفية، وليس اختبار ذكاء (IQ) معياري.",
    start: "ابدأ التقييم",
    saving: "جارٍ حساب نتائجك…",
    goResults: "اذهب للنتائج",
  },
  question: {
    progress: (i, n, d) => `سؤال ${i} / ${n} · صعوبة ${d}/5`,
    correct: "✅ إجابة صحيحة",
    incorrect: "❌ إجابة غير صحيحة",
    next: "التالي ←",
    finish: "إنهاء",
    explainAI: "🤖 اشرح لي أكثر بالذكاء الاصطناعي",
    generating: "…جارٍ التوليد",
    aiExtraTitle: "🤖 شرح إضافي بالذكاء الاصطناعي",
    aiConnectError: "تعذّر الاتصال بخدمة الشرح.",
    letters: ["أ", "ب", "ج", "د", "هـ"],
  },
  results: {
    loading: "…جارٍ التحميل",
    noResultsTitle: "لا توجد نتائج بعد",
    noResultsBody: "ابدأ بالتقييم التشخيصي لنرسم لك خريطة قدراتك ومسار تطويرك.",
    startAssessment: "ابدأ التقييم",
    title: "نتائج تقييمك المعرفي",
    lastAssessment: (date) => `آخر تقييم: ${date}`,
    outOf100: "/100",
    correctOfTotal: (correct, total) =>
      `أجبت بشكل صحيح على ${correct} من ${total} سؤالاً في هذا المحور.`,
    recommendationTitle: "توصية مسار التطوير",
    recommendationBody: (skill) =>
      `محور «${skill}» هو الأكثر حاجة للتطوير حالياً. ركّز تدريبك عليه أولاً — الممارسة المتعمّدة على نقاط الضعف هي أسرع طريق للتحسّن.`,
    startTraining: "ابدأ التدريب الآن",
    retake: "أعد التقييم",
    trendTitle: "تطوّرك عبر الزمن",
    trendNeedMore: "أعد التقييم بعد فترة عشان تشوف تطوّرك عبر الزمن.",
    trendAvgLabel: "متوسّط الدرجة",
    trendChangeTitle: "التغيّر منذ أول تقييم",
    trendHistoryTitle: "سجل التقييمات",
  },
  practice: {
    title: "التدريب",
    subtitle: "تكرار متباعد + ممارسة متعمّدة على نقاط ضعفك",
    loading: "…جارٍ تجهيز جلستك",
    emptyTitle: "لا توجد مراجعات مستحقّة الآن",
    emptyBody:
      "أحسنت! راجعت كل ما هو مستحقّ اليوم. يمكنك توليد تمارين إضافية بالذكاء الاصطناعي، أو إجراء تقييم جديد.",
    newAssessment: "تقييم جديد",
    doneTitle: "انتهت الجلسة",
    doneBody: (correct, total) =>
      `أجبت بشكل صحيح على ${correct} من ${total}. سيتم جدولة الأسئلة تلقائياً لمراجعتها في الوقت الأمثل لتثبيتها في ذاكرتك.`,
    newSession: "جلسة جديدة",
    myResults: "نتائجي",
    aiPanelTitle: "🤖 ولّد تمارين إضافية بالذكاء الاصطناعي",
    difficultyOpt: (d) => `صعوبة ${d}`,
    generate: "ولّد ٣ أسئلة",
    generating: "…جارٍ التوليد",
    aiNote: "الأسئلة المولّدة للتدريب الفوري ولا تُحفظ في بنك المراجعة.",
  },
  login: {
    signinTitle: "تسجيل الدخول",
    signupTitle: "إنشاء حساب",
    subtitle: "احفظ تقدّمك وزامنه عبر أجهزتك.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    genericError: "حدث خطأ ما.",
    signupSuccess:
      "تم إنشاء الحساب. إن طُلب تأكيد البريد فتحقّق من صندوق الوارد ثم سجّل الدخول.",
    signin: "دخول",
    signup: "إنشاء حساب",
    busy: "…جارٍ",
    toSignup: "ليس لديك حساب؟ أنشئ حساباً",
    toSignin: "لديك حساب؟ سجّل الدخول",
    notConfiguredTitle: "الحسابات غير مفعّلة بعد",
    notConfiguredBody:
      "المنصّة تعمل حالياً في وضع الضيف (يُحفظ تقدّمك على هذا المتصفح). لتفعيل الحسابات والمزامنة، أضِف مفاتيح Supabase في ملف .env.local.",
    backHome: "العودة للرئيسية",
  },
  journey: {
    title: "رحلتك المعرفية",
    subtitle: "دي خطواتك المنظّمة للتطوّر — اتبعها بالترتيب.",
    streak: (n) => `🔥 ${n} يوم متتالي`,
    noStreak: "ابدأ سلسلتك اليومية النهاردة",
    nextStepBadge: "خطوتك التالية",
    assessTitle: "١) قيّم مستواك",
    assessDesc: "ابدأ بتقييم تشخيصي يحدّد نقاط قوّتك وضعفك في الخمس محاور.",
    assessCta: "ابدأ التقييم",
    assessDoneAt: (date) => `تمّ آخر تقييم: ${date}`,
    practiceTitle: "٢) درّب يومياً",
    practiceDesc: "اتدرّب على نقاط ضعفك بالتكرار المتباعد — أقصر طريق للتحسّن.",
    dueToday: (n) => `عندك ${n} سؤال مستحقّ للمراجعة النهاردة`,
    noDueToday: "لا مراجعات مستحقّة الآن — تقدر تتدرّب أو تولّد تمارين جديدة.",
    practiceCta: "ابدأ جلسة النهاردة",
    cadence: "الإيقاع الموصى به: ١٠–١٥ دقيقة يومياً، ٤–٥ أيام أسبوعياً. الاستمرارية أهم من طول الجلسة.",
    progressTitle: "٣) تابع تقدّمك",
    progressDesc: "شوف مستواك في كل محور وتطوّرك عبر الوقت.",
    progressCta: "شوف نتائجي",
    reassessTitle: "٤) أعد التقييم",
    reassessDesc: "كل أسبوعين، أعد التقييم عشان تقيس تحسّنك فعلياً.",
    reassessIn: (days) => `متاح بعد ${days} يوم`,
    reassessReady: "حان وقت إعادة التقييم — قِس تقدّمك!",
    reassessCta: "أعد التقييم",
    done: "تمّ ✓",
  },
  onboarding: {
    skip: "تخطّي",
    next: "التالي",
    back: "رجوع",
    start: "يلا نبدأ",
    steps: [
      { title: "أهلاً بيك 👋", body: "دي منصّة علمية لتطوير قدراتك المعرفية — مش لعبة ولا تسلية. هدفنا تتعلّم أسرع وتفكّر أوضح.", icon: "🎯" },
      { title: "بتشتغل إزاي", body: "١) قيّم مستواك. ٢) درّب يومياً على نقاط ضعفك بالتكرار المتباعد. ٣) تابع تقدّمك. ٤) أعد التقييم كل أسبوعين.", icon: "🔄" },
      { title: "المطلوب منك", body: "١٠–١٥ دقيقة يومياً، ٤–٥ أيام أسبوعياً. الاستمرارية أهم من المدّة — والتطبيق هيقولك كل يوم تعمل إيه.", icon: "⏱️" },
    ],
  },
  nback: {
    title: "تمرين الذاكرة العاملة (n-back)",
    intro: "هيضيء مربّع في الشبكة، واحد ورا التاني. مهمتك تفتكر مواقعهم.",
    instruction: (n) =>
      `اضغط «تطابق» لما موقع المربّع الحالي يكون نفس موقع اللي ظهر قبله بـ ${n} خطوات.`,
    chooseLevel: "اختر المستوى:",
    level: (n) => `${n}-back`,
    start: "ابدأ",
    getReady: "استعد…",
    match: "تطابق",
    matchHint: "اضغط عند التطابق (أو مفتاح المسافة)",
    progress: (i, total) => `${i} / ${total}`,
    doneTitle: "انتهى التمرين",
    scoreLabel: "الدرجة",
    hitsLabel: "إصابات",
    missesLabel: "إغفالات",
    falseAlarmsLabel: "إنذارات خاطئة",
    interpHigh: "ممتاز! ذاكرتك العاملة قوية في هذا المستوى — جرّب مستوى أصعب.",
    interpMid: "جيّد — استمر بالتدريب المنتظم لتتحسّن.",
    interpLow: "بداية جيّدة. جرّب مستوى أسهل وركّز على تتبّع المواقع.",
    playAgain: "مرة أخرى",
    toPractice: "رجوع للتدريب",
    bestLabel: (n) => `أفضل نتيجة (${n}-back)`,
    cardHint: "تمرين تفاعلي بمؤقّت لتقوية الذاكرة العاملة",
  },
  abstract: {
    title: "الاستدلال المجرّد",
    cardHint: "أنماط بصرية عادلة للجميع — بلا لغة ولا ثقافة، وتتكيّف مع مستواك",
    intro: "أنماط بصرية مولّدة تلقائياً — بلا لغة ولا معلومات مسبقة، فتناسب أي عمر أو خلفية. اكتشف القاعدة واختر الإجابة.",
    patternsNote: "٣ أنماط: إكمال التسلسل، إكمال الشبكة، واكتشاف الشاذ.",
    instrSequence: "اختر ما يُكمل التسلسل:",
    instrMatrix: "اختر ما يُكمل الشبكة:",
    instrOddone: "اكتشف الشكل الشاذ:",
    start: "ابدأ",
    levelNow: (s) => `مستواك الآن: ${s}`,
    progress: (i, total) => `${i} / ${total}`,
    correct: "✅ إجابة صحيحة",
    incorrect: "❌ إجابة غير صحيحة",
    next: "التالي ←",
    finish: "إنهاء",
    doneTitle: "انتهت الجلسة",
    estimatedLevel: "مستواك المُقدَّر",
    accuracy: (c, t) => `أجبت صح على ${c} من ${t}`,
    again: "مرة أخرى",
    toPractice: "رجوع للتدريب",
  },
  daily: {
    title: "تحدّي اليوم",
    cardHint: "نفس الأسئلة للجميع اليوم — الأسرع والأدقّ يتصدّر",
    intro: "١٠ أسئلة مجرّدة، نفس الأسئلة لكل اللاعبين النهاردة. حُلّها بأسرع وأدقّ ما يمكن — والوقت بيجري!",
    nameLabel: "اسمك في اللوحة",
    namePlaceholder: "لاعب",
    start: "ابدأ التحدّي",
    elapsed: "الوقت",
    progress: (i, total) => `${i} / ${total}`,
    doneTitle: "خلّصت تحدّي النهاردة! 🎉",
    correctLabel: "إجابات صحيحة",
    timeLabel: "الوقت الكلّي",
    scoreLabel: "النقاط",
    rank: (rank, total) => `ترتيبك ${rank} من ${total}`,
    percentile: (p) => `أفضل من ${p}% من لاعبي اليوم`,
    leaderboardTitle: "متصدّرو اليوم",
    you: "أنت",
    guestNote: "سجّل دخول عشان تدخل لوحة المتصدّرين.",
    emptyBoard: "كن أول المتصدّرين اليوم!",
    comeBack: "ارجع بكرة لتحدّي جديد.",
    toJourney: "رجوع لرحلتي",
    streakDays: (n) => `🔥 ${n} يوم متتالي`,
    keepStreak: "لا تكسر السلسلة — ارجع كل يوم!",
    badgesTitle: "شاراتك",
    newBadge: "جديدة!",
    badgeNames: {
      first: "أول تحدّي",
      perfect: "علامة كاملة",
      speedy: "سريع ودقيق",
      streak3: "٣ أيام متتالية",
      streak7: "أسبوع كامل",
      streak30: "شهر كامل",
      podium: "منصّة التتويج",
      champion: "بطل اليوم",
    },
  },
  bands: {
    advanced: "متقدّم",
    veryGood: "جيّد جداً",
    average: "متوسّط",
    needsWork: "يحتاج تطويراً",
    beginner: "مبتدئ",
  },
  skills: {
    abstract: {
      name: "الاستدلال المجرّد",
      tagline: "أنماط بصرية عادلة — بلا لغة أو ثقافة",
      desc: "القدرة على اكتشاف الأنماط والعلاقات المجرّدة في الأشكال — مقياس عادل للتفكير لا يعتمد على لغة أو تعليم أو ثقافة.",
    },
    logical: {
      name: "الاستدلال المنطقي",
      tagline: "الأنماط، الاستنتاج، والقياس المنطقي",
      desc: "القدرة على اكتشاف الأنماط، واستنتاج النتائج من المقدّمات، والتعامل مع العلاقات الشرطية والمتتاليات.",
    },
    verbal: {
      name: "الاستدلال اللفظي",
      tagline: "التناظر اللفظي، المفردات، والعلاقات بين الكلمات",
      desc: "القدرة على فهم العلاقات بين الكلمات والمعاني، والتناظر اللفظي، وإدراك المفردات ودلالاتها.",
    },
    working_memory: {
      name: "الذاكرة العاملة",
      tagline: "الاحتفاظ بالمعلومات ومعالجتها ذهنياً",
      desc: "القدرة على الاحتفاظ بالمعلومات في الذهن ومعالجتها آنياً — كترتيب سلاسل أو عكسها أو تتبّع مواضع العناصر.",
    },
    numeracy: {
      name: "التفكير الكمّي",
      tagline: "الأعداد، النِّسب، والاستدلال الرياضي",
      desc: "القدرة على التعامل مع الأعداد والنِّسب والمعدّلات وحلّ المسائل الكمّية والاستدلال الرياضي.",
    },
    critical: {
      name: "التفكير النقدي",
      tagline: "كشف المغالطات، تقييم الأدلّة، والتفكير الاحتمالي",
      desc: "القدرة على تقييم الحُجج والأدلّة، وكشف المغالطات المنطقية، والتفكير الاحتمالي السليم.",
    },
  },
};

const en: Messages = {
  nav: {
    brand: "Cognitive Skills Platform",
    home: "Home",
    journey: "My Journey",
    diagnostic: "Assessment",
    results: "Results",
    practice: "Practice",
    login: "Sign in",
    logout: "Sign out",
    guest: "Guest mode",
  },
  lang: { switchTo: "العربية", label: "Language" },
  home: {
    heroBadge: "Evidence-based — not a game, not entertainment",
    heroTitle1: "Develop your cognitive abilities",
    heroTitle2: "the scientific, methodical way",
    heroSubtitle:
      "A platform that starts with a precise assessment of your cognitive skills, then builds you a personalized development path grounded in the most proven learning science — so you learn faster and think clearer.",
    ctaStart: "Start your free journey",
    ctaPractice: "Try practice",
    howTitle: "How it works",
    stepLabel: (n) => `Step ${n}`,
    steps: [
      { title: "Diagnostic assessment", body: "Adaptive questions that pinpoint your true level in each cognitive dimension.", icon: "🧭" },
      { title: "Personalized path", body: "We analyze your strengths and weaknesses and steer your training toward what truly needs work.", icon: "🗺️" },
      { title: "Spaced-repetition training", body: "The FSRS algorithm reschedules questions at the optimal time to cement them in long-term memory.", icon: "🔁" },
    ],
    dimsTitle: "The cognitive dimensions",
    dimsSubtitle: "Five dimensions covering core aspects of thinking and learning — and we keep expanding.",
    principlesTitle: "The science we build on",
    principles: [
      { t: "Active recall", d: "Testing yourself embeds learning far better than passive rereading." },
      { t: "Spaced repetition", d: "Reviewing right before you would forget is the most efficient." },
      { t: "Deliberate practice", d: "Focused training on your specific weak spots, not random drills." },
      { t: "Metacognition", d: "Reports that help you understand how you learn and think, not just memorize." },
    ],
    ctaTitle: "Ready to start your journey?",
    ctaSubtitle: "The assessment takes minutes and gives you a clear map of your abilities and path.",
    ctaNow: "Start now",
    footer: "Cognitive Skills Platform — early version (MVP)",
  },
  diagnostic: {
    title: "The diagnostic assessment",
    intro: (count) =>
      `${count} adaptive questions measuring your level across five cognitive dimensions. Questions get harder as you answer correctly, for a precise estimate of your abilities. It takes only a few minutes.`,
    notIQ: "Note: this is a diagnostic of cognitive skills, not a standardized IQ test.",
    start: "Start assessment",
    saving: "Calculating your results…",
    goResults: "Go to results",
  },
  question: {
    progress: (i, n, d) => `Question ${i} / ${n} · difficulty ${d}/5`,
    correct: "✅ Correct",
    incorrect: "❌ Incorrect",
    next: "Next →",
    finish: "Finish",
    explainAI: "🤖 Explain more with AI",
    generating: "…generating",
    aiExtraTitle: "🤖 Extra AI explanation",
    aiConnectError: "Could not reach the explanation service.",
    letters: ["A", "B", "C", "D", "E"],
  },
  results: {
    loading: "…loading",
    noResultsTitle: "No results yet",
    noResultsBody: "Start with the diagnostic so we can map your abilities and path.",
    startAssessment: "Start assessment",
    title: "Your cognitive results",
    lastAssessment: (date) => `Last assessment: ${date}`,
    outOf100: "/100",
    correctOfTotal: (correct, total) =>
      `You answered ${correct} of ${total} questions correctly in this dimension.`,
    recommendationTitle: "Development recommendation",
    recommendationBody: (skill) =>
      `“${skill}” needs the most development right now. Focus your training there first — deliberate practice on weak spots is the fastest way to improve.`,
    startTraining: "Start training now",
    retake: "Retake assessment",
    trendTitle: "Your progress over time",
    trendNeedMore: "Re-assess after a while to see your progress over time.",
    trendAvgLabel: "Average score",
    trendChangeTitle: "Change since first assessment",
    trendHistoryTitle: "Assessment history",
  },
  practice: {
    title: "Practice",
    subtitle: "Spaced repetition + deliberate practice on your weak spots",
    loading: "…preparing your session",
    emptyTitle: "No reviews due right now",
    emptyBody:
      "Well done! You reviewed everything due today. You can generate extra AI practice, or take a new assessment.",
    newAssessment: "New assessment",
    doneTitle: "Session complete",
    doneBody: (correct, total) =>
      `You answered ${correct} of ${total} correctly. Questions are auto-scheduled for review at the optimal time to lock them into memory.`,
    newSession: "New session",
    myResults: "My results",
    aiPanelTitle: "🤖 Generate extra practice with AI",
    difficultyOpt: (d) => `Difficulty ${d}`,
    generate: "Generate 3 questions",
    generating: "…generating",
    aiNote: "Generated questions are for instant practice and are not saved to your review deck.",
  },
  login: {
    signinTitle: "Sign in",
    signupTitle: "Create account",
    subtitle: "Save your progress and sync it across devices.",
    email: "Email",
    password: "Password",
    genericError: "Something went wrong.",
    signupSuccess:
      "Account created. If email confirmation is required, check your inbox then sign in.",
    signin: "Sign in",
    signup: "Create account",
    busy: "…working",
    toSignup: "No account? Create one",
    toSignin: "Have an account? Sign in",
    notConfiguredTitle: "Accounts not enabled yet",
    notConfiguredBody:
      "The platform currently runs in guest mode (your progress is saved on this browser). To enable accounts and sync, add Supabase keys to .env.local.",
    backHome: "Back to home",
  },
  journey: {
    title: "Your cognitive journey",
    subtitle: "These are your structured steps to improve — follow them in order.",
    streak: (n) => `🔥 ${n}-day streak`,
    noStreak: "Start your daily streak today",
    nextStepBadge: "Your next step",
    assessTitle: "1) Assess your level",
    assessDesc: "Start with a diagnostic that maps your strengths and weaknesses across the five dimensions.",
    assessCta: "Start assessment",
    assessDoneAt: (date) => `Last assessed: ${date}`,
    practiceTitle: "2) Practice daily",
    practiceDesc: "Train your weak spots with spaced repetition — the fastest path to improvement.",
    dueToday: (n) => `You have ${n} question(s) due for review today`,
    noDueToday: "Nothing due right now — you can practice or generate new exercises.",
    practiceCta: "Start today's session",
    cadence: "Recommended rhythm: 10–15 minutes a day, 4–5 days a week. Consistency matters more than session length.",
    progressTitle: "3) Track your progress",
    progressDesc: "See your level in each dimension and how you improve over time.",
    progressCta: "See my results",
    reassessTitle: "4) Re-assess",
    reassessDesc: "Every two weeks, retake the assessment to measure real improvement.",
    reassessIn: (days) => `Available in ${days} day(s)`,
    reassessReady: "Time to re-assess — measure your progress!",
    reassessCta: "Retake assessment",
    done: "Done ✓",
  },
  onboarding: {
    skip: "Skip",
    next: "Next",
    back: "Back",
    start: "Let's start",
    steps: [
      { title: "Welcome 👋", body: "This is an evidence-based platform to develop your cognitive abilities — not a game. The goal is to learn faster and think clearer.", icon: "🎯" },
      { title: "How it works", body: "1) Assess your level. 2) Practice your weak spots daily with spaced repetition. 3) Track your progress. 4) Re-assess every two weeks.", icon: "🔄" },
      { title: "What's expected", body: "10–15 minutes a day, 4–5 days a week. Consistency beats duration — and the app tells you what to do each day.", icon: "⏱️" },
    ],
  },
  nback: {
    title: "Working-memory task (n-back)",
    intro: "A square will light up in the grid, one at a time. Your job is to remember their positions.",
    instruction: (n) =>
      `Press “Match” when the current square is in the same position as the one shown ${n} steps back.`,
    chooseLevel: "Choose a level:",
    level: (n) => `${n}-back`,
    start: "Start",
    getReady: "Get ready…",
    match: "Match",
    matchHint: "Press when it matches (or the Space key)",
    progress: (i, total) => `${i} / ${total}`,
    doneTitle: "Task complete",
    scoreLabel: "Score",
    hitsLabel: "Hits",
    missesLabel: "Misses",
    falseAlarmsLabel: "False alarms",
    interpHigh: "Excellent! Strong working memory at this level — try a harder one.",
    interpMid: "Good — keep practicing regularly to improve.",
    interpLow: "Good start. Try an easier level and focus on tracking positions.",
    playAgain: "Play again",
    toPractice: "Back to practice",
    bestLabel: (n) => `Best (${n}-back)`,
    cardHint: "A timed interactive task to strengthen working memory",
  },
  abstract: {
    title: "Abstract Reasoning",
    cardHint: "Fair visual patterns for everyone — no language or culture, adapts to your level",
    intro: "Procedurally generated visual patterns — no language or prior knowledge, so they suit any age or background. Spot the rule and pick the answer.",
    patternsNote: "3 patterns: complete the sequence, complete the grid, and find the odd one out.",
    instrSequence: "Pick what completes the sequence:",
    instrMatrix: "Pick what completes the grid:",
    instrOddone: "Find the odd one out:",
    start: "Start",
    levelNow: (s) => `Your level now: ${s}`,
    progress: (i, total) => `${i} / ${total}`,
    correct: "✅ Correct",
    incorrect: "❌ Incorrect",
    next: "Next →",
    finish: "Finish",
    doneTitle: "Session complete",
    estimatedLevel: "Your estimated level",
    accuracy: (c, t) => `You answered ${c} of ${t} correctly`,
    again: "Play again",
    toPractice: "Back to practice",
  },
  daily: {
    title: "Daily Challenge",
    cardHint: "Same puzzles for everyone today — fastest and most accurate wins",
    intro: "10 abstract puzzles — the same set for every player today. Solve them as fast and accurately as you can. The clock is running!",
    nameLabel: "Your name on the board",
    namePlaceholder: "Player",
    start: "Start the challenge",
    elapsed: "Time",
    progress: (i, total) => `${i} / ${total}`,
    doneTitle: "You finished today's challenge! 🎉",
    correctLabel: "Correct",
    timeLabel: "Total time",
    scoreLabel: "Points",
    rank: (rank, total) => `Rank ${rank} of ${total}`,
    percentile: (p) => `Better than ${p}% of today's players`,
    leaderboardTitle: "Today's leaders",
    you: "You",
    guestNote: "Sign in to join the leaderboard.",
    emptyBoard: "Be the first on today's board!",
    comeBack: "Come back tomorrow for a new challenge.",
    toJourney: "Back to my journey",
    streakDays: (n) => `🔥 ${n}-day streak`,
    keepStreak: "Don't break the streak — come back every day!",
    badgesTitle: "Your badges",
    newBadge: "New!",
    badgeNames: {
      first: "First challenge",
      perfect: "Perfect score",
      speedy: "Fast & accurate",
      streak3: "3-day streak",
      streak7: "Full week",
      streak30: "Full month",
      podium: "On the podium",
      champion: "Champion of the day",
    },
  },
  bands: {
    advanced: "Advanced",
    veryGood: "Very good",
    average: "Average",
    needsWork: "Needs work",
    beginner: "Beginner",
  },
  skills: {
    abstract: {
      name: "Abstract Reasoning",
      tagline: "Fair visual patterns — no language or culture",
      desc: "The ability to spot abstract patterns and relations in shapes — a fair measure of reasoning that doesn't depend on language, schooling, or culture.",
    },
    logical: {
      name: "Logical Reasoning",
      tagline: "Patterns, inference, and logical deduction",
      desc: "The ability to spot patterns, draw conclusions from premises, and handle conditional relations and sequences.",
    },
    verbal: {
      name: "Verbal Reasoning",
      tagline: "Verbal analogies, vocabulary, and word relations",
      desc: "The ability to understand relations between words and meanings, verbal analogies, and vocabulary nuance.",
    },
    working_memory: {
      name: "Working Memory",
      tagline: "Holding and manipulating information mentally",
      desc: "The ability to hold information in mind and manipulate it on the fly — ordering or reversing sequences, tracking positions.",
    },
    numeracy: {
      name: "Numeracy",
      tagline: "Numbers, ratios, and mathematical reasoning",
      desc: "The ability to work with numbers, ratios, and rates, and to solve quantitative problems and reason mathematically.",
    },
    critical: {
      name: "Critical Thinking",
      tagline: "Spotting fallacies, weighing evidence, probabilistic thinking",
      desc: "The ability to evaluate arguments and evidence, detect logical fallacies, and reason about probability soundly.",
    },
  },
};

const DICTS: Record<Locale, Messages> = { ar, en };

export function getMessages(locale: Locale): Messages {
  return DICTS[locale];
}
