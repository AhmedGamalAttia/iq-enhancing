import { AIError, type AIProvider, type GenerateOptions } from "./provider";

// Anthropic Claude via the Messages API. Wired up for when funding is
// available; selected by setting AI_PROVIDER=anthropic + ANTHROPIC_API_KEY.
export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";

  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
  ) {}

  async generate(opts: GenerateOptions): Promise<string> {
    const system = opts.json
      ? `${opts.system ?? ""}\nأعِد ردّاً بصيغة JSON صالحة فقط دون أي نص إضافي.`.trim()
      : opts.system;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.7,
        ...(system ? { system } : {}),
        messages: [{ role: "user", content: opts.prompt }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new AIError(`Anthropic request failed: ${detail}`, res.status);
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");
    if (!text) throw new AIError("Anthropic returned an empty response");
    return text;
  }
}
