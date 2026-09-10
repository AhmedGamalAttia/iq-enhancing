import { AIError, type AIProvider, type GenerateOptions } from "./provider";

// Groq via its OpenAI-compatible Chat Completions endpoint (fast, free tier).
export class GroqProvider implements AIProvider {
  readonly name = "groq";

  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  ) {}

  async generate(opts: GenerateOptions): Promise<string> {
    const messages: { role: string; content: string }[] = [];
    if (opts.system) messages.push({ role: "system", content: opts.system });
    messages.push({ role: "user", content: opts.prompt });

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: opts.temperature ?? 0.7,
          max_tokens: opts.maxTokens ?? 1024,
          ...(opts.json ? { response_format: { type: "json_object" } } : {}),
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      throw new AIError(`Groq request failed: ${detail}`, res.status);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new AIError("Groq returned an empty response");
    return text;
  }
}
