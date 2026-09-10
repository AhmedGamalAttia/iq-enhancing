import { NextResponse } from "next/server";
import { AIError, getAIProvider } from "@/lib/ai";
import { SKILLS } from "@/data/skills";
import { getMessages } from "@/i18n/messages";
import { isLocale, type Locale } from "@/i18n/config";
import type { Question, SkillKey } from "@/lib/types";

export const runtime = "nodejs";

// POST /api/generate-practice
// Body: { skill, difficulty, count?, locale }
// Returns AI-generated practice MCQs in the requested language (hybrid content).
export async function POST(req: Request) {
  const provider = getAIProvider();
  if (!provider) {
    return NextResponse.json({ available: false });
  }

  let body: {
    skill?: SkillKey;
    difficulty?: number;
    count?: number;
    locale?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const skill = body.skill;
  if (!skill || !SKILLS[skill]) {
    return NextResponse.json({ error: "unknown skill" }, { status: 400 });
  }
  const difficulty = Math.min(5, Math.max(1, Math.round(body.difficulty ?? 3)));
  const count = Math.min(5, Math.max(1, Math.round(body.count ?? 3)));
  const locale: Locale = isLocale(body.locale) ? body.locale : "ar";
  const isEn = locale === "en";
  const meta = getMessages(locale).skills[skill];

  const system = isEn
    ? "You are a professional cognitive-assessment designer. You write original multiple-choice questions in clear English, linguistically precise, each with exactly one unambiguously correct answer, four options, and a brief explanation."
    : "أنت مصمّم اختبارات معرفية محترف. تنشئ أسئلة اختيار من متعدّد أصلية باللغة العربية الفصحى، دقيقة لغوياً وذات إجابة واحدة صحيحة لا لبس فيها. لكل سؤال أربعة خيارات وشرح موجز.";

  const prompt = isEn
    ? [
        `Create ${count} questions for the skill "${meta.name}" (${meta.tagline}).`,
        `Requested difficulty: ${difficulty} out of 5.`,
        "Return the result as JSON only, in this exact shape:",
        '{ "questions": [ { "stem": "the question", "choices": ["a","b","c","d"], "answer": 0, "explanation": "the explanation" } ] }',
        "where answer is the zero-based index of the correct choice. Add no text outside the JSON.",
      ].join("\n")
    : [
        `أنشئ ${count} أسئلة في مهارة «${meta.name}» (${meta.tagline}).`,
        `مستوى الصعوبة المطلوب: ${difficulty} من ٥.`,
        "أعِد النتيجة بصيغة JSON فقط بالشكل التالي:",
        '{ "questions": [ { "stem": "نص السؤال", "choices": ["أ","ب","ج","د"], "answer": 0, "explanation": "الشرح" } ] }',
        "حيث answer هو رقم فهرس الخيار الصحيح (يبدأ من صفر). لا تُضف أي نص خارج JSON.",
      ].join("\n");

  try {
    const raw = await provider.generate({
      system,
      prompt,
      json: true,
      temperature: 0.8,
      maxTokens: 1500,
    });

    const parsed = safeParse(raw);
    const items =
      parsed && Array.isArray(parsed.questions) ? parsed.questions : [];
    const questions: Question[] = items
      .filter(isValidGenerated)
      .slice(0, count)
      .map((q, i) => ({
        id: `ai-${skill}-${Date.now()}-${i}`,
        skill,
        difficulty: difficulty as Question["difficulty"],
        type: "mcq",
        stem: q.stem,
        choices: q.choices,
        answer: q.answer,
        explanation: q.explanation ?? "",
        source: "ai",
        locale,
      }));

    if (questions.length === 0) {
      return NextResponse.json(
        {
          available: true,
          error: isEn
            ? "Could not generate valid questions."
            : "تعذّر توليد أسئلة صالحة.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ available: true, questions });
  } catch (err) {
    const status = err instanceof AIError ? err.status ?? 502 : 502;
    return NextResponse.json(
      {
        available: true,
        error: isEn
          ? "Could not generate practice right now."
          : "تعذّر توليد التمارين حالياً.",
      },
      { status },
    );
  }
}

function safeParse(text: string): { questions?: unknown[] } | null {
  try {
    return JSON.parse(text);
  } catch {
    // Some models wrap JSON in prose or fences — extract the first {...}.
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function isValidGenerated(
  q: unknown,
): q is { stem: string; choices: string[]; answer: number; explanation?: string } {
  if (typeof q !== "object" || q === null) return false;
  const obj = q as Record<string, unknown>;
  return (
    typeof obj.stem === "string" &&
    Array.isArray(obj.choices) &&
    obj.choices.length >= 2 &&
    obj.choices.every((c) => typeof c === "string") &&
    typeof obj.answer === "number" &&
    obj.answer >= 0 &&
    obj.answer < (obj.choices as string[]).length
  );
}
