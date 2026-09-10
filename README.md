# iq-enhancing

منصّة ويب لتنمية القدرات المعرفية بطرق علمية ممنهجة — تقييم تشخيصي تكيّفي، مسار
تطوير مخصّص، وتدريب بالتكرار المتباعد (FSRS)، بدعم عربي/إنجليزي ومساعدة الذكاء
الاصطناعي.

> A bilingual (Arabic/English), evidence-based platform for developing cognitive
> abilities: an adaptive diagnostic, a personalized path, and spaced-repetition
> training, with optional AI assistance.

## البنية

```
web/     تطبيق Next.js (الكود الأساسي — انظر web/README.md)
docs/    الرؤية والخطة (PLAN.md) ودليل النشر (DEPLOY.md)
```

## التشغيل السريع

```bash
cd web
pnpm install
cp .env.example .env.local   # املأ مفاتيح Supabase و Gemini (اختياري — يعمل بوضع الضيف بدونها)
pnpm dev
```

## النشر

راجع [`docs/DEPLOY.md`](docs/DEPLOY.md) — النشر على Vercel مع **Root Directory = `web`**.

## التقنيات

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Supabase · ts-fsrs (FSRS)
· طبقة AI قابلة للتبديل (Gemini / Groq / Anthropic).
