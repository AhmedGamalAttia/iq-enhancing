# دليل النشر والإعداد — Supabase + Gemini + Vercel

> الهدف: نجهّز المنصّة للنشر الحيّ مجاناً. كل الخطوات على الطبقة المجانية.

---

## الخطوة ١ — Supabase (الحسابات + المزامنة)

1. ادخل [supabase.com](https://supabase.com) → **New project** (اختر اسماً وكلمة مرور لقاعدة البيانات، والمنطقة الأقرب).
2. بعد جهوز المشروع: **Project Settings → API**، وانسخ:
   - **Project URL** → للمتغيّر `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → للمتغيّر `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   > ملاحظة: مفتاح `anon` مُصمّم ليكون علنياً في المتصفح، وRLS هو اللي بيحمي البيانات. **لا تستخدم مفتاح `service_role` هنا إطلاقاً.**
3. **SQL Editor → New query** → الصق كامل محتوى `web/supabase/schema.sql` → **Run**. (ينشئ جدولي `diagnostic_results` و`review_cards` مع سياسات RLS.)
4. (للتجربة السريعة) **Authentication → Sign In / Providers → Email**: تقدر تعطّل **Confirm email** مؤقتاً عشان تسجّل دخول من غير تأكيد بريد.

## الخطوة ٢ — مفتاح Gemini (مميزات الـ AI)

1. ادخل [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) بحساب Google.
2. **Create API key** → انسخه → للمتغيّر `GEMINI_API_KEY`.

## الخطوة ٣ — الإعداد المحلي والتحقّق

1. افتح `web/.env.local` واملأ الأربع قيم (Supabase URL + anon، و`GEMINI_API_KEY`).
2. تحقّق:
   ```bash
   cd web
   pnpm check-setup
   ```
   المفروض تشوف ✅ للجداول ولمفتاح Gemini. لو ظهر «table missing» يبقى لسه ما شغّلتش `schema.sql`.
3. جرّب محلياً: `pnpm dev` ← سجّل حساب من `/login`، اعمل تقييم، وتأكّد إنه اتحفظ.

## الخطوة ٤ — رفع الكود على GitHub

```bash
cd "F:/General Projects/IQ-Enhancing"
git init
git add .
git commit -m "Initial commit: bilingual cognitive-training MVP"
# أنشئ ريبو على GitHub ثم:
git remote add origin <REPO_URL>
git push -u origin main
```
> `.env.local` **مش هيترفع** (متجاهَل تلقائياً)، فالسيكرتس آمنة.

## الخطوة ٥ — النشر على Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → استورد الريبو.
2. **Root Directory = `web`** (مهم جداً — المشروع في مجلد فرعي).
3. Framework: Next.js (يتعرّف تلقائياً). اترك أوامر البناء الافتراضية.
4. **Environment Variables** — أضِف نفس المفاتيح:
   | المتغيّر | القيمة |
   |----------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | من Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | من Supabase |
   | `AI_PROVIDER` | `gemini` |
   | `GEMINI_API_KEY` | من Google AI Studio |
5. **Deploy**. بعد النشر هتاخد رابط زي `https://<اسم-المشروع>.vercel.app`.

## الخطوة ٦ — ربط النطاق بـ Supabase Auth

في **Supabase → Authentication → URL Configuration**:
- **Site URL**: رابط Vercel بتاعك.
- **Redirect URLs**: أضِف رابط Vercel (وكذلك `http://localhost:3000` للتطوير).

هذا يضمن أن تسجيل الدخول وروابط التأكيد تعمل من النطاق الحيّ.

---

## ملاحظات
- المتغيّرات اللي تبدأ بـ `NEXT_PUBLIC_` تظهر في المتصفح (آمنة: URL + anon key). أمّا `GEMINI_API_KEY` فيبقى **على الخادم فقط** (بدون `NEXT_PUBLIC_`).
- لو غيّرت متغيّرات البيئة على Vercel، اعمل **Redeploy** عشان تسري.
- للتحوّل لـ Claude API لاحقاً: غيّر `AI_PROVIDER=anthropic` وأضِف `ANTHROPIC_API_KEY` — بدون أي تعديل في الكود.
