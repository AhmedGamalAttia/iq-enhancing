import type { AIProvider } from "./provider";
import { GeminiProvider } from "./gemini";
import { GroqProvider } from "./groq";
import { AnthropicProvider } from "./anthropic";

export type { AIProvider, GenerateOptions } from "./provider";
export { AIError } from "./provider";

/**
 * Returns the configured AI provider, or null when no key is set.
 * Select with AI_PROVIDER = gemini | groq | anthropic (default: gemini).
 * Keys are server-only and never exposed to the client.
 */
export function getAIProvider(): AIProvider | null {
  const choice = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();

  switch (choice) {
    case "groq":
      return process.env.GROQ_API_KEY
        ? new GroqProvider(process.env.GROQ_API_KEY)
        : null;
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY
        ? new AnthropicProvider(process.env.ANTHROPIC_API_KEY)
        : null;
    case "gemini":
    default:
      return process.env.GEMINI_API_KEY
        ? new GeminiProvider(process.env.GEMINI_API_KEY)
        : null;
  }
}

export const isAIConfigured = (): boolean => getAIProvider() !== null;
