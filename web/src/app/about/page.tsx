"use client";

import type { Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import { ButtonLink, Card } from "@/components/ui";
import { CONTACT_EMAIL, SITE_NAME_AR, SITE_NAME_EN } from "@/lib/site";

// Kept local to this page on purpose — see the note in `privacy/page.tsx`.

interface Section {
  icon: string;
  h: string;
  p: readonly string[];
}

interface AboutContent {
  siteName: string;
  title: string;
  intro: readonly string[];
  sections: readonly Section[];
  contactH: string;
  contactP: string;
  moreH: string;
  moreP: string;
  scienceCta: string;
  privacyCta: string;
  termsCta: string;
}

const CONTENT: Record<Locale, AboutContent> = {
  ar: {
    siteName: SITE_NAME_AR,
    title: "عن المنصّة",
    intro: [
      "منصّة لتنمية القدرات المعرفية: تقيس مجموعة من المهارات المعرفية بتقييم قصير، ثم تبني حولها خطة تمرين ومراجعة متباعدة تركّز على نقاط ضعفك، مع تحدٍّ يومي قصير يساعد على الاستمرار.",
      "كل شيء فيها مجاني، وتعمل بالعربية والإنجليزية.",
    ],
    sections: [
      {
        icon: "👥",
        h: "لمن هذه المنصّة",
        p: [
          "لكل الناس، مهما كان العمر أو التعليم أو المهنة. تلميذ في الصف السادس، وأستاذ فيزياء، وسبّاك، وصيّاد سمك — الأسئلة نفسها، والطريقة نفسها، والنتائج تُقرأ بالمعيار نفسه.",
          "لا تحتاج خلفية دراسية معيّنة، ولا مصطلحات تخصصية، ولا خبرة سابقة بالاختبارات لتبدأ.",
        ],
      },
      {
        icon: "⚖️",
        h: "مبدأ الإنصاف",
        p: [
          "الأسئلة اللفظية المشحونة ثقافياً — تلك التي تكافئ من قرأ كتباً بعينها أو درس في مدرسة بعينها — يُخفَّض وزنها في حساب النتيجة، فلا تتحوّل الخلفية الثقافية إلى درجة.",
          "بُعد التفكير المجرّد يُولَّد إجرائياً: أشكال وأنماط بلا لغة وبلا معرفة سابقة، فلا يفيد فيه حفظ ولا ثروة لغوية ولا مناهج دراسية.",
          "ومع ذلك نقولها بصراحة: لا يوجد اختبار محايد ثقافياً بالكامل. مجرّد الألفة بالاختبارات — أن تكون قد جلست من قبل أمام أسئلة اختيار من متعدد ومؤقّت يعدّ الثواني — تعطي أفضلية حقيقية. نحن نقلّل هذا الأثر ولا ندّعي إلغاءه.",
        ],
      },
      {
        icon: "🎯",
        h: "ما تفعله المنصّة وما لا تفعله",
        p: [
          "التحسّن في تمرين معيّن لا ينتقل تلقائياً إلى ذكاء عام أو إلى أداء أفضل في العمل أو الدراسة؛ الأدلّة على انتقال الأثر البعيد لا تزال محدودة، وأي منصّة تعدك بغير ذلك تبيعك وهماً.",
          "ما نعد به: إتقان أعلى في نوع المهمة التي تتمرّن عليها، ورؤية أوضح لطريقة تفكيرك وأين تتعثّر، وعادة مراجعة منتظمة تصمد مع الوقت.",
          "وما لا نعد به: رقم ذكاء، أو تشخيصاً، أو نتيجة صالحة لأي قرار يخصّ شخصاً. النتيجة تقدير تقريبي يتذبذب بين جلسة وأخرى.",
        ],
      },
      {
        icon: "🛠️",
        h: "نسخة مبكّرة، مبنية في العلن",
        p: [
          "المنصّة في نسختها الأولى، وتُبنى على مرأى من مستخدميها: ما لا يعمل نقوله، وما لا نعرفه لا ندّعيه، وحدود القياس مكتوبة في الصفحات لا مخبّأة في الحواشي.",
          "إن وجدت خطأ في سؤال، أو ترجمة ركيكة، أو فكرة تجعل الأمر أفضل — راسلنا. الملاحظات المبكّرة هي أنفع ما يمكن أن يصل للمشروع الآن.",
        ],
      },
    ],
    contactH: "أرسل ملاحظاتك",
    contactP: "نقرأ كل رسالة تصلنا على:",
    moreH: "اقرأ أكثر",
    moreP: "الأساس العلمي وحدوده، وما نفعله ببياناتك، وشروط الاستخدام.",
    scienceCta: "🔬 الأساس العلمي",
    privacyCta: "سياسة الخصوصية",
    termsCta: "شروط الاستخدام",
  },
  en: {
    siteName: SITE_NAME_EN,
    title: "About",
    intro: [
      "A platform for building cognitive skills: a short assessment measures a set of cognitive dimensions, and around that it builds a practice and spaced-review plan aimed at your weak points, plus a short daily challenge to help you keep going.",
      "All of it is free, and it works in Arabic and English.",
    ],
    sections: [
      {
        icon: "👥",
        h: "Who it is for",
        p: [
          "Everyone, regardless of age, schooling or profession. A sixth-grader, a physics professor, a plumber, a fisherman — the same items, the same method, the same yardstick for reading the result.",
          "You need no particular educational background, no specialist vocabulary, and no prior experience with tests to start.",
        ],
      },
      {
        icon: "⚖️",
        h: "The fairness principle",
        p: [
          "Culturally-loaded verbal items — the kind that reward whoever read certain books or attended certain schools — are de-weighted in the score, so that cultural background does not quietly turn into a number.",
          "The abstract dimension is procedurally generated: shapes and patterns with no language and no prior knowledge, so memorization, vocabulary and curriculum give you nothing there.",
          "And honestly: no test is fully culture-neutral. Sheer familiarity with tests — having sat in front of multiple-choice items and a ticking timer before — is a real advantage. We reduce that effect; we do not claim to erase it.",
        ],
      },
      {
        icon: "🎯",
        h: "What it will and won't do",
        p: [
          "Getting better at a specific exercise does not automatically transfer to general intelligence or to better performance at work or school — the evidence for far transfer is still thin, and any platform promising otherwise is selling you something.",
          "What we promise: more skill at the kind of task you practise, a clearer view of how you think and where you stumble, and a steady review habit that survives.",
          "What we do not promise: an IQ number, a diagnosis, or a result fit for any decision about a person. A score is a rough estimate that moves between sessions.",
        ],
      },
      {
        icon: "🛠️",
        h: "An early version, built in the open",
        p: [
          "This is the first version, and it is being built where its users can see it: what does not work is said out loud, what we do not know is not claimed, and the limits of the measure are written on the pages instead of buried in a footnote.",
          "If you find a bad item, a clumsy translation, or an idea that would make this better — write to us. Early feedback is the most useful thing this project can get right now.",
        ],
      },
    ],
    contactH: "Send feedback",
    contactP: "We read every message that arrives at:",
    moreH: "Read more",
    moreP:
      "The science behind it and its limits, what we do with your data, and the terms of use.",
    scienceCta: "🔬 The science",
    privacyCta: "Privacy Policy",
    termsCta: "Terms of Use",
  },
};

export default function AboutPage() {
  const { locale } = useI18n();
  const c = CONTENT[locale];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <header className="mb-8 text-start">
        <p className="text-sm font-semibold text-brand-ink">{c.siteName}</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">{c.title}</h1>
        {c.intro.map((p, i) => (
          <p key={i} className="mt-4 text-sm leading-relaxed text-fg-muted">
            {p}
          </p>
        ))}
      </header>

      <div className="grid gap-4">
        {c.sections.map((s) => (
          <Card key={s.h} className="p-5 text-start md:p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-xl">
                {s.icon}
              </span>
              <h2 className="text-lg font-bold">{s.h}</h2>
            </div>
            <div className="grid gap-3">
              {s.p.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-fg-muted">
                  {p}
                </p>
              ))}
            </div>
          </Card>
        ))}

        <Card className="border-border-soft bg-surface-2/40 p-5 text-start md:p-6">
          <h2 className="mb-3 text-lg font-bold">{c.contactH}</h2>
          <p className="mb-3 text-sm leading-relaxed text-fg-muted">
            {c.contactP}
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            dir="ltr"
            className="inline-block font-semibold text-brand-ink underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
        </Card>

        <Card className="p-5 text-start md:p-6">
          <h2 className="mb-2 text-lg font-bold">{c.moreH}</h2>
          <p className="mb-4 text-sm leading-relaxed text-fg-muted">{c.moreP}</p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/science" size="sm">
              {c.scienceCta}
            </ButtonLink>
            <ButtonLink href="/privacy" variant="outline" size="sm">
              {c.privacyCta}
            </ButtonLink>
            <ButtonLink href="/terms" variant="outline" size="sm">
              {c.termsCta}
            </ButtonLink>
          </div>
        </Card>
      </div>
    </div>
  );
}
