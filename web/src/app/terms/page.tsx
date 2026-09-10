"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import { Card, cn } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

// Kept local to this page on purpose — see the note in `privacy/page.tsx`.

interface Section {
  h: string;
  p: readonly string[];
  /** Renders the section as a highlighted warning instead of a plain block. */
  tone?: "warn";
}

interface TermsContent {
  title: string;
  updatedLabel: string;
  updated: string;
  intro: readonly string[];
  sections: readonly Section[];
  contactH: string;
  contactP: string;
}

const CONTENT: Record<Locale, TermsContent> = {
  ar: {
    title: "شروط الاستخدام",
    updatedLabel: "آخر تحديث",
    updated: "١١ سبتمبر ٢٠٢٦",
    intro: [
      "باستخدامك المنصّة فأنت توافق على ما في هذه الصفحة. حاولنا كتابتها بلغة مفهومة، لأن الشرط الذي لا يُفهَم لا قيمة له.",
    ],
    sections: [
      {
        h: "خدمة مجانية، ونسخة مبكّرة",
        p: [
          "استخدام المنصّة مجاني بالكامل، وهي مقدَّمة «كما هي» دون أي ضمان من أي نوع.",
          "هذه نسخة أولى مبكّرة (MVP): قد تجد فيها أخطاء، وقد تتغيّر المزايا أو تُحذَف، وقد تتوقّف الخدمة مؤقّتاً.",
        ],
      },
      {
        h: "ليست تقييماً طبياً ولا نفسياً ولا تشخيصياً",
        tone: "warn",
        p: [
          "المنصّة ليست تقييماً طبياً ولا نفسياً ولا تعليمياً ولا تشخيصياً، ولا تقدّم رأياً إكلينيكياً من أي نوع.",
          "لا يجوز استخدام نتائجها في التوظيف، أو القبول الدراسي، أو التصنيف والتوزيع، أو أي قرار يخصّ شخصاً — لا عن نفسك ولا عن غيرك.",
          "هي ليست اختبار ذكاء (IQ)، ودرجاتها غير قابلة للمقارنة بدرجات اختبارات الذكاء المعيارية ولا تعادلها بأي صورة.",
          "إن كان لديك قلق حقيقي بشأن الانتباه أو الذاكرة أو التعلّم، فالمرجع في ذلك مختصّ مؤهَّل، لا هذه الصفحة ولا نتائجها.",
        ],
      },
      {
        h: "الدرجات تقديرات تقريبية",
        p: [
          "كل درجة تقدير تقريبي مبني على عدد محدود من الأسئلة، وهي تتذبذب بين جلسة وأخرى بحسب النوم والتركيز والأسئلة التي صادفتها.",
          "لا تعامل أي رقم هنا كقيمة ثابتة لقدرتك، ولا تبنِ عليه قراراً.",
        ],
      },
      {
        h: "الاستخدام المقبول",
        p: [
          "لا تحاول التلاعب بلوحة الصدارة، ولا إرسال نتائج غير حقيقية، ولا استغلال أي ثغرة لرفع ترتيبك.",
          "لا سحب آلي للمحتوى (scraping)، ولا تشغيل برامج آلية على المنصّة.",
          "لا أسماء معروضة مسيئة أو بذيئة أو منتحِلة لشخص آخر؛ ولنا أن نحذف أي اسم من هذا النوع دون إشعار مسبق.",
        ],
      },
      {
        h: "الحسابات والخدمة",
        p: [
          "يجوز لنا إيقاف أو حذف أي حساب يُستخدَم في إساءة أو تلاعب أو إضرار بمستخدمين آخرين.",
          "قد تتغيّر الخدمة أو تتوقّف كلياً في أي وقت. إن كان فيها شيء يهمّك، فاحتفظ بنسخة منه خارج المنصّة.",
        ],
      },
      {
        h: "المحتوى",
        p: [
          "الأسئلة والتمارين في المنصّة أصلية ومكتوبة يدوياً لهذا المشروع، وليست منقولة عن أي اختبار معياري منشور.",
          "أما التمارين التي يولّدها الذكاء الاصطناعي عند طلبك، فتُنتَج لحظياً لك ولا تُنسَب إلى أي اختبار قائم.",
        ],
      },
      {
        h: "لغة بسيطة، بلا تعقيد قانوني",
        p: [
          "هذه الشروط مكتوبة بلغة عادية ولا تستند إلى ولاية قضائية بعينها، ولا تذكر عنواناً أو كياناً قانونياً لأنها ببساطة لا تحتاج إلى ذلك في هذه المرحلة.",
          "إن كان لديك اعتراض أو شكوى أو مشكلة، راسلنا أولاً وسنحاول حلّها مباشرةً وبحسن نيّة.",
          "قد تتغيّر هذه الشروط مع تطوّر المنصّة، وتاريخ «آخر تحديث» في أعلى الصفحة يوضّح آخر مرّة تغيّرت فيها.",
        ],
      },
    ],
    contactH: "التواصل",
    contactP: "لأي سؤال عن هذه الشروط، أو لأي شكوى، راسلنا على:",
  },
  en: {
    title: "Terms of Use",
    updatedLabel: "Last updated",
    updated: "11 September 2026",
    intro: [
      "By using the platform you agree to what is on this page. We tried to write it in language you can actually follow, because a term nobody understands is worth nothing.",
    ],
    sections: [
      {
        h: "Free, and an early version",
        p: [
          "The platform is free to use and is provided “as is”, with no warranty of any kind.",
          "This is an early first version (an MVP): you may find bugs, features may change or be removed, and the service may go down for a while.",
        ],
      },
      {
        h: "Not a medical, psychological or diagnostic assessment",
        tone: "warn",
        p: [
          "This platform is not a medical, psychological, educational or diagnostic assessment, and it gives no clinical opinion of any kind.",
          "Its results must not be used for hiring, admission, placement or streaming, or for any decision about a person — yours or anyone else's.",
          "It is not an IQ test. Its scores are not comparable to, and are not equivalent to, the scores of a standardized intelligence test.",
          "If you have a real concern about attention, memory or learning, the place to take it is a qualified professional — not this page and not its numbers.",
        ],
      },
      {
        h: "Scores are rough estimates",
        p: [
          "Every score is a rough estimate built from a limited number of items, and it fluctuates between sessions with sleep, focus and which items you happened to get.",
          "Do not treat any number here as a fixed value for your ability, and do not build a decision on it.",
        ],
      },
      {
        h: "Acceptable use",
        p: [
          "Do not try to manipulate the leaderboard, submit results you did not earn, or exploit any flaw to raise your standing.",
          "No automated scraping, and no running bots against the platform.",
          "No abusive, obscene or impersonating display names — we may remove any such name without notice.",
        ],
      },
      {
        h: "Accounts and the service",
        p: [
          "We may suspend or remove any account used for abuse, manipulation, or harm to other users.",
          "The service may change or stop entirely at any time. If something here matters to you, keep your own copy of it outside the platform.",
        ],
      },
      {
        h: "Content",
        p: [
          "The questions and exercises on the platform are original and hand-authored for this project. They are not copied from any published standardized test.",
          "Practice generated by AI at your request is produced for you on the spot and is likewise not drawn from any existing test.",
        ],
      },
      {
        h: "Plain language, no legal fog",
        p: [
          "These terms are written in ordinary language. They are not tied to a particular jurisdiction and name no address or legal entity, because at this stage they do not need to.",
          "If you have an objection, a complaint or a problem, write to us first and we will try to settle it directly and in good faith.",
          "These terms may change as the platform develops; the “last updated” date at the top of the page shows when they last did.",
        ],
      },
    ],
    contactH: "Contact",
    contactP: "For any question about these terms, or any complaint, write to:",
  },
};

