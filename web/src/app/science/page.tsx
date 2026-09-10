"use client";

import type { Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import { ButtonLink, Card } from "@/components/ui";

// ---------------------------------------------------------------------------
// The credibility page. Content lives here, locally, on purpose: it is long-form
// prose that belongs to exactly one route, and keeping it out of the shared
// dictionary keeps `i18n/messages.ts` reviewable.
//
// Everything below describes what the code in this repo actually does
// (src/lib/diagnostic.ts, src/lib/fsrs.ts, src/lib/abstract/generate.ts,
// src/app/diagnostic/page.tsx, src/app/nback/page.tsx). If the code changes,
// this page is wrong until it is changed too.
// ---------------------------------------------------------------------------

interface Entry {
  title: string;
  text: string;
}

interface Reference {
  cite: string;
  note: string;
}

interface Copy {
  title: string;
  intro: string;
  measure: {
    heading: string;
    lead: string;
    dimsTitle: string;
    dims: Entry[];
    engineTitle: string;
    engine: Entry[];
  };
  principles: { heading: string; lead: string; items: Entry[] };
  fairness: {
    heading: string;
    lead: string;
    items: Entry[];
    caveatTitle: string;
    caveat: string;
  };
  limits: { heading: string; lead: string; items: Entry[] };
  habits: {
    heading: string;
    lead: string;
    ordinals: string[];
    items: Entry[];
  };
  refs: { heading: string; lead: string; items: Reference[] };
  footer: { lead: string; privacy: string; terms: string; journey: string };
}

const AR: Copy = {
  title: "العلم وراء المنصّة",
  intro:
    "هذه الصفحة تشرح كيف تعمل المنصّة من الداخل: ما الذي نقيسه، وبأي آلية بالضبط، وما الذي لا نستطيع أن نَعِدك به. هي مكتوبة لقارئ متشكّك، لا لبيع شيء. إن بدا لك أي قسم فيها مبالغاً في التواضع، فهذا مقصود: المبالغة في الادّعاء هي الخطأ الوحيد الذي لا يمكن إصلاحه لاحقاً.",

  measure: {
    heading: "ما الذي نقيسه، وكيف",
    lead: "التقييم التشخيصي يتكوّن من عشرين سؤالاً موزّعة على خمسة أبعاد، مع بُعد سادس — الذاكرة العاملة — يُقاس بتمرين تفاعلي منفصل لأن سؤال اختيار من متعدّد لا يصلح لقياسه.",
    dimsTitle: "الأبعاد الستة",
    dims: [
      {
        title: "الاستدلال المجرّد — ٨ أسئلة من ٢٠",
        text: "أنماط بصرية مولَّدة آلياً: مصفوفة ٣×٣ تنقصها الخانة الأخيرة، أو متتالية من أربع خانات تُكمل خامستها، أو «الشاذّ من بين أربعة». هذا هو البُعد الأكبر وزناً لأنه أقلّها اعتماداً على اللغة والتعليم.",
      },
      {
        title: "الاستدلال المنطقي — ٤ أسئلة من ٢٠",
        text: "استنتاج نتيجة من مقدّمات، وعلاقات شرطية، ومتتاليات وقياس منطقي.",
      },
      {
        title: "التفكير الكمّي — ٤ أسئلة من ٢٠",
        text: "أعداد ونِسب ومعدّلات ومسائل كمّية تُحلّ بحساب بسيط لا بمنهج دراسي بعينه.",
      },
      {
        title: "الاستدلال اللفظي — سؤالان فقط من ٢٠",
        text: "تناظر لفظي وعلاقات بين الكلمات. عددها قليل عن قصد؛ التفسير في قسم الإنصاف أدناه.",
      },
      {
        title: "التفكير النقدي — سؤالان فقط من ٢٠",
        text: "تقييم حُجّة، وكشف مغالطة، وتفكير احتمالي. مقلَّل الوزن للسبب نفسه.",
      },
      {
        title: "الذاكرة العاملة — خارج الاختبار الكتابي تماماً",
        text: "تُقاس بتمرين n-back وحده. سؤال اختيار من متعدّد يترك النصّ أمام عينيك وأنت تجيب، فيقيس القراءة لا الاحتفاظ بالمعلومة في الذهن.",
      },
    ],
    engineTitle: "المحرّك التكيّفي، خطوة بخطوة",
    engine: [
      {
        title: "من أين يبدأ التقدير",
        text: "كل بُعد يبدأ من منتصف مقياسه: ٣ على مقياس ١..٥ في الأبعاد النصّية، و٥ على مقياس ١..١٠ في البُعد المجرّد — وهو مقياس أوسع لأنه يمتدّ من مستوى طفل إلى مستوى خبير.",
      },
      {
        title: "كيف يتحرّك بعد كل إجابة",
        text: "قبل أن تجيب، نحسب احتمال أن تكون إجابتك صحيحة بدالّة لوجستية في الفرق بين تقديرك الحالي وصعوبة السؤال. ثم يتحرّك التقدير بمقدار يتناسب مع مقدار المفاجأة: إجابة صحيحة عن سؤال كنّا نرجّح أن تخطئ فيه تحرّك التقدير كثيراً، وإجابة صحيحة عن سؤال سهل تحرّكه بالكاد. هذه العائلة من التحديثات معروفة باسم Elo، وهي تقريب مبسَّط لنظرية الاستجابة للمفردة (IRT).",
      },
      {
        title: "معايرة سريعة في البُعد المجرّد",
        text: "لأن مداه أوسع، تكون خطوة التحديث في أول ثلاثة أسئلة مجرّدة أكبر من الضِّعف (١٫٦ مقابل ٠٫٧)، فيقفز التقدير إلى المنطقة الصحيحة خلال أسئلة قليلة، ثم تهدأ الخطوة ليدقّق داخلها بدل أن يتأرجح.",
      },
      {
        title: "أي سؤال يأتي بعد ذلك",
        text: "السؤال الذي تقترب صعوبته أكثر من غيره من تقديرك الحالي، لأنه أكثر الأسئلة إفادة: سؤال تعرف إجابته يقيناً وسؤال يستحيل عليك كلاهما لا يضيف معلومة. ونُفضّل ما لم ترَه في تقييماتك الأخيرة، حتى يقيس الاختبار المُعاد قدرتك لا ذاكرتك عن الأسئلة نفسها.",
      },
      {
        title: "لماذا يظهر أحياناً «لا توجد بيانات كافية» بدل الدرجة",
        text: "التقدير لا يتحرّك أكثر من خطوة واحدة في السؤال الواحد. فبُعدٌ لم يُسأل فيه إلا سؤالان يظلّ محبوساً رياضياً قرب المنتصف: لا يمكن أن يخرج عن النطاق ٣٧–٦٣ من ١٠٠ مهما كان أداؤك فيهما، أي إنه عاجز بنيوياً عن أن يقول «متقدّم» أو «مبتدئ». عرضُ رقم في هذه الحالة تضليل، فنعرض شَرطة، ولا نسمح لهذا البُعد بأن يقرّر «أضعف مهاراتك». عند أربعة أسئلة يتّسع النطاق الممكن إلى ١٨–٨٢ تقريباً، وهذا صالح للعرض — ولذلك حدّنا الأدنى أربعة أسئلة.",
      },
      {
        title: "لماذا نعرض نطاقاً لا رقماً واحداً",
        text: "الرقم الواحد يُغري بقراءته كأنه معامل ذكاء. عدم اليقين المتبقّي في محدِّث من نوع Elo يقارب k مقسوماً على الجذر التربيعي لعدد الأسئلة، ولا ينزل تحت نصف خطوة لأن المحدِّث نفسه لا يميّز أدقّ من ذلك؛ ثم نوسّع الناتج نحو مرّة ونصف حتى نصل إلى نطاق نستطيع الدفاع عنه. الدرجة الحقيقية — إن وُجد شيء كهذا — تقع في مكان ما داخل النطاق، لا عند طرفه الأعلى.",
      },
      {
        title: "الذاكرة العاملة: تمرين n-back",
        text: "٢٠ محاولة على شبكة ٣×٣؛ يضيء مربّع لمدّة ٧٠٠ جزء من الألف من الثانية كل ٢٫٥ ثانية، وعليك أن تضغط حين يطابق موضعُه الموضعَ الذي ظهر قبل n خطوة. عدد الأهداف في كل جولة ثابت بالضبط (٣٢٪ من المحاولات، أي ٦ من ٢٠) ولا يُترك لعملة تُلقى في كل محاولة، حتى تكون الجولات قابلة للمقارنة، ولئلا تحصل جولة لعبتها بإتقان على صفر لمجرّد أنها لم تحتوِ أهدافاً أصلاً. الدرجة = نسبة الإصابة ناقص نسبة الإنذار الكاذب، فالضغط على كل شيء يعطي صفراً لا مئة.",
      },
      {
        title: "الأخطاء تتحوّل إلى بطاقات مراجعة",
        text: "كل سؤال نصّي تخطئ فيه يصير بطاقة يجدولها خوارزم FSRS (عبر حزمة ts-fsrs مفتوحة المصدر) بمعاملاته الافتراضية. الإجابة الخاطئة تُقيَّم Again فتعود البطاقة سريعاً، والصحيحة تُقيَّم Good فيتّسع الفاصل الزمني. الأسئلة المجرّدة لا تُجدوَل لأنها مولَّدة آلياً ولا تتكرّر أصلاً؛ تمرينها في جلسة «الأنماط المجرّدة» المفتوحة.",
      },
    ],
  },

  principles: {
    heading: "المبادئ التي نبني عليها",
    lead: "أربعة مبادئ لها سند تجريبي معقول. المهمّ ليس ذكرها، بل ما الذي تفعله المنصّة بسببها.",
    items: [
      {
        title: "الاستحضار النشط (أثر الاختبار)",
        text: "استحضار المعلومة من الذاكرة يثبّتها أكثر من إعادة قراءتها. لذلك لا تعرض المنصّة سؤالاً وإجابته معاً لتدرسهما: تجيب أولاً دائماً، ثم ترى التفسير. وكل مراجعة هي سؤال جديد لا استعراضاً لما سبق.",
      },
      {
        title: "التباعد الزمني",
        text: "توزيع المراجعات على أيام متباعدة يعطي بقاءً أطول من حشرها في جلسة واحدة، بالجهد نفسه. لذلك تُجدوِل المنصّة كل خطأ ببطاقة FSRS تعود إليك قرب اللحظة التي كنت ستنسى فيها، لا حين تصادف أن تفتح التطبيق.",
      },
      {
        title: "التدريب المتعمَّد",
        text: "التكرار وحده لا يطوّر شيئاً؛ ما يطوّر هو العمل عند حافة القدرة مع تغذية راجعة فورية ومحدّدة. لذلك يبقى المحرّك يقدّم أسئلة عند مستوى تقديرك مباشرة — وهي أيضاً الأسئلة الأكثر إفادة إحصائياً — ولذلك نسمّي القاعدة بعد كل سؤال مجرّد بدل الاكتفاء بعلامة صحّ أو خطأ.",
      },
      {
        title: "ما وراء المعرفة",
        text: "معرفتك بحدود معرفتك مهارة قابلة للتحسّن، وهي أنفع ما يمكن أن يخرج به مستخدم من منصّة كهذه. لذلك نسمّي القاعدة الحاكمة لكل سؤال مجرّد بعد إجابتك، ونعرض الدرجة كنطاق لا كرقم، ونقول صراحةً حين لا نعرف بدل أن نخمّن رقماً.",
      },
    ],
  },

  fairness: {
    heading: "لماذا صُمِّمت الأسئلة من أجل الإنصاف",
    lead: "«عادل» هنا تعني شيئاً محدّداً: ألّا تعتمد الإجابة الصحيحة على لغتك الأولى، ولا على منهجك الدراسي، ولا على بلدك، ولا على قدرتك على تمييز الألوان. هذه قرارات مأخوذة في الكود، لا نوايا.",
    items: [
      {
        title: "تقليل وزن اللفظي والنقدي عن عمد",
        text: "الاستدلال اللفظي والتفكير النقدي يأخذ كلٌّ منهما سؤالين من عشرين، بينما يأخذ المجرّد ثمانية. السبب أن هذين البُعدين محمّلان ثقافياً بطبيعتهما: يقيسان مفرداتك وسياقك ومألوفك من الأمثلة بقدر ما يقيسان استدلالك. لم نحذفهما لأنهما مهارتان حقيقيتان، لكننا لم نسمح لهما بأن يقودا التقدير العام.",
      },
      {
        title: "الأسئلة المجرّدة مولَّدة لا مخزَّنة",
        text: "لا يوجد بنك ثابت من أسئلة المصفوفات يمكن أن تكون قد رأيته أو حفظته. تُبنى كل مفردة لحظة عرضها من قواعد على خمس خصائص: العدد، وشكل الرمز، والدوران، والتعبئة (مصمت أو مفرَّغ)، والحجم. والصعوبة (من ١ إلى ١٠) تتحكّم في عدد الخصائص المتغيّرة معاً — واحدة في المستويات الدنيا وثلاث عند السقف — وفي مدى دقّة الخيارات المُضلِّلة، إذ يُبنى كل مُضلِّل من الإجابة الصحيحة بتبديل خاصية واحدة محكومة بقيمة أخرى من الدورة نفسها.",
      },
      {
        title: "لا قاعدة تعتمد على اللون",
        text: "كل الأشكال أحادية اللون. لا يوجد سؤال واحد تكون إجابته «الأحمر» أو تتوقّف على تمييز درجتين متقاربتين، فلا يخسر صاحب عمى الألوان درجةً لسبب لا علاقة له بالاستدلال، ولا تتسلّل دلالات اللون الثقافية إلى الحلّ.",
      },
      {
        title: "لا معرفة خاصّة بمنهج أو بلد",
        text: "الأسئلة النصّية مكتوبة بمفردات متداولة، بلا مصطلحات تخصّصية، وبلا وحدات قياس محلّية، وبلا أسماء أعلام أو أحداث أو مسمّيات تفترض تعليماً في بلد بعينه. لكل لغة مجموعتها الخاصّة من الأسئلة، والتقييم يُقفَل على اللغة التي بدأته بها حتى لا يُبنى تقدير واحد من أسئلة بلغتين.",
      },
      {
        title: "التحدّي اليومي واحد للجميع",
        text: "أسئلة التحدّي اليومي العشرة تُولَّد من مولّد أرقام شبه عشوائي مزروع ببذرة مشتقّة من تاريخ اليوم، وبتدرّج صعوبة ثابت. الناتج أن كل مستخدم يرى اليوم المجموعة نفسها بالضبط، فترتيب لوحة الصدارة يقارن أداءً بأداء على المادّة نفسها، لا حظّاً بحظّ.",
      },
      {
        title: "القاعدة تُصدَر كبيانات لا كنصّ",
        text: "المولّد لا يُخرج الإجابة الصحيحة فقط، بل يُخرج القاعدة الحاكمة نفسها في صورة بيانات. لهذا نستطيع أن نسمّيها لك بعد الإجابة («الشكل يدور ٩٠ درجة مع كل خطوة»)، ونستطيع أيضاً أن نفحص المفردة آلياً للتأكّد من أنها تطابق القاعدة التي تدّعيها — وهو فحص كشف لنا بالفعل أسئلة كانت بلا قاعدة قابلة للاستنتاج.",
      },
    ],
    caveatTitle: "التحفّظ الصادق",
    caveat:
      "لا شيء ممّا سبق يجعل المقياس محايداً ثقافياً، ولا يوجد مقياس كذلك. الألفة بالاختبارات في ذاتها ترفع الدرجة: من اعتاد الأسئلة الموقوتة، ومن مرّ على ألغاز المصفوفات قبلاً، ومن تعلّم في نظام يدرّب على حلّ المسائل شكلياً — كلهم يبدأون متقدّمين خطوة لأسباب لا علاقة لها بقدرة يفترض المقياس أنه يقيسها. أقصى ما نقوله: قلّلنا مصادر التحيّز التي نعرفها ونستطيع ضبطها في الكود. وهذا أقلّ بكثير من الحياد.",
  },

  limits: {
    heading: "الحدود — اقرأ هذا قبل أن تثق برقم",
    lead: "هذا أهمّ قسم في الصفحة. إن لم تقرأ غيره فاقرأه.",
    items: [
      {
        title: "هذا ليس اختبار ذكاء، وليس أداة تشخيص",
        text: "لا توجد وراء هذه الدرجات عيّنة معيارية، ولا تقنين، ولا مئينات محسوبة على أي مجتمع. الدرجة رقم داخلي يصف أداءك في هذه المفردات بالذات، ولا تُترجَم إلى معامل ذكاء ولا تُقارَن به. والمنصّة ليست أداة طبية أو نفسية: لا تشخّص اضطراب انتباه ولا صعوبة تعلّم ولا أي حالة أخرى، ولا يصحّ استعمالها في توظيف أو قبول أو أي قرار يخصّ إنساناً. إن كان لديك قلق حقيقي بشأن انتباهك أو ذاكرتك، فمكانه مختصّ لا تطبيق.",
      },
      {
        title: "المحرّك تبسيط مدافَع عنه، لا نموذج IRT معايَر",
        text: "صعوبة كل سؤال مُسنَدة من مؤلّفي الأسئلة ومن المولّد، لا مقدَّرة من استجابات آلاف المشاركين كما يحدث في نموذج استجابة المفردة الحقيقي. ونستخدم معاملاً واحداً للتمييز لكل مقياس بدل تقديره لكل مفردة. النتيجة أن الأرقام متّسقة داخلياً — تتحرّك في الاتجاه الصحيح للسبب الصحيح — لكنها غير معايَرة خارجياً على أي مرجع. عاملها كترتيب نسبي تقريبي لمهاراتك عندك أنت، لا كقياس مطلق.",
      },
      {
        title: "الدرجة تتذبذب لأسباب ليست أنت",
        text: "النوم، والتركيز، وساعة اليوم، والتسرّع، والأسئلة التي صادفتك بالذات — كلها تحرّك الدرجة عدّة نقاط في الاتجاهين دون أن يتغيّر فيك شيء. لهذا نعرض نطاقاً، ولهذا نمتنع عن عرض تقدير مبنيّ على أقلّ من أربعة أسئلة.",
      },
      {
        title: "انتقال الأثر البعيد غير مثبت — وهذا هو التحفّظ الأهمّ",
        text: "التمرّن على مهمّة يحسّن الأداء في تلك المهمّة؛ هذا مؤكَّد ومتوقَّع. أمّا أن يمتدّ التحسّن إلى الذكاء العام، أو إلى أداء أفضل في الدراسة أو العمل أو الحياة اليومية، فهذا ما لا تسنده الأدلّة المتاحة. المراجعات التحليلية لتدريب الذاكرة العاملة تجد انتقالاً قريباً إلى مهامّ شبيهة، ولا تجد انتقالاً بعيداً موثوقاً إلى مقاييس الذكاء؛ والمراجعة الشاملة لأدبيات «تدريب الدماغ» التجاري تنتهي إلى الحكم نفسه. الدراسة الشهيرة التي أوردت نتيجة إيجابية (Jaeggi وزملاؤه، ٢٠٠٨) مذكورة في المراجع أدناه لأنك يجب أن تراها، لا لأنها تحسم الأمر — فهي بالضبط النتيجة التي عجزت الدراسات اللاحقة الأكبر عن تأكيدها. الذي نَعِدك به: إتقان أعلى في نوع المهمّة التي تتمرّن عليها، ووعي أوضح بطريقة تفكيرك، وعادة مراجعة منتظمة. لا نَعِد بزيادة ذكائك.",
      },
      {
        title: "التحسّن بين جلستين قد يكون ألفةً بالشكل لا نمواً في القدرة",
        text: "إذا أعدت التقييم بعد أسبوعين ووجدت درجتك أعلى، فالتفسير الأرجح هو أثر التمرّن: صرت أسرع في فهم صيغة السؤال، وأعرف ما يُتوقَّع منك، وأقلّ توتّراً. نحن نؤخّر إعادة التقييم ١٤ يوماً ونتجنّب الأسئلة التي رأيتها مؤخّراً، وهذا يقلّل المشكلة ولا يلغيها. فرقٌ من بضع نقاط بين جلستين لا يعني شيئاً؛ اتجاهٌ ثابت عبر عدّة أشهر ربّما يعني شيئاً.",
      },
    ],
  },

  habits: {
    heading: "كيف تستفيد من المنصّة فعلياً",
    lead: "إن كنت ستأخذ من هذه الصفحة شيئاً واحداً، فليكن هذه العادات الستّ. قيمتها أكبر من قيمة أي رقم تعرضه عليك المنصّة.",
    ordinals: ["١", "٢", "٣", "٤", "٥", "٦"],
    items: [
      {
        title: "سمِّ القاعدة قبل أن تضغط",
        text: "قل لنفسك بصوت مسموع، أو اكتب في سطر: «العدد يزيد واحداً، والشكل يدور تسعين درجة». إن عجزت عن قولها فأنت تخمّن — والتخمين الصحيح لا يعلّمك شيئاً، بل يزيّف تقديرك بالزيادة.",
      },
      {
        title: "اقرأ القاعدة بعد كل خطأ",
        text: "اللحظة الوحيدة في الجلسة التي تُعدّ تعليماً حقيقياً هي السطر الذي يظهر بعد الخطأ فيسمّي القاعدة. تجاوزُه سريعاً يحوّل الجلسة كلها إلى قياس بلا تعلّم.",
      },
      {
        title: "راجع حين يطلب التطبيق، لا حين تشتهي",
        text: "قيمة المراجعة أعلى ما تكون قبيل نسيانك للمعلومة مباشرة. المراجعة المبكّرة تمنحك شعوراً طيّباً بالإتقان وتضيف القليل جداً؛ دع الجدولة تختار التوقيت.",
      },
      {
        title: "اعمل عند حافة قدرتك",
        text: "إن كنت تجيب عن كل شيء تقريباً إجابة صحيحة فالمستوى أسهل من أن يعلّمك. استهدف نحو سبع إجابات صحيحة من عشر: صعوبة تتعثّر فيها وتنتصر عليها. ارفع مستوى n في تمرين الذاكرة العاملة حالما يصير المستوى الحالي مريحاً.",
      },
      {
        title: "أعد القياس بعد أسبوعين، لا بعد جلسة موفّقة",
        text: "إعادة التقييم مباشرة بعد يوم جيّد تقيس مزاجك لا قدرتك. انتظر ١٤ يوماً على الأقلّ — والتطبيق يمنعك قبلها لهذا السبب — وقارن بين نطاقين لا بين رقمين.",
      },
      {
        title: "عامل لوحة الصدارة كأداة مواظبة لا كمقياس قدرة",
        text: "ترتيبك في التحدّي اليومي يقول إنك حضرت اليوم وأدّيت جيّداً في عشرة أسئلة بعينها. هذه فائدة حقيقية — الانتظام هو المتغيّر الوحيد الذي تتحكّم فيه فعلاً — لكنها ليست ترتيباً لقدرتك بين الناس.",
      },
    ],
  },

  refs: {
    heading: "المراجع",
    lead: "أعمال منشورة ومعروفة، مذكورة بأسماء مؤلّفيها وسنواتها ومنابرها بالحروف اللاتينية كما هو المتّبع. لم نُدرِج مرجعاً لسنا واثقين من وجوده أو من أنه يقول ما ننسبه إليه، ولم نضع روابط لا نستطيع ضمانها.",
    items: [
      {
        cite: "Raven, J. C. (1938). Progressive Matrices: A Perceptual Test of Intelligence. London: H. K. Lewis.",
        note: "الأصل الذي جاءت منه أسئلة المصفوفات: مفردات بصرية غير لفظية صُمِّمت لتقليل اعتماد الاختبار على اللغة والتعليم.",
      },
      {
        cite: "Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new area of cognitive–developmental inquiry. American Psychologist, 34(10), 906–911.",
        note: "المرجع المؤسِّس لمفهوم ما وراء المعرفة: مراقبة المرء لتفكيره ومعرفته بحدود معرفته.",
      },
      {
        cite: "Flynn, J. R. (1987). Massive IQ gains in 14 nations: What IQ tests really measure. Psychological Bulletin, 101(2), 171–191.",
        note: "ارتفاع درجات اختبارات الذكاء ارتفاعاً كبيراً عبر الأجيال في بلدان كثيرة — دليل على أن ما تقيسه هذه الاختبارات ليس صفة ثابتة في الإنسان.",
      },
      {
        cite: "Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363–406.",
        note: "الورقة التي عرّفت التدريب المتعمَّد: عمل مقصود عند حافة القدرة مع تغذية راجعة فورية، لا مجرّد تكرار.",
      },
      {
        cite: "Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255.",
        note: "أثر الاختبار: الاستحضار من الذاكرة يعطي بقاءً أطول من إعادة الدراسة، رغم أنه يبدو أصعب وأقلّ إنتاجية وقت أدائه.",
      },
      {
        cite: "Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354–380.",
        note: "تحليل بَعدي واسع لأثر التباعد: توزيع المراجعات يتفوّق على حشرها، والفاصل الأمثل يطول كلما طالت المدّة المطلوب البقاء خلالها.",
      },
      {
        cite: "Jaeggi, S. M., Buschkuehl, M., Jonides, J., & Perrig, W. J. (2008). Improving fluid intelligence with training on working memory. Proceedings of the National Academy of Sciences, 105(19), 6829–6833.",
        note: "الدراسة التي أشاعت تمرين n-back وأوردت انتقال أثره إلى الذكاء السيّال. مذكورة هنا للأمانة، مع ملاحظة أن المراجعات اللاحقة أدناه لم تؤكّد هذا الانتقال.",
      },
      {
        cite: "Melby-Lervåg, M., & Hulme, C. (2013). Is working memory training effective? A meta-analytic review. Developmental Psychology, 49(2), 270–291.",
        note: "تحليل بَعدي يجد مكاسب قصيرة الأمد في مهامّ شبيهة، دون انتقال موثوق إلى القدرات المعرفية العامة.",
      },
      {
        cite: "Melby-Lervåg, M., Redick, T. S., & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of “far transfer”: Evidence from a meta-analytic review. Perspectives on Psychological Science, 11(4), 512–534.",
        note: "المراجعة الأوسع والأحدث للسؤال نفسه، وخلاصتها في عنوانها: لا انتقال بعيداً إلى مقاييس الذكاء.",
      },
      {
        cite: "Simons, D. J., Boot, W. R., Charness, N., Gathercole, S. E., Chabris, C. F., Hambrick, D. Z., & Stine-Morrow, E. A. L. (2016). Do “brain-training” programs work? Psychological Science in the Public Interest, 17(3), 103–186.",
        note: "مراجعة منهجية لأدبيات برامج تدريب الدماغ التجارية وادّعاءاتها: أدلّة قوية على التحسّن في المهمّة المُدرَّبة، وضعيفة جداً على ما هو أبعد منها.",
      },
    ],
  },

  footer: {
    lead: "لك أن تعرف أيضاً ماذا نفعل ببياناتك، وبأي شروط تستخدم المنصّة.",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    journey: "ابدأ من رحلتي",
  },
};

const EN: Copy = {
  title: "The science behind this platform",
  intro:
    "This page explains how the platform works from the inside: what it measures, by exactly what mechanism, and what it cannot promise you. It is written for a sceptical reader, not to sell anything. If parts of it read as unusually modest, that is deliberate — overclaiming is the one mistake that cannot be fixed later.",

  measure: {
    heading: "What we measure, and how",
    lead: "The diagnostic is twenty items across five dimensions, with a sixth — working memory — measured by a separate interactive task, because a multiple-choice question cannot measure it honestly.",
    dimsTitle: "The six dimensions",
    dims: [
      {
        title: "Abstract reasoning — 8 of 20 items",
        text: "Procedurally generated visual patterns: a 3×3 matrix with the last cell missing, a four-cell sequence you complete, or an odd-one-out among four. It carries the most weight because it depends least on language and schooling.",
      },
      {
        title: "Logical reasoning — 4 of 20 items",
        text: "Drawing conclusions from premises, conditional relations, sequences and syllogisms.",
      },
      {
        title: "Numeracy — 4 of 20 items",
        text: "Numbers, ratios, rates and quantitative problems solved with plain arithmetic rather than a particular curriculum.",
      },
      {
        title: "Verbal reasoning — only 2 of 20 items",
        text: "Analogies and relations between words. The small count is deliberate; the reason is in the fairness section below.",
      },
      {
        title: "Critical thinking — only 2 of 20 items",
        text: "Weighing an argument, spotting a fallacy, reasoning about probability. De-weighted for the same reason.",
      },
      {
        title: "Working memory — not in the written test at all",
        text: "Measured only by the n-back task. A multiple-choice memory question leaves the text in front of you while you answer, so it measures reading, not holding something in mind.",
      },
    ],
    engineTitle: "The adaptive engine, step by step",
    engine: [
      {
        title: "Where the estimate starts",
        text: "Every dimension starts in the middle of its scale: 3 on a 1..5 scale for the text dimensions, and 5 on a wider 1..10 scale for abstract reasoning — wider because that dimension has to stretch from a child's level to an expert's.",
      },
      {
        title: "How it moves after each answer",
        text: "Before you answer, we compute the probability that you will get the item right, as a logistic function of the gap between your current estimate and the item's difficulty. The estimate then moves in proportion to how surprising the outcome was: getting right an item we expected you to miss moves it a lot; getting right an easy item barely moves it. This family of updates is known as Elo, and it is a simplified approximation of Item Response Theory (IRT).",
      },
      {
        title: "Fast calibration on the abstract dimension",
        text: "Because its range is wider, the update step for the first three abstract items is more than twice the normal size (1.6 against 0.7). The estimate jumps into the right neighbourhood within a few items, then the step drops so it refines inside that neighbourhood instead of oscillating.",
      },
      {
        title: "Which item comes next",
        text: "The unseen item whose difficulty sits closest to your current estimate, because that item is the most informative: one you would certainly get right and one you could not possibly solve both tell us nothing. We also prefer items you have not met in recent assessments, so a retake measures your ability rather than your memory of the same questions.",
      },
      {
        title: "Why you sometimes see “not enough data” instead of a score",
        text: "The estimate cannot move by more than one step per item. A dimension that received only two items is therefore mathematically trapped near the middle: it cannot leave the range of roughly 37–63 out of 100 no matter how you performed, which means it is structurally incapable of ever reading “advanced” or “beginner”. Showing a number there would be misleading, so we show a dash — and we do not let such a dimension decide what your “weakest skill” is. At four items the attainable range widens to roughly 18–82, which is usable, and four is where we set the threshold.",
      },
      {
        title: "Why we report a range, not a single number",
        text: "A single number invites you to read it as an IQ. The residual uncertainty of an Elo-style updater is roughly k divided by the square root of the number of items, and it never falls below half a step, because the updater itself cannot resolve finer than that. We then widen the result by about half again, to a band we are willing to stand behind. Your true score — if such a thing exists — is somewhere inside that band, not at its top edge.",
      },
      {
        title: "Working memory: the n-back task",
        text: "Twenty trials on a 3×3 grid; a square lights for 700 ms every 2.5 seconds and you respond when its position matches the one n steps back. Each round contains an exact, fixed number of targets (32% of trials, so 6 of 20) rather than a coin flip per trial, so rounds are comparable — and so a round you played perfectly cannot score 0 just because it happened to contain no targets. The score is hit rate minus false-alarm rate, so pressing on everything scores zero, not a hundred.",
      },
      {
        title: "Mistakes become review cards",
        text: "Every text item you get wrong becomes a card scheduled by the FSRS algorithm (through the open-source ts-fsrs package) with its default parameters. A wrong answer is rated Again, so the card returns soon; a correct one is rated Good, so the interval grows. Abstract items are not scheduled — they are generated fresh and never repeat; you practise them in the open-ended abstract session instead.",
      },
    ],
  },

  principles: {
    heading: "The principles we build on",
    lead: "Four principles with reasonable empirical support. What matters is not that we name them, but what the platform does because of each one.",
    items: [
      {
        title: "Active recall (the testing effect)",
        text: "Pulling something out of memory fixes it better than reading it again. So the platform never shows you an item and its answer together to study: you always answer first, then see the explanation. Every review is a fresh attempt, not a re-reading.",
      },
      {
        title: "Spaced repetition",
        text: "The same total effort spread over separated days produces longer retention than the same effort massed into one sitting. So every mistake becomes an FSRS card that comes back near the point where you would have forgotten it, rather than whenever you happen to open the app.",
      },
      {
        title: "Deliberate practice",
        text: "Repetition alone develops nothing; working at the edge of your ability with immediate, specific feedback does. So the engine keeps serving items right at your current estimate — which is also where they are statistically most informative — and so we name the governing rule after each abstract item instead of leaving you with a tick or a cross.",
      },
      {
        title: "Metacognition",
        text: "Knowing the limits of what you know is itself a trainable skill, and it is the most useful thing anyone can take away from a platform like this. So we name the rule behind every abstract item after you answer, report scores as ranges rather than points, and say plainly when we do not know rather than guessing a number.",
      },
    ],
  },

  fairness: {
    heading: "Why the items are built for fairness",
    lead: "“Fair” here means something specific: the correct answer should not depend on your first language, your curriculum, your country, or your colour vision. These are decisions in the code, not intentions.",
    items: [
      {
        title: "Verbal and critical are de-weighted on purpose",
        text: "Verbal reasoning and critical thinking get two items each out of twenty, while abstract reasoning gets eight. These two dimensions are culturally loaded by their nature: they measure your vocabulary, your context and how familiar the examples feel to you at least as much as they measure your reasoning. We did not drop them, because they are real skills — but we did not let them drive the overall estimate either.",
      },
      {
        title: "Abstract items are generated, not stored",
        text: "There is no fixed bank of matrix items you might have seen or memorised. Each one is built at the moment it is shown, from rules over five attributes: count, shape, rotation, fill (solid or outline) and size. Difficulty (1 to 10) controls how many attributes vary together — one at the low levels, three at the ceiling — and how subtle the distractors are, since each distractor is the correct answer with exactly one governed attribute swapped for another value from the same cycle.",
      },
      {
        title: "No rule ever depends on colour",
        text: "Every shape is monochrome. There is no item whose answer is “the red one”, and none that turns on telling two similar shades apart — so nobody loses a point to colour vision for a reason unrelated to reasoning, and no cultural colour convention can leak into the solution.",
      },
      {
        title: "No curriculum- or region-specific knowledge",
        text: "The written items use plain, everyday vocabulary: no technical jargon, no local units of measurement, no names, events or institutions that assume schooling in one particular country. Each language has its own item pool, and an assessment is locked to the language you started it in, so one estimate is never assembled from items in two languages.",
      },
      {
        title: "The daily challenge is the same set for everyone",
        text: "The ten daily-challenge items are produced by a seeded pseudo-random generator keyed to the date, along a fixed difficulty ramp. Everyone therefore sees exactly the same set on the same day, so the leaderboard compares performance against performance on identical material rather than luck against luck.",
      },
      {
        title: "The rule is emitted as data, not prose",
        text: "The generator does not only output the correct answer — it outputs the governing rule itself, as structured data. That is why we can name it for you after you answer (“the shape turns 90° at each step”), and why an item can be machine-audited against the rule it claims to follow. That audit has already caught items that had no inferable rule at all.",
      },
    ],
    caveatTitle: "The honest caveat",
    caveat:
      "None of this makes the measure culture-neutral, and no measure is. Familiarity with tests raises scores by itself: someone used to timed questions, someone who has met matrix puzzles before, someone schooled in a system that drills formal problem-solving — each starts a step ahead for reasons that have nothing to do with the ability the test claims to measure. The most we will say is that we removed the sources of bias we know about and can control in code. That is a good deal less than neutrality.",
  },

  limits: {
    heading: "The limits — read this before you trust a number",
    lead: "This is the most important section on the page. If you read nothing else, read this.",
    items: [
      {
        title: "This is not an IQ test, and not a clinical or diagnostic instrument",
        text: "There is no normative sample behind these scores, no standardisation, and no percentile computed against any population. A score is an internal number describing how you did on these particular items; it does not translate into an IQ and should not be compared to one. Nor is the platform a medical or psychological tool: it does not detect ADHD, a learning difficulty, or any other condition, and it must not be used for hiring, admissions, or any decision about a person. If you have a genuine concern about your attention or memory, that belongs with a clinician, not an app.",
      },
      {
        title: "The engine is a defensible simplification, not a calibrated IRT model",
        text: "Item difficulties are assigned by the people who wrote the items and by the generator — not estimated from the responses of thousands of test-takers, as they would be in a real Item Response Theory model. We also use one discrimination parameter per scale instead of estimating one per item. The numbers are therefore internally consistent — they move in the right direction for the right reason — but externally uncalibrated against any reference. Read them as a rough ordering of your own skills relative to each other, not as an absolute measurement.",
      },
      {
        title: "Scores fluctuate for reasons that are not you",
        text: "Sleep, focus, time of day, rushing, and which items you happened to be shown all move a score several points in either direction while nothing about you has changed. That is why we report a range, and why we refuse to show an estimate built on fewer than four items.",
      },
      {
        title: "Far transfer is not established — this is the caveat that matters most",
        text: "Training a task reliably improves performance on that task; that much is certain and expected. Whether that improvement extends to general intelligence, or to better performance at school, at work, or in daily life, is not something the available evidence supports. Meta-analytic reviews of working-memory training find near transfer to similar tasks and no reliable far transfer to measures of intelligence, and the comprehensive review of the commercial brain-training literature reaches the same verdict. The well-known positive study (Jaeggi et al., 2008) is in the references below because you should see it, not because it settles the question — it is precisely the finding that larger later work failed to confirm. What we promise: more skill at the kind of task you practise, a clearer view of how you think, and a steady review habit. We do not promise to raise your intelligence.",
      },
      {
        title: "Improvement between two sessions may be practice, not growth",
        text: "If you re-assess two weeks later and your score is higher, the most likely explanation is a practice effect: you are faster at parsing the format, you know what is expected, you are less tense. We hold re-assessment for fourteen days and steer away from items you saw recently, which reduces the problem without eliminating it. A few points between two sessions means nothing; a consistent direction across several months might mean something.",
      },
    ],
  },

  habits: {
    heading: "How to actually get value out of it",
    lead: "If you take one thing from this page, take these six habits. They are worth more than any number the platform will show you.",
    ordinals: ["1", "2", "3", "4", "5", "6"],
    items: [
      {
        title: "Name the rule before you press",
        text: "Say it out loud, or write one line: “the count goes up by one and the shape turns ninety degrees”. If you cannot say it, you are guessing — and a lucky guess teaches you nothing while inflating your estimate.",
      },
      {
        title: "Read the rule after every mistake",
        text: "The single moment in a session that is actually instruction is the line that appears after a wrong answer and names the rule. Skipping past it turns the whole session into measurement with no learning in it.",
      },
      {
        title: "Review when the app asks, not when you feel like it",
        text: "A review is worth most just before you would have forgotten. Reviewing early feels satisfying and buys very little; let the scheduler pick the moment.",
      },
      {
        title: "Work at the edge of your ability",
        text: "If you are getting nearly everything right, the level is too easy to teach you anything. Aim for about seven right out of ten — hard enough to stumble, easy enough to win. Raise the n in the working-memory task as soon as the current level feels comfortable.",
      },
      {
        title: "Re-measure after two weeks, not after a good session",
        text: "Re-assessing right after a good day measures your mood, not your ability. Wait at least fourteen days — the app holds you back for exactly this reason — and compare two ranges, not two numbers.",
      },
      {
        title: "Treat the leaderboard as a habit device, not a score of your ability",
        text: "Your rank in the daily challenge says that you showed up today and did well on ten specific items. That is genuinely useful — consistency is the one variable you actually control — but it is not a ranking of your ability among people.",
      },
    ],
  },

  refs: {
    heading: "References",
    lead: "Published, well-known work, listed as plain text with author, year, title and venue. We left out anything we were not confident exists and says what we claim, and we added no links we cannot vouch for.",
    items: [
      {
        cite: "Raven, J. C. (1938). Progressive Matrices: A Perceptual Test of Intelligence. London: H. K. Lewis.",
        note: "The origin of matrix reasoning: non-verbal visual items designed to reduce a test's dependence on language and schooling.",
      },
      {
        cite: "Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new area of cognitive–developmental inquiry. American Psychologist, 34(10), 906–911.",
        note: "The founding statement of metacognition — monitoring your own thinking and knowing the limits of what you know.",
      },
      {
        cite: "Flynn, J. R. (1987). Massive IQ gains in 14 nations: What IQ tests really measure. Psychological Bulletin, 101(2), 171–191.",
        note: "IQ test scores rose substantially across generations in many countries — evidence that what these tests measure is not a fixed property of a person.",
      },
      {
        cite: "Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363–406.",
        note: "The paper that defined deliberate practice: purposeful work at the edge of current ability with immediate feedback, not mere repetition.",
      },
      {
        cite: "Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255.",
        note: "The testing effect: retrieval produces longer retention than restudying, even though it feels harder and less productive at the time.",
      },
      {
        cite: "Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354–380.",
        note: "A large meta-analysis of the spacing effect: distributed review beats massed review, and the best gap grows with how long you need to remember.",
      },
      {
        cite: "Jaeggi, S. M., Buschkuehl, M., Jonides, J., & Perrig, W. J. (2008). Improving fluid intelligence with training on working memory. Proceedings of the National Academy of Sciences, 105(19), 6829–6833.",
        note: "The study that popularised n-back training and reported transfer to fluid intelligence. Listed for completeness, with the note that the reviews below did not confirm that transfer.",
      },
      {
        cite: "Melby-Lervåg, M., & Hulme, C. (2013). Is working memory training effective? A meta-analytic review. Developmental Psychology, 49(2), 270–291.",
        note: "A meta-analysis finding short-term gains on similar tasks and no reliable transfer to general cognitive ability.",
      },
      {
        cite: "Melby-Lervåg, M., Redick, T. S., & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of “far transfer”: Evidence from a meta-analytic review. Perspectives on Psychological Science, 11(4), 512–534.",
        note: "The broader, later review of the same question, with its conclusion stated in the title: no far transfer to measures of intelligence.",
      },
      {
        cite: "Simons, D. J., Boot, W. R., Charness, N., Gathercole, S. E., Chabris, C. F., Hambrick, D. Z., & Stine-Morrow, E. A. L. (2016). Do “brain-training” programs work? Psychological Science in the Public Interest, 17(3), 103–186.",
        note: "A systematic review of the commercial brain-training literature and its claims: strong evidence of improvement on the trained task, very weak evidence for anything beyond it.",
      },
    ],
  },

  footer: {
    lead: "You may also want to know what we do with your data, and the terms you use the platform under.",
    privacy: "Privacy policy",
    terms: "Terms of use",
    journey: "Start with My Journey",
  },
};

const CONTENT: Record<Locale, Copy> = { ar: AR, en: EN };

export default function SciencePage() {
  const { locale } = useI18n();
  const c = CONTENT[locale];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <header className="mb-8 text-start">
        <h1 className="text-2xl font-bold md:text-3xl">{c.title}</h1>
        <p className="mt-3 leading-relaxed text-fg-muted">{c.intro}</p>
      </header>

      <div className="grid gap-4">
        {/* 1 — What we measure and how */}
        <Section heading={c.measure.heading} lead={c.measure.lead}>
          <SubHeading>{c.measure.dimsTitle}</SubHeading>
          <EntryList entries={c.measure.dims} />

          <SubHeading className="mt-6">{c.measure.engineTitle}</SubHeading>
          <EntryList entries={c.measure.engine} />
        </Section>

        {/* 2 — Principles */}
        <Section heading={c.principles.heading} lead={c.principles.lead}>
          <EntryList entries={c.principles.items} />
        </Section>

        {/* 3 — Fairness */}
        <Section heading={c.fairness.heading} lead={c.fairness.lead}>
          <EntryList entries={c.fairness.items} />
          <div className="mt-5 rounded-xl border border-border-soft bg-surface-2/50 p-4 text-start">
            <p className="mb-1 text-sm font-bold text-brand-ink">
              ⚖️ {c.fairness.caveatTitle}
            </p>
            <p className="text-sm leading-relaxed text-fg-muted">
              {c.fairness.caveat}
            </p>
          </div>
        </Section>

        {/* 4 — The limits. The section this page exists for. */}
        <Card className="border-warning/30 bg-warning/5 p-6 text-start">
          <h2 className="text-lg font-bold md:text-xl">
            ⚠️ {c.limits.heading}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-fg">
            {c.limits.lead}
          </p>
          <div className="mt-5">
            <EntryList entries={c.limits.items} />
          </div>
        </Card>

        {/* 5 — Habits */}
        <Section heading={c.habits.heading} lead={c.habits.lead}>
          <ol className="grid gap-4">
            {c.habits.items.map((item, i) => (
              <li key={item.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand-soft text-xs font-bold text-brand-ink"
                >
                  {c.habits.ordinals[i]}
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* 6 — References */}
        <Section heading={c.refs.heading} lead={c.refs.lead}>
          <ul className="grid gap-4">
            {c.refs.items.map((ref) => (
              <li
                key={ref.cite}
                className="border-t border-border-soft pt-4 first:border-t-0 first:pt-0"
              >
                {/* Latin-script citations stay LTR even on the Arabic page —
                    standard practice for a reference list. */}
                <p dir="ltr" className="text-start text-sm leading-relaxed text-fg">
                  {ref.cite}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-fg-faint">
                  {ref.note}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <footer className="mt-8 text-start">
        <p className="mb-3 text-sm text-fg-muted">{c.footer.lead}</p>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/privacy" variant="outline" size="sm">
            {c.footer.privacy}
          </ButtonLink>
          <ButtonLink href="/terms" variant="outline" size="sm">
            {c.footer.terms}
          </ButtonLink>
          <ButtonLink href="/journey" size="sm">
            {c.footer.journey}
          </ButtonLink>
        </div>
      </footer>
    </div>
  );
}

// ------------------------------- pieces -------------------------------

function Section({
  heading,
  lead,
  children,
}: {
  heading: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6 text-start">
      <h2 className="text-lg font-bold md:text-xl">{heading}</h2>
      <p className="mb-5 mt-2 text-sm leading-relaxed text-fg-muted">{lead}</p>
      {children}
    </Card>
  );
}

function SubHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={
        "mb-3 text-xs font-bold uppercase tracking-wide text-brand-ink" +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </h3>
  );
}

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="grid gap-4">
      {entries.map((entry) => (
        <li
          key={entry.title}
          className="border-s-2 border-border-soft ps-4 text-start"
        >
          <p className="font-semibold">{entry.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">
            {entry.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
