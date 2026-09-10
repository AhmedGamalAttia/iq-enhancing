import { NextResponse } from "next/server";
import { AIError, getAIProvider } from "@/lib/ai";

export const runtime = "nodejs";

// POST /api/explain
// Body: { stem, choices[], correctText, chosenText, skill, locale }
// Returns a personalized explanation of the learner's mistake, in their language.
export async function POST(req: Request) {
  const provider = getAIProvider();
  if (!provider) {
    return NextResponse.json({ available: false });
  }

  let body: {
    stem?: string;
    choices?: string[];
    correctText?: string;
    chosenText?: string;
    skill?: string;
    locale?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { stem, choices = [], correctText, chosenText } = body;
  if (!stem || !correctText) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const isEn = body.locale === "en";

  const system = isEn
    ? "You are an expert cognitive coach. Explain clearly and concisely, in simple English, why the correct answer is right; if the learner's answer is wrong, point out the flaw in their thinking; then give one general rule for similar questions. No more than 5 sentences."
    : "أنت مدرّب معرفي خبير. تشرح للمتعلّم سبب الإجابة الصحيحة بأسلوب واضح ومختصر باللغة العربية الفصحى المبسّطة، وتوضّح الخطأ في تفكيره إن أخطأ، وتعطي قاعدة عامة تنفعه في أسئلة مشابهة. لا تتجاوز ٥ جُمَل.";

  const prompt = isEn
    ? [
        `Question: ${stem}`,
        choices.length ? `Choices: ${choices.join(" | ")}` : "",
        `Correct answer: ${correctText}`,
        chosenText ? `Learner's answer: ${chosenText}` : "The learner has not answered.",
        "",
        "Explain why the correct answer is right; if the learner's answer is wrong, explain the source of the mistake; then give a short general rule.",
      ]
        .filter(Boolean)
        .join("\n")
    : [
        `السؤال: ${stem}`,
        choices.length ? `الخيارات: ${choices.join(" | ")}` : "",
        `الإجابة الصحيحة: ${correctText}`,
        chosenText ? `إجابة المتعلّم: ${chosenText}` : "لم يجب المتعلّم بعد.",
        "",
        "اشرح لماذا الإجابة الصحيحة صحيحة، وإن كانت إجابة المتعلّم خاطئة فوضّح مصدر الخطأ، ثم أعطِ قاعدة عامة قصيرة.",
      ]
        .filter(Boolean)
        .join("\n");

  try {
    const explanation = await provider.generate({
      system,
      prompt,
      temperature: 0.5,
      maxTokens: 400,
    });
    return NextResponse.json({ available: true, explanation: explanation.trim() });
  } catch (err) {
    const status = err instanceof AIError ? err.status ?? 502 : 502;
    return NextResponse.json(
      {
        available: true,
        error: isEn
          ? "Could not generate an explanation right now."
          : "تعذّر توليد الشرح حالياً.",
      },
      { status },
    );
  }
}