export default function TermsPage() {
  const { locale } = useI18n();
  const c = CONTENT[locale];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <header className="mb-8 text-start">
        <h1 className="text-2xl font-bold md:text-3xl">{c.title}</h1>
        <p className="mt-2 text-xs text-fg-faint">
          {c.updatedLabel}: {c.updated}
        </p>
        {c.intro.map((p, i) => (
          <p key={i} className="mt-4 text-sm leading-relaxed text-fg-muted">
            {p}
          </p>
        ))}
      </header>

      <div className="grid gap-4">
        {c.sections.map((s) => (
          <Card
            key={s.h}
            className={cn(
              "p-5 text-start md:p-6",
              s.tone === "warn" && "border-warning/40 bg-warning/5",
            )}
          >
            <h2 className="mb-3 text-lg font-bold">
              {s.tone === "warn" && <span className="me-2">⚠️</span>}
              {s.h}
            </h2>
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
      </div>

      <nav className="mt-8 flex flex-wrap gap-4 text-sm text-fg-faint">
        <Link href="/privacy" className="underline underline-offset-4 hover:text-fg">
          {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
        </Link>
        <Link href="/about" className="underline underline-offset-4 hover:text-fg">
          {locale === "ar" ? "عن المنصّة" : "About"}
        </Link>
      </nav>
    </div>
  );
}
