# منصّة تنمية القدرات المعرفية — تطبيق الويب

منصّة قائمة على الأدلّة العلمية لتقييم وتطوير القدرات المعرفية: تقييم تشخيصي
تكيّفي، مسار تطوير مخصّص، وتدريب بالتكرار المتباعد (FSRS) مع مساعدة الذكاء
الاصطناعي (اختياري).

> جزء من مشروع `IQ-Enhancing`. راجع `../docs/PLAN.md` للرؤية الكاملة وخارطة الطريق.

## التقنيات

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (نظام تصميم RTL بالعربية)
- **Supabase** — الحسابات والمزامنة (اختياري؛ بدونها يعمل بوضع الضيف)
- **ts-fsrs** — جدولة التكرار المتباعد
- طبقة **AI adapter** — Gemini / Groq / Anthropic (قابلة للتبديل)

## التشغيل محلياً

```bash
pnpm install
cp .env.example .env.local   # (اختياري) املأ مفاتيح Supabase و AI
pnpm dev
```

ثم افتح http://localhost:3000

يعمل التطبيق فوراً **بدون أي مفاتيح** في وضع الضيف (يُحفظ التقدّم على المتصفح).

## تفعيل الحسابات والمزامنة (Supabase)

1. أنشئ مشروعاً مجانياً على [supabase.com](https://supabase.com).
2. من **Project Settings → API** انسخ `Project URL` و `anon public key` إلى `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. من **SQL Editor** شغّل محتوى `supabase/schema.sql` لإنشاء الجداول وسياسات RLS.
4. (للتجربة السريعة) من **Authentication → Providers → Email** يمكنك إيقاف تأكيد
   البريد مؤقتاً.

## تفعيل الذكاء الاصطناعي (اختياري)

أضف في `.env.local`:

```
AI_PROVIDER=gemini
GEMINI_API_KEY=...        # مجاني من https://aistudio.google.com/app/apikey
```

المفاتيح تُقرأ من الخادم فقط ولا تصل للمتصفح أبداً. تظهر ميزات الـ AI (الشرح
الإضافي وتوليد التمارين) تلقائياً عند توفّر مفتاح، وتختفي بأمان بدونه.

## النشر على Vercel (مجاناً)

- استورد المستودع في Vercel واضبط **Root Directory = `web`**.
- أضف نفس متغيّرات البيئة في إعدادات المشروع على Vercel.

## بنية المشروع

```
src/
  app/
    page.tsx              صفحة الهبوط
    diagnostic/           التقييم التشخيصي التكيّفي
    results/              لوحة النتائج والتوصيات
    practice/             التدريب بالتكرار المتباعد + توليد AI
    login/                الحسابات (Supabase)
    api/explain/          شرح مخصّص بالـ AI
    api/generate-practice/  توليد أسئلة بالـ AI
  components/             مكوّنات الواجهة (UI, الهيدر, بطاقة السؤال)
  data/                   المحاور + بنك الأسئلة المكتوب يدوياً
  lib/
    diagnostic.ts         محرّك التقييم التكيّفي (Elo/IRT مبسّط)
    fsrs.ts               غلاف التكرار المتباعد
    data.ts               طبقة الحفظ (Supabase أو localStorage)
    ai/                   طبقة الذكاء الاصطناعي القابلة للتبديل
    supabase/             عملاء Supabase (متصفح/خادم/middleware)
supabase/schema.sql       جداول قاعدة البيانات + RLS
```
