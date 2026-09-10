// Provider-agnostic AI interface. The rest of the app depends only on this
// contract, so switching from a free provider (Gemini/Groq) to Claude API
// later is a one-line change in the factory — no business logic rewrite.

export interface GenerateOptions {
  system?: string;
  prompt: string;
  /** Ask the model to return strict JSON. */
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  readonly name: string;
  generate(opts: GenerateOptions): Promise<string>;
}

export class AIError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AIError";
  }
}
