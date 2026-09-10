"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import { Card, cn } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

// Content lives here rather than in `src/i18n/messages.ts` so this page can be
// edited without touching the shared dictionary. Every claim below is meant to
// describe what the app actually does — if the app changes, change this too.

interface Section {
  h: string;
  p: readonly string[];
  /** Renders the section as a highlighted warning instead of a plain block. */
  tone?: "warn";
}

interface PrivacyContent {
  title: string;
  updatedLabel: string;
  updated: string;
  intro: readonly string[];
  sections: readonly Section[];
  contactH: string;
  contactP: string;
}

const CONTENT: Record<Locale, PrivacyContent> = {
  ar: {
    title: "سياسة الخصوصية",
    updatedLabel: "آخر تحديث",
    updated: "١١ سبتمبر ٢٠٢٦",
    intro: [
      "هذه الصفحة تشرح بدقّة ما الذي يُجمَع عند استخدام المنصّة، وأين يُخزَّن، ومن يستطيع رؤيته. كُتبت لتُقرأ لا لتُتخطّى، ولذلك هي قصيرة وبلا حشو قانوني.",
    ],
    sections: [
      {
        h: "أين تعمل المنصّة",
        p: [
          "الموقع مُستضاف على Vercel، والحسابات وقاعدة البيانات على Supabase. هاتان الخدمتان تعالجان البيانات نيابةً عنّا لتشغيل الموقع، ولكلٍّ منهما سياسة خصوصية خاصة بها.",
        ],
      },
      {
        h: "إذا أنشأت حساباً",
        p: [
          "نجمع بريدك الإلكتروني وكلمة مرور. كلمة المرور تُخزَّن مُجزّأة (hashed) لدى Supabase؛ لا نراها ولا نحتفظ بها نحن في أي صورة، ولا يمكن استرجاع نصّها الأصلي.",
        ],
      },
      {
        h: "الحسابات المجهولة",
        p: [
          "عند إرسال نتيجتك في تحدّي اليوم، يُنشَأ لك حساب مجهول تلقائياً في Supabase حتى تتمكّن من الظهور في لوحة الصدارة والاحتفاظ بسجلّك.",
          "لا يُطلَب ولا يُجمَع بريد إلكتروني في هذه الحالة، ولا أي بيان يعرّف بشخصك.",
        ],
      },
      {
        h: "ما نحفظه لكل مستخدم",
        p: [
          "نتائج التقييم: التقدير الخاص بكل بُعد معرفي، والأسئلة التي أجبت عنها، وهل كانت كل إجابة صحيحة أم لا، والزمن الذي استغرقته في كل سؤال.",
          "بيانات جدولة المراجعة المتباعدة، أي موعد ظهور كل بطاقة أمامك مرّة أخرى.",
          "مشاركات تحدّي اليوم: الاسم المعروض الذي كتبته، وعدد الإجابات الصحيحة، والزمن المستغرق، والنتيجة، والتاريخ.",
        ],
      },
      {
        h: "لوحة الصدارة عامّة",
        tone: "warn",
        p: [
          "لوحة صدارة تحدّي اليوم مرئيّة للجميع. يظهر فيها الاسم المعروض الذي كتبته، ومعه أربعة أحرف من معرّف حسابك تُستخدَم للتمييز بين المتشابهين في الاسم.",
          "لذلك: لا تكتب اسمك الحقيقي إن كنت لا تريده علنياً. اختر لقباً. الاسم الذي تكتبه يراه أي زائر للموقع.",
        ],
      },
      {
        h: "ما يبقى في متصفحك وحده",
        p: [
          "الأشياء التالية تُحفَظ في ذاكرة المتصفح (localStorage) على جهازك ولا تصل إلينا أبداً: تقدّمك كزائر بلا حساب، والأوسمة التي جمعتها، وأفضل نتيجة لك في تمرين n-back، والاسم المعروض المحفوظ، وأي تقييم بدأته ولم تُنهِه.",
          "نستخدم كذلك ملف تعريف ارتباط باسم cog_locale لتذكّر اللغة التي اخترتها. وإذا سجّلت الدخول، تضع Supabase ملفات تعريف ارتباط خاصة بالجلسة لإبقائك مسجّلاً. لا توجد ملفات تعريف ارتباط أخرى.",
        ],
      },
      {
        h: "مزايا الذكاء الاصطناعي",
        p: [
          "عند ضغطك على «اشرح بالذكاء الاصطناعي» أو «ولّد تمريناً»، يُرسَل نص السؤال والإجابة التي اخترتها إلى واجهة Gemini من Google لتوليد الشرح أو التمرين.",
          "لا يُرسَل مع الطلب أي معرّف حساب، ولا بريد إلكتروني، ولا اسم. ولا يحدث هذا إلا حين تضغط الزرّ بنفسك.",
        ],
      },
      {
        h: "حدّ الاستخدام اليومي",
        p: [
          "نحتفظ بعدّاد يومي لعدد طلبات الذكاء الاصطناعي حتى لا تُستنزَف الحصّة المجانية. العدّاد مربوط بمعرّف تقريبي — حسابك إن كنت مسجّل الدخول، أو معرّف شبكة عام إن لم تكن — وهو رقم فقط، ولا يُستخدَم لتتبّعك ولا لبناء ملف عنك، ويُعاد ضبطه كل يوم.",
        ],
      },
      {
        h: "إحصاءات استخدام مجهولة",
        p: [
          "نحصي أحداثاً عامة مثل «بدأ تقييماً» و«أنهى تقييماً» لنعرف ما إذا كانت المنصّة تعمل فعلاً وأين يتعثّر الناس. هذه أعداد مجرّدة لا يُرفَق بها أي معرّف مستخدم، ولا يمكن ردّها إلى شخص بعينه.",
        ],
      },
      {
        h: "لا إعلانات ولا متتبّعات",
        p: [
          "لا توجد إعلانات على المنصّة، ولا أدوات تتبّع من أطراف ثالثة. لا نبيع بياناتك ولا نشاركها مع أحد لأغراض تسويقية.",
        ],
      },
      {
        h: "حذف بياناتك",
        p: [
          "أرسل رسالة إلى عنوان التواصل في آخر هذه الصفحة، من البريد المرتبط بحسابك، وسنحذف الحساب وكل البيانات المرتبطة به.",
          "ونقولها بوضوح: لا يوجد حتى الآن زرّ حذف ذاتي داخل المنصّة. الحذف يتم يدوياً عبر البريد، وهذا نقص نعرفه ونعمل على سدّه.",
        ],
      },
      {
        h: "الأطفال",
        p: [
          "المنصّة صالحة للاستخدام من الأطفال الأكبر سناً. إن كان عمرك أقلّ من سنّ الموافقة الرقمية في بلدك، فاستخدمها بصحبة أحد الوالدين أو وليّ الأمر.",
        ],
      },
      {
        h: "تغييرات على هذه السياسة",
        p: [
          "قد تتغيّر هذه السياسة مع تطوّر المنصّة. تاريخ «آخر تحديث» في أعلى الصفحة يوضّح آخر مرّة تغيّرت فيها، فراجعه من حين لآخر.",
        ],
      },
    ],
    contactH: "التواصل",
    contactP: "لأي سؤال عن الخصوصية، أو لطلب حذف بياناتك، راسلنا على:",
  },
  en: {
    title: "Privacy Policy",
    updatedLabel: "Last updated",
    updated: "11 September 2026",
    intro: [
      "This page explains exactly what is collected when you use the platform, where it is stored, and who can see it. It is written to be read, not skipped — so it is short and free of legal padding.",
    ],
    sections: [
      {
        h: "Where the platform runs",
        p: [
          "The site is hosted on Vercel. Accounts and the database are on Supabase. Both process data on our behalf in order to run the site, and each has its own privacy policy.",
        ],
      },
      {
        h: "If you create an account",
        p: [
          "We collect your email address and a password. The password is stored hashed by Supabase — we never see it, never store it ourselves, and it cannot be turned back into the original text.",
        ],
      },
      {
        h: "Anonymous accounts",
        p: [
          "When you post a daily-challenge score, an anonymous Supabase account is created for you automatically so that you can appear on the leaderboard and keep your own history.",
          "No email address is asked for or collected in that case, and nothing that identifies you personally.",
        ],
      },
      {
        h: "What we store for each user",
        p: [
          "Assessment results: the estimate for each cognitive dimension, which items you answered, whether each answer was correct, and how long you took on each one.",
          "Spaced-repetition scheduling data — when each card is due to come back to you.",
          "Daily-challenge entries: the display name you typed, the number correct, the time taken, the score, and the date.",
        ],
      },
      {
        h: "The leaderboard is public",
        tone: "warn",
        p: [
          "The daily-challenge leaderboard is visible to everyone. It shows the display name you typed, together with a 4-character fragment of your account id used to tell identical names apart.",
          "So: do not type your real name if you do not want it public. Pick a handle. Whatever you type there can be read by any visitor to the site.",
        ],
      },
      {
        h: "What stays in your browser only",
        p: [
          "The following is kept in your browser's localStorage, on your own device, and never reaches us: your progress as a guest without an account, the badges you have earned, your best n-back score, the saved display name, and any assessment you started but did not finish.",
          "We also use a cookie named cog_locale to remember the language you chose. If you sign in, Supabase sets its own session cookies to keep you signed in. There are no other cookies.",
        ],
      },
      {
        h: "AI features",
        p: [
          "When you press “explain with AI” or “generate practice”, the question text and the answer you chose are sent to Google's Gemini API to produce the explanation or the exercise.",
          "No account identifier, email address or name is sent with the request. It happens only when you press the button yourself.",
        ],
      },
      {
        h: "Daily usage limit",
        p: [
          "We keep a per-day counter of AI requests so the free quota is not abused. The counter is keyed to a coarse identifier — your account if you are signed in, otherwise a general network identifier. It is only a number, it is reset every day, and it is not used to track you or build a profile.",
        ],
      },
      {
        h: "Anonymous usage analytics",
        p: [
          "We count generic events such as “assessment started” and “assessment finished” so we can tell whether the platform actually works and where people get stuck. These are bare counts with no user identifier attached, and they cannot be traced back to a person.",
        ],
      },
      {
        h: "No ads, no trackers",
        p: [
          "There is no advertising on the platform and no third-party tracking. We do not sell your data and do not share it with anyone for marketing.",
        ],
      },
      {
        h: "Deleting your data",
        p: [
          "Email the contact address at the bottom of this page from the address linked to your account, and we will delete the account and everything stored with it.",
          "Plainly: there is not yet a self-service delete button in the app. Deletion is done by hand over email. We know that is a gap and we intend to close it.",
        ],
      },
      {
        h: "Children",
        p: [
          "The platform is usable by older children. If you are under the age of digital consent where you live, use it together with a parent or guardian.",
        ],
      },
      {
        h: "Changes to this policy",
        p: [
          "This policy may change as the platform develops. The “last updated” date at the top of the page shows when it last did, so check back from time to time.",
        ],
      },
    ],
    contactH: "Contact",
    contactP:
      "For any question about privacy, or to ask for your data to be deleted, write to:",
  },
};

export default function PrivacyPage() {
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
        <Link href="/terms" className="underline underline-offset-4 hover:text-fg">
          {locale === "ar" ? "شروط الاستخدام" : "Terms of Use"}
        </Link>
        <Link href="/about" className="underline underline-offset-4 hover:text-fg">
          {locale === "ar" ? "عن المنصّة" : "About"}
        </Link>
      </nav>
    </div>
  );
}
