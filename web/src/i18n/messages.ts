import type { Locale } from "./config";
import type { SkillKey } from "@/lib/types";
import { ar as arNum, arCount, enCount } from "./num";

// All user-facing strings. Both dictionaries implement the same interface, so
// the type checker guarantees no key is missing in either language.
export interface Messages {
  /** Renders a number in the locale's own digits. Use for ANY number a
      component interpolates itself, so one card never mixes numeral systems. */
  num: (n: number | string) => string;
  nav: {
    brand: string;
    home: string;
    journey: string;
    diagnostic: string;
    results: string;
    practice: string;
    daily: string;
    abstract: string;
    nback: string;
    login: string;
    logout: string;
    guest: string;
    openMenu: string;
    closeMenu: string;
  };
  lang: { switchTo: string; label: string };
  a11y: {
    optionN: (n: number) => string;
    optionLetter: (letter: string, text: string) => string;
    chooseSkill: string;
    chooseDifficulty: string;
  };
  honesty: {
    notIQ: string;
    transferTitle: string;
    transfer: string;
    fluctuates: string;
    rangeLabel: string;
    whatWePromise: string;
  };
  errors: {
    title: string;
    body: string;
    retry: string;
    home: string;
    notFoundTitle: string;
    notFoundBody: string;
  };
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
    resumeTitle: string;
    resumeBody: (done: number, total: number) => string;
    resume: string;
    restart: string;
    localeLocked: string;
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
    lowConfidence: string;
    lowConfidenceHint: string;
    wmTitle: string;
    wmMeasured: (n: number, score: number) => string;
    wmAt: (date: string) => string;
    wmNotMeasured: string;
    wmCta: string;
    wmWhy: string;
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
    aiFailed: string;
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
    howTitle: string;
    exampleCaption: (n: number) => string;
    levelTag: (n: number) => string;
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
  abstractRules: {
    title: string;
    attrs: Record<"count" | "kind" | "rotation" | "fill" | "size", string>;
    rotate: (deg: number, clockwise: boolean) => string;
    cycle: (attr: string, values: string) => string;
    alternate: (attr: string, values: string) => string;
    odd: (attr: string) => string;
    inRows: string;
    inCols: string;
    inDiag: string;
    /** Direction-of-progress marker; flips with the reading direction. */
    arrow: string;
    metaTip: string;
  };
  abstractA11y: {
    kinds: Record<"circle" | "square" | "triangle" | "diamond" | "arrow", string>;
    fills: Record<"solid" | "outline", string>;
    sizes: Record<1 | 2 | 3, string>;
    cell: (count: number, kind: string, fill: string, size: string, rot: number) => string;
    emptyCell: string;
    promptTitle: string;
    promptStep: (i: number, desc: string) => string;
    matrixCellAt: (row: number, col: number, desc: string) => string;
    optionsTitle: string;
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
    viewResult: string;
    elapsed: string;
    progress: (i: number, total: number) => string;
    doneTitle: string;
    correctLabel: string;
    timeLabel: string;
    scoreLabel: string;
    rank: (rank: number, total: number) => string;
    percentile: (p: number) => string;
    leaderboardTitle: string;
    boardNote: string;
    you: string;
    guestNote: string;
    emptyBoard: string;
    comeBack: string;
    toJourney: string;
    streakDays: (n: number) => string;
    keepStreak: string;
    badgesTitle: string;
    share: string;
    shareCopied: string;
    shareShared: string;
    shareFailed: string;
    shareHint: string;
    rulesTitle: string;
    rulesHint: string;
    itemN: (n: number) => string;
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
  num: (n) => arNum(n),
  nav: {
    brand: "منصّة القدرات المعرفية",
    home: "الرئيسية",
    journey: "رحلتي",
    diagnostic: "التقييم",
    results: "النتائج",
    practice: "التدريب",
    daily: "التحدّي اليومي",
    abstract: "الاستدلال المجرّد",
    nback: "الذاكرة العاملة",
    login: "دخول",
    logout: "خروج",
    guest: "وضع ضيف",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
  },
  lang: { switchTo: "English", label: "اللغة" },
  a11y: {
    optionN: (n) => `الاختيار رقم ${n}`,
    optionLetter: (letter, text) => `الاختيار ${letter}: ${text}`,
    chooseSkill: "اختر المحور",
    chooseDifficulty: "اختر مستوى الصعوبة",
  },
  honesty: {
    notIQ:
      "ده تقييم تشخيصي لمهارات معرفية، مش اختبار ذكاء (IQ) معياري، والدرجة مش رقم ثابت لقدرتك.",
    transferTitle: "بنوعد بإيه، وبإيه لأ",
    transfer:
      "التحسّن في تمرين معيّن مبينتقلش تلقائياً لذكاء عام أو لأداء أحسن في الشغل والدراسة — الأدلّة على انتقال الأثر لسه محدودة. اللي نقدر نوعدك بيه: إتقان أعلى في نوع المهمة اللي بتتمرّن عليها، وانتباه أوضح لطريقة تفكيرك، وعادة مراجعة منتظمة.",
    fluctuates:
      "النتيجة بتتذبذب من جلسة للتانية بسبب النوم والتركيز والحظ في اختيار الأسئلة. استنى أسبوعين على الأقل قبل ما تقارن.",
    rangeLabel: "النطاق المرجّح",
    whatWePromise: "اعرف أكتر عن حدود القياس",
  },
  errors: {
    title: "حصل خطأ غير متوقّع",
    body: "معلش، حاجة وقعت عندنا. جرّب تاني، ولو الموضوع اتكرر ارجع للصفحة الرئيسية.",
    retry: "حاول تاني",
    home: "الصفحة الرئيسية",
    notFoundTitle: "الصفحة دي مش موجودة",
    notFoundBody: "الرابط اللي فتحته اتغيّر أو مش صح.",
  },
  home: {
    heroBadge: "قائم على الأدلّة العلمية — تدريب، مش تسلية",
    heroTitle1: "طوّر قدراتك المعرفية",
    heroTitle2: "بطريقة علمية ممنهجة",
    heroSubtitle:
      "منصّة تبدأ بتقييم تشخيصي يعطيك تقديراً مبدئياً لمهاراتك المعرفية، ثم ترسم لك مسار تدريب مخصّصاً مبنياً على تقنيات تعلّم مدروسة جيداً — الاسترجاع النشط والتكرار المتباعد.",
    ctaStart: "ابدأ رحلتك المجانية",
    ctaPractice: "جرّب التدريب",
    howTitle: "كيف تعمل المنصّة",
    stepLabel: (n) => `الخطوة ${arNum(n)}`,
    steps: [
      { title: "تقييم تشخيصي", body: "أسئلة تكيّفية تعطيك تقديراً مبدئياً لكل محور — نعرضه كنطاق، مش كرقم قاطع.", icon: "🧭" },
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
    ctaSubtitle: "التقييم يستغرق دقائق، ويمنحك نقطة بداية واضحة تعرف منها تتدرّب على إيه.",
    ctaNow: "ابدأ الآن",
    footer: "منصّة تنمية القدرات المعرفية — نسخة أولية (MVP)",
  },
  diagnostic: {
    title: "التقييم التشخيصي",
    intro: (count) =>
      `${arNum(count)} سؤالاً تكيّفياً في خمسة محاور معرفية. تزداد صعوبة الأسئلة مع إجاباتك الصحيحة لنقترب من مستواك بأقلّ عدد ممكن من الأسئلة. بضع دقائق، والنتيجة تقدير مبدئي يُعرَض كنطاق.`,
    notIQ: "ملاحظة: هذا تقييم تشخيصي للمهارات المعرفية، وليس اختبار ذكاء (IQ) معياري.",
    start: "ابدأ التقييم",
    saving: "جارٍ حساب نتائجك…",
    goResults: "اذهب للنتائج",
    resumeTitle: "عندك تقييم لسه مخلّصتوش",
    resumeBody: (done, total) =>
      `وصلت للسؤال ${arNum(done)} من ${arNum(total)}. تحب تكمّل من مكانك ولا تبدأ من الأول؟`,
    resume: "كمّل من مكاني",
    restart: "ابدأ من الأول",
    localeLocked:
      "التقييم بيفضل بلغة بدايته عشان النتيجة تفضل قابلة للمقارنة.",
  },
  question: {
    progress: (i, n, d) => `سؤال ${arNum(i)} / ${arNum(n)} · صعوبة ${arNum(d)}/٥`,
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
    outOf100: `/${arNum(100)}`,
    correctOfTotal: (correct, total) =>
      `أجبت صح على ${arNum(correct)} من ${arCount(total, {
        zero: "لا أسئلة",
        one: "سؤال واحد",
        two: "سؤالين",
        few: "{n} أسئلة",
        many: "{n} سؤالاً",
      })} في هذا المحور.`,
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
    lowConfidence: "بيانات غير كافية",
    wmTitle: "الذاكرة العاملة",
    wmMeasured: (n, score) => `مستوى ${arNum(n)}-back · دقّة ${arNum(score)}٪`,
    wmAt: (date) => `آخر قياس: ${date}`,
    wmNotMeasured: "لسه ما اتقاستش",
    wmCta: "قِسها بتمرين n-back",
    wmWhy:
      "الذاكرة العاملة ما ينفعش تتقاس بسؤال اختيار من متعدّد — النص بيفضل قدّامك وأنت بتجاوب، فتبقى قراءة مش حفظ. عشان كده بنقيسها بتمرين n-back المؤقّت وحده.",
    lowConfidenceHint:
      "عدد الأسئلة في هذا المحور قليل، فلا نعرض درجة قد تكون مضلّلة. زد تدريبك عليه أو أعد التقييم لاحقاً.",
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
      `أجبت صح على ${arNum(correct)} من ${arNum(total)}. سيتم جدولة الأسئلة تلقائياً لمراجعتها في الوقت الأمثل لتثبيتها في ذاكرتك.`,
    newSession: "جلسة جديدة",
    myResults: "نتائجي",
    aiPanelTitle: "🤖 ولّد تمارين إضافية بالذكاء الاصطناعي",
    difficultyOpt: (d) => `صعوبة ${arNum(d)}`,
    generate: "ولّد ٣ أسئلة",
    generating: "…جارٍ التوليد",
    aiNote: "الأسئلة المولّدة للتدريب الفوري ولا تُحفظ في بنك المراجعة.",
    aiFailed:
      "تعذّر الاتصال بمولّد الأسئلة. جرّب تاني بعد شوية — تدريبك المحفوظ مش متأثر.",
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
    streak: (n) =>
      `🔥 ${arCount(n, {
        zero: "لا أيام متتالية",
        one: "يوم واحد متّصل",
        two: "يومان متّصلان",
        few: "{n} أيام متّصلة",
        many: "{n} يوماً متّصلاً",
      })}`,
    noStreak: "ابدأ سلسلتك اليومية النهاردة",
    nextStepBadge: "خطوتك التالية",
    assessTitle: "١) قيّم مستواك",
    assessDesc: "ابدأ بتقييم تشخيصي يحدّد نقاط قوّتك وضعفك في الخمس محاور.",
    assessCta: "ابدأ التقييم",
    assessDoneAt: (date) => `تمّ آخر تقييم: ${date}`,
    practiceTitle: "٢) درّب يومياً",
    practiceDesc: "اتدرّب على نقاط ضعفك بالتكرار المتباعد — أقصر طريق للتحسّن.",
    dueToday: (n) =>
      `عندك ${arCount(n, {
        zero: "لا أسئلة مستحقّة",
        one: "سؤال واحد مستحقّ",
        two: "سؤالان مستحقّان",
        few: "{n} أسئلة مستحقّة",
        many: "{n} سؤالاً مستحقّاً",
      })} للمراجعة النهاردة`,
    noDueToday: "لا مراجعات مستحقّة الآن — تقدر تتدرّب أو تولّد تمارين جديدة.",
    practiceCta: "ابدأ جلسة النهاردة",
    cadence: "الإيقاع الموصى به: ١٠–١٥ دقيقة يومياً، ٤–٥ أيام أسبوعياً. الاستمرارية أهم من طول الجلسة.",
    progressTitle: "٣) تابع تقدّمك",
    progressDesc: "شوف مستواك في كل محور وتطوّرك عبر الوقت.",
    progressCta: "شوف نتائجي",
    reassessTitle: "٤) أعد التقييم",
    reassessDesc: "كل أسبوعين، أعد التقييم عشان تقيس تحسّنك فعلياً.",
    reassessIn: (days) =>
      `متاح بعد ${arCount(days, {
        zero: "اليوم",
        one: "يوم واحد",
        two: "يومين",
        few: "{n} أيام",
        many: "{n} يوماً",
      })}`,
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
    intro: "بيضيء مربّع في شبكة ٣×٣، واحد ورا التاني. مهمتك تتابع أماكنهم في دماغك.",
    instruction: (n) =>
      n === 1
        ? "اضغط «تطابق» لما المربّع الحالي يضيء في نفس مكان اللي قبله مباشرةً."
        : `اضغط «تطابق» لما المربّع الحالي يضيء في نفس مكان اللي ظهر قبله بـ ${n} مربّعات.`,
    howTitle: "إزاي تلعب؟",
    exampleCaption: (n) =>
      n === 1
        ? "المربّع الأخير في نفس مكان اللي قبله مباشرةً → اضغط «تطابق»!"
        : `المربّع الأخير في نفس مكان اللي قبله بـ ${n} → اضغط «تطابق»!`,
    levelTag: (n) => (n === 1 ? "سهل" : n === 2 ? "متوسط" : "صعب"),
    chooseLevel: "اختر المستوى:",
    level: (n) => `${arNum(n)}-back`,
    start: "ابدأ",
    getReady: "استعد…",
    match: "تطابق",
    matchHint: "اضغط عند التطابق (أو مفتاح المسافة)",
    progress: (i, total) => `${arNum(i)} / ${arNum(total)}`,
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
    bestLabel: (n) => `أفضل نتيجة (${arNum(n)}-back)`,
    cardHint: "تمرين تفاعلي بمؤقّت لتقوية الذاكرة العاملة",
  },
  abstractRules: {
    title: "القاعدة",
    attrs: {
      count: "العدد",
      kind: "نوع الشكل",
      rotation: "اتجاه الشكل",
      fill: "الملء",
      size: "الحجم",
    },
    rotate: (deg, clockwise) =>
      `الشكل يلفّ ${arNum(deg)}° ${clockwise ? "مع عقارب الساعة" : "عكس عقارب الساعة"} في كل خطوة.`,
    cycle: (attr, values) => `${attr} يدور بالترتيب: ${values} ثم يعيد من أوّله.`,
    alternate: (attr, values) => `${attr} يتبدّل بين ${values}.`,
    odd: (attr) => `ثلاثة أشكال متطابقة وواحد يختلف عنهم في ${attr}.`,
    arrow: "←",
    inRows: "(القاعدة تمشي على الصفوف)",
    inCols: "(القاعدة تمشي على الأعمدة)",
    inDiag: "(القاعدة تمشي على القُطر)",
    metaTip:
      "نصيحة للمرّة الجاية: ابدأ بأوضح سمة تتغيّر (العدد أو الحجم)، سَمِّ القاعدة بصوت عالٍ، وبعدين اتأكّد إن باقي السمات ثابتة.",
  },
  abstractA11y: {
    kinds: {
      circle: "دائرة",
      square: "مربّع",
      triangle: "مثلّث",
      diamond: "مُعيّن",
      arrow: "سهم",
    },
    fills: { solid: "مصمت", outline: "مفرّغ" },
    sizes: { 1: "صغير", 2: "متوسط", 3: "كبير" },
    cell: (count, kind, fill, size, rot) =>
      `عدد ${arNum(count)} — ${kind}، ${fill}، ${size}، دوران ${arNum(rot)} درجة`,
    emptyCell: "خانة فارغة — هي المطلوبة",
    promptTitle: "وصف نصّي للنمط",
    promptStep: (i, desc) => `الخطوة ${arNum(i)}: ${desc}`,
    matrixCellAt: (row, col, desc) => `الصف ${arNum(row)} العمود ${arNum(col)}: ${desc}`,
    optionsTitle: "الاختيارات",
  },
  abstract: {
    title: "الاستدلال المجرّد",
    cardHint: "أنماط بصرية عادلة للجميع — بلا لغة ولا ثقافة، وتتكيّف مع مستواك",
    intro: "أنماط بصرية مولّدة تلقائياً — بلا لغة ولا معلومات مسبقة، فهي أعدل من الأسئلة اللفظية لمن اختلفت لغتهم أو تعليمهم. (الألفة بالاختبارات نفسها ما زالت تؤثّر، فلا يوجد اختبار محايد تماماً.) اكتشف القاعدة واختر الإجابة.",
    patternsNote: "٣ أنماط: إكمال التسلسل، إكمال الشبكة، واكتشاف الشاذ.",
    instrSequence: "اختر ما يُكمل التسلسل:",
    instrMatrix: "اختر ما يُكمل الشبكة:",
    instrOddone: "اكتشف الشكل الشاذ:",
    start: "ابدأ",
    levelNow: (s) => `مستواك الآن: ${arNum(s)}`,
    progress: (i, total) => `${arNum(i)} / ${arNum(total)}`,
    correct: "✅ إجابة صحيحة",
    incorrect: "❌ إجابة غير صحيحة",
    next: "التالي ←",
    finish: "إنهاء",
    doneTitle: "انتهت الجلسة",
    estimatedLevel: "مستواك المُقدَّر",
    accuracy: (c, t) => `أجبت صح على ${arNum(c)} من ${arNum(t)}`,
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
    viewResult: "شوف نتيجتك",
    elapsed: "الوقت",
    progress: (i, total) => `${arNum(i)} / ${arNum(total)}`,
    doneTitle: "خلّصت تحدّي النهاردة! 🎉",
    correctLabel: "إجابات صحيحة",
    timeLabel: "الوقت الكلّي",
    scoreLabel: "النقاط",
    rank: (rank, total) => `ترتيبك ${arNum(rank)} من ${arNum(total)}`,
    percentile: (p) => `أفضل من ${arNum(p)}٪ من لاعبي اليوم`,
    leaderboardTitle: "متصدّرو اليوم",
    boardNote:
      "اللوحة والسلسلة والشارات موجودة عشان تساعدك تحافظ على عادة يومية — مش مقياس لقدرتك. اللي يهمّ فعلاً تقدّمك أنت مع نفسك، وإنك تفهم قاعدة كل أحجية.",
    you: "أنت",
    guestNote: "سجّل دخول عشان تدخل لوحة المتصدّرين.",
    emptyBoard: "كن أول المتصدّرين اليوم!",
    comeBack: "ارجع بكرة لتحدّي جديد.",
    toJourney: "رجوع لرحلتي",
    streakDays: (n) =>
      `🔥 ${arCount(n, {
        zero: "لا أيام متتالية",
        one: "يوم واحد متّصل",
        two: "يومان متّصلان",
        few: "{n} أيام متّصلة",
        many: "{n} يوماً متّصلاً",
      })}`,
    keepStreak: "لا تكسر السلسلة — ارجع كل يوم!",
    badgesTitle: "شاراتك",
    share: "شارك نتيجتك",
    shareCopied: "اتنسخت! الصقها في أي مكان",
    shareShared: "تمّت المشاركة",
    shareFailed: "مقدرناش ننسخ — اعمل نسخ يدوي",
    shareHint: "المربّعات بتوضّح أي سؤال ظبطته من غير ما تحرق الإجابات لحد.",
    rulesTitle: "قواعد أحاجي اليوم",
    rulesHint:
      "راجعها دلوقتي وأنت فاكر الأشكال — ده اللي بيحوّل التحدّي من قياس إلى تعلّم.",
    itemN: (n) => `السؤال ${arNum(n)}`,
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
      tagline: "تُقاس بتمرين n-back المؤقّت",
      desc: "القدرة على الاحتفاظ بالمعلومات في الذهن ومعالجتها آنياً. تُقاس عندنا بتمرين n-back التفاعلي وحده — لأن سؤال اختيار من متعدّد يترك النص أمامك وأنت تجاوب، فيقيس القراءة لا الحفظ.",
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
  num: (n) => String(n),
  nav: {
    brand: "Cognitive Skills Platform",
    home: "Home",
    journey: "My Journey",
    diagnostic: "Assessment",
    results: "Results",
    practice: "Practice",
    daily: "Daily Challenge",
    abstract: "Abstract Reasoning",
    nback: "Working Memory",
    login: "Sign in",
    logout: "Sign out",
    guest: "Guest mode",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  lang: { switchTo: "العربية", label: "Language" },
  a11y: {
    optionN: (n) => `Option ${n}`,
    optionLetter: (letter, text) => `Option ${letter}: ${text}`,
    chooseSkill: "Choose a dimension",
    chooseDifficulty: "Choose a difficulty level",
  },
  honesty: {
    notIQ:
      "This is a diagnostic of cognitive skills, not a standardized IQ test — and the score is not a fixed number for your ability.",
    transferTitle: "What we promise, and what we don't",
    transfer:
      "Getting better at a specific exercise does not automatically transfer to general intelligence or to better performance at work or school — the evidence for far transfer is still thin. What we can promise: more skill at the kind of task you practise, a clearer view of how you think, and a steady review habit.",
    fluctuates:
      "Scores move between sessions with sleep, focus and which items you happened to get. Wait at least two weeks before comparing.",
    rangeLabel: "Likely range",
    whatWePromise: "More on the limits of this measure",
  },
  errors: {
    title: "Something went wrong",
    body: "Sorry — that broke on our side. Try again, and if it keeps happening head back to the home page.",
    retry: "Try again",
    home: "Home page",
    notFoundTitle: "This page doesn't exist",
    notFoundBody: "The link you opened has moved or isn't valid.",
  },
  home: {
    heroBadge: "Evidence-based — training, not entertainment",
    heroTitle1: "Develop your cognitive abilities",
    heroTitle2: "the scientific, methodical way",
    heroSubtitle:
      "A platform that starts with a diagnostic estimate of your cognitive skills, then builds you a personalized training path grounded in well-studied learning techniques — active recall and spaced repetition.",
    ctaStart: "Start your free journey",
    ctaPractice: "Try practice",
    howTitle: "How it works",
    stepLabel: (n) => `Step ${n}`,
    steps: [
      { title: "Diagnostic assessment", body: "Adaptive questions give a first estimate per dimension — shown as a range, not a verdict.", icon: "🧭" },
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
    ctaSubtitle: "The assessment takes minutes and gives you a starting map of your skills and where to train.",
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
    resumeTitle: "You have an unfinished assessment",
    resumeBody: (done, total) =>
      `You reached question ${done} of ${total}. Continue where you left off, or start over?`,
    resume: "Continue",
    restart: "Start over",
    localeLocked:
      "An assessment stays in the language it started in, so the score remains comparable.",
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
    lowConfidence: "Not enough data",
    wmTitle: "Working memory",
    wmMeasured: (n, score) => `${n}-back · ${score}% accuracy`,
    wmAt: (date) => `Last measured: ${date}`,
    wmNotMeasured: "Not measured yet",
    wmCta: "Measure it with the n-back task",
    wmWhy:
      "Working memory can't be measured by a multiple-choice item — the text stays on screen while you answer, so it tests reading, not holding. We measure it with the timed n-back task instead.",
    lowConfidenceHint:
      "Too few questions in this dimension to report a score that wouldn't mislead. Practise it or re-assess later.",
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
    aiFailed:
      "Couldn't reach the question generator. Try again shortly — your saved practice is unaffected.",
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
    dueToday: (n) =>
      `You have ${enCount(n, "{n} question", "{n} questions")} due for review today`,
    noDueToday: "Nothing due right now — you can practice or generate new exercises.",
    practiceCta: "Start today's session",
    cadence: "Recommended rhythm: 10–15 minutes a day, 4–5 days a week. Consistency matters more than session length.",
    progressTitle: "3) Track your progress",
    progressDesc: "See your level in each dimension and how you improve over time.",
    progressCta: "See my results",
    reassessTitle: "4) Re-assess",
    reassessDesc: "Every two weeks, retake the assessment to measure real improvement.",
    reassessIn: (days) =>
      `Available in ${enCount(days, "{n} day", "{n} days")}`,
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
    intro: "A square lights up in a 3×3 grid, one at a time. Your job is to track their positions in your head.",
    instruction: (n) =>
      n === 1
        ? "Press “Match” when the current square is in the same position as the one right before it."
        : `Press “Match” when the current square is in the same position as the one shown ${n} squares back.`,
    howTitle: "How to play",
    exampleCaption: (n) =>
      n === 1
        ? "The last square is in the same position as the one right before it → press “Match”!"
        : `The last square is in the same position as the one ${n} back → press “Match”!`,
    levelTag: (n) => (n === 1 ? "Easy" : n === 2 ? "Medium" : "Hard"),
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
  abstractRules: {
    title: "The rule",
    attrs: {
      count: "the count",
      kind: "the shape",
      rotation: "the direction",
      fill: "the fill",
      size: "the size",
    },
    rotate: (deg, clockwise) =>
      `The shape turns ${deg}° ${clockwise ? "clockwise" : "counter-clockwise"} at each step.`,
    cycle: (attr, values) => `${attr} cycles through ${values}, then repeats.`,
    alternate: (attr, values) => `${attr} alternates between ${values}.`,
    odd: (attr) => `Three shapes match and one differs in ${attr}.`,
    arrow: "→",
    inRows: "(the rule runs along the rows)",
    inCols: "(the rule runs along the columns)",
    inDiag: "(the rule runs along the diagonal)",
    metaTip:
      "For next time: start with the most obvious changing feature (count or size), say the rule out loud, then check the other features are holding still.",
  },
  abstractA11y: {
    kinds: {
      circle: "circle",
      square: "square",
      triangle: "triangle",
      diamond: "diamond",
      arrow: "arrow",
    },
    fills: { solid: "solid", outline: "outline" },
    sizes: { 1: "small", 2: "medium", 3: "large" },
    cell: (count, kind, fill, size, rot) =>
      `${count} × ${kind} — ${fill}, ${size}, rotated ${rot} degrees`,
    emptyCell: "empty cell — this is the missing one",
    promptTitle: "Text description of the pattern",
    promptStep: (i, desc) => `Step ${i}: ${desc}`,
    matrixCellAt: (row, col, desc) => `Row ${row}, column ${col}: ${desc}`,
    optionsTitle: "Options",
  },
  abstract: {
    title: "Abstract Reasoning",
    cardHint: "Fair visual patterns for everyone — no language or culture, adapts to your level",
    intro: "Procedurally generated visual patterns — no language or prior knowledge, so they are fairer than verbal items across languages and schooling. (Familiarity with tests still helps, so no measure is truly neutral.) Spot the rule and pick the answer.",
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
    viewResult: "See your result",
    elapsed: "Time",
    progress: (i, total) => `${i} / ${total}`,
    doneTitle: "You finished today's challenge! 🎉",
    correctLabel: "Correct",
    timeLabel: "Total time",
    scoreLabel: "Points",
    rank: (rank, total) => `Rank ${rank} of ${total}`,
    percentile: (p) => `Better than ${p}% of today's players`,
    leaderboardTitle: "Today's leaders",
    boardNote:
      "The board, the streak and the badges exist to help you keep a daily habit — they are not a measure of your ability. What matters is your own progress and understanding the rule behind each puzzle.",
    you: "You",
    guestNote: "Sign in to join the leaderboard.",
    emptyBoard: "Be the first on today's board!",
    comeBack: "Come back tomorrow for a new challenge.",
    toJourney: "Back to my journey",
    streakDays: (n) => `🔥 ${n}-day streak`,
    keepStreak: "Don't break the streak — come back every day!",
    badgesTitle: "Your badges",
    share: "Share your result",
    shareCopied: "Copied — paste it anywhere",
    shareShared: "Shared",
    shareFailed: "Couldn't copy — select and copy manually",
    shareHint: "The squares show which items you got, without spoiling any answers.",
    rulesTitle: "Today's rules",
    rulesHint:
      "Read them while the shapes are still fresh — this is what turns the challenge from a measurement into practice.",
    itemN: (n) => `Item ${n}`,
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
      tagline: "Measured by the timed n-back task",
      desc: "Holding information in mind and manipulating it on the fly. We measure it with the interactive n-back task only — a multiple-choice item leaves the text on screen while you answer, so it measures reading, not holding.",
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
