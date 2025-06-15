import Anthropic from "@anthropic-ai/sdk";
import type { Tool } from "@anthropic-ai/sdk/resources/index";
import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type ClaudeConfigType = Omit<MessageCreateParamsNonStreaming, "messages">;

export function createClaudeConfig(
  systemPrompt: string,
  tools: Tool[],
  options?: Partial<ClaudeConfigType>
): ClaudeConfigType {
  return {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    temperature: 0.7,
    system: systemPrompt,
    tools,
    ...options,
  };
}
